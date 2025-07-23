import React, { useState, useEffect } from "react";  
import Grid from "components/Core/GridNDL";  
import InputFieldNDL from "components/Core/InputFieldNDL"; 
import Button from "components/Core/ButtonNDL";
import CheckIcon from 'assets/neo_icons/Menu/checkbox_tick.svg?react';
import BlockIcon from 'assets/neo_icons/Menu/notinterested_icon.svg?react';
import ParagraphText from "components/Core/Typography/TypographyNDL";
import useRejectReq from "../hooks/useRejectRequest";
import { useRecoilState } from "recoil";
import { userData } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";

const RequestReject = (props) => {
  const { t } = useTranslation();
  const [, setOpenSnack] = useState(false);
  const [, setSnackType] = useState("success");
  const [, setSnackMessage] = useState("");
  const {
    outRejectReqLoading,
    outRejectReqData,
    outRejectReqError,
    getRejctReq,
  } = useRejectReq();
  const [userDetails] = useRecoilState(userData);
  const rejectReq = (id, reason) => {
    getRejctReq(false, true, new Date(), userDetails.id, reason, id);
  };
  useEffect(() => {
    if (!outRejectReqLoading && outRejectReqData && !outRejectReqError) {
      if (
        outRejectReqData.delete_neo_skeleton_user_request_access &&
        outRejectReqData.delete_neo_skeleton_user_request_access
          .affected_rows &&
        outRejectReqData.delete_neo_skeleton_user_request_access.affected_rows >
          0
      ) {
        setSnackMessage(t("RequestRejected"));
        setSnackType("success");
        setOpenSnack(true);
        props.setIsDeleteVal(props.id, false, props.ind);
      } else {
        setSnackMessage(t("RequestRejected"));
        setSnackType("success");
        setOpenSnack(true);
        props.setIsDeleteVal(props.id, false, props.ind);
        rejectReq();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outRejectReqData]); 
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        
          <ParagraphText id="reject-reason-label" value={props.label} />
          <InputFieldNDL
              label={props.label}
              value={props.value}
              onChange={props.RejectOnChange} 
              endAdornment={
                <div style={{display:'flex'}}>
                  <Button
                    id={"rejectReq" + props.id}
                    type="secondary"
                    aria-label="delete"
                    icon={CheckIcon}
                    onClick={() => props.rejectReq(props.id, props.value)}
                  />
                  <Button
                    id={"delete-request-" + props.id}
                    type="secondary"
                    aria-label="delete"
                    icon={BlockIcon}
                    onClick={() =>
                      props.setIsDeleteVal(props.id, false, props.ind)
                    }
                  />
                </div>}
            />
            
      </Grid>
    </Grid>
  );
};

export default RequestReject;
