# Programming Guide: Logger-Mainboard and Interfaceboard

## Content
- [Programming Guide: Logger-Mainboard and Interfaceboard](#programming-guide-logger-mainboard-and-interfaceboard)
  - [Content](#content)
  - [Logger-Mainboard Programming](#logger-mainboard-programming)
    - [1. Installing VSCode and PlatformIO IDE](#1-installing-vscode-and-platformio-ide)
    - [2. Opening a Project with PlatformIO](#2-opening-a-project-with-platformio)
    - [3. Compiling the Code](#3-compiling-the-code)
    - [4. Flashing and Debugging](#4-flashing-and-debugging)
    - [5. Alternative Firmware Update Method (Updates without Programming Device)](#5-alternative-firmware-update-method-updates-without-programming-device)
  - [Interfaceboard Programming](#interfaceboard-programming)
    - [1. Programming Preparations](#1-programming-preparations)
      - [Standard Connection Configuration](#standard-connection-configuration)
      - [Alternative Connection Configuration](#alternative-connection-configuration)
    - [2. Software Installation and Setup](#2-software-installation-and-setup)
    - [3. Importing the Project](#3-importing-the-project)
    - [4. Compiling the Project](#4-compiling-the-project)
    - [5. Flashing Firmware and Debugging](#5-flashing-firmware-and-debugging)
    - [6. After Programming](#6-after-programming)

## Logger-Mainboard Programming

### 1. Installing VSCode and PlatformIO IDE

1. Visit the official VSCode website: [https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)
2. Open Visual Studio Code after installation.
3. Open the Extensions view:
   - Click on the Extensions icon in the left sidebar, or
   - Use the keyboard shortcut: `Ctrl+Shift+X`
4. Search for "PlatformIO IDE" in the search field.
5. Click the "Install" button to install the extension.
6. Wait for the installation to complete. VSCode may request a restart.

### 2. Opening a Project with PlatformIO

1. After installing PlatformIO, a new PlatformIO icon will appear in the left sidebar of VSCode. ![PlatformIO_IDE](media/PlatformIO_IDE.jpg)
2. Click on the PlatformIO icon.
3. In the PlatformIO view, select `Home` -> `Open Project`.
4. Navigate to your project directory.
5. Select the folder containing the `platformio.ini` file.
6. Click "Open" to load the project in VSCode.

> - A stable internet connection is required as PlatformIO may need to download additional dependencies.
> - When opening a project for the first time, it may take some time for PlatformIO to initialize all necessary components.

### 3. Compiling the Code

1. To compile the code:
   - Click on the checkmark icon (Build) ![Build](media/Build.jpg) in the bottom status bar, or
   - Use the shortcut `Ctrl+Alt+B`
2. The compilation process will be displayed in the Terminal view of VSCode.

### 4. Flashing and Debugging

1. Connect the UART programmer to the ESP32 board, [see UART Serial Port Connector for ESP32](../01_Electronics/README.md).
2. Flash the firmware:
   - Click on the arrow icon (Upload) ![Upload](media/Upload.jpg) in the status bar or use `Ctrl+Alt+U`.
3. Open the Serial Monitor for monitoring:
   - Click on the plug icon (Serial Monitor) ![Serial_Monitor](media/Serial_Monitor.jpg) or use `Ctrl+Alt+S`.

### 5. Alternative Firmware Update Method (Updates without Programming Device)

1. Locate the compiled firmware under `.pio\build\HyFiVe_Logger-Mainboard\firmware.bin`.
2. Copy this file to the "updateFW" folder on the logger's SD card.
3. The new firmware will be automatically installed on the next start.

## Interfaceboard Programming

### 1. Programming Preparations

#### Standard Connection Configuration
1. Ensure the Interfaceboard is unpowered.
2. Place a jumper on X203 between Pin 1 and Pin 2, [see JTAG Connector for Interfaceboard](../01_Electronics/README.md).
3. Connect +3.3V to the pin header X201 (Pin1: +3.3V, Pin4: GND), [see Pinout of Interfaceboard Connector](../01_Electronics/README.md).
4. Connect the TI MSP-FET Flash Emulation Tool (programming connector) correctly, [see JTAG Connector for Interfaceboard](../01_Electronics/README.md).
5. Turn on the power supply.

#### Alternative Connection Configuration
> ⚠️ Caution is advised with this configuration to avoid potential overload of the programmer. Ensure the programmer is designed for the required current output.

1. Ensure the Interfaceboard is unpowered.
2. Place a jumper on X203 between Pin 2 and Pin 3, [see JTAG Connector for Interfaceboard](../01_Electronics/README.md).
3. Connect the TI MSP-FET Flash Emulation Tool (programming connector) correctly, [see JTAG Connector for Interfaceboard](../01_Electronics/README.md).
4. Turn on the power supply.

### 2. Software Installation and Setup

1. Download Code Composer Studio (CCS): [https://www.ti.com/tool/CCSTUDIO#downloads](https://www.ti.com/tool/CCSTUDIO#downloads).
2. Select "CCSTUDIO — Code Composer Studio™ IDE" (tested with versions 10.4.0 and 12.8.0).
3. Perform a full installation.
4. On first launch, create a workspace (do not create it in the project folder).

### 3. Importing the Project

1. Navigate to: `File` -> `Import...`
2. Select: `C/C++` -> `CCS Projects` -> `Next`
3. Use `Browse...` to select the Interfaceboard folder containing the `main.c` file.
4. The project will appear under `Discovered projects` and should already be marked.
5. Click `Finish` to complete the import.

### 4. Compiling the Project

1. Go to the "Build" menu.
2. Select "Debug_TI(2)".
 ![Build Debug_TI(2)](media/Build_Debug_TI(2).jpg)

3. The project will now compile and should run without errors.

### 5. Flashing Firmware and Debugging

![Debug Flash](media/Debug_Flash.jpg)
1. Use the Flash icon to transfer the created firmware to the Interfaceboard.
2. Use the Debug function to analyze and test the program.

### 6. After Programming

1. Turn off the power supply.
2. Remove the programming connector.
3. Remove the jumper from X203.