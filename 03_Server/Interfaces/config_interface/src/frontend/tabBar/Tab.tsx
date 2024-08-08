import { observer } from "mobx-react-lite";
import { TabItem } from ".";
import { useStore } from "../../stores";

interface TabProps {
  tabItem: TabItem;
  handleClick: (tab: number) => void;
}

/**
 * Tab component for rendering a single tab in the TabBar.
 * @component
 * @param {Object} props - The properties for the Tab component.
 * @param {TabItem} props.tabItem - The tab item containing key and value.
 * @param {function} props.handleClick - The function to handle tab click.
 * @returns {JSX.Element} - The JSX element representing the Tab component.
 */
const Tab = ({ tabItem, handleClick }: TabProps) => {
  const { data: dataStore } = useStore();
  return (
    <div
      className={
        tabItem.key === dataStore.activeTab
          ? "flex-1 flex justify-center text-center cursor-pointer w-full items-center border-b-2 h-full font-bold"
          : "flex-1 flex justify-center text-center cursor-pointer w-full items-center h-full hover:font-bold"
      }
      onClick={() => handleClick(tabItem.key)}
    >
      {tabItem.value}
    </div>
  );
};

export default observer(Tab);
