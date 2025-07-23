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
                        <TypographyNDL variant="heading-02-xs" model value={t('Irreversible Action Confirmation')} /> 
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <TypographyNDL variant="paragraph-s" color="secondary" value={t('You are about to deselct the email associated with this limit will no longer receive notifications related to this limit via email. This action confirm that you are aware of this, and it cannot be undone. Please review carefully before proceeding.')} />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button type="primary"  value={t('Continue')} onClick={() => props.editConnectivityAlarm()} />
                        <Button type={"secondary"} style={{ marginRight: 10}} value={t('Cancel')} onClick={() => handlDialogClose()} />
                    </ModalFooterNDL>
                </React.Fragment>
            </ModalNDL>
        </React.Fragment>
    )
});

export default MessageModal;