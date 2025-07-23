import React, { useState, useEffect, useRef } from "react";
import 'components/style/customize.css';
import { useRecoilState } from "recoil";
import { selectedPlant, themeMode, lineEntity, VirtualInstrumentsList } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import Button from "components/Core/ButtonNDL";
import Edit from 'assets/neo_icons/Menu/EditMenu.svg?react';
import EnhancedTable from "components/Table/Table";
import EditModal from './EditContractModel'
import Toast from "components/Core/Toast/ToastNDL";
import LoadingScreenNDL from "LoadingScreenNDL";

//Hooks
import useSavedLineDetails from "components/layouts/Settings/factors/Factor/hooks/useSavedLineDetails";
import useGetChannelListForContract from "./hooks/useGetChannelListForContract";

export default function Contract() {
    const { t } = useTranslation();
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
    const [curTheme] = useRecoilState(themeMode)
    const [entity] = useRecoilState(lineEntity);
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [tabledata, setTableData] = useState([])
    const [contractLoader,setcontractLoader] = useState(false)
    const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForContract();
    const [CommunicationChannel,setCommunicationChannel] = useState([])
    const ContractRef = useRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps 

    const { updatedLineLoading, updatedLineData, updatedLineError, getSavedLineDetails } = useSavedLineDetails();

    const headCells = [
        {
            id: 'contract',
            numeric: false,
            disablePadding: true,
            label: t('Contract Name'),
        },
        {
            id: 'Entity',
            numeric: false,
            disablePadding: false,
            label: t('Entity'),
        },
        {
            id: 'Actual',
            numeric: false,
            disablePadding: false,
            label: t('Actual'),
        }
    ];

    useEffect(()=>{
        if(!ChannelListForLineLoading  && ChannelListForLineData &&  !ChannelListForLineError){
            console.log("eneter")
            const noneOption =[{id:'none',name:"None"}]
            let addNone = [...ChannelListForLineData]
            addNone = [...noneOption,...addNone]
            setCommunicationChannel(addNone)
        }

    },[ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError])


    useEffect(() => {
        if (headPlant.node && headPlant.node.energy_contract && (vInstruments.length > 0) && (entity.length > 0)) {
            let TableVal = headPlant.node.energy_contract.contracts.map((val, i) => {
                let EntityCon = entity.filter(f => f.id === val.contract)
                let ContractName = EntityCon.length > 0 ? EntityCon[0].name : ''

                let EntityName = []
                let ActualName = []
                val.Entities.forEach(x => {
                    let Virtual = vInstruments.filter(f => f.id === x.VirtualInstr)
                    let EntityNode = entity.filter(f => f.id === x.node)
                    EntityName.push(EntityNode.length > 0 ? EntityNode[0].name : '')
                    ActualName.push(Virtual.length > 0 ? Virtual[0].name : '')
                })
                return [ContractName, EntityName.toString(), ActualName.toString()]
            })
            setTableData(TableVal)
        } else {
            setTableData([])
        }
        getChannelListForLine(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, entity, vInstruments])

    useEffect(() => {
        if (
            updatedLineData &&
            !updatedLineError &&
            !updatedLineLoading
        ) {
            if (updatedLineData.neo_skeleton_lines) {
                var temp = JSON.parse(JSON.stringify(updatedLineData.neo_skeleton_lines[0]))
                setheadPlant(temp)
            }
            setcontractLoader(true)
            setTimeout(()=>{
                setcontractLoader(false)
                SetMessage(t('LineDetailsUpdate'))
                SetType("success")
                setOpenSnack(true)
            },5000)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedLineData, updatedLineError, updatedLineLoading])

    const handleContractEdit = (data) => {
         ContractRef.current.handleContractEdit(data);
        
    }

    return (
        <React.Fragment>
            {
                 contractLoader && <LoadingScreenNDL /> 
            }

                <React.Fragment>
                <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
                <div style={{height:"40px",display: 'flex', justifyContent: 'end', columnGap: '8px' }}>
                    
                    <Button
                        type="ghost"
                        style={{ float: "right", width: "100px" }}
                        value={t('Edit')} onClick={(data) => { handleContractEdit(data) }}
                       // icon={Edit}
                    />
    
                </div>
    
                <EditModal 
                    ref={ContractRef} 
                    headPlant={headPlant}
                    getSavedLineDetails={getSavedLineDetails}
                    CommunicationChannel={CommunicationChannel}
                />
    
                <div style={{ paddingTop: 10, backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}>
                    <React.Fragment>
                        <EnhancedTable
                            headCells={headCells}
                            data={tabledata}
                            hidePagination
                            style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
                            rawdata={[]}
    
                        />
                    </React.Fragment>
                </div>
                </React.Fragment>
            
                 
            
           
        </React.Fragment>
    );
}
