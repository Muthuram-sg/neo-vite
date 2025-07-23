import React,{useState,useEffect} from 'react'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import { snackToggle, snackMessage, snackType } from 'recoilStore/atoms'; 
import { useRecoilState } from 'recoil';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next'
import useImageUpload from '../hooks/useImageUpload';
import JSZip from 'jszip';
import useGetDuplicateImages from '../hooks/useGetDuplicateImages';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import * as XLSX from 'xlsx';


const TaskImageUpload =(props)=>{
    const { t } = useTranslation();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);  
    const [uploadZipData,setuploadZipData] =  useState(null)
    const [below,setBelow] =useState(false)
    const [FileNames,setFileNames] = useState('')
    const { ImageUploadLoading, ImageUploadData, ImageUploadError, getTaskImageUpload } = useImageUpload()
    const { DuplicateImagesLoading, DuplicateImagesData, DuplicateImagesError, getDuplicateImages} = useGetDuplicateImages()
    const [isDuplicate,setisDuplicate] = useState(false)
    const [DuplicateData,setDuplicateData] = useState([])
    const [DownLoadExelData,setDownLoadExelData] = useState([])



    useEffect(()=>{
        if(!ImageUploadLoading){
        if(ImageUploadData && !ImageUploadError){

            if (ImageUploadData) {
                const response = ImageUploadData.data;
            
                if (response && typeof response === "object" && response.error === "Image names not valid") {
                    handleSnackBar('warning', response.error);
                    handleCloseDialog();
                } else {
                    if (response === "File Upload Successfully") {
                        handleSnackBar('success', "File Uploaded Successfully");
                        props.getTaskList();
                    }
                    handleCloseDialog();
                }
            }            
            
        }
    }
             // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ImageUploadLoading, ImageUploadData, ImageUploadError])


    useEffect(()=>{
        if(!DuplicateImagesLoading && DuplicateImagesData &&  !DuplicateImagesError){
            if(DuplicateImagesData.length > 0){
                let ExelData = DuplicateImagesData.map((x)=>{
                    return {fileNames:x}
                })
                setisDuplicate(true)
                setDuplicateData(DuplicateImagesData)
                setDownLoadExelData(ExelData)
                console.log(DuplicateImagesData,"DuplicateImagesData")
            }else{
                setisDuplicate(false)
                setDuplicateData([])
            }

        }
    },[DuplicateImagesLoading, DuplicateImagesData, DuplicateImagesError])

    useEffect(()=>{
        if(FileNames){
            getDuplicateImages(FileNames)
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[FileNames])

    const handleCloseDialog=()=> {
        props.handleCloseDialog(); 
        props.handleTask()
    }

    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    } 
    const uploadData = () =>{
        if(uploadZipData && !below){
            console.log(uploadZipData,"uploadZipData")
            let formData = new FormData();

            formData.append('zipFile',uploadZipData,uploadZipData.name)
               getTaskImageUpload(formData)
        }else{
            handleSnackBar('warning','Please Upload Files below 10MB')
        }
}
function bytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2); // Convert bytes to megabytes and round to 2 decimal places
}
const fileUpload = async(e)=>{
    if(e.target.files && e.target.files[0]){ 
        const supportedFormats = ['application/x-zip-compressed','application/zip'];            
        const file = e.target.files[0]
        console.log(Number(bytesToMB(file.size)))
        if(Number(bytesToMB(file.size)) > 10 ){
            setBelow(true)  
        }else{
            setBelow(false)
        }

        if(supportedFormats.indexOf(file.type) >= 0){
            setuploadZipData(file)

            const zip = new JSZip();
            const content = await file.arrayBuffer();
            const zipContent = await zip.loadAsync(content);
      
            const fileNames = [];
            zipContent.forEach((relativePath, file) => {
                console.log(file,"file")
              fileNames.push(relativePath);
            });

            const splitedFileName = fileNames.map(x=>{
                const actualName = x.split("/")
                if(actualName.length> 0){
                    return actualName[1]
                }else{
                    return x
                }
            })
            let stringFileName = splitedFileName.filter(x=>x !== '')
            stringFileName = stringFileName.map(value => `'${value}'`).join(', ');
            console.log(stringFileName,'stringFileName')
            setFileNames(stringFileName); 

        }else{
            setuploadZipData({})
            handleSnackBar('warning','Please Upload Supported Format files')
        }

    }
}
const handleExelDownload =()=>{
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(DownLoadExelData);
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Generate a buffer from the workbook
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    // Create a link element
    const link = document.createElement('a');
  
    // Set the download attribute with a filename
    link.href = URL.createObjectURL(blob);
    link.download = 'Duplicate_FileNames.xlsx';
  
    // Append the link to the body and click it programmatically
    document.body.appendChild(link);
    link.click();
  
    // Remove the link after downloading
    document.body.removeChild(link);
}
    return(
        <React.Fragment>
        <ModalHeaderNDL>
         {isDuplicate && 
         <div className='contents'>
            <TypographyNDL variant="heading-02-s" model value={"Duplicate Found"}/>
           <Download
            stroke={"#007BFF"}
            id={"download-Exel"}
            onClick={handleExelDownload}
          />    
          </div>
           }
           {
            !isDuplicate && 
            <TypographyNDL variant="heading-02-s" model value={ "Upload Images"}/>
           }
           
             
           </ModalHeaderNDL>
           {
            isDuplicate ? 
<ModalContentNDL>
<TypographyNDL value='Please remove the Duplicate file Listed below then Upload Back:' variant={'heading-02-xs'} /><br></br>

    {
        DuplicateData.map((x,index)=>{

            return(
                <React.Fragment key={index+1}>
                <TypographyNDL value={`${index + 1}. ${x}`} variant={'lable-01-m'} />
                <br></br>
                </React.Fragment>
            )
        })
    }

</ModalContentNDL>


            :
<ModalContentNDL>
            <div className='py-2'>
            <FileInput
                multiple={false}
                onChange={(e) => fileUpload(e)}
                accept={'.zip'}
                onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                helperText={"System Supports Zip files only, Max Size of each file is 10MB"}
            />
            </div>
           
            {!DuplicateImagesLoading && DuplicateData.length === 0 &&   <TypographyNDL color ="#5DE700" value={'No Duplicte File Found'} variant={'lable-01-m'} />}
     </ModalContentNDL>
           }
           
           
        <ModalFooterNDL>
           <Button value={t('Cancel')} type={'secondary'} onClick={handleCloseDialog}/>
           {
            DuplicateData.length === 0 && 
            <Button value={t('Upload')} loading={(uploadZipData && DuplicateImagesLoading) || ImageUploadLoading }  onClick={uploadData}/>
           }


        </ModalFooterNDL>
   </React.Fragment>
    )
}

export default TaskImageUpload;