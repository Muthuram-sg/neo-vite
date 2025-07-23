/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useImperativeHandle} from "react"; 
import Grid from 'components/Core/GridNDL';
import { useTranslation } from 'react-i18next';
import MaskedInput from "components/Core/MaskedInput/MaskedInputNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import { useRecoilState } from "recoil";
import { user, selectedPlant, lineEntity, instrumentsList, snackToggle, snackMessage, snackType,themeMode,VirtualInstrumentsList } from "recoilStore/atoms"; 
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
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL' 
import Typography from "components/Core/Typography/TypographyNDL";
import Stepper from "components/Core/Stepper";
import FileInput from 'components/Core/FileInput/FileInputNDL';
import AccordianNDL from 'components/Core/Accordian/AccordianNDL1'
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
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";


// eslint-disable-next-line react-hooks/exhaustive-deps
const AddEntity = React.forwardRef((props, ref) => {
  const { t } = useTranslation(); 
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [snackMsg, SetSnackMessage] = useState('');
  const [snType, SetSnackType] = useState('');
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
  const [entityType, setEntityType] = useState({ value: "", isValid: true });
  const [assetType, setAssetType] = useState({ value: 0, isValid: true });
  const [instrument, setInstrument] = useState({ value: [], isValid: true });
  const [extInstrument, setExtInstrument] = useState({ value: [], isValid: true });
  const [partInstru, setPartInstru] = useState({ value: "", isValid: true });
  const [partSignal, setPartSignal] = useState({ value: "", isValid: true });
  const [dressingSignal, setDressingSignal] = useState({value:"",isValid:true});
  const [partSignalType, setPartSignalType] = useState({ value: "", isValid: true });
  const [partSignalTypeArr, setPartSignalTypeArr] = useState({ value: [], isValid: true });
  const [mssInstru, setMSSInstru] = useState({ value: "", isValid: true });
  const [msSignal, setMSSignal] = useState({ value: "", isValid: true });
  const [plannedDT, setPlannedDT] = useState({ value: "", isValid: true });
  const [plannedSetupTime, setPlannedSetupTime] = useState({ value: "", isValid: true });
  const [dressingprogram, setdressingProgram] = useState('');
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
  const [binaryPartCount, setBinaryPartCount] = useState(false);
  const [downfallPartCount, setDownfallPartCount] = useState(false);
  const [oeeParams, setOeeParam] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isAnalytic, setisAnalytic] = useState(false);
  const [isFaultAnalysis, setisFaultAnalysis] = useState(false);
  const [isStat,setIsStat]=useState(false);
  const [curTheme]=useRecoilState(themeMode)
  const [Metrics,setMetrics]  = useState({ value: [], isValid: true });
  const [MetricFields,setMetricFields] = useState([{field : 1,metric_id: '',chartType:'',Min:'',Max:'',stat:false}]);
  const [AnyltConfig,setAnyltConfig] = useState('');
  const [isStatusSignal, setStatusSignal] = useState(true);
  const [micStopFromTime, setMicStopFromTime] = useState(30);
  const [micStopToTime, setMicStopToTime] = useState(120);
  const [micStopFromTimeValid, setMicStopFromTimeValid] = useState(true);
  const [micStopToTimeValid, setMicStopToTimeValid] = useState(true);
  const [BtnLoad,setBtnLoad] = useState(false);
  const [stepperName, setStepperName] = useState(1)
  const [assetDoc,setAssetDoc] = useState(false)
    const fileInputRef = useRef(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isopen, setIsopen] = useState(false)
    const [files, setFiles] = useState({ file1: null, file2: [], file3: {sop:[],warranty:[],user_manuals:[],others:[]} }); 
    const [docType,setdocType] = useState(null)
    const [imageurl,setImageurl] = useState({ value:"" , isValid: true })

    const fileInputDocRef = useRef()
    
  const [isZone,setisZone] =  useState(false);
  const [ZoneAsset,setZoneAsset] = useState([])
  const [isEditPage,setisEditPage] = useState(false)
  

  
  // Dryer config
  const [moistureInInst, setMoistureInInst] = useState([]);
  const [moistureInMet,setMoistureInMet] = useState([]);
  const [moistureInMetList,setMoistureInMetList] =useState([])
  const [moistureOutInst,setMoistureOutInst] = useState([]);
  const [moistureOutMet,setMoistureOutMet] = useState([]);
  const [moistureOutMetList,setMoistureOutMetList] =useState([])
  const [gasEnergyInst,setGasEnergyInst] = useState([]);
  const [gasEnergyMet,setGasEnergyMet] = useState([])
  const [gasEnergyInMetList,setGasEnergyMetList] = useState([])
  const [electricEnergyInst,setElectricEnergyInst] = useState([])
  const [electricEnergyMet,setElectricEnergyMet] = useState([])
  const [electricEnergyMetList,setElectricEnergyMetList] = useState([])
  const [totalSandDriedInst,setTotalSandDriedInst] = useState([])
  const [totalSandDriedMet,setTotalSandDriedMet] = useState([])
  const [totalSandDriedMetList,setTotalSandDriedMetList] = useState([])
  const [toatlSandFedInst,setTotalSandFedInst] = useState([])
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
  const MetMinRef = useRef();
  const MetMaxRef = useRef();
  const [EntityRelation, setEntityRelation] = useState([]);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [isDryer,setIsDryer] = useState(false);
  const [isDryerRowAdded,setIsDryerRowAdded] = useState(false);
  const [contractTarget,setcontractTarget] = useState({value:'',isValid:false})
  const [VirtualInstruments] = useRecoilState(VirtualInstrumentsList)
  const contractTargetPercentage = useRef()
  const contractTenure = useRef()
  const mgqRef =  useRef()
  const aggrementCostRef = useRef()
  const TargetPerYear = useRef()
  const [isTargetError,setisTargetError] = useState({message:'',isValid:false})
  const ImageURL = useRef()
  const [zoneAssetId,setzoneAssetId] = useState(null)
  const [assetAttachmentList,setassetAttachmentList] = useState([])
  const [isFileSizeError,setisFileSizeError] =useState({type:null,value:false})
  const [ContentSwitchIndex,setContentSwitchIndex] = useState(0)
  const [monthlytarget,setmonthlyTarget] = useState({January:'',February:"",March:'',April:'',May:'',June:'',July:'',August:'',September:'',October:'',November:'',December:''})
  const [isValidTenure,setisValidTenure] = useState({message:'',isValid:false})
  const [isValidMGQ,setisValidMGQ] = useState({message:'',isValid:false})
  const [isValidAggrCost,setisValidAggrCost] = useState({message:'',isValid:false})
  const [isValidTargetPerMonths,setisValidTargetPerMonths] = useState({EmptyKeys:[],isValid:false,isNegative:false})


  const [iscontractTargetPercentage,setiscontractTargetPercentage] = useState(false)
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
  const { EntityTypeLoading, EntityTypeData, EntityTypeError, getEntityType } = useEntityType();
  const { CheckEntityLoading, CheckEntityData, CheckEntityError, getCheckEntity } = useCheckEntity();
  const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } = useAssetType(); 
  const {GetAssetListLoading, GetAssetListData, GetAssetListError, getGetAssetList}=useGerAssetList()
  const {  getAddAssetInstrumentsMapping } = useAddAssetInstrumentsMapping(); 
  const {  getUpdateAssetInstrumentsMapping } = useUpdateAssetInstrumentsMapping();
  const {  getAddDryerConfig } = useAddDryerConfig();
  const {  getUpdateDryerConfig } = useUpdateDryerConfig(); 
  const  { AddAssetDocsLoading, AddAssetDocsData, AddAssetDocsError, getaddAssetDocs } = useAddAssetDocs()
// eslint-disable-next-line react-hooks/exhaustive-deps
  const { DeleteAssetDocLoading, DeleteAssetDocData, DeleteAssetDocError, getDeleteAssetDoc } = useDeleteAssetDocs()
  const { EditAssetDocsLoading, EditAssetDocsData, EditAssetDocsError, getEditAssetDocs } = useEditAssetDocs()
  const { ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError, getViewAssetDoc } = useViewAssetDoc()
  const  {  GetAssetDocsListLoading, GetAssetDocsListData, GetAssetDocsListError, getGetAssetDocsList } =useGetAssetDocsList()

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function sortMonthObject(obj) {
    return monthOrder.reduce((sorted, month) => {
      if (obj.hasOwnProperty(month)) {
        sorted[month] = obj[month];
      }
      return sorted;
    }, {});
  }

  const handleOpenPopUp = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setIsopen(true)
};
  
  const handleFileChange = (e, file) => {
    const selectedFiles = e.target.files;
    let fileArr = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > 10485760) {
        fileArr.push(selectedFiles[i].size);
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
      Object.keys(CheckEntityData).forEach(val => {
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
        
        setSnackMessage(t('Deletedentity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true)
        props.getUpdatedEntityList()
          setBtnLoad(false)
        handleEntityDialogClose();
        
        // getUpdatedEntityList({ variables: { line_id: headPlant.id } })
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
      // console.log(ViewAssetDocData,"ViewAssetDocData")
      if(ViewAssetDocData.Data){
        const base64String1 = ViewAssetDocData.Data[0].file1 ; // Replace with your base64 string
        const filename1 = ViewAssetDocData.Data[0].name; // Desired file name with the correct extension
        // console.log(ViewAssetDocData.Data,"ViewAssetDocData.Data[0]")
        const contentType = "image/jpeg"; // MIME type of the file
        let file2Arr = []
        let file3Arr = {sop:[],warranty:[],user_manuals:[],others:[]}
        ViewAssetDocData.Data.forEach((x,i)=>{
          if(x.fieldname === "file2"){
            const file = base64ToFile(x.file2, x.name, contentType);
            file2Arr.push(file)
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
  
              }else if(updatedDocType === 'others'){
                file3Arr = {...file3Arr,others:[...file3Arr.others,file]}
              }
            }
          }
        })
        // Convert base64 to file
        const file = base64ToFile(base64String1, filename1, contentType);
        
        setFiles({file1:file,file2:file2Arr,file3:file3Arr})
        // console.log(ViewAssetDocData.Data,"ViewAssetDocData.Data",{file1:file,file2:file2Arr,file3:file3Arr})

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
    const[secondPart] = input.split(/-(.+)/);
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
        console.log('enter1')
        getDeleteAssetDoc({entity_id:currEntityID})
        handleEntityDialogClose();
        setSnackMessage(t('Deletedentity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true)
        props.getUpdatedEntityList()
        setBtnLoad(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError])

  useEffect(()=>{
    if(!GetAssetDocsListLoading && GetAssetDocsListData &&  !GetAssetDocsListError){
      // console.log(GetAssetDocsListData,"GetAssetDocsListData")
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
        props.getUpdatedEntityList(); 
        setOeeParam(false);
        setBtnLoad(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AddorUpdateOEEConfigLoading, AddorUpdateOEEConfigData, AddorUpdateOEEConfigError])

  useEffect(() => {
    if (!AddNewEntityLoading && !AddNewEntityError && AddNewEntityData) {
      if (AddNewEntityData.affected_rows >= 1) {
        setSnackMessage(t('AddNewEntity') + entityName.value);
        setSnackType("success");
        setOpenSnack(true);
        handleEntityDialogClose(); 
        props.getUpdatedEntityList();
        setBtnLoad(false);
        // console.log("enter",AddNewEntityData.returning[0].id,ZoneAsset,entityType.value)
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
            isStatusSignal:isStatusSignal ? msSignal.value : partSignal.value,
            isStatusSigIns: isStatusSignal ? mssInstru.value : partInstru.value,
            plannedDT:plannedDT.value, 
            plannedSetupTime: plannedSetupTime ? plannedSetupTime.value : 0,
            customReport:customReport, 
            binaryPartCount:binaryPartCount, 
            oeeValueAbove: String(oeeValueAbove.value), 
            oeeValueBelow:String(oeeValueBelow.value),
            assetOoeAboveColor:assetOoeAboveColorRef.current ? assetOoeAboveColorRef.current.value : assetOoeAboveColor.value, 
            assetOoeBelowColor: assetOoeBelowColorRef.current ? assetOoeBelowColorRef.current.value : assetOoeBelowColor.value, assetOoeBetweenColor:assetOoeBetweenColorfnRef.current ? assetOoeBetweenColorfnRef.current.value : assetOoeBetweenColor.value
          }
          getAddorUpdateOEEConfig(datas2, micStopToTime, isStatusSignal, dressingprogram, dressingSignal&&dressingSignal.value?dressingSignal.value:'', downfallPartCount, micStopFromTime)
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
            props.getUpdatedEntityList();
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

  useEffect(()=>{
    console.log(BtnLoad,"BtnLoad")
  },[BtnLoad])
 
  useEffect(() => {
    if (!AddAssetDocsLoading && AddAssetDocsData && !AddAssetDocsError) {
      if (AddAssetDocsData === 'File Upload successfully') {
        setSnackMessage(t('AddNewEntity') + entityName.value + " - File Upload Success");
        setSnackType("success");
        setOpenSnack(true);
        handleEntityDialogClose(); 
        props.getUpdatedEntityList();
        setBtnLoad(false);
      } 
    }
  }, [AddAssetDocsLoading, AddAssetDocsData, AddAssetDocsError]);  
 
   useEffect(()=>{
    if(!AddZoneMapedAssetLoading &&  AddZoneMapedAssetData && !AddZoneMapedAssetError){
      // console.log(AddZoneMapedAssetData)
      if(AddZoneMapedAssetData.affected_rows > 0){
        setSnackMessage(t('AddNewEntity') + entityName.value)
        setSnackType("success")
          setOpenSnack(true)
          handleEntityDialogClose(); 
          props.getUpdatedEntityList();
          setBtnLoad(false)
      }else{
        setSnackMessage('Unable to add ' + entityName.value)
        setSnackType("warning")
        setOpenSnack(true)
        handleEntityDialogClose(); 
        props.getUpdatedEntityList();
        setBtnLoad(false)
      }
    }
  },[AddZoneMapedAssetLoading, AddZoneMapedAssetData, AddZoneMapedAssetError])


 

// eslint-disable-next-line react-hooks/exhaustive-deps
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
          //enable,entityid,gas_energy_inst,gas_energy,electrical_energy_inst,electrical_energy,moisture_in_inst,moisture_in,moisture_out_inst,moisture_out,toal_sand_dried_inst,toal_sand_dried,total_sand_fed_inst,total_sand_fed,total_scrap_inst,total_scrap
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
            setSnackMessage(t('UpdatedEntity') + entityName.value)
            setSnackType("success")
            setOpenSnack(true) 
            props.getUpdatedEntityList()
            setBtnLoad(false)
          }else{
            let datas3={
              currEntityID:currEntityID,
              partSignal: partSignal.value,
              partInstru:partInstru.value,
              isStatusSignal:isStatusSignal ? msSignal.value : partSignal.value,
              isStatusSigIns: isStatusSignal ? mssInstru.value : partInstru.value,
              plannedDT:plannedDT.value, 
              plannedSetupTime: plannedSetupTime ? plannedSetupTime.value : 0,
              customReport:customReport, 
              binaryPartCount:binaryPartCount, 
              oeeValueAbove: String(oeeValueAbove.value), 
              oeeValueBelow:String(oeeValueBelow.value),
              assetOoeAboveColor:assetOoeAboveColor.value, 
              assetOoeBelowColor: assetOoeBelowColor.value, 
              assetOoeBetweenColor: assetOoeBetweenColor.value
            }
            getAddorUpdateOEEConfig(datas3, micStopToTime, isStatusSignal, dressingprogram, dressingSignal && dressingSignal.value?dressingSignal.value:'' , downfallPartCount, micStopFromTime)
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
          setSnackMessage(t('UpdatedEntity') + entityName.value)
          setSnackType("success")
          setOpenSnack(true) 
          props.getUpdatedEntityList()
          setBtnLoad(false)
          // getUpdatedEntityList({ variables: { line_id: headPlant.id } })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditAnEntityLoading, EditAnEntityData, EditAnEntityError])


  useEffect(()=>{
    if(!UpdateZoneMapedAssetLoading && UpdateZoneMapedAssetData && !UpdateZoneMapedAssetError){

      if(UpdateZoneMapedAssetData.affected_rows > 0){
        handleEntityDialogClose();
        setSnackMessage(t('UpdatedEntity') + entityName.value)
        setSnackType("success")
        setOpenSnack(true) 
        props.getUpdatedEntityList()
        setBtnLoad(false)
      }else{
        handleEntityDialogClose();
        setSnackMessage('Unable to add' + entityName.value)
        setSnackType("warning")
        setOpenSnack(true) 
        props.getUpdatedEntityList()
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
       // setEntityDialogMode("create")
      },
      handleDeleteDialogOpen: (data) => {
        setEntityDialogMode("delete")
        CheckEntityFunc(data.id)
        setCurrEntityID(data.id)
        setEntityName({ value: data.name, isValid: true })
        setEntityType({ value: data.entity_type, isValid: true })
        setAssetType({ value: data.asset_types, isValid: true })
       
      },
      handleEditEnitytDialogOpen: (data) => {
        handleEditEnitytDialogOpen(data)
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
    setStatusSignal(true)
    setEditCustomDash(true)
    setcustomReport(true)
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
    // props.getUpdatedEntityList()
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
  
// eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditEnitytDialogOpen = (data) => {
   console.log(data,'data')
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
    if(data.info && (data.info.target || data.info.target_per_year)){
      setTimeout(()=>{
        TargetPerYear.current.value = data.info.target_per_year;
      },500)
    }
    if(data.info){
      if(data.info.targetPerMonth){
        setmonthlyTarget(sortMonthObject(data.info.targetPerMonth))
      }
      if(data.info.isYearly === "monthly"){
      setContentSwitchIndex(1)
      }
      setTimeout(()=>{
        aggrementCostRef.current.value = data.info.AgreeCostYearly ? data.info.AgreeCostYearly : ''
        mgqRef.current.value = data.info.MGQ ? data.info.MGQ : '' 
        contractTenure.current.value = data.info.tenure ? data.info.tenure : ''

      },500)

    }

    if(data.info &&data.info.ImageURL){
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
        setMSSignal({ value: oeeData.prod_asset_oee_configs[0].metricByMachineStatusSignal.id, isValid: true })
        setPlannedDT({ value: oeeData.prod_asset_oee_configs[0].planned_downtime, isValid: true })
        setPlannedSetupTime({ value: oeeData.prod_asset_oee_configs[0].setup_time, isValid: true })
        setMicStopFromTime(oeeData.prod_asset_oee_configs[0].min_mic_stop_duration ? oeeData.prod_asset_oee_configs[0].min_mic_stop_duration : 0);
        setMicStopToTime(oeeData.prod_asset_oee_configs[0].mic_stop_duration ? oeeData.prod_asset_oee_configs[0].mic_stop_duration : 0);
        setStatusSignal(oeeData.prod_asset_oee_configs[0].is_status_signal_available ? oeeData.prod_asset_oee_configs[0].is_status_signal_available : false)
        setcustomReport(oeeData.prod_asset_oee_configs[0].enable_setup_time)
       
        setDressingSignal({value:oeeData.prod_asset_oee_configs[0].metricByDressingSignal?oeeData.prod_asset_oee_configs[0].metricByDressingSignal.id:0,isValid:true})
        setdressingProgram(oeeData.prod_asset_oee_configs[0].dressing_program ? oeeData.prod_asset_oee_configs[0].dressing_program : "")
        let binaryPart = oeeData.prod_asset_oee_configs[0].is_part_count_binary
        let downfallPart = oeeData.prod_asset_oee_configs[0].is_part_count_downfall
        setBinaryPartCount(oeeData.prod_asset_oee_configs[0].is_part_count_binary ? oeeData.prod_asset_oee_configs[0].is_part_count_binary : false)
        setDownfallPartCount(oeeData.prod_asset_oee_configs[0].is_part_count_downfall ? oeeData.prod_asset_oee_configs[0].is_part_count_downfall : false)

        if (!binaryPart) {
          setPartSignalType({ value: 1, isValid: true })
        }
        else if (binaryPart && !downfallPart) {
          setPartSignalType({ value: 2, isValid: true })
        }
        else if (binaryPart && downfallPart) {
          setPartSignalType({ value: 3, isValid: true })
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

  const handleEntityTypeChange = (event) => {
    setIsReading(false);
    setisAnalytic(false);
    setisFaultAnalysis(false)
    if(event.target.value ===3){
      setAssetDoc(true)
    }else{
      setAssetDoc(false)
    }
  
    setEntityType({ value: event.target.value, isValid: event.target.value !== "" });
   
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
  // console.log("isReading",isReading,"isAnalytic",isAnalytic)
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

  const handleMSSInstruments = (event) => {
    setMSSInstru({ value: event.target.value, isValid: event.target.value !== "" });
    getMetricsForSingleInstrumentMss(event.target.value, "Mss");
  }

  const handleMSSignal = (event) => {
    setMSSignal({ value: event.target.value, isValid: event.target.value !== "" });
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

// eslint-disable-next-line react-hooks/exhaustive-deps
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
              if (entityDialogMode === "create") { getAddNewEntity(currUser.id, entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-' }) }
              else if (entityDialogMode === "edit") { getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}) }
            }
          }
          else {
            if (entityDialogMode === "create") { getAddNewEntity(currUser.id, entityName.value, entityType.value,assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'})}
            else if (entityDialogMode === "edit") { getEditAnEntity(currEntityID, currUser.id, entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'}) }
          }
        }
      }
    }
  }


// eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEntityDialogBack = () => {
    if (entityDialogMode === "assetOEEparameter2") {
      if(isDryer){
        setEntityDialogMode('assetOEEparameter4')
        handlePrev()
      }else{        
      setEntityDialogMode('assetOEEparameter')
      handlePrev()
      setTimeout(timeOutVal1, 500)
      }
    }
    else if (entityDialogMode === "assetOEEparameter0") {
      setTimeout(() => {
        EntityNameRef.current.value = entityName.value
      }, 500)
      if(imageurl.value){
        setTimeout(() => {
          ImageURL.current.value = imageurl.value
        }, 500);
      }
      setEntityDialogMode('create')
      handlePrev()
    }else if (entityDialogMode === "assetOEEparameter") {
      setTimeout(() => {
        EntityNameRef.current.value = entityName.value
      }, 500)
      if(imageurl.value){
        setTimeout(() => {
          ImageURL.current.value = imageurl.value
        }, 500);}
      setEntityDialogMode('assetOEEparameter0')
      handlePrev()
    }else if(entityDialogMode === "assetOEEparameter3"){
      if(isReading){
        if(isDryer){
          setEntityDialogMode('assetOEEparameter4')
          handlePrev()
        }else{        
       
          setEntityDialogMode('assetOEEparameter2')
          handlePrev()
          setTimeout(timeOutVal1, 500)
        }
      }else{
        setTimeout(() => {
          EntityNameRef.current.value = entityName.value
        }, 500)
        if(imageurl.value){
          setTimeout(() => {
            ImageURL.current.value = imageurl.value
          }, 500);}
        setEntityDialogMode('assetOEEparameter0')
        handlePrev()
      }
      
    }else if(entityDialogMode === "assetOEEparameter4"){
      setEntityDialogMode('assetOEEparameter')
      handlePrev()
      setTimeout(timeOutVal1, 500)
    }
  }

  
   
  const handlePrev = () => {
    
    setStepperName((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };
 
// eslint-disable-next-line react-hooks/exhaustive-deps
  const 
configOeeDialog = () => {

    
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
      } else {

        //Asset Insert
        // eslint-disable-next-line eqeqeq
        if(entityType.value == 4){
          const emptyKeys = Object.entries(monthlytarget)
            .filter(([_, value]) => value === "")
            .map(([key]) => key);

          const negativeKeys = Object.entries(monthlytarget)
            .filter(([_, value]) => Number(value) < 0)
            .map(([key]) => key);

          if (!contractTenure.current.value) {
            setisValidTenure({ message: "Please Enter Tenure", isValid: true });
            return false;
          }

          if (contractTenure.current.value < 0) {
            setisValidTenure({ message: "Tenure Can't be negative", isValid: true });
            return false;
          }

          if (!mgqRef.current.value) {
            setisValidMGQ({ message: "Please Enter MGQ", isValid: true });
            return false;
          }

          if (mgqRef.current.value < 0) {
            setisValidMGQ({ message: "MGQ Can't be negative", isValid: true });
            return false;
          }

          if (mgqRef.current.value > 100) {
            setisValidMGQ({ message: "Enter MGQ less than 100", isValid: true });
            return false;
          }

          if (!aggrementCostRef.current.value) {
            setisValidAggrCost({ message: "Please Enter Agreement Cost", isValid: true });
            return false;
          }

          if (aggrementCostRef.current.value < 0) {
            setisValidAggrCost({ message: "Agreement Cost Can't be negative", isValid: true });
            return false;
          }

          if (ContentSwitchIndex === 0) {
            if (!TargetPerYear.current.value) {
              setisTargetError({ message: "Please Enter target", isValid: true });
              return false;
            }

            if (TargetPerYear.current.value < 0) {
              setisTargetError({ message: "Target Can't be negative", isValid: true });
              return false;
            }
          }

          if (ContentSwitchIndex === 1) {
            if (emptyKeys.length > 0) {
              setisValidTargetPerMonths({ EmptyKeys: emptyKeys, isValid: true,isNegative:false });
              return false;
            }

            if (negativeKeys.length > 0) {
              setisValidTargetPerMonths({ EmptyKeys: negativeKeys, isValid: true, isNegative: true });
              return false;
            }
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
                    else if (mssInstru.value.toString() === "" && isStatusSignal) {
                      setMSSInstru({ isValid: false })
                    } else if (msSignal.value.toString() === "" && isStatusSignal) {
                      setMSSignal({ isValid: false })
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
                        getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value   : '-'})
                        setBtnLoad(true)
                      }

                    } else {
                      if (oeeValueAbove.isValid && oeeValueBelow.isValid) {
                        setOeeValueAbove({ value: oeeValueAbove.value, isValid: true })
                        // Asset Insert with OEE
                        getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'})
                        setBtnLoad(true)
                      }

                    }

                  }else if(entityDialogMode === "assetOEEparameter4"){
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
                } else if (isReading && isAnalytic) {
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
                    else if (mssInstru.value.toString() === "" && isStatusSignal) {
                      setMSSInstru({ isValid: false })
                    } else if (msSignal.value.toString() === "" && isStatusSignal) {
                      setMSSignal({ isValid: false })
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
                      getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value : '-'})
                      getAnalyticConfig(currEntityID, config)
                    } else {
                      setBtnLoad(true)
                      getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,  headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value ? imageurl.value  : '-'})
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
                } else if (!isReading && isAnalytic) {
                
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
                      getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''})
                      getAnalyticConfig(currEntityID, config)
                      setBtnLoad(true)
                    } else {
                      setBtnLoad(true)
                      getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : ''})
                    }

                  }

                }else if (entityDialogMode === "create"){
                  setEntityDialogMode("assetOEEparameter0")
                  handleNext()
                }else if(entityDialogMode === "assetOEEparameter"){
                  getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'})
                  setBtnLoad(true)
                }else if(entityDialogMode === "edit"){
                  handleNext() 
                }
                else {
                  // Asset Insert with No OEE Params
                  if (entityDialogMode === "assetOEEparameter0" && !isEditPage) {
                    getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ?imageurl.value   : '-'})
                    setBtnLoad(true)
                  }
                  else if (entityDialogMode === "assetOEEparameter0" && isEditPage) {
                    setBtnLoad(true)
                    getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,{isFaultAnalysis:isFaultAnalysis,contractInstrument:contractTarget.value,target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',ImageURL:imageurl.value  ? imageurl.value   : '-'})
                  }
                }
              }
            //}
          }
        } else {
          // Node Insert
          if (entityDialogMode === "create") {
            getAddNewEntity(currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value, headPlant.id, 
              { isFaultAnalysis: isFaultAnalysis, 
                contractInstrument: contractTarget.value,
                target: contractTargetPercentage.current && contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
                target_per_year: TargetPerYear.current && TargetPerYear.current.value ? TargetPerYear.current.value : '',
                 tenure: contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '', 
                ImageURL: imageurl.value ? imageurl.value : '-',
                AgreeCostYearly:aggrementCostRef.current && aggrementCostRef.current.value  ? aggrementCostRef.current.value : "",
                MGQ:mgqRef.current && mgqRef.current.value ? mgqRef.current.value : '',
                targetPerMonth: monthlytarget,
                isYearly: entityType.value == 4 ? (ContentSwitchIndex === 0 ? 'yearly' : "monthly") : null,
              }
              ,isZone);
            setBtnLoad(true)
          }
          else if (entityDialogMode === "edit") {
            setBtnLoad(true)
            getEditAnEntity(currEntityID, currUser.id, EntityNameRef.current ? EntityNameRef.current.value : entityName.value, entityType.value, assetType.value,
              {isFaultAnalysis:isFaultAnalysis,
              contractInstrument:contractTarget.value,
              target:contractTargetPercentage.current &&  contractTargetPercentage.current.value ? contractTargetPercentage.current.value : '',
              target_per_year:TargetPerYear.current  &&  TargetPerYear.current.value ? TargetPerYear.current.value : '',
              tenure:contractTenure.current && contractTenure.current.value ? contractTenure.current.value : '',
              ImageURL:imageurl.value ? imageurl.value   : '-',
              AgreeCostYearly:aggrementCostRef.current && aggrementCostRef.current.value  ? aggrementCostRef.current.value : "",
              MGQ: mgqRef.current && mgqRef.current.value ? mgqRef.current.value : '',
              targetPerMonth: monthlytarget,
              isYearly:entityType.value == 4 ? (ContentSwitchIndex === 0 ? 'yearly' : "monthly") : null,
            }
              ,isZone)
          }
        }

      }
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

const getEntityDialogTitle = () => {
  if (entityDialogMode === "create") {
    return t('AddEntity');
  } else if (entityDialogMode === "assetOEEparameter0") {
    return t('AssetDoc');   
  } else if (entityDialogMode === "assetOEEparameter") {
    return t('AssetOeeParameter');
  } else if (entityDialogMode === "assetOEEparameter2") {
    return t('OEERingconfig');
  } else if (entityDialogMode === "edit") {
    return t('EditEntity');
  } else if (entityDialogMode === "assetOEEparameter3") {
    return t('Analytics Configuration');
  } else if (entityDialogMode === "assetOEEparameter4") {
    return t('Dryer Configuration');
  } else {
    return t('DeleteEntities');
  }
};


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

 const getSaveButtonText = () => {

  
                        if (Number(entityType.value) === 3) {
                          if (isReading) {
                            if (isAnalytic) {
                              return entityDialogMode === "assetOEEparameter3" ? "Save" : t('Next');
                            } else {
                              return entityDialogMode === "assetOEEparameter2" ? t('Save') : t('Next');
                            }
                          } else {
                            let result;
                          if (entityDialogMode === "assetOEEparameter2") {
                            result = t('Save');
                          } else if (isAnalytic) {
                            result = entityDialogMode === "assetOEEparameter3" ? "Save" : t('Next');
                          } else {
                            result = entityDialogMode === "assetOEEparameter0" ? t('Save')  : t("Next");
                          }
                          return result;
                          }

                        } else {
                          return t('Save');
                        }
                      };

const getUpdateButtonText = () => {
  if (Number(entityType.value) === 3) {
    if (isReading) {
      if (isAnalytic) {
        return entityDialogMode === "assetOEEparameter3" ? "Save" : t('Next');
      } else {
        return entityDialogMode === "assetOEEparameter2" ? t('Save') : t('Next');
      }
    } else {
      let result;
    if (entityDialogMode === "assetOEEparameter2") {
      result = t('Save');
    } else if (isAnalytic) {
      result = entityDialogMode === "assetOEEparameter3" ? "Save" : t('Next');
    } else {
      result = entityDialogMode === "assetOEEparameter0" ? t('Save')  : t("Next");
    }
    return result;
    }

  } else {
    return t('Save');
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
    loading={BtnLoad}
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

// const handleTargetChange =(e)=>{ //NOSONAR
//   if(e.target.value !== ''){
//     setcontractTarget({value:e.target.value,isValid:false})
//   }else{
//     setcontractTarget({value:'',isValid:true})

//   }
// }

const checkcontractTargetPerYear=(e)=>{
  if(e.target.value === ''){
  setisTargetError(true)
  }else{
  setisTargetError(false)

  }
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


const renderHelperText = ()=>{
  if(iscontractTargetPercentage && contractTargetPercentage.current.value === ''){
    return 'please enter target value'

  }else if(iscontractTargetPercentage){
    return 'enter value less then 100 '
  }
}

const renderHelperTextTargetPerYear = ()=>{
  if(isTargetError.isValid){
    return 'please enter target per year'
  }
}

const handleCheckZone =(e)=>{
  setisZone(e.target.checked)
}

const handleZoneAsset =(e)=>{
  setZoneAsset(e)



}

const handleFileUpload = (entityID,type) => {
  const formData = new FormData();
  // Append file1 if it exists and is a valid file
  if (files.file1 && files.file1 instanceof File) {
    // console.log("Appending file1:", files.file1);
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

const buttonList = [
  {id:"yearly", value:"Yearly Target", disabled:false},
  {id:"monthly", value:"Monthly Target", disabled:false},
]

const contentSwitcherClick = (e) =>{
  setContentSwitchIndex(e)
}

const handleMonthlyTargetChange = (e, item) => {
  setmonthlyTarget((prev) => ({
    ...prev,
    [item]: e.target.value,
  }));
};

const handleTenureChange=(e)=>{
  if(e.target.value !== ''){
 setisValidTenure({message:'',isValid:false})
  }
}

const handleMGQChange=(e)=>{
  if(e.target.value !== ''){
    setisValidMGQ({message:'',isValid:false})
  }
}
// console.log(ContentSwitchIndex,'ContentSwitchIndex')
const handleAggrCostChange=(e)=>{
  if(e.target.value !== ''){
    setisValidAggrCost({message:'',isValid:false})
  }
}

  return (
    <React.Fragment>
 <Toast type={snType} message={snackMsg} toastBar={snackOpen}  handleSnackClose={() => setsnackOpen(false)} ></Toast>
        <ModalHeaderNDL>
        <Typography variant="heading-02-xs" 
          value={getEntityDialogTitle()}
        />
         </ModalHeaderNDL> 
         
        {entityDialogMode !== "delete" && assetDoc  && (
    <Stepper
        steps= {renderstepperoption()}
        currentStep={stepperName}
        isbuttonOutSide={true}
    />
)}
  

          <ModalContentNDL>

        
          {/* {entityDialogMode === "edit" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" &&
            <Typography variant="lable-01-s" color="secondary" value={t('EditDetails') + headPlant.name} style={{marginBottom:5}}/>
          } */}
          {entityDialogMode === "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" &&
            <Typography variant="lable-01-s" color="secondary" value={deleteText()} 
            />
          }
          

          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" && entityDialogMode !== "assetOEEparameter0" &&
           <div className="mb-3"  >
  <SelectBox
              labelId="entity-type-label"
              label={t('EntityType')}
              id="select-entity-type"
              auto={false}
              multiple={false}
              options={!EntityTypeLoading && !EntityTypeError && EntityTypeData ? EntityTypeData.filter(x=>x.id !== 3) : []}
              isMArray={true}
              checkbox={false}
              value={entityType.value}
              onChange={handleEntityTypeChange}
              keyValue="name"
              keyId="id"
              error={!entityType.isValid ? true : false}
              msg={t('PlsSelectEntity')}
              mandatory
            />

           </div>
         
          }
          
          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" && entityDialogMode !== "assetOEEparameter0" && entityType.value === 1 && 
           <div className="mb-3"  >
            
            <InputFieldNDL
              label={"Line Name"}
              inputRef={EntityNameRef}
              placeholder={t("Enter Entity Name")}
              error={!entityName.isValid ? true : false}
              helperText={!entityName.isValid && entityName.value.toString() === ""  ? t('TypeEntityName') : ""}
              onChange={handleEntityNameChange}
            />
            </div>

          }
          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" && entityDialogMode !== "assetOEEparameter0"  && entityType.value === 2 && 
            <React.Fragment>
            
            <InputFieldNDL
              label={"Node Name"}
              inputRef={EntityNameRef}
              placeholder={t("Enter Entity Name")}
              error={!entityName.isValid ? true : false}
              helperText={!entityName.isValid && entityName.value.toString() === ""  ? t('TypeEntityName') : ""}
              onChange={handleEntityNameChange}
            />
           <div className="mb-3"  />
            <div className="flex items-center gap-1">
            <CustomSwitch 
  checked={isZone} 
  primaryLabel="Consider this Node as Zone" 
  description="Assign this node as a zone to map assets within its designated area ."
  onChange={(e) => handleCheckZone(e)} 
/>            </div>
            </React.Fragment>

          }
          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" && entityDialogMode !== "assetOEEparameter0"  &&  entityType.value === 3 && 
           <div className="mb-3"  >
            
            <InputFieldNDL
              label={"Asset Name"}
              inputRef={EntityNameRef}
              placeholder={t("Enter Entity Name")}
              error={!entityName.isValid ? true : false}
              helperText={!entityName.isValid && entityName.value.toString() === ""  ? t('TypeEntityName') : ""}
              onChange={handleEntityNameChange}
            />
</div>
          }
          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" && entityDialogMode !== "assetOEEparameter0"  &&  entityType.value === 4 && 
           <React.Fragment>
           <div className="mb-3"  >
           <InputFieldNDL
              label={"Contract Name"}
              inputRef={EntityNameRef}
              placeholder={t("Enter Entity Name")}
              error={!entityName.isValid ? true : false}
              helperText={!entityName.isValid && entityName.value.toString() === ""  ? t('TypeEntityName') : ""}
              onChange={handleEntityNameChange}
              mandatory

            />
          </div>
           <div className="mb-3"  >
           <InputFieldNDL
           label={"Tenure (Years)"}
           inputRef={contractTenure}
           type={"number"}
           error={isValidTenure.isValid}
           helperText={isValidTenure.message ? isValidTenure.message : ""}
           onChange={handleTenureChange}
           placeholder={t("Enter tenure")}
           mandatory
         />
         </div>
         <div className="mb-3"  >
           <InputFieldNDL
           label={"MGQ (%)"}
           inputRef={mgqRef}
           error={isValidMGQ.isValid}
           helperText={isValidMGQ.message ? isValidMGQ.message : ""}
           onChange={handleMGQChange}
           type={"number"}
           placeholder={t("Enter MGQ (%)")}
           mandatory

         />
         </div>  <div className="mb-3"  >
           <InputFieldNDL
           label={"Agreement Cost Per Unit"}
           inputRef={aggrementCostRef}
           error={isValidAggrCost.isValid}
           helperText={isValidAggrCost.message ? isValidAggrCost.message : ""}
           onChange={handleAggrCostChange}
           type={"number"}
           placeholder={t("Enter Agreement Cost Per Unit")}
           mandatory

         />
         </div>
         </React.Fragment>
          }

          {
            isZone && 
            <SelectBox
            labelId="asset-type-label"
            label={"Assets"}
            id="asset-type-id"
            auto={true}
            multiple={true}
            options={!GetAssetListLoading &&  GetAssetListData &&  !GetAssetListError && GetAssetListData.length > 0 ? GetAssetListData : []}
            isMArray={true}
            checkbox={false}
            info={"Select the assets to be mapped to this zone"}
            value={ZoneAsset}
            onChange={handleZoneAsset}
            keyValue="name"
            keyId="id"
            // error={isZoneAsset}
            // msg={'please select Assets'}
          />  
          }
         

          {
            entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && Number(entityType.value) === 4 && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" &&  entityDialogMode !== "assetOEEparameter0" &&
           <React.Fragment>
            {/* the commented code have feature requrement  */} 
            {/* <SelectBox    //NOSONAR
            labelId="asset-type-label"
            label={"Target"}
            id="asset-type-id"
            auto={false}
            multiple={false}
            options={VirtualInstruments.length > 0 ? VirtualInstruments : []}
            isMArray={true}
            checkbox={false}
            value={contractTarget.value}
            onChange={handleTargetChange}
            keyValue="name"
            keyId="id"
            error={contractTarget.isValid}
            msg={'please select target'}
          />   */}
            <div  className="mb-3" />

             <ContentSwitcherNDL noMinWidth listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={ContentSwitchIndex} />

             <div  className="mb-3" />
             {
              ContentSwitchIndex === 0 ? 
          <InputFieldNDL
          inputRef={TargetPerYear}
          type={"number"}
          placeholder={t("Enter Target Per Year")}
          error={isTargetError.isValid}
          helperText={renderHelperTextTargetPerYear()}
          onChange={checkcontractTargetPerYear}
        />  
              :
              <div className="w-full">
  { Object.keys(monthlytarget).map((item,index)=>{
                  return(
                    <div className="flex items-center gap-4 mb-3" key={index}>
                    <div className="flex-1">
                    <InputFieldNDL
                      value={item}
                      id={index}
                      disabled={true}
                    />
                    </div>
                    <div className="flex-1">
                    <InputFieldNDL
                      value={monthlytarget[item]}
                      id={item + "target"}
                      onChange={(e) => handleMonthlyTargetChange(e, item)}
                      type={"number"}
                      dynamic={item}
                    />
                  </div>
                  </div>
                  )
              })}
              <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                    <InputFieldNDL
                      value={"Total"}
                      id={"Total" }
                      disabled={true}
                    />
                    </div>
                    <div className="flex-1">
                    <InputFieldNDL
                      value={Object.values(monthlytarget).reduce((acc, cur) => acc + Number(cur), 0)}
                      id={"value"}
                      disabled={true}
                    />
                  </div>
              </div>

              {
                isValidTargetPerMonths.isValid && isValidTargetPerMonths.EmptyKeys.length > 0 && !isValidTargetPerMonths.isNegative && (
                  <Typography variant={"paragraph-xs"} value={`Please enter target for the missing fields ${isValidTargetPerMonths.EmptyKeys.join(",")}`} color="danger" />
                )
              }

{
                isValidTargetPerMonths.isValid && isValidTargetPerMonths.EmptyKeys.length > 0 && isValidTargetPerMonths.isNegative && (
                  <Typography variant={"paragraph-xs"} value={`Target can't be negative, change the listed fields ${isValidTargetPerMonths.EmptyKeys.join(",")}`} color="danger" />
                )
              }
              </div>              
           
             }
              
         

          
           
        </React.Fragment>

          }

          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && Number(entityType.value) === 3 && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" &&  entityDialogMode !== "assetOEEparameter0" &&
            <div  className="mb-3 mt-3" >
           
           <SelectBox
            labelId="asset-type-label"
            label={t('AssetType')}
            id="asset-type-id"
            auto={false}
            multiple={false}
            options={!AssetTypeLoading && !AssetTypeError && AssetTypeData.length>0 ? AssetTypeData : []}
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
          }
          
          {entityDialogMode !== "delete" && entityDialogMode !== "assetOEEparameter" && Number(entityType.value) === 3 && entityDialogMode !== "assetOEEparameter2" && entityDialogMode !== "assetOEEparameter3" && entityDialogMode !== "assetOEEparameter4" &&  entityDialogMode !== "assetOEEparameter0" &&
            <div style={{marginBottom:'12px'}}>
              <SelectBox
                id="instruments-List"
                label={t('Instruments')}
                edit={true}
                disableCloseOnSelect={true}
                auto={true}
                options={instruments}
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
                <Typography value="Uploaded Image" variant="sm-label-text-01" />
                <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <DummyImage /> 
              <Typography value={files.file1.name} variant="lable-01-s"  />
            </div>
            <BlackX onClick={()=>handleRemoveAssetImage()} />
          </div>
          </Grid>
          </React.Fragment>
                :
                <React.Fragment>
      <FileInput
        accept="image/*"
        multiple={false}
        onChange={(e) => handleFileChange(e, 'file1')}
        onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
      />
      <div className="mt-0.5" />
    <Typography color='tertiary' variant="paragraph-xs" value={'JPG, PNG at 10mb or less (Max 500x500px)'} />
    </React.Fragment>
           
              }
              
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
  assetType.value !== 15   && 
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
      
  <div className="mb-3" style={{display:'flex',justifyContent:'space-between'}}>
    
                <div className="flex flex-col gap-0.5" >
                  <Typography variant={"label-02-s"} >{t("OEE Configurations")}</Typography>
                  <Typography variant={"paragraph-xs"} color='tertiary'>{t('Enabling this will measure manufacturing productivity of your machine')}</Typography>
                </div>
                <CustomSwitch
                  id={"switch"}
                  switch={true}
                  checked={isReading  }
                  onChange={handleReading}
                  // primaryLabel="OEE Configurations"
                  size="small"
                />
              </div>
              <div  className="mb-3"  style={{display:'flex',justifyContent:'space-between'}}>
              <div  className="flex flex-col gap-0.5">
                <Typography variant={"label-02-s"} >{t("Analytics Configurations")}</Typography>
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
              <div style={{display:'flex',justifyContent:'space-between'}}>
              <div  className="flex flex-col gap-0.5">
                <Typography variant={"label-02-s"} >{"Predictive Maintenance"}</Typography>
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
  </React.Fragment>
  
}
            
              {
                assetType && Number(assetType.value) === 9&&( 
                  <div  className="mt-3"  style={{display:'flex',justifyContent:'space-between'}}>
                    <div>
                      <span>{t("Dryer Configurations")}</span>
                      <Typography style={{fontSize:"10px"}} value={t('Enabling this will allow you to give manual parameters for dryer')} />
                    </div>
                    <CustomSwitch checked={isDryer} onChange={handleDryer} size="small"/>
                    
                    
                  </div>
                )
              }
            </div>
            
          }
          {entityDialogMode === "assetOEEparameter" &&
            <div>
              {<>
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Partsignalinstruments")}
                  id="select-part-signal-instrument"
                  auto={false}
                  multiple={false}
                  options={instrument.value}
                  isMArray={true}
                  checkbox={false}
                  value={partInstru.value}
                  onChange={handlePartInstruments}
                  keyValue="name"
                  keyId="id"
                  error={!partInstru.isValid ? true : false}
                  msg={t("Please select part signal instrument")}
                />
                <div className="mb-3"  />

                
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Part Signal")}
                  id="select-part-signal"
                  auto={false}
                  multiple={false}
                  options={partInstrumentMetrics}
                  isMArray={true}
                  checkbox={false}
                  value={partSignal.value}
                  onChange={handlePartSignal}
                  keyValue="name"
                  keyId="id"
                  error={!partSignal.isValid ? true : false}
                  msg={t("Please select part signal")}
                />
                <div className="mb-3"  />
                
                <SelectBox
                  labelId="part-signal-type"
                  label={t('PartSignalType')}
                  id="select-part-signal-type"
                  auto={false}
                  multiple={false}
                  options={partSignalTypeArr}
                  isMArray={true}
                  checkbox={false}
                  value={partSignalType.value}
                  onChange={handlePartSignalType}
                  keyValue="name"
                  keyId="id"
                  error={!partSignalType.isValid ? true : false}
                  msg={t('PleaseSelectPartSignalType')}
                />
                <div className="mb-3"  />

                <div className="mb-3">
                  <CustomSwitch
                    id={"MachineStatusSignal"}
                    switch={false}
                    checked={isStatusSignal}
                    onChange={() => setStatusSignal(!isStatusSignal)}
                    //className={classes.subTitle}
                    primaryLabel={t("MachineStatusSignal") + t(" Available")}
                  />

                </div>
                {isStatusSignal &&
                  <>
                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Machine status signal instrument")}
                      defaultDisableName={t("Select Machine status signal instrument")}
                      id="select-machine-status-signal-instrument"
                      auto={false}
                      multiple={false}
                      options={instrument.value}
                      isMArray={true}
                      checkbox={false}
                      value={mssInstru.value}
                      onChange={handleMSSInstruments}
                      keyValue="name"
                      keyId="id"
                      error={!mssInstru.isValid ? true : false}
                      msg={t("Please select machine status signal instrument")}
                    />
                <div className="mb-3"  />

                    <SelectBox
                      labelId="entity-type-label"
                      label={t("Machine status signal")}
                      id="select-machine-status-signal"
                      auto={false}
                      multiple={false}
                      options={mssInstrumentMetrics}
                      isMArray={true}
                      checkbox={false}
                      value={msSignal.value}
                      onChange={handleMSSignal}
                      keyValue="name"
                      keyId="id"
                      error={!msSignal.isValid ? true : false}
                      msg={t("Please select machine status signal")}
                    />
                <div className="mb-3"  />


                  </>
                }
                {headPlant.appTypeByAppType.id !== 1 &&
                <React.Fragment>
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Dressing Signal")}
                  id="select-machine-status-signal-instrument"
                  auto={false}
                  multiple={false}
                  options={mssInstrumentMetrics}
                  isMArray={true}
                  checkbox={false}
                  value={dressingSignal.value}
                  onChange={handleDressingignal}
                  keyValue="name"
                  keyId="id"
                />
                <div className="mb-3"  />

                <InputFieldNDL
                  id="entity-name"
                  label={t('Dressing Program')}
                  inputRef={dressingProgramRef}
                  placeholder={t("Dressing Program")}
                />
                <div className="mb-3"  />

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
                <div className="mb-3"  />

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

               <div style={{ marginTop: 12, marginBottom: 8 }}>
                <Typography variant="label-02-s" color="secondary"  value={t("Micro-Stop Duration")} /> 
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={6}>
                  <div className='mb-0.5'>
                    <Typography  variant="label-02-s" color="secondary"  value={t("From")} />
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
                      <Typography  variant="label-02-s" color="secondary" value={t("To")} />
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
              </>
              }
            </div>
          }
          {entityDialogMode === "assetOEEparameter2" && 
          <Grid container spacing={3} style={{alignItems:'center'}} >
              <Grid item xs={10}>
                <InputFieldNDL
                  id="mic-stop-dur-sec"
                  label={t("If OEE is above (in%)")}
                  type="number"
                  onChange={handleOEEabove}
                  value={oeeValueAbove.value}
                  error={!oeeValueAbove.isValid ? true : false}
                  helperText={!oeeValueAbove.isValid && oeeValueAbove.value.toString() !== ""? t("Value Should be above ") + oeeValueBelow.value : ""}
                  placeholder={t("Type value")}
                />

              </Grid>
              <Grid item xs={2}>
                <label className="text-[12px] font-normal leading-[14px] font-geist-sans " style={{color:curTheme==='dark'?'#ffff':'#202020',}} > Card Color 
                        <div className="w-full flex justify-center items-center p-2 mt-0.5 rounded-md" style={{backgroundColor:"#F4F4F4",width:"100%",height:"32px"}}>
                        <div
                            style={{
                            width:"50px",
                            height:"16px",
                            background:"linear-gradient(239.15deg, #FFFFFF 0%, #FFFFFF 98.94%)",
                          }}
                          />
                        
                        </div>
                </label>
                

              </Grid>

          </Grid>
          }


          {entityDialogMode === "assetOEEparameter2" && 
          <Grid container spacing={3} style={{alignItems:'center'}} >
            <Grid item xs={10}>
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
           
          <label className="text-[12px] font-normal leading-[14px] font-geist-sans " style={{color:curTheme==='dark'?'#ffff':'#202020',}} > Card Color 
              <div className="w-full flex justify-center items-center p-2 mt-0.5 rounded-md" style={{backgroundColor:"#F4F4F4",width:"100%",height:"32px"}}>
            <div
          style={{
          width:"50px",
          height:"16px",
          background: "linear-gradient(239.15deg, #E0B000 0%, #FFDF63 98.94%) ",
        }}
        />
       
        </div>
        </label>
             
            </Grid>

          </Grid>
          }
          {entityDialogMode === "assetOEEparameter2" && 
          <Grid container spacing={3} style={{alignItems:'center'}} >
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
              <label className="text-[12px] font-normal leading-[14px] font-geist-sans " style={{color:curTheme==='dark'?'#ffff':'#202020',}} > Card Color 
                    <div className="w-full flex justify-center items-center p-2 mt-0.5 rounded-md" style={{backgroundColor:"#F4F4F4",width:"100%",height:"32px"}}>
                    <div
                      style={{
                      width:"50px",
                      height:"16px",
                      background:"linear-gradient(239.58deg, #FF4100 0%, #FF7400 100%)" ,
                    }}
                    />
              
                    </div>
              </label>
             
            </Grid>

          </Grid>
          }




{entityDialogMode === "assetOEEparameter0" && 
  <Grid container spacing={3}>
  <Grid item xs={12}>
    {/* Accordion for Images */}
    <AccordianNDL title={t('Images')} isexpanded={true}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <div className="flex flex-col gap-2">
          <Typography variant="1xl-body-01" value={('Upload Images')} />
          <Typography color='tertiary' variant="1xl-body-01" value={'only .jpg files at 10mb or less'} />
          </div>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          <Button
            type={"tertiary"}
            value={t('Add Images')}
            icon={Plus}
            onClick={()=>{handleTriggerClick()}}
          />
         <input
        accept=".jpeg,image/jpeg"
        type="file"
        ref={fileInputRef}
        multiple={true}
        onChange={(e)=>handleFileChange(e,'file2')}
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
        
        {
          files.file2.length > 0 &&
          files.file2.map((x,i)=>{
            
// eslint-disable-next-line react-hooks/exhaustive-deps
            return(
        <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <DummyImage /> 
              <Typography value={x.name} variant="sm-helper-text-01"  />
            </div>
            <BlackX onClick={()=>handleRemoveImage(i)} />
          </div>
          </Grid>
            )
          })
          
        }
       
        
      </Grid>

    </AccordianNDL>

    {/* Accordion for Documents */}
    <div className="mt-3" />
    <AccordianNDL title={t('Documents')} isexpanded={true}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <div className="flex flex-col gap-2">
          <Typography variant="1xl-body-01" value={('Upload Documents')} />
          <Typography color='tertiary' variant="1xl-body-01" value={'PDF at 10mb or less'} />
          </div>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          <Button
            type={"tertiary"}
            value={t('Add Docs')}
            icon={Plus}
            Righticon
            onClick={(e)=>{handleTriggerClick(e,true)}}
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
        onChange={(e)=>handleFileChange(e,"file3")}
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
          files.file3.sop.map((x,i)=>{
            
// eslint-disable-next-line react-hooks/exhaustive-deps
            return(
        <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PDF /> 
              <Typography value={x.name} variant="sm-helper-text-01"  />
              <TagNDL name={
                                    'SOP'

                                    } style={{ backgroundColor: "#E0E0E0" }} />
              
            </div>
            <BlackX onClick={()=>handleRemoveDocs(i,"sop")} />
          </div>
          </Grid>
            )
          })
          
        }

{
          files.file3.warranty.length > 0 &&
          files.file3.warranty.map((x,i)=>{
            
// eslint-disable-next-line react-hooks/exhaustive-deps
            return(
        <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PDF /> 
              <Typography value={x.name} variant="sm-helper-text-01"  />
              <TagNDL name={
                                       'Warranty'

                                    } style={{ backgroundColor: "#E0E0E0" }} />
            </div>
            <BlackX onClick={()=>handleRemoveDocs(i,"warranty")} />
          </div>
          </Grid>
            )
          })
          
        }

{
          files.file3.user_manuals.length > 0 &&
          files.file3.user_manuals.map((x,i)=>{
            
// eslint-disable-next-line react-hooks/exhaustive-deps
            return(
        <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PDF /> 
              <Typography value={x.name} variant="sm-helper-text-01"  />
              <TagNDL name={
                                       'User Manual'

                                    } style={{ backgroundColor: "#E0E0E0" }} />
            </div>
            <BlackX onClick={()=>handleRemoveDocs(i,"user_manuals")} />
          </div>
          </Grid>
            )
          })
          
        }

{
          files.file3.others.length > 0 &&
          files.file3.others.map((x,i)=>{
            
// eslint-disable-next-line react-hooks/exhaustive-deps
            return(
        <Grid item xs={12}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PDF /> 
              <Typography value={x.name} variant="sm-helper-text-01"  />
              <TagNDL name={
                                       'Others'

                                    } style={{ backgroundColor: "#E0E0E0" }} />
            </div>
            <BlackX onClick={()=>handleRemoveDocs(i,'others')} />
          </div>
          </Grid>
            )
          })
          
        }
        
      </Grid>
    </AccordianNDL>
  </Grid>
</Grid>

          }
          {entityDialogMode === "assetOEEparameter3" && 
          <Grid container spacing={3}>
            <Grid item xs={6} >
                <SelectBox
                  labelId="entity-type-label"
                  label={t("Signal Instrument")}
                  id="select-part-signal-instrument"
                  auto={false}
                  multiple={false}
                  disabled={(isReading && isAnalytic) ? true : false}
                  options={instruments}
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
                  options={partInstrumentMetrics}
                  isMArray={true}
                  checkbox={false}
                  value={Metrics.value} 
                  onChange={(e, option) => handleMetrics(e,option)}
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
              {MetricFields.map((val,index) => {
                
// eslint-disable-next-line react-hooks/exhaustive-deps
                return (
                  <div key={index} className="mb-3 pb-3 border-b border-Border-border-50 dark:border-Border-border-dark-50">
                    <Grid container spacing={3}>
                    <Grid item xs={12} >
                      <SelectBox
                        labelId="Met"
                        label={t("Metric")}
                        id={"select-part-signal"+(val.field)}
                        auto={false}
                        multiple={false}
                        options={Metrics.value}
                        isMArray={true}
                        checkbox={false}
                        value={val.metric_id}
                        onChange={(e)=>handleMetricchange(e,val.field)}
                        dynamic={MetricFields}
                        keyValue="name"
                        keyId="id"
                        // error={!partSignal.isValid ? true : false}
                        // msg={"Please select metric"}
                      />
                      <div className="mt-3" />
                    </Grid>
                    
                    </Grid>

                  <Grid container spacing={3} >
                  
                    <Grid item xs={6} >
                      <SelectBox
                        labelId="Met"
                        label={t("Chart Type")}
                        id={"select-part-signal"+(val.field)}
                        auto={false}
                        multiple={false}
                        options={[{id:1,name:t("Line")},{id:2,name:t("Stepper")}]}
                        isMArray={true}
                        checkbox={false}
                        value={val.chartType}
                        onChange={(e)=>handleChartType(e,val.field)}
                        dynamic={MetricFields}
                        keyValue="name"
                        keyId="id"
                        // error={!chartType.isValid ? true : false}
                        // msg={"Please select Type"}
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
                        onChange={(e)=>handleMin(e,val.field)}
                        // error={!MetMin.isValid ? true : false}
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
                        onChange={(e)=>handleMax(e,val.field)}
                        // error={!MetMax.isValid ? true : false}
                      />
                    </Grid>

                    <Grid item xs={2}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                           <div>
                              <Typography variant={"label-02-s"} style={{color:curTheme==='dark' ? '#ffff' : '#000000'}}>{"Stats"}</Typography>
                          </div>
                          <div style={{marginTop:"10px",marginRight:"5px"}}>
                          <CustomSwitch
                             id={"switch"}
                             switch={true}
                             checked={val.stat}
                             onChange={(e) => handleStat(e,val.field)}
                             size="small"
                          />
                          </div>
              
                    </div>
                    </Grid>
                  </Grid>
                  </div>
                     

                )}
              )}
              
              <Grid container spacing={3} style={{marginTop:'12px'}}>
                <Grid item xs={12} style={{marginLeft:'auto'}}>
                  <Button type="tertiary" value={t('Add Metric')} icon={Plus} onClick={() => AddMetric()} />          
                </Grid>
              </Grid>
              
            </Grid>

          </Grid>
          }
          {
            entityDialogMode === 'assetOEEparameter4' && (
              <div>
              <Grid container spacing={3}>  
                <Grid item lg={6}>
                  <SelectBox
                    labelId="entity-type-label"
                    label="Gas Energy Consumed"
                    placeholder={t("SelInstru")}
                    id="select-part-signal-instrument"
                    auto={true}
                    multiple={false}
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={gasEnergyInst.length > 0 ? gasEnergyInst[0].id:''}
                    onChange={(e,r)=>handleGasEnergyInstrument(e,r)}
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
                    options={gasEnergyInMetList?gasEnergyInMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={gasEnergyMet.length>0?gasEnergyMet[0].id:null}
                    onChange={(e,r)=>handleGasEnergyMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={electricEnergyInst.length>0?electricEnergyInst[0].id:''}
                    onChange={(e,r)=>handleElectEnergyInstrument(e,r)}
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
                    options={electricEnergyMetList?electricEnergyMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={electricEnergyMet.length>0?electricEnergyMet[0].id:null}
                    onChange={(e,r)=>handleElectEnergyMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={moistureInInst.length>0?moistureInInst[0].id:''}
                    onChange={(e,r)=>handleMoistureInInstrument(e,r)}
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
                    options={moistureInMetList?moistureInMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={moistureInMet.length>0?moistureInMet[0].id:null}
                    onChange={(e,r)=>handleMoistureInMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={moistureOutInst.length>0?moistureOutInst[0].id:''}
                    onChange={(e,r)=>handleMoistureOutInstrument(e,r)}
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
                    options={moistureOutMetList?moistureOutMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={moistureOutMet.length>0?moistureOutMet[0].id:null}
                    onChange={(e,r)=>handleMoistureOutMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={totalSandDriedInst.length>0?totalSandDriedInst[0].id:''}
                    onChange={(e,r)=>handleTotalSandDriedInstrument(e,r)}
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
                    options={totalSandDriedMetList?totalSandDriedMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={totalSandDriedMet.length>0?totalSandDriedMet[0].id:null}
                    onChange={(e,r)=>handleTotalSandDriedMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={toatlSandFedInst.length>0?toatlSandFedInst[0].id:''}
                    onChange={(e,r)=>handleTotalSandFedInstrument(e,r)}
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
                    options={totalSandFedMetList?totalSandFedMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={totalSandFedMet.length>0?totalSandFedMet[0].id:null}
                    onChange={(e,r)=>handleTotalSandFedMetric(e,r)}
                    keyValue="title"
                    keyId="id"
                   
                  />
                </Grid> 
                
                <Grid item lg={6}>
                  <SelectBox
                    labelId="entity-type-label"
                    label={t("Total Scrap")}
                    id="select-part--instrument"
                    auto={true}
                    multiple={false}
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={totalScrapInst.length>0?totalScrapInst[0].id:''}
                    onChange={(e,r)=>handleTotalScrapInstrument(e,r)}
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
                    options={totalScrapMetList?totalScrapMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={totalScrapMet.length>0?totalScrapMet[0].id:null}
                    onChange={(e,r)=>handleTotalScrapMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={totalStartupInst.length>0?totalStartupInst[0].id:''}
                    onChange={(e,r)=>handleTotalStartupInstrument(e,r)}
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
                    options={totalStartupMetList?totalStartupMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={totalStartupMet.length>0?totalStartupMet[0].id:null}
                    onChange={(e,r)=>handleTotalStartupMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={totalShutdownInst.length>0?totalShutdownInst[0].id:''}
                    onChange={(e,r)=>handleTotalShutdownInstrument(e,r)}
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
                    options={totalShutdownMetList?totalShutdownMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={totalShutdownMet.length>0?totalShutdownMet[0].id:null}
                    onChange={(e,r)=>handleTotalShutdownMetric(e,r)}
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
                    options={instrument.value}
                    isMArray={true}
                    checkbox={false}
                    value={emptyRunInst.length>0?emptyRunInst[0].id:''}
                    onChange={(e,r)=>handleEmptyRuntimeInstrument(e,r)}
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
                    options={emptyRunMetList?emptyRunMetList:[]}
                    isMArray={true}
                    checkbox={false}
                    value={emptyRunMet.length>0?emptyRunMet[0].id:null}
                    onChange={(e,r)=>handleEmptyRuntimeMetric(e,r)}
                    keyValue="title"
                    keyId="id"
                  
                  />
                </Grid> 

              </Grid>
              </div>
            )
          }
        </ModalContentNDL>
        <ModalFooterNDL>
          <Typography style={{ padding: "0 10px", fontSize: '14px', fontWeight: '500' }} value={typographyValue} />

       
                   <Button type={entityDialogMode !== "create" && entityDialogMode !== "delete" && entityDialogMode !== "edit" ? "ghost" :"secondary"}  danger={entityDialogMode === "Delete" ? true : false} value={entityDialogMode === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleEntityDialogClose()}/>
          {entityDialogMode !== "create" && entityDialogMode !== "delete" && entityDialogMode !== "edit" ? <Button type="secondary"  value={t('Back')} onClick={() => handleEntityDialogBack()} /> : ''}
                 
                   {entityDialogMode !== "delete" && entityDialogMode !== "edit" ? <Button type="primary" 
          loading={BtnLoad}
          value={getSaveButtonText()} 
          disabled={isFileSizeError.value}
          onClick={() => { configOeeDialog() }} /> : ''}
          {entityDialogMode === "edit" && Number(entityType.value) === 3 ? <Button type="primary" 
          loading={BtnLoad}
          disabled={isFileSizeError.value}
          value={getUpdateButtonText()} 
          onClick={() => configOeeDialog()} /> 
          : 
         updateButton}
          {deleteButton}


          </ModalFooterNDL> 
    </React.Fragment>
  );
});

export default AddEntity;