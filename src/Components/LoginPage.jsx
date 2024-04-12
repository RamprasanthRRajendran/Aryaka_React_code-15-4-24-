// import React from 'react';
// import { loginRequest } from '../config';
// import { MsalConsumer } from '@azure/msal-react';

// class LoginPage extends React.Component {
//   initializeSignIn = (instance, inProgress, accounts) => {
//     if (inProgress === 'none' && accounts.length === 0) {
//       instance.loginRedirect(loginRequest);
//     }
//   };

//   render() {
//     return (
//       <MsalConsumer>
//         {({ instance, inProgress, accounts }) => {
//           this.initializeSignIn(instance, inProgress, accounts);
//           return null;
//         }}
//       </MsalConsumer>
//     );
//   }
// }

// export default LoginPage;
