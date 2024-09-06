
# Import the KiCad python helper module and the csv formatter
import kicad_netlist_reader
# import kicad_utils
from mdutils.mdutils import MdUtils
import csv
import sys

# A helper function to group netlist by value, footprint and function
# Function is a modified version of the kicad_netlist_reader function groupComponents()



# A helper function to convert a UTF8/Unicode/locale string read in netlist
# for python2 or python3
def fromNetlistText( aText ):
    if sys.platform.startswith('win32'):
        try:
            return aText.encode('utf-8').decode('cp1252')
        except UnicodeDecodeError:
            return aText
    else:
        return aText

net = kicad_netlist_reader.netlist('../Rev_01/Rev_01.xml')
print(type(net))
grouped = net.groupMyComponents()

mandatory_list = ['Reference', 'Amount', 'Value', 'Footprint', 'Manufacturer Part Number']
high_voltage_list = ['Reference', 'Amount', 'Value', 'Footprint', 'Manufacturer Part Number']
uart1_list = ['Reference', 'Amount', 'Value', 'Footprint', 'Manufacturer Part Number']
rs485_list = ['Reference', 'Amount', 'Value', 'Footprint', 'Manufacturer Part Number']
uart2_list = ['Reference', 'Amount', 'Value', 'Footprint', 'Manufacturer Part Number']

cat_number = len(mandatory_list)  

for group in grouped:
    refs = ""
    amount = 0

    for component in group:
        refs += fromNetlistText(component.getRef()) + ", "
        c = component
        amount += 1
    refs = refs[:-2]

    if c.getField('Function') == 'mandatory':
        mandatory_list.extend([str(refs), str(amount), str(c.getValue()), str(c.getFootprint()), str(c.getField('Manufacturer_Part_Number'))])
    if c.getField('Function') == 'vsensor':
        high_voltage_list.extend([str(refs), str(amount), str(c.getValue()), str(c.getFootprint()), str(c.getField('Manufacturer_Part_Number'))])
    if c.getField('Function') == 'uart1':
        uart1_list.extend([str(refs), str(amount), str(c.getValue()), str(c.getFootprint()), str(c.getField('Manufacturer_Part_Number'))])
    if c.getField('Function') == 'rs485':     
        rs485_list.extend([str(refs), str(amount), str(c.getValue()), str(c.getFootprint()), str(c.getField('Manufacturer_Part_Number'))])
    if c.getField('Function') == 'uart2':
        uart2_list.extend([str(refs), str(amount), str(c.getValue()), str(c.getFootprint()), str(c.getField('Manufacturer_Part_Number'))])

mdFile = MdUtils(file_name='../BOM', title='Bil of Materials')
mdFile.new_header(level=1, title='Electronics main PCB', add_table_of_contents='n')
mdFile.new_line('To manufacture the electronic hardware of a logger order the PCB in **/Rev_01**. To assemble the PCB '
                'to your needs follow the instructions and the bill of materials in the tables below. '
                'The schematics and board design in **/Rev_01** provide additional information for the assembly.')
mdFile.new_line('\n **Note:** The connection between the hardware and software is very close in this embedded design. '
                'Understanding and testing the the hardware in detail is highly recommended before usage. GPIOs of the '
                'µC are in the code to switch components such as sensors and the SD card and can lead to errors in case'
                ' of changes.')
mdFile.new_header(level=2, title='Main components for PCB Rev_01', add_table_of_contents='n')
mdFile.new_paragraph('These are components needed in any case to run the microcontroller and his basic functions.')
mdFile.new_paragraph('U3 is used to protect the power supply from deep discharge. Wit the combination of R22 and R21 '
                     'it will turn everything off, when the battery is lower than 3.55 V. If this is not needed, '
                     'bridge pin 7 & 8 of U3.')
mdFile.new_paragraph('**Note:** when using Blue Robotics sensors, I2C1 and I2C2 should be replaced with BM04B-GHS-TBT '
                     'to connect them easily.')
mdFile.new_table(columns=cat_number, rows=int((len(mandatory_list)/cat_number)), text=mandatory_list, text_align='center')

mdFile.new_header(level=2, title='Optional components according to the used sensors', add_table_of_contents='n')
mdFile.new_header(level=3, title='UART1 with boost converter (13V) and optional RS485', add_table_of_contents='n')
mdFile.new_paragraph('These components enable a higher supply voltage for one sensor. The voltage can be adjusted by'
                     'the setup of R3, R23, R2 and R24.')
mdFile.new_table(columns=cat_number, rows=int((len(high_voltage_list)/cat_number)), text=high_voltage_list, text_align='center')

mdFile.new_header(level=3, title='UART1 or RS485', add_table_of_contents='n')
mdFile.new_paragraph('For using UART1 use')
mdFile.new_table(columns=cat_number, rows=int((len(uart1_list)/cat_number)), text=uart1_list, text_align='center')

mdFile.new_paragraph('For using RS485 use')
mdFile.new_table(columns=cat_number, rows=int((len(rs485_list)/cat_number)), text=rs485_list, text_align='center')

mdFile.new_header(level=3, title='UART2, 3.3V', add_table_of_contents='n')
mdFile.new_paragraph('UART2 runs with 3.3V and can be switched off by a high side switch.')
mdFile.new_table(columns=cat_number, rows=int((len(uart2_list)/cat_number)), text=uart2_list, text_align='center')

mdFile.new_header(level=1, title='External components to implement the sensors and power the system', add_table_of_contents='n')
external_list = ['Reference', 'Amount', 'Function', 'Manufacturer Part Number']

cat_number = len(external_list)
external_list.extend(['Molex connector I2C', '4', 'Connect 4 pin I2C sensor', 'Molex: 15134-0402'])
external_list.extend(['Molex connector I2C', '1', 'Connect 5 pin I2C sensor', 'Molex: 15134-0502'])
external_list.extend(['Molex connector UART', '1', 'Connect programmer', 'Molex: 15134-0602'])
external_list.extend(['Molex connector V+', '1', 'Connect power', 'Molex: 15136-0203'])
external_list.extend(['Molex Antenna', '1', 'Improve connection of ESP', 'Molex: 47950-0011'])
external_list.extend(['UART Progammer', '1', 'Programm the ESP32 with code', 'Digilent: 410-212'])
mdFile.new_table(columns=cat_number, rows=int((len(external_list)/cat_number)), text=external_list, text_align='center')

mdFile.create_md_file()
