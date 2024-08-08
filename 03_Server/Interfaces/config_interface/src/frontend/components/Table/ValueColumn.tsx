import { tableStyleClass } from "../../../backend/constants";
import ErrorImage from "./ErrorImage";

interface ValueColumnProps {
  isNew: boolean;
  needHighlight: boolean;
  value: string;
  styleClass?: string;
}
/**
 * ValueColumn component for rendering a value column in a table.
 * @param {ValueColumnProps} props - The properties for the ValueColumn component.
 * @param {boolean} props.isNew - A flag indicating whether the value is for a new entry.
 * @param {boolean} props.needHighlight - A flag indicating whether the value needs highlighting.
 * @param {string} props.value - The value to be displayed in the column.
 * @param {string} props.styleClass - Additional CSS class for styling purposes.
 * @returns {JSX.Element} - The JSX element representing the ValueColumn component.
 */
const ValueColumn = ({ isNew, needHighlight, value, styleClass }: ValueColumnProps) => {
  const newLocal = tableStyleClass + " p-2 border-white " + styleClass;
  return (
    <div
      className={`${newLocal} ${needHighlight ? " text-red" : ""} `}
      style={{ wordBreak: "break-all", wordWrap: "break-word" }}
    >
      {!isNew ? value : ""}
      {needHighlight && <ErrorImage />}
    </div>
  );
};

export default ValueColumn;
