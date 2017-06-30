
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
            var filesUno = $("#txtArchivo").get(0).files;
            var fotoUno = "";
            if (filesUno.length > 0)
                fotoUno = filesUno[0].name;
            else{
                if (element.esNuevo() == false)
                {
                    fotoUno = element.frmFotoUnoOriginal;
                }
            }
            
            var filesDos = $("#txtArchivoDos").get(0).files;
            var fotoDos = "";
            if (filesDos.length > 0)
                fotoDos = filesDos[0].name;
            else{
                if (element.esNuevo() == false)
                {
                    fotoDos = element.frmFotoDosOriginal;
                }
            }


            var filesTres = $("#txtArchivoTres").get(0).files;
            var fotoTres = "";
            if (filesTres.length > 0)
                fotoTres = filesTres[0].name;
            else{
                if (element.esNuevo() == false)
                {
                    fotoTres = element.frmFotoTresOriginal;
                }
            }                                

            var tipoCancha = {
                Id: element.idElemento(),
                Nombre: element.frmNombre(),
                TicId: $('#selectIdTic').val(),
                ValorSegmento: element.frmValorSegmento(),
                DescuentoSegmento: element.frmDescuentoSegmento(),
                Disciplina: $('#selectIdDisciplina').val(),
                FotoUno: fotoUno,
                FotoDos: fotoDos,
                FotoTres: fotoTres,
                InstId: element.instId()
            }
            //los valores requeridos son Nombre, TicId y disciplina
            if (tipoCancha.Nombre == ""){
                getNotify('error', 'Requerido', 'Nombre Requerido.');
                return;
            }
            if (tipoCancha.TicId == null){
                getNotify('error', 'Requerido', 'Tipo Cancha Requerido.');
                return;
            }
            if (tipoCancha.Disciplina == null){
                getNotify('error', 'Requerido', 'Disciplina Requerida.');
                return;
            }
            //comenzamos con el guardado
            var operacion = "PUT";
            if (self.esNuevo() == false)
                operacion = "POST";

            var guardarCancha = jQuery.ajax({
                url: ObtenerUrl('Canchas'),
                type: operacion,
                data: ko.toJSON(tipoCancha),
                contentType: "application/json",
                dataType: "json"
            });            

               $.when(guardarCancha).then(
                    function(dataGuardar){
                        //antes de mostrar el mensaje de guardado se envían los archivos a guardar
                        SubirArchivo(element, filesUno);
                        SubirArchivo(element, filesDos);
                        SubirArchivo(element, filesTres);

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
                                    window.location.href = "ListarCanchas.html";
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

        //cancelar
        cancelar = function () {
            window.location.href = "ListarCanchas.html";
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
            iconoEliminarUno = ko.observable(true);
            $("#eliminarUno").attr("style", "visibility: visible");

            var imgtag = document.getElementById("imagenUno");
            imgtag.title = selectedFile.name;


            reader.onload = function (event) {
                element.frmFotoUno = event.target.result;
                imgtag.src = event.target.result;
            };
            extensiones_permitidas = new Array(".gif", ".jpg", ".png");
            if (ValidaExtension(selectedFile, extensiones_permitidas) == true)
                reader.readAsDataURL(selectedFile);
        }
        onFileSelectedDos = function (element, event) {
            var selectedFile = event.target.files[0];
            var reader = new FileReader();
            iconoEliminarDos = ko.observable(true);
            $("#eliminarDos").attr("style", "visibility: visible");

            var imgtag = document.getElementById("imagenDos");
            imgtag.title = selectedFile.name;


            reader.onload = function (event) {
                element.frmFotoDos = event.target.result;
                imgtag.src = event.target.result;
            };
            extensiones_permitidas = new Array(".gif", ".jpg", ".png");
            if (ValidaExtension(selectedFile, extensiones_permitidas) == true)
                reader.readAsDataURL(selectedFile);
        }
        onFileSelectedTres = function (element, event) {
            var selectedFile = event.target.files[0];
            var reader = new FileReader();
            iconoEliminarTres = ko.observable(true);
            $("#eliminarTres").attr("style", "visibility: visible");

            var imgtag = document.getElementById("imagenTres");
            imgtag.title = selectedFile.name;


            reader.onload = function (event) {
                element.frmFotoTres = event.target.result;
                imgtag.src = event.target.result;
            };
            extensiones_permitidas = new Array(".gif", ".jpg", ".png");         
            if (ValidaExtension(selectedFile, extensiones_permitidas) == true)
                reader.readAsDataURL(selectedFile);
        }
        onEliminarFoto = function (element, event){
            var idAccion = event.target.id;
            var imgtag;
            var txtElemento;
            var selectedFile = "";
            var reader = new FileReader();
            if (idAccion == 'eliminarUno'){
                imgtag = document.getElementById("imagenUno");
                txtElemento = document.getElementById("txtArchivo");
                $("#eliminarUno").attr("style", "visibility: hidden");
                element.frmFotoUnoOriginal = "";
                element.frmFotoUno = "";
            }
            if (idAccion == 'eliminarDos'){
                imgtag = document.getElementById("imagenDos");
                txtElemento = document.getElementById("txtArchivoDos");
                $("#eliminarDos").attr("style", "visibility: hidden");
                element.frmFotoDosOriginal = "";
                element.frmFotoDos = "";                
            }
            if (idAccion == 'eliminarTres'){
                imgtag = document.getElementById("imagenTres");
                txtElemento = document.getElementById("txtArchivoTres");
                $("#eliminarTres").attr("style", "visibility: hidden");
                element.frmFotoTresOriginal = "";
                element.frmFotoTres = "";                
            }

            if (txtElemento.files != null && txtElemento.files.length > 0){
                txtElemento.files[0].name = "";
                txtElemento.files[0] = null;
            }

            imgtag.src = "";
            imgtag.title = "Sin fotografía";

            if (element.esNuevo()){
                //llamada ajax.
                //reader.readAsDataURL(selectedFile);
            }
            else{
                //aplicar despues de la llamada para eliminar solo si es nuevo
                //reader.readAsDataURL(selectedFile);
                var tipoCancha = {
                    Id: element.idElemento(),
                    Nombre: element.frmNombre(),
                    TicId: $('#selectIdTic').val(),
                    ValorSegmento: element.frmValorSegmento(),
                    DescuentoSegmento: element.frmDescuentoSegmento(),
                    Disciplina: $('#selectIdDisciplina').val(),
                    FotoUno: element.frmFotoUnoOriginal,
                    FotoDos: element.frmFotoDosOriginal,
                    FotoTres: element.frmFotoTresOriginal,
                    InstId: element.instId()
                }
                //los valores requeridos son Nombre, TicId y disciplina
                if (tipoCancha.Nombre == "") {
                    getNotify('error', 'Requerido', 'Nombre Requerido.');
                    return;
                }
                if (tipoCancha.TicId == null) {
                    getNotify('error', 'Requerido', 'Tipo Cancha Requerido.');
                    return;
                }
                if (tipoCancha.Disciplina == null) {
                    getNotify('error', 'Requerido', 'Disciplina Requerida.');
                    return;
                }
                //comenzamos con el guardado
                var operacion = "PUT";
                if (element.esNuevo() == false)
                    operacion = "POST";
                //guardado
                var guardarCancha = jQuery.ajax({
                    url: ObtenerUrl('Canchas'),
                    type: operacion,
                    data: ko.toJSON(tipoCancha),
                    contentType: "application/json",
                    dataType: "json"
                });  

               $.when(guardarCancha).then(
                    function(dataGuardar){
                        //antes de mostrar el mensaje de guardado se envían los archivos a guardar

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
                                    window.location.href = "CrearCancha.html?id=" + dataGuardar.Id;
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });

                    },
                    function (){
                        getNotify('error', 'Error', 'Error de Servidor.');        
                    }
                ); 

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
        selectedTic = data[0].TicId;
        selectedDisciplina = data[0].Disciplina,
        self.frmNombre = ko.observable(data[0].Nombre || "");
        self.frmValorSegmento = ko.observable(data[0].ValorSegmento || 0);
        self.frmDescuentoSegmento = ko.observable(data[0].DescuentoSegmento || 0);
        self.frmFotoUnoOriginal = data[0].FotoUno;
        self.frmFotoDosOriginal = data[0].FotoDos;
        self.frmFotoTresOriginal = data[0].FotoTres;
        //foto 1
        if (data[0].FotoUno != ''){
            self.frmFotoUno = ObtenerUrlFoto() + ko.observable(data[0].FotoUno || "")();
            self.iconoEliminarUno = ko.observable(true);
        }
        else{
            self.frmFotoUno = '';
            self.iconoEliminarUno = ko.observable(false);
        }
        
        //foto 2
        if (data[0].FotoDos != ''){
            self.frmFotoDos = ObtenerUrlFoto() + ko.observable(data[0].FotoDos || "")();
            self.iconoEliminarDos = ko.observable(true);
        }
        else{
            self.frmFotoDos = '';
            self.iconoEliminarDos = ko.observable(false);
        }

        //foto 3
        if (data[0].FotoTres != ''){
            self.frmFotoTres = ObtenerUrlFoto() + ko.observable(data[0].FotoTres || "")();
            self.iconoEliminarTres = ko.observable(true);
        }
        else{
            self.frmFotoTres = '';
            self.iconoEliminarTres = ko.observable(false);
        }

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

    function SubirArchivo(element, file){
    
        if (file.length > 0) {
            var model = new FormData();
            model.append("Id", element.idElemento());
            model.append("UploadedImage", file[0]);

            var subirArchivoUno = jQuery.ajax({
                url: ObtenerUrl('Foto'),
                type: "POST",
                data: model,
                contentType: false,
                processData: false
            });
            //promesa
            $.when(subirArchivoUno).then(
                function (data) {
                    return "Ok";
                },
                function () {
                    getNotify('error', 'Error', 'Error de Servidor.');
                    return "Error";
                }
            );

        }
        else
            return "Ok";
    

    }

});