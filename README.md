![Picture](media/HyFive_Logo_schwarz_blau.svg)

Hydrography on Fishing Vessels
=====

This project enables you to build you own HyFiVe system with detailed instructions on how to setup all parts to measure hydrographic parameters. It 
follwos a modular approach implementing sensors, applies wireless data transfer to land, and functions autonomous while measuring and transferring data. Measured data is geo-
referenced by the system.

The system is scalable in the amount of devices in the field so that a fleet of instruments can be deployed while beeing maintained remotly from land. It was first 
designed to be deployed on fishing vessels as ships of opportunity but can also be deployed in other use cases with a citizen science approach.

Measuring autonomously the system provides the acquired data with meta information to make it as reliable as possible.	

# Components
The system is made up of three substsems:
1. Logger: Measures data with implemented OEM sensors while in the water and transmitts them wireless afterwards.
2. Deck Box: Provides wirless infrastructure in the field, manages data traffic, and tracks GPS for geo-referencing.
3. Land-Based Server: Central infrastructure with a relational databases, a configruation interface for remote maintanance and a tool for visualisation of all data.

All subsystems have separate folders with hardware, software and specific information including READMEs which can be followed step by step. The READMEs contain
- Purpose and short description
- Used tools (hardware and software)
- Bills of Materials
- Additional information in the making/deploying

For full functionality the system should only be applied combining all three subsystems.
	
# Additional Information
Within the design it was aimed to use standard naming of variables according to https://cfconventions.org/. 

# Licenses
Hyfive is an open-source project consisting of software, hardware, and documentation components. Each part of this project is licensed under a different copyleft license to ensure it remains free and open:

- Software/Code is licensed under [MPL-2.0](LICENSE_MPL-2.0)
- Hardware is licensed under [CERN-OHL-W-2.0 or later](LICENSE_CERN-OHL-W-2.0)
- Documentation is licensed under [CC-BY-SA-4.0](LICENSE_CC-BY-SA-4.0)

The Hyfive logo is not published under above licenses and not free to use. 
