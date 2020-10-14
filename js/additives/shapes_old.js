

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
        if (x >= 0 && y >= 0) {// пропуск незаполненых координат точек
            if (!checkX(x) || !checkY(y) || !checkXY(x, y)) {
                return;
            }
            shapeTmp.push([type, Number(x), Number(y), Number(r), Number(arc_direction), Number(large_arc)]); // направление в конце
        }
    }
    if (shapeTmp.length >= 2) {
        var x0 = Number($("#s_x0").val());
        var y0 = Number($("#s_y0").val());
        var last_x = Number(shapeTmp[shapeTmp.length-1][1]);
        var last_y = Number(shapeTmp[shapeTmp.length-1][2]);
        if ($("#shapeLoop").prop("checked") && last_x != x0 && last_y != y0) {
            shapeTmp.push(['line', x0, y0, 0, 0]); // автозамыкание контура
        }

        detailShape.length = 0;
        if ($("#shapeDirection").prop("checked")) {
            $direction = 1;
        } else {
            $direction = 0;
        }
        $('#svg-detail .preshape').remove();
        for (var i = 1; i < shapeTmp.length; ++i) {
            var type = shapeTmp[i][0];
            var x1 = shapeTmp[i - 1][1];
            var y1 = shapeTmp[i - 1][2];
            var x2 = shapeTmp[i][1];
            var y2 = shapeTmp[i][2];
            var r = shapeTmp[i][3];
            if (Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
                r_min = Math.abs(x1 - x2);
            } else {
                r_min = (Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))) / 2;
            }
            if (r < r_min) {
                r = r_min;
                $('#s_r' + i).val(r);
            }
            var arc_direction = shapeTmp[i][4];
            var large_arc = shapeTmp[i][5];
            detailShape.push([type, x1, y1, x2, y2, r, arc_direction, large_arc, $direction]);
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
$("#shapeLoop").change(function () {
    $("#shapesForm").change();
});
$("#shapeDirection").change(function () {
    $("#shapesForm").change();
});

function checkXY(x, y) {
    var min = 20;
    for (var i in shapeTmp) {
        if (Math.sqrt(Math.pow(shapeTmp[i][1] - x, 2) + Math.pow(shapeTmp[i][2] - y, 2)) < min) {
            showErrorMessage('Неверное значение координат!\nМинимально допустимое расстояние между точками:\n ' + min + 'мм.');
            return false;
        }
    }
    return true;
}

function checkX(value) {
    var val = Number(value);
    var min = 0;
    var max = detailWidth;
    if (!(min <= val && val <= max)) {
        showErrorMessage('Неверное значение координат!\nЗначение по оси X должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
        return false;
    }
    return true;
}

function checkY(value) {
    var val = Number(value);
    var min = 0;
    var max = detailHeight;
    if (!(min <= val && val <= max)) {
        showErrorMessage('Неверное значение координат!\nЗначение по оси Y должно быть:\nот ' + min + 'мм до ' + max + 'мм.');
        return false;
    }
    return true;
}

function addShape() {
    shapeControlID = 0;
    detailShape.length = 0;
    $("#formShape").html('');
    $("#s_x0").val('');
    $("#s_y0").val('');
    if (shapeTmp.length >= 2) {
        for (var i = 1; i < shapeTmp.length; ++i) {
            var type = shapeTmp[i][0];
            var x1 = shapeTmp[i - 1][1];
            var y1 = shapeTmp[i - 1][2];
            var x2 = shapeTmp[i][1];
            var y2 = shapeTmp[i][2];
            var r = shapeTmp[i][3];
            if (Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
                r_min = Math.abs(x1 - x2);
            } else {
                r_min = (Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))) / 2;
            }
            if (r < r_min) {
                r = r_min;
            }
            var arc_direction = shapeTmp[i][4];
            var large_arc = shapeTmp[i][5];
            detailShape.push([type, x1, y1, x2, y2, r, arc_direction, large_arc, $direction]);
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
            shape_key = shapeKey;
            $('[id^=svg-shape-]').show();
            $('[id^=svg-shape-' + shapeKey + ']').hide();
            for (var part_id = 0; part_id < data.length; part_id++) {
                if (part_id == 0) {
                    $('#s_x' + part_id).val(data[part_id][1]);
                    $('#s_y' + part_id).val(data[part_id][2]);
                }
                addShapeRadius();
                $('#s_x' + (part_id + 1)).val(data[part_id][3]);
                $('#s_y' + (part_id + 1)).val(data[part_id][4]);
                if (data[part_id][0] == 'radius') {
                    $('#s_r' + (part_id + 1) + '_container').show();
                    $('#s_r' + (part_id + 1) + '_radius').prop('checked', true);
                    $('#s_r' + (part_id + 1) + '_direction').prop('checked', Number(data[part_id][6]));
                    $('#s_r' + (part_id + 1) + '_large').prop('checked', Number(data[part_id][7]));
                    $('#s_r' + (part_id + 1)).val(Number(data[part_id][5]));
                }
                $('#shapesForm').change();
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
            if (data != null) {
                detailShapes.length = 0;
                for (key in data) {
                    detailShapes.push(data[key]);
                }
            } else {
                detailShapes = [];
            }
            showShapes();
            draw();
        }
    });
}
function copyShape(key, x, y) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'copyDetailShape',
            detail_key: detailKey,
            shape_key: key,
            shape_x: x,
            shape_y: y
        }),
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                if (data.type == 'error') {
                    showErrorMessage(data.msg);
                } else {
                    detailShapes.length = 0;
                    for (var key in data) {
                        detailShapes.push(data[key]);
                    }
                }
            } else {
                detailShapes = [];
            }
            showShapes();
            draw();
        }
    });
}
function displaceShapeBy(key, x, y) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'displaceDetailShapeBy',
            detail_key: detailKey,
            shape_key: key,
            shape_x: x,
            shape_y: y
        }),
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                if (data.type == 'error') {
                    showErrorMessage(data.msg);
                } else {
                    detailShapes.length = 0;
                    for (key in data) {
                        detailShapes.push(data[key]);
                    }

                }
            } else {
                detailShapes = [];
            }
            showShapes();
            draw();
        }
    });
}
function displaceShapeTo(key, x, y) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'displaceDetailShapeTo',
            detail_key: detailKey,
            shape_key: key,
            shape_x: x,
            shape_y: y
        }),
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                if (data.type == 'error') {
                    showErrorMessage(data.msg);
                } else {
                    detailShapes.length = 0;
                    for (key in data) {
                        detailShapes.push(data[key]);
                    }
                }
            } else {
                detailShapes = [];
            }
            showShapes();
            draw();
        }
    });
}
function rotateShapeAroundBase(key, x, y) {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({controller:'Additives', action: 'rotateDetailShapeAroundBase',
            detail_key: detailKey,
            shape_key: key
        }),
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                if (data.type == 'error') {
                    showErrorMessage(data.msg);
                } else {
                    detailShapes.length = 0;
                    for (key in data) {
                        detailShapes.push(data[key]);
                    }
                }
            } else {
                detailShapes = [];
            }
            showShapes();
            draw();
        }
    });
}
function addShapeLine() {
    shapeControlID++;
    $.ajax({
        type: "POST",
        async: false,
        url: "/service/system/views/additives/inc/formShape.php",
        data: 'action=getShapeLine&id=' + shapeControlID,
        dataType: "html",
        success: function (data) {
            $("#formShape").append(data);
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
    //console.log(notEmpty);
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
        showErrorMessage('Не все поля с координатами заполнены!');
    }
}

function showCopyShapeQestion(shape_key, target) {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/formCopyShape.php",
        data: {detail_key: detailKey, shape_key: shape_key},
        dataType: "html",
        success: function (data) {
            showTopPanel("Копирование выреза", data, null, null, $(target).offset().top);
        }
    });
}
function showDisplaceShapeQestion(shape_key, target) {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/formDisplaceShape.php",
        data: {detail_key: detailKey, shape_key: shape_key},
        dataType: "html",
        success: function (data) {
            showTopPanel("Смещение выреза", data, null, null, $(target).offset().top);

        }
    });
}
function markPreshapePart(partId) {
    $('[id^=preshape-part-]').css('strokeWidth', 1);
    $('#preshape-part-' + partId).css('strokeWidth', 3);
}

function initShape(detail) {
    getShapes(detail);
}

$(document).ready(function () {
    $('#shapeBtn').click(function () {
        addShape();
    });
    initFunctions.push(initShape);
});

