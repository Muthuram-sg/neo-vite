import React, { useState, useEffect,useRef } from 'react';
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import KpiCards from 'components/Core/KPICards/KpiCardsNDL';
import { useTranslation } from 'react-i18next';
import ImageNDL from 'components/Core/Image/ImageNDL';
import moment from 'moment';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import Button from 'components/Core/ButtonNDL';
import { Chart, registerables } from 'chart.js';
import ZoomPlugin from 'chartjs-plugin-zoom';
import ListNDL from 'components/Core/DropdownList/ListNDL';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import ProgressIndicatorNDL from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import {selectedPlant} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import OpenSeadragonViewer from './OpenSeaDragonViewer';


Chart.register(...registerables,ZoomPlugin);


export default function DefectCard(props) {//NOSONAR
  const { t } = useTranslation();
  const [chartData,setchartData]= useState([])
  const [openGap,setOpenGap] = useState(false); 
  const [AnchorPos,setAnchorPos] = useState(null); 
  const [openGapDetail,setOpenGapDetail] = useState(false); 
  const [AnchorPosDetail,setAnchorPosDetail] = useState(null); 
  const [reset,setReset] = useState(false)
  const defectRef = useRef(null);
  const defectRefDetail = useRef(null)
  const [headPlant] = useRecoilState(selectedPlant);

  

 
  useEffect(() => {
    let data = null;
  
    if (props?.Chardata?.data?.length > 0) {
      // Single side case
      data = {
        datasets: [
          {
            label: (props.ChartData.data[0].board_side === "Left Side" ? "Mirror" : props.ChartData.data[0].board_side) + ' Defects',
            data: props.ChartData&& props.ChartData?.data?.map(x => ({
              x: props.isMorethanDay
                ? moment(x.time).format("YYYY-MM-DD")
                : moment(x.time).format("YYYY-MM-DDTHH:mm:ss"),
              y: x.Defect_length,
            })),
            backgroundColor: '#0F6FFF', // Default color
          }
        ]
      };
    } else if (props.ChartData && typeof props.ChartData === 'object') {
      // Multiple board sides (like Grey, Orange, Red)
      const dynamicBoardSides = Object.entries(props.ChartData).filter(
        ([key, value]) => Array.isArray(value)
      );
  
      const colorPalette = [
        '#0F6FFF', // First color
        '#DA1E28', // Second color
        '#FF832B', // Third color
        '#8A3FFC', // Fourth
        '#24A148', // Fifth
        '#FFB000', // Add more if needed
      ];
  
      data = {
        datasets: dynamicBoardSides.map(([sideName, sideData], index) => ({
          label: `${sideName} Defects`,
          data: sideData&&sideData.map(x => ({
            x: props.isMorethanDay
              ? moment(x.time).format("YYYY-MM-DD")
              : moment(x.time).format("YYYY-MM-DDTHH:mm:ss"),
            y: x.Defect_length,
          })),
          backgroundColor: colorPalette[index % colorPalette.length],
        }))
      };
    }
  
    setchartData(data);

  }, [props.isMorethanDay, props.ChartData]);
  


function optionChange(e) {
  handleDefectChartDownload()
  setOpenGap(!openGap)
  setAnchorPos(null)

}
const handleClose = () => {
  setOpenGap(false)
  setAnchorPos(null)
};

const handleNullPopper = (e) => {
  setOpenGap(!openGap)
  setAnchorPos(e.currentTarget)
}

const handleDefectChartDownload = ()=>{
  html2canvas(defectRef.current)
  .then(function (canvas) {
    canvas.toBlob(function (blob) {
      saveAs(blob, 'Defect_image.jpeg'); // File name for the downloaded image
    }, 'image/jpeg');
  });
}



function optionChangeDetail(e) {
  handleDefectChartDownloadDetail()
  setOpenGapDetail(!openGap)
  setAnchorPosDetail(null)

}
const handleCloseDetail = () => {
  setOpenGapDetail(false)
  setAnchorPosDetail(null)
};

const handleNullPopperDetail = (e) => {
  setOpenGapDetail(!openGap)
  setAnchorPosDetail(e.currentTarget)
}

const handleDefectChartDownloadDetail = ()=>{
  html2canvas(defectRefDetail.current)
  .then(function (canvas) {
    canvas.toBlob(function (blob) {
      saveAs(blob, 'Defect_Detail_image.jpeg'); // File name for the downloaded image
    }, 'image/jpeg');
  });
}


const handleReset=()=>{
  setReset(!reset)
}



  return (
    <React.Fragment>
     
      <Grid container spacing={4}>
        <Grid sm={6}>

          <KpiCards style={{ minHeight: '420px' }} >
            <div className='flex justify-between items-center'>
              <div className='flex gap-2'>
                <Typography value={t("Defect Overview")} variant='heading-01-xs'
                    color='secondary' />
                {
                  props.DefectImageLoading &&
                  <ProgressIndicatorNDL size="medium" />
                }
              </div>
              <div className='flex gap-2 items-center'>
                <Button id='threeDot' type="ghost" icon={RefreshLight} onClick={handleReset} />
                <Button id='threeDot' type="ghost" icon={MoreVertLight} onClick={handleNullPopper} />
            <ListNDL
                                                options={[{id:"download",name:"Download"}]}
                                                Open={openGap}
                                                optionChange={optionChange}
                                                keyValue={"name"}
                                                keyId={"id"}
                                                id={"popper-Gap"}
                                                onclose={handleClose}
                                                anchorEl={AnchorPos}
                                                width="170px"
                                            />
                                            </div>
            
            </div>

      {
        // props.ChartData && ((Array.isArray(props.ChartData.data) && props.ChartData.data.length > 0) )
        props.ChartData &&
  typeof props.ChartData === "object" &&
  Object.keys(props.ChartData&& props.ChartData).some(
    key => Array.isArray(props.ChartData&&props.ChartData[key]) && props.ChartData[key].length > 0
  )
        ?
        <div className='w-full h-[360px]'  ref={defectRef}>
        <Scatter
          data={chartData}
          options={{
            maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
            height: 360, // Set the height of the chart
            scales: {
              x: {
                type: 'time', // Use time scale for x-axis
                time: {
                  unit: props.isMorethanDay ? "day":'hour', // Display units as hours
                  displayFormats: {
                  hour: props.isMorethanDay ? "DD-MM-YYYY":'HH:mm', // Display format as hours:minutes
                  },
                },
                position: 'bottom',
              },
              y: {
                type: 'linear',
                position: 'left',
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                onClick: () => {}, 
              },
              tooltip: {
                callbacks: {
                  title: function (tooltipItem) {
                    if(props.isMorethanDay){
                      return 'Date: ' +moment(tooltipItem[0].parsed.x).format('DD-MM-YYYY'); // Customize the title format as needed
                    }else{
                      return 'Time: ' +moment(tooltipItem[0].parsed.x).format('HH:mm:ss'); // Customize the title format as needed

                    }
                  },
                  label: function (tooltipItem) {
                      return 'Defect Length: ' + tooltipItem.parsed.y.toFixed(2); // Customize the label format as needed
                  },
                },
              },
              datalabels: {
                display: false
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'x',
                },
                zoom: {
                  wheel: {
                    enabled: true,
                    speed:0.1
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                },
                
                
              },
            },
          }}
        />
      </div>
      :
      
      <div className='w-full h-[360px] '>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className='flex justify-center items-center'>
        <Typography   value={props.OptixdataData && props.OptixdataData.length > 0 ? "Select an Asset and Severity and Time range to visualize the data" :"No Data"} variant={'lable-01-m'}  />

        </div>
      </div>

      }
         


          </KpiCards>
        </Grid>
        <Grid sm={6}>
          <KpiCards style={{ minHeight: '420px' }} >
            <div className='flex justify-between items-center'>
            <Typography value={t("Defect Detail")} variant='heading-01-xs'
                    color='secondary' />
            <Button id='threeDot' type="ghost" icon={MoreVertLight} onClick={handleNullPopperDetail} />
            { headPlant.plant_name !== 'mirror_chennai'?
            <ListNDL
                                                options={[{id:"download",name:"Download"}]}
                                                Open={openGapDetail}
                                                optionChange={optionChangeDetail}
                                                keyValue={"name"}
                                                keyId={"id"}
                                                id={"popper-Gap"}
                                                onclose={handleCloseDetail}
                                                anchorEl={AnchorPosDetail}
                                                width="170px"
                                            />:<></>}
                                            </div>
           { props.selectedImageTime &&  (props.baseimage && props.baseimage !== "No Image Found" || headPlant.plant_name === 'mirror_chennai')  && (props.SeverityLevel.includes(props.selectedImageTime.category)) ?
           
           <div className='flex justify-evenly mt-2' ref={defectRefDetail}>
              <div className='flex justify-between flex-col '>

                <Typography value={t("Original")} variant="label-02-m" />
                
                 <div>
                 <Typography value={moment(props.selectedImageTime.time).format('HH:mm:ss DD-MM-YYYY ')} variant="lable-01-s" />
                 <Typography value={props.selectedImageTime.board_side} variant="lable-01-s" />
                 <Typography value={`L-${props.selectedImageTime.Defect_length}mm`} variant="lable-01-s" />
                 <Typography value={`W-${props.selectedImageTime.Defect_width}mm`} variant="lable-01-s" />
                 <Typography value={props.selectedImageTime.category} variant="lable-01-s" />


                 </div>
                


              </div>
              <div className='flex h-[360px] p-2' style={{ width: "100%" }}>
                
               {   headPlant.plant_name === 'mirror_chennai'?<OpenSeadragonViewer tileurl={props.tileurl}/>:<ImageNDL src={props.baseimage} width="100%" alt={'original'} />}
                
                {/* <ImageNDL src={} alt={'Processed'} /> */}
              </div>
              <Typography value={t("Processed")} variant="label-02-m" />



            </div>
                  // eslint-disable-next-line array-callback-return

            : props.baseimage === "No Image Found" ? 
            <div className='w-full h-[360px] '>
            <div className='flex justify-center items-center'>
              <Typography value={props.baseimage} variant="lable-01-m" />
            </div>
          </div>
            
            :
              <div className='w-full h-[360px] '>
         <br></br>
        <br></br>
        <br></br>
        <br></br>
                <div className='flex justify-center items-center'>
                  <Typography value={t("Select an Asset and Time range to view the image")} variant="lable-01-m" />
                </div>
              </div>
           
           }
            
          </KpiCards>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
