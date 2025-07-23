import React from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import AddReasons from './AddReason'
const ReasonModal= React.forwardRef((props, ref) => {  

    function handleDialogClosefn(e){ 
        props.dialogfns(e ? e : false)
    }
    
    return(
        <ModalNDL onClose={handleDialogClosefn} open={props.Dialog}>
            <AddReasons 
                Dialog={props.Dialog}
                dialogfns={(e) => props.dialogfns(e)}
                selectedReason={props.selectedReason}
                Otherreasonstype={props.Otherreasonstype}
                callfunctions={(e) => { props.callfunctions(e)}}
                callfunctionsupdate={(e) => { props.callfunctionsupdate(e)}}
                dialogModebox={props.dialogModebox}
                editvalues={props.editvalues}
                deleteselected={(value, tags) => { props.deleteselected(value, tags) }}
                duplicatetag={(e)=>props.duplicatetag(e)}
                Tags={props.Tags}
                user={props.user}
                headPlant={props.headPlant}
                Reasontags={props.Reasontags}
                setreasontags={(e) => props.setreasontags(e)}
                CheckDatadt = {props.CheckDatadt}
                handleDialogClosefn={handleDialogClosefn}
                handleTypeChange={props.handleTypeChange}
                refreshReasonTag={props.refreshReasonTag}
            /> 
        </ModalNDL>
    )
})
export default ReasonModal;