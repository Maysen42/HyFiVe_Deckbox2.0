import { tableStyleClass } from "../../../backend/constants";
interface PopUpCellComponentProps {
  onClick: (visible?: boolean) => void;
  text: string;
  editMode: boolean;
  isNew: boolean;
}

/**
 * PopUpCellComponent component for rendering a cell in the table that triggers a popup.
 * @param {PopUpCellComponentProps} props - The properties for the PopUpCellComponent component.
 * @param {function} props.onClick - The function to be called when the cell is clicked.
 * @param {string} props.text - The text content of the cell.
 * @param {boolean} props.editMode - A flag indicating whether the table is in edit mode.
 * @param {boolean} props.isNew - A flag indicating whether the table is displaying new entries.
 * @returns {JSX.Element} - The JSX element representing the PopUpCellComponent component.
 */
const PopUpCellComponent = ({ onClick, text, isNew, editMode }: PopUpCellComponentProps) => {
  return (
    <div className="flex flex-row bg-danube-200 last:rounded-b-lg " key={"wifi"}>
      <div className={tableStyleClass + " px-2 border flex-1 w-full focus-within:border-danube-800 border-danube-50"}>
        {text}
      </div>

      <div
        onClick={() => onClick(true)}
        className={
          tableStyleClass +
          " px-2 border flex-1 w-full focus-within:border-danube-800 border-danube-50 underline p-2 font-semibold hover:font-bold cursor-pointer "
        }
      >
        {editMode || isNew ? "New " + text : text}
      </div>
    </div>
  );
};
export default PopUpCellComponent;
