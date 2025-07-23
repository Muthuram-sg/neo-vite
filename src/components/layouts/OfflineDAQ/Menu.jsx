import React from "react";
import OfflineDAQ from "./OfflineDAQ";
import Production from "./ProductionDAQ/Production";


export const MenuList = [
    {
        title:"Instruments",
        content:<OfflineDAQ/>
    },
    {
        title:"Production",
        content:<Production/>
    }
]