$(document).ready(function () {
    $('#principal').show();
    $('#loading').hide();
    //un poco de nockout
    var PersonaViewModel = {
        usuario: ko.observable(),
        password: ko.observable(),

        autentificar: function () {

            $('#principal').hide();
            $('#loading').show();

            $('#mensaje').text('');

            var obtenerLogin = jQuery.ajax({
                url : ObtenerUrl('Login'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ usuario: this.usuario, password: this.password })
            });



            $.when(obtenerLogin).then(
                function(result){

                    sessionStorage.setItem("NombreUsuario", result.AutentificacionUsuario.NombreUsuario);
                    sessionStorage.setItem("CorreoElectronico", result.AutentificacionUsuario.CorreoElectronico);
                    sessionStorage.setItem("RolId", result.AutentificacionUsuario.RolId);
                    sessionStorage.setItem("Id", result.AutentificacionUsuario.Id);
                    sessionStorage.setItem("InstId", result.AutentificacionUsuario.InstId);
                    sessionStorage.setItem("NombreRol", result.Rol.Nombre);
                    sessionStorage.setItem("NombreCompleto", result.Persona.Nombres + ' ' + result.Persona.ApellidoPaterno + ' ' + result.Persona.ApellidoMaterno);
                    sessionStorage.setItem("NombreInstitucion", result.Institucion.Nombre);

                    sessionStorage.setItem("instituciones", JSON.stringify(result.Institucion));

                    //importante para determinar de donde se esta ingresando, en este caso es asambleas.
                    sessionStorage.setItem("ES_CPAS", "false");

                    var obtenerVinculos = jQuery.ajax({
                        url : ObtenerUrlDos('Vinculo'),
                        type: 'POST',
                        dataType : "json",
                        contentType: "application/json",
                        data: ko.toJSON({ InstId: result.AutentificacionUsuario.InstId })
                    });

                    var obtenerArticulos = jQuery.ajax({
                        url : ObtenerUrlDos('Articulo'),
                        type: 'POST',
                        dataType : "json",
                        contentType: "application/json",
                        data: ko.toJSON({ InstId: result.AutentificacionUsuario.InstId })
                    });


                    $.when(obtenerVinculos, obtenerArticulos).then(
                        function(resVinculos, resArticulos){
                            //asignamos los valores a la variable de session
                            sessionStorage.setItem("vinculos", JSON.stringify(resVinculos[0]));
                            sessionStorage.setItem("articulos", JSON.stringify(resArticulos[0]));

                            var url = 'inicio.html';
                            window.location.href = url;

                        },
                        function (error){
                            //alerta de error
                            var url = 'inicio.html';
                            window.location.href = url;

                        },
                        function(){
                            //acá podemos quitar el elemento cargando
                            //alert('quitar cargando');
                        }
                    );

                    //ahora redireccionamos
                    /*
                    var url = 'inicio.html';
                    window.location.href = url;
                    */


                },
                function (error){

                    if (error.status.toString() == "500") {
                        $('#mensaje').text("Nombre de usuario o contraseña inválida!");
                    }
                    else {
                        $('#mensaje').text(error.statusText);
                    }
                    $('#principal').show();
                    $('#loading').hide();
                },
                function(){
                    //acá podemos quitar el elemento cargando
                    //alert('quitar cargando');
                }
            )
        }

    };

    ko.applyBindings(PersonaViewModel);

});

