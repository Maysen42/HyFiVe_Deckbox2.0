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
 
#ifndef DS3231_H_
#define DS3231_H_

String decimal(int i);

enum alarms{
  every_sec,
  every_min,
  every_hour
};

class DS3231{
    public:
        DS3231();
        void init(TwoWire &wirePort, int alarm);
        void setRtcTime(tm *time);
        void setRtcAlarm(tm *time, int alarm);
        void getRtcTime(tm *time);
        void resetRtcAlarm();
    
    private:
        TwoWire * _i2cPort;
        char A1M1;
        char A1M2;
        char A1M3;
        char A1M4;
        void setAlarmType(int alarm);
};

#endif