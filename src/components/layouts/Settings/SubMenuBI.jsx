import React from "react";
import Line from "./Line/NewLineBI";
import UserSetting from "components/layouts/Settings/UserSetting"
export const BIMenuList =[
    {
        title:'Line',
        content:<Line />,
        tabValue:0
    },
    {
        title:"Users",
        content:<UserSetting />,
        tabValue:1
    }
]
