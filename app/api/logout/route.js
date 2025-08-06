import { NextResponse } from 'next/server';

export async function POST(request) {

    const response = NextResponse.json({ message: 'Logged out' }, {
        status: 200,
    });
    // Set-Cookie header must be set via the cookies property on the response options
    response.headers.set('Set-Cookie', 'sess=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return response;

}