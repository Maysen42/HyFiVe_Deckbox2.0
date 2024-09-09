/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Base Class for sensor driver (incl. I2C-Master)
 */

#include <driver/Csensori2c.h>
#include <msp430.h>

uint8_t *Csensor_i2c::PTxData = 0;
uint8_t *Csensor_i2c::PRxData = 0;
uint8_t Csensor_i2c::RxCount = 0;
uint8_t Csensor_i2c::TxCount = 0;

Csensor_i2c::Csensor_i2c(uint8_t address)
{
    // initialize i2c master interface,
    // Configure USCI_B0 for I2C mode -> Master
    UCB1CTLW0 |= UCSWRST;                   // Software reset enabled
    UCB1CTLW0 |= UCSSEL__SMCLK| UCMODE_3 | UCMST | UCSYNC; // I2C mode, Master mode, sync
    UCB1CTLW1 |= UCASTP_2;                  // Automatic stop generated
                                            // after UCB1TBCNT is reached
    UCB1BRW = 64;                       // baudrate = SMCLK / 64 should be 8000KHz/64 = 125kHz
    UCB1I2CSA = address;                     // Slave address
    UCB1CTL1 &= ~UCSWRST;
    UCB1IE |= UCTXIE0 + UCRXIE0 + UCBCNTIE + UCNACKIE + UCSTPIE; //        UCTXIE0 + UCSTPIE; //Enable I2C transmission and stop interrupts

    //save address to member
    slaveAddress = address;
}


#pragma vector=USCI_B1_VECTOR
__interrupt void Csensor_i2c::USCI_B1_ISR(void)
{
    switch(__even_in_range(UCB1IV,30))
    {
        case 0: break;         // Vector 0: No interrupts
        case 2: break;         // Vector 2: ALIFG
        case 4:                // Vector 4: NACKIFG
            LPM0_EXIT;         // Exit LPM0
            break;

        case 6: break;         // Vector 6: STTIFG
        case 8:                // Vector 8: STPIFG
            LPM0_EXIT;       // Exit LPM0
            break;
        case 10: break;         // Vector 10: RXIFG3
        case 12: break;         // Vector 12: TXIFG3
        case 14: break;         // Vector 14: RXIFG2
        case 16: break;         // Vector 16: TXIFG2
        case 18: break;         // Vector 18: RXIFG1
        case 20: break;         // Vector 20: TXIFG1
        case 22:                 // Vector 22: RXIFG0
            RxCount--;        // Decrement RX byte counter
            if (RxCount) //Execute the following if counter not zero
                {
                    *PRxData++ = UCB1RXBUF; // Move RX data to address PRxData
                    //if (RxCount == 2)     // Only one byte left? need to set this 2 bytes in advance, This can't be right!!!
                    //    UCB1CTL1 |= UCTXSTP;    // Generate I2C stop condition BEFORE last read

                }
            else
                {
                    *PRxData = UCB1RXBUF;   // Move final RX data to PRxData(0)
                    LPM0_EXIT;             // Exit active CPU

                }
            break;
        case 24:                // Vector 24: TXIFG0
            if (TxCount)      // Check if TX byte counter not empty
                {
                    UCB1TXBUF = *PTxData++; // Load TX buffer
                    TxCount--;            // Decrement TX byte counter
                }
            else
                {
                    //UCB1CTL1 |= UCTXSTP; // I2C stop condition
                    UCB1IFG &= ~UCTXIFG0;  // Clear USCI_B0 TX int flag
                    LPM0_EXIT;      // Exit LPM0
                }
            break;
        case 26: break;        // Vector 26: BCNTIFG
        case 28: break;         // Vector 28: clock low timeout
        case 30: break;         // Vector 30: 9th bit
        default: break;
    }
}

bool Csensor_i2c::sendBytes_i2c(uint8_t numberOfBytes, uint8_t *data)
{
    if (numberOfBytes<1)
        return false;


    PTxData = (uint8_t *)data;  //set data array pointer
    TxCount = numberOfBytes;  //set number of bytes to be sent
    UCB1TBCNT = numberOfBytes;
    UCB1CTLW0 |= UCTR + UCTXSTT; // Set to transmit and start
    LPM0;                       //Wait for I2C operations in LPM0
    if (TxCount!=0)
        return false;
    while (UCB1CTLW0  & UCTXSTP); // Ensure stop condition sent

    return true;
}

bool Csensor_i2c::readBytes_i2c(uint8_t numberOfBytes, uint8_t *data)
{
    UCB1CTLW0 &= ~UCTR; //Set as receiver
    PRxData = (uint8_t *)data;    // Point to start of RX array
    RxCount = numberOfBytes; //Read entire data register from slave
    UCB1TBCNT = numberOfBytes;
    UCB1CTLW0 |= UCTXSTT; //Start read

    LPM0; //Wait for I2C
    if (RxCount!=0)
        return false;

    return true;
}

Csensor_i2c::~Csensor_i2c()
{
    // TODO Auto-generated destructor stub
}

