import { MouseEventHandler, useState } from "react";

interface ButtonProps {
  text: string;
  style?: string;
  button_type: string;
  form?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler;
  id?: string;
}

/**
 * Button component for rendering a button in the UI.
 * @param {ButtonProps} props - The properties for the Button component.
 * @param {string} props.text - The text to be displayed on the button.
 * @param {string} props.style - Additional CSS style for styling purposes.
 * @param {string} props.button_type - The type of the button ("default" or "secondary").
 * @param {boolean} props.disabled - A flag indicating whether the button is disabled.
 * @param {("button" | "submit" | "reset")} props.type - The type of the button element.
 * @param {MouseEventHandler} props.onClick - The function to be called when the button is clicked.
 * @param {string} props.form - The form to associate the button with.
 * @param {string} props.id - The HTML ID attribute for the button.
 * @returns {JSX.Element} - The JSX element representing the Button component.
 */
const Button = ({ text, style, button_type, disabled, type, onClick, form, id }: ButtonProps) => {
  return disabled ? (
    <button
      id={id}
      onClick={onClick}
      type={type}
      className={`${
        button_type === "default"
          ? "bg-danube-700 py-[0.63rem] text-danube-100"
          : "bg-white py-2 text-danube-700 border-2 border-danube-700"
      } opacity-50 px-8 rounded-xl shadow font-semibold cursor-default flex-initial ${style} hover:font-bold`}
    >
      {text}
    </button>
  ) : (
    <button
      id={id}
      form={form}
      onClick={onClick}
      type={type}
      className={`${
        button_type === "default"
          ? "bg-danube-500 hover:bg-danube-700 py-[0.63rem] text-white"
          : "bg-white py-2 hover:bg-danube-100 text-danube-700 border-2 border-danube-700"
      } px-8 rounded-xl shadow font-semibold flex-initial ${style} hover:font-bold`}
    >
      {text}
    </button>
  );
};

export default Button;
