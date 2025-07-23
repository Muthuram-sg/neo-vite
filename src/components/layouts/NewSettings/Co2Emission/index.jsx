import React, { useState, useEffect,useRef } from "react";
import Grid from 'components/Core/GridNDL'
import LoadingScreenNDL from "LoadingScreenNDL"; 
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant,themeMode } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import Co2Modal from "./Co2Modal.jsx";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Co2Setting from 'assets/neo_icons/Menu/settings_Co2.svg?react';
import useCo2Factor from "./hooks/useCo2Factor"
import TypographyNDL from "components/Core/Typography/TypographyNDL";

export default function Tool() {
    const { t } = useTranslation(); 
    const [headPlant] = useRecoilState(selectedPlant);

    const [ToolDialog, setToolDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [loading, setLoading] = useState(false)
    const [tabledata, setTableData] = useState([])
    const [defaultCo2,setdefaultCo2] = useState('')
    const { Co2FactorLoading, Co2FactorData, Co2FactorError, getCo2Factor } = useCo2Factor(); 
    const [Co2FactorDataList, setCo2FactorDataList] = useState([]);
    
    const ToolRef= useRef()
    useEffect(() => {
        getCo2Factor(headPlant.id)
        setLoading(true)
    }, [headPlant])

    useEffect(() => {
        if (!Co2FactorLoading && !Co2FactorError && Co2FactorData) {
          if (Co2FactorData.length > 0) {
            let DefVal = Co2FactorData.filter(f=> f.default_value)
            setdefaultCo2(DefVal.length>0 ? DefVal[0] : '')
            processedrows()
          }else{
            setLoading(false)
            setTableData([])
            setdefaultCo2('')
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [Co2FactorLoading, Co2FactorData, Co2FactorError]) 
     
    const headCells = [

        {
            id: 'S.No',
            numeric: false,
            disablePadding: false,
            label: t('S.No'),
        },
        {
            id: 'Co2 Value',
            numeric: false,
            disablePadding: false,
            label: t('Co2 Value'),
        },
        {
            id: 'Starts at',
            numeric: false,
            disablePadding: false,
            label: t('Starts at'),
        },
        {
            id: 'Ends at',
            numeric: false,
            disablePadding: false,
            label: t('Ends at'),
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
        setDialogMode('Update'); 
        ToolRef.current.handleEditToolDialogOpen(value)

    }
    
    
    const deleteCo2Factor=(id,value)=>{
        setToolDialog(true)
        setDialogMode('delete'); 
        ToolRef.current.handleToolDelete(id,value)
    }

    const OpenDefault=()=>{
        setToolDialog(true)
        setDialogMode('Default'); 
        ToolRef.current.handleDefault(defaultCo2)
    }

    const processedrows = () => {
        let temptabledata = []
        if (!Co2FactorLoading && Co2FactorData && !Co2FactorError) {
            setCo2FactorDataList(Co2FactorData.filter(f=> !f.default_value))
            temptabledata = temptabledata.concat(Co2FactorData.filter(f=> !f.default_value).map((val, index) => { 
                return [index+1, val.co2_value, moment(val.starts_at).format('DD/MM/YYYY'), moment(val.ends_at).format('DD/MM/YYYY') ]
            }) 
            )
        } 
        setLoading(false)
        setTableData(temptabledata)
    }
    return (

        <React.Fragment>
                {loading && <LoadingScreenNDL />}
                <Co2Modal
                    ToolDialog={ToolDialog}
                    dialogMode={dialogMode}
                    handleToolDialogClose={() => handleDialogClose()}
                    refreshTable={()=>{getCo2Factor(headPlant.id);setLoading(true)}}
                    ref={ToolRef}
                    Co2List={Co2FactorDataList}

                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="h-[48px] py-3 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Co2 Factor' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 bg-Background-bg-secondary h-[93vh] dark:bg-Background-bg-secondary-dark">
                        <EnhancedTable
                            headCells={headCells}
                           data={tabledata}
                            buttonpresent={t("Add Co2 Value")}
                            onClickbutton={handleNewTool}
                            actionenabled={true}
                            rawdata={Co2FactorDataList}
                            handleEdit={(id, value) => handleDialogEdit(id, value)}
                            handleDelete={(id, value) => deleteCo2Factor(id, value)} 
                            enableDelete={true}
                            enableEdit={true}
                            search={true}
                            download={true}
                            Buttonicon={Plus}
                            customIcon={Co2Setting}
                            // customIconStroke={currTheme === 'dark' ? '#' : '#'}
                            custIconActn={()=> OpenDefault()}
                        />
                        </div>
                      
                    </Grid>
                </Grid>
        </React.Fragment>
    );
}