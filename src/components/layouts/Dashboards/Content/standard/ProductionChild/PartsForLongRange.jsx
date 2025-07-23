import React, { useState, useEffect } from 'react'; 
import Card from "components/Core/KPICards/KpiCardsNDL";
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL'
import Typography from 'components/Core/Typography/TypographyNDL';  
import { useTranslation } from 'react-i18next';
import CustomizedProgressBars from "components/Core/ProgressBar/Progress";  
 

function PartsForLongRange(props) { 
    const { t } = useTranslation(); 
    const [partsRejected, setPartsRejected] = useState([]);
    const [totalReasons, setTotalReasons] = useState(0);

    useEffect(() => {
        setPartsRejected([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.entity_id, props.startDate, props.endDate])

    useEffect(() => {
        let PartsRejectedGroup = []
        //console.log("props.partsData", props.partsData)

        if (props.partsData && props.partsData.length > 0) {

            let partsDataList = props.partsData.map((x, i) => {
                return { ...x, index: props.partsData.length - i }
            })

            // it is used to filter good parts
            let goodParts = partsDataList.filter(obj => !('defect' in obj))

            // it is used to filter rejected parts
            let rejectedParts = partsDataList.filter(obj => obj.hasOwnProperty('defect'))

            let entryObj = {
                reason: "Good Parts",
                count: goodParts.length
            }

            // eslint-disable-next-line array-callback-return
            rejectedParts.map(x => {

                //Find index of specific object using findIndex method.    
                const index = PartsRejectedGroup.findIndex(obj => obj.reason === x.reason_name)

                if (index >= 0) {
                    //Update object's count property.
                    PartsRejectedGroup[index].count = PartsRejectedGroup[index].count + 1
                } else {
                    PartsRejectedGroup.push({ reason: x.reason_name, count: 1 })
                }
            })
            PartsRejectedGroup.push(entryObj)
        }

        let total = PartsRejectedGroup.reduce((totals, slot) => totals + Number(slot.count), 0)
        PartsRejectedGroup.sort((a, b) => b.count - a.count)
        setTotalReasons(total)
        setPartsRejected(PartsRejectedGroup)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.partsData])
   
    const renderPartsRejectForLongRange =()=>{
        if(props.isLongRange){
            if(partsRejected && partsRejected.length > 0 ){
                return (
                    partsRejected.map((s) => {
                        return (
                            <div key={s.reason} style={{ marginTop: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="label-02-s"  value={s.reason}/>
                                    <Typography variant="label-02-s"  value={(isNaN((s.count / totalReasons) * 100) ? 0 : (s.count / totalReasons) * 100).toFixed(2) + "%"}/>
                                </div>
                                <CustomizedProgressBars value={isNaN((s.count / totalReasons) * 100) ? 0 : (s.count / totalReasons) * 100} color={"#0F6FFF"} />
                            </div>
                        )
                    })
                )

            }else{
                return (
                    
                    <Typography style={{ padding: 10, textAlign: "center" }} variant="label-02-s"  value={t("noParts")}/>
                )

            }

        }else{
            return (
                <React.Fragment></React.Fragment>
            )
        }
    }
    return (
        <Card >
            <div >
                <div style={{display: "flex",gap: 40}}>
                    <Typography color='secondary' variant="heading-01-xs" 
                        value={
                        <div style={{display:'flex',alignItems:'center'}}> 
                        {t("Parts")}
                        {props.loading && <div style={{ marginLeft: 10 }}><CircularProgress disableShrink size={15} color="primary" /></div>}
                        </div>
                    }
                    />
                </div>
                <div style={{ maxHeight: props.isDryer ? 662 : 310, height: props.isDryer ? 661 : 308, overflow: "auto", padding: 0 }}>
                <div className="flex justify-end items-start h-full">
                    {renderPartsRejectForLongRange()}
                    </div>
                </div>
            </div>
        </Card>
    )
}
export default PartsForLongRange;