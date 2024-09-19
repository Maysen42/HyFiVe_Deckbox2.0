# Basic Logger

The documentation in this folder will explain how to build a basic logger for CTD and O2 with four specific sensors in hardware and software.

<figure> 
   <img src="media/logger_basic_text.svg"  width="1000" title="finished_logger">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Basic logger without pressure housing*</figurecaption>
</figure>


1. [**Electronics**](./01_Electronics/README.md): The electronics are used to integrate the sensors and transmit data wireless. The corresponding readme of *01_Electronics* explains which components are necessary to assemble for the desired usage.

2. [**Mechanics**](./02_Mechanics/README.md): The readme of the corresponding subfolder *02_Mechanics* gives a detailed description, how the mechanical hardware (especially the pressure housing and mountings) is designed and how it can be manufactured and assembled.

3. [**Software**](./03_Software/README.md): The software is mostly commented in the code. A brief description however is given in the readme of the subfolder *03_Software* including instructions on how to flash the micro controller.
 
4. [**Sensors**](./04_Sensors/README.md): The sensors that have been tested so far are listed and described briefly in *04_Sensors*. For every sensor there is an explanation of how to connect it to the PCB and which libraries are relevant in the software.

	A cap with four sensors for CTD and Oxygen mounted is displayed in the images below.
<figure>
   <img src="media/cap_side.png"  height="300" title="cap_side">
   <img src="media/cap_front.png"  height="300" title="cap_side">
   
   <figurecaption><a name="figure3">*Figure 3:*</a> *Sensors mounted to the cap*</figurecaption>
 </figure>

