import React from 'react';
import TabListItem from './TabListItem';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';


function SettingTabsFunction(props){ 

    return(
        <div class="flex flex-row  w-full padding p-0 h-14  z-10 bg-primary-bg " style={{ borderBottom: '1px solid #E8E8E8'}}>
        <TabListItems>
            {props.SettingMenu.map((data, index) => { 
                return (<TabListItem 
                        key={index}
                        index={index} 
                        isSelected={props.currentTab === index?true:false} 
                        tabChange={props.tabChange} 
                        iconColorType={data.iconColorType}
                        title={data.title}
                        selectedIcon={data.selected}
                        iconLight={data.iconLight}
                    />);
            })}
        </TabListItems>
        </div>
    )
}
const isRender = (prev,next)=>{
    return prev.currentTab !== next.currentTab || prev.headPlant !== next.headPlant || prev.SettingMenu !== next.SettingMenu ? false:true ;
}
export default React.memo(SettingTabsFunction,isRender)