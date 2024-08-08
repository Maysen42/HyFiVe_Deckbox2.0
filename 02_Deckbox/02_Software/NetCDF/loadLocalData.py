'''
 * SPDX-FileCopyrightText: (C) 2024 Mathis Bjoerner, Leibniz Institute for Baltic Sea Research Warnemuende
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * Project: Hydrography on Fishing Vessels
 * Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 *
 * Description: Additional functions to get data from the InfluxDB. Most functions are designed to det data from the last day
'''

import pandas as pd
from influxdb_client import InfluxDBClient

"""
    Functions to assist in creating the .nc files on the Pi
"""


def get_local_loggerId(influx_url, token):
    """
    :param influx_url: URL of the InfluxDB
    :param token: token for the DB
    :return: dataframe of all loggers storing data in the last day
    """
    client =InfluxDBClient(url=influx_url, token=token, org='hyfive')
    query_api = client.query_api()

    # the API is designed for Influx 2.0, easy querys would be by having different DBs for information on Calibration...
    bucket = 'localhyfive'                       # the database
    query = f'from(bucket: \"{bucket}\") \
              |> range(start: -15d)  \
              |> filter(fn: (r) => r["_measurement"] == "netcdf")\
              |> keyValues(keyColumns: ["logger_id"])\
              |> group()\
              |> pivot(rowKey: ["_value"], columnKey: ["_key"], valueColumn: "_value")'
    tables = query_api.query_data_frame(query)
    if tables.empty:
        return pd.DataFrame()
    return tables.drop(columns=['result', 'table'])


def get_local_dataframe(influx_url, token, logger_id):
    """
    :param influx_url: influx_url: URL of the InfluxDB
    :param token: token for the DB
    :param logger_id: specific logger
    :return: data of the last day of this logger
    """
    client =InfluxDBClient(url=influx_url, token=token, org='hyfive')
    query_api = client.query_api()

    # the API is designed for Influx 2.0, easy querys would be by having different DBs for information on Calibration...
    bucket = 'localhyfive'                       # the database
    query = f'from(bucket: \"{bucket}\") \
              |> range(start: -15d)  \
              |> filter(fn: (r) => r["_measurement"] == "netcdf")\
              |> filter(fn: (r) => r["logger_id"] == "' + logger_id + '")\
              |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")'
    tables = query_api.query_data_frame(query)
    # print(query)
    if tables.empty:
        return pd.DataFrame()
    return tables.drop(columns=['result', 'table', '_start', '_stop', '_measurement'])


def get_local_parameters(influx_url, token, logger_id, deployment_id):
    """
    :param influx_url: URL of the InfluxDB
    :param token: token for the DB
    :param logger_id: specific logger
    :param deployment_id: specific deployment
    :return: list of parameters measured
    """
    client = InfluxDBClient(url=influx_url,
                            token=token,
                            org='hyfive')
    query_api = client.query_api()

    # the API is designed for Influx 2.0, easy querys would be by having different DBs for information on Calibration...
    bucket = 'localhyfive'  # the database
    query = f'from(bucket: \"{bucket}\") \
                  |> range(start: -30d)  \
                  |> filter(fn: (r) => r["_measurement"] == "attributes")\
                  |> filter(fn: (r) => r["logger_id"] == "' + logger_id + '")\
                  |> filter(fn: (r) => r["deployment_id"] == "' + deployment_id + '")\
                  |> filter(fn: (r) => r["_field"] == "sensor_id")\
                  |> unique()\
                  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")'
    tables = query_api.query_data_frame(query)
    return tables.drop(columns=['table', '_start', '_stop', '_measurement'])


def get_local_header(influx_url, token, device_id, deployment_id, parameter):
    """
    :param influx_url: URL of the InfluxDB
    :param token: token for the DB
    :param device_id: specific logger
    :param deployment_id: specific deployment
    :param parameter: specific parameter
    :return: all information on this parameter
    """
    client =InfluxDBClient(url=influx_url, token=token, org='hyfive')
    query_api = client.query_api()

    # print("Header, Logger: " + str(device_id))
    # print("Header, Parameter: " + parameter)
    # the API is designed for Influx 2.0, easy querys would be by having different DBs for information on Calibration...
    bucket = 'localhyfive'                       # the database
    query = f'from(bucket: \"{bucket}\") \
              |> range(start: 2019-08-28T22:00:00Z) \
              |> last() \
              |> filter(fn: (r) => r["_measurement"] == "attributes")\
              |> filter(fn: (r) => r["logger_id"] == "' + device_id + '")\
              |> filter(fn: (r) => r["deployment_id"] == "' + deployment_id + '")\
              |> filter(fn: (r) => r["parameter"] == "' + parameter + '" )\
              |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")'
    tables = query_api.query_data_frame(query)
    if tables.empty:
        return pd.DataFrame()

    return tables.drop(columns=['result', 'table', '_start', '_stop', '_measurement'])

