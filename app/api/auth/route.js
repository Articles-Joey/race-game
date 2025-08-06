
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookies = request.cookies ? Object.fromEntries(request.cookies) : {};
  return NextResponse.json({ cookies });
}
