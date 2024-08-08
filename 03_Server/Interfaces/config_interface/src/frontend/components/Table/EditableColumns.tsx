import { FieldValues, UseFormRegister } from "react-hook-form";
import { DEFAULT_SELECT_VALUE, tableStyleClass } from "../../../backend/constants";
import InputComponent from "./InputComponent";
import SelectComponent from "./SelectComponent";
import ErrorImage from "./ErrorImage";
import { CompareData } from "../../../backend/types";

interface EditableColumnsProps {
  isDropdown: boolean;
  key_string: string;
  register: UseFormRegister<FieldValues>;
  val: string;
  isNew: boolean;
  errors?: { [key: string]: string };
  setValue?: (name: string, value: string) => void;
  compareData: CompareData[];
  onChange?: (e?: any) => void;
}

/**
 * EditableColumns component renders an editable input or dropdown for table columns.
 * @param {EditableColumnsProps} props - The properties for the EditableColumns component.
 * @param {boolean} props.isDropdown - A flag indicating whether the column is a dropdown.
 * @param {string} props.key_string - The unique key string for the column.
 * @param {UseFormRegister<FieldValues>} props.register - The form registration function from react-hook-form.
 * @param {string} props.val - The current value of the column.
 * @param {boolean} props.isNew - A flag indicating whether the column is a new entry.
 * @param {object} props.errors - An object containing error information for the column.
 * @param {function} props.setValue - The function to set the value in the form.
 * @param {CompareData[]} props.compareData - Data for comparison in the dropdown (if applicable).
 * @param {function} props.onChange - The change event handler for the component.
 * @returns {JSX.Element} - The JSX element representing the EditableColumns component.
 */
const EditableColumns = ({
  isDropdown,
  key_string,
  register,
  val,
  isNew,
  setValue,
  compareData,
  errors,
  onChange,
}: EditableColumnsProps) => {
  return (
    <div className={tableStyleClass + " px-2 border flex-1 w-full focus-within:border-danube-800 border-danube-50"}>
      {!isDropdown && (
        <InputComponent key_string={key_string} register={register} val={val} isNew={isNew} setValue={setValue} />
      )}
      {isDropdown && (
        <SelectComponent
          key_string={key_string}
          register={register}
          val={val}
          compareData={compareData}
          isNew={isNew}
          DEFAULT_SELECT_VALUE={DEFAULT_SELECT_VALUE}
          onChange={onChange?.call ? onChange : undefined}
        />
      )}
      {errors && errors[key_string] && <ErrorImage error_id={errors[key_string]} />}
    </div>
  );
};

export default EditableColumns;
