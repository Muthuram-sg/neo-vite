/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { NavLink,useNavigate,useParams } from "react-router-dom"; 
import useGetTheme from 'TailwindTheme';  
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Typography from 'components/Core/Typography/TypographyNDL'; 
import moment from 'moment';
import i18n from "i18next";
 
import Button from 'components/Core/ButtonNDL';
import { useRecoilState } from "recoil";
import { user, userData, userInitial, hrms, currentPage, appLanguage,themeMode} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next'; 
import 'moment/locale/fr';
import 'moment/locale/de';
import configParam from "../../config"; 
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import AccountLight from 'assets/neo_icons/Menu/account.svg?react';
import RatingLight from 'assets/neo_icons/Notification/apprating.svg?react';
import IconFlagUK from 'assets/neo_icons/Menu/icon-flag-UK.svg?react';
import IconFlagFR from 'assets/neo_icons/Menu/Flag_of_France.svg?react';
import IconFlagDE from 'assets/neo_icons/Menu/Flag_of_Germany.svg?react';
import Activity from 'assets/neo_icons/Menu/Activity.svg?react';
import Avatar from "components/Core/Avatar/AvatarNDL";
import Selector from 'assets/neo_icons/Logos/selector.svg?react';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import Exit from 'assets/neo_icons/Menu/logout_profile.svg?react';
import Language from 'assets/neo_icons/Menu/language_profile.svg?react';
import Moon from 'assets/neo_icons/Menu/moon_profile.svg?react';
import CharavonRight from 'assets/neo_icons/Menu/chevron-right.svg?react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Profile from "components/layouts/Profile/ProfileSetting";
import AccesslistTable from "components/layouts/Profile/ProfileSetting/components/AccesslistTable";
import LoginHistory from "components/layouts/Profile/ProfileSetting/components/LoginHistory";









export default function ProfileMenu(props) {
    const { schema} = useParams();
    const prevSgid = useRef();
    const [curTheme, setcurTheme] = useRecoilState(themeMode);
    const { t } = useTranslation();
    const [curLang, setCurLang] = useRecoilState(appLanguage); 
    const theme = useGetTheme();
    const [, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [currUser] = useRecoilState(user);
    const [userDetails] = useRecoilState(userData);
    const [, setUserInitials] = useRecoilState(userInitial);
    const [hrmsDetails, setHRMSDetails] = useRecoilState(hrms);
    const [, setCurPage] = useRecoilState(currentPage);
    const [open,setOpen] = React.useState(false);
    const [Langopen,setLangopen]  = React.useState(false);
    const [currTheme] = useRecoilState(themeMode)
    const navigate = useNavigate()
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [scrollTheme, setscrollTheme] = useState(curTheme);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleTabClick = (tab) => setSelectedTab(tab);


    useEffect(() => {
        // Function to close dropdown when clicking outside
        const handleOutsideClick = (e) => {
            if (anchorE2 && !anchorE2.contains(e.target)) {
                setLangopen(false);
            }
        };
    
        // Add event listener for clicks outside
        document.addEventListener("click", handleOutsideClick);
        
        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [anchorE2]);
    



    const renderContent = () => {
        switch (selectedTab) {
            case "Profile":
                return <Profile/>;
            case "Access List":
                return <AccesslistTable/>;
            case "Login Activity":
                return <LoginHistory />;
            default:
                return null;
        }
    };


   

   
    let sizeLG = (props.size==='lg') ? 'max-w-[900px]': 'max-w-600'

  

    const classes ={   
        menuList: {
            fontSize: 12,
            marginTop: 10,
            marginBottom: 3,
            display: 'flex',
            alignItems: 'center'
        }, 
        menuText: {
            color:curTheme==='dark' ? '#ffff' : '#000000'
        },
        logOutButton: {
            marginTop: 20,
            width: '100%',
            boxShadow: 'none'
        },
        logOutDiv: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1px',
            gap: '16px',
            width: '100%',
            height: '32px',

            /* Secondary Button/Default */

            background: '#F3F8FF',
            /* Neo Blue/300 */

            border: '1px solid #0F6FFF',
            borderRadius: '4px',

            /* Inside auto layout */
        } 
         
    }
 

    const language = [
        { id: "en", name: t('LangEN'), icon: IconFlagUK  },
        { id: "fr", name: t('LangFR'), icon:  IconFlagFR  },
        { id: "de", name: t('LangDE'), icon:  IconFlagDE  },
    ];
    useEffect(() => { 
        moment.locale(curLang);
        // eslint-disable-next-schema react-hooks/exhaustive-deps
    }, [])
 
    


    useEffect(() => {
        if (curTheme === "dark" ) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');

        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
    document.body.classList.remove('light-theme', 'dark-theme');
    document.documentElement.setAttribute('data-theme', curTheme);
    document.body.classList.add(`${scrollTheme}-theme`);
      }, [curTheme]);

      
const storedTheme = localStorage.getItem('mode');

if (storedTheme) {
    setcurTheme(storedTheme);

    if (storedTheme === 'dark') {
        document.body.style.backgroundColor = '#111111';
        document.documentElement.style.setProperty('--bodybg', '#111111');
    } else {
        document.body.style.backgroundColor = '#fcfcfc';
        document.documentElement.style.setProperty('--bodybg', '#fcfcfc');
    }
}


    const handleClick = (e) => { 
        setOpen(!open)
        let ScrollW = window.innerWidth - document.documentElement.clientWidth
        let screenH = window.innerHeight - e.currentTarget.getBoundingClientRect().top
        let Top
        let RigthPos = window.innerWidth - e.currentTarget.getBoundingClientRect().right
        let posLeft = e.currentTarget.getBoundingClientRect().left
        let ActualPos = e.currentTarget.getBoundingClientRect().left
        if(RigthPos < posLeft){
            ActualPos = RigthPos 
        }
        let WidthCur = e.currentTarget.offsetWidth
        if(screenH > 200){
            Top =  e.currentTarget.getBoundingClientRect().top + e.currentTarget.offsetHeight
        }
        setTimeout(()=>{
                document.getElementById("profile-menu").removeAttribute("style") 
            if(screenH < 200){
                document.getElementById("profile-menu").style.bottom = screenH+"px"
            }else{
                document.getElementById("profile-menu").style.top = Top+"px"
            } 
            let FinalLeft
                let PosSub = WidthCur
                if(ActualPos > PosSub){
                    FinalLeft = ActualPos - PosSub
                }else{
                    FinalLeft = PosSub - ActualPos
                }
            if(RigthPos < posLeft){
                document.getElementById("profile-menu").style.right = (ActualPos - ScrollW)+"px"    
            }else{
                document.getElementById("profile-menu").style.left = "21px"
            }   
            document.getElementById("profile-menu").style.width = "218px"
            document.getElementById("profile-menu").style.position = 'absolute' 
            document.getElementById("profile-menu").style.visibility = 'visible'

        },200)
    };
    const handleClick2 = (event) => {
        event.stopPropagation(); // Prevents parent elements from handling the click
        setAnchorE2(event.currentTarget); // Sets the anchor for dropdown positioning
        setLangopen((prevLangopen) => !prevLangopen); // Toggle the Langopen state
    };
    

    const handleClose = (currpage) => { 
        if(currpage){
            localStorage.setItem('currpage', currpage.replace(/\s+/g, ''));
            setCurPage(currpage)
        }
        setOpen(!open);
        setLangopen(false)
   
    };

    const handleLogOut = () => { 
        localStorage.removeItem("neoToken");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("child_line_token");
        localStorage.removeItem("location");
        setCurPage("")
        if(props.noLicense){
            navigate('/login')
        }
      
        else{
            window.location.reload();

        }
    }
        
    

    function getUserInitials(username) {
        const names = username.split(" ");
        let initials = "";
        names.forEach((name) => { initials += name[0]; }); 
        return initials.toUpperCase();
      }
      
    useEffect(() => {
        if (currUser.sgid && prevSgid.current !== currUser.sgid) {
            configParam
                .RUN_REST_API("/employee/withsgid", { sgid: currUser.sgid })
                .then((res) => {
                    if (res && Array.isArray(res.data)) {
                        prevSgid.current = currUser.sgid
                        setHRMSDetails(res.data[0])
                        let initials = getUserInitials(userDetails.name);
                        setUserInitials(initials);
                    } else {
                        console.log("withsgid error");
                    }
                }).catch(error => console.log('profile error', error));
        }
        // eslint-disable-next-schema
    }, [currUser]);

    const toggleMode = () => {
        let temptheme = curTheme === "dark" ? "light" : "dark"
        setcurTheme(temptheme)
        localStorage.setItem('mode', temptheme);
        setscrollTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
        localStorage.removeItem('logo')
        window.location.reload()
    };

    const handleLanguageChange = (value) => {
        setAnchorE2(null);
        setCurLang(value)
        moment.locale(value);
        localStorage.setItem('language', value);
        i18n.changeLanguage(value);
       setOpen(false);
        setLangopen(false)
    }
    let altname 
    if (userDetails.name) {
        const nameParts = userDetails.name.split(" ");
    
        if (nameParts.length > 1) {
            altname = `${nameParts[0][0]}${nameParts[1][0]}`;
        } else if (nameParts[0].length > 1) {
            altname = `${nameParts[0][0]}${nameParts[0][1]}`;
        } else {
            altname = `${nameParts[0][0]}${nameParts[0][0]}`;
        }
    }
    let imagepathurl = hrmsDetails && hrmsDetails.baseImage ? hrmsDetails.baseImage : ''
  
  
    return (
        <React.Fragment>
        <div ref={buttonRef}  id='profile-button'   color="inherit">
            <button className="flex gap-2 focus:bg-Secondary_Interaction-secondary-active   hover:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark  rounded-md dark:focus:bg-Secondary_Interaction-secondary-active-dark items-center p-1 focus:border focus:border-solid focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary-dark" onClick={handleClick}>
            <Avatar   src={hrmsDetails.baseImage ? (`data:image/png;base64,${imagepathurl}`) : ''} alt={"Profile Image"}
                    initial={altname}
                    textChange
                    className={"w-6 h-6 rounded-md"}>
                </Avatar>
                <Selector stroke={currTheme === 'dark' ? "#e8e8e8"  : '#646464'} />
               </button>
        </div>

        {/* Profile Menu */}
        {open &&(
            <div ref={menuRef} id={"profile-menu"} className={`z-20 bg-Background-bg-primary rounded-md w-60 dark:bg-Background-bg-primary-dark invisible`}
                style={{position: 'absolute',boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                onClick={(e)=>e.stopPropagation()}>
                <ul
                    className="h-auto p-3  text-sm rounded-lg text-Text-text-tertiary bg-Background-bg-primary dark:bg-Background-bg-primary-dark dark:text-Text-text-tertiary-dark mb-0"
                    aria-labelledby="dropdownSearchButton"
                >
                    <div className="flex gap-2 pb-2 justify-items-center">
                    <Avatar src={hrmsDetails.baseImage ? (`data:image/png;base64,${imagepathurl}`) : ''} alt={"Profile Image"} initial={altname}
                                            className={"w-[30px] h-[30px] rounded-md"}
                                            >
                                        </Avatar>  
                                    <div>
                            <Typography variant="label-02-s" value={userDetails.name} />
                            <div style={{ marginTop: "2px" }}>
                                <Typography variant="paragraph-xs" color='tertiary' value={userDetails.sgid} />
                            </div>
                        </div>
                    </div>

                    {/* Account Option */}
                    {!props.noLicense && (
                        <React.Fragment>
   <li
                            className={`flex items-center rounded p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`}
                            style={{ cursor: 'pointer' }}
                            onClick={handleOpenModal}
                        >
                            <div className="flex gap-2 items-center">
                                <AccountLight stroke={theme.colorPalette.primary} width={16} height={16} />
                                <Typography variant='label-01-s' style={classes.menuText} value={t('Account')} />
                            </div>
                        </li>
                            <HorizontalLine variant="divider1" />
                             <NavLink id='Activity' style={{ textDecoration: "none", color: theme.palette.primary.dark }} to={schema+"/activity"} onClick={() => { handleClose("Activity") }}>
                                <li value="Activity" className={`flex items-center rounded  p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`}> 
                                <div className="flex gap-2 items-center">
                                    <Activity stroke={curTheme==='dark' ? '#ffff' : '#000000'} width={16} height={16}/> 
                                    <Typography variant = 'lable-01-s' style={classes.menuText} value={t('Activity')}/>
                                    </div>
                                </li>
                            </NavLink>
                            <HorizontalLine variant="divider1" /> 
                            <li id='DarkMode' value="Dark Theme" className={`flex items-center rounded justify-between  h-[32px]  p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`} >
                               <div className="flex gap-2">
                                <Moon stroke={curTheme==='dark' ? "#FFFFFF" : "#202020"}/> 
                                <Typography  variant = 'lable-01-s' style={classes.menuText} value={t('DarkMode')}/>
                               </div>
                              
                                <div>
                                    <CustomSwitch
                                        id={'theme'}
                                        size = 'small'
                                        switch={true}
                                        checked={curTheme === "dark" ? true : false}
                                        onChange={toggleMode}
                                        primaryLabel={''}
                                    /> 
                                </div>
                            </li>
                            <HorizontalLine variant="divider1" />
                            <li
                           id='language-list'
                           value="Language"
                           className={`flex justify-between items-center rounded p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`}
                           style={{ cursor: 'pointer' }}
                           onClick={handleClick2}
                       >
                           <div className="flex gap-2 items-center">
                               <Language stroke={curTheme==='dark' ? "#FFFFFF" : "#202020"} />
                               <Typography variant='label-01-s' style={classes.menuText} value={t('Language')} />
                           </div>
                           <CharavonRight />
                       </li>
       
                       {/* Language List Dropdown */}
                       <ListNDL
                           options={language}
                           Open={Langopen}
                           optionChange={handleLanguageChange}
                           keyValue={"name"}
                           keyId={"id"}
                           id={"lang-menu"}
                           onclose={handleClose}
                           style={{ cursor: 'pointer' }}
                           anchorEl={anchorE2}
                           isIcon
                       />
                         <HorizontalLine variant="divider1" />
       
                         <li id='appRating' value="App Rating" className={`flex items-center rounded  p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`} style={{ cursor: 'pointer' }} onClick={() => { setAnchorEl(null); props.showRating();handleClose("") }}>
                                   <div className="flex gap-2 items-center">
                                           <RatingLight stroke={curTheme==='dark' ? "#FFFFFF" : "#202020"} />
                                       <Typography variant = 'lable-01-s' style={classes.menuText} value={t('Feedback')}/>
                                       </div>
                                   </li>
                                   <HorizontalLine variant="divider1" />
                                   <li id='logout-list' className={`flex gap-2 items-center rounded   p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`}  style={{ cursor: 'pointer' }} value="Logout" onClick={handleLogOut}>
                                <Exit />
                                 <Typography variant = 'lable-01-s' style={{color:"#CE2C31"}}value= "Logout" />
                                  </li>
                        </React.Fragment>
                        
                    )}
                  
                            {
                                props.noLicense &&
                                <li id='logout-list' className={`flex gap-2 items-center rounded   p-2 hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark`} style={{ cursor: 'pointer' }} value="Logout" onClick={handleLogOut}>
                                <Exit />
                                 <Typography variant = 'lable-01-s' style={{color:"#CE2C31"}}value= "Logout" />
                                  </li>
                            }

            </ul>
        </div>
    )}

               

       <>{/* ModalNDL - Renders only if modalOpen is true */}
        {modalOpen && (
            <ModalNDL open={modalOpen} width="90%" >
                <ModalHeaderNDL >
                    <div className="flex flex-col items-start">
                        <Typography variant="heading-02-xs" value="Account" />
                        <Typography variant="paragraph-xs"  color="tertiary" value="Manage your profile, access permissions, requests, and login activity." />
                      
                    </div>
                  
                </ModalHeaderNDL>

                <ModalContentNDL height >
                <div className="flex w-full h-[75vh]">
                {/* Sidebar */}
                    <div className=" w-[20%] border-r border-Border-border-50 dark:border-Border-border-dark-50 pr-4 mr-4 " >
                        <ul className="space-y-0">
                            {["Profile", "Access List", "Login Activity"].map((tab) => (
                                <li
                                    key={tab}
                                    className={`${
                                        selectedTab === tab 
                                          ? "bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark text-Text-text-primary dark:text-Text-text-primary-dark border-Border-border-50 dark:border-Border-border-dark-50 cursor-pointer  rounded-md"
                                          : "bg-Secondary_Interaction-secondary-default dark:bg-Secondary_Interaction-secondary-default-dark text-Text-text-secondary dark:text-Text-text-secondary-dark border-Border-border-50 dark:border-Border-border-dark-50 hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark cursor-pointer  hover:rounded-md"
                                      } p-2 transition-all duration-200`}
                                    onClick={() => handleTabClick(tab)}
                                >
<Typography
    variant={selectedTab === tab ? "label-02-s" : "label-01-s"}
    value={tab}
  />                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-[80%] overflow-y-auto ">
                        {renderContent()}
                    </div>
                </div>
                           </ModalContentNDL>

                <ModalFooterNDL>
                    <Button type='secondary' value={t("Close")} onClick={handleCloseModal} />
                </ModalFooterNDL>
            </ModalNDL>
        )}
</> 
    
                               
                            

                   
         
            
        
    

</React.Fragment>)}