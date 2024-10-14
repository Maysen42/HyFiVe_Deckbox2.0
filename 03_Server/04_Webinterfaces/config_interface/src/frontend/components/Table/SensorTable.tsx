import { useEffect, useState } from "react";
import { CompareData, SensorTableData, SuggestionData } from "../../../backend/types";
import { useStore } from "../../../stores";
import TitleColumn from "./TitleColumn";
import ValueColumn from "./ValueColumn";
import { dependendKeys, sensorPropertyTitles } from "../../../backend/constants";
import { FieldValues, useForm } from "react-hook-form";
import { getCompareData, getSuggestionData, isEmpty } from "../../utils";
import { observer } from "mobx-react-lite";
import PopUpCellComponent from "./PopUpCellCpmponent";
import TableWrapper from "./TableWrapper";
import { Tables } from "../../../backend/enums";
import ColumnWrapper from "./ColumnWrapper";
import EditableColumns from "./EditableColumns";

interface SensorTableProps {
  tableData: SensorTableData;
  editableByUser: boolean;
  editMode: boolean;
  isNew: boolean;
  form_id: string;
  onSubmit: (formData: FieldValues, ref: any) => Promise<boolean>;
  formRef?: any;
  errors?: { [key: string]: string };
  calibCoeff?: boolean;
  setSelectedLogger?: (logger_id: number) => void;
  editableKeys: string[];
  shownKeys: string[];
}

/**
 * SensorTable component for rendering a table with sensor data.
 * @param {SensorTableProps} props - The properties for the SensorTable component.
 * @param {SensorTableData} props.tableData - The data for the sensor table.
 * @param {boolean} props.editableByUser - A flag indicating whether the user can edit the table.
 * @param {boolean} props.editMode - A flag indicating whether the table is in edit mode.
 * @param {boolean} props.isNew - A flag indicating whether the entry is a new one.
 * @param {string} props.form_id - The form ID for the table.
 * @param {function} props.onSubmit - The function to be called on form submission.
 * @param {any} props.formRef - The reference to the form.
 * @param {object} props.errors - The errors associated with the form fields.
 * @param {boolean} props.calibCoeff - A flag indicating whether calibration coefficients are shown.
 * @param {function} props.setSelectedLogger - The function to set the selected logger.
 * @param {string[]} props.editableKeys - The keys that are editable in the table.
 * @param {string[]} props.shownKeys - The keys to be shown in the table.
 * @returns {JSX.Element} - The JSX element representing the SensorTable component.
 */

const SensorTable = ({
  tableData,
  editMode,
  isNew,
  editableByUser,
  editableKeys,
  form_id,
  shownKeys,
  formRef,
  onSubmit,
  errors,
  calibCoeff,
  setSelectedLogger,
}: SensorTableProps) => {
  const { data: dataStore } = useStore();
  const { register, reset, handleSubmit } = useForm();
  const [selectedValue, setSelectedValue] = useState<{ [key: string]: string }>({});
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const table = Tables.Sensor;

  /**
   * Handler for toggling the coefficient overview visibility.
   */
  const coefficientOverviewHandler = async () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    reset();
    if (tableData?.logger_id && setSelectedLogger) setSelectedLogger(tableData.logger_id);
  }, [editMode, dataStore.resetTrigger]);

  return (
    <TableWrapper
      onClick={coefficientOverviewHandler}
      form_id={form_id}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      isOverlayVisible={isVisible}
      tableData={tableData}
      table={table}
      isNew={isNew}
      editMode={editMode}
      selectedSensorTypeId={
        Number(selectedValue?.["sensor_type_id"])
          ? Number(selectedValue?.["sensor_type_id"])
          : tableData?.sensor_type_id
      }
      formRef={formRef}
    >
      {tableData !== undefined &&
        Object.keys(tableData).map((key) => {
          const visibleKey = shownKeys?.includes(key);
          if (!visibleKey) return;
          const tmp = key === "bus_address" && !isEmpty(tableData.logger_id?.toString());
          const isEditable = editableByUser && (editableKeys.includes(key) || tmp) && (editMode || isNew);
          const val = Object(tableData)[key];
          const title = sensorPropertyTitles[key] !== undefined ? sensorPropertyTitles[key] : key;

          const suggestionKey = dependendKeys[dependendKeys[key]] ? dependendKeys[key] : key;
          const suggestionData: SuggestionData[] = getSuggestionData(suggestionKey, dataStore);
          const compareData: CompareData[] = getCompareData(key, dataStore);
          const isDropdown: boolean = compareData.length > 0;
          const dependendKey = dependendKeys[suggestionKey];

          const dependentKeyMatch = (item: any) =>
            String(Object(item)[dependendKey]) === String(selectedValue[dependendKey]);

          const foundMatchingItem: any =
            suggestionData.find(dependentKeyMatch) ||
            suggestionData.find(
              (item) => String(Object(item)[dependendKey]) === String(Object(tableData)[dependendKey])
            );

          const matchingItem = foundMatchingItem?.[suggestionKey];
          const nestedSuggestion = getSuggestionData(key, dataStore).find(
            (item) => Object(item)[suggestionKey] === matchingItem
          ); //for example unit - unit_id - sensor_type

          const value =
            dependendKey !== undefined
              ? suggestionKey === key
                ? matchingItem
                : Object(nestedSuggestion)?.[key]
              : key !== "date_manufactoring"
              ? val
              : new Date(val).toLocaleDateString("DE-de");

          return (
            <ColumnWrapper column_key={key} key={key}>
              <TitleColumn text={title} />
              {isEditable && (
                <EditableColumns
                  isDropdown={isDropdown}
                  key_string={key}
                  register={register}
                  val={val}
                  isNew={isNew}
                  compareData={compareData}
                  errors={errors}
                  onChange={(e) => {
                    setSelectedValue({ ...selectedValue, [key]: e.target.value });
                    if (key === "logger_id" && setSelectedLogger) setSelectedLogger(Number(e.target.value));
                  }}
                />
              )}
              {!isEditable && <ValueColumn isNew={false} needHighlight={false} value={value} />}
            </ColumnWrapper>
          );
        })}
      {(calibCoeff || (isNew && form_id === "db")) && (
        <PopUpCellComponent
          onClick={coefficientOverviewHandler}
          text={"Calibration Coefficient"}
          editMode={editMode}
          isNew={isNew}
        />
      )}
    </TableWrapper>
  );
};

export default observer(SensorTable);
