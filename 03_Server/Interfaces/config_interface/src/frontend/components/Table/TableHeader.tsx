import { useState } from "react";
import Sort from "./Sort";
import { useStore } from "../../../stores";
import { useDetectClickOutside } from "react-detect-click-outside";

export interface TableHeaderProps {
  headerData: { [key: string]: string }[];
  showSwitch?: boolean;
  sort?: (direction: string, column_key: string) => void;
  defaultSort?: string;
}

/**
 * TableHeader component for rendering the header of a table.
 * @param {TableHeaderProps} props - The properties for the TableHeader component.
 * @param {{ [key: string]: string }[]} props.headerData - The data for the table header.
 * @param {boolean} [props.showSwitch] - A flag indicating whether to show the switch in the header.
 * @param {(direction: string, column_key: string) => void} [props.sort] - The function to handle sorting.
 * @param {string} [props.defaultSort] - The default sorting direction.
 * @returns {JSX.Element} - The JSX element representing the TableHeader component.
 */

const TableHeader = ({ headerData, showSwitch, sort, defaultSort }: TableHeaderProps) => {
  const [selected, setSelected] = useState<string>(defaultSort + "_up");
  const { data: dataStore } = useStore();
  const [popUpVisible, setPopUpVisble] = useState<boolean>(false);

  const onArrowUp = (column_key: string) => {
    setSelected(column_key + "_up");
    if (sort) sort("up", column_key);
  };
  const onArrowDown = (column_key: string) => {
    setSelected(column_key + "_down");
    if (sort) sort("down", column_key);
  };
  const hidePopUp = () => {
    setPopUpVisble(false);
  };
  const ref = useDetectClickOutside({ onTriggered: hidePopUp });

  return (
    <div className="flex flex-row bg-danube-800 text-white rounded-t-lg border-b-2 text-sm">
      {headerData.map((header, index) => {
        return (
          <div className="flex flex-row flex-1 items-center  border-white p-2 border-r-2" key={index}>
            <div className="flex-1 text-center"> {Object.values(header)[0]}</div>
            <div className="flex-inital w-4 justify-self-end">
              <Sort
                onArrowUp={onArrowUp}
                onArrowDown={onArrowDown}
                column_key={Object.keys(header)[0]}
                selected={selected}
              />
            </div>
          </div>
        );
      })}
      {showSwitch && (
        <div className="flex flex-row items-center  border-white p-2 ">
          <div className="flex-0 text-center w-12" key={headerData?.length}>
            Show in map
          </div>
          <div
            ref={ref}
            className="relative flex-inital w-2 justify-self-end ml-2 flex flex-col mt-0.5 cursor-pointer"
            onClick={() => {
              setPopUpVisble(!popUpVisible);
            }}
          >
            <div className="rounded-lg w-[3px] h-[3px] bg-white m-px " />
            <div className="rounded-lg w-[3px] h-[3px] bg-white m-px " />
            <div className="rounded-lg w-[3px] h-[3px] bg-white m-px " />
            {popUpVisible && (
              <div className="absolute -top-12 -right-14 text-xs cursor-pointer w-16 text-center">
                <div
                  className="bg-danube-300 p-1 rounded-t-md hover:font-semibold"
                  onClick={() => {
                    const tmp = dataStore.loggerData.map((pos) => pos.logger_id || 0);
                    dataStore.setMapVisiblePosition(tmp);
                  }}
                >
                  Show all
                </div>
                <div
                  className="bg-danube-400 p-1 rounded-br-md hover:font-semibold"
                  onClick={() => dataStore.setMapVisiblePosition([])}
                >
                  Hide all
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHeader;
