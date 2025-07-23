import React, { useState, useRef, useImperativeHandle } from "react";
import ModalNDL from "components/Core/ModalNDL";
import AddResourcePrice from "./AddResourcePrice";
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";

const ResourcePriceModal = React.forwardRef((props, ref) => {
    const AddResourcePriceRef = useRef();
    const [resourcepriceModal, setResourcepriceModel] = useState(false)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [resourcepriceDialog, setResourcepriceDialog] = useState(true);

    

    useImperativeHandle(ref, () =>
    (
        {
            handleResourcePriceEdit: (data) => {
                setOpenSnack(false)
                setResourcepriceModel(true);
                setResourcepriceDialog(true)
               

            }
        }
    ))

    function handleResourcePriceDialogClose() {
        
        setResourcepriceModel(false)
    }

    return (
        <ModalNDL open={resourcepriceModal} width={'800px'}>
            <AddResourcePrice
                handleDialogClose={handleResourcePriceDialogClose}
                ref={AddResourcePriceRef}
                resourcepriceDialog={resourcepriceDialog}
                getSavedLineDetails={props.getSavedLineDetails}
            />
        </ModalNDL>
    )
})
export default ResourcePriceModal;