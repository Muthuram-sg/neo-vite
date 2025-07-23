import React from 'react'; 
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import UseGauage from 'components/charts/UseGauge' 
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
// Icons
import ProdRateIcon from 'assets/neo_icons/Dashboard/ProductionRateIcon.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";  
import PartsStatus from './OEECardChild/PartsStatus';
 
function ProductionRateCardFunction(props) {
    const [curTheme] = useRecoilState(themeMode);
    const { t } = useTranslation(); 
    return (
        <KpiCards> 
                <div style={{display:'flex',alignItems:'center',height:"40px"}}>
                    <ProdRateIcon stroke={curTheme === "dark" ? "#FCFCFC" : "#101010"} />
                    <Typography variant="heading-02-xs" value={t("Production Rate")} />
                    {props.loading && <div style={{marginLeft: 10}}><CircularProgress /></div>}
                </div>
                <HorizontalLine variant="divider1" style={{marginBottom: 8}}/>
                {/* <Grid container spacing={0} style={{paddingTop: 35,paddingLeft:30}}> */}
                {/* <Grid item xs={3} style={{justifyContent: 'center',display: 'inline-grid'}}>
                        <Typography variant="body1" className={classes.PrimaryTitle}>{parseInt(props.OEEData.actParts)}</Typography>
                        <Typography variant="caption" className={classes.primarySubTitle}>{t("Actual Parts")}</Typography>
                        <span></span>
                        <span></span>
                        <Typography variant="body1" className={classes.PrimaryTitle1}>{props.OEEData.actcycle ? `${parseFloat(props.OEEData.actcycle).toFixed(2)} sec` : '0 Sec'}</Typography>
                        <Typography variant="caption" className={classes.primarySubTitle}>{"Actual Cycle Time"}</Typography> */}
                {/* <Typography variant="body1" className={classes.PrimaryTitle1}>{props.OEEData.actSetup ? `${parseInt(props.OEEData.actSetup)} Min` : '0 Min'}</Typography>
                        <Typography variant="caption" className={classes.primarySubTitle}>{"Actual Setup Time"}</Typography> */}
                {/* </Grid> */}
                <div style={{height: 'calc(100% - 56px)'}}> 
                    <div style={{height:"75%",display:"flex",justifyContent:"center",alignItems:"center",marginTop:"15px"}}>
                        <UseGauage value={props.OEEData.actParts && props.OEEData.expParts ? parseInt((props.OEEData.actParts / props.OEEData.expParts) * 100) : 0} />
                    </div>
                    <br></br>
                    {/* <Grid item xs={3} style={{justifyContent: 'center',display: 'inline-grid'}}>
                            <Typography variant="body1" className={classes.PrimaryTitle}>{props.OEEData.expParts ? parseInt(props.OEEData.expParts) : 0}</Typography>
                            <Typography variant="caption" className={classes.primarySubTitle}>{t("Planned Parts")}</Typography>
                            <span></span>
                            <span></span>
                            <Typography variant="body1" className={classes.PrimaryTitle1}>{props.OEEData.expCycle ? `${parseFloat(props.OEEData.expCycle).toFixed(2)} Sec` : '0 Sec'}</Typography>
                            <Typography variant="caption" className={classes.primarySubTitle}>{'Expected Cycle Time'}</Typography> */}
                    {/* <Typography variant="body1" className={classes.PrimaryTitle1}>{props.OEEData.expSetup ? `${parseInt(props.OEEData.expSetup)} Min` : '0 Min'}</Typography>
                            <Typography variant="caption" className={classes.primarySubTitle}>{'Expected Setup Time'}</Typography> */}
                    {/* </Grid> */}
                    {/* </Grid> */}
                    {
                        !props.isDryer&&(
                        
                            <PartsStatus 
                                PartsDifferenceStatus={props.OEEData.partDiffStat}
                                PartsDifferenceValue={props.OEEData.partDiffVal}
                            />
                        
                            )
                    } 
                </div> 
        </KpiCards>
    )
}
const isNotRender = (prev, next) => {
    if ((prev.OEEData.actParts) !== next.OEEData.actParts) {
        return false
    }
    else if ((prev.OEEData.actcycle) !== next.OEEData.actcycle) {
        return false
    }
    else if ((prev.OEEData.expParts) !== next.OEEData.expParts) {
        return false
    }
    else if ((prev.OEEData.expCycle) !== next.OEEData.expCycle) {
        return false
    }
    else if ((prev.OEEData.actSetup) !== next.OEEData.actSetup) {
        return false
    }
    else if ((prev.OEEData.expSetup) !== next.OEEData.expSetup) {
        return false
    }
    else if((prev.OEEData.partDiffStat) !== next.OEEData.partDiffStat){
        return false
    }
    else if ((prev.OEEData.PartsDifferenceValue)!== next.OEEData.PartsDifferenceValue){
        return false
    }
    else if(prev.loading !== next.loading){
        return false;
    }else {
        return true
    }
}
const ProductionRateCard = React.memo(ProductionRateCardFunction, isNotRender)
export default ProductionRateCard;