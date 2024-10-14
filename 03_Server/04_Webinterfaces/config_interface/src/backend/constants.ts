import { LoggerConfigDataKey } from "./types";

export const int_8: string[] = ["sample_cast_periode", "sample_periode_multiplier", "sample_cast_periode_multiplier"]; //>= 0 -255
export const int_16: string[] = [
  "sample_periode",
  "cast_det_sensor",
  "wet_det_sensor",
  "wet_det_periode",
  "dry_det_sensor",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
]; //>=0 - 65535
export const int_32: string[] = ["config_update_periode", "status_upload_periode"]; //>= 0

export const integers = int_8.concat(int_16).concat(int_32);

//constant for number properties required for validation
export const numbers: string[] = [
  "logger_id",
  "sensor_id",
  "device_id",
  "platform_id",
  "length",
  "deck_unit_id",
  "sensor_type_id",
  "unit_id",
  "time_constant",
  "digits_raw_value",
  "no_of_calibration_coefficients",
  "digits_calibration_coefficients",
  "parameter_no",
  "accuracy",
  "resolution",
  "coefficient_id_per_sensor_id",
  "value",
  "contact_id",
  "deck_unit_id",
  "sample_cast_enable",
  "cast_det_sensor_threshold",
  "wet_det_threshold",
  "bus_address",
];

//constant for date properties required for validation
export const dates: string[] = ["time_start", "time_end", "time_calibration", "date_manufactoring"];

export const booleans: string[] = ["sample_cast_enable"];

//constant for required sensor properties
export const requiredSensor: string[] = [
  "serial_number",
  "sensor_type_id",
  "date_manufactoring",
  "sample_periode_multiplier",
  "sample_cast_periode_multiplier",
];

//constant for required logger properties
export const requiredLogger: string[] = [
  "date_manufactoring",
  "manufacturer",
  "operation_mode",
  "contact_name",
  "config_update_periode",
  "status_upload_periode",
  "sample_periode",
  "sample_cast_enable",
  "sample_cast_periode",
  "cast_det_sensor",
  "cast_det_sensor_threshold",
  "wet_det_sensor",
  "sample_periode_multiplier",
  "dry_det_sensor",
  "dry_det_threshold",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
  "wet_det_periode",
  "wet_det_threshold",
  "Comment",
];

//constant for properties with highlight
export const highlightParameter = {
  battery_remaining: { min: 20 },
  memory_capacity_used_percent: { max: 80 },
  memory_capacity_remaining: { min: 20 },
};

//constants for db generated values
export const loggerGenerated: string[] = ["logger_id", "time_start", "device_id"];
export const sensorGenerated: string[] = ["sensor_id", "time_start", "device_id"];

//constant for logger table titles
export const loggerPropertyTitles: { [key: string]: string } = {
  logger_id: "Logger ID",
  operation_mode: "Operation mode",
  fw_version: "Firmware version",
  num_sensors: "Number of sensors",
  deck_unit_id: "Deckunit ID",
  platform_id: "Platform ID",
  vessel_id: "Vessel ID",
  name: "Vessel name",
  contact_id: "Deployment contact ID",
  contact_name: "Contact name",
  battery_remaining: "Battery Remaining",
  memory_capacity_total: "Memory Capacity Total",
  date: "Date status data",
  lng: "Longitude",
  lat: "Latitude",
  memory_capacity_used: "Memory Capacity Used",
  memory_capacity_remaining: "Memory Capacity Remaining",
  manufacturer: "Manufacturer",
  config_update_periode: "Config update periode",
  status_upload_periode: "Status upload periode",
  sample_periode: "Sample periode",
  sample_cast_enable: "Sample cast enable",
  sample_cast_periode: "Sample cast periode",
  cast_det_sensor: "Cast detection sensor",
  cast_det_sensor_threshold: "Cast detection sensor threshold",
  wet_det_sensor: "Wet detection sensor",
  wet_det_periode: "Wet detection periode",
  wet_det_threshold: "Wet detection threshold",
  ssid: "SSID",
  pw: "Password",
  Comment: "Comment",
  dry_det_sensor: "Dry detection sensor",
  dry_det_threshold: "Dry detection threshold",
  dry_det_verify_delay: "Dry detection verify delay",
  data_upload_retry_periode: "Data upload retry periode",
};

//constant for sensor table titles
export const sensorPropertyTitles: { [key: string]: string } = {
  sensor_id: "Sensor ID",
  sample_periode_multiplier: "Sample periode multiplier",
  sample_cast_periode_multiplier: "Sample cast periode multiplier",
  bus_address: "Bus address",
  calib_coeff: "Calibration coefficients ",
  sensor_type_id: "Sensor type ID",
  parameter: "Parameter",
  long_name: "Long name ",
  unit: "Unit",
  manufacturer: "Manufacturer",
  model: "Model",
  serial_number: "Serial number",
  parameter_no: "Parameter no (if sensor measures several parameters)",
  accuracy: "Accurancy",
  resolution: "Resolution",
  date_manufactoring: "Date Manufacturing",
  logger_id: "Logger ID",
  coefficient_value: "Coefficient value",
  no_of_calibration_coefficients: "No of calibration coefficients",
  unit_id: "Unit ID",
  digits_calibration_coefficients: "Digits calibration coefficients",
};

//constant dependant properties
export const dependendKeys: { [key: string]: string } = {
  platform_id: "name",
  unit: "unit_id",
  unit_id: "sensor_type_id",
  manufacturer: "sensor_type_id",
  parameter: "sensor_type_id",
  model: "sensor_type_id",
  parameter_no: "sensor_type_id",
  accuracy: "sensor_type_id",
  resolution: "sensor_type_id",
  long_name: "sensor_type_id",
};

//constant css
export const tableStyleClass: string =
  "flex flex-row flex-initial basis-1/2 text-center items-center justify-center border-r border-t ";

//constant for error texts
export const errorText: { [key: string]: string } = {
  id: "input is not a valid id - ",
  required: "field is required",
  integer: "wrong input type - expected integer but get decimal",
  bool: "accept boolean 1 and 0",
  type: "input type",
  number: "wrong input type - expected number",
  date: "input is not a valid date",
  suggestion: "input doesn't match existing entry",
  max_digits: "reached max amount of decimal digits",
  max_length: "reached max amount of chars",
  int16: "expected integer <= 65535",
  int8: "expected integer <= 255",
  positive_int: "expected integer >= 0",
};

// default selection value
export const DEFAULT_SELECT_VALUE = -1;

export const sensorHeader: { [key: string]: string }[] = [
  { sensor_id: "Assigned Sensor" },
  { parameter: "Parameter" },
  { model: "Sensor Type" },
  { manufacturer: "Manufacturer" },
  { bus_address: "Bus Address" },
];

//collection of db properties for the sensor table
export const sensorKeysForDB: string[] = [
  "logger_id",
  "sensor_id",
  "date_manufactoring",
  "bus_address",
  "sensor_type_id",
  "manufacturer",
  "model",
  "parameter",
  "parameter_no",
  "resolution",
  "long_name",
  "accurancy",
  "unit",
  "serial_number",
];

//collection of database properties for the sensor table when inserting a new sensor
export const sensorKeysForDBNew: string[] = [
  "logger_id",
  "date_manufactoring",
  "bus_address",
  "sensor_type_id",
  "manufacturer",
  "model",
  "parameter",
  "parameter_no",
  "resolution",
  "long_name",
  "accurancy",
  "unit",
  "serial_number",
];
//collection of config properties for the sensor table
export const sensorKeysForConfig: string[] = ["sample_periode_multiplier", "sample_cast_periode_multiplier"];

//collection of sensor properties allowed for editing
export const senorKeysForEdit: string[] = [
  "logger_id",
  "bus_address",
  "sample_periode_multiplier",
  "sample_cast_periode_multiplier",
];

//collection of config properties for the sensor table when inserting a new sensor
export const sensorKeysForNew: string[] = [
  "logger_id",
  "sensor_type_id",
  "sample_periode_multiplier",
  "sample_cast_periode_multiplier",
  "serial_number",
  "date_manufactoring",
];

//collection of db properties for the logger table
export const loggerKeysForDB: string[] = [
  "logger_id",
  "operation_mode",
  "fw_version",
  "Comment",
  "manufacturer",
  "deck_unit_id",
  "name",
  "num_sensors",
];

//collection of config properties for the logger table
export const loggerKeysForConfig: string[] = [
  "contact_name",
  "config_update_periode",
  "status_upload_periode",
  "sample_periode",
  "sample_cast_enable",
  "sample_cast_periode",
  "cast_det_sensor",
  "cast_det_sensor_threshold",
  "wet_det_sensor",
  "wet_det_periode",
  "wet_det_threshold",
  "dry_det_sensor",
  "dry_det_threshold",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
];
//collection of logger properties allowed for editing
export const loggerKeysForEdit: string[] = [
  "operation_mode",
  "deck_unit_id",
  "fw_version",
  "Comment",
  "name",
  "contact_name",
  "config_update_periode",
  "status_upload_periode",
  "sample_periode",
  "sample_cast_enable",
  "sample_cast_periode",
  "cast_det_sensor",
  "cast_det_sensor_threshold",
  "wet_det_sensor",
  "wet_det_periode",
  "wet_det_threshold",
  "dry_det_sensor",
  "dry_det_threshold",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
];

//collection of config properties for the logger table when inserting a new sensor
export const loggerKeysForNew: string[] = [
  "manufacturer",
  "operation_mode",
  "deck_unit_id",
  "fw_version",
  "Comment",
  "name",
  "contact_name",
  "config_update_periode",
  "status_upload_periode",
  "sample_periode",
  "sample_cast_enable",
  "sample_cast_periode",
  "cast_det_sensor",
  "cast_det_sensor_threshold",
  "wet_det_sensor",
  "wet_det_periode",
  "wet_det_threshold",
  "dry_det_sensor",
  "dry_det_threshold",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
];

//collection of status properties for status table
export const statusKeys: string[] = [
  "battery_remaining",
  "memory_capacity_total",
  "memory_capacity_used",
  "memory_capacity_remaining",
  "lng",
  "lat",
  "date",
];

//collection of config properties for the logger table
export const loggerConfigTableKeys = [
  "logger_id",
  "config_update_periode",
  "status_upload_periode",
  "sample_periode",
  "sample_cast_enable",
  "sample_cast_periode",
  "cast_det_sensor",
  "cast_det_sensor_threshold",
  "wet_det_sensor",
  "wet_det_periode",
  "wet_det_threshold",
  "contact_first_name",
  "contact_last_name",
  "dry_det_sensor",
  "dry_det_threshold",
  "dry_det_verify_delay",
  "data_upload_retry_periode",
  "wifi",
];

//collection of config properties for the sensor table
export const sensorConfigTableKeys = [
  "logger_id",
  "sensor_id",
  "sample_periode_multiplier",
  "sample_cast_periode_multiplier",
];

//empty logger config object
export const emptyLoggerConfigObj = {
  config_update_periode: null,
  status_upload_periode: null,
  sample_periode: null,
  sample_cast_enable: null,
  sample_cast_periode: null,
  cast_det_sensor: null,
  cast_det_sensor_threshold: null,
  wet_det_sensor: null,
  wet_det_periode: null,
  wet_det_threshold: null,
  dry_det_sensor: null,
  dry_det_threshold: null,
  dry_det_verify_delay: null,
  data_upload_retry_periode: null,
  contact_name: null,
  wifi: null,
};

//empty sensor config object
export const emptySensorConfigObj = {
  sample_periode_multiplier: null,
  sample_cast_periode_multiplier: null,
};

//empty config object
export const emptyConfigObj = {
  logger_id: null,
  contact_name: null,
  operation_mode: null,
  fw_version: null,
  num_sensors: null,
  wifi: [],
  config_update_periode: null,
  status_upload_periode: null,
  sample_periode: null,
  sample_cast_enable: null,
  sample_cast_periode: null,
  cast_det_sensor: null,
  cast_det_sensor_threshold: null,
  wet_det_sensor: null,
  wet_det_periode: null,
  wet_det_threshold: null,

  deckunit_id: null,
  platform_id: null,
  vessel_id: null,
  vessel_name: null,
  deployment_contact_id: null,
  contact_first_name: null,
  contact_last_name: null,

  sensors: [],
};

export const maxWifiEntries = 5;
export const loggerHeader: { [key: string]: string }[] = [
  { logger_id: "Logger ID" },
  { operation_mode: "Logger operating mode" },
  { name: "Assigned Vessel" },
  { deck_unit_id: "Assigned Deckbox ID" },
  { battery_remaining: "Battery remaining" },
  { memory_capacity_remaining: "Memory remaining" },
  { date: "Last status update" },
];

//collection of config and db properties for overview logger table
export const loggerKeys: LoggerConfigDataKey[] = [
  "logger_id",
  "operation_mode",
  "name",
  "deck_unit_id",
  "battery_remaining",
  "memory_capacity_remaining",
  "date",
];
