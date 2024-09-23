# Deck box

<figure> 
   <img src="./01_Hardware/media/deckbox_on_deck2.jpg"  width=700 title="deckbox_on_deck">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Deck box installed on mast of fishing vessel using steel mounting*</figurecaption>
</figure>

## Main Components

The main hardware components of the deck box are:
- Router RUT955 by Teltonika
- Raspberry Pi 4B
- power supply and antennas
- waterproof case incl. internal and external mounting

## Main Functionalities 
The router provides:
- Wifi incl. MQTT broker for communication to the logger
- Mobile internet connection for communication to server
- GPS, published as NMEA string
- NTP server for time update of logger
- VPN client incl. port forwarding to Pi for remote servicing of deck box

The Raspberry Pi runs the main functionalities of the deck box:
- InfluxDB: Timeseries database for storing measuring data locally and buffering GPS data
- NodeRED: Handling all data flows:
    - measuring data is received via MQTT, merged with GPS data and stored locally
    - measuring data is saved as netCDF file and send to server in regular intervals
    - status files are received from loggers and forwarded to server
    - config files are downloaded from server in regular intervals
    - config files are send via MQTT, if requested by logger (incl. writing an error log)
- Grafana: Webinterface available for crew on board to visualize measuring data offline
- Self developed visualization webinterface (by a student): Installation is described, but files not contained in this repo, see [https://github.com/TreeM4n/HyFiVe](https://github.com/TreeM4n/HyFiVe)
- Docker and Portainer: Used for encapsuling above software

## Instructions

To build and configure a deck box follow the instructions in the following chapters:
1. [**Hardware:**](./01_Hardware/README.md) Description of the mechanic and electric hardware incl. Bills of Material.
2. [**Software:**](./02_Software/README.md) Description of the software setup.

<figure> 
   <img src="./01_Hardware/media/whole_deckbox_named.svg"  width=700 title="whole_deckbox_named">

   <figurecaption><a name="figure2">*Figure 2:*</a> *Look inside a deck box*</figurecaption>
</figure>

