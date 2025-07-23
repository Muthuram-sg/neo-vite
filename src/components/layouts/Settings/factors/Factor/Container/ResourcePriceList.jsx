import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { themeMode, selectedPlant,hierarchyData } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import EnhancedTable from "components/Table/Table";
import useGetInstrumentFarmula from '../../VirutalInstrument/hooks/useGetInstrumentFarmula'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Grid from "components/Core/GridNDL";

export default function FactorTable() {
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode);
    const [headPlant] = useRecoilState(selectedPlant);
    const { outDTLoading, outDTData, outDTError, getInstrumentFormulaList } = useGetInstrumentFarmula();
    const [tabledata, setTableData] = useState([])
    const dashboardAggregationRef = useRef();
    const [dashboardAggregation, setDashboardAggregation] = useState(headPlant.dash_aggregation);
    const [HierarchyData] = useRecoilState(hierarchyData);

    const renderHierarchyName =(Hid)=>{
      if(HierarchyData && HierarchyData.length > 0){
        return HierarchyData.filter(x=>x.id === Hid).length > 0 ? HierarchyData.filter(x=>x.id === Hid)[0].name : '-'
      }

    }
    const DashboardaggregationOpt = [
        { id: "mean", title: t('Mean') },
        { id: "min", title: t('Minimum') },
        { id: "max", title: t('Maximum') },
        { id: "last", title: t('Last') },  //The default Last should always be the last entry of aggregation mode
    ]
    useEffect(() => {
        getInstrumentFormulaList(headPlant.id);
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if (
            outDTData !== null &&
            !outDTLoading &&
            !outDTError
        ) {
            console.log(outDTData)
            
        setTimeout(() => {
            setDashboardAggregation(headPlant.dash_aggregation)
            if(headPlant.node && headPlant.node.nodes.length > 0){
              console.log(headPlant.node.nodes,"headPlant.node.nodes")
              let energyunit = headPlant.node.nodes.filter(e=> e.type && e.type === 1)
              let waterunit = headPlant.node.nodes.filter(e=> e.type && e.type === 2 && e.checked === true)
              let LPGunit = headPlant.node.nodes.filter(e=> e.type && e.type === 3 && e.checked === true)
              let CNGunit = headPlant.node.nodes.filter(e=> e.type && e.type === 4 && e.checked === true)
              
              var temptabledata = [];
              var nodeString = "";
              var assetData = "";
              if(energyunit.length > 0){
              
               if(energyunit[0].radio && energyunit[0].radio === 'hierarchy'){ 
                  temptabledata.push(['Electricity Unit Price', energyunit[0].price,"-","-",renderHierarchyName(energyunit[0].selectedHierarchy)])
                  
                }else{
                  assetData = outDTData.filter(e=> e.id === energyunit[0].asset);
                  nodeString = energyunit[0].nodes &&  energyunit[0].nodes.length > 1 ? " +"+(Number(energyunit[0].nodes.length) - 1)+" more":"";
                  temptabledata.push(['Electricity Unit Price', energyunit[0].price, assetData[0].name, energyunit[0].nodes[0].name + nodeString,"-"])

                }
              }
              if(waterunit.length > 0){
                if(waterunit[0].radio && waterunit[0].radio === 'hierarchy'){ 
                temptabledata.push(['Water Price', waterunit[0].price, "-", "-",renderHierarchyName(waterunit[0].selectedHierarchy)])
                }else{
                assetData = outDTData.filter(e=> e.id === waterunit[0].asset);
                nodeString = waterunit[0].nodes.length > 1 ? " +"+(Number(waterunit[0].nodes.length)-1)+" more" : "";
                temptabledata.push(['Water Price', waterunit[0].price, assetData[0].name, waterunit[0].nodes[0].name+ nodeString,'-'])
                  
                }
              }
              if(LPGunit.length > 0){
                if(LPGunit[0].radio && LPGunit[0].radio === 'hierarchy'){
                  temptabledata.push(['LPG Gas Price', LPGunit[0].price, "-","-",renderHierarchyName(LPGunit[0].selectedHierarchy,'-')])
                }else{
                  assetData = outDTData.filter(e=> e.id === LPGunit[0].asset);
                  nodeString = LPGunit[0].nodes.length > 1 ? " +"+(Number(LPGunit[0].nodes.length)-1)+" more":"";
                  temptabledata.push(['LPG Gas Price', LPGunit[0].price, assetData[0].name, LPGunit[0].nodes[0].name+ nodeString])

                }
              }
              if(CNGunit.length > 0){
                if(CNGunit[0].radio &&  CNGunit[0].radio === 'hierarchy'){
                  temptabledata.push(['CNG Gas Price', CNGunit[0].price, '-', '-',renderHierarchyName(CNGunit[0].selectedHierarchy)])
                }else{
                  assetData = outDTData.filter(e=> e.id === CNGunit[0].asset);
                  nodeString = CNGunit[0].nodes.length > 1 ? " +"+(Number(CNGunit[0].nodes.length)-1)+" more":"";
                  temptabledata.push(['CNG Gas Price', CNGunit[0].price, assetData[0].name, CNGunit[0].nodes[0].name+ nodeString,'-'])

                }
              }
              setTableData(temptabledata)
            }
          }, 300)
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [outDTData])
    
  
      const headCells = [
          {
            id: 'Energy Type',
            numeric: false,
            disablePadding: true,
            label: t('Energy Type'),
          },
          {
            id: 'Price (₹)',
            numeric: true,
            disablePadding: false,
            label: t('Price (₹)'),
          },
          {
            id: 'Energy Asset',
            numeric: false,
            disablePadding: false,
            label: t('Energy Asset'),
          },
          {
            id: 'Node',
            numeric: false,
            disablePadding: false,
            label: t('Node'),
          },{
            id: 'Hierarchy',
            numeric: false,
            disablePadding: false,
            label: t('Hierarchy'),
          }
        ];

        return (

            <div style={{ paddingTop: 10, backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} style={{padding: "16px 0px 16px 0px"}}>
                    
                <SelectBox
                      labelId=""
                      id="dashboardAggregation"
                      inputRef={dashboardAggregationRef}
                      auto={false}
                      label={t('DashboardAggregation')}
                      multiple={false}
                      options={DashboardaggregationOpt}
                      isMArray={true}
                      checkbox={false}
                      value={dashboardAggregation}
                      keyValue="title"
                      keyId="id"
                      disabled={true}
                  />
                </Grid>
              </Grid>
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
                    rawdata={[]}
                    hidePagination
                />
            </div>
);
}