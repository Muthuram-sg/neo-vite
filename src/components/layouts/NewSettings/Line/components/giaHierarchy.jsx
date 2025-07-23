import React from 'react';
import { useTranslation } from 'react-i18next';
import InputFieldNDL from 'components/Core/InputFieldNDL';

const GiaHierarchy = (props) =>{
    const { t } = useTranslation();
    

    return(
       <React.Fragment>
        <InputFieldNDL 
                  id="line-plant" 
                  value={
                    props.headPlantid !== 0 ? 
                    props.activityName + t('Greater') + 
                    props.businessName + t('Greater') + 
                    "\r\n" + props.plantName 
                    : ""
                  } 
                  mandatory
                    disabled={true}
                    label={t('BusinessHierarchy')}
                  />
       </React.Fragment>
    )
}
const isRender = (prev,next)=>{ 
    return  prev.activityName !== next.activityName ||
      prev.businessName !== next.businessName ||
       prev.plantName !== next.plantName?
        false : true   

} 
export default React.memo(GiaHierarchy,isRender);

