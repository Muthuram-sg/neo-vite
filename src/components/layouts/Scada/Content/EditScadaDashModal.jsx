import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { user, selectedPlant,snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from 'components/Core/ButtonNDL';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Grid from 'components/Core/GridNDL';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import LoadingScreenNDL from 'LoadingScreenNDL';
import useSelectedUser from '../hooks/useGetuserSelectList';
import useUpdateScadanameaccess from '../hooks/useUpdateScadanameaccess';


const EditScadaDashModal = ({ scadaId, open, onClose, oncancelClick, currentscadadetail, scadaaccessType, selectedUserslist: propSelectedUsers, existingScadaName}) => { 
    const { SelectedUserLoading, SelectedUserError, SelectedUserData, getSelectedUser } = useSelectedUser();
    const { UpdateScadanameaccessLoading, UpdateScadanameaccessData, UpdateScadanameaccessError,checkScadaNameExists, getUpdateScadanameaccess} = useUpdateScadanameaccess();
    //const [selectedUsers, setSelectedUsers] = useState([]);  // List of selected users by ID
    // console.log(propSelectedUsers,"propSelectedUsers")
    const [selectedUsers, setSelectedUsers] = useState(Array.isArray(propSelectedUsers) ? propSelectedUsers : []);
      const [selectedId, setSelectedId] = useState(scadaaccessType);  // Selected access type ID
    const [accessType, setAccessType] = useState('');  // Access type name
    const [currUser] = useRecoilState(user);
    const { t } = useTranslation();
    const nameRef = useRef();
    const [isLoading, setIsLoading] = useState(true);  // Manage loading state for modal content
    const scadaFormRef = useRef(null);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);

    const [name, setName] = useState(''); // State for the dashboard name

    useEffect(() => {
        if (nameRef.current) {
          nameRef.current.value = existingScadaName; // Set the predefined value
        }
      }, [existingScadaName]); // Empty dependency array ensures this runs only once on mount
    

   
    // Fetch user data when headPlant id is available
    useEffect(() => {
        if (headPlant.id) {
            getSelectedUser(headPlant.id); // Fetch users based on plant ID
        }
    }, [headPlant.id]);


    const userOptions = SelectedUserData ? 
    SelectedUserData.filter((item) => item.userByUserId.id !== currUser.id)  // Filter out the current user
    .map((item) => ({
        id: item.userByUserId.id,
        name: item.userByUserId.name,
    })) : [];


    // useEffect(() => {
    //     console.log(propSelectedUsers,'propSelectedUsers1')

    //     if (Array.isArray(propSelectedUsers) && SelectedUserData && SelectedUserData.length > 0) {
    //         const userOpp = SelectedUserData ? 
    //         SelectedUserData.filter((item) => item.userByUserId.id !== currUser.id)  // Filter out the current user
    //         .map((item) => ({
    //             id: item.userByUserId.id,
    //             name: item.userByUserId.name,
    //         })) : [];
        
    //         console.log(userOpp,propSelectedUsers,'propSelectedUsers2')
    //         const selectedID = propSelectedUsers.map(x=>x.id)
    //         setSelectedUsers(userOpp.filter(x=>selectedID.includes(x.id)));
    //     } else {
    //         setSelectedUsers([]);  // Fallback to an empty array if propSelectedUsers is not valid
    //     }
    // }, [propSelectedUsers,SelectedUserData]); 
    
    // Update state once currentscadadetail data is fetched
    useEffect(() => { 
        if (currentscadadetail && currentscadadetail.length > 0 && open) {
            const detail = currentscadadetail[0]; 
            // Set access type and its name
            setSelectedId(detail.access_type);
            const accessOptionName = accessOption.find(option => option.id === String(detail.access_type))?.name || '';
            setAccessType(accessOptionName);

            // Set selected users by ID (update based on the new `scada_user_access_list`)
            if (detail.scada_user_access_list && Array.isArray(detail.scada_user_access_list) && accessOptionName == '3') {
                const userOpp = SelectedUserData ? 
                SelectedUserData.filter((item) => item.userByUserId.id !== currUser.id)  // Filter out the current user
                .map((item) => ({
                    id: item.userByUserId.id,
                    name: item.userByUserId.name,
                })) : [];
            
                const selectedID = detail.scada_user_access_list.map(x=>x.id)
                setSelectedUsers(userOpp.filter(x=>selectedID.includes(x.id)));  // Assuming users have `id`
            }

            // Set name directly on ref (to auto-fill name field)
            if (nameRef.current) {
                nameRef.current.value = detail.name;
            }

            setName(detail.name);

            setIsLoading(false);  // Data is loaded, update loading state
        }
    }, [currentscadadetail,open,SelectedUserData]);  // Run this effect whenever currentscadadetail changes

    useEffect(() => {
        if (!UpdateScadanameaccessLoading && !UpdateScadanameaccessError && UpdateScadanameaccessData) {

 if (UpdateScadanameaccessData.affected_rows >= 1) {
console.log('Scada Dashboard Updated successfully');
handleSnackbar(('Dashboard info is successfully updated'), 'success'); 

//   window.location.reload();  
}else{
console.log('Scada Dashboard error in update');
handleSnackbar(('Scada Dashboard error in update'), 'error');
}
        }
          
    }, [UpdateScadanameaccessData])

    const handleSnackbar = (message, type) => {
        SetMessage(message);
        SetType(type);
        setOpenSnack(true)
    }

    // const handleNameChange = (e) => {
    //     setName(e.target.value); // Update state on input change
    // };
    const handleNameChange = (e) => {
        //nameRef.current.value = e.target.value;  // Update the value directly via the ref
        setName(e.target.value);
    };

    // Initialize user options, filter out current user
   
      //  console.log('selectedUsers:', selectedUsers);
      //  console.log('userOptions:', userOptions);
    const accessOption = [
        { id: "1", name: "Public" },
        { id: "2", name: "Private" },
        { id: "3", name: "Shared" },
    ];

    // Handle selection change for access type
    const handleAccessChange = (event) => {
        const selectedOption = accessOption.find(option => option.id === event.target.value);
        const id = event.target.value;
        setSelectedId(id);
        setAccessType(selectedOption ? selectedOption.name : '');

        // Reset user selection based on access type (if needed)
        if (selectedOption?.name === 'Shared' && propSelectedUsers.length > 0) {
            const userOpp = SelectedUserData ? 
                SelectedUserData.filter((item) => item.userByUserId.id !== currUser.id)  // Filter out the current user
                .map((item) => ({
                    id: item.userByUserId.id,
                    name: item.userByUserId.name,
                })) : [];
            
                const selectedID = propSelectedUsers.map(x=>x.id)
            setSelectedUsers([...[currUser],...userOpp.filter(x=>selectedID.includes(x.id))]);  // Preselect users from the prop
        } else {
            setSelectedUsers([currUser]);  // For 'Public' or 'Private', just set the current user
        }
    };

    // Update userOptions to include only those that match selectedUsers

//console.log('updatedUserOptions:', selectedUsers);



// const sharedUsers = selectedUsers.length > 0
//   ? [...selectedUsers.map(user => ({ id: user }))]  // Always include current user at the end
//   : [{ id: currUser.id }];

//console.log('shared user list ', sharedUsers);

    // Handle user selection changes
    const handleUserSelection = (selected) => {
        if(selected.length === 0){
            setSelectedUsers([currUser])
        }else{
            setSelectedUsers([...[currUser],...selected]);
        }
       // Update selected users with their IDs
      //  console.log('Updated user options new list:', selectedUsers);
   // setSharedUsers(updatedSelection);
        
        // If the current user is not in the selected array, add them
    // const updatedSelection = [...new Set([...selectedUsers, ...selected])];
    
    // setSelectedUsers(updatedSelection); // Update selected users with their IDs
        //setSelectedUsers(selected); // Update selected users with their IDs
      //  console.log('Selected users:', updatedSelection);
    };

    // Placeholder logic for the select boxes
    const accessTypePlaceholder = accessType ? `${accessType}` : "Select Access Type";
    const sharedOptionsPlaceholder = selectedUsers.length > 0 ? 
        `${selectedUsers.length} User(s) Selected` : "Select User(s)";

    // Only render the modal content when currentscadadetail is valid
    if (!currentscadadetail || currentscadadetail.length === 0) {
        return  <LoadingScreenNDL /> // Or show a loading spinner here
    }
   
  
    const ScadaUserUpdatescadanameandaccess = async () => {
        //const name = nameRef.current.value;
        const newName = name; 
          // Validation logic
          if (!newName) {
            handleSnackbar('Enter a valid name', 'warning');
            return;
        }
      if(existingScadaName !== name ){
        const nameExists = await checkScadaNameExists(name, headPlant.id);
        if (nameExists) {
            handleSnackbar(t('scadaNameExists'), 'error');
            // props.handleDialogClose();
            return false;
        }
      }

    //    console.log(selectedId,selectedUsers,"selectedUsers")
    if(selectedId == '3' && selectedUsers.filter(x=>x.id !== currUser.id).length === 0){
        handleSnackbar("Please Select Shared User", 'error');
        // props.handleDialogClose();
        return false;
    }

        // if (!name || name === null) {
        //     handleSnackbar(t('enterScadName'), 'warning');
        //     return false;
        // }
    
        // if (!selectedId) {
        //     handleSnackbar(t('selectAccessType'), 'warning'); // Display a message to select access type
        //     return false;
        // }
    
        // // Check if the name is changing
        // const isNameChanging = name !== existingScadaName; // You should have `existingScadaName` as the current SCADA name in state
    
        // If the name is changing, check if the new name already exists
        // if (isNameChanging) {
        //     const nameExists = await checkScadaNameExists(name, headPlant.id);
        //     if (nameExists) {
        //         handleSnackbar(t('scadaNameExists'), 'error');
        //         return false;
        //     }
        // }
    
        const transformedUserList = selectedUsers.map(userId => ({ id: userId.id }));
        // Create the object to update
        let obj = {
            scada_id: scadaId,
            scada_user_access_list: transformedUserList,  // Array of user IDs
            updated_by: currUser.id,  // Current user ID for tracking the update
            access_type: parseInt(selectedId, 10),  // Convert to integer for access type
            name: newName,  // Name of the SCADA dashboard
        };
    
        console.log('Updating SCADA with the following data:', obj);
    
        try {
            // Call the update API
            const result = await getUpdateScadanameaccess(obj);
    
            if (result && result.success) {
                // If the update was successful
                handleSnackbar(('Updated Successfully '), 'success');
                onClose(name);  // Close the modal after successful save
            } else {
                // If the update failed
                handleSnackbar(('Updated Successfully '), 'success');
                onClose(name);
            }
            setName('')
        } catch (error) {
            // Handle error
          //  console.error('Error updating SCADA data:', error);
            handleSnackbar(t('updateFailed'), 'error');
            onClose(name);
        }
    };
    

    return (
        <Modal open={open} onCancel={()=>onClose()}>
            <ModalHeaderNDL>
                <div className="flex">
                    <TypographyNDL variant="heading-01-xs" value="Edit Dashboard Info" />
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>
                {/* Dashboard Name Input */}
                {/* <InputFieldNDL 
                    id="scadadashboard-id" 
                    label="Dashboard Name" 
                    placeholder="Type Here" 
                   // inputRef={nameRef} 
                    //value={currentscadadetail[0]?.name || ''}  // Ensure name is fetched correctly
                //  value={name}
                  
                 //  onChange={handleNameChange} // Update state on change
                  // onChange={(e) => nameRef.current.value = e.target.value}
                  inputRef={nameRef} 
                  onChange={handleNameChange}

                /> */}
                 <InputFieldNDL
                 autoFocus
        id="scadadashboard-id"
        label="Dashboard Name"
        maxLength={'50'}
        placeholder="Type Here"
        inputRef={nameRef}
        value={name} // Optional: bind value to state if you want to manage the input value
        onChange={handleNameChange} // Update state on change
      />
      <div className='mt-3'  />

                {/* Access Type Selection */}
                <Grid item lg={12}>
                    <SelectBox
                        id="access-type"
                        label="Access"
                        placeholder={accessTypePlaceholder}  // Dynamically set the placeholder
                        edit
                        disableCloseOnSelect
                        auto={false}
                        options={accessOption}
                        keyValue="name"
                        keyId="id"
                        multiple={false}
                        onChange={handleAccessChange}
                        value={selectedId}  // Ensure the correct access type is selected
                        disabled={isLoading}  // Disable dropdown if loading
                    />
                    
                    {isLoading && <TypographyNDL variant="paragraph-xs"   color="tertiary">Loading access type...</TypographyNDL>}
                    <div className="pt-2">
                        <TypographyNDL variant="paragraph-xs">
                            {accessType === 'Public' && "This Dashboard is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone."}
                            {accessType === 'Private' && "This dashboard is set to private, visible only to you. Keep your insights secure and accessible only to yourself."}
                            {accessType === 'Shared' && "This dashboard is shared with selected users. Control who can view your insights and collaborate efficiently with your team."}
                        </TypographyNDL>
                    </div>
                </Grid>
                <div className='mt-3'  />

                {/* User Selection (only show for Shared access) */}
                {accessType === 'Shared' && (
                    <Grid item lg={12} style={{ marginTop: '16px' }}>
                        <SelectBox
  id="shared-options"
  label="Share With"
  placeholder={"Select User"} 
  options={userOptions}
  keyValue="name"
  keyId="id"
  multiple
  onChange={handleUserSelection}
  value={selectedUsers}  // Pass selected users' IDs as value (ensure this is an array of IDs)
  auto
  disabled={isLoading}  // Disable multi-select if loading
/>
                        {/* <SelectBox
    id="shared-options"
    label="Share With"
    placeholder="Select User"
    edit
    options={userOptions}
    keyValue="name"
    keyId="id"
    multiple
    onChange={handleUserSelection}
    value={selectedUsers}  // Pass selected users' IDs as value
    auto
    disabled={isLoading}  // Disable multi-select if loading
/> */}

                        {isLoading && <TypographyNDL variant="paragraph-xs"   color="tertiary">Loading users...</TypographyNDL>}
                        <TypographyNDL variant="paragraph-xs" value={t('Select users to give access')}   color="tertiary"/>
                    </Grid>
                )}
            </ModalContentNDL>

            <ModalFooterNDL>
                <Button type="secondary" onClick={()=>onClose()} value="Cancel" />
                {/* <Button type="primary" value="Update" onClick={() => handleUserSelection} /> */}
                <Button type="primary" value="Update" 
                 loading={UpdateScadanameaccessLoading} 
                onClick={() => {
  //  console.log("Update button clicked");
    ScadaUserUpdatescadanameandaccess();
}} />
                
                {/* <Button type="primary" value="Update" onClick={() => oncancelClick({ name: nameRef.current.value, access_type: selectedId, users: selectedUsers })} /> */}
            </ModalFooterNDL>
        </Modal>
    );
};

export default EditScadaDashModal;
