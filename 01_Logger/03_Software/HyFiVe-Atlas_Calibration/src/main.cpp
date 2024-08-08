/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 */
 
#include <Arduino.h>
#include <Wire.h>
#include <WiFiClientSecure.h>
#include <WiFi.h>
#include <SPI.h>
#include <time.h>
#include <SD.h>
#include <string.h>
#include <esp_system.h>
#include <esp_sleep.h>
#include <driver/gpio.h>
#include <Atlas01.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define RTC_INT_PIN    7
#define SDA_PIN        4
#define SCL_PIN        5

#define SCK_PIN       12
#define MISO_PIN      13
#define MOSI_PIN      11
#define SelectSD      10

#define s2_tx         17
#define s2_rx         18
#define RE485         48
#define DE485         45

#define ENABLE_EZOBOARD 9
#define ENABLE_BOOST      36


enum sensors{
    temperature_id,
    pressure_id,
    conductivity_id,
    oxygene_id,
    all_sensors
};

// these variables will be remembered after sleeping
RTC_DATA_ATTR short bootCount = 0;               // count how often setup() is called
RTC_DATA_ATTR K01 conductiv;

TwoWire i2c(0);

void setup() {
  i2c.begin(SDA_PIN, SCL_PIN, uint32_t(10000));

  // debugging
  Serial.begin(9600);
  Serial.println();

  pinMode(ENABLE_EZOBOARD, OUTPUT);
  digitalWrite(ENABLE_EZOBOARD, HIGH);

  if (bootCount < 1){
    bootCount++;
    conductiv.init(i2c);
    Serial.println("Version: " + String(conductiv.getVersion()));
    conductiv.calibrate(0);

    // Testing here
    Serial.println("All set");
  }
}

void loop(){
  bootCount++;
  conductiv.measure();
  delay(600);
  conductiv.read();
  Serial.println("Round: " + String(bootCount));
  Serial.println("Value: " + String(conductiv.getConductivity()));
  if(bootCount == 10){
    conductiv.calibrate(1);
  }else if(bootCount == 45){
    conductiv.calibrate(2);
  }else if(bootCount == 90){
    conductiv.calibrate(3);
  }
  
  delay(400);
}
