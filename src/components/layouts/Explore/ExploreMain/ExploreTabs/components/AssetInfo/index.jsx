import Grid from 'components/Core/GridNDL'
import Typography from "components/Core/Typography/TypographyNDL"
import { useRecoilState } from "recoil";
import { assetSelected, assetDetails } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import React, {  useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import useGetAssetInfo from "./hooks/useGetAssetInfo";
import Image from "components/Core/Image/ImageNDL"

const classes = {
  outerGrid: {
    padding: '8px',
    flexGrow: 0,
    maxWidth: '50%',
    flexBasis: '50%',
    margin: '0',
    boxSizing: 'border-box',
    display: 'block',
  },
  assetInfoBox: {
    padding: '16px',
    boxSizing: 'inherit',
    display: 'block',
  },
  assetInfoName: {
    fontSize: '16px',
    fontWeight: '600',
    boxSizing: 'inherit',
    display: 'block',
  },
  infoDiv: {
    padding: '10px 0px',
  },
};



export default function AssetInfo(props) {
  const { t } = useTranslation();
  const [selectedAsset] = useRecoilState(assetSelected);
  const [assetData, setAssetData] = useRecoilState(assetDetails);
  const { AssetInfoLoading, AssetInfoData, AssetInfoError, getAssetInfo } = useGetAssetInfo();
  useEffect(() => {

    if (selectedAsset !== "" && selectedAsset !== undefined) {
      getAssetInfo(selectedAsset)
      console.log("selectedAsset", selectedAsset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset])

  useEffect(() => {
    if (!AssetInfoLoading && AssetInfoData && !AssetInfoError) {
      setAssetData(AssetInfoData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AssetInfoLoading, AssetInfoData, AssetInfoError])

  const renderDivContent = (det) => {
    return <div className={classes.infoDiv}>
            <div className={classes.fieldName}>
              <Typography value={det.display_name}></Typography>
            </div>
            <div className={classes.fieldValue}>
              <Typography value={det.value}></Typography>
            </div>
          </div>
  }

  const renderAssetInfoContent = (value) => {
    if(assetData.length > 0){
      assetData.filter(data => data.name === value).map(val => {
        return (
          val.details.map((det, ind) =>
          renderDivContent(det)
          )
        )
      }
      )
    }  else{
      return null
    }
  }

  const renderOtherBearingAssetContent = (value) => {
    if(assetData.length > 0){
      assetData.filter(data => data.name === value).map(val => {
        return (
          val.details.map((det, ind) =>
            ind <= 2 ?
            renderDivContent(det) : null
          )
        )
      }
      )
    } else{
      return null
    }
  }

  const renderMachineAssetContent = (value) => {
    if(assetData.length > 0){
      assetData.filter(data => data.name === value).map(val => {
        return (
          val.details.map((det, ind) =>
            ind >= 6 ?
            renderDivContent(det)
              : null
          )
        )
      }
      )
    } else{
      return null
    }
  }

  return (

    <div className='mt-1'>
      <Grid container spacing={1} >
        {/* Machine Specification*/}
        <Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
          <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Machine Specification")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }} >

                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={6} sm={6}>
                    {assetData.length > 0 && assetData.filter(data => data.name === "machine_specification").map(val => {
                      return (
                        val.details.map((det, ind) =>
                          ind <= 5 ?
                            renderDivContent(det)
                            : null
                        )
                      )
                    }
                    )}
                  </Grid>
                  <Grid item xs={6} sm={6}>

                    {renderMachineAssetContent("machine_specification")}
                  </Grid>
                </Grid>

              </div>
            </div>

          </div>
        </Grid>
        {/* Machine Images */}
        <Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
          <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Images")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }} >

                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <Carousel showArrows={true} showThumbs={false} showIndicators={false}>
                     {assetData.length > 0 && assetData.filter(data => data.name === "asset_images").map(val => {
                        return (
                          val.details.map((det, ind) =>
                            <div key={ind+1} className={classes.infoDiv}>
                              <div style={{ "display": "inline-flex" }}>
                                {/* <p className="legend" style={{ "bottom": "auto", "width": "30%", "marginLeft": "0px", "left": "35%" }}>{det.display_name}</p> */}
                                <div style={{ "marginTop": "55px", "display": "inline-flex" }}>
                                  {
                                    // <img style={{ height: "320px", width: "100%", "marginRight": "5px" }} alt={`empty`} src={`${det.value}`} />
                                    <Image src={`${det.value}`} alt="empty" style={{ height: "320px", width: "100%", "marginRight": "5px" }} ></Image>
                                  }
                                </div>
                              </div>
                            </div>
                          )
                        )
                      }
                      )}
                    </Carousel>
                  </Grid>
                </Grid>

              </div>
            </div>
          </div>
        </Grid >
        {/* Sensor Information */}
        < Grid item xs={4} style={{ border: '1px solid rgb(230, 230, 230)' }} >
          <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Sensor Information")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }} >
                {renderAssetInfoContent("sensor_information")}
              </div>
            </div>

          </div>
        </Grid >
        {/* Pulley Specification */}
        < Grid item xs={4} style={{ border: '1px solid rgb(230, 230, 230)' }} >
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Pulley Specification")} variant={"Caption1"}></Typography>
              </div>
            </div>

            {renderAssetInfoContent("pulley_specification")}
          </div>
        </Grid >
        {/* Gearbox Specification */}
        < Grid item xs={4} style={{ border: '1px solid rgb(230, 230, 230)' }} >
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Gearbox Specification")} variant={"Caption1"}></Typography>
              </div>
            </div>

            {renderAssetInfoContent("greabox_specification")}
          </div>
        </Grid >
        {/* Motor Specification */}
        < Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Motor Specification")} variant={"Caption1"}></Typography>
              </div>
            </div>

            {renderAssetInfoContent("motor_specification")}
          </div>
        </Grid >
        {/* Motor Electric Specification */}
        <Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Motor Electric Specification")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }}>
                <Grid container spacing={1} direction="column" alignItems="center">
                  <Grid container item xs={12} sm={12}>
                    <Grid item xs={6} sm={6}>
                      {assetData.length > 0 && assetData.filter(data => data.name === "motor_electrical_specification").map(val => {
                        return (
                          val.details.map((det, ind) =>
                            ind <= 4 ?
                            renderDivContent(det) : null
                          )
                        )
                      }
                      )}
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      {assetData.length > 0 && assetData.filter(data => data.name === "motor_electrical_specification").map(val => {
                        return (
                          val.details.map((det, ind) =>
                            ind > 4 ?
                            renderDivContent(det): null
                          )
                        )
                      }
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div>

          </div >
        </Grid >
        {/* Driven Component Specification */}
        < Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Driven Component Specification")} variant={"Caption1"}></Typography>
              </div>
            </div>

            {renderAssetInfoContent("drive_component_specification")}
          </div>
        </Grid >
        {/* Other Specification */}
        <Grid item xs={6} style={{ border: '1px solid rgb(230, 230, 230)' }}>
        <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Other Specification")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }}>
                <Grid container item xs={12} sm={12}>
                  <Grid item xs={6} sm={6}>
                    {renderOtherBearingAssetContent("others")}
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {assetData.length > 0 && assetData.filter(data => data.name === "others").map(val => {
                      return (
                        val.details.map((det, ind) =>
                          ind > 2 ?
                          renderDivContent(det) : null
                        )
                      )
                    }
                    )}
                  </Grid>
                </Grid>
              </div>
            </div>


          </div >
        </Grid >
        {/* Bearing Information */}
        <Grid item xs={12} style={{ border: '1px solid rgb(230, 230, 230)' }}>
           <div style={classes.outerGrid}>
            <div style={classes.assetInfoBox}>
              <div style={classes.assetInfoName}>
              <Typography value={t("Bearing Information")} variant={"Caption1"}></Typography>
              </div>
              <div style={{ direction: "column", alignItems: "center" }}>
                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={4} sm={4}>
                    {renderOtherBearingAssetContent("bearing_information")}
                  </Grid>
                  <Grid item xs={4} sm={4}>

                    {assetData.length > 0 && assetData.filter(data => data.name === "bearing_information").map(val => {
                      return (
                        val.details.map((det, ind) =>
                          ind >= 3 && ind <= 5 ?
                          renderDivContent(det)
                            : null
                        )
                      )
                    }
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4}>

                    {renderMachineAssetContent("bearing_information")}
                  </Grid>
                </Grid>
              </div>

            </div>


          </div>
        </Grid>
      </Grid >
    </div >

  );
}
