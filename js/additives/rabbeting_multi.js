var initFunctions = [];
var change_details = {};
var rabbet_key = '';


$('#rabbetFullLength').change(function () {
    if ($("#rabbetFullLength").prop("checked")) {
        $('#rabbet_l').val('');
        $('#rabbetLFieldset').hide();
        $('#rabbet_n').val('');
        $('#rabbetNFieldset').hide();
    } else {
        $('#rabbetLFieldset').show();
        $('#rabbetNFieldset').show();
    }
});

$( document ).ready(function() {
    $('#rabbetPatternSelect').change(function () {
        hideAll();
        switch (Number($("#rabbetPatternSelect option:selected").val())){
            case 0:
                showEl(['rabbetPatternForm', 'rabbetSelectForm', 'rabbetCheckboxExtForm', 'rabbetCheckboxForm', 'rabbetDFieldset', 'rabbetZFieldset']);
                break;
            case 1:
                showEl(['rabbetSlimForm', 'rabbetSlimSideForm', 'rabbetCheckboxGorForm', 'rabbetPatternForm']);
                break;
            case 2:
                showEl(['rabbetPatternForm', 'rabbetSelectForm', 'rabbetCheckboxExtForm', 'rabbetCheckboxForm', 'rabbetZFieldset']);
                break;
        }
    });
});

function showEl(ids){
    ids.forEach(function(item){
        $('#'+item).show();
    });
}

function hideAll(){
    $('#rabbets').children().each(function(i, ele) {
        $('#'+ele.id).hide();
    });
}

// $('#rabbet *').focus(function () {
//     //draw();
//     markSide($('#rabbetSideSelect').val().charAt(0));
//     markSide($('#rabbetSideSelect').val().charAt(1), true);
// });
// $('#rabbetSideSelect').change(function () {
//     //draw();
//     markSide($('#rabbetSideSelect').val().charAt(0));
//     markSide($('#rabbetSideSelect').val().charAt(1), true);
// });
$('#rabbet_n').change(checkRabbetN);
$('#rabbet_z').change(checkRabbetZ);
$('#rabbet_d').change(checkRabbetD);
$('#rabbet_l').change(checkRabbetL);
function checkRabbetN() {
    inputCalc($("#rabbet_n"));//глубина
    var min = 0;
    var val = Number($("#rabbet_n").val().replace(',', '.')).toFixed(1);
    var max;
    val = Math.abs(val);
    if (val == 0) {
        $('#rabbet_n').val('');
        return true;
    }
    for(var detail_key in change_details) {
        var detail = change_details[detail_key];
        if ($('#rabbetSideSelect').val() == '13' | $('#rabbetSideSelect').val() == '15' | $('#rabbetSideSelect').val() == '63' | $('#rabbetSideSelect').val() == '65') {
            max = detail.kromki.left + detail.detailWidth + detail.kromki.right - min - 120;
        }
        if ($('#rabbetSideSelect').val() == '12' | $('#rabbetSideSelect').val() == '14' | $('#rabbetSideSelect').val() == '62' | $('#rabbetSideSelect').val() == '64') {
            max = detail.kromki.top + detail.detailHeight + detail.kromki.bottom - min - 120;
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-FOR-DET-№']+(Number(detail.detailKey)+1)+'.\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
            $('#rabbet_n').val('');
            $('#rabbet_n').focus();
            return false;
        } else {
            $('#rabbet_n').val(val);
            // return true;
        }
    }

    return true;
}
function checkRabbetZ() {
    inputCalc($("#rabbet_z"));//глубина//глубина
//    var min = 1;
//    var val = Number($("#rabbet_z").val().replace(',', '.')).toFixed(1);
//    val = Math.abs(val);
//    for(var detail_key in change_details) {
//        var detail = change_details[detail_key];
//        var max = detail.detailThickness - 5;
//        if (!(min <= val && val <= max)) {
//            alert('Неверное значение глубины для детали №'+(Number(detail.detailKey)+1)+'.\nЗначение должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
//            $('#rabbet_z').val('');
//            $('#rabbet_z').focus();
//            return false;
//        } else {
//            $('#rabbet_z').val(val);
//            // return true;
//        }
//    }

    return true;
}
function checkRabbetD() {
    inputCalc($("#rabbet_d"));//глубина//ширина
//    var min = 4;//4;
//    var max = 25;
//    var val = Number($("#rabbet_d").val().replace(',', '.')).toFixed();
//    val = Math.abs(val);
//    if (!(min <= val && val <= max)) {
//        alert('Неверное значение ширины.\nЗначение должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
//        $('#rabbet_d').val('');
//        $('#rabbet_d').focus();
//        return false;       //хуль не было?
//    } else {
//        $('#rabbet_d').val(val);
        return true;
//    }
}
function checkRabbetL() {
    inputCalc($("#rabbet_l"));//глубина
    var d = Number($("#rabbet_d").val().replace(',', '.')).toFixed(1);
    var val = Number($("#rabbet_l").val().replace(',', '.')).toFixed(1); //длина
    val = Math.abs(val);
    if (val == 0 && $("#rabbetFullLength").prop("checked")){
        return true;
    }
    var max;

    for(var detail_key in change_details) {
        var detail = change_details[detail_key];

        if ($('#rabbetSideSelect').val() == '13' | $('#rabbetSideSelect').val() == '15' | $('#rabbetSideSelect').val() == '63' | $('#rabbetSideSelect').val() == '65') {
            max = detail.kromki.left + detail.detailWidth + detail.kromki.right - Number($('#rabbet_n').val()) - 0;
        }
        if ($('#rabbetSideSelect').val() == '12' | $('#rabbetSideSelect').val() == '14' | $('#rabbetSideSelect').val() == '62' | $('#rabbetSideSelect').val() == '64') {
            max = detail.kromki.top + detail.detailHeight + detail.kromki.bottom - Number($('#rabbet_n').val()) - 0;
        }
        if ($("#rabbetFullLength").prop("checked")) {
            var min = 0;
        } else {
            var min = (d < 6) ? 120 : 8;
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-DLINA-DET-№']+(Number(detail.detailKey)+1)+'.\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
            $('#rabbet_l').val('');
            $('#rabbet_l').focus();
            return false;
        } else {
            $('#rabbet_l').val(val);
            // return true; //continue; <- but not need because last comm
        }
    }

    return true;
}

// function delRabbet(rabbetKey) {
//     $.ajax({
//         type: "POST",
//         url: "system/controllers/JsonController.php",
//         data: ({controller:'Additives', action: 'delDetailRabbet', detail_key: detailKey, rabbet_key: rabbetKey}),
//         dataType: 'json',
//         success: function (data) {
//             //console.log(data);
//             getRabbets();
//         }
//     });
// }
function addRabbet(callback) {
    var keys = [];
    var action;
    for(var detail_key in change_details) {
        var detail = change_details[detail_key];
        keys.push(detail.detailKey);
    }

    var pattern = Number($('#rabbetPatternSelect option:selected').val());
    var d = Number($('#rabbet_d').val());
    if (pattern == 2){
        d = 3.2;
    }

    if (pattern != 1){
        if (checkRabbetN() && checkRabbetZ() && checkRabbetD() && checkRabbetL()) {
            var rabbet_data = {
                side: Number($('#rabbetSideSelect').val()),
                n: Number($('#rabbet_n').val()),
                z: Number($('#rabbet_z').val()),
                d: d,
                l: Number($('#rabbet_l').val()),
                rabbet_key: rabbet_key
            };
            action = 'setDetailRabbets';
        } else {
            return false;
        }
    } else{
        var rabbet_data = {
            slimType: Number($('#rabbetSlimSelect').val()),
            slimGor: Number($('#rabbetGorWidth').prop('checked')),
            frontSide: Number($('#rabbetSlimSide').val()),
        };
        action = 'setDetailSlimRabbets';
    }
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Additives', action: action, detail_keys: keys, rabbet_data: rabbet_data,
        }),
        dataType: 'json',
        success: function (data) {
            location.reload();
        }
    });

}
// function editRabbet(rabbetKey) {
// //    showTopFormForEdit('panel-rabbeting', 'rabbetsForm');
//     $.ajax({
//         type: "POST",
//         url: "system/controllers/JsonController.php",
//         data: ({controller:'Additives', action: 'getDetailRabbet', detail_key: detailKey, rabbet_key: rabbetKey}),
//         dataType: 'json',
//         success: function (data) {
//             $('#rabbetSideSelect').val(data['side']);
//             $('#rabbet_n').val(data['n']);
//             $('#rabbet_z').val(data['z']);
//             $('#rabbet_d').val(data['d']);
//             $('#rabbet_l').val(data['l']);
//             rabbet_key = rabbetKey;
//             $("#addButtonRabbet").text('Сохранить');
//             $("#addButtonRabbet").removeClass("btn-success");
//             $("#addButtonRabbet").addClass("btn-danger");
//             //
//             var type = data['side'][1] % 2 == 0 ? 1 : 0;
//             if (data['l'] == 0 || (type == 0 && data['l'] >= detailWidth || type == 1 && data['l'] >= detailHeight)) {
//                 $("#rabbetFullLength").prop("checked", true);
//             } else {
//                 $("#rabbetFullLength").prop("checked", false);
//             }
//             $('#rabbetFullLength').change();
//             $('#rabbetSideSelect').change();
//             $('#rabbet_n').change();
//             $('#rabbet_z').change();
//             $('#rabbet_d').change();
//             $('#rabbet_l').change();
//             $('#rabbetsTable tr').removeClass("info");
//             $('#rabbetsTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
//             $("#rabbetKeyId-" + rabbetKey).addClass("info");
//             $("#rabbetKeyId-" + rabbetKey + '.danger').addClass("danger-edit").removeClass("danger");
//             $('#collapseRabbet').collapse("show");
//             window.frames[0]
//                 ? window.frames[0].document.getElementById('panel-rabbeting').scrollIntoView()
//                 : window.document.getElementById('panel-rabbeting').scrollIntoView();
//         }
//     });
// }
function getRabbets(rabbets, redraw = false) {

    if (rabbets) {
        //console.log('good rabbets');
        detailRabbets.length = 0;
        for (key in rabbets)
            detailRabbets.push([Number(rabbets[key]['side']), Number(rabbets[key]['n']), Number(rabbets[key]['z']), Number(rabbets[key]['d']), Number(rabbets[key]['l']), Number(rabbets[key]['key'])]);

        //showHoles();
        //showGrooves();
        showRabbets();
    } else {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailRabbets', detail_key: detailKey}),
            dataType: 'json',
            success: function (data) {
                detailRabbets.length = 0;
                for (key in data)
                    detailRabbets.push([Number(data[key]['side']), Number(data[key]['n']), Number(data[key]['z']), Number(data[key]['d']), Number(data[key]['l']), Number(data[key]['key'])]);


                //showHoles();
                //showGrooves();
                showRabbets();
            }
        });
    }
}
function setRabbetSidePattern(data) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getRabbetSidesPatternsData'}),
        dataType: 'json',
        success: function (data) {
            var objSel = document.getElementById("rabbetSideSelect");
            if (objSel) {
                objSel.options.length = 0;
                var i = 0;
                for (key in data.getRabbetSides) {
                    objSel.options[i++] = new Option(key, data.getRabbetSides[key]);
                }
            }
            var objPat = document.getElementById("rabbetPatternSelect");
            if (objPat) {
                objPat.options.length = 0;
                var i = 0;
                for (key in data.getRabbetPatterns) {
                    objPat.options[i++] = new Option(key, objPat.options.length);
                }
            }
        }
    });
}

function initRabbet() {
    if (window.ro) {
        $("#rabbets").attr("disabled", true);
        return;
    }
    // $('#rabbetSideSelect').val(15);
    $('#rabbet_n').val('');
    $('#rabbet_z').val('');
    $('#rabbet_d').val('');
    $('#rabbet_l').val('');
    $("#addButtonRabbet").text(LANG['ADD']);
    $("#addButtonRabbet").addClass("btn-success");
    $("#addButtonRabbet").removeClass("btn-danger");
    $("#rabbetFullLength").change();
}

function getChangeKeys() {
    var changes = [];
    $("input[name=Detail_ch]:checked").each(function(i, it){ changes.push($(it).val());});
    return changes;
}

function getDetailForId(detail_key) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetail', detail_key: detail_key}),
        success: function (data) {
            console.log(data);
            change_details[detail_key] = {
                'detailKey'        : data['key'],
                'detailWidth'      : data['width'],
                'detailHeight'     : data['height'],
                'detailFullWidth'  : data['fullWidth'],
                'detailFullHeight' : data['fullHeight'],
                'detailThickness'  : data['thickness'],
                'detailSquare'     : data['square'],
                'detailCount'      : data['count'],
                'detailTexture'    : data['texture'],
                'detailCaption'    : data['caption'],
                'detailDecoratedSide' : data['decoratedSide'],
                'detailMarker'     : data['marker'],
                'detailValid'      : data['valid'],
                'grooves'          : data['grooves'],
                'kromki'           : data['kromki'],
                // 'holes'            : data['holes']
            };
        }
    });
}

function getDetailsForIds(keys) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetailsById', keys: keys}),
        success: function (data) {
            console.log(data);
            for (var key in data) {
                change_details[data[key]['key']] = {
                    'detailKey'        : data[key]['key'],
                    'detailWidth'      : data[key]['width'],
                    'detailHeight'     : data[key]['height'],
                    'detailFullWidth'  : data[key]['fullWidth'],
                    'detailFullHeight' : data[key]['fullHeight'],
                    'detailThickness'  : data[key]['thickness'],
                    'detailSquare'     : data[key]['square'],
                    'detailCount'      : data[key]['count'],
                    'detailTexture'    : data[key]['texture'],
                    'detailCaption'    : data[key]['caption'],
                    'detailDecoratedSide' : data[key]['decoratedSide'],
                    'detailMarker'     : data[key]['marker'],
                    'detailValid'      : data[key]['valid'],
                    'grooves'          : data[key]['grooves'],
                    'kromki'           : data[key]['kromki'],
                    'holes'            : data[key]['holes']
                };
            }
        }
    });
}

function start(){
    //сходу подгружаем инфу о выбранных деталях в массив change_details
    // $(getChangeKeys()).each(function (index, item) {
    //     getDetailForId(item);
    // });

    getDetailsForIds(getChangeKeys());

    setRabbetSidePattern();
    initFunctions.push(initRabbet);

    $('#addButtonRabbet').click(function () {
        addRabbet();
    });

    //внутри инита не срабатывает
    $("#rabbetFullLength").change();

    //а тут нема кнопок центрирования :3

}

