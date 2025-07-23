import React from 'react';
import Button from "components/Core/ButtonNDL";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import EditIcon from 'assets/neo_icons/Menu/EditMenu.svg?react';


export default function CustomCardHeader(props){
    const { t } = useTranslation();
    console.log(props.isLicenseModel , !props.isSuperAdmin,"props.isLicenseModel && !props.isSuperAdmin")
    const DisableButton =()=>{
        if(props.isLicenseModel && !props.isSuperAdmin ){
            return 'none'
        }else{
          return 'block'
        }
    } 
    return(
        <Grid container>
                <Grid item xs={6}>
                  
                </Grid>
                <Grid style={{ display: 'flex' }} item xs={6}>
               
           
                <div style={{  marginLeft: 'auto',display:DisableButton()}} >
                      <Button  type="ghost" 
                      
                      onClick={() => {props.onhandleEdit()} }
                       value={t('Edit')} 
                    //    icon={EditIcon}
                        />
                 </div>
                 
                

                  
                  </Grid>
              </Grid>
    )
}
