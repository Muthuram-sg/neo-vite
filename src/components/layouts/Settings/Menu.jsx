// Icons
import SettingsLight from 'assets/neo_icons/Menu/SettingsLight.svg?react'; 
import LineLight from 'assets/neo_icons/Menu/linelightnew.svg?react';  
import HierarchyLight from 'assets/neo_icons/Menu/hierarchy_horizontal.svg?react'; 
import AccountSettingsLight from 'assets/neo_icons/Menu/account_settings.svg?react'; 
import NotifySettingsLight from 'assets/neo_icons/Menu/notification.svg?react'; 
import NotifySelected from 'assets/neo_icons/Menu/notificationSelected.svg?react';
import LineSettingSelected from 'assets/neo_icons/Menu/linelightnewselected.svg?react';
import SettingSelected from 'assets/neo_icons/Menu/SettingsSelected.svg?react';
import HierarchySelected from 'assets/neo_icons/Menu/HierarchySelected.svg?react';
import GatewayIconDark from 'assets/neo_icons/Equipments/rasberry_pi_dark.svg?react';

import UserSelected from 'assets/neo_icons/Menu/UserSelected.svg?react';
// components  
import Entity from "./Entity";
import Users from './UserSetting'
import Notify from './NotifySetting';
import Instruments from './Instrument/RealInstrument'
import Factors from './factors/factorsSettings'
import Line from './Line';
import Production from "./Production/index"
import Hierarchy from "./HierarchySetting/HierarchySetting";  
import Metrics from "./Metrics/MetricsSetting";
import Gateway from "./Gateway";
import MetricsGroup from "./MetricsGroup";
import Contract from "./Contract";
export const MenuList = [
    {
        iconLight: LineLight, 
        selected: LineSettingSelected,
        title: 'LineSettings', 
        iconColorType: "stroke",
        content: <Line />
    },
    {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'entity', 
        content: <Entity />
    },
    
    {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'prod', 
        content: <Production />
    },
     {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'Instru', 
        content: <Instruments />
    },
    {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'Metrics', 
        content: <Metrics />
    },
    {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'Factor', 
        content: <Factors />
    }, 
    {
        iconLight: HierarchyLight, 
        selected: HierarchySelected,
        iconColorType: "stroke",
        title: 'Hierarchy', 
        content: <Hierarchy />
    },
    {
        iconLight: AccountSettingsLight, 
        selected: UserSelected,
        iconColorType: "stroke",
        title: 'User', 
        content: <Users />
    }, 
    {
        iconLight: NotifySettingsLight, 
        selected: NotifySelected,
        iconColorType: "stroke",
        title: 'Notification', 
        content: <Notify />
    },
    {
        iconLight: GatewayIconDark, 
        selected: GatewayIconDark,
        iconColorType: "fill",
        title: 'Gateway', 
        content: <Gateway />
    },
    {
        iconLight: GatewayIconDark, 
        selected: GatewayIconDark,
        iconColorType: "fill",
        title: 'Metrics Group', 
        content: <MetricsGroup />
    },
    {
        iconLight: SettingsLight, 
        selected: SettingSelected,
        iconColorType: "fill",
        title: 'Contract', 
        content: <Contract />
    }, 
];