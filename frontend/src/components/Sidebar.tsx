import { useEffect, useState } from "react";
import { useAppStore } from "../store/appStore";
import { AXIOS_TAB } from "../utils/axios/axios";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  // const [editable, setEditable] = useState<boolean>(false);
  const tabs = useAppStore().tabs;
  const setTabs = useAppStore().setTabs;

  useEffect(() => {
    const getTabs = async () => {
      const response = await AXIOS_TAB.get("/all");
      setTabs(response.data.data.tabs);
    };
    getTabs();
  }, [setTabs]);
  return (
    <div className="absolute top-0 h-screen ">
      <button
        // className="flex flex-col gap-1  left-52 absolute top-5 "
        className={`flex flex-col gap-1 left-4  absolute top-5  `}
        onClick={() => setShowSidebar(!showSidebar)}
        // onClick={() => setShowSidebar(true)}
      >
        <div className="h-1 w-5 bg-black"></div>
        <div className="h-1 w-5 bg-black"></div>
        <div className="h-1 w-5 bg-black"></div>
      </button>
      <div
        // className={`
        //   w-60 bg-red-500 h-full transform-all duration-700`}
        className={`${showSidebar ? "w-60 block " : "hidden w-0"} h-full`}
      >
        <div
          className={`${
            showSidebar ? "block" : "hidden"
          } mt-12 bg-red-400 flex flex-col gap-1 items-end py-5 px-2 h-full`}
        >
          {tabs.length === 0 ? (
            <div className=" text-center w-full bg-green-50">No tabs</div>
          ) : (
            tabs.map((tab) => {
              return (
                <div
                  onDoubleClick={() => {
                    console.log("CLICKED");
                  }}
                  className="w-9/10 bg-[#cacaca]  px-3 "
                >
                  {/* <input
                  className="w-9/10 bg-green-300 "
                  disabled={!editable}
                  key={tab.tabId}
                  value={tab.tabName}
                /> */}
                  {tab.tabName}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
