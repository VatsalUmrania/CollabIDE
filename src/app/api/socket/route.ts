import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Socket.IO is handled by the custom server',
    socketPath: '/api/socket',
    instructions: 'Connect using Socket.IO client to this path'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Socket.IO connections should be made via WebSocket, not POST'
  }, { status: 400 })
}
