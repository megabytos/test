/**
 * Created by Хицков Стефан on 03.11.2015.
 */
var inputTable;

(function ($) {

    var minWidth = 230;

    var checks = {

        widthHeight: function (data, height) {

            var maxW;
            var maxH;
            var minW;
            var minH;


            maxW = parseFloat(maxWidth);
            maxH = parseFloat(maxHeight);
            minW = parseFloat(minWidth);
            minH = parseFloat(minHeight);


            var wid = data['width'] != undefined ? parseFloat(data['width'].toString().replace(',', '.')).toFixed(1) : 0;

            var hei = data['height'] != undefined ? parseFloat(data['height'].toString().replace(',', '.')).toFixed(1) : 0;

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

            if (wid > maxDetailSizeLimit && hei > maxDetailSizeLimit) {
                return false;
            }

            if (wid >= minW && wid <= maxW && (hei == 0 || hei <= maxH && hei >= minH)) {
                return true;
            } else if (wid <= maxH && wid >= Math.min(minH, minW)) {
                if (hei == 0 || hei <= maxW) {
                    if(wid >= Math.max(minH, minW)){
                        return hei >= Math.min(minH, minW)
                    } else if(wid >= Math.min(minH, minW)) {
                        return hei >= Math.max(minH, minW)
                    }
                } else {
                    return false;
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

        count: function (data) {
            if (data['count'] < 1 || parseInt(data['count']) != data['count']) {
                return false;
            }
        },
    };
    //maxDetailSizeLimit

    proccessEdgesList(function (options) {


        var table = createTable('.fast_input');
        inputTable = table.setIdxCaption('key')
            .setAddButtonText('+')
            .addCell({
                type: 'caption',
                edit: true,
                text: 'Название',
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
                type: 'width',
                edit: true,
                text: 'Длина',
                input: {
                    tag: 'input',
                    type: 'number'
                },
                validate: checks['width'],
                //errorMsg: 'Неверное значение длины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                errorMsg: 'Неверное значение длины!'

            }).addCell({
                type: 'height',
                edit: true,
                text: 'Ширина',
                input: {
                    tag: 'input',
                    type: 'number'
                },
                validate: checks['height'],
                //errorMsg: 'Неверное значение ширины! <p>maxW : ' + maxWidth + ',</p><p> maxH : ' + maxHeight + ',</p><p> minW : ' + minWidth + ',</p><p> minH : ' + minHeight + '</p>'
                errorMsg: 'Неверное значение ширины!'
            }).addCell({
                type: 'thickness',
                edit: false,
                text: 'Толщина',
                default: thickness

            }).addCell({
                type: 'count',
                edit: true,
                text: 'Кол-во',
                input: {
                    tag: 'input',
                    type: 'number'
                },
                default: 1,
                validate: checks['count'],
                errorMsg: 'Неверное значение количества деталей!'

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
            }).addAction('help', function (event) {
                //console.log($(event.target).data('section'));
                showHelp($(event.target).data('section'));

            }).delete(function (idx) {

                delDetail(idx);

            }).onRowAdded(function (lastRow) {
                if (lastRow == undefined) {
                    return true;
                }
                for (var p in lastRow) {
                    if (lastRow[p] == null) {
                        return false;
                    }
                }
                return true;

            }, 'Заполните все обязательные поля : Длина, Ширина')
            .change(function (data) {

                var result = 'multiplicity=1&';

                for (var p in data) {
                    if (data[p] == null) {
                        return;
                    } else {
                        result += p + '=' + data[p] + '&';
                    }
                }


                sendDetail(result, function () {
                    setEdgeOperations(data['key'], data['top'], data['bottom'], data['left'], data['right'], function (result) {

                        //var hasChange = false;
                        //for (var k in result) {
                        //
                        //    if (data[k] != result[k].param) {
                        //        data[k] = result[k].param;
                        //        hasChange = true;
                        //    }
                        //}
                        //if (hasChange) {
                        //    inputTable.update(data['key'], data);
                        //    inputTable.showMsg('Установленные обработки торцов детали были изменены', inputTable.ERROR_MSG, 3000);
                        //}
                    });
                });
            }).build();

    });

})(jQuery);