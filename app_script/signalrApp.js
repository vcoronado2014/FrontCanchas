/**
 * Created by vcoronado on 29-05-2017.
 */
//$(document).ready(function () {
    jQuery.support.cors = true;
    //var con = $.connection("http://localhost:34080/");


    //$.connection.chatHub.url ="http://localhost:34080/signalr";
    //$.connection.hub.url = "http://localhost:34080/signalr/hubs";
    $.connection.hub.url = "http://signalr.cpas.cl/signalr/hubs";
    var chat = $.connection.chatHub;
    //chat.url = "http://localhost:34080/signalr";
    var username = sessionStorage.getItem("NombreUsuario") + '_' + sessionStorage.getItem("InstId");


    chat.client.updateUsers = function (userCount, userList) {
        //'<i class="fa fa-user-circle-o"> ' + userCount + '</i>'
        $('#infoUsuarios').html('<i class="fa fa-user-circle-o"> ' + userCount + '</i>');
        //$('#onlineUsersCount').text('Online users: ' + userCount);
        //$('#userList').empty();
       // userList.forEach(function (username) {
            //$('#userList').append('<li>' + username + '</li>');
       // });
    }

    chat.client.broadcastMessage = function (user, message) {
        //$('#messagesArea').append('<li><strong>' + username + '</strong>: ' + message);
        getNotify('success', 'Notificación', message);
        //alert(message);
    }

    chat.client.broadcastMessageUrl = function (user, message, url) {
        //$('#messagesArea').append('<li><strong>' + username + '</strong>: ' + message);
        getNotify('success', 'Notificación', message + '</br><a href="' + url + '" target="_parent">' + url +  '</a>');
        //alert(message);
    }

    $.connection.hub.start().done(function () {
        if (sessionStorage.getItem("NombreUsuario"))
            chat.server.connect(username);
    });

    function EnviarMensajeSignalR(mensaje) {
        chat.server.send(mensaje);
        //window.location.href = "usuarios.html";
    }

    function EnviarMensajeSignalR(mensaje, url) {
        chat.server.sendUrl(mensaje, url);
        //window.location.href = "usuarios.html";
    }

    function EnviarMensajeSignalR(mensaje, url, tipo, rol, result) {
        chat.server.sendUrl(mensaje, url, rol);
        //chat.server.sendMensaje(mensaje, url, tipo, rol, result);
        //window.location.href = "usuarios.html";
    }

//});
