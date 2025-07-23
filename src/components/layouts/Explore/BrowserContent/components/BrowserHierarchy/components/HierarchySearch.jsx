/* eslint-disable array-callback-return */
import React, { useEffect, useState, forwardRef} from "react";
import ClickAwayListener from 'react-click-away-listener';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useRecoilState } from "recoil";
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import { hierarchyvisible,customdates, selectedPlant,themeMode} from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';






const HierarchySearch = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [customdatesval] = useRecoilState(customdates);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setInput] = useState(false);
    const [, setShowHierarchy] = useRecoilState(hierarchyvisible)
      const [currTheme] = useRecoilState(themeMode);
    
    const [openExplore,setOpenExplore] = useState([])
 

        useEffect(() => {

        if (search === '' && props.defaultExpandNodeList.length === 0) {
            setShowHierarchy(false)
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    useEffect(()=>{
        setSearch('')
        keysearch('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[customdatesval])

    const updateSearch = (event) => {
        let value = event.target.value.trim().split(/ +/).join(' ');
        setSearch(event.target.value);
        keysearch(value)
    }
    const clickAwaySearch = () => {
        if (search === '')
            setInput(false)

        else
            setInput(true)
    }

    function dfs(node, term, foundIDS, nodes) {

        let isMatching = node.name && node.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        if (Array.isArray(node.children)) {
            node.children.forEach((child) => {
                dfs(child, term, foundIDS, nodes);
            });
        }
        if (isMatching && node.id) {
            foundIDS.unshift(node);
            nodes.unshift(node.nodeId)
        }

        return isMatching;
    }

    useEffect(() => {
        const storedData = localStorage.getItem("openExploreFromAH");
        if (storedData) {
          try {
            setOpenExplore(JSON.parse(storedData));
          } catch (error) {
            console.error("Failed to parse JSON:", error);
            setOpenExplore(null);
          }
        } else {
          setOpenExplore(null); 
        }
      }, []);

      useEffect(()=>{
        if(openExplore && props.fetchValuesStatus === false){
            setSearch(openExplore.selectedInstrumentId)
        keysearch(openExplore.selectedInstrumentId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[openExplore, props.fetchValuesStatus])

    function keysearch(term) {
        const matchedIDS = [];
        const nodes = [];
        dfs(props.selectedHierarchy, term, matchedIDS, nodes);
        const filteredMatchedIDS = matchedIDS.filter(node => node.name !== "All Instruments");
        if (term === '') {
            props.setTreeData(props.selectedHierarchy);
            return;
        }
    
        if (filteredMatchedIDS.length > 0) {
            
            props.setTreeData({ name: headPlant.name, children: filteredMatchedIDS, expanded: true });
            props.setSearchNodeList(nodes);
            
        } else {
            props.setTreeData('');
        }
        
    }

    const ClearSearch = () =>{
        setSearch(''); 
        props.setTreeData(props.selectedHierarchy)
    }

    return (
        <div  className='px-4 pb-2 '>
            <ClickAwayListener onClickAway={clickAwaySearch}>
                <InputFieldNDL
                    placeholder={t("Search")}
                    size="small"
                    value={search?search:''}
                    type="text"
                    onChange={updateSearch}
                    startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} /> }
                    endAdornment = {search !== '' ?<Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  onClick={ClearSearch}/> : undefined}
                    disabled={props.fetchValuesStatus}
                    //endAdornmentOnclick={ClearSearch}
                />
            </ClickAwayListener>
        </div>
    );
});
export default HierarchySearch;

