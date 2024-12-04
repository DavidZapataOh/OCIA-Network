import { NextResponse } from 'next/server';

export async function GET() {
  const gasdata = [
    { "time": "10:00", "gasPrice": 50 },
    { "time": "11:00", "gasPrice": 45 },
    { "time": "12:00", "gasPrice": 60 }
  ];

  return NextResponse.json(gasdata);
}