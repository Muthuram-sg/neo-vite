import React from 'react';
import { useTranslation } from 'react-i18next';
import TabContent from "components/Core/Tabs/TabContentNDL";

function Tabing(props){
    const { t }= useTranslation();
    return (  
            <TabContent width="300px" id={props.index} value={t(props.title)} selected={props.isSelected} icon={props.selectedIcon} onClick={(event) => props.tabChange(event, props.index)}   />
    )
} 
const isRender = (prev,next)=>{
    return prev.isSelected !== next.isSelected ? false:true;
}
const TabList = React.memo(Tabing,isRender)
export default TabList; 