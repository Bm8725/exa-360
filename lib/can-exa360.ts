import 'server-only';
import { SerialPort } from 'serialport';

declare global {
  var cachedExaPort: SerialPort | undefined;
  var isExaPortInitializing: boolean | undefined;
}

const VITEZA_BAUD = 115200;
let portFizic: SerialPort | null = null;

// AUTO-DETECTION LOGIC
async function gasestePortulAdaptorului(): Promise<string> {
  const porturiDisponibile = await SerialPort.list();
  
  console.log("🔍 [Exa360] Scanning USB ports on PC...");
  console.log(porturiDisponibile);

  // Method 1: Search by standard USB-CAN chip manufacturers
  const portGasit = porturiDisponibile.find(p => 
    p.manufacturer?.toLowerCase().includes('ch340') || 
    p.manufacturer?.toLowerCase().includes('ftdi') ||
    p.manufacturer?.toLowerCase().includes('silicon labs') ||
    p.pnpId?.toLowerCase().includes('usb')
  );

  if (portGasit) {
    console.log(`✅ [Exa360] Detected USB-CAN adapter on port: ${portGasit.path}`);
    return portGasit.path;
  }

  // Method 2: Fallback to the first available COM port if only one is present
  if (porturiDisponibile.length > 0) {
    console.log(`⚠️ [Exa360] Adapter manufacturer unrecognized. Using first available port: ${porturiDisponibile[0].path}`);
    return porturiDisponibile[0].path;
  }

  // Method 3: Panic if completely empty
  throw new Error("No USB-CAN adapter found connected to the machine!");
}

// ASYNC INITIALIZATION WRAPPER FOR NEXT.JS BACKEND
async function initializeazaPort(): Promise<void> {
  if (globalThis.cachedExaPort) {
    portFizic = globalThis.cachedExaPort;
    return;
  }

  if (globalThis.isExaPortInitializing) return;
  globalThis.isExaPortInitializing = true;

  try {
    const targetPath = await gasestePortulAdaptorului();

    globalThis.cachedExaPort = new SerialPort({
      path: targetPath,
      baudRate: VITEZA_BAUD,
      autoOpen: true
    });

    portFizic = globalThis.cachedExaPort;
    globalThis.isExaPortInitializing = false;

    portFizic.on('error', (err) => {
      console.error('❌ [Hardware Alert] Connection error on CAN Bus:', err.message);
    });

  } catch (err: any) {
    globalThis.isExaPortInitializing = false;
    console.error('❌ [Initialization Failed]:', err.message);
    throw err;
  }
}

// Trigger initial hardware discovery in the background when the server boots up
initializeazaPort().catch(() => {});

/**
 * Sends a real execution byte (Byte) through the CAN adapter straight to the STM32
 * @param codHex The numeric hex value command (e.g., 0x01 for START)
 */
export const trimiteComandaLaRobot = async (codHex: number): Promise<void> => {
  // Ensure the port is fully configured before running any write sequences
  if (!portFizic) {
    await initializeazaPort();
  }

  if (!portFizic) {
    throw new Error("Hardware transmission failed: Serial port interface is unavailable.");
  }

  return new Promise((resolve, reject) => {
    // Pack the hex value into a native Node.js 1-byte binary buffer
    const buffer = Buffer.from([codHex]);

    portFizic!.write(buffer, (err) => {
      if (err) {
        console.error('❌ Error writing to USB-CAN interface:', err);
        return reject(err);
      }
      
      // Force empty the kernel space buffers to ensure instant delivery on the physical line
      portFizic!.drain((drainErr) => {
        if (drainErr) return reject(drainErr);
        console.log(`⚡ [CAN Bus] Byte successfully injected to STM32: 0x${codHex.toString(16).toUpperCase()}`);
        resolve();
      });
    });
  });
};
