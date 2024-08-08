import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { formatCalibrationValue } from "../../utils";

interface InputComponentProps {
  key_string: string;
  register: UseFormRegister<FieldValues>;
  val: any;
  isNew: boolean;
  handleFocus?: (event: { target: { select: () => any } }) => void;
  setValue?: (name: string, value: string) => void;
  style?: string;
  maxLength?: number;
}

/**
 * Input component for rendering input fields.
 * @param {InputComponentProps} props - The properties for the InputComponent.
 * @param {string} props.key_string - The key identifier for the input field.
 * @param {UseFormRegister<FieldValues>} props.register - The registration function from react-hook-form.
 * @param {any} props.val - The value to be displayed in the input field.
 * @param {boolean} props.isNew - A flag indicating whether the input is for a new entry.
 * @param {(event: { target: { select: () => any } }) => void} props.handleFocus - The focus event handler for the input.
 * @param {(name: string, value: string) => void} props.setValue - The function to set a value in the form.
 * @param {string} props.style - The custom styling for the input component.
 * @param {number} props.maxLength - The maximum length allowed for the input value.
 * @returns {JSX.Element} - The JSX element representing the InputComponent.
 */
const InputComponent: React.FC<InputComponentProps> = ({
  key_string,
  register,
  val,
  isNew,
  handleFocus,
  style,
  maxLength,
}) => {
  /**
   * Checks if the input field is for a date.
   * @type {boolean}
   */
  const isDate: boolean = key_string === "date_manufactoring";

  /**
   * Gets the placeholder value for the input field.
   * @returns {string} - The placeholder value.
   */
  const getPlaceholder = () => {
    if (!isNew) {
      if (maxLength && !isNaN(Number(val))) {
        return formatCalibrationValue(Number(val));
      }
      return val !== null && val != undefined ? val : "";
    } else if (isDate) {
      return "yyyy-mm-dd";
    } else return "";
  };

  return (
    <input
      {...register(key_string)}
      onFocus={handleFocus}
      className={
        style
          ? style
          : "w-full h-full bg-transparent flex-auto text-center focus:outline-none placeholder:italic placeholder:text-danube-800 opacity-80 "
      }
      style={{ wordBreak: "break-all", wordWrap: "break-word" }}
      placeholder={getPlaceholder()}
    />
  );
};
export default InputComponent;
