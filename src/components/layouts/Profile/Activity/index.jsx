import React, { useEffect, useState } from "react";
import Text from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import moment from "moment";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { themeMode, currentPage, customdates, userData, selectedPlant, dashBtnGrp, snackMessage, snackType, snackToggle, DateSrch } from "recoilStore/atoms";
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import EnhancedTable from "components/Table/Table";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import useGetNotification from "./components/hooks/useGetNotification";
import useGetAuditNotification from "./components/hooks/useGetAuditNotification";
import useGetReport from "./components/hooks/useGetReport";
import { useAuth } from "components/Context";
import configParam from 'config';
import { useMutation } from "@apollo/client";
export default function Activity() {
  
  const { HF } = useAuth();
  const { t } = useTranslation();
  const [curTheme] = useRecoilState(themeMode);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [showtextvalue, setShowtextvalue] = useState("Today");
  const [customDates] = useRecoilState(customdates);
  const [DatesSearch, setDatesSearch] = useRecoilState(DateSrch);
  const [curUserData] = useRecoilState(userData);
  const [headPlant] = useRecoilState(selectedPlant);
  const { NotificationLoading, NotificationData, NotificationError, getNotification } = useGetNotification();
  const { AuditNotificationLoading, AuditNotificationData, AuditNotificationError, getAuditNotification } = useGetAuditNotification();
  const { ReportLoading, ReportData, ReportError, getReport } = useGetReport()
  const [data, setData] = useState([]);
  const [tabledata, setTableData] = useState([])
  const [, setCurPage] = useRecoilState(currentPage);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);


  // console.log("useGetAlert",outGNCData,"useGetNotification",outGNData,"useGetUserDetail",outGUDData,"useGetAuditNotification",outGANData)
  useEffect(() => {
    setCurPage("Activity");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (btGroupValue) {
      setShowtextvalue(showtextvaluefn())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btGroupValue]);
  useEffect(() => {
    if (btGroupValue !== 17) {
      let Date = getDateFunc()
      let body = { from: Date.start, to: Date.end }
      getNotification(body)
      // }
      setData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btGroupValue])

  useEffect(() => {
    if (DatesSearch) {
      let Date = getDateFunc()
      let body = { from: Date.start, to: Date.end }
      getNotification(body)
      // }
      setData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DatesSearch])
  useEffect(() => {
    if (!NotificationLoading && NotificationData && !NotificationError) {
      let startrange;
      let endrange;
      startrange = configParam.DATE_ARR(btGroupValue, headPlant);
      if (btGroupValue === 17) {
        startrange = moment(customDates.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        endrange = moment(customDates.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
      } else if (btGroupValue === 0) {
        startrange = moment().subtract(1, "minutes").format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      } else if (btGroupValue === 7) {
        endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      } else if (btGroupValue === 20) {
        endrange = configParam.DATE_ARR(22, headPlant)
      } else if (btGroupValue === 21) {
        endrange = configParam.DATE_ARR(23, headPlant)
      }

      else if (btGroupValue === 11) {//current Shif
        if (headPlant.shift && headPlant.shift.shifts) {
          if (headPlant.shift.ShiftType === "Weekly") {
            for (let i = 0; i < Object.keys(headPlant.shift.shifts).length; i++) {
              let l = new Date().getDay();
              // eslint-disable-next-line eqeqeq
              if (l == Object.keys(headPlant.shift.shifts)[i]) {
                for (let j = 0; j < headPlant.shift.shifts[i].length; j++) {
                  const shifts = headPlant.shift.shifts[i]
                  let st = new Date(moment().format(`YYYY-MM-DDT` + shifts[j].startDate) + 'Z');
                  let st1 = st.toLocaleTimeString('en-GB');
                  let st2 = st1.split(":")
                  let et = new Date(moment().format(`YYYY-MM-DDT` + shifts[j].endDate) + 'Z');
                  let et1 = et.toLocaleTimeString('en-GB')
                  let et2 = et1.split(":")
                  let T1 = st2[0] + ":" + st2[1];
                  let c1 = et2[0] + ":" + et2[1];
                  if (moment().format("YYYY-MM-DDTHH:mm:ssZ") > moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`) && moment().format("YYYY-MM-DDTHH:mm:ssZ") < moment().format(`YYYY-MM-DDT` + c1 + `:ssZ`)) {

                    startrange = moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`);
                    endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ");
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < headPlant.shift.shifts.length; i++) {
              const shifts = headPlant.shift.shifts
              let st = new Date(moment().format(`YYYY-MM-DDT` + shifts[i].startDate) + 'Z');
              let st1 = st.toLocaleTimeString('en-GB');
              let st2 = st1.split(":")
              let et = new Date(moment().format(`YYYY-MM-DDT` + shifts[i].endDate) + 'Z');
              let et1 = et.toLocaleTimeString('en-GB')
              let et2 = et1.split(":")
              let T1 = st2[0] + ":" + st2[1];
              let c1 = et2[0] + ":" + et2[1];

              if (moment().format("YYYY-MM-DDTHH:mm:ssZ") > moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`) && moment().format("YYYY-MM-DDTHH:mm:ssZ") < moment().format(`YYYY-MM-DDT` + c1 + `:ssZ`)) {
                startrange = moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`);
                endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ");
              }
            }

          }
        }

      }

      else if (btGroupValue === 1) {
        startrange = moment().subtract(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      else if (btGroupValue === 2) {
        startrange = moment().subtract(15, "minutes").format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      else if (btGroupValue === 3) {
        startrange = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      } else if (btGroupValue === 4) {
        startrange = moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss");
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
      } else if (btGroupValue === 5) {
        startrange = moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      } else if (btGroupValue === 6) {//Today
        startrange = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss");
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
      } else if (btGroupValue === 8) {//week
        startrange = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
        endrange = moment().format("YYYY-MM-DD HH:mm:ss");
      } else if (btGroupValue === 9) {//this month
        startrange = moment().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
      }
      else if (btGroupValue === 16) {
        endrange = moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ss");
      } else {
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss")
      }
      formatAllData(NotificationData, AuditNotificationData, []);
      let timeStamp = curUserData && curUserData.user_notification && curUserData.user_notification.notification_checkpoint ? moment(curUserData.user_notification.notification_checkpoint).format("YYYY-MM-DD " + HF.HMS) : ''
      let body = {
        lineId: headPlant.id,
        timestamp: timeStamp,
        from: startrange,
        to: endrange
      }
      // console.log(moment(selectedDateStart).format("yyyy-mm-dd HH:MM"),"start",moment(selectedDateEnd).format("yyyy-mm-dd HH:MM"))
      getAuditNotification(body);
      getReport(curUserData, headPlant, startrange, endrange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NotificationLoading, NotificationData, NotificationError])

  useEffect(() => {
    if (!AuditNotificationLoading && AuditNotificationData && !AuditNotificationError) {
      formatAllData([], AuditNotificationData.data, []);
      // console.log(AuditNotificationData.data,"AuditNotificationData")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AuditNotificationLoading, AuditNotificationData, AuditNotificationError])


  useEffect(() => {
    if (!ReportLoading && ReportData && !ReportError) {
      formatAllData([], [], ReportData);
      // console.log(ReportData,"ReportData")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReportLoading, ReportData, ReportError])

  function getDateFunc() {
    let startrange;
    let endrange;
    startrange = configParam.DATE_ARR(btGroupValue, headPlant);
    if (btGroupValue === 17) {
      startrange = moment(customDates.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
      endrange = moment(customDates.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
    } else if (btGroupValue === 0) {
      startrange = moment().subtract(1, "minutes").format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    } else if (btGroupValue === 7) {
      endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (btGroupValue === 20) {
      endrange = configParam.DATE_ARR(22, headPlant)
    } else if (btGroupValue === 21) {
      endrange = configParam.DATE_ARR(23, headPlant)
    }

    else if (btGroupValue === 11) {//current Shif
      if (headPlant.shift && headPlant.shift.shifts) {
        if (headPlant.shift.ShiftType === "Weekly") {
          for (let i = 0; i < Object.keys(headPlant.shift.shifts).length; i++) {
            let dt = new Date().getDay();
            // eslint-disable-next-line eqeqeq
            if (dt == Object.keys(headPlant.shift.shifts)[i]) {
              for (let j = 0; j < headPlant.shift.shifts[i].length; j++) {
                const shifts = headPlant.shift.shifts[i]
                let st = new Date(moment().format(`YYYY-MM-DDT` + shifts[j].startDate) + 'Z');
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let et = new Date(moment().format(`YYYY-MM-DDT` + shifts[j].endDate) + 'Z');
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                if (moment().format("YYYY-MM-DDTHH:mm:ssZ") > moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`) && moment().format("YYYY-MM-DDTHH:mm:ssZ") < moment().format(`YYYY-MM-DDT` + c1 + `:ssZ`)) {

                  startrange = moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`);
                  endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ");
                }
              }
            }
          }
        } else {
          for (let i = 0; i < headPlant.shift.shifts.length; i++) {
            const shifts = headPlant.shift.shifts
            let st = new Date(moment().format(`YYYY-MM-DDT` + shifts[i].startDate) + 'Z');
            let st1 = st.toLocaleTimeString('en-GB');
            let st2 = st1.split(":")
            let et = new Date(moment().format(`YYYY-MM-DDT` + shifts[i].endDate) + 'Z');
            let et1 = et.toLocaleTimeString('en-GB')
            let et2 = et1.split(":")
            let T1 = st2[0] + ":" + st2[1];
            let c1 = et2[0] + ":" + et2[1];

            if (moment().format("YYYY-MM-DDTHH:mm:ssZ") > moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`) && moment().format("YYYY-MM-DDTHH:mm:ssZ") < moment().format(`YYYY-MM-DDT` + c1 + `:ssZ`)) {
              startrange = moment().format(`YYYY-MM-DDT` + T1 + `:ssZ`);
              endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ");
            }
          }

        }
      }

    }

    else if (btGroupValue === 1) {
      startrange = moment().subtract(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    }
    else if (btGroupValue === 2) {
      startrange = moment().subtract(15, "minutes").format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    }
    else if (btGroupValue === 3) {
      startrange = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    } else if (btGroupValue === 4) {
      startrange = moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss");
      endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
    } else if (btGroupValue === 5) {
      startrange = moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    } else if (btGroupValue === 6) {//Today
      startrange = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss");
      endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
    } else if (btGroupValue === 8) {//week
      startrange = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
      endrange = moment().format("YYYY-MM-DD HH:mm:ss");
    } else if (btGroupValue === 9) {//this month
      startrange = moment().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
      endrange = moment().format("YYYY-MM-DDTHH:mm:ss");
    }
    else if (btGroupValue === 16) {
      endrange = moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    } else {
      endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
    }

    return { start: startrange, end: endrange }
  }

  const formatAllData = (notificationData, auditList, reportNotification) => {

    if ((notificationData && notificationData.length > 0) || (auditList && auditList.length > 0) || (reportNotification && reportNotification.length > 0)) {
      let finalData = [...data];

      if (notificationData.length > 0) {
        // eslint-disable-next-line array-callback-return
        notificationData.map((ndata) => {
          let tempData = {
            type: 'Release',
            name: ndata.release_name,
            discription: ndata.release_discription,
            entity: "",
            time: ndata.created_ts,
            badge: "",
            user: ndata.user.name
          }
          finalData.push(tempData);
        });

      }

      
      if (auditList && auditList.length > 0 && Array.isArray(auditList)) {
        // eslint-disable-next-line array-callback-return
        auditList.forEach((auditData) => {
                  
          let letters = ["alerts", "entity", "entity_info", "instruments", "hierarchy"];
          let table = letters.includes(auditData.table_name) ? "An " : "A";

          let DataAction=""
          let DataActionDesc=""
          let DataActionName=""

          if (!auditData.action_timestamp) {
            return true;
          }

          const capTableName = auditData.table_name.charAt(0).toUpperCase() + auditData.table_name.slice(1)
          
          if(auditData.action === "i")
          {
            DataAction=auditData.newname;
            DataActionDesc="Created";
            DataActionName= "Created";
          }
          else if (auditData.action === "u")
          {
            DataAction=auditData.newname;
            DataActionDesc="Updated";
            DataActionName="Updated";
          }
          else{
            DataAction= auditData.oldname;
            DataActionDesc="  " + table.toLocaleLowerCase() + " " + capTableName;
            DataActionName="Deleted";
          }

          let newName = DataAction
          let discription = DataActionDesc
          let named = newName ? " named " + newName : "";

          let tempData = {
            type: 'Audit',
            name:  capTableName + DataActionName,
            updated_cols: auditData.updated_cols,
            table: capTableName,
            time: auditData.action_timestamp,
            user: auditData.name ? auditData.name : "",
            discription: auditData.name + " " + discription + named,
            entity: newName,
            tableName: capTableName,
          }
          // console.log(tempData,"temsata")
          finalData.push(tempData);
        })
      }

      if (reportNotification && reportNotification.length > 0) {
        // eslint-disable-next-line array-callback-return
        reportNotification.map((reportData) => {
          // console.log(reportNotification,"reportNotification")
          let tempData = {
            type: 'Report',
            id: reportData.id,
            reportID: reportData.report_id,
            name: "Report Published",
            discription: reportData.report ? reportData.report.name : "Report",
            entity: reportData.report ? reportData.report.name : "Report",
            time: reportData.created_at,
            badge: "",
            user: reportData.report.user.name ? reportData.report.user.name : ""

          }
          finalData.push(tempData);
        })
      }

     

      finalData.sort((a, b) => new Date(b.time) - new Date(a.time));
      setData(finalData)
      setDatesSearch(false)
      processedrows(finalData)
    } else {
      setData([]);
      setDatesSearch(false)

    }
  }

  const processedrows = (tableData) => {
    let temptabledata = []
    if (tableData.length > 0) {
      temptabledata = temptabledata.concat(tableData.map((val, index) => {
        return [val.name, val.discription, moment(val.time).format("YYYY-MM-DD HH:mm:ss"),
        val.user]
      })
      )
    }
    setTableData(temptabledata)
  }
  const showtextvaluefn = () => {

    if (btGroupValue === 27) {
      return t("Last 1 Min")
    } else if (btGroupValue === 17) {
      return "Custom"
    } else if (btGroupValue === 1) {
      return t("Last 5 Min")
    } else if (btGroupValue === 2) {
      return t("Last 15 Min")
    } else if (btGroupValue === 3) {
      return t("Last 30 Min")
    } else if (btGroupValue === 13) {
      return t("Last 24 Hrs")
    } else if (btGroupValue === 4) {
      return t("LastHour")
    } else if (btGroupValue === 12) {
      return t('Last 3 Hrs')
    } else if (btGroupValue === 5) {
      return t('Last 6 Hrs')
    } else if (btGroupValue === 6) {
      return "Today"
    } else if (btGroupValue === 7) {
      return "Yesterday"
    } else if (btGroupValue === 8) {
      return t('ThisWeek')
    } else if (btGroupValue === 9) {
      return t('ThisMonth')
    } else if (btGroupValue === 11) {
      return t('ThisShift')
    } else if (btGroupValue === 14) {
      return t('Last 7 Days')
    } else if (btGroupValue === 15) {
      return t('Last 30 Days')
    } else if (btGroupValue === 16) {
      return t('LastMonth')
    } else if (btGroupValue === 19) {
      return t('Shift - Today')
    } else if (btGroupValue === 20) {
      return t('Shift - Yesterday')
    } else if (btGroupValue === 21) {
      return t('Last Shift')
    } else {
      return showtextvalue
    }
  }

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: t('Name'),
    },
    {
      id: 'discription',
      numeric: false,
      disablePadding: false,
      label: t('Description'),
    },
    {
      id: 'time',
      numeric: false,
      disablePadding: false,
      label: t('Time Stamp'),
    },
    {
      id: 'user',
      numeric: false,
      disablePadding: false,
      label: t('Done By'),
    }
  ];
  const downloadReport = async (id, value) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/zip");
    myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
    myHeaders.append("responseType", 'blob');
    const requestOptions = {
      method: "GET",
      headers: myHeaders
    };
    const url = configParam.API_URL + "/iiot/reportFile?report_id=" + value.id;
    await fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          response.blob().then(function (myBlob) {
            const fileURL = URL.createObjectURL(myBlob);
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', value.entity);
            fileLink.setAttribute('target', '_blank');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
          });
          updateReportGeneration({ variables: { id: value.id } });
        } else {
          SetMessage(t('Problem in download this report'))
          SetType("error")
          setOpenSnack(true)
        }
      })
      .catch((error) => {
        SetMessage(t('Problem in download this report'))
        SetType("error")
        setOpenSnack(true)
      });
  }
  const [updateReportGeneration, { error: updateerr }] = useMutation(
    configParam.updateReportGeneration,
    {
      update: (inMemoryCache, returnData) => {  
        if (!updateerr) {
          console.log(returnData,"Error Accured")
        }
      }
    }
  );
  return (
    <div >
        <div className="flex justify-between px-4 py-2">
         <div className="flex gap-2 items-center">
          <Text
            variant="heading-02-xs"
            value={t("Activity")}
          
          />
           
        <Information style={{
          color: curTheme === "light" ? "#242424" : "#A6A6A6",
          // marginTop: "24px",
          // marginLeft: 16,

        }} width={16}  height={16}/>
        </div>
         <DatePickerNDL
              id="custom-range-activity"
              onChange={(dates) => {
                const [start, end] = dates; 
                setSelectedDateStart(start);
                setSelectedDateEnd(end);
              }} 
              startDate={selectedDateStart}
              endDate={selectedDateEnd}
              disabled={true}
               dateFormat="dd/MM/yyyy HH:mm:ss"
              selectsRange={true}
              timeFormat="HH:mm:ss"
              customRange={true}
              width={'386px'}
              defaultDate={btGroupValue}
              Dropdowndefine={"activity"}
      />
</div>
      <HorizontalLine  />

      
      {/* <div style={{ display: 'flex', alignContent: "flex-end", justifyContent: 'flex-end', position: "relative", bottom: "35px" }}> */}
        
      
      {/* </div> */}
      <div className="px-4 py-3"> 
      <EnhancedTable
        headCells={headCells}
        data={tabledata}
        search={true}
        actionenabled={true}
        rawdata={data}
        handleDownload={(id, value) => downloadReport(id, value)}
        activity={true}
      />
      </div>
    
      {/* <MUIDataTable className={classes.table}
                title={""}
                data={data ? data : []}
                columns={columns}
                options={{
                    download: false,
                    // customSearch: true,
                    // pagination: true,
                    // rowsPerPage: 10,
                    page: Page,
                    rowsPerPageOptions:[10,20,50,100],
                    // onChangePage: onChangePage,
                    print: false,
                    filter: false,
                    search: true,
                    viewColumns: false,
                    elevation: 0,
                    filterType: "checkbox",
                    selectableRows: "none",
                    textLabels: {
                        body: {
                          noMatch: t('Sorry, no matching records found'),
                        }
                      }
                }}
            /> */}

    </div>

  );
}
