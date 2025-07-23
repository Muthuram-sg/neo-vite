import { useState } from "react";
import configParam from "config"; 
import Mutation from "components/layouts/Mutations";

const useDeleteScadaImage = () => {
    const [DeleteScadaImageLoading, setLoading] = useState(false);
    const [DeleteScadaImageData, setData] = useState(null);
    const [DeleteScadaImageError, setError] = useState(null);

    const getDeleteScadaImage = async (body) => { 
        // return false
        setLoading(true);
        await configParam.RUN_REST_API('/settings/deleteScadaImage', body)
            .then(async(res) => {
                
                if (res !== undefined) {
                    // console.log(res,"resgetDeleteScadaImage")
                    if(res.Data === 'File Deleted successfully'){
                        let param={"id": body.id}
                        let imageDel = await configParam.RUN_GQL_API(Mutation.delete_ScadaImage,param)
                        .then((imgres) => {
                            if (imgres !== undefined && imgres.delete_neo_skeleton_scada_attachment) {
                            return imgres.delete_neo_skeleton_scada_attachment;
                            }
                            else {
                            return null;
                            }
                        })
                        .catch((e) => {
                        return null;
                        }); 
                        setData({data:imageDel,img_id:body.id})
                        setError(false)
                        setLoading(false)
                    }
                    
                    
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });
    };
    return { DeleteScadaImageLoading, DeleteScadaImageData, DeleteScadaImageError, getDeleteScadaImage };
};

export default useDeleteScadaImage;