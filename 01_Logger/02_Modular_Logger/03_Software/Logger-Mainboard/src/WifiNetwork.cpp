/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: WiFi network connection and management
 */

#include <WiFi.h>

#include "DebuggingSDLog.h"
#include "Led.h"
#include "SystemVariables.h"

/**
 * @brief Connects to Wi-Fi and synchronizes time with NTP.
 * @return true if connection and synchronization were successful, false otherwise.
 */
bool connectToWifiAndSyncNTP()
{
  if (waitAfterUnderwaterMeasurementTimeNow >= getCurrentTimeFromRTC())
  {
    Log(LogCategoryWiFi, LogLevelDEBUG, "waitAfterUnderwaterMeasurement");
    return false;
  }

  if (strlen(configRTC.wificonfig[0].ssid) == 0 || strlen(configRTC.wificonfig[0].pw) == 0)
  {
    Log(LogCategoryWiFi, LogLevelWARNING, "No WLAN configuration found in the RTC memory");
    hasWifiConnection = false;
    wificonfigRtc = false;
    return false;
  }
  else
  {
    wificonfigRtc = true;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Log(LogCategoryWiFi, LogLevelDEBUG, "WLAN is still connected.");
    hasWifiConnection = true;
    return true;
  }
  else
  {
    // Search through all stored networks
    for (int j = 0; j < WifiArraySize; ++j)
    {
      if (strlen(configRTC.wificonfig[j].ssid) > 0)
      {
        Log(LogCategoryWiFi, LogLevelDEBUG, "Trying to connect to network: ", String(configRTC.wificonfig[j].ssid));
        for (int attempt = 0; attempt < 3; ++attempt)
        {
          WiFi.begin(configRTC.wificonfig[j].ssid, configRTC.wificonfig[j].pw);

            if (WiFi.status() == WL_CONNECTED)
            {
              Log(LogCategoryWiFi, LogLevelDEBUG, "Connected to network: ", String(configRTC.wificonfig[j].ssid));
              hasWifiConnection = true;
              synchronizeTimeWithNTP();
              return true;
            }
            delay(1000);

          Log(LogCategoryWiFi, LogLevelDEBUG, "Connection failed for network: ", String(configRTC.wificonfig[j].ssid));
          hasWifiConnection = false;
        }
      }
    }

    Log(LogCategoryWiFi, LogLevelDEBUG, "No known network found");
    hasWifiConnection = false;
    return false;
  }
}

/**
 * @brief Handles NTP synchronization and LED indication.
 */
void handleNtpSynchronization()
{
  if (isNtpSynchronized)
  {
    bootFinishedLED();
  }
  else
  {
    bootFinishedButNtpUpdateNotPossibleLED();
  }
}