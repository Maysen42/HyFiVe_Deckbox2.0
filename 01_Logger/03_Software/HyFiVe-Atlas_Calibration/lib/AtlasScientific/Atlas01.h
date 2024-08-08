/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 */
 
#ifndef Atlas01_H_
#define Atlas01_H_

#define K01CALCOEFF 11         // number of calibration coefficients
class K01{
    public:
        K01();

        void init(TwoWire &wirePort);

        void measure();

        void calibrate(int i);

        int read();

        void k01sleep();

        const char* getVersion();

        const char* getCalibration();

        float getConductivity();

    private:
        void sendCommand();

        void readCalibration();

        TwoWire * _i2cPort;

        char commandToSend[10];

        char version[10];

        char cal[K01CALCOEFF][12];

        float val;

};

#endif