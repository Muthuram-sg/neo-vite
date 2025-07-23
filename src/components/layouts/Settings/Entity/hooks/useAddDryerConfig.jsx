import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddDryerConfig = () => {
    const [AddDryerConfigLoading, setLoading] = useState(false);
    const [AddDryerConfigData, setData] = useState(null);
    const [AddDryerConfigError, setError] = useState(null);

    const getAddDryerConfig = async (datas,total_startup_time_inst,total_startup_time,total_shutdown_time_inst,total_shutdown_time,empty_run_time_inst,empty_run_time) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.AddDryerConfig,{is_enable: datas.enable, entity_id: datas.entityid,line_id: datas.line_id,gas_energy_consumption_instrument: datas.gas_energy_inst, gas_energy_consumption: datas.gas_energy, electrical_energy_consumption_instrument: datas.electrical_energy_inst, electrical_energy_consumption1: datas.electrical_energy, moisture_input_instrument: datas.moisture_in_inst, moisture_input: datas.moisture_in, moisture_output_instrument: datas.moisture_out_inst, moisture_output: datas.moisture_out, total_sand_dried_instrument: datas.toal_sand_dried_inst, total_sand_dried: datas.toal_sand_dried, total_sand_fed_instrument: datas.total_sand_fed_inst, total_sand_fed: datas.total_sand_fed, total_scrap_instrument: datas.total_scrap_inst, total_scrap: datas.total_scrap, total_shutdown_time_instrument: total_shutdown_time_inst, total_shutdown_time: total_shutdown_time, total_startup_time_instrument: total_startup_time_inst, total_startup_time: total_startup_time, empty_run_time_instrument: empty_run_time_inst, empty_run_time: empty_run_time})
            .then((returnData) => {
             
                if (returnData.insert_neo_skeleton_dryer_config) {
                    setData(returnData.insert_neo_skeleton_dryer_config)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Entity Setting - Asset Instruments Mapping", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AddDryerConfigLoading, AddDryerConfigData, AddDryerConfigError, getAddDryerConfig };
};

export default useAddDryerConfig;