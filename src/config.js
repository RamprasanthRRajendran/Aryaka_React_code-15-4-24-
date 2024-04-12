// import { LogLevel } from "@azure/msal-browser";


// export const msalConfig = {
//     auth: {
//         clientId: "6b25daa7-c7f6-4eaa-bbe7-141b35fff2f9",
//         authority: "https://login.microsoftonline.com/75f2a99b-01fd-48f2-ac60-d4a7a44fd0cc",
//         redirectUri: "http://localhost:3001",
//         loginType: 'redirect',
//     },
    
//     cache: {
//         cacheLocation: "sessionStorage", 
//         storeAuthStateInCookie: false, 
//     },
//     system: {	
//         loggerOptions: {	
//             loggerCallback: (level, message, containsPii) => {	
//                 if (containsPii) {		
//                     return;		
//                 }		
//                 switch (level) {
//                     case LogLevel.Error:
//                         console.error(message);
//                         return;
//                     case LogLevel.Info:
//                         console.info(message);
//                         return;
//                     case LogLevel.Verbose:
//                         console.debug(message);
//                         return;
//                     case LogLevel.Warning:
//                         console.warn(message);
//                         return;
//                     default:
//                         return;
//                 }	
//             }	
//         }	
//     }
// };

// export const loginRequest = {
//     scopes: ["openid", "profile", "User.Read", "email"],
//     loginHint: localStorage.getItem('username') ,
// };
