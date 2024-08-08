import { MouseEventHandler, useState } from "react";

interface HeaderProps {
  children: any;
  type: "changed" | "unchanged";
  defaultOpen: boolean;
}

/**
 * Header component for displaying headers in the ChangesOverview component.
 * @param {HeaderProps} props - The properties for the Header component.
 * @param {React.ReactNode} props.children - The child components.
 * @param {"changed" | "unchanged"} props.type - The type of the header, either "changed" or "unchanged".
 * @param {boolean} props.defaultOpen - The default state of whether the header is open or closed.
 * @returns {JSX.Element} - The JSX element representing the Header component.
 */
const Header = ({ children, type, defaultOpen }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const style = `${
    type === "changed" ? "text-white bg-danube-800" : "bg-white border-2 border-bg-danube-800 text-danube-800"
  }left-1/3 select-none text-center inline-block font-bold p-2`;

  const onClickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        onClick={onClickHandler}
        className={`${isOpen ? "rounded-t-lg" : "rounded-lg"} ${
          type === "changed" ? "bg-danube-800" : "bg-white"
        } shadow w-auto mt-4 my-1 z-30 flex flex-row cursor-pointer text-sm`}
      >
        {isOpen ? (
          <>
            {type === "changed" && <div className={`${style} w-1/3`}>Title</div>}
            <div className={`${style} ${type === "changed" ? "w-1/3" : "rounded-t-lg w-full"}`}>
              {type === "changed" ? "Previous" : "Unchanged"}
            </div>
            {type === "changed" && <div className={`${style} w-1/3`}>Current</div>}
          </>
        ) : (
          <div className={`${style} rounded-lg w-full hover:font-semibold`}>
            {type === "changed" ? "See All Changes" : "Unchanged"}
          </div>
        )}
      </div>
      {isOpen && children}
    </>
  );
};

export default Header;
