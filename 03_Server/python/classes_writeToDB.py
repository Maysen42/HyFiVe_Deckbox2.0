'''
   SPDX-FileCopyrightText: (C) 2024 Oliver Thiele, Leibniz Institute for Baltic Sea Research Warnemuende
 
   SPDX-License-Identifier: MPL-2.0
 
   Project: Hydrography on Fishing Vessels
   Project URL: <https://github.com/HyFiVeUser/HyFiVe>, <https://hyfive.info>
 
   Description:
 '''

import numpy as np
# import xarray as xr
import sqlalchemy
from sqlalchemy import func

# custom sqlalchemy usertype to convert wkt-column to geometry type
# from https://gist.github.com/kwatch/02b1a5a8899b67df2623
# TODO: understand this
class PointGeometry(sqlalchemy.types.UserDefinedType):

    def get_col_spec(self):
        return "GEOMETRY"

    def bind_expression(self, bindvalue):
        return func.ST_GeomFromText(bindvalue, type_=self)

    def column_expression(self, col):
        return func.ST_AsText(col, type_=self)

    def bind_processor(self, dialect):
        def process(value):
            if value is None:
                return None
            assert isinstance(value, tuple)
            lat, lng = value
            return "POINT(%s %s)" % (lng, lat)
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value is None:
                return None
            #m = re.match(r'^POINT\((\S+) (\S+)\)$', value)
            #lng, lat = m.groups()
            lng, lat = value[6:-1].split()  # 'POINT(135.00 35.00)' => ('135.00', '35.00')
            return (float(lat), float(lng))
        return process

class PolygonGeometry(sqlalchemy.types.UserDefinedType):

    def get_col_spec(self):
        return "GEOMETRY"

    def bind_expression(self, bindvalue):
        return func.ST_GeomFromText(bindvalue, type_=self)

    def column_expression(self, col):
        return func.ST_AsText(col, type_=self)

    def bind_processor(self, dialect):
        def process(value):
            if value is None:
                return None
            assert all(isinstance(item, tuple) for item in value)
            lats = np.zeros(len(value))
            lngs = lats.copy()
            
            for count, item in enumerate(value):
                lat, lng = item
                lats[count] = lat
                lngs[count] = lng
            # print(lats)
            return "POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))" % (lngs[0], lats[0], lngs[1], lats[1], lngs[2], lats[2], lngs[3], lats[3], lngs[4], lats[4])
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value is None:
                return None
            #m = re.match(r'^POINT\((\S+) (\S+)\)$', value)
            #lng, lat = m.groups()
            lng, lat = value[6:-1].split()  # 'POINT(135.00 35.00)' => ('135.00', '35.00')
            return (float(lat), float(lng))
        return process