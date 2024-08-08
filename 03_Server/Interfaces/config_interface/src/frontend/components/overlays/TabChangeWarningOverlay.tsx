import Button from "../Button";
import OverlayWrapper from "./OverlayWrapper";

interface TabChangeWarningOverlay {
  close: () => void;
  confirmTabChange: () => void;
}

/**
 * TabChangeWarningOverlay component for displaying a warning when leaving a page with unsaved changes.
 * @param {TabChangeWarningOverlay} props - The properties for the TabChangeWarningOverlay component.
 * @param {Function} props.close - The function to close the overlay.
 * @param {Function} props.confirmTabChange - The function to confirm the tab change despite unsaved changes.
 * @returns {JSX.Element} - The JSX element representing the TabChangeWarningOverlay component.
 */
const TabChangeWarningOverlay = ({ close, confirmTabChange }: TabChangeWarningOverlay) => {
  return (
    <OverlayWrapper onClick={close} title={"Warning"}>
      <div className="w-full p-4 text-center">You are about to leave this page. Your changes will be discarded.</div>
      <div className="flex flex-row pb-4 px-4 justify-end">
        <Button text={"OK"} button_type={"default"} style="mr-2" onClick={confirmTabChange} />
        <Button text={"Cancel"} button_type={""} onClick={close} />
      </div>
    </OverlayWrapper>
  );
};

export default TabChangeWarningOverlay;
