/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import '../../components/style/plantsearch.css';
import Typography from "components/Core/Typography/TypographyNDL";
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL'
import ToolTip from "components/Core/ToolTips/TooltipNDL.jsx"
import useTheme from 'TailwindTheme';
import { useAuth } from "../Context";
import gqlQueries from "../../components/layouts/Queries"
import { useRecoilState } from "recoil";
import Close from 'assets/neo_icons/close.svg?react';
import ClickAwayListener from 'react-click-away-listener';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';



import {
    Loadingpanel,
    user,
    userDefaultLines,
    selectedPlant,
    selectedPlantIndex,
    lineEntity,
    selDashData,
    selDashLayout,
    dashboardCoreData,
    selDashPoints,
    defaultDashboard,
    userLine,
    currentUserRole,
    userRoleList,
    defaultHierarchyData,
    oeeAssets,
    hierarchyData,
    selHierIndex,
    instrumentsList,
    VirtualInstrumentsList,
    themeMode,
    entrycount,
    metricsList,
    assetSelected,
    assetDetails,
    instrumentsArry,
    QualityMetrics,
    oeeProdData,
    ExpandedNodeList,
    pickerDisable,
    assetList,
    defects,
    defectseverity,
    faultRecommendations,
    sensordetails,
    assetHierarchy,
    metricGroupHierarchy,
    instrumentHierarchy,
    hierarchyvisible,
    exploreSelectetdHierarchy,
    expandedNodeIdHierarchy,
    resources,
    ProductList,
    LineHaveLicense,
    AiConversation, 
    showOEEAsset,
    saAssetArray
} from "recoilStore/atoms";

import configParam from "../../config";
import { useTranslation } from 'react-i18next';
import useMultiLineEntity from "Hooks/useMultiLineEntityList";
import useHierarchyAssetList from "Hooks/useHierarchyAssetList";
import useInstrumentList from 'Hooks/useInstrumentList';
import useGetProductsList from 'Hooks/useGetProductsList';
import SelectorLocation from 'assets/neo_icons/Logos/selector_location.svg?react';
import useGetGroupMetric from "components/layouts/Settings/MetricsGroup/hooks/useGetGroupMetric.jsx"
import useGetPlantAsset from './Hooks/useGetAssets';
import axios from "axios";

export default function LocationSelect(props) {
    const theme = useTheme()
    const [curTheme] = useRecoilState(themeMode);
    const [, setconversation] = useRecoilState(AiConversation) 
    let navigate = useNavigate();
    const [isLineHaveLicense, setisLineHaveLicense] = useRecoilState(LineHaveLicense)
    const {GroupMetricLoading, GroupMetricData, GroupMetricError, getGroupMetrics} = useGetGroupMetric();
    const { plantAssetLoading, plantAssetData, plantAssetError, getPlantAssets } = useGetPlantAsset();
    
    let gotoSettings=localStorage.getItem('gotoAccess')=== 'settings'
    const classes = {
        menuList: {
            fontSize: 13,
            borderRadius: 4,
            padding: '6px 0 0 6px',
            '&:hover': {
                background: '#EFEFEF',
            }
        },
        input: {
            height: '0.5rem',
            padding: '2.5px 4px !important'
        },
        option: {
            borderBottom: "1px solid #E8E8E8",
            marginBottom: "5px"
        },
        inputroot: {
            backgroundColor: '#E8E8E8'
        },
        selectedMenu: {
            fontWeight: 'bold',
            backgroundColor: curTheme === 'light' ? '#fff !important' : "#262626 !important",

        },
        plantTitle: {
            color: theme.colorPalette.primary,
            width: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        plantHier: {
            color: curTheme === 'light' ? '#585757' : 'aaa5a5',
            textTransform: 'lowercase',
            width: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: "0px"
        },
        searchBox: {
            width: '100%',
            height: 32,
            background: theme.colorPalette.inputFields,
            borderRadius: '4px',
            padding: '4px 8px',
            gap: '10px',
            border: '1px solid' + theme.colorPalette.divider,
            fontSize: '16px',
            fontWeight: '400',
            color: theme.colorPalette.primary,
            '&:focus-visible': {
                outline: 0,
            }
        },
        searchWrapper: {
            borderRadius: "8px",
            background: theme.colorPalette.dropdown,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
        },
        menuUl: {
            maxHeight: 400,
            overflowY: 'auto'
        },
        closeIcon: {
            position: 'absolute',
            right: 10,
            cursor: 'pointer'
        },
        label: {
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 5
        },
        menuItem: {
            '&:hover': {
                background: theme.colorPalette.hover,
                borderRadius: 4
            }
        },
        Buttonlabel: {
            justifyContent: 'space-around'
        },
        hoverList: {
            background: theme.colorPalette.hover,
            borderRadius: 4
        },
        divider: {
            background: theme.colorPalette.divider,
            marginTop: 4,
            marginBottom: 4

        }
    }
    const { t } = useTranslation();
    // eslint-disable-next-line no-unused-vars 
    const [, setSelectedIndex] = useRecoilState(selectedPlantIndex);
    const [userDefaultList] = useRecoilState(userDefaultLines);
    const [lines, setLines] = useState([]);
    const [currUser] = useRecoilState(user);
    const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
    const [, setOEEAssets] = useRecoilState(oeeAssets);
    const [, setEntity] = useRecoilState(lineEntity);
    const [, setUserforLine] = useRecoilState(userLine);
    const [, setUserRole] = useRecoilState(currentUserRole);
    const [, setUserRoleListData] = useRecoilState(userRoleList);
    const [, setDefaultHierarchyData] = useRecoilState(defaultHierarchyData);
    const [, setHierarchyData] = useRecoilState(hierarchyData);
    const [, setHierIndex] = useRecoilState(selHierIndex);
    const [, setCoreDashboard] = useRecoilState(dashboardCoreData);
    const [, setDefDashData] = useRecoilState(selDashData);
    const [, setDefDashLayout] = useRecoilState(selDashLayout);
    const [, setdashPoints] = useRecoilState(selDashPoints);
    const [, setOEEData] = useRecoilState(oeeProdData);
    const [, setSelectedAssetID] = useRecoilState(showOEEAsset);
    const [, setInstruments] = useRecoilState(instrumentsList);
    const [, setVirtualInstruments] = useRecoilState(VirtualInstrumentsList);
    const [, setAssetArray] = useRecoilState(saAssetArray);
    const [autoComplete, setAutoComplete] = useState(false);
    const [entCount, setEntryCount] = useRecoilState(entrycount);
    const [, setMetricList] = useRecoilState(metricsList);
    const [, setLoadPanel] = useRecoilState(Loadingpanel);
    const [, setSelectedAsset] = useRecoilState(assetSelected);
    const [, setassetList] = useRecoilState(assetList)
    const [, setdefecttypes] = useRecoilState(defects)
    const [, setdefectsseverity] = useRecoilState(defectseverity)
    const [, setfaultRecommendations] = useRecoilState(faultRecommendations)
    const [, setsensordetails] = useRecoilState(sensordetails)
    const [, setAssetDetails] = useRecoilState(assetDetails);
    const [hoveredItem, setHoveredItem] = useState(0);
    const [searchArr, setSearchArr] = useState([]);
    const [fieldVal, setFieldVal] = useState('')
    const inputRef = useRef();
    const [, setInstrumentList] = useRecoilState(instrumentsArry);
    const [, setSavedQualityMetrics] = useRecoilState(QualityMetrics)
    const [, setDateDisabled] = useRecoilState(pickerDisable);
    const [, setresourcetypes] = useRecoilState(resources)
    const [, setProducts] = useRecoilState(ProductList)
    const [, setHierarchyAsset] = useRecoilState(assetHierarchy);
    const [, setMetricGroupAsset] = useRecoilState(metricGroupHierarchy);
    const [, setHierarchyInstrument] = useRecoilState(instrumentHierarchy);
    const [, setShowHierarchy] = useRecoilState(hierarchyvisible)
    const [, setSelectedHierarchy] = useRecoilState(exploreSelectetdHierarchy);
    const [, setExpandedNodeIDArrays] = useRecoilState(expandedNodeIdHierarchy);

    const [, setDefaultExpandNodeList] = useRecoilState(ExpandedNodeList);
    const { MultiLineEntityListLoading, MultiLineEntityListData, MultiLineEntityListError, getMultiLineEntityList } = useMultiLineEntity();
    const { hierarchyAssetListLoading, hierarchyAssetListData, hierarchyAssetListError, hierarchyAssetList } = useHierarchyAssetList();
    const { instrumentListLoading, instrumentListData, instrumentListError, instrumentList } = useInstrumentList();
    const { ProductListLoading, ProductListData, ProductListError, getProductList } = useGetProductsList();
    const [weatherData, setWeatherData] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const { setAuthTokens } = useAuth();
    let { schema,} = useParams();
    let locPath = useLocation()
   

    useEffect(() => {
        getParameterList()
        getLineDetails()
        // alert("1")
        // eslint-disable-next-line
    }, [userDefaultList])

useEffect(() => {
if(props.open){
    handleClosePlantSearch()
}
},[props.open])
    useEffect(() => {
        if(headPlant && headPlant.name && typeof window.clarity === 'function' ){
            window.clarity('set', 'Plant', headPlant.name);
        }
        if (headPlant.area_name) {
            (async () => {
                let url = "https://api.openweathermap.org/data/2.5/weather?q=" + headPlant.area_name + "&units=metric&appid=47fd245736ab4d7ed57d79abb247fbb7";
                await fetch(url, {
                    method: 'GET',
                    redirect: 'follow'
                })
                    .then(response => response.json())
                    .then(result => {
                        setWeatherData(result)
                    })
                    .catch(error => console.log('Weather error', error));
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);



    const getLineDetails = () => {
        if (userDefaultList.length !== 0 && entCount === 0) {
            let plantSchema = ""
            if (schema ) {
                plantSchema = schema;
            } else { 
                plantSchema = localStorage.getItem('plantid')
                
            } 
            
            if(locPath.pathname.split('/')[1] === 'neo'){
                let formatted = userDefaultList.map(x => x.line); 
                
                let fromIndex = formatted.findIndex(x => x.id === locPath.pathname.split('/')[3])
                let checkOldPlant= formatted.find(x => x.id  === locPath.pathname.split('/')[3]);
                plantSchema=checkOldPlant ? checkOldPlant.plant_name : plantSchema;
                navigate("/"+plantSchema + "/"+locPath.pathname.split('/')[2] )
                //  console.log(formatted,"formattedINN",fromIndex)
                if (fromIndex >= 0) {
                   let element = formatted[fromIndex];
                   formatted.splice(fromIndex, 1);
                   formatted.splice(0, 0, element);
               }
           
            
                   if (formatted[fromIndex]) {
                       handleChange(formatted[fromIndex], 0, null)
                   }
                   else {
                    handleChange(formatted[0], 0, null)
                       console.log("User doesn't have access to the previously selected plant")
                   }
   
               
               setEntryCount(1);
               setLines(formatted);
               setSearchArr(formatted);
            }else{
                let oldPlantId=locPath.pathname.split('/')[1];
                let formatted = userDefaultList.map(x => x.line);
                let fromIndex 
                let checkOldPlant= formatted.find(x => x.id  === oldPlantId);
                plantSchema=checkOldPlant ? checkOldPlant.plant_name : plantSchema
                if(plantSchema && (formatted.findIndex(x => x.plant_name === plantSchema) == -1) ){
                    fromIndex = formatted.findIndex(x => x.plant_name === locPath.pathname.split('/')[1])
                }else{
                    fromIndex = formatted.findIndex(x => x.plant_name === plantSchema)
                }
                 if (fromIndex >= 0) {
                     let element = formatted[fromIndex];
                     formatted.splice(fromIndex, 1);
                     formatted.splice(0, 0, element);
                 }
            //    console.log(plantSchema,"plantSchema",formatted[0])
                 if (plantSchema !== 'plantschema') {
                     if (formatted[0] && fromIndex >= 0) {
                         handleChange(formatted[0], 0,null) 
                     } else{
                        navigate("/AccessCard")
                    }
     
                 } else{
                    if(formatted.length>0){
                        handleChange(formatted[0], 0,null) 
                    }else{
                        navigate("/AccessCard")
                    }
                    
                 }
                 setEntryCount(1);
                 setLines(formatted);
                 setSearchArr(formatted); 
            }
            
                
           

           
        } 
    }
    useEffect(() => {
        if (document.querySelector('.wrapper')) {
            let lineEl = document.createElement("p");
            lineEl.textContent = 'Select Line';
            document.querySelector('.wrapper').prepend(lineEl);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoComplete])
    useEffect(() => {
        getGroupMetrics(headPlant.id)
        setSavedQualityMetrics([])
        if (headPlant.id) {
            getIntru(headPlant)
            getOEEAssets(headPlant.id)
        }
        configParam.RUN_GQL_API(gqlQueries.getRoles, {})
            .then((data) => {
                setUserRoleListData(data.neo_skeleton_roles);
            });
        configParam
            .RUN_GQL_API(gqlQueries.getSavedQualityMetrics, {
                line_id: headPlant.id,
            })
            .then((returnData) => {

                if (
                    returnData !== undefined &&
                    returnData.neo_skeleton_quality_metrics &&
                    returnData.neo_skeleton_quality_metrics.length > 0
                ) {

                    setSavedQualityMetrics(returnData.neo_skeleton_quality_metrics)


                }

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    // const changeFavLogo = async (id) => {
    //     try{
    //       if(headPlant.id){
    //         // localStorage.setItem('logo', configParam.API_URL+`/settings/downloadLogo?category=${localStorage.getItem('mode') === 'dark' ? `dark_logo` : `light_logo` }&line_id=${id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
    //         if(localStorage.getItem('mode') === 'dark'){
              

    //             try {
                    
    //               let dark_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
    //               const blob = await dark_logo.blob();
    //               const contentType = blob.type || dark_logo.headers.get("content-type");
    //               // console.clear()
    //               console.log("dark_logo__",contentType)
    //               if(contentType === 'image/png'){
    //                 let dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
    //                 localStorage.setItem('logo', URL.createObjectURL(dark_blob))
    //               } else {
    //                   let dark_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
    //                   console.log(dark_logo_svg)
    //                   let dark_blob =  dark_logo_svg.data ? new Blob([dark_logo_svg?.data], { type: "image/svg+xml" }) : null;
    //                   localStorage.setItem('logo', URL.createObjectURL(dark_blob))
    //               }

    //               // dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`

    //             }
    //             catch(e){
    //               console.log("ERROR__", e)
    //             }
              
              
    //         }
    //         else {

    //             try {
    //                 // alert("IIS")
    //               let light_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
    //               const sblob = await light_logo.blob();
    //               const contentType = sblob.type || light_logo.headers.get("content-type");
    //               if(contentType === 'image/png'){
    //                 let blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
    //                 localStorage.setItem('logo', URL.createObjectURL(blob))
    //               } else {
    //                 let light_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
    //                 let blob =  light_logo_svg?.data ? new Blob([light_logo_svg?.data], { type: "image/svg+xml" }) : null;
    //                 localStorage.setItem('logo', URL.createObjectURL(blob))
    //               }
    //               // blob = light_logo.data ? new Blob([light_logo.data], { type: "image/svg+xml" }) : null;
    //               // blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
    //             //   setLogoLight(blob)
    //             }
    //             catch(e){
    //               console.log("ERROR__", e)
    //             }
    //         }
    //       }
    //     }
    //     catch(e){
    //       console.log("(((")
    //       return null
    //     }
        
    //   }


    //   const changeFavIcon = async () => {
    //     const lineId = headPlant?.id;
    //     if (!lineId) return;
      
    //     const token = localStorage.getItem("neoToken")?.replace(/['"]+/g, "");
    //     const mode = localStorage.getItem("mode") === "dark" ? "dark" : "light";
    //     const fallbackMode = mode === "dark" ? "light" : "dark";
      
    //     const buildUrl = (category) =>
    //       `${configParam.API_URL}/settings/downloadLogo?category=${category}_favicon&line_id=${lineId}&x-access-token=${token}`;
      
    //     const setFavicon = (href, type = "image/x-icon") => {
    //       let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    //       link.rel = "icon";
    //       link.type = type;
    //       link.href = href;
    //       link.id = "faviconTag";
    //       console.log("finalLink",link)
    //       document.head.appendChild(link);
    //     };
      
    //     const tryLoadFavicon = async (category) => {
    //       const url = buildUrl(category);
    //       console.log(`Trying favicon for: ${category}`, url);
    //       try {
    //         const response = await fetch(url);
    //         console.log(`Response status for ${category}:`, response.status);
    //         if (!response.ok) return false;
        
    //         const blob = await response.blob();
    //         console.log(`Blob for ${category}:`, blob);
        
    //         const contentType = blob.type || response.headers.get("content-type");
    //         if (!blob || blob.size === 0) return false;
        
    //         if (contentType === "image/png") {
    //           setFavicon(url, "image/png");
    //         } else if (contentType === "image/svg+xml") {
    //           const { data } = await axios.get(url);
    //           const svgBlob = new Blob([data], { type: "image/svg+xml" });
    //           const objectUrl = URL.createObjectURL(svgBlob);
    //           setFavicon(objectUrl, "image/svg+xml");
    //         } else {
    //           console.warn(`Unsupported content type: ${contentType}`);
    //           return false;
    //         }
        
    //         return true;
    //       } catch (e) {
    //         console.warn(`Error loading ${category} favicon`, e);
    //         return false;
    //       }
    //     };
        
      
    //     const success = await tryLoadFavicon(mode);
    //     if (!success) {
    //       console.log("entersFallback")
    //       const fallbackSuccess = await tryLoadFavicon(fallbackMode);
    //       if (!fallbackSuccess) {
    //       console.log("entersdefAULT")
    
    //         setFavicon("https://app.neo.saint-gobain.com/favicons/favicon_light.ico");
    //       }
    //     }
    //   };

    const setFavicon = (href, type = "image/x-icon") => {
      let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.rel = "icon";
      link.type = type;
      link.href = href;
      link.id = "faviconTag";
      document.head.appendChild(link);
    };


  const changeFavouriteIcon = async (type, catg) => {
    try {
      if(type === 'svg'){
        let url = `${configParam.API_URL}/settings/downloadLogo?category=${catg}&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken")}`;
        const { data } = await axios.get(url);
        const svgBlob = new Blob([data], { type: "image/svg+xml" });
        const objectUrl = URL.createObjectURL(svgBlob);
        setFavicon(objectUrl, "image/svg+xml");
      }
      else if(type === 'png'){
        let url = `${configParam.API_URL}/settings/downloadLogo?category=${catg}&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken")}`;
        setFavicon(url, "image/png");
      }
    } catch (error) {
      console.error("Error changing favourite icon:", error);
    }
  }


  useEffect(() => {
        if (!plantAssetLoading && plantAssetData && !plantAssetError) {
          console.clear()
          console.log(plantAssetData, document.title.substring(0, 3).toLowerCase() === "cms", "plantAssetData");
  
          if(localStorage.getItem('theme') === 'dark'){
            if(plantAssetData?.dark_favicon !== null) {
            //   alert('Dark Favicon - Location Select - DARK')
              changeFavouriteIcon(plantAssetData?.dark_favicon.split('.')[1], 'dark_favicon')
            }
            else if (plantAssetData?.light_favicon !== null) {
            //   alert('Light Favicon - Location Select - DARK')
              changeFavouriteIcon(plantAssetData?.light_favicon.split('.')[1], 'light_favicon')
            } else {
              // setCustomIcon(null)
              setFavicon(document.title.substring(0, 3).toLowerCase() === "cms" ? "https://app.neo.saint-gobain.com/favicons/CMS_Logo_Black.ico" : "https://app.neo.saint-gobain.com/favicons/favicon_dark.svg");
            } 
          } else {
            if(plantAssetData?.light_favicon !== null) {
            //   alert('Light Favicon - Location Select - LIGHT')
              changeFavouriteIcon(plantAssetData?.light_favicon.split('.')[1], 'light_favicon')
            }
            else if (plantAssetData?.dark_favicon !== null) {
            //   alert('Dark Favicon - Location Select - LIGHT')
              changeFavouriteIcon(plantAssetData?.dark_favicon.split('.')[1], 'dark_favicon')
            } else {
              // setCustomIcon(null)
              setFavicon(document.title.substring(0, 3).toLowerCase() === "cms" ? "https://app.neo.saint-gobain.com/favicons/CMS_Logo_Black.ico" : "https://app.neo.saint-gobain.com/favicons/favicon_light.ico");
            } 
          }
  
        }
  }, [plantAssetLoading, plantAssetData, plantAssetError]);

   
    useEffect(() => {
        if (headPlant && headPlant.id && typeof window.clarity === 'object') {
            window.clarity('set', 'line', headPlant.name);
        }
        
        setShowHierarchy(false)
        instrumentList(headPlant.id)
        hierarchyAssetList(headPlant.id)
        localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: 'instrument', "type": 'standard' }))
        setSelectedHierarchy({ id: 'instrument', type: 'standard' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])

    useEffect(() => {

        if (hierarchyAssetListData !== null && (!hierarchyAssetListError && !hierarchyAssetListLoading)) {
            const clonedAssetData = [...hierarchyAssetListData];
            for (let i of clonedAssetData) {
                i['icon'] = 10;
                i['type'] = 'entity';
            }
            // Iterate through the clonedAssetData array
            for (const item of clonedAssetData) {
                // Iterate through the entity_instruments array for each item
                for (const entity of item.entity_instruments) {
                    // Merge instrument properties into entity_instruments array
                    Object.assign(entity, entity.instrument);
                    // Rename instrument_metrics to children1
                    entity.children = entity.instrument?.instruments_metrics;

                    // Remove the instrument object
                    delete entity.instrument;
                    delete entity.instruments_metrics;
                }

                // Rename entity_instruments to children
                item.children = item.entity_instruments;
                delete item.entity_instruments;
            }
            if (clonedAssetData) {
                for (let i of clonedAssetData) {
                    if (i.children && Array.isArray(i.children)) {

                        for (let j of i.children) {
                            j.type = 'instrument';
                            j.icon = 4;
                            const children1 = j.children;

                            if (Array.isArray(children1)) {
                                for (let k of children1) {
                                    if (k.metric && typeof k.metric === 'object') {
                                        // Rename 'title' to 'metric_name'
                                        if (k.metric.title) {
                                            k.metric_name = k.metric.title;
                                            delete k.metric.title;
                                        }

                                        // Add properties from 'metric' to 'children1'
                                        Object.assign(k, k.metric);

                                        // Remove 'metric' object
                                        delete k.metric;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            let nodeIdCounter = 2; // Initialize the counter

            function assignNodeIds(node) {
                if (Array.isArray(node.children)) {
                    for (let i of node.children) {
                        const child = i;
                        child.nodeId = nodeIdCounter++;
                        assignNodeIds(child);
                    }
                }
            }

            for (let i of clonedAssetData) {
                i.nodeId = nodeIdCounter++;
                assignNodeIds(i);
            }
            setHierarchyAsset(clonedAssetData)

        }
    }, [hierarchyAssetListData, hierarchyAssetListError, hierarchyAssetListLoading])

    useEffect(() => {
        if (GroupMetricData && !GroupMetricLoading && !GroupMetricError) {

            const filteredData = GroupMetricData.filter(val => {
                if (val.access === "public") {  
                    return true;
                }
            
                if (val.access === "shared") {
                    const isUserShared = val.shared_users.some(user => user.id === currUser.id);
                    return val.updated_by === currUser.id || isUserShared;
                } else {
                    return val.updated_by === currUser.id;
                }
            });            

            const accessLevels = {
                public: { name: 'Public Metric', children: [] },
                private: { name: 'Private Metric', children: [] },
                shared: { name: 'Shared Metric', children: [] }
            };
    
            filteredData.forEach((group) => {
                const { grpname, id, access } = group;
    
                const groupObject = {
                    id: id,
                    metric_name: grpname, 
                    nodeId: id,
                    enable: true,
                    metervalue: false
                };
    
                if (accessLevels[access]) {
                    accessLevels[access].children.push(groupObject);
                }
            });
    
            const finalTransformedData = Object.values(accessLevels)
                .map(level => ({
                    name: level.name, 
                    children: level.children 
                }))
                .filter(level => level.children.length > 0); 
    
            setMetricGroupAsset(finalTransformedData);
        }
    }, [GroupMetricData, GroupMetricLoading, GroupMetricError]);    
    
    useEffect(() => {
        if (instrumentListData !== null && (!instrumentListError && !instrumentListLoading)) {
            const clonedInstrumentData = [...instrumentListData]

            function renameProperty(arr, oldProp, newProp) {
                for (let i of arr) {
                    if (i.hasOwnProperty(oldProp)) {
                        i[newProp] = i[oldProp];
                        delete i[oldProp];
                    }
                }
            }
            renameProperty(clonedInstrumentData, "instruments_metrics", "children");

            clonedInstrumentData.forEach(item => {
                item.children.forEach(child => {
                    // Rename title to metric_name
                    child.metric.metric_name = child.metric.title;

                    // Merge metric properties into children objects
                    delete child.metric.title;
                    Object.assign(child, child.metric);
                    delete child.metric;
                });
            });

            let nodeId = 2;
            for (let i of clonedInstrumentData) {
                i.nodeId = nodeId;
                nodeId++;
                i['type'] = 'instrument'
                i['icon'] = 4;
                for (let j of i.children) {
                    j.nodeId = nodeId;
                    nodeId++;
                }
            }
            setHierarchyInstrument(clonedInstrumentData);
        }
    }, [instrumentListData, instrumentListError, instrumentListLoading])

    useEffect(() => {
        if (!MultiLineEntityListLoading && MultiLineEntityListData && !MultiLineEntityListError) {
            setEntity(MultiLineEntityListData)
        }
        if (!MultiLineEntityListLoading && !MultiLineEntityListData && MultiLineEntityListError) {
            setEntity([])
        }
    }, [MultiLineEntityListData])

    useEffect(() => {
        if (!ProductListLoading && ProductListData && !ProductListError) {
            setProducts(ProductListData)
        }

    }, [ProductListLoading, ProductListData, ProductListError])

    function getIntru(lineID) {
        configParam.RUN_GQL_API(gqlQueries.getInstrumentList, { line_id: lineID.id })
            .then((instruments) => {
                const instrumentArr = instruments !== undefined && instruments.neo_skeleton_instruments && instruments.neo_skeleton_instruments.length > 0 ? instruments.neo_skeleton_instruments : [];
                setInstrumentList(instrumentArr);
                handleChange(lineID, 0, instrumentArr)
            });
    } 

    function getOEEAssets(plantID) {
        configParam.RUN_GQL_API(gqlQueries.getAssetOEEConfigs, { line_id: plantID })
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_asset_oee_config && oeeData.neo_skeleton_prod_asset_oee_config.length > 0) {
                    setOEEAssets(oeeData.neo_skeleton_prod_asset_oee_config)
                } else {
                    setOEEAssets([])
                }
            });
    }

    const fetchMultiLineTokens = (lineobj, index) => { //Fetching token for multiple child lines
        if (lineobj.lines_hierarchies && lineobj.lines_hierarchies[0]) {
            let line_ids = []
            // eslint-disable-next-line array-callback-return
            lineobj.lines_hierarchies[0].child_line_ids.map(v => {
                let formatted = userDefaultList.map(x => x.line);
                let fromIndex = formatted.findIndex(x => x.id === v)
                if (fromIndex >= 0) {
                    line_ids.push(v);
                }
            })
            line_ids.push(lineobj.id); 
         
            Promise.all(
                line_ids.map(async (x) => {
                    let url = configParam.AUTH_URL + "/refresh?tenant_id=" + x;
                    return configParam.FETCH_REFRESH_TOKEN(url)
                        .then(result => {
                            if (Object.keys(result).length > 0 && result.result && Object.keys(result.result).length > 0) {
                                let obj1 = {};
                                obj1['line_id'] = x;
                                obj1["token"] = result.result["access_token"];
                                return obj1;

                            } else {
                                console.log("no response - refresh token hit");
                                return "";
                            }
                        })
                        .catch(error => console.log('error', error));
                    })                
            ).then((val)=>{
                if(val.length>0){
                    let current_plant_token = val.filter(x=>x.line_id === lineobj.id).map(y=>y.token)[0];
                    let child_plant_token = val;
                    if (current_plant_token) {
                        localStorage.setItem("neoToken", current_plant_token);
                    }
                    localStorage.setItem("child_line_token", JSON.stringify(child_plant_token));
                    localStorage.setItem('plantid', lineobj.plant_name);
                    localStorage.setItem('plantindex', index);
                    localStorage.setItem('assetSelected', "");
                    localStorage.setItem('assetDetails', []);
                    setheadPlant(lineobj);
                    let path = locPath.pathname.split('/')[2]
                    let location
                    let moduleName = localStorage.getItem('moduleName') ? localStorage.getItem('moduleName') : '' 
                    if(path === 'settings' || gotoSettings ){
                      
                        location = '/'+lineobj.plant_name+'/'+path 
                    }
                    else if(locPath.pathname.split('/')[5]){
                        location = '/'+lineobj.plant_name+'/dashboard/' + locPath.pathname.split('/')[3] + '/' + locPath.pathname.split('/')[4]+ '/' + locPath.pathname.split('/')[5]
                    }
                    else if(locPath.pathname.split('/')[4]){
                        location = '/'+lineobj.plant_name+'/dashboard/' + locPath.pathname.split('/')[3] + '/' + locPath.pathname.split('/')[4]
                    }else if(locPath.pathname.split('/')[3]){
                        location = '/'+lineobj.plant_name+'/dashboard/' + locPath.pathname.split('/')[3]
                    }
                    else{
                  
                        location ='/'+lineobj.plant_name+'/dashboard'
                    }
                    if (!isLineHaveLicense) {
                        navigate(location)

                    }
                    setDefaultExpandNodeList([])
                    setSelectedAsset("");
                    setAssetDetails([]);
                    setOEEData([])
                    setSelectedAssetID({ show: false, id: 0 })
                    setSelectedIndex(index);
                    setHierIndex(-1)
                    getUsersListForLine(lineobj.id)
                    getMultiLineEntityList(lineobj.lines_hierarchies[0].child_line_ids)
                }
            })
        }
    }

    function getUsersListForLine(line_id) {
        configParam.RUN_GQL_API(gqlQueries.GetUsersListForLine, { line_id: line_id })
            .then((userLineData) => {
                if (userLineData !== undefined && userLineData.neo_skeleton_user_role_line && userLineData.neo_skeleton_user_role_line.length > 0) {
                    setUserforLine(userLineData.neo_skeleton_user_role_line);
                    let RoleID = userLineData.neo_skeleton_user_role_line.filter(x => x.user_id === currUser.id)[0].role
                    setUserRole(RoleID)
                    if(RoleID.id === 3 && (locPath.pathname.split('/')[2] === 'production' || locPath.pathname.split('/')[2] === 'analytics')){
                        navigate("/AccessCard")
                    }
                } else {
                    setUserforLine([])
                    setUserRole({ id: 0, role: "" })
                    console.log("forms returndata undefined");
                }
            });
    }


    const handleChange = (value, index, intruName, moduleName) => {
        let location
        let SchemaName = value.plant_name;
        let formatted = userDefaultList.map(x => x.line);
        let fromIndex = formatted.findIndex(x => x.name === value.name)
        if (locPath.pathname.split('/')[6]) {
            location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2] + '/' + locPath.pathname.split('/')[3] + '/' + locPath.pathname.split('/')[4] + '/' + locPath.pathname.split('/')[5] + '/' + locPath.pathname.split('/')[6]
           
        } 
        else if (locPath.pathname.split('/')[5]) {
            location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2] + '/' + locPath.pathname.split('/')[3] + '/' + locPath.pathname.split('/')[4] + '/' + locPath.pathname.split('/')[5]
           
        } 
        else if (locPath.pathname.split('/')[4]) {
            location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2] + '/' + locPath.pathname.split('/')[3] + '/' + locPath.pathname.split('/')[4]
           
        } 
        else if(locPath.pathname.split('/')[3]){
            let isPlantId=formatted.find(x => x.id ===locPath.pathname.split('/')[3])
             if(isPlantId){
                location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2]
             }
          else{
            location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2] + '/' + locPath.pathname.split('/')[3] 
          }
        }
        
        else {
            location = '/'+SchemaName+'/' + locPath.pathname.split('/')[2] 
        }
      
        
    
            let element = formatted[fromIndex];
            formatted.splice(fromIndex, 1);
            formatted.splice(0, 0, element);
            setLoadPanel(true)
            setLines(formatted);
            setSearchArr(formatted);
            setHoveredItem(0);
            setAutoComplete(false);
            // eslint-disable-next-line eqeqeq
            if (value.type == 2) {
                let analyticData = localStorage.getItem('plantid')
                // console.log(value.plant_name !== analyticData,"value.plant_name !== analyticData",analyticData,value.plant_name)
                if(value.plant_name !== analyticData){
                    localStorage.setItem('analyticsDefault', '{}');
                    setAssetArray([])
                }
                
                (async () => {
                    // console.log(value.id,"id")
                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    let url = configParam.AUTH_URL + "/refresh?tenant_id=" + value.id;
                    await configParam.FETCH_REFRESH_TOKEN(url)
                        .then(async result => {
                            if (Object.keys(result).length > 0 && result.result && Object.keys(result.result).length > 0) {
                                setAuthTokens(result.result["access_token"]);
                                setExpandedNodeIDArrays([])
                                localStorage.setItem('plantid', value.plant_name);
                                localStorage.setItem('plantindex', index); 
                                localStorage.setItem('assetSelected', "");
                                localStorage.setItem('assetDetails', []);
                                // localStorage.setItem('analyticsDefault', '{}');
                                
                                
                                
                                if(!isLineHaveLicense){
                                navigate(location)
                                    
                                }
                                getUsersListForLine(value.id)
                                setDefaultExpandNodeList([])
                                setSelectedAsset("");
                                setAssetDetails([]);
                                setOEEData([])
                                setSelectedAssetID({ show: false, id: 0 })
                                setSelectedIndex(index);
                                setHierIndex(-1)
                                getOEEAssets(value.id)
                                getEntityList(value.id)
                                getDashboardDetails(value.id, currUser.id, value.schema, intruName)
                                GetLineHierarchy(value.id)
                                
                                GetUserLineHierarchy(value.id, currUser.id)
                                getInstrumentList(value.id)
                                getDefectsSeverity()
                                getDefectsInfo()
                                getResources()
                                getProductList()
                                getFaultRecommendations()
                                getSensorDetails(value.id)
                                getVirtualInstrumentList(value.id)
                                getAssetList(value.id) 
                                setDateDisabled(false)
                                setheadPlant(value); 
                                getPlantAssets(value.id)
                                // changeFavIcon(value.id)
                                // changeFavLogo(value.id)
                                // window.location.reload();
                            } else {
                                console.log("no response - refresh token hit");
                            }
                        })
                        .catch(error => console.log('error', error));
                })();
            } else {
                fetchMultiLineTokens(value, index)
            }
        
            setconversation([])
       
    };

    const handleClick = (event) => {
        setAutoComplete(!autoComplete);

    };

    function getParameterList() {
        configParam.RUN_GQL_API(gqlQueries.getParameterList)
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_metrics && returnData.neo_skeleton_metrics.length > 0) {
                    setMetricList(returnData.neo_skeleton_metrics);
                } else {
                    setMetricList([])
                }
            });
    }
    function getEntityList(line_id) {
        configParam.RUN_GQL_API(gqlQueries.GetEntityList, { line_id: line_id })
            .then((returnData) => {
                setLoadPanel(false)
                if (returnData !== undefined && returnData.neo_skeleton_entity && returnData.neo_skeleton_entity.length > 0) {
                    setEntity(returnData.neo_skeleton_entity);
                } else {
                    setEntity([])
                }
            });
    }

    function getInstrumentList(line_id) {
        configParam.RUN_GQL_API(gqlQueries.getInstrumentList, { line_id: line_id })
            .then((instrumentListres) => {
                if (instrumentListres !== undefined && instrumentListres.neo_skeleton_instruments && instrumentListres.neo_skeleton_instruments.length > 0) {
                    setInstruments(instrumentListres.neo_skeleton_instruments);
                } else {
                    setInstruments([])
                }
            });
    }

    function getVirtualInstrumentList(line_id) {
        configParam.RUN_GQL_API(gqlQueries.getInstrumentFormula, { line_id: line_id })
            .then((virtuinstrumentListData) => {
                if (virtuinstrumentListData !== undefined && virtuinstrumentListData.neo_skeleton_virtual_instruments && virtuinstrumentListData.neo_skeleton_virtual_instruments.length > 0) {
                    setVirtualInstruments(virtuinstrumentListData.neo_skeleton_virtual_instruments);
                } else {
                    setVirtualInstruments([])
                }
            });

    }

    function GetLineHierarchy(id) {
        configParam.RUN_GQL_API(gqlQueries.GetLineHierarchy, { line_id: id })
            .then((lineHierData) => {
                if (lineHierData !== undefined && lineHierData.neo_skeleton_hierarchy && lineHierData.neo_skeleton_hierarchy.length > 0) {
                    setHierarchyData(lineHierData.neo_skeleton_hierarchy);
                } else {
                    setHierarchyData([]);
                }
            });
    }

    function GetUserLineHierarchy(line_id, user_id) {
        configParam.RUN_GQL_API(gqlQueries.GetUserLineHierarchy, { line_id: line_id, user_id: user_id })
            .then((userlineHierData) => {
                if (userlineHierData !== undefined && userlineHierData.neo_skeleton_user_line_default_hierarchy && userlineHierData.neo_skeleton_user_line_default_hierarchy.length > 0) {
                    setDefaultHierarchyData(userlineHierData.neo_skeleton_user_line_default_hierarchy);
                } else {
                    setDefaultHierarchyData([])
                }
            });
    }

    
    function getDashboardDetails(line_id, user_id, shcema, intruName) {
        configParam.RUN_GQL_API(gqlQueries.getRole, { line_id: line_id, user_id: user_id })
            .then((data) => {
                if (data.neo_skeleton_user_role_line.length > 0) {
                    let userRole = data.neo_skeleton_user_role_line[0].role.id
                    switch (userRole) {
                        case 2:
                            configParam.RUN_GQL_API(gqlQueries.GetAdminDashboard, { line_id: line_id, user_id: user_id })
                                .then((userDashboard) => {
                                    processDashboardData(userDashboard, shcema, intruName)
                                });
                            break
                        case 3:
                            configParam.RUN_GQL_API(gqlQueries.getUserDashboard, { line_id: line_id, user_id: user_id })
                                .then((userDashboard) => {
                                    processDashboardData(userDashboard, shcema, intruName)
                                });
                            break
                        default: break
                    }
                }
            });

    }

    function getAssetList(line_id) {
        configParam.RUN_GQL_API(gqlQueries.getAssertList, { line_id: line_id })
            .then((assetListData) => {
                if (assetListData !== undefined && assetListData.neo_skeleton_entity && assetListData.neo_skeleton_entity.length > 0) {
                    setassetList(assetListData.neo_skeleton_entity);
                } else {
                    setassetList([])
                }
            });
    }

    function getDefectsInfo() {
        configParam.RUN_GQL_API(gqlQueries.getDefectsInfo)
            .then(defectsinfo => {
                if (defectsinfo && defectsinfo.neo_skeleton_defects) {
                    let tempdefects = [...[{ "defect_id": -1, "defect_name": "All" }], ...defectsinfo.neo_skeleton_defects]
                    setdefecttypes(tempdefects)
                } else {
                    setdefecttypes([])
                }
            })

    }

    function getDefectsSeverity() {
        configParam.RUN_GQL_API(gqlQueries.getDefectsSeverity)
            .then(defectsseverity => {
                if (defectsseverity && defectsseverity.neo_skeleton_defects_severity) {
                    let tempseverity = [...[{ "id": -1, "severity_type": "All" }], ...defectsseverity.neo_skeleton_defects_severity]
                    setdefectsseverity(tempseverity)
                } else {
                    setdefectsseverity([])
                }
            })
    }

    function getFaultRecommendations() {
        configParam.RUN_GQL_API(gqlQueries.getFaultRecommendations)
            .then(faulterecommendations => {
                if (faulterecommendations && faulterecommendations.neo_skeleton_fault_action_recommended) {
                    setfaultRecommendations(faulterecommendations.neo_skeleton_fault_action_recommended)

                } else {
                    setfaultRecommendations([])
                }
            })
    }

    function getResources() {
        configParam.RUN_GQL_API(gqlQueries.getResources)
            .then(resourceinfo => {
                if (resourceinfo && resourceinfo.neo_skeleton_resources) {
                    setresourcetypes(resourceinfo.neo_skeleton_resources)
                } else {
                    setresourcetypes([])
                }
            })

    }
    function getSensorDetails(line_id) {
        configParam.RUN_GQL_API(gqlQueries.getSensorDetails, { line_id: line_id })
            .then(sensordetailsRes => {
                if (sensordetailsRes && sensordetailsRes.neo_skeleton_sensors) {
                    setsensordetails(sensordetailsRes.neo_skeleton_sensors)

                } else {
                    setsensordetails([])
                }
            })
    }
    const processDashboardData = (userDashboard, schema, intruName) => {
        if (userDashboard && userDashboard.neo_skeleton_dashboard && userDashboard.neo_skeleton_dashboard.length > 0) {
            setCoreDashboard(userDashboard.neo_skeleton_dashboard);
            if (userDashboard.neo_skeleton_user_default_dashboard.length > 0 && userDashboard.neo_skeleton_user_default_dashboard[0].dashboard) {
                let defdata = userDashboard.neo_skeleton_user_default_dashboard[0].dashboard;
                setDefDashData(defdata.dashboard)
                setDefDashLayout(defdata.layout)
                setdashPoints({})
            }
            else {
                setdashPoints({})
                setDefDashData({})
                setDefDashLayout({})

            }
        }
        else {
            setCoreDashboard([]);
            setdashPoints({})
            setDefDashData({})
            setDefDashLayout({})

        }
    }

    const handleClosePlantSearch = () => { 
        const lineArr = [...lines];

        if (autoComplete) {
            setAutoComplete(false);
        }
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setSearchArr(lineArr)
    }

    if (userDefaultList.length === 0) {
        return <ToolTip title={t('GettingPlantList')} placement="bottom" >
            <div className="flex items-center justify-center">
                <CircularProgress disableShrink size={20} color="primary" />
            </div>
        </ToolTip>

    }

    const clearText = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setFieldVal('');
        const lineArr = [...lines];

        setSearchArr(lineArr)
    }
    const handleOnSearch = (e) => {
        const string = e.target.value;
        const lineArr = [...lines];
        setFieldVal(string)
        setHoveredItem(0);
        if (string.length > 0) {
            const searchResult = lineArr.filter(element => element.name.toLowerCase().includes(string.trimStart().toLowerCase()));
            setSearchArr(searchResult);
        } else {
            setSearchArr(lineArr);
        }

    }
    const enableKeyEvent = (e) => {
        if (e.keyCode === 13) {
            handleChange(searchArr[hoveredItem], 0)
        }
        if (e.keyCode === 38 && hoveredItem - 1 >= 0) {
            if (hoveredItem - 1 < (searchArr.length - 5)) {
                document.getElementById('menu-list-grow').scrollBy({ top: -100, behavior: 'smooth' })
            }
            setHoveredItem(hoveredItem - 1);
        } else if (e.keyCode === 40 && hoveredItem + 1 <= searchArr.length - 1) {
            if (hoveredItem + 1 > 4) {
                document.getElementById('menu-list-grow').scrollBy({ top: 100, behavior: 'smooth' })
            }
            setHoveredItem(hoveredItem + 1);
        }
        setisLineHaveLicense(false)

    }
    return (
        <>
            <ClickAwayListener onClickAway={handleClosePlantSearch}>
                <div className=" h-[52px]">
                    <button className="flex items-center justify-between p-2 border  bg-Secondary_Interaction-secondary-default dark:bg-Secondary_Interaction-secondary-default-dark border-Border-border-50 dark:border-Border-border-dark-50 focus:border-Focus-focus-primary text-Text-text-secondary focus:bg-Secondary_Interaction-secondary-hover dark:focus:bg-Secondary_Interaction-secondary-hover-dark dark:text-Text-text-secondary-dark dark:focus:border-Focus-focus-primary-dark focus:border focus:border-solid hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark  active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark active:text-Text-text-primary dark:active:text-Text-text-primary-dark rounded-md  w-[218px]  h-[52px] absolute left-[6%]" onClick={handleClick}>
                        <div className="flex flex-col   text-left gap-2 overflow-hidden">
                            <Typography variant="lable-01-xs" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", margin: 0 ,width: '100%'}} value={headPlant.name} />
                            <Typography variant="lable-01-xs" color='tertiary' value={weatherData && weatherData.main && weatherData.main.temp ? weatherData.main.temp + t('Celsius') : '0 Celsius'} />
                        </div>
                        <div className="flex flex-col justify-between">
                            <SelectorLocation stroke={curTheme === 'dark'   ? '#e8e8e8'  : '#646464'} />
                        </div>
                    </button>
                    {autoComplete &&
                        <div id={"line-select"} style={{height:"inherit"}} className={`z-[60]  rounded-md pb-2  relative top-[100%] left-[7%] w-[280px] dark:bg-gray-700`}
                        >
                            <div style={classes.searchWrapper} className="p-2" >
                                <div>
                                    <div className="h-8 mb-1">
                                        <InputFieldNDL
                                            autoFocus
                                            autoComplete
                                            ref={inputRef}
                                            id="Table-search"
                                            placeholder={t("Search line")}
                                            onKeyDown={enableKeyEvent}
                                            value={fieldVal}
                                            type="text"
                                            onChange={handleOnSearch}
                                            startAdornment={<Search stroke={curTheme === 'dark' ? "#b4b4b4" : '#202020'} />}
                                            endAdornment={
                                                fieldVal.length > 0 && (
                                                    <Close style={classes.closeIcon} stroke={curTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={clearText} />
                                                )
                                            }
                                        />
                                    </div>
                                    <ul id="menu-list-grow" className="max-h-[284px]  pb-1 pt-2 font-geist-sans overflow-y-auto text-sm text-Text-text-primary dark:text-Text-text-primary-dark mb-0" aria-labelledby="dropdownSearchButton">
                                        {
                                            searchArr.length > 0 ? (
                                                <React.Fragment>
                                                    {
                                                        searchArr.map((x, i) => {
                                                            
                                                            return (
                                                                <React.Fragment>
                                                                    <div className={`flex flex-col gap-0.5 cursor-pointer  border-b border-Border-border-50 dark:border-Border-border-dark-50 p-2  font-geist-sans   hover:bg-Surface-surface-hover dark:hover:bg-Surface-surface-hover-dark rounded`} onClick={() => { handleChange(x, 0); localStorage.setItem("createTaskFromAlarm", ''); setisLineHaveLicense(false); localStorage.removeItem('logo') }}>
                                                                        <Typography variant='label-01-s' style={classes.plantTitle} value={x.name} />
                                                                        <Typography variant='paragraph-xs' style={classes.plantHier} 
                                                                        // value={  x.gaia_plants_detail.activity_name + " > " + x.gaia_plants_detail.business_name + " > " + x.gaia_plants_detail.gaia_plant_name} 
                                                                        
                                                                        value={
                                                                            x.gaia_plants_detail?.activity_name && x.gaia_plants_detail?.business_name && x.gaia_plants_detail?.gaia_plant_name
                                                                              ? `${x.gaia_plants_detail.activity_name} > ${x.gaia_plants_detail.business_name} > ${x.gaia_plants_detail.gaia_plant_name}`
                                                                              : ""
                                                                          }
                                                                          
                                                                        />
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                            ) : (
                                                <Typography style={{ textAlign: 'center' }} value={t("No results found")} />
                                            )

                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </ClickAwayListener>
        </>
    );
}
