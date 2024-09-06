/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: HyFiVe Measurements library - This library handles single measurements for one timestamp and prepares them for the transfer by MQTT
 */


#ifndef _Klassen_H
#define _Klassen_H

class Measurement{
    private:
        int ID;
        int diveID;
        float temperature;
        float raw_temperature;
        float pressure;
        float raw_pressure;
        float conductivity;
        float raw_conductivity;
        float oxygen;
        float raw_oxygen;
        
    public:
        Measurement(int id, int diveid);

        void setID(int id);
        int getID() const;

        void setDiveId(int diveid);
        int getDiveId() const;

        void setTemperature(float value);
        float getTemperature() const;

        void setRawTemperature(float raw_value);
        float getRawTemperature() const;

        void setPressure(float value);
        float getPressure() const;

        void setRawPressure(float raw_value);
        float getRawPressure() const;

        void setConductivity(float value);
        float getConductivity() const;

        void setRawConductivity(float raw_value);
        float getRawConductivity() const;

        void setOxygen(float value);
        float getOxygen() const;

        void setRawOxygen(float raw_value);
        float getRawOxygen() const;

        void prepareSD(tm *time, char* payload);
};

#endif