/* eslint-disable no-unused-vars */
import React,{useState,useRef,useImperativeHandle} from 'react'; 
import AddEntity from './AddEntity'

const EntityModal= React.forwardRef((props, ref) => { 
  
    const [entityDialog, setEntityDialog] = useState(false);
    

    const EntityRef = useRef();

    

    useImperativeHandle(ref, () =>
    (
      {
        handleEntityDialog: () => {
          setEntityDialog(true) 
          setTimeout(()=>{
            EntityRef.current.handleEntityDialog()
          },200)
        },
        handleDeleteDialogOpen: (data) => { 
          setEntityDialog(true);
          setTimeout(()=>{
            EntityRef.current.handleDeleteDialogOpen(data)
          },200)
          
        },
        handleEditEnitytDialogOpen: (data) => { 
          setEntityDialog(true);
          setTimeout(()=>{
            EntityRef.current.handleEditEnitytDialogOpen(data)
          },200)
          
        },
        handleTriggerSave:()=>{
          EntityRef.current.handleTriggerSave()
        }
      }
    )
    )

    function handleEntityDialogClose(){
        setEntityDialog(false)
    }

    return(
            <AddEntity handleEntityDialogClose={handleEntityDialogClose} ref={EntityRef} entityDialog={entityDialog} handleActiveIndex={props.handleActiveIndex}
            AnalyticConfigListData={props.AnalyticConfigListData}
            instrumentMetricsListData={props.instrumentMetricsListData}
            getUpdatedEntityList={()=>props.getUpdatedEntityList()}
            />
    )
})
export default EntityModal;