import React,{useState,useImperativeHandle,useEffect,forwardRef} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL';
import KpiCardsNDL from 'components/Core/KPICards/KpiCardsNDL';
import PDF from 'assets/neo_icons/Explore/pdf.svg?react';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import useGetSelectedAssetCalendarData from '../hooks/useGetSelectedCalendarData';
import moment from 'moment';


const  CalendarPreviewModel=forwardRef((props,ref)=>{

    const [fileUploadDialog, setDialog] = useState(false);
    const [assertName,setassertName] = useState('')
    const [selectedDate,setselectedDate] =useState({month:'',year:''})
    const [modelData,setmodalData] = useState([])
    const [loading,setloading] = useState(true)
    const { GetSelectedAssetCalendarDataLoading, GetSelectedAssetCalendarDatadata, GetSelectedAssetCalendarDataerror, getGetSelectedAssetCalendarData } =useGetSelectedAssetCalendarData()
   




    const getStartAndEndOfMonth = (monthName, year) => {
        // Parse the month name and year to a moment object
        const date = moment(`${monthName} ${year}`, 'MMMM YYYY');
      
        // Get the start and end of the month
        const startOfMonth = date.startOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
        const endOfMonth = date.endOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
      
        return {start:startOfMonth,end: endOfMonth };
      };

    useImperativeHandle(ref, () => ({
        openDialog: (month,asset) => {
            setTimeout(()=>{
                setDialog(true);
            },[400])
            setassertName(asset.name)
            setselectedDate({month:month,year:asset.selectedYear})
            getGetSelectedAssetCalendarData(asset.id,getStartAndEndOfMonth(month,asset.selectedYear).start,getStartAndEndOfMonth(month,asset.selectedYear).end)
        },
      
    })) 

useEffect(()=>{
    if(!GetSelectedAssetCalendarDataLoading && GetSelectedAssetCalendarDatadata && !GetSelectedAssetCalendarDataerror){
        // console.log(GetSelectedAssetCalendarDatadata,"GetSelectedAssetCalendarDatadata")
        setmodalData(GetSelectedAssetCalendarDatadata.filter(x=>x.report_type === props.selectedReportType))
        setTimeout(()=>{
            setDialog(true);
        },[1000])
    }else{
        setloading(false)
    }

},[GetSelectedAssetCalendarDataLoading, GetSelectedAssetCalendarDatadata, GetSelectedAssetCalendarDataerror])

    

    const handleCloseDialog=()=> {
        setDialog(false);
        setmodalData([])
    }

   
    return(
        <ModalNDL onClose={handleCloseDialog}  open={fileUploadDialog}>
              <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={`${assertName} - ${selectedDate.month + " " + selectedDate.year}`} />
          
            </ModalHeaderNDL>
            <ModalContentNDL>
                {
                    loading ?
                        <div className='flex items-center justify-center'>
                            <CircularProgress  />
                        </div>
                        : modelData.length > 0 ? 
                        modelData.sort((a, b) => new Date(b.upload_date) -  new Date(a.upload_date) ).map((x)=>{
                            return(
                                <KpiCardsNDL style={{marginBottom:"16px"}}>
                                <div className='flex justify-between items-center '>
                                    <div className='flex gap-2 items-center'>
                                        <PDF />
                                        <div>
                                            <TypographyNDL value={x.path_name} style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",width:'400px'}} variant="label-01-xs" />
                                            <TypographyNDL value={moment(x.upload_date).format('YYYY/MM/DD')} mono variant="paragraph-xs" color='secondary' />
                                        </div>
                                    </div>
                                    <div className='flex gap-2 items-center' >
                                        <Button value="View" type="ghost" onClick={()=>{props.handleViewPDF('',x)}} />
                                        <Button icon={Download} type="ghost" onClick={()=>{props.handleViewPDF('',x,'download')}}/>
    
    
                                    </div>
                                </div>
                            </KpiCardsNDL>
                            )
                          
                        })
                      
                        :
                        !loading ? 
                        <div className='flex justify-center items-center'>
                        <TypographyNDL value="No Reports Available for this month" variant="lable-01-m" />
                        </div>
                     :
                     ''

                }
               
                
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button  value={'Close'} type={'secondary'} onClick={handleCloseDialog} />
            </ModalFooterNDL>
            </ModalNDL>

    )
}
)

export default CalendarPreviewModel 