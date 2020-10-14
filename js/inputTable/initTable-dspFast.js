var inputTable2;
var opt;
var started = false;
var st2 = false;
var autosave = true;
var overall_size = false;
var details = {};

var table_type = 0;

var arrayForNext = {
    8: {
        2: {nextRow: true, pos: 0}
    },
    11: {
        2: {nextRow: true, pos: 0},
        6: {nextRow: true, pos: 3}
    },
    12: {
        2: {nextRow: true, pos: 0},
        6: {nextRow: true, pos: 3}
    },
    15: {
        2: {nextRow: true, pos: 0},
        6: {nextRow: true, pos: 3},
        9: {nextRow: true, pos: 0}
    }
};

$('#switch').on('click',function () {
    if(Object.keys(details).length == 0)
        change_table_mode([this]);
    else
        showConfirmMessage('Есть не сохраненные данные. Сохранить?', change_table_mode, [this, true], change_table_mode, [this]);
});

function testAutoSave(func, params) {
    if(Object.keys(details).length == 0){
        sendDetailWithEdge(null, null, 0, function(){
            func(params);
        });
    } else{
        showConfirmMessage('Есть не сохраненные данные. Сохранить?', sendArray, {f:func, v:params}, func, params);
    }
}

function change_table_mode(arr) {
    var el = arr[0];
    var isSave = arr[1];

    if ($("#table2").hasClass("activeTable")) {
        if(Object.keys(details).length != 0){
            if(isSave) {
                $('#autosave').click();
            }else {
                document.getElementById('autosave').checked = true;
                autosave = true;
            }
            details = {};
        }
        $(".detailsActionsWrapper").show();
        $("#swap1").addClass("din");
        $("#table2").removeClass("activeTable");
        $("#table2").addClass("notActiveT");
        $("#table1").addClass("activeTable");
        $("#table1").removeClass("notActiveT");
        $('div.fade-in-table2').hide();
//            $('div.table-caption').remove();
        $('div.fast_input2').empty();
        $('#details-tabel').show();
        $('#panel-cutting').show();
        $('#panel-info').show();
        showDetails();
        showDetailsInfo();
    } else {
        $(".detailsActionsWrapper").hide();
        ShowWait();
        $("#swap1").removeClass("din");
        $("#table2").addClass("activeTable");
        $("#table2").removeClass("notActiveT");
        $("#table1").addClass("notActiveT");
        $("#table1").removeClass("activeTable");
        $('#details-tabel').hide();
        $('#panel-cutting').hide();
        $('#panel-info').hide();
        $('div.fade-in-table2').show();
        table_start();
    }
    var params, tortsi;
    if (sessionStorage.getItem('params') != null) {
        params = sessionStorage.getItem('params');
    }
    if(sessionStorage.getItem('tortsi')!= null){
    tortsi = sessionStorage.getItem('tortsi');
    }
    if (params == 1 && (tortsi == 0 || tortsi == undefined)) {
        $("#fast_inp_2").prop('checked', true);
        $("#fast_inp_1").prop('checked', false);
        table_type = 2;
    }else if (params == 0 && tortsi == 0 || tortsi == undefined) {
        $("#fast_inp_1").prop('checked', false);
        $("#fast_inp_2").prop('checked', false);
        table_type = 0;
    }else if (params == 1 && tortsi == 1){
        $("#fast_inp_1").prop('checked', true);
        $("#fast_inp_2").prop('checked', true);
        table_type = 3;
    }else if (params == 0 && tortsi == 1){
        $("#fast_inp_1").prop('checked', true);
        $("#fast_inp_2").prop('checked', false);
        table_type = 1;
    }
    $("#fast_inp_2").on('change', function () {
        if (params == 1) {
            params = 0;
        } else {
            params = 1;
        }
        sessionStorage.setItem('params', params);
    });
    $("#fast_inp_1").on('change',function(){
        if(tortsi == 1){
            tortsi = 0;
        }else {
            tortsi = 1;
        }
        sessionStorage.setItem('tortsi',tortsi);
    });
}

$('#fast_input_check input').on('change',function() {
    var func = function () {
        table_type = 0;
        $("#fast_input_check input:checked").each(function (id, val) {
            table_type += Number(val.value);
        });
        $('div.fast_input2').html('');
        drawTable();
    };

    var self = this;

    if(!autosave && $('#use-save').is(':visible')){
        showConfirmMessage(
            'Есть не сохраненные данные. Хотите сохранить их перед выполнением даного действия?',
            function(){ sendArray(); func(); },
            null,
            function(){ var val = self.checked; self.checked = !val; }
        );
    }else{
        sendDetailWithEdge(null, null, 0, func);
    }
});
$('#autosave').on('change', function () {
    autosave = !autosave;
    if(autosave){
        $('#use-save').click();
    }
});

$('#overall_size').on('change', function () {
    overall_size = !overall_size;
}); 

function sendArray(callback) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: {controller:'Cutting',action:'addArray',data:details},
        dataType: 'json',
        success: function (data) {
            details = {};
            $('#use-save').hide();
            if(callback) callback.f(callback.v);
        }
    });
}

function drawTable() {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getEdgeList'}),
        context: document.body,
        dataType: 'json',
        success: function (data) {
            var options = first(data);
            second(options);
            open2();
            CloseWait();
        }
    });
}

function open2(){
    var caption2 = $('div.table-caption');
    // caption2.css({position:"sticky",top:"0px",'z-index':100});
    proccessEdgesList(function(data){
        caption2.html('');
        for(var i = 1; i < data.length; i++){
            var item = $('<div class="item-cont" title="'+data[i]['text']+'"></div>');
            item.html('<span>' + i + '</span>' + " " + data[i]['text']);
            caption2.append(item);
        }
    }, function (data){
        var options = [{
            value: 0,
            text: 'нет',
            thickness : 0,
            idx : 0
        }];
        var num = 1;
        for (var key in data) {
            options.push({
                value: data[key]['guid'],
                text: data[key]['title'],
                visible : data[key]['thickness'],
                idx : num
            });
            num++;
        }
        return options;
    });

    processDetails(function(data){
        transformData(data);

        inputTable2.rebuild(data);
        var table2 = $('div.fade-in-table2');
        table2.find('table').addClass('focus');
        if($(".mi-mi-table tr th").length==9||$(".mi-mi-table tr th").length==13){
            $("#visionchange").addClass("not_white_color");
        }
        if($(".mi-mi-table tr th").length==12||$(".mi-mi-table tr th").length==16){
            $("#visionchange").addClass("white_color");
        }
    });
}

function first(data) {
    var options = [{
        value: 0,
        text: 'нет',
        thickness: 0,
        idx: 0
    }];
    var num = 1;
    for (var key in data) {
        options.push({
            value: data[key]['guid'],
            text: data[key]['title'],
            thickness: data[key]['thickness'],
            height : data[key]['height'],
            idx: num,
        });
        num++;
    }
    return options;
}

function second(options) {
    //удаляем таблицу, если она уже существует
    if ($("#visionchange").length){
        $("#visionchange").remove();
        $(".table-add-but").remove();
        $("#use-save").remove();
    }
    opt = options;
    options2 = getTransformedOptions(options);

    var table2 = createTable('.fast_input2');
    // $('.fast_input2').append('<input type="button" class="btn btn-primary" id="use-save" value="Сохранить" onclick="sendArray()" style="display: none;left: 80px;bottom: 14px;height: 40px;">');
    table2.setIdxCaption('key')
        .setAddButtonTextAndTitle('+', '[Ctrl] + [Enter]')
        .addCell({
            type: 'width',
            edit: true,
            text: '<a data-action="help" data-section="details#length" class="help">'+ LANG['LONG']+'</a>',
            input: {
                tag: 'input',
                type: 'text', //(isMozilla ? 'text' : 'number'),
                color: 'white',
                pattern: '[0-9]+([\.,][0-9]+)?'
            },
            filter: true,
            textWithValidate: true,
            validate: function (data) {
                return validateForCalculate(data.width);
            }
            // validate: checks['width'],
            // errorMsg: 'Неверное значение длины!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">Справка</a></span>'
        }).addCell({
        type: 'height',
        edit: true,
        text: '<a data-action="help" data-section="details#width" class="help">Ширина</a>',
        input: {
            tag: 'input',
            type: 'text', //(isMozilla ? 'text' : 'number'),
            color: 'white',
            pattern: '[0-9]+([\.,][0-9]+)?'
        },
        filter: true,
        textWithValidate: true,
        validate: function (data) {
            return validateForCalculate(data.height);
        }
        //validate: checks['height'],
        //errorMsg: 'Неверное значение ширины!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">Справка</a></span>'
    }).addCell({
        type: 'count',
        edit: true,
        text: '<a data-action="help" data-section="details#count" class="help">'+ LANG['COL-VO'] +'</a>',
        input: {
            tag: 'input',
            type: 'text',
            color: 'white'
        },
        filter: true,
        textWithValidate: true,
        mustBeInteger: true,
        default: 0,
        validate: function (data) {
            return validateForCalculate(data.width);
        },
        //validate: checks['count'],
        //errorMsg: 'Неверное значение количества деталей!<span><a data-action="help" data-section="details#count" class="go-to-help">Справка</a></span>'

    });
    if (table_type == 1 || table_type == 3) {
        table2.addCell({
            type: 'top',
            edit: true,
            text: '<img src="/service/templates/img/Tabtop_min.svg">',
            input: {
                tag: 'input',
                type: 'text',
                color: 'gray'
            },
            default : '',
            validate: function (data) {
                return validateEdge(data.top);
            }
        }).addCell({
            type: 'bottom',
            edit: true,
            text: '<img src="/service/templates/img/Tabbottom_min.svg">',
            input: {
                tag: 'input',
                type: 'text',
                color: 'gray'
            },
            default : '',
            validate: function (data) {
                return validateEdge(data.bottom);
            }
        }).addCell({
            type: 'left',
            edit: true,
            text: '<img src="/service/templates/img/Tableft_min.svg">',
            input: {
                tag: 'input',
                type: 'text',
                color: 'gray'
            },
            default : '',
            validate: function (data) {
                return validateEdge(data.left);
            }
        }).addCell({
            type: 'right',
            edit: true,
            text: '<img src="/service/templates/img/Tabright_min.svg">',
            input: {
                tag: 'input',
                type: 'text',
                color: 'gray'
            },
            default : '',
            validate: function (data) {
                return validateEdge(data.right);
            }
        })
    }
    if(table_type == 2 || table_type == 3){
        table2.addCell({
            type: 'multiplicity',
            edit: true,
            text: '<a data-action="help" data-section="details#multiplicity" class="help">' + LANG['KRAT'] + '</a>',
            input: {
                tag: 'input',
                type: 'number',
                color: 'white'
            },
            default : 1
        }).addCell({
            type: 'texture',
            edit: true,
            text: '<a data-action="help" data-section="details#texture" class="help">Текстура</a>',
            input: {
                tag: 'input',
                type: 'checkbox',

                attrs: {
                    checked: 'checked'
                }
            },
            // validate: checks['texture'],
            errorMsg: 'Невозможно учесть текстуру для указанных габаритов детали!<span><a data-action="help" data-section="details#texture" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>'
        }).addCell({
                type: 'caption',
                edit: true,
                text: '<a data-action="help" data-section="details#caption" class="help">' + LANG['NAME'] + '</a>',
                input: {
                    tag: 'input',
                    type: 'text',
                    color: 'white'
                },
                default: ''
            });
    }
    table2.addCell({
        type: 'operations',
        edit: true,
        text: LANG['OBR-OB'],
        input: {
            tag: 'input',
            type: 'text',
            color: 'white'
        },
        // not_focus: true,
        disable: true,
        validate: function (data) {
            return true;
        },
    });

    table2.addCell({
        type: 'marker',
        edit: true,
        text: '<a data-action="help" data-section="details#marker" class="help">Маркер</a>',
        input: {
            tag: 'input',
            type: 'checkbox',

            attrs: {

            }
        },
    });

    inputTable2 = table2.addAction('help', function (event) {
        showHelp($(event.target).data('section'));
    }).delete(function (idx) {
        delDetail(idx);
    }).onRowAdded(function (lastRow) {
        if (lastRow == undefined) {
            return true;
        }
        return true;
    }, 'Заполните все обязательные поля : Длина, Ширина')
        .change(function (data, serverKeyFunc) {
            if (data['right'] == undefined) {
                if (data['count'] == undefined) {
                    data['count'] = '1';
                }
            } else if (data['left'] == undefined) {
                return;
            }
            if (data['height'] === '' || data['height'] === null || data['width'] === '' || data['width'] === null) {
                return;
            }

            /** Если включен чекбокс "габаритный размер" пересчитываем размер, отнимая установленные на детали кромки */
            if (overall_size){
                var detailEdges = getEdgesList();
                leftThick = data['left'] ? detailEdges[data['left'] - 1]['thickness'] : 0;
                rightThick = data['right'] ? detailEdges[data['right'] - 1]['thickness'] : 0;
                topThick = data['top'] ? detailEdges[data['top'] - 1]['thickness'] : 0;
                bottomThick = data['bottom'] ? detailEdges[data['bottom'] - 1]['thickness'] : 0;
                data['width'] -= (leftThick + rightThick);
                data['height'] -= (topThick + bottomThick);
            }

            var result = new defaultDetail().updateData(data);
            if(autosave) {
                var detailData = result['params'];
                var edges = undefined;
                if (data && data.left !== undefined) {
                    var edges = {
                        key: data['key'],
                    };
                    srezOrKromka(edges, 'Top', data['top']);
                    srezOrKromka(edges, 'Bottom', data['bottom']);
                    srezOrKromka(edges, 'Left', data['left']);
                    srezOrKromka(edges, 'Right', data['right']);
                }
                sendDetailWithEdge(detailData, edges);
            }else{
                var edges = '';
                var have_edges = document.getElementById('fast_inp_1');
                if(have_edges && have_edges.checked) {
                    edges = {
                        key: data['key']
                    };
                    srezOrKromka(edges, 'Top', data['top']);
                    srezOrKromka(edges, 'Bottom', data['bottom']);
                    srezOrKromka(edges, 'Left', data['left']);
                    srezOrKromka(edges, 'Right', data['right']);
                }
                details[data['key']] = {data:result.params,edges:edges};

                $('#use-save').show();
            }
        }).build();
}

// function getedges (){

// }

function validateEdge(data){
    if(data != '') {
        var intdatasrez = +data.replace('*', '');
        if (data.indexOf('*') == data.length - 1) {
            if (!intdatasrez || intdatasrez > 45 || intdatasrez < -45) {
                showErrorMessage('Введен угол среза.');
                return false;
            }
            return true;
        }
        if (jQuery.inArray(+data - 1 + "", Object.keys(edges)) == -1) {
            showErrorMessage('Введен неправельный индекс кромки.');
            return false;
        }
    }
    return true;
}

function defaultDetail() {
    this.params = {
        count: 0,
    };

    this.updateData = function (data) {
        for (var p in data) {
            if (data[p] == null && p != 'edit') {
                return;
            } else {
                if (p == 'texture') {
                    this.params[p] = (data[p] ? 1 : 0);
                } else if(p == 'thickness') {
                    this.params[p] = data[p] / data['multiplicity'];
                } else {
                    this.params[p] = data[p];
                }
            }
        }
        return this;
    };

    this.toString = function () {
        var result = '';
        for(var key in this.params){
            result += key + '=' + this.params[key] + '&';
        }
        return result;
    };
}

function useMove(rows,move_from,move_to,autosave) {
    if(autosave) {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Cutting', action: 'moveDetail', move_from: move_from, move_to: move_to}),
            dataType: 'json',
            success: function (data) {
                // перезаписываем данные
                // var tmp = rows[move_from];
                // rows[move_from] = rows[move_to];
                // rows[move_to] = tmp;

                $('.fast_input2').html('');
                drawTable();
                setTimeout(function(){marker(move_to);},300);
                // $()
                return true;
            }
        });
    }else{
        showErrorMessage('Данная операция доступна только при включенном авто-сохранении.');
    }

    return false;
}

function marker(idx) {
    var elem = $(".mi-mi-table tr")[+idx+1];

    $('html, body').animate({
        scrollTop: ($(elem).offset().top - 45)
    }, 400);
    $(elem).effect("highlight", {}, 3000);
    // elem.style.transition = 'all 1.5s';
    // elem.style.background = 'yellow';
    // setTimeout(function(){elem.style.background = 'initial';},1000);
}

function useCopy(event,autosave,idx,flip) {
    if(autosave){
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Cutting', action: 'copy', key: idx, flip: flip}),
            dataType: 'json',
            success: function (new_detail_key) {
                $(".fast_input2").html('');
                drawTable();
                setTimeout(function(){marker(idx+1);},300);

            }
        });
    }else{
        showErrorMessage('Данная операция доступна только при включенном авто-сохранении.');
    }

    $(event.target).parent().remove();
}

function table_start() {
    var checks = {

        widthHeight: function (data, height) {
            if ((!height && (data['width'] == null || data['width'] == '')) || height && (data['height'] == null || data['height'] == '')) return true;
            var maxW;
            var maxH;
            var minW;
            var minH;
            var multiplicity = data['multiplicity'];
            if (multiplicity > 1) {
                maxW = parseFloat(maxWidth - indenCrosslinking);
                maxH = parseFloat(maxHeight - indenCrosslinking);

                minW = parseFloat(minWidthForMultiplicity);
                minH = parseFloat(minHeightForMultiplicity);

            } else {
                maxW = parseFloat(maxWidth);
                maxH = parseFloat(maxHeight);

                minW = parseFloat(minWidth);
                minH = parseFloat(minHeight);
            }
            var texture = data['texture'];

            var wid = data['width'] != '' ? parseFloat(data['width'].toString().replace(',', '.')).toFixed(1) : 0;

            var hei = data['height'] != '' ? parseFloat(data['height'].toString().replace(',', '.')).toFixed(1) : 0;


            //var minW = hei != 0 ? (hei < maxH && hei > minHeight ? minWidth : minHeight) : minWidth;


            //Если делаем проверку "высоты" - меняем все занчения местами
            if (height) {
                //Меняем минимальные
                var tmp = minH;
                minH = minW;
                minW = tmp;

                //Меняем максимальные
                tmp = maxW;
                maxW = maxH;
                maxH = tmp;

                //Меняем актуальные
                tmp = wid;
                wid = hei;
                hei = tmp;
            }

            if (wid >= minW && wid <= maxW && (hei == 0 || hei <= maxH && hei >= minH)) {
                return true;
            } else if (!texture || (wid <= Math.max(minH, minW) || wid < Math.min(maxH, maxW))) {

                if (hei == 0) {

                    if (wid <= maxH && wid >= Math.min(minH, minW)) {

                        return true;
                    } else {

                        return false;
                    }
                } else {

                    if (hei <= maxW && wid <= maxH && wid >= (hei >= Math.max(minH, minW) ? Math.min(minH, minW) : Math.max(minH, minW))) {

                        return true;
                    } else {

                        return false;
                    }
                }
            }


            return false;
        },

        width: function (data) {
            return checks.widthHeight(data, false);
        },

        height: function (data) {
            return checks.widthHeight(data, true);
        },

        thickness: function (data) {

        },

        count: function (data) {

            if (data['count'] < 1 || parseInt(data['count']) != data['count']) {
                return false;
            }

        },

        marker: function (data) {
            return true;
        },

        texture: function (data) {
            if (data['texture'] && (data['width'] != undefined && (data['width'] > maxWidth)
                || (data['height'] != undefined && data['height'] > maxHeight))) {
                return false;
            }
        },

        edge : function(cell, data){
            var target = data[cell.type].toString();

            if(target === '' || target == null || parseInt(target) != target && parseInt(target) + '*' != target) {
                cell.errorMsg = 'Недопустимое значение для данного поля!';
                return false;
            }
            if(target.indexOf('*') == target.length - 1){
                var angle = parseInt(target);
                if(angle > 45){
                    cell.errorMsg = 'Недопустимое значение градуса среза, должно быть не больше чем 45! <span><a data-action="help" data-section="edges" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>';//detail-angle
                    return false;
                } else if(angle == 0) {
                    cell.errorMsg = 'Градус среза не может быть 0!';
                    return false;
                } else {
                    return true;
                }
            } else if(target > 0){
                if(opt.length == 1){
                    cell.errorMsg = 'Список кромок пуст!';
                    return false;
                } else if(target >= opt.length) {
                    cell.errorMsg = 'Нет кромки по заданному номеру!';
                    return false;
                } else {
                    if(data['multiplicity'] > 1){
                        var th = thickness * data['multiplicity'];
                        if(opt[target].height < th){
                            cell.errorMsg =  'Ширина выбранной   кромки не соответствует толщине детали!';
                            return false;
                        }
                    }
                    return true;
                }
            } else {
                return true;
            }
            //cell.errorMsg =  'Недопустимое значение для данного поля!';
            //return false;
        }

    };
    var options;

    var table2 = $('div.fade-in-table2');
    var fast_inp = $('div.fast_input2');
    // var caption2 = $('div.table-caption');
    // table2.prepend(caption2);
    // table2.prepend(check);

    var winSize = $('html').width();
    var wid = winSize >= 1200 ? 1190 : winSize - 10;

    setPreSaveAction(['#main-menu li','#sel-edges button','#sel-material a','#tabs .tabN']);

    drawTable();
    return autosave;

}

function setPreSaveAction(selectors) {
    selectors.forEach(function (selector) {
        $(selector).each(function (i, s) {
            var old_func = s.onclick;
            s.onclick = function () {
                testAutoSave(old_func);
            };
        });
    });
}

function srezOrKromka(data, key, value){
    var value = value || '';

    value = value.toString();
    if(value.indexOf('*') == value.length - 1){
        data['s' + key] = parseInt(value);
        data['k' + key] = '';
    } else {
        data['k' + key] = getGuidByIdx(parseInt(value));
        data['s' + key] = '';
    }
}

function getGuidByIdx(idx) {
    if (opt[idx] === undefined) {
        return '';
    } else {
        return opt[idx]['value'];
    }
}

function getIdxByGuid(guid) {
    for(var i = 0; i < opt.length; i++){
        if(opt[i]['value'] == guid){
            return i || '';
        }
    }
    return '';
}

function transformData(data){

    for(var i = 0; i < data.length; i++) {
        //data[i]['top'] = getIdxByGuid(data[i]['top']);
        //data[i]['bottom'] = getIdxByGuid(data[i]['bottom']);
        //data[i]['right'] = getIdxByGuid(data[i]['right']);
        //data[i]['left'] = getIdxByGuid(data[i]['left']);
        data[i]['top'] = resolveEdge(data[i], 'top');
        data[i]['bottom'] = resolveEdge(data[i], 'bottom');
        data[i]['right'] = resolveEdge(data[i], 'right');
        data[i]['left'] = resolveEdge(data[i], 'left');
    }
}

function resolveEdge(obj, side){
    if(obj[side + 'Type'] == 'srez'){
        return obj[side] + '*';
    } else {
        return getIdxByGuid(obj[side]);
    }
}

function getTransformedOptions(options) {
    var res = [];
    for (var i = 0; i < options.length; i++) {
        res[i] = {};
        res[i]['text'] = options[i]['text'];
        res[i]['value'] = options[i]['idx'];
    }
    return res;
}

/**
 * Выполняет валидацию размера (width или height) детали
 * !!!перенесено в validateForCalculate
 * @param size - строка таблица для валидации
 */
function validateSize(size) {
    var tmpSize = +size;

    var flagErr = !((typeof(tmpSize) == "number") && (tmpSize > 0) && !isNaN(tmpSize));

    return !flagErr;
}

/**
 * Выполняет валидацию строки таблицы на корректность параметров  width и height детали
 *
 * @param row - строка таблица для валидации
 */
function validateRow(row) {
    var data = row.getAllData();
    var width = +data.width;
    var height = +data.height;

    if ((typeof(width) == "number") && (width > 0) && !isNaN(width) &&
        (typeof(height) == "number") && (height > 0) && !isNaN(height))
        return true;

    return false;
}

/**
 * Выполняет валидацию таблицы на корректность параметров  width и height детали
 *
 * @param currentTable - таблица для валидации
 */
function validateRows(currentTable) {
    var flagNotErr = true;
    for (var i = 0; i < currentTable.rows.length; i++) {
        var row = currentTable.rows[i];
        flagNotErr = flagNotErr && validateRow(row);
    }
    return flagNotErr;
}

/**
 * Проверяет на отсутствие букв,
 * @param text - строка таблицы для валидации
 */
function validateForCalculate(text) {
    var tmpSize = +text;
    var flagErr = !((typeof(tmpSize) == "number") && (tmpSize > 0) && !isNaN(tmpSize));
    if (flagErr){
        return !flagErr;
    }
    return !(/[^\d\.\,\+\-*/()]+/.test(text));
}
