import { FieldValues } from "react-hook-form";
import {
  HoverInfo,
  LoggerConfigData,
  LoggerConfigFileData,
  LoggerDBTableData,
  LoggerTableData,
  SensorDBTableData,
  SensorTableData,
  Status,
  Wifi,
  isLogger,
  isSensor,
} from "../backend/types";
import {
  dates,
  requiredLogger,
  requiredSensor,
  loggerGenerated,
  sensorGenerated,
  booleans,
  highlightParameter,
  int_8,
  int_32,
  integers,
  numbers,
  int_16,
} from "../backend/constants";
import DataStore from "../stores/dataStore";
import { CalibrationCoefficient, SensorType, Unit, Vessel } from "../backend/entities";
import { HighlightParameterkey } from "./components/Table";
import { CombinedLoggerData } from "../backend/services/database/LoggerService";
import { Tables } from "../backend/enums";

/**
 * function to get date string from file name with pattern logger_id_filetype_dateasnumber.json
 * @param {string} dir - filename
 * @returns {number} - date as number
 */
export const getDateFromFileName = (dir: string) => {
  const fileNameSplitArray = dir.split("_");
  const fileName = fileNameSplitArray[fileNameSplitArray.length - 1];
  const date = fileName.split(".")[0];
  return Number(date);
};

/**
 * function to get data from datastore for specific keys
 * we need the data for dropdowns/our select component and their specific information
 * @param {string} key - property key
 * @param {DataStore} dataStore - our dataStore
 * @returns {Array} - array with specific type and data
 */
export const getCompareData = (key: string, dataStore: DataStore) => {
  switch (key) {
    case "logger_id":
      return dataStore.loggerData;
    case "sensor_type_id":
      return dataStore.sensorTypeData;
    case "sensor_id":
      return dataStore.sensorData;
    case "deck_unit_id":
      return dataStore.deckBoxData;
    case "name":
      return dataStore.vesselData;
    case "contact_name":
      return dataStore.contactData;
    default:
      return [];
  }
};

/**
 * function to get data from datastore for specific keys
 * we need the data for dropdowns/our select component
 * we have some propertyies depending on a selection like sensor type id
 * @param {string} key - property key
 * @param {DataStore} dataStore - our dataStore
 * @returns {Array} - array with specific type and data
 */
export const getSuggestionData = (key: string, dataStore: DataStore) => {
  switch (key) {
    case "parameter":
    case "manufacturer":
    case "model":
    case "parameter_no":
    case "resolution":
    case "accuracy":
    case "long_name":
    case "unit_id":
      return dataStore.sensorTypeData;
    case "contact_name":
      return dataStore.contactData;
    case "name":
      return dataStore.vesselData;
    case "unit":
      return dataStore.unitData;
    default:
      return [];
  }
};

/**
 * helper function to merge two arrays
 * @param {any[]} array1 - first array
 * @param {any[]} array2 - array to merge
 * @returns {any[]} - merged array
 */
export const mergeArrays = (array1: any[], array2: any[]) => {
  if (array1?.length > 0 && array2?.length > 0) return Array.from(new Set(array1.concat(array2)));
  if (array2?.length > 0) return array2;
  if (array1?.length > 0) return array1;
  return [];
};

/**
 * Filters the form data to identify changed entries compared to existing data.
 * @param {FieldValues} formData - Form data from the user input.
 * @param {SensorTableData | LoggerTableData} data - Existing data to compare against.
 * @returns {Array} - Array of changed entries.
 */
export const filterForChangedEntries = (formData: FieldValues, data: SensorTableData | LoggerTableData) => {
  const filter = Object.entries(formData).filter((obj) => {
    const value = obj[1];
    const key = obj[0];

    return (
      (Number(value) !== -1 || (Number(value) === -1 && Object(data)[key])) &&
      value !== undefined &&
      (value !== null || value === 0) &&
      value !== "" &&
      value !== Object(data)[key] &&
      (Number(value) !== Object(data)[key] || (Object(data)[key] === null && Number(value) === 0))
    );
  });

  return filter.map(([key, value]) => {
    return [key, !isNaN(value) ? Number(value) : value];
  });
};

/**
 * Merges data with additional information (vesselData or unitData) based on the type of the merged data.
 * @param {LoggerTableData | SensorTableData} mergedWithTableData - Data to be merged with additional information.
 * @param {Vessel[]} vesselData - Array of vessel data for logger merging.
 * @param {Unit[]} unitData - Array of unit data for sensor merging.
 * @returns {LoggerDBTableData | SensorDBTableData} - Merged data with additional information for database storage.
 */
export const mergeDataForDatabase = (
  mergedWithTableData: LoggerTableData | SensorTableData,
  vesselData: Vessel[],
  sensorTypes: SensorType[],
  unitData: Unit[]
) => {
  if (isLogger(mergedWithTableData)) {
    // If the merged data is a logger, find the corresponding platform_id based on the logger's vessel name.
    const vessel_name = Object(mergedWithTableData).name;
    const platform_id = vesselData.find((vessel) => vessel.name === vessel_name)?.platform_id;
    const merged = {
      ...mergedWithTableData,
      platform_id: platform_id,
    };
    return merged as LoggerDBTableData;
  }
  if (isSensor(mergedWithTableData)) {
    // If the merged data is a sensor, find the corresponding unit_id based on the sensor's unit name.
    const sensorType: SensorType | undefined = sensorTypes.find(
      (sType) => Number(sType.sensor_type_id) === Number((mergedWithTableData as SensorDBTableData).sensor_type_id)
    );

    const unit = unitData.find((unit) => Number(unit.unit_id) === Number(sensorType?.unit_id));

    const merged = {
      ...mergedWithTableData,
      manufacturer: sensorType?.manufacturer,
      model: sensorType?.model,
      parameter: sensorType?.parameter,
      parameter_no: sensorType?.parameter_no,
      resolution: sensorType?.resolution,
      long_name: sensorType?.long_name,
      unit_id: sensorType?.unit_id,
      unit: unit?.unit,
    };

    return merged as SensorDBTableData;
  }
};

/**
 * Builds an overview of changes between original and modified data, including calibration and WiFi changes.
 * @param {any[]} changedData - Array of changed data entries.
 * @param {LoggerTableData | SensorTableData} originalData - Original data to compare against.
 * @param {string} id - Identifier for the type of data (e.g., 'config').
 * @param {any[]} dataStoreChanged - Array to store changed data for future reference.
 * @param {Wifi[]} wifis - Array of WiFi configurations.
 * @param {CalibrationCoefficient[]} calibCoeff - Array of calibration coefficients.
 * @param {CalibrationCoefficient[]} calibrationData - Existing calibration data.
 * @returns {Array} - Array containing changes overview data.
 */
export const buildChangesOverviewData = (
  changedData: any[],
  originalData: LoggerTableData | SensorTableData,
  id: string,
  dataStoreChanged: any[],
  wifis?: Wifi[],
  calibCoeff?: CalibrationCoefficient[],
  calibrationData?: CalibrationCoefficient[]
) => {
  // Retrieve existing calibration data for the sensor, if available.
  const existingCalibration = calibrationData
    ?.filter(
      (data: CalibrationCoefficient) => Number(data.sensor_id) === Number((originalData as SensorTableData).sensor_id)
    )
    .sort((a, b) => new Date(b.time_calibration).getTime() - new Date(a.time_calibration).getTime())
    .sort((c, d) => c.coefficient_id_per_sensor_id - d.coefficient_id_per_sensor_id);

  // Initialize the result array with changes to non-WiFi properties.
  const result = Object.entries(originalData)
    .filter((obj) => obj[0] !== "wifi")
    .map((item) => {
      const key = item[0];
      const oldValue = item[1];
      const newValue = changedData.find((entry) => entry[0] === key)?.[1];

      return { [key]: { old: oldValue, new: newValue } };
    });

  // Create an array of calibration changes.
  const calibrationArray = calibCoeff?.map((calibrationEntry) => {
    if (existingCalibration) {
      const oldCalibrationObj = existingCalibration?.find(
        (calibrationItem: CalibrationCoefficient) =>
          calibrationItem.coefficient_id_per_sensor_id === calibrationEntry.coefficient_id_per_sensor_id
      );
      return {
        ["sensor_id"]: Number(calibrationEntry?.sensor_id),
        ["coefficient_id_per_sensor_id"]: Number(calibrationEntry?.coefficient_id_per_sensor_id),
        ["value"]: { old: oldCalibrationObj?.value, new: calibrationEntry?.value },
        ["time_calibration"]: new Date(),
      };
    } else {
      return {
        ["sensor_id"]: Number(calibrationEntry.sensor_id),
        ["coefficient_id_per_sensor_id"]: Number(calibrationEntry.coefficient_id_per_sensor_id),
        ["value"]: { old: "", new: calibrationEntry.value },
        ["time_calibration"]: new Date(),
      };
    }
  });
  // Create an array of WiFi changes.
  const wifiArray = wifis?.map((wifi) => {
    const oldWifiObj = (originalData as LoggerConfigFileData).wifi?.find((wifiItem) => wifiItem.ssid === wifi.ssid);
    return {
      ["pw"]: {
        old: oldWifiObj?.pw ? oldWifiObj.pw : "",
        new: !oldWifiObj || oldWifiObj.pw !== wifi.pw ? wifi.pw : "",
      },
      ["ssid"]: {
        old: oldWifiObj?.ssid ? oldWifiObj.ssid : "",
        new: !oldWifiObj || oldWifiObj.ssid !== wifi.ssid ? wifi.ssid : "",
      },
    };
  });

  const calibrationObj = { calib_coeff: calibrationArray };
  dataStoreChanged.push(Object(calibrationObj));
  // If the identifier is 'config', include calibration and WiFi changes in the data store.

  if (id === "config") {
    const wifiObj = { wifi: wifiArray };
    dataStoreChanged.push(Object(wifiObj));
  }
  dataStoreChanged.map((item) => result.push(Object(item)));

  return result;
};

/**
 * Formats a calibration value by trimming unnecessary trailing zeros.
 * @param {number} value - The calibration value to be formatted.
 * @returns {number} - The formatted calibration value.
 */
export const formatCalibrationValue = (value: number) => {
  if (value === 0) return value;
  // Convert the calibration value to a string.
  const decimalString = value.toString();

  // Remove unnecessary trailing zeros, keeping up to 'max' digits after the decimal point.
  const trimmedString = decimalString.replace(/(\.[0-9]*[1-9])?0+$/, "$1");
  // Parse the trimmed string back to a floating-point number and return the result.
  return parseFloat(trimmedString);
};

/**
 * Checks if a given number is a decimal (has a non-zero fractional part).
 * @param {number} value - The number to be checked.
 * @returns {boolean} - True if the number is a decimal, false otherwise.
 */
export const isDecimal = (value: number): boolean => {
  // Check if the number is not an integer and has a non-zero fractional part.
  return !Number.isInteger(value) && value % 1 !== 0;
};

export const isEmpty = (value: string) => {
  return value === "" || value === null || Number(value) === -1;
};

/**
 * Validates data based on predefined rules for different data types and requirements.
 * @param {LoggerTableData | SensorTableData} data - The data to be validated.
 * @param {Tables} tableType - The type of table (Logger or Sensor) for contextual validation.
 * @returns {Object} - An object containing validation errors for each property.
 */
export const validateData = (data: LoggerTableData | SensorTableData, tableType: Tables) => {
  // Initialize an empty object to store validation errors.
  const errors = {};

  // Iterate through each property in the data.
  for (const key in data) {
    const value = Object(data)[key];

    // Check for required fields that are empty, null, or have a value of -1.
    if (
      isEmpty(value) &&
      ((requiredLogger.includes(key) && tableType === Tables.Logger) ||
        (requiredSensor.includes(key) && tableType === Tables.Sensor)) &&
      !loggerGenerated.includes(key) &&
      !sensorGenerated.includes(key)
    ) {
      Object(errors)[key] = "required";
    }

    // Set "bus_address" as a required field if a logger is selected.
    if (key === "bus_address" && !isEmpty(Object(data)["logger_id"]) && isEmpty(value) && tableType === Tables.Sensor) {
      Object(errors)[key] = "required";
    }

    if (
      (numbers.includes(key) || integers.includes(key)) &&
      value !== "" &&
      value !== undefined &&
      isNaN(Number(value))
    ) {
      // Check for non-numeric values in fields marked as numbers.
      Object(errors)[key] = "number";
    }

    // Check for decimal values in fields marked as integers.
    if (integers.includes(key) && value !== "" && value !== undefined && isDecimal(value)) {
      Object(errors)[key] = "integer";
    }

    // Check for invalid date formats in fields marked as dates.
    if (dates.includes(key) && (isNaN(Date.parse(String(value))) || !isNaN(Number(value)))) {
      Object(errors)[key] = "date";
    }

    // Check for non-boolean values in fields marked as booleans.
    if (booleans.includes(key) && Number(value) !== 1 && Number(value) !== 0) {
      Object(errors)[key] = "bool";
    }

    if (Object(errors)[key] === undefined && numbers.includes(key) && value?.length > 11) {
      Object(errors)[key] = "max_length";
    }

    if (Object(errors)[key] === undefined && !numbers.includes(key) && value?.length > 45) {
      Object(errors)[key] = "max_length";
    }

    if (Object(errors)[key] === undefined && int_16.includes(key) && Number(value) > 65535) {
      Object(errors)[key] = "int16";
    }

    if (Object(errors)[key] === undefined && int_8.includes(key) && Number(value) > 255) {
      Object(errors)[key] = "int8";
    }
    if (Object(errors)[key] === undefined && integers.includes(key) && Number(value) < 0) {
      Object(errors)[key] = "positive_int";
    }
    // Check for non-boolean values in fields marked as booleans.
    if (booleans.includes(key) && Number(value) !== 1 && Number(value) !== 0) {
      Object(errors)[key] = "bool";
    }
  }

  // Return the object containing validation errors.
  return errors;
};

/**
 * Retrieves calibration data for a specific sensor.
 * @param {CalibrationCoefficient[]} calibrationData - Array of calibration coefficients.
 * @param {number} sensor_id - ID of the sensor for which calibration data is retrieved.
 * @param {SensorType} sensorType - Optional sensor type information for formatting calibration values.
 * @returns {Object} - Calibration data mapped by coefficient ID.
 */
export const getCalibrationDataForSensor = (calibrationData: CalibrationCoefficient[], sensor_id: number) => {
  // Filter calibration data for the specified sensor ID.
  const filteredData = calibrationData.filter((entry) => entry.sensor_id === sensor_id);

  // Sort the filtered data based on the time of calibration in descending order.
  const sortedData = filteredData.sort(
    (a, b) => new Date(a.time_calibration).getTime() - new Date(b.time_calibration).getTime()
  );

  const reducedData = sortedData
    // Reduce the sorted data to a mapped object with coefficient ID as the key and formatted calibration value.
    .reduce((accumulator, coeff) => {
      // Map coefficient ID to formatted calibration value using a helper function.
      Object(accumulator)[coeff.coefficient_id_per_sensor_id] = formatCalibrationValue(Number(coeff.value));
      return accumulator;
    }, {});
  // Return the mapped calibration data object.
  return reducedData;
};

/**
 * Determines whether a value needs highlighting based on predefined parameter configurations.
 * @param {string} key - The property for which highlighting is determined.
 * @param {number | string} value - The value to be checked for highlighting.
 * @returns {boolean} - True if highlighting is needed, false otherwise.
 */
export const highlightNeeded = (key: string, value: number | string) => {
  // Retrieve the highlight configuration for the specified key.
  const highlightConfig = highlightParameter[key as HighlightParameterkey];

  // Determine whether highlighting is needed based on the configuration and value.
  const needHighlight: boolean =
    highlightConfig &&
    (("min" in highlightConfig && Number(value) < (highlightConfig as { min: number }).min) ||
      ("max" in highlightConfig && Number(value) > (highlightConfig as { max: number }).max));

  // Return the boolean result indicating whether highlighting is needed.
  return needHighlight;
};

/**
 * Checks if a given property has a predefined highlight configuration.
 * @param {string} key - The property to be checked.
 * @returns {boolean} - True if the key has a highlight configuration, false otherwise.
 */
export const isHighlightParameter = (key: string) => {
  // Check if the property has a predefined highlight configuration.
  return highlightParameter[key as HighlightParameterkey] !== undefined;
};

/**
 * Merges status and logger data to create an array of LoggerConfigData.
 * @param {Status[]} statusPositionData - Array of status and position data.
 * @param {CombinedLoggerData[]} loggerData - Array of combined logger data.
 * @returns {LoggerConfigData[]} - Array of merged LoggerConfigData.
 */
export const mergeData = (statusPositionData: Status[], loggerData: CombinedLoggerData[]) => {
  // Initialize an empty array to store the merged data.
  const mergedData: LoggerConfigData[] = [];

  // Iterate through each logger in the loggerData array.
  loggerData.map((logger: CombinedLoggerData) => {
    // Find the corresponding status data based on logger_id.
    const status = { ...statusPositionData.find((statusData) => statusData.logger_id === logger.logger_id) };

    // Merge status and logger data into a new object.
    const merged = { ...status, ...logger };

    // Push the merged data into the array.
    mergedData.push(merged as LoggerConfigData);
  });

  // Return the array of merged LoggerConfigData.
  return mergedData;
};

/**
 * Merges status and logger data to create an array of merged data including HoverInfo.
 * @param {Status[]} statusPositionData - Array of status and position data.
 * @param {CombinedLoggerData[]} loggerData - Array of combined logger data.
 * @returns {(Status & HoverInfo)[]} - Array of merged data with HoverInfo.
 */
export const mergePositionData = (statusPositionData: Status[], loggerData: CombinedLoggerData[]) => {
  // Initialize an empty array to store the merged data.
  const mergedData: (Status & HoverInfo)[] = [];

  // Iterate through each statusData in the statusPositionData array.
  statusPositionData.map((statusData: Status) => {
    // Find the corresponding logger data based on logger_id.
    const logger = { ...loggerData.find((logger) => statusData.logger_id === logger.logger_id) };

    // Merge status and logger data into a new object.
    const merged = { ...statusData, ...logger };

    // Push the merged data into the array.
    mergedData.push(merged as Status & HoverInfo);
  });

  // Return the array of merged data with HoverInfo.
  return mergedData;
};

/**
 * Retrieves the sensor type object for a given sensor type ID from an array of sensor types.
 * @param {number} sensor_type_id - The sensor type ID to retrieve the sensor type for.
 * @param {SensorType[]} sensorTypes - Array of sensor types.
 * @returns {SensorType | undefined} - The matching sensor type object or undefined if not found.
 */
export const getSensorTypeForID = (sensor_type_id: number, sensorTypes: SensorType[]) => {
  // Use the find method to locate the sensor type object with the specified sensor_type_id.
  return sensorTypes.find((sensorType: SensorType) => Number(sensor_type_id) === Number(sensorType.sensor_type_id));
};

/**
 * Handles the focus event by selecting the entire content of the target element.
 * @param {Object} event - The focus event object.
 */
export const handleFocus = (event: { target: { select: () => any } }) => {
  // Use the select method on the target element to select its entire content.
  event.target.select();
};

/**
 * Validates calibration data in the form data, checking for required fields, numeric values, and maximum decimal places.
 * @param {FieldValues} formData - The form data containing calibration information.
 * @param {number} maxLength - The maximum number of decimal places allowed.
 * @returns {{ [key: string]: string }} - Object containing validation errors, if any.
 */
export const validateCalibrationData = (formData: FieldValues, maxLength: number) => {
  // Initialize an empty object to store validation errors.
  const errorObj: { [key: string]: string } = {};

  // Iterate through each key in the form data.
  Object.keys(formData).map((key) => {
    // Check if the value for the key is an empty string, indicating a required field.
    if (formData[key] === "") errorObj[key] = "required";

    // Check if the value for the key is not a numeric value.
    if (isNaN(Number(formData[key]))) errorObj[key] = "number";

    // Check if the value for the key exceeds the maximum decimal places.
    if (!validateDecimalPlaces(formData[key], maxLength)) errorObj[key] = "max_digits";
  });

  // Return the object containing validation errors, if any.
  return errorObj;
};

/**
 * Validates the number of decimal places in a given string value.
 * @param {string} value - The string value to be validated.
 * @param {number} maxDecimalPlaces - The maximum number of decimal places allowed.
 * @returns {boolean} - True if the value has a valid number of decimal places, false otherwise.
 */
const validateDecimalPlaces = (value: string, maxDecimalPlaces: number): boolean => {
  const number = parseFloat(value);
  const maxDigits = 5;
  if (Number.isInteger(number) && value.length > maxDigits) {
    return false;
  }
  // Create a regular expression pattern to validate the number of decimal places.
  const regex = new RegExp(`^-?\\d{1,${maxDigits}}(\\.\\d{0,${maxDecimalPlaces}})?$`);

  // Test the value against the regular expression and return the result.
  return regex.test(value);
};
