import React, {useEffect, useState} from "react";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import GateWayIcon from 'assets/neo_icons/Dashboard/GateWay.svg?react';
import Status from 'components/Core/Status/StatusNDL'
import { useTranslation } from 'react-i18next';
import ThreeDotMenu from 'assets/neo_icons/FaultAnalysis/DotsThreeVertical.svg?react';
import Button from 'components/Core/ButtonNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import  useTheme from "TailwindTheme";
import circledashed from 'assets/neo_icons/Dashboard/circle-dashed.svg?react';
import useSentConnectivityNotification from '../hooks/useSentConnectivityNotification' 
import useGetConnectivityChannels from '../hooks/useGetConnectivityChannels' 
import moment from 'moment'
import { useRecoilState } from 'recoil'
import { selectedPlant,snackToggle, snackMessage, snackType } from 'recoilStore/atoms'


export default function List(props){
    const [open, setOpen] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [ uniqueParameters, setuniqueParameters ] = useState([]);
    const [headPlant] = useRecoilState(selectedPlant);
    const { ConnectivitySendEmailLoading, ConnectivitySendEmailError, ConnectivitySendEmailData, getConnectivitySendEmail } = useSentConnectivityNotification();
    const { connectivityChannelsLoading, connectivityChannelsData, connectivityChannelsError, getConnectivityChannels } = useGetConnectivityChannels();
    const [threeDotMenuOption] = useState([{ id: 1, name: t("Send Notification"), disabled: false, icon: circledashed, stroke: theme.colorPalette.primary  }])

        useEffect(()=>{
            const type = '1a73df77-90f5-4d42-bc4b-f11b4520004e' 
            getConnectivityChannels(type)
        },[headPlant])

        useEffect(()=>{
            if(!ConnectivitySendEmailLoading && !ConnectivitySendEmailError && ConnectivitySendEmailData){
                SetMessage('Notification Sent Successfully')
                SetType("success")
                setOpenSnack(true)
                setOpen(false);
            }
        },[ConnectivitySendEmailLoading, ConnectivitySendEmailError, ConnectivitySendEmailData])

        const onClose = (event)=>{
            setOpen(false);
            setAnchorPos(null)
            event.stopPropagation();
        };

        const handleClick = (event) => {
            setOpen(!open)
            setAnchorPos(event.currentTarget)
            event.stopPropagation()
        };

        const handleThreeDotMenuClick = (value, info) => {
            const mailJson = {
                "isSingle":"2",
                "payload": {
                    "line_name": headPlant ? headPlant.name : "--",
                    "mail_date": moment().format("DD/MM/YYYY"),
                    "iid": info.item.id,
                    "insname": info.item.name,
                    "time": info.item.LastActive,
                    "email": uniqueParameters.join(",") 
                }
            };
        
            getConnectivitySendEmail(mailJson);
        };        

        const processConnectivityChannelsData = (connectivityChannelsData) => {
            if (!connectivityChannelsData || !Array.isArray(connectivityChannelsData)) return [];
        
            const uniqueParameters = [
                ...new Set(
                    connectivityChannelsData
                        .flatMap((item) => item.parameter.split(",").map((param) => param.trim())) 
                ),
            ];
        
            return uniqueParameters;
        };
        
        useEffect(() => {
            if (!connectivityChannelsLoading && connectivityChannelsData && !connectivityChannelsError) {
        
                setuniqueParameters(processConnectivityChannelsData(connectivityChannelsData))
            }
        }, [connectivityChannelsLoading, connectivityChannelsData, connectivityChannelsError]);


    return(
        <Grid item sm={3} lg={3}> 

        <KpiCards >
        <div className="flex items-center justify-between ">
            <GateWayIcon />
            <Status lessHeight style={{ color: "#FFF7F7", backgroundColor: props.item.status === "Active" ? "#30A46C" : "#CE2C31", textAlign: "-webkit-center" }} name={props.item.status} />
        </div>
        <Typography variant={"label-02-s"} value={props.item.name} />

        <div className="flex items-center justify-between">
            <Typography
                color="tertiary"
                mono
                variant="paragraph-xs"
                value={`${t('LastActiveAt')} ${props.item.LastActive}`}
            />
           {props.item.status === "Inactive" && (
                <React.Fragment>
                    <Button icon={ThreeDotMenu} type="ghost" onClick={handleClick} />
                    <ListNDL
                        options={threeDotMenuOption}
                        Open={open}
                        optionChange={(value) => handleThreeDotMenuClick(value, props)}
                        keyValue={"name"}
                        keyId={"id"}
                        id={"popper-alert-card"}
                        onclose={(e) => onClose(e)}
                        anchorEl={AnchorPos}
                        width="200px"
                        isIcon
                    />
                </React.Fragment>
            )}
            {props.item.status === "Active" && (
               
                    <Button icon={ThreeDotMenu} type="ghost" disabled={true} />
               
            )}
            </div>
    </KpiCards>

         </Grid>
    )
}