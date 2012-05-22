  var socket = io.connect('http://localhost');
  
$('document').ready(function(){
    
    socket.on('refresh', function (data) {
    console.log("server tells me i gotta be fresh");
    $('#wall').load("wall.html");
  });

    $('form').submit(function(){
    
       $.ajax({
            type: 'POST',
            url: '/post',
            data: $('form').serialize(),
            success: function(s) {                
                if(!s) alert("Error, try again");
                console.log("someone posted a message, gotta tell server");
                socket.emit('message', true );
                $('#wall').load("wall.html");
                $('input[name="message"]').val("");
            }
        });
        return false;

    });
});
