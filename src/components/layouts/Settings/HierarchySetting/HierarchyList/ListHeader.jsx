import React from 'react'; 
import ParagraphText from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';


function ListHeader(props){ 
    const { t } = useTranslation();
    
    return( 
        <div className='flex justify-between items-center  h-[40px]' >
                <div>
                    <ParagraphText value={t('Hierarchy Library')} variant="heading-01-m"/>
                    </div>
              
        </div>
    )
} 
export default React.memo(ListHeader,()=> true)