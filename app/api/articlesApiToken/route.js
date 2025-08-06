import clientPromise from 'util/mongodb';

// import { cookies } from 'next/headers'
// import { getLoginSession } from 'lib/auth';
// import logMessage from 'util/logMessage';
// import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

let unsealedTest

import crypto from 'crypto';

function hashToken(tokenValue) {
    return crypto.createHash('sha256').update(tokenValue).digest('hex');
}

async function middleware(NextRequest) {

    const searchParams = NextRequest.nextUrl.searchParams
    let token = searchParams.get('token')
    // token = JSON.parse(token)

    // const hashedToken = hashToken(token.value);

    console.log("api token", token)

    if (!token) {
        return false
    }

    // let unsealed = await getLoginSession(token.value, process.env.TOKEN_SECRET)

    const result = await unstable_cache(async () =>
        // getLoginSession(
        //     token.value,
        //     process.env.TOKEN_SECRET
        // ),
        {
            // Check DB for token
            const db = (await clientPromise).db();

            return await db
            .collection("api_keys")
            .findOne({
                key: token
            }, { 
                // projection: projection 
            })

        },
        [`articles-api-token-${token}`],
        {
            tags: [`articles-api-token`], // Cache with a specific tag
            revalidate: (60 * 60) * 24, // 1 hour or when called manually
        }
    )();

    let unsealed = result

    console.log("token result", result)

    // console.log("cache_result?", result)

    // console.log("unsealed", unsealed)

    if (!result) {
        return false
    }

    // req.session = unsealed
    return unsealed; // Indicating middleware passed successfully
}

export async function GET(NextRequest) {

    const middlewareResponse = await middleware(NextRequest);

    if (!middlewareResponse) {
        console.log("authCheck Fail")
        return middlewareResponse; // Stop the request and return the error response
    }

    console.log("authCheck Success")

    return NextResponse.json(
        {
            // status: 400,
            // error: 'No session token found',
            // unsealed: middlewareResponse
            user_id: middlewareResponse.user_id,
            key_id: middlewareResponse._id,
            // user_email: middlewareResponse.user.email
        },
        // { status: 400 }
    );
}