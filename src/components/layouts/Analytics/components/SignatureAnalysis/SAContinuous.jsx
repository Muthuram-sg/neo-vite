import React, { useEffect } from 'react';
import { useRecoilState } from "recoil";
import { themeMode, SALineData } from "recoilStore/atoms";
import Chart from "react-apexcharts";
import moment from 'moment';
import { useAuth } from "components/Context";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import TypographyNDL from 'components/Core/Typography/TypographyNDL';


export default function SAContinuous(props) {
  const { HF } = useAuth();
  const [curTheme] = useRecoilState(themeMode);
  const [LineSA] = useRecoilState(SALineData);
  const [LineData, setLineData] = React.useState([]);
  const [Dressing,setDressing] = React.useState([])

  const Normalize = (templinedata) => {
    if (props.normalize) {
      templinedata.forEach((s) => {
        let max = Math.max(...s.data.map(o => o.y))
        let tempdata = s.data.map((d) =>
          Object.assign({}, d, { y: (d.y / max).toFixed(4) }))
        s.data = [...tempdata]
      })
      setLineData(templinedata)
    }
    else {
      setLineData(templinedata)
    }
    
  }

  useEffect(() => {
    let series = []
   
    try {
      const unique = [...new Set(LineSA.Data.map(item => item.name))]
      if(LineSA.Data2 && LineSA.superData){ 
        let dressdata = []
        // eslint-disable-next-line array-callback-return
        LineSA.Data2.map(val=>{
         
          dressdata.push({
            x: new Date(val.endTime).getTime(),
            strokeDashArray: 10,
            borderColor: LineSA.MaxMin.length > 0 ? '#FF0D00':'#14D78D'
          },{
            x: new Date(val.startTime).getTime(),
            strokeDashArray: 10,
            borderColor: '#14D78D'
          })
          
        })
        // eslint-disable-next-line array-callback-return
        LineSA.Rejected.map(val=>{
          dressdata.push({
            x: new Date(val.startTime).getTime(),
            x2: new Date(val.endTime).getTime(),
            fillColor: '#ff0d004a',
            label: {
                text: val["Part Quality"],
                position: 'top',
                textAnchor: 'start',
                style: {
                    margin: {
                        left: 30
                    }
                }
            },
            opacity: 10
          })
        })
        
        if(LineSA.superData.length > 0){
          // eslint-disable-next-line array-callback-return
          LineSA.superData[0].data.map(val=>{
            dressdata.push({
              x: new Date(val.time).getTime(),
              label: {
                  text: "Dressing",
                  position: 'end',
                  textAnchor: 'start',
                  
                  style: {
                      margin: {
                          left: 30
                      },
                      color: curTheme === 'dark' ?  '#f9f9f9' :'#202020' ,
                      background: curTheme === 'dark' ? '#202020' : '#f9f9f9' ,
                  }
              },
              borderColor: '#0F6FFF'
            })
          })
          
        }
        setDressing(dressdata)
        
      }
      
      
      unique.forEach((k) => { series = series.concat([{ "name": k, "data": [].concat(LineSA.Data.filter((data) => data.name === k).map((filteredvalues) => filteredvalues.data[0])),"type": LineSA.Data.filter((data) => data.name === k)[0].type }])})
      if (series.length > 0) {
       
        series.forEach((val) => {
          val.data.sort((a, b) => a.x.toString().localeCompare(b.x.toString()))
        })
      }
    }
    catch (err) {
      console.log("SA Continuous err", err)
    }
 
    if (props.normalize) Normalize(series)
    else { setLineData(series) }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LineSA, props.normalize])
  
  return (
    <div  style={{ width: '100%' }}>
      <KpiCards>
        <TypographyNDL value='Signature Analysis' color='secondary' variant='heading-01-xs' />
      <Chart
        height={500}
        options={{
          theme: {
            mode: curTheme
          },
          stroke: {
            width: 3,
            curve: LineSA.stroke,
          },
          chart: { 
            id: "SACon",
            background: '0',
            stacked: false,
            height: 350,
            animations: {
              enabled: false
            },
            zoom: {
              type: 'xy',
              enabled: true,
              autoScaleYaxis: false
            },
            toolbar: {
              show: true,
              autoSelected: 'zoom',
              export: {
                csv: {
                  dateFormatter(timestamp) {
                    return moment(new Date(timestamp)).format('Do MMM YYYY HH:mm:ss:SSS')
                  }
                },
                png: {
                  filename: undefined,
                }
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          annotations: {
              position: 'front',
              xaxis: Dressing
          },
          xaxis: {
            tickAmount: 5,
            labels: {
              hideOverlappingLabels: false,
              formatter: function (val) {
                return moment(val).format(HF.HMSS)
              },
              rotate: 0,
            }
          }, 
          grid: {
            show: true,
            strokeDashArray: 2,
            yaxis: {
                lines: {
                    show: true
                }
            }, 
            xaxis: {
              lines: {
                  show: true
              }
            } 
          },
          yaxis: {
            min: (LineSA.MaxMin.length > 0) ?  (!props.normalize && LineSA.MaxMin[0].min) : undefined,
            max: (LineSA.MaxMin.length > 0) ?  (!props.normalize && LineSA.MaxMin[0].max) : undefined,
          },
          tooltip: {
            shared: true,
            enabled: true,

            x: {
                format: 'dd MMM HH:mm'
            }
        },
        }}
        type={'line'}
        series={LineData} 

                        
      />
      </KpiCards>
     
    </div>
  )
}