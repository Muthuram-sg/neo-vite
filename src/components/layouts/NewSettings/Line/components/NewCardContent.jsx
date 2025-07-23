import React, { useState , useEffect} from "react";
import CustomCardHeader from './NewCardHeader'
import GiaHierarchy from "./NewGiaHierarchy";
import { useTranslation } from "react-i18next";
import Typography from "components/Core/Typography/TypographyNDL";
import EditComp from "./EditComp";
import ModalNDL from "components/Core/ModalNDL";
import Grid from 'components/Core/GridNDL'
import axios from "axios";
import configParam from "config";
import {
  selectedPlant,
  snackMessage,
snackType,
snackToggle,
themeMode,
customIcon
} from "recoilStore/atoms";
import { useRecoilState } from "recoil";

import Cmsicon from 'assets/neo_icons/Logos/cmslogo.svg'
import CmsiconDark from 'assets/neo_icons/Logos/cmsDarkLogo.svg'
import Grindsmart from 'assets/neo_icons/Logos/GrindSmart.svg'
import Neo from 'assets/neo_icons/Logos/Neo_Logo_new.svg'
import Crion from 'assets/CRION_Logo.svg'

const ConstomCardContent = (props) => {
  const { t } = useTranslation();
  const baseUrl = window.location.hostname;
  const [model, setModel] = useState(false)
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
  const [PlantID,setPlantID] = useState([])
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [removedAsset, setRemovedAsset] = useState([])
  const [curTheme] = useRecoilState(themeMode);
  const [ customLogo, setCustomIcon ] = useRecoilState(customIcon)

  const [assets, setAssets] = useState({ light_logo : null, dark_logo: null, light_favicon: null, dark_favicon: null})
  const [light_logo, setLogoLight] = useState(null)

  const getFixedResolution = (key) => {
    switch (key) {
      case 'light_logo':
        return [150, 24];
      case 'dark_logo':
        return [150, 24];
      case 'light_favicon':
        return[32, 32]
      case 'dark_favicon':
          return[32, 32]
      default:
        break;
    }
  }

  const getImageResolutionWithCanvas = (file) => {
    return new Promise((resolve, reject) => {
      // if (!file.type.startsWith('image/')) {
      //   reject('Not an image');
      //   return;
      // }
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
  
          // draw image just in case you want to do more later
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
  
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => reject('Error loading image');
        img.src = e.target.result;
      };
  
      reader.onerror = () => reject('FileReader error');
      reader.readAsDataURL(file);
    });
  };
  

  const handleAsset = (key, file) => {
    console.log(file)
    const resolution = getFixedResolution(key)
    if(file.type === 'image/png' || file.type === 'image/svg+xml'){
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      console.clear()
      console.log(img.width, img.height)
      getImageResolutionWithCanvas(file)
      .then(({ width, height }) => {
        console.clear()
        console.log(`Canvas says: ${width}x${height}`);
        if(width > resolution[0] || height > resolution[1]){
          SetMessage(`Only ${resolution[0]}x${resolution[1]} resolutions are allowed`);
          SetType("warning");
          setOpenSnack(true);
        } else {
          setAssets({ ...assets, [key]: file})
          if(removedAsset.includes(key)){
            let temp = removedAsset.filter(x => x!==key)
            console.log(temp)
            setRemovedAsset([ ...temp ])
          } 
        }
        console.log(resolution)
      })
      .catch(console.error);
      // if(img.width > resolution[0] && img.height > resolution[1])
       
    } else {
      SetMessage('Only PNG & SVG Files are allowed');
      SetType("warning");
      setOpenSnack(true);
    }
  }

  useEffect(()=>{
  
    setPlantID(props.ChildLineID)
  },[props.userDefaultline,props.ChildLineID])


  

  const getAppropriateLogo = async(logo) => {
    try {
      let light_logo = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=${logo}&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
      let blob = new Blob([light_logo.data], { type: "image/svg+xml" })
      if(logo === 'light_logo'){
        setLogoLight(blob)
      }
      return blob
    }
    catch(e){
      return null
    }
  }

  const getCustomAsset = async() => {
    try{
      let blob, dark_blob, dark_favicon_blob, light_favicon_blob
      try {
        let light_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
        const sblob = await light_logo.blob();
        const contentType = sblob.type || light_logo.headers.get("content-type");
        // console.clear()
        // console.log("light_logo__",contentType)
        if(contentType === 'image/png'){
          blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        } else {
          let light_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
          blob =  light_logo_svg?.data ? new Blob([light_logo_svg?.data], { type: "image/svg+xml" }) : null;
        }
        // blob = light_logo.data ? new Blob([light_logo.data], { type: "image/svg+xml" }) : null;
        // blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        setLogoLight(blob)
      }
      catch(e){
        console.log("ERROR__", e)
      }

      try {
        let dark_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
        const blob = await dark_logo.blob();
        const contentType = blob.type || dark_logo.headers.get("content-type");
        // console.clear()
        // console.log("dark_logo__",contentType)
        if(contentType === 'image/png'){
          dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        } else {
            let dark_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
            // console.log(dark_logo_svg)
            dark_blob =  dark_logo_svg.data ? new Blob([dark_logo_svg?.data], { type: "image/svg+xml" }) : null;
        }
        
        // dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        
      }
      catch(e){
        console.log("ERROR__", e)
      }

      try {
        let dark_favicon = await fetch(configParam.API_URL+`/settings/downloadLogo?category=dark_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
        const blob = await dark_favicon.blob();
        const contentType = blob.type || dark_favicon.headers.get("content-type");
        // console.clear()
        // console.log("dark_favicon__",contentType)
        if(contentType === 'image/png'){
          dark_favicon_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        } else {
            let dark_favicon_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
            dark_favicon_blob = dark_favicon_svg?.data ? new Blob([dark_favicon_svg?.data], { type: "image/svg+xml" }) : null;
        }
        // dark_favicon_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
      }
      catch(e){
        console.log("ERROR__", JSON.stringify(e))
      }

      try {
        let light_favicon = await fetch(configParam.API_URL+`/settings/downloadLogo?category=light_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
        const blob = await light_favicon.blob();
        const contentType = blob.type || light_favicon.headers.get("content-type");
        // console.clear()
        // console.log("light_favicon__",contentType)
        if(contentType === 'image/png'){
          light_favicon_blob = configParam.API_URL+`/settings/downloadLogo?category=light_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
        } else {
          let light_favicon_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_favicon&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
          light_favicon_blob = light_favicon_svg?.data ? new Blob([light_favicon_svg?.data], { type: "image/svg+xml" }) : null;
        }

      }
      catch(e){
        console.log("ERROR__", e)
      }
      let array = ['light_logo', 'dark_logo', 'dark_favicon', 'light_favicon']
      
      
     
      
      // let blob = getAppropriateLogo('light_logo')
      // let dark_blob = getAppropriateLogo('dark_logo');      
      // let dark_favicon_blob = getAppropriateLogo('dark_favicon') 
      // let light_favicon_blob = getAppropriateLogo('light_favicon') 
      
     
      setAssets({ ...assets, 'dark_logo': dark_blob, 'light_logo': blob, 'dark_favicon': dark_favicon_blob, 'light_favicon': light_favicon_blob })
    }
    catch(e){
      console.log("ERROR__", e)
    }
  }

  const handleEditfunction = (value) => {
    getCustomAsset()
    localStorage.setItem('custom_name', (headPlant.custom_name !== null && headPlant.custom_name !== undefined && headPlant.custom_name !== '') ? headPlant.custom_name : 'Neo')
    setModel(true)
  };

  function handleDialogClose() {
    setModel(false)
  }

  const convertToBlob = (binaryString) => {

    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    // Create Blob
    return new Blob([byteArray], { type: "image/png" });
  };

  async function fetchImageAsBlob(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      // Get response as Blob
      const blob = await response.blob();
      console.log("Blob created:", blob);
  
      return blob;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }

  const ConvertFormData = (asset_keys) => {
    const formData = new FormData();
    formData.append('line_id', headPlant.id)
    
    asset_keys.map(async (x) => {
      if((assets[x] !== undefined || assets[x] !== null)){
        // if(typeof assets[x] === 'object' || assets[x] instanceof File){
        //   console.log(assets[x])
        //   formData.append([x], assets[x]);
        // } else if(typeof assets[x] !== 'string' || assets[x] !== undefined) {
        //   let blob = await fetchImageAsBlob(assets[x])
        //   console.log(x, assets[x])
        //   formData.append([x], blob);
        // }
        if(assets[x] instanceof File){
          console.log(assets[x])
          formData.append([x], assets[x]);
        }
      }
    })

    console.clear()
    console.log(removedAsset, typeof removedAsset)

    removedAsset.map((x) => {
      formData.append('deleted_assets[]', x)
    })

    // formData.append('deleted_assets', JSON.stringify(removedAsset))

    return formData
  }

  const handleAssetUpload = async () => {
    let asset_keys = Object.keys(assets)
    // console.log(asset_keys)
    
    console.clear()
    let formData = ConvertFormData(asset_keys)
    console.log(asset_keys, assets, removedAsset)

    try {
      const response = await axios.post(configParam.API_URL+"/settings/saveLogo", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          'x-access-token': localStorage.getItem("neoToken").replace(/['"]+/g, "")
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  useEffect(() => {
    if(headPlant.id){
      getCustomAsset()
    }
  }, [])

  const removeFile = (key) => {
    setRemovedAsset([ ...removedAsset, key])
    let temp_assets = { ...assets, [key]: null}
    temp_assets = Object.fromEntries(Object.entries(temp_assets).filter(([_, value]) => value !== null))
    // setAssets({ ...assets, [key]: ''})
    setAssets({ ...temp_assets })
  }

  const handleSaveFunction = () => {

    handleAssetUpload()
    localStorage.removeItem('logo')
    props.onHandleConfirmSave();
    
  }

  const getLogoSrc = () => {
    // if(icon !== null && icon !== undefined) {
    //   return URL.createObjectURL(icon)
    // } else {
    if (baseUrl?.toLowerCase().includes("cms")) {
      return Cmsicon;
    } 
    if (headPlant.appTypeByAppType) {
      if (baseUrl===configParam.CMSURL) {
        return Cmsicon;
      } else {
        if (headPlant.appTypeByAppType.id === 1) {
          return headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? Crion : Neo;
        } else if (headPlant.appTypeByAppType.id === 2) {
          return Grindsmart;
        } 
        else if(headPlant.appTypeByAppType.id === 3){
          if(curTheme === 'dark') {
            return CmsiconDark;
          }else{
            return Cmsicon;
          }        
        }
        
        else {
          return headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? Crion : Neo;
        }
      }
    }
    return Neo;
    // }
  };

  return (
    <React.Fragment>
       <CustomCardHeader onhandleEdit={() => handleEditfunction()} />
      <div style={{ height: 'calc(100vh - 48px)' }} className="p-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
        <Grid container >
          <Grid xs={2}>

          </Grid>
          <Grid xs={8}>
          <Typography value={'Line Details'} variant="heading-02-xs"  />
          <div className="mt-0.5" />
           <Typography value={"Personalize your factory's identity, location, and business hierarchy"} variant="paragraph-xs" color='secondary'  />
           {
            // localStorage.getItem('logo') && (
              <>
                <div className="mt-4" />
                <Typography value={'Company Logo'} variant="paragraph-xs" color='secondary' />
                <div className="mt-0.5" />
                <div style={{width: 60}}>
                  {/* <img src={light_logo ? URL.createObjectURL(light_logo) : null} alt="Preview" className="w-full h-full rounded-lg object-cover" /> */}
                  <img src={customLogo ? customLogo : getLogoSrc()} alt="Preview" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div className="mt-4" />
              </>
            // )
           }
           

            <div className="mt-4" />
            <Typography value={t("LineName")} variant="paragraph-xs" color='secondary' />
            <div className="mt-0.5" />
            <Typography value={props.lineName} variant="label-01-s" />
            <div className="mt-4" />
            <GiaHierarchy
              backgroundColor={props.backgroundColor}
              color={props.color}
              headPlantid={props.headPlantid}
              activityName={props.activityName}
              businessName={props.businessName}
              plantName={props.plantName}
            />

            {(props.type === '1') &&
              <div style={{ lineHeight: "0", marginTop: "10px" }}>
                <br></br>
                <Typography value={"Plants"} variant="paragraph-xs" color='secondary' />
                <div className="mt-0.5" />
                <Typography value={PlantID.map(plant => `${props.lineName} - ${plant.name}`).join(', ')} variant="label-01-s" />
              </div>
            }
            <div className="mt-4" />
            <Typography value={t("Location")} variant="paragraph-xs" color='secondary' />
            <div className="mt-0.5" />
            <Typography value={props.locationName} variant="label-01-s" />
          </Grid>
          <Grid xs={2}>

          </Grid>
        </Grid>

      </div>
      
      <ModalNDL disableEnforceFocus onClose={() => handleDialogClose()} aria-labelledby="entity-dialog-title" open={model}>
        <EditComp
          dialogMode={props.dialogMode}
          Editedvalue={props.Editedvalue}
          outLineUpdateLoading={props.outLineUpdateLoading}
          asset={assets}
          handleAsset={handleAsset}
          handleDialogClose={handleDialogClose}
          value={props}
          handleSaveFunction={handleSaveFunction}
          handleFile={(file, name) => { handleAsset(name, file) }}
          removeFile={(name) => removeFile(name)}
          handleFetchCustomassets={() => getCustomAsset()}
          customName={props.customName}
          // setCustomName={(value) => props.setCustomName(value)}
        />
      </ModalNDL>
    </React.Fragment>
  );
};
const isRender = (prev, next) => {
  return prev.locationRef !== next.locationRef ||
    prev.customNameRef !== next.customNameRef ||
    prev.disabled !== next.disabled ||
    prev.isDisabled !== next.isDisabled ||
    prev.nameRef !== next.nameRef ||
    prev.headPlantid !== next.headPlantid ||
    prev.activityName !== next.activityName ||
    prev.businessName !== next.businessName ||
    prev.plantName !== next.plantName ||
    prev.backgroundColor !== next.backgroundColor ||
    prev.className !== next.className ||
    prev.userDefaultline !== next.userDefaultline ||
    prev.ChildLineID !== next.ChildLineID
    ? false
    : true;
};
export default React.memo(ConstomCardContent, isRender);
