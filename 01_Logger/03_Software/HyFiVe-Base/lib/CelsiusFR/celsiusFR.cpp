/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description:
 */

/* Blue Robotics Arduino TSYS01 Temperature Sensor Library
------------------------------------------------------------
 
Title: Blue Robotics Arduino TSYS01 Temperature Sensor Library
Description: This library provides utilities to communicate with and to
read data from the Measurement Specialties TSYS01 temperature 
sensor.
Authors: Rustom Jehangir, Blue Robotics Inc.
		 Jonathan Newman, Blue Robotics Inc.
         Adam Šimko, Blue Robotics Inc.
-------------------------------
The MIT License (MIT)
Copyright (c) 2016 Blue Robotics Inc.
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
#include <celsiusFR.h>

#define TSYS01_ADDR                        0x77  
#define TSYS01_RESET                       0x1E
#define TSYS01_ADC_READ                    0x00
#define TSYS01_ADC_TEMP_CONV               0x48
#define TSYS01_PROM_READ                   0XA0

TSYS01::TSYS01() {

}

bool TSYS01::init(TwoWire &wirePort) {
	// Reset the TSYS01, per datasheet
    _i2cPort = &wirePort;
	_i2cPort->beginTransmission(TSYS01_ADDR);
	_i2cPort->write(TSYS01_RESET);
	_i2cPort->endTransmission();
	
	delay(10);
	int received_bytes = 0;
		// Read calibration values
	for ( uint8_t i = 0 ; i < 8 ; i++ ) {
		_i2cPort->beginTransmission(TSYS01_ADDR);
		_i2cPort->write(TSYS01_PROM_READ+i*2);
		_i2cPort->endTransmission();

		received_bytes += _i2cPort->requestFrom(TSYS01_ADDR,2);
		C[i] = (_i2cPort->read() << 8) | _i2cPort->read();
	}
	return received_bytes > 0;

}

void TSYS01::read() {
	
	_i2cPort->beginTransmission(TSYS01_ADDR);
	_i2cPort->write(TSYS01_ADC_TEMP_CONV);
	_i2cPort->endTransmission();
 
	delay(10); // Max conversion time per datasheet
	
	_i2cPort->beginTransmission(TSYS01_ADDR);
	_i2cPort->write(TSYS01_ADC_READ);
	_i2cPort->endTransmission();

	_i2cPort->requestFrom(TSYS01_ADDR,3);
	D1 = 0;
	D1 = _i2cPort->read();
	D1 = (D1 << 8) | _i2cPort->read();
	D1 = (D1 << 8) | _i2cPort->read();

	calculate();
}

void TSYS01::readTestCase() {
	C[0] = 0;
	C[1] = 28446;  //0xA2 K4
	C[2] = 24926;  //0XA4 k3
 	C[3] = 36016;  //0XA6 K2
	C[4] = 32791;  //0XA8 K1
	C[5] = 40781;  //0XAA K0
	C[6] = 0;
	C[7] = 0;

	D1 = 9378708.0f;
	
	adc = D1/256;

	calculate();
}

void TSYS01::calculate() {	
	adc = D1/256; 

TEMP = (-2) * float(C[1]) / 1000000000000000000000.0f * pow(adc,4) + 
        4 * float(C[2]) / 10000000000000000.0f * pow(adc,3) +
	  (-2) * float(C[3]) / 100000000000.0f * pow(adc,2) +
   	    1 * float(C[4]) / 1000000.0f * adc +
      (-1.5) * float(C[5]) / 100 ;

}

float TSYS01::getTemperature() {
	return TEMP;
}

float TSYS01::getRawTemperature(){
    return adc;
}
