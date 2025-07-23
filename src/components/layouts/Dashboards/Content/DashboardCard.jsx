import React,{useState,useRef,forwardRef, useEffect} from 'react';
import DashboardCardHeader from './DashboardCardHeader';
import DashboardCardContent from './DashboardCardContent';

import { themeMode, dashboardEditMode } from "recoilStore/atoms"
import { useRecoilState } from "recoil";


const DashboardCard = forwardRef(({children,...rest},ref)=>{
 
    const [showChart,setShowChart] = useState(false);
    const [showTable,setShowTable] = useState(false);
    const [cardColor,setcardColor] = useState(undefined);
      const [CurTheme] = useRecoilState(themeMode)
      const [dashEdit] = useRecoilState(dashboardEditMode);
      const [cardColorState, setCardColorState] = useState(undefined); 

   
    const cardContentRef = useRef()
    const cardHeadRef = useRef()
    const classes = {
        card: {width: rest.style.width,height: rest.style.height,background: cardColor}
      }
       useEffect(()=>{
        if(rest.cardrefresh){
            cardHeadRef?.current?.startRefresh();
            cardContentRef?.current?.refreshData()
        }

       },[rest.cardrefresh])
       


       useEffect(()=>{
        
        if(rest.details.type !== 'singleText' && rest.details.type !== 'Text' && CurTheme === 'light'){
            setcardColor('#ffffff')
        }else if(rest.details.type !== 'singleText' && rest.details.type !== 'Text' && CurTheme === 'dark'){
            setcardColor('#191919')
        }else{
            setcardColor(cardColorState)
        }
       },[rest.details.type,CurTheme,cardColorState])
       
    //    useImperativeHandle(ref, () => ({
    //         goLive: (obj)=> cardContentRef.current.goLive(obj)
    //    }))

    return(  
            <div ref={ref} className={`grid-item ${rest.className} `} root={rest.root} style={rest.style} {...rest}>
                <div className='p-4 border-Border-border-50   bg-Background-bg-primary dark:bg-Background-bg-primary-dark dark:border-Border-border-dark-50  border rounded-2xl' style={classes.card}>
                <DashboardCardHeader DelKey={rest.DelKey} ref={cardHeadRef} markers={(data)=>cardContentRef.current.setMarker(data)} refreshcard={(obj)=>cardContentRef.current.refreshData(obj)} dictkey={rest.dictkey} detail={rest.details} showTable={(e)=>setShowTable(e)} showChart={(e)=>setShowChart(e)} width={parseInt(rest.style.width, 10) - 30} height={rest.details.type==='Image'?parseInt(rest.style.height, 10) - 30:parseInt(rest.style.height, 10) - 70}
                    cardColor={cardColor}
                    AlertList={rest.AlertList}
                />
               
                <DashboardCardContent ref={cardContentRef} startRefresh={()=>cardHeadRef?.current?.startRefresh()} endrefresh={(e)=>{cardHeadRef?.current?.endRefresh(e);rest?.cardrefreshoff(false)}} showTable={showTable} showChart={showChart} detail={rest.details} DelKey={rest.DelKey} width={parseInt(rest.style.width, 10) - 30} height={rest.details.type==='Image'? dashEdit ? parseInt(rest.style.height, 10) - 50 : parseInt(rest.style.height, 10) - 30:parseInt(rest.style.height, 10) - 70}
                    cardColor={(e)=>{if(e){setCardColorState(e)}}}
                    typelist={rest.MetricListType}
                    modalOpen={rest.modalOpen}
                    
                >
                
                </DashboardCardContent> 
                </div>
                {children}
            </div>
    )
})

export default DashboardCard;