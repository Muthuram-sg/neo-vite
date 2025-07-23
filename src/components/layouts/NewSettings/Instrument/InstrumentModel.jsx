import React,{useState,useRef,useImperativeHandle} from 'react'; 
import AddInstrument from "./AddInstrument";
const InstrumentModel= React.forwardRef((props, ref) => { 
    const [instrumentDialog, setInstrumentDialog] = useState(false);
    const AddInstrumentref = useRef();

    useImperativeHandle(ref, () =>
    (
      {
        handleFormulatDialogAdd: () => {
            setInstrumentDialog(true) 
          setTimeout(()=>{
            AddInstrumentref.current.handleFormulatDialogAdd()
          },200)
        },
        handleFormulaCrudDialogDuplicate: (id,data) => {
          setInstrumentDialog(true) 
        setTimeout(()=>{
          AddInstrumentref.current.handleFormulaCrudDialogDuplicate(id,data)
        },200)
      },
        handleFormulaCrudDialogDelete: (id, data) => { 
            setInstrumentDialog(true);
          setTimeout(()=>{
            AddInstrumentref.current.handleFormulaCrudDialogDelete(id, data)
          },200)
          
        },
        handleFormulaCrudDialogEdit: (id, data) => { 
          console.log('data instrument model',data)
          setInstrumentDialog(true);
          setTimeout(()=>{
            AddInstrumentref.current.handleFormulaCrudDialogEdit(id, data)
          },200)
          
        }
      }
    )
    )

    function handleInstrumentDialogClose(){
        setInstrumentDialog(false)
    }
    return(
             <AddInstrument handleFormulaDialogClose={handleInstrumentDialogClose}
             handlepageChange={props.handlepageChange}
                    ref={AddInstrumentref} formulaDialog={instrumentDialog}
                    getInstrumentFormulaList={props.getInstrumentFormulaList}
                    categories={props.categories}
                    isostandard={props.isostandard}
                    metrics={props.metrics}
                    refreshTable={props.refreshTable}
                    enableButtonLoader={props.enableButtonLoader}
                    buttonLoader={props.buttonLoader}
                    UserOption={props.UserOption}
                />

    )
})
export default InstrumentModel;