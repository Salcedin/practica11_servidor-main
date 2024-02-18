$(document).ready(function () {

    $.ajax({
        url: '/consultaalumnos', // URL a la que se hace la solicitud
        method: 'GET', // Método HTTP de la solicitud (en este caso, GET)
        dataType: 'json', // Tipo de datos que se espera recibir del servidor (en este caso, JSON)
        success: function (data) {
            /* console.log('Datos recibidos del servidor:', data); */
            // Realizar acciones en función de los datos recibidos del servidor
            data.forEach(function (alumno) {
                var fila = '<tr>' +
                    '<td>' + alumno.id + '</td>' +
                    '<td>' + alumno.nombre + '</td>' +
                    '<td>' + alumno.apellidos + '</td>' +
                    '<td>' + + '</td>' +
                    '</tr>';
                $('#tablaUsuarios tbody').append(fila);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener datos del servidor:', error);
        }
    });

    // Ejemplo de cómo hacer una solicitud al hacer clic en un botón
    /* $('#miBoton').click(function() {
        $.ajax({
            url: '/ruta-del-servidor',
            method: 'POST', // Ejemplo de solicitud POST
            data: { dato: 'valor' }, // Datos a enviar al servidor (opcional)
            dataType: 'json',
            success: function(data) {
                console.log('Respuesta del servidor:', data);
                // Realizar acciones en función de la respuesta del servidor
            },
            error: function(xhr, status, error) {
                console.error('Error en la solicitud:', error);
            }
        });
    }); */

    /* Petición AJAX para recoger todos los CURSOS de la bbdd */
    $(document).ready(function () {
        $.ajax({
            url: '/consultacursos', // URL a la que se hace la solicitud
            method: 'GET', // Método HTTP de la solicitud (en este caso, GET)
            dataType: 'json', // Tipo de datos que se espera recibir del servidor (en este caso, JSON)
            success: function (data) {
                /* console.log('Datos recibidos del servidor:', data); */
                // Realizar acciones en función de los datos recibidos del servidor
                data.forEach(function (curso) {
                    var fila = '<tr>' +
                        '<td>' + curso.nombre + '</td>' +
                        '<td>' + curso.descripcion + '</td>' +
                        '<td>' + curso.nivel + '</td>'
                    '</tr>';
                    $('#tablaCursos tbody').append(fila);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener datos del servidor:', error);
            }
        });
    });


    /* Petición AJAX para recoger todos los CENTROS de la bbdd */
    $(document).ready(function () {
        $.ajax({
            url: '/consultacentros', // URL a la que se hace la solicitud
            method: 'GET', // Método HTTP de la solicitud (en este caso, GET)
            dataType: 'json', // Tipo de datos que se espera recibir del servidor (en este caso, JSON)
            success: function (data) {
                /* console.log('Datos recibidos del servidor:', data); */
                // Realizar acciones en función de los datos recibidos del servidor
                data.forEach(function (centro) {
                    var fila = '<tr>' +
                        '<td>' + centro.nombre + '</td>' +
                        '<td>' + centro.direccion + '</td>' +
                        '<td>' + centro.cursos + '</td>'
                    '</tr>';
                    $('#tablaCentros tbody').append(fila);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener datos del servidor:', error);
            }
        });
    });


    var botonMostrarAlumnos = $("#botonMostrarAlumnos");
    botonMostrarAlumnos.click(function () {
        var cursoSeleccionado = $("#cursos").val();
        console.log("Curso seleccionado:", cursoSeleccionado);
        // Aquí puedes agregar código para hacer la petición a tu base de datos y mostrar los alumnos del curso seleccionado

        switch (cursoSeleccionado) {
            case 'Java':
                idCurso = 1;
                break;
            case 'Python':
                idCurso = 2;
                break;
            case 'PHP':
                idCurso = 3;
                break;
            case 'JavaScript':
                idCurso = 4;
                break;
            case 'CSS':
                idCurso = 5;
                break;
            case 'HTML':
                idCurso = 6;
                break;
            case 'SQL':
                idCurso = 7;
                break;
            case 'Node':
                idCurso = 8;
                break;
            case 'React':
                idCurso = 9;
                break;
            case 'Angular':
                idCurso = 10;
                break;
            default:
                // Manejar un valor no válido
                console.error('Curso no válido:', cursoSeleccionado);
                break;
        }
        console.log("ID Curso: ", idCurso);

        console.log("Estoy entrando en mostrar alumnos");

        $.ajax({
            url: '/consultaalumnocurso/',
            method: 'POST',
            data: { cursoId: idCurso },
            /* data: { idCurso: idCurso },
            dataType: 'json', */
            success: function (response) {
                // Manejar la respuesta aquí, por ejemplo, mostrarla en la consola
                console.log(response);
                $('#tablaUsuarios2 tbody').empty();
                response.forEach(function (alumno) {
                    var estado = alumno.aprobado === 1 ? "Aprobado" : "Suspenso";
                    var fila = '<tr>' +
                        '<td>' + alumno.nombre + '</td>' +
                        '<td>' + alumno.apellidos + '</td>' +
                        '<td>' + estado + '</td>' +
                        '<td><button class="btn btn-danger btn-sm delete-alumno" data-nombre="' + alumno.nombre + '" data-apellidos="' + alumno.apellidos + '"><i class="fas fa-trash"></i>Borrar Alumno</button></td>' +
                        '</tr>';
                    $('#tablaUsuarios2 tbody').append(fila);
                });
            },
            error: function (xhr, status, error) {
                // Manejar errores aquí, por ejemplo, mostrar un mensaje de error
                console.error('Error en la petición Ajax:', error);
            }
        });
    });

    $(document).on('click', '.delete-alumno', function () {
        // Obtener nombre y apellidos del atributo de datos de la fila de la tabla
        var nombre = $(this).data('nombre');
        var apellidos = $(this).data('apellidos');
        console.log(nombre);
        console.log(apellidos);

        // Realizar la solicitud AJAX para eliminar al alumno del servidor
        $.ajax({
            url: '/eliminaralumno',
            method: 'DELETE',
            data: {
                nombre: nombre,
                apellidos: apellidos
            },
            success: function (response) {
                // Manejar la respuesta del servidor aquí, por ejemplo, recargar la página
                /* location.reload(); */
                $.ajax({
                    url: '/consultaalumnocurso',
                    method: 'POST',
                    data: { cursoId: idCurso },
                    /* data: { idCurso: idCurso },
                    dataType: 'json', */
                    success: function (response) {
                        // Manejar la respuesta aquí, por ejemplo, mostrarla en la consola
                        console.log(response);
                        $('#tablaUsuarios2 tbody').empty();
                        response.forEach(function (alumno) {
                            var estado = alumno.aprobado === 1 ? "Aprobado" : "Suspenso";
                            var fila = '<tr>' +
                                '<td>' + alumno.nombre + '</td>' +
                                '<td>' + alumno.apellidos + '</td>' +
                                '<td>' + estado + '</td>' +
                                '<td><button class="btn btn-danger btn-sm delete-alumno" data-nombre="' + alumno.nombre + '" data-apellidos="' + alumno.apellidos + '"><i class="fas fa-trash"></i>Borrar Alumno</button></td>' +
                                '</tr>';
                            $('#tablaUsuarios2 tbody').append(fila);
                        });
                    },
                    error: function (xhr, status, error) {
                        // Manejar errores aquí, por ejemplo, mostrar un mensaje de error
                        console.error('Error en la petición Ajax:', error);
                    }
                });
            },
            error: function (xhr, status, error) {
                // Manejar errores aquí, por ejemplo, mostrar un mensaje de error
                console.error('Error en la solicitud AJAX:', error);
            }
        });

    });

    $(document).on('click', '#botonMostrarCentro', function () {
        var valorCentro = $('#centro').val();
        var centroSeleccionado = "";
        console.log("Centro seleccionado:", valorCentro);
        switch (valorCentro) {
            case 'medac':
                centroSeleccionado = "MEDAC Albacete";
                break;
            case 'davinci':
                centroSeleccionado = "IES Leonardo Da Vinci";
                break;
            case 'informatica':
                centroSeleccionado = "Escuela Superior de Ingeniería Informática";
                break;
            case 'ucam':
                centroSeleccionado = "UCAM";
                break;
            case 'cierva':
                centroSeleccionado = "IES Ingeniero de la Cierva";
                break;
            default:
                // Manejar un valor no válido
                console.error('Curso no válido:', valorCentro);
                break;
        }

        // Realizar una solicitud AJAX para obtener los datos del centro
        $.ajax({
            url: '/consultacentrospornombre',
            method: 'POST',
            data: { centro: centroSeleccionado },
            success: function (data) {
                if (data.length > 0) {
                    var centro = data[0];
                    $('#nombreCentro').val(centro.nombre);
                    $('#direccionCentro').val(centro.direccion);
                    $('#cursosCentro').val(centro.cursos);
                } else {
                    // Manejar el caso en el que no se encuentren datos para el centro seleccionado
                    console.error('No se encontraron datos para el centro seleccionado');
                }
            }
        });

    })

    $(document).on('click', '#botonModificarCentro', function () {
        var nombreCentro = $('#nombreCentro').val();
        var direccionCentro = $('#direccionCentro').val();
        var cursosCentro = $('#cursosCentro').val();
        console.log(nombreCentro);
        console.log(direccionCentro);
        console.log(cursosCentro);

        // Realizar una solicitud AJAX para obtener los datos del centro
         $.ajax({
            url: '/modificarcentro',
            method: 'PUT',
            data: { nombre: nombreCentro, direccion: direccionCentro, cursos: cursosCentro},
            success: function (data) {
                if (data.length > 0) {
                    var centro = data[0];
                    $('#nombreCentro').val(centro.nombre);
                    $('#direccionCentro').val(centro.direccion);
                    $('#cursosCentro').val(centro.cursos);
                } else {
                    // Manejar el caso en el que no se encuentren datos para el centro seleccionado
                    console.error('No se encontraron datos para el centro seleccionado');
                }
            }
        }); 

    })

    /* document.addEventListener("DOMContentLoaded", function () {
        var botonMostrarAlumnos = document.getElementById("botonMostrarAlumnos");
        botonMostrarAlumnos.addEventListener("click", mostrarAlumnos);
        var cursoSeleccionado = document.getElementById("cursos").value;
        console.log=cursoSeleccionado;
        /* var idCurso; 
        // Aquí puedes agregar código para hacer la petición a tu base de datos y mostrar los alumnos del curso seleccionado
        console.log("Curso seleccionado:", cursoSeleccionado);
        // Por ahora, solo lo mostraremos en la consola del navegador

        switch (cursoSeleccionado) {
            case 'Java':
                idCurso = 1;
                break;
            case 'Python':
                idCurso = 2;
                break;
            case 'PHP':
                idCurso = 3;
                break;
            case 'JavaScript':
                idCurso = 4;
                break;
            case 'CSS':
                idCurso = 5;
                break;
            case 'HTML':
                idCurso = 6;
                break;
            case 'SQL':
                idCurso = 7;
                break;
            case 'Node':
                idCurso = 8;
                break;
            case 'React':
                idCurso = 9;
                break;
            case 'Angular':
                idCurso = 10;
                break;
            default:
                // Manejar un valor no válido
                console.error('Curso no válido:', cursoSeleccionado);
                break;
        }
    });
    function mostrarAlumnos() {
        console.log("Estoy entrando en mostrar alumnos");
        var idCurso;
        $.ajax({
            url: '/consultaalumnoscurso/' + idCurso,
            method: 'POST',
            success: function (response) {
                // Manejar la respuesta aquí, por ejemplo, mostrarla en la consola
                console.log(response);
            },
            error: function (xhr, status, error) {
                // Manejar errores aquí, por ejemplo, mostrar un mensaje de error
                console.error('Error en la petición Ajax:', error);
            }
        });
    }; */
});

