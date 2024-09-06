/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Interface to the Atlas Scientific conductivity probes. Make sure to configure the correct probe type and calibreate the sensor
 */
 
#include "Arduino.h"
#include <Wire.h>
#include "string.h"
#include "Atlas01.h"

#define address 100


K01::K01(){

}

void K01::init(TwoWire &wirePort){
    _i2cPort = &wirePort; //Grab which port the user wants us to use
    delay(1000);                    // start up time

    String c = "L,1";
    strcpy(this->commandToSend, c.c_str());
    sendCommand();
    delay(300);
    //c = "K,1.0";
    //strcpy(this->commandToSend, c.c_str());
    //sendCommand();
    //delay(300);

    c = "K,?";
    strcpy(this->commandToSend, c.c_str());
    sendCommand();
    delay(600);
    _i2cPort->requestFrom(address, 7);
    _i2cPort->read();                   // first bit is allways 1, not interesting
    strcpy(this->version, _i2cPort->readString().c_str());

    // readCalibration();
}

void K01::sendCommand(){
    //pinMode(this->enablePin, HIGH);
    //_i2cPort->beginTransmission(address);
    //for(short i = 0; i < strlen(s); i++){
    //    _i2cPort->write(s[i]);
    //}
    //_i2cPort->endTransmission();
    _i2cPort->beginTransmission(address);
    for(short i = 0; i < strlen(commandToSend); i++){
        _i2cPort->write(commandToSend[i]);
    }
    _i2cPort->endTransmission();
}

void K01::readCalibration(){
    String c = "Export";
    strcpy(this->commandToSend, c.c_str());
    for(int i = 0; i < K01CALCOEFF; i++){
        sendCommand();
        delay(300);
        _i2cPort->requestFrom(address, 12);
        _i2cPort->read();
        strcpy(this->cal[i], _i2cPort->readString().c_str());
    }
}

void K01::k01sleep(){
    String c = "Sleep";
    strcpy(this->commandToSend, c.c_str());
    sendCommand();
}

const char* K01::getVersion(){
    return this->version;
}

const char* K01::getCalibration(){
    return this->cal[0];
}

float K01::getConductivity(){
    return val;
}

void K01::measure(){
    // String c = "RT," + String(t);
    String c = "R";
    strcpy(this->commandToSend, c.c_str());
    sendCommand();
}

void K01::calibrate(int i){
    String c;
    switch (i){
        case 0:
            c = "cal,clear";
            break;
        case 1:
            c = "Cal,dry";
            break;
        case 2:
            c = "Cal,low,1413";
            break;
        case 3:
            c = "Cal,high,44500";
            break;
    }
    strcpy(this->commandToSend, c.c_str());
    sendCommand();

    delay(1000);

    _i2cPort->requestFrom(address, 14);
    _i2cPort->read();
    Serial.println(_i2cPort->readString());
}

int K01::read(){
    _i2cPort->requestFrom(address, 7);
    int check = _i2cPort->read();                   // first bit is allways 1?, might be interesting to not wait for delay!!
    //val = (_i2cPort->readString()).toFloat();
    //return 1;
    val = 0;
    int potential = 0;
    int buffer;
    int data[6];
    
    
    if(check == 1){
        for(int i = 5; i >= 0; i--){
            data[i] = _i2cPort->read();
            // Serial.println(data[i]-48);
        }
        for(int i = 5; i >= 0; i--){
            buffer = data[i] - 48;
            val = val * 10;
            if(buffer == -2){                       // decimal point
                potential = 1;
                val = val / 10;                     // reverse last multiplication                   
            }else if(buffer < 0 ){                // end of data
                val = val / 10;                     // reverse last multiplication
                break;
            }else{
                val += buffer;
                if(potential >= 1){
                    potential++;
                }
            }
        }
        for(int i = 1; i < potential; i++){
            val /= 10;
        }
        val /= 1000;
        return 1;
    }else{
        return 0;
    }
}
