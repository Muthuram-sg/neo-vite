import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddproducts = () => {
    const [addproductswithoutIDLoading, setLoading] = useState(false);
    const [addproductswithoutIDData, setData] = useState(null);
    const [addproductswithoutIDError, setError] = useState(null);

    const getaddproductswithoutID = async (datas, line_id,expected_energy,moisture_in,moisture_out,cycleUnit,energyUnit) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addproducts, { product_id: datas.product_id, name: datas.name, unit: datas.unit, info: {}, line_id: line_id, user_id: datas.user_id,expected_energy : expected_energy,moisture_in: moisture_in,moisture_out: moisture_out, cycle_time_unit: cycleUnit, expected_energy_unit: energyUnit, 
            is_micro_stop: datas.isMicroStop,
            mic_stop_from_time: datas.micStopFromTime,
            mic_stop_to_time: datas.micStopToTime,})
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Add Product Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addproductswithoutIDLoading, addproductswithoutIDData, addproductswithoutIDError, getaddproductswithoutID };
}


export default useAddproducts;