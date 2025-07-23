import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useEditproducts = () => {
    const [editproductswithoutIDLoading, setLoading] = useState(false);
    const [editproductswithoutIDData, setData] = useState(null);
    const [editproductswithoutIDError, setError] = useState(null);

    const geteditproductswithoutID = async (datas, user_id,expected_energy,moisture_in,moisture_out,cycleUnit,energyUnit) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.editProduct, { id: datas.id, product_id: datas.product_id, name: datas.name, unit: datas.unit, info: {}, user_id: user_id ,expected_energy :expected_energy,moisture_in: moisture_in,moisture_out: moisture_out, cycle_time_unit: cycleUnit, expected_energy_unit: energyUnit, is_micro_stop: datas.isMicroStop,
            mic_stop_from_time: datas.micStopFromTime,
            mic_stop_to_time: datas.micStopToTime})
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Edit Product Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { editproductswithoutIDLoading, editproductswithoutIDData, editproductswithoutIDError, geteditproductswithoutID };
}


export default useEditproducts;