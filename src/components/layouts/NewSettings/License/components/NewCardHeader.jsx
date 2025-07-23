import React from 'react';
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import useGetTheme from 'TailwindTheme';
import Typography from "components/Core/Typography/TypographyNDL";



export default function CustomCardHeader(props){
    const theme = useGetTheme();
    const { t } = useTranslation();
    const DisableButton =()=>{
        if(props.isLicenseModel && !props.isSuperAdmin ){
            return 'none'
        }else{
          return 'block'
        }
    } 
    return(

        <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
            <Typography value='License Information' variant='heading-02-xs' />
                          <div style={{  marginLeft: 'auto',display:DisableButton()}} >
                      <Button  type="ghost" 
                      
                      onClick={() => {props.onhandleEdit()} }
                       value={t('Edit')} 
                    //    icon={EditIcon}
                        />
                 </div>
                    </div> 
    )
}
