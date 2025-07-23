
import React, { useState, useEffect } from "react";
import Draggable from 'react-draggable';
import {
    currentDashboardSkeleton,
    defaultDashboard,
    user,
    dashboardEditMode,
    EnableRearrange,
  } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

import useUpdateDashData from "../../hooks/useUpdateDashData.jsx";
import useDashboardFetch from "../../hooks/useGetDashboardUploads.jsx"


const DataOverImage = (props) => {

    const [, setPosition] = useState({})
    useEffect(() => {
        let temp = {}
        props.meta.metric.map((x, i) => {
            temp[i] = {x: 0, y: 0}
        })
        setPosition(temp)
    }, [])



    const [selectedDashboardSkeleton, setSelectedDashboardSkeleton] = useRecoilState(currentDashboardSkeleton);
    const [dashboardDefaultID] = useRecoilState(defaultDashboard);
    const [rearrange] = useRecoilState(EnableRearrange)
    const [currUser] = useRecoilState(user);
    const [editMode] = useRecoilState(dashboardEditMode); 
    const {
        getUpdateDashData,
      } = useUpdateDashData();
    const {
        dashboardFetchData,
        getFetchDashboardUploadsDocs
    } = useDashboardFetch()

    useEffect(() => {
        if(props.meta?.image){
            getFetchDashboardUploadsDocs(props?.meta?.image?.id)
        }
    }, [props])
    const getvalue = (val) => {
        
        return props.data
            .filter(x => x.key === val)
            ?.sort((a, b) => new Date(b.time) - new Date(a.time))
            ?.[0]?.value || '-'
    }

    const updatePosition = (index, x, y) => {
        console.clear()
        // console.log(index, x, y)
       
        let selectedDashboard = JSON.parse(
            JSON.stringify(selectedDashboardSkeleton)
          )
        let tempData = JSON.parse(JSON.stringify(selectedDashboard.dashboard));
        let tempLayout = JSON.parse(JSON.stringify(selectedDashboard.layout));
        const keys = Object.keys(tempData.data);
        let len = 0;
        let existPosition = props?.meta?.position
        keys.forEach((z) => {
            if(tempData.data[z].meta.image && tempData.data[z].meta.image.id === props.meta.image.id){
                len = z
            }

        })

        tempData.data[(len).toString()]['meta']['position'] = { ...existPosition, [index]: { 'x':x, 'y':y }}
      
        tempLayout.lg.push({
            w: 2,
            h: 2,
            x: (len * 2) % (tempData.cols || 12),
            y: Infinity,
            i: len.toString(),
          });
          tempLayout.sm.push({
            w: 2,
            h: 2,
            x: (len * 2) % (tempData.cols || 12),
            y: Infinity,
            i: len.toString(),
          });
          tempLayout.md.push({
            w: 2,
            h: 2,
            x: (len * 2) % (tempData.cols || 12),
            y: Infinity,
            i: len.toString(),
          });
          tempLayout.xs.push({
            w: 2,
            h: 2,
            x: (len * 2) % (tempData.cols || 12),
            y: Infinity,
            i: len.toString(),
          });
  
          localStorage.setItem("currentLayout", JSON.stringify(tempLayout));
          let obj = { layout: tempLayout, dashboard: tempData };
          setSelectedDashboardSkeleton(obj);
          getUpdateDashData({
            dashboard: tempData,
            dash_id: dashboardDefaultID,
            user_id: currUser.id,
          });

        
    }

    return (
        <div>
            {dashboardFetchData?.data?.image && <img width={props.width} style={{ height: props.height ,position: 'absolute', zIndex: 1 }} src={`data:image/png;base64,${dashboardFetchData?.data?.image}`} />}
            <div className="parent" style={{ height: props.height-5, width: props.width-5, position: 'absolute', zIndex: 3 }}>
            {
                props?.meta?.metric.map((x, i) => {
                    return (
                        <Draggable key={i} bounds="parent" disabled={!editMode ? true : !rearrange} position={props.meta?.position[i]}   onStop={(e, data) => { updatePosition(i, data.x, data.y)} }>
                            <div style={{  cursor: 'grab', borderWidth: '1px', borderColor: 'black',  backgroundColor: 'black', color: 'white', width: "fit-content", borderRadius: 5, padding: 5 }}>
                                {x.split('-')[1]} <br/> { (!isNaN(props?.meta.decimalPoint) && getvalue(x.split('-')[0])!== '-') ? Number(getvalue(x.split('-')[0])).toFixed(Number(props?.meta.decimalPoint)) : getvalue(x.split('-')[0])} {x.split('-')[x.split('-')?.length-1]}<br/></div>
                        </Draggable>
                    )
                })
            }
            </div>
        </div>
    )
}

export default DataOverImage;