// import React from "react";
// import { useTranslation } from "react-i18next";
// import TabContent from "components/Core/Tabs/TabContentNDL";
// import AssetTabListItem from "./AssetTabListItem";
// import TabListItems from "components/Core/Tabs/TabListItemNDL";
// import { MenuList } from "../AssetMenu";
// import { useRecoilState } from "recoil";
// import { themeMode } from "recoilStore/atoms";

// // Tabing - Individual tab rendering with memoization
// function Tabing(props) {
//   const { t } = useTranslation();
//   return (
//     <TabContent
//       width="300px"
//       id={props.index}
//       value={t(props.title)}
//       selected={props.isSelected}
//       icon={props.selectedIcon}
//       onClick={(event) => props.tabChange(event, props.index)}
//     />
//   );
// }

// const areEqualTab = (prev, next) => {
//   return prev.isSelected === next.isSelected;
// };

// const TabList = React.memo(Tabing, areEqualTab);

// // TaskAlarmTabs - Renders the tab list
// function TaskAlarmTabs(props) {
//   const [curTheme] = useRecoilState(themeMode); // NOSONAR

//   return (
//     <div className="flex flex-row w-full p-0 h-12 z-10 bg-secondary-bg">
//       <TabListItems>
//         {MenuList.map((data, index) => (
//           <AssetTabListItem
//             key={index}
//             index={index}
//             isSelected={props.currentTab === index}
//             tabChange={props.tabChange}
//             title={data.title}
//             selectedIcon={data.icon} // optional: if you want icons
//           />
//         ))}
//       </TabListItems>
//     </div>
//   );
// }

// const areEqualTabs = (prev, next) => {
//   return prev.currentTab === next.currentTab;
// };

// export default React.memo(TaskAlarmTabs, areEqualTabs);
