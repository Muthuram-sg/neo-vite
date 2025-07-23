import { useState } from "react";
import configParam from "config";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import moment from "moment";
import { useRecoilState } from "recoil";
import {instrumentsArry,currentDashboard} from "recoilStore/atoms";

const useFetchDashboardData = () => {
    const [fetchDashboardLoading, setLoading] = useState(false); 
    const [fetchDashboardError, setError] = useState(null); 
    const [fetchDashboardData, setData] = useState(null); 
    const [instrumentList] = useRecoilState(instrumentsArry);
    const [selectedDashboard] = useRecoilState(currentDashboard);

    const getfetchDashboard = async (url,body,metricField,play,exist,formula,lastTime) => {
        setLoading(true); 
        let start = body.from;
        let end = body.to
        if(play){
          if(selectedDashboard[0].dashboard.isCustomInterval && selectedDashboard[0].dashboard.interval){
            start = moment().subtract(Number(selectedDashboard[0].dashboard.interval) + 2, 'seconds').format("YYYY-MM-DDTHH:mm:ssZ");
            end =  moment().subtract(2, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
            
          }else{
            start = moment().subtract(62, 'seconds').format("YYYY-MM-DDTHH:mm:ssZ");
            end =  moment().subtract(2, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
          }
           
        } 

        body['from'] = start;
        body['to']= end;
        if(formula){
            // eslint-disable-next-line no-useless-escape
            let arithmetic = formula.split(/([-+*\/()])/g);
            // eslint-disable-next-line no-useless-escape
            let re = '-+*\/()';
            let instrument = arithmetic.filter(x => !re.includes(x))
            // eslint-disable-next-line array-callback-return
            return Promise.all(instrument.map(async (val, i) => {
                const inst = val.split(".")[0];
                const metric = val.split(".")[1];
                body = {...body, instrument : inst.replaceAll(' ', ''),metric : metric}
              let arr1 = [];
              const instruName = instrumentList.filter(int => int.id === val.split(".")[0].replaceAll(' ', ''))
              await configParam
                .RUN_REST_API("/dashboards/getdashboard", body)
                .then((res) => {
                  if (res && !res.errorTitle) {
                    // eslint-disable-next-line array-callback-return
                    res.data.map(valt => {
                      arr1.push({
                        time: valt.time,
                        iid: valt.iid,
                        key: instruName[0].name + " - " + valt.key,
                        value: valt.value,
                        name:valt.name
                      });
                    })

                  }
                })
                .catch(error => console.log('get Dashboard Details error', error));
              return arr1;
            })
            ).then(offdata => {

              let data2 = [];
              offdata.forEach(x => {
                data2 = [...data2, ...x]
              });
              let uniqdate = [...new Set(data2.map(item => item.time))];

              let finalarr = []
              // eslint-disable-next-line array-callback-return
              uniqdate.forEach(val => {

                let text = ''
                // eslint-disable-next-line no-useless-escape
                let opt = '-+*\/()';
                let obj = {}
                // eslint-disable-next-line array-callback-return
                arithmetic.forEach((val2, i) => {
                  const arr = data2.filter(x => x.time === val && x.iid.includes(val2.split(".")[0].replaceAll(' ', '')))[0]
                  if (opt.includes(val2)) {
                    text += val2
                  } else {
                    if (i > 0) {
                      let conditionValue = val2[i - 1] === '-' ? arr.value.replace(/-/g, "") : arr ? arr.value : 0
                      text += arr ? conditionValue : 0
                    } else {
                      text += arr ? arr.value : 0
                    }

                  }
                  if (arr) {
                    obj["time"] = arr.time
                    obj["iid"] = arr.iid
                    obj["key"] = 'formula'
                    obj["name"] = arr.name
                    text = text.replace('--', '-');
                    text = text !== 'null' ? text : '0';
                    // eslint-disable-next-line no-eval
                    let total = calcFormula(text);
                    // eslint-disable-next-line no-eval
                    obj["value"] = total > 0 ? Number(calcFormula(text).toFixed(2)) : null
                    finalarr.push(obj)
                  }
                }) 
              }) 
              setLoading(false);
              setError(false);
              setData(finalarr);

              
            })
        }else{ 
            if((body.type === 'line' || body.type === 'stackedbar' || body.type === 'groupedbar' || body.type === 'combobar' || body.type === 'correlogram') && Object.keys(metricField).length>0){
              //  console.log(metricField,"metricField",body)
                Promise.all(Object.keys(metricField).map(field=>{
                    let instrument = metricField[field].instrument;

                    let MetList = metricField[field] && metricField[field].metric && metricField[field].metric.map(x=> x.split('-')[0]);   
                    let metric
                    if((body.isConsumption && body.type !== 'stackedbar') || (body.isConsumption && body.type !== 'groupedbar')){
                      metric= MetList.filter(f=> f!=='kwh').toString()
                    }else{
                      metric =MetList.toString()
                    }
                    let params = { 
                        schema: body.schema,
                        instrument:  instrument || null,
                        metric:  metric || null,
                        type: body.type,
                        from: start,
                        to: end,
                        isConsumption: body.isConsumption
                    }
                    if((body.group_by !== "none" || body.aggregation !== "none" )&& body.line_id){
                        params.line_id = body.line_id 
                    }
                    if(body.group_by !== "none" && body.group_by !== undefined){
                        params.group_by = body.group_by;
                    }
                    if(body.aggregation !== "none"&& body.aggregation !== undefined){
                        params.aggregation = body.aggregation;
                    }
                    // console.log(body,params)
                    return configParam.RUN_REST_API(url, params) 
                    .then((response) => {  
                        const instruName = instrumentList.filter(int => int.id === instrument)
                        if (response && !response.errorTitle) {
                            let filteredArr = [...exist]; 
                            if(response.data && response.data.length > 0){                              
                              filteredArr = filteredArr.filter(x => moment(x.time) > moment(lastTime));
                            } 
                            let resData = response.data ? response.data : []
                            let result = play ? [...filteredArr,...resData] : resData; 
                            let arr=[]
                            // eslint-disable-next-line array-callback-return 
                            result.forEach(val => {
                              arr.push(!val.instument && instrument === val.iid
                                ? {
                                    time: val.time,
                                    iid: val.iid,
                                    key: val.key,
                                    instrument: instruName.length>0 ? instruName[0].name : '',
                                    value: val.value,
                                    name:val.name
                                  }
                                : val
                              );
                            }); 
                            return arr
                        }
                        else{
                            return play?exist:[];
                        }
                    })
                    .catch((e) => {
                        console.log("NEW MODEL", "ERR", e, "Reports", new Date())
                        return play?exist:[];
                    });
                }))
                .then(data=>{ 
                    let merged = [];
                    // eslint-disable-next-line array-callback-return
                    data.forEach(x=>{
                        merged = [...merged,...x];
                    })
                    setLoading(false);
                    setError(false);
                    setData(merged);
                })
            }
            if(body.type !== 'line' && body.type !== 'correlogram' && body.type !== 'stackedbar' && body.type !== 'groupedbar' && body.type !== 'combobar' && body.type !== 'Table'){ 
                
                if(body.type === 'alerts'){ 
                    configParam.RUN_REST_API(url, body, '', '', 'POST')
                    .then(response => {
                        if (response && !response.errorTitle) {
                            let resData = response.data ? response.data : []
                            const result = play?[...exist,...resData]:resData;
                            setData(result)
                            setError(false)
                            setLoading(false)
                        }
                        else{
                        setData(null)
                        setError(true)
                        setLoading(false)
                        }
                    })
                    .catch((e) => {
                        setLoading(false);
                        setError(e);
                        setData(null);
                        console.log("NEW MODEL", "ERR", e, "Reports", new Date())
                    });
                }else{
                    await configParam.RUN_REST_API(url, body) 
                    .then((response) => { 
                        if (response && !response.errorTitle) {
                            let filteredArr = [...exist];
                            // console.log(filteredArr,'beforefilteredArr', moment(lastTime)) 
                            if(response.data && response.data.length > 0){                              
                              filteredArr = filteredArr.filter(x => moment(x.time) > moment(lastTime));
                            }
                            // console.log(play,filteredArr,'filteredArr')
                            let resData = response.data ? response.data : []
                            const result = play?[...filteredArr,...resData]:resData;
                            let arr=[]
                            result.forEach(val => {
                              arr.push({
                                    time: val.time,
                                    iid: val.iid,
                                    key: val.key,
                                    instrument: instrumentList.filter((x) => x.id === body.instrument)?.[0]?.name ,
                                    value: val.value,
                                    name: val.name
                                  });
                              return arr
                            });
                          //  console.log(arr,'dataarr') 
                            // setData(result)
                            setData(arr)
                            setError(false)
                            setLoading(false)
                        }
                        else{
                        setData(null)
                        setError(true)
                        setLoading(false)
                        }
                    })
                    .catch((e) => {
                        setLoading(false);
                        setError(e);
                        setData(null);
                        console.log("NEW MODEL", "ERR", e, "Reports", new Date())
                    });
                }
                
            }
            if(body.type === 'Table' && Object.keys(metricField).length>0){
             
              
                  metricField = Object.keys(metricField)
                        .filter(key => metricField[key].hasOwnProperty('instrument'))
                        .reduce((obj, key) => {
                            obj[key] = metricField[key];
                            return obj;
                        }, {});

                    // console.log(metricField,"hook Table Data")
                
             
          let metricInstruments = {};
          Object.keys(metricField).forEach(field => {
              let MetList = metricField[field] && metricField[field].metric && metricField[field].metric.map(x => x.split('-')[0]);
              let metricKey = MetList.toString();  
              if (!metricInstruments[metricKey]) {
                  metricInstruments[metricKey] = [];
              }
              metricInstruments[metricKey].push(metricField[field].instrument);
          });
          // console.log(metricInstruments,'metricInstruments')

         

          Promise.all(Object.keys(metricInstruments).map(field => {
             
              
        
             
          
              let instruments = metricInstruments[field].join(','); // Get instruments in comma-separated format
            
              
              let metric;
              if (body.isConsumption) {
                  metric = field.filter(f => f !== 'kwh').toString();
              } else {
                  metric = field.toString();
              }
          
              let params = {
                  schema: body.schema,
                  instrument: instruments || null,
                  metric: metric || null,
                  type: body.type,
                  from: start,
                  to: end,
                  isConsumption: body.isConsumption
              };
          
          
          
              if (body.aggregation !== "none" && body.line_id) {
                  params.line_id = body.line_id;
              }
              if (body.group_by !== "none" && body.group_by !== undefined) {
                  params.group_by = body.group_by;
              }
              if (body.aggregation !== "none" && body.aggregation !== undefined) {
                  params.aggregation = body.aggregation;
              }
          
             
          
              return configParam.RUN_REST_API(url, params)
                  .then((response) => {
             
                      const instrumentIds = instruments.split(',');
                 
                      const instruNames = instrumentList.filter(int => instrumentIds.includes(int.id.toString()));
                   
          
                      if (response && !response.errorTitle) {
                          let filteredArr = [...exist];
                          
                          if (response.data && response.data.length > 0) {
                              filteredArr = filteredArr.filter(x => moment(x.time) > moment(lastTime));
                          }
                          // console.log(filteredArr,play,"filtered")
                          let resData = response.data ? response.data : []
                          let result = play ? [...filteredArr, ...resData] : resData;
                    
          
                          let arr = [];
                          // eslint-disable-next-line array-callback-return 
                          result.forEach(val => {
                              if (!val.instument && val.iid && instrumentIds.includes(val.iid.toString())) {
                                  const matchedInstruNames = instruNames.filter(instru => instru.id.toString() === val.iid.toString());
                                  arr.push({
                                      time: val.time,
                                      iid: val.iid,
                                      key: val.key,
                                      instrument: matchedInstruNames.length > 0 ? matchedInstruNames[0].name : '',
                                      value: val.value,
                                    //  name: val.name
                                  });
                              } else {
                                  arr.push(val);
                              }
                          });
                      
                          return arr;
                      } else {
                          return play ? exist : [];
                      }
                  })
                  .catch((e) => {
                      console.log("NEW MODEL", "ERR", e, "Reports", new Date());
                      return play ? exist : [];
                  });
          }))
          
.then(data => {
  // console.log(data,'data')
  const flattenedData = data.reduce((acc, curr) => {
    if (curr !== null && curr !== undefined) {
        return acc.concat(curr);
    }
    return acc;
}, []);


let merged = [];
flattenedData.forEach(x => {
    merged = [...merged, x];
});

// console.log(merged, "merged");
    setLoading(false);
    setError(false);
    setData(merged);
});

            }
        }
    };
    return {  fetchDashboardLoading, fetchDashboardData, fetchDashboardError, getfetchDashboard };
};

export default useFetchDashboardData;