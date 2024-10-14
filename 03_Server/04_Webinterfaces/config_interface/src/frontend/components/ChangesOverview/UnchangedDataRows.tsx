import { loggerPropertyTitles, sensorPropertyTitles } from "../../../backend/constants";
import { useStore } from "../../../stores";

interface UnchangedDataRowsProps {
  style: string;
}
/**
 * UnchangedDataRows component for displaying rows of unchanged data in the ChangesOverview component.
 * @param {UnchangedDataRowsProps} props - The properties for the UnchangedDataRows component.
 * @param {string} props.style - The CSS style for the component.
 * @returns {JSX.Element} - The JSX element representing the UnchangedDataRows component.
 */
const UnchangedDataRows = ({ style }: UnchangedDataRowsProps) => {
  const { data: dataStore } = useStore();

  /**
   * Generates a row item for unchanged data.
   * @param {string} index - The index of the row item.
   * @param {string} property - The property associated with the row item.
   * @param {string} oldValue - The old value of the property.
   * @returns {JSX.Element} - The JSX element representing the row item.
   */
  const rowItem = (index: string, property: string, oldValue: string) => {
    return (
      <div key={index} className="flex flex-row">
        <div className="flex-1 text-sm flex justify-center">
          {(loggerPropertyTitles[property] !== undefined
            ? loggerPropertyTitles[property]
            : property === "coefficient_value"
            ? sensorPropertyTitles[property] + " " + index
            : sensorPropertyTitles[property]) || property}
        </div>

        <div className={`${style} w-full rounded-lg`} style={{ wordBreak: "break-all", wordWrap: "break-word" }}>
          {oldValue !== undefined || oldValue !== "" ? oldValue : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col overflow-y-auto bg-danube-50 shadow w-auto h-auto  rounded-b-lg z-30">
      {Object.values(dataStore.changesOverviewData)?.map((item, index) => {
        const property = Object.keys(item).toString();
        const oldValue = item[property]?.old ? item[property]?.old : "";
        const valueObj = item[property];

        if (Array.isArray(valueObj)) {
          return Object.values(valueObj).map((val) => {
            return Object.keys(val).map((key, i) => {
              const oldVal = val[key].old;
              return rowItem("array-" + i, key, oldVal);
            });
          });
        }
        if (oldValue && property !== "contact_first_name" && property !== "contact_last_name")
          return rowItem("item_" + index, property, oldValue);
      })}
    </div>
  );
};

export default UnchangedDataRows;
