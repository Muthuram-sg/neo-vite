import React, { useState } from 'react';
import { Browser,icon } from 'leaflet';
import { MapContainer, TileLayer,Marker,Popup,ZoomControl } from 'react-leaflet';
import Control from "react-leaflet-custom-control"; 
import Grid from 'components/Core/GridNDL'
import './mymap.css';
import Button from 'components/Core/ButtonNDL';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import LocationMark from 'assets/neo_icons/Dashboard/LocationMark.svg?react';

function LeafletMap() {
    const [open,setOpen] = useState(false);
    const [markers,setMarkers] = useState([
        {LatLong:[48.096980,11.555466],name:"Ghat",visible: true},
        {LatLong:[50.096980,13.555466],name:"Munich",id:1,visible: true},
        {LatLong:[52.964517888557534,15.055579936717],name:"Sreperambadur",id:2,visible: true}, 
        {LatLong:[53.47141766214111,17.9762654269251],name:"Chengalpattu",id:3,visible: true}
    ])
    const classes = {
        listDiv:{
            background: '#fff',
            padding: 15,
            borderRadius: 4,
            boxShadow: 'rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px'
        },
        listGroup:{
            marginBlockStart: 0,
            marginBlockEnd: 0,
            paddingInlineStart: 0
        },
        li:{
            listStyleType: 'none'
        }
    }
    const position = [48.096980,11.555466]
    const myAPIKey = '148b78bd5cdc4e1bb3a3375cf87535df';
    const isRetina = Browser.retina;
    var baseUrl = `https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=${myAPIKey}`;
    var retinaUrl = `https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    const markerIcon = icon({
                iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${myAPIKey}`,
                iconSize: [31, 46], // size of the icon
                iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
            });
    const togglePopper = (e) =>{
        console.log(e.currentTarget)
        setOpen(!open);
    }
    const filterMarker = (e,id)=>{ 
        console.log('checkd',e.target.checked)
        const cloned = [...markers];
        const filteredIndex = cloned.findIndex(x=>x.id===id);
        cloned[filteredIndex].visible = e.target.checked;
        setMarkers(cloned);
    }
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="map-container" zoomControl={false}>            
           
            <Control position='topleft'> 
            <Button icon={LocationMark} type='ghost' onClick={togglePopper}/>  
            {
                open&&<div style={classes.listDiv}>
                        <ul style={classes.listGroup}>
                            {
                                markers.map((x)=>{ 
                                        return (
                                            <li style={classes.li}>
                                                <CustomSwitch id={'chk_'+x.name} switch={false} checked={x.visible} onChange={(e)=>filterMarker(e,x.id)} primaryLabel={x.name}/> 
                                            </li>
                                        )                           
                                })      
                                                    
                            }
                        </ul>                        
                    </div>
            }         
            </Control>
            <ZoomControl position='topright'></ZoomControl>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Neo</a> contributors'
                url={isRetina ? retinaUrl : baseUrl}
            />
            {markers.map(val=>{
                if(val.visible){
                    return (
                        <Marker position={val.LatLong} icon={markerIcon} draggable={true}>
                            <Popup minWidth={250}>
                                <Grid container style={{ padding: '10px' }}>
                                    <Grid item xs={4} sm={4} >
                                        Location
                                    </Grid>
                                    <Grid item xs={8} sm={8} >
                                        : {val.name}
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        Metrics
                                    </Grid>
                                    <Grid item xs={8} sm={8} >
                                        : Bystronix Grinding,Grinding Edge,
                                    </Grid>
                                </Grid> 
                            </Popup>
                        </Marker>
                    )
                } 
            })}
            
        </MapContainer>
    );
  }
  export default LeafletMap;