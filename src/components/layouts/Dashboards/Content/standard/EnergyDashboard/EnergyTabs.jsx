/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"; 
import {useParams} from "react-router-dom" 
import { useRecoilState } from "recoil";
import { energyTab, ErrorPage} from "recoilStore/atoms";
import EnergyDashboard from "./Energy/EnergyDashboard";
import useMetricTypelist from "../hooks/useMetricTypes";
import useAssetEnergyList from "../hooks/useAssetEnergyList";
import ParallelConsumptionDashBoard from "./ParallelConsumption/ParallelConsumption";
import ProductDashboard from "./ProductDashboard/ProductDashboard"; 
import TabContent from "components/Core/Tabs/TabContentNDL";
import TabListItems from 'components/Core/Tabs/TabListItemNDL';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";

const EnergyTabs = ((props) => { 
    const [tabValue, setTabValue] = useRecoilState(energyTab);
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const [isActive, setActive] = useState(0)
    const { metrictypelistLoading, metrictypelistdata, metrictypelisterror, getMetricTypelist } = useMetricTypelist()
    const { assetenergylistLoading, assetenergylistdata, assetenergylisterror, getAssetEnergyList } = useAssetEnergyList()
    const [typelist, setTypelist] = useState([])
    const [assets,setassets] = useState([])
    const [metrics,setmetrics] = useState([])
    let {moduleName,subModule1} = useParams()
    const [contentSwitchIndex, setContentSwitchIndex] = useState(0);
    

    useEffect(() => {
        getMetricTypelist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 
    useEffect(()=>{
        if(moduleName === 'energy'){
            if(subModule1 === 'energy'){
             setTabValue(0)
            }
            else if(subModule1 === 'parallel consumption'){
                setTabValue(1)
            }
            else if(subModule1 === 'product sqmt'){
                setTabValue(2)
            }
            else if(subModule1 === 'energy sqmt'){
                setTabValue(3)
            }
            else if(subModule1 === 'waterfall'){
                setTabValue(4)
            }
            else if(subModule1 === 'activity'){
                setTabValue(5)
            }else{
                setErrorPage(true)
            }
        }
        setmetrics([])
        setassets([])
        getAssetEnergyList(props.headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.headPlant.id])

    useEffect(() => {
        if ((!metrictypelisterror && !metrictypelistLoading && metrictypelistdata)) {
            let typelists = []

            // eslint-disable-next-line array-callback-return
            metrictypelistdata.map((val) => {
                typelists.push({ "metric_name": val.name, "type": val.metric_type.type, "id": val.metric_type.id })
            })

            setTypelist(typelists)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metrictypelistLoading, metrictypelistdata, metrictypelisterror])
    useEffect(() => {
        
        if ((!assetenergylisterror && !assetenergylistLoading && assetenergylistdata)) {

            let tempassets = []
            let metricss = []
            // eslint-disable-next-line array-callback-return
            assetenergylistdata.map((val) => {
                tempassets.push({ "name": val.instrument.name, "id": val.instrument.id })
                if (!metricss.includes(val.metric.name)) metrics.push(val.metric.name)
            })
            setassets(tempassets)
            setmetrics(metricss)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetenergylistLoading, assetenergylistdata, assetenergylisterror])

    

    const menuData = [
        {
            title: 'Energy',
            content: <EnergyDashboard typelist={typelist} btGroupValue={props.energybtGroupValue} headPlant={props.headPlant} assets={assets} metrics={metrics} />
        },
        {
            title: 'Parallel Consumption',
            content: <ParallelConsumptionDashBoard mode={isActive} typelist={typelist} btGroupValue={props.btGroupValue} headPlant={props.headPlant} metrics={metrics} category={props.selectedcategory} categories={props.categories} />
        },
        {
            title: 'Product SQMT',
            content: <ProductDashboard 
            products={props.prodproducts}
            headPlant={props.headPlant} 
            selectedproducts={props.selectedprodproducts} 
            year={props.productyear} 
            typelist={typelist}
             />
        },
        // {
        //     title:'Energy SQMT',
        //     content: <EnergypersqmtDashboard 
        //     products={props.energyproducts} 
        //     averagetype={props.averagetype} 
        //     selectedproducts={props.selectedenergyproducts}
        //     btGroupValue={props.energysqmtbtGroupValue}
        //     headPlant={props.headPlant}
        //     typelist={typelist}
        //      />
        // },
        // {
        //     title: 'WaterFall',
        //     content: <WaterFallDashboard date={props.date} datetocompare = {props.datetocompare} nodes={props.waterfallnodes} typelist={typelist}/>
        // },
        //  {
        //     title:'Activity',
        //     content: <ActivityDashboard  products={props.activityproducts}  typelist={typelist} nodes={props.activitynodes} year={props.activityyear} headPlant={props.headPlant}/>
        // },
    ];
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

    };
  
    
    const buttonList = [
        {id:"Daywise", value:"Daywise", disabled:false},
        {id:"Shiftwise", value:"Shiftwise", disabled:false},
      ]
    
      const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)

          if (e === 0) {
              setActive(false)
          }
          else {
              setActive(true)
          }

    }

    return (
        <div class="w-full" >
                <div class="flex flex-row  w-full padding p-0  z-10">
                        <TabListItems >
                            {menuData.map((data, index) => {

                                return ( 
                                        <TabContent  key={data.title} value={data.title} selected={tabValue === index ? true : false} onClick={(event) => handleTabChange(event, index)}  />
                                );

                            })}
                        </TabListItems>
                   </div> 
                {(tabValue === 1) &&
                    // <div style={{ display: "flex", marginTop: "15px" }}>
                    //     {!isActive ? (<PrimaryButton style={{ float: "right", height: "24px" }} value="Daywise" onClick={handleDaywise} />) : <Button variant="contained" style={{ float: "right", height: "24px", textTransform: "none", color: "black" }} onClick={handleDaywise}  >{"Daywise"}</Button>}
                    //     {isActive ? (<PrimaryButton style={{ float: "right", height: "24px", marginRight: "8px" }} value="Shiftwise" onClick={handleShiftwise} />) : <Button variant="contained" style={{ float: "right", height: "24px", marginRight: "8px", textTransform: "none", color: "black" }} onClick={handleShiftwise}>{"Shiftwise"}</Button>}
                    // </div>

                    <div className="flex items-center justify-end pt-4 px-4">
                        <ContentSwitcherNDL listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={contentSwitchIndex} ></ContentSwitcherNDL>
                     </div>
                }
            {menuData[tabValue].content}
        </div>
    );
})
export default EnergyTabs;
