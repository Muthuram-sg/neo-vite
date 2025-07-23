import { useState } from "react";
import configParam from "config";

const useDownloadFiles = () => {
  const [DownloadFilesLoading, setLoading] = useState(false);
  const [DownloadFilesData, setData] = useState(null);
  const [DownloadFilesError, setError] = useState(null);

  const getDownloadFiles = async (name) => {
    setLoading(true); 
    const url = '/tasks/downloadtaskfiles';
    await configParam.RUN_REST_API(url, { file_name: name })
      .then((response) => {      
        if (response instanceof Blob) { 
          try{
            const fileURL = URL.createObjectURL(response);
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', name);
            fileLink.setAttribute('target', '_blank');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove(); 
          }catch(err){
            console.log('err',err)
          } 
          setData(null);
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
 
  return { DownloadFilesLoading, DownloadFilesData, DownloadFilesError, getDownloadFiles };
};

export default useDownloadFiles;