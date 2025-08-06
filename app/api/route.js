// import { cookies } from 'next/headers'
// import { getLoginSession } from 'lib/auth';
// import logMessage from 'util/logMessage';
// import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
// import { unstable_cache } from 'next/cache';

let unsealedTest

import crypto from 'crypto';

function hashToken(tokenValue) {
    return crypto.createHash('sha256').update(tokenValue).digest('hex');
}

async function middleware(NextRequest) {

    const searchParams = NextRequest.nextUrl.searchParams
    let token = searchParams.get('token')
    token = JSON.parse(token)

    const hashedToken = hashToken(token.value);

    console.log("hashedToken", hashedToken)

    if (!token) {
        return false
    }

    // const result = await unstable_cache(() =>
    //     getLoginSession(
    //         token.value,
    //         process.env.TOKEN_SECRET
    //     ),
    //     [`session_${hashedToken}`],
    //     {
    //         tags: [`user_sessions`, `session_${hashedToken}`], // Cache with a specific tag
    //         revalidate: (60 * 60) * 1, // 1 hour or when called manually
    //     }
    // )();

    const response = await fetch(
        "http://localhost:3012/api/auth/oauth/details?access_token=" + token.value,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        console.log("Auth check failed")
        return false;
    }

    const data = await response.json();

    let result = data 

    let unsealed = result

    console.log("Auth check passed", data)

    console.log("token unsealed for", unsealed?.user_id)

    if (!unsealed) {
        return false
    }

    // req.session = unsealed
    return unsealed; // Indicating middleware passed successfully
}

export async function GET(NextRequest) {

    const middlewareResponse = await middleware(NextRequest);

    if (!middlewareResponse) {
        console.log("authCheck Fail")
        // return middlewareResponse; // Stop the request and return the error response
        return NextResponse.json(
            {
                middlewareResponse
            },
            { status: 400 }
        );
    }

    console.log("authCheck Success")

    return NextResponse.json(
        {
            // status: 400,
            // error: 'No session token found',
            // unsealed: middlewareResponse
            user_id: middlewareResponse.user_id,
            // user_email: middlewareResponse.user.email
        },
        // { status: 400 }
    );
}