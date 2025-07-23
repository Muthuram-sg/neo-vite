import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useRecoilState } from "recoil";
import { themeMode ,selectedPlant,snackMessage,snackType,snackToggle} from 'recoilStore/atoms'
import OrderUp from 'assets/neo_icons/Arrows/arrow-up.svg?react';
import OrderDown from 'assets/neo_icons/Arrows/arrow-down.svg?react';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import DragIcon from '../../assets/Vertical-Menu.svg?react';
import Filter from 'assets/FilterIcon.svg?react';
import Button from "components/Core/ButtonNDL";
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL';
function TableHeader(props) {
    const [isopen, setIsopen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const { order,isSpanRows } = props;
    const [curTheme] = useRecoilState(themeMode);
    const [columnOption, setColumnOption] = useState(props.ColAllOption);
    const [OptionArray, setOptionArray] = useState([])
    const ThemeColor = curTheme === 'dark' ? '#6e6e6e' : '#8d8d8d'
    const DragHandle = sortableHandle(() => <DragIcon height={16} width={16} />);
    const [dynamicKeyValue, setDynamicKeyValue] = useState("");
    const [selectedValue, setSelectedValue] = useState([]);
    const [SearchArray, setSearchArray] = useState([]);
    const [overAllTableData, setOverAllTableData] = useState(props.optimiseData);
    // const [SelectedOpt, setSelectedOpt] = useState([]);
    const [columnWidths, setColumnWidths] = useState({}); 
    const [isSelect,setIsSelect]= useState({ all:false, checked:false});
    const [selected, setSelected] = useState(false)
    const [ErrorMsg,setErrorMsg] = useState(false)
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const handleResize = (newWidth, id) => {
        setColumnWidths((prevWidths) => ({
            ...prevWidths,
            [id]: newWidth, 
        }));
    };

    useEffect(()=>{setColumnOption(props.ColAllOption)},[props.ColAllOption])

    useEffect(() => {
        if (props.optimiseData && props.optimiseData.length > 0) {
            setOverAllTableData(props.optimiseData);
        }  
    }, [props.rawData,props.optimiseData]);


    
    const filterPopOpen = (event, id) => {
        // console.log(props.ColAllOption,"props.ColAllOption",columnOption)
        let ColData = props.ColAllOption.filter(t=>t.id === id)[0]
        // let selectedArr = ColData.option.filter(p=> p.checked).map(m=> m[id])
        // let OptionFinal = ColData.option.map(item => item[id])
        // OptionFinal.concat(selectedArr); 
        // let TableOpt = ColData.DefOption.map(item => item[id])
        let filterOpt = []
        ColData.rawOption.forEach(op=> {
            let findval = ColData.optionsrh.find(f=> f[ColData.id] === op[ColData.id])
            if(findval){
                filterOpt.push({...op,checked: findval.checked})
            }
        })
        
        // console.log(filterOpt,"ColData.id",ColData.id,ColData)
        props.ColAllOption.map(m=>{
            if(m.id !== ColData.id && m.colSearch ){
                let comArr2 = []
                m.rawOption.forEach(op=> {
                    let findval = m.optionsrh.find(f=> f[m.id] === op[m.id])
                    if(findval && findval.checked){
                        comArr2.push(op)
                    }
                })
                // const uniquecom1 = comArr.filter((v, i, a) => a.findIndex(v2 => v[m.id] === v2[m.id]) === i); //remove duplicate
                const finalarr = comArr2.filter((v, i, a) => a.findIndex(v2 => v[m.id] === v2[m.id]) === i); //remove duplicate
                // console.log(comArr2,"finalarr",uniquecom2)
                // console.log(finalarr,"finalarr",filterOpt)
                // filterOpt = filterOpt.filter(ar => comArr.includes(ar[ColData.id]))
                if(finalarr.length){
                    filterOpt = filterOpt.filter(ar => finalarr.map(f1=> f1[m.id]).includes(ar[m.id]))
                }
                
                // console.log("finalarr","filterPopOpen1",filterOpt,m.id)
            }
        })
        let uniqopt = filterOpt.filter((v, i, a) => a.findIndex(v2 => v[ColData.id] === v2[ColData.id]) === i); //remove duplicate
        let Finalopt = uniqopt.map(f=>{return{ [ColData.id] : f[ColData.id],checked: f.checked}})
        // filterOpt = Finalopt
        // console.log(props.ColAllOption,"filterPopOpen",filterOpt,ColData,Finalopt)
        // if(OptionFinal.length !== TableOpt.length ){
        //     TableOpt = OptionFinal
        // }
        // const uniqueArray = [...new Set(TableOpt)];
        
        // let findColumn = uniqueArray.map((value) => ({
        //                         [id]: value,
        //                         checked:  ColData.option.find(c=> c[id] === value) ? ColData.option.find(c=> c[id] === value).checked : true
            
        //     }));
        
            // console.log("findColumn",props.ColAllOption,id,filterOpt)

        // setSelectedOpt(selectedArr)
        setDynamicKeyValue(id);
        // setColumnOption(filterOpt);
        setSelectedValue(Finalopt)
        setOptionArray(Finalopt);
        setSearchArray(Finalopt)
        setNotificationAnchorEl({ e: event, Target: event.currentTarget });
        setIsopen(true);
    };



    const optionChange = (e, data, val, dynamicKeyValue) => {
        let AllOption = [...props.ColAllOption]
        let selected = [...overAllTableData]
        let ExistIndex = selected.findIndex(x => x[dynamicKeyValue] === e[dynamicKeyValue]);
        if (ExistIndex > -1) {
            // Check already selected and remove
            selected.splice(ExistIndex, 1);
        } else {
            selected.push({ ...e, checked: !e.checked })
        }

        // setSelectedValue(selected)
        if (props.maxSelect && props.maxSelect < selected.length) {
            return false
        }
        // console.log(val,"optionChange",AllOption,e,data)
        if (val) {
            let obj = AllOption.find((x) => x.id === dynamicKeyValue);
        
            if (obj) {
                let updatedOptionsrh = OptionArray.map((v) => ({
                    ...v,
                    checked: val.selectAll,
                }));
        
          
                let colOpt = props.ColAllOption.map(x=>{
                    if(x.id=== dynamicKeyValue){
                    return {
                        ...x, option:updatedOptionsrh,
                        optionsrh:updatedOptionsrh
                    }
                    }
                    else{
                        // console.log(x.)
                         
                            let sel = updatedOptionsrh.filter(c=>c.checked).map(m=> m[dynamicKeyValue])
                            let optionraw = x.rawData.filter(r=> sel.includes(r[dynamicKeyValue])) 
                            let otherOpt = []
                            
                            x.rawOption.map(r=> {return {[x.id] :r[x.id],checked: r.checked}}).forEach(ot =>{
                                if(ot.checked){
                                    if(optionraw.map(op=>op[x.id]).includes(ot[x.id])){
                                        otherOpt.push(ot)
                                    }
                                }else{ 
                                        otherOpt.push(ot) 
                                }
                            })
                            let mergeopt = [...x.optionsrh,...otherOpt]
                            
                            const unique = mergeopt.filter((v, i, a) => a.findIndex(v2 => v[x.id] === v2[x.id]) === i); //remove duplicate
                            // console.log(optionraw,unique,"optionrawall",obj,x,x.id)
                            return{
                                ...x,
                                option: unique,
                                optionsrh:unique
                            }
                        
                    }
                })
                if(updatedOptionsrh.some(s=> s.checked)){
                    setColumnOption(colOpt)
                    props.setColAllOption(colOpt); 
                }
                // console.log(colOpt,"colOpt")
                setSearchArray(updatedOptionsrh); 
                setOptionArray(updatedOptionsrh);
                

                setSelectedValue(val.selectAll ? updatedOptionsrh : []); 
                setIsSelect({
                    all:true,
                    checked:val.selectAll
                })
            }
        }
        else {

            let obj = AllOption.filter(x => x.id === dynamicKeyValue)[0]
            let optarray = SearchArray.map(v => {
                let opt = data.find(op=> op[dynamicKeyValue] === v[dynamicKeyValue])
                //To Select and de-select the option
                if (e[dynamicKeyValue] === v[dynamicKeyValue]) {
                    return { ...v, checked: !e.checked }
                } else {
                    return {...v,checked: opt ? opt.checked : v.checked}
                }
            });

            let Alloptarray = OptionArray.map(v => { //To Select and de-select the option
                let opt = data.find(op=> op[dynamicKeyValue] === v[dynamicKeyValue])
                if (e[dynamicKeyValue] === v[dynamicKeyValue]) {
                    return { ...v, checked: !e.checked }
                } else {
                    return {...v,checked: opt ? opt.checked : v.checked}
                }
            });
            // if(Alloptarray.every(s=> !s.checked)){
            //     return false
            // }

            obj['option'] = optarray
            obj['optionsrh'] = Alloptarray
            
            let indx = AllOption.findIndex(i => i.id === dynamicKeyValue)
            AllOption[indx] = obj;
            let colOpt = AllOption.map(v=>{
                if(v.colSearch){
                    if(dynamicKeyValue === v.id){
                        return v
                    }else{
                        // if(optarray.some(s=> !s.checked)){
                            
                            let sel = Alloptarray.filter(c=>c.checked).map(m=> m[dynamicKeyValue])
                            let optionraw = v.rawData.filter(r=> sel.includes(r[dynamicKeyValue])) 
                            let otherOpt = []
                            v.rawOption.map(r=> {return {[v.id] :r[v.id],checked: r.checked}}).forEach(ot =>{
                                if(ot.checked){
                                    if(optionraw.map(op=>op[v.id]).includes(ot[v.id])){
                                        otherOpt.push(ot)
                                    }
                                }else{
                                    // console.log(ot,"otot",optionraw,v.id) 
                                        otherOpt.push(ot) 
                                }
                            })
                            let mergeopt = [...v.optionsrh,...otherOpt]
                            let uniq = mergeopt.filter((v1, i, a) => a.findIndex(v2 => v1[v.id] === v2[v.id]) === i); //remove duplicate
                            // let otherRaw = v.rawData.filter(r=> v.optionsrh.map(x=> x[v.id]).includes(r[dynamicKeyValue]))
                            // console.log(v,sel,"dynamicKeyValue",dynamicKeyValue,v.id,v.option,"dynamicKeyValue",optionraw,allOption,otherOpt,otherRaw,v.rawOption.map(r=> {return {[v.id] :r[v.id],checked: r.checked}}))
                            return {...v,
                                optionsrh : uniq,
                                option: uniq
                            }
                            
                                
                             
                        // }else{
                        //     let sel = Alloptarray.filter(c=>c.checked).map(m=> m[dynamicKeyValue])
                        //         let optionraw = v.rawData.filter(r=> sel.includes(r[dynamicKeyValue]))
                        //         let otherOpt = []
                        //         v.rawOption.map(r=> {return {[v.id] :r[v.id],checked: r.checked}}).forEach(ot =>{
                        //             if(ot.checked){
                        //                 if(optionraw.map(op=>op[v.id]).includes(ot[v.id])){
                        //                     otherOpt.push(ot)
                        //                 }
                        //             }else{
                        //                 // console.log(ot,"otot",optionraw,v.id)
                        //                 // if(optionraw.map(op=>op[v.id]).includes(ot[v.id])){
                        //                     otherOpt.push(ot)
                        //                 // }
                        //             }
                        //         })
                        //         let mergeopt = [...v.optionsrh,...otherOpt]
                        //         let uniq = mergeopt.filter((v1, i, a) => a.findIndex(v2 => v1[v.id] === v2[v.id]) === i); //remove duplicate
                                
                        //         // console.log("optionraw3",v.optionsrh,uniq,v.id,optionraw,sel)
                        //     return {...v,
                        //             // optionsrh : uniq,
                        //             option: uniq
                        //         }
                        // }
                        
                        
                    }
                }else{
                    return v
                }  
            })
            
            
            // console.log(colOpt,"colOpt",optarray,Alloptarray)
            // if(optarray.some(s=> s.checked)){
                props.setColAllOption(colOpt)
                // setColumnOption(colOpt)
            // }
            

            
            setOptionArray(Alloptarray)
            setSearchArray(optarray)
            setSelectedValue(selected);
            setIsSelect({
                all:false,
                checked:false
            })
            

            
        }
    };



    const filterColumnFun = (val, dynamicKeyValue) => {
        
        let array = [];
        let filterChecked = val.filter(x => x.checked);
        
        filterChecked.forEach(item => array.push(extractValue(item[dynamicKeyValue])));
        
        let visibleTemp = props.ColAllOption.find(x => x.id === dynamicKeyValue);
        let filteredData = visibleTemp.overAllTabData;
    
        if (array.length > 0) {
            let Finalfilter = visibleTemp.overAllTabData.filter(x => 
                val.filter(f => f.checked).map(v => extractValue(v[dynamicKeyValue])).includes(extractValue(x[dynamicKeyValue]))
            );
            filteredData = Finalfilter;
        }
    // console.log(filteredData,"filteredData1",props.ColAllOption)
        props.ColAllOption.forEach(h => {
            let visibility = h.display && h.display === 'none' ? false : true 
            if (h.colSearch && visibility) {
                let overAllData = filteredData.length ? filteredData : visibleTemp.overAllTabData;
                if (array.length === visibleTemp.DefOption.length) {
                    filteredData = overAllData.filter(x => 
                        // visibleTemp.DefOption.filter(f => f.checked).map(v => extractValue(v[dynamicKeyValue])).includes(extractValue(x[dynamicKeyValue]))
                        h.optionsrh.filter(f => f.checked).map(v => extractValue(v[h.id])).includes(extractValue(x[h.id]))
                    );
                } else {
                    filteredData = overAllData.filter(x => 
                        h.optionsrh.filter(f => f.checked).map(v => extractValue(v[h.id])).includes(extractValue(x[h.id]))
                    );
                }
                // console.log(filteredData,"filteredData3",array.length,visibleTemp.DefOption.length,h,visibleTemp)
            }
        });
        // console.log(filteredData,"filteredData2")
    
        if (array.length === 0 && 
            visibleTemp.option.length === visibleTemp.DefOption.length && 
            visibleTemp.rawData.length === visibleTemp.rawOption.length
        ) {
            props.setvisibledata(visibleTemp.overAllTabData);
            props.setDownloadabledata(visibleTemp.overAllTabData.map(({ action, ...rest }) => rest));
            return;
        }
    
        if (visibleTemp.option.length !== 0) {
            props.setvisibledata(filteredData);
            props.setDownloadabledata(filteredData.map(({ action, ...rest }) => rest));
        }
    };
    
    const extractValue = (val) => {
        if (val && typeof val === "object" && val.props && val.props.name) {
            return val.props.name;
        }
        return val;
    };
    

   



    function handleClose() {
        const allUnchecked = OptionArray.every(option => !option.checked); 

        if (allUnchecked) {
           
            setErrorMsg(true)
          
            return; 
        }
        setErrorMsg(false)
        // props.setColAllOption(columnOption)
        if(OptionArray.some(s=> s.checked)){
            setNotificationAnchorEl(null);
            setIsopen(false);
            
            setSearchArray(OptionArray)
            filterColumnFun(OptionArray, dynamicKeyValue);
        }
        
    }
    const SortableItem = sortableElement(({ headCell, index }) => (

        <th key={headCell.id} scope="col" className={`text-[16px] font-medium bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  text-Text-text-primary dark:text-Text-text-primary-dark leading-[18px] font-geist-sans Table-td-LR Table-td-Top table-cell whitespace-nowrap ${isSpanRows ? "border-r border-Border-border-50 dark:border-Border-border-dark-50" : ""}`}align="left" colSpan={headCell.colSpan ? headCell.colSpan : undefined}  style={{
            width: columnWidths[headCell.id] || headCell.width
        }}>

            <div className="flex items-center">

                {props.rowSelect && <DragHandle />}
                {
                    headCell.subLabel ? (
                        <div>
                            <div>
                                {capitalizeWords(headCell.label)}
                            </div>
                            <div>
                                {`${headCell.subLabel} kwh`}
                            </div>
                        </div>
                    ) :


                    (
                        props.rowSelect ? <ResizableBox
                        stroke={ThemeColor}
                        width={columnWidths[headCell.id] || headCell.width}
                            axis="x"
                            resizeHandles={['e']}
                            minConstraints={[120]}
                            maxConstraints={[500]}
                            onResizeStop={(e, data) => handleResize(data.size.width, headCell.id)}

                        >

                            <React.Fragment>{headCell.noCammelCase ? (headCell.label || '') : capitalizeWords(headCell.label || '')}</React.Fragment>

                        </ResizableBox> : <React.Fragment>{headCell.noCammelCase ? (headCell.label || '') : capitalizeWords(headCell.label || '')}</React.Fragment>
                    )

            }
                {
                    headCell.colSearch
                    &&
                    <div>
                        <Button icon={Filter} onClick={(e) => filterPopOpen(e, headCell.id)} type={"ghost"} />

                    </div>
                }


                 

                {headCell.label && headCell.label !== " "  && !(props.tagKey && Array.isArray(props.tagKey) &&props.tagKey?.includes(headCell.label)) && (
                    order === 'asc' ?
                        <OrderUp style={{ marginLeft: '4px' }} onClick={(e) => props.onRequestSort(e, headCell.id)} stroke={ThemeColor} />
                        :
                        <OrderDown style={{ marginLeft: '4px' }} onClick={(e) => props.onRequestSort(e, headCell.id)} stroke={ThemeColor} />)
                }

            </div>




        </th>

    ));

    const SortableContainer = sortableContainer(({ children }) => {
        let actionHead = props.headCells.find(h => h.id === 'actions');
        return <tr>
            {props.headCells.find(h => h.id === 'ExpandOrCollapse') && <th>{
                props.groupBy !== '' && <div style={{ justifyContent: 'center', display: 'flex' }}> <div></div>&nbsp;<Checkboxs checked={props.checked} onChange={() => {setSelected(!selected);props.selectAll()}} /></div>
                }</th>}
            {children}
            {
                actionHead &&
                <th key={actionHead ? actionHead.id : "action"} scope="col" className="text-[16px] font-medium  text-Text-text-primary dark:text-Text-text-primary-dark leading-[18px] font-geist-sans Table-td-LR Table-td-Top table-cell whitespace-nowrap" align="left" >
                    {capitalizeWords(actionHead ? actionHead.label : "")}
                </th>
            }

        </tr>;
    });

    function capitalizeWords(text) {
        if (!text) return ''; // Handle empty or undefined input
        return text
            .toLowerCase() // Convert entire text to lowercase
            .split(' ') // Split by spaces to handle multiple words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
            .join(' '); // Join the words back into a single string
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        let headCell = props.headCells;
        let Icr = props.rowSelect ? 1 : 0;
        let newIdx = headCell.map((_, index) => index + Icr);
        newIdx.splice(newIndex, 0, newIdx.splice(oldIndex, 1)[0]);
        newIdx.unshift(0);
        newIdx.pop();

        let NewColmn = newIdx.map(v => { return { hide: false, ...headCell[v] } });
        props.OnheaderChange(NewColmn, newIdx);
    }

    function onInputChange(e,data) {
        let AllOption = [...props.ColAllOption]
        let obj = AllOption.filter(x => x.id === dynamicKeyValue)[0]
        let filterArray = []
        
        if (e.target.value) {
            OptionArray.forEach(v => {  // Changed from map() to forEach()
                if (v[dynamicKeyValue].toLowerCase().includes(e.target.value.toLowerCase())) {
                    let opt = data.find(op => op[dynamicKeyValue] === v[dynamicKeyValue]);
                    filterArray.push(opt ? opt : { ...v, checked: isSelect.all ? isSelect.checked : v.checked });
                }
            });
            setSearchArray(filterArray);
        }
        
         else {
            setSearchArray(OptionArray.map(c=> {return {...c,checked: isSelect.all ? isSelect.checked : c.checked}}))
        }


    }


    return (
        <>


            <thead id="tableHeader" className="text-Text-text-primary dark:text-Text-text-primary-dark  font-geist-sans    bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark border border-solid border-Border-border-50 dark:border-Border-border-dark-50">



                <SortableContainer onSortEnd={onSortEnd} useDragHandle axis="x"
                    lockAxis="x">
                    {props.headCells.filter(f => f.label && f.id !== 'actions').map((headCell, index) => (

                        headCell.display !== "none" &&
                        <SortableItem key={`item-${headCell.id}`} index={index} headCell={headCell} />
                    ))}
                </SortableContainer>


                {
                //    NOSONAR
                    (props.colSpan && props.spanRows && props.spanRows.length > 0) && (
                        <React.Fragment>
                            <tr>
                                {
                                    props.spanRows.filter(h=> h.display !== 'none').map(x => {
                                        return <th className={`${x.title ? "border-t border-Border-border-50 dark:border-Border-border-dark-50" : ''}`} align="center">{x.title}</th>
                                    })
                                }
                            </tr>
                        </React.Fragment>

                    )
                }
            </thead>
            <ListNDL
                options={SearchArray}
                AllOption={OptionArray}
                Open={isopen}
                tablefilter={true}
                multiple={true}
                // checkbox={true}
                optionChange={(e, data, val) => optionChange(e, data, val, dynamicKeyValue)}
                onChange={onInputChange}
                auto={true}
                isMArray={true}
                keyValue={dynamicKeyValue}
                keyId={"id"}
                id={"popper-Alarm-add"}
                onclose={handleClose}
                anchorEl={notificationAnchorEl}
                selectedOpt={selectedValue}
                selectAll={true}
                selectAllText={"Select All"}
                width="230px" 
                ErrorMsg={ErrorMsg}
                />
        </>
    );
}
// NOSONAR
TableHeader.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    visibledata: PropTypes.array.isRequired,
};

export default TableHeader;
