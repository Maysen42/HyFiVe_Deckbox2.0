Logger
=====

The logger is the subsystem that can implement multiple sensors in hardware. When submerged in the water it measures multiple parameters which are transmitted after the end of a deployment. The data is transmitted to 
the deckunit wireless and further processed afterwards.

The sensors can be implemented in a modluar way which makes it possible to measure different parameters with sensors of any manufacturer. Therefore, the logger can be adapted to the use case. So far sensors for conductivity, 
temperature, pressure (CTD) and oxygen have been implemented and tested. The documentation in this folder will explain how to build a logger for CTD and O2 with four specific sensors in hardware and software. A brief 
overview of the steps is given below. However, you can also customize your logger with a different set of sensors.

***Warning:* Make sure you understand every step of the documentation to prevent errors and damage to hardware, yourself and others.**

<figure> 
   <img src="media/mounted.jpg"  width="800" title="finished_logger">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Finished logger*</figurecaption>
</figure>


1. **Electronics**: The electronics are used to integrate the sensors and transmitt data wireless. The corresponding readme of *01_Electronics* explaines which components are necessary to assemble for the desired usage.

2. **Software**: The software is mostly commented in the code. A brief desription however is given in the readme of the subfolder *02_Software* including instructions on how to flash the microcontroller.
 
3. **Mechanical hardware**:  


4. **Sensors**: The sensors that have been tested so far are listed and described breifly in *04_Sensors*. For every sensor there is an expanation of how to connect it to the PCB and wich libraries are relevant in the software.

	A cap with four sensors for CTD and Oxygen mounted is dispayed in the images below.
<figure>
   <img src="media/cap_side.png"  height="300" title="cap_side">
   <img src="media/cap_front.png"  height="300" title="cap_side">
   
   <figurecaption><a name="figure3">*Figure 3:*</a> *Sensors mounted to the cap*</figurecaption>
 </figure>

## Assembly

### BOM

| #  | Amount | Name                                                                  |
| -- | ------ | --------------------------------------------------------------------- |
|    |        | **Pressure cylinder**                                                     |
| 1  | 1      | Cylinder, POM, D 76/90, L 275, according to drawing                   |
| 2  | 1      | End cap for sensors, according to drawing                             |
| 3  | 1      | End cap for charing, according to drawing                             |
| 4  | 6      | Screws M3 x 14, hexagonal, stainless A4                               |
| 5  | 4      | O-ring 70 x 3, NBR70                                                  |
| 6  | 1      | O-ring lube, e.g. Molycote 44 Medium                                  |
|    |        | **Internal mounting**                                                     |
| 7  | 1      | Mounting for electronic components, 3D printed                        |
| 8  | 1      | Mounting for battery pack, 3D printed                                 |
| 9  | 4      | Tapping screw, M2.9 x 9.5, for attaching main PCB                     |
| 10 | 1      | Screws M6 x 14, hexagonal                                             |
| 11 | 2      | Thread rod M2.5, length 75 mm                                         |
| 12 | 4      | Nuts M2.5                                                             |
|    |        | **Sensors and accessories**                                               |
| 13 | 1      | Temperature: BlueRobotics Celsius Fast Responde, incl. O-ring and nut |
| 14 | 1      | Pressure: Keller 20D, 50bar, incl. adapter PCB                        |
| 15 | 1      | Oxygen: Pyroscience picoO2sub incl. Oxycap-sub, O-ring and nut        |
| 16 | 1      | Conductivity: Atlas Scientific K1.0 incl. adapter board               |
| 17 | 1      | Bushing for conductivity sensor, incl. distance sleeve for potting                                       |
| 18 | 1      | Nut M18x1 ('Sechskant-Gegenmutter')                                   |
| 19 | 2      | O-ring, 15.5 x 2, NBR70                                               |
| 20 | 1      | Pressure valve, BlueRobotics PRV-R1, incl. O-rings and nut            |
| 21 | 1      | Vacuum pump, BlueRobotics Vacuum-Pump-R1, incl. adapter for PRV       |
|    |        | **Penetrators Charging side**                                             |
| 22 | 2      | Penetrator for charging, according to drawing                         |
| 23 | 1      | Penetrator for LED, according to drawing                              |
| 24 | 6      | O-ring 8.5x 1.5, NBR70                                                |
| 25 | 3      | Nut M10, hexagonal, flat, stainless A4, DIN439/ISO4035                |
| 26 | 2      | Washer with single head solder terminal, M2.2xM10.2, tinned copper    |
| 27 | 1      | Mounting for reed switch incl. 1 M3x8 hex screws                      |