/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Interface to the oxygen sensor "Oxybase RS485" from the manufacturer Presens in comnination with the transceiver for RS485
 */
 
 
#ifndef OxyBase_H_
#define OxyBase_H_

class OxyBase{
    public:
        OxyBase();
        void init(Microe6Click &rs, uint8_t id);
        void setMeasurementMode();
        void readMeasurementMode();
        void setOxygenUnit();
        void readOxygenUnit();
        void activateMeasurement();
        void setTemperature(float temperature);
        void readOxygen();
        uint_fast16_t getOxygen();

    private:
        void readFirmware();
        void readSerialNr();
        Microe6Click * _rs485;
        uint8_t device_id;
        uint8_t oxyval[29];
        char firmware[16];
        char serialNr[16];
        uint_fast16_t oxygen;
};

#endif