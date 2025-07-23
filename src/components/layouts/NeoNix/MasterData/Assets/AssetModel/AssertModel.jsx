import React, { useEffect, useState ,useImperativeHandle,useRef} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import AddAsset from './AddAsset'
const ProductModal= React.forwardRef((props, ref) => {  

    const[DialogClose,setDialogClose]=useState(false)
    const [dialogMode,setdialogMode] = useState('create')
    const EditValueRef = useRef()

    useImperativeHandle((ref),()=>({
      createAsset: () => {
        setDialogClose(true)
        setdialogMode('create')
        

      },
      editAsset: (value) => {
        setDialogClose(true)
        setdialogMode('edit')
        tempFunction(value)
        

      }
    }))

    function handleEntityDialogClose(){
        setDialogClose(false)
        setTimeout(() => props.reload(), 2000)
    }

    const tempFunction = (value) => {
      console.log(value, "Edit Asset Value")
      console.log(EditValueRef, "Edit Value Ref")
        EditValueRef.current?.editAssetValue(value)
    }

     
    
    return(
        <ModalNDL disableEnforceFocus onClose={handleEntityDialogClose}  aria-labelledby="asset-dialog-title" open={DialogClose}>
            <AddAsset
              ref={EditValueRef}
              dialogMode={dialogMode}
              AssertDropdown={props.AssertDropdown}
              handleDialogClose={handleEntityDialogClose}
              editData={props.editData}
              availableAssetId={props.availableAssetId || []}
            />
        </ModalNDL>
    )
})
export default ProductModal;