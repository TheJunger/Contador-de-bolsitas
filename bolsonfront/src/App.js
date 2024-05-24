import './App.css';
import { useEffect, useState } from 'react';
import { OpenLabel } from './OpenLabel';
import { saveAs } from 'file-saver';
import React from 'react';
import Login from './Login';

function App() {
  const [dataBolsitas, setDataBolsitas] = useState([]);
  const [showLabelEdit, setShowLabelEdit] = useState(false);
  const [bolsitaid, setBolsitaID] = useState(null);
  const [tipoBolsita, setTipoBolsita] = useState('ninguno');
  const [showContent, setShowContent] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.100.9:5050/api/get-bolsitas-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDataBolsitas(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleClick = (id, tipo) => {
    setShowLabelEdit(true);
    setBolsitaID(id);
    setTipoBolsita(tipo);
  };

  const handleDownload = () => {
    fetch('http://192.168.100.9:5050/api/generate-excel', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, 'bolsitas_data.xlsx');
      });
  };

  return (
    <>
      {token && showContent ? (
        <div className='container'>
          <div className='gridContainer'>
            <div onClick={handleDownload} className='lefttable bolsitastitle'>Bolsitas</div>
            <div className='osvaldo lefttable ostitle'>Osvaldo</div>
            <div className='lefttable vsclass'>Selladas</div>
            <div className='lefttable vssclass'>Sin Sellar</div>
            <div className='lefttable headtotal'>Total</div>
            <div className='huevoClaro lefttable tallarin'>N1 / Tallarin</div>
            <div className='huevoOscuro lefttable cinta'>N2 / Cinta</div>
            <div className='verdeClaro lefttable cintav'>N2 / Cinta (Verde)</div>
            <div className='rojoOscuro lefttable cintar'>N2 / Cinta (Roja)</div>
            <div className='huevoClaro lefttable cintaAncha'>N3 / Cinta Ancha</div>
            <div className='verdeOscuro lefttable cintaAnchav'>N3 / Cinta Ancha (Verde)</div>
            <div className='rojoClaro lefttable cintaAnchar'>N3 / Cinta Ancha (Roja)</div>
            <div className='huevoOscuro lefttable pappardelle'>N4 / Papardelle</div>
            {dataBolsitas.map((bolsitas) => (
              <React.Fragment key={bolsitas.ID}>
                <div onClick={() => handleClick(bolsitas.ID, 'selladas')} className={`bolsitas bolsitas${bolsitas.Grosor}selladas content${bolsitas.Grosor} bolsitasselladas`}>{bolsitas.Selladas}</div>
                <div onClick={() => handleClick(bolsitas.ID, 'Sin Sellar')} className={`bolsitas bolsitas${bolsitas.Grosor}sinsellar content${bolsitas.Grosor} bolsitassinsellar`}>{bolsitas.Sin_Sellar}</div>
                <div className={`bolsitas bolsitas${bolsitas.Grosor}total content${bolsitas.Grosor} total`}>{parseInt(bolsitas.Selladas) + parseInt(bolsitas.Sin_Sellar)}</div>
              </React.Fragment>
            ))}
            {showLabelEdit ? <OpenLabel setShowLabelEdit={setShowLabelEdit} bolsitaid={bolsitaid} tipoBolsita={tipoBolsita} fetchData={fetchData} /> : null}
          </div>
        </div>
      ) : (
        <Login setShowContent={setShowContent} setToken={(token) => {
          setToken(token);
          localStorage.setItem('token', token);
        }} />
      )}
    </>
  );
}

export default App;
