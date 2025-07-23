import React,{useState,useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
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
        <ModalNDL  open={instrumentDialog}>
             <AddInstrument handleFormulaDialogClose={handleInstrumentDialogClose}
                    ref={AddInstrumentref} formulaDialog={instrumentDialog}
                    getInstrumentFormulaList={props.getInstrumentFormulaList}
                    categories={props.categories}
                    isostandard={props.isostandard}
                    metrics={props.metrics}
                    refreshTable={props.refreshTable}
                />
        </ModalNDL>
    )
})
export default InstrumentModel;