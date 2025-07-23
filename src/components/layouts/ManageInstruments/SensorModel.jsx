import React,{useState,useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import AddSensor from "./AddSensor";
const SensorModel= React.forwardRef((props, ref) => { 
    const [instrumentDialog, setInstrumentDialog] = useState(false);
    const AddSensorref = useRef();

    useImperativeHandle(ref, () =>
    (
      {
        handleFormulatDialogAdd: () => {
            setInstrumentDialog(true) 
          setTimeout(()=>{
            AddSensorref.current.handleFormulatDialogAdd()
          },200)
        },
        handleFormulaCrudDialogDuplicate: (id,data) => {
          setInstrumentDialog(true) 
        setTimeout(()=>{
          AddSensorref.current.handleFormulaCrudDialogDuplicate(id,data)
        },200)
      },
      handleDeleteDialogOpen: (id, data) => { 
            setInstrumentDialog(true);
          setTimeout(()=>{
            AddSensorref.current.handleDeleteDialogOpen(id, data)
          },200)
          
        },
        handleEditDialogOpen: (id, data) => { 
          setInstrumentDialog(true);
          setTimeout(()=>{
            AddSensorref.current.handleEditDialogOpen(id, data)
          },200)
          
        }
      }
    )
    )

    function handleInstrumentDialogClose(){
        setInstrumentDialog(false)
    }
    return(
             <AddSensor
              handlepageChange={props.handlepageChange}
                     ref={AddSensorref}
                      formulaDialog={instrumentDialog}
                     refreshTable={props.refreshTable}
                />
    )
})
export default SensorModel;