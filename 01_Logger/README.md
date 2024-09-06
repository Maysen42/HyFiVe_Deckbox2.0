# Different Versions of HyFiVe Loggers

We developed two versions of HyFiVe loggers. The HyFiVe deckbox and the server do not need to be adapted to the logger version, they work with both.

There are no significant difference between the two versions regarding: 
- Mechanics (Only one end cap and internal mountings are different)
- Sensors

The main differences between both versions are explained below. Both versions are explained in detail in the corresponding subfolders. 

## Basic Logger
This logger was developed by building prototypes from an early stage on (agile development). The prototypes were deployed in field tests and the results used to improve the design. All measuring campaignes in the first HyFiVe project were conducted with this logger version, resulting in more than 10 vessels until 09.2024. 

The electronic design is straight forward and easier to reproduce than the modular logger. It is based on only one PCB. All sensors are directly interfaced to microcontroller on the PCB. 

PICTURE

## Modular Logger
This logger offers more functionalities and it's design is more complex. The development took more time, so the prototypes could only be tested in harbour tests until the end of the first HyFiVe project in 09.2024. 

The modularity is the main difference between both versions: In the modular logger each sensor is connected to one interface PCB. All interface PCBs are connected to a main PCB. The communication between main PCB and interface PCB is standardised. In this way, all sensor specific things can be encapsulated on the interace PCB.

In comparison to the basic version, the modular logger offers the following additional features: 
 - Modular design facilitates integrating and changing sensors, s. above.
 - Battery management
 - Charging of batteries without opening pressure case 
 - LED for feedback
 - Magnetic switch, e.g. for resetting the logger
 - Easier update of logger configuration: Manual trigger of update with magnet possible, more config parameters available, more precautions taken for stable config update
 - Error Log
 - Special operation modes possible: Change of sample rate for single sensors or during down- and upcast
 
PICTURE