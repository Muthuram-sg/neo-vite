import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL";
import Tag from "components/Core/Tags/TagNDL";
import ClickAwayListener from "react-click-away-listener"
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import ActiveIcon from 'assets/neo_icons/Dashboard/Active_tagIcon.svg?react';
import InactiveIcon from 'assets/neo_icons/Dashboard/Inactive_tagIcon.svg?react';
import { useTranslation } from 'react-i18next';
import Button from "components/Core/ButtonNDL";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import EnhancedTable from "components/Table/Table";
import Status from "components/Core/Status/StatusNDL";
import ThreeDotMenu from 'assets/neo_icons/FaultAnalysis/DotsThreeVertical.svg?react';

import {ConnectivityLoading,ErrorPage,selectedPlant,snackToggle, snackMessage, snackType,themeMode} from "recoilStore/atoms";
import Grid from "components/Core/GridNDL";
import InstrumentList from "./List";
import EnhancedTablePagination from "components/Table/TablePagination";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";

import TableIcon from 'assets/neo_icons/Dashboard/table2.svg?react';
import TileIcon from 'assets/neo_icons/Dashboard/layout-grid.svg?react';


import useSentConnectivityNotification from '../hooks/useSentConnectivityNotification'
import useGetConnectivityChannels from '../hooks/useGetConnectivityChannels'  
import moment from 'moment'
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality
const instrument = React.memo((props) => {//NOSONAR
    const  {subModule1} = useParams();
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const [, SetMessage] = useRecoilState(snackMessage);
  const [currTheme] = useRecoilState(themeMode);

    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const { t } = useTranslation();
    const [input, setInput] = useState(false);
    const [selected, setSelected] = useState("tile"); 
    const [searchText, setsearchText] = useState('')
    const [ uniqueParameters, setuniqueParameters ] = useState([]);
    const [filteredDataMemoMemo, setfilteredDataMemo] = useState([])//NOSONAR
    const [tableData, setTable]= useState([])//NOSONAR
    const [isActive, setisActive] = useState(true)
    const [isInactive, setisInactive] = useState(true)
    const [loading, setLoading] = useRecoilState(ConnectivityLoading)
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [open, setOpen] = useState(false);
    
    const [, setAnchorPos] = useState(null);//NOSONAR
   
    const [currentPage, setCurrentPage] = useState(0);
    const [overallData, setOverallData] = useState([])
    const [currentData, setcurrentData] = useState([])
    const [loader, setloader] = useState('')
    const [selectedCategoryType, setSelectedCategoryType] = useState([]);
    const [selectedGatewayCategoryType, setSelectedGatewayCategoryType] = useState([]);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const { ConnectivitySendEmailLoading, ConnectivitySendEmailError, ConnectivitySendEmailData, getConnectivitySendEmail } = useSentConnectivityNotification();
    const { connectivityChannelsLoading, connectivityChannelsData, connectivityChannelsError, getConnectivityChannels } = useGetConnectivityChannels();
    
    const [headPlant] = useRecoilState(selectedPlant);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(()=>{
        const type = '1a73df77-90f5-4d42-bc4b-f11b4520004e' 
        getConnectivityChannels(type)
    },[headPlant])

    useEffect(()=>{
        if(!ConnectivitySendEmailLoading && !ConnectivitySendEmailError && ConnectivitySendEmailData){
            SetMessage('Notification Sent Successfully')
            SetType("success")
            setOpenSnack(true)
            setOpen(false);
        }
    },[ConnectivitySendEmailLoading, ConnectivitySendEmailError, ConnectivitySendEmailData])

    useEffect(()=>{
        if(subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
            const paramsArray = subModule1.split('&'); 
             // Create an empty object to store the values
             const queryParams = {};
             // Iterate over the array and split each key-value pair
             paramsArray.forEach(param => {  
                const [key, value] = param.split('=');   
                queryParams[key] = value; 
            });
             // Extracting the respective values
             const perPage = queryParams['items_per_page'];
            //  console.log(perPage,"perPageperPage")
             if(perPage && [12, 24, 48, 96, 120 ].includes(Number(perPage))){
                setRowsPerPage(Number(perPage))
             }else{
                setErrorPage(true)
             }
        }
    },[])

    const handleInstrumentCategory = (event) => {
        if (props.page === "child") {//NOSONAR
            setSelectedGatewayCategoryType(event)
            props.getselectedGatewayCategoryType(event)//NOSONAR
        }
        else {
            setSelectedCategoryType(event)
            props.getselectedCategoryType(event)//NOSONAR
        }
    }

    const handleMultipleMailSend = (info) => {

        if (typeof info === "object" && !Array.isArray(info)) {
              const mailJson = {
                    "isSingle":"2",
                    "payload": {
                        "line_name": headPlant ? headPlant.name : "--",
                        "mail_date": moment().format("DD/MM/YYYY"),
                        "iid": info.id,
                        "insname": info.name,
                        "time": info.LastActive,
                        "email": uniqueParameters.join(",") 
                    }
                };
                getConnectivitySendEmail(mailJson);
        } else if (Array.isArray(info)) {
    
        const statusNames = info.map(item => item.Status.props.children.props.name);
    
        const hasActive = statusNames.includes("Active");
    
        if (!hasActive) {
            const inactiveCount = statusNames.filter(status => status === "Inactive").length;
            if (inactiveCount >= 2) {
                const mailJson = {
                    "isSingle":"1",
                    "payload": {
                        "line_name": headPlant ? headPlant.name : "--",
                        "mail_date": moment().format("DD/MM/YYYY"),
                        "inactive_details": info,
                        "email": uniqueParameters.join(",") 
                    }
                };
                getConnectivitySendEmail(mailJson);
            } 
        }
    }
    };

    const processConnectivityChannelsData = (connectivityChannelsData) => {
        if (!connectivityChannelsData || !Array.isArray(connectivityChannelsData)) return [];
    
        const uniqueParameters = [
            ...new Set(
                connectivityChannelsData
                    .flatMap((item) => item.parameter.split(",").map((param) => param.trim())) 
            ),
        ];
    
        return uniqueParameters;
    };
    
    useEffect(() => {
        if (!connectivityChannelsLoading && connectivityChannelsData && !connectivityChannelsError) {
    
            setuniqueParameters(processConnectivityChannelsData(connectivityChannelsData))
        }
    }, [connectivityChannelsLoading, connectivityChannelsData, connectivityChannelsError]);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value))
        let endIndex = parseInt(event.target.value)
        let final = filteredDataMemoMemo.filter(x => x.is_offline === false);
        setOverallData(final)
        setcurrentData(final.slice(0, endIndex))
        setCurrentPage(0)
    }

    
    useEffect(() => {
        if(props.FormattedMeter){//NOSONAR
            let TotalArr = props.FormattedMeter.filter(x => x.is_offline === false);//NOSONAR
            setInactiveCount(TotalArr.filter(x => x.status === "Inactive").length);
            setActiveCount(TotalArr.filter(x => x.status === "Active").length);
        }
      
    },[props.FormattedMeter])//NOSONAR


    useMemo(() => {
        let TotalArray = [...filteredDataMemoMemo];//NOSONAR
        TotalArray = props.FormattedMeter;//NOSONAR
    
        if (debouncedSearchText && debouncedSearchText !== '') {
            setLoading(true);
            const searchFilter = props.FormattedMeter.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(debouncedSearchText.toLowerCase())
                )
            );
            TotalArray = searchFilter;
        }
    
        if (!isActive && !isInactive) {
            // Both filters are false, so display no data
            TotalArray = [];
        } else {
            let cloneTagData = TotalArray;
    
            // Apply the active/inactive filters
            if (!isActive) {
                cloneTagData = TotalArray.filter(x => x.status !== "Active");
            }
            if (!isInactive) {
                cloneTagData = cloneTagData.filter(x => x.status !== "Inactive");
            }
            TotalArray = cloneTagData;
        }
    
        let final = TotalArray.filter(x => x.is_offline === false);
    
        setfilteredDataMemo(final);
        setLoading(false);
        console.log(final,"finalfinal")
        setOverallData(final)
        setcurrentData(final.slice(0, rowsPerPage))
    }, [debouncedSearchText, props.FormattedMeter, isActive, isInactive])//NOSONAR



    const updateSearch = useCallback((e) => {
        setsearchText(e.target.value);
    }, [setsearchText]);

    const handleSwitch = (type) => {
        setSelected(type);
      };

    const handlePageChange = (e, pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = pageNumber * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        let final = filteredDataMemoMemo.filter(x => x.is_offline === false);
        setOverallData(final)
        setcurrentData(final.slice(startIndex, endIndex))
    };
    console.log(isActive,isInactive,"truefalse")
    const TagFilter = (type) => {
        if (type === "Active") {
            setisActive(!isActive)
        }
        if (type === "Inactive") {
            setisInactive(!isInactive)
        }

    }
    const listArray = [
        { index: 'parent', name: 'Connectivity' },
        { index: 'child', name: props.GatewayName },//NOSONAR

    ]
    const clickAwaySearch = () => {
        if (searchText === '')
            setInput(false)
        else
            setInput(true)
    }
    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };

    const downloadConnectivityData = (data, name) => {
        let filteredDownloadData = []
        data.forEach((x) => {
            let category = props.instrumentCategoryList.find((f) => f.id === x.category)
            filteredDownloadData.push({ Id: x.id, Name: x.name, Status: x.status, LastActive: x.LastActive, InstrumentCategory: category.name })
        })
        downloadExcel(filteredDownloadData, name)
    }

    const renderSearchBox = () => {
        if (input) {
            return (
                <InputFieldNDL
                    autoFocus
                    id="Table-search"
                    placeholder={t("Search")}
                    size="small"
                    value={searchText}
                    type="text"
                    onChange={updateSearch}
                    disableUnderline={true}
                    startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  style={{ padding: '4px' }} />}
                    endAdornment={searchText !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  style={{ padding: '4px' }} onClick={() => { setsearchText(''); setInput(true) }} /> : ''}

                />
            )
        } else {
            return (
                <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />
            )
        }
    }

    const headCells = [
        
        {
            id: 'SNo',
            numeric: false,
            disablePadding: true,
            label: 'SNo',
        },
        {
            id: 'Instrument',
            numeric: false,
            disablePadding: true,
            label: 'Instrument',
        },
        {
            id: 'Instrument Category',
            numeric: false,
            disablePadding: true,
            label: 'Instrument Category',
        },
        

        {
            id: 'LastActive',
            numeric: false,
            disablePadding: true,
            label: 'Last Active',
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
        },
        {
            id: 'iid',
            numeric: false,
            disablePadding: true,
            hide: true,
            label: 'iid',
            display: "none"
        }
      ];

    setTimeout(() => {
        setloader(loading ? t("Loading") : t("No data"))
    }, 3000)

    useEffect(() => {
        setSelectedCategoryType(props.selectedCategoryType)//NOSONAR
    }, [props.selectedCategoryType])//NOSONAR

    useEffect(() => {
        processedrows();
    }, [overallData])

    const processedrows = () => {
        let temptabledata = []; 
        // console.log(overallData,"overallData")
        if (overallData.length > 0) {
            temptabledata = temptabledata.concat(
                overallData.map((val, index) => {
                    return [
                        index + 1,
                        val.name,
                        props.instrumentCategoryList.find((f) => f.id === val.category)?.name,
                        val.LastActive,
                        <div key={val.id} className="flex items-center justify-center">
                        <Status
                            lessHeight
                            noWidth="80px"
                            style={{ textAlign: "center" }}
                            colorbg={val.status === "Active" ? "success-alt" : "error-alt"}
                            name={val.status}
                        />
                        </div> ,
                        val.id                   
                    ];
                })
            );
        }
        setTable(temptabledata);
    };    

    const handleClick = (event) => {
        setOpen(!open)
        setAnchorPos(event.currentTarget)
        event.stopPropagation()
    };

   

   

    useEffect(() => {
        setSelectedGatewayCategoryType(props.selectedGatewayCategoryType)//NOSONAR
    }, [props.selectedGatewayCategoryType])//NOSONAR

    const getOverallPercentage = () => {
        let totalInstrumentCount = Number(activeCount + inactiveCount) //props.mtrOnlineCount + props.MtrofflineCount
        let overallPercentage = totalInstrumentCount>0 ? ((activeCount / totalInstrumentCount) * 100).toFixed(2) : 0

        return overallPercentage
    }
    const getStrokeColor = (iconType) => {
        if (selected === iconType) {
          return currTheme === "dark" ? "#FFFFFF" : "#202020";
        }
        return "#646464";
      };
    // console.log(currentData,"currentData")
    return (
        <React.Fragment>
            {
                props.page === "child" &&//NOSONAR
                <div className="flex" style={{ justifyContent: "left" }}>
                    <BredCrumbsNDL breadcrump={listArray} onActive={() => props.handleActiveIndex(props.page)} />
                </div>
            }
            <div>
                <div className="flex items-center gap-2  justify-between  border-Border-border-50  dark:border-Border-border-dark-50">
            <div className="flex gap-2 items-center p-2">
                    <div className="flex items-center gap-2">
                        <Tag mono icon={ActiveIcon}  stroke={!isActive ? "#30A46C" : "#FFFFFF"} bordercolor={{ border: "1px solid #30A46C" }} style={{ color: !isActive ? "#30A46C" : "#FFFFFF", backgroundColor: isActive ? "#30A46C" : (currTheme === 'dark' ? "#111111" : "#FFF"), textAlign: "-webkit-center", cursor: "pointer" }} name={`${t('Active')}: ${activeCount}`} onClick={() => TagFilter("Active")} />
                        <Tag mono icon={InactiveIcon}  stroke={!isInactive ? "#CE2C31" : "#FFFFFF"} bordercolor={{ border: "1px solid #CE2C31" }} style={{ color: !isInactive ? "#CE2C31" : "#FFFFFF", backgroundColor: isInactive ? "#CE2C31" : (currTheme === 'dark' ? "#111111" : "#FFF"), textAlign: "-webkit-center", cursor: "pointer" }} name={`${t('Inactive')}: ${inactiveCount}`} onClick={() => TagFilter("Inactive")} />
                    </div>
                    <div className='p-2' style={{ justifyContent: "left" }}>
                <div className="flex gap-1 items-center">
                <Typography variant={'label-02-m'} value= {`${loading ? t("Loading") : getOverallPercentage() + "%"}`} mono  />
                <Typography variant={"label-02-m"} value={`${loading ? t("") : t("Instruments are Active")}`} />
                </div>
                    
                </div>
            </div>
<div className="flex items-center gap-2">
{selected === "tile" &&
<React.Fragment>
<ClickAwayListener onClickAway={clickAwaySearch}>

    {renderSearchBox()}
</ClickAwayListener>
<Button icon={Download} type='ghost' onClick={() => { downloadConnectivityData(filteredDataMemoMemo, "Connectivity Instrument") }} />
</React.Fragment>}
<div  className='w-[250px] flex items-center gap-1'  >
                        <SelectBox
                            labelId="Select-type-label"
                            label=""
                            id="selectTypeLabel"
                            placeholder={t("Select Category")}
                            auto={false}
                            options={props.instrumentCategoryList}//NOSONAR
                            isMArray={true}
                            value={props.page === "child" ? selectedGatewayCategoryType : selectedCategoryType}
                            onChange={handleInstrumentCategory}
                            keyValue="name"
                            keyId="id"
                            multiple={true}
                            checkbox={true}
                            selectAll={true}
                            selectAllText={t('All Category')}
                        />
                    </div>
<div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
    <button
        className={`flex items-center justify-center p-2 transition ${
        selected === "tile" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
        } rounded-md`}
        onClick={() => handleSwitch("tile")}
    >
       <TileIcon stroke={getStrokeColor("tile")} />
    </button>
    <button
        className={`flex items-center justify-center p-2 transition ${
        selected === "table" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark" : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
        } rounded-md`}
        onClick={() => handleSwitch("table")}
    >
   <TableIcon stroke={getStrokeColor("table")} />
    </button>
    </div>
</div>

                </div>
            </div>


                {selected === 'tile' && (
                    currentData.length > 0 ? (
                        <>
                        <Grid container spacing={4} style={{ padding: "8px" }}>
                            {currentData.map((item) => (
                            <InstrumentList key={item.id} item={item} />
                            ))}
                        </Grid>

                        <EnhancedTablePagination
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            count={filteredDataMemoMemo.length}
                            rowsPerPage={rowsPerPage}
                            PerPageOption={[12, 24, 48, 96, 120]}
                            page={currentPage}
                            visibledata={[]}
                        />
                        </>
                    ) : (
                      
                        <div className="flex items-center justify-center p-4">
                            <Typography variant={"label-02-m"} value={loader} />
                        </div>
                       
                    )
                    )}

                {selected === 'table' && (
                         <EnhancedTable
                         heading={"Instrument Details"}
                         headCells={headCells}
                         data={tableData}
                         rawdata={overallData}
                         search={true}
                         download={true}
                         rowSelect={true}
                         buttonpresent={"Send Notification"}
                         checkBoxId={"SNo"}
                         tagKey={["Status"]} 
                         enableThreeDot={true}
                         ThreeDotButtonIcon={ThreeDotMenu}
                         handleClick={handleClick}
                        onClickbutton={(value) => handleMultipleMailSend(value)}    
                        verticalMenu={true}
                        name="ConnectivityTable"
                        actionenabled={true}
                        enablenotification={true}
                        handlenotificationClick={(value) => handleMultipleMailSend(value)}  
                        groupBy={'connectivity_table'}
                         />
                    )}
        </React.Fragment>

    )
}

)
export default instrument;
