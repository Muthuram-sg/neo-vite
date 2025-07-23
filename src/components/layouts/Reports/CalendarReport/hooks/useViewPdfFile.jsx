import { useState } from "react";
import configParam from "config";

const useViewPdfFiles = () => {
  const [ViewPdfFilesLoading, setLoading] = useState(false);
  const [ViewPdfFilesData, setData] = useState(null);
  const [ViewPdfFilesError, setError] = useState(null);

  const getViewPdfFiles = async (reportid,path,download) => {
    setLoading(true); 
    const url = '/iiot/viewCalendarFiles';
    await configParam.RUN_REST_API(url, { reportId: reportid,path_name:path })
      .then((response) => {        
        if (response.data) {
            if(download){
              let responseData = {...response.data}
              responseData.isDownload = true
              setData(responseData);

            }else{
              setData(response.data);

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
      });
  };
 
  return { ViewPdfFilesLoading, ViewPdfFilesData, ViewPdfFilesError, getViewPdfFiles };
};

export default useViewPdfFiles;