import React from 'react';
import Grid from 'components/Core/GridNDL';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms";

import Plus from 'assets/neo_icons/Menu/plus.svg?react';
export default function HeaderNDL(props) {
  const [curTheme] = useRecoilState(themeMode);

  return (
<Grid container spacing={2}  style={{ alignItems:"center", paddingTop:"12px",paddingBottom:"12px", paddingLeft:"16px",height: '48px',paddingRight:"16px",borderBottom:curTheme === 'dark' ? '1px solid #2a2a2a' :"1px solid #e8e8e8",backgroundColor:curTheme === 'dark' ? '#191919' :"#fcfcfc"}}>
      <Grid item xs={6}>
        {props.component1 && <props.component1 variant="lable-01-m" value={'Checking Weather'}/>} 
      </Grid>
      <Grid item xs={6}>
        {props.component2 && <props.component2 />}
      </Grid>
    </Grid>
  );
}
