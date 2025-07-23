import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { selectedPlant } from 'recoilStore/atoms';
import ResourcePriceModal from "./components/ResourcePriceModal";
import Button from "components/Core/ButtonNDL";
import FactorTable from "./components/ResourcePriceList";
import useSavedLineDetails from "./hooks/useSavedLineDetails";
import Toast from "components/Core/Toast/ToastNDL";
import useGetTheme from 'TailwindTheme';
import Typography from "components/Core/Typography/TypographyNDL";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";


export default function Factors(props) {
    const theme = useGetTheme();
    const { t } = useTranslation();
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const AddResourcePriceRef = useRef();
    const [, setheadPlant] = useRecoilState(selectedPlant)
    const [, setcontractLoader] = useState(false)
    const [page, setPage] = useState('price')
    const [,setbuttonLoader] = useState(false)
    

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
            handleActiveIndex(0)
            setcontractLoader(true)
            setcontractLoader(false)
            SetMessage(t('Price Updated'))
            SetType("success")
            setOpenSnack(true)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedLineData, updatedLineError, updatedLineLoading])

    const handleResourcePriceEdit = (data) => {
        setPage('priceForm')
        props.handleHide(true)
        setTimeout(() => {
            AddResourcePriceRef.current.handleResourcePriceEdit(data);
        }, 300)
    }

    const breadcrump = [{ id: 0, name: 'Settings' }, { id: 1, name: 'Edit Price' }]
    const handleActiveIndex = (index) => {
        if (index === 0) {
            setPage('price')
            props.handleHide(false)
        }

    }

    const handleSaveResourcePrice =()=>{
        setbuttonLoader(true)
        setTimeout(() => {
            AddResourcePriceRef.current.handleResourcePriceSave();
        }, 300)
    }


    return (
        <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack} handleSnackClose={() => setOpenSnack(false)} ></Toast>
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
                {
                    page === 'price' ?
                        <React.Fragment>
                            <Typography value='Prices' variant='heading-02-xs' />
                            <Button
                                type="ghost"
                                style={{ float: "right" }}
                                value={t('Edit')} onClick={(data) => { handleResourcePriceEdit(data) }}
                            // icon={Edit}
                            />
                        </React.Fragment>

                        :
                        <React.Fragment>
                        <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
                        <div className="flex gap-2">   
                        <Button type="secondary" value={t('Cancel')} onClick={() =>{setPage('price'); props.handleHide(false)}} />
                        <Button type="primary" value={t('Update')} loading={updatedLineLoading} onClick={() => handleSaveResourcePrice()} />
                        </div>
                        </React.Fragment>
                }
            </div>
            <div className="p-4 h-[93vh] bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark overflow-y-auto">
            {
                page === 'price' ?
                        <FactorTable />
                    :
                    <ResourcePriceModal
                       hadnleButtonLoader={(e)=>setbuttonLoader(e)}
                        handleActiveIndex={handleActiveIndex}
                        ref={AddResourcePriceRef}
                        getSavedLineDetails={getSavedLineDetails}
                    />
            }
                    </div>

        </React.Fragment>
        
    );
}
