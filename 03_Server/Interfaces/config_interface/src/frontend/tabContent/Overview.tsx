import { HoverInfo, LoggerConfigData, Status } from "../../../src/backend/types";
import { useCallback, useEffect, useState } from "react";
import ThuenenMap from "../components/Map";
import Table from "../components/Table";
import { LoggerService } from "../services/database/LoggerService";
import Headline from "../components/Headline";
import Divider from "../components/Table/Divider";
import { CombinedLoggerData } from "../../backend/services/database/LoggerService";

import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { mergeData, mergePositionData } from "../utils";
import { loggerHeader, loggerKeys } from "../../backend/constants";

/**
 * Overview component responsible for displaying a summary of logger data and their last positions on the map.
 * It fetches data from the logger service and observes changes in the data store.
 * @component
 * @returns {JSX.Element} - The JSX element representing the Overview component.
 */
const Overview = () => {
  const loggerService: LoggerService = new LoggerService();

  const [loggerData, setLoggerData] = useState<CombinedLoggerData[]>([]);
  const [statusPositionData, setStatusPositionData] = useState<(Status & HoverInfo)[]>([]);
  const [loggerConfigData, setLoggerConfigData] = useState<LoggerConfigData[]>([]);
  const { data: dataStore } = useStore();

  /**
   * Fetch combined logger data from the service and set it to the state.
   * @function
   * @callback
   */
  const getLoggerData = useCallback(async () => {
    const data = await loggerService.getCombindedLoggerData();
    const firstItem: CombinedLoggerData = data[0];
    dataStore.setFirstLoggerID(firstItem.logger_id ? firstItem.logger_id : 0);
    setLoggerData(data);
  }, []);

  // Effect to update status and position data when the list of visible loggers changes
  useEffect(() => {
    const newStatus = dataStore.statusPositionData.filter((data) =>
      dataStore.mapVisiblePosition.includes(Number(data.logger_id))
    );
    const merged = mergePositionData(newStatus, loggerData) as unknown as (Status & HoverInfo)[];
    setStatusPositionData(merged);
  }, [dataStore.mapVisiblePosition.length]);

  // Effect to update status and position data when there's a change in the original statusPositionData
  useEffect(() => {
    const merged = mergePositionData(dataStore.statusPositionData, loggerData) as unknown as (Status & HoverInfo)[];
    setStatusPositionData(merged);
  }, [dataStore.statusPositionData, loggerData]);

  // Effect to update logger configuration data when there's a change in statusPositionData or loggerData
  useEffect(() => {
    const merged = mergeData(dataStore.statusPositionData, loggerData);
    setLoggerConfigData(merged);
  }, [statusPositionData, loggerData]);

  // Initial fetch of logger data
  useEffect(() => {
    getLoggerData();
  }, [getLoggerData]);

  return (
    <div className="flex flex-col">
      <Headline text={"Overview Loggers"} />
      <Table
        data={loggerConfigData}
        tableKeys={loggerKeys}
        headerData={loggerHeader}
        hasSwitch={true}
        linkedKey={["logger_id"]}
        defaultSort="logger_id"
      />
      <Divider />
      <Headline text={"Last Position of loggers and deckboxes"} />
      <ThuenenMap data={statusPositionData} />
    </div>
  );
};

export default observer(Overview);
