import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ComponentModal from "./ComponentModal"

const AddComponent = React.forwardRef((props, ref) => {
    const [open, setopen] = useState(false);

    const dialogRef = useRef();

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setopen(true)
        }
    }))


    function handleMetricDialogClose() {
        setopen(false);
        props.getImages()
    }


    return (
        <ModalNDL open={open} width={1200}>
            <ComponentModal
                onClose={handleMetricDialogClose}
                ref={dialogRef} 
                headPlant={props.headPlant}
                scadaImagesData={props.scadaImagesData}
                handleAddComponent={props.handleAddComponent}
            />

        </ModalNDL>
    )

}
)


export default AddComponent;
