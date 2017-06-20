$(function () {

    $('#principal').hide();
    $('#loading').show();


    if (sessionStorage != null) {

        if (sessionStorage.getItem("Id") != null) {
            $('#ancoreSesion').html('<i class="fa fa-close"></i> Cerrar Sesión');
        }
        else {
            $('#ancoreSesion').html('<i class="fa fa-sign-in"></i> Iniciar Sesión');
            window.location.href = "index.html";
            return;
        }
    }
    else {
        window.location.href = "index.html";
    }

    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión')
        {
            //acá debe direccionarlo directamente al login y vaciar la variable de session

            if (sessionStorage.getItem("ES_CPAS") == "true")
            {
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

    $('[data-toggle="tooltip"]').tooltip()
    // knockout view model
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        // knockout mapping JSON data to view model
        //cambios en los roles //1,2,3,5,6

        /*
        if (sessionStorage.getItem("RolId") == '1' || sessionStorage.getItem("RolId") == '2'
            || sessionStorage.getItem("RolId") == '3' || sessionStorage.getItem("RolId") == '5'
            || sessionStorage.getItem("RolId") == '6')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */

        Menu();

        ko.mapping.fromJS(data, {}, self);
        eliminar = function (data, event) {
            var target = event.target || event.srcElement;

            if (target.nodeType == 3) // defeat Safari bug
                target = target.parentNode;

            var idEliminar = data.Id;

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a este usuario?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {


                    $.ajax({
                        url: ObtenerUrl('ObtenerUsuario'),
                        type: "DELETE",
                        data: ko.toJSON({ IdUsuario: idEliminar }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (dataF) {
                            //ok
                            var self = this;

                            swal("Eliminado con éxito!");
                            EnviarMensajeSignalR('Se ha eliminado un usuario.', "usuarios.html", "4", sessionStorage.getItem("RolId"), result);

                            window.location.href = "usuarios.html";

                            //swal("Eliminado con éxito!");
                        },
                        error: function (error) {
                            if (error.status.toString() == "500") {
                                //getNotify('error', 'Error', 'Error de Servidor!');
                                swal("Error de Servidor");
                            }
                            else {
                                //getNotify('error', 'Error', 'Error de Servidor!');
                                swal("Error de Servidor");
                            }
                        }
                    });

                    //swal("Ajax request finished!");


                }, 2000);
            });
        }
    }
    // get data - sample data from Donors Choose API
    var obtenerUsuarios = $.getJSON(ObtenerUrl('ListarUsuarios') + '?instId=' + sessionStorage.getItem("InstId") +  '&rolId=' + sessionStorage.getItem("RolId"));

    $.when(obtenerUsuarios).then(
        function(data){
            elem = document.getElementById('principal');

            ko.applyBindings(new ViewModel(data), elem);
            // apply DataTables magic
            $("#proposals").DataTable({
                responsive: true,
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
            $('#principal').show();
            $('#loading').hide();

        },
        function (){
            //alguna ha fallado
            swal("Error de Servidor");
        },
        function(){
            //acá podemos quitar el elemento cargando
            //alert('quitar cargando');
        }
    )

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



});
