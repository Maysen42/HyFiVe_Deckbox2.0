#ifndef OxyBase_H_
#define OxyBase_H_

#include <stdint.h>
#include "driver/RS485_drv.h"

class OxyBase{
    public:
        OxyBase();
        void init(RS485_drv &rs);
        void setMeasurementMode();
        void readMeasurementMode();
        void setOxygenUnit();
        void readOxygenUnit();
        void activateMeasurement();
        void getOxygene();

        char firmware[16];
        char serialNr[16];
        uint_fast16_t oxygene;

    private:
        void getFirmware();
        void getSerialNr();
        RS485_drv * _rs485;
        uint8_t oxyval[29];
};

#endif
