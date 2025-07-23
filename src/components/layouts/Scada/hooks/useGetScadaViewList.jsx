import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useScadaViewList = () => {
    const [ScadaViewListLoading, setLoading] = useState(false); 
    const [ScadaViewListError, setError] = useState(null); 
    const [ScadaViewListData, setData] = useState(null); 

    const getScadaViewList = async (lineID,UserID) => {
        setLoading(true);
        const jsonFilter = [{ id: UserID }];
       // await configParam.RUN_GQL_API(Queries.getscadaviewList,{"line_id": lineID,"user_id": UserID})
      // await configParam.RUN_GQL_API(Queries.getscadaviewListbyplant,{"line_id": lineID})
     //  await configParam.RUN_GQL_API(Queries.GetScadadashbordbylineid,{"line_id": lineID,"jsonFilter": jsonFilter})
     await configParam.RUN_GQL_API(Queries.GetScadadashbordbylineidincluidingpublic,{"jsonFilter": jsonFilter,"line_id": lineID})
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                    let scadaviews = {all: [], default: {}};
                    if(returnData.neo_skeleton_scada_dashboard){
                      
                         scadaviews.all = returnData.neo_skeleton_scada_dashboard;
                    }
                    if(returnData.neo_skeleton_user_default_scada_dashboard){
                        scadaviews.default = returnData.neo_skeleton_user_default_scada_dashboard[0];
                    } 
                    setData(scadaviews)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  ScadaViewListLoading, ScadaViewListData, ScadaViewListError, getScadaViewList };
};

export default useScadaViewList;