/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import useTheme from "TailwindTheme";
import Grid from "components/Core/GridNDL";
import configParam from "config";
import moment from "moment";
import gqlQueries from "components/layouts/Queries";
import { useRecoilState } from "recoil";
import { showOEEAsset,customdates,ProgressLoad,themeMode,selectedPlant } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import { useAuth } from "components/Context";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import ToolTip from "components/Core/ToolTips/TooltipNDL"

function QualityDashboard(props) {
  const { HF } = useAuth();
  const { t } = useTranslation();
  const [, setProgressBar] = useRecoilState(ProgressLoad);
  const [curTheme] = useRecoilState(themeMode);
  const [OEEList, setOEEList] = useState([]);
  const [headPlant] = useRecoilState(selectedPlant); 
  const [, setSelectedAssetID] = useRecoilState(showOEEAsset);
  const maintheme = useTheme();
  const [customdatesval,] = useRecoilState(customdates); 
  useEffect(() => {
    setOEEList([]);
    getAssetOEEConfigs();
    setProgressBar(true)
  }, [headPlant,customdatesval]); // eslint-disable-line react-hooks/exhaustive-deps
  function getAssetOEEConfigs() {
    let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss")
    let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss");
   
    setSelectedAssetID({ show: false, id: 0 }) 
    configParam
      .RUN_GQL_API(gqlQueries.getAssetOEEConfigs, {
        line_id: headPlant.id,
        start_dt: startrange,
        end_dt: endrange,
      })
      
      .then((oeeData) => {
        if (
          oeeData !== undefined &&
          oeeData.neo_skeleton_prod_asset_oee_config &&
          oeeData.neo_skeleton_prod_asset_oee_config.length > 0
        ) {
          QualityCalc(oeeData.neo_skeleton_prod_asset_oee_config);
        } else {
          setProgressBar(false)
          console.log("returndata undefined getAssetOEEConfigs");
        }
        
      });
      
  } 

  function QualityCalc(dataArray) {
    let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss")
    let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss");
    
    Promise.all(
      dataArray.map((val) => {
        return configParam
          .RUN_GQL_API(gqlQueries.GetDowntimeAndQualitydefects, {
            
            entity_id: val.entity.id,
            start_dt:startrange,
            end_dt: endrange,
          })
          .then((mssData) => {
            let defects
            let quantity=0
            let lastrejection = "00:00"
            let rejectionday
            val.Quality = "00";
            val.today=1
            val.lastrejection = "00:00"
            val.status = "ACTIVE"
          
            if (mssData.neo_skeleton_prod_quality_defects.length > 0) {
              defects=mssData.neo_skeleton_prod_quality_defects
              
              defects.map((d)=>{
              if (lastrejection < d.created_ts){
                lastrejection = d.created_ts
              }
              quantity=quantity+parseInt(d.quantity)
            })
            if (quantity > 15) {
              val.status = "STOPPED";
          } else if (quantity < 10) {
              val.status = "ACTIVE";
          } else {
              val.status = "IDLE";
          }
             
              val.Quality= quantity < 10 ? "0"+quantity : quantity
             rejectionday=moment(new Date(lastrejection)).format("MMMM D,YYYY")
             if (rejectionday != moment(new Date()).format("MMMM D,YYYY")){
  
              val.lastrejection =  moment(
                new Date(lastrejection)
              ).format("MMMM D, YYYY  "+HF.HM);
              val.today=0

             }
            else {
              val.lastrejection =  moment(
                new Date(lastrejection),
                HF.HM
              ).format(HF.HM);
            }
            }
            return val; /*the json that contains the asset details*/
          })
          .catch((error) => console.log("Machine Status error", error));
      })
    ).then((data) => {
      setOEEList(data);
      setProgressBar(false)
    })
  }


  const renderBackGroundColor =(statusval)=>{
    if(statusval === "IDLE"){
      return  "#FFCC00"
    }else if(statusval === "STOPPED"){
      return '#FF2F23'
    }else{
      return maintheme.colorPalette.cards 
    }
  }

  return (
    <div>
      <Grid container spacing={0} style={{ paddingLeft: 4, paddingTop: 4 }}>
        {OEEList.map((val) => (
          val && <Grid item xs={3} style={{padding: 4}}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
              <KpiCards style={{backgroundColor:renderBackGroundColor(val.status)}}  >
                  <div style={{display:"flex",alignItems:"center"}}>
                    <TypographyNDL
                      variant="heading-02-xs"
                      style={{
                        color: val.status === "ACTIVE" ? maintheme.colorPalette.primary : "#FFFFFF",
                      }}
                      value={val.entity.name}
                  />
                        <ToolTip title={val.entity.name} placement="bottom" >
                             <Information  style={{color: curTheme === "light" ? "#242424" : "#A6A6A6",marginLeft:"10px"}} />
                             </ToolTip>
                             </div>
                    <HorizontalLine style={{ backgroundColor: val.status === 'ACTIVE' ? maintheme.colorPalette.divider : "#FFFFFF", marginTop : 8 , marginBottom : 18 }} />
                    <div
                      style={{
                        maxHeight: 210,
                        height: 204,
                        overflow: "auto",
                        padding: 0,
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",   
                        "& ::-webkit-scrollbar": {
                          display: "none",
                          width: "0em",
                        },
                      }}
                    >
                      <div  style={{textAlign: "center"}} >
                      <TypographyNDL
                      variant="display-m"
                      color= "tertiary" 
                      value={t("TotalRejects")}
                      />
                        
                      <br></br>
                      <TypographyNDL
                       variant="display-m"
                       value={val.Quality}
                      />
                        <br></br>
                      
                      <TypographyNDL
                        variant="heading-01-m"
                        value={((val.today === 1 ? t("LastRejectionAt") : t("LastRejectionOn"))+val.lastrejection)}
                      />
                        
                     
                      </div>
                  </div>
                </KpiCards>
              </Grid>
            </Grid>
          </Grid>
        ))}
        {(OEEList.length ===0)  &&
        <Grid item xs={12} style={{display:'flex',justifyContent: 'center'}}>
           <TypographyNDL
                      variant="heading-01-m" 
                      value={t('OEE Asset not configured')}
                      />

        </Grid>
        }
      </Grid>
    </div>
  );
}

export default QualityDashboard;
