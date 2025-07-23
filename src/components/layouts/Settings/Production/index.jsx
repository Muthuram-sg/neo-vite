import React, { useState,useEffect } from "react";
import ProductionTabs from './ProductionTabs';
import { MenuList } from './Menu'; 
import {currentPage, selectedPlant } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';
import useGetSteelAssetCount from "./Steel/hooks/useGetSteelAssetCount";

export default function Gateway() {

  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0); 
  const [, setCurPage] = useRecoilState(currentPage);
  const [menuList, setMenuList] = useState(MenuList)
  const [headPlant] = useRecoilState(selectedPlant);
  const { SteelAssetLoading, SteelAssetData, SteelAssetError, getSteelAsset } = useGetSteelAssetCount();

  useEffect(() => {
      setCurPage("settings");
      if(headPlant.id){
        getSteelAsset(headPlant.id)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);

  useEffect(() => {
    if (!SteelAssetLoading && !SteelAssetError && SteelAssetData ) {
      setMenuList(MenuList)
    }
    else{
      setMenuList(menuList.filter(x => x.title !== "Steel Data"))
    }
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SteelAssetData])
  const handleChange = (event, newValue) => {
      setTabValue(newValue); 
  }; 

  return (
   
    <React.Fragment>
    <ProductionTabs currentTab={tabValue} tabChange={handleChange} menuList={menuList} />
    <div style={{background: theme.colorPalette.foreGround}}>
        {MenuList[tabValue].content} 
    </div>
</React.Fragment>
  );
}
