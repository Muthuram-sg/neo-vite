import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
const useGetPartsProduction = () => {
  const [partProductionLoading, setLoading] = useState(false);
  const [partProductionData, setData] = useState(null);
  const [partProductionError, setError] = useState(null);

  const getPartsProduction = async (headplant, data, DateArr,type,perRow,currpage,aggregate) => { 
    setLoading(true);
      let start = DateArr.From
      let end = DateArr.To; 
      const FinalResultFnc=(res)=>{
        let result = [];
        res.forEach(x => result = [...result, ...x]);
        setData({Data :result.flat(), count: result.length});
        setLoading(false);
        setError(false)
      }

      const FinalCatchErr=(e)=>{
        console.log('err2',e);
        setData(e);
        setLoading(false);
        setError(true)
      }
    if((type === 'all' || type === 'approved') && aggregate === 1 ){ 
      Promise.all(data.map(async (val) => {
        let defects=[]
        const param = {
          entity_id: val.entity_id,
          from: DateArr.From,
          to: DateArr.To
        };
        if(type === 'approved'){
          await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
          .then((reasonsData) => {
              if(reasonsData.neo_skeleton_prod_quality_defects.length>0){
                // eslint-disable-next-line array-callback-return
                reasonsData.neo_skeleton_prod_quality_defects.map(v=>{
                  defects.push(moment(v.marked_at).format("YYYY-MM-DD HH:mm:ss.SSS").toString()+'%')
                })  
              }
          })
        }
        const body = {
          schema: headplant.schema,
          instrument_id: val.part_signal_instrument,
          metric_name: val.metric.name,
          start_date: start,
          end_date: end,
          binary: val.is_part_count_binary,
          downfall: val.is_part_count_downfall,
          currpage: currpage,
          perRow : perRow,
          defects_date: defects
        }
        const url = "/dashboards/actualPartSignalQR";
        return configParam.RUN_REST_API(url, body)
          .then(async (response) => {                   
            let parts = []; 
            let count = response.count
            if (response && !response.errorTitle && response.data.length > 0) {
              parts = response.data.map(x=>{
                  let obj1 = {...x};
                  obj1['entity'] = val.entity.name;
                  obj1['entity_id']=val.entity.id;
                  obj1['instrument_type'] = val.metric.instrument_type;
                  return obj1;
              })
               
              await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
                  .then((reasonsData) => {
                  if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
                      let prod_quality_defects = reasonsData.neo_skeleton_prod_quality_defects;
                      prod_quality_defects.forEach(x => {
                      
                      const defected = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.marked_at).toISOString())
                      if (defected >= 0) {
                          parts[defected]['defect'] = true; 
                          parts[defected]['reason'] = x.prod_reason.reason
                          parts[defected]['rejected_id'] = x.id;
                          parts[defected]['user'] =  x.user ? x.user.name : '';
                      }   
                      })
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                  } else {
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                  }
                  if (reasonsData && reasonsData.neo_skeleton_prod_part_comments && reasonsData.neo_skeleton_prod_part_comments.length > 0) {
                      let comments = reasonsData.neo_skeleton_prod_part_comments;
                      comments.forEach(x => {
                      const commented = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.part_completed_time).toISOString())
                      if (commented >= 0) {
                          let savedcomments = ""
                          if (Object.keys(x.param_comments).length > 0) {
                          Object.entries(x.param_comments).forEach((entry) => savedcomments = savedcomments + entry.join(" : ") + "\n")

                          }
                          if (x.comments.replace(/\s/g, '').length > 0) savedcomments = savedcomments + "Generic : " + x.comments
                          parts[commented]['comment'] = savedcomments
                      }
                      })
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                  } else {
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                  }

                  })
                  await configParam.RUN_GQL_API(gqlQueries.getLineWO, {line_id: headplant.id})
                  .then((workorders) => {
                      if(workorders && workorders.neo_skeleton_prod_order && workorders.neo_skeleton_prod_order.length >0){
                          const partscopy = [...parts];
                          parts = partscopy.map(y=>{
                              const yobj = {...y};                          
                              const work_order = workorders.neo_skeleton_prod_order.findIndex(x => moment(y.time).isBetween(moment(x.start_dt), moment(x.end_dt), null, '[]') )                            
                              if (work_order >= 0) {          
                                  const work_arr = workorders.neo_skeleton_prod_order[work_order];  
                                  yobj['product'] = work_arr.prod_product.name; 
                                  yobj['workorder'] = work_arr.order_id 
                                  if(!y.user){
                                      yobj['user'] = work_arr.user.name;
                                  }                                
                              }    
                              return yobj;
                          })
                      }
                  })
              return {parts: parts,count:count}
            } else {
              return {parts: parts,count:count}
            }
          })
          .catch((e) => {
            console.log('err1',e);
            return []
          });
      }))
      .then(Finaldata => { 
        let result = [];
        Finaldata.forEach(x => result = [...result, ...x.parts]);
        if(result.length > 0){
          setData({Data :result.flat(), count: Finaldata[0].count});
        } else{
          setData({Data :[], count: 0})
        }          
        setLoading(false);
        setError(false)
      })
      .catch((e) => { 
        FinalCatchErr(e)
       
      })
      .finally(() => {
        setLoading(false)
      });
    }else if(aggregate === 2 || aggregate === 3 || aggregate === 4 || aggregate === 5){
      Promise.all(data.map(async (val) => {
         
        const body = {
          schema: headplant.schema,
          instrument_id: val.part_signal_instrument,
          metric_name: val.metric.name,
          start_date: start,
          end_date: end,
          binary: val.is_part_count_binary,
          downfall: val.is_part_count_downfall,
          currpage: currpage,
          perRow : perRow,
          defects_date: aggregate,
          entity_id: val.entity_id,
          line_id: headplant.id
        }
        const url = "/dashboards/actualPartSignalQR";
        return configParam.RUN_REST_API(url, body)
          .then(async (response) => {
            let parts2 = []; 
            if (response && !response.errorTitle && response.data.length > 0) {
              parts2 = response.data.map(x=>{
                  let obj2 = {...x};
                  obj2['entity'] = val.entity.name;
                  obj2['entity_id']=val.entity.id;
                  obj2['instrument_type'] = val.metric.instrument_type;
                  return obj2;
              })
            }
            return parts2
          })
          .catch((e) => {
            console.log('err2',e);
            return []
          });
      }))
      .then(Finaldata => { 
        FinalResultFnc(Finaldata)
        
      })
      .catch((e) => { 
        FinalCatchErr(e)
      })
    }else{
      Promise.all(data.map(async (val) => {
        return configParam.RUN_GQL_API(gqlQueries.getQualityReports, {entity_id: val.entity_id,from: DateArr.From,to: DateArr.To})
        .then((reasonsData) => {
          if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
              let quality_defects = reasonsData.neo_skeleton_prod_quality_defects; 
              const defectsArr = quality_defects.map((x,ind) => { 
                  return {
                    defect: true,
                    entity: x.entity.name,
                    time: x.marked_at,
                    part_number: x.part_number?x.part_number:ind+1,
                    reason: x.prod_reason?x.prod_reason.reason:"",
                    rejected_id: x.id,
                    product: x.prod_product?x.prod_product.name:"",
                    workorder: x.prod_order?x.prod_order.order_id:"",
                    user: x.user.name
                  }
              }) 
              defectsArr.sort((a, b) => new Date(b.time) - new Date(a.time));
              return defectsArr
              
          } else { 
            return []
          } 

        })
        .catch((e) => { 
          console.log('err',e)
            setLoading(false);
            setError(e);
            setData(null);
        });
      }))
      .then(Finaldata => {  
        FinalResultFnc(Finaldata)
      })
      .catch((e) => { 
        FinalCatchErr(e)
      })
      
    }
  }; 
  return { partProductionLoading, partProductionData, partProductionError, getPartsProduction };
};



export default useGetPartsProduction;