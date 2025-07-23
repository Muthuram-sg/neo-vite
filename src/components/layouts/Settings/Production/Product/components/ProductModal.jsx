import React, { useEffect, useState } from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import AddProduct from './AddProduct'
const ProductModal= React.forwardRef((props, ref) => {  

    const[DialogClose,setDialogClose]=useState(false)

    useEffect(()=>{
        setDialogClose(props.productDialog)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.productDialog])
    function handleEntityDialogClose(){
        setDialogClose(false)
    }

     
    
    return(
        <ModalNDL disableEnforceFocus onClose={handleEntityDialogClose}  aria-labelledby="entity-dialog-title" open={DialogClose}>
            <AddProduct
            dialogMode={props.dialogMode}
            Editedvalue={props.Editedvalue}
            handleDialogClose={() => props.handleDialogClose()}
            handleProductID={(e) => props.handleProductID(e)}
            handleName={(e) => props.handleName(e)}
            handleUnit={(e) => props.handleUnit(e)}
            createOrder={(e) => { props.createOrder(e) }}
            updateOrder={(e) => props.updateOrder(e)}
            deleteselected={(value) => props.deleteselected(value)}
            />
        </ModalNDL>
    )
})
export default ProductModal;