import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";
import Queries from 'components/layouts/Queries';

// const useCreateScadaView = () => {
//     const [CreateScadaViewLoading, setLoading] = useState(false); 
//     const [CreateScadaViewError, setError] = useState(null); 
//     const [CreateScadaViewData, setData] = useState(null); 

//     const getCreateScadaView = async (body,selectedUsers) => {
//         setLoading(true);

//         // Step 1: Check if SCADA name already exists
//         try {
//             const existingScada = await configParam.RUN_GQL_API(Queries.CheckScadaName, { name: body.name });
//             if (existingScada.neo_skeleton_scada_dashboard.length > 0) {
//                 setError('SCADA name already exists.');
//                 setLoading(false);
//                 return;
//             }
//         } catch (e) {
//             setLoading(false);
//             setError('Error checking SCADA name.');
//             console.error(e);
//             return;
//         }

//         // Step 2: Create SCADA view if the name does not exist
//         try {
//             const returnData = await configParam.RUN_GQL_API(Mutation.AddnewScadaView, body);
//             if (returnData && returnData.insert_neo_skeleton_scada_dashboard) {
//                 const createdScadaId = returnData.insert_neo_skeleton_scada_dashboard.id;
//                 setData(returnData.insert_neo_skeleton_scada_dashboard);

//                 // Step 3: Save each selected user in the relation table
//                 const relationPromises = selectedUsers.map((user) => 
//                     configParam.RUN_GQL_API(Mutation.AddUserToScadaViewRelation, {
//                         scada_id: createdScadaId,
//                         user_id: user.id,
//                         line_id: body.line_id,
//                     })
//                 );

//                 await Promise.all(relationPromises);
//                 setError(null);
//             } else {
//                 setData(null);
//                 setError('Failed to create SCADA view.');
//             }
//         } catch (e) {
//             console.error(e);
//             setError(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { CreateScadaViewLoading, CreateScadaViewData, CreateScadaViewError, getCreateScadaView };
// };

// export default useCreateScadaView;

// const useCreateScadaView = () => {
//     const [CreateScadaViewLoading, setLoading] = useState(false); 
//     const [CreateScadaViewError, setError] = useState(null); 
//     const [CreateScadaViewData, setData] = useState(null); 

//     const getCreateScadaView = async (body) => {
//        // console.log("Sending mutation with body:", body); 
//         setLoading(true);
//         await configParam.RUN_GQL_API(Mutation.AddnewScadaView,body)
        
//             .then((returnData) => { 
               
//                 if (returnData !== undefined && returnData.insert_neo_skeleton_scada_dashboard) {  
//                     setData(returnData.insert_neo_skeleton_scada_dashboard);
//                     setError(false);
//                 } else {
//                    // console.warn("Mutation succeeded but returned unexpected data structure", returnData);
//                     setData(null);
//                     setError(true);
//                 }
//                 setLoading(false);
//             })
//             .catch((e) => {
//                 setLoading(false);
//                 setError(e);
//                 setData(null);
//                 console.log("NEW MODEL", "ERR", e, "Reports", new Date())
//             });

//     };
//     return {  CreateScadaViewLoading, CreateScadaViewData, CreateScadaViewError, getCreateScadaView };
// };



const useCreateScadaView = () => {
    const [CreateScadaViewLoading, setLoading] = useState(false); 
    const [CreateScadaViewError, setError] = useState(null); 
    const [CreateScadaViewData, setData] = useState(null); 

    const getCreateScadaView = async (body,isDuplicate) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.AddnewScadaView, body)
            .then((returnData) => { 
                if (returnData?.insert_neo_skeleton_scada_dashboard) {  
                    if(isDuplicate){
                        setData({...returnData.insert_neo_skeleton_scada_dashboard, isDuplicate: true});
                    }else{
                        setData(returnData.insert_neo_skeleton_scada_dashboard);
                    }
                    setError(false);
                } else {
                    setData(null);
                    setError(true);
                }
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.error("Error creating SCADA view", e);
            });
    };

    const checkScadaNameExists = async (name, lineId) => {
        setLoading(true);
        try {
            const result = await configParam.RUN_GQL_API(Queries.Checkscadanamebyline, { name, line_id: lineId });
            setLoading(false);
            return result?.neo_skeleton_scada_dashboard?.length > 0;
        } catch (e) {
            setLoading(false);
            setError(e);
            console.error("Error checking SCADA name", e);
            return false;
        }
    };

    return { CreateScadaViewLoading, CreateScadaViewData, CreateScadaViewError, getCreateScadaView, checkScadaNameExists };
};



export default useCreateScadaView;