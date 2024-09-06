/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: This file contains all communication to the external devices that wake the ESP up from a sleep mode and provides the time stamp.
 */
 
#include <time.h>
#include <Wire.h>
#include <ds3231.h>

#define len 7
#define DS3231ad 0b1101000

enum timeorderDS3231{
  sec,
  min,
  hour,
  wday,
  mday,
  mon,
  year
};


String decimal(int i){
  if(i/10 > 0){
    return String(i);
  }else{
    return "0" + String(i);
  }
}

int toHex(int i){
  return ((i / 10) << 4) + (i % 10);
}


DS3231::DS3231(){
  
}

void DS3231::init(TwoWire &wirePort, int alarm){
  this->_i2cPort = &wirePort;

  // enable Interrup in the Adress 0x0E for timer
  _i2cPort->beginTransmission(DS3231ad);   // begin writing to RTC
  _i2cPort->write(0x0E);                      // write to register 0x0E
  int send = 0b00011101;                   // EOSC = 0, BBSQW = 0, CONV = 0, RS2 = RS1 = 1, INT = 1, A2= 0, A1 = 1
  _i2cPort->write(send);
  _i2cPort->endTransmission();

  tm time;
  this->setRtcAlarm(&time, alarm);     // set inital timer to interrupt every second
}

void DS3231::setRtcTime(tm *time){
  // Routine to get Time from Internet?
  _i2cPort->beginTransmission(DS3231ad);   // begin writing to RTC
  _i2cPort->write(0x00);                      // select adress 0x00 wo write to which contains seconds
  _i2cPort->write(toHex(time->tm_sec));                      // write  seconds
  _i2cPort->write(toHex(time->tm_min));                      // write x minutes to minute register
  _i2cPort->write(toHex(time->tm_hour));                     // writes x hours to the hour register
  _i2cPort->write(toHex(time->tm_wday));                     // day of the week
  _i2cPort->write(toHex(time->tm_mday));                     // day of the month
  _i2cPort->write(toHex(time->tm_mon + 1));                      // month
  _i2cPort->write(toHex(time->tm_year));                     // year 
  _i2cPort->endTransmission();
}

void DS3231::setRtcAlarm(tm *time, int alarm){
  // uses Alarm 1 of the DS3231
  // First test to get an Alarm every second
  setAlarmType(alarm);
  _i2cPort->beginTransmission(DS3231ad);       // begin writing to RTC
  _i2cPort->write(0x07);                       // select adress 0x06 wo write to which contains the alarm 1
  _i2cPort->write((this->A1M1 << 7) + toHex(time->tm_sec));                 // sets A1M1
  _i2cPort->write((this->A1M2 << 7) + toHex(time->tm_min));                 // sets A1M2
  _i2cPort->write((this->A1M3 << 7));                 // sets A1M3
  _i2cPort->write((this->A1M4 << 7));                 // sets A1M4
  _i2cPort->endTransmission();
}

void DS3231::getRtcTime(tm *time){
  _i2cPort->beginTransmission(DS3231ad);   // begin writing to RTC
  _i2cPort->write(0x00);
  _i2cPort->endTransmission();
  _i2cPort->requestFrom(DS3231ad, len);

  for (int i = 0; i < len; i++){
    int t = _i2cPort->read();
    t = (t >> 4)*10 + (t & 0b00001111);
    switch(i){
    case sec:
      time->tm_sec = t;
      break;
    case min:
      time->tm_min = t;
      break;
    case hour:
      time->tm_hour = t;
      break;
    case wday:
      time->tm_wday = t;
      break;
    case mday:
      time->tm_mday = t;
      break;
    case mon:
      time->tm_mon = t;
      break;
    case year:
      time->tm_year = t;
      break;
    }
  } 
}

void DS3231::resetRtcAlarm(){
  _i2cPort->beginTransmission(DS3231ad);   // begin writing to RTC
  _i2cPort->write(0x0F);        // select the status register
  _i2cPort->endTransmission();
  _i2cPort->requestFrom(DS3231ad, 1);  //read out the status register
  int reg = _i2cPort->read();
  
  reg &= 0b1111100;                             // set the last bit A1F to 0, other stay the same
  _i2cPort->beginTransmission(DS3231ad + 0);   // begin writing to RTC and set the bits correct
  _i2cPort->write(0x0F);
  _i2cPort->write(reg);
  _i2cPort->endTransmission();
}

void DS3231::setAlarmType(int alarm){
  switch (alarm){
    case every_sec:
      this->A1M1 = 1;               // every minute
      this->A1M2 = 1;
      this->A1M3 = 1;
      this->A1M4 = 1;
      break;
    
    case every_min:
      this->A1M1 = 0;               // every minute
      this->A1M2 = 1;
      this->A1M3 = 1;
      this->A1M4 = 1;
      break;

    case every_hour:
      this->A1M1 = 0;               // every minute
      this->A1M2 = 0;
      this->A1M3 = 1;
      this->A1M4 = 1;
    }
}

