import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetDashboardList = () => {
    const [DashboardListLoading, setLoading] = useState(false); 
    const [DashboardListError, setError] = useState(null); 
    const [DashboardListData, setData] = useState(null); 

    const getDashboardList = async (lineID,UserID,isinitial) => {

        setLoading(true);

    
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        let curtoken 
        if(childLine && childLine.length>0){
            let Lines = childLine.filter(e=> e.line_id === lineID)
            if(Lines.length>0){
                curtoken = childLine.filter(e=> e.line_id === lineID)[0].token
            }  
        } 

        await configParam.RUN_GQL_API(Queries.DashboardList,{"line_id": lineID,"user_id": UserID},curtoken)
        
            .then((returnData) => {  
                       
                  if (returnData !== undefined && returnData) { 
              
                    let dashboard = [];
                    if(returnData.neo_skeleton_dashboard){
                    

                        let list = {};
                        const alteredList = returnData.neo_skeleton_dashboard.map(x=>{
                            let y = {...x};
                            y['updated_by'] = y && y.userByUpdatedBy && y.userByUpdatedBy.name ?y.userByUpdatedBy.name:"";
                            return y;
                        })
                        list['dashboardList'] =alteredList;
         

                        dashboard.push(list);
                    }
                    if(returnData.neo_skeleton_user_default_dashboard){ 


                        let currentDashboard = {};
                        currentDashboard['currentDashboard'] = returnData.neo_skeleton_user_default_dashboard;
                        currentDashboard["isinitial"] = isinitial
                        dashboard.push(currentDashboard);
                    } 
              

                    setData(dashboard)
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
    return {  DashboardListLoading, DashboardListData, DashboardListError, getDashboardList };
};

export default useGetDashboardList;