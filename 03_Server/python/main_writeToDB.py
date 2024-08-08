'''
   SPDX-FileCopyrightText: (C) 2024 Oliver Thiele, Leibniz Institute for Baltic Sea Research Warnemuende
 
   SPDX-License-Identifier: MPL-2.0
 
   Project: Hydrography on Fishing Vessels
   Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 
   Description: Main routine to insert data into the MariaDB on the land-based server.
 '''

from functions_writeToDB import *
from checks_list import *
from sqlalchemy import Integer, Float, DateTime, Numeric, Text
from sqlalchemy.sql import text

from classes_writeToDB import PointGeometry, PolygonGeometry

#for copying files and keeping metadata
import shutil

import time

#for conversion of iso-timestrings to datetime objects
from dateutil import parser
import pickle

# %%

#set paths
path_to_write, path_written, path_logs, path_problematic, path_rules = get_paths('server_absolute')
#possible: 'local_olli', 'server_relative', 'server_absolute'; if string doesnt match -> server_absolute

#load rules and modules for checks and processing
with open(path_rules + 'processing_rules.pkl', 'rb') as f:
    rules = pickle.load(f)   

#connect to engine/db
engine, conn = connect_to_Maria()

# %%

for nc_file in os.listdir(path_to_write):    
    try:
        noErrors = True
        write_log_regular_msg(path_logs, 'processing ' + nc_file)
        print('currently processing ' + nc_file)
        
        #check for duplicates/already written nc files of same name and size
        duplicate, suspicious_name, file_stats = check_for_duplicate_nc_files(path_to_write, path_written, nc_file)
        if duplicate == True:
            noErrors = False
            error_msg = """duplicate nc file already exists in database
                           \toriginal file was written in database at time: {}
                        """.format(str(time.ctime(file_stats.st_mtime)))
            write_log_error_msg(path_logs, error_msg)
        elif suspicious_name == True:
            noErrors = False
            error_msg = """nc file with same name but different filesize already exists in database
                        '\t \t \t \t \t \t \toriginal file was written in database at time: ' + str(time.ctime(file_stats.st_mtime))
                        """
            write_log_error_msg(path_logs, error_msg)
        
        #load file to be written into db
        # nc_file = 'deployment_14.nc'
        # data = load_deployment('Data/' + nc_file)
        data = load_deployment(path_to_write + nc_file)
        df = data.to_dataframe()       #convert xarray data to pandas dataframe
        
        # =============================================================================
        # #checks before
        # =============================================================================
        #check which logger is used and which sensors are attached to it, compare to current DB-state
        logger_id = data.logger_id
        
        if check_logger_sensor_config(logger_id, df, data, engine, path_logs) == False:
            noErrors = False
        else:
            print('logger-sensor-configuration matches! - continue')
        
        # =============================================================================
        # #write in database: loop over all sensors, that have a sensor id
        # #                   for each of those, format according to raw value:
        # #                   raw_value_id, deployment_id, sensor_id, measuring_time, measuring_location, value, pressure
        # =============================================================================
        # last_raw_value_id = 0
        loop_count = 0
        for column in df.columns.values:
            if column == 'pressure':
                pass
            else:
                try:
        
                    sensor_id = int(data[column].attrs['sensor_id']) #=data.column.sensor_id
                    print('handling sensor with sensor_id ', sensor_id)
                    # print(data[column].attrs)
            
        # =============================================================================
        #             #format according to RawValue:
        # =============================================================================
                        #deploy = json.loads(data.deployment)
                        #deploy['deployment_id']
                    deployment_id = json.loads(data.deployment)['deployment_id']
                    time_start_deployment = json.loads(data.deployment)['time_start']
                    time_end_deployment = json.loads(data.deployment)['time_end']
                    #convert strings to timestamp
                    time_start_deployment_dt = pd.to_datetime(time_start_deployment)
                    time_end_deployment_dt = pd.to_datetime(time_end_deployment)
                    #to be able to compare with datetime64 datatype from db
                    #TODO: is this conversion ok?
                    time_start_deployment = time_start_deployment_dt.to_datetime64()
                    time_end_deployment = time_end_deployment_dt.to_datetime64()


                    #################
                    #check if column_raw exists and use those values instead; calculate processed values:
                    try:
                        # print(column)
# =============================================================================
#                         if (df[column + '_raw'].iloc[0] == -1):
#                             df_RawValue = df[[column, 'latitude', 'longitude', 'pressure']].copy()
#                             #save preprocessed values or raw values for further processing
#                             processed_values = df[column].values.astype(float)
#                             has_raw_value = False
#                             pass
# =============================================================================
                            
                        df_RawValue = df[[column + '_raw', 'latitude', 'longitude', 'pressure']].copy()    
                        df_RawValue = df_RawValue.rename(columns={column + '_raw': column})    
                        # print(df_RawValue)
                        #save preprocessed values or raw values for further processing
                        processed_values =  df[column + '_raw'].values.astype(float)
                        # print(processed_values)
                        has_raw_value = True
                        sensor_calc = get_sensor_calculation(sensor_id, engine, time_end_deployment)
                        # print(sensor_calc)
                        # get_sensor_calculation returns: A dataframe with the factors (f), the powers (p) and calibration coefficients (c) for
                        #     f0 * c0 * val ** p0 + ... + fn * cn * val ** pn
                        #calculate processed values:
                        for count, value in enumerate(df[column + '_raw']):
                            processed_values[count] =  sum(sensor_calc['factors'] * sensor_calc['coefficients'] * value ** sensor_calc['powers'])
                    
                    except:
                        df_RawValue = df[[column, 'latitude', 'longitude', 'pressure']].copy()
                        #save preprocessed values or raw values for further processing
                        processed_values = df[column].values.astype(float)
                        has_raw_value = False
                        
                    df_RawValue = df_RawValue.dropna(how='any')             #drop NaNs
                    df_RawValue = df_RawValue.rename_axis('measuring_time').reset_index()
                    
                    #if time input is an iso-string, use parser to convert to datetime.datetime object
                    #TODO: is there a better/faster/safer way to do this? 
                    #If nc files get created consequently, this also could be removed again; 
                    #the check for the empty dataframe should be kept though..
                    try:
                        if isinstance(df_RawValue['measuring_time'].iloc[0], str):
                            for count, value in enumerate(df_RawValue['measuring_time']):
                                df_RawValue['measuring_time'].iloc[count] = parser.parse(value)
                                
                    except IndexError:
                        print('empty dataframe')
                        error_msg = """Empty dataframe.
                                    """
                        write_log_error_msg(path_logs, error_msg)
                        noErrors = False
                        break    #TODO: does this allow the script to copy the spurious nc-file to the problematic folder?
                    
                    #calculate minima and maxima of lats and lons for bounding box
                    lon_min = min(df_RawValue['longitude'])
                    lon_max = max(df_RawValue['longitude'])
                    lat_min = min(df_RawValue['latitude'])
                    lat_max = max(df_RawValue['latitude'])
        
                    points = zip(df_RawValue.latitude, df_RawValue.longitude)
                    df_RawValue['measuring_location'] = list(points)    
                
                    deployment_id_arr = np.full(shape=len(df_RawValue), fill_value=deployment_id, dtype=Integer)
                    sensor_id_arr = np.full(shape=len(df_RawValue), fill_value=sensor_id, dtype=Integer)
                    logger_id_arr = np.full(shape=len(df_RawValue), fill_value=logger_id, dtype=Integer)
                    df_RawValue['deployment_id'] = deployment_id_arr
                    df_RawValue['sensor_id'] = sensor_id_arr
                    df_RawValue['logger_id'] = logger_id_arr
                    
                #if raw_value_id should continue counting:
                    # raw_value_id_arr = np.arange(last_raw_value_id, last_raw_value_id + len(deployment_id_arr), 1, dtype = int)
                    # last_raw_value_id = raw_value_id_arr[-1] + 1
                #new raw_value_id for each sensor & logger & deployment:
                    raw_value_id_arr = np.arange(0, len(deployment_id_arr), 1, dtype = int)
                    df_RawValue['raw_value_id'] = raw_value_id_arr 
                    
                    df_RawValue = df_RawValue[['raw_value_id', 'deployment_id', 'sensor_id', 'measuring_time', 'measuring_location', column, 'pressure', 'logger_id']]
                    df_RawValue = df_RawValue.rename(columns={column: "value"})                      
                    

                    # df_RawValue.index.names = ['raw_value_id']
        
                    #check for out of range or unlogical values
                        #TODO: implement better checks for this for all possible sensors, 
                        #SettingWithCopyWarning
                    for count, x in enumerate(df_RawValue.value):
                        if x <= -1e12 or x >= 1e13:
                            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                                logfile.write(str(datetime.datetime.now()) + ':\t' + 'unlogical or out of range value in RawValue.' + str(column) + ' with sensor_id ' + str(sensor_id) + ' at Index ' + str(count) + ':\n')
                                logfile.write('\t \t \t \t \t \t \t' + str(x) + ' has been set to -9999.\n')
                            df_RawValue.value[count] = -9999
                    
# =============================================================================
#             #prepare entry for ProcessedValue
# =============================================================================
            # =============================================================================
            #         #get sensor_type_id and unit_id 
            # =============================================================================
                    get_sensor_type_id_query = 'SELECT sensor_type_id FROM Sensor WHERE sensor_id = {};'
                    get_sensor_type_id = pd.read_sql_query(get_sensor_type_id_query.format(sensor_id), con = engine)
                    sensor_type_id = get_sensor_type_id['sensor_type_id'][0]
                    get_unit_id_query = 'SELECT unit_id FROM SensorType WHERE sensor_type_id = {};'
                    get_unit_id = pd.read_sql_query(get_unit_id_query.format(sensor_type_id), con = engine)
                    unit_id = get_unit_id['unit_id'][0]
                    
            # =============================================================================
            #         #process other values and format dataframe
            # =============================================================================
                
                    # depth_arr = gsw.z_from_p(df_RawValue['pressure'], latitudes)
                    pressure_arr = df_RawValue['pressure']
                    df_ProcessedValue = df_RawValue[['deployment_id', 'measuring_time', 'measuring_location', 'value']].copy()
                    
                    # replace value column with acutal processed values:
                    df_ProcessedValue['value'] = processed_values
                    
                    df_ProcessedValue = df_ProcessedValue.rename(columns={'measuring_location': "position"})
                    
                    command_id = -666
                    command_id_arr = np.full(shape=len(df_ProcessedValue), fill_value=command_id, dtype=Integer)
                    unit_id_arr = np.full(shape=len(df_ProcessedValue), fill_value=unit_id, dtype=Integer)
                    processing_time_arr = np.full(shape=len(df_ProcessedValue), fill_value=datetime.datetime.now(), dtype=DateTime)
                    sensor_settling_time_arr = np.full(shape=len(df_ProcessedValue), fill_value=1, dtype=Integer)
            
                    published_arr = np.full(shape=len(df_ProcessedValue), fill_value=0, dtype=Integer)

                    
                    df_ProcessedValue.loc[:,'command_id'] = command_id_arr
                    df_ProcessedValue.loc[:,'unit_id'] = unit_id_arr
                    df_ProcessedValue.loc[:,'processing_time'] = processing_time_arr
                    # df_ProcessedValue.loc[:,'depth'] = depth_arr
                    df_ProcessedValue.loc[:,'pressure'] = pressure_arr
                    df_ProcessedValue.loc[:,'sensor_settling_time'] = sensor_settling_time_arr
                    df_ProcessedValue.loc[:,'published'] = published_arr

                    valid_arr = np.full(shape=len(df_ProcessedValue), fill_value=1, dtype=Integer)
                            
        # =============================================================================
        #             #for checks
        # =============================================================================
                    # print(deployment_id, logger_id)

                    get_parameter_query = 'SELECT parameter FROM SensorType WHERE sensor_type_id = {};'
                    get_parameter = pd.read_sql_query(get_parameter_query.format(sensor_type_id), con = engine)
                    parameter = get_parameter['parameter'][0]
                    print(parameter)
                    
                    check_ids = rules['general']['check_ids']
                    for check_id in check_ids:
                        check_id, passed_all, passed_arr, check_description = execute_check(check_id, df_ProcessedValue, parameter, rules)
                        valid_arr = valid_arr * passed_arr
                                
                    #finish ProcessedValue array preparation
                    df_ProcessedValue['valid'] = valid_arr
                    df_ProcessedValue = df_ProcessedValue[['command_id', 'unit_id', 'measuring_time', 'processing_time', 'value', 'sensor_settling_time', 'position', 'pressure', 'valid', 'published']]

                    # print(df_ProcessedValue)
# =============================================================================
#             #prepare entry for deployment table
# =============================================================================
                    if loop_count == 0:         #only once, the first time. Must happen before data gets written because deployment_id must exist in Deployment table
                        #TODO: are nan values possible for the entries in the deployment dictionary? Would cause an error. Data from the RawValue df does not contain Nans anymore.
                        # print('entry loop count 0 loop')
                        # print(deployment_id, logger_id)
                        # print(json.loads(data.contact))
                        # print(deployment_id, logger_id, json.loads(data.contact)['id'])
                        # print(df_RawValue['measuring_time'].iloc[0], df_RawValue['measuring_time'].iloc[-1])
                        # print(df_RawValue['measuring_location'].iloc[0], df_RawValue['measuring_location'].iloc[-1])
                        try:
                            deployment_data =    {'deployment_id': deployment_id, 'logger_id': logger_id, 'contact_id': json.loads(data.contact)['id'],
                                                  'time_start': df_RawValue['measuring_time'].iloc[0], 'time_end': df_RawValue['measuring_time'].iloc[-1],
                                                  # 'time_start': json.loads(data.deployment)['time_start'], 'time_end': json.loads(data.deployment)['time_end'],
                                                  'position_start': df_RawValue['measuring_location'].iloc[0], 'position_end': df_RawValue['measuring_location'].iloc[-1],
                                                  'bounding_box': ((lat_min, lon_min), (lat_max, lon_min), (lat_max, lon_max), (lat_min, lon_max), (lat_min, lon_min))
                                                  }
                            # print(deployment_data)
                            deployment_keys = ['deployment_id', 'logger_id', 'contact_id', 'time_start', 'time_end', 'position_start', 'position_end', 'bounding_box']
                            vals = []
                            keys = []
                            for key in deployment_keys:
                                if key in deployment_data:
                                    vals.append(deployment_data[key])
                                    keys.append(key)
                            df_to_write = pd.DataFrame(data=vals).T
                            for count, key in enumerate(keys):
                                df_to_write.rename({count: key}, axis = 1, inplace = True)
                        except Exception as msg:
                            noErrors = False
                            print(msg)
                            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                                logfile.write('#####################################################################\n')
                                logfile.write(str(datetime.datetime.now()) + ': ' + 'data writing errors occurred during handling ' + nc_file + ':\n {}'.format(msg) +'\n \n')
                                logfile.write('errors occured in creating the deployment dataframe to write into the Deployment table, no data has been written. \n')

                            #TODO: write log 
                        # print(df_to_write)
        # # =============================================================================
        # #             #write deployment in Deployment table
        # # =============================================================================
                        if noErrors == True:
                            df_to_write.to_sql(
                                'Deployment',
                                engine,
                                if_exists='append',
                                index=False,
                                dtype={
                                "deployment_id": Integer,
                                "logger_id": Integer,
                                "contact_id": Integer,
                                "time_start": DateTime,
                                "time_end": DateTime,
                                "position_start": PointGeometry,
                                "position_end": PointGeometry,
                                "bounding_box": PolygonGeometry
                                }
                                )
                            print('deployment entry written')
                        # print('loop 0 finished')    
                        loop_count += 1

        # # =============================================================================
        # #         #write data
        # # =============================================================================
                    if noErrors == True:
                        try:
                            df_RawValue.to_sql(
                                'RawValue',
                                engine,
                                if_exists='append',
                                index=False,
                                dtype={
                                "deployment_id": Integer,
                                "sensor_id": Integer,
                                "value": Numeric,
                                "measuring_time": DateTime,
                                "measuring_location": PointGeometry
                                }
                                )
                            print('raw value table written')
                            
                        #catches unexpected DataWritingErrors
                        except Exception as msg:
                            noErrors = False
                            print(msg)
                            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                                logfile.write('#####################################################################\n')
                                logfile.write(str(datetime.datetime.now()) + ': ' + 'data writing errors occurred during handling ' + nc_file + ':\n {}'.format(msg) +'\n \n')
                                logfile.write('the corresponding deployment might have been deleted from the Deployment table and only some sensors might have been written to the database. \n')
                                logfile.write('#####################################################################\n \n')
                                
                            #if first time and no raw values have been written before -> also delete deployment from Deployment table    
                            if loop_count == 0:
                                delete_query = 'DELETE FROM Deployment WHERE deployment_id = {} AND logger_id = {};'
                                deletion = pd.read_sql_query(delete_query.format(deployment_id, logger_id), con = engine)
                        
                    # =============================================================================
                    #     write processed values in ProcessedValue       
                    # =============================================================================
                    if noErrors == True:
                        try:
                            df_ProcessedValue.to_sql(
                                'ProcessedValue',
                                engine,
                                if_exists='append',
                                index=False,
                                dtype={
                                "command_id": Integer,
                                "unit_id": Integer,
                                "measuring_time": DateTime,
                                "processing_time": DateTime,
                                "value": Numeric,
                                "sensor_settling_time": Integer,
                                "position": PointGeometry,
                                "pressure": Numeric,
                                "valid": Integer,
                                "published": Integer
                                }
                                )
                            print('processed value table written')
                        #catches unexpected DataWritingErrors
                        except Exception as msg:
                            noErrors = False
                            print(msg)
                            with open('Data/logs/' + str(datetime.date.today()) + '.txt', 'a') as logfile:
                                logfile.write('#####################################################################\n')
                                logfile.write(str(datetime.datetime.now()) + ': ' + 'data writing errors occurred during writing processed values. Raw values might/should have been written, better check. Error msg' + ':\n {}'.format(msg) +'\n \n')
                                logfile.write('#####################################################################\n \n')
            
            # =============================================================================
            #     #get highest processed_value_id and the last corresponding entries for raw_value connection
            # =============================================================================
                        get_max_processed_value_id_query = 'SELECT MAX(processed_value_id) FROM ProcessedValue;'
                        get_max_processed_value_id = pd.read_sql_query(get_max_processed_value_id_query, con = engine)
                        max_processed_value_id = get_max_processed_value_id['MAX(processed_value_id)'][0]
                        processed_value_id_arr = np.arange(max_processed_value_id, max_processed_value_id - len(df_ProcessedValue), -1)
                        processed_value_id_arr = np.flip(processed_value_id_arr)
                        
                        df_ProcessedValueHasRawValue = df_RawValue[['raw_value_id', 'deployment_id', 'logger_id', 'sensor_id']].copy()
                        df_ProcessedValueHasRawValue['processed_value_id'] = processed_value_id_arr
                        df_ProcessedValueHasRawValue = df_ProcessedValueHasRawValue[['processed_value_id', 'raw_value_id', 'deployment_id', 'logger_id', 'sensor_id']]
                        #for testing deletion process:
                        df_ProcessedValueHasRawValue = df_ProcessedValueHasRawValue[['processed_value_id', 'deployment_id', 'logger_id', 'sensor_id']]

            
                        # =============================================================================
                        #                     #execute checks again and prepare CheckAtProcessedValue
                        # =============================================================================
                        
                        #TODO:  write try block and handle potential errors. Maybe move this to another place to finish ProcessedValue 
                        #       and ProcessedValueHasRawValue connection entries first?
                        
                        for check_id in check_ids:
                            check_id, passed_all, passed_arr, check_description = execute_check(check_id, df_ProcessedValue, parameter, rules)
                            
                            check_id_arr = np.full(shape=len(df_ProcessedValue), fill_value=check_id, dtype=Integer)
                            check_description_arr = np.full(shape=len(df_ProcessedValue), fill_value=check_description, dtype=object)    
                    
                            df_CheckAtProcessedValue = df_ProcessedValueHasRawValue[['processed_value_id']].copy()
            
                            time_arr = np.full(shape=len(df_ProcessedValue), fill_value=datetime.datetime.now(), dtype=DateTime)
                            df_CheckAtProcessedValue['check_id'] = check_id_arr
                            df_CheckAtProcessedValue['time'] = time_arr
                            df_CheckAtProcessedValue['passed'] = passed_arr.astype(str)    #enum takes string as input
                            df_CheckAtProcessedValue['description'] = check_description_arr
                            df_CheckAtProcessedValue = df_CheckAtProcessedValue[['check_id', 'processed_value_id', 'time', 'passed', 'description']]
                            #for testing deletion process:
                            # df_CheckAtProcessedValue = df_CheckAtProcessedValue[['check_id', 'processed_value_id', 'passed', 'description']]

                            
                        # # =============================================================================
                        # #                         #write CheckAtProcessedValue
                        # # =============================================================================
                            if noErrors == True:
                                try:
                                    df_CheckAtProcessedValue.to_sql(
                                        'CheckAtProcessedValue',
                                        engine,
                                        if_exists='append',
                                        index=False,
                                        dtype={
                                        "check_id": Integer,
                                        "processed_value_id": Integer,
                                        "time": DateTime,
                                        "passed": Enum,
                                        "description": Text
                                        }
                                        )
                                    print('CheckAtProcessedValue table written')
                                #catches unexpected DataWritingErrors and tries to delete the previously written ProcessedValue data
                                except Exception as msg:
                                    noErrors = False
                                    print(msg)
                                    error_msg = 'data writing errors occurred during writing CheckAtProcessedValue.\n Please delete or adjust the already written processed values manually, or check them again manually. ProcessedValueHasRawValue was not written and has to be adjusted as well. Errors occured for deployment ' + str(deployment_id) + ' from logger ' + str(logger_id) + ' with processed_value_ids: ' + str(processed_value_id_arr[0]) + ' to ' + str(processed_value_id_arr[-1]) + ':\n{}'.format(msg)
                                    write_log_error_msg(path_logs, error_msg)
                                    delete_query = text("DELETE FROM ProcessedValue WHERE processed_value_id BETWEEN '{}' AND '{}';".format(processed_value_id_arr[0], processed_value_id_arr[-1]))
                                    try:
                                        with engine.connect() as con:
                                            con.execute(delete_query)
                                            con.commit()
                                        success_msg = 'automatical deletion from ProcessedValue apparently succeeded. Nevertheless check manually!'
                                        write_log_regular_msg(path_logs, success_msg)
                                    except Exception as msg_delete:
                                        error_msg = 'automatical deletion from ProcessedValue failed. Error msg' + ':\n{}'.format(msg_delete)
                                        write_log_error_msg(path_logs, error_msg)
                                            
                        if noErrors == True:
                            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                                logfile.write(str(datetime.datetime.now()) + ':\t' + 'deployment ' + str(deployment_id) + ' from logger ' + str(logger_id) + ' with sensor ' + str(sensor_id) + ' was successfully checked and entries made in CheckAtProcessedValue.\n')

               
                # # =============================================================================
                # #                         #write ProcessedValueHasRawValue
                # # =============================================================================
                        if noErrors == True:
                            try:
                                df_ProcessedValueHasRawValue.to_sql(
                                    'ProcessedValueHasRawValue',
                                    engine,
                                    if_exists='append',
                                    index=False,
                                    dtype={
                                    "processed_value_id": Integer,
                                    "raw_value_id": Integer,
                                    "deployment_id": Integer,
                                    "logger_id": Integer,
                                    "sensor_id": Integer
                                    }
                                    )
                                print('ProcessedValueHasRawValue table written')
                                
                            #catches unexpected DataWritingErrors and tries to delete the previously written CheckAtProcessedValue and ProcessedValue data
                            except Exception as msg:
                                noErrors = False
                                print(msg)
                                error_msg = 'data writing errors occurred during writing ProcessedValueHasRawValue.\n Please delete or adjust the already written ProcessedValue and CheckAtProcessedValue manually. Errors occured for deployment ' + str(deployment_id) + ' from logger ' + str(logger_id) + ' with processed_value_ids: ' + str(processed_value_id_arr[0]) + ' to ' + str(processed_value_id_arr[-1]) + ':\n {}'.format(msg)
                                write_log_error_msg(path_logs, error_msg)   
                                
                                delete_query = text("DELETE FROM CheckAtProcessedValue WHERE processed_value_id BETWEEN '{}' AND '{}';".format(processed_value_id_arr[0], processed_value_id_arr[-1]))
                                try:
                                    with engine.connect() as con:
                                        con.execute(delete_query)
                                        con.commit()
                                    success_msg = 'automatical deletion from CheckAtProcessedValue apparently succeeded. Nevertheless check manually!'
                                    write_log_regular_msg(path_logs, success_msg)
                                except Exception as msg_delete:
                                    error_msg = 'automatical deletion from CheckAtProcessedValue failed. Error msg' + ':\n{}'.format(msg_delete)
                                    write_log_error_msg(path_logs, error_msg)
                                
                                
                                delete_query = text("DELETE FROM ProcessedValue WHERE processed_value_id BETWEEN '{}' AND '{}';".format(processed_value_id_arr[0], processed_value_id_arr[-1]))
                                try:
                                    with engine.connect() as con:
                                        con.execute(delete_query)
                                        con.commit()
                                    success_msg = 'automatical deletion from ProcessedValue apparently succeeded. Nevertheless check manually!'
                                    write_log_regular_msg(path_logs, success_msg)
                                except Exception as msg_delete:
                                    error_msg = 'automatical deletion from ProcessedValue failed. Error msg' + ':\n{}'.format(msg_delete)
                                    write_log_error_msg(path_logs, error_msg)
        
                
                #this try-except block is no error for the log, but just handling all the non-sensor-columns without a sensor id.
                except KeyError:
                    pass
        # =============================================================================
        #                     #copy nc file after successfull processing and delete old one
        # =============================================================================
        if noErrors == True:  
            shutil.copy2(path_to_write + nc_file, path_written + nc_file)
            data.close()
            os.remove(path_to_write + nc_file)
            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                logfile.write(str(datetime.datetime.now()) + ':\t' + nc_file + ' was successfully written to database.\n \n \n')
        else:
            shutil.copy2(path_to_write + nc_file, path_problematic + nc_file)
            data.close()
            os.remove(path_to_write + nc_file)

            with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
                logfile.write(str(datetime.datetime.now()) + '\t:' + 'errors occurred during handling ' + nc_file + ' and the file was not written in the database.\n \n \n')
     
# =============================================================================
#     for whole deployment dummy: write processed values in ProcessedValue and connect with RawValue via ProcessedValueHasRawValue:        
# =============================================================================
        # process_deployment_from_logger(deployment_id, logger_id, engine, path_logs)
        #TODO: include calculation rule with calibration coefficients etc?
        
    #catch all other exceptions; write in Erros table in database and print to logfile; if error occurs before accessing nc-file, e.g. if wrong datatype, deployment_id and logger_id are set to -9999
    except Exception as msg:
        with open(path_logs + str(datetime.date.today()) + '.txt', 'a') as logfile:
            logfile.write('#####################################################################\n')
            logfile.write(str(datetime.datetime.now()) + ': ' + 'console errors occurred during handling ' + nc_file + ':\n {}'.format(msg) +'\n \n \n')
            logfile.write('#####################################################################\n \n')
            #test:
            msg_db = 'error while handling ' + nc_file + ': ' + str(msg)
            if 'deployment_id' in locals() and 'logger_id' in locals():
                df_Errors = pd.DataFrame({'deployment_id': [deployment_id], 'logger_id': [logger_id], 'time': [datetime.datetime.now()], 'description': [msg_db], 'solved': [0]})
            else:
                deployment_id = -9999
                logger_id = -9999
                df_Errors = pd.DataFrame({'deployment_id': [deployment_id], 'logger_id': [logger_id], 'time': [datetime.datetime.now()], 'description': [msg_db], 'solved': [0]})

            print(df_Errors)
            df_Errors.to_sql(
                'Errors',
                engine,
                if_exists='append',
                index=False,
                dtype={
                "deployment_id": Integer,
                "logger_id": Integer,
                "time": DateTime,
                "description": Text,
                "solved": Integer
                }
                )
        print(msg)