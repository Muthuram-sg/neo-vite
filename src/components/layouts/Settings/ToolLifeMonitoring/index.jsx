import React, { useState, useEffect,useRef } from "react";
import Grid from 'components/Core/GridNDL'
import LoadingScreenNDL from "LoadingScreenNDL"; 
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import ToolModal from "components/layouts/Settings/ToolLifeMonitoring/ToolModal";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useToolLife from "./hooks/useToolLife.jsx"
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useAssetType from 'components/layouts/Settings/Entity/hooks/useAssetType.jsx';

export default function Tool() {
    const { t } = useTranslation(); 
    const [headPlant] = useRecoilState(selectedPlant);
    const [ToolDialog, setToolDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [loading, setLoading] = useState(false)
    const [tabledata, setTableData] = useState([])
    const { ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife } = useToolLife(); 
    const [ToolLifeDataList, setToolLifeDataList] = useState([]);
    const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } = useAssetType(); 
    const ToolRef= useRef()
    useEffect(() => {
        getToolLife(headPlant.id)
        getAssetType() 
        setLoading(true)
    }, [headPlant])

    useEffect(() => {
        if (!ToolLifeLoading && !ToolLifeError && ToolLifeData) {
            console.log(ToolLifeData,"ToolLifeData")
          if (ToolLifeData.length > 0) {
            processedrows()
          }else{
            setLoading(false)
            setTableData([])
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [ToolLifeLoading, ToolLifeData, ToolLifeError]) 
     
    const headCells = [

        {
            id: 'S.No',
            numeric: false,
            disablePadding: false,
            label: t('S.No'),
            width: 100
        },
        {
            id: 'Name',
            numeric: false,
            disablePadding: false,
            label: t('Name'),
            width: 100
        },
        {
            id: 'Asset Type',
            numeric: false,
            disablePadding: false,
            label: t('Asset Type'),
            width: 120
        },
        {
            id: 'Last Updated on',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated on'),
            width: 150
        },
        {
            id: 'Last Updated by',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated by'),
            width: 150
        },

        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('TOOL ID'),
            hide: true,
            display: "none",
            width: 100

        }

    ]; 
 
    const handleNewTool = () => { 
        setToolDialog(true); 
        setDialogMode('create');  
    }

    const handleDialogClose = () => {
        setToolDialog(false); 
    }
    const handleDialogEdit =(id, value)=>{  
        setToolDialog(true);
        setDialogMode('edit'); 
        ToolRef.current.handleEditToolDialogOpen(value)

    }
    const deleteToolLife=(id,value)=>{
        setToolDialog(true)
        setDialogMode('delete'); 
        ToolRef.current.handleToolDelete(id,value)
    }
    const processedrows = () => {
        var temptabledata = []
        if (!ToolLifeLoading && ToolLifeData && !ToolLifeError) {
            setToolLifeDataList(ToolLifeData)
            temptabledata = temptabledata.concat(ToolLifeData.map((val, index) => { 
                return [index+1,  val.name, val.asset_type.name, moment(val.updated_ts).format('DD/MM/YYYY HH:mm:ss') ,val.userByCreatedBy.name,val.id]
            }) 
            )
            // setInstrumentArray(ToolLifeData.map(val => val.instrument_id && val.instrument_id.length > 0 ? val.instrument_id.map(x => x.id) : []));
        } 
        setLoading(false)
        setTableData(temptabledata)
    }
    return (

        <React.Fragment>
                {loading && <LoadingScreenNDL />}
                <ToolModal
                    ToolDialog={ToolDialog}
                    dialogMode={dialogMode}
                    handleToolDialogClose={() => handleDialogClose()}
                    refreshTable={()=>{getToolLife(headPlant.id);setLoading(true)}}
                    AssetTypeData={!AssetTypeLoading && AssetTypeData && !AssetTypeError ? AssetTypeData : []} 
                    ref={ToolRef}
                    ToolList={ToolLifeDataList}

                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="h-[48px] py-3 px-4 border-b border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Tools' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4">
                        <EnhancedTable
                            headCells={headCells}
                           data={tabledata}
                            buttonpresent={t("New Tool")}
                            onClickbutton={handleNewTool}
                            actionenabled={true}
                            rawdata={ToolLifeDataList}
                            handleEdit={(id, value) => handleDialogEdit(id, value)}
                            handleDelete={(id, value) => deleteToolLife(id, value)} 
                            enableDelete={true}
                            enableEdit={true}
                            search={true}
                            download={true}
                            Buttonicon={Plus}
                            rowSelect={true}
                            checkBoxId={"id"}
                        />
                        </div>
                      
                    </Grid>
                </Grid>
        </React.Fragment>
    );
}