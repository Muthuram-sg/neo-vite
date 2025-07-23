import React,{useState,useEffect,useRef} from "react";
import EnhancedTable from "components/Table/Table.jsx";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import { useRecoilState } from "recoil";
import LoadingScreen from "LoadingScreenNDL";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import AssetModel from "./AssetModel/AssertModel.jsx";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Button from "components/Core/ButtonNDL"
// hooks
import useGetDropDownOptions from "./hooks/useGetDropDownoptions.jsx";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx"; 
import useGetAssets from "./hooks/useGetAssets.jsx";
import  useDeleteAssets from "./hooks/useDeleteAssets.jsx";
// utils
import { get } from "lodash";



export default function Assets(props){

    const headCell =[
        { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
        { id: "Asset Id", numeric: false, disablePadding: false, label: "Asset Id" },
        { id: "Asset Name", numeric: false, disablePadding: false, label: "Asset Name" },
        { id: "Asset Category", numeric: false, disablePadding: false, label: "Asset Category" },
        { id: "Asset Type", numeric: false, disablePadding: false, label: "Asset Type" },
        { id: "Last Update on", numeric: false, disablePadding: false, label: "Last Update on" },
        { id: "Last Updated by", numeric: false, disablePadding: false, label: "Last Updated by" },

    ]

    const AssetModelRef = useRef();
    const [isdelete, setisdelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [availableAssetId, setAvailableAssetId] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [editDate, setEditData] = useState([]);
    const [SelectedAssetId, setSelectedAssetId] = useState({name: '', id: null}); 
    const [AssertDropdown, setAssertDropdown] = useState({category: [], type: []});
    const { dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError, getDropDownOptions} = useGetDropDownOptions();
      const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
      const { deleteAssetLoading, deleteAssetData, deleteAssetError, deleteAsset } = useDeleteAssets();
    const { getAssetsLoading, getAssetsData, getAssetsError, fetchAssets } = useGetAssets();
    const [headPlant] = useRecoilState(selectedPlant);

    const [, setOpenSnack] = useRecoilState(snackToggle);
            const [, SetMessage] = useRecoilState(snackMessage);
            const [, SetType] = useRecoilState(snackType);
            const [, SetDesc] = useRecoilState(snackDesc);
    const {t} = useTranslation();



    useEffect(() => {
        // getDropDownOptions('AssetMaster/GetAssetType')
        // getDropDownOptions('AssetMaster/GetValueType')
        // getDropDownOptions('AssetMaster/GetAssetCate')
        fetchAssets()
        getUsersListForLine(headPlant.id)
    },[headPlant])

    // useEffect(() => {

    //     if(dropDownOptionsData && !dropDownOptionsLoading && !dropDownOptionsError){
    //         if(dropDownOptionsData.GetAssetType && Array.isArray(dropDownOptionsData.GetAssetType)){
    //             setAssertDropdown(prevState => ({
    //                 ...prevState,
    //                 assetType: dropDownOptionsData.GetAssetType || []
    //             }));
    //         }
    //         if(dropDownOptionsData.GetAssetCate  && Array.isArray(dropDownOptionsData.GetAssetCate )){
    //             setAssertDropdown(prevState => ({
    //                 ...prevState,
    //                 category: dropDownOptionsData.GetAssetCate  || []
    //             }));
    //         }
    //         if(dropDownOptionsData.GetValueType && Array.isArray(dropDownOptionsData.GetValueType)){
    //             setAssertDropdown(prevState => ({
    //                 ...prevState,
    //                 valueType: dropDownOptionsData.GetValueType || []
    //             }));
    //         }

    //     }
    // },[dropDownOptionsData, dropDownOptionsLoading, dropDownOptionsError])

    useEffect(() => {
        // alert("Assets Data Fetched Successfully")
    console.log(getAssetsData,'getAssetsData')
    setLoading(true);
    let tempData = [] 
    let tempAssetId = [];
    getAssetsData?.map((item, index) => {
         const matchedUser =UsersListForLineData && UsersListForLineData.length > 0 && UsersListForLineData.find(
            (user) => user?.userByUserId?.sgid === (item.modified_by !== null ? item.modified_by : item.create_by)
        );

      const modifiedByName = matchedUser?.userByUserId?.name || '-';
        tempAssetId.push(item.asset_id);
        tempData.push([
            index+1,
            item.asset_id,
            item.asset_name,
            item.asset_cate,
            item.asset_type,
            item?.modified_dt !== null ? item.modified_dt : item.create_dt,
            modifiedByName,
        ])
    })
    setTableData(tempData)
    setAvailableAssetId(tempAssetId);
    setLoading(false);
    },[getAssetsData, UsersListForLineData]);


    const handleUpdateAsset = (id, value) => {
        console.log("Update Asset", id, getAssetsData[id]);
        AssetModelRef.current.editAsset(getAssetsData[id]);
        // Add your update logic here
        setEditData(getAssetsData[id]);
        
    }


    const handleDeleteAsset = (id, value) => {
        console.log("Delete Asset", id, getAssetsData[id]);
        setSelectedAssetId(getAssetsData[id].asset_id)
        setisdelete(true);
        // Add your delete logic here
    }

    const CreateNewAsset = () => {
        AssetModelRef.current.createAsset();
        setEditData()
    }

    const handlDeleteClose=() => {
        setisdelete(false);
    }

    const DeleteAssets = () => {  
        console.log("Delete Asset ID", SelectedAssetId);
        if(SelectedAssetId){
            deleteAsset(SelectedAssetId)
            setisdelete(false);

        }

    }

     useEffect(() => {
                // con/sole.clear()
                console.log("deleteAssetData Data", deleteAssetData)
                if(deleteAssetData?.response === 'The asset is linked to a product. Remove the mapping to proceed with deletion'){
                    setOpenSnack(true)
                    SetMessage("Asset Not Deleted")
                    SetType("error")
                    SetDesc("Asset is linked with an operation and cannot be deleted.")
                } 
                if(deleteAssetData === 'Deleted Successfully '){
                    setOpenSnack(true);
                    SetMessage("Asset Deleted")
                    SetType("success");
                    SetDesc("The asset has been successfully deleted.");
                    fetchAssets();
                }
    }, [deleteAssetData]);


    return(
        <React.Fragment>
            { (getAssetsLoading && dropDownOptionsLoading && loading) && <LoadingScreen />}
            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
                   <EnhancedTable
                       headCells={headCell}
                       data={tableData}
                       buttonpresent="New Asset"
                       download={true}
                       search={true}
                       onClickbutton={() => {CreateNewAsset()}}
                       actionenabled={true}
                       rawdata={[1, '', '' ,'', '', '', '']}
                       handleEdit={(id, value) => handleUpdateAsset(id, value)}
                       handleDelete={(id, value) => handleDeleteAsset(id, value)}
                       enableDelete={true}
                       enableEdit={true}
                       Buttonicon={Plus}
                       verticalMenu={true}
                       groupBy={"neonix_asset"}
                   />
            <AssetModel ref={AssetModelRef} AssertDropdown={AssertDropdown} editData={editDate} availableAssetId={availableAssetId} reload={() => {setLoading(true);fetchAssets()}}/>
                    <ModalNDL onClose={handlDeleteClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={isdelete}>
                                       <ModalHeaderNDL>
                                           <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Delete Asset"} />
                                       </ModalHeaderNDL>
                                       <ModalContentNDL>
                                           <TypographyNDL value={`Do you really want to delete the ${SelectedAssetId?.name || ''} ? All the associated items with this asset will be affected. This action cannot be undone`} variant='paragraph-s' color='secondary' />
                                       </ModalContentNDL>
                                       <ModalFooterNDL>
                                           <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDeleteClose() }} />
                                           <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={() => DeleteAssets()}/>
                                       </ModalFooterNDL>
                                   </ModalNDL> 
               </div>
               

               
        </React.Fragment>
    )

}