import { loggerPropertyTitles, sensorPropertyTitles } from "../../../backend/constants";
import { CalibrationCoefficient } from "../../../backend/entities";
import { useStore } from "../../../stores";
import { formatCalibrationValue } from "../../utils";

interface ChangesRowsProps {
  style: string;
}

/**
 * ChangesRows component for displaying changed data rows in logger and sensor configurations.
 * @param {ChangesRowsProps} props - The properties for the ChangesRows component.
 * @param {string} props.style - The style to be applied to the rows.
 * @returns {JSX.Element} - The JSX element representing the ChangesRows component.
 */
const ChangesRows = ({ style }: ChangesRowsProps) => {
  const { data: dataStore } = useStore();

  /**
   * Generates a single row item for the ChangesRows component.
   * @param {string} index - The unique identifier for the row item.
   * @param {string} property - The property associated with the row item.
   * @param {string} oldValue - The old value of the property.
   * @param {string} newValue - The new value of the property.
   * @returns {JSX.Element} - The JSX element representing the row item.
   */
  const rowItem = (index: string, property: string, oldValue: string, newValue: string) => {
    return (
      <div key={index} className="flex flex-row align-items">
        <div className="flex-1 flex text-sm justify-center self-center">
          {(loggerPropertyTitles[property] !== undefined
            ? loggerPropertyTitles[property]
            : property === "coefficient_value"
            ? sensorPropertyTitles[property] + " " + index
            : sensorPropertyTitles[property]) || property}
        </div>
        <div
          className={`${style} rounded-l-lg  self-center`}
          style={{ wordBreak: "break-all", wordWrap: "break-word" }}
        >
          {oldValue !== ""
            ? property !== "coefficient_value"
              ? oldValue
              : formatCalibrationValue(Number(oldValue))
            : "\u00A0"}
        </div>
        <div
          style={{ wordBreak: "break-all", wordWrap: "break-word" }}
          className={`${style} rounded-r-lg  self-center font-semibold h-full`}
        >
          {newValue !== "" ? newValue : "\u00A0"}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex-1 flex-col overflow-y-auto bg-danube-50 shadow w-auto h-auto scrollbar-hide rounded-b-lg z-30 max-h-[170px]">
      {Object.values(dataStore.changedData)?.map((item, index) => {
        const property = Object.keys(item).toString();
        const oldValue =
          item[property]?.old && item[property]?.old !== "undefined undefined" ? item[property]?.old : "";
        const newValue = item[property]?.new ? item[property]?.new : "";
        const valueObj = item[property];

        if (Array.isArray(valueObj)) {
          return Object.values(valueObj).map((val, i) => {
            if ((val as CalibrationCoefficient).coefficient_id_per_sensor_id !== undefined) {
              const oldVal = val.value.old;
              const newVal = val.value.new;
              return rowItem(val.coefficient_id_per_sensor_id, "coefficient_value", oldVal, newVal);
            }
            return Object.keys(val).map((key, i) => {
              const oldVal = val[key].old;
              const newVal = val[key].new;

              return rowItem("array-" + i, key, oldVal, newVal);
            });
          });
        }

        return rowItem("item_" + index, property, oldValue, newValue);
      })}
    </div>
  );
};

export default ChangesRows;
