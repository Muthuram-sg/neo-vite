import React from 'react'; 
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import Grid from 'components/Core/GridNDL'  
import { useTranslation } from 'react-i18next'; 
// Child components
import OEEChildDashboard from './OEECardChild/OEEChildDashboard';
import StatusTitle from './OEECardChild/StatusTitle';
import StatusPercent from './OEECardChild/StatusPercent';
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 
import TypographyNDL from "components/Core/Typography/TypographyNDL";  
import useGetTheme from 'TailwindTheme'; 
import PartsStatus from './OEECardChild/PartsStatus';



function OEECardFunction(props){   
    const theme = useGetTheme(); 
    const classes = {
        vertContent: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap:"4px"

        },
        title:{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500, 
            color: theme.colorPalette.primary
        },
        cardTheme:{
            height: "100%", 
            backgroundColor: theme.colorPalette.cards 
        },
        PrimaryTitle:{
            fontWeight: 500,
            color: theme.colorPalette.primary
        },
        OEEPrimarySubTitle:{
            marginTop: 4,
            color: theme.colorPalette.primary
        },
        primarySubTitle:{
            fontWeight: 400,
            color: theme.colorPalette.primary
        },
        PrimaryTitle1:{ 
            fontWeight: 500,
            color: theme.colorPalette.primary,
            paddingTop: 54
        }
    } 
    const { t } = useTranslation(); 
    return(
        <KpiCards> 
                <div className="flex items-center h-[40px]" >
                    <TypographyNDL color='secondary' variant="heading-01-xs" value={t("OEE")}/> 
                        {
                            props.isDryer?props.dryerLoading && <div style={{marginLeft: 10}}><CircularProgress /></div>:props.loading && <div style={{marginLeft: 10}}><CircularProgress  /></div>
                        } 
                </div>
                <div style={{height: 'calc(100% - 95px)',display:'flex',alignItems:'center',justifyContent:'center'}}> 
                <div style={{width: '100%'}}>
                <Grid container spacing={0}>
                    <Grid item xs={8}>
                    <OEEChildDashboard isDryer={props.isDryer} OEE={props.OEEData.OEE} machineAvailablity={props.machineAvailablity} Performance={props.OEEData.Performance} Quality={props.OEEData.Quality}/>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={classes.vertContent}>   
                            <StatusTitle title={t("Availability")}/>
                            <StatusPercent val="1" color={"#EE0E51"} value={props.machineAvailablity}/>
                            <StatusTitle title={t("Performance")}/>
                            <StatusPercent val="2" color={"#5DE700"} value={props.OEEData.Performance}/>
                            <StatusTitle title={t("Quality")}/>
                            <StatusPercent val="3" color={"#00CDDC"} value={props.OEEData.Quality}/>
                        </div>
                    </Grid>
                </Grid> 
                </div>
                </div>

                <div>
                {
                        !props.isDryer&&(
                            <PartsStatus 
                                PartsDifferenceStatus={props.OEEData.PartsDifferenceStatus}
                                PartsDifferenceValue={props.OEEData.PartsDifferenceValue}
                            />
                        
                            )
                    } 
                </div>
        </KpiCards>
    )
}

const OEECard = React.memo(OEECardFunction);
export default OEECard;