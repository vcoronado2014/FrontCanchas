﻿
$('#ancoreSesion').on('click', function () {
    if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión')
    {
        //acá debe direccionarlo directamente al login y vaciar la variable de session
        window.location.href = 'index.html';

        sessionStorage.clear();
        return;
    }
    else
    {
        //directo al login
        window.location.href = 'index.html';

    }


});

function ObtenerUrlFoto()
{
    //return 'https://localhost:44364/api/' + api;
    //return 'http://api.asambleas.cl/api/' + api;
    return 'http://localhost:64569/Fotos/';
    //http://172.16.116.138/apiasambleas/api/
}

function ObtenerUrl(api)
{
    //return 'https://localhost:44364/api/' + api;
    //return 'http://api.asambleas.cl/api/' + api;
    return 'http://localhost:64569/api/' + api;
    //http://172.16.116.138/apiasambleas/api/
}
﻿function ObtenerUrlDos(api)
{
    //return 'https://localhost:44334/api/' + api;
    //return 'http://vcoronado-001-site8.dtempurl.com/api/' + api;
    return 'http://localhost:64569/api/' + api;
    //http://172.16.116.138/apiasambleas/api/
}
﻿function ObtenerUrlSignalR()
{
    //return 'http://vcoronado-001-site8.dtempurl.com/api/' + api;
    return "http://localhost:34080/signalr/hubs";
    //http://172.16.116.138/apiasambleas/api/
}
function getParameterByName(name, url) {

    //// query string: ?foo=lorem&bar=&baz
    //var foo = getParameterByName('foo'); // "lorem"
    //var bar = getParameterByName('bar'); // "" (present with empty value)
    //var baz = getParameterByName('baz'); // "" (present with no value)
    //var qux = getParameterByName('qux'); // null (absent)

    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getNotify(type, title, message) {
    if (type == 'error') {
        new PNotify({
            title: title,
            text: message,
            type: 'error'
        });
    }
    if (type == 'success') {
        new PNotify({
            title: title,
            text: message,
            icon: 'glyphicon glyphicon-ok'
        });
    }
}

//
// Validador de Rut
// Descargado desde http://www.juque.cl/
//
function revisarDigito(dvr) {
    dv = dvr + ""
    if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') {
        //alert("Debe ingresar un digito verificador valido");
        getNotify('error', 'Dígito verificador', 'Debe ingresar un digito verificador valido.');
        return false;
    }
    return true;
}

function revisarDigito2(crut) {
    largo = crut.length;
    if (largo < 2) {
        //alert("Debe ingresar el rut completo")
        getNotify('error', 'Incompleto', 'Debe ingresar el rut completo.');
        return false;
    }
    if (largo > 2)
        rut = crut.substring(0, largo - 1);
    else
        rut = crut.charAt(0);
    dv = crut.charAt(largo - 1);
    revisarDigito(dv);

    if (rut == null || dv == null)
        return 0

    var dvr = '0'
    suma = 0
    mul = 2

    for (i = rut.length - 1 ; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul
        if (mul == 7)
            mul = 2
        else
            mul++
    }
    res = suma % 11
    if (res == 1)
        dvr = 'k'
    else if (res == 0)
        dvr = '0'
    else {
        dvi = 11 - res
        dvr = dvi + ""
    }
    if (dvr != dv.toLowerCase()) {
        //alert("EL rut es incorrecto")
        getNotify('error', 'Incorrecto', 'El Rut es Incorrecto.');
        return false
    }

    return true
}

function Rut(texto) {
    var tmpstr = "";
    for (i = 0; i < texto.length ; i++)
        if (texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-')
            tmpstr = tmpstr + texto.charAt(i);
    texto = tmpstr;
    largo = texto.length;

    if (largo < 2) {
        //alert("Debe ingresar el rut completo")
        getNotify('error', 'Incompleto', 'Rut Incompleto.');
        return false;
    }

    for (i = 0; i < largo ; i++) {
        if (texto.charAt(i) != "0" && texto.charAt(i) != "1" && texto.charAt(i) != "2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) != "5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) != "8" && texto.charAt(i) != "9" && texto.charAt(i) != "k" && texto.charAt(i) != "K") {
            //alert("El valor ingresado no corresponde a un R.U.T valido");
            getNotify('error', 'Inválido', 'El Rut es Inválido.');
            return false;
        }
    }

    var invertido = "";
    for (i = (largo - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + texto.charAt(i);
    var dtexto = "";
    dtexto = dtexto + invertido.charAt(0);
    dtexto = dtexto + '-';
    cnt = 0;

    for (i = 1, j = 2; i < largo; i++, j++) {
        //alert("i=[" + i + "] j=[" + j +"]" );
        if (cnt == 3) {
            dtexto = dtexto + '.';
            j++;
            dtexto = dtexto + invertido.charAt(i);
            cnt = 1;
        }
        else {
            dtexto = dtexto + invertido.charAt(i);
            cnt++;
        }
    }

    invertido = "";
    for (i = (dtexto.length - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + dtexto.charAt(i);

    //window.document.form1.rut.value = invertido.toUpperCase()

    if (revisarDigito2(texto))
        return true;

    return false;
}
function validarEmail(email) {
    var retorno = true;
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email)) {
        getNotify('error', 'Email', "La dirección de correo " + email + " es incorrecta.")
        //alert("Error: La dirección de correo " + email + " es incorrecta.");
        retorno = false;
    }
    return retorno;
}

function Menu()
{
    //ahora procesamos a variable de session
    //rescatamos el rol desde la variable de session
    //antes evaluamos si esta variable existe
    /*
<ol class="breadcrumb breadcrumb-arrow">
    <li><a href="#">Menu</a></li>
    <li class="active-bread"><span>Data</span></li>

</ol>

    */
    

    var breadcrumb = '<li><a href="#"><i class="fa fa-home"></i> Inicio</a></li>';

    var urlActual = location.href;
    if (urlActual.indexOf("Inicio.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Inicio</span></li>';
    }
    if (urlActual.indexOf("ListarCanchas.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Mis Canchas</span></li>';
    }
    if (urlActual.indexOf("ListarTiposCancha.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Tipos de Cancha</span></li>';
    }
    if (urlActual.indexOf("CrearCancha.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Mis Canchas</span></li>';
    }
    if (urlActual.indexOf("CrearTipoCancha.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Tipos de Cancha</span></li>';
    }
    if (urlActual.indexOf("Contacto.html") !=-1) {
        breadcrumb += '<li class="active-bread"><span>Contacto</span></li>';
    }    
    $('#olMenu').append(breadcrumb);
    //mostramos el elemento

    if (sessionStorage != null)
    {
        var rolId = sessionStorage.getItem("RolId");
        permitirCrear = ko.observable(false);
        if (rolId != null)
        {
            shouldShowMessage = ko.observable(false);
            //ahora procesamos el menu
            menuMenu = ko.observable(false);
            //hijos
            menuMenuUsuarios = ko.observable(false);
            menuMenuInstituciones = ko.observable(false);
            /*
            menuMenuRendiciones = ko.observable(false);
            menuMenuDocumentos = ko.observable(false);
            menuMenuCalendarrio = ko.observable(false);
            menuMenuCargaMasiva = ko.observable(false);
            menuMenuReportes = ko.observable(false);
            //tricel
            menuTricel = ko.observable(false);
            //hijo
            menuTricelListar = ko.observable(false);
            //proyecto
            menuProyecto = ko.observable(false);
            //hijo
            menuProyectoListar = ko.observable(false);
            menuLogs = ko.observable(false);
            //mostrar reporte Usuarios
            mostrarRptUsuarios = ko.observable(false);
            //mostrar reporte instituciones
            mostrarRptInstituciones = ko.observable(false);
            */
            switch(rolId)
            {
                //super
                case '1':
                    shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    menuMenuInstituciones = ko.observable(true);
                    /*
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    menuTricel = ko.observable(true);
                    menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    menuMenuCargaMasiva = ko.observable(true);
                    menuMenuReportes = ko.observable(true);
                    menuLogs = ko.observable(true);
                    //mostrar reporte Usuarios
                    mostrarRptUsuarios = ko.observable(true);
                    //mostrar reporte instituciones
                    mostrarRptInstituciones = ko.observable(true);
                    */
                    permitirCrear = ko.observable(true);            
                    break;
                //administrador centro educacional
                case '2':
                    shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    //menuMenuInstituciones = ko.observable(true);
                    /*
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    menuTricel = ko.observable(true);
                    menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    menuMenuCargaMasiva = ko.observable(true);
                    menuMenuReportes = ko.observable(true);
                    //mostrar reporte Usuarios
                    mostrarRptUsuarios = ko.observable(true);
                    */
                    permitirCrear = ko.observable(true);
                    break;
                //presidente
                case '3':
                case '6':
                    shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    //menuMenuInstituciones = ko.observable(true);
                    /*
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    //menuTricel = ko.observable(true);
                    //menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    menuMenuCargaMasiva = ko.observable(true);
                    menuMenuReportes = ko.observable(true);
                    //mostrar reporte Usuarios
                    mostrarRptUsuarios = ko.observable(true);
                    */
                    permitirCrear = ko.observable(true);
                    break;
                //tesorero, secretario
                case '4':
                case '5':
                    //shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    /*
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    //menuTricel = ko.observable(true);
                    //menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    menuMenuReportes = ko.observable(true);
                    */
                    permitirCrear = ko.observable(true);
                    break;
                default:
                    menuMenu = ko.observable(true);
                    /*
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    */
                    break;
            }


        }
        else
        {
            shouldShowMessage = ko.observable(false);
            //ahora procesamos el menu
            menuMenu = ko.observable(false);
            //hijos
            menuMenuUsuarios = ko.observable(false);
            menuMenuInstituciones = ko.observable(false);
            /*
            menuMenuRendiciones = ko.observable(false);
            menuMenuDocumentos = ko.observable(false);
            menuMenuCalendarrio = ko.observable(false);
            menuMenuCargaMasiva = ko.observable(false);
            menuMenuReportes = ko.observable(false);
            //tricel
            menuTricel = ko.observable(false);
            //hijo
            menuTricelListar = ko.observable(false);
            //proyecto
            menuProyecto = ko.observable(false);
            //hijo
            menuProyectoListar = ko.observable(false);
            menuLogs = ko.observable(false);
            //mostrar reporte Usuarios
            mostrarRptUsuarios = ko.observable(false);
            //mostrar reporte instituciones
            mostrarRptInstituciones = ko.observable(false);
            */
        }
    }
    else
    {
            shouldShowMessage = ko.observable(false);
            //ahora procesamos el menu
            menuMenu = ko.observable(false);
            //hijos
            menuMenuUsuarios = ko.observable(false);
            menuMenuInstituciones = ko.observable(false);
            /*
            menuMenuRendiciones = ko.observable(false);
            menuMenuDocumentos = ko.observable(false);
            menuMenuCalendarrio = ko.observable(false);
            menuMenuCargaMasiva = ko.observable(false);
            menuMenuReportes = ko.observable(false);
            //tricel
            menuTricel = ko.observable(false);
            //hijo
            menuTricelListar = ko.observable(false);
            //proyecto
            menuProyecto = ko.observable(false);
            //hijo
            menuProyectoListar = ko.observable(false);
            menuLogs = ko.observable(false);
            //mostrar reporte Usuarios
            mostrarRptUsuarios = ko.observable(false);
            //mostrar reporte instituciones
            mostrarRptInstituciones = ko.observable(false);
            */
    }


}

function IrInicio()
{
    if (sessionStorage.getItem("ES_CPAS") == "true")
    {
        window.location.href = 'indexCpas.html';
    }
    else
    {
        window.location.href = 'index.html';
    }
}

function ValidaExtension(archivo, extensiones)
{
    extensiones_permitidas = extensiones;

    if (!archivo) {
        getNotify('error', 'Seleccione', 'Debe seleccionar un archivo válido.');
        return false;
    }
    else
    {
        var tamano = archivo.size;
        //màximo 3,5 mb
        if (tamano < 3670016) {

            extension = (archivo.name.substring(archivo.name.lastIndexOf("."))).toLowerCase();
            permitida = false;
            for (var i = 0; i < extensiones_permitidas.length; i++) {
                if (extensiones_permitidas[i] == extension) {
                    permitida = true;
                    break;
                }
            }
            if (!permitida) {
                //mierror = "Comprueba la extensión de los archivos a subir. \nSólo se pueden subir archivos con extensiones: " + extensiones_permitidas.join();
                getNotify('error', 'Extensión', 'La extensiòn del archivo no está permitida ' + extensiones_permitidas.join());
                return false;
            }else{
                //submito!
                return true;
            }

        }
        else
        {
            getNotify('error', 'Tamaño', 'El tamaño del archivo no puede superar el màximo permitido.');
            return false;

        }

    }

}

function FormatMiles(input)
{
    var retorno;
    var num = input.toString().replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        //input.value = num;
        retorno = num;
    }

    else{
        //alert('Solo se permiten numeros');
        //input.value = input.value.replace(/[^\d\.]*/g,'');
        retorno = input.toString().replace(/[^\d\.]*/g,'');
    }
    return retorno;
}

function FechaString(fechaC)
{
    var fecha = moment(fechaC);

    var annoTer = fecha.get('year');
    var mesTer = fecha.get('month') + 1;
    var diaTer = fecha.get('date');
    var horaTer = fecha.get('hour');
    var minutoTer = fecha.get('minute');

    if (diaTer < 10)
        diaTer = "0" + diaTer;

    if (mesTer < 10)
        mesTer = "0" + mesTer;

    if (horaTer < 10)
        horaTer = "0" + horaTer;

    if (minutoTer < 10)
        minutoTer = "0" + minutoTer;

    var terminoStr = diaTer + '-' + mesTer + '-' + annoTer + ' ' + horaTer + ':' + minutoTer;
    return terminoStr;

}
function FechaEntera(fechaC)
{
    var fecha = moment(fechaC);

    var annoTer = fecha.get('year');
    var mesTer = fecha.get('month') + 1;
    var diaTer = fecha.get('date');
    var horaTer = fecha.get('hour');
    var minutoTer = fecha.get('minute');

    if (diaTer < 10)
        diaTer = "0" + diaTer;

    if (mesTer < 10)
        mesTer = "0" + mesTer;

    if (horaTer < 10)
        horaTer = "0" + horaTer;

    if (minutoTer < 10)
        minutoTer = "0" + minutoTer;

    var terminoStr = annoTer + mesTer + diaTer;
    return parseInt(terminoStr);
}
function FechaEnteraStr(fechaStr)
{
    var parteUno = fechaStr.split('-');
    var parteDos = parteUno[2].split(' ');

    return parseInt(parteDos[0] + parteUno[1] + parteUno[0]);

}