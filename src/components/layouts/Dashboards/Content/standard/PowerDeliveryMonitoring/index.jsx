import React, { useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next"; 
import moment from 'moment';
import Grid from "components/Core/GridNDL";
import KpiCardsNDL from "components/Core/KPICards/KpiCardsNDL"
import Typography from "components/Core/Typography/TypographyNDL"; 
import LoadingScreenNDL from "LoadingScreenNDL";
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import EnhancedTable from "components/Table/Table"; 
import { ContractDashboardRange,selectedPlant,selectedContract,lineEntity,VirtualInstrumentsList} from "recoilStore/atoms";
import common from "../EnergyDashboard/components/common";
import useGetContractDetail from "./hooks/useGetContractDetail"; 
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/chart.jsx"
export default function PowerDeliveryMonitoring(){
    const [,SetIsActiveContract] = useState(true);
    const [,SetIsActiveEntity] = useState(true);
    const [contentSwitchIndexContract, setContentSwitchIndexContract] = useState(1);
    const [contentSwitchIndexEntity, setContentSwitchIndexEntity] = useState(1);
    const [headCells, setheadCells] = useState([])
    const [selectedcolnames, setselectedcolnames] =  useState([])
    const [tableFilterValue,settableFilterValue] = useState('contractwise')
    const [OverallContract] = useRecoilState(selectedContract)
    const [contract,setcontract] = useState('')
    const [headPlant] = useRecoilState(selectedPlant)
    const [contractDashboardRange] = useRecoilState(ContractDashboardRange);
    const [virtualInstrumentList] = useRecoilState(VirtualInstrumentsList)
    const [entity] = useRecoilState(lineEntity);
    const [entityOption,setentityOption] = useState([])
    const [startDate,setstartDate] = useState(contractDashboardRange.start)
    const [endDate,setendDate] = useState(contractDashboardRange.end)
    const [monthFilterOption,setmonthFilterOption] = useState([])
    const [entityValue,setEntityValue] = useState('')
    const [ContractTotalFilterValue,setContractTotalFilterValue] = useState('')
    const [EntityTotalFilterValue,setEntityTotalFilterValue] = useState('')
    const {useGetContractDetailLoading, useGetContractDetailData, useGetContractDetailError, getuseGetContractDetail} = useGetContractDetail()
    const [monthWiseData,setmonthWiseData] = useState([])
    const [contractWiseData,setcontractWiseData] = useState([])
    const [tableData,settableData] = useState([ ])
    const [ContractChart,setContractChart] = useState({labels: [],datasets: []})
    const [ContractChartTot,setContractChartTot] = useState({labels: [],datasets: []})
    const [EntityChart,setEntityChart] = useState({labels: [],datasets: []})
    const [EntityChartTot,setEntityChartTot] = useState({labels: [],datasets: []})
    const [finalTableData,setfinalTableData] = useState([])
    const [finalDownloadData,setfinalDownloadData] = useState([])
    const [ElectricityPrice,setElectricityPrice] = useState(null)
    const [enableGroupby,setenableGroupby] = useState(false)
    const [enableGroup,setenableGroup] = useState(null)
    const { t } = useTranslation();
    const [downloadData, setdownloadData] = useState([])
    const tableheadCells = [
        {
            id: 'S.NO',
            numeric: false,
            disablePadding: false,
            label: 'S.NO',
            width: 100

        },
        {
            id: 'Month',
            numeric: false,
            disablePadding: false,
            label: 'Month',
            width: 100

        },
        {
            id: "Year",
            numeric: false,
            disablePadding: false,
            label: "Year",
            width: 100

        },
        {
            id: "Contract",
            numeric: false,
            disablePadding: false,
            label: 'Contract',
            width: 100

        }, {
            id: 'Agreement Qty',
            numeric: false,
            disablePadding: false,
            label: 'Agreement Qty',
            width: 120

        },
        {
            id: 'MGQ %',
            numeric: false,
            disablePadding: false,
            label: 'MGQ %',
            width: 120,
            noCammelCase:true
        },
        {
            id: 'MGQ',
            numeric: false,
            disablePadding: false,
            label: 'MGQ',
            width: 120,
            noCammelCase:true

        },
        {
            id: 'Delivered Quantity',
            numeric: false,
            disablePadding: false,
            label: 'Delivered Quantity',
            width: 150,
        },
        {
            id: 'Excess / Shortfall',
            numeric: false,
            disablePadding: false,
            label: 'Excess / Shortfall',
            width: 160,
        },
        {
            id: 'Agreement Cost / Unit',
            numeric: false,
            disablePadding: false,
            label: 'Agreement Cost / Unit',
            width: 180,
        },
        {
            id: 'Savings / Unit',
            numeric: false,
            disablePadding: false,
            label: 'Savings / Unit',
            width: 150,
        },
        {
            id: 'Total Savings in Million',
            numeric: false,
            disablePadding: false,
            label: 'Total Savings in Million',
            width: 190,
        },

        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('Alert ID'),
            hide: true,
            display: "none",
            width: 100

        }

    ]


          
    useEffect(()=>{
    if(OverallContract.length > 0){
        setcontract(OverallContract[0].id)
    }
    },[OverallContract])
 
    useEffect(()=>{
        if(contractDashboardRange.start !== '' && contractDashboardRange.end !== ''){
            setstartDate(contractDashboardRange.start)
            setendDate(contractDashboardRange.end)
        }
    },[contractDashboardRange])

    useEffect(()=>{
      if(startDate !== "" && endDate !== '' ){
      let months = common.getBetweenDates(moment(startDate), moment(endDate), 'month')
      let formattedDateRanges  =[{id:"all",value:"All Months"}]
      let montharray = []
      montharray  = months.map(range => {
        const startDate = new Date(range.start);
        return {
            id: range.start,
            value: `${startDate.toLocaleString('default', { month: 'long' })}-${startDate.getFullYear()}`
        };
    });
    formattedDateRanges =[...formattedDateRanges,...montharray]
    setmonthFilterOption(formattedDateRanges)
    setContractTotalFilterValue(formattedDateRanges[0].id)
    setEntityTotalFilterValue(formattedDateRanges[0].id)
     }
    },[startDate,endDate])
    
   useEffect(()=>{
    
    let dates = common.getBetweenDates(moment(startDate), moment(endDate), 'month')

    let contractArray = []
    OverallContract.forEach(x=>{
        let node_details = headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.contracts.filter(y=>y.contract === x.id).length > 0 ? headPlant.node.energy_contract.contracts.filter(y=>y.contract === x.id) : [] 
        let nodeViid = node_details.length > 0 ? node_details[0].Entities.map(v=>v.VirtualInstr) : []
        let virtual_instrument = virtualInstrumentList.filter(k=> nodeViid.includes(k.id)) 
        let contractVI = entity.filter(y=>y.id === x.id).length > 0 ? entity.filter(y=>y.id === x.id)[0].info.contractInstrument : ''
        let targetValue = entity.filter(y=>y.id === x.id).length > 0 ? entity.filter(y=>y.id === x.id)[0].info.target : ''
        let contractQTY =  virtualInstrumentList.filter(k=>k.id === contractVI).length > 0 ? virtualInstrumentList.filter(k=>k.id === contractVI)[0] : {} 
        let ContractValue =  common.getVirtualInstrumentInfo(contractQTY,[])
        if (!headPlant || !headPlant.node || !Array.isArray(headPlant.node.nodes)) {
            setElectricityPrice("0");
        } else {
            let energyunit = headPlant?.node?.nodes?.filter(e => e?.type === 1) || [];
            if (energyunit.length === 0) {
                setElectricityPrice(0);
            } else {
                let ElectricityPrice = energyunit?.[0]?.price ?? 0;
                setElectricityPrice(ElectricityPrice);
            }
        }
        contractArray.push({
            id: x.id,
            contractQTY:{id:contractQTY.id,instrument:ContractValue[0],keys:ContractValue[1]},
            target:targetValue,
            node:virtual_instrument.map(z=>{
                let values = common.getVirtualInstrumentInfo(z,[])
                return {
                    id:node_details[0].Entities.filter(s=>s.VirtualInstr === z.id)[0].node ,
                    instruments:values[0],
                    keys:values[1],
                }
            }),
           
        })
     })
     let obj={ 
        contracts:contractArray,
        lineID:headPlant.id,
        from:moment(startDate).format("YYYY-MM-DD"),
        to:moment(endDate).format("YYYY-MM-DD"),
        Dates:dates.map(d=>{
            return{
                start:moment(d.start).format("YYYY-MM-DD"),
                end:moment(d.end).format("YYYY-MM-DD"),
            }
        })}
        if(contractArray.length >  0 && obj.to !==  'Invalid date' ){
            getuseGetContractDetail(obj)
        } 
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[OverallContract,endDate,headPlant])
   useEffect(()=>{
    if(!useGetContractDetailLoading &&  useGetContractDetailData &&  !useGetContractDetailError){
        let formatedContractData = []
        if(useGetContractDetailData.length > 0){
            useGetContractDetailData.forEach(x=>{
                let contractName = OverallContract.filter(y=>y.id === x.contractID)
                let EntityName = entity.filter(y=>y.id === x.nodeID)
                formatedContractData.push({
                    ...x,
                    contractName:contractName[0] ? contractName[0].name : "",
                    nodeName:EntityName[0] ? EntityName[0].name : ""
                })
            })
        }
        contractFormatData(formatedContractData)
        monthFormatData(formatedContractData)

    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[useGetContractDetailLoading, useGetContractDetailData, useGetContractDetailError])

   useEffect(()=>{
            processeddata()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[contractWiseData,monthWiseData,tableFilterValue])
    useEffect(()=>{
        if(headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.contracts.length > 0 && OverallContract.length > 0 ){
            let ContractedEntity = OverallContract.map(x=>x.id)
            let nodeId = headPlant.node.energy_contract.contracts.filter(x=>ContractedEntity.includes(x.contract)).map(x=>x.Entities.map(y=>y.node)).flat(1)
            let contractEntity = entity.filter(x=> nodeId.includes(x.id))
            setentityOption(contractEntity)
            setEntityValue(contractEntity.length > 0 ?contractEntity[0].id : [])
           
        }
    },[headPlant.id,entity,OverallContract,tableFilterValue])


   
    useEffect(() => { 
        if(tableFilterValue === "contractwise"){
            setheadCells(tableheadCells.filter(x=> x.id !== 'Month' && x.id !== 'Year'))
           setselectedcolnames(tableheadCells.filter(val => !val.hide && val.display !== "none"))

        }else{
            setheadCells(tableheadCells)
            setselectedcolnames(tableheadCells.filter(val => !val.hide && val.display !== "none"))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilterValue])

   useEffect(()=>{
    if(contract && contractWiseData.length > 0 && monthWiseData.length>0 && ContractTotalFilterValue && entityValue && EntityTotalFilterValue){

        let ConData = monthWiseData.filter(e=>e.contract === contract) 
        let ConLabel = ConData.map(x=> x.month) 
        const data = {
            labels: ConLabel,
            datasets: [
             
              {
                label: 'Delivered Quantity',
                backgroundColor:'#5B5BD6',
                data: ConData.map(x=> x.delivered_qty),
              },
              {
                label: 'Shortfall Quantity',
                backgroundColor: '#F4A9AA',
                data:(Array.isArray(ConData) ? ConData : []).map(x => {
                    if (x.ShortFall_Qty && x.ShortFall_Qty < 0 && x.ShortFall_Qty !== null) {
                        return Math.abs(x.ShortFall_Qty);
                    } else {
                        return 0;
                    }
                }),
              },
              {
                label: 'Excess',
                backgroundColor: '#8ECEAA',
                data:(Array.isArray(ConData) ? ConData : []).map(x => {
                    if (x.ShortFall_Qty && x.ShortFall_Qty > 0 && x.ShortFall_Qty !== null) {
                        return Math.abs(x.ShortFall_Qty);
                    } else {
                        return 0;
                    }
                }),
              }
            ],
        };
        setContractChart(data)
        let FiltermonthWiseData = ContractTotalFilterValue === 'all' ?  monthWiseData : monthWiseData.filter(f=> f.start === ContractTotalFilterValue)
        const TotalValue = {
            labels: contractWiseData.map(x=> x.name),
            datasets: [
               
              {
                label: 'Delivered Quantity',
                backgroundColor:'#0090FF',
                data: contractWiseData.map(x => FiltermonthWiseData.filter(f=>f.id === x.id).map(y=> y.delivered_qty).reduce((a,b)=> a+b,0) ),
              },
              {
                label: 'Shortfall Quantity',
                backgroundColor: '#F4A9AA',
                data: ContractTotalFilterValue === 'all' ? (Array.isArray(contractWiseData) ? contractWiseData : []).map(x => {
                    if (x.ShortFall_Qty && x.ShortFall_Qty < 0 && x.ShortFall_Qty !== null) {
                        return Math.abs(x.ShortFall_Qty);
                    } else {
                        return 0;
                    }
                }): 
                contractWiseData.map(x => FiltermonthWiseData.filter(f=>f.id === x.id && f.ShortFall_Qty < 0).map(y=> Math.abs(y.ShortFall_Qty)).reduce((a,b)=> a+b,0) ),
                
                
              },
              {
                label: 'Excess',
                backgroundColor: '#8ECEAA',
                data:  ContractTotalFilterValue === 'all' ? (Array.isArray(contractWiseData) ? contractWiseData : []).map(x => {
                    if (x.ShortFall_Qty && x.ShortFall_Qty > 0 && x.ShortFall_Qty !== null) {
                        return x.ShortFall_Qty;
                    } else {
                        return 0;
                    }
                }):
                contractWiseData.map(x => FiltermonthWiseData.filter(f=>f.id === x.id && f.ShortFall_Qty > 0).map(y=> y.ShortFall_Qty).reduce((a,b)=> a+b,0) ),
                
              }
            ],
          };

          setContractChartTot(TotalValue)
          
        //   Entity Chart Data Binding
            let FilterEntmonthWiseData = EntityTotalFilterValue === 'all' ?  monthWiseData : monthWiseData.filter(f=> f.start === EntityTotalFilterValue)
            let EntChartdata = {
                labels: ConLabel,
                datasets: [],
            };
            let Colors = ['#2E81FF','#88B056','#DA1E28','#3DA3F5', '#FFD121', '#DF3B44', '#EC3B77', '#FF6C3E', '#9721B6', '#3DA3F5', '#FFD121', '#DF3B44', '#2E81FF']
            let selectedEnttity = entityOption.filter(e=> e.id === entityValue)  
            let EntTotaldata = {
                labels: entityOption.map(x=>x.name),
                datasets: [],
            };
            // eslint-disable-next-line array-callback-return
            contractWiseData.forEach((e,i)=>{ 
                EntChartdata.datasets.push({
                    label: e.name,
                    backgroundColor: Colors[i],
                    data: monthWiseData
                    .filter(f => f.contract === e.id)
                    .map(f => {
                    const value = f[selectedEnttity?.[0]?.name];
                    return isNaN(value) ? 0 : Number(value);
                    })
                  ,
                })
                let EntWise = entityOption.map(x=>{
                    let ConWise = FilterEntmonthWiseData.filter(f=>f.contract === e.id)
                    return ConWise.map(y=> y[x.name]).reduce((a,b)=> a+b,0)
                })
                EntTotaldata.datasets.push(
                    {
                        label: e.name,
                        backgroundColor: Colors[i],
                        data: EntWise.map(x => isNaN(x) ? 0 : x),
                    }
                )

            })
            setEntityChart(EntChartdata)
            setEntityChartTot(EntTotaldata)
    }else{
        setContractChart({labels: [],datasets: []})
        setContractChartTot({labels: [],datasets: []})
        setEntityChart({labels: [],datasets: []})
        setEntityChartTot({labels: [],datasets: []})
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[contract,contractWiseData,monthWiseData,ContractTotalFilterValue,entityValue,EntityTotalFilterValue])

    const buttonList = [
        {id:"month", value:"Month", disabled:false},
        {id:"total", value:"Total", disabled:false},
      ]
     
      const contentSwitcherClick = (e,type) =>{
     if(type === 'contract'){
        setContentSwitchIndexContract(e)
        if (e === 0) {
            SetIsActiveContract(false)
          }
          else if (e === 1) {
            SetIsActiveContract(true)
          }

     }else{
        setContentSwitchIndexEntity(e)
        if (e === 0) {
            SetIsActiveEntity(false)
          }
          else if (e === 1) {
            SetIsActiveEntity(true)
          }

     }
       
    } 

const tableFilter=[
    {id:"monthwise",value:"Month"},
    {id:"contractwise",value:"Total"},

]

function findPercentage(value, percentage,noComma) {
    if (!value || value === undefined || !percentage || percentage === undefined || value === "-" || percentage === "-") {
        return 0;
    }
    // Calculate the percentage
    let result = (value * percentage) / 100;
    // Return the result
    return noComma ? result : result.toLocaleString('en-US');
}

function isRoundNumber(num) {
    // Check if the number is an integer

    if(num){
        if(num === Math.round(num)){
            return num.toLocaleString('en-US')
        }else{
            return num ? Number(num).toLocaleString('en-US') : 0
        }
            
    }else{
        return 0
    }
    
}

const modifyNumbers = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            obj[key] = parseFloat(obj[key].toFixed(2));
        }
    }
    return obj;
};

const processeddata=()=>{
    let obj = [];
    let temptabledata = [];
    let filterOptionData = [];
    let downloadbleData = []
    let temptabledataContract = []
    

    let ingoreKey=['Entities','contract','checked','contractInfo','field','id','name','contractQty','target','start','end','year','month','ShortFall_Qty',"Actual","target_per_year"];
    if(tableFilterValue === 'monthwise'){
        filterOptionData = [...monthWiseData]
    }else{
        filterOptionData = [...contractWiseData]
    }

    filterOptionData = filterOptionData.map(x=>modifyNumbers(x))
    filterOptionData.forEach(data=> {
       obj = [...Object.keys(data)]
    })
    obj = [...new Set(obj)];
    obj = obj.filter(x=> !ingoreKey.includes(x));
    temptabledata = filterOptionData.map((val,index)=>{
    let dynamic_return = []

    if(tableFilterValue === 'monthwise'){
        dynamic_return = [index+1,val.month,val.year,val.name,val.aggrement_qty ? isRoundNumber(val.aggrement_qty) : 0,val.mgq && val.mgq !== "-" ? val.mgq + "%" : "-",val.mgq_qty.toLocaleString('en-US'),val.delivered_qty ? val.delivered_qty.toLocaleString('en-US') : '0',val.ShortFall_Qty && val.ShortFall_Qty!== 0 ? 
            (<Typography value={isRoundNumber(val.ShortFall_Qty)}  style={{color:val.ShortFall_Qty < 0 ? "#CE2c31" : "#30a46e"}}   />)
             : 0,val.agreement_cost ? val.agreement_cost.toLocaleString('en-US') : "-",val.savings ?  (<Typography value={val.savings.toLocaleString('en-US')}  style={{color:val.savings < 0 ? "#CE2c31" : "#30a46e"}}   />) : "0",val.total_savings && val.total_savings !=="00" ? val.total_savings : "0"
    ]
    }else{
        dynamic_return =   [index+1,val.name,val.aggrement_qty ? isRoundNumber(val.aggrement_qty) : 0,val.mgq && val.mgq !== "-" ? val.mgq + "%" : "-",val.mgq_qty.toLocaleString('en-US'),val.delivered_qty ? val.delivered_qty.toLocaleString('en-US') : '0',val.ShortFall_Qty && val.ShortFall_Qty!== 0 ? 
            (<Typography value={isRoundNumber(val.ShortFall_Qty)}  style={{color:val.ShortFall_Qty < 0 ? "#CE2c31" : "#30a46e"}}   />)
             : 0,val.agreement_cost ? val.agreement_cost.toLocaleString('en-US') : "-",val.savings ?  (<Typography value={val.savings.toLocaleString('en-US')}  style={{color:val.savings < 0 ? "#CE2c31" : "#30a46e"}}   />) : "0",val.total_savings && val.total_savings !=="00"? val.total_savings : "0",val.id
        ]
    }
        return dynamic_return
       
    })

    temptabledataContract = contractWiseData.map((val,index)=>{
    let dynamic_return = []

    if(tableFilterValue === 'monthwise'){
        dynamic_return = ["Total","","",val.name,val.aggrement_qty ? isRoundNumber(val.aggrement_qty) : 0,val.mgq && val.mgq !== "-" ? val.mgq + "%" : "-",val.mgq_qty.toLocaleString('en-US'),val.delivered_qty ? val.delivered_qty.toLocaleString('en-US') : '0',val.ShortFall_Qty && val.ShortFall_Qty!== 0 ? 
            (<Typography value={isRoundNumber(val.ShortFall_Qty)}  style={{color:val.ShortFall_Qty < 0 ? "#CE2c31" : "#30a46e"}}   />)
             : 0,val.agreement_cost ? val.agreement_cost.toLocaleString('en-US') : "-",val.savings ?  (<Typography value={val.savings.toLocaleString('en-US')}  style={{color:val.savings < 0 ? "#CE2c31" : "#30a46e"}}   />) : "0",val.total_savings && val.total_savings !=="00" ? val.total_savings : "0"
    ]
    }else{
        dynamic_return = []
    }
        return dynamic_return
       
    })
    if(tableFilterValue === 'monthwise'){
    temptabledata = [...temptabledata,...temptabledataContract]
    } 

    downloadbleData =  filterOptionData.map((val,index)=>{
    let dyvalues = []  
    let downData = []
    obj.forEach(p=>{
        dyvalues.push(isRoundNumber(val[p]))
    })
    if(tableFilterValue === 'monthwise'){
        downData = [index+1,val.month,val.year,val.name,val.contractQty ? isRoundNumber(val.contractQty) : 0,val.target_per_year ? val.target_per_year : '-',...dyvalues,val.Actual ? isRoundNumber(val.Actual) : 0,isRoundNumber(val.ShortFall_Qty) 
        ]
    }else{
        downData =   [index+1,val.name,val.contractQty ? isRoundNumber(val.contractQty) : 0,val.target_per_year ? val.target_per_year : '-',...dyvalues,
            val.Actual ? val.Actual : 0,isRoundNumber(val.ShortFall_Qty)
        ]
    }
        return downData
       
    })
    const formatNumber = (val) => {
        if (typeof val !== "number" && isNaN(Number(val))) return val;
      
        // Skip integer values
        if (Number.isInteger(Number(val))) return val;
          return  Number(val).toFixed(2); // convert to string with 2 decimals
      };
      
    // console.log(temptabledata,'temptabledata')
    const updatedData = temptabledata.map(innerArray =>
        innerArray.map(item => {
          return item !== '' ? formatNumber(item) : ''; // unchanged
        })
      );
    setdownloadData(downloadbleData)
    settableData(updatedData)
    
}

useEffect(()=>{
    if(tableData.length > 0){
       setTimeout(() => {
        if(tableFilterValue === 'monthwise'){
            setenableGroupby(true)
            setenableGroup("Contract")
        }else{
            setenableGroupby(false)
            setenableGroup('')
    
        }
       },200)
       
    }
},[tableData])
const contractFormatData = (formattedData) =>{
    let contractWiseColumn = [] 
    const mergedData = {}; 
formattedData.forEach(item => {
    const key = `${item.id}-${item.name}`;
    // If the key doesn't exist in mergedData, create it
    if (!mergedData[key]) {
        mergedData[key] = { ...item };
    } else {
        // Otherwise, merge the objects and reduce numeric values
        Object.keys(item).forEach(prop => {
            // Check if the property is a numeric value
            if (!isNaN(item[prop]) && (prop !== "mgq" && prop !==  'agreement_cost' && prop !==  'savings' && prop !==  'total_saving')) {
                // Add the numeric value to existing one
                mergedData[key][prop] = (mergedData[key][prop] || 0) + item[prop];
            }
        });
    }
});

// Convert mergedData object back to array
const mergedArray = Object.values(mergedData);
 
        contractWiseColumn = mergedArray 
        
    setcontractWiseData(contractWiseColumn);
}

const calculateMonthlyQty = (qty,month) => {
    if (qty && qty !== "-") {
        const monthName = moment(month).format("MMMM");
        const monthlyQty = qty[monthName] ? Number(qty[monthName]) : 0;
        return monthlyQty;
    }
    return 0;

}

const monthFormatData = (formattedData) =>{
    let monthWiseColumn = []
    let obj ={}

    OverallContract.forEach(x=>{
        obj ={}
        let dates = common.getBetweenDates(moment(startDate), moment(endDate), 'month')
        tableheadCells.filter(p=>p.dynamicvalue === true).forEach(l=>obj[l.id]=0)
        if(x.contractInfo && dates.length > 0){
            dates.forEach(h=>{

                const contVirtArr = x.contractInfo ? virtualInstrumentList.filter(virt=>virt.id === x.contractInfo.contractInstrument):[];
                let contractFormula = contVirtArr.length > 0?contVirtArr[0].formula:''; 
                let filteredMonthArray = formattedData.filter(o=>x.id=== o.contractID && moment(h.start).format("YYYY-MM-DD") === o.start)
               if(filteredMonthArray.length > 0){
                    filteredMonthArray.map(x=>{
                        if(x.qty_data && x.qty_data.length > 0){ 
                            const filteredData = x.qty_data.reduce((acc, cur) => {
                                const found = acc.findIndex(obj => obj.iid === cur.iid && obj.key === cur.key);
                                if (found === -1) {
                                    acc.push({ iid: cur.iid, key: cur.key, value: cur.value, time: cur.time });
                                } else {
                                    acc[found].value += cur.value;
                                    acc[found].time = cur.time
                                }
                                return acc;
                            }, []);
                             filteredData.map(dat=>{
                                 contractFormula = contractFormula.replaceAll(`${dat.iid}.${dat.key}`, dat.value).toString()
                            })
                        }    
                    })
                }
                let contformulaVal = contractFormula ? contractFormula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll('--', '-'):0;      
                contformulaVal = eval(contformulaVal);  
                obj['contractQty'] = contformulaVal; 
                obj['target'] = findPercentage(contformulaVal,Number(x.contractInfo.target))
                obj["mgq"] = x?.contractInfo?.MGQ != null ? Number(x.contractInfo.MGQ) : "-";

                obj["aggrement_qty"] = x?.contractInfo?.isYearly !== "monthly"
                    ? Number(x?.contractInfo?.target_per_year ?? 0) / 12
                    : calculateMonthlyQty(x?.contractInfo?.targetPerMonth, h?.start);

                obj["agreement_cost"] = x?.contractInfo?.AgreeCostYearly != null
                    ? Number(x.contractInfo.AgreeCostYearly)
                    : "-";

                if (x?.contractInfo?.AgreeCostYearly && ElectricityPrice) {
                    obj["savings"] =
                        Number(ElectricityPrice) - Number(x.contractInfo.AgreeCostYearly);
                }
                if(x.Entities && x.Entities.length > 0){
                    const entityNameMerge = x.Entities.map(ent=> {
                        const entFilt = entityOption.filter(opt=>opt.id === ent.node);
                        return {...ent,...{name: entFilt.length > 0?entFilt[0].name:''}};
                    })
                    let actual = 0;
                    entityNameMerge.forEach(y=>{
                        const virtualArr = virtualInstrumentList.filter(virt=>y.VirtualInstr === virt.id);
                        let formula = virtualArr.length > 0 ?virtualArr[0].formula : '';
                         let filteredEntityWise =  formattedData.filter(o =>  moment(h.start).format("YYYY-MM-DD") === o.start && y.node === o.nodeID && x.contract === o.contractID); 
                         if(filteredEntityWise.length > 0){
                            filteredEntityWise.map(entData=>{
                                if(entData.data.length > 0){
                                     const filteredData =  entData.data.reduce((acc, cur) => {
                                        const found = acc.findIndex(obj => obj.iid === cur.iid && obj.key === cur.key);
                                        if (found === -1) {
                                            acc.push({ iid: cur.iid, key: cur.key, value: cur.value, time: cur.time });
                                        } else {
                                            acc[found].value += cur.value;
                                            acc[found].time = cur.time
                                        }
                                        return acc;
                                    }, []);
                                    filteredData.map(dat=>{
                                         formula = formula.replaceAll(`${dat.iid}.${dat.key}`, dat.value)
                                     })
                                }                            
                            }) 
                        }     
                         let formulaVal = formula ? formula.replaceAll(/[a-z0-9]+\.[a-zA-Z_]+/g, 0).replaceAll('--', '-'):0;      
                        formulaVal = eval(formulaVal);  
                        obj[y.name] = formulaVal;       
                        actual = actual + Number(formulaVal);           
                      })
                      obj['delivered_qty'] = actual;
                 } 
                obj['total_savings'] = obj['savings'] &&  obj['delivered_qty'] ? ((obj['savings'] * obj['delivered_qty']) / 10 ** 6) : "0"
                let MGQValue = (obj['aggrement_qty'] * obj['mgq']) / 100;
                obj['mgq_qty'] = typeof MGQValue === 'number' && !isNaN(MGQValue) ? MGQValue : 0;
                obj['ShortFall_Qty'] = obj['delivered_qty'] - obj['mgq_qty']
                monthWiseColumn.push({...h,...x,year:moment(h.start).format("YYYY"),month:moment(h.start).format("MMM"),...obj})
            })
        }            
    })
    setmonthWiseData(monthWiseColumn)
    contractFormatData(monthWiseColumn)

}
const handleTableFilter =(e)=>{
    settableFilterValue(e.target.value) 
   

}
const handleContract = (e)=>{
    setcontract(e.target.value)
}
const handleTotalContract = (e)=>{
    setContractTotalFilterValue(e.target.value)
}
const handleEntity =(e)=>{
    setEntityValue(e.target.value)
}
const handleTotalEntity=(e)=>{
    setEntityTotalFilterValue(e.target.value)
}

useEffect(()=>{
    setfinalTableData(tableData)
    setfinalDownloadData(downloadData)
},[tableData,downloadData]);

    return(
        <React.Fragment>
            {
                useGetContractDetailLoading && <LoadingScreenNDL />
            }
             {
            OverallContract.length > 0 ?
            <React.Fragment>
        <Grid container spacing={4} style={{padding:'16px'}}>
            <Grid sm={6}>
            <KpiCardsNDL style={{height:"460px"}}>
                
            <div className='px-1 py-2 flex items-center justify-between' >
            <Typography value={'Contract wise'} variant="heading-01-xs" color='secondary'/>
            <div className="flex gap-2 items-center">
                {
                    contentSwitchIndexContract === 0 &&
                    <div className="w-[150px]">
                    <SelectBox
                    labelId="contractSelect"
                    placeholder={'Choose Contract'}
                    id={"contract-select"}
                    auto={false}
                    multiple={false}
                    options={OverallContract}
                    isMArray={true}
                    checkbox={false}
                    value={contract}
                    onChange={(e) => handleContract(e)}
                    keyValue="name"
                    keyId="id"
                />
                </div>
                }
                 {
                    contentSwitchIndexContract === 1 &&
                    <div className="w-[150px]">
                    <SelectBox
                    labelId="contractSelect"
                    placeholder={'Choose Contract'}
                    id={"contract-select"}
                    auto={false}
                    multiple={false}
                    options={monthFilterOption}
                    isMArray={true}
                    checkbox={false}
                    value={ContractTotalFilterValue}
                    onChange={(e) => handleTotalContract(e)}
                    keyValue="value"
                    keyId="id"
                />
                </div>
                }
                <div>
                <ContentSwitcherNDL 
                    listArray={buttonList} 
                    contentSwitcherClick={(e)=>{contentSwitcherClick(e,"contract")}} 
                    switchIndex={contentSwitchIndexContract} />
                        
                </div>


                                    </div>

                                    
        </div>

                   
    
                        <div style={{ height: "350px" }}>
                            {
                                contentSwitchIndexContract === 0
                                && 
                                <Charts
                                charttype={"bar"}
                                yAxisTitle={"kWh"}
                                labels={ContractChart.labels}
                                data={ContractChart.datasets}
                                legend={true}
                                noSharedTooltip={true}
                                isTop
                                customTotalLabel ={"MGQ"}
                                labelDataKey = {'mgq_qty'}
                                labelData= {monthWiseData.filter(x=>x.contract === contract)} 
                                islocalString={true}
                    

                            />
                            }{
                                contentSwitchIndexContract === 1 &&
                                <Charts
                                    charttype={"bar"}
                                    yAxisTitle={"kWh"}
                                    labels={ContractChartTot.labels}
                                    data={ContractChartTot.datasets}
                                    legend={true}
                                    noSharedTooltip={true}
                                    isTop
                                customTotalLabel ={"MGQ"}
                                labelData = {contractWiseData}
                                labelDataKey = {'mgq_qty'}
                                islocalString={true}

                    

                                />
                            }

                        </div>
           </KpiCardsNDL>
              </Grid>
            <Grid sm={6}>

           <KpiCardsNDL style={{height:"460px"}}>
           <div className='px-1 py-2 flex items-center justify-between' >
            <Typography  value={'Entity wise'} color='secondary' variant="heading-01-xs"/>
            <div className="flex items-center gap-2" >
                {
                    contentSwitchIndexEntity === 0 && 
                    <div className="w-[150px]">
                    <SelectBox
                    labelId="contractSelect"
                    placeholder={'Choose Entity'}
                    id={"contract-select"}
                    auto={false}
                    multiple={false}
                    options={OverallContract.length === 0 ? [] :entityOption}
                    isMArray={true}
                    checkbox={false}
                    value={entityValue}
                    onChange={(e) => handleEntity(e)}
                    keyValue="name"
                    keyId="id"
                />
                </div>
                }
                {
                     contentSwitchIndexEntity === 1 && 
                     <div className="w-[150px]">
                     <SelectBox
                     labelId="contractSelect"
                     placeholder={'Choose Entity'}
                     id={"contract-select"}
                     auto={false}
                     multiple={false}
                     options={monthFilterOption}
                     isMArray={true}
                     checkbox={false}
                     value={EntityTotalFilterValue}
                     onChange={(e) => handleTotalEntity(e)}
                     keyValue="value"
                     keyId="id"
                     />
                     </div>
                }

                <div>
                <ContentSwitcherNDL 
                    listArray={buttonList} 
                    contentSwitcherClick={(e)=>{contentSwitcherClick(e,"entity")}} 
                    switchIndex={contentSwitchIndexEntity} />
                </div>
           
                                    </div>
            
                 
        </div>
    
        <div style={{ height: "350px" }}>
        {
                    contentSwitchIndexEntity === 0 && 
                    <Charts
                    charttype={"bar"}
                    yAxisTitle={"kWh"}
                    labels={EntityChart.labels}
                    data={EntityChart.datasets}
                    legend={true}
                    noSharedTooltip={true}
                    islocalString={true}

                    
                />
        }
        {
                     contentSwitchIndexEntity === 1 && 
                     <Charts
                     charttype={"bar"}
                     yAxisTitle={"kWh"}
                     labels={EntityChartTot.labels}
                     data={EntityChartTot.datasets}
                     legend={true}
                     noSharedTooltip={true}
                     islocalString={true}

                     

                 />
        }

</div>
           </KpiCardsNDL>
           </Grid>
        </Grid>
       
        <Grid container style={{padding:"0px 16px 0px 16px"}}>
        <Grid item xs={12} sm={12} >
        <div className ={"float-left px-4 py-3 ml-3"}>
        <Typography value={'Contract Details'} variant="heading-01-s" color='secondary' />
       </div>
        <div className ={"float-right w-[250px] p-3"}>
            <div className="flex gap-2">
                                <SelectBox
                                        labelId="tablefilter"
                                        id={"contract-tablefilter"}
                                        auto={false}
                                        multiple={false}
                                        options={tableFilter}
                                        isMArray={true}
                                        checkbox={false}
                                        value={tableFilterValue}
                                        onChange={(e) => handleTableFilter(e)}
                                        keyValue="value"
                                        keyId="id"
                                    />
                                </div>
                                </div>

            <EnhancedTable
                headCells={headCells.filter(x=>!x.hide)}
                data={finalTableData}
                // downloadabledata={finalDownloadData}
                rawdata={finalDownloadData}
                download={selectedcolnames.length===0 ? false :true}
                search={true}
                rowSelect={true}
                checkBoxId={"S.NO"}
                tagKey={['Excess / Shortfall','Savings / Unit']}
                FilterCol
                defaultGrouping={enableGroup}
                defaultGroupingEnable={enableGroupby}
            />
            </Grid>
            </Grid>
   

        </React.Fragment>
        :
        <div className="flex justify-center items-center">
        <Typography value={"Please Select Contract"} variant ={"heading-02-sm"} />
        </div>
    }
      </React.Fragment>
    )
}