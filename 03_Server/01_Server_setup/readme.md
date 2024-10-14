# HyFiVe Server - Setup SFTP, Users, VPN

The server is a virtual machine running Ubuntu 20.04.6 LTS with 4 CPU cores and 8 GB of RAM

## SFTP Server
The SFTP server is used to transfer data between the server and the deck boxes. Therefore a own group is created and the server is installed

```
	sudo addgroup sftprestricted
	sudo apt-get install openssh-server  openssh-sftp-server
```

Configure SFTP Chroot Jail in SFTP Chroot Jail in /etc/ssh/sshd_config:
```
	Match Group sftprestricted
		ChrootDirectory %h
		ForceCommand internal-sftp
		PasswordAuthentication yes
		PubkeyAuthentication yes
		PermitTunnel no
		AllowAgentForwarding no
		AllowTcpForwarding no
		X11Forwarding no
```

## Users

Next to the admin two users are needed for the full functionality of the overall system:

1. mainuser: This user runs all operations on the server, creates all folders and runs the cronjobs
	
	add with ```sudo adduser hyfiveuser```.
	
2. loggermailbox: This user is created for the exchange of files by deck boxes in the field. It has limited access to a mailbox folder which should be created before.
	Within the home directory of the mainuser a folder mailbox is created with the follwoing structure
	```
	mailbox/
		in/
			netcdf/
			status/
		out/
			config/
	```

	A link of this folder is created for the loggermailbox
	```
		ln -s /opt/HyFiVe/mailbox/in/ mailbox
	```
	
	Add the user with
	```
		sudo adduser --no-create-home loggermailbox
		sudo usermod -d /home/hyfiveuser/datain loggermailbox
		sudo usermod -d /opt/HyFiVe/mailbox loggermailbox
		sudo usermod -s /sbin/nologin loggermailbox
		sudo usermod -g sftprestricted loggermailbox
	```

## OpenVPN Server
The OpenVPN server is installed by the admin as follows
```
	sudo apt install openvpn easy-rsa
	sudo make-cadir /etc/openvpn/easy-rsa
	cd /etc/openvpn/easy-rsa 
	./easyrsa init-pki
	./easyrsa build-ca
```
Create Diffie Hellman parameter, a certificat for the OpenVPN server and copie all certificats and keys to /etc/openvpn/
```
	./easyrsa gen-dh
	./easyrsa sign-req server myservername
	cp pki/dh.pem pki/ca.crt pki/issued/myservername.crt pki/private/myservername.key /etc/openvpn/
```
Create certificats and keys for deck boxes
```
	cd ~/openvpn
	/usr/share/easy-rsa/easyrsa gen-req DeckboxXY nopass
	/usr/share/easy-rsa/easyrsa sign-req client DeckboxXY
	cd pki
	zip -j DeckboxXY.zip ./issued/DeckboxXY.crt ./private/DeckboxXY.key ca.crt
```
Modify further settings
```
	sudo cp /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz /etc/openvpn/myserver.conf.gz
	sudo gzip -d /etc/openvpn/myserver.conf.gz
	ca ca.crt
	cert myservername.crt
	key myservername.key
	dh dh2048.pem
```
Create a ta.key
```
	cd /etc/openvpn
	sudo openvpn --genkey --secret ta.key
```
Umcomment the line ```#net.ipv4.ip_forward=1``` in ```/etc/sysctl.conf``` for IP forwarding and reboot sysctl
```
	sudo sysctl -p /etc/sysctl.conf
```