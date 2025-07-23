import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";

const useDelreasonsDT = () => {
    const [headPlant] = useRecoilState(selectedPlant);
    const [delreasonsDTwithoutIDLoading, setLoading] = useState(false);
    const [delreasonsDTwithoutIDData, setData] = useState(null);
    const [delreasonsDTwithoutIDError, setError] = useState(null);

    const getdelreasonsDTwithoutID = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteDowntime, { id: id,line_id:headPlant.id })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Delete Downtime Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { delreasonsDTwithoutIDLoading, delreasonsDTwithoutIDData, delreasonsDTwithoutIDError, getdelreasonsDTwithoutID };
}


export default useDelreasonsDT;