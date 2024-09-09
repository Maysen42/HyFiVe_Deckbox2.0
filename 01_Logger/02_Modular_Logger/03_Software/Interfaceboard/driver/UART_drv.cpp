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

#include <msp430fr2673.h>
#include "driverlib.h"
#include <stdint.h>
#include <driver/UART_drv.h>

#define GPIO_PORT_UCA0TXD       GPIO_PORT_P1
#define GPIO_PIN_UCA0TXD        GPIO_PIN4
#define GPIO_FUNCTION_UCA0TXD   GPIO_PRIMARY_MODULE_FUNCTION
#define GPIO_PORT_UCA0RXD       GPIO_PORT_P1
#define GPIO_PIN_UCA0RXD        GPIO_PIN5
#define GPIO_FUNCTION_UCA0RXD   GPIO_PRIMARY_MODULE_FUNCTION

volatile uint8_t RXData = 0;
volatile uint8_t TXSent = 0;
volatile uint8_t rx_buffer[150];
volatile uint8_t rx_index = 0;
volatile uint16_t TimeoutCounter;


UART_drv::UART_drv()
{
    // TODO Auto-generated constructor stub

}

UART_drv::~UART_drv()
{
    // TODO Auto-generated destructor stub
}

bool UART_drv::initUART(EUSCI_A_UART_initParam param)
{
    //Set ACLK = REFOCLK with clock divider of 1
    CS_initClockSignal(CS_ACLK,CS_REFOCLK_SELECT,CS_CLOCK_DIVIDER_1);
    //Set SMCLK = DCO with frequency divider of 1
    CS_initClockSignal(CS_SMCLK,CS_DCOCLKDIV_SELECT,CS_CLOCK_DIVIDER_1);
    //Set MCLK = DCO with frequency divider of 1
    CS_initClockSignal(CS_MCLK,CS_DCOCLKDIV_SELECT,CS_CLOCK_DIVIDER_1);

    //Configure UART pins
//    GPIO_setAsPeripheralModuleFunctionInputPin(
//            GPIO_PORT_UCA0TXD,
//            GPIO_PIN_UCA0TXD,
//            GPIO_FUNCTION_UCA0TXD
//    );
//    GPIO_setAsPeripheralModuleFunctionInputPin(
//            GPIO_PORT_UCA0RXD,
//            GPIO_PIN_UCA0RXD,
//            GPIO_FUNCTION_UCA0RXD
//    );
    P1SEL0 |= BIT4 | BIT5;
    P1SEL1 &= ~BIT4;
    P1SEL1 &= ~BIT5;
    P1DIR |= BIT4;
    P1DIR &= ~BIT5;


    /*
     * Disable the GPIO power-on default high-impedance mode to activate
     * previously configured port settings
     */
    PMM_unlockLPM5();

//    //Configure UART
//    //SMCLK = 8MHz, Baudrate = 9600
//    //UCBRx = 52, UCBRFx = 1, UCBRSx = 0, UCOS16 = 1
//    EUSCI_A_UART_initParam param = {0};
//    param.selectClockSource = EUSCI_A_UART_CLOCKSOURCE_SMCLK;
//    param.clockPrescalar = 52;
//    param.firstModReg = 1;
//    param.secondModReg = 0;
//    param.parity = EUSCI_A_UART_NO_PARITY;
//    param.msborLsbFirst = EUSCI_A_UART_LSB_FIRST;
//    param.numberofStopBits = EUSCI_A_UART_ONE_STOP_BIT;
//    param.uartMode = EUSCI_A_UART_MODE;
//    param.overSampling = EUSCI_A_UART_OVERSAMPLING_BAUDRATE_GENERATION;

    if (STATUS_FAIL == EUSCI_A_UART_init(EUSCI_A0_BASE, &param)) {
        return false;
    }

    EUSCI_A_UART_enable(EUSCI_A0_BASE);

    EUSCI_A_UART_clearInterrupt(EUSCI_A0_BASE,
                                EUSCI_A_UART_RECEIVE_INTERRUPT);

    // Enable USCI_A0 RX interrupt
    EUSCI_A_UART_enableInterrupt(EUSCI_A0_BASE,
                                 EUSCI_A_UART_RECEIVE_INTERRUPT);
    // Enable USCI_A0 RX interrupt
    EUSCI_A_UART_enableInterrupt(EUSCI_A0_BASE,
                                 EUSCI_A_UART_TRANSMIT_INTERRUPT);


    //init TimerA
    //set CCR0 trigger
    TA0CCR0 = 8000;
    //select timer A clock sourceACLK,
    //and Upmode (Counts up to TACCR0 and gives an interrupt)
    TA0CTL = TASSEL_2  | MC_1 ;


    // Enable global interrupts
    __enable_interrupt();
    return true;
}

#pragma vector = TIMER0_A0_VECTOR
__interrupt void TIMERA0_ISR(void)
{
    TimeoutCounter++;
//    if(++TimeoutCounter>=5)
//    {
//        //exit LPM after return
//        _BIC_SR_IRQ(LPM3_bits);
//    }
}

void UART_drv::sendBytes_uart(uint8_t numberOfBytes, uint8_t *data)
{
    for (uint8_t i = 0; i < numberOfBytes; i++)
    {
        _delay_cycles(5000); //wait between bytes!?
        TXSent = 0;
        TimeoutCounter = 0;
        TA0CCTL0 |= CCIE;
        EUSCI_A_UART_transmitData(EUSCI_A0_BASE, data[i]);
        while ( (TimeoutCounter < 1) && (TXSent == 0))
        {
            //nop;
        }
        TA0CCTL0 &= ~CCIE;
    }
}

bool UART_drv::readBytes_uart(uint8_t numberOfBytes, uint8_t *data, uint16_t timeout1ms)
{
    TimeoutCounter = 0;
    TA0CCTL0 |= CCIE;
    while (TimeoutCounter < timeout1ms)
    {
        if (rx_index > 0 && rx_index <= numberOfBytes && rx_buffer[rx_index-1] == '\r')
        {
            memcpy(data, (const void *)rx_buffer, rx_index);
            rx_index = 0;
            TA0CCTL0 &= ~CCIE;
            return true;
        }
    }
    TA0CCTL0 &= ~CCIE;
    return false;
}

bool UART_drv::resetReads_uart()
{
        rx_index = 0;
        return true;
}

//******************************************************************************
//
//This is the USCI_A0 interrupt vector service routine.
//
//******************************************************************************
#if defined(__TI_COMPILER_VERSION__) || defined(__IAR_SYSTEMS_ICC__)
#pragma vector=USCI_A0_VECTOR
__interrupt
#elif defined(__GNUC__)
__attribute__((interrupt(USCI_A0_VECTOR)))
#endif
void EUSCI_A0_ISR(void)
{
    switch(__even_in_range(UCA0IV,USCI_UART_UCTXCPTIFG))
    {
        case USCI_NONE: break;
        case USCI_UART_UCRXIFG:
            RXData = EUSCI_A_UART_receiveData(EUSCI_A0_BASE);
            // save RXData in RX-buffer
            if (rx_index < sizeof(rx_buffer)) {
                rx_buffer[rx_index] = RXData;
                rx_index++;
            }
            break;
       case USCI_UART_UCTXIFG:
           TXSent = 1;
           break;
       case USCI_UART_UCSTTIFG: break;
       case USCI_UART_UCTXCPTIFG: break;
    }
}
