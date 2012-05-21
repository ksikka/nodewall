$('document').ready(function(){
    $('form').submit(function(){
    
       $.ajax({
            type: 'POST',
            url: '/post',
            data: $('form').serialize(),
            success: function(s) {                
                if(!s) alert("Error, try again");
                $('#wall').load("wall.html");
                $('input[name="message"]').val("");
            }
        });
        return false;

    });
});
