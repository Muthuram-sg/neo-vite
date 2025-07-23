import React, { forwardRef } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModelTaskDetails from './ModelTaskDetails';

const TaskInfoModel = forwardRef((props, ref) => {
    return (
        <ModalNDL onClose={props.onClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={true}>
            <ModelTaskDetails onClose={props.onClose} tasksForEntity={props.tasksForEntity} info={props.info} props={props.props} />
        </ModalNDL>
    );
});

export default TaskInfoModel;
