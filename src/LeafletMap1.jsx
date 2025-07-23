/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import L,{ map, tileLayer, Browser,icon,popup,marker } from 'leaflet'; 
import './mymap.css'

const LeafletMap1 = ({
  mapIsReadyCallback /* To be triggered when a map object is created */,
}) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const initialState = {
      lng: 11,
      lat: 49,
      zoom: 4,
    };

    const leafletMap = map(mapContainer.current).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    const myAPIKey = '148b78bd5cdc4e1bb3a3375cf87535df';
    const isRetina = Browser.retina;
    var baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`;
    var retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;
    const markerIcon = icon({
        iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${myAPIKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });
      L.control.tagFilterButton({
        data: ['fast', 'slow', 'none'],
        icon: '<img src="filter.png">',
        filterOnEveryClick: true
    }).addTo( leafletMap );
    const zooMarkerPopup = popup().setContent("This is Munich Zoo");
    marker([48.096980, 11.555466], {
    icon: markerIcon 
    }).bindPopup(zooMarkerPopup).addTo(leafletMap);
    marker([50.096980, 12.555466], {
    icon: markerIcon 
    }).bindPopup(zooMarkerPopup).addTo(leafletMap);
    marker([52.096980, 13.555466], {
    icon: markerIcon 
    }).bindPopup(zooMarkerPopup).addTo(leafletMap);
   
    tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
      maxZoom: 20,
      id: 'osm-bright',
    }).addTo(leafletMap);

    mapIsReadyCallback(leafletMap);
  }, [mapContainer.current]);

  return <div className="map-container" ref={mapContainer}></div>;
};

export default LeafletMap1;