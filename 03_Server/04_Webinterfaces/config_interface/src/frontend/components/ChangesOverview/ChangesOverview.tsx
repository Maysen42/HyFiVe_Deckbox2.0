import { useStore } from "../../../stores";
import Button from "../Button";
import {
  LoggerConfigFileData,
  LoggerDBTableData,
  SensorConfigTableData,
  SensorDBTableData,
} from "../../../backend/types";
import { LoggerService } from "../../services/database/LoggerService";
import { SensorService } from "../../services/database/SensorService";
import Cancel from "./Cancel";
import ChangesRows from "./ChangesRows";
import UnchangedDataRows from "./UnchangedDataRows";
import Header from "./Header";
import { ConfigFileService } from "../../services/file/ConfigFileService";
import { emptyConfigObj } from "../../../backend/constants";
import { getCalibrationDataForSensor } from "../../utils";
import { CalibrationCoefficient } from "../../../backend/entities";
import { CalibrationCoefficientService } from "../../services/database/CalibrationCoefficientService";
import { buildLoggerConfigData, buildSensorConfigObject } from "../../configBuildingUtils";
import { Tables } from "../../../backend/enums";

interface ChangesOverviewProps {
  addNew: boolean;
  triggerDataChanged: () => void;
  type: Tables;
  loggerChanged?: boolean;
  prevLoggerID?: number;
}

/**
 * ChangesOverview component for displaying and handling changes in logger and sensor configurations.
 * @param {ChangesOverviewProps} props - The properties for the ChangesOverview component.
 * @param {boolean} props.addNew - Indicates whether the changes involve adding a new configuration.
 * @param {() => void} props.triggerDataChanged - Function to trigger data changes.
 * @param {Tables} props.type - Indicates the type of configuration (logger or sensor).
 * @param {boolean | undefined} props.loggerChanged - Indicates if the logger assignment has changed.
 * @param {number | undefined} props.prevLoggerID - The previous logger ID if the logger assignment has changed.
 * @returns {JSX.Element} - The JSX element representing the ChangesOverview component.
 */
const ChangesOverview = ({ addNew, triggerDataChanged, type, loggerChanged, prevLoggerID }: ChangesOverviewProps) => {
  const { data: dataStore } = useStore();

  const loggerService: LoggerService = new LoggerService();
  const sensorService: SensorService = new SensorService();
  const configFileService: ConfigFileService = new ConfigFileService();
  const calibrationCoefficientService: CalibrationCoefficientService = new CalibrationCoefficientService();

  const comparisionStyle = "flex flex-1 p-1 mb-2 mx-1 justify-center bg-white shadow text-sm min-h-6";

  const close = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.target instanceof HTMLButtonElement) {
      dataStore.setOverlayVisible({ visible: false, trigger: e.target.id });
      dataStore.setChangedData([]);
    }
  };

  /**
   * Handles the deployment of logger configurations.
   * @param {React.MouseEvent<HTMLButtonElement>} e - The button click event.
   * @returns {Promise<void>} - A Promise that resolves when the deployment is complete.
   */
  const deploy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const data = dataStore.dataForDatabase;

    if (type === Tables.Logger) {
      await handleLoggerDeployment(data as LoggerDBTableData);
    } else if (type === Tables.Sensor) {
      await handleSensorDeployment(data as SensorDBTableData);
    }
    dataStore.setNewCalibrationCoefficient([]);
    dataStore.setWifisForConfig([]);
    dataStore.setChangedData([]);
    triggerDataChanged();
    close(e);
  };

  /**
   * Handles the deployment of logger configurations.
   * @param {LoggerDBTableData} loggerData - The logger configuration data.
   * @returns {Promise<void>} - A Promise that resolves when the deployment is complete.
   */
  const handleLoggerDeployment = async (loggerData: LoggerDBTableData) => {
    let id: number = Number(loggerData?.logger_id);

    if (addNew) {
      const res = await loggerService.insertNewLogger(loggerData);
      id = res?.logger_id;
      await handleNewLoggerConfig(id);
    } else {
      await loggerService.editLoggerByID(Number(loggerData?.logger_id), Object(loggerData));
      await configFileService.addNewConfig(dataStore.dataForConfigFile as LoggerConfigFileData);
    }

    dataStore.fetchLoggerData();
    dataStore.setSelectedLoggerID(id);
  };

  /**
   * Handles the deployment of sensor configurations.
   * @param {SensorDBTableData} sensorData - The sensor configuration data.
   * @returns {Promise<void>} - A Promise that resolves when the deployment is complete.
   */
  const handleSensorDeployment = async (sensorData: SensorDBTableData) => {
    let edited = {};

    if (addNew) {
      const res = await sensorService.insertNewSensor(sensorData);
      if (dataStore.dataForDatabase) sensorData.sensor_id = res.sensor_id;
    } else {
      edited = await sensorService.editSensorByID(Number(sensorData.sensor_id), Object(sensorData));
    }
    await handleSensorConfig(sensorData, edited);
    dataStore.fetchSensorData();
    dataStore.setSelectedSensorID(sensorData.sensor_id);
  };

  /**
   * Handles the creation of a new logger configuration.
   * @param {number | undefined} loggerId - The ID of the newly created logger.
   * @param {LoggerDBTableData} loggerData - The logger configuration data.
   * @returns {Promise<void>} - A Promise that resolves when the creation is complete.
   */
  const handleNewLoggerConfig = async (loggerId: number | undefined) => {
    if (loggerId && dataStore.dataForConfigFile && loggerId > -1) {
      dataStore.dataForConfigFile.logger_id = loggerId;
      const tmp = { ...dataStore.dataForConfigFile, logger_id: loggerId };
      const configData = buildLoggerConfigData(tmp as LoggerConfigFileData, []);
      await configFileService.addNewConfig(configData as LoggerConfigFileData);
    }
  };

  /**
   * Handles the configuration of a sensor.
   * @param {SensorDBTableData} sensorData - The sensor configuration data.
   * @param {Record<string, any>} edited - The edited properties of the sensor configuration.
   * @returns {Promise<void>} - A Promise that resolves when the configuration is complete.
   */
  const handleSensorConfig = async (sensorData: SensorDBTableData, edited: Record<string, any>) => {
    const configSensors = dataStore.dataForConfigFile?.sensors;
    const newSensor = configSensors?.find((sensor) => sensor.sensor_id === null);
    const existingSensor = configSensors?.find((sensor) => sensor.sensor_id === sensorData.sensor_id);
    const prevSensors =
      configSensors?.filter((sensor) => sensor.sensor_id !== null && sensor.sensor_id !== sensorData.sensor_id) || [];

    if (dataStore.newCalibrationCoefficient?.length > 0) {
      //set sensor id for new sensors
      if (Object.keys(edited).length === 0) {
        dataStore.setNewCalibrationCoefficient(
          dataStore.newCalibrationCoefficient.map((coeff) => {
            return { ...coeff, sensor_id: sensorData.sensor_id };
          })
        );
      }
      await calibrationCoefficientService.insertNewCalibrationCoefficien(dataStore.newCalibrationCoefficient);
      await dataStore.fetchCalibrationData();
    }

    const calibCoeff: CalibrationCoefficient | {} = getCalibrationDataForSensor(
      dataStore.calibrationData,
      sensorData.sensor_id
    );

    if (newSensor) {
      if (!sensorData.logger_id || sensorData.logger_id === -1) {
        dataStore.fetchSensorData();
        dataStore.setSelectedSensorID(sensorData.sensor_id);
        return;
      }
      const sensorObj = buildSensorConfigObject(
        { ...sensorData, ...dataStore.dataForConfigFile, sensor_id: sensorData.sensor_id },
        dataStore.unitData,
        calibCoeff
      );
      newSensor.sensor_id = sensorData.sensor_id;
      prevSensors?.push(sensorObj);
    } else if (existingSensor) {
      const sensorObj = buildSensorConfigObject(
        { ...sensorData, ...dataStore.dataForConfigFile, ...edited, sensor_id: sensorData.sensor_id },
        dataStore.unitData,
        calibCoeff
      );

      prevSensors?.push(sensorObj);
    }

    const dbSensorData = await sensorService.findSensorsByLogger(Number(dataStore.dataForDatabase?.logger_id) || 0);
    const sensors = handleSensors(dbSensorData, prevSensors);
    const tmp = {
      ...dataStore.dataForConfigFile,
      logger_id: Number(dataStore.dataForDatabase?.logger_id) || 0,
      sensors: sensors,
    };
    const configData = buildLoggerConfigData(tmp as LoggerConfigFileData, prevSensors);

    if (dataStore.dataForDatabase?.logger_id !== null && Number(dataStore.dataForDatabase?.logger_id) > -1) {
      await configFileService.addNewConfig(configData as LoggerConfigFileData);
    }
    //write new config file for old logger
    if (loggerChanged && prevLoggerID && !isNaN(prevLoggerID) && !addNew && Number(prevLoggerID) > -1) {
      handleLoggerAssignmentChanged(prevLoggerID, prevSensors);
    }
    dataStore.fetchSensorData();
    dataStore.setSelectedSensorID(sensorData.sensor_id);
  };

  const handleLoggerAssignmentChanged = async (
    prevLoggerID: number,
    prevSensors: (SensorDBTableData & SensorConfigTableData)[]
  ) => {
    const loggerDetailData = await loggerService.findByID(prevLoggerID);
    const prevConfig: LoggerConfigFileData = await configFileService.getNewestConfigFile(prevLoggerID);
    const dbSensorData = await sensorService.findSensorsByLogger(prevLoggerID);
    const loggerConfigData = buildLoggerConfigData(loggerDetailData, dbSensorData);
    const sensors = handleSensors(dbSensorData, prevSensors);

    const noPrevConfig = Object.keys(prevConfig).length === 0;
    const newConfig = noPrevConfig
      ? {
          ...emptyConfigObj,
          ...loggerConfigData,
          num_sensors: loggerConfigData.sensors?.length,
        }
      : { ...prevConfig, num_sensors: sensors.length, sensors: sensors };

    await configFileService.addNewConfig(newConfig as LoggerConfigFileData);
  };

  const handleSensors = (dbSensorData: SensorDBTableData[], sensors: (SensorDBTableData & SensorConfigTableData)[]) => {
    return dbSensorData.map((sensor: SensorDBTableData) => {
      const sensorObj = buildSensorConfigObject(
        sensor,
        dataStore.unitData,
        getCalibrationDataForSensor(dataStore.calibrationData, sensor.sensor_id)
      );
      const prevConfig = sensors.find((sensor) => sensor.sensor_id === sensor.sensor_id);

      return {
        ...sensorObj,
        sample_periode_multiplier: prevConfig?.sample_periode_multiplier
          ? Number(prevConfig?.sample_periode_multiplier)
          : "",
        sample_cast_periode_multiplier: prevConfig?.sample_cast_periode_multiplier
          ? Number(prevConfig?.sample_cast_periode_multiplier)
          : "",
      };
    });
  };

  return (
    <div>
      <div className="fixed bg-black w-screen top-0 h-full right-0 z-30 opacity-40" />
      <div className="fixed flex flex-col bg-white min-w-[800px] max-h-[600px] h-auto -translate-x-1/2 left-1/2 top-16 px-4 rounded-lg z-30">
        {dataStore.dataForDatabase?.logger_id && Number(dataStore.dataForDatabase?.logger_id) > -1 && (
          <div className="flex-1 fley text-xs text-white bg-red opacity-80 rounded-lg px-2 py-1 mt-2 text-center">
            Write new config file for logger <b>{dataStore.dataForDatabase?.logger_id}</b>
            {loggerChanged && Number(prevLoggerID) && !isNaN(Number(prevLoggerID)) && !addNew && (
              <div>
                Logger assignment for sensor changed. Write new config file for logger <b>{prevLoggerID}</b> too
              </div>
            )}
          </div>
        )}
        <div className="relative left-1/2 text-center top-6 -translate-x-1/2 bg-white font-bold text-2xl text-danube-800 inline-block">
          Changes Overview
        </div>
        <Cancel onClick={close} />
        {addNew && dataStore.newCalibrationCoefficient?.length === 0 && (
          <div className="flex-1 fley text-xs text-white bg-red opacity-80 rounded-lg px-2 py-1 mt-2 text-center">
            Warning! No input for calibration coefficients
          </div>
        )}
        {dataStore.changedData?.length > 0 && (
          <>
            <Header type={"changed"} defaultOpen={true}>
              <ChangesRows style={comparisionStyle} />
            </Header>
            <Header type={"unchanged"} defaultOpen={false}>
              <UnchangedDataRows style={comparisionStyle} />
            </Header>
          </>
        )}
        {dataStore.changedData?.length === 0 && <div className="py-2 text-center">No changed data</div>}
        <div className="flex w-auto justify-end my-4">
          <Button button_type="" text="Cancel" style={"mr-2"} onClick={close} />
          <Button
            button_type="default"
            text="Deploy"
            type="submit"
            id="deploy"
            onClick={dataStore.changedData?.length > 0 ? deploy : () => {}}
            disabled={dataStore.changedData?.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangesOverview;
