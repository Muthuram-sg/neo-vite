import React, { useState, useEffect,forwardRef,useImperativeHandle } from 'react';
import useQualitydata from "components/layouts/Reports/QualityReport/hooks/useQualitydata";
import Bar from 'components/Charts_new/bar'
import ParagraphText from "components/Core/Typography/TypographyNDL";
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import { useRecoilState } from "recoil";
import { stdDowntimeAsset, stdReportAsset, customdates ,reportProgress } from "recoilStore/atoms";

import moment from 'moment'; 
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next'; 
import KpiCards from "components/Core/KPICards/KpiCardsNDL"

const Piechart = forwardRef((props,ref) =>{
    const { t } = useTranslation();
    const [, setProgress] = useRecoilState(reportProgress); 
    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
    const [selectedAsset] = useRecoilState(stdReportAsset);
    const [overView, setOverView] = useState([]);
    const [customdatesval,] = useRecoilState(customdates); 
    const {  outQualityData,  getdowntimedata } = useQualitydata();
    const [overviewLoading, setOverviewLoading] = useState(false);

     
    useImperativeHandle(ref, () =>
    (
      {
        refreshData: (e,type) => {
            getDefectsList('general');
        }
      }
    )
    )
    useEffect(() => {
        getDefectsList('general')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset,customdatesval])

    const getDefectsList = (type) => {
        let selectedDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        let to = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
        getdowntimedata(downtimeAsset, selectedDate, to)

    }
    useEffect(() => {
        if (outQualityData) {     
            setProgress(false);     
            setOverviewLoading(false); 
            convertToOverview(outQualityData)           
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outQualityData])
    const convertToOverview = (param) => {
        let overview = [];
        // eslint-disable-next-line array-callback-return
        param.map(x => {
            const reason = x && x.prod_reason ? x.prod_reason.reason : "";
            const count = x.quantity;
            const index = overview.findIndex(y => y.name === reason);
            if (index >= 0) {
                let Existcount = overview[index].count;
                Existcount = Number(Existcount) + Number(count);
                overview[index]['count'] = Existcount;
            } else {
                let obj = { name: reason, count: Number(count) };
                overview.push(obj);
            }
        })
        setOverView(overview);
    }
    const overviewRefresh = () => {
        setOverviewLoading(true) 
        getDefectsList('overview');
    }
    return (
        <div >
            <KpiCards  style={{minHeight: '353px'}}>
                <div >
                    <div style={{display:'flex', alignItems:'center'}}>
                        <ParagraphText  value={t("Defects Overview")}  variant="heading-01-xs" color='secondary'/>
                        {overviewLoading ? <CircularProgress style={{ marginLeft: "auto" }} disableShrink size={15} color="primary" /> : (
                            <Button type="ghost" icon={RefreshLight} style={{ marginLeft: "auto"}} onClick={() => overviewRefresh()} size="small">
                            </Button>
                        )}
                    </div>
                    
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={12} style={{ textAlign: 'center' }}>
                            {overView.length > 0 ? (
                                <Bar
                                    height={250}
                                    id={"donut"}
                                    type={"donut"}
                                    data={overView}
                                />
                            ) : (
                                <>
                                            <br></br>
                                            <br></br>
                                            <br></br>
                                            <br></br>
                                    <ParagraphText variant="paragraph-xs" value={t("No Data")} />
                                </>

                            )}
                        </Grid>
                    </Grid>
                </div>
            </KpiCards>
        </div>

    )
})
export default Piechart;