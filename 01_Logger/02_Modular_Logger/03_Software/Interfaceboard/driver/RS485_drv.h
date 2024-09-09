/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description:
 */

#ifndef DRIVER_RS485_DRV_H_
#define DRIVER_RS485_DRV_H_

#include <stdint.h>

class RS485_drv
{
public:
    RS485_drv();
    virtual ~RS485_drv();
    void readRegister(uint8_t *out, uint8_t lenout, uint8_t *in, int lenin);
    void writeRegister(uint8_t *out, uint8_t lenout, uint8_t *reply, int lenreply);
};

#endif /* DRIVER_RS485_DRV_H_ */
