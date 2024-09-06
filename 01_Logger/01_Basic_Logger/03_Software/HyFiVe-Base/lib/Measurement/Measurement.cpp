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
 
#include <Arduino.h>
#include <Wire.h>
#include <ds3231.h>
#include <time.h>
#include <SD.h>
#include <FS.h>
#include <Logger.h>
#include <ArduinoJson.h>
#include <Measurement.h>


#define MMMS 255

Measurement::Measurement(int id, int diveid){   // initialisation with declaration of some parameters
  this->ID = id;
  this->diveID = diveid;
  this->raw_conductivity = -1;
  this->raw_oxygen = -1;
  this->raw_pressure = -1;
  this->raw_temperature = -1;
  this->oxygen = -1;
}

void Measurement::setID(int id){
  this->ID = id;
}

int Measurement::getID() const{
  return this->ID;
}

void Measurement::setDiveId(int diveid){
  this->diveID = diveid;
}

int Measurement::getDiveId() const{
  return this->diveID;
}

void Measurement::setTemperature(float value){
  this->temperature = value;
}

float Measurement::getTemperature() const{
  return this->temperature;
}

void Measurement::setRawTemperature(float raw_value){
  this->raw_temperature = raw_value;
}

float Measurement::getRawTemperature() const{
  return this->raw_temperature;
}

void Measurement::setPressure(float value){
  this->pressure = value;
}

float Measurement::getPressure() const{
  return this->pressure;
}

void Measurement::setRawPressure(float raw_value){
  this->raw_pressure = raw_value;
}

float Measurement::getRawPressure() const{
  return this->raw_pressure;
}

void Measurement::setConductivity(float value){
  this->conductivity = value;
}

float Measurement::getConductivity() const{
  return this->conductivity;
}

void Measurement::setRawConductivity(float raw_value){
  this->raw_conductivity = raw_value;
}

float Measurement::getRawConductivity() const{
  return this->raw_conductivity;
}

void Measurement::setOxygen(float value){
  this->oxygen = value;
}

float Measurement::getOxygen() const{
  return this->oxygen;
}

void Measurement::setRawOxygen(float raw_value){
  this->raw_oxygen = raw_value;
}

float Measurement::getRawOxygen() const{
  return this->raw_oxygen;
}

void Measurement::prepareSD(tm *time, char* handover){      // prepare data to save on SD card, this has to be modified by hand
  StaticJsonDocument<MMMS> doc;
  char payload[MMMS];
  String timestamp = String(1900 + time->tm_year) + "-" + decimal(time->tm_mon) + "-" + decimal(time->tm_mday) +"T" + decimal(time->tm_hour) + ":" + decimal(time->tm_min) + ":" + decimal(time->tm_sec) +  "Z";
  doc["time"] = timestamp;
  doc["logger_id"] = this->getID();
  doc["deployment_id"] = this->getDiveId();
  doc["temperature"] = this->getTemperature();
  doc["pressure"] = this->getPressure();
  doc["conductivity"] = this->getConductivity();
  doc["oxygen"] = this->getOxygen();
  doc["temperature_raw"] = this->getRawTemperature();
  doc["pressure_raw"] = this->getRawPressure();
  doc["conductivity_raw"] = this->getRawConductivity();
  doc["oxygen_raw"] = this->getRawOxygen();

  serializeJson(doc,payload);
  for(int i = 0; i < MMMS; i++){
    handover[i] = payload[i];
  }  
}

