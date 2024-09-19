
# Basic Logger - Electronics - Bill of Material

# Main PCB
  
To manufacture the electronic hardware of a logger order the PCB in **/Rev_01** at the manufacturer of your choice. To assemble the PCB to your needs follow the instructions and the bill of materials in the tables below. The schematics and board design in **/Rev_01** provide additional information for the assembly.  

 **Note:** The connection between the hardware and software is very close in this embedded design. Understanding and testing the the hardware in detail is highly recommended before usage. GPIOs of the micro controller are used in the code to switch components such as sensors and the SD card and can lead to errors in case of changes.

## Main Components for PCB Rev_01

These are components needed in any case to run the micro controller and his basic functions.

U3 is used to protect the power supply from deep discharge. With the combination of R22 and R21 it will turn everything off, when the battery falls below 3.55 V. If this is not needed, bridge pin 7 & 8 of U3.

**Note:** when using Blue Robotics sensors, I2C1 and I2C2 should be replaced with BM04B-GHS-TBT to connect them easily.
|Reference|Amount|Value|Footprint|Manufacturer Part Number|
| :---: | :---: | :---: | :---: | :---: |
|C1|1|10n|Capacitor_SMD:C_0805_2012Metric||
|C7, C8|2|1µ|Capacitor_SMD:C_0805_2012Metric||
|H1, H2, H3|3|MountingHole|MountingHole:MountingHole_3.2mm_M3||
|H4, H5|2|MountingHole|MountingHole:MountingHole_3.2mm_M3_DIN965||
|I2C1, I2C2|2|Conn_01x04_MountingPin|Connector_Molex:Molex_PicoBlade_53261-0471_1x04-1MP_P1.25mm_Horizontal|53261-0471|
|I2C3_5Pin1|1|Conn_01x05_MountingPin|Connector_Molex:Molex_PicoBlade_53261-0571_1x05-1MP_P1.25mm_Horizontal|53261-0571|
|J9|1|Micro_SD_Card|Hyfive:GCT_MEM2067-02-180-00-A_REVB|MEM2067-02-180-00-A|
|Molex_Battery1|1|Conn_01x02|Connector_Molex:Molex_MicroClasp_55935-0230_1x02_P2.00mm_Horizontal|55935-0230|
|Molex_Usb1|1|Conn_01x06_MountingPin|Connector_Molex:Molex_PicoBlade_53261-0671_1x06-1MP_P1.25mm_Horizontal|53261-0671|
|Q1, Q2, Q5|3|SS8050-G|Package_TO_SOT_SMD:SOT-23-3|SS8050-G|
|Q6|1|BSS83P|Package_TO_SOT_SMD:SOT-23|MMFTP84|
|R7, R8, R13, R14|4|10k|Resistor_SMD:R_0603_1608Metric||
|R15, R16|2|1k|Resistor_SMD:R_0603_1608Metric||
|R18, R19|2|15k|Resistor_SMD:R_0603_1608Metric||
|R20|1|2M2|Resistor_SMD:R_0603_1608Metric||
|R21, R25, R26|3|1M|Resistor_SMD:R_0603_1608Metric||
|RTC1|1|Conn_01x08|Hyfive:DS3231Module|3013|
|SW1|1|SW_DIP_x01|Button_Switch_SMD:SW_DIP_SPSTx01_Slide_6.7x4.1mm_W8.61mm_P2.54mm_LowProfile|434111025826|
|U2|1|RT9080-33GJ5|Package_TO_SOT_SMD:SOT-23-5|RT9080-33GJ5|
|U3|1|LTC1540|Package_SO:SOIC-8-1EP_3.9x4.9mm_P1.27mm_EP2.29x3mm|LTC1540CS8#TRPBF|
|U4|1|ESP32-S3-WROOM-1|PCM_Espressif:ESP32-S3-WROOM-1U|ESP32-S3-WROOM-1U-N16R2|

## Optional components according to the used sensors

### UART1 with boost converter (13V) and optional RS485


These components enable a higher supply voltage for one sensor. The voltage can be adjusted by the setup of R3, R23, R2 and R24.
|Reference|Amount|Value|Footprint|Manufacturer Part Number|
| :---: | :---: | :---: | :---: | :---: |
|C18|1|10µ|Capacitor_SMD:C_0805_2012Metric|TMK212BBJ106KG8T|
|C19|1|10n|Capacitor_SMD:C_0805_2012Metric||
|C20|1|2,2n|Capacitor_SMD:C_0805_2012Metric||
|C21|1|4,7µ|Capacitor_SMD:C_0805_2012Metric|GCM21BC71E475KE36L|
|D2|1|D_Schottky|Diode_SMD:D_1206_3216Metric|CD1206-B240|
|IC1|1|MP3213DH-LF-Z|Package_SO:MSOP-8-1EP_3x3mm_P0.65mm_EP1.95x2.15mm|MP3213DH-LF-Z|
|L2|1|4,7µ|Inductor_SMD:L_Bourns-SRN4018|SRN4018-4R7M|
|Q3|1|SS8050-G|Package_TO_SOT_SMD:SOT-23-3|SS8050-G|
|Q4|1|BSS83P|Package_TO_SOT_SMD:SOT-23|MMFTP84|
|R2, R24|2|12k|Resistor_SMD:R_0603_1608Metric||
|R3, R23|2|470k|Resistor_SMD:R_0603_1608Metric||
|R4, R5, R22|3|15k|Resistor_SMD:R_0603_1608Metric||
|R9, R10|2|100k|Resistor_SMD:R_0603_1608Metric||
|Uart2_RS485_V8|1|Conn_01x04_MountingPin|Connector_Molex:Molex_PicoBlade_53261-0471_1x04-1MP_P1.25mm_Horizontal|53261-0471|

### UART1 or RS485

For using UART1 use
|Reference|Amount|Value|Footprint|Manufacturer Part Number|
| :---: | :---: | :---: | :---: | :---: |
|R40, R42|2|0|Resistor_SMD:R_0603_1608Metric||

For using RS485 use
|Reference|Amount|Value|Footprint|Manufacturer Part Number|
| :---: | :---: | :---: | :---: | :---: |
|R6, R12|2|1k|Resistor_SMD:R_0603_1608Metric||
|R41, R43|2|0|Resistor_SMD:R_0603_1608Metric||
|U1|1|THVD14x9|Package_SO:SOIC-8_3.9x4.9mm_P1.27mm|THVD1429DT|

### UART2, 3.3V

UART2 runs with 3.3V and can be switched off by a high side switch.
|Reference|Amount|Value|Footprint|Manufacturer Part Number|
| :---: | :---: | :---: | :---: | :---: |
|Q9|1|SS8050-G|Package_TO_SOT_SMD:SOT-23-3|SS8050-G|
|Q10|1|BSS83P|Package_TO_SOT_SMD:SOT-23|MMFTP84|
|R1, R11|2|100k|Resistor_SMD:R_0603_1608Metric||
|R29, R30|2|15k|Resistor_SMD:R_0603_1608Metric||
|Uart2|1|Conn_01x04_MountingPin|Connector_Molex:Molex_PicoBlade_53261-0471_1x04-1MP_P1.25mm_Horizontal|53261-0471|

# External components to implement the sensors and power the system

|Reference|Amount|Function|Manufacturer Part Number|
| :---: | :---: | :---: | :---: |
|Molex connector I2C|4|Connect 4 pin I2C sensor|Molex: 15134-0402|
|Molex connector I2C|1|Connect 5 pin I2C sensor|Molex: 15134-0502|
|Molex connector UART|1|Connect programmer|Molex: 15134-0602|
|Molex connector V+|1|Connect power|Molex: 15136-0203|
|Molex Antenna|1|Improve connection of ESP|Molex: 47950-0011|
|UART Progammer|1|Programm the ESP32 with code|Digilent: 410-212|
