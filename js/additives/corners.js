function editCornerOperation(corner_key) {
    var active_tab = sessionStorage.getItem('active-edit');
    var position2 = $('#' + active_tab).position();

    if (active_tab == $('#modal10').attr('id') && position2 != undefined && $('#' + active_tab).css("display") != "none") {
        sessionStorage.setItem("modal-left", position2.left);
        sessionStorage.setItem("modal-top", position2.top);
    }
    if (active_tab != $('#modal10').attr('id')) {
        if (position2 != undefined && $('#' + active_tab).css("display") != "none") {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);
        }
        $('#' + active_tab).css("display", "none");
        $('*[data-id="' + active_tab + '"]').removeClass('active');
        sessionStorage.setItem('active-edit', $('#modal10').attr('id'));
    }
    if ($('.left-container-menu').hasClass('active')) {
        $('.left-container-menu').removeClass('active');
        $('.modalwin').css("display", "none");
    }
    if (sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null) {
        $('#modal10').css("display", "block");
        $('#modal10').css("left", "75px");
    } else {
        $('#modal10').css("display", "block");
        $('#modal10').css("left", sessionStorage.getItem('modal-left') + "px");
        $('#modal10').css("top", sessionStorage.getItem('modal-top') + "px");
    }
    sessionStorage.setItem('active-edit', $('#modal10').attr('id'));
    $('#modal10').draggable({containment: "html"});
    $('*[data-id="modal10"]').addClass('active');
    var corners = g_detail.getModule('corners');
    corners.cache.editKey = corner_key;

    corners.setval('side', corner_key);
    corners.method('side');
    corners.disabled('side');
    corners.method('diagonalCut');

    $('#collapseCorners').collapse("show");

    corners.setval('ext', detailCorners[corner_key][7]);
    corners.use('check_joint');
    if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
        corners.functions.setEdgeCutting(detailCorners[corner_key][8]);
    }

    window.frames[0]
        ? window.frames[0].document.getElementById('panel-corners').scrollIntoView()
        : window.document.getElementById('panel-corners').scrollIntoView();
}

function delCornerOperation(corner_key) {
    var corners = g_detail.getModule('corners');
    g_detail.rmOperation(
        'corner',
        {
            detail_key: detailKey,
            corner_key: corner_key
        },
        function (data) {
            if (data && data['type']) {
                corners.setval('type', data['type']);
                corners.method('type');
                if (Number(data['type']) == 1) {
                    corners.setval('r', data['r']);
                    corners.setval('r_x', data['x']);
                    corners.setval('r_y', data['y']);
                    corners.setval('edge', data['kromka']);
                } else if (Number(data['type']) == 2) {
                    corners.setval('x', data['x']);
                    corners.setval('y', data['y']);
                    corners.setval('diagonalCut', data['diagonalCut']);
                    corners.setval('cornerSrez', data['cornerSrez']);
                    corners.setval('edge', data['kromka']);
                } else if (Number(data['type']) == 3) {
                    corners.setval('x', data['x']);
                    corners.setval('y', data['y']);
                    corners.setval('ext', data['ext']);
                    corners.setval('edge', data['kromka']);
                    corners.setval('edge_side', data['kSide']);
                }
            } else {
                corners.use('clear');
                corners.setval('type', 0);
                corners.method('type');
            }
            corners.use('onedata', [corner_key, data]);
            corners.use('table');
            draw();
            corners.use('check_joint');
        }
    );
}

define(function (require, exports, module) {
    var corners = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        customValues: {
            grain_copy_active: false,
        },
        inputs: {
            // список полей ввода
            get side() {
                return document.getElementById('cornersSelect');
            },
            get type() {
                return document.getElementById('cornersTypeSelect');
            },
            get is_in_r() {
                return document.getElementById('inner_radius');
            },
            get r() {
                return document.getElementById('radius_R');
            },
            get r_x() {
                return document.getElementById('radius_X');
            },
            get r_y() {
                return document.getElementById('radius_Y');
            },
            get offset() {
                return document.getElementById('radius_XY');
            },
            get x() {
                return document.getElementById('section_X');
            },
            get y() {
                return document.getElementById('section_Y');
            },
            get joint() {
                return document.getElementById('jointSelect');
            },
            get joint_msg() {
                return document.getElementById('setJointMessage');
            },
            get edge() {
                return document.getElementById('kromka');
            },
            get edge_side() {
                return document.getElementById('kromkaSideSelect');
            },
            get ext() {
                return document.getElementById('cutoutExt');
            },
            get add() {
                return document.getElementById('addButtonCorner');
            },
            get type_field() {
                return document.getElementById('cornersType');
            },
            get is_in_r_field() {
                return document.getElementById('inner');
            },
            get r_field() {
                return document.getElementById('cornersRadius');
            },
            get offset_field() {
                return document.getElementById('radius_ch');
            },
            get xy_field() {
                return document.getElementById('cornersSection');
            },
            get joint_field() {
                return document.getElementById('setJoint');
            },
            get edge_field() {
                return document.getElementById('cornersKromka');
            },
            get edge_side_field() {
                return document.getElementById('cornersKromkaSideSelect');
            },
            get ext_field() {
                return document.getElementById('cutoutExtGroup');
            },
            get add_field() {
                return document.getElementById('cornersButtonAdd');
            },
            get table() {
                return document.getElementById('additives-tbl-container-corners');
            },
            get is_nostep() {
                return document.getElementById('withoutStep');
            },
            get withoutStepField() {
                return document.getElementById('withoutStepField');
            },
            get diagonalCutGroup() {
                return document.getElementById('diagonalCutGroup');
            },
            get diagonalCut() {
                return document.getElementById('diagonalCut');
            },
            get cornerSrezGroup() {
                return document.getElementById('cornerSrezGroup');
            },
            get cornerSrez() {
                return document.getElementById('cornerSrez');
            },
            get cornersLabelKromka() {
                return document.getElementById('cornersLabelKromka');
            },
        },
        methods: {
            // инвенты для полей ввода
            side(e) {
                var side = corners.getval('side');
                if (Number(side) === 0) {
                    corners.hideinput('type_field');
                    corners.hideinput('joint_field');
                    corners.setval('type', 0);
                    corners.method('type');
                } else {
                    corners.showinput('type_field');
                    side = Number(side);
                    if (side && detailCorners[side].length) {
                        var data = corners.use('data_to_object', [detailCorners[side]]);
                        corners.setval('type', data['type']);
                        corners.method('type');
                        switch (Number(data['type'])) {
                            case 1:
                                corners.setval('r', data['r']);
                                corners.setval('is_in_r', Number(data['inner']))
                                if (data['inner']) {
                                    corners.showinput('offset_field');
                                } else {
                                    corners.hideinput('offset_field');
                                }
                                corners.setval('is_nostep', Number(data['withoutStep']));
                                corners.setval('r_x', data['x']);
                                corners.setval('r_y', data['y']);
                                corners.setval('offset', data['x']);
                                break;
                            case 2:
                                corners.setval('x', data['x']);
                                corners.setval('y', data['y']);
                                corners.setval('diagonalCut', data['diagonalCut']);
                                corners.showinput('diagonalCutGroup');
                                corners.setval('cornerSrez', data['cornerSrez']);
                                break;
                            case 3:
                                corners.setval('x', data['x']);
                                corners.setval('y', data['y']);
                                corners.setval('r', data['r']);
                                corners.setval('ext', data['ext']);
                                corners.setval('edge_side', data['kSide']);
                                corners.showinput('ext_field');
                                var kThick = (data['kromka']) ? kromki[Number(data['kromka'])][1] : data['kromka'];
                                if (
                                    ((data['kSide'] > 0 && Number(data['kromka']) > 0) ||
                                        kThick >= 0.8) && !data['r']
                                ) {
                                    corners.setval('ext', true);
                                    // corners.disabled('ext', true);
                                } else if (data['r']) {
                                    corners.setval('ext', false);
                                    // corners.disabled('ext', true);
                                }
                                break;
                        }
                        if (data['cornerSrez'] != 0) {
                            corners.setval('edge', 1);
                            corners.methods.edge();
                        } else {
                            corners.setval('edge', data['kromka']);
                        }
                    } else {
                        //не стираем поля x и y после смены side
                        corners.cache.x_y = true;
                        corners.method('type');
                    }
                }

                if (side > 0) {
                    if (!sessionStorage.getItem('showMessCorners') && materialType == 'compact') {
                        showWarningMessage(LANG['PLOSKAYA-OBRABOTKA-PO-UMOLCHANIYU']);
                        sessionStorage.setItem('showMessCorners', 1);
                    }
                }

                corners.method('diagonalCut');
            },
            type(e) {
                corners.method('diagonalCut');
                var type = Number(corners.getval('type'));
                var side = Number(corners.getval('side'));
                corners.use('clear');
                corners.use('hideall');
                var show = [];
                var showMessage  = (type) => {
                    if (!sessionStorage.getItem('showMess' + type) && !(['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                        showWarningMessage(LANG['ZNACH-PARAMETR-SMESHN-BEZ-UCHETA-KROM-UGL'] + '<br>' +
                            '<a href="https://vp.viyar.ua/service/doc/?cid=dsp&s=corners" target="_blank">' +
                                LANG['FOR-MORE-DETAIL-LOOK-HERE'] +
                            '</a>');
                        sessionStorage.setItem('showMess' + type, 1);
                    }
                };

                if (type == '2' || type == '3') {
                    showMessage(type);
                }

                switch (type) {
                    case 1:
                        show.push('r_field', 'edge_field', 'add_field', 'withoutStepField');
                        if (!side) {
                            break;
                        }
                        var neighbor_corner1 = (side === 1) ? 4 : (side - 1);
                        var neighbor_corner2 = (side === 4) ? 1 : (side + 1);
                        corners.cache.setedge = false;
                        if (detailCorners[neighbor_corner1].length) {
                            corners.cache.setedge = true;
                            corners.setval('edge', detailCorners[neighbor_corner1][5]);
                        } else if (detailCorners[neighbor_corner2].length) {
                            corners.cache.setedge = true;
                            corners.setval('edge', detailCorners[neighbor_corner2][5]);
                        }
                        $("#kromka option[value='1']").remove();
                        $("#cornersLabelKromka").text('Кромка');
                        break;
                    case 2:
                        show.push('xy_field', 'edge_field', 'add_field', 'diagonalCutGroup');
                        corners.hideinput('joint_field');
                        corners.hideinput('cornerSrezGroup');

                        if (!($("#kromka option[value='1']").length > 0)) {
                            $("#kromka").append("<option value=1>Срез под углом</option>");
                        }
                        $("#cornersLabelKromka").text('Кромка/срез');

                        break;
                    case 3:
                        show.push('xy_field', 'ext_field', 'edge_field', 'edge_side_field', 'add_field', 'r_field');
                        // corners.setval('ext', true);
                        corners.method('ext');
                        corners.hideinput('joint_field');
                        $("#kromka option[value='1']").remove();
                        $("#cornersLabelKromka").text('Кромка');
                        break;
                }
                if (show.length) {
                    corners.showinput(show);
                    if (Number(corners.getval('edge')) == 1) {
                        corners.showinput('cornerSrezGroup');
                    }
                }

                if (type && (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                    corners.showinput('edgeCuttingSection');
                } else {
                    corners.hideinput('edgeCuttingSection');
                }


            },
            is_in_r(e) {
                if (corners.getval('is_in_r')) {
                    corners.showinput('offset_field');
                } else {
                    corners.hideinput('offset_field');
                }
            },
            r(e) {
                var type = Number(corners.getval('type'));
                var r = corners.use('calc', [corners.getinput('r')]);
                var x = Number(corners.getval('x'));
                var y = Number(corners.getval('y'));
                var edge = Number(corners.getval('edge'));
                corners.use('check_joint');
                if (edge) {
                    edge = kromki[edge];
                }
                if (type === 3) { // cutout (зарез) - совсем другие условия
                    if (r != 0) {
                        corners.setval('edge_side', 0);
                        corners.disabled('edge_side', true);
                        corners.setval('ext', false);
                    } else if (r == 0 && r != '') {
                        if (detailThickness < 25) {
                            corners.disabled('edge_side', false);
                        }
                        corners.setval('ext', true);
                        return true;
                    }
                    var min = 0;
                    if (materialType == 'compact' && corners.getval('type') == 3) {
                        min = 6;
                    } else {
                        min = corners.functions.getMinRZarez(edge);
                    }

                    var max = (Math.min(x, y) < min ? min : Math.min(x, y)) || 10;
                    if (r < min || r > max) {
                        if (r != 0) {
                            if (r < min) {
                                showErrorMessage(
                                    LANG['BAD-VALUE-RADIUS-MUST'] + ` ${min}мм.`
                                );
                            } else {
                                showErrorMessage(
                                    LANG['BAD-VALUE-RADIUS-MUST'] + ` ${min}мм до ${max}мм.`
                                );
                            }
                        }
                        corners.setval('r', '');
                        corners.focus('r');
                        return false;
                    }

                    let minL;
                    if ((x <= 150 && y < min) || (y <= 150 && x < min)) {
                        minL = 20;
                    } else {
                        minL = 80;
                    }
                    let maxX = detailFullWidth - minL;
                    let maxY = detailFullHeight - minL;
                    if (x < min) {
                        showErrorMessage(
                            LANG['BAD-VALUE-SMESH-BY-X'] + ` ${min}мм до ${maxX}мм.`
                        );
                        corners.setval('x', '');
                        corners.focus('x');
                        return false;
                    }
                    if (y < min) {
                        showErrorMessage(
                            LANG['BAD-VALUE-SMESH-BY-Y'] + ` ${min}мм до ${maxY}мм.`
                        );
                        corners.setval('y', '');
                        corners.focus('y');
                        return false;
                    }

                    return true;
                } else {
                    if (materialType == 'compact' && corners.getval('type') == 1) {
                        var min = 1;
                        corners.setval('r', (r-(r%1)));
                    } else {
                        min = corners.functions.getMinR(edge);
                    }
                    var max = Math.min(detailFullWidth, detailFullHeight);
                    if (min > r || max < r) {
                        showErrorMessage(
                            LANG['BAD-VALUE-MUST-BE'] + ` ${min}мм до ${max}мм.`
                        );
                        corners.setval('r', '');
                        corners.focus('r');
                        return false;
                    }
                    return true;
                }
            },
            offset(e) {
                if (!corners.getval('is_in_r')) {
                    return true;
                }
                var offset = corners.use('calc', [corners.getinput('offset')]);
                var r = corners.use('calc', [corners.getinput('r')]);
                var edge = Number(corners.getval('edge'));
                var min = 10;
                if (window.constructorID === 'stol') {
                    min = 80;
                } else if (edge && edge[1] > 0.8) {
                    min = detailThickness > thickness ? 80 : 70;
                }
                var max = Math.min(detailFullWidth, detailFullHeight);
                if (offset > r) {
                    showErrorMessage(LANG['BAD-VALUE-SMESH-NO-RAD']);
                    corners.focus('offset');
                    return false;
                }
                if (offset < min || offset > max) {
                    showErrorMessage(
                        LANG['BAD-VALUE-MUST-BE'] + ` ${min}мм до ${max}мм.`
                    );
                    corners.focus('offset');
                    return false;
                }
                return true;
            },
            x(e) {
                var type = Number(corners.getval('type'));
                var x = corners.use('calc', [corners.getinput('x')]);
                var y = Number(corners.getval('y'));
                var edge = Number(corners.getval('edge'));
                if (edge) {
                    edge = kromki[edge];
                }

                if (type === 3) { // cutout (зарез) - совсем другие условия
                    if (materialType == 'compact') {
                        var min = 6;
                    } else {
                        if (corners.getval('y') < 10 && corners.getval('y') != '') {
                            var min = 10;
                        } else {
                            var min = 3;
                        }
                    }
                    if (window.constructorID === 'stol') {
                        //min = 50;
                        min = 25;
                    } else {
                        if (edge) {
                            //min = y >= 30 ? 20 : 30;
                            min = edge[1] > 0.8 ? 50 : 20;
                        } else if (detailThickness > thickness) {
                            min = 20;
                        }
                    }
                    // if (edge && edge[1] > 0.8) {
                    //     if (x < min || y < min) {
                    //         showErrorMessage('Кромка слишком толстая для указанных размеров зареза.');
                    //         corners.setval('edge', 0);
                    //         corners.method('edge');
                    //         return false;
                    //     }
                    // }
                    if (x < min) {
                        showErrorMessage(LANG['MIN-ZNACH-ZAREZ-MUST-BE'] + min + '.');
                        corners.setval('x', '');
                        return false;
                    }
                    return true;
                } else {
                    var min = window.constructorID === 'stol' ? 1 : 1;
                    var max = detailFullWidth;
                    if (x < min || x > max) {
                        showErrorMessage(
                            LANG['BAD-VALUE-MUST-BE'] + ` ${min}мм до ${max}мм.`
                        );
                        corners.setval('x', '');
                        corners.focus('x');
                        return false;
                    }
                    return true;
                }
            },
            y(e) {
                var type = Number(corners.getval('type'));
                var y = corners.use('calc', [corners.getinput('y')]);
                var x = Number(corners.getval('x'));
                var edge = Number(corners.getval('edge'));
                if (edge) {
                    edge = kromki[edge];
                }

                if (type === 3) { // cutout (зарез) - совсем другие условия
                    if (corners.getval('x') < 10 && corners.getval('x') != '') {
                        var min = 10;
                    } else {
                        var min = 3;
                    }
                    if (window.constructorID === 'stol') {
                        //min = 50;
                        min = 25;
                    } else if (edge) {
                        //min = x >= 30 ? 20 : 30;
                        min = edge[1] > 0.8 ? 50 : 20;
                    } else if (detailThickness > thickness) {
                        min = 20;
                    }
                    // if (edge && edge[1] > 0.8) {
                    //     if (x < min || y < min) {
                    //         showErrorMessage('Кромка слишком толстая для указанных размеров зареза.');
                    //         corners.setval('edge', 0);
                    //         corners.method('edge');
                    //         return false;
                    //     }
                    // }
                    if (y < min) {
                        showErrorMessage(LANG['MIN-ZNACH-ZAREZ-MUST-BE'] + min + '.');
                        corners.setval('y', '');
                        return false;
                    }
                    return true;
                } else {
                    var min = window.constructorID === 'stol' ? 1 : 1;
                    //var min = 1;
                    var max = detailFullHeight;
                    if (y < min || y > max) {
                        showErrorMessage(
                            LANG['BAD-VALUE-MUST-BE'] + ` ${min}мм до ${max}мм.`
                        );
                        corners.setval('y', '');
                        corners.focus('y');
                        return false;
                    }
                    return true;
                }
            },
            cornerSrez(e) {
                var cornerSrez = corners.getval('cornerSrez');
                var min = -45;
                var max = 45;
                if (cornerSrez < min || cornerSrez > max) {
                    showErrorMessage(
                        LANG['BAD-VALUE-MUST-BE'] + ` ${min}` + '&deg;' + ` до ${max}.` + '&deg;'
                    );
                    corners.setval('');
                    return false;
                }
                if (!Number.isInteger(Number(cornerSrez))) {
                    showErrorMessage(
                        'Неверное значение угла. Значение должно быть целым числом.'
                    );
                    corners.setval('');
                    return false;
                }
                return true;
            },
            joint(e) {
                var joint = corners.getval('joint');
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'setJointForDetail', detail_key: detailKey, joint: joint}),
                    dataType: 'json',
                    success: function () {
                        detailJoint = joint;
                        draw();
                    }
                });
            },
            edge(e) {
                var side = Number(corners.getval('side'));
                // -- вынесено из type, бо вешалось сюда на onchange... что оно такое пока не ясно
                if (corners.cache.setedge && corners.getval('edge') != 0) {
                    var check = true;
                    side
                    if (constructorId == 'stol' && (((side == 1 || side == 4) && !kromkaBottomCut) || ((side == 2 || side) == 3 && !cromkaTopCut && materialSecondRounded))) {
                        check = false;
                    }
                    if (check) {
                        showWarningMessage(LANG['CHOOSED-KROMKA-WILL-SET-TORTS']);
                        corners.cache.setedge = false;
                    }
                    // return false;
                }
                // ------------------
                var type = Number(corners.getval('type'));
                var r = Number(corners.getval('r'));
                var edge = Number(corners.getval('edge'));
                if (edge > 10) {
                    var edge_thk = edge ? kromki[edge][1] : 0;
                } else {
                    edge_thk = 0;
                }
                var x = Number(corners.getval('x'));
                var y = Number(corners.getval('y'));
                var side = Number(corners.getval('side'));

                if (type === 1) {
                    corners.use('check_joint');
                    return true;
                }
                if (type === 2) {
                    if (corners.getval('edge') == 1) {
                        corners.showinput('cornerSrezGroup');
                    } else {
                        corners.hideinput('cornerSrezGroup');
                    }
                }
                if (type === 3) { // cutout
                    var min = 20;
                    if (window.constructorID === 'stol') {
                        if (edge > 0 && edge_thk > 0.8){
                            min = 50;
                        } else{
                            min = 20;
                        }
                    } else if (edge) {
                        if (edge_thk > 0.8) {
                            min = 50;
                        } else {
                            min = 20;
                        }
                    } else if (detailThickness > thickness) {
                        min = 20;
                    }
                    if (constructorID != 'stol' && edge_thk > 0.8 && r != 0 && r != '') {
                        if (detailThickness > 32 && r < 80) {
                            showErrorMessage(LANG['RADIUS-ZAREZA-MUST-BE-FROM-80']);
                            corners.setval('edge', 0);
                            corners.focus('edge');
                            corners.method('edge');
                            return false;
                        } else if (detailThickness < 32 && r < 70) {
                            showErrorMessage(LANG['RADIUS-ZAREZA-MUST-BE-FROM-70']);
                            corners.setval('edge', 0);
                            corners.focus('edge');
                            corners.method('edge');
                            return false;
                        }
                    }
                    if (edge_thk > 0.8 || (side > 0 && edge > 0)) {
                        if (x < min || y < min) {
                            if (edge_thk > 0.8) {
                                showErrorMessage(LANG['OKL-WIDTH-1-2']);
                            } else {
                                showErrorMessage(LANG['OKL-WIDTH-04-08']);
                            }

                            corners.setval('edge', 0);
                            corners.focus('edge');
                            corners.method('edge');
                            return false;
                        }
                        if (!r) {
                            corners.setval('ext', true);
                            corners.showinput('ext_field');
                        }
                    } else {
                        corners.showinput('ext_field');
                    }
                    if (!r) {
                        // corners.disabled('ext', false);
                    }
                    if (edge === 0) {
                        if (!r && edge_thk === 2 || (side > 0 && edge_thk > 0)) {
                            corners.setval('ext', true);
                            // corners.disabled('ext', true);
                        }
                    }
                }
            },
            edge_side(e) {
                var edge = Number(corners.getval('edge'));
                var edge_thk = edge ? kromki[edge][1] : 0;
                var side = corners.getval('side');
                var r = Number(corners.getval('r'));

                if (side > 0 && edge > 0 && !r) {
                    corners.setval('ext', true);
                    // corners.disabled('ext', true);
                    corners.showinput('ext_field');
                } else if (edge_thk <= 0.8) {
                    corners.showinput('ext_field');
                }
            },
            ext(e) {
                var r = Number(corners.getval('r'));
                var ext = corners.getval('ext');
                if (ext) {
                    corners.setval('r', 0);
                    if (detailThickness < 25) {
                        corners.disabled('edge_side', false);
                    }
                } else {
                    if (materialType == 'compact') {
                        if (!r) {
                            corners.setval('r', 6);
                        }
                    } else {
                        if (!r) {
                            corners.setval('r', 10);
                        }
                    }
                    corners.disabled('edge_side', true);
                    corners.setval('edge_side', 0);
                }
            },
            diagonalCut(e) {
                if (corners.getval('diagonalCut') && corners.getval('type') == 2) {
                    corners.disabled('x', true);
                    corners.disabled('y', true);
                    corners.setval('x', detailFullWidth);
                    corners.setval('y', detailFullHeight);
                } else {
                    corners.disabled('x', false);
                    corners.disabled('y', false);
                }
            },
            add(e) {
                var x = Number(corners.getval('x'));
                var y = Number(corners.getval('y'));
                var type = (corners.getval('type'));
                var ext = Number(corners.getval('ext'));
                var inner = Number(corners.getval('is_in_r'));
                var is_nostep = Number(corners.getval('is_nostep'));
                var edge = Number(corners.getval('edge'));
                var diagonalCut = Number(corners.getval('diagonalCut'));
                var cornerSrez = 0;
                var side = Number(corners.getval('side'));

                switch (Number(type)) {
                    case 1:
                        if (!corners.method('r') || !corners.method('offset')) {
                            return false;
                        }
                        if (constructorId == 'stol' && is_nostep && edge != 0 && (((side == 1 || side == 4) && !kromkaBottomCut) || ((side == 2 || side) == 3 && !cromkaTopCut && materialSecondRounded))) {
                            is_nostep = 0;
                            showErrorMessage(LANG['WARNING-NOSTEP-WITH-RADIUS']);
                        }
                        break;
                    case 2:
                        if (!corners.method('x') || !corners.method('y')) {
                            return false;
                        }
                        if (edge && x < 30 && y < 30) {
                            showErrorMessage(LANG['WARNING-POKL-KRAIKA']);
                            corners.setval('edge', 0);
                            return false;
                        }
                        if (corners.getval('edge') == 1) {
                            cornerSrez = corners.getval('cornerSrez');
                            if (!corners.method('cornerSrez')) {
                                return false;
                            }
                        }
                        break;
                    case 3:
                        if (!corners.method('x') || !corners.method('y') || !corners.method('r')) {
                            return false;
                        }
                        break;
                }
                if (!inner) {
                    corners.setval('offset', '');
                }
                showOkButton2('addButtonCorner');

                if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                    var edgeCutting = corners.functions.getEdgeCutting();

                    if (Number(corners.getval('Zrear')) + Number(corners.getval('Zface')) > detailThickness) {
                        showErrorMessage(LANG['OBSHAYA-DETH-OBR-TORTS'] + ` (${Number(corners.getval('Zrear')) + Number(corners.getval('Zface'))}).` + LANG['MUST-BE-NO-MORE'] + ` ${detailThickness}.`);
                        return false;
                    }
                }

                //если редактируем угол, то editKey != 0
                var editKey = 0;
                if (corners.cache.editKey) {
                    var editKey = corners.cache.editKey;
                    corners.cache.editKey = 0;
                }

                var corner_data = {
                    key: corners.getval('side'),
                    type: type,
                    radius_r: corners.getval('r'),
                    radius_x: corners.getval('offset'),
                    radius_y: corners.getval('offset'),
                    section_x: x,
                    section_y: y,
                    cutout_x: x,
                    cutout_y: y,
                    cutout_r: corners.getval('r'),
                    cutoutExt: ext,
                    inner: inner,
                    withoutStep: is_nostep,
                    kromka: edge,
                    kromkaSide: corners.getval('edge_side'),
                    detail_key: detailKey,
                    edgeCutting: edgeCutting,
                    editKey,
                    diagonalCut,
                    cornerSrez,
                };

                g_detail.setOperation('corner', corner_data, function (data) {
                    var edges = data['edges'];
                    var resCornerOperation = data['resCornerOperation'];
                    data = data['corners'];
                    if (data != null) {
                        var corners = g_detail.getModule('corners');
                        corners.setval('type', data['type']);
                        corners.method('type');
                        switch (Number(data['type'])) {
                            case 1:
                                corners.setval('r', data['r']);
                                corners.setval('r_x', data['x']);
                                corners.setval('r_y', data['y']);
                                corners.setval('offset', data['x']);
                                corners.setval('edge', data['kromka']);
                                corners.setval('is_nostep', false);
                                break;
                            case 2:
                                corners.setval('x', data['x']);
                                corners.setval('y', data['y']);
                                corners.setval('diagonalCut', data['diagonalCut']);
                                corners.setval('edge', data['kromka']);
                                corners.setval('cornerSrez', data['cornerSrez']);
                                break;
                            case 3:
                                corners.setval('x', data['x']);
                                corners.setval('y', data['y']);
                                corners.setval('r', data['r']);
                                corners.setval('ext', data['ext']);
                                corners.setval('edge', data['kromka']);
                                corners.setval('edge_side', data['kSide']);
                                break;
                        }
                    } else {
                        corners.use('clear');
                        corners.setval('type', 0);
                        corners.method('type');
                    }
                    if (resCornerOperation) {
                        var sides = {
                            'left': LANG['LEVAYA'],
                            'top': LANG['VERHAYA'],
                            'right': LANG['PRAVAYA'],
                            'bottom': LANG['NIJNAYA']
                        };
                        var i = 0;
                        var sidesMess = '';
                        for (var index in resCornerOperation) {
                            if (i > 0) {
                                sidesMess += ' и ';
                                sides[index] = sides[index].toLowerCase();
                            }
                            sidesMess += sides[index];
                            i++;
                        }
                        var dropCount = i > 1 ? true : false;
                        showWarningMessage(LANG['WARNING-PRYAMOLIN-KROMKA-CORNER'] + sidesMess + LANG['KROMKA-S'] + (dropCount ? 'и' : 'а') +
                            LANG['WAS'] + LANG['SBROS'] + LANG['CHANCHED-GABARIT-DET-PARAM']);
                    }
                    corners.use('onedata', [corner_data.key, data]);
                    corners.use('table');
                    corners.use('check_joint');
                    draw();
                    ['left', 'top', 'right', 'bottom'].forEach(function (el) {
                        corners.setval(el, edges[el]['param']);
                    });

                    if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {

                        corners.setval('side', 0);
                        if (corners.getval('side') == 0) {
                            corners.hideinput('type_field');
                            corners.setval('type', 0);
                            corners.method('type');
                        }
                        corners.methods.edgeCutting();
                        corners.methods.edgeCuttingRear();
                    }

                    setDetail(detailKey);
                });

                if (fromViyarEmail) {
                    $('#' + sessionStorage.getItem('active-edit')).css("display", "none");
                    $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
                }
            },
            grain_copy(changeValue = true) {
                if (changeValue) {
                    corners.customValues.grain_copy_active = (corners.customValues.grain_copy_active) ? false : true;
                }

                if (materialType =='compact' && ((corners.getval('edgeCutting') == 'faska' &&
                    corners.getval('edgeCuttingRear') == '0' && !changeValue) || (corners.getval('edgeCuttingRear') == 'faska' &&
                        corners.getval('edgeCutting') == '0' && !changeValue))) corners.customValues.grain_copy_active = false;

                if (corners.customValues.grain_copy_active) {
                    $(corners.getinput('grain_copy')).css("background-color", "green");
                    corners.customValues.grain_copy_active = true;
                    corners.disabled('edgeCuttingRear', true);
                    if ((corners.getval('edgeCuttingRear') != 'srez' && corners.getval('edgeCuttingRear') != 'faska') || corners.getval('edgeCutting') != '0') {
                        corners.setval('edgeCuttingRear', corners.getval('edgeCutting'));
                    }
                    corners.methods.edgeCuttingRear();
                    if (corners.getval('edgeCutting') == 'faska') {
                        var Zface = corners.getval('Zface');
                        var Zrear = corners.getval('Zrear');
                        var Dface = corners.getval('Dface');
                        corners.disabled('Wrear', true);
                        corners.disabled('Drear', true);
                        corners.setval('Wrear', Zrear);
                        corners.setval('Drear', Dface);

                        if (materialType == 'compact') {
                            if (Zface == 0.5) {
                                corners.setval('Wface', Zface);
                                corners.setval('Zrear', Zface);
                                corners.setval('Wrear', Zface);
                                if (Zrear == 8) {
                                    corners.setval('Zrear', 8);
                                    corners.setval('Wrear', Zrear);
                                }
                                if (Zrear == 0.5) {
                                    corners.setval('Zrear', 0.5);
                                    corners.setval('Wrear', Zrear);
                                }
                                $('#Zrear option[value="2"]').hide();
                            } else {
                                $('#Zrear option[value="2"]').show();
                            }

                            if (Zface == 2) {
                                $('#Zrear option[value="0.5"]').hide();
                            }

                            if (Zface == 8) {
                                $('#Zrear option[value="8"]').hide();
                            }

                            $(corners.getinput('Zface')).change(function () {
                                let Zrear = corners.getval('Zrear');
                                let Zface = corners.getval('Zface');

                                if (Zface == 2) {
                                    $('#Zrear option[value="0.5"]').hide();
                                    corners.setval('Zrear', Zface);
                                    corners.setval('Wrear', Zrear);
                                } else {
                                    $('#Zrear option[value="0.5"]').show();
                                }
                                if (Zface == 8) {
                                    $('#Zrear option[value="8"]').hide();
                                    corners.setval('Zrear', 0.5);
                                    corners.setval('Wrear', Zrear);
                                } else {
                                    $('#Zrear option[value="8"]').show();
                                }
                                if (Zface == 0.5) {
                                    corners.setval('Zrear', 0.5);
                                    corners.setval('Wrear', Zrear);
                                }
                            });
                            if (corners.getval('edgeCuttingRear') == 'faska') {
                                $('#Zface option[value="11.5"]').hide();
                                $('#Zrear option[value="11.5"]').hide();
                                if (corners.getval('Zface') == 11.5) {
                                    corners.setval('Zface', 0.5);
                                    $('#Zrear option[value="2"]').hide();
                                    corners.setval('Wface', corners.getval('Zface'));
                                    corners.setval('Zrear', corners.getval('Zface'));
                                    corners.setval('Wrear', corners.getval('Zface'));
                                }
                            }
                        }
                    }

                    if (corners.getval('edgeCutting') == 'radius') {
                        var Rface = corners.getval('Rface');
                        corners.disabled('edgeCuttingRear', true);
                        corners.setval('Rrear', Rface);
                    }

                    if (corners.getval('edgeCutting') == 'R2faska') {
                        corners.setval('Zface', 0);
                        corners.setval('Wface', 0);
                    }
                } else {
                    $(corners.getinput('grain_copy')).css("background-color", "transparent");
                    corners.disabled('edgeCuttingRear', false);
                    if (corners.getval('edgeCutting') == 'faska') {
                        corners.disabled('Zrear', false);
                        corners.disabled('Wrear', false);
                        corners.disabled('Drear', false);
                        if (materialType == 'compact') {
                            corners.setval('Wface', corners.getval('Zface'));
                            $(corners.getinput('edgeCuttingRear')).change(function () {
                                if (corners.getval('edgeCuttingRear') == 'faska') {
                                    if (corners.getval('Zface') == 0.5) {
                                        $('#Zrear option[value="2"]').hide();
                                        $('#Zrear option[value="8"]').show();
                                        corners.setval('Zrear', 0.5);
                                    } else {
                                        $('#Zrear option[value="2"]').show();
                                    }
                                    if (corners.getval('Zface') == 2) {
                                        $('#Zrear option[value="0.5"]').hide();
                                        corners.setval('Zrear', 2);
                                    } else {
                                        $('#Zrear option[value="0.5"]').show();
                                    }
                                    corners.setval('Wrear', corners.getval('Zrear'));
                                    $(corners.getinput('Zrear')).change(function () {
                                        corners.setval('Wrear', corners.getval('Zrear'));
                                    });

                                    if (corners.getval('Zface') == 11.5) {
                                        corners.setval('Zface', 0.5);
                                        corners.setval('Wface', corners.getval('Zface'));
                                    }
                                }
                            });
                            if (corners.getval('edgeCuttingRear') == 'faska') {
                                $(corners.getinput('Zface')).change(function () {
                                    if (corners.getval('Zface') == 2) {
                                        $('#Zrear option[value="0.5"]').hide();
                                        $('#Zrear option[value="2"]').show();
                                        corners.setval('Zrear', corners.getval('Zface'));
                                    } else {
                                        $('#Zrear option[value="0.5"]').show();
                                    }

                                    if (corners.getval('Zface') == 0.5) {
                                        $('#Zrear option[value="2"]').hide();
                                        $('#Zrear option[value="8"]').show();
                                        corners.setval('Zrear', corners.getval('Zface'));
                                    } else {
                                        $('#Zrear option[value="2"]').show();
                                    }

                                    if (corners.getval('Zface') == 8) {
                                        $('#Zrear option[value="8"]').hide();
                                        corners.setval('Zrear', 0.5);
                                    }

                                    corners.setval('Wrear', corners.getval('Zrear'));
                                });
                            }
                        }
                    }

                    if (corners.getval('edgeCuttingRear') == 'faska' && corners.getval('edgeCutting') == '0') {
                        $('#Zrear option[value="8"]').hide();
                        $('#Zrear option[value="0.5"]').show();
                        if (corners.getval('Zrear') == 0.5) corners.setval('Wrear', corners.getval('Zrear'));
                    }

                    if (corners.getval('edgeCutting') == 'radius') {
                        corners.disabled('edgeCuttingRear', false);
                    }

                    if (corners.getval('edgeCutting') == 'arc') {
                        corners.methods.edgeCutting();
                    }
                }

                if (corners.getval('edgeCutting') == 'srez') {
                    if (corners.getval('Dface') == '45') {
                        corners.setval('Zface', 12);
                        corners.setval('Wface', 12);
                        corners.disabled('Zface', true);
                        corners.setval('edgeCuttingRear', 0);
                        corners.hideinput('faska_field_rear');
                    }
                    if (corners.getval('Dface') == '-45') {
                        $('#Zrear option[value="2"]').show();
                        corners.setval('edgeCuttingRear', 'srez');
                        corners.disabled('Zrear', true);
                        corners.setval('edgeCutting', 0);
                        corners.methods.edgeCuttingRear();
                    }
                } else {
                    $('#Zrear option[value="12"]').hide();
                    corners.disabled('Zface', false);
                }

                if (materialType == 'compact' && corners.getval('Zface') == 2 && Zrear == '') {
                    corners.setval('Zrear', Zface);
                    corners.setval('Wrear', 2);
                }

                corners.functions.disabledFields();
            },
            Zface(e) {
                corners.functions.calc_wood('Z', 'face');
                corners.methods.grain_copy(false);
            },
            Dface(e) {
                corners.functions.calc_wood('D', 'face');
                corners.methods.grain_copy(false);
            },
            Wface(e) {
                corners.functions.calc_wood('W', 'face');
                corners.methods.grain_copy(false);
            },
            Rface(e) {
                corners.functions.calc_wood('R', 'face');
                corners.methods.grain_copy(false);
            },
            Zrear(e) {
                corners.functions.calc_wood('Z', 'rear');
                corners.methods.grain_copy(false);
            },
            Drear(e) {
                corners.functions.calc_wood('D', 'rear');
                corners.methods.grain_copy(false);
            },
            Wrear(e) {
                corners.functions.calc_wood('W', 'rear');
                corners.methods.grain_copy(false);
            },
            Rrear(e) {
                corners.functions.calc_wood('R', 'rear');
                corners.methods.grain_copy(false);
            },
            edgeCutting(e) {
                var type_kromka = corners.getval('edgeCutting');
                if (Number(type_kromka) == 0) {
                    corners.hideinput('faceSection');
                    if (corners.getval('edgeCuttingRear') == 'faska') $('#Zrear option[value="11.5"]').show();
                } else {
                    corners.showinput('faceSection');
                    if (materialType == 'compact' && corners.getval('r') < 6) {
                        corners.setval('r', 6);
                    }
                }
                if (type_kromka == 'faska') {
                    corners.showinput('faska_field_face');
                    if (materialType == 'compact') {
                        $('#Zface option[value="12"]').hide();
                        if (corners.getval('Zface') == 12) {
                            corners.setval('Zface', 0.5);
                            corners.setval('Wface', corners.getval('Zface'));
                        }
                        if (corners.getval('edgeCuttingRear') == 'srez') {
                            corners.setval('edgeCuttingRear', 0);
                        }
                        if ((corners.getval('Zface') == '' || corners.getval('Zrear') == '') && corners.getval('Zface') != '2' &&
                            corners.getval('Zface') != '11.5') {
                            corners.setval('Zface', 0.5);
                            corners.disabled('Zrear', false);
                        }
                        if (corners.getval('edgeCuttingRear') == 'faska') {
                            if (corners.getval('Zface') == '0.5') corners.customValues.grain_copy_active = true;
                            $('#Zrear option[value="8"]').show();
                            $('#Zrear option[value="11.5"]').hide();
                        }
                    }
                } else {
                    corners.hideinput('faska_field_face');
                }

                if (type_kromka == 'radius') {
                    corners.showinput('radius_field_face');
                    if (materialType == 'compact') {
                        $('#Rface option[value="6"]').hide();
                        $('#Rface option[value="12"]').hide();
                        corners.disabled('Rrear', true);
                    }
                } else {
                    corners.hideinput('radius_field_face');
                }

                if (type_kromka == 'srez') {
                    corners.showinput('faska_field_face');
                } else {
                    if (type_kromka != 'faska') {
                        corners.hideinput('faska_field_face');
                    }
                }

                if (type_kromka == 'R2faska') {
                    corners.showinput('radius_field_face');
                    corners.disabled('Rface', true);
                } else {
                    corners.disabled('Rface', false);
                }

                if (type_kromka == '0') {
                    corners.functions.clear_grain('face')
                }
                corners.functions.rectInterFace('face');
                corners.methods.grain_copy(false);
                corners.methods.edgeCuttingRear();
                corners.functions.reinit(data);
            },
            edgeCuttingRear(e) {
                var type_kromka = corners.getval('edgeCuttingRear');

                if (Number(type_kromka) == 0) {
                    corners.hideinput('rearSection');
                    if (materialType == 'compact' && corners.getval('edgeCutting') == 'faska') {
                        $('#Zface option[value="8"]').hide();
                        if (corners.getval('Zface') == 8) {
                            corners.setval('Zface', 0.5);
                            corners.setval('Wface', corners.getval('Zface'));
                        }
                        $('#Zface option[value="11.5"]').show();
                    }
                } else {
                    corners.showinput('rearSection');
                }
                if (type_kromka == 'faska') {
                    corners.showinput('faska_field_rear');
                    if (materialType == 'compact') {
                        $('#Zface option[value="8"]').show();
                        if ((corners.getval('edgeCutting') == 0 || corners.getval('edgeCutting') == 'srez') && corners.getval('Zrear') != 2 &&
                            corners.getval('Zrear') != 11.5) {
                            corners.setval('Zrear', 0.5);
                            $('#Zrear option[value="8"]').hide();
                            $('#Zrear option[value="2"]').show();
                            $('#Zrear option[value="0.5"]').show();
                            if (corners.getval('Zrear') == 0.5) corners.setval('Wrear', corners.getval('Zrear'));
                            $(corners.getinput('Zrear')).change(function () {
                                corners.setval('Wrear', corners.getval('Zrear'));
                            });
                        }
                        if (corners.getval('edgeCutting') == 'srez') {
                            corners.setval('edgeCutting', 0);
                            corners.hideinput('faska_field_face');
                            corners.setval('Zface', 0.5);
                        }
                        if (corners.getval('edgeCutting') == 'faska') {
                            $('#Zface option[value="11.5"]').hide();
                            $('#Zrear option[value="11.5"]').hide();
                        }
                    }
                } else {
                    corners.hideinput('faska_field_rear');
                }

                if (type_kromka == 'R2faska') {
                    corners.showinput('faska_field_rear');
                    corners.disabled('Rface', true);
                    corners.disabled('Zrear', true);
                    corners.setval('Zrear', 9);
                    corners.setval('Wrear', 9);
                }

                if (type_kromka == 'srez') {
                    corners.showinput('faska_field_rear');
                    corners.disabled('Zrear', true);
                    if (corners.getval('Dface') == '-45') {
                        corners.showinput('faska_field_rear');
                        corners.hideinput('faska_field_face');
                    }
                    corners.setval('Zrear', 12);
                    corners.setval('Wrear', 12);
                    corners.setval('Zface', '');
                    if (corners.getval('edgeCutting') == 'faska' || (corners.customValues.grain_copy_active == false &&
                            corners.getval('edgeCutting') == 'srez')) {
                        corners.setval('edgeCutting', 0);
                        corners.hideinput('faska_field_face');
                    }
                } else {
                    corners.disabled('Zrear', false);
                }

                if (type_kromka == 'radius') {
                    corners.showinput('radius_field_rear');
                } else {
                    corners.hideinput('radius_field_rear');
                }

                var value = corners.getval('edgeCuttingRear');
                if (value == '0') {
                    corners.functions.clear_grain('rear')
                }
                corners.functions.rectInterFace('rear');
            },
        },
        functions: {
            data_to_object(data) {
                return {
                    key: data[0],
                    type: data[1],
                    r: data[2],
                    x: data[3],
                    y: data[4],
                    kromka: data[5],
                    kSide: data[6],
                    ext: data[7],
                    withoutStep: data[9],
                    diagonalCut: data[10],
                    cornerSrez: data[11]
                };
            },
            data(data) {
                for (var key in detailCorners) {
                    corners.use('onedata', [key, data[key]]);
                }
            },
            onedata(key, data) {
                if (data) {
                    detailCorners[key] = [
                        Number(data['key']), //0
                        Number(data['type']),//1
                        Number(data['r']),   //2
                        Number(data['x']),   //3
                        Number(data['y']),   //4
                        Number(data['kromka']),//5
                        Number(data['kSide']), //6
                        Number(data['ext']),//7
                        data['edgeCutting'], //8
                        Number(data['withoutStep']),//9
                        Number(data['diagonalCut']),//10
                        Number(data['cornerSrez']),//11
                    ];
                } else {
                    detailCorners[key] = [];
                }
            },
            table() {
                /*
                 * обновляем таблицу только если есть хотя бы 1 обработка углов
                 * */
                for (var key in detailCorners) {
                    if (detailCorners[key].length > 0) {
                        $.ajax({
                            type: "POST",
                            url: "/service/system/views/additives/inc/tableCorners.php",
                            data: 'detail_key=' + detailKey + '&machineId=' + machine,
                            dataType: "html",
                            success: function (data) {
                                if (data.length > 0) {
                                    corners.showinput('table');
                                    $("#hide-table").css("display", "block");
                                    showHideTableStyles();
                                    corners.getinput('table').innerHTML = data;
                                } else {
                                    corners.hideinput('table');
                                }
                            }
                        });
                        return;
                    }
                }
                corners.hideinput('table');
            },
            getEdgeCutting() {
                var edgeCutting = {
                    face: {type: ''},
                    rear: {type: ''},
                };
                edgeCutting['face']['type'] = corners.getval('edgeCutting');
                edgeCutting['rear']['type'] = corners.getval('edgeCuttingRear');
                if (corners.getval('edgeCutting') == 'faska') {
                    edgeCutting['face']['d'] = corners.getval('Dface');
                    edgeCutting['face']['z'] = corners.getval('Zface');
                    edgeCutting['face']['w'] = corners.getval('Wface');
                }
                if (corners.getval('edgeCuttingRear') == 'faska') {
                    edgeCutting['rear']['d'] = corners.getval('Drear');
                    edgeCutting['rear']['z'] = corners.getval('Zrear');
                    edgeCutting['rear']['w'] = corners.getval('Wrear');
                }

                if (corners.getval('edgeCutting') == 'R2faska') {
                    edgeCutting['face']['r'] = corners.getval('Rface');
                }
                if (corners.getval('edgeCuttingRear') == 'R2faska') {
                    edgeCutting['rear']['d'] = corners.getval('Drear');
                    edgeCutting['rear']['z'] = corners.getval('Zrear');
                    edgeCutting['rear']['w'] = corners.getval('Wrear');
                }

                if (corners.getval('edgeCutting') == 'srez') {
                    edgeCutting['face']['d'] = corners.getval('Dface');
                    edgeCutting['face']['z'] = corners.getval('Zface');
                    edgeCutting['face']['w'] = corners.getval('Wface');
                }
                if (corners.getval('edgeCuttingRear') == 'srez') {
                    edgeCutting['rear']['d'] = corners.getval('Drear');
                    edgeCutting['rear']['z'] = corners.getval('Zrear');
                    edgeCutting['rear']['w'] = corners.getval('Wrear');
                }

                if (corners.getval('edgeCutting') == 'radius') {
                    edgeCutting['face']['r'] = corners.getval('Rface');
                }
                if (corners.getval('edgeCuttingRear') == 'radius') {
                    edgeCutting['rear']['r'] = corners.getval('Rrear');
                }

                if (corners.getval('edgeCutting') == 'arc' || corners.getval('edgeCuttingRear') == 'arc') {

                    var rFace = '';
                    var rRear = '';

                    var selFace = corners.getinput('edgeCutting');
                    $(selFace.options).each(function () {
                        if ($(this).is(':selected')) {
                            rFace = $(this).attr('r');
                        }
                    });

                    var selRear = corners.getinput('edgeCuttingRear');
                    $(selRear.options).each(function () {
                        if ($(this).is(':selected')) {
                            rRear = $(this).attr('r');
                        }
                    });
                    edgeCutting['face']['r'] = rFace;
                    edgeCutting['rear']['r'] = rRear;
                }
                return edgeCutting;
            },
            setEdgeCutting(data) {
                if (data) {
                    if (data['face']['type'] == '') {
                        corners.setval('edgeCutting', 0);
                    } else {
                        corners.setval('edgeCutting', data['face']['type']);
                    }
                    if (data['rear']['type'] == '') {
                        corners.setval('edgeCutting' + "Rear", 0);
                    } else {
                        corners.setval('edgeCutting' + "Rear", data['rear']['type']);
                    }
                    if (data['face']['type'] == "faska") {
                        corners.setval("Zface", data['face']['z']);
                        corners.setval("Wface", data['face']['w']);
                        corners.setval("Dface", data['face']['d']);
                    }
                    if (data['face']['type'] == "srez") {
                        corners.setval("Zface", data['face']['z']);
                        corners.setval("Wface", data['face']['w']);
                        corners.setval("Dface", data['face']['d']);
                    }
                    if (data['face']['type'] == "radius") {
                        corners.setval("Rface", data['face']['r']);
                    }
                    if (data['rear']['type'] == "faska") {
                        corners.setval("Zrear", data['rear']['z']);
                        corners.setval("Wrear", data['rear']['w']);
                        corners.setval("Drear", data['rear']['d']);
                    }
                    if (data['rear']['type'] == "srez") {
                        corners.setval("Zrear", data['rear']['z']);
                        corners.setval("Wrear", data['rear']['w']);
                        corners.setval("Drear", data['rear']['d']);
                    }
                    if (data['rear']['type'] == "radius") {
                        corners.setval("Rrear", data['rear']['r']);
                    }
                }
                corners.methods.edgeCutting();
                corners.methods.edgeCuttingRear();

            },
            check_joint() {
                if (detailCorners[1] && detailCorners[1][1] == 1 && detailCorners[1][5]
                    && detailCorners[2] && detailCorners[2][1] == 1 && detailCorners[2][5]
                    && detailCorners[3] && detailCorners[3][1] == 1 && detailCorners[3][5]
                    && detailCorners[4] && detailCorners[4][1] == 1 && detailCorners[4][5]) {
                    corners.showinput('joint_field');
                } else if (corners.getval('type') == 1 && corners.getval('side') == '1,2,3,4'
                    && corners.getval('r') > 0 && corners.getval('edge') != 0 && materialType != 'compact') {
                    corners.showinput('joint_field');
                } else {
                    detailJoint = '';
                    corners.hideinput('joint_field');
                    corners.hideinput('joint_msg');
                    corners.setval('joint', 0);
                    corners.method('joint');
                }
                corners.setval('joint', detailJoint);
            },
            init_joint() {
                var select = corners.getinput('joint');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO'], '0');
                    select.options[1] = new Option(LANG['VERHAYA'], '3');
                    select.options[2] = new Option(LANG['LEVAYA'], '2');
                    select.options[3] = new Option(LANG['PRAVAYA'], '4');
                    select.options[4] = new Option(LANG['NIJNAYA'], '5');
                }
                corners.use('check_joint');
            },
            init_sides() {
                var select = corners.getinput('side');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option('', '0');
                    select.options[1] = new Option(LANG['LEV-NIZ-COR'], '1');
                    select.options[2] = new Option(LANG['LEV-VERH-COR'], '2');
                    select.options[3] = new Option(LANG['PRAV-VERH-COR'], '3');
                    select.options[4] = new Option(LANG['PRAV-NIZ-COR'], '4');
                    select.options[5] = new Option(LANG['ALL-CORNERS'], '1,2,3,4');
                }
            },
            init_types() {
                var select = corners.getinput('type');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO-S'], '0');
                    select.options[1] = new Option(LANG['RADIUS'], '1');
                    select.options[2] = new Option(LANG['UGOL-S'], '2');
                    select.options[3] = new Option(LANG['ZAREZ-SMALL'], '3');
                }
                if (materialType == 'osb' && select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO-S'], '0');
                    select.options[1] = new Option(LANG['UGOL-S'], '2');
                }
            },
            init_edges() {
                var select = corners.getinput('edge');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO'], 0);
                    for (var key in edgeList) {
                        var edge = edgeList[key];
                        if (edge['height'] + 3 < detailThickness || edge['type'] == 'lazer') {
                            continue;
                        }
                        select.options.add(new Option(edge['number'] + edge['title'], edge['guid']));
                    }
                }
            },
            clear() {
                corners.setval('r_x', '');
                corners.setval('r_y', '');
                corners.setval('offset', '');
                //не сбрасываем x, y и кромку при смене угла в редактировании
                if (!corners.cache.x_y) {
                    corners.setval('r', '');
                    corners.setval('x', '');
                    corners.setval('y', '');
                    corners.setval('edge', 0);
                    corners.setval('cornerSrez', '');
                }
                corners.cache.x_y = false;
                // -- cutout
                corners.setval('is_in_r', false);
                corners.setval('is_nostep', false);
                corners.setval('diagonalCut', false);
            },
            hideall() {
                corners.hideinput([
                    'offset_field',
                    'r_field',
                    'xy_field',// 'cornersCutout'
                    'ext_field',
                    'edge_field',
                    'edge_side_field',
                    'add_field',
                    'is_in_r_field',
                    'withoutStepField',
                    'diagonalCutGroup',
                    'cornerSrezGroup'
                ]);
            },
            calc(el) {
                var val = el.value;
                if (val !== '') {
                    if (isNaN(Number(val))) {
                        val = eval(val.replace(/,/g, '.')).toFixed(1);
                    } else {
                        val = parseFloat(val.replace(/,/g, '.')).toFixed(1);
                    }
                    el.value = val;
                }
                return val;
            },

            clear_grain(grain) {
                corners.setval("Z" + grain, 0);
                corners.setval("D" + grain, 45);
                corners.setval("W" + grain, 0);
            },
            disabledFields() {
                var grains = ["face", "rear"];
                grains.forEach(function (grain, i, grains) {
                    if (corners.getval('edgeCutting') == 'srez') {
                        corners.disabled('Dface', false);
                        corners.setval('Dface', corners.getval('Dface'));
                    } else {
                        corners.disabled('D' + grain, true);
                        corners.setval('D' + grain, 45);
                    }
                    corners.disabled('W' + grain, true);
                });
            },
            rectInterFace(grain) {
                var value = (grain == 'face') ? corners.getval('edgeCutting') : corners.getval('edgeCuttingRear');
                if (value == 'rect' || value == 'arc') {
                    if (value == 'rect') {
                        corners.setval('edgeCuttingRear', 'rect');
                        corners.setval('edgeCutting', 'rect');
                    }
                    if (value == 'arc') {
                        corners.setval('edgeCutting', 'arc');
                    }
                    corners.hideinput('grain_copy');
                    corners.hideinput('edgeCuttingRear');
                    corners.getinput('edgeCutting').style['width'] = '90%';
                    corners.hideinput('faceSection');
                    corners.hideinput('rearSection');

                } else {
                    corners.showinput('grain_copy');
                    corners.showinput('edgeCuttingRear');
                    corners.showinput('edgeCutting');
                    corners.getinput('edgeCutting').style['width'] = '45%';
                    corners.getinput('edgeCuttingRear').style['width'] = '45%';
                    if (corners.getval('edgeCuttingRear') == 'rect' || corners.getval('edgeCuttingRear') == 'arc') {
                        if (corners.getval('edgeCuttingRear')) {
                            corners.setval('edgeCuttingRear', '0');
                        }
                    }
                    corners.use['edgeCutting'];
                    corners.use['edgeCuttingRear'];
                }

            },
            calc_wood(value, grain) {
                var side = '';
                if (value == "Z") {
                    if (corners.getval(side + "Z" + grain) != '' && corners.getval(side + "D" + grain) != '') {
                        var d = corners.functions.degreesToRadians(parseFloat(corners.getval(side + "D" + grain)));
                        corners.setval(side + "W" + grain, Math.round(parseFloat(corners.getval(side + "Z" + grain)) * Math.tan((d))));
                        return;
                    }

                    if (corners.getval(side + "Z" + grain) != '' && corners.getval(side + "W" + grain) != '') {
                        var tanD = Math.atan(parseFloat(corners.getval(side + "Z" + grain) / parseFloat(corners.getval(side + "W" + grain))));
                        corners.setval(side + "D" + grain, (90 - Math.round(corners.functions.radiansToDegrees(tanD))));
                        return;
                    }
                }

                if (value == "D") {
                    if (corners.getval(side + "D" + grain) != '' && corners.getval(side + "W" + grain) != '') {
                        var d = corners.functions.degreesToRadians(parseFloat(corners.getval(side + "D" + grain)));
                        corners.setval(side + "Z" + grain, Math.round(parseFloat(corners.getval(side + "W" + grain)) * Math.tan((d))));
                        return;
                    }

                    if (corners.getval(side + "D" + grain) != '' && corners.getval(side + "Z" + grain) != '') {
                        var d = corners.functions.degreesToRadians(parseFloat(corners.getval(side + "D" + grain)));
                        corners.setval(side + "W" + grain, Math.round(parseFloat(corners.getval(side + "Z" + grain)) * Math.tan((d))));
                        return;
                    }
                }

                if (value == "W") {
                    if (corners.getval(side + "W" + grain) != '' && corners.getval(side + "Z" + grain) != '') {
                        var tanD = Math.atan(parseFloat(corners.getval(side + "Z" + grain) / parseFloat(corners.getval(side + "W" + grain))));
                        corners.setval(side + "D" + grain, (90 - Math.round(corners.functions.radiansToDegrees(tanD))));
                        return;
                    }

                    if (corners.getval(side + "W" + grain) != '' && corners.getval(side + "D" + grain) != '') {
                        var d = corners.functions.degreesToRadians(parseFloat(corners.getval(side + "D" + grain)));
                        corners.setval(side + "Z" + grain, Math.round(parseFloat(corners.getval(side + "W" + grain)) * Math.tan((d))));
                        return;
                    }
                }


            },
            degreesToRadians(degrees) {
                return degrees * Math.PI / 180;
            },
            radiansToDegrees(radians) {
                return radians / (Math.PI / 180);
            },
            getMinR(edge) {
                if (detailThickness < 32) {
                    if (window.constructorID == 'stol') {
                        if (edge && edge[1] >= 1) {
                            min = 70;
                        } else {
                            min = 50;
                        }
                    } else {
                        if (edge && edge[1] >= 1) {
                            min = 70;
                        } else {
                            min = 10;
                        }
                    }
                } else {
                    if (window.constructorID == 'stol') {
                        if (edge && edge[1] >= 1) {
                            min = 80;
                        } else {
                            min = 50;
                        }
                    } else {
                        if (edge && edge[1] >= 1) {
                            min = 80;
                        } else {
                            min = 10;
                        }
                    }
                }
                return min;
            },
            getMinRZarez(edge) {
                var min = 10;
                if (detailThickness < 32) {
                    if (window.constructorID == 'stol') {
                        if (edge) {
                            if (edge[1] >= 1) {
                                min = 70;
                            } else {
                                //min = 50; для пластика 50
                                min = 10;
                            }
                        } else {
                            min = 10;
                        }
                    } else {
                        if (edge) {
                            if (edge[1] >= 1) {
                                min = 70;
                            } else {
                                min = 10;
                            }
                        } else {
                            if (detailThickness <= 19) {
                                min = 3;
                            } else if (19 < detailThickness && detailThickness <= 20) {
                                min = 4;
                            } else if (detailThickness > 20) {
                                min = 10;
                            }
                        }
                    }
                } else {
                    if (window.constructorID == 'stol') {
                        if (edge) {
                            if (edge[1] >= 1) {
                                min = 80;
                            } else {
                                //min = 50; для пластика 50
                                min = 10;
                            }
                        } else {
                            min = 10;
                        }
                    } else {
                        if (edge && edge[1] >= 1) {
                            min = 80;
                        } else {
                            min = 10;
                        }
                    }
                }
                return min;
            },
        },


        init(data, global_data) {
            if (g_detail.getModule('edging') === 0) {
                console.error('corner cant work without edging');
                // showWait();
                return;
            }
            // специальный параметр для события на выбор кромки
            corners.cache.setedge = false;

            // заполняем массив с углами
            corners.use('data', [data.cornerOperations]);
            // билдим таблицу углами
            corners.use('table');

            // заполняем все поля статичной инфой (в php бы вынести :с)
            // без использования реактивных фрэймворков, это как то бред...
            corners.use('init_joint');
            corners.use('init_sides');
            corners.use('init_types');
            corners.use('init_edges');
            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                corners.use('init_edgeCutting');
            }

            if (window.ro) {
                $("#corners").attr("disabled", true);
                return;
            }

            corners.method('side');

            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {

                corners.addInput('edgeCutting', function () {
                    return document.getElementById('edgeCutting');
                });

                corners.addInput('edgeCuttingRear', function () {
                    return document.getElementById('edgeCuttingRear');
                });

                corners.addInput('grain_copy', function () {
                    return document.getElementById('grain_copy');
                });

                corners.addInput('faceSection', function () {
                    return document.getElementById('face');
                });
                corners.addInput('rearSection', function () {
                    return document.getElementById('rear');
                });

                corners.addInput('Zface', function () {
                    return document.getElementById('Zface');
                });

                corners.addInput('Wface', function () {
                    return document.getElementById('Wface');
                });

                corners.addInput('Dface', function () {
                    return document.getElementById('Dface');
                });
                corners.addInput('Rface', function () {
                    return document.getElementById('Rface');
                });
                corners.addInput('Zrear', function () {
                    return document.getElementById('Zrear');
                });

                corners.addInput('Wrear', function () {
                    return document.getElementById('Wrear');
                });

                corners.addInput('Drear', function () {
                    return document.getElementById('Drear');
                });
                corners.addInput('Rrear', function () {
                    return document.getElementById('Rrear');
                });

                corners.addInput('faska_field_face', function () {
                    return document.getElementById('faska_field_face');
                });
                corners.addInput('radius_field_face', function () {
                    return document.getElementById('radius_field_face');
                });
                corners.addInput('faska_field_rear', function () {
                    return document.getElementById('faska_field_rear');
                });
                corners.addInput('radius_field_rear', function () {
                    return document.getElementById('radius_field_rear');
                });

                corners.addInput('edgeCuttingSection', function () {
                    return document.getElementById('edgeCuttingSection');
                });

                var edgeCutting = corners.getinput('edgeCutting');
                var edgeCuttingRear = corners.getinput('edgeCuttingRear');

                edgeCutting.options[0] = new Option('Нет', 0);
                edgeCuttingRear.options[0] = new Option('Нет', 0);

                edgeCutting.options[edgeCutting.options.length] = new Option('Фаска', 'faska');
                edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('Фаска', 'faska');

                edgeCutting.options[edgeCutting.options.length] = new Option('ДугаR13', 'arc');
                edgeCutting.options[edgeCutting.options.length - 1].setAttribute("r", "13");
                edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('ДугаR13', 'arc');
                edgeCuttingRear.options[edgeCuttingRear.options.length - 1].setAttribute("r", "13");

                if (!['compact'].includes(materialType)) {
                    edgeCutting.options[edgeCutting.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                    edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                } else {
                    edgeCutting.options[edgeCutting.options.length] = new Option(LANG['SREZ-45'], 'srez');
                    edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option(LANG['SREZ-45'], 'srez');

                    // edgeCutting.options[edgeCutting.options.length] = new Option('R2 + фаска 9х9мм', 'R2faska');
                    // edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('R2 + фаска 9х9мм', 'R2faska');
                }

                if (['compact'].includes(materialType)) {
                    corners.methods.grain_copy(true);
                }
            }
            corners.super();
        }
        ,
        reinit(data) {
            // reinit method, for default can use init
            corners.init(data);
        }
    };

    return corners;
});

