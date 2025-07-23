import React from 'react'; 
import ParagraphText from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';
function NodeHeader(props) {
    const { t } = useTranslation();
    return ( 
        <div className='h-[40px] flex items-center justify-between'>
                    <ParagraphText value={t('Node')} variant="heading-01-xs"  color='secondary'/>
                    </div>
    )
}
export default NodeHeader;