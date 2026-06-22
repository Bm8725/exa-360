'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { exaRobot } from '@/lib/exa-360-client';

interface LogEntry { timestamp: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd'; text: string; }

export default function KioskDashboard() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([{ timestamp: new Date().toLocaleTimeString(), type: 'info', text: 'EXA360 Browser Serial Shell Active.' }]);
  const [cmdInput, setCmdInput] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-99), { timestamp: new Date().toLocaleTimeString(), type, text }]);
  }, []);

  // Auto-scroll consolă la apariția logurilor noi
  useEffect(() => { consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  // Handler unic pentru conectare (suportă mod manual și mod automat silențios)
  const handleConnect = useCallback(async (isAuto = false) => {
    try {
      if (!isAuto) {
        addLog('Aștept selectarea adaptorului USB-CAN din fereastra browserului...', 'info');
      }

      // Conectare prin librăria de client din browser
      const deviceInfo = await exaRobot.connect(115200);
      
      if (deviceInfo) {
        setConnected(true);
        const logMsg = isAuto 
          ? `Re-conectare automată reușită! [Vendor: 0x${deviceInfo.usbVendorId.toString(16).toUpperCase()}]` 
          : 'Interfață hardware atașată cu succes direct în browser!';
        addLog(logMsg, 'success');

        // Monitorizare deconectare fizică a cablului USB
        exaRobot.onDisconnect(() => {
          setConnected(false);
          addLog('Cablul USB-CAN a fost scos fizic din calculator!', 'error');
        });
      }
    } catch (err: any) {
      // Dacă este eroare în mod manual (click), o afișăm pe ecran
      if (!isAuto) {
        addLog(`Conexiune avortată: ${err.message}`, 'error');
      }
    }
  }, [addLog]);

  // TRIGGER AUTOMAT LA PORNIREA PAGINII (REFRESH / DESCHIDERE)
  useEffect(() => {
    // Încearcă re-conectarea automată silențioasă imediat la încărcare
    handleConnect(true);
  }, [handleConnect]);

  // Handler trimitere comenzi rapide (Bytes)
  const handleExecute = async (hexValue: number, comment?: string) => {
    const hexString = `0x${hexValue.toString(16).toUpperCase()}`;
    addLog(`Scriere magistrală directă: ${hexString} ${comment ? `(${comment})` : ''}`, 'cmd');
    
    try {
      await exaRobot.sendByte(hexValue);
      addLog(`ACK: Octetul ${hexString} a fost transmis către STM32`, 'success');
    } catch (err: any) {
      addLog(`Eroare hardware la scriere: ${err.message}`, 'error');
    }
  };

  // Linia de comandă din Terminal (Shell)
  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = cmdInput.trim().toLowerCase();
    setCmdInput('');
    if (!cleanCmd) return;
    if (cleanCmd === 'clear') return setLogs([]);
    if (cleanCmd === 'connect') return handleConnect(false);
    
    const parsedHex = parseInt(cleanCmd.startsWith('0x') ? cleanCmd : `0x${cleanCmd}`, 16);
    if (!isNaN(parsedHex) && parsedHex >= 0 && parsedHex <= 255) {
      handleExecute(parsedHex, 'Manual Shell Entry');
    } else {
      addLog(`Token HEX invalid sau comandă necunoscută: "${cmdInput}"`, 'warn');
    }
  };

  return (
    <div style={{ backgroundColor: '#050507', color: '#00ff66', minHeight: '100vh', padding: '25px', fontFamily: '"Fira Code", monospace', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #1f242e', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>EXA360 // WEB DRIVER CORE_</h1>
          <p style={{ margin: '4px 0 0 0', color: '#525a6c', fontSize: '11px' }}>WEB SERIAL CONNECTION // LOCALHOST TEST PROTOCOL</p>
        </div>
        <button onClick={() => handleConnect(false)} style={{ background: connected ? '#062010' : '#240c0c', color: connected ? '#33ff77' : '#ff4444', border: `1px solid ${connected ? '#00ff66' : '#ff4444'}`, padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          {connected ? '● HARDWARE OPERATIONAL' : '🔌 CONNECT TO USB-CAN'}
        </button>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0d0e12', padding: '20px', border: '1px solid #1f242e', borderLeft: `4px solid ${connected ? '#00ff66' : '#ff4444'}` }}>
            <span style={{ color: '#525a6c', fontSize: '11px', display: 'block' }}>MANUAL BROWSER PORT CONTROL</span>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>LINK STATUS: <span style={{ color: connected ? '#00ff66' : '#ff4444' }}>{connected ? 'ONLINE // READY' : 'OFFLINE'}</span></div>
          </div>

          <div style={{ background: '#0d0e12', padding: '20px', border: '1px solid #1f242e' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', borderBottom: '1px solid #1f242e', paddingBottom: '5px' }}>INJECTION TOKENS:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => handleExecute(0x01, 'START P1')} style={{ background: '#111', color: '#00ff66', border: '1px solid #00ff66', padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>[0x01] PREMIUM</button>
              <button onClick={() => handleExecute(0x02, 'START P2')} style={{ background: '#111', color: '#00ff66', border: '1px solid #00ff66', padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>[0x02] STANDARD</button>
              <button onClick={() => handleExecute(0x00, 'HALT SYSTEM')} style={{ background: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '12px', cursor: 'pointer', fontFamily: 'inherit', gridColumn: 'span 2' }}>[0x00] EMERGENCY HALT</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <div style={{ flex: 1, background: '#020203', border: '1px solid #1f242e', borderRadius: '4px 4px 0 0', padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            {logs.map((log, idx) => {
              const colors = { info: '#a6acb8', success: '#33ff77', warn: '#ffb86c', error: '#ff5555', cmd: '#00d7ff' };
              const prefixes = { info: '[INFO]', success: '[ OK ]', warn: '[WARN]', error: '[ERR ]', cmd: '[TX  ]' };
              return (
                <div key={idx} style={{ color: colors[log.type], lineHeight: '1.4' }}>
                  <span style={{ color: '#434a57', marginRight: '8px' }}>[{log.timestamp}]</span>
                  <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{prefixes[log.type]}</span>
                  {log.text}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>

          <form onSubmit={handleShellSubmit} style={{ display: 'flex', background: '#0d0e12', border: '1px solid #1f242e', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '10px' }}>
            <span style={{ color: '#00d7ff', marginRight: '10px', fontWeight: 'bold' }}>exa360_browser$</span>
            <input type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)} placeholder="Type 'connect', 'clear' or HEX code (e.g. 01)..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }} />
          </form>
        </div>
      </div>
    </div>
  );
}
