import React from "react";
import MasterData from "./MasterData";
import Enquiry from "./Enquiry";
import Quotation from "./Quotation";
import CompanyInfo from "./CompanyForm";

export const NeonixSubmenu =[
    {
        title:'Company Info',
        content:<CompanyInfo/>,
        tabValue:0,
        id:"360bebe3-8519-44f9-bfd1-0184501601a0"
    },
    {
        title:'Enquiry',
        content:<Enquiry/>,
        tabValue:1,
        id:"ed7ecedc-96f5-4a10-bf1a-f675a6be9331"
    },
    {
        title:'Quotation',
        content:<Quotation/>,
        tabValue:2,
        id:"412e67cd-e66e-4dbf-b413-952ec6bb625a"
    },
    {
        title:'Master Data',
        content:<MasterData/>,
        tabValue:3,
        id:"9d070ae7-00db-43b0-97a3-fb30e1fae72b"
    },
   

]
