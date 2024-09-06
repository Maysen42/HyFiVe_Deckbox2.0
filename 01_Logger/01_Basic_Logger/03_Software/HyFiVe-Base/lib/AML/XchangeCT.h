/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Interface to the CT Xchange from the manufacturer AML. This library must be checked closely and adapted to the senor in terms of the output string and frequency desired by you.
 */
 
#ifndef XCHANGECT_H_
#define XCHANGECT_H_

class XchangeCT{
    public:
        XchangeCT(HardwareSerial& serial);
        void init();
        void read();
        void calculate_values();
        void set_outputrate(int ms);
        float getTemperature();
        uint32_t getTemperatureRaw();
        float getTemperatureCal();
        float getConductivity();
        uint32_t getConductivityRaw();
        float getConductivityCal();

        void setup_add();

    private:
        HardwareSerial& _ser;
        float temperature;
        float conductivity;
        uint32_t temperature_raw;
        uint32_t conductivity_raw;
        float temperature_cal;
        float conductivity_cal;
        float calT[10] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        float calC[10] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    
};

#endif