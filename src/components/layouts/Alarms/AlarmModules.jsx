import React, { useState } from "react";
import { AlarmMenuList } from 'components/layouts/Alarms/Menu'; 
import {alarmTabValue} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';

export default function Gateway() {

  const theme = useTheme(); 
  const [alarmsTab, ] = useRecoilState(alarmTabValue); 
  const [menuList] = useState(AlarmMenuList)
  return (

    <React.Fragment>
    <div style={{background: theme.colorPalette.foreGround}}>
        {menuList[alarmsTab].content} 
    </div>
</React.Fragment>
  );
}