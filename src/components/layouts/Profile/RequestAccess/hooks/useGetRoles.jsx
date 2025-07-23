import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetRoles = () => {
  const [outRolesLoading, setLoading] = useState(false);
  const [outRolesData, setData] = useState(null);
  const [outRolesError, setError] = useState(null);

  const getRolesList = async () => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.getRoles, {})
      .then((rolesList) => {
        let data = rolesList.neo_skeleton_roles;
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log("NEW MODEL", "ERR", e, "Roles Request Access ", new Date());
        setLoading(false);
        setError(e);
        setData(null);
      });
  };
  return {
    outRolesLoading,
    outRolesData,
    outRolesError,
    getRolesList,
  };
};

export default useGetRoles;
