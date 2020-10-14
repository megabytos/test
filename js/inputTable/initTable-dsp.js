/**
 * Created by Хицков Стефан on 22.10.2015.
 */

var inputTable;
var opt;

$(document).ready(function () {


        var checks = {

            widthHeight: function (data, height) {

                //if(data['height'] == '' || data['height'] == null && data['width'] == '' || data['width'] == null) return true;
                //console.log(height + " -" + data['width'] + "- -" + data['height'] + "-");
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

            texture: function (data) {

                if (data['texture'] && (data['width'] != undefined && (data['width'] > maxWidth)
                    || (data['height'] != undefined && data['height'] > maxHeight))) {
                    return false;
                }
            },

            edge : function(cell, data){
                var target = data[cell.type].toString();

                //console.log(target);

                if(target === '' || target == null || parseInt(target) != target && parseInt(target) + '*' != target) {
                    cell.errorMsg = 'Недопустимое значение для данного поля!';
                    return false;
                }
                //console.log('133');
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
                      //  console.log(data['multiplicity']);
                        if(data['multiplicity'] > 1){
                            var th = thickness * data['multiplicity'];
                          //  console.log(opt);
                            if(opt[target].height < th){
                                cell.errorMsg =  'Ширина выбранной   кромки не соответствует толщине детали!';
                                return false;
                            }
                        }
                       // console.log(opt);
                        return true;
                    }
                } else {
                    return true;
                }
                //cell.errorMsg =  'Недопустимое значение для данного поля!';
                //return false;
            }

        };

        //
        proccessEdgesList(function (options) {
            opt = options;



            options = getTransformedOptions(options);

            //
            //    processDetails(function (details) {
            //

            var table = createTable('.fast_input');

            inputTable = table.setIdxCaption('key')
                .setAddButtonTextAndTitle('+', '[Ctrl] + [Enter]')
                .addCell({
                    type: 'width',
                    edit: true,
                    text: '<a data-action="help" data-section="details#length" class="help">'+ LANG['LONG']+'</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    validate: checks['width'],
                    //errorMsg: 'Неверное значение длины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                    errorMsg: 'Неверное значение длины!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>'

                }).addCell({
                    type: 'height',
                    edit: true,
                    text: '<a data-action="help" data-section="details#width" class="help">Ширина</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    validate: checks['height'],
                    //errorMsg: 'Неверное значение ширины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                    errorMsg: 'Неверное значение ширины!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>'
                }).addCell({
                    type: 'count',
                    edit: true,
                    text: '<a data-action="help" data-section="details#count" class="help">'+LANG['COL-VO']+'</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    default: 1,
                    validate: checks['count'],
                    errorMsg: 'Неверное значение количества деталей!<span><a data-action="help" data-section="details#count" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>'

                }).addCell({
                    type: 'top',
                    edit: true,
                    text: 'В',
                    input: {
                        tag: 'input',
                        type: 'text'
                    },
                    default : 0,
                    validate : function(data){
                        return checks['edge'](this, data);
                        //var res = checks['edge'](data, this.type);
                        //if(res != undefined){
                        //    this.errorMsg = res;
                        //    return false;
                        //} else {
                        //    return true;
                        //}
                    }
                }).addCell({
                    type: 'bottom',
                    edit: true,
                    text: 'Н',
                    input: {
                        tag: 'input',
                        type: 'text'
                    },
                    default : 0,
                    validate : function(data){
                        return checks['edge'](this, data);
                    }
                }).addCell({
                    type: 'left',
                    edit: true,
                    text: 'Л',
                    input: {
                        tag: 'input',
                        type: 'text'
                    },
                    default : 0,
                    validate : function(data){
                        return checks['edge'](this, data);
                    }
                }).addCell({
                    type: 'right',
                    edit: true,
                    text: 'П',
                    input: {
                        tag: 'input',
                        type: 'text'
                    },
                    default : 0,
                    validate : function(data){
                        return checks['edge'](this, data);
                    }
                }).addCell({
                    type: 'multiplicity',
                    edit: thickness >= minThicknessForMultiplicity,
                    //edit: true,
                    text: '<a data-action="help" data-section="details#multiplicity" class="help">Кратность</a>',
                    input: {
                        tag: 'input',
                        type: 'number',
                        //count: parseInt(maxThickness / thickness) > 3 ? 3 : parseInt(maxThickness / thickness)
                    },
                    default : 1,
                    validate: function (data) {
                        var st = data['multiplicity'];
                        if (thickness < minThicknessForMultiplicity) {
                            maxThickness = thickness;
                        }
                        var max = parseInt(maxThickness / thickness);
                        if (max > maxMultiplicity) {
                            max = maxMultiplicity;
                        }
                        if (st != parseInt(st) || st <= 0 || st > max) {
                            this.errorMsg = 'Недопустимое значение для данного поля, минимум : 1, максимум : ' + max;
                            return false;
                        }
                        var wRes = true;
                        var hRes = true;

                        if (data['height'] != null) {
                            hRes = checks['height'](data);
                        }
                        if (data['width'] != null) {
                            wRes = checks['width'](data);
                        }

                        if (wRes && hRes) {

                            data['thickness'] = (st * thickness);
                            var edgKey = ['top', 'bottom', 'left', 'right'];
                            var hasChange = false;
                            for(var i in edgKey){
                                if(data[edgKey[i]] != 0){
                                    hasChange = true;
                                    data[edgKey[i]] = 0;
                                }
                            }
                            //data['top'] = 0;
                            //data['bottom'] = 0;
                            //data['left'] = 0;
                            //data['right'] = 0;
                            if (hasChange) {
                            //    inputTable.update(data['key'], data);
                                inputTable.showMsg('Установленные обработки торцов детали были отменены', inputTable.INFO_MSG, 3000);
                            }

                        } else {
                            this.errorMsg = 'Габариты детали не позволяют произвести склеивание нескольких слоев!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>';
                            return false;
                        }
                        //inputTable.showMsg('multiplicity msg', inputTable.INFO_MSG);


                    },
                    //errorMsg: 'Габариты детали не позволяют произвести склеивание нескольких слоев!<span><a data-action="help" data-section="limitations#detail-size-limits" class="go-to-help">Справка</a></span>'
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
                    validate: checks['texture'],
                    errorMsg: 'Невозможно учесть текстуру для указанных габаритов детали!<span><a data-action="help" data-section="details#texture" class="go-to-help">'+ LANG['INFO-SPRAVKA'] +'</a></span>'
                }).addCell({
                    type: 'caption',      //обязательно
                    edit: true,        //обязательно
                    text: '<a data-action="help" data-section="details#caption" class="help">'+ LANG['NAME'] +'</a>',  //обязательно
                    input: {           //не обязательно
                        tag: 'input',
                        type: 'text'
                    },
                    default: '',
                    validate: function (data) {
                        if(data['caption'].length > 80){
                            this.errorMsg = 'Название не может быть длиннее 80-ти символов, сейчас : ' + data['caption'].length
                            return false;
                        }
                    },
                    //errorMsg: 'Название не может быть длиннее 80-ти символов'
                }).addCell({
                    type: 'thickness',
                    edit: false,
                    text: 'Толщина',
                    default: thickness

                }).addAction('help', function (event) {
                    //console.log($(event.target).data('section'));
                    showHelp($(event.target).data('section'));

                }).delete(function (idx) {

                    delDetail(idx);

                }).onRowAdded(function (lastRow) {
                //    console.log(lastRow);
                    if (lastRow == undefined) {
                        return true;
                    }
                    if (lastRow['height'] === '' || lastRow['height'] === null || lastRow['width'] === '' || lastRow['width'] === null) return false;
                    //for (var p in lastRow) {
                    //    if (lastRow[p] == null) {
                    //        return false;
                    //    }
                    //}
                    return true;

                }, 'Заполните все обязательные поля : Длина, Ширина')
                .change(function (data) {

                    if (data['height'] === '' || data['height'] === null || data['width'] === '' || data['width'] === null) return;

                    var result = '';

                    for (var p in data) {
                        if (data[p] == null) {
                            return;
                        } else {
                            if (p == 'texture') {
                                result += p + '=' + (data[p] ? 1 : 0) + '&';
                            } else if(p == 'thickness') {
                                result += p + '=' + data[p] / data['multiplicity'] + '&';
                            } else {
                                result += p + '=' + data[p] + '&';
                            }
                        }
                    }

                    sendDetail(result, function () {
                        // console.log(getGuidByIdx(data['top']));
                        var edges = {
                            key : data['key']
                        };

                        srezOrKromka(edges, 'Top', data['top']);
                        srezOrKromka(edges, 'Bottom', data['bottom']);
                        srezOrKromka(edges, 'Left', data['left']);
                        srezOrKromka(edges, 'Right', data['right']);

                        setEdgeOperations(edges);

                        //setEdgeOperations(
                        //    edges, function (result) {
                        //        //data['top'] = result.top.param;
                        //
                        //
                        //        console.log(result);
                        //        var hasChange = false;
                        //        for (var k in result) {
                        //            if(result[k].type == 'srez'){
                        //                if(parseInt(data[k]) != result[k].param){
                        //                    data[k] = result[k].param;
                        //                    hasChange = true;
                        //                }
                        //            } else {
                        //                var guid = getGuidByIdx(data[k]);
                        //                if (guid != result[k].param) {
                        //                    data[k] = result[k].param;
                        //                    hasChange = true;
                        //                }
                        //            }
                        //        }
                        //        //for (var k in result) {
                        //        //
                        //        //    if (getGuidByIdx(data[k]) != result[k].param) {
                        //        //        data[k] = result[k].param;
                        //        //        hasChange = true;
                        //        //    }
                        //        //}
                        //        if (hasChange) {
                        //            inputTable.update(data['key'], data);
                        //            inputTable.showMsg('Установленные обработки торцов детали были изменены', inputTable.ERROR_MSG, 3000);
                        //        }
                        //    });


                        //setEdgeOperations(data['key'],
                        //    getGuidByIdx(data['top']),
                        //    getGuidByIdx(data['bottom']),
                        //    getGuidByIdx(data['left']),
                        //    getGuidByIdx(data['right']), function (result) {
                        //        //data['top'] = result.top.param;
                        //
                        //        var hasChange = false;
                        //        for (var k in result) {
                        //
                        //            if (getGuidByIdx(data[k]) != result[k].param) {
                        //                data[k] = result[k].param;
                        //                hasChange = true;
                        //            }
                        //        }
                        //        if (hasChange) {
                        //            inputTable.update(data['key'], data);
                        //            inputTable.showMsg('Установленные обработки торцов детали были изменены', inputTable.ERROR_MSG, 3000);
                        //        }
                        //    });
                    });
                }).build();
        }, function (data) {
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
                    idx: num
                });
                num++;
            }
            return options;
        });
    }
);

function srezOrKromka(data, key, value){
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
    return opt[idx]['value'];
}

function getIdxByGuid(guid) {
    for(var i = 0; i < opt.length; i++){
        if(opt[i]['value'] == guid){
            return i;
        }
    }
    return -1;
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