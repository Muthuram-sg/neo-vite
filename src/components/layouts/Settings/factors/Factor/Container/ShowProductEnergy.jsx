import React, { useState, useEffect } from 'react'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Grid from "components/Core/GridNDL";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { VirtualInstrumentsList, selectedPlant } from 'recoilStore/atoms'

const ShowProductEnergy = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant)
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [ProductEnergy, setProductEnergy] = useState('')

    useEffect(() => {
        setTimeout(() => {
            setProductEnergy(headPlant.node && headPlant.node.product_energy ? headPlant.node.product_energy : '')
        }, 300)
        console.log(headPlant.node)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    const UnitOption = [{ id: 1, name: 'square Unit' }, { id: 2, name: 'Ton' },{id:3,name:"SqM on 6 m2 basis" }]

    const PrimaryOption = [{ id: 1, name: 'Product' }, { id: 2, name: 'Characteristics' }]

    const ProductOption = [{ id: 1, name: 'Tint' }, { id: 2, name: 'Thickness' }, { id: 3, name: 'Family' }]

    return (

        <React.Fragment>
            <Grid container spacing={3} style={{ padding:"16px 0px 16px  0px" }}>
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
                        keyValue="name"
                        keyId="id"
                        error={false}
                        disabled={true}
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
                        keyValue="name"
                        keyId="id"
                        error={false}
                        disabled={true}
                    />
                </Grid>

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
                        keyValue="name"
                        keyId="id"
                        error={false}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={6} sm={6} style={{ display: 'flex', alignItems: 'end' }}>
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
                                keyValue="name"
                                keyId="id"
                                error={false}
                                disabled={true}
                            /></div>}
                </Grid>
            </Grid>
        </React.Fragment >

    )
});

export default ShowProductEnergy;


