import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import configParam from 'config';

export default function OpenSeadragonViewer(props) {
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const removeHttps = (url) => {
    return url.replace(/^https?:\/\//, '');
};

  const url = configParam.API_URL + '/iiot/getTileImage?image_url=' + removeHttps(props.tileurl);
  useEffect(() => {
    setError(null);
    setLoading(true);
  
    const initializeViewer = () => {
      const viewerElement = document.getElementById('viewer');
      if (!viewerElement) {
        console.error("Viewer element not found in the DOM.");
        setError('Viewer element not found in the DOM.');
        setLoading(false);
        return;
      }
  
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
  
      if (!props.tileurl) {
        setError('Tile URL is missing or invalid.');
        setLoading(false);
        return;
      }
  
      try {
        console.log("Initializing OpenSeadragon viewer...");
        const viewer = OpenSeadragon({
          id: 'viewer',
          prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
          tileSources: url,
        });
        console.log("OpenSeadragon viewer initialized.");
  
        viewer.addHandler('open-failed', () => {
          console.error("Image not found or failed to load.");
          setError('Image not found or failed to load.');
          setLoading(false);
        });
  
        viewer.addHandler('open', () => {
          setLoading(false);
        });
  
        viewerRef.current = viewer;
      } catch (err) {
        console.error("Caught error during OpenSeadragon initialization:", err);
        setError('Failed to initialize the viewer. Please check the tile URL.');
        setLoading(false);
      }
    };
  
    // Delay initialization slightly to ensure the DOM is ready
    const timeoutId = setTimeout(initializeViewer, 100);
  
    return () => {
      clearTimeout(timeoutId);
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [props.tileurl, url]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red' }}>
        <h2>{error}</h2>
        {/* Optional: Add a fallback image */}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '350px' }}>
      <div id="viewer" style={{ width: '100%', height: '100%' }} />
      {loading && <div>Loading...</div>}
    </div>
  );
}