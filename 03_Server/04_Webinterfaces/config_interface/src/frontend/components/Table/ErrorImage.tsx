import { useState } from "react";
import { errorText } from "../../../backend/constants";

interface ErrorImageProps {
  error_id?: string;
  data?: any[];
  style?: string;
}
/**
 * ErrorImage component displays an error icon with a tooltip containing the error text.
 * @param {ErrorImageProps} props - The properties for the ErrorImage component.
 * @param {string} props.error_id - The identifier for the error, used to fetch error text.
 * @param {any[]} props.data - Additional data (unused in the current implementation).
 * @param {string} props.style - Custom styles for the ErrorImage component.
 * @returns {JSX.Element} - The JSX element representing the ErrorImage component.
 */
const ErrorImage = ({ error_id: error_id, style }: ErrorImageProps) => {
  const [hoverVisible, setHoverVisible] = useState(false);
  const handleHover = (visible: boolean) => {
    setHoverVisible(visible);
  };

  const error = error_id ? errorText[error_id] : "";

  return (
    <div className={style ? style : "relative"}>
      <img
        src="assets/error-svgrepo-com.png"
        onMouseOver={() => {
          handleHover(true);
        }}
        onMouseOut={() => {
          handleHover(false);
        }}
        alt="Error Icon"
        className={"w-4 h-4 flex ml-1"}
      />
      {error_id && hoverVisible && (
        <div className="absolute right-0 text-[10px] bg-red text-white w-40 rounded-lg p-1">{error}</div>
      )}
    </div>
  );
};

export default ErrorImage;
