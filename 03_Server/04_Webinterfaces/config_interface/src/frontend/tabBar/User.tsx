import { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useStore } from "../../stores";
import UserIcon from "../components/Icons/UserIcon";

/**
 * User component for rendering user information and logout functionality.
 * @component
 * @returns {JSX.Element} - The JSX element representing the User component.
 */
const User = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { data: dataStore } = useStore();

  const toggleVisible = () => {
    setVisible(!visible);
  };
  const closeLogout = () => {
    setVisible(false);
  };
  const users: { [key: string]: string } = {
    write: "Expert User",
    readonly: "Normal User",
  };
  const ref = useDetectClickOutside({ onTriggered: closeLogout });
  const user = dataStore.access !== null ? users[dataStore.access] : "User";

  return (
    <div className="flex text-base w-auto flex-1 justify-end items-center h-full" onClick={toggleVisible} ref={ref}>
      <div className="p-2 text-right flex flex-0 ml-1 cursor-pointer h-full w-[150px]">
        <UserIcon />
        <div className="w-full text-center h-full flex flex-1 items-center justify-center  hover:font-bold">{user}</div>
      </div>
      {visible && (
        <a href="/api/logout">
          <div className="absolute p-2 text-center bg-danube-800 text-white right-0 rounded-b-md flex flex-row cursor-pointer shadow top-12 w-[150px]">
            <img src="/assets/logout-svgrepo-com.png" alt="Logout icon" className="ml-1 mr-3 w-6" />
            <div className="w-full  hover:font-bold">Logout</div>
          </div>
        </a>
      )}
    </div>
  );
};

export default User;
