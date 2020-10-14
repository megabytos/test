// use on other share --
function centerX(elem) {
    var drilling = g_detail.getModule('drilling');
    drilling.functions.center('x');
}

function centerY(elem) {
    var drilling = g_detail.getModule('drilling');
    drilling.functions.center('y');
}

function delHole(holeKey) {
    var drilling = g_detail.getModule('drilling');
    if (holeKey == hole_key) {
        hole_key = '';
    }
    g_detail.rmOperation(
        'hole',
        {
            detail_key: detailKey,
            hole_key: holeKey
        },
        function (data) {

            var val = data[1];
            var data = data[0];
            drilling.functions.data(data);
            drilling.functions.table();
            // drilling.functions.rmsvg([holeKey]);
            drilling.use('rmsvg', [holeKey]);
        }
    );
}
/* Редактирование сверления */
function editHole(holeKey) {
    $('#modal7').css("display","block");
    var active_tab = sessionStorage.getItem('active-edit');
    var position2 = $('#'+ active_tab).position();
    if(active_tab == $('#modal7').attr('id')&& position2 != undefined && $('#'+ active_tab).css("display")!="none"){
        sessionStorage.setItem("modal-left", position2.left);
        sessionStorage.setItem("modal-top", position2.top);
        sessionStorage.removeItem('active-edit');
    }
    if(active_tab!=$('#modal7').attr('id')) {
        if(position2 != undefined && $('#'+ active_tab).css("display")!="none") {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);
        }
        $('#' + active_tab).css("display","none");
        $('*[data-id="'+ active_tab + '"]').removeClass('active');
        sessionStorage.setItem('active-edit', $('#modal7').attr('id'));
    }
    if($('.left-container-menu').hasClass('active')){
        $('.left-container-menu').removeClass('active');
        $('.modalwin').css("display","none");
    }
    // if(sessionStorage.getItem('active-edit')!=null){
    //     var position2 = $('#'+ active_tab).position();
    //     if(position2 != undefined) {
    //         sessionStorage.setItem("modal-top", position2.top);
    //         sessionStorage.setItem("modal-left", position2.left);
    //     }
    // }
    if(sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null) {
        $('#modal7').css("display","block");
        $('#modal7').css("left","75px");
    }else{
        $('#modal7').css("display","block");
        $('#modal7').css("left",sessionStorage.getItem('modal-left')+"px");
        $('#modal7').css("top",sessionStorage.getItem('modal-top')+"px");
    }

    sessionStorage.setItem('active-edit',$('#modal7').attr('id'));
    $('#modal7').draggable({ containment: "html" });
    $('*[data-id="modal7"]').addClass('active');
    var drilling = g_detail.getModule('drilling');
//    showTopFormForEdit('panel-drilling', 'holesForm');
    holes.length = 0;
    var data = detailHoles[holeKey];
    // $.ajax({
    //     type: "POST",
    //     url: "system/controllers/JsonController.php",
    //     data: ({controller: 'Additives', action: 'getDetailHole', detail_key: detailKey, hole_key: (holeKey)}),
    //     dataType: 'json',
    //     success: function (data) {
    // $('#holeSideSelect').val(data['side']);
    drilling.setval('side', data[0]);
    drilling.methods.side(false);
    drilling.functions.types();
    var data9 = String(data[9]);
    drilling.setval('type', data9);
    drilling.method('type');
    if (drilling.isshow('d_select')) {
        drilling.setval('d_select', data[4]);
    }
    if (drilling.getval('side') == '4') {
        drilling.setval('x', data[1]);
        drilling.setval('link_x', 0);
    } else {
        drilling.setval('x', (data[7]) ? (detailFullWidth - data[1]).toFixed(1) : data[1]);
        drilling.setval('link_x', (data[7] ? 'w' : 0));
    }
    if (drilling.getval('side') == '3') {
        drilling.setval('y', data[2]);
        drilling.setval('link_y', 0);
    } else {
        drilling.setval('y', (data[8]) ? (detailFullHeight - data[2]).toFixed(1) : data[2]);
        drilling.setval('link_y', data[8] ? 'h' : 0);
    }
    drilling.setval('z', data[3]);
    // drilling.functions.links();
    drilling.functions.mode('edit');
    drilling.showinput('field_x');
    drilling.showinput('field_y');
    hole_key = data[5];
    if (data[9]) {
        drilling.hideinput('field_z');
        drilling.hideinput('field_d');
    } else {
        $('#holeZFieldset').show();
        $('#holeDFieldset').show();
    }
    if ((constructorId != 'steklo') && holes[0] && holes[0][4] && data[9] == 0) {
        drilling.showinput('field_z');
    }
    if (data[9] == 0 && (data[4] == 7 || data[4] == 60)) {
        drilling.disabled('z', true);
    } else {
        drilling.disabled('z', false);
    }

    if(materialType == 'fanera'){
        $('#holeDSelect option[value=7]').hide();
        $('#holeTypeSelect option[value=8]').hide();
        $('#holeTypeSelect option[value=9]').hide();
        $('#holeTypeSelect option[value=10]').hide();
        $('#holeTypeSelect option[value=11]').hide();
    }
    hideHoleOptions(data9);
    drilling.cache.type_value = data9;
    holes.length = 0;
    holes.push(['', '', '', '', '', '']);
    $('#holesTable tr').removeClass('info');
    $('#holesTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
    $("#holeKeyId-" + holeKey).addClass("info");
    $("#holeKeyId-" + holeKey + '.danger').addClass("danger-edit").removeClass("danger");
    $('#collapseDrilling').collapse("show");
    window.frames[0] && window.frames[0].document.getElementById('panel-drilling')
        ? window.frames[0].document.getElementById('panel-drilling').scrollIntoView()
        : window.document.getElementById('panel-drilling').scrollIntoView();
}

/** Функция для блокирования возможности изменить сверление из обычного на пакет */
function hideHoleOptions(value = -1, afterSave = false) {
    var drilling = g_detail.getModule('drilling');
    var addText = '';
    if (drilling) {
        var btn = drilling.getinput('add');
        addText = btn.innerText;
        // console.log(addText);
    }

    if (addText == 'Сохранить' && !afterSave) {
        if (window.constructorId != 'steklo'){
            for (var i = 20; i < 41; i++) {
                if (i != 28 && i != 29 && i != 38 && i != value) {
                    $('#holeTypeSelect option[value=' + i + ']').hide();
                } else {
                    $('#holeTypeSelect option[value=' + i + ']').show();
                }
            }
        }
        $("#holeTypeSelect").val(value);
    } else {
        for (var i = 20; i < 41; i++) {
            $('#holeTypeSelect option[value=' + i + ']').show();
        }
    }


}

function showForm() {
    var div = $('#top-form-div');

    div.show();
    var bodyMsg = $('#top-form .panel-body');
    $('*:focus').blur();
    var top = offset - $('#' + div_id).height() / 1.5 - $(window).scrollTop();
    if (top < 10) top = 10;
    else if (top + $('#' + div).height() > $(window).height()) top = $(window).height() - $('#' + div).height() - 10;
}

function showHolesForm() {
    $("#holesActions").val($("#holesActions option:first").val());
    $.when($.ajax({
        url: "/service/system/views/additives/menu/moveHoles.php",
        type: 'POST',
        data: {test: 'true'}
    })).then(function (data) {
        data += ('<script src="js/additives/movingHoles.js"></script>');
        showTopPanel(LANG['MASS-SMESH-OTV'], data);
        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
        start();
    });
}

function showHolesFormForCopyWithMove(keys) {
    $.when($.ajax({
        url: "/service/system/views/additives/menu/copyHolesWithMove.php",
        type: 'POST',
        data: {test: 'true'}
    })).then(function (data) {
        data += ('<script src="js/additives/copyHolesWithMove.js"></script>');
        showTopPanel(LANG['COPY-WITH-OTV-SMECH'], data);
        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
        start();
    });
}

function showHolesFormChangeDepthDiameter() {
    var drilling = g_detail.getModule('drilling');

    $("#holesActions").val($("#holesActions option:first").val());
    $.when($.ajax({
        url: "/service/system/views/additives/menu/changeDepthDiameterHoles.php",
        type: 'POST',
        data: {test: 'true'}
    })).then(function (data) {
        //data += ('<script src="js/additives/changeDepthDiameterHoles.js"></script>');
        showTopPanel(LANG['CHANGE-DETH-DIAM'], data);
        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
            success: function (data) {
                var holes = data;
                var sideType1 = ['1', '6']; //1, 6
                var sideType2 = ['2', '3', '4', '5']; //2, 3, 4, 5
                var sideType1Count = 0;
                var sideType2Count = 0;
                // Проверяем одного ли типа сторон отверстия
                for (var i = 0; i < checked.length; i++) {
                    if (sideType1.indexOf(holes[checked[i]]['side']) != -1){
                        sideType1Count++;
                    } else if(sideType2.indexOf(holes[checked[i]]['side']) != -1){
                        sideType2Count++;
                    }
                }
                if (sideType1Count > 0 && sideType2Count > 0){
                    //блокируем диаметр
                    $('#holeDSelectChangeDepthDiameter').prop('disabled', true);
                    //drilling.showinput('d_selectChange');
                } else{
                    if (sideType1Count > 0){
                        var sides = [16];
                    } else if(sideType2Count > 0){
                        var sides = [2345];
                    }
                    var diam = drilling.cache.params.diam[sides];
                    var $holeDSelectChangeDepthDiameter = $('body').find('#holeDSelectChangeDepthDiameter');
                    for (var key in diam) {
                        $holeDSelectChangeDepthDiameter.append(new Option(key, diam[key], true, true));
                    }
                    $("#holeDSelectChangeDepthDiameter").val($("#holeDSelectChangeDepthDiameter option:first").val());
                }

            }
        });
    });

    var checked = [];
    $('input[id^=Hole-]:checked').each(function () {
        checked.push($(this).val());
    });
}

function showHolesFormChangeBindSide(){
    var drilling = g_detail.getModule('drilling');
    $("#holesActions").val($("#holesActions option:first").val());

    var checked = [];
    $('input[id^=Hole-]:checked').each(function () {
        checked.push($(this).val());
    });

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
        success: function (data) {
            var holes = data;
            var sideType1 = [1, 6]; // лицо, тыл
            var sideType2 = [2, 4]; //лево, право
            var sideType3 = [3, 5]; //верх, низ
            var sideType1Count = 0;
            var sideType2Count = 0;
            var sideType3Count = 0;
            // Проверяем одного ли типа сторон отверстия
            for (var i = 0; i < checked.length; i++) {
                if (sideType1.indexOf(Number(holes[checked[i]]['side'])) != -1){
                    sideType1Count++;
                } else if (sideType2.indexOf(Number(holes[checked[i]]['side'])) != -1){
                    sideType2Count++;
                } else if (sideType3.indexOf(Number(holes[checked[i]]['side'])) != -1){
                    sideType3Count++;
                }
            }
            if (sideType1Count + sideType2Count == 0 || sideType1Count + sideType3Count == 0
                || sideType2Count + sideType3Count == 0){
                    $("#holesActions").val($("#holesActions option:first").val());
                    var type = 0;
                    if (sideType1Count != 0) type = 16;
                    else if (sideType2Count != 0) type = 24;
                    else if (sideType3Count != 0) type = 35;
                    $.when($.ajax({
                        url: "/service/system/views/additives/menu/changeBindSide.php",
                        type: 'POST',
                        data: {type: type}
                    })).then(function (data) {
                        showTopPanel(LANG['CHANGE-PRIVAZKA-KRAI'], data);
                        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
                    });
            } else{
                showErrorMessage(LANG['VIBRANI-RIZN-TIP-SVERL']);
                return false;
            }
        }
    });

}

// end

// use on multi func --
function delHoles(holesKey, q_flag) {
    var drilling = g_detail.getModule('drilling');
    var delHoleForAll = function (holeKey) {
        g_detail.rmOperation(
            'holes',
            {
                detail_key: detailKey,
                hole_keys: holeKey
            },
            function (data) {
                var val = data[1];
                var data = data[0];
                drilling.functions.data(data);
                drilling.functions.table();
                holesKey = holesKey.sort((a, b) => {
                    return b - a;
                }); // сортируем в обратном порядке
                holesKey.forEach(key => {
                    drilling.use('rmsvg', [key, true]);
                });
            }
        );
    };

    if (q_flag === undefined) {//не выводить попап-сообщение
        if (showConfirmMessage(LANG['ALL-CHOOSED-OTV-WILL-BE-DELETE'], delHoleForAll, holesKey)) {
            drilling.setval('actions', '');
        } else {
            drilling.setval('actions', '');

            if ($('#Holes').prop('checked')) {
                var hole = $('input[id^=Hole-]');
                hole.prop('checked', true);
            } else {
                $('input[id^=Hole-]').prop('checked', false);
            }
        }
    } else {
        delHoleForAll(holesKey);
    }
}

function copyHoles(holesKey, direction, switch_layer, replace) {
    var drilling = g_detail.getModule('drilling');
    var holeData = [];
    for (var i = 0; i < holesKey.length; i++) {
        var holeKey = holesKey[i];
        var hole = detailHoles[holeKey];
        var holeFormat = {
            side: hole[0],
            x: hole[1],
            y: hole[2],
            z: hole[3],
            d: hole[4],
            key: hole[5],
            is_out: hole[6],
            xl: hole[7],
            yl: hole[8],
            type: hole[9],
        };

        holeData.push(holeFormat);
    }

    var delSwitchedHoles = [];//массив для удаления из набора отвертий после перемещения на лицевую\тыльную сторону
    var delReplacedHoles = [];//массив для удаления из набора отвертий после перемещения в рамках одной стороны
    var holes = [];
    for (var i = 0; i < holeData.length; i++) {
        if ((holeData[i]['xl'] == false)) holeData[i]['xl'] = 0;
        if ((holeData[i]['xl'] == true)) holeData[i]['xl'] = 'w';
        if ((holeData[i]['yl'] == false)) holeData[i]['yl'] = 0;
        if ((holeData[i]['yl'] == true)) holeData[i]['yl'] = 'h';


        holeData[i]['x'] = (holeData[i]['xl'] == 'w') ? (detailFullWidth - Number(holeData[i]['x'])) : holeData[i]['x'];
        holeData[i]['y'] = (holeData[i]['yl'] == 'h') ? (detailFullHeight - Number(holeData[i]['y'])) : holeData[i]['y'];


        if (switch_layer) {
            switch (Number(holeData[i]['side'])) {
                case 1:
                    holeData[i]['side'] = 6;
                    delSwitchedHoles[i] = holeData[i]['key'];
                    break;
                case 6:
                    holeData[i]['side'] = 1;
                    delSwitchedHoles[i] = holeData[i]['key'];
                    break;
                default:
                    continue;
            }
        } else {


            switch (Number(holeData[i]['side'])) {
                case 1:
                case 6:
                    if (direction == 'copy_hor' || direction == 'copy_hor_ver') {
                        if (holeData[i]['xl'] == 0) {
                            holeData[i]['xl'] = 'w';
                        } else {
                            holeData[i]['xl'] = 0;

                        }
                    }
                    if (direction == 'copy_ver' || direction == 'copy_hor_ver') {
                        if (holeData[i]['yl'] == 0) {
                            holeData[i]['yl'] = 'h';
                        } else {
                            holeData[i]['yl'] = 0;
                        }
                    }
                    break;
                case 3:
                case 5:
                    if (direction == 'copy_hor' || direction == 'copy_hor_ver') {
                        if (holeData[i]['xl'] == 0) {
                            holeData[i]['xl'] = 'w';
                        } else {
                            holeData[i]['xl'] = 0;
                        }
                    }
                    if (direction == 'copy_ver' || direction == 'copy_hor_ver') {
                        holeData[i]['side'] = holeData[i]['side'] == '3' ? '5' : '3';
                    }
                    break;
                case 2:
                case 4:
                    if (direction == 'copy_hor' || direction == 'copy_hor_ver') {
                        holeData[i]['side'] = holeData[i]['side'] == '2' ? '4' : '2';
                    }
                    if (direction == 'copy_ver' || direction == 'copy_hor_ver') {
                        if (direction == 'copy_ver' || direction == 'copy_hor_ver') {
                            if (holeData[i]['yl'] == 0) {
                                holeData[i]['yl'] = 'h';
                            } else {
                                holeData[i]['yl'] = 0;
                            }
                        }
                    }
                    break;
            }
        }
        hole_key = (!replace) ? "" : holeData[i]['key'];
        var hole = {
            hole_key: '',
            side: holeData[i]['side'],
            x: holeData[i]['x'],
            y: holeData[i]['y'],
            z: holeData[i]['z'],
            d: holeData[i]['d'],
            xl: holeData[i]['xl'],
            yl: holeData[i]['yl'],
            type: holeData[i]['type'],
            hole_key: hole_key,
        };

        holes.push(hole);
    }

    g_detail.setOperation(
        'hole',
        {
            detail_key: detailKey,
            holes: holes,
            hole_key: hole_key,
            copy: 1
        },
        function (data) {
            var val = data[3];
            if (data['err']) {
                showErrorMessage(LANG['ERROR']+'!\n'+LANG['OTV-CLOSE-5MM-№'] + data[0]);
                drilling.disabled('add', false);
                return false;
            }
            showOkButton2('addButton');

            drilling.functions.svgAll(data[1]);
            detailHoles.length = 0;

            for (var key in data[0]) {
                detailHoles.push([
                    Number(data[0][key]['side']),
                    Number(data[0][key]['x']),
                    Number(data[0][key]['y']),
                    Number(data[0][key]['z']),
                    Number(data[0][key]['d']),
                    Number(data[0][key]['key']),
                    Boolean(data[0][key]['is_out']),
                    data[0][key]['xl'] == "w",
                    data[0][key]['yl'] == "h",
                    Number(data[0][key]['type']),
                ]);
            }
            drilling.functions.table();

            var hole_x_step = Number(drilling.getval('step_x')) / holes.length;
            var hole_y_step = Number(drilling.getval('step_y')) / holes.length;
            if (hole_x_step != 0 || hole_y_step != 0) {
                drilling.setval('x', (Number(drilling.getval('x')) + Number(hole_x_step)));
                drilling.setval('y', (Number(drilling.getval('y')) + Number(hole_y_step)));
            } else {
                drilling.setval('x', '');
                drilling.setval('y', '');
                drilling.focus('x');
            }

            $("#holeKeyId-" + hole_key).removeClass("info");

            drilling.disabled('add', false);
            drilling.functions.mode('add');
            hole_key = "";
        }
    );
}


function checkMoveX(){
    return validateField($("#move_x"), LANG['SPECIFY-HORIZONTAL-OFFSET'], LANG['VALUE-MUST-BE-NUMBER']);
}
function checkMoveY(){
    return validateField($("#move_y"), LANG['SPECIFY-VERTICAL-OFFSET'], LANG['VALUE-MUST-BE-NUMBER']);
}
function checkMoveOneOfTwo(){
    return oneOfTwo($('#move_x'), $('#move_y'),'moveHoles',1);
}

function moveHoles() {
    var checkX = checkMoveX();
    var checkY = checkMoveY();
    var checkoneOfTwo = checkMoveOneOfTwo();
    var x = $('#move_x').val();
    var y = $('#move_y').val();

    if(!checkoneOfTwo){
        return false;
    }
    else if(checkX && checkY) {
        var drilling = g_detail.getModule('drilling');
        var keys = [];
        var checked = [];

        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }
        $('#move_x').val('');
        $('#move_y').val('');
        $('input[id^=Hole-]:checked').each(function () {
            checked.push($(this).val());
        });
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
            success: function (data) {
                var holes = data;
                for (var i = 0; i < checked.length; i++) {
                    holes[checked[i]]['x'] = parseFloat(holes[checked[i]]['x']) + parseFloat(x);
                    holes[checked[i]]['y'] = parseFloat(holes[checked[i]]['y']) + parseFloat(y);
                }
                for (var i = 0; i < holes.length; i++) {
                    keys[i] = i;
                    if (holes[i]['xl'] != '0') {
                        holes[i]['x'] = round(detailFullWidth - Number(holes[i]['x']), 1);
                    }
                    if (holes[i]['yl'] != '0') {
                        holes[i]['y'] = round(detailFullHeight - Number(holes[i]['y']), 1);
                    }
                }
                for (var i = 0; i < holes.length; i++) {
                    if (!drilling.functions.checkxy(holes[i])) {
                        showErrorMessage(LANG['DETAIL-HAVE-VIHOD-PREDEL']);
                        $('#holesActions').val('');
                        return;
                    }
                }

                for (var i = holes.length - 1; i >= 0; i--) {
                    drilling.use('rmsvg', [i]);
                }

                drilling.use('svgAll', [holes]);
                //Моссовое смещение сверлений.
                for (let hole of holes) {
                    hole['hole_key'] = hole['key'];
                }
                drilling.use('send', [holes]);
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'checkMoveHoles', detail_key: detailKey, holes: holes}),
                    dataType: 'json',
                    success: function (data) {
                        $('#holesActions').val('');
                        draw(); // раскоментил, т.к. происходит дублирование отверстий в свг при редактировании отверстия после смещения.
                        showHoles();
                        drilling.functions.table();
                    }
                });
            }
        });
        hideTopPanel();
    }





}



function checkchangeDepthDiameter(){
    return validateField($("#change_depth"), LANG['SPECIFY-HOLE-DEPTH'], LANG['VALUE-MUST-BE-NUMBER']);
}
function checkholeDSelectChangeDepthDiameter(){
    return validateField($("#holeDSelectChangeDepthDiameter"), LANG['SPECIFY-HOLE-DIAMETER'], '');
}

function changeDepthDiameter() {
    let checkDepth = checkchangeDepthDiameter();
    let checkDiameter = checkholeDSelectChangeDepthDiameter();

    if(checkDepth && checkDiameter) {
        var drilling = g_detail.getModule('drilling');

        var depth = $('#change_depth').val();
        var diameter = $('#holeDSelectChangeDepthDiameter').val();
        $('#change_depth').val('');
        $('#holeDSelectChangeDepthDiameter').val('0');

        var checked = [];
        $('input[id^=Hole-]:checked').each(function () {
            checked.push($(this).val());
        });

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
            success: function (data) {
                var holeData = data;
                for (var i = 0; i < checked.length; i++) {
                    if (depth != '') {
                        holeData[checked[i]]['z'] = depth;
                    }
                    if (Number(diameter) != 0) {
                        holeData[checked[i]]['d'] = diameter;
                    }

                }
                for (var i = 0; i < holeData.length; i++) {
                    if (!drilling.functions.check_max_depth(holeData[i])) {
                        return;
                    }
                }

                for (var i = holeData.length - 1; i >= 0; i--) {
                    drilling.use('rmsvg', [i]);
                }

                var holesChangeDepthDiameter = [];
                for (var i = 0; i < holeData.length; i++) {
                    var x1y1 = String(holeData[i]['xl']) + String(holeData[i]['yl']);
                    switch (x1y1) {
                        case "00":
                            break;
                        case "0h":
                            holeData[i]['y'] = detailFullHeight - holeData[i]['y'];
                            break;
                        case "wh":
                            holeData[i]['x'] = detailFullWidth - holeData[i]['x'];
                            holeData[i]['y'] = detailFullHeight - holeData[i]['y'];
                            break;
                        case "w0":
                            holeData[i]['x'] = detailFullWidth - holeData[i]['x'];
                            break;
                    }
                    var hole = {
                        side: holeData[i]['side'],
                        x: holeData[i]['x'],
                        y: holeData[i]['y'],
                        z: holeData[i]['z'],
                        d: holeData[i]['d'],
                        xl: holeData[i]['xl'],
                        yl: holeData[i]['yl'],
                        type: 0,
                        hole_key: holeData[i]['key'],
                    };
                    holesChangeDepthDiameter.push(hole);
                }
                drilling.use('svgAll', [holeData]);
                drilling.use('send', [holesChangeDepthDiameter]);
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'checkMoveHoles', detail_key: detailKey, holes: holes}),
                    dataType: 'json',
                    success: function (data) {
                        if (typeof data == 'string') {
                            showErrorMessage(data);
                        } else {
                            // draw();
                            showHoles();
                            drilling.functions.table();
                        }
                    }
                });

            }
        });

        hideTopPanel();
    }
}

function changeBindSide(){
    var drilling = g_detail.getModule('drilling');

    var sideValue = $('#holeDSelectChangeBindSide').val();
    $("#holeDSelectChangeBindSide").val($("#holeDSelectChangeBindSide option:first").val());

    var checked = [];
    $('input[id^=Hole-]:checked').each(function () {
        checked.push($(this).val());
    });

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
        success: function (data) {
            var holeData = data;

            for (var i = 0; i < checked.length; i++) {
                holeData[checked[i]]['xl'] = sideValue.charAt(0);
                holeData[checked[i]]['yl'] = sideValue.charAt(1);
            }

            for (var i = holeData.length - 1; i >= 0; i--) {
                drilling.use('rmsvg', [i]);
            }

            var holesChangeSide = [];
            for (var i = 0; i < holeData.length; i++){
                var x1y1 = String(holeData[i]['xl']) + String(holeData[i]['yl']);
                switch(x1y1){
                    case "00":
                        break;
                    case "0h":
                        holeData[i]['y'] = detailFullHeight - holeData[i]['y'];
                        break;
                    case "wh":
                        holeData[i]['x'] = detailFullWidth - holeData[i]['x'];
                        holeData[i]['y'] = detailFullHeight - holeData[i]['y'];
                        break;
                    case "w0":
                        holeData[i]['x'] = detailFullWidth - holeData[i]['x'];
                        break;
                }

                var hole = {
                    side: holeData[i]['side'],
                    x: holeData[i]['x'],
                    y: holeData[i]['y'],
                    z: holeData[i]['z'],
                    d: holeData[i]['d'],
                    xl: holeData[i]['xl'],
                    yl: holeData[i]['yl'],
                    type: 0,
                    hole_key: holeData[i]['key'],
                };
                holesChangeSide.push(hole);
            }
            drilling.use('svgAll', [holeData]);
            drilling.use('send', [holesChangeSide]);
            $.ajax({
                type: "POST",
                url: "system/controllers/JsonController.php",
                data: ({controller: 'Additives', action: 'checkMoveHoles', detail_key: detailKey, holes: holes}),
                dataType: 'json',
                success: function (data) {
                    if (typeof data == 'string') {
                        showErrorMessage(data);
                    } else {
                        // draw();
                        showHoles();
                        drilling.functions.table();
                    }
                }
            });

        }
    });

    hideTopPanel();

}

function copyHolesWithMove(data) {
    var drilling = g_detail.getModule('drilling');
    var holeData = [];

        for (var i = 0; i < data.holesKeys.length; i++) {
            var holeKey = holesKeys[i];
            var hole = detailHoles[holeKey];

            for (var j = 1; j < parseInt(data.copyMoveNum) + 1; j++) {
                if (data.directions.left || data.directions.right || data.directions.top || data.directions.bottom) {
                    if (data.directions.left) {
                        var x = parseFloat(hole[1]) - parseFloat(data.step) * j;
                        var y = parseFloat(hole[2]);
                    } else if (data.directions.right) {
                        var x = parseFloat(hole[1]) + parseFloat(data.step) * j;
                        var y = parseFloat(hole[2]);
                    } else if (data.directions.top) {
                        var x = parseFloat(hole[1]);
                        var y = parseFloat(hole[2]) + parseFloat(data.step) * j;
                    } else if (data.directions.bottom) {
                        var x = parseFloat(hole[1]);
                        var y = parseFloat(hole[2]) - parseFloat(data.step) * j;
                    }

                    var xl = (hole[7] == 'false') ? 'w' : '0';
                    var yl = (hole[8] == 'false') ? 'h' : '0';
                    var holeFormat = {
                        side: hole[0],
                        x: x,
                        y: y,
                        z: hole[3],
                        d: hole[4],
                        key: hole[5],
                        is_out: hole[6],
                        xl: xl,
                        yl: yl,
                        type: hole[9],
                    };

                    holeData.push(holeFormat);
                }
            }

        }

    drilling.functions.send(holeData);
    hideTopPanel();
}



function selectAllHoles() {
    if ($('#Holes').prop('checked')) {
        var hole = $('input[id^=Hole-]');
        hole.prop('checked', true);
    } else {
        $('input[id^=Hole-]').prop('checked', false);
    }
}

// end

define(function (require, exports, module) {
    var drilling = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        inputs: {
            get side() {
                return document.getElementById('holeSideSelect')
            },
            get type() {
                return document.getElementById('holeTypeSelect')
            },
            get x() {
                return document.getElementById('hole_x')
            },
            get y() {
                return document.getElementById('hole_y')
            },
            get d_select() {
                return document.getElementById('holeDSelect')
            },
            get d_selectChange() {
                return document.getElementById('holeDSelectChangeDepthDiameter')
            },
            get d_input() {
                return document.getElementById('holeDInput')
            },
            get z() {
                return document.getElementById('hole_z')
            },
            get link_x() {
                return document.getElementById('holeLinkingSelectX')
            },
            get link_y() {
                return document.getElementById('holeLinkingSelectY')
            },
            get add() {
                return document.getElementById('addButton')
            },
            get step_x() {
                return document.getElementById('hole_x_step')
            },
            get step_y() {
                return document.getElementById('hole_y_step')
            },
            get field_x() {
                return document.getElementById('holeXFieldset')
            },
            get field_y() {
                return document.getElementById('holeYFieldset')
            },
            get field_d() {
                return document.getElementById('holeDFieldset')
            },
            get field_z() {
                return document.getElementById('holeZFieldset')
            },
            get field_step_x() {
                return document.getElementById('holeXstepFieldset')
            },
            get field_step_y() {
                return document.getElementById('holeYstepFieldset')
            },
            get holes() {
                return document.getElementById('holes')
            },
            get actions() {
                return document.getElementById('holesActions')
            },
            get table() {
                return document.getElementById('additives-tbl-container-holes')
            },
            get step() {
                return document.getElementById('additives-tbl-container-holes')
            },
            get copyMoveNum() {
                return document.getElementById('copyMoveNum')
            }
        },
        methods: {
            /* side() - Переключение между сторонами select(Верх,Низ,Лево,Право, Тыл) */
            side(isCheckType = true) {
                drilling.cache.cur_type_value = drilling.getval('type'); // запоминаем текущую
                var prev_side = drilling.cache.side;   //сохранили предыдущую сторону
                var reset_side = false;
                var value = drilling.getval('side');

                switch (Number(drilling.cache.side)) {
                    case 1:
                    case 6:
                        //drilling.cache.side = value;
                        reset_side = true;
                        var d_select_val = drilling.functions.d();
                        if (d_select_val == 7 || isNaN(d_select_val)) {
                            // setHoleDiam();
                        }
                        break;
                    case 2:
                    case 4:
                    case 3:
                    case 5:
                        drilling.hideinput('d_input');
                        drilling.showinput('d_select');
                        //drilling.cache.side = value;
                        reset_side = true;
                        break;
                }

                if (reset_side) {
                    for (var i in holes) {
                        if (holes[i][1] == prev_side) {
                            holes[i][1] = side;
                        }
                        if (holes[i][1] == 1 || holes[i][1] == 6) { // Изменение привязки на плоскостях к соответствующему торцу после смены стороны
                            switch (Number(side)) {
                                case 2:
                                    holes[i][6] = '0';
                                    break;
                                case 4:
                                    holes[i][6] = 'w';
                                    break;
                                case 3:
                                    holes[i][7] = 'h';
                                    break;
                                case 5:
                                    holes[i][7] = '0';
                                    break;
                            }
                        }
                    }
                    // return;
                }


                if (prev_side === undefined || (prev_side != value && (
                        ("24".indexOf(value) !== -1 && "1635".indexOf(prev_side) !== -1) ||
                        ("35".indexOf(value) !== -1 && "1624".indexOf(prev_side) !== -1) ||
                        ("16".indexOf(value) !== -1 && "2345".indexOf(prev_side) !== -1)
                    ))) {
                    drilling.functions.links();
                    //drilling.functions.mode('add');
                    drilling.setval('step_x', '');
                    drilling.setval('step_y', '');
                    drilling.setval('x', '');
                    drilling.setval('y', '');
                    if (isCheckType) {
                        drilling.functions.types();
                        drilling.change('type', '0');
                    }
                }

                if (isCheckType) {
                    drilling.functions.types();
                    drilling.method('type');
                }
                if(materialType == 'fanera'){
                    $('#holeDSelect option[value=7]').hide();
                    $('#holeTypeSelect option[value=8]').hide();
                    $('#holeTypeSelect option[value=9]').hide();
                    $('#holeTypeSelect option[value=10]').hide();
                    $('#holeTypeSelect option[value=11]').hide();
                }

                if(materialType == 'compact'){
                    var holeSideSelect = [2, 3, 4, 5];
                    holeSideSelect.forEach(function(item, index){
                        $('#holeSideSelect option[value='+item+']').hide();
                    });
                }

                hideHoleOptions(drilling.cache.type_value);

                markSide(value);
                drilling.functions.types();

                //получаем текущий type и ставим его обратно текущим, если сторона смены 1<->6, 2<->4, 3<->5
                var arr1 = [1, 6];
                var arr2 = [2, 3, 4, 5];
                if (arr1.includes(Number(drilling.getval('side'))) && arr1.includes(Number(drilling.cache.side))
                || arr2.includes(Number(drilling.getval('side'))) && arr2.includes(Number(drilling.cache.side)) ){
                    /** Для пакетов, чтобы при переключении side пакет оставался выбранным */
                    var paket = drilling.functions.saveTypeForPaket();
                    if (!paket){
                        $('#holeTypeSelect').val(drilling.cache.cur_type_value);
                    }
                } else{
                    $('#holeTypeSelect').val(0);
                }
                drilling.method('type');
                drilling.cache.side = value;
            },
            type(e) {
                var value = drilling.getval('type');
                var s_side = drilling.getval('side');
                if (value == '12' || value == '13' || value == '18' || value == '47') {
                    /** Записывать рекомендуемое значение только если добавляем первый раз сверление
                     * (для этого используется проверка -drilling.getval('x')) == 0) */
                    if ((s_side == '2' || s_side == '4') && Number(drilling.getval('x')) == 0) {
                        drilling.setval('x', materialDepth / 2);
                    }
                    if ((s_side == '3' || s_side == '5') && Number(drilling.getval('y') == 0)) {
                        drilling.setval('y', materialDepth / 2);
                    }
                } else {
                    // Шаг смещение по горизонтали, вертикали
                    if(Number(drilling.getval('x')) == 0 && Number(drilling.getval('y')) == 0){
                        drilling.setval('x', '');
                        drilling.setval('y', '');
                    }
                }
                if(value == 0){
                    var dSelect = drilling.getval('d_select');
                    if (dSelect == 60) {
                        drilling.setval('z', 40);
                    } else if (dSelect == 7) {
                        drilling.setval('z', 30);
                    } else {
                        drilling.setval('z', '');
                    }
                    if (dSelect == 7 || dSelect == 60) {
                        drilling.disabled('z', true);
                    } else {
                        drilling.disabled('z', false);
                    }
                }

                var data = drilling.cache.params.params[value];
                holes.length = 0;
                if (data){
                    holes.length = 0;
                    ident = data[0]['ident'] || ''; //устанавливаем отступ
                }

                var thicknessRound = Math.ceil(Math.round(thickness * 20) / 10) / 2;

                for (var key in data) {
                    var z = data[key]['z'][thicknessRound] || data[key]['z'][0];
                    //20-27, 30-37
                    var faneraArray = [5];
                    for(var i = 20; i < 38; i++){
                        faneraArray.push(i);
                        i = i == 27 ? 29 : i;
                    }
                    if (value == 0) {
                        if (dSelect == 60) {
                            z = 40;
                        } else if (dSelect == 7) {
                            z = 30;
                        }
                    }
                    if (detailThickness <= 15 && materialType == 'fanera' && faneraArray.includes(Number(value))){
                        if (data[key]['z'][thicknessRound]){
                            z = 12.5;
                        }
                    }
                    var s = data[key]['side'] === '' ? s_side : data[key]['side'];

                    if (data[key]['s'] == '0') { // Если сверление глухое, проверяем макс толщину
                        if (s == 1 | s == 6) {
                            if (z > detailThickness && !(dSelect == 7 && z == 30)) {
                                showErrorMessage(LANG['DANNOE-OTV-DETH']+', \n'+LANG['DETH-MORE-DETH-THICK']);
                            }
                        }
                        if (s == 2 | s == 3 | s == 4 | s == 5) {
                            if (data[key]['d'] >= detailThickness - 6 && materialType != 'compact') {
                                showErrorMessage(LANG['DANNOE-OTV-BY-DIAM'] + ', \n'+LANG['DIAM-S-DOPUSK-TOL-MAT']);
                            }
                            if (materialType == 'compact' && data[key]['d'] > detailThickness - 4) {
                                showErrorMessage(LANG['DANNOE-OTV-BY-DIAM']+', \n'+LANG['DIAM-S-DOPUSK-TOL-MAT']);
                            }
                        }
                    }

                    //визуализация отверстий на тыльных сторонах при автоподстановке на толстых или сращенных деталях
                    var x = detailThickness - thickness / 2;
                    var y = x;
                    var x1 = thickness / 2;
                    var y1 = x1;

                    if (thickness > 22) {
                        if (thickness == detailThickness) { //проверяем деталь на сращеноть
                            if ((value == '20' || value == '21' || value == '22' || value == '23') ||
                                (value == '30' || value == '31' || value == '32' || value == '33')) {
                                x = y = thickness - 11;
                            }
                            if ((value == '24' || value == '25' || value == '26' || value == '27') ||
                                (value == '34' || value == '35' || value == '36' || value == '37')) {
                                x1 = y1 = 11;
                            }
                        } else { // деталь сращеная
                            if ((value == '20' || value == '21' || value == '22' || value == '23') ||
                                (value == '30' || value == '31' || value == '32' || value == '33')) {
                                x = y = detailThickness - 11;
                            }
                            if ((value == '24' || value == '25' || value == '26' || value == '27') ||
                                (value == '34' || value == '35' || value == '36' || value == '37')) {
                                x1 = y1 = 11;
                            }
                        }
                    }

                    // Автоподстановка
                    switch (data[key]['x']) {
                        case 'w/2':
                            data[key]['x'] = detailWidth / 2;
                            break;
                        case 'h/2':
                            data[key]['x'] = detailHeight / 2;
                            break;
                        case 't/2':
                            data[key]['x'] = x1;
                            break;
                        case 'T-t/2':
                            data[key]['x'] = x;
                            break;
                    }
                    switch (data[key]['y']) {
                        case 'w/2':
                            data[key]['y'] = detailWidth / 2;
                            break;
                        case 'h/2':
                            data[key]['y'] = detailHeight / 2;
                            break;
                        case 't/2':
                            data[key]['y'] = y1;
                            break;
                        case 'T-t/2':
                            data[key]['y'] = y;
                            break;
                    }
                    holes.push([data[key]['ident'], s, data[key]['x'], data[key]['y'], z, data[key]['d'], data[key]['xl'], data[key]['yl'], data[key]['type']]);
                }

                if (holes.length != 0){
                    if (holes[0][2] === '') {
                        drilling.showinput('field_x');
                        drilling.showinput('field_step_x');
                    } else {
                        drilling.hideinput('field_x');
                        drilling.hideinput('field_step_x');
                    }
                    if (holes[0][3] === '') {
                        drilling.showinput('field_y');
                        drilling.showinput('field_step_y');
                    } else {
                        drilling.hideinput('field_y');
                        drilling.hideinput('field_step_y');
                    }
                    if (holes[0][5] === '') {
                        drilling.showinput('field_d');
                        holeType = 1;
                    } else {
                        drilling.hideinput('field_d');
                        holeType = 0;
                    }
                    if (value == 0 || holes[0][4] === '') {
                        drilling.showinput('field_z');
                    } else {
                        drilling.hideinput('field_z');
                        drilling.setval('z', holes[0][4]);
                    }
                    if (value == 48){
                        drilling.setval('z', detailThickness);
                    }
                }

                //скрываем смещение по x или y на торце
                switch(Number(drilling.getval('side'))){
                    case 2:
                    case 4:
                        drilling.hideinput('field_step_x');
                        break;
                    case 3:
                    case 5:
                        drilling.hideinput('field_step_y');
                        break;
                }

                // if (value == 0) {
                //     drilling.setval('z', '');
                // }

                if (value == 0) {
                    var cur_val =  drilling.getval('d_select');
                    for (var sides in drilling.cache.params.diam) {
                        if ((sides + "").indexOf(s_side) != -1) {
                            var diam = drilling.cache.params.diam[sides];
                            var objSel = drilling.getinput('d_select');
                            objSel.options.length = 0;
                            for (var key in diam) {
                                if(diam[key] == cur_val){
                                    check_old = true;
                                }else{
                                    check_old = false;
                                }
                                objSel.options[objSel.options.length] = new Option(key, diam[key],false,check_old);
                            }
                            break;
                        }
                    }
                }

                if (value == 44) {
                    drilling.hideinput('field_step_x');
                    drilling.setval('x', 22.5);
                    drilling.setval('y', '');
                }
                if (value == 45) {
                    drilling.hideinput('field_step_y');
                    drilling.setval('y', 22.5);
                    drilling.setval('x', '');
                }

                if (materialType == 'compact'){
                    //минификс + шкант (пакет) для пласти и торцевых сторон
                    var holeTypeSelect = [30, 34, 31, 35, 32, 36, 33, 37, 39, 40];
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });

                    var hideDSelect = [7, 10, 20, 5, 6];
                    hideDSelect.forEach(function(item, index){
                        $('#holeDSelect option[value='+item+']').hide();
                    });
                }
            },
            link_x(e) {
                for (var i in holes) {
                    holes[i][6] = e.target.value;
                }
            },
            link_y(e) {
                for (var i in holes) {
                    holes[i][7] = e.target.value;
                }
            },
            x(e) {
                var side = Number(drilling.getval('side'));
                var val = Number(drilling.functions.calc(drilling.getinput('x')));
                var type = Number(drilling.getval('type'));
                /**Более неактуальная проверка для шкантов */
                // if ([31, 35, 40].indexOf(type) !== -1 && constructorId != 'steklo') {
                //     var min = 16;
                //     var max = detailFullWidth - 16;
                //     if (!(min <= (val - 32) && (val + 32) <= max)) {
                //         showErrorMessage('Неверное значение координаты X!\nРасстояние от края детали до шканта  должно быть: '+ min +'мм.');
                //         drilling.setval('x', '');
                //         return false;
                //     }
                // }
                if ([35].indexOf(type) !== -1 && constructorId == 'steklo') {
                    var d = Number(holes[0][5] ? holes[0][5] : drilling.functions.d());
                    var min = d / 2 + 4.5;
                    var max = detailFullWidth - min;
                    if (val < min || val > max) {
                        showErrorMessage(LANG['BAD-VALUE-KOORDINAT-X']+'\n'+LANG['RAST-FROM-KRAI-DET']);
                        drilling.setval('x', '');
                        return false;
                    }
                }

                // var holeN = holeN || 0;
                var d = Number(holes[0][5] ? holes[0][5] : drilling.functions.d());
                var ident = ident; // fixme is global
                if (!ident) {
                    switch (side) { //side
                        case 1:
                        case 6:
                            ident = d / 2 + ((constructorId == 'steklo') ? 4.5 : 4);
                            if (constructorId == 'dsp' && (d == 5 || d == 6)) {
                                ident = d / 2 + 2;
                            }
                            if ((constructorId == 'dsp' && (d == 7 || d == 8 || d == 10 || d == 15))) {
                                ident = d / 2 + 1;
                            }
                            if (drilling.getval('type') == 1 || (drilling.getval('type') == 0 && drilling.getval('z') == 2)) {
                                ident = 2 + d / 2;
                            }
                            break;
                        default:
                            ident = d / 2 + 3;
                            if (materialType == 'compact') {
                                ident = 2 + d / 2;
                            }
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
                switch (side) {
                    case 1:
                    case 6: //если лицевая,тыльная проверяем на ширину детали
                        max = Number(detailWidth + kLeftThick + kRightThick - ident);
                        break;
                    case 3:
                    case 5: //если верхняя или нижняя проверяем на ширину детали с ограничением
                        min = 20;
                        max = Number(detailWidth + kLeftThick + kRightThick - 20);
                        break;
                    case 2:
                    case 4: //если сторона левая или правая, проверяем на толщину детали с ограничением
                        max = Number(detailThickness - ident);
                        break;
                }
                if (d == 35) {
                    min = 8.5;
                    max = detailWidth - 8.5;
                }
                if (!(min <= val && val <= max)) {
                    showErrorMessage(LANG['BAD-VALUE-KOORD']+'\n'+LANG['VALUE-ON-X-OS']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
                    drilling.setval('x', '');
                    return false;
                }
                return true;
            },
            y(e) {
                var side = Number(drilling.getval('side'));
                var type = Number(drilling.getval('type'));

                var val = Number(drilling.functions.calc(drilling.getinput('y')));
                /**Более неактуальная проверка для шкантов */
                // if ([30, 34, 39].indexOf(type) !== -1 && constructorId != 'steklo') {
                //     var min = 16;
                //     var max = detailFullHeight - 16;
                //     if (!(min <= (val - 32) && (val + 32) <= max)) {
                //         showErrorMessage('Неверное значение координаты Y!\nРасстояние от края детали до шканта  должно быть: '+ min +'мм.');
                //         drilling.setval('y', '');
                //         return false;
                //     }
                // }
                if ([35].indexOf(type) !== -1 && constructorId == 'steklo') {
                    var d = Number(holes[0][5] ? holes[0][5] : drilling.functions.d());
                    var min = d / 2 + 4.5;
                    var max = detailFullHeight - min;
                    if (val < min || val > max) {
                        showErrorMessage(LANG['BAD-VALUE-KOORDINAT-Y']+'\n'+LANG['RAST-FROM-KRAI-DET']);
                        drilling.setval('y', '');
                        return false;
                    }
                }
                // var holeN = holeN || 0;
                var d = Number(holes[0][5] ? holes[0][5] : drilling.functions.d());
                var ident = ident; // fixme is global
                if (!ident) {
                    switch (side) {
                        case 1:
                        case 6:
                            ident = d / 2 + ((constructorId == 'steklo') ? 4.5 : 4);
                            if (constructorId == 'dsp' && (d == 5 || d == 6)) {
                                ident = d / 2 + 2;
                            }
                            if ((constructorId == 'dsp' && (d == 7 || d == 8 || d == 10 || d == 15))) {
                                ident = d / 2 + 1;
                            }
                            if (drilling.getval('type') == 1 || (drilling.getval('type') == 0 && drilling.getval('z') == 2)) {
                                ident = 2 + d / 2;
                            }
                            break;
                        default:
                            ident = d / 2 + 3;
                            if (materialType == 'compact') {
                                ident = 2 + d / 2;
                            }
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
                switch (side) {
                    case 1:
                    case 6:
                        max = Number(detailHeight + kTopThick + kBottomThick - ident);
                        break;
                    case 3:
                    case 5:
                        max = Number(detailThickness - ident);
                        break;
                    //        case 5:
                    //            max = 9.5;
                    //            break;
                    case 2:
                    case 4:
                        min = 20;
                        max = Number(detailHeight + kTopThick + kBottomThick - 20);
                        break;
                }

                if (d == 35) {
                    min = 8.5;
                    max = detailHeight - 8.5;
                }
                // console.log('MIN = ', min, ' | MAX = ', max, ' | VAL = ', val, ' | IDENT = ', ident, ' | D = ', d);
                if (!(min <= val && val <= max)) {
                    showErrorMessage(LANG['BAD-VALUE-KOORD']+'\n'+LANG['VALUE-ON-Y-OS']+'\n'+ LANG['OT-S'] + min + 'мм до ' + max + 'мм.');
                    drilling.setval('y', '');
                    return false;
                } else
                    return true;
            },
            z(e) {
                //при правках проверить check_max_depth()
                var val = drilling.functions.calc(drilling.getinput('z'));
                var side = Number(drilling.getval('side'));
                var type = Number(drilling.getval('type'));
                // var holeN = holeN || 0;
                var maxD = (side == 1 || side == 6 ? maxDrillingDepthFlat : maxDrillingDepthEdge);
                var d = Number(holes[0][5] ? holes[0][5] : drilling.functions.d());
                var min = (d == 7 && (side == 1 || side == 6)) ? (detailThickness + 5 < maxD ? detailThickness + 5 : maxD) : 1;
                var margin; // (d == 15 || d == 20 || d == 35) ? 4 : 3;
                if (materialType == 'fanera'){
                    margin = 2.5;
                } else if (materialType == 'compact') {
                    margin = 2;
                } else{
                    margin = 3;
                }
                var max = (d == 7 && (side == 1 || side == 6) && materialType != 'fanera') ? maxD : (detailThickness > maxD ? maxD : detailThickness - margin);
                // if ((side == 1 || side == 6) && ((val >= thickness && val < thickness + 5) || val == thickness )) {
                //     val = thickness + 5;
                // }

                switch (Number(side)) {
                    case 1://лицевая
                    case 6://тыльная
                        max = ((val >= detailThickness || d == 7) && materialType != 'fanera') ? maxD : (detailThickness > maxD ? maxD : detailThickness - margin);
                        if (Number(drilling.getval('type')) == 0)
                            max = detailThickness - margin;
                        if (d == '60') {
                            min = 6;
                            max = 40;
                        }
                        if (Number(drilling.getval('type') == 48)){
                            min = 18;
                            max = 18;
                        }

                        if (d == '60' && type == 0 && drilling.getval('z') > max && drilling.getval('z') != '') {
                            showErrorMessage(LANG['BAD-VALUE-DETH-MAX'] + max + 'мм.');
                            return false;
                        }

                        if (constructorId == 'dsp' && drilling.getval('type') == 0) {

                            var minDeaf = 1;
                            var maxDeaf = (detailThickness - margin);
                            min = detailThickness + 3;
                            max = 30;
                            val = Number(val);
                            if (val < 1) {
                                showErrorMessage(LANG['MIN-DETH-OTV-1MM']);
                                return false;
                            }
                            if (val >= 1 && val > detailThickness - 2 && val != '') {
                                if (!(min <= val && val <= max && min <= max) && d != 60) {
                                    showErrorMessage(LANG['BAD-VALUE-DETH']+'\n'+LANG['OT-B'] + minDeaf + ' до ' + maxDeaf + LANG['GLUH-OTV']+'\n'+LANG['MAX-DETH-SK-OTV'] + max + '.');
                                    drilling.setval('z', '');
                                    drilling.focus('z');
                                    return false;
                                }

                                if (d != 5 && d != 7 && d != 8 && d != 10 && d != 60) {
                                    showErrorMessage(LANG['OTV-CHOOSED-DIAM']);
                                    return false;
                                }
                            }
                            if (d == 2 && val > 5) {
                                showErrorMessage(LANG['OTV-DIAM-2MM-5MM']);
                                return false;
                            }
                            return true;
                        }
                        if (constructorId == 'stol' && materialType == "compact") {
                            if (d == 2 && val > 2) {
                                showErrorMessage(LANG['OTV-DIAM-2MM']);
                                return false;
                            }
                            if ((d == 3.5 || d == 4.5 || d == 5.5 || d == 10) && val > 10) {
                                showErrorMessage(LANG['OTV-DIAM-3.5MM-4.5MM-5.5MM'] + d + LANG['MAX-DEPTH-FOR-OTV-3.5MM-4.5MM-5.5MM']);
                                return false;
                            }
                            return true;
                        }
                        break;
                    case 2://левая
                    case 3://верхняя
                    case 4://правая
                    case 5://нижняя
                        max = Number(maxD);
                        break;
                }
                if (materialType == 'compact') {
                    if (d == 2) {
                        max = 2;
                    }
                } else {
                    if (d == 2) {
                        max = 5;
                    }
                }
                if (constructorId == 'steklo') {
                    max = maxDrillingDepthFlat;
                }
                if (!(min <= val && val <= max && min <= max) && (d != 60) && val != '') {
                    showErrorMessage(LANG['BAD-VALUE-DETH']+'\n'+LANG['DETH'] + (((val > detailThickness - margin && val < detailThickness) || (val == 0 && (d != 7 || d != 60))) ? LANG['GLUH-OTV'] : '') + LANG['MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');

                    drilling.setval('z', '');
                    drilling.focus('z');
                    return false;
                } else if ((d == 60 || d == 7) && detailThickness > max) {
                    showErrorMessage(+LANG['BAD-VALUE-WIDTH']+' (' + detailThickness + ')!\n'+LANG['THICK-DETAIL-MUST-BE'] + max + 'мм.');
                    return false;
                }
                // drilling.setval('z', val);
                return true;
            },
            d_select() {
                var type = drilling.getval('type');
                if (type == 0 && (drilling.getval('d_select') != $('#holeDSelect option').each)) {
                    //drilling.setval('z', '');
                }
                if (type == 0) {
                    var dSelect = drilling.getval('d_select');
                    if (dSelect == 7 || dSelect == 60) {
                        drilling.disabled('z', true);
                    } else {
                        drilling.disabled('z', false);
                    }
                    if (dSelect == 60) {
                        drilling.setval('z', 40);
                    } else if (dSelect == 7) {
                        drilling.setval('z', 30);
                    } else {
                        drilling.setval('z', '');
                    }
                }
            },
            add(e) {
                var holesForSend = [];
                for (var i = 0; i < holes.length; i++) {
                    var holeForSend = {};
                    if (holes[i][2][0] == 'x') {
                        var x = eval(drilling.getval('x').toString() + holes[i][2].substr(1));
                    } else {
                        var x = holes[i][2] ? holes[i][2] : drilling.getval('x');
                    }
                    if (holes[i][3][0] == 'y') {
                        var y = eval(drilling.getval('y').toString() + holes[i][3].substr(1));
                    } else {
                        var y = holes[i][3] ? holes[i][3] : drilling.getval('y');
                    }
                    var side = holes[i][1] ? holes[i][1] : drilling.getval('side');
                    if (holes.length > 1 || (drilling.method('x') && drilling.method('y') && drilling.method('z'))) {
                        var z = holes[i][4] && drilling.getval('type') != 48 ? holes[i][4] : drilling.getval('z');
                        var d = holes[i][5] ? holes[i][5] : drilling.functions.d();
                        if (drilling.getval('z') !== '') {
                            z = holes[i][4] && (drilling.getval('type') == 48 || drilling.getval('type') != 0) ? holes[i][4] : drilling.getval('z');
                            var xl = holes[i][6] ? holes[i][6] : drilling.getval('link_x');//$("#holeLinkingSelectX").val();
                            // if(xl != '0') x = detailFullWidth - x;
                            var yl = holes[i][7] ? holes[i][7] : drilling.getval('link_y');//$("#holeLinkingSelectY").val();
                            // if(yl != '0') y = detailFullHeight - y;
                            var type = drilling.getval('type'); //$('#holeTypeSelect').val();
                            if (window.constructorId != 'steklo'){
                                type = (type > 19 && type < 41) ? holes[i][8] : type;
                            }


                            drilling.disabled('add', true);

                            holeForSend = {x: x, y: y, z: z, d: d, xl: xl, yl: yl, i: i, type: type, side: side};
                        }
                        holesForSend.push(holeForSend);
                    }
                    else {
                        return;
                    }

                }

                if (typeof getSides === 'function') {
                    sides = getSides('hole');
                    if (sides[0] == sides[1]) {
                        showConfirmMessage(
                            LANG['DECOR-SIDE-OBR-CONF'],
                            function () {
                                drilling.functions.send(holesForSend);
                            }, function(){
                                drilling.disabled('add', false);
                            }
                        );
                    } else {
                        drilling.functions.send(holesForSend);
                    }
                }

                var btn = drilling.getinput('add');
                if (btn.innerText == LANG['SAVE']) {
                    drilling.use('rmsvg', drilling.getval('key'));
                }

                var type = drilling.getval('type');

                if (thickness > 22) {
                    if ((type == '20' || type == '21' || type == '22' || type == '23') ||
                        (type == '30' || type == '31' || type == '32' || type == '33')){
                        showTopPanel(LANG['WARNING'],LANG['TORT-OTV-WILL-SET-BY-COORD'] + String(thickness - 11) + ' мм.');
                    }
                    if ((type == '24' || type == '25' || type == '26' || type == '27') ||
                        (type == '34' || type == '35' || type == '36' || type == '37')){
                        showTopPanel(LANG['WARNING'],LANG['TORT-OTV-WILL-SET-BY-COORD']+'11 мм.');
                    }
                }

                if(fromViyarEmail){
                    $('#' + sessionStorage.getItem('active-edit')).css("display","none");
                    $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
                }

            },
            actions(e) {
                var value = e.target.value;
                if (value == '') {
                    return
                }
                var keys = [];
                var els = document.querySelectorAll('input[id^=Hole-]:checked');
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    keys.push(el.value);
                }
                if (keys.length == 0) {
                    showErrorMessage(LANG['NO-CHOOSED-OTV']);
                    drilling.setval('actions', '');
                    return;
                }
                switch (value) {
                    case 'copy_hor':
                        copyHoles(keys, 'copy_hor');
                        drilling.setval('actions', '');
                        break;
                    case 'copy_ver':
                        copyHoles(keys, 'copy_ver');
                        $('#holesActions').val("");
                        break;
                    case 'copy_hor_ver':
                        copyHoles(keys, 'copy_hor_ver');
                        drilling.setval('actions', '');
                        break;
                    case 'copy_with_move':
                        showHolesFormForCopyWithMove();
                        drilling.setval('actions', '');
                        break;
                    case 'move':
                        showHolesForm();
                        break;
                    case 'move_hor':
                        copyHoles(keys, 'copy_hor', false, true);
                        keys = keys.sort((a, b) => {
                            return b - a;
                        }); // сортируем в обратном порядке
                        keys.forEach(key => {
                            drilling.use('rmsvg', [key, true]);
                        });
                        drilling.setval('actions', '');
                        break;
                    case 'move_ver':
                        copyHoles(keys, 'copy_ver', false, true);
                        keys = keys.sort((a, b) => {
                            return b - a;
                        }); // сортируем в обратном порядке
                        keys.forEach(key => {
                            drilling.use('rmsvg', [key, true]);
                        });
                        drilling.setval('actions', '');
                        break;
                    case 'change_layer':
                        copyHoles(keys, false, true, true);
                        keys = keys.sort((a, b) => {
                            return b - a;
                        }); // сортируем в обратном порядке
                        keys.forEach(key => {
                            drilling.use('rmsvg', [key, true]);
                        });
                        drilling.setval('actions', '');
                        break;
                    case 'del':
                        delHoles(keys);

                        break;
                    case 'change_depth_diameter':
                        showHolesFormChangeDepthDiameter();
                        break;
                    case 'change_bind_side':
                        showHolesFormChangeBindSide();
                        break;
                }
            }
        },
        functions: {
            calc(el) {
                var val = el.value;
                if (val !== '') {
                    if (isNaN(Number(val))) {
                        val = eval(val.replace(/,/g, '.')).toFixed(1);
                        val = constructorId === 'steklo' ? Math.floor(val) : val;
                    } else{
                        val = parseFloat(val.replace(/,/g, '.')).toFixed(1);
                        val = constructorId === 'steklo' ? Math.floor(val) : val;
                    }
                    el.value = val;
                }
                return val;
            },
            links() {
                var objSelH = drilling.getinput('link_x');
                objSelH.options.length = 0;
                var objSelV = drilling.getinput('link_y');
                objSelV.options.length = 0;
                switch (Number(drilling.getval('side'))) {
                    case 1:
                    case 6:
                        objSelH.options[0] = new Option(LANG['LEFT-S'], '0');
                        objSelH.options[1] = new Option(LANG['RIGHT-S'], 'w');
                        objSelV.options[0] = new Option(LANG['BOTTOM-N'], '0');
                        objSelV.options[1] = new Option(LANG['TOP-V'], 'h');
                        break;
                    case 2:
                    case 4:
                        objSelH.options[0] = new Option(LANG['PREDNIE'], '0');
                        objSelV.options[0] = new Option(LANG['BOTTOM-N'], '0');
                        objSelV.options[1] = new Option(LANG['TOP-V'], 'h');
                        break;
                    case 3:
                    case 5:
                        objSelH.options[0] = new Option(LANG['LEFT-S'], '0');
                        objSelH.options[1] = new Option(LANG['RIGHT-S'], 'w');
                        objSelV.options[0] = new Option(LANG['PREDNIE'], '0');
                        break;
                }
            },
            types() {// заполнение списка сверлений в select
                var objSel = drilling.getinput('type');
                var data = drilling.cache.params.types[drilling.getval('side')];

                objSel.options.length = 0;
                for (var key in data) {
                    objSel.options[objSel.options.length] = new Option(key, data[key]);
                }
                if(materialType == 'fanera'){
                    $('#holeDSelect option[value=7]').hide();
                    $('#holeTypeSelect option[value=8]').hide();
                    $('#holeTypeSelect option[value=9]').hide();
                    $('#holeTypeSelect option[value=10]').hide();
                    $('#holeTypeSelect option[value=11]').hide();
                }

                var side = Number(drilling.getval('side'));
                if (materialType == 'compact' && (side == '1' || side == '6')) { //отверстия для пласти
                    //7мм произвольное//8мм произвольное//10мм произвольное//20мм произвольное
                    var hideDSelect = [7, 10, 20];
                    hideDSelect.forEach(function(item, index){
                        $('#holeDSelect option[value='+item+']').hide();
                    });
                    //5х11.5мм под дюбель //8х11мм под дюбель//10x11мм под дюбель//15мм под минификс//20мм под рафикс
                    //35x13мм под петли //5мм под винты (сквозное) //7мм под конфирмат (без зенкера) //8мм под дюбель двойной //10мм под ножку
                    for(var i = 1; i < 12; i++){
                        $('#holeTypeSelect option[value='+i+']').hide();
                    }
                    //2х5мм для разметки //5x8.5 под полкодержатель //8х12мм  под шканты//минификс+шкант (пакет) (Вертикально) //минификс+шкант (пакет) (Горизонтально)
                    var holeTypeSelect = [16, 17, 39, 40, 41];
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });
                    $('#holeTypeSelect option[value=48]').hide(); // 7мм под конфирмат (с зенкером)
                    $('#holeTypeSelect option[value=49]').hide(); // 6x10мм под направляющие скр. монтажа
                    $('#holeTypeSelect option[value=1]').show(); //2х2мм для разметки
                } else if (materialType == 'compact' && (side == '2' || side == '4' || side == '3' || side == '5')){
                    //минификс + шкант (пакет) для торцевых сторон
                    var holeTypeSelect = [30, 34, 31, 35, 32, 36, 33, 37, 12, 13, 15, 18];
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });
                    $('#holeDSelect option[value="4.5"]').hide();//4.5мм произвольное
                    drilling.setval('d_select', 8);
                } else {
                    var holeTypeSelect = [41, 42, 43, 44, 45];
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });
                }

                //ограничение по толщине материала для сверления 35х8мм под петлю
                var holeTypeSelect = [44, 45];
                if (thickness >= 12 && thickness < 16) {
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').show();
                    });
                } else {
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });
                }

                //ограничение по толщине материала для сверления 30х8мм и 32х8мм под петлю
                var holeTypeSelect = [46, 47];
                if (detailThickness < 35) {
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').hide();
                    });
                } else {
                    holeTypeSelect.forEach(function(item, index){
                        $('#holeTypeSelect option[value='+item+']').show();
                    });
                }

                // if (change) {
                //     $('#holeTypeSelect').change(); //заполняем типы отверстий по данной стороне
                // }
                // if (val) {
                //     $('#holeTypeSelect').val(val);
                // }
                if (Math.max(detailWidth, detailHeight) > 3000 || Math.min(detailWidth, detailHeight) > 850){
                    $('#holeTypeSelect option[value=48]').hide();
                }
            },
            mode(val) {
                switch (val) {
                    case 'edit':
                        var btn = drilling.getinput('add');
                        btn.innerText = LANG['SAVE'];
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-danger');
                        break;
                    case 'add':
                        var els = document.querySelectorAll('#holesTable tr');
                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];
                            el.classList.remove('info');
                        }
                        var btn = drilling.getinput('add');
                        btn.innerText = LANG['ADD'];
                        btn.classList.remove('btn-danger');
                        btn.classList.add('btn-success');
                        break;
                }
            },
            d() {
                if (constructorId == 'steklo') {
                    return drilling.getval('type')
                }
                return drilling.getval(drilling.isshow('d_select') ? 'd_select' : 'd_input')
            },
            table() {
                /*
                 * обновляем таблицу только если есть хотя бы 1 отверстие
                 * */

                if (detailHoles.length > 0) {
                    var scrollHolesTable = document.querySelector('.scroll-div');
                    var boolScrollHolesTable = (scrollHolesTable) ? true : false;
                    if (scrollHolesTable) {
                        scrollHolesTable = scrollHolesTable.scrollTop;
                    }
                    $.ajax({
                        type: "POST",
                        url: "/service/system/views/additives/inc/tableHoles.php",
                        data: 'detail_key=' + detailKey,
                        dataType: "html",
                        success: function (data) {
                            if ((data.length > 0 && constructorId != 'stol') || materialType == 'compact') {
                                drilling.showinput('actions');
                                drilling.showinput('table');
                                $("#hide-table").css("display", "block");
                                showHideTableStyles();
                                var table = drilling.getinput('table')
                                table.innerHTML = data;
                                $('#holesTableSort').show();
                                sortTable('holesTable', $('#holesTableSortColumn').val(), $('#holesTableSortDirection').val());
                                drilling.reinitInput('actions');
                                $(table).find('tr[id^=holeKeyId]').each((i, el) => {
                                    var id = Number(el.id.replace('holeKeyId-', ''));
                                    el.onclick = function (e) {
                                        focusHoleWithoutHide(id);
                                    }
                                    el.ondblclick = function (e) {
                                        editHole(id);
                                    };
                                    el.onmouseout = function (e) {
                                        hideHolePosition(id);
                                    };
                                    el.onmouseover = function (e) {
                                        showHolePosition(id);
                                    };
                                    el.querySelector('button[id^=holesBtn]').onclick = function (e) {
                                        $('#modal7').css("display", "block");
                                        focusHole(id);
                                        e.preventDefault();
                                        e.stopPropagation();
                                    };
                                });
                                if (scrollHolesTable) {
                                    document.querySelector('.scroll-div').scrollTo(0, scrollHolesTable);
                                }

                            } else {
                                drilling.hideinput('table');
                                $('#holesTableSort').hide();
                                drilling.hideinput('actions');
                            }
                        }
                    });
                } else {
                    drilling.hideinput('table');
                    $('#holesTableSort').hide();
                    drilling.hideinput('actions');
                }
            },
            center(id) {
                var side = drilling.getval('side');
                var value = '';
                if (id === 'x') {
                    if ('16'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailWidth - ident) + kLeftThick + kRightThick) / 2).toFixed(1);
                    else if ('24'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailThickness - ident)) / 2).toFixed(1);
                    else if ('35'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailWidth - ident) + kLeftThick + kRightThick) / 2).toFixed(1);
                } else if (id === 'y') {
                    if ('16'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailHeight - ident) + kTopThick + kBottomThick) / 2).toFixed(1);
                    else if ('24'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailHeight - ident) + kTopThick + kBottomThick) / 2).toFixed(1);
                    else if ('35'.indexOf(side) !== -1)
                        value = parseFloat((Number(ident) + (detailThickness - ident)) / 2).toFixed(1);
                }
                drilling.setval(id, value);
            },
            send(holes) { //Обновление списка сверлений после добавления первого
                var callback = function (data) {
                    var val = data[3];
                    if (data['err']) {
                        showErrorMessage(LANG['ERROR']+'!\n'+ LANG['OTV-CLOSE-5MM-№'] + data[0]);
                        drilling.disabled('add', false);
                        return false;
                    }
                    showOkButton2('addButton');

                    if (data[2] == "") {
                        drilling.functions.svgAll(data[1]);
                    } else {
                        drilling.functions.svg(data[2], data[1][0], detailKey);
                    }
                    detailHoles.length = 0;

                    for (var key in data[0]) {
                        detailHoles.push([
                            Number(data[0][key]['side']),
                            Number(data[0][key]['x']),
                            Number(data[0][key]['y']),
                            Number(data[0][key]['z']),
                            Number(data[0][key]['d']),
                            Number(data[0][key]['key']),
                            Boolean(data[0][key]['is_out']),
                            data[0][key]['xl'] == "w",
                            data[0][key]['yl'] == "h",
                            Number(data[0][key]['type']),
                        ]);
                    }
                    drilling.functions.table();
                    // if (hole_key != '') {
                    //     $('#holeSideSelect').change();
                    // }
                    // hole_key = '';
                    var hole_x_step = Number(drilling.getval('step_x'));
                    var hole_y_step = Number(drilling.getval('step_y'));
                    if (hole_x_step != 0 || hole_y_step != 0) {
                        drilling.setval('x', (Number(drilling.getval('x')) + Number(hole_x_step)));
                        drilling.setval('y', (Number(drilling.getval('y')) + Number(hole_y_step)));
                    } else {
                        drilling.setval('x', '');
                        drilling.setval('y', '');
                        drilling.focus('x');
                    }

                    $("#holeKeyId-" + hole_key).removeClass("info");

                    drilling.disabled('add', false);
                    drilling.functions.mode('add');
                    hideHoleOptions(-1, true);
                    hole_key = "";
                    drilling.methods.type();
                    if(materialType == 'fanera'){
                        $('#holeDSelect option[value=7]').hide();
                        $('#holeTypeSelect option[value=8]').hide();
                        $('#holeTypeSelect option[value=9]').hide();
                        $('#holeTypeSelect option[value=10]').hide();
                        $('#holeTypeSelect option[value=11]').hide();
                    }
                    if (hole_x_step != 0 || hole_y_step != 0) {
                        drilling.setval('d_select', data [0][key]['d']);
                    }

                    if ($("#invert").prop("checked") == true) {
                        draw();
                    }

                    var value = drilling.getval('type');
                    if (value == 0) {
                        drilling.setval('d_select', data[0][key]['d']);
                        drilling.setval('z', data [0][key]['z']);
                    }

                    var link_x = drilling.getval('link_x');
                    var link_y = drilling.getval('link_y');
                    if (link_x == "w") {
                        drilling.method('link_x');
                    }
                    if (link_y == "h") {
                        drilling.method('link_y');
                    }

                    holes.length = 0;
                };

                g_detail.setOperation(
                    'hole',
                    {
                        holes: holes,
                        hole_key: hole_key,
                        detail_key: detailKey
                    },
                    callback
                );

            },
            del(keys) {

            },
            checkxy(hole) {
                var ident;
                switch (Number(hole['side'])) {
                    case 1:
                    case 6:
                        ident = hole['d'] / 2 + ((constructorId == 'steklo') ? 4.5 : 4);
                        break;
                    default:
                        ident = hole['d'] / 2 + 3;
                }
                if (constructorId == 'dsp' || constructorId == 'stol') {
                    if (hole['d'] == 20) {
                        ident = 9.5;
                    } else if (hole['d'] == 35) {
                        ident = 12.5;
                    }
                }
                if (constructorId == 'steklo') {
                    if (hole['d'] == 20 || hole['d'] == 35) {
                        ident = hole['d'] / 2 + 4.5;
                    }
                }
                var min_x = Number(ident);
                var min_y = Number(ident);
                var max_y;
                var max_x;
                switch (Number(hole['side'])) {
                    case 1:
                    case 6:
                        max_x = Number(detailWidth + kLeftThick + kRightThick - ident);
                        max_y = Number(detailHeight + kTopThick + kBottomThick - ident);
                        break;
                    case 3:
                    case 5:
                        min_x = 20;
                        max_x = Number(detailWidth + kLeftThick + kRightThick - 20);
                        max_y = Number(detailThickness - ident);
                        if (max_y > 30)
                            max_y = 30;
                        break;
                    case 2:
                    case 4:
                        max_x = Number(detailThickness - ident);
                        if (max_x > 30)
                            max_x = 30;
                        min_y = 20;
                        max_y = Number(detailHeight + kTopThick + kBottomThick - 20);
                        break;
                }
                if (!(min_x <= hole['x'] && hole['x'] <= max_x) || !(min_y <= hole['y'] && hole['y'] <= max_y)) {
                    return false;
                } else {
                    return true;
                }

            },
            check_max_depth(hole){
                var val = parseFloat(hole['z']).toFixed(1);

                var side = Number(hole['side']);
                var type = Number(hole['type']);
                var maxD = (side == 1 || side == 6 ? maxDrillingDepthFlat : maxDrillingDepthEdge);
                var d = Number(hole['d']);
                var min = (d == 7 && (side == 1 || side == 6)) ? (detailThickness + 5 < maxD ? detailThickness + 5 : maxD) : 1;
                var margin = 3; // (d == 15 || d == 20 || d == 35) ? 4 : 3;
                if (materialType == 'compact') {
                    margin = 2;
                }
                var max = (d == 7 && (side == 1 || side == 6) && materialType != 'fanera') ? maxD : (detailThickness > maxD ? maxD : detailThickness - margin);
                // if ((side == 1 || side == 6) && ((val >= thickness && val < thickness + 5) || val == thickness )) {
                //     val = thickness + 5;
                // }

                switch (Number(side)) {
                    case 1://лицевая
                    case 6://тыльная
                        max = ((val >= detailThickness || d == 7) && materialType != 'fanera') ? maxD : (detailThickness > maxD ? maxD : detailThickness - margin);
                        if (Number(drilling.getval('type')) == 0)
                            max = detailThickness - margin;
                        if (d == '60') {
                            min = 6;
                            max = 40;
                        }
                        if (Number(drilling.getval('type') == 48)){
                            max = 18;
                        }

                        if (d == '60' && type == 0 && drilling.getval('z') > max && drilling.getval('z') != '') {
                            showErrorMessage(LANG['BAD-VALUE-DETH-MAX'] + max + 'мм.');
                            return false;
                        }

                        if (constructorId == 'dsp' && drilling.getval('type') == 0) {

                            var minDeaf = 1;
                            var maxDeaf = (detailThickness - 3);
                            min = detailThickness + 3;
                            max = 30;
                            val = Number(val);
                            if (val < 1) {
                                showErrorMessage(LANG['MIN-DETH-OTV-1MM']);
                                return false;
                            }
                            if (val >= 1 && val > detailThickness - 2 && val != '') {
                                if (!(min <= val && val <= max && min <= max) && d != 60) {
                                    showErrorMessage(LANG['BAD-VALUE-DETH']+'\n'+LANG['OT-B'] + minDeaf + ' до ' + maxDeaf + LANG['GLUH-OTV'] +'\n' + LANG['MAX-DETH-SK-OTV'] + max + '.');
                                    drilling.setval('z', '');
                                    drilling.focus('z');
                                    return false;
                                }

                                if (d != 5 && d != 7 && d != 8 && d != 10 && d != 60) {
                                    showErrorMessage(LANG['OTV-CHOOSED-DIAM']);
                                    return false;
                                }
                            }
                            if (d == 2 && val > 5) {
                                showErrorMessage(LANG['OTV-DIAM-2MM-5MM']);
                                return false;
                            }
                            return true;
                        }
                        if (constructorId == 'stol' && materialType == 'compact') {
                            if (d == 2 && val > 2) {
                                showErrorMessage(LANG['OTV-DIAM-2MM']);
                                return false;
                            }
                            if ((d == 3.5 || d == 4.5 || d == 5.5 || d == 10) && val > 10) {
                                showErrorMessage(LANG['OTV-DIAM-3.5MM-4.5MM-5.5MM'] + d + LANG['MAX-DEPTH-FOR-OTV-3.5MM-4.5MM-5.5MM']);
                                return false;
                            }
                            return true;
                        }
                        break;
                    case 2://левая
                    case 3://верхняя
                    case 4://правая
                    case 5://нижняя
                        max = Number(maxD);
                        break;
                }
                if (materialType == 'compact') {
                    if (d == 2) {
                        max = 2;
                    }
                } else {
                    if (d == 2) {
                        max = 5;
                    }
                }
                if (constructorId == 'steklo') {
                    max = maxDrillingDepthFlat;
                }
                if (!(min <= val && val <= max && min <= max) && (d != 60) && val != '') {
                    showErrorMessage(LANG['BAD-VALUE-DETH']+'\n'+LANG['DETH'] + (((val > detailThickness - margin && val < detailThickness) || (val == 0 && (d != 7 || d != 60))) ? LANG['GLUH-OTV'] : '') + LANG['MUST-BE']+'\n'+LANG['OT-S'] + min + 'мм до ' + max + 'мм.');

                    drilling.setval('z', '');
                    drilling.focus('z');
                    return false;
                } else if ((d == 60 || d == 7) && detailThickness > max) {
                    showErrorMessage(LANG['BAD-VALUE-THICK']+' (' + detailThickness + ')!\n'+LANG['THICK-DETAIL-MUST-BE'] + max + 'мм.');
                    $('#holesActions').val('');
                    return false;
                }
                // drilling.setval('z', val);
                return true;
            },
            svg(hole_key, hole, detailKey) {
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({
                        controller: 'Additives',
                        action: 'getSVGForHole',
                        hole_key: hole_key,
                        hole: hole,
                        detail_key: detailKey
                    }),
                    dataType: 'json',
                    success: function (data) {
                        var svgHoleMain = data[0];
                        var svgHoleDop = data[1];
                        var holeKey = data[2];

                        $('.svg-holes-' + holeKey).remove();

                        for (var i in svgHoleMain) {
                            document.getElementById('svg-side-' + i + '-contour').outerHTML += svgHoleMain[i];
                        }

                        for (var i in svgHoleDop) {
                            document.getElementById('svg-side-' + i + '-contour').outerHTML += svgHoleDop[i];
                        }

                        drilling.use('svgs_init');

                        hole_key = "";
                        return data;
                    }
                });
            },
            svgAll(holes) {
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({
                        controller: 'Additives',
                        action: 'getSVGForHoles',
                        holes: holes,
                        detail_key: detailKey
                    }),
                    dataType: 'json',
                    success: function (data) {
                        var svgHoleMain = data[0];
                        var svgHoleDop = data[1];

                        for (var i in svgHoleMain) {
                            $("#svg-side-" + i).html($("#svg-side-" + i).html() + svgHoleMain[i]);
                        }

                        for (var i in svgHoleDop) {
                            $("#svg-side-" + i).html($("#svg-side-" + i).html() + svgHoleDop[i]);
                        }

                        drilling.use('svgs_init');

                        hole_key = "";
                        return data;
                    }
                });
            },
            svgs_init() {
                var els = document.querySelectorAll('g[class^=svg-holes-]');
                for (var i = 0; i < els.length; i++) {
                    drilling.use('svg_init_el', [els[i]]);
                }
            },
            svg_init_el(el) {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-holes-/)) {
                            return Number(el.classList[i].replace('svg-holes-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[detailHoles[id][0] - 1];
                    var x = detailHoles[id][1];
                    var y = detailHoles[id][2];
                    var z = detailHoles[id][3];
                    var D = detailHoles[id][4];
                    $('#drawinfo').text(
                        LANG['ONE-HOLE']+` №${id + 1} (${side}): x=${x}, y=${y}, z=${z}, D=${D}`
                    );
                    showHolePosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];

                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideHolePosition(id);
                };
                el.onclick = e => {
                    var id = getid();
                    focusHole(id);
                };
                el.ondblclick = e => {
                    var id = getid();
                    focusHole(id, 'in');
                    editHole(id);
                };
            },
            rmsvg(holeKey, withoutReplace) {
                $('.svg-holes-' + holeKey).remove();

                if (holeKey != detailHoles.length || withoutReplace) {
                    for (var i = +holeKey + 1; i < detailHoles.length + 1; i++) {
                        var svg;
                        while (svg = document.getElementsByClassName('svg-holes-' + i)[0]) {
                            svg.classList.remove('svg-holes-' + i);
                            svg.classList.add('svg-holes-' + (i - 1));
                        }
                    }
                }

                hidePositionOnSide(1);
                hidePositionOnSide(2);
                hidePositionOnSide(3);
                hidePositionOnSide(4);
                hidePositionOnSide(5);
                hidePositionOnSide(6);
            },
            data(data) {
                detailHoles.length = 0;
                for (var key in data) {
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
                        Number(data[key]['type']),
                    ]);
                }         
            },
            def(id) {
                switch (id) {
                    case 'type':
                        return Object.keys(drilling.cache.params.params)[0];
                }
                return 0;
            },
            //метод обновления данных сверлений и таблицы со сверлениями после смены кромки
            updateHolesAfterKromka(){
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: "/service/system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'getDetailHoles', detail_key: detailKey, arrReturn: true}),
                    success: function (data) {
                        detailHoles.length = 0;
                        for (var key in data) {
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
                                Number(data[key]['type']),
                            ]);
                        }
                        drilling.functions.table();
                    }
                });
            },
            saveTypeForPaket(){
                var massPaket1 = [20, 21, 22, 23];
                var massPaket2 = [24, 25, 26, 27];
                var massPaket3 = [30, 31, 32, 33];
                var massPaket4 = [34, 35, 36, 37];
                var fullMass = massPaket1.concat(massPaket2.concat(massPaket3).concat(massPaket4));
                if (fullMass.includes(Number(drilling.cache.cur_type_value))){
                    var massPaketRes = 0;
                    if (massPaket1.includes(Number(drilling.cache.cur_type_value))){
                        massPaketRes = massPaket1;
                    } else if (massPaket2.includes(Number(drilling.cache.cur_type_value))){
                        massPaketRes = massPaket2;
                    } else if (massPaket3.includes(Number(drilling.cache.cur_type_value))){
                        massPaketRes = massPaket3;
                    } else if (massPaket4.includes(Number(drilling.cache.cur_type_value))){
                        massPaketRes = massPaket4;
                    }
                    if (massPaketRes){
                        var optSelected = false;
                        $("#holeTypeSelect option").each(function(){
                            if(massPaketRes.includes(Number($(this).val()))){
                                $('#holeTypeSelect').val($(this).val());
                                optSelected = true;
                            }
                        });
                        if (!optSelected){
                            $('#holeTypeSelect').val(0);
                        }
                    } else{
                        $('#holeTypeSelect').val(drilling.cache.cur_type_value);
                    }
                    return true;
                }
                return false;
            },
        },
        init(data, global_data) {
            // заполняем массив параметров
            drilling.cache.params = global_data.holes_data;
            drilling.cache.side = undefined;
            // заполняем массив с отверстиями
            drilling.functions.data(data.holes);
            // билдим таблицу отверстий
            drilling.use('table');//drilling.functions.table();

            // заполняем список сторон
            var side_select = drilling.getinput('side');
            for (var side in drilling.cache.params.sides) {
                side_select.options[side_select.options.length] = new Option(side, drilling.cache.params.sides[side]);
            }
            
            // запускаем инит из супер класса
            drilling.super();

            if (ro) {
                drilling.disabled('holes', true);
                return;
            }

            drilling.setval('side', '1');
            drilling.methods.side();
            drilling.functions.types();
            drilling.setval('type', 0);
        },
        reinit(data) {
            // заполняем массив с отверстиями
            drilling.functions.data(data.holes);
            // билдим таблицу отверстий
            drilling.use('table');
        }
    };

    return drilling;
});
