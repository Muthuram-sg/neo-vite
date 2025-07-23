import React,{useState} from 'react';  
import Grid from 'components/Core/GridNDL';
import ClickAwayListener from 'react-click-away-listener';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next'; 
import Button from "components/Core/ButtonNDL";
import moment from 'moment';  
import { useRecoilState } from "recoil";
import { customdates } from "recoilStore/atoms";
// Icons 
import RejectPart from 'assets/neo_icons/Dashboard/reject_part.svg?react';
import AddComments from 'assets/neo_icons/Dashboard/add_comments.svg?react';
import ViewComments from 'assets/neo_icons/Dashboard/view_comments.svg?react'; 
import AddData from 'assets/neo_icons/Dashboard/Add Data.svg?react'; 
import ViewData from 'assets/neo_icons/Dashboard/ViewData.svg?react'; 
import TagNDL from "components/Core/Tags/TagNDL";



function PartCardFunction(props){ 
    const { t } = useTranslation();  
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    const [partComment,setPartComment] = useState('')
    const [commentPopper,setCommentPopper] = useState(false)
    const [customdatesval] = useRecoilState(customdates);
    // handle comments popper
   
    let textColor ="#76A43D"
    if(props.defect){
        textColor = '#BBBBBB'
    }else if(Number(props.expectedCycle) < Number(props.cycleTime)){
        textColor = '#FF5722'
    }

    let cycleTime ='0s'
    if(props.cycleTime){
    cycleTime = props.cycleTime+'s'

    }else if(props.total === props.count){
       cycleTime = 'Progress'
    }
    

    const handleCommentPopper = (e, val) => {
        setPartComment(val);
        setCommentPopper(true);
    }
    
    const handleCommentPopperClose = () => {
        

        if (commentPopper) {
            setCommentPopper(false);
            setPartComment('');
        }
    }
    
    const renderPartsIcon = ()=>{
        if(props.assetType === 13){
            if(props.SteelForm.length > 0 && props.steeldata !== undefined){
                return(
                    <ToolTip title={t('Edit Data')} placement="right" arrow>
                                <Button id={'edit_data' } type={"ghost"} size="small" onClick={() => { props.handleAddData(props) }}
                                    icon={ViewData} />
                            </ToolTip>
                )

            }else{
                return(
                    <ToolTip title={t('Add Data')} placement="right" arrow>
                    <Button id={'add_data' } type={"ghost"} size="small" onClick={() => { props.handleAddData(props) }}
                        icon={AddData} />
                </ToolTip>
                )
            }

        }else{
            return(<React.Fragment></React.Fragment>)
        }
    }
    return (
        <div className='p-2 rounded mb-2.5 cursor-pointer hover:bg-Seconary_Button-secondary-button-hover dark:hover:bg-Secondary_Button-secondary-button-hover-dark'>
        <Grid container spacing={4}  className={"p-2 rounded cursor-pointer hover:bg-Seconary_Button-secondary-button-hover dark:hover:bg-Secondary_Button-secondary-button-hover-dark"} >
            <Grid item xs={8} style={{color: props.defect?"#BBBBBB":"inherit"}}>

            <Typography color={props.defect ? "disable" : 'primary'} variant='label-01-m'  
            value={<React.Fragment>
                 {
                    
                    <span className='font-[16px] leading-[18px] text-Text-text-primary dark:text-Text-text-primary-dark' style={{color:props.defect ? '#BBBBBB' : undefined}}>{`Part `}</span>}
                {
                    
                    <span className='font-[16px] leading-[18px] font-geist-mono  text-Text-text-primary dark:text-Text-text-primary-dark' style={{color:props.defect ? '#BBBBBB' : undefined}}>{`${props.count} •`}</span>}
                    
                    {<span  className='font-geist-mono' style={{color:textColor}}>{props.defect ? " " : `  ${cycleTime}`  }</span>}
                </React.Fragment>}
                />
                <div className='mt-0.5 flex items-center gap-1'>
                <Typography color={props.defect ? "disable" : 'secondary'} variant='paragraph-s' 
                value={"Completed at"}
                />
                 <Typography color={props.defect ? "disable" : 'secondary'} mono variant='paragraph-s' 
                value={moment(props.time).utcOffset(stdOffset).format("HH:mm:ss")}
                />
                </div>
            </Grid>
           
                <Grid item xs={1}>
                        {renderPartsIcon()}
                </Grid>
                {props.assetType !== 13 && 
                <Grid item xs={1}>
                    {
                        props.comment ? (
                            <ClickAwayListener onClickAway={() => handleCommentPopperClose()}>
                                <div>
                                    <ToolTip title={"View Comment"} placement="right" arrow>
                                        <Button id={'reject-part' + props.time} type={"ghost"}  size="small" onClick={(e) => { handleCommentPopper(e, props.comment) }} icon={ViewComments} />
                                    </ToolTip>
                                    {commentPopper &&
                                    <div id={"entitylist-select"} className={`z-20 bg-Background-bg-primary dark:bg-Background-bg-primary-dark rounded-lg shadow w-60 `}
                                    style={{position: 'absolute',width:'150px'}}
                                    
                                    >
                                            <Typography sx={{ p: 2 }} style={{ padding: 5, whiteSpace: "pre-wrap" }} value={partComment}/>
                                    </div>}
                                </div>
                            </ClickAwayListener>
                        ) : (
                            <ToolTip title={"Add Comment"} placement="right" arrow>
                               
                                <Button id={'reject-part' + props.time} type={"ghost"}  size="small" onClick={() => { props.handleComment(props.time) }} icon={AddComments}/>

                            </ToolTip>
                        )

                    }
                </Grid>
                }
                <Grid item xs={2}>
                    {
                        props.defect ? 
                            <div> 
                    <TagNDL
                        name={'Rejected'}
                        colorbg={'error'}
                    />
                      </div>
                        : moment(customdatesval.StartDate).isBefore(moment(moment().subtract(1, 'day')).startOf('day').subtract(1,'second')) ?
                        <div>
                        </div>
                        :
                        (
                            <ToolTip title={t('Reject')} placement="right" arrow>
                                <Button id={'reject-part' + props.time} type={"ghost"} danger size="small" onClick={() => { props.handleReject(props) }}
                                        icon={RejectPart}  />
                            </ToolTip>
                        )
                    }
                </Grid>
            </Grid>
             
        </div>
    )   
}
const isRender = (prev, next) => {
    return prev.defect !== next.defect || prev.comment !== next.comment || prev.count !== next.count || prev.steeldata !== next.steeldata ? false : true ;
}
const PartsListCard = React.memo(PartCardFunction, isRender)
export default PartsListCard;