const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

const mysql = require('mysql');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Middleware de configuración de Express para que pueda analizar las solicittudes entrandes con datos en formato JSON. La solicitud llega al servidor y permite que Express pueda analizar el cuerpo de la solicitud si está en formato JSON. Útil para solicitudes POST o PUT. 
  - app.use: Método de Express que se utiliza para montar el middleware y que tendrá acceso a los objetos de la solicitud ('req') y respuesta ('res').
  - express.json: Middleware específico de Express que se utiliza para analizar el cuerpo de las solicitudes entrantes en formato JSON. Cuando se llama a este método, analiza el cuerpo de la solicitud entrate y la convierte en un objeto JS que esta disponible como 'req.body'
 */
app.use(express.json());

//Construcción de ruta absoluta para devolver el fichero index de public.
const publicPath = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicPath));

//Conexión con la base de datos.
const pool = mysql.createPool({
  connectionLimit: 5,
  host: 'bhd6dwqtsiio1iixt8k1-mysql.services.clever-cloud.com',
  user: 'uauktkzal8nsouff',
  password: '98kJGKpZo8mazRSR9T4k',
  database: 'bhd6dwqtsiio1iixt8k1'
})

/* app.get('/', (req, res) => {
    // Lee el archivo JSON
    fs.readFile('../public/index.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el objeto JSON al cliente
        res.send(data);
    });
}); */

/* RUTAS */
app.get('/', (req, res) => {
  //Acceso a la ruta relativa de publicPath que es donde esta index.html
  try {
    res.sendFile(path.join(publicPath, 'index.html'));
    //Consultar a Crístian por que no devuelve este console.log. ¿Puede ser por motivos de asincronía de la función send.File?
    console.log('Enviado el archivo index.html');
  } catch (error) {
    console.error('Error al enviar el archivo HTML:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/alumnos', (req, res) => {
  //Acceso a la ruta relativa de publicPath que es donde esta index.html
  try {
    res.sendFile(path.join(publicPath, 'alumnos.html'));
  } catch (error) {
    console.error('Error al enviar el archivo HTML:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/centros', (req, res) => {
  //Acceso a la ruta relativa de publicPath que es donde esta index.html
  try {
    res.sendFile(path.join(publicPath, 'centros.html'));
  } catch (error) {
    console.error('Error al enviar el archivo HTML:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Funciones del servidor
//Obtener todos los alumnos:
app.get('/consultaalumnos', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * from Alumnos', (err, rows) => {
      connection.release() // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }

      // if(err) throw err
      /* console.log('Datos de alumnos son: \n', rows) */
    })
  })
})

//Obtener todos los cursos:
app.get('/consultacursos', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * from Cursos', (err, rows) => {
      connection.release() // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }

      // if(err) throw err
      /* console.log('Datos del curso son: \n', rows) */
    })
  })
})

//Obtener todos los centros:
app.get('/consultacentros', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * from Centros', (err, rows) => {
      connection.release() // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }

      // if(err) throw err
      /* console.log('Datos del curso son: \n', rows) */
    })
  })
})

/* Obtener alumnos por curso */
app.post('/consultaalumnocurso', (req, res) => {
  // Obtener el parámetro cursoId de la URL
  const cursoId = req.body.cursoId;
  var cursoSeleccionado = "";

  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    // Usar el parámetro cursoId en la consulta SQL
    connection.query(`SELECT Alumnos.nombre, Alumnos.apellidos, AlumnosCursos.aprobado
    FROM Alumnos
    INNER JOIN AlumnosCursos ON Alumnos.Id = AlumnosCursos.alumnoId
    INNER JOIN Cursos ON AlumnosCursos.cursoId = Cursos.cursoId
    WHERE Cursos.cursoId = ?`, [cursoId], (err, rows) => {
      connection.release() // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
        res.status(500).send('Error al realizar la consulta')
      }

      // if(err) throw err
      switch (cursoId) {
        case 1:
          cursoSeleccionado = 'Java';
          break;
        case 2:
          cursoSeleccionado = 'Python';
          break;
        case 3:
          cursoSeleccionado = 'PHP';
          break;
        case 4:
          cursoSeleccionado = 'JavaScript';
          break;
        case 5:
          cursoSeleccionado = 'CSS';
          break;
        case 6:
          cursoSeleccionado = 'HTML';
          break;
        case 7:
          cursoSeleccionado = 'SQL';
          break;
        case 8:
          cursoSeleccionado = 'Node';
          break;
        case 9:
          cursoSeleccionado = 'React';
          break;
        case 10:
          cursoSeleccionado = 'Angular';
          break;
        default:
          // Manejar un valor no válido
          console.error('ID de curso no válido:', cursoId);
          break;
      }
      console.log('Datos del curso de: ', cursoSeleccionado, ' \n', rows)
    })
  })
})

/* app.post('/insertarUsuario', (req, res) => {
  const { nombre, apellido, correo } = req.body;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '<PASSWORD>',
    database: 'usuarios'
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Conexión establecida');

    const sql = `INSERT INTO usuarios (nombre, apellido, correo) VALUES ('${nombre}', '${apellido}', '${correo}')`;

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
}); */

// Borrar alumno
app.delete('/eliminaralumno', (req, res) => {
  const { nombre, apellidos } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err
    connection.query('DELETE FROM Alumnos WHERE nombre = ? AND apellidos = ?', [nombre, apellidos], (err, result) => {
      connection.release(); // Devolver la conexión al pool

      if (err) {
        console.error('Error al eliminar alumno:', err);
        res.status(500).send('Error al eliminar alumno de la base de datos');
      } else {
        console.log('Alumno eliminado correctamente:', result);
        res.status(200).send('Alumno eliminado correctamente');
      }
    });
  });
});

app.post('/consultacentrospornombre', (req, res) => {
  const { centro } = req.body;
  console.log(req.body.centro);
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * from Centros WHERE nombre= ?',[centro], (err, rows) => {
      connection.release() // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }

      // if(err) throw err
      /* console.log('Datos del curso son: \n', rows) */
    })
  })
})

app.put('/modificarcentro', (req, res) => {
  const { nombre, direccion, cursos } = req.body;
  
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    
    console.log('connected as id ' + connection.threadId);
    
    // Verificar si el centro con el nombre especificado ya existe en la base de datos
    connection.query('SELECT * FROM Centros WHERE nombre = ?', [nombre], (err, rows) => {
      if (err) {
        connection.release();
        throw err;
      }
      
      if (rows.length === 0) {
        // El centro no existe, puedes insertarlo aquí si lo deseas
        console.log('El centro no existe, puedes insertarlo aquí si lo deseas');
      } else {
        // El centro existe, entonces procedemos a actualizarlo
        connection.query(
          'UPDATE Centros SET direccion = ?, cursos = ? WHERE nombre = ?',
          [direccion, cursos, nombre],
          (err, rows) => {
            connection.release(); // Devolver la conexión al pool
            
            if (err) {
              throw err;
            }
            
            console.log('Centro actualizado correctamente');
            res.send('Centro actualizado correctamente');
          }
        );
      }
    });
  });
})


app.listen(3000, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});

/* Cursos */
/* INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('Java','Aprende de lógica de programación con Java','Principiante');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('Python','Aprende de lógica de programación con Python','Principiante');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('PHP','Aprende Back-End con PHP','Intermedio');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('JavaScript','Aprende FullStack con JavaScript','Avanzado');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('CSS','Aprende a decorar tus páginas web con CSS','Intermedio');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('HTML','Aprende a hacer una página web sencilla','Principiante');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('SQL','Aprende a utilizar bases de datos relacionales utilziando SQL','Principiante');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('Node','Aprende a crear una aplicación web empleando Node','Avanzado');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('React','Aprende desarrollo web con React','Intermedio');
INSERT INTO `Cursos`(`nombre`, `descripcion`, `nivel`) VALUES ('Angular','Aprende desarrollo web con Angular','Principiante'); */



/* INSERT INTO `Centros`(`nombre`, `direccion`, `cursos`) VALUES ('MEDAC Albacete','C. Mariana Pineda, 20', 'Java, PHP, JavaScript, CSS, HTML, SQL, Node, React, Angular');
INSERT INTO `Centros`(`nombre`, `direccion`, `cursos`) VALUES ('IES Leonardo Da Vinci','Av. José Hernández de la Asunción, 2', 'Java, PHP, JavaScript, CSS, HTML, SQL');
INSERT INTO `Centros`(`nombre`, `direccion`, `cursos`) VALUES ('Escuela Superior de Ingeniería Informática','C. Paseo de los estudiantes, s/n', 'Java, Python, PHP, JavaScript, CSS, HTML, SQL, Node, React, Angular');
INSERT INTO `Centros`(`nombre`, `direccion`, `cursos`) VALUES ('UCAM',' Av. de los Jerónimos, 20', 'Python, JavaScript, CSS, HTML, SQL');
INSERT INTO `Centros`(`nombre`, `direccion`, `cursos`) VALUES ('IES Ingeniero de la Cierva','C. de la Iglesia, s/n', 'Java, PHP, CSS, HTML, SQL, Node'); */


/* ALTER TABLE nombre_de_tu_tabla AUTO_INCREMENT = 0; */
/* Alumnos 
INSERT INTO Alumnos(nombre, apellidos, cursos) VALUES
('Juan', 'González Martínez', 'Java, Python, JavaScript, CSS, HTML, SQL, Node, React, Angular'),
('María', 'López García', 'Python, PHP, CSS'),
('Carlos', 'Martínez Pérez', 'HTML, SQL, Node, React, Angular'),
('Laura', 'Sánchez Rodríguez', 'Java, JavaScript, React, Angular'),
('Pedro', 'Rodríguez Hernández', 'Python'),
('Ana', 'García López', 'Java, HTML, Node, Angular'),
('David', 'Fernández Ruiz', 'Python, CSS, React, Angular'),
('Sofía', 'Pérez Martínez', 'Java, SQL, Angular'),
('Elena', 'Moreno Sánchez', 'Python'),
('Miguel', 'Ruiz García', 'PHP, CSS, Angular'),
('Paula', 'Díaz Pérez', 'HTML, Node, React'),
('Pablo', 'Hernández López', 'Java'),
('Carmen', 'Jiménez Torres', 'JavaScript, CSS, Angular'),
('Javier', 'Romero Martínez', 'Java, PHP, HTML'),
('Lucía', 'Torres Gómez', 'Python, JavaScript, React'),
('Diego', 'Santos Martín', 'PHP, HTML, Node'),
('Sara', 'Gómez Fernández', 'Java'),
('Alejandro', 'Molina Navarro', 'Python, SQL, React'),
('Eva', 'Vázquez Sánchez', 'HTML, Node, Angular'),
('Jorge', 'Castro García', 'Java, Python, CSS'),
('Adriana', 'Ortega Ruiz', 'JavaScript, SQL, Angular'),
('Ismael', 'Navarro López', 'Java, PHP, React'),
('Natalia', 'Cruz Martínez', 'Python, CSS, Angular'),
('Raúl', 'López Fernández', 'Java, JavaScript, Node');
*/


/* AlumnosCursos 
INSERT INTO AlumnosCursos (alumnoId, cursoId, aprobado) VALUES
(1, 1, RAND() > 0.5),
(1, 2, RAND() > 0.5),
(1, 4, RAND() > 0.5),
(1, 5, RAND() > 0.5),
(1, 6, RAND() > 0.5),
(1, 7, RAND() > 0.5),
(1, 8, RAND() > 0.5),
(1, 9, RAND() > 0.5),
(1, 10, RAND() > 0.5),
(2, 2, RAND() > 0.5),
(2, 3, RAND() > 0.5),
(2, 5, RAND() > 0.5),
(3, 6, RAND() > 0.5),
(3, 7, RAND() > 0.5),
(3, 8, RAND() > 0.5),
(3, 9, RAND() > 0.5),
(3, 10, RAND() > 0.5),
(4, 1, RAND() > 0.5),
(4, 4, RAND() > 0.5),
(4, 9, RAND() > 0.5),
(4, 10, RAND() > 0.5),
(5, 2, RAND() > 0.5),
(6, 1, RAND() > 0.5),
(6, 6, RAND() > 0.5),
(6, 9, RAND() > 0.5),
(6, 10, RAND() > 0.5),
(7, 2, RAND() > 0.5),
(7, 5, RAND() > 0.5),
(7, 9, RAND() > 0.5),
(7, 10, RAND() > 0.5),
(8, 1, RAND() > 0.5),
(8, 7, RAND() > 0.5),
(8, 10, RAND() > 0.5),
(9, 2, RAND() > 0.5),
(10, 3, RAND() > 0.5),
(10, 5, RAND() > 0.5),
(10, 10, RAND() > 0.5),
(11, 6, RAND() > 0.5),
(11, 8, RAND() > 0.5),
(11, 9, RAND() > 0.5),
(12, 1, RAND() > 0.5),
(13, 4, RAND() > 0.5),
(13, 5, RAND() > 0.5),
(13, 10, RAND() > 0.5),
(14, 1, RAND() > 0.5),
(14, 3, RAND() > 0.5),
(14, 6, RAND() > 0.5),
(15, 2, RAND() > 0.5),
(15, 4, RAND() > 0.5),
(15, 9, RAND() > 0.5),
(16, 3, RAND() > 0.5),
(16, 6, RAND() > 0.5),
(16, 8, RAND() > 0.5),
(17, 1, RAND() > 0.5),
(18, 2, RAND() > 0.5),
(18, 7, RAND() > 0.5),
(18, 9, RAND() > 0.5),
(19, 6, RAND() > 0.5),
(19, 8, RAND() > 0.5),
(19, 10, RAND() > 0.5),
(20, 1, RAND() > 0.5),
(20, 3, RAND() > 0.5),
(20, 5, RAND() > 0.5),
(21, 4, RAND() > 0.5),
(21, 7, RAND() > 0.5),
(21, 10, RAND() > 0.5),
(22, 1, RAND() > 0.5),
(22, 3, RAND() > 0.5),
(22, 9, RAND() > 0.5),
(23, 2, RAND() > 0.5),
(23, 5, RAND() > 0.5),
(23, 10, RAND() > 0.5),
(24, 1, RAND() > 0.5),
(24, 4, RAND() > 0.5),
(24, 8, RAND() > 0.5);
*/