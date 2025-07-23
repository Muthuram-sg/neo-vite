import React, { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Datacapsule from "components/Core/Data Capsule/DatacapsuleNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import useGetInstrumentList from "components/layouts/Alarms/hooks/useGetInstrumentList";
import Clock from 'assets/clock.svg?react';

const ModelFaultDetails = forwardRef(({ onClose, info, props, alarmDefectData, assetname, headPlant }, ref) => {
    const { InstrumentListData,getInstrumentList } = useGetInstrumentList();
    const { t } = useTranslation();

    useEffect(()=>{
        getInstrumentList(headPlant)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])

    const renderAlarmDefectDetails = () => {
        const uniqueDefects = alarmDefectData.reduce((acc, defect) => {
            const existingDefect = acc.find((d) => d.fault === defect.fault);
            if (!existingDefect || new Date(defect.time) > new Date(existingDefect.time)) {
                return acc.filter((d) => d.fault !== defect.fault).concat(defect);
            }
            return acc;
        }, []);

        return uniqueDefects?.map((defect, index) => {
            let iid = defect.iid;
            if (InstrumentListData && InstrumentListData.length > 0) {
                const matchedInstrument = InstrumentListData.find((x) => x.id === defect.iid);
                if (matchedInstrument) {
                    iid = matchedInstrument.name;
                }
            }
            let colorbg;
            if(defect.severity) {
                if(defect.severity === "-1"){
                    colorbg = "green";
                }
                else if(defect.severity === "1"){
                    colorbg = "yellow";
                }
                else if(defect.severity === "2"){
                    colorbg = "orange";
                }
                else if(defect.severity === "3"){
                    colorbg = "red";
                }
                else {
                    colorbg = "silver"
                }
            }

            return (
                <div key={defect.iid || defect.time} style={{ marginBottom: "25px" }}>
                    <div className="flex flex-row gap-2 items-center" style={{ marginBottom: "8px" }}>
                        <Datacapsule name={iid} value={defect.fault} colorbg={colorbg} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                    <Clock style={{ width: "16px", height: "16px" }} />
                    <TypographyNDL
                             variant="paragraph-xs"
                        color="secondary"
                        value={new Date(defect.time).toLocaleString()}
                        style={{ marginBottom: "8px" }}
                                    />
                                </div>
                    <TypographyNDL
                        variant="lable-01-s"
                        value={"Recommendation"}
                        style={{ marginBottom: "4px" }}
                    />
                    <TypographyNDL
                        variant="paragraph-xs"
                        value={defect.recommendation}
                        style={{ marginBottom: "8px" }}
                    />
                  <HorizontalLine variant={"divider1"} style={{ marginTop: "8px" }} />
                </div>
            );
        });
    };    

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <div className="flex items-center justify-between w-screen">
                    <div className="flex flex-col gap-2">
                    <TypographyNDL variant="heading-02-xs" value={t("PDM Faults")} />
                    </div>
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>
            <TypographyNDL variant="heading-02-xs" value={assetname} />
                <div style={{ height: "25vh", margin: "16px 0" }}>
                    {alarmDefectData?.length > 0 && renderAlarmDefectDetails()}
                </div>
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button
                    value={t('Close')}
                    type={'secondary'}
                    style={{ marginTop: 10, marginBottom: 10 }}
                    onClick={onClose}
                />
            </ModalFooterNDL>
        </React.Fragment>
    );
});

export default ModelFaultDetails;
