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
 
#include <Wire.h>
#include <HardwareSerial.h>
#include <SD.h>
#include <FS.h>
#include <XchangeCT.h>

XchangeCT::XchangeCT(HardwareSerial& serial) : _ser(serial){

}

void XchangeCT::init(){
    // hard code calibration coefficients
    this->calC[0] = -9.810986E-3;
    this->calC[4] = 1.740218E-5;

    this->calT[0] = -1.128306E+1;
    this->calT[1] = 1.239523E-4;
    this->calT[2] = -2.121426E-10;
    this->calT[3] = 4.595821E-16;
    this->calT[4] = -6.262543E-22;
    this->calT[5] = 4.965998E-28;
    this->calT[6] = -1.569824E-34;

    //for(int i = 0; i < 9; i++){
    //    Serial.printf("%g\n", this->calT[i]);;
    //}

    // read out calibration coefficients
    /*_ser.println();
    delay(10);
    _ser.println("disp coeff");
    for(int i = 0; i < 40; i++){
      delay(10);
      String readvalue = Serial2.readStringUntil('\n');
      //Serial.println(readvalue);
      if(readvalue.substring(0, 3) == "CA="){
        // Serial.println(readvalue.substring(3,16));
      }
    }*/
}

void XchangeCT::read(){
    while(_ser.available() > 0){
        _ser.read();                    // empty buffer
    }
    delay(200);
    _ser.readStringUntil('\n');
    int length = _ser.available();
    //Serial.println(length);
    if(length == 0){                    // mysterius error
        _ser.println();
        this->conductivity = 0;
        this->temperature = 0;
    }
    String response = _ser.readStringUntil('\r');
    //Serial.println(response);

    // This is for debugging the sensor because of strange values
    SD.begin(10);
    File myfile = SD.open("/backup/amldebug.txt", FILE_WRITE);
    delay(50);
    unsigned long size = myfile.size();     // with size it is possiple to jump to end of file and append
    myfile.seek(size);                      // go to position size in file
    myfile.println(response);                   // add line
    myfile.close();
    SD.end();
    delay(10);

    // for set oem mode, no raw values
    /*if(response.charAt(0) == ' '){
        int index = response.indexOf(" ", 2);
        String conductivity = response.substring(1,index);
      
        String temperature = response.substring(index + 1);
        this->conductivity = conductivity.toFloat();
        this->temperature = temperature.toFloat();
    }*/

    // for mux mode, raw values including calculated values
    if(response.charAt(0) == '['){
        // get calculated conductivity
        int index_start = response.indexOf("data=Cond,", 0) + 9;
        int index_stop = response.indexOf(",", index_start + 1);
        this->conductivity = response.substring(index_start + 1, index_stop).toFloat();

        // get raw conductivity
        index_start = response.indexOf("mS/cm][rawi=ADC,", 0) + 16;     // 16 is the length of the searched string
        index_stop = response.indexOf(",", index_start + 1);
        this->conductivity_raw = response.substring(index_start, index_stop).toInt();

        //get calculated temperatrue
        index_start = response.indexOf("data=TempCT,", 0) + 11;
        index_stop = response.indexOf(",", index_start + 1);
        this->temperature = response.substring(index_start + 1, index_stop).toFloat();

        // get raw temperature
        index_start = response.indexOf(",C][rawi=ADC,", 0) + 13;     // 13 is the length of the searched string
        index_stop = response.indexOf(",", index_start + 1);
        this->temperature_raw = response.substring(index_start, index_stop).toInt();
    }
}

void XchangeCT::calculate_values(){
    this->temperature_cal = this->calT[0] + this->calT[1]*this->temperature_raw + this->calT[2]*pow(this->temperature_raw, 2) + this->calT[3]*pow(this->temperature_raw, 3) + this->calT[4]*pow(this->temperature_raw, 4) + this->calT[5]*pow(this->temperature_raw, 5) + this->calT[6]*pow(this->temperature_raw, 6);
    this->conductivity_cal = (this->calC[0] + this->calC[4]*this->conductivity_raw) * 42.914;
}

void XchangeCT::set_outputrate(int ms){
    _ser.println();
    delay(100);
    String tosend = "SET OUTPUTRATE " + String(ms) + "ms";
    _ser.println(tosend);
}

float XchangeCT::getTemperature(){
    return this->temperature;
}

uint32_t XchangeCT::getTemperatureRaw(){
    return this->temperature_raw;
}

float XchangeCT::getTemperatureCal(){
    return this->temperature_cal;
}

float XchangeCT::getConductivity(){
    return this->conductivity;
}

uint32_t XchangeCT::getConductivityRaw(){
    return this->conductivity_raw;
}

float XchangeCT::getConductivityCal(){
    return this->conductivity_cal;
}

void XchangeCT::setup_add(){
    while(_ser.available() > 0){
      _ser.read();
    }
    _ser.println();
    delay(10);
    _ser.println("help");
    //_ser.println("disp coeff");
    // _ser.println("set mux");
}
