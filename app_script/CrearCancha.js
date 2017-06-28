
$(document).ready(function () {

    infuser.defaults.templateUrl = "templates";

    $('[data-toggle="tooltip"]').tooltip();

    $('#principal').hide();
    $('#loading').show();

    function CanchaViewModel(dataCanchas, dataTipoCancha, dataTipoSuperficie, idRequest) {
        var data = [];
        data[0] = dataCanchas;
        data[1] = dataTipoCancha;
        data[2] = [
            {Nombre: 'Futbolito', Id:1 },
            {Nombre: 'Fútbol', Id:2 },
            {Nombre: 'Baby-Fútbol', Id:3 },
            {Nombre: 'Fútbol Salón', Id:4 }
        ];
        data[3] = [
            {Nombre: 'Metros', Id:0 },
            {Nombre: 'Centimetros', Id:1 }
        ];

        var self = this;
        //self.tiposCanchas = ko.observableArray(data[1]);
        self.tiposCanchas = data[1];
        self.disciplinas = data[2];
        self.superficies = dataTipoSuperficie;
        self.medidas = data[3];

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
                TicId: $('#selectIdTic').val(),
                ValorSegmento: element.frmValorSegmento(),
                DescuentoSegmento: element.frmDescuentoSegmento(),
                Disciplina: $('#selectIdDisciplina').text(),
                //Ancho: element.frmAncho(),
                //TipoMedida: $('#selectIdTipoMedida').val(),
                //CantidadJugadores: element.frmNumeroJugadores(),
                InstId: element.instId()
            }
            /*
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
            */

        }

        //cancelar
        cancelar = function () {
            window.location.href = "ListarTiposCancha.html";
        }

        onChangeTic = function(element){
            var idTic = $('#selectIdTic').val();
            var tic = element.tiposCanchas.filter(x => x.Id == parseInt(idTic));
            if (tic != null && tic.length > 0)
            {
                var medida = element.medidas.filter(x => x.Id == parseInt(tic[0].TipoMedida));
                var superficie = element.superficies.filter(x => x.Id == parseInt(tic[0].TpsId));
                var info = 'Tipo Cancha: ' + tic[0].Nombre + ', Medidas: ' + tic[0].Largo + ' x ' + tic[0].Ancho;
                info +=  ' ' + medida[0].Nombre + ', Cantidad Jugadores: ' + tic[0].CantidadJugadores + ' ,Tipo Superficie: ' + superficie[0].Nombre;
                $('#infoTic').text(info);
            }

        }

        onFileSelectedUno = function(element, event){
            var selectedFile = event.target.files[0];
            var reader = new FileReader();

            var imgtag = document.getElementById("imagenUno");
            imgtag.title = selectedFile.name;


            reader.onload = function (event) {
                element.frmFotoUno = event.target.result;
                imgtag.src = event.target.result;
            };

            reader.readAsDataURL(selectedFile);
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
        selectedTic = data[0].TicId;
        selectedDisciplina = data[0].Disciplina,
        self.frmNombre = ko.observable(data[0].Nombre || "");
        self.frmValorSegmento = ko.observable(data[0].ValorSegmento || 0);
        self.frmDescuentoSegmento = ko.observable(data[0].DescuentoSegmento || 0);
        if (data[0].FotoUno != '')
            self.frmFotoUno = ObtenerUrlFoto() + ko.observable(data[0].FotoUno || "");
        else
            self.frmFotoUno = '';
        //seguir aca con las variables


        ko.mapping.fromJS(data, {}, self);
        


        $('#principal').show();
        $('#loading').hide();

    }
    //this.buyer = { name: 'Franklin', credits: 250 };
    var idRequest = getParameterByName('id');

    var obtenerCanchas= jQuery.ajax({
        url : ObtenerUrl('Canchas') +'?id=' + idRequest,
        type: 'GET',
        dataType : "json"
    });

    var obtenerTipoCancha = jQuery.ajax({
        url : ObtenerUrlDos('TipoCancha') + '?instId=' + sessionStorage.getItem("InstId"),
        type: 'GET',
        dataType : "json"
    });

    var obtenerTipoSuperficie = jQuery.ajax({
        url : ObtenerUrl('TipoSuperficie'),
        type: 'GET',
        dataType : "json"
    });

    $.when(obtenerCanchas, obtenerTipoCancha, obtenerTipoSuperficie).then(
        function(dataCanchas, dataTipoCancha, dataTipoSuperficie){
            elem = document.getElementById('principal');
            if (dataCanchas[0].length == 0)
            {
                dataCanchas[0].Id = 0;
                dataCanchas[0].Nombre = '';
                dataCanchas[0].TicId = 0;
                dataCanchas[0].FotoUno = '';
                //dataCanchas[0].FotoUno = ObtenerUrlFoto() + 'Fotos/cancha_1.jpg';
                dataCanchas[0].FotoDos = '';
                dataCanchas[0].FotoTres = '';
                dataCanchas[0].ValorSegmento = 0;
                dataCanchas[0].DescuentoSegmento = 0;
                dataCanchas[0].Disciplina = 1;
                dataCanchas[0].InstId = sessionStorage.getItem("InstId");
                ko.applyBindings(new CanchaViewModel(dataCanchas[0], dataTipoCancha[0], dataTipoSuperficie[0], idRequest));
            }
            else {
                ko.applyBindings(new CanchaViewModel(dataCanchas[0][0], dataTipoCancha[0], dataTipoSuperficie[0], idRequest));
            }
        },
        function (error){
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

/*
    function onFileSelected(event) {
        var selectedFile = event.target.files[0];
        var reader = new FileReader();

        //var imgtag = document.getElementById("myimage");
        //imgtag.title = selectedFile.name;


        reader.onload = function (event) {
            frmFotoUno = event.target.result;
        };

        reader.readAsDataURL(selectedFile);
    }
*/

});