// NOSONAR  -  skip
import React from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import AddUser from './AddUser'

const UserModal= React.forwardRef((props, ref) => {   
    
    return(
        <ModalNDL onClose={props.UserDialogclose}  open={props.UserDialog}>
            <AddUser
                UserDialog={props.UserDialog} //NOSONAR
                UserDialogMode={props.UserDialogMode}//NOSONAR
                UserDialogclose={props.UserDialogclose}  //NOSONAR
                SelectRow={props.SelectRow}//NOSONAR
                SelectedRow={props.SelectedRow}//NOSONAR
            
            />
        </ModalNDL>
    )
})
export default UserModal;