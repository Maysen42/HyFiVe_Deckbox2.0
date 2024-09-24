# HyFiVe Server - Data handling and Quality Checks with Python Scripts

To ensure the scalability of the system, we aimed for automated quality control of the measured data. This is already done by several institutions and many checks are possible for hydrographic data, e.g.: 
- Impossible position: Is the measurement position in a sea area or on land?
- Impossible depth: Is the depth above sea level or lower than the sea floor?
- False timestamp, e.g. 01.01.1970 (unix 0)?

We implemented a python script, which:
- reads in new files in mailbox/in/netcdf
- does some quality checks (until 09.2024 we only implemented a few)
- logs the results
- writes the measuring data into the database
- moves file to backup or error folder

## Measured data

Measured data arrives on the server in .nc files. For processing it there is a ```netcdf_handling``` folder in the main directory of the user structured as:
```
netcdf_handling/
	backup_files/
	files_with_problems/
	logs/
		yyyy-mm-dd.txt
	python_scripts/
		checks_list.py 
		classes_writeToDB.py
		functions_writeToDB.py
		main_writeToDB.py
		processing_rules.pkl
		
```

All of the above mentioned scripts are located in the subfolder Python/ of this readme. Incoming data is processed by ```main_writeToDB.py``` which is called by the cronjob every 15 minutes
```*/15 * * * * python3 /home/hyfiveuser/netcdf_handling/python_scripts/main_writeToDB.py > /dev/null 2>&1```

main_writeToDB.py uses functions_writeToDB.py, classes_writeToDB.py (for locations; points/polygons), checks_list.py for check specifications, processing_rules.pkl for parameter specific validity criteria.

An overview of the routine run by the script is given below.

<figure> 
   <img src="../media/flowchart_overview_routine.png"  title="Flowchart">

   <figurecaption><a name="figure1">*Figure 1:*</a> *Flowchart*</figurecaption>
</figure>

Notes for processed/raw values by the Python script:
1. **ADC value or any value that must be processed with calibration coefficients:** The value is stored in RawValue and the corresponding calibration coefficients form table CalibrationCoefficient in combination with
the calculation_rule in SensorType are used to calculate the processed value for table ProcessedValue in the next step. This makes it possible to trace the processed value back to the sensors reading (used for the 
TSYS01 by BlueRobotics). The calculation rule must be given in the form of ```f0 * c0 * val ** p0 + ... + fn * cn * val ** pn``` with fx being factors, cx being calibration coefficients and px being the power. The 
preparation of the calculation is done in the function ```get_sensor_caluclation(sensor_id, engine, time_end_deployment)```. For a smooth way of this function to run insert the fx and px to the SensorType as follows:
'[f0, f1, ..., fn], [p0, p1, ..., pn]'
2. **Pre-processed value**: Some sensors do not give a raw value with calibration coefficients and a calculation rule to handle the raw value. In this case the reading of the value from the sensor is as raw as it gets.
Therefore the value is stored in RawValue and Processed value without any math inbetween. Of course there is always the option of calibration the sensor in a lab and think of an own calculation rule to process the
read out value as raw value.

To distinguish the two above mentioned cases, the script checks for the existence of a dataframe column named "parameter_raw", e.g. "temperature_raw" in addition to the "temperature" column. If the "parameter_raw" column exists, it contains the ADC value from case 1. Else the values in "parameter" will be used and case 2 applies.

- checks if time input is an iso-string (happened a couple of times in the first nc files), then uses parser to convert this string to a datetime.datetime object. This will be obsolete in the future hopefully.
- checks if dataframe is empty.

- checks for out of range values (from the point of possible database entries, -1e12 < x <= 1e13) and sets those values to -9999.
- executes data validity checks (criteria from processing_rules.pkl), to be able to write the "valid" column of the ProcessedValue table later as whole dataframe (more time efficient than updating every single ProcessedValue entry made one by one) 
- formats entries for deployment table and writes deployment table; 
- writes raw value data; deletes deployment entries, if error occurs while writing rawvalue table for the first sensor;
- prepares and writes processed values in ProcessedValues table
- executes validity checks again, prepares and writes corresponding executed checks in CheckAtProcessedValue table
- prepares and writes ProcessedValueHasRawValue table for connection of processed and raw values.

- if successfully written in db, copies nc file to backup folder and deletes old one.
- if problems occurred while writing, the nc file gets copied to files_with_problems folder and the old file is deleted.

if some unexpected error occured, the console error message is written in the log file.

## checks_list.py and adding a check

checks_list.py contains all validity checks in the main function execute_check(). So far this is a check for outliers and a check for realistic dates (data before 1970 does not pass the test). The validity criteria come from processing_rules.pkl, a pickled file that is created and modified by processing_rules.py. More checks can be implemented by adding another elif loop in checks_list.py/execute_check() with a check_id. This check_id has also to be added in the database in the hyfiveDB.Check table. To execute the check, the check_id has to be added to the check_ids in the processing_rules.pkl, in the dictionary ['general']['check_ids'], where the main script gets the ids from.
