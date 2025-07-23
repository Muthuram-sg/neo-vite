import React from 'react';
import analytics_light from 'assets/neo_icons/Dashboard/Analytics_Light.svg?react';  
import analytics_dark from 'assets/neo_icons/Dashboard/Analytics_Dark.svg?react';
import dash_light from 'assets/neo_icons/Dashboard/dashboard.svg?react';
import dash_dark from 'assets/neo_icons/Dashboard/dashboard_dark.svg?react';
import explore_light from 'assets/neo_icons/Dashboard/explore.svg?react';
import explore_dark from 'assets/neo_icons/Dashboard/explore_dark.svg?react';
import reports_light from 'assets/neo_icons/Dashboard/reports.svg?react';
import reports_dark from 'assets/neo_icons/Dashboard/reports_dark.svg?react';
import dash_lightActive from 'assets/neo_icons/Dashboard/Dashboard_lightActive.svg?react';
import dash_darkActive from 'assets/neo_icons/Dashboard/Dashboard_darkActive.svg?react';
import explore_lightActive from 'assets/neo_icons/Dashboard/Explore_lightActive.svg?react';
import explore_darkActive from 'assets/neo_icons/Dashboard/Explore_darkActive.svg?react';
import forms_lightActive from 'assets/neo_icons/Dashboard/Form_lightActive.svg?react';
import forms_darkActive from 'assets/neo_icons/Dashboard/Form_darkActive.svg?react';
import reports_lightActive from 'assets/neo_icons/Dashboard/Report_lightActive.svg?react';
import reports_darkActive from 'assets/neo_icons/Dashboard/Report_darkActive.svg?react';
import account_light from 'assets/neo_icons/Menu/account.svg?react';
import account_dark from 'assets/neo_icons/Menu/account_dark.svg?react';
import help_light from 'assets/neo_icons/Menu/help.svg?react';
import help_dark from 'assets/neo_icons/Menu/help_dark.svg?react';
import chat_support_light from 'assets/neo_icons/Menu/chat_support.svg?react';
import chat_support_dark from 'assets/neo_icons/Menu/chat_support_dark.svg?react';
import settings_light from 'assets/neo_icons/Menu/settings.svg?react';
import settings_dark from 'assets/neo_icons/Menu/settings_dark.svg?react';
import Production_light from 'assets/neo_icons/Menu/Production_dark.svg?react';
import Production_dark from 'assets/neo_icons/Menu/Production_light.svg?react';
import line_light from 'assets/neo_icons/Dashboard/Line_light.svg?react';
import line_dark from 'assets/neo_icons/Dashboard/Line_dark.svg?react';
import line_active from 'assets/neo_icons/Dashboard/Line_active.svg?react';
import Sprint_History from "assets/What's New.svg?react"
import Offline_instruments from 'assets/neo_icons/Menu/Offline_Instruments.svg?react';
import Alarms_light from 'assets/neo_icons/Dashboard/Alarm.svg?react';
import Tasks_light from 'assets/neo_icons/Dashboard/Task.svg?react';
import Fault_Analysis from 'assets/neo_icons/FaultAnalysis/FaultAnalysis.svg?react';
import Asset_Health from 'assets/neo_icons/AssetHealth/AssetHealth.svg?react';
import Asset_HealthDark from 'assets/neo_icons/AssetHealth/AssetHealth-Dark.svg?react';
import scada_light from 'assets/neo_icons/Equipments/blower.svg?react';
import scada_dark from 'assets/neo_icons/Equipments/blower_dark.svg?react';







import AlarmIcon from 'assets/neo_icons/Menu/newMenuIcon/Alarms.svg?react';
import AnalyticsIcon from 'assets/neo_icons/Menu/newMenuIcon/Analytics.svg?react';
import DashboardIcon from 'assets/neo_icons/Menu/newMenuIcon/Dashboard.svg?react';
import ExploreIcon from 'assets/neo_icons/Menu/newMenuIcon/Explore.svg?react';
import HelpIcon from 'assets/neo_icons/Menu/newMenuIcon/Help.svg?react';
import Notifications from 'assets/neo_icons/Menu/newMenuIcon/Notifications.svg?react';
import OfflineIcon from 'assets/neo_icons/Menu/newMenuIcon/Offline.svg?react';
import PdMIcon from 'assets/neo_icons/Menu/newMenuIcon/PdM.svg?react';
import ProductionIcon from 'assets/neo_icons/Menu/newMenuIcon/Production.svg?react';
import ReportIcon from 'assets/neo_icons/Menu/newMenuIcon/Reports.svg?react';
import SettingsIcon from 'assets/neo_icons/Menu/newMenuIcon/Settings.svg?react';
import TaskIcon from 'assets/neo_icons/Menu/newMenuIcon/Tasks.svg?react';
import WhatsNewIcon from 'assets/neo_icons/Menu/newMenuIcon/WhatNew.svg?react';
import AiIcon from 'assets/neo_icons/NeoAI/AiIcon.svg?react';
import ProBadge from 'assets/neo_icons/NeoAI/Pro_Badge.svg?react';

import AlarmIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Alarms_dark.svg?react';
import AnalyticsIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Analytics_dark.svg?react';
import DashboardIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Dashboard_dark.svg?react';
import ExploreIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Explore_dark.svg?react';
import HelpIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Help_dark.svg?react';
import OfflineIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Offline_dark.svg?react';
import PdMIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/PdM_dark.svg?react';
import ProductionIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Production_dark.svg?react';
import ReportIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Reports_dark.svg?react';
import SettingsIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Settings_dark.svg?react';
import TaskIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/Tasks_dark.svg?react';
import WhatsNewIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/WhatNew_dark.svg?react';
import AiIconDark from 'assets/neo_icons/Menu/newDarkMenuIcon/NeoAi_dark.svg?react';
import { useRecoilState } from 'recoil';
import { selectedPlant } from "recoilStore/atoms";





const Dashboards = React.lazy(() => import("components/layouts/Dashboards/Dashboard"));
// const Scada = React.lazy(() => import("components/layouts/Scada/Scada"));




const Explore = React.lazy(() =>import("components/layouts/Explore/index"))
const Reports = React.lazy(() => import("components/layouts/Reports"));
const Analytics = React.lazy(() => import("components/layouts/Analytics/index.jsx"));
const Support = React.lazy(() => import("components/layouts/Support"));
const Settings = React.lazy(() => import("components/layouts/Settings/index.jsx"));
const RequestAccess = React.lazy(() => import("components/layouts/Profile/RequestAccess"));
const Activity = React.lazy(() => import("components/layouts/Profile/Activity"));
const Profile = React.lazy(() => import("components/layouts/Profile/ProfileSetting"));
const Line = React.lazy(() => import("components/layouts/Line/index"));
const OfflineDAQ = React.lazy(() => import("components/layouts/OfflineDAQ/index")); 
const Alarms = React.lazy(() => import("components/layouts/Alarms/index")); 
const Tasks = React.lazy(() => import("components/layouts/Tasks/NewTask")); 
const FaultAnalysis = React.lazy(() => import("components/layouts/FaultAnalysis/FaultAnalysis"))
const ManageInstruments = React.lazy(() => import("components/layouts/ManageInstruments/index"))
const AssetHealth = React.lazy(() => import("components/layouts/AssetHealth/index"))
const Production = React.lazy(() => import("components/layouts/Settings/Production/Production"));
const ReleaseNotes=React.lazy(() => import("components/layouts/Profile/ReleaseNotes/index"));
const Scada=React.lazy(() => import("components/layouts/Scada/Scada"));
const NeoAi = React.lazy(() => import("components/layouts/NeoAi/index"))
const NewSettings=React.lazy(() => import("components/layouts/NewSettings/index"));
const NeoNix = React.lazy(()=> import("components/layouts/NeoNix"));



const Routes = {
  mainRoutes: [  

    {
      path: "/dashboard",
      name: "dashboard",
      iconLight: DashboardIcon,
      iconDark: DashboardIconDark,
      activeLight: DashboardIcon,
      activeDark: DashboardIconDark,
      component: Dashboards,
      // layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
       moduleName:"/:moduleName",
      type:'monitor',
      moduleId:1,
      isAccordian:true,
      AccordianOpen:false

    },
        
    {
      path: "/scada",
      name: "scada",
      iconLight: scada_light,
      iconDark: scada_dark,
      activeLight: dash_lightActive,
      activeDark: dash_darkActive,
      component: Scada,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
      schema: "/:schema",
      type:'monitor',
      moduleId:20
    },
    {
      path: "/reports",
      name: "reports",
      iconLight: ReportIcon,
      iconDark: ReportIconDark,
      activeLight: ReportIcon,
      activeDark: ReportIconDark,
      component: Reports,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
      type:"monitor",
      moduleId:2,
      isAccordian:true,
      AccordianOpen:false

    },
    {
      path: "/explore",
      name: "explore",
      iconLight: ExploreIcon,
      iconDark: ExploreIconDark,
      activeLight: ExploreIcon,
      activeDark: ExploreIconDark,
      component: Explore,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
      type:'analyze',
      moduleId:3
    },
    {
      path: "/analytics",
      name: "analytics",
      iconLight: AnalyticsIcon,
      iconDark: AnalyticsIconDark,
      activeLight: AnalyticsIcon,
      activeDark: AnalyticsIconDark,
      component: Analytics,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema",
      type:'analyze',
      moduleId:4
    },
    {
      path: "/NeoAI",
      // name: `${headPlant.custom_name} AI` || "Neo AI",
      name: "Neo AI",
      iconLight: AiIcon,
      iconDark: AiIconDark,
      activeLight: AiIcon,
      activeDark: AiIconDark,
      component: NeoAi,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
      schema: "/:schema",
      type:'analyze',
      badge:ProBadge,
      moduleId:5
    },
    {
      path: "/CMSAI",
      name: "CMS AI",
      iconLight: AiIcon,
      iconDark: AiIconDark,
      activeLight: AiIcon,
      activeDark: AiIconDark,
      component: NeoAi,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
      schema: "/:schema",
      type:'analyze',
      badge:ProBadge,
      moduleId:5
    },
    {
      path: "/Tasks",
      name: "Tasks",
      iconLight: TaskIcon,
      iconDark: TaskIconDark,
      activeLight: TaskIcon,
      activeDark: TaskIconDark,
      component: Tasks,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
       moduleId:6, 
      type:'track'

    },
    {
      path: "/production",
      name: "production",
      iconLight: ProductionIcon,
      iconDark: ProductionIconDark,
      activeLight: ProductionIcon,
      activeDark: ProductionIconDark,
      component: Production,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema",
      type:"track",
      isAccordian:true,
      AccordianOpen:false,
      moduleId:7
    },
    {
      path: "/offline",
      name: 'offline',
      iconLight: OfflineIcon,
      iconDark: OfflineIconDark,
      activeLight: OfflineIcon,
      activeDark: OfflineIconDark,
      component: OfflineDAQ,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
      type:"track",
      moduleId:8
      
    },
    {
      path: "/neonix",
      name: "Neonix",
      iconLight: ProductionIcon,
      iconDark: ProductionIconDark,
      activeLight: ProductionIcon,
      activeDark: ProductionIconDark,
      component: NeoNix,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema",
      type:"track",
      isAccordian:true,
      AccordianOpen:false,
      moduleId:21
    },
    {
      path: "/Alarms",
      name: "Alarms",
      iconLight: AlarmIcon,
      iconDark: AlarmIconDark,
      activeLight: AlarmIcon,
      activeDark: AlarmIconDark,
      component: Alarms,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
      type:'act',
      moduleId:9, 
      isAccordian:true,
      AccordianOpen:false
    },
  

   
    {
      path: "/PdM",
      name: "PdM",
      iconLight: PdMIcon,
      iconDark: PdMIconDark,
      activeLight: PdMIcon,
      activeDark: PdMIconDark,
      component: FaultAnalysis,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
      schema: "/:schema",
      moduleName:"/:moduleName",
      type:'act',
      moduleId:10,
      isAccordian:true,
      AccordianOpen:false
    },
    // {
    //   path: "/ManageInstruments",
    //   name: "Manage Instruments",
    //   iconLight: PdMIcon,
    //   iconDark: PdMIcon,
    //   activeLight: PdMIcon,
    //   activeDark: PdMIcon,
    //   component: ManageInstruments,
    //   layout: "/neo",
    //   iconFlag: true,
    //   footer: false,
    //   line: "/:line",
    //   schema: "/:schema",
    //   moduleName:"/:moduleName",
    //   type:'act'
    // },
    {
      path: "/AssetHealth",
      name: "Asset Health",
      iconLight: DashboardIcon,
      iconDark: DashboardIconDark,
      activeLight: DashboardIcon,
      activeDark: DashboardIconDark,
      component: AssetHealth,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema",
      moduleName:"/:moduleName",
      type:"monitor",
      moduleId:14
    }, 
   
  
    {
      path: "/settings",
      name: "settings",
      iconLight: SettingsIcon,
      iconDark: SettingsIconDark,
      activeLight: SettingsIcon,
      activeDark: SettingsIconDark,
      component: NewSettings,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      line: "/:line",
      type:"footer",
      isAccordian:true,
      AccordianOpen:false,
      schema:"/:schema",
      moduleId:17
   
    },
    {
      path: "/support",
      name: "Help and Support",
      iconLight: HelpIcon,
      iconDark: HelpIconDark,
      activeLight: HelpIcon,
      activeDark: HelpIconDark,
      component: Support,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      line: "/:line",
      type:"footer",
       schema: "/:schema",
       moduleId:18
  
    }, 
    {
      path: "/What'sNew",
      name: "What's New",
      iconLight: Sprint_History,
      iconDark: WhatsNewIconDark,
      activeLight: forms_lightActive,
      activeDark: WhatsNewIconDark,
      component: ReleaseNotes,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      line: "/:line",
      type:"footer",
      schema: "/:schema",
      moduleId:19

      
    }, 
        
    {
      path: "/profile",
      name: "profile",
      iconLight: account_light,
      iconDark: account_dark,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: Profile,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema",
      //  moduleId:13
    },
    {
      path: "/access",
      name: "access",
      iconLight: help_light,
      iconDark: help_dark,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: RequestAccess,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema"
    },
    // {
    //   path: "/changeLog",
    //   name: "ChangeLog",
    //   iconLight: Sprint_History,
    //   iconDark: Sprint_History,
    //   activeLight: forms_lightActive,
    //   activeDark: forms_darkActive,
    //   component: ReleaseNotes,
    //   layout: "/neo",
    //   iconFlag: false,
    //   footer: false,
    //   bottom: 0,
    //   line: "/:line"
    // },
    {
      path: "/activity",
      name: "Activity",
      iconLight: help_light,
      iconDark: help_dark,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: Activity,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      line: "/:line",
       schema: "/:schema"
    },
   
  ],
};

export default Routes;
