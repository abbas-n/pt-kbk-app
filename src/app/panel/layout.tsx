'use client';

import { Box } from '@mui/material';
import Footer from '../components/Footer';
// import { initializeApp } from "firebase/app";
// import FirebaseMessaging from '../../components/FirebaseMessaging';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBzh2YhgUsDMcIrNlK1iPczPWWnz3IgoWo",
//   authDomain: "kbk-safir-app.firebaseapp.com",
//   projectId: "kbk-safir-app",
//   storageBucket: "kbk-safir-app.firebasestorage.app",
//   messagingSenderId: "1007707382592",
//   appId: "1:1007707382592:web:9f9aabf76f3beeff7a90a5",
//   measurementId: "G-02M3EP6WDP"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative',
      backgroundColor: 'background.default',
    }}>
      {/* <FirebaseMessaging /> */}
      <Box sx={{ 
        flex: 1, 
        pb: { xs: '56px', md: 0 },
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
} 