import { useCallback, useEffect, useRef, useState } from "react";
import { SensorService } from "../services/database/SensorService";
import SensorTable from "../components/Table/SensorTable";
import { useStore } from "../../stores";
import { LoggerConfigFileData, SensorConfigTableData, SensorDBTableData, SensorTableData } from "../../backend/types";
import Toolbar from "../components/Toolbar";
import ChangesOverview from "../components/ChangesOverview/ChangesOverview";
import { observer } from "mobx-react-lite";
import { FieldValues } from "react-hook-form";
import {
  emptyLoggerConfigObj,
  emptySensorConfigObj,
  senorKeysForEdit,
  sensorConfigTableKeys,
  sensorKeysForConfig,
  sensorKeysForDB,
  sensorKeysForDBNew,
  sensorKeysForNew,
} from "../../backend/constants";
import {
  filterForChangedEntries,
  validateData,
  buildChangesOverviewData,
  mergeDataForDatabase,
  mergeArrays,
} from "../utils";
import { ConfigFileService } from "../services/file/ConfigFileService";
import { buildSensorsForConfigData } from "../configBuildingUtils";
import Headline from "../components/Headline";
import { Tables } from "../../backend/enums";

interface SensorDetailProps {
  selectedSensorID?: number;
}

/**
 * SensorDetail component responsible for displaying and editing details of a selected sensor.
 * It fetches data from the sensor service and observes changes in the data store.
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.selectedSensorID - The ID of the selected sensor.
 * @returns {JSX.Element} - The JSX element representing the SensorDetail component.
 */
const SensorDetail = ({ selectedSensorID }: SensorDetailProps) => {
  const sensorService: SensorService = new SensorService();
  const { data: dataStore } = useStore();
  const [sensorDetailData, setSensorDetailData] = useState<SensorDBTableData>();
  const [insertNewData, setInsertNewData] = useState<SensorTableData>();
  const [insertNewConfigData, setInsertNewConfigData] = useState<SensorTableData>();
  const [sensorConfigData, setSensorConfigData] = useState<SensorTableData>();
  const [config, setConfigData] = useState<LoggerConfigFileData>();
  const editableByUser = dataStore.access === "write";
  const [editMode, setEditMode] = useState<boolean>(false);
  const [insertNew, setInsertNew] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [prevLoggerID, setPrevLoggerID] = useState<string>("");
  const [loggerChanged, setLoggerChanged] = useState<boolean>(false);
  const [selectedLogger, setSelectedLogger] = useState<number>();

  const formRefConfig = useRef<HTMLFormElement | null>(null);
  const formRefDB = useRef<HTMLFormElement | null>(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const configFileService: ConfigFileService = new ConfigFileService();

  const triggerDataChanged = () => {
    setDataChanged(!dataChanged);
  };
  const toggleEditMode = async () => {
    if (!editableByUser) return;
    setSelectedLogger(sensorDetailData?.logger_id ? sensorDetailData.logger_id : -1);
    const val = !editMode;
    setEditMode(val);
    dataStore.setEditing(val);
    dataStore.setNewCalibrationCoefficient([]);
    dataStore.setChangedData([]);
  };
  const toggleInsertNew = () => {
    if (!editableByUser) return;
    if (!insertNew) setSelectedLogger(-1);
    const val = !insertNew;
    setInsertNew(val);
    dataStore.setEditing(val);
    dataStore.setChangedData([]);
    dataStore.setNewCalibrationCoefficient([]);
  };

  const getSensorDetailData = useCallback(async () => {
    const id = selectedSensorID && selectedSensorID > 0 ? selectedSensorID : dataStore.sensorData[0].sensor_id;
    const data = await sensorService.findSensorDetailsByID(id);
    const tmp: SensorTableData = {} as SensorTableData;
    Object.keys(data).forEach((key) => {
      Object(tmp)[key as keyof SensorTableData] = null;
    });

    setSelectedLogger(data.logger_id);
    setInsertNewData(tmp);
    setSensorDetailData(data);
    dataStore.setSelectedID(id);
  }, [dataStore.selectedSensorID, dataChanged, selectedSensorID]);

  /**
   * Fetches sensor details data from the service and sets it to the state.
   * @function
   * @async
   * @callback
   */
  const getSensorConfigData = useCallback(async () => {
    if (!sensorDetailData?.logger_id && !selectedLogger) return;
    const logger_id = selectedLogger ? selectedLogger : sensorDetailData?.logger_id || -1;
    setSelectedLogger(logger_id);

    const data: LoggerConfigFileData = await configFileService.getNewestConfigFile(logger_id);
    const sensorConfigObj = data.sensors?.find(
      (sensor) =>
        Number(sensor.sensor_id) === (selectedSensorID !== 0 ? selectedSensorID : Number(sensorDetailData?.sensor_id))
    );

    if (sensorConfigObj !== undefined) {
      const filtered: SensorConfigTableData = Object.keys(sensorConfigObj)
        .filter((key) => sensorConfigTableKeys.includes(key))
        .reduce((result, key) => {
          Object(result)[key] = Object(sensorConfigObj)[key];
          return result;
        }, {} as SensorConfigTableData);

      const configData =
        Object.keys(data).length > 0
          ? Object.keys(emptySensorConfigObj).reduce((result, key) => {
              if (filtered.hasOwnProperty(key)) {
                Object(result)[key] = Object(filtered)[key];
              } else {
                Object(result)[key] = Object(emptySensorConfigObj)[key];
              }
              return result;
            }, {} as SensorConfigTableData)
          : undefined;

      setSensorConfigData(configData);
    } else {
      setSensorConfigData(emptySensorConfigObj as unknown as SensorTableData);
    }

    if (Object.keys(data).length > 0) {
      setConfigData(data as unknown as LoggerConfigFileData);
    }
    setInsertNewConfigData(emptySensorConfigObj as {} as SensorConfigTableData);
  }, [dataChanged, selectedLogger, selectedSensorID]);

  useEffect(() => {
    if (dataStore.overlayVisible.trigger === "deploy") {
      disableModes();
    }
    setIsVisible(dataStore.overlayVisible.visible);
  }, [dataStore.overlayVisible]);

  const disableModes = () => {
    setEditMode(false);
    setInsertNew(false);
    dataStore.setEditing(false);
    dataStore.setNewCalibrationCoefficient([]);
    dataStore.setChangedData([]);
  };

  useEffect(() => {
    getSensorDetailData();
  }, [getSensorDetailData]);

  useEffect(() => {
    getSensorConfigData();
  }, [getSensorConfigData]);

  /**
   * Gets data based on the provided ID.
   * @function
   * @param {string} id - The ID to identify the data source.
   * @returns {Object} - The data object.
   */
  const getData = (id: string) => {
    switch (id) {
      case "db":
        return !insertNew ? sensorDetailData : insertNewData;
      case "config":
        return !insertNew ? { ...sensorDetailData, ...sensorConfigData } : insertNewConfigData;
      default:
        return;
    }
  };

  /**
   * Handles form submission.
   * @function
   * @async
   * @param {FieldValues} formData - The form data.
   * @param {Object} ref - The form reference.
   * @returns {boolean} - Whether the submission was successful or not.
   */
  const onSubmit = async (formData: FieldValues, ref: any) => {
    const id = ref.target.id;
    const tableData: SensorTableData = getData(id) as SensorTableData;
    const changed = filterForChangedEntries(formData, tableData as SensorTableData);

    const loggerChanged = Object.fromEntries(changed).logger_id !== undefined;
    if (id !== "config") setLoggerChanged(loggerChanged);

    if (loggerChanged && id !== "config") setPrevLoggerID(tableData.logger_id?.toString());

    const baseData =
      id == "config" && (selectedLogger === -1 || selectedLogger === undefined) ? dataStore.dataForDatabase : tableData;

    const merged: SensorTableData | {} = { ...baseData, ...Object.fromEntries(changed) };

    const validate = { ...merged };
    const validationErrors = validateData(Object(validate) as SensorTableData, Tables.Sensor);

    //merge errors from config and db table
    dataStore.setValidationErros(
      id !== "config" ? validationErrors : { ...dataStore.validationErrors, ...validationErrors }
    );

    setErrors(dataStore.validationErrors);
    if (Object.keys(dataStore.validationErrors).length > 0) {
      return false;
    }

    const changesOverviewData = buildChangesOverviewData(
      changed,
      tableData,
      id,
      dataStore.changedData,
      mergeArrays(dataStore.wifisForConfig, dataStore.existingWifis),
      dataStore.newCalibrationCoefficient,
      dataStore.calibrationData
    );

    const changedData = Object.values(changesOverviewData).filter((entry) => {
      const property = Object.keys(entry).toString();
      const valueObj = entry[property];

      if (Array.isArray(valueObj)) {
        const values = Object.values(valueObj);
        const filteredValues = values.filter((val: any) => {
          if (property === "calib_coeff") {
            return val.value?.new !== "" && val.value?.new !== undefined;
          }
        });

        return filteredValues.length > 0;
      } else {
        return valueObj?.new !== undefined && valueObj?.new !== "";
      }
    });

    const unchangedData = Object.values(changesOverviewData).filter((entry) => {
      const property = Object.keys(entry).toString();
      const valueObj = entry[property];
      if (Array.isArray(valueObj)) {
        const values = Object.values(valueObj);

        const filteredValues = values.filter((value: any) => {
          if (property === "calib_coeff") {
            return value.value?.new === "" || value.value?.new === undefined;
          }
        });

        return filteredValues.length > 0;
      } else {
        return valueObj?.new === undefined || valueObj?.new === "";
      }
    });
    dataStore.setChangesOverviewData(unchangedData);
    dataStore.setChangedData(changedData);

    //Merge data for database use
    if (id === "db" && merged !== undefined) {
      const dataForDatabase: SensorDBTableData = mergeDataForDatabase(
        merged as SensorDBTableData,
        dataStore.vesselData,
        dataStore.sensorTypeData,
        dataStore.unitData
      ) as SensorDBTableData;
      dataStore.setDataForDatabase(dataForDatabase);

      if (dataForDatabase.logger_id === null || Number(dataForDatabase.logger_id) === -1)
        dataStore.setOverlayVisible({ visible: true });
    }

    //merge data for config files and set overlay visible
    if (id === "config") {
      const mergedConfig: SensorConfigTableData & SensorDBTableData = {
        ...dataStore.dataForDatabase,
        ...merged,
      } as SensorConfigTableData & SensorDBTableData;

      const configObj = (config ? config : emptyLoggerConfigObj) as LoggerConfigFileData;

      const sensorArray: SensorTableData = buildSensorsForConfigData(
        dataStore.calibrationData,
        mergedConfig,
        configObj,
        dataStore.sensorTypeData,
        dataStore.newCalibrationCoefficient
      );
      // Direkt sensorArray zu config.sensors zuweisen
      const obj = { ...config, ...mergedConfig, sensors: sensorArray };

      dataStore.setDataForConfigFile(obj as unknown as LoggerConfigFileData);
      dataStore.setOverlayVisible({ visible: true });
    }

    return false;
  };

  return (
    <div className="flex flex-col">
      <Toolbar
        data={dataStore.sensorData}
        text={"Sensor ID"}
        editMode={editMode}
        defaultValue={selectedSensorID && selectedSensorID > 0 ? selectedSensorID : dataStore.sensorData[0].sensor_id}
        addNew={insertNew}
        toggleInsertNew={toggleInsertNew}
        toggleEditMode={toggleEditMode}
        editableByUser={editableByUser}
        refs={[formRefDB, formRefConfig]}
        onSubmit={onSubmit}
      />
      {!insertNew && sensorDetailData !== undefined && (
        <div>
          <Headline text={"Overview Information"} style="mt-4" />
          <SensorTable
            tableData={sensorDetailData}
            editableByUser={editableByUser}
            editMode={editMode}
            isNew={insertNew}
            form_id="db"
            onSubmit={onSubmit}
            errors={errors}
            formRef={formRefDB}
            calibCoeff={true}
            setSelectedLogger={setSelectedLogger}
            editableKeys={senorKeysForEdit}
            shownKeys={sensorKeysForDB}
          />
          {selectedLogger && selectedLogger > -1 && (
            <SensorTable
              tableData={sensorConfigData as SensorConfigTableData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              form_id="config"
              onSubmit={onSubmit}
              errors={errors}
              formRef={formRefConfig}
              editableKeys={senorKeysForEdit}
              shownKeys={sensorKeysForConfig}
            />
          )}
        </div>
      )}
      {insertNew && insertNewData !== undefined && (
        <div>
          <SensorTable
            tableData={insertNewData}
            editableByUser={editableByUser}
            editMode={editMode}
            isNew={insertNew}
            form_id="db"
            errors={errors}
            onSubmit={onSubmit}
            formRef={formRefDB}
            calibCoeff={false}
            setSelectedLogger={setSelectedLogger}
            editableKeys={sensorKeysForNew}
            shownKeys={sensorKeysForDBNew}
          />
          {selectedLogger && selectedLogger > -1 && insertNewConfigData !== undefined && (
            <SensorTable
              tableData={insertNewConfigData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              form_id="config"
              onSubmit={onSubmit}
              errors={errors}
              formRef={formRefConfig}
              editableKeys={sensorKeysForNew}
              shownKeys={sensorKeysForConfig}
            />
          )}
        </div>
      )}
      {isVisible && (
        <ChangesOverview
          addNew={insertNew}
          triggerDataChanged={triggerDataChanged}
          type={Tables.Sensor}
          loggerChanged={loggerChanged}
          prevLoggerID={prevLoggerID ? Number(prevLoggerID) : -1}
        />
      )}
    </div>
  );
};

export default observer(SensorDetail);
