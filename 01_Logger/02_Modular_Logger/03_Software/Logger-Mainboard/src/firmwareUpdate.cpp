/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Firmware update management
 */

#include <ArduinoOTA.h>
#include <SD.h>
#include <WiFiClientSecure.h>

#include "firmwareUpdate.h"

/**
 * @brief Updates the firmware from a file on the SD card.
 */
void updateFirmware()
{
  File updateFile = SD.open("/updateFW/firmware.bin");
  if (updateFile)
  {
    if (Update.begin(updateFile.size()))
    {
      size_t written = Update.writeStream(updateFile);
      if (written == updateFile.size())
      {
        Serial.println("Firmware update successful!");
      }
      else
      {
        Serial.println("Firmware update failed!");
      }
      if (Update.end())
      {
        if (Update.isFinished())
        {
          SD.remove("/updateFW/firmware.bin");
          delay(1000);
          ESP.restart();
        }
        else
        {
          Serial.println("Update not completed. Error!");
        }
      }
      else
      {
        Serial.printf("Error when ending the update");
      }
    }
    else
    {
      Serial.printf("Not enough memory for the update.");
    }
    updateFile.close();
  }
  else
  {
    Serial.println("Error opening the firmware file.");
  }
}

/**
 * @brief Calculates the SHA-256 hash of the firmware file.
 */
void calculateSha256()
{
  File file = SD.open("/updateFW/firmware.bin", FILE_READ); // mit der datei soll der SHA gemacht werden
  if (!file)
  {
    Serial.println("File could not be opened!");
    return;
  }

  // Initialize the SHA-256 algorithm
  mbedtls_md_context_t ctx;
  mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;
  const size_t hash_size = 32; // SHA-256 produziert einen Hash von 32 Bytes
  unsigned char hash[hash_size];

  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 0);
  mbedtls_md_starts(&ctx);

  // Read the file and calculate the hash
  while (file.available())
  {
    char buf[128];
    int l = file.readBytes(buf, sizeof(buf));
    mbedtls_md_update(&ctx, (const unsigned char *)buf, l);
  }
  file.close();

  mbedtls_md_finish(&ctx, hash);
  mbedtls_md_free(&ctx);

  // Output of the calculated hash in hexadecimal form
  Serial.print("SHA-256 Hash: ");
  for (int i = 0; i < hash_size; i++)
  {
    Serial.printf("%02x", hash[i]);
  }
  Serial.println();
}
