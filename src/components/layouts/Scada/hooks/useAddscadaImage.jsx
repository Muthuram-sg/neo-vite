import { useState } from "react";
import configParam from "config"; 
import Mutation from "components/layouts/Mutations";

const useAddscadaImage = () => {
    const [AddscadaImageLoading, setLoading] = useState(false);
    const [AddscadaImageData, setData] = useState(null);
    const [AddscadaImageError, setError] = useState(null);

    const getAddscadaImage = async (body) => {
        console.log("getAddscadaImage",body.get("line_id"),body.get("image").name)
        // return false
        setLoading(true);
        await configParam.RUN_REST_API('/settings/scadaImageUpload', body,"","",'POST',true)
            .then(async(res) => {
                
                if (res !== undefined) {
                    console.log(res,"resgetAddscadaImage")
                    if(res.Data === 'File Upload successfully'){
                        let param={"image_name": body.get("image").name,"line_id": body.get("line_id")}
                        let imageInsert = await configParam.RUN_GQL_API(Mutation.scada_image,param)
                        .then((imgres) => {
                            if (imgres !== undefined && imgres.insert_neo_skeleton_scada_attachment) {
                            return imgres.insert_neo_skeleton_scada_attachment;
                            }
                            else {
                            return null;
                            }
                        })
                        .catch((e) => {
                        return null;
                        }); 
                        setData({data:res.Data,record:imageInsert})
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
    return { AddscadaImageLoading, AddscadaImageData, AddscadaImageError, getAddscadaImage };
};

export default useAddscadaImage;