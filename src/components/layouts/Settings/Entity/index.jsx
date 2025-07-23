import React, { useState,useEffect,useRef} from "react";
import { useRecoilState } from "recoil";
import { selectedPlant, currentUserRole,lineEntity,themeMode,snackMessage,snackType,snackToggle} from "recoilStore/atoms"; 
import moment from 'moment';
import EnhancedTable from "components/Table/Table";
import useEntity from "./hooks/useEntity";
import AddEntity from "./components/EntityModal";
import { useTranslation } from 'react-i18next';
import useAnalyticConfigList from './hooks/useAnalyticConfigList';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useInstrumentMetrics from 'Hooks/useInstrumentMetrics'

export default function Entity() {
    const { t } = useTranslation();
    const [currUserRole] = useRecoilState(currentUserRole);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setEntity] = useRecoilState(lineEntity);
    const [tabledata, setTableData] = useState([])
    const { EntityLoading, EntityData, EntityError, getEntity } = useEntity(); 
    const { AnalyticConfigListLoading, AnalyticConfigListData, AnalyticConfigListError, getAnalyticConfigList } = useAnalyticConfigList();
    const { instrumentMetricsListLoading, instrumentMetricsListData, instrumentMetricsListError, instrumentMetricsList } = useInstrumentMetrics();
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const EntityRef = useRef()
    const [curTheme]=useRecoilState(themeMode)
  
  
   
    

    useEffect(() => {
        getEntity(headPlant.id);
        getAnalyticConfigList()
        instrumentMetricsList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
    useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EntityData])
    const headCells = [
        {
            id: 'sno',
            label: 'S.No',
            disablePadding: false,
            width: 100,
        },
        {
            id: 'Name',
            numeric: false,
            disablePadding: true,
            label: t('Name'),
            width:120
        },
        {
            id: 'Type',
            numeric: false,
            disablePadding: false,
            label: t('Type'),
            width:120
        },
        {
            id: 'Added By',
            numeric: false,
            disablePadding: false,
            label: t('Added By'),
            width:120
        },
        {
            id: 'Added On',
            numeric: false,
            disablePadding: false,
            label: t('Added on'),
            width:120
        },
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('Entity ID'),
            hide: true,
            display: "none",
            width: 100

        }


    ];
    const processedrows = () => {
        var temptabledata = []
        if (EntityData && !EntityError && !EntityLoading) {
            setEntity(EntityData)
            temptabledata = temptabledata.concat(EntityData.map((val, index) => {
                return [index+1,val.name, val.entityTypeByEntityType.name, val.user.name,
                    moment(val.created_ts).format("Do MMM YYYY"), val.id]
            })
            )
        }
        setTableData(temptabledata)
    }
    const handleCreateOrder = () => {
        EntityRef.current.handleEntityDialog()
    }
    const handleDialogEdit = ( row,id) => {
        EntityRef.current.handleEditEnitytDialogOpen(row)
    }
    const deleteTaskfn = ( val,id) => {
        if(headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.contracts.length > 0){
            let contractEntity = headPlant.node.energy_contract.contracts.map(x=>x.contract)
            let contractNode = headPlant.node.energy_contract.contracts.map(x=>x.Entities.map(k=>k.node)).flat()
            let RemoveDuplicate = [...new Set(contractNode)]
            let nodeValue = RemoveDuplicate.includes(val.id)
            let contractCheck = contractEntity.includes(val.id)
            if(contractCheck){
                setOpenSnack(true)
                SetType('error')
                SetMessage(`Select Contract Entity ${val.name} is Maped as Contract in Contract tab `)
                return false

            }
            else if(nodeValue){
                setOpenSnack(true)
                SetType('error')
                SetMessage(`Select Node Entity ${val.name} is Maped as Node in Contract tab `)
                return false

            }
        }
        EntityRef.current.handleDeleteDialogOpen(val)
    }
    // console.log(EntityData,"EntityData")
 
    return(
        <React.Fragment> 
        <AddEntity
        ref={EntityRef}
        style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
        getUpdatedEntityList={()=>{getEntity(headPlant.id);getAnalyticConfigList()}}
        AnalyticConfigListData={!AnalyticConfigListLoading && AnalyticConfigListData && !AnalyticConfigListError ? AnalyticConfigListData : []}
        instrumentMetricsListData={ !instrumentMetricsListLoading && instrumentMetricsListData && !instrumentMetricsListError ? instrumentMetricsListData : []}
        />
        <div style={{ padding: 16,backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}>
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
                    buttonpresent={currUserRole.id === 2 ? t("Add Entity") : ''}
                    search={true}
                    download={true}
                    onClickbutton={handleCreateOrder}
                    actionenabled={true}
                    rawdata={EntityData && !EntityError && !EntityLoading ? EntityData: []}
                    handleEdit={(id, value) => handleDialogEdit(value,id )}
                    handleDelete={(id, value) => deleteTaskfn(value,id )} 
                    enableDelete={true}
                    enableEdit={true}
                    Buttonicon={Plus}
                    rowSelect={true}
                    checkBoxId={"id"}
                    
                    />
        </div>
    </React.Fragment>
    )
}