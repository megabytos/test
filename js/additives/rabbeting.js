function delRabbet(rabbetKey) {
    var rabbeting = g_detail.getModule('rabbeting');
    g_detail.rmOperation(
        'rabbet',
        {
            detail_key: detailKey,
            rabbet_key: rabbetKey
        },
        function (data) {
            var val = data[1];
            var data = data[0];
            rabbeting.use('table');
            rabbeting.use('data', [data]);
            rabbeting.use('rmsvg', [rabbetKey]);
        }
    );
}

function editRabbet(rabbetKey) {
    var active_tab = sessionStorage.getItem('active-edit');
    var position2 = $('#'+ active_tab).position();

    if(active_tab == $('#modal9').attr('id')&& position2 != undefined){
        sessionStorage.setItem("modal-left", position2.left);
        sessionStorage.setItem("modal-top", position2.top);
    }
    if(active_tab!=$('#modal9').attr('id')) {
        if(position2 != undefined && $('#'+ active_tab).css("display")!="none") {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);

        }
        $('#' + active_tab).css("display","none");
        $('*[data-id="'+ active_tab + '"]').removeClass('active');
        sessionStorage.setItem('active-edit', $('#modal9').attr('id'));
    }
    if( $('.left-container-menu').hasClass('active')){
        $('.left-container-menu').removeClass('active');
        $('.modalwin').css("display","none");
    }
    if(sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null) {
        $('#modal9').css("display","block");
        $('#modal9').css("left","75px");
    }else{
        $('#modal9').css("display","block");
        $('#modal9').css("left",sessionStorage.getItem('modal-left')+"px");
        $('#modal9').css("top",sessionStorage.getItem('modal-top')+"px");
    }
    sessionStorage.setItem('active-edit',$('#modal9').attr('id'));
    $('#modal9').draggable({ containment: "html" });
    $('*[data-id="modal9"]').addClass('active');
    var rabbeting = g_detail.getModule('rabbeting');
    var rabbet = detailRabbets[rabbetKey];
    if (rabbet.slim) {
        showErrorMessage(LANG['NO-EDIT-SLIM'], function () {
            return;
        });
    }
    else {
        rabbeting.use('editRabbetCallBack', [rabbet, rabbetKey]);
    }
}


define(function (require, exports, module) {
    var rabbeting = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        inputs: {
            get side() {
                return document.getElementById('rabbetSideSelect')
            },
            get type() {
                return document.getElementById('rabbetPatternSelect')
            },
            get n() {
                return document.getElementById('rabbet_n')
            },
            get d() {
                return document.getElementById('rabbet_d')
            },
            get l() {
                return document.getElementById('rabbet_l')
            },
            get z() {
                return document.getElementById('rabbet_z')
            },

            get add() {
                return document.getElementById('addButtonRabbet')
            },
            get full() {
                return document.getElementById('rabbetFullLength')
            },
            get field_l() {
                return document.getElementById('rabbetLFieldset')
            },
            get field_n() {
                return document.getElementById('rabbetNFieldset')
            },
            get field_d() {
                return document.getElementById('rabbetDFieldset')
            },
            get field_z() {
                return document.getElementById('rabbetZFieldset')
            },
            get rabbets() {
                return document.getElementById('rabbets')
            },
            get rabbetSelForm() {
                return document.getElementById('rabbetSelectForm')
            },
            get rabbetCheckForm() {
                return document.getElementById('rabbetCheckboxForm')
            },
            get rabbetSlimForm() {
                return document.getElementById('rabbetSlimForm')
            },
            get rabbetSlimSideForm() {
                return document.getElementById('rabbetSlimSideForm')
            },
            get rabbetCheckGorForm() {
                return document.getElementById('rabbetCheckboxGorForm')
            },
            get table() {
                return document.getElementById('additives-tbl-container-rabbet')
            },
            get ext() { //kromka
                return document.getElementById('rabbetExt')
            },
            get rabbetCheckExtForm() {
                return document.getElementById('rabbetCheckboxExtForm')
            },

        },
        methods: {
            // инвенты для полей ввода
            side(e){
                markSide(rabbeting.getval('type').charAt(0));
                markSide(rabbeting.getval('type').charAt(1), true);
            },
            type(e){
                $pattern = Number(rabbeting.getval('type'));

                rabbeting.disabled('full', false);

                switch ($pattern) {
                    case 1:
                        rabbeting.showinput('rabbetSelForm');
                        rabbeting.showinput('rabbetCheckForm');
                        rabbeting.showinput('field_d');
                        rabbeting.showinput('field_z');
                        rabbeting.hideinput('rabbetSlimForm');
                        rabbeting.hideinput('rabbetSlimSideForm');
                        if (!rabbeting.getval('full')) {
                            rabbeting.showinput('field_n');
                            rabbeting.showinput('field_l');
                        }
                        rabbeting.disabled('full', false);
                        rabbeting.setval('d', '');
                        rabbeting.setval('z', '');
                        rabbeting.hideinput('rabbetCheckGorForm');
                        if (!(['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                            rabbeting.showinput('rabbetCheckExtForm');
                        }
                        break;
                    case 2:
                        rabbeting.hideinput('rabbetSelForm');
                        rabbeting.hideinput('rabbetCheckForm');
                        rabbeting.hideinput('field_d');
                        rabbeting.hideinput('field_z');
                        rabbeting.hideinput('field_n');
                        rabbeting.hideinput('field_l');
                        rabbeting.hideinput('field_l');
                        rabbeting.hideinput('rabbetCheckExtForm');
                        rabbeting.showinput('rabbetSlimForm');
                        rabbeting.showinput('rabbetSlimSideForm');
                        rabbeting.showinput('rabbetCheckGorForm');
                        break;
                    case 3:
                        rabbeting.setval('d', '3.2');
                        rabbeting.hideinput('field_d');
                        rabbeting.setval('full', true);
                        rabbeting.method('full');
                        //rabbeting.disabled('full', true);
                        rabbeting.showinput('rabbetSelForm');
                        rabbeting.showinput('rabbetCheckForm');
                        rabbeting.showinput('field_z');
                        rabbeting.hideinput('rabbetSlimForm');
                        rabbeting.hideinput('rabbetSlimSideForm');
                        rabbeting.hideinput('rabbetCheckGorForm');
                        rabbeting.showinput('rabbetCheckExtForm');
                }
            },
            full(e){
                if (rabbeting.getval('full')) {
                    rabbeting.hideinput('field_l');
                    rabbeting.hideinput('field_n');
                    rabbeting.setval('l', '');
                    rabbeting.setval('n', '');
                }
                else {
                    rabbeting.showinput('field_l');
                    rabbeting.showinput('field_n');
                }

                if (rabbeting.getval('n') == 0 && rabbeting.getval('l') == detailFullWidth) {
                    rabbeting.checked('full', true);
                    rabbeting.hideinput('field_l');
                    rabbeting.hideinput('field_n');
                    rabbeting.setval('l', '');
                    rabbeting.setval('n', '');
                }
            },
            add(e) {
                if (rabbeting.use('checkGroovingAndRabbets')) {
                    showOkButton2('addButtonRabbet');
                    var pattern = Number(rabbeting.getval('type'));
                    sides = (pattern == 2) ? getSides('rabbetSlim') : getSides('rabbet');
                    if (sides[0] == sides[1]) {
                        showConfirmMessage(LANG['DECOR-SIDE-OBR-CONF'],
                            function () {
                                if (pattern == 2) {
                                    rabbeting.use('sendSlimRabbet');
                                } else {
                                    rabbeting.use('sendRabbet');
                                }
                            });

                    } else {
                        switch (pattern) {
                            case 1:
                            case 3:
                                rabbeting.use('sendRabbet');
                                break;
                            case 2:
                                rabbeting.use('sendSlimRabbet');
                                rabbeting.hideinput('rabbetCheckGorForm');
                                break;
                        }
                    }
                } else console.error('Checking rabbeting is not passed.');

                if(fromViyarEmail){
                    $('#' + sessionStorage.getItem('active-edit')).css("display","none");
                    $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
                }
            },
        },
        functions: {
            resetField(){
                rabbeting.setval('type', 1);
                rabbeting.methods.type();
                rabbeting.setval('n', '');
                rabbeting.setval('d', '');
                rabbeting.setval('l', '');
                rabbeting.setval('z', '');
                rabbeting.setval('full', true);
                rabbeting.methods.full();
                rabbeting.setval('ext', false);
            },
            setRabbetSide(data) {

                var objSel = rabbeting.getinput('side');
                if (objSel) {
                    objSel.options.length = 0;
                    var i = 0;
                    for (key in data) {
                        objSel.options[i++] = new Option(key, data[key]);
                    }
                }


            },
            setRabbetPattern(data) {

                var objSel = rabbeting.getinput('type');
                if (objSel) {
                    objSel.options.length = 0;
                    var i = 0;
                    if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                        objSel.options[objSel.options.length] = new Option(LANG['PROIZVOLN-S'], 1);
                    }
                    else {
                        for (key in data) {
                            objSel.options[i++] = new Option(key, data[key]);
                        }
                    }
                }
            },
            sendRabbet() {
                var rabbet = {
                    side: Number(rabbeting.getval('side')),
                    n: Number(rabbeting.getval('n')),
                    z: Number(rabbeting.getval('z')),
                    d: Number(rabbeting.getval('d')),
                    l: Number(rabbeting.getval('l')),
                    full: Number(rabbeting.getval('full')),
                    ext: Number(rabbeting.getval('ext')),
                    rabbet_key: rabbet_key
                };
                var callback = function (data) {
                    var val = data[1];
                    var data = data[0];
                    rabbet_key = '';
                    rabbeting.use('data', [data]);
                    rabbeting.use('table');
                    rabbeting.use('svg', [rabbet, detailKey]);
                    rabbeting.getinput('add').innerText = LANG['ADD'];
                    rabbeting.getinput('add').classList.remove("btn-success");
                    rabbeting.getinput('add').classList.add("btn-danger");
                    rabbeting.functions.resetField();
                };

                g_detail.setOperation(
                    'rabbet',
                    {
                        detail_key: detailKey,
                        side: rabbet['side'],
                        n: rabbet['n'],
                        z: rabbet['z'],
                        d: rabbet['d'],
                        l: rabbet['l'],
                        ext: rabbet['ext'],
                        rabbet_key: rabbet_key
                    },
                    callback
                );
            },
            editRabbetCallBack(data, rabbetKey) {

                // rabbeting.setval('type', data[3] === 3.2 ? 3 : 1);
                // rabbeting.method('type');
                rabbeting.setval('side', data[0]);
                rabbeting.method('side');
                rabbeting.setval('type', data[3] === 3.2 ? 3 : 1);
                rabbeting.method('type');
                rabbeting.setval('n', data[1]);
                rabbeting.setval('z', data[2]);
                rabbeting.setval('d', data[3]);
                rabbeting.setval('l', data[4]);
                rabbeting.setval('full', data[7]);
                rabbeting.method('full');
                rabbeting.setval('ext', data[5]);
                rabbet_key = rabbetKey;

                var add = rabbeting.getinput('add');
                add.innerText = LANG['SAVE'];
                add.classList.remove("btn-success");
                add.classList.add("btn-danger");

                // var type = (data[0]==12||data[0]==14||data[0]==62||data[0]==64)?1:0;
                // if (data[4] == 0 || (type == 0 && data[4] >= detailWidth || type == 1 && data[4] >= detailHeight)) {
                //     rabbeting.setval('full', true);
                // } else {
                //     rabbeting.setval('full', false);
                // }

                $('#rabbetsTable tr').removeClass("info");
                $('#rabbetsTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
                $("#rabbetKeyId-" + rabbetKey).addClass("info");
                $("#rabbetKeyId-" + rabbetKey + '.danger').addClass("danger-edit").removeClass("danger");
                $('#collapseRabbet').collapse("show");
                window.frames[0]
                    ? window.frames[0].document.getElementById('panel-rabbeting').scrollIntoView()
                    : window.document.getElementById('panel-rabbeting').scrollIntoView();
            },
            sendSlimRabbet() {
                var callback = function (data) {
                    console.log('sendSlimRabbet', data);
                    rabbet_key = '';
                    rabbeting.use('data', [data[0]]);
                    rabbeting.use('svgSlim', [data[1], detailKey]);
                    rabbeting.use('table');

                    var val = data[2];
                    $(rabbeting.getinput('add')).text(LANG['ADD']);
                    $(rabbeting.getinput('add')).removeClass("btn-success");
                    $(rabbeting.getinput('add')).addClass("btn-danger");
                    rabbeting.functions.resetField();
                    rabbeting.validate(val);
                };

                g_detail.setOperation(
                    'slimRabbet',
                    {
                        detail_key: detailKey,
                        slimType: Number($('#rabbetSlimSelect').val()),
                        slimGor: Number($('#rabbetGorWidth').prop('checked')),
                        frontSide: Number($('#rabbetSlimSide').val())
                    },
                    callback
                );
            },
            svg(rabbet, detail_key) {
                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({
                        controller: 'Additives',
                        action: 'getSVGForRabbet',
                        rabbet_key: rabbet_key,
                        rabbet: rabbet,
                        detail_key: detail_key
                    }),
                    dataType: 'json',
                    success: function (data) {
                        var svgRabbetMain = data[0];
                        var svgRabbetDop = data[1];
                        var rabbetKey = data[2];

                        $('.svg-rabbets-' + rabbetKey).remove();

                        for (var i in svgRabbetMain) {
                            if (svgRabbetMain[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgRabbetMain[i];
                        }

                        for (var i in svgRabbetDop) {
                            if (svgRabbetDop[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgRabbetDop[i];
                        }

                        rabbeting.use('svgs_init');

                        return data;
                    }
                });
            },
            svgSlim(rabbets, detail_key) { //это для слим системы


                $.ajax({
                    type: "POST",
                    url: "system/controllers/JsonController.php",
                    data: ({
                        controller: 'Additives',
                        action: 'getSVGForRabbets',
                        rabbets: rabbets,
                        detail_key: detail_key
                    }),
                    dataType: 'json',
                    success: function (data) {
                        var svgRabbetMain = data[0];
                        var svgRabbetDop = data[1];

                        rabbets.forEach(function (item, i, arr) {

                            $('#svg-rabbets-' + item['id']).each(function (index, value) {

                                $(this).remove();
                            });
                            $('.svg-rabbets-' + item['id']).each(function (index, value) {


                                $(this).remove();
                            });
                        });

                        for (var i in svgRabbetMain) {
                            if (svgRabbetMain[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgRabbetMain[i];
                        }

                        for (var i in svgRabbetDop) {
                            if (svgRabbetDop[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgRabbetDop[i];
                        }
                        return data;
                    }
                });
            },
            svgs_init() {
                var els = document.querySelectorAll('g[class^=svg-rabbets-] > rect');
                for (var i = 0; i < els.length; i++) {
                    rabbeting.use('svg_init_el', [els[i].parentNode]);
                }
            },
            svg_init_el(el) {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-rabbets-/)) {
                            return Number(el.classList[i].replace('svg-rabbets-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[(detailRabbets[id][0] + "")[1]];
                    var w = detailRabbets[id][3];
                    var l = detailRabbets[id][4];
                    var z = detailRabbets[id][2];
                    $('#drawinfo').text(
                        LANG['ONE-CHETVERT']+` № ${id + 1} (${side}): x=0, y=0, z=${z}, ширина=${w}, `+LANG['DLINA-S']+`=${l}`
                    );
                    showRabbetPosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideRabbetPosition(id);
                };
                el.ondblclick = e => {
                    var id = getid();
                    editRabbet(id);
                };
            },
            data(data) {
                detailRabbets.length = 0;
                for (var key in data) {
                    detailRabbets.push([
                        Number(data[key]['side']), //0
                        Number(data[key]['n']),    //1
                        Number(data[key]['z']),    //2
                        Number(data[key]['d']),    //3
                        Number(data[key]['l']),    //4
                        Boolean(data[key]['ext']), //5
                        Boolean(data[key]['slim']),//6
                        Number(data[key]['full']), //7
                        Number(data[key]['type'])  //8
                    ]);
                }
            },
            table() {
                /*
                 * обновляем таблицу только если есть хотя бы 1 четверть
                 * */
                if (detailRabbets.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: "/service/system/views/additives/inc/tableRabbet.php",
                        data: 'detail_key=' + detailKey + '&machineId=' + machine,
                        dataType: "html",
                        success: function (data) {
                            if (data.length > 0) {
                                rabbeting.showinput('table');
                                $("#hide-table").css("display", "block");
                                showHideTableStyles();
                                var table = rabbeting.getinput('table');
                                table.innerHTML = data;
                                $(table).find('tr[id^=rabbetKeyId-]').each((i, el) => {
                                    el.ondblclick = e => {
                                        editRabbet(Number(el.id.replace('rabbetKeyId-', '')));
                                    };
                                    el.onmouseout = e => {
                                        hideRabbetPosition(Number(el.id.replace('rabbetKeyId-', '')));
                                    };
                                    el.onmouseover = e => {
                                        showRabbetPosition(Number(el.id.replace('rabbetKeyId-', '')));
                                    };
                                });
                            } else {
                                rabbeting.hideinput('table');
                            }
                        }
                    });
                } else {
                    rabbeting.hideinput('table');
                }
            },
            rmsvg(rabbetKey){
                $('.svg-rabbets-' + rabbetKey).remove();

                if (rabbetKey != detailRabbets.length) {
                    for (var i = rabbetKey + 1; i < detailRabbets.length + 1; i++) {
                        var svg;
                        while (svg = document.getElementsByClassName('svg-rabbets-' + i)[0]) {
                            svg.classList.remove('svg-rabbets-' + i);
                            svg.classList.add('svg-rabbets-' + (i - 1));
                        }
                    }
                }
            },
            checkGroovingAndRabbets() {
                var deltaMin = 0;
                var deltaMax = 6;
                var deltaMinR = 0;
                var deltaMaxR = 5;
                var thicknessMin = 7;
                var identMin1 = 80;
                var identMin2 = 20;
                var sideRabbetingString = String(rabbeting.getval('side'));
                var sideRabbeting = Number(sideRabbetingString.charAt(0)); // сторона детали
                var ribRabbeting = Number(sideRabbetingString.charAt(1)); // край детали
                if ([2, 4].indexOf(ribRabbeting) !== -1) {
                    var directRabbeting = 1; // вертикальное направление
                } else {
                    var directRabbeting = 0; // горизонтальное направление
                }
                var rabbetingD = round(Number(rabbeting.getval('d')), 1);
                var rabbetingN = round(Number(rabbeting.getval('n')), 1);
                var rabbetingL = round(Number(rabbeting.getval('l')), 1);
                var rabbetingFull = rabbeting.getval('full');
                if (rabbetingFull == 'true') {
                    rabbetingFull = true;
                } else if (rabbetingFull == 'false') {
                    rabbetingFull = false;
                }
                var depth = round(Number(rabbeting.getval('z')), 1);
                var rabbetingIdent1 = rabbetingN;
                if (directRabbeting) { //вертикальное направление
                    if (rabbetingFull) {
                        rabbetingL = detailFullHeight;
                    }
                    var rabbetingIdent2 = round(detailFullHeight - rabbetingN - rabbetingL, 1); // верх
                } else {  // горизонтальное направление
                    if (rabbetingFull) {
                        rabbetingL = detailFullWidth;
                    }
                    var rabbetingIdent2 = round(detailFullWidth - rabbetingN - rabbetingL, 1); // право
                }
                var arrPlane = [1,6];
                var arrRibs = [2,3,4,5];
                var arrRibsX = [2,4];
                var arrRibsY = [3,5];
                var rabbetingN2 = round(rabbetingN + rabbetingL, 1);

                // Проверка на отступ между пазом и четвертью
                for (var groove of detailGrooves) {
                    var sideGroove = groove[0];
                    var directGroove = groove[1];
                    var grooveD = round(Number(groove[5]), 1);
                    var grooveX = round(Number(groove[2]), 1);
                    var grooveY = round(Number(groove[3]), 1);
                    var grooveL = round(Number(groove[6]), 1);
                    var grooveDepth = round(Number(groove[4]), 1);
                    if (directGroove) { //вертикальное направление
                        if (arrRibsX.indexOf(sideGroove) != -1) {
                            var ribGroove = sideGroove;
                            var grooveVal = grooveX;
                        } else if (groove[9] == 'true') {
                            var ribGroove = 4; // правый край
                            var grooveVal = round(detailFullWidth - grooveX - grooveD, 1);
                        } else {
                            var ribGroove = 2; // левый край
                            var grooveVal = grooveX;
                        }
                        var xy = 'x';
                        var grooveIdent1 = grooveY; // низ
                        var grooveIdent2 = round(detailFullHeight - grooveY - grooveL, 1); // верх
                    } else {  // горизонтальное направление
                        if (arrRibsY.indexOf(sideGroove) != -1) {
                            var ribGroove = sideGroove;
                            var grooveVal = grooveY;
                        } else if (groove[8] == 'true') {
                            var ribGroove = 3; // верх
                            var grooveVal = round(detailFullHeight - grooveY - grooveD, 1);
                        } else {
                            var ribGroove = 5; // низ
                            var grooveVal = grooveY;
                        }
                        var xy = 'y';
                        var grooveIdent1 = grooveX; // лево
                        var grooveIdent2 = round(detailFullWidth - grooveX - grooveL, 1); // право
                    }
                    if (directGroove == directRabbeting) {
                        if (ribGroove == ribRabbeting) { // один край детали
                            var grooveValOne = grooveVal;
                        } else { // противоположные края детали
                            if (ribGroove == sideGroove) {
                                var grooveValOne = round(detailThickness - grooveVal - grooveD, 1);
                            } else {
                                var grooveValOne = (directGroove) ? round(detailFullWidth - grooveVal - grooveD, 1) :
                                    round(detailFullHeight - grooveVal - grooveD, 1); // приведем к одной стороне
                            }
                        }

                        if (sideGroove == sideRabbeting) {  // паз и четверть на одной стороне
                            var delta = round(grooveValOne - rabbetingD, 1);
                            if (delta > deltaMin && delta < deltaMax) {
                                showErrorMessage(
                                    LANG['BAD-VALUE']+` ${xy.toUpperCase()}. ` +LANG['NEDOSTATOCH-OTSTUP-FROM-PAZ-MUST']+ ` ${deltaMax} мм. `+LANG['OR-CAN-PERESEK']
                                );
                                rabbeting.setval('d', '');
                                rabbeting.focus('d');

                                return false;
                            }
                        } else if (arrPlane.indexOf(sideGroove) != -1) { // паз и четверть на противоположных сторонах
                            var delta = round(grooveValOne - rabbetingD, 1);
                            if (rabbetingIdent1 >= identMin2 && rabbetingIdent2 >= identMin2) {
                                continue;
                            }
                            if ((grooveIdent1 >= identMin1 || grooveIdent2 >= identMin1) ||
                                (grooveIdent1 >= identMin2 && grooveIdent2 >= identMin2)) {
                                continue;
                            }
                            var thickness = detailThickness - depth - grooveDepth;
                            if (delta < deltaMax && thickness < thicknessMin) {
                                showErrorMessage(
                                    LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+ LANG['NEDOSTAT-OTSTUP-PAZA-FROM-CHETV-L-BOLSH'] +` ${deltaMax} мм. `+LANG['OSTATOCH-WIDTH-NO-MORE']+` ${thicknessMin} мм.`
                                );
                                rabbeting.setval('z', '');
                                rabbeting.focus('z');

                                return false;
                            }
                        } else { // паз на торце
                            if (rabbetingIdent1 >= identMin2 && rabbetingIdent2 >= identMin2) {
                                continue;
                            }
                            if ((grooveIdent1 >= identMin1 || grooveIdent2 >= identMin1) ||
                                (grooveIdent1 >= identMin2 && grooveIdent2 >= identMin2)) {
                                continue;
                            }

                            if (sideRabbeting == 1) { // лицевая
                                var shiftR = (directGroove) ? grooveX : grooveY;
                            } else { // тыльная
                                var shiftR = (directGroove) ? detailThickness - grooveX - grooveD : detailThickness - grooveY - grooveD;
                            }
                            var thickness = round(shiftR - depth, 1);

                            if (ribGroove == ribRabbeting) {
                                if (thickness < deltaMaxR && thickness > deltaMinR) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+ LANG['NEDOSTAT-OTSTUP-FROM-CHETV'] +` ${deltaMaxR} мм.`
                                    );
                                    rabbeting.setval('z', '');
                                    rabbeting.focus('z');

                                    return false;
                                }
                            } else {
                                var shift = (directGroove) ? detailFullWidth - rabbetingD : detailFullHeight - rabbetingD;
                                var delta = round(shift - grooveDepth, 1);
                                if (delta < deltaMax && thickness < thicknessMin) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+LANG['NEDOSTAT-OTSTUP-FROM-CHETV']+` ${deltaMax} мм.`
                                    );
                                    rabbeting.setval('z', '');
                                    rabbeting.focus('z');

                                    return false;
                                }
                            }
                        }
                    }
                }

                // Проверка на отступ между двумя четвертями
                var rabbet;
                for (rabbet of detailRabbets) {
                    var tmpRabbetKey = detailRabbets.indexOf(rabbet);
                    if (tmpRabbetKey === rabbet_key) { // это та же четверть
                        continue;
                    }
                    var sideRabbetString = String(rabbet[0]);
                    var sideRabbet = Number(sideRabbetString.charAt(0)); // сторона детали
                    var ribRabbet = Number(sideRabbetString.charAt(1)); // край детали
                    if ([2, 4].indexOf(ribRabbet) !== -1) {
                        var directRabbet = 1; // вертикальное направление
                    } else {
                        var directRabbet = 0; // горизонтальное направление
                    }
                    var tmpD = round(Number(rabbet[3]), 1);
                    var tmpN = round(Number(rabbet[1]), 1);
                    var tmpL = round(Number(rabbet[4]), 1);
                    var tmpDepth = round(Number(rabbet[2]), 1);
                    var tmpFull = Number(rabbet[7]);
                    var tmpIdent1 = tmpN;
                    var tmpN2 = round(tmpN + tmpL, 1);
                    if (directRabbet) { //вертикальное направление
                        var tmpIdent2 = round(detailFullHeight - tmpN - tmpL, 1);
                        var xy = 'x';
                    } else {  // горизонтальное направление
                        var tmpIdent2 = round(detailFullWidth - tmpN - tmpL, 1);
                        var xy = 'y';
                    }

                    if (directRabbeting == directRabbet) {
                        if (ribRabbeting == ribRabbet) { // один край детали
                            var tmpValOne = tmpD;
                        } else { // противоположные края детали
                            var tmpValOne = (directRabbet) ? round(detailFullWidth - tmpD, 1) :
                                round(detailFullHeight - tmpD, 1); // приведем к одной стороне
                        }
                        if (sideRabbeting == sideRabbet) {  // четверти на одной стороне
                            if (ribRabbeting == ribRabbet) { // один край детали
                                if (((rabbetingN >= tmpN) && (rabbetingN2 <= tmpN2) && (rabbetingD <= tmpD) && (depth <= tmpDepth)) ||
                                    ((tmpN >= rabbetingN) && (tmpN2 <= rabbetingN2) && (tmpD <= rabbetingD) && (tmpDepth <= depth))) {
                                    showErrorMessage(
                                        LANG['NE-PUSK-ODNA-CHETV-IN-OTHER']
                                    );
                                    rabbeting.setval('n', '');
                                    rabbeting.focus('n');

                                    return false;
                                }
                            } else { // противоположные края
                                var delta = Math.abs(round(rabbetingD - tmpValOne, 1));
                                if (delta > deltaMin && delta < deltaMax) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+LANG['SMALL-OTSTUP-STR']+` ${deltaMax} мм. `+LANG['OR-PERESEK']
                                    );
                                    rabbeting.setval('d', '');
                                    rabbeting.focus('d');

                                    return false;
                                }
                            }
                        } else { // четверти на противоположных сторонах
                            var thickness = detailThickness - depth - tmpDepth;
                            if (ribRabbeting == ribRabbet) { // один край детали
                                if ((rabbetingIdent1 >= identMin1 && rabbetingIdent2 >= identMin1) ||
                                    (tmpIdent1 >= identMin1 && tmpIdent2 >= identMin1)) {
                                    var needErr = true;
                                    if (!rabbetingFull && !tmpFull &&
                                        ((rabbetingN > tmpN && (rabbetingN - tmpN2) >= deltaMax) ||
                                            (rabbetingN < tmpN && tmpN - rabbetingN2 >= deltaMax))) {
                                        needErr = false;
                                    }
                                    if (needErr && thickness < thicknessMin && thickness > 0) {
                                        showErrorMessage(
                                            LANG['NEVERN-ZNACH-DETH-TOLSHINA']+` ${thicknessMin} мм.
                                            `+LANG['OR-CAN-PERESEK-DETH']
                                        );
                                        rabbeting.setval('z', '');
                                        rabbeting.focus('z');

                                        return false;
                                    }
                                    if ((rabbetingN == tmpN) && (rabbetingN2 == tmpN2) && (rabbetingD == tmpD) && (thickness < thicknessMin)) {
                                        showErrorMessage(
                                            LANG['NO-SOVP-CHETV-ON-PROTIV-STORON']
                                        );
                                        rabbeting.setval('n', '');
                                        rabbeting.focus('n');

                                        return false;
                                    }
                                } else {
                                    if (thickness < thicknessMin) {
                                        showErrorMessage(
                                            LANG['NEVERN-ZNACH-DETH-TOLSHINA']+` ${thicknessMin} мм.
                                         `+LANG['OR-OTSTUP-FROM-KRAI-NO-SMALL']+` ${identMin1} мм.`
                                        );
                                        rabbeting.setval('z', '');
                                        rabbeting.focus('z');

                                        return false;
                                    }
                                }
                            } else { // противоположные края
                                if (rabbetingIdent1 >= identMin1 && rabbetingIdent2 >= identMin1) {
                                    continue;
                                }
                                if (tmpIdent1 >= identMin1 && tmpIdent2 >= identMin1) {
                                    continue;
                                }
                                var delta = Math.abs(round(rabbetingD - tmpValOne, 1));
                                if ((delta < deltaMax) && (thickness < thicknessMin)) {
                                    showErrorMessage(
                                        LANG['NEVERN-ZNACH-DETH-TOLSHINA']+` ${thicknessMin} мм.
                                         `+LANG['OR-OTSTUP-FROM-KRAI-NO-SMALL']+` ${identMin1} мм.`
                                    );
                                    rabbeting.setval('z', '');
                                    rabbeting.focus('z');

                                    return false;
                                }
                            }
                        }
                    }

                }

                return true;
            }
        },
        init(data, global_data) {

            rabbeting.super();
            // заполняем массив параметров
            rabbeting.cache.params = global_data.rabbets_data;
            // заполняем массив с четвертями
            rabbeting.functions.data(data.rabbets);
            // билдим таблицу четвертями
            rabbeting.use('table');

            rabbeting.use('setRabbetSide', [global_data.rabbets_data.getRabbetSides]);
            rabbeting.use('setRabbetPattern', [global_data.rabbets_data.getRabbetPatterns]);
            if (ro) {
                rabbeting.disabled('rabbets', true);
                return;
            }

            if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives)) {
                $('.text-danger').hide();
                rabbeting.hideinput('rabbetCheckExtForm');
            }

            rabbeting.method('full');
        },
        reinit(data) {
            // reinit method, for default can use init
            // rabbeting.init(data);

            rabbeting.functions.data(data.rabbets);
            // билдим таблицу четвертями
            rabbeting.use('table');
            rabbeting.setval('n', '');
            rabbeting.setval('d', '');
            rabbeting.setval('l', '');
            rabbeting.setval('z', '');
            rabbeting.setval('full', true);
            rabbeting.setval('type', 1);
            rabbeting.setval('side', 15);
        }
    };

    return rabbeting;
});
