// react
import React from "react";
import { Tab, TabsProps } from "../../Util/constants";

// types

const Tabs = ({
  tabs,
  currentTab,
  handleSwitch,
  id,
  type = "solid",
}: TabsProps) => {
  // sessionStorage used to store the current tab

  // change the tabs style by simply giving type property in props. default is the solid tabs style
  const tabConfig: any = {
    solid: {
      containerStyle: "relative flex h-full w-full gap-1 select-none",
      baseStyle: "h-[48px] flex-1 rounded border border-slate-300",
      selected: "managementBtnSuccessSolid text-white",
      notSelected:
        "hover:bg-success-50 text-success-200 hover:text-slate-500 transition-all 150ms",
    },
    text: {
      containerStyle:
        "relative flex items-center w-full h-full transition select-none",
      baseStyle: "py-2 px-2",
      selected: " border-b-4 border-slate-200 font-semibold",
      notSelected:
        "border-b-4 border-transparent text-slate-600 hover:text-slate-500 transition-all 150ms",
    },
  };

  return (
    <div className={tabConfig[type].containerStyle} id={id}>
      {tabs.map((tab: Tab) => {
        return (
          <button
            key={tab.id}
            id={tab.id}
            className={`select-none px-4 flex-1 ${tabConfig[type].baseStyle} ${
              currentTab === tab.id
                ? tabConfig[type].selected
                : tabConfig[type].notSelected
            }`}
            onClick={() => {
              handleSwitch(tab.id);
            }}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
