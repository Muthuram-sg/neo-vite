/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React from "react";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import Typography from "components/Core/Typography/TypographyNDL";
import useTheme from 'TailwindTheme' ;
import CustomizedProgressBars from "components/Core/ProgressBar/Progress";


function Contributors(props) {
   
    const theme = useTheme()
    const total = props.slots.reduce((tot, slot) => tot + Number(slot.value), 0)
    const sortedslots = props.slots.sort((a, b) => b.value - a.value)
    return (
        <KpiCards elevation={0}
            style={{ width: "24%", height: '520px' }}  >

            <div>
                <Typography
                    variant='heading-01-xs'
                       color='secondary'
                    value={"Top Contributors"} />
                {props.energyasset ? 
                sortedslots.map((s) => {
                          // eslint-disable-next-line array-callback-return
                    return (
                        <div style={{ marginTop: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography value={s.name} />
                                <Typography value={(isNaN((s.value / total) * 100) ? 0 : (s.value / total) * 100).toFixed(0) + "%"} />
                            </div>
                            <CustomizedProgressBars value={isNaN((s.value / total) * 100) ? 0 : (s.value / total) * 100} color={s.color} />
                        </div>
                    )
                })
                :
                <React.Fragment>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                <Typography style={{ color: theme.colorPalette.primary, textAlign: 'center' }} value={'Configure Energy Asset in TimeSlot Settings'}/>

                </React.Fragment>
            }
            </div>
        </KpiCards>
    )
}

export default Contributors;
