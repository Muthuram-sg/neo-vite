import { useState } from "react";
import configParam from "config";
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import mutations from "components/layouts/Mutations";

const useDelreasonsQT = () => {
    const [headPlant] = useRecoilState(selectedPlant);
    const [delreasonsQTwithoutIDLoading, setLoading] = useState(false);
    const [delreasonsQTwithoutIDData, setData] = useState(null);
    const [delreasonsQTwithoutIDError, setError] = useState(null);

    const getdelreasonsQTwithoutID = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteproQtyDefactReason, { _eq: id,line_id:headPlant.id })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Delete Quality Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { delreasonsQTwithoutIDLoading, delreasonsQTwithoutIDData, delreasonsQTwithoutIDError, getdelreasonsQTwithoutID };
}


export default useDelreasonsQT;