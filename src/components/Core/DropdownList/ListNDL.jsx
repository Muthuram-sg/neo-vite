import React, { useEffect,useRef } from 'react';
import { createPortal } from 'react-dom'; 
import moment from "moment";
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"

function ListNDL(props){ 
    const [curTheme]=useRecoilState(themeMode);
    const [TopR,setTopR] =React.useState(0)
    const [ScreenHeight,setScreenHeight] =React.useState(0)
    const [ScrollY,setScrollY]=React.useState(0) 
    const [AllSelected,setAllSelected] =React.useState(false) 
    const searchRef = useRef()

    useEffect(()=>{ 
    
        if(props.anchorEl){
          if(props.anchorEl.Target) {
            handleOpen(props.anchorEl.Target,props.anchorEl.e) 
          }
         else{
          handleOpen(props.anchorEl) 
         }
           
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.anchorEl]) 

    useEffect(() => { 
        if(props.anchorEl){ 
        window.addEventListener('scroll', handleScroll);
        }
       
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
        

      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [TopR]);
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
            
        if(document.getElementById(props.id)){  
          
            if(ScreenHeight> 200){
                    if(Number(posT) > Number(window.innerHeight)){
                        document.getElementById(props.id).style.display = 'none'
                    }else{
                        document.getElementById(props.id).style.display = 'block'
                    }
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
                    }                }
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

    function handleOpen(e,mousePos){
      let cursorX = mousePos ? mousePos.pageX :0;
      let cursorY= mousePos ? mousePos.pageY :0;
      let ScrollW = window.innerWidth - document.documentElement.clientWidth
      let screenH = window.innerHeight - e.getBoundingClientRect().top
      setScreenHeight(screenH)
      let Top = e.getBoundingClientRect().top + e.offsetHeight
      setScrollY(window.scrollY)
      if(props.tablefilter){
        Top = e.getBoundingClientRect().top + e.offsetHeight + window.pageYOffset;
        Top = cursorY - Top;
      } else if(screenH > 200){
        Top = Top ? Top : cursorY;
      }
      let RigthPos = window.innerWidth - e.getBoundingClientRect().right
      let posLeft = e.getBoundingClientRect().left ? e.getBoundingClientRect().left : cursorX
      let ActualPos = e.getBoundingClientRect().left ? e.getBoundingClientRect().left : cursorX
      if(RigthPos < posLeft){
          ActualPos = RigthPos
      }
      let WidthCur = e.offsetWidth
      setTopR(Top)
      // console.log(ActualPos,WidthCur,"PosSubPosSub",props.subMenu,window.innerWidth,props.width,ScrollW)
      setTimeout(()=>{
          document.getElementById(props.id).removeAttribute("style")
          if(screenH < 200){
            document.getElementById(props.id).style.bottom = props?.subMenu ? (screenH-40)+"px" : screenH+"px"
          }else{
              document.getElementById(props.id).style.top = props?.subMenu ? (Top-40)+"px" : Top+"px"
          }
          let FinalLeft
          let PosSub = WidthCur
          if(props.width){
            let checkwid = window.innerWidth - Number(props.width.replace('px',''))
            if(ActualPos > checkwid){ 
              ActualPos = checkwid
            }
          }
          if(ActualPos > PosSub){
              FinalLeft = ActualPos - PosSub
          }else{
              FinalLeft = PosSub - ActualPos
          }
          if(RigthPos < posLeft){
            document.getElementById(props.id).style.right = props?.subMenu ? ((ActualPos - ScrollW)+160)+"px" : (ActualPos - ScrollW)+"px"    
          }else{
              document.getElementById(props.id).style.left = props?.subMenu ?  ((FinalLeft - ScrollW)-170)+"px" : (FinalLeft - ScrollW)+"px"
          }
  
          document.getElementById(props.id).style.width = props.width ? props.width : WidthCur+"px"  
              document.getElementById(props.id).style.position = 'absolute'
              document.getElementById(props.id).style.visibility = 'visible'
          },200)
  }  

    useEffect(()=>{
      // console.clear()
      // console.log(props, props?.options, props?.options?.length, "___props.optionsprops.options")
        if(props?.options?.length===0 ){
        }
        else if(Array.isArray(props?.options)){
            
            if(props?.options?.filter(x=> !x.checked)?.length === 0){
                setAllSelected(true);
            }else{
                setAllSelected(false);
            }
        }
        
  
    },[props.options])
    return(
        <React.Fragment>
            {props.Open && createPortal(
            <div className={`fixed top-0 right-0 left-0 z-10000 overflow-y-auto overflow-x-hidden md:inset-0 md:h-full}`} 
                    onClick={(e) => props.onclose(e)}
                    >
                    <div id={props.id} className={`z-20 bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark rounded-lg shadow ${props.width ? "" : "w-60"} invisible`}
                    style={{position: 'absolute'}}
                    onClick={(e)=>e.stopPropagation()}
                    >
                        {((props.auto) || props.isSearch) &&
                        <div className="p-3" 
                        >
                        <label for="input-group-search" className="sr-only font-geist-sans">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-Text-text-tertiary dark:text-Text-text-tertiary-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            </div>
                            <input type="text" id="input-group-search" className="block font-geist-sans w-full p-2 pl-10 text-sm text-Text-text-secondary  border border-Border-border-50 dark:border-Border-border-dark-50  rounded-lg bg-Field-field-default dark:bg-Field-field-default-dark focus:border-blue-500 dark:placeholder-Text-text-secondary-dark dark:text-Text-text-secondary-dark dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search"
                            onChange={(e)=>props.onChange(e,props.options)}
                            ref={searchRef}
                            autoComplete="off"
                            autoFocus={true}
                            />
                        </div>
                        {props.ErrorMsg && <span style={{fontSize: '10px',color: 'red'}}>Please select at least one column option</span>}
                        </div>}
                          
                        
                        <ul className="max-h-[212px] rounded-lg  px-3 pb-2 pt-2  font-geist-sans overflow-y-auto text-sm text-gray-700 dark:text-gray-200 mb-0  bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark" aria-labelledby="dropdownSearchButton">
                            {(props.options.length > 0 && props.multiple && props.selectAll) &&
                            <li className=' bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark' >
                                <div className={`flex items-center  hover:bg-gray-100 border-b px-2 border-Border-border-50 dark:border-Border-border-dark-50 bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark ${curTheme === 'dark' ? 'hover:bg-gray-900' : ''}`}
                                onClick={(e)=>{ 
                                    props.optionChange(props.isSubMenu ? e : props.options,props.options,{selectAll: !AllSelected})
                                    setAllSelected(!AllSelected)
                                    }
                                } 
                                > 
                                <input id={"checkbox-item-All"} type="checkbox" checked={AllSelected} className="w-4 h-4  mr-2 font-geist-sans text-blue-600  border-Border-border-50 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-Icon-icon-tertiary-dark dark:border-Border-border-dark-50"
                                />
                                <label className="w-full cursor-pointer py-2 font-geist-sans text-sm font-medium  bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark text-Text-text-primary dark:text-Text-text-primary-dark rounded">
                                    <div style={{display:'flex',justifyContent:'space-between', alignItems:"center"}}>
                                        {props.selectAllText ? props.selectAllText : 'select All'}
                                    </div>    
                                       
                                </label>   
                                </div>
                            </li>}
                            
                         
                            {
  (Array.isArray(props.options) && props.options.length > 0) ? 
    props?.options?.map((val, i) => {
      let disabledLi = val.disabled ? val.disabled : false;
      return (
        <li key={val[props.keyId] || i}>
          <div 
            className={`flex items-center hover:bg-Surface-surface-active px-2 hover:dark:bg-Surface-surface-active-dark rounded
              ${(props.selectedOpt && props.selectedOpt.length > 0 && (val[props.keyId] === props.selectedOpt[0][props.keyId])) ? "bg-Surface-surface-active dark:bg-Surface-surface-active-dark" : "bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark"} 
              hover:bg-gray-100 ${(props.options.length - 1 === i) ? "" : "border-b border-Border-border-50 dark:border-Border-border-dark-50"} 
              `}
            onClick={(e) => {
              if (!disabledLi) {
                setAllSelected(false);
                props.optionChange(props.isSubMenu ? {e,val} : props.multiple ? val : val[props.keyId], props.options, '');
              } else {
                e.stopPropagation();
              }
            }}
          >
            {props.multiple && 
              <input 
                id={"checkbox-item-" + i} 
                readOnly 
                type="checkbox" 
                checked={val.checked} 
                value={val[props.keyId]} 
                className="
                w-4 h-4  mr-2 font-geist-sanstext-blue-600  border-Icon-icon-tertiary rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-Icon-icon-tertiary-dark dark:border-Icon-icon-tertiary-dark"
              />
            }
            {val.LeftIcon && val.isIconLeft && <val.Lefticon stroke={val.stroke} className="ml-2 mr-2" />}
            {props.isIcon && !val.RightIcon && <val.icon stroke={val.stroke} className="ml-2 mr-2" />}
            <label className={`w-full cursor-pointer py-2 text-[14px] leading-[16px] font-normal ${disabledLi ? "text-Text-text-disabled dark:text-Text-text-disabled-dark " : " text-Text-text-primary dark:text-Text-text-primary-dark "} text-Text-text-primary dark:text-Text-text-primary-dark    font-geist-sans`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
                <span style={{ color: val.color }}>{(val[props.keyValue] || val[props.keyValue] === 0) ? val[props.keyValue] : 'Blanks'}</span> 
                {props.isIconRight && val.RightIcon && <val.icon stroke={val.stroke} className="mr-2" />}
                {props.IconButton && val.toggle && <CustomSwitch id={'chk_' + i} switch={true} size="small" checked={val.checked} onChange={() => props.toggleChange(val, props.options)} primaryLabel={''} />}
              </div> 
              {props.isDescription && 
                <span className="text-Text-text-tertiary dark:text-Text-text-tertiary-dark text-xs font-normal font-geist-sans leading-[14px]">{val.discText}</span>
              }
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {val[props.subtext] && <span style={{ fontSize: '12px', fontWeight: '400', color: curTheme === 'dark' ? '#ffff' : '#000000' }}>{val[props.subtext]}</span>}
                {val[props.timestamp] && <span style={{ fontSize: '12px', fontWeight: '400', whiteSpace: 'nowrap', marginRight: 5, color: curTheme === 'dark' ? '#ffff' : '#000000' }}>{moment(val[props.timestamp]).fromNow()}</span>}
              </div>    
            </label>   
          </div>
        </li>
      );
    })
 :((!props.optionloader&& props.options.length === 0 || (searchRef.current && searchRef.current.value && props.options.length === 0) )  ) ?  (
    <li>
      <div>
        <span className="text-gray-500 text-sm">No data available</span>
      </div>
    </li>
  ) : (props.optionloader ? (
      <li>
        <div>
          {[...Array(9)].map((_, index) => (
            <span key={index} className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '40px', margin: '0px 8px' }}></span>
          ))}
        </div>
      </li>
    ) 
:
<></>
)
}

                        </ul>
                        
                    </div>
                </div>
                ,
                document.body
                )}
        </React.Fragment>
    )
}
export default ListNDL;