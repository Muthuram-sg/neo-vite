import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'

import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import Grid from "components/Core/GridNDL";
import Button from 'components/Core/ButtonNDL'
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { lineEntity, VirtualInstrumentsList, selectedPlant,hierarchyData } from 'recoilStore/atoms'

import useResourcesUnitPrice from "../hooks/useResourcesUnitPrice";
import useUpdateLineDetails from "../hooks/useUpdateLine";
import AccordianNDL from 'components/Core/Accordian/AccordianNDL1'
import RadioButtonNDL from 'components/Core/RadioButton/RadioButtonNDL'
import Toast from 'components/Core/Toast/ToastNDL'
import HorizontalLineNDL from '../../../../../Core/HorizontalLine/HorizontalLineNDL'

const AddResourcePrice = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const headPlant = useRecoilValue(selectedPlant)
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [entity] = useRecoilState(lineEntity);
    const [resourcepriceDialog, setResourcepriceDialog] = useState(true);
    const [HierarchyData] = useRecoilState(hierarchyData);

    const [, setTotCount] = useState(0);
    const [nodes, setnodes] = useState(null)
    const [Iswater, setIswater] = useState(false);
    const [IsLPGgas, setIsLPGgas] = useState(false);
    const [IsCNGgas, setIsCNGgas] = useState(false);
    const [IsDiesel, setIsDiesel] = useState(false);
    const [IsSolar, setIsSolar] = useState(false);
    const [isNode,setisNode] = useState(true)
    const [isNodeWater,setisNodeWater] = useState(true)
    const [isNodeLPG,setisNodeLPG] = useState(true)
    const [isNodeCNG,setisNodeCNG] = useState(true)
    const [isNodeDiesel,setisNodeDiesel] = useState(true)
    const [isNodeSolar,setisNodeSolar] = useState(true)
    const [ electrcity,setelectrcity ] = useState(true)
    const [ water,setwater ] = useState(false)
    const [ lpg,setlpg ] = useState(false)
    const [ cng,setcng ] = useState(false)
    const [factorHierarchy,setfactorHierarchy] = useState({electrcity:'',water:'',lpg:'',cng:""})
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');

    const [dashboardAggregation, setDashboardAggregation] = useState(headPlant.dash_aggregation);
    const [energyAsset] = useState(headPlant.energy_asset);
    const { getResourcesUnitPrice } = useResourcesUnitPrice();
    const { outLineLoading, outLineData, outLineError, getUpdateLineDetails } = useUpdateLineDetails();
    const dashboardAggregationRef = useRef();
    const EnergyUnitRef = useRef();
    const WaterUnitRef = useRef();
    const LPGUnitRef = useRef();
    const CNGUnitRef = useRef();
    const DieselUnitRef = useRef();
    const SolarUnitRef = useRef();


    useEffect(() => {
        getResourcesUnitPrice(headPlant.id);
        setTotCount(entity.length)
        setnodes((headPlant.node && headPlant.node.nodes) ? headPlant.node : null)
        // let OverallNodes = headPlant.node
        // let hierarchyobj = {}
        // if(){

        // }
        setTimeout(() => {
            if (headPlant.node && headPlant.node.nodes) {
                let energyunit = headPlant.node.nodes.filter(e => e.type && e.type === 1)
                let waterunit = headPlant.node.nodes.filter(e => e.type && e.type === 2)
                let LPGunit = headPlant.node.nodes.filter(e => e.type && e.type === 3)
                let CNGunit = headPlant.node.nodes.filter(e => e.type && e.type === 4)
                let Dieselunit = headPlant.node.nodes.filter(e => e.type && e.type === 5)
                let Solarunit = headPlant.node.nodes.filter(e => e.type && e.type === 6)

                if (EnergyUnitRef.current) {
                    if (energyunit.length > 0) {
                        EnergyUnitRef.current.value = energyunit[0].price ? energyunit[0].price : 0
                        setisNode(energyunit[0].radio && energyunit[0].radio === 'hierarchy' ? false :true)
                    } else {
                        EnergyUnitRef.current.value = 0
                    }
                }
                if (WaterUnitRef.current) {
                    if (waterunit.length > 0) {
                        WaterUnitRef.current.value = waterunit[0].price ? waterunit[0].price : 0
                        setIswater(waterunit[0].checked ? waterunit[0].checked : false)
                        setisNodeWater( waterunit[0].radio  && waterunit[0].radio === 'hierarchy' ? false : true)
                    } else {
                        WaterUnitRef.current.value = 0
                        setIswater(false)
                    }
                }
                if (LPGUnitRef.current) {
                    if (LPGunit.length > 0) {
                        LPGUnitRef.current.value = LPGunit[0].price ? LPGunit[0].price : 0
                        setIsLPGgas(LPGunit[0].checked ? LPGunit[0].checked : false)
                        setisNodeLPG( LPGunit[0].radio && LPGunit[0].radio === 'hierarchy' ? false : true)
                    } else {
                        setIsLPGgas(false)
                        LPGUnitRef.current.value = 0
                    }
                }
                if (CNGUnitRef.current) {
                    if (CNGunit.length > 0) {
                        CNGUnitRef.current.value = CNGunit[0].price ? CNGunit[0].price : 0
                        setIsCNGgas(CNGunit[0].checked ? CNGunit[0].checked : false)
                        setisNodeCNG(CNGunit[0].radio  && CNGunit[0].radio === 'hierarchy' ? false : true)
                    } else {
                        setIsCNGgas(false)
                        CNGUnitRef.current.value = 0
                    }
                }
                if (DieselUnitRef.current) {
                    if (Dieselunit.length > 0) {
                        DieselUnitRef.current.value = Dieselunit[0].price ? Dieselunit[0].price : 0
                        setIsDiesel(Dieselunit[0].checked ? Dieselunit[0].checked : false)
                        setisNodeDiesel(Dieselunit[0].radio  && Dieselunit[0].radio === 'hierarchy' ? false : true)
                    } else {
                        setIsDiesel(false)
                        DieselUnitRef.current.value = 0
                    }
                }
                if (SolarUnitRef.current) {
                    if (Solarunit.length > 0) {
                        SolarUnitRef.current.value = Solarunit[0].price ? Solarunit[0].price : 0
                        setIsSolar(Solarunit[0].checked ? Solarunit[0].checked : false)
                        setisNodeSolar(Solarunit[0].radio  && Solarunit[0].radio === 'hierarchy' ? false : true)
                    } else {
                        setIsSolar(false)
                        SolarUnitRef.current.value = 0
                    }
                }

            } else {
                if (EnergyUnitRef.current) {
                    EnergyUnitRef.current.value = 0
                }
                if (WaterUnitRef.current) {
                    WaterUnitRef.current.value = 0
                }
                if (LPGUnitRef.current) {
                    LPGUnitRef.current.value = 0
                }
                if (CNGUnitRef.current) {
                    CNGUnitRef.current.value = 0;
                }
                if (DieselUnitRef.current) {
                    DieselUnitRef.current.value = 0;
                }
                if (SolarUnitRef.current) {
                    SolarUnitRef.current.value = 0;
                }
                setIswater(false)
                setIsLPGgas(false)
                setIsCNGgas(false)
                setIsDiesel(false)
                setIsSolar(false)
            }
        }, 200)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if (
            outLineData !== null &&
            !outLineError &&
            !outLineLoading
        ) {
            props.getSavedLineDetails(headPlant.id)
            handleDialogClosefn()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outLineData])

    const DashboardaggregationOpt = [
        { id: "mean", title: t('Mean') },
        { id: "min", title: t('Minimum') },
        { id: "max", title: t('Maximum') },
        { id: "last", title: t('Last') },  //The default Last should always be the last entry of aggregation mode
    ]

    useImperativeHandle(ref, () =>
    (
        {
            handleResourcePriceEdit: (data) => {
                setResourcepriceDialog(true);
            }

        }
    ))


    const onHandleDashboardaggregation = (e) => {
        setDashboardAggregation(e.target.value);
    }
    const onHandleEngAsset = (e, opt) => {

        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type && x.type === 1).length
        console.log(tempnodes, "tempnodes", e, opt, exist)
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === 1) {
                    return { ...val, asset: e.target.value }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: 1, asset: e.target.value, nodes: [] })
        }
        console.log(tempnodes, "tempnodes")
        setnodes({ "nodes": tempnodes })
    }

    const onHandleWaterAsset = (e) => {
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type === 2).length
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === 2) {
                    return { ...val, asset: e.target.value, checked: Iswater }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: 2, asset: e.target.value, checked: Iswater, nodes: [] })
        }
        setnodes({ "nodes": tempnodes })

    }

    const onHandleAsset = (e,type,value) => {
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type === type).length
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === type) {
                    return { ...val, asset: e.target.value, checked: value }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: type, asset: e.target.value, checked: value, nodes: [] })
        }
        setnodes({ "nodes": tempnodes })
    }

    const handleclick=(type)=>{
        if(type === 'electricity'){
            setelectrcity(!electrcity)
            setwater(false)
            setlpg(false)
            setcng(false)
        }
        else if(type === 'water'){
            setelectrcity(false)
            setwater(!water)
            setlpg(false)
            setcng(false)
        }
        else if(type === 'lpg'){
            setelectrcity(false)
            setwater(false)
            setlpg(!lpg)
            setcng(false)
        }
        else if(type === 'cng'){
            setelectrcity(false)
            setwater(false)
            setlpg(false)
            setcng(!cng)
        }
    }

    const onHandleLPGAsset = (e) => {
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type === 3).length
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === 3) {
                    return { ...val, asset: e.target.value, checked: IsLPGgas }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: 3, asset: e.target.value, checked: IsLPGgas, nodes: [] })
        }
        setnodes({ "nodes": tempnodes })

    }

    const onHandleCNGAsset = (e) => {
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type === 4).length
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === 4) {
                    return { ...val, asset: e.target.value, checked: IsCNGgas }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: 4, asset: e.target.value, checked: IsCNGgas, nodes: [] })
        }
        setnodes({ "nodes": tempnodes })

    }

    const handleNodes = (e, opt, type,bool) => {
        var tempnodes = nodes ? [...nodes.nodes] : []
        // console.log(opt,"optopt",e,tempnodes)
        const tempNodeFn = (data,int,value)=>{
            return data.map(val => {
                if (val.type === int) {
                    return { ...val, nodes: e, checked: value }
                } else {
                    return val
                }
            })
        }
        let exist = tempnodes.filter(x => x.type === type).length
        if (exist) {
            tempnodes = tempNodeFn(tempnodes,type,bool)
        } else {
            tempnodes.push({ type: type, nodes: e, checked: bool })
        } 
        // console.log("tempnodestempnodes", tempnodes)
        setnodes({ "nodes": tempnodes })

    }

    function handleCheck(e, val,bool) {
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        // tempnodes = nodes ? [...nodes.nodes,tempnodes] : []
        if (val === 2) {
            setIswater(!Iswater)
        } else if (val === 3) {
            setIsLPGgas(!IsLPGgas)
        } else if(val === 4){
            setIsCNGgas(!IsCNGgas)
        }else if(val === 6){
            setIsSolar(!IsSolar)
        }else {
            setIsDiesel(!IsDiesel)
        }
        let idx = tempnodes.findIndex(f=>f.type === val) 
        if(idx>=0){
            let obj = {}
            obj = {...tempnodes[idx],checked:bool}
            tempnodes[idx] = obj    
        }else{
            tempnodes.push({ type: val, nodes: [], checked: bool })    
        }
        // console.log(e.target.checked, val,bool,"e, val,bool",tempnodes,idx)
        setnodes({ "nodes": tempnodes })
    }

    


    const handleSaveResourcePrice = () => {
        let Nodes = nodes.nodes.map(x => {
            if (x.type === 1) {
                return { ...x, price: EnergyUnitRef.current.value }
            } else if (x.type === 2) {
                return { ...x, price: WaterUnitRef.current.value }
            } else if (x.type === 3) {
                return { ...x, price: LPGUnitRef.current.value }
            } else if (x.type === 4) {
                return { ...x, price: CNGUnitRef.current.value }
            }else if (x.type === 6) {
                return { ...x, price: SolarUnitRef.current.value }
            }else if (x.type === 5) {
                return { ...x, price: DieselUnitRef.current.value }
            } else {
                return x
            }
        })
        Nodes = Nodes.map(x=>{
            if(x.type === 2 && !('waterWaste' in x) && x.checked){
                return {...x,waterWaste:''}
            }else{
                return x
            }
        })
        console.log(Nodes,"WaterHierarchy")
        let checkArrayHierarchy = []
        let checkArrayNode = []
        Nodes.forEach(obj => {
            if (obj.radio && obj.radio === 'hierarchy' && !('selectedHierarchy' in obj) && obj.checked) {
                checkArrayHierarchy.push(false)
            }
          

        });
        if(checkArrayHierarchy.includes(false)){
            setOpenSnack(true)
            SetMessage("Please select hierarchy")
            SetType('warning')
            return false

        }

       
        Nodes.forEach(obj => {
            if (obj.radio && obj.radio === 'node' && !('nodes' in obj) && !('assert' in obj) && obj.checked) {
                checkArrayNode.push(false)
            }
        });
        if(checkArrayNode.includes(false)){
            setOpenSnack(true)
            SetMessage("Please select Energy Asset/Node")
            SetType('warning')
            return false

        }
        let NodeObj = { nodes: Nodes }
        let ContractObj = headPlant.node?.energy_contract !== undefined ? { energy_contract: headPlant.node?.energy_contract } : "";
        let ProductEnergyObj = headPlant.node?.product_energy !== undefined ? { product_energy: headPlant.node?.product_energy } : "";
        let FinalObj = { ...NodeObj, ...ProductEnergyObj, ...ContractObj }
        getUpdateLineDetails(
            headPlant.id,
            headPlant.location,
            headPlant.name,
            energyAsset,
            dashboardAggregation,
            headPlant.mic_stop_duration,
            headPlant.shift,
            FinalObj,
        );
        // handleDialogClosefn()
    }

    const handleDialogClosefn = () => {
        setResourcepriceDialog(false);
        props.handleDialogClose();
    }
    const TyperInsertNode = (nodes,type,value)=>{
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
            let exist = tempnodes.findIndex(x => x.type === value);
          // If the node type exists, update its 'radio' key if necessary
        if (exist !== -1) {
            tempnodes[exist] = {
                ...tempnodes[exist],
                radio: type
            };
        } else {
            // If the node type doesn't exist, push a new object with 'type' and 'radio' keys
            tempnodes.push({ type: value, radio: type });
        }   
            // console.log(tempnodes,"tempnodes")
            return tempnodes
    }
  
    const handleNodeHrType = (type,value) =>{
        if(value === 1){
            if(type === "node"){
                setisNode(true)
            }else{
                setisNode(false)
            }

        }else if(value ===2 ){
            if(type === "node"){
                setisNodeWater(true)
            }else{
                setisNodeWater(false)
            } 
        }else if(value ===3){
            if(type === "node"){
                setisNodeLPG(true)
            }else{
                setisNodeLPG(false)
            } 
        }else if(value ===4){
            if(type === "node"){
                setisNodeCNG(true)
            }else{
                setisNodeCNG(false)
            } 
        }else if(value ===6){
            if(type === "node"){
                setisNodeSolar(true)
            }else{
                setisNodeSolar(false)
            } 
        }else{
            if(type === "node"){
                setisNodeDiesel(true)
            }else{
                setisNodeDiesel(false)
            } 
        }
        setnodes({...nodes, "nodes": TyperInsertNode(nodes,type,value)})
       
    }

    const handleNodesHierarchy=(e,value)=>{
        var tempnodes = nodes ? [...nodes.nodes] : []
        // console.log(type,"type",e.target.value)
        const tempNodeFn = (data,type,val)=>{
            return data.map(val => {
                if (val.type === type) {
                    return { ...val, selectedHierarchy: e.target.value }
                } else {
                    return val
                }
            })
        } 
        let exist = tempnodes.filter(x => x.type === value).length
        if (exist) {
            tempnodes = tempNodeFn(tempnodes,value)
        } else {
            tempnodes.push({ type: value, selectedHierarchy: e.target.value })
        }
        setnodes({ "nodes": tempnodes })
    }

    const onHandleWaterWaste =(e)=>{
        let tempnodes = nodes ? nodes.nodes.map(x => x) : []
        let exist = tempnodes.filter(x => x.type === 2).length
        if (exist) {
            tempnodes = tempnodes.map(val => {
                if (val.type === 2) {
                    return { ...val, waterWaste:e.target.value }
                } else {
                    return val
                }
            })
        } else {
            tempnodes.push({ type: 2, waterWaste:e.target.value , nodes: [] })
        }
        setnodes({ "nodes": tempnodes })
    }

    let EnergyAssertValue = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 1).length) ? nodes.nodes.filter(x => x.type === 1)[0].asset : ''
    let EnergyNodeValue = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 1).length) ? nodes.nodes.filter(x => x.type === 1)[0].nodes : []
    let EnergyAssertValueType2 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 2).length) ? nodes.nodes.filter(x => x.type === 2)[0].asset : ''
    let EnergyNodeValueType2 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 2).length) ? nodes.nodes.filter(x => x.type === 2)[0].nodes : []
    let EnergyAssertValueType3 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 3).length) ? nodes.nodes.filter(x => x.type === 3)[0].asset : ''
    let EnergyNodeValueType3 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 3).length) ? nodes.nodes.filter(x => x.type === 3)[0].nodes : []
    let EnergyAssertValueType4 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 4).length) ? nodes.nodes.filter(x => x.type === 4)[0].asset : ''
    let EnergyNodeValueType4 = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 4).length) ?  nodes.nodes.filter(x => x.type === 4)[0].nodes : []
    let WaterWasteValue =  (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 2).length) ?  nodes.nodes.filter(x => x.type === 2)[0].waterWaste : ''
    let DieselAssetValue =  (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 5).length) ?  nodes.nodes.filter(x => x.type === 5)[0].asset : ''
    let DieselNodeValue = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 5).length) ? nodes.nodes.filter(x => x.type === 5)[0].nodes : []
    let SolarAssetValue =  (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 6).length) ?  nodes.nodes.filter(x => x.type === 6)[0].asset : ''
    let SolarNodeValue = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 6).length) ? nodes.nodes.filter(x => x.type === 6)[0].nodes : []
    // console.log(EnergyNodeValueType4,'EnergyNodeValueType4')

    //for hierarchy
    let ElectricityHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 1).length) ? nodes.nodes.filter(x => x.type === 1)[0].selectedHierarchy : ''
    let WaterHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 2).length) ? nodes.nodes.filter(x => x.type === 2)[0].selectedHierarchy : ''
    let LpgHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 3).length) ? nodes.nodes.filter(x => x.type === 3)[0].selectedHierarchy : ''
    let CngHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 4).length) ? nodes.nodes.filter(x => x.type === 4)[0].selectedHierarchy : ''
    let DieselHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 5).length) ? nodes.nodes.filter(x => x.type === 5)[0].selectedHierarchy : ''
    let SolarHierarchy = (nodes && nodes.nodes && nodes.nodes.filter(x => x.type === 6).length) ? nodes.nodes.filter(x => x.type === 6)[0].selectedHierarchy : ''

    return (
        <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>

            {props.resourcepriceDialog &&
                <React.Fragment>
                    <ModalHeaderNDL>
                        <TypographyNDL variant="heading-02-xs" model value={"Factors"} />
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <div >
                            <Grid container spacing={2} style={{ paddingBottom: "12px" }}>

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
                                    />
                                </Grid>
                            </Grid>
                            <HorizontalLineNDL variant='divider1' />

                            <AccordianNDL
                                title={"Electricity Price"}
                                isexpand={electrcity}
                                multiple
                                managetoggle={()=>handleclick('electricity')}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} >
                                        <div className='flex flex-col gap-2'>
                                            <InputFieldNDL
                                                id={"formula-name-Electricity"}
                                                label={"Electricity Unit Price"}
                                                inputRef={EnergyUnitRef}
                                                type="number"
                                            />
                                            <TypographyNDL value="Input electricity price and configure corresponding energy assets" color={"tertiary"} variant="paragraph-xs" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                   <RadioButtonNDL name={'Node'} id='node' labelText={"Node"}  checked={isNode} onChange={()=>handleNodeHrType('node',1)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                    <RadioButtonNDL name={'Hierarchy'} id='hierarchy' labelText={'Hierarchy'}  checked={!isNode} onChange={()=>handleNodeHrType('hierarchy',1)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNode && 
                                        <React.Fragment>
                                        <Grid item xs={6} sm={6}>
                                        <SelectBox
                                            labelId="test"
                                            id="test"
                                            auto={false}
                                            label={t('Main Electricity Source')}
                                            multiple={false}
                                            options={vInstruments.length > 0 ? vInstruments : [] }
                                            isMArray={true}
                                            checkbox={false}
                                            value={nodes && EnergyAssertValue ? EnergyAssertValue : ''}
                                            onChange={onHandleEngAsset}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                        />
                                    </Grid>


                                    <Grid item xs={6} sm={6}>
                                        <SelectBox
                                            labelId="Nodes"
                                            id="combo-box-Nodes"
                                            label={t('Nodes')}
                                            auto={true}
                                            multiple={true}
                                            options={vInstruments.length > 0 ? vInstruments : []}
                                            isMArray={true}
                                            value={nodes && EnergyNodeValue ? EnergyNodeValue : []}
                                            onChange={(e, option) => handleNodes(e, option,1)}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                            edit={true}
                                            maxSelect={15}
                                            info={"Node Selection is limited to 15"}
                                        />
                                    </Grid>
                                    </React.Fragment>
                                    }
                                    {
                                        !isNode  && 
                                            <Grid item xs={12} sm={12}>
                                        <SelectBox
                                            labelId="Hierarchy"
                                            id="combo-box-Hierarchy"
                                            label={t('Hierarchy')}
                                            auto={false}
                                            multiple={false}
                                            options={HierarchyData}
                                            isMArray={true}
                                            value={nodes ? ElectricityHierarchy :''}
                                            onChange={(e) => handleNodesHierarchy(e,1)}
                                            keyValue="name"
                                            keyId="id"
                                            
                                        />
                                    </Grid>

                                    }
                                    <Grid item xs={12} sm={12}>
                                        <div style={{ display: 'flex' }}>
                                            <SwitchCustom
                                                switch={false}
                                                checked={IsDiesel}
                                                onChange={(e) => handleCheck(e, 5,!IsDiesel)}
                                                primaryLabel={''}
                                            />
                                            <div style={{ width: '100%' }}>
                                                <InputFieldNDL
                                                    id={"formula-name-Diesel"}
                                                    label={"Diesel Unit Price"}
                                                    inputRef={DieselUnitRef}
                                                    type="number"
                                                    disabled={IsDiesel ? false : true}
                                                />
                                            </div>

                                           
                                        </div>

                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <RadioButtonNDL name={'Node5'} id='node5' labelText={"Node"}  checked={isNodeDiesel} onChange={()=>handleNodeHrType('node',5)} />
                                        <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <RadioButtonNDL name={'Hierarchy5'} id='hierarchy5' labelText={'Hierarchy'}  checked={!isNodeDiesel} onChange={()=>handleNodeHrType('hierarchy',5)} />
                                        <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNodeDiesel && 
                                        <React.Fragment>
                                        <Grid item xs={6} sm={6}>
                                            <SelectBox
                                                labelId="test"
                                                id="test-Diesel"
                                                auto={false}
                                                label={t('Energy Asset')}
                                                multiple={false}
                                                options={vInstruments.length > 0 ? vInstruments : []}
                                                isMArray={true}
                                                checkbox={false}
                                                value={nodes && DieselAssetValue ? DieselAssetValue : ''}
                                                onChange={(e)=>onHandleAsset(e,5,IsDiesel)}
                                                keyValue="name"
                                                keyId="id"
                                                error={false}
                                                disabled={IsDiesel ? false : true}
                                            />
                                        </Grid>


                                        <Grid item xs={6} sm={6}>
                                            <SelectBox
                                                labelId="Nodes"
                                                id="combo-box-Nodes"
                                                label={t('Nodes')}
                                                auto={true}
                                                multiple={true}
                                                options={vInstruments.length > 0 ? vInstruments : []}
                                                isMArray={true}
                                                value={nodes && DieselNodeValue ? DieselNodeValue : []}
                                                onChange={(e, option) => handleNodes(e, option, 5,IsDiesel)}
                                                keyValue="name"
                                                keyId="id"
                                                error={false}
                                                disabled={IsDiesel ? false : true}
                                                maxSelect={15}
                                                info={"Node Selection is limited to 15"}
                                            />
                                        </Grid>
                                        </React.Fragment>
                                    }
                                    {
                                        !isNodeDiesel &&  
                                        <Grid item xs={12} sm={12}>
                                            <SelectBox
                                                labelId="Hierarchy"
                                                id="combo-box-Hierarchy-diesel"
                                                label={t('Hierarchy')}
                                                auto={false}
                                                multiple={false}
                                                options={HierarchyData}
                                                isMArray={true}
                                                value={nodes && DieselHierarchy ? DieselHierarchy :''}
                                                onChange={(e) => handleNodesHierarchy(e,5)}
                                                keyValue="name"
                                                keyId="id" 
                                            />
                                        </Grid>

                                    }

                                    <Grid item xs={12} sm={12}>
                                        <div style={{ display: 'flex' }}>
                                            <SwitchCustom
                                                switch={false}
                                                checked={IsSolar}
                                                onChange={(e) => handleCheck(e, 6,!IsSolar)}
                                                primaryLabel={''}
                                            />
                                            <div style={{ width: '100%' }}>
                                                <InputFieldNDL
                                                    id={"formula-name-Solar"}
                                                    label={"Solar Unit Price"}
                                                    inputRef={SolarUnitRef}
                                                    type="number"
                                                    disabled={IsSolar ? false : true}
                                                />
                                            </div>

                                           
                                        </div>

                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <RadioButtonNDL name={'Node6'} id='node6' labelText={"Node"}  checked={isNodeSolar} onChange={()=>handleNodeHrType('node',6)} />
                                        <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <RadioButtonNDL name={'Hierarchy6'} id='hierarchy6' labelText={'Hierarchy'}  checked={!isNodeSolar} onChange={()=>handleNodeHrType('hierarchy',6)} />
                                        <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNodeSolar && 
                                        <React.Fragment>
                                        <Grid item xs={6} sm={6}>
                                            <SelectBox
                                                labelId="test"
                                                id="test-Solar"
                                                auto={false}
                                                label={t('Energy Asset')}
                                                multiple={false}
                                                options={vInstruments.length > 0 ? vInstruments : []}
                                                isMArray={true}
                                                checkbox={false}
                                                value={nodes && SolarAssetValue ? SolarAssetValue : ''}
                                                onChange={(e)=>onHandleAsset(e,6,IsSolar)}
                                                keyValue="name"
                                                keyId="id"
                                                error={false}
                                                disabled={IsSolar ? false : true}
                                            />
                                        </Grid>


                                        <Grid item xs={6} sm={6}>
                                            <SelectBox
                                                labelId="Nodes"
                                                id="combo-box-Nodes"
                                                label={t('Nodes')}
                                                auto={true}
                                                multiple={true}
                                                options={vInstruments.length > 0 ? vInstruments : []}
                                                isMArray={true}
                                                value={nodes && SolarNodeValue ? SolarNodeValue : []}
                                                onChange={(e, option) => handleNodes(e, option, 6, IsSolar)}
                                                keyValue="name"
                                                keyId="id"
                                                error={false}
                                                disabled={IsSolar ? false : true}
                                                maxSelect={15}
                                                info={"Node Selection is limited to 15"}
                                            />
                                        </Grid>
                                        </React.Fragment>
                                    }
                                    {
                                        !isNodeSolar &&  
                                        <Grid item xs={12} sm={12}>
                                            <SelectBox
                                                labelId="Hierarchy"
                                                id="combo-box-Hierarchy-diesel"
                                                label={t('Hierarchy')}
                                                auto={false}
                                                multiple={false}
                                                options={HierarchyData}
                                                isMArray={true}
                                                value={nodes && SolarHierarchy ? SolarHierarchy :''}
                                                onChange={(e) => handleNodesHierarchy(e,6)}
                                                keyValue="name"
                                                keyId="id" 
                                            />
                                        </Grid>

                                    }

                                    
                                </Grid>
                            </AccordianNDL>





                            {/* Water Assets */}
                            <div className='mt-3' />
                            <AccordianNDL
                                title={"Water Price"}
                                isexpand={water}
                                multiple
                                managetoggle={()=>handleclick('water')}
                            > <Grid container spacing={2} >

                                    <Grid item xs={12} sm={12}>
                                        <div style={{ display: 'flex' }}>
                                            <SwitchCustom
                                                switch={false}
                                                checked={Iswater}
                                                onChange={(e) => handleCheck(e, 2,!Iswater)}
                                                primaryLabel={''}
                                            />
                                            <div style={{ width: '100%' }}>
                                                <InputFieldNDL
                                                    id={"formula-name-Water"}
                                                    label={"Water Price"}
                                                    inputRef={WaterUnitRef}
                                                    type="number"
                                                    disabled={Iswater ? false : true}
                                                />
                                            </div>

                                           
                                        </div>

                                    </Grid>
                                    <Grid item xs={12} sm={12} >
                                    <SelectBox
                                            labelId="test"
                                            id="test"
                                            auto={false}
                                            label={t('Water Wastage')}
                                            multiple={false}
                                            options={vInstruments.length > 0 ? vInstruments : []}
                                            isMArray={true}
                                            checkbox={false}
                                            value={nodes && WaterWasteValue ? WaterWasteValue : ''}
                                            onChange={onHandleWaterWaste}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                            disabled={Iswater ? false : true}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                   <RadioButtonNDL name={'Node2'} id='node2' labelText={"Node"}  checked={isNodeWater} onChange={()=>handleNodeHrType('node',2)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                    <RadioButtonNDL name={'Hierarchy2'} id='hierarchy2' labelText={'Hierarchy'}  checked={!isNodeWater} onChange={()=>handleNodeHrType('hierarchy',2)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNodeWater && 
                                        <React.Fragment>
                                              <Grid item xs={6} sm={6}>
                                        <SelectBox
                                            labelId="test"
                                            id="test"
                                            auto={false}
                                            label={t('Energy Asset')}
                                            multiple={false}
                                            options={vInstruments.length > 0 ? vInstruments : []}
                                            isMArray={true}
                                            checkbox={false}
                                            value={nodes && EnergyAssertValueType2 ? EnergyAssertValueType2 : ''}
                                            onChange={onHandleWaterAsset}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                            disabled={Iswater ? false : true}
                                        />
                                    </Grid>


                                    <Grid item xs={6} sm={6}>
                                        <SelectBox
                                            labelId="Nodes"
                                            id="combo-box-Nodes"
                                            label={t('Nodes')}
                                            auto={true}
                                            multiple={true}
                                            options={vInstruments.length > 0 ? vInstruments : []}
                                            isMArray={true}
                                            value={nodes && EnergyNodeValueType2 ? EnergyNodeValueType2 : []}
                                            onChange={(e, option) => handleNodes(e, option,2, Iswater)}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                            disabled={Iswater ? false : true}
                                            maxSelect={15}
                                            info={"Node Selection is limited to 15"}
                                        />
                                    </Grid>
                                        </React.Fragment>
                                    }
                                    {
                                        !isNodeWater &&  
                                        <Grid item xs={12} sm={12}>
                                    <SelectBox
                                        labelId="Hierarchy"
                                        id="combo-box-Hierarchy"
                                        label={t('Hierarchy')}
                                        auto={false}
                                        multiple={false}
                                        options={HierarchyData}
                                        isMArray={true}
                                        value={nodes && WaterHierarchy ? WaterHierarchy :''}
                                        onChange={(e) => handleNodesHierarchy(e,2)}
                                        keyValue="name"
                                        keyId="id"
                                        // error={false}
                                        // edit={true}
                                        // maxSelect={15}
                                        // info={"Node Selection is limited to 15"}
                                    />
                                </Grid>

                                    }
                                    
                                  
                                </Grid>
                            </AccordianNDL>


                            {/*LPG Gas Assets */}
                            <div className='mt-3' />

                            <AccordianNDL
                                title={"LPG Gas  Price"}
                                isexpand={lpg}
                                multiple
                                managetoggle={()=>handleclick('lpg')}
                            >

                                <Grid container spacing={2} >

                                    <Grid item xs={12} sm={12}>
                                        <div style={{ display: 'flex' }}>
                                            <SwitchCustom
                                                switch={false}
                                                checked={IsLPGgas}
                                                onChange={(e) => handleCheck(e, 3,!IsLPGgas)}
                                                primaryLabel={''}
                                            />
                                            <div style={{ width: '100%' }}>
                                                <InputFieldNDL
                                                    id={"formula-name-Water"}
                                                    label={"LPG Gas Price"}
                                                    inputRef={LPGUnitRef}
                                                    type="number"
                                                    disabled={IsLPGgas ? false : true}
                                                />
                                            </div>

                                        </div>

                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                   <RadioButtonNDL name={'Nod3'} id='node3' labelText={"Node"}  checked={isNodeLPG} onChange={()=>handleNodeHrType('node',3)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                    <RadioButtonNDL name={'Hierarchy3'} id='hierarchy3' labelText={'Hierarchy'}  checked={!isNodeLPG} onChange={()=>handleNodeHrType('hierarchy',3)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNodeLPG && 
                                        <React.Fragment>
                                         <Grid item xs={6} sm={6}>
                                         <SelectBox
                                             labelId="test"
                                             id="test"
                                             auto={false}
                                             label={t('Energy Asset')}
                                             multiple={false}
                                             options={vInstruments.length > 0 ? vInstruments : []}
                                             isMArray={true}
                                             checkbox={false}
                                             value={nodes && EnergyAssertValueType3 ? EnergyAssertValueType3 : ''}
                                             onChange={onHandleLPGAsset}
                                             keyValue="name"
                                             keyId="id"
                                             error={false}
                                             disabled={IsLPGgas ? false : true}
                                         />
                                     </Grid>
 
                                     <Grid item xs={6} sm={6}>
                                         <SelectBox
                                             labelId="Nodes"
                                             id="combo-box-Nodes"
                                             label={t('Nodes')}
                                             auto={true}
                                             multiple={true}
                                             options={vInstruments.length > 0 ? vInstruments : []}
                                             isMArray={true}
                                             value={nodes && EnergyNodeValueType3 ? EnergyNodeValueType3 : []}
                                             onChange={(e, option) => handleNodes(e, option, 3,IsLPGgas)}
                                             keyValue="name"
                                             keyId="id"
                                             error={false}
                                             disabled={IsLPGgas ? false : true}
                                             maxSelect={15}
                                             info={"Node Selection is limited to 15"}
                                         />
                                         
                                     </Grid>
                                     </React.Fragment>

                                    }
                                    {
                                        !isNodeLPG && 
                                        <Grid item xs={12} sm={12}>
                                        <SelectBox
                                            labelId="Hierarchy"
                                            id="combo-box-Hierarchy"
                                            label={t('Hierarchy')}
                                            auto={false}
                                            multiple={false}
                                            options={HierarchyData}
                                            isMArray={true}
                                            value={nodes ? LpgHierarchy :''}
                                            onChange={(e) => handleNodesHierarchy(e,3)}
                                            keyValue="name"
                                            keyId="id"
                                          
                                        />
                                    </Grid>
                                    }
                                   
                                </Grid>
                            </AccordianNDL>

                            <div className='mt-3' />
                            <AccordianNDL
                                title={"CNG Gas  Price"}
                                isexpand={cng}
                                multiple
                                managetoggle={()=>handleclick('cng')}
                            >
                                <Grid container spacing={2} >

                                    <Grid item xs={12} sm={12}>
                                        <div style={{ display: 'flex' }}>
                                            <SwitchCustom
                                                switch={false}
                                                checked={IsCNGgas}
                                                onChange={(e) => handleCheck(e, 4,!IsCNGgas)}
                                                primaryLabel={''}
                                            />
                                            <div style={{ width: '100%' }}>
                                                <InputFieldNDL
                                                    id={"formula-name-Water"}
                                                    label={"CNG Gas Price"}
                                                    inputRef={CNGUnitRef}
                                                    type="number"
                                                    disabled={IsCNGgas ? false : true}
                                                />
                                            </div>
                                        </div>

                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                   <RadioButtonNDL name={'Node4'} id='node4'  labelText={"Node"}  checked={isNodeCNG} onChange={()=>handleNodeHrType('node',4)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from nodes" color={"tertiary"} variant="paragraph-xs" />
                                    
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                    <RadioButtonNDL name={'Hierarchy4'} id='hierarchy4' labelText={'Hierarchy'}  checked={!isNodeCNG} onChange={()=>handleNodeHrType('hierarchy',4)} />
                                   <TypographyNDL style={{marginLeft:"24px"}} value="Select Energy source from custom hierarchy" color={"tertiary"} variant="paragraph-xs" />
                                    </Grid>
                                    {
                                        isNodeCNG && 
                                        <React.Fragment>
                                            <Grid item xs={6} sm={6}>
                                                <SelectBox
                                                    labelId="test"
                                                    id="test"
                                                    auto={false}
                                                    label={t('Energy Asset')}
                                                    multiple={false}
                                                    options={vInstruments.length > 0 ? vInstruments : []}
                                                    isMArray={true}
                                                    checkbox={false}
                                                    value={nodes && EnergyAssertValueType4 ? EnergyAssertValueType4 : ''}
                                                    onChange={onHandleCNGAsset}
                                                    keyValue="name"
                                                    keyId="id"
                                                    error={false}
                                                    disabled={IsCNGgas ? false : true}
                                                />
                                            </Grid>

                                            <Grid item xs={6} sm={6}>
                                                <SelectBox
                                                    labelId="Nodes"
                                                    id="combo-box-Nodes"
                                                    label={t('Nodes')}
                                                    auto={true}
                                                    multiple={true}
                                                    options={vInstruments.length > 0 ? vInstruments : []}
                                                    isMArray={true}
                                                    value={nodes && EnergyNodeValueType4  ? EnergyNodeValueType4 : []}
                                                    onChange={(e, option) => handleNodes(e, option, 4,IsCNGgas)}
                                                    keyValue="name"
                                                    keyId="id"
                                                    error={false}
                                                    disabled={IsCNGgas ? false : true}
                                                    maxSelect={15}
                                                    info={"Node Selection is limited to 15"}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    }
                                    {
                                        !isNodeCNG && 
                                        <Grid item xs={12} sm={12}>
                                        <SelectBox
                                            labelId="Hierarchy"
                                            id="combo-box-Hierarchy"
                                            label={t('Hierarchy')}
                                            auto={false}
                                            multiple={false}
                                            options={HierarchyData}
                                            isMArray={true}
                                            value={nodes ? CngHierarchy :''}
                                            onChange={(e) => handleNodesHierarchy(e,4)}
                                            keyValue="name"
                                            keyId="id"
                                        
                                        />
                                    </Grid>
                                    }
                                  
                                </Grid>
                            </AccordianNDL>
                            {/*CNG Gas Assets */}


                        </div>
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

                        <Button type="primary" value={t('Update')}  onClick={() => handleSaveResourcePrice()} />
                    </ModalFooterNDL>
                </React.Fragment >
            }
        </React.Fragment>
    )
});

export default AddResourcePrice;