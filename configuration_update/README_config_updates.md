# Update of Logger Configuration

## Purpose

An aim of the HyFiVe project is, that a fleet of measuring systems can be managed with small effort. Therefore we developed a possibility to change the configuration of loggers, which are already deployed on a remote vessel. 

Therefore we defined a set of config parameters, which are stored in a config.json file and described below. The config files can be created with an webinterface and are handed down from  server to loggers. 

## Configuration parameters and JSON file

All config parameters are stored in a config.json file, an example is given in this folder. The table down below contains all config parameters with a brief description.The modular logger uses all config parameters. The basic logger needs a correct config file, but processes only few parameters from it, as indicated in the table.

This table is also given as [excel table](./logger_config_parameters.xlsx) containing additional information (data type of parameter on modular logger and information if and how the parameter can be found in the data base). 

## Data Flow: Handing Config Files from Server to Logger

1. Creation:  
After creation by the webinterface, the config files are stored on the server:
    - location: mailbox/out/config/logger_ID/
    - file name: logger_ID_config_DATE, with DATE like YYYYMMDDHHMM, e.g. logger_10_config_202405071357
The format of the file name is important and shall not be altered, as the ID in the file name is used to them assign to the right logger and the date is used to identify the latest file. 
2. Transmission from server to deck box:   
Each deck box copies all config files from the server to a local repository. This is done in regular intervals by a flow in NodeRED on the deck box. 
3. Transmission from deck box to logger:  
As a deck box does not know which loggers are close and also has no way (implemented) to start a MQTT connection, the loggers need to ask for updates. They do this in regular intervals given by the config parameter config_update_periode. The process is described in detail below. 

## Creating a Config File: The Configuration Interface

We engaged a external software company to develop an interface. The interface has the following functionalities: 
- Gives an overview of all loggers:
    - Currently assigned deck box and vessel
    - Status information
        - Battery remaining
        - Memory remaining
    - Last position shown on map
- Change config parameters of loggers:
    - including sensor information
    - Creating new config files
    - Also writing changes in relational data base
- Create config files and database entries for new loggers and sensors


## Transmitting a Config File from Deck Box to Logger via MQTT

The transmission between deck box and logger is described in below flow chart:

<figure> 
   <img src="./config_update_flow_diagram.svg"  width=800 title="config_update_flow_diagram">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Transmission of config file between logger and deck box*</figurecaption>
</figure>

## Table of all Config Parameters


| Parameter name (in json syntax)                | example value             | Long name                              | Explanation                                                                                                        | Basic logger          |
| ---------------------------------------------- | ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------- |
| {                                              |                           |                                        |                                                                                                                    |                       |
|     "logger_id"                                |  5,                       | Logger ID                              | Unique ID of this logger                                                                                           | used                  |
|     "operation_mode"                           | "profiling_Travemuende",  | Operation mode                         | (only needed as meta data)                                                                                         | no                    |
|     "fw_version"                               | "base",                   | Firmware version                       |                                                                                                                    | no                    |
|     "num_sensors"                              | 2                         | Number of sensors (attached to logger) | Generated automatically                                                                                            | no                    |
|     "wifi"                                     |  [                        |                                        |                                                                                                                    |                       |
|         {                                      |                           |                                        |                                                                                                                    |                       |
|             "ssid"                             |  "SSID1",                 | Wifi SSID                              |                                                                                                                    | used                  |
|             "passw"                            | "\*\*\*"                  | Wifi password                          |                                                                                                                    | used                  |
|         },                                     |                           |                                        |                                                                                                                    |                       |
|         {                                      |                           |                                        |                                                                                                                    |                       |
|             "ssid"                             |  "SSID2",                 |                                        | modular logger allows several sets of wifi credentials, which                                                      | no second set of wifi |
|             "passw"                            | "\*\*\*"                  |                                        | are checked in the given order                                                                                     |                       |
|         }                                      |                           |                                        |                                                                                                                    |                       |
|     ],                                         |                           |                                        |                                                                                                                    |                       |
|     "config_update_periode"                    | 3600,                     | Config update periode                  | interval [s] when to check for update                                                                              | hard coded            |
|     "status_upload_periode"                    | 3600,                     | Status upload periode                  | interval [s] when to upload new status                                                                             | hard coded            |
|     "sample_periode"                           | 2                         | Sample periode                         | interval [s] in which to sample (if underwater)                                                                    | hard coded            |
|     "sample_cast_enable"                       |  0,                       | Sample cast enable                     | if enabled, logger measures with different periode if down or upcast is detected                                   | no                    |
|     "sample_cast_periode"                      |  1,                       | Sample cast periode                    | interval [s] in which to sample, if logger has detected a cast                                                     | no                    |
|     "cast_det_sensor"                          |  23,                      | Cast detection sensor                  | ID of sensor for detecting a cast (usually pressure)                                                               | no                    |
|     "cast_det_sensor_threshold"                | 50,                       | Cast detection sensor threshold        | a cast is detected, if this threshold is exceeded by 'difference in sensor reading during 1s', so usually [mbar/s] | no                    |
|     "wet_det_sensor"                           |  23,                      | Wet detection sensor                   | ID of sensor for detecting the beginning of a dive                                                                 | hard coded            |
|     "wet_det_periode"                          |  15,                      | wet detection periode                  | interval [s] when to check if immersed                                                                             | used                  |
|     "wet_det_threshold"                        |  1050,                    | wet detection threshold                | if reading of wet_det_sensor > this threshold, an immersion is detected                                            | used                  |
|     "dry_det_sensor"                           | 23,                       | dry detection sensor                   | ID of sensor for detecting the end of a dive                                                                       | no                    |
|     "dry_det_threshold"                        | 1050,                     | dry detection threshold                | if reading of dry_det_sensor < this threshold, an emersion is detected                                             | no                    |
|     "dry_det_verify_delay"                     | 5,                        | dry detection verify delay             | time [s] at the end of a dive to continue measureing and check for reimmersion                                     | no                    |
|     "data_upload_retry_periode"                | 300,                      | data upload retry periode              | time [s] to wait until retry, if a data trasmission failed                                                         | hard coded            |
|     "deckunit_id"                              |  6,                       | Deckunit ID                            | (only needed as meta data), ID of primary deck box for this logger                                                 | used                  |
|     "platform_id"                              |  7,                       | Platform ID                            | (only needed as meta data), ID of platform this logger is deployed on                                              | used                  |
|     "vessel_id"                                |  7,                       | Vessel ID                              | (only needed as meta data)                                                                                         | used                  |
|     "vessel_name"                              |  "Paula",                 | Vessel name                            | (only needed as meta data)                                                                                         | used                  |
|     "deployment_contact_id"                    |  1,                       | Deployment contact ID                  | (only needed as meta data)                                                                                         | used                  |
|     "contact_first_name"                       | "Peter",                  | Contact first name                     | (only needed as meta data)                                                                                         | used                  |
|     "contact_last_name"                        | Petersen",                | Contact last name                      | (only needed as meta data)                                                                                         | used                  |
|     "sensors"                                  |  [                        |                                        | Information on all connected sensors:                                                                              |                       |
|         {                                      |                           |                                        | Information on one specific sensor:                                                                                |                       |
|             "sensor_id"                        |  11,                      | Sensor ID                              |                                                                                                                    | used                  |
|             "sample_periode_multiplier"        |  1,                       | Sample periode multiplier              | measuring period of this sensor = sample_periode \* sample_periode_multiplier                                      | no                    |
|             "sample_cast_periode_multiplier"   |  1,                       | Sample cast periode multiplier         | measuring period of this sensor during cast = sample_periode \* sample_cast_periode_multiplier                     | no                    |
|             "bus_address"                      |  2,                       | Bus address                            | Address of the interfaceboard of this sensor in the I2C bus                                                        | no                    |
|             "calib_coeff"                      |  {                        | Calibration coefficients               |                                                                                                                    | used                  |
|                 "0"                            |  \-1.128306E+1,           |                                        | 0 to 10 calib coefficients can be given to one sensor                                                              | used                  |
|                 "1"                            |  233434534                |                                        |                                                                                                                    | used                  |
|             },                                 |                           |                                        |                                                                                                                    |                       |
|             "sensor_type"                      |  {                        |                                        | All information on the type of this sensor:                                                                        |                       |
|                 "sensor_type_id"               |  7,                       | Sensor type ID                         | (only needed as meta data)                                                                                         | used                  |
|                 "parameter"                    |  "temperature",           | Parameter                              | (only needed as meta data)                                                                                         | used                  |
|                 "long_name"                    |  "sea_water_temperature", | Long name                              | (only needed as meta data)                                                                                         | used                  |
|                 "unit"                         |  "degC",                  | Unit                                   | (only needed as meta data)                                                                                         | used                  |
|                 "manufacturer"                 |  "AML",                   | Manufacturer                           | (only needed as meta data)                                                                                         | used                  |
|                 "model"                        |  "XchangeCT",             | Model                                  | (only needed as meta data)                                                                                         | used                  |
|                 "serial_number"                |  "123456",                | Serial number                          | (only needed as meta data)                                                                                         | used                  |
|                 "parameter_no"                 |  1,                       | Parameter no                           | Shall be used if a sensor can measure more than one parameter (to set the order of the parameters)                 | no                    |
|                 "accuracy"                     |  0.01,                    | Accurancy                              | (only needed as meta data)                                                                                         | used                  |
|                 "resolution"                   |  0.001                    | Resolution                             | (only needed as meta data)                                                                                         | used                  |
|             }                                  |                           |                                        |                                                                                                                    |                       |
|         },                                     |                           |                                        |                                                                                                                    |                       |
|         {                                      |                           |                                        |                                                                                                                    |                       |
|             "sensor_id"                        |  23,                      |                                        |                                                                                                                    |                       |
|             "sample_periode_multiplier"        |  2,                       |                                        |                                                                                                                    |                       |
|             "sample_periode_multiplier_upcast" |  1,                       |                                        |                                                                                                                    |                       |

