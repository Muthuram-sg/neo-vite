/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React , {useState} from "react";
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import Charts from "../../components/ChartJS/Chart";
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";


export default function PrimaryChart(props) { 
    const [flowIndex, setflowIndex] = useState(0);
     

    const FlowSwitchList = [
        { id: "Activitywise", value: "Activity", disabled: false },
        { id: "Nodewise", value: "Node", disabled: false },
    ]

    function changeflow(e) {
        setflowIndex(e)
        props.changeflow(e)
    }
    // console.log(props.groupingdata,"groupingdata",props.filtercategories)
    return (
            <Grid item xs={12} >
                < Card elevation={0}  >
                    <div >
                        <div className="flex items-center justify-between" >
                            <Typography variant="heading-01-xs" color='secondary'
                                value={props.chartTitle} />
                            {props.contentswitcher && <ContentSwitcherNDL listArray={FlowSwitchList} contentSwitcherClick={(e) => changeflow(e)} switchIndex={flowIndex} ></ContentSwitcherNDL>}
                        </div>
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={props.charttype}
                                yAxisTitle={props.yAxisTitle}
                                labels={props.filtercategories}
                                data={props.groupingdata}
                                legend={true}
                                renderChild={(val) => props.renderChild(val)}
                                customtooltip={(context) => props.customtooltip(context, props.chartIndex)}
                                datalabels={props.datalabels}
                            />
                        </div>
                    </div>
                </Card>
            </Grid>

    )
}