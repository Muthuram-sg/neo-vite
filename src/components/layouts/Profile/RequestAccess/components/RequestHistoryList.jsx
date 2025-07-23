import React, { useState, useEffect } from "react";  
import ToolTip from "components/Core/ToolTips/TooltipNDL"; 
import Check from 'assets/neo_icons/Menu/checkbox_tick.svg?react';
import BlockIcon from 'assets/neo_icons/Menu/notinterested_icon.svg?react'; 
import ParagraphText from "components/Core/Typography/TypographyNDL"; 
import moment from "moment";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { themeMode } from "recoilStore/atoms";
import Button from "components/Core/ButtonNDL";  
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";

export default function RequestHistoryList(props) {
  const { t } = useTranslation();
  const [ARList, SetARList] = useState(props.ARList);
  const [curTheme] = useRecoilState(themeMode);
 

  useEffect(() => {
    SetARList(props.ARList);
  }, [props]);

  const setIsDeleteVal = (id, val, ind) => {
    let temp = JSON.parse(JSON.stringify(ARList));
    temp[ind].isDelete = val;
    SetARList(temp);
  };

  const renderdeleteButton = (id, isDeleteVal, ind) => {
    if (isDeleteVal) {
      return (
        <React.Fragment>
          <div style={{ display: "flex", marginTop:"10px"}}>
            <ToolTip title={t("ConfirmDelete")} placement="top">
              <Button
                id="req-history-delete-confirm"
                type="secondary"
                aria-label="delete"
                icon={Check}
                onClick={() => props.deleteReq(id)}//NOSONAR
              />
            </ToolTip>
            <ToolTip title={t("Cancel")} placement="right">
              <Button
                id="req-history-delete-cancel"
                type="secondary"
                aria-label="delete"
                icon={BlockIcon}
                onClick={() => setIsDeleteVal(id, false, ind)}
              />
            </ToolTip>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <ToolTip title={t("DeleteRequest")} placement="right">
          <Button
            type="secondary"
            value={t("Cancel")}
            onClick={() => setIsDeleteVal(id, true, ind)}
          />
        </ToolTip>
      );
    }
  };

  if (!ARList || ARList.length < 1) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center", height:"50vh" }}>
        <ParagraphText id="reject-reason-label" value={t("noreqhis")}  color="secondary"/>
      </div>
    );
  }
  return (
    <ul dense="true">
      {ARList &&
        ARList !== "" &&
        ARList.map((val, ind) => {
          return (
            <React.Fragment>
              <li key={val.id}>
                <div style={{display:'flex', alignItems:"center", marginLeft:"5px"}}>
                  <ParagraphText
                          variant="heading-02-sm"
                          value={val.line.name}
                          color={curTheme === "light" ? "#242424" : "#A6A6A6"}
                  />
                  <React.Fragment>
                        <ParagraphText
                          variant="Caption2"
                          value={
                            val.line.gaia_plants_detail.activity_name +
                            ", " +
                            val.line.gaia_plants_detail.business_name +
                            ", " +
                            val.line.gaia_plants_detail.country_name
                          }
                          color={curTheme === "light" ? "#242424" : "#A6A6A6"}
                        />
                        <ParagraphText
                          color={curTheme === "light" ? "#242424" : "#A6A6A6"}
                          value={
                            t("Requested") + moment(val.created_ts).fromNow()
                          }
                        />
                        {val.approve && !val.reject && (
                          <ParagraphText
                            color={curTheme === "light" ? "#242424" : "#A6A6A6"}
                            value={
                              t("Approved") + "By " + val.userByUpdatedBy.name
                            }
                          />
                        )}
                      </React.Fragment>
                </div>
                <div key={val.id} className="mt-2">
                  {val.approve && !val.reject && (
                    <ParagraphText
                      color={"#006400"}
                      variant="Caption2"
                      value={" " + t("Approved")}
                    />
                  )}
                  {!val.approve &&
                    !val.reject &&
                    renderdeleteButton(val.id, val.isDelete, ind)}
                  {!val.approve && val.reject && (
                    <ToolTip title={val.reject_reason} placement="top">
                      <ParagraphText
                        color={curTheme === "light" ? "#242424" : "#A6A6A6"}
                        variant="Caption2"
                        value={t("Rejected")}
                      />
                    </ToolTip>
                  )}
                </div>
              </li>
              <HorizontalLine variant="divider1"  middle  style={{marginTop:"10px"}}/>
            </React.Fragment>
          );
        })}
    </ul>
  );
}
