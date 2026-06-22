import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Dacă rulează pe serverele Vercel în Cloud, returnăm direct o stare inactivă fictivă pentru a nu crăpa build-ul
  if (process.env.VERCEL) {
    return NextResponse.json({ 
      connected: false, 
      portPath: "CLOUD_NODE_NO_HARDWARE", 
      deviceList: [] 
    });
  }

  try {
    // 2. Încărcăm librăria hardware DINAMIC (doar când rulează pe PC-ul tău local de la spălătorie)
    const { SerialPort } = await import('serialport');
    const ports = await SerialPort.list();
    
    // Scanăm cipurile convertoarelor USB-CAN standard (CH340, FTDI, Silicon Labs)
    const isConnected = ports.some(p => 
      p.manufacturer?.toLowerCase().includes('ch340') || 
      p.manufacturer?.toLowerCase().includes('ftdi') ||
      p.manufacturer?.toLowerCase().includes('silicon labs') ||
      p.pnpId?.toLowerCase().includes('usb')
    );

    const activePort = ports.find(p => p.pnpId?.toLowerCase().includes('usb'))?.path || "Niciunul";

    return NextResponse.json({ 
      connected: isConnected, 
      portPath: activePort, 
      deviceList: ports 
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message, deviceList: [] });
  }
}
