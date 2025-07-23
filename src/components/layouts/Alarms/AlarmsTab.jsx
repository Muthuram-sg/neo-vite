import React from 'react';
import TabListItem from './TabListItem';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';
import { AlarmMenuList } from './Menu'; 


function AlarmsTab(props){ 
    return(
        <div class={`"flex flex-row  w-full padding p-0 h-10  z-10 dark:bg-Background-bg-primary-dark bg-Background-bg-primary "`}>
        <TabListItems>
        {AlarmMenuList.map((data, index) => { 
                return (<TabListItem 
                        key={index+1}
                        index={index} 
                        isSelected={props.currentTab === index?true:false} 
                        tabChange={props.tabChange}
                        title={data.title}
                    />);
            })}
      </TabListItems>
      </div>
    )
}
const isRender = (prev,next)=>{
    return prev.currentTab !== next.currentTab ? false:true;
}
export default React.memo(AlarmsTab,isRender)