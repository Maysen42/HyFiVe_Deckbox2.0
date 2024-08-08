/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/MathisHyFiVe/HyFiVe>, <https://hyfive.info>
 *
 * Description:
 */

/* Blue Robotics Arduino Keller LD Pressure/Temperature Sensor Library
----------------------------------------------------------------------
 
Title: Blue Robotics Arduino Keller LD Pressure/Temperature Sensor Library

Description: This library provides utilities to communicate with and to
read data from the Keller 4LD - 9LD pressure/temperature sensors.

Authors: Rustom Jehangir, Blue Robotics Inc.

-------------------------------
The MIT License (MIT)

Copyright (c) 2017 Blue Robotics Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-------------------------------*/ 
 
#include <Wire.h>
#include "KellerLD.h"

#define LD_ADDR                     0x40
#define LD_REQUEST                  0xAC
#define LD_CUST_ID0                 0x00
#define LD_CUST_ID1                 0x01
#define LD_SCALING0                 0x12
#define LD_SCALING1                 0x13
#define LD_SCALING2                 0x14
#define LD_SCALING3                 0x15
#define LD_SCALING4                 0x16

KellerLD::KellerLD() {
	fluidDensity = 1029;
}

void KellerLD::init(TwoWire &wirePort) {
	// Request memory map information
	this->_i2cPort = &wirePort;
	cust_id0 = readMemoryMap(LD_CUST_ID0);
	cust_id1 = readMemoryMap(LD_CUST_ID1);

	code = (uint32_t(cust_id1) << 16) | cust_id0;
	equipment = cust_id0 >> 10;
	place = cust_id0 & 0b000000111111111;
	file = cust_id1;

	uint16_t scaling0;
	scaling0 = readMemoryMap(LD_SCALING0);

	mode = scaling0 & 0b00000011;
	year = scaling0 >> 11;
	month = (scaling0 & 0b0000011110000000) >> 7;
	day = (scaling0 & 0b0000000001111100) >> 2;
	
	// handle P-mode pressure offset (to vacuum pressure)

	if (mode == 0) { 
		// PA mode, Vented Gauge. Zero at atmospheric pressure
		P_mode = 1.01325;
	} else if (mode == 1) {
		// PR mode, Sealed Gauge. Zero at 1.0 bar
		P_mode = 1.0;
	} else {
		// PAA mode, Absolute. Zero at vacuum
		// (or undefined mode)
		P_mode = 0;
	}

	uint32_t scaling12 = (uint32_t(readMemoryMap(LD_SCALING1)) << 16) | readMemoryMap(LD_SCALING2);

	P_min = *reinterpret_cast<float*>(&scaling12);

	uint32_t scaling34 = (uint32_t(readMemoryMap(LD_SCALING3)) << 16) | readMemoryMap(LD_SCALING4);

	P_max = *reinterpret_cast<float*>(&scaling34);

	setFluidDensity(1029);
	Serial.println("Pressure sensor initialized");
}

void KellerLD::setFluidDensity(float density) {
	fluidDensity = density;
}

void KellerLD::read() {
	uint8_t status;

	_i2cPort->beginTransmission(LD_ADDR);
	_i2cPort->write(LD_REQUEST);
	_i2cPort->endTransmission();

	delay(9); // Max conversion time per datasheet

 	_i2cPort->requestFrom(LD_ADDR,5);
	status = _i2cPort->read();
	P = (_i2cPort->read() << 8) | _i2cPort->read();
	uint16_t T = (_i2cPort->read() << 8) | _i2cPort->read();
	
	P_bar = (float(P)-16384)*(P_max-P_min)/32768 + P_min + P_mode;
	T_degc = ((T>>4)-24)*0.05-50;
}

uint16_t KellerLD::readMemoryMap(uint8_t mtp_address) {
	uint8_t status;

	_i2cPort->beginTransmission(LD_ADDR);
	_i2cPort->write(mtp_address);
	_i2cPort->endTransmission();

	delay(1); // allow for response to come in

	_i2cPort->requestFrom(LD_ADDR,3);
	status = _i2cPort->read();
	return ((_i2cPort->read() << 8) | _i2cPort->read());
}

bool KellerLD::status() {
	if (equipment <= 62 ) {
		return true;
	} else {
		return false;
	}
}

float KellerLD::range() {
	return P_max-P_min;
}

float KellerLD::getPressure(float conversion) {
	return P_bar*1000.0f*conversion;
}

float KellerLD::temperature() {
	return T_degc;
}

float KellerLD::depth() {
	return (getPressure(KellerLD::Pa)-101325)/(fluidDensity*9.80665);
}

float KellerLD::altitude() {
	return (1-pow((getPressure()/1013.25),0.190284))*145366.45*.3048;
}

bool KellerLD::isInitialized() {
	return (cust_id0 >> 10) != 63; // If not connected, equipment code == 63
}
