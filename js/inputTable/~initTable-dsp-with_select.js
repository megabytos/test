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


                //if (wid >= minW && wid <= maxW && (hei == 0 || hei <= maxH && hei >= Math.max(minH, minW))) {
                //if (wid >= minW && wid <= maxW && (hei == 0 || hei <= maxH && hei >= minH)) {
                if (wid >= minW && wid <= maxW && (hei == 0 || hei <= maxH && hei >= minH)) {
                    //if (wid >= minW) {
                    //    if(wid <= maxW){
                    //        if(hei == 0){
                    //            return true;
                    //        } else if(hei <= maxH){
                    //            if(hei >= minH){
                    //                return true;
                    //            }
                    //        }
                    //
                    //    }
                    //

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
                    text: '<a data-action="help" data-section="detail-dlinna" class="help">Длина</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    validate: checks['width'],
                    //errorMsg: 'Неверное значение длины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                    errorMsg: 'Неверное значение длины!<span><a data-action="help" data-section="detail-warning" class="go-to-help">Справка</a></span>'

                }).addCell({
                    type: 'height',
                    edit: true,
                    text: '<a data-action="help" data-section="detail-shirina" class="help">Ширина</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    validate: checks['height'],
                    //errorMsg: 'Неверное значение ширины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                    errorMsg: 'Неверное значение ширины!<span><a data-action="help" data-section="detail-warning" class="go-to-help">Справка</a></span>'
                }).addCell({
                    type: 'count',
                    edit: true,
                    text: '<a data-action="help" data-section="detail-count" class="help">Кол-во</a>',
                    input: {
                        tag: 'input',
                        type: 'number'
                    },
                    default: 1,
                    validate: checks['count'],
                    errorMsg: 'Неверное значение количества деталей!<span><a data-action="help" data-section="detail-count" class="go-to-help">Справка</a></span>'

                }).addCell({
                    type: 'top',
                    edit: true,
                    text: 'В',
                    input: {
                        tag: 'select',
                        options: options
                    }
                }).addCell({
                    type: 'bottom',
                    edit: true,
                    text: 'Н',
                    input: {
                        tag: 'select',
                        options: options
                    }
                }).addCell({
                    type: 'left',
                    edit: true,
                    text: 'Л',
                    input: {
                        tag: 'select',
                        options: options
                    }
                }).addCell({
                    type: 'right',
                    edit: true,
                    text: 'П',
                    input: {
                        tag: 'select',
                        options: options
                    }
                }).addCell({
                    type: 'multiplicity',
                    edit: thickness >= minThicknessForMultiplicity,
                    //edit: true,
                    text: '<a data-action="help" data-section="detail-multiplicity" class="help">Кратность</a>',
                    input: {
                        tag: 'select',
                        start: 1,
                        count: parseInt(maxThickness / thickness) > 3 ? 3 : parseInt(maxThickness / thickness)
                    },
                    default : 1,
                    validate: function (data) {
                        var wRes = true;
                        var hRes = true;

                        if (data['height'] != null) {
                            hRes = checks['height'](data);
                        }
                        if (data['width'] != null) {
                            wRes = checks['width'](data);
                        }

                        if (wRes && hRes) {
                            var st = data['multiplicity'];
                            data['thickness'] = (st * thickness);
                        } else {
                            return false;
                        }
                        //inputTable.showMsg('multiplicity msg', inputTable.INFO_MSG);


                    },
                    errorMsg: 'Габариты детали не позволяют произвести склеивание нескольких слоев!<span><a data-action="help" data-section="detail-warning" class="go-to-help">Справка</a></span>'
                }).addCell({
                    type: 'texture',
                    edit: true,
                    text: '<a data-action="help" data-section="detail-texture" class="help">Текстура</a>',
                    input: {
                        tag: 'input',
                        type: 'checkbox',

                        attrs: {
                            checked: 'checked'
                        }
                    },
                    validate: checks['texture'],
                    errorMsg: 'Невозможно учесть текстуру для указанных габаритов детали!<span><a data-action="help" data-section="detail-warning" class="go-to-help">Справка</a></span>'
                }).addCell({
                    type: 'caption',      //обязательно
                    edit: true,        //обязательно
                    text: '<a data-action="help" data-section="detail-caption" class="help">Название</a>',  //обязательно
                    input: {           //не обязательно
                        tag: 'input',
                        type: 'text'
                    },
                    default: '',
                    validate: function (data) {
                        return data['caption'].length <= 80;
                    },
                    errorMsg: 'Название не может быть длиннее 80-ти символов'

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
                    console.log(lastRow);
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
                            } else {
                                result += p + '=' + data[p] + '&';
                            }

                        }
                    }


                    sendDetail(result, function () {
                        //console.log(getGuidByIdx(data['top']));
                        setEdgeOperations(data['key'],
                            getGuidByIdx(data['top']),
                            getGuidByIdx(data['bottom']),
                            getGuidByIdx(data['left']),
                            getGuidByIdx(data['right']), function (result) {
                                //data['top'] = result.top.param;

                                var hasChange = false;
                                for (var k in result) {

                                    if (getGuidByIdx(data[k]) != result[k].param) {
                                        data[k] = result[k].param;
                                        hasChange = true;
                                    }
                                }
                                if (hasChange) {
                                    inputTable.update(data['key'], data);
                                    inputTable.showMsg('Установленные обработки торцов детали были изменены', inputTable.ERROR_MSG, 3000);
                                }
                            });
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
                    visible: data[key]['thickness'],
                    idx: num
                });
                num++;
            }
            return options;
        });
    }
);


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
    for(var i = 0; i < data.length; i++){
        data[i]['top'] = getIdxByGuid(data[i]['top']);
        data[i]['bottom'] = getIdxByGuid(data[i]['bottom']);
        data[i]['right'] = getIdxByGuid(data[i]['right']);
        data[i]['left'] = getIdxByGuid(data[i]['left']);
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