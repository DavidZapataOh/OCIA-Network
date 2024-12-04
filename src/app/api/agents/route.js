import { NextResponse } from 'next/server';

export async function GET() {
  const agents = [
    {
      name: "Trading Agent",
      description: "Optimizes trading strategies",
      status: "active"
    },
    {
      name: "Analysis Agent",
      description: "Analyzes market trends",
      status: "active"
    }
  ];

  return NextResponse.json(agents);
}