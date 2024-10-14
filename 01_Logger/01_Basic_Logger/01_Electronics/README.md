
# Basic Logger - Electronics

The hardware is designed and can be modified in KiCad 7. Therefore the folder **/HyfiveLib** contains custom footprints and schematics for the projects below.

## Main PCB
The main PCB is designed to run the operations of the logger. It features an ESP32 as a micro controller and some peripheral components to integrate a wide range of sensors. To assemble a PCB for a logger follow the instructions of the [BOM.md](./BOM.md). The basic logger can implement sensors by

	- 3x I2C
	- 2x UART
	- 1x RS485

To select possible sensors to implement take a look into the subfolder [*../04_Sensors*](../04_Sensors/). The list can of course be extended. So far all sensors except the ones by BlueRobotics are connected with Molex PicoBlade connectors. How to connect each sensor in hardware is described in the sensor readme.

How to program the electronics after manufacturing is explained in the subfolder [*../03_Software*](../03_Software/).

A basic version of the PCB is shown in the image below.

<figure> 
   <img src="media/pcb.jpg" alt="image" height="250" width="auto"/>

   <figurecaption><a name="figure1">*Figure 1:*</a> *Main PCB inside the basic logger*</figurecaption>
</figure>



## Keller connector
  
One additional PCB, that is needed to implement a Keller 9LD pressure sensor, is given in **/KellerConnector**. The PCB can be soldered to the pins of the sensor and can then be directly connected to I2C1 (53261-0471) of the main PCB with a 4 pin Molex connector (15134-0402).

<figure> 
	<img src="../04_Sensors/media/keller_top.png" alt="image" height="250" width="auto"/>

   <figurecaption><a name="figure2">*Figure 2:*</a> *Small PCB for interfacing the Keller pressure sensor*</figurecaption>
</figure>


## Battery

The power supply of the logger can be any battery pack that fits the case. We have user 12 LiPo (3,7 V, type 18650) cells in parallel (12P1S) with the connector Molex: 15136-0203. This fits to the power socket of the PCB (55935-0230).