import React,{useEffect, useState} from 'react';
import ImageSlider from 'react-simple-image-slider';
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
function ImageWidget(props){
    const [images, setImages] = useState([]);
    const { t } = useTranslation();
    console.log(props.meta.src,"props.meta.srcprops.meta.src")
    useEffect(() => {
        if (Array.isArray(props.meta.src)) {
          console.log(props.meta.src,"props.meta.srcprops.meta.src")
          const formattedImages = props.meta.src.map(item => {
          
            return { url: item.src};
          });
          setImages(formattedImages);
        }
      }, [props.meta, props.width, props.height]);

      useEffect(() => {
        // Trigger re-render when width or height changes
        setImages(prevImages => [...prevImages]);
      }, [props.width, props.height]);
  
    return(
        images.length > 0 ?
        <div style={{display: 'flex',justifyContent: 'center'}}>
          {console.log("IMAGES____\n",images.length, images)}
            {/* <img src={source} alt="imagewidget" style={{width:props.width-10,height:props.height-30}}/> */}
            <ImageSlider
            width={props.width - 10}
            height={props.height - 30}
            images={images}
            showBullets={false}
            showNavs={images.length === 1 ? false : true}
             navStyle={{
    top: '50%',       
  
  }}
            />
        </div>
        :(
            <div style={{textAlign: 'center'}}>
                <Typography variant="4xl-body-01" style={{color:'#0F6FFF'}} value={t("No Data")} />
            </div>                
        )
    )
}
export default ImageWidget;