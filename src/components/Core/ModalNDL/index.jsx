import React,{useState,useEffect} from 'react'; 
import { createPortal } from 'react-dom'; 
function ModalNDL(props){   
    const [open,setOpen] = useState(false);
    useEffect(()=>{
        setOpen(props.open) 
        if(props.open){
            document.body.style.overflow ='hidden'  
        }else{
            document.body.style.overflow ='auto'  
        }
        setTimeout(()=>{
            if(document.getElementById(props.id ? props.id :"modal-ndl")){
                document.body.style.overflow ='hidden'   
            }
        },200)
    },[props.open])  
    let sizeLG = (props.size==='lg') ? 'max-w-[900px]': 'max-w-600'
    let MaxW = (props && props.size==='md') ? 'max-w-600': sizeLG
    const ModalDiv = ()=>{
        return (
        <div id={props.id ? props.id :"modal-ndl"} aria-hidden="false" data-testid="modal" role="dialog" className="fixed top-0 right-0 left-0 z-[60] h-modal overflow-y-auto overflow-x-hidden md:inset-0 md:h-full items-center justify-center flex bg-overLay-bg dark:bg-[#aeaeae] bg-opacity-50 dark:bg-opacity-20" >
            <div style={{ maxWidth : props.width ? props.width : undefined , height : props.height ? props.height : undefined}}class={`relative h-full w-full m-auto  md:h-auto max-w-2xl ${MaxW}`} >
                <div  style={{  height : props.height ? props.height : undefined}} className="relative rounded-2xl bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow p-4 " onClick={(e)=>e.stopPropagation()}> 
                {props.children}
                </div>
            </div>
        </div>)
    } 
    return (  
        <React.Fragment>   
        { open &&
            <React.Fragment>
                {createPortal(
                <ModalDiv/>
                  ,document.body)}  
            </React.Fragment>
        }
        </React.Fragment>
    )
}
export default ModalNDL;