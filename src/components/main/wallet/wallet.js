$('.walletMenu li').click(function (e) {
    let type=$(this).attr('data-name');
    ipcRenderer.send('change_wallet_menu', type);
});

$(document).on('click','.sendTokenButton', function (e) {
    // let data_arr=$(this).closest('form');
    // console.log(data_arr);
    // return;
    let data_arr=$(this).closest('tr').find('input').serializeArray();
    let data={};
    data_arr.forEach((el)=>{
        data[el.name]=el.value;
    });
    // console.log(data_arr);
    // console.log(data);
    ipcRenderer.send('transfer_token', data);
});

ipcRenderer.on("change_wallet_menu", (event, obj) => {
    $('.walletRight').html(obj);
    // $('#tokens_table').html('<div class="lds-roller"></div>');
});

ipcRenderer.on("wallet_load_token", (event, obj) => {
    // if ($('.lds-roller').length)
    //     $('.lds-roller').remove();
    $('#tokens_table').append(obj);
});