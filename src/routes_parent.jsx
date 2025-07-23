import React from 'react';
import dash_light from 'assets/neo_icons/Dashboard/dashboard.svg?react';
import dash_dark from 'assets/neo_icons/Dashboard/dashboard_dark.svg?react';
import dash_lightActive from 'assets/neo_icons/Dashboard/Dashboard_lightActive.svg?react';
import dash_darkActive from 'assets/neo_icons/Dashboard/Dashboard_darkActive.svg?react';
import forms_lightActive from 'assets/neo_icons/Dashboard/Form_lightActive.svg?react';
import forms_darkActive from 'assets/neo_icons/Dashboard/Form_darkActive.svg?react';
import account_light from 'assets/neo_icons/Menu/account.svg?react';
import account_dark from 'assets/neo_icons/Menu/account_dark.svg?react';
import help_light from 'assets/neo_icons/Menu/help.svg?react';
import help_dark from 'assets/neo_icons/Menu/help_dark.svg?react';
import chat_support_light from 'assets/neo_icons/Menu/chat_support.svg?react';
import chat_support_dark from 'assets/neo_icons/Menu/chat_support_dark.svg?react';
import settings_light from 'assets/neo_icons/Menu/settings.svg?react';
import settings_dark from 'assets/neo_icons/Menu/settings_dark.svg?react';
import Alarms_light from 'assets/neo_icons/Dashboard/Alarm.svg?react';
import Tasks_light from 'assets/neo_icons/Dashboard/Task.svg?react';
import Fault_Analysis from 'assets/neo_icons/FaultAnalysis/FaultAnalysis.svg?react';
import Sprint_History from 'assets/Histrory.svg?react';

const Dashboards = React.lazy(() => import("components/layouts/Dashboards/Dashboard"));
const Support = React.lazy(() => import("components/layouts/Support"));
const Settings = React.lazy(() => import("components/layouts/Settings/settings.jsx"));
const RequestAccess = React.lazy(() => import("components/layouts/Profile/RequestAccess"));
const Activity = React.lazy(() => import("components/layouts/Profile/Activity"));
const Profile = React.lazy(() => import("components/layouts/Profile/ProfileSetting"));
const Alarms = React.lazy(() => import("components/layouts/Alarms/index")); 
const Tasks = React.lazy(() => import("components/layouts/Tasks/NewTask")); 
const FaultAnalysis = React.lazy(() => import("components/layouts/FaultAnalysis/index"))
const ReleaseNotes=React.lazy(() => import("components/layouts/Profile/ReleaseNotes/index"));

const routes_parent = {
  mainRoutes: [  
    {
      path: "/dashboard",
      name: "dashboard",
      iconLight: dash_light,
      iconDark: dash_dark,
      activeLight: dash_lightActive,
      activeDark: dash_darkActive,
      component: Dashboards,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      schema:"/:schema"
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
      schema:"/:schema"
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
      schema:"/:schema"
    },
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
      schema:"/:schema"
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
    // },
    {
      path: "/support",
      name: "support",
      iconLight: chat_support_light,
      iconDark: chat_support_dark,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: Support,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
      schema:"/:schema"
    },
    {
      path: "/What'sNew",
      name: "What's New",
      iconLight: Sprint_History,
      iconDark: Sprint_History,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: ReleaseNotes,
      layout: "/neo",
      iconFlag: false,
      footer: false,
      bottom: 0,
    },
    {
      path: "/settings",
      name: "settings",
      iconLight: settings_light,
      iconDark: settings_dark,
      activeLight: forms_lightActive,
      activeDark: forms_darkActive,
      component: Settings,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      bottom: 0,
      schema:"/:schema"
    },
    {
      path: "/Alarms",
      name: "Alarms",
      iconLight: Alarms_light,
      iconDark: Alarms_light,
      activeLight: Alarms_light,
      activeDark: Alarms_light,
      component: Alarms,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema"
    },
    {
      path: "/Tasks",
      name: "Tasks",
      iconLight: Tasks_light,
      iconDark: Tasks_light,
      activeLight: Tasks_light,
      activeDark: Tasks_light,
      component: Tasks,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema"
    },
    {
      path: "/PdM",
      name: "PdM",
      iconLight: Fault_Analysis,
      iconDark: Fault_Analysis,
      activeLight: Fault_Analysis,
      activeDark: Fault_Analysis,
      component: FaultAnalysis,
      layout: "/neo",
      iconFlag: true,
      footer: false,
      line: "/:line",
       schema: "/:schema"
    },
  ],
};

export default routes_parent;
