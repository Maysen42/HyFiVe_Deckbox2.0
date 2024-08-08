'''
   SPDX-FileCopyrightText: (C) 2024 Oliver Thiele, Leibniz Institute for Baltic Sea Research Warnemuende
 
   SPDX-License-Identifier: MPL-2.0
 
   Project: Hydrography on Fishing Vessels
   Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 
   Description:
 '''

#reimports:
import numpy as np
import pickle   


def execute_check(check_id, df_processed_values, parameter_type, rules):
    
    values = df_processed_values['value']
    
    if check_id == -101:
        check_description = 'check for outliers'
        #check for outliers
        passed_all = True
        passedIndex_arr = np.ones(len(values))
        for count, value in enumerate(values):
            if value == rules['general']['outlier']:
                passed_all = False
                passedIndex_arr[count] = 0
            elif value < rules[parameter_type]['outlier_low']:
               passed_all = False
               passedIndex_arr[count] = 0
            elif value > rules[parameter_type]['outlier_high']:
                passed_all = False
                passedIndex_arr[count] = 0
        passedIndex_arr = passedIndex_arr.astype(int)
        
    elif check_id == -102:
        measuring_times = df_processed_values['measuring_time']
        check_description = 'check for dates before 1970'
        #check for dates before xy (1970)
        passed_all = True
        passedIndex_arr = np.ones(len(measuring_times))
        for count, value in enumerate(measuring_times):
            if value < rules['measuring_time']['outlier_low']:
               passed_all = False
               passedIndex_arr[count] = 0

        passedIndex_arr = passedIndex_arr.astype(int)

        
        
    return check_id, passed_all, passedIndex_arr, check_description