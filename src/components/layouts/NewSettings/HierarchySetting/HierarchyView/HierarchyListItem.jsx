import React from "react";
import useTheme from "TailwindTheme";
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useRecoilState } from "recoil"; 
import {  selectedPlant } from "recoilStore/atoms"; 
import { useTranslation } from 'react-i18next';
import DeleteLight from 'assets/neo_icons/Menu/delete.svg?react'; 
import Button from "components/Core/ButtonNDL";
import ListItemText from "./ListItemText";
import ListItemIcon from "./ListItemIcon"; 

function HierarchyListItem(props) {     
    const theme = useTheme()
    const classes = {
        ListItem:{
            paddingTop: 4, 
            paddingBottom: 4, 
            background: theme.colorPalette.cards,
            border: '1px solid '+theme.colorPalette.divider,
            display: 'flex',
            cursor: 'pointer',
            '&:hover':{
                background: theme.colorPalette.cards
            }
        },
        ListItemIcon:{
            minWidth: 30,
            background: theme.colorPalette.cards
        },
        backTransparent:{
            background: 'transparent !important'
        }
    }
    const [headPlant] = useRecoilState(selectedPlant); 
    const { t } = useTranslation(); 
   
    return ( 
        <div id={'node-' + props.node.name} style={{...classes.ListItem,...(props.selectedNode === props.node.id? classes.backTransparent:{})}}>
            <div style={{display: 'flex'}} onClick={() => { props.handleNodeClick(props.node, props.path) }}>
                <ListItemIcon icon={props.node.icon}/>
                <ListItemText name={props.node.name}/> 
            </div>
            {props.node.id !== headPlant.id ?
                <ToolTip title={t('Delete')} placement="right" >
                    <div style={{ marginLeft: 10, boxShadow: "none"}}> 
                        <Button type="ghost" icon={DeleteLight} onClick={(event) => { props.removeNode(event,props.node, props.path) }}/>
                    </div>
                </ToolTip>
            : null} 
        </div> 
    )
}

export default HierarchyListItem;
