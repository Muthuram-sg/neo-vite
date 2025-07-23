import React, { useState, useEffect, useImperativeHandle } from 'react'
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import Grid from "components/Core/GridNDL";
import Button from 'components/Core/ButtonNDL'
import Toast from "components/Core/Toast/ToastNDL";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { VirtualInstrumentsList, selectedPlant } from 'recoilStore/atoms'
//Hooks
import useUpdateLineDetails from "../hooks/useUpdateLine";

const AddProductEnergy = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const headPlant = useRecoilValue(selectedPlant)
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [ProductEnergy, setProductEnergy] = useState('')
    const [IsProd, setIsProd] = useState(false);
    const [productenergyDialog, setProductenergyDialog] = useState(false);
    const { outLineLoading, outLineData, outLineError, getUpdateLineDetails } = useUpdateLineDetails();

    useEffect(() => {
        setTimeout(() => {
            setProductEnergy(headPlant.node && headPlant.node.product_energy ? headPlant.node.product_energy : '')
            setIsProd(headPlant.node && headPlant.node.product_energy ? true : false)
        }, 300)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if (
            outLineData !== null &&
            !outLineError &&
            !outLineLoading
        ) {
            props.getSavedLineDetails(headPlant.id)
            setProductenergyDialog(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outLineData])

    useImperativeHandle(ref, () =>
    (
        {
            handleProductEnergyEdit: (data) => {
                setProductenergyDialog(true);
            }

        }
    ))

    const UnitOption = [{ id: 1, name: 'square Unit' }, { id: 2, name: 'Ton' },{id:3,name:"SqM on 6 m2 basis" } ]

    const PrimaryOption = [{ id: 1, name: 'Product' }, { id: 2, name: 'Characteristics' }]

    const ProductOption = [{ id: 1, name: 'Tint' }, { id: 2, name: 'Thickness' }, { id: 3, name: 'Family' }]

    function onHandleUnit(e) {
        setProductEnergy(ProductEnergy ? { ...ProductEnergy, unit: e.target.value } : { unit: e.target.value, nodes: [] })
    }

    function onHandlePrimary(e) {
        setProductEnergy(ProductEnergy ? { ...ProductEnergy, primary: e.target.value } : { primary: e.target.value, nodes: [] })
    }

    function onHandleProdNodes(e) {
        setProductEnergy(ProductEnergy ? { ...ProductEnergy, nodes: e } : { nodes: e })
    }

    function onHandleProdType(e) {
        setProductEnergy({ ...ProductEnergy, prod_type: e.target.value })
    }

    function handleCheck() {
        setIsProd(!IsProd)
    }

    const handleDialogClosefn = () => {
        setProductenergyDialog(false);
    }

    const handleSaveProductEnergy = () => {
        if (!ProductEnergy || (!ProductEnergy.unit || !ProductEnergy.primary)) {
            SetMessage(t('Please select Unit and Primary Filter'))
            SetType("warning")
            setOpenSnack(true)
            return false
        }
        if (ProductEnergy.primary === 2 && !ProductEnergy.prod_type) {
            SetMessage(t('Please select Type'))
            SetType("warning")
            setOpenSnack(true)
            return false
        }
        let NodeObj = {nodes: headPlant.node.nodes}
        let ProductEnergyObj = {product_energy: ProductEnergy }
        let ContractObj = headPlant.node?.energy_contract !== undefined ? {energy_contract: headPlant.node?.energy_contract} : "";
        let NodeArr = { ...NodeObj, ...ProductEnergyObj, ...ContractObj }

        getUpdateLineDetails(
            headPlant.id, 
            headPlant.location ,
            headPlant.name,
            headPlant.energy_asset,
            headPlant.dash_aggregation,
            headPlant.mic_stop_duration,
            headPlant.shift,
            NodeArr,
        );
    }

    return (
        <ModalNDL open={productenergyDialog}>
            <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
                <React.Fragment>
                    <ModalHeaderNDL>
                        <TypographyNDL variant="heading-02-xs" model value={"Product Energy"} />
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                    <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-0.5">
                <TypographyNDL variant="lable-02-s">{t('Product Energy')}</TypographyNDL>
                    <TypographyNDL variant="paragraph-xs" color='secondary' value={"Enabling this will allow to configure parameters of your products for efficient control and insights into energy monitoring"} />
                    </div>
                    <SwitchCustom
                                    switch={true}
                                    checked={IsProd}
                                    onChange={(e) => handleCheck()}
                                    primaryLabel={''}
                                />
                            </div>
                        <Grid container spacing={2} style={{ paddingTop: 12 }}>
                            <Grid item xs={6} sm={6}>
                                <SelectBox
                                    labelId="test"
                                    id="test-Unit"
                                    auto={false}
                                    label={t('Unit')}
                                    multiple={false}
                                    options={UnitOption}
                                    isMArray={true}
                                    checkbox={false}
                                    value={ProductEnergy && ProductEnergy.unit ? ProductEnergy.unit : ''}
                                    onChange={onHandleUnit}
                                    keyValue="name"
                                    keyId="id"
                                    error={false}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectBox
                                    labelId="test"
                                    id="Prod-energy-node"
                                    auto={false}
                                    label={t('Product Energy Node')}
                                    multiple={true}
                                    options={vInstruments}
                                    isMArray={true}
                                    checkbox={false}
                                    value={ProductEnergy ? ProductEnergy.nodes : []}
                                    onChange={onHandleProdNodes}
                                    keyValue="name"
                                    keyId="id"
                                    error={false}
                                />
                            </Grid>
                        
                         </Grid>
                         <div className='mt-3'/>
                         <Grid container spacing={0}>
                         <Grid item xs={6} sm={6}>
                                <SelectBox
                                    labelId="test"
                                    id="Primary-filter"
                                    auto={false}
                                    label={t('Primary Filter')}
                                    multiple={false}
                                    options={PrimaryOption}
                                    isMArray={true}
                                    checkbox={false}
                                    value={ProductEnergy && ProductEnergy.primary ? ProductEnergy.primary : ''}
                                    onChange={onHandlePrimary}
                                    keyValue="name"
                                    keyId="id"
                                    error={false}
                                />
                            </Grid>

                         <Grid item xs={6} sm={6} style={{display:'flex',alignItems:'end'}}>
                                {ProductEnergy && (ProductEnergy.primary === 2) &&
                                    <div style={{ width: '100%' }}>
                                        <SelectBox
                                            labelId="test"
                                            id="Product-filter"
                                            auto={false}
                                            label={''}
                                            placeholder={'Select Type'}
                                            multiple={false}
                                            options={ProductOption}
                                            isMArray={true}
                                            checkbox={false}
                                            value={ProductEnergy && ProductEnergy.prod_type ? ProductEnergy.prod_type : ''}
                                            onChange={onHandleProdType}
                                            keyValue="name"
                                            keyId="id"
                                            error={false}
                                        /></div>}
                            </Grid>
                         </Grid>
                            
                        
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

                        <Button type="primary" value={t('Update')}   onClick={() => handleSaveProductEnergy()} disabled={!IsProd} />
                    </ModalFooterNDL>
                </React.Fragment >

            </React.Fragment>
        </ModalNDL>
    )
});

export default AddProductEnergy;


