/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useReasonslistbyType from "../hooks/useReasonslistbyType";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
const AddDowntimeModel = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [downtime, setDowntime] = useState('');
    const [reasonID, setReasonID] = useState('');
    const [reasontagIDs, setReasonTagID] = useState([])
    const [selectedReasonTagList, setSelectedReasonTags] = useState([])
    const [downtimeReasonList, setDowntimesReasonList] = useState([])
        const DiscriptionRef = useRef();
        // const [RejectDialogMode, setRejectDialogMode] = useState("create");
      
    const { outlistbytypeLoading, outlistbytypeData, outlistbytypeError, getReasonListbyTypes } = useReasonslistbyType();
    useEffect(() => {
        if (outlistbytypeData && !outlistbytypeLoading && !outlistbytypeError) {
            setDowntimesReasonList(outlistbytypeData)
                    }
    }, [outlistbytypeData, outlistbytypeLoading, outlistbytypeError]);

        // useEffect(()=>{
        //     if(props.RejectDTDialog){
        //         setRejectDialogMode('create');
        //     }
        // // eslint-disable-next-line react-hooks/exhaustive-deps
        // },[props.RejectDTDialog])
        
    const getDowntimeReasonTags = (reason) => {

        if (props.Reasons && props.Reasons.length > 0) {
            let tag = props.Reasons.filter(x => x.id === reason); 
            if (tag.length === 0)
                tag = props.Reasons.filter(x => x.reason === reason);
            if(tag.length > 0){
                let Taglist = tag[0].reason_tag;

                let Tagarr = Taglist ? Taglist.map((val) => {
                    let arr = props.downtimeReasonTagList.length > 0 ? props.downtimeReasonTagList.filter(x => x.id === val) : []
                    return arr.length > 0 ? arr[0] : {}
                }) : []
                setReasonTagID(Tagarr)
            }
        }
    }
    useImperativeHandle(ref, () => ({

        
        handleEditDowntimeDialogOpen: (rowData) => {
           handleEditDowntimeDialogOpen(rowData);
        },
        handleDialogClosefn: () => {
            props.handleDialogClosefn()
        }
   }));

   const handleDialogClosefn =()=>{
    props.handleDialogClosefn()
    // props.dialogMode(null)
   }
    
   const handleEditDowntimeDialogOpen = (rowData) => {
    console.log(rowData,"raaaa")
    
    setReasonID(rowData.ReasonId)
    setDowntime(rowData.Reason_Type);
    let temptags = []
    setTimeout(() => {
        if( DiscriptionRef.current){
            DiscriptionRef.current.value = rowData.Comments ? rowData.Comments : '';
        }
    }, [1000]);

    if (rowData.Reason) {
        getDowntimeReasonTags(rowData.Reason)
    }
    if (rowData.reason_tags) {
        rowData.reason_tags.map(val => {
            if (val.id !== -1) {
                temptags.push(val)
            }
        })
    }
    setSelectedReasonTags(temptags)
    const index = props.prodReasonType.findIndex(val => val.reason_type === rowData.Reason_Type)
    
    if (index >= 0) {
        getReasonListbyTypes(props.prodReasonType[index].id)
        setDowntime(props.prodReasonType[index].reason_type)
    }
    else
    {
        setDowntime("")
    }
}


   

    const handleDowntimeReasonType = (e) => {

        setDowntime(e.target.value)
        setReasonID(0)
        setReasonTagID([])
        setSelectedReasonTags([])
        //eslint-disable-next-line array-callback-return
        props.prodReasonType.map(val => {
            if (val.reason_type === e.target.value) {
                getReasonListbyTypes(val.id)
            }
        })

    }
    const handleDowntimeReason = (e) => {
        console.log(e)
        setReasonID(e.target.value)
        setSelectedReasonTags([])
        getDowntimeReasonTags(e.target.value)

    }
    const updateDowntimeReason = () => {
        let objs = {
            reasonID: reasonID,
            reasonDesc: DiscriptionRef.current.value,
            reasonTags: selectedReasonTagList.map(val => val.id)
        }

        props.createDowntimeReason(objs)
        handleDialogClosefn()
    }

    const handleReasonTag = (e) => {  
        setSelectedReasonTags(e)  
    }



    return (
        
        <React.Fragment>   
              
                <ModalHeaderNDL>                
                    <TypographyNDL variant="heading-02-s"  value={ t("AddDowntime")} />
                  
                </ModalHeaderNDL>
                <ModalContentNDL>
                    <div style={{ marginBottom: 10, marginTop: '5px' }}>
                        <SelectBox fullWidth
                            disableUnderline={true}
                            id='reject-reason'
                            auto={false}
                            multiple={false}
                            value={downtime}
                            onChange={handleDowntimeReasonType}
                            label={t("Reason Type")}
                            keyId={"reason_type"}
                            keyValue={"reason_type"}
                            isMArray={true}
                            options={props.prodReasonType ? props.prodReasonType : []}
                        >
                        </SelectBox>
                    </div>
                    <div style={{ marginBottom: 10, marginTop: '5px' }}>
                        <SelectBox fullWidth
                            disableUnderline={true}
                            id='dt-reject-1'
                            auto={false}
                            multiple={false}
                            value={reasonID}
                            keyId={"id"}
                            keyValue={"reason"}
                            isMArray={true}
                            onChange={handleDowntimeReason}
                            label={t("Downtime Reason")}
                            options={downtimeReasonList ? downtimeReasonList : []}
                        >
                        </SelectBox>
                    </div>
                    <div style={{ marginBottom: 10, marginTop: '5px' }}>
                        <SelectBox
                            id="combo-box-demo"
                            label={t("Reason Tags")}
                            placeholder={t("Select Reason Tag")}
                            auto={true}
                            options={reasontagIDs ? reasontagIDs : []}
                            onChange={(e) => handleReasonTag(e)}
                            value={selectedReasonTagList}
                            isMArray={true}
                            edit={true}
                            keyValue={"reason_tag"}
                            keyId={"id"}
                            multiple={true}
                        />
                    </div>


                    <InputFieldNDL
                        id="description-id"
                        label={t('description')}
                        type={"text"}
                        inputRef={DiscriptionRef}
                        multiline={true}
                        maxRows={1}

                    />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary" danger value={t('Cancel')} onClick={() => handleDialogClosefn()} />
                    <Button type="primary" value={t('Save')} onClick={() => updateDowntimeReason()} />

                </ModalFooterNDL>
              {/* </ModalNDL> */}
        </React.Fragment>
    )
})

export default AddDowntimeModel;
