/**
 * Created by Dima on 27.07.17.
 */

function addShape() {
    shapeControlID = 0;
    detailShape.length = 0;
    $("#formShape").html('');
    $("#s_x0").val('');
    $("#s_y0").val('');
    if (shapeTmp.length >= 2) {
        for (var i = 1; i < shapeTmp.length; ++i) {
            var type = shapeTmp[i]['type'];
            var x1 = shapeTmp[i - 1]['x'];
            var y1 = shapeTmp[i - 1]['y'];
            var x2 = shapeTmp[i]['x'];
            var y2 = shapeTmp[i]['y'];
            var r = shapeTmp[i]['r'];
            if (Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
                r_min = Math.abs(x1 - x2);
            } else {
                r_min = (Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))) / 2;
            }
            if (r < r_min) {
                r = r_min;
            }
            var arc_direction = shapeTmp[i]['arc_direction'];
            var large_arc = shapeTmp[i]['large_arc'];
            detailShape.push({'type': type, 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'r': r, 'arc_direction': arc_direction, 'large_arc': large_arc, 'direction': $direction});
        }
    }
    shapeTmp.length = 0;

    if (detailShape.length > 0) {
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller:'Additives', action: 'setDetailShape',
                detail_key: detailKey,
                shape_key: shape_key,
                data: detailShape}),
            dataType: 'json',
            success: function (data) {
                console.log('data add ret = ', data);
                shape_key = '';
                detailShapes.length = 0;
                for (key in data) {
                    detailShapes.push(data[key]);
                }
                showShapes();
                draw();
            }
        });
    }

}

function editShape(shapeKey) {
//    showTopFormForEdit('panel-shapes', 'shapesForm');
    shapeControlID = 0;
    if (shapeKey === shape_key) {
        return;
    }
    $('#formShape').empty();
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'getDetailShape', detail_key: detailKey, shape_key: shapeKey}),
        dataType: 'json',
        success: function (data) {
            console.log('data edit = ', data);
            shape_key = shapeKey;
            $('[id^=svg-shape-]').show();
            $('[id^=svg-shape-' + shapeKey + ']').hide();
            for (var part_id = 0; part_id < data.length; part_id++) {
                if (part_id == 0) {
                    $('#s_x' + part_id).val(data[part_id]['x1']);
                    $('#s_y' + part_id).val(data[part_id]['y1']);
                }
                addShapeRadius();
                $('#s_x' + (part_id + 1)).val(data[part_id]['x2']);
                $('#s_y' + (part_id + 1)).val(data[part_id]['y2']);
                if (data[part_id]['type'] == 'radius') {
                    $('#s_r' + (part_id + 1) + '_container').show();
                    $('#s_r' + (part_id + 1) + '_radius').prop('checked', true);
                    $('#s_r' + (part_id + 1) + '_direction').prop('checked', Number(data[part_id]['arc_direction']));
                    $('#s_r' + (part_id + 1) + '_large').prop('checked', Number(data[part_id]['large_arc']));
                    $('#s_r' + (part_id + 1)).val(Number(data[part_id]['r']));
                }
                $('#shapesForm').change();
                console.log('adding dot');
            }
            $('#s_x0').on('focus', function () { showPositionOnSide(1, $(this).val(), $('#s_y0').val()); });
            $('#s_y0').on('focus', function () { showPositionOnSide(1, $('#s_x0').val(), $(this).val()); });
            $('[id^=s_]').each(function () {
                this.onfocus = function () { markPreshapePart(this.id.replace(/s_[xyr]/,'')); };
            });
            $('#collapseShape').collapse("show");
            window.frames[0]
                ? window.frames[0].document.getElementById('panel-shapes').scrollIntoView()
                : window.document.getElementById('panel-shapes').scrollIntoView();
        }
    });
}

function delShape(key) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'delDetailShape',
            detail_key: detailKey,
            shape_key: key}),
        dataType: 'json',
        success: function (data) {
            showShapes();
            draw();
        }
    });
}

function addShapeRadius(elem) {
    var xy_pos = $(elem).parent().find('input.xy_position');
    var notEmpty = true;
    for (var i=0; i<xy_pos.length;i++){
        if (xy_pos[i].value == ''){
            notEmpty = false;
        }
    }
    // console.log(notEmpty);
    if (notEmpty){
        shapeControlID++;
        $.ajax({
            type: "POST",
            async: false,
            url: "/service/system/views/additives/inc/formShape.php",
            data: 'action=getShapeRadius&id=' + shapeControlID,
            dataType: "html",
            success: function (data) {
                $("#formShape").append(data);
            }
        });
    } else {
        showErrorMessage(LANG['NOT-ALL-FIELDS-KOORD']);
    }
}

function checkXY(x, y) {
    var min = 20;
    for (var i in shapeTmp) {
        if (Math.sqrt(Math.pow(shapeTmp[i][1] - x, 2) + Math.pow(shapeTmp[i][2] - y, 2)) < min && Math.sqrt(Math.pow(shapeTmp[i][1] - x, 2) + Math.pow(shapeTmp[i][2] - y, 2)) != 0) {
            showErrorMessage(LANG['BAD-VALUE-KOORD']+'\n'+LANG['MIN-DIST-BET-TOCHK']+'\n ' + min + 'мм.');
            return false;
        }
    }
    return true;
}

function checkX(value) {
    var val = Number(value);
    var min = 0;
    var max = detailWidth;
    console.log('val = ', val);
    if (val < min || val > max) {
        showErrorMessage(LANG['BAD-VALUE-KOORD']+'\n'+LANG['VALUE-ON-X-OS']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
        return false;
    }
    return true;
}

function checkY(value) {
    var val = Number(value);
    var min = 0;
    var max = detailHeight;
    if (val < min || val > max) {
        showErrorMessage(LANG['BAD-VALUE-KOORD']+'\n'+LANG['VALUE-ON-Y-OS']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
        return false;
    }
    return true;
}

function initShape(detail, global_data) {
    $("#shapesForm").change(function () {
        $('body').on('change','input[type!=checkbox]',function () {
            inputCalc($(this));
        });
        shapeTmp.length = 0;
        for (var i = 0; i < shapeControlID + 1; ++i) {
            var x = $('#s_x' + i).val();
            var y = $('#s_y' + i).val();
            var r = $('#s_r' + i).val();
            var arc_direction = $('#s_r' + i + '_direction').prop('checked');
            var large_arc = $('#s_r' + i + '_large').prop('checked');
            if ($('#s_r' + i + '_radius').prop('checked')) {
                type = 'radius';
            } else {
                type = 'line';
            }
            if (x >= 0 && y >= 0) {// пропуск незаполненых координат точек | ну такое, ошибку при введении < 0 не показывает, да и 0 нельзя ввести
                if (!checkX(x) || !checkY(y) || !checkXY(x, y)) {
                    return;
                }
                shapeTmp.push({'type': type, 'x': Number(x), 'y': Number(y), 'r': Number(r), 'arc_direction': Number(arc_direction), 'large_arc': Number(large_arc)}); // направление в конце
            }
        }
        for (var i = 0; i < shapeTmp.length; i++) {
            for (var j = 0; j < shapeTmp.length; j++) {
                if (j <= i || (i == 0 && j == shapeTmp.length - 1)) {
                    continue;
                }
                len = Math.sqrt(Math.pow(shapeTmp[i]['x'] - shapeTmp[j]['x'], 2) + Math.pow(shapeTmp[i]['y'] - shapeTmp[j]['y'], 2));
                if (len < 20) {
                    $('#s_x' + j).val('');
                    $('#s_y' + j).val('');
                    showErrorMessage(LANG['TOO-SMALL-DIS-B-T'] + i + ' '+LANG['AND']+' ' + j + '.');
                }
            }
        }
        if (shapeTmp.length >= 2) {
            // var x0 = Number($("#s_x0").val());
            // var y0 = Number($("#s_y0").val());
            // var last_x = Number(shapeTmp[shapeTmp.length-1]['x']);
            // var last_y = Number(shapeTmp[shapeTmp.length-1]['y']);
            // if ($("#shapeLoop").prop("checked") && last_x != x0 && last_y != y0) {
            //     shapeTmp.push(['line', x0, y0, 0, 0]); // автозамыкание контура
            // }

            detailShape.length = 0;
            if ($("#shapeDirection").prop("checked")) {
                $direction = 1;
            } else {
                $direction = 0;
            }
            $('#svg-detail .preshape').remove();
            for (var i = 1; i < shapeTmp.length; ++i) {
                var type = shapeTmp[i]['type'];
                var x1 = shapeTmp[i - 1]['x'];
                var y1 = shapeTmp[i - 1]['y'];
                var x2 = shapeTmp[i]['x'];
                var y2 = shapeTmp[i]['y'];
                var r = shapeTmp[i]['r'];
                if (Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
                    r_min = Math.abs(x1 - x2);
                } else {
                    r_min = (Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))) / 2;
                }
                if (r < r_min) {
                    r = r_min;
                    $('#s_r' + i).val(r);
                }
                var arc_direction = shapeTmp[i]['arc_direction'];
                var large_arc = shapeTmp[i]['large_arc'];
                detailShape.push({'type': type, 'x1': x1, 'y1': y1, 'r': r, 'arc_direction': arc_direction, 'large_arc': large_arc, 'direction': $direction});
                //draw();
                switch (type) {
                    case 'line':
                        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttributeNS(null, 'class', 'preshape');
                        line.setAttributeNS(null, 'id', 'preshape-part-' + i);
                        line.setAttributeNS(null, 'x1', x1);
                        line.setAttributeNS(null, 'y1', y1);
                        line.setAttributeNS(null, 'x2', x2);
                        line.setAttributeNS(null, 'y2', y2);
                        $('#svg-detail').append(line);
                        break;
                    case 'radius':
                        var arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        var path = 'M ' + x1 + ' ' + y1 + 'A ' + r + ',' + r + ' 0 ' + large_arc + ' ' + Number(!arc_direction) + ' ' + x2 + ' ' + y2;
                        arc.setAttributeNS(null, 'class', 'preshape');
                        arc.setAttributeNS(null, 'id', 'preshape-part-' + i);
                        arc.setAttributeNS(null, 'd', path);
                        $('#svg-detail').append(arc);
                        break;
                }
            }
        }

        if (shapeControlID == 0) {
            if ($("#s_x0").val() != '' && $("#s_y0").val() != '') {

                //design.addPoint(Number($("#s_x0").val()), Number($("#s_y0").val()));
            }
        }

        if ($("#s_x0").val() != '' || $("#s_y0").val() != '') {
            showPositionOnSide(1, $("#s_x0").val(), $("#s_y0").val());
        }
    });

    $('#shapeBtn').click(function () {
        addShape();
    });

    getShapes(detail, true);
}

define(function () {
    return {
        init: initShape
    }
});
