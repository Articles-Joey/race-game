// import { Geist, Geist_Mono } from "next/font/google";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/components/theme';

import "bootstrap/dist/css/bootstrap.min.css";

// import "./globals.css";
import "@/styles/index.scss";

import "@articles-media/articles-dev-box/dist/style.css";

import "@articles-media/articles-gamepad-helper/dist/style.css";

import SocketLogicHandler from "@/components/SocketLogicHandler";

import { Suspense } from 'react';
import CustomControlsLogic from '@/components/Game/CustomControlsLogic';
import LayoutClient from './layout-client';

export const metadata = {
  title: "Race Game",
  description: "Race to the finish line by strategically picking your moves and outsmarting your opponents.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">

      <head>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />

      </head>

      <body
      // className={`${geistSans.variable} ${geistMono.variable}`}
      >

        <LayoutClient />

        <Suspense>

          <SocketLogicHandler />
          {/* <PeerHandler /> */}
          {/* <PeerHandlerTest /> */}
          {/* <AudioHandler /> */}

          {/* Keyboard */}
          <CustomControlsLogic />

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
