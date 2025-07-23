import { useState } from "react";
import configParam from "config"; 
import Queries from "components/layouts/Queries";
import NoImage from 'assets/image-not-found.png';

const useGetscadaImages = () => {
    const [GetscadaImagesLoading, setLoading] = useState(false);
    const [GetscadaImagesData, setData] = useState(null);
    const [GetscadaImagesError, setError] = useState(null);

    const getscadaImages = async (body) => {
        console.log("getGetscadaImages",body)
        // return false
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getscada_image,body)
            .then(async(res) => {
                
                if (res !== undefined) {
                    console.log(res,"resgetGetscadaImages") 
                    Promise.all(res.neo_skeleton_scada_attachment.map(async (v) => {
                        let param={filename: "/scada/Image/"+v.image_name} 
                        let Imgsrc = await configParam.RUN_REST_API('/settings/getScadaImageUrl', param)
                        .then(async(imgres) => {
                            if(imgres){
                                
                                // if (!(imgres instanceof Blob)) {
                                //     console.error("Invalid Blob:", imgres);
                                // } else {
                                //     const imageUrl = URL.createObjectURL(imgres);
                                //     console.log("Object URL:", imageUrl);
                                // }
                                // let compressedBlob = resizeImage(imgres)
                                try{
                                    const imageUrl = URL.createObjectURL(imgres); // Create a local URL
                                    return {...v,src: imageUrl}
                                }catch(e){
                                    console.log(e,"ImmageError")
                                    return {...v,src: NoImage }    
                                }
                                
                                 
                            }{
                                return {...v,src: NoImage }
                            } 
                            
                            // document.getElementById("scadaimg").src = imageUrl;
                            
                        })
                        // console.log(Imgsrc,"imgurlimgurl")
                        return Imgsrc
                    }))
                    .then((res) => {
                        // console.log(res,"imgurlimgurlFinal")
                        setData(res)
                        setError(false)
                        setLoading(false) 
                    })
                         
                        
                        // configParam.API_URL + "/settings/getAssertImageUrl?filename=/" + file.name + "&x-access-token=" + res;
                        
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

   
    
    return { GetscadaImagesLoading, GetscadaImagesData, GetscadaImagesError, getscadaImages };
};

export default useGetscadaImages;