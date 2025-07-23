import React, { useState,useEffect } from "react"; 
import ListNDL from './ListNDL'
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"
import { useTranslation } from "react-i18next"; 

function DropdownListNDL(props) {
    const { t } = useTranslation();
    const [Open,setOpen]=useState(false)
    const [OptionArray,setOptionArray]= useState(props.options)
    const [SearchArray,setSearchArray]= useState(props.options)
    const [curTheme]=useRecoilState(themeMode)
    const [selectedval,setselectedval] = useState(props.value);
    const [TopR,setTopR] =React.useState(0)
    const [ScreenHeight,setScreenHeight] =React.useState(0)
    const [ScrollY,setScrollY]=React.useState(0)  
    const [auto, setAuto]= useState(false)
    const [selectAll, setSelectAll]= useState(false)

    useEffect(() => { 
        // const handleScroll = () => {
        //     // Close the dropdown if it's open during scroll
        //     // if (Open) setOpen(false);
        // };

        window.addEventListener('scroll', handleScroll);

        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, [Open]);


      const handleScroll = event => { 
        let posT 
        let posB 
        if(ScrollY === 0){
            posT = Number(TopR-window.pageYOffset)
            posB = Number(ScreenHeight+window.pageYOffset)
        }else{
            let prevScroll = window.pageYOffset - ScrollY
            posT = Number(TopR-prevScroll)
            posB = Number(ScreenHeight+prevScroll)
        } 
        // console.log(ScreenHeight,"ScreenHeight",posB,posT)
        if(document.getElementById(props.id)){
            if(ScreenHeight> 200){
                if(posT > 55){
                    document.getElementById(props.id).style.top = posT+'px';
                }else{
                    console.log(posT,"posTposT")
                    if(posT <0){
                        document.getElementById(props.id).style.top = posT+'px';
                        document.getElementById(props.id).style.visibility = 'hidden' 
                    }else{
                        document.getElementById(props.id).style.top = '40px';
                        document.getElementById(props.id).style.visibility = 'visible' 
                    }
                    
                }
                document.getElementById(props.id).style.bottom = 'unset';
            }else{
                if(posB > 0){
                    document.getElementById(props.id).style.bottom = posB+"px"
                }else{
                    document.getElementById(props.id).style.bottom = '0px';
                }
                document.getElementById(props.id).style.top = 'unset';
            }  
        } 
    };
    
    useEffect(()=>{
        if(props.options.length > 0 && props.multiple){ 
            let curVal= []
            let data = props.options.map(v=> {
                let defaultval = props.value && props.value.map(d=> d && d[props.keyId])
                if(defaultval && defaultval.includes(v[props.keyId])){
                    curVal.push(v)
                    return {...v,checked : true}
                }else{
                    return {...v,checked : false}
                }
                
            }) 
           if(!props.noSorting){
            // console.log(data,'datasorted')
               const checkedItems = data.filter(item => item.checked);
               const uncheckedItems = data.filter(item => !item.checked);

               // Sort checked items alphabetically by name
               checkedItems.sort((a, b) => {
                // Ensure that both 'a.title' and 'b.title' are strings
                if (typeof a[props.keyValue] === 'string' && typeof b[props.keyValue] === 'string') {
                    return a[props.keyValue].localeCompare(b[props.keyValue]);
                }
                return 0;  // If not a string, return 0 to leave the order unchanged
            });

               // Sort unchecked items alphabetically by name
               uncheckedItems.sort((a, b) => {
                // Ensure that both 'a.title' and 'b.title' are strings
                if (typeof a[props.keyValue] === 'string' && typeof b[props.keyValue] === 'string') {
                    return a[props.keyValue].localeCompare(b[props.keyValue]);
                }
                return 0;  // If not a string, return 0 to leave the order unchanged
            });

               // Combine the sorted checked and unchecked items
                data = [...checkedItems, ...uncheckedItems];
           }else{
            const checkedItems = data.filter(item => item.checked);
            const uncheckedItems = data.filter(item => !item.checked);
            data = [...checkedItems, ...uncheckedItems];
           }
           
            // console.log(data,'datasorted1')
            setselectedval(curVal)
            setOptionArray(data)
            setSearchArray(data)
        }  else{

            let data = []
            try{
                if(!props.noSorting){
                    data = props.options && Array.isArray(props.options) && props.options.length > 0 ?  props.options.sort((a, b) => {
                        // Ensure that both 'a.value' and 'b.value' are strings
                        if (typeof a[props.keyValue] === 'string' && typeof b[props.keyValue] === 'string') {
                          return a[props.keyValue].localeCompare(b[props.keyValue]);
                        }
                        return 0;  // If not a string, return 0 to leave the order unchanged
                      }) : []
                }
               
            }catch(e){
                console.log(e,'listndl error')

            }
          
            setselectedval([])
            setSearchArray(props.isSorting ? data : props.options)
            setOptionArray(props.isSorting ? data : props.options)
        }
        if(props.options.length > 5 && props.auto){
            setAuto(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.options,props.value])

    useEffect(()=>{
        if(props.multiple === true && !props.maxSelect){
            setSelectAll(true)
        }
    },[props])

    function ShowDropDown(e){
        console.log("eeee",e)
        setOpen(!Open)
         
           
          
        let screenH = window.innerHeight - e.currentTarget.getBoundingClientRect().top
        setScreenHeight(screenH)
        setScrollY(window.scrollY)
        let Top
        let LeftPos = e.currentTarget.getBoundingClientRect().left
        let WidthCur = e.currentTarget.offsetWidth + (props.width ? props.width : 0) 
        if(screenH > 200){
            Top =  e.currentTarget.getBoundingClientRect().top + e.currentTarget.offsetHeight
        }
        setTopR(Top)
        setTimeout(()=>{
            if(document.getElementById(props.id)){
                document.getElementById(props.id).removeAttribute("style")
                if(screenH < 200){
                    console.log("callingIF")
                    document.getElementById(props.id).style.bottom = screenH+"px"
                }else{
                    console.log("callingElse")
                    document.getElementById(props.id).style.top = Top+"px"
                }
                document.getElementById(props.id).style.left = LeftPos+"px"
                document.getElementById(props.id).style.width = WidthCur+"px"
                document.getElementById(props.id).style.position = 'absolute'
                document.getElementById(props.id).style.visibility = 'visible' 
            }
                
        },100)
        
        
    }
// functtion
    function optionChange(e,data,val){
  
        let value = {"target":{value: e}}
        // document.body.removeAttribute("style")

            if(curTheme==='dark'){
                document.body.style.backgroundColor='#000000'
            }
            else{
                document.body.style.backgroundColor='#ffff'
            }
        if(!props.multiple){
            props.onChange(value,data) 
            setOpen(!Open)
            
        }else{
            let selected = [...selectedval]
            
            let ExistIndex = selected.findIndex(x=>x[props.keyId] === e[props.keyId])
            if(ExistIndex > -1){ // Check already selected and remove
                 selected.splice(ExistIndex, 1);
            }else{
                selected.push({...e,checked : !e.checked})
            }

            if(props.maxSelect && props.maxSelect < selected.length){
                props.handleSnackbar()
                return false
            }

            if(val){
                let optarray = OptionArray.map(v=> { //To Select and de-select the option
                        return {...v,checked : val.selectAll} 
                    
                })
                setSearchArray(optarray)
                setOptionArray(optarray)
                setselectedval(val.selectAll ? optarray : [])
            }else{
                let optarray = SearchArray.map(v=> { //To Select and de-select the option
                    if(e[props.keyId] === v[props.keyId]){
                        return {...v,checked : !e.checked} 
                    }else{
                        return v    
                    }
                }) 
                let Alloptarray = OptionArray.map(v=> { //To Select and de-select the option
                    if(e[props.keyId] === v[props.keyId]){
                        return {...v,checked : !e.checked} 
                    }else{
                        return v    
                    }
                }) 
                setOptionArray(Alloptarray)
                setSearchArray(optarray)
                setselectedval(selected)
            }
        
        } 
    }

    function onInputChange(e){ 
        let filterArray = []
        if(e.target.value){
            if(props.isSearch){ //serverside search
                props.onInputChange(e)
            }else{
                // eslint-disable-next-line array-callback-return
                OptionArray.map(v=> {
                    if(v[props.keyValue].toLowerCase().includes(e.target.value.toLowerCase())){
                        filterArray.push(v)
                    }
                })
                setSearchArray(filterArray)
            }
        }else{
            setSearchArray(OptionArray)
        } 
    }

    function onclose(){
        setOpen(!Open); 
        setSearchArray(OptionArray)
        setTimeout(()=>{
            if(curTheme==='dark'){
                document.body.style.backgroundColor='#000000'
            }
            else{
                document.body.style.backgroundColor='#ffff'
            }
        },100)
        
        if(props.multiple){
            props.onChange(selectedval,SearchArray)
        }
    }
    let selectedOpt = props.options && Array.isArray(props.options) ? props.options.filter(f=>f[props.keyId] === props.value) : []
 
    function SingleListVal(){
        let Icon 
        if(selectedOpt.length>0){
            Icon =selectedOpt[0].icon
        }
        let PlcaeHolder = props.placeholder ? props.placeholder : (t("Select")+ props.label)
        if(props.value && (props.options.length>0)){
            
            return <p className={"truncate mb-0 font-geist-sans"}>{(selectedOpt.length>0 && props.isIcon ) && <Icon style={{marginRight:'4px'}} stroke={selectedOpt[0].stroke}/>}{selectedOpt.length>0 ? (!props.OnlyIcon && selectedOpt[0][props.keyValue]) : PlcaeHolder}</p> 
        }else{
            return <p className={"truncate mb-0 font-geist-sans text-[14px] leading-[16px]"}>{(props.icon) && <props.icon   className='mr-1 mb-0.5'  />}{PlcaeHolder}</p> 
        }
    }

    function MultiListVal(){ 
        if(selectedval && selectedval.length> 0){
            return <div className={"flex justify-between w-[88%]"}><p className={"truncate mb-0 font-geist-sans"}>{props.disabledName ? props.disabledName : selectedval[0] && selectedval[0][props.keyValue]}</p><span>{selectedval.length > 1 ? " +" +(selectedval.length-1) : ''}</span></div> 
        }else{
             return(
                <div className={"flex justify-between w-[88%]"}>
                    <p className={"truncate mb-0 font-geist-sans text-[14px]  leading-[16px]"}>{(props.icon) && <props.icon className='mr-1 mb-0.5' />}
                 {props.placeholder ? props.placeholder : (t("Select")+ props.label ? props.label : '')}
                    </p>
                </div>
                )
        }                       
    }

    return (
        
        <div className="w-full" style={{height: props.height ? props.height : undefined}}>
            {props.label && 
            <React.Fragment>
                <div className="mb-0.5">

            <p className={`${props.disabled ? 'text-Text-text-disabled dark:text-Text-text-disabled-dark   ':'text-Text-text-primary dark:text-Text-text-primary-dark'} text-[12px] font-geist-sans font-normal  leading-[14px]`} style={{color:curTheme==='dark'?'#ffff':undefined}} >{props.label}{props.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</p> <div class='mb-0.5' />
            </div>
      
          </React.Fragment>
}
            <button  style={{height: props.height ? props.height : undefined }} id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" data-dropdown-placement="bottom" className={`${props.disabled ? 'text-Text-text-disabled dark:text-Text-text-disabled-dark border border-Border-border-50 dark:border-Border-border-dark-50  bg-Field-field-disable dark:bg-Field-field-disable-dark ': 
            ' focus:text-Text-text-primary dark:focus:text-Text-text-primary-dark hover:text-Text-text-primary dark:hover:text-Text-text-primary-dark active:text-Text-text-primary dark:active:text-Text-text-primary-dark bg-Field-field-default dark:bg-Field-field-default-dark dark:focus:bg-Field-field-default-dark  focus:bg-Field-field-default '}
            ${
                props.error ? "border-Negative_Interaction-negative-default dark:border-Negative_interaction-negative-default-dark border text-Text-text-primary dark:text-Text-text-primary-dark " :props.disabled ? '' :
                'border border-Border-border-50 dark:border-Border-border-dark-50 text-Text-text-secondary dark:text-Text-text-secondary-dark  focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary-dark '

            }
       font-geist-sans   text-[14px] leading-[16px] font-normal rounded-md  p-2 text-center flex items-center  w-full justify-between cursor-pointer    h-[32px] 
          `} 
            onClick={(e)=> props.disabled ? '':ShowDropDown(e) }
            >
                {
                        !props.multiple ?
                                SingleListVal()
                            :
                                MultiListVal()
                }
                
                <svg class="w-3 h-3 ml-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" >
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            {props.error && (
                  <React.Fragment>
                <p className="font-geist-sans  text-[12px] leading-[14px] font-normal text-Text-text-error dark:text-Text-text-error-dark ">
                {props.msg}
                </p>
                <div class='mb-0.5' />
                </React.Fragment>
            )}
            {props.info && (
                  <React.Fragment>
            <p className={`font-geist-sans  ${props.disabled ? 'text-Field-field-disable dark:text-Field-field-disable-dark ':'text-Text-text-tertiary dark:text-Text-text-tertiary-dark text-[12px] leading-[14px] font-normal'}`}>
            {props.info}
            </p>
            <div class='mb-0.5' />
            </React.Fragment>
        ) }

            <ListNDL 
            optionloader={props.optionloader}
            isDescription={props.isDescription}
                options={SearchArray} 
                AllOption={OptionArray}
                multiple={props.multiple}
                Open={Open}
                auto={props.auto || auto}
                onChange={onInputChange}
                optionChange={optionChange}
                keyValue={props.keyValue}
                keyId={props.keyId}
                id={props.id}
                onclose={onclose}
                isIcon={props.isIcon} 
                isIconRight={props.isIconRight} 
                isSearch={props.isSearch}
                subtext={props.subtext}
                timestamp={props.timestamp}
                selectedOpt={selectedOpt}
                selectAll={props.selectAll || selectAll}
                selectAllText={props.selectAllText}
                width={props.width}
            />
            
             

        </div>

    );

}


export default DropdownListNDL;