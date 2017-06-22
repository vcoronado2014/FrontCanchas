
$(document).ready(function () {

    infuser.defaults.templateUrl = "templates";

    $('[data-toggle="tooltip"]').tooltip();

    $('#principal').hide();
    $('#loading').show();

    function TipoCanchaViewModel(dataSuperficie, dataTipoCancha, idRequest) {
        var data = [];
        data[0] = dataSuperficie;
        data[1] = dataTipoCancha;
        data[2] = [
            {Nombre: 'Metros', Id:0 },
            {Nombre: 'Centimetros', Id:1 }
        ];

        var self = this;
        self.superficies = data[0];
        self.medidas = data[2];

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
        guardar = function (element) {
            
            var tipoCancha = {
                Id: element.idElemento(),
                Nombre: element.frmNombre(),
                TpsId: $('#selectIdTipoSuperficie').val(),
                Largo: element.frmLargo(),
                Ancho: element.frmAncho(),
                TipoMedida: $('#selectIdTipoMedida').val(),
                CantidadJugadores: element.frmNumeroJugadores(),
                InstId: element.instId()
            }
            
            if (tipoCancha.Nombre != "")
            {
                var operacion = "PUT";
                if (self.esNuevo() == false)
                    operacion = "POST";
                    
                var guardarTipoCancha = jQuery.ajax({
                    url: ObtenerUrl('TipoCancha'),
                    type: operacion,
                    data: ko.toJSON(tipoCancha),
                    contentType: "application/json",
                    dataType: "json"
                });

               $.when(guardarTipoCancha).then(
                    function(dataGuardar){
                        swal({
                                title: "Guardado",
                                text: "El Registro ha sido guardado con éxito.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Ok",
                                cancelButtonText: "No, cancel plx!",
                                closeOnConfirm: false,
                                customClass: 'sweetalert-xs',
                                closeOnCancel: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    
                                    //EnviarMensajeSignalR('Se ha creado/modificado una nueva institución.', "ListarInstitucion.html", "1", sessionStorage.getItem("RolId"), result);
                                    window.location.href = "CrearTipoCancha.html?id=" + dataGuardar.Id;
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });

                    },
                    function (){
                        getNotify('error', 'Error', 'Error de Servidor.');        
                    },
                    function(){
                        //acá podemos quitar el elemento cargando
                        alert('quitar cargando');
                    }
                );
            }
            else
            {
                getNotify('error', 'Requerido', 'Nombre Requerido.');
            }

        }


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
        selectedSuperficie = data[1].TpsId;
        selectedMedida = data[1].TipoMedida,
        self.frmNombre = ko.observable(data[1].Nombre || "");
        self.frmLargo = ko.observable(data[1].Largo || 0);
        self.frmAncho = ko.observable(data[1].Ancho || 0);
        self.frmNumeroJugadores = ko.observable(data[1].CantidadJugadores || 0);


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
            if (dataTipoCancha[0].length == 0)
            {
                dataTipoCancha[0].Id = 0;
                dataTipoCancha[0].Nombre = '';
                dataTipoCancha[0].TpsId = 1;
                dataTipoCancha[0].Largo = 0;
                dataTipoCancha[0].Ancho = 0;
                dataTipoCancha[0].TipoMedida = 0;
                dataTipoCancha[0].CantidadJugadores = 0;
                dataTipoCancha[0].InstId = sessionStorage.getItem("InstId");
            }
            ko.applyBindings(new TipoCanchaViewModel(dataSuperficie[0], dataTipoCancha[0][0], idRequest));

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