import React,{useState,useEffect} from 'react';
import SettingTabs from './SettingTabs';
import { MenuList } from './Menu'; 
import useTheme from 'TailwindTheme';
import {currentPage,selectedPlant } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
export default function Settings(){
    const theme = useTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [tabValue, setTabValue] = useState(0); 
    const [, setCurPage] = useRecoilState(currentPage);
    const [SettingMenu,setSettingMenu] = useState([])
    useEffect(() => {
        setCurPage("settings");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(()=>{
        if(headPlant.type === '1'){
            if(tabValue === 7){
                setTabValue(1)
            }else{
                setTabValue(0)
            }
            setSettingMenu(MenuList.filter(e=> e.title === "LineSettings" || e.title === "User"))
        }else{
            setSettingMenu(MenuList)
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])
    const handleChange = (event, newValue) => {
        setTabValue(newValue); 
    };
    return(
        <React.Fragment>
            <SettingTabs currentTab={tabValue} tabChange={handleChange} headPlant={headPlant} SettingMenu={SettingMenu}/>
            <div style={{background: theme.colorPalette.foreGround,width:"100%",overflowX:"auto"}}>
                {(SettingMenu.length>0) ? SettingMenu[tabValue].content : null} 
            </div>
        </React.Fragment>
    )
}
