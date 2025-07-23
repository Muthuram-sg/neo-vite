import React, { useState,  useImperativeHandle } from "react";
import { useTranslation } from 'react-i18next';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL';

import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';

const MessageModal = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [messageDialog, setMessageDialog] = useState(false);

    useImperativeHandle(ref, () =>
    (
        {
            handleDialogOpen: () => {
                setMessageDialog(true);
            },
        }
    ))

    function handlDialogClose() {
        setMessageDialog(false)
    }

    return (
        <React.Fragment>
            <ModalNDL open={messageDialog} size="lg">
                <React.Fragment>
                    <ModalHeaderNDL>
                        <TypographyNDL variant="heading-02-s" model value={t('Please Note!')} /> 
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <TypographyNDL variant="lable-01-s" color="secondary" value={t('Your selected time range includes future dates. Please select correct date range')} />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button type="primary" value={t('Okay')} onClick={() => handlDialogClose()} />
                    </ModalFooterNDL>
                </React.Fragment>
            </ModalNDL>
        </React.Fragment>
    )
});

export default MessageModal;