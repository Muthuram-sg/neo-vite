import React, { useEffect, useRef, useState } from "react";
import "components/style/signin.css";
import LogoLight from "assets/LogoLight.svg";
import { useRecoilState } from "recoil";
import { currentPage } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import LoginIllustration from "assets/LoginIllustration.svg";
import Button from "components/Core/ButtonNDL";
import TextInput from "components/Core/InputFieldNDL";
import useChangePassword from "./useChangePassword";
import useNewUserMail from "components/layouts/Settings/UserSetting/hooks/useNewUserMail.jsx"; 
import Logo from 'components/Core/Logo/LogoNDL'; 
import LinkNDL from "components/Core/LinkNDL";
import Eyeopen from "assets/eye.svg";
import Eyeclose from "assets/eye-off.svg"
import AddIcon from 'assets/addIcon.svg?react';
import OKGreen from 'assets/neo_icons/Arrows/green_circle.svg?react';
import OkRed from 'assets/neo_icons/Arrows/red_circle.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import  Login_Illustration from 'assets/Illustration.svg'

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }
  return ComponentWithRouterProp;
}

function ResetPassword(props) {
  const searchParams = props.router.params.id;
  const newPasswordRef = useRef();
  const cnfPasswordRef = useRef();
  const valueRef = useRef();
  const { t } = useTranslation();
  const [, setCurPage] = useRecoilState(currentPage);
  const [incorrectMsg, setIncorrectMsg] = useState({ status: false, msg: "" });
  const [resetDone, setResetDone] = useState(false);
  const [resetFailed, setResetFailed] = useState(false);
  const [passwordVisible, setPasswordvisible] = useState(true);
  const [passwordVisible2, setPasswordvisible2] = useState(true);
  const { cpLoading, cpData, cpError, changePassword } = useChangePassword(); 
  const {mailTriggerLoading, mailTriggerdata, mailTriggererror, newUserMailTrigger} = useNewUserMail();
  const [characterLength,setcharacterLength] = useState(false)
  const [upperCase,setupperCase] = useState(false)
  const [lowerCase,setlowerCase] = useState(false)
  const [containsNumber,setcontainsNumber]  = useState(false)
  const [containsSpacilChar,setcontainsSpacilChar] = useState(false)
  const [DisableButton,setDisableButton] = useState(true)
  const [Timeout,setTimeout] = useState(false); 
  const [linkSec,setlinkSec] = useState(30); 

  let navigate = useNavigate();

  function useInterval(callback, delay) {
      const savedCallback = useRef();

      // Remember the latest callback.
      useEffect(() => {
          savedCallback.current = callback;
      }, [callback]);

      // Set up the interval.
      useEffect(() => {
          function tick() {
              savedCallback.current();
          }
          if (delay !== null) {
              let id = setInterval(tick, delay);
              return () => clearInterval(id);
          }
      }, [delay]);
  }

  useEffect(() => {
    setCurPage(t('ResetPassword'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => { 
    if (!cpLoading && !cpError && cpData) { 
      setTimeout(true)
      setResetDone(true)
      setResetFailed(false)
      setIncorrectMsg({ status: false, msg: "" });
    } 
    else if (!cpLoading && cpError && cpData) {
      setIncorrectMsg({ status: true, msg: cpData });
      setResetDone(false)
      setResetFailed(true)
    }
    else if (!cpLoading && cpError && !cpData) {
      setIncorrectMsg({ status: true, msg: t("invToken") });
      setResetDone(false)
      setResetFailed(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpLoading, cpData, cpError]);

   
  const backtosignin = () => {
    navigate("/login")
  };
  const validatePassword = (password) => {
    return String(password)
      .match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/
        // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/
      );
  };
  
  const changePasswordClick = async () => {
    let newPassword = newPasswordRef.current.value
    let cnfPassword = cnfPasswordRef.current.value
    if (!searchParams) {
      setResetDone(false)
      setResetFailed(false)
      setIncorrectMsg({ status: true, msg: t("invToken") });
    }
    else if (newPassword.length > 0 && cnfPassword.length > 0  ) {
      if (newPassword !== cnfPassword) {
        setResetDone(false)
        setResetFailed(false)
        setIncorrectMsg({ status: true, msg: t("newcnfNM") });
      }
      else if (validatePassword(cnfPassword)){
        await changePassword(newPassword, cnfPassword, searchParams);
      }
      
      else {
        setResetDone(false)
        setResetFailed(false)
        setIncorrectMsg({ status: true, msg: t("passformat") });
      }
    }
    
    else {
      setResetDone(false)
      setResetFailed(false)
      setIncorrectMsg({ status: true, msg: t("plsFill") });
    }
  }
  const togglePasswordVisibility = () => setPasswordvisible((show) => !show);
  const togglePasswordVisibility2 = () => setPasswordvisible2((show) => !show);

const validationCheck=()=>{
  const inputString = newPasswordRef.current.value
  const  containsUpperCase = /[A-Z]/.test(inputString);
  const containsLowerCase = /[a-z]/.test(inputString);
  const containsNumber = /\d/.test(inputString);
  const containsSpecialCharacters = /[,!@#$%^&*]/.test(inputString);


  console.log(inputString.length,'inputString')
  if(inputString.length >= 8){
    setcharacterLength(true)
  }else{
    setcharacterLength(false)

  }
  if(containsUpperCase){
  setupperCase(true)
  }else{
  setupperCase(false)
  }
  if(containsLowerCase){
    setlowerCase(true)
  }else{
    setlowerCase(false)
  }
 
if (containsNumber) {
 setcontainsNumber(true)
} else {
  setcontainsNumber(false)

}


if (containsSpecialCharacters) {
  setcontainsSpacilChar(true)
} else {
  setcontainsSpacilChar(false)

}

}
const disableButton=(e)=>{
  if(newPasswordRef.current.value === e.target.value ){
    setDisableButton(false)
  }else{
    setDisableButton(true)

  }
}

useInterval(() => {
  // Your custom logic here  
    if(linkSec === 0){
      setTimeout(false)
      navigate("/login")
      setlinkSec(30)
    }else{
      setlinkSec(linkSec -1)
    }
   
  
}, Timeout ? 1000 : null);

  return (
    <>
  <div className={`h-screen flex flex-col   bg-gray-100   bg-cover bg-no-repeat`}  style={{ backgroundImage: `url(${Login_Illustration})` }}>
      {/* Left Side: Form Section */}
      <div className="flex flex-col h-[573px] justify-center w-full max-w-md  mx-auto my-auto bg-white border border-Border-border-100 dark:bg-white  dark:border-Border-border-dark-100   p-12 rounded-[32px]">
        {/* Logo */}
        <div className="justify-left">
            <Logo src={LogoLight} alt="logo" width={98.33} className="mb-4" ></Logo>
            <div className="flex flex-col gap-2">

            </div>
            <TypographyNDL variant='heading-02-lg'>{resetDone ? 'Password Successfully Changed': t("ResetPassword")}</TypographyNDL>
               <TypographyNDL variant='paragraph-xs' color='tertiary' >{resetDone ? t("PassCHNG"):t("hereresetpwd")}</TypographyNDL>
              <div className="mb-8"></div>
              {!resetDone &&
              <div style={{alignItems: "center",position: "relative"}}>
              <div>
              <TextInput
                label={t("NewPassword")}
                placeholder={t("NewPassword")}
                type={passwordVisible  ? "password" : 'text'}
                inputRef={newPasswordRef}
                onChange={validationCheck}
              />
              </div>
               <div style={{position: "absolute",left:"87%",top:'44%'} }>                                            
                          <img src={passwordVisible ? Eyeclose: Eyeopen} 
                          // classname='absolute top-[50%] right-[10px] translate-y-[-50%] text-base cursor-pointer' alt="Toggle Password Visibility"
                          onClick={togglePasswordVisibility}
                           />
                        </div>
              </div>}
              <div className="mb-4"></div>
              {!resetDone &&
              <div style={{alignItems: "center",position: "relative"}}>
                <div>

              <TextInput
                label={t("ConfirmPassword")}
                placeholder={t("ConfirmPassword")}
                type={passwordVisible2  ? "password" : 'text'}
                inputRef={cnfPasswordRef}
                onChange={disableButton}
              />
                </div>
                <div style={{position: "absolute",left:"87%",top:'44%'} }>                                            
                  <img src={passwordVisible2 ? Eyeclose: Eyeopen} 
                  // classname='absolute top-[50%] right-[10px] translate-y-[-50%] text-base cursor-pointer' alt="Toggle Password Visibility"
                  onClick={togglePasswordVisibility2}
                    />
                </div>
              </div>}
              <div className="mb-4"></div>
              <Button
                onClick={resetDone ? backtosignin : changePasswordClick}
                loading={cpLoading}
                disabled={DisableButton}
                variant="primary" 
                style={{width:"100%"}}              
                value={resetDone ?  `${t("Back")} to ${t("Signin")}`:t("Reset")}
              />
                 <div className="mt-4"></div>
              {Timeout &&
                  <TypographyNDL variant='label-01-s'>{t("Back to Login in")} <span className="text-[14px] leading-4 font-geist-mono " style={{color:'rgba(15, 111, 255, 1)'}}>00:{linkSec} sec</span></TypographyNDL>}
                 
              {/* {resetDone && (
                <div>
              <p class="text-sm font-geist-sans text-success mt-2">{t("PassCHNG")}              
              </p>
              <p class="no-underline cursor-pointer font-geist-sans text-primary ml-5"><LinkNDL path="#" text={t("clickhere")} onClick={backtosignin} /></p>
              </div>
              )
              // <a href="javascript:void(0)" class="" id="reset-password" onClick={backtosignin}>{t("clickhere")}</a>
              } */}
             
              {resetFailed && <p className="text-[12px]  font-geist-sans  leading-[14px] text-Text-text-error mt-0.5">{t("PassRSFail")}</p>}
              {incorrectMsg.status && <p className="text-[12px]  font-geist-sans  leading-[14px] text-Text-text-error mt-0.5" >{incorrectMsg.msg}</p>}
              {!resetDone &&
             <div className="mt-auto">
              <div className="flex items-baseline gap-2  ">
              <div >

                {
                  !characterLength ? 
                  <OkRed />
                  :
                  <OKGreen />

                }
                </div>
              
                <TypographyNDL value='At least 8 characters long' variant='label-01-s' color = {!characterLength ? 'danger' :'success'} />
              </div>
              <div className="flex items-baseline gap-2  ">
              <div >
              {
                  !upperCase ? 
                  <OkRed />
                  :
                  <OKGreen />

                }
                </div>
                <div className="whitespace-nowrap" >
                <TypographyNDL value='Contains at least one uppercase letter ' variant='label-01-s' color = {!upperCase ? 'danger' :'success'} />

                </div>
              </div> 
              <div className="flex items-baseline gap-2 ">
              <div >

              {
                  !lowerCase ? 
                  <OkRed />
                  :
                  <OKGreen />

                }
                </div>
                <div className="whitespace-nowrap" >

                <TypographyNDL value='Contains at least one lowercase letter' variant='label-01-s' color = {!lowerCase ? 'danger' :'success'} />
           </div>
              </div> 
              <div className="flex items-baseline gap-2 ">
              <div >

              {
                  !containsNumber ? 
                  <OkRed />
                  :
                  <OKGreen />

                }
                </div>
                <div className="whitespace-nowrap" >

                <TypographyNDL value='Contains at least one number' variant='label-01-s' color = {!containsNumber ? 'danger' :'success'} />
           </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
              <div >

              {
                  !containsSpacilChar ? 
                  <OkRed />
                  :
                  <OKGreen />

                }
                </div>
                <div className="whitespace-nowrap" >

                <TypographyNDL value='Contains atleast one special character' variant='label-01-s' color = {!containsSpacilChar ? 'danger' :'success'} />
              </div>
             </div>
             <div className="flex items-baseline gap-2  ">
                <div style={{width:"16px",height:"16px"}} />
                <TypographyNDL value='(e.g.,!@#$%^&*)' variant='label-01-s' color = {!containsSpacilChar ? 'danger' :'success'} />
              </div>
             </div>}
            </div>
          </div>
          <div className="text-center flex flex-col gap-0.5 mt-auto mr-auto ml-auto items-center whitespace-nowrap">

{/* <p class="text-sm text-gray-600">{t("Emailsulpport")}<br /><a href="mailto:UINGEN.NEOSupport@saint-gobain.com" class="no-underline cursor-pointer text-sm" id="reset-password">{'UINGEN.NEOSupport@saint-gobain.com'}</a></p> */}
<AddIcon />

<TypographyNDL variant='paragraph-s'  color='tertiary'>© Copyright Saint-Gobain, {new Date().getFullYear()}</TypographyNDL>
</div>
<div className="mt-4" />
        </div>

    </>
  );
}
export default withRouter(ResetPassword);
