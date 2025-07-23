import React from "react";   
import MoreVertLight from 'assets/neo_icons/Dashboard/Overflow_Menu.svg?react';


export default function TilesNDL(props) { 
   
    return (
        <div className="Tiles-main">
           {props.icon ?<props.icon/> : <React.Fragment></React.Fragment>} 
            <div className="Tiles-content">
                <div>
                    <p className="Tiles-title">{props.title}</p>
                    <p className="Tiles-sub" style={{marginTop:'15px'}}>{props.sub1}</p>
                </div>
                {props.sub2 &&
                <div>
                    <div style={{display: 'flex',justifyContent: 'end'}}>
                        <MoreVertLight />
                    </div>
                    <p className="Tiles-sub">{props.sub2}</p>
                </div>
                }
            </div> 
        </div>

    )
}

