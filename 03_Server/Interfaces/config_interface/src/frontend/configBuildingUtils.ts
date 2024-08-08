import { CalibrationCoefficient, SensorType, Unit } from "../backend/entities";
import {
  LoggerConfigFileData,
  SensorConfigTableData,
  SensorDBTableData,
  SensorTableData,
  Status,
} from "../backend/types";
import { getCalibrationDataForSensor } from "./utils";

/**
 * Builds an array of sensors for configuration data, filtering out the sensor with the given sensor_id and adding a new one.
 * @param {CalibrationCoefficient[]} calibrationData - Array of calibration coefficients.
 * @param {SensorTableData} tableData - Original sensor data.
 * @param {LoggerConfigFileData} configData - Logger configuration data.
 * @param {SensorType[]} sensorTypeData - Array of sensor types.
 * @param {CalibrationCoefficient[]} newCalibrationCoefficient - Array of new calibration coefficients.
 * @returns {SensorTableData[]} - Array of sensor data for configuration.
 */
export const buildSensorsForConfigData = (
  calibrationData: CalibrationCoefficient[],
  tableData: SensorTableData,
  configData: LoggerConfigFileData,
  sensorTypeData: SensorType[],
  newCalibrationCoefficient: CalibrationCoefficient[]
) => {
  const sensorArray: any[] = (configData?.sensors || []).filter((sensor) => sensor.sensor_id !== tableData.sensor_id);

  const sensorObj = {
    sensor_id: tableData.sensor_id,
    sample_periode_multiplier: Number(tableData.sample_periode_multiplier),
    sample_cast_periode_multiplier: Number(tableData.sample_cast_periode_multiplier),
    bus_address: (tableData as SensorDBTableData).bus_address,
    calib_coeff: formatCalibCoefficient(
      (newCalibrationCoefficient?.length > 0
        ? newCalibrationCoefficient
        : getCalibrationDataForSensor(calibrationData, tableData.sensor_id)) as CalibrationCoefficient[]
    ),
  };

  const sensorTypeObj = {
    ...sensorTypeData.find((sensor_type) => sensor_type.sensor_type_id === tableData.sensor_type_id),
  };

  sensorArray.push({ ...sensorObj, sensor_type: { ...sensorTypeObj } });
  return sensorArray as unknown as SensorTableData;
};

/**
 * Formats an array of calibration coefficients into a Record<number, string>.
 * @param {CalibrationCoefficient[]} calibCoeffs - Array of calibration coefficients.
 * @returns {Record<number, string> | CalibrationCoefficient[]} - Formatted calibration coefficients.
 */
const formatCalibCoefficient = (calibCoeffs?: CalibrationCoefficient[]) => {
  if (calibCoeffs && calibCoeffs?.length > 0) {
    const array = calibCoeffs?.map((calibCoeff: CalibrationCoefficient) => calibCoeff.value);

    return array.reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {} as Record<number, string>);
  }
  return calibCoeffs ? calibCoeffs : [];
};

/**
 * Builds a status object with additional information for a logger.
 * @param {Status} objectData - Original status data.
 * @param {number} logger_id - Logger ID.
 * @returns {Status} - Modified status object.
 */
export const buildStatusObj = (objectData: Status, logger_id: number) => {
  const used: number = parseFloat(
    ((Number(objectData.memory_capacity_used) / Number(objectData.memory_capacity_total)) * 100).toFixed(2)
  );
  const usedValueObj =
    used !== undefined && !isNaN(used) && used.toString() !== "undefined"
      ? {
          memory_capacity_used_percent: Number(used.toFixed(2)),
          memory_capacity_remaining: Number((100 - used).toFixed(2)),
        }
      : {};
  if (objectData.deckbox_position_last) {
    const date = new Date(objectData.deckbox_position_last?.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = !isNaN(year) && !isNaN(month) && !isNaN(day) ? `${day}.${month}.${year}` : "invalid date";

    const result: Status = {
      ...objectData,
      logger_id: logger_id,
      battery_remaining: Number((Number(objectData.battery_remaining) * 100).toFixed(2)),
      memory_capacity_used: Number(objectData.memory_capacity_used),
      ...usedValueObj,
      date: dateString,
      lng: objectData.deckbox_position_last.lng,
      lat: objectData.deckbox_position_last.lat,
    };
    return result;
  } else {
    return {
      ...objectData,
      logger_id: logger_id,
      battery_remaining: Number((Number(objectData.battery_remaining) * 100).toFixed(2)),
      memory_capacity_used: Number(objectData.memory_capacity_used),
      ...usedValueObj,
    };
  }
};

/**
 * Builds a logger configuration data object.
 * @param {LoggerConfigFileData} loggerData - Logger configuration data.
 * @param {(SensorDBTableData & SensorConfigTableData)[] | [] | undefined} sensors - Array of sensors.
 * @returns {Object} - Logger configuration data object.
 */
export const buildLoggerConfigData = (
  loggerData: LoggerConfigFileData,
  sensors?: (SensorDBTableData & SensorConfigTableData)[] | [] | undefined
) => {
  return {
    logger_id: loggerData.logger_id,
    operation_mode: loggerData.operation_mode,
    fw_version: loggerData.fw_version,
    num_sensors: sensors?.length,
    wifi: loggerData.wifi,
    config_update_periode: Number(loggerData.config_update_periode),
    status_upload_periode: Number(loggerData.status_upload_periode),
    sample_periode: Number(loggerData.sample_periode),
    sample_cast_enable: Number(loggerData.sample_cast_enable),
    sample_cast_periode: Number(loggerData.sample_cast_periode),
    cast_det_sensor: Number(loggerData.cast_det_sensor),
    cast_det_sensor_threshold: Number(loggerData.cast_det_sensor_threshold),
    wet_det_sensor: Number(loggerData.wet_det_sensor),
    wet_det_periode: Number(loggerData.wet_det_periode),
    wet_det_threshold: Number(loggerData.wet_det_threshold),
    dry_det_sensor: Number(loggerData.dry_det_sensor),
    dry_det_threshold: Number(loggerData.dry_det_threshold),
    dry_det_verify_delay: Number(loggerData.dry_det_verify_delay),
    data_upload_retry_periode: Number(loggerData.data_upload_retry_periode),
    deckunit_id: Number(loggerData.deck_unit_id),
    platform_id: Number(loggerData.platform_id),
    vessel_id: Number(loggerData.platform_id),
    vessel_name: loggerData.name,
    deployment_contact_id: Number(loggerData.deployment_contact_id),
    contact_first_name: loggerData.contact_first_name,
    contact_last_name: loggerData.contact_last_name,
    sensors: sensors,
  };
};

/**
 * Builds a sensor configuration object.
 * @param {SensorDBTableData} sensorData - Original sensor data.
 * @param {CalibrationCoefficient | {}} calibCoeff - Calibration coefficient or empty object.
 * @returns {SensorDBTableData & SensorConfigTableData} - Sensor configuration object.
 */
export const buildSensorConfigObject = (
  sensorData: SensorDBTableData,
  unitData: Unit[],
  calibCoeff?: CalibrationCoefficient | {}
) => {
  const unit = unitData.find((unit_obj) => Number(unit_obj.unit_id) === Number(sensorData.unit_id));

  return {
    sensor_id: sensorData.sensor_id,
    sample_periode_multiplier: sensorData.sample_periode_multiplier,
    sample_cast_periode_multiplier: sensorData.sample_cast_periode_multiplier,
    bus_address: sensorData.bus_address,
    calib_coeff: formatCalibCoefficient(calibCoeff as CalibrationCoefficient[]) as [],
    serial_number: sensorData.serial_number,
    sensor_type: {
      sensor_type_id: sensorData.sensor_type_id,
      parameter: sensorData.parameter,
      long_name: sensorData.long_name,
      unit: unit?.unit,
      manufacturer: sensorData.manufacturer,
      model: sensorData.model,
      parameter_no: sensorData.parameter_no,
      accuracy: sensorData.accuracy,
      resolution: sensorData.resolution,
    },
  } as unknown as SensorDBTableData & SensorConfigTableData;
};
