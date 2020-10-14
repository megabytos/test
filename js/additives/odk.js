
var inputs = {
    odk: {
        disabled: null
    },
    curvilinear: {
        disabled: {         //disabled when this_key element checked this_val
            'odk': false
        }
    },
    odkFile: {
        disabled: {         //disabled when this_key element checked this_val
            'odk': false
        }
    }
};

function setFormData(data) {
    for(var key in inputs) {
        var input = document.getElementById(key);
        input.checked = data[key];
        if (ro) {
            input.disabled = true;
        }
    }
}

function initODK(data, global_data) {
    setFormData(data);
    setFormRules();

    document.getElementById('odkForm').onchange = function () {
        setFormRules();
        var data = {};
        data.data = getFormData();
        data.controller = 'Additives';
        data.action = 'setODK';
        data.detail_key = detailKey;

        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            data: data,
            dataType: 'json',
            success: function (result) {
                setFormData(result[0]);
                setFormRules();
            }
        });
    };
}

/*
* Снимает выбор и юзает дизэйбл на инпуты
* */
function setFormRules() {
    for(var key in inputs) {
        if(inputs[key].disabled){
            for(var father in inputs[key].disabled){
                if(document.getElementById(father).checked == inputs[key].disabled[father]){
                    document.getElementById(key).checked = false;
                    document.getElementById(key).disabled = true;
                }else{
                    document.getElementById(key).disabled = false;
                }
            }
        }
    }
}

function getFormData() {
    var data = {};
    for(var key in inputs) {
        data[key] = +document.getElementById(key).checked;
    }

    return data;
}

define(function () {
    return {
        init: initODK
    }
});
