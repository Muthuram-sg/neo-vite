import React, { useState, useEffect ,useCallback} from 'react';
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant,
    TrendschartMode,
    trendsMarkerMode,
    GapMode,
    NormalizeMode,
} from "recoilStore/atoms"; // Recoil variables
import configParam from 'config';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL"; 
import moment from 'moment';
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL"; 
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import TrendsChart from 'components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/TrendsGraph/components/Trendschart.jsx'

import Button from 'components/Core/ButtonNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import { useNavigate } from "react-router-dom"; 


const ExploreModel = ({  open, onClose,detail  }) => {
  const navigate = useNavigate();
    const { t } = useTranslation();   
    const [headPlant] = useRecoilState(selectedPlant);
    const [min, setmin] = useState(undefined)
    const [max, setmax] = useState(undefined)
    const [charttype, setcharttype] = useState(false);
    const [markerMode, setMarkerMode] = useRecoilState(trendsMarkerMode)
    const [gapstatus, setgapstatus] = useState(false);
    const [normalizeMode, setNormalizeMode] = useState(false);
    const [OverallSwitchIndex, setOverallSwitchIndex] = useState(0);
    const [yData, setYData] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" });
    const {
        fetchDashboardData,
        getfetchDashboard,
        fetchDashboardLoading,
        fetchDashboardError,
    } = useFetchDashboardData();

    const to = moment();
    const from = moment(moment().subtract(1, 'day')).format("YYYY-MM-DDTHH:mm:ss"); // 24 hours ago
    const startrange = formatWithOffset(from);
    const endrange = formatWithOffset(to);

  function formatWithOffset(date) {
    let isoString = moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
    // let offset = '+05:30'; // Specify the required offset
    return isoString; // Replace 'Z' (UTC) with the desired offset
  }

  const fetchNodeData = useCallback(() => {
    if (detail && headPlant.schema && open) {
      
      const params = {
        schema: headPlant.schema,
        instrument: detail.instrumentid,
        metric: detail.metric,
        type: 'line',
        from: startrange,
        to: endrange,
        isConsumption: false,
      };
      let metField = []
      if(Array.isArray(detail.metric)){
        let metArr = detail.metric.map(m=> m.name+"-"+m.title)
        metField = {
          "field1": {
              "metric": metArr,
                "instrument": detail.instrumentid
            }
        }
      }else{
        let metArr = [detail.metric+"-"+detail.metric]
        metField = {
          "field1": {
              "metric": metArr,
                "instrument": detail.instrumentid
            }
        }
      }
      // console.log(detail,"isDisplayNode")
      //getfetchDashboard('/dashboards/getdashboard', params);
      getfetchDashboard("/dashboards/getdashboard", params, metField, false, [], '', ''); 
        
    }
    
  }, [ 
    open
  ]);
  //console.log(`${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
  useEffect(() => {
    fetchNodeData();
  }, [open]);


  // useEffect(()=>{
  //   if(yData.data.length){
  //       let normalizedfinalData = Normalize(yData.data)
  //       setYData({ 'data': normalizedfinalData, 'annotation': [], 'charttype': "timeseries" })
  //   }
    
  // },[normalizeMode])  

  useEffect(()=>{
    if(fetchDashboardData){
        let newdata
        if (!gapstatus) {
            newdata = fetchDashboardData.filter((item) => { return item.value !== null })
        }
        else {
            newdata = fetchDashboardData
        }
        let ChartData = []
        if(Array.isArray(detail.metric)){
          detail.metric.map(d=>{
            let seriesData = fetchDashboardData.filter(f=> f.key === d.name).map(p=> {return {x: new Date(moment(p.time).format("YYYY-MM-DDTHH:mm:ssZ")).getTime(),y: p.value}})
            ChartData.push({
                "name": `${d.title +" ("+detail.instrumentid+")"}`,
                "id": detail.instrumentid,
                "type": charttype ? 'area' : 'line',
                "data": seriesData
            })
          })
        }else{
          let seriesData = fetchDashboardData.filter(f=> f.key === detail.metric).map(p=> {return {x: new Date(moment(p.time).format("YYYY-MM-DDTHH:mm:ssZ")).getTime(),y: p.value}})
          ChartData.push({
              "name": `${detail.metric +" ("+detail.instrumentid+")"}`,
              "id": detail.instrumentid,
              "type": charttype ? 'area' : 'line',
              "data": seriesData
          })
        }
        
        let normalizedfinalData = Normalize(ChartData)
        setYData({ 'data': normalizedfinalData, 'annotation': [], 'charttype': "timeseries" })
        // setYData({ 'data': ChartData, 'annotation': [], 'charttype': "timeseries" })
        // console.log(fetchDashboardData,"fetchDashboardDataModal",ChartData)
    }
  },[fetchDashboardData,charttype,gapstatus,normalizeMode])

  const Normalize = (templinedata) => {
    // console.log(templinedata)
    if (normalizeMode) {
      templinedata.forEach((s) => {
        if(s.type === 'rangeArea'){
            let lowerMax = Math.max(...s.data.map(x => x.y[0]))
            let upperMax = Math.max(...s.data.map(x => x.y[1]))
            // console.log(lowerMax,upperMax)
            let temprangedata = s.data.map((d) =>
                Object.assign({}, d, { y: [(d.y[0] / lowerMax).toFixed(4),(d.y[1] / upperMax).toFixed(4)] }))
                s.data = [...temprangedata]
        }
        else{
            let max = Math.max(...s.data.map(o => o.y))
            let tempdata = s.data.map((d) =>
            Object.assign({}, d, { y: (d.y / max).toFixed(4) }))
            s.data = [...tempdata]
        }
      })
    //   console.log(templinedata)
      return templinedata
    }
    else {
        return templinedata
    }
    
}
  

    function Oncancel(){ 
        setYData({ 'data': [], 'annotation': [], 'charttype': "timeseries" }) 
        setcharttype(false)
        setgapstatus(false)
        setNormalizeMode(false)
        onClose()
    
    }

      function hideSeriess(){
        
      }

      const OverAllList = [
        { id: "Line", value: "Line", disabled: false },
        { id: "Area", value: "Area", disabled: false },
    ]

    function RedirectTo(){
      let url
      let choosenSchema = localStorage.getItem('plantid')
       
        url = `/${choosenSchema}/explore`; 
      navigate(url, {
        state: {
          routeObj: "Explore" 
        }
      });
    }

  return (
    <React.Fragment>

    {/* <Modal open={open} onCancel={Oncancel} id="ExploreMDL"> */}
      <ModalHeaderNDL>
        <div className="flex">
          <div> 
            <TypographyNDL variant="heading-01-xs" value={Array.isArray(detail.metric) ? `${detail.assets +" - "+detail.instrument}` : `${detail.instrument +" - "+detail.metric}`} />
          </div>
          {fetchDashboardLoading && <div style={{marginLeft:8}}><CircularProgress /></div>}
        </div>
      </ModalHeaderNDL>

      <ModalContentNDL>
    <div> 

      {/* Conditionally render dropdowns based on selected tab */} 
        <div style={{ display: "flex", justifyContent: 'space-between',  gap: '8px'}}>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'end',  gap: '8px',padding:"8px 16px 8px 16px"}}> 
                <CustomSwitch id={'normalize'} switch={false} size="small" checked={normalizeMode} onChange={(e) => {setNormalizeMode(e.target.checked)}} primaryLabel={'Normalize'} />
                <CustomSwitch id={'show_markers'} switch={false} size="small" checked={markerMode} onChange={(e) => setMarkerMode(e.target.checked)} primaryLabel={'Show Markers'} />
                <CustomSwitch id={'show_gap'} switch={false} size="small" checked={gapstatus} onChange={(e) => setgapstatus(e.target.checked)} primaryLabel={'Show Gap'} />
                
            </div>
            <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => {setOverallSwitchIndex(e);setcharttype(e === 0 ? false : true)}} switchIndex={OverallSwitchIndex} ></ContentSwitcherNDL>
        </div>
        
        <div className="mt-4">  
            <TrendsChart hideSeriess={hideSeriess} yData={yData} min={min} max={max} isCSV={false} 
            Legend  
            height={30}
            id={"scadaTrend"}
            />
          
            <div className='flex mt-4  float-right gap-2'>
                <Button type="secondary" onClick={Oncancel} value="Close" />
        
            <Button type="primary" value={"View in Detail"}  onClick={RedirectTo}/>
            </div>
        </div> 
    </div>
    </ModalContentNDL>
    {/* </Modal> */}
   
   </React.Fragment>
  );
};

export default ExploreModel;
