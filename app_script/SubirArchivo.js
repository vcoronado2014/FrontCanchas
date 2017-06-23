$(document).ready(function () {

    infuser.defaults.templateUrl = "templates";

    $('[data-toggle="tooltip"]').tooltip();

    $('#principal').hide();
    $('#loading').show();

    function TipoCanchaViewModel(dataSuperficie, dataTipoCancha, idRequest) {

        data = [];
        var self = this;

        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));

        //manejo de la sesión
        self.iconoSesion = ko.observable('<i class="fa fa-sign-in"></i> Iniciar Sesión');
        if (sessionStorage.length > 0)
        {
            if (self.id != null && self.id() > 0)
            {
                self.iconoSesion = ko.observable('<i class="fa fa-close"></i> Cerrar Sesión');
            }
        }
        else
        {
            window.location.href = "index.html";
        }
        
        self.cerrarSesion = function(element){
            if (element.iconoSesion() == '<i class="fa fa-close"></i> Cerrar Sesión')
            {
                sessionStorage.clear();
                window.location.href = "index.html";

            }
        }

        //aplicar Menu
        Menu();
        //guardar

        //los valores que iran al formulario
        //si el idRequest = 0 es nuevo
        if (idRequest == '0')
        {
            self.esNuevo = ko.observable(true);
            self.titulo =  ko.observable('Crear ');
        }
        else{
            self.titulo =  ko.observable('Modificar ');
            self.esNuevo = ko.observable(false);
        }
        self.idElemento = ko.observable(idRequest);


        ko.mapping.fromJS(data, {}, self);
        


        $('#principal').show();
        $('#loading').hide();

    }
    //this.buyer = { name: 'Franklin', credits: 250 };
    var tipoCancha = [];
    var arrTipoSuperficie = [];
    var idRequest = getParameterByName('id');

    var obtenerTipoSuperficie = jQuery.ajax({
        url : ObtenerUrl('TipoSuperficie'),
        type: 'GET',
        dataType : "json"
    });

    var obtenerTipoCancha = jQuery.ajax({
        url : ObtenerUrlDos('TipoCancha') + '?id=' + idRequest,
        type: 'GET',
        dataType : "json"
    });

    $.when(obtenerTipoSuperficie, obtenerTipoCancha).then(
        function(dataSuperficie, dataTipoCancha){
            elem = document.getElementById('principal');
           
            ko.applyBindings(new TipoCanchaViewModel([], [], idRequest));

        },
        function (){
            //alguna ha fallado
            //alert('error');
            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
        }
    );

});