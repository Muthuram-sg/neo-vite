import React,{useEffect,useState} from "react";
import Card from 'components/Core/KPICards/KpiCardsNDL';
import Grid from 'components/Core/GridNDL'
import Text from "components/Core/Typography/TypographyNDL";
import teams from 'assets/Teams.svg';
import globe from 'assets/Globe.svg';
import sgLogo from 'assets/sglogo_bw.png';
import support from 'assets/support.svg';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import {
  themeMode,
  currentPage,
  selectedPlant,
  userData
} from "recoilStore/atoms";
import Logo from 'components/Core/Logo/LogoNDL';
import useLineData from './hooks/useLineData'
import useUserData from "./hooks/useUserData"
import Ticket  from  'assets/Ticket.svg'

export default function Support() {
    const { t } = useTranslation();
    const [, setCurPage] = useRecoilState(currentPage);
    const [headPlant] = useRecoilState(selectedPlant);
    const {LineDataLoading, LineDataData, LineDataError, getLineData} =useLineData()
    const  {  UserLoading, UserError, UserData, getUserData } = useUserData()
    const [contactID,setContactId] = useState('')
  const [userdetails] = useRecoilState(userData);
    const [contactUser,setContactUser] = useState({})
    useEffect(()=>{
        setCurPage("support")
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])
      useEffect(() => {
        getLineData(headPlant.id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[headPlant.id])
      useEffect(() => {
        if(!LineDataLoading && LineDataData && !LineDataError){
            let contact_id = LineDataData[0].contact_person_id;
            setContactId(contact_id)
        }
      },[LineDataLoading, LineDataData, LineDataError])
      useEffect(() => {
        getUserData(contactID)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[contactID])
    
      useEffect(() => {
        if(!UserLoading && !UserError && UserData){
         
          setContactUser(UserData)
        }
      },[UserLoading, UserError, UserData])
    const classes ={
        cardCenter: {
          
            textAlign: "center",
            position: "absolute",
            bottom: 7
        },  
       
    }

    
    const isInternalUser = userdetails.email &&
    (userdetails.email.toLowerCase().includes("@saint-gobain") ||
      userdetails.email.toLowerCase().includes("@ext.saint-gobain"));
    return (
        <div >
            <div className="bg-Background-bg-primary py-3 px-4 dark:bg-Background-bg-primary-dark border-b border-Border-border-50 dark:border-Border-border-dark-50">
             <Text value='Help and Support' variant='heading-02-xs' />
            </div>
           <br></br>
           {/* <br></br> */}
           {/* <br></br> */}
           {/* <br></br> */}

           <Grid container spacing={4}>
    <Grid item xs={2} sm={2} />
    <Grid item xs={4} sm={4}>
        <Card id='ms-teams-channel'>
            <a href="https://teams.microsoft.com/l/team/19%3aNMTOiJLIVazxaBQMgWPrgZ_4rYq7x-L6c8vyj6LxB3U1%40thread.tacv2/conversations?groupId=0441ef0a-b6a3-4f4b-9e09-c81dfcea3cff&tenantId=e339bd4b-2e3b-4035-a452-2112d502f2ff" 
               target="_blank" 
               rel="noreferrer" 
               style={{ textDecoration: 'none', color: "#000000" }}>
                <div className="flex items-center justify-center rounded-lg mb-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark">
                    <Logo src={teams} alt="Microsoft Teams Support" style={{ height: 100 }} />
                </div>
                <div className="text-center">
                    <Text variant="label-02-m" 
                          value={'Talk to support Engineers'} 
                          color={"primary"}
                          />
                    <Text value={'Struggling with the platform? Let us make it easier for you.'} 
                          color={"secondary"} variant="paragraph-xs"/>
                </div>
            </a>
        </Card>

    </Grid>

    <Grid item xs={4} sm={4}>


<Card id='documentation' style={classes.cardRight}>
    <a href="https://neo.saint-gobain.com/product/documentation/intro" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: "#000000" }}>
        {/* <img rel="preload"  as="image"  src={globe} alt="Gitlab" style={{ height: 100 }} /> */}
        <div className="flex items-center justify-center rounded-lg mb-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark">
        <Logo src={globe} alt="Gitlab" style={{ height: 100 }} ></Logo>
        </div>
        <div className="text-center">
            <Text variant="label-02-m" value={t("Documentation")} color={"primary"}/>
            <Text variant="paragraph-xs" value={t("CustomizePlatform")} color={"secondary"}/>
        </div>
    </a>
</Card>
</Grid>

    
</Grid>


                {/* <Grid item xs={6} sm={6}>
                    <Card id='git-lab-issues' style={classes.cardRight}>
                        <a href="https://gitlab.com/saint-gobain3/neo/web/-/issues" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: "#000000" }}>
                            {/* <img rel="preload"  as="image"  src={git} alt="Gitlab" style={{ height: 100 }} /> */}
                            {/* <Logo src={git} alt="Gitlab" style={{ height: 100 }} ></Logo>
                            <HorizontalLine variant="divider1"  middle />
                            <div style={{ padding: 8 }}>
                                <Text variant="label-02-s" value={t("Development")} style={{color: curTheme==='light' ? "#242424" : "#A6A6A6",fontSize: "15px"}}/>
                                <Text value={t("RaiseIssues")} style={{color: curTheme==='light' ? "#242424" : "#595959",fontSize: "9px"}}/>
                            </div>
                        </a>
                    </Card>
                </Grid> */} 
                {/* <Grid item xs={6} sm={6}>
                    <Card id='mail-feedback' style={classes.cardLeft}>
                        <a href="mailto:Rokesh.OP@Saint-Gobain.Com?cc=Srivatsan.R@Saint-Gobain.com&subject=Feedback for IOT Web" style={{ textDecoration: 'none', color: "#000000" }}>
                            {/* <img rel="preload"  as="image" src={mail} alt="Gitlab" style={{ height: 100 }} /> */}
                            {/* <Logo src={mail} alt="Gitlab" style={{ height: 100 }} ></Logo>
                            <HorizontalLine variant="divider1"  middle />
                            <div style={{ padding: 8 }}>
                                <Text variant="label-02-s" value={t("WriteUs")} style={{color: curTheme==='light' ? "#242424" : "#A6A6A6",fontSize: "15px"}}/>
                                <Text value={t("RequestDemo")} style={{color: curTheme==='light' ? "#242424" : "#595959",fontSize: "9px"}}/>
                            </div>
                        </a>
                    </Card> */}
                {/* </Grid> */} 
              
                <Grid container spacing={4} >
                <Grid item xs={2} sm={2} />
             
                {Object.keys(contactUser).length > 0 && (
        <Grid item xs={4} sm={4} style={{marginTop:"16px"}} >
            <Card>
            
            <a 
                                        href={`mailto:${contactUser.email}?cc=Srivatsan.R@Saint-Gobain.com&subject=Technical Support`} 
                                       
                                      >
              
                            {/* <img rel="preload"  as="image"  src={teams} alt="Microsoft Teams Support" style={{ height: 100 }} /> */}
                            <div className="flex items-center justify-center rounded-lg mb-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark">
                    <Logo src={support} alt="Gitlab" style={{ height: 100 }} />
                </div>
                        <div className="text-center">
                                <Text variant="label-02-m" value={"Technical Support"} color={"primary"}/>
                                <div className="pt-2">
                                <div style={{display:"flex",gap:8}}><Text variant="paragraph-xs" color={"primary"} >Name :</Text> <Text variant="paragraph-xs" color={"secondary"}>{contactUser.name ? contactUser.name : null}</Text></div>

                                <div style={{display:"flex",gap:8}}>
                                    <Text variant="paragraph-xs"  color={"primary"}>Email :</Text>
                                    <a 
                                        href={`mailto:${contactUser.email}?cc=Srivatsan.R@Saint-Gobain.com&subject=Technical Support`} 
                                        style={{ fontSize: '10px', color: 'blue', textDecoration: 'underline' }}
                                    >
                                        {contactUser.email ? contactUser.email : null}
                                    </a>
                                 </div>

                                <div style={{display:"flex",gap:8}}><Text variant="paragraph-xs" color={"primary"}>Mobile :</Text> <Text variant="paragraph-xs" color={"secondary"}> {contactUser.mobile ? `+91 ${contactUser.mobile}` : null}</Text></div>
                                </div>
                          
                            </div>
                          
                          
                           
                            </a>
                    </Card>
        </Grid>
    )}


                {isInternalUser && (
                <Grid item xs={4} sm={4}style={{marginTop:"16px"}}>


<Card id='raise-a-ticket'>
    <a href="https://sgts.service-now.com/sg_esc?id=sg_emp_taxonomy_topic&topic_id=6e1093783b6ed650451f106ea5e45aad" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: "#000000" }}>
        {/* <img rel="preload"  as="image"  src={globe} alt="Gitlab" style={{ height: 100 }} /> */}
        <div className="flex items-center justify-center rounded-lg mb-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark">
        <Logo src={Ticket} alt="Gitlab" style={{ height: 100 }} ></Logo>
        </div>
        <div className="text-center">
            <Text variant="label-02-m" value={("Raise a Ticket")} color={"primary"}/>
            <Text variant="paragraph-xs" value={t("TicketRise")} color={"secondary"}/>
        </div>
    </a>
</Card>
</Grid>
                )}     
           </Grid>

           
         
<div className="absolute bottom-0 text-center p-4 w-[83%] flex justify-center  items-center ">
                {/* <img rel="preload"  as="image"  src={sgLogo} alt="Saint-Gobain" style={{ height: 50 }} /><br /> */}
                <Logo src={sgLogo} alt="Saint-Gobain" style={{ height: 40 }} ></Logo><br />
                {/* <Text variant="Caption2" value={t("Developed")} style={{color: "#8F8F8F",lineHeight:"15px"}}/>  */}
</div>
           
        </div>
    );
}