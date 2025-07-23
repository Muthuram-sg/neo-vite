import React, { useState, useEffect } from "react";

import Tile from './Tile'
import {
    snackToggle,
    snackMessage,
    snackType, 
  } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import { useMutation } from "@apollo/client";
import configParam from "config";
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import ButtonNDL from 'components/Core/ButtonNDL';





export default function CustomDashboardTileView(props) {
    console.log(props.ReportList, "props.ReportList")
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [isDeleteModel,setisDeleteModel] =useState(false)
    const [selectedReport,setselectedReport] = useState('')
    const [BtnLoading,setBtnLoading] = useState(false)
    const [reportName,setreportName] = useState('')
  
    const handleDetele=(id,name)=>{
        setisDeleteModel(true)
        setselectedReport(id)
        setreportName(name)
    }
    const [deleteReport, { error: deleteErr, }] = useMutation(
        configParam.deleteReport,
        {
          update: (inMemoryCache, returnData) => {
            if (!deleteErr) {
              props.cancelReport();
              props.getSavedReports({}, 'Deleted');
              props.resetTags()
               setisDeleteModel(false)
               setBtnLoading(false)

    
          }
        }
        }
      );

      useEffect(() => {
        if (deleteErr) {
          setSnackMessage("Unable to Delete the Report");
          setSnackType("error");
          setOpenSnack(true);
          setisDeleteModel(false)
          setBtnLoading(false)

    
        }
      }, [deleteErr]);

      const handleModelClose=()=>{
        setisDeleteModel(false)
        
      }

      const handleConfirmDelete=()=>{
        setBtnLoading(true)
        deleteReport(({variables: { id: selectedReport,status:2} }))
      }
    return (
      <React.Fragment>

        <div  className="flex flex-wrap gap-4 p-4 justify-start bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ">
            {props.ReportList.map((x, i) => {
                return (
                    <Tile handleEditOpen={props.handleEditOpen}  InsertStarReportLoading={props.InsertStarReportLoading} starLoaderId={props.starLoaderId} handleTrigerStar={props.handleTrigerStar} x={x} key={i} handleCustomReportOpen={props.handleCustomReportOpen} handleDetele={handleDetele} />
                )
            })


            }
        </div>

        <ModalNDL open={isDeleteModel} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" value={"Delete Report"} />
        </ModalHeaderNDL>
        <ModalContentNDL>
        <TypographyNDL variant="paragraph-s" color="secondary" value={`Do you really want to delete the ${reportName}? This action cannot be undone.`} />
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL
          type='secondary'
            value={"Cancel"}
            onClick={handleModelClose}
          />
          <ButtonNDL value={"Delete"} danger loading={BtnLoading} onClick={handleConfirmDelete}    />
        </ModalFooterNDL>
      </ModalNDL>
      </React.Fragment>

    )

}