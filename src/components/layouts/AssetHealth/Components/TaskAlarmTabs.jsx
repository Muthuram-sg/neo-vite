import React from 'react';
import TabListItem from './TabListItem';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';
import {MenuList}  from './Menu';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"


function TaskAlarmTabs(props){
    const [curTheme]=useRecoilState(themeMode)
    return(
        <div class={`"flex flex-row  w-full padding p-0 h-12  z-10 ${curTheme==='dark' ? 'bg-black' : 'bg-primary-bg'} "`}>
        <TabListItems>
        {MenuList.map((data, index) => { 
                return ( <TabListItem 
                        key={index}//NOSONAR
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
export default React.memo(TaskAlarmTabs,isRender)