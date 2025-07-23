import React from 'react';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Asset from 'assets/neo_icons/FaultAnalysis/Asset.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import Tag from 'components/Core/Tags/TagNDL';
import moment from 'moment';
import commonfaultanalysis from './common';
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import StatusNDL from 'components/Core/Status/StatusNDL'
import { useRecoilState } from "recoil";
import {
   themeMode
} from "recoilStore/atoms";

function LineCard(props) {
    const [curTheme] = useRecoilState(themeMode)
    
    // Function to parse the time string and convert it to a Date object
    return (
        <React.Fragment>

            <Card
                elevation={0} style={{ cursor: 'pointer', height:"154px" }} onClick={() => props.getChild(props.asset)}>
                <div style={{
                    height: "100%",
                }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center", textAlign:"center",  }}>
                        <Asset  stroke={curTheme ==='dark' ? "#FFFFFF":"#202020"}/>
                        <StatusNDL  lessHeight colorbg={commonfaultanalysis.getTagprops(Number(props.asset.latest_fault_severity))[1] } name={commonfaultanalysis.getTagprops(Number(props.asset.latest_fault_severity))[0] === "No Faults" ? "Normal" : commonfaultanalysis.getTagprops(Number(props.asset.latest_fault_severity))[0]} />

                    </div>
                    <div className="flex flex-col gap-2 items-baseline mt-2"  >
                        <Tooltip
                            title={props.asset.entity_name}
                            placement={'bottom'}
                        >
                            <Typography variant="label-02-s" value={props.asset.entity_name} style={{  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: "250px", textAlign: "left" }}></Typography>
                        </Tooltip>
                        {
                            props.asset.latest_fault_defect_name &&
                            <Tag lessHeight colorbg={"neutral"} name={props.asset.latest_fault_defect_name} />
                        }
                        <Typography variant="paragraph-xs" color={"secondary"} mono value={props.asset.latest_fault_time ? moment(props.asset.latest_fault_time).format("DD/MM/YYYY hh:mm:ss A") : '--'} ></Typography>

                    </div>



                </div>
            </Card >
        </React.Fragment>

    )
}
export default LineCard;