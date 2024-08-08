'''
   SPDX-FileCopyrightText: (C) 2024 Oliver Thiele, Leibniz Institute for Baltic Sea Research Warnemuende
 
   SPDX-License-Identifier: MPL-2.0
 
   Project: Hydrography on Fishing Vessels
   Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 
   Description: 
 '''

import pandas as pd
import numpy as np
import xarray as xr
import json
import sqlalchemy
import datetime
import gsw
import os
from sqlalchemy import Integer, Float, DateTime, Numeric, Text, Enum
from classes_writeToDB import PointGeometry, PolygonGeometry



def get_paths(path_specification):
    if path_specification == 'local_olli':
        path_to_write = 'Data/to_write/'
        path_written = 'Data/written/'
        path_logs = 'Data/logs/'
        path_problematic = 'Data/problematic_files/'
        path_rules = ''
    elif path_specification == 'server_relative':
        path_to_write = '../../mailbox/in/netcdf/'
        path_written = '../backup_files/'
        path_logs = '../logs/'
        path_problematic = '../files_with_problems/'
        path_rules = ''
    elif path_specification == 'server_absolute':
        path_to_write = '/home/hyfiveuser/mailbox/in/netcdf/'
        path_written = '/home/hyfiveuser/netcdf_handling/backup_files/'
        path_logs = '/home/hyfiveuser/netcdf_handling/logs/'
        path_problematic = '/home/hyfiveuser/netcdf_handling/files_with_problems/'
        path_rules = '/home/hyfiveuser/netcdf_handling/python_scripts/'
    else:
        path_to_write = '/home/hyfiveuser/mailbox/in/netcdf/'
        path_written = '/home/hyfiveuser/netcdf_handling/backup_files/'
        path_logs = '/home/hyfiveuser/netcdf_handling/logs/'
        path_problematic = '/home/hyfiveuser/netcdf_handling/files_with_problems/'
        path_rules = '/home/hyfiveuser/netcdf_handling/python_scripts/'

    return path_to_write, path_written, path_logs, path_problematic, path_rules

#server absolute paths
# path_to_write, path_written, path_logs, path_problematic = get_paths('server_absolute')


#connect to engine/db
def connect_to_Maria():
    try:
        engine = sqlalchemy.create_engine('mysql+pymysql://admin:tfZwSRanFaAZ@hyfive.info:3306/hyFiveDB')
        conn = engine.connect()
    except sqlalchemy.exc.SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
    
    return engine, conn

# =============================================================================
# def connect_to_Maria():
#     try:
#         engine = sqlalchemy.create_engine('mysql+pymysql://root:@localhost:3306/hyFiveDB')
#         conn = engine.connect()
#     except sqlalchemy.exc.SQLAlchemyError as e:
#         error = str(e.__dict__['orig'])
#         print(error)
#     
#     return engine, conn
# =============================================================================


#load data from nc file, split into attributes containing meta information and df_data with the actual pandas dataset
def load_deployment(pathToNC):
    data = xr.open_dataset(pathToNC)
    # df_data = data.to_dataframe()       #convert xarray data to pandas dataframe
    # return data.attrs, df_data
    return data


def check_logger_sensor_config(logger_id, df, data, engine, path_logs):
    #check which logger is used and which sensors are attached to it, compare to current DB-state
    #TODO: write log-file if configuration is not matching
    sensor_id_list = []
    for column in df.columns.values:
        try:
            sensor_id_list.append(int(data[column].attrs['sensor_id'])) #=data.column.sensor_id
        except KeyError:
            pass
            
    #get db values for specific logger_id
    query = 'SELECT * FROM LoggerContainsSensor WHERE logger_id = {};'     #logger_id = {} AND time_end >= \'{}\'
    #more sophisticated SQL filtering could be used here, but NaT/None values in time makes this more complicated
    #query = 'SELECT * FROM LoggerContainsSensor WHERE logger_id = {} AND time_start <= \'{}\';'     #logger_id = {} AND time_end >= \'{}\'
    sensorIdsDB = pd.read_sql_query(query.format(logger_id), con = engine)
    # print(sensorIdsDB)
# =============================================================================
#     #time handling and filtering the pandas array:        
# =============================================================================
    time_start_deployment = json.loads(data.deployment)['time_start']
    time_end_deployment = json.loads(data.deployment)['time_end']
    #convert strings to timestamp
    time_start_deployment_dt = pd.to_datetime(time_start_deployment)
    time_end_deployment_dt = pd.to_datetime(time_end_deployment)
    #to be able to compare with datetime64 datatype from db
    #TODO: is this conversion ok?
    time_start_deployment = time_start_deployment_dt.to_datetime64()
    time_end_deployment = time_end_deployment_dt.to_datetime64()
    # print('start converted: ', time_start_deployment, 'end converted: ',time_end_deployment)
    # print(time_start_deployment)

    #remove too new sensor-logger relations:
    sensorIdsDB = sensorIdsDB.drop(sensorIdsDB[sensorIdsDB.time_start > time_start_deployment].index)
    # print(sensorIdsDB)

    #drop all sensor-logger relations, that ended before the deployment ended
    sensorIdsDB = sensorIdsDB.drop(sensorIdsDB[sensorIdsDB.time_end < time_end_deployment].index)
    # print(sensorIdsDB)

    #sort sensor_id column of remaining array
    sensor_id_arr_db = np.sort(np.array(sensorIdsDB['sensor_id']))
        
    #compare sensor ids to db value
    if np.array_equal(sensor_id_arr_db, np.sort(sensor_id_list)) == False:
        print('sensor configuration for logger with logger_id {} does not match configuration in database'.format(logger_id))
        print('sensors attached to logger in measurement: {}'.format(np.sort(sensor_id_list)))
        print('sensors attached to logger according to database, time... : {}'.format(sensor_id_arr_db))
        with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
            logfile.write(str(datetime.datetime.now()) + ':\t' + 'error: Logger-Sensor-configuration for logger ' + str(logger_id) + ' does not match.\n')
            logfile.write('\t \t \t \t \t \t \tconfig in file: {}\n'.format(np.sort(sensor_id_list)))
            logfile.write('\t \t \t \t \t \t \tconfig in database: {}\n'.format(sensor_id_arr_db))
            logfile.write('\t \t \t \t \t \t \tdeployment start/end: {}/{}\n'.format(time_start_deployment, time_end_deployment))
        return False
    else: 
        # print('sensor configuration for logger with logger_id {}:'.format(logger_id))
        # print('sensors attached to logger in measurement: {}'.format(np.sort(sensor_id_list)))
        # print('sensors attached to logger according to database, time... : {}'.format(sensor_id_arr_db))
        return True

# =============================================================================
# def write_logger_sensor_config():
#     return None
# 
# def update_logger_sensor_config():
#     return None
# 
# def delete_logger_sensor_config():
#     return None
# =============================================================================


def check_sensor_existence(conn, engine, sensor_id):
    query = 'SELECT 1 FROM Sensor WHERE sensor_id = {}'#.format(sensor_id)
    # res = conn.execute(query).fetchall()
    df_sensor_existance = pd.read_sql_query(query.format(sensor_id), con = engine)
    try:
        if df_sensor_existance['1'][0] == 1:
            # print(f'sensor with id {sensor_id} exists')
            return True
    except IndexError:
        return False
# =============================================================================
#     try:
#         if res[0][0] == 1:
#             # print(f'sensor with id {sensor_id} exists')
#             return True
#     except IndexError:
#         return False
# =============================================================================


def check_for_duplicate_nc_files(path_to_write, path_written, nc_filename):
    duplicate_exists = False
    suspicious_filename = False
    stats_ncfile_written = 0
    if os.path.isfile(path_written + nc_filename):
        suspicious_filename = True
        stats_ncfile_written = os.stat(path_written + nc_filename)
        if os.path.getsize(path_to_write + nc_filename) == os.path.getsize(path_written + nc_filename):
            duplicate_exists = True
    
    return duplicate_exists, suspicious_filename, stats_ncfile_written


def write_log_error_msg(path_logs, error_msg):
    with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
        logfile.write(str(datetime.datetime.now()) + ':\t' + 'error: ' + error_msg + '\n')


def write_log_regular_msg(path_logs, msg):
    with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
        logfile.write(str(datetime.datetime.now()) + ':\t' + msg + '\n')


#old:
# def get_sensor_calculation(sensor_id, engine):
#new:
def get_sensor_calculation(sensor_id, engine, time_measurement):
    """
    :param sensor_id: The sensors ID of the sensor that is being handled
    :param engine: MariaDB connector
    :param time_measurement: end time of measurement (datetime64) (e.g. from deployment), to delete calibration coefficients newer than this value
    :return: A dataframe with the factors (f), the powers (p) and calibration coefficients (c) for
        f0 * c0 * val ** p0 + ... + fn * cn * val ** pn
    """
    
    # run queries to get all information
    query = 'SELECT sensor_type_id FROM Sensor WHERE sensor_id = {};'   # get the sensor-type_id
    sensor_type_id = pd.read_sql_query(query.format(sensor_id), con=engine).sensor_type_id[0]
    query = 'SELECT calculation_rule FROM SensorType WHERE sensor_type_id = {};'    # get the calculation rule
    calculation_rule = pd.read_sql_query(query.format(sensor_type_id), con=engine)
    query = 'SELECT * FROM hyFiveDB.CalibrationCoefficient cc WHERE sensor_id = {};'    # get the calibration coeffs
    df_coefficients = pd.read_sql_query(query.format(sensor_id), con=engine)

    # handle the results
    rule = (calculation_rule.calculation_rule[0])
    list_factors = rule[rule.index('[') + 1:rule.index(']')].split(',')
    list_factors = list(map(float, list_factors))
    list_power = rule[rule.index('[', rule.index('[') + 2) + 1:rule.index(']', rule.index(']') + 2)].split(',')
    list_power = list(map(float, list_power))
    #old:
    # df_coefficients = df_coefficients.sort_values('time_calibration').drop_duplicates('coefficient_id_per_sensor_id', keep='last')
    #new:
    #remove coefficients newer than the measurement
    df_coefficients['time_calibration'] = pd.to_datetime(df_coefficients['time_calibration'])
    df_coefficients = df_coefficients.drop(df_coefficients[df_coefficients.time_calibration > time_measurement].index)
    #remove all but the newest coefficients in remaining df:
    df_coefficients = df_coefficients.sort_values('time_calibration').drop_duplicates('coefficient_id_per_sensor_id', keep='last')

    list_coefficients = list(df_coefficients.value)

    if len(list_factors) == len(list_power) == len(list_coefficients):
        dict = {'factors': list_factors, 'powers': list_power, 'coefficients': list_coefficients}
        df = pd.DataFrame(dict)
        return df
    else:
        return pd.DataFrame([])
