import React,{useState,useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import ProductionAddForm from "../ProductionDAQ/ProductionAddForm"


const AddProductionData= React.forwardRef((props, ref) => { 
 const [offlineDialog, setDialog] = useState(false);
 const [dialoudeMode,setDialogMode]=useState("New Form")

 const EntityRef = useRef();
 useImperativeHandle(ref, () => ({

     openDialog: () => {
         setDialog(true);
         setDialogMode("New Form")
     },
     handleEditEnitytDialogOpen: (data) => {
        setDialog(true);
        setDialogMode("Edit Form")
        setTimeout(() => {
                EntityRef.current.handleEditEnitytDialogOpen(data);
        }, 500);
    },
     handleDeleteDialogOpen: (data) => { 
      setDialog(true);
      setTimeout(()=>{
        EntityRef.current.handleDeleteDialogOpen(data)
      },200)
      
    },
 })) 

 const handleCloseDialog=()=> {
     setDialog(false);
 }

 return(
     <ModalNDL onClose={handleCloseDialog}  open={offlineDialog}>
         <ProductionAddForm ref={EntityRef} offlineDialog={offlineDialog} handleCloseDialog={handleCloseDialog} offLineTableData={props.offLineTableData} dialoudeMode={dialoudeMode}/>
     </ModalNDL>
 )
})
export default AddProductionData;
