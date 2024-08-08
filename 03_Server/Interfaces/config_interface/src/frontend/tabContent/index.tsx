import { observer } from "mobx-react-lite";
import LoggerDetail from "./LoggerDetail";
import Overview from "./Overview";
import SensorDetail from "./SensorDetail";
import { useStore } from "../../stores";

export type TabIndizes = {
  overview: number;
  logger_id: number;
  sensor_id: number;
};
export const TabIndizes: TabIndizes = {
  overview: 0,
  logger_id: 1,
  sensor_id: 2,
};

/**
 * TabContent component responsible for rendering different tab content based on the active tab.
 * It observes changes in the data store.
 * @component
 * @returns {JSX.Element} - The JSX element representing the TabContent component.
 */
const TabContent = () => {
  const { data: dataStore } = useStore();

  dataStore.setChangedData([]);
  switch (dataStore.activeTab) {
    case TabIndizes.overview:
    default:
      return <Overview />;
    case TabIndizes.logger_id:
      return <LoggerDetail selectedLoggerID={dataStore.selectedLoggerID} />;
    case TabIndizes.sensor_id:
      return <SensorDetail selectedSensorID={dataStore.selectedSensorID} />;
  }
};
export default observer(TabContent);
