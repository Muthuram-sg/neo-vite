import React,{useRef,useEffect,useState} from 'react';
import SATableTopBar from './SATableTopBar'; 
import LoadingScreenNDL from "LoadingScreenNDL"; 
import EnhancedTable from "components/Table/Table";
import { useRecoilState } from "recoil";
import { SATableData, Loadingpanel, SigTabval, SATableData2, superData,MetricSANames,AnalyticMet } from "recoilStore/atoms";   
import Locate from 'assets/neo_icons/Equipments/Locate.svg?react'; 
import { t } from 'i18next';  
import SAContinuous from '../SAContinuous';
import SASuperImpose from '../SASuperImpose';

export default function SATable(props) {  
    const [tabValue] = useRecoilState(SigTabval);
    const [analysLoad] = useRecoilState(Loadingpanel); 
    const [checkedRej, setcheckedRej] = React.useState(false);
    const [metricFiltered,]=useRecoilState(MetricSANames)
    const [AnalyticMetrics]=useRecoilState(AnalyticMet)
    const [filteredMetrics,setFilteredMetrics]=useState([])
    const [childHeadCells,setChildHeadCells]=useState([])
    const [tableData] = useRecoilState(SATableData); 
    const [ContsTable,setContsTable] = useState([])
    const [SupImpTable,setSupImpTable] = useState([])
    const [ImposeTable,setImposeTable] = useRecoilState(SATableData2);
    const [dataSuper,setdataSuper] = useRecoilState(superData); 
    const [Page,setPage] = useState(0)
    const Topbar=useRef();

    useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData])
 

 useEffect(() => {
    if(AnalyticMetrics && AnalyticMetrics[0] && AnalyticMetrics[0].config && AnalyticMetrics[0].config.Config){
         const filteredConfig = AnalyticMetrics[0].config.Config.filter(obj => obj.stat === true);
         const metricIds = filteredConfig.map(obj => obj.metric_id);
         const filteredMetrics1 = AnalyticMetrics[0].config.Metrics.filter(obj => metricIds.includes(obj.id));
       

         let finalMetricFiltered=filteredMetrics1.filter(obj => metricFiltered.some(metObj => metObj.title === obj.key))
         const FilteredmetricsSA=finalMetricFiltered.map(obj => obj.key)
         setFilteredMetrics(FilteredmetricsSA)
    }
    else{
        console.log("err")
    }

 },[metricFiltered,AnalyticMetrics])
 
    useEffect(() => {
        processedrows2()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ImposeTable])

    const processedrows = () => {
        let temptabledata = []
        if (tableData.length>0) {
            temptabledata = temptabledata.concat(tableData.map((val, index) => {  
                if(val.average.length>0){
                    return [index+1, val.Partnum, val.startTime,val.endTime,val.cycletime,...val.average,...val.curpeak,val["Part Quality"],val.prod_part_comment]
                }else{
                    return [index+1, val.Partnum, val.startTime,val.endTime,val.cycletime,'','',val["Part Quality"],val.prod_part_comment]
                }
                
            })
            )
        } 
        setContsTable(temptabledata)
    }

    const processedrows2 = () => {
        let temptabledata = []
        if (ImposeTable.length>0) {
            temptabledata = temptabledata.concat(ImposeTable.map((val, index) => {
                if(val.average.length>0){
                    return [index+1, val.Partnum, val.startTime,val.endTime,val.cycletime,...val.average,...val.curpeak,val["Part Quality"],val.prod_part_comment,val.increment]
                }else{
                    return [index+1, val.Partnum, val.startTime,val.endTime,val.cycletime,'','',val["Part Quality"],val.prod_part_comment,val.increment]
                }
                
            })
            )
        }
        setSupImpTable(temptabledata)
    }

    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
        },
        {
            id: 'PartCount',
            numeric: false,
            disablePadding: false,
            label: t('Part Count'),
        },
        {
            id: 'start',
            numeric: false,
            disablePadding: false,
            label: t('Start'),
        },
        {
            id: 'end',
            numeric: false,
            disablePadding: false,
            label: t('End'),
        },
        {
            id: 'executiontime',
            numeric: false,
            disablePadding: false,
            label: t('Execution Time'),
        },
        {
            id: 'average',
            numeric: false,
            disablePadding: false,
            label: t('Current Average'),
            colSpan:filteredMetrics ? filteredMetrics.length : 3
           
        },
        {
            id: 'curpeak',
            numeric: false,
            disablePadding: false,
            label: t("Current Peak"),
            colSpan:filteredMetrics ? filteredMetrics.length : 3
           
        },
        {
            id: 'Part Quality',
            numeric: false,
            disablePadding: false,
            label: t('Part Quality'),
        },
        {
            id: 'prod_part_comment',
            numeric: false,
            disablePadding: false,
            label: t('Part Comments'),
        },
        {
            id: 'increment',
            numeric: false,
            disablePadding: false,
            display: 'none',
            label: t('Increment'),
        }
    ];

    const dynamicHeadCells=[ {
        id: 'average',
        numeric: false,
        disablePadding: false,
        label: t('Current Average'), 
        subLabel:'average'
    },
    {
        id: 'curpeak',
        numeric: false,
        disablePadding: false,
        label: t("Current Peak"), 
        subLabel:'peak'
    },]

    useEffect(() => {
        let spanRows = [
            {
                title: "",
                dataIndex: "S.No",
                key: "S.No"
            },
            {
                title: "",
                dataIndex: "PartCount",
                key: "Part Count"
                // key: "PartCount"
            },
            {
                title: "",
                dataIndex: "start",
                key: "Start"
                // key: "start"
            },
            {
                title: "",
                dataIndex: "end",
                key: "End"
                // key: "end"
            },
            {
                title: "",
                dataIndex: "executiontime",
                key: "Execution Time"
                // key: "executiontime"
            },
           
        ];
        dynamicHeadCells.forEach( cell => {
            filteredMetrics.forEach(metricName => {
           
                const dynamicObject = {
                    title: metricName,
                    dataIndex: metricName,
                    // key:  cell.id.replaceAll(' ', '') + "-"+metricName
                    key: cell.label
                };
            
                
                spanRows.push(dynamicObject);
                
                });
        })

           
                spanRows.push( {
                    title: "",
                    dataIndex: "Part Quality",
                    key: "Part Quality"
                },
                {
                    title: "",
                    dataIndex: "prod_part_comment",
                    // key: "prod_part_comment"
                    key: "Part Comments"
                },
                {
                    title: "",
                    dataIndex: "increment",
                    // key: "increment",
                    key: "Increment",
                    display: 'none'
                },
                {
                    title: "",
                    dataIndex: "actions",
                    // key: "increment",
                    key: "actions",
                    display: (tabValue !== 0 || checkedRej) ? 'block' : 'none' 
                },
                
               
            )
            setChildHeadCells(spanRows)
        
     },[filteredMetrics,checkedRej])

    function onChangePage(e){
        Topbar.current.ChangePage(e,"page")
        setPage(e)
    }

    function handleRight(value,incr){
        
        let filteredarr=[]
        let Intval = parseInt(value.increment, 10);
        Intval = isNaN(Intval) ? 0 : Intval;
        Intval++;
        let ctload = value.ct_load.map((e,i)=>{
                if(i=== 0){
                    Intval = Intval + (incr-1)     
                }
                return {...e,index :Number(e.index) + incr}
            })
        // eslint-disable-next-line array-callback-return
        filteredarr = mapRightLeftValues(ctload, dataSuper, value);
         
        let tableimp= mapImposeTable(ImposeTable, value, ctload, Intval);
        setImposeTable(tableimp)
        
    
        const newobj={...dataSuper,Data:filteredarr}
        setdataSuper(newobj)
    }
    const mapRightLeftValues = (ctload, datasuper, value) => {
        let filteredarr = [];
    
        value.metrics.forEach((e, i) => {
            let newval = [];
            // eslint-disable-next-line array-callback-return
            ctload.filter(v => e === v.key).map(val => {
                newval.push({
                    "name": val.key + ' - ' + value.PartID,
                    "data": [{
                        x: val.index,
                        y: val.value
                    }]
                });
    
                if (i === 0) {
                    filteredarr = [...datasuper.Data.filter((d) => d.name !== val.key + ' - ' + value.PartID)];
                } else {
                    filteredarr = [...filteredarr.filter((d) => d.name !== val.key + ' - ' + value.PartID)];
                }
            });
    
            filteredarr = [...filteredarr, ...newval];
        });
    
        return filteredarr;
    };

    const mapImposeTable = (imposeTable, value, ctload, Intval) => {
        return imposeTable.map(v2 => {
            if (v2.PartID === value.PartID) {
                return { ...v2, ct_load: ctload, increment: Intval };
            } else {
                return { ...v2 };
            }
        });
    };
    function handleLeft(value,incr){
        
        let filteredarr=[]
        let Intval = parseInt(value.increment, 10);
        Intval = isNaN(Intval) ? 0 : Intval;
        Intval--;
        let ctload = value.ct_load.map((e,i)=>{
            if(i=== 0){
                Intval = Intval - (incr-1)     
            }
            return {...e,index :Number(e.index) - incr}
        })
        // eslint-disable-next-line array-callback-return
        filteredarr = mapRightLeftValues(ctload, dataSuper, value);
        let tableimp= mapImposeTable(ImposeTable, value, ctload, Intval);
        setImposeTable(tableimp)
        const newobj={...dataSuper,Data:filteredarr}
 
        setdataSuper(newobj)
    }

    function handleDelete(id,value){
        setImposeTable([])
        let rowVal = value.Partnum.split("-")
        let impTable = ImposeTable.filter(x=> !x.Partnum.includes(rowVal[1]))
        let impLine = dataSuper.Data.filter(x=> !x.name.includes(rowVal[1]))
        let strokedata =dataSuper.stroke.filter((e)=> ( !e.id.includes(rowVal[1])))
        let keydata =dataSuper.key.filter((e,i)=> (!e.includes(rowVal[1])))
        const newobj={...dataSuper,Data:impLine ,key:keydata ,stroke: strokedata}
        setImposeTable(impTable)
        setdataSuper(newobj)
    }

    function handleCustom(value){
        let pageIdx = Math.ceil(parseFloat(value.SNo,5)/5) 
        Topbar.current.ChangePage(pageIdx-1,"Locate") 
    }

    return (
        <div> 
<SATableTopBar setnormalize={props.setnormalize} ref={Topbar} pageindex={(e)=>setPage(e)} RejectedOnly={(e)=>setcheckedRej(e)} imposTable={(e)=>console.log(e)} normalizeParam={props.normalizeParam} asset={props.asset} metric={props.metric} module={props.module} setModule={props.setModule} range={props.range}/> 
            <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4'>
                <div style={{display : tabValue === 0 ? "block" : "none" }}><SAContinuous normalize={props.normalize}/></div>
                <div style={{display : tabValue === 1 ? "block" : "none" }}><SASuperImpose normalize={props.normalize}/></div>
            </div> 
           
            {
            
            (analysLoad && 
            <div  className='w-full text-center p-4' ><LoadingScreenNDL /></div>)}
            <div className='px-4 pb-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
            <EnhancedTable
                headCells={headCells}
                colSpan={filteredMetrics?filteredMetrics.length:0}
                spanRows={childHeadCells}
                data={tabValue === 0 ? ContsTable : SupImpTable}
                download={true} 
                actionenabled = {(tabValue !== 0 || checkedRej) ? true : false}
                rawdata={tabValue === 0 ? tableData : ImposeTable}
                rowsPerPage={5}
                PerPageOption={[5]}
                onPageChange={onChangePage}
                page={Page}
                handleDelete={(id, value) => handleDelete(id, value)} 
                enableDelete={tabValue !== 0 ? true : false}
                enableIncrement={tabValue !== 0 ? true : false}
                clickRight={handleRight}
                clickLeft={handleLeft} 
                customAction={tabValue === 0 ? {icon :Locate,name:'Locate in Graph',stroke:'#0F6FFF'} : ''}
                customhandle={handleCustom}
                rejected={true}
                verticalMenu={true}
                groupBy={tabValue === 0 ? 'continuous_analytics' : 'superimpose_analytics'}
            />
            </div>
         
        </div>
    )
}