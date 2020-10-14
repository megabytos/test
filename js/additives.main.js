//---------------------------------------значения по текущей детали---------------------------
var detailKey;
var detailWidth;
var detailHeight;
var detailFullWidth;
var detailFullHeight;
var detailThickness;
var detailSquare;
var detailCount;
var detailTexture;
var detailCaption;
var detailDecoratedSide;
var detailMarker;
var l, L, w, W, h, H, t, T;
var detailHoles = []; //Отверстия по текущей детали
var detailGrooves = [];
var detailRabbets = [];
var detailCorners = {1: [], 2: [], 3: [], 4: []};
var edgesCut = {'left': 0, 'right': 0, 'top': 0, 'bottom': 0};
//---------------------------------------текущие значения на форме---------------------------
var detailJoint = '';
var detailJointForShapes = '';
var detailJointForCircle = '';
var kromki = []; //содержит все кромки по выбраному материалу(guid:[title,thickness,height])
//GUID-ы выбранных кромок
var kromkaLeft = 0;
var kromkaRight = 0;
var kromkaTop = 0;
var kromkaTopCut = 0;
var kromkaBottom = 0;
var kromkaBottomCut = 0;
var kromkaAll = 0;
var kLeftThick = 0;
var kRightThick = 0;
var kTopThick = 0;
var kBottomThick = 0;
var kAllThick = 0;
var kLeftHeight = 0;
var kRightHeight = 0;
var kTopHeight = 0;
var kBottomHeight = 0;
var kAllHeight = 0;
var sLeft = 0;
var sRight = 0;
var sTop = 0;
var sBottom = 0;
var kromkaChamfer45 = 0;
var kromkaChamfer45ShowMassege = 0;
var fLeftFace = 0;
var fRightFace = 0;
var fTopFace = 0;
var fBottomFace = 0;
var fLeftRear = 0;
var fRightRear = 0;
var fTopRear = 0;
var fBottomRear = 0;
var sAll = 0;
var cLeft = 0;
var cTop = 0;
var cRight = 0;
var cBottom = 0;
var side; //текущая выбраная сторона
var holes = []; //Отверстия в выбраном пакете
var hole_key = '';
var grooves = [];
var groove_key = '';
var rabbet_key = '';
var shape_key = '';
var shape_by_pattern_key = '';
var ident; //отступ по текущему отверстию
var holeType = 0; //тип 0 - предустановленные, 1 - произвольные
var initFunctions = [];
var holeFocused; // id of a drillhole that is left visible after "focusHole" invocation
var detailValid;
var edgeCurv = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
};
var edges_data = null;
// machineID
var machine = false;
var edgeArt = 0; //параметр для хранения текущего артикла на стороне

var strings = {
    sides: [
        LANG['LITSEVAYA'],
        LANG['LEVAYA'],
        LANG['VERHAYA'],
        LANG['PRAVAYA'],
        LANG['NIJNAYA'],
        LANG['TILNA']
    ],
    edgesides:[
        'left',
        'right',
        'top',
        'bottom',
    ],
}



// function changeDetail(detail_key) {
//     detail_key++;
//     location.search = '?d=' + (Number(detail_key) > 0 ? Number(detail_key) : 0);
// }

function setDetailsBinding(data2) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        async: false,
        data: ({controller: 'Additives', action: 'getDetailsList'}),
        success: function (data) {
            // var objSel = document.getElementById("binding");
            // objSel.options.length = 1;
            var i = 1;
            $('#binding').empty();
            for(key in data){
                if(key != detailKey){
                    $('#binding').append($("<option></option>").attr("value",i).text(data[key]['Detail']));
                }
                i++;
            }


            // for (key in data) {
            //     if (detailKey != key) {
            //         objSel.options[i++] = new Option(data[key].Detail, data[key].timestamp);
            //     }
            // }
            // $('#binding').val(data2.binding);
        }
    });
}


// 2 получает список деталей, и заполняет select деталей
function setDetails(set_key) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetailsList', detail_key: set_key}),
        success: function (data) {
            var objSel = document.getElementById("detailSelect");
            objSel.options.length = 0;
            var i = 0;
            for (key in data) {
//                console.log(data[key])
                objSel.options[i] = new Option(data[key].Detail, key);
                if (data[key].error) {
                    objSel.options[i].style.color = 'white';
                    objSel.options[i].style.background = 'red';
                }
                i++;
            }
            setDetail(set_key);
        }
    });
}

function setDetailsMachine() {
    if (machine) {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            dataType: 'json',
            data: ({controller: 'Additives', action: 'getDetailsList', machineId: machine}),
            success: function (data) {
                var objSel = document.getElementById("detailSelectMachine");
                objSel.options.length = 0;
                var i = 1;
                objSel.options[0] = new Option('-', -1);
                for (key in data) {
//                console.log(data[key])
                    objSel.options[i] = new Option(data[key].Detail, key);
                    if (data[key].error) {
                        objSel.options[i].style.color = 'white';
                        objSel.options[i].style.background = 'red';
                    }
                    i++;
                }
                // setDetail();
                $('#detailSelectMachine').val($('#detailSelect').val());
            }
        });
    }
}

//получает все данные по текущей детали в select-е и установка переменных, запрос кромок
function setDetail(detail_key = -1) {

    //console.log('machine = ', machine);
    var searchParams = parseURL();
    if (detail_key == -1){
        (Number(searchParams['d']) - 1);
    }
    //var detail_key = detail_key || (Number(searchParams['d']) - 1)
    detail_key = Number(detail_key) > 0 ? Number(detail_key) : 0;
    $('#detailSelect').val(detail_key);
    if ($('#detailSelect').val() == null) {
        var key = $('#detailSelect option').val();
        $('#detailSelect').val(key);
        if ($('#detailSelect').val() != null) {
            changeDetail(key);
        } else {
            Navi('cutting');
        }
    }
    $('#detailSelectMachine').val($('#detailSelect').val());
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: ({controller: 'Additives', action: 'getDetail', detail_key: $('#detailSelect').val(), machineId: machine}),
        success: function (data) {
            detailKey = data['key'];
            detailWidth = data['width'];
            detailHeight = data['height'];
            detailFullWidth = data['fullWidth'];
            detailFullHeight = data['fullHeight'];
            detailBinding = data['binding'];
            detailTimestamp = data['timestamp'];
            detailThickness = data['thickness'];
            l = detailWidth;
            L = detailFullWidth;
            w = detailHeight;
            W = detailFullHeight;
            h = detailThickness;
            H = h;
            t = detailThickness;
            T = t;
            detailSquare = data['square'];
            detailCount = data['count'];
            detailTexture = data['texture'];
            detailCaption = data['caption'];
            detailDecoratedSide = data['decoratedSide'];
            detailMarker = data['marker'];
            detailValid = data['valid'];
            kLeftThick = data['kromki'].left;
            kRightThick = data['kromki'].right;
            kTopThick = data['kromki'].top;
            kBottomThick = data['kromki'].bottom;
            cLeft = (data['data_edges']['left']) ? data['data_edges']['left']['cut'] : '';
            cTop = (data['data_edges']['top']) ? data['data_edges']['top']['cut'] : '';
            cRight = (data['data_edges']['right']) ? data['data_edges']['right']['cut'] : '';
            cBottom = (data['data_edges']['bottom']) ? data['data_edges']['bottom']['cut'] : '';
            machine = (data['machineId'] == "false") ? false : data['machineId'];

            if (detailMarker == true || detailMarker == 1) {
                $('#marker_check').prop('checked', true);
                $('#marker_box').find('div.input_mask')[0].className = 'input_mask input_mask_checked';
            } else {
                $('#marker_check').prop('checked', false);
                $('#marker_box').find('div.input_mask')[0].className = 'input_mask';
            }

            if (detailDecoratedSide == 'back') {
                $('#decoratedSide').find('option#backDecoratedSide').prop('selected', true);
            } else {
                $('#decoratedSide').find('option#frontDecoratedSide').prop('selected', true);
            }


            //init(data);
            g_detail.init();
            //draw();
            CloseWait();
            //$('#holeSideSelect').change();
        }
    });
}

var g_detail = {
    _modules: {},
    get modules() {
        return this._modules;
    },
    addModule(id, module) {
        this.modules[id] = module;
    },
    getModule(id) {
        return this.modules[id] || 0;
    },

    validate(data) {
        $('#drawinfo').removeClass('errorText');
        $('#drawinfo').removeClass('warningText');
        $('#drawinfo').text(getDetailDesc());
        $('#svg-draft').css({border:'1px solid transparent'});

        if(data) {
            var result = true;
            var warning = true;
            if(data['type'] == 'error'){
                result = false;
            }
            if(data['type'] == 'warning'){
                warning = false;
            }
            if(!result){
                $('#drawinfo').text(data['msg']);
                $('#svg-draft').css({border:'5px dotted #f00'});
            }
            if(!warning){
                $('#drawinfo').text(data['msg']);
                $('#svg-draft').css({border:'5px CC8400 #f00'});
            }
            var elt = document.getElementById("svg-draft");
            var cs = window.getComputedStyle(elt, null);
            if(cs.border == "5px dotted rgb(255, 0, 0)"){
                $('#drawinfo').addClass('errorText');
            }else{
                $('#drawinfo').removeClass('errorText');
            }
        }

        var sides = {
            1: 1,
            2: 'left',
            3: 'top',
            4: 'right',
            5: 'bottom',
            6: 6
        }

        var vals = Object.keys(edgeCurv).map(function(key) {
            return edgeCurv[key];
        });
        if(vals.join('').includes('1')) {
            var hks = [];
            for(var k_h in detailHoles) {
                var hole_side = detailHoles[k_h][0];
                if(edgeCurv[sides[hole_side]]) {
                    hks.push(k_h+1)
                }
            }

            if(hks.length) {
                    $('#drawinfo').addClass('errorText');
                $('#drawinfo').text(LANG['SVERLENIE']+' ' + hks.join(', ') + ' '+LANG['WILL-BE-KROMK']);
                $('#svg-draft').css({border:'5px CC8400 #f00'});
            }else {
                $('#drawinfo').removeClass('errorText');
            }
        }

        return result;
    },
    setOperation(typeOperaion, data, callback) {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            dataType: 'json',
            data: {
                controller: 'Additives',
                action: 'setOperation',
                typeOperation: typeOperaion,
                data: data
            },
            success(res) {
                edgeCurv = res['edgeCurv'];

                g_detail.validate(res['operation'] ? res['operation']['detail'] : false);
                if(typeof callback === 'function') {
                    callback(res['operation']);
                }
            }
        });
    },
    rmOperation(typeOperation, data, callback) {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            dataType: 'json',
            data: {
                controller: 'Additives',
                action: 'rmOperation',
                typeOperation: typeOperation,
                data: data
            },
            success(res) {
                edgeCurv = res['edgeCurv'];

                g_detail.validate(res['operation'] ? res['operation']['detail'] : false);
                if(typeof callback === 'function') {
                    callback(res['operation']);
                }
            }
        });
    },
    setPrev() {
        startPos = null;
        var dId = g_detail.getIdDet(detailKey, 'prev');
        g_detail.setById(dId);
    },
    setNext() {
        startPos = null;
        var dId = g_detail.getIdDet(detailKey, 'next');
        g_detail.setById(dId);
    },
    getIdDet(curId, direction){
        var idDet;
        var detMass = [];
        var matchDet = false;
        $("#detailSelect option").each(function(){
            detMass.push(Number($(this).val()));
        });
        do {
            if (direction == 'prev'){
                curId--;
            } else if (direction == 'next'){
                curId++;
            }
            if (curId < 0) curId = Math.max.apply(Math, detMass); 
            if (curId > Math.max.apply(Math, detMass)) curId = Math.min.apply(Math, detMass); 
            for (var i = 0; i < detMass.length; i++) {
                if (curId == detMass[i]){
                    matchDet = true;
                    break;
                }
            }
        } while(!matchDet);
        idDet = curId;
        return idDet;
    },
    setById(id) {
        startPos = null;
        detailKey = id;
        g_detail.init();
    },
    init(data, g_data) {
        ShowWait();
        var funcinit = (data, g_data) => {
            detailKey = Number(data['key']);
            sessionStorage.setItem('lastEditedDetailRowId', detailKey);
            document.getElementById("detailSelect").value = detailKey;
            detailWidth = data['width'];
            detailHeight = data['height'];
            detailFullWidth = data['fullWidth'];
            detailFullHeight = data['fullHeight'];
            detailBinding = data['binding'];
            detailTimestamp = data['timestamp'];
            detailThickness = data['thickness'];
            l = detailWidth;
            L = detailFullWidth;
            w = detailHeight;
            W = detailFullHeight;
            h = detailThickness;
            H = h;
            t = detailThickness;
            T = t;
            detailSquare = data['square'];
            detailCount = data['count'];
            detailTexture = data['texture'];
            detailCaption = data['caption'];
            detailDecoratedSide = data['decoratedSide'];
            detailMarker = data['marker'];
            detailValid = data['valid'];
            detailJoint = data['joint'];
            detailJointForShapes = data['jointShapes'];
            detailJointForCircle = data['jointCircle'];
            kLeftThick = data['kromki'].left;
            kRightThick = data['kromki'].right;
            kTopThick = data['kromki'].top;
            kBottomThick = data['kromki'].bottom;
            cLeft = (data['data_edges']['left']) ? data['data_edges']['left']['cut'] : '';
            cTop = (data['data_edges']['top']) ? data['data_edges']['top']['cut'] : '';
            cRight = (data['data_edges']['right']) ? data['data_edges']['right']['cut'] : '';
            cBottom = (data['data_edges']['bottom']) ? data['data_edges']['bottom']['cut'] : '';
            edgeCurv = data['edgeCurv'];

            if (detailMarker == true || detailMarker == 1) {
                $('#marker_check').prop('checked', true);
                $('#marker_box').find('div.input_mask')[0].className = 'input_mask input_mask_checked';
            } else {
                $('#marker_check').prop('checked', false);
                $('#marker_box').find('div.input_mask')[0].className = 'input_mask';
            }
            if (detailDecoratedSide == 'back') {
                $('#decoratedSide').find('option#backDecoratedSide').prop('selected', true);
            } else {
                $('#decoratedSide').find('option#frontDecoratedSide').prop('selected', true);
            }

            //визуализации декорированной стороны
            $('#decoratedSide').change(function(){
                delHole(-1);
            });

            if(machine) {
                $('#sizeCut').text(LANG['PILN-RAZM-DETAIL']+": [" + data.width + "x" + data.height + "x" + data.thickness + "]");
                $('#sizeFugue').text(LANG['RAZM-PRIFUGOVKI']+": [" + data.sizeWithFugue.width + "x" + data.sizeWithFugue.height + "x" + data.thickness + "]");
                initMiniature(data);
                g_detail.getModule('init').init(data);
                return;
            }

            if(g_data) {
                for(var key in g_detail.modules) {
                    g_detail.modules[key].init(data, g_data);
                }
            } else {
                for(var key in g_detail.modules) {
                    if(typeof g_detail.modules[key].reinit === 'function'){
                        g_detail.modules[key].reinit(data);
                    } else {
                        g_detail.modules[key].init(data, g_data);
                    }
                }
            }

            draw();
            CloseWait();
        };

        if(!data) {
            $.ajax({
                type: "POST",
                url: "/service/system/controllers/JsonController.php",
                dataType: 'json',
                async: false,
                data: ({controller: 'Additives', action: 'getDetail', detail_key: detailKey, set_current_detail: 1, machineId: machine}),
                success: function (data) {
                    funcinit(data);
                }
            });
        } else {
            funcinit(data, g_data);
        }
    },
};

window.onload = onReady;

function onReady() {
    $( document ).ajaxComplete(function( event, request, settings ) { CloseWait(); });
    $( document ).ajaxStart(function() { ShowWait(); });

    var lbtns = document.querySelectorAll('div[id="lbtn"]');
    for(var i = 0; i < lbtns.length; i++) {
        lbtns[i].onclick = g_detail.setPrev;
    }
    var rbtns = document.querySelectorAll('div[id="rbtn"]');
    for(var i = 0; i < rbtns.length; i++) {
        rbtns[i].onclick = g_detail.setNext;
    }
    document.getElementById('detailSelect').onchange = e => { g_detail.setById(e.target.value) };

    $(document).keydown(function (event) {
        if (event.ctrlKey) {
            switch (event.keyCode) {
                case 37 :
                    event.preventDefault();
                    g_detail.setPrev();
                    break;
                case 39 :
                    event.preventDefault();
                    g_detail.setNext();
                    break;
            }
        }
    });

    ShowWait();

    var Module = {
        cache: {
            inputs: {}
        },
        functions: {},
        methods: {},
        inputs: {},
        getinput(id) {
            if(!this.cache.inputs[id]){
                this.cache.inputs[id] = this.inputs[id];
            }
            if(!this.cache.inputs[id]){
                //console.log('field not find',id);
            }
            return this.cache.inputs[id];
        },
        getval(id) {
            var input = this.getinput(id);
            if(!input) {
                return null;
            }
            if(input.type === 'checkbox') {
                return this.ischecked(id);
            }
            return input.value;
        },
        setval(id, val) {
            var input = this.getinput(id);
            if(!input) {
                return;
            }
            if(input.type === 'checkbox') {
                this.checked(id, val);
                return;
            }
            input.value = val;
        },
        setOptions(id, val){
            var input = this.getinput(id);
            if(!input) {
                return;
            }
            //Если тип select
            if (input.type === 'select-one') {
                //очищаем select
                input.options.length = 0;
                //Если val не array, то делаем его array
                if (!Array.isArray(val)){
                    val = [val];
                }
                //Добавляем в select переданные значаения в val
                for (index = 0; index < val.length; index++) {
                    var opt = document.createElement('option');
                    opt.value = val[index];
                    opt.innerHTML = val[index];
                    input.appendChild(opt);
                }
                return;
            }
        },
        method(id, value) {
            return this.methods[id]({target: { value: value }});
        },
        change(id, value) {
            this.getinput(id).onchange({target: {value: value}});
        },
        focus(id) {
            this.getinput(id).focus();
        },
        disabled(id, val) {
            if(val) {
                this.getinput(id).setAttribute('disabled', 'disabled');
            } else {
                this.getinput(id).removeAttribute('disabled');
            }
        },
        checked(id, val) {
            if(val) {
                this.getinput(id).checked = true;
            } else {
                this.getinput(id).checked = false;
            }
        },
        ischecked(id) {
            return this.getinput(id).checked == true;
        },
        hideinput(id) {
            var self = this;
            var hide = id => {
                var input = self.getinput(id);
                if(input) {
                    input.style.display = 'none';
                }
            };
            if(Array.isArray(id)) {
                for(var i in id) { hide(id[i]); }
            } else {
                hide(id);
            }
        },
        showinput(id) {
            var self = this;
            var show = id => {
                var input = self.getinput(id);
                if(input) {
                    input.style.display = input.tagName == 'DIV' ? 'block' : 'initial'; //or block
                }
            };
            if(Array.isArray(id)) {
                for(var i in id) { show(id[i]) }
            } else {
                show(id);
            }
        },
        isshow(id) {
            return this.getinput(id).style.display != 'none';
        },
        initInput(id) {
            if(typeof this.methods[id] === 'function') {
                var input = this.getinput(id);
                if(input) {
                    switch (input.tagName) {
                        case 'SELECT':
                        case 'INPUT':
                            if (typeof this.methods[id+'_onFocus'] === "function") { 
                                input.onfocus = this.methods[id+'_onFocus'];
                            }    
                            input.onchange = this.methods[id];
                            break;
                        case 'BUTTON':
                        case 'DIV':
                        case 'SPAN':
                            input.onclick = this.methods[id];
                            break;
                        default:
                            console.error(LANG['REALIZE-CHECKING-FOR-TYPE']+' ' + input.tagName);
                    }
                }
            }
        },
        initInputs() {
            for(var k in this.inputs) {
                this.initInput(k);
            }
        },
        reinitInput(id) {
            this.cache.inputs[id] = this.inputs[id];
            this.initInput(id);
        },
        addFunction(id, func) {
            this.functions[id] = func;
        },
        use(id, params) {
            if(!params) {
                params = [];
            }
            if(typeof this.functions[id] === 'function') {
                return this.functions[id].apply(this, params);
            }
            return false;
        },
        addInput(id, get) {
            this.inputs.__defineGetter__(id, get);
        },
        addInputs(arr) {
            arr.forEach(function (input) {
                this.addInput(input.id, input.get);
            });
        },
        super(data, global_data) { this.initInputs(); },
        reinit(data) {  },
        validate(detailValidateData) {
            // console.log(detailValidateData);
            var result = true;
            var warning = true;
            if(detailValidateData['type'] == 'error'){
                result = false;
            }
            if(detailValidateData['type'] == 'warning'){
                warning = false;
            }
            if(!result){
                $('#drawinfo').text(detailValidateData['msg']);
                $('#svg-draft').css({border:'5px dotted #f00'});
            }
            if(!warning){
                $('#drawinfo').text(detailValidateData['msg']);
                $('#svg-draft').css({border:'2px dotted #CC8400'});
            }
            if(result && warning){
                $('#drawinfo').text(getDetailDesc());
                $('#svg-draft').css({border:'1px solid transparent'});
            }
            var elt = document.getElementById("svg-draft");
            var cs = window.getComputedStyle(elt, null);
            if(cs.border == "5px dotted rgb(255, 0, 0)"){
                $('#drawinfo').addClass('errorText');
            }else{
                $('#drawinfo').removeClass('errorText');
            }
            return result;
        },
    };

    var require_list = [];
    var require_config = {};

    var requireModule = id => {
        require_list.push(id);
        require_config[id] = Module;
    };

    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        async: false,
        data: ({controller: 'Additives', action: 'initAdditives'}),
        success: function (init_data) {
            if(!init_data['details']) {
                location.reload();
                return;
            }
            var data = init_data['details'];
            machine = (!init_data['machine'] || init_data['machine'] === 'false') ? false : init_data['machine'];

            if(machine) {
                require.config({baseUrl: 'js/additives/machines/'});
                require_list.push('init');
            } else {
                if(document.getElementById('collapseEdges')) { requireModule('edging') }
                if(document.getElementById('collapseClipping')) { requireModule('clipping') }
                if(document.getElementById('collapseCorners')) { requireModule('corners') }
                if(document.getElementById('collapseCut')) { requireModule('cut') }
                if(document.getElementById('collapseDrilling')) { requireModule('drilling') }
                if(document.getElementById('collapseGrooving')) { requireModule('grooving') }
                if(document.getElementById('collapseOdk')) { requireModule('odk') }
                if(document.getElementById('collapseRabbet')) { requireModule('rabbeting') }
                if(document.getElementById('collapseShape')) { requireModule('shapes') }
                if(document.getElementById('collapseShapeByPattern')) { requireModule('shapesByPattern') }
                if(['wood', 'fanera', 'shponirovanaya_plita'].includes(materialType)) {
                    if (document.getElementById('collapsePlaning')) {
                        requireModule('playing');
                    }
                }
                //При добавлении нового модуля обратить внимание в system\view\additives на .left-container-menu').click и добавить/не добавить в исключении новую модалку
                require.config({
                    baseUrl: 'js/additives/',
                    config: require_config,
                    urlArgs: "v=" +  (new Date()).getTime() //идеально бы сюда вместо getTime передавать параметр версии проекта, который изменяется при релизе
                });
            }

            var selected = 0;

            var objSel = document.getElementById("detailSelect");
            objSel.options.length = 0;

            for (var key in data) {
                var option = new Option(data[key].Detail, key);
                if (data[key].validation_result=='error') {
                    option.className += option.className ? ' err' : 'err';
                }
                else if(data[key].validation_result=='warning'){
                    option.className += option.className ? ' wrn' : 'wrn';
                }

                if(data[key].selected) {
                    selected = key;
                }

                objSel.options[objSel.options.length] = option;
            }
            objSel.value = selected;

            requirejs(require_list, function() {
                if(machine){
                    edges_data = init_data['edges_data']
                }
                for(var i in arguments) {
                    g_detail.addModule(require_list[i], arguments[i]);
                }
                g_detail.init(data[selected], init_data);
            });
        }
    });

    setPanels();
    initAxisControls();
    // setDetailsMachine();
    $("#invert").change(function () {
        draw();
        if ($("#invert").prop("checked") == true) {
            $(".check-side").addClass("check-invert");
        } else {
            $(".check-side").removeClass("check-invert");
        }
    });

    $("#end").change(function () {
        if (!$("#invert").prop("checked")) {
            switchEdges($(this).prop("checked"));
        }
    });

    $("#scaling").change(function () {
        draw();
    });

    $("#corners-rest").change(function () {
        showCornersRest($(this).prop("checked"));
    });

    $("#rectangles").change(function () {
        if ($('#rectangles').prop("checked")) {
            $('#svg-rectangles-1').show();
        } else {
            $('#svg-rectangles-1').hide();
        }
    });

    $('input.form-control.input-sm').change(function () {
        inputCalc($(this));
    });

    $('.check-zoom').on('click', function () {
        generateScaleParams();
        descale();
    });



    var svgArea = document.getElementById('draw');

    var scaleX = 1;
    var scaleY = 1;
    var drag = false;
    var oldX;
    var oldY;
    var dstOld = null;

    var startPos = null;

    var x = 0;
    var y = 0;

    function generateScaleParams() {
        var svg = document.getElementById('svg-detail');
        var attributes = svg.getAttribute('transform');
        var atribute_mas = attributes.match(/translate\((-?[0-9]+(?:\.[0-9]*)?),(-?[0-9]+(?:\.[0-9]*)?)\) scale\((-?[0-9]+(?:\.[0-9]*)?),(-?[0-9]+(?:\.[0-9]*)?)\)/);

        x = Number(atribute_mas[1]);
        y = Number(atribute_mas[2]);
        if (startPos == null) {
            startPos = {
                x: x,
                y: y
            }
        }
        scaleX = Number(atribute_mas[3]);
        scaleY = Number(atribute_mas[4]);
    }

    function descale() {
        $('.check-zoom').hide();
        var svg = document.getElementById('svg-detail');
        svg.setAttribute('transform', 'translate(' + (startPos.x) + ',' + (startPos.y) + ') scale(1,-1)');
    }

    svgArea.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
            //console.log(e);
            $('.check-zoom').show();
            $('#draw').css('cursor', 'move');
            e.preventDefault();
            var sign = e.deltaY / Math.abs(e.deltaY);
            var svg = document.getElementById('svg-detail');
            generateScaleParams();
            scaleX -= 0.1 * sign;
            scaleY += 0.1 * sign;
            if (scaleX <= 0.5) {
                scaleX = 0.5;
                scaleY = -0.5;
            }
            svg.setAttribute('transform', 'translate(' + (x) + ',' + (y) + ') scale(' + scaleX + ',' + scaleY + ')');
        } else {
            //console.log(e);

            $('#draw').css('cursor', 'inherit');
        }


    });


    svgArea.addEventListener('mousedown', dragStart);
    svgArea.addEventListener('touchstart', dragStart);

    svgArea.addEventListener('mousemove', dragProcess);
    svgArea.addEventListener('touchmove', dragProcess);

    svgArea.addEventListener('touchmove', touchZoom);

    document.body.addEventListener('mouseup', dragStop);
    document.body.addEventListener('touchend', dragStop);

    function dragStart(e) {
        if (e.ctrlKey) {
            $('#draw').css('cursor', 'move');
            //console.log(e);
            if (e.changedTouches) {
                e.preventDefault();
                if (e.targetTouches.length > 1) {

                    return;
                }

                e = e.changedTouches[0];
            }
            oldX = e.clientX;
            oldY = e.clientY;
            drag = true;
        } else {
            $('#draw').css('cursor', 'inherit');
        }
    }

    function dragProcess(e) {

        if (drag) {
            if (e.changedTouches) {
                e.preventDefault();
                if (e.targetTouches.length > 1) return;
                e = e.changedTouches[0];
            }
            $('.check-zoom').show();
            var svg = document.getElementById('svg-detail');
            generateScaleParams();
            x += e.clientX - oldX;
            y += e.clientY - oldY;
            svg.setAttribute('transform', 'translate(' + (x) + ',' + (y) + ') scale(' + scaleX + ',' + scaleY + ')');

            oldX = e.clientX;
            oldY = e.clientY;

            //console.log(self.start);
        }
    }

    function dragStop() {
        drag = false;
    }

    function touchZoom(e) {

        if (e.changedTouches && e.targetTouches.length == 2) {
            e.preventDefault();
            var x1 = e.targetTouches[0].clientX;
            var y1 = e.targetTouches[0].clientY;
            var x2 = e.targetTouches[1].clientX;
            var y2 = e.targetTouches[1].clientY;
            //ctx.save();
            ////ctx.translate(self.startPos.x, self.startPos.y);
            //ctx.beginPath();

            //ctx.moveTo(x1, y1);
            //ctx.lineTo(x2, y2);
            //ctx.stroke();
            //ctx.restore();

            var dst = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            if (dstOld != null) {
                self.scale *= dst / dstOld;
                self.render();
            }
            dstOld = dst;
        }

    }
}

function changeDetail(key) {
    // window.history.pushState({}, '', '?d=' + (Number(key) + 1));
    // setDetail(key);
    setDetails(key);
    g_detail.setById(Number(key));
}


function rotateDetail() {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'rotateDetail', detail_key: detailKey}),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
               g_detail.init(data);
            }
        }
    });
}
function rotateDetail180() {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'rotateDetail180', detail_key: detailKey}),
        dataType: 'json',
        success: function (data) {
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                g_detail.init(data);
            }
        }
    });
}

/*function removeAdditionalProcessing() {
 ShowWait();
 $.ajax({
 type: "POST",
 url: "/service/system/controllers/JsonController.php",
 data: ({model: 'Detail', action: 'getHolesAmountDel', detail_key: detailKey}),
 dataType: 'json',
 success: function (data) {
 CloseWait();
 if (data.type == 'error') {
 showErrorMessage(data.msg);
 } else {
 setDetail(detailKey);
 }
 }
 });
 }*/
function flipOperations(mode, onSide) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'flipOperations', detail_key: detailKey, mode: mode, onSide: onSide}),
        dataType: 'JSON',
        success: function (data) {
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                setDetail(detailKey);
            }
        }
    });
}

/** Метод для смены размера svg при show/hide таблицу с обработками */
function showHideTableStyles(){
    var check_table = localStorage.getItem("check_table");
    if (localStorage.getItem("check_table") == 0 || check_table == null){
        $("#drawinfo").removeClass("max-width");
        $("#right-container").removeClass("max-width");
        $("#sides").removeClass("max-width");
        $("#sides").removeClass("max-marg");
    }
}


function showHoles() {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/tableHoles.php",
        data: 'detail_key=' + detailKey,
        dataType: "html",
        success: function (data) {
            if (data.length > 0 && constructorId != 'stol') {
                $('#holesActions').show();
                $("#additives-tbl-container-holes").show();//проблема с прокруткой отверстий в это части
                $("#hide-table").css("display", "block");
                showHideTableStyles();
                $("#additives-tbl-container-holes").html(data);
                $('#holesTableSort').show();
                sortTable('holesTable', $('#holesTableSortColumn').val(), $('#holesTableSortDirection').val());
            } else {
                $("#additives-tbl-container-holes").hide();
                $("#hide-table").css("display", "none");
                $('#holesTableSort').hide();
                $('#holesActions').hide();
            }
        }
    });
}
function showHolePosition(holeKey) {
    if (detailHoles[holeKey]) {
        $('.svg-holes-' + holeKey).css('stroke-width', 3);
        $('.svg-holes-' + holeKey + '-track').css('stroke-width', 3);
        showPositionOnSide(detailHoles[holeKey][0], detailHoles[holeKey][1], detailHoles[holeKey][2], true, detailHoles[holeKey][7], detailHoles[holeKey][8]);
    }
}
function hideHolePosition(holeKey) {
    if (detailHoles[holeKey]) {
        $('.svg-holes-' + holeKey).css('stroke-width', 1);
        $('.svg-holes-' + holeKey + '-track').css('stroke-width', 1);
        hidePositionOnSide(detailHoles[holeKey][0]);
    }
}
/**
 * Hides all rows of drillholes' table 
 * except one with given hole id.
 * Uses global variable "holeFocused".
 * @param holeKey number Id of the hole.
 * @param mode string This param can have 4 possible values: 
 * "in", "on", "out", and "switch". Default is "switch". 
 * If the value is "in" or "on", the list "focuses" on the given hole and 
 * hides all other holes. If the value is out, the list "focuses out" and 
 * lists all the other holes of the detail. The "switch" value only changes 
 * the mode from "focued" to "unfocused" and vice versa.
 **/
function focusHole(holeKey, mode) {
    switch (mode) {
        case 'on': mode = 'in'; break;
        case 'out': break;
        case 'switch': default: mode = (holeFocused === holeKey) ? 'out' : 'in';
    }
    if ('in' === mode) {
        $('#holesTable tr').css('border', 'none');
        // $('#holesTable tr[id!="holeKeyId-' + holeKey + '"]').hide();
        $('#holesTable tr[id="holeKeyId-' + holeKey + '"]').show();
        $('#holesTable tr:has(th)').show();
        $('#holesTable tr[id="holeKeyId-' + holeKey + '"]').css('border', '3px solid red');
        var pos = $('#holesTable tr[id="holeKeyId-' + holeKey + '"]').position().top;
        $('#tablespack').animate({scrollTop: pos}, "fast");
        holeFocused = holeKey;
    } else {
        unhideHolesList();
        $('#tablespack').animate({scrollTop: 0}, "fast");
        holeFocused = '';
    }
}
// function onlyFiveDetails(detail,chek,table){
//     var TableUr,container;
//     switch (table){
//         case'groove':
//             TableUrl='system/views/additives/inc/tableGrooves.php';
//             container="#additives-tbl-container-grooves";
//             break;
//         case'Holes':
//             TableUrl='system/views/additives/inc/tableHoles.php';
//             container="#additives-tbl-container-holes";
//             break;
//         case'rabet':
//             TableUrl='system/views/additives/inc/tableRabbet.php';
//             container="#additives-tbl-container-rabbet";
//             break;
//         case'corner':
//             TableUrl='system/views/additives/inc/tableCorners.php';
//             container="#additives-tbl-container-corners";
//             break;
//         case'pattern':
//             TableUrl='system/views/additives/inc/tableShapesByPattern.php';
//             container="#additives-tbl-container-shapes-by-pattern";
//             break;
//     }
//         $.ajax({
//         type:'POST',
//         url:TableUrl,
//         data: {
//             btn:chek,
//             detail_key:detail
//         },
//         success:function (data) {
//             CloseWait();
//                     $(container).html(data);
//         }
//     })
// }
function unhideHolesList() {
    $('#holesTable tr[id^="holeKeyId-"]').css('border', 'none');
    $('#holesTable tr[id^="holeKeyId-"]').show();
}

function focusHoleWithoutHide(holeKey){
    var tr = $('#holesTable tr[id="holeKeyId-' + holeKey + '"]');
    if (tr.css('border-top-style') === 'none') {
        $('#holesTable tr').css('border', 'none');
        tr.css('border', '3px solid red');
    } else {
        tr.css('border', 'none');
    }
}

//-Сверление end-
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-Фрезировка start-
//Grooove
function getGrooves(grooves) {
    if (grooves) {
        //console.log('good grooves');
        detailGrooves.length = 0;
        for (key in grooves)
            detailGrooves.push([Number(grooves[key]['side']), Number(grooves[key]['type']), Number(grooves[key]['x']), Number(grooves[key]['y']), Number(grooves[key]['z']), Number(grooves[key]['d']), Number(grooves[key]['l']), Number(grooves[key]['key']), grooves[key]['bindH'], grooves[key]['bindV'], grooves[key]['ext']]);

        //showHoles();
        showGrooves();
    } else {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailGrooves', detail_key: detailKey}),
            dataType: 'json',
            success: function (data) {
                detailGrooves.length = 0;
                for (key in data)
                    detailGrooves.push([Number(data[key]['side']), Number(data[key]['type']), Number(data[key]['x']), Number(data[key]['y']), Number(data[key]['z']), Number(data[key]['d']), Number(data[key]['l']), Number(data[key]['key']), data[key]['bindH'], data[key]['bindV'], data[key]['ext']]);
                // draw();
                //showHoles();
                showGrooves();
            }
        });
    }
}
function showGrooves() {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/tableGrooves.php",
        data: 'detail_key=' + detailKey + '&machineId=' + machine,
        dataType: "html",
        success: function (data) {
            if (data.length > 0 && constructorId != 'stol') {
                $("#additives-tbl-container-grooves").show();
                $("#hide-table").css("display", "block");
                showHideTableStyles();
                $("#additives-tbl-container-grooves").html(data);
            } else {
                $("#additives-tbl-container-grooves").hide();
            }
        }
    });
}
function showSrez() {
    if ($('*').is($("#additives-tbl-container-srez"))) {
        //console.log('bad');
        $.ajax({
            type: "POST",
            url: "/service/system/views/additives/inc/tableSrez.php",
            data: 'detail_key=' + detailKey,
            dataType: "html",
            success: function (data) {
                if (data.length > 0 && constructorId != 'stol') {
                    $("#additives-tbl-container-srez").show();
                    $("#additives-tbl-container-srez").html(data);
                } else {
                    $("#additives-tbl-container-srez").hide();
                }
            }
        });
    }
}
function showGroovePosition(grooveKey) {
    $('g.svg-grooves-' + grooveKey + ' > path').css('stroke-width', 3);
    showPositionOnSide(detailGrooves[grooveKey][0], detailGrooves[grooveKey][2], detailGrooves[grooveKey][3], [], detailGrooves[grooveKey][9] == 'true',detailGrooves[grooveKey][8] == 'true', {'type':'groove','height':detailGrooves[grooveKey][6], 'width':detailGrooves[grooveKey][5], 'vert':detailGrooves[grooveKey][1]==1,});
}
function hideGroovePosition(grooveKey) {
    $('g.svg-grooves-' + grooveKey + ' > path').css('stroke-width', 1);
    hidePositionOnSide(detailGrooves[grooveKey][0]);
}
//Rabbet


function showClipping() {
    if (machine == 'altendorf' || machine == 'bhx' ) {
        $.ajax({
            type: "POST",
            url: "/service/system/views/additives/inc/tableClipping.php",
            data: 'detail_key=' + detailKey + '&machineId=' + machine,
            dataType: "html",
            success: function (data) {
                if (data.length > 0) {
                    $("#additives-tbl-container-clipping").show();
                    $("#additives-tbl-container-clipping").html(data);
                } else {
                    $("#additives-tbl-container-clipping").hide();
                }
            }
        });
    }
}

function showEdging() {
    if (machine) {
        $.ajax({
            type: "POST",
            url: "/service/system/views/additives/inc/tableEdging.php",
            data: 'detail_key=' + detailKey + '&machineId=' + machine,
            dataType: "html",
            success: function (data) {
                if (data.length > 0) {
                    $("#additives-tbl-container-edging").show();
                    $("#additives-tbl-container-edging").html(data);
                } else {
                    $("#additives-tbl-container-edging").hide();
                }
            }
        });
    }
}

function showRabbetPosition(rabbetKey) {
    $('g.svg-rabbets-' + rabbetKey + ' > rect').css('stroke-width', 3);
    // $('.svg-rabbets-' + rabbetKey + '-track').css('stroke-width', 3);
//    design.markRabbet('r' + (rabbetKey + 1), 'red');
//    design.refresh();
}
function hideRabbetPosition(rabbetKey) {
    $('g.svg-rabbets-' + rabbetKey + ' > rect').css('stroke-width', 1);
    // $('#svg-rabbet-' + rabbetKey + '-track').css('stroke-width', 1);
//    design.markRabbet('r' + (rabbetKey + 1), 'orange');
//    design.refresh();
}

//-фрезировка end-
//----------------------------------------------------------------------------------------------------------------------------------------------------
//-углы start-

function setCornerOperations(data) {
    detailCorners[1] = [];
    detailCorners[2] = [];
    detailCorners[3] = [];
    detailCorners[4] = [];
    if (data[1] != null) {
        detailCorners[1].push(
            Number(data[1]['key']),
            Number(data[1]['type']),
            Number(data[1]['r']),
            Number(data[1]['x']),
            Number(data[1]['y']),
            Number(data[1]['kromka']),
            Number(data[1]['kSide']),
            Number(data[1]['ext'])
        );
    }
    if (data[2] != null) {
        detailCorners[2].push(
            Number(data[2]['key']),
            Number(data[2]['type']),
            Number(data[2]['r']),
            Number(data[2]['x']),
            Number(data[2]['y']),
            Number(data[2]['kromka']),
            Number(data[2]['kSide']),
            Number(data[2]['ext'])
        );
    }
    if (data[3] != null) {
        detailCorners[3].push(
            Number(data[3]['key']),
            Number(data[3]['type']),
            Number(data[3]['r']),
            Number(data[3]['x']),
            Number(data[3]['y']),
            Number(data[3]['kromka']),
            Number(data[3]['kSide']),
            Number(data[3]['ext'])
        );
    }
    if (data[4] != null) {
        detailCorners[4].push(
            Number(data[4]['key']),
            Number(data[4]['type']),
            Number(data[4]['r']),
            Number(data[4]['x']),
            Number(data[4]['y']),
            Number(data[4]['kromka']),
            Number(data[4]['kSide']),
            Number(data[4]['ext'])
        );
    }
    $('#cornersSelect').attr("disabled", false);
    $('#cornersSelect').val(0);
    $('#cornersSelect').change();
    // if(redraw) {
        draw();
    // }
    showCorners();
}

function getCornerOperations(detail) {
    if (detail && detail['cornerOperations']) {
        setCornerOperations(detail['cornerOperations']);
    } else {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getDetailCornerOperations', detail_key: detailKey}),
            dataType: 'json',
            success: function (data) {
                setCornerOperations(data);
            }
        });
    }
}
function showCorners() {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/tableCorners.php",
        data: 'detail_key=' + detailKey + '&machineId=' + machine,
        dataType: "html",
        success: function (data) {
            if (data.length > 0) {
                $("#additives-tbl-container-corners").show();
                $("#additives-tbl-container-corners").html(data);
                $("#hide-table").css("display", "block");
                showHideTableStyles();
            } else {
                $("#additives-tbl-container-corners").hide();
                $("#hide-table").css("display", "hide");
            }
        }
    });

}
//-углы end-
//----------------------------------------------------------------------------------------------------------------------------------------------------
//-вырез start-
var detailShape = [];
var detailShapes = [];
var shapeControlID = 0;
var shapeTmp = [];
var detailShapesByPattern = [];

function getShapes(detail) {
    // if (detail && detail['shapes']) {
    //     if (detail['shapes'] != null) {
    //         detailShapes.length = 0;
    //         for (key in detail['shapes']) {
    //             detailShapes.push(detail['shapes'][key]);
    //         }
    //     } else {
    //         detailShapes = [];
    //     }
    //     showShapes();
    //     draw();
    // } else {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Additives',
            action: 'getDetailShapes',
            detail_key: detailKey
        }),
        dataType: 'json',
        success: function (data) {
            // console.log('data additives ', data);
            if (data != null) {
                detailShapes.length = 0;
                for (key in data) {
                    detailShapes.push(data[key]);
                }
            } else {
                detailShapes = [];
            }
            showShapes();
        }
    });
    // }
}
function showShapes() {
    $.ajax({
        type: "POST",
        url: "/service/system/views/additives/inc/tableShapes.php",
        data: 'detail_key=' + detailKey,
        dataType: "html",
        success: function (data) {
            if (data.length > 0) {
                $("#additives-tbl-container-shapes").show();
                $("#additives-tbl-container-shapes").html(data);
            } else {
                $("#additives-tbl-container-shapes").hide();
            }
        }
    });
}


//-вырез end-
//----------------------------------------------------------------------------------------------------------------------------------------------------

function bindInfoMessages() {
    var errMsg = $('#svg-draft').attr('errMsg');
    $('#drawinfo').text(
        errMsg ? errMsg : getDetailDesc()
    );
    // $('[id^=svg-hole-]').on('click', function () {
    //     focusHole(Number(this.getAttribute('id').slice(this.getAttribute('id').lastIndexOf('-') + 1)));
    // });
/*
    $('[id^=svg-shape-]').on('dblclick', function () {
        var id = Number(this.getAttribute('id').slice(this.getAttribute('id').lastIndexOf('-') + 1)) + 1;
        if (!isNaN(id) && typeof editShape == 'function') {
            editShape(id-1);
        }
    });
*/
    $('.corner1').on('mouseover', function (e) { e.stopPropagation(); markCorner(1); });
    $('.corner1').on('mouseout', function (e) { e.stopPropagation(); unmarkCorner(1); });
    $('.corner1').on('dblclick', function (e) { e.stopPropagation(); editCornerOperation(1); });
    $('.corner2').on('mouseover', function (e) { e.stopPropagation(); markCorner(2); });
    $('.corner2').on('mouseout', function (e) { e.stopPropagation(); unmarkCorner(2); });
    $('.corner2').on('dblclick', function (e) { e.stopPropagation(); editCornerOperation(2); });
    $('.corner3').on('mouseover', function (e) { e.stopPropagation(); markCorner(3); });
    $('.corner3').on('mouseout', function (e) { e.stopPropagation(); unmarkCorner(3); });
    $('.corner3').on('dblclick', function (e) { e.stopPropagation(); editCornerOperation(3); });
    $('.corner4').on('mouseover', function (e) { e.stopPropagation(); markCorner(4); });
    $('.corner4').on('mouseout', function (e) { e.stopPropagation(); unmarkCorner(4); });
    $('.corner4').on('dblclick', function (e) { e.stopPropagation(); editCornerOperation(4); });
    if (constructorId == 'stol') {
        $('#svg-side-5').on('mouseover', function () {
            if ($('#'+$(this).attr('id')+'-contour').attr('class').match('rounded')) {
                $('#drawinfo').text(
                    LANG['SIDE-ZAUKRUG']
                );
            }
        });
        $('#svg-side-5').on('mouseout', function () {

            $('#drawinfo').text(
                errMsg ? errMsg : getDetailDesc()
            );
        });
        $('#svg-side-3').on('mouseover', function () {
            if ($('#'+$(this).attr('id')+'-contour').attr('class').match('rounded')) {
                $('#drawinfo').text(
                    LANG['SIDE-ZAUKRUG']
                );
            }
        });
        $('#svg-side-3').on('mouseout', function () {
            $('#drawinfo').text(
                errMsg ? errMsg : getDetailDesc()
            );
        });
    }
    $('.svg-joint').on('mouseover', function () {
        $('#drawinfo').text(
            $('.svg-joint').attr('title')
        );
    });
    $('.svg-joint').on('mouseout', function () {
        $('#drawinfo').text(
            errMsg ? errMsg : getDetailDesc()
        );
    });
}
function switchEdges(switcher) {
    if (switcher) {
        $('#svg-side-2').show();
        $('#svg-side-3').show();
        $('#svg-side-4').show();
        $('#svg-side-5').show();
        $('#joint-line').show();
    } else {
        $('#svg-side-2').hide();
        $('#svg-side-3').hide();
        $('#svg-side-4').hide();
        $('#svg-side-5').hide();
        $('#joint-line').hide();
    }
}
function showCornersRest(switcher) {
    if (switcher) {
        $('[id^=svg-cut-]').hide();
        $('[id^=svg-width-]').hide();
        $('[id^=svg-height-]').hide();
        $('[id^=svg-corner-rest-]').show();
    } else {
        $('[id^=svg-cut-]').show();
        $('[id^=svg-width-]').show();
        $('[id^=svg-height-]').show();
        $('[id^=svg-corner-rest-]').hide();
    }
}
function markCorner(corner_id) {
    if ($("#corners-rest").prop("checked")) {
        return;
    }
    switch(corner_id) {
        case 2:
            setSizePosition("H", "d");
            break;
        case 3:
            setSizePosition("H", "d");
            setSizePosition("V", "l");
            break;
        case 4:
            setSizePosition("V", "l");
            break;
    }

    $('#svg-corner-rest-'+corner_id).show();

    $('.corner' + corner_id).css('stroke-width', 3);
    switch (detailCorners[corner_id][1]) {
        case 1:
            var corner_text = LANG['RADIUS-B']+': r=' + detailCorners[corner_id][2];
            break;
        case 2:
            var corner_text = LANG['CORNER']+': x=' + detailCorners[corner_id][3] + ', y=' + detailCorners[corner_id][4];
            break;
        case 3:
            var corner_text = LANG['ZAREZ']+': x=' + detailCorners[corner_id][3] + ', y=' + detailCorners[corner_id][4];
            break;
    }
    $('#drawinfo').text(corner_text);
}
function unmarkCorner(corner_id) {
    if ($("#corners-rest").prop("checked")) {
        return;
    }
    var errMsg = $('#svg-draft').attr('errMsg');

    setSizePosition();
    $('#svg-corner-rest-'+corner_id).hide();

    $('.corner' + corner_id).css('stroke-width', 1);
    $('#drawinfo').text(
        errMsg ? errMsg : getDetailDesc()
    );
}
function showBackside() {
    switchEdges();
    $('.groove-on-6').attr("class", "groove-on-1");
    $('.rabbet-on-6').attr("class", "rabbet-on-1");
    $('.hole-on-6').not('.hole-thru').attr("class", "hole-on-1");
    $('.rabbetH-on-6').attr("class", "rabbetH-on-1");
    $('.gola-on-6').attr("class", "gola-on-1");
    $('#svg-side-1').hide();
    $('#svg-side-6 .detail-side').show();
    $('#svg-draft').css('background', '#CCCCCC');
}
function hideDimensions() {
    $('#svg-dimensions').hide();
}
function showDimensions() {
    $('#svg-dimensions').show();
}
function showPositionOnSide(side_id, x, y, keep_prev, bindH, bindV, special) {
    if(!special)
        special = [];
    var is_groove = special['type'] == 'groove';

    // все данные в одно место, ибо нех выпендриваться условиями
    var positions = {
        'text':{
            'x':{
                'x' : x,
                'y': null,
                'rx': (x).toString().length + 'em',
                'cx': x,
                'cy': null,
                'text': x,
            },
            'y':{
                'x' : y,
                'y' : null,
                'rx': (y).toString().length + 'em',
                'cx': y,
                'cy': null,
                'text': y,
            }
        },
        'line':{
            'x':{
                'x1':null,
                'x2':x,
                'y1':y,
                'y2':y
            },
            'y':{
                'y1':null,
                'y2':y,
                'x1':x,
                'x2':x
            }
        }
    };
    if (!keep_prev) {
        hidePositionOnSide();
    }

    var identH = (detailHeight + 2*detailThickness + 60);
    var identW = (detailWidth + 2*detailThickness + 60);

    $('[id^=svg-cut-]').hide();

    if(side_id == 2){
        positions.text.x.cx = -x;
        positions.text.x.x = -x;
    }
    if(side_id == 5){
        positions.text.y.cx = -y;
        positions.text.y.x = -y;
    }

    if(bindH){
        setSizePosition("V","l");

        positions.line.x.x1 = x;
        if (side_id != '4') {
            positions.line.x.x2 = detailWidth;
            positions.text.y.y = identW;
        }
        positions.text.y.cy = identW;
        positions.text.x.text = (side_id == '4') ? x : (detailFullWidth-x).toFixed(1);
        positions.text.x.rx = (detailFullWidth-x).toString().length + 'em';

        if(is_groove){
            if(special['vert']){
                positions.line.y.x1 += special['width'];
                positions.line.y.x2 += special['width'];
                positions.line.x.x1 += special['width'];
                positions.text.x.cx += special['width'];
                positions.text.x.x += special['width'];
                positions.text.x.text -= special['width'];
            }else{
                positions.line.y.x1 += special['height'];
                positions.line.y.x2 += special['height'];
                positions.line.x.x1 += special['height'];
                positions.text.x.cx += special['height'];
                positions.text.x.x += special['height'];
                positions.text.x.text -= special['height'];
            }
        }
    }

    if(bindV){
        setSizePosition("H","d");

        positions.line.y.y1 = y;
        if (side_id != '3') {
            positions.line.y.y2 = detailHeight;
            positions.text.x.y = -identH;
        }
        positions.text.x.cy = -identH;
        positions.text.y.text = (side_id == '3') ? y : (detailFullHeight - y).toFixed(1);
        positions.text.y.rx = (detailFullHeight - y).toString().length + 'em';

        if(is_groove){
            if(special['vert']) {
                positions.line.x.y1 += special['height'];
                positions.line.x.y2 += special['height'];
                positions.line.y.y1 += special['height'];
                positions.text.y.cx += special['height'];
                positions.text.y.x += special['height'];
                positions.text.y.text -= special['height'];
            }else{
                positions.line.x.y1 += special['width'];
                positions.line.x.y2 += special['width'];
                positions.line.y.y1 += special['width'];
                positions.text.y.cx += special['width'];
                positions.text.y.x += special['width'];
                positions.text.y.text -= special['width'];
            }
        }
    }

    //ну и юзаем данные:
    // line x
    $('#svg-side-' + side_id + ' .x-line').attr('x1', positions.line.x.x1);
    $('#svg-side-' + side_id + ' .x-line').attr('x2', positions.line.x.x2);
    $('#svg-side-' + side_id + ' .x-line').attr('y1', positions.line.x.y1);
    $('#svg-side-' + side_id + ' .x-line').attr('y2', positions.line.x.y2);
    // line y
    $('#svg-side-' + side_id + ' .y-line').attr('x1', positions.line.y.x1);
    $('#svg-side-' + side_id + ' .y-line').attr('x2', positions.line.y.x2);
    $('#svg-side-' + side_id + ' .y-line').attr('y1', positions.line.y.y1);
    $('#svg-side-' + side_id + ' .y-line').attr('y2', positions.line.y.y2);
    // text x
    $('#svg-side-' + side_id + ' .x-text').text(positions.text.x.text);
    $('#svg-side-' + side_id + ' .x-text').attr('x', positions.text.x.x);
    $('#svg-side-' + side_id + ' .x-text').attr('y', positions.text.x.y);
    // text y
    $('#svg-side-' + side_id + ' .y-text').text(positions.text.y.text);
    $('#svg-side-' + side_id + ' .y-text').attr('x', positions.text.y.x);
    $('#svg-side-' + side_id + ' .y-text').attr('y', positions.text.y.y);
    // bg x
    $('#svg-side-' + side_id + ' .x-bg').attr('rx', positions.text.x.rx);
    $('#svg-side-' + side_id + ' .x-bg').attr('cx', positions.text.x.cx);
    $('#svg-side-' + side_id + ' .x-bg').attr('cy', positions.text.x.cy);
    // bg y
    $('#svg-side-' + side_id + ' .y-bg').attr('rx', positions.text.y.rx);
    $('#svg-side-' + side_id + ' .y-bg').attr('cx', positions.text.y.cx);
    $('#svg-side-' + side_id + ' .y-bg').attr('cy', positions.text.y.cy);
    //заюзали, показали, все красиво, все довольны

    $('#svg-side-' + side_id + ' .xy-pos').show();
}
function hidePositionOnSide(side_id) {
    if (!$("#corners-rest").prop("checked")) {
        $('[id^=svg-cut-]').show();
    }
    if (side_id > 0) {
        $('#svg-side-' + side_id + ' .xy-pos').hide();
    } else {
        $('[id^="svg-side-"] .xy-pos').hide();
    }
    setSizePosition();
}
function markSide(side_id, keep_prev) {
    if (!keep_prev) {
        $('[id^="svg-side-"] .detail-side').css("stroke", "black");
    }
    $('#svg-side-' + side_id + ' .detail-side').css("stroke", "red");
}
function markAllBlack() {
    $('[id^="svg-side-"] .detail-side').css("stroke", "black");
}
function markShape(shape_id, keep_prev) {
    if (!keep_prev) {
        $('[id^="svg-shape-"] *').css("strokeWidth", 1);
    }
    $('[id^=svg-shape-' + shape_id + '-part').css("strokeWidth", 3);
}
function unmarkShape(shape_id) {
    $('[id^=svg-shape-' + shape_id + '-part').css("strokeWidth", 1);
}
function markShapeByPattern(shape_id, keep_prev) {
//    if (!keep_prev) {
//        $('[id^="svg-shape-by-pattern-"] *').css("strokeWidth", 2);
//    }
//    $('[id^=svg-shape-by-pattern-' + shape_id).css("strokeWidth", 3);
}
function unmarkShapeByPattern(shape_id) {
//    $('[id^=svg-shape-by-pattern-' + shape_id).css("strokeWidth", 2);
}
function drawSVG(dKey, svgW, svgH) {
    //console.log('drawSVG');
    var dKey = (dKey >= 0) ? dKey : detailKey;
    var w = (svgW >= 0) ? svgW : 500;
    var h = (svgH >= 0) ? svgH : 500;
    var rect = $('#rectangles').prop("checked") ? 1 : 0;
    $('#draw').load("/service/system/controllers/MainController.php?controller=Ajax&action=getSvg&detail_key=" + dKey + "&h=" + h + "&w=" + w + ((machine) ? ('&machineId=' + machine) : ''), function (result) {
        switchEdges($("#end").prop("checked"));
        showCornersRest($("#corners-rest").prop("checked"));
        if ($('#svg-rectangles-1').attr('hidden')) {
            $('#rectangles').prop('checked', false);
            $('#rectangles').change();
        } else {
            $('#rectangles').prop('checked', true);
            $('#rectangles').change();
        }
        showDimensions();
        if ($("#invert").prop("checked") == true) {
            showBackside();
        }
        bindInfoMessages();
        markAllBlack();
        if(machine) {
            g_detail.getModule('init').svg();
        } else {
            for(var key in g_detail.modules) {
                if(g_detail.modules[key].use) {
                    g_detail.modules[key].use('svgs_init');
                }
            }
        }
    });
}
function draw() {
    drawSVG();
    //updateMenu();
}
function getDetailDesc() {
    return 'Деталь №' + (Number(Number(detailKey) + 1)) + ' [' + (kLeftThick + detailWidth + kRightThick).toFixed(1) + 'x' + (kTopThick + detailHeight + kBottomThick).toFixed(1) + 'x' + detailThickness + 'мм] ' + detailCount + ' шт.' + (detailCaption ? ' (' + detailCaption + ')' : '');
}

function setDetailDesc() {
    $('#detail-desc').html(getDetailDesc());
}

function editDetailInAdditional(target, focusId) {
    var addMenu = $.ajax({
        type: "POST",
        url: "/service/system/views/cutting/menu/add_detail.php",
        data: {forAdditiveMode: true, editMode: true},
        dataType: "html",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
    form = ($(addMenu).find('#detailsForm'));

    var div_id = "top-panel";
    var overlay = "top-panel-div";
    $('#' + div_id + ' .panel-title').text(getDetailDesc());
    $('#' + div_id + ' .panel-body').html('');
    $('#' + div_id + ' .panel-body').append(form);
    $('#' + overlay).show();
    var top = $(target).offset().top - $('#' + div_id).height() / 1.5 - $(window).scrollTop();
    if (top < 10) top = 10;
    else if (top + $('#' + div_id).height() > $(window).height()) top = $(window).height() - $('#' + div_id).height() - 10;
    $(window).off('keydown');
    form.submit(function () {
        $('#panel-cutting .panel-body').append(form);
        hideTopPanel(overlay);
    });
    $(".closebutton").click(function () {
        $('#panel-cutting .panel-body').append(form);
        hideTopPanel(overlay);
    });
    checkboxMask('.panel-body:not(.shadowtables)');
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'getDetail', key: detailKey}),
        dataType: 'json',
        success: function (data) {
            detailKey = data['key'];
            if (window.ro) {
                $("#details").attr("disabled", true);
            } else {
                $("#CaptionId").val('');
                $("#WidthId").val('');
                $("#Width").removeClass("has-success");
                $("#Width").removeClass("has-error");
                if (constructorId != 'stol') {
                    $("#HeightId").val('');
                }
                $("#Height").removeClass("has-success");
                $("#Height").removeClass("has-error");
                $("#StapleId").val(1);
                $("#Staple").removeClass("has-success");
                $("#Staple").removeClass("has-error");
                $("#CountId").val(1);
                $("#Count").removeClass("has-success");
                $("#Count").removeClass("has-error");
                $("#addButton").text(LANG['ADD']);
            }
            $("#CaptionId").val(data['caption']);
            $("#WidthId").val(data['width']);
            if (constructorId != 'stol' || materialType == 'compact') {
                $("#HeightId").val(data['height']);
            }
            $("#MultiplicityId").val(data['multiplicity']);
            $("#CountId").val(data['count']);
            if (!data.texture && $("#TextureId").val()) {
                $("#TextureId").prop("checked", "");
                $("#TextureId").parent().find('div')[0].className = 'input_mask';
            }
            $("#addButton").text(LANG['SAVE']);
            if (focusId) {
                $("#" + focusId).select();
            }
        }
    });
}

function deleteDetail(detail_key) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'del', key: detail_key}),
        dataType: 'json',
        success: function () {
            location.reload();
        }
    });
    updateEdgesList();
}

function createNewDetail(target) {

    var addMenu = $.ajax({
        type: "POST",
        url: "/service/system/views/cutting/menu/add_new_detail.php",
        data: {forAdditiveMode: true},
        dataType: "html",
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText;
    form = ($(addMenu).find('#detailsForm'));

    var div_id = "top-panel";
    var overlay = "top-panel-div";
    var title = "";
    $('#' + div_id + ' .panel-title').text(title);
    $('#' + div_id + ' .panel-body').html('');
    $('#' + div_id + ' .panel-body').append(form);
    $('#' + overlay).show();
    var top = $(target).offset().top - $('#' + div_id).height() / 1.5 - $(window).scrollTop();
    if (top < 10) top = 10;
    else if (top + $('#' + div_id).height() > $(window).height()) top = $(window).height() - $('#' + div_id).height() - 10;
    form.submit(function () {
        $('#panel-cutting .panel-body').append(form);
        hideTopPanel(overlay);
    });
    $(".closebutton").click(function () {
        $('#panel-cutting .panel-body').append(form);
        hideTopPanel(overlay);
    });
    checkboxMask('.panel-body');
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'getDetail', key: ""}),
        dataType: 'json',
        success: function (data) {
            //console.log(data, thickness);
            //detailKey = data['key'];
            if (window.ro) {
                $("#details").attr("disabled", true);
            } else {
                $("#CaptionId").val('');
                $("#WidthId").val('');
                $("#Width").removeClass("has-success");
                $("#Width").removeClass("has-error");
                if (constructorId != 'stol') {
                    $("#HeightId").val('');
                }
                $("#Height").removeClass("has-success");
                $("#Height").removeClass("has-error");
                $("#StapleId").val(1);
                $("#Staple").removeClass("has-success");
                $("#Staple").removeClass("has-error");
                $("#CountId").val(1);
                $("#Count").removeClass("has-success");
                $("#Count").removeClass("has-error");
                $("#addButton").text(LANG['CREATE']);
            }
//            $("#CaptionId").val("");
//            $("#WidthId").val("");
//            $("#HeightId").val("");
//            $("#MultiplicityId").val(1);
//            $("#CountId").val(1);
            //if (!data.texture) {
            //    $("#TextureId").prop("checked", "");
            //    $("#TextureId").parent().find('div')[0].className = 'input_mask';
            //}
            $("#addButton").text(LANG['CREATE']);
        }
    });
}

function addCopyDetailInDopCut(flip){
    flip = flip || '';

    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'copy', key: detailKey, flip: flip}),
        dataType: 'json',
        success: function (new_detail_key) {
            changeDetail(new_detail_key);
        },
        complete: function () {
            setTimeout(() => {
                detailsAmount = parseInt($('#detailSelect>option:last').val()) + 1;
                $('#tabs').find('#detailsAmount').text(detailsAmount);
            }, 500);
        }
    });
}

function HideIfBlur(element) {
    if (element.css('display') != 'inline-block') {
        element.slideDown(300, function () {
            $(document).bind('click.myEvent', function (e) {
                if (!$(e.target).closest(element).length) {
                    element.slideUp(300);
                    $(this).unbind('click.myEvent');
                }
            });
        });
    }
}

function showCopyDetailQestion(target) {
    HideIfBlur($(target).parent().find('#copyOption'));
}

function addDetail(str) {
    if (checkDetailWidth() && checkDetailHeight() && checkDetailMultiplicity() && checkDetailsCount()) {
        var form_data = $('#detailsForm').serialize() + '&key=' + detailKey;
        if (str != undefined) {
            form_data = $('#detailsForm').serialize();// + '&key=' + str;
        }
        if (form_data.match(/texture/) == null) {
            form_data += "&texture=0";
        }

        sendDetail(form_data, str);

        setTimeout(() => {
            detailsAmount = parseInt($('#detailSelect>option:last').val()) + 1;
            $('#tabs').find('#detailsAmount').text(detailsAmount);
        }, 500);
    }
}

function sendDetail(data, str) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ("controller=Cutting&action=add&" + data + "&isAdditive=1"),
        dataType: 'json',
        success: function (data) {
//            console.log(data);
            if (str == 'new') {
                window.history.pushState({}, '', '?d=' + (data));
                setDetails(data - 1);
                changeDetail(data - 1);
            } else {
                ReloadPage('additives');
            }
        }
    });
}

function setPanels() {
    if (localStorage.getItem('switch')) {
        $('.marila').insertAfter('#under-draft');
        $('.switcher').insertAfter('.dummy');
        $('.marila').removeClass('col-lg-4 col-md-5 col-sm-5');
        $('.switcher').addClass('col-lg-4');
    } else {
        $('.switcher').insertAfter('#under-draft');
        $('.marila').insertAfter('.dummy');
        $('.switcher').removeClass('col-lg-4');
        $('.marila').addClass('col-lg-4 col-md-5 col-sm-5');
    }
}

function switchPanels() {
    if (localStorage.getItem('switch') == 1) {
        localStorage.removeItem('switch');
    } else {
        localStorage.setItem('switch', 1)
    }
    setPanels();
}

function setSizePosition(type, pos) {
    var indent = detailThickness + 3 * 10; //48
    switch (type){
        case "V":
            if(pos == "l"){
                $("#svg-height-top-line").attr("transform","translate("+(-indent)+", "+detailHeight+") scale(1, -1) rotate(90)");
                $("#svg-height-bottom-line").attr("transform","translate("+(-indent)+", "+detailHeight+") scale(1, -1) rotate(90)");
                $("#svg-height-text").attr("transform","translate("+(-indent)+", 0) scale(1, -1) rotate(270)");
            }else{
                $("#svg-height-top-line").attr("transform","translate("+(+detailFullWidth+indent)+", "+detailHeight+") scale(1, -1)  rotate(90)");
                $("#svg-height-bottom-line").attr("transform","translate("+(+detailFullWidth+indent)+", "+detailHeight+") scale(1, -1)  rotate(90)");
                $("#svg-height-text").attr("transform","translate("+(+detailFullWidth+indent)+", 0) scale(1, -1)  rotate(270)");
            }
            break;
        case "H":
            if(pos == "d"){
                $("#svg-width-left-line").attr("transform","translate(0,"+(-indent)+") scale(1, -1)");
                $("#svg-width-right-line").attr("transform","translate(0,"+(-indent)+") scale(1, -1)");
                $("#svg-width-text").attr("transform","translate(0,"+(-indent)+") scale(1, -1)");
            }else{
                $("#svg-width-left-line").attr("transform","translate(0,"+(+detailFullHeight+indent)+") scale(1, -1)");
                $("#svg-width-right-line").attr("transform","translate(0,"+(+detailFullHeight+indent)+") scale(1, -1)");
                $("#svg-width-text").attr("transform","translate(0,"+(+detailFullHeight+indent)+") scale(1, -1)");
            }
            break;
        default:
            setSizePosition("V");
            setSizePosition("H");
    }
}



function getSides(action) {
    var sideSelected;
    var changeSide;


    if (materialOneSided) {
        if ($('#decoratedSide').val() === 'front') {
            sideSelected = 1;
        } else if ($('#decoratedSide').val() === 'back') {
            sideSelected = 6;
        }
    }
    if (action == 'rabbetSlim') {
        changeSide = Number($('#rabbetSlimSide').val());
    } else if (action == 'rabbet') {
        if ($('#rabbetSideSelect').val() < 16) {
            changeSide = 1;
        } else {
            changeSide = 6;
        }
    } else if (action == 'hole'){
        changeSide = $('#holeSideSelect').val();
    } else {
        changeSide = $('#grooveSideSelect').val();
    }

    if(action == 'shapeHandles'){
        var shapesByPattern = g_detail.getModule('shapesByPattern');
        var type = shapesByPattern.getval('handlesType');
        if (type == 'grooves'){
            changeSide = shapesByPattern.getval('sp_edgeForHandle');
        }
        if (type == 'rabbets'){
            changeSide = shapesByPattern.getval('sp_edgeForHandleRabbet')[0];
        }
    }
    return [sideSelected, changeSide];
}

function oneSidedPrompt(action) {
    var changeSide;
    var sideSelected;
    var message = LANG['DECOR-SIDE-OBR-CONF'];

    if ($('#decoratedSide').val() == 'front') {
        sideSelected = 1;
    } else {
        sideSelected = 6;
    }
    if (action == 'rabbet') {
        if ($('#rabbetSideSelect').val() < 16) {
            changeSide = 1;
        } else {
            changeSide = 6;
        }
    } else if (action == 'hole'){
        changeSide = $('#holeSideSelect').val();
    } else {
        changeSide = $('#grooveSideSelect').val();
    }
    // console.log('change = ', changeSide, ' | selected = ', sideSelected);
    if (changeSide == sideSelected) {
        // console.log('act = ', action);
        if (action == 'hole') {
            showConfirmMessage(message, addHole);
        } else if (action == 'groove') {
            showConfirmMessage(message, addGroove);
        } else {
            showConfirmMessage(message, addRabbet);
        }
    } else {
        if (action == 'hole') {
            addHole();
        } else if (action == 'groove') {
            addGroove();
        } else {
            addRabbet();
        }
    }
}

function initAxisControls() {
    var v = 0;
    var h = 0;
    var controllers_v = $('.axis-control-v');
    var controllers_h = $('.axis-control-h');
    var panels = $('.panel.panel-info .boxheader');

    var initaxis = () => {
        var axis = $('.svg-axis');
        axis.each((key, item) => {
            $(item).attr('visibility', 'hidden');
        });
        var key = (h == 0 && v == 1) ? 3 : v + h;
        $(axis[key]).attr('visibility', 'visible');
    };

    controllers_h.on('change', function() {
        switch (this.value) {
            case 'h':
            case 't':
            case '1':
                h = 1;
                break;
            default:
                h = 0;
        }
        initaxis();
    });

    controllers_v.on('change', function() {
        switch (this.value) {
            case 'w':
            case 'r':
            case 1:
                v = 1;
                break;
            default:
                v = 0;
        }
        initaxis();
    });

    panels.on('click', function () {
        v = 0; h = 0;
        controllers_h.each((key, item) => item.value = item[0].value);
        controllers_v.each((key, item) => item.value = item[0].value);
        initaxis();


        /*
        * Меню Доп.обработки
        */

         //Прячем меню обработок детали при нажатии.
        // var items = document.querySelectorAll('.panel-collapse.collapse');
        // if(document.querySelector('#accordion .panel-collapse.collapse.in')) {
        //     for(var i = 0; i < items.length; i++) {
        //         items[i].parentNode.style.display = 'block';
        //     }
        // } else {
        //     for(var i = 0; i < items.length; i++) {
        //         if(items[i] !== this.nextElementSibling) {
        //             items[i].parentNode.style.display = 'none';
        //         }
        //     }
        // }
    });
}