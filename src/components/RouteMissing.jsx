import React,{useEffect,useState}from 'react';
import Typography from "components/Core/Typography/TypographyNDL";
import Error404 from 'assets/404.svg?react';
import Error404Light from 'assets/404 error-light.svg?react';
import Error404Dark from 'assets/404 error - Dark.svg?react';
import ErrorCMS404 from 'assets/404 error.svg?react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import{selectedPlant,VisibleModuleAccess,themeMode} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
export default function RouteMissing(props) {
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const navigateRoute = useNavigate();
    const baseUrl =window.location.hostname;
    const [curTheme]=useRecoilState(themeMode)


    let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'plantschema';
    console.log("plantSchema",plantSchema)
    const [headPlant] = useRecoilState(selectedPlant);
    const [moduleView] = useRecoilState(VisibleModuleAccess);
    const [visibleModuleId,setVisibleModuleId]=useState([]);
    const accessPath= props.currUserRole.id===2 ?  "/settings" :"/support"

      useEffect(() => {
        const mainModules = moduleView.mainModuleAccess
          .filter(x => x.module_id && !x.is_visible)
          .map(x => x.module_id);
        setVisibleModuleId(mainModules);
      }, [moduleView]);

    const redirecttoLogin = ()=>{
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('neoToken');
        localStorage.removeItem('location');
        
        // localStorage.setItem('gotoAccess',accessPath)
        
        navigate('/login')
        window.location.reload()
    }
    return(
        <div className={`${curTheme === 'dark' ? 'bg-Background-bg-secondary-dark' : "bg-Background-bg-secondary"} h-screen justify-center flex items-center `}>
           <div>
           <div  style={{display: "flex", justifyContent: "center"}}>
                <Typography variant="2xl-body-01" value={t('noaccess_page')} />
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
               {/* {baseUrl===configParam.CMSURL ? <ErrorCMS404 /> :
                          <Error404/>
               } */}
               {curTheme === 'dark' ? <Error404Dark /> : <Error404Light  /> }
            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: "2rem"}}>
                <Typography variant="2xl-body-01">
                    <span class="text-[24px] text-[#0F6FFF] leading-8 font-normal font-inter my-0 cursor-pointer" onClick={redirecttoLogin} to={""}>{t('clickhere')}</span> {t('take_action')}
                </Typography>
            </div>
           </div>
         
        </div>
    )
}