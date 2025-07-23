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
                var temp = JSON.parse(JSON.stringify(updatedLineData.neo_skeleton_lines[0]))
                setheadPlant(temp)
            }
            setcontractLoader(true)
            setTimeout(()=>{
                setcontractLoader(false)
                SetMessage(t('LineDetailsUpdate'))
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
            <div style={{ height:"40px",display: 'flex', justifyContent: 'end', columnGap: '8px' }}>
                <Button
                    type="ghost"
                    style={{ float: "right"}}
                    value={t('Edit')} onClick={(data) => { handleProductEnergyEdit(data) }}
                   // icon={Edit}
                />

            </div>
            <ShowProductEnergy />
            <AddProductEnergy
                ref={AddProductEnergyRef}
                getSavedLineDetails={getSavedLineDetails}
            />
        </React.Fragment>
    );
}
