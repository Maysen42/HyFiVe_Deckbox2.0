import { tableStyleClass } from "../../../backend/constants";

interface TitleColumnPorps {
  text: string;
}
/**
 * TitleColumn component for rendering a title column in a table.
 * @param {TitleColumnProps} props - The properties for the TitleColumn component.
 * @param {string} props.text - The text content of the title column.
 * @returns {JSX.Element} - The JSX element representing the TitleColumn component.
 */
const TitleColumn = ({ text }: TitleColumnPorps) => {
  return (
    <div className={tableStyleClass + " p-2 border-white "} style={{ wordBreak: "break-all", wordWrap: "break-word" }}>
      {text}
    </div>
  );
};

export default TitleColumn;
