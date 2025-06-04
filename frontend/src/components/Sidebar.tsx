import { useEffect, useState } from "react";
import { useAppStore } from "../store/appStore";
import { AXIOS_TAB } from "../utils/axios/axios";
import Add from "./Svg/Add";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  // const [editable, setEditable] = useState<boolean>(false);
  const tabs = useAppStore().tabs;
  const setTabs = useAppStore().setTabs;
  const navigate = useNavigate();
  useEffect(() => {
    const getTabs = async () => {
      const response = await AXIOS_TAB.get("/all");
      setTabs(response.data.data.tabs);
    };
    getTabs();
  }, [setTabs]);

  const handleClick = async () => {
    try {
      const response = await AXIOS_TAB.post("/create");

      const { tabId, tabName, isPrivate, createdAt } = response.data.tab;

      useAppStore.getState().addTab({
        tabId,
        tabName,
        isPrivate,
        createdAt,
      });

      const alreadyThere = useAppStore
        .getState()
        .tabs.some((tab) => tab.tabId != tabId);
      if (!alreadyThere) {
        useAppStore.getState().setTabs([
          {
            tabId,
            tabName,
            isPrivate,
            createdAt,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="absolute top-0 h-screen ">
      <div className={`h-full transform-all duration-700`}>
        <button
          // className="flex flex-col gap-1  left-52 absolute top-5 "
          className={`flex flex-col gap-1 left-4  absolute top-3  `}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <div className="h-1 w-5 bg-black"></div>
          <div className="h-1 w-5 bg-black"></div>
          <div className="h-1 w-5 bg-black"></div>
        </button>
        <div
          className={`${
            showSidebar ? "w-60" : "hidden"
          } bg-[#ddd] overflow-auto border-r-2 border-gray-900 shadow-lg flex flex-col gap-1 items-end py-5 px-2 h-full transition-all duration-1000`}
        >
          <div
            onClick={handleClick}
            className=" bg-black/40 text-white font-bold   cursor-pointer hover:bg-black"
          >
            <Add />
          </div>

          <div className="mt-4 w-9/10 flex gap-2 flex-col">
            {tabs.length === 0 ? (
              <div className=" text-center w-full bg-green-50">No tabs</div>
            ) : (
              tabs.map((tab) => {
                return (
                  <div
                    onDoubleClick={() => {
                      if (tab.tabId) {
                        navigate(`/${tab.tabId}`);
                      }
                    }}
                    className="w-full bg-[#cacaca]  px-3"
                    key={tab.tabId}
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

      {/* <div className="float  float-right">
        <input type="text" className="bg-gray-200 px-10 py-4" />
        <button
          onClick={async () => {
            const response = await AXIOS_TAB.post("/join/123");
            console.log(response.data.message);
          }}
        >
          Join New
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
