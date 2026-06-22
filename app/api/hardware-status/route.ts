import { NextResponse } from 'next/server';
import { SerialPort } from 'serialport';

export async function GET() {
  try {
    const ports = await SerialPort.list();
    
    // Verificăm dacă există vreun adaptor conectat
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
    return NextResponse.json({ connected: false, error: error.message });
  }
}
