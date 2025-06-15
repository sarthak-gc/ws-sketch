import { useAppStore } from "../store/appStore";

const RecentlyOpenedTabs = () => {
  const recentTabs = useAppStore().recent5Tabs;
  return <div>{recentTabs.map((tab) => tab.tabName)}</div>;
};

export default RecentlyOpenedTabs;
