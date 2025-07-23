import React, { useEffect, useState,useCallback,useMemo } from "react";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import GateWayIcon from 'assets/neo_icons/Dashboard/GateWay.svg?react';
import Tag from "components/Core/Tags/TagNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import ClickAwayListener from "react-click-away-listener"
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import ActiveIcon from 'assets/neo_icons/Dashboard/Active_tagIcon.svg?react';
import InactiveIcon from 'assets/neo_icons/Dashboard/Inactive_tagIcon.svg?react';
import { useTranslation } from 'react-i18next';
import Button from "components/Core/ButtonNDL";
import { useRecoilState } from "recoil";
import Status from 'components/Core/Status/StatusNDL'

import {
    ConnectivityLoading,themeMode
} from "recoilStore/atoms";

function GateWay(props) {
    const { t } = useTranslation();
    const [input, setInput] = useState(false);
    const [searchText, setsearchText] = useState('')
    const [filteredData, setfilteredData] = useState([])
    const [isActive, setisActive] = useState(true)
    const [isInactive, setisInactive] = useState(true)
    const [loading] = useRecoilState(ConnectivityLoading)
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [loader,setloader] = useState('')
  const [currTheme] = useRecoilState(themeMode);



    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [searchText]);

   
   
    useMemo(() => {
      
        let TotalArray = [...filteredData]//NOSONAR
        if (debouncedSearchText && debouncedSearchText !== '') {
            const searchFilter = props.formatedEdge.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(debouncedSearchText.toLowerCase())
                )
            );
            TotalArray = searchFilter;
        } else if (!isActive || !isInactive) {
            let cloneTagData = [props.formatedEdge]//NOSONAR
          
            if (!isActive) {
                cloneTagData = props.formatedEdge.filter(x => x.status !== "Active")
            }
            if (!isInactive) {
                cloneTagData = props.formatedEdge.filter(x => x.status !== "Inactive")

            }
            TotalArray = cloneTagData;
        } else {
            TotalArray = props.formatedEdge;//NOSONAR
        }
        setfilteredData(TotalArray)
    }, [debouncedSearchText, props.formatedEdge, isActive, isInactive])//NOSONAR

    const clickAwaySearch = () => {

        if (searchText === '')
            setInput(false)
        else
            setInput(true)
    }

    const updateSearch = useCallback((e) => {
        setsearchText(e.target.value);
    }, [setsearchText]);

   
    const TagFilter = (type) => {
        if (type === "Active") {
            setisActive(!isActive)
        } else if (type === "Inactive") {
            setisInactive(!isInactive)
        }

    }
    setTimeout(()=>{
        setloader(loading ? t("Loading") : t("No GateWay Configured "))
    },3000)
    const renderSearchBox=()=>{
        if(input){
         return(
            <InputFieldNDL
                        autoFocus
                        id="Table-search"
                        placeholder={t("Search")}
                        size="small"
                        value={searchText}
                        type="text"
                        onChange={updateSearch}
                        disableUnderline={true}
                        startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} />}
                        endAdornment={searchText !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  onClick={() => { setsearchText(''); setInput(true) }} /> : ''}

                    />
         )
        }else{
            return (
                <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />
            )
        }
    }
    
    return (
        <React.Fragment>

            <div className="gap-2 flex items-center p-2 h-12   justify-between border-b border-Border-border-50  dark:border-Border-border-dark-50">
          <div className="flex items-center gap-2">
          <Tag mono  icon={ActiveIcon}  stroke={!isActive ? "#30A46C" : "#FFF7F7"} bordercolor={{ border: "1px solid #30A46C" }} style={{ color: !isActive ? "#30A46C" : "#FFF7F7", backgroundColor: isActive ? "#30A46C" : (currTheme === 'dark' ? "#111111" : "#FFF"),  textAlign: "-webkit-center", cursor: "pointer" }}  name={`${t('Active')}: ${props.edgeOnlineCount}`} onClick={() => TagFilter("Active")} />
          <Tag mono icon={InactiveIcon}  stroke={!isInactive ? "#CE2C31" : "#FFF7F7"} bordercolor={{ border: "1px solid #CE2C31" }} style={{ color: !isInactive ? "#CE2C31" : "#FFF7F7", backgroundColor: isInactive ? "#CE2C31" : (currTheme === 'dark' ? "#111111" : "#FFF"),  textAlign: "-webkit-center", cursor: "pointer" }}   name={`${t('Inactive')}: ${props.edgeofflineCount}`} onClick={() => TagFilter("Inactive")} />
          </div>
            <div>
                <ClickAwayListener className='h-8' onClickAway={clickAwaySearch}>
                    {renderSearchBox()}
                </ClickAwayListener>
            </div>
            </div>


            {
                filteredData && filteredData.length > 0 ?
                    <Grid container spacing={4} style={{ padding: "8px 8px 8px 8px" }}>
                        {
                            filteredData.map((x, index) => {
                                return (
                                    <Grid item sm={3} lg={3} key={x.LastActive}>
                                        <KpiCards style={{ cursor: "pointer" }} onClick={() => props.edgeMapedInstrument(x)}>
                                            <div className="flex items-center justify-between ">
                                                <GateWayIcon />
                                                <Status lessHeight style={{ color: "#FFF7F7", backgroundColor: x.status === "Active" ? "#30A46C" : "#CE2C31", textAlign: "-webkit-center" }} name={x.status} />

                                            </div>
                                            <Typography variant={"label-02-s"} value={x.name} />
                                            <div className="flex items-center   gap-2">
                                                <Typography color={"#30A46C"} mono variant={"paragraph-xs"} value={`${t('Active')} : ${x.Active ? x.Active : "0"}` } />
                                               <div className="text-Icon-icon-primary dark:text-Icon-icon-primary-dark">|</div> 
                                                <Typography color={"#CE2C31"} mono danger variant={"paragraph-xs"}  value={`${t('Inactive')} : ${x.Inactive ? x.Inactive : "0"}`} />
                                            </div>
                                            <Typography color="tertiary" variant={"paragraph-xs"} mono value={`${t('LastActiveAt')} ${x.LastActive}`} />

                                        </KpiCards>
                                    </Grid>
                                )
                            })

                        }
                    </Grid>

                    :
                 
                        <div className="flex items-center justify-center p-4">
                            <Typography variant={"label-02-m"} value={loader} />

                        </div>

                   
            }



        </React.Fragment>

    )
}

export default GateWay;
