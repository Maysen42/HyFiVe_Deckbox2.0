# Basic Logger - Software

## Configuration File

The configuration file contains parameters, which can be changed to control the behavior of the logger. An example file is located in this folder, containing all config parameters, see [./logger_10_config_202405071357.json](./logger_10_config_202405071357.json). 

Although it needs a correct config file, the basic logger is not using the full set of config parameters included in the config file. For a detailed description of all parameters incl. which are used by the basic logger, please s. [02_modular_logger/03_software](../../02_Modular_Logger/03_Software/) 

### Config Parameters

The configuration file contains information from the database such as
- *logger_id*
- *operation_mode*
- *fw_version*
- *num_sensors*	- number of sensors
- *deckunit_id*
- *platform_id*
- *vessel information* - vessel_name, vessel_id
- *contact information*
- *sensor inforamtion* - sensor_ids, calbration information, sensor_type

and other additional information for the functionality:
- *WiFi credentials*
- *config_update_periode*		- interval in seconds when to check for update
- *status_upload_periode*		- interval in seconds when to upload new status
- *sample_periode*		- interval in seconds in which to sample
- *sample_cast_enable*
- *sample_cast_periode*
- *cast_det_sensor*		- id of the sensor that detects the cast
- *cast_det_sensor_threshold*	- threshold to detect a cast
- *wet_det_sensor*		- id of the sensor that detects the sensor is in-Situ
- *wet_det_periode*		- interval in seconds to check if the logger has entered the water
- *wet_det_threshold*		- threshold to detect if the logger has entered the water
- *dry_det_sensor*		- id of the sensor that detects the logger left the water
- *dry_det_threshold*		- threshold to detect if the logger has left the water
- *dry_det_verify_delay*	- time in seconds after which the logger will transmitt the measured data
- *data_upload_retry_periode*	- interval in seconds  after which the logger will try to transmitt data again, if it did not work the las time

### Preparing the SD Card and Inserting Config File
Prepare a configuration JSON file with the configuration interface installed on the server (e.g. hyfive.info:4000). 

Prepare a micro SD card (4GB) formatted in FAT32 with the following folders and a configuration file to then insert it into the micro SD card holder J9 on the PCB:
```
\measurements\
\info\
	header\
	config\
		config_file.json
\backup\
	measurements\
```

## Software to Run the Logger with All Features

The logger is programmed in C++ with the PlatformIO plugin of VS Code and uses the Arduino framework.

The software runs on the micro controller of the logger. The code integrates multiple sensors that are attached to the electronics, collects their measured values
and stores them on a SD card. It is able to detect the state (inside or outside of the water) by readings of the sensors. After surfacing it transfers the data wireless.
The state machine of the software is depicted in the figure below. Libraries with functions to take readings of the sensors must be implemented into the code according to
the hardware setup. Before deploying a system it is important, to look into the timing of sensors and their characteristics.

<figure> 
   <img src="media/Flowchart.jpg"  width="600">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Flowchart of the software's state machine*</figurecaption>
</figure>

To adapt the software it is important to look into the functions:

- Logger::init(): Reads in the config file and sets up some important behavior
- measure(&sample): Takes reading of the sensors. Here the timing of the individual sensors must be met to read them out properly and not have a long delay. Some sensors, such as oxygen, are compensated by temperature and need that value before.
- loop(): The main loop with the state machine

## Flash the Micro Controller ESP32
The UART programmer listed in the BOM of the folder *01_Hardware* can be used to flash the ESP32. The pins should be connected to the Molex 15134-0602 as follows where pin DTR on the PCB (lowest one of the Molex connector in the picture) must be easy to unplug from CTS of the programmer. We recommend using a female pin header.

<figure> 
   <img src="media/connector.png"  width="600" title="finished_logger">

   <figurecaption><a name="figure2">*Figure 2:*</a> *Connection of the programmer to Molex 15134-0602 with a female pin header on the lowest pin.*</figurecaption>
</figure>

The PCB is powered by the battery and not the USB. The flow of flashing the micro controller is as follows:
1. Connect DTR to CTS.
2. Supply the PCB with power.
3. Click PlatformIO: Upload
4. When the terminal shows "Connecting to Port x: ...." press the button until the process continues
5. Disconnect DTR after the process is done
6. Clink PlatformIO: Serial Monitor to view the output and reboot the PCB