import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Plasa de siguranță pentru Vercel Cloud: ignorăm direct hardware-ul
  if (process.env.VERCEL) {
    return NextResponse.json({ 
      connected: false, 
      portPath: "CLOUD_NODE_NO_HARDWARE", 
      deviceList: [] 
    });
  }

  try {
    // 2. ASCUNDERE STRATEGICĂ PENTRU TURBOPACK:
    // Punem numele pachetului într-o variabilă. Turbopack nu va mai analiza linia la build!
    const packetName = 'serialport';
    
    // @ts-ignore
    const serialModule = await import(packetName);
    const SerialPort = serialModule.SerialPort;
    
    const ports = await SerialPort.list();
    
    // Scanăm cipurile convertoarelor USB-CAN standard (CH340, FTDI, Silicon Labs)
    const isConnected = ports.some((p: any) => 
      p.manufacturer?.toLowerCase().includes('ch340') || 
      p.manufacturer?.toLowerCase().includes('ftdi') ||
      p.manufacturer?.toLowerCase().includes('silicon labs') ||
      p.pnpId?.toLowerCase().includes('usb')
    );

    const activePort = ports.find((p: any) => p.pnpId?.toLowerCase().includes('usb'))?.path || "Niciunul";

    return NextResponse.json({ 
      connected: isConnected, 
      portPath: activePort, 
      deviceList: ports 
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message, deviceList: [] });
  }
}
