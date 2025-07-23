
import React, { useEffect, useState } from "react";

import Tag from "components/Core/Tags/TagNDL";
import ActiveIcon from 'assets/neo_icons/Menu/Tag.svg?react'; 
import { useRecoilState } from "recoil";
import { selectedPlant ,snackToggle, snackMessage, snackType, snackDesc} from "recoilStore/atoms"; 
import Grid from 'components/Core/GridNDL'
import ToolCard from "./ToolCard";
import TableSearch from "components/Table/TableSearch.jsx";
import moment from 'moment';
import useToolAlarmRules from "Hooks/useToolAlarmRules"
import useUpdateToolRule from "Hooks/useUpdateToolRule"
import useUpdateTool from "components/layouts/Settings/ToolLifeMonitoring/hooks/useUpdateTool.jsx"
import useToolLife from "components/layouts/Settings/ToolLifeMonitoring/hooks/useToolLife.jsx"

let arrList=[] 
const Tool = React.memo((props) => {   
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [, setSnackDesc] = useRecoilState(snackDesc);
    const [isActive, setisActive] = useState(true)
    const [isInactive, setisInactive] = useState(true)
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [ToolsData, setToolsData] = useState([]);
    const [ToolSearchData,setToolSearchData] = useState([]);
    const [category,setcategory] = useState(1);
    
    const [search, setSearch] = useState("");
    const { ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife } = useToolLife();
    const { ToolAlarmRulesLoading, ToolAlarmRulesData, ToolAlarmRulesError, getToolAlarmRules } = useToolAlarmRules();

    const {UpdateToolLoading, UpdateToolData, UpdateToolError, getUpdateTool}=useUpdateTool()
    const { UpdateToolRuleLoading, UpdateToolRuleData, UpdateToolRuleError, getUpdateToolRule } = useUpdateToolRule();

    useEffect(()=>{
      if(headPlant.id){
        arrList=[] 
        getToolLife(headPlant.id)
        getToolAlarmRules(headPlant.id)
      }
    },[headPlant])

    useEffect(() => {
      if (!ToolLifeLoading && !ToolLifeError && ToolLifeData) {
        if (ToolLifeData.length > 0 && ToolAlarmRulesData) {
          let ToolList = [];
    
          ToolLifeData.map((t) => {
  
              const filteredAlarmsRules = ToolAlarmRulesData.find(
                (x) => x.name === t.name
              );
          // console.log("filteredAlarmsRules",filteredAlarmsRules)
           
            ToolList.push({
              ...t,
              warning:filteredAlarmsRules ? filteredAlarmsRules.warn_value :null,
              critical:filteredAlarmsRules ? filteredAlarmsRules.critical_value:null,
              schema: headPlant.schema,
              data: [
                {
                  part_signal_instrument: t.intruments.map((v) => v.id),
                  metric: { name: "part_count" },
                  is_part_count_binary: true,
                  is_part_count_downfall: false,
                  
                },
              ],
              
            });
          });
          
        
          setToolsData(ToolList);
          setToolSearchData(ToolList);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ToolLifeLoading, ToolLifeData, ToolLifeError,ToolAlarmRulesData]);
      

    useEffect(() => {
      if (!UpdateToolLoading && !UpdateToolError && UpdateToolData) {
        if (UpdateToolData.affected_rows > 0) { 
          setSnackDesc('Your tool usage limits have been successfully reset.')
          setSnackMessage('Limit Reset Successfully')
          setSnackType("info")
          setOpenSnack(true)
          getToolLife(headPlant.id) 
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateToolLoading, UpdateToolData, UpdateToolError])

    useEffect(() => {
      if (!UpdateToolRuleLoading && !UpdateToolRuleError && UpdateToolRuleData) {
        if (UpdateToolRuleData.affected_rows > 0) { 
           console.log(UpdateToolRuleData,"UpdateToolRuleData")
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateToolRuleLoading, UpdateToolRuleData, UpdateToolRuleError])

    const TagFilter = (type) => {
        if (type === "Active") {
            setisActive(!isActive)
        }
        if (type === "Inactive") {
            setisInactive(!isInactive)
        }
    }

    useEffect(()=>{
        if(isActive && isInactive){
          setcategory(1)
        }else if(isActive && !isInactive){
          setcategory(2)
        }else if(!isActive && isInactive){
          setcategory(3)
        }else{
          setcategory(0)
        }

        // console.log(props.showStatus,"props.showStatusprops.showStatus")
    },[isActive,isInactive])
    
   


    
    function StatusList(arr){
      arrList =[...arrList] 
      
      let indx = arrList.findIndex(f=> f.name === arr.name)
      if(indx >=0){
        arrList[indx] = arr
      }else{
        arrList.push(arr)
      }
      // setstatusArr(arrList)
      setActiveCount(arrList.filter(f=> f.IsActive).length)
      setInactiveCount(arrList.filter(f=> !f.IsActive).length)
      // console.log(arrList,"arrarrStatus",arr)
    }

    // useEffect(()=>{
    //   if(statusArr.length>0){
    //     console.log(statusArr,"statusArr")
        
    //   }
    // },[statusArr])

    function resetTool(data){
     
      let AlarmList = ToolAlarmRulesData.find(option => option.name === data.name && option.entity_type === 'tool')
      if(AlarmList && !ToolAlarmRulesLoading && ToolAlarmRulesData && !ToolAlarmRulesError ){
        getUpdateToolRule(AlarmList.id,moment().format('YYYY-MM-DDTHH:mm:ssZ'))
      } 
      // return false
      getUpdateTool(data.id,data.name,data.asset_types,data.intruments,data.limit,data.updated_by,moment().format('YYYY-MM-DDTHH:mm:ssZ'),data.limit_ts)
       
    }

  return (
    <div>
                

    <div className="flex items-center gap-2 p-2 justify-end border-b border-Border-border-50  dark:border-Border-border-dark-50">
<div className="flex gap-2 items-center justify-end'">
        <div  className='flex items-center gap-1'  >
            {/* <Typography style={{whiteSpace:'nowrap'}} value='Filter by:' color='secondary'  variant= 'paragraph-s' />
                    <SelectBox
                        labelId="Select-type-label"
                        label=""        
                        id="selectTypeLabel"
                        placeholder={("Select Category")}
                        value={category}
                        auto={false}
                        options={OptionCat}
                        isMArray={true}
                        onChange={handleCategory}
                        keyValue="name"
                        keyId="id"
                    /> */}
                    <TableSearch
                    searchdata={(value) => {
                      setSearch(value);
                      let filterArray = []
                      if(value){  
                              // eslint-disable-next-line array-callback-return
                              ToolSearchData.forEach(v=> {
                                  if(v.name.toLowerCase().includes(value.toLowerCase())){
                                      filterArray.push(v)
                                  }
                              })
                              setToolsData(filterArray)
                      }else{
                        setToolsData(ToolSearchData)
                      } 
                      // console.log(value,"valuevalue")
                    }}
                    search={search}
                  />
        </div>
        <div className="flex items-center gap-2">
            <Tag mono icon={ActiveIcon} stroke={!isActive ? "#30A46C" : "#FFFFFF"} bordercolor={{ border: !isActive ? "1px solid #FFFFFF" : "1px solid #30A46C" }} style={{ color: !isActive ? "#30A46C" : "#FFFFFF", backgroundColor: isActive ? "#30A46C" : "#fcfcfc", textAlign: "-webkit-center", cursor: "pointer" }} name={`${('Active')} ${activeCount}`} onClick={() => TagFilter("Active")} />
            <Tag mono icon={ActiveIcon} stroke={!isInactive ? "#CE2C31" : "#FFFFFF"} bordercolor={{ border: !isInactive ? "1px solid #FFFFFF" : "1px solid #CE2C31" }} colorbg="error" style={{ color: !isInactive ? "#CE2C31" : "#FFFFFF", backgroundColor: isInactive ? "#CE2C31" : "#fcfcfc", textAlign: "-webkit-center", cursor: "pointer" }} name={`${('Inactive')}  ${inactiveCount}`} onClick={() => TagFilter("Inactive")} />
        </div>
</div>
  
</div>
<Grid container spacing={3}  style={{ padding: "12px" }}>
{ToolsData.map((val, index) => (
  <ToolCard
    key={val.id || index}  // Use only if no unique key exists
    name={val.name}
    asset_name={val.asset_type.name}
    limit={val.limit}
    data={val}
    showStatus={category}
    StatusList={StatusList}
    resetTool={(e) => resetTool(e)}
    headPlant={headPlant}
  />
))}

 {/* <Grid item xs={3}>

      <Card
        elevation={0}
        style={{ cursor: 'pointer', height: "200px" }}
        onClick={[]}
      >
        <div style={{ height: "100%" }}>
          <div className="flex justify-between items-center text-center">
            <Asset />
            <div className="flex items-center gap-1">
              <Status lessHeight style={[]} />
              <Refresh />
            </div>    
          </div>
          
          <div className="flex flex-col gap-3 items-baseline mt-2">
            <Tooltip title={[]} placement={'bottom'}>
              <Typography
                variant="heading-02-xs"
                value={"Tool Name here"}
                style={{
                  marginRight: 10,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: "300px",
                  textAlign: "left"
                }}
              ></Typography>
            </Tooltip>
            <Typography
              variant="paragraph-xs"
              color={"tertiary"}
            ><Vector/>{"    Crimping Machine"}</Typography>
            <Typography
              variant="paragraph-xs"
              style={{color:"#EF5F00"}}
              value={"750/1000"}
            ></Typography>
            <Typography
              variant="paragraph-xs"
              color={"tertiary"}
              value={"Loaded at 03/15/2024 22:34:16 AM"}
            ></Typography>
          </div>
        </div>
      </Card>
    
 </Grid> */}

  
  {/* <Grid item xs={3}>
        <Card
          elevation={0}
          style={{ cursor: 'pointer', height: "200px" }}
          onClick={[]}
        >
          <div style={{ height: "100%" }}>
            <div className="flex justify-between items-center text-center">
              <Asset />
              <div className="flex items-center gap-1">
                <InactiveStatus lessHeight style={[]} />
                <Refresh />
              </div>    
            </div>
            
            <div className="flex flex-col gap-3 items-baseline mt-2">
              <Tooltip title={[]} placement={'bottom'}>
                <Typography
                  variant="heading-02-xs"
                  value={"Tool Name here"}
                  style={{
                    marginRight: 10,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: "300px",
                    textAlign: "left"
                  }}
                ></Typography>
              </Tooltip>
              <Typography
                variant="paragraph-xs"
                color={"tertiary"}
              ><Vector/>{"  NA"}</Typography>
              <Typography
                variant="paragraph-xs"
                color={"#CE2C31"}
                value={"1000/1000"}
              ></Typography>
              <Typography
                variant="paragraph-xs"
                color={"tertiary"}
                value={"Loaded at 26/09/2024 09:22:23 PM"}
              ></Typography>
            </div>
          </div>
        </Card>

    </Grid> */}
 
      {/* <Grid item xs={3}>
  <Card
        elevation={0}
        style={{ cursor: 'pointer', height: "200px" }}
        onClick={[]}
      >
        <div style={{ height: "100%" }}>
          <div className="flex justify-between items-center text-center">
            <Asset />
            <div className="flex items-center gap-1">
              <InactiveStatus lessHeight style={[]} />
              <Refresh />
            </div>    
          </div>
          
          <div className="flex flex-col gap-3 items-baseline mt-2">
            <Tooltip title={[]} placement={'bottom'}>
              <Typography
                variant="heading-02-xs"
                value={"Tool Name here"}
                style={{
                  marginRight: 10,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: "300px",
                  textAlign: "left"
                }}
              ></Typography>
            </Tooltip>
            <Typography
              variant="paragraph-xs"
              color={"tertiary"}
            ><Vector/>{"  NA"}</Typography>
            <Typography
              variant="paragraph-xs"
              color={"#EF5F00"}
              value={"1000/1000"}
            ></Typography>
            <Typography
              variant="paragraph-xs"
              color={"tertiary"}
              value={"Loaded at 26/09/2024 09:22:23 PM"}
            ></Typography>
          </div>
        </div>
      </Card>
      </Grid> */}
  </Grid>   
</div>
  )
})
  

export default Tool;