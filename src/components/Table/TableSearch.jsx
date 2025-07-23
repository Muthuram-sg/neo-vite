
import React,{ useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener"
import InputFieldNDL from 'components/Core/InputFieldNDL';
// import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Search from 'assets/neo_icons/Menu/newTableIcons/search_table.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import { themeMode } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';


function Tablesearch(props) {
    const { t } = useTranslation(); 
    const [input, setInput] = useState(false);
  const [curTheme] = useRecoilState(themeMode);


    useEffect(() => {
        if (props.search) {
        setInput(true)
        props.searchdata(props.search)
        }else{
          //  setInput(false)
            props.searchdata("")
        }
         
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.search]);

    
  
    const updateSearch = (event) => {
        props.searchdata(event.target.value)

        // calculateData(currentPage, InstrumentFormulaList, event.target.value)
    }

    const clickAwaySearch = () => {
        if (props.search === '')
            setInput(false)
        else
            setInput(true)
    }


    return (
        <ClickAwayListener onClickAway={clickAwaySearch}>
            {input ? <div><InputFieldNDL
                autoFocus
                id="Table-search"
                placeholder={t("Search")}
                size="small"
                value={props.search}
                type="text"
                onChange={updateSearch}
                disableUnderline={true}
                startAdornment={<Search stroke={curTheme === 'dark' ? "#b4b4b4" : '#202020'}  />}
                endAdornment={props.search !== '' && <Clear stroke={curTheme === 'dark' ? "#b4b4b4" : '#202020'}  onClick={() => {  props.searchdata(''); setInput(true) }} />}

            /></div> : <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />}
        </ClickAwayListener>
    )
}

const isRender = (prev, next) => {
    return prev.search !== next.search ? false : true
}
const TableSearch = React.memo(Tablesearch, isRender)

export default TableSearch