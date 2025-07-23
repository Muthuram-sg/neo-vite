import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useStandardDashboardList = () => {
    const [StandardDashboardListLoading, setLoading] = useState(false);
    const [StandardDashboardListError, setError] = useState(null);
    const [StandardDashboardListData, setData] = useState(null);

    const GetStandardDashboardList = async (line_id) => {
        console.log("Starting GetStandardDashboardList...",line_id);
        setLoading(true);
        try {
            const response = await configParam.RUN_GQL_API(Queries.GetStandardDashboardList, {line_id: line_id });
            
            console.log("Response received:", response); 

            if (response && response.neo_skeleton_modules) {
                const modules = response.neo_skeleton_modules || [];
                console.log("Modules extracted:", modules); 
                // If modules are properly extracted
                setData(modules);
                setError(null);
            } else {
                console.log("Response is empty or undefined. Expected 'neo_skeleton_modules' not found.");
                setData([]); 
                setError(true); // Indicate error state
            }
        } catch (e) {
            console.error("Error occurred during fetching:", e); 
            setLoading(false); 
            setError(e); // Set error state with the error message
            setData([]); // Set empty array in case of an error
        } finally {
            console.log("Loading complete or error handled.");
            setLoading(false);
        }
    };

    console.log("StandardDashboardListData:", StandardDashboardListData);
    
    return {
        StandardDashboardListLoading,
        StandardDashboardListData,
        StandardDashboardListError,
        GetStandardDashboardList
    };
};

export default useStandardDashboardList;
