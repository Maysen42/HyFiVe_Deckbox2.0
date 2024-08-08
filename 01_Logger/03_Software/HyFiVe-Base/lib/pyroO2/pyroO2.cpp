/*
 * SPDX-FileCopyrightText: (C) 2024 Frederik Furkert, Thuenen-Institute of Baltic Sea Fisheries
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Interface to the oxygen sensor "picoO2sub" from the manufacturer PyroScience GmbH
 */
 

#include "pyroO2.h"


pyroO2::pyroO2()
{

}

void pyroO2::initUart (uart_port_t uart_num_in, int RX_in, int TX_in){
  this->uart_num = uart_num_in;
  this->RX_PIN=RX_in;
  this->TX_PIN=TX_in;

  uart_config_t uart_config = {
    .baud_rate = 19200,
    .data_bits = UART_DATA_8_BITS,
    .parity = UART_PARITY_DISABLE,
    .stop_bits = UART_STOP_BITS_1,
    .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
  };

  // Configure UART parameters
  ESP_ERROR_CHECK(uart_param_config(this->uart_num, &uart_config));
  ESP_ERROR_CHECK(uart_set_pin(this->uart_num, this->TX_PIN, this->RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));

  // Setup UART buffered IO with event queue
  const int uart_buffer_size = (255);
  // Install UART driver using an event queue here
  ESP_ERROR_CHECK(uart_driver_install(this->uart_num, uart_buffer_size, uart_buffer_size, 0, NULL, 0));
  // Serial.println("Uart Driver set");

  // setDeviceID();
}


void pyroO2::setDeviceID() {
  strcpy(this->command,"#IDNR\r");
  send(this->command);
  delay(50);
  this->receive();
  // searching for command tag in buffer, receiving pointer to corresponding segment of c string
  char* pch = strstr (this->messageReceived, "#IDNR");
  // cut c string into parts by delimiter " "
  if (pch != NULL){
  strtok(pch," "); // is equal to pch
  char *pch3 = strtok(NULL, " "); // pointer to string segment after command tag
  strcpy(this->deviceID, pch3);
  }
}


void pyroO2::send(const char* messToSend){
  uart_write_bytes(this->uart_num, (const char*)messToSend, strlen(messToSend));
  //Serial.print("sended: "); Serial.println(messToSend);
}


void pyroO2::receive (){
  int length = 0;
  uart_get_buffered_data_len(this->uart_num, (size_t*)&length);
  if (length > sizeof(this->messageReceived)){    // avoid overflow of private variable
    length = sizeof(this->messageReceived);
  }
  if (length > 0){
    uint8_t data [length];
    uart_read_bytes(this->uart_num, data, length, 0);
    for (int i=0; i < length; i++){
      this->messageReceived [i] = (char) data[i];
    }
  }
  this->messageReceived [length]='\0';   // manually insert stop sign for end of string
}

/* Accessing data from outside. */
const char* pyroO2::getMessageReceived () {
  return this->messageReceived;
}
float pyroO2::getOxygenMBar () {
  return this->oxygenMBar;
}
float pyroO2::getTempCase () {
  return this->tempCase;
}
float pyroO2::getTempSample () {
  return this->tempSample;
}
float pyroO2::getOxygenUMolar () {
  return this->oxygenUMolar;
}
float pyroO2::getHumidityInCase () {
  return this->humidityInCase;
}
const char* pyroO2::getErrorMessages () {
  return errorMessages;
}
const char* pyroO2::getDeviceID () {
  return this->deviceID;}

// only for validation purpose (set sensor response manually to check processing of data)
void pyroO2::setRawMeasurement (const char* messIn) {
  strcpy(this->measurementRaw, messIn);
}

void pyroO2::interpreteRawMeas(){
  // cutting c_string into array of c_strings

  // searching for measurement command tag, receiving pointer to corresponding segment of c string
  char * pch = strstr(this->measurementRaw, "MEA");
  //Serial.println("1");
  if (pch != NULL) {
    // create array, to buffer single measurment values
    char measArray[22][20];
    // start to cut string into pieces
    char* pch2 = strtok (pch," ");       // is equal to pch
    int i=0;
    while (pch2 != NULL)
    {
      strcpy(measArray[i],pch2);
      pch2 = strtok (NULL, " "); // getting new pointer to next segment
      i++;
    }
    // setting relevant measurement outputs
    this->interpreteErrInt(atoi(measArray[4-1]));
    this->oxygenUMolar    = strtof(measArray[4+2-1], NULL)*0.001;
    this->oxygenMBar      = strtof(measArray[4+3-1], NULL)*0.001;
    this->humidityInCase  = strtof(measArray[4+10-1], NULL)*0.001;
    this->tempSample      = strtof(measArray[4+5-1], NULL)*0.001;
    this->tempCase        = strtof(measArray[4+6-1], NULL)*0.001;
    } else{
      Serial.println("PicoO2Sub: interpreteRawMeas(): messageReceived does not include command tag MEA. messageReceived:");
      Serial.println(this->measurementRaw);
  }
}

char* pyroO2::interpreteErrInt(int errorInt){

// Serial.println(String(atoi(sensOxy.messArray[3]), BIN)); // shows binary form

  this->errorMessages[0]='\0'; // resetting c_string

  if (errorInt & (1 << 0)){
    strncat(this->errorMessages, "Bit0 - WARNING - automatic amplification level active\n", 100);
  }
  if (errorInt & (1 << 1)){
    strncat(this->errorMessages, "Bit1 - WARNING - sensor signal intensity low\n", 100);
  }
  if (errorInt & (1 << 2)){
    strncat(this->errorMessages, "Bit2 - ERROR - optical detector saturated\n", 100);
  }
  if (errorInt & (1 << 3)){
    strncat(this->errorMessages, "Bit3 - WARNING - reference signal intensity too low\n", 100);
  }
  if (errorInt & (1 << 4)){
    strncat(this->errorMessages, "Bit4 - ERROR - reference signal too high\n", 100);
  }
  if (errorInt & (1 << 5)){
    strncat(this->errorMessages, "Bit5 - ERROR - failure of sample temperature sensor (e.g. Pt100)\n", 100);
  }
  if (errorInt & (1 << 6)){
    strncat(this->errorMessages, "Bit6 - reserved\n", 100);
  }
  if (errorInt & (1 << 7)){
    strncat(this->errorMessages, "Bit7 - WARNING - high humidity (>90%RH) within the module\n", 100);
  }
  if (errorInt & (1 << 8)){
    strncat(this->errorMessages, "Bit8 - ERROR - failure of case temperature sensor\n", 100);
  }
  if (errorInt & (1 << 9)){
    strncat(this->errorMessages, "Bit9 - ERROR - failure of pressure sensor\n", 100);
  }
  if (errorInt & (1 << 10)){
    strncat(this->errorMessages, "Bit10 - ERROR - failure of humidity sensor\n", 100);
  }
  return this->errorMessages;
}

void pyroO2::measure (){
  this->send("MEA 1 45\r");       // 1 (optical channel) + 4 (ambient air pressure) + 8 (relative humidity inside case) + 32 (case temp)
}

void pyroO2::read(){
  this->receive();
  this->setRawMeasurement(this->messageReceived);
  this->interpreteRawMeas();
  //Serial.println(this->getErrorMessages());
  //Set meassure
}

void pyroO2::readRegister(int T, int R, int N){
  snprintf (this->command, sizeof(this->command), "RMR 1 %d %d %d\r", T,R,N);
  this->send(this->command);
  delay(100);
  this->receive();
}

void pyroO2::writeSampleTemp(float sampleTemp=-299.999){
  sampleTemp *= 1000;
  int temp = int(sampleTemp);
  snprintf (this->command, sizeof(this->command), "WTM 1 0 0 1 %d\r", temp);
  // Serial.println(this->command);
  this->send(this->command);
  delay(80);
  this->receive();
  if (strcmp(this->messageReceived, this->command) == 0){     // check if return message is equal to sended command
    // Serial.println ("PicoO2Sub: Set sampleTemp witout error.");
  } else {
    Serial.println("Set of sampleTemp did not work.");
    if (this->messageReceived[0] != '\0'){              // check that received message is not empty
      Serial.print("Message received: ");Serial.println(this->messageReceived);
    }
  }
}

void pyroO2::writeSampleSal(float sampleSal){
  snprintf (this->command, sizeof(this->command), "WTM 1 0 2 1 %f\r", sampleSal*1000);
  this->send(this->command);
  delay(100);
  this->receive();
  if (strcmp(this->messageReceived, this->command) == 0){     // check if return message is equal to sended command
    Serial.println ("PicoO2Sub: Set sampleSal witout error.");
  } else {
    Serial.println("Set of sampleSal did not work.");
    if (this->messageReceived[0] != '\0'){              // check that received message is not empty
      Serial.print("Message received: ");Serial.print(this->messageReceived);
    }
  }
}


void pyroO2::enterDeepSleep(){
  strcpy(command, "#STOP\r");
  send(command);
  delay(30);
  receive();
}

void pyroO2::exitDeepSleep(){
  strcpy(this->command, "\r");
  this->send(this->command);
  delay(250);
  this->receive();
  if (strcmp(this->messageReceived, this->command) == 0){     // check if return message is equal to sended command
    Serial.println ("PicoO2Sub woke up");
  } else {
    Serial.println("PicoO2Sub perhaps did not wake up as requested.");
    if (this->messageReceived[0] != '\0'){              // check that received message is not empty
      Serial.print("Message received: ");Serial.print(this->messageReceived);
    }
  }
}

void pyroO2::powerDown(){
  strcpy(this->command, "#PDWN\r");
  this->send(this->command);
  delay(30);
  this->receive();
}

void pyroO2::powerUp(){
  strcpy(this->command, "#PWUP\r");
  this->send(this->command);
  delay(250);
  this->receive();
  if (strcmp(this->messageReceived, this->command) == 0){     // check if return message is equal to sended command
    Serial.println ("PicoO2Sub powered up");
  } else {
    Serial.println("PicoO2Sub perhaps did not power up as requested.");
    if (this->messageReceived[0] != '\0'){              // check that received message is not empty
      Serial.print("Message received: ");Serial.print(this->messageReceived);
    }
  }
}




/*
void pyroO2::clearMeasArray(){
  int colums = sizeof(measArray[0])/sizeof(measArray);
  for (int i = 0; i < colums; i++){
    this->measArray[i][0]='\0';
  }
}
*/

