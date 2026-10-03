import { Suspense } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import AppThemeProvider from '@/components/AppThemeProvider';
import SocketLogicHandler from '@/components/SocketLogicHandler';
import CustomControlsLogic from '@/components/Game/CustomControlsLogic';
import LayoutClient from './layout-client';

import '@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css';

export const metadata = {
    title: 'Race Game',
    description: 'Race to the finish line by strategically picking your moves and outsmarting your opponents.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <SocketLogicHandler />
                            <CustomControlsLogic />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
