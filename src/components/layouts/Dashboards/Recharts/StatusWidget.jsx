/* eslint-disable eqeqeq */
import React from 'react';
import Typography from 'components/Core/Typography/TypographyNDL'; 
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil"; 
import { themeMode } from "recoilStore/atoms"

function StatusWidget(props){ 
    const { t } = useTranslation()  
    const [CurTheme] =useRecoilState(themeMode)
    const lastValue = props.data && props.data[0] && props.data[0].value !== null ? props.data[0].value:null; 
    let backgroundColorValue = CurTheme === 'dark' ? "#222222" :"#fff";
    let textValue = ""
    if(props.meta.statusType==="binary"){ 
        if (lastValue == props.meta.positiveValue) {
            backgroundColorValue = props.meta.positiveColor
        } else if (lastValue == props.meta.negativeValue) {
            backgroundColorValue = props.meta.negativeColor
        }
     
        if (lastValue == props.meta.positiveValue) {
            textValue = props.meta.positiveText
        } else if (lastValue == props.meta.negativeValue) {
            textValue = props.meta.negativeText
        }

    }
  
    if (props.meta.statusType === "multiLevel") {
        const assignValue = props.meta.multiLevelValue.map(x => x.multiPositiveValue);
        const assignColor = props.meta.multiLevelValue.map(x => x.multiPositiveColor);
        const assignText= props.meta.multiLevelValue.map(x => x.multiPositiveText);
        const index = assignValue.indexOf(String(lastValue)); 
        if (index !== -1) {
          backgroundColorValue = assignColor[index];
          textValue = assignText[index]; 
        }
     
      }
      
    return(        
        <React.Fragment>
            {                
                lastValue !== null ?( 
                    <div style={{width: props.width,height: props.height,borderRadius: 4,background: backgroundColorValue ,display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                        <div style={{textAlign: 'center',color: '#fff',paddingTop: 20}}>
                            <Typography value={textValue} variant='h1'/>   
                        </div> 
                    </div>
                ):(
                    <div style={{textAlign: 'center'}}>
                        <Typography variant="4xl-body-02" color="primary" value={t("No Data")} />
                        <Typography variant="heading-02-sm" value={t("EditORReload")}/> 
                    </div>
                )
            }
        </React.Fragment>
    )
}
export default StatusWidget;