import React, { useState, useEffect } from "react"; 
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import CustomList from "components/Core/List/List";
import ApproveButton from "./ApproveButton";
import RequestReject from "./RequestReject";
import ParagraphText from "components/Core/Typography/TypographyNDL";

export default function PendingAccessList(props) {
  const classes = {
    card: {
      // border: "1px solid #e0e0e0",
      border: "0px",
      height: "100%",
    },  
    dividerStyleLight: {
      border: "1px solid #E6E6E6",
    },
    dividerStyleDark: {
      border: "1px solid #333333",
    },
  }
  const { t } = useTranslation(); 
  const [pendingReqList, setPendingReqList] = useState(props.pendingReqList);
  const [reqReason, setReqReason] = useState("");
  const [curTheme] = useRecoilState(themeMode);

  useEffect(() => {
    setPendingReqList(props.pendingReqList);
  }, [props]);

  const setIsDeleteVal = (id, val, ind) => {
    let temp = JSON.parse(JSON.stringify(pendingReqList));
    temp[ind].isDelete = val;
    setPendingReqList(temp);
  };

  const handleChangeReqReason = (e) => {
    setReqReason(e.target.value);
  };

  const renderReviewControl = (id, isDeleteVal, ind) => {
    if (isDeleteVal) {
      return (
        <RequestReject
          label={t("RejectReason")}
          value={reqReason}
          RejectOnChange={handleChangeReqReason}
          id={id}
          ind={ind}
          setIsDeleteVal={setIsDeleteVal}
          rejectReq={props.rejectReq}
        />
      );
    } else {
      return (
        <ApproveButton
          id={id}
          BtnValue1={t("Approve")}
          BtnValue2={t("Reject")}
          ind={ind}
          approveReq={props.approveReq}
          setIsDeleteVal={setIsDeleteVal}
        />
      );
    }
  };
  if (!pendingReqList || pendingReqList.length < 1) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center", height:"50vh" }}>
      <ParagraphText value={t("noreq")}  color="secondary"/>
    </div>
    );
  }
  return (
    <CustomList
      card={classes.card}
      pendingReqList={pendingReqList}
      constrol={renderReviewControl}
      curTheme={curTheme}
      dividerStyleLight={classes.dividerStyleLight}
      dividerStyleDark={classes.dividerStyleDark}
    />
  );
}
