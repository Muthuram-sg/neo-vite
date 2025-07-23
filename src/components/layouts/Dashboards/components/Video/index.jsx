
import React, {  useEffect } from "react";


import useDashboardFetch from "../../hooks/useGetDashboardUploads.jsx"
import '../index.css';

const VideoComponent = (props) => {
    
    const {
        dashboardFetchData,
        getFetchDashboardUploadsDocs
    } = useDashboardFetch()
    
    useEffect(() => {
        if(props.meta?.url){
            getFetchDashboardUploadsDocs(props?.meta?.url?.id)
        }
    }, [props.meta?.url])

    function isBase64(str) {
        try {
            // console.clear()
            // console.log(str)
        
            // return btoa(atob(str)) === str;
        //   return Buffer.from(str, 'utf-8').toString('base64') === str;

            // const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
            // return base64Regex.test(str);

            return typeof str === 'string' && /^[A-Za-z0-9+/=]+$/.test(str);
        } catch (err) {
          return false;
        }
      }

    // useEffect(() => {
    //     dashboardFetchData?.data?.name?.split('.')[1]
    // }, [dashboardFetchData])


    return (
        <div style={{ height:'100%' }}>
            
            {(typeof(props?.meta?.url) === 'string' && props?.meta?.url?.includes('youtu.be')) ? 
                <iframe width={props.width} height={props.height} 
                    src={`https://www.youtube.com/embed/${props.meta.url?.split('/')?.[3]}`}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                >
            </iframe>
            : 
            <video style={{width: props.width, height: props.height-5}} src={isBase64(dashboardFetchData?.data?.video) ? `data:video/${dashboardFetchData?.data?.name?.split('.')?.[1]};base64,${dashboardFetchData?.data?.video}` : props?.meta?.url }  autoplay={true} controls>
                {/* <source src={`data:video/webm;base64,${dashboardFetchData?.data?.video}`} /> */}
                    Your browser does not support the video tag.
            </video>
             }
        </div>
    )
}

export default VideoComponent;