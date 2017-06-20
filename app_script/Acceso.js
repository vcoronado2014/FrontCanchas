/**
 * Created by vcoronado on 03-04-2017.
 */
$(document).ready(function () {

    //un poco de nockout
    var PersonaViewModel = {
        usuario: ko.observable(),
        password: ko.observable(),

        autentificar: function () {


            $( "#progressbar" ).progressbar({
                value: false
            });

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

                    //ahora redireccionamos
                    var url = 'inicio.html';
                    window.location.href = url;



                },
                function (error){

                    if (error.status.toString() == "500") {
                        $('#mensaje').text("Nombre de usuario o contraseña inválida!");
                    }
                    else {
                        $('#mensaje').text(error.statusText);
                    }

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