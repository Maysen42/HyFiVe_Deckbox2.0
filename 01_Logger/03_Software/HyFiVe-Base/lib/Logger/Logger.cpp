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
 
 
#include "Arduino.h"
#include "string.h"
#include <SD.h>
#include <FS.h>
#include <Wire.h>                    // needed for classes with serial connection
#include <WiFiClientSecure.h>
#include <WiFi.h>
#include <string.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <Measurement.h>
#include "Logger.h"


#define MMMS 510                // MAX_MQTT_MESSAGE_SIZE
#define JSON_SIZE_1024 1024

// WiFiClientSecure wifi;
WiFiClient wifi;
char mqttHost[] = "192.168.1.1";      // router

int mqttPort = 1883;
char mqttName[] = "esp";
char mqttUser[] = "admin";
char mqttPassword[] = "pw";   // not necessary
PubSubClient client(mqttHost, mqttPort, wifi);
bool downlinkStatus = false;

Logger::Logger(){
    
}

void Logger::init(uint8_t sd_select, uint8_t sd_enable_var){
  /*
    The init function sets up some basic things and reads out the config.
    The header file is generated or just updated
  */
  this->state = dryLoggerEmpty;
  this->currentFile[0] = 0;
  this->sd_select = sd_select;
  this->sd_enable = sd_enable_var;
  
  /*
    Read in latest config file from SD card in the folder /info/config/
  */
  digitalWrite(this->sd_enable, HIGH);
  delay(50);
  SD.begin(this->sd_select);
  String config_file_path = this->getNewestFile("/info/config");
  Serial.println("Read in config " + config_file_path);
  File config_file = SD.open(config_file_path, FILE_READ);
  delay(50);
  String config_content = config_file.readString();
  unsigned long file_size = config_file.size();
  config_file.close();

  /*
    Get information for the header, this is everything except the information on the sensors
    First cut string into propper size and deserialize it
  */
  uint16_t position_sensors_start = config_content.indexOf("\"sensors\"");
  String header_logger = config_content.substring(0, position_sensors_start) + "}";
  StaticJsonDocument<JSON_SIZE_1024> config_header_json;
  deserializeJson(config_header_json, header_logger);
  // get wifi
  String wifi_ssid = config_header_json["wifi"][0]["ssid"];
  String wifi_password = config_header_json["wifi"][0]["pw"];
  strcpy(this->ssid, wifi_ssid.c_str());
  strcpy(this->password, wifi_password.c_str());
  // get other information
  this->logger_id = config_header_json["logger_id"];
  this->wet_det_periode = config_header_json["wet_det_periode"];
  this->wet_det_threshold = config_header_json["wet_det_threshold"];

  DynamicJsonDocument header_content(JSON_SIZE_1024);

  /*
    The header file contains information on the sensors, the ship and other things. It is important for the creation of the .nc file
    The header file is stored at the beginning of each deployment and is tranferred with it for meta information.
  */
  if(SD.exists(this->header_file)){     // header file existing, updating some things
    Serial.println("header existing, just updating");
    delay(50);
    File header_file = SD.open(this->header_file, FILE_READ);
    delay(50);
    String first_line = header_file.readStringUntil('\n');
    deserializeJson(header_content, first_line);
    header_content["logger_id"] = config_header_json["logger_id"];
    this->deployment_id = header_content["deployment_id"];
    this->logger_id = header_content["logger_id"];
    header_content["deployment_id"] = this->deployment_id;
    header_file.close();
  }else{                                // cretae new header
    this->deployment_id = 1;
    header_content["logger_id"] = config_header_json["logger_id"];
    header_content["deployment_id"] = this->deployment_id;
    header_content["parameter"] = "logger";
    header_content["deckunit_id"] = config_header_json["deckunit_id"];
    header_content["platform_id"] = config_header_json["platform_id"];
    header_content["vessel_id"] = config_header_json["vessel_id"];
    header_content["vessel_name"] = config_header_json["vessel_name"];
    header_content["deployment_contact_id"] = config_header_json["deployment_contact_id"];
    header_content["contact_first_name"] = config_header_json["contact_first_name"];
    header_content["vessel_name"] = config_header_json["vessel_name"];
    header_content["contact_last_name"] = config_header_json["contact_last_name"];
  }
  
  char header_char[JSON_SIZE_1024];
  serializeJson(header_content, header_char);
  // Serial.println(header_char);
  File header_file = SD.open(this->header_file, FILE_WRITE);
  header_file.println(header_char);

  // Get information on the sensors
  String config_sensors = config_content.substring(config_content.indexOf("[", position_sensors_start), config_content.indexOf("]", position_sensors_start));
  String sensor;
  String intermediate;
  uint16_t substring_start = 0;
  uint16_t substring_stop = 0;
  uint16_t substring_help = 0;
  int amount_sensors = config_header_json["num_sensors"];       // amount of the sensors attached
  /* 
    Runs for all sensors ecxept the last one
    Takes information of the sensors and adds the logger and deployments
  */
  for(int i = 0; i < amount_sensors - 1; i ++){
    substring_start = config_sensors.indexOf("\"sensor_id\"", substring_start + substring_stop);  // the substring_stop is a relative position
    substring_help = config_sensors.indexOf("\"sensor_id\"", substring_start + 10);
    intermediate = config_sensors.substring(substring_start, substring_help);
    substring_stop = intermediate.lastIndexOf("}");
    sensor = "{" + intermediate.substring(0, substring_stop);
    StaticJsonDocument<JSON_SIZE_1024> config_sensor_json;
    deserializeJson(config_sensor_json, sensor);
    config_sensor_json["logger_id"] = this->logger_id;
    config_sensor_json["deployment_id"] = this->deployment_id;
    char sensor_char[JSON_SIZE_1024];
    serializeJson(config_sensor_json, sensor_char);
    header_file.println(sensor_char);
    // Serial.println(sensor_char);
  }
  // for the last one
  substring_start = config_sensors.lastIndexOf("\"sensor_id\"");
  substring_stop = config_sensors.lastIndexOf("]");
  sensor = "{" + config_sensors.substring(substring_start, substring_stop);
  StaticJsonDocument<JSON_SIZE_1024> config_sensor_json;
  deserializeJson(config_sensor_json, sensor);
  config_sensor_json["logger_id"] = this->logger_id;
  config_sensor_json["deployment_id"] = this->deployment_id;
  char sensor_char[JSON_SIZE_1024];
  serializeJson(config_sensor_json, sensor_char);
  header_file.println(sensor_char);

  header_file.close();
  Serial.println("End init.");
  SD.end();
  digitalWrite(this->sd_enable, LOW);
  return;
}

// changes the state
void Logger::setState(uint8_t in){
  this->state = in;
}

// creates a new file for a deployment with header information in the top and a blank line before the measured values
// the header file is updated to a higher deployment id
void Logger::setFileName(char *name){
  // get information from header and store header
  SD.begin(this->sd_select);
  delay(50);
  strcpy(currentFile, name);
  File header_file = SD.open(this->header_file, FILE_READ);
  delay(50);
  File new_file = SD.open(currentFile, FILE_WRITE);
  delay(50);
  unsigned long size = header_file.size();         // with size it is possiple to jump to end of file and append
  unsigned long position = header_file.position();
  String current_line;
  // copy all information to the file except last line break, increase the deployment_id by 1
  while (position < (size - 4)){
    current_line = header_file.readStringUntil('\n');  // read until new line
    StaticJsonDocument<JSON_SIZE_1024> header_line_json;
    deserializeJson(header_line_json, current_line);
    this->deployment_id = int(header_line_json["deployment_id"]) + 1;
    header_line_json["deployment_id"] = this->deployment_id;
    char current_line_char[JSON_SIZE_1024];
    serializeJson(header_line_json, current_line_char);
    new_file.println(current_line_char);
    position = header_file.position();
  }
  header_file.close();
  new_file.close();
  delay(50);

  // copy header information to header file for next deployment
  header_file = SD.open(this->header_file, FILE_WRITE);
  delay(50);
  new_file = SD.open(currentFile, FILE_READ);
  delay(50);
  while(new_file.available()) {
    header_file.write(new_file.read());
   }
   
  header_file.close();
  new_file.close();
  delay(50);

  // add one more line to the new file as seperator
  new_file = SD.open(currentFile, FILE_WRITE);
  delay(50);
  new_file.seek(new_file.size());
  new_file.println();
  new_file.close();
  header_file.close();
  
  SD.end();
}

uint8_t Logger::getState(){
    return this->state;
}

uint8_t Logger::getLoggerId(){
    return this->logger_id;
}

uint32_t Logger::getDeploymentId(){
    return this->deployment_id;
}

const char* Logger::getFileName(){
    return this->currentFile;
}

bool Logger::transmittIdToMqtt(){     // transmitt logger_id to receive an update
    bool pass = true;
    char mqtt_topic[] = "loggerID";
    char payload[MMMS];
    StaticJsonDocument<MMMS> doc;
    doc["loggerID"] = this->logger_id;
    serializeJson(doc, payload);
    Serial.println(payload);
    if(!client.connected()){
      connectMqtt();
    }
    if(client.publish(mqtt_topic, payload) == 0){ // code for message not delivered
        pass = false;
    }
    return pass;
}

bool Logger::initWifi(){              // connect to WiFi with ssid and pwd from the config file
  Serial.println(this->ssid);
  Serial.println(this->password);
  WiFi.mode(WIFI_STA);
  WiFi.begin(this->ssid, this->password);
  Serial.print("Connecting to WiFi ..");
  short i = 0;
  while (WiFi.status() != WL_CONNECTED && i < 15) {
    Serial.print('.');
    i++;
    delay(1000);
  }
  if(i<15){
    Serial.println(WiFi.localIP());
    return true;
  }else{
    return false;
  }
}


void Logger::saveMeasurement(char* data_in){    // store measurement at the end of the current file
    char payload[MMMS];
    for(int i = 0; i < MMMS; i++){
        payload[i] = data_in[i];
    }
    String toSD = payload;
    Serial.println(toSD);
    SD.begin(this->sd_select);
    File myfile = SD.open(this->getFileName(), FILE_WRITE);
    delay(50);
    unsigned long size = myfile.size();     // with size it is possiple to jump to end of file and append
    myfile.seek(size);                      // go to position size in file
    myfile.println(toSD);                   // add line
    myfile.close();
    SD.end();
}

bool Logger::transmittDataToMqtt(){             // transmitt data of deployments that have not jet been transmitted
  digitalWrite(this->sd_enable, HIGH);
  delay(20);
  bool all_files_pass = true;                             // indicator to check if all files went through -> return value
  File root;
  SD.begin(this->sd_select);
  root = SD.open("/measurements");
  int number = this->getFileNumber(root, 0);    // get number of files to send
  root.rewindDirectory();
  String* names = this->getFileNames(root, 0, number, "/measurements"); // array of file names to go through
  Serial.printf("Try to send %d files", number);
  Serial.println("");

  for(int i = 0; i < number; i++){      // do this for every file in the folder /measurements
      bool current_file_pass = true;
      String filename_for_transmission = names[i];
      String mqtt_topic = "hyfive/header";
      File file_in_transmission = SD.open(filename_for_transmission, FILE_READ);
      delay(50);
      unsigned long size = file_in_transmission.size();
      unsigned long position = file_in_transmission.position();
      String buf;

      connectMqtt();
      Serial.println("->      Topic: hyfive/header      <-");

      while (position < size){                  // do until end of file is reached
          StaticJsonDocument<MMMS> doc;
          char payload[MMMS];
          buf = file_in_transmission.readStringUntil('\n');  // read until new line
          position = file_in_transmission.position();
          strcpy(payload, buf.c_str());
          //Serial.println(buf);
          if(buf.length() < 5){                // this recognises an empty line indicating that the header is completly transmitted, data follows
            mqtt_topic = "hyfive/data";
            Serial.println("->      Topic: hyfive/data      <-");
          }
          else {
            if(!client.connected()){           // reconnect if necessary
                connectMqtt();
            }
            if(client.publish(mqtt_topic.c_str(), payload) == 0){      // transmitt data, 0 is code for message not delivered
                current_file_pass = false;
                Serial.println("Meassage not delivered");
            }
          }
          delay(10);
      }
      file_in_transmission.close();
      // backup file if transmission was successfull
      if(current_file_pass == true){                  
          File transmitted_file = SD.open(filename_for_transmission, FILE_READ);
          File backup_file = SD.open("/backup" + String(filename_for_transmission), FILE_WRITE);
          while(transmitted_file.available()) {
              backup_file.write(transmitted_file.read());
          }
          backup_file.close();
          backup_file = SD.open("/backup" + String(filename_for_transmission), FILE_READ);
          if(transmitted_file.size() == backup_file.size()){                                // check if they are the same size and remove the one in /measurements
              transmitted_file.close();
              backup_file.close();
              SD.remove(filename_for_transmission);
              Serial.println("->      successfull transmission and transfer of data      <-");
          }else{
              transmitted_file.close();
              backup_file.close();
          }
      }
      if(all_files_pass == true){             // the return value can only be changed to false, meaning one of all the files has not been transmitted
          all_files_pass = current_file_pass;
      }
  }
  root.close();
  SD.end();
  // client.disconnect();
  digitalWrite(this->sd_enable, LOW);
  return all_files_pass;
}

bool Logger::transmittStatus(uint8_t adc_pin){    // transmitt status of battery, SD card and others
  digitalWrite(this->sd_enable, HIGH);
  delay(20);
  uint16_t adc = analogRead(adc_pin);                                     // read in analog value for voltage in range 0-4095. This is only half of the battery voltage, because of resistors
  float voltage_batterie = float(analogRead(adc_pin)) / 4095 * 3.3 * 2;   // calculate voltage = adc / full scale * Vref * resistor divider
  SD.begin(this->sd_select);                                              // read in SD information
  uint64_t total_size = SD.cardSize();
  uint64_t used_size = SD.usedBytes();
  SD.end();

  bool status_information_pass = true;
  char mqtt_topic[] = "hyfive/status";                                    // transmitt here
  char payload[MMMS];
  StaticJsonDocument<MMMS> doc;
  doc["logger_id"] = this->logger_id;
  doc["battery_remaining"] = voltage_batterie;
  doc["memory_capacity_total"] = total_size;
  doc["memory_capacity_used"] = used_size;
  serializeJson(doc, payload);
  if(!client.connected()){
    connectMqtt();
  }
  Serial.println(payload);
  if(client.publish(mqtt_topic, payload) == 0){ // publish, 0 is code for message not delivered
      status_information_pass = false;
  }
  digitalWrite(this->sd_enable, LOW);
  return status_information_pass;
}

int Logger::getFileNumber(File dir, int numTabs){ // get the number of files in the directory
  int files = 0;
  while (true) {
    File entry = dir.openNextFile();
    if (!entry) {
      if (numTabs == 0)    
      return files;
    }
    files ++;
    if (entry.isDirectory()) {
      Serial.println("/");
      getFileNumber(entry, numTabs + 1);
    } 

    entry.close();
  }
}

String* Logger::getFileNames(File dir, int numTabs, int number, String directory) {   // returns names of files in the directory in an array
  int files = number;
  String* names = new String[files];
  while (true) {
    File entry = dir.openNextFile();
    if (!entry) {
      if (numTabs == 0) 
      return names;
    }
    String out_str = directory + "/" + entry.name();
    names[files-1] = out_str;
    // Serial.println(names[files -1]);
    files--;
    if (entry.isDirectory()) {
      Serial.println("/");
      getFileNames(entry, numTabs + 1, number, directory);
    } 
    
    entry.close();
  }
}

String* Logger::getFiles(String directory){   // get names of files in one directory
    File root;
    root = SD.open(directory);
    int number = this->getFileNumber(root, 0);
    root.rewindDirectory();
    String* names = this->getFileNames(root, 0, number, directory);
    root.close();
    return names;
}

String Logger::getNewestFile(String directory){   // returns files with the newest date in the end, good for findeing the latest config file
  //SD.begin(this->sd_select);
  File root = SD.open(directory);
  int number = this->getFileNumber(root, 0);
  String *filenames = this->getFiles(directory);
  String newestFile;
  int highestNumber = -1;
  for(int i = 0; i < number; i++){
    String filename = filenames[i];
      size_t pos = filename.lastIndexOf('_');
      String sub = filename.substring(pos + 4, filename.indexOf('.'));
      double number = sub.toDouble();
      if (number > highestNumber) {
        highestNumber = number;
        newestFile = filename;
      }
  }
  root.close();
  return newestFile;
}


uint8_t Logger::getWetDetPeriode(){
  return wet_det_periode;
}


float Logger::getWetDetThreshold(){
  return wet_det_threshold;
}

/*
    Other things not connected to the logger directly
*/

bool getNtpTime(tm *timeinfo){
  bool wifiActive = false;              // flag to remember if wifi was active before
  bool res = false;
  //configTime(0, 0, "134.130.4.17");     // offset to UTC, offset due to summertime, Server
  configTime(0, 0, "192.168.1.1");     // offset to UTC, offset due to summertime, Server
  //configTime(0, 0, "de.pool.ntp.org");
  if(getLocalTime(timeinfo)){
    res = true;
  }
  return res;
}

bool connectMqtt(){                                               // connect to MQTT
    client.setServer(mqttHost, mqttPort);
    // client.setCallback(callback);
    client.connect(mqttName, mqttUser, mqttPassword);
    client.setBufferSize(512 * 2); //increase maximum pakage size
    if(!client.connected()){
        Serial.println("Connection not possible");
        return false;
    }
    Serial.println("yuhu, connected");
    return true;
}
