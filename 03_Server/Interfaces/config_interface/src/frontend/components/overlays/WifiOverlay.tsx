import { FieldValues, useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { maxWifiEntries } from "../../../backend/constants";
import { Wifi } from "../../../backend/types";
import { useStore } from "../../../stores";
import Button from "../Button";
import Minus from "../Icons/Minus";
import Plus from "../Icons/Plus";
import InputComponent from "../Table/InputComponent";
import OverlayWrapper from "./OverlayWrapper";

interface WifiOverlayProps {
  existingWifis: Wifi[];
  close: () => void;
  editable: boolean;
}

/**
 * WifiOverlay component displays a modal overlay for managing Wi-Fi configurations.
 * @param {WifiOverlayProps} props - The properties for the WifiOverlay component.
 * @param {Wifi[]} props.existingWifis - The existing Wi-Fi configurations.
 * @param {() => void} props.close - Function to close the overlay.
 * @param {boolean} props.editable - Flag indicating if the Wi-Fi configurations are editable.
 * @returns {JSX.Element} - The JSX element representing the WifiOverlay component.
 */
const WifiOverlay = ({ existingWifis, close, editable }: WifiOverlayProps) => {
  const previousCurrentStyle = "h-10 bg-danube-800 text-center text-white mx-1 p-2 font-bold my-2 pt-1 ";
  const comparisionStyle = "flex flex-wrap  p-2 my-1 mx-1 justify-center bg-white shadow";
  const { data: dataStore } = useStore();
  const { register, reset, handleSubmit } = useForm();

  const [newEntries, setNewEntries] = useState<Wifi[]>(dataStore.wifisForConfig ? dataStore.wifisForConfig : []);
  const [changed, setChanged] = useState<boolean>(false);
  const [wifis, setWifis] = useState<Wifi[]>(existingWifis);
  const [errors, setErrors] = useState<string[]>([]);

  // Function to add a new Wi-Fi entry
  const addEntry = () => {
    if (newEntries.length + (!wifis ? 0 : wifis?.length) < maxWifiEntries) {
      newEntries.push({ ssid: "", pw: "" });
      setNewEntries(newEntries);
      setChanged(!changed);
    }
  };

  // Function to remove a new Wi-Fi entry
  const removeEntry = (index: number) => {
    if (newEntries.length + (!wifis ? 0 : wifis?.length) < maxWifiEntries) {
      const tmp = newEntries.filter((entry, entryIndex) => index !== entryIndex);
      setNewEntries(tmp);
      reset();
      setChanged(!changed);
    }
  };

  // Function to remove an existing Wi-Fi entry
  const removeEntryFromExistingWifis = (index: number) => {
    if (newEntries.length + (!wifis ? 0 : wifis?.length) < maxWifiEntries) {
      const tmp = wifis?.filter((entry, entryIndex) => index !== entryIndex);
      setWifis(tmp);
      setChanged(!changed);
      dataStore.setExistingWifis(tmp);
    }
  };

  const handleOK = (formValues: FieldValues) => {
    const errorsKeys = Object.keys(formValues).filter((key) => {
      const tmp = key.split("_");
      const index = Number(tmp?.[1]);
      const key_string = tmp?.[0];
      return formValues[key] === "" && Object(newEntries)[index]?.[key_string] === "";
    });

    setErrors(errorsKeys);
    const entries: Wifi[] = newEntries.map((entry, index) => {
      return {
        ["ssid"]: formValues["ssid_" + index] !== "" ? formValues["ssid_" + index] : entry.ssid,
        ["pw"]: formValues["pw_" + index] !== "" ? formValues["pw_" + index] : entry.pw,
      };
    }) as Wifi[];

    dataStore.setWifisForConfig(entries);
    dataStore.setExistingWifis(wifis);
    if (errorsKeys.length > 0) return false;
    close();
  };

  const handleReset = () => {
    setWifis(existingWifis);
    setNewEntries([]);
    setChanged(!changed);
  };

  return (
    <OverlayWrapper onClick={close} title={"Wifi"}>
      <div className={`relative flex flex-col overflow-y-auto  w-auto h-full rounded-b-lg z-30`}>
        {(wifis?.length > 0 || editable) && (
          <div className="flex flex-row bg-danube-800 shadow w-auto mt-4 my-1 h-12 rounded-t-lg z-30">
            <div className={`${previousCurrentStyle} w-1/2`}>SSID</div>
            <div
              className={`${previousCurrentStyle} w-1/2 text-center
            `}
            >
              Password
            </div>
          </div>
        )}
        {(wifis?.length === 0 || wifis === undefined) && !editable && (
          <div className="flex-1 w-full mt-4 my-1 h-12 rounded-t-lg z-30 text-sm text-center ">
            No wifi config available for this logger, to add wifi config go to edit mode
          </div>
        )}
        {wifis?.map((wifi, index) => {
          return (
            <div className="mb-6" key={index}>
              <div className="flex flex-row relative">
                <div
                  className={`${comparisionStyle} w-1/2 first-child:rounded-br-lg rounded-l-lg `}
                  style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                >
                  {wifi.ssid}
                </div>
                <div
                  style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                  className={`${comparisionStyle}  w-1/2   rounded-r-lg `}
                >
                  {wifi.pw}
                </div>
                <div
                  className="absolute right-1 top-1/2 translate-y-[-50%] cursor-pointer w-6 h-6 mt-0.5"
                  onClick={() => removeEntryFromExistingWifis(index)}
                >
                  {editable && <Minus />}
                </div>
              </div>
            </div>
          );
        })}
        {editable && (
          <div
            className={`cursor-pointer absolute bg-white rounded-xl z-40 left-1/2 translate-x-[-50%]  ${
              newEntries.length + wifis?.length === maxWifiEntries ? "hidden" : ""
            } ${(wifis?.length === 0 || !wifis) && newEntries.length === 0 ? "bottom-0" : "bottom-4 "}`}
            onClick={addEntry}
          >
            <Plus />
          </div>
        )}
        {editable && (
          <form id="wifi" onSubmit={handleSubmit(handleOK)}>
            <div className="flex flex-col ">
              {newEntries.length > 0 &&
                newEntries?.map((entry, index) => {
                  return (
                    <div className="flex flex-row last:mb-6 relative" key={index}>
                      <InputComponent
                        style={`${comparisionStyle}  flex-1 rounded-l-lg text-center focus:outline-danube-800 outline-1 ${
                          errors?.find((error) => error === "ssid_" + String(index)) ? "border border-red" : ""
                        } `}
                        key_string={"ssid_" + String(index)}
                        register={register}
                        val={String(entry.ssid)}
                        isNew={false}
                      />
                      <InputComponent
                        style={`${comparisionStyle}  flex-1 rounded-r-lg text-center focus:outline-danube-800 outline-1 ${
                          errors?.find((error) => error === "pw_" + String(index)) ? "border border-red" : ""
                        } `}
                        key_string={"pw_" + String(index)}
                        register={register}
                        val={String(entry.pw)}
                        isNew={false}
                      />

                      <div
                        className="absolute right-2 top-1/2 translate-y-[-50%] cursor-pointer bg-white"
                        onClick={() => removeEntry(index)}
                      >
                        <Minus />
                      </div>
                    </div>
                  );
                })}
              {newEntries.length + wifis?.length === maxWifiEntries && (
                <div className="flex-1 text-center p-2 text-sm">Max number for wifi entries reached (5)</div>
              )}
            </div>
          </form>
        )}
      </div>
      <div className="flex flex-1 mb-6 justify-end mt-4">
        {editable && <Button text={"Reset"} button_type={""} style="mr-2" onClick={handleReset} />}
        {editable && <Button text={"OK"} button_type={"default"} type="submit" form="wifi" />}
        {!editable && <Button text={"OK"} button_type={"default"} onClick={close} />}
      </div>
    </OverlayWrapper>
  );
};

export default observer(WifiOverlay);
