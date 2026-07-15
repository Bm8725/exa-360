'use client';

import { useState, useEffect } from 'react';
import { IxCard, IxCardContent, IxIcon, IxKeyValue, IxButton } from '@siemens/ix-react';

export default function SCADASimplu() {
  const [volume, setVolume] = useState(11.45);
  const [presiune, setPresiune] = useState(85);
  const [program, setProgram] = useState('Premium Foam');

  // Simulare senzori IoT în timp real
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(parseFloat((8 + Math.random() * 8).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    // Fundal gri-deschis curat (#e9ecef), ideal pentru monitorizarea de zi
    <div style={{ padding: '24px', backgroundColor: '#e9ecef', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER PANOU */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#005f73', fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '24px' }}>🎛️ EXA360 // SMART CAR WASH</h2>
        <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Control de la distanță panou simplificat • Status: Online</p>
      </div>

      {/* GRID ZONE - CARDURI ALBE CURATE */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* CARD 1: DEBIT APĂ */}
        <IxCard style={{ width: '260px', backgroundColor: '#ffffff', borderTop: '4px solid #00ffff' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500' }}>DEBIT APĂ (IoT)</span>
              <IxIcon name="drop" size="24" style={{ color: '#00ffff' }} />
            </div>
            <IxKeyValue value={`${volume} m³/h`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold' }} />
          </IxCardContent>
        </IxCard>

        {/* CARD 2: PRESIUNE POMPE (VFD) */}
        <IxCard style={{ width: '280px', backgroundColor: '#ffffff', borderTop: '4px solid #023e8a' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500' }}>PRESIUNE POMPĂ</span>
              <IxIcon name="pulse" size="24" style={{ color: '#023e8a' }} />
            </div>
            <IxKeyValue value={`${presiune} Bar`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold', color: '#023e8a' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {/* CORECTAT: Eliminați proprietatea outline neacceptată de IxButton */}
              <IxButton variant="secondary" onClick={() => setPresiune(70)}>ECO</IxButton>
              <IxButton variant="secondary" onClick={() => setPresiune(95)}>TURBO</IxButton>
            </div>
          </IxCardContent>
        </IxCard>

        {/* CARD 3: PROGRAME CHIMICE (PLC WRITE) */}
        <IxCard style={{ width: '280px', backgroundColor: '#ffffff', borderTop: '4px solid #2a9d8f' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500' }}>SELECTARE PROGRAM</span>
              <IxIcon name="configuration" size="24" style={{ color: '#2a9d8f' }} />
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Activ: <strong>{program}</strong></p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <IxButton variant="secondary" onClick={() => setProgram('Active Foam')}>Spumă</IxButton>
              <IxButton variant="secondary" onClick={() => setProgram('Hot Wax')}>Ceară</IxButton>
            </div>
          </IxCardContent>
        </IxCard>

      </div>
    </div>
  );
}
