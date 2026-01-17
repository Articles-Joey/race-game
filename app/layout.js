// import { Geist, Geist_Mono } from "next/font/google";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/components/theme';

import "bootstrap/dist/css/bootstrap.min.css";

// import "./globals.css";
import "@/styles/index.scss";

import "@articles-media/articles-dev-box/dist/style.css";

import SocketLogicHandler from "@/components/SocketLogicHandler";
// import PeerHandler from '@/components/PeerHandler';
import AudioHandler from '@/components/AudioHandler';
// import PeerHandlerTest from '@/components/PeerHandlerTest';
import GlobalClientModals from '@/components/UI/GlobalClientModals';
import DarkModeHandler from '@/components/UI/DarkModeHandler';
import { Suspense } from 'react';
import CustomControlsLogic from '@/components/Game/CustomControlsLogic';
import LayoutClient from './layout-client';
// import dynamic from 'next/dynamic';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// import InfoModal from '@/components/UI/InfoModal';
// const InfoModal = dynamic(
//     () => import('@/components/UI/InfoModal'),
//     { ssr: false }
// )

export const metadata = {
  title: "Race Game",
  description: "Race to the finish line by strategically picking your moves and outsmarting your opponents.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">

      <head>

        {/* <link
          rel="stylesheet"
          href={`${process.env.NEXT_PUBLIC_CDN}fonts/fontawsome/css/all.min.css`}
        /> */}

        {/* <GlobalHead /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />

      </head>

      <body
      // className={`${geistSans.variable} ${geistMono.variable}`}
      >

        <Suspense>
          <SocketLogicHandler />
          {/* <PeerHandler /> */}
          {/* <PeerHandlerTest /> */}
          <AudioHandler />
          <CustomControlsLogic />
          <LayoutClient />
          <DarkModeHandler />
          <GlobalClientModals />
        </Suspense>

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>

            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {children}

          </ThemeProvider>
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}
