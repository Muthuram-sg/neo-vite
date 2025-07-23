import React,{useState} from "react"; 
import SortableTree from '@nosferatu500/react-sortable-tree'; 
import useTheme from 'TailwindTheme';
import IcondataLight from 'assets/neo_icons/Equipments/light'
import IcondataDark from 'assets/neo_icons/Equipments/dark'
import { useRecoilState } from "recoil";
import { themeMode,selectedPlant } from "recoilStore/atoms";  
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import { useTranslation } from 'react-i18next';
import TypographyNDL from "components/Core/Typography/TypographyNDL";


function HierarchyTree(props) {  
    const [selectedNodeIndex,setSelectedNodeIndex]=useState(null)  
    const theme = useTheme()   
    const classes = {
        ListItem:{
            padding:"4px 6px 4px 6px ",
            // border: '1px solid '+theme.colorPalette.divider,
            display: 'flex',
            cursor: 'pointer',
           
        },
        ListItemIcon:{
            minWidth: 30,
            background: theme.colorPalette.cards,
         
        }, 
        actionIcon: theme.actionIcons,
    }
    const selectedListItemStyle = {
        ...classes.ListItem,
        backgroundColor:"rgba(0, 0, 0, 0.08)",
    };
    const [headPlant] = useRecoilState(selectedPlant); 
    const [curTheme] = useRecoilState(themeMode); 
    
  
    return (
        <SortableTree
            treeData={props.currentHier?props.currentHier:[]}
            onChange={treeData => props.isEdit ? props.changeNode(treeData) : null}
            canDrop={({ nextParent }) => {
                return (nextParent && nextParent.type === 'instrument')||(!nextParent) ? false : true
            }}
            canDrag={() => {
                return props.isEdit ? true : false
            }}
            // eslint-disable-next-line react-hooks/exhaustive-deps
            generateNodeProps={({ node, path, treeIndex }) => ({                
                title: (
                    <li id={'node-' + node.name} className="flex items-center  dark:bg-Background-bg-tertiary-dark " style={selectedNodeIndex===treeIndex?selectedListItemStyle:classes.ListItem} selected={props.selectedIndex ===treeIndex} button onClick={() => { props.handleNodeClick(node, path,treeIndex); setSelectedNodeIndex(treeIndex); }}>
                        <div style={classes.ListItemIcon}>
                            {curTheme === 'dark' ?
                                IcondataDark.filter((x, y) => y === node.icon).map((Component, key) => (
                                    
                                    <Component />  
                                ))
                                :
                                IcondataLight.filter((x, y) => y === node.icon).map((Component, key) => ( 
                                    <Component /> 
                                ))
                            }
                        </div>
                        <TypographyNDL value={node.name} variant='label-02-s' />
                        {node.id !== headPlant.id && props.isEdit ?
                            <div style={{ marginLeft: 10, boxShadow: "none"}}> 
                                <Delete
                                style={classes.actionIcon}
                                stroke={"#ff0d00"}
                                onClick={(event) => { props.removeNode(event,node, path) }}
                                />
                            </div>
                    : null} 
                    </li>
                )
            })}
        />
    );
}

export default HierarchyTree;
