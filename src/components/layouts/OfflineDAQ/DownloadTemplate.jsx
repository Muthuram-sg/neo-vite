import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
// core component
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import useInstrumentCategory from "Hooks/useInstrumentCategory"; 
import useInstrumentType from "Hooks/useInstrumentType"; 
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';

export default function DownloadTemplate(props) {
    const { t } = useTranslation();
    const [categoryID, setCategoryID] = useState(''); 
    const [instrumentTypeID, setInstrumentTypeID] = useState('');
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory() 
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType() 
    
    useEffect(()=>{
        getInstrumentCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => { 
        getInstrumentType(categoryID); 
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [categoryID]) 

    const handleInstrumentCategory = (e,option) => { 
        if (e) { 
            setCategoryID(e.target.value) 
        } 
    } 

    const handleInstrumentType = (e,option) => { 
        if (e) { 
            setInstrumentTypeID(e.target.value) 
        } 
    } 

    const downloadTemplateData = () => {
        props.handleDownloadTemplate(categoryID, instrumentTypeID);
    }
console.log('summa')
    return (
        <React.Fragment>
            <ModalContentNDL>
                <SelectBox
                    id='combo-box-demo'
                    value={categoryID}
                    onChange={(e, option) => handleInstrumentCategory(e, option)}
                    auto={true}
                    options={!InstrumentCategoryListLoading && !InstrumentCategoryListError && InstrumentCategoryListData && InstrumentCategoryListData.length > 0 ? InstrumentCategoryListData : []}
                    isMArray={true}
                    keyId={"id"}
                    keyValue={"name"}
                    label={t('Category')}
                    
                ></SelectBox>
                <div className='mb-3'/>

                <SelectBox
                    id='combo-box-demo'
                    value={instrumentTypeID}
                    onChange={(e, option) => handleInstrumentType(e, option)}
                    auto={true}
                    options={!InstrumentTypeListLoading && !InstrumentTypeListError && InstrumentTypeListData && InstrumentTypeListData.length > 0 ? InstrumentTypeListData : []}
                    isMArray={true}
                    keyId={"id"}
                    keyValue={"name"}
                    label={t('type')}
                                   ></SelectBox> 
                <div className='mb-3'/>

</ModalContentNDL>
            <ModalFooterNDL>
                <Button  type="secondary"  value={t('Cancel')} onClick={() => props.handleCloseDialog()} />
                <Button  type="primary" value={t('Download')} onClick={downloadTemplateData} />
            </ModalFooterNDL>
        </React.Fragment>
    )
}