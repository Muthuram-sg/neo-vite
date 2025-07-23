import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useCreateUserRoleLine = () => {
  const [outCreateUserRoleLineLoading, setLoading] = useState(false);
  const [outCreateUserRoleLineData, setData] = useState(null);
  const [outCreateUserRoleLineError, setError] = useState(null);

  const getCreateUserRoleLine = async (
    user_id,
    role_id,
    line_id,
    updated_by
  ) => {
    setLoading(true);

    configParam
      .RUN_GQL_API(mutations.createUserRoleLine, {
        user_id,
        role_id,
        line_id,
        updated_by,
      })
      .then((response) => {
        setData(response);
        console.log("use Create User Role Line");
        setError(false);
        setLoading(false);
      })
      .catch((e) => {
        console.log(
          "NEW MODEL",
          "ERR",
          e,
          " Submit Request Access",
          new Date()
        );
        setLoading(false);
        setError(e);
        setData(null);
      });
  };

  return {
    outCreateUserRoleLineLoading,
    outCreateUserRoleLineData,
    outCreateUserRoleLineError,
    getCreateUserRoleLine,
  };
};

export default useCreateUserRoleLine;
