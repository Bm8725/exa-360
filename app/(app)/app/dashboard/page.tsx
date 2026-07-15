'use client';

import { useState, useEffect } from 'react';
import { IxCard, IxCardContent, IxTypography, IxIcon, IxKeyValue, IxButton } from '@siemens/ix-react';

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
        {/* CORECTAT: Schimbat format="bold" în format="display" și adăugat fontWeight în style */}
        <IxTypography variant="h2" format="display" style={{ color: '#005f73', fontWeight: 'bold' }}>🎛️ EXA360 // SMART CAR WASH</IxTypography>
        <IxTypography variant="body-sm" style={{ color: '#6c757d' }}>Control de la distanță panou simplificat • Status: Online</IxTypography>
      </div>

      {/* GRID ZONE - CARDURI ALBE CURATE */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* CARD 1: DEBIT APĂ */}
        <IxCard variant="insight" style={{ width: '260px', backgroundColor: '#ffffff', borderTop: '4px solid #00ffff' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <IxTypography variant="label-sm" style={{ color: '#6c757d' }}>DEBIT APĂ (IoT)</IxTypography>
              <IxIcon name="drop" size="24" style={{ color: '#00ffff' }} />
            </div>
            <IxKeyValue value={`${volume} m³/h`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold' }} />
          </IxCardContent>
        </IxCard>

        {/* CARD 2: PRESIUNE POMPE (VFD) */}
        <IxCard variant="insight" style={{ width: '280px', backgroundColor: '#ffffff', borderTop: '4px solid #023e8a' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <IxTypography variant="label-sm" style={{ color: '#6c757d' }}>PRESIUNE POMPĂ</IxTypography>
              <IxIcon name="pulse" size="24" style={{ color: '#023e8a' }} />
            </div>
            <IxKeyValue value={`${presiune} Bar`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold', color: '#023e8a' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <IxButton variant="secondary" outline size="sm" onClick={() => setPresiune(70)}>ECO</IxButton>
              <IxButton variant="secondary" outline size="sm" onClick={() => setPresiune(95)}>TURBO</IxButton>
            </div>
          </IxCardContent>
        </IxCard>

        {/* CARD 3: PROGRAME CHIMICE (PLC WRITE) */}
        <IxCard variant="insight" style={{ width: '280px', backgroundColor: '#ffffff', borderTop: '4px solid #2a9d8f' }}>
          <IxCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <IxTypography variant="label-sm" style={{ color: '#6c757d' }}>SELECTARE PROGRAM</IxTypography>
              <IxIcon name="configuration" size="24" style={{ color: '#2a9d8f' }} />
            </div>
            <IxTypography variant="body-md" style={{ marginBottom: '12px' }}>Activ: <strong>{program}</strong></IxTypography>
            <div style={{ display: 'flex', gap: '6px' }}>
              <IxButton variant="secondary" size="sm" onClick={() => setProgram('Active Foam')}>Spumă</IxButton>
              <IxButton variant="secondary" size="sm" onClick={() => setProgram('Hot Wax')}>Ceară</IxButton>
            </div>
          </IxCardContent>
        </IxCard>

      </div>
    </div>
  );
}
