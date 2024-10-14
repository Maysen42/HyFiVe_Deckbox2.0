import { Logger, Platform } from "../../../backend/entities";
import { Sensor } from "../../../backend/entities";
import { DropdownData, Status, isLogger, isSensor, isStatus } from "../../../backend/types";
import { useEffect, useState } from "react";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";
import ClosedFrame from "./ClosedFrame";
import { useDetectClickOutside } from "react-detect-click-outside";
interface DropdownProps {
  text?: string;
  style?: string;
  data?: DropdownData;
  hasFly?: any;
  disabled?: boolean;
  currentLoggerData?: number;
  currentSensorData?: number;
  defaultValue?: number;
}
/**
 * Dropdown component for creating a reusable dropdown with the ability to select items.
 * @param {DropdownProps} props - The properties for the Dropdown component.
 * @param {string} props.text - The optional text to be displayed in the dropdown.
 * @param {string} props.style - Additional CSS styles for the dropdown.
 * @param {DropdownData} props.data - The data to be displayed in the dropdown.
 * @param {any} props.hasFly - A callback function to be triggered on a specific action.
 * @param {boolean} props.disabled - A flag indicating whether the dropdown is disabled.
 * @param {number} props.currentLoggerData - The current logger data.
 * @param {number} props.currentSensorData - The current sensor data.
 * @param {number} props.defaultValue - The default value for the dropdown.
 * @returns {JSX.Element} - The JSX element representing the Dropdown component.
 */
const Dropdown = ({ text, data, disabled, hasFly, style, defaultValue }: DropdownProps) => {
  const [id, setId] = useState<number | null | string>(String(defaultValue));
  const [isOpen, setIsOpen] = useState(false);
  const { data: dataStore } = useStore();

  // Close dropdown when clicking outside
  const closeDropDown = () => {
    setIsOpen(false);
  };
  const ref = useDetectClickOutside({ onTriggered: closeDropDown });

  // Toggle dropdown visibility
  const onClickDropdownHandler = () => {
    setIsOpen(!isOpen);
  };

  // Handle item selection
  const selectID = (id: number) => {
    setId(id);
    closeDropDown();
    if (isLogger(data?.[0])) {
      return dataStore.setSelectedLoggerID(id);
    }
    if (isSensor(data?.[0])) {
      return dataStore.setSelectedSensorID(id);
    }
  };
  // Update selected ID when dataStore's selectedID changes
  useEffect(() => {
    setId(dataStore.selectedID);
  }, [dataStore.selectedID]);
  const arrowOpen = "top-3 border-l-white border-r-white border-t-white border-b-danube-500 ";
  const arrowClose = "top-5 border-l-transparent border-r-transparent border-b-transparent border-t-danube-500 ";

  return (
    <div className={`${style} relative flex flex-col`} ref={ref}>
      <ClosedFrame
        disabled={disabled}
        onClick={onClickDropdownHandler}
        isOpen={isOpen}
        arrowOpen={arrowOpen}
        arrowClose={arrowClose}
        text={text}
      >
        {id && typeof id !== "string" && text !== "Status position" ? (
          <div className="divide-x-2 divide-danube-300 flex flex-1 justify-center">
            <div className="flex flex-1 px-3">
              Selected: <b> {"\u00A0" + id}</b>
            </div>
          </div>
        ) : id && id !== "undefined" && id !== "Show all positions" && text !== "Status position" ? (
          <div className="divide-x-2 divide-danube-300 flex flex-1 justify-center">
            <div className="flex flex-1 px-3">
              Selected: <b> {"\u00A0" + id}</b>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 px-3 ">Show all positions</div>
        )}
      </ClosedFrame>
      {isOpen && (
        <div className="relative">
          <div
            className={
              "absolute w-1/4 left-0 overflow-auto  max-h-96 bg-danube-200 shadow rounded-b-lg inline-block z-10 text-danube-500 divide-y-2 divide-white select-none cursor-pointer " +
              style
            }
          >
            {hasFly && (
              <div
                className="px-2 py-2 text-left odd:bg-danube-100 odd:opacity-80  last:rounded-b-lg hover:font-semibold"
                onClick={() => {
                  hasFly();
                  setId("Show all positions");
                  closeDropDown();
                }}
              >
                Show all positions
              </div>
            )}
            {data?.map((dataItem: DropdownProps, index: number) => {
              const status = isStatus(dataItem);
              const statusObj = dataItem as Status;
              const validPositions = statusObj.lng && statusObj.lat;
              const ID = (dataItem as Sensor)?.sensor_id | (dataItem as Logger)?.logger_id;
              const loggerComment = (dataItem as Logger)?.Comment;
              const sensorAdditonalData = dataStore.sensorTypeData.filter(
                (data) => data.sensor_type_id === (dataItem as Sensor)?.sensor_type_id
              );
              if (status && !validPositions) return;
              return (
                <div
                  key={index}
                  className={`px-2 py-2 text-left odd:bg-danube-100 odd:opacity-80 even:bg-danube-200  last:rounded-b-lg hover:font-semibold ${
                    !status && !validPositions ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={() => {
                    if (status) {
                      if (validPositions) {
                        hasFly(dataItem);
                        setId("Logger " + ID);
                        closeDropDown();
                      }
                    } else {
                      selectID(ID);
                    }
                  }}
                >
                  {status && validPositions && `Logger ${ID}`}
                  {!status && text === "Logger ID" && (
                    <div className="divide-x-2 divide-danube-300 flex flex-1">
                      <div className="flex basis-1/6 justify-center">{ID}</div>
                      <div className="flex flex-1 basis-5/6 justify-center"> {loggerComment}</div>
                    </div>
                  )}
                  {!status && text === "Sensor ID" && (
                    <div className="divide-x-2 divide-danube-300 flex flex-1">
                      <div className="flex basis-1/6 justify-center">{ID}</div>
                      {sensorAdditonalData.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="divide-x-2 basis-5/6 divide-danube-300 flex flex-1 justify-center"
                          >
                            <div
                              className="flex  basis-1/3 justify-center px-2"
                              style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                            >
                              {item.manufacturer}
                            </div>
                            <div
                              style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                              className="flex  basis-1/3 justify-center px-2"
                            >
                              {item.parameter}
                            </div>
                            <div
                              style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                              className="flex  basis-1/3 justify-center px-2"
                            >
                              {item.model}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default observer(Dropdown);
