import React, { useEffect, useRef, useState } from "react";
import "components/style/signin.css";
import LogoLight from "assets/LogoLight.svg";
import decode from "jwt-decode";
import { useRecoilState } from "recoil";
import { decodeToken, currentPage, isLogin,snackType,snackMessage,snackToggle,snackDesc } from "recoilStore/atoms";
import { useAuth } from "components/Context";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import LoginIllustration from "assets/LoginIllustration.svg";
import  Login_Illustration from 'assets/Illustration.svg'
import Button from "components/Core/ButtonNDL";
import TextInput from "components/Core/InputFieldNDL";
import useLogin from "./useLogin";
import useTroubleLogin from "./useTroubleLogin";
import Logo from 'components/Core/Logo/LogoNDL';
import LinkNDL from "components/Core/LinkNDL";
import AddIcon from 'assets/addIcon.svg?react';
import Eyeopen from "assets/eyes.svg";
import Eyeclose from "assets/eye-off.svg"
import moment from "moment";
import Typography from 'components/Core/Typography/TypographyNDL'
import configParam from 'config';
import Toast from "components/Core/Toast/ToastNDL";
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
function Signin() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const valueRef = useRef();
  const baseUrl = window.location.hostname;
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [message, setSnackMessage] = useRecoilState(snackMessage);
  const [type, setType] = useRecoilState(snackType);
  const [openSnack, setOpenSnack] = useRecoilState(snackToggle);
 
  const { t } = useTranslation();
  const [incorrectMsg, setIncorrectMsg] = useState({ status: false, msg: "" });
  const [incorrectMsg1, setIncorrectMsg1] = useState({ status: false, msg: "" });
  const [incorrectMsg2, setIncorrectMsg2] = useState({ status: false, msg: "" });
  const [SnackDesc, setSnackDesc] = useRecoilState(snackDesc);
  const [resetPassword, setResetPassword] = useState(false);
  const [passwordVisible, setPasswordvisible] = useState(true);
  const [, setUserLogin] = useRecoilState(isLogin);
  const [, setCurPage] = useRecoilState(currentPage);
  const { loginLoading, loginData, loginError, userLogin } = useLogin();
  const { troubleLoading, troubleData, troubleError, troubleLogin } = useTroubleLogin();
  const { authTokens, setAuthTokens } = useAuth();
  const [, setToken] = useRecoilState(decodeToken);
  const [linkSent, setLinkSent] = useState(false); 
  const [linkSec,setlinkSec] = useState(30); 
  const [Timeout,setTimeout] = useState(false); 
  const [WaitingT,setWaitingT]= useState(null); 
  const [TimerMode,setTimerMode] = useState('sec') 
  let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'plantschema' 
  const refresh_token = localStorage.getItem('refresh_token');
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [invalid, setinvalid] = useState(false);
  const maxTries = 5;
  const freeTrials = 3;
  // let gotoAccess= localStorage.getItem("gotoAccess");
  let location = "/"+plantSchema+"/routehandler";
  
  // if(gotoAccess){
  //    location = "/"+plantSchema+ gotoAccess;
  // }

  let navigate = useNavigate();

  // LOGOTYPE Function
  function Logo({ src, alt, width, className }) {
    return <img src={src} alt={alt} width={width} className={className} />;
  }
  const logoProps = configParam.LOGOTYPE(baseUrl);

 

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
    setCurPage(t('Signin'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loginLoading && !loginError && loginData && loginData["access_token"]) {
      console.log(loginData,"loginDataLink")

      setToken(decode(loginData["access_token"]));
      setAuthTokens(loginData["access_token"]);
      setUserLogin(true);
      localStorage.setItem("refresh_token", loginData["refresh_token"]);
      localStorage.setItem("neoToken", loginData["access_token"]);
      let loc = localStorage.getItem('location')
    
      if(loc){
        navigate(loc)
      }
      else{
        navigate(location)
        // localStorage.removeItem("gotoAccess")
      }
     
    } else {
      if (!loginLoading && !loginError && loginData && loginData["redirect_link"]) {
          navigate(loginData["redirect_link"])
      }
      if (!loginLoading && loginError && loginData && (loginData.hasOwnProperty("incorrect credentials") || loginData === 'incorrect credentials')) {
        setIncorrectMsg({ status: true, msg: t("InvalidCred") });
      }
      if(!loginLoading && loginError && loginData && (loginData === 'User not Found')){
        setIncorrectMsg1({ status: true, msg: "The SGID or email ID you entered is invalid or not found, Please try again" });
      }
      if (!loginLoading && loginError && loginData && loginData.hasOwnProperty("No Access")) {
        setIncorrectMsg({ status: true, msg: t("LoginAccessFailed") });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginLoading, loginData, loginError, authTokens]);

  useEffect(() => {
    if (!loginLoading && loginError && loginData && loginData.hasOwnProperty("failed_login_count")) {
      setIncorrectCount(loginData["failed_login_count"])
      if (incorrectCount >= maxTries) {
        setinvalid(true);
        setIncorrectMsg2({ status: true, msg: "User login is blocked for 24 hours due to maximum number of sign-in attempts,If you've forgotten your password, you can reset it at any time." });
        
        let FDate = moment(moment(loginData.failed_login_timestamp).add(24,'hour')).format('YYYY-MM-DDTHH:mm:ss')
        let TimeRemain = moment(FDate).diff(moment(),'seconds') 
        let actualT = moment.utc(TimeRemain*1000).format('YYYY-MM-DDTHH:mm:ss')
        if(new Date(FDate).getTime() > new Date().getTime()){
          setWaitingT(actualT)
        }else{
          setWaitingT(null)
        } 
        setTimeout(true)
        setTimerMode('hour')
        // console.log(new Date(FDate),TimeRemain,"TimeRemainTimeRemain",FDate,moment().diff(moment(FDate),'seconds') )
      } else if (incorrectCount >= freeTrials && incorrectCount < maxTries) {
        const triesLeft = maxTries - incorrectCount;
        setIncorrectMsg2({ status: true, msg: t("The password is incorrect, you have only ") + triesLeft + t(" tries left.") });
      } else {
        setIncorrectMsg2({ status: true, msg: t("The password you entered is incorrect. Please try again or reset your password if you've forgotten it.") });
      }
    } else if (!loginLoading && loginError && loginData && loginData.hasOwnProperty("code")) {
      if (loginData.message === "Access Blocked" && loginData.code === 1) {
        setIncorrectMsg2({ status: true, msg: "Your account has been temporarily blocked due to multiple unsuccessful login attempts.  Please try login after 24 hours, or contact support for further assistance." });
      }
    }
  }, [loginLoading, loginData, loginError, incorrectCount]);

  useEffect(() => {
    if (!troubleLoading && !troubleError && troubleData) {
      if (troubleData === '"Sent reset mail"') {
        setLinkSent(true);
        setIncorrectMsg({ status: false, msg: "" });
        setTimeout(true)
        setTimerMode('sec')
      }
      else {
        setIncorrectMsg({ status: true, msg: t("InvalidCred") });
        setLinkSent(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [troubleLoading, troubleData, troubleError]);
  useEffect(() => {
    if (authTokens && authTokens !== 'undefined' && refresh_token && refresh_token !== 'undefined') {
      navigate(location)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens]);
  const callResetPassword = () => {
    setResetPassword(true);  
    setIncorrectMsg({ status: false, msg: "" });
    setIncorrectMsg1({ status: false, msg: "" });
    setIncorrectMsg2({ status: false, msg: "" });
  };
  const backtosignin = () => {
    setResetPassword(false);
    setLinkSent(false);
    setTimeout(false)
    setWaitingT(null)
    setinvalid(false);
    setIncorrectMsg({ status: false, msg: "" });
    setIncorrectMsg1({ status: false, msg: "" });
    setIncorrectMsg2({ status: false, msg: "" });
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Enter' || event.code === "NumpadEnter") {
      if (!resetPassword && !invalid) {
        // Sign in when Enter is pressed in the input field
        signInButtonClick();
      } else {
        // Trigger troubleSignin when Enter is pressed in the input field
        troubleSignin();
      }
    }
  };
 



  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
  
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOffline]);

  const handleOffline = () => {
    setIsOffline(true);
    setType("Error");
    setOpenSnack(true);
    setSnackMessage(
      <>
        No Internet Connection <br />
        Looks like you're offline! Check your internet connection to continue.
      </>
    );
    setSnackDesc("")
  };


  const handleOnline = () => {
    setIsOffline(false);
    setType("success");

    setSnackMessage("Connection is back! You can continue working seamlessly");
    setSnackDesc("")

    setTimeout(() => {
      setOpenSnack(true);

    }, 100); 
  };

  const signInButtonClick = async () => {
    // console.log("isOffline",isOffline)
    if (isOffline) {
      setSnackMessage("No Internet Connection. Please check your network.");
      setOpenSnack(true);
    }
else{
  let user = usernameRef.current.value
  let pass = passwordRef.current.value
  if (!user) {
    setIncorrectMsg1({ status: true, msg: "SGID or Email is required. Please enter your SGID or email address." });
  }else{
    setIncorrectMsg1({ status: false, msg: "" });

  }

   if(!pass){
    setIncorrectMsg2({ status: true, msg: "Password is required. Please enter your password." });
  }else{
    setIncorrectMsg2({ status: false, msg: "" });

  }

  // else if (pass.length === 0) {
  //   setIncorrectMsg({ status: true, msg: "Please Enter Password" });
  // }
  // else if (user.length === 0 && pass.length === 0) {
  //   setIncorrectMsg({ status: true, msg: t("Please Enter User ID and Password") });
  // }
  if(user && pass) {
    console.log("XUXMXMXM")
    await userLogin(usernameRef.current.value, passwordRef.current.value);
  }

  }

// }
   
  };

  const validateEmail = (email) => {
    
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const troubleSignin = async () => {
    let mailID = usernameRef.current.value
    if (mailID.length > 0) {
      if (mailID.length > 0) {
        if (isNaN(mailID.charAt(0)) && !isNaN(mailID.substring(1)) && mailID.length === 8) {
          setResetPassword(false);
          window.open("https://forgetpassword.extranet.saint-gobain.com/", "WindowName", "noopener");
        }

        else if (validateEmail(mailID)) {
          let SGmail = mailID.split("@") 
          if(SGmail[1].toLowerCase() === 'saint-gobain.com'){
            setResetPassword(false);
            window.open("https://forgetpassword.extranet.saint-gobain.com/", "WindowName", "noopener");
          }else{
            await troubleLogin(mailID);
          }
        }
        else {
          setIncorrectMsg({ status: true, msg: t("InvalidCred") });
        }
      }
    }
    else {
      setIncorrectMsg({ status: true, msg: t("plsFill") });
    }
  }

  useInterval(() => {
      // Your custom logic here  
      if(TimerMode === 'sec'){
        if(linkSec === 0){
          setTimeout(false)
          setlinkSec(30)
        }else{
          setlinkSec(linkSec -1)
        }
      }else{
        if(WaitingT && moment(WaitingT).format('HH:mm:ss') !== '00:00:00'){
          setWaitingT(moment(WaitingT).subtract(1,'second').format('YYYY-MM-DDTHH:mm:ss'))
        }else{
          setTimeout(false)
          setWaitingT(null)
          setinvalid(false);
          setIncorrectMsg({ status: false, msg: "" });
        }
      }
      
  }, Timeout ? 1000 : null);

  const togglePasswordVisibility = () => setPasswordvisible((show) => !show);
  // const handleInputChange = (e) => {
  //   setResetPassword(e.target.value);
  // };
  

  return (
 
    <div className={`h-screen flex flex-col   bg-gray-100   bg-cover bg-no-repeat`}  style={{ backgroundImage: `url(${Login_Illustration})` }}>

      {/* Left Side: Form Section */}
      <div className="flex flex-col h-[573px] justify-center w-full max-w-md  mx-auto my-auto bg-Background-bg-primary dark:bg-Background-bg-primary-dark border border-Border-border-100   dark:border-Border-border-dark-100   p-12  rounded-[32px]">
        {/* Logo */}
        <div className="flex justify-left">
        <Logo
        src={logoProps.src}
        alt={logoProps.alt}
        width={98.33}
        className="mb-4"
      />
                </div>
                <div className="flex flex-col gap-2">
                <Typography variant='heading-02-lg' style={{color:"#202020"}}>{resetPassword ? t("TroubleSign") : "Hello Again!"}</Typography>
                <Typography variant='paragraph-s' color='tertiary' >{resetPassword ? t("ResetPasswordLink") :`Log In to your ${logoProps.text}  to access your Industrial Insights`}</Typography> 
                </div>
                
              <div className="mb-8"></div>
              <TextInput
                    id="loginmail"
                    label="Saint-Gobain ID or Email"
                    placeholder="SGID or Email"
                    type="text"
                    autoComplete
                    inputRef={usernameRef}
                    
              />
              {linkSent &&
                <div class="one-line-no-break">
                 
                  {Timeout &&
                
                <p class="text-gray-600 font-medium text-[14px] leading-[16px] py-2">
                {"Resend Link in"} <span style={{color:'rgba(15, 111, 255, 1)'}}>00:{linkSec} sec</span>
              </p>}
                  <p class="text-sm text-gray-600 flex" style={{fontSize:'12px',alignItems: 'center'}}>If you didn’t receive email, {<LinkNDL disabled={Timeout} style={{fontSize:'12px',padding:3}} path="#" text={t("Click here")} onClick={troubleSignin} />} here to resend the reset link.</p>
                  <Button
              style={{ marginTop: 16, width: "100%" }}
                    onClick={backtosignin}
                    type="secondary"
                    value={`${t("Back")} to ${t("Signin")}`}
                  />
                </div>
              }
              {!linkSent &&
                <React.Fragment>
                  

                  {incorrectMsg.status  && resetPassword && (
                  <p className="text-[12px] font-geist-sans leading-[14px] text-Text-text-error mt-0.5" >
                    {incorrectMsg.msg}
                  </p>
                  )}
                  {incorrectMsg1.status  && (
                    <p className="text-[12px]  font-geist-sans  leading-[14px] text-Text-text-error mt-0.5" >
                      {incorrectMsg1.msg}
                    </p>
                  )}
             
                  <div className="mb-4"></div>
                  {resetPassword ?
                    <React.Fragment>
                      <Button
                        onClick={troubleSignin}
                        loading={troubleLoading}
                        type="primary"
                        value={t("Continue")}
                      />
                  <div className="mb-4"></div>
                      <Button
                        onClick={backtosignin}
                        type="secondary"
                        value={`${t("Back")} to ${t("Signin")}`}
                      />
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <div style={{alignItems: "center",position: "relative"}}>
                        <div>
                          <TextInput

                            id='loginPassword'
                            label={t("Password")}
                           
                            placeholder={t("Password")}
                            type={passwordVisible  ? "password" : 'text'}

                            passwordVisible={passwordVisible}
                            inputRef={passwordRef}
                            onChange={(e)=>{passwordRef.current.value=e.target.value.trim()}} 
                            onKeyDown={handleKeyDown} 
                          />
                          
                        </div>
                        
                     
                        
                  
                        <div style={{position: "absolute",right:"10px",top:'22px'} }>                                            
                          <img src={passwordVisible ? Eyeclose: Eyeopen} 
                          // classname='absolute top-[50%] right-[10px] translate-y-[-50%] text-base cursor-pointer' alt="Toggle Password Visibility"
                          onClick={togglePasswordVisibility}
                           />
                        </div>
                      </div>
        {incorrectMsg2.status  && (
          <p className="text-[12px]  font-geist-sans  leading-[14px] text-Text-text-error mt-0.5">
            {incorrectMsg2.msg}
          </p>
        )}
                      <div className="mb-4"></div>
                      <Button
                        onClick={signInButtonClick}
                        loading={loginLoading}
                        variant="primary"
                        value={t("Signin") + (invalid ? " ["+moment(WaitingT).format('HH:mm:ss')+"]" : '')}
                        // value={'gff'}
                        disabled={invalid ? invalid : false}
                      />


                    </React.Fragment>
                  }
                </React.Fragment>
              }
              {
                !resetPassword && 
                <p className="mt-4" >
                {incorrectMsg.status && <p className="text-[12px]  font-geist-sans  leading-[14px] text-Text-text-error mt-0.5" >{incorrectMsg.msg}</p>}
              </p>

              }
             
              {!resetPassword && <p class="flex justify-end text-[14px] pt-2.5 leading-4"><LinkNDL path="#" text={t("Forgot Password?")} onClick={callResetPassword} /></p>}
              {/* {resetPassword &&
            <div className="text-center flex flex-col gap-0.5 mt-4 items-center whitespace-nowrap" > 

                <p class="text-sm text-gray-600">
                  {t("Emailsulpport")}
                  <br /><a href="mailto:UINGEN.NEOSupport@saint-gobain.com" class="no-underline cursor-pointer text-sm" id="reset-password" style={{ color: '#0F6FFF' }}>{'UINGEN.NEOSupport@saint-gobain.com'}</a>
                 </p>
                </div>
              } */}
            </div>
            <div className="text-center flex flex-col gap-2 mt-auto mr-auto ml-auto items-center whitespace-nowrap pb-4" > 
              {/* <AddIcon  style={{marginTop:30}}/> */}
                <AddIcon />
                <Typography variant='paragraph-s'  color='tertiary' >© Copyright Saint-Gobain, {new Date().getFullYear()}</Typography>
              </div>
        
      <Toast type={type}  WolrdIcon timer={6000} discriptionText={SnackDesc} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
     
              {/* <div className="mb-4" /> */}
          </div>
          
          
 
  );
}
export default withRouter(Signin);







