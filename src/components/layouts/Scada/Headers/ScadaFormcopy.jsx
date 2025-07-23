import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant, user, currentScadaJson, defaultScadaView, currentScadaViewSkeleton, scadaViewEditMode, scadaIdState,  snackToggle, snackMessage, snackType, scadaContentVisibleDeleteState, scadaContentVisibleState, selectedScadaViewState,
    scadaSelectedEditmodeType, scadaContentVisibleEditState} from "recoilStore/atoms"; // Recoil variables
// Core component
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from 'components/Core/ButtonNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL' 
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
// useHooks
import useCreateScadaView from '../hooks/useAddScadaView';
import useEditScadaView from '../hooks/useEditScadaView';
import useDeleteUserdefaultScadaView from '../hooks/useDeleteUserdefaultscadaview';
import useDeleteScadaView from '../hooks/useDeleteScadaView';
import useSelectedUser from '../hooks/useGetuserSelectList';
import useCheckdashboardFav from '../hooks/useCheckdashboardFav';
import useCurrentScadadetails from '../hooks/useGetcurentScadadetails';
import ScadaModal from '../Headers/ScadaModal';

import useScadaViewList from "components/layouts/Scada/hooks/useGetScadaViewList";
import useDeletefavstar from "components/layouts/Scada/hooks/useDeletefavstar";
//use icon
import Close from 'assets/neo_icons/Menu/scada/x.svg?react';
const ScadaForm = forwardRef((props, ref) => {
    //state variables 

    const [currUser] = useRecoilState(user);
    const [headPlant] = useRecoilState(selectedPlant);
  //const [formType, setFormType] = useState('add'); 
   const [formType, setFormType] = useState(null);

    const [DefaultScadaViewID, setDefaultScadaViewID] = useRecoilState(defaultScadaView);
    const [selectedScadaViewSkeleton, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
    const [, setEditMode] = useRecoilState(scadaViewEditMode);
    const { CreateScadaViewLoading, CreateScadaViewData, CreateScadaViewError, getCreateScadaView, checkScadaNameExists } = useCreateScadaView();
    const { EditScadaViewLoading, EditScadaViewData, EditScadaViewError, getEditScadaView } = useEditScadaView();
    const { DeleteUserdefaultScadaViewLoading, DeleteUserdefaultScadaViewData, DeleteUserdefaultScadaViewError, getDeleteUserdefaultScadaView } = useDeleteUserdefaultScadaView();
    const { DeleteScadaViewLoading, DeleteScadaViewData, DeleteScadaViewError, getDeleteScadaView } = useDeleteScadaView();
    const { DeletefavstarLoading, DeletefavstarError, DeletefavstarData, getDeletefavstar } = useDeletefavstar();
    const { CheckdashboardFavLoading, CheckdashboardFavError, CheckdashboardFavData, getCheckdashboardFav } = useCheckdashboardFav();
    const { SelectedUserLoading, SelectedUserError, SelectedUserData, getSelectedUser } = useSelectedUser();
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [isScadaContentVisible, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
    const [isScadaContentVisibleEdit, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
    
 const [selectedScadaView, setSelectedScadaView] = useRecoilState(selectedScadaViewState);
 const { CurrentscadaUserLoading, CurrentscadaUserError, CurrentscadaUserData, getCurrentScadadetails } = useCurrentScadadetails();
    const [selectedId, setSelectedId] = useState("2");
    const { t } = useTranslation(); // translation variables
    const nameRef = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const scadaFormRef = useRef(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
  const { ScadaViewListLoading, ScadaViewListData, ScadaViewListError, getScadaViewList } = useScadaViewList();
  const [scadaviewDel] = useRecoilState(scadaContentVisibleDeleteState);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [,setScadaId] = useRecoilState(scadaIdState);

    // const openDialog = (action) => {
    //     console.log("Dialog opened with action:", action);
    //     // Add any additional logic needed for opening dialog
    // };

    useImperativeHandle(ref, () => ({
        openDialog: (type) => handleDialogOpen(type)
    }))
     const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
    const [accessType, setAccessType] = useState('');
    const accessOption = [
        { id: "1", name: "Public" },
        { id: "2", name: "Private" },
        { id: "3", name: "Shared" },
      ]

useEffect(() => {
    if (headPlant.id) {
        getSelectedUser(headPlant.id); // Fetch users when lineID is available
    }
}, [headPlant.id]);

const userOptions = SelectedUserData ? 
    SelectedUserData.filter((item) => item.userByUserId.id !== currUser.id)  // Filter out the current user
    .map((item) => ({
        id: item.userByUserId.id,
        name: item.userByUserId.name,
    })) : [];



   // Handle change in SelectBox selection
   const handleUserSelection = (selected) => {
    setSelectedUsers(selected); // Update selected users
};
  // Handle selection change
  const handleAccessChange = (event) => {
    const selectedOption = accessOption.find(option => option.id === event.target.value);
    const id = event.target.value;
    setSelectedId(id);
   // console.log('selected val '+id);
    
    setAccessType(selectedOption ? selectedOption.name : '');
  };

//working code in before view page
    useEffect(() => {
        if (!CreateScadaViewLoading && !CreateScadaViewError && CreateScadaViewData) {
          let newscadaviewId = CreateScadaViewData.returning[0]
           //console.log('new scada',newscadaviewId)
           if (CreateScadaViewData.affected_rows >= 1) {
            props.handleSnackbar(t('Scada Dashboard created successfully'), 'success');
            props.handleDialogClose();
              //  props.getscadaviewList(headPlant.id, currUser.id);
              
                setDefaultScadaViewID(CreateScadaViewData.returning[0].id)
                getCurrentScadadetails(CreateScadaViewData.returning[0].id); 
                props.getScadaViewList(headPlant.id, currUser.id);

                // Trigger the list update
            if (props.setListUpdated) {
                props.setListUpdated(true);  // This should trigger re-fetching in the dashboard
                props.getScadaViewList(headPlant.id, currUser.id);
                console.log('this block exe')
            }else{
                 props.handleSnackbar(t('Scada Dashboard created successfully'), 'success');
                 console.log('else this block exe')
              
               if(newscadaviewId){
                setScadaContentVisible(false); 
                    setScadaContentVisibleEdit(true);
                    setScadaId(CreateScadaViewData.returning[0].id);
                    props.getScadaViewList(headPlant.id, currUser.id);
                   // console.log(props.getscadaviewList(headPlant.id, currUser.id));
                 //  getScadaViewList(headPlant.id, currUser.id);
                    getCurrentScadadetails(CreateScadaViewData.returning[0].id); 
                    //window.location.reload();
               }
              
            //    props.getscadaviewList(headPlant.id, currUser.id); 
            //window.location.reload();
               //props.refresh(true);
              // getScadaViewList(headPlant.id, currUser.id);
            }
               // props.handleDialogClose()
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CreateScadaViewData,props])

    

    // useEffect(() => {
    //     if (headPlant.id && currUser.id) {
    //        // console.log("Calling getScadaViewList with", headPlant.id, currUser.id);
    //         getScadaViewList(headPlant.id, currUser.id);
    //     }
    // }, [headPlant.id, currUser.id]);
   

    useEffect(() => {
        if (!EditScadaViewLoading && !EditScadaViewError && EditScadaViewData) {
            props.handleSnackbar(t('scadaview edited successfully'), 'success');
            props.getScadaViewList(headPlant.id, currUser.id)
            props.handleDialogClose()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditScadaViewData])

    

    useEffect(() => {
        if (!DeleteScadaViewLoading && !DeleteScadaViewError && DeleteScadaViewData) {
          //  props.getscadaviewList(headPlant.id, currUser.id)
            if (scadaviewDel) {
        
                props.handleSnackbar(
                    'SCADA Dashboard deleted successfully from view.',
                    'success'
                );
              
                props.handleDialogClose();
              //  setFormType(null); // Reset the form type if needed
                // If deletion is from the view page, reload the page
                setScadaContentVisible(false);
                setScadaContentVisibleEdit(false);
                setEditMode(false); // Reset the edit mode if required
                  props.getScadaViewList(headPlant.id, currUser.id);
                 //   window.location.reload();
                 //getScadaViewList(headPlant.id, currUser.id);
                //return;
            
            } else {
        // If deletion is from the dashboard, refresh the list
        props.handleSnackbar(
            'SCADA Dashboard deleted successfully.',
            'success'
        );
                props.getScadaViewList(headPlant.id, currUser.id);
                props.handleDialogClose();
               // setEditMode(false); // Reset the edit mode if required
                //setFormType(null); // Reset the form type if needed
               // window.location.reload();
            }
          
        
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteScadaViewData, DeleteScadaViewLoading, DeleteScadaViewError])

    
 

    const createNewscadaview = async () => {
        const name = nameRef.current.value;
        if (!name || name === null) {
            props.handleSnackbar(t('enterScadName'), 'warning');
           // setFormType('add');
            return false;
            
        }

        if (!selectedId) {
            props.handleSnackbar(t('selectAccessType'), 'warning'); // Display a message to select access type
            return false;
        }

         // Check if the SCADA name already exists
    const nameExists = await checkScadaNameExists(name, headPlant.id);
    if (nameExists) {
        props.handleSnackbar(t('scadaNameExists'), 'error');
        return false;
    }

        const sharedUsers = selectedUsers.length > 0
    ? [...selectedUsers.map(user => ({ id: user.id })), { id: currUser.id }]  // Always include current user at the end
    : [{ id: currUser.id }]; 


        let obj = { user_id: currUser.id, data: {"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1.5}}, name: nameRef.current.value, standard: false, line_id: headPlant.id, access_type: parseInt(selectedId, 10), scada_user_access_list: sharedUsers }
       

        getCreateScadaView(obj);
       

    }
    const createUpdatescadaview = () => {
        const name = nameRef.current.value;
        if (!name || name === null) {
            props.handleSnackbar(t('enterScadName'), 'warning');
            return false;
        }
        let obj = { name: nameRef.current.value, scada_id: selectedScadaView.id, user_id: currUser.id, standard: false, access_type: parseInt(selectedId, 10) }

        getEditScadaView(obj);

    }
    const handleDialogOpen = (type) => {
        setFormType(type)
        // if (type === 'edit') {
        //     setTimeout(() => {
        //         nameRef.current.value = selectedScadaView.name
        //     }, 100)
        // }
    }

    const deletescadaview = async () => {
        // Check if the dashboard exists in favorites
        const isFav = await getCheckdashboardFav(headPlant.id, selectedScadaView.id);
    
        if (isFav?.length > 0) {
            // Show alert and close the modal
            props.handleSnackbar(
                'Scada Dashboard you selected to delete is marked as a favorite by some shared users.',
                'warning'
            );
    
            // Remove the foreign key from the favourite_dashboard table before deleting the dashboard
            await getDeletefavstar({
                scada_id: selectedScadaView.id,
                user_id: currUser.id,
                line_id: headPlant.id
            });
    
            // Close the modal
            props.handleDialogClose();
            props.getScadaViewList(headPlant.id, currUser.id)
            return; // Exit the function after removing the favorite
        }
    
        // Proceed with the delete action if not a favorite
        if (selectedScadaView.created_by !== currUser.id) {
            props.handleSnackbar(
                'You are not authorized to delete this SCADA Dashboard as it was created by others or shared with you.',
                'error'
            );
            props.handleDialogClose();
            return;
        }
    
        // Remove foreign key if the dashboard is not a favorite and the user is authorized to delete
        if (selectedScadaView.created_by == currUser.id && isFav?.length > 0) {
        await getDeletefavstar({
            scada_id: selectedScadaView.id,
            user_id: currUser.id,
            line_id: headPlant.id
        });
    }
    
        // Now, delete the SCADA view
        await getDeleteScadaView({ scada_id: selectedScadaView.id });
    
        // Show success message or perform other actions
     
        // props.getscadaviewList(headPlant.id, currUser.id)
    //     props.handleDialogClose(); // Close the dialog after deletion
    //    // setFormType('')
    //    setEditMode(false)
    if (scadaviewDel) {
        //await getDeleteScadaView({ scada_id: selectedScadaView.id });
        props.handleSnackbar(
            'SCADA Dashboard deleted successfully from view.',
            'success'
        );
      
        props.handleDialogClose();
      //  setFormType(null); // Reset the form type if needed
        // If deletion is from the view page, reload the page
        setScadaContentVisible(false);
        setScadaContentVisibleEdit(false);
        setEditMode(false); // Reset the edit mode if required
        //  props.getScadaViewList(headPlant.id, currUser.id);
       // props.setListUpdated(true)
            window.location.reload();
          //getScadaViewList(headPlant.id, currUser.id);
        //return;
    
    } else {
// If deletion is from the dashboard, refresh the list
//await getDeleteScadaView({ scada_id: selectedScadaView.id });
props.handleSnackbar(
    'SCADA Dashboard deleted successfully.',
    'success'
);
        props.getScadaViewList(headPlant.id, currUser.id);
        props.handleDialogClose();
       // setEditMode(false); // Reset the edit mode if required
        //setFormType(null); // Reset the form type if needed
       // window.location.reload();
    }
   props.handleDialogClose();
    //setEditMode(false);
    };
    
    // useEffect(() => {
    //     console.log('getScadaViewList in ScadaForm:', props.getScadaViewList); // Check if the function is passed
    //     if (props.getScadaViewList && headPlant.id && currUser.id) {
    //       console.log('Calling getScadaViewList with:', headPlant.id, currUser.id);
    //       props.getScadaViewList(headPlant.id, currUser.id);
    //     }
    //   }, [props.getScadaViewList, headPlant.id, currUser.id]);

      
    const handleDialogClose = () => props.handleDialogClose();

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <div className="flex">
                    <div>
                        <TypographyNDL 
                            variant="heading-02-s" 
                            model 
                            value={formType === 'delete' ? t("delScadView") : formType === 'add' ? 'New Dashboard' : ''} 
                        />
                        {formType === 'add' && (
                            <TypographyNDL 
                                variant="paragraph-xs" 
                                value={t('createscadadashboard')} 
                                color="tertiary" 
                            />
                        )}
                    </div>
                </div>
            </ModalHeaderNDL>
            
            <ModalContentNDL>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        {formType === 'delete' ? (
                            <TypographyNDL 
                                variant="lable-01-s" 
                                color="secondary" 
                                value={
                                    t("realDelScadView") + 
                                    (selectedScadaView && selectedScadaView.name ? selectedScadaView.name : '') + 
                                    t("NotReversible")
                                } 
                            />
                        ) : formType === 'add' ? (
                            <InputFieldNDL 
                                id="dashboard-id" 
                                label="Dashboard Name" 
                                placeholder="Type Here" 
                                inputRef={nameRef} 
                            />
                        ) : null}
                        
                        {formType === 'add' && (
                            <div className="pt-1">
                                <TypographyNDL 
                                    variant="paragraph-xs" 
                                    value={t('createscadadashboardnew')} 
                                    color="tertiary" 
                                />
                            </div>
                        )}
                    </Grid>
                    
                    {formType === 'add' && (
                        <Grid item lg={12} >
                            <SelectBox
                                id="access-type"
                                label="Access"
                                placeholder="Access"
                                edit
                                disableCloseOnSelect
                                auto={false}
                                options={accessOption}
                                isMArray={true}
                                keyValue="name"
                                keyId="id"
                                multiple={false}
                                onChange={handleAccessChange}
                                value={selectedId}
                            />
                            
                            <div className="pt-1">
                                <TypographyNDL variant="paragraph-xs"   color="tertiary">
                                    {accessType === 'Public' && "This Dashboard is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone."}
                                    {accessType === 'Private' && "This dashboard is set to private, visible only to you. Keep your insights secure and accessible only to yourself."}
                                    {accessType === 'Shared' && "This dashboard is shared with selected users. Control who can view your insights and collaborate efficiently with your team."}
                                </TypographyNDL>
                            </div>
                        </Grid>
                    )}
                    
                    {formType === 'add' && accessType === 'Shared' && (
                        <Grid item lg={12} >
                            <SelectBox
                                id="shared-options"
                                label="Share With"
                                placeholder="Select User"
                                edit
                                options={userOptions}  // Pass fetched user data here
                                keyValue="name"
                                keyId="id"
                                multiple
                                onChange={handleUserSelection}
                                value={selectedUsers}
                                auto
                            />
                            <TypographyNDL 
                                variant="paragraph-xs" 
                                  color="tertiary"
                                value={t('Select users to give access')} 
                            />
                        </Grid>
                    )}
                </Grid>
            </ModalContentNDL>
            <ModalFooterNDL>
  
  
  {formType === 'add' ? (
    <>
<Button 
    type="secondary" 
    onClick={handleDialogClose} 
    value={t('Cancel')} 
  />
      <Button 
        value={t('Create')} 
        onClick={createNewscadaview} 
        loading={CreateScadaViewLoading} 
      />
      
    </>
  ) : formType === 'delete' ? (
    <>
    <Button 
        type="secondary" 
        value={'Cancel'} 
        onClick={handleDialogClose} 
      />
      <Button 
        type="primary" 
        value={t('YesDelete')} 
        danger 
        loading={DeleteScadaViewLoading} 
        disabled={DeleteScadaViewLoading} 
        onClick={deletescadaview} 
      />
      
    </>
  ) : (
    // For cases where formType is neither 'add' nor 'delete'
    <div></div>
  )}
</ModalFooterNDL>

           
        </React.Fragment>
    );



})
export default ScadaForm;
