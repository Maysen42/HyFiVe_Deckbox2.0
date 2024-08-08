import { useEffect, useState } from "react";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";

interface SwitchProps {
  id: number;
  sorted?: boolean;
  style?: React.CSSProperties;
}

/**
 * Switch component for rendering a toggle switch.
 * @param {SwitchProps} props - The properties for the Switch component.
 * @param {number} props.id - The unique identifier for the switch.
 * @param {boolean} [props.sorted] - A flag indicating whether the data is sorted.
 * @param {React.CSSProperties} [props.style] - The style object for additional styling.
 * @returns {JSX.Element} - The JSX element representing the Switch component.
 */

const Switch = ({ id, sorted, style }: SwitchProps) => {
  const { data: dataStore } = useStore();
  const [trigger, setTrigger] = useState<boolean>(
    dataStore.mapVisiblePosition.find((item) => Number(item) === Number(id)) !== undefined
  );

  useEffect(() => {
    setTrigger(dataStore.mapVisiblePosition.find((item) => Number(item) === Number(id)) !== undefined);
  }, [dataStore.mapVisiblePosition, sorted]);

  const onTrigger = () => {
    if (!trigger) {
      const tmp = dataStore.mapVisiblePosition;
      tmp.push(id);
      dataStore.setMapVisiblePosition(tmp);
    } else {
      dataStore.setMapVisiblePosition(dataStore.mapVisiblePosition.filter((item) => item !== id));
    }
    setTrigger(!trigger);
  };

  return (
    <div className="flex flex-col w-20 items-center py-4 px-2" style={style}>
      <div className="relative" onClick={onTrigger}>
        <div
          className={`relative w-5 h-[0.5rem] drop-shadow-md rounded cursor-pointer duration-300 ${
            trigger ? "bg-danube-700" : "bg-danube-50"
          }`}
        >
          <div
            className={`absolute w-3 h-3  -top-1 -left-1 cursor-pointer rounded-full drop-shadow-md duration-300 ${
              trigger ? "translate-x-4 translate-y-[0.13rem] bg-danube-800" : "translate-y-[0.13rem] bg-white"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(Switch);
