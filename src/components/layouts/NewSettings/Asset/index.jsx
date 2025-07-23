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
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import Button from "components/Core/ButtonNDL";
import ModalNDL from 'components/Core/ModalNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL' 
import useCheckEntity from './hooks/useCheckEntity';
import useDeleteAnEntity from './hooks/useDeleteAnEntity';
import useDeleteEntityRelation from './hooks/useDeleteEntityRelation'; 
import useAnalyticConfigDel from './hooks/useAnalyticConfigDel';
import useDeleteAssetDocs from './hooks/useDeleteAssetDoc'
import LoadingScreen from "LoadingScreenNDL" 
// NOSONAR - This function requires multiple parameters due to its specific use case.
export default function Entity(props) {//NOSONAR 
    const { t } = useTranslation();
    const [currUserRole] = useRecoilState(currentUserRole);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setEntity] = useRecoilState(lineEntity);
    const [tabledata, setTableData] = useState([])//NOSONAR
    const { EntityLoading, EntityData, EntityError, getEntity } = useEntity(); 
    const { AnalyticConfigListLoading, AnalyticConfigListData, AnalyticConfigListError, getAnalyticConfigList } = useAnalyticConfigList();
    const { instrumentMetricsListLoading, instrumentMetricsListData, instrumentMetricsListError, instrumentMetricsList } = useInstrumentMetrics();
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const EntityRef = useRef()
    const [curTheme]=useRecoilState(themeMode)
    const [page,setPage] = useState('asset')
    const [buttonLoader,setbuttonLoader] = useState(false)//NOSONAR
    const [isEdit,setisEdit] = useState(false)
    const [OpenModel,setOpenModel] = useState(false)
    const [DeletedId,setDeletedId] = useState(null)
    const [DeletedName,setDeletedDeletedName] = useState(null)//NOSONAR
    const [BtnLoad,setBtnLoad] = useState(false);
    const [filteredEntityData,setfilteredEntityData] = useState([])
    const [breadcrumpName,setbreadcrumpName] = useState('New Asset') 
    const [pageidx,setPageidx] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);

  const { CheckEntityLoading, CheckEntityData, CheckEntityError, getCheckEntity } = useCheckEntity();
  const [EntityRelation, setEntityRelation] = useState([]);
  const { DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError, getDeleteEntityRelation } = useDeleteEntityRelation();
  const { getAnalyticConfigDel } = useAnalyticConfigDel();
  const { DeleteAnEntityLoading, DeleteAnEntityData, DeleteAnEntityError, getDeleteAnEntity } = useDeleteAnEntity();
  const { DeleteAssetDocLoading, DeleteAssetDocData, DeleteAssetDocError, getDeleteAssetDoc } = useDeleteAssetDocs()//NOSONAR 



  
  
   
  useEffect(() => {
    if (!DeleteEntityRelationLoading && !DeleteEntityRelationError && DeleteEntityRelationData) {
      let delArr = []
      // eslint-disable-next-line array-callback-return
      Object.keys(DeleteEntityRelationData).forEach(val => {
        if (DeleteEntityRelationData[val].affected_rows >= 1) {
          delArr.push("1");
        }
      });
      
      if (delArr.length > 0) {
        console.log('enter1')
        getDeleteAssetDoc({entity_id:DeletedId})
        SetMessage(t('Deletedentity') + DeletedName)
        SetType("success")
        setOpenSnack(true)
        getEntity(headPlant.id);
        getAnalyticConfigList()
        setBtnLoad(false)
        handleDialogClose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError])

  
  useEffect(() => {
    if (!DeleteAnEntityLoading && !DeleteAnEntityError && DeleteAnEntityData) {
      if (DeleteAnEntityData.affected_rows >= 1) {
        SetMessage(t('Deletedentity') + DeletedName)
        SetType("success")
        setOpenSnack(true)
        getEntity(headPlant.id);
        getAnalyticConfigList()
        setBtnLoad(false)
        handleDialogClose()
        // getUpdatedEntityList({ variables: { line_id: headPlant.id } })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteAnEntityLoading, DeleteAnEntityData, DeleteAnEntityError])

    

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
    useEffect(() => {
        if (!CheckEntityLoading && !CheckEntityError && CheckEntityData) {
          let arr = []
          // eslint-disable-next-line array-callback-return
          Object.keys(CheckEntityData).forEach(val => {//NOSONAR
            if (CheckEntityData[val].length > 0) {
              if (val === 'oeeConfig') {
                arr.push("OEE Configurations");
              }
              if (val === 'execution') {
                arr.push("Production execution");
              }
              if (val === 'downtime') {
                arr.push("Downtime");
              }
              if (val === 'partComment ') {
                arr.push("Part comments");
              }
              if (val === 'qualityDefects ') {
                arr.push("Quality rejects");
              }
              if (val === 'tasks') {
                arr.push("Tasks");
              }
              if (val === 'assetInfo ') {
                arr.push(" Asset detail informations");
              }
              if (val === 'maintenancelogs') {
                arr.push("Asset Maintenance Logs");
              }
              if (val === 'entityInstruments') {
                arr.push("Asset Entity Instruments Mapping");
              }
              if (val === 'dryerConfig') {
                arr.push("Dryer Config");
              }
            }
          });
          
          setEntityRelation(arr)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [CheckEntityLoading, CheckEntityData, CheckEntityError])

      useEffect(()=>{
        if(!EntityLoading && EntityData && !EntityError){
           // console.log(EntityData,"EntityData") 
            setfilteredEntityData(EntityData.filter(x=>x.entity_type === 3))

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
          id: 'SAP_Equipment_Code',
          numeric: false,
          disablePadding: true,
          label: t('SAP_Equipment_Code'),
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
            console.log(filteredEntityData,"filteredEntityData")
            temptabledata = temptabledata.concat(filteredEntityData.map((val, index) => {
              return [val.name,val.sap_equipments?.[0]?.equipment_code || "-", val.asset_type?.name || "-",val.userByUpdatedBy?.name || "-",
                    moment(val.updated_ts).format("Do MMM YYYY")]
            })
            )
        }
        setTableData(temptabledata)
    }

    const handleCreateOrder = () => {
        setPage("from")
        setbreadcrumpName("New Asset")
        setisEdit(false)
        props.handleHide(true)//NOSONAR
        EntityRef.current.handleEntityDialog()
    }
    const handleDialogEdit = ( row,id) => {
        setPage("from")
        setisEdit(true)
        setbreadcrumpName("Edit Asset")
        props.handleHide(true)//NOSONAR
        setTimeout(()=>{
        EntityRef.current.handleEditEnitytDialogOpen(row)
    },200)

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
        setOpenModel(true)
        setDeletedId(val.id)
        CheckEntityFunc(val.id)
        setDeletedDeletedName(val.name)
        // EntityRef.current.handleDeleteDialogOpen(val)
    }
    const handleSaveAsset = ()=>{
        EntityRef.current.handleTriggerSave()
    }

    const breadcrump = [{ id: 0, name: 'Settings' }, { id: 1, name: breadcrumpName }]
    const handleActiveIndex = (index) => {
        if (index === 0) {
            setPage('asset')
            props.handleHide(false)//NOSONAR
            setisEdit(false)
        }

    }


    const handleDialogClose =()=>{
        setOpenModel(false)
    }

    const handleDeleteAsset =()=>{
        if(EntityRelation.length > 0){
            DeleteRelationEntity()
        }else{
            getDeleteAnEntity(DeletedId)
            getDeleteAssetDoc({entity_id:DeletedId})
            getAnalyticConfigDel([DeletedId])
        }

    }
   
    
    function CheckEntityFunc(id) {
        getCheckEntity(id)
      }

      function DeleteRelationEntity() {
        getDeleteEntityRelation(DeletedId)
        getAnalyticConfigDel([DeletedId])
    
      }

  
      
    return(
        <React.Fragment> 
       
{EntityLoading && <LoadingScreen />}
            <div className="flex justify-between items-center  h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                {
                    page === 'asset' ?
                        <TypographyNDL value='Asset' variant='heading-02-xs' />
                        :
                        <React.Fragment>
                            <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
                            <div className="flex gap-2">
                                <Button type="secondary" value={t('Cancel')} onClick={() => { setPage('asset'); props.handleHide(false) }} />
                                <Button type="primary" value={isEdit ? "Update" :t('Save')} loading={buttonLoader} onClick={() => handleSaveAsset()} />
                            </div>
                        </React.Fragment>

                }
            </div>

        <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" >
            {
                  page === 'asset' ?
                  <EnhancedTable
                  headCells={headCells}
                  data={tabledata}
                  style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
                  buttonpresent={currUserRole.id === 2 ? "New Asset" : ''}
                  search={true}
                  download={true}
                  onClickbutton={handleCreateOrder}
                  actionenabled={true}
                  rawdata={filteredEntityData.length > 0 ?filteredEntityData : []}
                  handleEdit={(id, value) => handleDialogEdit(value,id )}
                  handleDelete={(id, value) => deleteTaskfn(value,id )} 
                  enableDelete={true}
                  enableEdit={true}
                  Buttonicon={Plus}
                  verticalMenu={true}
                  groupBy={ 'assets_settings'}
                  onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                  page={pageidx}
                  rowsPerPage={rowsPerPage}
                  />
                  :
                  <AddEntity
                  ref={EntityRef}
                  handleActiveIndex={(e)=>handleActiveIndex(e)}
                  style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}}
                  getUpdatedEntityList={()=>{getEntity(headPlant.id);getAnalyticConfigList()}}
                  AnalyticConfigListData={!AnalyticConfigListLoading && AnalyticConfigListData && !AnalyticConfigListError ? AnalyticConfigListData : []}
                  instrumentMetricsListData={ !instrumentMetricsListLoading && instrumentMetricsListData && !instrumentMetricsListError ? instrumentMetricsListData : []}
                  />

            }
               
                 
        </div>

        <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={OpenModel}>
        <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Are you sure want to delete ?")} />
        </ModalHeaderNDL>
        <ModalContentNDL>

            <TypographyNDL variant='paragraph-s' color='secondary' value={"Do you really want to delete the asset? This action cannot be undone."} />

        </ModalContentNDL>
        <ModalFooterNDL>
            <Button value={t('Cancel')}  type="secondary" onClick={() => { handleDialogClose() }} />
            <Button value={t('Delete')} loading={BtnLoad} danger  onClick={()=>handleDeleteAsset()} />
       
        </ModalFooterNDL>
    </ModalNDL> 
    </React.Fragment>


    )
}//NOSONAR end