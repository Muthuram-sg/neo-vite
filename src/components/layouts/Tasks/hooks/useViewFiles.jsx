import { useState } from "react";
import configParam from "config";

const useViewFiles = () => {
  const [ViewFilesLoading, setLoading] = useState(false);
  const [ViewFilesData, setData] = useState(null);
  const [ViewFilesError, setError] = useState(null);

  const getViewFiles = async (taskId) => {
    setLoading(true); 
    const url = '/tasks/viewTaskFiles';
    await configParam.RUN_REST_API(url, { taskid: taskId })
      .then((response) => {        
        if (response && Array.isArray(response.data)) {

            let files = []
            // eslint-disable-next-line array-callback-return
            response.data.map((val, index) => {
                if (val.baseImage) {
                    let base64Str = val.baseImage;

                    if(val.image_path.split('.')[1] === "pdf"){
                      if(val.baseImage === "File does not exist"){
                        files.push({ base64: val.baseImage, image_path: val.image_path })
                      }else{
                        files.push({ base64: "data:application/pdf;base64," + base64Str, image_path: val.image_path })

                      }
                    }
                    else{ 
                      if(val.baseImage === "File does not exist"){
                      files.push({ base64: val.baseImage, image_path: val.image_path })
                        
                      }else{
                        files.push({ base64: "data:image/png;base64," + base64Str, image_path: val.image_path })

                      }

                    }
                } else {
                    files.push({ image_path: val.image_path })
                }
            })
          setData(files);
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
      });
  };
 
  return { ViewFilesLoading, ViewFilesData, ViewFilesError, getViewFiles };
};

export default useViewFiles;