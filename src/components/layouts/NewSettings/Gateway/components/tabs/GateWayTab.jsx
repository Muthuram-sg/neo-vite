import React from 'react';
import TabListItem from './GateWayTabContent';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"


function GateWayTab(props) {
    const [curTheme] = useRecoilState(themeMode)
    // eslint-disable-next-line no-unused-vars

    return (
        
        <div class={`flex flex-row   z-14  
        ${props.width ? "w-[600px]" : "w-full"} ${curTheme === 'dark' ? 'bg-black' : 'bg-Background-bg-primary'} `} >
            <TabListItems>
                {props.MenuTabs.map((data, index) => {
                    return (
                        // NOSONAR - This function requires multiple parameters due to its specific use case.
                            <TabListItem
                                index={index}
                                isSelected={props.currentTab === index ? true : false}
                                tabChange={props.tabChange}
                                title={data.title}
                            
                            />
                        );
            })}
            </TabListItems>
        </div>

    )

}
const isRender = (prev, next) => {//NOSONAR
    return prev.currentTab !== next.currentTab ? false : true;//NOSONAR
}
export default React.memo(GateWayTab, isRender)