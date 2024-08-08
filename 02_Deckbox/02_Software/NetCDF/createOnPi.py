'''
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Routine to create NetCDF files from data in the InfluxDB
'''

import xarray as xr
import pandas as pd
from datetime import datetime as dt
from loadLocalData import *
import json


'''
    This script runs on the raspberry Pi to create .nc files of recent deployments
    Helpful for understanding and creating
    https://docs.xarray.dev/en/stable/generated/xarray.Dataset.html         dataset
    https://wiki.esipfed.org/Attribute_Convention_for_Data_Discovery_1-3    recommended attributes
    https://cfconventions.org/Data/cf-standard-names/current/build/cf-standard-name-table.html  standard names
'''

influx_url = 'http://192.168.1.123:8086'
influx_token = 'SmQUvgR-WOcTG8k396S3bGTSiXQm_UrBGbofWOkjca45H0w0YRZfytxEkmZgPhFp1LfRoVEL_5ia4AxXBqCTAA=='
loggerId = get_local_loggerId(influx_url, influx_token)  # data frame with current ids, back to -1d
loggerNumber = loggerId.logger_id.shape[0]  # amount of logger (size of column)
print("Amount of devices: " + str(loggerNumber))
for j in range(0, loggerNumber):  # for each logger
    logger_id = loggerId.logger_id[j]
    print("Run Logger: " + str(logger_id))
    json_file = open('python_scripts/recent_deployments.json', 'r')
    stored_deployments = json.load(json_file)
    json_file.close()
    if str(logger_id) not in stored_deployments.keys():
        # print('I have to add the Logger to the dict')
        stored_deployments[str(logger_id)] = []
    dataByLogger = get_local_dataframe(influx_url, influx_token, logger_id)
    if dataByLogger.empty:
        continue
    for i in range(min(dataByLogger.deployment_id.astype('int16')),
                   max(dataByLogger.deployment_id.astype('int16')) + 1):  # for each deployment
        deployment_id = str(i)
        print('Deployment: ' + deployment_id)

        deployment_to_netcdf = dataByLogger[dataByLogger.deployment_id == str(i)].reset_index()
        # deployment_to_netcdf = deployment_to_netcdf.drop(deployment_to_netcdf[deployment_to_netcdf.latitude == -999].
        #                                                 index)     # this is a dummy for no GPS
        if len(deployment_to_netcdf) < 2 or deployment_to_netcdf.pressure.iloc[-1] > 1250\
                or int(deployment_id) in stored_deployments[str(logger_id)]:    # reasons to abort creation
            print('Abort creating netcdf file')
            continue

        df_parameters = get_local_parameters(influx_url, influx_token, logger_id, deployment_id) # get list of parameters
        data_vars = {}
        for parameter in df_parameters.parameter:
            if parameter == 'pressure':
                data_vars['depth'] = (['time'], (deployment_to_netcdf[parameter] - 1000) / 100)
            else:
                data_vars[parameter] = (['time'], deployment_to_netcdf[parameter])
                if parameter + '_raw' in deployment_to_netcdf:
                    data_vars[parameter + '_raw'] = (['time'], deployment_to_netcdf[parameter + '_raw'])

        xr_data = xr.Dataset(
            # coordinates as a dictionary, time is dimension
            coords={'time': deployment_to_netcdf['_time'],
                    'latitude': (['time'], list(deployment_to_netcdf['latitude'])),
                    'longitude': (['time'], list(deployment_to_netcdf['longitude'])),
                    'pressure': (['time'], list(deployment_to_netcdf['pressure']))},
            data_vars=data_vars
        )

        # Assign global attributes
        dtnow = dt.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        xr_data.attrs['date_created'] = dtnow
        xr_data.attrs['history'] = f'File created at {dtnow} using xarray in Python'
        xr_data.attrs['software_version'] = '{"logger": "0.1", "deckunit": "0.1"}'

        # Convention: If multiple attributes of one entity shall be named, use a dictionary
        xr_data.attrs['deployment'] = '{"deployment_id": "' + str(deployment_id) + '", "time_start": "' + str(
            deployment_to_netcdf['_time'].iloc[0]) + '", "time_end": "' + str(
            deployment_to_netcdf['_time'].iloc[-1]) + '", "position_start": "' + str(
            deployment_to_netcdf['latitude'].iloc[0]) + ',' + str(
            deployment_to_netcdf['longitude'].iloc[0]) + '", "position_end":"' + str(
            deployment_to_netcdf['latitude'].iloc[-1]) + ',' + str(deployment_to_netcdf['longitude'].iloc[-1]) + '"}'

        header_logger = get_local_header(influx_url, influx_token, logger_id, deployment_id, 'logger').iloc[0]
        # print(header_logger)
        xr_data.attrs['logger_id'] = deployment_to_netcdf['logger_id'].iloc[0]
        xr_data.attrs['deckunit_id'] = header_logger.deckunit_id
        xr_data.attrs['platform_id'] = header_logger.platform_id
        xr_data.attrs['vessel'] = '{"id": "' + str(header_logger.vessel_id) + '", "name": "' + header_logger.vessel_name + '"}'
        xr_data.attrs['contact'] = '{"id": "' + str(header_logger.contact_id) + '",' \
                                    '"first_name":"' + header_logger.contact_f_name + '",' \
                                    '"last_name": "' + header_logger.contact_l_name + '"}'

        # Assign coordinates attributes
        xr_data['time'].attrs = {
            'standard_name': 'time',
            'long_name': 'Time UTC',
            'coverage_content_type': 'coordinate',
        }

        xr_data['latitude'].attrs = {
            'standard_name': 'latitude',
            'long_name': 'latitude',
            'units': 'degrees_north',
            'coverage_content_type': 'coordinate'
        }

        xr_data['longitude'].attrs = {
            'standard_name': 'longitude',
            'long_name': 'longitude',
            'units': 'degrees_east',
            'coverage_content_type': 'coordinate'
        }

        # Assign pressure attributes
        h_press = get_local_header(influx_url, influx_token, logger_id, deployment_id, 'pressure').iloc[-1]
        # print(h_press)
        calibration_pressure = ''
        for cal_coeff in ['k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9']:
            if cal_coeff in h_press:
                calibration_pressure += '"' + cal_coeff + '":"' + str(h_press[cal_coeff]) + '",'
        calibration_pressure = calibration_pressure[:-1]

        xr_data['pressure'].attrs = {
            'long_name': h_press['long_name'],
            'units': h_press['unit'],
            'sensor_id': h_press['sensor_id'],
            'SerialNumber': h_press['serial_number'],
            'sensor_type': '{"sensor_type_id": "' + str(h_press['sensor_type_id']) + '", "manufacturer": "' +
                           h_press['manufacturer'] + '", "model_name": "' + h_press['model_name'] + '"}',
            # Lets use manufactures names defined by http://vocab.nerc.ac.uk/collection/L35/current/
            'accuracy': h_press['accuracy'],
            'resolution': h_press['resolution'],
            'coverage_content_type': 'coordinate',  # What is that?
            'positive': 'down',  # necessary?         # increase with depth
            'calibration_coefficients': '{' + calibration_pressure + '}'
        }

        # Assign variable attributes
        for parameter in df_parameters.parameter:
            if parameter == 'pressure':
                continue
            header_all = get_local_header(influx_url, influx_token, logger_id, deployment_id, parameter)
            if header_all.empty:
                print('empty header')
                continue
            else:
                header = header_all.iloc[0]
            calibration = ''
            for cal_coeff in ['k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9']:
                if cal_coeff in header:
                    calibration += '"' + cal_coeff + '":"' + str(header[cal_coeff]) + '",'
            calibration = calibration[:-1]

            xr_data[parameter].attrs = {
                'long_name': header['long_name'],
                'units': header['unit'],
                'sensor_id': header['sensor_id'],
                'SerialNumber': header['serial_number'],
                'sensor_type': '{"sensor_type_id": "' + str(header['sensor_type_id']) + '", "manufacturer": "' +
                               header['manufacturer'] + '", "model_name": "' + header['model_name'] + '"}',
                # Lets use manufactures names defined by http://vocab.nerc.ac.uk/collection/L35/current/
                #'accuracy': header['accuracy'],
                # 'resolution': header['resolution'],
                'coverage_content_type': 'physicalMeasurement',
                'calibration_coefficients': '{' + calibration + '}'
            }

        xr_data['depth'].attrs = {
            'long_name': 'depth',
            'units': 'm',
            'accuracy': '',
            'resolution': '',
            'coverage_content_type': 'modelResult',
        }

        # sepcify encoding
        myencoding = {
            'time': {
                # 'dtype': 'datetime64[ns]',
                '_FillValue': None
            },
            'longitude': {
                'dtype': 'float64',
                '_FillValue': None
            },
            'latitude': {
                'dtype': 'float64',
                '_FillValue': None
            },
            'pressure': {
                'dtype': 'float64',
                '_FillValue': None
            }
        }

        xr_data.to_netcdf(f'/usr/src/node-red/netcdf/logger_{logger_id}_deployment_{deployment_id}.nc',
                          encoding=myencoding)
        # xr_data.to_netcdf(f'files/logger_{logger_id}_deployment_{deployment_id}.nc',
        #                  encoding=myencoding)
        stored_deployments[str(logger_id)].append(int(deployment_id))
        # print(stored_deployments)
        json_file = open('python_scripts/recent_deployments.json', 'w')
        json.dump(stored_deployments, json_file)
        json_file.close()
