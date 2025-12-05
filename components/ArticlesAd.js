import Script from "next/script";
import { useEffect, useState } from "react";
import { useStore } from "@/components/hooks/useStore";

// Non typescript version, if copying consider using the typescript version instead from a repo like amcot or battle-trap

export default function ArticlesAd({
    section,
    section_id,
    style
}) {

    const darkMode = useStore((state) => state.darkMode)

    const [adSrc, setAdSrc] = useState(null);
    const [cssSrc, setCssSrc] = useState(null);

    useEffect(() => {

        if (!process.env.NEXT_PUBLIC_ARTICLES_OAUTH_ID) {
            console.log("NEXT_PUBLIC_ARTICLES_OAUTH_ID is not set, skipping Articles Media Sign In button initialization.");
        }

        const checkAdServer = async () => {
            if (process.env.NODE_ENV === "development") {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCOUNTS_ADDRESS}/js/ad.js`, { method: 'HEAD' });
                    if (res.ok) {
                        setAdSrc(`${process.env.NEXT_PUBLIC_LOCAL_ACCOUNTS_ADDRESS}/js/ad.js`);
                        setCssSrc(`${process.env.NEXT_PUBLIC_LOCAL_ACCOUNTS_ADDRESS}/css/ad.css`);
                        return;
                    }
                } catch (e) {
                    console.warn("Local ad server unreachable, falling back to production.");
                }
            }
            setAdSrc("https://accounts.articles.media/js/ad.js");
        };

        checkAdServer();
        
    }, []);

    if (!adSrc) return null;

    return (
        <>
            {cssSrc && (
                <link
                    rel="stylesheet"
                    crossOrigin="anonymous"
                    href={cssSrc}
                />
            )}

            <Script
                src={adSrc}
                strategy="afterInteractive"
                data-version="1"
            // data-articles-color-mode="Dark"
            // data-articles-button-style={style}
            // data-articles-client-id={process.env.NEXT_PUBLIC_ARTICLES_OAUTH_ID}
            // data-articles-redirect-uri="https://localhost:3002"
            // data-articles-redirect-uri={process.env.NEXT_PUBLIC_ARTICLES_REDIRECT_URI}
            // data-articles-authHost={
            //     process.env.NODE_ENV == "development" ? // "http://localhost:3001" 
            //         process.env.NEXT_PUBLIC_LOCAL_ACCOUNTS_ADDRESS
            //         :
            //         "https://accounts.articles.media"
            // }
            />

            <div className={"articles-media-ad"}>

            </div>

        </>
    );
}
