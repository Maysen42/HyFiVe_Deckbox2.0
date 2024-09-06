/*
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Main routine of the logger with different states, initialisations of sensors are performed as well as measurerment procesures.
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
#include <Logger.h>
#include <ds3231.h>
#include <celsiusFR.h>
#include <Measurement.h>
#include <Microe6Click.h>
#include <OxyBase485.h>
#include <Atlas01.h>
#include <KellerLD.h>
#include <XchangeCT.h>
#include <pyroO2.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define RTC_INT_PIN    7          // real time clock interupt pin
#define SDA_PIN        4          // I2C
#define SCL_PIN        5          // I2C

#define SCK_PIN       12          // SPI
#define MISO_PIN      13          // SPI
#define MOSI_PIN      11          // SPI
#define SelectSD      10          // SPI
#define ENABLE_SD     37          // supply with power

#define s2_tx         17          // UART
#define s2_rx         18          // UART
#define RE485         47          // RS485 microe
#define DE485         21          // RS485 microe

#define s1_tx         48          // UART
#define s1_rx         45          // UART

#define ENABLE_EZOBOARD 9         // K1.0
#define ENABLE_BOOST    36        // boost converter for sensors with higher voltage than 3.3 V
#define ENABLE_V_UART   35        // supply sensor on UART with 3.3 V

#define ANALOG_IN 8               // read in analog voltage of battery


enum sensors{                     // enum for turning sensors on or off. Filled in first round of setup()
  conductivity_id,
  oxygen_id,
  sd_card,
  all_sensors
};

// these variables will be remembered after sleeping
RTC_DATA_ATTR int8_t bootCount = 0;               // count how often setup() is called
RTC_DATA_ATTR Logger logging_unit;                // logger
RTC_DATA_ATTR DS3231 logger_clock;                // real time clock

/*
    Sensors that can be read used
      - TSYS: temperature by bluerobotics, on first built you might have to change the funktion temperature (returning the temperature) to getTemperature() and
          write a new one for getRawTemperature returning the adc value as raw temperature
          Additionally add the waire port to the init() as in the lib for the Atlas and change all Wire. to _i2cPort->
      - 9LD: pressure by Keller
      - K1.0: conductivity by Atlas Scientific
      - CTxchange: temperature and conductivity by AML. The library expects the output in MUX mode including raw values
      - PICO-O2: Oxygen by pyroscience
      - Oxybase: Oxygen by Presens
  */
RTC_DATA_ATTR KellerLD pressure;                  // 9LD
RTC_DATA_ATTR K01 conductivity;                   // K1.0
RTC_DATA_ATTR TSYS01 temperature;                 // TSY01
// RTC_DATA_ATTR Microe6Click rs485;                 // Oxybase
// RTC_DATA_ATTR OxyBase oxygen;                     // Oxybase
// RTC_DATA_ATTR XchangeCT amlCT(Serial2);           // CTxchange
RTC_DATA_ATTR pyroO2 oxygen;                      // PICO-O2

RTC_DATA_ATTR int sensor_pin_states[all_sensors][2];        // array to store pin states
/*[[pin_sensor_1, state_sensor_1],
   [pin_sensor_2, state_sensor_2],
   [pin_sensor_3, state_sensor_3]]
*/
RTC_DATA_ATTR int delay_after_deployment = 5;               // time to wait after a deployment before sending
RTC_DATA_ATTR int delay_try_resend = 502;                   // time to wait after failed sending and before trying again
RTC_DATA_ATTR time_t t_outof_water;                         // store time when water was left
RTC_DATA_ATTR time_t t_to_send;                             // set and store time when to send data


TwoWire i2c(0);


void goToSleep(){
  Serial.println("entering deep sleep");               
  // esp_sleep_enable_timer_wakeup(5000000);
  esp_sleep_enable_ext0_wakeup((gpio_num_t) RTC_INT_PIN, 0);    // set RTC as wakeup
  gpio_hold_en((gpio_num_t) RTC_INT_PIN);                       // set RTC as wakeup
  for(int i = 0; i < all_sensors; i++){                         // hold enable for all sensor pins so that they stay on or off respectivly
    gpio_hold_en((gpio_num_t) sensor_pin_states[i][0]);
  }
  gpio_deep_sleep_hold_en();
  esp_deep_sleep_start();
}

void measure(Measurement *now){
  /*
    The sensors need to be read out at in a certain order to have the least delay but work fine. This is a setup that must be checked individualy
    The sensors functions of the sensors are each commented
  */
  // delay(120);                  // CTxchange
  // temp_cond.read_value();      // CTxchange
 
  conductivity.measure();         // K1.0
  pressure.read();                // 9LD
  temperature.read();             // TSYS

  // oxygen.setTemperature(temperature.getTemperature());      // Oxybase

  oxygen.writeSampleTemp(temperature.getTemperature());   // PICO-O2
  oxygen.measure();                                       // PICO-O2
  delay(250);                                             // PICO-O2
  oxygen.read();                                          // PICO-O2
  delay(280);                     // K1.0
  conductivity.read();            // K1.0
  // oxygen.readOxygen();                                      // Oxybase
  
  now->setTemperature(temperature.getTemperature());            // TSYS
  now->setRawTemperature(temperature.getRawTemperature());      // TSYS
  // now->setTemperature(temp_cond.getTemperature());           // CTxchange
  // now->setTemperature(temp_cond.getTemperatureRaw());        // CTxchange
  now->setPressure(pressure.getPressure());                     // 9LD
  now->setConductivity(conductivity.getConductivity());         // K1.0
  // now->setTemperature(temp_cond.getConductivity());          // CTxchange
  // now->setTemperature(temp_cond.getConductivityRaw());       // CTxchange
  now->setOxygen(oxygen.getOxygenMBar());                    // PICO-O2
  // now->setOxygen(oxygen.getOxygen());                           // Oxybase
}

void setupPins(){
  // after sleep these lines diable holding them in the same state
  gpio_hold_dis((gpio_num_t) RTC_INT_PIN);
  for(int i = 0; i < all_sensors; i++){
    gpio_hold_dis((gpio_num_t) sensor_pin_states[i][0]);
  }

  // set output states to defined and stored states
  for(int i = 0; i < all_sensors; i++){
    pinMode(sensor_pin_states[i][0], OUTPUT);
    digitalWrite(sensor_pin_states[i][0], sensor_pin_states[i][1]);
  }
  // pinMode(RE485, OUTPUT);                     // Oxybase
  // pinMode(DE485, OUTPUT);                     // Oxybase

  // makes this PIN an input with pull up for Interrupt
  pinMode(RTC_INT_PIN, INPUT_PULLUP);
}

void setup() {
  // put your setup code here, to run once:
  // order the sensors to the hardware pins and define the inital state of all sensors (on or off)
  if(bootCount == 0){
    sensor_pin_states[conductivity_id][0] = ENABLE_EZOBOARD;      // K1.0
    // sensor_pin_states[conductivity_id][0] = ENABLE_BOOST;      // CTxchange
    // sensor_pin_states[oxygen_id][0] = ENABLE_BOOST;               // Oxybase
    sensor_pin_states[oxygen_id][0] = ENABLE_V_UART;              // PICO-O2
    sensor_pin_states[sd_card][0] = ENABLE_SD;
    for(int i = 0; i < all_sensors; i++){
      sensor_pin_states[i][1] = 1;            // all on
    }
  }
  setupPins();

  i2c.begin(SDA_PIN, SCL_PIN, uint32_t(10000));
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN);

  // debugging
  Serial.begin(9600);
  Serial.println();

  // Sensor initialisation
  // Serial2.begin(19200, SERIAL_8N2, s2_rx, s2_tx);           // Oxybase
  oxygen.initUart(1, s1_rx, s1_tx);                      // PICO-O2
  // Serial2.begin(9600, SERIAL_8N1, s2_rx, s2_tx);         // CTxchange

  if (bootCount < 1){
    // Things that are only supposed to happen once ...
    bootCount = 1;

    // initialize the starting elements
    logging_unit.init(SelectSD, ENABLE_SD);
    logger_clock.init(i2c, every_sec);

    /*
      Initialize sensors
    */
    if(!temperature.init(i2c)){                               // TSYS
      Serial.println("failed to init temperature sensor");
    }
    conductivity.init(i2c);                                   // K1.0
    pressure.init(i2c);                                       // 9LD
    // delay(3000);                                           // CTxchange needs time to start
    // temp_cond.init();                                      // CTxchange
    oxygen.setDeviceID();                                  // PICO-SUB
    // delay(5000);                                              // Oxybase needs time to start
    // rs485.init(DE485, RE485);                                 // Oxybase
    // oxygen.init(rs485);                                       // Oxybase
    
    // turn off the sensors that are not needed
    sensor_pin_states[conductivity_id][1] = 0;                                                    // CTxchange || K1.0
    digitalWrite(sensor_pin_states[conductivity_id][0], sensor_pin_states[conductivity_id][1]);   // CTxchange || K1.0
    // sensor_pin_states[oxygen_id][1] = 0;                                                          // Oxybase
    // digitalWrite(sensor_pin_states[oxygen_id][0], sensor_pin_states[oxygen_id][1]);               // Oxybase
    oxygen.enterDeepSleep();                                                                      // PICO-O2
    sensor_pin_states[sd_card][1] = 0;                                                            // turn off SD card
    digitalWrite(sensor_pin_states[sd_card][0], sensor_pin_states[sd_card][1]);                   // turn off SD card

    // connect to WiFi and get curren time
    logging_unit.initWifi();
    struct tm ntctime;
    if(getNtpTime(&ntctime)){
      logger_clock.setRtcTime(&ntctime);
      Serial.println("Time updated!");
    }

    // Testing here

    Serial.println("All set");
  }

  logger_clock.resetRtcAlarm();       // reset alarm
}


void loop(){
  Measurement sample(logging_unit.getLoggerId(), logging_unit.getDeploymentId());     // initialze measurement
  struct tm timestamp;
  logger_clock.getRtcTime(&timestamp);                                          // get current time
  /*
      State machine for logging cycle
  */
   // Logger is at the surface, is empty OR with files AND the current time is past the time it left the water + a delay
   // It checks if it is in the water
  if(logging_unit.getState() == dryLoggerEmpty || (logging_unit.getState() == dryLoggerwFiles && (t_to_send < mktime(&timestamp)))){
    Serial.println(String(1900 + timestamp.tm_year) + "." + decimal(timestamp.tm_mon) + "." + decimal(timestamp.tm_mday) + "," + decimal(timestamp.tm_hour) + ":" + decimal(timestamp.tm_min) + ":" + decimal(timestamp.tm_sec));
    /*
      Use pressure or conductivity as index if the sensor is in the water
    */
    float wet_detection_value;
    // pressure.read();                                           // 9LD
    // wet_detection_value = pressure.getPressure();              // 9LD
    digitalWrite(sensor_pin_states[conductivity_id][0], HIGH);    // K1.0
    delay(2000);                                                  // K1.0
    conductivity.measure();                                       // K1.0
    delay(800);                                                   // K1.0
    conductivity.read();                                          // K1.0
    wet_detection_value = conductivity.getConductivity();         // K1.0
    Serial.printf("Measured value: %f, threshold: %f \r\n", wet_detection_value, logging_unit.getWetDetThreshold());
    if(wet_detection_value < logging_unit.getWetDetThreshold()){            // device not in water
      Serial.println("not in water");
      digitalWrite(sensor_pin_states[conductivity_id][0], LOW);    // K1.0
    }else{
      /*
        device is in water -> change state
        generate filename and create it on the SD card
      */
      logging_unit.setState(inSituLogger);
      char name[37];
      String go =  "/measurements/" + String(1900 + timestamp.tm_year) + decimal(timestamp.tm_mon) + decimal(timestamp.tm_mday) + decimal(timestamp.tm_hour) + decimal(timestamp.tm_min) + ".json";
      strcpy(name, go.c_str());                             // measurement from this cyle will be stored in the corresponding file
      digitalWrite(sensor_pin_states[sd_card][0], HIGH);
      delay(50);
      logging_unit.setFileName(name);

      /*
        Turn on sensors that saved power and save state
      */
      sensor_pin_states[conductivity_id][1] = 1;                                                            // CTxchange || K1.0
      // digitalWrite(sensor_pin_states[conductivity_id][0], sensor_pin_states[conductivity_id][1]);        // CTxchange
      // delay(2000);                                                                                       // CTxchange
      // sensor_pin_states[oxygen_id][1] = 1;                                                                  // Oxybase
      // digitalWrite(sensor_pin_states[oxygen_id][0], sensor_pin_states[oxygen_id][1]);                       // Oxybase
      // delay(5000);                                                                                          // Oxybase
      // oxygen.activateMeasurement();                                                                         // Oxybase
      oxygen.exitDeepSleep();                                                                            // PICO-O2
      sensor_pin_states[sd_card][1] = 1;
      Serial.println("hold your breath");
      logger_clock.setRtcAlarm(&timestamp, every_sec);
      goToSleep();
    }
    timestamp.tm_sec += logging_unit.getWetDetPeriode();        // set alarm for next check
    if(timestamp.tm_sec >= 60){
      timestamp.tm_sec -= 60;
    }
    logger_clock.setRtcAlarm(&timestamp, every_min);
  }

  // Logger is dry with files AND the current time is past the time it left the water + a delay
  // Therefore it sends data
  if(logging_unit.getState() == dryLoggerwFiles && (t_to_send < mktime(&timestamp))){
    /*
      Handle sensors after the deployment
    */
    sensor_pin_states[sd_card][1] = 0;
    sensor_pin_states[conductivity_id][1] = 0;                                                    // CTxchange || K1.0
    digitalWrite(sensor_pin_states[conductivity_id][0], sensor_pin_states[conductivity_id][1]);   // CTxchange || K1.0
    // sensor_pin_states[oxygen_id][1] = 0;                                                          // Oxybase
    // digitalWrite(sensor_pin_states[oxygen_id][0], sensor_pin_states[oxygen_id][1]);               // Oxybase
    oxygen.enterDeepSleep();                                                                   // PICO-O2

    Serial.println("I will transmitt data");
    bool success = true;                                   // indicates if the transission was true in the end
    digitalWrite(sensor_pin_states[sd_card][0], HIGH);
    logging_unit.initWifi();                               // connect with WIFI
    if(WiFi.status() == WL_CONNECTED){        // go on
      struct tm ntctime;  
      if(getNtpTime(&ntctime)){               // update time
        Serial.println("Time updated!");
        logger_clock.setRtcTime(&ntctime);
        timestamp = ntctime;
      }
      if(!logging_unit.transmittDataToMqtt()){  // tramsitt files that are stored in the folder /measurements
          Serial.println("have to try again");
          success = false;
      }
      Serial.println("finished\n Sending Status");
      
      logging_unit.transmittStatus(ANALOG_IN);      // transmitt ADC with logger_id
    }else{
      success = false;
    }
    digitalWrite(sensor_pin_states[sd_card][0], LOW);
    WiFi.disconnect();
    if(success){                                          // if data was transmitted set new alarm to check if in water and change state
      logger_clock.getRtcTime(&timestamp);
      timestamp.tm_sec += logging_unit.getWetDetPeriode();
      if(timestamp.tm_sec >= 60){
        timestamp.tm_sec -= 60;
      }
      logger_clock.setRtcAlarm(&timestamp, every_min);
      logging_unit.setState(dryLoggerEmpty);
    }else{                                                // if not successfull set alarm and new time to trnamitt data
      logging_unit.setState(dryLoggerwFiles);
      logger_clock.setRtcAlarm(&timestamp, every_min);
      logger_clock.getRtcTime(&timestamp);
      t_to_send = mktime(&timestamp) + delay_try_resend;
    }
  }
 
  //  Logger is in water and has been before OR the delay after leaving the water before transmission has not yet been reached
  if(logging_unit.getState() == inSituLogger  || (logging_unit.getState() == dryLoggerwFiles && (t_outof_water + delay_after_deployment) > mktime(&timestamp))){
    measure(&sample);                                                       // take a measurement
    if(sample.getConductivity() < logging_unit.getWetDetThreshold()){       // check if device is out of the water
      if(logging_unit.getState() == inSituLogger){                          // just left the water -> change state and set time for connecting to wifi
        t_outof_water = mktime(&timestamp);
        t_to_send = t_outof_water + delay_after_deployment;
        logging_unit.setState(dryLoggerwFiles);
        Serial.println("getting out of water");
      }
    }else{                                                                  // when still in the water store data
      char payload[255];
      sample.prepareSD(&timestamp, payload);
      logging_unit.saveMeasurement(payload);
      if(logging_unit.getState() == dryLoggerwFiles){
        logging_unit.setState(inSituLogger);
        Serial.println("getting back in");
      }
    }
    logger_clock.setRtcAlarm(&timestamp, every_sec);
  }
  
  goToSleep();
  delay(240);
  
}
