import React from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import AddUser from './AddUser'

const UserModal= React.forwardRef((props, ref) => {   
    
    return(
        <ModalNDL onClose={props.UserDialogclose}  open={props.UserDialog}>
            <AddUser
                UserDialog={props.UserDialog} 
                UserDialogMode={props.UserDialogMode}
                UserDialogclose={props.UserDialogclose}  
                SelectRow={props.SelectRow}
                SelectedRow={props.SelectedRow}
            
            />
        </ModalNDL>
    )
})
export default UserModal;