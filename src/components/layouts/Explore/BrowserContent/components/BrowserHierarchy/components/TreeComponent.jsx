import React, { useState } from "react";
import useTheme from "TailwindTheme";
import TypographyNDL from "components/Core/Typography/TypographyNDL"
import { useRecoilState } from "recoil";
import IcondataLight from 'assets/neo_icons/Equipments/light'
import PinIconLine from 'assets/neo_icons/Menu/pushpin-line.svg?react';
import PinIconFill from 'assets/neo_icons/Menu/Pin On.svg?react';
import { trendsload, onlineTrendsMetrArr, connectstatvisible, ExpandWidth, selectedInstrument, exploreRange, customdates, selectedPlant, selectedInterval, snackToggle,
  snackMessage,
  snackDesc,
  snackType, showExploreDate, themeMode } from "recoilStore/atoms";
import { useAuth } from "components/Context";
import moment from "moment";
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import SortableTree from '@nosferatu500/react-sortable-tree'; 
import commontrends from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/common";
import trendsColours from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/trendsColours";
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

export default function TreeComponent(props) {
  const { HF } = useAuth();
  const [showconnect] = useRecoilState(connectstatvisible)
  const theme = useTheme();
  const [curTheme]=useRecoilState(themeMode)
  const [trendsOnlineLoad,] = useRecoilState(trendsload);
  const [selectedMeterAndChip, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
  const [, setSelectedExploreInstrument] = useRecoilState(selectedInstrument)
  
  const [, setShowDatePicker] = useRecoilState(showExploreDate)
  const[widthExpand]=useRecoilState(ExpandWidth)
  const [now] = useState(new Date());
  const [, setSelectedNode] = useState(null); 
  const [selectedRange] = useRecoilState(exploreRange);
  const [customdatesval] = useRecoilState(customdates);
  const [headPlant] = useRecoilState(selectedPlant);
  const [selectedIntervals] = useRecoilState(selectedInterval);

  const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackDesc] = useRecoilState(snackDesc);
    const [, setType] = useRecoilState(snackType);
  const [open, setOpen] = useState('')
  

  function cryptoRandom() {
    let array = new Uint32Array(1)
    return window.crypto.getRandomValues(array)[0] / Math.pow(2, 32);
  }

  const getInterval = (val) => {
    if(val.metric_data_type === 4 || val.metric_data_type === 5)
      return 15 
    return (val.frequency / 60).toFixed(4) <= Number(selectedIntervals) ? selectedIntervals : parseFloat((val.frequency / 60).toFixed(4));
  }


  const handleNodeClick = (node) => {
    if(node.type === "instrument"){
      setShowDatePicker(true)
      setOpen(node.name)
      setSelectedExploreInstrument([])
      let units = []
      node.children.map((x) => {units.push(x.unit)})
      units = [ ...new Set(units) ]
      let sep = []
      // units.map((z) => sep.push({[z]: node.children.filter((xx) => xx.unit === z)}))
      const { frmDate, toDate } = commontrends.getFromandToDate(selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant);
      units.map((z) =>  sep.push({[z]: node.children.filter((xx) => xx.unit === z).map((y) => {
        // console.log(z, y)
        let index = Math.floor(cryptoRandom() * trendsColours[1].length);
        let metricColour = trendsColours[1][index];
        return {
          category_id: y?.category || 1,
                  id: y?.metric_id,
                  instrument_name: y?.instrument_name,
                  metric_title: y?.metric_name,
                  metric_val: y?.key,
                  selectedIndex: y?.selectedIndex || 0,
                  unit: y?.unit,
                  hierarchy: y?.hierarchy,
                  colour: metricColour, 
                  checked: y?.checked || false,
                  meter_value: `${y?.meterValue1} ${y?.unit}`, 
                  time: y?.time,
                  alarmcolor: y?.alarmcolor,
                  alarmbg: y?.alarmbg,
                  range: selectedRange,
                  frmDate: moment(frmDate).format("YYYY-MM-DDTHH:mm:ssZ"),
                  toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ssZ"),
                  interval: getInterval(y),
                  frequency: (y?.frequency / 60).toFixed(4),
                  metric_data_type: y?.metric_data_type,
                  alertenabled: y?.alertenabled || false,
                  forecastenable: y?.forecastenable || false,
                  isForecast: y?.isForecast || null,
                  group: true,
                  limits: y?.limits
        }
      })
    })
    )


    units.forEach((x, i)=> {
        let metric = []
        let color = []
        let metric_title = []
        let alarmColor = []
        sep[i][x].map((z) => {
          metric.push(z.metric_val)
          color.push(z.colour)
          metric_title.push(z.metric_title)
          alarmColor.push(z.alarmcolor)
        })
        sep[i][x] = [{ 
          ...sep[i][x][0], 
          metric_val: metric.join(','), 
          colour: color,
          alarmcolor: alarmColor,
          metric_title: metric_title
        }]
      })

      
      setSelectedExploreInstrument(sep)
      setselectedMeterAndChip([])
      
    }

    setSelectedNode(node); // Update the selected node when a node is clicked
  };


  const addpinIcon = (item, meterValue,prop) => {
    if (!prop.pinnedMeter.find(el => el.actualname === item.actualname && el.type === item.type && el.nodeId === item.nodeId)) {
      return <PinIconLine stroke={curTheme === "dark" ?  "#b4b4b4" :"#646464"} onClick={(e) => prop.addMetricPin(e, item, meterValue, prop)}   viewBox="-15 -7 40 40"/>

    }
    else {
      return <PinIconFill stroke={curTheme === "dark" ?  "#b4b4b4" :"#646464"} onClick={(e) => prop.removeMetricPin(e, item, meterValue, prop)} viewBox="-15 -7 40 40" />
    }
  }

  const addMetricIcon = (item) => {
    
    if(selectedMeterAndChip && selectedMeterAndChip.length > 0 && selectedMeterAndChip[0].hierarchy.includes("All Metrics Group") ){
    if(selectedMeterAndChip && selectedMeterAndChip.length > 0 && selectedMeterAndChip[0].instrument_name === item.metric_name){
      return IcondataLight.filter((x, y) => y === 27).map((Component, key) => (
          <div key={key+1} style={{ width: "1rem", padding: "5px" }}>
              <Component stroke={theme.colorPalette.primary} onClick={() => {setShowDatePicker(selectedMeterAndChip.length === 1 ? true : false);props.removeMetricfromDashboard(item)}} />
          </div>
      ));
    }else  if (selectedMeterAndChip && selectedMeterAndChip.length > 0 && selectedMeterAndChip[0].instrument_name !== item.metric_name) {
      return IcondataLight.filter((x, y) => y === 26).map((Component, key) => (
          <div key={key} style={{ width: "1rem", padding: "5px" }}>
              <Component stroke={theme.colorPalette.disabled} onClick={() => {
                  if(JSON.parse(localStorage.getItem('exploreSelectetdHierarchy')).id === 'metricgroup' ){
                    setOpen('')
                    setOpenSnack(true)
                    setSnackMessage("A metric group is already selected")
                    setSnackDesc('Please deselect it to compare this metric group')
                    setType("warning")
                  }
                  setShowDatePicker(selectedMeterAndChip.length === 1 ? true : false); 
                  props.removeMetricfromDashboard(item)
                  }} />
          </div>
      ));
  } } 
  else if (!selectedMeterAndChip.find(el => el.id === item.metric_id && el.metric_val === item.key)) {
      return IcondataLight.filter((x, y) => y === 26).map((Component, key) => (
        <div key={key+1} style={{width : "1rem",padding : "5px"}}  >
        <Component 
        onClick={() => { 
         if (!trendsOnlineLoad) 
            setOpen('')
            setOpenSnack(true)
            setSnackMessage("Comparison Mode")
            setSnackDesc('You can now compare multiple metrics on a single chart for Deeper Insights')
            setType("info")
            setShowDatePicker(false)
            props.addMetricToDashboard(item) 
          }}  
       />
        </div>
      ))
    }else {
      return IcondataLight.filter((x, y) => y === 27).map((Component, key) => (
        <div key={key+1} style={{width : "1rem" , padding : "5px"}} >
       <Component stroke={theme.colorPalette.primary} onClick={() =>{ setShowDatePicker(selectedMeterAndChip.length === 1 ? true : false);props.removeMetricfromDashboard(item)}} />
       </div>
      ))
    }
  }
const treeData =[props.treedata]
function getNodeColor(node) {
  if (node && node.type === "instrument" && node.connectloss > 0) {
    return curTheme === "dark" ?  "#606060" :"#bbbbbb";
  } else if (
    node.type === "instrument" &&
    node.children &&
    node.children.some(c => c.alarmcolor && c.alarmcolor.toUpperCase() === "#FF0D00")
  ) {
    return "#FF0D00";
  } else if (
    node.type === "instrument" &&
    node.children &&
    node.children.some(c => c.alarmcolor && c.alarmcolor.toUpperCase() === "#FF9500")
  ) {
    return "#FF9500";
  } else {
      return curTheme === "dark" ?  "#eeeeee" :"#202020";
  }
}

function getColor(node) {
 if(node.meterValue1 === undefined){
    return curTheme === "dark" ?  "#606060" :"#bbbbbb";
  } else{
    if (!(moment(now).diff(moment(node.time), 'seconds') <= (3 * node.frequency))) {
        return curTheme === "dark" ?  "#606060" :"#bbbbbb";
    } else if(selectedMeterAndChip && selectedMeterAndChip.length > 0 && selectedMeterAndChip[0].hierarchy.includes("All Metrics Group") ){
      return curTheme === "dark" ?  "#606060" :"#bbbbbb";
     }else {
      if (node.alarmcolor.toUpperCase() === "#FF0D00") {
        return "#FF0D00";
      }else if (node.alarmcolor.toUpperCase() === "#FF9500") {
        return "#FF9500";
      } else {
        return curTheme === "dark" ?  "#eeeeee" :"#202020";
      }
    }
  }  
}



function formatMeterValue(node) {
  console.log(node,"node value")
  if (node.meterValue1 !== undefined) {
    // Ensure meterValue1 is a string before splitting
    const meterValues = typeof node.meterValue1 === 'string' ? node.meterValue1.split(',') : [node.meterValue1];
    const units = typeof node.unit === 'string' ? node.unit.split(',') : [node.unit];

    // Check if the lengths of meterValues and units match
    if (meterValues.length === units.length) {
        // Check if units contain "lat" and "long"
        const trimmedUnits = units.map(unit => unit.trim());
        if (trimmedUnits.includes("lat") && trimmedUnits.includes("long")) {
            // Check if meterValues has two elements and both are 9999.99
            if (meterValues.length === 2 && parseFloat(meterValues[0]) === 9999.99 && parseFloat(meterValues[1]) === 9999.99) {
                return "No Tower Data";
            }
        }

        return meterValues.map((value, index) => {
            const regExp = /[a-zA-Z]/g;
            if (regExp.test(value) || isNaN(parseFloat(value))) {
                return value + " " + units[index].trim();
            } else {
                return parseFloat(value).toFixed(3) + " " + units[index].trim();
            }
        }).join(', ');
    }
} else {
    return "-.--";
  }
}

  return (
   
        <SortableTree
        treeData={treeData}
        canDrag={false}
        theme={FileExplorerTheme}
        onVisibilityToggle={({ treeData, node, expanded,path }) => {props.handleToggle(treeData, node,expanded,path)}}
        onChange={treeDatas => console.log("treedata1", treeDatas)}
        generateNodeProps={({ node, path, treeIndex }) => ({
          title: (
          
            <div style={{ width: '100%',height:"32px", display: "flex", backgroundColor: curTheme === 'dark' ? open === node.name ? '#313131' : '' : open === node.name ? '#E0E0E0' : '', paddingLeft: open === node.name ? '10px' : '0px', paddingRight: open === node.name ? '10px' : '0px', borderRadius: '6px' }}  
            onClick={() => {handleNodeClick(node)}}>
            <div   style={{width: '-webkit-fill-available', display: "flex",alignItems:"center", marginTop: 10, marginBottom: 10}}
            >

              

              {

                node.icon && (
                  IcondataLight.filter((x, y) => y === node.icon).map((Component, key) => (
                    <Component key={key+1} stroke={getNodeColor(node)} />
                  ))
                ) 
              }

              <div className='flex items-center ' >
                {node.icon && node.type !== "instrument" && !props.fetchValuesStatus && showconnect && node.connectloss > 0 &&
                  <TypographyNDL style={{
                    backgroundColor: "#c4c4c4",
                    borderRadius: '3px',
                    paddingRight: '3px',
                    paddingLeft: '3px',
                    marginLeft: '3px',
                    color:curTheme === "dark" ?  "#eeeeee" :"#202020"
                  }}
                  variant={'label-01-s'}
                    value={node.connectloss < 10 ? '0' + node.connectloss : node.connectloss}
                  />
                }
                {
                  node.type === 'instrument' && (
                    <>
                      {
                        (node.critical && node.critical > 0) && (
                          <TypographyNDL style={{
                            backgroundColor: "#FF0D00",
                            borderRadius: '3px',
                            paddingRight: '3px',
                            paddingLeft: '3px',
                            marginLeft: '3px'
                          }}
                          variant={'label-01-s'}

                            value={node.critical < 10 ? '0' + node.critical : node.critical}
                          />

                        )
                      }
                      {
                        (node.warning && node.warning > 0) && (
                          <TypographyNDL style={{
                            backgroundColor: "#FFCFCC",
                            borderRadius: '3px',
                            paddingRight: '3px',
                            paddingLeft: '3px',
                            marginLeft: '3px'
                          }}
                  variant={'label-01-s'}

                            value={node.warning < 10 ? '0' + node.warning : node.warning}
                          />


                        )
                      }
                    </>

                  )
                }
                <div onClick={()=>props.meterSelected("",node.id,node)} >
                <TypographyNDL 
                
                style={{
                 
                  marginLeft: 10,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  
                  color:open === node.name ? '#EF5F00' : getNodeColor(node)
                  //curTheme === "light" ? "#242424" : "#A6A6A6"
                }} 
                variant={'label-01-s'}

                  value={node.name}
                />
                </div>
                {
                  node.name !== undefined ? addpinIcon(node, node.id, props) : ""
                }
              </div>



              {node.metric_name !== undefined &&
                <div className="items-center relative right-[36px] flex w-[176px]">
                  <ToolTip title={node.metric_name} placement="right" arrow >
                    <div className="border-Border-border-100 border-t border-b border-l border-r dark:border-Border-border-dark-100" style={{
                       width: `${widthExpand/3.5}px`,
                      backgroundColor: theme.colorPalette.cards,// width: '76px',
                      color: getColor(node),
                      textOverflow: "ellipsis",
                      borderRadius: node.metervalue !== false ? "6px 0px 0px 6px" : "6px 6px 6px 6px",
                    }} >
                  
                      <TypographyNDL variant={'paragraph-xs'}    style={{ whiteSpace: "nowrap",textOverflow: "ellipsis",overflow: "hidden",borderRadius: "6px 0px 0px 6px",padding: "4px 8px 4px 8px",textAlign: "left",color: getColor(node)}} value={node.metric_name}>

                      </TypographyNDL>
                    </div>
                  </ToolTip>
                  {node.metervalue !== false &&
                  <ToolTip title={((node.meterValue1 !== undefined) ? "last active at: " + moment(node.time).format("DD - MMMM - YYYY, " + HF.HMS) + " (" + moment(node.time).fromNow() + ")" : "No Latest Data") + (node.alarmLevel ? "\n" + node.alarmLevel + " since: " + moment(node.alarmTime).format("DD - MMMM - YYYY, " + HF.HMS) + " (" + moment(node.alarmTime).fromNow() + ")" : "")} placement="right" arrow >
                    <div className="border-Border-border-100 border dark:border-Border-border-dark-100" style={{
                      width: `${widthExpand/3.5}px`,
                      color:  getColor(node),
                      backgroundColor: theme.colorPalette.cards,
                      borderRadius: "0px 6px 6px 0px",
                      textOverflow: "ellipsis"
                    }}>
                      <TypographyNDL variant={'paragraph-xs'} mono style={{whiteSpace: "nowrap",textOverflow: "ellipsis",overflow: "hidden",borderRadius: "6px 0px 0px 6px",padding: "4px 8px 4px 8px",textAlign: "center",color: getColor(node)}}
                        value={formatMeterValue(node)}
                        />
                    </div>
                  </ToolTip>
                    }
                  {

                    (!node.icon) && node.enable ? addMetricIcon(node) : <></>
                    
                  }
                </div>
              }
            </div>

            </div>
          
          ),

        })}
      />
     
    
   

    

  )
}



