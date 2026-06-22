/**
 * EXA360 Client-Side Hardware Driver (Web Serial API)
 * Management avansat pentru identificare unică per stație.
 */

export class Exa360ClientDriver {
  private port: any | null = null;
  private writer: any | null = null;

  // Filtre opționale pentru a recunoaște doar adaptorul tău oficial (ex: cipuri CH340 sau FTDI)
  // Dacă afli Vendor ID-ul (usbVendorId) de la adaptorul tău, îl punem aici pentru filtrare automată strictă
  private hardwareFilters = [
    { usbVendorId: 0x1a86 }, // CH340 / CH341 chipsets
    { usbVendorId: 0x0403 }, // FTDI chipsets
    { usbVendorId: 0x10c4 }  -- Silicon Labs CP210x chipsets
  ];

  /**
   * Conectează stația curentă la adaptorul USB-CAN mapat
   */
  async connect(baudRate: number = 115200): Promise<any> {
    if (typeof window === 'undefined') return null;

    if (!('serial' in navigator)) {
      throw new Error('Web Serial API nu este suportat!');
    }

    // 1. MANAGEMENT AUTOMAT: Verificăm dacă browserul are DEJA o stație salvată și autorizată în trecut
    const porturiSalvate = await (navigator as any).serial.getPorts();
    
    if (porturiSalvate.length > 0) {
      // Dacă am mai aprobat acest adaptor în trecut, browserul se conectează AUTOMAT, fără ferestre pop-up!
      this.port = porturiSalvate[0];
      console.log("⚡ [Exa360] Re-conectare automată la stația salvată.");
    } else {
      // Dacă este prima pornire în acea stație, cerem aprobarea manuală o singură dată
      this.port = await (navigator as any).serial.requestPort({ filters: this.hardwareFilters });
    }
    
    await this.port.open({ baudRate });
    
    // Extragem ID-urile hardware unice pentru a ști exact ce stație gestionăm
    const { usbVendorId, usbProductId } = this.port.getInfo();
    return { usbVendorId, usbProductId, path: "USB_CAN_BUS_ACTIVE" };
  }

  /**
   * Trimite octetul de execuție direct pe fir
   */
  async sendByte(hexValue: number): Promise<void> {
    if (!this.port || !this.port.writable) {
      throw new Error('Portul serial este închis sau indisponibil!');
    }

    this.writer = this.port.writable.getWriter();
    const data = new Uint8Array([hexValue]);

    try {
      await this.writer.write(data);
    } finally {
      this.writer.releaseLock();
      this.writer = null;
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.port) {
      this.port.addEventListener('disconnect', callback);
    }
  }
}

export const exaRobot = new Exa360ClientDriver();
