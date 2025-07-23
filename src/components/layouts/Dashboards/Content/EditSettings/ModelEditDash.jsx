import React,{useRef, useImperativeHandle, useState} from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import EditSetting from './EditSetting'  
import { useRecoilState } from "recoil";
import {instrumentsList,metricsList,VirtualInstrumentsList } from 'recoilStore/atoms';

const ModelEditDash= React.forwardRef((props, ref) => {  
    const editRef = useRef();
    const [dialog,setDialog] = useState(false);  
    const [IntruList] = useRecoilState(instrumentsList);
    const [MetricList] = useRecoilState(metricsList); 
    const [VirtualInstruments] = useRecoilState(VirtualInstrumentsList);   
    useImperativeHandle(ref,()=>({
        openDialog:(detail)=>{ 
            setDialog(true);
            setTimeout(()=>{
                if( editRef.current){
                    editRef.current.openDialog(detail)
                }
             
            },200)
        }
    }))
    
    return(
        <ModalNDL onClose={()=>setDialog(false)} open={dialog}>
            <EditSetting
            ref={editRef}
             dictkey={props.dictkey} refreshCard={props.refreshCard}
            handleDialogHieClose={()=>setDialog(false)}
            instrumentListData={IntruList}
            metricsListData={ MetricList ? MetricList : [] }
            virtualInstrumentListData={ VirtualInstruments }
             alertlistdata={ props.AlertList  }
            />
        </ModalNDL>
    )
})
export default ModelEditDash;