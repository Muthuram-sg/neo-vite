import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import {selectedPlant } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

const useUpdateshift = () => {
    const [updateshiftwithoutIDLoading, setLoading] = useState(false);
    const [updateshiftwithoutIDData, setData] = useState(null);
    const [updateshiftwithoutIDError, setError] = useState(null);
    const [headPlant,setheadPlant] = useRecoilState(selectedPlant);

    const getupdateshiftwithoutID = async (variables) => {
        setheadPlant({...headPlant,shift:variables.shift})
        setLoading(true);
        configParam.RUN_GQL_API(mutations.UpdateShitTimings, variables)
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Update Calendar Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updateshiftwithoutIDLoading, updateshiftwithoutIDData, updateshiftwithoutIDError, getupdateshiftwithoutID };
}


export default useUpdateshift;