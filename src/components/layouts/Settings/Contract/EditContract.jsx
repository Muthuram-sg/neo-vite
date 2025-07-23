import React, { useState, useEffect, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'  
import 'components/style/customize.css';
import { useRecoilState } from "recoil";
import { VirtualInstrumentsList, selectedPlant, lineEntity, snackMessage, snackToggle, snackType } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import Delete from 'assets/neo_icons/Notification/Delete.svg?react';
import Button from "components/Core/ButtonNDL"; 
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL"; 
import useUpdateLineDetails from "components/layouts/Settings/factors/Factor/hooks/useUpdateLine";
import useSavedLineDetails from "components/layouts/Settings/factors/Factor/hooks/useSavedLineDetails"; 
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";  
 
const EditContract = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant); 
  const [addConFields, setAddConFields] = useState([{ field: 1,contract:'',Entities: [{field: 1,node:'',VirtualInstr: ''}] }]);
  const [entity] = useRecoilState(lineEntity);
  const [vInstruments] = useRecoilState(VirtualInstrumentsList); 
  const [IsContract,setIsContract] = useState(false);  
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);  
  const { outLineLoading, outLineData, outLineError, getUpdateLineDetails } = useUpdateLineDetails();
  const { updatedLineLoading, updatedLineData, updatedLineError, getSavedLineDetails } = useSavedLineDetails(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps

    useImperativeHandle(ref, () =>
    (
        {
        SaveContract: () => {
            SaveContract()
        } 
        }
    )
    ) 
   
  useEffect(() => { 
    if(headPlant.node && headPlant.node.energy_contract){
        setAddConFields(headPlant.node.energy_contract.contracts)
        setIsContract(headPlant.node.energy_contract.IsContract)
    }else{
        setAddConFields([{ field: 1,contract:'',Entities: [{field: 1,node:'',VirtualInstr: ''}] }])
        setIsContract(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])
  
  useEffect(() => {
    if (
      updatedLineData  &&
      !updatedLineError &&
      !updatedLineLoading
    ) {  
      if (updatedLineData.neo_skeleton_lines) {
        var temp = JSON.parse(JSON.stringify(updatedLineData.neo_skeleton_lines[0]))
        setheadPlant(temp)
      }
      SetMessage(t('LineDetailsUpdate'))
      SetType("success")
      setOpenSnack(true)  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedLineData,updatedLineError,updatedLineLoading])

  useEffect(() => {
    if (
      outLineData !== null &&
      !outLineError &&
      !outLineLoading
    ) {
      getSavedLineDetails(headPlant.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLineData])  

  function handleCheck(e){ 
    setIsContract(!IsContract)
  } 

function SaveContract(){ 

    if(addConFields.length === 0){
        SetMessage(t('Please select Contracts Details'))
        SetType("warning")
        setOpenSnack(true)
        return false
    }else{
        if(addConFields.map(x=> x.contract).includes('')){
            SetMessage(t('Please select Contract'))
            SetType("warning")
            setOpenSnack(true)
            return false
        } 
        let EntityArr = []
        let ActualArr = []
        addConFields.forEach(v=> {
           
            v.Entities.forEach(n=>{
                EntityArr.push(n.node)
                ActualArr.push(n.VirtualInstr)
            })
            if(v.Entities.length === 0){
                EntityArr.push('')
                ActualArr.push('')
            }
        })
        // console.log(EntityArr,"EntityArrEntityArr",ActualArr)
        if(EntityArr.includes("")){
            SetMessage(t('Please select Entity'))
            SetType("warning")
            setOpenSnack(true)
            return false
        }
        if(ActualArr.includes(" ")){
            SetMessage(t('Please select Actual'))
            SetType("warning")
            setOpenSnack(true)
            return false
        }
    }
    let NodeObj = headPlant.node ? headPlant.node : {}
    let ContractObj = {}
    ContractObj["energy_contract"] = {contracts : addConFields,IsContract: IsContract}
    let FinalObj = {...NodeObj,...ContractObj} 
    getUpdateLineDetails(
        {line_id:headPlant.id,location:headPlant.location},
        headPlant.name,
        headPlant.energy_asset,
        headPlant.dash_aggregation,
        headPlant.mic_stop_duration,
        headPlant.shift,
        FinalObj,
    );
} 
const onHandleNodes = (e,row,val) => {
    EntitiesFnc(e,row,val,"node","Entity")  
}

const onHandleActual = (e,row,val) => { 
    EntitiesFnc(e,row,val,"VirtualInstr","Actual") 
}

function EntitiesFnc(e,row,val,type,msg){
    let setelement = [...addConFields];
    let obj = {...setelement[row]} 
    let objarr = [...obj.Entities]
    let enObj = {...objarr[val]}
    // console.log(obj,"objarr",objarr,setelement[row],"setelement",setelement,enObj)
    if(setelement[row].Entities.map(v=> v[type]).includes(e.target.value)){
        enObj[type] = ''
        objarr[val] = enObj
        obj.Entities = objarr
        SetMessage(t(msg+' Already Exist'))
        SetType("warning")
        setOpenSnack(true)
    }else{
        enObj[type] = e.target.value
        objarr[val] = enObj
        obj.Entities = objarr
    } 
    setelement[row] = obj
     setAddConFields(setelement);
}
 
function deleteEntityRow(row,val){
    let setelement = [...addConFields];
    let objarr = [...setelement[row].Entities] 
    let removed = objarr.filter(x => x.field !== val);
    let obj = {...setelement[row]}
    obj.Entities = removed 
    setelement[row] = obj
    setAddConFields(setelement);
} 

function AddEntityField(row){
    let setelement = [...addConFields];
    const lastfield = setelement.length > 0 && setelement[row].Entities.length >0 ? Number(setelement[row].Entities[setelement[row].Entities.length - 1].field) + 1 : 1;
    let objarr = [...setelement[row].Entities] 
    objarr.push({ field: lastfield,node:'',VirtualInstr: '' })
    let obj = {...setelement[row]}
    obj.Entities = objarr 
    setelement[row] = obj 
    // console.log(setelement,"setelementsetelement",objarr,obj)
    setAddConFields(setelement);
}

const onHandleContract = (e,row) => { 
    let setelement = [...addConFields];
    let obj = setelement[row]
    if(setelement.map(x=> x.contract).includes(e.target.value)){
        obj.contract = ''
    }else{
        obj.contract = e.target.value
    }
    setelement[row] = obj
    setAddConFields(setelement); 
}

function deleteContractRow(val){
    let setelement = [...addConFields]; 
    let removed = setelement.filter(x => x.field !== val);
    setAddConFields(removed);
}

function AddContractField(){
    let setelement = [...addConFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield ,contract:'',Entities: [{field: 1,node:'',VirtualInstr: ''}] }); 
    setAddConFields(setelement);
}

return (
    <div className="p-4" style={{height: 'calc(100vh - 185px)',overflow:'auto'}}> 
 
           <Grid container spacing={2} >
                
                <Grid item xs={10} sm={10}>
                    <TypographyNDL variant="label-02-s">{t('Energy Contract')}</TypographyNDL>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <SwitchCustom
                        switch={true}
                        checked={IsContract}
                        onChange={(e) => handleCheck(e)}
                        primaryLabel={''} 
                    />
                </Grid>
                {addConFields.map((val,i)=>{
                    return (
                        <React.Fragment>
                            <Grid item xs={10} sm={10} key={i}>
                                <SelectBox
                                labelId="test"
                                id="test-water"
                                auto
                                label={t('Contract')} 
                                options={entity.filter(f=>f.entity_type === 4)}
                                value={val.contract}
                                onChange={(e)=>onHandleContract(e,i)}
                                keyValue="name"
                                keyId="id" 
                                />
                                
                            </Grid> 
                        
                            <Grid item xs={2} sm={2} style={{display:'flex',alignItems: 'end'}}>
                                <Button icon={Delete} type={'ghost'} onClick={()=>deleteContractRow(val.field)}/>
                            </Grid>
                            {val.Entities.map((x,idx)=>{
                                return (
                                    <React.Fragment>
                                        <Grid item xs={5} sm={5} key={idx}>
                                            <SelectBox
                                            labelId="test"
                                            id="test-asset"
                                            auto
                                            label={t('Entity')} 
                                            options={entity.filter(f=>f.entity_type === 2)}
                                            value={x.node}
                                            onChange={(e)=>onHandleNodes(e,i,idx)}
                                            keyValue="name"
                                            keyId="id" 
                                            />
                                        </Grid>
                                        <Grid item xs={5} sm={5}>
                                            <SelectBox
                                                labelId="Nodes"
                                                id="combo-box-Nodes-LPG"
                                                label={t('Actual')}
                                                auto
                                                options={vInstruments}
                                                value={x.VirtualInstr}
                                                onChange={(e) => onHandleActual(e,i,idx)}
                                                keyValue="name"
                                                keyId="id" 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2} style={{display:'flex',alignItems: 'end'}}>
                                            <Button icon={Delete} type={'ghost'} onClick={()=>deleteEntityRow(i,x.field)}/>
                                        </Grid>
                                    </React.Fragment>
                                )
                            })}
                            
                            <Grid item xs={12} sm={12} style={{marginLeft:'auto'}}>
                                <Button type="tertiary" value={t("Add")} onClick={()=>AddEntityField(i)} icon={Plus} />
                            </Grid>
                            <Grid item xs={12} sm={12} style={{margin: '15px 0'}}>
                                <HorizontalLine variant="divider1" />
                            </Grid>

                        </React.Fragment>
                    )
                })}
                
                <Grid item xs={12} sm={12} style={{marginLeft:'auto'}}>
                    <Button type="tertiary" value={t("Add Field")} onClick={()=>AddContractField()} icon={Plus} />
                </Grid>

            </Grid> 
    </div>
  );

})

export default EditContract;
