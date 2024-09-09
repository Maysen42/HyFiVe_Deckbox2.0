/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
* Description: UART driver for sensor drivers using UART
 */

#ifndef DRIVER_UART_DRV_H_
#define DRIVER_UART_DRV_H_

#include "driverlib.h"

class UART_drv
{
public:
    UART_drv();
    virtual ~UART_drv();
    bool    initUART(EUSCI_A_UART_initParam param);
    void    sendBytes_uart(uint8_t numberOfBytes, uint8_t *data);
    bool    readBytes_uart(uint8_t numberOfBytes, uint8_t *data, uint16_t timeout100ms);
    bool    resetReads_uart();

};

#endif /* DRIVER_UART_DRV_H_ */
