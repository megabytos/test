/**
 * Created by Нескород Аркадий on 17.05.2017.
 */

var initFunctions = [];
var groove_key = '';
var change_details = {};
var grooves = [];
var minDistanceForGroove = 6; //tag_r
var groovePreset;

$('#grooveAllWidth').change(function () {
    if ($("#grooveAllWidth").prop("checked")) {
        $('#groove_l').val('');
        $('#grooveLFieldset').hide();
//        $('#grooveExtFieldset').show();
    } else {
        $('#grooveLFieldset').show();
//        $('#grooveExtFieldset').hide();
//        $('#grooveExt').prop("checked", false);
    }
    $('#grooveTypeSelect').change();
    showHideR();
    $('#grooveLFieldset').removeClass('mg16');
});
$('#groovesForm *').focus(function () {
    //draw();
   // markSide($('#grooveSideSelect').val());
});
$('#grooveSideSelect').change(function () {
    freeFields();
    switch(Number($(this).val())){
        case 1:
        case 6:
            $('#grooveTypeSelect').prop('disabled', false);
            $('#grooveAllWidth').prop('disabled', false);
            break;
        default :
            $('#grooveAllWidth').prop('checked','checked');
            $('#grooveAllWidth').prop('disabled', true);
            if ($(this).val() == 2  || $(this).val() == 4 ){
                $('#grooveTypeSelect').val(1);
                $('#grooveTypeSelect').prop('disabled', true).change();
            }
            if ($(this).val() == 3 || $(this).val() == 5){
                $('#grooveTypeSelect').val(0);
                $('#grooveTypeSelect').prop('disabled', true).change();

            }
    }
    setGroovePreset();
    //markSide($('#grooveSideSelect').val());

    if (($(this).val() != 1) && ($(this).val() != 6)) {
        // if (detailThickness < 16 ) {
        //     showErrorMessage('Данная операция не доступна для листа толщиной меньше чем 16 мм');
        //     $(this).val(1);
        //     $(this).focus();
        //     return false;
        // }
    }
});

$('#grooveArtSelect').change(function () {
    var objSel = document.getElementById('grooveArtSelect');
    for (i = 0; i < objSel.options.length; i++) {
        if (objSel.options[i].value == $(this).val()) {
            $('#groove_z').val(grooves[i][4]);
            $('#groove_d').val(grooves[i][5]);
            $('#groove_l').val(grooves[i][6]);
            break;
        }
    }
});

function freeFields() {
    $('#groove_x').val('');
    $('#groove_y').val('');
    $('#groove_z').val('');
    $('#groove_d').val('');
    $('#groove_l').val('');
}

function setGrooveArts(data) {
    var objSel = document.getElementById("grooveArtSelect");
    if (objSel) {
        objSel.options.length = 0;
        var i = 0;
        for (key in data) {
            objSel.options[i++] = new Option(key, key);
        }
    }
}

function groovePresetChange(data) {
    freeFields();
    grooves.length = 0;
    var s;
    for (key in data) {
        var z = data[key]['z'][0];
        if (data[key]['side'] === '') {
            s = data[key]['side'];
        }
        //--------------------------------------------------------
        grooves.push([s, data[key]['type'], data[key]['x'], data[key]['y'], z, data[key]['d'], data[key]['l'], data[key]['ext']]);
        if (data[key]['d'] == '3.2') {
            $('#grooveAllWidth').prop('checked', true).prop('disabled', true).change();
        } else {
            $('#grooveAllWidth').prop('disabled', false);
        }
    }
    if (grooves[0][2] === '') {
        $('#grooveXFieldset').show();
    } else {
        $('#groove_x').val(grooves[0][2]);
        $('#grooveXFieldset').hide();
    }
    if (grooves[0][3] === '') {
        $('#grooveYFieldset').show();
    } else {
        $('#groove_y').val(grooves[0][3]);
        $('#grooveYFieldset').hide();
    }
    if (grooves[0][4] === '') {
        $('#grooveZFieldset').show();
    } else {
        $('#groove_z').val(grooves[0][4]);
        $('#grooveZFieldset').hide();
    }
    if (grooves[0][5] === '') {
        $('#grooveDFieldset').show();
    } else {
        $('#groove_d').val(grooves[0][5]);
        $('#grooveDFieldset').hide();
    }
    if (grooves[0][6] === '') {
        if ($('#grooveExt').prop('checked')) {
            $('#grooveLFieldset').show();
        }
    } else {
        $('#groove_l').val(grooves[0][6]);
        $('#grooveLFieldset').hide();
    }
    $('#grooveBindFieldset').show();
    if ($('#groovePresetSelect').val().charAt(0) > 1) {
        setGrooveArts(data);
        $('#grooveArtSelectField').show();
        if ($('#groovePresetSelect').val().charAt(0) == '2') {
            $('#grooveXFieldset').show();
            $('#grooveYFieldset').show();
            $('#grooveAllWidthField').hide();
            $("#grooveAllWidth").prop("checked", false);
            $("#grooveAllWidth").prev().removeClass('input_mask_checked');
        }
        $('#grooveAllWidth').change();
        if ($('#groovePresetSelect').val().charAt(0) == '3') {
            $('#grooveAllWidthField').hide();
            $("#grooveAllWidth").prop("checked", true);
            $("#grooveAllWidth").prev().addClass('input_mask_checked');
            $('#grooveXFieldset').hide();
            $('#grooveYFieldset').hide();
            $('#grooveBindFieldset').hide();
        }
        // $('#grooveZFieldset').hide();
        // $('#grooveDFieldset').hide();
        // $('#grooveLFieldset').hide();
        if ($('#groovePresetSelect').val().charAt(0) == '4') {
            $('#grooveLFieldset').show();
        }
        $("#grooveExt").prop("checked", false);
        $("#grooveExt").prev().removeClass('input_mask_checked');
        $("#grooveExt").prop("disabled", true);
    } else {
        $('#grooveAllWidth').change();
        $('#grooveArtSelectField').hide();
        $('#grooveAllWidthField').show();
        $("#grooveExt").prop("disabled", false);
    }
}

$('#groovePresetSelect').change(function () {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getGrooveParam', type: $('#groovePresetSelect').val()}),
        dataType: 'json',
        success: function (data) {
            groovePresetChange(data);
        }
    });
});

//здеся правим направление пазирования
var groove_linking_y = false;
var groove_linking_x = false;
// $('#grooveLinkingSelect').change(function () {
//     if ($('#grooveTypeSelect').val() == 0) {
//         groove_linking_x = false;
//         if ($('#grooveLinkingSelect').val() == 0) {
//             groove_linking_y = false;
//             console.log('linking y '+groove_linking_y);
//             console.log('linking x '+groove_linking_x);
//         } else {
//             groove_linking_y = true;
//             console.log('linking y '+groove_linking_y);
//             console.log('linking x '+groove_linking_x);
//         }
//     } else {
//         groove_linking_y = false;
//         if ($('#grooveLinkingSelect').val() == 0) {
//             groove_linking_x = false;
//             console.log('linking y '+groove_linking_y);
//             console.log('linking x '+groove_linking_x);
//         } else {
//             groove_linking_x = true;
//             console.log('linking y '+groove_linking_y);
//             console.log('linking x '+groove_linking_x);
//         }    }
// });
$('.grooveLinkingSelect').change(function () {
    var selects = $('.grooveLinkingSelect');
    groove_linking_x = (selects[0].value == 'r');
    groove_linking_y = (selects[1].value == 't');
});

$('#grooveTypeSelect').change(function () {
    if ($("#grooveAllWidth").prop("checked")) {
        if ($('#grooveTypeSelect').val() == 0) {
            $('#groove_x').val('');
            // $('#groove_y').val('');
            $('#grooveXFieldset').hide();
            $('#grooveYFieldset').show();
            $('#grooveLinkingSelect').empty();
            $('#grooveLinkingSelect').append('<option value="0">'+LANG['NIZ-KRAI']+'</option>')
            $('#grooveLinkingSelect').append('<option value="1">'+LANG['VERH-KRAI']+'</option>')
        }
        if ($('#grooveTypeSelect').val() == 1) {
            $('#groove_y').val('');
            //$('#groove_x').val('');
            $('#grooveYFieldset').hide();
            $('#grooveXFieldset').show();
            $('#grooveLinkingSelect').empty();
            $('#grooveLinkingSelect').append('<option value="0">'+LANG['LEFT-KRAI']+'</option>')
            $('#grooveLinkingSelect').append('<option value="1">'+LANG['RIGHT-KRAI']+'</option>')
        }
    } else {
        $('#grooveYFieldset').show();
        $('#grooveXFieldset').show();
    }
    showHideR();
});

//  Thats all checking methods! Need update for multigroove or not using // decomment please with *


$('#groove_x').change(checkGrooveX);
$('#groove_y').change(checkGrooveY);
$('#groove_z').change(checkGrooveZ);
$('#groove_d').change(checkGrooveD);
$('#groove_l').change(checkGrooveL);
$('#groove_sp_r').change(checkGrooveR);

function getMinDistanceForGroove(checkedGrooveExt, kromki){
    var minDistance;
    if (!checkedGrooveExt || kromki == 0){ //tag_r
        var minDistance = 6; 
    } else{
        minDistance = 8;
    }
    return minDistance;
}

function checkGrooveX() {
    inputCalc($("#groove_x"));
    var val = Number($("#groove_x").val().replace(',', '.')).toFixed(1);
    var len = Number($("#groove_l").val().replace(',', '.')).toFixed(1);
    var d = Number($("#groove_d").val().replace(',', '.')).toFixed(1);
    if (!d) {
        d = (len > 0 && len < 120) ? 6 : 4;
    }
    val = Math.abs(val);
    d = Math.abs(d);

    for(var index in change_details){
        var item = change_details[index];
        
        if ($('#grooveTypeSelect').val() == '0') {
            // if (Number($('#grooveSideSelect')) == )
                var min = 0;
                var kromki = 0;
                if ($('#grooveLinkX').val() == 0){ //tag_r
                    kromki = item.kromki.left;
                } else{
                    kromki = item.kromki.right;
                }
                minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
                //var max = item.kromki.left +  item.detailWidth + item.kromki.right - min - 6;
                var max = item.kromki.left + item.detailWidth + item.kromki.right - min - minDistanceForGroove; //tag_r
        }
        if ($('#grooveTypeSelect').val() == '1') {
            if (Number($('#grooveSideSelect').val()) == 1 || Number($('#grooveSideSelect').val()) == 6 ) {
                var kromki = 0;
                if ($('#grooveLinkX').val() == 0){ //tag_r
                    kromki = item.kromki.left;
                } else{
                    kromki = item.kromki.right;
                }
                minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
                var min = minDistanceForGroove + item.kromki.left; 
                var max = item.detailWidth + item.kromki.left - minDistanceForGroove - d;
            } else {
                var min = 5;
                var max = item.detailThickness - min;
            }
        }
        if ($('#grooveTypeSelect').val() == 0 && val == 0) {
            $('#groove_x').val('');
            continue;
        } else if (!(min <= val && val <= max)) {
            msg = LANG['BAD-VALUE-X-DET'] + (Number(item.detailKey)+1) + ').\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + ' мм до ' + max + ' мм.';
            msg += '\n'+ LANG['MIN-DOPUK-OST-TEL'] + minDistanceForGroove + ' мм.';
            alert(msg);
            $('#groove_x').val('');
            $('#groove_x').focus();
            activate_addButton(false);
            return false;
        } else {
            $('#groove_x').val(val);
            continue;
        }
    }
    activate_addButton();
    return true;
}
function checkGrooveY() {
    inputCalc($("#groove_y"));
    var val = Number($("#groove_y").val().replace(',', '.')).toFixed(1);
    var len = Number($("#groove_l").val().replace(',', '.')).toFixed(1);
    var d = Number($("#groove_d").val().replace(',', '.')).toFixed(1);
    if (!d) {
        d = (len > 0 && len < 120) ? 6 : 4;
    }
    val = Math.abs(val);
    d = Math.abs(d);

    for(var index in change_details){
        var item = change_details[index];
        //console.log(item);
        if ($('#grooveTypeSelect').val() == '0') {
            if (Number($('#grooveSideSelect').val()) == 1 || Number($('#grooveSideSelect').val()) == 6) {
                var kromki = 0;
                if ($('#grooveLinkY').val() == 0){ //tag_r
                    kromki = item.kromki.bottom;
                } else{
                    kromki = item.kromki.top;
                }
                minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
                var min = minDistanceForGroove + item.kromki.bottom;
                var max = item.detailHeight + item.kromki.bottom - minDistanceForGroove - d;
            } else {
                var min = 5;
                var max = item.detailThickness - min;
            }
        }
        if ($('#grooveTypeSelect').val() == '1') {
            var min = 0;
            var kromki = 0;
            if ($('#grooveLinkY').val() == 0){ //tag_r
                kromki = item.kromki.bottom;
            } else{
                kromki = item.kromki.top;
            }
            minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
            //var max = item.kromki.top + item.detailHeight + item.kromki.bottom - min - 6;
            var max = item.kromki.top + item.detailHeight + item.kromki.bottom - min - minDistanceForGroove;
        }
        if ($('#grooveTypeSelect').val() == '1' && val == 0) {
            $('#groove_y').val(val);
            continue;
        } else if (!(min <= val && val <= max)) {
            msg = LANG['BAD-VALUE-Y-DET'] + (Number(item.detailKey)+1) + ').\n'+LANG['ZNACH-MUST-BE']+'\nот ' + min + ' мм до ' + max + ' мм.';
            msg += '\n'+LANG['MIN-DOPUK-OST-TEL'] + minDistanceForGroove + ' мм.';
            alert(msg);
            $('#groove_y').val('');
            $('#groove_y').focus();
            activate_addButton(false);
            return false;
        } else {
            $('#groove_y').val(val);
            continue;
        }
    }
    activate_addButton();
    return true;
}
function checkGrooveZ() {
    inputCalc($("#groove_z"));//глубина
    return true;
    for(var index in change_details) {
        var item = change_details[index];
        var min = 1;
        if (Number($('#grooveSideSelect').val()) == 1 || Number($('#grooveSideSelect').val()) == 6 ) {
            var max = ($('#grooveAllWidth').prop('checked')) ? item.detailThickness / 2 + 1 : item.detailThickness - 5;
        } else {
            var max = 20;
        }
        var val = Number($("#groove_z").val().replace(',', '.')).toFixed(1);
        val = Math.abs(val);

        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-DETH-DET-№'] + (Number(item.detailKey)+1) + ').\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
            // showErrorMessage('Неверное значение глубины (для детали № ' + (Number(item.detailKey)+1) + ').\nЗначение должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
            $('#groove_z').val('');
            $('#groove_z').focus();
            activate_addButton(false);
            return false;
        } else {
            $('#groove_z').val(val);
            continue;
        }
    }
    activate_addButton();
    return true;
}

function checkGrooveD() {
    var side = Number($("#grooveSideSelect").val());
    if ([1, 6].indexOf(side) !== -1){
        inputCalc($("#groove_d"));//ширина
    }
    for(var index in change_details) {
        var item = change_details[index];
        // if (grooves[0][5] != '') {
        //     $("#groove_d").val(grooves[0][5]);
        // }
        if ($("#groove_d").val() == '3.2' && [1, 6].indexOf(side) !== -1) {
            if (!$("#grooveAllWidth").prop("checked")) {
                $("#grooveAllWidth").click();
                showErrorMessage(LANG['PAZ-WIDTH-32-SKVOZ']);
                return false;
            }
            $("#grooveAllWidth").prop("disabled", true);
            return true;
        } else {
            $("#grooveAllWidth").prop("disabled", false);
        }
        
        var len = Number($("#groove_l").val().replace(',', '.')).toFixed(1);
        if ([1, 6].indexOf(side) !== -1){
            var min = 3.2;
        } else{
            var min = 2.5;
        }
        var max;// = $("#grooveExt").prop("checked") ? 19 : 20;
        var val = Number($("#groove_d").val().replace(',', '.')).toFixed(1);
        var x = Number($("#groove_x").val().replace(',', '.')).toFixed(1);
        var y = Number($("#groove_y").val().replace(',', '.')).toFixed(1);

        var d = Number($("#groove_d").val().replace(',', '.')).toFixed(1);
        val = Math.abs(val);
        if ($('#grooveTypeSelect').val() == '0') {
            if ($('#grooveLinkY').val() == 0){ //tag_r
                kromki = item.kromki.bottom;
            } else{
                kromki = item.kromki.top;
            }
            minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
            max = item.kromki.top + item.detailHeight + item.kromki.bottom - minDistanceForGroove -(y || minDistanceForGroove);
            if (y + d > item.kromki.top + item.detailHeight + item.kromki.bottom) {
                alert(LANG['PAZ-EXIT-PREDEL']);
                // showErrorMessage('Паз выходит за пределы детали');
                $('#groove_d').val('');
                $('#groove_d').focus();
                return false;
            }
        }
        if ($('#grooveTypeSelect').val() == '1') {
            if ($('#grooveLinkX').val() == 0){ //tag_r
                kromki = item.kromki.left;
            } else{
                kromki = item.kromki.right;
            }
            minDistanceForGroove = getMinDistanceForGroove($('#grooveExt').prop('checked'), kromki);
            max = item.kromki.left + item.detailWidth + item.kromki.right - minDistanceForGroove -(x || minDistanceForGroove);
            if (x + d > item.kromki.left + item.detailWidth + item.kromki.right) {
                alert(LANG['PAZ-EXIT-PREDEL']);
                // showErrorMessage('Паз выходит за пределы детали');
                $('#groove_d').val('');
                $('#groove_d').focus();
                return false;
            }
        }
        if ($('#grooveSideSelect').val() != '1' || $('#grooveSideSelect').val() != '6'){
            if ($('#grooveSideSelect').val() == '2' || $('#grooveSideSelect').val() == '4') {
                max = item.detailThickness - 5 - Number($('#groove_x').val());
            }
            if ($('#grooveSideSelect').val() == '5' || $('#grooveSideSelect').val() == '3') {
                max = item.detailThickness - 5 - Number($('#groove_y').val());
            }
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-WIDTH']+'\n'+LANG['ZNACH-MUST-BE']+'\nот ' + min + 'мм до ' + max + 'мм.');
            // showErrorMessage('Неверное значение ширины.\nЗначение должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
            $('#groove_d').val('');
            $('#groove_d').focus();
            return false;
        } else {
            $('#groove_d').val(val);
            checkGrooveX();
            checkGrooveY();
            return true;
        }
    }
}
function checkGrooveL() {
    inputCalc($("#groove_l"));//длина
    for(var index in change_details) {
        var item = change_details[index];
        var d = Number($("#groove_d").val().replace(',', '.')).toFixed(1);
        var max;
        if ($('#grooveTypeSelect').val() == '0') {
            max = item.kromki.left + item.detailWidth + item.kromki.right - Number($('#groove_x').val()) - 0;
        }
        if ($('#grooveTypeSelect').val() == '1') {
            max = item.kromki.top + item.detailHeight + item.kromki.bottom - Number($('#groove_y').val()) - 0;
        }
        var val = Number($("#groove_l").val().replace(',', '.')).toFixed(1);
        val = Math.abs(val);
        if ($("#grooveAllWidth").prop("checked")) {
            var min = 0;
        } else {
            var min = (d < 6) ? 120 : d;
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-DLINA']+'\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
            // showErrorMessage('Неверное значение длины.\nЗначение должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
            $('#groove_l').val('');
            $('#groove_l').focus();
            return false;
        } else {
            $('#groove_l').val(val > 0 ? val : '');
            return true;
        }
    }
}

function checkGrooveR(){
    inputCalc($("#groove_sp_r"), 0);
    var radius = Number($("#groove_sp_r").val().replace(',', '.')).toFixed(0);
    var min = 3;
    var max = Math.floor(Math.min($("#groove_d").val(), $("#groove_l").val()) / 2);
    if ((radius < min || radius > max) && $('#grooveRFieldset').is(":visible")){
        alert(LANG['BAD-VALUE-RADIUS-MUST']+`${min} мм до ${max} мм.`);
        return false;
    }
    return true;
}

function showHideR(){ //Скрываем/отображаем радиус 
    var side = Number($('#grooveSideSelect').val());
    var full = Number($("#grooveAllWidth").prop("checked"));
    if ([1,6].indexOf(side) != -1 && full == 0){
        $('#grooveRFieldset').show();
    } else{
        $('#grooveRFieldset').hide();
    }
}





// function markSide(side_id, keep_prev) {
//     if (!keep_prev) {
//         $('[id^="svg-side-"] .detail-side').css("stroke", "black");
//     }
//     $('#svg-side-' + side_id + ' .detail-side').css("stroke", "red");
// }





// function setGroovePreset() {
//     $.ajax({
//         type: "POST",
//         async: false,
//         url: "system/controllers/JsonController.php",
//         data: ({controller:'Additives', action: 'getGroovePreset', side: $('#grooveSideSelect').val()}),
//         dataType: 'json',
//         success: function (data) {
//             var objSel = document.getElementById("groovePresetSelect");
//             if (objSel) {
//                 objSel.options.length = 0;
//                 var i = 0;
//                 for (key in data) {
//                     objSel.options[i++] = new Option(key, data[key]);
//                 }
//                 $('#groovePresetSelect').change();
//             }
//         }
//     });
// }
// more very interesting methods, but not all need

function delGroove(grooveKey) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'delDetailGroove', detail_key: detailKey, groove_key: grooveKey}),
        dataType: 'json',
        success: function (data) {
            getGrooves();
        }
    });
}

function addGroove(callback) {
        // for(var index in change_details) {
    //     var itemm = change_details[index];

    var selects = $('.grooveLinkingSelect');
    groove_linking_x = (selects[0].value == 'r');
    groove_linking_y = (selects[1].value == 't');
    var resultKeys = [];
        if (checkGrooveX() && checkGrooveY() && checkGrooveZ() && checkGrooveD() && checkGrooveL() && checkGrooveR()) {
            var params = {};
            $(getChangeKeys()).each(function (i, index) {
                var grooveExt = $('#grooveExt').prop("checked") ? 1 : 0;
                var x = Number($('#groove_x').val());
                var y = Number($('#groove_y').val());

                var x_result = x;
                var y_result = y;


                params.id = index;
                params.side = Number($('#grooveSideSelect').val());
                params.type = Number($('#grooveTypeSelect').val());
                params.x = x_result;
                params.y = y_result;
                params.z = Number($('#groove_z').val());
                params.d = Number($('#groove_d').val());
                params.l = Number($('#groove_l').val());
                if ($('#grooveRFieldset').is(":hidden")){
                    params.radius = 0;
                } else{
                    params.radius = Number($('#groove_sp_r').val());
                }
                params.ext = grooveExt;
                params.bindV = groove_linking_x;
                params.bindH = groove_linking_y;
                params.article = $('#grooveArtSelect').val();

                resultKeys.push(index);
                //result.push(index, params)
                // sendGroveForId(index, params);
            });
            // groove_linking_x = false;
            // groove_linking_y = false;
            sendGrooves(resultKeys, params);
            //setTimeout('location.reload()', 500);
            // location.reload();
        }else{
            $('#detailsActions').val('');
        }
    // }
}

function getChangeKeys() {
    var changes = [];
    $("input[name=Detail_ch]:checked").each(function(i, it){ changes.push($(it).val());});
    return changes;
}

function sendGrooves(resultKeys, params) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({
            controller:'Additives', action: 'setDetailGrooveMulti',
            detail_keys: resultKeys,
            side: params.side,
            type: params.type,
            x: params.x,
            y: params.y,
            z: params.z,
            d: params.d,
            l: params.l,
            radius: params.radius,
            ext: params.ext,
            bindV: params.bindV,
            bindH: params.bindH,
            article: params.article,
            groove_key: groove_key,
        }),
        dataType: 'json',
        success: function (data) {
        //     // groove_key = '';
        //     // initGroove();
        //     // getGrooves();
        //     // draw();
        //     // if (typeof params['callback'] == 'function') {
        //     //     params['callback']();
        //     // }
        //     // console.log('after send', params.grooveExt);
        //     // console.log('data', data);
        }
    });
}

function editGroove(grooveKey) {
//    showTopFormForEdit('panel-grooving', 'groovesForm');
    $('#modal8').animate({'left': '+100px'}, 'slow');
    $('#modal8').css("display","block");
    $('*[data-id="modal8"]').addClass('active');
    $('#modal8').draggable();
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getDetailGroove', detail_key: detailKey, groove_key: (grooveKey)}),
        dataType: 'json',
        success: function (data) {
            if (data['l'] == 0 || (data['type'] == 0 && data['l'] >= detailWidth || data['type'] == 1 && data['l'] >= detailHeight)) {
                $("#grooveAllWidth").prop("checked", true);
                //$("#grooveAllWidth").attr("checked", "checked");
            } else {
                $("#grooveAllWidth").prop("checked", false);
                //$("#grooveAllWidth").removeAttr("checked", "checked");
            }
            if (data['ext'] == "1") {
                $("#grooveExt").prop("checked", true);
                //$("#grooveExt").attr("checked", "checked");
            } else {
                $("#grooveExt").prop("checked", false);
                //$("#grooveExt").removeAttr("checked", "checked");
            }
            checkboxMaskUpdate('#grooves label');
            $('#grooveSideSelect').val(data['side']);
            $('#grooveTypeSelect').val(data['type']);
            $('#groove_x').val(data['x']);
            $('#groove_y').val(data['y']);
            $('#groove_z').val(data['z']);
            $('#groove_d').val(data['d']);
            $('#groove_l').val(data['l']);
            groove_key = grooveKey;
            $("#addButtonGroove").text(LANG['SAVE']);
            $("#addButtonGroove").removeClass("btn-success");
            $("#addButtonGroove").addClass("btn-danger");
            $('#grooveAllWidth').change();
            $('#grooveSideSelect').change();
            $('#grooveTypeSelect').change();
            $('#groove_x').change();
            $('#groove_y').change();
            $('#groove_z').change();
            $('#groove_d').change();
            $('#groove_l').change();
            $('#groovesTable tr').removeClass("info");
            $('#groovesTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
            $("#grooveKeyId-" + grooveKey).addClass("info");
            $("#grooveKeyId-" + grooveKey + '.danger').addClass("danger-edit").removeClass("danger");
            $('#collapseGrooving').collapse("show");
            window.frames[0]
                ? window.frames[0].document.getElementById('panel-grooving').scrollIntoView()
                : window.document.getElementById('panel-grooving').scrollIntoView();
        }
    });
}

// заполняем список сторон для фрезировки
function setGrooveSide() {
    $.ajax({
        type: "POST",
        async: false,
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getGrooveSides'}),
        dataType: 'json',
        success: function (data) {
            var objSel = document.getElementById("grooveSideSelect");
            if (objSel) {
                objSel.options.length = 0;
                var i = 0;
                for (key in data) {
                    objSel.options[i++] = new Option(key, data[key]);
                }
            }
        }
    });
}
//-------------start seen this //
function setGroovePreset() {
    var side = Number($('#grooveSideSelect').val());
    var objSel = document.getElementById("groovePresetSelect");
    if (objSel) {
        objSel.options.length = 0;
        var i = 0;
        for (key in groovePreset[side]) {
            objSel.options[i++] = new Option(key, groovePreset[side][key]);
        }
        $('#groovePresetSelect').change();
    }
}

function getGroovePreset() {
    $.ajax({
        type: "POST",
        async: false,
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getGroovePreset'}),
        dataType: 'json',
        success: function (data) {
            groovePreset = data;

        }
    });
}
//-------------end seen this //
function setGrooveType() {
    $.ajax({
        type: "POST",
        async: false,
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getGrooveType'}),
        dataType: 'json',
        success: function (data) {
            var objSel = document.getElementById("grooveTypeSelect");
            if (objSel) {
                objSel.options.length = 0;
                var i = 0;
                for (key in data) {
                    objSel.options[i++] = new Option(key, data[key]);
                }
            }

            $(objSel).change();
        }
    });
}

function initGroove() {
    if (window.ro) {
        $("#grooves").attr("disabled", true);
        return;
    }
    $('#grooveSideSelect').val(1);
    $('#grooveTypeSelect').val(0);
    $('#grooveTypeSelect').change();
    $('#groove_x').val('');
    $('#groove_y').val('');
    $('#groove_z').val('');
    $('#groove_d').val('');
    $('#groove_l').val('');
    $("#addButtonGroove").text(LANG['ADD']);
    $("#addButtonGroove").addClass("btn-success");
    $("#addButtonGroove").removeClass("btn-danger");
    $("#grooveAllWidth").change();
}

function getDetailForId(detail_key) {

    //che blya?
    // var detail_key = detail_key || location.search.slice(location.search.indexOf('?') + 1);
    // detail_key = Number(detail_key) > 0 ? Number(detail_key) : 0;
    // $('#detailSelect').val(detail_key);
    // if ($('#detailSelect').val() == null) {
    //     var key = $('#detailSelect option').val();
    //     $('#detailSelect').val(key);
    //     if ($('#detailSelect').val() != null) {
    //         changeDetail(key);
    //     } else {
    //         Navi('cutting');
    //     }
    // }
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetail', detail_key: detail_key}),
        success: function (data) {
            change_details[data['key']] = {
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
                'kromki'           : data['kromki']
            };


            //that need?
            // if (detailMarker == true || detailMarker == 1) {
            //     $('#marker_check').prop('checked', true);
            //     $('#marker_box').find('div.input_mask')[0].className = 'input_mask input_mask_checked';
            // } else {
            //     $('#marker_check').prop('checked', false);
            //     $('#marker_box').find('div.input_mask')[0].className = 'input_mask';
            // }

            //that hard
            // if (detailDecoratedSide == 'back') {
            //     $('#decoratedSide').find('option#backDecoratedSide').prop('selected', true);
            // } else {
            //     $('#decoratedSide').find('option#frontDecoratedSide').prop('selected', true);
            // }

            //what this???
            // if (typeof setEdgeOperations == 'function') {
            //     setEdgeOperations();
            // }

            // getGrooves();
            // getRabbets();
            // init();

            // $('#holeSideSelect').change();
        }
    });
}


// that last - constructor

//функционал дизэйбла кнопки хнык-хнык
function activate_addButton(dop_param) {
    // if(dop_param == false){
    //     $("#addButtonGroove").attr('disabled', 'true');
    //     return;
    // }
    //
    // var test1 = $('#groove_x').val();
    // var test2 = $('#groove_y').val();
    // var test3 = $('#groove_z').val();
    // var test4 = $('#groove_d').val();
    // var test5 = $('#groove_l').val();
    //
    // if((test1 || test2) && test3 && (test4 || test5)){
    //     $("#addButtonGroove").removeAttr('disabled');
    //     return;
    // }
    //
    // $("#addButtonGroove").attr('disabled', 'true');
}

function getDetailsForIds(keys) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetailsById', keys: keys}),
        success: function (data) {
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

function setGrooveParams() {
    $.ajax({
        type: "POST",
        async: false,
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getGrooveParams'}),
        dataType: 'json',
        success: function (data) {
            // console.log('par = ', data);
            var objSel = {};
            objSel['grooveSides'] = document.getElementById("grooveSideSelect");
            objSel['groovePreset'] = document.getElementById("groovePresetSelect");
            objSel['grooveType'] = document.getElementById("grooveTypeSelect");
            for (gr in objSel) {
                if (objSel[gr]) {
                    objSel[gr].options.length = 0;
                    var i = 0;
                    for (key in data[gr]) {
                        objSel[gr].options[i++] = new Option(key, data[gr][key]);
                    }
                }
            }
        }
    });
}

function start() {
    //сходу подгружаем инфу о выбраных деталях в массив change_details
    // $(getChangeKeys()).each(function (index, item) {
    //     getDetailForId(item);
    // });

    getDetailsForIds(getChangeKeys());

    setGrooveParams();
    getGroovePreset();
    // setGrooveSide();
    // setGroovePreset();
    // setGrooveType();
    initFunctions.push(initGroove);

    $('#grooveAllWidth').change();

    $('#addButtonGroove').click(function () {
        addGroove();
    });
    activate_addButton(false);

    //режим кнопки центрирования
    $('#badmain3 .spanbot.input-group-btn').css('display', 'none');
    // $('#badmain3 .input-group').css('width', '100%');

    $('#grooveArtSelectField').hide();
    //console.log(change_details);
};
