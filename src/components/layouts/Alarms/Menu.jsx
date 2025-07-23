import AlarmOverview from "./Overview/components/Overview";
import AlarmRules from "./AlarmRulesIndex";

export const AlarmMenuList = [
    {
        title:"Overview",
        content:<AlarmOverview/>,
        tabValue:0
    },
    {
        title:"Alarm Rules",
        content:<AlarmRules/>,
        tabValue:1
    }
]