import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { selectedPlant } from 'recoilStore/atoms';
import AddProductEnergy from "./Container/AddProductEnergy";
import Button from "components/Core/ButtonNDL";
import Edit from 'assets/neo_icons/Menu/EditMenu.svg?react';
import ShowProductEnergy from "./Container/ShowProductEnergy";
import useSavedLineDetails from "./hooks/useSavedLineDetails";
import Toast from "components/Core/Toast/ToastNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";


export default function ProductEnergy() {
    const { t } = useTranslation();
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const AddProductEnergyRef = useRef();
    const [, setheadPlant] = useRecoilState(selectedPlant)
    const [contractLoader,setcontractLoader] = useState(false)

    const { updatedLineLoading, updatedLineData, updatedLineError, getSavedLineDetails } = useSavedLineDetails();

    useEffect(() => {
        if (
            updatedLineData &&
            !updatedLineError &&
            !updatedLineLoading
        ) {
            if (updatedLineData.neo_skeleton_lines) {
                let temp = JSON.parse(JSON.stringify(updatedLineData.neo_skeleton_lines[0]))
                setheadPlant(temp)
            }
            setcontractLoader(true)
            setTimeout(()=>{
                setcontractLoader(false)
                SetMessage("Product Details Updated")
                SetType("success")
                setOpenSnack(true)
            },3000)
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedLineData, updatedLineError, updatedLineLoading])

    const handleProductEnergyEdit = (data) => {
        AddProductEnergyRef.current.handleProductEnergyEdit(data);
    }

    return (
        <React.Fragment>
               {
                 contractLoader && <LoadingScreenNDL /> 
            }
            <Toast type={type} message={message} toastBar={openSnack} handleSnackClose={() => setOpenSnack(false)} ></Toast>
            <div className="h-[48px] flex items-center justify-between py-3 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Product Energy' variant='heading-02-xs'  />
                            <Button
                    type="ghost"
                    value={t('Edit')} onClick={(data) => { handleProductEnergyEdit(data) }}
                />
                        </div>
             
           <div className="p-4  bg-Background-bg-primary dark:bg-Background-bg-primary-dark"  style={{ height: 'calc(100vh - 48px)' }}>
           <ShowProductEnergy />

           </div>
            <AddProductEnergy
                ref={AddProductEnergyRef}
                getSavedLineDetails={getSavedLineDetails}
            />
        </React.Fragment>
    );
}
