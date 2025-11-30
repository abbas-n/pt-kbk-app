// 'use client';

// import { useEffect, useState } from 'react';
// import { getMessaging, getToken } from "firebase/messaging";
// import { app } from '../app/panel/layout';
// import { FetchApi } from '../../utils/Helper';
// import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

// export default function FirebaseMessaging() {
//   const [showPrompt, setShowPrompt] = useState(false);

//   useEffect(() => {
//     const initializeMessaging = async () => {
//       try {
//         // چک کردن وضعیت نوتیفیکیشن
//         if ('Notification' in window) {
//           const permission = Notification.permission;
//           if (permission === 'default') {
//             setShowPrompt(true);
//           } else if (permission === 'granted') {
//             await setupMessaging();
//           }
//         }
//       } catch (err) {
//         console.error('خطا در دریافت توکن:', err);
//       }
//     };

//     initializeMessaging();
//   }, []);

//   const setupMessaging = async () => {
//     try {
//       const messaging = getMessaging(app);
      
//       // دریافت توکن
//       const currentToken = await getToken(messaging, {
//         vapidKey: 'BCrBcWoKeXXrSMDzCZdorgO3YvD3qtF3NdxcEYq87JhQPksFl9v4oQgP03dvQlM3hBeFpV9l4SZrVKgByRPPzTU'
//       });

//       if (currentToken) {
//         // ارسال به سرور برای ذخیره
//         try {
//           const response = await FetchApi('/tpAuth/save-token', 'POST', true, JSON.stringify({ token: currentToken }));
//           if (response.success) {
//             console.log('توکن با موفقیت ذخیره شد');
//           } else {
//             console.error('خطا در ذخیره توکن:', response.message);
//           }
//         } catch (error) {
//           console.error('خطا در ارسال توکن به سرور:', error);
//         }
//       } else {
//         console.log('اجازه برای دریافت نوتیف داده نشده');
//       }
//     } catch (err) {
//       console.error('خطا در راه‌اندازی messaging:', err);
//     }
//   };

//   const handleAllow = async () => {
//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === 'granted') {
//         setShowPrompt(false);
//         await setupMessaging();
//       }
//     } catch (error) {
//       console.error('خطا در درخواست اجازه نوتیفیکیشن:', error);
//     }
//   };

//   const handleDeny = () => {
//     setShowPrompt(false);
//   };

//   return (
//     <Dialog open={showPrompt} onClose={handleDeny}>
//       <DialogTitle>دریافت اعلان‌ها</DialogTitle>
//       <DialogContent>
//         <Typography>
//           آیا مایل به دریافت اعلان‌های جدید از سامانه سفیران کالارسان هستید؟
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleDeny} color="primary">
//           خیر
//         </Button>
//         <Button onClick={handleAllow} color="primary" variant="contained">
//           بله
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// } 