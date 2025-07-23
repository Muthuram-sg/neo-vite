import React from 'react';
import Typography from 'components/Core/Typography/TypographyNDL';  
import Grid from 'components/Core/GridNDL' 
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import useTheme from 'TailwindTheme'
import { t } from 'i18next';

// Icons  

function TimeCardFunction(props){  
    const theme=useTheme ()
    const classes = { 
    
        primarySubTitle:{
            fontWeight: 400,
            color: theme.colorPalette.primary
        }
    }
    return(
        <KpiCards >
                {(props.OEEData.entity && props.OEEData.entity.prod_execs) && props.OEEData.entity.prod_execs.length !== 0 &&
                    <Grid container spacing={0}>
                        <Grid item xs={4}>
                            <Typography variant="caption" style={classes.primarySubTitle}>{t("Total Time: ")}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="label-02-s" style={classes.primarySubTitle}>{props.OEEData.theoryProdTime ? parseInt(props.OEEData.theoryProdTime / 60) : 0} mins</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="caption" style={classes.primarySubTitle}>{t("Planned: ")}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="label-02-s" style={classes.primarySubTitle}>{props.OEEData.plannedOperateTime ? parseInt(props.OEEData.plannedOperateTime / 60) : 0} mins</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="caption" style={classes.primarySubTitle}>{t("Active: ")}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="label-02-s" style={classes.primarySubTitle}>{props.OEEData.actualOperateTime ? parseInt(props.OEEData.actualOperateTime / 60) : 0} mins</Typography>
                        </Grid>
                    </Grid>
                }
        </KpiCards>
    )
}
const TimeCard = React.memo(TimeCardFunction)
export default TimeCard;