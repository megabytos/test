function editShapeByPattern(shapeKey) {
    var active_tab = sessionStorage.getItem('active-edit');
    var position2 = $('#'+ active_tab).position();
    if(active_tab == $('#modal11').attr('id')&& position2 != undefined&& $('#'+ active_tab).css("display")!="none"){
        sessionStorage.setItem("modal-left", position2.left);
        sessionStorage.setItem("modal-top", position2.top);
    }
    if(active_tab!=$('#modal11').attr('id')) {
        if(position2 != undefined &&$('#'+ active_tab).css("display")!="none") {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);
        }
        $('#' + active_tab).css("display","none");
        $('*[data-id="'+ active_tab + '"]').removeClass('active');
        sessionStorage.setItem('active-edit', $('#modal11').attr('id'));
    }
    if( $('.left-container-menu').hasClass('active')){
        $('.left-container-menu').removeClass('active');
        $('.modalwin').css("display","none");
    }
    if(sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null) {
        $('#modal11').css("display","block");
        $('#modal11').css("left","75px");
    }else{
        $('#modal11').css("display","block");
        $('#modal11').css("left",sessionStorage.getItem('modal-left')+"px");
        $('#modal11').css("top",sessionStorage.getItem('modal-top')+"px");
    }
    sessionStorage.setItem('active-edit',$('#modal11').attr('id'));
    $('#modal11').draggable({ containment: "html" });
    $('*[data-id="modal11"]').addClass('active');
    var shapesByPattern = g_detail.getModule('shapesByPattern');
    $('#formShape').empty();
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: ({
            controller: 'Additives',
            action: 'getDetailShapeByPattern',
            detail_key: detailKey,
            shape_key: shapeKey
        }),
        dataType: 'json',
        success: function (data) {
            for (key in data) {
                data[key] = (data[key] == "true") ? true : data[key];
                data[key] = (data[key] == "false") ? false : data[key];
            }
            $(shapesByPattern.getinput('add')).text('Сохранить');
            shape_by_pattern_key = shapeKey;
            switch (data.patternId) {
                case 'uShaped':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('edgeId', data.edgeId);
                    shapesByPattern.methods.edgeId();
                    shapesByPattern.setval('shiftX', data.shift);
                    shapesByPattern.setval('shiftY', data.shift);
                    shapesByPattern.setval('sizeH', data.sizeH);
                    shapesByPattern.setval('sizeV', data.sizeV);
                    shapesByPattern.setval('ext', Number(data.ext));
                    checkboxMaskUpdate('#shapePatternExt label');
                    shapesByPattern.setval('bandId', data.bandId);

                    if (data.radius != 0) {
                        shapesByPattern.setval('radius', data.radius);
                        shapesByPattern.methods.radius();
                    } else {
                        shapesByPattern.methods.ext();
                    }

                    shapesByPattern.disabled('center_x', false);
                    shapesByPattern.disabled('center_y', false);
                    if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                        shapesByPattern.functions.setEdgeCutting(data.edgeCuttingUShaped);
                    }
                    break;
                case 'rectangular':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('shiftX', data.shiftX);
                    shapesByPattern.setval('shiftY', data.shiftY);
                    shapesByPattern.setval('sizeH', data.sizeH);
                    shapesByPattern.setval('sizeV', data.sizeV);
                    shapesByPattern.setval('ext', Number(data.ext));
                    checkboxMaskUpdate('#shapePatternExt label');
                    shapesByPattern.setval('bandId', data.bandId);
                    shapesByPattern.setval('radius', data.radius);
                    if (shapesByPattern.getval('ext')) {
                        shapesByPattern.hideinput('shapePatternRadius');
                    }
                    shapesByPattern.disabled('center_x', false);
                    shapesByPattern.disabled('center_y', false);
                    if (materialType != 'compact') {
                        shapesByPattern.functions.checkActive();
                    }
                    shapesByPattern.methods.check_joint(data['joint']);
                    if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                        shapesByPattern.functions.setEdgeCutting(data.edgeCuttingRect);
                    }
                    shapesByPattern.setval('sp_fullZcb', Number(data.isFullZ));
                    if (data.isFullZ == 0){
                        shapesByPattern.setval('sp_edgeFullZ', data.edgeFullZ);
                    } else{
                        shapesByPattern.setval('sp_edgeFullZ', 1);
                    }
                    shapesByPattern.methods.shapePatternFullZcb();
                    break;
                case 'smile':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('edgeId', data.edgeId);
                    shapesByPattern.methods.edgeId();
                    shapesByPattern.setval('shiftX', data.shift);
                    shapesByPattern.setval('shiftY', data.shift);
                    shapesByPattern.setval('bandId', data.bandId);
                    shapesByPattern.setval('standartCheck', Number(data.standartCheck));
                    shapesByPattern.setval('autoCenter', Number(data.autoCenter));
                    shapesByPattern.setval('standartValue', Number(data.standartValue));
                    shapesByPattern.setval('center', Number(data.center));


                    if (shapesByPattern.getval('center')) {
                        shapesByPattern.hideinput('shapePatternShiftX');
                        shapesByPattern.hideinput('shapePatternShiftY');
                    } else{
                        if ([2, 4].indexOf(Number(data.edgeId)) !== -1){
                            shapesByPattern.hideinput('shapePatternShiftX');
                            shapesByPattern.showinput('shapePatternShiftY');
                        } else{
                            shapesByPattern.showinput('shapePatternShiftX');
                            shapesByPattern.hideinput('shapePatternShiftY');
                        }
                    }

                    if (shapesByPattern.getval('standartCheck')) {
                        shapesByPattern.hideinput('shapePatternStandart');
                    } else{
                        shapesByPattern.showinput('shapePatternStandart');
                    }
                    shapesByPattern.methods.autoCenter();

                    break;
                case 'wave':

                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('edgeId', data.edgeId);
                    shapesByPattern.methods.edgeId();
                    shapesByPattern.setval('shiftX', data.shiftX);
                    shapesByPattern.setval('shiftY', data.shiftY);
                    shapesByPattern.setval('r1Wave', data.shapePatternR1Wave);
                    shapesByPattern.setval('r2Wave', data.shapePatternR2Wave);
                    shapesByPattern.setval('bandId', data.bandId);
                    shapesByPattern.setval('shapePatternMirrorCheckH', Number(data.shapePatternMirrorCheckH));
                    shapesByPattern.setval('shapePatternMirrorCheckV', Number(data.shapePatternMirrorCheckV));

                    break;
                case 'handles':
                    shapesByPattern.hideinput(['shapePatternHandlesArticle', 'shapePatternShiftX', 'shapePatternShiftY',
                        'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD', 'shapePatternHandleR', 'shapePatternHandleN',
                        'shapePatternHandlesWay', 'edgesListForHandle', 'edgesListForHandleRabbet', 'sidesListForHandleRabbet',
                        'edgesListForHandleEdge', 'shapePatternDriling', 'shapePatternBindX', 'shapePatternBindY', 'edgesListForHandleBorder',
                        'edgesListForHandleBinding', 'bindsListForHandleEdge']);

                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.setval('handlesType', data.handleType);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('handleArt', data.handleArt);
                    shapesByPattern.setval('shapePatternDrilingCheck', data.isDriling);
                    shapesByPattern.methods.sp_edgeForHandleRabbet();

                    if (data.handleType == 'rabbets' || data.handleType == 'borderAndRabbets' || data.handleType == 'gola') {
                        shapesByPattern.methods.handleArt(null, data);
                    } else {
                        shapesByPattern.methods.handleArt();
                    }

                    if (data.handleType == 'grooves') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'shapePatternShiftX', 'shapePatternShiftY', 'shapePatternHandlesWay', 'shapePatternHandleL', 'shapePatternHandleZ',
                            'shapePatternHandleD', 'shapePatternHandleR', 'edgesListForHandle', 'shapePatternBindX', 'shapePatternBindY', 'add']);

                        shapesByPattern.setval('shiftX', data.shiftX);
                        shapesByPattern.setval('shiftY', data.shiftY);
                        shapesByPattern.setval('handleD', data.handleD);
                        shapesByPattern.setval('handleL', data.handleL);
                        shapesByPattern.setval('handleZ', data.handleZ);
                        shapesByPattern.setval('handleR', data.handleR);
                        shapesByPattern.setval('handleWay', data.handleWay);
                        shapesByPattern.setval('sp_edgeForHandle', data.edgeForHandle);
                    }

                    if (data.handleType == 'rabbets') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD', 'shapePatternHandleN', 'shapePatternHandleR',
                            'edgesListForHandleRabbet', 'sidesListForHandleRabbet']);

                        shapesByPattern.setval('handleD', data.handleD);
                        shapesByPattern.setval('handleL', data.handleL);
                        shapesByPattern.setval('handleZ', data.handleZ);
                        shapesByPattern.setval('handleR', data.handleR);
                        shapesByPattern.setval('handleN', data.handleN);
                        shapesByPattern.setval('sp_edgeForHandleRabbet', data.edgeForHandleRabbet);
                        shapesByPattern.showinput('add');
                        return;
                    }

                    if (data.handleType == 'edges') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'edgesListForHandleEdge', 'handlesExtForm']);

                        shapesByPattern.setval('sp_edgeForHandleEdge', data.edgeForHandleEdge);
                        shapesByPattern.setval('handlesExt', data.handlesExt);
                        var bindsForHandleEdge = (data.rearBase) ? 6 : 1;
                        shapesByPattern.setval('sp_bindsForHandleEdge', bindsForHandleEdge);
                    }

                    if (data.handleType == 'borderAndRabbets') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'edgesListForHandleBorder', 'edgesListForHandleBinding', 'edgesListForHandle', 'shapePatternHandleN', 'shapePatternHandleL']);;

                        shapesByPattern.setval('sp_edgeForHandle', data.edgeForHandle);
                        shapesByPattern.setval('edgeForHandleBorder', data.edgeForHandleBorder);
                        shapesByPattern.setval('edgeForHandleBinding', data.edgeForHandleBinding);
                        shapesByPattern.setval('handleL', data.handleL);
                        shapesByPattern.setval('handleN', data.handleN);
                    }
                    if (data.handleType == 'gola') {
                        shapesByPattern.methods.handleArt();
                        shapesByPattern.setval('sp_edgeForHandleGola', data.edgeForHandleGola);
                        shapesByPattern.setval('sp_cornerForHandleGola', data.sp_cornerForHandleGola);
                        shapesByPattern.setval('sp_shapePatternGolaL', data.handleL);
                        shapesByPattern.setval('sp_shapePatternGolaD', data.handleD);
                        shapesByPattern.setval('sp_shapePatternGolaZ', data.handleZ);
                        shapesByPattern.setval('sp_shapePatternGolaR', data.handleR);
                        shapesByPattern.setval('shiftX', data.shiftX);
                        shapesByPattern.setval('shiftY', data.shiftY);
                        shapesByPattern.setval('sp_edgeForHandle', data.edgeForHandle);
                        shapesByPattern.methods.sp_edgeForHandleGola();
                        shapesByPattern.setval('handleWay', data.handleWay);
                    }

                    shapesByPattern.showinput('add');

                    break;
                case 'circle':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('shiftX', data.shiftX);
                    shapesByPattern.setval('shiftY', data.shiftY);
                    shapesByPattern.setval('radius', data.radius);
                    shapesByPattern.setval('bandId', data.bandId);
                    shapesByPattern.methods.check_jointCircle(data['jointCircle']);
                    if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                        shapesByPattern.functions.setEdgeCutting(data.edgeCuttingCircle);
                    }
                    shapesByPattern.setval('sp_fullZcb', Number(data.isFullZ));
                    if (data.isFullZ == 0){
                        shapesByPattern.setval('sp_edgeFullZ', data.edgeFullZ);
                    } else{
                        shapesByPattern.setval('sp_edgeFullZ', 1);
                    }
                    shapesByPattern.methods.shapePatternFullZcb();
                    break;
                case 'lock':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('lock_type', data.type);
                    shapesByPattern.setval('lock_pos', data.position);
                    shapesByPattern.setval('fixture_type', data.fixture_type);
                    shapesByPattern.setval('fixture_count', data.fixture_count);
                    shapesByPattern.setval('binding', data.binding);
                    if (data.type == 'out'){
                        shapesByPattern.hideinput('lock_length');
                        shapesByPattern.hideinput('lock_length_label');
                    }else{
                        shapesByPattern.showinput('lock_length');
                        shapesByPattern.showinput('lock_length_label');

                        shapesByPattern.setval('lock_length', data.length);
                    }

                    break;
                case 'arc':
                    shapesByPattern.setval('pattern', data.patternId);
                    shapesByPattern.methods.pattern();
                    shapesByPattern.setval('edgeId', data.edgeId);
                    shapesByPattern.methods.edgeId();
                    shapesByPattern.setval('shiftX', data.shift);
                    shapesByPattern.setval('shiftY', data.shift);
                    shapesByPattern.setval('bandId', data.bandId);
                    shapesByPattern.setval('inner', Number(data.inner));
                    if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                        shapesByPattern.functions.setEdgeCutting(data.edgeCuttingArc);
                    }
                    break;
            }

            $('#shapesByPatternForm').on('focus', function () {
                markShapeByPattern(shapeKey);
            });
            $('#collapseShapeByPattern').collapse("show");
            // window.frames[0]
            //     ? window.frames[0].document.getElementById('panel-shapes-by-pattern').scrollIntoView()
            //     : window.document.getElementById('panel-shapes-by-pattern').scrollIntoView();
            shapesByPattern.showinput('add');
        }
    });
}
function delShapeByPattern(key) {
    var shapesByPattern = g_detail.getModule('shapesByPattern');
    g_detail.rmOperation(
        'shapeByPattern',
        {
            detail_key: detailKey,
            shape_key: key
        },
        function (data) {
            var newData = data[0];
            var delData = data[1];
            shapesByPattern.use('data', newData);
            shapesByPattern.use('table');
            shapesByPattern.use('rmsvg', [key, [delData]]);
            var pattern = shapesByPattern.getval('pattern');
            if (pattern == 'rectangular') {
                var joint = shapesByPattern.getval('joint');
                shapesByPattern.methods.check_joint(joint);
            }
            if (pattern == 'circle') {
                var joint = shapesByPattern.getval('jointCircle');
                shapesByPattern.methods.check_jointCircle(joint);
            }
        }
    );
}
function showHelp(section) {
    var section = section || 'index';
    window.open('doc/?s=' + section);
}

function showCost() {
    ShowWait();
    $.post("?page=saveTo", {'action': 'recalc'},
        function (data) {
            // console.log(data == false);
            if (data == false) {
                showErrorMessage(LANG['NO-CONNECTION-SERVER-TRY-LATER']);
            }
            CloseWait();
            $('#cost').html(data);
        });
}
function showTopPanel(title, content, div_id, overlay, offset) {
    var div_id = div_id || "top-panel";
    var overlay = overlay || "top-panel-div";

//    $('#'+div_id).draggable();
    $('#' + div_id + ' .panel-title').text(title);
    switch (typeof content) {
        case 'object':
            $('#' + div_id + ' .panel-body').html('');
            $('#' + div_id + ' .panel-body').append(content);
            break;
        case 'string':
            $('#' + div_id + ' .panel-body').html(content);
            break;
    }
    $('#' + overlay).show();
    $(window).off('keydown');
//    var y = ($('#top-panel-div').height() - $('#'+div_id).height()) / 3;
//    var y = (parent.window.frames[0]? parent.window.frames[0].pageYOffset + parent.window.pageYOffset : window.pageYOffset) + 50;

    //var x = ($('#top-panel-div').width() - $('#'+div_id).width()) / 2;

    var top = offset - $('#' + div_id).height() / 1.5 - $(window).scrollTop();
    if (top < 10) top = 10;
    else if (top + $('#' + div_id).height() > $(window).height()) top = $(window).height() - $('#' + div_id).height() - 10;


    //$('#'+div_id).offset({ top: 0, left: 0});
    $(".closebutton").click(function () {
        hideTopPanel(overlay);
    });
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27) {
            $('button.btn-danger.closebutton').trigger('click');
            //console.log("eeeeeaaaaah---------------> im esacape!!!! `~~");
        }
    });
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 13) {
            $('#top-panel .confirmButton').trigger('click');
        }
    });
}
function hideTopPanel(overlay) {
    var overlay = overlay || "top-panel-div";
    $('#' + overlay).hide();
    $(window).off('keydown');
}
function showErrorMessage(message) {
    /*
     Замена традиционного Alert. для показа сообщений об ошибках
     */

    showTopPanel(LANG['ERROR'], message);
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27)
            $('button.btn-danger.closebutton').trigger('click');
    });
}
function showWarningMessage(message, reloadAfterWarningmessage) {
    /*
     Замена традиционного Alert. для показа сообщений об предупреждениях
     */
    window.reload = reloadAfterWarningmessage;
    showTopPanel(LANG['WARNING'], message);
    $(window).off('keydown');
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27) {
            $('button.btn-danger.closebutton').trigger('click');
            if (window.reload) {
                window.reload = false;
                location.reload();
            }
        }
    });
}

function showMessage(message, title) {
    /*
     Замена традиционного Alert. для показа информационных сообщений
     */
    var title = title || LANG['ALERT-VNIMANIE'];
    showTopPanel(title, message);
    showTopPanel(title, message);
    var bodyMsg = $('#top-panel .panel-body');
    $('*:focus').blur();
    bodyMsg.append('<div class="confirmCases"></div>');
    bodyMsg.find('.confirmCases').append('<div class="confirmButton btn-default Modalbtn" onclick="hideMessage()">Ок</div>');
    $('.confirmButton').on('click', function () {
        $('button.btn-danger.closebutton').trigger('click');
    });
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27 || eventObject.which == 13) {
            $('button.btn-danger.closebutton').trigger('click');
        }
    });
}

/**
 Замена традиционного Confirm.
 @param message - текстовка запроса,
 @param acceptCallback - функция, которая будет выполнена при подтверждении,
 @param acceptCallbackArgs - аргументы функции при подтверждении,
 @param rejectCallback - функция, которая будет выполнена при отказе,
 @param rejectCallbackArgs - аргументы функции при отказе,
 */
function showConfirmMessage(message, acceptCallback, acceptCallbackArgs, rejectCallback, rejectCallbackArgs) {
    if (acceptCallbackArgs != '0')
        acceptCallbackArgs = acceptCallbackArgs || '';
    if (typeof (acceptCallbackArgs) == 'function') {
        acceptCallbackArgs = acceptCallbackArgs();
    }
    rejectCallbackArgs = rejectCallbackArgs || '';
    if (typeof (rejectCallbackArgs) == 'function') {
        rejectCallbackArgs = rejectCallbackArgs();
    }
    showTopPanel(LANG['UTOCH'], message);
    var bodyMsg = $('#top-panel .panel-body');
    bodyMsg.append('<div class="confirmCases"></div>');
    $('*:focus').blur();

    bodyMsg.find('.confirmCases').append('<div class="btn-default confirmButton Modalbtn"><p>'+ LANG['YES'] +'</p></div>');
    function confirm() {
        $('span.selectable').text(0 + " деталей.");
        $('span.selectable').css("display", "none");
        acceptCallback(acceptCallbackArgs);
        hideMessage();
    }

    function reject() {
        if (rejectCallback) rejectCallback(rejectCallbackArgs);
        hideMessage();
    }

    $('.confirmButton').on('click', confirm);
    $(this).keydown(function (eventObject) {
        if (eventObject.keyCode == 27 && !($('div').is('#top-panel:hidden'))) {
            $(this).off();
            $('button.btn-danger.closebutton').trigger('click');
        }
        if (eventObject.keyCode == 13 && !($('div').is('#top-panel:hidden'))) {
            $(this).off();
            confirm();
        }
    });

    bodyMsg.find('.confirmCases').append('<div class="btn-default rejectButton Modalbtn" onclick="hideMessage();">'+ LANG['NO'] +'</div>');
    $('.rejectButton').on('click', function () {
        reject();
    });
}

define(function (require, exports, module) {
    var shapesByPattern = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        customValues: {
            grain_copy_active: false,
        },
        // перечисляем специфические свойства (переопределяем)
        inputs: {
            get pattern() {
                return document.getElementById('sp_pattern')
            },
            get bandId() {
                return document.getElementById('sp_band')
            },
            get edgeId() {
                return document.getElementById('sp_edge')
            },
            get ext() {
                return document.getElementById('sp_ext')
            },
            get shiftX() {
                return document.getElementById('sp_x0')
            },
            get shiftY() {
                return document.getElementById('sp_y0')
            },
            get sizeH() {
                return document.getElementById('sp_h')
            },
            get sizeV() {
                return document.getElementById('sp_v')
            },
            get radius() {
                return document.getElementById('sp_r')
            },
            get center() {
                return document.getElementById('shapePatternCenterCheck')
            },
            get lock_pos() {
                return document.getElementById('lock_pos')
            },
            get lock_pos_v() {
                return document.getElementById('lock_pos_v')
            },
            get lock_type() {
                return document.getElementById('lock_type')
            },
            get fixture_type() {
                return document.getElementById('fixture_type')
            },
            get fixture_count() {
                return document.getElementById('fixture_count')
            },
            get lock_length() {
                return document.getElementById('lock_length')
            },
            get lock_length_label(){
                return document.getElementById('lock_length_label')
            },
            get binding() {
                return document.getElementById('binding')
            },
            get binding_label(){
                return document.getElementById('binding_label')
            },
            get inner() {
                return document.getElementById('shapePatternInnerCheck')
            },
            get shapePatternInner() {
                return document.getElementById('shapePatternInner')
            },
            get standartCheck() {
                return document.getElementById('shapePatternStandartCheck')
            },
            get shapePatternMirrorCheckH() {
                return document.getElementById('shapePatternMirrorCheckH')
            },
            get shapePatternMirrorCheckV() {
                return document.getElementById('shapePatternMirrorCheckV')
            },
            get standartValue() {
                return document.getElementById('sp_standart')
            },
            get r1Wave() {
                return document.getElementById('sp_r1Wave')
            },
            get r2Wave() {
                return document.getElementById('sp_r2Wave')
            },
            get handleArt() {
                return document.getElementById('handlesArcticles')
            },
            get handleWay() {
                return document.getElementById('handleWay')
            },
            get handleL() {
                return document.getElementById('sp_HandleL')
            },
            get handleD() {
                return document.getElementById('sp_HandleD')
            },
            get handleZ() {
                return document.getElementById('sp_HandleZ')
            },
            get handleR() {
                return document.getElementById('sp_HandleR')
            },
            get handleN() {
                return document.getElementById('sp_HandleN')
            },
            get handlesType() {
                return document.getElementById('handlesTypes')
            },
            get sp_edgeForHandle() {
                return document.getElementById('sp_edgeForHandle')
            },
            get sp_edgeForHandleRabbet() {
                return document.getElementById('sp_edgeForHandleRabbet')
            },
            get sp_sidesForHandleRabbet() {
                return document.getElementById('sp_sidesForHandleRabbet')
            },
            get sp_edgeForHandleEdge() {
                return document.getElementById('sp_edgeForHandleEdge')
            },
            get kromkaLeft() {
                return document.getElementById('kromkaLeft')
            },
            get kromkaTop() {
                return document.getElementById('kromkaTop')
            },
            get kromkaBottom() {
                return document.getElementById('kromkaBottom')
            },
            get kromkaRight() {
                return document.getElementById('kromkaRight')
            },
            get add() {
                return document.getElementById('addShapeByPattern')
            },
            get closebutton() {
                return document.getElementById("closebutton");
            },
            get formShapeByPattern() {
                return document.getElementById("formShapeByPattern");
            },
            get standartChecker() {
                return document.getElementById("shapePatternStandartChecker");
            },
            get autoCenterBlock() {
                return document.getElementById("shapePatternAutoCenterBlock");
            },
            get autoCenter() {
                return document.getElementById("shapePatternAutoCenter");
            },
            get shapePatternBand() {
                return document.getElementById("shapePatternBand");
            },
            get shapePatternEdge() {
                return document.getElementById("shapePatternEdge");
            },
            get shapePatternExt() {
                return document.getElementById("shapePatternExt");
            },
            get shapePatternCenter() {
                return document.getElementById("shapePatternCenter");
            },
            get shapePatternShift() {
                return document.getElementById("shapePatternShift");
            },
            get shapePatternSize() {
                return document.getElementById("shapePatternSize");
            },
            get shapePatternRadius() {
                return document.getElementById("shapePatternRadius");
            },
            get shapePatternShiftX() {
                return document.getElementById("shapePatternShiftX");
            },
            get shapePatternShiftY() {
                return document.getElementById("shapePatternShiftY");
            },
            get easyLock() {
                return document.getElementById("easyLock");
            },
            get shapePatternMirrorH() {
                return document.getElementById("shapePatternMirrorH");
            },
            get shapePatternMirrorV() {
                return document.getElementById("shapePatternMirrorV");
            },
            get shapePatternR1ForWave() {
                return document.getElementById("shapePatternR1ForWave");
            },
            get shapePatternR2ForWave() {
                return document.getElementById("shapePatternR2ForWave");
            },
            get shapePatternHandlesTypes() {
                return document.getElementById("shapePatternHandlesTypes");
            },
            get shapePatternHandlesArticle() {
                return document.getElementById("shapePatternHandlesArticle");
            },
            get shapePatternHandlesWay() {
                return document.getElementById("shapePatternHandlesWay");
            },
            get shapePatternHandleL() {
                return document.getElementById("shapePatternHandleL");
            },
            get shapePatternHandleZ() {
                return document.getElementById("shapePatternHandleZ");
            },
            get shapePatternHandleD() {
                return document.getElementById("shapePatternHandleD");
            },
            get shapePatternHandleR() {
                return document.getElementById("shapePatternHandleR");
            },
            get shapePatternHandleN() {
                return document.getElementById("shapePatternHandleN");
            },
            get edgesListForHandle() {
                return document.getElementById("edgesListForHandle");
            },
            get edgesListForHandleRabbet() {
                return document.getElementById("edgesListForHandleRabbet");
            },
            get sidesListForHandleRabbet() {
                return document.getElementById("sidesListForHandleRabbet");
            },
            get edgesListForHandleEdge() {
                return document.getElementById("edgesListForHandleEdge");
            },
            get bindsListForHandleEdge() {
                return document.getElementById("bindsListForHandleEdge");
            },
            get addShapeByPatternCenter() {
                return document.getElementById("addShapeByPatternCenter");
            },
            get shapePatternSizeH() {
                return document.getElementById("shapePatternSizeH");
            },
            get shapePatternSizeV() {
                return document.getElementById("shapePatternSizeV");
            },
            get shapePatternStandart() {
                return document.getElementById("shapePatternStandart");
            },
            get table() {
                return document.getElementById('additives-tbl-container-shapes-by-pattern');
            },
            get tableForHandles() {
                return document.getElementById('additives-tbl-container-shapes-by-patternForHandles');
            },
            get center_x() {
                return document.getElementById('shapeByPatternCenterX');
            },
            get center_n() {
                return document.getElementById('shapeByPatternCenterN');
            },
            get center_y() {
                return document.getElementById('shapeByPatternCenterY');
            },

            get shapePatternDriling() {
                return document.getElementById('shapePatternDriling');
            },

            get shapePatternDrilingCheck() {
                return document.getElementById('shapePatternDrilingCheck');
            },

            get shapePatternBindX() {
                return document.getElementById('shapePatternBindX');
            },

            get shapePatternBindY() {
                return document.getElementById('shapePatternBindY');
            },

            get bindX() {
                return document.getElementById('bindX');
            },

            get bindY() {
                return document.getElementById('bindY');
            },

            get handlesExtForm() {
                return document.getElementById('handlesExtForm');
            },

            get handlesExt() {
                return document.getElementById('handlesExt');
            },

            get edgesListForHandleBorder() {
                return document.getElementById('edgesListForHandleBorder')
            },
            get edgeForHandleBorder() {
                return document.getElementById('edgeForHandleBorder')
            },
            get edgesListForHandleBinding() {
                return document.getElementById('edgesListForHandleBinding')
            },
            get edgeForHandleBinding() {
                return document.getElementById('edgeForHandleBinding')
            },
            get joint() {
                return document.getElementById('jointSelectForShapesByPattern');
            },
            get jointCircle() {
                return document.getElementById('jointSelectForCircle');
            },
            get joint_field() {
                return document.getElementById('setJointForShapesByPattern');
            },
            get joint_field_circle() {
                return document.getElementById('setJointForCircle');
            },
            //gola
            get sp_edgeForHandleGola() {
                return document.getElementById('sp_edgeForHandleGola')
            },
            get edgeForHandleGola() {
                return document.getElementById('edgeForHandleGola')
            },
            get cornerForHandleGola() {
                return document.getElementById('cornerForHandleGola')
            },
            get sp_cornerForHandleGola() {
                return document.getElementById('sp_cornerForHandleGola')
            },
            get shapePatternGolaL() {
                return document.getElementById('shapePatternGolaL')
            },
            get shapePatternGolaD() {
                return document.getElementById('shapePatternGolaD')
            },
            get shapePatternGolaZ() {
                return document.getElementById('shapePatternGolaZ')
            },
            get shapePatternGolaR() {
                return document.getElementById('shapePatternGolaR')
            },
            get sp_shapePatternGolaL() {
                return document.getElementById('sp_shapePatternGolaL')
            },
            get sp_shapePatternGolaD() {
                return document.getElementById('sp_shapePatternGolaD')
            },
            get sp_shapePatternGolaZ() {
                return document.getElementById('sp_shapePatternGolaZ')
            },
            get sp_shapePatternGolaR() {
                return document.getElementById('sp_shapePatternGolaR')
            },
            /***/
            get edgeCutting() {
                return document.getElementById('edgeCuttingShapes')
            },
            get edgeCuttingRear() {
                return document.getElementById('edgeCuttingRearShapes')
            },
            //fullZ
            get shapePatternFullZcb() {
                return document.getElementById('shapePatternFullZcb')
            },
            get shapePatternEdgeFullZ() {
                return document.getElementById('shapePatternEdgeFullZ')
            },
            get sp_fullZcb() {
                return document.getElementById('sp_fullZcb')
            },
            get sp_edgeFullZ() {
                return document.getElementById('sp_edgeFullZ')
            },
            /***/
            get sp_bindsForHandleEdge() {
                return document.getElementById('sp_bindsForHandleEdge')
            },
        },
        methods: {
            add(e) {
                if (shapesByPattern.getval('pattern') == 'lock' && !shapesByPattern.method('lock_length')) {
                    return false;
                }
                if (!$('#shapePatternFullZcb').is(":hidden") && shapesByPattern.getval('sp_fullZcb') == 0 && shapesByPattern.getval('radius') == 0){
                    showErrorMessage(LANG['WRONG-RADIUS-WITH-NOT-FULL-Z-SHAPE']);
                    return false;
                }
                if (shapesByPattern.getval('pattern') == 'handles') {
                    // Проверка на наличие ручек со срезом под углом на выбранной стороне.
                    var handlesType = shapesByPattern.getval('handlesType');
                    var art = shapesByPattern.getval('handleArt');
                    var handle = shapesByPattern.cache.params[handlesType]['arcticles'][art]['params'];

                    if (shapesByPattern.getval('handleArt') == 'arcticlesDefault00000'){
                        showErrorMessage(LANG['ARTICLE_IS_NOT_CORRECT']);
                        return false;
                    }
                    if (handlesType == 'edges' && handle['trimmed'] != undefined && Number(handle['trimmed']) != 0) {
                        var handleSide = Number(shapesByPattern.getval('sp_edgeForHandleEdge'));
                        switch (handleSide) {
                            case 2:
                                if (kromkaLeft != 0) {
                                    showErrorMessage(LANG['UST-LEFT-SIDE-RUCHK']);
                                    return false;
                                }
                                break;
                            case 3:
                                if (kromkaTop != 0) {
                                    showErrorMessage(LANG['UST-TOP-SIDE-RUCHK']);
                                    return false;
                                }
                                break;
                            case 4:
                                if (kromkaRight != 0) {
                                    showErrorMessage(LANG['UST-RIGHT-SIDE-RUCHK']);
                                    return false;
                                }
                                break;
                            case 5:
                                if (kromkaBottom != 0) {
                                    showErrorMessage(LANG['UST-BOTTOM-SIDE-RUCHK']);
                                    return false;
                                }
                                break;
                        }
                    }
                    if (art == 'Gola C'){
                        if (!shapesByPattern.functions.checkShift()){
                            return false;
                        }
                    }
                    var sides = getSides('shapeHandles');
                    if (sides[0] == sides[1]) {
                        showConfirmMessage(LANG['DECOR-SIDE-OBR-CONF'],
                            function () {
                                shapesByPattern.use('addShape');
                            });
                    } else {
                        shapesByPattern.use('addShape');
                    }
                } else {
                    shapesByPattern.use('addShape');
                }

                if(fromViyarEmail){
                    $('#' + sessionStorage.getItem('active-edit')).css("display","none");
                    $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
                }

                if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                    shapesByPattern.methods.edgeCutting();
                    shapesByPattern.methods.edgeCuttingRear();
                }
            },
            sp_edgeForHandle(){
                shapesByPattern.functions.changeSideHandle();
            },
            pattern(event, data){
                $('#shapePatternBand').removeClass('mg_31');
                shapesByPattern.hideinput(['shapePatternBand', 'shapePatternEdge', 'shapePatternExt', 'shapePatternCenter',
                    'shapePatternSizeH', 'shapePatternSizeV', 'shapePatternRadius', 'shapePatternShiftX', 'shapePatternShiftY',
                    'standartCheck', 'standartChecker', 'autoCenterBlock', 'shapePatternInner', 'easyLock', 'shapePatternMirrorH',
                    'shapePatternMirrorV', 'shapePatternR1ForWave', 'shapePatternR2ForWave', 'shapePatternHandlesTypes',
                    'shapePatternHandlesArticle', 'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD',
                    'shapePatternHandleR', 'shapePatternHandleN', 'edgesListForHandle', 'edgesListForHandleRabbet', 'sidesListForHandleRabbet',
                    'edgesListForHandleEdge', 'shapePatternHandlesWay', 'center_x', 'center_y', 'center_n', 'shapePatternDriling',
                    'shapePatternBindX', 'shapePatternBindY', 'handlesExtForm', 'edgesListForHandleBorder', 'edgesListForHandleBinding',
                    'edgeForHandleGola', 'cornerForHandleGola', 'shapePatternGolaL', 'shapePatternGolaD', 'shapePatternGolaZ',
                    'shapePatternGolaR', 'joint_field', 'joint_field_circle', 'edgeCuttingSection', 'shapePatternFullZcb',
                    'shapePatternEdgeFullZ', 'bindsListForHandleEdge']);
                
                shapesByPattern.disabled('handleL',true);
                shapesByPattern.disabled('handleD',true);
                shapesByPattern.disabled('handleZ',true);
                shapesByPattern.disabled('handleR',true);
                shapesByPattern.disabled('center_n', true);
                // var a = shapesByPattern.getinput('addShapeByPatternCenter');
                // $(shapesByPattern.getinput('addShapeByPatternCenter')).parent().addClass('hidden');

                shapesByPattern.use('setBandListForShapesByPattern', [data ? data.bandId : 0, shapesByPattern.getval('pattern')]);
                switch (shapesByPattern.getval('pattern')) {

                    case 'uShaped':
                        shapesByPattern.showinput('shapePatternEdge');
                        shapesByPattern.change('edgeId');
                        if (materialType == 'compact') {
                            shapesByPattern.setval('radius', 6);
                            shapesByPattern.methods.edgeId();
                        } else {
                            shapesByPattern.setval('radius', 10);
                        }
                        shapesByPattern.showinput('center_x');
                        shapesByPattern.showinput('center_y');
                        shapesByPattern.functions.clear();
                        shapesByPattern.setval('ext', 0);
                        break;
                    case 'rectangular':
                        if (Math.min(detailFullWidth, detailFullHeight) >= 240) {
                            shapesByPattern.showinput('shapePatternBand');
                            shapesByPattern.showinput('shapePatternExt');

                        }
                        shapesByPattern.showinput(['shapePatternRadius', 'shapePatternCenter', 'shapePatternShiftX', 'shapePatternShiftY', 'center', 'shapePatternSizeH', 'shapePatternSizeV',
                            'add', 'shapePatternEdgeFullZ']);
                        if (constructorID != 'stol'){
                            shapesByPattern.showinput(['shapePatternFullZcb']);
                        }
                        if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                            shapesByPattern.showinput('edgeCuttingSection');
                            shapesByPattern.setval('edgeCutting', 0);
                            shapesByPattern.methods.edgeCutting();
                        }
                        if (materialType == 'compact') {
                            shapesByPattern.setval('radius', 6);
                        } else {
                            shapesByPattern.setval('radius', 10);
                        }
                        shapesByPattern.setval('ext', 0);
                        shapesByPattern.setval('sp_fullZcb', 1);
                        shapesByPattern.methods.shapePatternFullZcb();
                        shapesByPattern.setval('sp_edgeFullZ', 1);
                        shapesByPattern.showinput('center_x');
                        shapesByPattern.showinput('center_y');
                        shapesByPattern.disabled('center_y', !shapesByPattern.getval('sizeV'));
                        shapesByPattern.disabled('center_x', !shapesByPattern.getval('sizeH'));
                        shapesByPattern.functions.clear();
                        shapesByPattern.hideinput('shapePatternStandart');
                        break;
                    case 'smile':
                        shapesByPattern.showinput('shapePatternEdge');
                        shapesByPattern.change('edgeId');
                        shapesByPattern.showinput('center_x');
                        shapesByPattern.showinput('center_y');
                        shapesByPattern.functions.clear();
                        break;
                    case 'wave':
                        shapesByPattern.showinput('shapePatternEdge');
                        shapesByPattern.change('edgeId');
                        shapesByPattern.functions.clear();
                        break;
                    case 'circle':
                        shapesByPattern.showinput(['shapePatternCenter', 'shapePatternShiftX', 'shapePatternShiftY', 'shapePatternRadius', 'shapePatternBand', 'add', 'center_x',
                            'center_y', 'shapePatternFullZcb']);

                        $('#shapePatternBand').addClass('mg_31');
                        shapesByPattern.setval('sp_fullZcb', 1);
                        shapesByPattern.methods.shapePatternFullZcb();
                        shapesByPattern.disabled('center_x', false);
                        shapesByPattern.disabled('center_y', false);
                        shapesByPattern.functions.clear();
                        shapesByPattern.hideinput('shapePatternStandart');
                        shapesByPattern.setval('radius', '');
                        if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                            shapesByPattern.showinput('edgeCuttingSection');
                            shapesByPattern.setval('edgeCutting', 0);
                            shapesByPattern.methods.edgeCutting();
                        }
                        break;
                    case 'lock':
                        shapesByPattern.showinput('easyLock');
                        shapesByPattern.showinput('add');
                        setDetailsBinding();
                        if (detailHeight >= detailWidth){
                            shapesByPattern.setval('lock_length', detailWidth);
                        } else if(detailWidth > detailHeight){
                            shapesByPattern.setval('lock_length', detailHeight);
                        }
                        shapesByPattern.hideinput('binding');
                        shapesByPattern.hideinput('binding_label');
                        break;
                    case 'arc':
                        shapesByPattern.showinput('shapePatternEdge');
                        shapesByPattern.change('edgeId');
                        shapesByPattern.functions.clear();
                        if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                            shapesByPattern.methods.edgeId();
                        }
                        break;
                    case 'handles':
                        shapesByPattern.showinput('shapePatternHandlesTypes');
                        shapesByPattern.showinput('center_x');
                        shapesByPattern.showinput('center_y');
                        shapesByPattern.showinput('center_n');
                        shapesByPattern.disabled('center_x', false);
                        shapesByPattern.disabled('center_y', false);
                        if(shapesByPattern.getval('handlesType') != ''){
                            shapesByPattern.methods.handlesType(null, false);
                        }
                        shapesByPattern.functions.clear();
                        shapesByPattern.hideinput('shapePatternStandart');
                        shapesByPattern.setval('handlesExt', 1);
                        if(shapesByPattern.getval('handlesType') == 'borderAndRabbets'){
                            shapesByPattern.disabled('sp_edgeForHandle', true);
                            shapesByPattern.disabled('handleL', false);
                            shapesByPattern.disabled('center_n', false);
                        } else {
                            shapesByPattern.disabled('sp_edgeForHandle', false);
                        }
                        //ограничение по толщине материала для ручек "на ребро"
                        if (thickness < 18) {
                            $('#handlesTypes option[value="rabbets"]').hide();
                        }
                        break;
                    default:
                        shapesByPattern.hideinput('add');
                        shapesByPattern.hideinput('joint_field');
                }

                if (shapesByPattern.getval('pattern')) {
                    if (!sessionStorage.getItem('showMessShapesByPattern') && materialType == 'compact') {
                        showWarningMessage(LANG['PLOSKAYA-OBRABOTKA-PO-UMOLCHANIYU']);
                        sessionStorage.setItem('showMessShapesByPattern', 1);
                    }
                }

            },
            joint(e) {
                var jointShapes = shapesByPattern.getval('joint');
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'setJointForShapesByPattern', detail_key: detailKey, jointShapes: jointShapes}),
                    dataType: 'json',
                    success: function () {
                        detailJointForShapes = jointShapes;
                        draw();
                    }
                });
            },
            init_joint() {
                var select = shapesByPattern.getinput('joint');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO'], '0');
                    select.options[1] = new Option(LANG['VERHAYA'], '3');
                    select.options[2] = new Option(LANG['LEVAYA'], '2');
                    select.options[3] = new Option(LANG['PRAVAYA'], '4');
                    select.options[4] = new Option(LANG['NIJNAYA'], '5');
                }
            },
            check_joint(joint) {
                var pattern = shapesByPattern.getval('pattern');
                var radius = shapesByPattern.getval('radius');
                var bandId = shapesByPattern.getval('bandId');
                var ext = shapesByPattern.getval('ext');

                if (pattern == 'rectangular' && radius > 0 && bandId != 0 && (ext != '1' || radius != 0)
                    && materialType != 'compact') {
                    shapesByPattern.showinput('joint_field');
                    shapesByPattern.setval('joint', joint);
                } else {
                    detailJointForShapes = '';
                    shapesByPattern.hideinput('joint_field');
                    shapesByPattern.setval('joint', 0);
                    shapesByPattern.method('joint');
                }
            },
            jointCircle(e) {
                var jointCircle = shapesByPattern.getval('jointCircle');
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({controller: 'Additives', action: 'setJointForCircle', detail_key: detailKey, jointCircle: jointCircle}),
                    dataType: 'json',
                    success: function () {
                        detailJointForCircle = jointCircle;
                        draw();
                    }
                });
            },
            init_jointCircle() {
                var select = shapesByPattern.getinput('jointCircle');
                if (select) {
                    select.options.length = 0;
                    select.options[0] = new Option(LANG['NO'], '0');
                    select.options[1] = new Option(LANG['VERHAYA'], '3');
                    select.options[2] = new Option(LANG['LEVAYA'], '2');
                    select.options[3] = new Option(LANG['PRAVAYA'], '4');
                    select.options[4] = new Option(LANG['NIJNAYA'], '5');
                }
            },
            check_jointCircle(jointCircle) {
                var pattern = shapesByPattern.getval('pattern');
                var radius = shapesByPattern.getval('radius');
                var bandId = shapesByPattern.getval('bandId');

                if (pattern == 'circle' && radius > 0 && bandId != 0 && radius != 0
                    && materialType != 'compact') {
                    shapesByPattern.showinput('joint_field_circle');
                    shapesByPattern.setval('jointCircle', jointCircle);
                } else {
                    detailJointForCircle = '';
                    shapesByPattern.hideinput('joint_field_circle');
                    shapesByPattern.setval('jointCircle', 0);
                    shapesByPattern.method('jointCircle');
                }
            },
            bandId(){
                var pattern = shapesByPattern.getval('pattern');
                if (pattern == 'rectangular') {
                    var joint = shapesByPattern.getval('joint');
                    shapesByPattern.methods.check_joint(joint);
                }
                if (pattern == 'circle') {
                    var joint = shapesByPattern.getval('jointCircle');
                    shapesByPattern.methods.check_jointCircle(joint);
                }
            },
            sp_sidesForHandleRabbet(e, edgeForHandleRabbet){
                var side = shapesByPattern.getval('sp_sidesForHandleRabbet');
                shapesByPattern.functions.checkSideHandle(side);
                if (edgeForHandleRabbet != undefined) {
                    shapesByPattern.setval('sp_edgeForHandleRabbet', edgeForHandleRabbet);
                }
            },
            handlesType(e, changePattern = true){
                if(changePattern) {
                    shapesByPattern.change('pattern');
                }
                var handlesType = shapesByPattern.getval('handlesType');
                if (handlesType != '') {
                    shapesByPattern.hideinput(['shapePatternHandlesArticle', 'shapePatternShiftX', 'shapePatternShiftY',
                        'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD', 'shapePatternHandleR', 'shapePatternHandleN',
                        'shapePatternHandlesWay', 'edgesListForHandle', 'edgesListForHandleRabbet', 'sidesListForHandleRabbet',
                        'shapePatternHandlesArticle', 'edgesListForHandleEdge', 'shapePatternBindX', 'shapePatternBindY',
                        'edgesListForHandleBorder', 'edgesListForHandleBinding', 'edgeForHandleGola', 'cornerForHandleGola',
                        'shapePatternGolaL', 'shapePatternGolaD', 'shapePatternGolaZ', 'shapePatternGolaR', 'bindsListForHandleEdge']);

                    shapesByPattern.showinput('add');
                    if (handlesType == 'grooves') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'shapePatternShiftX', 'shapePatternShiftY',
                            'shapePatternHandlesWay', 'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD',
                            'shapePatternHandleR', 'edgesListForHandle', 'shapePatternBindX', 'shapePatternBindY']);
                    }
                    if (handlesType == 'rabbets') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'shapePatternHandleL', 'shapePatternHandleZ',
                            'shapePatternHandleD', 'shapePatternHandleN', 'shapePatternHandleR', 'edgesListForHandleRabbet',
                            'sidesListForHandleRabbet']);
                    }
                    if (handlesType == 'edges') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'edgesListForHandleEdge', 'handlesExtForm']);
                    }
                    if (handlesType == 'borderAndRabbets') {
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'edgesListForHandleBorder', 'edgesListForHandleBinding',
                            'edgesListForHandle', 'shapePatternHandleN', 'shapePatternHandleL']);
                    }
                    if (handlesType == 'gola'){
                        shapesByPattern.showinput(['shapePatternHandlesArticle', 'shapePatternShiftY', 'shapePatternGolaL',
                            'shapePatternGolaD', 'shapePatternGolaR', 'edgesListForHandle', 'edgeForHandleGola', 'cornerForHandleGola',
                            'shapePatternHandlesWay']);
                    }
                } else {
                    shapesByPattern.hideinput(['shapePatternHandlesArticle', 'shapePatternShiftX', 'shapePatternShiftY',
                        'shapePatternHandleL', 'shapePatternHandleZ', 'shapePatternHandleD', 'shapePatternHandleR', 'shapePatternHandleN',
                        'shapePatternHandlesWay', 'edgesListForHandle', 'edgesListForHandleRabbet', 'sidesListForHandleRabbet',
                        'edgesListForHandleEdge', 'edgesListForHandleBorder', 'edgesListForHandleBinding', 'edgeForHandleGola',
                        'cornerForHandleGola', 'shapePatternGolaL', 'shapePatternGolaD', 'shapePatternGolaZ', 'shapePatternGolaR',
                        'bindsListForHandleEdge']);
                }
                if (handlesType == 'gola'){
                    $('#sp_edgeForHandle').addClass("mg16");
                } else{
                    $('#sp_edgeForHandle').removeClass("mg16");
                }
                var first = true;
                $("#handlesArcticles > option").each(function (i, elem) {
                    $(this).show();
                    var currentHandle = $(this).attr('type');
                    if (currentHandle != handlesType && currentHandle != '') {
                        $(this).hide();
                    } else {
                        if (first) {
                            $(this).show();

                            $("#handlesArcticles").val($(this).val());
                            first = false;
                        }
                    }
                });
                shapesByPattern.change('handleArt');
                shapesByPattern.methods.sp_edgeForHandleGola();
            },
            handleArt(e, data){
                var handlesType = shapesByPattern.getval('handlesType');
                var art = shapesByPattern.getval('handleArt');
                if (art != 'arcticlesDefault00000' &&  shapesByPattern.cache.params[handlesType]){
                var handle = shapesByPattern.cache.params[handlesType]['arcticles'][art]['params'];
                var holes = handle['holes'];

                if (art == 'Gola C'){
                    shapesByPattern.hideinput('cornerForHandleGola');
                    shapesByPattern.showinput('edgeForHandleGola');
                    shapesByPattern.methods.sp_edgeForHandleGola();
                } else if (art == 'Gola L'){
                    shapesByPattern.showinput('cornerForHandleGola');
                    shapesByPattern.hideinput('edgeForHandleGola');
                    shapesByPattern.methods.sp_edgeForHandleGola();
                }
                /** Если ручки типа Gola */
                if (art == 'Gola C' || art == 'Gola L'){
                    /** Если редактируем, то не заполняем (data == undefined) */
                    if (handle['l'] && data == undefined){
                        shapesByPattern.setOptions('sp_shapePatternGolaL', handle['l']);
                    }
                    if (handle['d'] && data == undefined){
                        shapesByPattern.setOptions('sp_shapePatternGolaD', handle['d']);
                    }
                    if (handle['z'] && data == undefined){
                        shapesByPattern.setOptions('sp_shapePatternGolaZ', handle['z']);
                    }
                    if (handle['r'] && data == undefined){
                        shapesByPattern.setOptions('sp_shapePatternGolaR', handle['r']);
                        $('#sp_shapePatternGolaR option[value="5"]').text('5 с заглушкой');
                        $('#sp_shapePatternGolaR option[value="10"]').text('10 без заглушки');
                    }
                }
                if (holes) {
                    shapesByPattern.showinput('shapePatternDriling');
                } else {
                    shapesByPattern.hideinput('shapePatternDriling');
                }
                if (handle['z']) {
                    shapesByPattern.setval('handleZ', handle['z']);
                    shapesByPattern.disabled('handleZ', true);
                } else {
                    shapesByPattern.setval('handleZ', thickness + 3);
                    shapesByPattern.disabled('handleZ', true);
                }
                shapesByPattern.setval('handleD', handle['d']);
                if (handlesType == 'borderAndRabbets') {
                    var edgeForHandleBinding = (data == undefined || data['edgeForHandleBinding'] == undefined) ?
                        undefined : data['edgeForHandleBinding'];
                    shapesByPattern.methods.edgeForHandleBorder(null, edgeForHandleBinding);
                } else {
                    shapesByPattern.setval('handleL', handle['l']);
                }
                shapesByPattern.setval('handleR', handle['r']);

                var needSetEdgeSide = false;
                if (handlesType == 'grooves' || handlesType == 'borderAndRabbets' || handlesType == 'gola') {
                    for (var sideOption = 1; sideOption <= 6; sideOption++) {
                        var sideOptionText = '' + sideOption;
                        var dom = $("#sp_edgeForHandle option[value=" + sideOptionText + "]");
                        if (!!dom[0] && dom[0].hasAttribute('value') && dom[0]['value'] == sideOptionText) {
                            if (handle['sides'].includes(sideOption)) {
                                dom.show();
                            } else {
                                dom.hide();
                            }
                        }
                    }

                    var edgeForHandle = +shapesByPattern.getval('sp_edgeForHandle');
                    needSetEdgeSide = !handle['sides'].includes(edgeForHandle);
                } else if (handlesType == 'rabbets') {
                    var edgeForHandleRabbet = (data == undefined || data['edgeForHandleRabbet'] == undefined) ?
                        undefined : data['edgeForHandleRabbet'];

                    for (var sideOption = 1; sideOption <= 6; sideOption++) {
                        var sideOptionText = '' + sideOption;
                        var dom = $("#sp_sidesForHandleRabbet option[value=" + sideOptionText + "]");
                        if (!!dom[0] && dom[0].hasAttribute('value') && dom[0]['value'] == sideOptionText) {
                            if (handle['sides'].includes(sideOption)) {
                                dom.show();
                            } else {
                                dom.hide();
                            }
                        }
                    }

                    var sidesForHandleRabbet = +shapesByPattern.getval('sp_sidesForHandleRabbet');
                    needSetEdgeSide = !handle['sides'].includes(sidesForHandleRabbet);
                } else if (handlesType == 'edges') {
                    var bindsForHandleEdge = (handle['rearBase']) ? 6 : 1;
                    shapesByPattern.setval('sp_bindsForHandleEdge', bindsForHandleEdge);
                    if ('changeSide' in handle && handle['changeSide']) {
                        shapesByPattern.showinput('bindsListForHandleEdge');
                    } else {
                        shapesByPattern.hideinput('bindsListForHandleEdge');
                    }
                }

                if (needSetEdgeSide) {
                    var plastDefoult = (handle['sides'].includes(1)) ? 1 : 6;
                    if (handlesType == 'grooves' || handlesType == 'borderAndRabbets' || handlesType == 'gola') {
                        shapesByPattern.setval('sp_edgeForHandle', plastDefoult);
                    }
                    if (handlesType == 'rabbets') {
                        shapesByPattern.setval('sp_sidesForHandleRabbet', plastDefoult);
                        shapesByPattern.methods.sp_sidesForHandleRabbet(null, edgeForHandleRabbet);
                        shapesByPattern.methods.sp_edgeForHandleRabbet();
                    }
                } else {
                    if (handlesType == 'rabbets') {
                        shapesByPattern.methods.sp_sidesForHandleRabbet();
                        shapesByPattern.methods.sp_edgeForHandleRabbet();
                    }
                }

                } else {
                    shapesByPattern.setval('handleL', 0);
                    shapesByPattern.setval('handleZ', 0);
                    shapesByPattern.setval('handleD', 0);
                    shapesByPattern.setval('handleR', 0);
                }
            },
            autoCenter(){
                autoCenter = shapesByPattern.getval('autoCenter');
                if(autoCenter){
                    shapesByPattern.disabled('shiftX', true);
                    shapesByPattern.disabled('shiftY', true);
                    var side = shapesByPattern.getval('edgeId');
                    if (shapesByPattern.getval('pattern') == 'uShaped' || shapesByPattern.getval('pattern') == 'smile') {
                        if (side == '2' || side == '4') {
                            shapesByPattern.methods.center_y();
                        } else if (side == '3' || side == '5') {
                            shapesByPattern.methods.center_x();
                        }
                    }
                }else{
                    shapesByPattern.disabled('shiftX', false);
                    shapesByPattern.disabled('shiftY', false);
                }
            },
            edgeId(e){
                shapesByPattern.hideinput(['shapePatternCenter', 'shapePatternShiftX', 'shapePatternShiftY', 'shapePatternSizeH', 'shapePatternSizeV', 'shapePatternRadius',
                    'shapePatternInner', 'shapePatternStandart', 'standartChecker', 'autoCenterBlock', 'shapePatternMirrorH', 'shapePatternMirrorV', 'shapePatternDriling', 'edgeCuttingSection']);

                if (shapesByPattern.getval('pattern') == 'arc') {
                    var edgeId = shapesByPattern.getval('edgeId');

                    if (edgeId) {
                        shapesByPattern.showinput('shapePatternBand');
                        if (edgeId == '2' || edgeId == '4') {
                            shapesByPattern.showinput('shapePatternShiftX');
                        } else {
                            shapesByPattern.showinput('shapePatternShiftY');
                        }
                        shapesByPattern.showinput('shapePatternInner');
                        shapesByPattern.showinput('add');
                    } else {
                        shapesByPattern.hideinput('shapePatternBand');
                        shapesByPattern.hideinput('shapePatternInner');
                        shapesByPattern.hideinput('add');
                    }

                    if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) && edgeId != "") {
                        shapesByPattern.showinput('edgeCuttingSection');
                        shapesByPattern.setval('edgeCutting', 0);
                        shapesByPattern.methods.edgeCutting();
                    }
                    return;
                }

                if (shapesByPattern.getval('pattern') == 'smile' && shapesByPattern.getval('edgeId') && shapesByPattern.getval('edgeId') != null) {
                    shapesByPattern.showinput('standartChecker');
                    if (!shapesByPattern.getval('standartCheck')) {
                        shapesByPattern.showinput('shapePatternStandart');
                    }
                    else {
                        shapesByPattern.hideinput('shapePatternStandart');
                    }
                    if (shapesByPattern.getval('pattern') == 'smile'){
                        shapesByPattern.showinput('autoCenterBlock');
                    }
                }

                switch (shapesByPattern.getval('edgeId')) {
                    case '2':
                    case '4':
//            if (Math.min(detailFullWidth, detailFullHeight) >= 240) {
                        shapesByPattern.showinput('shapePatternBand');
                        // shapesByPattern.showinput('shapePatternExt');
                        shapesByPattern.showinput('shapePatternCenter');
                        if (!shapesByPattern.getval('center')) {
                            shapesByPattern.showinput('shapePatternShiftY');
                        }
                        shapesByPattern.showinput('shapePatternSizeH');
                        shapesByPattern.showinput('shapePatternSizeV');
                        shapesByPattern.showinput('add');
                        break;
                    case '3':
                    case '5':
//            if (Math.min(detailFullWidth, detailFullHeight) >= 240) {
                        shapesByPattern.showinput('shapePatternBand');
                        // shapesByPattern.showinput('shapePatternExt');
//            }

                        shapesByPattern.showinput('shapePatternCenter');
                        if (!shapesByPattern.getval('center')) {
                            shapesByPattern.showinput('shapePatternShiftX');
                        }
                        shapesByPattern.showinput('shapePatternSizeH');
                        shapesByPattern.showinput('shapePatternSizeV');
                        shapesByPattern.showinput('add');
                        break;
                    default:

                        shapesByPattern.hideinput('shapePatternBand');
                        // shapesByPattern.hideinput('shapePatternExt');
                        shapesByPattern.hideinput('add');
                }
                if (shapesByPattern.getval('pattern') == 'smile') {
                    shapesByPattern.hideinput('shapePatternSizeH');
                    shapesByPattern.hideinput('shapePatternSizeV');
                }
                if (shapesByPattern.getval('edgeId') && shapesByPattern.getval('pattern') == 'uShaped') {
                    shapesByPattern.showinput('shapePatternExt');
                    shapesByPattern.showinput('shapePatternRadius');
                    shapesByPattern.showinput('shapePatternExt');
                }

                if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) && shapesByPattern.getval('pattern') == 'uShaped' && shapesByPattern.getval('edgeId') != "") {
                    shapesByPattern.showinput('edgeCuttingSection');
                    shapesByPattern.setval('edgeCutting', 0);
                    shapesByPattern.methods.edgeCutting();
                }

                if (shapesByPattern.getval('pattern') == 'wave' && shapesByPattern.getval('edgeId') != '' && shapesByPattern.getval('edgeId') != null) {
                    shapesByPattern.showinput(['shapePatternMirrorH', 'shapePatternMirrorV', 'shapePatternBand', 'shapePatternShiftY', 'shapePatternShiftX', 'shapePatternR1ForWave',
                        'shapePatternR2ForWave']);
                    shapesByPattern.hideinput(['shapePatternCenter', 'shapePatternSizeH', 'shapePatternSizeV', 'shapePatternRadius', 'shapePatternInner', 'shapePatternStandart',
                        'standartChecker', 'autoCenterBlock', 'shapePatternExt']);
                }

                shapesByPattern.functions.checkCentreActive()
            },
            center(e){
                if (shapesByPattern.getval('center') || shapesByPattern.getval('pattern') == '') {
                    shapesByPattern.hideinput('shapePatternShiftX');
                    shapesByPattern.hideinput('shapePatternShiftY');
                } else {
                    var side = shapesByPattern.getval('edgeId');
                    if (shapesByPattern.getval('pattern') == 'uShaped' || shapesByPattern.getval('pattern') == 'smile') {
                        if (side == '2' || side == '4') {
                            shapesByPattern.showinput('shapePatternShiftY');
                        } else if (side == '3' || side == '5') {
                            shapesByPattern.showinput('shapePatternShiftX');
                        }
                    } else {
                        shapesByPattern.showinput('shapePatternShiftX');
                        shapesByPattern.showinput('shapePatternShiftY');

                    }
                }
            },
            standartCheck(e){
                if (shapesByPattern.getval('standartCheck') || shapesByPattern.getval('pattern') == '') {
                    shapesByPattern.hideinput('shapePatternStandart');
                }
                else {
                    shapesByPattern.showinput('shapePatternStandart');
                }

                if (shapesByPattern.getval('pattern') == 'smile') {
                    var standartValue = shapesByPattern.getval('standartValue');
                    var standartCheck = shapesByPattern.getval('standartCheck');
                    if (!standartCheck && standartValue == '') {
                        shapesByPattern.functions.setXYAfterStandartCheck(true);
                        shapesByPattern.setval('shiftY', '');
                        shapesByPattern.setval('shiftX', '');
                    } else {
                        shapesByPattern.functions.setXYAfterStandartCheck(false);
                    }
                }
            },
            standartValue(e){
                if (shapesByPattern.getval('pattern') == 'smile') {
                    shapesByPattern.methods.standartCheck();
               }
            },
            radius(e){
                var patternId= shapesByPattern.getval('pattern');
                if (patternId == 'uShaped' || (patternId == 'rectangular')) {
                    if (!shapesByPattern.getval('center')) {
                        $('#').show();
                        shapesByPattern.showinput('shapePatternExt');
                    } else {
                        shapesByPattern.hideinput('shapePatternExt');
                    }
                    shapesByPattern.methods.shapePatternFullZcb();

                    var val = shapesByPattern.getval('radius');
                    if (materialType != 'compact') {
                        if (val == 0 && shapesByPattern.getval('sp_fullZcb')) {
                            shapesByPattern.setval('ext', true);
                            shapesByPattern.hideinput('shapePatternRadius');
                        } else {
                            shapesByPattern.setval('ext', false);
                            shapesByPattern.showinput('shapePatternRadius');
                        }
                    }
                }

                var sizeH = shapesByPattern.getval('sizeH');
                var sizeV = shapesByPattern.getval('sizeV');
                var r = shapesByPattern.getval('radius');
                var minR;
                if (materialType == 'compact') {
                    minR = 6;
                } else {
                    minR = 10;
                }
                if (materialType == 'stol') {
                    if ((patternId == 'rectangular' || patternId == 'uShaped') && (sizeH > 780 || sizeV > 780) && val < minR) {
                        shapesByPattern.setval('radius', minR);
                        shapesByPattern.setval('ext', false);
                        shapesByPattern.showinput('shapePatternRadius');
                    } else if (patternId == 'rectangular' && (sizeH < 780 || sizeV < 780) && val == 0 && shapesByPattern.functions.checkActive()) {
                        shapesByPattern.setval('radius', minR);
                        shapesByPattern.setval('ext', false);
                        shapesByPattern.showinput('shapePatternRadius');
                    }
                }

                var pattern = shapesByPattern.getval('pattern');
                if (pattern == 'rectangular') {
                    var joint = shapesByPattern.getval('joint');
                    shapesByPattern.methods.check_joint(joint);
                }
                if (pattern == 'circle') {
                    var joint = shapesByPattern.getval('jointCircle');
                    shapesByPattern.methods.check_jointCircle(joint);
                }
            },
            ext(e){
                if (shapesByPattern.getval('pattern') == 'uShaped' || shapesByPattern.getval('pattern') == 'rectangular') {
                    if (!shapesByPattern.getval('ext')) {
                        shapesByPattern.showinput('shapePatternRadius');
                        if (materialType == 'compact') {
                            shapesByPattern.setval('radius', 6);
                        } else {
                            shapesByPattern.setval('radius', 10);
                        }
                    } else {
                        shapesByPattern.hideinput('shapePatternRadius');
                        shapesByPattern.setval('radius', 0);
                    }
                }
                var joint = shapesByPattern.getval('joint');
                shapesByPattern.methods.check_joint(joint);

                if (shapesByPattern.getval('pattern') == 'rectangular'){
                    if (shapesByPattern.getval('ext')){
                        $('#shapePatternExt').removeClass('mg16');
                        $('#shapePatternFullZcb').addClass('mg16');
                    } else{
                        $('#shapePatternExt').addClass('mg16');
                        $('#shapePatternFullZcb').removeClass('mg16');
                    }

                }
            },
            shapePatternMirrorCheckH(e){
                if (shapesByPattern.getval('shapePatternMirrorCheckV')) {
                    shapesByPattern.setval('shapePatternMirrorCheckV', 0);
                }
            },
            shapePatternMirrorCheckV(e){
                if (shapesByPattern.getval('shapePatternMirrorCheckH')) {
                    shapesByPattern.setval('shapePatternMirrorCheckH', 0);
                }
            },
            center_x(e) {
                var pattern = shapesByPattern.getval('pattern');
                if (pattern === 'handles') {
                    var l = Number(shapesByPattern.getval('handleL'));
                    if (shapesByPattern.getval('handlesType') == 'gola'){
                        var d = Number(shapesByPattern.getval('sp_shapePatternGolaD'));
                    } else{
                        var d = Number(shapesByPattern.getval('handleD'));
                    }

                    var way = Number(shapesByPattern.getval('handleWay'));
                    if (way) {
                        shapesByPattern.setval('shiftX', (detailFullWidth - d) / 2);
                    } else {
                        shapesByPattern.setval('shiftX', (detailFullWidth - l) / 2);
                    }
                }
                if (pattern === 'uShaped' || pattern === 'rectangular') {
                    var l = shapesByPattern.getval('sizeH');
                    if (l > 0) {
                        shapesByPattern.setval('shiftX', (detailFullWidth - l) / 2);
                    }
                }
                if (pattern === 'circle') {
                    var l = shapesByPattern.getval('sizeH');
                    shapesByPattern.setval('shiftX', (detailFullWidth - l) / 2);
                }
                if (pattern === 'smile') {
                    var shift = detailFullWidth / 2 - 110;
                    var standartValue = shapesByPattern.getval('standartValue');
                    var standartCheck = shapesByPattern.getval('standartCheck');
                    if (!standartCheck && standartValue > 0) {
                        shapesByPattern.setval('shiftX', (shift - standartValue/2).toFixed(1));
                    } else {
                        shapesByPattern.setval('shiftX', (shift).toFixed(1));
                    }
                }
                shapesByPattern.functions.checkActive();
            },
            center_y(e) {
                var pattern = shapesByPattern.getval('pattern');
                if (pattern === 'handles') {
                    if (shapesByPattern.getval('handlesType') == 'gola'){
                        var d = Number(shapesByPattern.getval('sp_shapePatternGolaD'));
                    } else{
                        var d = Number(shapesByPattern.getval('handleD'));
                    }
                    var l = Number(shapesByPattern.getval('handleL'));
                    var way = Number(shapesByPattern.getval('handleWay'));
                    if (way) {
                        shapesByPattern.setval('shiftY', (detailFullHeight - l) / 2);
                    } else {
                        shapesByPattern.setval('shiftY', (detailFullHeight - d) / 2);
                    }
                }
                if (pattern === 'uShaped' || pattern === 'rectangular') {
                    var d = shapesByPattern.getval('sizeV');
                    if (d > 0) {
                        shapesByPattern.setval('shiftY', (detailFullHeight - d) / 2);
                    }
                }
                if (pattern === 'circle') {
                    var d = shapesByPattern.getval('sizeV');
                    shapesByPattern.setval('shiftY', (detailFullHeight - d) / 2);
                }
                if (pattern === 'smile') {
                    var shift = detailFullHeight / 2 - 110;
                    var standartValue = shapesByPattern.getval('standartValue');
                    var standartCheck = shapesByPattern.getval('standartCheck');
                    if (!standartCheck && standartValue > 0) {
                        shapesByPattern.setval('shiftY', (shift - standartValue/2).toFixed(1));
                    } else {
                        shapesByPattern.setval('shiftY', (shift).toFixed(1));
                    }
                }
                shapesByPattern.functions.checkActive();
            },
            center_n(e) {
                var pattern = shapesByPattern.getval('pattern');
                var type = shapesByPattern.getval('handlesType');
                if (pattern === 'handles' && type == 'rabbets') {
                    var l = Number(shapesByPattern.getval('handleL'));
                    var edge =  shapesByPattern.getval('sp_edgeForHandleRabbet');
                    switch (Number(edge)){
                        case 13:
                        case 15:
                        case 63:
                        case 65:
                            shapesByPattern.setval('handleN',((detailFullWidth - l)/2));
                            break;
                        case 12:
                        case 14:
                        case 62:
                        case 64:
                            shapesByPattern.setval('handleN',((detailFullHeight - l)/2));
                            break;
                    }
                }
            },
            sizeV() {
                shapesByPattern.functions.checkCentreActive();
                shapesByPattern.functions.checkActive();

            },
            sizeH() {
                shapesByPattern.functions.checkCentreActive();
                shapesByPattern.functions.checkActive();

            },
            shiftX() {
                shapesByPattern.functions.checkActive();
                shapesByPattern.functions.checkShift();
            },
            shiftY() {
                shapesByPattern.functions.checkActive();
                shapesByPattern.functions.checkShift();
            },
            sp_edgeForHandleRabbet(e){
                var val = shapesByPattern.getval('sp_edgeForHandleRabbet');
                if(val){
                    shapesByPattern.disabled('center_n', false);
                    var val_h = [13, 15, 63, 65];
                    var val_v = [12, 14, 62, 64];
                    var direction = '';
                    $("#shapeByPatternCenterN span").remove();
                    val_h.forEach(function(element) {
                        if (element == val){
                            direction = 'horizontal';
                            return;
                        }
                    });
                    if (direction == ''){
                        val_v.forEach(function(element) {
                            if (element == val){
                                direction = 'vertical';
                                return;
                            }
                        });
                    }
                    $("#shapeByPatternCenterN").append('<span class="glyphicon glyphicon-resize-'+direction+'"></span>');
                } else{
                    shapesByPattern.disabled('center_n', true);
                }
            },
            lock_type(){
                var val = shapesByPattern.getval('lock_type');
                if(val == 'out'){
                    shapesByPattern.hideinput('lock_length');
                    shapesByPattern.hideinput('lock_length_label');
                }else{
                    shapesByPattern.showinput('lock_length');
                    shapesByPattern.showinput('lock_length_label');
                }
            },
            lock_length(){
                var l = shapesByPattern.getval('lock_length');
                var min = 150;
                var max = 1200;
                if(l < min || l > max){
                    showErrorMessage(
                        LANG['BAD-VALUE-DLINA-ZAMKA-MUST']+` ${min}мм до ${max}мм.`
                    );
                    return false;
                }
                return true;
            },
            edgeForHandleBorder(e, edgeForHandleBinding) {
                var handleEdge = Number(shapesByPattern.getval('edgeForHandleBorder'));
                if ([2,4].indexOf(handleEdge) != -1) {
                    var arrBindings = [2,4];
                } else {
                    var arrBindings = [3,5];
                }
                $("#edgeForHandleBinding > option").each(function (i, elem) {
                    $(this).show();
                    var currentElem = Number($(this).attr('value'));
                    if (arrBindings.indexOf(currentElem) != -1 && currentElem != '') {
                        $(this).hide();
                    } else {
                        if (currentElem == 2 || currentElem == 5) {
                            $(this).show();
                            if (edgeForHandleBinding == undefined) {
                                $("#edgeForHandleBinding").val($(this).val());
                            }
                        }
                    }
                });
            },
            sp_edgeForHandleGola(e){
                var side = shapesByPattern.getval('sp_edgeForHandleGola');
                /** Скрываем одно из направлений при смене стороны в Gola C */
                if(shapesByPattern.getval('handlesType') == 'gola'){
                    if (shapesByPattern.getval('handleArt') == 'Gola C'){
                        if (side == 2 || side == 4){
                            shapesByPattern.setval('shiftX', 0);
                            shapesByPattern.hideinput('shapePatternShiftX');
                            shapesByPattern.showinput('shapePatternShiftY');
                        } else if(side == 3 || side == 5){
                            shapesByPattern.setval('shiftY', 0);
                            shapesByPattern.hideinput('shapePatternShiftY');
                            shapesByPattern.showinput('shapePatternShiftX');
                        }
                        if (side == 2 || side == 4){
                            $("#handleWay option[value=0]").hide();
                            $("#handleWay option[value=1]").show();
                            $("#handleWay").val(1);
                        } else if(side == 3 || side == 5){
                            $("#handleWay option[value=1]").hide();
                            $("#handleWay option[value=0]").show();
                            $("#handleWay").val(0);
                        }
                    } else if(shapesByPattern.getval('handleArt') == 'Gola L'){
                        shapesByPattern.hideinput('shapePatternShiftX');
                        shapesByPattern.hideinput('shapePatternShiftY');

                        $("#handleWay option[value=0]").show();
                        $("#handleWay option[value=1]").show();
                        $("#handleWay").val(0);
                    }
                }
            },
            grain_copy() {
                if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                    if (materialType == 'compact') {
                        shapesByPattern.disabled('grain_copy', true);
                        shapesByPattern.disabled('edgeCuttingRear', true);
                        $(shapesByPattern.getinput('grain_copy')).css("background-color", "green");
                    }
                    if ((materialType == 'compact' && ((shapesByPattern.getval('edgeCutting') != 'rabbet' && shapesByPattern.getval('edgeCutting') != '0') ||
                            (shapesByPattern.getval('edgeCutting') == '0' && shapesByPattern.getval('edgeCuttingRear') != 'rabbet'))) ||
                        ((materialType == 'wood' || (['fanera'].includes(materialType) && isMillAdditives)) &&
                            (shapesByPattern.getval('edgeCutting') == 'arc' || shapesByPattern.getval('edgeCutting') == 'rect'))) {
                        shapesByPattern.setval('edgeCuttingRear', shapesByPattern.getval('edgeCutting'));
                    }

                    if (shapesByPattern.getval('edgeCutting') == "faska") {
                        let Zface = shapesByPattern.getval('Zface');
                        let Zrear = shapesByPattern.getval('Zrear');
                        let Dface = shapesByPattern.getval('Dface');

                        shapesByPattern.setval('Zrear', Zface);
                        shapesByPattern.setval('Wface', Zface);
                        shapesByPattern.setval('Wrear', Zrear);
                        shapesByPattern.setval('Drear', Dface);

                        if (Zface == 0.5) {
                            $('#shapeZrear option[value="2"]').hide();
                            if (Zrear == 8) {
                                shapesByPattern.setval('Zrear', 8);
                                shapesByPattern.setval('Wrear', Zrear);
                            }
                            if (Zrear == 0.5) {
                                shapesByPattern.setval('Zrear', 0.5);
                                shapesByPattern.setval('Wrear', Zrear);
                            }
                        } else {
                            $('#shapeZrear option[value="2"]').show();
                        }

                        if (Zface == 2) {
                            shapesByPattern.setval('Zrear', Zrear);
                            $('#shapeZrear option[value="0.5"]').hide();
                        } else {
                            $('#shapeZrear option[value="0.5"]').show();
                        }

                        if (Zface == 8) {
                            shapesByPattern.setval('Zrear', Zrear);
                            $('#shapeZrear option[value="8"]').hide();
                        } else {
                            $('#shapeZrear option[value="8"]').show();
                        }

                        $(shapesByPattern.getinput('Dface')).css('cursor', 'not-allowed');
                        shapesByPattern.disabled('Dface', true);
                        shapesByPattern.methods.Zface();
                        shapesByPattern.methods.Zrear();
                    }

                    if ((shapesByPattern.getval('edgeCutting') == 'rabbet' || shapesByPattern.getval('edgeCuttingRear') == 'rabbet' ||
                            shapesByPattern.getval('edgeCuttingRear') == '0') && shapesByPattern.getval('pattern') != 'arc') {
                        shapesByPattern.disabled('grain_copy', true);
                        shapesByPattern.disabled('edgeCuttingRear', false);
                        $(shapesByPattern.getinput('grain_copy')).css("background-color", "transparent");
                        $('#edgeCuttingRearShapes option[value=\'arc\']').hide();
                        $('#edgeCuttingRearShapes option[value=\'rect\']').hide();
                    }

                    if (shapesByPattern.getval('edgeCutting') == 'rabbet') {
                        shapesByPattern.setval('edgeCuttingRear', '0');
                    }

                    shapesByPattern.methods.edgeCuttingRear();
                }
            },
            Zface(e) {
                $(shapesByPattern.getinput('Zface')).change(function () {
                    let Zface = shapesByPattern.getval('Zface');
                    let Zrear = shapesByPattern.getval('Zrear');

                    shapesByPattern.setval('Zrear', Zface);
                    shapesByPattern.setval('Wface', Zface);
                    shapesByPattern.setval('Wrear', Zface);

                    if (Zface == '0.5') {
                        $('#shapeZrear option[value="2"]').hide();
                    } else {
                        $('#shapeZrear option[value="2"]').show();
                    }

                    if (Zface == '2') {
                        $('#shapeZrear option[value="0.5"]').hide();
                    } else {
                        $('#shapeZrear option[value="0.5"]').show();
                    }

                    if (Zface == '8') {
                        $('#shapeZrear option[value="8"]').hide();
                        shapesByPattern.setval('Zrear', 0.5);
                        shapesByPattern.setval('Wrear', 0.5);
                    } else {
                        $('#shapeZrear option[value="8"]').show();
                    }

                });
            },
            Zrear(e) {
                $(shapesByPattern.getinput('Zrear')).change( function () {
                    let Zrear = shapesByPattern.getval('Zrear');
                    shapesByPattern.setval('Wrear', Zrear);
                });
            },
            edgeCutting(e) {
                let type_milling = shapesByPattern.getval('edgeCutting');

                if (+type_milling == 0) {
                    shapesByPattern.hideinput('faceSection');
                    $('#edgeCuttingRearShapes option[value=\'faska\']').hide();
                } else {
                    shapesByPattern.showinput('faceSection');
                    if (materialType == 'compact' && type_milling != 'rect' && shapesByPattern.getval('radius') < 6) {
                        shapesByPattern.setval('radius', 6);
                    }
                }

                if (type_milling == 'faska') {
                    shapesByPattern.showinput('faska_field_face');
                    if (materialType == 'wood' || (['fanera'].includes(materialType) && isMillAdditives)) {
                        $('#edgeCuttingRearShapes option[value=\'faska\']').show();
                        $('#edgeCuttingRearShapes option[value=\'radius\']').show();
                    }
                } else {
                    shapesByPattern.hideinput('faska_field_face');
                }

                if (type_milling == 'radius') {
                    shapesByPattern.showinput('radius_field_face');
                    if (materialType == 'wood' || (['fanera'].includes(materialType) && isMillAdditives)) {
                        $('#edgeCuttingRearShapes option[value=\'faska\']').show();
                        $('#edgeCuttingRearShapes option[value=\'radius\']').show();
                    }
                } else {
                    shapesByPattern.hideinput('radius_field_face');
                }

                if (type_milling == 'rabbet') {
                    shapesByPattern.showinput('rabbet_field_face');
                    if (materialType == 'compact') {
                        $('#edgeCuttingRearShapes option[value=\'faska\']').hide();
                        $('#edgeCuttingRearShapes option[value=\'radius\']').hide();
                    }
                } else {
                    shapesByPattern.hideinput('rabbet_field_face');
                }

                if (shapesByPattern.getval('pattern') == 'arc') {
                    $('#edgeCuttingShapes option[value=\'rabbet\']').hide();
                } else {
                    $('#edgeCuttingShapes option[value=\'rabbet\']').show();
                }

                shapesByPattern.methods.grain_copy();
            },
            edgeCuttingRear(e) {
                let type_milling = shapesByPattern.getval('edgeCuttingRear');

                if (+type_milling == 0) {
                    shapesByPattern.hideinput('rearSection');
                } else {
                    shapesByPattern.showinput('rearSection');
                    if (materialType == 'compact' && type_milling == 'rabbet' && shapesByPattern.getval('radius') < 6) {
                        shapesByPattern.setval('radius', 6);
                    }
                }

                if (type_milling == 'faska') {
                    shapesByPattern.showinput('faska_field_rear');
                    if (shapesByPattern.getval('edgeCutting') == 0) {
                        $('#shapeZrear option[value="8"]').hide();
                        shapesByPattern.setval('Wrear', shapesByPattern.getval('Zrear'));
                        shapesByPattern.setval('Drear', 45);
                        $(shapesByPattern.getinput('Zrear')).change(function () {
                            shapesByPattern.setval('Wrear', shapesByPattern.getval('Zrear'));
                        });
                    }
                } else {
                    shapesByPattern.hideinput('faska_field_rear');
                }

                if (type_milling == 'radius') {
                    shapesByPattern.showinput('radius_field_rear');
                } else {
                    shapesByPattern.hideinput('radius_field_rear');
                }

                if (shapesByPattern.getval('edgeCutting') == "arc" || shapesByPattern.getval('edgeCutting') == "rect") {
                    shapesByPattern.hideinput('rearSection');
                    shapesByPattern.hideinput('grain_copy');
                    shapesByPattern.hideinput('edgeCuttingRear');
                } else {
                    shapesByPattern.showinput('grain_copy');
                    shapesByPattern.showinput('edgeCuttingRear');
                    if ((shapesByPattern.getval('edgeCutting') != "arc" && shapesByPattern.getval('edgeCuttingRear') == "arc") ||
                        (shapesByPattern.getval('edgeCutting') != "rect" && shapesByPattern.getval('edgeCuttingRear') == "rect")) {
                        shapesByPattern.setval('edgeCuttingRear', '0');
                    }
                }

                if (type_milling == 'rabbet') {
                    shapesByPattern.showinput('rabbet_field_rear');
                    shapesByPattern.hideinput('rabbet_field_face');
                    shapesByPattern.hideinput('faska_field_face');
                    shapesByPattern.hideinput('radius_field_face');
                    shapesByPattern.setval('edgeCutting', '0');
                } else {
                    shapesByPattern.hideinput('rabbet_field_rear');
                }

                if ((materialType == 'wood' || (['fanera'].includes(materialType) && isMillAdditives)) && type_milling == 'faska') {
                    let Dface = shapesByPattern.getval('Dface');
                    shapesByPattern.setval('Drear', Dface);

                    shapesByPattern.methods.Zrear();
                }
            },
            shapePatternFullZcb(){
                if (shapesByPattern.getval('sp_fullZcb')){
                    shapesByPattern.hideinput(['shapePatternEdgeFullZ']);
                    if (shapesByPattern.getval('pattern') == 'rectangular'){
                        shapesByPattern.showinput(['shapePatternExt']);
                        if (shapesByPattern.getval('ext')){
                            shapesByPattern.hideinput(['shapePatternRadius']);
                        }
                        shapesByPattern.showinput(['shapePatternBand']);
                        if (!shapesByPattern.getval('ext')){
                            $('#shapePatternFullZcb').removeClass('mg16');
                        }
                    }
                    if (shapesByPattern.getval('pattern') == 'circle'){
                        shapesByPattern.showinput(['shapePatternBand']);
                        $('#shapePatternFullZcb').addClass('mg16');
                    }
                } else{
                    shapesByPattern.showinput(['shapePatternEdgeFullZ', 'shapePatternRadius']);
                    shapesByPattern.hideinput(['shapePatternExt']);
                    $('#shapePatternFullZcb').addClass('mg16');
                    if (shapesByPattern.getval('pattern') == 'rectangular' || shapesByPattern.getval('pattern') == 'circle'){
                        shapesByPattern.hideinput(['shapePatternBand']);
                        shapesByPattern.setval('bandId', 0);
                        shapesByPattern.methods.bandId();
                    }
                }
            },
        },
        functions: {
            helpSetBandListForShapesByPattern(data, bandId, patternId) {
                //console.log(data);
                for (var key in data) {
                    if (typeof key == "number") {
                        kromki[data[key]['guid']] = new Array(data[key]['title'], data[key]['thickness'], data[key]['height'], data[key]['number']);
                    }
                }

                var objSel = shapesByPattern.getinput('bandId');

                if (objSel) {
                    objSel.options.length = 0;
                    objSel.options[0] = new Option('Нет', 0);
                    var i = 1;
                    for (var key in data) {
                        if (Number(data[key]['height']) + 3 < detailThickness
                            || ((patternId == 'rectangular' || patternId == 'circle') && Number(data[key]['thickness']) > 0.8)) {
                            continue;
                        }
                        if (data[key]['type'] == 'lazer') {
                            continue;
                        }
                        objSel.options[i] = new Option(data[key]['number'] + data[key]['title'], data[key]['guid']);
                        if (bandId == data[key]['guid']) {
                            objSel.options[i].selected = true;
                        }
                        i++;
                    }
                }
            },
            setBandListForShapesByPattern(bandId, patternId) {
                if (edgeList === '' || edgeList.length > 0) {
                    shapesByPattern.use('helpSetBandListForShapesByPattern', [edgeList, bandId, patternId]);
                }
            },
            changeKromkaSelect(edgeId, bandId) {
                switch (edgeId) {
                    case '2':
                        shapesByPattern.getval('kromkaLeft');
                        break;
                    case '3':
                        shapesByPattern.getval('kromkaTop');
                        break;
                    case '4':
                        shapesByPattern.getval('kromkaRight');
                        break;
                    case '5':
                        shapesByPattern.getval('kromkaBottom');
                        break;
                }
            },
            svg(shape_key, shape, detailKey, patternId) {
                if (kromkaChamfer45) {
                    draw();
                } else {
                    var isAddShape = false;
                    if (shape_key === '') {
                        isAddShape = true;
                    }
                    $.ajax({
                        type: "POST",
                        url: "system/controllers/JsonController.php",
                        data: ({
                            controller: 'Additives',
                            action: 'getSVGForShapeByPattern',
                            shape_key: shape_key,
                            detailKey: detailKey,
                            isAddShape: isAddShape
                        }),
                        dataType: 'json',
                        success: function (data) {
                            var svgShapeMain = data[0][0];
                            var key = shape_key;
                            //console.log('* shapesByPattern SVG \nsvgShapeMain : ', svgShapeMain,'\nkey : ', key);
                            if (!isAddShape) {
                                $('.svg-shapes-by-pattern-' + key).remove();
                            }

                            for (var i in svgShapeMain) {
                                if (svgShapeMain[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgShapeMain[i];
                            }

                            shapesByPattern.use('svgs_init');
                        },
                        complete: function (data) {
                            if (patternId == 'arc' || patternId == 'smile' || patternId == 'handles' || patternId == 'rectangular' || patternId == 'circle') {
                                draw();
                                return;
                            }
                        }
                    });
                }
            },
            svgs_init() {
                var els = document.querySelectorAll('g[class^=svg-shapes-by-pattern-]');
                for (var i = 0; i < els.length; i++) {
                    shapesByPattern.use('svg_init_el', [els[i]]);
                }
            },
            changeSideHandle(){
                var handlesType = shapesByPattern.getval('handlesType');
                var art = shapesByPattern.getval('handleArt');
                var handle =  shapesByPattern.cache.params[handlesType] ? shapesByPattern.cache.params[handlesType]['arcticles'][art]['params'] : null;
                var value = shapesByPattern.getval('sp_edgeForHandle');

                /*Возможно вернем*/

                // if (!handle['sides'].includes(Number(value))) {
                //     var sides = {
                //         1: 'лицевую',
                //         6: 'тыльную',
                //     };
                //     showWarningMessage('Данная ручка крепиться только на ' + sides[Number(handle['sides'][0])] + ' сторону');
                // }
            },
            svg_init_el(el) {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-shapes-by-pattern-/)) {
                            return Number(el.classList[i].replace('svg-shapes-by-pattern-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var handlesType = detailShapesByPattern[id]['handleType'];
                    if (handlesType == 'edges') {
                        var w = detailShapesByPattern[id]['handleD'];
                        var l = detailShapesByPattern[id]['handleL'];
                        var s = detailShapesByPattern[id]['shiftEdge'];
                    } else if (handlesType == 'rabbets') {
                        var n = detailShapesByPattern[id]['handleN'];
                    } else {
                        var w = detailShapesByPattern[id]['sizeV'];
                        var l = detailShapesByPattern[id]['sizeH'];
                        var s = detailShapesByPattern[id]['shift'];
                    }
                    var r = detailShapesByPattern[id]['radius'];
                    var x = detailShapesByPattern[id]['shiftX'];
                    var y = detailShapesByPattern[id]['shiftY'];
                    var handleArt = detailShapesByPattern[id]['handleArt'];
                    if (handlesType == 'edges') {
                        var rearBase = detailShapesByPattern[id]['rearBase'];
                    }
                    var text1 = LANG['VIREZ-PO-SHABL']+` №${id + 1}: `;
                    var text2 = '';
                    if (x && y) {
                        text2 += `x=${x}, y=${y}`;
                    }
                    if (s) {
                        text2 = (text2) ? text2 + ', ' : text2;
                        text2 += LANG['OTSTUP-S']+`=${s}`;
                        if (handlesType == 'edges') {
                            if (rearBase) {
                                text2 += LANG['FROM-TIL-SIDE'];
                            } else {
                                text2 += LANG['FROM-LITS-SIDE'];
                            }
                        }
                    }
                    if (r) {
                        text2 = (text2) ? text2 + ', ' : text2;
                        text2 += LANG['RADIUS']+`=${r}`;
                    }
                    if (w && l) {
                        text2 = (text2) ? text2 + ', ' : text2;
                        text2 += `ширина=${w}, `+LANG['DLINA-S']+`=${l}`;
                    }
                    if (n) {
                        text2 += LANG['OTSTUP-S']+`=${n}`;
                    }
                    $('#drawinfo').text(
                        text1 + text2
                    );

                    $('g.svg-shapes-by-pattern-' + id + ' > path').css('stroke-width', 3);
                    if (handlesType == 'edges') {
                        var child = document.querySelector('g.svg-shapes-by-pattern-' + id + ' path.shape-by-pattern[shift-x][shift-y]');
                        var side = detailShapesByPattern[id]['edgeForHandleEdge'];
                        if (child) {
                            showPositionOnSide(side, child.getAttribute('shift-x'), child.getAttribute('shift-y'));
                        }
                    } else {
                        $('g.svg-shapes-by-pattern-' + id).css('stroke-width', 3);
                        $('rect.rabbet-on-1').css('stroke-width', 3);
                        $('circle.rabbet-on-1').css('stroke-width', 3);
                        $('rect.rabbet-on-6').css('stroke-width', 3);
                        $('circle.rabbet-on-6').css('stroke-width', 3);
                        var child = document.querySelector('.svg-shapes-by-pattern-' + id);
                        if (child) {
                            child = child.childNodes[0];
                            showPositionOnSide(1, child.getAttribute('shift-x'), child.getAttribute('shift-y'));
                        }
                    }
                };
                el.onmouseout = e => {
                    var id = getid();
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    $('g.svg-shapes-by-pattern-' + id + ' > path').css('stroke-width', 1);
                    $('g.svg-shapes-by-pattern-' + id).css('stroke-width', 1);
                    $('rect.rabbet-on-1').css('stroke-width', 1);
                    $('circle.rabbet-on-1').css('stroke-width', 1);
                    $('rect.rabbet-on-6').css('stroke-width', 1);
                    $('circle.rabbet-on-6').css('stroke-width', 1);
                    var side = detailShapesByPattern[id]['edgeForHandleEdge'];
                    hidePositionOnSide(side);
                };
                el.ondblclick = e => {
                    var id = getid();
                    editShapeByPattern(id);
                };
            },
            data(data){
                if (data) {
                    detailShapesByPattern.length = 0;
                    for (key in data) {
                        detailShapesByPattern.push(data[key]);
                    }
                } else {
                    detailShapesByPattern = [];
                }
            },
            table(){
                /*
                 * обновляем таблицу только если есть хотя бы 1 шаблон
                 * */
                var patternId = shapesByPattern.getval('pattern');
                if (detailShapesByPattern.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: '/service/system/views/additives/inc/tableShapesByPattern.php',
                        data: 'detail_key=' + detailKey,
                        dataType: "html",
                        success: function (data) {
                            if (data.length > 0) {
                                shapesByPattern.showinput('table');
                                $("#hide-table").css("display", "block");
                                showHideTableStyles();
                                var table = shapesByPattern.getinput('table');
                                table.innerHTML = data;
                                $(table).find('tr[id^=shape-]').each((i, el) => {
                                    el.ondblclick = e => {
                                        editShapeByPattern(Number(el.id.replace('shape-', '')));
                                    };
                                    el.onmouseout = e => {
                                        var id = Number(el.id.replace('shape-', ''));
                                        unmarkShapeByPattern(id);
                                        hidePositionOnSide(1);
                                    };
                                    el.onmouseover = e => {
                                        var id = Number(el.id.replace('shape-', ''));
                                        markShapeByPattern(id);
                                        var child = document.querySelector('.svg-shapes-by-pattern-' + id);
                                        if (child) {
                                            child = child.childNodes[0];
                                            showPositionOnSide(1, child.getAttribute('shift-x'), child.getAttribute('shift-y'))
                                        }
                                    };
                                });
                            } else {
                                shapesByPattern.hideinput('table');
                            }
                        }
                    });
                } else {
                    shapesByPattern.hideinput('table');
                }

                if (detailShapesByPattern.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: '/service/system/views/additives/inc/tableShapesByPatternForHandles.php',
                        data: 'detail_key=' + detailKey,
                        dataType: "html",
                        success: function (data) {
                            if (data.length > 0) {
                                shapesByPattern.showinput('tableForHandles');
                                $("#hide-table").css("display", "block");
                                showHideTableStyles();
                                var tableForHandles = shapesByPattern.getinput('tableForHandles');
                                tableForHandles.innerHTML = data;
                                $(tableForHandles).find('tr[id^=shape-]').each((i, el) => {
                                    el.ondblclick = e => {
                                        editShapeByPattern(Number(el.id.replace('shape-', '')));
                                    };
                                    el.onmouseout = e => {
                                        var id = Number(el.id.replace('shape-', ''));
                                        $('g.svg-shapes-by-pattern-' + id + ' > path').css('stroke-width', 1);
                                        unmarkShapeByPattern(id);
                                        hidePositionOnSide(1);
                                    };
                                    el.onmouseover = e => {
                                        var id = Number(el.id.replace('shape-', ''));
                                        markShapeByPattern(id);
                                        $('g.svg-shapes-by-pattern-' + id + ' > path').css('stroke-width', 3);
                                        var child = document.querySelector('g.svg-shapes-by-pattern-' + id + ' path.shape-by-pattern[shift-x][shift-y]');
                                        var side = detailShapesByPattern[id]['edgeForHandleEdge'];
                                        if (child) {
                                            showPositionOnSide(side, child.getAttribute('shift-x'), child.getAttribute('shift-y'))
                                        }
                                    };
                                });
                            } else {
                                shapesByPattern.hideinput('tableForHandles');
                            }
                        }
                    });
                } else {
                    shapesByPattern.hideinput('tableForHandles');
                }
            },
            rmsvg(key, data){
                if (data['patternId'] == 'arc' || data['patternId'] == 'smile' || data['patternId'] == 'handles'
                    || data['patternId'] == 'rectangular' || data['patternId'] == 'circle') {
                    draw();
                    return;
                }

                // $('#svg-shapes-by-pattern-' + key + "-track").each(function (index, value) {
                //     $(this).remove();
                // });
                // $('#svg-shapes-by-pattern-' + key).each(function (index, value) {
                //     $(this).remove();
                // });
                // $('.svg-shapes-by-pattern-' + key + "-track").each(function (index, value) {
                //     $(this).remove();
                // });
                $('.svg-shapes-by-pattern-' + key).remove();
                draw();

                // var startExistElementClass = Number(key);
                // var startExistElementId = Number(key);
                // while ($('.svg-shapes-by-pattern-' + Number(startExistElementClass + 1)).length) {
                //     $('.svg-shapes-by-pattern-' + Number(startExistElementClass + 1)).attr('class', 'svg-shapes-by-pattern-' + Number(startExistElementClass));
                //     $('.svg-shapes-by-pattern-' + Number(startExistElementClass + 1)).attr('class', 'svg-shapes-by-pattern-' + Number(startExistElementClass));
                //     startExistElementClass++;
                // }

                // while ($('#svg-shapes-by-pattern-' + Number(startExistElementId + 1)).length) {
                //     $('#svg-shapes-by-pattern-' + Number(startExistElementId + 1)).attr('id', 'svg-shapes-by-pattern-' + Number(startExistElementId));
                //     startExistElementId++;
                // }
                if (detailShapesByPattern.length != key) {
                    for (var i = +key + 1; i < detailShapesByPattern.length + 1; i++) {
                        var svg;
                        while (svg = document.getElementsByClassName('svg-shapes-by-pattern-' + i)[0]) {
                            svg.classList.remove('svg-shapes-by-pattern-' + i);
                            svg.classList.add('svg-shapes-by-pattern-' + (i - 1));
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
            checkSideHandle(side){
                var handlesType = shapesByPattern.getval('handlesType');
                var first
                if (handlesType == 'rabbets') {
                    $("#sp_edgeForHandleRabbet > option").each(function () {
                        if (String(side) == String(this.value.substring(0, 1))) {
                            $(this).show();
                            $("#sp_edgeForHandleRabbet").val(62);

                        } else {
                            $(this).hide();
                            $("#sp_edgeForHandleRabbet").val(12);
                        }
                    });
                }
            },
            getEdgeCutting(){
                var edgeCutting = {
                    face: {type: ''},
                    rear: {type: ''},
                };
                edgeCutting['face']['type'] = shapesByPattern.getval('edgeCutting');
                edgeCutting['rear']['type'] = shapesByPattern.getval('edgeCuttingRear');
                if (shapesByPattern.getval('edgeCutting') == 'faska') {
                    edgeCutting['face']['d'] = shapesByPattern.getval('Dface');
                    edgeCutting['face']['z'] = shapesByPattern.getval('Zface');
                    edgeCutting['face']['w'] = shapesByPattern.getval('Wface');
                }
                if (shapesByPattern.getval('edgeCuttingRear') == 'faska') {
                    edgeCutting['rear']['d'] = shapesByPattern.getval('Drear');
                    edgeCutting['rear']['z'] = shapesByPattern.getval('Zrear');
                    edgeCutting['rear']['w'] = shapesByPattern.getval('Wrear');
                }

                if (shapesByPattern.getval('edgeCutting') == 'radius') {
                    edgeCutting['face']['r'] = shapesByPattern.getval('Rface');
                }
                if (shapesByPattern.getval('edgeCuttingRear') == 'radius') {
                    edgeCutting['rear']['r'] = shapesByPattern.getval('Rrear');
                }

                if (shapesByPattern.getval('edgeCutting') == 'rabbet') {
                    edgeCutting['face']['z'] = shapesByPattern.getval('rabbetZface');
                    edgeCutting['face']['w'] = shapesByPattern.getval('rabbetWface');
                }
                if (shapesByPattern.getval('edgeCuttingRear') == 'rabbet') {
                    edgeCutting['rear']['z'] = shapesByPattern.getval('rabbetZrear');
                    edgeCutting['rear']['w'] = shapesByPattern.getval('rabbetWrear');
                }

                if (shapesByPattern.getval('edgeCutting') == 'arc' || shapesByPattern.getval('edgeCuttingRear') == 'arc') {

                    var rFace = '';
                    var rRear = '';

                    var selFace = shapesByPattern.getinput('edgeCutting');
                    $(selFace.options).each(function () {
                        if ($(this).is(':selected')) {
                            rFace = $(this).attr('r');
                        }
                    });

                    var selRear = shapesByPattern.getinput('edgeCuttingRear');
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
            setEdgeCutting(data){
                if (data) {
                    if (data['face']['type'] == '') {
                        shapesByPattern.setval('edgeCutting', 0);
                    } else {
                        shapesByPattern.setval('edgeCutting', data['face']['type']);
                    }
                    if (data['rear']['type'] == '') {
                        shapesByPattern.setval('edgeCutting' + "Rear", 0);
                    } else {
                        shapesByPattern.setval('edgeCutting' + "Rear", data['rear']['type']);
                    }

                    if (data['face']['type'] == "faska") {
                        shapesByPattern.setval("Zface", data['face']['z']);
                        shapesByPattern.setval("Wface", data['face']['w']);
                        shapesByPattern.setval("Dface", data['face']['d']);
                    }

                    if (data['rear']['type'] == "faska") {
                        shapesByPattern.setval("Zrear", data['rear']['z']);
                        shapesByPattern.setval("Wrear", data['rear']['w']);
                        shapesByPattern.setval("Drear", data['rear']['d']);
                    }

                    if (data['face']['type'] == "radius") {
                        shapesByPattern.setval("Rface", data['face']['r']);
                    }

                    if (data['rear']['type'] == "radius") {
                        shapesByPattern.setval("Rrear", data['rear']['r']);
                    }

                    if (data['face']['type'] == "rabbet") {
                        shapesByPattern.setval("rabbetZface", data['face']['z']);
                        shapesByPattern.setval("rabbetWface", data['face']['w']);
                    }

                    if (data['rear']['type'] == "rabbet") {
                        shapesByPattern.setval("rabbetZrear", data['rear']['z']);
                        shapesByPattern.setval("rabbetWrear", data['rear']['w']);
                    }
                }
                shapesByPattern.methods.edgeCutting();
                shapesByPattern.methods.edgeCuttingRear();

            },
            setXYAfterStandartCheck(value){
                shapesByPattern.disabled('shiftY', value);
                shapesByPattern.disabled('center_y', value);
                shapesByPattern.disabled('shiftX', value);
                shapesByPattern.disabled('center_x', value);
            },
            addShape(){

                var patternId = shapesByPattern.getval('pattern');

                var bandId = shapesByPattern.getval('bandId');
                var edgeId = shapesByPattern.getval('edgeId');
                var ext = shapesByPattern.getval('ext');
                var shiftX = shapesByPattern.getval('shiftX');
                var shiftY = shapesByPattern.getval('shiftY');
                var sizeH = shapesByPattern.getval('sizeH');
                var sizeV = shapesByPattern.getval('sizeV');
                var radius = shapesByPattern.getval('radius');
                var center = shapesByPattern.getval('center');
                var lock_pos = shapesByPattern.getval('lock_pos');
                // var lock_pos_v = shapesByPattern.getval('lock_pos_v');
                var lock_type = shapesByPattern.getval('lock_type');
                var fixture_type = shapesByPattern.getval('fixture_type');
                var fixture_count = shapesByPattern.getval('fixture_count');
                if (lock_type == 'in'){
                    var lock_length = shapesByPattern.getval('lock_length');
                }else {
                    var lock_length = detailFullHeight;
                }
                var binding = shapesByPattern.getval('binding');
                var inner = shapesByPattern.getval('inner');
                var shift;
                var shiftForNotStandart = '0';
                var shapeData;
                var standartCheck = shapesByPattern.getval('standartCheck');
                var autoCenter = shapesByPattern.getval('autoCenter');
                var shapePatternMirrorCheckH = shapesByPattern.getval('shapePatternMirrorCheckH');
                var shapePatternMirrorCheckV = shapesByPattern.getval('shapePatternMirrorCheckV');
                var standartValue = shapesByPattern.getval('standartValue');
                var r1Wave = shapesByPattern.getval('r1Wave');
                var r2Wave = shapesByPattern.getval('r1Wave');

                var handleArt = shapesByPattern.getval('handleArt');
                var handleWay = shapesByPattern.getval('handleWay');
                var handleL = shapesByPattern.getval('handleL');
                var handleD = shapesByPattern.getval('handleD');
                var handleZ = shapesByPattern.getval('handleZ');
                var handleR = shapesByPattern.getval('handleR');
                var handleN = shapesByPattern.getval('handleN');
                var handlesType = shapesByPattern.getval('handlesType');
                var sp_edgeForHandle = shapesByPattern.getval('sp_edgeForHandle');
                var sp_edgeForHandleRabbet = shapesByPattern.getval('sp_edgeForHandleRabbet');
                var sp_edgeForHandleEdge = shapesByPattern.getval('sp_edgeForHandleEdge');
                var is_driling = shapesByPattern.getval('shapePatternDrilingCheck');
                var edgeForHandleBorder = shapesByPattern.getval('edgeForHandleBorder');
                var edgeForHandleBinding = shapesByPattern.getval('edgeForHandleBinding');
                var edgeForHandleGola = shapesByPattern.getval('sp_edgeForHandleGola');
                var sp_shapePatternGolaL = shapesByPattern.getval('sp_shapePatternGolaL');
                var sp_shapePatternGolaD = shapesByPattern.getval('sp_shapePatternGolaD');
                var sp_shapePatternGolaZ = shapesByPattern.getval('sp_shapePatternGolaZ');
                var sp_shapePatternGolaR = shapesByPattern.getval('sp_shapePatternGolaR');
                var sp_cornerForHandleGola = shapesByPattern.getval('sp_cornerForHandleGola');
                var joint = shapesByPattern.getval('joint');
                var jointCircle = shapesByPattern.getval('jointCircle');
                var isFullZ = shapesByPattern.getval('sp_fullZcb');
                var edgeFullZ = shapesByPattern.getval('sp_edgeFullZ');
                var quantityR = 0;
                if (constructorID == 'stol' && patternId == 'rectangular'){
                    var depth = -1;
                    isFullZ = 1;
                } else{
                    if (isFullZ == 1){
                        var depth = -1;
                    } else{
                        var depth = detailThickness - 3;
                        ext = 0;
                        isFullZ = 0;
                    }
                }
                if (['wood', 'compact'].includes(materialType)){
                    isFullZ = 1;
                    edgeFullZ = 1;
                }
                if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                    var edgeCuttingShapes = shapesByPattern.functions.getEdgeCutting();
                }
                if (handlesType != '') {
                    var handle = shapesByPattern.cache.params[handlesType]['arcticles'][handleArt]['params'];
                    if(handlesType == 'edges'){
                        // var shiftEdge = (Number(handle['rearBase']))? detailThickness - parseFloat(handle['y']):handle['y'];
                        var shiftEdge = handle['y'];
                        var rearBase = (Number(shapesByPattern.getval('sp_bindsForHandleEdge')) == 6) ? 1 : 0;
                    } else if (handlesType == 'borderAndRabbets') {
                        var uShapeD = Number(handle['uShape']['d']);
                        var rabbetD = Number(handle['rabbet']['d']);
                        handleD = Math.max(uShapeD, rabbetD);
                        handleZ = detailThickness;
                    }
                }

                var  handlesExt = shapesByPattern.getval('handlesExt');
                switch (patternId) {
                    case 'uShaped':
                        switch (edgeId) {
                            case '2':
                            case '4':
                                if (center) {
                                    shift = detailFullHeight / 2 - sizeV / 2;
                                } else {
                                    shift = shiftY;
                                }
                                break;
                            case '3':
                            case '5':
                                if (center) {
                                    shift = detailFullWidth / 2 - sizeH / 2;
                                } else {
                                    shift = shiftX;
                                }
                                break;
                        }
                        if (materialType == 'compact') {
                            quantityR = 0;
                        }
                        shapeData = {
                            patternId: patternId,
                            edgeId: edgeId,
                            ext: ext,
                            shift: shift,
                            sizeH: sizeH,
                            sizeV: sizeV,
                            bandId: bandId,
                            radius: radius,
                            edgeCuttingUShaped: edgeCuttingShapes,
                            quantityR: quantityR,
                        };
                        break;
                    case 'rectangular':
                        if (center) {
                            shiftX = detailFullWidth / 2 - sizeH / 2;
                            shiftY = detailFullHeight / 2 - sizeV / 2;
                        }
                        if (materialType == 'compact') {
                            quantityR = 0;
                        }
                        shapeData = {
                            patternId: patternId,
                            ext: ext,
                            shiftX: shiftX,
                            shiftY: shiftY,
                            sizeH: sizeH,
                            sizeV: sizeV,
                            bandId: bandId,
                            radius: radius,
                            joint:joint,
                            edgeCuttingRect: edgeCuttingShapes,
                            isFullZ: isFullZ,
                            edgeFullZ: edgeFullZ, 
                            depth: depth,
                            quantityR: quantityR,
                        };
                        break;
                    case 'smile':

                        switch (edgeId) {
                            case '2':
                            case '4':

                                if (center) {

                                    shift = detailFullHeight / 2 - 110;
                                } else {
                                    shift = shiftY;
                                }

                                //если не стандартная
                                if (!standartCheck && center) {
                                    //оставляем старый

                                    shiftForNotStandart = shift;
                                    shift = shift - (standartValue / 2);
                                }
                                break;
                            case '3':
                            case '5':
                                if (center) {
                                    shift = detailFullWidth / 2 - 110;
                                } else {
                                    shift = shiftX;
                                }

                                //если не стандартная
                                if (!standartCheck && center) {
                                    //оставляем старый

                                    shiftForNotStandart = shift;
                                    shift = shift - (standartValue / 2);
                                }
                                break;
                        }
                        shapeData = {
                            patternId: patternId,
                            edgeId: edgeId,
                            bandId: bandId,
                            shift: shift,
                            standartCheck: standartCheck,
                            standartValue: standartValue,
                            shiftForNotStandart: shiftForNotStandart,
                            center: center,
                            autoCenter: autoCenter
                        };
                        break;
                    case 'wave':

                        shapeData = {
                            patternId: patternId,
                            edgeId: edgeId,
                            bandId: bandId,
                            shiftX: shiftX,
                            shiftY: shiftY,
                            shapePatternMirrorCheckH: shapePatternMirrorCheckH,
                            shapePatternMirrorCheckV: shapePatternMirrorCheckV,
                            shapePatternR1Wave: r1Wave,
                            shapePatternR2Wave: r2Wave,
                        };
                        break;
                    case 'handles':
                        if (handlesType == 'grooves') {

                            if (Number(shapesByPattern.getval('bindX'))) {
                                if (Number(handleWay)) {
                                    shiftX = detailFullWidth - shiftX - handleD;
                                } else {
                                    shiftX = detailFullWidth - shiftX - handleL;
                                }

                            }

                            if (Number(shapesByPattern.getval('bindY'))) {

                                if (Number(handleWay)) {
                                    shiftY = detailFullHeight - shiftY - handleL;
                                } else {
                                    shiftY = detailFullHeight - shiftY - handleD;
                                }
                            }

                            shapeData = {
                                patternId: patternId,
                                shiftX: shiftX,
                                shiftY: shiftY,
                                handleD: handleD,
                                handleL: handleL,
                                handleZ: handleZ,
                                handleWay: handleWay,
                                handleArt: handleArt,
                                handlesType: handlesType,
                                handleR: handleR,
                                sp_edgeForHandle: sp_edgeForHandle,
                                isDriling: is_driling
                            };
                        }

                        if (handlesType == 'rabbets') {

                            shapeData = {
                                patternId: patternId,
                                handleD: handleD,
                                handleL: handleL,
                                handleZ: handleZ,
                                handleN: handleN,
                                handleArt: handleArt,
                                handlesType: handlesType,
                                handleR: handleR,
                                sp_edgeForHandleRabbet: sp_edgeForHandleRabbet,
                                isDriling: is_driling
                            };
                        }
                        if (handlesType == 'edges') {

                            shapeData = {
                                patternId: patternId,
                                handleD: handleD,
                                handleL: handleL,
                                handleZ: handleZ,
                                handleArt: handleArt,
                                handlesType: handlesType,
                                sp_edgeForHandleEdge: sp_edgeForHandleEdge,
                                isDriling: is_driling,
                                shiftEdge: shiftEdge,
                                handlesExt: handlesExt,
                                rearBase: rearBase,
                            };
                        }
                        if (handlesType == 'borderAndRabbets') {

                            shapeData = {
                                patternId: patternId,
                                handleArt: handleArt,
                                handlesType: handlesType,
                                isDriling: is_driling,
                                handleD: handleD,
                                handleN: handleN,
                                handleL: handleL,
                                handleZ: handleZ,
                                sp_edgeForHandle: sp_edgeForHandle,
                                edgeForHandleBorder: edgeForHandleBorder,
                                edgeForHandleBinding: edgeForHandleBinding
                            };
                        }

                        if (handlesType == 'gola') {
                            if (handleArt == 'Gola C'){
                                quantityR = 2;
                            } else if(handleArt == 'Gola L'){
                                quantityR = 1;
                            }
                            shapeData = {
                                patternId: patternId,
                                handleArt: handleArt,
                                handlesType: handlesType,
                                edgeForHandleGola : edgeForHandleGola,
                                sp_edgeForHandle: sp_edgeForHandle,
                                handleL: sp_shapePatternGolaL,
                                handleD: sp_shapePatternGolaD,
                                handleZ: sp_shapePatternGolaZ,
                                handleR: sp_shapePatternGolaR,
                                handleWay: handleWay,
                                shiftX: shiftX,
                                shiftY: shiftY,
                                isDriling: is_driling,
                                bandId: bandId,
                                sp_cornerForHandleGola: sp_cornerForHandleGola,
                                quantityR: quantityR,
                            };
                        }

                        break;
                    case 'circle':
                        if (center) {
                            shiftX = detailFullWidth / 2;
                            shiftY = detailFullHeight / 2;
                        }
                        shapeData = {
                            patternId: patternId,
                            bandId: bandId,
                            shiftX: shiftX,
                            shiftY: shiftY,
                            radius: radius,
                            jointCircle:jointCircle,
                            edgeCuttingCircle: edgeCuttingShapes,
                            isFullZ: isFullZ,
                            edgeFullZ: edgeFullZ,
                            depth: depth, 
                        };
                        break;
                    case 'lock':
                        shapeData = {
                            patternId: patternId,
                            type: lock_type,
                            position: lock_pos,
                            // positionV: lock_pos_v,
                            fixture_type: fixture_type,
                            fixture_count: fixture_count,
                            lock_length: lock_length,
                            binding: binding,
                            key: detailTimestamp,
                            length: lock_length, //not used
                        };
                        break;
                    case 'arc':
                        shapeData = {
                            patternId: patternId,
                            edgeId: edgeId,
                            shift: (edgeId == '2' || edgeId == '4') ? (shiftX): (shiftY),
                            bandId: bandId,
                            inner: inner,
                            edgeCuttingArc: edgeCuttingShapes,
                        };
                        if (!shapeData.inner && !shapeData.shift) {
                            showErrorMessage(LANG['SHOW-SMESH-DUG']);
                            // $('#sp_x0').focus();$('#sp_y0').focus();
                            return;
                        }
                        if (shapeData.inner < 0 || shapeData.shift < 0) {
                            showErrorMessage(LANG['SMESH-SHABLON-DUGA-OTR']);
                            return;
                        }
                        if (bandId) {
                            shapesByPattern.use('changeKromkaSelect', [edgeId, bandId]);
                        }
                        break;
                }

                if (patternId == 'rectangular' && materialType == 'stol' && (sizeH>780 || sizeV>780)) {  // FIXME
                    showWarningMessage(LANG['PREV-MAKS-DLINA-SKVOZ-VIREZ-780']+
                        LANG['FOR-SAVE-DETAIL-FREZ']);
                }

                shapesByPattern.setval('pattern', '');
                shapesByPattern.change('pattern');
                $(shapesByPattern.getinput('formShapeByPattern')).html('');
                shapesByPattern.setval('shiftX', '');
                shapesByPattern.setval('shiftY', '');
                shapesByPattern.setval('sizeH', '');
                shapesByPattern.setval('sizeV', '');
                shapesByPattern.setval('radius', 0);
                shapesByPattern.change('radius');
                shapesByPattern.setval('bandId', 0)
                shapesByPattern.setval('standartCheck', '');
                shapesByPattern.change('standartCheck');

                shapesByPattern.setval('inner', false);
                shapesByPattern.hideinput('standartCheck');
                shapesByPattern.hideinput('standartChecker');
                shapesByPattern.setval('standartCheck', false);
                shapesByPattern.setval('standartCheck', true);
                shapesByPattern.hideinput('autoCenterBlock');
                shapesByPattern.setval('autoCenter', false);
                shapesByPattern.setval('shapePatternMirrorCheckH', false);
                shapesByPattern.setval('shapePatternMirrorCheckV', false);
                shapesByPattern.setval('handlesType', '');
                shapesByPattern.setval('ext', false);
                shapesByPattern.disabled('shiftY', false);
                shapesByPattern.disabled('shiftX', false);
                for (key in shapeData) {
                    shapeData[key] = (shapeData[key] == "true" || shapeData[key] == true ) ? 1 : shapeData[key];
                    shapeData[key] = (shapeData[key] == "false" || shapeData[key] == false) ? 0 : shapeData[key];
                }
                g_detail.setOperation(
                    'shapeByPattern',
                    {
                        detail_key: detailKey,
                        shape_key: shape_by_pattern_key,
                        data: shapeData,
                    },
                    function (data) {
                        var val = data[1];
                        var data = data[0];
                        //проверяем длину выреза
                        /* if (data[0]['_standartValue'] < 10 && data[0]['_shiftForNotStandart'] != "0") {
                         showErrorMessage("Минимальный размер длины выреза должен быть не менее 10мм");
                         }*/

                        if (data.msg) {
                            showErrorMessage(data.msg);
                            return;
                        }
                        $(shapesByPattern.getinput('add')).text(LANG['ADD']);
                        var shape_key_for_svg = shape_by_pattern_key;
                        shape_by_pattern_key = '';

                        shapesByPattern.use('data', [data]);
                        //console.log('-> ShapesByPattern.addShape.setOperation \nshape_key_for_svg : ', shape_key_for_svg,'\ndetailShapesByPattern : ',detailShapesByPattern );
                        shapesByPattern.use('table');
                        shapesByPattern.use('svg', [shape_key_for_svg, shapeData, detailKey, patternId]);
                        shapesByPattern.methods.center();
                        shapesByPattern.setval('shapePatternDrilingCheck', 0);
                        shapesByPattern.setval('bindX', 0);
                        shapesByPattern.setval('bindY', 0);
                        shapesByPattern.setval('handlesExt', 0);
                    }
                );
            },
            checkCentreActive() {
                switch (shapesByPattern.getval('pattern')) {
                    case 'uShaped':
                        if(['2', '4'].includes(shapesByPattern.getval('edgeId'))) {
                            shapesByPattern.disabled('center_y', !shapesByPattern.getval('sizeV'))
                        } else {
                            shapesByPattern.disabled('center_x', !shapesByPattern.getval('sizeH'))
                        }
                        break;
                    case 'rectangular':
                        shapesByPattern.disabled('center_y', !shapesByPattern.getval('sizeV'));
                        shapesByPattern.disabled('center_x', !shapesByPattern.getval('sizeH'));
                        break;
                    case 'smile':
                        shapesByPattern.disabled('center_x', false);
                        shapesByPattern.disabled('center_y', false);
                        break;
                }
            },
            /**
             * Checks whether control elements on the panel should be active.
             */
            checkActive() {
                var sizeH = shapesByPattern.getval('sizeH');
                var sizeV = shapesByPattern.getval('sizeV');
                var shiftX = shapesByPattern.getval('shiftX');
                var shiftY = shapesByPattern.getval('shiftY');
                var patternId = shapesByPattern.getval('pattern');
                var minShiftY = 50;
                var minShiftX = 80;
                if ('stol' === constructorID) {
                    var isActive = false;
                    if (patternId == 'rectangular') {
                        if ((Math.max(sizeH, sizeV) <= 780) && ((shiftX > minShiftX && shiftX < detailFullWidth - sizeH - minShiftX)
                                && (shiftY >= minShiftY && shiftY <= detailFullHeight - sizeV - minShiftY))) {
                            isActive = true;
                        } else if (Math.max(sizeH, sizeV) >= 780) {
                            isActive = false;
                        }
                        shapesByPattern.disabled('ext', !isActive);
                        shapesByPattern.disabled('bandId', !isActive);
                    } else if (patternId == 'uShaped') {
                        isActive = (Math.max(sizeH, sizeV) <= 780);
                        shapesByPattern.disabled('ext', !isActive);
                        shapesByPattern.disabled('bandId', !isActive);
                    }
                    if (isActive) {
                        document.querySelector('label[for=sp_ext]').removeAttribute('disabled');
                        document.querySelector('label[for=sp_band]').removeAttribute('disabled');
                    } else {
                        document.querySelector('label[for=sp_ext]').setAttribute('disabled', '');
                        document.querySelector('label[for=sp_band]').setAttribute('disabled', '');
                        shapesByPattern.checked('ext', false);
                        shapesByPattern.setval('bandId', 0);
                        if (patternId == 'arc') {
                            shapesByPattern.hideinput('shapePatternRadius');
                        } else {
                            shapesByPattern.showinput('shapePatternRadius');
                        }
                    }
                }
            },
            clear() {
                switch (shapesByPattern.getval('pattern')) {
                    case 'uShaped':
                    case 'rectangular':
                    case 'arc':
                    case 'wave':
                    if (shapesByPattern.getval('sizeH') || shapesByPattern.getval('sizeV') ||
                        shapesByPattern.getval('shiftX') || shapesByPattern.getval('shiftY')) {
                        shapesByPattern.setval('sizeH', '');
                        shapesByPattern.setval('sizeV', '');
                        shapesByPattern.setval('shiftX', '');
                        shapesByPattern.setval('shiftY', '');
                        shapesByPattern.disabled('center_x', !shapesByPattern.getval('sizeH'));
                        shapesByPattern.disabled('center_y', !shapesByPattern.getval('sizeV'));
                    }
                        break;
                    case 'smile':
                    case 'circle':
                    case 'handles':
                        if (shapesByPattern.getval('sizeH') || shapesByPattern.getval('sizeV') ||
                            shapesByPattern.getval('shiftX') || shapesByPattern.getval('shiftY')) {
                            shapesByPattern.setval('sizeH', '');
                            shapesByPattern.setval('sizeV', '');
                            shapesByPattern.setval('shiftX', '');
                            shapesByPattern.setval('shiftY', '');
                        }
                        break;
                }
            },
            checkShift(){
                var minX = 20;
                var shift = shapesByPattern.getval('handleWay') == 0 ? shapesByPattern.getval('shiftX') : shapesByPattern.getval('shiftY');
                if (shapesByPattern.getval('handleArt') == 'Gola C'){
                    if (shift < minX){
                        showErrorMessage(LANG['BAD-VALUE-ZNACH-OTSTUPA-MUST']+` ${minX} мм.`);
                        return false;
                    }
                }
                return true;
            }
        },
        init(data, global_data){
            // запускаем инит из супер класса
            shapesByPattern.super();

            shapesByPattern.methods.standartCheck();
            shapesByPattern.cache.params = global_data['shapes_by_pattern_data'];

            shapesByPattern.use('setBandListForShapesByPattern', [shapesByPattern.getval('bandId'), shapesByPattern.getval('pattern')]);

            if (ro) {
                $("#shapesByPatternForm *").attr("disabled", true);
                return;
            }
            if(data.thickness < 16){
                var title = 'handles';
                //$("#sp_pattern option[value=" + title + "]").hide();
                $("#sp_pattern option[value=" + title + "]").remove();
            }

            shapesByPattern.methods.pattern();
            shapesByPattern.methods.init_joint(data['joint']);
            shapesByPattern.methods.init_jointCircle();
            shapesByPattern.functions.data(data.shapesByPattern);
            shapesByPattern.use('table');

            if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {

                shapesByPattern.addInput('edgeCutting', function () {
                    return document.getElementById('edgeCuttingShapes');
                });

                shapesByPattern.addInput('edgeCuttingRear', function () {
                    return document.getElementById('edgeCuttingRearShapes');
                });

                shapesByPattern.addInput('grain_copy', function () {
                    return document.getElementById('grain_copy_shapes');
                });

                shapesByPattern.addInput('faceSection', function () {
                    return document.getElementById('faceShapes');
                });
                shapesByPattern.addInput('rearSection', function () {
                    return document.getElementById('rearShapes');
                });

                shapesByPattern.addInput('Zface', function () {
                    return document.getElementById('shapeZface');
                });

                shapesByPattern.addInput('Wface', function () {
                    return document.getElementById('shapeWface');
                });

                shapesByPattern.addInput('Dface', function () {
                    return document.getElementById('shapeDface');
                });
                shapesByPattern.addInput('Rface', function () {
                    return document.getElementById('shapeRface');
                });
                shapesByPattern.addInput('Zrear', function () {
                    return document.getElementById('shapeZrear');
                });

                shapesByPattern.addInput('Wrear', function () {
                    return document.getElementById('shapeWrear');
                });

                shapesByPattern.addInput('Drear', function () {
                    return document.getElementById('shapeDrear');
                });
                shapesByPattern.addInput('Rrear', function () {
                    return document.getElementById('shapeRrear');
                });

                shapesByPattern.addInput('faska_field_face', function () {
                    return document.getElementById('faska_field_face_shapes');
                });
                shapesByPattern.addInput('radius_field_face', function () {
                    return document.getElementById('radius_field_face_shapes');
                });
                shapesByPattern.addInput('faska_field_rear', function () {
                    return document.getElementById('faska_field_rear_shapes');
                });
                shapesByPattern.addInput('radius_field_rear', function () {
                    return document.getElementById('radius_field_rear_shapes');
                });

                shapesByPattern.addInput('edgeCuttingSection', function () {
                    return document.getElementById('edgeCuttingSectionShapes');
                });

                shapesByPattern.addInput('rabbet_field_face', function () {
                    return document.getElementById('rabbet_field_face_shapes');
                });
                shapesByPattern.addInput('rabbet_field_rear', function () {
                    return document.getElementById('rabbet_field_rear_shapes');
                });
                shapesByPattern.addInput('rabbetZface', function () {
                    return document.getElementById('rabbetZface');
                });
                shapesByPattern.addInput('rabbetWface', function () {
                    return document.getElementById('rabbetWface');
                });
                shapesByPattern.addInput('rabbetZrear', function () {
                    return document.getElementById('rabbetZrear');
                });
                shapesByPattern.addInput('rabbetWrear', function () {
                    return document.getElementById('rabbetWrear');
                });

                var edgeCutting = shapesByPattern.getinput('edgeCutting');
                var edgeCuttingRear = shapesByPattern.getinput('edgeCuttingRear');

                edgeCutting.options[0] = new Option(LANG['NO'], 0);
                edgeCuttingRear.options[0] = new Option(LANG['NO'], 0);

                edgeCutting.options[edgeCutting.options.length] = new Option('Фаска', 'faska');
                edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('Фаска', 'faska');

                edgeCutting.options[edgeCutting.options.length] = new Option('ДугаR13', 'arc');
                edgeCutting.options[edgeCutting.options.length - 1].setAttribute("r", "13");
                edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('ДугаR13', 'arc');
                edgeCuttingRear.options[edgeCuttingRear.options.length - 1].setAttribute("r", "13");

                if (materialType == 'compact') {
                    edgeCutting.options[edgeCutting.options.length] = new Option(LANG['ONE-CHETVERT'], 'rabbet');
                    edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option(LANG['ONE-CHETVERT'], 'rabbet');
                } else {
                    edgeCutting.options[edgeCutting.options.length] = new Option('Радиус', 'radius');
                    edgeCuttingRear.options[edgeCuttingRear.options.length] = new Option('Радиус', 'radius');
                }

                shapesByPattern.methods.grain_copy();
            }
        },
        reinit(data) {
            shapesByPattern.super();
            shapesByPattern.methods.standartCheck();
            shapesByPattern.use('setBandListForShapesByPattern', [shapesByPattern.getval('bandId'), shapesByPattern.getval('pattern')]);
            if (ro) {
                $("#shapesByPatternForm *").attr("disabled", true);
                return;
            }
            shapesByPattern.methods.pattern();
            shapesByPattern.functions.data(data.shapesByPattern);
            shapesByPattern.use('table');
        }
    };

    return shapesByPattern;
});