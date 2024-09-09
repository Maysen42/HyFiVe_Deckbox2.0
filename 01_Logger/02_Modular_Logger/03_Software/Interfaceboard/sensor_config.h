/*
 * CopyrightText: (C) 2024 Hensel Elektronik GmbH
 *
 * License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: sensor IDs
 */

#ifndef SENSOR_CONFIG_H
#define SENSOR_CONFIG_H

// ID | Manufacturer        | Parameter         | Model                 | Long name                                 | Unit
//----:---------------------:-------------------:-----------------------:-------------------------------------------:--------------
// 1  : blue_robotics       : pressure          : bar30                 : sea_water_pressure                        : mbar
// 2  : blue_robotics       : temperature       : celsius_fast_response : sea_water_temperature                     : degree_C
// 4  : presens             : oxygen            : NAU-OIW               : mass_concentration_of_oxygen_in_sea_water : mbar
// 5  : presens             : oxygen            : NAU-YOP               : mass_concentration_of_oxygen_in_sea_water : mbar
// 6  : keller              : pressure          : series_20             : sea_water_pressure                        : mbar
// 7  : aml                 : temperature       : ct_xchange            : sea_water_temperature                     : degree_C
// 8  : aml                 : conductivity      : ct_xchange            : sea_water_electrical_conductivity         : mS_cm-1
// 3  : atlas_scientific    : conductivity      : k0.1                  : sea_water_electrical_conductivity         : mS_cm-1
// 10 : atlas_scientific    : conductivity      : k1.0                  : sea_water_electrical_conductivity         : mS_cm-1
// 9  : pyroscience         : oxygen            : oxycap_sub            : partial_pressure_of_oxygen_in_sea_water   : mbar
// 11 : pyroscience         : oxygen            : oxycap_hs_sub         : partial_pressure_of_oxygen_in_sea_water   : mbar
// 12 : Turner              : turbidity         : C-Flour_TRB           : sea_water_turbidity_in_NTU                : NTU
// 13 : Turner              : phycoerythrin     : C-Flour_PE            : phycoerythrin_in_ppb                      : ppb

// SELECTED_SENSOR ID
#define SELECTED_SENSOR 9

#endif
