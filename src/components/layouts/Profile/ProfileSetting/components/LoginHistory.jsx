import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useRecoilState } from "recoil";
import {  userData } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import useloginhistory from "components/layouts/Profile/ProfileSetting/hooks/useLoginhistory";
import Chrome from 'assets/neo_icons/BroswerIcons/Google_Chrome.svg?react';
import Firefox from 'assets/neo_icons/BroswerIcons/Firefox.svg?react';
import Safari from 'assets/neo_icons/BroswerIcons/Safari.svg?react';
import Opera from 'assets/neo_icons/BroswerIcons/Opera.svg?react';
import MobileApp from 'assets/neo_icons/BroswerIcons/MobileApp.svg?react';
import Edge from 'assets/neo_icons/BroswerIcons/Edge.svg?react';
import Windows from 'assets/neo_icons/OSIcons/Windows.svg?react';
import Android from 'assets/neo_icons/OSIcons/Android.svg?react';
import Apple from 'assets/neo_icons/OSIcons/Apple.svg?react';
import IOS from 'assets/neo_icons/OSIcons/iOS.svg?react';
import Linux from 'assets/neo_icons/OSIcons/Linux.svg?react';
import Ubuntu from 'assets/neo_icons/OSIcons/Ubuntu.svg?react';
import Desktop from 'assets/neo_icons/DeviceIcons/Desktop.svg?react';
import Mobile from 'assets/neo_icons/DeviceIcons/Mobile.svg?react';
import Mac from 'assets/neo_icons/DeviceIcons/Mac.svg?react';
import Tablet from 'assets/neo_icons/DeviceIcons/Tablet.svg?react';
import { useTranslation } from 'react-i18next';
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL";




export default function LoginHistory() {  
    const { t } = useTranslation();
    const [tabledata, setTableData] = useState([]) 
    const { outLHLoading, outLHData, outLHError, getLoginhistory } = useloginhistory(); 
    const [userDetails, ] = useRecoilState(userData);

    useEffect(() => {
        getLoginhistory(userDetails.id );
    }, []) // eslint-disable-line react-hooks/exhaustive-deps    
    useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outLHData])
    const headCells = [
        {
          id: 'access_ts_login',
          numeric: false,
          disablePadding: false,
          label: t('Login Time'),
        },
    
        {
          id: 'access_ts_active',
          numeric: false,
          disablePadding: false,
          label: t('Active Time'),
        },
        {
          id: 'info_device',
          numeric: false,
          disablePadding: false,
          label: t('Device'),
        },
        {
          id: 'info_platform',
          numeric: false,
          disablePadding: false,
          label: t('Platform'),
        },
    
      ];
      const Iconsfunc = (val) => {//NOSONAR
        if (val === 'Chrome') {
          return <Chrome />;
        }
        if (val === 'Firefox') {
          return <Firefox />;
        }
        if (val === 'Edge') {
          return <Edge />;
        }
        if (val === 'Opera') {
          return <Opera />;
        }
        if (val === 'Safari') {
          return <Safari />;
        }
        if (val === 'MobileApp') {
          return <MobileApp />;
        }
        //  OS icon
        if (val === 'Windows') {
          return <Windows />;
        }
        if (val === 'Apple') {
          return <Apple />;
        }
        if (val === 'IOS') {
          return <IOS />;
        }
        if (val === 'Linux') {
          return <Linux />;
        }
        if (val === 'Ubuntu') {
          return <Ubuntu />;
        }
        if (val === 'Android') {
          return <Android />;
        }
        //  Devices Icon
        if (val === 'desktop') {
          return <Desktop />;
        }
        if (val === 'Mobile') {
          return <Mobile />;
        }
        if (val === 'Mac') {
          return <Mac />;
        }
        if (val === 'Tablet') {
          return <Tablet />;
        }
      }
      const activetimeFormat = (val) => {
        const result = moment(val).diff(moment(new Date()), 'days');
        if (result === 0) {
          return moment(val).format('mm') + " Mins";
        } else {       
          return result.toString().replace("-", "") + (result === -1 ? " Day" : " Days");
        }    
      }
      const timeFormat = (val) => {       
        return moment(val).format("DD/MM/YYYY - HH:mm A"); 
      }
      const renderdevice = (value) => value?.device || "-";

      const renderPlatform = (value) => {
        return `${value?.os_name || "-"} | ${value?.browser_name || "-"}`;
      };
            const processedrows = () => {
        let temptabledata = []
        if (outLHData && !outLHError && !outLHLoading) {
            temptabledata = temptabledata.concat(outLHData.map((val, index) => {
                return [timeFormat(val.access_ts), activetimeFormat(val.access_ts), renderdevice(val.info),
                    renderPlatform(val.info)]
            })
            )
        }
        setTableData(temptabledata)
    }
    return(
      <div >
      <Grid item xs={3} sm={3}>
      <Typography
          variant="label-02-s"
          value={t("Login Activity")}
          
        />
         
         <Typography value="Monitor your login history to track recent access to your account"  color="tertiary" variant="paragraph-xs" />
         
         <div className="mt-4"/>

        <div>
            <EnhancedTable
                        headCells={headCells}
                        data={tabledata}
                        rawdata={outLHData && !outLHError && !outLHLoading?outLHData:''}
                        search={true}
                        download={true}
                        />
        </div>
        </Grid>
        </div>
    )
}