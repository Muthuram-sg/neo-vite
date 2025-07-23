import React, { useState, useRef, useImperativeHandle } from "react";
import AddResourcePrice from "./AddResourcePrice";
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";

const ResourcePriceModal = React.forwardRef((props, ref) => {
    const AddResourcePriceRef = useRef();
    const [, setResourcepriceModel] = useState(false)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [resourcepriceDialog, setResourcepriceDialog] = useState(true);

    

    useImperativeHandle(ref, () =>
    (
        {
            handleResourcePriceEdit: (data) => {
                setOpenSnack(false)
                setResourcepriceModel(true);
                setResourcepriceDialog(true)
                

            },
            handleResourcePriceSave:()=>{
                    setTimeout(() => {
                    AddResourcePriceRef.current.handleResourcePriceSave()
                }, 300)

            }

        }
    ))

    function handleResourcePriceDialogClose() {
        
        setResourcepriceModel(false)
    }

    return (
            <AddResourcePrice
            hadnleButtonLoader={props.hadnleButtonLoader}
            handleActiveIndex={props.handleActiveIndex}
                handleDialogClose={handleResourcePriceDialogClose}
                ref={AddResourcePriceRef}
                resourcepriceDialog={resourcepriceDialog}
                getSavedLineDetails={props.getSavedLineDetails}
            />
    )
})
export default ResourcePriceModal;