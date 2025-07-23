import React,{useEffect}from 'react';
import{selectedPlant,VisibleModuleAccess,currentUserRole} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import routes from "routes";
import routes_users from "../routes_users";
import {useNavigate } from "react-router-dom";
const HandleRoutes = ({Children}) => {
 const [headPlant] = useRecoilState(selectedPlant);
 const [moduleView] = useRecoilState(VisibleModuleAccess);
 const [currUserRole] = useRecoilState(currentUserRole); 
 let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'plantschema'
 const navigate = useNavigate();

 useEffect(() => {
    if (moduleView?.mainModuleAccess?.length > 0) {
      const mainModules = moduleView.mainModuleAccess
        .filter(x => x.module_id && x.is_visible)
        .map(x => x.module_id);

      if (mainModules.length > 0) {
        const selectedRoutes = currUserRole.id === 3 ? routes_users : routes;
        const filteredRoutes = selectedRoutes.mainRoutes.filter(
          x => mainModules.includes(x.moduleId)
        );

        if (filteredRoutes.length > 0) {
          navigate("/"+plantSchema + filteredRoutes[0].path)
        }
      }
    }
 
}, [moduleView, headPlant,plantSchema,currUserRole]);




 
}

export default HandleRoutes;
