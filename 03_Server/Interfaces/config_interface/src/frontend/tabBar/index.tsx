import { observer } from "mobx-react-lite";
import Tab from "./Tab";
import User from "./User";
import { useStore } from "../../stores";
import { useState } from "react";
import TabChangeWarningOverlay from "../components/overlays/TabChangeWarningOverlay";

export interface TabItem {
  key: number;
  value: string;
}

/**
 * TabBar component for rendering a navigation bar with tabs and user information.
 * @component
 * @returns {JSX.Element} - The JSX element representing the TabBar component.
 */
const TabBar = () => {
  const { data: dataStore } = useStore();
  const tabs = [
    { key: 0, value: "Overview" },
    { key: 1, value: "Logger" },
    { key: 2, value: "Sensor" },
  ];

  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>();

  /**
   * Handles tab click event.
   * @param {number} key - The key of the clicked tab.
   */
  const handleTabClick = (key: number) => {
    if (dataStore.isEditing) {
      setOverlayVisible(true);
      setSelectedTab(key);
      return;
    }
    dataStore.setActiveTab(key);
    dataStore.setEditing(false);
  };
  /**
   * Confirms the tab change after the overlay confirmation.
   */
  const confirmTabChange = () => {
    if (selectedTab !== undefined) {
      dataStore.setSelectedID(0);
      dataStore.setActiveTab(selectedTab);
      dataStore.setEditing(false);
      setOverlayVisible(false);
    }
  };

  return (
    <div className="w-full bg-danube-200 shadow z-10 flex flex-row text-base font-semibold  flex-0">
      <div className="flex-1 h-full py-2 min-w-[150px]">
        <img src="assets/HyFive-Logo schwarz-blau.svg" alt="HyFive Logo" className="h-full max-h-8 pl-2" />
      </div>
      <div className=" h-full w-full flex flex-row flex-auto max-w-5xl ">
        {tabs.map((tab) => (
          <Tab tabItem={tab} handleClick={handleTabClick} key={tab.key} />
        ))}
      </div>
      <div className="flex-1 h-full justify-self-end min-w-[160px]">
        <User />
      </div>
      {overlayVisible && (
        <TabChangeWarningOverlay close={() => setOverlayVisible(false)} confirmTabChange={confirmTabChange} />
      )}
    </div>
  );
};

export default observer(TabBar);
