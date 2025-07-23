import React, { useEffect } from "react";
import useTheme from "TailwindTheme";
import Grid from "components/Core/GridNDL";
import Text from "components/Core/Typography/TypographyNDL";
import Avatar from "components/Core/Avatar/AvatarNDL";
import moment from "moment";
import { useRecoilState } from "recoil";
import { currentPage, userData, hrms ,themeMode} from "recoilStore/atoms";
import { useTranslation } from "react-i18next";




export default function Profile() {
  const { t } = useTranslation();
  const [userDetails] = useRecoilState(userData);
  const [hrmsDetails] = useRecoilState(hrms);
  const [curTheme] = useRecoilState(themeMode);

  const [, setCurPage] = useRecoilState(currentPage);
     let altname = "";

if (userDetails.name) {
  if (userDetails.name.split(" ").length > 1) {
    altname = `${userDetails.name.split(" ")[0][0]}${userDetails.name.split(" ")[1][0]}`;
  } else if (userDetails.name.split(" ")[0].length > 1) {
    altname = `${userDetails.name.split(" ")[0][0]}${userDetails.name.split(" ")[0][1]}`;
  } else {
    altname = `${userDetails.name[0][0]}${userDetails.name[0][0]}`;
  }
}


  useEffect(() => {
    setCurPage("profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  function hideEmail(target) {
    let email = target; //rokesh@gmail.com
    let hiddenEmail = "";
    if (email) {
      for (let i = 0; i < email.length; i++) {
        if (i > 2 && i < email.indexOf("@")) {
          hiddenEmail += "*";
        } else {
          hiddenEmail += email[i];
        }
      }
    }
    return hiddenEmail; //rok***@gmail.com
  }
  function hidePhone(target) {
    let phone = target; //9876463870
    let hiddenPhone = "";
    if(phone){
      for (let i = phone.length - 1; i >= 0; i--) {
        if (i >= phone.length - 5) {
          hiddenPhone += "*";
        } else {
          hiddenPhone += phone[i];
        }
      }
    }
    
    return hiddenPhone.split("").reverse().join(""); //98764*****
  }


  let imagePathAvatar = hrmsDetails && hrmsDetails.baseImage ? hrmsDetails.baseImage : '' 

  return (
<Grid container spacing={1} >
      <Grid item xs={5} sm={5}>
              <Text
                  variant="label-02-s"
                  value={t("Profile")}
                />
                         <Text value="Manage your personal information" color="tertiary" variant="paragraph-xs"    />
                         

        
        {/* <HorizontalLine variant="divider1"  style={{width:"calc(100% - 50px)"}} /> */}
<div className="mt-4"/>
         
            <Grid container spacing={4}   >
            <Grid item xs={12} sm={12} >
               
               <div className="w-20 h-20" >
                 <Avatar profileStyle src={ hrmsDetails.baseImage ? (`data:image/png;base64,${imagePathAvatar}`) : '' } alt={"Profile Image"}
                   initial={altname}
                   style={{ fontSize: '24px' }}
                   className={"w-20 h-20 rounded-md"}
                   // style={classes.avatar}
                  
                 
                     >
               </Avatar>
               </div>
               
             </Grid>

             <Grid item xs={12} sm={12} style={{ display: "flex", flexDirection: "column" }}>
             <Text variant="paragraph-xs"  color="secondary" value={t("Name")}  />
             <div style={{ paddingTop: "4px" }}>
        <Text
          id="line-plant"
          value={userDetails.name}
          disabled={true}
          variant="label-02-s"
          color="primary"
        />
      </div>
                </Grid>

              <Grid item xs={12} sm={12}  style={{ display: "flex", flexDirection: "column" }}>
                <Text variant="paragraph-xs" color="secondary" value={t("SGID")}  />
                <div style={{ paddingTop: "4px" }}>
                <Text
                  id="line-plant"
                  value={userDetails.sgid}
                  disabled={true}
                 variant="label-02-s"
                />
                  </div>
              </Grid>

              <Grid item xs={12} sm={12} style={{ display: "flex", flexDirection: "column" }}>
  <Text variant="paragraph-xs" color="secondary" value={t("Business")} />
  <div style={{ paddingTop: "4px" }}>
    <Text
      id="line-plant"
      variant="label-02-s"
      color="primary"
      value={
        hrmsDetails &&
        (hrmsDetails.SIFDescription ||
          hrmsDetails.Level1 ||
          hrmsDetails.Level2 ||
          hrmsDetails.Level3)
          ? `${hrmsDetails.SIFDescription ? hrmsDetails.SIFDescription.split(" - ")[1] : ""}${
              hrmsDetails.Level1 ? " - " + hrmsDetails.Level1 : ""
            }${hrmsDetails.Level2 ? " - " + hrmsDetails.Level2 : ""}${
              hrmsDetails.Level3 ? " - " + hrmsDetails.Level3 : ""
            }`
          : "-"
      }
      disabled
    />
    </div>
              </Grid>

              <Grid item xs={12} sm={12} style={{ display: "flex", flexDirection: "column" }}>
                <Text variant="paragraph-xs" color="secondary" value={t("Email")}  />
                <div style={{ paddingTop: "4px" }}>
                <Text
                  id="line-plant"
                  value={hideEmail(userDetails.email)}
                  disabled={true}
                  variant="label-02-s"
                  color="primary"
                />
                  </div>
              </Grid>

              <Grid item xs={12} sm={12}style={{ display: "flex", flexDirection: "column" }}>
                <Text variant="paragraph-xs"color="secondary" value={t("Mobile")}   />
                <div style={{ paddingTop: "4px" }}>
                <Text
                  id="line-plant"
                  value={hidePhone(userDetails.mobile)}
                  disabled={true}
                  variant="label-02-s"
                  color="primary"
                />
                  </div>
                {/* <Button id='delete' disableElevation style={{ marginTop: 5 }}>
                  {curTheme === "dark" ?
                    <SvgIcon fontSize="small">
                      <DeleteDark />
                    </SvgIcon>
                    :
                    <SvgIcon fontSize="small">
                      <DeleteLight />
                    </SvgIcon>
                  }
                </Button> */}
              </Grid>

              <Grid item xs={12} sm={12} style={{ display: "flex", flexDirection: "column" }}>
                <Text
                  variant="paragraph-xs"
                  color="tertiary"
                  value={
                    t("LastUpdate") + moment(userDetails.updated_ts).fromNow()
                  }
                  // style={{
                  //   // fontSize: "8px",
                  //   color: curTheme === "light" ? "#8F8F8F" : "#595959",
                  //   marginTop: 10,
                  // }}
                />

              </Grid>
            </Grid>
          
      </Grid>

      {/* <Grid item xs={9} sm={9} style={{marginLeft:"10px"}}>
        <ContentRight />
      </Grid> */}
    </Grid>
  );
}
