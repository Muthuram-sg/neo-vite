import React,{useEffect} from 'react';
import TabListItem from '../Settings/TabListItem';
import TabListItems from '../../../components/Core/Tabs/TabListItemNDL'
import { MenuList } from './Menu';
import { useRecoilState } from "recoil";
import {themeMode,oeeAssets} from "recoilStore/atoms"


function OfflineTab(props){
    const [curTheme]=useRecoilState(themeMode);
    const [oeeAssetsArray] = useRecoilState(oeeAssets);

useEffect(()=>{
console.log(oeeAssetsArray,"oee",props.isDisable)
},[oeeAssetsArray])
    return(
        <div style={{height:props.isDisable  && oeeAssetsArray.length > 0 ? '48px' : undefined}}class={`"flex flex-row   padding p-0   z-10 ${curTheme==='dark' ? 'bg-black' : 'bg-primary-bg'} "`}>
        <TabListItems>
        {oeeAssetsArray.length > 0 && MenuList.map((data, index) => { 
                return (<TabListItem 
                        index={index} 
                        isSelected={props.currentTab === index?true:false} 
                        tabChange={props.tabChange}
                        title={data.title}
                    />);//NOSONAR
            })}
      </TabListItems>
      </div>
    )
}
const isRender = (prev,next)=>{
    return prev.currentTab !== next.currentTab ? false:true;
}
export default React.memo(OfflineTab,isRender)