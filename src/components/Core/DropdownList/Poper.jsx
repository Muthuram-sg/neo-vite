import React, { useEffect,useState,useRef } from 'react';
import { createPortal } from 'react-dom'; 
import moment from "moment";
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";

function ListNDL(props){ 
    const [curTheme]=useRecoilState(themeMode);
    //  const [loader,setLoader]=useState(false)
    const [TopR,setTopR] =React.useState(0)
    const [ScreenHeight,setScreenHeight] =React.useState(0)
    const [ScrollY,setScrollY]=React.useState(0) 
    const [AllSelected,setAllSelected] =React.useState(false) 
    const searchRef = useRef()

    useEffect(()=>{ 
        if(props.anchorEl){ 
            handleOpen(props.anchorEl) 
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

    function handleOpen(e){
        let ScrollW = window.innerWidth - document.documentElement.clientWidth
        let screenH = window.innerHeight - e.getBoundingClientRect().top
        setScreenHeight(screenH) 
        setScrollY(window.scrollY)
        let Top = e.getBoundingClientRect().top + e.offsetHeight
        let RigthPos = window.innerWidth - e.getBoundingClientRect().right
        let posLeft = e.getBoundingClientRect().left
        let ActualPos = e.getBoundingClientRect().left
        if(RigthPos < posLeft){
            ActualPos = RigthPos 
        }
        let WidthCur = e.offsetWidth
        if(screenH > 200){
            Top =  e.getBoundingClientRect().top + e.offsetHeight
        }
        setTopR((Top ? Top : 0) +window.pageYOffset)
        // console.log(screenH,Top,"window.pageYOffset",window.pageYOffset,e.getBoundingClientRect().top , e.offsetHeight)
        setTimeout(()=>{
            document.getElementById(props.id).removeAttribute("style") 
            if(screenH < 200){
                document.getElementById(props.id).style.bottom = screenH+"px"
            }else{
                document.getElementById(props.id).style.top = Top+"px"
            } 
            let FinalLeft
                let PosSub = WidthCur
                if(ActualPos > PosSub){
                    FinalLeft = ActualPos - PosSub
                }else{
                    FinalLeft = PosSub - ActualPos
                }
            if(RigthPos < posLeft){
                document.getElementById(props.id).style.right = (ActualPos - ScrollW)+"px"    
            }else{
                document.getElementById(props.id).style.left = (FinalLeft - ScrollW)+"px"
            }   
            
            document.getElementById(props.id).style.width = props.width ? props.width : WidthCur+"px"
            document.getElementById(props.id).style.position = 'absolute'
            document.getElementById(props.id).style.visibility = 'visible'
        },200)
    }

    
    let ThemCss = (curTheme === 'dark') ? 'hover:bg-gray-900' : ''
   // console.log("Option Loader State:",!props.optionloader && props.options.length === 0,!props.optionloader, props.options.length === 0 )
    return(
        <React.Fragment>
            {props.Open && createPortal(
            <div  className={`fixed top-0 right-0 left-0 z-10000 overflow-y-auto overflow-x-hidden md:inset-0 md:h-full}`} 
                    onClick={(e) => props.onclose(e)}
                    >
                    <div id={props.id} className={`z-20 bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark rounded-lg shadow w-60  invisible`}
                    style={{position: 'absolute',...props.style}}
                    onClick={(e)=>e.stopPropagation()}
                    >
                     {props.children}
                    </div>
                </div>
                ,
                document.body
                )}
        </React.Fragment>
    )
}
export default ListNDL;