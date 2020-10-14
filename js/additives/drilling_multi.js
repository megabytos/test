
var initFunctions = [];
var change_details = {};
var holeType = 0; //тип 0 - предустановленные, 1 - произвольные
var side = 1;               //текущая выбраная сторона
var holes = [];
var detailThickness = false;
var ident;
var holesDiam = [];

$('#holeSideSelect').change(function () {
    var prev_side = side;   //сохранили предыдущую сторону
    var reset_side = false;

    switch (Number(side)) {
        case 1:
        case 6:
            if ($(this).val() == 1 || $(this).val() == 6) {
                side = $(this).val();
                reset_side = true;
            }
            if ($('#holeDSelect').val() == 7 || $('#holeDSelect').val() == null) {
                setHoleDiam();
            }
            break;
        case 2:
        case 4:
            if ($(this).val() == 2 || $(this).val() == 4) {
                side = $(this).val();
                reset_side = true;
            }
            break;
        case 3:
        case 5:
            if ($(this).val() == 3 || $(this).val() == 5) {
                side = $(this).val();
                reset_side = true;
            }
            break;
    }

    if (reset_side) {

        for (var i in holes) {
            // if (holes[i][1] == prev_side) {
                // holes[i][1] = side;

            // }
            if (holes[i][1] == 1 || holes[i][1] == 6) { // Изменение привязки на плоскостях к соответствующему торцу после смены стороны
                switch (Number(side)) {
                    case 2:
                        holes[i][6] = '0';
//                        $('#holeLinkingSelectX').val('0');
                        break;
                    case 4:
                        holes[i][6] = 'w';
//                        $('#holeLinkingSelectX').val('w');
                        break;
                    case 3:
                        holes[i][7] = 'h';
//                        $('#holeLinkingSelectY').val('h');
                        break;
                    case 5:
                        holes[i][7] = '0';
//                        $('#holeLinkingSelectY').val('0');
                        break;
                }
            }
        }
        return;
    }


    setLinking();
    setHoleType(true);
    unsetEditMode();
    unsetSteps();
    // markSide($('#holeSideSelect').val());
});

function setHoleTypeSelect(data, setDiam) {
    if (setDiam) {
        diam = data['holeDiam'];
        data = data['holeParam'];
    }
    holes.length = 0;
    ident = data[0]['ident'] || ''; //устанавливаем отступ
    var s;
    for (key in data) {
        var z = data[key]['z'][thickness] || data[key]['z'][0];
        if (data[key]['side'] === '') {
            s = side;
        } else {
            s = data[key]['side'];
        }
        if (data[key]['s'] == '0') { // Если сверление глухое, проверяем макс толщину
            if (s == 1 | s == 6) {
                if (z > detailThickness) {
                    alert(LANG['DANNOE-OTV-DETH']+',\n'+LANG['DETH-MORE-DETH-THICK']);
                }
            }
            if (s == 2 | s == 3 | s == 4 | s == 5) {
                if (data[key]['d'] >= detailThickness - 6) {
                    alert(LANG['DANNOE-OTV-BY-DIAM']+', \n'+LANG['DIAM-S-DOPUSK-TOL-MAT']);
                }
            }
        }
        //--------------Автоподстановка--------------------------
        // switch (data[key]['x']) {
        //     case 'w/2':
        //         data[key]['x'] = detailWidth / 2;
        //         break;
        //     case 'h/2':
        //         data[key]['x'] = detailHeight / 2;
        //         break;
        //     case 't/2':
        //         data[key]['x'] = thickness / 2;
        //         break;
        // }
        // switch (data[key]['y']) {
        //     case 'w/2':
        //         data[key]['y'] = detailWidth / 2;
        //         break;
        //     case 'h/2':
        //         data[key]['y'] = detailHeight / 2;
        //         break;
        //     case 't/2':
        //         data[key]['y'] = thickness / 2;
        //         break;
        // }
        //--------------------------------------------------------
        holes.push([data[key]['ident'], s, data[key]['x'], data[key]['y'], z, data[key]['d'], data[key]['xl'], data[key]['yl'], data[key]['type']]);
    }
    if (holes[0][2] === '') {
        //if(holes[0][2].charAt[0] == '')
        $('#holeXFieldset').show();
        $('#holeXstepFieldset').show();
    } else {
        $('#holeXFieldset').hide();
        $('#holeXstepFieldset').hide();
    }
    if (holes[0][3] === '') {
        $('#holeYFieldset').show();
        $('#holeYstepFieldset').show();
    } else {
        $('#holeYFieldset').hide();
        $('#holeYstepFieldset').hide();
    }
    if (holes[0][5] === '') {
        $('#holeDFieldset').show();
        holeType = 1;
    } else {
        $('#holeDFieldset').hide();
        holeType = 0;
    }
    if (setDiam) {
        setHoleDiam(diam);
    } else {
        setHoleDiam();
    }

    //initHole();
    if (holes[0][4] === '') {
        $('#holeZFieldset').show();
    } else {
        $('#holeZFieldset').hide();
        $('#hole_z').val(holes[0][4]);
    }
    if(data[0].d){
        //$('#holeDSelect').val(Number(data[0].d));
        var objSel = document.getElementById("holeDSelect");
        objSel.options.length = 0;
        var i = 0;
        for (var key in data) {
            objSel.options[i++] = new Option(data[key].d+'мм', data[key].d);
        }
    }
        
}

$('#holeTypeSelect').change(function () {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleParam', type: $('#holeTypeSelect').val()}),
        dataType: 'json',
        success: function (data) {
            setHoleTypeSelect(data, false);
        }
    });
});
$("#holeLinkingSelectX").change(function () {
    for (var i in holes) {
        holes[i][6] = $("#holeLinkingSelectX").val();
    }
});
$("#holeLinkingSelectY").change(function () {
    for (var i in holes) {
        holes[i][7] = $("#holeLinkingSelectY").val();
    }
});

$("#hole_x").change(checkHoleX);
$("#hole_y").change(checkHoleY);
//$("#hole_z").change(checkHoleZ);
$("#holeDSelect").change(function () {
    init();
});

function setLinking() {
    side = $('#holeSideSelect').val();
    var objSelH = document.getElementById("holeLinkingSelectX");
    objSelH.options.length = 0;
    var objSelV = document.getElementById("holeLinkingSelectY");
    objSelV.options.length = 0;
    if (side == '1' | side == '6') {
        objSelH.options[0] = new Option(LANG['LEFT-S'], '0');
        objSelH.options[1] = new Option(LANG['RIGHT-S'], 'w');
        objSelV.options[0] = new Option(LANG['BOTTOM-N'], '0');
        objSelV.options[1] = new Option(LANG['TOP-V'], 'h');
    }
    if (side == '2' | side == '4') {
        objSelH.options[0] = new Option(LANG['PREDNIE'], '0');
        objSelV.options[0] = new Option(LANG['BOTTOM-N'], '0');
        objSelV.options[1] = new Option(LANG['TOP-V'], 'h');
    }
    if (side == '3' | side == '5') {
        objSelH.options[0] = new Option(LANG['LEFT-S'], '0');
        objSelH.options[1] = new Option(LANG['RIGHT-S'], 'w');
        objSelV.options[0] = new Option(LANG['PREDNIE'], '0');
    }
}
function setHoleDiam(diam) {
    if (diam) {
        var objSel = document.getElementById("holeDSelect");
        objSel.options.length = 0;
        var i = 0;
        for (var key in diam) {
            objSel.options[i++] = new Option(key, diam[key]);
        }
    } else {
        var objSel = document.getElementById("holeDSelect");
        objSel.options.length = 0;
        var i = 0;
        for (var key in holesDiam) {
            objSel.options[i++] = new Option(holesDiam[key] + 'мм', holesDiam[key]);
        }
        // $.ajax({
        //     type: "POST",
        //     url: "system/controllers/JsonController.php",
        //     data: ({controller: 'Additives', action: 'getHoleDiam', side: side}),
        //     // async: false,
        //     dataType: 'json',
        //     success: function (data) {
        //         var objSel = document.getElementById("holeDSelect");
        //         objSel.options.length = 0;
        //         var i = 0;
        //         for (var key in data) {
        //             objSel.options[i++] = new Option(key, data[key]);
        //         }
        //     }
        // });
    }


    var holeSideSelectValue = $('#holeSideSelect option:checked').val();
    if(holeSideSelectValue == '2') {
        $('#holeSideSelect').val(4).change();
    }
    else
    if(holeSideSelectValue == '4') {
        $('#holeSideSelect').val(2).change();
    }
    else
    if(holeSideSelectValue == '3') {
        $('#holeSideSelect').val(5).change();
    }
    else
    if(holeSideSelectValue == '5') {
        $('#holeSideSelect').val(3).change();
    }
    $('#holeSideSelect').val(holeSideSelectValue).change();


}
function setHoleType(change) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleType', side: $('#holeSideSelect').val()}),
        dataType: 'json',
        success: function (data) {

            var objSel = document.getElementById("holeTypeSelect");
            objSel.options.length = 0;
            var i = 0;
            for (var key in data)
                objSel.options[i++] = new Option(key, data[key]);
            side = $('#holeSideSelect').val(); //записываем в переменную выбраную сторону

            if (change) {
                $('#holeTypeSelect').change(); //заполняем типы отверстий по данной стороне
            }
        }
    });
}
//проверки координат произвольных отверстий
function checkHoleX(value, holeN) {
    inputCalc($("#hole_x"));
    var val = value > 0 ? value : Number($("#hole_x").val().replace(',', '.')).toFixed(1);
    var holeN = holeN || 0;
    var d = Number(holes[holeN][5] ? holes[holeN][5] : $("#holeDSelect").val());
    var ident = ident;
    if (!ident) {
        switch (Number(side)) {
            case 1:
            case 6:
                ident = d / 2 + ((constructorId == 'steklo') ? thickness : 4);
                break;
            default:
                ident = d / 2 + 3;
        }
        if (constructorId == 'dsp' || constructorId == 'stol') {
            if (d == 20) {
                ident = 9.5;
            } else if (d == 35) {
                ident = 12.5;
            }
        }
    }
    var min = Number(ident);
    var max;

    for (var detail_index in change_details) {
        var detail = change_details[detail_index];

        switch (Number(side)) {
            //если лицевая,тыльная проверяем на ширину детали
            case 1:
            case 6:
                max = Number(detail.detailWidth + detail.kromki.left + detail.kromki.right - ident);
                break;
            //если верхняя или нижняя проверяем на ширину детали с ограничением
            case 3:
            case 5:
                min = 20;
                max = Number(detail.detailWidth + detail.kromki.left + detail.kromki.right - 20);
                break;
            //если сторона левая или правая, проверяем на толщину детали с ограничением
            case 2:
            case 4:
                max = Number(detail.detailThickness - ident);
                if (max > 30)
                    max = 30;
                break;
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-COORDS-DETAIL-№'] + (Number(detail.detailKey)+1) + '!\n'+LANG['VALUE-ON-X-OS']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
            $("#hole_x").val('');
//        holes[holeN][2] = '';
            $("#hole_x").focus();
            return false;
        } else {
            $("#hole_x").val(val);
//        holes[holeN][2] = val;
//             return true;
        }
    }

    return true;
}
function checkHoleY(value, holeN) {
    inputCalc($("#hole_y"));
    var val = value > 0 ? value : Number($("#hole_y").val().replace(',', '.')).toFixed(1);
    var holeN = holeN || 0;
    var d = Number(holes[holeN][5] ? holes[holeN][5] : $("#holeDSelect").val());
    var ident = ident;
    if (!ident) {
        switch (Number(side)) {
            case 1:
            case 6:
                ident = d / 2 + ((constructorId == 'steklo') ? thickness : 4);
                break;
            default:
                ident = d / 2 + 3;
        }
        if (constructorId == 'dsp' || constructorId == 'stol') {
            if (d == 20) {
                ident = 9.5;
            } else if (d == 35) {
                ident = 12.5;
            }
        }
    }
    var min = Number(ident);
    var max;

    for (var detail_index in change_details) {
        var detail = change_details[detail_index];

        switch (Number(side)) {
            case 1:
            case 6:
                max = Number(detail.detailHeight + detail.kromki.top + detail.kromki.bottom - ident);
                break;
            case 3:
            case 5:
                max = Number(detail.detailThickness - ident);
                if (max > 30)
                    max = 30;
                break;
//        case 5:
//            max = 9.5;
//            break;
            case 2:
            case 4:
                min = 20;
                max = Number(detail.detailHeight + detail.kromki.top + detail.kromki.bottom - 20);
                break;
        }
        if (!(min <= val && val <= max)) {
            alert(LANG['BAD-VALUE-COORDS-DETAIL-№']+(Number(detail.detailKey)+1)+'!\n'+LANG['VALUE-ON-Y-OS']+'\nот ' + min + 'мм до ' + max + 'мм.');
            $("#hole_y").val('');
//        holes[holeN][3] = '';
            $("#hole_y").focus();
            return false;
        } else {
            $("#hole_y").val(val);
//        holes[holeN][3] = val;
//             return true;
        }
    }
    return true;
}
function checkHoleZ(value, holeN) {
    inputCalc($("#hole_z"));
    value = $("#hole_z").val();
    var val = value > 0 ? value : Number($("#hole_z").val().replace(',', '.')).toFixed(1);
    var holeN = 0;
    var maxD = (side == 1 || side == 6 ? maxDrillingDepthFlat : maxDrillingDepthEdge);
    var d = Number($("#holeDSelect").val());
    for (var detail_index in change_details) {
        var detail = change_details[detail_index];

        var min = (d == 7 && (side == 1 || side == 6)) ? (detail.detailThickness + 5 < maxD ? detail.detailThickness + 5 : maxD) : 1;
        var margin = 3; // (d == 15 || d == 20 || d == 35) ? 4 : 3;
        var max = (d == 7 && side == 1) ? maxD : (detail.detailThickness > maxD ? maxD : detail.detailThickness - margin);

        if ((side == 1 || side == 6) && ((val >= thickness && val < thickness + 5) || val == thickness )) {

            val = thickness + 5;
        }

        switch (Number(side)) {
            case 1://лицевая
            case 6://тыльная
                //if (holeType == 1) {
                switch (d) {
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                        max = (val >= detail.detailThickness || d == 7) ? maxD : (detail.detailThickness > maxD ? maxD : detail.detailThickness - margin);
                        break;
                    case 60:
                        max = maxMillingDepth;
                        break;

                }
                //}
                break;
            case 2://левая
            case 3://верхняя
            case 4://правая
            case 5://нижняя
                max = Number(maxD);
                break;
        }
        if (d == 2) {
            max = 5;
        }
        if (constructorId == 'steklo') {
            max = maxDrillingDepthFlat;
        }
        if ((d == 7 || d == 60) && val > 0 && val < detail.detailThickness) {
            alert(LANG['BAD-VALUE-DETH-FOR-DET-№']+(Number(detail.detailKey)+1)+'!\n'+LANG['OTV-DIAMETROM'] + d + LANG['MUST-NOT-BE-SILENSE']);
            $("#hole_z").val('');
//        holes[holeN][4] = '';
            $("#hole_z").focus();
            return false;
        }
//        if (val >= detail.detailThickness && materialType == 'fanera') {
//            alert('Невозможно сделать сквозное отверстие для фанеры!');
//            $("#hole_z").val('');
//            $("#hole_z").focus();
//            return false;
//        }
        if (!(min <= val && val <= max && min <= max)) {
            alert(LANG['BAD-VALUE-DETH-FOR-DET-№']+(Number(detail.detailKey)+1)+'!\n'+LANG['DETH'] + (((val > detail.detailThickness - margin && val < detail.detailThickness) || (val == 0 && (d != 7 || d != 60))) ? LANG['GLUH-OTV'] : '') + LANG['MUST-BE']+'\nот ' + min + 'мм до ' + max + 'мм.');
            $("#hole_z").val('');
//        holes[holeN][4] = '';
            $("#hole_z").focus();
            return false;
        } else {
            $("#hole_z").val(val);
//        holes[holeN][4] = val;
        }
    }

    return true;
}
function addHole() {

    // for (var i = 0; i < holes.length; i++) {
        var x = $('#hole_x').val();
        var y = $('#hole_y').val();
        var s = side;
        side = $('#holeSideSelect').val();
        if (checkHoleX(x, 0) && checkHoleY(y, 0)) {
            var z = $('#hole_z').val();
            var d = $('#holeDSelect').val();
            if (checkHoleZ(z, 0)) {
                z = $('#hole_z').val();
                $("#addButton").attr("disabled", "disabled");
                for (var detail_index in change_details) {
                    var detail = change_details[detail_index];
                    $.ajax({
                        type: "POST",
                        url: "system/controllers/JsonController.php",
                        data: ({
                            controller: 'Additives', action: 'setDetailHoles',
                            detail_key: detail.detailKey,
                            holes: ({
                                hole: ({
                                    hole_key: detail.holes.length,
                                    side: holes[0][1] ? holes[0][1] : $('#holeSideSelect').val(),
                                    x: x,
                                    y: y,
                                    z: z,
                                    d: d,
                                    xl: holes[0][6] ? holes[0][6] : $("#holeLinkingSelectX").val(),
                                    yl: holes[0][7] ? holes[0][7] : $("#holeLinkingSelectY").val(),
                                    type: ($('#holeTypeSelect').val() > 19 && $('#holeTypeSelect').val() < 28) ? holes[0][8] : $('#holeTypeSelect').val(),
                                })
                            })
                        }),
                        dataType: 'json',
                        success: function (data) {
                            location.reload();
                            // if (data['err']) {
                            //     alert('Ошибка!\nОтверстие ближе 5мм к отверстию № ' + data[0]);
                            //     $("#addButton").removeAttr("disabled");
                            //     return false;
                            // }
                            // detailHoles.length = 0;
                            // for (var key in data) {
                            //     detailHoles.push([Number(data[key]['side']), Number(data[key]['x']), Number(data[key]['y']), Number(data[key]['z']), Number(data[key]['d']), Number(data[key]['key']), Boolean(data[key]['is_out'])]);
                            // }
                            // draw();
                            // showHoles();
                            // if (hole_key != '') {
                            //     $('#holeSideSelect').change();
                            // }
                            // hole_key = '';
                            // var hole_x_step = Number($("#hole_x_step").val().replace(',', '.')) / holes.length;
                            // var hole_y_step = Number($("#hole_y_step").val().replace(',', '.')) / holes.length;
                            // if (hole_x_step != 0 || hole_y_step != 0) {
                            //     $("#hole_x").val(Number($("#hole_x").val()) + hole_x_step);
                            //     $("#hole_y").val(Number($("#hole_y").val()) + hole_y_step);
                            //     //$("#hole_x").change();
                            //     //$("#hole_y").change();
                            //     //setHoleType();
                            // } else {
                            //     $('#hole_x').val('').focus();
                            //     $('#hole_y').val('');
                            // }
                            //
                            // if (!$("#addButton").hasClass("btn-success")) {
                            //     setHoleType(true);
                            // }
                            // $("#holeKeyId-" + hole_key).removeClass("info");
                            //
                            // $("#addButton").removeAttr("disabled");
                            // unsetEditMode();
                        }
                    });
                }
            } else {
                return false;
            }
        } else {
            // alert('error');
            return false;
        }
        side = s;
    // }

    return true;
}
function delHole(holeKey) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'delDetailHole', detail_key: detailKey, hole_key: holeKey}),
        dataType: 'json',
        success: function (data) {
            getHoles();
        }
    });
}


function getHoles(holes) {
    if (holes) {
        detailHoles.length = 0;
        for (var key in holes)
            detailHoles.push([
                Number(holes[key]['side']),
                Number(holes[key]['x']),
                Number(holes[key]['y']),
                Number(holes[key]['z']),
                Number(holes[key]['d']),
                Number(holes[key]['key']),
                Boolean(holes[key]['is_out']),
                holes[key]['xl'] == "w",
                holes[key]['yl'] == "h",
            ]);
        showHoles();
    } else {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey}),
            success: function (data) {
                detailHoles.length = 0;
                for (var key in data)
                    detailHoles.push([
                        Number(data[key]['side']),
                        Number(data[key]['x']),
                        Number(data[key]['y']),
                        Number(data[key]['z']),
                        Number(data[key]['d']),
                        Number(data[key]['key']),
                        Boolean(data[key]['is_out']),
                        data[key]['xl'] == "w",
                        data[key]['yl'] == "h",
                    ]);
                // if(redraw) {
                //     draw();
                // }
                showHoles();
            }
        });
    }
}

function delHoleForAll(holeKey) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'delDetailHoles', detail_key: detailKey, hole_keys: holeKey}),
        dataType: 'json',
        success: function (data) {
            getHoles();
        }
    });
}
function editHole(holeKey) {

//    showTopFormForEdit('panel-drilling', 'holesForm');
    holes.length = 0;
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getDetailHole', detail_key: detailKey, hole_key: (holeKey)}),
        dataType: 'json',
        success: function (data) {
            $('#holeSideSelect').val(data['side']);
            setHoleType(true);
            side = data['side'];
            setHoleDiam();
            setLinking();
            // var objSel = document.getElementById("holeTypeSelect");
            // objSel.options.length = 0;
            // objSel.options[0] = new Option('---', 0);
            $("#holeTypeSelect").val(data['type']);
            $("#holeDSelect").val(data['d']);
            $("#hole_x").val(data['x']);
            $("#hole_y").val(data['y']);
            $("#hole_z").val(data['z']);
            $("#holeLinkingSelectX").val(data['xl'] ? data['xl'] : 0);
            $("#holeLinkingSelectY").val(data['yl'] ? data['yl'] : 0);
            $("#addButton").text('Сохранить');
            $("#addButton").removeClass("btn-success");
            $("#addButton").addClass("btn-danger");
            hole_key = holeKey;
            $('#holeXFieldset').show();
            $('#holeYFieldset').show();
            if (data['type']) {
                $('#holeZFieldset').hide();
                $('#holeDFieldset').hide();
            } else {
                $('#holeZFieldset').show();
                $('#holeDFieldset').show();
            }
            holes.length = 0;
            holes.push(['', '', '', '', '', '']);
            $('#holesTable tr').removeClass("info");
            $('#holesTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
            $("#holeKeyId-" + holeKey).addClass("info");
            $("#holeKeyId-" + holeKey + '.danger').addClass("danger-edit").removeClass("danger");
            $('#collapseDrilling').collapse("show");
            window.frames[0]
                ? window.frames[0].document.getElementById('panel-drilling').scrollIntoView()
                : window.document.getElementById('panel-drilling').scrollIntoView();
            //$("#holesTable").children(":button, a").attr("disabled", "disabled");
        }
    });
}
function copyHoles(holesKey, direction, switch_layer, replace) {
    var holeData = [];
    for (var i = 0; i < holesKey.length; i++) {
        var holeKey = holesKey[i];
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailHole', detail_key: detailKey, hole_key: (holeKey)}),
            dataType: 'json',
            async: false,
            success: function (data) {
                data['key'] = holeKey;
                holeData.push(data);
            }
        });
    }

    var delSwitchedHoles = [];//массив для удаления из набора отвертий после перемещения на лицевую\тыльную сторону
    var delReplacedHoles = [];//массив для удаления из набора отвертий после перемещения в рамках одной стороны
    for (var i = 0; i < holeData.length; i++) {
        if (switch_layer) {
            switch (Number(holeData[i]['side'])) {
                case 1:
                    holeData[i]['side'] = '6';
                    delSwitchedHoles[i] = holeData[i]['key'];
                    break;
                case 6:
                    holeData[i]['side'] = '1';
                    delSwitchedHoles[i] = holeData[i]['key'];
                    break;
                default:
                    continue;
            }
        } else {
            switch (Number(holeData[i]['side'])) {
                case 1:
                case 6:
                    if (direction == 'copy_hor') {
                        holeData[i]['xl'] = holeData[i]['xl'] == '0' ? 'w' : '0';
                    }
                    if (direction == 'copy_ver') {
                        holeData[i]['yl'] = holeData[i]['yl'] == '0' ? 'h' : '0';
                    }
                    break;
                case 3:
                case 5:
                    if (direction == 'copy_hor') {
                        holeData[i]['xl'] = holeData[i]['xl'] == '0' ? 'w' : '0';
                    }
                    if (direction == 'copy_ver') {
                        holeData[i]['side'] = holeData[i]['side'] == '3' ? '5' : '3';
                    }
                    break;
                case 2:
                case 4:
                    if (direction == 'copy_hor') {
                        holeData[i]['side'] = holeData[i]['side'] == '2' ? '4' : '2';
                    }
                    if (direction == 'copy_ver') {
                        holeData[i]['yl'] = holeData[i]['yl'] == '0' ? 'h' : '0';
                    }
                    break;
            }
        }
        var dataResult = $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({
                controller: 'Additives', action: 'setDetailHoles',
                detail_key: detailKey,
                hole_key: '',
                side: holeData[i]['side'],
                x: holeData[i]['x'],
                y: holeData[i]['y'],
                z: holeData[i]['z'],
                d: holeData[i]['d'],
                xl: holeData[i]['xl'],
                yl: holeData[i]['yl'],
                type: holeData[i]['type'],
            }),
            dataType:'json',
            context: document.body,
            global: false,
            async: false,
            success: function (data) {
                return data;
            }
        }).responseJSON;


        if (dataResult['err']) {
            // showErrorMessage('Ошибка!\nОтверстие ближе 5мм к отверстию № ' + dataResult[0]);
            $("#addButton").removeAttr("disabled");
            $('#holesActions').val('');
            //return;
        } else {
            if (replace) {
                delReplacedHoles[i] = holeData[i]['key'];

            }
            detailHoles.length = 0;
            for (key in dataResult)
                detailHoles.push([Number(dataResult[key]['side']), Number(dataResult[key]['x']), Number(dataResult[key]['y']), Number(dataResult[key]['z']), Number(dataResult[key]['d']), Number(dataResult[key]['key']), Boolean(dataResult[key]['is_out']), Number(dataResult[key]['type'])]);
            draw();
            showHoles();
            $('#holesActions').val('');
        }

    }

    //удаление из набора массив отвертий после перемещения на лицевую\тыльную сторону
    if (switch_layer) {
        delHoles(delSwitchedHoles, true);
    }
    if (replace) {
        delHoles(delReplacedHoles, true);
    }
}

function delHoles(holesKey, q_flag) {

    if(q_flag === undefined) {//не выводить попап-сообщение
        // if (showConfirmMessage("Все выбранные отверстия будут удалены", delHoleForAll, holesKey)){
            $('#holesActions').val('');
        // } else {
        //     $('#holesActions').val('');
        //     selectAllHoles();
        // }
    } else {
        delHoleForAll(holesKey);
    }

}
function getSelectedDrillings() {
    var keys = [];
    $('input[id^=Hole-]:checked').each(function () {
        keys.push($(this).val());
    });
    return keys;
}
function universalDelete(functions, args){
    functions(args);
}
function unsetEditMode() {
    $('#holesTable tr').removeClass("info");
    $("#addButton").text(LANG['ADD']);
    $("#addButton").removeClass("btn-danger");
    // $("#addButton").addClass("btn-success");
}
function unsetSteps() {
    $("#hole_x_step").val('');
    $("#hole_y_step").val('');
}
function selectAllHoles() {
    if ($('#Holes').prop('checked')) {
        var hole = $('input[id^=Hole-]');
        hole.prop('checked', true);
    } else {
        $('input[id^=Hole-]').prop('checked', false);
    }
}

/**
 * 3 заполняет список сторон детали для сверления
 */
function setHoleSide() {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleSides'}),
        dataType: 'json',
        success: function (data) {
            var objSel = document.getElementById("holeSideSelect");
            if (objSel) {
                objSel.options.length = 0;
                var i = 0;
                for (key in data)
                    objSel.options[i++] = new Option(key, data[key]);
                initHole(); //$('#holeSideSelect').change();
            }
        }
    });
}

function setHoleSelParams() {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleSelParams', side: $('#holeSideSelect').val()}),
        dataType: 'json',
        success: function (data) {
            var objSel = document.getElementById("holeTypeSelect");
            objSel.options.length = 0;
            var i = 0;
            for (var key in data['holeType'])
                objSel.options[i++] = new Option(key, data['holeType'][key]);
            side = $('#holeSideSelect').val(); //записываем в переменную выбраную сторону

            // $('#holeTypeSelect').change(); //заполняем типы отверстий по данной стороне
            setHoleTypeSelect(data, true);
        }
    });
}

function getHoleDiam(){
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleDiam', side: side}),
        // async: false,
        dataType: 'json',
        success: function (data) {
            for (var key in data) {
                holesDiam.push(data[key]);
            }
        }
    });
}

function initHole() {
    if (window.ro) {
        $("#holes").attr("disabled", true);
        return;
    }
    side = $('#holeSideSelect').val();
    if (side == '1' | side == '6') {//передняя или задняя
        if (holeType == 1) {
            ident = (Number($('#holeDSelect').val()) / 2) + 5;
        }
    }
    if (side == '2' | side == '4' | side == '3' | side == '5') {
        if (holeType == 1)
            ident = (Number($('#holeDSelect').val()) / 2) + 3;
    }

    $("#hole_x").val('');
    $("#hole_y").val('');
    $("#hole_z").val('');

    $(change_details).each(function (index, item) {
        if(!detailThickness || Number(item['detailThickness']) < detailThickness)
            detailThickness = Number(item['detailThickness']);
    });

    unsetSteps();
    $('#holeSideSelect').val('1');
    setHoleSelParams();
    // setHoleType(true);
    //$('#holeSideSelect').change();
    setLinking();
    unsetEditMode();
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
                'holes'            : data['holes']
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
            // change_details = data;
        }
    });
}

function start() {
    //сходу подгружаем инфу о выбранных деталях в массив change_details
    //ну как так можно было, почему не сходу все...
    // $(getChangeKeys()).each(function (index, item) {
    //     getDetailForId(item);
    // });

    getDetailsForIds(getChangeKeys());
    getHoleDiam();

    setHoleSide();
    initFunctions.push(initHole);

    $('#addButton').click(function () {
        addHole();
    });

    //режим кнопки центрирования
    $('#badmain .spanbot.input-group-btn').css('display', 'none');
    // $('#badmain .input-group').css('width', '100%');
}
