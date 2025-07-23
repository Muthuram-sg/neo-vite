import React, { forwardRef, useEffect, useState } from 'react'; 
import Button from "components/Core/ButtonNDL";
import ClickAwayListener from 'react-click-away-listener';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import { themeMode,selectedPlant } from "recoilStore/atoms";
import GeneratorLight from 'assets/neo_icons/Equipments/generator.svg?react';
import GeneratorDark from 'assets/neo_icons/Equipments/generator_dark.svg?react';
// core component 
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
// useHooks
import useAssetList from './Hooks/useAssetList'; 
const AssetList = forwardRef((props,ref)=>{ 
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode);
    const [entityOpen, setEntityOpen] = useState(); 
    const [headPlant] = useRecoilState(selectedPlant);
    const { assetListLoading, assetListData, assetListError, assetList }= useAssetList();  
    useEffect(()=>{
        assetList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
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
                    <ToolTip title={t('AssertToolTip')} placement="bottom" >
                        <div onClick={handleEntityClick}>
                        <Button type="ghost"   icon={curTheme==='dark' ? GeneratorDark : GeneratorLight } />
                        </div>
                    </ToolTip>
                    {entityOpen &&
                    <div id={"instrumentList-select"} className={`z-20 p-3 bg-white rounded-lg shadow dark:bg-gray-700`}
                    style={{position: 'absolute'}} 
                    >  
                        <div style={{ width: 300 }}>
                            <SelectBox 
                                auto={true}
                                id="entitylist"
                                label={t("Asset")}
                                // edit={true}
                                options={!assetListLoading && assetListData && !assetListError && assetListData.length>0?assetListData:[]}
                                isMArray={true}
                                keyId="id"
                                keyValue="name"
                                value={{}}
                                onChange={props.addAsset}
                            />
                        </div>  
                    </div>}
                </div>
            </ClickAwayListener>
        </React.Fragment>
    )
})
export default AssetList;