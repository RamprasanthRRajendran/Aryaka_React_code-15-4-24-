import React, { useState, useEffect, useRef,useLayoutEffect } from "react";
import { Stack, TextField } from "@fluentui/react";
import Prism from "prismjs";
import { Client } from '@microsoft/microsoft-graph-client';
import {  useId } from '@fluentui/react-hooks';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import { Text } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { Icon } from "@fluentui/react/lib/Icon";
import { CommandBarButton,Callout} from "@fluentui/react";
import "../styles.css";
import { PrimaryButton } from '@fluentui/react/lib/Button';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { OverflowSet, OverflowSetItem } from '@fluentui/react/lib/OverflowSet';
import { DirectionalHint, TooltipHost } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';
import { Dialog, DialogType,DialogFooter } from '@fluentui/react';
import {BinRecycleFull20Regular} from '@fluentui/react-icons';
import { msalConfig,loginRequest } from "../config";
import _ from 'lodash';
import { useMsal } from '@azure/msal-react';
import { ThemeProvider, createTheme,Persona, PersonaSize,IPersonaStyles } from '@fluentui/react';
import LoginPage from "./LoginPage";


    const secColor=process.env.REACT_APP_SECONDARY_COLOR;
    const priColor=process.env.REACT_APP_PRIMARY_COLOR;
    const LogoUrl=process.env.REACT_APP_LOGO_URL;

    const theme = createTheme({
        palette: {
          themePrimary: priColor,
          themeSecondary:secColor,
          themeTertiary:secColor
        },
      });



const commandBarStyles = {
 
  root:{
    width: "280px",
    padding: "0px 0px 0px 0px",
    backgroundColor:`${priColor}`,
    height: "35px",
  
      },
  rootHovered: { backgroundColor: `${priColor}` },
   // Specify the hover color
};

const CommandBarWrapper = styled.div`
  .ms-Icon{
    color:midnightblue
  }
  .selectedTab {
    background-color: Midnightblue; 
    color: white; 
    margin-bottom:0px;
    // height: 50px; // Set the height of the selected tab

    .ms-Icon {
      color: white;
    }
  }
  
  .request_dd:hover {
    background-color: Midnightblue;
    color: white;

    
    .ms-Icon {
      color: white;
    }
  }
`;


const ChatScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;



const ChatAreaWrapper = styled.div`
  flex: 1;
  // overflow-y: auto;
  // width: 100%
  flex-direction: column;
  // justify-content: flex-end;
  align-items: center;
   background-color: white;
  // padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  // margin-right:20px;
  
`;
 
 
initializeIcons();
 
const HeaderWrapper = styled.div`
  color: "${priColor}";
  display: flex;
  justify-content: space-between;
  width: 99%;
  height: 20px;

  

`;
const SidePanel = styled.div`
  position: fixed;
  right: ${({ isOpen }) => (isOpen ? 0 : '-300px')}; // Adjust the width as needed
  width: 300px; // Adjust the width as needed
  height: 73%;
  top: 110px;
  
  padding:0px;
  background-color: #f2f2f2; // Adjust the background color as needed
  // background-color: red;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 999;
  border-top-left-radius: 10px; /* Adjust the radius as needed */
  border-bottom-left-radius: 10px; /* Adjust the radius as needed */
`;

 
function ChatPage() {

  const[animationEffect,setAnimationEffect]=useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [textSelected, setTextSelected] = useState(true);
  const chatAreaRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const [newPage,setnewPage]= useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const[itemName,setItemName]=useState("")
  const[itemContent,setItemContent]=useState("");
  const [ItemContentShowDialog, setItemContentShowDialog] = useState(false);
  const [priColorState,setPriColorState]=useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
const [selectedItemContent, setSelectedItemContent] = useState("");
const [latestItemName, setLatestItemName] = useState("");
const [latestItemContent, setLatestItemContent] = useState("");
const [showLogoutBox,setShowLogoutBox]=useState(false);

const [userPhoto, setUserPhoto] = useState(null);
const [showLogout, setShowLogout] = useState(false);
const [isPersonnaCardVisible, setIsPersonnaCardVisible] = useState(false);
const { instance, accounts,inProgress } = useMsal();




useEffect(() => {
    const getUserPhoto = async () => {
        const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        });

        const userPhotoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: {
                'Authorization': 'Bearer ' + response.accessToken
            }
        });

        if (userPhotoResponse.ok) {
            const blob = await userPhotoResponse.blob();
            const url = URL.createObjectURL(blob);
            setUserPhoto(url);
        }
    };

    getUserPhoto();
}, [instance, accounts]);

const toggleIsCalloutVisible = () => {
  setIsPersonnaCardVisible(!isPersonnaCardVisible);
};

  



  useEffect(() => {
    // Scroll to the bottom of the chat area whenever the chat state changes
    if (chatAreaRef.current && chatAreaRef.current.lastChild) {
      chatAreaRef.current.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [chat]);
 


 


  const handleNewChat = () => {
    setChat([]); // Clear chat
    setMessage(""); // Clear message input
    setnewPage(true);
    setDisableButtons(true); // Disable buttons during new chat
    setTimeout(() => {
      setDisableButtons(false);
    }, 1000);
  };

  const handleClearChat = () => {
    // setChat([]); // Clear chat
    setMessage(""); // Clear message input
    
    // ...
  };

  
  useEffect(() => {
    sendRefreshedMessage();
    setIsLoading(true);
  
    fetch('https://aryaka-webapp-02.azurewebsites.net/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ message: "Your initial message here" }),
    })
      .then(response => response.json())
      .then(data => {
        const [aiMessage, links] = [data['ai_response'], data['links']]
        setLatestItemName(links.length > 0);
        setLatestItemContent(links);
  
        console.log('Received message from Python:', aiMessage);
        setIsLoading(false);
        setChat(prevChat => {
          const lastMessageIndex = prevChat.findIndex(
            (msg) => msg.role === "assistant" && msg.content === "Typing..."
          );
  
          if (lastMessageIndex !== -1) {
            prevChat[lastMessageIndex] = {
              role: "assistant",
              content: aiMessage,
              itemName1: links.length > 0,
              itemContent1: links,
            };
          } else {
            prevChat.push({
              role: "assistant",
              content: aiMessage,
              itemName1: links.length > 0,
              itemContent1: links,
            });
          }
  
          return [...prevChat];
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Insert a newline character where the cursor is in the text input
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = message.slice(0, cursorPosition);
      const textAfterCursor = message.slice(cursorPosition);
      setMessage(textBeforeCursor + '\n' + textAfterCursor);
    } else if (e.key === "Enter" && message.trim().length === 0) {
      setShowPopup(true);
      
    } else if (e.key === "Enter" && message.trim().length > 0) {
      e.preventDefault();
      handleSubmit();
      
    }
  };
 
  const handleLogout = () => {
    instance.logout();
};
const sendRefreshedMessage = async () => {
  try {
    const response = await fetch('https://aryaka-webapp-02.azurewebsites.net/refreshed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Refreshed' })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
 
  const handleSubmit = () => {
    if (textSelected && message.trim().length > 0) {
      const newUserMessage = { role: "user", content: message };
      setChat(prevChat => [...prevChat, newUserMessage, { role: "assistant", content: "Typing..." }]);
      setLastResponse(message);
  
      fetch('https://aryaka-webapp-02.azurewebsites.net/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
        .then(response => response.json())
        .then(data => {
          const [aiMessage, links] = [data['ai_response'], data['links']]
          setLatestItemName(links.length > 0);
          setLatestItemContent(links);
  
          console.log('Received message from Python:', aiMessage);
          setChat(prevChat => {
            const index = prevChat.findIndex(chatMessage => chatMessage.content === "Typing...");
            prevChat[index] = {
              role: "assistant",
              content: aiMessage,
              itemName1: links.length > 0,
              itemContent1: links,
            };
            return [...prevChat];
          });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  
      setMessage("");
      setAnimationEffect(true);
      setnewPage(false);
    }
  };
  
  
      const TypingAnimation = ({ duration }) => {
        const [dots, setDots] = useState('...');
        // setInputdisable(true);
        useEffect(() => {
          // sendRefreshedMessage();
          const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
          }, duration / 3);
     
          return () => clearInterval(interval);
        }, [duration]);
       
        return <span>Typing{dots}</span>;
      };
 
      const handleItemClick = (itemName2) => {
        setSelectedItemName(itemName2);
        // Use the corresponding content based on itemName (you may need to adjust your data structure)
        const selectedMessage = chat.find((msg) => msg.itemName1 === itemName2);
      
        if (selectedMessage) {
          // Process the itemContent to remove extra spaces
          const originalContent = selectedMessage.itemContent1;
      
          // This will replace all occurrences of two or more consecutive newline characters with a single newline character
          let finalContent;
      
          if (originalContent) {
            const contentWithoutExtraSpacesAndNewlines = originalContent.replace(/\s{2,}/g, ' \n\n');
            finalContent = contentWithoutExtraSpacesAndNewlines.trim();
          }
      
          setSelectedItemContent(finalContent);
          setItemContentShowDialog(true);
        }
      };

      const buttonId = useId('callout-button');

      // useEffect(() => {
      //   if (accounts.length > 0) {
      //     // Get an access token for Microsoft Graph API
      //     instance.acquireTokenSilent({
      //       scopes: ['User.Read', 'Presence.Read.All'],
      //       account: accounts[0],
      //     }).then((response) => {
      //       const client = Client.init({
      //         authProvider: (done) => {
      //           done(null, response.accessToken);
      //         },
      //       });
      
      //       // Use the client to make a request to the Microsoft Graph API
      //       client.api('/me/presence').get().then((presenceInfo) => {
      //         console.log(`User's status: ${presenceInfo.availability}`);
      //       });
      //     });
      //   }
      // }, [instance, accounts]);
      const personaStyles = {
        primaryText: [{ fontWeight: '600',fontSize:"12px" }],
      };

      function hexToRGBA(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        let a = parseInt(hex.slice(7, 9), 16) / 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    function convertToButtonsBackgroundImage(color) {
        if (color.startsWith('#')) {
            color = hexToRGBA(color);
        }
        const rgbaColor1 = color.replace('rgb', 'rgba').replace(')', ', 0.9)');
        const rgbaColor2 = color.replace('rgb', 'rgba').replace(')', ', 0.6)');
        return `linear-gradient(225deg, ${rgbaColor1}, ${rgbaColor2})`;
    }

    const priColorBckg=convertToButtonsBackgroundImage(priColor);

    function addAlphaColor(color){
      if (color.startsWith('#')) {
        color = hexToRGBA(color);
    }
    const rgbaColor = color.replace('rgb', 'rgba').replace(')', ', 0.4)');
    return rgbaColor
    }

    const priAlphaColor=addAlphaColor(priColor);
   
      
 
  return (
    inProgress === 'none' && accounts.length === 0 
    ?<LoginPage />:
      <ChatScreenWrapper >
        <HeaderWrapper>
        <div>
            <img
              
              style={{
               marginTop:"2px",
                maxHeight: "64px",
                maxWidth: "192px",
                color: "black",

              }}
              src={LogoUrl}
              // src="C:\Generative-AI\Xen AI Assistant\FrontEnd-React Code\Assets\getsitelogo.png"
            >
              {/* Xencia */}
            </img>
            
          </div>
 
          <div className="App">
            <h3 className="Application_Name" style={{color:"black",paddingLeft:"300px"}}>
            {/* Xen AI-Assistant */}
            {process.env.REACT_APP_APP_NAME}
            </h3>
          </div>
          <div style={{display:"flex",flexDirection:"row"}}>
          <button 
          id={buttonId}
        className="buttonprofile"
        style={{display: 'flex', alignItems: 'center',marginTop:"10%",paddingLeft:"5px",paddingRight:"5px",border:"0px solid grey",paddingTop:"25px",paddingBottom:"25px",borderRadius:"5px",marginRight: "-15px"}}
        onMouseEnter={toggleIsCalloutVisible}
        // onMouseLeave={toggleIsCalloutVisible}
        onClick={toggleIsCalloutVisible}
      >
       
        <Persona
        className="personaButton"
        
    imageUrl={userPhoto}
    text={accounts[0]?.name}
    styles={personaStyles}
    secondaryText={accounts[0].username}
    size={PersonaSize.size32}
    showOverflowTooltip={true}
    // showInitialsUntilImageLoads={true}
    showSecondaryText={true}
    
    
  />
      </button>

      {isPersonnaCardVisible && (
        <Callout
        className="PersonaCardBox"
          // coverTarget
          gapSpace={15}
          // ariaLabelledBy={labelId}
          role="dialog"
          // className={styles.callout}
          onDismiss={toggleIsCalloutVisible}
          onMouseLeave={toggleIsCalloutVisible}
          target={`#${buttonId}`}
          isBeakVisible={false}
          directionalHint={DirectionalHint.bottomAutoEdge}
          // target={`#${buttonId}`}
          // isBeakVisible={false}
          setInitialFocus
        >
          <div className="PersonaCard">
          <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button className="personnaSignout"style={{color:priColor,border:"none",background:"none"}} onClick={()=>handleLogout()}>Sign Out</button>
        </div>
        <br />
        
        <br />
        <div className="detailedUser">
        <img src={userPhoto} alt="User" style={{width:'25%', height:"25%", borderRadius:'50%'}} />
  
    <span style={{color:"black",fontWeight:"600"}} title="Display Name">{accounts[0]?.name}</span>
    <span style={{color:"#717171"}} title="User Email">{accounts[0]?.username}</span>
  
  </div>
  <br />
  <br />
  <br />
  <br />
          <div>
            <button className="personnaSignout2" style={{color:secColor,border:"none",background:"none"}}  onClick={() => {
    instance.loginRedirect({
      scopes: ['User.Read'],
      prompt: 'select_account',
    });
  }}><i style={{paddingLeft:"4px"}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M6.22176 13.9567C3.55468 13.653 2 11.8026 2 10V9.5C2 8.67157 2.67157 8 3.5 8H5.59971C5.43777 8.31679 5.30564 8.65136 5.20703 9H3.5C3.22386 9 3 9.22386 3 9.5V10C3 11.1281 3.88187 12.333 5.50235 12.7996C5.69426 13.216 5.93668 13.6043 6.22176 13.9567ZM9.62596 5.06907C9.70657 4.81036 9.75 4.53525 9.75 4.25C9.75 2.73122 8.51878 1.5 7 1.5C5.48122 1.5 4.25 2.73122 4.25 4.25C4.25 5.53662 5.13357 6.61687 6.32704 6.91706C6.64202 6.55055 7.00446 6.226 7.40482 5.95294C7.27488 5.98371 7.13934 6 7 6C6.0335 6 5.25 5.2165 5.25 4.25C5.25 3.2835 6.0335 2.5 7 2.5C7.9665 2.5 8.75 3.2835 8.75 4.25C8.75 4.73141 8.55561 5.16743 8.24104 5.48382C8.67558 5.28783 9.14016 5.14664 9.62596 5.06907ZM10.5 15C12.9853 15 15 12.9853 15 10.5C15 8.01472 12.9853 6 10.5 6C8.01472 6 6 8.01472 6 10.5C6 12.9853 8.01472 15 10.5 15ZM10.5 8C10.7761 8 11 8.22386 11 8.5V10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H11V12.5C11 12.7761 10.7761 13 10.5 13C10.2239 13 10 12.7761 10 12.5V11H8.5C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10H10V8.5C10 8.22386 10.2239 8 10.5 8Z" fill="currentColor"></path>
    </svg>
  </i>Sign in with a different account</button>
          </div>
          </div>
        </Callout>
      )}
          {/* <div className="log_icon" title="Sign Out" aria-label="Sign Out" style={{color:priColor}} onMouseEnter={() => setPriColorState(secColor)} onMouseLeave={()=>setPriColorState(priColor)}>
          <i 
    className="fas fa-sign-out-alt" onClick={() => setShowLogoutBox(true)} style={{color: priColorState}}></i>
          </div> */}
          </div>
         


          
          
        </HeaderWrapper>
        <div style={{ border: `1px solid ${priColor}`, marginTop: "60px" }} />
        <br />
        <br />
       
{/* <div style={{display:"flex", justifyContent: "end" ,marginTop: "-38px",paddingRight: "185px" }}> */}
<div style={{display:"flex", justifyContent: "end" ,marginTop: "-38px",paddingRight: "30px" }}>

</div>
<div  style={{position: "relative",marginBottom: "6px"}}></div>
 
 
<ChatAreaWrapper className="chatArea"   ref={chatAreaRef}>

<div className="chatMessages"   >
  {newPage ? (
    <div className="logoHeaderPara1">
      <div >
            <Text className="logoHeader">
            {/* Open<span style={{marginLeft:'1px', color:'rgb(15, 135, 5)'}}>AI</span>/ */}
            </Text>
          </div>
 
          <div >
            <h3 className="logoHeaderPara">
            {/* This chatbot is configured to answer your questions */}
            </h3>
          </div>
    </div>
   
  ) : (
    chat.map((msg, index) => {
      console.log(msg.content)
      const contentMatch = msg.content.match(/([\s\S]*?)```(\w+)?\s([\s\S]*?)```([\s\S]*?)/s);

      console.log(contentMatch);

if (contentMatch) {
  // console.log(contentMatch[5]);
  // const preCodeContent1=preCodeContent[0].split(',');
  const language = contentMatch[2];
  // const postCodeContent = `${(contentMatch["input"])}`;
  let postCodeContent = `${(contentMatch["input"])}`;
        // Replace ``` with \n
        postCodeContent = postCodeContent.replace(/```(\w+)?\s/g, '\n');
  // const postCodeContent1=postCodeContent.split(". ").join(`\n`);
  // const postCodeContent2=postCodeContent1.split(", ").join(` ,\n`)

  return (
    <div key={index} className={`${msg.role} formattedText` } ref={chatAreaRef}>
            {/* <span className="contentFormatOpenai">{preCodeContent}</span> */}
            <pre key={index} className={`codeBlock`}>
            <div>
            <div className="contentFormatOpenai">
              {/* <p>{preCodeContent}</p> */}
  <code
              className="FormatOpenaicontent"
              style={{fontFamily: 'Segoe UI !important'}}
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  `\n${postCodeContent} `,
                  Prism.languages[language] || Prism.languages.clike,
                  language
                ),
              }}
            />
  {/* <br /> */}
  {/* <p style={{fontSize:"11px"}}>{postCodeContent}</p> */}
  <div style={{color: 'grey', fontSize: '10px',position:"relative",top:"12px"}}>
    <p>This is  an AI-generated content </p>
  </div>
  </div>
</div>
            </pre>
            {/* <span className="contentFormatOpenai">{postCodeContent}</span> */}
          </div>
         
        );
       
      } else {
       
        return (
          
          <div key={index} className={`${msg.role} formattedText`  }ref={chatAreaRef} >
          
          <br></br>
          {msg.content === 'Typing...' ? (
            <span className="contentFormatresponse" >
              <TypingAnimation duration={1000} />
              <br></br>
                {/* <br /> */}
                <p style={{fontSize:"10px", fontWeight:"400px",color:"grey",position:"relative",top:"10px",paddingBottom:"10px"}} >This is  an AI-generated content</p>
            </span>
            
          ) : (
            <div>
            <span >
              {msg.role === 'user' ?
                <div>
                  <span className={'contentFormat'}>
                  {msg.content}
                  </span>
                </div>
                
                
              : (
                animationEffect === true ?  (  <div key={index}  ref={chatAreaRef}>
                {/* <span className="contentFormatOpenai">{preCodeContent}</span> */}
                <pre key={index} className="FormatOpenaicontent21" >
                <div>
                <div className="contentFormatresponse">
                  {/* <p>{preCodeContent}</p> */}
      <code
                  className="FormatOpenaicontent"
                  // style={{fontFamily: 'Segoe UI !important'}}
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      `${msg.content} `,
                      Prism.languages.clike,
                      
                    ),
                  }}
                />
      {/* <br /> */}
      {/* <p style={{fontSize:"11px"}}>{postCodeContent}</p> */}
      <br />
      <br />
      {msg.itemName1?(<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <details>
                      <summary>References</summary>
                        <ol>
                        {msg.itemContent1.map((link) => (
                            <li >
                            <a href={link} target="_blank">{link}</a>
                            </li>
                        ))}
                        {/* <li className="itemsInContent" style={{color:priColor}}onClick={() => handleItemClick(msg.itemName1)}>{msg.itemName1}</li> */}
                        </ol>
                      </details>
                      <div style={{textAlign: 'right'}}>
                        <p style={{fontSize:'10px', fontWeight:'400px', color:'grey',marginTop: "0px"}}>This is an AI-generated content</p>
                      </div>
                    </div>):(   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      
                      <div style={{textAlign: 'left'}}>
                        <p style={{fontSize:'10px', fontWeight:'400px', color:'grey'}}>This is an AI-generated content</p>
                      </div>
                    </div>)}
      </div>
    </div>
                </pre>
                {/* <span className="contentFormatOpenai">{postCodeContent}</span> */}
              </div>
                ) : (
                  <div>
                  <span className="contentFormatresponse" >
                  <div>{msg.content}
                  <br />
                  <br />
                  <p style={{fontSize:"10px", fontWeight:"400px",color:"grey",position:"relative",top:"10px"}} >This is  an AI-generated content</p>
                  </div>
                  </span>
                  </div>
                )
              )}
              
            </span>
            </div>
          )}
       <Panel
  isOpen={ItemContentShowDialog}
  onDismiss={() => {
    setItemContentShowDialog(false);
    setSelectedItemName("");
    setSelectedItemContent("");
  }}
  type={PanelType.medium}
  closeButtonAriaLabel="Close"
  headerText="Citations"
  isBlocking={false}
  styles={{
    main: {
      boxShadow: "rgba(0, 0, 0, 0.22) 0px 4.6px 4.6px 0px, rgba(0, 0, 0, 0.18) 3px -0.2px"
    //   box-shadow: rgba(0, 0, 0, 0.22) 0px 4.6px 4.6px 0px, rgba(0, 0, 0, 0.18) 3px -0.2px;
    }
  }}
>
  <p style={{ whiteSpace: "pre-wrap", fontSize: "11px" }}>
    {selectedItemContent}
  </p>
</Panel>
        
        </div>
        
        );
      }
    })
  )}
  
  
  </div>
  <div style={{paddingBottom:"10px"}}></div>
  
  {/* <div className="inputArea"> */}
  <div style={{ display: 'flex', alignItems: 'center', width: "65%" }}>
  <Stack>
  <Stack.Item>
    <CommandBarButton
      role="button"
      styles={{
        icon: {
          color: '#FFFFFF'
         
        },
        iconHovered: {
          color: 'white',
        },
        iconDisabled: {
          color: "#BDBDBD !important",
        },
        root: {
          backgroundImage:priColorBckg,
          // background: linear-gradient(to bottom, rgba(212, 24, 100, 0.9), rgba(212, 24, 100, 0.6)) !important;
          textShadow: "0px 2px 2px rgba(0, 0, 0, 0.5)",
          boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);"
        },
        rootDisabled: {
          background: "#F0F0F0"
        },
        rootHovered:{
          // background:"#f47721"
          backgroundImage:priColorBckg,
          textShadow: "0px 2px 2px rgba(0, 0, 0, 0.5)",
          boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.92);",
          // background:secColor,
          // boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.92);",
          
        }
      }}
      iconProps={{ iconName: 'Add' }}
      aria-label="start a new chat button"
      className="newChat"
      onClick= {handleNewChat}
      disabled= {disableButtons}
    />
    
  </Stack.Item>
  <Stack.Item>
    <CommandBarButton
      role="button"
      styles={{
        icon: {
          color: '#FFFFFF'
         
        },
        iconHovered: {
          color: 'white',
        },
        iconDisabled: {
          color: "#BDBDBD !important",
        },
        root: {
          backgroundImage:priColorBckg,
          // background: linear-gradient(to bottom, rgba(212, 24, 100, 0.9), rgba(212, 24, 100, 0.6)) !important;
          textShadow: "0px 2px 2px rgba(0, 0, 0, 0.5)",
          boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);"
        },
        rootDisabled: {
          background: "#F0F0F0"
        },
        rootHovered:{
          // background:"#f47721"
          backgroundImage:priColorBckg,
          textShadow: "0px 2px 2px rgba(0, 0, 0, 0.5)",
          boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.92);",
          // background:secColor,
          // boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.92);",
          
        }
      }}
      iconProps={{ iconName: 'Broom' }}
      aria-label="clear chat button"
      className="clearChat"
      onClick={handleClearChat}
      disabled={disableButtons}
    />
  </Stack.Item>
</Stack>
{isTyping===true?(<div className="inputArea" style={{ position: 'relative', flex: 1 ,fontSize:"11px"}}>
  
  <TextField
 className="styledInput"
 multiline
 resizable={false}
 borderless
 readOnly={true}
//  placeholder={TypingAnimation}
//  placeholder="Type a new question..."
//  value={message}
 onChange={(e) => setMessage(e.target.value)}
//  onKeyDown={handleKeyDown}
 style={{fontSize:"11px"}}
//  disabled={true} // Disable the input when the AI is typing
/>
<IconButton
 iconProps={{ iconName: "Send" }}
//  className="sendBtn"

 title=" Typing... "
 ariaLabel=" Typing... "
//  onClick={handleSubmit}
 styles={{ 
   root: { position: 'absolute', bottom: 0, right: 0 ,fontSize:"11px"},
   icon: { fontSize: 20, color: "grey" },
   rootDisabled:{position: 'absolute', bottom: 0, right: 0 ,fontSize:"11px"}
 }}
//  disabled={true} // Disable the send button when the AI is typing
/>
<div 
  className="questionInputBottomBorder" 
  style={{background: `linear-gradient(to left, ${priAlphaColor}, ${priColor})`}}
/></div>):(
  <div className="inputArea" style={{ position: 'relative', flex: 1 ,fontSize:"11px"}}>
  
  <TextField
 className="styledInput"
 multiline
 resizable={false}
 borderless
 placeholder="Type a new question..."
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 onKeyDown={handleKeyDown}
 style={{fontSize:"11px"}}
//  disabled={isTyping} // Disable the input when the AI is typing
/>
<IconButton
 iconProps={{ iconName: "Send" }}
 className="sendBtn"
 title="Send"
 ariaLabel="Send"
 onClick={handleSubmit}
 styles={{ 
   root: { position: 'absolute', bottom: 0, right: 0 ,fontSize:"11px"},
   icon: { fontSize: 20, color: priColor },
   rootDisabled:{position: 'absolute', bottom: 0, right: 0 ,fontSize:"11px"}
 }}
//  disabled={isTyping}/ // Disable the send button when the AI is typing
/>
<div 
  className="questionInputBottomBorder" 
  style={{backgroundImage: `linear-gradient(to left, ${priAlphaColor}, ${priColor})`}}
/></div>
)}

</div>
<div style={{height:"20px"}}>
 
</div>


  {/* </div> */}
</ChatAreaWrapper>
    <Dialog
        hidden={!showPopup}
        onDismiss={() => {}}
        dialogContentProps={{
          type: DialogType.normal,
          // title: 'Alert!',
          title:"Please  enter any message.",
        }}
        modalProps={{
          isBlocking: false,
        }}
      >
        <PrimaryButton onClick={() => setShowPopup(false)} style={{ position:"relative",left:"150px",top:"22px"}}>Ok</PrimaryButton>
      </Dialog>
      <ThemeProvider theme={theme}>
      <Dialog
  hidden={!showLogoutBox}
  onDismiss={()=>setShowLogoutBox(false)}
  dialogContentProps={{
    type: DialogType.close,
    title: 'Are you sure you want to sign out!',
    subText: <p style={{paddingLeft:"20px",marginTop:"0px",wordWrap:"break-word",width:"400px"}}>
  Hey <span style={{color:priColor}}>{accounts[0]?.name}</span>,
  You're about to sign out. Remember, you can always sign back. We'll be here ready to assist you. Have a great day!
</p>
  }}
//   styles={{root:{width:200}}}
  
>
  <DialogFooter>
    <PrimaryButton onClick={()=>handleLogout()} text="Sign out"  styles={{ 
          rootHovered: { backgroundColor: secColor, borderColor: secColor }, 
          rootPressed: { backgroundColor: secColor, borderColor: secColor } 
        }} />
    <PrimaryButton onClick={()=>setShowLogoutBox(false)} text="Back to Chat" styles={{ 
          rootHovered: { backgroundColor: secColor, borderColor: secColor }, 
          rootPressed: { backgroundColor: secColor, borderColor: secColor } 
        }} />
  </DialogFooter>
</Dialog>
</ThemeProvider>

      
      </ChatScreenWrapper>

    
  );
}
export default ChatPage;
