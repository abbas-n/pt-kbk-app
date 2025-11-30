import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '../contexts/ThemeContext';
import { getTheme } from '../theme';
import ThemeWrapper from './ThemeWrapper';

export const metadata: Metadata = {
  title: "سامانه سفیران کالارسان",
  description: "سامانه مدیریت سفیران کالارسان",
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon1.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/icon-16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        url: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "سامانه سفیران کالارسان",
  },
  applicationName: "سامانه سفیران کالارسان",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
      </head>
      <body style={{ fontFamily: 'IranSansX' }}>
        <ThemeProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
