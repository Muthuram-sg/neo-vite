import React, { useState, useEffect, useRef } from "react";
import Grid from 'components/Core/GridNDL'  
import 'components/style/customize.css';
import { useRecoilState } from "recoil";
import { selectedPlant, themeMode, lineEntity ,VirtualInstrumentsList} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next'; 
import Button from "components/Core/ButtonNDL"; 
import EditIcon from 'assets/neo_icons/Menu/EditMenu.svg?react'; 
import EnhancedTable from "components/Table/Table";
import EditModal from './EditContract'
 

export default function Contract() {
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [curTheme]=useRecoilState(themeMode)
  const [entity] = useRecoilState(lineEntity);
  const [vInstruments] = useRecoilState(VirtualInstrumentsList); 
  const [tabledata, setTableData] = useState([])
  const ContractRef = useRef(); 
  const [saveLine, setSaveline] = useState(false)  
  // eslint-disable-next-line react-hooks/exhaustive-deps 

  const headCells = [
    {
        id: 'Sno',
        numeric: false,
        disablePadding: true,
        label: t('SNo'),
    },
    {
        id: 'contract',
        numeric: false,
        disablePadding: true,
        label: t('Name'),
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
    if(headPlant.node && headPlant.node.energy_contract && (vInstruments.length > 0) && (entity.length > 0)){
        setSaveline(false)
        let TableVal = headPlant.node.energy_contract.contracts.map((val,i)=>{
            let EntityCon = entity.filter(f=> f.id === val.contract)
            let ContractName = EntityCon.length > 0 ? EntityCon[0].name : ''
            
            let EntityName=[]
            let ActualName=[]
            val.Entities.forEach(x=>{
                let Virtual = vInstruments.filter(f=> f.id === x.VirtualInstr)
                let EntityNode = entity.filter(f=> f.id === x.node)
                EntityName.push(EntityNode.length > 0 ? EntityNode[0].name:'')
                ActualName.push(Virtual.length > 0 ? Virtual[0].name : '')
            })
            return [i+1,ContractName,EntityName.toString(),ActualName.toString()]
        })
        setTableData(TableVal) 
    }else{
        setTableData([]) 
        setSaveline(true)
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[headPlant,entity,vInstruments])  

  const editfactordata = () => {
    setSaveline(!saveLine)
    
  }
  const handlecancelClick = () => {
    setSaveline(false) 
  }  

  function FactorSave(){  
    ContractRef.current.SaveContract()
  }

  
 return (
<div className="p-4">
   
          <div>
          <Grid container >
            
           <Grid item xs={12}  style={{ display: 'flex' }}>
            {saveLine ?
                <div style={{marginLeft:'auto',display: 'flex',columnGap:5}}>
                    {tabledata.length > 0 && <Button type="secondary"  value={t('Cancel')} onClick={() => { handlecancelClick() }} />}
                    <Button type="primary"
                    
                    onClick={()=>FactorSave()}
                    value={t('Save')}
                    />
                    
                </div>
                :
                <div style={{marginLeft:'auto'}}>
                    <Button type="ghost"
                    onClick={() => editfactordata()}
                    icon={EditIcon}
                    value={t('Edit')}
                    />

                </div> 
            }
            </Grid>  
            
          </Grid>
          </div> 
        {saveLine ? 
            <EditModal ref={ContractRef}/>
            :
            <React.Fragment>
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    hidePagination
                    style={{backgroundColor:curTheme==='dark' ? "#000000" : "#ffff"}} 
                    rawdata={[]}
                     
                    />
            </React.Fragment>
        }
     
    </div>
  );
}
