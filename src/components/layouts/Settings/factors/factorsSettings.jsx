import React, { useState,useEffect } from "react";
import FactorsTab from "./FactorsTab";
import { MenuList } from './Menu';
import {currentPage } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';

export default function FactorsSettings() {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0); 
  const [, setCurPage] = useRecoilState(currentPage);
  useEffect(() => {
      setCurPage("settings");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  const handleChange = (event, newValue) => {
      setTabValue(newValue); 
  };


  return (
    <React.Fragment>
    <FactorsTab currentTab={tabValue} tabChange={handleChange}/>
    <div style={{background: theme.colorPalette.foreGround,paddingRight: 5}}>
        {MenuList[tabValue].content} 
    </div>
</React.Fragment>
  );
}
