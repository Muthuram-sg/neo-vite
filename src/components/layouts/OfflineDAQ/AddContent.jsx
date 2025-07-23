import React,{useRef,createRef,useState, useEffect} from 'react';
import ProgressIndicator from "components/Core/ProgressIndicators/ProgressIndicatorNDL" 
import { useTranslation } from 'react-i18next';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from 'components/Core/ButtonNDL';
import moment from 'moment';
import { selectedPlant } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import DatePickerNDL from 'components/Core/DatepickerNDL';  
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import LoadingScreenNDL from 'LoadingScreenNDL';

export default function AddContent(props){
    const { t } = useTranslation(); 
    const fieldsRef = useRef(props.fields.map(()=>createRef()));//NOSONAR
    const [headPlant] = useRecoilState(selectedPlant);
    const [dateVal,setDateVal] = useState(null);
    const [FieldArr,setFieldArr] = useState([]);
    const [isValid, setIsValid] = useState(false);  

    useEffect(()=>{
        setFieldArr(props.fields.map(v=>{//NOSONAR
            if(props.fieldData.length){//NOSONAR
                return {...v, value: props.fieldData.find(x=> v.metric.name === x.key).value}//NOSONAR
            }else{
                return {...v,value: ''}
            }
            
        })) 
        // console.log(props.fieldData,"props.fieldData",props.fields)
    },[props.fields])
    const processOfflineData = () =>{  
        let fieldVal = [];
        if(new Date(dateVal) > new Date() || moment(dateVal).isValid() === false){
            setIsValid(true)
            return;
        }else{
            setIsValid(false)
        }

        if(props.iid){
            const time = moment(dateVal).format('YYYY-MM-DDTHH:mm:ssZ')
            // eslint-disable-next-line array-callback-return
            fieldsRef.current.map((ref)=>{ 
                if(ref.current.value !== '' && (ref.current.value >= 0 || ref.current.type === 'text')){
                    let obj1 ={};            
                    obj1['iid'] = props.iid;
                    obj1['key'] = ref.current.id;
                    obj1['value'] = ref.current.value;
                    obj1['time'] = time;
                    fieldVal.push(obj1);
                } 
            })
        }        
        props.saveOfflineData(fieldVal,props.frequency);
    }
    const editOfflineData = ()=>{ 
        if(props.iid){         
            let editedRes = [];
            let newRes = [];
            // eslint-disable-next-line array-callback-return
            fieldsRef.current.map((ref)=>{
                if(ref.current.value !== '' && (ref.current.value >= 0 || ref.current.type === 'text')){
                    let Obj1 = {};
                    const oldArr = props.fieldData.filter(y=>y.key===ref.current.id)
                    if(oldArr && oldArr.length > 0){
                        if(oldArr[0].value !== ref.current.value){
                            Obj1['key'] = ref.current.id;
                            Obj1['value'] = ref.current.value;
                            editedRes.push(Obj1);
                        }
                    }else{
                        Obj1['key'] = ref.current.id;
                        Obj1['value'] = ref.current.value;
                        newRes.push(Obj1);
                    }                    
                }
            })
            if(editedRes.length === 0 && newRes.length === 0){
                props.triggerSnackbar();
            }else{
                let queryObj = {
                    schema: headPlant.schema,
                    iid: props.iid,
                    time: moment(props.time).format('YYYY-MM-DDTHH:mm:ssZ'),
                    editedVal: editedRes.length>0?editedRes:[],
                    newVal: newRes.length>0?newRes:[]
                }
                props.editOfflineData(queryObj);
                // console.log("editOfflineData",headPlant.schema,props.iid,props.time,editedRes.length>0?editedRes:[],newRes.length>0?newRes:[])
            }            
        }        
    }
// console.log(props.rangeParam,"param2")
    const renderButtons = () => {
        if(props.type === 'add'){
            return <Button   type="primary" value={t('Save')}
                onClick={processOfflineData}
            />
        }
        else{
            return <Button  type="primary" value={t('Save')}
                onClick={editOfflineData}
            />
        }
    }

    const handleChange = (e,idx,data) => {
        const value = e.target.value.replace(/[^A-Za-z0-9 ]/g, ""); // Allows only letters, numbers, and spaces
        data["value"] = value
        let arr = [...FieldArr]
        arr[idx] = data
        // console.log(value,"idx,data",idx,data,arr)
        setFieldArr(arr) 
      };
    
    return(
        <React.Fragment>
            <ModalContentNDL> 
                {
                    FieldArr.length && FieldArr.map((field,index)=>{
                        return (
                            <React.Fragment>
                                   <InputFieldNDL                                    
                                    id={field.metric && field.metric.name?field.metric.name:""}
                                    label={field.metric && field.metric.title?field.metric.title:""}
                                    type={field.metric.metricDatatypeByMetricDatatype.type === 'string' ? "text" : "number"}
                                    defaultValue={props.fieldData && props.fieldData.length > 0?props.fieldData.filter(x=>x.key === field.metric.name).map(y=>y.value):""}
                                    placeholder={field.metric && field.metric.title?t('Enter ')+field.metric.title:""}
                                    inputRef={fieldsRef.current[index]}
                                    value={field.value}
                                    autoComplete
                                    maxLength={250}
                                    onChange={(e)=>handleChange(e,index,field)}
                                    
                                /> 
                                <div className={"mb-3"} />
                                </React.Fragment>
                        )
                    })
                }            

                {
                props.type === 'add' && (
                    <React.Fragment>
                    <ParagraphText
                            value={t('Date')} 
                            variant={"Caption1"}></ParagraphText>
                            <DatePickerNDL
                                    id="Date-picker"
                                    onChange={(dates) => { 
                                       console.log(dates,"datesdates")
                                            if(dates){
                                                setDateVal(new Date(moment(dates).format("YYYY-MM-DDTHH:mm:ss"))); 
                                            }else{
                                                setDateVal(null)
                                            }
                                            
                                        
                                      
                                    }} 
                                    startDate={props.rangeParam ? new Date(props.rangeParam) : dateVal}  
                                    dateFormat={"dd/MM/yyyy HH:mm"} 
                                    timeFormat="HH:mm:ss" 
                                    showTimeSelect
                                    maxDate={new Date()} 
                            />
                            { isValid &&
                                  <ParagraphText
                                  variant="paragraph-xs" color="danger" value="Please select a valid date before saving."></ParagraphText>
                            }
                    </React.Fragment>                
                )      
                }  
                <div className='mb-3' />
            <ParagraphText value={"Note: Continuing will override the data in the selected range if it was previously added."}  variant={'paragraph-s'} color="danger" />

            </ModalContentNDL>
            {props.AddMetricLoading &&
            <ModalFooterNDL style={{ justifyContent: 'center' }}>
                <ProgressIndicator />
            </ModalFooterNDL>
            }
            {!props.AddMetricLoading &&
            <ModalFooterNDL>  
                    {
                        (props.insertLoading || props.editLoading) ? (                            
                            <LoadingScreenNDL style={{width: '100%'}}/>
                        ) :
                            <React.Fragment>
                              
                                <Button type="secondary"  value={t('Cancel')} onClick={() => props.handleCloseDialog()} />
                                {
                                    renderButtons()
                                }
                            </React.Fragment>


                    }
            </ModalFooterNDL>
           } 
        </React.Fragment>
    )
}