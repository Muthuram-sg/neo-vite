import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelreasons = () => {
    const [delreasonswithoutIDLoading, setLoading] = useState(false);
    const [delreasonswithoutIDData, setData] = useState(null);
    const [delreasonswithoutIDError, setError] = useState(null);

    const getdelreasonswithoutID = async (id, line_id, tag) => {
        setLoading(true);

        try {
            await configParam.RUN_GQL_API(mutations.deleteDowntime, { id: id, line_id });
            await configParam.RUN_GQL_API(mutations.deleteProQtyDefact, { _eq: id });

            if (tag.length > 0) {
                await configParam.RUN_GQL_API(mutations.deleteTag, { id: tag });
            }

            const response = await configParam.RUN_GQL_API(mutations.deleteReasons, { id: id });
            setData(response);
            setError(false);
            setLoading(false);
        } catch (e) {
            console.log("NEW MODEL", e, "Delete Reasons Setting Screen", new Date());
            setLoading(false);
            setError(e);
            setData(null);
        }
    };

    return { delreasonswithoutIDLoading, delreasonswithoutIDData, delreasonswithoutIDError, getdelreasonswithoutID };
};

export default useDelreasons;
