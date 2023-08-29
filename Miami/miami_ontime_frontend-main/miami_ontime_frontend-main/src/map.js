import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayerGroup, LayersControl, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { get_route, get_stops } from './axios';
import L from 'leaflet';
import dataContext from './context'
import { showLoading } from 'react-global-loading';
import { MapPopUp } from './mui';


const Create_stop_icon = ((path) => {
  return new L.Icon({
    iconUrl: path,
    popupAnchor:  [-0, -0],
    iconSize: [25,25],     
  })
});

const Stop_icon = [
  Create_stop_icon('./image/blu.jpg'),
  Create_stop_icon('./image/red.jpg'),
  Create_stop_icon('./image/org.jpg'),
  Create_stop_icon('./image/yel.jpg'),
  Create_stop_icon('./image/pur.jpg'),
]

const Map = () => {
    const center = [25.761681, -80.191788]

    const colorOptions = [{ color: '#6699ff', weight: 5 }, 
                         { color: '#ff6666', weight: 5 }, 
                         { color: '#fc8403', weight: 5 },
                         { color: '#ffff66', weight: 5 },
                         { color: '#f803fc', weight: 5 }];
      
    const [currentRoute, setCurrentRoute] = useState([]);
    const [currentStop, setCurrentStop] = useState([]);
    const {rows, displayRoute } = useContext(dataContext);
    const routes = rows.map(row => row[0]);

    useEffect(() => {
      const getAllRoutes = async () => {
        const promises = routes.map(async route => { return get_route(route); });
        const allRoutes = await Promise.all(promises);
        setCurrentRoute(convertToList(allRoutes));
      };

      const getAllStops = async () => {
        const promises = routes.map(async route => { return get_stops(route); });
        const allStops = await Promise.all(promises);
        setCurrentStop(allStops);
        showLoading(false);
      };

      if (rows.length > 0) {
        getAllRoutes();
        getAllStops();
      }
      
    }, [rows]);

     return (
          <MapContainer center={center} zoom={10} scrollWheelZoom={true}>
          <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker position={currentCoordinates} eventHandlers={{click: () => handleMarkerClick("11").then((res) => {setCurrentRoute(res)})}}>
               <Popup>
               A pretty CSS3 popup. <br /> Easily customizable.
               </Popup>
          </Marker> */}
          <LayersControl>
            <LayersControl.Overlay checked={true} name='Stops'>
              <LayerGroup id="Stops">
                {
                  (currentStop.map((routeStop, index) => {
                    return routeStop.map((stop) => {
                      return <Marker icon={Stop_icon[index]} position={[stop[0], stop[1]]}>
                        <Popup>
                          <h3>Station Name: {stop[2]}</h3>
                          <MapPopUp route={routes[index]} stopName={stop[2]}/>
                        </Popup>
                      </Marker>
                    });
                  }  
                  ))
                }
              </LayerGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked={false} name='Routes'>
              <LayerGroup id="Routes">
                {
                  (currentRoute.length > 0 ? (currentRoute.map((route, index) => 
                  (<Polyline pathOptions={colorOptions[index]} positions={route} />)  
                  )) : <></>)
                }
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
          
          </MapContainer>
     );
}

export default Map;

const convertToList = (routes) => {
  var list = [];

  routes.forEach(geometryString => {
    var geoList = [];
    // Remove the "MULTILINESTRING" prefix and parentheses
    const cleanedString = geometryString.replace("MULTILINESTRING (", "").replace(/\)/g, "").replace(/\(/g, "");
    // Split the string into individual line strings
    const lineStrings = cleanedString.split(", ");

      // Process each line string
    lineStrings.forEach((lineString) => {
      // Split the line string into individual points
      const points = lineString.split(", ");

      // Process each point
      points.forEach((point) => {
        // Split the point into latitude and longitude
        const [longitude, latitude] = point.split(" ");

        // Convert the latitude and longitude to numbers
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        geoList.push([lat, lon]);
      });
    });
    list.push(geoList);
  });
  return list;
}