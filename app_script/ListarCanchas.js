/**
 * Created by VICTOR CORONADO on 29/06/2017.
 */

$(document).ready(function () {

    infuser.defaults.templateUrl = "templates";

    $('[data-toggle="tooltip"]').tooltip();

    $('#principal').hide();
    $('#loading').show();

    function TipoCanchaViewModel(data) {

        var self = this;

        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));

        //manejo de la sesión
        self.iconoSesion = ko.observable('<i class="fa fa-sign-in"></i> Iniciar Sesión');
        if (sessionStorage.length > 0){

            if (self.id != null && self.id() > 0)
            {
                self.iconoSesion = ko.observable('<i class="fa fa-close"></i> Cerrar Sesión');
            }
        }
        else{
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
        //eliminar
        eliminar = function (element){
            Elimina(element);
        }

        self.titulo =  ko.observable('Listar ');

        ko.mapping.fromJS(data, {}, self);

        $('#principal').show();
        $('#loading').hide();

    }

    //obtención de los datos
    var idRequest = sessionStorage.getItem("InstId");

    var obtenerCanchas = jQuery.ajax({
        url : ObtenerUrl('Canchas') + '?instId=' + idRequest,
        type: 'GET',
        dataType : "json"
    });

    $.when(obtenerCanchas).then(
        function(dataTipoCancha){
            elem = document.getElementById('principal');
            //acá hay que procesar la data ya adecuarla a la vista nueva


            var data = new Object();
            //data.proposals = dataTipoCancha;
            data.proposals = [];
            if (dataTipoCancha != null && dataTipoCancha.length > 0){
                for (var i in dataTipoCancha){
                    var s = {
                        Nombre: dataTipoCancha[i].Nombre,
                        UrlEditar: 'CrearCancha.html?id=' + dataTipoCancha[i].Id,
                        Id: dataTipoCancha[i].Id
                    }
                    data.proposals[i] = s;
                }
            }


            Cargar(data);


        },
        function (error){
            //alguna ha fallado
            //alert('error');
            var data = new Object();
            data.proposals = [];

            Cargar(data);

            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
        }
    );

    //cargar
    function Cargar(data){

        ko.applyBindings(new TipoCanchaViewModel(data));

        $("#proposals").DataTable({
            responsive: true,
            "bAutoWidth": false,
            "aoColumns": [
                { "sWidth": "20%" }, // 1st column width
                { "sWidth": "80%" }
            ],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "del _START_ al _END_  de _TOTAL_ registros",
                "sInfoEmpty": "del 0 al 0 de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "bDestroy": true,
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "<<",
                    "sLast": ">>",
                    "sNext": ">",
                    "sPrevious": "<"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    }

    //eliminar
    function Elimina(elemento){

        swal({
            title: "Eliminar",
            text: "¿Está seguro de eliminar " + elemento.Nombre() + "?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            customClass: 'sweetalert-xs',
            showLoaderOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {


                setTimeout(function () {

                    var eliminarTC = jQuery.ajax({
                        url : ObtenerUrl('Canchas'),
                        type: "DELETE",
                        data: ko.toJSON({ Id: elemento.Id() }),
                        contentType: "application/json",
                        dataType: "json"
                    });

                    $.when(eliminarTC).then(
                        function(dataEliminar){
                            //eliminado con exito
                            swal({
                                    title: "Eliminado",
                                    text: "El Registro ha sido eliminado con éxito.",
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

                                        //EnviarMensajeSignalR('Se ha eliminado una Proyecto.', "ListarProyecto.html", "4", sessionStorage.getItem("RolId"), dataF);
                                        window.location.href = "ListarCanchas.html";
                                    } else {
                                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                                    }
                                });

                        },
                        function (error){
                            //alguna ha fallado
                            alert('error');
                        }
                    );

                }, 2000);

            }
            else {
                window.location.href = "ListarProyecto.html";
            }
        });
    }

});
