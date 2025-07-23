import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useScadaViewList = () => {
    const [ScadaViewListLoading, setLoading] = useState(false); 
    const [ScadaViewListError, setError] = useState(null); 
    const [ScadaViewListData, setData] = useState(null); 

    const getScadaViewList = async (lineID,UserID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getScadaViewListdashboard, {"line_id": lineID,"user_id": UserID})
        
        .then((returnData) => {  
            if (returnData !== undefined && returnData) { 
                let scadaviews = {all: [], default: {}};
                if(returnData.neo_skeleton_scada_dashboard){
                    // const alteredList = returnData.neo_skeleton_scada_dashboard.map(x=>{
                    //     let y = {...x};
                    //     y['updated_by'] = y && y.userByUpdatedBy && y.userByUpdatedBy.name ?y.userByUpdatedBy.name:"";
                    //     return y;
                    // })
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