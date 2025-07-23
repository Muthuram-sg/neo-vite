import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddorUpdateOEEConfig = () => {
    const [AddorUpdateOEEConfigLoading, setLoading] = useState(false); 
    const [AddorUpdateOEEConfigError, setError] = useState(null); 
    const [AddorUpdateOEEConfigData, setData] = useState(null); 

    const getAddorUpdateOEEConfig = async (datas, micStopTime, isStatusSignalavailable,dressing_program,dressing_signal, downfallPartCount,minmicStopTime) => {
        setLoading(true);
        let Query = Mutations.AddorUpdateOEEConfigwithoutDressing
        let param = { 
            entity_id: datas.currEntityID, 
            part_signal: datas.partSignal, 
            part_signal_instrument: datas.partInstru, 
            machine_status_signal: datas.isStatusSignal, 
            machine_status_signal_instrument: datas.isStatusSigIns , 
            planned_downtime: datas.plannedDT, 
            setup_time: datas.plannedSetupTime, 
            enable_setup_time: datas.customReport, 
            is_part_count_binary: 
            datas.binaryPartCount, 
            above_oee_value: datas.oeeValueAbove, 
            below_oee_value: datas.oeeValueBelow, 
            above_oee_color: datas.assetOoeAboveColor, 
            below_oee_color: datas.assetOoeBelowColor, 
            between_oee_color: datas.assetOoeBetweenColor, 
            mic_stop_duration: micStopTime, 
            is_status_signal_available: isStatusSignalavailable, 
            is_part_count_downfall : downfallPartCount,
            min_mic_stop_duration:minmicStopTime,
            is_standard_microstop: datas.isStandardMicrostop,
        }
        
        if(dressing_program && dressing_signal){
            Query = Mutations.AddorUpdateOEEConfig
            param = { entity_id: datas.currEntityID, part_signal: datas.partSignal, part_signal_instrument: datas.partInstru, machine_status_signal: datas.isStatusSignal, machine_status_signal_instrument: datas.isStatusSigIns , planned_downtime: datas.plannedDT, setup_time: datas.plannedSetupTime, enable_setup_time: datas.customReport, is_part_count_binary: datas.binaryPartCount, above_oee_value: datas.oeeValueAbove, below_oee_value: datas.oeeValueBelow, above_oee_color: datas.assetOoeAboveColor, below_oee_color: datas.assetOoeBelowColor, between_oee_color: datas.assetOoeBetweenColor, mic_stop_duration: micStopTime, is_status_signal_available: isStatusSignalavailable, dressing_program: dressing_program, dressing_signal: dressing_signal, is_part_count_downfall : downfallPartCount,min_mic_stop_duration:minmicStopTime, is_standard_microstop: datas.isStandardMicrostop,}
        } 
        await configParam.RUN_GQL_API(Query,param)
        
            .then((returnData) => {
              
                if (returnData.insert_neo_skeleton_prod_asset_oee_config_one) {
                    setData(returnData.insert_neo_skeleton_prod_asset_oee_config_one)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  AddorUpdateOEEConfigLoading, AddorUpdateOEEConfigData, AddorUpdateOEEConfigError, getAddorUpdateOEEConfig };
};

export default useAddorUpdateOEEConfig;