$('[data-name]').on('click', function (e) {
    let target = $(this).data('name');
    let parent = $(this).parent();
    parent.siblings().removeClass('active_settings');
    parent.addClass('active_settings');
    ipcRenderer.send('change_settings_menu', target);
});

// let pinText = '';
//
// $(document).on('click', '.singlePin', function () {
//     console.log(pinText);
//     let input = $('input[name="change_pin"]');
//     if(pinText.length !== 4) {
//         pinText += $(this).children('p').text();
//         input.val(pinText);
//         input.change();
//     }
// });
//
// $(document).on('change', 'input[name="change_pin"]', function () {
//     if(pin.length === 4) {
//         if ($(this).val() === '1111') {
//             console.log('Good password');
//             $('#back').css('cssText', 'display: flex !important;');
//             $('#front').css('cssText', 'display: none !important;');
//         } else {
//             console.log('Bad password');
//             pin = '';
//             $(this).val('');
//         }
//     }
// });

ipcRenderer.on('change_settings_menu', (event, obj) => {
    $('.settings__right').html(obj);
    // $('#tokens_table').html('<div class="lds-roller"></div>');
});
