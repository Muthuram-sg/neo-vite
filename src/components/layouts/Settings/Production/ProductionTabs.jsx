import React from 'react';
import TabListItem from './TabListItem';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';


function ProductionTabsFunction(props){
    return(
        <div class="flex flex-row  w-full padding p-0  h-14  z-10  bg-Background-bg-primary dark:bg-Background-bg-primary-dark ">
        <TabListItems>
        {props.menuList.map((data, index) => { 
                return (<TabListItem 
                        key={index}
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
    return prev.currentTab !== next.currentTab || prev.menuList !== next.menuList ? false:true;
}
export default React.memo(ProductionTabsFunction,isRender)