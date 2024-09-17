Logger
=====

The logger is the subsystem that can implement multiple sensors in hardware. When submerged in the water it measures multiple parameters which are transmitted after the end of a deployment. The data is transmitted to 
the deckunit wireless and further processed afterwards.

The sensors can be implemented in a modluar way which makes it possible to measure different parameters with sensors of any manufacturer. Therefore, the logger can be adapted to the use case. So far sensors for conductivity, 
temperature, pressure (CTD) and oxygen have been implemented and tested. The documentation in this folder will explain how to build a logger for CTD and O2 with four specific sensors in hardware and software. A brief 
overview of the steps is given below. However, you can also customize your logger with a different set of sensors.

***Warning:* Make sure you understand every step of the documentation to prevent errors and damage to hardware, yourself and others.**

<figure> 
   <img src="media/logger_basic_text.svg"  width="1000" title="finished_logger">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Basic logger without pressure housing*</figurecaption>
</figure>


1. **Electronics**: The electronics are used to integrate the sensors and transmitt data wireless. The corresponding readme of *01_Electronics* explaines which components are necessary to assemble for the desired usage.

2. **Mechanics**: The readme of the correspondig subfolder *02_Mechanics* gives a detailed description, how the mechanical hardware (especially the pressure housing and mountings) is designed and how it can be manufactured and assembled.

3. **Software**: The software is mostly commented in the code. A brief desription however is given in the readme of the subfolder *03_Software* including instructions on how to flash the microcontroller.
 
4. **Sensors**: The sensors that have been tested so far are listed and described breifly in *04_Sensors*. For every sensor there is an expanation of how to connect it to the PCB and wich libraries are relevant in the software.

	A cap with four sensors for CTD and Oxygen mounted is dispayed in the images below.
<figure>
   <img src="media/cap_side.png"  height="300" title="cap_side">
   <img src="media/cap_front.png"  height="300" title="cap_side">
   
   <figurecaption><a name="figure3">*Figure 3:*</a> *Sensors mounted to the cap*</figurecaption>
 </figure>

