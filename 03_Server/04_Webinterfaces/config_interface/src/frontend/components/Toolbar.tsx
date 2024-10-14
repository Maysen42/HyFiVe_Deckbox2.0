import Dropdown from "./Dropdown/Dropdown";
import Button from "./Button";
import { DropdownData } from "../../backend/types";
import { useStore } from "../../stores";

interface ToolbarProps {
  data: DropdownData;
  text: string;
  editMode: boolean;
  addNew: boolean;
  defaultValue: number;
  toggleInsertNew: () => void;
  toggleEditMode: () => void;
  editableByUser: boolean;
  refs: any[];
  onSubmit: any;
  dropdownMaxWidth?: string;
}

/**
 * Toolbar component for rendering a toolbar with dropdown, buttons, and other controls.
 * @component
 * @param {ToolbarProps} props - The properties for the Toolbar component.
 * @param {DropdownData} props.data - The data for the dropdown.
 * @param {string} props.text - The text to display in the dropdown.
 * @param {boolean} props.editMode - A flag indicating whether the component is in edit mode.
 * @param {boolean} props.addNew - A flag indicating whether to add a new entry.
 * @param {number} props.defaultValue - The default value for the dropdown.
 * @param {function} props.toggleInsertNew - The function to toggle adding a new entry.
 * @param {function} props.toggleEditMode - The function to toggle edit mode.
 * @param {boolean} props.editableByUser - A flag indicating whether the component is editable by the user.
 * @param {any[]} props.refs - An array of refs.
 * @param {function} props.onSubmit - The function to be called on form submission.
 * @param {string} props.dropdownMaxWidth - The maximum width for the dropdown.
 * @returns {JSX.Element} - The JSX element representing the Toolbar component.
 */
const Toolbar = ({
  data,
  text,
  editMode,
  defaultValue,
  toggleInsertNew,
  toggleEditMode,
  editableByUser,
  addNew,
  refs,
  dropdownMaxWidth,
}: ToolbarProps) => {
  const position1 = "ml-4 mr-auto";
  const position2 = "mr-4";
  const { data: dataStore } = useStore();

  return (
    <div className="flex justify-between flex-row">
      <div className="flex  w-full">
        <Dropdown
          text={text}
          data={data}
          disabled={addNew || editMode}
          style={`${dropdownMaxWidth ? dropdownMaxWidth : "max-w-[400px]"} w-full flex-1 mr-2`}
          defaultValue={defaultValue}
        />

        {editableByUser && !addNew && !editMode && (
          <Button
            style={position1}
            text="Create New"
            disabled={!editableByUser}
            button_type="default"
            onClick={toggleInsertNew}
          />
        )}
      </div>
      {editableByUser && (
        <div className="flex justify-between ">
          {(editMode || !addNew) && (
            <Button
              text={!editMode ? "Edit" : "Cancel"}
              disabled={!editableByUser}
              button_type={editMode ? "default" : ""}
              onClick={toggleEditMode}
              style="mr-4"
            />
          )}
          {editMode && (
            <Button
              style={position2}
              text="Reset"
              button_type=""
              onClick={() => {
                dataStore.setNewCalibrationCoefficient([]);
                dataStore.setChangedData([]);
                dataStore.setResetTrigger(!dataStore.resetTrigger);
              }}
            />
          )}
          {addNew && !editMode && <Button style={position2} text="Cancel" button_type="" onClick={toggleInsertNew} />}
          {(editMode || addNew) && (
            <Button
              text={"Deploy"}
              button_type={"default"}
              disabled={!editableByUser}
              onClick={async () => {
                for (const ref of refs) {
                  await new Promise((resolve) => {
                    ref?.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    setTimeout(resolve, 0); //fix for some timing issues
                  });
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
