import React from "react";
import { CompareData } from "../../../backend/types";
interface SelectComponentProps {
  key_string: string;
  register: any;
  val: any;
  compareData: CompareData[];
  isNew: boolean;
  DEFAULT_SELECT_VALUE: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * SelectComponent component for rendering a select input in the form.
 * @param {SelectComponentProps} props - The properties for the SelectComponent component.
 * @param {string} props.key_string - The key string for the select input.
 * @param {any} props.register - The register function from react-hook-form.
 * @param {any} props.val - The value of the select input.
 * @param {CompareData[]} props.compareData - The array of compare data to populate the select options.
 * @param {boolean} props.isNew - A flag indicating whether the form is for a new entry.
 * @param {number} props.DEFAULT_SELECT_VALUE - The default value for the select input.
 * @param {function} props.onChange - The function to be called when the select input value changes.
 * @returns {JSX.Element} - The JSX element representing the SelectComponent component.
 */

const SelectComponent = ({
  key_string,
  register,
  val,
  compareData,
  DEFAULT_SELECT_VALUE,
  onChange,
}: SelectComponentProps) => {
  return (
    <select
      {...register(key_string)}
      defaultValue={val !== null ? val : DEFAULT_SELECT_VALUE}
      className="w-full h-full bg-transparent text-center focus:outline-none placeholder:italic placeholder:text-danube-800 opacity-80 "
      style={{ wordBreak: "break-all", wordWrap: "break-word" }}
      onChange={onChange}
    >
      <option key={DEFAULT_SELECT_VALUE} value={DEFAULT_SELECT_VALUE}></option>
      {compareData.map((item, index) => {
        if (key_string === "sensor_type_id")
          return (
            <option key={index + "_" + Object(item)[key_string]} value={Object(item)[key_string]}>
              {Object(item)[key_string] +
                " : " +
                Object(item)["manufacturer"] +
                " : " +
                Object(item)["parameter"] +
                " : " +
                Object(item)["model"]}
            </option>
          );
        if (key_string === "logger_id")
          return (
            <option key={index + "_" + Object(item)[key_string]} value={Object(item)[key_string]}>
              {Object(item)[key_string] + (Object(item)["Comment"] !== null ? " : " + Object(item)["Comment"] : "")}
            </option>
          );
        if (key_string === "contact_name") {
          return (
            <option key={index + "_" + Object(item)[key_string]} value={Object(item)[key_string]}>
              {Object(item)["first_name"] + " " + Object(item)["last_name"]}
            </option>
          );
        } else {
          return (
            <option value={Object(item)[key_string]} key={index + "_" + Object(item)[key_string]}>
              {Object(item)[key_string]}
            </option>
          );
        }
      })}
    </select>
  );
};

export default SelectComponent;
