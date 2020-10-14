/**
 * Rounds a float.
 *
 * Returns the rounded value of val to specified precision
 * (number of digits after the decimal point).
 * Precision can also be negative or zero.
 *
 * Does rounding more accurately than
 * Math.round(), that comes with vanilla js.
 *
 * @param {number} value  The value to round.
 * @param {number} precision  The optional number of decimal digits to round to.
 * Default is zero.
 * @return  The rounded value
 */
function round(value, precision = 0) {
    return Number(Math.round(value * Number('1e' + precision)) * Number('1e' + (precision * -1)));
}

var edgeList = [];
var domain = '';

function setOffcut() {
    var left = Math.round(Number($('#left_offcut').val()));
    var top = Math.round(Number($('#top_offcut').val()));
    var right = Math.round(Number($('#right_offcut').val()));
    var bottom = Math.round(Number($('#bottom_offcut').val()));
    if (!checkOffcut(left, top, right, bottom)) {
        showErrorMessage(LANG['BAD-VALUE-MAYBE']);
        return;
    }
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Materials',
            action: 'setOffcuts',
            left: left,
            top: top,
            right: right,
            bottom: bottom
        }),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            $('#left_offcut').prop('disabled', true);
            $('#top_offcut').prop('disabled', true);
            $('#right_offcut').prop('disabled', true);
            $('#bottom_offcut').prop('disabled', true);
            $('#left_offcut').val(data['left']);
            $('#top_offcut').val(data['top']);
            $('#right_offcut').val(data['right']);
            $('#bottom_offcut').val(data['bottom']);
            $('#editOffcut').show();
            $('#setOffcut').hide();
            $('#cancelEditOffcut').hide();
            $('#offcutCheck').hide();
            CloseWait();
            if (data['type'] != 'error') {
                materialLeftOffcut = data['left'];
                materialTopOffcut = data['top'];
                materialRightOffcut = data['right'];
                materialBottomOffcut = data['bottom'];
                showMessage(LANG['CHANGE-ZNACH-OBPIL-DETAIL'], LANG['WARNING-MUST']);
                var table = document.getElementById('detailsTable');
                if (!$("#table2").hasClass("activeTable")){
                    if (table == null) {
                        draw();
                    } else {
                        showDetails();
                    }
                    showDetailsInfo();
                    init();
                }
                $('#offcutCheck').hide();
            } else {
                $('#offcutCheck').show();
            }
        }
    });
}

function checkOffcut(left, top, right, bottom) {
    var min = 0;
    var max = 20;
    var result = true;
    if ((left < min || left > max) || (top < min || top > max) || (right < min || right > max) || (bottom < min || bottom > max)) {
        result = false;
    }
    return result;
}

function editOffcut() {
    $('#editOffcut').hide();
    $('#setOffcut').show();
    $('#cancelEditOffcut').show();
    $('#left_offcut').val('');
    $('#top_offcut').val('');
    $('#right_offcut').val('');
    $('#bottom_offcut').val('');
    $('#left_offcut').prop('disabled', false);
    $('#top_offcut').prop('disabled', false);
    $('#right_offcut').prop('disabled', false);
    $('#bottom_offcut').prop('disabled', false);
}

function cancelEditOffcut() {
    $('#left_offcut').prop('disabled', true);
    $('#top_offcut').prop('disabled', true);
    $('#right_offcut').prop('disabled', true);
    $('#bottom_offcut').prop('disabled', true);
    $('#editOffcut').show();
    $('#setOffcut').hide();
    $('#cancelEditOffcut').hide();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Materials', action: 'getOffcuts'}),
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $('#left_offcut').val(data['left']);
            $('#top_offcut').val(data['top']);
            $('#right_offcut').val(data['right']);
            $('#bottom_offcut').val(data['bottom']);
        }
    });
}


// $('#offcutsDirection').change(function(){
function setDirectionCut() {
    var direction = $('#offcutsDirection').val();
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Materials', action: 'setCutsDirection', direction: direction}),
        dataType: 'json',
        success: function (data) {
            $('#offcutsDirection').val(data)
            showMessage(LANG['NAPR-SUCCESS-CHANGE']);
            CloseWait();
        }
    });
}
// });

$(document).ready(function () {

    /**
     * Прокрутка вверх
     */
    $('#scrollup img').mouseover(function () {
        $(this).animate({opacity: 1}, 100);
    }).mouseout(function () {
        $(this).animate({opacity: 0.65}, 100);
    }).click(function () {
        $('body, html').animate({scrollTop: 0}, 500);
        return false;
    });

    $(window).scroll(function () {
        if ($(document).scrollTop() > 100) {
            if (menuFixation && $(document).height() - 200 > $(window).height()) {
                $('.projectInfo').addClass('fixPanel');
            }
            $('#scrollup').fadeIn('fast');
        } else {
            $('.projectInfo').removeClass('fixPanel');
            $('#scrollup').fadeOut('fast');
        }
    });

    //Убирает из адресной строки sid в случае перехода из 1С
    if (location.search.indexOf('sid') >= 0) {
        //if IE
        if (navigator.appName == 'Microsoft Internet Explorer' ||
            document.all && !window.chrome) {
            location.search = '?0';
        } else {
            history.pushState({}, '', '?0');
        }

    }
    initFileDownloader('#importCsv');
    initFileDownloader('#importXML');
    initFileDownloader('#convertAstraXml');
    initFileDownloader('#convertWoodyXml');
    initFileDownloader('#convertGibLabXml');
    initFileDownloader('#importProject');

    showMaterialParts();
    initSpoiler();

    var result = '';
    //check if session alive
    setInterval(pinger, 300000);

    console.log('mainjs on ready');
    //updateMenu(); //dublicate method call
    var cc = getDomain();
    GetUserInfo();
    //Not useble code or "duct tape"
    if (cc != getDomain()) {
        location.reload();
    }
    domain = cc.replace(/\"/g, '');
    checkboxMask('label');

});

function getDirectionCut() {
    $.ajax({
        method: 'post',
        url: "system/controllers/JsonController.php",
        data: ({conntroller: 'Materials', action: 'getCutsDirection'}),
        dataType: 'json',
        success: function (data) {
            console.log(data);
            return data;
        }
    });
}

function searchMaterial(val) {
    var materials = $('.item_holder');
    for (var i = 0; i < materials.length; i++) {
        var name = $(materials[i]).find('.name').text();
        var id = $(materials[i]).find('.material-id').text();
        if ((name.toLowerCase().indexOf(val.toLowerCase()) < 0) && (id.indexOf(val) < 0)) {
            $(materials[i]).hide();
        } else {
            $(materials[i]).show();
        }
    }
}

function updateDetailsCount() {
    var span = $('span.selectable');
    var this_int = $('#detailTableBody tr td:nth-child(2) .input_mask_checked').length;
    if (this_int > 0) {
        span.css('display', 'initial');
        // if (this_int % 10 == 1 && this_int != 11) {
        //     span.text(this_int + " деталь.");
        // } else
            if (this_int > 1 && this_int < 5) {
            span.text(this_int + " детали.");
        } else {
            span.text(this_int + " деталей.");
        }
    } else {
        span.css('display', 'none');
        $("#detailsActions").removeClass("Move");
        span.text(this_int + " деталей");
    }
}

function checkboxMask(selector) {
    // console.log('sel = ', selector);
    var parentselect = $(selector);
    var mask = parentselect.find('input[type="checkbox"]');

    mask.wrap('<label></label>');
    var label = '<div class="input_mask"><div class="slide_ribbon"></div></div>';
    var resultoutput = mask.parent(parentselect);
    mask.hide();
    resultoutput.prepend(label);

    mask.change(function () {
        var span = $('span.selectable');
        var this_int = parseInt(span.text().split(" ")[1]);
        var cur = $(this);
        if (cur.prop('checked')) {
            cur.parent(parentselect).find('.input_mask').addClass('input_mask_checked');
        } else {
            cur.parent(parentselect).find('.input_mask').removeClass('input_mask_checked');
        }
        if (cur.hasClass('changeThis')) {
            this_int = $('#detailTableBody tr td:nth-child(2) .input_mask_checked').length;
        } else {
            this_int = 0;
        }
        if (cur.hasClass('changeThis') && span.val() == -1) {
            span.val(0);
            span.css('display', 'initial');
            if ($('#AllDetails').prop('checked')) {
                var temp = $('input[id^=Detail-]').length;
            } else {
                var temp = $('input[id^=Detail-]').length - 1;
            }
            // if (temp % 10 == 1 && temp != 11) {
            //     span.text(temp + " деталь.");
            // } else
                if (temp > 1 && temp < 5) {
                span.text(temp + " детали.");
            } else {
                span.text(temp + " деталей.");
            }
        } else if (cur.hasClass('changeThis') && this_int > 0) {
            span.css('display', 'inline-block');
            $("#detailsActions").addClass("Move");

            // if (this_int % 10 == 1 && this_int != 11) {
            //     span.text(this_int + " деталь.");
            // } else
                if (this_int > 1 && this_int < 5) {
                span.text(this_int + " детали.");
            } else {
                span.text(this_int + " деталей.");
            }
        } else if (cur.hasClass('changeThis')) {
            span.css('display', 'none');
            $("#detailsActions").removeClass("Move");
            span.text(this_int + " деталей");
        }
    });
    checkboxMaskUpdate(selector);
}


function checkboxMaskUpdate(selector) {
    var parentselect = $(selector);
    var mask = parentselect.find('input[type="checkbox"]');
    for (var i = 0; i < mask.length; i++) {
        var cur = $(mask[i]);
        if (cur.prop('checked')) {
            cur.parent(parentselect).find('.input_mask').addClass('input_mask_checked');
        } else {
            cur.parent(parentselect).find('.input_mask').removeClass('input_mask_checked');
        }
    }
}

function initFileDownloader(selector) {
    var form = $(selector);
    var input = form.find('input[type="file"]');
    var btn = form.find('input[type="submit"]');

    btn.click(function (e) {
        var mult = $('#importXML-multiplicity').val();
        e.preventDefault();
        input.click();
        return false;
    });

    input.change(function () {
        //form.submit();
        $('body').append($('<div id="cover_layer"></div>').css({
            position: 'fixed',
            'z-index': 99999999,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
        }));
        ShowWait();
        form.submit();

    });
}


function checkDetailWidth(value) {
    if (materialLeftOffcut == 0 && materialRightOffcut == 0) {
        var maxW = materialWidth;
    } else {
        var maxW = (Number($("#MultiplicityId").val()) > 1) ? maxWidth - indenCrosslinking : maxWidth;
    }
    var val = value > 0 ? value : Number($("#WidthId").val().replace(',', '.')).toFixed(1);
    var h = Number($("#HeightId").val().replace(',', '.')).toFixed(1);
    var minW = (Number($("#MultiplicityId").val()) > 1) ?  (minHeight >= 70 && minHeight < 100 ? minWidthForMultiplicity : minHeightForMultiplicity) : ((h >= Math.max(minWidth, minHeight) || h == 0)
        ? Math.min(minWidth, minHeight)
        : Math.max(minWidth, minHeight));
    if (materialType == 'compact') {
        minHeight = minHeightForCompact;
        minW = Math.max(minWidth, minHeight);
        materialLeftOffcut = 1;
        materialRightOffcut = 1;
        maxW = maxWidthForCompact - (materialLeftOffcut + instrumentW) - (materialRightOffcut + instrumentW);
    }
    if (!$("#TextureId").prop("checked")) {
        if (h <= Math.min(maxW, maxHeight)) {
            maxW = Math.max(maxW, maxHeight);
        } else {
            maxW = Math.min(maxW, maxHeight);
        }
    }
    if (maxDetailSizeLimit > 0 && val > maxDetailSizeLimit && h > maxDetailSizeLimit) {
        hasSuccesError('#Width', '', true, "has-error", "has-success", LANG['BAD-VALUE-GABARIT']+'\n'+ LANG['ONE-OF-VALUE-MUST-BE-MORE'] + maxDetailSizeLimit + 'мм.');
        return false;
    }
    if (val <= maxW && val >= minW) {
        hasSuccesError('#Width', val, false, "has-success", "has-error", '');
        return true;
    } else {
        hasSuccesError('#Width', '', true, "has-error", "has-success", LANG['BAD-VALUE-DLINA']+'\n'+LANG['DLINA-DETAIL-MUST-BE']+':\n'+LANG['OT-S'] + minW + 'мм до ' + maxW + 'мм.');
        return false;
    }
}

/**
 * Проверка на наличие выбраного значения
 *
 * @param elem
 * @returns {boolean}
 */
function hasSelectedValueBySelectElement(elem) {
    var hasSelected = 0;
    elem.find('option').each(function () {
        if ($(this).prop('selected')) {
            hasSelected++;
        }
    });
    return hasSelected > 0 ? true : false;
}
function checkDetailHeight(value) {
    if (materialTopOffcut == 0 && materialBottomOffcut == 0) {
        var maxH = materialHeight;
    } else {
        var maxH = (Number($("#MultiplicityId").val()) > 1) ? maxHeight - indenCrosslinking : maxHeight;
    }
    if (!hasSelectedValueBySelectElement($("#HeightId"))) {
        $("#HeightId>option:first").prop('selected', true);
    }
    var val = value > 0 ? value : Number($("#HeightId").val().replace(',', '.')).toFixed(1);
    var w = Number($("#WidthId").val().replace(',', '.')).toFixed(1);
    var minH = (Number($("#MultiplicityId").val()) > 1) ? minHeightForMultiplicity : ((w >= Math.max(minWidth, minHeight) || w == 0)
        ? Math.min(minWidth, minHeight)
        : Math.max(minWidth, minHeight));
    if (materialType == 'compact') {
        minH = (Number($("#WidthId").val() >= 300) && Number($("#HeightId").val() < 300)) ? minHeightForCompact : minWidthForCompact;
        materialTopOffcut = 1;
        materialBottomOffcut = 1;
        maxH = maxHeightForCompact - (materialTopOffcut + instrumentW) - (materialBottomOffcut + instrumentW);
    }
    if (!$("#TextureId").prop("checked")) {
        if (w <= Math.min(maxWidth, maxH)) {
            maxH = Math.max(maxWidth, maxH);
        } else {
            maxH = Math.min(maxWidth, maxH);
        }
    }
    if (maxDetailSizeLimit > 0 && val > maxDetailSizeLimit && w > maxDetailSizeLimit) {
        hasSuccesError('#Width', '', true, "has-error", "has-success", LANG['BAD-VALUE-GABARIT']+'\n'+LANG['ONE-OF-VALUE-MUST-BE-MORE'] + maxDetailSizeLimit + 'мм.');
        return false;
    }
    if (constructorId == 'stol' && isClientalMaterial && materialType != 'compact') {
        minH = materialHeight;
    }
    if (val <= maxH && val >= minH) {
        var sendVal = '';
        if (constructorId == 'stol' && isClientalMaterial) {
            sendVal = $("#HeightId").val();
        } else {
            sendVal = val;
        }
        hasSuccesError('#Height', sendVal, false, "has-success", "has-error", '');
        return true;
    } else {
        hasSuccesError('#Height', '', true, "has-error", "has-success", LANG['BAD-VALUE-WIDTH']+'\n'+LANG['WIDTH-DETAIL-MUST-BE']+':\n'+LANG['OT-S'] + minH + 'мм до ' + maxH + 'мм.');
        return false;
    }
}
function checkDetailMultiplicity(value) {
    var val = value > 0 ? value : Number($("#MultiplicityId").val());
    if (thickness * val > maxThickness) {
        hasSuccesError('#Multiplicity', 1, true, "has-error", "has-success", LANG['MAX-DOUSK-THICK-DET'] + '\n' + LANG['WIDTH-MUST-BE-NOT-MORE'] + maxThickness + 'мм.');
        return false;
    }
    var min = 1;
    var max = maxMultiplicity;
    var w = Number($("#WidthId").val().replace(',', '.')).toFixed(1);
    var h = Number($("#HeightId").val().replace(',', '.')).toFixed(1);
    if (constructorId == 'dsp') {
        var bool = w * h / 1000000 > maxDetailSquareForMultiplicity;
    }

    if ((!((w >= minWidthForMultiplicity && h >= minHeightForMultiplicity) || (h >= minWidthForMultiplicity && w >= minHeightForMultiplicity)) || bool) && val != 1) {
        hasSuccesError('#Multiplicity', 1, true, "has-error", "has-success", LANG['GABARITS-DETAIL-NO-GLUE']);
        return false;
    }
    if (val >= min && val <= max) {
        hasSuccesError('#Multiplicity', $("#MultiplicityId").val(), true, "has-success", "has-error", '');
        return true;
    } else {
        hasSuccesError('#Multiplicity', '', true, "has-error", "has-success", LANG['COUNTING-SHARS'] + min + ' до ' + max + '.');
        return false;
    }
}
function checkDetailsCount(value) {
    var val = value > 0 ? value : Number($("#CountId").val().replace(',', '.')).toFixed();
    if (val >= 0) {
        hasSuccesError('#Count', val, false, "has-success", "has-error", '');
        return true;
    } else {
        hasSuccesError('#Count', '', true, "has-error", "has-success", LANG['RIGHT-KOLVO-DETAILS']);
        return false;
    }

}

function hasSuccesError(id, val, focus = false, addClass, removeClass, errorMsg = ''){
    if (errorMsg != '') showErrorMessage(errorMsg);
    $(id).addClass(addClass);
    $(id).removeClass(removeClass);
    $(id + "Id").val(val);
    if (focus) $(id + "Id").focus();
}

// Ограничение ввода в поле номера телефона при отправке заявки;
function proverka(input) {
    var value = input.value;
    var rep = /[^0-9]/;
    if (rep.test(value)) {
        value = value.replace(rep, '');
    }
    input.value = value.slice(0, 12);
}

function validateOrderForm(form) {
    var isValid = true;
    var clientName = $('form div.r1 input#clientName');
    var clientPhone = $('form div.r2 input#clientPhone');
    if (!form.name.value) {
        clientName.attr('placeholder', LANG['RIGHT-NAME']);
        clientName.attr('style', 'border-color: red');
        isValid = false;
    } else {
        clientName.attr('style', '');
    }
//    var regExp = new RegExp(form.phone.pattern.replace('/', '//'));
//    if (form.phone.value.match(regExp) == null) {
    var phone = form.phone.value.replace(/[^0-9]/g, '');
    if (isNaN(phone) || !(phone.length >= 9 && phone.length <= 12)) {
        //console.log(phone)
        clientPhone.attr('placeholder', LANG['WRITE-CONTACT-TEL']);
        clientPhone.attr('title', LANG['BAD-CONTACT-NUMBER']);
        clientPhone.attr('style', 'border: 1px solid red');
        $('#inccorect-phone').show();
        isValid = false;
    } else {
        clientPhone.attr('style', '');
        clientPhone.attr('title', '');
        $('#inccorect-phone').hide();
    }
    if(form.delivery.value == '' || form.delivery.value == null){
        $('#delivery').css('border', '3px solid red');
        isValid = false;
    }
    if (form.checkboxForVB && form.checkboxForVB.checked) {
        var numberViyarBazar = $('form div.spoilerVB input#numberViyarBazar');
        var eMailViyarBazar = $('form div.spoilerVB input#eMailViyarBazar');
        var numberVB = form.numberViyarBazar.value.trim();
        var eMailVB = form.eMailViyarBazar.value.trim();
        if (numberVB || eMailVB) {
            var regNumberVB = new RegExp('^\\d+$');
            if (!(numberVB.match(regNumberVB))) {
                numberViyarBazar.attr('placeholder', ' Укажите контактный телефон');
                numberViyarBazar.attr('title', ' Неверно указан контактный телефон');
                numberViyarBazar.attr('style', 'border: 1px solid red');
                $('#inccorect-numberVB').show();
                isValid = false;
            } else {
                numberViyarBazar.attr('style', '');
                numberViyarBazar.attr('title', '');
                $('#inccorect-numberVB').hide();
            }
            if (!(eMailVB.indexOf('@') > -1)) {
                eMailViyarBazar.attr('placeholder', ' Укажите контактный телефон');
                eMailViyarBazar.attr('title', ' Неверно указан контактный телефон');
                eMailViyarBazar.attr('style', 'border: 1px solid red');
                $('#inccorect-eMailVB').show();
                isValid = false;
            } else {
                eMailViyarBazar.attr('style', '');
                eMailViyarBazar.attr('title', '');
                $('#inccorect-eMailVB').hide();
            }
        }
    }

    return isValid;
}


function checkOdkFiles() {
    if ($('#existOdkFilesCheck').attr('checked') && !$('div').hasClass('chooser active') /*&& !$('div').hasClass('active')*/) {
        $('#odkError').show();
        $('#existOdkFiles').hide();
        $('#sendOrderBtn').prop('disabled', true);
    } else {
        $('#odkError').hide();
        $('#existOdkFiles').show();
        $('#sendOrderBtn').prop('disabled', false);
    }
}
function checkToggle(id,height) {

    if (id != 'holesTable') {
        if ($('#' + id).is(':visible') == false) {
            $('#' + height).removeClass('FiveElements');
            return 0;
        } else {
            $('#' + height).addClass('FiveElements');
            return 1;
        }

    } else if (id == 'holesTable') {
        if ($('.' + id).is(':visible') == false) {
            $('#' + height).removeClass('FiveElements');
            return 0;
        } else {
            $('#' + height).addClass('FiveElements');
            return 1;
        }
    }
}
function OnlyFive(id, toggler,page){
    var CheckFlag=checkToggle(page,id);
    if(CheckFlag==1) {
        if ($('#' + id).hasClass('FiveElements') && toggler == 1) {
            $('#' + id).removeClass('FiveElements');
        }
        else if (toggler == 0) {
            $('#' + id).addClass('FiveElements');
        }
        if (toggler == 0) {
            $('#' + id).addClass('FiveElements');
        }
    }
}


function Navi(page, service_constructor,isValidate = true) {
    GetUserInfo();
    if($('div').is(".tabN")) {
        switch (page) {
            case 'cutting':
                document.getElementById('tabCut').classList.add('whiteborder');
                localStorage.setItem('tabAdd', '0');
                if (localStorage.getItem('tabAdd') != null) {
                    localStorage.removeItem("tabAdd");
                }
                if (localStorage.getItem('tabProd') != null) {
                    localStorage.removeItem("tabProd");
                }
                if (localStorage.getItem('tabCost') != null) {
                    localStorage.removeItem("tabCost");
                }
                break;
            case 'additives':
                document.getElementById('tabAdd').classList.add('whiteborder');
                localStorage.setItem('tabAdd', '1');
                if (localStorage.getItem('tabCut') != null) {
                    localStorage.removeItem("tabCut");
                }
                if (localStorage.getItem('tabProd') != null) {
                    localStorage.removeItem("tabProd");
                }
                if (localStorage.getItem('tabCost') != null) {
                    localStorage.removeItem("tabCost");
                }
                break;
            case 'products':
                document.getElementById('tabProd').classList.add('whiteborder');
                localStorage.setItem('tabProd', '2');
                if (localStorage.getItem('tabCut') != null) {
                    localStorage.removeItem("tabCut");
                }
                if (localStorage.getItem('tabAdd') != null) {
                    localStorage.removeItem("tabAdd");
                }
                if (localStorage.getItem('tabCost') != null) {
                    localStorage.removeItem("tabCost");
                }
                break;
            case 'cost':
                document.getElementById('tabCost').classList.add('whiteborder');
                localStorage.setItem('tabCost', '3');
                if (localStorage.getItem('tabCut') != null) {
                    localStorage.removeItem("tabCut");
                }
                if (localStorage.getItem('tabAdd') != null) {
                    localStorage.removeItem("tabAdd");
                }
                if (localStorage.getItem('tabProd') != null) {
                    localStorage.removeItem("tabProd");
                }
                break;
        }
    }

    if(page == 'PersonalLoad' && service_constructor == 'dsp'){
        ShowWait();
    }
    if ((page == "saveToMail" || page == "saveToProject") && isValidate) {
        var validate = $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Details', action: 'hasErrorsForMailAndSave'}),
            dataType: 'json',
            async: false,
            success: function (data) {
                return data;
            }
        });

        validate = validate.responseJSON;
        if (validate['error']) {
            showErrorMessage(validate['error']);
            return false;
        }

        if (validate['warning'] && page !="saveToProject") {
            showConfirmMessage(validate['warning'], function () {
                Navi(page, service_constructor, false);
            });
            return false;
        }
    }
    if(page == 'saveToGoogleDrive'){
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: ({controller: 'Ajax', action: 'saveToGoogleDrive'}),
            success: function (data) {
                return data;
            }
        });
    }

    if (page == 'saveToMail' && !isEditMode()) {
        $.ajax({
            url: "/service/system/views/phone.php",
            dataType: "html",
            cache: false,
            success: function (html) {
                newTopPanel('Заявка',html);
                $('#sendMess').css("display","block");
                $('#sendMess').css("left", "+50%");
                checkboxMask('#online_payment_label');
                checkOdkFiles();
                $('#loadFiles').change(function () {
                    checkOdkFiles();
                });
                $("#dataform .submit").click(function () {
                    var page = 'saveToMail';
                    var form = document.forms.dataform;
                    // if(form.delivery.value == '' || form.delivery.value == null){
                    //     showErrorMessage('Выберите пожалуйста Филиал отгрузки');
                    //     return;
                    // }

                    if (!validateOrderForm(form)) {
                        return false;
                    }

                    var chooser = $(form).find('div.r6').find('div.chooser').find('input');

                    var formData = new FormData();
                    formData.append("controller", "Ajax");
                    formData.append("action", "sendOrder");
                    formData.append("name", form.name.value);
                    formData.append("phone", form.phone.value);
                    if ($('#online_payment').prop('checked')) {
                        var onlinePayment = true;
                        formData.append('onlinePayment', true);
                    }
                    if (form.delivery) {
                        formData.append("delivery", form.delivery.value);
                    }
                    if (form.payment) {
                        formData.append("payment", form.payment.value);
                    }
                    formData.append("message", form.message.value);
                    if (form.checkboxForVB) {
                        var isViyarBazar = form.checkboxForVB.checked;
                        if (isViyarBazar) {
                            var numberVB = form.numberViyarBazar.value.trim();
                            var eMailVB = form.eMailViyarBazar.value.trim();
                            formData.append("isViyarBazar", isViyarBazar);
                            formData.append("numberViyarBazar", numberVB);
                            formData.append("eMailViyarBazar", eMailVB);
                        }
                    }
                    for (var i = 0; i < chooser.length - 1; i++) {
                        formData.append("file-" + i, chooser[i].files[0]);
                    }
                    $('#sendOrderBtn').prop('disabled', true);
                    page = onlinePayment ? 'onlinePayment' : page;
                    // console.log(page);
                    ShowWait();
                    $.ajax({
                        method: 'post',
                        url: "system/controllers/JsonController.php",
                        data: formData,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            CloseWait();
                            if (data.type == 'error') {
                                showErrorMessage(data.msg);
                                $('#sendOrderBtn').prop('disabled', false);
                            } else {
                                $("#log").html(LANG['WAITING-SERVER']);
                                ReloadPage(page);
                                localStorage.removeItem('tab3');
                            }
                        }
                    });
                });



            }
        });
    } else if (page == 'Clear') {
        showConfirmMessage(LANG['DELETING-CONFIRM'], function () {
            ReloadPage(page, service_constructor);
            sessionStorage.removeItem('firstModal');
            sessionStorage.removeItem('modal-left');
            sessionStorage.removeItem('modal-top');
            localStorage.removeItem('check_table');
        });
        //if (confirm("Все данные будет удалены. Вы уверены?")) {
        //    ReloadPage(page, service_constructor);
        //}
    }
    else {
        ReloadPage(page, service_constructor);
    }
}


function ReloadPage(page, service_constructor) {
    if ($("#customerMaterial").length > 0) {
        if ($('#customerMaterial')[0].checked) {
            var customerMaterial = 1;
        } else {
            customerMaterial = 0;
        }
    } else {
        customerMaterial = 0;
    }
    $.post("system/controllers/JsonController.php", {
            'controller': 'Ajax',
            'action': 'setPage',
            'setPage': page,
            'customerMaterial': customerMaterial,
            'service_constructor': service_constructor ? service_constructor : ''
        },
        function (data) {
            //console.log(data);
            window.location = '';
        });
    return false;
}
function ChangeTab(id) {
    window.ChangeTab.id = id;
    if (id == '1') {
        $(".manual").removeClass("active");
        $(".site").addClass("active");
        $("#tab-1").show();
        $("#tab-2").hide();
    }
    if (id == '2') {
        $(".site").removeClass("active");
        $(".manual").addClass("active");
        $("#tab-2").show();
        $("#tab-1").hide();
        $("#items_container").hide();
    }
}
function updateMenu() {
    console.log('updateMenu');
    var def = $.Deferred();
    $('#main-menu').load("system/views/inc/menu.php", function () {
        $("#saveToFile-button").click(function () {
            $(".drop-down.save").toggle();
        });

        $(".drop-down.save .file").click(function () {
            Navi('saveToProject');
            $(".drop-down.save").toggle();
        });

        $(".drop-down.save .personal").click(function () {
            savePersonal();
            $(".drop-down.save").toggle();
        });
        def.resolve();
    });
    return def.promise();
}

function confirmSavePersonal() {
    showConfirmMessage(LANG['PRED-COPY-DELETE-CONFIRM'], savePersonal);
}

function savePersonal() {
    GetUserInfo();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Ajax', 'action': 'saveToPersonal'}),
        dataType: 'json',
        success: function (data) {
            //console.log(data)
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                showMessage(LANG['SAVED-PROJECT']);
            }
        }
        //complete: function (data) {
        //    console.log(data);
        //}
    });
}

function showHelp(section) {
    var section = section || 'index';
    window.open('doc/?s=' + section);
}
function showSupp() {
    $('#modal_TEH').css("display","block");
    $('#modal_TEH').css({"left": "+50%","top":"+50%","margin-top":"-96px","margin-left":"-155px"});
    // $('#modal_TEH').draggable();
}
// function getDiscountChecked(){ //button discount in 'raskroy'
//     var val = false;
//     val = $('#discount-cb').prop('checked');

//     return val;
// }

/*  */
function makeTestProgram(){
    $.ajax({
        type: "POST",
       // dataType: 'json',
        url: "system/controllers/JsonController.php",
        data: {'controller': 'Ajax', 'action': 'makeTestProgram'},
        success: function (data) {
            console.log(data);
        //     $.ajax({ type: "POST", 
        //    // dataType: 'json',
        //      url: "system/models/lab/lab.php", 
        //      data: {data},
        //       success: function (res) {
        //         console.log('success',res)
        //     },error : function (er) {
        //         console.log('error',er)
        //     }});
        },
    });
}

function showCost() {
    //var discount = getDiscountChecked(); // get if checkBox discount checked
    //console.log('discount: '+discount);
    ShowWait();
    //$.post("?page=saveTo", {'action': 'recalc', 'discount':discount},
    $.post("?page=saveTo", {'action': 'recalc'},
        function (data) {
                //
            // console.log(data);
            // console.log(data == false);
            if (data == false) {
                showErrorMessage(LANG['NO-CONNECTION-SERVER-TRY-LATER']);
            }
            CloseWait();
            $('#cost').html(data);
            $("#pdfref").load("/service/system/views/cost/index.php #savePDF");
        });
    // $.post("/service/system/views/cost/index.php", {'action': 'recalc'},
    //     function (data) {
    //         //
    //         // console.log(data);
    //         // console.log(data == false);
    //         if (data == false) {
    //             showErrorMessage('Отсутствует соединение с сервером, попробуйте немного позже');
    //         }
    //         CloseWait();
    //
    //         // $('#pdfref').html(data);
    //     });

}


/*Валидация полей форм и вывод сообщений под полем*/
// TODO Сделать проверку существует ли поле в которое выводится ошибка, и если нет, то создать это поле после текущего элемента (это даст возможность не указывать в коде поле для ошибок)
function validateField($elm, required_text, validation_text) {
    var emptyStringRegEx = /^\s*$/;
    var floatRegEx = /^\d+[\.,]{0,1}\d*$/;
    var floatsignedRegEx = /^[+-]?\d*[\.,]?\d*$/;
    var integerRegEx = /^\d+$/;
    var integersignedRegEx = /^[+-]?\d+$/;
    var type = $elm.attr('data-validator');
    var errid = $elm.attr('data-errormessage');// задается без суфикса _err
    var required = $elm.prop('required');
    var id = errid ? errid : $elm.prop('id');
    var result = false;
    var field = type;
    if(['float', 'floatsigned', 'integer', 'integersigned'].indexOf(type) !== -1){
        var field = 'text';
        RegEx = eval(type+'RegEx');
        //console.log(RegEx);
    }
    //console.log($elm.length + ' | type: ' + type + ' | required: ' + required + ' | id: ' + id);

    switch (field) {
        case 'text':
            if (emptyStringRegEx.test($elm.val().trim())) {
                if (required) {
                    show_fld_err(id,required_text);
                }
                else {
                    hide_fld_err(id);
                    result = true;
                }
            }
            else {
                if (RegEx.test($elm.val().trim())) {
                    hide_fld_err(id);
                    result = true;
                }
                else {
                    show_fld_err(id,validation_text);
                }
            }
            break;

        case 'radio':
            if(!$elm.is(':checked')){
                if(required) {
                    show_fld_err(id,required_text);
                }
            else {
                    hide_fld_err(id);
                    result = true;
                }
            }else{
                hide_fld_err(id);
                result = true;
            }
            break;

        case 'select':
            if($elm.val()==0){
                if(required) {
                    show_fld_err(id,required_text);
                }
                else {
                    hide_fld_err(id);
                    result = true;
                }
            }else{
                hide_fld_err(id);
                result = true;
            }
            break;
    }

    return result;
};

function oneOfTwo($elm1,$elm2,id,nozero) {
    if((isEmpty($elm1.val().trim()) || (nozero && $elm1.val()==0)) && (isEmpty($elm2.val().trim()) || (nozero && $elm2.val()==0))){
        show_fld_err(id, LANG['ONE-OF-THE-VALUES-MUST-BE-SPECIFIED']);
        return false;
    }
    else{
        hide_fld_err(id);
        return true;
    }
}

function isEmpty(a){
    return /^\s*$/.test(a);
}

function show_fld_err(id,msg){
    $('#' + id).addClass("fld_err");
    $('#' + id + '_err').html(msg).show();
}
function hide_fld_err(id){
    $('#' + id).removeClass("fld_err");
    $('#' + id + '_err').html('').hide();
}

function newTopPanel(title,content){
    $('#sendMess .topmodal .madalText').text(title);
    switch (typeof content) {
        case 'object':
            $('#sendMess .boxmain').html('');
            $('#sendMess .boxmain').append(content);
            break;
        case 'string':
            $('#sendMess .boxmain').html(content);
            break;
    }
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
        $("#details-tabel").removeClass("disableElement");
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
    document.getElementById('top-panel').classList.remove('rezin');
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
function showWarningMessage(message) {
    /*
     Замена традиционного Alert. для показа сообщений об предупреждениях
     */
    showTopPanel(LANG['WARNING'], message);
    $(window).off('keydown');
    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27)
            $('button.btn-danger.closebutton').trigger('click');
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
        $('span.selectable').text( 0 + " деталей.");
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
function ShowEdgesForChange(thickness, id) {
    showTopPanel(LANG['CHANGE-KROMK']);
    //console.log("id",id);
    var bodyMsg = $('#top-panel .panel-body');
    document.getElementById('top-panel').classList.add('rezin');
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "system/controllers/JsonController.php",
        data: {'controller': 'Ajax', 'action': 'GetEdgesByThickness', 'thickness': 0},
        success: function (data) {
            var functional = JSON.parse(data);
            //console.log("thick",thickness);
            //console.log("res",functional);
            bodyMsg.html('<div id="search_for_change"><label for="changing_art">'+LANG['CODE-KROMKA']+' </label><input class="art" type="number" id="changing_art"><input type="button" class="btn-default Modalbtn" id="changer"  onclick="ShowEdgeForChange(' + id + ')" value="'+LANG['FIND-CROMKA']+'"></div>');
            bodyMsg.append('<div id="otherEdgesList" style="position: relative;overflow-y: scroll;max-height: 50vh;"></div>');
            bodyMsg.css('margin', '0');
            for (var i = 0; i < functional.photo.length; i++) {
                if (functional.id[i] != id)
                    if (functional.name[i].match(/Заказ/) !== null) {
                        bodyMsg.find('#otherEdgesList').append('<div class="item_holder" onclick="changeEdge(' + functional.id[i] + ',' + id + ')"><div class="item_img" ><img  alt="" src=' + functional.photo[i] + ' /></div><div class="name">' + functional.name[i] + '</div></div>');
                    } else {
                        bodyMsg.find('#otherEdgesList').append('<div class="item_holder" onclick="changeEdge(' + functional.id[i] + ',' + id + ')"><div class="item_img" ><img  alt="" src=' + functional.photo[i] + ' /></div><div class="name">' + functional.name[i] + '</div><div class="material-id">' + functional.id[i] + '</div></div>');
                    }
            }
        },
        error: function () {
            //console.log('Error');
        }
    });
}
function ShowEdgeForChange(id) {

    var tmp = $('#changing_art').val();
    var art = parseInt(tmp);

    var bodyMsg = $('#top-panel .panel-body');
    if (art == id) {
        bodyMsg.find('#otherEdgesList').empty();
        bodyMsg.find('.not_found').empty();
        bodyMsg.append('<div class="not_found"><p id="not_found_text">'+LANG['CURRENT-KROMKA-USED-CODE']+'</p></div>');
        return;
    }
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "system/controllers/JsonController.php",
        data: {'controller': 'Ajax', 'action': 'GetEdgeProperties', 'article': art},
        success: function (data) {
            var functional = JSON.parse(data);
            //console.log(functional);
            bodyMsg.empty();
            bodyMsg.html('<div id="search_for_change"><label for="changing_art">'+LANG['CODE-KROMKA']+' </label><input class="art" type="text" id="changing_art"><input type="button" class="btn-default Modalbtn" id="changer" onclick="ShowEdgeForChange(' + id + ')" value="'+LANG['FIND-CROMKA']+'"></div>');
            bodyMsg.append('<div class="item_holder" onclick="changeEdge(' + functional.id + ',' + id + ')"><div class="item_img"><img alt="" src=' + functional.photo + ' /></div><div class="name">' + functional.name + '</div><div class="material-id" hidden>' + functional.id + '</div></div>');
        },
        error: function (data) {
            //console.log(data);
            //console.log('Error');
            bodyMsg.find('#otherEdgesList').empty();
            bodyMsg.find('.not_found').empty();
            bodyMsg.append('<div class="not_found"><p id="not_found_text">'+LANG['KRAIKA-ZAD-CODE-NOT-FOUND']+'</p></div>');
        }
    });
}
function changeEdge(edge_id, old_id) {
    var art = parseInt(edge_id);

    if (art > 1000) {
        ShowWait();
        $.post("system/controllers/JsonController.php", {
                'controller': 'Ajax',
                'action': 'testEdgeForError',
                'art': art
            },
            function (data) {
                if (data.type == 'error') {
                    CloseWait();
                    showErrorMessage(data.msg);
                } else if (data.length != 0) {
                    ShowWait();
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "system/controllers/JsonController.php",
                        data: ({controller: 'Ajax', action: 'ChangeEdgeOperations', edge_id: edge_id, old_id: old_id}),
                        success: function (data) {
                            if(data[0] != data[1]){
                                showWarningMessage(LANG['WAS-CHOOSED-WIDTH-THICK'],true);
                            }
                            $("#sel-edges").load('/service/templates/edges_list.php');
                            $('#slideup').click();
                            if(typeof draw == 'function'){
                                draw();
                            }
                            if(typeof showDetails == 'function'){
                                showDetails();
                                setEdgeSelectors();
                            }
                            CloseWait();
                        },
                        error: function () {
                            location.reload();
                        }
                    });
                }
            }, 'json');
            CloseWait();
    } else {
        showErrorMessage(LANG['CHECK-CODE-RIGHT']);
    }
}
/**
 Скрывает все сообщения с экранов
 */
function hideMessage() {
    $('#top-panel-div').hide();
    $(window).off('keydown');
}
function showTopFormForEdit(container_id, form_id, div_id, overlay, offset) {
    var div_id = div_id || "top-panel";
    var overlay = overlay || "top-panel-div";
    var title = $('#' + container_id + ' .panel-title').text();
    var form = $('#' + form_id);
    $('#' + div_id + ' .panel-title').text(title);
    $('#' + div_id + ' .panel-body').html('');
    $('#' + div_id + ' .panel-body').append(form);
    $('#' + overlay).show();
//    var y = ($('#top-panel-div').height() - $('#'+div_id).height()) / 3;
//    var y = (parent.window.frames[0]? parent.window.frames[0].pageYOffset + parent.window.pageYOffset : window.pageYOffset) + 50;
//    var x = ($('#top-panel-div').width() - $('#'+div_id).width()) / 2;
    //$('#'+div_id).offset({ top: y, left: x});
    //console.log($('#'+div_id).height());
    var top = offset - $('#' + div_id).height() / 1.5 - $(window).scrollTop();
    if (top < 10) top = 10;
    else if (top + $('#' + div_id).height() > $(window).height()) top = $(window).height() - $('#' + div_id).height() - 10;
    //console.log($(window).height());
    $("#addButton").val(LANG['SAVE']);

    form.submit(function () {
        $('#preset_item_box').append(form);
        hideTopPanel(overlay);
    });
    $(".closebutton").click(function () {

        $('#preset_item_box').append(form);
        hideTopPanel(overlay);
    });
}
function ShowWait() {
    $("#wait").show();
}
function CloseWait() {
    $("#wait").hide();
}

function showMaterialParts() {
    $('#material_parts').load('/service/system/views/material/material-parts.php');
}

function showMaterialPartForm(width, height, quantity) {
    $.post('/service/system/views/material/material-part-form.php',
        {
            width: width ? width : '',
            height: height ? height : '',
            quantity: quantity ? quantity : '',
        },
        function (data) {
            showTopPanel(LANG['ADDING-LIST-MAT'], data);
            if(constructorId == "stol"){
                // $("#partHeightId").val(materialHeight);
                // $("#partHeightId").prop( "disabled", true );
            }
        });
}

function addMaterialPart(width, height, quantity) {
    $.post('/service/system/controllers/JsonController.php',
        {
            controller: 'Ajax',
            action: 'addMaterialPart',
            width: Number(width),
            height: Number(height),
            quantity: quantity ? quantity : 1
        },
        function (data) {
            if (Number(data)) {
                $('#material_size').css('text-decoration', 'line-through');
                $('#HeightId').append('<option value="' + Number(height) + '">' + Number(height) + '</option>');
            } else {
                $('#material_size').css('text-decoration', 'none');
            }

            var width = parseFloat($("#partWidthId").val());
            var height = parseFloat($("#partHeightId").val());
            if (width % 5) {
                showErrorMessage(LANG['SIZE-LONG-LIST-KRAT-5']);
            }
            if (height % 5 && materialType != 'compact') {
                showErrorMessage(LANG['SIZE-WIDTH-LIST-KRAT-5']);
            }

            showMaterialParts();
            updateMenu();
        });
}

function delMaterialPart(width, height) {
    $.post('/service/system/controllers/JsonController.php',
        {
            controller: 'Ajax',
            action: 'delMaterialPart',
            width: Number(width),
            height: Number(height)
        },
        function (data) {
            if (Number(data)) {
                $('#material_size').css('text-decoration', 'line-through');
                let html = "";
                for (let i = 0; i < $('#HeightId option').length; i++) {

                    if (parseInt($('#HeightId option')[i].innerText) !== parseInt(height)) {
                        html += '<option value="' + $('#HeightId option')[i].innerText + '">' + $('#HeightId option')[i].innerText + '</option>';
                    }
                }
                $('#HeightId').empty().append(html);
            } else {
                $('#material_size').css('text-decoration', 'none');
            }
            showMaterialParts();
            updateMenu();
        });
}

function setMaterialPart(width, height, quantity) {
    $.post('/service/system/controllers/JsonController.php',
        {
            controller: 'Ajax',
            action: 'setMaterialPart',
            width: Number(width),
            height: Number(height),
            quantity: quantity ? quantity : 1
        },
        function (data) {
            if (Number(data)) {
                $('#material_size').css('text-decoration', 'line-through');
            } else {
                $('#material_size').css('text-decoration', 'none');
            }
            showMaterialParts();
            updateMenu();
        });
}

function markerManager(id, marker) {
    //console.log(id, marker);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'changeMarker', id: id, marker: Number(marker)}),
        success: function (data) {
            //console.log(data);
            if (typeof showDetails == 'function') {
                showDetails();
            }
        }
    });
}

function decoratedSideManager(id, decoratedSide) {
    //console.log(id, decoratedSide);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'changeDecoratedSide', id: id, decoratedSide: decoratedSide}),
        dataType: 'json',
        success: function (data) {
//            console.log(data);
            if (data.type == 'warning') {
                showWarningMessage(data.msg);
            }
            if (typeof showDetails == 'function') {
                showDetails();
            }
            if (typeof draw == 'function') {
                draw();
            }
        }
    });
}

function decoratedSideManagerMultiple(decoratedSide) {
    //console.log(decoratedSide);
    var details_id = getSelectedDetails();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Cutting',
            action: 'changeDecoratedSides',
            details_id: details_id,
            decoratedSide: decoratedSide
        }),
        success: function (data) {
            if (typeof showDetails == 'function') {
                showDetails();
            }
            $('#choose_decorated_side-div').hide();
        }
    });
}

function sortTable(tableId, columnName, direction, contentType) {
    var tbody = $('#' + tableId + ' tbody');
    var column = columnName || '';
    var direction = direction || 'asc';
    tbody.find('tr').sort(function (a, b) {
        var tda = $(a).find('span[id="' + column + '"]').text();
        var tdb = $(b).find('span[id="' + column + '"]').text();
        contentType = contentType ? contentType : isNaN(parseInt(tda)) ? 'text' : 'num';
        switch (contentType) {
            case 'num':
                return direction == 'asc' ? parseFloat(tda) - parseFloat(tdb) : parseFloat(tdb) - parseFloat(tda);
                break;
            default:
                return ( direction == 'asc' ? tda > tdb : tda < tdb ) ? 1
                    : ( direction == 'asc' ? tda < tdb : tda > tdb ) ? -1
                        : 0;
        }
    }).appendTo(tbody);

    if (tableId == 'detailsTable') {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: "controller=Cutting&action=saveSort&sortColumn=" + columnName + "&sortDirection=" + direction + "&sortTypeContent=" + contentType,
            success: function (data) {
                //console.log(data)
            }
        });

    }

}
// $(document).ready(function () {
//     if(sessionStorage.getItem('direction') != null){
//         $("#holesTableSortDirection").val(sessionStorage.getItem('direction'));
//     }
//     $("#holesTableSortDirection").change(function () {
//         alert("qwe");
//         if($("#holesTableSortDirection").val() != sessionStorage.getItem('direction')){
//             sessionStorage.setItem('direction',$("#holesTableSortDirection").val());
//         }
//     });
// });
function getDetailSVG(dKey, svgW, svgH) {
    var dKey = (dKey >= 0) ? dKey : detailKey;
    var w = (svgW >= 0) ? svgW : 500;
    var h = (svgH >= 0) ? svgH : 500;
    // var rect = ($('#rectangles').prop('checked', true)) ? 1 : 0;
    // console.log('rect = ', rect);
    return $.ajax({
        type: "POST",
        url: "/service/system/controllers/MainController.php",
        data: "controller=Ajax&action=getSvg&detail_key=" + dKey + "&h=" + h + "&w=" + w + "&rectangles" + rect,
        dataType: "xml",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
}
function eventOnChange(id) {
    GetUserInfo();

    //setActualHeight();

    return true;
}

function backupProject() {
    $.post("system/controllers/JsonController.php",
        {'controller': 'Ajax', 'action': 'backup'},
        function (data) {
            //console.log(data)
        }
    );

}

function setActualHeight() {
    var iframe = $('#designers', parent.document.body);
    iframe.height($(document.body).height() + 36);
    //iframe.animate({'height' : $(document.body).height()  + 36 + 'px'});
    //iframe.height($('html').height());
    //console.log('setHeight ' + $('html').height() );
}

function parseURL() {
    var ret = {};
    window.location.search.slice(1).split('&').forEach(function (item, i, all) {
        elem = item.split('=');
        ret[elem[0]] = elem[1];
    });
    return ret;
}

function GetUserInfo() {
    top.postMessage('getuserinfo', '*');
}

function SetUserInfo(user) {
    if (user.length > 0) {
        $.post("system/controllers/JsonController.php", {'controller': 'Ajax', 'action': 'setUserInfo', 'user': user},
            function (data) {

            });
        return true;
    }
}


function getIsGoogleAuthLoad() {

    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Ajax', "action": "getIsGoogleAuthLoad"},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            window.isGoogleAuthLoad = data;
        }
    }).responseText;
}

function getIsGoogleAuthSave() {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Ajax', "action": "getIsGoogleAuthSave"},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            window.isGoogleAuthSave = data;
        }
    }).responseText;
}


function getOriginForGoogle() {
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Ajax', "action": "getOriginForGoogle"},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            window.originForGoogle = data;
        }
    }).responseText;
}


function receiveMessage(event) {

    if (!(event.origin.indexOf("viyar.ua") != -1 || event.origin.indexOf("viyar.by") != -1 || event.origin.indexOf("localhost") != -1
        || event.origin.indexOf(":8080") != -1 || event.origin.indexOf(":81") != -1)) {
        return;
    }

    if (event.data.indexOf("pdfPrint") != -1) {
        var tmpData = event.data.replace("pdfPrint",'');
        //console.log(data);

        var win = window.open();

        win.document.write('<html><head><title>Раскрой в PDF</title>');
        win.document.write('</head><body >');
        win.document.write('<iframe src="' + tmpData + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; ' +
            'right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        win.document.write('</body></html>');
        win.document.close();

        return;
    }

    if (event.data.indexOf("isGoogleAuth") != -1) {
        getIsGoogleAuthLoad();
        getIsGoogleAuthSave();

        if (window.isGoogleAuthLoad.indexOf("true") != -1) {
            getOriginForGoogle();
            var link = window.originForGoogle.slice(1).slice(0, -1) + "/designers";
            window.location.href = link;
            return;
        }

        if (window.getIsGoogleAuthSave.indexOf("true") != -1) {
            getOriginForGoogle();
            var link = window.originForGoogle.slice(1).slice(0, -1) + "/designers";
            window.location.href = link;
            return;
        }
    }

    try {
        var mess = JSON.parse(event.data);
    } catch (e) {
        var mess = null;
        console.log('Не удалось декодировать JSON в сообщении.');
    }

    if (mess && mess.comm == 'userinfo') {
        setDomain(event.origin.replace(/http(s)?:\/\//, ''));
        setOriginForGoogle(event.origin);
        SetUserInfo(mess.user);
    }

    //
//  event.source.postMessage("hi there yourself!  the secret response " +
//                           "is: rheeeeet!",
//                           event.origin);
}

window.addEventListener("message", receiveMessage, false);

function setDomain(domain) {
    $.post("system/controllers/JsonController.php", {'controller': 'Ajax', 'action': "setDomain", 'origin': domain},
        function (result) {
        });
}

function setOriginForGoogle(domain) {
    $.post("system/controllers/JsonController.php", {
            'controller': 'Ajax',
            'action': "setOriginForGoogle",
            'origin': domain
        },
        function (result) {
        });
}


function getDomain() {
    return $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Ajax', "action": "getDomain"},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
}


function getSiteUrl() {
    return $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Ajax', "action": "getSiteUrl"},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
}


function pinger() {
    $.post("system/controllers/JsonController.php", {'controller': 'Ajax', 'action': 'pinger', 'ping': "1"},
        function (result) {
        });
}

function DelEdgeManager(article, force) {
    if (force) {
        DelEdge(article);
    } else {
        showConfirmMessage(LANG['DELETE-CROMKA-DETAIL'], DelEdge, article);
    }
}

function setEdgeList(data) {
    if (!data.length) {
        edgeList = [];
    } else {
        edgeList = data;
    }
}

function DelEdge(article) {
    //var force = force || confirm("Удалить кромку? Нанесенная на детали кромка будет убрана.");
    //if (force) {
    for (i in edgeList) {
        if (article == edgeList[i]['guid']) {
            edgeList.splice(i, 1);
            break;
        }
    }
    $.post("system/controllers/MainController.php", {'controller': 'Ajax', 'action': 'delEdge', 'article': article},
        function (data) {
            $("#sel-edges").html(data);
            $("#sel-edges .item-top").css('display', 'block');
            $('.dropdown').removeClass('rotated');
            CloseWait();
            $("#gobutton").show();
            if (typeof setEdgeSelectors == 'function') {
                setEdgeSelectors();
            }
            if (typeof showDetails == 'function') {
                showDetails();
            }
            if (typeof draw == 'function') {
                draw();
            }
        });
    //}
    //console.log('edgeList = ', edgeList);
}
// Функции для проверки текущего браузера
function isFirefox() {
    return Boolean(navigator.userAgent.match(/Firefox/));
}
function isOpera() {
    return Boolean(navigator.userAgent.match(/OPR/));
}
function isChrome() {
    return ( Boolean(navigator.userAgent.match(/Chrome/)) && !Boolean(navigator.userAgent.match(/OPR/)) );
}
function isSafari() {
    return ( Boolean(navigator.userAgent.match(/Safari/)) && !Boolean(navigator.userAgent.match(/Chrome/)) );
}
function isIE() {
    return Boolean(navigator.userAgent.match(/MSIE/));
}
function getUserAgentName() {
    if (isFirefox()) return 'Firefox';
    if (isOpera()) return 'Opera';
    if (isChrome()) return 'Chrome';
    if (isSafari()) return 'Safari';
    if (isIE()) return 'IE';
    return 'Unknown';
}

function isEditMode() {
    return (getMode() == '"edit"');
}
function getMode() {
    return $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {controller: 'Constructor', action: 'getMode'},
        dataType: "text",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
}

function initSpoiler() {
    var cont = $('div.spoiler');

    cont.find('>p').click(function () {
        var ul = $(this).parent().find('>ol');
        if (!$(this).parent().hasClass('open')) {
            open(ul);
        } else {
            close(ul);
        }
    });

    function open(ul) {
        ul.slideDown(200);
        ul.closest('.spoiler').addClass('open');
    }

    function close(ul) {
        ul.slideUp(200);
        ul.closest('.spoiler').removeClass('open');
    }

    close(cont.find('ol'));
}

function getCutting(n) {
    var w = 768;
    var h = 576;
    return $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: "controller=Ajax&action=getCutting&key=" + n + "&w=" + w + "&h=" + h,
        dataType: "xml",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
}

function inputCalc(elem, points = 1) {
    var preparedValue;
    points = constructorId === 'steklo' ? 0 : points;
    if (elem.val() !== '') {
        if (!hasSelectedValueBySelectElement(elem)){
            elem.find('option:first').prop('selected', true);
        }
        var val = elem.val();
        if (isNaN(Number(val))) {
            preparedValue = eval(val.replace(/,/g, '.'));
            val = constructorId === 'steklo' ? Math.floor(preparedValue) : preparedValue.toFixed(points);
        } else{
            preparedValue = parseFloat(val.replace(/,/g, '.'));
            val = constructorId === 'steklo' ? Math.floor(preparedValue) : preparedValue.toFixed(points);
        }
        elem.val(val);
    }
}

function printDetailList() {
    var type = $('#detailsTableSortColumn').val();
    var dir = $('#detailsTableSortDirection').val();
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var newWin = window.open("");
    var sizeType = this.className;
    var data = {
        type:type,
        dir:dir,
        sizeType:sizeType,
    };
    $.ajax({
        method: 'get',
        url: '/service/system/views/cutting/inc/tableDetailsPrint.php',
        dataType: 'text',
        data:data,
    }).success(function (data) {
//        var iframe = $('<iframe id="print_frame">');
//        $('body').append(iframe);
//        $(iframe[0].contentWindow.document.body).append(data);
//        var head = $(iframe[0].contentWindow.document.body).find('.detailTableHead');
//        var stroke = $(iframe[0].contentWindow.document.body).find('#detailTableBody tr');
//        for (var i = 0; i < stroke.length; i++) {
//            if (i % 25 == 0 && i != 0) {
//                $(stroke[i]).after(head.clone());
//            }
//        }
//        $(iframe[0].contentWindow.document.body).find('table').css({
//            'border-spacing': 0,
//            'border-collapse': 'collapse'
//        });
//        iframe[0].contentWindow.print();
        $('body').append("<div style='display:none' id='tmpTableForPrint'></div>");
        $("#tmpTableForPrint").html(data);
        sortTableForPrint(type,dir);
        var tableSorted = document.getElementById("tmpTableForPrint").innerHTML;
        newWin.document.write(tableSorted);
        newWin.print();
        if(isChrome){
            setTimeout(function () { newWin.close(); }, 100);
        }else{
            newWin.close();
        }
        $('#tmpTableForPrint').remove();
    });
}

function sortTableForPrint(columnName, direction, contentType) {
    var tbody = $('#detailTableBodyForPrint');
    var column = columnName || '';
    var direction = direction || 'asc';
    tbody.find('tr').sort(function (a, b) {
        var tda = $(a).find('span[id="' + column + '"]').text();
        var tdb = $(b).find('span[id="' + column + '"]').text();
        contentType = contentType ? contentType : isNaN(parseInt(tda)) ? 'text' : 'num';
        switch (contentType) {
            case 'num':
                return direction == 'asc' ? parseFloat(tda) - parseFloat(tdb) : parseFloat(tdb) - parseFloat(tda);
                break;
            default:
                return ( direction == 'asc' ? tda > tdb : tda < tdb ) ? 1
                    : ( direction == 'asc' ? tda < tdb : tda > tdb ) ? -1
                        : 0;
        }
    }).appendTo(tbody);
}

function printDetails(detail_keys) {
//    showMessage('Данные отправлены на печать. Для продолжения работы завершите процесс печати или закройте вкладку распечатки');
    newWin = window.open("");
    var timer = setInterval(function() { 
        if(newWin.closed) {
            clearInterval(timer);
            copyWindow = window.open(window.location.href);
            window.close();
        }
    }, 1000);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/MainController.php",
        data: ({
            controller: 'Ajax',
            action: 'printDetailsInfo',
            keys: detail_keys,
        }),
        dataType: 'html',
        async: false,
        //complete: function (data) {
        //    console.log(data)
        //},
        success: function (data) {
            $('#detailsActions').val('');
            newWin.document.write(data);
            setTimeout(function () {
                newWin.document.close();
                newWin.focus();
                newWin.print();
                newWin.close();
            }, 1500);
        }
    });

}

function printDetailsWithMiniatures(detail_keys) {
//    showMessage('Данные отправлены на печать. Для продолжения работы завершите процесс печати или закройте вкладку распечатки');
    var newWin = window.open("");
    var timer = setInterval(function() { 
        if(newWin.closed) {
            clearInterval(timer);
            copyWindow = window.open(window.location.href);
            window.close();
        }
    }, 1000);

    $.ajax({
        type: "POST",
        url: "/service/system/controllers/MainController.php",
        data: ({
            controller: 'Ajax',
            action: 'printDetailsInfo',
            keys: detail_keys,
        }),
        dataType: 'html',
        async: false,
        success: function (data) {
            newWin.document.write(data);
            setTimeout(function () {
                newWin.document.close();
                newWin.focus();
                newWin.print();
                newWin.close();
            }, 500);

       /*     $("#divForPrintWithMiniatures").remove();
            var div = document.createElement("div");
            div.setAttribute("id", "divForPrintWithMiniatures");
            div.setAttribute("name", "divForPrintWithMiniatures");
            div.setAttribute("style", "display:none");
            document.body.appendChild(div);
            var html_string = data + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class='col-xs-12'>  <div id='miniatures'></div>  </div>";
            $('#divForPrintWithMiniatures').html(html_string);
            newTab = document.getElementById("divForPrintWithMiniatures").innerHTML;
            newWin.document.write(newTab);
            $('#detailSelectMachine').val($('#detailSelect').val());
            console.log('getDetail');
            $.ajax({
                type: "POST",
                url: "/service/system/controllers/JsonController.php",
                dataType: 'json',
                data: ({controller: 'Additives', action: 'getDetail', detail_key: $('#detailSelect').val()}),
                success: function (data) {
                    console.log('getDetail');
                    initMiniatureForPrint(data);
                    $("canvas").each(function (index) {
                        $(this).attr("id", "canvas" + index);
                        var canvas = document.getElementById("canvas" + index);
                        var img = canvas.toDataURL("image/png");
                        $(this).parent().append("<img src='" + img + "'>");
                        $(this).remove();
                    });
                    //var divToPrint = document.getElementById('divForPrintWithMiniatures');
                    newWin.print();
                    newWin.close();
                    // if (window.inDev) {
                    // newWin.document.body.innerHTML = '';
                    // newWin.document.write("<html><body >" + divToPrint.innerHTML + "<button onclick='printDetailsWithMiniatures([0])'>Перерисовать</button></body></html>");
                    // }
                    // else {

                    // var newWin = window.open('', 'Print-Window');
                    //
                    // newWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
                    //
                    // newWin.document.close();
                    //
                    // setTimeout(function () {
                    //     newWin.close();
                    // }, 10);
                    $('#detailsActions').val('');
                    // }
                }
            });*/
        }
    });
}

function updateEdgesList() {
    $.ajax({
        url: "/service/templates/edges_list_only.php",
        success: function (data) {
            $("#sel-edges .item-top").remove();
            $("#sel-edges").append(data);
            if (!($("#sel-edges .dropdown").hasClass('rotated'))) {
                // $("#sel-edges .item-top").css('display', 'block');
            }
        }
    });
}

$(document).ready(function () {
    $('body').on('change', '#delivery', function () {
        $textarea = $('body').find('#dataform textarea.comments');
        if ($(this).val() == 'd') {
            $textarea.attr('placeholder', LANG['ADRESS-DOSTAVKA-HERE']);
        } else {
            $textarea.attr('placeholder', '');
        }
        $('#delivery').css('border', 'none');
    }).on('click', '.chooser .add', function () {
        $(this).closest('.chooser').find('input[type="file"]').click();
    }).on('change', '.chooser:last-child input[type="file"]', function () {
        var cont = $(this).closest('.chooser');
        var totalSize = 0;
        var added = $('.chooser').find('input[type="file"]');
        var names = [];
        var sameName = false;
        var hasExec = false;
        var isProject = false;
        for (var i = 0; i < added.length; i++) {
            var name = added[i].files[0].name;
            totalSize += added[i].files[0].size;
            if (names.indexOf(encodeURI(name)) >= 0) {
                sameName = true;
            }
            if (name.match(/(\.exe|\.msi|\.bat|\.com|\.sh)$/)) {
                hasExec = true;
            }
            if (name.match(/(\.vza|\.xml|\.project)$/)) {
                isProject = true;
            }
            names.push(encodeURI(name));
        }
        if (sameName) {
            $('#FaultMessage').text(LANG['FILE-WITH-THIS-NAME']);
            return;
        } else if (hasExec) {
            $('#FaultMessage').text(LANG['RESEND-FILE']);
            return;
        } else if (isProject) {
            $('#FaultMessage').text(LANG['RESEND-FILE-PROJECTS']);
            return;
        } else if (totalSize > 5242880) {
            $('#FaultMessage').text(LANG['OBSHIE-RAZMER-FILE-5-MB']);
            return;
        } else {
            $('#FaultMessage').text('');
        }
        if ($('.chooser').length <= 5) {
            $('#fileInputArea').append(cont.clone());
        }
        var name = this.files[0].name;
        if (name.length > 21) {
            name = name.slice(0, 9) + '...' + name.slice(-9);
        }
        cont.find('span.title').html(name);
        cont.find('span.size').html(this.files[0].size + ' байт');
        cont.find('.add').hide();
        cont.find('.remove').removeClass('hidden');
        cont.addClass('active');
        checkOdkFiles();
    }).on('click', '.chooser .remove', function () {
        var cont = $(this).closest('.chooser');
        $('#FaultMessage').text('');
        if ($('.chooser').length > 1) {
            cont.remove();
        }
        checkOdkFiles();
    });

    $('#printDetailList').on('click', function () {
        if (constructorId == 'dsp' || constructorId == 'stol') {
            if ($('div.dropdown_print').hasClass('dropdown_minimize')) {
                $('div.dropdown_print').removeClass('dropdown_minimize');
            } else {
                $('div.dropdown_print').addClass('dropdown_minimize');
            }
        } else {
            printDetailList();
        }
    });
    $(document).mouseup(function (e) {
        var container = $('div.dropdown_print');
        if (container.has(e.target).length === 0) {
            $('div.dropdown_print').addClass('dropdown_minimize');

        }
    });

    $('a.sawingSizes, a.fugueSizes ,a.overallDimension').click(printDetailList);

    $('#printCostList').click(function () {
        $.ajax({
            method: 'get',
            //data : 'target : forPrint',
            url: '/service/system/views/cost/inc/tableCost.php',
            dataType: 'text'
        }).success(function (data) {
            var iframe = $('<iframe id="print_frame">');
            $('body').append(iframe);
            $(iframe[0].contentWindow.document.body).append(data);
            $(iframe[0].contentWindow.document.body).find('table').attr('border', '1px solid black');
            $(iframe[0].contentWindow.document.body).find('table .hideForPrint').hide();
            $(iframe[0].contentWindow.document.body).find('table').css({
                'border-spacing': 0,
                'border-collapse': 'collapse',
                'text-align': 'left',
                'margin': '20px 20px 20px 40px',
                'width': '90%'
            });
            iframe[0].contentWindow.print();
            //console.log(data);
        });
    });
    $(".choose-city").click(function () {
       $("input[name=lang]").val($(this).text());
       $("#lang_form").submit();
    });

    $('#projectName').on('input', function () {
        if ((getDomain() == '"ua"' && !($(this).val().match('^' + '[-_.,()+ 0-9a-zA-Zа-яА-Я-щА-ЩЬьЮюЯяЁёЇїІіЄєҐґ]+' + '$')))
        || (getDomain() == '"by"' && !($(this).val().match('^' + '[-_.,()+ 0-9a-zA-Zа-яА-Я]+' + '$')))) {
            this.style.borderColor = 'red';
            $('.projectNameSave').hide();
            $('body').keypress(function (event) {
                if (event.which == '13') {
                    event.preventDefault();
                    showErrorMessage(LANG['BAD-PROJECT-NAME']);
                }
            });
        } else {
            $('body').off();
            $('.projectNameSave').show();
            this.style.borderColor = '';
        }
    });

    $('.projectInfo .field').dblclick(function () {
        progecteditModeOn();
    });

    $('.projectNameEdit').click(function () {
        progecteditModeOn();
    });

    function progecteditModeOn() {
        $('#projectName').attr('disabled', false).focus();
        $('.projectNameEdit').hide();
        $('.projectNameSave').show();
    }

    $('.projectNameSave').click(function () {

        var input = $('#projectName');

        var name = input.val().replace(/ /g, "_");
        input.val(name);

        input.attr('disabled', true);

        $.ajax({
            type: "POST",
            url: "/service/system/controllers/MainController.php",
            data: "controller=Ajax&action=changeProjectName&name=" + name,
            dataType: "xml",
            context: document.body,
            global: false,
            async: false,
            success: function (data) {
                $('.projectNameEdit').show();
                $('.projectNameSave').hide();
                showMessage(LANG['NAME-PROJECT-SAVE']);
            }
        });
    });

    // скрываем верхнюю шапку меню
    var fullscr = 0;
    $('#hide-header').on('click', function (event) {
        event.preventDefault();
        if(fullscr == 0) {
            $("#draw").addClass("fullscreenHei");
            $("#hide-me").removeClass("in");

            fullscr = 1;
        }else{
            $("#draw").removeClass("fullscreenHei");
            $("#hide-me").addClass("in");
            fullscr = 0;
        }
        // this.textContent = this.textContent === 'Показать' ? 'Скрыть' : 'Показать';
    });

    $('#printProductstList').click(function () {
        $.ajax({
            method: 'get',
            url: '/service/system/views/products/inc/tableProductsPrint.php',
            dataType: 'text'
        }).success(function (data) {
            var iframe = $('<iframe id="print_frame">');
            $('body').append(iframe);
            $(iframe[0].contentWindow.document.body).append(data);
            $(iframe[0].contentWindow.document.body).find('table').attr('border', '1px solid black');
            $(iframe[0].contentWindow.document.body).find('table .hideForPrint').hide();
            $(iframe[0].contentWindow.document.body).find('table').css({
                'border-spacing': 0,
                'border-collapse': 'collapse',
                'text-align': 'left',
                'margin': '20px 20px 20px 40px',
                'width': '90%'
            });
            iframe[0].contentWindow.print();
        });
    });
});


function showCutting() {

    var popup = $('.pop-up-bg');

    if (popup.length == 0) {
        popup = $('<div class="pop-up-bg"><div class="pop"><div class="head"><div id="printButton"><a href="#">'+LANG['PRINT']+'</a></div><div class="close">'+LANG['CLOSE']+'</div></div><div class="cont"><div class="inner-cont"><div class="wrap" id="to_print"></div></div></div></div></div>');
        $('body').append(popup);
        popup.find('div.close').click(function () {
            popup.fadeOut();
            $(popup).remove();
        });
        popup.find('#printButton').click(function () {
            var html_to_print = $('div.wrap#to_print').html();
            var iframe = $('<iframe id="print_frame">');
            $('body').append(iframe);
            $(iframe[0].contentWindow.document.body).append(html_to_print);
            $(iframe[0].contentWindow.document.body).find('div#container img').css({
                width: '600px',
                'margin-bottom': '20px'
            });
            iframe[0].contentWindow.print();
        });
    }

    popup.fadeIn();
    var wrap = popup.find('.wrap');


    $.ajax({
        url: '/service/templates/cutting.html',
        method: 'GET'
    }).done(function (data) {
        wrap.html('');
        wrap.append(data);
        CUTTING.start('.wrap');
    });
}


//-----------------------CUTTING---------------//


var CUTTING = (function () {
    var selector;

    function start(sel, n) {
        selector = sel;
        if (n === undefined) {
            n = 0;
        }
        if (typeof n != 'number') {
            throw new Error('Invalid type of argument : "' + typeof n + '", expected "number"');
        }
        $.ajax({
            url: '/service/system/controllers/JsonController.php',
            method: 'POST',
            data: "controller=Ajax&action=getCutting&key=" + n,

            error: function () {
                $('#preloader').remove();
                $(selector).append($('<p class="error">'+LANG['BIG-LIMIT-WAITING']+'</p>').css({
                    'font-size': '40px',
                    'text-align': 'center'
                }));
            },
            timeout: 90000 // sets timeout to 3 seconds
        }).done(process);
    }

    function process(result) {
        //console.log(result);
        //console.log(JSON.parse(result));
        //return;
        $('#preloader').remove();
        if (result.length == 0) {
            $(selector).append($('<p class="error">'+LANG['ERROR-TRY-LATER']+'</p>').css({
                'font-size': '40px',
                'text-align': 'center'
            }));

            return;
        }

        var loading = $(selector).find('#loading');

        loading.show();

        //result = jQuery.parseJSON(result);
        result = JSON.parse(result);

        var i = 0;
        var span = $('#count');
        var id = setInterval(function () {
            if (i == result.length) {
                loading.html('');
                //$(selector).find('#done').show();
                $('#printButton').show();
                clearInterval(id);
                return;
            }
            init(result[i++], i);
            span.html(i);
        }, 0);
    }

    function init(result, i) {

        var container = $(selector).find('#container');
        //console.log(result);
        container.append('<br>');
        container.append('<div>Пакет №: ' + i + '</div>');
        container.append('<div>Материал: ' + result.pattern.material + '</div>');
        container.append('<div>Количество листов в пакете: ' + result.pattern.count + ' шт. </div>');
        container.append('<div>Размеры листа: ' + result.pattern.width + ' x ' + result.pattern.height + ' мм </div>');
        var show = false;
        if (result.show == false) {
            show = false;
        }
        var angle = 0;
        //if (result.rotate) {
        //    angle = Math.PI / 2;
        //}

        var canvas = document.createElement('canvas');
        canvas.width = result.pattern.width;
        canvas.height = result.pattern.height;

        var ctx = canvas.getContext('2d');

        if (angle != 0) {
            ctx.translate(result.pattern.height, 0);
        }
        ctx.rotate(angle);

        ctx.lineWidth = 5;
        ctx.fillStyle = '#FBFBFB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        paint(result, ctx, angle, show);
        ctx.stroke();


        //var url = canvas.toDataURL('image/jpeg');
        var url = canvas.toDataURL();
        var img = new Image();
        img.src = url;
        container.append(img);
        container.append('<hr>');

    }

    function paint(data, ctx, angle, show) {
        var fontSize = 60;
        ctx.beginPath();
        ctx.font = fontSize + "px Areal";
        data.lines.forEach(function (line) {

            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
        });

        ctx.fillStyle = 'gray';
        data.waste.forEach(function (w) {
            ctx.fillRect(w.x0, w.y0, w.partL, w.partW);
        });
        data.commercialWaste.forEach(function (w) {
            ctx.fillStyle = 'rgba(191, 181, 54, 0.36)';
            ctx.fillRect(w.x0, w.y0, w.partL, w.partW);
            ctx.fillStyle = 'black';
            ctx.textAlign = "center";
            var x = w.x0 + w.partL / 2;
            var y = w.y0 + w.partW / 2;
            ctx.fillText(w.ref, x, y);
        });

        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        data.detailList.forEach(function (detail) {
            var x = detail.x0 + detail.partL / 2;
            var y = detail.y0 + detail.partW / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-angle);
            ctx.fillText(Number(detail.ref), 0, fontSize / 3);

            if (show) {
                showSize(detail, ctx);
            }
            ctx.restore();
        })
    }

    function showSize(detail, ctx) {
        ctx.save();
        ctx.font = "50px Areal";
        ctx.textAlign = "left";
        ctx.fillText(detail.partL, -detail.partL / 2 + 10, detail.partW / 2 - 10);
        ctx.textAlign = "right";
        ctx.translate(detail.partL / 2, -detail.partW / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(detail.partW, -10, -10);
        ctx.restore();
    }

    return {
        start: function (selector, n) {
            start(selector, n);
        }
    }


})();
var active_tab = sessionStorage.getItem('active-edit');

function closeModal(modal){
    var position = $('#'+modal.attr('data-id')).position();
    if(modal.attr('data-id')!= "modal_PDF" && position) {
        sessionStorage.setItem("modal-left", position.left);
        sessionStorage.setItem("modal-top", position.top);
    }
    $('#' + modal.attr('data-id')).css("display","none");
    // $("#detailsTable").removeClass('tablespace');
    $('*[data-id="'+ modal.attr('data-id') + '"]').removeClass('active');
}

function resetModal(modal){
    if (modal == 'modal1'){
        $('#modal1 .topmodal .madalText').html('');
        $('#modal1 .topmodal .madalText').text(LANG['NEW-DETAIL']);
        $("#modal1 #addButton").val(LANG['ADD']);
        $("#WidthId").val('');
        if(maxHeight && materialType != 'compact' && constructorId == 'stol'){
            if(isClientalMaterial==1){
                $('#HeightId option[value="'+maxHeight+'"]').length > 0 ? $('#HeightId option[value="'+maxHeight+'"]').prop('selected', true) : $('#HeightId option:eq(0)').prop('selected', true);
            }else{
                $("#HeightId").val(maxHeight);
            }
        }else{
            $("#HeightId").val('');
        }
        $("#MultiplicityId").val('1');
        $("#CountId").val('1');
        $('#CaptionId').val('');
        //console.dir(window);
    }
}


$( document ).ready(function(){

    var modalArrayManager = ['modal1', 'modal2' , 'modal3', 'modal4', 'modal5', 'modal6', 'modal12', 'modal14'];
    if(active_tab == null){
        active_tab='modal1';
    }
    $('.left-container-menu').on('click', function(e){
        e.preventDefault()
        if(active_tab == undefined){
            active_tab='modal1';
        }
        if (active_tab == 'modal1'){
            resetModal('modal1');
            if($('#modal1').lenght) {
                detailKey = '';
            }
        }
        if(active_tab == $(this).attr('data-id')){
            // $('#'+$(this).attr('data-id')).css("display","block");
            var position2 = $('#'+ active_tab).position();
            if(position2 != undefined  && $('#'+ active_tab).css("display")!="none") {
                sessionStorage.setItem("modal-left", position2.left);
                sessionStorage.setItem("modal-top", position2.top);
            }
        }

        if(active_tab!=$(this).attr('data-id') && $(this).attr('data-id')!= "modal_PDF") {
            var position2 = $('#'+ active_tab).position();
            // $('#'+$(this).attr('data-id')).css("display","block");
            if(position2 != undefined && $('#'+ active_tab).css("display")!="none") {
                sessionStorage.setItem("modal-top", position2.top);
                sessionStorage.setItem("modal-left", position2.left);
            }
            $('#' + active_tab).css("display","none");
            $('*[data-id="'+ active_tab + '"]').removeClass('active');
            active_tab = $(this).attr('data-id');
            sessionStorage.setItem('active-edit', $(this).attr('data-id'));
        }
        if(sessionStorage.getItem('active-edit')!=null){
            $('#' + sessionStorage.getItem('active-edit')).css("display","none");
            $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
        }
        if(sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null && $(this).attr('data-id')!= "modal_PDF") {
            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                var index = modalArrayManager.indexOf('modal6');
                if (index !== -1) modalArrayManager.splice(index, 1);
            }
            if (!fromViyarEmail || modalArrayManager.includes($(this).attr('data-id')) ){
                $('#'  + $(this).attr('data-id')).css("display","block");
                $('#' + $(this).attr('data-id')).css("left","75px");
                $(this.classList.add('active'));
            }
        }else if($(this).attr('data-id')!= "modal_PDF"){
            if($(".modalwin").css("display")== "none") {
                if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                    var index = modalArrayManager.indexOf('modal6');
                    if (index !== -1) modalArrayManager.splice(index, 1);
                }
                if (!fromViyarEmail || modalArrayManager.includes($(this).attr('data-id')) ){
                    /** Если минск и есть габариты, то отображаем их */
                    if ($(this).attr('data-id') == 'modal1'){
                        if ($("#typeofdetail").length){
                            $("#typeofdetail").val(0);
                            $("#typeofdetail").show();
                        }
                    }
                    $('#' + $(this).attr('data-id')).css("display", "block");
                    $('#' + $(this).attr('data-id')).css("left", sessionStorage.getItem('modal-left') + "px");
                    $('#' + $(this).attr('data-id')).css("top", sessionStorage.getItem('modal-top') + "px");
                    $(this.classList.add('active'));
                }
            }
        }
        $('#' + $(this).attr('data-id') ).draggable({ containment: "html" });
        // $('#' + $(this).attr('data-id')).draggable();
        // $("#detailsTable").addClass('tablespace');
    });
    $('.PDF-container').click(function(){
        $('#modal_PDF').css("display","block");
        $('#modal_PDF').animate({"left": "+75px","top":"+62px"}, "slow");
        $('#modal_PDF').draggable();
    });
    $(".firstModal").on('click', function(e){
        e.preventDefault();
        closeModal($(this));
    });
    $('.error-container').on('click',function(e){
        e.preventDefault();
        $('#' + $(this).attr('data-id')).draggable();
        $('#' + $(this).attr('data-id')).animate({"left": "+50%"}, "fast");
    });
    // $(".secondModal").on('click', function(e){
    //     e.preventDefault();
    //     $('#'+$(this).attr('data-id')).animate({"left": "-900px"}, "slow");
    // });
});
$( document ).ready(function() {
    // заголовок вкладки 0-детали 1-обработка 2-фурнитура 3-заказ
    var  tab = document.getElementsByClassName('tabN');
    if($('div').is(".tabN")) {
        if (localStorage.getItem('tabCut') == null && localStorage.getItem('tabAdd') == null && localStorage.getItem('tabProd') == null && localStorage.getItem('tabCost') == null) {
            localStorage.setItem('tabCut', '0');
        }
        if (localStorage.getItem('tabCut') == '0') {
            tab[0].classList.add('whiteborder');
            for (var i = 1; i < 4; i++) {
                tab[i].classList.remove('whiteborder');
            }
        }
        else if (localStorage.getItem('tabAdd') == '1') {
            tab[1].classList.add("whiteborder");

            for (var i = 0; i < 4; i++) {
                switch (i) {
                    case"0":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"2":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"3":
                        tab[i].classList.remove('whiteborder');
                        break;
                }
            }
        } else if (localStorage.getItem('tabProd') == 2) {
            tab[2].classList.add("whiteborder");
            for (var i = 0; i < 4; i++) {
                switch (i) {
                    case"0":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"1":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"3":
                        tab[i].classList.remove('whiteborder');
                        break;
                }
            }
        } else if (localStorage.getItem('tabCost') == 3) {
            tab[3].classList.add("whiteborder");
            for (var i = 0; i < 4; i++) {
                switch (i) {
                    case"0":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"1":
                        tab[i].classList.remove('whiteborder');
                        break;
                    case"2":
                        tab[i].classList.remove('whiteborder');
                        break;
                }
            }
        }
    }

});
$('.select').each(function(){
    // Variables
    var $this = $(this),
        selectOption = $this.find('option'),
        selectOptionLength = selectOption.length,
        selectedOption = selectOption.filter(':selected'),
        dur = 500;

    $this.hide();
    // Wrap all in select box
    $this.wrap('<div class="select"></div>');
    // Style box
    $('<div>',{
        class: 'select__gap',
        text: 'Please select'
    }).insertAfter($this);

    var selectGap = $this.next('.select__gap'),
        caret = selectGap.find('.caret');
    // Add ul list
    $('<ul>',{
        class: 'select__list'
    }).insertAfter(selectGap);

    var selectList = selectGap.next('.select__list');
    // Add li - option items
    for(var i = 0; i < selectOptionLength; i++){
        $('<li>',{
            class: 'select__item',
            html: $('<span>',{
                text: selectOption.eq(i).text()
            })
        })
            .attr('data-value', selectOption.eq(i).val())
            .appendTo(selectList);
    }
    // Find all items
    var selectItem = selectList.find('li');

    selectList.slideUp(0);
    selectGap.on('click', function(){
        if(!$(this).hasClass('on')){
            $(this).addClass('on');
            selectList.slideDown(dur);

            selectItem.on('click', function(){
                var chooseItem = $(this).data('value');

                $('select').val(chooseItem).attr('selected', 'selected');
                selectGap.text($(this).find('span').text());

                selectList.slideUp(dur);
                selectGap.removeClass('on');
            });

        } else {
            $(this).removeClass('on');
            selectList.slideUp(dur);
        }
    });

});

$(document).ready(function() {
    var check_table = localStorage.getItem("check_table");
    var secretCode = '';
    var secretCodeCount = 0;
    if (check_table == 0 || localStorage.getItem("check_table") == null) {
        if (localStorage.getItem("check_table") == null){
            localStorage.setItem("check_table", 1);
        }
        $("#tablespack").css("display", "none");
        $("#hide-table").css("transform","rotate(180deg)");
        $("#drawinfo").addClass("max-width");
        $("#right-container").addClass("max-width");
        $("#sides").addClass("max-width");
        $("#sides").addClass("max-marg");
    } else {
        $("#tablespack").css("display", "block");
        $("#hide-table").css("transform","rotate(0deg)");
        $("#drawinfo").removeClass("max-width");
        $("#right-container").removeClass("max-width");
        $("#sides").removeClass("max-width");
        $("#sides").removeClass("max-marg");
    }
    $("#hide-table").click(function () {
        if (check_table == 0) {
            $(this).attr('title', LANG['SHOW-TABLES']);
            $("#tablespack").css("display", "none");
            $("#hide-table").css("transform","rotate(180deg)");
            $("#drawinfo").addClass("max-width");
            $("#right-container").addClass("max-width");
            $("#sides").addClass("max-width");
            $("#sides").addClass("max-marg");
            check_table = 1;
            localStorage.setItem("check_table", check_table);
        } else {
            $(this).attr('title', LANG['HIDE-TABLES']);
            $("#tablespack").css("display", "block");
            $("#hide-table").css("transform","rotate(0deg)");
            $("#drawinfo").removeClass("max-width");
            $("#right-container").removeClass("max-width");
            $("#sides").removeClass("max-width");
            $("#sides").removeClass("max-marg");
            check_table = 0;
            localStorage.setItem("check_table", check_table);
        }
    });

    /** Secret for Dev */
    $(document).keydown(function(e) {
        secretCode += String(e.which);
        secretCodeCount++;
        if (secretCode.charAt(0) + secretCode.charAt(1) != 68){
            secretCodeCount = 0;
            secretCode = '';
        }
        if (secretCodeCount == 4 && window.testerMode){
            secretCodeCount = 0;
            $.ajax({
                type: "POST",
                url: "/service/system/controllers/JsonController.php",
                data: ({controller: 'Ajax', 'action': 'secretDev', 'code': secretCode}),
                dataType:"json",
                success: function (data) {
                    if (data['type'] == 'ok') {
                        showMessage(data['msg']);
                    }
                }
            });
            secretCode = '';
        }
        if (secretCodeCount > 4){
            secretCodeCount = 0;
            secretCode = '';
        }
    });
});