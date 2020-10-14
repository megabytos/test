/**
 * Created by DK on 11.10.17.
 */

$('#cut-submit').click(setCut);
$('#cut-delete').click(delCut);
$('#cutType').change(function () {
    setCutBases();
    $('#cutKromkaField').hide();
    $('#widthField').hide();
    $('#lathField').hide();
    $('#isLath').prop('checked', false);
    $('#isLath').change();
    // if ($(this).val() == '3') {
    //     $('#widthField').show();
    // } else {
    //     $('#widthField').hide();
    // }
    if ($(this).val()) {
        $('#cutKromkaField').show();
        if ($(this).val() == '3') {
            $('#baseField').show();
            // $('#countField').show();
        } else {
            $('#baseField').hide();
            $('#lathField').show();
            // $('#countField').hide();
            // if ($('#islath').prop('checked')){
            //     $('#widthField').show();
            // }
        }
    }
});

function helpSetBandListForCut(data) {
    var objSel = document.getElementById("cutKromka");
    if (objSel) {
        objSel.options.length = 0;
        objSel.options[0] = new Option('Нет', 0);
        var i = 1;
        for (var key in data) {
            objSel.options[i] = new Option(data[key]['number'] + data[key]['title'], data[key]['guid']);
            // if (bandId == data[key]['guid']) {
            //     objSel.options[i].selected = true;
            // }
            i++;
        }
    }
}

function setBandListForCut() {
    if (edgeList != '' || edgeList.length > 0) {
        helpSetBandListForCut(edgeList);
    } else {
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getEdgeList'}),
            dataType: 'json',
            success: function (data) {
                helpSetBandListForCut(data);
            }
        });
    }
}

function setCutTypes() {
    var objSel = document.getElementById("cutType");
    objSel.options.length = 0;
    objSel.options[0] = new Option(LANG['NO'], '');
    objSel.options[1] = new Option(LANG['PRODOLN'], '1');
    objSel.options[2] = new Option(LANG['POPERECH'], '2');
    objSel.options[3] = new Option(LANG['DIAGONAL'], '3');
    $('#baseField').hide();
}

function setCutBases() {
    var objSel = document.getElementById("cutBase");
    var cutType = $('#cutType').val();
    objSel.options.length = 0;
    if (cutType == '3') {
        objSel.options[0] = new Option(LANG['LEV-NIZ-S'], '1');
        objSel.options[1] = new Option(LANG['LEV-VERH-S'], '2');
    } else {
        // objSel.options[0] = new Option("Левый", '2');
        // objSel.options[1] = new Option("Верхний", '3');
        // objSel.options[2] = new Option("Правый", '4');
        // objSel.options[3] = new Option("Нижний", '5');
    }
}

// function checkWidth() {
//     wid = Number($("#cutSize").val().replace(',', '.')).toFixed(1);
//     if (wid <= 0) {
//         showErrorMessage('Остаток не может быть меньше 0.');
//         $('#cutSize').val('');
//         $('#cutSize').focus();
//         return false;
//     }
//     return true;
// }

function setCut() {
    type = $('#cutType').val();
    base = $('#cutBase').val();
    bindId = $('#cutKromka').val();
    wid = Number($("#cutSize").val().replace(',', '.')).toFixed(1);

    if (type != '') {
        console.log('sending');
        $("#cut-submit").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({
                controller: 'Additives', action: 'setDetailOperation',
                detail_key: detailKey,
                operationId: 'Cut',
                single: '1',
                data: {
                    type: type,
                    base: base,
                    kromka: bindId,
                    isLath: (($('#isLath').prop('checked')) ? 1 : 0),
                    width: wid,
                }
            }),
            dataType: 'json',
            success: function (data) {
                console.log('dt = ', data);
                $("#cut-submit").removeAttr("disabled");
                if (data.type == 'error') {
                    showErrorMessage(data.msg);
                    return false;
                } else {
                    draw();
                    var dataForEdge = {'key': detailKey};
                    setEdgeOperations(dataForEdge);
                    if (!data) {
                        $('#cutCount').html('0');
                    } else {
                        $('#cutCount').html(data);
                    }
                }
            }
        });
    } else {
        delCut();
    }
    return true;
}

$('#isLath').change(function () {
    if ($(this).prop('checked')) {
        $('#widthField').show();
    } else {
        $('#widthField').hide();
    }
});

function delCut() {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({
            controller: 'Additives', action: 'delDetailOperation',
            detail_key: detailKey,
            operationId: 'Cut',
        }),
        dataType: 'json',
        success: function (data) {
            draw();
            $('#cutCount').html('');
        }
    });
    return false;
}

function editCut() {
    $('#collapseCut').collapse("show");
    window.frames[0]
        ? window.frames[0].document.getElementById('panel-clipping').scrollIntoView()
        : window.document.getElementById('panel-clipping').scrollIntoView();
    $("#cutSize").select();
}

function initCut(detail) {
    if (window.ro) {
        $("fieldset[id^=cut]").attr("disabled", true);
        return;
    }
    if (detail && detail['cut']) {
        $('#cutType').val(detail['cut']['type']);
        $('#cutType').change();
        $('#cutBase').val(detail['cut']['base']);
        $('#cutKromka').val(detail['cut']['kromka']);
        if (detail['cut']['isLath']) {
            $("#cutSize").val(detail['cut']['width']);
        }
        $('#cutCount').html(detail['cut']['count']);
        $('#isLath').prop('checked', (detail['cut']['isLath']) ? true : false);
        $('#isLath').change();
    } else {
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({
                controller: 'Additives', action: 'getDetailOperationSingle',
                detail_key: detailKey,
                operationId: 'Cut',
            }),
            dataType: 'json',
            success: function (data) {
                if (data != null && data.type != 'error') {
                    $('#cutType').val(data['type']);
                    $('#cutType').change();
                    $('#cutBase').val(data['base']);
                    if (data['kromka']) {
                        $('#cutKromka').val(data['kromka']);
                    }
                    $('#isLath').prop('checked', (data['isLath']) ? true : false);
                    $('#isLath').change();
                    if (data['isLath']) {
                        $("#cutSize").val(data['width']);
                    }
                    $('#cutCount').html(data['count']);
                }
            }
        });
    }
    setCutTypes();
    setBandListForCut();
}
define(function () {
    return {
        init: initCut
    }
});
