# How to Manufacture a HyFiVe Deck Box - Software

This document explains how to install and configure the software on the deck box in detail. A computer running Windows 10 has been used to set up the system with Firefox as a default browser. 

The standard username is 'admin', a standard password should be chosen and will be written as 'xxxx' in the following.

## Initial Setup of Raspberry Pi

### (Optional) Using an Image of a Working Deck Box

The fastest way to set up the Pi is to use an image of a working deck box. You can download the latest image from this Github repository (hyfive_raspberry_image` from the software folder).
Clone it to a SD card using the Raspberry Pi imager and insert in Pi. If the image is working fine, 
you only need to configure the router according to the following two chapters [Router setup](#setup-of-the-router) and [VPN setup](#setup-of-vpn-connection-to-pi).

### Initial setup

If not using an image, follow these instructions: 

1. Download and open Raspberry Pi Imager
2. Select Pi 4 and suitable 64-bit operating system (Raspberry Pi OS 64-bit)
3. Insert SD card, and chose it in Imager
4. Open Advanced settings (low right corner),  
```text
    host name               raspberrypi.local  
    Set Username            admin
    password                xxxx 
    choose local settings   ETC/UTC and de keyboard
    services                enable SSH, use password-authentification 
```
4. Write image
5. Insert SD card in Pi
6. The Pi is ready to boot.

<br/><br/>
___

## Setup of the Router

The router used is a RUT955 from Teltonika. It is set up the following way to provide a WiFi network and GPS positioning as well as work as MQTT broker and NTP server.  

### Wifi Connection and Firmware Update

Before connecting to the router, download  a new firmware for the router from Teltonika's webpage to your computer (https://wiki.teltonika-networks.com/view/RUT955_Firmware_Downloads)
This documentation is done based on version 07.06.3. If you want to use a back-up file for setting up the router, choose this version (see next chapter). 
Otherwise you can also use a newer firmware, but note that with new firmware versions the instructions might change a little. 
Especially where the settings are located in the menu. 

Power up router (SIM card not inserted), connect to its Wifi using the default passwort written on the router or by an ethernet cable.  
Open browser, enter router IP "192.168.1.1". Log into router with default user and passwort written its manual.  
Set new passwort. The login for all routers should be set to:
```text
    user: admin                       (not changed, note when logging in by ssh or CLI the user is root)
    password: xxxx!
```
If you have entered the wrong login several times, your IP gets blocked by the router. Connect via LAN cable, enter Webgui, go to system->administraion->access control->security and unblock your IP.  

Abort set-up wizard and update firmware
```text
    Go to System -> Firmware -> Upgrade via file -> chose downloaded file -> upgrade
```
Alternatively you can search for available update and upgrade via server. This takes more time, as you have to upgrade several times. After the login you need to reconnect to the wifi.  
After updating the firmware, change the mode of the webinterface from basic to advanced by clicking on basic in the top left corner of the interface.

### (Optional) Using Backup File of a Working Deck Box

Similar to using an image to set up the Pi, you can use a backup file of a working deck box to save time. 

You can download a generic backup file from this Github repository ('deckbox -> software -> deckbox_router_backup_20240422'). For this follow these steps:
1. In the router's GUI (under 192.168.1.1) navigate to `system -> Maintenance -> Backup`
2. Under `Restore Configuration`, click browse, choose the backup file, click Proceed, wait for rebooting
3. Now we individualize the deck box by giving it an unique ID. Under `Network -> Wireless -> SSIDs` click Edit. Replace the XX in the SSID with the unique ID of the manufactured deck box. 

If this setup worked you can continue with the chapter [Setup of VPN Connection to Pi](#setup-of-vpn-connection-to-pi).

### Setup wizzard

Return to the set-up wizard (system -> set-up wizard). Use default settings except:
```text
    Configuration mode: Advanced
    Time zone:      Set to UTC, update time manually
    LAN Config:     Take default values
    Mobile Config:  Auto APN, Enter pin of SIM card, chose 2G+4G
    WiFi:           Change SSID to HyfiveXX with XX equals HyFiVe Serial number of deck unit  
                    Change passwort to: xxxx!
                    Take default for other values
```
Reconnect to wifi with new password. Open webinterface again by typing IP in browser.  

To insert Sim card: Navigate to `Network->Mobile->General->SIM1` in the webinterface, doublecheck the PIN of your SIM card in PIN. 
Then power down the router, insert the SIM card in slot 1 and boot the router again. After logging in to the webinterface the router should show 
connection to the internet which is necessary for the next steps.

### NTP client

The router shall update its clock every five minutes:
```text
    System-> Administration -> Date&Time:
    Time zone                   UTC
    GPS synchronization         on
    GPS time update interval    every five minutes 
    -> NTP tab
    "enable NTP client"         on            
    Updateintervall             300 s 
```
For time synchronization enable the NTP server of the router so that the sensor carriers and Raspberry Pi can synchronize their clocks. On the same page: 
```text
    NTP Server - activate       on
```

### MQTT

The MQTT broker of the router with the IP address 192.168.1.1 is used by the sensor carriers and NodeRed on the Pi. Enable MQTT broker and external access:

First install the MQTT package (internet access required):
```text
    System -> package manager -> packages -> search 'MQTT' -> install
```
After installation:
```text 
    Services -> MQTT -> Broker:
    MQTT broker                 on
    local port                  1883
    enable remote access        on
    Broker settings -> Misc -> allow anonymous      on
```

### IP/DNS

Pi and router should be connected by LAN cable. For remote access and NMEA forwarding the IP of the Pi needs to be determined. The router will assign an IP automatically to the MAC address of the raspberry. First the MAC address of the Pi is determined by the following steps:
```text
    status->network->lan->DHCP leases->find Raspberry Pi
    if pi is not found: Status -> network -> topology -> scan lan
    Save Mac address of pi
```
Now the IP of the Pi will be permanently changed using static lease. This way the PIs in all deck boxes have the same IP.

```text
    network -> DHCP -> static lease
    Add a new instance with
        IP 192.168.1.123
        MAC address of pi
        name deckboxPi 
```

A reboot might be necessary.

### GPS
After the IP address of the Raspberry Pi is known, configure the GPS forwarding.  
Inside the router GUI:
```text
    Go to Services->GPS->General
    Enable all three NMEA supports
    Go to Services/Dienste->GPS->NMEA
        NMEA forwarding             Enable
        Hostname                    IP of Raspberry Pi (192.168.1.123)
        Protocol                    UDP
        Port                        8500
        NMEA sentence settings      GPRMC enable, forwarding interval 1 s
```
Node Red will handle the forwarded data.




<br/><br/>
___

## Setup of VPN Connection to Pi

To be able to connect to the Raspberry Pi inside the deck box even remotely over the internet, you can configure the following VPN connection. It requires a VPN server and input from the servers admin. The setup of the VPN server is documented separately. 

### Connect Own Computer to Hyfive VPN

1. Install Openvpn client
2. Receive .ovnc config file from admin (includes key, certificates)
3. Drag .ovnc file in Openvnc client and connect

### Connect Router to Hyfive VPN

1. Receive key and certification files from vpn admin.
2. Open Router Webinterface on 192.168.1.1.
3. Navigate to Services->VPN->OpenVPN
4. Enable advanced mode on top right of the GUI
5. Add new instance with name 'hyfive' as client
6. Edit VPN connection and change the following parameter:
```text
    enable          yes
    TUN/TAB         TUN (tunnel)
    Authentication  TLS
    Encryption      AES-256-GCM 256
    Remote host/IP address      hyfive.info
    Add. HMAC auth. Authentication only (tls-auth)
    Upload files for upload in following order: ta.key, ca.crt, DeckboxXX.crt and DeckboxXX.key 
```

To check, if the setup worked, you can open a ssh connection to the router via the program putty. User name is 'root' and password as set above 'xxxx'. Enter: 
```text
    ifconfig 
```   
If your IP is 10.8.0.XX you are connected via VPN. 

### Enable Port Forwarding on Router

In order to access ports on the Pi over VPN, they need to be forwarded by the router from the router's network to the VPN network. 

In the router webgui navigate to `network -> firewall -> port` forwarding. Enable advanced mode in top right of GUI. Add new instances with the following parameters. 

Take default parameter, **except** for 'Enable' ON and 'source zone', which shall be changed to OpenVPN

| Name              | External port | Internal IP address | Internal Port |
|-------------------|---------------|---------------------|---------------|
| Pi_Nodered        | 1880          | 192.168.1.123       | 1880          |
| Pi_Portainer      | 9000          | 192.168.1.123       | 9000          |
| Pi_Grafana        | 3000          | 192.168.1.123       | 3000          |
| Pi_Influx         | 8086          | 192.168.1.123       | 8086          |
| Pi_VNC            | 5900          | 192.168.1.123       | 5900          |
| Pi_SSH            | **23**        | 192.168.1.123       | **22**        |
| Pi_Webinterface   | **81**        | 192.168.1.123       | **80**        |

Note that the external port for Pi_SSH is set to 23. This way, you still access the router via SSH on port 10.8.0.XX:22 and the Pi via port 10.8.0.XX:23. In the same way you can access the webinterface of the router by entering 10.8.0.XX in the browser, while accessing the webinterface of the Pi by 10.8.0.XX:81.

### Identify Devices Connected to VPN

To check, which deck box and which user is currently connected to the VPN, and to identify their IPs, go to http://hyfive.info/ and log in with 
```text
    user:       user
    password:   yyyy
```




<br/><br/>
___

## Installation of Software on Raspberry Pi

The Raspberry Pi receives, processes, and sends data. For these tasks we use NodeRed in combination with InfluxDB. 
Both are installed inside docker containers. We choose Portainer as our docker GUI. The measuring data are visualized either using Grafana or the Hyfive Webinterface.  

Make sure you are connected to the network of the router for the following steps.

#### Find IP of Raspberry Pi

The IP of the Pi was set to 192.168.1.123 by static lease, s. above. If this did not work, the IP can be found by:
   - Option 1: &emsp; Use tool like Advanced IP Scanner  
   - Option 2: &emsp; Enter "arp -a" in cmd  
   - Option 3: &emsp; Open router webinterface in browser. Navigate `Status -> Network -> Lan/Wlan`: Here you see all connected devices

### Connect via SSH

We will use SSH connection for further configuration and installation processes. 
If not mentioned otherwise, all following commands are ment to be entered in the terminal of the Pi, accessed via SSH or VNC.

To connect to the terminal of the Pi you can use Windows command prompt (cmd) and enter: `ssh admin@192...your IP from above`.
Enter password (the password should be 'xxxx'). Don't mind, that no characters appear while typing password, just type and press enter.  

You can also use the software putty. This is recommended at least via VPN. In this case enter the IP of the Pi inside the VPN network and remember the port change/forwarding from 22 to 23, s. chapter about VPN.

### Connect via VNC

You can use VNC as a tool to transfer files to the Pi and as alternative to SSH for accessing its terminal. 

To use VNC you first need to enable it via SSH. Type into the Pis terminal:
```text
    sudo raspi-config
    Go to Interfacing Options->VNC->enable  
```
In VNC Viewer: `File -> New connection->` Enter IP of the deck box. Connect and enter user + password.

Comments on file transfer: Preferably use VNC Viewer because it comes with the best file transfer tool. Nevertheless, TigerVNC is recommended for newest PI OS Versions. TigerVNC can be installed from https://github.com/TigerVNC/tigervnc/releases. VNC Viewer is capable of transferring folders. In case you are using TigerVNC, folders needs to be ziped first. 


### Set NTP to Router

First keep your system up to date:
```text
    sudo apt-get update
    sudo apt-get upgrade -y
```

Synchronize Raspberry Pi and router time:
```text
    sudo timedatectl set-timezone UTC
    sudo timedatectl set-ntp true
    sudo nano /etc/systemd/timesyncd.conf
        add the line:
            FallbackNTP=192.168.1.1
            timedatectl status
        exit with ctrl+x, save
```

### Docker Installation

```text
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
```

Test Docker:
```text
    sudo docker run hello-world
```

### Portainer Installation

Install Portainer into Docker. On April 2024 the `portainer/portainer-ce` version encountered a bug during installation of Python packages. Therefore use the alternative/last line in the first half of 2024.
```text
        sudo docker volume create portainer_data
        Choose
            default (latest stable version): sudo docker run -d -p 9000:9000 -p 8000:8000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
            alternative (version 2.20.1, 2024): sudo docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.20.1
```
Open Portainer webgui in your browser by entering 192.168.1.123:9000. Add your credentials: 
```text 
        - User:admin
        - PW: xxxx
```
Choose "get started/local" as your environment

### Node-Red Installation

Install Node Red into Docker:
```text
    sudo docker volume create nodeRedData
    sudo docker run -d -it -p 1880:1880 -p 8500:8500/udp -v nodeRedData:/data --restart always --name nodered nodered/node-red
```
To install nodes, which are not preinstalled but needed, open nodered webgui 192.168.1.123:1880 (or 10.8.0.XX:1880 via VPN) in a browser. Navigate to menu (top right) -> manage palette -> installation and install the following packages:
```text
    - node-red-contrib-json
    - node-red-contrib-influxdb
    - node-red-contrib-sftp
```
Instead you can also install packages with essential nodes via command prompt inside the nodered container by entering it trough Portainer:
```text
    sudo docker exec -it nodered /bin/bash
    npm install node-red-contrib-json
    npm install node-red-contrib-influxdb
    npm install node-red-contrib-sftp
    npm update
    exit
```
This results in 8 vulnerabilities found (5 low, 3 moderate) by npm audit, which cannot be fixed by npm audit -fix. 
Uncertain if this is a problem and if this happens also by installing the nodes manually via webgui.

To install all required python libraries for executing python scripts, open Portainer by typing 192.168.1.123:9000 (VPN: 10.8.0.XX:9000) in your browser. 
Navigate to NodeRed Container (`local -> Container -> nodered)`, click on `>_ Console`, enter root as user and connect. Then: 
```text
    apk update
    apk upgrade
    apk add py3-pip
    apk add py3-numpy
    apk add py3-pandas
    apk add py3-scipy
    apk add expect
    apk add py3-matplotlib
    apk add py3-xarray
    pip install influxdb-client
```
Click disconnect.

### Grafana Installation 

Install Grafana into Docker:
```text
    sudo docker run -d  --name=grafana1 --restart always -p 3000:3000 grafana/grafana:latest
```
First your credentials are:

        - User: admin
        - PW: admin

Change it during first login on webgui 192.168.1.123:3000 to:
    
        - User:admin
        - PW: xxxx

### InfluxDB Installation 

Install InfluxDB into Docker:
```text
    sudo docker volume create influxdbData
    sudo docker run -it -d -p 8083:8083 -p 8086:8086 --name influxDB -v influxdbData:/var/lib/influxdb --restart always influxdb
```
In browser open InfluxDB webgui 192.168.1.123:8086. Enter your credentials:
```text
    username                    admin
    password                    xxxx
    Initial organisation name   hyfive
    Initial bucket name         localhyfive
    Continue, save your token!
    Continue in advanced setup
```



<br/><br/>
___
## Configuring Software on Raspberry Pi

### Restart Policy of containers in Portainer

Normally, each restart policy is set to `restart-always` by default. Double-check the default setting:

Open Portainer GUI under port 192.168.1.123:9000.
Select container, scroll to bottom, check restart "Restart Policy", if necessary change policy to "always".


### Bridge Network in Portainer

This bridge network enables its members to reach and call each other by their container names, instead of using IPs.

In Portainer GUI (192.168.1.123:9000) navigate to `Networks -> Add network`. Use following input and save
```text
    Name                                OwnBridge
    IP4 network config Subnet           172.19.0.0/16
```
Navigate to `Containers -> nodered -> Connected networks` join the Ownbridge network. Repeat for InfluxDB and Grafana.  

### Create Buckets in InfluxDB

Inside Influx webgui 192.168.1.123:8086, navigate to buckets. Create:
```text
    Bucket with name GpsBuffer and 'delete data older than 72 h'
```

Navigate to `API tokens -> generate API token` to generate an all access token named `hyfivetoken` and save this one well.

### Connecting Grafana and Influx

Open Grafana Gui on 192.168.1.123:3000. Navigate to `Connections -> Data sources -> search and add data source 'InfluxDB'`. Add the two data sources, by doing the following twice:

```text
    Name            'InfluxDB_GpsBuffer' and 'InfluxDB_localhyfive'
    Query language  Flux
    URL             http://influxDB:8086
    Base auth       disable
    Organisation    hyfive  
    Token           Insert token (all-access token 'hyfivetoken')
    Default bucket  'GpsBuffer' and 'localhyfive'
```
Now you can configure an own Dashboard to visualize measurement data. This is not further explained, as we use our own visualisation webinterface as default. 



<br/><br/>
___
## Node-RED Setup

### Importing Flow to Nodered and connect to InfluxDB

Open Nodered GUI under 192.168.1.123:1880. Import recent HyFiVe flow from this subfolder. 
Select `menu (top right) -> import -> choose file for import` and upload deckunit_01_NodeRed.json .  

For Nodered to be able to write data into InfluxDB, you need to enter your specific token. For this modify an influxdb node, e.g. 'influxdb batch' 
node called `Save GPS` by double-clicking its icon. Edit the server 'LocalInflux' by clicking the pencil symbol. 
Since all influx nodes in the flow use the server 'LocalInflux', you only need to enter the token at one node. Enter:
```text
    Token		all access hyfivetoken from above
    Save and exit node
    Deploy changes (top right corner)
```

### NetCDF 

To export data in NetCDF format, two python files needs to be loaded into the nodered container.
Final NetCDF files will be saved in a netcdf folder.

Open the nodered terminal inside the Pi's terminal:
```text
    sudo docker exec -it nodered /bin/bash
```
Enter:
```text
    mkdir netcdf
    mkdir python_scripts
    nano python_scripts/loadLocalData.py
        Copy text from GitHub MultiParamterLogger/AP3_Deckunit/03_Software/netcdf/loadLocalData.py (paste with right mouse click)
        exit with control+x and save
    nano python_scripts/create_netcdf.py
        Open Python script MultiParamterLogger/AP3_Deckunit/03_Software/netcdf/createOnPi.py in text editor, replace the token in line 18 with your all access hyfivetoken.
        Copy text from createOnPi.py with your new token
        exit and save
    nano python_scripts/recent_deployments.json
        Add the following text:
            {} 
        exit and save
    exit
```

Now, nodered is able to create NetCDF files via an execute node.

Note, that executing the scripts with an empty data base, will result in an error shown in the debug window of Nodered. This error will not compromise other functions of the deck box.

### Configuring SFTP in NodeRed

SFTP is needed to transfer the netCDF files to the server onshore and pick up configuration files. We enable nodered to trigger SFTP by editing it's container:

```text
    sudo docker exec -it nodered /bin/bash
    mkdir handle_data
    nano handle_data/push_sftp.sh
        copy the following text in the editor : 
            #!/usr/bin/expect
            spawn sftp loggermailbox@hyfive.info
            expect "password:"
            send "xxyy\n"
            expect "sftp>"
            send "put -r /usr/src/node-red/netcdf /in\n"
            expect "sftp>"
            send "exit\n"
            interact
        exit with control+x, save
    chmod 777 handle_data/push_sftp.sh
    nano handle_data/get_configs.sh
	copy the following text in the editor:
		#!/usr/bin/expect
		spawn sftp loggermailbox@hyfive.info
		expect "password:"
		send "xxyy\n"
		expect "sftp>"
		send "get -r /out/config/ /usr/src/node-red/\n"
		expect "sftp>"
		send "exit\n"
		interact
	exit with control+x, save
    chmod 777 handle_data/get_configs.sh
```

First connection to sftp server needs to be done manually (while still being in the nodered terminal):
```text
    sftp loggermailbox@hyfive.info
        continue 
        type in passwort: xxyy 
```
You can also paste the by right mouse click. Per default no characters of the password typed will be shown, just type and press enter. 

Confirm the connection. Close sftp by entering 'exit' as well as the terminal of Nodered by another 'exit'.


___
## Grafana Setup

### Enable unauthorized access
Enable unauthorized view of the home dashboard of Grafana by going to Portainer (Port 9000) and viewing the container of Grafana. Enter the console as user root. Open the 
defaults.ini by entering

```
    vi conf/defaults.ini
```
 Here several chaperts are marked as e.g. #### Paths ####. Scroll down to look for Anonymous Auth in line 598. Enter the insert mode by pressing 'i', change the flag 'enabled'
 of 'enable anonymous access' to true, leave the insert mode with 'esc', and save and leave the document with ':wq' (write quit). Restart the container and check if the main 
 dashboard can be seen without a login.
 
### Load the dashboard
Navigate to Dashboards and click New/Import. Then select the most recent JSON file for a dashboard in Grafana in this folder. Verify the import worked by checking the 
deschboard. You might have to change the data source for every Visualisation in the edit section. If the vairable '$Deployment' you might have to delete and recreate it. For 
this enter the dashboard, go to Dashboard Settings/Variables and add the variable. Name it Deployment and enter the query
```
from(bucket: "localhyfive")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "netcdf")
  |> filter(fn: (r) => r["_field"] == "pressure" )  
  |> distinct(column: "deployment_id")  
```
Make sure to select 'On time range change' for refresh. Don't forget to save.


<br/><br/>
___
## Setup of Webinterface for Visualisation of Measurement Data on Raspberry Pi

A webinterface can be used to view hyfive measurement data stored on the deck box. The webinterface was developed by Justus Baum. 

After installation, the website can be accessed by the IP of your Pi (local network http://192.168.1.123 or VPN 10.8.0.XX:81).  

### (Optional) For Updating Older Installations

In case an old version is installed, remove the html folder:
```text
sudo rm -r /var/www/html
```

### Installation on Pi directly from Github 

In case the internet connection of the Pi has a size of around 1.6 GB (mainly due to the offline maps). If your Pi has a stable enough internet connection, 
you can directly download and install the webinterface with:
```text
wget -O quick-setup.sh "https://raw.githubusercontent.com/TreeM4n/HyFiVe/main/quick-setup.sh" && chmod +x quick-setup.sh && bash quick-setup.sh
 ```

This gives the following error:
```text
quick-setup.sh: line 17: cd: HyFiVe-master: No such file or directory
chmod: cannot access 'setup.sh': No such file or directory
Running setup.sh...
quick-setup.sh: line 24: ./setup.sh: No such file or directory
Cleaning up...
rm: cannot remove 'master.zip': No such file or directory
Installation completed.
```
Open quick-setup.sh and manually execute the given commands, this should work.

### Installation via Your Computer and SSH

Alternatively you can download the package to your computer and transfer the data via SSH. 

1. For this download and extract the archive under https://github.com/TreeM4n/HyFiVe/archive/master.zip
2. Transfer the unzipped folder to a folder of your choice on the Pi. You can use one of the tools mentioned in the VNC chapter, SFTP, or another tool of your choice.
3. Then navigate to the folder in the Pis terminal and execute setup.sh:
```text
cd path_of_transferred_folder
chmod +x setup.sh 
./setup.sh
```
4. Clean up the transferred files
```text
cd ..
rm -r HyFiVe-main
```

### Connect Webinterface to InfluxDB

Modify the settings of the webinterface by:
```text
    nano /var/www/html/settings.json
        Change values of following variables, leave json syntax intact: 
            url         http://192.168.1.123:8086
            token       Insert all access hyfivetoken
            org         hyfive
            bucket      localhyfive
            username    admin
            password    xxxx
        exit with ctrl+x, save
```

For this config to work, you need to restart the Pi, restarting apache server is not enough (sudo /etc/init.d/apache2 restart)






<br/><br/>
___
## Test Your Deck Box

Now your deck box should work properly. Before deploying it on a vessel, you can test the whole measuring system by a test deployment of your logger.
If no logger is available, you should at least verify the functionality by the following test in Nodered. 

The imported flow 'CheckFunctionality' in Nodered simulates a logger sending a deployment by sending dummy measuring data in MQTT. 
This data will be handled by the main flow, like usual measurement data would be. This dummy deployment consists of approx. 20s of CTD data.

Start the test:
- Make sure that you had GPS reception in the last 30 s. 
- Open Nodered's Webgui under 192.168.1.123:1880 (or 10.8.6.XX:1880 via VPN), open flow 'CheckFunctionality' and press 'start the test'. 
- Press inject at netcdf flow.

In result, the deck box should perform the following basic functions:
- Test data runs through main flow for measured data and header data in Nodered 
- Test data is merged with GPS data and written into Influxdb
- Webgui can visualize test data 
- NetCDF files are created with Python Script and send via sFTP to Server

Test the correct implementation of these functions:
1. Check if test data is shown in visualisation interface (192.168.1.123). If not, possible reasons are:
   - Connection between Influxdb and visualisation interface is corrupted
2. (can be skipped if check 1. worked out:) Check if data was written in the InfluxDB via its webgui (192.168.1.123:8086 -> data explorer -> from 'localhyfive->netcdf->pressure' -> submit). If not, possible reasons are: 
   - Main flow is corrupted (e.g. wrong token for accessing influxdb)
3. Check (inside visualisation interface or influxdb), if test data is accompanied by GPS information. If not, possible reasons are:
   - No GPS signal received before test
   - GPS data was not written into GpsBuffer bucket of Influx
   - Main flow could not read GpsBuffer and merge it 
4. Check on server, if netcdf file was written on server as mailbox/in/netcdf/Logger_01_deployment_01. Check if creation date corresponds to your test. If yes, your deck box works fine. If not, possible reasons are:
   - Old file with same name was still present on server from old test
   - Python scripts run into an error (most common: Deployment1 of Logger 1 not removed from recent_deployments.json, see code below)
   - No internet connection of the router, no access to the server (login data for sFTP)

After the test, you should remove the following traces of the test deployment (this is a requirement to be able to repeat the test):
- Delete the mailbox/in/netcdf/Logger_01_deployment_01.nc on the server
- Help the deck box forget, that it already transmitted the test deployment before:
```text
    sudo docker exec -it nodered /bin/bash
    nano python_scripts/recent_deployments.json
        replace {"1": [1]} with:
            {}
        exit with ctrl+x and save
    exit
```

Above procedure does not test the NTP server, the wifi and the VPN connection of the router. Check manually if you can connect to via Wifi and via VPN to the Raspberry. 

Congratulations to your new deck box :)




