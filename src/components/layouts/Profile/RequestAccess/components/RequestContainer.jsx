import React,{useState,useEffect}  from "react";
import Grid from "components/Core/GridNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import PrimaryButton from "components/Core/ButtonNDL"; 
import { useTranslation } from "react-i18next";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
const RequestContainer = (props) => {
const { t } = useTranslation();
const [value,setValue] = useState('')
  const onchangeValue = (e) => {
    props.onclose();
    if (e.target.value) {
      setValue(e.target.value)
    }
  }
  
useEffect(() => {
if(props.requestData.gaia_plant_name ==='' &&
 props.requestData.country_name ==='' && 
 props.requestData.business_name === '' &&
  props.requestData.activity_name ===''){
  setValue({gaia_plant_name:''})

}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [props.requestData.gaia_plant_name]);

  return (
    <React.Fragment>
      <Grid item xs={3} sm={3}>
        <Card >
          <div
            style={{ height: 32 }}
          
          >
            <ParagraphText
           
                variant="heading-02-xs"
                value={t("RequestAccess")}
                color={props.curTheme === "light" ? "#242424" : "#A6A6A6"}
              />
          </div>
                  {/* <HorizontalLine variant="divider1"  middle /> */}


          <div >
            <Grid container spacing={2} >
              <Grid item xs={12} sm={12}>
              </Grid>
              <Grid item xs={12} sm={12}>
              <SelectBox 
                    label={t("Line")}
                    id="requestAccess"
                    auto={true} 
                    
                    value={value}

                    multiple={false}
                    options={props.lineList}
                    isMArray={true}
                    checkbox={false}
                    onChange={(event, data) => {
                        let newValue = data.filter(x=> x.gaia_plant_name === event.target.value)
                        setValue(event.target.value)
                        props.onclose();
                        props.onHandleLine(newValue[0])
                    }}
                    onInputChange={(e) => {
                        onchangeValue(e)
                    }}
                    keyValue="gaia_plant_name"
                    keyId="gaia_plant_name" 
                    subtext="subtext" 
                />
              </Grid>
              <Grid item xs={12} sm={12}>
              </Grid>
              <Grid item xs={12} sm={12}>
                
                <SelectBox
                labelId="Role"
                label={t("Role")}
                options={props.roles}
                isMArray={true}
                checkbox={false}
                value={props.requestData.role_id}
                onChange={(e) => props.handleRoleChange(e)}
                keyValue="role"
                keyId="id"
                id="Role"
                // error={!props.showError ? true : false}
                msg={props.errorMsg}
                />
                
              </Grid>
              {props.showError ? (
                <Grid item xs={12} sm={12}>
                  <ParagraphText
                    variant="label-02-s"
                    value={props.errorMsg}
                    style={{color:"red"}}
                  />
                </Grid>
              ) : null}
              {/* <hr /> */}
              <Grid item xs={12} sm={12}>
              </Grid>
              <Grid item xs={12} sm={12}>
              <SelectBox
                  id="SelectActivity"
                  options={props.activity} 
                  keyValue="name"
                  keyId="id"
                  onChange={(e)=>props.handleSelect(e,"activity_name","business_name")}
                  auto={false}
                  isMArray={false}
                  label={t("Activity")}
                  value={props.requestData.activity_name}

              />
                
              </Grid>

              <Grid item xs={12} sm={12}>
               
              </Grid>

              <Grid item xs={12} sm={12}>
              <SelectBox
                  id="SelectBussiness"
                  options={props.businessName}
                  keyValue="name"
                  keyId="id"
                  menuName={"Business Name"} 
                  dependsOn=""
                  onChange={(e)=>props.handleSelect(e,"business_name","country_name")} 
                  auto={false}
                  isMArray={false}
                  label={ t("Business")}
                  value={props.requestData.business_name}

              />
                
              </Grid>

             

              <Grid item xs={12} sm={12}>
              
              </Grid>
              <Grid item xs={12} sm={12}>
              <SelectBox
                  id="SelectLocation"
                  options={props.countryName}
                  keyValue="name"
                  keyId="id"
                  menuName={"Country Name"} 
                  dependsOn=""
                  onChange={(e)=>props.handleSelect(e,"country_name","gaia_plant_name")} 
                  auto={false}
                  isMArray={false}
                  label={t("Location")}
                  value={props.requestData.country_name}

              />
               
              </Grid>

              

              <Grid item xs={12} sm={12}>
               
              </Grid>
              <Grid item xs={12} sm={12}>
              <SelectBox
                  id="SelectPlant"
                  options={props.plantName}
                  keyValue="name"
                  keyId="id"
                  menuName={"Plant Name"} 
                  dependsOn=""
                  onChange={(e)=>props.handleSelect(e,"gaia_plant_name","gaia_plant_name")}  
                  auto={false}
                  isMArray={false}
                  label={" "+ t("Plant")}
                  value={props.requestData.gaia_plant_name}

              />
               
              </Grid>

              <Grid item xs={12} sm={12} style={{marginTop:"8px"}}>
                <PrimaryButton
                  onClick={props.submitAccessReq}
                  style={{ width: "100%" }}
                  value={t("Submit")}
                />
              </Grid>
            </Grid>
          </div>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

export default RequestContainer;
