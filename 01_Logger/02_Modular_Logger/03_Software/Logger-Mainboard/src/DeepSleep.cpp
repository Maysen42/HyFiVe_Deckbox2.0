/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Deep sleep management for power saving
 */

#include <Arduino.h>

#include "DeepSleep.h"

#define uS_TO_S_FACTOR 1000000UL

/**
 * @brief Puts the ESP32 into deep sleep for a specified number of seconds.
 * @param sleepTimeSec The number of seconds to sleep.
 */
void espDeepSleepSec(uint32_t sleepTimeSec)
{
  esp_sleep_enable_timer_wakeup(sleepTimeSec * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}

int64_t activePinMask = 0;
/**
 * @brief Enables an external wake-up source on a specific pin.
 * @param pin The GPIO pin number to use as a wake-up source.
 */
void enableExternalWakeup(uint8_t pin)
{
  pinMode(pin, INPUT);
  activePinMask |= (1ULL << pin);
  esp_sleep_enable_ext1_wakeup(activePinMask, ESP_EXT1_WAKEUP_ANY_LOW);
}

/**
 * @brief Disables a previously enabled wake-up pin.
 * @param pin The GPIO pin number to disable as a wake-up source.
 */
void disableWakeupPin(uint8_t pin)
{
  if (activePinMask & (1ULL << pin))
  {
    activePinMask &= ~(1ULL << pin);
    if (activePinMask != 0)
    {
      esp_sleep_enable_ext1_wakeup(activePinMask, ESP_EXT1_WAKEUP_ANY_LOW);
    }
    else
    {
      esp_sleep_disable_wakeup_source(ESP_SLEEP_WAKEUP_EXT1);
    }
  }
  else
  {
    Serial.printf("is not enabled", pin);
  }
}