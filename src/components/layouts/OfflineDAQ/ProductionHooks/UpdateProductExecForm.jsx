import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useEditProductSpeciExec = () => {
 const [EditProductSpecExecLoading, setLoading] = useState(false);
 const [EditProductSpecError, setError] = useState(null);
 const [EditProductSpecData, setData] = useState(null);

 const getEditProductSpecExec = async (id, info) => {
  setLoading(true);
  await configParam.RUN_GQL_API(Mutations.UpdateProductExecSpeci, { id: id, info: info })

   .then((returnData) => {
    if (returnData.update_neo_skeleton_prod_exec) {
     setData(returnData.update_neo_skeleton_prod_exec.affected_rows)
     setError(false)
     setLoading(false)
    }
    else {
     setData(null)
     setError(true)
     setLoading(false)
    }
   })
   .catch((e) => {
    setLoading(false);
    setError(e);
    setData(null);
    console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
   });

 };
 return { EditProductSpecExecLoading, EditProductSpecError, EditProductSpecData, getEditProductSpecExec };
};

export default useEditProductSpeciExec;