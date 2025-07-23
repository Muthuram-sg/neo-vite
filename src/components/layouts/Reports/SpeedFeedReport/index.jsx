import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import EnhancedTable from "components/Table/Table";
import { useTranslation } from "react-i18next";
import Grid from "components/Core/GridNDL";
import Charts from "components/Charts_new/Chart";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import UseEntity from "components/layouts/Settings/Entity/hooks/useEntity";
import { selectedPlant, customdates, stdReportAsset, dashBtnGrp } from "recoilStore/atoms";
import useGetCNCReport from "../hooks/useGetCNCReport";

import moment from "moment";
import configParam from "config";
import { getDatesBetween, getDurationInMinutes, headCells } from "./constant";
import FeedChart from "./feedChart";
import LoadingScreenNDL from "LoadingScreenNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Toast from "components/Core/Toast/ToastNDL";
import commonReports from '../components/common';
import html2canvas from 'html2canvas';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import NeoLogo from "assets/neo_icons/Logos/Neo_pdf.png"



const SpeedFeedReport = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [Customdatesval] = useRecoilState(customdates);
  // const [instrument, setInstrument] = useState('')
  const [tableData, setTableData] = useState([]);
  const [rawTableData, setRawTableData] = useState([]);
  const [feedData, setFeedData] = useState({})
  const [speedData, setSpeedData] = useState({})
  const [loading, setLoading] = useState(false)
  const [snType, SetSnackType] = useState('');
  const [snackOpen, setsnackOpen] = useState(false);
  const [snackMsg, SetSnackMessage] = useState('');
  const [selectedAsset] = useRecoilState(stdReportAsset);
  var janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
  var julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
  var stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
  var TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 
  const { EntityLoading, EntityData, EntityError, getEntity } = UseEntity();
  const speeddivRef = useRef(null);
  const feeddivRef = useRef(null);
  const [base64imagespeed, setBase64imagespeed] = useState(null);
  const [base64imagefeed, setBase64imagefeed] = useState(null);
  const [DownlaodRawData, setDownloadRawData] = useState([])
  const [SelectedDates, setSelectedDates] = useState({ start: Customdatesval.StartDate, end: Customdatesval.EndDate })
  const [logoBase64, setLogoBase64] = useState(null)


  // const { GetCNCReportLoading, GetCNCReportData, GetCNCReportError, getGetCNCReport } = useGetCNCReport()

  useEffect(() => {
    fetch(NeoLogo)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          setLogoBase64(base64data)
        };
        reader.readAsDataURL(blob);
      });
  }, []);
  // console.log(logoBase64, 'base64',base64imagefeed)

  useImperativeHandle(ref, () => ({

    triggerDownload: (type, name) => {
      if (type === 'csv') {
        generateExcel(DownlaodRawData, name, { speed: base64imagespeed, feed: base64imagefeed })
      } else {
        generatePDFReport(DownlaodRawData, name, { speed: base64imagespeed, feed: base64imagefeed })
      }
    }
  }))


  useEffect(() => {
    // getshifts(headPlant.id);
    // getShiftData()
    getEntity(headPlant.id);
  }, [Customdatesval]);

  useEffect(() => {
    if (base64imagefeed !== null && base64imagespeed !== null) {
      props.handleHideToolBar(true)
    } else {
      props.handleHideToolBar(false)
    }

  }, [base64imagefeed, base64imagespeed])



  useEffect(() => {
    if (Object.keys(speedData).length > 0) {
      setTimeout(() => {
        handleCapture('speed')
      }, 1000)
    }
    if (Object.keys(feedData).length > 0) {
      setTimeout(() => {
        handleCapture('feed')
      }, 1500)
    }
  }, [speedData, feedData])



  const handleCapture = async (type) => {
    const speedorfeed = type === 'speed' ? speeddivRef.current : feeddivRef.current
    if (speedorfeed) {
      const canvas = await html2canvas(speedorfeed);
      const base64images = canvas.toDataURL("image/png");
      if (type === 'speed') {
        setBase64imagespeed(base64images);
      } else {
        setBase64imagefeed(base64images)
      }
      // You can use the base64 string however you like (send to backend, download, etc.)
    }
  };


  const getDaySpan = ({ start, end }) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Normalize both dates to start of the day (ignores hours/minutes)
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const diffInMs = endDay - startDay;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Add 1 to include the end date as a full day
    return diffInDays + 1;
  };

  const generateExcel = async (data, assetName, chartBase64) => {
    const days = getDaySpan(SelectedDates)
    const firstEndValue = days > 1 ? 5 * days + 5 : 10
    const secondEndValue = days > 1 ? 5 * days + firstEndValue + 2 : 17

    try {
      console.log(data, assetName, 'data, assetName,')
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Speed & Feed");

      // Title Row
      worksheet.mergeCells("G1", "K1");
      worksheet.getCell("G1").value = `From:${moment(SelectedDates.start).format("DD/MM/YYYY HH:mm:ss")} To:${moment(SelectedDates.end).format("DD/MM/YYYY HH:mm:ss")}`;
      worksheet.mergeCells("A2:K3");
      worksheet.getCell("A2").value = `Speed & Feed Report - ${assetName}`;
      worksheet.getCell("A2").font = { bold: true, size: 16 };
      worksheet.getCell("G1").font = { bold: true, size: 12 };
      worksheet.getCell("A2").alignment = { horizontal: "center" };

      // Date top right

      const speedImageId = workbook.addImage({
        base64: chartBase64.speed,
        extension: "png",
      });
      worksheet.addImage(speedImageId, {
        tl: { col: 0, row: 4.5 }, // adjust row if needed
        ext: { width: 1000, height: 95 * days },
      });

      // Add label below Speed image
      worksheet.mergeCells("A4:K4");
      worksheet.getCell("A4").value = "Spindle Speed Analysis";
      worksheet.getCell("A4").alignment = { horizontal: "start", };
      worksheet.getCell("A4").font = { bold: true };

      worksheet.mergeCells(`A5:K${firstEndValue}`);
      // Insert Feed Image
      const feedImageId = workbook.addImage({
        base64: chartBase64.feed,
        extension: "png",
      });
      worksheet.addImage(feedImageId, {
        tl: { col: 0, row: firstEndValue + 2 }, // place this below the speed chart
        ext: { width:1000, height: 95 * days },
      });

      // Add label below Feed image
      worksheet.mergeCells(`A${firstEndValue + 1}:K${firstEndValue + 1}`);
      worksheet.getCell(`A${firstEndValue + 1}`).value = "Feed Rate Analysis";
      worksheet.getCell(`A${firstEndValue + 1}`).alignment = { horizontal: "start" };
      worksheet.getCell(`A${firstEndValue + 1}`).font = { bold: true };
      worksheet.mergeCells(`A${firstEndValue + 2}:K${secondEndValue + 1}`);

      // Table Headers
      const headers = [
        "S.No", "Date","Shift", "Asset Name", "Spindle Speed (RPM)",
        "Speed Status", "Feed Rate (mm/min)", "Feed Rate Status",
        "Start Time", "End Time", "Duration"
      ];

      const tableRowStart = secondEndValue + 2; // adjust based on image height
      const headerRow = worksheet.insertRow(tableRowStart, headers);
      // Table Data
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12 };
      });




      data.forEach((row, i) => {
        worksheet.insertRow(tableRowStart + i + 1, [
          i + 1,
          row.date,
          row.shift,
          row.assetStatus,
          row.spindleSpeed,
          row.speedStatus,
          row.feedRate,
          row.feedRateStatus,
          row.startTime,
          row.endTime,
          row.duration,
        ]);
      });

      for (let i = 1; i <= 10; i++) { // A to J = columns 1 to 10
        let maxLength = 10;
        worksheet.getColumn(i).eachCell({ includeEmpty: true }, (cell) => {
          if (cell.row >= tableRowStart) { // Only table rows
            const columnLength = cell.value ? cell.value.toString().length : 0;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          }
        });
        worksheet.getColumn(i).width = maxLength + 2;
      }
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            right: { style: "medium", color: { argb: "FF000000" } },
          };
        });
      });
      // Export as Blob and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `Speed_Feed_Report_${assetName}.xlsx`);
    } catch (error) {
      console.log(error, "downloaderror")
    }

  };


  const renderDynamicHeight = (days) => {
    if (days === 7) {
      return 100;
    } else if (days >= 6) {
      return 80;
    } else if (days >= 4) {
      return 60;
    } else if (days >= 3) {
      return 50;
    } else if (days >= 2) {
      return 40;
    } else {
      return 30;
    }
  }

  const findStats = (array, key, timeKey = 'date') => {
    if (!array.length) return "--";
  
    let min = null;
    let max = null;
    let minTime = null;
    let maxTime = null;
    let sum = 0;
    let count = 0;
  
    for (const obj of array) {
      const val = obj[key];
  
      if (typeof val !== 'number' || isNaN(val)) continue; // skip invalid
  
      if (min === null || val < min) {
        min = val;
        minTime = obj[timeKey];
      }
  
      if (max === null || val > max) {
        max = val;
        maxTime = obj[timeKey];
      }
  
      sum += val;
      count++;
    }
  
    if (count === 0) return "--"; // no valid numbers found
  
    const avg = (sum / count).toFixed(2);
  
    return {
      min,
      minTime,
      max,
      maxTime,
      avg,
    };
  };
  


  const generatePDFReport = (tableData, title, base64Img) => {
    const doc = new jsPDF();
    const days = getDaySpan(SelectedDates);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const checkAndAddPage = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight - 20) { // 20 is bottom margin
        doc.addPage();
        currentY = 20;
      }
    };


    let currentY = 20;

    // 1. Summary Section
    doc.setFillColor(0, 102, 255); // Blue
    doc.rect(14, currentY, pageWidth - 28, 10, 'F'); // full-width colored background
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Speed Feed Performance Report", pageWidth / 2, currentY + 7, { align: "center" });


    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    currentY += 20;

    const addSummaryRow = (label, value) => {
      const rowHeight = 8;
      const bgColor = [245, 245, 245] // light grays

      doc.setFillColor(...bgColor);
      doc.rect(14, currentY - 5, pageWidth - 28, rowHeight, 'F');

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}`, 16, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(value, 100, currentY);

      currentY += rowHeight;
    };

    // Render each summary item
    const speedRange = findStats(tableData, 'spindleSpeed', 'date');
    const feedRange = findStats(tableData, 'feedRate', 'date');
    // console.log(speedRange,"speedRange",feedRange)
    const summaryData = [
      ["Asset Name", title],
      ["Period of Analysis", `${moment(SelectedDates.start).format("DD/MM/YYYY HH:mm:ss")} - ${moment(SelectedDates.end).format("DD/MM/YYYY HH:mm:ss")}`],
      ["Report Generated on", `${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}`],
      ["Speed Range (RPM)", speedRange !== "--" && Object.keys(speedRange).length > 0 ? `${speedRange.min} - ${speedRange.max} RPM` : "--"],
      ["Feed Rate Range (mm/min)", feedRange !== "--" && Object.keys(feedRange).length > 0 ? `${feedRange.min} - ${feedRange.max} (mm/min)` : "--"],
      ["Average Spindle Speed (RPM)", speedRange !== "--" && Object.keys(speedRange).length > 0 ? `${speedRange.avg} RPM` : "--"],
      ["Average Feed Rate (mm/min)", feedRange !== "--" && Object.keys(feedRange).length > 0 ? `${feedRange.avg} mm/min` : "--"],
      ["Minimum Spindle Speed (RPM)", speedRange !== "--" && Object.keys(speedRange).length > 0 ? `${speedRange.min} RPM @ ${speedRange.minTime}` : "--"],
      ["Maximum Spindle Speed (RPM)", speedRange !== "--" && Object.keys(speedRange).length > 0 ? `${speedRange.max} RPM @ ${speedRange.maxTime}` : "--"],
      ["Minimum Feed Rate (mm/min)", feedRange !== "--" && Object.keys(feedRange).length > 0 ? `${feedRange.min} mm/min @ ${feedRange.minTime}` : "--",],
      ["Maximum Feed Rate (mm/min)", feedRange !== "--" && Object.keys(feedRange).length > 0 ? `${feedRange.max} mm/min @ ${feedRange.maxTime}` : "--",],
    ];

    summaryData.forEach((row, index) => {
      addSummaryRow(row[0], row[1]);
    });

    currentY += 5;


    // 4. Add Images
    const imageWidth = pageWidth - 28;
    const imageHeight = renderDynamicHeight(days);


    if (base64Img.speed) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('Spindle Speed Analysis', 14, currentY);
      currentY += 6;
      doc.addImage(base64Img.speed, 'JPEG', 14, currentY, imageWidth, imageHeight);
      currentY += imageHeight + 10;
    }

    if (base64Img.feed) {
      const titleHeight = 6;
      const requiredHeight = titleHeight + imageHeight + 10; // title + image + margin
      checkAndAddPage(requiredHeight);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('Feed Rate Analysis', 14, currentY);
      currentY += 6;
      doc.addImage(base64Img.feed, 'JPEG', 14, currentY, imageWidth, imageHeight);
      currentY += imageHeight + 10;
    }

    // 5. Add Table
    const headers = [
      "S.No", "Date","Shift", "Asset Name", "Spindle Speed (RPM)",
      "Speed Status", "Feed Rate (mm/min)", "Feed Rate Status",
      "Start Time", "End Time", "Duration"
    ];

    const formatedTableData = tableData.map((row, i) => [
      i + 1,
      moment(row.date).format("DD/MM/YYYY"),
      row.shift,
      row.assetStatus,
      row.spindleSpeed,
      row.speedStatus,
      row.feedRate,
      row.feedRateStatus,
      row.startTime,
      row.endTime,
      row.duration,
    ]);

    checkAndAddPage(25);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Performance Details', 14, currentY);
    currentY += 6

    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: formatedTableData,
      styles: {
        fontSize: 6,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3,              // uniform line width
        lineColor: [0, 0, 0],    
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
        fontStyle: 'bold',
        lineWidth: 0.3, // border thickness
        lineColor: [0, 0, 0],
      },
      theme: 'grid', // Ensures border grid like your image
      tableLineWidth: 0.3,
      tableLineColor: [0, 0, 0], 
      columnStyles: {
        2: { cellWidth: 15 },        // Adjust cell widths as needed
        3: { cellWidth: 25 },
      }
      
    });
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      doc.addImage(logoBase64, 'JPEG', 14, pageHeight - 12); // Logo bottom-left
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10); // Page number bottom-right
    }


    doc.save(`Speed & Feed Report - ${title}.pdf`);
  };



  const getShiftName = (start) => {
    let between_dates = getDatesBetween(
      moment(new Date(Customdatesval.StartDate)).format("YYYY-MM-DD"),
      moment(new Date(Customdatesval.EndDate)).format("YYYY-MM-DD")
    );
    let shift_data = []
    between_dates.map((z) => {
      var shifts = commonReports.getShiftBetweenDates2(
        moment(moment(z).startOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
        moment(moment(z).endOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
        headPlant.shift)
      shift_data.push(shifts)
    })
    shift_data = shift_data.flat()
    // console.log(shifts.filter(shift=>moment(start).isBetween(moment(shift.start),moment(shift.end))))
    return shift_data.filter(shift => moment(start).isBetween(moment(shift.start), moment(shift.end), null, '[]'))?.[0]?.name;
  };

  const getSpindleData = (data) => {

    let between_dates = getDatesBetween(
      moment(new Date(Customdatesval.StartDate)).format("YYYY-MM-DD"),
      moment(new Date(Customdatesval.EndDate)).format("YYYY-MM-DD")
    );
    let temp_data = {};
    data.sort((a, b) => new Date(a.start) - new Date(b.start));
    between_dates.map((date, zindex) => {
      temp_data[date] = [];
      data.map((x) => {

        let start = zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ")
        let end = zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ")

        // let start = moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
        // let end = durationLimit === 20 
        //   ? moment(date).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
        //   : moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")

        if (date === moment(new Date(x.start)).format("YYYY-MM-DD")) {
          let t_data = temp_data[date];
          t_data.push({ ...x, start_of_day: start, end_of_day: end });
          temp_data[date] = t_data;
        }
      });
    });
    // console.log(temp_data)
    between_dates.map((date, zIndex) => {
      let arr = temp_data[date];
      let temp_arr = temp_data[date];
      if (arr.length > 0) {
        // // console.clear()
        // // console.log(date, arr)

        arr.map((x, index) => {
          if (index === 0 && x.status !== 'Unknown') {
            // console.log("1")
            if (new Date(x.start).getTime() > new Date(x.start_of_day).getTime()) {
              let temp = {
                start: x.start_of_day,
                end: x.start,
                status: "Unknown",
                start_of_day: x.start_of_day,
                end_of_day: x.end_of_day
              };
              temp_arr.push(temp);
            } else {
              // let temp = {
              //   start: x.end,
              //   end: x.end_of_day,
              //   status: "Unknown",
              //   start_of_day: x.start_of_day, 
              //   end_of_day: x.end_of_day
              // };
              // temp_arr.push(temp);
            }
          } else if (index === arr.length - 1) {
            // console.log('4')
            if (x.status !== 'Unknown') {
              // console.log('5')
              if (new Date(x.end).getTime() < new Date(x.end_of_day).getTime()) {
                // console.log('6')
                let temp = {
                  start: x.end,
                  end: x.end_of_day,
                  status: "Unknown",
                  start_of_day: x.start_of_day,
                  end_of_day: x.end_of_day
                };
                temp_arr.push(temp);
              }
              else {
                // console.log('7')
              }
            }
            else {
              // console.log('8')
            }
          } else {
            // console.log('9')
            if (index + 1 < arr.length) {
              // console.log('10')
              if (arr[index + 1].status !== 'Unknown') {
                // console.log('11')
                if (new Date(arr[index + 1].start).getTime() !== new Date(x.end).getTime()) {
                  // console.log('12')

                  let temp = {
                    start: x.end,
                    end: moment(x.start).format('YYYY-MM-DD') !== moment(x.end_of_day).format('YYYY-MM-DD') ? moment(x.start).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : arr[index + 1].start,
                    status: `Unknown`,
                    start_of_day: x.start_of_day,
                    end_of_day: x.end_of_day
                  };
                  temp_arr.push(temp);
                }
                else {
                  // console.log('13')
                }
              } else {
                // console.log('14')
                let temp = {
                  start: x.end,
                  end: moment(x.start).format('YYYY-MM-DD') !== moment(x.end_of_day).format('YYYY-MM-DD') ? moment(x.start).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : x.end_of_day,
                  // end: x.end_of_day,
                  status: `Unknown`,
                  start_of_day: x.start_of_day,
                  end_of_day: x.end_of_day
                };
                temp_arr.push(temp);
              }
            }
            else {
              // console.log('16')
            }
          }

        });
      } else {
        // console.clear()
        // console.log(date)
        let temp = {
          start: zIndex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),
          end: zIndex !== between_dates.length - 1 ? moment(date).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : moment(Customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"),
          start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
          status: 'Unknown'
        }
        temp_arr.push(temp);
      }

      temp_data[date] = temp_arr;
    });


    let Statusdata = {}
    between_dates.map((date, zindex) => {
      Statusdata[date] = [{
        name: "Deviation",
        data: temp_data[date].filter((x) => x.status === "Deviation")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            value: [new Date(z.start).toLocaleString(), new Date(z.end).toLocaleString()]
            // z: z.value,
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).set('seconds', moment(Customdatesval.StartDate).get('seconds')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),

      }, {
        name: "Normal",
        data: temp_data[date].filter((x) => x.status === "Normal")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            value: [new Date(z.start).toLocaleString(), new Date(z.end).toLocaleString()]
            // z: z.value,
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
      }, {
        name: "Unknown",
        data: temp_data[date].filter((x) => x.status === "Unknown")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            value: [new Date(z.start).toLocaleString(), new Date(z.end).toLocaleString()]
            // z: '-'
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
      }]
    })

    // console.log("SPINDLE__________", Statusdata)
    setSpeedData(Statusdata)
  };

  const getFeedData = (data) => {
    let between_dates = getDatesBetween(
      moment(new Date(Customdatesval.StartDate)).format("YYYY-MM-DD"),
      moment(new Date(Customdatesval.EndDate)).format("YYYY-MM-DD")
    );
    let temp_data = {};
    // // console.clear()
    data.sort((a, b) => new Date(a.start) - new Date(b.start));
    between_dates.map((date, zindex) => {
      temp_data[date] = [];
      data.map((x) => {
        let start = zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ")
        let end = zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ")
        // let start = moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")

        // let end = durationLimit === 20 
        // ? moment(date).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
        // : moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")

        if (date === moment(new Date(x.start)).format("YYYY-MM-DD")) {
          let t_data = temp_data[date];
          t_data.push({ ...x, start_of_day: start, end_of_day: end });
          temp_data[date] = t_data;
        }
      });
    });
    // console.log(temp_data)
    between_dates.map((date, zIndex) => {
      let arr = temp_data[date];
      let temp_arr = temp_data[date];
      if (arr.length > 0) {
        arr.map((x, index) => {
          if (index === 0 && x.status !== 'Unknown') {
            if (new Date(x.start).getTime() > new Date(x.start_of_day).getTime()) {
              let temp = {
                start: x.start_of_day,
                end: x.start,
                status: "Unknown",
                start_of_day: x.start_of_day,
                end_of_day: x.end_of_day
              };
              temp_arr.push(temp);
            }
          } else if (index === arr.length - 1) {


            // console.log(x )
            if (x.status !== 'Unknown') {

              if (new Date(x.end).getTime() < new Date(x.end_of_day).getTime()) {
                let temp = {
                  start: x.end,
                  end: x.end_of_day,
                  status: "Unknown",
                  start_of_day: x.start_of_day,
                  end_of_day: x.end_of_day
                };
                // // console.log("_1_",new Date(temp.start), new Date(temp.end))
                temp_arr.push(temp);
              }
            }
          } else {
            if (index + 1 < arr.length) {
              if (arr[index + 1].status !== 'Unknown') {
                if (new Date(arr[index + 1].start).getTime() !== new Date(x.end).getTime()) {
                  let temp = {
                    start: x.end,
                    end: moment(x.start).format('YYYY-MM-DD') !== moment(x.end_of_day).format('YYYY-MM-DD') ? moment(x.start).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : arr[index + 1].start,
                    status: `Unknown`,
                    start_of_day: x.start_of_day,
                    end_of_day: x.end_of_day
                  };
                  temp_arr.push(temp);
                }
              } else {
                let temp = {
                  start: x.end,
                  end: moment(x.start).format('YYYY-MM-DD') !== moment(x.end_of_day).format('YYYY-MM-DD') ? moment(x.start).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : x.end_of_day,
                  status: `Unknown`,
                  start_of_day: x.start_of_day,
                  end_of_day: x.end_of_day
                };
                temp_arr.push(temp);
              }
            }
          }

        });
      } else {
        let temp = {
          // start: moment(date).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"), 
          start: zIndex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDat11e).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),
          end: zIndex !== between_dates.length - 1 ? moment(date).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ") : moment(Customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"),
          start_of_day: moment(date).set('hours', moment(Customdatesval.StartDat11e).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
          status: 'Unknown'
        }
        temp_arr.push(temp);
      }

      temp_data[date] = temp_arr;
    });


    let Statusdata = {}
    between_dates.map((date, zindex) => {
      Statusdata[date] = [{
        name: "Deviation",
        data: temp_data[date].filter((x) => x.status === "Deviation")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            // z: z.value,
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),

      }, {
        name: "Normal",
        data: temp_data[date].filter((x) => x.status === "Normal")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            // z: z.value,
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
      }, {
        name: "Unknown",
        data: temp_data[date].filter((x) => x.status === "Unknown")?.map((z) => {
          return {
            x: `${date}`,
            y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
            // z: '-'
          }
        }),
        start_of_day: zindex === 0 ? moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).startOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
        end_of_day: zindex === between_dates.length - 1 ? moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).endOf('date').format("YYYY-MM-DDTHH:mm:ssZ"),
      }]
    })


    setFeedData(Statusdata)

    // console.log("FEED After temp_data_____________", Statusdata, temp_data);
  };



  const fetchData = (body, instrument) => {
    try {
      setLoading(true)
      setBase64imagefeed(null)
      setBase64imagespeed(null)
      configParam
        .RUN_REST_API("/iiot/getCNCReport", body)
        .then((tdata) => {
          if (tdata.data.length > 0) {
            // console.log(tdata);
            setRawTableData(tdata?.data);
            // getSpindleRawData(tdata?.data);
            // getFeedRawData(tdata?.data)
            getSpindleData(tdata?.individualMetricDetails?.SspeedOvr);
            getFeedData(tdata?.individualMetricDetails?.Fovr);
            // console.clear()
            let tabledata = tdata?.data?.map((x, index) => {

              return [
                index + 1,
                instrument.name,
                moment(new Date(x.time)).format("YYYY-MM-DD"),
                getShiftName(x.start),
                x.SspeedOvrValue,
                x.SspeedOvr,
                x.FovrValue,
                x.Fovr,
                moment(new Date(x.start)).format("HH:mm:ss"),
                moment(new Date(x.end)).format("HH:mm:ss"),
                getDurationInMinutes(x.start, x.end),
              ];
            });
            // // console.log(tabledata,"jhkjhkjhkj")
            setDownloadRawData(tdata?.data?.map((x, index) => {
              return {
                index: index + 1,
                shift: getShiftName(x.start),
                assetStatus: instrument.name,
                spindleSpeed: x.SspeedOvrValue,
                speedStatus: x.SspeedOvr,
                feedRate: x.FovrValue,
                feedRateStatus: x.Fovr,
                startTime: moment(new Date(x.start)).format("HH:mm:ss"),
                endTime: moment(new Date(x.end)).format("HH:mm:ss"),
                duration: getDurationInMinutes(x.start, x.end),
                date: moment(new Date(x.start)).format("YYYY-MM-DD HH:mm:ss"),
              };
            }))
            console.log(tabledata)
            setLoading(false)
            setTableData(tabledata);
          }
          else {
            setLoading(false)
            setTableData([])
          }
        })
        .catch((error) => {
          setLoading(false)
          // console.clear()
          // console.log(error)
          SetSnackMessage('Future Dates Not Allowed.');
          SetSnackType("warning");
          setsnackOpen(true);
        });
    } catch (e) {
      console.error("ERROR", e);
    }
  };

  useEffect(() => {
    if (selectedAsset.length > 0) {
      // // console.clear();
      let instrument = EntityData?.filter((x) => x.id === selectedAsset);
      //   setInstrument(instrument?.[0])
      let ListBody = {
        schema: localStorage.getItem("plantid"),
        instrumentid: instrument?.[0]?.entity_instruments?.[0]?.instrument_id,
        from: moment(new Date(Customdatesval.StartDate)).format(
          "YYYY-MM-DDTHH:mm:ssZ"
        ),
        to: moment(new Date(Customdatesval.EndDate)).format(
          "YYYY-MM-DDTHH:mm:ssZ"
        ),
        metricid: "Fovr,SspeedOvr",
        thresholds: `${instrument?.[0]?.feed_rate_threshold},${instrument?.[0]?.spindle_speed_threshold}`,
      };

      setSelectedDates({ start: Customdatesval.StartDate, end: Customdatesval.EndDate })
      fetchData(ListBody, instrument?.[0]);
    }
  }, [selectedAsset, Customdatesval]);


  // console.log(rawTableData, "rawTableData")
  return (
    <>
      {loading && <LoadingScreenNDL />}
      <Toast type={snType} message={snackMsg} toastBar={snackOpen} handleSnackClose={() => setsnackOpen(false)} ></Toast>
      <div className="p-4">
        <KpiCards >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ParagraphText
              value={"Spindle Speed Analysis"}
              variant="heading-01-xs"
              color="secondary"
            />
            {
              !props.hideToolBar && tableData.length > 0 && <CircularProgress />
            }

          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {tableData.length === 0 ?
                <div style={{ padding: 10, textAlign: "center" }}>
                  <TypographyNDL variant="paragraph-s" value={"No Data Found"} />
                </div> :
                <div ref={speeddivRef} className="p-2"  style={{ width: "100%", height: "100%" }}>
                  <FeedChart Statusdata={speedData} hideToolBar={props.hideToolBar} />
                </div>
              }
            </Grid>
          </Grid>
        </KpiCards>

        <KpiCards style={{ marginTop: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ParagraphText
              value={"Feed Rate Analysis"}
              variant="heading-01-xs"
              color="secondary"
            />
            {
              !props.hideToolBar && tableData.length > 0 && <CircularProgress />
            }
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {tableData.length === 0 ?
                <div style={{ padding: 10, textAlign: "center" }}>
                  <TypographyNDL variant="paragraph-s" value={"No Data Found"} />
                </div> :
                // Object.keys(feedData).length > 0 &&
                <div ref={feeddivRef} className="p-2" style={{ width: "100%", height: "100%" }}>
                  <FeedChart Statusdata={feedData} hideToolBar={props.hideToolBar} />
                </div>
              }
            </Grid>
          </Grid>
        </KpiCards>

        <div className="mt-4">
          {
            tableData.length === 0 ?
              <div style={{ padding: 10, textAlign: "center" }}>
                <TypographyNDL variant="paragraph-s" value={"No Data Found"} />
              </div>
              :

              <EnhancedTable
                headCells={headCells}
                data={tableData}
                rawdata={rawTableData}
                search={true}
                download={true}
                // actionenabled={false}
                // actionenabled={groupby === 1 && !isShowShift ? true : false && !isShowEnergy ? true : false}
                handleEdit={(id, value) => console.log(id, value)}
                enableEdit={false}
                multitable={false}
                tagKey={false}
              // downloadabledata={downloadablecolumn}
              // downloadHeadCells={downloadableheadcells}
              // verticalMenu={true}
              // groupBy={'speed_feed'}
              />
          }
        </div>
      </div>
    </>
  );
});

export default SpeedFeedReport;
