const url = 'http://192.168.33.10:3000/';

$(document).ready(function(){
    $.ajax({
        url: url + 'allProducts',
        type: 'get',
        dataType: 'json',
        success:function(){
            $('.loader').remove();
            
        },
        error:function(){

        }
    })
});
