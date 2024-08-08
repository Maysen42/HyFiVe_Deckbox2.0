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
 
#ifndef Microe6Click_H_
#define Microe6Click_H_

class Microe6Click{
    public:
        Microe6Click();
        
        uint8_t firmware[25];
        void init(uint8_t de, uint8_t re);
        void readRegister(uint8_t *tosend, uint8_t ltosend, uint8_t *out, short len);
        void writeRegister(uint8_t *tosend, uint8_t ltosend, uint8_t *out, short len);
        
    
    private:
        HardwareSerial& _ser;
        uint8_t de485;
        uint8_t re485;
        
        void setOff();
        void setReceive();
        void setTransmitt();
        
};

#endif