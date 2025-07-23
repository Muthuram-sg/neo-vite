import React, { useState, useEffect } from "react";
import Button from "components/Core/ButtonNDL";
import moment from 'moment';
import { useRecoilState } from "recoil";
import { userData, snackToggle, snackMessage, snackType} from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import useAccesslist from "components/layouts/Profile/ProfileSetting/hooks/useAccess";
import { useTranslation } from 'react-i18next';
import useDelaccess from "components/layouts/Profile/ProfileSetting/hooks/useDelaccesslists"; 
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Grid from "components/Core/GridNDL";

export default function AccesslistTable() {   
    const [tabledata, setTableData] = useState([])
    const { outALLoading, outALData, outALError, getAccessList } = useAccesslist(); 
    const { t } = useTranslation();
    const [userDetails, ] = useRecoilState(userData);
    const { delaccesslistwithoutIDLoading, delaccesslistwithoutIDData, delaccesslistwithoutIDError, getadelaccesswithoutID } = useDelaccess()
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [dialog,setDialog] = useState(false);
    const[selectedlist,setselectedlist]= useState(""); 

    useEffect(() => {
        getAccessList( userDetails.id );
    }, []) // eslint-disable-line react-hooks/exhaustive-deps    
    useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outALData])
    const headCells = [
        {
            id: 'Line',
            numeric: false,
            disablePadding: true,
            label: t('Line'),
        },
        {
            id: 'business',
            numeric: false,
            disablePadding: false,
            label: t('Business'),
        },
        {
            id: 'standard_rate',
            numeric: false,
            disablePadding: false,
            label: t('Role'),
        },
        {
            id: 'added_by',
            numeric: false,
            disablePadding: false,
            label: t('AddedBy'),
        },
        {
            id: 'member_since',
            numeric: false,
            disablePadding: false,
            label: t('MemberSince'),
        }


    ];
    useEffect(() => {
        if (!delaccesslistwithoutIDLoading && !delaccesslistwithoutIDError && delaccesslistwithoutIDData) {
            console.log(delaccesslistwithoutIDData)
            if (delaccesslistwithoutIDData.delete_neo_skeleton_user_role_line.affected_rows >= 1) {
                SetMessage(t('RequestDeletedSuccess'))
                SetType("success");
                setOpenSnack(true);
                getAccessList( userDetails.id );
                handleDialogClose();
                
            } else {
                SetMessage('Failed to delete')
                SetType("error")
                setOpenSnack(true)
               
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delaccesslistwithoutIDLoading, delaccesslistwithoutIDData, delaccesslistwithoutIDError])
    const processedrows = () => {
        let temptabledata = []
        if (outALData && !outALError && !outALLoading) {
            temptabledata = temptabledata.concat(outALData.map((val, index) => {
                return [val.line.name,val.line.gaia_plants_detail && val.line.gaia_plants_detail.business_name ? val.line.gaia_plants_detail.business_name : "-" , val.role.role.replace('_', ' '), val.userByCreatedBy && val.userByCreatedBy.name,
                moment(val.created_ts).fromNow()]
            })
            )
        }
        setTableData(temptabledata)
    }
    const handleDialogClose = () => {        
        if(!dialog){
            setDialog(true);
        }else{
            setDialog(false);  
        }
        

    }
    const enabledelete=(id,v)=>{
        
        setselectedlist(v)
        handleDialogClose();
    }
    const deleteorderfn=()=>{
        getadelaccesswithoutID(selectedlist.user_id ,selectedlist.role_id,selectedlist.line_id  )
    }
    return(
<div >
<Grid item xs={3} sm={3}>
<TypographyNDL
            variant="label-02-s"
            value={t("Access List")}
          />
                    
                   <TypographyNDL value="Manage your personal information" color="tertiary" variant="paragraph-xs" />
                   <div className="mt-4"/>
 
           
        <div >            
            
            <EnhancedTable
                        headCells={headCells}
                        data={tabledata}
                        actionenabled={true}
                        rawdata={outALData && !outALError && !outALLoading?outALData:''}
                        handleDelete={(id, value) => enabledelete(id, value)} 
                        enableDelete={true}
                        search={true}
                        download={true}
            />
        </div>
        </Grid>
        <ModalNDL open={dialog} onClose={handleDialogClose} > 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={"Delete"}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL variant='paragraph-s' color='secondary' value={"Do you really want to delete the Access? Because, It is not reversible."} />
                </ModalContentNDL>
                <ModalFooterNDL>
                <Button type="secondary" danger value={t('Delete')} onClick={() => deleteorderfn()} />
                <Button type="secondary"  value={t('Cancel')} onClick={() => handleDialogClose()} />
                </ModalFooterNDL>
            </ModalNDL> 
        </div>
        
    )
}