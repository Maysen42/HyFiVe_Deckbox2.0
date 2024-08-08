import Close from "../Icons/Close";

interface OverlayWrapperProps {
  children: any;
  onClick: (e?: any) => void;
  title: string;
}

/**
 * OverlayWrapper component for creating a modal-like overlay with a title, content, and close button.
 * @param {OverlayWrapperProps} props - The properties for the OverlayWrapper component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the overlay.
 * @param {Function} props.onClick - The click event handler for closing the overlay.
 * @param {string} props.title - The title of the overlay.
 * @returns {JSX.Element} - The JSX element representing the OverlayWrapper component.
 */
const OverlayWrapper = ({ children, onClick, title }: OverlayWrapperProps) => {
  return (
    <>
      <div className="fixed bg-black w-screen top-0 h-screen right-0 z-60 opacity-40" />
      <div className="fixed flex flex-col bg-white w-[700px] max-h-[600px] -translate-x-1/2 left-1/2  h-auto  top-16 px-4 rounded-lg z-40">
        <div className="relative left-1/2 text-center top-6 -translate-x-1/2 bg-white font-bold text-2xl text-danube-800 inline-block">
          {title}
        </div>
        <Close onClick={onClick} />
        {children}
      </div>
    </>
  );
};

export default OverlayWrapper;
