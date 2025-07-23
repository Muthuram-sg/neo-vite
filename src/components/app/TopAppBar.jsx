import React, { useEffect } from 'react'; 
import { useTranslation } from 'react-i18next';
import TypographyNDL from "components/Core/Typography/TypographyNDL.jsx"
import Wind from 'assets/neo_icons/Weather/wind.svg?react';
import SnowFlake from 'assets/neo_icons/Weather/snowflake.svg?react';
import Moon from 'assets/neo_icons/Weather/moon.svg?react';
import Drop from 'assets/neo_icons/Weather/drop.svg?react';
import Thermometer from 'assets/neo_icons/Weather/thermometer.svg?react';
import ThermometerHot from 'assets/neo_icons/Weather/thermometer_hot.svg?react';
import ThermometerCold from 'assets/neo_icons/Weather/thermometer_cold.svg?react';
import SunDim from 'assets/neo_icons/Weather/sun_dim.svg?react';
import Sun from 'assets/neo_icons/Weather/sun.svg?react';
import CloudSun from 'assets/neo_icons/Weather/cloud_sun.svg?react';
import CloudRain from 'assets/neo_icons/Weather/cloud_rain.svg?react';
import CloudLightning from 'assets/neo_icons/Weather/cloud_lightning.svg?react';
import CloudFog from 'assets/neo_icons/Weather/cloud_fog.svg?react';
import SunHorizon from 'assets/neo_icons/Weather/sun_horizon.svg?react';
import CloudMoon from 'assets/neo_icons/Weather/cloud_moon.svg?react';

import MenuIcon from 'assets/neo_icons/Menu/Menu.svg?react'; 

import moment from 'moment'; 
import grindsmart from 'assets/neo_icons/Logos/GrindSmart.svg'
import Neo from 'assets/neo_icons/Logos/NEO_Logo.svg'
import cmsicon from 'assets/neo_icons/Logos/cmslogo.svg'
import LocationSelect from "components/app/LocationSelect.jsx"
import ProfileMenu from "components/app/ProfileMenu.jsx"
import Notifications from "components/app/Notifications";
import DrawerButton from '../ui/iotDrawerIcon.jsx'
import { useRecoilState } from "recoil";
import { themeMode, drawerMode, selectedPlant, currentPage } from "recoilStore/atoms"; 
import Logo from 'components/Core/Logo/LogoNDL';
import ToolTip from "components/Core/ToolTips/TooltipNDL.jsx" 

export default function TopAppBar(props) {
  const { t } = useTranslation();
  const [curTheme] = useRecoilState(themeMode);
  const [headPlant] = useRecoilState(selectedPlant);
  const [weatherData, setWeatherData] = React.useState(null);
  const [curPage] = useRecoilState(currentPage);

  const classes = {  
    grow: {
      flexGrow: 1,
    },
    menuItem: {
      width: "400px",
      wordWrap: "break-word",
      whiteSpace: "normal"
    }, 
    searchIcon: {
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
      fontSize: 12
    }, 
    lateRating: {
      marginRight: '200px',
      color: '#0F6FFF',
      fontWeight: '600',
      cursor: 'pointer'
    },
    appBar: {
      paddingTop: "3px",
      paddingBottom: "3px",
      height: '56px',
      backgroundColor: "#0D0D0D",
      zIndex: 25,
      transition: "width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
      borderBottom:
        curTheme !== "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.12)",
      top: 0,
      left: "auto",
      right: 0,
      position: "fixed",
      color: "#fff",
      width: "100%",
      display: "flex",
      boxSizing: "border-box",
      flexShrink: 0,
      flexDirection: "column",
      boxShadow: "none"
    },
    newNotification: {
      color: "#1A90FF"
    },
    iconRoot: {
      minWidth: '20px'
    }
  } 
  
  const [open, setOpen] = useRecoilState(drawerMode);

  
  
    
  const toggleDrawerOpen = () => {
    setOpen(!open);
    localStorage.setItem("topBarStatus", !open)
  };
  useEffect(() => {
    if (headPlant.area_name) {
      (async () => {
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + headPlant.area_name + "&units=metric&appid=47fd245736ab4d7ed57d79abb247fbb7";
        await fetch(url, {
          method: 'GET',
          redirect: 'follow'
        })
          .then(response => response.json())
          .then(result => {
            setWeatherData(result)
          })
          .catch(error => console.log('Weather error', error));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant]);

  const renderWeatherIcon = (data, sys) => {
    if (moment().format('LT') === (moment(sys.sunrise).format('LT') || moment(sys.sunset).format('LT'))) {
      return <SunHorizon />
    }
    else {
      switch (data.main) {
        case "Clear":
          if (data.icon.charAt(data.icon.length - 1) === 'd') {
            return <Sun />
          }
          else {
            return <Moon />
          }
        case "Snow":
          return <SnowFlake />
        case "Rain":
          return <CloudRain />
        case "Drizzle":
          return <Drop />
        case "Thunderstorm":
          return <CloudLightning />
        case "Clouds":
          if (data.icon.charAt(data.icon.length - 1) === 'd') {
            return <CloudSun />
          }
          else {
            return <CloudMoon />
          }
        case "Fog":
          return <CloudFog />
        case "Haze":
          return <SunDim />
        default:
          return <Wind />
      }
    }
  }
  const renderTempIcon = (data) => {
    if (data < 22){
      return <ThermometerCold />
    }
    else if (data > 28){
      return <ThermometerHot />
    }
    else {
      return <Thermometer />
    }
  }
  let LogoSRC 
  if(headPlant && headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 1){
    LogoSRC = Neo
  }else if( headPlant && headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 2){
    LogoSRC =  grindsmart
  }else{
    LogoSRC =  Neo
  }
  return (
    <div  
      style={classes.appBar}>
      <div 
        style={{ minHeight: "48px", paddingLeft: "10px", paddingRight: "10px",display: 'flex',position: 'relative',alignItems: 'center' }}>
       
       
       {
          !props.isLicense && 
          <ul style={{ paddingTop: '0px', paddingBottom: '0px',margin:0 }}>
         
          <li id='toggleDrawerOpen' disableGutters onClick={toggleDrawerOpen} key={"Menu Control"}> 
              <ToolTip title={open ? t("Minimize") : t("Maximize")} placement="right" >
                <DrawerButton size="small"> 
                    <MenuIcon stroke={"#FFFFFF"} /> 
                </DrawerButton>
              </ToolTip> 
          </li>
        </ul>
       }
       
        
        {/* <img src={ headPlant.appTypeByAppType ? (headPlant.appTypeByAppType.id === 1 ? Neo : headPlant.appTypeByAppType.id === 2 ? grindsmart : Neo) : Neo} alt="IIOT Platform" style={{ height: 14, marginLeft: 13 }} /> */}
        <Logo src={ headPlant.appTypeByAppType ? (headPlant.appTypeByAppType.id === 1 ? Neo : headPlant.appTypeByAppType.id === 2 ? grindsmart :headPlant.appTypeByAppType.id === 3 ? cmsicon : Neo) : Neo} alt="IIOT Platform" style={{ height: 14, marginLeft: 13 }} ></Logo>
      <div style={{borderLeft:"1px solid #393939" ,marginTop: 10, marginBottom: 5, marginLeft: 10, marginRight: 10, height: 20}} />
        <div style={{ marginRight: 15}}>
          {
            props.isLicense ? 
        <TypographyNDL variant="lable-01-m"  style={{color:"#ffffff"}} value={props.isSupport ? 'Support' : 'License'} />

        :
        <TypographyNDL variant="lable-01-m"  style={{color:"#ffffff"}} value={t(curPage)} />

          }
        </div>
        <div style={classes.grow} />
        {props.ratingDays > 92 ? (<div style={classes.lateRating} onClick={props.showRating}><span>{t("ProvideRating")}</span></div>) : ""}
        {/* SEARCH BAR */}
        {/* <GlobalSearch/> */}
        <div style={classes.grow} />
      {/* WEATHER DATA */}
        {weatherData !== null &&
          <ToolTip title={weatherData.name + '=> Temp: ' + weatherData.main.temp + t('Celsius') + t(', Air: ') + weatherData.wind.speed + 'Kmph' + t(', Humidity: ') + weatherData.main.humidity + " " + t('Percentage') + t(', Weather: ') + weatherData.weather[0].main} placement="bottom" >
            
            <div style={{ paddingLeft: '15px',display:"flex" }}>
              <div>
                 
                  {renderWeatherIcon(weatherData.weather[0], weatherData.sys)}  
                  {renderTempIcon(weatherData.main.temp)} 
              </div>
              <div style={{marginLeft: 5, marginRight: 15}}>
              <TypographyNDL variant="lable-01-m" color="#FFFFFF" style={{margin:0,color:"#ffff"}} value={weatherData.main.temp + t('Celsius')} />
              </div>
            </div>
          </ToolTip>
        }
        {weatherData === null &&
        <div style={{ marginLeft: 5, marginRight: 20 }}>
          <TypographyNDL variant="lable-01-m" value={t('Checking Weather')} />
          </div>
        }
        {/* SELECT LINE */}
        {/* <LocationSelect id='location' /> */}

        {/* NOTIFICATION */}
        <Notifications id="notification" />

        {/* PROFILE MENU */}
        {/* <ProfileMenu id='profile' showRating={props.showRating} isLicense={props.isLicense} /> */}

      </div>
    </div >
  );
}
