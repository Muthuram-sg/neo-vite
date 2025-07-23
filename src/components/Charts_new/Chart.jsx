import React,{useEffect} from 'react';
import Chartapex from "react-apexcharts";
import moment from 'moment';
import { themeMode } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import ApexCharts from "apexcharts";
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import { useAuth } from "components/Context";

function Chart(props){
  const { HF } = useAuth();
  const showTools = props.showTools === false ? props.showTools : true
  const formatYAxisLabel = (value) => {
    if (props.minutes) {
      // Convert seconds to minutes
      const minutes = Math.floor(value / 60);
      return minutes;
    } else {
      return value;
    }
  };

  useEffect(() => {
    if(props.default){
      if((props.data.length > 0) && props.annotations){
        if(!props.annotations && props.annotations !==0){
           if(!props.annotationdisable){
            if(props.annotations){ 
              ApexCharts.exec(props.id, 'clearAnnotations')
            }
           }
        }
    else{ 
      if(props.annotations){ 
        ApexCharts.exec(props.id, 'clearAnnotations')
          ApexCharts.exec(props.id, "addYaxisAnnotation",{
                  y: props.annotations,
                  borderColor: props.annotationsColor ? props.annotationsColor :'#FF0D00',
                  label: {
                    borderColor: props.annotationsColor ? props.annotationsColor :'#FF0D00',
                    style: {
                      color:"#000000",
                      fontSize: '12px',
                      fontWeight: 900,
                    },
                    text:props.annotationsText ? props.annotationsText : 'MTTR :' + props.annotations +"mins",
                  }
          }) 
        
      }
    }
  }
    }else{
      if((props.data.length > 0)){
 
        if(!props.annotations && props.annotations !==0){
           if(!props.annotationdisable){
            if(props.annotations ===null){ 
              ApexCharts.exec(props.id, 'clearAnnotations')
            }
           }
        }
        else{ 
          if(props.annotations){ 
            ApexCharts.exec(props.id, 'clearAnnotations')
              ApexCharts.exec(props.id, "addYaxisAnnotation",{
                      y: props.annotations,
                      borderColor: props.annotationsColor ? props.annotationsColor :'#FF0D00',
                      label: {
                        borderColor: props.annotationsColor ? props.annotationsColor :'#FF0D00',
                        style: {
                          color:"#000000",
                          fontSize: '12px',
                          fontWeight: 900,
                        },
                        text:props.annotationsText ? props.annotationsText : 'MTTR :' + props.annotations +"mins",
                      }
              }) 
            
          }
        }
      }
    }
   


 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.annotations])
    const [curTheme] = useRecoilState(themeMode);
    // function getColors(){
    //   if(props.colorOption)
    //       return;
    //   else{
    //     if (curTheme === "dark") {
    //       return ["#1A90FF"];
    //     } else {
    //       return ["#35A5FF"];
    //     }
    //   }
    // }
    const renderCharts = ()=>{
      if(props.type ==='singletexts'){
        return(
          <Chartapex
                    style={{marginTop: 8}} 
                    width={'100%'}
                    options={{
                    stroke:{
                        width: 1
                    },
                    fill:{
                        type: 'gradient',
                        gradient: {
                        shadeIntensity: 0, 
                        opacityFrom: 0.7, 
                        opacityTo:0.7
                        }
                    },
                    theme: {
                        mode: curTheme
                    },
                    chart: {   
                        background: "0",
                        animations: {
                        enabled: false,
                        dynamicAnimation: {
                            enabled: false,
                        }
                        },
                        sparkline: {
                        enabled: true
                        },
                        type: 'area',
                        stacked: false,
                        zoom: {
                        autoScaleYaxis: true
                        },
                        toolbar: {
                        show: false,
                        autoSelected: 'zoom'
                        }
                    },
                    colors: ["#1A90FF", "#76CA66", "#FBC756", "#F35151"],
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        type:"datetime",
                        show: false,
                        axisBorder: {
                        show: false,
                        },
                        axisTicks:{
                        show: false
                        },
                        labels: {
                        show: false
                        },
                    },
                    yaxis:{
                        show: false,
                        labels:{
                        formatter: (value) => { 
                        if(value!==null){
                          if(props.isDecimal){
                            return value.toFixed(2)
                          }else{
                            return  Math.ceil(value)
                          }

                        }else{
                          return null 
                        }
                         },
                        }
                    },
                    grid:{
                        yaxis:{
                        lines:{
                            show: false
                        }
                        },                
                        xaxis:{
                        lines:{
                            show: false
                        }
                        },
                        padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },  
                    }
                    }}
                    series={props.data&&props.data.length>0?props.data:[]}
                    type="area"
                />
        )

      }else if( props.type==="areaChart" ){
        return(
           <Chartapex
              height={props.height}
              options={{
                  theme: {
                      mode: curTheme
                  },
                  legend: {
                      show: false,
                      position: 'right'
                  },
                  chart: {
                      id: props.id,
                      background: '0',
                      type: 'area',
                      stacked: false,
                      zoom: {
                          autoScaleYaxis: true
                      },
                      toolbar: {
                          show: true,
                          tools:{
                            download:  showTools,
                            selection: showTools,
                            zoom: showTools,
                            zoomin: showTools,
                            zoomout: showTools,
                            pan: showTools,
                            reset: showTools
                          },
                          autoSelected: 'zoom',
                          export: {
                              csv: {
                                  dateFormatter(timestamp) {
                                      return   moment(new Date(timestamp)).format('Do MMM YYYY '+HF.HMSS) 
                                  }
                              }
                          }
                      }
                  },
                  stroke: {
                      width: [4, 0]
                  },
                  dataLabels: {
                      enabled: true,
                      enabledOnSeries: [0]
                  },
                  markers: {
                      size: 0,
                      style: 'hollow',
                  },
                  colors: ["#1A90FF", "#76CA66", "#FBC756", "#F35151"],
                  grid: {
                      show: true,
                      borderColor: curTheme === 'dark' ? '#333333' : '#E6E6E6',
                      strokeDashArray: 2,
                      xaxis: {
                          lines: {
                              show: false,
                          }
                      },
                  },
                  xaxis: {
                      tickAmount: 10,
                      categories: props.xaxisval,
                     
                      tooltip: {
                          enabled: false,
                      },
                      labels: {
                          rotate: props.rotate ? props.rotate : 0,
                          rotateAlways: false,
                          hideOverlappingLabels: true,
                          trim: true,
                          style: {
                              colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                          },
                      }
                  },
                  yaxis: [{
                      opposite: true,
                      min: 0,
                      max: 100,
                      labels: {
                          formatter: (val) => { return `${val} %` }
                      }
                  }, {
                      title: {
                          text: ""
                      },
                      labels: {
                          formatter: (val) => parseFloat(val).toFixed(2),
                          offsetY: 0,
                          showDuplicates: false,
                          style: {
                              colors: curTheme === 'light' ? ["#242424"] : ["#A6A6A6"]
                          },
                      }
                  }
                  ]
              }}
              series={props.data}
          />
        )

      }else{
        return(
          <Chartapex
          style={{ marginTop: 8 }}
          height={props.height}
          width={props.width}
          options={{
            colors: ['#007BFF', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            stroke: {
              colors: ["transparent"],
              width: 5
            },
            xaxis: {
              categories:props.default ? props.categories :props.xaxisval ,
              type: props.xaxistype,
              tickAmount: 'dataPoints',
              labels: { 
                datetimeUTC: false,
                format: props.format,
                // formatter: function(value){
                //   console.log(props.format , props.default,moment(value, "DD/MM/YYYY HH:mm").format(props.format),value,"chart x")
                //   if(props.format && props.default && ! no ){
                //    return moment(value, "DD/MM/YYYY HH:mm").format(props.format)
                //   //  return value
                //   }else{
                //     return value
                //   }
                // }
                formatter: function(value) {
                  // console.log(
                  //     props.format,
                  //     props.default,
                  //     value,
                  //     "chart x"
                  // );
              
                  let parsedDate = moment(value, ["DD/MM/YYYY HH:mm", "YYYY-MM-DD"], true);
                  if (props.format && props.default && parsedDate.isValid()) {
                      return parsedDate.format(props.format);
                  } else {
                    // console.log("enter",value)
                      // console.error("Invalid date:", value);
                      return value;
                  }
              }
                ,
                rotate: 0,
                style: {
                  colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                },
              },
              min: undefined,
              max: undefined
            },
            theme: {
              mode: curTheme,
            },
            chart: { 
              id:props.id?props.id:"",
              background: "0",
              animations: {
                enabled: false,
                dynamicAnimation: {
                  enabled: false,
                },
              },
              type: props.type?props.type:"",
              stacked:props.stacked ? props.stacked : false,
              zoom: {
                enabled: true,
                type: 'x', // Enable zoom on the x-axis
                autoScaleYaxis: true,
              },
              toolbar:{
                show:true,
                autoSelected: "zoom",
                tools: {
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                },
              },
              plotOptions: {
                bar: {
                    columnWidth: '15%', // Adjust the width of the columns
                    rangeBarOverlap: false,
                    rangeBarGroupRows: false
                  },
            },
              events: {
               
                  markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) { 
                      try{
                          if(props.enableComment && props.openComment ){
                              
                              const xcoord = props.data && props.data[seriesIndex] ? props.data[seriesIndex].data[dataPointIndex].x:0
                              const ycoord =props.data && props.data[seriesIndex] ? props.data[seriesIndex].data[dataPointIndex].y :0
                              props.openComment(xcoord,ycoord,props.id?props.id:"")
                              ApexCharts.exec(props.id?props.id:"", "updateOptions", {
                                  markers: {
                                      discrete: [{
                                          seriesIndex: seriesIndex,
                                          dataPointIndex: dataPointIndex,
                                          fillColor: '#000000',
                                          strokeColor: '#000000',
                                          size: 5,
                                          shape: "circle"
                                      }]
                                  }
                              })
                          }
                      }catch(err){
                          console.log("Chart Component marker click Error",err);
                      }                 
                  }
              }
            },
            dataLabels: {
              enabled: false,
            },
            markers: {
              size: 3,
              style: "hollow",
            },
           
            fill: {
              opacity: 1
            },
            grid: {
              show: true,
              padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 4
              },
              borderColor: curTheme === "dark" ? "#333333" : "#E6E6E6",
              strokeDashArray: 1,
              xaxis: {
                lines: {
                  show: true,
                },
              },
            },
            yaxis: {
              title: {
                text: `Unit (${props.unit?props.unit:""})`
              },
              labels: {
                style: {
                  colors: curTheme === "light" ? ["#242424"] : ["#A6A6A6"],
                },
                formatter: formatYAxisLabel,
              },
            },
            tooltip: {
              shared: true,
              enabled: true,
              intersect: false,
              // x: {
              //   formatter: (val) => { 
              //     console.log(props.xTooltip ,val, props.xTooltip 
              //       ? moment(val, "DD/MM/YYYY HH:mm").format(props.xTooltip) 
              //       : moment(val, "DD/MM/YYYY HH:mm").format("HH:mm"),"chart tooltip")

              
              
              //     return props.xTooltip 
              //     ? moment(val, "DD/MM/YYYY HH:mm").format(props.xTooltip) 
              //     : moment(val, "DD/MM/YYYY HH:mm").format("HH:mm");
              
              //   }
              // //   formatter: (val) => { 
              // //     // First, parse val using multiple date formats to handle both cases
              // //     const parsedDate = moment(val, ["DD/MM/YYYY HH:mm", "DD/MM/YYYY", "YYYY-MM-DD"], true);
              
              // //     // Log the parsed result and output to check the format
              // //     console.log(
              // //         props.xTooltip, 
              // //         val, 
              // //         props.xTooltip 
              // //         ? parsedDate.isValid() ? parsedDate.format(props.xTooltip) : "Invalid date" 
              // //         : parsedDate.isValid() ? parsedDate.format("HH:mm") : "Invalid date",
              // //         "chart tooltip"
              // //     );
              
              // //     // Return the formatted date if valid, or "Invalid date" otherwise
              // //     return props.xTooltip
              // //         ? parsedDate.isValid() ? parsedDate.format(props.xTooltip) : "Invalid date"
              // //         : parsedDate.isValid() ? parsedDate.format("HH:mm") : "Invalid date";
              // // }
              
              
              // },
              y: {
                formatter: function (value) {
                  if (props.isDecimal) {
                    if (value) {
                      return value.toFixed(2);
                    } else {
                      return 0;
                    }
                  } else {
                    if (value && props.minutes) {
                      return Math.ceil(Math.floor(value / 60));
                    }
                    else if(value){
                      return Math.ceil(value);
                    } else {
                      return 0;
                    }
                  }
                  
                },
              },
            },
          }}
          series={props.data&&props.data.length>0?props.data:[]}
          type={props.type?props.type:""}
          />
        )
      }
    }
    const labelFormats = props.labelFormat?props.labelFormat:"HH:mm"
    return(
        <React.Fragment>
        {
            props.type==="singletext"&&(                 
                <div style={{textAlign: "center"}}>
                    <ParagraphText variant="heading-01-lg" value={`${props.latestValue?props.latestValue:"No Data"} ${props.latestValue&&props.unit?props.unit:""}`}></ParagraphText>
                    <ParagraphText variant="heading-01-lg" value={`${props.latestTime ? moment(props.latestTime).format(labelFormats) : ""}`}></ParagraphText>                
                </div>
            )
        }
        <div>
        {renderCharts()}
         
        
      </div>
      </React.Fragment>
    )
}
export default Chart;