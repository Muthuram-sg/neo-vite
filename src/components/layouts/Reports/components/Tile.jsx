import React, { useState, useEffect } from "react";
import Cards from "components/Core/KPICards/KpiCardsNDL.jsx"
import Typography from "components/Core/Typography/TypographyNDL";
import PublicAccess from 'assets/neo_icons/NewReportIcons/Public.svg?react';
import PrivateAccess from 'assets/neo_icons/NewReportIcons/Private.svg?react';
import SharedAccess from 'assets/neo_icons/NewReportIcons/Shared.svg?react';
import ThreeDot from 'assets/neo_icons/NewReportIcons/ThreeDot_New.svg?react';
import Edit from 'assets/neo_icons/NewReportIcons/edit_report.svg?react';
import Delete from 'assets/neo_icons/NewReportIcons/delete_report.svg?react';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';

import { themeMode } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

import Button from "components/Core/ButtonNDL";
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';


export default function Tile(props) {

  const [openGap, setOpenGap] = useState(false);
  const [AnchorPos, setAnchorPos] = useState(null);
  const [, setstared] = useState(props.x.stared ? props.x.stared : false)
  const [currTheme] = useRecoilState(themeMode)

  useEffect(() => {
    setstared(props.x.stared)
  }, [props.x.stared])

  const menuOption = [
    { id: "edit", name: "Edit", icon: Edit, toggle: false, stroke:currTheme === 'dark' ?  "#eeeeee"  : '#202020', },
    { id: "delete", name: "Delete", icon: Delete, color: "#CE2C31", stroke: '#CE2C31', toggle: false },
  ]


  function optionChange(e, id, name) {
    if (e === "edit") {
      setOpenGap(!openGap)
      setAnchorPos(null)
      props.handleEditOpen(id)

    }
    if (e === "delete") {
      setOpenGap(!openGap)
      setAnchorPos(null)
      props.handleDetele(id, name)

    }

  }

  const handleClose = () => {
    setOpenGap(false)
    setAnchorPos(null)
  };


  const handleNullPopper = (e) => {
    setOpenGap(!openGap)
    setAnchorPos(e.currentTarget)
  }


  const handleStar = (id) => {
    const updatedStart = props.x.stared
    props.handleTrigerStar(id, updatedStart)
  }

  const renderAccess = (access, list) => {
    if (access && list && list.length > 0) {
      return 'Shared'
    } else if (access) {
      return 'Public'
    } else {
      return 'Private'
    }

  }

  const renderStatusIcon = (access, list) => {
    if (access && list && list.length > 0) {
      return <SharedAccess />
    } else if (access) {
      return <PublicAccess />
    } else {
      return <PrivateAccess />
    }

  }
  function getTimeDifferenceLabel(providedTime) {
    const givenTime = new Date(providedTime);
    const currentTime = new Date();

    const timeDifferenceInMilliseconds = currentTime - givenTime;
    const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

    if (minutesDifference < 1) {
      return "Moments ago";
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference < 1440) { // 1440 minutes in a day
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference < 2880) { // Between 24 hours and 48 hours
      return "Yesterday";
    } else if (minutesDifference < 10080) { // Less than 7 days
      const daysDifference = Math.floor(minutesDifference / (60 * 24));
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference < 20160) { // Between 7 and 14 days
      return "Last week";
    } else if (minutesDifference < 43200) { // Less than 30 days (approx)
      const weeksDifference = Math.floor(minutesDifference / (60 * 24 * 7));
      return `${weeksDifference} week${weeksDifference > 1 ? "s" : ""} ago`;
    } else if (minutesDifference < 525600) { // Less than 12 months (365 days * 24 hours * 60 minutes)
      const monthsDifference = Math.floor(minutesDifference / (60 * 24 * 30));
      return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
    } else {
      return "A while ago";
    }
  }

  return (
    <Cards style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem', maxWidth: '18.6rem', minHeight: '150px', cursor: "pointer" }} onClick={() => { props.handleCustomReportOpen(props.x.id) }}>
      <div className=" bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark rounded-lg h-[106px]">
        <div className="flex justify-end items-center" >
          <div className="w-8 h-8 flex items-center">

            {
              props.starLoaderId === props.x.id && props.InsertStarReportLoading ?
                <div class="reportStarloader"></div>
                :
                <svg width="32" height="32" viewBox="0 0 32 32" fill='none' onClick={(e) => { e.stopPropagation(); handleStar(props.x.id) }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4953 12.8933L9.242 13.5099L9.16666 13.5253C9.05262 13.5556 8.94866 13.6156 8.86539 13.6991C8.78212 13.7827 8.72253 13.8869 8.6927 14.0011C8.66288 14.1153 8.66388 14.2353 8.69561 14.3489C8.72735 14.4626 8.78867 14.5658 8.87333 14.6479L11.9547 17.6473L11.228 21.8839L11.2193 21.9573C11.2123 22.0752 11.2368 22.1929 11.2903 22.2983C11.3438 22.4037 11.4243 22.4929 11.5236 22.557C11.6229 22.621 11.7374 22.6575 11.8554 22.6627C11.9735 22.6679 12.0908 22.6416 12.1953 22.5866L15.9993 20.5866L19.7947 22.5866L19.8613 22.6173C19.9714 22.6606 20.091 22.6739 20.2078 22.6558C20.3247 22.6377 20.4346 22.5888 20.5264 22.5141C20.6181 22.4395 20.6884 22.3418 20.7299 22.231C20.7714 22.1203 20.7827 22.0005 20.7627 21.8839L20.0353 17.6473L23.118 14.6473L23.17 14.5906C23.2443 14.4991 23.293 14.3896 23.3111 14.2731C23.3293 14.1567 23.3163 14.0375 23.2734 13.9278C23.2305 13.818 23.1593 13.7216 23.067 13.6483C22.9747 13.575 22.8646 13.5275 22.748 13.5106L18.4947 12.8933L16.5933 9.03995C16.5383 8.9283 16.4531 8.83429 16.3475 8.76855C16.2418 8.70281 16.1198 8.66797 15.9953 8.66797C15.8709 8.66797 15.7489 8.70281 15.6432 8.76855C15.5375 8.83429 15.4523 8.9283 15.3973 9.03995L13.4953 12.8933Z" fill={props.x.stared ? "#FFBA18" : "#8D8D8D"} />
                </svg>

            }
          </div>

        </div>
        <div className="flex justify-center items-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.5687 4.93127L40.0687 15.4313C40.3473 15.717 40.5023 16.101 40.5 16.5V40.5C40.5 41.2957 40.1839 42.0587 39.6213 42.6213C39.0587 43.184 38.2956 43.5 37.5 43.5H10.5C9.70435 43.5 8.94129 43.184 8.37868 42.6213C7.81607 42.0587 7.5 41.2957 7.5 40.5V7.50002C7.5 6.70437 7.81607 5.94131 8.37868 5.3787C8.94129 4.81609 9.70435 4.50002 10.5 4.50002H28.5C28.8991 4.49777 29.283 4.65269 29.5687 4.93127ZM28.5 15C28.5 15.8285 29.1716 16.5 30 16.5H36.75L28.5 8.25002V15ZM30.75 21C30.3358 21 30 21.3358 30 21.75V38.25C30 38.6642 30.3358 39 30.75 39H33.75C34.1642 39 34.5 38.6642 34.5 38.25V21.75C34.5 21.3358 34.1642 21 33.75 21H30.75ZM24 24.75C24 24.3358 24.3358 24 24.75 24H27.75C28.1642 24 28.5 24.3358 28.5 24.75V38.25C28.5 38.6642 28.1642 39 27.75 39H24.75C24.3358 39 24 38.6642 24 38.25V24.75ZM18 27.75C18 27.3358 18.3358 27 18.75 27H21.75C22.1642 27 22.5 27.3358 22.5 27.75V38.25C22.5 38.6642 22.1642 39 21.75 39H18.75C18.3358 39 18 38.6642 18 38.25V27.75ZM12 32.25C12 31.8358 12.3358 31.5 12.75 31.5H15.75C16.1642 31.5 16.5 31.8358 16.5 32.25V38.25C16.5 38.6642 16.1642 39 15.75 39H12.75C12.3358 39 12 38.6642 12 38.25V32.25Z" fill="#8D8D8D" />
          </svg>

        </div>


      </div>
      <div className="mt-2" />
      <div className="flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <TooltipNDL title={props.x.name} placement="bottom" arrow>
      <Typography
        variant="label-01-m"
        style={{
          width: '230px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'left', // Ensures the text is aligned to the left
        }}
      >
        {props.x.name}
      </Typography>
    </TooltipNDL>
    <div className="flex items-center gap-1">
      {renderStatusIcon(props.x.public_access, props.x.user_access_list)}
      <Typography
        variant="paragraph-xs"
        color="tertiary"
        value={
          renderAccess(props.x.public_access, props.x.user_access_list) +
          " " +
          "•" +
          " " +
          getTimeDifferenceLabel(props.x.last_opened)
        }
      />
    </div>
  </div>
  <div>
    <Button
      type="ghost"
      icon={ThreeDot}
      onClick={(e) => {
        e.stopPropagation();
        handleNullPopper(e);
      }}
    />
    <ListNDL
      options={menuOption}
      Open={openGap}
      optionChange={(e) => optionChange(e, props.x.id, props.x.name)}
      keyValue={"name"}
      keyId={"id"}
      id={"popper-Gap"}
      onclose={handleClose}
      IconButton
      isIcon
      anchorEl={AnchorPos}
      width="170px"
    />
  </div>
</div>

    </Cards>
  )
}