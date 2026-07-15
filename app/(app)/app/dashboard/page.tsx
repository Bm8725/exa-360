'use client';

import { useState, useEffect } from 'react';
import { IxCard, IxCardContent, IxIcon, IxKeyValue, IxButton } from '@siemens/ix-react';

export default function SCADASimplu() {
  const [volume, setVolume] = useState(11.45);
  const [presiune, setPresiune] = useState(85);
  const [program, setProgram] = useState('Premium Foam');
  
  // Stări noi pentru Boxa de Spălare
  const [boxaOcupata, setBoxaOcupata] = useState(true);
  const [bilaPozitie, setBilaPozitie] = useState('OK (Centrat)');
  const [luminaBoxa, setLuminaBoxa] = useState(true);

  // Simulare senzori IoT în timp real
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(parseFloat((8 + Math.random() * 8).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#e9ecef', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER PANOU */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#005f73', fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '24px' }}>🎛️ EXA360 // SMART CAR WASH</h2>
        <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Interfață HMI Digitalizată • Monitorizare Boxe de Spălare în Timp Real</p>
      </div>

      {/* REORGANIZARE GRID: 2 COLOANE PRINCIPALE */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* COLOANA STÂNGA: SENZORI ȘI COMANDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1', minWidth: '300px' }}>
          
          {/* CARD 1: DEBIT APĂ */}
          <IxCard style={{ backgroundColor: '#ffffff', borderTop: '4px solid #00ffff' }}>
            <IxCardContent style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500' }}>DEBIT APĂ (IoT)</span>
                <IxIcon name="drop" size="24" style={{ color: '#00ffff' }} />
              </div>
              <IxKeyValue value={`${volume} m³/h`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold' }} />
            </IxCardContent>
          </IxCard>

          {/* CARD 2: PRESIUNE POMPE (VFD) */}
          <IxCard style={{ backgroundColor: '#ffffff', borderTop: '4px solid #023e8a' }}>
            <IxCardContent style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500' }}>PRESIUNE POMPĂ</span>
                <IxIcon name="pulse" size="24" style={{ color: '#023e8a' }} />
              </div>
              <IxKeyValue value={`${presiune} Bar`} labelPosition="top" style={{ fontSize: '24px', fontWeight: 'bold', color: '#023e8a' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <IxButton variant="secondary" onClick={() => setPresiune(70)}>ECO</IxButton>
                <IxButton variant="secondary" onClick={() => setPresiune(95)}>TURBO</IxButton>
              </div>
            </IxCardContent>
          </IxCard>

          {/* CARD 3: PROGRAME CHIMICE */}
          <IxCard style={{ backgroundColor: '#ffffff', borderTop: '4px solid #2a9d8f' }}>
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

        {/* COLOANA DREAPTA: MODELARE GRAFICĂ BOXĂ DE SPĂLARE */}
        <div style={{ flex: '1.5', minWidth: '400px' }}>
          <IxCard style={{ backgroundColor: '#ffffff', borderTop: '4px solid #005f73' }}>
            <IxCardContent style={{ padding: '20px' }}>
              
              {/* TITLU DIAGRAMĂ */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 'bold', color: '#005f73', fontSize: '16px' }}>📐 SCHEMĂ SINOPTICĂ // BOXA 1</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <IxButton variant="secondary" onClick={() => setBoxaOcupata(!boxaOcupata)}>Toggle Vehicul</IxButton>
                  <IxButton variant="secondary" onClick={() => setLuminaBoxa(!luminaBoxa)}>Lumină</IxButton>
                </div>
              </div>

              {/* REPREZENTAREA GRAFICĂ A BOXEI */}
              <div style={{ 
                border: '3px dashed #6c757d', 
                borderRadius: '8px', 
                height: '240px', 
                position: 'relative', 
                backgroundColor: luminaBoxa ? '#f8f9fa' : '#343a40',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                
                {/* INDICATOARE DE STATUS ÎN BOXĂ */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '8px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    color: '#ffffff',
                    backgroundColor: boxaOcupata ? '#e63946' : '#2a9d8f' 
                  }}>
                    {boxaOcupata ? '🔴 OCUPAT' : '🟢 LIBER'}
                  </span>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#e2eafc', color: '#023e8a', fontWeight: 'bold' }}>
                    💡 LUMINA: {luminaBoxa ? 'PORNITĂ' : 'OPRITĂ'}
                  </span>
                </div>

                {/* SENSOR BARIERĂ FOTOELECTRICĂ (POZIȚIE) */}
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '12px', color: luminaBoxa ? '#6c757d' : '#f8f9fa' }}>
                  Poziție: <strong style={{ color: '#2a9d8f' }}>{bilaPozitie}</strong>
                </div>

                {/* ANIMATIE STRUCTURĂ AUTOMOBIL / BOXĂ */}
                {boxaOcupata ? (
                  <div style={{ 
                    width: '180px', 
                    height: '110px', 
                    backgroundColor: '#005f73', 
                    borderRadius: '12px', 
                    color: '#ffffff', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    border: '3px solid #00ffff'
                  }}>
                    <IxIcon name="document-workflow" size="32" style={{ marginBottom: '4px' }} />
                    <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>VEHICUL DETECTAT</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Spălare în curs...</span>
                  </div>
                ) : (
                  <div style={{ color: '#6c757d', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Așteptare autovehicul...</p>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>Senzor radar activat</span>
                  </div>
                )}

                {/* SIMULARE JET DE APĂ / BRAȚE DE SPĂLARE */}
                {boxaOcupata && (
                  <>
                    {/* Braț Spălare Stânga */}
                    <div style={{ position: 'absolute', left: '20px', width: '6px', height: '140px', backgroundColor: '#00ffff', opacity: 0.5, borderRadius: '3px' }} />
                    {/* Braț Spălare Dreapta */}
                    <div style={{ position: 'absolute', right: '20px', width: '6px', height: '140px', backgroundColor: '#00ffff', opacity: 0.5, borderRadius: '3px' }} />
                  </>
                )}
              </div>

              {/* BUTOANE SIMULATOR POZIȚIONARE PLC */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <IxButton variant="secondary" onClick={() => setBilaPozitie('DEPLASAT STÂNGA')}>Simulează Eroare Aliniere</IxButton>
                <IxButton variant="secondary" onClick={() => setBilaPozitie('OK (Centrat)')}>Resetează Aliniere</IxButton>
              </div>

            </IxCardContent>
          </IxCard>
        </div>

      </div>
    </div>
  );
}
