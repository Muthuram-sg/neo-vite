import React from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import AddChannel from './AddChannel'

const ChannelModal= React.forwardRef((props, ref) => {   
    
    return(
        <ModalNDL onClose={props.UserDialogclose} open={props.UserDialog}>
            <AddChannel
            UserDialog={props.UserDialog}
            UserDialogMode={props.UserDialogMode}
            UserDialogclose={props.UserDialogclose} 
            SelectRow={props.SelectRow}
            getChannelListForLine={props.getChannelListForLine}
            />
        </ModalNDL>
    )
})
export default ChannelModal;