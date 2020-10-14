var groove_linking_y = false;
var groove_linking_x = false;
var old_side_value = document.getElementById('grooveSideSelect').value;
var old_type_value = document.getElementById('groovePresetSelect').value;
function delGroove(grooveKey) {
    var grooving = g_detail.getModule('grooving');
    g_detail.rmOperation(
        'groove',
        {
            detail_key: detailKey,
            groove_key: grooveKey
        },
        function (data) {
            var val = data[1];
            var data = data[0];
            grooving.use('data', [data]);
            grooving.use('table');

            $('.svg-grooves-' + grooveKey).remove();

            if (grooveKey != detailGrooves.length) {
                for (var i = grooveKey + 1; i < detailGrooves.length + 1; i++) {
                    var svg;
                    while (svg = document.getElementsByClassName('svg-grooves-' + i)[0]) {
                        svg.classList.remove('svg-grooves-' + i);
                        svg.classList.add('svg-grooves-' + (i - 1));
                    }
                }
            }
        }
    );
}

function editGroove(grooveKey) {
    var active_tab = sessionStorage.getItem('active-edit');
    var position2 = $('#'+ active_tab).position();

    if(active_tab == $('#modal8').attr('id')&& position2 != undefined && $('#'+ active_tab).css("display")!="none"){
        sessionStorage.setItem("modal-left", position2.left);
        sessionStorage.setItem("modal-top", position2.top);
        sessionStorage.removeItem('active-edit');
    }
    if(active_tab!=$('#modal8').attr('id')) {
        if(position2 != undefined && $('#'+ active_tab).css("display")!="none") {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);
        }
        $('#' + active_tab).css("display","none");
        $('*[data-id="'+ active_tab + '"]').removeClass('active');
        sessionStorage.setItem('active-edit', $('#modal8').attr('id'));
    }
    if( $('.left-container-menu').hasClass('active')){
        $('.left-container-menu').removeClass('active');
        $('.modalwin').css("display","none");
    }
    if(sessionStorage.getItem('modal-left') == null && sessionStorage.getItem('modal-right') == null) {
        $('#modal8').css("display","block");
        $('#modal8').css("left","75px");
    }else{
        $('#modal8').css("display","block");
        $('#modal8').css("left",sessionStorage.getItem('modal-left')+"px");
        $('#modal8').css("top",sessionStorage.getItem('modal-top')+"px");
    }
    sessionStorage.setItem('active-edit',$('#modal8').attr('id'));
    $('*[data-id="modal8"]').addClass('active');
    $('#modal8').draggable({ containment: "html" });
    var grooving = g_detail.getModule('grooving');
    var data = grooving.functions.data_to_object(detailGrooves[grooveKey]);
    //Если количество знаков после запятой более одного, то округляем
    if (grooving.functions.getNumberAfterPoint(data['l']) > 1){
        data['l'] = data['l'].toFixed(1);
    }
    grooving.setval('full',
        (data['l'] == 0 ||
        (data['type'] == 0 && data['l'] >= detailWidth ||
        data['type'] == 1 && data['l'] >= detailHeight))
    );
    grooving.setval('ext', data['ext']);
    grooving.setval('side', data['side']);
    grooving.method('side');

    if (data['preset_type'] && data['preset_type'] != '0') {
        grooving.setval('type', data['preset_type']);
        grooving.method('type', data['preset_type']);
        if (data['article']) {
            grooving.setval('art', data['article']);
            grooving.method('art', data['article']);
        }
    } else {
        grooving.setval('type', 0);
        grooving.method('type', 0);
    }

    grooving.setval('direct', data['type']);

    if(grooving.getval('full')){ // if on full width (grooveAllWidth)
        if (data['type'] == '0'){ //if horizontal
            grooving.showinput('field_y');
            grooving.hideinput('field_x');
        }else{ //if vertical
            grooving.showinput('field_x');
            grooving.hideinput('field_y');
        }
    }

    if (data['bindV'] == 'true') {
        if (data['type'] == 0) {
            grooving.setval('x', Math.round(detailFullWidth - Number(data['x']) - Number(data['l'])));
        } else {
            grooving.setval('x', Math.round(detailFullWidth - Number(data['x']) - Number(data['d'])));
        }
    } else {
        grooving.setval('x', Number(data['x']));
    }

    if (data['bindH'] == 'true') {
        if (data['type'] == 0) {
            grooving.setval('y', Math.round(detailFullHeight - Number(data['y']) - Number(data['d'])));
        } else {
            grooving.setval('y', Math.round(detailFullHeight - Number(data['y']) - Number(data['l'])));
        }
    } else {
        grooving.setval('y', Number(data['y']));
    }

    grooving.setval('z', data['z']);
    grooving.setval('d', data['d']);
    grooving.setval('l', data['l']);
    if(grooving.getval('d') != '' && grooving.getval('d')!= null) {
        grooving.functions.setXYAfterCheckD(false);
    }
    if (data['radius']){
        grooving.setval('groove_r', data['radius']);
    }
    grooving.functions.checkMinDLForActiveRadius();
    groove_key = grooveKey;

    var add = grooving.getinput('add');
    add.innerText = LANG['SAVE'];
    add.classList.add('btn-danger');
    add.classList.remove('btn-success');

    grooving.setval('link_x', data['bindV'] == 'true' ? 'r' : 'l');
    grooving.setval('link_y', data['bindH'] == 'true' ? 't' : 'b');
    grooving.method('link_x', grooving.getval('link_x'));
    grooving.method('link_y', grooving.getval('link_y'));

    $('#groovesTable tr').removeClass("info");
    $('#groovesTable tr.danger-edit').removeClass("danger-edit").addClass("danger");
    $("#grooveKeyId-" + grooveKey).addClass("info");
    $("#grooveKeyId-" + grooveKey + '.danger').addClass("danger-edit").removeClass("danger");
    $('#collapseGrooving').collapse("show");

    grooving.methods.type();

    window.frames[0]
        ? window.frames[0].document.getElementById('panel-grooving').scrollIntoView()
        : window.document.getElementById('panel-grooving').scrollIntoView();
}

define(function (require, exports, module) {

    var grooving = {
        // наследуюмся от обьекта Module переданного из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        inputs: {
            get full() {
                return document.getElementById('grooveAllWidth');
            },
            get side() {
                return document.getElementById('grooveSideSelect');
            },
            get type() {
                return document.getElementById('groovePresetSelect');
            },
            get direct() {
                return document.getElementById('grooveTypeSelect');
            },
            get art() {
                return document.getElementById('grooveArtSelect');
            },
            get x() {
                return document.getElementById('groove_x');
            },
            get y() {
                return document.getElementById('groove_y');
            },
            get z() {
                return document.getElementById('groove_z');
            },
            get l() {
                return document.getElementById('groove_l');
            },
            get d() {
                return document.getElementById('groove_d');
            },
            get ext() {
                return document.getElementById('grooveExt');
            },
            get link_x() {
                return document.getElementById('grooveLinkX');
            },
            get link_y() {
                return document.getElementById('grooveLinkY');
            },
            get center_x() {
                return document.getElementById('centerX');
            },
            get center_y() {
                return document.getElementById('centerY');
            },
            get add() {
                return document.getElementById('addButtonGroove');
            },
            get field_art() {
                return document.getElementById('grooveArtSelectField');
            },
            get field_x() {
                return document.getElementById('grooveXFieldset');
            },
            get field_y() {
                return document.getElementById('grooveYFieldset');
            },
            get field_z() {
                return document.getElementById('grooveZFieldset');
            },
            get field_d() {
                return document.getElementById('grooveDFieldset');
            },
            get field_l() {
                return document.getElementById('grooveLFieldset');
            },
            get field_full() {
                return document.getElementById('grooveAllWidthField');
            },
            get table() {
                return document.getElementById('additives-tbl-container-grooves');
            },
            get grooveRFieldset(){
                return document.getElementById('grooveRFieldset');
            },
            get groove_r(){
                return document.getElementById('groove_sp_r');
            }
        },
        methods: {
            full(e) {
                if (grooving.getval('full')) {
                    grooving.hideinput('field_l');
                    if (Number(grooving.getval('direct'))) { // == 1
                        grooving.setval('y', '');
                        grooving.hideinput('field_y');
                        grooving.showinput('field_x');
                        grooving.setval('l', detailFullHeight.toFixed(1));
                    } else {    // == 0
                        grooving.setval('x', '');
                        grooving.hideinput('field_x');
                        grooving.showinput('field_y');
                        grooving.setval('l', detailFullWidth.toFixed(1));
                    }
                } else {
                    grooving.showinput('field_x');
                    grooving.showinput('field_y');
                    grooving.showinput('field_l');
                }
                grooving.functions.showHideR();
            },
            side(e) {
                // if (!flag) {
                //     freeFields();
                // }

                var side = Number(grooving.getval('side'));
                grooving.functions.showHideR();

                if ([1, 6].indexOf(side) !== -1) {
                    grooving.disabled('direct', false);
                    grooving.disabled('full', false);
                    grooving.disabled('link_x', false);
                    grooving.disabled('link_y', false);

                    var l = grooving.getinput('link_x');
                    l.options[0].innerHTML = LANG['LEFT-S'];
                    l.options[1].innerHTML = LANG['RIGHT-S'];
                    l = grooving.getinput('link_y');
                    l.options[0].innerHTML = LANG['BOTTOM-N'];
                    l.options[1].innerHTML = LANG['TOP-V'];
                } else {
                    if (detailThickness < 16) {
                        showErrorMessage(
                            LANG['OPERTAION-MENSH-16']
                        );
                        grooving.setval('side', 1);
                        grooving.focus('side');
                        return false;
                    }

                    // grooving.setval('full', true);
                    // grooving.method('full');
                    //grooving.disabled('full', true); //255679

                    if ([2, 4].indexOf(side) !== -1) { // == 2 || 4
                        grooving.setval('direct', 1);
                        grooving.disabled('direct', true);
                        //grooving.checked('full', true); //255679
                        grooving.setval('link_x', 'l');
                        grooving.disabled('link_x', true);
                        grooving.getinput('link_x').options[0].innerHTML = LANG['PREDNIE'];

                    } else { // == 3 || 5
                        grooving.setval('direct', 0);
                        grooving.disabled('direct', true);
                        //grooving.checked('full', true); //255679
                        grooving.setval('link_y', 'b');
                        grooving.disabled('link_y', true);
                        grooving.getinput('link_y').options[0].innerHTML = LANG['PREDNIE'];
                    }
                }

                if (['wood', 'compact'].includes(materialType) && (['fanera'].includes(materialType) && isMillAdditives)) {
                    $('.text-danger').hide();
                }

               if(grooving.getval('type') != 0){
                   grooving.use('set_types',[grooving.getval('type')]);
               }else{
                   grooving.use('set_types');
               }
                if(grooving.getval('type') == 0){
                    if(grooving.getval('d') == 3.2 || grooving.getval('d') == 18){
                        grooving.setval('d', '');
                    }
                    if(grooving.getval('z') == 8){
                        grooving.setval('z', '');
                    }
                    if(grooving.getval('l') == 1000){
                        grooving.setval('l', '');
                    }
                        if(grooving.getval('d') == '') {
                            grooving.setval('y', '');
                            grooving.setval('x', '');
                            grooving.functions.setXYAfterCheckD(true);
                        }
                    if ([2,3,4,5].indexOf(side) !== -1 && [1, 6].indexOf(old_side_value) !== -1 || [1,6].indexOf(side) !== -1 && [2,3,4,5].indexOf(old_side_value) !== -1 ) {
                        grooving.setval('d', '');
                        grooving.setval('z', '');
                        grooving.setval('l', '');
                        grooving.setval('y', '');
                        grooving.setval('x', '');
                        grooving.functions.setXYAfterCheckD(true);
                        if([2,3,4,5].indexOf(side) !== -1 && [1, 6].indexOf(old_side_value) !== -1){
                            grooving.change('type',0);
                        }
                    }
                }
                if(old_side_value != side){
                    old_side_value = side;
                }
                markSide(side);
            },
            type(e) {
                if (!grooving.use('check_type')) {
                    grooving.setval('type', '0');
                    grooving.change('type');
                    return;
                }
                var side = grooving.getval('side');
                var data = grooving.cache.params.params[e.target.value];

                grooves.length = 0;
                var s;

                for (var key in data) {
                    var z = data[key]['z'][detailThickness] || data[key]['z'][0];
                    s = (data[key]['side'] === '') ? side : data[key]['side'];

                    // ---- автоподстановка ----
                    if (data[key]['x'] === 'w/2') {
                        data[key]['x'] = detailWidth / 2;
                    } else if (data[key]['x'] === 'h/2') {
                        data[key]['x'] = detailHeight / 2;
                    } else if (data[key]['x'] === 't/2') {
                        data[key]['x'] = detailThickness / 2;
                    }
                    if (data[key]['y'] === 'w/2') {
                        data[key]['y'] = detailWidth / 2;
                    } else if (data[key]['y'] === 'h/2') {
                        data[key]['y'] = detailHeight / 2;
                    } else if (data[key]['y'] === 't/2') {
                        data[key]['y'] = detailThickness / 2;
                    }
                    // ------------------------
                    grooves.push([
                        s,
                        data[key]['type'],
                        data[key]['x'],
                        data[key]['y'],
                        z,
                        data[key]['d'],
                        data[key]['l'],
                        data[key]['ext']
                    ]);
                }

                ['x', 'y', 'z', 'd'].forEach((v, k) => {
                    if (grooves[0][k + 2] === '') {
                        grooving.showinput('field_' + v);
                    } else {
                        grooving.setval(v, grooves[0][k + 2]);
                        grooving.hideinput('field_' + v);
                    }
                });

                if (grooves[0][6] === '') {
                    if (grooving.getval('ext')) {
                        grooving.showinput('field_l');
                    }
                } else {
                    grooving.setval('l', grooves[0][6]);
                    grooving.hideinput('field_l');
                }

                // $('#grooveBindFieldset').show();
                var type_k = Number(e.target.value);

                if(type_k === 0){
                    grooving.hideinput('field_art');
                    grooving.setval('art', '0');
                    grooving.showinput('field_full');
                    grooving.disabled('ext', false);
                    if(grooving.getval('d') == 3.2 || grooving.getval('d') == 18){
                        grooving.setval('d', '');
                    }
                    if(grooving.getval('z') == 8){
                        grooving.setval('z', '');
                    }
                    if(grooving.getval('l') == 1000){
                        grooving.setval('l', '');
                    }
                        if(grooving.getval('d') == '') {
                            grooving.setval('y', '');
                            grooving.setval('x', '');
                            grooving.functions.setXYAfterCheckD(true);
                        }
                        draw();
                }else if (type_k > 1) {
                    var art = grooving.getinput('art');
                    art.length = 0;
                    for (var key in data) {
                        art.options[art.length] = new Option(key, key);
                    }
                    grooving.showinput('field_art');

                    if (type_k === 2) {
                        // grooving.showinput('field_x');
                        // grooving.showinput('field_y');
                        // grooving.hideinput('field_z');
                        // grooving.hideinput('field_d');
                        // grooving.hideinput('field_l');
                        grooving.setval('full', false);
                        grooving.hideinput('field_full');
                    } else if (type_k === 3) {
                        grooving.showinput('field_full');
                        // grooving.hideinput('field_x');
                        // grooving.hideinput('field_y');
                        // grooving.hideinput('field_z');
                        // grooving.hideinput('field_d');
                        // grooving.hideinput('field_l');
                    } else if (type_k === 4) {
                        // grooving.showinput('field_z');
                        // grooving.showinput('field_d');
                        // grooving.showinput('field_l');
                        //grooving.setval('full', true);
                        grooving.showinput('field_full');
                    }
                } else {
                    grooving.hideinput('field_art');
                    grooving.setval('art', '0');
                    grooving.showinput('field_full');
                    grooving.disabled('ext', false);
                }

                grooving.method('link_x', grooving.getval('link_x'));
                grooving.method('link_y', grooving.getval('link_y'));

                var side = grooving.getval('side');
                var direct = grooving.getval('direct');
                if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives) ||
                    (((side == '2' || side == '4') || ((side == '1' || side == '6') && direct == '1')) && kromkaTop == '' && kromkaBottom == '') ||
                    (((side == '3' || side == '5') || ((side == '1' || side == '6') && direct == '0')) && kromkaLeft == '' && kromkaRight == '')) {
                    $('#grooveExtFieldset').hide();
                } else {
                    $('#grooveExtFieldset').show();
                }

                if (grooving.getval('type') == "0" && grooving.getval('d') == '') {
                    grooving.functions.setXYAfterCheckD(true);
                } else {
                    grooving.functions.setXYAfterCheckD(false);
                }
                grooving.method('full');
                grooving.functions.checkMinDLForActiveRadius();
            },
            direct(e) {
                grooving.method('type', grooving.getval('type'));
                if (grooving.getval('z') != "" && grooving.getval('d') != "" || grooving.getval('type') == 1) {
                    grooving.functions.setXYAfterCheckD(false);
                } else {
                    grooving.functions.setXYAfterCheckD(true);
                }

                var side = grooving.getval('side');
                var direct = grooving.getval('direct');
                if (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives) ||
                    (((side == '2' || side == '4') || ((side == '1' || side == '6') && direct == '1')) && kromkaTop == '' && kromkaBottom == '') ||
                    (((side == '3' || side == '5') || ((side == '1' || side == '6') && direct == '0')) && kromkaLeft == '' && kromkaRight == '')) {
                    $('#grooveExtFieldset').hide();
                } else {
                    $('#grooveExtFieldset').show();
                }
            },
            art(e) {
                var i = grooving.getinput('art').selectedIndex;

                if(grooves[i]) {
                    ['z', 'd', 'l'].forEach((v, k) => {         // grooving.setval('z', grooves[i][4]);
                        grooving.setval(v, grooves[i][4 + k]);     // grooving.setval('d', grooves[i][5]);
                    });                                         // grooving.setval('l', grooves[i][6]);
                }
            },
            x(e) {
                grooving.use('calc', [e.target, 2]);
                grooving.use('check_x', []);
            },
            y(e) {
                grooving.use('calc', [e.target, 2]);
                grooving.use('check_y', []);
            },
            z(e) {
                grooving.use('calc', [e.target]);
                grooving.use('check_z', []);
            },
            l(e) {
                grooving.use('calc', [e.target]);
                grooving.use('check_l', []);
            },
            d(e) {
                grooving.use('calc', [e.target]);
                grooving.use('check_d', []);
            },
            groove_r(e){
                grooving.use('calc', [e.target, 0]);
            },
            link_x(e) {
                groove_linking_x = (e.target.value === 'r');
                // if (groove_linking_x) {
                //     grooving.hideinput('center_x');
                // } else {
                //     grooving.showinput('center_x');
                // }
            },
            link_y(e) {
                groove_linking_y = (e.target.value === 't');
                // if (groove_linking_y) {
                //     grooving.hideinput('center_y');
                // } else {
                //     grooving.showinput('center_y');
                // }
            },
            add(e) {
                if (
                    grooving.use('check_x') &&
                    grooving.use('check_y') &&
                    grooving.use('check_d') &&
                    grooving.use('check_z') &&
                    grooving.use('check_l') &&
                    grooving.use('check_r') &&
                    grooving.use('check_type') &&
                    grooving.use('checkGroovingAndRabbets')
                ) {
                    var ext = grooving.getval('ext');
                    var art = grooving.getval('art');
                    var x = Number(grooving.getval('x'));
                    var y = Number(grooving.getval('y'));
                    var d = Number(grooving.getval('d'));
                    var l = Number(grooving.getval('l'));
                    if ($('#grooveRFieldset').is(":hidden")){
                        var radius = 0;
                    } else{
                        var radius = Number(grooving.getval('groove_r'));
                    }

                    if (groove_linking_x) {
                        x = detailFullWidth - x;
                        console.log(Number(grooving.getval('direct')));
                        if (Number(grooving.getval('direct'))) { // == 1
                            x -= d;
                        } else { // == 0
                            x -= l;
                        }
                    }

                    if (groove_linking_y) {
                        y = detailFullHeight - y;
                        console.log(Number(grooving.getval('direct')));
                        if (Number(grooving.getval('direct'))) { // == 1
                            y -= l;
                        } else { // == 0
                            y -= d;
                        }
                    }

                    var sides = getSides('groove');
                    if (sides[0] == sides[1]) {
                        showConfirmMessage(
                            LANG['DECOR-SIDE-OBR-CONF'],
                            grooving.functions.send,
                            {
                                x: x,
                                y: y,
                                groove_linking_y: groove_linking_y,
                                groove_linking_x: groove_linking_x,
                                grooveExt: ext,
                                article: art,
                                radius: radius
                            }
                        );
                    } else {
                        grooving.functions.send({
                            x: x,
                            y: y,
                            groove_linking_y: groove_linking_y,
                            groove_linking_x: groove_linking_x,
                            grooveExt: ext,
                            article: art,
                            radius: radius
                        });
                    }
                } else console.error('Checking grooving is not passed.');

                if(fromViyarEmail){
                    $('#' + sessionStorage.getItem('active-edit')).css("display","none");
                    $('*[data-id=' + sessionStorage.getItem('active-edit') + ']').removeClass('active');
                }
            },
            center_x(e) {
                var decrement = 0;
                var direct = Number(grooving.getval('direct'));
                if (direct) {
                    decrement = Number(grooving.getval('d'));
                } else {
                    decrement = Number(grooving.getval('l'));
                }
                if ([1, 6].indexOf(Number(grooving.getval('side'))) !== -1) {
                    grooving.setval('x', (detailFullWidth - decrement) / 2);
                } else {
                    if (direct){
                        grooving.setval('x', (detailThickness - decrement) / 2);
                    } else{
                        grooving.setval('x', (detailFullWidth - decrement) / 2);
                    }
                }
                grooving.method('x');
            },
            center_y(e) {
                var decrement = 0;
                var direct = Number(grooving.getval('direct'));
                if (direct) {
                    decrement = Number(grooving.getval('l'));
                } else {
                    decrement = Number(grooving.getval('d'));
                }
                if ([1, 6].indexOf(Number(grooving.getval('side'))) !== -1) {
                    grooving.setval('y', (detailFullHeight - decrement) / 2);
                } else {
                    if (direct){
                        grooving.setval('y', (detailFullHeight - decrement) / 2);
                    } else{
                        grooving.setval('y', (detailThickness - decrement) / 2);
                    }
                }
                grooving.method('y');
            },
            clear(){
                grooving.setval('d', '');
                grooving.setval('z', '');
                grooving.setval('l', '');
                grooving.setval('y', '');
                grooving.setval('x', '');
                grooving.setval('groove_r', '');
            }
        },
        functions: {
            calc(el, points = 1) {
                var val = el.value;
                if (val !== '') {
                    if (isNaN(Number(val))) {
                        val = eval(val.replace(/,/g, '.')).toFixed(points);
                    } else{
                        val = parseFloat(val.replace(/,/g, '.')).toFixed(points);
                    }
                    el.value = val;
                }
                return val;
            },
            check_type() {
                if (Number(grooving.getval('type')[0]) === 3 && detailThickness !== 18) {
                    showErrorMessage(LANG['NEVERN-ZNACH-WIDTH-DET']);
                    return false;
                }
                return true;
            },
            check_x() {
                var side = Number(grooving.getval('side'));
                var val = Number(grooving.getval('x'));
                var len = Number(grooving.getval('l'));
                var d = Number(grooving.getval('d'));
                var direct = Number(grooving.getval('direct'));
                var linkX = grooving.getval('link_x');
                var ext = Number(grooving.getval('ext'));
                var minDistanceForGrooveOpen = grooving.cache.params.minDistanceForGrooveOpen;
                var minDistanceForGrooveClosed = grooving.cache.params.minDistanceForGrooveClosed;
                var minIndent = minDistanceForGrooveOpen;
                if (ext && kromkaLeft && kromkaRight && kromkaBottom && kromkaTop){
                    minIndent = minDistanceForGrooveClosed;
                }

                var min = 0;
                var max = 0;

                if (!d) {
                    d = (len > 0 && len < 120) ? 6 : 4;
                }

                val = Math.abs(val);
                d = Math.abs(d);

                if (direct) {
                    if ([2, 4].indexOf(side) !== -1) { // side == 2 || 4
                        min = 5;
                        max = detailThickness - 5; // -min
                    } else {
                        if(linkX == 'l') {
                            min = minIndent + kLeftThick;
                            max = detailWidth + kLeftThick - minIndent - d ;
                        }else{
                            min = minIndent + kRightThick;
                            max = detailWidth + kRightThick - minIndent - d;
                        }
                    }
                } else {
                    if (val === 0) {
                        return true;
                    }
                    max = kLeftThick + detailWidth + kRightThick - 6; //- min
                }

                if (materialType == 'compact') min = 4;

                if ((val < min || val > max) && grooving.getval('d') > 0) {
                    showErrorMessage(
                        LANG['NEVER-ZNACH-X-MUST-BE']+` ${min} мм до ${max} мм.`
                    );
                    grooving.setval('x', '');
                    grooving.focus('x');
                    return false;
                }

                grooving.setval('x', val);
                return true;
            },
            check_y() {
                var side = Number(grooving.getval('side'));
                var val = Number(grooving.getval('y'));
                var len = Number(grooving.getval('l'));
                var d = Number(grooving.getval('d'));
                var direct = Number(grooving.getval('direct'));
                var linkY = grooving.getval('link_y');
                var ext = Number(grooving.getval('ext'));
                var minDistanceForGrooveOpen = grooving.cache.params.minDistanceForGrooveOpen;
                var minDistanceForGrooveClosed = grooving.cache.params.minDistanceForGrooveClosed;
                var minIndent = minDistanceForGrooveOpen;
                if (ext && kromkaLeft && kromkaRight && kromkaBottom && kromkaTop){
                    minIndent = minDistanceForGrooveClosed;
                }

                var max = 0;
                var min = 0;

                if (!d) {
                    d = (len > 0 && len < 120) ? 6 : 4;
                }

                val = Math.abs(val);
                d = Math.abs(d);

                if (direct) { // == 1
                    if (val === 0) {
                        return true;
                    }
                    max = kTopThick + detailHeight + kBottomThick - 6; // - min
                } else { // == 0
                    if ([3, 5].indexOf(side) !== -1) { // side == 3 || 5
                        min = 5;
                        max = detailThickness - 5; // - min
                    } else {
                        if (linkY == 'b') {
                            min = minIndent + kBottomThick;
                            max = detailHeight + kBottomThick - minIndent - d;
                        }else{
                            min = minIndent + kTopThick;
                            max = detailHeight + kTopThick - minIndent - d;
                        }
                    }
                }

                if (materialType == 'compact') min = 4;

                if ((val < min || val > max) && grooving.getval('d') > 0) {
                    showErrorMessage(
                        LANG['NEVERN-ZNACH-Y-MUST-BE']+`${min} мм до ${max} мм.`
                    );
                    grooving.setval('y', '');
                    grooving.focus('y');

                    return false;
                }

                grooving.setval('y', val);
                return true;
            },
            check_l() {
                var min;
                var max;
                var direct = Number(grooving.getval('direct'));
                var x = Number(grooving.getval('x'));
                var y = Number(grooving.getval('y'));
                var d = Number(grooving.getval('d'));
                var l = Number(grooving.getval('l'));
                var full = grooving.getval('full');
                var side = Number(grooving.getval('side'));

                if (direct) { // == 1
                    max = (kTopThick + detailHeight + kBottomThick - y).toFixed(1);
                } else { // == 0
                    max = (kLeftThick + detailWidth + kRightThick - x).toFixed(1);
                }

                if (full) {
                    min = 0;
                } else {
                    if ([2, 4, 3, 5].indexOf(side) !== -1){
                        min = 100;
                    } else{
                        min = d < 6 ? 120 : 10;
                    }
                }

                if (l < min || l > max) {
                    showErrorMessage(
                        LANG['NEVERN-ZNACH-DLINA']+`${min} мм до ${max} мм.`
                    );
                    grooving.setval('l', '');
                    grooving.focus('l');
                    return false;
                }

                grooving.functions.checkMinDLForActiveRadius();

                return true;
            },
            check_r() {
                var radius = Number(grooving.getval('groove_r'));
                var min = 3;
                var max = Math.floor(Math.min(grooving.getval('d'), grooving.getval('l')) / 2);
                if ((radius < min || radius > max) && $('#grooveRFieldset').is(":visible") && Math.min(grooving.getval('d'), grooving.getval('l')) > 6){
                    showErrorMessage(
                        LANG['BAD-VALUE-RADIUS-MUST']+`${min} мм до ${max} мм.`
                    );
                    return false;
                }
                grooving.functions.checkMinDLForActiveRadius();
                return true;
            },
            check_d() {
                var d = Number(grooving.getval('d'));
                var full = grooving.getval('full');

                var len = Number(grooving.getval('l'));
                var x = Number(grooving.getval('x'));
                var y = Number(grooving.getval('y'));
                var direct = Number(grooving.getval('direct'));
                var side = Number(grooving.getval('side'));
                var ext = Number(grooving.getval('ext'));
                var minDistanceForGrooveOpen = grooving.cache.params.minDistanceForGrooveOpen;
                var minDistanceForGrooveClosed = grooving.cache.params.minDistanceForGrooveClosed;
                var minIndent = minDistanceForGrooveOpen;
                if (ext && kromkaLeft && kromkaRight && kromkaBottom && kromkaTop){
                    minIndent = minDistanceForGrooveClosed;
                }

                if ([1, 6].indexOf(side) !== -1){
                    var min = 3.2;
                    var max = 4;
                } else{
                    var min = 2.5;
                    var max = 8;
                }

                if (materialType == 'compact') {
                    var min = 8;
                }

                if (direct) { // == 1
                    if (x + d > kLeftThick + detailWidth + kRightThick) {
                        showErrorMessage(LANG['PAZ-PREDEL-DETAIL']);
                        grooving.setval('d', '');
                        grooving.functions.setXYAfterCheckD(true);
                        grooving.focus('d');
                        return false;
                    }
                    if ([1, 6].indexOf(side) !== -1) {
                        max = kLeftThick + detailWidth + kRightThick - minIndent - (x || minIndent);
                    } else if ([2, 4].indexOf(side) !== -1) {
                        max = detailThickness - x - 5; // min_dest
                    } else { // == 3 || 5
                        max = detailThickness - y - 5; // min_dest
                    }
                } else { // == 0
                    if (y + d > kTopThick + detailHeight + kBottomThick) {
                        showErrorMessage(LANG['PAZ-PREDEL-DETAIL']);
                        grooving.setval('d', '');
                        grooving.functions.setXYAfterCheckD(true);
                        grooving.focus('d');
                        return false;
                    }
                    if ([1, 6].indexOf(side) !== -1) {
                        max = kTopThick + detailHeight + kBottomThick - minIndent - (y || minIndent);
                    } else if ([2, 4].indexOf(side) !== -1) {
                        max = detailThickness - x - 5; // min_dest
                    } else { // == 3 || 5
                        max = detailThickness - y - 5; // min_dest
                    }
                }

                if (max < min) {
                    if ([1, 6].indexOf(side) !== -1) {
                        max = min;
                    } else {
                        showErrorMessage(LANG['UNREAL-SODATPAS-OTSTUP']);
                        grooving.setval('d', '');
                        grooving.functions.setXYAfterCheckD(true);
                        grooving.focus('d');
                        return false;
                    }
                }

                //ограничение по max ширине торцевого паза на толстой или сращенной детали
                if (([1, 6].indexOf(side) == -1) && (detailThickness > 18)) {
                    max = 8;
                }

                if (d < min || d > max) {
                    if (d != 3.2) {
                        showErrorMessage(LANG['NEVERN-ZNACH-SHIRINA']+` ${min} мм до ${max} мм.`);
                        grooving.setval('d', '');
                        grooving.functions.setXYAfterCheckD(true);
                        grooving.focus('d');
                        return false;
                    }
                }

                if (grooving.getval('d') == "") {
                    grooving.functions.setXYAfterCheckD(true);
                    grooving.setval('x', '');
                    grooving.setval('y', '');
                } else {
                    grooving.functions.setXYAfterCheckD(false);
                }

                grooving.functions.checkMinDLForActiveRadius();
                return true;
            },
            check_z() {
                var min = 1;
                var max = 18;

                var side = Number(grooving.getval('side'));
                var val = Number(grooving.getval('z'));
                var full = grooving.getval('full');
                var gWidth = grooving.getval('d');
                var gLength = grooving.getval('l');

                val = Math.abs(val);

                if ([1, 6].indexOf(side) !== -1) { // side == 1 || 6
                    if (Number(grooving.getval('type')) === 2) {
                        max = detailThickness - 2.5;
                    } else {
                        if (detailThickness > 11 && detailThickness < 26){
                            if (full){
                                if (Math.min(gWidth, gLength) < 20){
                                    max = detailThickness / 2 + 1;
                                } else{
                                    max = detailThickness - 5;
                                }
                            } else{
                                if (Math.min(gWidth, gLength) < 6){
                                    max = detailThickness / 2 + 1;
                                } else{
                                    max = detailThickness - 5;
                                }
                            }
                        } else{
                            max = detailThickness / 2 + 1;
                        } 
                    }
                }

                if (materialType == 'compact') {
                    max = 9;
                }

                if (val < min || val > max) {
                    showErrorMessage(
                        LANG['NEVERN-ZNACH-GLUB'] + ` ${min} мм до ${max} мм.`
                    );
                    grooving.setval('z', '');
                    grooving.focus('z');
                    return false;
                }

                grooving.setval('z', val);
                return true;
            },
            checkGroovingAndRabbets() {
                var groovingD = Number(grooving.getval('d'));
                var directGrooving = Number(grooving.getval('direct'));
                if (directGrooving) {
                    var val = Number(grooving.getval('x'));
                    var xy = 'x';
                } else {
                    var val = Number(grooving.getval('y'));
                    var xy = 'y';
                }
                var side = Number(grooving.getval('side'));

                var deltaMin = 0;
                var deltaMax = 6;
                var deltaMinR = 0;
                var deltaMaxR = 5;
                var thicknessMin = 7;
                var sideGrooving = Number(side);
                var identMin1 = 80;
                var identMin2 = 20;
                var arrPlane = [1,6];
                var arrRibs = [2,3,4,5];
                var arrRibsX = [2,4];
                var arrRibsY = [3,5];

                var linkX = grooving.getval('link_x');
                var linkY = grooving.getval('link_y');

                if (arrPlane.indexOf(sideGrooving) != -1) {
                    if (directGrooving) {
                        switch (linkX) {
                            case 'l':
                                var ribGrooving = 2;
                                break;
                            case 'r':
                                var ribGrooving = 4;
                                break;
                            default:
                                console.error(LANG['NE-UDALOS-CODE-PAZA']);
                        }
                    } else {
                        switch (linkY) {
                            case 't':
                                var ribGrooving = 3;
                                break;
                            case 'b':
                                var ribGrooving = 5;
                                break;
                            default:
                                console.error(LANG['NE-UDALOS-CODE-PAZA']);
                        }
                    }
                } else {
                    var ribGrooving = sideGrooving;
                }

                var depth = Number(grooving.getval('z'));
                var groovingX = Number(grooving.getval('x'));
                var groovingY = Number(grooving.getval('y'));
                var groovingL = Number(grooving.getval('l'));
                var groovingIdent1 = (directGrooving) ? groovingY : groovingX;
                var groovingIdent2 = (directGrooving) ? round(detailFullHeight - groovingY - groovingL, 1) :
                    round(detailFullWidth - groovingX - groovingL, 1);
                var detailRestWidth = round(detailFullWidth / 2, 1);
                var detailRestHeight = round(detailFullHeight / 2, 1);

                // Проверка на отступ между пазом и четвертью
                for (var rabbet of detailRabbets) {
                    var sideRabbetString = String(rabbet[0]);
                    var sideRabbet = Number(sideRabbetString.charAt(0)); // сторона детали
                    var ribRabbet = Number(sideRabbetString.charAt(1)); // край детали
                    if ([2, 4].indexOf(ribRabbet) !== -1) {
                        var directRabbet = 1; // вертикальное направление
                    } else {
                        var directRabbet = 0; // горизонтальное направление
                    }
                    var tmpD = Number(rabbet[3]);
                    var tmpN = Number(rabbet[1]);
                    var tmpL = Number(rabbet[4]);
                    var tmpDepth = Number(rabbet[2]);
                    var rabbetFull = Number(rabbet[7]);
                    if (rabbetFull == 'true') {
                        rabbetFull = true;
                    } else if (rabbetFull == 'false') {
                        rabbetFull = false;
                    }
                    var tmpIdent1 = tmpN;
                    if (directRabbet) { //вертикальное направление
                        if (rabbetFull) {
                            tmpL = detailFullHeight;
                        }
                        var tmpIdent2 = round(detailFullHeight - tmpN - tmpL, 1); // верх
                    } else {  // горизонтальное направление
                        if (rabbetFull) {
                            tmpL = detailFullWidth;
                        }
                        var tmpIdent2 = round(detailFullWidth - tmpN - tmpL, 1); // право
                    }
                    if (directGrooving == directRabbet) {
                        if (ribGrooving == ribRabbet) { // один край детали
                            var tmpValOne = tmpD;
                            var delta = round(val - tmpValOne, 1);
                        } else { // противоположные края детали
                            if (ribGrooving == sideGrooving) {
                                var tmpValOne = round(detailThickness - tmpD, 1);
                            } else {
                                var tmpValOne = (directRabbet) ? round(detailFullWidth - tmpD, 1) :
                                    round(detailFullHeight - tmpD, 1); // приведем к одной стороне
                            }
                            var delta = round(tmpValOne - val - groovingD, 1);
                        }
                        if (sideGrooving == sideRabbet) {  // паз и четверть на одной стороне
                            if (delta > deltaMin && delta < deltaMax) {
                                showErrorMessage(
                                    LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+
                            LANG['SMALL-OTSTUP-STR'] + `${deltaMax} мм. `+LANG['OR-PERESEK']
                                );
                                grooving.setval(xy.toLowerCase(), '');
                                grooving.focus(xy.toLowerCase());

                                return false;
                            }
                        } else if (arrPlane.indexOf(sideGrooving) != -1) { // паз и четверть на противоположных сторонах
                            if ((groovingIdent1 >= identMin1 || groovingIdent2 >= identMin1) ||
                                (groovingIdent1 >= identMin2 && groovingIdent2 >= identMin2)) {
                                continue;
                            }
                            if (tmpIdent1 >= identMin2 && tmpIdent2 >= identMin2) {
                                continue;
                            }
                            var thickness = detailThickness - depth - tmpDepth;
                            if (delta < deltaMax && thickness < thicknessMin) {
                                showErrorMessage(
                                    LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+LANG['SMALL-OTSTUP-STR']+
                           `${deltaMax} мм.` + LANG['OSTATOCH-WIDTH-NO-MORE'] + `${thicknessMin} мм.`
                                );
                                grooving.setval('z', '');
                                grooving.focus('z');

                                return false;
                            }
                        } else { // паз на торце
                            if ((groovingIdent1 >= identMin1 || groovingIdent2 >= identMin1) ||
                                (groovingIdent1 >= identMin2 && groovingIdent2 >= identMin2)) {
                                continue;
                            }
                            if (tmpIdent1 >= identMin2 && tmpIdent2 >= identMin2) {
                                continue;
                            }

                            if (sideRabbet == 1) { // лицевая
                                var shiftR = (directGrooving) ? groovingX : groovingY;
                            } else { // тыльная
                                var shiftR = (directGrooving) ? detailThickness - groovingX - groovingD : detailThickness - groovingY - groovingD;
                            }
                            var thickness = round(shiftR - tmpDepth, 1);

                            if (ribGrooving == ribRabbet) {
                                if (thickness < deltaMaxR && thickness > deltaMinR) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']` ${xy.toUpperCase()}. `+LANG['NEDOSTAT-OTSTUP-FROM-CHETV']+
                                    ` ${deltaMaxR} мм.`
                                    );
                                    grooving.setval(xy.toLowerCase(), '');
                                    grooving.focus(xy.toLowerCase());

                                    return false;
                                }
                            } else {
                                var shift = (directGrooving) ? detailFullWidth - tmpD : detailFullHeight - tmpD;
                                var delta = round(shift - depth, 1);
                                if (delta < deltaMax && thickness < thicknessMin) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+LANG['NEDOSTAT-OTSTUP-FROM-CHETV']+` ${deltaMax} мм.`
                                    );
                                    grooving.setval(xy.toLowerCase(), '');
                                    grooving.focus(xy.toLowerCase());

                                    return false;
                                }
                            }
                        }
                    }
                }

                // Проверка на отступ между двумя пазами
                for (var tmpGroove of detailGrooves) {
                    var keyTmpGroove = Number(tmpGroove[7]);
                    if (keyTmpGroove === groove_key) { // это тот же паз
                        continue;
                    }
                    var sideTmpGroove = Number(tmpGroove[0]);
                    var directTmpGroove = Number(tmpGroove[1]);
                    var tmpD = Number(tmpGroove[5]);
                    var tmpX = Number(tmpGroove[2]);
                    var tmpY = Number(tmpGroove[3]);
                    var tmpL = Number(tmpGroove[6]);
                    var tmpDepth = Number(tmpGroove[4]);
                    if (directTmpGroove) { //вертикальное направление
                        if (arrRibsX.indexOf(sideTmpGroove) != -1) {
                            var ribtmpGroove = sideTmpGroove;
                            var tmpVal = tmpX;
                        } else if (tmpGroove[9] == 'true') {
                            var ribtmpGroove = 4; // правый край
                            var tmpVal = round(detailFullWidth - tmpX - tmpD, 1);
                        } else {
                            var ribtmpGroove = 2; // левый край
                            var tmpVal = tmpX;
                        }
                        var tmpIdent1 = tmpY; // низ
                        var tmpIdent2 = round(detailFullHeight - tmpY - tmpL, 1); // верх
                    } else {  // горизонтальное направление
                        if (arrRibsY.indexOf(sideTmpGroove) != -1) {
                            var ribtmpGroove = sideTmpGroove;
                            var tmpVal = tmpY;
                        } else if (tmpGroove[8] == 'true') {
                            var ribtmpGroove = 3; // верх
                            var tmpVal = round(detailFullHeight - tmpY - tmpD, 1);
                        } else {
                            var ribtmpGroove = 5; // низ
                            var tmpVal = tmpY;
                        }
                        var tmpIdent1 = tmpX; // лево
                        var tmpIdent2 = round(detailFullWidth - tmpX - tmpL, 1); // право
                    }
                    if (directGrooving == directTmpGroove) {
                        if (ribGrooving == ribtmpGroove) { // один край детали
                            var tmpValOne = tmpVal;
                        } else { // противоположные края детали
                            if (ribtmpGroove == sideTmpGroove) {
                                var tmpValOne = round(detailThickness - tmpVal - tmpD, 1);
                            } else {
                                var tmpValOne = (directTmpGroove) ? round(detailFullWidth - tmpVal - tmpD, 1) :
                                    round(detailFullHeight - tmpVal - tmpD, 1); // приведем к одной стороне
                            }
                        }
                        if (sideGrooving == sideTmpGroove) {  // пазы на одной стороне
                            var delta = (val > tmpValOne) ? round(val - tmpValOne - tmpD, 1) : round(tmpValOne - val - groovingD, 1);

                            if (arrRibsY.indexOf(sideGrooving) != -1) {
                                if (delta > deltaMinR && delta < deltaMaxR) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. ` +LANG['NEDOSTAT-OTSTUP-ONE-PAZ-TWO']+ ` ${deltaMaxR} мм.` + LANG['OR-PERESEK']
                                    );
                                    grooving.setval(xy.toLowerCase(), '');
                                    grooving.focus(xy.toLowerCase());

                                    return false;
                                }
                            } else {
                                if (delta > deltaMin && delta < deltaMax) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. ` +LANG['NEDOSTAT-OTSTUP-ONE-PAZ-TWO']+ ` ${deltaMax} мм. `+ LANG['OR-PERESEK']
                                    );
                                    grooving.setval(xy.toLowerCase(), '');
                                    grooving.focus(xy.toLowerCase());

                                    return false;
                                }
                            }

                        } else if ((arrPlane.indexOf(sideGrooving) != -1 && arrPlane.indexOf(sideTmpGroove) != -1) ||
                            (arrRibs.indexOf(sideGrooving) != -1 && arrRibs.indexOf(sideTmpGroove) != -1)) { // пазы на противоположных сторонах
                            var detailRest = (directTmpGroove) ? detailRestWidth : detailRestHeight;
                            if (arrRibs.indexOf(sideGrooving) != -1) {
                                if (arrRibsX.indexOf(sideGrooving) != -1) {
                                    var thickness = round(detailFullWidth - depth - tmpDepth, 1);
                                } else {
                                    var thickness = round(detailFullHeight - depth - tmpDepth, 1);
                                }
                            } else {
                                var thickness = round(detailThickness - depth - tmpDepth, 1);
                            }
                            var delta = (val > tmpValOne) ? round(val - tmpValOne - tmpD, 1) : round(tmpValOne - val - groovingD, 1);

                            if (((groovingIdent1 >= detailRest || groovingIdent2 >= detailRest) || (groovingIdent1 >= identMin1 && groovingIdent2 >= identMin1)) &&
                                ((tmpIdent1 >= detailRest || tmpIdent2 >= detailRest) || (tmpIdent1 >= identMin1 && tmpIdent2 >= identMin1))) {
                                if (delta < deltaMax && thickness < thicknessMin && thickness > 0) {
                                    showErrorMessage(
                                        LANG['NEVERN-ZNACH-DETH-TOLSHINA']+` ${thicknessMin} мм. `+LANG['OR-PERESECH-OR-ONE-PAZ-MUST-MORE']+
                                 `${deltaMax} мм.`
                                    );
                                    grooving.setval('z', '');
                                    grooving.focus('z');

                                    return false;
                                }
                            } else {
                                if (delta < deltaMax && thickness < thicknessMin) {
                                    showErrorMessage(
                                        LANG['BAD-VALUE']+` ${xy.toUpperCase()}. `+LANG['NEDOSTAT-OTSTUP-ONE-PAZ-TWO']+` ${deltaMax} мм. `+LANG['OSTATOCH-WIDTH-NO-MORE']+` ${thicknessMin} мм.`
                                    );
                                    grooving.setval('z', '');
                                    grooving.focus('z');

                                    return false;
                                }
                            }
                        } else { // один паз на торце, другой на плоскости
                            if ((groovingIdent1 >= identMin1 || groovingIdent2 >= identMin1) ||
                                (groovingIdent1 >= identMin2 && groovingIdent2 >= identMin2)) {
                                continue;
                            }
                            if ((tmpIdent1 >= identMin1 || tmpIdent2 >= identMin1) ||
                                (tmpIdent1 >= identMin2 && tmpIdent2 >= identMin2)) {
                                continue;
                            }

                            if (ribGrooving == ribtmpGroove) { // одна сторона
                                if ([2,5].indexOf(ribGrooving) != -1) {
                                    var shift = (directGrooving) ? groovingX : groovingY;
                                    var tmpShift = (directTmpGroove) ? tmpX : tmpY;
                                } else {
                                    var shift = (directGrooving) ? detailFullWidth - groovingX - groovingD : detailFullHeight - groovingY - groovingD;
                                    var tmpShift = (directTmpGroove) ? detailFullWidth - tmpX - tmpD: detailFullHeight - tmpY - tmpD;
                                }
                            } else { // противоположные стороны
                                var shift = (directGrooving) ? detailFullWidth - groovingX - groovingD : detailFullHeight - groovingY - groovingD;
                                if ([2,5].indexOf(ribGrooving) != -1) {
                                    var tmpShift = (directTmpGroove) ? tmpX : tmpY;
                                } else {
                                    var tmpShift = (directTmpGroove) ? detailFullWidth - tmpX - tmpD: detailFullHeight - tmpY - tmpD;
                                }
                            }

                            if (arrPlane.indexOf(sideGrooving) != -1) { // редактируемый паз на плоскости
                                var delta = round(shift - tmpDepth, 1);
                                if (sideGrooving == 1) { // лицевая
                                    var shiftR = (directTmpGroove) ? tmpX : tmpY;
                                } else { // тыльная
                                    var shiftR = (directTmpGroove) ? detailThickness - tmpX - tmpD : detailThickness - tmpY - tmpD;
                                }
                                var thickness = round(shiftR - depth, 1);
                            } else { // редактируемый паз на ребре
                                var delta = round(tmpShift - depth, 1);
                                if (sideTmpGroove == 1) { // лицевая
                                    var shiftR = (directGrooving) ? groovingX : groovingY;
                                } else { // тыльная
                                    var shiftR = (directGrooving) ? detailThickness - groovingX - groovingD : detailThickness - groovingY - groovingD;
                                }
                                var thickness = round(shiftR - tmpDepth, 1);
                            }

                            if (delta < deltaMax && thickness < thicknessMin) {
                                showErrorMessage(
                                    LANG['BAD-VALUE'] + ` ${xy.toUpperCase()}. `+LANG['NEDOSTAT-OTSTUP-ONE-PAZ-TWO']+` ${deltaMax} мм. `+LANG['OSTATOCH-WIDTH-NO-MORE']+` ${thicknessMin} мм.`
                                );
                                grooving.setval('z', '');
                                grooving.focus('z');

                                return false;
                            }
                        }
                    }
                }

                return true;
            },
            set_types(choosed_type) {
                var data = grooving.cache.params.types[grooving.getval('side')];
                var objSel = grooving.getinput('type');
                objSel.options.length = 0;
                if((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))){
                    objSel.options[objSel.options.length] = new Option(LANG['PROIZVOLN-S'], 0);
                }
                else{
                    for (key in data) {
                        if(choosed_type != undefined && data[key] == choosed_type){
                            objSel.options[objSel.options.length] = new Option(key, data[key],false, true);
                        }else{
                            objSel.options[objSel.options.length] = new Option(key, data[key]);
                        }
                    }
                }
                if(choosed_type != undefined){
                    grooving.change('type', choosed_type);
                }else{
                    grooving.change('type', 0);
                }
                grooving.setval('type', 0);
            },
            svg(groove_key, groove, detailKey) {
                if (kromkaChamfer45 && grooving.getval('ext')) {
                    draw();
                } else {
                    $.ajax({
                        type: "POST",
                        url: "system/controllers/JsonController.php",
                        data: ({
                            controller: 'Additives',
                            action: 'getSVGForGroove',
                            groove_key: groove_key,
                            groove: groove,
                            detailKey: detailKey
                        }),
                        dataType: 'json',
                        success: function (data) {

                            var svgGrooveMain = data[0];
                            var svgGrooveDop = data[1];
                            var grooveKey = data[2];
                            //console.log('* grooving SVG \nsvgGrooveMain : ', svgGrooveMain,'\nsvgGrooveDop : ', svgGrooveDop,'\ngrooveKey : ', grooveKey);
                            $('.svg-grooves-' + grooveKey).remove();

                            for (var i in svgGrooveMain) {
                                if (svgGrooveMain[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgGrooveMain[i];
                            }

                            for (var i in svgGrooveDop) {
                                if (svgGrooveDop[i]) $("#svg-side-" + i + "-contour")[0].outerHTML += svgGrooveDop[i];
                            }

                            grooving.use('svgs_init');
                        },
                        complete: function (data) {
                            if(detailShapesByPattern.length){
                                draw();
                                return;
                            }
                        }
                    });
                }
            },
            svgs_init() {
                var els = document.querySelectorAll('g[class^=svg-grooves-]');
                for(var i = 0; i < els.length; i++) {
                    grooving.use('svg_init_el', [els[i]]);
                }
            },
            svg_init_el(el) {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-grooves-/)) {
                            return Number(el.classList[i].replace('svg-grooves-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[detailGrooves[id][0] - 1];
                    var x = detailGrooves[id][2];
                    var y = detailGrooves[id][3];
                    var z = detailGrooves[id][4];
                    var w = detailGrooves[id][5];
                    var l = detailGrooves[id][6];
                    $('#drawinfo').text(
                        `Паз №${id + 1} (${side}): x=${x}, y=${y}, z=${z}, ширина=${w}, `+LANG['DLINA-S']+`=${l}`
                    );
                    showGroovePosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideGroovePosition(id);
                };
                el.ondblclick = e => {
                    var id = getid();
                    editGroove(id);
                };
            },
            send(params) {
                var groove = {
                    side: Number(grooving.getval('side')),
                    type: Number(grooving.getval('direct')),
                    x: params['x'],
                    y: params['y'],
                    z: Number(grooving.getval('z')),
                    d: Number(grooving.getval('d')),
                    l: Number(grooving.getval('l')),
                    ext: Number(params.grooveExt),
                    groove_key: groove_key,
                    bindV: params['groove_linking_y'],
                    bindH: params['groove_linking_x'],
                    article: params['article'],
                    radius: params['radius'],
                };

                var callback = function (data) {
                    var val = data[1];
                    var data = data[0];
                    grooving.use('data', [data]);
                    //console.log('-> grooving.send \ngroove_key : ', groove_key, '\n detailGrooves : ',detailGrooves);
                    grooving.use('table');

                    grooving.use('svg', [groove_key, groove, detailKey]);

                    grooving.setval('side', 1);
                    grooving.method('side');

                    grooving.method('clear');

                    var add = grooving.getinput('add');
                    add.innerText = LANG['ADD'];
                    add.classList.add('btn-success');
                    add.classList.remove('btn-danger');

                    $('#groovesTable tr').addClass("info");
                    $('#groovesTable tr.danger-edit').addClass("danger-edit").removeClass("danger");
                    $("#grooveKeyId-" + groove_key).removeClass("info");
                    $("#grooveKeyId-" + groove_key + '.danger').removeClass("danger-edit").addClass("danger");
                    groove_key = '';
                    grooving.setval('ext', false);
                };

                g_detail.setOperation(
                    'groove',
                    {
                        detail_key: detailKey,
                        side: groove['side'],
                        type: groove['type'],
                        x: groove['x'],
                        y: groove['y'],
                        z: groove['z'],
                        d: groove['d'],
                        l: groove['l'],
                        ext: groove['ext'],
                        groove_key: groove_key,
                        bindV: groove['bindV'],
                        bindH: groove['bindH'],
                        article: groove['article'],
                        radius: groove['radius'],
                    },
                    callback
                );
            },
            table() {
                /*
                 * обновляем таблицу только если есть хотя бы 1 паз
                 * */
                if (detailGrooves.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: "/service/system/views/additives/inc/tableGrooves.php",
                        data: 'detail_key=' + detailKey + '&machineId=' + machine,
                        dataType: "html",
                        success: function (data) {
                            if ((data.length > 0 && constructorId != 'stol') || materialType == 'compact') {
                                grooving.showinput('table');
                                $("#hide-table").css("display", "block");
                                showHideTableStyles();
                                var table = grooving.getinput('table');
                                table.innerHTML = data;
                                $(table).find('tr[id^=grooveKeyId-]').each((i, el) => {
                                    el.ondblclick = e => {
                                        editGroove(Number(el.id.replace('grooveKeyId-', '')));
                                    };
                                    el.onmouseout = e => {
                                        hideGroovePosition(Number(el.id.replace('grooveKeyId-', '')));
                                    };
                                    el.onmouseover = e => {
                                        showGroovePosition(Number(el.id.replace('grooveKeyId-', '')));
                                    };
                                });
                            } else {
                                grooving.hideinput('table');
                            }
                        }
                    });
                } else {
                    grooving.hideinput('table');
                }
            },
            data_to_object(data) {
                return {
                    'side': data[0],
                    'type': data[1],
                    'x': data[2],
                    'y': data[3],
                    'z': data[4],
                    'd': data[5],
                    'l': data[6],
                    'key': data[7],
                    'bindH': data[8],
                    'bindV': data[9],
                    'ext': data[10],
                    'preset_type': data[11],
                    'radius': data[12]
                }
            },
            data(data) {
                detailGrooves.length = 0;
                for (var key in data) {
                    detailGrooves.push([
                        Number(data[key]['side']),//0
                        Number(data[key]['type']),//1
                        Number(data[key]['x']),   //2
                        Number(data[key]['y']),   //3
                        Number(data[key]['z']),   //4
                        Number(data[key]['d']),   //5
                        Number(data[key]['l']),   //6
                        Number(data[key]['key']), //7
                        data[key]['bindH'],//8
                        data[key]['bindV'],//9
                        Number(data[key]['ext']),  //10
                        data[key]['preset_type'],   //11
                        Number(data[key]['radius'])   //12
                    ]);
                }
            },
            fixBugff(){
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
                    var styles = {width : "30"};
                    $("#centerY").css(styles);
                    $("#centerX").css(styles);
                }
            },
            getNumberAfterPoint(value){
                if(Math.floor(value) === value) return 0;
                return value.toString().split(".")[1].length || 0;
            },
            setXYAfterCheckD(value){
                if(value==true){
                    grooving.setval('x', '');
                    grooving.setval('y', '');
                }
                grooving.disabled('y', value);
                grooving.disabled('center_y', value);
                grooving.disabled('x', value);
                grooving.disabled('center_x', value);
            },
            showHideR(){ //Скрываем/отображаем радиус 
                var side = Number(grooving.getval('side'));
                var full = grooving.getval('full');
                if ([1,6].indexOf(side) != -1 && full == 0){
                    grooving.showinput('grooveRFieldset');
                } else{
                    grooving.hideinput('grooveRFieldset');
                }
            },
            checkMinDLForActiveRadius(){
                if (Math.min(grooving.getval('d'), grooving.getval('l')) < 6){
                    if(grooving.getval('full')==0) {
                        if (grooving.getval('d') < 6 && grooving.getval('d') > 3.2) {
                            //showErrorMessage(LANG['GROOVE-RADIUS-MUST-BE-GREATER-THAN-WIDTH'] + ` 6 ` + LANG['MM']);
                        } else if (grooving.getval('l') < 6) {
                            //showErrorMessage(LANG['GROOVE-RADIUS-MUST-BE-GREATER-THAN-LENGTH'] + ` 6 ` + LANG['MM']);
                        }
                    }
                    grooving.disabled('groove_r', true);
                    grooving.setval('groove_r', 0);
                } else{
                    grooving.disabled('groove_r', false);
                }
                if (Math.min(grooving.getval('d'), grooving.getval('l')) == 6){
                    grooving.setval('groove_r', 3);
                }
            },
        },
        init(data, global_data) {
            // заполняем массив параметров
            grooving.cache.params = global_data.grooves_data;
            // заполняем массив с пазами
            grooving.use('data', [data.grooves]);
            // билдим таблицу пазов
            grooving.use('table');

            // заполняем список сторон
            var side_select = grooving.getinput('side');
            for (var side in grooving.cache.params.sides) {
                side_select.options[side_select.options.length] = new Option(side, grooving.cache.params.sides[side]);
            }
            // заполняем список направлений
            var direct_select = grooving.getinput('direct');
            for (var direct in grooving.cache.params.directs) {
                direct_select.options[direct_select.options.length] = new Option(direct, grooving.cache.params.directs[direct]);
            }

            // запускаем инит из супер класса
            grooving.super();

            if (ro) {
                $("#grooves").attr("disabled", true);
                return;
            }

            grooving.change('side');
            grooving.change('direct');
            grooving.functions.fixBugff();
        },
        reinit(data) {
            // заполняем массив с пазами
            grooving.use('data', [data.grooves]);
            // билдим таблицу пазов
            grooving.use('table');

            grooving.setval('side', 1);
            grooving.change('side');
            grooving.setval('direct', 0);
            grooving.change('direct');
        }
    };

    return grooving;
});
