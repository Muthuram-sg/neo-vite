/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useImperativeHandle} from "react"; 
import Grid from 'components/Core/GridNDL';
import { useTranslation } from 'react-i18next';
import MaskedInput from "components/Core/MaskedInput/MaskedInputNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import { useRecoilState } from "recoil";
import { user, selectedPlant, lineEntity, instrumentsList, snackToggle, snackMessage, snackType,themeMode } from "recoilStore/atoms"; 
import Button from 'components/Core/ButtonNDL';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import useMetricsForSingleInstrument from '../hooks/useMetricsForSingleInstrument';
import useMetricsForSingleInstrumentMss from '../hooks/useMetricsForSingleInstrumentMss';
import useAnalyticConfig from '../hooks/useAnalyticConfig';
import useAnalyticConfigDel from '../hooks/useAnalyticConfigDel';
import useDeleteOEEConfig from '../hooks/useDeleteOEEConfig'; 
import useAddNewEntity from '../hooks/useAddNewEntity';
import useEditAnEntity from '../hooks/useEditAnEntity';
import useDeleteAnEntity from '../hooks/useDeleteAnEntity';
import useAddorUpdateOEEConfig from '../hooks/useAddorUpdateOEEConfig';
import useEntityType from '../hooks/useEntityType';
import useAssetType from '../hooks/useAssetType';
import useAddAssetInstrumentsMapping from '../hooks/useAddAssetInstrumentsMapping';
import useUpdateAssetInstrumentsMapping from '../hooks/useUpdateAssetInstrumentsMapping';
import useCheckEntity from '../hooks/useCheckEntity';
import useDeleteEntityRelation from '../hooks/useDeleteEntityRelation'; 
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useAddDryerConfig from '../hooks/useAddDryerConfig';
import useUpdateDryerConfig from "../hooks/useUpdateDryerConfig"; 
import Typography from "components/Core/Typography/TypographyNDL";
import FileInput from 'components/Core/FileInput/FileInputNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import PDF from 'assets/neo_icons/SettingsLine/pdf.svg?react';
import TagNDL from "components/Core/Tags/TagNDL";
import useAddAssetDocs from '../hooks/useAddAssetDoc'
import useEditAssetDocs from '../hooks/useEditAssetDocs'
import useDeleteAssetDocs from '../hooks/useDeleteAssetDoc'
import useViewAssetDoc from '../hooks/useViewAssetDoc'

import useGerAssetList from "../hooks/useGetAssetList"
import useAddZoneMapedAsset from '../hooks/useAddZoneMapedAsset'
import useUpdateZoneMapedAsset from '../hooks/useUpdateZoneMapedAsset'
import useGetAssetDocsList from "../hooks/useGetAssetAttchmentList";
import Toast from "components/Core/Toast/ToastNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';




const AddEntity = React.forwardRef((props, ref) => {
  const { t } = useTranslation(); 
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [snackMsg, SetSnackMessage] = useState('');
  const [isFovr, setIsFovr] = useState(false)
  const [isSspeedOvr, setIsSspeedOvr] = useState(false)
 
  const [snType, SetSnackType] = useState('');//NOSONAR
  const [snackOpen, setsnackOpen] = useState(false);
  const [currUser] = useRecoilState(user);
  const [entity] = useRecoilState(lineEntity);
  const [instruments] = useRecoilState(instrumentsList);
  const [partInstrumentMetrics, setPartInstrumentMetrics] = useState([]);
  const [mssInstrumentMetrics, setMSSInstrumentMetrics] = useState([]);
  const [editCustomDash, setEditCustomDash] = useState(true);
  const [entityDialogMode, setEntityDialogMode] = useState('create');
  const [currEntityID, setCurrEntityID] = useState("");
  const [entityName, setEntityName] = useState({ value: "", isValid: true });
  const [entityType, setEntityType] = useState({ value: 3, isValid: true });
  const [assetType, setAssetType] = useState({ value: 0, isValid: true });
  const [instrument, setInstrument] = useState({ value: [], isValid: true });
  const [extInstrument, setExtInstrument] = useState({ value: [], isValid: true });
  const [partInstru, setPartInstru] = useState({ value: "", isValid: true });
  const [partSignal, setPartSignal] = useState({ value: "", isValid: true });
  const [dressingSignal, setDressingSignal] = useState({value:"",isValid:true});
  const [partSignalType, setPartSignalType] = useState({ value: "", isValid: true });
  const [partSignalTypeArr, setPartSignalTypeArr] = useState([]);
  const [, setMSSInstru] = useState({ value: "", isValid: true });//NOSONAR
  const [, setMSSignal] = useState({ value: "", isValid: true });//NOSONAR
  const [plannedDT, setPlannedDT] = useState({ value: "", isValid: true });
  const [plannedSetupTime, setPlannedSetupTime] = useState({ value: "", isValid: true });
  const [dressingprogram, setdressingProgram] = useState('');//NOSONAR
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [oeeValueAbove, setOeeValueAbove] = useState({ value: 70, isValid: true });
  const [oeeValueBelow, setOeeValueBelow] = useState({ value: 50, isValid: true });
  const [oeeValueBetween, setOeeValueBetween] = useState({ value: "", isValid: true });
  const [assetOoeBelowColor] = useState({ value: "linear-gradient(239.58deg, #FF4100 0%, #FF7400 100%)1 ", isValid: true });
  const [assetOoeBetweenColor] = useState({ value:  "linear-gradient(239.15deg, #E0B000 0%, #FFDF63 98.94%)1 ", isValid: true });
  const [assetOoeAboveColor] = useState({ value:  "linear-gradient(239.15deg, #FFFFFF 0%, #FFFFFF 98.94%)1" , isValid: true });
  const [updateedititem, setUpdateedititem] = useState(false);
  const [customReport, setcustomReport] = useState(true);
  const [standardMicrostop, setStandardMicrostop] = useState(false)
  const [binaryPartCount, setBinaryPartCount] = useState(false);
  const [downfallPartCount, setDownfallPartCount] = useState(false);
  const [oeeParams, setOeeParam] = useState(false);//NOSONAR
  const [isReading, setIsReading] = useState(false);
  const [isAnalytic, setisAnalytic] = useState(false);
  const [isFaultAnalysis, setisFaultAnalysis] = useState(false);
  const [isStat,setIsStat]=useState(false);
  const [curTheme]=useRecoilState(themeMode)
  const [Metrics,setMetrics]  = useState({ value: [], isValid: true });
  const [MetricFields,setMetricFields] = useState([{field : 1,metric_id: '',chartType:'',Min:'',Max:'',stat:false}]);
  const [AnyltConfig,setAnyltConfig] = useState('');
  const [isStatusSignal, setStatusSignal] = useState(true);//NOSONAR
  const [micStopFromTime, setMicStopFromTime] = useState(30);
  const [micStopToTime, setMicStopToTime] = useState(120);
  const [micStopFromTimeValid, setMicStopFromTimeValid] = useState(true);
  const [micStopToTimeValid, setMicStopToTimeValid] = useState(true);
  const [,setBtnLoad] = useState(false);//NOSONAR
  const [stepperName, setStepperName] = useState(1)
  const [assetDoc,setAssetDoc] = useState(false)
    const fileInputRef = useRef(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isopen, setIsopen] = useState(false)
    const [files, setFiles] = useState({ file1: null, file2: [], file3: {sop:[],warranty:[],user_manuals:[],others:[]} });
    const [previews, setPreviews] = useState([]); 
    const [docType,setdocType] = useState(null)
    const [imageurl,setImageurl] = useState({ value:"" , isValid: true })

    const fileInputDocRef = useRef()
    
  const [isZone,setisZone] =  useState(false);
  const [ZoneAsset,setZoneAsset] = useState([])
  const [isEditPage,setisEditPage] = useState(false)
  const [ isRunningTime,setisRunningTime] = useState(false);
 
  // Dryer config
  const [moistureInInst, setMoistureInInst] = useState([]);
  const [moistureInMet,setMoistureInMet] = useState([]);
  const [moistureInMetList,setMoistureInMetList] =useState([])
  const [moistureOutInst,setMoistureOutInst] = useState([]);
  const [moistureOutMet,setMoistureOutMet] = useState([]);
  const [moistureOutMetList,setMoistureOutMetList] =useState([])
  const [gasEnergyInst,setGasEnergyInst] = useState([]);
  const [gasEnergyMet,setGasEnergyMet] = useState([])
  const [gasEnergyInMetList,setGasEnergyMetList] = useState([])//NOSONAR
  const [electricEnergyInst,setElectricEnergyInst] = useState([])
  const [electricEnergyMet,setElectricEnergyMet] = useState([])
  const [electricEnergyMetList,setElectricEnergyMetList] = useState([])
  const [totalSandDriedInst,setTotalSandDriedInst] = useState([])
  const [totalSandDriedMet,setTotalSandDriedMet] = useState([])
  const [totalSandDriedMetList,setTotalSandDriedMetList] = useState([])
  const [toatlSandFedInst,setTotalSandFedInst] = useState([])//NOSONAR
  const [totalSandFedMet,setTotalSandFedMet] = useState([])
  const [totalSandFedMetList,setTotalSandFedMetList] = useState([])
  const [totalScrapInst,setTotalScrapInst] = useState([])
  const [totalScrapMet,setTotalScrapMet] = useState([])
  const [totalScrapMetList,setTotalScrapMetList] = useState([])
  const [totalStartupInst,setTotalStartupInst] = useState([])
  const [totalStartupMet,setTotalStartupMet] = useState([])
  const [totalStartupMetList,setTotalStartupMetList] = useState([])
  const [totalShutdownInst,setTotalShutdownInst] = useState([])
  const [totalShutdownMet,setTotalShutdownMet] = useState([])
  const [totalShutdownMetList,setTotalShutdownMetList] = useState([])
  const [emptyRunInst,setEmptyRunInst] = useState([])
  const [emptyRunMet,setEmptyRunMet] = useState([])
  const [emptyRunMetList,setEmptyRunMetList] = useState([])
  const EntityNameRef = useRef();
  const micStopFromTimeRef = useRef();
  const micStopToTimeRef = useRef();
  const dressingProgramRef = useRef();
  const plannedDTRef = useRef();
  const plannedSetupTimeRef = useRef();
  const assetOoeAboveColorRef = useRef();
  const assetOoeBetweenColorfnRef = useRef();
  const assetOoeBelowColorRef = useRef();
  const spindleSpeedRef = useRef();
  const [spindleSpeed, setSpindleSpeed] = useState(null)
  const feedRateRef = useRef();
  const [feedRate, setFeedRate] = useState(null)
  const MetMinRef = useRef();
  const MetMaxRef = useRef();
  const [EntityRelation, setEntityRelation] = useState([]);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [isDryer,setIsDryer] = useState(false);
  const [isDryerRowAdded,setIsDryerRowAdded] = useState(false);
  const [contractTarget,setcontractTarget] = useState({value:'',isValid:false})
  const contractTargetPercentage = useRef()
  const contractTenure = useRef()
  const ImageURL = useRef()
  const [zoneAssetId,setzoneAssetId] = useState(null)
  const [assetAttachmentList,setassetAttachmentList] = useState([])
  const [isFileSizeError,setisFileSizeError] =useState({type:null,value:false})


  const [,setiscontractTargetPercentage] = useState(false)//NOSONAR
  const { MetricsForSingleInstrumentLoading, MetricsForSingleInstrumentData, MetricsForSingleInstrumentError, getMetricsForSingleInstrument } = useMetricsForSingleInstrument();
  const { MetricsForSingleInstrumentMssLoading, MetricsForSingleInstrumentMssData, MetricsForSingleInstrumentMssError, getMetricsForSingleInstrumentMss } = useMetricsForSingleInstrumentMss();

  const { AddNewEntityLoading, AddNewEntityData, AddNewEntityError, getAddNewEntity } = useAddNewEntity();
  const { EditAnEntityLoading, EditAnEntityData, EditAnEntityError, getEditAnEntity } = useEditAnEntity();
  const { DeleteAnEntityLoading, DeleteAnEntityData, DeleteAnEntityError, getDeleteAnEntity } = useDeleteAnEntity();
  const { DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError, getDeleteEntityRelation } = useDeleteEntityRelation();
  const { getAnalyticConfig } = useAnalyticConfig(); 
  const { getAnalyticConfigDel } = useAnalyticConfigDel();
  const { getDeleteOEEConfig } = useDeleteOEEConfig();
  
  // Zonned Asset crud opertaion
  const {AddZoneMapedAssetLoading, AddZoneMapedAssetData, AddZoneMapedAssetError, getAddZoneMapedAsset} = useAddZoneMapedAsset()
  const { UpdateZoneMapedAssetLoading, UpdateZoneMapedAssetData, UpdateZoneMapedAssetError, getUpdateZoneMapedAsset} = useUpdateZoneMapedAsset()
  const { AddorUpdateOEEConfigLoading, AddorUpdateOEEConfigData, AddorUpdateOEEConfigError, getAddorUpdateOEEConfig } = useAddorUpdateOEEConfig();
  const { EntityTypeLoading, EntityTypeData, EntityTypeError, getEntityType } = useEntityType();//NOSONAR
  const { CheckEntityLoading, CheckEntityData, CheckEntityError, getCheckEntity } = useCheckEntity();
  const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } = useAssetType(); 
  const {GetAssetListLoading, GetAssetListData, GetAssetListError, getGetAssetList}=useGerAssetList()//NOSONAR
  const {  getAddAssetInstrumentsMapping } = useAddAssetInstrumentsMapping(); 
  const {  getUpdateAssetInstrumentsMapping } = useUpdateAssetInstrumentsMapping();
  const {  getAddDryerConfig } = useAddDryerConfig();
  const {  getUpdateDryerConfig } = useUpdateDryerConfig(); 
  const  { AddAssetDocsLoading, AddAssetDocsData, AddAssetDocsError, getaddAssetDocs } = useAddAssetDocs()
  const { DeleteAssetDocLoading, DeleteAssetDocData, DeleteAssetDocError, getDeleteAssetDoc } = useDeleteAssetDocs()//NOSONAR
  const { EditAssetDocsLoading, EditAssetDocsData, EditAssetDocsError, getEditAssetDocs } = useEditAssetDocs()
  const { ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError, getViewAssetDoc } = useViewAssetDoc()
  const  {  GetAssetDocsListLoading, GetAssetDocsListData, GetAssetDocsListError, getGetAssetDocsList } =useGetAssetDocsList()

  const [SAPCode, SetSAPCode] = useState({ value: "", isValid: true });//NOSONAR
  
  
  const handleOpenPopUp = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setIsopen(true)
};
  
  const handleFileChange = (e, file) => {
    const selectedFiles = e.target.files;
    const previewSelectedFile = Array.from(e.target.files);
    // Create preview URLs for each file
    
    let fileArr = [];

    for (const file of selectedFiles) {
      if (file.size > 10485760) {
        fileArr.push(file.size);
      }
    }

    if (fileArr.length > 0) {
      setisFileSizeError({ type: file, value: true });
      return;
    } else {
      setisFileSizeError({ type: null, value: false });
    }

    const modifiedFiles = Array.from(selectedFiles).map(file => {
      const originalFileName = file.name;
      const lastDotIndex = originalFileName.lastIndexOf('.');
      const namePart = lastDotIndex === -1 ? originalFileName : originalFileName.substring(0, lastDotIndex);
      const extension = originalFileName.substring(lastDotIndex);
      const newFileName = namePart + "~" + docType + extension;
      return new File([file], newFileName, { type: file.type });
    });
    const duplicateFiles = modifiedFiles.filter(file => uploadedFiles.includes(file.name));

    if (duplicateFiles.length > 0) {
      setIsDuplicateError(true); 
      return;
    } else {
      setIsDuplicateError(false); 
    }

    if (file === 'file1') {
      setFiles({
        ...files,
        [file]: selectedFiles[0],
      });
    } else if (file === 'file2') {
    const previewUrls = [...files.file2, ...previewSelectedFile].map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
      setFiles({
        ...files,
        file2: [...files.file2, ...selectedFiles],
      });
    } else if (file === 'file3') {
      setFiles(prevFiles => ({
        ...prevFiles,
        file3: {
          ...prevFiles.file3,
          [docType]: [...prevFiles.file3[docType], ...modifiedFiles],
        },
      }));
    }
    setUploadedFiles(prevFiles => [...prevFiles, ...modifiedFiles.map(file => file.name)]);
  };


  useEffect(() => {
    if (isDuplicateError) {
      SetSnackMessage('This image has already been selected.');
      SetSnackType("warning");
      setsnackOpen(true);
  
      const timer = setTimeout(() => {
        setsnackOpen(false); 
      }, 3000); 
  
      return () => clearTimeout(timer); 
    }
  }, [isDuplicateError]);
    
  function handleClose() {
    setNotificationAnchorEl(null)
    setIsopen(false)
}


function optionChange(e) {
  // console.log(e,"eeee")
  setdocType(e)
  fileInputDocRef.current.click()
  handleClose()
}



const AddOption = [
  { id: "sop", name: t("SOP") },
  { id: "warranty", name: t("Warranty") },
  { id: "user_manuals", name: t("User Manuals") },
  { id: "others", name: t("Others") }
]


  useEffect(() => {
    getEntityType()
    getAssetType() 
    getGetAssetList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant]) 
  useEffect(() => {
    if (!CheckEntityLoading && !CheckEntityError && CheckEntityData) {
      let arr = []
      // eslint-disable-next-line array-callback-return
      Object.keys(CheckEntityData).forEach(val => {//NOSONAR
        if (CheckEntityData[val].length > 0) {
          if (val === 'oeeConfig') {
            arr.push("OEE Configurations");
          }
          if (val === 'execution') {
            arr.push("Production execution");
          }
          if (val === 'downtime') {
            arr.push("Downtime");
          }
          if (val === 'partComment ') {
            arr.push("Part comments");
          }
          if (val === 'qualityDefects ') {
            arr.push("Quality rejects");
          }
          if (val === 'tasks') {
            arr.push("Tasks");
          }
          if (val === 'assetInfo ') {
            arr.push(" Asset detail informations");
          }
          if (val === 'maintenancelogs') {
            arr.push("Asset Maintenance Logs");
          }
          if (val === 'entityInstruments') {
            arr.push("Asset Entity Instruments Mapping");
          }
          if (val === 'dryerConfig') {
            arr.push("Dryer Config");
          }
        }
      });
      
      setEntityRelation(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CheckEntityLoading, CheckEntityData, CheckEntityError])

  useEffect(() => {
    if (!DeleteAnEntityLoading && !DeleteAnEntityError && DeleteAnEntityData) {
      if (DeleteAnEntityData.affected_rows >= 1) {
        handleEntityDialogClose();
    props.handleActiveIndex(0)//NOSONAR

        setSnackMessage(t('Deletedentity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true)
        props.getUpdatedEntityList()//NOSONAR
        setBtnLoad(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteAnEntityLoading, DeleteAnEntityData, DeleteAnEntityError])



  useEffect(()=>{
    if(!EditAssetDocsLoading && EditAssetDocsData &&  !EditAssetDocsError){
       console.log("FILE EDITED")
    }
  },[EditAssetDocsLoading, EditAssetDocsData, EditAssetDocsError])

  useEffect(()=>{
    if(!ViewAssetDocLoading &&  ViewAssetDocData && !ViewAssetDocError){
      if(ViewAssetDocData.Data){
        const base64String1 = ViewAssetDocData.Data[0].file1 ; // Replace with your base64 string
        const filename1 = base64String1?ViewAssetDocData.Data[0].name:null; // Desired file name with the correct extension
        const contentType = "image/jpeg"; // MIME type of the file
        let file2Arr = []
        let base64Arr = []
        let file3Arr = {sop:[],warranty:[],user_manuals:[],others:[]}
        ViewAssetDocData.Data.forEach((x,i)=>{
          if(x.fieldname === "file2"){
            const file = base64ToFile(x.file2, x.name, contentType);
            file2Arr.push(file)
            base64Arr.push(`data:image/jpeg;base64,${x.file2}`)
          }else if(x.fieldname === "file3"){
            const fileName = x.name.split("~")
            const docType = fileName[fileName.length - 1].split(".")
            const updatedDocType = docType[0]
            const file = base64ToFile(x.file3, x.name, "application/pdf");
            if(updatedDocType){
              if(updatedDocType === 'sop'){
                file3Arr = {...file3Arr,sop:[...file3Arr.sop,file]}
              }else if(updatedDocType === 'warranty'){
                file3Arr = {...file3Arr,warranty:[...file3Arr.warranty,file]}
  
              }else if(updatedDocType === 'user_manuals'){
                file3Arr = {...file3Arr,user_manuals:[...file3Arr.user_manuals,file]}
  
              }else{
                file3Arr = {...file3Arr,others:[...file3Arr.others,file]}
              }
            }
          }
        })
        // Convert base64 to file
        const file = filename1? base64ToFile(base64String1, filename1, contentType):null;
       
        setPreviews(base64Arr);
        setFiles({file1:file,file2:file2Arr,file3:file3Arr})

      }

    }

  },[ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError])


  function base64ToBlob(base64, contentType) {
    try {
        const base64Fixed = base64.replace(/-/g, '+').replace(/_/g, '/');

        const byteCharacters = atob(base64Fixed);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        return new Blob([byteArray], { type: contentType });
    } catch (e) {
        console.error("Error decoding Base64 string: ", e);
        return null; 
    }
}

function base64ToFile(base64, filename, contentType) {
    // Convert the base64 string to a Blob
    const blob = base64ToBlob(base64, contentType);
    const input =filename;
    const[_, secondPart] = input.split(/-(.+)/);
    return new File([blob], secondPart, { type: contentType });
}


  useEffect(() => {
    if (!DeleteEntityRelationLoading && !DeleteEntityRelationError && DeleteEntityRelationData) {
      let delArr = []
      // eslint-disable-next-line array-callback-return
      Object.keys(DeleteEntityRelationData).forEach(val => {
        if (DeleteEntityRelationData[val].affected_rows >= 1) {
          delArr.push("1");
        }
      });
      
      if (delArr.length > 0) {
        // console.log('enter1')
        getDeleteAssetDoc({entity_id:currEntityID})
        handleEntityDialogClose();
        props.handleActiveIndex(0)//NOSONAR
        setSnackMessage(t('Deletedentity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true)
        props.getUpdatedEntityList()//NOSONAR
        setBtnLoad(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError])

  useEffect(()=>{
    if(!GetAssetDocsListLoading && GetAssetDocsListData &&  !GetAssetDocsListError){
      setassetAttachmentList(GetAssetDocsListData)
    }

  },[GetAssetDocsListLoading, GetAssetDocsListData, GetAssetDocsListError])

  useEffect(() => {
    if (!AddorUpdateOEEConfigLoading && !AddorUpdateOEEConfigError && AddorUpdateOEEConfigData) {
      if (AddorUpdateOEEConfigData) {
        setSnackMessage(entityDialogMode === 'create' ? t('AddNewEntity') : t('UpdatedEntity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true)
        handleEntityDialogClose();
        props.handleActiveIndex(0)//NOSONAR
        if (entityDialogMode === 'create') {
          setTimeout(() => {
            props.getUpdatedEntityList();//NOSONAR
          },[600])
        } else {
          props.getUpdatedEntityList();//NOSONAR

        }
       
        setOeeParam(false);
        setBtnLoad(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AddorUpdateOEEConfigLoading, AddorUpdateOEEConfigData, AddorUpdateOEEConfigError])

  useEffect(() => {//NOSONAR
    if (!AddNewEntityLoading && !AddNewEntityError && AddNewEntityData) {
      if (AddNewEntityData.affected_rows >= 1) {
        setSnackMessage(t('AddNewEntity') + entityName.value);
        setSnackType("success");
        setOpenSnack(true);
        handleEntityDialogClose(); 
    props.handleActiveIndex(0)//NOSONAR

    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();//NOSONAR
      },[600])
    } else {
      props.getUpdatedEntityList();//NOSONAR

    }
        setBtnLoad(false);
        if ((Number(entityType.value) === 3 || Number(assetType.value) === 9) && instrument.value.length > 0) {
          if (instrument.value) {
            let entityInstruments = [];
            // eslint-disable-next-line array-callback-return
            instrument.value.forEach((val) => {
              if (val.id) {
                let obj = {
                  entity_id: AddNewEntityData.returning[0].id,
                  instrument_id: val.id,
                  line_id: headPlant.id,
                  updated_by: currUser.id,
                  created_by: currUser.id
                };
                entityInstruments.push(obj);
              }
            });

            if(entityInstruments.length > 0){
              getAddAssetInstrumentsMapping(entityInstruments)
            }
          }
         

         } 
         if(Number(entityType.value) === 2 ){
          getAddZoneMapedAsset(AddNewEntityData.returning[0].id,ZoneAsset)
          return
         }
        if(Number(assetType.value) === 9 && isDryer){
         
          let datas={
              enable:isDryer,
              entityid:AddNewEntityData.returning[0].id,
              line_id:headPlant.id,
              gas_energy_inst:gasEnergyInst[0]?gasEnergyInst[0].id:"",
              gas_energy:gasEnergyMet[0]?gasEnergyMet[0].id:null,
              electrical_energy_inst:electricEnergyInst[0]?electricEnergyInst[0].id:"",
              electrical_energy:electricEnergyMet[0]?electricEnergyMet[0].id:null,
              moisture_in_inst:moistureInInst[0]?moistureInInst[0].id:"",
              moisture_in:moistureInMet[0]?moistureInMet[0].id:null,
              moisture_out_inst:moistureOutInst[0]?moistureOutInst[0].id:"",
              moisture_out:moistureOutMet[0]?moistureOutMet[0].id:null,
              toal_sand_dried_inst:totalSandDriedInst[0]?totalSandDriedInst[0].id:null,
              toal_sand_dried:totalSandDriedMet[0]?totalSandDriedMet[0].id:null,
              total_sand_fed_inst:toatlSandFedInst[0]?toatlSandFedInst[0].id:"",
              total_sand_fed:totalSandFedMet[0]?totalSandFedMet[0].id:null,
              total_scrap_inst:totalScrapInst[0]?totalScrapInst[0].id:"",
              total_scrap:totalScrapMet[0]?totalScrapMet[0].id:null
          }
          getAddDryerConfig(datas,totalStartupInst[0]?totalStartupInst[0].id:"",totalStartupMet[0]?totalStartupMet[0].id:null,totalShutdownInst[0]?totalShutdownInst[0].id:"",totalShutdownMet[0]?totalShutdownMet[0].id:null,emptyRunInst[0]?emptyRunInst[0].id:"",emptyRunMet[0]?emptyRunMet[0].id:null)
        }
       
        if (Number(entityType.value)=== 3 && oeeParams) {
          
          let datas2={
            currEntityID:AddNewEntityData.returning[0].id,
            partSignal: partSignal.value,
            partInstru:partInstru.value,
            isStatusSignal:partSignal.value,
            isStatusSigIns:  partInstru.value,
            plannedDT:plannedDT.value, 
            plannedSetupTime: plannedSetupTime ? plannedSetupTime.value : 0,
            customReport:customReport,
            isStandardMicrostop: standardMicrostop || false,
            binaryPartCount:binaryPartCount, 
            oeeValueAbove: String(oeeValueAbove.value), 
            oeeValueBelow:String(oeeValueBelow.value),
            assetOoeAboveColor:assetOoeAboveColorRef.current ? assetOoeAboveColorRef.current.value : assetOoeAboveColor.value, 
            assetOoeBelowColor: assetOoeBelowColorRef.current ? assetOoeBelowColorRef.current.value : assetOoeBelowColor.value, assetOoeBetweenColor:assetOoeBetweenColorfnRef.current ? assetOoeBetweenColorfnRef.current.value : assetOoeBetweenColor.value
          }
          getAddorUpdateOEEConfig(datas2, micStopToTime, isStatusSignal, dressingprogram, dressingSignal&&dressingSignal.value?dressingSignal.value:'', downfallPartCount, micStopFromTime,isRunningTime)
          if(isAnalytic){
            getAnalyticConfig(AddNewEntityData.returning[0].id,AnyltConfig)
          }
        }
        else {
          if(Number(entityType.value)=== 3 && isAnalytic){
            getAnalyticConfig(AddNewEntityData.returning[0].id,AnyltConfig)
          }
          if(Number(entityType.value) !== 3){
            setSnackMessage(t('AddNewEntity') + entityName.value)
            setSnackType("success")
            setOpenSnack(true)
            handleEntityDialogClose(); 
    props.handleActiveIndex(0)//NOSONAR
    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();//NOSONAR
      },[600])
    } else {
      props.getUpdatedEntityList();//NOSONAR

    }
            setBtnLoad(false)
          }
         
        }
        if(Number(entityType.value) === 3){
          handleFileUpload(AddNewEntityData.returning[0].id)
          return
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AddNewEntityLoading, AddNewEntityData, AddNewEntityError])
 
  useEffect(() => {
    if (!AddAssetDocsLoading && AddAssetDocsData && !AddAssetDocsError) {
      if (AddAssetDocsData === 'File Upload successfully') {
        setSnackMessage(t('AddNewEntity') + entityName.value + " - File Upload Success");
        setSnackType("success");
        setOpenSnack(true);
        handleEntityDialogClose(); 
    props.handleActiveIndex(0)//NOSONAR
    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();//NOSONAR
      },[600])
    } else {
      props.getUpdatedEntityList();//NOSONAR

    }
        setBtnLoad(false);
      } 
    }
  }, [AddAssetDocsLoading, AddAssetDocsData, AddAssetDocsError]);  
 
   useEffect(()=>{
    if(!AddZoneMapedAssetLoading &&  AddZoneMapedAssetData && !AddZoneMapedAssetError){
      if(AddZoneMapedAssetData.affected_rows > 0){
        setSnackMessage(t('AddNewEntity') + entityName.value)
        setSnackType("success")
          setOpenSnack(true)
          handleEntityDialogClose(); 
    props.handleActiveIndex(0)//NOSONAR

    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();//NOSONAR
      },[600])
    } else {
      props.getUpdatedEntityList();//NOSONAR

    }
          setBtnLoad(false)
      }else{
        setSnackMessage('Unable to add ' + entityName.value)
        setSnackType("warning")
        setOpenSnack(true)
        handleEntityDialogClose(); 
    props.handleActiveIndex(0)//NOSONAR

    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();//NOSONAR
      },[600])
    } else {
      props.getUpdatedEntityList();//NOSONAR

    }
        setBtnLoad(false)
      }
    }
  },[AddZoneMapedAssetLoading, AddZoneMapedAssetData, AddZoneMapedAssetError])


 

  useEffect(() => {
    if (!EditAnEntityLoading && !EditAnEntityError && EditAnEntityData) {

    
      if (EditAnEntityData.affected_rows >= 1) {

        if(Number(entityType.value) === 2 ){
          if(zoneAssetId){
            let body ={
              id:zoneAssetId,
              asset_id: ZoneAsset.length > 0 ? ZoneAsset : [],
              entity_id:currEntityID
            }
            getUpdateZoneMapedAsset(body)
            return
          }else{
          getAddZoneMapedAsset(currEntityID,ZoneAsset.length > 0 ? ZoneAsset : [])
          return
          }
         
        }
        if(Number(entityType.value) === 3){
          handleFileUpload(currEntityID,"Edit")
        }
        if (Number(entityType.value) === 3 && instrument.value.length > 0) {

            let curInstrument = instrument.value.map(x => {return x.id})
            let addInstrument = curInstrument.filter(x => !extInstrument.value.includes(x));
            let removeInstrument = extInstrument.value.filter(x => !curInstrument.includes(x));


          if (removeInstrument.length > 0) {
            getUpdateAssetInstrumentsMapping(currEntityID, removeInstrument)
          }

          if (addInstrument.length > 0) {
            let entityInstruments = [];
            // eslint-disable-next-line array-callback-return
            instrument.value.forEach(val => {
              if (addInstrument.includes(val.id)) {
                let obj = {
                  entity_id: currEntityID,
                  instrument_id: val.id,
                  line_id: headPlant.id,
                  updated_by: currUser.id,
                  created_by: currUser.id
                };
                entityInstruments.push(obj);
              }
            });
            
            
            if(entityInstruments.length > 0){
              getAddAssetInstrumentsMapping(entityInstruments)
            }
          }

          setExtInstrument({ value: [], isValid: true })

      }
      else
      {
          if ((Number(entityType.value)=== 3 || Number(assetType.value) === 9) && extInstrument.value.length > 0 && instrument.value.length === 0) {
            getUpdateAssetInstrumentsMapping(currEntityID, extInstrument.value)
            setExtInstrument({ value: [], isValid: true })
          }
      }
      
        if(Number(assetType.value) === 9){
          if(isDryerRowAdded){
          let datas4={
            enable:isDryer,
            entityid:currEntityID,
            gas_energy_inst:gasEnergyInst[0]?gasEnergyInst[0].id:"",
            gas_energy:gasEnergyMet[0]?gasEnergyMet[0].id:null,
            electrical_energy_inst:electricEnergyInst[0]?electricEnergyInst[0].id:"",
            electrical_energy:electricEnergyMet[0]?electricEnergyMet[0].id:null,
            moisture_in_inst:moistureInInst[0]?moistureInInst[0].id:"",
            moisture_in:moistureInMet[0]?moistureInMet[0].id:null,
            moisture_out_inst:moistureOutInst[0]?moistureOutInst[0].id:"",
            moisture_out:moistureOutMet[0]?moistureOutMet[0].id:null,
            toal_sand_dried_inst:totalSandDriedInst[0]?totalSandDriedInst[0].id:null,
            toal_sand_dried:totalSandDriedMet[0]?totalSandDriedMet[0].id:null,
            total_sand_fed_inst:toatlSandFedInst[0]?toatlSandFedInst[0].id:"",
            total_sand_fed:totalSandFedMet[0]?totalSandFedMet[0].id:null,
            total_scrap_inst:totalScrapInst[0]?totalScrapInst[0].id:"",
            total_scrap:totalScrapMet[0]?totalScrapMet[0].id:null
        }
            getUpdateDryerConfig(datas4,totalStartupInst[0]?totalStartupInst[0].id:"",totalStartupMet[0]?totalStartupMet[0].id:null,totalShutdownInst[0]?totalShutdownInst[0].id:"",totalShutdownMet[0]?totalShutdownMet[0].id:null,emptyRunInst[0]?emptyRunInst[0].id:"",emptyRunMet[0]?emptyRunMet[0].id:null);
          }else{
            if(isDryer){
              let datas1={
                enable:isDryer,
                entityid:currEntityID,
                line_id:headPlant.id,
                gas_energy_inst:gasEnergyInst[0]?gasEnergyInst[0].id:"",
                gas_energy:gasEnergyMet[0]?gasEnergyMet[0].id:null,
                electrical_energy_inst:electricEnergyInst[0]?electricEnergyInst[0].id:"",
                electrical_energy:electricEnergyMet[0]?electricEnergyMet[0].id:null,
                moisture_in_inst:moistureInInst[0]?moistureInInst[0].id:"",
                moisture_in:moistureInMet[0]?moistureInMet[0].id:null,
                moisture_out_inst:moistureOutInst[0]?moistureOutInst[0].id:"",
                moisture_out:moistureOutMet[0]?moistureOutMet[0].id:null,
                toal_sand_dried_inst:totalSandDriedInst[0]?totalSandDriedInst[0].id:null,
                toal_sand_dried:totalSandDriedMet[0]?totalSandDriedMet[0].id:null,
                total_sand_fed_inst:toatlSandFedInst[0]?toatlSandFedInst[0].id:"",
                total_sand_fed:totalSandFedMet[0]?totalSandFedMet[0].id:null,
                total_scrap_inst:totalScrapInst[0]?totalScrapInst[0].id:"",
                total_scrap:totalScrapMet[0]?totalScrapMet[0].id:null
            }
              getAddDryerConfig(datas1,totalStartupInst[0]?totalStartupInst[0].id:"",totalStartupMet[0]?totalStartupMet[0].id:null,totalShutdownInst[0]?totalShutdownInst[0].id:"",totalShutdownMet[0]?totalShutdownMet[0].id:null,emptyRunInst[0]?emptyRunInst[0].id:"",emptyRunMet[0]?emptyRunMet[0].id:null)
            }
          }          
        }
        if (Number(entityType.value) === 3 && oeeParams) {
          
          if(isAnalytic){
            getAnalyticConfig(currEntityID,AnyltConfig)
          }else{
            getAnalyticConfigDel([currEntityID])
          }
          if(!isReading){
            getDeleteOEEConfig([currEntityID])
            handleEntityDialogClose();
    props.handleActiveIndex(0)

            setSnackMessage(t('UpdatedEntity') + entityName.value)
            setSnackType("success")
            setOpenSnack(true) 
            if (entityDialogMode === 'create') {
              setTimeout(() => {
                props.getUpdatedEntityList();
              },[600])
            } else {
              props.getUpdatedEntityList();
        
            }
            setBtnLoad(false)
          }else{
            let datas3={
              currEntityID:currEntityID,
              partSignal: partSignal.value,
              partInstru:partInstru.value,
              isStatusSignal:partSignal.value,
              isStatusSigIns: partInstru.value,
              plannedDT:plannedDT.value, 
              plannedSetupTime: plannedSetupTime ? plannedSetupTime.value : 0,
              customReport:customReport, 
              binaryPartCount:binaryPartCount,
              isStandardMicrostop: standardMicrostop || false, 
              oeeValueAbove: String(oeeValueAbove.value), 
              oeeValueBelow:String(oeeValueBelow.value),
              assetOoeAboveColor:assetOoeAboveColor.value, 
              assetOoeBelowColor: assetOoeBelowColor.value, 
              assetOoeBetweenColor: assetOoeBetweenColor.value
            }
            getAddorUpdateOEEConfig(datas3, micStopToTime, isStatusSignal, dressingprogram, dressingSignal && dressingSignal.value?dressingSignal.value:'' , downfallPartCount, micStopFromTime,isRunningTime)
          }
       
        }
       else {
          if(Number(entityType.value) === 3 && isAnalytic){
            getAnalyticConfig(currEntityID,AnyltConfig)
          }else{
            getAnalyticConfigDel([currEntityID])
          }
          getDeleteOEEConfig([currEntityID])
          handleEntityDialogClose();
    props.handleActiveIndex(0)

          setSnackMessage(t('UpdatedEntity') + entityName.value)
          setSnackType("success")
          setOpenSnack(true) 
          if (entityDialogMode === 'create') {
            setTimeout(() => {
              props.getUpdatedEntityList();
            },[600])
          } else {
            props.getUpdatedEntityList();
      
          }
          setBtnLoad(false)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditAnEntityLoading, EditAnEntityData, EditAnEntityError])


  useEffect(()=>{
    if(!UpdateZoneMapedAssetLoading && UpdateZoneMapedAssetData && !UpdateZoneMapedAssetError){

      if(UpdateZoneMapedAssetData.affected_rows > 0){
        handleEntityDialogClose();
    props.handleActiveIndex(0)

        setSnackMessage(t('UpdatedEntity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true) 
        if (entityDialogMode === 'create') {
          setTimeout(() => {
            props.getUpdatedEntityList();
          },[600])
        } else {
          props.getUpdatedEntityList();
    
        }
        setBtnLoad(false)
      }else{
        handleEntityDialogClose();
    props.handleActiveIndex(0)

        setSnackMessage('Unable to add' + entityName.value)
        setSnackType("warning")
        setOpenSnack(true) 
        if (entityDialogMode === 'create') {
          setTimeout(() => {
            props.getUpdatedEntityList();
          },[600])
        } else {
          props.getUpdatedEntityList();
    
        }
        setBtnLoad(false)
      }

    }
  },[UpdateZoneMapedAssetLoading, UpdateZoneMapedAssetData, UpdateZoneMapedAssetError,])


function timeOutVal1() {
  plannedDTRef.current.value = plannedDT.value;
  plannedSetupTimeRef.current.value = plannedSetupTime.value;
  
  if (dressingProgramRef.current) {
    dressingProgramRef.current.value = dressingprogram;
  }
}


function timeOutVal2(){
  assetOoeAboveColorRef.current.value = assetOoeAboveColor.value
  assetOoeBelowColorRef.current.value = assetOoeBelowColor.value
  assetOoeBetweenColorfnRef.current.value = assetOoeBetweenColor.value
}
  useEffect(() => {
    if (!MetricsForSingleInstrumentLoading && !MetricsForSingleInstrumentError && MetricsForSingleInstrumentData) {
      if (MetricsForSingleInstrumentData.Data.length > 0) {
        let partSig = []
       
        // eslint-disable-next-line array-callback-return
        MetricsForSingleInstrumentData.Data.map(val => {
          let Unit = val.metric.name ? val.metric.name : ''
          partSig.push({ id: val.metric.id, name: val.metric.title + (Unit ? ("(" + Unit + ")") : ''),key: val.metric.name ,on_change: val.on_change})
        }) 
        setPartInstrumentMetrics(partSig);
       
      } else {
        setPartInstrumentMetrics([]);

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MetricsForSingleInstrumentLoading, MetricsForSingleInstrumentData, MetricsForSingleInstrumentError])

  useEffect(() => {
    if (!MetricsForSingleInstrumentMssLoading && !MetricsForSingleInstrumentMssError && MetricsForSingleInstrumentMssData) {
      if (MetricsForSingleInstrumentMssData.Data.length > 0) {
        let partSig = []
        // eslint-disable-next-line array-callback-return
        MetricsForSingleInstrumentMssData.Data.map(val => {
          partSig.push({ id: val.metric.id, name: val.metric.title + "(" + val.metric.metricUnitByMetricUnit.unit + ")" })
        })
        setMSSInstrumentMetrics(partSig);
    
      } else {
        setMSSInstrumentMetrics([]);
        
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MetricsForSingleInstrumentMssLoading, MetricsForSingleInstrumentMssData, MetricsForSingleInstrumentMssError])

  useEffect(() => {
    setPartSignalTypeArr([

      { id: 1, name: "Incremental" },
      { id: 2, name: "Binary (Rising Edge)" },
      { id: 3, name: "Binary (Falling Edge)" },
      { id: 4, name: "Binary (Positive Edge)" },

    ]);
  }, []);

  useEffect(()=>{
    if(!props.entityDialog){
      handleEntityDialogClose()

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.entityDialog])

  useImperativeHandle(ref, () =>
  (
    {
      handleEntityDialog: () => {
        setEntityDialogMode("create")
        setEntityDialogMode("create")
      },
      handleDeleteDialogOpen: (data) => {
        CheckEntityFunc(data.id)
        setCurrEntityID(data.id)
        setEntityDialogMode("delete")
        setEntityName({ value: data.name, isValid: true })
        setEntityType({ value: data.entity_type, isValid: true })
        setAssetType({ value: data.asset_types, isValid: true })
       
      },
      handleEditEnitytDialogOpen: (data) => {
        handleEditEnitytDialogOpen(data)
      },
      handleTriggerSave:()=>{
        configOeeDialog1()
      }
    }
  )
  )

 
  function CheckEntityFunc(id) {
    getCheckEntity(id)
  }

  const handleEntityDialogClose = () => {
    setEntityName({ value: "", isValid: true })
    setImageurl({ value: "", isValid: true})
    setEntityType({ value: "", isValid: true })
    setAssetType({ value: 0, isValid: true })
    setInstrument({ value: [], isValid: true })
    setPartInstru({ value: "", isValid: true })
    setPartSignal({ value: "", isValid: true })
    setPartSignalType({ value: "", isValid: true })
    setPlannedDT({ value: "", isValid: true })
    setMSSInstru({ value: "", isValid: true })
    setMSSignal({ value: "", isValid: true })
    setDressingSignal({value:"",isValid:true});
    setEditCustomDash(true)
    setcustomReport(true)
    setStandardMicrostop(false)
    setMicStopFromTime(30)
    setMicStopToTime(120)
    setMicStopFromTimeValid(true)
    setMicStopToTimeValid(true)
    setPlannedSetupTime({ value: "", isValid: true })
    setdressingProgram('')
    setUpdateedititem(false);
    setOeeParam(false);
    setconfirmDelete(false)
    setBinaryPartCount(false)
    setDownfallPartCount(false)
    setIsDryer(false);
    setIsDryerRowAdded(false);
    setMoistureInInst([]);
    setMoistureInMet([]);
    setMoistureInMetList([])
    setMoistureOutInst([]);
    setMoistureOutMet([]);
    setMoistureOutMetList([])
    setGasEnergyInst([]);
    setGasEnergyMet([])
    setGasEnergyMetList([])
    setElectricEnergyInst([])
    setElectricEnergyMet([])
    setElectricEnergyMetList([])
    setTotalSandDriedInst([])
    setTotalSandDriedMet([])
    setTotalSandDriedMetList([])
    setTotalSandFedInst([])
    setTotalSandFedMet([])
    setTotalSandFedMetList([])
    setTotalScrapInst([])
    setTotalScrapMet([])
    setTotalScrapMetList([])
    setTotalStartupInst([])
    setTotalStartupMet([])
    setTotalStartupMetList([])
    setTotalShutdownInst([])
    setTotalShutdownMet([])
    setTotalShutdownMetList([])
    setEmptyRunInst([])
    setEmptyRunMet([])
    setEmptyRunMetList([])
    props.handleEntityDialogClose()
    if (entityDialogMode === 'create') {
      setTimeout(() => {
        props.getUpdatedEntityList();
      },[600])
    } else {
      props.getUpdatedEntityList();

    }
  };

 
  const storeDryerDetatils = (instru,metric) =>{
    try{      
      const instrumentarr = props.instrumentMetricsListData.filter(x=>x.instruments_id === instru) ; 
      let metricList = [];
      let metrics = []
      let instrument_ar = []
      if(instrumentarr.length>0){      
        metricList = instrumentarr.map(x=>x.metric); 
        if(metricList.length>0){
          metrics = metricList.filter(x=>x.id === metric);          
        }          
        
        instrument_ar.push({id:instrumentarr[0].instruments_id,name:instrumentarr[0].instrument.name});               
      } 
      return [instrument_ar,metricList,metrics];
    }catch(err){
      return [[],[],[]];
    }
  }
  const handleEditEnitytDialogOpen = (data) => {
    getViewAssetDoc({entity_id:data.id})
    getGetAssetDocsList({entity_id:data.id})
    setUpdateedititem(true);
    setCurrEntityID(data.id)
    setEntityDialogMode("edit")
    setisEditPage(true)
    if(Number(data.entity_type) === 3){
      setAssetDoc(true)
    }else{
      setAssetDoc(false)

    }
    setEntityName({ value: data.name, isValid: true })
    setEntityType({ value: data.entity_type, isValid: true })
    setAssetType({ value: data.asset_types, isValid: true })
    setImageurl({ value:  data.imageurl, isValid: true})
    SetSAPCode({ value: (data.sap_equipments && data.sap_equipments[0]?.equipment_code) || "", isValid: true })


    if(data.info && data.info.fault_Analysis){
      setisFaultAnalysis(data.info.fault_Analysis)
    }
    if(data.info && data.info.contractInstrument){
      setcontractTarget({value:data.info.contractInstrument,isValid:false})
    }
    if(data.is_zone){
      setisZone(data.is_zone)
    }else{
      setisZone(false)
    }
    if(data.node_zone_mappings.length > 0){
      setZoneAsset(data.node_zone_mappings[0].asset_id)
      setzoneAssetId(data.node_zone_mappings[0].id)
    }
    
    if(data.info && data.info.target){
      setTimeout(()=>{
        contractTargetPercentage.current.value = data.info.target;
        contractTenure.current.value = data.info.tenure ? data.info.tenure : ''
        
      },500)

    }

    if(data.info &&data.info.ImageURL && data.asset_types === 15){
     setImageurl({ value:data.info.ImageURL , isValid: true })

      setTimeout(()=>{
        ImageURL.current.value = data.info.ImageURL
      },500)

    }

    if(data.dryer_config){
      setIsDryerRowAdded(true);
      setIsDryer(data.dryer_config.is_enable?data.dryer_config.is_enable:false);
    }else{
      setIsDryerRowAdded(false)
      setIsDryer(false);
    }
    
    const instrumentList = []
    if (data.entity_instruments) {
      // eslint-disable-next-line array-callback-return
      data.entity_instruments.map((val) => {
        instrumentList.push(instruments.filter(x => x.id === val.instrument_id)[0])
      });
      
    }

    if (instrumentList.length > 0) {
      setInstrument({ value: instrumentList, isValid: true })
      setExtInstrument({ value: instrumentList.map(x => {return x.id}), isValid: true })
    }
   

    setTimeout(() => {
      EntityNameRef.current.value = data.name
      setSpindleSpeed(data?.spindle_speed_threshold)
      setFeedRate(data?.feed_rate_threshold)
      spindleSpeedRef.current.value = data?.spindle_speed_threshold
      feedRateRef.current.value = data?.feed_rate_threshold
    }, 500)
    if(data.dryer_config){ 
      
      if(data.dryer_config.electrical_energy_consumption_instrument){ 
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.electrical_energy_consumption_instrument,data.dryer_config.electrical_energy_consumption)            
       
        setElectricEnergyInst(inst)  
        setElectricEnergyMetList(metList);
        setElectricEnergyMet(met)      
      }
      if(data.dryer_config.gas_energy_consumption_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.gas_energy_consumption_instrument,data.dryer_config.gas_energy_consumption)            
      
        setGasEnergyInst(inst)  
        setGasEnergyMetList(metList);
        setGasEnergyMet(met)      
      } 
      if(data.dryer_config.moisture_input_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.moisture_input_instrument,data.dryer_config.moisture_input)            
       
       
        setMoistureInInst(inst)  
        setMoistureInMetList(metList);
        setMoistureInMet(met)      
      } 
      if(data.dryer_config.moisture_output_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.moisture_output_instrument,data.dryer_config.moisture_output)            
      
      
        setMoistureOutInst(inst)  
        setMoistureOutMetList(metList);
        setMoistureOutMet(met)      
      } 
      if(data.dryer_config.moisture_output_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.moisture_output_instrument,data.dryer_config.moisture_output)            
    
        setMoistureOutInst(inst)  
        setMoistureOutMetList(metList);
        setMoistureOutMet(met)      
      }  
      if(data.dryer_config.total_sand_dried_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_sand_dried_instrument,data.dryer_config.total_sand_dried)            
       
      
        setTotalSandDriedInst(inst)  
        setTotalSandDriedMetList(metList);
        setTotalSandDriedMet(met)      
      }   
      if(data.dryer_config.total_sand_fed_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_sand_fed_instrument,data.dryer_config.total_sand_fed)            
     
      
        setTotalSandFedInst(inst)  
        setTotalSandFedMetList(metList);
        setTotalSandFedMet(met)      
      }   
      if(data.dryer_config.total_scrap_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_scrap_instrument,data.dryer_config.total_scrap)            
       
      
        setTotalScrapInst(inst)  
        setTotalScrapMetList(metList);
        setTotalScrapMet(met)      
      }    
      if(data.dryer_config.total_scrap_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_scrap_instrument,data.dryer_config.total_scrap)            
       
      
        setTotalScrapInst(inst)  
        setTotalScrapMetList(metList);
        setTotalScrapMet(met)      
      }    
      if(data.dryer_config.total_startup_time_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_startup_time_instrument,data.dryer_config.total_startup_time)            

       
        setTotalStartupInst(inst)  
        setTotalStartupMetList(metList);
        setTotalStartupMet(met)      
      }  
      if(data.dryer_config.total_shutdown_time_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.total_shutdown_time_instrument,data.dryer_config.total_shutdown_time)            
      
        setTotalShutdownInst(inst)  
        setTotalShutdownMetList(metList);
        setTotalShutdownMet(met)      
      }      
      if(data.dryer_config.empty_run_time_instrument){
        const [inst,metList,met] = storeDryerDetatils(data.dryer_config.empty_run_time_instrument,data.dryer_config.empty_run_time)            
     
        setEmptyRunInst(inst)  
        setEmptyRunMetList(metList);
        setEmptyRunMet(met)      
      }       
    }
    let oeeData = entity.filter(x => x.id === data.id)[0]
    let AnalyticConfig = props.AnalyticConfigListData.filter(x => x.entity_id === data.id)
   
    if(AnalyticConfig.length> 0){
      setisAnalytic(true)
      setMetricFields(AnalyticConfig[0].config.Config)
      setPartInstru({ value: AnalyticConfig[0].config.Instrument, isValid: true })
      getMetricsForSingleInstrument(AnalyticConfig[0].config.Instrument, "Part")
      setMetrics({ value: AnalyticConfig[0].config.Metrics, isValid: true })
    }else{
      setisAnalytic(false)
      setMetrics({ value: [], isValid: true })
    }

    try {
      if (oeeData.prod_asset_oee_configs.length > 0) {
        setIsReading(true);
        setOeeParam(true);
        setIsReading(true);
        setPartInstru({ value: oeeData.prod_asset_oee_configs[0].instrument.id, isValid: true })
        getMetricsForSingleInstrument(oeeData.prod_asset_oee_configs[0].instrument.id, "Part")
        setPartSignal({ value: oeeData.prod_asset_oee_configs[0].metric.id, isValid: true })
        setMSSInstru({ value: oeeData.prod_asset_oee_configs[0].instrumentByMachineStatusSignalInstrument.id, isValid: true })
        getMetricsForSingleInstrumentMss(oeeData.prod_asset_oee_configs[0].instrumentByMachineStatusSignalInstrument.id, "Mss");
        setMSSignal({ value: oeeData.prod_asset_oee_configs[0].metric.id, isValid: true })
      

        setPlannedDT({ value: oeeData.prod_asset_oee_configs[0].planned_downtime, isValid: true })
        setPlannedSetupTime({ value: oeeData.prod_asset_oee_configs[0].setup_time, isValid: true })
        setMicStopFromTime(oeeData.prod_asset_oee_configs[0].min_mic_stop_duration ? oeeData.prod_asset_oee_configs[0].min_mic_stop_duration : 0);
        setMicStopToTime(oeeData.prod_asset_oee_configs[0].mic_stop_duration ? oeeData.prod_asset_oee_configs[0].mic_stop_duration : 0);
        setStatusSignal(oeeData.prod_asset_oee_configs[0].is_status_signal_available ? oeeData.prod_asset_oee_configs[0].is_status_signal_available : false)
        setcustomReport(oeeData.prod_asset_oee_configs[0].enable_setup_time)
        setStandardMicrostop(oeeData.prod_asset_oee_configs[0].is_standard_microstop)
       
        setDressingSignal({value:oeeData.prod_asset_oee_configs[0].metricByDressingSignal?oeeData.prod_asset_oee_configs[0].metricByDressingSignal.id:0,isValid:true})
      
        setdressingProgram(oeeData.prod_asset_oee_configs[0].dressing_program ? oeeData.prod_asset_oee_configs[0].dressing_program : "")
        let binaryPart = oeeData.prod_asset_oee_configs[0].is_part_count_binary
        let downfallPart = oeeData.prod_asset_oee_configs[0].is_part_count_downfall
        setBinaryPartCount(oeeData.prod_asset_oee_configs[0].is_part_count_binary ? oeeData.prod_asset_oee_configs[0].is_part_count_binary : false)
        setDownfallPartCount(oeeData.prod_asset_oee_configs[0].is_part_count_downfall ? oeeData.prod_asset_oee_configs[0].is_part_count_downfall : false)
        setTimeout(()=>{
          plannedDTRef.current.value= oeeData.prod_asset_oee_configs[0].planned_downtime
          // spindleSpeedRef.current.value = oeeData.prod_asset_oee_configs[0].spindle_speed_threshold
          // feedRateRef.current.value = oeeData.prod_asset_oee_configs[0].feed_rate_threshold
        },300)
        setTimeout(()=>{
          plannedSetupTimeRef.current.value=oeeData.prod_asset_oee_configs[0].setup_time
        },300)
        setTimeout(()=>{
          dressingProgramRef.current.value=oeeData.prod_asset_oee_configs[0].dressing_program ? oeeData.prod_asset_oee_configs[0].dressing_program : ""
        },300)
        if (!binaryPart && !downfallPart) {
          setPartSignalType({ value: 1, isValid: true })
        }
        else if (binaryPart && !downfallPart) {
          setPartSignalType({ value: 2, isValid: true })
        }
        else if (binaryPart && downfallPart) {
          setPartSignalType({ value: 3, isValid: true })
        }
        else if (!binaryPart && downfallPart) {
          setPartSignalType({ value: 4, isValid: true })
        }

        setOeeValueAbove({ value: oeeData.prod_asset_oee_configs[0].above_oee_value, isValid: true }) 
        setOeeValueBelow({ value: oeeData.prod_asset_oee_configs[0].below_oee_value, isValid: true }) 
        
      } else {
        setIsReading(false);
      }
    }

    catch (err) {
      // console.log("NEW MODEL", "ERR", err, "Entity Setting", new Date())
    }

  };

  const handleAssetTypeChange = (event) => {
    setAssetType({ value: event.target.value, isValid: event.target.value !== "" });
    setIsDryer(false);
  }

  

 const handleInstrumentsListChange = (event) => {
   
  // console.clear()
  // // console.log(event)
  // let fovr = []
  // let sspeedOvr = []
  // event?.map((x, index) => {
  //   x.instruments_metrics.map((met) => {
  //     // console.log(met.metric.name)
  //     if(met.metric.name === 'Fovr'){
  //       fovr.push(true)
  //       // setIsFovr(true)
  //     }
  //     if(met.metric.name === 'SspeedOvr'){
  //       sspeedOvr.push(true)
  //       // setIsSspeedOvr(true)
  //     }
  //   })
  // })
  // console.log(fovr, sspeedOvr)
  // setIsFovr(fovr)
  // setIsSspeedOvr(sspeedOvr)
    setInstrument({ value: event, isValid: event.length !== 0 });
  
  }
  const handleMetrics = (event,option) => {
     
    setMetrics({ value: event, isValid: event.length !== 0 });
    let setelement = [...MetricFields]; 
    // eslint-disable-next-line array-callback-return
    let removed = []
    // eslint-disable-next-line array-callback-return
    event.map(val=>{
      let Copy = setelement.filter(x => x.metric_id === val.id)
      if(Copy.length> 0 ){
        removed.push(Copy[0])
      }
        
    })
if(removed.length === setelement.length ){
  removed.forEach((val,index)=>{
    val.field = index + 1
  })
}
    setMetricFields(removed);
  }
  
  const handleReading = (e) => {
    setIsReading(!isReading);
    if (updateedititem && partInstru.value && isReading) {
      SetSnackMessage(t('OEE configuration will be deleted for this entity'))
      SetSnackType("warning")
      setsnackOpen(true)  
    }
  }

  const handleAnalytic = () => {
    setisAnalytic(!isAnalytic);
    if (updateedititem && partInstru.value && isAnalytic) {
      SetSnackMessage(t('Analytics configuration will be deleted for this entity'))
      SetSnackType("warning")
      setsnackOpen(true)  
    }
  }


  const handleFaultToggle = () =>{
    setisFaultAnalysis(!isFaultAnalysis)
  }
  const handleStat = (e,field) => {
    setIsStat(!isStat);
    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex(x=>x.field === field);
    let fieldObj = {...setelement[fieldIndex]};
            
    fieldObj['stat'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;
    
    setMetricFields(setelement);
  }

  const handlePartInstruments = (event) => {
    setPartInstru({ value: event.target.value, isValid: event.target.value !== "" });
    setMetrics({ value: [], isValid: true })
    setMetricFields([{field : 1,metric_id: '',chartType:'',Min:'',Max:'',stat:false}])
    getMetricsForSingleInstrument(event.target.value, "Part")
    setMSSInstru({ value: event.target.value, isValid: event.target.value !== "" });
    getMetricsForSingleInstrumentMss(event.target.value, "Mss");
  }
 

  const handlePartSignal = (event,f) => {
    setPartSignal({ value: event.target.value, isValid: event.target.value !== "" });
  }

  const handlePartSignalType = (event) => {
    setPartSignalType({ value: event.target.value, isValid: event.target.value !== "" });

    if (event.target.value === 1) {
      setBinaryPartCount(false)
      setDownfallPartCount(false)
    }
    else if (event.target.value === 2) {
      setBinaryPartCount(true)
      setDownfallPartCount(false)
    }
    else if (event.target.value === 3) {
      setBinaryPartCount(true)
      setDownfallPartCount(true)
    }
    else if (event.target.value === 4) {
      setBinaryPartCount(false)
      setDownfallPartCount(true)
    }

  }

  function handleChartType(e,field){
    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex(x=>x.field === field);
    let fieldObj = {...setelement[fieldIndex]};
            
    fieldObj['chartType'] = e.target.value;
    setelement[fieldIndex] = fieldObj;
    
    setMetricFields(setelement); 
  }

  function handleMetricchange(e,field){
    let exist = MetricFields.filter(v=> v.metric_id === e.target.value)
    if(exist.length>0){
        SetSnackMessage(t('Metric Already Selected'))
        SetSnackType("warning")
        setsnackOpen(true)
    }else{
      let setelement = [...MetricFields];
      const fieldIndex = setelement.findIndex(x=>x.field === field);
      let fieldObj = {...setelement[fieldIndex]};
              
      fieldObj['metric_id'] = e.target.value;
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
    
    }
    
  }

  function handleMin(e,field){

    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex(x=>x.field === field);
    let fieldObj = {...setelement[fieldIndex]};
            
    fieldObj['Min'] = e.target.value;
    setelement[fieldIndex] = fieldObj;
    
    setMetricFields(setelement);
  }

  function handleMax(e,field){
   
    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex(x=>x.field === field);
    let fieldObj = {...setelement[fieldIndex]};
            
    fieldObj['Max'] = e.target.value;
    setelement[fieldIndex] = fieldObj;
    
    setMetricFields(setelement);
  }

  function AddMetric(){
   
    if(Metrics.value.length !== MetricFields.length){
      let setelement = [...MetricFields];
      const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
      setelement.push({ field: lastfield,metric_id: '',chartType:'',Min:'',Max:'',stat:false});
      
      setMetricFields(setelement);
    }
    
  }
  

  const steps = [
    { id: "create", name: 'Asset doc',stepperName: 2 },
    { id: "assetOEEparameter", name: 'Asset OEE Parameter',stepperName:3 },
    { id: "assetOEEparameter2", name: 'OEE Ring config',stepperName: 4},
     
  ];


  const analytics = [
    { id:" assetOEEparameter3", name: 'Analytics Configuration' ,stepperName: isReading ? 5 : 3},
  ];

  const asset = [
    {id: "assetOEEparameter0", name: "Asset Details", stepperName: 1 }
  ]
  const assignMicStopFrom = async (e) => {
    const microStopFrom = micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue
    const microStopTo = micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue
  
    if (microStopFrom.toString() !== "") {

      let microStopFromMin =  microStopFrom.split(":")[0] * 60;
      let microStopFromSec =  microStopFrom.split(":")[1];
      
      setMicStopFromTime(parseInt(microStopFromMin) + parseInt(microStopFromSec));
      setMicStopFromTimeValid(true)
      if (microStopTo.toString() !== "") {
        const currDate = new Date();
        const strFromDate = currDate.toISOString().split('T').shift() + "T00:" + microStopFrom
        const strToDate = currDate.toISOString().split('T').shift() + "T00:" + microStopTo
       

        if (new Date(strFromDate).getTime() < new Date(strToDate).getTime()) {
          setMicStopFromTimeValid(true)
          setMicStopToTimeValid(true)

        }
        else {
          setMicStopFromTimeValid(false)
          setMicStopToTimeValid(false)
        }
      }
    }
    else {
      setMicStopFromTime("")
      setMicStopFromTimeValid(true)
    }
  }

  
  const assignMicStopTo = async (e) => {
    const microStopFrom = micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue
    const microStopTo = micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue

   
    if (microStopTo.toString() !== "") {
     
      let microStopToMin =  microStopTo.split(":")[0] * 60;
      let microStopToSec =  microStopTo.split(":")[1];

      setMicStopToTime(parseInt(microStopToMin) + parseInt(microStopToSec));
      setMicStopToTimeValid(true)

      if (microStopFrom.toString() !== "" && microStopTo.toString() !== "") {
        const currDate = new Date();
        const strFromDate = currDate.toISOString().split('T').shift() + "T00:" + microStopFrom
        const strToDate = currDate.toISOString().split('T').shift() + "T00:" + microStopTo
      

        if (new Date(strFromDate).getTime() < new Date(strToDate).getTime()) {
          setMicStopFromTimeValid(true)
          setMicStopToTimeValid(true)
        }
        else {
          setMicStopFromTimeValid(false)
          setMicStopToTimeValid(false)
        }
      }
    }
    else {
      setMicStopToTime("")
      setMicStopToTimeValid(true)
    }
  }



  const handleDressingignal = (e) => {
    setDressingSignal({value:e.target.value,isValid: e.target.value !== ""});
  }

  const handleCheck = (e) => {
    setcustomReport(!customReport);
    if (customReport) {
      setPlannedSetupTime({ value: 0, isValid: true });
    }
  };

  function DeleteRelationEntity() {
    getDeleteEntityRelation(currEntityID)
    getAnalyticConfigDel([currEntityID])

  }

  const clickEntityButton = () => {
    if (entityDialogMode === "delete") {
      getDeleteAnEntity(currEntityID)
      getDeleteAssetDoc({entity_id:currEntityID})
      getAnalyticConfigDel([currEntityID])
    }
    else {
      if (entityName.isValid && entityType.isValid) {
        if (entityName.value.toString() === "") {
          setEntityName({ value: "", isValid: false })
        } else if (entityType.value.toString() === "") {
          setEntityType({ value: "", isValid: false })
        }
        else {
          if (Number(entityType.value) === 3 && oeeParams) {
            if (partInstru.value.toString() === "") {
              setPartInstru({ value: "", isValid: false })
            }
            else if (partSignal.value.toString() === "") {
              setPartSignal({ value: "", isValid: false })
            }
            else if (partSignalType.value.toString() === "") {
              setPartSignalType({ value: "", isValid: false })
            }
            else if(dressingSignal && dressingSignal.value && dressingSignal.value.toString() === ""){
              setDressingSignal({value: "", isValid: false})
            }
            
            else if (plannedDTRef.current.value === "") {
              setMSSInstru({ value: "", isValid: false })
              setMSSignal({ value: "", isValid: false })
              setPlannedDT({ value: "", isValid: false })
            }
            
            else {
              setMSSInstru({ value: "", isValid: true })
              setMSSignal({ value: "", isValid: true })
              setPlannedDT({ value: "", isValid: true })
              if (entityDialogMode === "create") { 
                if(assetType.value === 8){
                  if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                    || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                  {

                    if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                      SetSnackMessage("Spindle Speed cannot be Empty" )
                      setsnackOpen(true)
                      SetSnackType("Warning")
                    }
                      else if(feedRate === null || feedRate === null || feedRate === '') {
                        SetSnackMessage("Feed Threshold cannot be empty")
                        setsnackOpen(true)
                        SetSnackType("Warning")
                      }

                  } else {
                    if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                        SetSnackMessage("Feed ss Threshold cannot be empty")
                        setsnackOpen(true)
                        SetSnackType("Warning")
                    }
                    else {
                      getAddNewEntity(currUser.id, entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-' }, undefined, Number(spindleSpeed), Number(feedRate)) 

                    }
                  }
                } else {
                  getAddNewEntity(currUser.id, entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-' }, undefined, Number(spindleSpeed), Number(feedRate)) 
                  
                }
              }
              else if (entityDialogMode === "edit") { 
                if(assetType.value === 8){
                  if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                    || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                  {

                    if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                      SetSnackMessage("Spindle Speed cannot be Empty" )
                      setsnackOpen(true)
                      SetSnackType("Warning")
                    }
                      else if(feedRate === null || feedRate === null || feedRate === '') {
                        SetSnackMessage("Feed Threshold cannot be empty")
                        setsnackOpen(true)
                        SetSnackType("Warning")
                      }

                  } else {
                    if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                        SetSnackMessage("Feed ss Threshold cannot be empty")
                        setsnackOpen(true)
                        SetSnackType("Warning")
                    }
                    else {
                      // alert("1")
                      getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate)) 
                    }
                  }
                } else {
                  // alert('2')
                  getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate)) 
                }
              }
            }
          }
          else {
            if (entityDialogMode === "create") { 
              if(assetType.value === 8){
                if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                  || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                {

                  if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                    SetSnackMessage("Spindle Speed cannot be Empty" )
                    setsnackOpen(true)
                    SetSnackType("Warning")
                  }
                    else if(feedRate === null || feedRate === null || feedRate === '') {
                      SetSnackMessage("Feed Threshold cannot be empty")
                      setsnackOpen(true)
                      SetSnackType("Warning")
                    }

                } else {
                  if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                      SetSnackMessage("Feed ss Threshold cannot be empty")
                      setsnackOpen(true)
                      SetSnackType("Warning")
                  }
                  else {

                    getAddNewEntity(currUser.id, entityName.value, entityType.value,assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                  }
                }
              } else {
                getAddNewEntity(currUser.id, entityName.value, entityType.value,assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
              }
            }
            else if (entityDialogMode === "edit") { 
              if(assetType.value === 8){
                if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                  || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                {

                  if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                    SetSnackMessage("Spindle Speed cannot be Empty" )
                    setsnackOpen(true)
                    SetSnackType("Warning")
                  }
                    else if(feedRate === null || feedRate === null || feedRate === '') {
                      SetSnackMessage("Feed Threshold cannot be empty")
                      setsnackOpen(true)
                      SetSnackType("Warning")
                    }

                } else {
                  if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                      SetSnackMessage("Feed ss Threshold cannot be empty")
                      setsnackOpen(true)
                      SetSnackType("Warning")
                  }
                  else {
                    // alert('3')
                    getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate)) 
                  }
                }
              } else {
                // alert('4')
                getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate)) 
              }
            }
          }
        }
      }
    }
  }


 
  const configOeeDialog = () => {

    
    if (EntityNameRef.current) {
      if (EntityNameRef.current.value) {
        setEntityName({ value: EntityNameRef.current.value, isValid: true })
      } else {
        setEntityName({ value: "", isValid: false })
        return false 
      }
    }
    
    

    
    
    if (entityType.isValid) {

      if (entityType.value.toString() === "") {
        setEntityType({ value: "", isValid: false })
      } 
      else {

        //Asset Insert
        // eslint-disable-next-line eqeqeq
        if(entityType.value == 4){
         if (contractTargetPercentage.current.value === '' ){
           setiscontractTargetPercentage(true)
           return false
        }else if(!contractTarget){
          setcontractTarget({value:'',isValid:true})
          return false
        }

        }
        if (Number(entityType.value) === 3) {

          if (assetType.isValid) {
            if (!assetType.value) {
              setAssetType({ value: 0, isValid: false })
              return false
            }
         
              else {

                //Asset Insert with OEE
                if (isReading && !isAnalytic) {
                
                  setOeeParam(true)
                  
                  if (entityDialogMode === "assetOEEparameter") {
                    if (partInstru.value.toString() === "") {
                      setPartInstru({ isValid: false })
                    }
                    else if (partSignal.value.toString() === "") {
                      setPartSignal({ isValid: false })
                    }
                    else if(dressingSignal && dressingSignal.value && dressingSignal.value.toString()===""){
                      setDressingSignal({isValid:false})
                    }
                    else if (partSignalType.value.toString() === "") {
                      setPartSignalType({ isValid: false })
                    }
                    else if (plannedDTRef.current.value === "") {
                      setPlannedDT({ isValid: false })
                    }
                    else if (micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopFromTimeValid) {
                      return false;
                    }
                    else if (micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopToTimeValid) {
                      return false;
                    }
                    else {
                     
                      if (dressingProgramRef.current) {
                        setdressingProgram(dressingProgramRef.current.value)
                      }
                      setPlannedDT({ value: plannedDTRef.current.value, isValid: true })

                      if (editCustomDash === true) {

                        if (plannedSetupTimeRef.current) {
                          if (plannedSetupTimeRef.current.value === "") {
                            setPlannedSetupTime({ isValid: false })
                          } else {
                            setPlannedSetupTime({ value: plannedSetupTimeRef.current.value, isValid: true })
                            if (dressingProgramRef.current) {
                              setdressingProgram(dressingProgramRef.current.value)
                            }
                            if(isDryer){
                              setEntityDialogMode("assetOEEparameter4")
                              handleNext()
                            }else{
                              setEntityDialogMode("assetOEEparameter2")
                              handleNext()
                              setTimeout(timeOutVal2, 500)
                            }                            
                          }

                        }
                        else {
                          setPlannedSetupTime({ value: 0, isValid: true });
                          if (dressingProgramRef.current) {
                            setdressingProgram(dressingProgramRef.current.value)
                          }
                          if(isDryer){
                            
                            setEntityDialogMode("assetOEEparameter4")
                            handleNext()
                          }else{ 
                            setEntityDialogMode("assetOEEparameter2")
                            handleNext()
                            setTimeout(timeOutVal2, 500)
                          } 
                        }
                        
                      } else {
                        setPlannedSetupTime({ value: 0, isValid: true }); 
                        if (dressingProgramRef.current) {
                          setdressingProgram(dressingProgramRef.current.value)
                        }
                        if(isDryer){
                          setEntityDialogMode("assetOEEparameter4")
                          handleNext()
                        }else{  
                          setEntityDialogMode("assetOEEparameter2")
                          handleNext()
                          setTimeout(timeOutVal2, 500)
                        } 
                      }
                    }

                  }
                   else if (entityDialogMode === "assetOEEparameter2") {
                    if (oeeValueAbove.value.toString() === "") { setOeeValueAbove({ value: '', isValid: false }) }
                    else if (oeeValueBelow.value.toString() === "" || oeeValueBelow.value === undefined) { setOeeValueBelow({ value: '', isValid: false }) }
                    else if (updateedititem === true) {
                      if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                        if(assetType.value === 8){
                          if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                            || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                          {
    
                            if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                              SetSnackMessage("Spindle Speed cannot be Empty" )
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
                              else if(feedRate === null || feedRate === null || feedRate === '') {
                                SetSnackMessage("Feed Threshold cannot be empty")
                                setsnackOpen(true)
                                SetSnackType("Warning")
                              }
    
                          } else {
                            if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                                SetSnackMessage("Feed ss Threshold cannot be empty")
                                setsnackOpen(true)
                                SetSnackType("Warning")
                            }
                            else {
                              // alert("5")
                              getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                            }
                          }
                        } else {
                          // alert("6")
                          getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                        setBtnLoad(true)
                      }

                    } else {
                      if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                        setOeeValueAbove({ value: oeeValueAbove.value, isValid: true })
                        // Asset Insert with OEE
                        if(assetType.value === 8){
                          if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                            || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                          {
    
                            if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                              SetSnackMessage("Spindle Speed cannot be Empty" )
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
                              else if(feedRate === null || feedRate === null || feedRate === '') {
                                SetSnackMessage("Feed Threshold cannot be empty")
                                setsnackOpen(true)
                                SetSnackType("Warning")
                              }
    
                          } else {
                            if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                                SetSnackMessage("Feed ss Threshold cannot be empty")
                                setsnackOpen(true)
                                SetSnackType("Warning")
                            }
                            else {
                              getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))

                            }
                          }
                        } else {
                          
                          getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                        setBtnLoad(true)
                      }

                    }

                  }
                  else if(entityDialogMode === "assetOEEparameter4"){
                    setEntityDialogMode('assetOEEparameter2') 
                    handleNext()
                    setTimeout(timeOutVal2, 500)
                  }
                  else  if  (entityDialogMode === "assetOEEparameter0"){
                    setEntityDialogMode("assetOEEparameter")
                    handleNext()
                   
                    setTimeout(timeOutVal1, 500)
                  }else { 
                    setEntityDialogMode("assetOEEparameter0")
                    handleNext()
                  }
                } 
                else if (isReading && isAnalytic) {
                  setOeeParam(true)
                 
                  if (entityDialogMode === "assetOEEparameter") {
                    if (partInstru.value.toString() === "") {
                      setPartInstru({ isValid: false })
                      
                    }
                    else if (partSignal.value.toString() === "") {
                      setPartSignal({ isValid: false })
                    }
                    else if (partSignalType.value.toString() === "") {
                      setPartSignalType({ isValid: false })
                    }
                    else if(dressingSignal && dressingSignal.value && dressingSignal.value.toString()===""){
                      setDressingSignal({isValid:false})
                    }
                    
                    else if (plannedDTRef.current.value === "") {
                      setPlannedDT({ isValid: false })
                    }
                    else if (micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopFromTimeValid) {
                      return false;
                    }
                    else if (micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopToTimeValid) {
                      return false;
                    }
                    else {
                   
                      if (dressingProgramRef.current) {
                        setdressingProgram(dressingProgramRef.current.value)
                      }
                      setPlannedDT({ value: plannedDTRef.current.value, isValid: true })

                      if (editCustomDash === true) {

                        if (plannedSetupTimeRef.current) {
                          if (plannedSetupTimeRef.current.value === "") {
                            setPlannedSetupTime({ isValid: false })
                          } else {
                            setPlannedSetupTime({ value: plannedSetupTimeRef.current.value, isValid: true })
                            if (dressingProgramRef.current) {
                              setdressingProgram(dressingProgramRef.current.value)
                            }
                            if(isDryer){
                              setEntityDialogMode("assetOEEparameter4")  
                              handleNext()
                            }else{
                              
                            setEntityDialogMode("assetOEEparameter2")
                            handleNext()
                            setTimeout(timeOutVal2, 500)
                            } 
                          }

                        }
                        else {
                          setPlannedSetupTime({ value: 0, isValid: true });
                          if (dressingProgramRef.current) {
                            setdressingProgram(dressingProgramRef.current.value)
                          }
                          if(isDryer){
                            setEntityDialogMode("assetOEEparameter4")
                            handleNext()
                          }else{
                          setEntityDialogMode("assetOEEparameter2")
                          handleNext()
                          setTimeout(timeOutVal2, 500)
                          }
                        }
                      } else {
                        setPlannedSetupTime({ value: 0, isValid: true });
                        if (dressingProgramRef.current) {
                          setdressingProgram(dressingProgramRef.current.value)
                        }
                        if(isDryer){
                          setEntityDialogMode("assetOEEparameter4")
                          handleNext()
                        }else{
                          setEntityDialogMode("assetOEEparameter2")
                          handleNext()
                          setTimeout(timeOutVal1, 500)
                        }
                      }
                    }

                  } else if (entityDialogMode === "assetOEEparameter2") {
                    if (oeeValueAbove.value.toString() === "") { setOeeValueAbove({ value: '', isValid: false }) }
                    else if (oeeValueBelow.value.toString() === "" || oeeValueBelow.value === undefined) { setOeeValueBelow({ value: '', isValid: false }) }
                    else if (updateedititem === true) {
                      if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                        setEntityDialogMode("assetOEEparameter3")
                        handleNext()
                     
                      }

                    } else {
                      if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                        setOeeValueAbove({ value: oeeValueAbove.value, isValid: true })
                         
                        // Asset Insert with OEE
                        setEntityDialogMode("assetOEEparameter3")
                        handleNext()
                       
                      }

                    }

                  } else if (entityDialogMode === "assetOEEparameter3") {
                    if (partInstru.value.toString() === "") {
                      SetSnackMessage(t('Please Select Instrument'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                    if (Metrics.value.length === 0) {
                      SetSnackMessage(t('Please Select Metric'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                    let MetValid = false
                    // eslint-disable-next-line array-callback-return
                    MetricFields.forEach(val => {
                      if (!val.metric_id || !val.Max || !val.Min) {
                        MetValid = true;
                      }
                    });
                    
                    if ((MetricFields.length === 0)) {
                      SetSnackMessage(t('MetricConfiqCheck'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                    if (MetValid) {
                      SetSnackMessage(t('MetricConfiqDetCheck'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                    let config = { Instrument: partInstru.value, Metrics: Metrics.value, Config: MetricFields }
                   
                    setAnyltConfig(config)
                    if (updateedititem === true) {
                      setBtnLoad(true)
                      if(assetType.value === 8){
                        if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                          || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                        {
  
                          if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                            SetSnackMessage("Spindle Speed cannot be Empty" )
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }
                            else if(feedRate === null || feedRate === null || feedRate === '') {
                              SetSnackMessage("Feed Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
  
                        } else {
                          if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                              SetSnackMessage("Feed ss Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                          }
                          else {
                            // alert("7")
                            getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                          }
                        }
                      } else {
                        // alert("8")
                        getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                      }
                      getAnalyticConfig(currEntityID, config)
                    } else {
                      setBtnLoad(true)
                      if(assetType.value === 8){
                        if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                          || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                        {
  
                          if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                            SetSnackMessage("Spindle Speed cannot be Empty" )
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }
                            else if(feedRate === null || feedRate === null || feedRate === '') {
                              SetSnackMessage("Feed Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
  
                        } else {
                          if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                              SetSnackMessage("Feed ss Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                          }
                          else {
                            getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,  headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))

                          }
                        }
                      } else {
                        
                        getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,  headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                      }
                    }

                  }else if(entityDialogMode === "create"){
                    setEntityDialogMode('assetOEEparameter0')
                    handleNext()
                  }
                  else  if  (entityDialogMode === "assetOEEparameter0"){
                    setEntityDialogMode("assetOEEparameter")
                    handleNext()
                   
                    setTimeout(timeOutVal1, 500)
                  }else { 
                    setEntityDialogMode("assetOEEparameter0")
                    handleNext()
                  }
                }
                 else if (!isReading && isAnalytic) {
                
                  setEntityDialogMode("assetOEEparameter0")
                  handleNext()
                  if(entityDialogMode === "assetOEEparameter0"){
                    setEntityDialogMode("assetOEEparameter3")
                    handleNext()
                  }else if (entityDialogMode === "assetOEEparameter3") {
                   
                    if (partInstru.value.toString() === "") {
                      SetSnackMessage(t('Please Select Instrument'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                  

                    if (Metrics.value.length === 0) {
                      SetSnackMessage(t('Please Select Metric'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                   
                    let MetValid = false
                    // eslint-disable-next-line array-callback-return
                    MetricFields.forEach(val => {
                      if (!val.metric_id || !val.chartType) {
                        MetValid = true;
                      }
                    });
                    
                    if (MetValid) {
                      SetSnackMessage(t('Please Fill Metric Configuration'))
                      SetSnackType("warning")
                      setsnackOpen(true)
                      return false
                    }
                    let config = { Instrument: partInstru.value, Metrics: Metrics.value, Config: MetricFields }
                   
                    setAnyltConfig(config)
          
                    if (updateedititem === true) {
                      if(assetType.value === 8){
                        if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                          || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                        {
  
                          if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                            SetSnackMessage("Spindle Speed cannot be Empty" )
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }
                            else if(feedRate === null || feedRate === null || feedRate === '') {
                              SetSnackMessage("Feed Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
  
                        } else {
                          if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                              SetSnackMessage("Feed ss Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                          }
                          else {
                            // alert("9")
                            getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                          }
                        }
                      } else {
                        // alert("10")
                        getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                      }
                      getAnalyticConfig(currEntityID, config)
                      setBtnLoad(true)
                    } else {
                      setBtnLoad(true)
                      if(assetType.value === 8){
                        if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                          || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                        {
  
                          if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                            SetSnackMessage("Spindle Speed cannot be Empty" )
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }
                            else if(feedRate === null || feedRate === null || feedRate === '') {
                              SetSnackMessage("Feed Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                            }
  
                        } else {
                          if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                              SetSnackMessage("Feed ss Threshold cannot be empty")
                              setsnackOpen(true)
                              SetSnackType("Warning")
                          }
                          else {
                            getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                          }
                        }
                      } else {
                        getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                      }
                    }

                  }

                }
                else if (entityDialogMode === "create"){
                  setEntityDialogMode("assetOEEparameter0")
                  handleNext()
                }else if(entityDialogMode === "assetOEEparameter"){
                  if(assetType.value === 8){
                    if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                      || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                    {

                      if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                        SetSnackMessage("Spindle Speed cannot be Empty" )
                        setsnackOpen(true)
                        SetSnackType("Warning")
                      }
                        else if(feedRate === null || feedRate === null || feedRate === '') {
                          SetSnackMessage("Feed Threshold cannot be empty")
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }

                    } else {
                      if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                          SetSnackMessage("Feed ss Threshold cannot be empty")
                          setsnackOpen(true)
                          SetSnackType("Warning")
                      }
                      else {

                        getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                      }
                    }
                  } else {
                    
                    getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                  }
                  setBtnLoad(true)
                }else if(entityDialogMode === "edit"){
                  setEntityDialogMode("assetOEEparameter0")
                  handleNext() 
                }
                else {
                  // Asset Insert with No OEE Params
                  if (entityDialogMode === "assetOEEparameter0" && !isEditPage) {
                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      
                      getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
                    setBtnLoad(true)
                  }
                  else if (entityDialogMode === "assetOEEparameter0" && isEditPage) {
                    setBtnLoad(true)
                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          // alert("11")
                          getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      // alert("12")
                      getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
                  }
                }
              }
          }
        } else {
          // Node Insert
          if (entityDialogMode === "create") {
            if(assetType.value === 8){
              if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
              {

                if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                  SetSnackMessage("Spindle Speed cannot be Empty" )
                  setsnackOpen(true)
                  SetSnackType("Warning")
                }
                  else if(feedRate === null || feedRate === null || feedRate === '') {
                    SetSnackMessage("Feed Threshold cannot be empty")
                    setsnackOpen(true)
                    SetSnackType("Warning")
                  }

              } else {
                if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                    SetSnackMessage("Feed ss Threshold cannot be empty")
                    setsnackOpen(true)
                    SetSnackType("Warning")
                }
                else {
                  getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'},isZone, Number(spindleSpeed), Number(feedRate));
                }
              }
            } else {
              
              getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'},isZone, Number(spindleSpeed), Number(feedRate));
            }
            setBtnLoad(true)
          }
          else if (entityDialogMode === "edit") {
            setBtnLoad(true)

            if(assetType.value === 8){
              if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
              {

                if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                  SetSnackMessage("Spindle Speed cannot be Empty" )
                  setsnackOpen(true)
                  SetSnackType("Warning")
                }
                  else if(feedRate === null || feedRate === null || feedRate === '') {
                    SetSnackMessage("Feed Threshold cannot be empty")
                    setsnackOpen(true)
                    SetSnackType("Warning")
                  }

              } else {
                if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                    SetSnackMessage("Feed ss Threshold cannot be empty")
                    setsnackOpen(true)
                    SetSnackType("Warning")
                }
                else {
                  // alert("13")
                  getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'},isZone, Number(spindleSpeed), Number(feedRate))
                }
              }
            } else {
              // alert("14")
              getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'},isZone, Number(spindleSpeed), Number(feedRate))
            }
          }
        }

      }
    }
   
  }

  const configOeeDialog1=()=>{
    if (EntityNameRef.current) {
      if (EntityNameRef.current.value) {
        setEntityName({ value: EntityNameRef.current.value, isValid: true })
      } else {
        setEntityName({ value: "", isValid: false })
        return false 
      }
    }
    setEntityType({ value: 3, isValid: true })

          try{
            if (assetType.isValid) {
              if (!assetType.value) {
                setAssetType({ value: 0, isValid: false })
                return false
              }else{
                if (isReading && !isAnalytic) {
                  setOeeParam(true)
    
                  if (partInstru.value.toString() === "") {
                    setPartInstru({ isValid: false })
                    return false;
  
                  }
                  else if (partSignal.value.toString() === "") {
                    setPartSignal({ isValid: false })
                    return false;
  
                  }
                  else if(dressingSignal && dressingSignal.value && dressingSignal.value.toString()===""){
                    setDressingSignal({isValid:false})
                    return false;
  
                  }
                  else if (partSignalType.value.toString() === "") {
                    setPartSignalType({ isValid: false })
                    return false;
  
                  }
                 
                  else if (plannedDTRef.current.value === "") {
                    setPlannedDT({ isValid: false })
                    return false;
  
                  }
                  else if (micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopFromTimeValid) {
                    return false;
                  }
                  else if (micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopToTimeValid) {
                    return false;
    
                }
                else {
                         
                  if (dressingProgramRef.current) {
                    setdressingProgram(dressingProgramRef.current.value)
                  }
                  setPlannedDT({ value: plannedDTRef.current.value, isValid: true })
    
                  if (editCustomDash === true) {
    
                    if (plannedSetupTimeRef.current) {
                      if (plannedSetupTimeRef.current.value === "") {
                        setPlannedSetupTime({ isValid: false })
                    return false;
  
                      } else {
                        setPlannedSetupTime({ value: plannedSetupTimeRef.current.value, isValid: true })
                        if (dressingProgramRef.current) {
                          setdressingProgram(dressingProgramRef.current.value)
                        }
                      }
    
                    }
                    else {
                      setPlannedSetupTime({ value: 0, isValid: true });
                      if (dressingProgramRef.current) {
                        setdressingProgram(dressingProgramRef.current.value)
                      }
                    }
                    
                  } else {
                    setPlannedSetupTime({ value: 0, isValid: true }); 
                    if (dressingProgramRef.current) {
                      setdressingProgram(dressingProgramRef.current.value)
                    }
                  }
                }
                if (oeeValueAbove.value.toString() === "") { setOeeValueAbove({ value: '', isValid: false }) }
                else if (oeeValueBelow.value.toString() === "" || oeeValueBelow.value === undefined) { setOeeValueBelow({ value: '', isValid: false }) }
                else if (updateedititem === true) {
                  if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          // alert("15")
                          getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      // alert("16")
                      getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
                    setBtnLoad(true)
                  }
    
                } else {
                  if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                    setOeeValueAbove({ value: oeeValueAbove.value, isValid: true })
                    // Asset Insert with OEE
                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      
                      getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
                    setBtnLoad(true)
                  }
    
                }
    
              }
              else if (isReading && isAnalytic) {
                setOeeParam(true)
                  if (partInstru.value.toString() === "") {
                    setPartInstru({ isValid: false })
                    return false;
  
                    
                  }
                  else if (partSignal.value.toString() === "") {
                    setPartSignal({ isValid: false })
                    return false;
  
                  }
                  else if (partSignalType.value.toString() === "") {
                    setPartSignalType({ isValid: false })
                    return false;
  
                  }
                  else if(dressingSignal && dressingSignal.value && dressingSignal.value.toString()===""){
                    setDressingSignal({isValid:false})
                    return false;
  
                  }
                 
                  else if (plannedDTRef.current.value === "") {
                    setPlannedDT({ isValid: false })
                    return false;
  
                  }
                  else if (micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopFromTimeValid) {
                    return false;
  
                  }
                  else if (micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue === "" || !micStopToTimeValid) {
                    return false;
                    
                  }
                  else {
                 
                    if (dressingProgramRef.current) {
                      setdressingProgram(dressingProgramRef.current.value)
                    }
                    setPlannedDT({ value: plannedDTRef.current.value, isValid: true })
    
                    if (editCustomDash === true) {
    
                      if (plannedSetupTimeRef.current) {
                        if (plannedSetupTimeRef.current.value === "") {
                          setPlannedSetupTime({ isValid: false })
                    return false;
  
                        } else {
                          setPlannedSetupTime({ value: plannedSetupTimeRef.current.value, isValid: true })
                          if (dressingProgramRef.current) {
                            setdressingProgram(dressingProgramRef.current.value)
                          }
                         
                        }
    
                      }
                      else {
                        setPlannedSetupTime({ value: 0, isValid: true });
                        if (dressingProgramRef.current) {
                          setdressingProgram(dressingProgramRef.current.value)
                        }
                       
                      }
                    } else {
                      setPlannedSetupTime({ value: 0, isValid: true });
                      if (dressingProgramRef.current) {
                        setdressingProgram(dressingProgramRef.current.value)
                      }
                     
                    }
                  }
    
                  if (oeeValueAbove.value.toString() === "") { 
                    setOeeValueAbove({ value: '', isValid: false })
                    return false
                   }
                  else if (oeeValueBelow.value.toString() === "" || oeeValueBelow.value === undefined) { 
                    setOeeValueBelow({ value: '', isValid: false })
                    return false
  
                   }
                
                  else {
                    if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                      setOeeValueAbove({ value: oeeValueAbove.value, isValid: true })
                       
                      // // Asset Insert with OEE
                    
                     
                    }
    
                  }
    
                  if (partInstru.value.toString() === "") {
                    SetSnackMessage(t('Please Select Instrument'))
                    SetSnackType("warning")
                    setsnackOpen(true)
                    return false
                  }
                  if (Metrics.value.length === 0) {
                    SetSnackMessage(t('Please Select Metric'))
                    SetSnackType("warning")
                    setsnackOpen(true)
                    return false
                  }
                  let MetValid = false
                  // eslint-disable-next-line array-callback-return
                  MetricFields.forEach(val => {
                    if (!val.metric_id || !val.Max || !val.Min) {
                      MetValid = true;
                    }
                  });
                  
                  if ((MetricFields.length === 0)) {
                    SetSnackMessage(t('MetricConfiqCheck'))
                    SetSnackType("warning")
                    setsnackOpen(true)
                    return false
                  }
                  if (MetValid) {
                    SetSnackMessage(t('MetricConfiqDetCheck'))
                    SetSnackType("warning")
                    setsnackOpen(true)
                    return false
                  }
                  let config = { Instrument: partInstru.value, Metrics: Metrics.value, Config: MetricFields }
                 
                  setAnyltConfig(config)
                  if (updateedititem === true) {
                    setBtnLoad(true)
                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {

                          getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      
                      getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
                    getAnalyticConfig(currEntityID, config)
                  } else {
                    setBtnLoad(true)

                    if(assetType.value === 8){
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                            SetSnackMessage("Feed ss Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,  headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                        }
                      }
                    } else {
                      
                      getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,  headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}, undefined, Number(spindleSpeed), Number(feedRate))
                    }
  
                  }
    
              }
              else if (!isReading && isAnalytic) {
                    
                    
                        if (partInstru.value.toString() === "") {
                          SetSnackMessage(t('Please Select Instrument'))
                          SetSnackType("warning")
                          setsnackOpen(true)
                          return false
                        }
                      
    
                        if (Metrics.value.length === 0) {
                          SetSnackMessage(t('Please Select Metric'))
                          SetSnackType("warning")
                          setsnackOpen(true)
                          return false
                        }
                       
                        let MetValid = false
                        // eslint-disable-next-line array-callback-return
                        MetricFields.forEach(val => {
                          if (!val.metric_id || !val.chartType) {
                            MetValid = true;
                          }
                        });
                        
                        if (MetValid) {
                          SetSnackMessage(t('Please Fill Metric Configuration'))
                          SetSnackType("warning")
                          setsnackOpen(true)
                          return false
                        }
                        let config = { Instrument: partInstru.value, Metrics: Metrics.value, Config: MetricFields }
                       
                        setAnyltConfig(config)
              
                        if (updateedititem === true) {
                          if(assetType.value === 8){
                            if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                              || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                            {
      
                              if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                                SetSnackMessage("Spindle Speed cannot be Empty" )
                                setsnackOpen(true)
                                SetSnackType("Warning")
                              }
                                else if(feedRate === null || feedRate === null || feedRate === '') {
                                  SetSnackMessage("Feed Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                                }
      
                            } else {
                              if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                                  SetSnackMessage("Feed ss Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                              }
                              else {
                                getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                              }
                            }
                          } else {
                            getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                          }
                          // getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                          getAnalyticConfig(currEntityID, config)
                          setBtnLoad(true)
                        } else {
                          setBtnLoad(true)
                          if(assetType.value === 8){
                            if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                              || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                            {
      
                              if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                                SetSnackMessage("Spindle Speed cannot be Empty" )
                                setsnackOpen(true)
                                SetSnackType("Warning")
                              }
                                else if(feedRate === null || feedRate === null || feedRate === '') {
                                  SetSnackMessage("Feed Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                                }
      
                            } else {
                              if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                                  SetSnackMessage("Feed ss Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                              }
                              else {
                                getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                              }
                            }
                          } else {

                            getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 3, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''}, undefined, Number(spindleSpeed), Number(feedRate))
                          }
  
                        }
    
    
                    }else {
                      // Asset Insert with No OEE Params
  
                      if (!isEditPage) {
                    console.log("enter Save4", Number(spindleSpeed), Number(feedRate))
                    if(assetType.value === 8){
                      console.clear()
                      console.log(spindleSpeed, feedRate)
                      if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                        || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                      {

                        if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                          SetSnackMessage("Spindle Speed cannot be Empty" )
                          setsnackOpen(true)
                          SetSnackType("Warning")
                        }
                          else if(feedRate === null || feedRate === null || feedRate === '') {
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                          }

                      } else {
                        if((spindleSpeed !== '' && spindleSpeed !== null) && feedRate === null || feedRate === ''){
                            SetSnackMessage("Feed Threshold cannot be empty")
                            setsnackOpen(true)
                            SetSnackType("Warning")
                        }
                        else {
                          getAddNewEntity(
                            currUser.id, 
                            EntityNameRef.current ? EntityNameRef.current.value : entityName.value,
                            3, 
                            assetType.value, 
                            headPlant.id,
                            {
                              isFaultAnalysis:isFaultAnalysis,
                              contractInstrument:contractTarget.value,
                              target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
                              tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',
                              ImageURL:imageurl.value  ?imageurl.value   : '-'
                            }, undefined,
                            Number(spindleSpeed), Number(feedRate)
                          )
                        }
                      }
                     
                    }
                    else {
                      getAddNewEntity(
                        currUser.id, 
                        EntityNameRef.current ? EntityNameRef.current.value : entityName.value,
                        3, 
                        assetType.value, 
                        headPlant.id,
                        {
                          isFaultAnalysis:isFaultAnalysis,
                          contractInstrument:contractTarget.value,
                          target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
                          tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',
                          ImageURL:imageurl.value  ?imageurl.value   : '-'
                        }, undefined,
                        Number(spindleSpeed), Number(feedRate))
                        // spindleSpeedRef.current.value, feedRateRef.current.value)
                    }
                   
                        setBtnLoad(true)

                      }
                      else if (isEditPage) {
                        setBtnLoad(true)
                        if(assetType.value === 8){
                            if(((spindleSpeed === null && feedRate !== null) || (spindleSpeed !== null && feedRate === null)) 
                              || ((spindleSpeed === '' && feedRate !== '') || (spindleSpeed !== '' && feedRate === '')) )
                            {
      
                              if(spindleSpeed === null || spindleSpeed === undefined || spindleSpeed === ''){
                                SetSnackMessage("Spindle Speed cannot be Empty" )
                                setsnackOpen(true)
                                SetSnackType("Warning")
                              }
                                else if(feedRate === null || feedRate === null || feedRate === '') {
                                  SetSnackMessage("Feed Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                                }
      
                            } else {
                              if((spindleSpeed !== '' && spindleSpeed !== null) && (feedRate === null || feedRate === '')){
                                  SetSnackMessage("Feed ss Threshold cannot be empty")
                                  setsnackOpen(true)
                                  SetSnackType("Warning")
                              }
                              else {
                                // alert("HISIS")
                                getEditAnEntity(
                                  currEntityID,
                                  currUser.id, 
                                  EntityNameRef.current ? EntityNameRef.current.value : entityName.value,
                                  3, 
                                  assetType.value, 
                                  // headPlant.id,
                                  {
                                    isFaultAnalysis:isFaultAnalysis,
                                    contractInstrument:contractTarget.value,
                                    target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
                                    tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',
                                    ImageURL:imageurl.value  ?imageurl.value   : '-'
                                  }, undefined,
                                  Number(spindleSpeed), Number(feedRate)
                                )
                              }
                            }
                          // }
                        }
                        else {
                          getEditAnEntity(currEntityID, 
                            currUser.id, 
                            EntityNameRef.current ? EntityNameRef.current.value : entityName.value, 
                            3, 
                            assetType.value,
                            {
                              isFaultAnalysis:isFaultAnalysis,
                              contractInstrument:contractTarget.value,
                              target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
                              tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',
                              ImageURL:imageurl.value  ? imageurl.value   : '-'
                            }, undefined, 
                            Number(spindleSpeed), 
                            Number(feedRate)) //spindleSpeedRef.current.value, feedRateRef.current.value)
                        }
                        
                      }
                    }
    
    
    
            }
        }
          }catch(e){
            console.log(e,'COnOEE')
          }
          
   

  }


  
  
   const handleNext = () => {
      setStepperName((prevStep) => (prevStep < renderstepperoption().length ? prevStep + 1 : prevStep));
    }
  
  const handleOEEabove = (event) => {
    if (parseInt(event.target.value) < oeeValueBelow.value) {
      setOeeValueAbove({ value: event.target.value, isValid: false });
    } else {
      setOeeValueAbove({ value: event.target.value, isValid: event.target.value !== "" });
    }

  }
  const handleOEEbelow = (event) => {
    if (parseInt(event.target.value) > oeeValueAbove.value) {
      setOeeValueBelow({ value: "", isValid: false });
    }
    else {
      setOeeValueBelow({ value: event.target.value, isValid: event.target.value !== "" });
    }
  }
  const handleOEEbetween = (event) => {
    setOeeValueBetween({ value: event.target.value, isValid: event.target.value !== "" });
  }
  const handleDryer = ()=>{
    setIsDryer(!isDryer);
  }

  const handleGasEnergyInstrument = (e,r) =>{
  
     const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
     const instrumentVal=r.filter(x=>x.id === e.target.value)
   
     setGasEnergyInst(instrumentVal);
     setGasEnergyMetList(metrics[0]);
   }

   const handleGasEnergyMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setGasEnergyMet(metrics);
  }

  const handleElectEnergyInstrument = (e,r) =>{    
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setElectricEnergyInst(instrumentVal);
    setElectricEnergyMetList(metrics[0]);
  }

  const handleElectEnergyMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setElectricEnergyMet(metrics)
  }

  const handleMoistureInInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setMoistureInInst(instrumentVal);
    setMoistureInMetList(metrics[0]);
  }

  const handleMoistureInMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setMoistureInMet(metrics)
  }

  const handleMoistureOutInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setMoistureOutInst(instrumentVal);
    setMoistureOutMetList(metrics[0])
  }

  const handleMoistureOutMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setMoistureOutMet(metrics)
  }

  const handleTotalSandDriedInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setTotalSandDriedInst(instrumentVal);
    setTotalSandDriedMetList(metrics[0]);
  }

  const handleTotalSandDriedMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setTotalSandDriedMet(metrics)
  }

  const handleTotalSandFedInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setTotalSandFedInst(instrumentVal);
    setTotalSandFedMetList(metrics[0]);
  }

  const handleTotalSandFedMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setTotalSandFedMet(metrics)
  }

  const handleTotalScrapInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setTotalScrapInst(instrumentVal);
    setTotalScrapMetList(metrics[0])
  }

  const handleTotalScrapMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setTotalScrapMet(metrics)
  }

  const handleTotalStartupInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setTotalStartupInst(instrumentVal);
    setTotalStartupMetList(metrics[0]);
  }

  const handleTotalStartupMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setTotalStartupMet(metrics)
  }

  const handleTotalShutdownInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setTotalShutdownInst(instrumentVal);
    setTotalShutdownMetList(metrics[0]);  
  }

  const handleTotalShutdownMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setTotalShutdownMet(metrics);
  }

  const handleEmptyRuntimeInstrument = (e,r) =>{
    const metrics = r.filter(x=>x.id === e.target.value).map(y=>y.instruments_metrics.map(i=>i.metric)); 
    const instrumentVal=r.filter(x=>x.id === e.target.value)
    setEmptyRunInst(instrumentVal);
    setEmptyRunMetList(metrics[0]);
  }

  const handleEmptyRuntimeMetric = (e,r) =>{
    const metrics=r.filter(x=>x.id===e.target.value)
    setEmptyRunMet(metrics)
  }

  const handleRemoveDocs=(removeIdex,fileType)=>{

    setFiles(prevFiles => ({
      ...prevFiles,
      file3:{...prevFiles.file3,[fileType]:prevFiles.file3[fileType].filter((_, index) => index !== removeIdex)} , // Remove the object at indexToRemove
      
  }));

  }

const deleteText = () =>{ 
  if(EntityRelation.length > 0){
    return (<React.Fragment>{t('Allthe') + EntityRelation.toString() + t('RelationData') + entityName.value + t('TheLine') + headPlant.name + t('NotReversibleRelation')} + <b>{entityName.value}</b></React.Fragment>)
  }
  if(EntityRelation.length === 0){
    return (<React.Fragment>{t('DeleteEntity') } <b>{entityName.value}</b>  {t('TheLine') + headPlant.name + t('NotReversible')}</React.Fragment>)
  }
}

const defaultFormatTime = (time) => {
  if (time !== "") {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    const formattedMinutes = (minutes <= 9 ? "0" : "") + minutes;
    const formattedSeconds = (seconds <= 9 ? "0" : "") + seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    return "";
  }
};


 
const handleTriggerClick = (e, Trigger) => {
  if (Trigger) {
    handleOpenPopUp(e);
  } else {
    fileInputRef.current.click();
  }
};

  useEffect(() => {
    if(stepperName === 1){
      setisFileSizeError({ type: null, value: false });
    } else if (files && stepperName !== 1) {
        let totalSize = 0;

        const calculateFileSize = (file) => {
            if (file instanceof File) {
                totalSize += file.size;
            }
        };

        if (files.file1 && files.file1 instanceof File) {
            calculateFileSize(files.file1);
        }

        if (files.file2 && Array.isArray(files.file2)) {
            files.file2.forEach((file) => {
                calculateFileSize(file);
            });
        }

        if (files.file3) {
            const file3Categories = ['sop', 'others', 'warranty', 'user_manuals'];
            file3Categories.forEach((category) => {
                if (Array.isArray(files.file3[category])) {
                    files.file3[category].forEach((file) => {
                        calculateFileSize(file);
                    });
                }
            });
        }

        const totalSizeInMB = totalSize / (1024 * 1024);

        if (totalSizeInMB > 10) {
          SetSnackMessage("Total image size exceeded 10MB")
          setsnackOpen(true)
          SetSnackType("Warning")
          setisFileSizeError({ type: 'totalFileSize', value: true });
        } else {
          setisFileSizeError({ type: null, value: false });
        }
    }
  }, [files, stepperName]);

const handleRemoveImage=(removeIndex)=>{
  // console.log(removeIndex,files.file2)
  setPreviews(prevFiles=>prevFiles.filter((_, index) => index !== removeIndex))
  setFiles(prevFiles => ({
    ...prevFiles,
    file2: prevFiles.file2.filter((_, index) => index !== removeIndex), // Remove the object at indexToRemove
    
}));

}
const helperTextCondition1 =
  micStopFromTime.toString() === "" || !micStopFromTimeValid;

const helperTextMessage1 =
  micStopFromTime.toString() === "" ? t("Please enter time") : t("From Should be lesser than to");

const helperText1 = helperTextCondition1 ? helperTextMessage1 : "";

const helperTextCondition2 =
  micStopToTime.toString() === "" || !micStopToTimeValid;

const helperTextMessage2 =
  micStopToTime.toString() === "" ? t("Please enter time") : t("To Should be greater than from");

const helperText2 = helperTextCondition2 ? helperTextMessage2 : "";

let typographyValue = '';

if (entityDialogMode === "delete") {
  if (EntityRelation.length > 0) {
    typographyValue = confirmDelete ? t('Are you sure ?') : '';
  }
}

let deleteButton;

if (entityDialogMode === "delete") {
  if (EntityRelation.length > 0) {
    deleteButton = (
      <Button
        type="primary"
        danger
        value={t('YesDelete')}
        onClick={() => {
          if (!confirmDelete) {
            setconfirmDelete(true);
          } else {
            setconfirmDelete(false);
            DeleteRelationEntity();
          }
        }}
      />
    );
  } else {
    deleteButton = (
      <Button
        type="primary"
        danger
        value={t('YesDelete')}
        onClick={() => clickEntityButton()}
      />
    );
  }
} else {
  deleteButton = null;
}

let updateButton = null;

if (entityDialogMode === "edit") {
  updateButton = (
    <Button
      type="primary"
      value={t('Update')}
      onClick={() => configOeeDialog()}
    />
  );
}

const handleEntityNameChange = (event) =>{
  if(event.target.value !== "") 
    setEntityName({ value: event.target.value, isValid: true })
  else
    setEntityName({ value: "", isValid: false })
}

const handleurlNameChange = (event) =>{
  if(event.target.value !== "") 
    setImageurl({ value: event.target.value, isValid: true })
  else
  setImageurl({ value: "", isValid: false })
}


const renderstepperoption = () => {
  if ( assetDoc && isReading && isAnalytic ) {
    return [...asset,...steps,  ...analytics];
  } else if (isReading && isAnalytic) {
    return [...steps, ...analytics];
  } else if ( assetDoc && isReading) {
    return [...asset,...steps];
  } else if ( assetDoc && isAnalytic ) {
    return [...asset,steps[0], ...analytics];
  } else if (isReading) {
    return [...steps];
  } else if (isAnalytic) {
    return [steps[0], ...analytics];
  } else if (assetDoc) {
    return [...asset,steps[0]];
  }
};



const handleFileUpload = (entityID,type) => {
  const formData = new FormData();
  // Append file1 if it exists and is a valid file
  if (files.file1 && files.file1 instanceof File) {
    formData.append("file1", files.file1);
  } else {
    console.warn("file1 is missing or invalid.");
  }
  // Append entityID
  formData.append("entityID", entityID);

  // Append file2
  if (files.file2 && Array.isArray(files.file2) && files.file2.length > 0) {
    files.file2.forEach((file) => {
      formData.append('file2', file);
    });
  }

  // Check if files.file3 exists
  if (files.file3) {
    if (Array.isArray(files.file3.sop) && files.file3.sop.length > 0) {
      files.file3.sop.forEach((file) => {
        formData.append('file3', file);
      });
    }

    if (Array.isArray(files.file3.others) && files.file3.others.length > 0) {
      files.file3.others.forEach((file) => {
        formData.append('file3', file);
      });
    }

    if (Array.isArray(files.file3.warranty) && files.file3.warranty.length > 0) {
      files.file3.warranty.forEach((file) => {
        formData.append('file3', file);
      });
    }

    if (Array.isArray(files.file3.user_manuals) && files.file3.user_manuals.length > 0) {
      files.file3.user_manuals.forEach((file) => {
        formData.append('file3', file);
      });
    }
  }


// Check for empty formData and handle the API call accordingly
if (type) {
  if (assetAttachmentList.length > 0 && formData) {
    getEditAssetDocs(formData);
  } else if (formData) {
    getaddAssetDocs(formData);
  }
} else {
  if (formData) {
    getaddAssetDocs(formData);
  }
}
};

const handleRemoveAssetImage = ()=>{
  setFiles({...files,file1:null})
  setisFileSizeError({value:false,type:null})
}


function deleteEntityRow(row) {
  let setelement = [...MetricFields];
  setelement.splice(row, 1)
  setMetricFields(setelement);
}
const handleDowntime = ()=>{
  setisRunningTime(!isRunningTime)
}

  return (
    <React.Fragment>
 <Toast type={snType} message={snackMsg} toastBar={snackOpen}  handleSnackClose={() => setsnackOpen(false)} ></Toast>
        {/* <ModalHeaderNDL> */}
        <Grid container>
          <Grid xs={2}>
          
          </Grid>
        <Grid xs={8}>
        <Typography variant="heading-02-xs" 
          value={"Asset Details"}

        />
        
          {entityDialogMode === "edit" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" &&
            <Typography variant="lable-01-s" color="secondary" value={t('EditDetails') + headPlant.name} style={{ marginBottom: 5 }} />
          }
          {entityDialogMode === "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" &&
            <Typography variant="lable-01-s" color="secondary" value={deleteText()}
            />
          }

            <div className="mb-3"  >

              <InputFieldNDL
                label={"Asset Name"}
                inputRef={EntityNameRef}
                placeholder={t("Enter Entity Name")}
                error={!entityName.isValid ? true : false}
                helperText={!entityName.isValid && entityName.value.toString() === "" ? t('TypeEntityName') : ""}
                onChange={handleEntityNameChange}
                maxLength={'150'}
              />
              </div>
              
              {entityDialogMode === "edit" && SAPCode.value !== "" ?<div className="mb-3"  > <InputFieldNDL
                label={"SAP Equipment Code"}
                value={SAPCode.value?SAPCode.value:""}
                disabled={true}
              /> </div>:<></> }
          

            <div className="mb-3 mt-3" >

              <SelectBox
                labelId="asset-type-label"
                label={t('AssetType')}
                id="asset-type-id"
                auto={false}
                multiple={false}
                options={!AssetTypeLoading && !AssetTypeError && AssetTypeData && Array.isArray(AssetTypeData) && AssetTypeData.length > 0 ? AssetTypeData : []}
                isMArray={true}
                checkbox={false}
                value={assetType.value}
                onChange={handleAssetTypeChange}
                keyValue="name"
                keyId="id"
                error={!assetType.isValid ? true : false}
                msg={t('PlsSelectAsset')}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <SelectBox
                id="instruments-List"
                label={t('Instruments Connected')}
                edit={true}
                disableCloseOnSelect={true}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                multiple={true}
                onChange={(option) => handleInstrumentsListChange(option)}
                value={instrument.value}
             
              />
              <br></br>
              {
                files.file1 ?
                  <React.Fragment>
                    <br></br>
                    <Typography value="Display Image" variant="sm-label-text-01" />
                    <Grid item xs={12}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <DummyImage />
                          <Typography value={files.file1.name} variant="lable-01-s" />
                        </div>
                        <BlackX onClick={() => handleRemoveAssetImage()} />
                      </div>
                    </Grid>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <FileInput
                      accept="image/*"
                      imageOnly
                      multiple={false}
                      onChange={(e) => handleFileChange(e, 'file1')}
                      onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                    />
                    <div className="mt-0.5" />
                    <Typography color='tertiary' variant="paragraph-xs" value={'JPG, PNG at 10mb or less (Max 500x500px)'} />
                  </React.Fragment>

              }
              <br></br>
              {assetType.value === 15 &&
                <InputFieldNDL
                  label={"Image URL"}
                  inputRef={ImageURL}
                  type={"text"}
                  placeholder={t("Enter Url")}
                  onChange={handleurlNameChange}
                />
              }
              <br></br>
              {
                assetType.value !== 15 &&
                <React.Fragment>
                  {isFileSizeError.type === "file1" && isFileSizeError.value && (
                    <React.Fragment>
                      <Typography
                        variant={"sm-helper-text-01"}
                        value={'please upload file size less then 10MB'}
                        color="#DA1E28"
                      />
                      <br></br>
                    </React.Fragment>

                  )}
                 <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />
                 <Typography
                        variant={"heading-02-xs"}
                        value={'Documents'}
                      />
                  <Grid container spacing={3} style={{marginTop:"12px"}}>
              <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <div className="flex flex-col gap-2">
                        <Typography variant="lable-02-xs" value={'Asset Images'} />
                        <Typography color='tertiary' variant="paragraph-xs" value={'only .jpg files at 10mb or less'} />
                      </div>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                      <Button
                        type={"tertiary"}
                        value={t('Add Images')}
                        icon={Plus}
                        onClick={() => { handleTriggerClick() }}
                      />
                      <input
                        accept=".jpeg,image/jpeg"
                        type="file"
                        ref={fileInputRef}
                        multiple={true}
                        onChange={(e) => handleFileChange(e, 'file2')}
                        style={{ display: 'none' }} // Hide the file input field
                      />
                    </Grid>

                    {isFileSizeError.type === "file2" && isFileSizeError.value && (
                      <React.Fragment>
                        <Grid item xs={12}>
                          <Typography
                            variant={"sm-helper-text-01"}
                            value={'please upload file size less then 10MB'}
                            color="#DA1E28"
                          />
                          <br></br>
                        </Grid>
                      </React.Fragment>
                    )}
                       <Grid item xs={12}>
 <div style={{ display: 'flex', gap: '10px'}}>
                          {previews.map((previewUrl, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img className="rounded-md" src={previewUrl} alt={`preview ${index}`} width="60px" height="60px" />
                              <svg style={{ position: 'absolute', top: '5px', right: '5px',cursor:"pointer" }} onClick={() => handleRemoveImage(index)} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="10" height="10" fill="#F0F0F0" />
                                <path d="M5 0.9375C4.19652 0.9375 3.41107 1.17576 2.743 1.62215C2.07492 2.06855 1.55422 2.70302 1.24674 3.44535C0.93926 4.18767 0.858809 5.00451 1.01556 5.79255C1.17231 6.5806 1.55923 7.30447 2.12738 7.87262C2.69553 8.44077 3.4194 8.82769 4.20745 8.98444C4.9955 9.14119 5.81233 9.06074 6.55465 8.75326C7.29698 8.44578 7.93145 7.92508 8.37785 7.257C8.82424 6.58893 9.0625 5.80349 9.0625 5C9.06044 3.92319 8.63176 2.89108 7.87034 2.12966C7.10892 1.36824 6.07681 0.939565 5 0.9375ZM6.5625 5.3125H3.4375C3.35462 5.3125 3.27514 5.27958 3.21653 5.22097C3.15793 5.16237 3.125 5.08288 3.125 5C3.125 4.91712 3.15793 4.83763 3.21653 4.77903C3.27514 4.72042 3.35462 4.6875 3.4375 4.6875H6.5625C6.64538 4.6875 6.72487 4.72042 6.78347 4.77903C6.84208 4.83763 6.875 4.91712 6.875 5C6.875 5.08288 6.84208 5.16237 6.78347 5.22097C6.72487 5.27958 6.64538 5.3125 6.5625 5.3125Z" fill="#DC3E42" />
                              </svg>
                            </div>
                          ))}
                        </div>
                        </Grid>
{/*                     
                     */}

                  </Grid>

             
                <div className="mt-3" />
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <div className="flex flex-col gap-2">
                        <Typography variant="lable-02-xs" value={'Asset Docs'} />
                        <Typography color='tertiary' variant="paragraph-xs" value={'PDF at 10mb or less'} />
                      </div>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                      <Button
                        type={"tertiary"}
                        value={t('Add Docs')}
                        icon={Plus}
                        Righticon
                        onClick={(e) => { handleTriggerClick(e, true) }}
                      />

                      <ListNDL
                        options={AddOption}
                        Open={isopen}
                        optionChange={optionChange}
                        keyValue={"name"}
                        keyId={"id"}
                        id={"popper-Alarm-add"}
                        onclose={handleClose}
                        anchorEl={notificationAnchorEl}
                        width="200px"
                      />
                      <input
                        accept=".pdf"
                        type="file"
                        multiple={true}
                        ref={fileInputDocRef}
                        onChange={(e) => handleFileChange(e, "file3")}
                        style={{ display: 'none' }} // Hide the file input field
                      // onPageChange={PageChange}
                      />
                    </Grid>
                    {isFileSizeError.type === "file3" && isFileSizeError.value && (
                      <React.Fragment>
                        <Grid item xs={12}>
                          <Typography
                            variant={"sm-helper-text-01"}
                            value={'please upload file size less then 10MB'}
                            color="#DA1E28"
                          />
                          <br></br>
                        </Grid>

                      </React.Fragment>
                    )}


                    {
                      files.file3.sop.length > 0 &&
                      files.file3.sop.map((x, i) => {
                        return (
                          <Grid item xs={12}>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <PDF />
                                <Typography value={x.name} variant="sm-helper-text-01" />
                                <TagNDL name={
                                  'SOP'

                                } style={{ backgroundColor: "#E0E0E0" }} />

                              </div>
                              <BlackX onClick={() => handleRemoveDocs(i, "sop")} />
                            </div>
                          </Grid>
                        )
                      })

                    }

                    {
                      files.file3.warranty.length > 0 &&
                      files.file3.warranty.map((x, i) => {
                        return (
                          <Grid item xs={12}>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <PDF />
                                <Typography value={x.name} variant="sm-helper-text-01" />
                                <TagNDL name={
                                  'Warranty'
                                } style={{ backgroundColor: "#E0E0E0" }} />
                              </div>
                              <BlackX onClick={() => handleRemoveDocs(i, "warranty")} />
                            </div>
                          </Grid>
                        )
                      })

                    }

                    {
                      files.file3.user_manuals.length > 0 &&
                      files.file3.user_manuals.map((x, i) => {
                        return (
                          <Grid item xs={12}>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <PDF />
                                <Typography value={x.name} variant="sm-helper-text-01" />
                                <TagNDL name={
                                  'User Manual'

                                } style={{ backgroundColor: "#E0E0E0" }} />
                              </div>
                              <BlackX onClick={() => handleRemoveDocs(i, "user_manuals")} />
                            </div>
                          </Grid>
                        )
                      })

                    }

                    {
                      files.file3.others.length > 0 &&
                      files.file3.others.map((x, i) => {
                        return (
                          <Grid item xs={12}>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <PDF />
                                <Typography value={x.name} variant="sm-helper-text-01" />
                                <TagNDL name={
                                  'Others'
                                } style={{ backgroundColor: "#E0E0E0" }} />
                              </div>
                              <BlackX onClick={() => handleRemoveDocs(i, 'others')} />
                            </div>
                          </Grid>
                        )
                      })

                    }

                  </Grid>
                {/* </AccordianNDL> */}
              </Grid>
            </Grid>

            <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />

                {/* <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  /> */}
                 <Typography
                        variant={"heading-02-xs"}
                        value={'Configurations'}
                      />
                      {
                        console.log(isSspeedOvr, isFovr)
                      }
                  {
                      assetType.value === 8 && (
                        <div className="mt-4">
                          <Grid container spacing={3}>
                            <Grid item xs={6} >
                              <InputFieldNDL
                                id="entity-name"
                                label={'Spindle Speed Threshold (RPM)'}
                                type="number"
                                placeholder={"RPM"}
                                // inputRef={spindleSpeedRef}
                                value={spindleSpeed}
                                onChange={(e) => {if(e.target.value >= 0) { setSpindleSpeed(e.target.value) }}}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <InputFieldNDL
                                id="entity-name"
                                label={'Feed Rate Threshold (mm/min)'}
                                type="number"
                                placeholder={'mm/min'}
                                // inputRef={feedRateRef}
                                value={feedRate}
                                onChange={(e) => {if(e.target.value >= 0) { setFeedRate(e.target.value) }}}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      )
                    }

                {/*OEE Configurations  */}
                  <div className="my-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="flex flex-col gap-0.5" >
                      <Typography value={"Configure OEE"} variant={"label-01-s"} />
                      <Typography value={t('Enabling this will measure manufacturing productivity of your machine')} variant={"paragraph-xs"} color='tertiary'/>
                    </div>
                    <CustomSwitch
                      id={"switch"}
                      switch={true}
                      checked={isReading}
                      onChange={handleReading}
                      // primaryLabel="OEE Configurations"
                      size="small"
                    />
                  </div>

                  <div style={{ display:isReading ? "block" : "none"}}>
              {<> 
                
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Partsignalinstruments")}
                  id="select-part-signal-instrument"
                  auto={false}
                  multiple={false}
                  options={instrument.value.length > 0 ? instrument.value : []}
                  isMArray={true}
                  checkbox={false}
                  value={partInstru.value}
                  onChange={handlePartInstruments}
                  keyValue="name"
                  keyId="id"
                  error={!partInstru.isValid ? true : false}
                  msg={t("Please select part signal instrument")}
                />
                <div className="mb-3" />
                

                <div className="mb-3">
                  <CustomSwitch
                    id={"MachineStatusSignal"}
                    switch={false}
                    checked={isStatusSignal}
                    onChange={() => setStatusSignal(!isStatusSignal)}
                    //className={classes.subTitle}
                    description={"Description"}
                    primaryLabel={t('Execution Signal Available')}
                  /> 
                </div>

                <SelectBox
                  labelId="entity-type-label"
                  label={t("Part Signal")}
                  id="select-part-signal"
                  auto={false}
                  multiple={false}
                  options={partInstrumentMetrics.length > 0 ? partInstrumentMetrics.filter(p=> p.key === 'part_count' ||p.key === 'part_counter') : [] }
                  isMArray={true}
                  checkbox={false}
                  value={partSignal.value}
                  onChange={handlePartSignal}
                  keyValue="name"
                  keyId="id"
                  error={!partSignal.isValid ? true : false}
                  msg={t("Please select part signal")}
                />
                <div className="mb-3" />

                <SelectBox
                  labelId="part-signal-type"
                  label={t('PartSignalType')}
                  id="select-part-signal-type"
                  auto={false}
                  multiple={false}
                  options={partSignalTypeArr.length > 0 ? partSignalTypeArr : [] }
                  isMArray={true}
                  checkbox={false}
                  value={partSignalType.value}
                  onChange={handlePartSignalType}
                  keyValue="name"
                  keyId="id"
                  error={!partSignalType.isValid ? true : false}
                  msg={t('PleaseSelectPartSignalType')}
                />
                <div className="mb-3" />
                {/*  */}

                {/*  */}
                {headPlant.appTypeByAppType.id !== 1 &&
                  <React.Fragment>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Dressing Signal")}
                      id="select-machine-status-signal-instrument"
                      auto={false}
                      multiple={false}
                      options={mssInstrumentMetrics.length > 0 ? mssInstrumentMetrics : [] }
                      isMArray={true}
                      checkbox={false}
                      value={dressingSignal.value}
                      onChange={handleDressingignal}
                      keyValue="name"
                      keyId="id"
                    />
                    <div className="mb-3" />

                    <InputFieldNDL
                      id="entity-name"
                      label={t('Dressing Program')}
                      inputRef={dressingProgramRef}
                      placeholder={t("Dressing Program")}
                    />
                    <div className="mb-3" />

                  </React.Fragment>
                }

                <InputFieldNDL
                  id="entity-name"
                  label={t('Planned Downtime(Per Day in hours)')}
                  type="number"
                  placeholder={t("Hours")}
                  inputRef={plannedDTRef}
                  error={!plannedDT.isValid ? true : false}
                  helperText={!plannedDT.isValid ? t("Please enter planned downtime on this asset") : ""}
                />
                <div className="mb-3" />

                <div className="mb-3">
                  <CustomSwitch
                    id={"downtimeSetup"}
                    switch={false}
                    checked={customReport}
                    onChange={handleCheck}
                    //className={classes.subTitle}
                    primaryLabel={t('Consider this setup time as downtime')}
                  />
                </div>
                {
                  customReport && (

                    <InputFieldNDL
                      id="entity-name"
                      label={t('Planned Setup Time(Minutes)')}
                      placeholder={t("Minutes")}
                      type="number"
                      inputRef={plannedSetupTimeRef}
                      helperText={!plannedSetupTime.isValid ? t("Please enter planned setuptime on this asset") : ""}
                      error={!plannedSetupTime.isValid ? true : false}
                    />
                  )
                }

                  {/**/}
                {
                  (<>
                <div style={{ marginTop: 12, marginBottom: 8 }}>
                  <Typography variant="label-02-s" color="secondary" value={t("Micro-Stop Duration")} />
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={6}>
                    <div className='mb-0.5'>
                      <Typography variant="label-02-s" color="secondary" value={t("From")} />
                    </div>
                    <div>
                      <MaskedInput
                       
                        mask={[
                          
                          /[0-5]/,
                          /\d/,
                          ":",
                          /[0-5]/,
                          /\d/,
                          
                        ]}
                        className={"maskedInput"}
                        ref={micStopFromTimeRef}
                        value={defaultFormatTime(micStopFromTime)}
                        defaultValue={defaultFormatTime(micStopFromTime)}
                        placeholder={'MM:SS'}
                        onBlur={assignMicStopFrom}
                        helperText={helperText1}
                      ></MaskedInput>

                    </div>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <div>
                      <div className='mb-0.5'>
                        <Typography variant="label-02-s" color="secondary" value={t("To")} />
                      </div>
                      <MaskedInput
                        mask={[
                          /[0-5]/,
                          /\d/,
                          ":",
                          /[0-5]/,
                          /\d/,
                        ]}
                        className={"maskedInput"}
                        ref={micStopToTimeRef}
                        value={defaultFormatTime(micStopToTime)}
                        defaultValue={defaultFormatTime(micStopToTime)}
                        placeholder={'MM:SS'}
                        onBlur={assignMicStopTo}
                        helperText={helperText2}
                      ></MaskedInput>
                    </div>
                  </Grid>
                </Grid>
                </>)
                }
              </>
              }
                 </div>
                 
                  {

                    isReading &&
                    <React.Fragment>
                      <Grid container spacing={3} style={{ alignItems: 'center' }} >
                        <Grid item xs={10}>
                          {/* <DialogContentText>If OEE is above (in%)</DialogContentText> */}
                          <InputFieldNDL
                            id="mic-stop-dur-sec"
                            label={t("If OEE is above (in%)")}
                            type="number"
                            onChange={handleOEEabove}
                            value={oeeValueAbove.value}
                            error={!oeeValueAbove.isValid ? true : false}
                            helperText={!oeeValueAbove.isValid && oeeValueAbove.value.toString() !== "" ? t("Value Should be above ") + oeeValueBelow.value : ""}
                            placeholder={t("Type value")}
                          />

                        </Grid>
                        <Grid item xs={2}>
                          <label className="mb-0.5 text-[12px]   font-geist-sans leading-[14px] font-normal text-Text-text-primary dark:text-Text-text-primary-dark"  > Card Color
                            <div className="w-full flex justify-center items-center p-2  rounded-md bg-[#f4f4f4] dark:bg-Background-bg-primary-dark" style={{  width: "100%", height: "32px" }}>
                              <div
                                style={{
                                  width: "50px",
                                  height: "16px",
                                  background: "linear-gradient(239.15deg, #FFFFFF 0%, #FFFFFF 98.94%)",
                                }}
                              />

                            </div>
                          </label>
                          {/* */}

                        </Grid>

                      </Grid>
                      <Grid container spacing={3} style={{ alignItems: 'center' }} >
                        <Grid item xs={10}>
                          {/* */}
                          <InputFieldNDL
                            id="OEE is between"
                            label={t("If OEE is between (in%)")}
                            onChange={handleOEEbetween}
                            value={oeeValueBelow.value + "-" + oeeValueAbove.value}
                            error={!oeeValueBetween.isValid ? true : false}
                            helperText={!oeeValueBetween.isValid ? t("Enter Value") : ""}
                            placeholder={t("Type value")}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={2}>

                          <label className="mb-0.5 text-[12px]   font-geist-sans leading-[14px] font-normal text-Text-text-primary dark:text-Text-text-primary-dark" style={{ color: curTheme === 'dark' ? '#ffff' : '#202020', }} > Card Color
                            <div className="w-full flex justify-center items-center p-2 mt-0.5 rounded-md bg-[#f4f4f4] dark:bg-Background-bg-primary-dark" style={{  width: "100%", height: "32px" }}>
                              <div
                                style={{
                                  width: "50px",
                                  height: "16px",
                                  background: "linear-gradient(239.15deg, #E0B000 0%, #FFDF63 98.94%) ",
                                }}
                              />

                            </div>
                          </label>
                          {/*  */}
                        </Grid>

                      </Grid>
                      <Grid container spacing={3} style={{ alignItems: 'center' }} >
                        <Grid item xs={10}>
                          <InputFieldNDL
                            id="OEE is between"
                            label={t("If OEE is below (in%)")}
                            type="number"
                            onChange={handleOEEbelow}
                            value={oeeValueBelow.value}
                            error={!oeeValueBelow.isValid ? true : false}
                            helperText={!oeeValueBelow.isValid && oeeValueBelow.value.toString() !== "" ? t("Value Should be below ") + oeeValueAbove.value : ""}
                            placeholder={t("Type value")}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <label className="mb-0.5 text-[12px]   font-geist-sans leading-[14px] font-normal text-Text-text-primary dark:text-Text-text-primary-dark" style={{ color: curTheme === 'dark' ? '#ffff' : '#202020', }} > Card Color
                            <div className="w-full flex justify-center items-center p-2 mt-0.5 rounded-md bg-[#f4f4f4] dark:bg-Background-bg-primary-dark" style={{  width: "100%", height: "32px" }}>
                              <div
                                style={{
                                  width: "50px",
                                  height: "16px",
                                  background: "linear-gradient(239.58deg, #FF4100 0%, #FF7400 100%)",
                                }}
                              />

                            </div>
                          </label>

                        </Grid>

                      </Grid>
                    </React.Fragment>

                  }
           <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />
                  {/* Analytics Configurations */}
                  <div className="mb-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="flex flex-col gap-0.5">
                      <Typography variant={"label-01-s"} >{t("Configure Analytics")}</Typography>
                      <Typography variant={"paragraph-xs"} color='tertiary'>{t('Enabling this will measure grinding analytics of your machine')}</Typography>
                    </div>
                    <CustomSwitch
                      id={"switch"}
                      switch={true}
                      checked={isAnalytic}
                      onChange={handleAnalytic}
                      // primaryLabel="Analytics Configurations"
                      size="small"
                    />

                  </div>

                  <div style={{display:isAnalytic ? "block" : 'none'}}>
                  <Grid container spacing={3}>
              <Grid item xs={6} >
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Signal Instrument")}
                  id="select-part-signal-instrument"
                  auto={false}
                  multiple={false}
                  disabled={(isReading && isAnalytic) ? true : false}
                  options={instruments.length > 0 ? instruments : [] }
                  isMArray={true}
                  checkbox={false}
                  value={partInstru.value}
                  onChange={handlePartInstruments}
                  keyValue="name"
                  keyId="id"
                  error={!partInstru.isValid ? true : false}
                  msg={t("Please select signal instrument")}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectBox MetricFields
                  label={t("Metrics")}
                  placeholder={t("Add here")}
                  id="select-part-signal"
                  edit={true}
                  auto={true}
                  multiple={true}
                  options={partInstrumentMetrics.length > 0 ? partInstrumentMetrics : []}
                  isMArray={true}
                  checkbox={false}
                  value={Metrics.value}
                  onChange={(e, option) => handleMetrics(e, option)}
                  dynamic={MetricFields}
                  keyValue="name"
                  keyId="id"
                  error={!Metrics.isValid ? true : false}
                  msg={t("Please select metrics")}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="mb-3">
                  <Typography value={t('Metric Configuration')} variant='label-02s' />

                </div>
                {MetricFields.map((val, index) => {
                  return (
                    <div key={index} className="mb-3 pb-3">
                      <Grid container spacing={3}>
                        <Grid item xs={11} >
                          <SelectBox
                            labelId="Met"
                            label={t("Metric")}
                            id={"select-part-signal" + (val.field)}
                            auto={false}
                            multiple={false}
                            options={Metrics && Metrics.value.length > 0 ? Metrics.value : []}
                            isMArray={true}
                            checkbox={false}
                            value={val.metric_id}
                            onChange={(e) => handleMetricchange(e, val.field)}
                            dynamic={MetricFields}
                            keyValue="name"
                            keyId="id"
                         
                          />
                          <div className="mt-3" />
                        </Grid>
                        <Grid item xs={1} sm={1} style={{ display: 'flex', alignItems: 'end' }}>
                                                    {
                                                        MetricFields.length-1 !== index  ?
                                                        <Button icon={Delete} danger type={'ghost'} onClick={() => deleteEntityRow(index)} />
                                                :
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"  stroke-width="1.7" stroke-miterlimit="10" />
                                                <path d="M8 8L16 16M8 16L16 8L8 16Z"  stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                                      }
                                                </Grid>
                        {/*  */}

                      </Grid>

                      <Grid container spacing={3} >

                        <Grid item xs={7} >
                          <SelectBox
                            labelId="Met"
                            label={t("Chart Type")}
                            id={"select-part-signal" + (val.field)}
                            auto={false}
                            multiple={false}
                            options={[{ id: 1, name: t("Line") }, { id: 2, name: t("Stepper") }]}
                            isMArray={true}
                            checkbox={false}
                            value={val.chartType}
                            onChange={(e) => handleChartType(e, val.field)}
                            dynamic={MetricFields}
                            keyValue="name"
                            keyId="id"
                          
                          />
                        </Grid>
                        <Grid item xs={2} >
                          <InputFieldNDL
                            id="min"
                            label={t("Min")}
                            placeholder={t('Min')}
                            type="number"
                            inputRef={MetMinRef}
                            value={val.Min}
                            dynamic={MetricFields}
                            onChange={(e) => handleMin(e, val.field)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <InputFieldNDL
                            id="max"
                            label={t("Max")}
                            placeholder={t('Max')}
                            type="number"
                            inputRef={MetMaxRef}
                            value={val.Max}
                            dynamic={MetricFields}
                            onChange={(e) => handleMax(e, val.field)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            <div>
                              <Typography variant={"paragraph-xs"} >{"Stats"}</Typography>
                            </div>
                            <div style={{ marginTop: "10px", marginRight: "5px" }}>
                              <CustomSwitch
                                id={"switch"}
                                switch={true}
                                checked={val.stat}
                                onChange={(e) => handleStat(e, val.field)}
                                size="small"
                              />
                            </div>

                          </div>
                        </Grid>
                      </Grid>
                    </div>


                  )
                }
                )}

                <Grid container spacing={3} style={{ marginTop: '12px' }}>
                  <Grid item xs={12} style={{ marginLeft: 'auto' }}>
                    <Button type="tertiary" value={t('Add Metric')} icon={Plus} onClick={() => AddMetric()} />
                  </Grid>
                </Grid>

              </Grid>

            </Grid>
                  </div>
                  <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />

                  {/* Predictive Maintenance */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="flex flex-col gap-0.5">
                      <Typography variant={"label-01-s"} >{"Configure Predictive Maintenance"}</Typography>
                      <Typography variant={"paragraph-xs"} color='tertiary'>{"Enabling this will measure Fault analytics of your asset"}</Typography>
                    </div>
                    <CustomSwitch
                      id={"switch"}
                      switch={true}
                      checked={isFaultAnalysis}
                      onChange={handleFaultToggle}
                      size="small"
                    />

                  </div>
                  <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />

                <div className="my-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="flex flex-col gap-0.5" >
                                        <Typography variant={"label-01-s"} >{"Configure Running Downtime"}</Typography>
                                        <Typography variant={"paragraph-xs"} color='tertiary'>{t("Setup the running Downtime.")}</Typography>
                                        </div>
                                        <CustomSwitch
                                        id={"switch"}
                                        switch={true}
                                        checked={isRunningTime}
                                        onChange={handleDowntime}
                                        // primaryLabel="OEE Configurations"
                                        size="small"
                                        />
                                    </div>

                                    <div className="mt-4"  />
                  <HorizontalLine variant='divider1' />
                <div className="mt-4"  />

                </React.Fragment>

              }
               {/* Dryer Configuration */}
              {
                assetType && Number(assetType.value) === 9 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="flex flex-col gap-0.5">
                    <Typography variant={"label-02-s"} >{t("Dryer Configurations")}</Typography>
                    <Typography variant={"paragraph-xs"} color='tertiary'>{t('Enabling this will allow you to give manual parameters for dryer')}</Typography>
                  </div>
                  <CustomSwitch
                    id={"switch"}
                    switch={true}
                    checked={isDryer}
                     onChange={handleDryer}
                    size="small"
                  />

                </div>

                )
              }
            </div>

            <div style={{display:isDryer ? "block" : "none"}}>
                <Grid container spacing={3}>
                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label="Gas Energy Consumed"
                      placeholder={t("SelInstru")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={ instrument && instrument.value.length > 0 ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={gasEnergyInst.length > 0 ? gasEnergyInst[0].id : ''}
                      onChange={(e, r) => handleGasEnergyInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                   
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={gasEnergyInMetList.length > 0 ? gasEnergyInMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={gasEnergyMet.length > 0 ? gasEnergyMet[0].id : null}
                      onChange={(e, r) => handleGasEnergyMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Instruments")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={electricEnergyInst.length > 0 ? electricEnergyInst[0].id : ''}
                      onChange={(e, r) => handleElectEnergyInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                    
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={electricEnergyMetList.length > 0 ? electricEnergyMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={electricEnergyMet.length > 0 ? electricEnergyMet[0].id : null}
                      onChange={(e, r) => handleElectEnergyMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                   
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t('Moisture Input')}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={moistureInInst.length > 0 ? moistureInInst[0].id : ''}
                      onChange={(e, r) => handleMoistureInInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                  
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={moistureInMetList.length > 0 ? moistureInMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={moistureInMet.length > 0 ? moistureInMet[0].id : null}
                      onChange={(e, r) => handleMoistureInMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t('Moisture Output')}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={moistureOutInst.length > 0 ? moistureOutInst[0].id : ''}
                      onChange={(e, r) => handleMoistureOutInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                   
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={moistureOutMetList.length > 0 ? moistureOutMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={moistureOutMet.length > 0 ? moistureOutMet[0].id : null}
                      onChange={(e, r) => handleMoistureOutMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Total Sand Dried")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalSandDriedInst.length > 0 ? totalSandDriedInst[0].id : ''}
                      onChange={(e, r) => handleTotalSandDriedInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                   
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={totalSandDriedMetList.length > 0 ? totalSandDriedMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalSandDriedMet.length > 0 ? totalSandDriedMet[0].id : null}
                      onChange={(e, r) => handleTotalSandDriedMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                   
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Total Sand Fed")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={toatlSandFedInst.length > 0 ? toatlSandFedInst[0].id : ''}
                      onChange={(e, r) => handleTotalSandFedInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                   
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={totalSandFedMetList.length > 0 ? totalSandFedMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalSandFedMet.length > 0 ? totalSandFedMet[0].id : null}
                      onChange={(e, r) => handleTotalSandFedMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Total Scrap")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalScrapInst.length > 0 ? totalScrapInst[0].id : ''}
                      onChange={(e, r) => handleTotalScrapInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                    
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={totalScrapMetList.length > 0 ? totalScrapMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalScrapMet.length > 0 ? totalScrapMet[0].id : null}
                      onChange={(e, r) => handleTotalScrapMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                   
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Total startup time")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalStartupInst.length > 0 ? totalStartupInst[0].id : ''}
                      onChange={(e, r) => handleTotalStartupInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                    
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={totalStartupMetList.length > 0 ? totalStartupMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalStartupMet.length > 0 ? totalStartupMet[0].id : null}
                      onChange={(e, r) => handleTotalStartupMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                   
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Total shutdown time")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalShutdownInst.length > 0 ? totalShutdownInst[0].id : ''}
                      onChange={(e, r) => handleTotalShutdownInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                    
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={totalShutdownMetList.length > 0 ? totalShutdownMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={totalShutdownMet.length > 0 ? totalShutdownMet[0].id : null}
                      onChange={(e, r) => handleTotalShutdownMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Empty run time")}
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={instrument.value.length > 0  ? instrument.value : []}
                      isMArray={true}
                      checkbox={false}
                      value={emptyRunInst.length > 0 ? emptyRunInst[0].id : ''}
                      onChange={(e, r) => handleEmptyRuntimeInstrument(e, r)}
                      keyValue="name"
                      keyId="id"
                   
                    />
                  </Grid>
                  <Grid item lg={6} >
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Metric")}
                      defaultDisableName="select metric"
                      id="select-part-signal-instrument"
                      auto={true}
                      multiple={false}
                      options={emptyRunMetList.length > 0 ? emptyRunMetList : []}
                      isMArray={true}
                      checkbox={false}
                      value={emptyRunMet.length > 0 ? emptyRunMet[0].id : null}
                      onChange={(e, r) => handleEmptyRuntimeMetric(e, r)}
                      keyValue="title"
                      keyId="id"
                    
                    />
                  </Grid>

                </Grid>
              </div>

        </Grid>
             <Grid xs={2}>
            
            </Grid>
        </Grid>
       

    </React.Fragment>
  );
});

export default AddEntity;