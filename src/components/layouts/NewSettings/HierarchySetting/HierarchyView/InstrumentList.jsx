import React, { forwardRef, useEffect, useState } from 'react'; 
import ClickAwayListener from 'react-click-away-listener';
import Button from "components/Core/ButtonNDL";
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import { selectedPlant } from "recoilStore/atoms";
import GaugeLight from 'assets/neo_icons/Equipments/gauge.svg?react';
// core component
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
// useHooks
import useInstrumentList from './Hooks/useInstrumentList';
 
const InstrumentList = forwardRef((props,ref)=>{ 
    const { t } = useTranslation();
    const [entityOpen, setEntityOpen] = useState();
    const [headPlant] = useRecoilState(selectedPlant);
    const { instrumentListLoading, instrumentListData, instrumentListError, instrumentList }= useInstrumentList();  
    useEffect(()=>{
        instrumentList(headPlant.id)
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
                <ToolTip title={t('InstrumentToolTip')} placement="bottom" arrow>
                    <div  onClick={handleEntityClick}>
                    <Button type="ghost" icon={GaugeLight } />
                    </div>
                
                </ToolTip>
                {entityOpen &&
                <div id={"instrumentList-select"} className={`z-20 p-3 bg-white rounded-lg shadow  dark:bg-gray-700`}
                style={{position: 'absolute'}} 
                >  
                    <div style={{ width: 300 }}>
                        <SelectBox 
                            auto={true}
                            id="entitylist"
                            label={t("Instruments")}
                            options={!instrumentListLoading && instrumentListData && !instrumentListError && instrumentListData.length>0?instrumentListData:[]}
                            isMArray={true}
                            keyId="id"
                            keyValue="name"
                            value={{}}
                            onChange={props.addInstrument}
                        />
                    </div>  
                </div>}
                </div>
            </ClickAwayListener>
        </React.Fragment>
    )
})
export default InstrumentList;