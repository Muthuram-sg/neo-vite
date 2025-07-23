import React from 'react';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { currentPage } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

import moment from 'moment';
const SprintView = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [, setCurPage] = useRecoilState(currentPage);
    let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'plantschema' 
    

    const handleNeoWeb = () => {
        // NOSONAR   -  skip next line
        props.close();
        navigate("/"+ plantSchema+"/What'sNew");
        setCurPage('Change Log')
    }
    // NOSONAR   -  skip next line
    const sanitizedHtml = props.releasedata &&
        props.releasedata.length > 0 &&
        props.releasedata[0].content &&
        props.releasedata[0].content.html
        ? props.releasedata[0].content.html
        : "";



    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center",gap:"4px" }}>
                    <TypographyNDL value={"Release Update -"} variant="heading-02-xs" />
                    <div className='text-[18px] font-semibold leading-5 text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans' dangerouslySetInnerHTML={{ __html: moment(props.releasedata && props.releasedata.length > 0 ? props.releasedata[0].createdAt : "").format("MMM DD YYYY") }}></div>
                </div>

            </ModalHeaderNDL>
            <ModalContentNDL>

            <div
        className='font-geist-sans text-Text-text-primary dark:text-Text-text-primary-dark custom-list highGraph-content'
        dangerouslySetInnerHTML={{
            __html:sanitizedHtml
        }}></div>
     

            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" value={t('Close')} 
                    onClick={props.close} />
                <Button
                    type="tertiary"
                    value={"Learn More"}
                    style={{ marginRight: 10 }}
                    onClick={handleNeoWeb}
                />
            </ModalFooterNDL>
        </React.Fragment >
    );
}

export default SprintView;
