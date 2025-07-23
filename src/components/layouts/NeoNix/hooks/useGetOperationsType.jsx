// import { useState } from "react";
// import configParam from "config"; 

// const useGetOperationsType = () => {
//     const [OperationsTypeLoading, setLoading] = useState(false);
//     const [OperationsTypeData, setData] = useState(null);
//     const [OperationsTypeError, setError] = useState(null);

//     const getOperationsType = async () => {
//         setLoading(true); 
//         let url = "/neonix-api/api/Policy/GetPolicyMasterType";
//         await configParam.RUN_REST_API(url, "",'','',"Get")
//             .then((response) => {
//                 if (response !== undefined && (response)) {
//                     setData(response.response);
//                     setError(false)
//                     setLoading(false)
//                 }

//                 else {
//                     setData(null)
//                     setError(response)
//                     setLoading(false)
//                 }

//             })
//             .catch((e) => {
//                 console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
//                 setLoading(false);
//                 setError(e);
//                 setData(null);
//             })
//     }

//     return { OperationsTypeLoading, OperationsTypeData, OperationsTypeError, getOperationsType };
// }


// export default useGetOperationsType;