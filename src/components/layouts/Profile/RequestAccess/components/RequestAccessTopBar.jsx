import React, { useState, useEffect } from "react";
import Tabs from 'components/layouts/Explore/ExploreMain/ExploreTabs/components/ExploreTabs';
import RequestHistoryList from "./RequestHistoryList";
import PendingAccessList from "./PendingAccessList";
import Typography from "components/Core/Typography/TypographyNDL";
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL";
import moment from "moment";

export default function RequestAccessTopBar(props) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const [pendingReqList, setPendingReqList] = useState(props.ARList);
  const [ARList, setARList] = useState(props.pendingReqList);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteReq = (id) => {
    props.deleteReq(id);
  };

  const approveReq = (id) => {
    props.approveReq(id);
  };

  const rejectReq = (id, rejectReason) => {
    props.rejectReq(id, rejectReason);
  };

  useEffect(() => {
    setPendingReqList(props.pendingReqList);
    setARList(props.ARList);
  }, [props]);

  const Menu = [
    {
        title: t("RequestHistory"),
        content: <RequestHistoryList
        ARList={ARList}
        refreshReqList={props.refreshList}
        deleteReq={deleteReq}
      />
    },
    
    {
        title: t("ReviewRequests"),
        content: <PendingAccessList
        pendingReqList={pendingReqList}
        deleteReq={deleteReq}
        approveReq={approveReq}
        rejectReq={rejectReq}
      />
    }]
    
  return (
    <Card >
        <div
              style={{
          marginTop: 6, float: "right"
        }}>
        <Typography
       style={{marginBottom:"5px"}}
          variant="lable-01-s"
          value = {
          (ARList.length> 0) ?
          t("LastUpdate") +
          moment(
            new Date(
              Math.max(...ARList.map((e) => new Date(e.updated_ts)))
            )
          ).fromNow()
          :
          ''
        }
          >
          
          
        </Typography>
      </div>
       <Tabs MenuTabs={Menu} currentTab={value} tabChange={handleChange} style={{marginTop:"10px"}}/>
        <div style={{padding: "0px 5px 10px 5px"}}>
            {Menu[value].content} 
        </div>
          
      
    </Card>
  );
}
