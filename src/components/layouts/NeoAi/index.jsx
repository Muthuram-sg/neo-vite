import React, { useState, useRef, useEffect } from 'react'
import PulseIcon from 'assets/neo_icons/NeoAI/pulseIcon.svg?react';
import RefreshIcon from 'assets/neo_icons/NeoAI/refresh.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL';
import { useRecoilState } from 'recoil';
import {AiConversation} from "recoilStore/atoms";
import usegetAiResponse from './hooks/useGetAIResponse';
import useSendFeedback from './hooks/useSendFeedback'
import {selectedPlant,user,snackToggle,snackMessage,snackType,themeMode} from 'recoilStore/atoms';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { marked } from "marked";
// import "@splinetool/viewer"; 

marked.setOptions({ gfm: true, breaks: true });





export default function Index() {
    const [conversation, setconversation] = useRecoilState(AiConversation)
    const [currTheme] = useRecoilState(themeMode)
    const userMessage = useRef()
    const messagesEndRef = useRef()
    const { AiResponseLoading, AiResponseData, AiResponseError, getAiResponse } = usegetAiResponse()
    const {sendFeedBackLoading, sendFeedBackData, sendFeedBackError, getsendFeedBack} = useSendFeedback()
    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(user);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setType] = useRecoilState(snackType);
    const [sessionId, setSessionId] = useState(null);
    const [height,setheight] = useState('')
    const [contentHeight,setcontentHeight] = useState("77vh")
    const [latestPayLoad,setlatestPayLoad] = useState(null)
    const [customloader,setcustomloader] = useState(false)


    useEffect(() => {
        const processAiResponse = async () => {
            if (!AiResponseLoading && AiResponseData && !AiResponseError) {
                // Handle error case
                if (AiResponseData.errorTitle) {
                    setconversation((prevConversation) => [
                        ...prevConversation,
                        { type: "bot", message: "Something went wrong. Please try again.", messagetype: "error" },
                    ]);
                    return;
                }
    
                if (AiResponseData.body) {
                    const reader = AiResponseData.body.getReader();
                    const decoder = new TextDecoder();
                    let botMessage = '';
                    let buffer = ''; // Buffer to hold incomplete data
                   try{
                    while (true) {
                        setcustomloader(true);
                        const { done, value } = await reader.read();
    
                        // Stop if the stream is done
                        if (done) break;
    
                        // Decode the stream chunk
                        const chunk = decoder.decode(value, { stream: true });
    
                        // Check for error messages in the chunk
                        if (chunk.includes('"message"')) {
                            let errormessage = JSON.parse(chunk);
                            if (Object.keys(errormessage).length === 1 && errormessage.message) {
                                setconversation((prevConversation) => [
                                    ...prevConversation,
                                    { type: "bot", message: errormessage.message, messagetype: "error" },
                                ]);
                                setcustomloader(false);
                                return;
                            }
                        }
    
                        // Append the new chunk to the buffer
                        buffer += chunk;
    
                        // Split the buffer into lines
                        const lines = buffer.split('\n');
    
                        // Process complete lines and keep the last (potentially incomplete) line in the buffer
                        for (let i = 0; i < lines.length - 1; i++) {
                            const line = lines[i].trim();
                            if (line.startsWith('data:')) {
                                try {
                                    const jsonString = line.slice(5).trim(); // Remove "data:" prefix
                                    if (jsonString.endsWith('}')) { // Check if the JSON string is complete
                                        const jsonData = JSON.parse(jsonString); // Parse JSON
                                        botMessage += jsonData.content;
    
                                        // Simulate a delay for streaming effect
                                        await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust delay time as needed
    
                                        // Update the conversation state
                                        setconversation((prevConversation) => {
                                            const lastMessage = prevConversation[prevConversation.length - 1];
                                            const htmlMessage = marked(botMessage); // Convert Markdown to HTML
    
                                            if (jsonData.status === 'complete' && jsonData.content === '') {
                                                return [
                                                    ...prevConversation,
                                                    { type: "bot", messagetype: "Satisfy", jsonBody: latestPayLoad, buttonEnable: true, }
                                                ];
                                            }else if(jsonData.status === 'complete' && jsonData.content !== ''){
                                                return [
                                                    ...prevConversation,
                                                    { type: 'bot', message: htmlMessage, messagetype: jsonData.status },
                                                    { type: "bot", messagetype: "Satisfy", jsonBody: latestPayLoad, buttonEnable: true, }
                                                ];

                                            } else if (lastMessage && lastMessage.type === 'bot' && lastMessage.messagetype !== 'complete') {
                                                // Update the last streaming message
                                                return [
                                                    ...prevConversation.slice(0, -1), // Remove the last message
                                                    { type: 'bot', message: htmlMessage, messagetype: jsonData.status } // Update message
                                                ];
                                            } else {
                                                // Add a new streaming message
                                                return [
                                                    ...prevConversation,
                                                    { type: 'bot', message: htmlMessage, messagetype: jsonData.status }
                                                ];
                                            }
                                        });
                                    }
                                } catch (error) {
                                    console.error("Error parsing JSON:", error);
                                }
                            }
                        }
    
                        // Keep the last (potentially incomplete) line in the buffer
                        buffer = lines[lines.length - 1];
                    }
                    setcustomloader(false);

                   }catch(e){
                    // console.log(e,"error")
                    setcustomloader(false);
                   }
                 
    
                } else {
                    setconversation((prevConversation) => [
                        ...prevConversation,
                        { type: "bot", message: "Something went wrong. Please try again.", messagetype: "error" },
                    ]);
                }
            } else if (!AiResponseLoading && AiResponseError) {
                // Handle error case
                setconversation((prevConversation) => [
                    ...prevConversation,
                    { type: "bot", message: "Something went wrong. Please try again.", messagetype: "error" },
                ]);
            }
        };
    
        processAiResponse();
    }, [AiResponseLoading, AiResponseData, AiResponseError]);
    
    

    useEffect(()=>{
        if(!sendFeedBackLoading && sendFeedBackData && !sendFeedBackError){
            //console.log(sendFeedBackData,'sendFeedBackData')

        }

    },[sendFeedBackLoading, sendFeedBackData, sendFeedBackError])

    const generateNewSessionId = () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        localStorage.setItem('neoAiChatId', newSessionId);
      };


      useEffect(() => {
        const storedSessionId = localStorage.getItem('neoAiChatId');
        if (!storedSessionId) {
          generateNewSessionId();
        } else {
          setSessionId(storedSessionId);
        }
        const handleBeforeUnload = () => {
          localStorage.removeItem('neoAiChatId');
        };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);  
      

      useEffect(()=>{
        generateNewSessionId();
      },[headPlant])



    const triggerApi = (e,value,type) => {
        // //console.log('hi',value)
            if(value){
                userMessage.current.value = e 
            }else{
                if ((e.code === "Enter" || e.code === "NumpadEnter") || type) {
                    // //console.log("enter")
                    if(!type){
                        e.preventDefault();
                    }
        if(userMessage.current && userMessage.current.value !=='' ){

                    const message = userMessage.current.value;
                    setconversation(prevConversation => {
                        // Modify existing items and add a new item at the end
                        return [
                            ...prevConversation.filter(item => 
                              !item.buttonEnable)
                                 ,
                            { type: "user", message: message }  // Adding the new conversation item
                        ];
                    });
                    
                        userMessage.current.value = ''
                        userMessage.current.style.height = '32px'
                        setheight(32)
                        getAiResponse({data:{
                            "question": message,
                            "schema": headPlant.schema,
                            "line_id": headPlant.id, 
                            "user_id": currUser.id,
                            "chat_id": sessionId
                        }})
                        // {payload:JsonBody,reqjson:req.body.data}
                        setlatestPayLoad({
                            payload:{data:{
                                "question": message,
                                "schema": headPlant.schema,
                                "line_id": headPlant.id, 
                                "user_id": currUser.id,
                                "chat_id": sessionId
                            }},
                            reqjson:{"question": message,
                            "schema": headPlant.schema,
                            "line_id": headPlant.id, 
                            "user_id": currUser.id,
                            "chat_id": sessionId}
                        })
                    }
                        else{
                            setOpenSnack(true)
                            setSnackMessage("Please Enter your Quries")
                            setType("warning")
                        }
                
            }
        }
        scrollToBottom();
       
    }

    const LoaderText =  [
        "Processing your request. Please hold on for a moment ",
        "Fetching the data. This will just take a second ",
        "Working on it. Your results will be ready shortly ",
        "Gathering the information you requested. Almost done! ",
        "I'm on it! Please wait while I retrieve the data "
    ]
   

    function getRandomColorIndex() {
        const randomText = LoaderText[Math.floor(Math.random() * LoaderText.length)];
        return (
          <span>
            {randomText}
            <span className="dots"></span>
          </span>
        );
      }

    const ClearChat = () => {
        generateNewSessionId();
        setconversation([])
    }
    const downloadExcel = (data,fileName) => {
        // Create a new workbook

        // //console.log(data,"data")
        if (!data || !Array.isArray(data)) {
            console.error('Data is undefined or not an array');
            return; // Prevent further execution if data is invalid
        }
        const workbook = XLSX.utils.book_new();
        
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        
        // Save the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
      function base64ToImage(base64Str, filename) {
        // Create a link element
        const link = document.createElement('a');
        
        // Set the link's href to the Base64 string
        link.href = base64Str;
        
        // Set the download attribute with a filename
        link.download = filename;
        
        // Trigger a click on the link to download the image
        document.body.appendChild(link);
        link.click();
        
        // Remove the link after download
        document.body.removeChild(link);
    }

    const satisfyOption = ['Very Satisfied','Satisfied','Not Satisfied','Irrelevant']

    
    const handleSatisfyClick = (type,jsonQes)=>{
        
        let body = {data:{
            query:jsonQes.reqjson.question,feedback:type,payload:jsonQes.payload.data,user_id:jsonQes.reqjson.user_id,chat_id:jsonQes.reqjson.chat_id
        }}
        //console.log(jsonQes,"jsonQes",body)
        let responseMessage
        if(type === "Very Satisfied" ){
            responseMessage = "Thank you! We’re delighted you’re satisfied!"
        }else if(type === "Satisfied"){
            responseMessage = "Thank you! We appreciate your feedback!"
        }else{
            responseMessage = `Sorry for the inconvenience. Here are some sample questions to enhance your experience.
 
What  is the hour-wise {metric} of {instrument name} for the last 2 days ?
How many critical alerts are there today ?
Tell me the asset health status of my line.
What is my line's connectivity status now ?
How many open tasks are there ?`
        }
        setconversation(prevConversation => {
            // Modify existing items and add a new item at the end
            return [
                ...prevConversation.map(item => 
                    item.messagetype === 'Satisfy' 
                        ? { ...item, buttonEnable: false }  // Modifying the specific key
                        : item
                ),
                { type: "user", message: type },{type:"bot",messagetype:"error",message:responseMessage}  // Adding the new conversation item
            ];
        });
        getsendFeedBack(body)
        
    }


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      useEffect(() => {
        scrollToBottom();
      }, [conversation, AiResponseLoading]); 


     
      
      function autoResize(e) {
        if(e.target.value !==''){
            //console.log(e.target.value.length,"e.target.value.length")
            e.target.style.height = 'auto'; // Reset the height to allow shrinking
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; // Cap the height at 200px
            if(e.target.value.length >=221){
                setcontentHeight('70vh')
            }
        }else{
            e.target.style.height = "32px"; // Cap the height at 200px
            setcontentHeight('77vh')

        }
       
    }

    // console.log(conversation,"conversation")
  
    return (
        <Grid container spacing={0} className={"bg-Background-bg-primary dark:bg-Background-bg-primary-dark"}>
            <Grid xs={2} />
            <Grid xs={8} >
                <div className='flex flex-col min-h-screen   items-center justify-between'>
                <div className={` ${conversation.length > 0 ? 'w-full' : 'flex mt-[120px] flex-col justify-center items-center'}  `} >
                    {
                        conversation.length > 0 ?
                            <div className='flex flex-col gap-4'>
                                <div className='ml-auto mt-4'>
                                    <Button type={'ghost'} danger value={"Clear Chat"} disabled={AiResponseLoading || customloader} icon={RefreshIcon} onClick={() => ClearChat()} />
                                </div>
                                <div className={`p-4 flex flex-col gap-3 h-[${contentHeight}vh] overflow-y-auto`} style={{height:contentHeight}}>
                                    {
                                        conversation.map((x,index) => {
                                            if (x.type === 'bot') {
                                                return (
                                                    <div className='self-start rounded-xl   py-3 px-4 bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark border border-Border-border-50 dark:border-Border-border-dark-50'>
                                                        {
                                                            x.messagetype === 'error' ?
                                                            <pre className={`text-[14px] text-Text-text-secondary dark:text-Text-text-secondary-dark leading-[16px] font-normal  font-geist-sans my-0`}>{x.message}</pre>
                                                            // <Typography value={x.message} color='secondary' variant='paragraph-s' />
                                                        :x.messagetype === 'Satisfy' ? 
                                                        <React.Fragment>
                                                            <Typography value="Was this answer satisfactory" color='secondary' variant="paragraph-s" />
                                                            {
                                                                x.buttonEnable && 
                                                                <div className='flex mt-1 items-center cursor-pointer gap-2 justify-start'>
                                                                { satisfyOption.map(k=>{
                                                                 return(
                                                                     <div onClick={()=>handleSatisfyClick(k,x.jsonBody)} className='bg-Surface-surface-default-100 dark:bg-Surface-surface-default-100-dark text-[12px] text-center leading-[14px] text-Text-text-secondary dark:text-Text-text-secondary-dark min-w-[80px]  py-1 px-2 rounded-lg font-geist-sans border border-Border-border-50 dark:border-Border-border-dark-50'>
                                                                     {k}
                                                                 </div>
                                                                 )
                                                                })
                                                                 }
                                                                 </div>
                                                            }
                                                           
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            {
                                                                x.message && 
                                                                // <div>
                                                                <div
                                                                className="text-[14px] custom-Ailist highGraph-AIcontent text-Text-text-secondary dark:text-Text-text-secondary-dark leading-[16px] font-normal font-geist-sans "
                                                                dangerouslySetInnerHTML={{
                                                                    __html: x.message.replace(/\n/g, '<br>')
                                                                }}
                                                            >
                                                            {/* {x.message.parse()} */}
                                                            </div>
                                            }
                                                            {/* <div className='mt-2' />
                                                            <Typography variant='paragraph-s'  value="Click Here to Download:"  />
                                                            <div className='flex items-center  gap-2 justify-start mt-2'>
                                                                {
                                                                    x.chartType !== 'table' && 
                                                                    <div onClick={()=>base64ToImage("data:image/png;base64," + x.chartData,"Image" + index)}  className='cursor-pointer text-Text-text-secondary dark:text-Text-text-secondary-dark bg-Surface-surface-default-100 dark:bg-Surface-surface-default-100-dark text-[12px] leading-[14px] min-w-[80px]  py-1 px-2 rounded-lg font-geist-sans border border-Border-border-50 dark:dark:border-Border-border-dark-50'>
                                                                    Download as PNG
                                                                    </div>
                                                                }
                                                            <div onClick={()=>downloadExcel(x.downloadData,'Table' + index)}  className='cursor-pointer text-Text-text-secondary dark:text-Text-text-secondary-dark bg-Surface-surface-default-100 dark:bg-Surface-surface-default-100-dark min-w-[80px] text-[12px] leading-[14px]  py-1 px-2 rounded-lg font-geist-sans border border-Border-border-50 dark:dark:border-Border-border-dark-50'>
                                                            Download as CSV
                                                            </div>
                                                            </div>
                                                            </div> */}
                                                            {/* } */}
                                                      
                                                        </React.Fragment>
                                                     }
                                                     
                                                        {/* <Typography value={x.message} color='secondary' variant='paragraph-s' />
                                                        {x.chartType && (
                      <Typography value={`Here is your ${x.chartType}`} color='secondary' variant='paragraph-s' />
                    )}
                    {x.chartData && (
                      <img
                        src={`data:image/png;base64,${x.chartData}`}
                        className="rounded-md"
                      />
                    )} */}
                                                    </div>
                                                )

                                            } else {
                                                return (
                                                    <div className=' self-end rounded-xl  py-3 px-4 bg-Surface-surface-default-100 dark:bg-Surface-surface-default-100-dark border border-Border-border-50 dark:border-Border-border-dark-50'>
                                                        <Typography value={x.message} variant='paragraph-s' />
                                          </div>
                                                )
                                            }

                                        })
                                    }  
                                    {(AiResponseLoading) && (
                              <div class="flex flex-col">
                                  <div className=' self-start rounded-xl  px-4 py-3 bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark border border-Border-border-50 dark:border-Border-border-dark-50'>
                                                        <Typography value={getRandomColorIndex()} variant='paragraph-s' color="secondary" />
                                          </div>
                               
    
                              </div>)
                              }
                              <div ref={messagesEndRef} />
                                </div>
                               
                            </div>
                            :   
                            <React.Fragment>
                                {/* <div onWheel={handleWheel}>
                                <spline-viewer
                                    url="https://prod.spline.design/b8XGcnYTw4k5S82M/scene.splinecode"
                                    style={{ width: "100%", height: "280px" }}
                                ></spline-viewer>
                                </div>
                                <div className='relative bottom-[57px]  z-10 rounded-xl left-[101px] w-[144px] h-[40px]  bg-Background-bg-secondary p-2 text-center font-[18px]  leading-5 font-geist-sans font-semibold'>
                                <span className="gradient-text ">NEO AI</span>
                                </div> */}
                                <PulseIcon  />
                                
                                <div className='mb-4' />
                                {/* Main Text */}
                                <Typography value='How can I assist with your operations today?' style={{ textAlign: "center" }} variant='display-xs' />
                                {/* Subtext */}
                                <div className='mb-4' />
                                <Typography value='You can ask me things like' color='secondary' variant='paragraph-s' />
                                {/* Button examples */}
                                <div className='mb-4' />
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <button onClick={()=>triggerApi("What is the day wise average {metric} last week in {instrument name} ?",true)} className="px-4 py-2 text-center min-h-[52px]  bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark  rounded-xl border border-Border-border-50 dark:border-Border-border-dark-50 text-[12px] dark:text-Text-text-primary-dark   text-Text-text-primary leading-[14px] font-normal font-geist-sans">
                                    {'What is the day wise average {metric} last week in {instrument name} ?'}
                                    </button>
                                    <button onClick={()=>triggerApi("What is the maximum {metric} in {instrument name} on 3rd February last year ?",true)} className="px-4 py-2 text-center min-h-[52px]  bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark  rounded-xl border border-Border-border-50 dark:border-Border-border-dark-50 text-[12px] dark:text-Text-text-primary-dark   text-Text-text-primary leading-[14px] font-normal font-geist-sans">
                                    {"What is the maximum {metric} in {instrument name} on 3rd February last year ?"}
                                    </button>
                                    <button onClick={()=>triggerApi("whats the {metric} of {instrument} value of today?",true)} className="px-4 py-2 text-center min-h-[52px]  bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark  rounded-xl border border-Border-border-50 dark:border-Border-border-dark-50 text-[12px] dark:text-Text-text-primary-dark   text-Text-text-primary leading-[14px] font-normal font-geist-sans">
                                       {"whats the {metric} of {instrument} value of today ?"}
                                    </button>
                                </div>
                                {/* Query Info */}
                                <div className="text-center mt-4">
                                    <Typography value='A well-formed query should include:' color='secondary' variant='paragraph-s' />
                                    <ul className="text-Text-text-tertiary dark:text-Text-text-tertiary text-sm list-disc flex flex-col gap-0.5 list-inside mt-3 text-left">
                                        <Typography value='• The entity name (e.g., asset name, instrument name)' color='secondary' variant='paragraph-s' />
                                        <Typography value='• A specified date range' color='secondary' variant='paragraph-s' />
                                        <Typography value='• The metric you want to analyze' color='secondary' variant='paragraph-s' />
                                    </ul>
                                    
                                </div>
                            </React.Fragment>
                    }

                  
                </div>
                <div className={"w-full mb-6 z-10"}>
                        <div className="flex  items-center bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark rounded-2xl border-Border-border-50 border dark:border-Border-border-dark-50 p-3">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.0845 11.0842L8.55138 6.68357H10.4487L11.9156 11.0842L16.3163 12.5511V14.4485L11.9156 15.9154L10.4487 20.316H8.55138L7.0845 15.9154L2.68384 14.4485V12.5511L7.0845 11.0842ZM9.50007 10.1621L8.82375 12.191L8.19129 12.8235L6.16234 13.4998L8.19129 14.1761L8.82375 14.8086L9.50007 16.8375L10.1764 14.8086L10.8088 14.1761L12.8378 13.4998L10.8088 12.8235L10.1764 12.191L9.50007 10.1621Z"
                                    fill={currTheme === 'dark' ? "#EEEEEE"   :"#646464"}
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.1507 5.15045L16.9309 2.81006H18.0693L18.8494 5.15045L21.1898 5.93059V7.06901L18.8494 7.84914L18.0693 10.1895H16.9309L16.1507 7.84914L13.8103 7.06901V5.93059L16.1507 5.15045Z"
                                    fill={currTheme === 'dark' ? "#EEEEEE"   :"#646464"}
                                />
                            </svg>

                            <textarea
                                className=" w-full font-geist-sans flex items-end justify-center border-none text-[14px] leading-4 resize-none  bg-Surface-surface-default-50 text-Text-text-primary dark:text-Text-text-primary-dark dark:bg-Surface-surface-default-50-dark focus:border-none dark:placeholder:text-Text-text-tertiary-dark placeholder-text-Text-text-tertiary"
                                placeholder="Ask or search anything"
                                onKeyDown={(e) => triggerApi(e)}
                                onInput={(e) => autoResize(e)} 
                                ref={userMessage}
                                disabled={AiResponseLoading || customloader}
                                style={{
                                    boxShadow: "none",
                                    maxHeight: '100px',
                                    minHeight: '32px', // Set the maximum height
                                    height: '32px', // Set the maximum height
                                    overflowY: 'auto', // Enable vertical scroll when content exceeds maxHeight
                                }}
                                // rows={1} // For a single line; adjust this to allow more lines
                            ></textarea>
                            <svg
                                className="cursor-pointer"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => {
                                    if (!AiResponseLoading || !customloader) {
                                        triggerApi("", "", "buttonClick");
                                    }
                                }}
                            >
                                <path
                                    d="M17 3.33989C18.5083 4.21075 19.7629 5.46042 20.6398 6.96519C21.5167 8.46997 21.9854 10.1777 21.9994 11.9192C22.0135 13.6608 21.5725 15.3758 20.72 16.8946C19.8676 18.4133 18.6332 19.6831 17.1392 20.5782C15.6452 21.4733 13.9434 21.9627 12.2021 21.998C10.4608 22.0332 8.74055 21.6131 7.21155 20.7791C5.68256 19.9452 4.39787 18.7264 3.48467 17.2434C2.57146 15.7604 2.06141 14.0646 2.005 12.3239L2 11.9999L2.005 11.6759C2.061 9.94888 2.56355 8.26585 3.46364 6.79089C4.36373 5.31592 5.63065 4.09934 7.14089 3.25977C8.65113 2.42021 10.3531 1.98629 12.081 2.00033C13.8089 2.01437 15.5036 2.47589 17 3.33989ZM12.02 6.99989L11.857 7.00989L11.771 7.02589L11.629 7.07089L11.516 7.12489L11.446 7.16789L11.351 7.23889L11.293 7.29289L7.293 11.2929L7.21 11.3869C7.05459 11.5879 6.98151 11.8405 7.0056 12.0934C7.02969 12.3463 7.14916 12.5806 7.33972 12.7486C7.53029 12.9167 7.77767 13.0059 8.03162 12.9981C8.28557 12.9904 8.52704 12.8862 8.707 12.7069L11 10.4139V15.9999L11.007 16.1169C11.0371 16.37 11.1627 16.602 11.3582 16.7656C11.5536 16.9292 11.8042 17.012 12.0586 16.9971C12.313 16.9821 12.5522 16.8706 12.7272 16.6853C12.9021 16.4999 12.9997 16.2548 13 15.9999V10.4149L15.293 12.7069L15.387 12.7899C15.588 12.9453 15.8406 13.0184 16.0935 12.9943C16.3464 12.9702 16.5807 12.8507 16.7488 12.6602C16.9168 12.4696 17.006 12.2222 16.9982 11.9683C16.9905 11.7143 16.8863 11.4728 16.707 11.2929L12.707 7.29289L12.625 7.21989L12.536 7.15589L12.423 7.09389L12.342 7.05989L12.229 7.02589L12.117 7.00589L12.019 6.99989H12.02Z"
                                    fill={(AiResponseLoading || customloader) ? "#bbbbbb" : "#0090FF"}
                                />
                            </svg>
                        </div>
                    </div>
                </div>
              

            </Grid>
            <Grid xs={2} />
        </Grid>

    );
}