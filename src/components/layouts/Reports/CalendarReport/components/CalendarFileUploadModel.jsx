import React,{useState,useImperativeHandle, useRef,useEffect} from 'react'; 
import {useParams} from "react-router-dom"
import ModalNDL from 'components/Core/ModalNDL';
import CalendarFileUpload from './CalendarFileUpload';

const CalendarFileUploadModel= React.forwardRef((props, ref) => { 
    const [fileUploadDialog, setDialog] = useState(false);
    const [assetName,setassetName] = useState(null)
    const [assetParam,setAssetParam] = useState(null)
    const [Range,setRange] = useState('')
    const [Technique,setTechnique] = useState(null)
    const [module,setModuleFlag] = useState(false)
let {moduleName,subModule1} = useParams()

    const EditRef = useRef()

    useEffect(() => {
if(moduleName === 'calendar' && subModule1 === 'upload'){
    setDialog(true)
}
    },[moduleName,subModule1])

    useImperativeHandle(ref, () => ({
        openDialog: (asserName,assetParam,range,technique,moduleFlag) => {
         
            setDialog(true);
            console.log(range,"range model")
            if(moduleFlag){
                setModuleFlag(moduleFlag)
                setAssetParam(assetParam ? assetParam : null)
                setRange(range ? range.replace(/^(\d{2})-(\d{2})/, '$2-$1') : new Date())
                setTechnique(technique ? technique : null)
            }
            else{
                setassetName(asserName ? asserName : null)
            }

        },
        EditDialog:(data)=>{
            setDialog(true);
            setTimeout(()=>{
                EditRef.current.UpdateDialog(data)
            },200)

        }

      
    })) 

    const handleCloseDialog=()=> {
        setDialog(false);
    }
console.log(assetParam,Range,Technique,module,"check call")
    return(
        <ModalNDL onClose={handleCloseDialog}  open={fileUploadDialog}>
            <CalendarFileUpload handleSnackBar ={props.handleSnackBar} ref={EditRef} assetName = {assetName} assetParam={assetParam} range={Range} Technique={Technique} moduleFlag={module} rawCalendarData={props.rawCalendarData} handleCloseDialog={handleCloseDialog} triggerCalendar={props.triggerCalendar} handleAssetClick={props.handleAssetClick} dialog={fileUploadDialog} />
        
        </ModalNDL>
    )
})
export default CalendarFileUploadModel;