import React, { useEffect, useState } from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import GiaHierarchy from './giaHierarchy'
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ImageUploadwithPreview from 'components/Core/ImageUploadWithPreview';
import Button from 'components/Core/ButtonNDL'
import { useTranslation } from "react-i18next";
const EditComp = (props) => {
  const { t } = useTranslation();
  const [PlantID, setPlantID] = useState([])
  const [custName,setCustName] = useState(props.customName)
  const [validNameError, setValidNameError] = useState(false);
  const [validLocationError, setValidLocationError] = useState(false);

  useEffect(() => {
    setPlantID(props.value.ChildLineID)
  }, [props.value.userDefaultline, props.value.ChildLineID])

  function handlePlants(value) {

    props.value.setChildLine(value)
  }
  const handleDialogClosefn = () => {
    props.handleDialogClose();

  }

  useEffect(() => {
    // console.clear()
    // console.log(props.asset)
  })

  const handlesaveClick = () => {
    const name = props.value.nameRef?.current?.value || "";
    const location = props.value.locationRef?.current?.value || "";
  
    const isNameEmpty = name.trim() === "";
    const isLocationEmpty = location.trim() === "";
  
    setValidNameError(isNameEmpty);
    setValidLocationError(isLocationEmpty);
  
  
    if (!isNameEmpty && !isLocationEmpty) {
      props.handleSaveFunction?.();
    }
  };
  
  
 
  return (
    <div>
      <React.Fragment>
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" model value={"Edit Line Info"} />
          {/* <TypographyNDL variant="paragraph-xs" model value={"Personalize your factory's identity, location, and business hierarchy "} /> */}
        </ModalHeaderNDL>
        <ModalContentNDL>

        
         
          <InputFieldNDL
            id="line-plant"
            defaultValue={props.value.lineName}
            inputRef={props.value.nameRef}
            mandatory
            label={t("Name")}
            error={validNameError ? true :false}
            helperText={validNameError ? "Please Enter Name value" :""}
          />
      <div className="mt-3" />
         
            <GiaHierarchy
            backgroundColor={props.value.backgroundColor}
            color={props.value.color}
            headPlantid={props.value.headPlantid}
            activityName={props.value.activityName}
            businessName={props.value.businessName}
            plantName={props.value.plantName}
          />
          {(props.value.type === '1') &&
            <div style={{ lineHeight: "0", marginTop: "10px" }}>
             
              <SelectBox
                label={"Plants"}
                id="select-part-signal"
                edit={true}
                mandatory
                auto={true}
                multiple={true}
                options={props.value.userDefaultline.map(e => { return e.line }).filter(f => f.type === "2")}
                isMArray={true}
                checkbox={false}
                value={PlantID}
                onChange={(e, option) => handlePlants(e)}
                keyValue="name"
                keyId="id"
              />
            </div>
          }

      <div className="mt-3" />
        
          <InputFieldNDL
            id="line-location"
            defaultValue={props.value.locationName}
            inputRef={props.value.locationRef}
            mandatory
            label={t("Location")}
            error={validLocationError ? true :false}
            helperText={validLocationError ? "Please Enter Location value" :""}
          />

      <div className="mt-3" />
          <InputFieldNDL
            id="line-customName"
            defaultValue={props.value.customName}
            inputRef={props.value.customNameRef}
            maxLength={15}
            // helperText={'Personalize by setting a custom name. If left blank, the default name will be used.'}
            // value={custName || props.customName}
            // onChange={(e) => {setCustName(e.target.value);props.setCustomName(e.target.value)}}
            label={'Custom App Name'}
          />
          <TypographyNDL style={{marginTop: '1px'}} variant="paragraph-xs" color='secondary' value={"Personalize by setting a custom name. If left blank, the default name will be used."} />

      <div className="mt-3" />
          <TypographyNDL variant="paragraph-xs BoldNormal" model value={"Custom App Logo"} />
          <div className="mt-3" />
          <TypographyNDL style={{marginTop: '1px'}} variant="paragraph-xs" color='secondary' value={"Personalize by uploading a company logo (Maximum of 150x24 px) in PNG or SVG with light and dark theme. If not uploaded, the default logo will remain."} />
          <div className="mt-3" />
          <div className="mt-1" style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <ImageUploadwithPreview
              asset={props.asset.light_logo}
              id={'light_logo'}
              handleFile={(e) => props.handleFile(e, 'light_logo')}
              removeFile={() => props.removeFile('light_logo')}
              iconFor={'Light Theme'}
            />
            <ImageUploadwithPreview
              asset={props.asset.dark_logo}
              id={'dark_logo'}
              handleFile={(e) => props.handleFile(e, 'dark_logo')}
              removeFile={() => props.removeFile('dark_logo')}
              iconFor={'Dark Theme'}
            />
          </div>

          <div className="mt-3" />
          <TypographyNDL variant="paragraph-xs BoldNormal" model value={"Custom Favicon"} />
          <div className="mt-3" />
          <TypographyNDL variant="paragraph-xs" color='secondary' value={"Personalize with a PNG or SVG favicon (32x32 px) for light and dark theme. If not uploaded, the default favicon will remain."} />
          <div className="mt-3" />
          <div className="mt-1" style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <ImageUploadwithPreview
              asset={props.asset.light_favicon}
              id={'light_favicon'}
              handleFile={(e) => props.handleFile(e, 'light_favicon')}
              removeFile={() => props.removeFile('light_favicon')}
              iconFor={'Light Theme'}
            />
            <ImageUploadwithPreview
              asset={props.asset.dark_favicon}
              id={'dark_favicon'}
              handleFile={(e) => props.handleFile(e, 'dark_favicon')}
              removeFile={() => props.removeFile('dark_favicon')}
              iconFor={'Dark Theme'}
            />
          </div>




        </ModalContentNDL>
        <ModalFooterNDL>
          <Button type="secondary" value={t('Cancel')} style={{ width: "80px" }} onClick={() => handleDialogClosefn()} />
          <Button type="primary" value={t('Update')} loading={props.outLineUpdateLoading} style={{ width: "80px" }} onClick={() => handlesaveClick()} />


        </ModalFooterNDL>
      </React.Fragment >
    </div>
  )
}

export default EditComp
