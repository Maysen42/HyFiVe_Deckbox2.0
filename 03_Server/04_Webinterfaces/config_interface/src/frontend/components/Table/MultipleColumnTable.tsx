import Switch from "./Switch";
import { TabIndizes } from "../../tabContent";
import { useStore } from "../../../stores";
import { Status, TableData, TableKey, isLogger, isSensor } from "../../../backend/types";
import { useEffect } from "react";
import { highlightNeeded, isHighlightParameter } from "../../utils";

export interface ColumnProps {
  data: TableData[];
  tableKeys?: TableKey[];
  hasSwitch?: boolean;
  linkedKey?: string[];
  sorted?: boolean;
}

/**
 * MultipleColumnTable component for rendering a table with multiple columns.
 * @param {ColumnProps} props - The properties for the MultipleColumnTable component.
 * @param {TableData[]} props.data - The data to be displayed in the table.
 * @param {TableKey[]} props.tableKeys - An array of keys representing the columns of the table.
 * @param {boolean} props.hasSwitch - A flag indicating whether the table has a switch column.
 * @param {string[]} props.linkedKey - An array of keys representing linked columns.
 * @param {boolean} props.sorted - A flag indicating whether the table is sorted.
 * @returns {JSX.Element} - The JSX element representing the MultipleColumnTable component.
 */
const MultipleColumnTable = ({ data, tableKeys, hasSwitch, linkedKey, sorted }: ColumnProps) => {
  const { data: dataStore } = useStore();

  /**
   * Function to link to the detail page based on the provided object and value.
   * @param {string} object - The object for which the detail page is to be opened.
   * @param {TableData} value - The value representing the specific row in the table.
   * @returns {void}
   */
  const linkToDetail = (object: string, value: TableData) => {
    dataStore.setActiveTab(TabIndizes[object as keyof TabIndizes]);

    if (isLogger(data[0])) dataStore.setSelectedLoggerID(Number(value));
    if (isSensor(data[0])) dataStore.setSelectedSensorID(Number(value));
  };

  /**
   * Effect to set the map visible positions when the component mounts.
   */
  useEffect(() => {
    dataStore.setMapVisiblePosition(dataStore.loggerData.map((item) => Number(item.logger_id)));
  }, []);

  /**
   * Function to determine the style of a cell based on linked keys and the need for highlighting.
   * @param {boolean} isLinkedKey - A flag indicating whether the key is linked.
   * @param {boolean} needHighlight - A flag indicating whether highlighting is needed for the cell.
   * @returns {string} - The CSS class for the cell style.
   */
  const getCellStyle = (isLinkedKey: boolean, needHighlight: boolean) => {
    if (isLinkedKey)
      return "flex flex-col flex-1 items-center font-bold underline cursor-pointer border-white p-2 border-r-2";
    if (needHighlight) return "flex flex-col flex-1 items-center border-white p-2 border-r-2 text-red";
    return "flex flex-col flex-1 items-center border-white p-2 border-r-2";
  };
  return (
    <div className="max-h-96 overflow-auto scrollbar-hide">
      {data?.map((item: TableData, index: number) => {
        const hasStatusData = dataStore.statusPositionData.some(
          (statusObj: Status) => statusObj.logger_id === item.logger_id
        );
        const validPositions = dataStore.statusPositionData.some(
          (statusObj: Status) => statusObj.logger_id === item.logger_id && statusObj.lng && statusObj.lat
        );

        return (
          <div
            className="flex flex-row odd:bg-danube-200 even:bg-danube-100 last:rounded-b-lg border-t-2 border-white"
            key={index}
          >
            {tableKeys?.map((key: TableKey) => {
              const value: TableData = Object(item)[key as string];
              const isLinkedKey: boolean =
                linkedKey !== undefined &&
                linkedKey?.length > 0 &&
                linkedKey?.find((linked) => linked === key) !== undefined;
              const needHighlight = highlightNeeded(key, value?.toString());

              return (
                <div
                  key={key as string}
                  className={getCellStyle(isLinkedKey, needHighlight)}
                  onClick={isLinkedKey ? () => linkToDetail(key as string, value) : () => {}}
                >
                  <div
                    className="flex-row flex items-center"
                    style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                  >
                    {isHighlightParameter(key) && value !== undefined ? value?.toString() + "%" : value?.toString()}
                    {needHighlight && (
                      <img src="assets/error-svgrepo-com.png" alt="Error Icon" className={"w-4 h-4 flex ml-1"} />
                    )}
                  </div>
                </div>
              );
            })}
            {hasSwitch && validPositions && <Switch id={item.logger_id} sorted={sorted} />}
            {hasSwitch && !validPositions && hasStatusData && (
              <div className="w-20 text-center p-1  text-xs text-red">
                no valid position data, check status for <label className="font-semibold">lng or lat</label>
              </div>
            )}
            {hasSwitch && !validPositions && !hasStatusData && (
              <div className="flex flex-col w-20 items-center py-4 px-2"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default MultipleColumnTable;
