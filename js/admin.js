
function changeConfiguration(configuration){

    $('body').on('click', '.editCurrentItemInList', function(){
        editCurrentItemInList (this);
    }).on('click', '.deleteCurrentItem', function(){
        showConfirmMessage(LANG['CONFIRM-ISKLUCHIT-FROM-SPISOK'], deleteCurrentItem, this);
    }).on('click', '.editItemFromList', function(){
        var buttonEditCurrentItemInList = $(this).parent().find('button.editCurrentItemInList');
        HideIfBlur (buttonEditCurrentItemInList);
    }).on('click', '.addToListNew', function() {
        var addItemToListBlock = $(this).parent().find('span.addItemToListBlock');
        HideIfBlur (addItemToListBlock);
    }).on('click', '.changeParamInput', function() {
        var changeParam = $(this).parent().find('button.changeParam');
        HideIfBlur (changeParam);
    }).on('change', '.changeParamSelect', function() {
        var changeParam = $(this).parent().find('button.changeParam');
        HideIfBlur (changeParam);
    }).on('click', 'fieldset.msgSetting-cb_list', function() {
        showButtonAccept ();
    });

    $('.addItemToList').click(function(){
        addItemToList(this);
    });

    $('.changeParam').click(function () {
        var self = this;
        $.when(changeParam(this)).then(function(){
            $(self).hide(300);

        });
    });

    function deleteCurrentItem (directThis){

            var fileName = $(directThis).closest('.file').data('file');

            //var param = $(directThis).prev()[0].id;
            var param = $(directThis).closest('.ConfigOptionShow').data('param');

            //var title = $(directThis).closest('div.ConfigOptionShow').find('label').text().replace(/: /, '');
            var title = $(directThis).closest('div.ConfigOptionShow').data('title');

            var value,pattern,list,list_names,select,text;
            var removeItem = $(directThis).closest('li').find('input')[0].id;
            if ($(directThis).closest('.listOfSomething').length != 0) {
                var ul = $(directThis).closest('.listOfSomething').find('li').find('input');
                var ul_names = $(directThis).closest('.listOfSomething').find('li>span.li_name');
                if (ul_names.length > 0) {
                    list_names = [];
                    for (var i = 0; i < ul.length; i++) {
                        if (ul[i].id != removeItem) {
                            list_names.push((ul_names[i].innerHTML));
                        }
                    }
                    list_names = JSON.stringify(list_names);
                }
                list = [];
                for (i = 0; i < ul.length; i++) {
                    if (ul[i].id != removeItem){
                        list.push((ul[i].value));
                    }
                }
                list = JSON.stringify(list);
            }
            ajaxRequest(fileName, param, title, value, pattern, list, list_names, select, text);
    }

    function editCurrentItemInList (directThis){
        //var fileName = $(directThis).closest('.file')[0].className.replace(/file /, '');
        var fileName = $(directThis).closest('.file').data('file');

        //var param = $(directThis).prev()[0].id;
        var param = $(directThis).closest('.ConfigOptionShow').data('param');

        //var title = $(directThis).closest('div.ConfigOptionShow').find('label').text().replace(/: /, '');
        var title = $(directThis).closest('div.ConfigOptionShow').data('title');

        var value,pattern,list,list_names,select,text;
        if ($(directThis).parent().find('input').attr('pattern') != 'undefined'){
            pattern = $(directThis).parent().find('input').attr('pattern');
        }
        if ($(directThis).closest('.listOfSomething').length != 0) {
            var ul = $(directThis).closest('.listOfSomething').find('li').find('input');
            var ul_names = $(directThis).closest('.listOfSomething').find('li>span.li_name');
            if (ul_names.length > 0) {
                list_names = [];
                for (var i = 0; i < ul.length; i++) {
                    list_names.push((ul_names[i].innerHTML));
                }
                list_names = JSON.stringify(list_names);
            }
            list = [];
            for (var i = 0; i < ul.length; i++) {
                list.push((ul[i].value));
            }
            list = JSON.stringify(list);
        }
        ajaxRequest(fileName, param, title, value, pattern, list, list_names, select, text);
    }

    function addItemToList (directThis){

        var fileName = $(directThis).closest('.file').data('file');

        //var param = $(directThis).prev()[0].id;
        var param = $(directThis).closest('.ConfigOptionShow').data('param');

        //var title = $(directThis).closest('div.ConfigOptionShow').find('label').text().replace(/: /, '');
        var title = $(directThis).closest('div.ConfigOptionShow').data('title');



        var value,pattern,list,list_names, select,text;
        if ($(directThis).closest('div.ConfigOptionShow').find('input').attr('pattern') != 'undefined'){
            pattern = $(directThis).parent().find('input').attr('pattern');
        }

        if ($(directThis).closest('div.ConfigOptionShow').find('.listOfSomething').length != 0) {
            var ul = $(directThis).closest('div.ConfigOptionShow').find('.listOfSomething').find('li').find('input');
            list = [];
            list.push($(directThis).parent().find('input').val());
            for (var i = 0; i < ul.length; i++) {
                list.push((ul[i].value));
            }
            list = JSON.stringify(list);
            ajaxRequest(fileName, param, title, value, pattern, list, list_names, select, text);
        }
    }

    function changeParam (directThis){

        var fileName = $(directThis).closest('.file').data('file');

        var param = $(directThis).closest('.ConfigOptionShow').data('param');

        var title = $(directThis).closest('div.ConfigOptionShow').data('title');

        var value,pattern,list,list_names,select,text,cb_list_obj;

        if ($(directThis).parent().find('input').length == 0) {
            if ($(directThis).parent().find('textarea').length == 0) {
                value = $(directThis).parent().find('select').val();
                var selection = $(directThis).parent().find('option');
                select = [];
                for (var i = 0; i < selection.length; i++) {
                    select.push(selection[i].innerHTML);
                }
                select = JSON.stringify(select);
            } else {
                text = $(directThis).parent().find('textarea').val();
            }
        } else {
            if ($(directThis).parent().find('input').attr('type') == 'checkbox') {
                if (param == 'city') {
                    var cb_list = [];
                    var list_cb = $('.msgSetting-cb_list-cbs:checkbox');
                    list_cb.each(function(index, el){
                        if (el.checked){
                            cb_list.push('true');
                        } else{
                            cb_list.push('false');
                        }
                    });
                    cb_list_obj = toObject(cb_list);
                } else{
                    value = $(directThis).parent().find('input').prop('checked');
                }
            } else {
                if ($(directThis).parent().find('input').attr('pattern') != 'undefined'){
                    pattern = $(directThis).parent().find('input').attr('pattern');
                }
                value = $(directThis).parent().find('input').val();
            }
        }
        return (ajaxRequest(fileName, param, title, value, pattern, list, list_names, select, text, cb_list_obj));
    }

    function ajaxRequest(fileName, param, title, value, pattern, list, list_names, select, text, cb_list_obj) {

        var action = (configuration == 'admin')?'changeConfig':'changeUserSetting';

        var data = 'controller=Ajax&action=' + action +'&fileName=' + fileName + '&param=' + param + '&title=' + title + '&value=' + value + '&pattern=' + pattern + '&list=' + list + '&list_names=' + list_names +'&select=' + select + '&text=' + text + '&cb_list=' + JSON.stringify(cb_list_obj);
        //console.log(data);
        return $.ajax({
            method: 'post',
            url: "system/controllers/JsonController.php",
            data: data,
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                if (data.list != undefined){
                    var cont = $("#" + param);
                    cont.html('');
                    var e;
                    var i = 0;
                    for (e in data.list){
                        var tpl = $("<li></li>");
                        if( Object.prototype.toString.call( data.list ) !== '[object Array]' ) {
                            tpl.append('<span class="li_name">'+ e + '</span> мм - ');
                        }
                        tpl.append("<input class='putArea editItemFromList' id=" + i + " type='text' value='"+ data.list[e] +"' title='редактировать' style='color: "+ data.list[e] +"'>");
                        tpl.append('<button class="editCurrentItemInList" type="button">Применить</button>');
                        tpl.append("<span><img class='deleteCurrentItem' src='/service/img/admin/delete.png' height='20px' title='удалить'></span>");
                        cont.append(tpl);
                        i++;
                    }
                }
            }
        });
    }

    function showButtonAccept(){
        $('#msgSetting-button').show();
    }

    $(document).ready(function(){
        if ($('#msgSetting-cb_list-first-cb').is(":checked")){
            cbCheck();
        }
        $('#msgSetting-cb_list-first-cb').on('change', function(){
            cbCheck();
        });

        function cbCheck(){
            if ($('#msgSetting-cb_list-first-cb').is(":checked")){
                $('.msgSetting-cb_list-cbs').prop("checked", true);
                $('.msgSetting-cb_list-cbs').attr("disabled", true);
                $('#msgSetting-cb_list-first-cb').attr("disabled", false);
            } else{
                $('.msgSetting-cb_list-cbs').attr("disabled", false);
            }
        }
    });

    function HideIfBlur(element){
        if(element.css('display')!='block') {
            element.show(300, function() {
                $(document).bind('click.myEvent', function(e) {
                    if (!$(e.target).closest(element).length) {
                        element.hide(300);
                        $(this).unbind('click.myEvent');
                    }
                });
            });
        }
    }

    function toObject(arr) {
        var res = {};
        for (var i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) res[i] = arr[i];
        return res;
    }
}
