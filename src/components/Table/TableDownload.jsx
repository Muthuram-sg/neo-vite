import React, { useState } from "react";
import Button from "components/Core/ButtonNDL"
import Downloads from 'assets/neo_icons/Menu/newTableIcons/download_table.svg?react';
import ListNDL from '../Core/DropdownList/ListNDL';
// import Download from 'assets/neo_icons/Menu/ClearSearch.svg?react';

import * as XLSX from 'xlsx';

// const DataDownload = forwardRef((props,ref)=>{
function DataDownload(props) {
  const [opendownlist, setopendownlist] = useState(false);
  const [AnchorPossDown, setAnchorPossDown] = useState(null);

  const handleDownloadClick = (e) => {
    setopendownlist(true)
    setAnchorPossDown({ e: e, Target: e.currentTarget })
  }

  const optionDownChange = (e, val) => {
    if (e === 1) {
      downloadExcel(props.data, "", "Exported Data Table", "original")
    } else if (e === 2) {
      downloadExcel(props.filtereddata, props.groupby, "Exported Data Table")
    }
  }

  const handleDownClose = () => {
    setopendownlist(!opendownlist)
    setAnchorPossDown(null)
  };

  const Downloadopt = [
    { id: 1, name: 'Original Data' },
    { id: 2, name: 'Formatted Data ' }
  ]

  // useImperativeHandle((ref),()=>({
  //   downloadData : (value, groupByOptions)=>downloadExcel(value, groupByOptions, "Exported Data Table")
  // }))

  const downloadExcel = (data, groupByOptions, name) => {

    if (data && data.length > 0 || groupByOptions && groupByOptions.length > 0) {


      const formattedData = data.map((item) => {
        const processedItem = {};

        Object.keys(item).forEach((key) => {
          if (key !== 'Action') {  // Exclude 'Action' field
            const value = item[key];

            if (typeof value === 'object' && value !== null) {
              // Check if value is a div-like structure with nested children
              if (props.tagKey && props.tagKey.includes(key) && value.props && Array.isArray(value.props.children)) {
                // Loop through the children and extract the necessary information
                value.props.children.forEach((child) => {
                  if (child && typeof child === 'object' && child.props) {
                    // Check for the priority tag structure (e.g., props.name)
                    if (child.props.name) {
                      processedItem[key] = child.props.name;
                    }
                    if (child.props.value && child.props.style) {
                      processedItem[key] = child.props.value;
                    }
                    if (child.props.children && typeof child.props.children === 'object') {
                      if (child.props.name) {
                        processedItem[key] = child.props.name;
                      }
                      if (child.props.value && child.props.style) {
                        processedItem[key + '_Value'] = child.props.value;
                      }
                    }
                    // Check for the inner div structure that has the style and value
                    // if (child.props.style && child.props.value) {
                    //   processedItem[key + '_Value'] = child.props.value;  // Store the value
                    // }

                    // Handle background color if needed from style
                    // if (child.props.style && child.props.style.backgroundColor) {
                    //   processedItem[key + '_Background'] = child.props.style.backgroundColor;  // Store background color
                    // }
                  }
                });
              } else if (props.tagKey && props.tagKey.includes(key) && value.props && value.props.name) {
                // Handle a single object with props.name
                processedItem[key] = value.props.name;
              } else if (props.tagKey && props.tagKey.includes(key) && value.props && value.props.value) {
                processedItem[key] = value.props.value;
              }
              else if (props.tagKey && props.tagKey.includes(key) && value.props && value.props.title) {
                processedItem[key] = value.props.title;
              }
              else if (props.tagKey && props.tagKey.includes(key) && value.props && value.props.children && typeof value.props.children === 'string') {
                processedItem[key] = value.props.children;
              }
              else if (props.tagKey && props.tagKey.includes(key) && value.props && value.props.children && typeof value.props.children === 'object') {
                if (value.props.children.props && value.props.children.props.name)
                  processedItem[key] = value.props.children.props.name;
              }
              else if (processedItem[key] !== ' ') {
                processedItem[key] = ''
              }
              else {
                processedItem[key] = JSON.stringify(value);  // Convert other objects to JSON
              }
            } else {
              processedItem[key] = value;  // For primitive values
            }
          }
        });

        return processedItem;
      });




      if (groupByOptions.length > 0) {
        const groupByOption = groupByOptions;
        const groupedData = (props.isSpanRows ? props.unFormatedData(data) : formattedData).reduce((acc, item) => {
          const groupKey = item[groupByOption]?.toLowerCase() || "others";
          if (!acc[groupKey]) acc[groupKey] = [];
          acc[groupKey].push(item);
          return acc;
        }, {});

        let finalData = [];

        Object.entries(groupedData)
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([groupValue, records]) => {
            const groupHeader = { [Object.keys(formattedData[0])[0]]: groupValue };
            finalData.push(groupHeader);

            finalData.push(
              Object.keys(formattedData[0])
                .reduce((acc, key) => {
                  acc[key] = key;
                  return acc;
                }, {})
            );

            finalData.push(...records);
          });
        if (props.isSpanRows) {
          const { result, merges } = props.buildExcelDataAndMergesGrouped(finalData,groupByOptions);
          const ws = XLSX.utils.aoa_to_sheet(result);
          ws["!merges"] = merges;
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, props.downFileName || "Exported Data Table.xlsx");
          XLSX.writeFile(wb, props.downFileName + ".xlsx" || "Exported Data Table.xlsx");
        } else {
          const worksheet = XLSX.utils.json_to_sheet(finalData, { skipHeader: true });
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          XLSX.writeFile(workbook, name + ".xlsx");
        }

      } else {
        if (props.isSpanRows) {
          // console.log(formattedData,'formattedData')
          const { result, merges } = props.buildExcelDataAndMerges(props.unFormatedData(data));
          const ws = XLSX.utils.aoa_to_sheet(result);
          ws["!merges"] = merges;
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, props.downFileName || "Exported Data Table.xlsx");
          XLSX.writeFile(wb, props.downFileName + ".xlsx" || "Exported Data Table.xlsx");
        } else {
          const worksheet = XLSX.utils.json_to_sheet(formattedData.filter((x) => x['S.NO'] !== 'Total'));
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          XLSX.writeFile(workbook, name + ".xlsx");
        }

      }
    }
  };

  return (
    <div className="h-8">
      <Button
        type="ghost"
        icon={Downloads}
        Righticon={!props.multitable}
        onClick={(e) =>
          props.multitable
            ? downloadExcel(props.data, "", "Exported Data Table")
            : handleDownloadClick(e)
        }
      />
      {!props.multitable && (
        <ListNDL
          options={Downloadopt}
          Open={opendownlist}
          optionChange={optionDownChange}
          keyValue="name"
          keyId="id"
          id="popper-Gap"
          onclose={handleDownClose}
          anchorEl={AnchorPossDown}
          width="170px"
        />
      )}
    </div>
  )
}
const isRender = (prev, next) => {
  return (prev.data !== next.data || prev.groupByOptions !== next.groupByOptions || prev.filtereddata !== next.filtereddata) ? false : true;
}
const TableDownload = React.memo(DataDownload, isRender)
export default TableDownload