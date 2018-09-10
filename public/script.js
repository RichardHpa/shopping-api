const baseUrl = 'http://192.168.33.10:3000';

var pagination = $('#pagination'),
totalRecords = 0,
records = [],
displayRecords = [],
recPerPage = 100,
page = 1,
totalPages = 0,
currentPage = 1,
minPrice = 0,
maxPrice = 100,
availVal = 'all';

$( function() {
   $( "#slider-range" ).slider({
     range: true,
     min: 0,
     max: 100,
     values: [ 0, 100 ],
     slide: function( event, ui ) {
       $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
   },
       stop: function(event, ui) {
         minPrice = ui.values[ 0 ];
         maxPrice = ui.values[ 1 ];
         getData(baseUrl  + '/products/instock=' + availVal + '/min=' + minPrice + '/max=' + maxPrice);
     }
   });
   $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
     " - $" + $( "#slider-range" ).slider( "values", 1 ) );
 } );

$(document).ready(function(){
    getData(baseUrl  + '/allProducts');

    $('.filterIcon').click(function(){
        event.preventDefault();
        $('.sidebar').toggleClass('open');
    });

    $('input[name="stock"]').change(function(){
        availVal = $(this).val();
        getData(baseUrl  + '/products/instock=' + availVal + '/min=' + minPrice + '/max=' + maxPrice);
    })

    $('body').click(function(event){
        if($('#sidebar.open').length){
            if(event.target.id == 'sidebar'){
                return
            }
            if($(event.target).closest('#sidebar').length)
              return;

              $('.sidebar').toggleClass('open');
        }

    })

});

$(document).on('click', '#pagination .page-item.tabs', function(e){
    e.preventDefault();
    var startID = $(this).data('start');
    $('.page-item').removeClass('active');
    $(this).addClass('active');
    changePage(startID);
    $('.loader').remove();
    currentPage = Number($(this).data('page'));
});

$(document).on('click', '.list-group-item', function(e){
    var id = $(this).data('productid');
    $.ajax({
        url: baseUrl + '/product/id=' + id,
        dataType: 'json',
        type: 'get',
        success:function(product){
            console.log(product);
            $('#productModel').find('#productTitle').text(product['product_name']);
            $('#productModel').find('#productPrice').text('$' +product['product_price']);
            $('#productModel').find('#avail').text(product['in_stock']);

            $('#productModel').modal();
        },
        error: function(error){

        }
    })
});

$(document).on('click', '#pagination .page-item.previous', function(e){
    if(currentPage > 1){
        $('.page-item').removeClass('active');
        currentPage--;
        var startID = (currentPage * recPerPage) - recPerPage;
        $("#pagination").find('[data-page="'+currentPage+'"]').addClass('active');
        changePage(startID);
        $('.loader').remove();
    }
});

$(document).on('click', '#pagination .page-item.next', function(e){
    if(currentPage < totalPages){
        $('.page-item').removeClass('active');
        var startID = (currentPage * recPerPage);
        currentPage++;
        $("#pagination").find('[data-page="'+currentPage+'"]').addClass('active');
        changePage(startID);
        $('.loader').remove();
    }
});

function changePage(startID){
    $("#productList").empty();
    $("#productList").parent().append('<div class="loader"></div>');
    for (var i = 0; i < recPerPage; i++) {
        if(records[startID]){
            $('#productList').append('<li class="list-group-item" data-productID="'+records[startID].id+'">'+records[startID].id+' - '+records[startID].product_name+'</li>');
            startID++
        }
    }
}


function getData(url){
    $("#productList").empty();
    $("#pagination").empty();
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success:function(products){
            records = products;
            totalRecords = products.length;
            totalPages = Math.ceil(totalRecords/recPerPage);

            var start = 0;
            for (var i = 1; i <= totalPages; i++) {
                var classes = 'page-item tabs';
                if(i == 1){
                    classes += ' active'
                }
                $('#pagination').append('<li class="'+classes+'" data-start="'+start+'" data-page="'+i+'"><a class="page-link" href="#">'+ i +'</a></li>');
                start = start +recPerPage;
            }

            $('#pagination')
                .prepend('<li class="page-item previous"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>')
                .append('<li class="page-item next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>')

            for (var i = 0; i < recPerPage; i++) {
                $('#productList').append('<li class="list-group-item" data-productID="'+products[i].id+'">'+products[i].id+' - '+products[i].product_name+'</li>');
            }
            $('.loader').remove();
        },
        error:function(){

        }
    })
}
