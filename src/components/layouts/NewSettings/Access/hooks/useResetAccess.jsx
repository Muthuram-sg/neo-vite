import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useResetAccess = () => {
  const [ResetAccessLoading, setLoading] = useState(false);
  const [ResetAccessData, setData] = useState(null);
  const [ResetAccessError, setError] = useState(null);

  const UpdateModuleAndSubModuleVisibility = async (line_id) => {

    setLoading(true);

    try {
      const response = await configParam.RUN_GQL_API(
        Mutations.UpdateModuleAndSubModuleVisibility,{ line_id:line_id }
      );

      if (
        response &&
        response.update_neo_skeleton_module_access &&
        response.update_neo_skeleton_sub_module_access
      ) {
        setData({
          moduleAffectedRows:
            response.update_neo_skeleton_module_access.affected_rows,
          submoduleAffectedRows:
            response.update_neo_skeleton_sub_module_access.affected_rows,
        });
        setError(null); // Clear errors
      } else {
        console.log("Mutation failed or returned incomplete data.");
        setData([]);
        setError(new Error("Failed to update visibility."));
      }
    } catch (e) {
      console.error("Error during mutation:", e);
      setError(e); // Capture error details
      setData([]); // Clear data
    } finally {
      console.log("Reset Access complete.");
      setLoading(false); // Stop loading spinner
    }
  };

  return {
    ResetAccessLoading,
    ResetAccessData,
    ResetAccessError,
    UpdateModuleAndSubModuleVisibility,
  };
};

export default useResetAccess;
