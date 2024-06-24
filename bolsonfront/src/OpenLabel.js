import React, { useState, useEffect } from "react";

const OpenLabel = ({ setShowLabelEdit, bolsitaid, tipoBolsita, fetchData, token }) => {
  const [dataEditBolsitas, setDataEditBolsitas] = useState([]);
  const [selladas, setSelladas] = useState(0);
  const [sinSellar, setSinSellar] = useState(0);

  useEffect(() => {
    fetch(`https://thejunger.pythonanywhere.com/api/get-specific-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ bolsitaid: bolsitaid })
    })
      .then(response => response.json())
      .then(data => {
        setDataEditBolsitas(data);
        if (data.length > 0) {
          setSelladas(data[0].Selladas);
          setSinSellar(data[0].Sin_Sellar);
        }
      });
  }, [bolsitaid]);

  const handleSave = async (e) => {
    e.preventDefault();

    const response = await fetch('https://thejunger.pythonanywhere.com/api/save-bolsita', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        bolsitaid: bolsitaid,
        nuevoValorSelladas: selladas,
        nuevoValorSinSellar: sinSellar,
      })
    });

    if (response.ok) {
      setShowLabelEdit(false);
      fetchData();
    } else {
      alert('Ha sucedido un problema durante el guardado');
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (tipoBolsita === "selladas") {
      const difference = newValue - selladas;
      setSelladas(newValue);
      setSinSellar(sinSellar - difference);
    } else if (tipoBolsita === "Sin Sellar") {
      setSinSellar(newValue);
    }
  };

  const handleCancel = () => {
    setShowLabelEdit(false);
  };

  const adjustValue = (amount) => {
    if (tipoBolsita === "selladas") {
      const newSelladas = selladas + amount;
      const newSinSellar = sinSellar - amount;
      setSelladas(newSelladas);
      setSinSellar(newSinSellar);
    } else if (tipoBolsita === "Sin Sellar") {
      setSinSellar(sinSellar + amount);
    }
  };

  return (
    <form className="labelcont" onSubmit={handleSave}>
      <div className="fondodifuminado"></div>
      <div className="labelgetbolsitacontainer">
        {dataEditBolsitas.length > 0 ? (
          <div className="labeledittitle">
            Estas editando {tipoBolsita} {dataEditBolsitas[0].Grosor}
          </div>
        ) : (
          'Cargando'
        )}
        <div className="helplabel">
          <div>S : {dataEditBolsitas.length > 0 ? dataEditBolsitas[0].Selladas : 'cargando'}</div>
          <div>SS: {dataEditBolsitas.length > 0 ? dataEditBolsitas[0].Sin_Sellar : 'cargando'}</div>
        </div>
        <div className="buttonsnumerlabel">
          <div onClick={() => adjustValue(-1200)}>-1200</div>
          <div className="buttonnumerhidden" onClick={() => adjustValue(-1100)}>-1100</div>
          <div className="buttonnumerhiddendos" onClick={() => adjustValue(-1000)}>-1000</div>
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(-900)}>-900</div>
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(-600)}>-600</div>
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(-500)}>-500</div>
          <input
            type="number"
            onChange={handleChange}
            value={tipoBolsita === "selladas" ? selladas : sinSellar}
            className="inputlabelcont"
            placeholder={tipoBolsita === "selladas" ? selladas : sinSellar}
          />
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(500)}>+500</div>
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(600)}>+600</div>
          <div className="buttonnumerhiddenphone" onClick={() => adjustValue(900)}>+900</div>
          <div className="buttonnumerhiddendos" onClick={() => adjustValue(1000)}>+1000</div>
          <div className="buttonnumerhidden" onClick={() => adjustValue(1100)}>+1100</div>
          <div onClick={() => adjustValue(1200)}>+1200</div>
        </div>
        <div className="buttonssavelabel">
          <button className="cancelbutonlabel" onClick={handleCancel}>Cancelar</button>
          <button className="savebuttonlabel" type="submit">Guardar</button>
        </div>
      </div>
    </form>
  );
}

export { OpenLabel };
