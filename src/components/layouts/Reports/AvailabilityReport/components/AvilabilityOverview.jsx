import React,{useState,useEffect} from 'react';
import { useRecoilState } from "recoil";
import ParagraphText from 'components/Core/Typography/TypographyNDL'; 
import Grid from 'components/Core/GridNDL'
import Charts from 'components/Charts_new/Chart'
import { useTranslation } from 'react-i18next';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import { customdates } from 'recoilStore/atoms';
import moment from 'moment';   
import ReactApexChart from 'react-apexcharts';

export default function AvailabilityOverview(props){

    const [isActive,SetIsActive] = useState(true);
    const [contentSwitchIndex, setContentSwitchIndex] = useState(0);
    const [average, setAverage] = useState(0)
    const { t } = useTranslation();
    const [customdatesval,] = useRecoilState(customdates);
    const chartData ={
        series:  props.data.column.shifts,
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories:   props.data.column.dates,
                type: 'category',
                tickAmount: 'dataPoints',
              
                labels: { 
                  datetimeUTC: false,
                  formatter: function(value){
                      return moment(new Date(value)).format('DD/MM/yyyy')
            
          }
        }
    },
          yaxis: {
            title: {
              text: "Availability in %"
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val
              }
            }
          }
        }
      }
      useEffect(()=>{
        SetIsActive(true)
        setContentSwitchIndex(0)
      },[props.enableHour])

    useEffect(() => {
        if(props.data.bar.name === 'hourly'){
            if(!isActive){
                props.getDaywiseData(props.tableData,1)
                SetIsActive(true)
            }
        }
        let total=0,avgAvail=0;
        if(isActive){
            if( props.data?.bar.data?.length > 0){
                props.data.bar.data.forEach(avail => {
                    total = total + avail;
                });
                avgAvail = total/props.data.bar.data.length;
                setAverage(avgAvail)
            }
        }  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])


    const buttonList = [
        {id:"day", value:"Day", disabled:false},
        {id:"shift", value:"Shift", disabled:false},
      ]
    
      const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)
          if (e === 0) {
            SetIsActive(true)
            props.getDaywiseData(props.tableData,1)
          }
          else if (e === 1) {
            SetIsActive(false)
            props.getShiftwiseData(props.tableData,1)
          }

    }

    const getCategories = () => {
        if(props.data.bar.name === 'hourly'){
            let hours = [];
            if(moment(new Date(customdatesval.StartDate)).format("HH:mm") !== "00:00"){
                let fromTime = moment(new Date(customdatesval.StartDate), 'HH:mm');
                let toTime = moment(new Date(customdatesval.EndDate), 'HH:mm');
                let duration = moment.duration(toTime.diff(fromTime));
                let diff = duration.hours() == 0 ? 24 : duration.hours();
                let mins = duration.minutes();
                diff = mins > 1 ? diff + 1 : diff;
                for (let i = 0; diff > i; i++) {
                    let result = moment(fromTime).add(i, 'hours').format('YYYY-MM-DD HH:mm')
                    hours.push(result)
                }
            }
            else{
                hours = Array.from({
                    length: 24
                }, (_, hour) => moment({
                    hour: hour,
                    minutes: 0
                    }).format('DD/MM/YYYY HH:mm')
                );
            }
            return hours;
        }
        else
            return props.data.bar.dates
    }
    const renderAvailabilityChart = () =>{
      console.log(isActive,props.data,"data")
        if(props.data?.bar?.dates?.length > 0 || props.data?.column?.dates?.length > 0) {
            if(isActive){
                if( props.data?.bar.data?.length > 0){
                  console.log(props.data.bar.name === 'hourly' ? 'HH:mm' : 'DD/MM/yyyy',"check",props.data.bar.data)
                    return(
                        <Charts
                        height={345}
                        id={"avaailabilityDaywise_chart"} 
                        xaxistype="category"
                        format = {props.data.bar.name === 'hourly' ? 'HH:mm' : 'DD/MM/YYYY'}
                        type={"bar"}
                        categories={ 
                            getCategories()
                        }
                        data={[{
                            name: 'Availability',
                            data:  props.data.bar.data 
                        }]}
                        unit={"Availability in %"}
                        default
                        xTooltip={props.data.bar.name === 'hourly' ? 'HH:mm' : 'DD/MM/YYYY'}
                        annotations={average.toFixed(3)}
                        annotationsColor={"#440059"}
                        annotationsText={`Average Availability : ${average.toFixed(3)}%`}
                      
                        />                                      
                    )
                }
            }
            else{
                if(props.data?.column.dates?.length > 0) {
                    return(
                        <div>
                        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                      </div>
                    )

        
                }
            }

        }
        else{
            return(
              <React.Fragment>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <ParagraphText variant="heading-02-sm" value={"No Data"} />
              </React.Fragment>
            )
        }
    }

    console.log(chartData,"chartData",props.data)
    return(
        <React.Fragment>
   <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center',marginBottom:"8px"}}>
            <ParagraphText  value={t("Availability Overview")} variant='heading-01-xs'
                    color='secondary'  />
            {props.data.bar.name !== 'hourly' && 
                <ContentSwitcherNDL  height={'24px'} width={'75px'} listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={contentSwitchIndex} ></ContentSwitcherNDL>
            }
       </div>
    
        <Grid container spacing={2}>
   
        <Grid item xs={12} sm={12} style={{ textAlign: 'center' }}>
        
            
            {renderAvailabilityChart()}
        </Grid>
    </Grid>
       </React.Fragment>
    )
}