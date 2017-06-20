/**
 * Created by VICTOR CORONADO on 01/04/2017.
 */
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
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.frmUrlDocumento = ko.observable("");

        /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */
        Menu();

        //del formulario
        self.frmNombreUsuario = ko.observable("");
        self.frmMotivo = ko.observable("");
        self.frmTelefono = ko.observable("");
        self.frmCorreoElectronico = ko.observable("");

        guardar = function (){
            //aca los llamados de negocio para guardar
            if (validar($("#txtNombreUsuario").val(), $("#txtTelefono").val(), $("#txtCorreo").val(), $("#txtConsulta").val()))
            {
                var contacto = {
                    Para: frmCorreoElectronico,
                    Mensaje: frmMotivo,
                    Nombre: frmNombreUsuario,
                    Telefono: frmTelefono
                };

                var obtenerContacto = jQuery.ajax({
                    url : ObtenerUrlDos('Contacto'),
                    type: 'PUT',
                    dataType : "json",
                    contentType: "application/json",
                    data: ko.toJSON(contacto)
                });

                $.when(obtenerContacto).then(
                    function(data){
                        swal({
                                title: "Enviado",
                                text: "Su consulta ha sido enviada con éxito.",
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
                                    //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                    //CrearModificarVotacion.html?id=3&ELIMINAR=0
                                    window.location.href = "Contacto.html";
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });

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

            }
        }
        cancelar = function (){
            window.location.href = "inicio.html";

        }
        $('#principal').show();
        $('#loading').hide();
    }


    elem = document.getElementById('principal');
    ko.applyBindings(new ViewModel([]), elem);
/*
    var obtenerProyecto = jQuery.ajax({
        url : ObtenerUrlDos('Proyecto'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

    $.when(obtenerProyecto).then(
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
            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            //alert('quitar cargando');
        }
    )
*/

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

    function validar(Nombre, Telefono, Correo, Consulta) {
        var retorno = true;
        if (Nombre === '' || Nombre === null || Nombre === undefined) {
            getNotify('error', 'Requerido', 'Nombre Requerido.');
            retorno = false;
        }
        if (Telefono === '' || Telefono === null) {
            getNotify('error', 'Requerido', 'Teléfono Requerido.');
            retorno = false;
        }
        if (Correo === '' || Correo === null) {
            getNotify('error', 'Requerido', 'Correo Requerido.');
            retorno = false;
        }
        if (Consulta === '' || Consulta === null) {
            getNotify('error', 'Requerido', 'Consulta Requerida.');
            retorno = false;
        }
        if (validarEmail(Correo) == false)
        {
            retorno = false;
        }

        return retorno;
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
});