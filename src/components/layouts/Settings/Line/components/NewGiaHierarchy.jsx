import React from 'react';
import { useTranslation } from 'react-i18next';
import ParagraphText from "components/Core/Typography/TypographyNDL";

const NewGiaHierarchy = (props) =>{
    const { t } = useTranslation();
    

    return(
       <React.Fragment>
        <ParagraphText value={t('GAIABusinessHierarchy')} variant="paragraph-xs" color='secondary'/>
        <div className='mt-0.5' />
        <ParagraphText value={
                    props.headPlantid !== 0 ? 
                    props.activityName + t('Greater') + 
                    props.businessName + t('Greater') + 
                    "\r\n" + props.plantName 
                    : ""
                  } variant="lable-01-s"    />
       
       </React.Fragment>
    )
}
const isRender = (prev,next)=>{ 
    return  prev.activityName !== next.activityName ||
      prev.businessName !== next.businessName ||
       prev.plantName !== next.plantName?
        false : true   

} 
export default React.memo(NewGiaHierarchy,isRender);

