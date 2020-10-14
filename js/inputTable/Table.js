//Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ

var useDiv = false;

var userAgent = navigator.userAgent.toLowerCase();
var isMozilla = /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent);

function createTable(selector, params) {


    var table;

    var addText;
    var addTitle;

    var idxCaption;
    var noRowMsg;
    var actions = {};
    var edit;
    switch (constructorId) {
        case 'steklo':
            var not_focus_len = 2;
            break;
        case 'stol':
            var not_focus_len = 1;
            break;
        default:
            var not_focus_len = 2;
            break;
    }

    var len = $(selector).length;

    if (len == 0) {
        throw new Error("Element " + selector + " not found");
    }
    if (len > 1) {
        throw new Error(selector + " length > 1");
    }

    var useDivElem = document.getElementById('useDiv');
    if(useDivElem) useDivElem.onchange = function () { useDiv = sessionStorage.getItem('vvod') || this.checked; };
    var vvod;
    if(sessionStorage.getItem('vvod')!= null){
        vvod = sessionStorage.getItem('vvod');
    }
    if (vvod == 1){
    $("#useDiv").prop('checked', true);
        useDiv = true;
    }else{
    $("#useDiv").prop('checked', false);
        useDiv = false;
    }
    $("#useDiv").on('change',function() {
        if(vvod == 1){
            vvod = 0;
        }else {
            vvod = 1;
        }
        sessionStorage.setItem('vvod',vvod);
    });


    var modal = '<div class="table-remove-modal"><p>'+LANG['ARE-U-SURE-DELETE-CHOOSED-NOTE']+'</p><div class="confirm">Да</div><div class="deny">Нет</div></div>';

    var tbbg = '<div class="tbbg"></div>';

    // параметры фильтра
    var filter_val = {};
    var filter_template = '<img src="/service/img/filter.png" class="filter" data-action="showFilter" title="Фильтрация">';
    var filter_input_template = '<div id="filter-input" class="hidden">Введите значение: <input class="input-sm" type="text"><input type="button" class="btn btn-primary ok" value="OK"><input type="button" class="btn cl" value="Отменить"></div>';
    if($('#filter-input')[0] == undefined) {
        $('body').prepend(filter_input_template);
    }

    actions.showFilter = function (event) {
        var head = $('table.mi-mi-table th');
        var father_th = $(event.target).parent();
        var filter_index = head.index(father_th);

        $('#filter-input').removeClass('hidden');
        $(head[filter_index]).append($('#filter-input'));
        $('#filter-input input[type="text"]').val(filter_val[filter_index]);

        $('#filter-input input[type="button"].ok')[0].onclick = function () {
            var val = $('#filter-input input[type="text"]').val();
            filter_val[filter_index] = val;
            useFilter();
            $('#filter-input').addClass('hidden');
        };
        $('#filter-input input[type="button"].cl')[0].onclick = function () {
            // $('#filter-input input[type="text"]').val('');
            filter_val[filter_index] = false;
            useFilter();
            $('#filter-input').addClass('hidden');
        };

        $('#filter-input input[type="text"]').focus();
        $('#filter-input input[type="text"]').select();
    };

    function useFilter() {
        var trs = $('.mi-mi-table tr');
        trs.splice(0,1);

        $(trs).each(function (index, val) {
            $(val).show();
        });
        for(var filter_index in filter_val){
            if(filter_val[filter_index]){
                $(trs).each(function (index, val) {
                    var tds = $(val).find('td');
                    var td_text = $(tds[filter_index]).text();
                    if(td_text && td_text != filter_val[filter_index]){
                        $(val).hide();
                    }
                });
                $($('.mi-mi-table th')[filter_index]).find('img').addClass('active');
            }else{
                delete filter_val[filter_index];
                $($('.mi-mi-table th')[filter_index]).find('img').removeClass('active');
                useFilter();
            }
        }
    }

    $('*').on('click', function (event) {
        // // исчезновение поля ввода
        if($(event.target).parent().attr('id') != 'filter-input' && $(event.target).attr('id') != 'filter-input')
            $('#filter-input').addClass('hidden');
        // // исчезновение селекта перемещения и копирования
        removeChangers();
    });

    // // ок по ентеру
    $('*').on('keydown', function (event) {
        if(!$('#filter-input').hasClass('hidden') && event.keyCode == 13){
            $('#filter-input input.ok').click();
        }
    });
    // -------- конец фильтра

    function showModal(confirm, deny, complete) {
        var cont = (selector == '.fast_input2') ? $(selector).parent() : $(selector).parent().parent();
        var bg = $(tbbg);
        var mod = $(modal);
        //cont.css({'overflow-y' : 'hidden'});

        $(mod).css('top', window.pageYOffset + 200);

        mod.find('.confirm').click(function () {
            $(this).hover();
            if (typeof confirm == 'function') confirm();
            if (typeof complete == 'function') complete();
            hide();
        });
        mod.find('.deny').click(function () {
            $(this).hover();
            denyFunc();
        });

        bg.click(function () {
            denyFunc();
        });

        cont.append(mod);
        cont.append(bg);

        mod.fadeIn(100);
        bg.fadeIn(100);

        var denyFunc = function () {
            if (typeof deny == 'function') deny();
            if (typeof complete == 'function') complete();
            hide();
        };

        var hide = function () {
            //cont.css({'overflow-y' : 'auto'});
            mod.fadeOut(100, function () {
                mod.remove();

            });
            bg.fadeOut(100, function () {
                bg.remove();
            })
        };

        return denyFunc;

    }

    function setEvents() {
        setListeners();

    }

    function setListeners() {
        table.addMouseListener(function (event, elem) {

            var action = $(event.target).data('action');
            if (action != undefined) {
                actions[action](event);
                return;
            } else {
                if ($(event.target).parent().is('th')) {
                    return;
                }
                event.preventDefault();
            }

            var old = table.selected;

            var success = table.setSelection(elem);

            if (success || success == undefined || old == elem) {
                table.action(event, elem);
            }
        });


        table.addKeyListener(function (event, elem) {
            if (!elem) return;
            if (elem.isEdit) return;

            if (event.keyCode >= 37 && event.keyCode <= 40) {
                event.preventDefault();

                switch (event.keyCode) {
                    case 37:
                        table.moveTo('left');
                        break;
                    case 38:
                        table.moveTo('up');
                        break;
                    case 39:
                        table.moveTo('right');
                        break;
                    case 40:
                        if (elem.row.idx + 1 == table.rows.length) {
                            table.addRow();
                            table.moveTo('down');
                        } else {
                            table.moveTo('down');
                        }
                        break;
                }
            }

        });

        // table.addKeyListener(function (event, elem) {
        //     if (event.ctrlKey && event.keyCode === 13 || event.keyCode == 107) {
        //         //console.log('change here0');
        //         var self = $("table .mi-mi-table .focus");
        //         var valid = validateRows(self);
        //         if (valid) {
        //             //console.log('change here1');
        //             table.addRow();
        //             table.setSelection(table.rows[table.rows.length - 1].getElem(0));
        //             //table.setSelection(row.getElem(0));
        //             return;
        //         } else if (elem == undefined) {
        //             //console.log('change here2');
        //             table.setSelection(table.rows[table.rows.length - 1].getElem(0));
        //             return;
        //         }
        //         //console.log('change here3');

        //         if (!validateRows(self)) {
        //             return;
        //         }

        //         var success = table.setSelection(elem);
        //         if (success || success == undefined) {
        //             //console.log('change here4');
        //             table.addRow();
        //             table.setSelection(table.rows[table.rows.length - 1].getElem(0));
        //             table.action();
        //             event.preventDefault();
        //         }
        //     }
        // });

        //enter
        table.addKeyListener(function (event, elem) {
            if (event.keyCode == 13 && !event.ctrlKey) {
                table.action(event, elem);
            }
        });
        //del key
        //table.addKeyListener(function (event, elem) {
        //    if (event.keyCode == 46) {
        //        elem.row.delete();
        //    }
        //
        //});

        table.addKeyListener(function (event, elem) {
            if (event.keyCode == 27) {
                table.setSelection(elem);
                //table.clearSelection();
            }
        })
    }

    function Table(selector, cells) {
        this.keyControllers = [];
        this.mouseControllers = [];
        this.inputActions = [];
        var self = this;

        self.addKeyListener(function (event, elem) {
            if (event.ctrlKey && event.keyCode === 13) {
                //console.log('change here0');
                var valid = validateRows(self);
                if (valid) {
                    table.addRow();
                    table.setSelection(table.rows[table.rows.length - 1].getElem(0));
                    table.setFocus(table.rows[table.rows.length - 1].getElem(0));
                    return;
                } else if (elem == undefined) {
                    table.setSelection(table.rows[table.rows.length - 1].getElem(0));
                    return;
                }
            }
        });


        this.html = $('<table border="1" class="mi-mi-table" id="visionchange"></table>');
        this.rows = [];
        this.selected = null;
        this.cells = cells;

        this.hideModal = function () {
            //stub
        };

        //this.html.click(function(event){
        //    event.stopPropagation();
        //    self.html.addClass('focus');
        //});

        $(selector).parent().click(function (event) {
            event.stopPropagation();
            self.html.addClass('focus');
        });

        $(selector).parent().click(function () {
            table.clearSelection();
        });


        this.html.on('click', 'td, th', function (event) {

            event.stopPropagation();
            var td = $(this);
            if (td.is('td')) {
                var left = td.index();
                var top = td.parent().index();
                var elem = self.get(top - 1, left - 1);
            }
            self.notifyAll(event, elem);
        });

        var parent = $(selector).parent().parent();

        $('body').click(function (event) {
            if (!$(event.target).is(parent.find('*'))) {
                // self.html.removeClass('focus');
            }
        }).keydown(function (event) {

            if (self.html.hasClass('focus')) {
                self.notifyAll(event, self.selected);
            }
        });
    }

    Table.prototype.init = function (data) {
        var self = this;

        this.cells.push({
            type: 'edit',
            edit: true,
            text: LANG['DOP-DEI'],
            input: {
                tag: 'dop',
                color: 'white',
                move: true, //переключатель перемещения детали (доработать нюансы связаные с ключами и отрисовку по елементам)
                copy: true,
                edit:true,
            },
            not_focus: true,
            validate: function (data) {
                return data[idxCaption];
            },
        });
        this.cells.push({
            type: 'edit',
            edit: true,
            text: "1",
            input: {
                tag: 'input',
                type: 'editButton',
                color: 'blue'
            },
            not_focus: true,
            validate: function (data) {

                self.editDetail(data[idxCaption]);

            },

        });
        this.cells.push({
            type: 'delete',
            edit: true,
            text: LANG['DELETE'],
            input: {
                tag: 'input',
                type: 'button'
            },
            not_focus: true,
            validate: function (data) {
                //if (self.rows.length > 1) {
                self.html.removeClass('focus');
                self.hideModal = showModal(function () {
                    var idx = getKeyOnServer(data[idxCaption]);
                    self.deleteRow(data[idxCaption]);
                    //self.rows[data[idxCaption]].delete();
                    self.html.addClass('focus');
                    self.onDelete(idx);
                }, null, function () {
                    self.html.addClass('focus');
                });
                //}

                // self.rows[data['index']].delete();

            }
        });



        var row = $('<tr></tr>');
        row.append('<th>№</th>');
        this.html.append(row);

        for (var i = 0; i < this.cells.length; i++) {
            row.append(createTh(this.cells[i]));
        }


        $(selector).append(this.html);

        $(selector).append($('<div class="table-add-but addrow"><!--div>' + addTitle + '</div--><img src="/service/templates/img/inputDetails.svg" class="mg10r">'+ LANG['ADD-DETAIL'] +'</div>').click(function () {
            if (!validateRows(self)) {
                return;
            }

            var result = self.clearSelection();
            if (result || result == undefined) {
                var row = self.addRow();
                if (row) {
                    self.setSelection(row.getElem(0));
                    $(selector).parent().scrollTop(9999999);
                }
                $(this).removeClass('press');
                var refreshIntervalId = setInterval(function(){
                    table.setSelection(table.rows[table.rows.length - 1].getElem(0));
                    table.setFocus(table.rows[table.rows.length - 1].getElem(0));
                    clearInterval(refreshIntervalId);
                }, 40);
            }
        }).mousedown(function () {
            $(this).addClass('press');
        }));
        $(selector).append($('.fast_input2').append('<div type="button" class="table-add-but addrow" id="use-save" value="Сохранить" onclick="sendArray()" style="display: none;"><svg class="mg10r" style="margin-bottom:-5px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M19 0H4L0 4V19C0 19.6 0.4 20 1 20H19C19.6 20 20 19.6 20 19V1C20 0.4 19.6 0 19 0ZM10 15C8.3 15 7 13.7 7 12C7 10.3 8.3 9 10 9C11.7 9 13 10.3 13 12C13 13.7 11.7 15 10 15ZM15 7H5V2H8V6H10V2H15V7Z" fill="#3090D0"/>' +
            '</svg>'+ LANG['SAVE'] +'</div>'));
        $('body').append('<div class="table-no-row-error">' + noRowMsg + '</div>');
        if (data) {
            this.addRows(data);
        } else {
            //this.addRow();
        }
        //selected = rows[0].getElem(0);
        if (self.rows.length > 0) {
            this.setSelection(this.rows[0].getElem(0));
        } else {
            //this.setSelection();
        }

        //подсчитываем нефокусируемые ячейки
        for(var i in table.cells){
            if(table.cells[i].not_focus) not_focus_len++;
        }

        Table.prototype.init = function () {
            throw new Error('table is already init');
        }
    };

    Table.prototype.addRows = function (data) {
        for (var i = 0; i < data.length; i++) {

            var row = new Row(this.rows.length, this, data[i]);
            this.rows.push(row);
        }
        if (this.rows.length > 0) {
            this.setSelection(this.rows[0].getElem(0));
        } else {
            this.setSelection();
        }

    };


    Table.prototype.addRow = function () {
        //if (this.selected) {
        //
        //}

        //if (!this.selected || this.onNewRow(this.selected.row.getAllData())) {

        if (this.rows.length == 0 || this.onNewRow(this.rows[this.rows.length - 1].getAllData())) {
            var row = new Row(this.rows.length, this);
            this.rows.push(row);
            //console.log(row.getElem(0));
            //var res = table.setSelection(row.getElem(0));
            table.action();
            //console.log(res);
            //table.action(null, row.getElem(0));
            return row;
        } else {
            var err = $('div.table-no-row-error');
            var width = parseInt(err.css('width'));
            var height = parseInt(err.css('height'));

            err.css({
                'left': $(window).width() / 2 - width / 2 + 'px',
                'top': $(window).height() / 2 - height / 2 + 'px',
                'display': 'block'
            });

            setTimeout(function () {
                err.fadeOut();
            }, 1500);
        }
    };

    Table.prototype.moveTo = function (direction) {
        switch (direction) {
            case 'right' :
                this.setSelection(this.selected.next());
                break;
            case 'left' :
                this.setSelection(this.selected.prev());
                break;
            case 'up' :
                this.setSelection(this.selected.up());
                break;
            case 'down' :
                this.setSelection(this.selected.down());
                break;
        }
    };

    Table.prototype.setSelection = function (elem) {

        try {

            if (this.selected) {
                var result = this.selected.onLeave();
                if (result === false) return;
                this.html.find('th, td').removeClass('select');

            }
            if (elem) {
                elem.onSelect();
                var coords = elem.coords();

                this.html.find('th:nth-child(' + (coords.left() + 2) + '), tr:nth-child(' + (coords.top() + 2) + ') td:first-child').addClass('select');
                elem.focus();

                var conTop = $(selector).parent().offset().top;
                var elTop = elem.html.offset().top;
                //var sc = elem.html.offset().top;


                var height = $(selector).parent().height();
                var scroll = $(selector).parent().scrollTop();
                var elH = elem.html.height();
                if (scroll > scroll + elTop - conTop) {
                    $(selector).parent().scrollTop(scroll + elTop - conTop);
                } else if (scroll + height < scroll + elTop + elH + 20) {
                    $(selector).parent().scrollTop(scroll + elTop + elH + 20 - height);
                }

                //if(elTop < conTop){
                //    $(selector).parent().scrollTop($(selector).parent().scrollTop() - elem.html.height() * 2);
                //} else if(elTop + elem.html.height() > $(selector).parent().height()){
                //    $(selector).parent().scrollTop($(selector).parent().scrollTop() + elem.html.height() * 2);
                //}
                //if(elTop - conTop + elem.html.height() >= $(selector).parent().height()){
                //    //$(selector).parent().scrollTop()
                //} else if(elTop - conTop < 0){
                //    $(selector).parent().scrollTop()
                //}
            }

            this.selected = elem;

        } catch (e) {
            if (e == 'invalid') {
                this.selected.focus();

                return false;
            } else {
                throw e;
            }
        }
    };

    Table.prototype.setFocus = function (elem){
        elem.action("click", elem);
    };

    Table.prototype.addAction = function (listener) {
        if (typeof listener == 'function') {
            this.inputActions.push(listener);
        }
    };

    Table.prototype.addKeyListener = function (listener) {
        if (typeof listener == 'function') {
            this.keyControllers.push(listener);
        }
    };

    Table.prototype.addMouseListener = function (listener) {
        if (typeof listener == 'function') {
            this.mouseControllers.push(listener);
        }
    };

    Table.prototype.notifyAll = function (event, elem) {
        var controllers;
        switch (event.type) {
            case 'click':
                controllers = this.mouseControllers;
                break;
            case 'keydown':
                controllers = this.keyControllers;
                break;
        }

        for (var i = 0; i < controllers.length; i++) {
            controllers[i](event, elem);
        }
    };

    Table.prototype.get = function (row, col) {
        return this.rows[row].getElem(col);
    };

    Table.prototype.action = function (event, elem) {
        //for (var i = 0; i < this.inputActions.length && !this.inputActions[i](elem); i++);
        try {
            elem = elem || this.selected;
            if (elem) {
                elem.focus();
                elem.action(event);
            }
        } catch (e) {
            if (e == 'invalid') {
                return false;
            } else {
                throw e;
            }

        }

    };

    Table.prototype.moveToStart = function () {
        this.setSelection(this.selected.row.getElem(0));
    };

    Table.prototype.clearSelection = function () {
        return this.setSelection();
        //return this.setSelection(this.selected);
    };

    Table.prototype.deleteRow = function (idx) {
        this.rows[idx].delete();
        if (this.rows.length == 0) {
            this.selected = undefined;
        } 
        if (allcuts.length <= idx + 1){
            allcuts.splice(idx, 1);
        }
        
    };

    Table.prototype.editDetail = function (idx) {
        var self = this;
        if (Object.keys(details).length == 0)
            goToAdditives(idx);
        else
            showConfirmMessage('Есть не сохраненные данные. Сохранить?', self.saveAndGo, [idx]);
    };

    Table.prototype.saveAndGo = function (idx) {
        $('#autosave').click();
        setTimeout(function() {
            goToAdditives(idx);
        }, 700);
    };

    function Row(idx, table, initialData) {
        this.elements = [];
        this.html = $('<tr><td>' + (idx + 1) + '</td></tr>');
        this.idx = idx;
        //this.cells = cells;
        //this.rows = rows;
        this.table = table;


        for (var i = 0; i < table.cells.length; i++) {
            var elem = new Elem(table.cells[i], i, this, (initialData ? initialData[table.cells[i].type] : undefined));

            this.elements.push(elem);
        }

        table.html.append(this.html);
        document.getElementById('detailsAmount').innerHTML = (idx + 1);
    }

    Row.prototype.next = function () {
        // if(autosave) {
        //     saveArrayDetails(table);
        // }
        if (validateRow(this) != true) {
            return this;
        }

        if (this.idx == table.rows.length - 1) {
            return table.addRow();
        } else {
            return table.rows[this.idx + 1];
        }
    };

    Row.prototype.prev = function () {
        return this.idx == 0 ? this : table.rows[this.idx - 1];
    };

    Row.prototype.index = function () {
        return this.idx;
    };

    Row.prototype.getElem = function (index) {

        return this.elements[index];
    };

    Row.prototype.size = function () {
        return this.elements.length;
    };

    Row.prototype.foreach = function (func) {
        if (typeof func == 'function') {
            for (var i = 0; i < this.elements.length - 1; i++) {
                func(this.elements[i]);
            }
        }
    };

    Row.prototype.getAllData = function () {
        var result = {};
        result[idxCaption] = this.idx;
        this.foreach(function (e) {
            result[e.cell.type] = e.getValue();
        });
        return result;
    };

    Row.prototype.remove = function () {

    };

    Row.prototype.toString = function () {
        var res = "";
        for (var i = 0; i < this.elements.length; i++) {
            res += this.elements[i] + " ";
        }
        return res;
    };

    Row.prototype.delete = function () {
        //if()
        //this.table.moveTo('down');
        // console.log(this.idx);
        // if(this.table.rows.length > 0){
        // if (this.idx < this.table.rows.length - 1) {
        // this.table.moveTo('down');
        // } else if(this.table.rows.length != 1) {
        // this.table.moveTo('up');
        // }
        // }

        this.table.rows.splice(this.idx, 1);

        this.html.remove();
        for (var i = 0; i < this.table.rows.length; i++) {
            this.table.rows[i].setIdx(i);
        }


    };

    // Row.prototype.copy = function (flip) {
    //     // console.log('copy:',this,flip);
    //     // var new_row = this;
    //     // console.log(new_row.getAllData());
    //     // table.addRow(this.getAllData());
    //     var data = this.getAllData();
    //     data.key += 1;
    //
    //     if(flip == 'h'){
    //         data.left += data.right;
    //         data.right = data.left - data.right;
    //         data.left -= data.right;
    //     }
    //     if(flip == 'v'){
    //         data.top += data.bottom;
    //         data.bottom = data.top - data.bottom;
    //         data.top -= data.bottom;
    //     }
    //     var row = new Row(data.key, table, data);
    //
    //     table.rows.splice(data.key, 0, row);
    // };
    //
    Row.prototype.setIdx = function (idx) {
        this.idx = idx;
        this.html.find('td:first-child').html(idx + 1);
    };

    Row.prototype.update = function (data) {
        for (var i = 0; i < this.elements.length; i++) {
            var e = this.elements[i];
            e.setValue(data[e.cell.type]);
        }
    };

    function Elem(cell, idx, row, initialData) {

        this.html = $("<td></td>");
        this.data = null;
        this.inp = null;
        this.isEdit = false;
        this.elements = row.elements;
        this.cell = cell;
        this.idx = idx;
        this.row = row;
        var self = this;


        this.row.html.append(this.html);


        if (this.cell.input) {
            $(this.html).addClass("back_color_"+this.cell.input.color);
            switch (this.cell.input.tag) {
                case 'input':
                    var type = this.cell.input.type;
                    var isDisable = this.cell.disable;
                    if (type == 'text' || type == 'number') {
                        if (isMozilla) {
                            var tmpInp = '<input type=\"' + type;
                            var pattern = this.cell.input.pattern;
                            if (pattern != undefined) {
                                tmpInp = tmpInp + '\" pattern=\"' + pattern;
                            }
                            tmpInp = tmpInp + '\">';
                            this.inp = $(tmpInp);
                        }
                        else {
                            this.inp = $('<input type="' + type + '">');
                        }

                        this.getValue0 = function () {
                            if (this.isEdit) {
                                var tmpVal = this.cell.textWithValidate
                                    ? evalField(this.inp.val(), this.cell.mustBeInteger)
                                    : this.inp.val();
                            } else {
                                var tmpVal = this.data;
                            }
                            if (isMozilla && (typeof(tmpVal) == 'string')) {
                                return tmpVal.replace(/,/g, '.');
                            }
                            return tmpVal;
                        };

                        if(!isDisable)
                            this.edit0 = function () {
                                this.isEdit = true;
                                this.old = this.html.html();
                                this.inp.val(
                                    this.cell.textWithValidate ? evalField(this.old, this.cell.mustBeInteger) : this.old
                                );
                                this.html.html('');
                                this.html.append(this.inp);
                                this.focus();
                            };

                        this.focus0 = function () {
                            this.inp.focus().select();
                        };

                        this.save0 = function () {

                            this.html.removeClass('error');
                            this.isEdit = false;
                            this.data = this.cell.textWithValidate
                                ? evalField(this.inp.val(), this.cell.mustBeInteger)
                                : escapeHtml(this.inp.val());
                            this.inp.detach();
                            this.html.html(this.data);
                        };

                        this.setValue0 = function (value) {
                            this.data = this.cell.textWithValidate ? evalField(value, this.cell.mustBeInteger) : value;
                            this.html.html(this.data);
                        };

                        if (initialData != undefined) {
                            this.data = initialData;
                            this.html.html(initialData);
                        } else {
                            this.data = '';
                        }

                        //checkbox
                    } else if (type == 'checkbox') {

                        //var sel = false;

                        this.checkbox = new Checkbox(this.cell.input.attrs.checked);
                        this.inp = this.checkbox.html();
                        this.html.append(this.inp);

                        this.getValue0 = function () {
                            return this.checkbox.status;
                        };

                        //this.focus0 = function (){
                        //    if(!sel){
                        //        sel = true;
                        //    } else {
                        //        //this.isEdit = true;
                        //        //this.edit();
                        //        //this.save();
                        //        //this.isEdit = false;
                        //    }
                        //};

                        this.action0 = function () {
                            //this.edit();
                            //if(!sel){
                            //    sel = true;
                            //} else {
                            //    this.isEdit = true;
                            //    this.edit();
                            //    this.save();
                            //    this.isEdit = false;
                            //}
                            this.isEdit = true;
                            this.edit();
                            this.save();
                            this.isEdit = false;

                        };

                        //this.onLeave0 = function(){
                        //    sel = false;
                        //};

                        this.edit0 = function () {
                            this.checkbox.action();

                        };

                        this.save0 = function () {

                        };

                        this.setValue0 = function (value) {
                            this.data = value;
                            //this.html.html(value);
                            if (value === true) {
                                this.checkbox.switch('right');
                            } else if (value === false) {
                                this.checkbox.switch('left');
                            }
                        };

                        if (initialData != undefined) {
                            this.data = initialData;
                            if (initialData == true) {
                                this.checkbox.switch('right');
                            } else if (initialData == false) {
                                this.checkbox.switch('left');
                            }
                        }


                        //only remove
                    } else if (type == 'button') {

                        this.inp = $('<button type="button" title="'+LANG['DELETE']+'" class="tables_buttons"><img src="/service/templates/img/NewDelete.svg"></button>');

                        //this.inp.click(function (event) {
                        //
                        //
                        //    //event.preventDefault();
                        //    //return false;
                        //});

                        this.getValue0 = function () {

                        };

                        this.action0 = function () {

                            this.validate();

                        };

                        this.edit0 = function () {

                        };

                        //this.validate0 = function () {
                        //    return true;
                        //};
                        this.html.append(this.inp);
                    } else if (type == 'editButton') {
                        this.inp = $('<div class="editButton"><p>Доп. обработка</p></div>');
                        this.getValue0 = function () {
                        };
                        this.action0 = function () {
                            this.validate();
                        };
                        this.edit0 = function () {
                        };
                        this.html.append(this.inp);
                    } else {
                        throw new Error('unknown type ' + type + ' for input');
                    }
                    break;

                case 'select':
                    if (!this.cell.edit) {
                        if (initialData != undefined) {
                            this.html.html(initialData);
                            this.data = initialData;
                        } else {
                            this.data = this.cell.default;
                        }
                        break;
                    }
                    //select


                    this.inp = $('<select></select>');
                    //this.data = 1;

                    this.inp.change(function () {
                        self.old = undefined;
                        self.isEdit = true;
                        self.save();
                        self.isEdit = false;
                    });

                    if (this.cell.input.count != undefined) {
                        for (var i = 0; i < this.cell.input.count; i++) {
                            this.inp.append('<option value="' + (this.cell.input.start + i) + '">' + (this.cell.input.start + i) + '</option>');
                        }

                        this.html.append('<p>' + (initialData == undefined ? this.cell.input.start : initialData) + '</p>');
                    } else {

                        var opt = this.cell.input.options;

                        for (var j = 0; j < opt.length; j++) {
                            var op = opt[j];
                            this.inp.append('<option value="' + op.value + '">' + op.text + '</option>');
                        }
                        this.html.append('<p>' + (initialData == undefined ? opt[0].value : initialData) + '</p>');
                    }

                    this.inp.find('option[value="' + this.html.find('p').html() + '"]').attr('selected', 'selected');

                    this.inp.hide();


                    this.html.append(this.inp);


                    this.focus0 = function () {
                        var val = this.html.find('p').html();
                        this.html.find('p').html('');
                        this.html.find('p').css({'height': 0});

                        var option = this.inp.find('option[value="' + val + '"]');
                        if (option.length == 0 && val != '') {
                            this.old = val;
                        } else {
                            option.attr('selected', 'selected');
                        }
                        this.inp.show();
                        this.inp.focus();
                    };

                    this.onLeave0 = function () {
                        //if(this.inp.is(':focus')) return false;

                        if (this.old != undefined) {
                            var val = this.old;
                        } else {
                            var selected = this.inp.find('option:selected');

                            val = selected.val();
                        }

                        this.html.find('p').html(val);
                        this.html.find('p').css({'height': 25 + 'px'});

                        this.inp.hide();
                        //this.inp.blur();
                        //this.inp.attr('disabled', 'disabled');
                    };

                    this.getValue0 = function () {
                        return this.inp.find('option:selected').val();
                    };

                    this.action0 = function () {
                        this.inp.focus();
                        //if(this.inp.is(':focus')){
                        //    this.inp.blur();
                        //} else {
                        //    this.inp.focus();
                        //}
                    };

                    this.setValue0 = function (value) {

                        if (this.inp.is(':visible')) {
                            var option = this.inp.find('option[value="' + value + '"]');
                            option.attr('selected', 'selected');
                        } else if (this.cell.edit) {
                            this.html.find('p').html(value);
                        } else {
                            this.html.html(value);
                        }

                    };


                    break;

                case 'dop':
                    this.inp = $('<div class="dop"></div>');
                    if(this.cell.input.move){
                        var mover = document.createElement('button');
                        //$("<button class='glyphicon glyphicon-sort' type='button' title='Переместить'></button>");
                        mover.className = '';
                        mover.title = LANG['CHANGE-POS'];
                        // mover.getValue0 = function () {
                        // };
                        mover.innerHTML='<img src="/service/templates/img/perenos.svg">';
                        // mover.getValue0 = function () {
                        // };
                        $(mover)[0].onclick = function () {
                            // на всякий пожарный удаляем старые селекты
                            $('#move-changer').remove();
                            showMoveChanger(mover, row.idx);
                        };
                        // mover.edit0 = function () {
                        // };
                        this.inp.append(mover);
                    }

                    if(this.cell.input.copy){
                        var copyer = document.createElement('button');
                        copyer.className = '';
                        copyer.title = LANG['COPY'];
                        copyer.innerHTML='<img src="/service/templates/img/copy.svg">';
                        copyer.onclick = function () {
                            // showCopyChanger(copyer, self.validate());
                            showCopyChanger(copyer, getKeyOnServer(row.idx));
                        };
                        this.inp.append(copyer);
                    }
                    if(this.cell.input.edit){
                        var edit = document.createElement('button');
                        edit.className = '';
                        edit.innerHTML = '<img  src="/service/templates/img/working_min.svg">';
                        edit.getValue0 = function () {
                        };
                        edit.onclick  = function () {
                            var self = this;
                            if (Object.keys(details).length == 0){
                                sendDetailWithEdge(null, null, 0, function(){
                                    goToAdditives(row.idx);
                                });
                            }
                            else {
                                showConfirmMessage('Есть не сохраненные данные. Сохранить?', self.saveAndGo, [row.idx]);
                            }
                        };
                        edit.edit0 = function () {
                        };
                        this.inp.append(edit);
                    }

                    this.html.append(this.inp);
                    break;
            }

            for (var prop in this.cell.input.attrs) {
                this.inp.attr(prop, this.cell.input.attrs[prop]);
            }
        } else {
            if (this.cell.edit) {
                throw new Error('cell must be non-editable or contains property "input"');
            } else {
                this.data = initialData;
                this.html.html(initialData);
                this.action0 = function () {

                    this.row.table.moveTo('right');
                    //if(event.type == 'click'){
                    //    this.row.table.action(event);
                    //}
                };
            }

        }

        if (this.cell.default != undefined && initialData == undefined) {
            if (this.cell.input && this.cell.input.tag != 'select' || !this.cell.edit)
                this.html.append(this.data = this.cell.default);
        }


    }

    Elem.prototype.onLeave = function (event) {
        if (this.onLeave0 != undefined) {
            var leave = this.onLeave0(event);
        } else {
            leave = true;
        }
        if (leave || leave == undefined) {
            if (this.isEdit) {
                this.save();
            }
            this.html.removeClass('active').removeClass('disable');
        }
        return leave;

    };

    Elem.prototype.focus = function () {
        return this.focus0 == undefined ? undefined : this.focus0();
    };

    Elem.prototype.getValue = function () {
        return this.getValue0 == undefined ? this.data : this.getValue0();
    };

    Elem.prototype.edit = function () {
        return this.edit0 == undefined ? undefined : this.edit0();
    };
    //
    //Elem.prototype.save = function () {
    //
    //    if (this.save0 != undefined) {

    //        if (this.isEdit) {

    //            if (this.validate()) {
    //                return this.save0();
    //            } else {
    //                this.html.addClass('error');
    //                throw 'invalid';
    //            }
    //        }
    //    } else {
    //        return undefined;
    //    }
    //    //return this.save0 == undefined ? undefined : this.save0();
    //};


    Elem.prototype.save = function () {
        if (this.isEdit) {
            // if (this.old == this.getValue()) {
            //     return this.save0 == undefined ? true : this.save0();
            // }
            if (this.validate()) {
                this.html.removeClass('error');
                this.html.find('div.error-msg').remove();

                this.html.removeClass('back_color_red');

                return this.save0 == undefined ? true : this.save0();
            } else {
                // $(this.inp).change('');
                //show error
                // var err = this.html.find('div.error-msg');
                // if (err.length > 0) {
                //     err.addClass('beep');
                //     err.html(this.cell.errorMsg);
                // } else {
                //     this.html.append($('<div class="error-msg beep">' + this.cell.errorMsg + '</div>').fadeIn(200));
                // }
                // setTimeout(function () {
                //     $('div.error-msg').removeClass('beep');
                // }, 300);
                //
                //
                // this.html.addClass('error')
                var oldValue = +this.old;
                if ((typeof(oldValue) != "number") || (oldValue == 0) || isNaN(oldValue)) {
                    this.old = "0";
                    this.html.addClass('back_color_red');
                }
                if (this.cell.textWithValidate) {
                    this.old = "0";
                }

                this.setValue0(this.old);
                this.edit0();
                this.save0();
                throw 'invalid';
            }
        }

        //return this.save0 == undefined ? undefined : this.save0();
    };

    Elem.prototype.validate = function () {

        //if (this.validate0 != undefined) {
        //    return this.validate0();
        //} else {
        var data = this.row.getAllData();
        var valid;
        if (this.cell.validate) {
            valid = this.cell.validate(data);
        } else {
            valid = true;
        }

        valid = valid == undefined ? true : valid;

        if (valid && this.cell.type != 'delete' && this.cell.type != 'edit') {
            this.row.update(data);
            table.onChange(data, getKeyOnServer);
        }
        return valid;
        //}

    };

    Elem.prototype.onSelect = function () {

        this.html.addClass('active');
        if (!this.cell.edit) {
            this.html.addClass('disable');
        }
    };

    Elem.prototype.coords = function () {
        return new Coords(this.idx, this.row.idx);
    };

    Elem.prototype.action = function (event) {

        if (this.action0 == undefined) {
            if (!this.isEdit) {
                this.edit();
            } else {
                // this.save();
                this.row.table.moveTo('right');
                if (this.row.table.selected.cell.input) {
                    var type = this.row.table.selected.cell.input.type;
                }

                if (type != undefined && type != 'checkbox') {
                    this.row.table.action();
                }
            }
        } else {
            this.action0(event);
        }
    };

    Elem.prototype.getCell = function () {
        return this.cell;
    };

    Elem.prototype.required = function () {
        return this.cell.required != undefined ? this.cell.required : false;
    };

    Elem.prototype.getObject = function () {
        return this.html;
    };

    Elem.prototype.next = function () {
        var idx = this.idx;
        if(useDiv && arrayForNext){
            // console.log(this.elements.length);
            var currentRule = arrayForNext[this.elements.length];
            if(currentRule[idx]){
                if(currentRule[idx].nextRow){
                    return this.row.next().getElem(currentRule[idx].pos);
                }else{
                    return this.elements[currentRule[idx].pos];
                }
            }
        }
        // else{
        // return this.elements[idx + 1];
        // }

        if(this.elements[idx + 1].cell.disable) idx++;
        if (idx == this.elements.length - not_focus_len) {
            return this.row.next().getElem(0);
        } else {
            return this.elements[idx + 1];
        }
    };

    Elem.prototype.prev = function () {
        return this.idx == 0 ? this : this.elements[this.idx - 1];
    };

    Elem.prototype.up = function () {
        return this.row.prev().getElem(this.idx);
    };

    Elem.prototype.down = function () {
        return this.row.next().getElem(this.idx);
    };

    Elem.prototype.toString = function () {
        return this.cell.text + " " + this.data;
    };

    Elem.prototype.setValue = function (value) {

        if (this.setValue0) {
            this.setValue0(value);
        } else {
            this.data = value;
            this.html.html(value);
        }
    };

    function Coords(col, row) {

        this.left = function () {
            return col;
        };

        this.top = function () {
            return row;
        };

        Coords.prototype.toString = function () {
            return "col : " + col + ", row : " + row;
        }
    }

    function createTh(cell) {
        //var th =
        //th.attr('data-type', cell.type);
        var th = $('<th></th>').append(cell.text);
        if (cell.filter)
            th.append(filter_template);
        return th;
    }

    function Checkbox(status) {
        this.status = !!status;
        this.checkbox = get(status);


        this.action = function () {
            if (this.status) {
                this.switch('left');
            } else {
                this.switch('right');
            }
            //this.status = !this.status;
        };

        this.switch = function (side) {
            if (side == 'left') {
                this.status = false;
                this.checkbox.find('.chb-in div').html('<img src="/service/templates/img/uncheckedcircle.svg">');
            } else if (side == 'right') {
                this.status = true;
                this.checkbox.find('.chb-in div').html('<img src="/service/templates/img/checkedcircle.svg">');
            }
        };

        this.checked = function () {
            return this.status;
        };

        this.html = function () {
            return this.checkbox;
        };

        function get () {
            var checkbox = $('<div class="checkbox-custom"></div>');
            checkbox.css({
                'position': 'relative',
                'cursor': 'pointer'
            });

            var cont = $('<div class="chb-in"></div>').css({
                // 'position': 'absolute',
                // 'margin': 'auto',
                // 'top': 0,
                // 'bottom': 0,
                // 'left': 0,
                // 'right': 0,
                // 'border-radius': '10px',
                // 'min-height': '15px',
                // 'max-height': '21px'
            });


            //var left = status ? 18 : 0;

            var but = $('<div></div>').css({
                // 'position': 'absolute',
                // 'left': '0px',
                // 'height': '100%',
                // 'width': '22px',
                // 'border-radius': '10px',
                // 'border': '1px solid #B9B9B9',
                // 'font-size': '10px',
                // 'text-align': 'center'

            });

            checkbox.append(cont.append(but));
            return checkbox;
        }

        if (status) {
            this.switch('right');
        }

        //this.checkbox.click(function(){
        //    this.action();
        //});


    }

    return new function () {
        var cellsArray = [];

        var onDelete = function () {
            //stub
        };

        var onUpdate = function () {
            //stub
        };

        var onChange = function () {
            //stub
        };

        var onNewRow = function () {
            //stub
        };

        this.addCell = function (cell) {
            cellsArray.push(cell);
            return this;
        };

        this.delete = function (func) {
            if (typeof func == 'function') {
                onDelete = func;
            }
            return this;
        };

        this.change = function (func) {
            if (typeof func == 'function') {
                onChange = func;
            }
            return this;
        };

        this.setIdxCaption = function (caption) {
            idxCaption = caption;
            return this;
        };

        this.setAddButtonTextAndTitle = function (text, title) {
            addText = text;
            addTitle = title;
            return this;
        };

        this.onRowAdded = function (func, msg) {
            if (typeof func == 'function') {
                onNewRow = func;
                noRowMsg = msg;
            }
            return this;
        };

        this.addAction = function (name, data) {
            if (typeof data == 'function') {
                actions[name] = data;
            } else if (typeof data == "object") {
                for (var k in data) {
                    if (typeof data[k] == 'function') {
                        actions[k] = data[k];
                    }
                }
            }
            return this;
        };

        this.build = function (data) {
            table = new Table(selector, cellsArray);
            table.onDelete = onDelete;
            table.onUpdate = onUpdate;
            table.onChange = onChange;
            table.onNewRow = onNewRow;
            table.init(data);
            setEvents();


            this.addCell = stub;
            this.build = stub;
            return {
                deleteRow: function (idx) {
                    table.hideModal();
                    table.deleteRow(idx);
                },

                addRow: function (data) {
                    var row = new Row(table.rows.length, table, data);
                    table.rows.push(row);
                },

                rebuild: function (data) {
                    table.hideModal();
                    while (table.rows.length > 0) {
                        table.rows[0].delete();
                    }
                    table.selected = undefined;
                    if (data.length > 0) {
                        table.addRows(data);
                    } else {
                        table.addRow();
                    }
                    //console.log(data.length);

                },

                update: function (idx, data) {
                    table.rows[idx].update(data);
                },

                ERROR_MSG: 'ERROR',
                INFO_MSG: 'INFO',

                showMsg: function (text, type) {

                    var w = $('div.table-message-popup');
                    if (w.length > 0) {
                        hide();
                    }

                    var borderColor = 'black';
                    switch (type) {
                        case this.ERROR_MSG :
                            borderColor = 'red';
                            break;
                        case this.INFO_MSG :
                            borderColor = 'greenyellow';
                            break;
                    }

                    var popup = $('<div class="table-message-popup">' + text + '</div>').css({'border-color': borderColor});
                    $(selector).parent().append(popup);
                    $('div.table-message-popup').animate({'left': $(selector).parent().width() / 2 - $('div.table-message-popup').width() / 2});

                    //var id = setTimeout(hide, dur);

                    popup.click(hide);

                    popup.mouseover(hide);

                    function hide() {
                        clearTimeout(id);
                        $('div.table-message-popup').fadeOut(400, function () {
                            this.remove();
                        })
                    }


                }
            }
        };

        function stub() {
            throw new Error();
        }

    };

    /*
    * Метод расчитывает позицию в реальности на сервере (не учитывает пустые колонки)
    * */
    function getKeyOnServer(idx) {
        var key = idx;
        for(var i = 0; i < idx; i++){
            if(!(table.rows[i].elements[0].data || table.rows[i].elements[1].data)){
                key--;
            }
        }
        return key;
    }

    /*
    * Проверка на существование детали по ее параметрам
    * */
    function isExist(idx) {
        var this_elements = table.rows[idx].elements;
        var col_def = 0;
        // проходимся по всем елементам конкретной детали и определяем высоту и ширину
        for(var i in this_elements){
            if(col_def == 2) break;

            var type = this_elements[i].cell.type;
            if(type == 'width' || type == 'height') {
                if (this_elements[i].data) {
                    col_def++;
                } else {
                    break;
                }
            }
        }

        if(col_def == 2){
            return true;
        }else{
            return false;
        }
    }

    function removeChangers() {
        $('#copy-changer').remove();
        $('#move-changer').remove();
    }

    function showMoveChanger(element, idx) {
        if(isExist(idx)) {
            removeChangers();

            var elem = document.createElement('select');
            var count_elems = table.rows.length;
            for(var i = 0; i < count_elems; i++){
                var option = document.createElement('option');
                option.innerText = (i+1);
                option.value = i;
                if(i == idx) option.selected = true;
                elem.appendChild(option);
            }
            elem.id = 'move-changer';
            elem.style.position = 'absolute';
            elem.style.left = element.offsetLeft+element.clientWidth+'px';
            elem.style.top = '1px';
            elem.style.width = '30px';
            elem.style.height = '27px';

            elem.onchange = function (event) {
                var val = event.target.value;
                idx = getKeyOnServer(idx);
                useMove(table.rows, idx, val, autosave);
                $(this).remove();
            };

            element.parentElement.appendChild(elem);
        }else{
            showErrorMessage('Данная функция не доступна для несозданных деталей.');
        }
        // element.parent().append(elem);
    }

    function showCopyChanger(element, idx, key) {
        if(isExist(idx)) { // если поле заполнено (есть и ширина и высота)
            removeChangers();
            // создаем менюшку
            var elem = document.createElement('div');
            elem.id = 'copy-changer';
    //        console.log(element);
            elem.style.left = (element.clientWidth + element.offsetLeft /*паддинги и ширина*/) + "px";
            elem.style.top = "0px";
            // создаем пункты менюшки
            var copy_types = [];
            for (var i = 0; i < 3; i++) {
                var copy_type = document.createElement('li');
                copy_type.className = "btn-link btn-xs";
                copy_types.push(copy_type);
            }
            copy_types[0].onclick = function (event) {
                $.when(useCopy(event, autosave, idx)).then(afterCopy(idx));
            };
            copy_types[1].onclick = function (event) {
                $.when(useCopy(event, autosave, idx, 'h')).then(afterCopy(idx, 'h'));
            };
            copy_types[2].onclick = function (event) {
                $.when(useCopy(event, autosave, idx, 'v')).then(afterCopy(idx, 'v'));
            };
            copy_types[0].innerText = 'Копировать оригинал';
            copy_types[1].innerText = 'Отразить горизонтально [↔]';
            copy_types[2].innerText = 'Отразить вертикально [↕]';
            // помещаем пункты в менюшку
            for (var i in copy_types)
                elem.appendChild(copy_types[i]);
            // менюшка готова, пускаем ее в ход
            element.parentElement.appendChild(elem);
        }else{
            showErrorMessage('Данная функция не доступна для несозданных деталей.');
        }
    }

    function afterCopy(idx,type) {
    //     table.rows[idx].copy(type);
    //     // console.log('2->',table.rows[idx].elements);
    //     // var row = new Row(idx+1, table,table.rows[idx].elements);
    }
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[<>"']|& /g, function (m) {
        return map[m];
    });
}

/**
 * Приведение типа и обработка строки
 *
 * @param currentValue
 */
function evalField(currentValue, mustBeInteger) {
    if (currentValue === '') return '';
    currentValue = currentValue ? prepareValueForEval(currentValue) : '0';
    var evalCurrentValue = eval(currentValue),
        $result;
    var splitEval = (evalCurrentValue + "").split('.');
    if(splitEval[1] && parseInt(splitEval[1]) > 0){
        $result =  mustBeInteger ? parseInt(evalCurrentValue) : evalCurrentValue.toFixed(1);
    } else {
        $result = parseInt(evalCurrentValue);

    }
    return $result;
}

/**
 * Подготовка строки перед обработкой eval()
 *
 * @param currentValue
 * @returns {string}
 */
function prepareValueForEval(currentValue) {
    return (currentValue + '').replace(',', '.');
}