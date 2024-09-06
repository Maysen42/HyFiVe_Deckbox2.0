/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: HyFiVe logger library - This library handles information on the logger and its configuration file.
 *              Additionally connections to a deck box are established to transmitt data.
 */
 

#ifndef Logger_H
#define Logger_H_

enum LoggerState{                           // these are the states for the state machine of the logger
    inSituLogger,                           // logger is in water
    dryLoggerEmpty,                         // logger is not in water and has no files to trasmitt
    dryLoggerwFiles,                        // logger is not in water and has files to transmitt
    dryLoggerwUpdate,                       // logger is ready for an update
    testing
};


class Logger{
    public:
        Logger();
        void init(uint8_t sd_select, uint8_t sd_enable);
        void setState(uint8_t in);
        void setFileName(char *name);
        uint8_t getState();
        uint8_t getLoggerId();
        uint32_t getDeploymentId();

        void saveMeasurement(char* data_in);

        bool transmittIdToMqtt();
        bool transmittDataToMqtt();
        bool transmittStatus(uint8_t adc_pin);

        bool initWifi();

        String* getFiles(String directory);
        String getNewestFile(String directory);

        uint8_t getWetDetPeriode();
        float getWetDetThreshold();

    private:
        uint8_t sd_select;
        uint8_t sd_enable;
        uint8_t logger_id;
        uint16_t deployment_id;
        uint8_t state;

        uint8_t wet_det_periode;
        float wet_det_threshold;

        const char *header_file = "/info/header/header.json";
        char currentFile[38];
        char ssid[20];
        char password[20];

        const char* getFileName();

        int getFileNumber(File dir, int numTabs);
        String* getFileNames(File dir, int numTabs, int number, String directory);
};

bool getNtpTime(tm *timeinfo);

bool connectMqtt();

#endif