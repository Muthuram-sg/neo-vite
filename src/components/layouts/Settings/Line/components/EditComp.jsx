import React, { useEffect, useState } from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import GiaHierarchy from './giaHierarchy'
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Button from 'components/Core/ButtonNDL'
import { useTranslation } from "react-i18next";
const EditComp = (props) => {
  const { t } = useTranslation();
  const [PlantID, setPlantID] = useState([])
  useEffect(() => {

    setPlantID(props.value.ChildLineID)
  }, [props.value.userDefaultline, props.value.ChildLineID])

  function handlePlants(value) {

    props.value.setChildLine(value)
  }
  const handleDialogClosefn = () => {
    props.handleDialogClose();



  }
  const handlesaveClick = () => {
   
    props.handleSaveFunction()
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

            label={t("Name")}
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

                auto={true}
                multiple={true}
                options={props.value.userDefaultline.map(e => { return e.line }).filter(f => f.type === "2")}
                isMArray={true}
                checkbox={false}
                value={PlantID}
                onChange={(e, option) => handlePlants(e, option)}
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

            label={t("Location")}
          />




        </ModalContentNDL>
        <ModalFooterNDL>
          <Button type="secondary" value={t('Cancel')} style={{ width: "80px" }} onClick={() => handleDialogClosefn()} />

          <Button type="primary" value={t('Update')}  style={{ width: "80px" }} onClick={() => handlesaveClick()} />


        </ModalFooterNDL>
      </React.Fragment >
    </div>
  )
}

export default EditComp
