import React from "react"; 
import IcondataLight from 'assets/neo_icons/Equipments/light'
import IcondataDark from 'assets/neo_icons/Equipments/dark'
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"; 

function ListItemIcon(props) {     
    const [curTheme] = useRecoilState(themeMode); 
    const classes = { 
        ListItemIcon:{
            minWidth: 30, 
            paddingLeft: 5,
            paddingTop: 5
        }
    } 
    return ( 
            <div style={classes.ListItemIcon}>
                {curTheme === 'dark' ?
                    IcondataDark.filter((x, y) => y === props.icon).map((Component, key) => (
                        <Component />
                    ))
                    :
                    IcondataLight.filter((x, y) => y === props.icon).map((Component, key) => (
                        <Component />
                    ))
                }
            </div> 
    )
}

export default ListItemIcon;
