import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useQualityDefects = () => {
    const [qualDefLoading, setLoading] = useState(false);
    const [qualDefData, setData] = useState(null);
    const [qualDefError, setError] = useState(null);

    const getQualityDefects = async (data, start_date, end_date,ExeData) => {
        setLoading(true);
        let DatesArr = [] 
        if(ExeData && ExeData.length>0){ 
          let WOArr = []
          ExeData.forEach((d,i)=>{ 
            WOArr.push({...data[0],wo_start: d?.jobStart, wo_end: d?.jobEnd, prod_order:d?.orderid})
          })
          DatesArr = WOArr
          DatesArr.sort((a, b) => new Date(b.wo_start) - new Date(a.wo_start));
        }else{
          DatesArr = data
        }
        Promise.all(DatesArr.map(async (val) => {
        return configParam.RUN_GQL_API(gqlQueries.getAssetQualityDefects, { asset_id: val.entity_id, from: val.wo_start ? val.wo_start : start_date, to: val.wo_end ? val.wo_end : end_date })
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_quality_defects) {
                    let qualityLoss = 0
                    let reason = [];
                    oeeData.neo_skeleton_prod_quality_defects.forEach((value) => {
                        qualityLoss = qualityLoss + parseInt(value.quantity)
                        reason.push(value.prod_reason.reason);
                    })
                    return { data: oeeData.neo_skeleton_prod_quality_defects, loss: qualityLoss,reasons: reason }
                }
                else{
                 return { data: [], loss: 0,reasons: [] }
                }
            })
            .catch((e) => {
                return e;
            });
        }))
          .then(Finaldata => {
            if(ExeData && ExeData.length > 0){
              let loss = Finaldata.map(s=> s.loss).reduce((a,b)=> a+b,0) 
              let dataArr = [] 
              let reasons = []
              
              Finaldata.forEach(s=> {
                dataArr = [...dataArr,...s.data] 
                reasons = [...reasons,...s.reasons] 
              })
              let Finalarr = [{ data: data, loss: loss, reasons: reasons}]
              console.log(Finaldata,"getQualityDefects",Finalarr)
              setData(Finalarr);
            }else{
              setData(Finaldata);
            } 
            setError(false)
          })
          .catch((e) => {
            setData(e);
            setError(true)
          })
          .finally(() => {
            setLoading(false)
          });

    };
    return { qualDefLoading, qualDefData, qualDefError, getQualityDefects };
};

export default useQualityDefects;