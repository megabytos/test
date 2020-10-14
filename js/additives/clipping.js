function helpSetBandListForClipping(data, bandIds) {

    var objSelH = document.getElementById("cutHBand");
    var objSelV = document.getElementById("cutVBand");
    if(materialType !='stol'){
        if (objSelH && objSelV) {
            objSelH.options.length = 0;
            objSelV.options.length = 0;
            objSelH.options[0] = new Option(LANG['NO'], '');
            objSelV.options[0] = new Option(LANG['NO'], '');
            var i = 1;
            for (var key in data) {
                if (Number(data[key]['height']) + 3 < detailThickness || data[key]['type'] == 'lazer') {
                    continue;
                }
                objSelH.options[i] = new Option(data[key]['number'] + data[key]['title'], data[key]['guid']);
                objSelV.options[i] = new Option(data[key]['number'] + data[key]['title'], data[key]['guid']);
                if (bandIds.h == data[key]['guid']) {
                    objSelH.options[i].selected = true;
                }
                if (bandIds.v == data[key]['guid']) {
                    objSelV.options[i].selected = true;
                }
                i++;
            }
        }
    }else{
        if (objSelH) {
            objSelH.options.length = 0;
            objSelH.options[0] = new Option(LANG['NO'], '');
            var i = 1;
            for (var key in data) {
                if (Number(data[key]['height']) + 3 < detailThickness || data[key]['type'] == 'lazer') {
                    continue;
                }
                objSelH.options[i] = new Option(data[key]['number'] + data[key]['title'], data[key]['guid']);
                if (bandIds.h == data[key]['guid']) {
                    objSelH.options[i].selected = true;
                }
                i++;
            }
        }
    }

}

function setBandListForClipping(bandIds) {
    if (!bandIds) {
        bandIds = {h: '', v: ''};
    } else if (!bandIds.h) {
        bandIds.h = ''
    } else if (!bandIds.v) {
        bandIds.v = ''
    }
    if (edgeList === '' || edgeList.length > 0) {
        helpSetBandListForClipping(edgeList, bandIds);
    } else {
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getEdgeList'}),
            dataType: 'json',
            success: function (data) {
                setEdgeList(data);
                helpSetBandListForClipping(data, bandIds);
            }
        });
    }
}

function setHBase() {
//    if ($('#cutHBase').val()) {
//        $("#cutVBase").val('');
//        $("#clippingVParams").attr("disabled", true);
//    } else {
//        $("#clippingVParams").removeAttr("disabled");
//    }
    markSide($('#cutHBase').val());
}
function setVBase() {
//    if ($('#cutVBase').val()) {
//        $("#cutHBase").val('');
//        $("#clippingHParams").attr("disabled", true);
//    } else {
//        $("#clippingHParams").removeAttr("disabled");
//    }
    markSide($('#cutVBase').val());
}

function setClippingBases() {
    var objSelH = document.getElementById("cutHBase");
    objSelH.options.length = 0;
    var objSelV = document.getElementById("cutVBase");
    objSelV.options.length = 0;
    objSelH.options[0] = new Option(LANG['NO'], '');
    objSelH.options[1] = new Option(LANG['LEFT-S'], '2');
    objSelH.options[2] = new Option(LANG['RIGHT-S'], '4');
    objSelV.options[0] = new Option(LANG['NO'], '');
    objSelV.options[1] = new Option(LANG['BOTTOM-N'], '5');
    objSelV.options[2] = new Option(LANG['TOP-V'], '3');
}

function checkCutHSize(value) {
    inputCalc($("#cutHSize"));
    return true;
    var val = value > 0 ? value : Number($("#cutHSize").val().replace(',', '.')).toFixed(1);
//    if (val>0 && !$('#cutHBase').val()) {
//        showMessage('Необходимо выбрать базовый край от которого будет производиться отступ для горизонтального размера.');
//        return false;
//    }
    var min = Math.min(minWidth, minHeight);
    var max = Number(detailWidth + kLeftThick + kRightThick - 10);
    if (val > 0 && !(min <= val && val <= max)) {
        showErrorMessage(LANG['NEVERN-ZNACH-RAZMER-BY-GORIZONT']+'\n'+LANG['ZNACH-MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
        $("#cutHSize").val('');
        $("#cutHSize").focus();
        return false;
    } else {
        $("#cutHSize").val(val);
        return true;
    }
}
function checkCutVSize(value) {
    inputCalc($("#cutVSize"));
    return true;
    var val = value > 0 ? value : Number($("#cutVSize").val().replace(',', '.')).toFixed(1);
//    if (val>0 && !$('#cutVBase').val()) {
//        showMessage('Необходимо выбрать базовый край от которого будет производиться отступ для вертикального размера.');
//        return false;
//    }
    var min = Math.min(minWidth, minHeight);
    var max = Number(detailHeight + kTopThick + kBottomThick - 10);
    if (val > 0 && !(min <= val && val <= max)) {
        showErrorMessage(LANG['NEVERN-RAZMER-BY-VERTICAL']+'\n'+LANG['ZNACH-MUST-BE']+'\n'+ LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
        $("#cutVSize").val('');
        $("#cutVSize").focus();
        return false;
    } else {
        $("#cutVSize").val(val);
        return true;
    }
}

function editClipping(focusId) {
//    showTopFormForEdit('panel-clipping', 'clippingForm');
    if (!window.ro) {
        $("#clippingHParams").removeAttr("disabled");
        $("#clippingVParams").removeAttr("disabled");
    }
    $('#collapseClipping').collapse("show");
    if (focusId) {
        $("#" + focusId).select();
    }
    $('#cutHBase').change();
    $('#cutVBase').change();
    window.frames[0]
        ? window.frames[0].document.getElementById('panel-clipping').scrollIntoView()
        : window.document.getElementById('panel-clipping').scrollIntoView();
}

function setClippingForStol() {

    showConfirmMessage(LANG['CONFIRM-PERENOS-DOP-OBR'], function () {
        $('.svg-clipping-rest').remove();
        $('.svg-clipping').remove();
        $('.svg-clipping-dim').remove();
        var edging = g_detail.getModule('edging');

        if (checkCutHSize() && checkCutVSize()) {
            $("#clipping-submit").attr("disabled", true);
            g_detail.setOperation(
                'clipping',
                {
                    detail_key: detailKey,
                    cutHSize: $('#cutHSize').val(),
                    cutHBase: $('#cutHBase').val(),
                    cutHBand: $('#cutHBand').val(),
                    cutVSize: $('#cutVSize').val(),
                    cutVBase: $('#cutVBase').val(),
                    cutVBand: $('#cutVBand').val(),
                },
                function(data){
                    var edges = data[1];
                    $("#clipping-submit").removeAttr("disabled");
                    if (data.type == 'error') {
                        showErrorMessage(data.msg);
                        return false;
                    }

                    if ((Number($("#cutVBase").val()) == 5)) {
                        kromkaTopCut = Number(edges['top']['cut']);
                    }
                    if ((Number($("#cutVBase").val()) == 3)) {
                        kromkaBottomCut = Number(edges['bottom']['cut']);
                    }
                    edging.setval('cut_top', kromkaTopCut);
                    edging.setval('cut_bottom', kromkaBottomCut);
                    draw();
                }
            );
            var shapesByPattern = g_detail.getModule('shapesByPattern');
            shapesByPattern.use('table');

        } else {
            return false;
        }
        return true;
    });
}

function setClipping() {
    $('.svg-clipping-rest').remove();
    $('.svg-clipping').remove();
    $('.svg-clipping-dim').remove();
    var edging = g_detail.getModule('edging');
    if (checkCutHSize() && checkCutVSize()) {
        $("#clipping-submit").attr("disabled", true);
        var clipping = {
            cutHSize: $('#cutHSize').val(),
            cutHBase: $('#cutHBase').val(),
            cutHBand: $('#cutHBand').val(),
            cutVSize: $('#cutVSize').val(),
            cutVBase: $('#cutVBase').val(),
            cutVBand: $('#cutVBand').val()
        };
        g_detail.setOperation(
            'clipping',
            {
                detail_key: detailKey,
                cutHSize: $('#cutHSize').val(),
                cutHBase: $('#cutHBase').val(),
                cutHBand: $('#cutHBand').val(),
                cutVSize: $('#cutVSize').val(),
                cutVBase: $('#cutVBase').val(),
                cutVBand: $('#cutVBand').val(),
            },
            function (data) {
                $("#clipping-submit").removeAttr("disabled");
                drawSVGForClipping(clipping, detailKey);
            }
        );

    } else {
        return false;
    }

    return true;
}

function drawSVGForClipping(clipping, detailKey) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getSVGForClipping', clipping: clipping, detailKey: detailKey}),
        dataType: 'json',
        success: function (data) {

            var svgClippingMain = data['svg_clipping_Side_String'];
            var svgClippingDop = data['svg_clipping_Side_Dim-Line'];


            $('#svg-detail').html($('#svg-detail').html() + svgClippingMain);
            $('#svg-dimensions').html($('#svg-dimensions').html() + svgClippingDop);
            draw();
        }
    });
}

function cancelClipping(e) {

    $('#cutHBase').val("");
    $('#cutHSize').val("");
    $('#cutHBand').val("");
    $('#cutVBase').val("");
    $('#cutVSize').val("");
    $('#cutVBand').val("");

    $('.svg-clipping-rest').remove();
    $('.svg-clipping').remove();
    $('.svg-clipping-dim').remove();

    g_detail.setOperation(
        'clipping',
        {
            detail_key: detailKey,
            cutHSize: $('#cutHSize').val(),
            cutHBase: $('#cutHBase').val(),
            cutHBand: $('#cutHBand').val(),
            cutVSize: $('#cutVSize').val(),
            cutVBase: $('#cutVBase').val(),
            cutVBand: $('#cutVBand').val(),
        },
        function(data){
            var edges = data[1];
            $('#cutHBase').val("");
            $('#cutHSize').val("");
            $('#cutHBand').val("");
            $('#cutVBase').val("");
            $('#cutVSize').val("");
            $('#cutVBand').val("");
            if (constructorId == 'stol') {
                if ((Number($("#cutVBase").val()) == 5)) {
                    kromkaTopCut = Number(edges['top']['cut']);
                }
                if ((Number($("#cutVBase").val()) == 3)) {
                    kromkaBottomCut = Number(edges['bottom']['cut']);
                }
                var edging = g_detail.getModule('edging');
                edging.methods.del_stolcuts();
            }
        }
    );

    return true;

}

function initClipping(detail, global_data) {
    showClipping();
    if (window.ro) {
        $("fieldset[id^=clipping]").attr("disabled", true);
        return;
    }

    setClippingBases();
    setBandListForClipping();

    $("#clipping-submit").click(
        function () {
            if (constructorId == 'stol' && materialType != 'compact') {
                setClippingForStol();
            } else {
                setClipping();
            }
        });

    $("#clipping-cancel").click(cancelClipping);
    $("#cutHSize").change(checkCutHSize);
    $("#cutVSize").change(checkCutVSize);
    $('#cutHBase').change(setHBase);
    $('#cutVBase').change(setVBase);

    if (detail && detail['clipping']) {
        $('#cutHSize').val(detail['clipping']['cutHSize'] || '');
        $('#cutHBase').val(detail['clipping']['cutHBase']);
        $('#cutHBand').val(detail['clipping']['cutHBand']);
        $('#cutVSize').val(detail['clipping']['cutVSize'] || '');
        $('#cutVBase').val(detail['clipping']['cutVBase']);
        $('#cutVBand').val(detail['clipping']['cutVBand']);
        $('#cutHBase').change();
        $('#cutVBase').change();
    } else {
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailClipping', detail_key: detailKey}),
            dataType: 'json',
            success: function (data) {
                $('#cutHSize').val(data['cutHSize']);
                $('#cutHBase').val(data['cutHBase']);
                $('#cutHBand').val(data['cutHBand']);
                $('#cutVSize').val(data['cutVSize']);
                $('#cutVBase').val(data['cutVBase']);
                $('#cutVBand').val(data['cutVBand']);
                $('#cutHBase').change();
                $('#cutVBase').change();
            }
        });
    }
}

define(function () {
    return {
        init: initClipping
    }
});
