import React, { useState,useEffect } from "react";
import {useParams} from "react-router-dom"
import { SubMenuList as MenuList } from './SubMenu'; 
import {currentPage, selectedPlant, productionTabValue, ErrorPage } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';
import useGetSteelAssetCount from "./Steel/hooks/useGetSteelAssetCount";
//import { useParams } from "react-router-dom";

export default function Gateway() {

  const theme = useTheme();
  const {moduleName,subModule1,subModule2} =useParams()
  const [prodTab, setProdTabValue] = useRecoilState(productionTabValue); 
  const [, setCurPage] = useRecoilState(currentPage);
  const [,setErrorPage] = useRecoilState(ErrorPage)
  const [menuList, setMenuList] = useState(MenuList)
  const [headPlant] = useRecoilState(selectedPlant);
  const { SteelAssetLoading, SteelAssetData, SteelAssetError, getSteelAsset } = useGetSteelAssetCount();
 
  
  useEffect(() => {
      setCurPage("production");
        if(headPlant.id){
          getSteelAsset(headPlant.id)
          if(moduleName === "products" && (subModule1 === "all" || subModule1 === "new") && !subModule2){
            setProdTabValue(0)
          }
          else if(moduleName === "reasons" && subModule1 === "new" && (subModule2 === "all" || subModule2 === "downtime" || subModule2 === "quality" || subModule2 === 'performance')){
            setProdTabValue(3)
          }
          else if(moduleName && moduleName.includes('=') && subModule1 === "execution" && subModule2 === "new"){
            const [key, value] = moduleName.split('='); 
            // Create an empty object to store the values
            const queryParams = {};
            queryParams[key] = value;
            
            if(queryParams['workorder']){
              setProdTabValue(1)
            }else{
              setErrorPage(true)
            } 
          }
          else if(moduleName === "work_orders" && (subModule1 === "all" || subModule1 === "new")){
            setProdTabValue(1)
          }
          else if(moduleName === "execution" && (subModule1 === "all")){
            setProdTabValue(2)
          }
          else if(moduleName === "steel_report" && (subModule1 === "all" || subModule1 === "new")){
            setProdTabValue(4)
          }
          else if(moduleName === "undefined" && subModule1 === "undefined"){
            setProdTabValue(0)
          }else if((moduleName && !['products','reasons'].includes(moduleName) ) || (subModule1 && !['all','new'].includes(subModule1)) ){
            setErrorPage(true)
          }else if(moduleName && subModule1 && subModule2 && !['all','downtime','quality','performance'].includes(subModule2)){
            setErrorPage(true)
          }
        }
// console.log(moduleName,subModule1,"MD")     
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant,moduleName,subModule1]);

  useEffect(() => {
    if (!SteelAssetLoading && !SteelAssetError && SteelAssetData ) {
      setMenuList(MenuList)
    }
    else{
      setMenuList(menuList.filter(x => x.title !== "Steel Data"))
    }
    // else {
    //   const menuIndex = menuList.findIndex(x => x.title === "Steel Data")

    //   if (menuIndex > -1) { // only splice array when item is found
    //     menuList.splice(menuIndex, 1); // 2nd parameter means remove one item only
    //   }
    // }
    // console.log("menuList", menuList,SteelAssetData)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SteelAssetData])

  return (
   
    <React.Fragment>
    <div style={{background: theme.colorPalette.foreGround}}>
        {MenuList[prodTab].content} 
    </div>
</React.Fragment>
  );
}
