import { useState } from "react";
import configParam from "config"; 

const useTaskFileUpload = () => {
    const [fileUploadLoading, setLoading] = useState(false);
    const [fileUploadData, setData] = useState(null);
    const [fileUploadError, setError] = useState(null);

    const getTaskFileUpload = async (formData) => {
        setLoading(true);
      
        const url = "/tasks/TaskBulkUpload";
        
      
        await configParam.RUN_REST_API(url, formData, '', '', "POST", true)
          .then((response) => {
            if (response !== undefined && response) {
              setData(response);
              setError(false)
              setLoading(false)
          }

          else {
              setData(null)
              setError(true)
              setLoading(false)
          }

      })
      .catch((e) => {
          console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
          setLoading(false);
          setError(e);
          setData(null);
      })
}

return { fileUploadLoading, fileUploadData, fileUploadError, getTaskFileUpload };
}


export default useTaskFileUpload;