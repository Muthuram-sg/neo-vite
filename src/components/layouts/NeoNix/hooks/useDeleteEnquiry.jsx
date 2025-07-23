import { useState } from 'react';
import configParam from 'config';

const useDeleteEnquiry = () => {
  const [deleteEnquiryLoading, setLoading] = useState(false);
  const [deleteEnquiryData, setData] = useState(null);
  const [deleteEnquiryError, setError] = useState(null);

  const getDeleteEnquiry = async (id) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        `/neonix-api/api/EnquiryMaster/RemoveEnquiryMaster`, 
       {'enqId': id},
        "",
        "",
        "DELETE",
        false
      );

      if (result !== undefined) {
        setData(result);
        setError(false);
      } else {
        setData(null);
        setError(true);
      }
    } catch (err) {
      setData(null);
      setError(err);
      console.error('deleteCustomerError', err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteEnquiryLoading, deleteEnquiryData, deleteEnquiryError, getDeleteEnquiry };
};
export default useDeleteEnquiry;