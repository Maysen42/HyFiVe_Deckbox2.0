import { useEffect, useState } from "react";
import { CompareData, LoggerTableData, SuggestionData } from "../../../backend/types";
import { useStore } from "../../../stores";
import TitleColumn from "./TitleColumn";
import ValueColumn from "./ValueColumn";
import { loggerPropertyTitles, dependendKeys } from "../../../backend/constants";
import { FieldValues, useForm } from "react-hook-form";
import { getCompareData, getSuggestionData, highlightNeeded, isHighlightParameter } from "../../utils";
import { observer } from "mobx-react-lite";
import PopUpCellComponent from "./PopUpCellCpmponent";
import TableWrapper from "./TableWrapper";
import { Tables } from "../../../backend/enums";
import ColumnWrapper from "./ColumnWrapper";
import EditableColumns from "./EditableColumns";

interface LoggerTableProps {
  tableData: LoggerTableData;
  editableByUser: boolean;
  editMode: boolean;
  isNew: boolean;
  errors?: { [key: string]: string };
  onSubmit: (formData: FieldValues, ref: any) => Promise<boolean>;
  formRef?: any;
  form_id: string;
  editableKeys: string[];
  shownKeys: string[];
}

/**
 * LoggerTable component for rendering logger-related table data.
 * @param {LoggerTableProps} props - The properties for the LoggerTable component.
 * @param {LoggerTableData} props.tableData - The data for the logger table.
 * @param {boolean} props.editableByUser - A flag indicating whether the table is editable by the user.
 * @param {boolean} props.editMode - A flag indicating whether the table is in edit mode.
 * @param {boolean} props.isNew - A flag indicating whether the table represents a new entry.
 * @param {{ [key: string]: string }} props.errors - Error data for the table entries.
 * @param {(formData: FieldValues, ref: any) => Promise<boolean>} props.onSubmit - The function to handle form submission.
 * @param {any} props.formRef - Reference to the form used in the component.
 * @param {string} props.form_id - The identifier for the form.
 * @param {string[]} props.editableKeys - An array of keys that are editable.
 * @param {string[]} props.shownKeys - An array of keys to be displayed in the table.
 * @returns {JSX.Element} - The JSX element representing the LoggerTable component.
 */
const LoggerTable = ({
  tableData,
  editMode,
  isNew,
  editableByUser,
  errors,
  onSubmit,
  formRef,
  form_id,
  editableKeys,
  shownKeys,
}: LoggerTableProps) => {
  const { data: dataStore } = useStore();
  const { register, setValue, reset, handleSubmit } = useForm();
  const [isOverlayVisible, setOverlayVisible] = useState<boolean>(false);
  const table = Tables.Logger;

  /**
   * Effect to reset the form when editMode or resetTrigger changes.
   */
  useEffect(() => {
    reset();
  }, [editMode, dataStore.resetTrigger]);

  return (
    <TableWrapper
      onClick={(visible) => setOverlayVisible(visible ? visible : false)}
      form_id={form_id}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      isOverlayVisible={isOverlayVisible}
      tableData={tableData}
      table={table}
      isNew={isNew}
      editMode={editMode}
      selectedSensorTypeId={0}
      formRef={formRef}
    >
      {tableData &&
        Object.keys(tableData).map((key) => {
          const visibleKey = shownKeys?.includes(key);
          if (!visibleKey) return;

          const val = Object(tableData)[key];
          const dependentKey = dependendKeys[key];
          const suggestionData: SuggestionData[] = getSuggestionData(key, dataStore);
          const compareData: CompareData[] = getCompareData(key, dataStore);
          const isDropdown: boolean = compareData.length > 0;
          const title = loggerPropertyTitles[key] !== undefined ? loggerPropertyTitles[key] : key;
          const isEditable = editableByUser && editableKeys.includes(key) && (editMode || isNew);
          const value =
            dependentKey !== undefined && Object.keys(tableData).includes(dependentKey)
              ? suggestionData.map((item) => {
                  return Object(item)[key] === Object(tableData)[dependentKey];
                })
              : key === "contact_name" && val === "undefined undefined"
              ? ""
              : val;
          const needHighlight = highlightNeeded(key, value);

          return (
            <ColumnWrapper key={key} column_key={key}>
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
                  setValue={setValue}
                />
              )}
              {!isEditable && (
                <ValueColumn
                  isNew={false}
                  needHighlight={needHighlight}
                  value={isHighlightParameter(key) && value !== undefined ? value?.toString() + "%" : value?.toString()}
                />
              )}
            </ColumnWrapper>
          );
        })}
      {form_id === "config" && (
        <PopUpCellComponent
          onClick={(visible) => setOverlayVisible(visible ? visible : false)}
          text={"Wifi"}
          editMode={editMode}
          isNew={isNew}
        />
      )}
    </TableWrapper>
  );
};

export default observer(LoggerTable);
