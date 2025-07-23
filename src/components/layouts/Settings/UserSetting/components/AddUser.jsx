import React,{useState,useEffect,useRef} from "react";  
import ProgressIndicator from "components/Core/ProgressIndicators/ProgressIndicatorNDL" 
import { useTranslation } from 'react-i18next'; 
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useRecoilState } from "recoil";
import { user, selectedPlant,userRoleList,selUserforLine, selUserforLineValid,selectedPlantIndex,userDefaultLines,
    userLine,
    userData,
    snackToggle,
    snackMessage,
    snackType
    
} from "recoilStore/atoms"; 
import configParam from "config"; 
import Button from 'components/Core/ButtonNDL';
import UsersList from "./UsersDropDown";  
import ExUsersList from "./ExUserDropDown";
import useEditUser from "../hooks/useEditUser";
import useCreateUser from "../hooks/useCreateUser";
import useNewUserMail from "../hooks/useNewUserMail";
import useCreateUserRole from "../hooks/useCreateUserRole";
import useCheckExternalUser from "../hooks/useCheckExternalUser";
import useRemoveUser from "../hooks/useRemoveUser";
import useCheckUserAccessForLine from "../hooks/useCheckUserAccessForLine";
import useGetUserEmail from "../hooks/useGetUserEmail";
import useGetAppType from "../hooks/useGetAppType";
import useUserDefaults from "../hooks/useUserDefaults";
import useUsersListForLine from "../hooks/useUsersListForLine";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
 
function AddChannel(props) { 
    const { t } = useTranslation();  
    const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
    const [, setSelectedIndex] = useRecoilState(selectedPlantIndex);
    const [currUser, setcurruser] = useRecoilState(user);
    const [, setuserDetails] = useRecoilState(userData);
    const [, setUserDefaultLines] = useRecoilState(userDefaultLines);
    const [selectedUserData, setSelectedUserData] = useRecoilState(selUserforLine); 
    const [UserOption,setUserOption]= useState([]);
    const [EmailOption,setEmailOption]= useState([]);
    const [, setUserforLineData] = useRecoilState(userLine);
    const [userRoleListData] = useRecoilState(userRoleList); 
    const [, setAddUserValid] = useRecoilState(selUserforLineValid);
    const [validEmail,setvalidEmail] = useState(false);
    const [ValidUser,setValidUser] = useState(false);
    const [ValidMob,setValidMob] = useState(false); 
    const [ValidSGID,setValidSGID]= useState(false); 
    const [MailID,setMailID] = React.useState('');
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setUserDialog] = useState(false);
    const [userDialogMode, setUserDialogMode] = useState(props.UserDialogMode); 
    const [addingUserLoad, setAddingUserLoad] = useState(false);   
    const [errormsg,setErrorMsg] = useState('');
    const [selectRole, setSelectRole] = useState({ id: 0, role: "" });
    const [userRoleErrMsg,SetUserRoleErrMsg] = useState("");
    const [addRoleValid, setAddRoleValid] = useState(true);  
    const usernameRef = useRef();
    const emailRef = useRef();
    const mobileRef = useRef(); 
    const sgidRef = useRef(); 
    const [,SetUserErrMsg] = useState(""); 
    const [showCreatUser, setShowCreatUser] = useState(false);
    const [showCreatEmail, setshowCreatEmail] = useState(false);
    const [, setSGIDMatchingEmployees] = useState(null);
    const [matchingEmailEmployees, setEmailMatchingEmployees] = useState(null);
    const {UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine} = useUsersListForLine();
    const {UserDefaultsLoading, UserDefaultsData, UserDefaultsError, getUserDefaults} = useUserDefaults();
    const {EditUserLoading, EditUserData, EditUserError, getEditUser} = useEditUser();
    const {CreateUserLoading, CreateUserData, CreateUserError, getCreateUser} = useCreateUser();
    const {mailTriggerLoading, mailTriggerdata, mailTriggererror, newUserMailTrigger} = useNewUserMail();
    const {CreateUserRoleLoading, CreateUserRoleData, CreateUserRoleError, getCreateUserRole} = useCreateUserRole();
    const {checkExternalUserLoading, checkExternalUserData, checkExternalUserError, getcheckExternalUser} = useCheckExternalUser();
    const {RemoveUserLoading, RemoveUserData, RemoveUserError, getRemoveUser} = useRemoveUser();
    const {CheckUserAccessForLineLoading, CheckUserAccessForLineData, CheckUserAccessForLineError, getCheckUserAccessForLine} = useCheckUserAccessForLine();
    const {UserMailLoading, UserMailData, UserMailError, searchUserById} = useGetUserEmail();
    const {UserAppTypeLoading, UserAppTypeData, UserAppTypeError, getAppType} = useGetAppType();
    const [AppType, setAppType] = useState([]); 
    
    useEffect(()=>{
    if (!UsersListForLineLoading && !UsersListForLineError && UsersListForLineData) {
       
        setUserforLineData(UsersListForLineData); 
        handleUserDialogClose();
    } 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[UsersListForLineLoading, UsersListForLineData, UsersListForLineError])

    useEffect(()=>{
      if(!UserAppTypeLoading && UserAppTypeData && !UserAppTypeError){
        if(UserAppTypeData.description === "neo"){
          setAppType("Neo")
        }
        else if(UserAppTypeData.description === "CMS"){
          setAppType("CMS")
        } 
        else if(UserAppTypeData.description === "grind_smart"){
          setAppType("Grind Smart")
        } 
      }
    },[UserAppTypeLoading, UserAppTypeData, UserAppTypeError])

    useEffect(()=>{
        if (!UserDefaultsLoading && !UserDefaultsError && UserDefaultsData) {
            setuserDetails(UserDefaultsData[0]);
            setUserDefaultLines(UserDefaultsData[0].user_role_lines);
            setcurruser({ id: UserDefaultsData[0].id, sgid: UserDefaultsData[0].sgid ? UserDefaultsData[0].sgid : "", name: UserDefaultsData[0].name });
            setheadPlant({ id: 0, name: "Select a Plant" })
            setSelectedIndex(-1)
            setUserDialogMode("");
            props.SelectedRow([])
            setSelectRole({ id: 0, role: "" });
            handleUserDialogClose();
        } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[UserDefaultsLoading, UserDefaultsData, UserDefaultsError])

    useEffect(()=>{
        if (!EditUserLoading && !EditUserError && EditUserData) {
            SetMessage(t('UpdatedUserRole') + props.SelectRow.userByUserId.name)
            SetType("success")
            setOpenSnack(true)
            fetchUsersListForLine()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[EditUserLoading, EditUserData, EditUserError])

      useEffect(()=>{
        if (!CreateUserLoading && !CreateUserError && CreateUserData) {  
            setAddingUserLoad(false)
            setValidUser(false)
            getCreateUserRole(CreateUserData.id, headPlant.id, selectRole.id, currUser.id )
        } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[CreateUserLoading, CreateUserData, CreateUserError])

      useEffect(()=>{
        if (!UserMailLoading && !UserMailError && UserMailData) {
          const mailbody = {
            "isNewUser":"0",
            "payload":{
                "email": UserMailData.email,
                "line_name": headPlant.name,
                "project_name":AppType
            }
        }
        newUserMailTrigger(mailbody)
      }
      },[UserMailLoading, UserMailData, UserMailError])

      useEffect(()=>{
        if (!CheckUserAccessForLineLoading && !CheckUserAccessForLineError && CheckUserAccessForLineData) {
            if (CheckUserAccessForLineData.Data.length === 0) { 
                getCreateUserRole(CheckUserAccessForLineData.user_id, headPlant.id, selectRole.id, currUser.id )
                searchUserById(CheckUserAccessForLineData.user_id)
            } else {
              SetMessage(CheckUserAccessForLineData.Data[0].userByUserId.name + t('AlreadyUserRole') + headPlant.name)
              SetType("warning")
              setOpenSnack(true)
              handleUserDialogClose();
            }
        } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[CheckUserAccessForLineLoading, CheckUserAccessForLineData, CheckUserAccessForLineError])

      useEffect(()=>{
        if (!RemoveUserLoading && !RemoveUserError && RemoveUserData) {
            if (RemoveUserData.affected_rows >= 1) {
                SetMessage(t('DeletedUserAccess') + headPlant.name)
                SetType("success")
                setOpenSnack(true)
                if (props.SelectRow.user_id === currUser.id) {
                  getUserDefaults(currUser.id)
                }
                else {
                  fetchUsersListForLine()
                }
              }
        } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[RemoveUserLoading, RemoveUserData, RemoveUserError])

      useEffect(()=>{
        if (!CreateUserRoleLoading && !CreateUserRoleError && CreateUserRoleData) {
            SetMessage(t('AddedNew') + selectRole.role.replace('_', ' ') + " " + CreateUserRoleData.userByUserId.name + t('For') + headPlant.name)
            SetType("success")
            setOpenSnack(true)
            fetchUsersListForLine()
        } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[CreateUserRoleLoading, CreateUserRoleData, CreateUserRoleError])
  
      useEffect(()=>{
            if (!checkExternalUserLoading && !checkExternalUserError && checkExternalUserData) {
                if (checkExternalUserData.length === 0) {
                    setAddUserValid(true)
                    setValidUser(false);
                    SetUserErrMsg("");
                    SetUserErrMsg("");
                    let TempPass = generatePass()
                    getCreateUser(usernameRef.current.value,mobileRef.current.value, '', emailRef.current.value, currUser.id, TempPass)
                    
                    const mailbody = {
                            "isNewUser":"1",
                            "payload":{
                                "email": emailRef.current.value,
                                "line_name": headPlant.name,
                                "project_name":AppType,
                                "Temp_password": TempPass
                            }
                        }
                    newUserMailTrigger(mailbody)
                } else {
                    getCheckUserAccessForLine(headPlant.id, checkExternalUserData[0].id)
                } 
            }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[checkExternalUserLoading, checkExternalUserData, checkExternalUserError])
  

      function generatePass() {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    
        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);
    
            pass += str.charAt(char)
        }
    
        return pass;
    }

    useEffect(() => {
        if (headPlant !== undefined && headPlant.gaia_plant_id !== undefined) {
          getAppType(headPlant.id)
        if (headPlant.gaia_plant_id.substring(0, 2) === 'EX') {
            setShowCreatUser(true)
        }
        else {
            setShowCreatUser(false)
        }
        }
    }, [headPlant])

    useEffect(()=>{
        setUserDialog(props.UserDialog)
        setUserDialogMode(props.UserDialogMode) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.UserDialog])
    
       const handleUserDialogClose = () => {
        setUserDialog(false);
        props.UserDialogclose(false)
        setNoOfEMailMatchingEmployees(null)
        setNoOfSGIDMatchingEmployees(null)
        setSelectRole({ id: 0, role: "" })
        setSelectedUserData({})
        setAddingUserLoad(false)
        setAddRoleValid(true);
        setAddUserValid(true)
        setErrorMsg("");
        SetUserErrMsg("");
        SetUserRoleErrMsg("");
        setValidUser(false);
        setValidMob(false)
        setValidSGID(false)
        setvalidEmail(false)
        if (headPlant !== undefined && headPlant.gaia_plant_id !== undefined) {
        if (headPlant.gaia_plant_id.substring(0, 2) === 'EX') {
            setShowCreatUser(true)
        }
        else {
            setShowCreatUser(false)
        }
        }
      } 
       
      const handleCreateRoleChange = (event) => {
        if( event.target.value !== undefined ||  event.target.value >0){
          SetUserRoleErrMsg('');
          }
        setAddRoleValid(true)
        setSelectRole(JSON.parse(JSON.stringify(userRoleListData)).filter(x => x.id === event.target.value)[0])
      }

      const clickUserButton = (event) => {
        console.log("userDialogMode", userDialogMode)
        if (userDialogMode === "delete") {
            getRemoveUser(props.SelectRow.user_id,  headPlant.id )
        }
        if (!showCreatUser) {
          
          
          if (userDialogMode === "edit") {
            getEditUser( props.SelectRow.user_id, headPlant.id, selectRole.id ? selectRole.id : props.SelectRow.role_id)
            
          }
          else if (userDialogMode === "create") {
            if (selectRole.id === 0) {
              setAddRoleValid(false)
            }
            if (!selectedUserData || Object.keys(selectedUserData).length === 0) {
              setAddUserValid(false)
            }
            else if ((selectRole.id !== 0) && (selectedUserData || Object.keys(selectedUserData).length !== 0)) {
              setAddingUserLoad(true)
              CheckUserExist(selectedUserData.SGID)
            }
          }
        }
        else {
          if (userDialogMode === "edit") {
            getEditUser( props.SelectRow.user_id, headPlant.id, selectRole.id ? selectRole.id : props.SelectRow.role_id)
          }else{
            lineAccessForExternalUser()
          }
        }
      }

      function CheckUserExist(sgid) {
        var url ="/employee/checksgid";
          configParam.RUN_REST_API(url, {sgid: sgid})
          .then((userExistData) => {
           
            if (userExistData !== undefined && userExistData.data !== undefined) {
              if (userExistData.data.id) {
                getCheckUserAccessForLine(headPlant.id, userExistData.data.id)
              } else {
                handleUserDialogClose();
              }
            }
            else if (userExistData.errorTitle === "Invalid SGID" && userExistData.errorMessage === "User does not exist") {
                getCreateUser(selectedUserData.Name,selectedUserData.MobileNo, selectedUserData.SGID, selectedUserData.SGMailID, currUser.id, "https://www.saint-gobain.com/sites/saint-gobain.com/themes/custom/sg_radix/logo.svg")
            }
            else {
              handleUserDialogClose();
            }
          })
          .catch(error => console.log('error', error));
      }
       
      function fetchUsersListForLine() {
        getUsersListForLine(headPlant.id)
      }
      const lineAccessForExternalUser = () => {

       
        if (usernameRef.current && usernameRef.current.value !== '') {
        var regex = /^[A-Za-z0-9 ]+$/
        var isValid = regex.test(usernameRef.current.value);
        if (!isValid) {
          setOpenSnack(true)
          SetType("warning")
          SetMessage(t("Username Should not contain special characters"))
        //  setValidUser(true)
             return false;
        } 
      }

      if(selectedUserData.length > 0 ){
        if (selectedUserData[0].id ===''  && emailRef.current.value === "") {
          setvalidEmail(true)
          return false;
        }else{
          setvalidEmail(false)
        }
        
        if (!/^\S+@\S+\.\S+$/.test(selectedUserData[0].email)) {
          setvalidEmail(true);
          return false;
      } else {
          setvalidEmail(false);
      }
          
      }
        
       
        
        if (selectRole.id === undefined || selectRole.id === 0) {
          SetUserRoleErrMsg(t('UserRoleErrMsg'));
          return false;
        }
        if (selectedUserData.length > 0) { 
            getCheckUserAccessForLine(headPlant.id, selectedUserData[0].id)
        } else {
         
          if (usernameRef.current.value === '') {
            setValidUser(true)
            return false;
          }else{
            setValidUser(false)
          }
          if (mobileRef.current.value === '' || mobileRef.current.value.length > 10) {
            setValidMob(true) 
            return false;
          }else{setValidMob(false)}
          if(mobileRef.current.value.length<=9){
            setValidMob(true) 
            return false;
          }else{
            setValidMob(false) 
          }
          // if(sgidRef.current.value === '' || sgidRef.current.value.length > 8){
          //   setValidSGID(true) 
          //   return false;
          // }else{
          //   setValidSGID(false) 
          // }
          // if(sgidRef.current.value.length<=7){
          //   setValidSGID(true) 
          //   return false;
          // }else{
          //   setValidSGID(false) 
          // }
       
       if(selectedUserData.length > 0){
        getcheckExternalUser(selectedUserData[0].email);
       }else{
        getcheckExternalUser(emailRef.current && emailRef.current.value);

       }   
        }
      }
    
     
    
      const setNoOfSGIDMatchingEmployees = (employees) => {
        setSGIDMatchingEmployees(employees)
      }
      const setNoOfEMailMatchingEmployees = (employees) => {
        setEmailMatchingEmployees(employees)
      }
      const showManualUserAdd = () => {
        setSGIDMatchingEmployees(null)
        setShowCreatUser(true)
      }

      let dialogTitle;

      if (userDialogMode === "create") {
        dialogTitle = t('AddUsers');
      } else if (userDialogMode === "edit") {
        dialogTitle = t('EditUsers');
      } else {
        dialogTitle = t('DeleteUsers');
      }

      let errorMessage;

        if (userRoleErrMsg) {
          errorMessage = userRoleErrMsg;
        } else {
          errorMessage = !addRoleValid ? true : false;
        }
        let helperText=ValidUser ? t("Emailmailvalid") : ''

        let isDanger;
        let buttonValue;

        if (userDialogMode === 'delete') {
          isDanger = true;
          buttonValue = t('YesDelete');
        } else {
          isDanger = false;
          buttonValue = userDialogMode === 'create' ? t('Add') : t('Update');
        }
    return (
        <React.Fragment>
        {/* <ModalNDL open={userDialog} onClose={handleUserDialogClose} size="lg">  */}
            <ModalHeaderNDL>
              <TypographyNDL variant="heading-02-xs" model value={dialogTitle}/>  
            </ModalHeaderNDL>
            <ModalContentNDL>
            {errormsg ? (
              errormsg
          ) : null}
          {userDialogMode === "create" &&
            <React.Fragment>
              <SelectBox
                    labelId="user-role"
                    label={t("UserRole")}
                    defaultDisableName={t(" Select a Tag")} 
                    id="user-role"
                    auto={false}
                    multiple={false}
                    options={userRoleListData}
                    isMArray={true}
                    checkbox={false}
                    value={selectRole.id !== 0 ? selectRole.id : ""}
                    onChange={handleCreateRoleChange}
                    keyValue="role"
                    keyId="id"
                    error={errorMessage}
                    msg={userRoleErrMsg ? userRoleErrMsg : t('plsSelUsrRole')}
                    
                />

                <div className="mb-3" />
              
              {!showCreatUser && <UsersList showManualUserAdd={()=> showManualUserAdd()} optionarr={(e)=> setUserOption(e)} option={UserOption}/>}
              {showCreatUser &&
                
                <React.Fragment>
                  {!showCreatEmail ?
                  <ExUsersList 
                    inputref={emailRef} 
                    value={MailID} 
                    MailVal={(e)=>setMailID(e)} 
                    validEmail={validEmail}
                    options={EmailOption}
                    optionarr={(e)=> setEmailOption(e)}
                    showManualEmailAdd={()=> {setshowCreatEmail(true);setMailID('')}}
                    />
                    :
                    <InputFieldNDL
                        id="E-mail"
                        label={t('Email')}
                        placeholder={t('TypeEmail')}
                        inputRef={emailRef}
                        error={validEmail}
                        helperText={helperText} 
                        type="text"
                    />
                  }
                  
                  <div className="mb-3" />
                  {matchingEmailEmployees !== undefined && (matchingEmailEmployees === null || matchingEmailEmployees === 0) && !MailID &&  
                    <div>
                        <InputFieldNDL
                            id="Username"
                            label={t('Name')}
                            placeholder={t('Name')}
                            inputRef={usernameRef}
                            error={ValidUser}
                            helperText={ValidUser ? t("Enter UserName") : ''}
                            // onChange={(e)=>{ Validate(e.target.value)}}
                             type="text"
                        />
                  <div className="mb-3" />
                      
                      <InputFieldNDL
                          id="MobileNo"
                          label={t('MobileNo')}
                          placeholder={t('MobileNo')}
                          type="tel"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                        
                            // Remove any non-numeric characters from the input
                            const numericValue = inputValue.replace(/\D/g, '');
                        
                            // Limit the value to 10 digits
                            if (numericValue.length <= 10) {
                              e.target.value = numericValue;
                            } else {
                              e.target.value = numericValue.slice(0, 10);
                            }
                          }}
                          inputRef={mobileRef}
                          error={ValidMob}
                          helperText={ValidMob ? t("Enter valid Mobile number") : ''}
                        />
                  {/* <div className="mb-3" />

                      <InputFieldNDL
                            id="SGid"
                            label={t('SGID')}
                            placeholder={t('SGID')}  
                            type="text"
                            onChange={(e)=>{ 
                              if (isNaN(e.target.value.charAt(0)) && !isNaN(e.target.value.substring(1)) ) {
                                e.target.value = e.target.value.toString().toUpperCase().slice(0,8) 
                              }else{
                                let del = Number(e.target.value.length-1)
                                e.target.value = e.target.value.toString().slice(0,del)
                              }
                              // e.target.value = e.target.value.toString().slice(0,8)
                            }}
                            inputRef={sgidRef}
                            error={ValidSGID}
                            helperText={ValidSGID ? t("Enter valid SGID") : ''}
                            // onClick={(e)=>{ Validate()}}
                        /> */}
                     
                    </div>
                  }
                </React.Fragment>
              }
            </React.Fragment>
          }
          {userDialogMode === "edit" &&
            <React.Fragment>
                <TypographyNDL variant="lable-01-s" color="secondary" value={t('Change') + props.SelectRow.userByUserId.name + t('RoleFrom') + props.SelectRow.role.role.replace('_', ' ')  + t('In') + headPlant.name} />
                <SelectBox
                    labelId="user-role"
                    label={t("User Role")}
                    id="user-role"
                    auto={false}
                    multiple={false}
                    options={userRoleListData}
                    isMArray={true}
                    checkbox={false}
                    value={selectRole.id !== 0 ? selectRole.id : props.SelectRow.role_id}
                    onChange={handleCreateRoleChange}
                    keyValue="role"
                    keyId="id"
                    error={errorMessage}
                    msg={userRoleErrMsg ? userRoleErrMsg : t('plsSelUsrRole')}
                />
            </React.Fragment>

          }
          {userDialogMode === "delete" &&
            <TypographyNDL variant="lable-01-s" color="secondary" value={'Do you want to delete ' + props.SelectRow.userByUserId.name + t('From') + headPlant.name +"? This action cannot be undone."} />
          }
            </ModalContentNDL> 
            {addingUserLoad &&
          <ModalFooterNDL style={{ justifyContent: 'center' }}>
            <ProgressIndicator/>
            <div style={{ marginBottom: 0 }} >
            <TypographyNDL variant="lable-01-s" color="secondary" value={t('AddingUser')} />
            </div>
          </ModalFooterNDL>
        }
        {!addingUserLoad &&
          <ModalFooterNDL>
            <Button type="secondary"  value={t('Cancel')} onClick={() => handleUserDialogClose()}/>
            <Button type="primary"   danger={isDanger} value={buttonValue} onClick={(e) => clickUserButton()}/>
            
           
          </ModalFooterNDL>
        }
       
      </React.Fragment>
    );
} 
const isRender = (prev,next)=>{ 
    
    return prev.UserDialog !== next.UserDialog ? false:true;
} 
export default React.memo(AddChannel,isRender);