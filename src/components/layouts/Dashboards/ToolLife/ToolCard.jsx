import React, { useState, useRef, forwardRef, useEffect } from 'react';

import Typography from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import Vector from 'assets/neo_icons/Equipments/702.svg?react';
import Status from 'assets/neo_icons/Equipments/Status.svg?react';
import Refresh from 'assets/neo_icons/Equipments/refresh.svg?react';

import Asset from 'assets/neo_icons/Equipments/circuit-motor.svg?react';
import InactiveStatus from 'assets/neo_icons/Equipments/InactiveStatus.svg?react';
import usePartSignalStatus from 'Hooks/usePartSignalStatus';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ModalNDL from 'components/Core/ModalNDL';

import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import { socket } from 'components/socket';

import { refesh_neo_token } from 'config';
import Grid from 'components/Core/GridNDL'
import moment from 'moment';

const ToolCard = forwardRef((props, ref) => {
    const [mqttData, setmqttData] = useState('')
    const [Count, setCount] = useState(0)
    const [LiveCount, setLiveCount] = useState(0)
    const [recentTime, setrecentTime] = useState('')
    const [IsActive, setIsActive] = useState(false)
    const [showcard, setshowcard] = useState(false)
    const [ResetDialog, setResetDialog] = useState(false)

    const { partLoading, partData, partError, getPartsCompleted } = usePartSignalStatus();
    let timeval = props.data.limit_ts ? props.data.limit_ts.split(":") : ''
    let actDiff = timeval ? moment().subtract(Number(timeval[0]), 'days').subtract(Number(timeval[1]), 'hours').subtract(Number(timeval[2]), 'minutes') : ''
    let timeLimit = actDiff ? moment.duration(moment().diff(moment(actDiff))).asSeconds() : 300

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useEffect(() => {
        getPartsCompleted(props.data.schema, props.data.data, moment(props.data.reset_ts ? props.data.reset_ts : props.data.created_ts).format('YYYY-MM-DDTHH:mm:ssZ'), moment().format('YYYY-MM-DDTHH:mm:ssZ'), false, [], [], 0)
        // console.log(props.data,"Toolconfig")
        refesh_neo_token("", (token) => {
            // console.log("INSISISISISISI__________________")
            socket.auth = { 'token': token }
            localStorage.setItem('neoToken', token)
        })
        LiveTool()
    }, [props.data])


    useEffect(() => {
        if (partData && partData !== null) {
            if (partData.length > 0) {
                setCount(partData[0] && partData[0].data && Array.isArray(partData[0].data) ? partData[0].data.length : 0)
                let time = 'NA'
                let diff = 0

                if (partData[0].data && Array.isArray(partData[0].data) && partData[0].data.length > 0) {
                    time = moment(partData[0].data[0].time).format('DD/MM/YYYY HH:mm:ss')
                    diff = moment.duration(moment().diff(moment(partData[0].data[0].time))).asSeconds()
                }
                // console.log(diff,"diffdiffdiffdiff",timeLimit,props.data.limit_ts,timeval,actDiff) 
                if (diff && diff < timeLimit) {
                    setIsActive(true)
                    props.StatusList({ name: props.name, IsActive: true })
                } else {
                    setIsActive(false)
                    props.StatusList({ name: props.name, IsActive: false })
                }
                setrecentTime(time)
                setTimeout(() => {
                    refesh_neo_token("", (token) => {
                        socket.auth = { 'token': token }
                        socket.open()
                        // console.log("Z - INITIAL JOIN")
                        // socket.disconnect()
                        initialJoinRoom()
                        // custome_dashboard_data = []
                    })
                }, 1000)
            }
            // console.log(partData,"partDatapartDataTools")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partData, partLoading, partError])

    useEffect(() => {
        if (props.showStatus === 1) {
            setshowcard(true)
        } else if (props.showStatus === 2 && IsActive) {
            setshowcard(true)
        } else if (props.showStatus === 3 && !IsActive) {
            setshowcard(true)
        } else {
            setshowcard(false)
        }

        // console.log(props.showStatus,"props.showStatusprops.showStatus")
    }, [props.showStatus, IsActive])

    useEffect(() => {
        if (mqttData) {
            // console.log(LiveCount,"LiveCountLiveCount",mqttData,props.data.data[0].part_signal_instrument)
            if ((mqttData.iid).toString() === props.data.data[0].part_signal_instrument[0] && Number(mqttData.value) === 1) {
                setLiveCount(LiveCount + 1)
                setrecentTime(moment(mqttData.time).format('DD/MM/YYYY HH:mm:ss'))
                setIsActive(true)
                props.StatusList({ name: props.name, IsActive: true })
            }
        }
    }, [mqttData])

    const initialJoinRoom = () => {
        // For Custom Dashoard - socket Connection
        try {
            // console.log("JOIN ROOM - Connected -",socket.connected,props.headPlant)

            if (props.data) {
                console.log("OBJECT", props.data)
                // data = [ ...data, props.detail?.meta?.metric[0]?.split('-')[0]]
                // // console.log( props.detail?.meta)
                let iid = props.data.data[0].part_signal_instrument
                iid.map(v => {
                    socket.emit('join_room', `${props.headPlant?.schema}/data/${v}/part_count`);
                })
                // roomsdata.push(`${props.detail?.meta?.instrument}/${props.detail?.meta?.metric[0]?.split('-')[0]}`)

            }

        } catch (e) {
            console.log(e)
        }
    }

    function LiveTool() {
        socket.on('mqtt_message', (msg) => {
            console.log("mqtt_message", JSON.parse(msg.message))
            // let 
            setmqttData(JSON.parse(msg.message))


        });

        socket.on('disconnect', (reason) => {
    
            refesh_neo_token("", (token) => {
   
                reconnect(token)
            })
        })

        socket.on('connect', () => {
            console.log("Connected to Socket - ")
          
        })
    }

    const reconnect = (token) => {
        // console.log("RECONNECT TOKEN  - ", token)
        socket.auth = { 'token': token }
        if (!socket.connected) {
            socket.open()
            socket.connect()
            // props.endrefresh()
        }
        let iid = props.data.data[0].part_signal_instrument
        iid.map(v => {
            socket.emit('join_room', `${props.headPlant}/data/${v}/part_count`, (response) => {
                console.log('Server acknowledged the message:', response);
            })
        })


    }

    useInterval(() => {
        if (mqttData) {
            let diff = moment.duration(moment().diff(moment(mqttData.time))).asSeconds()
            if (diff > timeLimit) {
                // console.log(diff,"diff",recentTime,mqttData)
                setIsActive(false)
                props.StatusList({ name: props.name, IsActive: false })
            }
        }

    }, 10000);

    function ResetFnc() {
        props.resetTool(props.data)
        setLiveCount(0)
        handleDialogClose()
    }

    function handleDialogClose() {
        setResetDialog(false)
    }

    const getToolLifeColor = (val) => {
        // console.log("valvalColor", val)
        if (props.data.warning && val >= props.data.warning && val < props.data.critical) {
            return "#EF5F00"
        }
        else if (val >= props.data.critical) {
            return "#CE2C31"
        }
        
        else {
            return "#646464"
        }
    }

    return (
        <React.Fragment>
            {showcard &&
                <Grid item xs={3}>

                    <Card
                        elevation={0}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ height: "100%" }}>
                            <div className="flex justify-between items-center text-center">
                                <div className="flex items-center gap-1">
                                    <Asset />
                                    {partLoading && <div ><CircularProgress /></div>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {IsActive ? <Status /> : <InactiveStatus />}
                                    <Tooltip title={'Reset'} placement={'bottom'}>
                                        <Refresh onClick={() => setResetDialog(true)} />
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 items-baseline mt-3">
                                <Typography
                                    variant="Label 02-S"
                                    value={props.name}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: "100%",
                                        textAlign: "left"
                                    }}
                                ></Typography>
                                <Typography
                                    variant="Label 02-S"
                                    color={"tertiary"}
                                ><Vector />{"    " + props.asset_name}</Typography>
                                <Typography
                                    mono
                                    variant="Label 02-S"
                                    style={{ color: getToolLifeColor(Count + LiveCount ) }}
                                    value={Count + LiveCount + "/" + props.limit}
                                ></Typography>
                                <Typography
                                    mono
                                    variant="Label 02-S"
                                    color={"tertiary"}
                                    value={"Loaded at " + (recentTime)}
                                ></Typography>
                            </div>
                        </div>
                    </Card>

                </Grid>}
            <ModalNDL disableEnforceFocus onClose={handleDialogClose} aria-labelledby="Tool-dialog-title"

                open={ResetDialog}
            >
                <ModalHeaderNDL>
                    <Typography value={'Confirmation'} variant='heading-02-xs' />
                </ModalHeaderNDL>

                <ModalContentNDL>
                    <Typography variant="lable-01-s" color="secondary" value={'Do you really want to reset the limit for this tool? This action confirms that you are aware of this action. This action cannot be undone.'} />

                </ModalContentNDL>

                <ModalFooterNDL>
                    <Button type={"secondary"} style={{ width: "80px" }} value={'Cancel'} onClick={() => handleDialogClose()} />
                    <Button type={"primary"} style={{ width: "80px" }} value={'Reset'} onClick={() => ResetFnc()} />

                </ModalFooterNDL>
            </ModalNDL>
        </React.Fragment>
    )
})

export default ToolCard;