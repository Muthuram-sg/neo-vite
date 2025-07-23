import React, { useState,useRef } from "react";
import "components/style/signin.css"; 
import Typography from "components/Core/Typography/TypographyNDL";
import TextField from "components/Core/InputFieldNDL";
import Select from "components/Core/DropdownList/DropdownListNDL"; 
import Grid from 'components/Core/GridNDL'
import useGetTheme from 'TailwindTheme'; 
import LogoLight from 'assets/LogoLight.svg?react'; 
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"; 
import configParam from "../../config";
import { useTranslation } from "react-i18next";
import LoginIllustration from "assets/LoginIllustration.svg";  
import PrimaryButton from 'components/Core/ButtonNDL'; 
import KeyboardArrowDownIcon from 'assets/neo_icons/Arrows/boxed_down.svg?react';

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

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
function Signin(props) { 
  const { t } = useTranslation();  
  const [curTheme] = useRecoilState(themeMode);    
  const [notMatch, setNotMatch] = useState(false);
  const [resetDone,setResetDone] = useState(false); 
  const [invalidMail,setInvalidMail] = useState(false);  
  const [invalidLine, setInvalidLine] = useState(false);
  const theme = useGetTheme(); 
  const mail = useRef(); 
  const line = useRef();
  const classes = {
    submit: {
      width: 283,
      margin: 1,
    },
    progress: {
      margin: 1,
    },
    main: {
      height: "100vh",
      backgroundColor:
        curTheme === "light"
          ? theme.palette.background.grey
          : theme.palette.background.dark,
    },
    neoLogo: {
      width: 100,
      height: 32,
      marginBottom: 32,
    },
    sgLogo: {
      width: 90,
      height: 40,
    },
    loginBox: {
      background:
        curTheme === "light"
          ? theme.palette.background.white
          : theme.palette.background.dark,
      // textAlign: "center",
      borderRadius: 4,
      borderColor:
        curTheme === "light"
          ? theme.palette.border.grey
          : theme.palette.border.dark,
    },
    bottomLogo: {
      position: 'absolute',
      bottom: 0,
      left: 110,
      margin: "0 auto",
      textAlign: "center",
    },
    support: {
      position: 'absolute',
      bottom: 80,
      left: 100,
      margin: "0 auto",
      textAlign: "center",
    },
    supportMail: {
      position: 'absolute',
      bottom: 60,
      left: 80,
      margin: "0 auto",
      textAlign: "center",
    },
    signin: {
      fontSize: 28,
      lineHeight: "40px",
      fontWeight: 600,
      color: theme.palette.secondaryText.main,
      marginBottom: 32,
    },
    bg: {
      backgroundColor: "#FCFCFC",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${LoginIllustration})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    troubleLogin: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "18px",
      color: theme.palette.secondaryText.main,
      marginBottom: 32,
      textAlign: "left",
    },
    label:{
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 5
    },
    sentMail:{
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "18px",
      color: theme.palette.secondaryText.main,
      marginBottom: 32,
      textAlign: "left",
    },
    list: theme.list
  }
  /*enter key event while loggin in */
  const enterPressed = (e) => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      requestForAccess();
    }
  };
  
 
  const handleMail = async () =>{
    if(invalidMail)
     setInvalidMail(false);
  } 
  const handleLine = async () =>{
    if(invalidLine)
     setInvalidLine(false);
  } 

  function ResetPasswordAPI(param){
    let url = configParam.AUTH_URL + "/password/reset/";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ 
        new_password_repeat : param
      }),
      redirect: "follow",
    };
    fetch(url, requestOptions)
    .then((response) =>
      response.status === 200 ? response.json() : response
    )
    .then((result) => { 
      setResetDone(true);
      setNotMatch(false);
    })
    .catch((error) => {
      setNotMatch(true);
    });
  }
  
  const verifyMail = async () =>{
    const mails = mail.current.value;  
    if(!mails){
      setInvalidMail(true);
      return false
    }  
    ResetPasswordAPI(mails)  
    
  } 

  const requestForAccess = async () =>{
    const lineVal = line.current.value;
    const mails = mail.current.value;  
    if(!mails){
      setInvalidMail(true);
      return false
    }    
    if(!lineVal){
        setInvalidLine(true);
        return false;
    }
    ResetPasswordAPI(mails)
    
  } 
  
  return (
    <Grid
      container
      component="main"
      className={classes.main}
      onKeyPress={enterPressed}
    >
      {/* LOGIN */}
      <Grid
        item
        xs={5}
        sm={4}
        md={4}
        xl={3}
        lg={4}
        className={classes.loginBox}
      >
        <Grid item xs={12}>
          {/* LOGIN FORM */}
          <div>
            {/* NEO LOGO */}
            <Grid item xs={12}>
              <LogoLight className={classes.neoLogo} />
            </Grid>
            {/* SIGNIN HEADING */}  
            <Grid item xs={12}> 
                <Typography className={classes.signin}>
                Request Access
                </Typography>
            </Grid>
            <Grid item xs={12}> 
            <Typography className={classes.troubleLogin}>
                {resetDone?"Please select the line you world like access to, we will email ou details of the line administratory, whom you can contact for support":"Please enter your Saint-Gobain ID or email"}
            </Typography> 
            </Grid>
            <Grid container>
            <Grid item xs={12}>                          
                 
                <TextField
                            id="sgid"
                            label={t('Saint-Gobain ID (SG-ID) or Email')}
                            placeholder={t('SGID')}
                            inputRef={mail}
                            error={invalidMail}
                            helperText={invalidMail ? t("TypeEmail") : ''}
                            onFocus={handleMail}
                            // onChange={(e)=>{ Validate(e.target.value)}}
                             type="text"
                        /> 
                {
                    notMatch && (<Typography
                    style={{
                        marginTop: 25,
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: "15px",
                        color: "#FF0D00",
                        marginBottom: "5px",
                    }}
                    
                    value={t("Sorry! We couldn't find an account with that user ID/email address.")}
                    />)
                }
            </Grid>  
            {
                !resetDone?(
                    <Grid item xs={12}>                
                    <PrimaryButton style={{width: 283}} value={t('Continue')} onClick={verifyMail}/> 
                    </Grid>
                ):( 
                    <>
                        <Grid item xs={12}>
                            <div style={{width: 283 }} >
                                <label className={classes.label} style={{marginBottom: -10}}>Select Line</label>       
                                <Select
                                    inputRef={line}
                                    size="small"
                                    disableUnderline={true}
                                    labelId="dashboardSelectLbl"
                                    id="dashboardSelect" 
                                    label={t('Dash')}
                                    displayEmpty 
                                    IconComponent={KeyboardArrowDownIcon}
                                    error={invalidLine} 
                                    onChange={handleLine}
                                    MenuProps={{
                                        classes: {
                                        list: classes.list,
                                        },
                                        anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "center"
                                        },
                                        transformOrigin: {
                                        vertical: "top",
                                        horizontal: "center"
                                        },
                                        getContentAnchorEl: null
                                    }}>
                                    <li value={0}> Select Line </li> 
                                </Select>     
                                {invalidLine && (<span>Select a line</span>)}                                
                            </div>
                        </Grid>
                        <Grid item xs={12}>                
                        <PrimaryButton style={{width: 283}} value={t('access')} onClick={requestForAccess}/> 
                        </Grid>
                        <Grid item xs={12}>                
                        <PrimaryButton style={{marginTop: 10,width: 283}} value={'Get Admin Contact Info'} onClick={verifyMail}/> 
                        </Grid>
                    </>
                )
            } 
            </Grid>  
          </div>
        </Grid> 
        {/* COPYRIGHT */}
        <Grid item xs={12} sm={12}>
          <div p={4} className={classes.support}>
            <Typography
              variant="label-02-s"
              align="center"
              style={{
                color:
                  curTheme === "light"
                    ? theme.palette.secondaryText.main
                    : theme.palette.background.white,
                  fontSize: 12,
                  fontWeight: 500
              }}
                          
              value={t("Emailsulpport")}
            />
              </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div p={4} className={classes.supportMail}>
            <Typography
              variant="label-02-s"
              align="center"
              style={{
                color:'#4B93FF',
                fontSize: 12,
                fontWeight: 500
              }}
                          
              value={'UINGEN.NEOSupport@saint-gobain.com'}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div p={4} className={classes.bottomLogo}>
            <Typography
              variant="label-02-s"
              align="center"
              style={{
                color:
                  curTheme === "light"
                    ? theme.palette.secondaryText.main
                    : theme.palette.background.white,
                  fontSize: 12,
                  fontWeight: 500
              }}
            
             vlaue= {('Copyright&nbsp; © ' + new Date().getFullYear()+'&nbsp;'+
              t("SaintGobain"))}
            />
          </div>
        </Grid>
      </Grid>

      {/* BG */}
      <Grid
        item
        xs={7}
        sm={8}
        md={8}
        lg={8}
        xl={9}
        className={classes.bg}
        id="bg"
      ></Grid> 
    </Grid>
  );
}
export default withRouter(Signin);