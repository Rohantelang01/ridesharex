// app/api/map/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, query } = await request.json();
    const apiKey = process.env.MAPPLS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mappls API key not configured on the server.' 
      }, { status: 500 });
    }

    let mapplsUrl = '';
    
    // Mappls API endpoints
    if (action === 'autocomplete') {
      mapplsUrl = `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(query)}&region=ind`;
    } else if (action === 'search') {
      mapplsUrl = `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(query)}&region=ind`;
    } else if (action === 'geocode') {
      mapplsUrl = `https://atlas.mappls.com/api/places/geocode/json?address=${encodeURIComponent(query)}&region=ind`;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid API action.' 
      }, { status: 400 });
    }

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    console.log('Making request to:', mapplsUrl);
    
    const response = await fetch(mapplsUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mappls API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: mapplsUrl,
        errorText
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `Mappls API Error: ${response.status} - ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Mappls API Response:', data);
    
    return NextResponse.json({ 
      success: true, 
      data 
    });

  } catch (error: any) {
    console.error('Map API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Network error: ${error.message}` 
    }, { status: 500 });
  }
}