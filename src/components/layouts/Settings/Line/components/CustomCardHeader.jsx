import React from 'react';
import Button from "components/Core/ButtonNDL";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import EditIcon from 'assets/neo_icons/Menu/EditMenu.svg?react';

export default function CustomCardHeader(props){
    const { t } = useTranslation();
    return(
        <Grid container>
                <Grid item xs={6}>
                  
                </Grid>
                <Grid style={{ display: 'flex' }} item xs={6}>
                  
                
                {props.lineDisable ?
                 <div style={{ marginRight: 10, marginLeft: 'auto' }} >
                      <Button  type="ghost" 
                      
                      onClick={() => {props.onhandleEdit()} }
                       value={t('Edit')} 
                    //    icon={EditIcon}
                        />
                 </div>
                 :
                 <React.Fragment>
                    <div style={{ marginRight: 10, marginLeft: 'auto' }} >
                        <Button  type="secondary"
                        onClick={() => { props.onHandleSave(true)}} 
                                             

                        value={t('Cancel')}  />
                    </div>
                    <div style={{ marginRight: 10 }} >
                        <Button  type="primary" 
                        onClick={() => {props.onHandleConfirmSave()} }
                                             

                        value={t('Save')} 
                        />
                        
                    </div>
                </React.Fragment>

                  }
                  </Grid>
              </Grid>
    )
}
