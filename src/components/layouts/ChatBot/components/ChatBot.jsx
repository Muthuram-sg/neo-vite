import React, { useState, useEffect, useRef  } from 'react';
import Avatar from 'components/Core/Avatar/AvatarNDL';
import ImageIcon from 'assets/neo_icons/ChatBot/ChatBot_icon.svg?react';
import ImageHeadIcon from 'assets/neo_icons/ChatBot/ChatBot_icon_head.svg?react';
import ImageVectorIcon from 'assets/neo_icons/ChatBot/ChatBot_minimize-icon.svg?react';
import ImageSendIcon from 'assets/neo_icons/ChatBot/ChatBot_Send.svg?react';
import ArrowsInSimpleIcon from 'assets/neo_icons/ChatBot/ArrowsInSimple.svg?react';
import ArrowsOutSimpleIcon from 'assets/neo_icons/ChatBot/ArrowsOutSimple.svg?react';
import RefreshIcon from 'assets/neo_icons/ChatBot/refresh.svg?react';
import CloseIcon from 'assets/neo_icons/ChatBot/Close.svg?react';
import { hrms, userData } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import configParam from 'config';
import InputFieldNDL from "components/Core/InputFieldNDL";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Typography from 'components/Core/Typography/TypographyNDL';
import useChatData from './useChatData';

export default function Chatbot() {
  const location = useLocation();
  const chatAreaRef = useRef(null);
  const [isChatVisible, setChatVisible] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [hrmsDetails, setHRMSDetails] = useRecoilState(hrms);
  const [userDetails] = useRecoilState(userData);
  const [sessionId, setSessionId] = useState(null);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [isChatBotExpand, setIsChatBotExpand] = useState(false);
  const {loading, data, error, getChatData} = useChatData()
  const [resposeData, setResposeData] = useState({}); 


  const { t } = useTranslation();

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };

  const toggleChatClose = () => {
    setChatVisible(false);
  };

  const toggleChatRefresh = () => {
    generateNewSessionId();
    setChatHistory([])
  };

  const toggleChatExpand = () => {
    setIsChatBotExpand(!isChatBotExpand)
  };   


 

  useEffect(() => {
    if (!loading && data && !error) {
      let history = [...chatHistory]
      let newResp = {
        type: 'bot',
        text: data
      };
      history.push(newResp);
      setResposeData(data);
      setChatHistory(history);
    }else if(data && !loading && error){
      let history = [...chatHistory]
      let newResp = {
        type: 'bot',
        text: "Sorry some thing unexpected happen ! Please try again"
      };
      history.push(newResp);
      setChatHistory(history);
    }
  }, [loading, data, error]);

  const handleSendMessage = async (messageText, sessionId) => {
  
    if (messageText.trim() !== '') {
      try {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { type: 'user', text: messageText },
        ]);
  
        getChatData({
          message: messageText,
          sessionId: sessionId,
        });

      } catch (error) {
        console.error('Error sending Message and Session ID to the server:', error);
      } finally {
        setLoaderStatus(false);
      }
    }
  };
  
  
  let altname;
  if (userDetails.name) {
    const nameParts = userDetails.name.split(' ');

    if (nameParts.length > 1) {
      altname = `${nameParts[0][0]}${nameParts[1][0]}`;
    } else if (nameParts[0].length > 1) {
      altname = `${nameParts[0][0]}${nameParts[0][1]}`;
    } else {
      altname = `${nameParts[0][0]}${nameParts[0][0]}`;
    }
  }

  const generateNewSessionId = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);

    localStorage.setItem('chatbotSessionId', newSessionId);
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatbotSessionId');
  
    if (!storedSessionId) {
      generateNewSessionId();
    } else {
      setSessionId(storedSessionId);
    }
  
    const handleBeforeUnload = () => {
      localStorage.removeItem('chatbotSessionId');
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);  

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatHistory, loaderStatus]);

  useEffect(() => {
    if (selectedOption || userMessage.trim() !== '') {
      setChatHistory((prevChatHistory) => [...prevChatHistory]);
  
      if (selectedOption) {
        handleSendMessage(selectedOption, sessionId);
      } else if (userMessage.trim() !== '') {
        handleSendMessage(userMessage, sessionId);
        setUserMessage('');
      }
    }
  }, [selectedOption]);

  const setSelectedOptionAndSendMessage = (option) => {
    setSelectedOption(option);
  };

  const handleUserMessageChange = (e) => {
    if(!loading){
      setUserMessage(e.target.value);
    }
   
  }

  const handleUserMessage = async () => {
    
    if (userMessage.trim() !== '' && !loading) {
      
      try {
        await handleSendMessage(userMessage, sessionId);
  
         setUserMessage('');
      } catch (error) {
        console.error('Error handling user message:', error);
      }
    }
  };

  const handleKeyDown = (event,load) => {
   
    
      if (((event.code === 'Enter' || event.code === 'NumpadEnter') && !load)) {
        if(!load){ 
          handleUserMessage();
        }
      } 
      
   
  };
  

  let imagepathurl = hrmsDetails && hrmsDetails.baseImage ? hrmsDetails.baseImage : '';

  return (
    <React.Fragment>
      {/* {location.pathname !== '/login' && !isChatVisible && ( 
      <ImageIcon
        stroke={'#0084FF'}
        className='ChatBotIcon p-2 bg-white rounded-full cursor-pointer fixed z-10 w-14 h-14 bottom-[3rem] right-[3rem]'
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid transparent',
        }}
        alt='ChatBot'
        onClick={toggleChat}
      />
      )} */}

      {isChatVisible && (
        <div
          className={`${isChatBotExpand ? 'w-[888px] h-[40vw]' : 'w-[444px] h-[30vw]' } fixed bottom-[2vw] right-[2vw] rounded-3xl z-10000 border-solid border-primary-border border-[4px] bg-primary-border`}
        >
          <div className='flex gap-2 h-[96px] items-center p-4'>
              <ImageHeadIcon
                className=' w-[56px] h-[56px] text-primary-bg '
              />
              <div>
                <Typography value={'Neo Bot'} variant={'heading-01-m'} color={"#FFFFFF"} />
                <Typography value={'You can ask me anything'} variant={'lable-01-s'} color={"#FFFFFF"} />
              </div>

            <div className='flex ml-auto float-right h-[96px] p-4 gap-2'>
                  <RefreshIcon onClick={toggleChatRefresh}/>
                  { isChatBotExpand ? <ArrowsInSimpleIcon  onClick={toggleChatExpand}/> : <ArrowsOutSimpleIcon onClick={toggleChatExpand}/> }
                  <CloseIcon onClick={toggleChatClose}/>
            </div>
          </div>
          <div
            className={`ChatBotBody ${isChatBotExpand ? 'w-[888px] h-[35vw]' : 'w-[444px] h-[25vw]' } justify-center border-primary-border border-solid border-[4px] bottom-[2vw] fixed right-[2vw] z-10000 rounded-3xl bg-primary-bg`} >
            <div className='ChatArea overflow-y-scroll' 
            ref={chatAreaRef}
            style={{  height: 'calc(100% - 60px)', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }} >
              <div className='font-bold my-2 font-geist-sans text-sm text-tertiary-text text-center'>
                Today
              </div>
              <div className='ChatMessages'>
                <div className='UserMessage flex items-center my-2'  >
                <div className='ImageContainer flex items-end '>
                  <ImageIcon className='w-5 h-5 mx-2'
                   />
                  <div
                    className='ChatMessage text-base font-geist-sans bg-secondary-bg p-2 rounded-tl-[11px] rounded-tr-[11px] rounded-br-[11px] rounded-bl-[0px] text-primary-text justify-start max-w-[323px] whitespace-normal' >
                    Hi there, Neo's intelligent assistant.<br/> How can i help you today?
                  </div>
                </div>
                  </div>
                {chatHistory.map((message, index) => (
                  <div key={index} className={message.type === 'user' ? 'UserMessage' : 'BotMessage'}>
                    {message.type === 'user' && (
                      <div
                        className='pt-[1rem] ReceivedMessage text-base font-geist-sans flex items-center justify-end my-2' >
                          <div className='ImageContainer flex items-end '>
                        <div style={{ wordWrap: 'break-word' }} className='p-2 text-primary-bg bg-primary-border rounded-bl-[11px] rounded-br-[0px] rounded-tr-[11px] rounded-tl-[11px] max-w-[323px] whitespace-normal' >
                          {message.text}
                        </div>
                        <div id='profile-button' color='inherit' className='pr-2.5 pl-2'  >
                          <Avatar
                            src={hrmsDetails.baseImage ? `data:image/png;base64,${imagepathurl}` : ''}
                            alt={'Profile Image'}
                            initial={altname}
                            className={'w-5 h-5 rounded-full'}
                            style={{ order: 2 }}
                          />
                        </div>
                      </div>
                      </div>
                    )}
                    {message.type === 'bot' && (
                      <div
                        className='pt-[1rem] UserMessage text-base font-geist-sans flex items-center my-2' >
                          <div className='ImageContainer flex items-end '>
                        <ImageIcon className='w-5 h-5 mx-2 ' />
                        <div className='ChatMessage bg-secondary-bg p-2 rounded-tl-[11px] rounded-tr-[11px] rounded-br-[11px] rounded-bl-[0px] text-primary-text justify-start max-w-[323px] whitespace-normal'  
                        dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br>') }}>
                        </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Display loader at the bottom of chat history when loaderStatus is true */}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <CircularProgress disableShrink size={20} color='primary' />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`ChatInput flex gap-2 fixed border-solid border-t-2 border-secondary-bg bottom-[2.2vw] pb-[8px] ${isChatBotExpand ? 'w-[882px]' : 'w-[438px]' } h-[60px] p-[8px]`} >
                <div className='flex-1 px-2 pr-0 bg-secondary-bg rounded-lg border-none w-[400px] h-[40px]'>
                <InputFieldNDL
                  placeholder={t("Ask Anything...")}
                  size="small"
                  type="text"
                  value={userMessage}
                  onKeyPress={(e) =>  handleKeyDown(e,loading)}
                  onChange={handleUserMessageChange}
                  dynamic={loading}
                /></div>
                <ImageSendIcon
                className={`ml-0 border-none rounded-lg cursor-pointer h-[40px] float-right ${loading ? 'opacity-50' : ''}`}
                onClick={handleUserMessage}
                disabled={loading}
              />

            </div>
          </div>
        </div>
      )}
      </React.Fragment>
  );
}
