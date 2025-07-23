/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'; 
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL"; 
import Button from "components/Core/ButtonNDL";
import AddNew from 'assets/neo_icons/Menu/add_new_primary.svg?react';
import {
  parameterListExplore,
  onlineTrendsChipArr,
  onlineTrendsMetrArr  
} from "recoilStore/atoms";

const classes ={
  container:
  {
    display: "flex",
    overflowX: "auto"
  },
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "nowrap",
    listStyle: "none",
    padding: 5,
    margin: 0,
    overflow: "auto",
    maxWidth: "140vw",
    // width: "100%"
  },
  chipEnergy: {
    background: "#F9E3D1",
    border: "1px solid #E17219"
  },
  chipHealth: {
    background: "#D5F2E1",
    border: "1px solid #2CC36C"
  },
  chipPerformance: {
    background: "#EADCF0",
    border: "1px solid #9652B3"
  },
  chipdefault: {
    background: "#A6A6A6"
  },
  chipSelectedEnergy: {
    background: "radial-gradient(97.01% 97.01% at 50% 50.75%, #E67E22 0%, #D35400 100%)",
  },
  chipSelectedHealth: {
    background: "radial-gradient(80.6% 80.6% at 50% 50.75%, #2ECC71 0%, #27AE60 100%)",
  },
  chipSelectedPerformance: {
    background: "#9652B3"
  },
  category: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "13px",
    lineHeight: "24px"
  },
  chipText:{ 
    fontSize: '16px',
    fontWeight: 500,
    color: "#242424"
  }
}

export default function ChipList(props) {
 
  const [parameterList] = useRecoilState(parameterListExplore);
  const [, setParameters] = useState([]);
  const [, setSelectedParamDet] = useState({});
  const [selectedChipArr, setSelectedChipArr] = useRecoilState(onlineTrendsChipArr);
  const [selectedMeterAndChip, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
 
  useEffect(() => {
    setParameters([])
    if (parameterList !== null && parameterList !== undefined && parameterList.length > 0) {
      if (typeof (parameterList) === "string" && parameterList && parameterList !== undefined) {
        let parameters = (JSON.parse(parameterList));
        setParameters([])
        setParameters(parameters.length > 0 ? parameters : "")
      } else if (parameterList && parameterList !== undefined) {
        setParameters([])
        setParameters(parameterList.length > 0 ? parameterList : "")
      }
      let selectedChips = localStorage.getItem('selectedChipArr');
      if (selectedChips !== null && selectedChips !== undefined && selectedChips !== "") {
        let test111 = JSON.parse(selectedChips)
        let test222 = test111.map(x => x.metric_val)
        setselectedMeterAndChip(test111);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setSelectedChipArr(test222)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameterList])
  let tempChipArr = [];
  const handleClick = (e, val, id) => { 
    
    let test = exists(val.id, val.metric_val);
    if (test) {
      let tempArr2 = selectedMeterAndChip.filter(chipval => {
        if (chipval.metric_val === val.metric_val && parseInt(chipval.id) === parseInt(val.id)) {
          console.log("chip")
        } else {
          return chipval;
        }
      })
      setselectedMeterAndChip(tempArr2)
      let tempArr = tempArr2.map(x => x.metric_val)
      setSelectedChipArr(tempArr)
      setSelectedParamDet(tempArr);
      localStorage.setItem('selectedChipArr', JSON.stringify(tempArr2));
    } else if (selectedMeterAndChip.length === 0) {
      setselectedMeterAndChip([val])
      setSelectedChipArr([val.metric_val])

      localStorage.setItem('selectedChipArr', JSON.stringify([val]));
    } else {
      setselectedMeterAndChip(oldArray => [...oldArray, val])
      setSelectedChipArr(oldArray => [...oldArray, val.metric_val])
      tempChipArr = selectedMeterAndChip;
      tempChipArr = Object.assign([], tempChipArr)
      let selectedObj = Object.assign({}, val);
      selectedObj.selectedIndex = selectedMeterAndChip.length + 1;
      tempChipArr.push(selectedObj)
      localStorage.setItem('selectedChipArr', JSON.stringify(tempChipArr));
    }
    props.chipClicked()
  };

  function exists(id, metric_val) {
    return selectedMeterAndChip.some(car => car.id === id && car.metric_val === metric_val)
  }
 
 const getChipStyle = (data) => {
  if((data.category_name === "Health") && selectedChipArr && (selectedChipArr.length > 0) && exists(data.id, data.metric_val))  
    return classes.chipSelectedHealth 
  else {
    if(data.category_name === "Health") 
      return classes.chipHealth
    else{
      if((data.category_name === "Energy") && selectedChipArr && selectedChipArr.length > 0 && exists(data.id, data.metric_val))
        return classes.chipSelectedEnergy 
      else{
        if(data.category_name === "Energy") 
          return classes.chipEnergy
        else{
          if((data.category_name === "Performance") && selectedChipArr && selectedChipArr.length > 0 && exists(data.id, data.metric_val)) 
              return classes.chipSelectedPerformance 
          else{
            if(data.category_name === "Performance")
              return classes.chipPerformance 
            else 
              return classes.chipdefault;
          }
        }
      }
    }
  }
}

  return (
    <>

      <div component="ul" style={classes.root}>
        {
          parameterList.map((data, ind) =>{
            let customstyle = getChipStyle(data);
            return (                                                 
            <li key={data.id}>
              <div style={{ ...{display:'flex',marginRight: "7px",borderRadius: '4px'},...customstyle}}
              onClick={(e) => props.disableChip ? '' : handleClick(e, data, data.id) }
              >
                  <Typography variant="label-02-s"  color="#242424" value={props.meterLength > 1 ? data.instrument_name + " - " + data.metric_title + "(" + data.unit + ")" : data.metric_title + "(" + data.unit + ")"} />
                  <Button id='create-new-report' size="small" icon={AddNew} />
              </div>
              
            </li>)
          })
        }
      </div>
    </>
  )
}