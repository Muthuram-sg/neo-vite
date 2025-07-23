import React, {  forwardRef} from "react";
import ModalNDL from 'components/Core/ModalNDL';
import OperatorList from "./OperatorList"


const OperatorModels = forwardRef((props, ref) => {
   
   

    const handledialogClose = () => {
        props.handleOperatorDialogClose()
    }
   

    return (
        <React.Fragment>
     

            <ModalNDL onClose={props.handleOperatorDialogClose} width={props.isShiftChange ? undefined : '800px'} open={props.openOperatorOrder}>
            <OperatorList  handleOperatorData={props.handleOperatorData} isShiftChange={props.isShiftChange} 
            UserforLine={props.UserforLine} 
            startTime={props.startTime} 
            handledialogCloseTriger={props.handledialogCloseTriger} 
            handleShiftEndFalse={props.handleShiftEndFalse} 
            handledialogClose={handledialogClose} 
            selectedOpt={props.selectedOpt}
            BeforeShift={props.BeforeShift}
            />
              
            </ModalNDL>
        </React.Fragment>
    )
}
)
const isRender = (prev, next) => {
    return prev.openOperatorOrder !== next.openOperatorOrder || prev.isShiftChange !== next.isShiftChange? false : true
}
const OperatorModel = React.memo(OperatorModels, isRender)
export default OperatorModel;