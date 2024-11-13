const express = require('express');
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const colors = require('colors');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer'); // Para manejar la carga de archivos


const app = express();

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT;


const SESSION_FILE_PATH = './session.json';

let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}


app.get('/descargar', (req, res) => {
  const file = path.join(__dirname, 'numerosNo.json');
  res.download(file);  // Descarga el archivo
});



const client = new Client({
  puppeteer: {
    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    handleSIGINT: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new LocalAuth({ clientId: "Client-one" }),
  // webVersionCache: {
  //   type: 'remote',
  //   remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2413.51-beta.html '
  // }
});


process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  await client.destroy();
  process.exit(0);
})





client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});




client.on('authenticated', (session) => {
  console.log('Conexión exitosa');
  sessionData = session;
  if (sessionData) {
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
          if (err) {
              console.error(err);
          }
      });
  }
});





  // const mediaFilemp3 = MessageMedia.fromFilePath(`./public/media/${'image.mp3'}`)
  // const mediaFilemp4 = MessageMedia.fromFilePath(`./public/media/${'1.mp4'}`)
 // const mediaFilejpg = MessageMedia.fromFilePath(`./public/media/${'1.png'}`)


let MSGbien = null; // inicia el Mensaje de bienvenida
let etapa = 0;

const registro = {

  '573026084428@c.us': { etapa: 100, numeroDocumento: '' },
  '573125178454@c.us': { etapa: 100, numeroDocumento: '' },
  '573026084444@c.us': { etapa: 100, numeroDocumento: '' },
  '573164205039@c.us': { etapa: 100, numeroDocumento: '' },

}; // Registra los numeros telefono que inician al programa 

// setInterval(() => {
//   console.log(registro)
// }, 5000);



client.on('message', async (message) => {
  console.log(`Mensaje recibido de ${message.from}: ${message.body}`);



  setInterval(() => {
    client.sendMessage('573128284306@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573016578618@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573024572102@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573215759412@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573003290088@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573224135504@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573209138009@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    client.sendMessage('573132502527@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
    //client.sendMessage('573128284306@c.us', 'Este es un mensaje de prueba para monitorear el robot.');
  }, 3600000); // 3000 milisegundos = 3 segundos





});


// Desde aqui inica el cargue de la imagen al servidor 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public/media');
    // Asegúrate de que el directorio exista
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Directorio de destino para las imágenes
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = 'image' + extname;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filePath = path.join(__dirname, 'public/media', 'image' + path.extname(file.originalname));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    cb(null, true);
  },
});

// Configurar la carpeta 'public/media' como estática
app.use('/media', express.static(path.join(__dirname, 'public/media')));

app.post('/upload', upload.single('image'), (req, res) => {
  const successMessage = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      #popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        text-align: center;
        max-width: 90%;
        width: 400px;
        z-index: 1000;
      }
      #popup p {
        color: #007BFF; /* Color azul */
        font-size: 18px;
        margin-bottom: 10px;
      }
      #popup img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin-bottom: 20px;
      }
      #popup button {
        background-color: #007BFF; /* Color azul */
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }
      #popup button:hover {
        background-color: #0056b3; /* Azul más oscuro al pasar el ratón */
      }
      #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }
    </style>
  </head>
  <body>
    <div id="overlay"></div>
    <div id="popup">
      <p>Imagen cargada con éxito</p>
      <img src="/media/${req.file.filename}" alt="Imagen subida">
      <button onclick="closePopup()">Cerrar</button>
    </div>
    <script>
      function closePopup() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        window.location.href = '/'; // Cambia esto al URL de tu página
      }
    </script>
  </body>
  </html>
`;
  res.send(successMessage);
});



// 



let MSGenvio = true;




// Desde aqui Robot de envio Mesivo

client.on('auth_failure', (msg) => {
  console.error('Error de autenticación:', msg);
  sessionStatus = 'Es necesario inciar sesión'; 
});

client.on('ready', () => {
  console.log('Cliente listo');
  sessionStatus = 'Cliente Conectado';
});

client.initialize();


app.get('/session-status', (req, res) => {
  res.json({ status: sessionStatus });
});

// Nueva ruta para enviar el QR en formato JSON
app.get('/qr', (req, res) => {
  if (qrCodeBase64) {
    res.json({ qrCode: qrCodeBase64 });
  } else {
    res.status(503).json({ error: 'QR aún no generado. Inténtalo de nuevo.' });
  }
});


app.use(bodyParser.json()); // Usar body-parser para analizar JSON
app.use(bodyParser.urlencoded({ extended: true })); // Usar body-parser para analizar datos codificados en URL

// Array para almacenar los registros de mensajes enviados
const registros = [];

// app.get('/', (req, res) => {
//   res.sendFile('index.html');
//  });


app.post('/procesar', (req, res) => {
  const { numbers, messages } = req.body;

  console.log('Números de Teléfono:', numbers);
  console.log('Mensajes:', messages);

  if (!numbers || !messages) {
    res.status(400).send('Los datos enviados no son válidos.');
    return;
  }

  if (!Array.isArray(numbers) || !Array.isArray(messages)) {
    res.status(400).send('Los datos enviados no son válidos.');
    return;
  }



  const sendMedia = async (to, file) => {
    try {
      const mediaFile = MessageMedia.fromFilePath(`public/media/${file}`);
      await client.sendMessage(to, mediaFile);
    } catch (error) {
      console.error(`Error al enviar el archivo multimedia: ${error.message}`);
    }
  };
  
  // ///////////////////////////////////////
  
  let messageCounter = 0;

  app.post('/cambiar', (req, res) => {
    MSGenvio = !MSGenvio; // Cambiamos el valor de MSGenvio
    res.json({ MSGenvio });
  });
  
 
  
  


// Función para guardar en JSON
function guardarRegistroEnJSON(registros) {
  fs.writeFileSync(registroPath, JSON.stringify(registros, null, 2), 'utf-8');
}

// Lee el archivo JSON (si existe), de lo contrario crea uno nuevo
function leerRegistroDesdeJSON() {
  if (fs.existsSync(registroPath)) {
    const data = fs.readFileSync(registroPath, 'utf-8');
    return JSON.parse(data);
  } else {
    return []; // Si el archivo no existe, retorna un array vacío
  }
}

app.use(express.json());

// Cargar los registros existentes (si los hay)
let registros = leerRegistroDesdeJSON();

numbers.forEach((phoneNumber, index) => {
  const phoneNumberWithSuffix = `${phoneNumber}@c.us`;
  const message = messages[index] || ""; // Asigna una cadena vacía si el mensaje no está presente para ese número

  setTimeout(async () => {
    try {
      if (MSGenvio) {
        await sendMedia(phoneNumberWithSuffix, 'image.jpg');
      }
      await client.sendMessage(phoneNumberWithSuffix, message);

      // Crear el registro del mensaje
      const registro = {
        numero: phoneNumberWithSuffix,
        mensajes: [
          {
            mensaje: message,
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Añadir el registro al array de registros
      registros.push(registro);
      console.log(`Mensaje ${messageCounter} enviado a ${phoneNumberWithSuffix}`.green);

      // Guardar los registros en el archivo JSON después de cada envío
      guardarRegistroEnJSON(registros);

      // Verifica si estás en el último elemento del array
      if (index === numbers.length - 1) {
        registros.push({ mensaje: 'Terminé de enviar los mensajes', numero: 'Oprima el botón para borrar el registro' });
        console.log('Terminé de enviar');
        guardarRegistroEnJSON(registros); // Guardar los registros de nuevo
      }
    } catch (error) {
      console.log(`Error al enviar el mensaje a ${phoneNumberWithSuffix}: ${error.message}`.red);
    }
  }, 15000 * (index + 1));
});



  res.status(200).send('Datos recibidos correctamente');


  app.get('/registros', (req, res) => {
    const ultimosRegistros = registros.slice(-10); // Obtener los últimos 10 registros

    res.json(ultimosRegistros); // Enviar los últimos 10 registros como respuesta en formato JSON
  });

});

// Ruta para borrar los registros
app.delete('/borrar-registros', (req, res) => {
  registros.length = 0; // Borra todos los registros
  res.json({ message: 'Registros borrados exitosamente' });
});






app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});