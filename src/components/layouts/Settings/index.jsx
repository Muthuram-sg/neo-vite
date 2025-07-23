import React,{useState,useEffect} from 'react';
import { MenuList } from './SubMenu'; 
import { BIMenuList } from './SubMenuBI';
import useTheme from 'TailwindTheme';
import {currentPage,selectedPlant,settingsTabValue } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
export default function Settings(){
    const theme = useTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [tabValue, setTabValue] = useRecoilState(settingsTabValue); 
    const [, setCurPage] = useRecoilState(currentPage);
    const [SettingMenu,setSettingMenu] = useState([])
    useEffect(() => {
        setCurPage("settings");
        setTabValue(parseInt(localStorage.getItem('tabValue')) || 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      useEffect(()=>{
        if(headPlant.type === '1'){
            if(tabValue === 0){
                setTabValue(0)
            }else{
                setTabValue(1)
            }
            setSettingMenu(BIMenuList.filter(e=> e.title === "Line" || e.title === "Users"))
        }else{
            setSettingMenu(MenuList)
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])
   
    return(
        <React.Fragment>
            <div style={{background: theme.colorPalette.foreGround,width:"100%",overflowX:"auto"}}>
                {(SettingMenu.length>0) ? SettingMenu[tabValue].content : null} 
            </div>
        </React.Fragment>
    )
}
