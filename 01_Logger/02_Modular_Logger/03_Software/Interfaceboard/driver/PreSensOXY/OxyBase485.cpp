#include "OxyBase485.h"

#define OxyBaseAdd          0x01
#define ReadHolding         0x03
#define ReadInput           0x04
#define WriteRegs           0x10
#define FirmwareVerReg      1031
#define FirmwareVerLen      8
#define SerialReg           1063
#define SerialRegLen        8
#define OxygeneUnit         2089
#define OxygeneUnitlen      2
#define OxygeneValReg       2091
#define OxygeneValLen       2
#define OxygeneInterval     3497
#define OxygeneIntervallen  4
#define ReadOutMeasure      4897
#define ReadOutMeasurelen   0x0c
#define MeasurementMode     5703
#define MeasurementModelen  2

OxyBase::OxyBase(){

}

void OxyBase::init(RS485_drv &rs){
    _rs485 = &rs;
    // this->getFirmware();
    //this->getSerialNr();
    //this->setMeasurementMode();
    //delay(20);
    //this->setOxygenUnit();
    //delay(20);
    //this->readMeasurementMode();
    //delay(20);
    //this->readOxygenUnit();
    __delay_cycles(200000);
    this->activateMeasurement();
}

void OxyBase::getFirmware(){
    uint8_t lenout = 8;
    uint8_t out[lenout];
    uint8_t in[25];
    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = ReadHolding;                   // command to send
    out[2] = FirmwareVerReg >> 8;           // high address register
    out[3] = FirmwareVerReg & 0x00FF;       // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = FirmwareVerLen;                // low number of registers
    out[6] = 0xf4;                          // crc high
    out[7] = 0xfd;                          // crc low

    _rs485->readRegister(out, lenout, in, sizeof(in)/sizeof(*in));      // send out and receive reply

    // the reply starts with address, command and length of return. The bytes from length of return are interesting
    // and stored into the firmware
    for(int i = 0; i < in[2]; i++){
        if(i%2 == 0){
            firmware[i+1] = in[i+3];
        }else{
            firmware[i-1] = in[i+3];
        }
    }
}

void OxyBase::getSerialNr(){
    uint8_t lenout = 8;
    uint8_t out[lenout];
    uint8_t in[25];
    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = ReadHolding;                   // command to send
    out[2] = SerialReg >> 8;           // high address register
    out[3] = SerialReg & 0x00FF;       // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = SerialRegLen;                // low number of registers
    out[6] = 0xf5;                          // crc high
    out[7] = 0x37;                          // crc low
    _rs485->readRegister(out, lenout, in, sizeof(in)/sizeof(*in));      // send out and receive reply
    // the reply starts with address, command and length of return. The bytes from length of return are interesting
    // and stored into the firmware
    for(int i = 0; i < in[2]; i++){
        if(i%2 == 0){
            serialNr[i+1] = in[i+3];
        }else{
            serialNr[i-1] = in[i+3];
        }
    }
}

void OxyBase::setMeasurementMode(){
    uint8_t lenout = 13;
    uint8_t out[lenout];
    uint8_t reply[8];

    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = WriteRegs;                     // command to send
    out[2] = MeasurementMode >> 8;          // high address register
    out[3] = MeasurementMode & 0x00FF;      // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = MeasurementModelen;            // low number of registers
    out[6] = 0x04;
    out[7] = 0x00;
    // dry
    out[8] = 0x01;
    out[9] = 0x00;
    out[10] = 0x00;
    out[11] = 0x01;
    out[12] = 0xD9;
    // humid
    /*
    out[8] = 0x00;
    out[9] = 0x00;
    out[10] = 0x00;
    out[11] = 0x50;
    out[12] = 0x19;*/
    
    _rs485->writeRegister(out, lenout, reply, sizeof(reply)/sizeof(*reply));
}

void OxyBase::readMeasurementMode(){
    uint8_t lenout = 8;
    uint8_t out[lenout];
    uint8_t repl[9];
    
    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = ReadHolding;                   // command to send
    out[2] = MeasurementMode >> 8;              // high address register
    out[3] = MeasurementMode & 0x00FF;          // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = MeasurementModelen;                // low number of registers
    out[6] = 0x70;                          // crc high
    out[7] = 0x56;                          // crc low

    _rs485->readRegister(out, lenout, repl, 9);      // send out and receive reply

//    for(int i = 0; i < 9; i++){
//        Serial.print(repl[i], HEX);
//        Serial.print("-");
//    }
//    Serial.println();
}

void OxyBase::setOxygenUnit(){
    uint8_t lenout = 13;
    uint8_t out[lenout];
    uint8_t reply[8];

    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = WriteRegs;                     // command to send
    out[2] = OxygeneUnit >> 8;          // high address register
    out[3] = OxygeneUnit & 0x00FF;      // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = OxygeneUnitlen;            // low number of registers
    out[6] = 0x04;
    out[7] = 0x00;
    // in %
    
    out[8] = 0x10;
    out[9] = 0x00;
    out[10] = 0x00;
    out[11] = 0x57;
    out[12] = 0xD8;
    // in mg/L
    /*
    out[8] = 0x80;
    out[9] = 0x00;
    out[10] = 0x00;
    out[11] = 0x57;
    out[12] = 0xF5;
    */
    _rs485->writeRegister(out, lenout, reply, sizeof(reply)/sizeof(*reply));
}

void OxyBase::readOxygenUnit(){
    uint8_t lenout = 8;
    uint8_t out[lenout];
    uint8_t repl[9];
    
    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = ReadHolding;                   // command to send
    out[2] = OxygeneUnit >> 8;              // high address register
    out[3] = OxygeneUnit & 0x00FF;          // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = OxygeneUnitlen;                // low number of registers
    out[6] = 0x17;                          // crc high
    out[7] = 0xA3;                          // crc low

    _rs485->readRegister(out, lenout, repl, 9);      // send out and receive reply

//    for(int i = 0; i < 9; i++){
//        Serial.print(repl[i], HEX);
//        Serial.print("-");
//    }
//    Serial.println();
}

void OxyBase::activateMeasurement(){
    uint8_t lenout = 17;
    uint8_t out[lenout];
    uint8_t reply[8];

    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = WriteRegs;                     // command to send
    out[2] = OxygeneInterval >> 8;          // high address register
    out[3] = OxygeneInterval & 0x00FF;      // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = OxygeneIntervallen;            // low number of registers
    out[6] = 0x08;
    out[7] = 0x00;
    out[8] = 0x01;
    out[9] = 0x00;
    out[10] = 0x00;
    out[11] = 0x00;
    out[12] = 0x01;                         // measure every 1 seconds
    out[13] = 0x00;
    out[14] = 0x00;
    out[15] = 0x7B;                          // crc high
    out[16] = 0xEA;                          // crc low
    _rs485->writeRegister(out, lenout, reply, sizeof(reply)/sizeof(*reply));

//    for(int i = 0; i < 8; i++){
//        Serial.print(reply[i], HEX);
//        Serial.print("-");
//    }
//    Serial.println();
}

void OxyBase::getOxygene(){
    uint8_t lenout = 8;
    uint8_t out[lenout];
    
    out[0] = OxyBaseAdd;                    // Address of the sensor
    out[1] = ReadHolding;                   // command to send
    out[2] = ReadOutMeasure >> 8;           // high address register
    out[3] = ReadOutMeasure & 0x00FF;       // low address register
    out[4] = 0x00;                          // high number of registers
    out[5] = ReadOutMeasurelen;             // low number of registers
    out[6] = 0x11;                          // crc high
    out[7] = 0x41;                          // crc low

    _rs485->readRegister(out, lenout, oxyval, sizeof(oxyval)/sizeof(*oxyval));      // send out and receive reply
    if(oxyval[0] == 0x01){
        oxygene = (oxyval[21] << 24) + (oxyval[22] << 16) + (oxyval[19] << 8) + (oxyval[20]);
    }else{ // first byte is trash, one later...
        oxygene = (oxyval[22] << 24) + (oxyval[23] << 16) + (oxyval[20] << 8) + (oxyval[21]);
    }
    /*for(int i= 0; i < 29; i++){
        Serial.print(oxyval[i], HEX);
        Serial.print("-");
    }*/
    oxyval[2] = 1;
    oxyval[3] = 2;
//    Serial.println();
}
