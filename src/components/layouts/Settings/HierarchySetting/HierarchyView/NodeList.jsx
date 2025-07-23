import React, { forwardRef, useEffect, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import Button from "components/Core/ButtonNDL";
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import { themeMode,selectedPlant } from "recoilStore/atoms";
import HierarchyHLight from 'assets/neo_icons/Menu/hierarchy_horizontal.svg?react';
import HierarchyHDark from 'assets/neo_icons/Menu/hierarchy_horizontal_dark.svg?react';
// core component
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
// useHooks
import useNodeList from './Hooks/useNodeList'; 
const NodeList = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode);
    const [entityOpen, setEntityOpen] = useState(); 
    const [headPlant] = useRecoilState(selectedPlant);
    const { entityListLoading, entityListData, entityListError, entityList }= useNodeList();  
    useEffect(()=>{
        entityList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        if(entityListData){
            console.log(entityListData,"entityListData")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[entityListData])
    const handleEntityClick = (event) => {
        setEntityOpen(prev => !prev); 
    };
    const handleEntityClose = (event) => {
        setEntityOpen(false); 
    };
    return(
        <React.Fragment>
            
            <ClickAwayListener onClickAway={handleEntityClose}>
                <div>
                <ToolTip title={t('EntityToolTip')} placement="bottom" >
                    <div  onClick={handleEntityClick}>
                    <Button type="ghost" icon={curTheme === "dark" ?  HierarchyHDark  : HierarchyHLight }/>
                    </div>
                </ToolTip>
                {entityOpen &&
                <div id={"entitylist-select"} className={`z-20 p-3 bg-white rounded-lg shadow  dark:bg-gray-700`}
                style={{position: 'absolute'}}
                
                > 
                    <div style={{ width: 300 }}>
                        <SelectBox 
                            auto={true}
                            id="entitylist" 
                            label={t("entity")}
                            // edit={true}
                            options={!entityListLoading && entityListData && !entityListError && entityListData.length>0?entityListData:[]}
                            isMArray={true}
                            keyId="id"
                            keyValue="name"
                            value={props.value}
                            onChange={props.addNode}
                        />
                    </div>                    
                </div>}
                </div>
            </ClickAwayListener>
        </React.Fragment>
    )
})
export default NodeList;