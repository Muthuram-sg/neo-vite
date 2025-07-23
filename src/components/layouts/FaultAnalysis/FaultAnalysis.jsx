import React, { useState } from "react";
import { PDMMenuList } from 'components/layouts/ManageInstruments/components/PDMMenuList'; 
import {  pdmTabValue } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';

export default function Gateway() {

  const theme = useTheme();
  const [pdmTab, setPdmTabValue] = useRecoilState(pdmTabValue); //NOSONAR
  const [menuList, setMenuList] = useState(PDMMenuList) //NOSONAR

  return (
   
    <React.Fragment>
    <div style={{background: theme.colorPalette.foreGround}}>
        {menuList[pdmTab].content} 
    </div>
</React.Fragment>
  );
}
