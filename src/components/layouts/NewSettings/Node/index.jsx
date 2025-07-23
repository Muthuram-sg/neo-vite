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
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import LoadingScreen from "LoadingScreenNDL"


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
    const [filteredEntityData,setfilteredEntityData] = useState([])
    const [,setLoad] =useState(false)
  
  
   
    

    useEffect(() => {
        getEntity(headPlant.id);
        getAnalyticConfigList()
        instrumentMetricsList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
    useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredEntityData])

    useEffect(()=>{
        if(!EntityLoading && EntityData && !EntityError){
            // console.log(EntityData,"EntityData")
            setfilteredEntityData(EntityData.filter(x=>x.entity_type !== 3))

        }

      },[EntityLoading, EntityData, EntityError])
    const headCells = [
        {
            id: 'Name',
            numeric: false,
            disablePadding: true,
            label: t('Name'),
        },
        {
            id: 'Type',
            numeric: false,
            disablePadding: false,
            label: t('Type'),
        },
        {
            id: 'Last Updated By',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated By'),
        },
        {
            id: 'Last Updated On',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated on'),
        }



    ];
    const processedrows = () => {
        let temptabledata = []
        if (filteredEntityData.length > 0) {
            setEntity(filteredEntityData)
            temptabledata = temptabledata.concat(filteredEntityData.map((val, index) => {
                return [val.name, val.entityTypeByEntityType.name, val.userByUpdatedBy.name,
                    moment(val.updated_ts).format("Do MMM YYYY")]
            })
            )
        }
        // EntityRef.current.handleEntityDialogClose()
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
 
    return(
        <React.Fragment> 
{EntityLoading && <LoadingScreen />}

        <AddEntity
        ref={EntityRef}
        style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
        getUpdatedEntityList={()=>{getEntity(headPlant.id);getAnalyticConfigList();setLoad(true);setTimeout(()=>{setLoad(false)},3000)}}
        AnalyticConfigListData={!AnalyticConfigListLoading && AnalyticConfigListData && !AnalyticConfigListError ? AnalyticConfigListData : []}
        instrumentMetricsListData={ !instrumentMetricsListLoading && instrumentMetricsListData && !instrumentMetricsListError ? instrumentMetricsListData : []}
        />
         <div className="flex justify-between items-center  h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                        <TypographyNDL value='Entity' variant='heading-02-xs' />
            </div>
        <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
                    buttonpresent={currUserRole.id === 2 ? t("New Entity") : ''}
                    search={true}
                    download={true}
                    onClickbutton={handleCreateOrder}
                    actionenabled={true}
                    rawdata={filteredEntityData.length > 0 ? filteredEntityData: []}
                    handleEdit={(id, value) => handleDialogEdit(value,id )}
                    handleDelete={(id, value) => deleteTaskfn(value,id )} 
                    enableDelete={true}
                    enableEdit={true}
                    Buttonicon={Plus}
                    verticalMenu={true}
                                        groupBy={'entity_settings'}
                    />
        </div>
    </React.Fragment>
    )
}