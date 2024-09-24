import { useCallback, useEffect, useRef, useState } from "react";
import { LoggerService } from "../services/database/LoggerService";
import { StatusFileService } from "../services/file/StatusFileService";
import { ConfigFileService } from "../services/file/ConfigFileService";
import {
  LoggerConfigFileData,
  LoggerConfigTableData,
  LoggerDBTableData,
  LoggerTableData,
  SensorByLoggerKey,
  SensorConfigTableData,
  SensorDBTableData,
  Status,
} from "../../backend/types";
import { useStore } from "../../stores";
import LoggerTable from "../components/Table/LoggerTable";
import ChangesOverview from "../components/ChangesOverview/ChangesOverview";
import Toolbar from "../components/Toolbar";
import Table from "../components/Table";
import { SensorService } from "../services/database/SensorService";
import { SensorByLogger } from "../../backend/services/database/SensorService";
import Headline from "../components/Headline";
import { observer } from "mobx-react-lite";
import {
  buildChangesOverviewData,
  filterForChangedEntries,
  getCalibrationDataForSensor,
  mergeArrays,
  mergeDataForDatabase,
  validateData,
} from "../utils";
import {
  sensorHeader,
  loggerConfigTableKeys,
  emptyLoggerConfigObj,
  emptyConfigObj,
  loggerKeysForDB,
  loggerKeysForEdit,
  loggerKeysForConfig,
  loggerKeysForNew,
  statusKeys,
} from "../../backend/constants";
import { FieldValues } from "react-hook-form";
import { buildLoggerConfigData, buildSensorConfigObject } from "../configBuildingUtils";
import { Tables } from "../../backend/enums";

interface LoggerDetailProps {
  selectedLoggerID?: number;
}

/**
 * LoggerDetail component responsible for displaying details of a logger, including configuration and sensors.
 * It observes changes in the data store and updates the UI accordingly.
 * @component
 * @param {LoggerDetailProps} props - The properties passed to the LoggerDetail component.
 * @returns {JSX.Element} - The JSX element representing the LoggerDetail component.
 */
const LoggerDetail = ({ selectedLoggerID }: LoggerDetailProps) => {
  const loggerService: LoggerService = new LoggerService();
  const sensorService: SensorService = new SensorService();
  const statusFileService: StatusFileService = new StatusFileService();
  const configFileService: ConfigFileService = new ConfigFileService();
  const [loggerDetailData, setLoggerDetailData] = useState<LoggerTableData>();
  const [loggerConfigData, setLoggerConfigData] = useState<LoggerTableData>();
  const [completeConfig, setCompleteConfig] = useState<LoggerConfigFileData>();
  const [insertNewData, setInsertNewData] = useState<LoggerTableData>();
  const [insertNewConfigData, setInsertNewConfigData] = useState<LoggerTableData>();
  const [sensorData, setSensorData] = useState<SensorByLogger[]>();
  const [statusData, setStatusData] = useState<Status>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [insertNew, setInsertNew] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { data: dataStore } = useStore();
  const sensorKeys: SensorByLoggerKey[] = ["sensor_id", "parameter", "model", "manufacturer", "bus_address"];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formRefDB = useRef<HTMLFormElement>();
  const formRefConfig = useRef<HTMLFormElement>();
  const editableByUser = dataStore.access === "write";
  const [dataChanged, setDataChanged] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<number>(
    dataStore.selectedLoggerID > 0 ? dataStore.selectedLoggerID : dataStore.firstLoggerID
  );
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
  };
  const getLoggerDetailData = useCallback(async () => {
    const id = selectedLoggerID && selectedLoggerID > 0 ? selectedLoggerID : dataStore.firstLoggerID;
    const data = await loggerService.findByID(id);

    setDropdownValue(id);
    dataStore.setSelectedID(id);

    const tmp: LoggerTableData = {} as LoggerTableData;
    for (const key of Object.keys(data)) {
      Object(tmp)[key as keyof LoggerTableData] = null;
    }
    setInsertNewData(tmp);
    setLoggerDetailData(data);
    if (data === undefined) setLoggerConfigData(emptyLoggerConfigObj as unknown as LoggerTableData);
  }, [dataStore.selectedLoggerID, selectedLoggerID, dataChanged]);

  const getSensorsForLogger = useCallback(async () => {
    const id = selectedLoggerID && selectedLoggerID > 0 ? selectedLoggerID : dataStore.firstLoggerID;
    const data = await sensorService.findSensorsByLogger(id);
    setSensorData(data);
  }, [dataStore.selectedLoggerID, selectedLoggerID]);

  const getStatusFile = useCallback(async () => {
    const id = selectedLoggerID && selectedLoggerID > 0 ? selectedLoggerID : dataStore.firstLoggerID;
    const data = await statusFileService.getNewestStatusFileByLogger(id);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const positionObj =
      Object.keys(data).length > 0
        ? {
            date: data.deckbox_position_last?.date
              ? new Date(data.deckbox_position_last?.date).toLocaleString("de-DE", options)
              : "no date available",
            lng: data.deckbox_position_last?.lng ? data.deckbox_position_last?.lng : "no longitude available",
            lat: data.deckbox_position_last?.lat ? data.deckbox_position_last?.lat : "no latitude available",
          }
        : {};
    setStatusData({
      ...data,
      ...positionObj,
    });
  }, [dataStore.selectedLoggerID, selectedLoggerID]);

  const getConfigFile = useCallback(async () => {
    const id = selectedLoggerID && selectedLoggerID > 0 ? selectedLoggerID : dataStore.firstLoggerID;
    const data: LoggerConfigTableData = await configFileService.getNewestConfigFile(id);
    setCompleteConfig(data as LoggerConfigFileData);
    const filtered: LoggerConfigTableData = Object.keys(data)
      .filter((key) => loggerConfigTableKeys.includes(key))
      .reduce((result, key) => {
        Object(result)[key] = Object(data)[key];
        return result;
      }, {} as LoggerConfigTableData);

    const configData =
      Object.keys(filtered).length > 0 ? filtered : (emptyLoggerConfigObj as {} as LoggerConfigTableData);

    setInsertNewConfigData(emptyLoggerConfigObj as {} as LoggerConfigTableData);
    const tmp = {
      ...emptyLoggerConfigObj,
      ...configData,
      contact_name: configData.contact_first_name + " " + configData.contact_last_name,
    };
    setLoggerConfigData(tmp as LoggerConfigFileData);
  }, [dataStore.selectedLoggerID, selectedLoggerID, dataChanged]);

  useEffect(() => {
    getSensorsForLogger();
  }, [getSensorsForLogger]);

  useEffect(() => {
    getConfigFile();
  }, [getConfigFile]);

  useEffect(() => {
    getStatusFile();
  }, [getStatusFile]);

  useEffect(() => {
    getLoggerDetailData();
  }, [getLoggerDetailData]);

  const toggleEditMode = () => {
    if (!editableByUser) return;
    dataStore.setWifisForConfig([]);
    setErrors({});
    const val = !editMode;
    setEditMode(val);
    dataStore.setEditing(val);
  };

  const toggleInsertNew = () => {
    if (!editableByUser) return;
    dataStore.setWifisForConfig([]);
    setErrors({});

    const val = !insertNew;
    setInsertNew(val);
    dataStore.setEditing(val);
  };

  const triggerDataChanged = () => {
    setDataChanged(!dataChanged);
  };

  /**
   * Get data based on the provided id ("db" for database, "config" for configuration).
   * @function
   * @param {string} id - The identifier for the data source ("db" or "config").
   * @returns {LoggerTableData | undefined} - The data corresponding to the given id.
   */
  const getData = (id: string) => {
    switch (id) {
      case "db":
        return !insertNew ? loggerDetailData : insertNewData;
      case "config":
        return !insertNew ? loggerConfigData : insertNewConfigData;
      default:
        return;
    }
  };

  /**
   * Handle form submission for database and configuration data.
   * @async
   * @function
   * @param {FieldValues} formData - The form data submitted.
   * @param {object} ref - The reference object for the form.
   * @returns {Promise<boolean>} - A promise resolving to a boolean indicating the success of form submission.
   */
  const onSubmit = async (formData: FieldValues, ref: any) => {
    //id to identify datasource

    const id = ref.target.id;
    const tableData: LoggerTableData = getData(id) as LoggerTableData;

    if (tableData === undefined) {
      return false;
    }

    const wifis = mergeArrays(dataStore.wifisForConfig, (tableData as LoggerConfigTableData).wifi);
    const changed = filterForChangedEntries(formData, tableData as LoggerTableData);

    const merged: LoggerTableData = {
      ...tableData,
      ...Object.fromEntries(changed),
      wifi: wifis,
    };

    //error and validation handling
    const validationErrors = validateData(merged, Tables.Logger);
    const mergedErrors = id !== "config" ? validationErrors : { ...dataStore.validationErrors, ...validationErrors };
    dataStore.setValidationErros(mergedErrors);
    setErrors(mergedErrors);
    if (Object.keys(dataStore.validationErrors).length > 0) {
      return false;
    }

    //build data for changes overview
    const changesOverviewData = buildChangesOverviewData(
      changed,
      id !== "config" ? tableData : ({ ...dataStore.dataForDatabase, ...tableData } as LoggerTableData),
      id,
      dataStore.changedData,
      mergeArrays(dataStore.wifisForConfig, dataStore.existingWifis)
    );

    const changedData = Object.values(changesOverviewData).filter((entry) => {
      const property = Object.keys(entry).toString();

      const valueObj = entry[property];
      if (Array.isArray(valueObj)) {
        const values = Object.values(valueObj);

        const filteredValues = values.filter((value: any) => {
          if (
            property === "wifi" &&
            (dataStore.existingWifis.length !== (tableData as LoggerConfigTableData).wifi?.length ||
              dataStore.wifisForConfig?.length > 0)
          ) {
            return (
              value.pw?.new !== "" ||
              value.pw?.new !== undefined ||
              value.ssid?.new !== "" ||
              value.ssid?.new !== undefined
            );
          }
        });
        return filteredValues.length > 0;
      } else {
        return valueObj?.new !== undefined;
      }
    });

    dataStore.setChangedData(changedData);

    const unchangedData = Object.values(changesOverviewData).filter((entry) => {
      const property = Object.keys(entry).toString();

      const valueObj = entry[property];
      if (Array.isArray(valueObj)) {
        const values = Object.values(valueObj);
        const filteredValues = values.filter((value: any) => {
          if (
            property === "wifi" &&
            (dataStore.existingWifis.length === (tableData as LoggerConfigTableData).wifi?.length ||
              dataStore.wifisForConfig?.length === 0)
          ) {
            return (
              value.pw?.new === "" ||
              value.pw?.new === undefined ||
              value.ssid?.new === "" ||
              value.ssid?.new === undefined
            );
          }
        });

        return filteredValues.length > 0;
      } else {
        return valueObj?.new === undefined;
      }
    });

    dataStore.setChangesOverviewData(unchangedData);

    //Merge data for database use
    if (id === "db" && merged !== undefined) {
      const dataForDatabase: LoggerDBTableData = mergeDataForDatabase(
        merged,
        dataStore.vesselData,
        dataStore.sensorTypeData,
        dataStore.unitData
      ) as LoggerDBTableData;
      dataStore.setDataForDatabase(dataForDatabase);
    }
    //merge data for config files and set overlay visible
    if (id === "config") {
      const mergedConfig: LoggerConfigFileData = {
        ...dataStore.dataForDatabase,
        ...Object.fromEntries(Object.entries(merged).filter(([key, value]) => value !== null)),
      } as LoggerConfigFileData;

      const contact_name = mergedConfig.contact_name?.toString().split(" ");
      const [first_name, last_name] = contact_name || [];

      const deployment_contact_id = dataStore.contactData.find(
        (contact) => contact.first_name === first_name && contact.last_name === last_name
      )?.contact_id;

      //build sensor objects for config
      const sensors = sensorData?.map((sensor) => {
        if (sensor && sensor?.sensor_id) {
          return buildSensorConfigObject(
            {
              ...(sensor as unknown as SensorDBTableData),
              ...completeConfig?.sensors?.find((sensorItem) => sensorItem.sensor_id === sensor.sensor_id),
            },
            dataStore.unitData,
            getCalibrationDataForSensor(dataStore.calibrationData, sensor.sensor_id)
          );
        }
      }) as (SensorDBTableData & SensorConfigTableData)[];

      const obj = {
        ...emptyConfigObj,
        ...mergedConfig,
        contact_first_name: first_name,
        contact_last_name: last_name,
        deployment_contact_id,
        num_sensors: sensors.length,
        wifi: mergeArrays(dataStore.existingWifis, dataStore.wifisForConfig),
      } as LoggerConfigFileData;
      const loggerConfig = buildLoggerConfigData(obj, sensors);
      dataStore.setDataForConfigFile(loggerConfig as LoggerConfigFileData);
      dataStore.setOverlayVisible({ visible: true });
    }
    return true;
  };

  return (
    <div className="flex flex-col ">
      <Toolbar
        text={"Logger ID"}
        data={dataStore.loggerData}
        editMode={editMode}
        defaultValue={dropdownValue}
        toggleEditMode={toggleEditMode}
        toggleInsertNew={toggleInsertNew}
        editableByUser={editableByUser}
        addNew={insertNew}
        refs={[formRefDB, formRefConfig]}
        onSubmit={onSubmit}
      />
      {statusData !== undefined && !editMode && !insertNew && (
        <Headline text={"Overview Status Information"} style="mt-4" />
      )}
      {statusData !== undefined && !editMode && !insertNew && (
        <LoggerTable
          tableData={statusData}
          editableByUser={false}
          editMode={false}
          isNew={false}
          onSubmit={onSubmit}
          editableKeys={[]}
          shownKeys={statusKeys}
          form_id={"status"}
        />
      )}
      {(statusData === undefined || Object.keys(statusData).length === 0) && !editMode && !insertNew && (
        <div className="text-sm text-center bg-danube-200 p-2 rounded">
          No Status information available for logger {selectedLoggerID}{" "}
        </div>
      )}

      {insertNew && insertNewData !== undefined && insertNewConfigData !== undefined && (
        <div className="flex flex-row">
          <div className="flex flex-1  flex-col mr-1">
            <Headline text={"Overview Config Parameters Overview Config Parameters Stored in Database"} style="mt-4" />
            <LoggerTable
              tableData={insertNewData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              errors={errors}
              onSubmit={onSubmit}
              form_id="db"
              formRef={formRefDB}
              editableKeys={loggerKeysForNew}
              shownKeys={loggerKeysForNew}
            />
          </div>
          <div className="flex flex-1  flex-col ml-1">
            <Headline text={"Overview Config Parameters Stored in Database only stored in config files"} style="mt-4" />
            <LoggerTable
              tableData={insertNewConfigData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              errors={errors}
              onSubmit={onSubmit}
              form_id="config"
              formRef={formRefConfig}
              editableKeys={loggerKeysForNew}
              shownKeys={loggerKeysForConfig}
            />
          </div>
        </div>
      )}

      <div className="flex flex-row ">
        {!insertNew && loggerDetailData !== undefined && (
          <div className="flex flex-1  flex-col mr-1">
            <Headline text={"Overview Config Parameters - Stored in Database"} style="mt-4" />
            <LoggerTable
              tableData={loggerDetailData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              errors={errors}
              onSubmit={onSubmit}
              form_id="db"
              formRef={formRefDB}
              editableKeys={loggerKeysForEdit}
              shownKeys={loggerKeysForDB}
            />
          </div>
        )}
        {!insertNew && (
          <div className="flex flex-1 flex-col ml-1">
            <Headline text={"Overview Config Parameters - Only Stored in Config Files"} style="mt-4" />
            <LoggerTable
              tableData={loggerConfigData as LoggerTableData}
              editableByUser={editableByUser}
              editMode={editMode}
              isNew={insertNew}
              errors={errors}
              onSubmit={onSubmit}
              form_id="config"
              formRef={formRefConfig}
              editableKeys={loggerKeysForEdit}
              shownKeys={loggerKeysForConfig}
            />
          </div>
        )}
      </div>

      {sensorData && sensorData?.length > 0 && !editMode && !insertNew && (
        <>
          <Headline text={"Assigned Sensors"} style="mt-4" />
          <Table
            data={sensorData}
            tableKeys={sensorKeys}
            headerData={sensorHeader}
            hasSwitch={false}
            linkedKey={["sensor_id"]}
            defaultSort="sensor_id"
          />
        </>
      )}
      {isVisible && <ChangesOverview addNew={insertNew} triggerDataChanged={triggerDataChanged} type={Tables.Logger} />}
    </div>
  );
};

export default observer(LoggerDetail);
