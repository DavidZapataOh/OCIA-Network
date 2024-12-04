import { NextResponse } from 'next/server';
import axios from 'axios';

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const retryRequest = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.log(`Reintentando... ${retries} intentos restantes`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return retryRequest(fn, retries - 1);
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, data } = body;

    const apiKey = process.env.NEXT_PUBLIC_BRIAN_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_BRIAN_API_URL?.replace(/\/$/, '');

    if (!apiKey || !apiUrl) {
      throw new Error('Faltan credenciales de API');
    }

    console.log(`Intentando conexión a ${apiUrl}/api/v0/agent/${endpoint}`);

    const makeRequest = () => apiClient({
      method: 'POST',
      url: `${apiUrl}/api/v0/agent/${endpoint}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      data: data,

      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const response = await retryRequest(makeRequest);
    
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        timeout: error.config?.timeout
      }
    });
    
    return NextResponse.json(
      { 
        error: `Error en la API de Brian: ${error.message}`,
        details: process.env.NODE_ENV === 'development' ? 
          error.response?.data || error.message : undefined
      },
      { status: error.response?.status || 500 }
    );
  }
}