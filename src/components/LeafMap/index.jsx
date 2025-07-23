import React, { useEffect,useState } from 'react';
import { icon } from 'leaflet';
import { MapContainer, TileLayer,Marker,Popup } from 'react-leaflet';
import Grid from 'components/Core/GridNDL' 
import './map.css';
import { useRecoilState, } from "recoil";
import { InstrumentsMapList } from "recoilStore/atoms"; 
import Typography from "components/Core/Typography/TypographyNDL";
import { useTranslation } from "react-i18next";

function MyMap(props) {
    const { t } = useTranslation();
    const [InstrumentsMap] = useRecoilState(InstrumentsMapList);
    const [markers,setMarkers] = useState([]);
    const [Position,setPosition] =useState([13.043288357647459,80.24774471466185]);

    useEffect(()=>{
        let data=[]
        if(props.Markers){
            let filterval = props.Markers.filter(x=>!x.visible)
            
            // eslint-disable-next-line array-callback-return
            markers.forEach(val=>{
                data.push({
                    ...val,
                    visible: (filterval.filter(x=> x.id === val.id).length > 0) ? false : true
                    
                }) 
            })   
            setMarkers(data) 
        }else{
            setMarkers([]) 

        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.Markers])

    useEffect(()=>{
        try{

            let locations
            let MarkData = []
            if(props.data && props.data.length> 0){
                locations =props.data.filter(x=> x.key === 'loc_cord')
                 // eslint-disable-next-line array-callback-return
                 
                 if(locations.length>0){
    
                    // eslint-disable-next-line array-callback-return
                    InstrumentsMap.forEach((val,i)=>{
                        let Latarry = [] 
                        // eslint-disable-next-line array-callback-return
                        const instrumentData = locations.filter(x=> x.iid === val.id); //filtering cordinates param 
                        const LocData= props.data.filter(x=> x.key === 'loc_data' && x.iid === val.id); //filtering other params(speed,temp..etc)
                        const statusArr = props.data.filter(x=> x.key === 'loc_status' && x.iid === val.id);//filtering status param
                        if(instrumentData.length>0){ 
                            // eslint-disable-next-line array-callback-return
                            instrumentData[0].value.split(',').map(m=>{
                                Latarry.push(Number(m))
                            }) 
                            let  markerObj = { //initializing object with necessary details to plot marker
                                name: val.name,
                                visible: true,
                                LatLong: Latarry,  
                                id: val.id
                            };
                            if(LocData.length >0){ //adding other param as object to show extra details
                                let parseObj = JSON.parse(LocData[0].value);
                                let dataKeys = Object.keys(parseObj);
                                dataKeys.forEach(x=>{    
                                    markerObj[x] = parseObj[x];             
                                })
                            }
                            if(statusArr.length > 0){ // adding status object to change marker color accordingly
                                let OtherColor = statusArr[0].value === 'IDLE' ?'yellow':'red'
                                let status = statusArr[0].value === 'ACTIVE' ? 'green': OtherColor;
                                markerObj["color"]= status;
                            }else{
                                markerObj["color"]= 'red';
                            }
                            MarkData.push(markerObj);
                            if(i === 0){
                                setPosition(Latarry)
                            }
                        } 
                     })
                 }
                 
                 setMarkers(MarkData)
            }else{
            setMarkers([]) 

            }
        }catch(err){
            console.log('map',err);
        }  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.data])
      
    const myAPIKey = '148b78bd5cdc4e1bb3a3375cf87535df';
    
    const showParam = (val)=>{
        return Object.keys(val).map(x=>{
            if(!['name','visible','LatLong','id','color'].includes(x)){
                return(
                    <>
                    <Grid item xs={4} sm={4} >
                        <b>{x} </b>
                    </Grid>
                    <Grid item xs={8} sm={8} >
                        : {val[x]}
                    </Grid> 
                    </>
                )
            }else{
                return <></>
            }            
        })   
    }
    return (
        <React.Fragment>
        {markers.length > 0 ?
       
        <MapContainer center={Position} zoom={13} scrollWheelZoom={true} className="map-container" zoomControl={true}>            
           
           
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {
  // eslint-disable-next-line array-callback-return
  markers.map((val, index) => {
    if (val.visible) {
      return (
        <Marker
          key={val.id || index} // Ensure unique keys (prefer using val.id)
          position={val.LatLong}
          icon={icon({
            iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=${val.color}&apiKey=${myAPIKey}`,
            iconSize: [31, 46], 
            iconAnchor: [15.5, 42], 
            popupAnchor: [0, -45]
          })}
          draggable={false}
        >
          <Popup minWidth={250}>
            <Grid container style={{ padding: '10px' }}>
              <Grid item xs={4} sm={4}>
                <b>Location</b>
              </Grid>
              <Grid item xs={8} sm={8}>
                : {val.name}
              </Grid>
              {showParam(val)}
            </Grid>
          </Popup>
        </Marker>
      );
    }
  })
}

        </MapContainer>
        :
        <React.Fragment>
            <Typography variant="4xl-body-01" style={{color:'#0F6FFF', textAlign: "center" }}>
                {t("No Data")}
            </Typography>
            <Typography style={{ textAlign: "center" }}>
                {t("EditORReload")}
            </Typography>
        </React.Fragment>
        }
        </React.Fragment>
    );
  }
  export default MyMap;