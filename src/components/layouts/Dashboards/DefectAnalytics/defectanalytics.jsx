/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

import { selectedPlant, defectAnalyticsoptixOptions } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from "components/Core/GridNDL"

import Status from "components/Core/Status/StatusNDL";
import EnhancedTable from "components/Table/Table";
import Donut from 'components/Charts_new/bar'
import useGetDefectsData from '../hooks/useGetDefectsData';
import useGetAnalyticsDefectImage from '../hooks/useAnalyticsDataImage';
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx";
import config from 'config';
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/chart.jsx";



function TimeSlot() {
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setDateRange] = useState({ startDate: '', toDate: '' });
  const [processedData, setProcessedData] = useState([]);

 
  const [tabledata, setTableData] = useState([]);
  const [, setLoading] = useState(false);
  const [shiftOrder, setShiftOrder] = useState({
    goodSheetCount: 0,
    badSheetCount: 0
  })
  const [play, setPlay] = useState(false)
  const [stackedBarResult, setStackedBarResult] = useState([])
  const [modifyDataDsc, setModifyDataDsc] = useState([])
  const [overAllData, setOverAllData] = useState([])
  const [shiftData, setShiftData] = useState([]);
  const [baseimage, setbaseimage] = useState([]);
  const [instrument, setInstrument] = useState("");
  const [optixOption] = useRecoilState(defectAnalyticsoptixOptions);
  const sizeArray = modifyDataDsc && modifyDataDsc.size && modifyDataDsc.size ? JSON.parse(modifyDataDsc.size) : [];
  const statusArray = modifyDataDsc && modifyDataDsc.status && modifyDataDsc.status ? JSON.parse(modifyDataDsc.status) : [];
  const defectQuadrant= modifyDataDsc&&modifyDataDsc.def_quadrants ? modifyDataDsc.def_quadrants.replace(/^\[|\]$/g, "").split(",") :"";


  const defDetails =
    modifyDataDsc &&
      modifyDataDsc.def_details_points &&
      modifyDataDsc.def_details_points.trim() !== ""
      ? modifyDataDsc.def_details_points.replace(/^\[|\]$/g, "").split(",")
      : [];

     

  let isStillShiftEnd = config.DATE_ARR(19, headPlant);
  let toDate = moment().format('YYYY-MM-DDTHH:mm:ss');


  if (toDate < isStillShiftEnd) {
    isStillShiftEnd = moment(isStillShiftEnd).subtract(1, 'day');
  }
  else {
    isStillShiftEnd = moment().startOf('day')

  }

  const shiftdates = common.getShiftBetweenDates(
    isStillShiftEnd,
    moment(),
    headPlant.shift
  );
  const selectedOption = optixOption.option.filter(option => option.id === optixOption.
    value
  );
  
  const getImgURl = selectedOption.length > 0 && selectedOption[0].info && selectedOption[0].info.ImageURL;

  const modifiedUrl = modifyUrl(getImgURl);

  function modifyUrl(url) {
    const cleanedUrl = url;
    return `${cleanedUrl}live/camera`;
  }

  useEffect(() => {
    const instrumentId =
      selectedOption.length > 0 &&
        selectedOption[0].entity_instruments.length > 0
        ? selectedOption[0].entity_instruments[0].instrument_id
        : null;
    setInstrument(instrumentId)

  }, [optixOption])


  const { allDefectsDataLoading, allDefectsData, allDefectsDataerror, getfetchDefectData } = useGetDefectsData();
  const { AnalyticsImageLoading, AnalyticsImageData, AnalyticsImageError, getAnalyticsImage } = useGetAnalyticsDefectImage();

  
  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    getAnalyticsImage(headPlant.schema, modifiedUrl);

  }, 10000);


  useInterval(() => {
    if (instrument && play) {
      let startDate = config.DATE_ARR(19, headPlant);
      startDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss')
      let toDate = moment().format('YYYY-MM-DDTHH:mm:ss');

      if (toDate < startDate) {
        startDate = moment(startDate).subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss');
      }

      setDateRange({ startDate, toDate });

      let body = {
        schema: headPlant.schema,
        instrument_id: instrument,
        from: startDate,
        to: toDate,
      };

      getfetchDefectData(body, play, overAllData);
    }


  }, 10000);

  useEffect(() => {
    if (instrument) {
      let startDate = config.DATE_ARR(19, headPlant);
      startDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss')
      let toDate = moment().format('YYYY-MM-DDTHH:mm:ss');

      if (toDate < startDate) {
        startDate = moment(startDate).subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss');
      }

      setDateRange({ startDate, toDate });

      let body = {
        schema: headPlant.schema,
        instrument_id: instrument,
        from: startDate,
        to: toDate,
      };

      getfetchDefectData(body);
    }

  }, [instrument])

  useEffect(() => {
    getAnalyticsImage(headPlant.schema, modifiedUrl);
  }, [headPlant])


  useEffect(() => {
    if (AnalyticsImageLoading) {
      setLoading(true);
      return;
    }

    if (!AnalyticsImageLoading && AnalyticsImageData && !AnalyticsImageError) {
      const { img } = AnalyticsImageData;

      if (img && typeof img === 'object') {
        const imgArray = Object.values(img).map((image) => `data:image/jpeg;base64,${image}`);

        setbaseimage(imgArray);
        setLoading(false);
      } else {
        console.log('No Images Found or Invalid Format');
        setLoading(false);
      }
    }

    if (AnalyticsImageError) {
      console.error('Error fetching analytics images:', AnalyticsImageError);
      setLoading(false);
    }
  }, [AnalyticsImageLoading, AnalyticsImageData, AnalyticsImageError]);

  useEffect(() => {
    processedrows();
  }, [processedData])

  useEffect(() => {
    if (allDefectsDataLoading) {
      setLoading(true)
      return;
    }

    if (allDefectsData && allDefectsData.length > 0) {
      setPlay(true)
      const dscData = allDefectsData.sort((a, b) => new Date(b.time) - new Date(a.time));
      setModifyDataDsc(dscData[0]);
      setOverAllData(allDefectsData);
    } else {
      console.warn("No defect data available or encountered an error.");
      setModifyDataDsc(null);
      setOverAllData([]);
      setLoading(false);

    }
  }, [allDefectsDataLoading, allDefectsData, allDefectsDataerror]);

  useEffect(() => {
    defDetailsdrows();
  }, [modifyDataDsc?.def_details_points])

  const processedrows = () => {
    let temptabledata = []
    if (processedData && processedData.length > 0) {
      temptabledata = temptabledata.concat(processedData.map((val, index) => {
        if (val) {
          return [
            index + 1,
            val.defectQuadrant ?  val.defectQuadrant :"--",
            val.defectName ? val.defectName : "",
            val.size,
            val.class ? val.class : "",
            val.position ? val.position : ""

          ]

        }
        else return []
      })
      )
    }

    setTableData(temptabledata)
  }
 



  // sheetCount Function
  const getShiftsTime = () => {
    const dynamicShiftArray = shiftdates.map(shift => ({
      ShiftName: shift.name,
      ShiftValue: [],
      shiftStart: new Date(shift.start),
      shiftEnd: new Date(shift.end),
      goodSheet: 0,
      badSheet: 0,
    }));
    overAllData.forEach(dataItem => {
      const itemTime = new Date(dataItem.time);

      dynamicShiftArray.forEach(shift => {
        if (itemTime >= shift.shiftStart && itemTime < shift.shiftEnd) {
          shift.ShiftValue.push(dataItem);
        }
      });
    });

    dynamicShiftArray.forEach(shift => {
      shift.ShiftValue.forEach(dataItem => {
        const qualityAsNumber = Number(dataItem.quality);
        if (!isNaN(qualityAsNumber) && dataItem.quality !== null && dataItem.quality !== undefined && dataItem.quality !== "") {
          if (qualityAsNumber === 1) {
            shift.goodSheet += 1;
          } else if (qualityAsNumber === 0) {
            shift.badSheet += 1;
          }
        }
      });
    });
    const overallCounts = dynamicShiftArray.reduce(
      (acc, shift) => {
        acc.goodSheet += shift.goodSheet;
        acc.badSheet += shift.badSheet;
        return acc;
      },
      { goodSheet: 0, badSheet: 0 }
    );

    setShiftOrder({
      goodSheetCount: overallCounts.goodSheet,
      badSheetCount: overallCounts.badSheet
    });
    setShiftData(dynamicShiftArray)
  };

  // groupStackBar function
  const getStackedBarData = () => {
    const dynamicShiftArray = shiftdates.map(shift => ({
      ShiftName: shift.name,
      defectValue: [],
      shiftStart: new Date(shift.start),
      shiftEnd: new Date(shift.end),
      class: "",
      defectName: "",
      defectDet: "",
      badSheetCount: 0,
    }));

    let tempArray = [];

    overAllData
      .filter(x => x.quality !== "1" && x.def_details_points)
      .forEach(dataItem => {
        const itemTime = new Date(dataItem.time);
        dynamicShiftArray.forEach(shift => {
          if (itemTime >= shift.shiftStart && itemTime < shift.shiftEnd) {
            shift.defectValue.push(dataItem);
          }
        });
      });

    dynamicShiftArray.forEach(deft => {
      deft.defectValue
        .filter(x => x.def_details_points !== "[]" || x.quality !== "1")
        .forEach(x => {
          try {
            let cleanedString = x.def_details_points || '';
            let defDetailsPointsArray = cleanedString.replace(/[\[\]]/g, "").split(",");
            defDetailsPointsArray = defDetailsPointsArray.map(item => `[${item}]`);
            let formattedArray = defDetailsPointsArray.map(item => {
              return item
                .replace(/[\[\]]/g, "")
                .replace(/\$/g, "")
                .split('x');
            });

            if (Array.isArray(formattedArray)) {

              const result = [];
              formattedArray.forEach(y => {
                for (let i = y.length - 2; i < y.length; i += y.length) {
                  const obj = {
                    defectName: y[i],
                    class: y[i + 1],
                  };
                  result.push(obj);
                  deft.defectName = y[i];
                  deft.class = y[i + 1];
                  // }
                }
              })


              tempArray = tempArray.concat(
                result.map(item => ({
                  ...item,
                  ShiftName: deft.ShiftName,
                }))
              );
              let Finalresult = {};
              tempArray.forEach(item => {
                const key = `${item.defectName}_${item.class}_${item.ShiftName}`;
                if (Finalresult[key]) {
                  Finalresult[key].count += 1;
                } else {
                  Finalresult[key] = { ...item, count: 1 };
                }
              });

              const finalArray = Object.values(Finalresult);
              setStackedBarResult(finalArray);
            } else {
              console.warn("Parsed def_details_points is not an array:", defDetailsPointsArray);
            }
          } catch (error) {
            console.error("Error parsing def_details_points:", error, x.def_details_points);
          }
        });
    });

  };

  const overViewConnectivity = [
    {
      "name": "Good Sheet",
      "count": shiftOrder.goodSheetCount ? shiftOrder.goodSheetCount : 0

    },
    {
      "name": "Bad Sheet",
      "count": shiftOrder.badSheetCount ? shiftOrder.badSheetCount : 0
    }
  ]
  if (!shiftOrder.goodSheetCount && !shiftOrder.badSheetCount) {
    overViewConnectivity.push({
      "name": "No Data",
      "count": 100,
    });
  }
  useEffect(() => {
    if (overAllData.length > 0) {
      getShiftsTime();
      getStackedBarData();
    }
  }, [overAllData, headPlant]);


  const defDetailsdrows = () => {
    if (defDetails) {
        let dataArray = Array.isArray(defDetails) ? defDetails : [defDetails];
        let cleanedData = dataArray.map((item) => item.split(/x\$/));
        let defectArray = Array.isArray(defectQuadrant) ? defectQuadrant : [defectQuadrant];
        let mergeArray = [...cleanedData];
        const result = mergeArray
            .map((item,index) => {
                if (Array.isArray(item)) {
                    const position = item.slice(0, 5).join(",");
                    const size = item.slice(5, 7).join(",");

                    return {
                        defectName: item[7] || "--",
                        class: item[8] || "--",
                        size: size || "--",
                        position: position || "--",
                        xCoord: Number(item[2]) || "--",
                        yCoord: Number(item[3]) || "--",
                        defectQuadrant: defectArray[index] || "--", 
                    };
                }
                return null; 
            })
            .filter((entry) => entry !== null); 
        setProcessedData(result);
    } else {
        setProcessedData([]);
    }
};

  

  
 



  const defectNames = [...new Set(stackedBarResult.map(item => item.defectName))];
  const classes = [...new Set(stackedBarResult.map(item => item.class))];
  const shifts = [...new Set(stackedBarResult.map(item => item.ShiftName))];

  const classColors = classes.reduce((acc, name, index) => {
    const colors = ["#F76B15", "#AB4ABA", "#0090FF"]; 
    acc[name] = colors[index]; 
    return acc;
  }, {});

 

  const groupedByShift = shifts.reduce((result, shift) => {
    result[shift] = classes.map(cls => ({
      label: `${cls}`,
      data: defectNames.map(defect => {
        // Sum counts for matching defectName, class, and ShiftName
        return stackedBarResult
          .filter(
            item =>
              item.defectName === defect &&
              item.class === cls &&
              item.ShiftName === shift
          )
          .reduce((sum, item) => sum + item.count, 0);
      }),
      backgroundColor: classColors[cls],
      stack: `shift-${shift.split("_")[1].toUpperCase()}`
    }));
    return result;
  }, {});

  // Flatten grouped datasets for charting
  const datasets = shifts.flatMap(shift => groupedByShift[shift]);

  // Chart data
  const chartDataArray = [
    // {
    //   key: "labels",
    //   value: defectNames 
    // },
    ...datasets.map(dataset => ({
      key: "dataset",
      value: dataset
    }))
  ];

  const headCells = [
    { id: "sno", numeric: false, disablePadding: true, label: "S.No" },
    { id: "quadrant", numeric: false, disablePadding: true, label: "Quadrant" },
    { id: "defectName", numeric: false, disablePadding: true, label: "Defect Name" },
    { id: "Size (mm)", numeric: false, disablePadding: true, label: "Size (mm)" },
    { id: "class", numeric: false, disablePadding: true, label: "Class" },
    { id: "position", numeric: false, disablePadding: true, label: "Position" }

  ];


  const hardcodedDatas = (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>
          <Typography variant='label-01-xs' color="secondary" value={'Total Sheets'} />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
        <Typography mono color="primary" value={overAllData?.length ?? '--'} />
        </div>
      </div>


      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>
          <Typography variant='label-01-xs' color="secondary" value={'Current Sheet ID'} />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
        <Typography mono variant="paragraph-s" value={modifyDataDsc?.sheet_id ?? '--'} />
        </div>
      </div>

      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>
          <Typography variant='label-01-xs' color="secondary" value={'size(width*length)'} />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
          <Typography mono variant="paragraph-s" color="primary"
            value={sizeArray && sizeArray.length > 0 ? sizeArray[0] + " * " + `${sizeArray[1]} mm`: "-- mm"}
          />
        </div>
      </div>

      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>
          <Typography variant='label-01-xs' color="secondary" value={'Thickness'} />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
          <Typography
            mono
            variant="paragraph-s"
            color="primary"
            value={sizeArray && sizeArray.length > 2 && sizeArray[2] ? `${sizeArray[2]} mm` : '-- mm'}
          />
        </div>

      </div>

      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>
          <Typography variant='label-01-xs' color="secondary" value={'Line Speed'} />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
          <Typography
            mono
            variant="paragraph-s"
            color="primary"
            value={modifyDataDsc?.speed ? `${modifyDataDsc.speed} meter/mins` : '-- meter/mins'}
          />
        </div>

      </div>

      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>

          <Typography
            variant="label-01-xs"
            color="secondary"
            value={"Line Running Status"}
            style={{ textAlign: 'left', display: 'block' }}
          />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
          {
            statusArray && statusArray.length ?
            <Status
              name={statusArray && statusArray.length > 0
                ? statusArray[0] === 1
                  ? 'Active'
                  : statusArray[0] === 0
                    ? 'InActive'
                    : ''
                : ''}
              colorbg={statusArray && statusArray.length > 0
                ? statusArray[0] === 1
                  ? 'success-alt'
                  : statusArray[0] === 0
                    ? 'error-alt'
                    : ''
                : ''}
              close
              value={10}
              lessHeight
            /> :<Typography    variant="paragraph-s"  color="primary" value={"N/A"}/>
          }
        </div>
      </div>

      {/* <hr style={{ margin: '0 10px', border: '1px solid #e8e8e8', height: '70px', alignSelf: 'center' }} /> */}
      <div className='border-l border-Border-border-50 pl-2.5 dark:border-Border-border-dark-50'   style={{ flex: 1 }}>
        <div style={{ display: 'block', textAlign: 'left' }}>

          <Typography
            variant="label-01-xs"
            color="secondary"
            value={"Ink Marking Status"}
            style={{ textAlign: 'left', display: 'block' }} // Ensure left alignment
          />
        </div>
        <div style={{ marginTop: '12px', display: 'inline-block', textAlign: 'left' }}>
          {
            statusArray && statusArray.length ?
            <Status
              name={statusArray && statusArray.length > 0
                ? statusArray[1] === 1
                  ? 'Active'
                  : statusArray[1] === 0
                    ? 'InActive'
                    : ''
                : ''}
              colorbg={statusArray && statusArray.length > 0
                ? statusArray[1] === 1
                  ? 'success-alt'
                  : statusArray[1] === 0
                    ? 'error-alt'
                    : ''
                : ''}
              close
              value={10}
              lessHeight
            /> :<Typography    variant="paragraph-s"  color="primary" value={"N/A"}/>
          }

        </div>
      </div>

    </div>
  );


  return (

    <div className="p-4">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card
          style={{
            width: "100%",
            paddingTop: 20,
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 12,
            display: "grid",
            cursor: "pointer",
            gap: "8px", // Uniform gap for inner elements
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {hardcodedDatas}
          </div>
        </Card>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Grid container spacing={3} style={{ marginTop: "5px" }}>
            <Grid item md={5} lg={5}>
              <Card
                style={{
                  height: "450px",
                  margin: "16px",
                  marginLeft: "-3px",

                }}
              >
                <div className="flex p-2 items-center justify-between">

                  <Typography variant="heading-01-xs" color="secondary">
                    Sheet Overview
                  </Typography>

                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 30 }}>
                  {/* Donut Chart Section */}
                  <div style={{ flex: 1, margin: "5px" }}>
                    {overViewConnectivity && overViewConnectivity.length > 0 && (
                      <Donut
                        height={270}
                        id={"donut"}
                        type={"donut"}
                        data={overViewConnectivity}
                        showLegend={false}
                        colors={["#30A46c", "#E5484D", "#A9A9A9"]}
                        isNoData ={!shiftOrder.goodSheetCount && !shiftOrder.badSheetCount}
                      />
                    )}
                  </div>

                  {/* Shift Data Section */}
                  <div style={{ flex: 0.5 }}>
                    {shiftData && shiftData.length > 0 ? (
                      shiftData.map((x, index) => (
                        <div key={index} style={{ marginLeft: "7px", marginBottom: "32px" }}>
                          <div>
                            <Typography variant="label-01-xs" color="secondary" value={x.ShiftName} />
                          </div>
                          <div style={{ marginTop: "4px" }}>
                            <Typography
                              variant="label-01-lg"
                              mono
                              color="primary"
                              value={x.ShiftValue.length ? x.ShiftValue.length : "--"}
                            />
                          </div>
                          <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                            <span style={{ marginRight: "10px" }}>
                              <Typography variant="paragraph-xs" color="secondary" value="Good Sheets" />
                              <b>
                                <Typography mono color="success" value={x.goodSheet ? x.goodSheet : "--"} />
                              </b>
                            </span>
                            <span>
                              <Typography variant="paragraph-xs" color="secondary" value="Bad Sheets" />
                              <b>
                                <Typography mono color="danger" value={x.badSheet ? x.badSheet : "--"} style={{ textAlign: "right" }} />
                              </b>
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Typography variant="label-01-s" color="secondary" value="No shift data available" />
                      </div>
                    )}
                  </div>
                </div>

              </Card>


            </Grid>

            <Grid item md={7} lg={7}>
              <Card
                style={{
                  height: "450px",
                  margin: "16px",
                  marginLeft: "-3px",
                }}
              >
                <div className="flex p-2 items-center justify-between">
                  <Typography variant="heading-01-xs" color="secondary">
                    Defect Statistics
                  </Typography>
                </div>
                <div style={{ height: "350px" }}>
                  <Charts
                    charttype={"shiftbar"}
                    labels={defectNames}
                    // data={[{data:[2,3],label:"class1",stack:"shift-A"},{data:[4,3],label:"class2",stack:"shift-A"},{data:[2,6],label:"class3",stack:"shift-A"},{data:[2,7],label:"class1",stack:"shift-B"}]}
                    legend={true}
                    data={chartDataArray.map(x => x.value)}

                  />
                </div>
              </Card>
            </Grid>
          </Grid>

        </div>

        <div className='border-b border-Border-border-50 pb-4 dark:border-Border-border-dark-50'>
          <Card style={{ width: "100%", padding: "16px", height: "400px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="heading-01-xs" color="secondary" value="Live Cameras" />
            </div>
            <Grid
              container
              spacing={2}
              style={{
                marginTop: "16px",
                height: "calc(100% - 64px)",
              }}
            >
              {baseimage && baseimage.length > 0 ? (
                baseimage.map((images, index) => (
                  <Grid
                    item
                    md={3}
                    lg={3}
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "1px solid #E8E8E8",
                        position: "relative",
                        height: 270
                      }}
                    >
                      {/* Camera Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          backgroundColor: "#f0f0f0",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                          padding: "8px",
                          width: "100%",
                        }}
                      >
                        <div style={{
                          width: "4mm",
                          height: "4mm",
                          backgroundColor:  index === 0 || index === 2 ? "#2f855a" : "#c53030", borderRadius: "50%"}}>

                      </div>
                      <Typography
                        variant="label-01-xs"
                        color="primary"
                        value={`Camera ${index + 1}`}
                        style={{
                          marginLeft: "8px",
                          textAlign: "left",
                        }}
                      />
                    </div>

                    {/* Camera Image */}
                    {images ? (
                      <img
                        src={images}
                        alt={`Thumbnail  ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Typography
                          variant="label-01-xs"
                          color="error"
                          style={{ fontWeight: "bold" }}
                        >
                          No Image Found
                        </Typography>
                      </div>
                    )}
                  </div>
                  </Grid>
            ))
            ) : (
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                variant="label-01-xs"
                color="error"
                style={{ fontWeight: "bold" }}
              >
                No Images Found
              </Typography>
            </Grid>
              )}
          </Grid>

        </Card>
      </div>

      

      <Grid item xs={12} sm={12}>
        <Grid item xs={12} sm={12}>
          <div className="mt-4">
            <div className="float-left pt-4 pl-4 w-full">
              <Typography value={"Previous Sheet Defect Details"} variant="heading-01-s" color="secondary" />
            </div>
          </div>
        </Grid>

        {/* Enhanced Table */}
        <EnhancedTable
          headCells={headCells}
          name="dataTable"
          rawdata={processedData}
          data={tabledata ?? []}
        />

      </Grid>


    </div>
    </div >
  );
};

export default TimeSlot;
