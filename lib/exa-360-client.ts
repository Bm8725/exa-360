/**
 * EXA360 Client-Side Hardware Driver (Web Serial API)
 * Rulează exclusiv în browserul local (Chrome / Edge).
 * lib/exa-360-client.ts
 * 
 * Acest modul permite aplicației web să comunice direct cu microcontrolerul STM32 prin adaptorul USB-CAN.
 */

export class Exa360ClientDriver {
  private port: any | null = null;
  private writer: any | null = null;

  /**
   * Cere permisiunea utilizatorului și deschide portul COM selectat
   */
  async connect(baudRate: number = 115200): Promise<string> {
    if (typeof window === 'undefined') return 'SERVER_ENVIRONMENT';

    if (!('serial' in navigator)) {
      throw new Error('[exa-360] Web Serial API nu este suportat de acest browser. Folosește Google Chrome sau Microsoft Edge!');
    }

    // Deschide fereastra nativă a browserului pentru selectarea adaptorului USB
    this.port = await (navigator as any).serial.requestPort();
    
    // Deschide portul fizic cu viteza setată în STM32
    await this.port.open({ baudRate });
    
    return 'CONNECTED';
  }

  /**
   * Trimite un singur octet (Byte) direct prin adaptorul USB-CAN către STM32
   */
  async sendByte(hexValue: number): Promise<void> {
    if (!this.port || !this.port.writable) {
      throw new Error('[exa-360] Transmisie eșuată: Portul serial nu este activ sau deschis!');
    }

    this.writer = this.port.writable.getWriter();
    const data = new Uint8Array([hexValue]); // Împachetează numărul în format binar pur (1 Byte)

    try {
      await this.writer.write(data);
    } finally {
      // Eliberează portul imediat pentru a fi disponibil la următoarea comandă
      this.writer.releaseLock();
      this.writer = null;
    }
  }

  /**
   * Închide conexiunea hardware în siguranță
   */
  async disconnect(): Promise<void> {
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
  }

  /**
   * Ascultă dacă dispozitivul este scos fizic din mufa USB (Hot-Plug)
   */
  onDisconnect(callback: () => void): void {
    if (this.port) {
      this.port.addEventListener('disconnect', callback);
    }
  }
}

// Exportăm o instanță unică globală (SaaS Client Singleton)
export const exaRobot = new Exa360ClientDriver();
