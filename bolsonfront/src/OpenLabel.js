import React, { useState, useEffect } from "react";

const OpenLabel = ({ setShowLabelEdit, bolsitaid, tipoBolsita, fetchData }) => {
  const [dataEditBolsitas, setDataEditBolsitas] = useState([]);
  const [selladas, setSelladas] = useState(0);

  useEffect(() => {
    fetch(`http://192.168.100.9:5050/api/get-specific-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bolsitaid: bolsitaid })
    })
    .then(response => response.json())
    .then(data => {
      setDataEditBolsitas(data);
      if (data.length > 0 && tipoBolsita == 'selladas') {
        setSelladas(data[0].Selladas); // Inicializar el valor del input
      }
      else if (data.length > 0 && tipoBolsita == 'Sin Sellar') {
        setSelladas(data[0].Sin_Sellar); // Inicializar el valor del input
      }
      console.log(data);
    });
  }, [bolsitaid]);

  const handleSave = () => {
    fetch('http://192.168.100.9:5050/api/save-bolsita', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bolsitaid: bolsitaid, nuevoValor: selladas, tipoACambiar: tipoBolsita, total: (parseInt(selladas) + parseInt(dataEditBolsitas[0].Sin_Sellar)) })
    })
    .then(() => {
      setShowLabelEdit(false);
      fetchData();  // Llamar a fetchData para actualizar los datos en App
    });
  };

  const handleChange = (e) => {
    setSelladas(e.target.value);
  };

  const handleCancel = () => {
    setShowLabelEdit(false);
  };

  return (
    <div className="labelcont">
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
          <div>S : {dataEditBolsitas.length > 0 ? (dataEditBolsitas[0].Selladas): ('cargando')}</div>
          <div>SS: {dataEditBolsitas.length > 0 ? (dataEditBolsitas[0].Sin_Sellar): ('cargando')}</div>
        </div>
        <div className="buttonsnumerlabel">
          <div onClick={() => setSelladas(selladas - 1200)}>-1200</div>
          <div className="buttonnumerhidden" onClick={() => setSelladas(selladas - 1100)}>-1100</div>
          <div className="buttonnumerhiddendos" onClick={() => setSelladas(selladas - 1000)}>-1000</div>
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas - 900)}>-900</div>
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas - 600)}>-600</div>
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas - 500)}>-500</div>
          <input
            type="number"
            onChange={handleChange}
            value={selladas}
            className="inputlabelcont"
            placeholder={selladas}
          />
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas + 500)}>+500</div>
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas + 600)}>+600</div>
          <div className="buttonnumerhiddenphone" onClick={() => setSelladas(selladas + 900)}>+900</div>
          <div className="buttonnumerhiddendos" onClick={() => setSelladas(selladas + 1000)}>+1000</div>
          <div className="buttonnumerhidden" onClick={() => setSelladas(selladas + 1100)}>+1100</div>
          <div onClick={() => setSelladas(selladas + 1200)}>+1200</div>
        </div>
        <div className="buttonssavelabel">
          <div className="cancelbutonlabel" onClick={handleCancel}>Cancelar</div>
          <div onClick={handleSave}>Guardar</div>
        </div>
      </div>
    </div>
  );
}

export { OpenLabel };
