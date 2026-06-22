'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Device { path: string; manufacturer?: string; pnpId?: string; }
interface LogEntry { timestamp: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd'; text: string; }

export default function KioskDashboard() {
  const [status, setStatus] = useState<{ connected: boolean; portPath: string; deviceList: Device[] }>({ connected: false, portPath: '', deviceList: [] });
  const [isLive, setIsLive] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([{ timestamp: new Date().toLocaleTimeString(), type: 'info', text: 'EXA360 Core Shell Active.' }]);
  const [cmdInput, setCmdInput] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-99), { timestamp: new Date().toLocaleTimeString(), type, text }]);
  }, []);

  const checkHardware = useCallback(async () => {
    try {
      const res = await fetch('/api/hardware-status');
      const data = await res.json();
      setStatus(prev => {
        if (prev.connected !== data.connected || prev.portPath !== data.portPath || prev.deviceList.length !== (data.deviceList?.length || 0)) {
          addLog(data.connected ? `Hardware link established on ${data.portPath}` : `Hardware interface dropped`, data.connected ? 'success' : 'error');
          return { connected: data.connected, portPath: data.portPath, deviceList: data.deviceList || [] };
        }
        return prev;
      });
    } catch { setStatus(prev => { if (prev.connected) addLog(`API Connection lost`, 'error'); return { ...prev, connected: false }; }); }
  }, [addLog]);

  useEffect(() => {
    if (!isLive) return;
    checkHardware();
    const intervalId = setInterval(checkHardware, 1000);
    return () => clearInterval(intervalId);
  }, [isLive, checkHardware]);

  useEffect(() => { consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const executeCommand = async (hexValue: number, comment?: string) => {
    const hexString = `0x${hexValue.toString(16).toUpperCase()}`;
    addLog(`Executing bus write: ${hexString} ${comment ? `(${comment})` : ''}`, 'cmd');
    try {
      const res = await fetch('/api/spalare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ programId: hexValue, fisaId: `SHELL-CMD-${Date.now().toString().slice(-4)}` }) });
      const data = await res.json();
      addLog(data.success ? `ACK received for token ${hexString}` : `NACK: ${data.error}`, data.success ? 'success' : 'error');
    } catch (err: any) { addLog(`Bus write failed: ${err.message}`, 'error'); }
  };

  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = cmdInput.trim().toLowerCase();
    setCmdInput('');
    if (!cleanCmd) return;
    if (cleanCmd === 'clear') return setLogs([]);
    if (cleanCmd === 'scan') return checkHardware();
    const parsedHex = parseInt(cleanCmd.startsWith('0x') ? cleanCmd : `0x${cleanCmd}`, 16);
    if (!isNaN(parsedHex) && parsedHex >= 0 && parsedHex <= 255) executeCommand(parsedHex, 'Manual Shell Entry');
    else addLog(`Invalid HEX token: "${cmdInput}"`, 'warn');
  };

  return (
    <div style={{ backgroundColor: '#050507', color: '#00ff66', minHeight: '100vh', padding: '25px', fontFamily: '"Fira Code", monospace', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #1f242e', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>EXA360 // TERMINAL_</h1>
          <p style={{ margin: '4px 0 0 0', color: '#525a6c', fontSize: '11px' }}>NODE: LOCALHOST // CORE v1.4</p>
        </div>
        <button onClick={() => setIsLive(!isLive)} style={{ background: isLive ? '#062010' : '#240c0c', color: isLive ? '#33ff77' : '#ff4444', border: `1px solid ${isLive ? '#00ff66' : '#ff4444'}`, padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
          {isLive ? '● LIVE SCAN ON' : '■ SCAN PAUSED'}
        </button>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0d0e12', padding: '20px', border: '1px solid #1f242e', borderLeft: `4px solid ${status.connected ? '#00ff66' : '#ff4444'}` }}>
            <span style={{ color: '#525a6c', fontSize: '11px', display: 'block' }}>BUS NODE STATUS</span>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>CAN-BUS: <span style={{ color: status.connected ? '#00ff66' : '#ff4444' }}>{status.connected ? `READY // BOUND TO ${status.portPath}` : 'OFFLINE'}</span></div>
          </div>

          <div style={{ background: '#0d0e12', padding: '20px', border: '1px solid #1f242e' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', borderBottom: '1px solid #1f242e', paddingBottom: '5px' }}>INJECTION TOKENS:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => executeCommand(0x01, 'START P1')} style={{ background: '#111', color: '#00ff66', border: '1px solid #00ff66', padding: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>[0x01] PREMIUM</button>
              <button onClick={() => executeCommand(0x02, 'START P2')} style={{ background: '#111', color: '#00ff66', border: '1px solid #00ff66', padding: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>[0x02] STANDARD</button>
              <button onClick={() => executeCommand(0x00, 'HALT SYSTEM')} style={{ background: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '10px', cursor: 'pointer', fontFamily: 'inherit', gridColumn: 'span 2' }}>[0x00] EMERGENCY HALT</button>
            </div>
          </div>

          <div style={{ background: '#0d0e12', padding: '20px', border: '1px solid #1f242e', flex: 1 }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#fff' }}>HARDWARE MAP:</h3>
            {status.deviceList.length === 0 ? <p style={{ color: '#ff4444', fontSize: '13px' }}>&gt; No active COM nodes found.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {status.deviceList.map((dev, i) => (
                  <div key={i} style={{ padding: '10px', background: '#13151a', border: `1px solid ${dev.path === status.portPath ? '#00ff66' : '#222'}` }}>
                    <div style={{ fontSize: '13px', color: '#fff' }}>Node: <strong>{dev.path}</strong></div>
                    <div style={{ fontSize: '11px', color: '#525a6c' }}>Chipset: {dev.manufacturer || 'GENERIC'}</div>
                  </div>
                ))}
              </div>
            )}
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
            <span style={{ color: '#00d7ff', marginRight: '10px', fontWeight: 'bold' }}>exa360_root$</span>
            <input type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)} placeholder="Enter HEX (e.g. 01, 0x0A) or 'clear'..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }} />
          </form>
        </div>
      </div>
    </div>
  );
}
