// useChatData.jsx
import { useState } from 'react';
import configParam from 'config';

const useChatData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const getChatData = async (message) => {
    setLoading(true);

      const body= {
          message: message.message,
          sessionId: message.sessionId,
        }
   
    await configParam.RUN_REST_API("/chatbot/sendMessage",body,"","","POST")
   
      .then(result => {
        if(result !== undefined){
          setData(result.data.message)
          setError(false)
          setLoading(false)
      }
      else{
          setData(null)
          setError(true)
          setLoading(false)
          }
       
      })
      .catch((err) => {
        setData(true)
        setError(err)
        setLoading(false)
        console.log('error',err);
      })
    };

  return { loading, data, error, getChatData };
};

export default useChatData;
