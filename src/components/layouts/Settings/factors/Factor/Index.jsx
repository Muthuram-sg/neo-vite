import React, { useState, useEffect, useRef } from "react";
import Grid from 'components/Core/GridNDL'  
import 'components/style/customize.css';
import { useRecoilState } from "recoil";
import { VirtualInstrumentsList, selectedPlant, lineEntity, snackMessage, snackToggle, snackType } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import Button from "components/Core/ButtonNDL";
import useResourcesUnitPrice from "./hooks/useResourcesUnitPrice";
import useUpdateLineDetails from "./hooks/useUpdateLine";
import useSavedLineDetails from "./hooks/useSavedLineDetails";
import EditIcon from 'assets/neo_icons/Menu/EditMenu.svg?react'; 
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
 

export default function Factor() {
  const { t } = useTranslation();
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
  const [entity] = useRecoilState(lineEntity);
  const [vInstruments] = useRecoilState(VirtualInstrumentsList);
  const [, setTotCount] = useState(0);
  const [nodes, setnodes] = useState(null)
  const [ProductEnergy, setProductEnergy] = useState('')
  const [Iswater,setIswater] = useState(false);
  const [IsLPGgas,setIsLPGgas] = useState(false);
  const [IsCNGgas,setIsCNGgas] = useState(false);
  const [IsProd,setIsProd] = useState(false);
  
 
  const[SaveLoading,setSaveLoading]= useState(false);
  const [isdisabled, setIsdisabled] = useState(true);
  const [saveLine, setSaveline] = useState(false)
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle); 
  const [dashboardAggregation, setDashboardAggregation] = useState(headPlant.dash_aggregation);
  const [energyAsset, ] = useState(headPlant.energy_asset);
  const { outDTData, getResourcesUnitPrice } = useResourcesUnitPrice();
  const { outLineLoading, outLineData, outLineError, getUpdateLineDetails } = useUpdateLineDetails();
  const { updatedLineLoading, updatedLineData, updatedLineError, getSavedLineDetails } = useSavedLineDetails();
  const dashboardAggregationRef = useRef();
  const EnergyUnitRef = useRef();
  const WaterUnitRef = useRef();
  const LPGUnitRef = useRef();
  const CNGUnitRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps

   
  useEffect(() => {
    
    getResourcesUnitPrice(headPlant.id);
    setTotCount(entity.length)
    setnodes(headPlant.node && headPlant.node.nodes ? headPlant.node : null)
    setProductEnergy(headPlant.node && headPlant.node.product_energy ? headPlant.node.product_energy : '')
    setIsProd(headPlant.node && headPlant.node.product_energy ? true : false)
    if(saveLine){
      setSaveline(false)
      setIsdisabled(true)
    }
    if(headPlant.node && headPlant.node.nodes){
      let energyunit = headPlant.node.nodes.filter(e=> e.type && e.type === 1)
      let waterunit = headPlant.node.nodes.filter(e=> e.type && e.type === 2)
      let LPGunit = headPlant.node.nodes.filter(e=> e.type && e.type === 3)
      let CNGunit = headPlant.node.nodes.filter(e=> e.type && e.type === 4)
      
      if(EnergyUnitRef.current){
        if(energyunit.length >0){
          EnergyUnitRef.current.value = energyunit[0].price ? energyunit[0].price : 0
        }else{
            EnergyUnitRef.current.value = 0
        }        
      }
      if(WaterUnitRef.current){
        if(waterunit.length >0){
          WaterUnitRef.current.value = waterunit[0].price ? waterunit[0].price : 0
          setIswater(waterunit[0].checked ? waterunit[0].checked : false)
        }else{
          WaterUnitRef.current.value = 0
          setIswater(false)
        }
      }
      if(LPGUnitRef.current){
        if(LPGunit.length >0){
          LPGUnitRef.current.value = LPGunit[0].price ? LPGunit[0].price : 0
          setIsLPGgas(LPGunit[0].checked ? LPGunit[0].checked : false)
        }else{
          setIsLPGgas(false)
          LPGUnitRef.current.value = 0
        }
      }
      if(CNGUnitRef.current){
        if(CNGunit.length >0){
          CNGUnitRef.current.value = CNGunit[0].price ? CNGunit[0].price : 0
          setIsCNGgas(CNGunit[0].checked ? CNGunit[0].checked : false)
        }else{
          setIsCNGgas(false)
          CNGUnitRef.current.value = 0
        }
      }
      
    }else{
      if(EnergyUnitRef.current){
        EnergyUnitRef.current.value = 0
      }
      if(WaterUnitRef.current){
        WaterUnitRef.current.value = 0
      }
      if(LPGUnitRef.current){
        LPGUnitRef.current.value = 0
      }
      if(CNGUnitRef.current){
        CNGUnitRef.current.value = 0;
      }
      setIswater(false)
      setIsLPGgas(false)
      setIsCNGgas(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])
  useEffect(() => {
   
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [outDTData])
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
      setIsdisabled(false)
      setSaveline(false)
      setSaveLoading(false)
      handlecancelClick()


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

  const DashboardaggregationOpt = [
    { id: "mean", title: t('Mean') },
    { id: "min", title: t('Minimum') },
    { id: "max", title: t('Maximum') },
    { id: "last", title: t('Last') },  //The default Last should always be the last entry of aggregation mode
  ]
  const editfactordata = () => {
    if (isdisabled === true) {
      setIsdisabled(false)
      setSaveline(true)
    } else {
      setSaveline(false)
      setIsdisabled(true)
    }
  }
  const handlecancelClick = () => {
    setSaveline(false)
    setIsdisabled(true)
  }
  const onHandleDashboardaggregation = (e) => {
    setDashboardAggregation(e.target.value);
  }
  const onHandleEngAsset = (e,opt) => { 
    
    let tempnodes = nodes ? nodes.nodes.map(x=> x) : [] 
    let exist = tempnodes.filter(x=> x.type && x.type === 1).length
  
    if(exist){
      tempnodes = tempnodes.map(val=>{
        if(val.type === 1){
          return {...val,asset:e.target.value}
        }else{
          return val
        }
      })
    }else{
      tempnodes.push({type: 1,asset: e.target.value,nodes:[]})
    } 
 
    setnodes({ "nodes": tempnodes})
  }

  const onHandleWaterAsset = (e) => {
    let tempnodes = nodes ? nodes.nodes.map(x=> x) : [] 
    let exist = tempnodes.filter(x=> x.type === 2).length
    if(exist){
      tempnodes = tempnodes.map(val=>{
        if(val.type === 2){
          return {...val,asset:e.target.value,checked: Iswater}
        }else{
          return val
        }
      })
    }else{
      tempnodes.push({type: 2,asset: e.target.value,checked: Iswater,nodes:[]})
    } 
    setnodes({ "nodes": tempnodes })
    
  }

  const onHandleLPGAsset = (e) => {
    let tempnodes = nodes ? nodes.nodes.map(x=> x) : [] 
    let exist = tempnodes.filter(x=> x.type === 3).length
    if(exist){
      tempnodes = tempnodes.map(val=>{
        if(val.type === 3){
          return {...val,asset:e.target.value,checked: IsLPGgas}
        }else{
          return val
        }
      })
    }else{
      tempnodes.push({type: 3,asset: e.target.value,checked: IsLPGgas,nodes:[]})
    } 
    setnodes({ "nodes": tempnodes})
    
  }

  const onHandleCNGAsset = (e) => {
    let tempnodes = nodes ? nodes.nodes.map(x=> x) : [] 
    let exist = tempnodes.filter(x=> x.type === 4).length
    if(exist){
      tempnodes = tempnodes.map(val=>{
        if(val.type === 4){
          return {...val,asset:e.target.value,checked: IsCNGgas}
        }else{
          return val
        }
      })
    }else{
      tempnodes.push({type: 4,asset: e.target.value,checked: IsCNGgas,nodes:[]})
    } 
    setnodes({ "nodes": tempnodes})
    
  }
  
  const handleNodes = (e,type) => {
    var tempnodes = nodes ? [...nodes.nodes] : []
   
    if(type === 'water'){
      let exist = tempnodes.filter(x=> x.type === 2).length
      if(exist){
        tempnodes = tempnodes.map(val=>{
          if(val.type === 2){
            return {...val,nodes:e,checked: Iswater}
          }else{
            return val
          }
        })
      }else{
        tempnodes.push({type: 2,nodes: e,checked: Iswater})
      } 
      
    }else if(type === 'LPG'){
      let exist = tempnodes.filter(x=> x.type === 3).length
      if(exist){
        tempnodes = tempnodes.map(val=>{
          if(val.type === 3){
            return {...val,nodes:e,checked: IsLPGgas}
          }else{
            return val
          }
        })
      }else{
        tempnodes.push({type: 3,nodes: e,checked: IsLPGgas})
      }
    }else if(type === 'CNG'){
      let exist = tempnodes.filter(x=> x.type === 4).length
      if(exist){
        tempnodes = tempnodes.map(val=>{
          if(val.type === 4){
            return {...val,nodes:e,checked: IsLPGgas}
          }else{
            return val
          }
        })
      }else{
        tempnodes.push({type: 4,nodes: e,checked: IsLPGgas})
      }
    }else{
      let exist = tempnodes.filter(x=> x.type === 1).length
      if(exist){
        tempnodes = tempnodes.map(val=>{
          if(val.type === 1){
            return {...val,nodes:e}
          }else{
            return val
          }
        })
      }else{
        tempnodes.push({type: 1,nodes: e})
      } 
    }
   
    setnodes({ "nodes": tempnodes})

  }

  function handleCheck(e,val){
   
      if(val===1){
        setIswater(!Iswater)
        let tempnodes = nodes.nodes.map(value=>{
        
          if(value.type === 2){
            return {...value,checked: !Iswater}
          }else{
            return value
          }
        })
        setnodes({ "nodes": tempnodes})
      }else if(val===2){
        setIsLPGgas(!IsLPGgas)
        let tempnodes = nodes.nodes.map(value=>{
          if(value.type === 3){
            return {...value,checked: !IsLPGgas}
          }else{
            return value
          }
        })
        setnodes({ "nodes": tempnodes})
      }else if(val===4){
        setIsProd(!IsProd)
        setProductEnergy('')
      }else{
        setIsCNGgas(!IsCNGgas)
        let tempnodes = nodes.nodes.map(value=>{
          if(value.type === 4){
            return {...value,checked: !IsCNGgas}
          }else{
            return value
          }
        })
        setnodes({ "nodes": tempnodes})
      }
  }

  const UnitOption =[{id:1,name:'square Unit'},{id:2,name:'Ton'}]

  const PrimaryOption = [{id:1,name:'Product'},{id:2,name:'Characteristics'}]

  const ProductOption = [{id:1,name:'Tint'},{id:2,name:'Thickness'},{id:3,name:'Family'}]

  function onHandleUnit(e){
    setProductEnergy(ProductEnergy ? {...ProductEnergy,unit: e.target.value} : {unit: e.target.value,nodes:[]})
  }

  function onHandlePrimary(e){
    setProductEnergy(ProductEnergy ? {...ProductEnergy,primary: e.target.value} : {primary: e.target.value,nodes:[]})
  }

  function onHandleProdNodes(e){
    setProductEnergy(ProductEnergy ? {...ProductEnergy,nodes: e} : {nodes: e})
  }

  function onHandleProdType(e){
    setProductEnergy( {...ProductEnergy,prod_type: e.target.value})
  }

  function FactorSave(){ 

    let Nodes = nodes ? nodes.nodes.map(x=>{
                          if(x.type === 1){
                            return {...x,price:EnergyUnitRef.current.value}
                          }else if(x.type === 2){
                            return {...x,price:WaterUnitRef.current.value}
                          }else if(x.type === 3){
                            return {...x,price:LPGUnitRef.current.value}
                          }else if(x.type === 4){
                            return {...x,price:CNGUnitRef.current.value}
                          }else{
                            return x
                          }
                        }) 
                : null
    if(IsProd){
      if(!ProductEnergy || (!ProductEnergy.unit || !ProductEnergy.primary)){
        SetMessage(t('Please select Unit and Primary Filter'))
        SetType("warning")
        setOpenSnack(true)
        return false
      }
      if(ProductEnergy.primary === 2 && !ProductEnergy.prod_type){
        SetMessage(t('Please select Type'))
        SetType("warning")
        setOpenSnack(true)
        return false
      }
    }
    // console.log(nodes,"nodes")
    let NodeObj = headPlant.node ? headPlant.node : {}
    let NodeArr ={"nodes": Nodes } 
    if(ProductEnergy){
      NodeArr ={"nodes": Nodes, product_energy: ProductEnergy}
    }
    let FinalObj = {...NodeObj,...NodeArr} 
    if(!dashboardAggregation){
      SetMessage(t('Please select Aggregation'))
      SetType("warning")
      setOpenSnack(true)
      return false
    }
    setSaveLoading(true)
    getUpdateLineDetails(
      {line_id:headPlant.id,location:headPlant.location},
      headPlant.name,
      energyAsset,
      dashboardAggregation,
      headPlant.mic_stop_duration,
      headPlant.shift,
      FinalObj,
    );
  }

  let EnergyAssertValue = (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 1).length) ? nodes.nodes.filter(x=> x.type === 1)[0].asset : ''
  let EnergyNodeValue =(nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 1).length) ? nodes.nodes.filter(x=> x.type === 1)[0].nodes : []
  let EnergyAssertValueType2  = (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 2).length) ? nodes.nodes.filter(x=> x.type === 2)[0].asset : ''
  let EnergyNodeValueType2= (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 2).length) ? nodes.nodes.filter(x=> x.type === 2)[0].nodes : []
 let EnergyAssertValueType3 = (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 3).length) ? nodes.nodes.filter(x=> x.type === 3)[0].asset : ''
 let EnergyNodeValueType3= (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 3).length) ? nodes.nodes.filter(x=> x.type === 3)[0].nodes : []
 let EnergyAssertValueType4 = (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 4).length) ? nodes.nodes.filter(x=> x.type === 4)[0].asset : ''
 let EnergyNodeValueType4 = (nodes && nodes.nodes && nodes.nodes.filter(x=> x.type === 4).length) ? nodes.nodes.filter(x=> x.type === 4)[0].nodes : []
 
 return (
<div className="p-4">
   
          <div>
          <Grid container >
            {saveLine === true ? 
            <Grid item xs={12}  style={{ display: 'flex' }}>
              <div style={{marginLeft:'auto',display: 'flex',columnGap:5}}>
                <Button type="secondary"  value={t('Cancel')} onClick={() => { handlecancelClick() }} />
                <Button type="primary"
                
                  onClick={()=>FactorSave()}
                  value={t('Save')}
                  loading={SaveLoading}
                />
                
              </div>
            </Grid> : ''}
            {saveLine === false ? <Grid item xs={12}  style={{ display: 'flex' }}>
              <div style={{marginLeft:'auto'}}>
                <Button type="ghost"
                  onClick={() => editfactordata()}
                  icon={EditIcon}
                  value={t('Edit')}
                />

              </div>


            </Grid> : ''}
            
          </Grid>
          </div> 
          <div >
            <Grid container spacing={2}>
             
              <Grid item xs={12} sm={12}>
                <SelectBox
                  labelId=""
                  id="dashboardAggregation"
                  inputRef={dashboardAggregationRef}
                  auto={false}
                  label={t('DashboardAggregation')}
                  multiple={false}
                  options={DashboardaggregationOpt}
                  isMArray={true}
                  checkbox={false}
                  value={dashboardAggregation}
                  onChange={onHandleDashboardaggregation}
                  keyValue="title"
                  keyId="id"
                  error={false}
                  disabled={isdisabled}
                />
              </Grid>  
              <Grid item xs={4} sm={4}>
                <InputFieldNDL 
                  id={"formula-name-Electricity"} 
                  label={"Electricity Unit Price"} 
                  inputRef={EnergyUnitRef}
                  type="number"
                  disabled={isdisabled}
                  />
              </Grid>
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="test"
                  auto={false}
                  label={t('Energy Asset')}
                  multiple={false}
                  options={vInstruments}
                  isMArray={true}
                  checkbox={false}
                  value={nodes ? EnergyAssertValue : ''}
                  onChange={onHandleEngAsset}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={isdisabled}
                />
              </Grid> 

              
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="Nodes"
                  id="combo-box-Nodes"
                  label={t('Nodes')}
                  auto={true}
                  multiple={true}
                  options={vInstruments}
                  isMArray={true}
                  value={nodes ? EnergyNodeValue : []}
                  onChange={(e) => handleNodes(e)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={isdisabled}
                  edit={true}
                  maxSelect={15}
                  info={"Node Selection is limited to 15"}
                />
              </Grid>
              
            </Grid>

            {/* Water Assets */}
            {(saveLine || (headPlant.node && headPlant.node.nodes && headPlant.node.nodes.filter(x=> x.type === 2).length > 0 && headPlant.node.nodes.filter(x=> x.type === 2)[0].checked ))  && 
        
           <Grid container spacing={2} style={{paddingTop:8}}>
                
                <Grid item xs={4} sm={4}>
                  <div style={{display:'flex'}}>
                    <SwitchCustom
                      switch={false}
                      checked={Iswater}
                      onChange={(e) => handleCheck(e, 1)}
                      primaryLabel={''}
                      disabled={isdisabled}
                    />
                    <div style={{width:'100%'}}>
                    <InputFieldNDL 
                      id={"formula-name-Water"} 
                      label={"Water Price"} 
                      inputRef={WaterUnitRef}
                      type="number"
                      disabled={Iswater ? isdisabled : true}
                      />
                    </div>
                    
                  </div>
                  
                </Grid>
                <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="test-water"
                  auto={false}
                  label={t('Energy Asset')}
                  multiple={false}
                  options={vInstruments}
                  isMArray={true}
                  checkbox={false}
                  value={nodes ? EnergyAssertValueType2 : ''}
                  onChange={onHandleWaterAsset}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={Iswater ? isdisabled : true}
                />
              </Grid> 

              
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="Nodes"
                  id="combo-box-Nodes-Water"
                  label={t('Nodes')}
                  auto={true}
                  multiple={true}
                  options={vInstruments}
                  isMArray={true}
                  value={nodes ? EnergyNodeValueType2 : []}
                  onChange={(e) => handleNodes(e,"water")}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={Iswater ? isdisabled : true}
                  maxSelect={15}
                  info={"Node Selection is limited to 15"}
                />
              </Grid>
            </Grid>}

            {/*LPG Gas Assets */}
            {(saveLine || (headPlant.node && headPlant.node.nodes && headPlant.node.nodes.filter(x=> x.type === 3).length > 0  && headPlant.node.nodes.filter(x=> x.type === 3)[0].checked)) &&
            <Grid container spacing={2} style={{paddingTop:8}}>
                
                <Grid item xs={4} sm={4}>
                  <div style={{display:'flex'}}>
                    <SwitchCustom
                      switch={false}
                      checked={IsLPGgas}
                      onChange={(e) => handleCheck(e, 2)}
                      primaryLabel={''}
                      disabled={isdisabled}
                    />
                    <div style={{width:'100%'}}>
                    <InputFieldNDL 
                      id={"formula-name-Water"} 
                      label={"LPG Gas Price"} 
                      inputRef={LPGUnitRef}
                      type="number"
                      disabled={IsLPGgas ? isdisabled : true}
                      />
                    </div>
                    
                  </div>
                  
                </Grid>
                <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="test-asset"
                  auto={false}
                  label={t('Energy Asset')}
                  multiple={false}
                  options={vInstruments}
                  isMArray={true}
                  checkbox={false}
                  value={nodes ? EnergyAssertValueType3 : ''}
                  onChange={onHandleLPGAsset}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsLPGgas ? isdisabled : true}
                />
              </Grid> 
              
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="Nodes"
                  id="combo-box-Nodes-LPG"
                  label={t('Nodes')}
                  auto={true}
                  multiple={true}
                  options={vInstruments}
                  isMArray={true}
                  value={nodes ? EnergyNodeValueType3 : []}
                  onChange={(e) => handleNodes(e,"LPG")}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsLPGgas ? isdisabled : true}
                  maxSelect={15}
                  info={"Node Selection is limited to 15"}
                />
              </Grid>
            </Grid>}

            {/*CNG Gas Assets */}
            {(saveLine || (headPlant.node && headPlant.node.nodes && headPlant.node.nodes.filter(x=> x.type === 4).length > 0 && headPlant.node.nodes.filter(x=> x.type === 4)[0].checked )) &&
            <Grid container spacing={2} style={{paddingTop:8}}>
                
                <Grid item xs={4} sm={4}>
                  <div style={{display:'flex'}}>
                    <SwitchCustom
                      switch={false}
                      checked={IsCNGgas}
                      onChange={(e) => handleCheck(e, 3)}
                      primaryLabel={''}
                      disabled={isdisabled}
                    />
                    <div style={{width:'100%'}}>
                    <InputFieldNDL 
                      id={"formula-name-Water"} 
                      label={"CNG Gas Price"} 
                      inputRef={CNGUnitRef}
                      type="number"
                      disabled={IsCNGgas ? isdisabled : true}
                      />
                    </div>
                  </div>
                  
                </Grid>
                <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="test-CNG"
                  auto={false}
                  label={t('Energy Asset')}
                  multiple={false}
                  options={vInstruments}
                  isMArray={true}
                  checkbox={false}
                  value={nodes ? EnergyAssertValueType4 : ''}
                  onChange={onHandleCNGAsset}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsCNGgas ? isdisabled : true}
                />
              </Grid> 
              
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="Nodes"
                  id="combo-box-Nodes-CNG"
                  label={t('Nodes')}
                  auto={true}
                  multiple={true}
                  options={vInstruments}
                  isMArray={true}
                  value={nodes ? EnergyNodeValueType4 : []}
                  onChange={(e) => handleNodes(e,"CNG")}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsCNGgas ? isdisabled : true}
                  maxSelect={15}
                  info={"Node Selection is limited to 15"}
                />
              </Grid>
            </Grid>}

            {/*Product Energy */}
            {(saveLine || ProductEnergy) &&
            <Grid container spacing={2} style={{paddingTop:8}}>
              <Grid item xs={12} sm={12}>
                <HorizontalLine variant="divider1" />
              </Grid>
              <Grid item xs={12} sm={12}>
                <SwitchCustom
                  switch={false}
                  checked={IsProd}
                  onChange={(e) => handleCheck(e, 4)}
                  primaryLabel={'Product Energy'}
                  disabled={isdisabled}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="test-Unit"
                  auto={false}
                  label={t('Unit')}
                  multiple={false}
                  options={UnitOption}
                  isMArray={true}
                  checkbox={false}
                  value={ProductEnergy && ProductEnergy.unit ? ProductEnergy.unit : ''}
                  onChange={onHandleUnit}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsProd ? isdisabled : true}
                />
              </Grid>
              <Grid item xs={8} sm={8}></Grid>
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="Prod-energy-node"
                  auto={false}
                  label={t('Product Energy Node')}
                  multiple={true}
                  options={vInstruments}
                  isMArray={true}
                  checkbox={false}
                  value={ProductEnergy ? ProductEnergy.nodes : []}
                  onChange={onHandleProdNodes}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsProd ? isdisabled : true}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <SelectBox
                  labelId="test"
                  id="Primary-filter"
                  auto={false}
                  label={t('Primary Filter')}
                  multiple={false}
                  options={PrimaryOption}
                  isMArray={true}
                  checkbox={false}
                  value={ProductEnergy && ProductEnergy.primary ? ProductEnergy.primary : ''}
                  onChange={onHandlePrimary}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsProd ? isdisabled : true}
                />
              </Grid>
              <Grid item xs={4} sm={4} style={{display:'flex',alignItems:'end'}}>
                {ProductEnergy && (ProductEnergy.primary === 2) &&
                <div style={{width:'100%'}}>
                <SelectBox
                  labelId="test"
                  id="Product-filter"
                  auto={false}
                  label={''}
                  placeholder={'Select Type'}
                  multiple={false}
                  options={ProductOption}
                  isMArray={true}
                  checkbox={false}
                  value={ProductEnergy && ProductEnergy.prod_type ? ProductEnergy.prod_type : ''}
                  onChange={onHandleProdType}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  disabled={IsProd ? isdisabled : true}
                /></div>}
              </Grid>     
            </Grid>
            }
          </div>
     
    </div>
  );
}
