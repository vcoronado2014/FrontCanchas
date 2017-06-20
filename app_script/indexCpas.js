/**
 * Created by vcoronado on 05-05-2017.
 */
$(function () {

    //shouldShowMessage = ko.observable(false);
    //shouldShowMessageP = ko.observable(true);

    if (sessionStorage != null) {

        if (sessionStorage.getItem("Id") != null) {
            $('#ancoreSesion').html('<i class="fa fa-close"></i> Cerrar Sesión');
        }
        else {
            $('#ancoreSesion').html('<i class="fa fa-sign-in"></i> Iniciar Sesión');
            //window.location.href = "index.html";
            //return;
        }
    }


    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión')
        {
            //acá debe direccionarlo directamente al login y vaciar la variable de session

            if (sessionStorage.getItem("ES_CPAS") == "true")
            {
                //muestraArticulos = ko.observable(true);
                window.location.href = 'indexCpas.html';
            }
            else
            {
                window.location.href = 'index.html';
            }
            sessionStorage.clear();
            return;
        }
        else
        {
            //directo al login
            if (sessionStorage.getItem("ES_CPAS") == "true")
            {
                window.location.href = 'indexcpas.html';
            }
            else
            {
                window.location.href = 'index.html';
            }
        }


    });

    function ViewModel(vinculos, articulos, instituciones, configuracion, idUsuario) {
        var self = this;

        //nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        //self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        //nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        //self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));

        //si es un usuario logueado mostramos uno o el otro
        muestraArticulos = ko.observable(true);
        if (idUsuario > 0)
        {
            shouldShowMessage = ko.observable(true);
            shouldShowMessageP = ko.observable(false);
        }
        else
        {
            shouldShowMessage = ko.observable(false);
            shouldShowMessageP = ko.observable(true);
        }
        //ahora procesamos los arreglos
        if (vinculos.length < 30)
        {
            self.vinculosArr = [{
                ImagenVinculo1: '../img/icons/facebook.png',
                UrlVinculo1: 'https://www.facebook.com/cpas.cl/',
                TextoVinculo1: 'http://facebook.com/',
                ImagenVinculo2: '../img/icons/twitter.png',
                UrlVinculo2: 'https://twitter.com/CPAScl',
                TextoVinculo2: 'http://twitter.com',
                ImagenVinculo3: '../img/icons/email.png',
                UrlVinculo3: 'mailto:contacto@cpas.cl',
                TextoVinculo3: 'contacto@cpas.cl'

            }]
        }
        else
        {
            self.vinculosArr = JSON.parse(vinculos);
        }
        if (articulos.length < 30)
        {
            self.articulosArr = [
                {
                UrlImagen: '../img/imgArticulo_1.png',
                Fecha: '14-12-2015',
                Titulo: '¿QUIENES SOMOS?',
                Contenido: 'Una plataforma de gestión para los centros de padres y apoderados de cualquier tipo de instituciones o establecimiento. El foco fundamental esta centrado en la gestión de las actividades del centro de padres y la trasnparencia de los estados de cuentas y flujos economicos producto de la gestion del centro de padres y apoderados.'

                },
                {
                    UrlImagen: '../img/imgArticulo_2.png',
                    Fecha: '14-12-2015',
                    Titulo: 'NUESTRA VISIÓN',
                    Contenido: 'Ser la mejor mejor herramienta de gestión y transparencia para los centros de padres y apoderados asi también un mecanismo moderno de interacción educativa entre los establecimientos y la comunidad estudiantil.'

                },
                {
                    UrlImagen: '../img/imgArticulo_3.png',
                    Fecha: '14-12-2015',
                    Titulo: 'NUESTROS SERVICIOS',
                    Contenido: 'Nuestro servico consta de perfiles y roles de acuerdo a la orgánica de administración de los centros de padres y apoderados así como también un canal directo de transparencia e información al apoderado y el establecimiento.'

                }

            ];
            muestraArticulos = ko.observable(true);
        }
        else
        {
            self.articulosArr = JSON.parse(articulos);
            //acá debe mostrar los articulos
            muestraArticulos = ko.observable(true);

        }

        if (instituciones == null)
        {
            self.institucionesArr = {
                Direccion: 'Prueba',
                Telefono: '+56 9 85006988'
            };
        }
        else
        {
            self.institucionesArr = JSON.parse(instituciones);
        }

        if (configuracion == null)
        {
            self.configuracionArr = {
                MuestraSlide: 1
            };
        }
        else
        {
            self.configuracionArr = JSON.parse(configuracion);

        }

        if (self.configuracionArr.MuestraSlide == 1) {
            muestraSlide = ko.observable(true);
            $('#main-articulos').removeClass('slideSuperior');
        }
        else {
            muestraSlide = ko.observable(false);
            $('#main-articulos').addClass('slideSuperior');
        }

        shouldShowMessage = ko.observable(true);
        shouldShowMessageP = ko.observable(false);
        Menu();

        ko.mapping.fromJS(self.vinculosArr, self.articulosArr, self.institucionesArr, self.configuracionArr, {}, self);

    }
    var vinculos = [];
    var articulos = [];
    var instituciones = null;
    var configuracion = null;

    var idUsuario = 0;
    if (sessionStorage.getItem("vinculos") != null)
        vinculos = sessionStorage.getItem("vinculos");
    if (sessionStorage.getItem("articulos") != null)
        articulos = sessionStorage.getItem("articulos");
    if (sessionStorage.getItem("instituciones") != null)
        instituciones = sessionStorage.getItem("instituciones");
    if (sessionStorage.getItem("configuracion") != null)
        configuracion = sessionStorage.getItem("configuracion");
    if (sessionStorage.getItem("Id") != null)
        idUsuario = sessionStorage.getItem("Id");



    ko.applyBindings(new ViewModel(vinculos, articulos, instituciones, configuracion, idUsuario));


    function Menu()
    {
        //ahora procesamos a variable de session
        //rescatamos el rol desde la variable de session
        //antes evaluamos si esta variable existe
        if (sessionStorage.length > 0)
        {
            var rolId = sessionStorage.getItem("RolId");
            if (rolId != null)
            {
                shouldShowMessage = ko.observable(false);
                //ahora procesamos el menu
                menuMenu = ko.observable(false);
                //hijos
                menuMenuUsuarios = ko.observable(false);
                menuMenuInstituciones = ko.observable(false);
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
                switch(rolId)
                {
                    //super
                    case '1':
                        shouldShowMessage = ko.observable(true);

                        menuMenu = ko.observable(true);
                        menuMenuUsuarios = ko.observable(true);
                        menuMenuInstituciones = ko.observable(true);
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
                        break;
                    //administrador centro educacional
                    case '2':
                        shouldShowMessage = ko.observable(true);

                        menuMenu = ko.observable(true);
                        menuMenuUsuarios = ko.observable(true);
                        //menuMenuInstituciones = ko.observable(true);
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
                        break;
                    //presidente
                    case '3':
                    case '6':
                        shouldShowMessage = ko.observable(true);

                        menuMenu = ko.observable(true);
                        menuMenuUsuarios = ko.observable(true);
                        //menuMenuInstituciones = ko.observable(true);
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
                        break;
                    //tesorero, secretario
                    case '4':
                    case '5':
                        //shouldShowMessage = ko.observable(true);
                        shouldShowMessage = ko.observable(true);
                        menuMenu = ko.observable(true);
                        menuMenuDocumentos = ko.observable(true);
                        menuMenuCalendarrio = ko.observable(true);
                        //menuTricel = ko.observable(true);
                        //menuTricelListar = ko.observable(true);
                        menuProyecto = ko.observable(true);
                        menuProyectoListar = ko.observable(true);
                        menuMenuReportes = ko.observable(true);
                        break;
                    default:
                        shouldShowMessage = ko.observable(true);

                        menuMenu = ko.observable(true);
                        menuMenuRendiciones = ko.observable(true);
                        menuMenuDocumentos = ko.observable(true);
                        menuMenuCalendarrio = ko.observable(true);
                        break;
                }


            }
        }
        else
        {
            shouldShowMessage = ko.observable(false);
            shouldShowMessageP = ko.observable(true);
            //ahora procesamos el menu
            menuMenu = ko.observable(true);
            //hijos
            menuMenuUsuarios = ko.observable(false);
            menuMenuInstituciones = ko.observable(false);
            menuMenuRendiciones = ko.observable(true);
            menuMenuDocumentos = ko.observable(true);
            menuMenuCalendarrio = ko.observable(true);
            menuMenuCargaMasiva = ko.observable(true);
            //tricel
            menuTricel = ko.observable(false);
            //hijo
            menuTricelListar = ko.observable(false);
            //proyecto
            menuProyecto = ko.observable(false);
            //hijo
            menuProyectoListar = ko.observable(false);
            menuLogs = ko.observable(false);
            menuMenuReportes = ko.observable(false);
        }


    }

});