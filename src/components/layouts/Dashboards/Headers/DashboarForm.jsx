import React,{useEffect,useState,useRef,forwardRef,useImperativeHandle} from 'react';
import { useTranslation } from 'react-i18next';
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant,user,currentDashboard, defaultDashboard ,currentDashboardSkeleton,dashboardEditMode} from "recoilStore/atoms"; // Recoil variables
// Core component
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from 'components/Core/ButtonNDL';  
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
// useHooks
import useCreateDashboard from '../hooks/useAddDashboard'; 
import useEditDashboard from '../hooks/useEditDashboard';
import useDeleteUserdefaultdashboard from '../hooks/useDeleteUserdefaultdashboard';
import useDeleteDashboard from '../hooks/useDeleteDashboard'; 
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import useGetCustomDashboardList from '../hooks/useGetDashboardCustomList'

const DashboarForm = forwardRef((props,ref)=>{
    //state variables 
    const [publicAccess,setPublicAccess] = useState(false);  
    const [currUser] = useRecoilState(user);
    const [headPlant] = useRecoilState(selectedPlant);
    const [formType,setFormType] = useState('add')
    const [selectedDashboard,setSelectedDashboard] = useRecoilState(currentDashboard)  
    const [DefaultDashboardID,setDefaultDashboardID] = useRecoilState(defaultDashboard);  
    const [,setSelectedDashboardSkeleton] = useRecoilState(currentDashboardSkeleton);
    const [,setEditMode] = useRecoilState(dashboardEditMode);
    const {  CreateDashboardLoading, CreateDashboardData, CreateDashboardError, getCreateDashboard } = useCreateDashboard();
    const { DashBoardListLoading, DashBoardListData, DashBoardListError, getDashBoardList } = useGetCustomDashboardList();
    const {  EditDashboardLoading, EditDashboardData, EditDashboardError, getEditDashboard } = useEditDashboard();
    const {  DeleteUserdefaultdashboardLoading, DeleteUserdefaultdashboardData, DeleteUserdefaultdashboardError, getDeleteUserdefaultdashboard } = useDeleteUserdefaultdashboard();
    const {  DeleteDashboardLoading, DeleteDashboardData, DeleteDashboardError, getDeleteDashboard } = useDeleteDashboard(); 
    const { t } = useTranslation(); // translation variables
    const nameRef = useRef();
    const [accessType,setaccessType] = useState("private")
    const [assignee,setassignee] = useState([])
    const [,setDashboardListCustom] = useState([])
    const [pickerType,setPickerType] = useState('commonpicker')
    const [deletedObj,setdeletedObj] = useState({})
    const [byModelaction,setbyModelaction] = useState('')
    
    
    useImperativeHandle(ref,()=>({
        openDialog: (type,obj)=>handleDialogOpen(type,obj)
    }))
    useEffect(()=>{
        if(!CreateDashboardLoading && !CreateDashboardError && CreateDashboardData){
            let newDashBoardId = CreateDashboardData.returning[0].id
            props.handleSnackbar(t('Dashboard created successfully'),'success');
            props.getDashboardList(headPlant.id,currUser.id,newDashBoardId)
            props.handleDialogClose()
           
         
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[CreateDashboardData])
    useEffect(()=>{
        if(!EditDashboardLoading && !EditDashboardError && EditDashboardData){
            props.handleSnackbar(t('Dashboard updated successfully'),'success');
            props.getDashboardList(headPlant.id,currUser.id)
            props.handleDialogClose()
            setbyModelaction('')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[EditDashboardData])

    useEffect(()=>{
        if(!DeleteUserdefaultdashboardLoading && !DeleteUserdefaultdashboardError && DeleteUserdefaultdashboardData){
            getDeleteDashboard({ dashboard_id: DefaultDashboardID } )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DeleteUserdefaultdashboardLoading ,DeleteUserdefaultdashboardData])

    useEffect(()=>{
        if(!DeleteDashboardLoading && !DeleteDashboardError && DeleteDashboardData){ 
            
            props.handleSnackbar(t('Dashboard deleted successfully'),'success');
            props.getDashboardList(headPlant.id,currUser.id)
            setDefaultDashboardID('')
            setdeletedObj({})
            setSelectedDashboardSkeleton({})
            setSelectedDashboard([]) 
            setEditMode(false) 
            props.handleDialogClose()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DeleteDashboardData,DeleteDashboardLoading,DeleteDashboardError])
//console.log("DashBoardListData",DashBoardListData)
    useEffect(()=>{
        if(! DashBoardListLoading && DashBoardListData && !DashBoardListError){
            
        setDashboardListCustom(DashBoardListData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DashBoardListLoading, DashBoardListData, DashBoardListError])
   
    const createNewDashboard = () =>{
        const name = nameRef.current.value;
        if(!name || name === null){
            props.handleSnackbar(t('Please enter dashboard name'),'warning');
            return false;
        } 
        
                
        
        let obj = { user_id: currUser.id, dashboard: { data: {}, breakpoint: "lg", cols: 12}, name: nameRef.current.value, custom: true, standard: publicAccess, line_id: headPlant.id, layout: { lg: [], md: [], sm: [], xs: [] } ,datepicker_type:pickerType}

        if(formType === 'duplicate'){
            let tempLayout = JSON.parse(localStorage.getItem('actual_layout')).layout
            obj = { user_id: currUser.id, dashboard: selectedDashboard[0].dashboard, name: nameRef.current.value, custom: true, standard: publicAccess, line_id: headPlant.id, layout: tempLayout,datepicker_type:pickerType }
        }
   
        getCreateDashboard(obj);
        
    }
    const createUpdateDashboard = () =>{
        const name = nameRef.current.value;

        if(!name || name === null){
            props.handleSnackbar(t('Please enter dashboard name'),'warning');
            return false;
        } 
        let obj
       if(byModelaction){

         obj = {name: nameRef.current.value, dash_id: byModelaction, user_id: currUser.id, custom: true, standard: (accessType === "public" || accessType === "selected_user") ? true : false ,user_access_list: accessType === "selected_user" ? assignee.map(x=>x.id) : null,datepicker_type:pickerType }

       }else{
        obj = { name: nameRef.current.value, dash_id: selectedDashboard[0].id, user_id: currUser.id, custom: true, standard: (accessType === "public" || accessType === "selected_user") ? true : false ,user_access_list: accessType === "selected_user" ? assignee.map(x=>x.id) : null,datepicker_type:pickerType }

       }
       
        getEditDashboard(obj);
      
    }
    const handleDialogOpen = (type,obj) => {
        setFormType(type) 
        if(type==='edit' && !obj){
            setTimeout(()=>{
                nameRef.current.value = selectedDashboard[0].name
            },200)
            if(selectedDashboard[0].standard && !selectedDashboard[0].user_access_list){
                setaccessType("public")
            }else if(!selectedDashboard[0].standard && !selectedDashboard[0].user_access_list){
                setaccessType("private")
                
            }else if(selectedDashboard[0].standard && selectedDashboard[0].user_access_list.length > 0){
                setaccessType("selected_user")
                setassignee(props.UserOption.filter(x=>selectedDashboard[0].user_access_list.includes(x.id) )) 
            }
            if(selectedDashboard[0].datepicker_type){
                setPickerType(selectedDashboard[0].datepicker_type)
            }else{
                setPickerType('commonpicker')
            }
            // setaccessType(selectedDashboard[0].standard)
        }else if(type==='edit' && obj && Object.keys(obj).length > 0 ){
            // console.log(obj,"objprops.UserOptionprops.UserOption",props.UserOption)
            setTimeout(()=>{
                nameRef.current.value =  obj.name 
            },200)
            setbyModelaction(obj.id)
            if(obj.standard && !obj.user_access_list){
                setaccessType("public")
            }else if(!obj.standard && !obj.user_access_list){
                setaccessType("private")
                
            }else if(obj.standard && obj.user_access_list.length > 0){
                setaccessType("selected_user")
                setassignee(props.UserOption.filter(x=>obj.user_access_list.includes(x.id) )) 
            }
            if(obj.datepicker_type){
                setPickerType(obj.datepicker_type)
            }else{
                setPickerType('commonpicker')
            }


        }
        if(type==='duplicate'){
            setTimeout(()=>{
                nameRef.current.value = selectedDashboard[0].name + " (copy)"
            },100)
        }

        if(type === 'delete'){
            setdeletedObj(obj)
        }
    }
    const deleteDashboard = async () => {
        
        getDeleteUserdefaultdashboard({ dashboard_id: DefaultDashboardID })
         
      }
    const handleDialogClose = () => props.handleDialogClose();
    let modelValue 
    if(formType === 'delete' ){
        modelValue = "Delete Dashboard"
    }else{
        if(formType === 'add'){
            modelValue ="Create Dashboard"
        }else{
            if(formType === 'duplicate')
                modelValue = "Duplicate Dashboard"
            else
                modelValue = "Update Dashboard"
        }

    }
  
   const handleUser = (e)=>{
    setassignee(e)
   }
   const accessOption =[
    {id:"private",name:"Private"},
    {id:"public",name:"Public"},
    {id:"selected_user",name:"Selected User"},

   ]
   const handleAccessType=(e)=>{
    setaccessType(e.target.value)
    setPublicAccess(e.target.value !== "private" ? true : false)
   }

   const filteredUser =()=>{
    if(props.UserOption && props.UserOption.length > 0){
        // console.log(selectedDashboard)
        if(selectedDashboard.length > 0 && selectedDashboard[0].userByCreatedBy.id === currUser.id){
            return props.UserOption.filter(x=>x.id !== currUser.id)
        }else{
            return props.UserOption
        }
    }
   }
   

   const handlePickerChange =(e)=>{
    setPickerType(e.target.value)
   }


   const renderAccessHelperText = ()=>{
    if(accessType === 'private'){
      return 'This dashboard is set to private, visible only to you. Keep your insights secure and accessible only to yourself.'
    }else if(accessType === 'public'){
        return 'This dashboard is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone.'
    }else if(accessType === 'selected_user'){
        return 'This dashboard is shared with selected users. Control who can view your insights and collaborate effectively with your team.'
    }else{
        return 'Select an access level to set visibility for this dashboard'
    }
   }
   
    return (
        <React.Fragment> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={modelValue}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                    {formType === 'delete' ? 
                    <TypographyNDL  variant='paragraph-s' color='secondary' value={t("Do you really want to delete the dashboard ") +
                    (deletedObj && Object.keys(deletedObj).length > 0 ? deletedObj.name :'') +
                    t("NotReversible")} />
 
                    :
                    <React.Fragment>
                    <InputFieldNDL id={'dashName'} label='Dashboard Name' placeholder={t("Enter Dashboard name")} inputRef={nameRef} maxLength={'150'} /> 
                    <div className='mt-0.5'>
                    <TypographyNDL color={'tertiary'}  value={'This will appear in the overview'} variant={'paragraph-xs'}   />
                    </div>
                   
                    
                             <div className="mt-3"/>
                             <SelectBox
                                options={accessOption}
                                labelId="hierarchyView"
                                id="hierarchy-condition"
                                value={accessType}
                                label='Access'
                                placeholder={'Select Access'}
                                onChange={handleAccessType}
                                multiple={false}
                                isMArray={true}
                                keyValue={"name"}
                                keyId="id"
                            />
                             <div className='mt-0.5'>
                        <TypographyNDL color={'tertiary'}  value={renderAccessHelperText()} variant={'paragraph-xs'}   />
                        </div>
                              {/* <div className='mt-0.5' />
                              <TypographyNDL color={'tertiary'}  value={renderAccessHelperText()} variant={'paragraph-xs'}   /> */}
                        {
                            accessType === "selected_user" &&
                            <React.Fragment>
                                <div className="mt-3"/>
                                <SelectBox
                                    options={filteredUser()}
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={assignee}
                                    label="Share with"
                                    placeholder={'Select users'}
                                    onChange={(e) => handleUser(e)}
                                    multiple={true}
                                    isMArray={true}
                                    selectAll={true}
                                    selectAllText={"Select All"}
                                    auto
                                    keyValue={"name"}
                                    keyId="id"
                                    
                                />
                                 <div className='mt-0.5' />
                              <TypographyNDL color={'tertiary'}  value={'Select users to give access.'} variant={'paragraph-xs'}   />
                      
                            </React.Fragment>
                        }
                       
                        <div className="mt-3"/>
                        <SelectBox
                                    options={[{id:"commonpicker",name:"Common Date Picker"},{id:"widgetpicker",name:"Widget Date Picker"}]}
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={pickerType}
                                    label='Date Picker'
                                    placeholder={'Select Date Picker Type'}
                                    onChange={(e) => handlePickerChange(e)}
                                    multiple={false}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId="id"
                                />
                                  <div className='mt-0.5' />
                                  <TypographyNDL color={'tertiary'}  value={pickerType === 'commonpicker' ? "This date picker is used throughout the dashboard and controls all the widgets."  : 'This date picker is used to control the data of specific custom widgets.' } variant={'paragraph-xs'}   />

                    </React.Fragment>
                    }
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button  type='secondary'  onClick={() => { handleDialogClose() }} value={'Cancel'}/>  
                    {
                         formType === 'add' && (
                            <Button value={t('Create')}  onClick={createNewDashboard} loading={CreateDashboardLoading} />
                         )
                    }
                    {
                        formType === 'duplicate' && (
                            <Button value={t('Duplicate')}  onClick={createNewDashboard} loading={CreateDashboardLoading} />
                        )
                    }
                    {
                        formType !== 'add' && formType !== 'duplicate' && (
                            <Button  type={formType === 'delete' ? 'primary' : ''} value={t(formType === 'delete' ? 'YesDelete' : 'Update')} danger={formType === 'delete' ? true :false} onClick={formType === 'delete' ? deleteDashboard:createUpdateDashboard} />  
                        )
                    }
                   
                </ModalFooterNDL>
        </React.Fragment>
    )
})
export default DashboarForm;
