/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Interface to the tranform Uart to RS485 with send and receive routines for the IC THVD1426. For this timing is essential and can lead to mistakes
 */
 
#include <Wire.h>
#include <HardwareSerial.h>
#include "Microe6Click.h"
#include "Arduino.h"


#define OxyBasead           0x01
#define ReadHolding         0x03
#define ReadInput           0x04
#define WriteRegs           0x10
#define FirmwareVerReg      0x0407
#define FirmwareVerLen      0x08

Microe6Click::Microe6Click():_ser(Serial2){

}

void Microe6Click::init(uint8_t de, uint8_t re){
    this->de485 = de;                   // assign pin in hardware
    this->re485 = re;                   // assign pin in hardware
    this->setOff();                     // off for low power
}

void Microe6Click::setOff(){
    digitalWrite(this->re485, true);
    digitalWrite(this->de485, false);
}

void Microe6Click::setReceive(){                // set pins to receive data
    digitalWrite(this->re485, false);
    digitalWrite(this->de485, false);
}

void Microe6Click::setTransmitt(){              // set pins to send data
    digitalWrite(this->re485, true);
    digitalWrite(this->de485, true);
}

// send out command tosend with length ltosend and store reply in out
void Microe6Click::readRegister(uint8_t *tosend, uint8_t ltosend, uint8_t *out, short len){
    this->setTransmitt();     // enable transmission
    for(int i = 0; i < ltosend; i++){
        Serial2.write(tosend[i]);         // send out
    }

    delay(5);               // wait till everything is sent out
    setReceive();
    Serial2.readBytes(out, len);      //receive
    setOff();                       // disable and save power
}

void Microe6Click::writeRegister(uint8_t *tosend, uint8_t ltosend, uint8_t *out, short len){
     setTransmitt();     // enable transmission

    for(int i = 0; i < ltosend; i++){
        _ser.write(tosend[i]);         // send out
    }

    delay(50);               // wait till everything is sent out
    setReceive();
    _ser.readBytes(out, len);      //receive
    setOff();                       // disable and save power
}