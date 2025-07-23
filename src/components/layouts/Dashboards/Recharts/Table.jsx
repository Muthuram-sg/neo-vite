import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { metricsList ,themeMode} from 'recoilStore/atoms';
import EnhancedTable from "components/Table/Table";
import moment from 'moment';
import Typography from 'components/Core/Typography/TypographyNDL';

const Table = ({ data, width, height, meta,viData }) => {
  const tableheadCells = [
    {
        id: 'entity',
        numeric: false,
        disablePadding: true,
        label: "Entity",
    },
    {
        id: 'value',
        numeric: false,
        disablePadding: true,
        label: "Value",
    },
    {
      id: 'color',
      numeric: false,
      disablePadding: true,
      label: "Color",
      display:"none"
  },
  {
    id: 'textcolor',
    numeric: false,
    disablePadding: true,
    label: "TextColor",
    display:"none"
}

   
]
  const [metrics] = useRecoilState(metricsList);
  const [CurTheme] = useRecoilState(themeMode);
  const [Finaldata, setFinalData] = useState([]);
  const [tableData,setTableData] = useState([])
  let janOffset = moment({ M: 0, d: 1 }).utcOffset(); // checking for Daylight offset
  let julOffset = moment({ M: 6, d: 1 }).utcOffset(); // checking for Daylight offset
  let stdOffset = Math.min(janOffset, julOffset); // Then we can make a Moment object with the current time at that fixed offset
  // console.log(data,viData, width, height, meta, "Table");

  const displayKey = (key) => {
    const metricArr = metrics && metrics.length > 0 ? metrics.filter(y => key && key.trim() === y.name) : [];
    return metricArr.length > 0 ? (metricArr[0].metricUnitByMetricUnit && metricArr[0].metricUnitByMetricUnit.unit) : key;
  };

  function flattenArray(arr) {
    let result = [];

    function recurse(subArray) {
        for (let item of subArray) {
            if (Array.isArray(item)) {
                recurse(item);
            } else {
                result.push(item);
            }
        }
    }

    recurse(arr);
    return result;
}

  useEffect(() => {
    let formatData = [];
    const combinedArray = data.concat(viData);

    const flattenedArray = flattenArray(combinedArray);

    const uniquedata = flattenedArray.filter((obj, index) => { 
      return index === flattenedArray.findIndex(o => obj.iid === o.iid);
  });

  if(meta.isMultiMetric){
    setFinalData(flattenedArray)
  }
  else {

  uniquedata.forEach(x => {
      let value = x.value ? parseFloat(x.value).toFixed(2) : "";
      const keyvalue = x.key;
      value = value ? (!isNaN(meta.decimalPoint) ? Number(value).toFixed(Number(meta.decimalPoint)) : value) : 0;
      const key = value + ' ' + (keyvalue === 'kwh' ? 'kwh' : displayKey(keyvalue));
      const exist = formatData.findIndex(fd => fd.time === x.time);

      if (exist >= 0) {
        let val;
        let obj2 = { ...formatData[exist] };
        val = x.value ? parseFloat(x.value).toFixed(2) : "";
        obj2[key] = val ? (!isNaN(meta.decimalPoint) ? Number(val).toFixed(Number(meta.decimalPoint)) : val) : 0;
        formatData[exist] = obj2;
      } else {
        let obj1 = {};
        obj1['time'] = moment(x.time).utcOffset(stdOffset).format('YYYY-MM-DD HH:mm');
        obj1['instrument'] = x.instrument ? x.instrument.toString() : '';
        obj1['value'] = key;
        obj1['iid'] = x.iid ? x.iid.toString() : ''
        obj1['key'] = x.key
        formatData.push(obj1);
      }
    });

    setFinalData(formatData);
  }
    
  }, [data,viData]);

      useEffect(() => {
           processedrows();
      },[Finaldata,meta])
      function getContrastColor(hexColor) {
        if (hexColor) {
            hexColor = hexColor.replace(/^#/, '');
              
        let r = parseInt(hexColor.substring(0, 2), 16);
        let g = parseInt(hexColor.substring(2, 4), 16);
        let b = parseInt(hexColor.substring(4, 6), 16);
    
        let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
          }else{
            return CurTheme === 'dark' ? "#FFFFFF" : '#000000'
          }
     
    }
      const processedrows = () => {
        let temptabledata = [];

        if(meta?.isMultiMetric){
          // FOR PROCESSING MULTIMETRIC DATA
          const transformedArray = meta.metricField?.[0]?.field1?.metric?.map((z, index) => {
            return {
              fieldNumber: index+1,
              instrumentId: meta.metricField?.[0]?.field1?.instrument
            }
          })
          const mergedArray = Finaldata.map(item => {
            const matchingField = transformedArray.find(field => field.instrumentId === item.iid);
            return {
              ...item, // Include all original properties of array2 item
              fieldNumber: matchingField ? matchingField.fieldNumber : null // Add fieldNumber from array1
            };
          }).sort((a, b) => a.fieldNumber - b.fieldNumber);
          // console.log(Finaldata,"Finaldata_1",transformedArray,mergedArray)
          // // console.log(mergedArray,"mergedArray")
        
          temptabledata = temptabledata.concat(mergedArray.map((val, index) => {
            // Find the matching field in meta.metricField
            let matchingField = null;
            let color = meta?.multiMetricCellColour
            let textColor =  getContrastColor(color);
            console.log("META__", meta)
            return [
              <div key={val.time}>
                <span>{val.instrument}</span><br />
                {/* <span>{val.time}</span> */}
              </div>,
              meta?.decimalPoint === 'none' ? val.value : val.value.toFixed(meta?.decimalPoint),
              color,
              textColor
            ];
          }));
          // console.log("temptabledata_1", temptabledata)
          setTableData(temptabledata);
        } else {


        const transformedArray = Array.isArray(meta.metricField)
        ? meta.metricField.flatMap(obj =>
            Object.entries(obj).map(([field, data]) => ({
                fieldNumber: field.match(/\d+/) ? Number(field.match(/\d+/)[0]) : '',
                instrumentId: data.instrument ? data.instrument : data.virtualInstrument
            }))
        )
        : [];
        // console.log(Finaldata,"Finaldata",transformedArray,meta)
        const mergedArray = Finaldata.map(item => {
            const matchingField = transformedArray.find(field => field.instrumentId === item.iid);
            return {
                ...item, // Include all original properties of array2 item
                fieldNumber: matchingField ? matchingField.fieldNumber : null // Add fieldNumber from array1
            };
          }).sort((a, b) => a.fieldNumber - b.fieldNumber);
          // console.log(mergedArray,"mergedArray_1")

        temptabledata = temptabledata.concat(mergedArray.map((val, index) => {
          // Find the matching field in meta.metricField
          let matchingField = null;
          let color = null
          let textColor = null
        
          const metricFields = meta.metricField[0]; // extract the actual object
          for (let key in metricFields) {
            const field = metricFields[key];
            if (field.hasOwnProperty('instrument')) {
              if (field.instrument === val.iid) {
                // console.log("enters", field);
                matchingField = field;
                color = field ? field.TableCellColor : null;
                textColor = getContrastColor(color);
                break;
              }
            } else if (field.hasOwnProperty('virtualInstrument')) {
              if (field.virtualInstrument === val.iid) {
                matchingField = field;
                color = field ? field.TableCellColor : null;
                textColor = getContrastColor(color);
                break;
              }
            }
          }
          console.log(matchingField,"matchingField")
          return [
            <div key={val.time}>
              <span>{val.instrument}</span><br />
              <span>{val.time}</span>
            </div>,
            val.value,
            color,
            textColor
          ];
        }));
            console.log(temptabledata,"temptabledata")
            setTableData(temptabledata);
        }
  }
  // console.log(tableData,"table")  
  return (
    <React.Fragment>
    { tableData.length > 0 ? (<div >
      <div  width={width} style={{maxHeight:height,overflow:"auto"}}>
      <EnhancedTable
         headCells={tableheadCells}
         data={ tableData || []}
         rawdata={tableData || []}
         rowsPerPage = {tableData.length}
         hidePagination
         isCustomWidget
      />
      </div>
     </div>) : (<div style={{ textAlign: "center"}}>
                <Typography value={"No Data"} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={"EditORReload"} variant="heading-02-sm"/>
                    
                
            </div>)}
           
    </React.Fragment>
  );
}

export default Table;
