import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { currentPage, alarmFilter, categoryFilter, OverviewType, alarmCurrentState,ErrorPage , alarmTabValue} from "recoilStore/atoms";
import { useRecoilState } from "recoil"; 
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Grid from 'components/Core/GridNDL'
import AlarmsDateRange from "./components/AlarmsDateRange";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import AlarmOverview from "./Overview/components/Overview";
import AlarmRules from "./AlarmRulesIndex";
import  Typography  from "components/Core/Typography/TypographyNDL"; 

export default function AlarmIndex() {
  const { t } = useTranslation();
  let {moduleName,queryParam} =useParams()
  const [RuleTypeParam,setRuleTypeParam] = useState('')
  const [tabValue, setTabValue] = useRecoilState(alarmTabValue);
  const [, setCurPage] = useRecoilState(currentPage);
  const [currentState] = useRecoilState(alarmCurrentState)
  const [, setAlarmFilterType] = useRecoilState(alarmFilter);
  const [,setErrorPage] = useRecoilState(ErrorPage)
  const [, setCategoryFilterType] = useRecoilState(categoryFilter);
  const [, setOverviewType] = useRecoilState(OverviewType)
  const [overviewFilter, setOverviewFilter] = useState('alert')
  const [selectedAlarmType, setSelectedAlarmType] = useState([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState([]);
  const [instrumentCategoryList, setInstrumentCategoryList] = useState([]);
  const [secPage,setSectionPage]=useState('')
  const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
  const [moduleParam,setModuleParam] = useState('')
  const [connectivityFilter, setConnectivityFilter] = useState('all')
  const paramsArray = queryParam ? queryParam.split('&'): []; 
  // Create an empty object to store the values
  const queryParams = {};
  // Iterate over the array and split each key-value pair
  paramsArray.forEach(param => {   
    const [key, value] = param.split('=');   
    queryParams[key] = value;
 });
  // Extracting the respective values
  const range = queryParams['range'];
  const [rangeParam,setRangeParam] = useState(range)

  const handleconnectivityFilterChange = (e) => {
    setConnectivityFilter(e.target.value)
  }
// NOSONAR
  useEffect(() => {
    let ModuleArr = ['alarmrules','newalert','editalarm','alarmhistory','overview']
   if(moduleName === 'alarmrules' && queryParam && queryParam.includes('=')){
        const ruletype = queryParams['ruletype'];
        
     if(ruletype === 'all'){
        setTabValue(1)
     }
     else{
      setErrorPage(true)
     }
   }
   else if(moduleName === 'newalert' && queryParam && queryParam.includes('=')){
     
     // Extracting the respective values
     const ruletype = queryParams['ruletype'];
    setModuleParam('newalert')
    setTabValue(1)
    if(ruletype === 'data'){
      setRuleTypeParam('alert')
    }
    else if(ruletype === ' connectivity'){
      setRuleTypeParam('connectivity')
    }
    else if(ruletype === 'timeslot'){
      setRuleTypeParam('timeslot')
    }
    else if(ruletype === 'downtime'){
      setRuleTypeParam('downtime')
    }
    else{
      setErrorPage(true)
    }
    
   }
   else if(moduleName === 'editalarm' && queryParam && queryParam.includes('=')){
      
     const ruleid = queryParams['ruleid'];
    setModuleParam('editalarm')
    setTabValue(1)
    if(ruleid){
      setRuleTypeParam(ruleid)
    }else{
      setErrorPage(true)
    }
   }
   else if(moduleName === 'alarmhistory' && queryParam && queryParam.includes('=')){
      
     const ruleid = queryParams['ruleid'];
    setModuleParam('alarmhistory')
    setTabValue(1)
    if(ruleid){
      setRuleTypeParam(ruleid)
    }else{
      setErrorPage(true)
    }
   }
   else if(moduleName === 'overview' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
      
    if(range){
      setRangeParam(range)
    }else{
      setErrorPage(true)
    }
   }else if(ModuleArr.includes(moduleName) && queryParam && !(queryParam.includes('=') || queryParam.includes('&')) ){
    setErrorPage(true)
  }else if(ModuleArr.filter(f=> f!=='overview').includes(moduleName) && !queryParam){
    setErrorPage(true)
  }else if(moduleName && !ModuleArr.includes(moduleName) ){
    setErrorPage(true)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[moduleName,queryParam])
console.log(tabValue,"tabValue")
  useEffect(() => {
    setCurPage("Alarms");
    setSelectedAlarmType(AddOption)
    setAlarmFilterType(AddOption.map((x) => x.id));
    setOverviewType("alert")
    getInstrumentCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(selectedAlarmType,"selectedAlarmType")
 

  const AddOption = [
    { id: "alert", name: t("Data Alarm") },
    { id: "connectivity", name: t("Connectivity Alarm") },
    { id: "timeslot", name: t("Timeslot Alarm") },
    { id: "downtime", name: t("Downtime Alarm") },
    { id: "tool", name: t("Tool Alarm") }
  ]

  const handleChangeAlarmType = (event) => {
    console.log("eeeeeeeeeeee",event)
    setSelectedAlarmType(event)
    setAlarmFilterType(event.map((x) => x.id));
  }
  const handleFilterChange = (e) => {
    setOverviewType(e.target.value)
    setOverviewFilter(e.target.value)
    if(e.target.value === 'downtime' || e.target.value === 'tool'){
      setSelectedCategoryType(InstrumentCategoryListData)
      setCategoryFilterType(InstrumentCategoryListData.map((x) => x.id));
    }
  }

  const handleInstrumentCategory = (event) => {
    setSelectedCategoryType(event)
    setCategoryFilterType(event.map((x) => x.id));
  }

  useEffect(() => {
    if (!InstrumentCategoryListLoading && InstrumentCategoryListData && !InstrumentCategoryListError) {
      console.log("InstrumentCategoryListData", InstrumentCategoryListData)
      if (InstrumentCategoryListData.length > 0) {
        setInstrumentCategoryList(InstrumentCategoryListData)
        setSelectedCategoryType(InstrumentCategoryListData)
        setCategoryFilterType(InstrumentCategoryListData.map((x) => x.id));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InstrumentCategoryListData])

  const MenuList = [
    {
        title:"Overview",
        content:<AlarmOverview range={rangeParam} filterhandler={handleconnectivityFilterChange} connectivityFilter={connectivityFilter} overviewFilter={overviewFilter} />
    },
    {
        title:"Alarm Rules",
        content:<AlarmRules changeSec={(e)=> setSectionPage(e)} module={moduleParam} params={RuleTypeParam}/>
    }
]

  return (
    <React.Fragment>
      <Grid container spacing={4} className='bg-Background-bg-primary  dark:bg-Background-bg-primary-dark' >
        {!secPage &&
        <Grid item xs={5} sm={5} > 
           <div className="p-[15px]">
          {tabValue === 0 ? 
          <Typography value={t('Alarms')} variant="heading-02-xs" /> :
          <Typography value={t('Alarm Rules')} variant="heading-02-xs" />}
          </div>
        </Grid>}
        {
          tabValue === 0 && !secPage &&
          <React.Fragment> 
                       {currentState === "home" && (overviewFilter === 'downtime' || overviewFilter === 'tool') && ( connectivityFilter === 'all' || connectivityFilter === 'gateway') && 
                          <Grid item xs={2} sm={2} style={{padding:'0.5rem'}}> </Grid>
                        }
                      
                      
                      {(currentState === "home" && (overviewFilter !== 'downtime' && overviewFilter !== 'tool') ) && 
                      <Grid item xs={2} sm={2} style={{padding:'0.5rem 0px 0.5rem 0px'}}> 
                        {overviewFilter !== 'connectivity' &&
                        <SelectBox
                          labelId="Select-type-label"
                          label=""
                          id="selectTypeLabel"
                          placeholder={t("Select Category")}
                          auto={false}
                          options={instrumentCategoryList}
                          isMArray={true}
                          value={selectedCategoryType}
                          onChange={handleInstrumentCategory}
                          keyValue="name"
                          keyId="id"
                          multiple={true}
                          checkbox={true}
                          selectAll={true}
                          selectAllText={t('All Category')}
                        />}
                        {overviewFilter === 'connectivity' && connectivityFilter !== 'all' && connectivityFilter !== 'gateway' &&
                        <SelectBox
                          labelId="Select-type-label"
                          label=""
                          id="selectTypeLabel"
                          placeholder={t("Select Category")}
                          auto={false}
                          options={instrumentCategoryList}
                          isMArray={true}
                          value={selectedCategoryType}
                          onChange={handleInstrumentCategory}
                          keyValue="name"
                          keyId="id"
                          multiple={true}
                          checkbox={true}
                          selectAll={true}
                          selectAllText={t('All Category')}
                        />}
                      </Grid> }
                      {currentState === "home" && 
                      <Grid item xs={2} sm={2} style={{padding:'0.5rem 0px 0.5rem 0px'}}> 
                      
                        <SelectBox
                          labelId="Select-type-label"
                          id="selectTypeLabel"
                          value={overviewFilter}
                          placeholder={t('Select Type')}
                          options={AddOption}
                          onChange={handleFilterChange}
                          multiple={false}
                          isMArray={true}
                          auto={false}
                          keyValue="name"
                          keyId="id"
                          width="100px"
                        />
                      </Grid>}
                      {currentState !== "home" && 
                      <Grid item xs={4} sm={4} > </Grid>
                      }
                
            <Grid item xs={3} sm={3} >
                <div className="pr-4 py-2 items-center">
                  <AlarmsDateRange btnValue={13} Dropdowndefine={'alarms'} range={rangeParam}/>
                </div>
            </Grid>

          </React.Fragment>
        }

        {
          tabValue === 1 && !secPage &&
          <React.Fragment>
            <Grid item xs={5} sm={5} >
            </Grid>
            <Grid item xs={2} sm={2} >
              <div className="flex gap-4 py-2 pr-4 items-center">
                <SelectBox
                  labelId="Select-type-label"
                  label=""
                  id="selectTypeLabel"
                  placeholder={t("All Rules")}
                  auto={false}
                  options={AddOption}
                  isMArray={true}
                  value={selectedAlarmType}
                  onChange={handleChangeAlarmType}
                  keyValue="name"
                  keyId="id"
                  multiple={true}
                  checkbox={true}
                  selectAll={true}
                  selectAllText={t('AllRules')}
                />
              </div>
            </Grid>
          </React.Fragment>
        }


      </Grid>
      <HorizontalLine variant={"divider1"} />
      <div className="bg-Background-bg-primary dark:bg-Background-bg-primary">
        {MenuList[tabValue].content}
      </div>

    </React.Fragment>
  );
}
