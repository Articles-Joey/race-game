import Image from 'next/image'
import Link from 'next/link'

import "bootstrap/dist/css/bootstrap.min.css";

// import "./globals.css";
import "@/styles/index.scss";
import ArticlesButton from '@/components/UI/Button';

export default function NotFound() {
    return (
        <div className="race-game-not-found-page">

            <div
                className='background-wrap'
            >
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}
                    fill
                    alt=""
                    style={{
                        objectFit: 'cover',
                        filter: 'blur(3px)',
                    }}
                />
            </div>

            <div className='card rounded-0 shadow-lg text-center '>

                <div className='card-header'>
                    <b>404 - Not Found</b>
                </div>

                <div className='card-body'>
                    Could not find the requested page
                </div>

                <div className='card-footer'>
                    <Link href="/">
                        <ArticlesButton>
                            <i className="fas fa-home"></i>
                            Return to Home
                        </ArticlesButton>
                    </Link>
                </div>

            </div>

        </div>
    )
}