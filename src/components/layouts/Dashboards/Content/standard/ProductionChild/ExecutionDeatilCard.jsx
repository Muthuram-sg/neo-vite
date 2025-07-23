import React from 'react';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from 'components/Core/Typography/TypographyNDL';  
import { useTranslation } from 'react-i18next';  
import moment from 'moment';
import useTheme from 'TailwindTheme';
// Icons  
function ExecutionDetailCardFunction(props){  
    const { t } = useTranslation();
    const theme= useTheme()
    const classes ={ 
        cardTheme:{
            height: "100%", 
            backgroundColor: theme.colorPalette.cards 
        },
        horzContent: {
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 30
        }
    }

    
    return(
        <Card elevation={0} style={classes.cardTheme}>
            <div style={{ padding: 0 }}>
                {((props.OEEData.entity && props.OEEData.entity.prod_execs) &&  props.OEEData.entity.prod_execs.length !== 0 )&&(
                    <div style={classes.horzContent}>
                        <Typography style={{ fontWeight: 550 }} value={t("Execution Started")}/>
                        <Typography style={{ marginLeft: 10 }} value={moment(props.OEEData.entity.prod_execs[0].start_dt).format('HH:mm | L')}/>
                        <Typography style={{ marginLeft: 20, fontWeight: 550 }} value={t("Execution Ending")}/>
                        <Typography style={{ marginLeft: 10 }} value={moment(props.OEEData.entity.prod_execs[0].end_dt).format('HH:mm | L')}/>
                        <Typography style={{ marginLeft: 20, fontWeight: 550 }} value={t("WorkOrder")}/>
                        <Typography style={{ marginLeft: 10 }} value={props.OEEData.entity.prod_execs[0].prod_order.order_id}/>
                        <Typography style={{ marginLeft: 20, fontWeight: 550 }} value={t("Operator")}/>
                        <Typography style={{ marginLeft: 10 }} value={props.OEEData.entity.prod_execs[0].userByOperatorId.name}/>
                    </div>) }
                    {
                    !((props.OEEData.entity && props.OEEData.entity.prod_execs) &&  props.OEEData.entity.prod_execs.length !== 0) && (
                        <Typography value={t("NoCurrentExecution")}/>
                    )
                    }
            </div>
        </Card>
    )
}
const ExecutionDeatilCard = React.memo(ExecutionDetailCardFunction)
export default ExecutionDeatilCard;