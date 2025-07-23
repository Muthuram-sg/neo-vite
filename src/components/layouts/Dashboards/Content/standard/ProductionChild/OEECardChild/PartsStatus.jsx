import React from 'react';
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
// Icons
import Confetti from 'assets/neo_icons/Dashboard/confetti.svg?react';
import ConfettiDark from 'assets/neo_icons/Dashboard/confetti_dark.svg?react';
import RunningSlow from 'assets/neo_icons/Dashboard/PersonSimpleRun.svg?react';
import RunningSlowDark from 'assets/neo_icons/Dashboard/PersonSimpleRunWhite.svg?react'; 
function PartsStatusFunction(props){
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode); 

    const rendericons = ()=>{
        if(props.PartsDifferenceStatus === "Ahead"){
            if(curTheme === "dark"){
                return  <ConfettiDark />
            }else{
                return   <Confetti /> 
            }
        }else{
            if(curTheme === "dark"){
                return  <RunningSlowDark />
            }else{
                return <RunningSlow />
            }
        }

    }
    return( 
        <div className='flex justify-center items-center gap-1'>
            {rendericons()}
            <Typography variant="label-02-lg" style={{ textAlign: "center" }}
                value={<>
                <span className='mr-1 font-geist-mono'>
                    {props.PartsDifferenceValue ? parseInt(props.PartsDifferenceValue) : 0}
                </span>Parts {t(props.PartsDifferenceStatus ? props.PartsDifferenceStatus : "")}
                </>}
            /> 
        </div>
        
    )
}

const PartsStatus = React.memo(PartsStatusFunction);
export default PartsStatus;