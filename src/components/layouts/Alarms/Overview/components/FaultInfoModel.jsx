import React, { forwardRef } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModelFaultDetails from './ModelFaultDetails';

const FaultInfoModel = forwardRef((props, ref) => {
    return (
        <ModalNDL onClose={props.onClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={true}>
            <ModelFaultDetails onClose={props.onClose} info={props.info} props={props.props} assetname={props.assetname} headPlant={props.headPlant} alarmDefectData={props.alarmDefectData} />
        </ModalNDL>
    );
});

export default FaultInfoModel;
