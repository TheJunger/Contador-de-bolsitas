from flask import Flask, request, jsonify, send_file
import sqlite3
from flask_cors import CORS
from io import BytesIO
import pandas as pd
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'yametekudasai'  # Cambia esto a un valor seguro
CORS(app, origins=["*"])
jwt = JWTManager(app)

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    hashed_password = generate_password_hash(password)

    conn = sqlite3.connect('./database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()

    return jsonify(message='User registered successfully'), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    conn = sqlite3.connect('./database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[0], password):
        access_token = create_access_token(identity=username)
        print('login correcto')
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message='Invalid credentials'), 401

@app.route("/api/get-bolsitas-data", methods=["GET"])
@jwt_required()
def get_bolsitas_data():
    conn = sqlite3.connect('./database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bolsitas')
    data = cursor.fetchall()
    conn.close()
    columns = ["ID","Dueño", "Color", "Grosor", "Selladas", "Sin_Sellar", "Total"]
    result = [dict(zip(columns,row)) for row in data]
    return jsonify(result)

@app.route("/api/get-specific-data", methods=["POST"])
def get_specific_bolsita():
    id = request.json["bolsitaid"]
    conn = sqlite3.connect("./database.db")
    cursor = conn.cursor()
    #cursor.execute(f'SELECT * FROM bolsitas WHERE id_bolsita = {id}')
    cursor.execute('SELECT * FROM bolsitas WHERE id_bolsita = ?', (id,))# asi para evitar sql inyection
    data = cursor.fetchall()
    conn.close()
    # Formatea los datos como una lista de diccionarios
    columns = ["ID","Dueño", "Color", "Grosor", "Selladas", "Sin_Sellar", "Total"]    
    result = [dict(zip(columns, row)) for row in data]
    return jsonify(result)

@app.route("/api/save-bolsita", methods=["PUT"])
@jwt_required()
def save_bolsita():
    id = request.json["bolsitaid"]
    nuevovalor = request.json["nuevoValor"]
    tipo_a_cambiar = request.json["tipoACambiar"]
    total = request.json["total"]
    print(id)
    print(nuevovalor)
    print(tipo_a_cambiar)
    print(total)
    conn = sqlite3.connect("./database.db")
    cursor = conn.cursor()
    if(tipo_a_cambiar == "selladas"):
        cursor.execute(f'UPDATE bolsitas SET selladas = ?, total = ? WHERE id_bolsita = ?', (nuevovalor, total, id)) #execute
        conn.commit()
        conn.close()
    elif(tipo_a_cambiar == "Sin Sellar"):
        cursor.execute(f'UPDATE bolsitas SET sin_sellar = ?, total = ? WHERE id_bolsita = ?', (nuevovalor, total, id)) #execute
        conn.commit()
        conn.close()
    # Formatea los datos como una lista de diccionarios
    return ('done')

@app.route("/api/generate-excel", methods=["GET"])
@jwt_required()
def generate_excel():
    conn = sqlite3.connect("./database.db")
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM bolsitas WHERE id_bolsita != 1')
    data = cursor.fetchall()
    conn.close()
    # Formatea los datos como una lista de diccionarios
    columns = ["ID","Dueño", "Color", "Ancho", "Selladas", "Sin_Sellar", "Total"]   
    df = pd.DataFrame(data, columns=columns) 
    
    # Excluir la columna "Color"
    df = df.drop(columns=["ID", "Dueño", "Color"])

    
    # Crear un buffer en memoria para guardar el archivo Excel
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Bolsitas')
   
    output.seek(0)
    
    #Enviar el archivo Excel como una respuesta de descarga
    return send_file(output, download_name="bolsitas_data.xlsx", as_attachment=True)

# Inicia el servidor
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050,debug=True)
    print('start')