import { MouseEventHandler } from "react";

interface ClosedFrameProps {
  disabled: boolean | undefined;
  onClick: MouseEventHandler;
  isOpen: boolean;
  arrowOpen: string;
  arrowClose: string;
  children: React.ReactNode;
  text: string | undefined;
}

/**
 * ClosedFrame component for displaying a closed frame for our dropdown component with optional text, children, and arrow icon.
 * @param {ClosedFrameProps} props - The properties for the ClosedFrame component.
 * @param {boolean | undefined} props.disabled - A flag indicating whether the ClosedFrame is disabled.
 * @param {MouseEventHandler} props.onClick - The click event handler for the ClosedFrame.
 * @param {boolean} props.isOpen - A flag indicating whether the frame is open.
 * @param {string} props.arrowOpen - The CSS class for the open arrow icon.
 * @param {string} props.arrowClose - The CSS class for the closed arrow icon.
 * @param {React.ReactNode} props.children - The content to be displayed inside the ClosedFrame.
 * @param {string | undefined} props.text - The optional text to be displayed in the frame.
 * @returns {JSX.Element} - The JSX element representing the ClosedFrame component.
 */
const ClosedFrame = ({ disabled, onClick, isOpen, arrowOpen, arrowClose, children, text }: ClosedFrameProps) => {
  return disabled ? (
    <div
      className={`h-11 border-2 border-danube-500 bg-danube-100 text-danube-500 opacity-50 rounded-xl select-none flex-0 py-2 shadow`}
    >
      <div className="absolute top-0 pl-2 text-[10px] left-0 ">{text}</div>
      <div className={`px-2 text-lg `}>{children}</div>
    </div>
  ) : (
    <div
      onClick={onClick}
      className={`py-2 py-2 text-left h-11 border-2 border-danube-500 text-danube-500  select-none cursor-pointer flex-0 ${
        isOpen ? "bg-white  rounded-t-xl" : "shadow bg-danube-100 hover:bg-danube-50 rounded-xl"
      }`}
    >
      <div className="absolute top-0 pl-2 text-[10px] left-0 inline-block">{text}</div>
      <div className={`py-1 px-2 text-lg`}>{children}</div>
      <div
        className={`absolute right-2 w-0 h-0 border-b-[7px] border-l-[7px] border-r-[7px] border-t-[7px] ${
          isOpen ? arrowOpen : arrowClose
        }`}
      />
    </div>
  );
};

export default ClosedFrame;
