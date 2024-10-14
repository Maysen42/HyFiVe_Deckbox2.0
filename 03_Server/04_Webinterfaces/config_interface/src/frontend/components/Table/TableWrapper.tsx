import { FieldValues, SubmitHandler, UseFormHandleSubmit, useForm } from "react-hook-form";
import WifiOverlay from "../overlays/WifiOverlay";
import { LoggerConfigTableData, LoggerTableData, SensorTableData } from "../../../backend/types";
import CoefficientOverview from "../overlays/CoefficientOverview";
import { Tables } from "../../../backend/enums";

interface TableWrapperProps {
  form_id: string;
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
  onSubmit: (formData: FieldValues, ref: any) => Promise<boolean>;
  formRef: any;
  children: any;
  isOverlayVisible: boolean;
  tableData: LoggerTableData | SensorTableData;
  table: Tables;
  isNew: boolean;
  editMode: boolean;
  onClick: (e?: any) => void;
  selectedSensorTypeId: number;
}
/**
 * TableWrapper component for rendering a form wrapper with overlays for Logger and Sensor tables.
 * @param {TableWrapperProps} props - The properties for the TableWrapper component.
 * @param {string} props.form_id - The unique identifier for the form.
 * @param {UseFormHandleSubmit<FieldValues, undefined>} props.handleSubmit - The submit handler from react-hook-form.
 * @param {(formData: FieldValues, ref: any) => Promise<boolean>} props.onSubmit - The function to handle form submission.
 * @param {any} props.formRef - The reference to the form element.
 * @param {React.ReactNode} props.children - The child components within the form.
 * @param {boolean} props.isOverlayVisible - A flag indicating whether an overlay is visible.
 * @param {LoggerTableData | SensorTableData} props.tableData - The data for the Logger or Sensor table.
 * @param {Tables} props.table - The type of table (Logger or Sensor).
 * @param {boolean} props.isNew - A flag indicating whether the entry is new.
 * @param {boolean} props.editMode - A flag indicating whether the form is in edit mode.
 * @param {(e?: any) => void} props.onClick - The function to handle click events.
 * @param {number} props.selectedSensorTypeId - The selected sensor type ID for Sensor tables.
 * @returns {JSX.Element} - The JSX element representing the TableWrapper component.
 */
const TableWrapper = ({
  form_id,
  onSubmit,
  formRef,
  children,
  isOverlayVisible,
  tableData,
  table,
  editMode,
  isNew,
  onClick,
  handleSubmit,
  selectedSensorTypeId,
}: TableWrapperProps) => {
  return (
    <div className="flex flex-col w-full auto my-2 shadow rounded-lg">
      <form className="bg-transparent" onSubmit={handleSubmit(onSubmit)} ref={formRef} id={form_id}>
        {children}
      </form>
      {isOverlayVisible && table === Tables.Logger && (
        <WifiOverlay
          existingWifis={
            form_id === "config" && (tableData as LoggerConfigTableData).wifi
              ? (tableData as LoggerConfigTableData).wifi
              : []
          }
          close={() => onClick(false)}
          editable={isNew || editMode}
        />
      )}
      {isOverlayVisible && table === Tables.Sensor && (
        <CoefficientOverview
          onClick={onClick}
          selectedSensorID={(tableData as SensorTableData).sensor_id}
          newEntry={editMode || isNew}
          sensorType={selectedSensorTypeId}
        />
      )}
    </div>
  );
};
export default TableWrapper;
