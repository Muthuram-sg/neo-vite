import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import { useRecoilState } from "recoil";
import { user, selectedPlant, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL';
import useChannelType from '../hooks/useChannelType';
import useEditChannel from '../hooks/useEditChannel';
import useAddChannel from '../hooks/useAddChannel';
import useRemoveChannel from '../hooks/useRemoveChannel';
import useCheckUserExist from '../hooks/useCheckUserExist';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

// NOSONAR 
function AddChannel(props) {// NOSONAR start -  skip this line
  
 const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [currUser] = useRecoilState(user);
  const nameRef = useRef();
  const ParamRef = useRef();
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [userDialogMode, setUserDialogMode] = useState(props.UserDialogMode);// NOSONAR start -  skip this line
  const [ChannelType, setChannelType] = useState('');
  const [nameValid, setnameValid] = useState(false);
  const [paramValid, setparamValid] = useState(false);
  const [TypeValid, setTypeValid] = useState(false);
  const [UserWise,setUserWise] = useState(false);
  const [UserNumList,setUserNumList] = useState([]);
  const [ParamList,setParamList] = useState([]);
  const [SelectedUser,setSelectedUser] = useState([]);
  const { ChannelTypeLoading, ChannelTypeData, ChannelTypeError, getChannelType } = useChannelType();
  const { EditChannelLoading, EditChannelData, EditChannelError, getEditChannel } = useEditChannel();
  const { AddChannelLoading, AddChannelData, AddChannelError, getAddChannel } = useAddChannel();
  const { RemoveChannelLoading, RemoveChannelData, RemoveChannelError, getRemoveChannel } = useRemoveChannel();
  const { CheckUserExistLoading, CheckUserExistData, CheckUserExistError, getCheckUserExist } = useCheckUserExist();
  const {UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine} = useUsersListForLine();

  useEffect(() => {
    if (!CheckUserExistLoading && !CheckUserExistError && CheckUserExistData) {
      if (CheckUserExistData === "Channel Name Already Exist") {
        SetMessage(CheckUserExistData)
        SetType("warning")
        setOpenSnack(true)
      }
      else if (CheckUserExistData.errorTitle === "Invalid Name" && CheckUserExistData.errorMessage === "Channel does not exist") {
        getAddChannel(ChannelType, headPlant.id, nameRef.current.value, UserWise ? ParamList.toString() : ParamRef.current.value, currUser.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CheckUserExistLoading, CheckUserExistData, CheckUserExistError])

  useEffect(() => {
    if (!EditChannelLoading && !EditChannelError && EditChannelData) {
   
      handleUserDialogClose();
      SetMessage(t('Updated Channel ') + props.SelectRow.name)
      SetType("success")
      setOpenSnack(true)
      props.getChannelListForLine(headPlant.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditChannelLoading, EditChannelData, EditChannelError])

  useEffect(() => {
    if (!AddChannelLoading && !AddChannelError && AddChannelData) {
      SetMessage(t('AddedNew') + nameRef.current.value)
      SetType("success")
      setOpenSnack(true)
      handleUserDialogClose()
      setChannelType('')
      getChannelType()
      props.getChannelListForLine(headPlant.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AddChannelLoading, AddChannelData, AddChannelError])

  useEffect(() => {
    if (!RemoveChannelLoading && !RemoveChannelError && RemoveChannelData) {
      
      handleUserDialogClose();
      SetMessage(t('Deleted Channel') + headPlant.name)
      SetType("success")
      setOpenSnack(true)
      props.getChannelListForLine(headPlant.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RemoveChannelLoading, RemoveChannelData, RemoveChannelError])

  useEffect(() => {
    setUserDialogMode(props.UserDialogMode)
   
    if (props.SelectRow) {
      setChannelType(props.SelectRow.type)
      if(props.SelectRow.type !== '013d0b10-b4f2-4ef1-8804-a2b756684ad2'){ // Teams
        getUsersListForLine(headPlant.id)
      }
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.value = props.SelectRow.name ? props.SelectRow.name : '' 
          if(!UserWise && ParamRef.current){
            ParamRef.current.value = props.SelectRow.parameter ? props.SelectRow.parameter : ''
          }
          
          setparamValid(false);
          setnameValid(false);
          setTypeValid(false);
        }
      }, 500)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.UserDialog])

  useEffect(() => {
    getChannelType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if (!UsersListForLineLoading && !UsersListForLineError && UsersListForLineData) {
        // eslint-disable-next-line array-callback-return
        let NumList=[]
        // eslint-disable-next-line array-callback-return
        UsersListForLineData.map(val=>{
          NumList.push({
            id: val.user_id,
            name: val.userByUserId.name +" ("+val.userByUserId.sgid+")",
            email: val.userByUserId.email,
            mobile: val.userByUserId.mobile,
          })
        })
        setUserNumList(NumList)
        if(props.SelectRow){
          let paramval = props.SelectRow.parameter.split(",")
          
          let selectval =[]
          // eslint-disable-next-line array-callback-return
          paramval.map(val=>{
            let filval=[]
            if(props.SelectRow.type === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6'){ // SMS
              filval = NumList.filter(x=> x.mobile === val)
            }else{
              filval = NumList.filter(x=> x.email === val)
            }
            if(filval.length > 0){
              selectval.push(filval[0])
            }
          })
          if(selectval.length > 0){
            setUserWise(true)
          }else{
            setUserWise(false)
          }
          setSelectedUser(selectval)
          setParamList(paramval)
         
        }
        
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[UsersListForLineLoading, UsersListForLineData, UsersListForLineError])

    const handleUser = (event) => { 
      setSelectedUser(event)
      // eslint-disable-next-line array-callback-return
      let Num = event.map(x=>{
        if(ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6' || ChannelType === '5a58b377-18da-4852-8caa-33d0570eba94'){ // SMS
          return x.mobile 
        }else if(ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' || ChannelType === '98d56817-cf8a-4163-8f19-152d47644607' ||  ChannelType === '272cbef7-6c85-49aa-8146-df59be044835'  ){ // Email
          return x.email 
        }
        else if(ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f' || ChannelType === '1a73df77-90f5-4d42-bc4b-f11b4520004e'){ // Daily Summary - Email ID
          return x.email 
        }
      })
      setParamList(Num)
     
  }

  const handleUserDialogClose = () => {
    props.UserDialogclose(false)
    setChannelType('')
    setUserWise(false)
    setSelectedUser([])
    setParamList([])
    setUserNumList([])
  };

  const handleCreateRoleChange = (e) => {

    setChannelType(e.target.value)
    getUsersListForLine(headPlant.id)
    
    // eslint-disable-next-line array-callback-return
    ChannelTypeData.map(val => {
      if (val.id === e.target.value) {
        if(val.id === '013d0b10-b4f2-4ef1-8804-a2b756684ad2'){ // Teams
          setUserWise(false)
          setParamList([])
        }
      }
    })

    setTimeout(()=>{ParamRef.current.value = ""},500)

  }
  const handleEmailValidation = () => {
    if (UserWise) {
      if (ParamList.length === 0) {
        setparamValid(true);
        return false;
      } else {
        setparamValid(false);
      }
    } else {
      if (!/^\S+@\S+\.\S+$/.test(ParamRef.current.value.toLowerCase())) {
        setparamValid(true);
        return false;
      } else {
        setparamValid(false);
      }
      
    }
    
  };
  
// NOSONAR 
  const clickUserButton = () => {// NOSONAR start -  skip this line
    let regex;
    if (userDialogMode === "delete") {
      getRemoveChannel(props.SelectRow.id, headPlant.id)// NOSONAR start -  skip this line
    }
    else if (userDialogMode === "edit") {
      if (!nameRef.current.value) {
        setnameValid(true)
        return false
      } else { setnameValid(false) }
      if (!ChannelType) {
        setTypeValid(true)
        return false
      } else { setTypeValid(false) }
    
      if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6' || ChannelType === '5a58b377-18da-4852-8caa-33d0570eba94') { // SMS
        if(UserWise){
          if(ParamList.length === 0){
            setparamValid(true) 
            return false   
          }else{
            setparamValid(false)  
          }
        }else{
          if (ParamRef.current.value.length <= 9 ) {
            setparamValid(true) 
            return false 
          }  else{
            setparamValid(false)
          }
        }
         
      } else if (ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' || ChannelType === '98d56817-cf8a-4163-8f19-152d47644607' ||   ChannelType === '272cbef7-6c85-49aa-8146-df59be044835') { // Email
        if(UserWise){
          if(ParamList.length === 0){
            setparamValid(true) 
            return false   
          }else{
            setparamValid(false)  
          }
        }else{
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ParamRef.current.value.toLowerCase())) {
            setparamValid(true);
            return false;
        } else {
            setparamValid(false);
        }
        
        }
        
      } else if (ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f')  { // Daily Summary - Email ID
        handleEmailValidation()

      } else if (ChannelType === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') { // Teams
        let str = ParamRef.current.value;
        // eslint-disable-next-line no-useless-escape
        regex = new RegExp('^(?:http:\/\/|www\.|https:\/\/)([^\/]+)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'); // check whether the url is secure or not
     
        if (!regex.test(str)) {
          setparamValid(true)
          return false;
        } else {
          setparamValid(false)
        }
      }
      getEditChannel(props.SelectRow.id, currUser.id, ChannelType, UserWise ? ParamList.toString() : ParamRef.current.value, nameRef.current.value)
    }
    else if (userDialogMode === "create") {
      if (!nameRef.current.value) {
        setnameValid(true)
        return false
      } else { setnameValid(false) }
      if (!ChannelType) {
        setTypeValid(true)
        return false
      } else { setTypeValid(false) }
  
      if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') { // SMS
         
          if(UserWise){
            if(ParamList.length === 0){
              setparamValid(true) 
              return false   
            }else{
              setparamValid(false)  
            }
          }else{
            if (ParamRef.current.value.length <= 9 ) {
              setparamValid(true) 
              return false 
            }  else{
              setparamValid(false)
            }
          } 
        } else if (ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' ||   ChannelType === '272cbef7-6c85-49aa-8146-df59be044835') { // Email
        if(UserWise){
          if(ParamList.length === 0){
            setparamValid(true) 
            return false   
          }else{
            setparamValid(false)  
          }
        }else{
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ParamRef.current.value.toLowerCase())) {
            setparamValid(true);
            return false;
        } else {
            setparamValid(false);
        }
        
        }
      } else if (ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f') { // Daily Summary - Email ID
        handleEmailValidation()
      } else if (ChannelType === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') { // Teams
        let str = ParamRef.current.value

         // eslint-disable-next-line no-useless-escape
         regex = new RegExp('^(?:http:\/\/|www\.|https:\/\/)([^\/]+)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');  // check whether the url is secure or not
        

          
        if (!regex.test(str)) {
          setparamValid(true)
          return false;
        } else {
          setparamValid(false)
        }
      } 
        getCheckUserExist(nameRef.current.value)

    }

  }
  const checkkeyins = (e) => {
    if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') { // SMS
      if(e.target.value >=9){
      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
      }
    }
  }
  
  let headingText = '';

    if (userDialogMode === "create") {
      headingText = t('Add Channel');
    } else if (userDialogMode === "edit") {
      headingText = t('Edit Channel');
    } else {
      headingText = t('Delete Channel');
    }

    
    let msg = '';

      if (paramValid) {
        if (ChannelType === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') {
          msg = t("URL is not secure so enter a valid URL");
        } else {
          msg = t("Please Select a valid Parameter");
        }
      }

      let label = '';

        if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') {
          label = 'Phone Number*';
        } else if (ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' || ChannelType === '272cbef7-6c85-49aa-8146-df59be044835' ||  ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f' || ChannelType === '1a73df77-90f5-4d42-bc4b-f11b4520004e') {
          label = 'Email*';
        } else {
          label = 'URL';
        }

        let type = '';

          if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') {
            type = 'number';
          } else if (ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' || ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f' || ChannelType === '272cbef7-6c85-49aa-8146-df59be044835'  || ChannelType === '1a73df77-90f5-4d42-bc4b-f11b4520004e') {
            type = 'email';
          } else {
            type = 'URL';
          }

          let placeholder = '';

            if (ChannelType === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') {
              placeholder = t("Enter ") + t('Phone Number');
            } else if (ChannelType === 'aee76d9f-843a-4041-badc-707d54ffcb3e' || ChannelType === '640641c1-fd44-4756-9c55-81be5a75ed3f' || ChannelType === '272cbef7-6c85-49aa-8146-df59be044835' || ChannelType === '272cbef7-6c85-49aa-8146-df59be044835' ||    ChannelType === '1a73df77-90f5-4d42-bc4b-f11b4520004e') {
              placeholder = t("Enter ") + t('Email');
            } else {
              placeholder = t("Enter ") + t('URL');
            }

            let helperText = '';

            if (paramValid) {
              if (ChannelType === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') {
                helperText = t("URL is not secure, so enter a valid URL");
              } else {
                helperText = t("Please Enter a valid Parameter");
              }
            }

            let isDanger = userDialogMode === "delete" ? true : false;
            
            let buttonValue;

              if (userDialogMode === "create") {
                  buttonValue = t('Add');
              } else if (userDialogMode === "edit") {
                  buttonValue = t('Update');
              } else {
                  buttonValue = t('YesDelete');
              }


  return (
    <React.Fragment>
       
          <ModalHeaderNDL>
            <TypographyNDL  variant="heading-02-xs" model value={headingText}/>
            {/* <TypographyNDL variant="paragraph-xs" color="tertiary" value={t("Personalize your factory's identity, location, and business hierarchy ")} />            */}
          </ModalHeaderNDL>
          
          <ModalContentNDL>
            {(userDialogMode === "create" || userDialogMode === "edit") &&
              <>
               

                  <InputFieldNDL
                      id="Name-id"
                      label={t('Name')}
                      placeholder={t("Type here")}
                      inputRef={nameRef}
                      error={nameValid}
                      helperText={nameValid ? t("Please Enter Channel Name") : ''} 
                  />
                  <div className="mt-3"/>
              
                  
             
                  <SelectBox
                    id="Select Channel Type"
                    label={t("Channel Type")}
                    multiple={false}
                    options={!ChannelTypeLoading && ChannelTypeData && !ChannelTypeError ? ChannelTypeData : []} 
                    value={ChannelType}
                    keyValue={"name"}
                    keyId={"id"}
                    onChange={handleCreateRoleChange}
                    error={TypeValid} 
                    msg={TypeValid ? t("Please Select Channel Type") : ''}
                  />
                  <div className="mt-3"/>

                  {ChannelType !== '013d0b10-b4f2-4ef1-8804-a2b756684ad2' && // Teams
                    <div style={{padding:'10px 0'}}>
                      <CustomSwitch
                        id={"switch"}
                        switch={true}
                        checked={UserWise}
                        onChange={() => { setUserWise(!UserWise) }}
                        primaryLabel={t("Single")}
                        secondaryLabel={t("Multiple")}
                        size="small"
                      />
                    </div>
                    }
                  <div className="mt-3"/>

                  {UserWise ?
                 
                  <SelectBox
                    id="select-UserNumList"
                    label={t("Parameter ")}
                    multiple={true}
                    auto
                    options={UserNumList} 
                    value={SelectedUser}
                    keyValue={"name"}
                    keyId={"id"} 
                    onChange={handleUser}
                    error={paramValid}
                    msg={msg} 
                  />
                  :  
                  <InputFieldNDL
                      id="Parameter-id"
                      label={label}
                      type={type}
                      // class={ChannelName === 'sms' ?"your_class":''}
                      placeholder={placeholder}
                      inputRef={ParamRef}
                      error={paramValid}
                      // eslint-disable-next-line no-lone-blocks
                      onChange={(e)=>checkkeyins(e)}                  
                      helperText={helperText} 
                     // onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  />
                  }
                  <div className="mt-3"/>

                  
                  {userDialogMode === "edit" && (
  <TypographyNDL
    variant="paragraph-xs"
    color="secondary"
    value={`${t('Change')} ${props.SelectRow.name} ${t('From')} ${headPlant.name}`}
  />
)}
              </>
            }

            {userDialogMode === "delete" &&
              <TypographyNDL variant="lable-01-s" color="secondary" value={t('Delete Channels') + props.SelectRow.name + t('From') + headPlant.name + t('NotReversible')}/>
            }
          </ModalContentNDL>
          <ModalFooterNDL>
            <Button type="secondary"  value={userDialogMode === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleUserDialogClose()} />
            <Button type="primary"   danger={isDanger} value={buttonValue} onClick={() => clickUserButton()} />
          
          </ModalFooterNDL> 
      </React.Fragment>
    );
} 
const isRender = (prev,next)=>{ 
   
    return prev.UserDialog !== next.UserDialog ? false:true;
} 
export default React.memo(AddChannel,isRender);
