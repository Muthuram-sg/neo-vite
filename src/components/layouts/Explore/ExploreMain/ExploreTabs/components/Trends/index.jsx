/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Open_menu from 'assets/neo_icons/Menu/Open_Menu.svg?react';
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import { legendvisible, exploreRange, selectedInterval, exploreLoader, selectedInstrument, onlineTrendsMetrArr,snackMessage,snackType,snackToggle, themeMode, selectedPlant } from "recoilStore/atoms";
import TrendsOnline from "./components/TrendsGraph/TrendsOnline";
import Button from 'components/Core/ButtonNDL';
import TrendsLegends from "./components/Legend";
import TrendsGroup from "./components/TrendsGroup";
import SplitterLayout from "react-splitter-layout";
import './Splitter-Layout-vertical.css'

export default function OnlineExplore(props) {
  const trendsRef = useRef();
  const legendRef = useRef()
  const [headPlant]=useRecoilState(selectedPlant)
  const [, setLoaderForMeter] = useRecoilState(exploreLoader);  
  const [selectedMeterAndChip,setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
  const [selectedExploreInstrument, setSelectedExploreInstrument] = useRecoilState(selectedInstrument)
  const [legend, setlegendVisible] = useRecoilState(legendvisible);
  const [selectedRange] = useRecoilState(exploreRange);
  const [selectedIntervals] = useRecoilState(selectedInterval);
  const [trendsData, setTrendsData] = useState([]); 
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const[HeightExpand,setHeightExpand]=useState('48')
  const [LgHeight,setLgHeight] =useState('300')
  // const [LgHeight,setLgHeight] =useState('475')
  const primContainerRef = useRef(null);
  const secContainerRef= useRef(null);
const [CurTheme] = useRecoilState(themeMode)
  const showLoader = (status) => {
    setLoaderForMeter(status)
  };

  const showTrendSeries = (series, fft, val) => {
    if (trendsRef.current) trendsRef.current.showSeries(series, fft, val);

  }


  const extractedDataArray = (val) => {
    if(val.length > 0){
      let temptrendsData = trendsData.filter(t => t.iid === val[0].id && t.key === val[0].metric_val);
  
      const criticalValuesArray = [];
      const warningValuesArray = []
  
      //when limits are changed before the selected range and did not undergo any recent update

      if (new Date(val[val.length-1].action_timestamp).getTime() < new Date(temptrendsData[0].time).getTime()){
        temptrendsData.forEach((td) => {
          criticalValuesArray.push({
            time: td.time,
            id: val[val.length-1].id,
            metric: val[val.length-1].metric_val,
            value: val[val.length-1].new_values_critical_value,
            limit: "critical"
          });
          warningValuesArray.push({
            time: td.time,
            id: val[val.length-1].id,
            metric: val[val.length-1].metric_val,
            value: val[val.length-1].new_values_warning_value,
            limit: "warning"
          });
        })
      } 
      //If there is any recent update done within selected range
      else {
        temptrendsData.forEach((td) => {
        
          let alert_update_index = val.findIndex(v => new Date(td.time).getTime() <= new Date(v.action_timestamp).getTime())
          let alert_update = val[alert_update_index]
          if (alert_update) {
            criticalValuesArray.push({
              time: td.time,
              id: alert_update.id,
              metric: alert_update.metric_val,
              value: alert_update_index === val.length-1 ? Number(alert_update.new_values_critical_value) :Number(alert_update.old_values_critical_value),
              limit: "critical"
            });
            warningValuesArray.push({
              time: td.time,
              id: alert_update.id,
              metric: alert_update.metric_val,
              value: alert_update_index === val.length-1 ? Number(alert_update.new_values_warning_value) :Number(alert_update.old_values_warning_value),
              limit: "warning"
            });
          }else {
            criticalValuesArray.push({
              time: td.time,
              id: val[0].id,
              metric: val[0].metric_val,
              value: val[val.length-1].new_values_critical_value,
              limit: "critical"
            });
            warningValuesArray.push({
              time: td.time,
              id: val[0].id,
              metric: val[0].metric_val,
              value: val[val.length-1].new_values_warning_value,
              limit: "warning"
            });
          }
    
        })
      }
      
      trendsRef.current.generateAlertsChart(temptrendsData.concat(criticalValuesArray).concat(warningValuesArray), val[0])
    } else {
      trendsRef.current.generateAlertsChart([], null)
      setOpenSnack(true)
      setSnackMessage('Alert Limit Data is not available')
      setType('warning')
      let meters = [...selectedMeterAndChip]
      setselectedMeterAndChip(meters.map(m=>{
        return Object.assign({},m,{"alertenabled":false})
      }))
      
    }
  };

  console.log("selectedMeterAndChip",selectedMeterAndChip)

  const hideTrendSeries = (series, fft, val) => {

    if (trendsRef.current) trendsRef.current.hideSeries(series, fft, val);

  }
  const hideAllSeries = (series) => {
    if (trendsRef.current) trendsRef.current.hideAllSeries(series);

  }
  const showannotaion = (series) => {
    if (trendsRef.current) trendsRef.current.showannot(series)

  }

  const hideannotation = (series, graphval) => {
    if (trendsRef.current) trendsRef.current.hideannot(series, graphval)

  }

  const showAllSeries = (series) => {
    if (trendsRef.current) trendsRef.current.showAllSeries(series);

  }
  const generateChart = (series) => {
    if (trendsRef.current) trendsRef.current.generateChart(series);

  }

  const addpointannot = (frm, to, metric_val, iid) => {
    if (trendsRef.current) trendsRef.current.addpointannot(frm, to, metric_val, iid)
  }

  const setcoord = (x, y, iid, metric) => {
    if (legendRef.current) legendRef.current.setcoord(x, y, iid, metric)

  }

  const getSummary = (meter) => {
    if (legendRef.current) legendRef.current.updateSummaryData(meter)
  }

  const fetchOnlineData = (meter, append) => {
    if (trendsRef.current) trendsRef.current.fetchOnlineData(meter, append);

  }

  const handleDownloadTrendData = () => {
    if (trendsRef.current) trendsRef.current.handleDownloadTrendData();
  }


  const getForecastSeries = (metric,key) => {
    trendsRef.current.generateForecastChart(metric,key)
  }

  const handleDragEnd = (e) => {
    // Get the width of the primary container when drag ends
    if (primContainerRef.current) {
      // console.log(primContainerRef.current.offsetHeight,"primContainerRef.current",primContainerRef.current.getBoundingClientRect())
      const width = primContainerRef.current.offsetHeight;
      setHeightExpand(width-20)
    }
    if(secContainerRef.current){
      const secHg = secContainerRef.current.offsetHeight;
      setLgHeight(secHg-50)
      // console.log(secHg,"secHg")
    }
  };

useEffect(()=>{
  if(primContainerRef.current && selectedMeterAndChip.length > 0){
    let DivH = primContainerRef.current.offsetHeight
    // console.log(primContainerRef.current.offsetHeight,"offsetHeightoffsetHeight")
    if(legend){
      setHeightExpand(DivH-20)
    }else{
      setHeightExpand(DivH-110)
    } 
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[legend])

useEffect(() => {
  // alert("ZOZOZ")
  setSelectedExploreInstrument([])
}, [headPlant.id, window.location.pathname])

  return (

    <React.Fragment>
      {
        selectedExploreInstrument.length > 0 
        ? <div style={{ overflowY: 'hidden', height: "98vh", width: '100%' }}><TrendsGroup setcoord={setcoord}/></div>
        :<>
    <div  className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark w-full min-h-[92vh] '>
      <SplitterLayout primaryIndex={1} vertical={true} percentage={true} secondaryInitialSize={48} primaryMinSize={20} secondaryMinSize={20}  onDragEnd={handleDragEnd} >
        <div ref={primContainerRef} className="dark:bg-Background-bg-secondary-dark bg-Background-bg-secondary" style={{ width:props.width,height:'100%' }} >
        
        {
            selectedMeterAndChip.length > 0 ? 
          <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark' style={{width: '100%',height:HeightExpand > 100 ?HeightExpand + 'px' : HeightExpand+'vh'}} >
            <TrendsOnline ref={trendsRef} showLoader={showLoader} setcoord={setcoord} getSummary={getSummary}
              selectedIntervals={selectedIntervals} selectedRange={selectedRange}
              trendsData={trendsData} setTrendsData={setTrendsData} metrics={selectedMeterAndChip}
              height={HeightExpand}
            />
          </div>
            :
            <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark' style={{width: '100%',height:'100vh'}} >
            <TrendsOnline ref={trendsRef} showLoader={showLoader} setcoord={setcoord} getSummary={getSummary}
              selectedIntervals={selectedIntervals} selectedRange={selectedRange}
              trendsData={trendsData} setTrendsData={setTrendsData}
              height={HeightExpand}
            />
          </div>
          }
        
        </div>
        {selectedMeterAndChip.length > 0 && legend &&
            <div className="dark:bg-Background-bg-secondary-dark bg-Background-bg-secondary" style={{ position:'relative',zIndex:1,height:'100%',width:props.width }} ref={secContainerRef}>
                {selectedMeterAndChip.length > 0 &&

              <div style={{ borderLeft: selectedMeterAndChip.length > 0 ? "1px solid #E8E8E8" : "", borderRadius: "0px", height:'100%' }}>
                  <React.Fragment>
                    {/* <div style={{ position: 'absolute', top: '5vh', left: '-3%' }} >
                      <Hide onClick={() => showLegend()} />
                    </div> */}
                    <TrendsLegends ref={legendRef} showSeries={showTrendSeries} hideSeries={hideTrendSeries} hideAllSeries={hideAllSeries} showAllSeries={showAllSeries} generateChart={generateChart} showannot={showannotaion} hideannot={hideannotation} fetchOnlineData={(meter, append) => fetchOnlineData(meter, append)} addpointannot={addpointannot} metrics={selectedMeterAndChip} selectedIntervals={selectedIntervals} selectedRange={selectedRange}
                      handleDownloadTrendData={handleDownloadTrendData} extractedDataArray={extractedDataArray} getForecastSeries={getForecastSeries} setTrendsData={setTrendsData}
                      height={LgHeight}
                      legendWith={Number(props.width.replace('px',''))/2}
                      CloseLegend={()=>setlegendVisible(false)}
                    />
                  </React.Fragment>
              </div>
    }
            </div>}
        
      </SplitterLayout>
      
      
    </div>
      {selectedMeterAndChip.length > 0 && !legend &&
            <div className='flex justify-between items-center align-center border-t border-neutral-200 align-center bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-2' style={{width: props.width,position:'relative',zIndex:2,bottom:'42px'}} >
              <TypographyNDL variant="heading-02-xs">{"Legends"}</TypographyNDL>
              <Button icon={Open_menu} stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} type='ghost' style={{color: CurTheme === 'dark' ? '#b4b4b4' : '#202020'}}  onClick={() => setlegendVisible(true)} />
            </div>
        }
        </>
      }
    </React.Fragment>
  );
}
