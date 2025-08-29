import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') || 'Yavatmal, Maharashtra';

  try {
    const response = await axios.get('https://atlas.mappls.com/api/places/geocode', {
      params: {
        address,
        api_key: process.env.MAPPLS_API_KEY,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}