
var result = [];
var select_options = [
    "Длина",
    "Ширина",
    "Кол-во",
    "Кромка верх.",
    "Кромка нижн.",
    "Кромка лев.",
    "Кромка прав.",
    "Текстура",
    "Название",
    "Кратность сращения",
    "№",
    "Толщина",
];
var select_options_en = [
    "width",
    "height",
    "count",
    "top",
    "bottom",
    "left",
    "right",
    "texture",
    "caption",
    "multiplicity",
    "number",
    "thickness",
];

$(document).ready(function(){
    $('#dropZone').on('click', function () {
        $("#file_csv").click();
    });

    $('input[type="file"]#file_csv').on('change', function(e){
        sendFile(e);
    });

    $("#open-import-poppup").on("click", function () {
        $("#pop").removeClass("hidden");
        $("#download-xml-poppup").removeClass("hidden");
        $("#download-xml-poppup #submit").show();
    });

    $('#exit_import_csv').on('click', function () {
        reload();
        $('#download-xml-poppup').addClass('hidden');
        $("#pop").addClass("hidden");
        // result = [];
        // document.getElementById('my_form').reset();
        // $('#table').addClass("hidden");
        // $('#download-operations').addClass("hidden");
        // $('div.in').show();
        // $('#download-xml-poppup').addClass("hidden");
        // $("#pop").addClass("hidden");
        // $('#table tbody').html("<tr class='col-rms'><td></td></tr>");
    });
});

function getCaptionPos() {
    var columns_captions = $('#table thead select');
    var column_ind = {};
    for(var i = 0; i < columns_captions.length; i++){
        column_ind["i"+columns_captions[i].value] = i;
    }
    return column_ind;
}

function getCaptionPosRe() {
    var columns_captions = $('#table thead select');
    var column_ind = {};
    for(var i = 0; i < columns_captions.length; i++){
        column_ind["i"+i] = columns_captions[i].value;
    }
    return column_ind;
}

function getCaptionPosNonObj() {
    var columns_captions = $('#table thead select');
    var column_ind = [];
    for(var i = 0; i < columns_captions.length; i++){
        column_ind.push(columns_captions[i].value);
    }
    return column_ind;
}

function unique(arr) {
    var obj = {};

    for (var x in arr) {
        var str = x;
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}

function nounique(arr) {
    var obj = {};
    var obj1 = {};

    for (var x in arr) {
        var str = arr[x];
        if(obj[str] != undefined)
            obj1[str] = true;
        else
            obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj1); // или собрать ключи перебором для IE8-
}

function indexOf(arr, key) {
    for(var i = 0; i < arr.length; arr++)
        if(arr[i]==key) return i;
    return false;
}

function replaceSelects(ind, type) {
    var selects = $("#table thead select");
    var temp = selects[ind].value;
    var next_ind = ind;

    if(type == 'r')
        next_ind++;
    if(type == 'l')
        next_ind--;

    if(next_ind > selects.length-1)
        next_ind = 0;
    if(next_ind < 0)
        next_ind = selects.length-1;

    selects[ind].value = selects[next_ind].value;
    selects[next_ind].value = temp;
}

function traySelects(vect){
    var selects = $("#table thead select");
    var vals = [];
    $(selects).each(function (index, item) {
        vals.push(item.value);
    });
    if(vect == "l")
        $(selects).each(function (index, item) {
            if(index == selects.length-1) index = -1;
            item.value = vals[index+1];
        });
    if(vect == "r")
        $(selects).each(function (index, item) {
            if(index == 0) index = selects.length;
            item.value = vals[index-1];
        });
}

function last_subm_downl_csv() {
    var capt_pos = getCaptionPos();

    if(unique(getCaptionPosNonObj()).length != count(capt_pos)){
        showErrorMessage("Использование колонок с одинаковыми значениями не допустимо!");
        return;
    }

    var res_res = [];
    for(var i = 0; i < result.length; i++){
        var obj = {};
        for(var z = 0; z < select_options_en.length; z++){
            obj[select_options_en[z]] = result[i][capt_pos["i" + z]];
        }
        res_res.push(
            // {'number':result[i][capt_pos.i0],
            // 'width':result[i][capt_pos.i1],
            // 'height':result[i][capt_pos.i2],
            // 'count':result[i][capt_pos.i3],
            // 'top':result[i][capt_pos.i4],
            // 'bottom':result[i][capt_pos.i5],
            // 'left':result[i][capt_pos.i6],
            // 'right':result[i][capt_pos.i7],
            // 'texture':result[i][capt_pos.i8],
            // 'caption':result[i][capt_pos.i9]}
            obj
        );
    }

    var int_test = 0;
    var test_index;
    var incorrect_thick = 0;
    var incorrect_number = false;
    var numbers = [];

    for(var i = 0; i < res_res.length; i++){
        if(res_res[i].width == undefined || res_res[i].height == undefined) {res_res.splice(i,1); continue;}
        //------------------------//
        res_res[i].width = res_res[i].width.replace(",", ".");
        res_res[i].height = res_res[i].height.replace(",", ".");

        res_res[i].width = res_res[i].width.replace(/\s/ig, '');
        res_res[i].height = res_res[i].height.replace(/\s/ig, '');

        if(parseInt(res_res[i].number)){
            if (numbers[res_res[i].number]) {
                incorrect_number = true;
            } else {
                numbers[res_res[i].number] = 0;
            }
            numbers[res_res[i].number]++;
        }

        if(res_res[i].count == ""){
            res_res[i].count = 0;
        }
        if(res_res[i].top){
            res_res[i].top = res_res[i].top.replace(/^[xXхХ]$/, 1);
            res_res[i].top = res_res[i].top.replace(/^[yYуУzZ]$/, 2);
        }
        if(res_res[i].bottom){
            res_res[i].bottom = res_res[i].bottom.replace(/^[xXхХ]$/, 1);
            res_res[i].bottom = res_res[i].bottom.replace(/^[yYуУzZ]$/, 2);
        }
        if(res_res[i].left){
            res_res[i].left = res_res[i].left.replace(/^[xXхХ]$/, 1);
            res_res[i].left = res_res[i].left.replace(/^[yYуУzZ]$/, 2);
        }
        if(res_res[i].right) {
            res_res[i].right = res_res[i].right.replace(/^[xXхХ]$/, 1);
            res_res[i].right = res_res[i].right.replace(/^[yYуУzZ]$/, 2);
        }

        if (res_res[i].thickness) {
            res_res[i].thickness = res_res[i].thickness.replace(",", ".");
        }
        var test1 = parseFloat(res_res[i].width);
        var test2 = parseFloat(res_res[i].height);
        var test3 = parseFloat(res_res[i].count);
        var thick = parseFloat(res_res[i].thickness) || thickness;

        if(!test1 || !test2 || isNaN(test3)){
            int_test++;
            test_index = i;
        }
        if (!incorrect_thick) {
            incorrect_thick = thick % thickness;
        }
    }


    if (int_test == 1 && !incorrect_thick && !incorrect_number) {
        res_res.splice(test_index,1);
    } else if (int_test > 1) {
        showErrorMessage("Обязательно должны быть указаны габариты деталей.");
        return;
    } else if (incorrect_thick) {
        showErrorMessage("Толщины некоторых деталей не подходят для выбранного материала.");
        return;
    } else if (incorrect_number) {
        showErrorMessage("Номера некоторых деталей совпадают.");
        return;
    }

    var data = {'import-csv-format':'viyar-'+constructorId,
                'arr':res_res,
                'texture':'on'};

    $("#import-kromka-container .form-group select").each(function (index, item) {
        data[item.id] = $(item).val();
    });

    if($("#add_imported_details").prop("checked"))
        data.add_imported_details = "on";

    $.ajax({
        url: "?page=loadFromCsv",
        type: "POST",
        data: data,
        success: function(){
            //перезагрузка страницы
            location.reload();
        }
    });
}

function sendFile(e, fd) {
    e.preventDefault();

    msgConteiner.innerHTML = msgContent;

    var formData;

    if (FormData.prototype.isPrototypeOf(fd)) {
        formData = fd;
    } else {
        formData = new FormData($('#my_form').get(0));
    }

//    if (!testFile(formData.get('csv_file'))) {
//        return;
//    }
//
    $.ajax({
        url: "/service/system/views/cutting/menu/ParseCsv.php",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        dataType: 'json',
        success: function(json){
            if (json.status && json.status == 'error') {
                return showErrorMessage(json.msg);
            }
            // $('#table').removeClass("hidden");
            // $('#download-operations').removeClass("hidden");
            var w = 0;
            result = [];

            //проверяем на пустые колонки
            var needDel = false;
            var splice = 0;
            for(var i = 0; i < json.result_array.length; i++){
                if(!needDel)
                    result.push([]);
                needDel = true;
                for(var j = 0; j < json.result_array[i].length; j++){
                    result[Number(i-splice)][j] = json.result_array[i][j];
                    if(json.result_array[i][j].length>1) {
                        needDel = false;
                    }
                }
                if(needDel){
                    splice++;
                }
            }

            if(needDel){ //если последняя оказалась пустой - сносим
                result.splice(result.length-1,1);
            }

            // splice = 0;
            // for(var i = 0; i < result[0].length; i++){
            //     needDel = true;
            //     for(var j = 0; j < result.length; j++){
            //         if(result[j][Number(i-splice)].length>1){
            //             needDel = false;
            //             break;
            //         }
            //     }
            //     if(needDel){
            //         for(var j = 0; j < result.length; j++){
            //             result[j].splice(i,1);
            //         }
            //         splice++;
            //     }
            // }
            //
            // if(needDel){
            //     for(var j = 0; j < result.length; j++){
            //         result[j].splice(result[j].length-1,1);
            //     }
            // }

            // вынес в отдельный метод, бо его же буду использовать для буффера
            // for(var i = 0; i < result[0].length; i++) {
            //     $("tr.col-rms").append("<td class='conten"+i+"'><div onclick='rm("+'"i",'+i+")' class='glyphicon glyphicon-remove rm-i i="+i+"'></div></td>");
            //     addSelect(i);
            // }
            // for(var j = 0; j < result.length; j++){
            //     $("#table tbody").append("<tr class='con"+j+"'><td><div onclick='rm("+'"j",'+j+")' class='glyphicon glyphicon-remove rm-j j="+j+"'></div></td></tr>");
            //     for(var i = 0; i < result[j].length; i++){
            //         $("#table .con" + j).append("<td class='conten"+i+"'>"+ result[j][i] +"</td>");
            //         // if(w < i) w=i;
            //     }
            // }
            appendDataToTable(result);
            // console.log(result);
            // $("#table tbody").append("<tr><td colspan='4'></td></tr>");
        }
    });
}

function  appendDataToTable(){
    for(var i = 0; i < result[0].length; i++) {
        $("tr.col-rms").append("<td class='conten"+i+"'><div onclick='rm("+'"i",'+i+")' class='glyphicon glyphicon-remove rm-i i="+i+"'></div></td>");
        addSelect(i);
    }
    for(var j = 0; j < result.length; j++){
        $("#table tbody").append("<tr class='con"+j+"'><td><div onclick='rm("+'"j",'+j+")' class='glyphicon glyphicon-remove rm-j j="+j+"'></div></td></tr>");
        for(var i = 0; i < result[j].length; i++){
            $("#table .con" + j).append("<td class='conten" + i + "'>" + result[j][i] + "</td>");
            // if(w < i) w=i;
        }
    }
    $('#edit_form_table').removeClass("hidden");
    $('#navs_operations').hide();
}

function testFile(file) {
    var re = /(\.csv)$/i;
    if (!re.exec(file.name)) {
        msgConteiner.innerHTML = "Недопустимый формат файла!";
        return false;
    } else {
        return true;
    }
}

function addSelect(id, no_first) {
    var selectable_tr = $("#table thead tr").get(1);
    if(!no_first && $("#table thead td.selectable").length >= select_options.length - 1){
        // showErrorMessage("Достигнуто максимально допустимое количество колонок.");
        return;
    }

    var new_select = "<td class='selectable'><select onchange='checkedChangeCol(this)'>";
    var index_for_new_select = $($("#table thead tr").get(1)).find("td.selectable").length;
    for(var i = 0; i < select_options.length; i++)
        new_select+="<option "+((id==i)?"selected":"")+" value='"+i+"'>"+select_options[i]+"</option>";
    new_select += "</select></td>";
    $(selectable_tr).append(new_select);
    $(selectable_tr).append($('td#addHeadSelect'));

    //эт тип стрелки
    // var new_select_operations = "<td class='selectable_operations'><div style='margin: auto;'><div class='glyphicon glyphicon-arrow-left' onclick='replaceSelects("+index_for_new_select+", \"l\")'></div><div class='glyphicon glyphicon-arrow-right' style='margin-left: 5px;' onclick='replaceSelects("+index_for_new_select+", \"r\")'></div></div></td>";
    // $($("#table thead tr").get(0)).append(new_select_operations);
}

function rmSelect(i) {
    var selects_blocks = $("#table thead td.selectable");
    var needDel = i;
    if(i < select_options.length) {
        var operations_block = $("#table thead td.selectable_operations").get(needDel);
        $(selects_blocks[needDel]).remove();
        $(operations_block).remove();
    }
}

function reload() {
    document.getElementById('my_form').reset();
    $('#table tbody').html('<tr class="col-rms"><td></td></tr>');
    // $('#table').addClass("hidden");
    $('#edit_form_table').addClass("hidden");
    $('#navs_operations').show();
    $("#table tbody").html("<tr class='col-rms'><td></td></tr>");
    $("#table thead").html("<tr><td></td></tr><tr><td></td></tr>");
}

function rm(type, index) {
    switch (type){
        case "j":
            $("#table tbody tr").each(function (i,item) {
                if($(item).hasClass("con" + index)){
                    result.splice(i-1,1);
                }
            });
            $("tr.con" + index).remove();
            break;
        case "i":
            var needAdd = false;
            if(result[0].length > $("#table thead tr td.selectable").length)
                needAdd = true;

            var needDel = 0;
            $("#table tbody tr").each(function (i,item) {
                $("." + $(item).attr("class") + " td").each(function (ind, item) {
                    if($(item).hasClass("conten" + index)){
                        if(ind-1>=0 && i-1>=0)
                            result[i-1].splice(ind-1,1);
                        $(item).remove();
                        needDel = ind-1;
                    }
                });
            });

            if(needAdd) addSelect($("#table thead tr td.selectable select").get(needDel).value, true);
            rmSelect(needDel);
            checkedChangeCol();
            break;
    }
}

function checkedChangeCol(t){
    if(t) {
        if (t.value == 9) {
            $("#table thead select").each(function (index, item) {
                if (item.value == 11) {
                    showMessage("Нельзя одновременно указывать толщину и кратность.");
                    t.value = 0;
                }
            });
        }
        if (t.value == 11) {
            $("#table thead select").each(function (index, item) {
                if (item.value == 9) {
                    showMessage("Нельзя одновременно указывать толщину и кратность.");
                    t.value = 0;
                }
            });
        }
    }

    var capt_pos = getCaptionPosRe();

    $("#table thead select").each(function (index, item) {
        $(item).removeClass("warning");
    });

    if(unique(getCaptionPosNonObj()).length != count(getCaptionPos())){
            var nouniq_capt = nounique(capt_pos);
            $("#table thead select").each(function (index, item) {
                for(var x in nouniq_capt){
                    if($(item).val() == nouniq_capt[x]){
                        $(item).addClass("warning");
                    }
                }
            });
    }

}

function count(arr){var i=0;for(var x in arr)i++;return i;}


//buffer methods:
function load_buffer_text() {
    var text = $('#buffer-text').val().split('\n');

    for(var index in text){
        text[index] = text[index].split('\t');
    }

    result = text;
    appendDataToTable();
    // console.log(text);
}