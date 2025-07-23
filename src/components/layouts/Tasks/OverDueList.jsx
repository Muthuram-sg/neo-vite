/* eslint-disable no-unused-vars */
import React,{useState,useRef,useImperativeHandle, useEffect} from 'react'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import Button from "components/Core/ButtonNDL";
import TagNDL from 'components/Core/Tags/TagNDL'
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL' 
import Clock from 'assets/neo_icons/clock.svg?react'; 
import moment from 'moment'
import Status from 'components/Core/Status/StatusNDL'


const OverDueList= React.forwardRef((props, ref) => { 
  
    const [entityDialog, setEntityDialog] = useState(false);
    const [allChecked, setAllChecked] = useState(false)
    const [selectAllText,setSelectAllText]=useState('Select All')
    const [sendReminderDisabled, setSendReminderDisabled] = useState(true);  
    const [DueDateExpiredList,setDueDateExpiredList] = useState([]) 

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
          
        }
      }
    )
    )

    useEffect(()=>{
        if(props.dueDateExpiredList.length> 0){
            const allItemsChecked = props.dueDateExpiredList.filter(f=>!f.disabled).every(item => item.checked);
            setAllChecked(allItemsChecked);
            setDueDateExpiredList(props.dueDateExpiredList)
        }
    },[props.dueDateExpiredList])

    const handleCheckAll = () => {
        const updatedMetrics = DueDateExpiredList.map(item => {
            if (item.disabled) {
                return item; // Keep the item unchanged if it's disabled
            }
            return { ...item, checked: !allChecked };
        });
        const checkedCount = updatedMetrics.filter(item => item.checked).length;
        const selectAllText = checkedCount > 0 ? `${checkedCount} items Selected` : 'Select All';
        setSelectAllText(selectAllText);
        const isChecked = updatedMetrics.some(item => item.checked);
        setSendReminderDisabled(!isChecked);
        // props.DueDateExpiredList(updatedMetrics)
        setDueDateExpiredList(updatedMetrics);
        setAllChecked(!allChecked);
    };

    const handleSendReminder = () => {
        props.handleSendReminder(DueDateExpiredList)
        if(allChecked){
            props.handleDueDialogClose()
        }
        setSelectAllText('Select All') 
        setSendReminderDisabled(true); 
       
    };

    const handleCheckItem = (val) => {
        
        const updatedMetrics = DueDateExpiredList.map((item, i) => {
            if (i === val) {
                if (item.disabled) {
                    return { ...item, checked: false };
                }
                return { ...item, checked: !item.checked };
            }
            return item;
        });
         
        const checkedCount = updatedMetrics.filter(item => item.checked).length;
        const selectAllText = checkedCount > 0 ? `${checkedCount} items Selected` : 'Select All';
        setSelectAllText(selectAllText);
        const isChecked = updatedMetrics.some(item => item.checked);
        setSendReminderDisabled(!isChecked);
        // Check if all items are checked
        const allItemsChecked = updatedMetrics.every(item => item.checked);
        setAllChecked(allItemsChecked); 
        setDueDateExpiredList(updatedMetrics)
    };

    function getPriority(val){
        
        if(val === 11){
           return "Medium"
        }
        else if(val === 12){
            return "High"
        }
        else if(val === 14){
            return "Low"
        }
        else if(val === 17){
            return "NA"
        }else{
            return "NA"
        }
    }

    function getColorCode(val){
        if(val === 11){
            return "warning02-alt"
         }
        
         else if(val === 12){
             return "error-alt"
         }
         else if(val === 14){
             return "warning01-alt"
         }
         else{
             return "success-alt"
         }
    }
    
    function getDateDifference(dateString) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight
    
        const compareDate = new Date(dateString);
        compareDate.setHours(0, 0, 0, 0); // Set time to midnight
    
        // Check if the compare date is yesterday or earlier
        const isPastDue = compareDate < today;
    
        if (isPastDue) {
            const differenceMs = today - compareDate; // Switched the calculation direction
            // Convert milliseconds to days
            const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
            const output = `${differenceDays} day${differenceDays === 1 ? '' : 's'} ago`; // Added 'ago' for past due dates
            return output;
        }
        const differenceMs = compareDate - today;
        // Convert milliseconds to days
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        const output = `${differenceDays} day${differenceDays === 1 ? '' : 's'}`;
        return output;
    }

    return(
        <React.Fragment> 
            <ModalHeaderNDL>
                <div className='flex gap-1 flex-col'>
                <Typography variant="heading-02-s"  value={"Overdue Tasks"}/>    
                {/* <Typography variant="paragraph-xs" color='tertiary' value={"Customize your download preferences by selecting options below."}/>            */}
                </div>

                </ModalHeaderNDL>
                <ModalContentNDL>
                
                <div className='flex gap-1 items-center' style={{ justifyContent: 'space-between' }}>
                        <div className='flex gap-2 py-2 items-center' onClick={()=>handleCheckAll()}>
                            <input id={"checkbox-item-All"} type="checkbox" checked={allChecked} className="w-4 h-4 ml-2 font-geist-sans text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <Typography variant="label-01-s" value={selectAllText} />
                        </div>
                        <Button type="ghost" value="Send Reminder" onClick={() => handleSendReminder()} disabled={sendReminderDisabled}/>
                    </div><div style={{ marginBottom: '12px' }}></div>
                    {DueDateExpiredList && DueDateExpiredList.length > 0 ?
                        DueDateExpiredList.map((val,index) =>(
                            <Grid container spacing={1} 
                            onClick={() => handleCheckItem(index)}
                            style={{ marginBottom: "12px", opacity: val.disabled ? 0.5 : 1, pointerEvents: val.disabled ? 'none' : 'auto' }} key={index}>
                                <Grid item xs={12} sm={12} >
                                    <div className='flex gap-2 py-2 items-center'>
                                    <input id={"checkbox-item"+index} type="checkbox" checked={val.checked} disabled={val.disabled} className="w-4 h-4 ml-2 font-geist-sans text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <Typography variant="label-01-s" value={val.task_id + " - " + val.title} />
                                    </div>
                                    <div className='flex items-center mr-6 ml-8  gap-1'>
                                    <Status
                                    lessHeight
                                            name={getPriority(val.priority)}
                                            colorbg={ getColorCode(val.priority)}
                                       />
                                        <Clock />
                                        <Typography mono variant="paragraph-s" value={getDateDifference(val.due_date)} />
                                        { val.disabled ? <Typography  variant="label-01-s" value={` | Remainder Sent ${moment(moment()).diff(val.last_remainded_time, 'hours')} hours ago`}/> : ''}

                                </div>
                                </Grid>
                                
                            </Grid>
                        ) ) :
                        <Typography variant="label-01-s" value={"No Data"} />
                    }
                </ModalContentNDL>
                <ModalFooterNDL>
                    <div className='py-2'>
                    <Button type ="secondary"   value={'Close'} onClick={()=>props.handleDueDialogClose()} />
                    </div>
                    
                </ModalFooterNDL>
        </React.Fragment>
    )
})
export default OverDueList;