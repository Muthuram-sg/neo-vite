import React from 'react';
import TabListItem from './TabList';
import TabListItems from 'components/Core/Tabs/TabListItemNDL';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"


function ExploreTabsFunction(props) {
    const [curTheme] = useRecoilState(themeMode)
    // eslint-disable-next-line no-unused-vars

    return (
        
        <div class={`flex flex-row   z-14  
        ${props.width ? "w-[600px]" : "w-full"} ${curTheme === 'dark' ? 'dark:bg-Background-bg-primary-dark' : 'bg-Background-bg-primary'} `} >
            <TabListItems>
                {props.MenuTabs.map((data, index) => {
                    return (
                            <TabListItem
                                key={index+1}
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
const isRender = (prev, next) => {
    return prev.currentTab !== next.currentTab ? false : true;
}
export default React.memo(ExploreTabsFunction, isRender)