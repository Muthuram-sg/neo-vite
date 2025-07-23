import React, { useState, useEffect } from "react";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import Grid from 'components/Core/GridNDL'
import 'components/style/customize.css';
import { useRecoilState } from "recoil";
import { VirtualInstrumentsList, selectedPlant, lineEntity } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Button from "components/Core/ButtonNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Toast from "components/Core/Toast/ToastNDL";

//Hooks
import useUpdateLineDetails from "components/layouts/Settings/factors/Factor/hooks/useUpdateLine";

const EditContract = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [addConFields, setAddConFields] = useState([{ field: 1, contract: '', Entities: [{ field: 1, node: '', VirtualInstr: '', billing_Date: 'none', communication_channel: 'none' }] }]);
    const [entity] = useRecoilState(lineEntity);
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [IsContract, setIsContract] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const { outLineLoading, outLineData, outLineError, getUpdateLineDetails } = useUpdateLineDetails();
    const [updatedEntityOption,setupdatedEntityOption] = useState([])
    // const [updatedentitysubOption,setupdatedentitysubOption] = useState([])
    // const [updatedActualsubOption,setupdatedActualsubOption] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps


    useEffect(() => {
        if (entity.length > 0) {
            // console.log(addConFields, "addConFields")
            let selectedContract = addConFields.map(f => f.contract)
            let entityOption = entity.filter(f => f.entity_type === 4)
             entityOption = entityOption.map(f =>{
                 if(selectedContract.includes(f.id)){
            return {...f,disabled:true}
                 }else{
                        return {...f,disabled:false}
                 }
                })
             setupdatedEntityOption(entityOption)
            // let selectedEntity = addConFields.map(f => f.Entities.map(v => v.node)).flat()
            // let selectedActual = addConFields.map(f => f.Entities.map(v => v.VirtualInstr)).flat()
             
            //  let SubEntityOption = entity.filter(f => f.entity_type === 2)
            //  SubEntityOption = SubEntityOption.map(f =>{
            //     if(selectedEntity.includes(f.id)){
            //         return {...f,disabled:true}
            //              }else{
            //                     return {...f,disabled:false}
            //              }
            //  })
            //     setupdatedentitysubOption(SubEntityOption)
            //     let ActualOption = vInstruments.map(f =>{
            //         if(selectedActual.includes(f.id)){
            //             return {...f,disabled:true}
            //                  }else{
            //                         return {...f,disabled:false}
            //                  }
            //     })
            //     setupdatedActualsubOption(ActualOption)



        }



    },[addConFields])



    useEffect(() => {
        if (headPlant.node && headPlant.node.energy_contract) {
            setAddConFields(headPlant.node.energy_contract.contracts)
            setIsContract(headPlant.node.energy_contract.IsContract)
        } else {
            setAddConFields([{ field: 1, contract: '', Entities: [{ field: 1, node: '', VirtualInstr: '', billing_Date: 'none', communication_channel: 'none' }] }])
            setIsContract(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])



    useEffect(() => {
        if (
            outLineData !== null &&
            !outLineError &&
            !outLineLoading
        ) {
            handleDialogClosefn()
            props.getSavedLineDetails(headPlant.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outLineData, outLineLoading, outLineError])

    function handleCheck(e) {
        setIsContract(!IsContract)
    }

    const SaveContract = () => {

        if (addConFields.length === 0) {
            SetMessage(t('Please select Contracts Details'))
            SetType("warning")
            setOpenSnack(true)
            return false
        } else {
            if (addConFields.map(x => x.contract).includes('')) {
                SetMessage(t('Please select Contract'))
                SetType("warning")
                setOpenSnack(true)
                return false
            }
            let EntityArr = []
            let ActualArr = []
            addConFields.forEach(v => {

                v.Entities.forEach(n => {
                    EntityArr.push(n.node)
                    ActualArr.push(n.VirtualInstr)
                })

                if (v.Entities.length === 0) {
                    EntityArr.push('')
                    ActualArr.push('')
                }
            })
            // console.log(EntityArr,"EntityArrEntityArr",ActualArr)
            if (EntityArr.includes("")) {
                SetMessage(t('Please select Entity'))
                SetType("warning")
                setOpenSnack(true)
                return false
            }
            if (ActualArr.includes("")) {
                SetMessage(t('Please select Actual'))
                SetType("warning")
                setOpenSnack(true)
                return false
            }
        }
        let NodeObj = headPlant.node ? headPlant.node : {}
        let ContractObj = {}
        ContractObj["energy_contract"] = { contracts: addConFields, IsContract: IsContract }
        let ProductEnergyObj = headPlant.node?.product_energy !== undefined ? { product_energy: headPlant.node?.product_energy } : "";
        let FinalObj = { ...NodeObj, ...ProductEnergyObj, ...ContractObj }

        getUpdateLineDetails(
            headPlant.id,
            headPlant.location,
            headPlant.name,
            headPlant.energy_asset,
            headPlant.dash_aggregation,
            headPlant.mic_stop_duration,
            headPlant.shift,
            FinalObj,
        );
    }
    const onHandleNodes = (e, row, val) => {
        EntitiesFnc(e, row, val, "node", "Entity")
    }

    const onHandleActual = (e, row, val) => {
        EntitiesFnc(e, row, val, "VirtualInstr", "Actual")
    }
    

    const onHandleBillDate = (e, row, val) => {
        EntitiesFnc(e, row, val, "billing_Date")
    }
    const onHandleCommunication = (e, row, val) => {
        EntitiesFnc(e, row, val, "communication_channel")
    }



    function EntitiesFnc(e, row, val, type, msg) {
        let setelement = [...addConFields];
        let obj = { ...setelement[row] }
        let objarr = [...obj.Entities]
        let enObj = { ...objarr[val] }
        // console.log(obj,"objarr",objarr,setelement[row],"setelement",setelement,enObj)
        if (setelement[row].Entities.map(v => v[type]).includes(e.target.value) && msg) {
            enObj[type] = ''
            objarr[val] = enObj
            obj.Entities = objarr
            SetMessage(t(msg + ' Already Exist'))
            SetType("warning")
            setOpenSnack(true)
        } else {
            enObj[type] = e.target.value
            objarr[val] = enObj
            obj.Entities = objarr
        }
        setelement[row] = obj
        setAddConFields(setelement);
    }

    function deleteEntityRow(row, val) {
        let setelement = [...addConFields];
        let objarr = [...setelement[row].Entities]
        let removed = objarr.filter(x => x.field !== val);
        let obj = { ...setelement[row] }
        obj.Entities = removed
        setelement[row] = obj
        setAddConFields(setelement);
    }

    function AddEntityField(row) {
        let setelement = [...addConFields];
        const lastfield = setelement.length > 0 && setelement[row].Entities.length > 0 ? Number(setelement[row].Entities[setelement[row].Entities.length - 1].field) + 1 : 1;
        let objarr = [...setelement[row].Entities]
        objarr.push({ field: lastfield, node: '', VirtualInstr: '', billing_Date: 'none', communication_channel: 'none' })
        let obj = { ...setelement[row] }
        obj.Entities = objarr
        setelement[row] = obj
        // console.log(setelement,"setelementsetelement",objarr,obj)
        setAddConFields(setelement);
    }

    const onHandleContract = (e, row) => {
        let setelement = [...addConFields]; // clone the array
        let obj = { ...setelement[row] }; // clone the object at the row index
    
        if (setelement.map(x => x.contract).includes(e.target.value)) {
            obj.contract = '';
            SetMessage("Contract Already Exist");
            SetType("warning");
            setOpenSnack(true);
        } else {
            obj.contract = e.target.value;
        }
    
        setelement[row] = obj;
        setAddConFields(setelement); // update state with cloned & modified data
    };

    function deleteContractRow(val) {
        let setelement = [...addConFields];
        let removed = setelement.filter(x => x.field !== val);
        setAddConFields(removed);
    }

    function AddContractField() {
        let setelement = [...addConFields];
        const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
        setelement.push({ field: lastfield, contract: '', Entities: [{ field: 1, node: '', VirtualInstr: '', billing_Date: 'none', communication_channel: 'none' }] });
        setAddConFields(setelement);
    }

    const handleDialogClosefn = () => {
        props.handleTimeDialogClose()
    }
    

    const BillingOption = [
        { id: "none", value: "None" },
        { id: 1, value: '1' },
        { id: 2, value: '2' },
        { id: 3, value: '3' },
        { id: 4, value: '4' },
        { id: 5, value: '5' },
        { id: 6, value: '6' },
        { id: 7, value: '7' },
        { id: 8, value: '8' },
        { id: 9, value: '9' },
        { id: 10, value: '10' },
        { id: 11, value: '11' },
        { id: 12, value: '12' },
        { id: 13, value: '13' },
        { id: 14, value: '14' },
        { id: 15, value: '15' },
        { id: 16, value: '16' },
        { id: 17, value: '17' },
        { id: 18, value: '18' },
        { id: 19, value: '19' },
        { id: 20, value: '20' },
        { id: 21, value: '21' },
        { id: 22, value: '22' },
        { id: 23, value: '23' },
        { id: 24, value: '24' },
        { id: 25, value: '25' },
        { id: 26, value: '26' },
        { id: 27, value: '27' },
        { id: 28, value: '28' },
        { id: 29, value: '29' },
        { id: 30, value: '30' },
        { id: 31, value: '31' }
    ]



    return (
        <React.Fragment>

            <React.Fragment>
                <Toast type={type} message={message} toastBar={openSnack} handleSnackClose={() => setOpenSnack(false)} ></Toast>
                <ModalHeaderNDL>
                    <TypographyNDL variant="heading-02-s" model value={"Energy Contract"} />

                </ModalHeaderNDL>
                <ModalContentNDL>
                    <div className="flex gap-2 items-center mb-3 justify-between">
                        <div className="flex flex-col gap-0.5">
                            <TypographyNDL variant="label-02-s" value={"Energy Contract"} />
                            <TypographyNDL variant="paragraph-xs" color={"secondary"} value={"Enabling this allows you to organize your energy contracts, track usage, and stay in control of costs"} />

                        </div>

                        <SwitchCustom
                        size="small"
                            switch={true}
                            checked={IsContract}
                            onChange={(e) => handleCheck(e)}
                            primaryLabel={''}
                        />
                    </div>
                    <Grid container spacing={3} style={{ paddingTop: 12 }}>



                        {addConFields.map((val, i) => {
                            return (
                                <React.Fragment>
                                    <Grid item xs={11} sm={11}>
                                        <SelectBox
                                            labelId="test"
                                            id="test-water"
                                            auto
                                            label={t('Contract')}
                                            options={updatedEntityOption}
                                            value={val.contract}
                                            onChange={(e) => onHandleContract(e, i)}
                                            keyValue="name"
                                            keyId="id"
                                        />

                                    </Grid>

                                    <Grid item xs={1} sm={1} style={{ display: 'flex', alignItems: 'end' }}>
                                        {
                                            addConFields.length !== 1 &&
                                            <Button icon={Delete} danger type={'ghost'} onClick={() => deleteContractRow(val.field)} />

                                        }
                                    </Grid>
                                    {val.Entities.map((x, idx) => {
                                        return (
                                            <React.Fragment>
                                                <Grid item xs={3} sm={3}>
                                                    <SelectBox
                                                        labelId="test"
                                                        id="test-asset"
                                                        auto
                                                        label={t('Entity')}
                                                        options={entity.filter(f => f.entity_type === 2)}
                                                        value={x.node}
                                                        onChange={(e) => onHandleNodes(e, i, idx)}
                                                        keyValue="name"
                                                        keyId="id"
                                                    />
                                                </Grid>
                                                <Grid item xs={3} sm={3}>
                                                    <SelectBox
                                                        labelId="Nodes"
                                                        id="combo-box-Nodes-LPG"
                                                        label={t('Actual')}
                                                        auto
                                                        options={vInstruments}
                                                        value={x.VirtualInstr}
                                                        onChange={(e) => onHandleActual(e, i, idx)}
                                                        keyValue="name"
                                                        keyId="id"
                                                    />
                                                </Grid>
                                                <Grid item xs={2} sm={2}>
                                                    <SelectBox
                                                        labelId="test"
                                                        id="test-water"
                                                        label={t('Billing Date')}
                                                        options={BillingOption}
                                                        value={x.billing_Date}
                                                        onChange={(e) => onHandleBillDate(e, i, idx)}
                                                        keyValue="value"
                                                        keyId="id"
                                                        noSorting
                                                    />

                                                </Grid>
                                                <Grid item xs={3} sm={3}>
                                                    <SelectBox
                                                        labelId="test"
                                                        id="test-water"
                                                        auto
                                                        label={t('Communication Channel')}
                                                        options={props.CommunicationChannel}
                                                        value={x.communication_channel}
                                                        onChange={(e) => onHandleCommunication(e, i, idx)}
                                                        keyValue="name"
                                                        keyId="id"
                                                    />

                                                </Grid>
                                                <Grid item xs={1} sm={1} style={{ display: 'flex', alignItems: 'end' }}>
                                                    {
                                                        val.Entities.length !== 1 &&
                                                        <Button icon={Delete} danger type={'ghost'} onClick={() => deleteEntityRow(i, x.field)} />
                                                    }
                                                </Grid>
                                            </React.Fragment>
                                        )
                                    })}

                                    <Grid item xs={12} sm={12} style={{ marginLeft: 'auto' }}>
                                        <Button   type={'ghost'} value={t("Add New")} onClick={() => AddEntityField(i)} icon={Plus} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{ margin: '16px 0' }}>
                                        <HorizontalLine variant="divider1" />
                                    </Grid>

                                </React.Fragment>
                            )
                        })}

                        <Grid item xs={12} sm={12} style={{ marginLeft: 'auto' }}>
                            <Button type="tertiary" value={t("Add Contract")} disabled={updatedEntityOption.every(item => item.disabled === true)} onClick={() => AddContractField()} icon={Plus} />
                        </Grid>
                    </Grid>
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

                    <Button type="primary" value={t('Update')}  onClick={() => SaveContract()} />
                </ModalFooterNDL>
            </React.Fragment >

        </React.Fragment>

    );

})

export default EditContract;
