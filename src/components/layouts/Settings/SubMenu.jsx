import React from "react";
import Line from "./Line/NewLine";
import Hierarchy from "./HierarchySetting/HierarchySetting"; 
import Metrics from "./Metrics/MetricsSetting";
import Gateway from "./Gateway";
import MetricsGroup from "./MetricsGroup";
import Notify from './NotifySetting';
import Tool from './ToolLifeMonitoring/index';

export const MenuList =[
    {
        title:'Line',
        content:<Line />,
        tabValue:0
    },
    {
        title:'Hierarchy',
        content:<Hierarchy/>,
        tabValue:1
    },
    {
        title:'Gateway',
        content:<Gateway/>,
        tabValue:2
    },
    {
        title:"Metrics",
        content:<Metrics/>,
        tabValue:3
    },
    {
        title:"Channels",
        content:<Notify/>,
        tabValue:4
    },
    {
        title:"Tools",
        content:<Tool/>,
        tabValue:5
    }, 
    {
        title:'Metrics Group',
        content:<MetricsGroup/>,
        tabValue:6
    }
    
]
