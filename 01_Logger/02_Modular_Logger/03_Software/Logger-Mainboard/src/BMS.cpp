/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Battery Management System (BMS) functionality
 */
#include "BMS.h"
#include "BMS_lib.h"
#include "DS3231TimeNtp.h"
#include "DebuggingSDLog.h"
#include "DeepSleep.h"
#include "Led.h"
#include "SDCard.h"
#include "SensorManagement.h"
#include "SystemVariables.h"
#include "Utility.h"

BMS_IC BMS;
TwoWire i2c(1); // TwoWire i2c(0);
uint8_t BufferLen = 64;
uint8_t i2cBuffer[64];
uint8_t BMS_address = 0xB;

/**
 * @brief Initializes the BMS and RTC.
 */
void initBmsAndRtc()
{
  BMS.Init(i2c, i2cBuffer, BufferLen, BMS_address); // BMS initialesieren
  initRTC(&i2c);                                    // DS3231 initialisieren
}

/**
 * @brief Checks for battery errors and performs necessary actions.
 */
void logBmsStatus()
{
  uint8_t ERROR_THRESHOLD = 3;
  Log(LogCategoryBMS, LogLevelDEBUG, "BMS ", "Status: ", " CellVoltage[mV]: ", String(getTotalBatteryCellVoltage()), " :Remaining[%]: ", String(getRemainingBatteryPercentage()), " :Capacity[mAh]: ", String(getRemainingBatteryCapacity()), " :Temperature Battery[degC]: ", String((BMS.getTS1Temp() / 10) - 273.15), " :getSafetyAlertAB: ", String(BMS.getSafetyAlertAB()), " :getSafetyStatusAB: ", String(BMS.getSafetyStatusAB()), " :getSafetyAlertCD: ", String(BMS.getSafetyAlertCD()), " :getSafetyStatusCD: ", String(BMS.getSafetyStatusCD()), " :getCell1_V: ", String(BMS.getCell1_V()), " :getCell2_V: ", String(BMS.getCell2_V()), " :getCell3_V: ", String(BMS.getCell3_V()), " :getCell4_V: ", String(BMS.getCell4_V()), " :getCell1_I: ", String(BMS.getCell1_I()), " :getCell2_I: ", String(BMS.getCell2_I()), " :getCell3_I: ", String(BMS.getCell3_I()), " :getCell4_I: ", String(BMS.getCell4_I()));

  if (BMS.getSafetyAlertAB() == 16384 || BMS.getSafetyStatusAB() == 16384)
  {
    if (getRemainingBatteryPercentage() <= 15)
    {
      Log(LogCategoryBMS, LogLevelDEBUG, "BMS ", "Status: ", " CellVoltage[mV]: ", String(getTotalBatteryCellVoltage()), " Remaining[%]: ", String(getRemainingBatteryPercentage()), " Capacity[mAh]: ", String(getRemainingBatteryCapacity()), " Temperature Battery[degC]: ", String((BMS.getTS1Temp() / 10) - 273.15));
      Log(LogCategoryBMS, LogLevelDEBUG, "BMS ", "Log: ", "getSafetyAlertAB: ", String(BMS.getSafetyAlertAB()), " getSafetyStatusAB: ", String(BMS.getSafetyStatusAB()), " getSafetyAlertCD: ", String(BMS.getSafetyAlertCD()), " getSafetyStatusCD: ", String(BMS.getSafetyStatusCD()));
      Log(LogCategoryBMS, LogLevelDEBUG, "BMS ", "Log: ", "getCell1_V: ", String(BMS.getCell1_V()), " getCell2_V: ", String(BMS.getCell2_V()), " getCell3_V: ", String(BMS.getCell3_V()), " getCell4_V: ", String(BMS.getCell4_V()));
      Log(LogCategoryBMS, LogLevelDEBUG, "BMS ", "Log: ", "getCell1_I: ", String(BMS.getCell1_I()), " getCell2_I: ", String(BMS.getCell2_I()), " getCell3_I: ", String(BMS.getCell3_I()), " getCell4_I: ", String(BMS.getCell4_I()));
      //* Battery management
      batteryCompletelyCharged();
      connectionOfPowerSupplyBeginChargingOfBatteries();
      espDeepSleepSec(0);
      return;
    }
  }

  if (BMS.getSafetyAlertAB() != 0 || BMS.getSafetyStatusAB() != 0 || BMS.getSafetyAlertCD() != 0 || BMS.getSafetyStatusCD() != 0)
  {
    bmsErrorCounter++;
    if (bmsErrorCounter >= ERROR_THRESHOLD)
    {
      Log(LogCategoryBMS, LogLevelINFO, "BMS ", "Status: ", " CellVoltage[mV]: ", String(getTotalBatteryCellVoltage()), " Remaining[%]: ", String(getRemainingBatteryPercentage()), " Capacity[mAh]: ", String(getRemainingBatteryCapacity()), " Temperature Battery[degC]: ", String((BMS.getTS1Temp() / 10) - 273.15));
      Log(LogCategoryBMS, LogLevelINFO, "BMS ", "Log: ", "getSafetyAlertAB: ", String(BMS.getSafetyAlertAB()), " getSafetyStatusAB: ", String(BMS.getSafetyStatusAB()), " getSafetyAlertCD: ", String(BMS.getSafetyAlertCD()), " getSafetyStatusCD: ", String(BMS.getSafetyStatusCD()));
      Log(LogCategoryBMS, LogLevelINFO, "BMS ", "Log: ", "getCell1_V: ", String(BMS.getCell1_V()), " getCell2_V: ", String(BMS.getCell2_V()), " getCell3_V: ", String(BMS.getCell3_V()), " getCell4_V: ", String(BMS.getCell4_V()));
      Log(LogCategoryBMS, LogLevelINFO, "BMS ", "Log: ", "getCell1_I: ", String(BMS.getCell1_I()), " getCell2_I: ", String(BMS.getCell2_I()), " getCell3_I: ", String(BMS.getCell3_I()), " getCell4_I: ", String(BMS.getCell4_I()));

      disable3V();
      Log(LogCategoryBMS, LogLevelINFO, "BMS: charging process aborted");
      batteryCompletlyCharged = true;
      bmsErrorCounter = 0;
      // generalAlarmLed();
    }
    delay(100);
  }
  else
  {
    bmsErrorCounter = 0;
  }
}

/**
 * @brief Checks for battery errors and performs necessary actions.
 */
void checkForBatteryErrors()
{
  pinMode(20, INPUT);
  int pin20Status_ = digitalRead(20);
  if (pin20Status_ == LOW) // NT angeschloßen
  {
    if (BMS.getSafetyAlertAB() != 0 || BMS.getSafetyStatusAB() != 0 || BMS.getSafetyAlertCD() != 0 || BMS.getSafetyStatusCD() != 0)
    {
      Log(LogCategoryBMS, LogLevelERROR, "BMS ", "Status: ", " CellVoltage[mV]: ", String(getTotalBatteryCellVoltage()), " Remaining[%]: ", String(getRemainingBatteryPercentage()), " Capacity[mAh]: ", String(getRemainingBatteryCapacity()), " Temperature Battery[degC]: ", String((BMS.getTS1Temp() / 10) - 273.15));
      Log(LogCategoryBMS, LogLevelERROR, "BMS ", "Error Log: ", "getSafetyAlertAB: ", String(BMS.getSafetyAlertAB()), " getSafetyStatusAB: ", String(BMS.getSafetyStatusAB()), " getSafetyAlertCD: ", String(BMS.getSafetyAlertCD()), " getSafetyStatusCD: ", String(BMS.getSafetyStatusCD()));

      BMS.setRESET();
      Log(LogCategoryBMS, LogLevelERROR, "BMS RESET");
      delay(5000);
      ESP.restart();
    }
  }
}

/**
 * @brief Gets the remaining battery percentage.
 * @return float The remaining battery percentage.
 */
float getRemainingBatteryPercentage()
{
  float getRSOC = BMS.getRSOC();
  return getRSOC;
}

/**
 * @brief Gets the total battery cell voltage.
 * @return uint16_t The total battery cell voltage in mV.
 */
uint16_t getTotalBatteryCellVoltage()
{
  uint16_t SumCellVoltage = BMS.getSumCellVoltage();
  return SumCellVoltage;
}

/**
 * @brief Gets the remaining battery capacity.
 * @return uint16_t The remaining battery capacity in mAh.
 */
uint16_t getRemainingBatteryCapacity()
{
  uint16_t RemainingCapacity = BMS.getRemainingCapacity();
  return RemainingCapacity;
}
