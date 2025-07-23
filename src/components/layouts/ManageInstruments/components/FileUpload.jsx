import React, { forwardRef, useEffect, useState } from 'react';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from 'components/Core/ButtonNDL';

import { useRecoilState } from 'recoil';
import { selectedPlant, snackToggle, snackMessage, snackType } from 'recoilStore/atoms'; 
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import LinkNDL from '../../../Core/LinkNDL';
import useSensorFileUpload from '../hooks/useSensorFileUpload'
import useAssetType from 'components/layouts/NewSettings/Node/hooks/useAssetType';
import * as xlsx from 'xlsx'; // Importing XLSX for Excel file handling
import FileSaver from 'file-saver';
import ExcelJS from 'exceljs';

const TaskFileUpload = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);  
    const [headPlant] = useRecoilState(selectedPlant);
    const [,setLine_id] = useState();//NOSONAR
    const [extractData,setExtractData] = useState([]);
    const { fileUploadLoading, fileUploadData, fileUploadError, getSensorFileUpload } = useSensorFileUpload()
    const {  AssetTypeData, getAssetType } = useAssetType(); 
 
    const handleCloseDialog=()=> {
        setExtractData([]);
        setLine_id(''); 
        props.handleCloseDialog(); //NOSONAR
    }

    useEffect(() => {  
        getAssetType() 
    }, [headPlant]);

    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    } 

    const intermediateOptions = [
        { id: 1, name: "Coupling" },
        { id: 2, name: "Pulley" },
        { id: 3, name: "Nil" },
    ];

    const LocationOptions = [
        { id: 1, name: "DE" },
        { id: 2, name: "NDE" }
    ];

    const fileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const supportedFormats = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv',
            ];
            const file = e.target.files[0];
    
            if (supportedFormats.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (j) => {
                    const data = j.target.result;
                    const workbook = xlsx.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = xlsx.utils.sheet_to_json(worksheet);
    
                    if (json && json.length > 0) {
    
                        // Define a mapping between uploaded column headers and your keys
                        const columnMapping = {
                            'Tech Number': 'number',
                            'Tech ID': 'tech_id',
                            'Instrument': 'iid',
                            'Tech Name': 'tech_name',
                            'Axis': 'axis',
                            'DB Name': 'db_name',
                            'RPM': 'rpm',
                            'Location': 'location',
                            'Asset Type': 'type',
                            'Intermediate': 'intermediate',
                            'Orders': 'order',
                            'VFD Configuration': 'vfd',
                            'Min RPM': 'min_rpm',
                            'Max RPM': 'max_rpm',
                            'Domain': 'domain',
                            'Enable': 'enable',
                        };
    
                        // Transform data to match expected keys and map text to IDs
                        const transformedData = json.map(row => {
                            const transformedRow = {};
                            for (const [uploadedColumn, expectedKey] of Object.entries(columnMapping)) {
                                if (row[uploadedColumn] !== undefined) {
                                    transformedRow[expectedKey] = row[uploadedColumn];
                                }
                            }
    
                            // Convert textual Intermediate and Asset Type values to IDs
                            const intermediateOption = intermediateOptions.find(
                                option => option.name.toLowerCase() === (transformedRow['intermediate'] || '').toLowerCase()
                            );
                            if (intermediateOption) {
                                transformedRow['intermediate'] = intermediateOption.id;
                            }
    
                            const assetTypeOption = AssetTypeData.find(
                                option => option.name.toLowerCase() === (transformedRow['type'] || '').toLowerCase()
                            );
                            if (assetTypeOption) {
                                transformedRow['type'] = assetTypeOption.id;
                            }
    
                            // Type casting if needed
                            if (transformedRow['rpm']) transformedRow['rpm'] = parseFloat(transformedRow['rpm']);
                            if (transformedRow['min_rpm']) transformedRow['min_rpm'] = parseFloat(transformedRow['min_rpm']);
                            if (transformedRow['max_rpm']) transformedRow['max_rpm'] = parseFloat(transformedRow['max_rpm']);
    
                            // Transform location and type
                            if (transformedRow['location'] && row['Asset Type']) {
                                const typeInitial = (row['Asset Type'].charAt(0) || '').toUpperCase();
                                const location = transformedRow['location'];
                                transformedRow['location'] = `${typeInitial}${location}`;
                            }
    
                            return transformedRow;
                        });
    
                        setExtractData(transformedData);
                    } else {
                        setExtractData([]);
                        setLine_id('');
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                handleSnackBar('warning', t('Please upload a valid file'));
                setExtractData([]);
                setLine_id('');
            }
        } else {
            handleSnackBar('warning', t('Please upload a file'));
            setExtractData([]);
            setLine_id('');
        }
    };   
    
    useEffect(() => {
        if (!fileUploadLoading && fileUploadData && !fileUploadError) {
          
          if (typeof fileUploadData === 'number') {
            // Handle the case where fileUploadData is a number
            SetMessage("Bulk instrument data uploaded successfully");
            SetType("success");
            setOpenSnack(true);
            setTimeout(() => {
              props.refreshTable();//NOSONAR
              handleCloseDialog();
            }, 1000);
          } else if (typeof fileUploadData === 'object' && Object.keys(fileUploadData).length > 0) {
         
            SetMessage("Bulk instrument data uploaded successfully");
            SetType("success");
            setOpenSnack(true);
            setTimeout(() => { //NOSONAR
              props.refreshTable();//NOSONAR
              handleCloseDialog();
            }, 1000);
          } else {
            // Handle the case where fileUploadData is an empty object or not as expected
            SetMessage("Data not inserted");
            SetType("error");
            setOpenSnack(true);
          }
        }
      }, [fileUploadLoading, fileUploadData, fileUploadError]);      

    const uploadData = () =>{
                if (extractData.length > 0) {
                    getSensorFileUpload(extractData)
                } else {
                    handleSnackBar('warning', t('Please check valid data in a file'));
                }          
    }

    const downloadSensorTemplate = async () => {
        try {
            const workbook = new Excel.Workbook();

            const asset_list = workbook.addWorksheet('Sensor');
    
            asset_list.columns = [
                { header: 'Tech Number', key: 'number', width: 15 },
                { header: 'Tech ID', key: 'tech_id', width: 20 },
                { header: 'Instrument', key: 'iid', width: 20 },
                { header: 'Tech Name', key: 'tech_name', width: 25 },
                { header: 'Axis', key: 'axis', width: 10 },
                { header: 'DB Name', key: 'db_name', width: 20 },
                { header: 'RPM', key: 'rpm', width: 10 },
                { header: 'Location', key: 'location', width: 15 },
                { header: 'Asset Type', key: 'type', width: 10 },
                { header: 'Intermediate', key: 'intermediate', width: 15 },
                { header: 'Orders', key: 'order', width: 50 },
                { header: 'VFD Configuration', key: 'vfd', width: 10 },
                { header: 'Min RPM', key: 'min_rpm', width: 10 },
                { header: 'Max RPM', key: 'max_rpm', width: 10 },
                { header: 'Domain', key: 'domain', width: 10 },
                { header: 'Enable', key: 'enable', width: 10 },
            ];
    
            let taskPriorityDataArr = [];
            taskPriorityDataArr = intermediateOptions.map(({ name, id }) => ({ name, id }));
            const taskPriorityArr = taskPriorityDataArr.map(obj => Object.values(obj));
            const task_priority = workbook.addWorksheet('Task_Priority_Master');
            task_priority.addTable({
                name: 'Task_Priority_Master',
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleDark3',
                    showRowStripes: true,
                },
                columns: [
                    { name: 'name', filterButton: true },
                    { name: 'id', filterButton: false },
                ],
                rows: taskPriorityArr,
            });
            task_priority.state = 'veryHidden';
            asset_list.dataValidations.add('J2:J9999', {
                type: 'list',
                allowBlank: true,
                formulae: [
                    `Task_Priority_Master!$A$2:$A$${intermediateOptions ? intermediateOptions.length + 1 : 2}`,
                ],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Input',
                error: 'Please select a valid value.',
            });


            let taskPriDataArr = [];
            taskPriDataArr = AssetTypeData.map(({ name, id }) => ({ name, id }));
            const taskPriArr = taskPriDataArr.map(obj => Object.values(obj));
            const task_pri = workbook.addWorksheet('Task_Pri_Master');
            task_pri.addTable({
                name: 'Task_Pri_Master',
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleDark3',
                    showRowStripes: true,
                },
                columns: [
                    { name: 'name', filterButton: true },
                    { name: 'id', filterButton: false },
                ],
                rows: taskPriArr,
            });
            task_pri.state = 'veryHidden';
            asset_list.dataValidations.add('I2:I9999', {
                type: 'list',
                allowBlank: true,
                formulae: [
                    `Task_Pri_Master!$A$2:$A$${AssetTypeData ? AssetTypeData.length + 1 : 2}`,
                ],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Input',
                error: 'Please select a valid value.',
            });



            let taskDataArr = [];
            taskDataArr = LocationOptions.map(({ name, id }) => ({ name, id }));
            const taskArr = taskDataArr.map(obj => Object.values(obj));
            const task = workbook.addWorksheet('Task_Master');
            task.addTable({
                name: 'Task_Master',
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleDark3',
                    showRowStripes: true,
                },
                columns: [
                    { name: 'name', filterButton: true },
                    { name: 'id', filterButton: false },
                ],
                rows: taskArr,
            });
            task.state = 'veryHidden';
            asset_list.dataValidations.add('H2:H9999', {
                type: 'list',
                allowBlank: true,
                formulae: [
                    `Task_Master!$A$2:$A$${LocationOptions ? LocationOptions.length + 1 : 2}`,
                ],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Input',
                error: 'Please select a valid value.',
            });



    
            asset_list.addRow({
                number: 'E-1510.01',
                tech_id: '125_6_1',
                iid: '801402',
                tech_name: 'Ch1_Z_Vertical',
                axis: 'Z',
                db_name: 'ON_GyprocBangalore',
                rpm: 24.67,
                location: 'MDE',
                type: 'Motor',
                intermediate: 'coupling',
                order: '{"BRO": "990", "BSF": "6.104", "FTF": "0.421", "VPF": "10", "BPFI": "10.419", "BPFO": "7.581", "GMF1": "99", "GMF2": "99", "GMF3": "99", "GMF4": "99"}',
                vfd: true,
                min_rpm: 0,
                max_rpm: 0,
                updated_at: '',
                defect_processed_at: '',
                domain: 'condmaster_200',
                enable: false,
            });
    
            const buffer = await workbook.xlsx.writeBuffer();
            FileSaver.saveAs(
                new Blob([buffer]),
                `Sensor_Template_${moment().format('YYYY_MM_DD')}.xlsx`,
            );
        } catch (error) {
            console.error('Error creating download template:', error);
        }
    };    
    
    const handleClickDownload = () => {
        downloadSensorTemplate()
      };
    return(
        <React.Fragment>
             <ModalHeaderNDL>
             <div className="flex flex-col space-y-2">
                <TypographyNDL variant="heading-02-s" model value={"Add Data in Bulk"} />
                <TypographyNDL variant="paragraph-xs" model value={"Add multiple instruments by uploading an Excel file"} />
            </div>
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL variant="paragraph-s" >
                <div className='flex gap-1'>
                <div>Step 1. </div>
                <LinkNDL text='Click here' onClick={handleClickDownload} /> 
                <div>to download the Excel template</div>
                    </div>  
                </TypographyNDL>
                <div className='p-3 pl-0'><TypographyNDL variant="paragraph-s"  value={"Step 2. Upload the Document"} /></div>
                    <FileInput
                        multiple={false}
                        onChange={(e) => fileUpload(e)}
                        onClose={(val) => val.type}
                        helperText={"System Supports CSV files only, Max Size of each file is 25MB"}
                    />
             </ModalContentNDL>
             <ModalFooterNDL>
                <Button   value={t('Cancel')} type={'secondary'} onClick={handleCloseDialog}/>
                <Button   value={t('Upload')} onClick={uploadData}/>

             </ModalFooterNDL>
        </React.Fragment>
    )
})
export default TaskFileUpload;