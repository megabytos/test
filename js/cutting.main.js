var detailKey = '';
var preset_item_key = '';
var edges = [];
var edgesUsedArticles = {};
var edgesList = [];
var isEditDetail = false;
//var edgesListCash = null;

$("#import-csv-format").change(function () {
    var subm_butn = $("#submit-download-csv_file");
    $('#overall_dimensions').prop('checked', false);
    $('#overall_dimensions_div').hide();
    $('#import_texture_div').hide();
    $('#add_number_to_caption_div').hide();
    $('#open-import-poppup').hide();
    $(subm_butn).hide();
    switch ($("#import-csv-format").val()) {
        case 'pro100':
            addEdgeSelectorForImport({clear: true, id: 1});
            $('#overall_dimensions').prop('checked', true).parent().find('.input_mask').addClass('input_mask_checked');
            $(subm_butn).show();
            //var chb = $('#overall_dimensions');
            //if(!chb.prop('checked')){
            //    $('#overall_dimensions').click();
            //
            //}
            $('#overall_dimensions_div').show();
            $('#import_texture_div').show();
            break;
        case 'bazis':
            $('#import-kromka-container').html('');
            $('#overall_dimensions').prop('checked', true).parent().find('.input_mask').addClass('input_mask_checked');
            $(subm_butn).show();
            //$('#overall_dimensions').prop('checked', true);
            //var chb = $('#overall_dimensions');
            //if(!chb.prop('checked')){
            //    $('#overall_dimensions').click();
            //
            //}
            $('#import_texture_div').show();
            $('#add_number_to_caption_div').show();
            break;
        case 'viyar-dsp':
        case 'viyar-stol':
            addEdgeSelectorForImport({clear: true, button: true, non_add: true, info: true});
            $('#open-import-poppup').show();
            break;
        case 'viyar-steklo':
            $('#import-kromka-15-div').show();
            $(subm_butn).show();
            break;
        case 'woody':
            addEdgeSelectorForImport({clear: true, thickness: 0.4});
            addEdgeSelectorForImport({thickness: 0.45});
            addEdgeSelectorForImport({thickness: 0.5});
            addEdgeSelectorForImport({thickness: 0.6});
            addEdgeSelectorForImport({thickness: 0.8});
            addEdgeSelectorForImport({thickness: 1});
            addEdgeSelectorForImport({thickness: 1.3});
            addEdgeSelectorForImport({thickness: 1.5});
            addEdgeSelectorForImport({thickness: 2});
            $('#overall_dimensions_div').show();
            $('#import_texture_div').show();
            $('#add_number_to_caption_div').show();
            $(subm_butn).show();
            break;
    }
});

$('#print_ro').click(function () {
    var sel_det = getSelectedDetails();
    if (sel_det.length == 0) {
        showErrorMessage(LANG['NO-CHOOSED-DETAILS']);
    } else {
        printDetails(sel_det);
    }
});

$('#detailsActions').change(function () {
    $('#perimeter-kromka-div').hide();
    $('#change-kromka-div').hide();
    $('#rotate-details-div').hide();
    $('#change-texture-div').hide();
    $('#add-pur-div').hide();
    $('#change-details-quantity-div').hide();
    // $('#decrease-count-div').hide();
    $('#choose_decorated_side-div').hide();
    $('#change-holes-diam-div').hide();
    $('#change-holes-depth-div').hide();
    $('#add_n_odk').hide();
    $('#set_stol_edges_cuts').hide();
    $('#remove-additional-processing-div').hide();

    if (this.value != '') {
        if (this.value === 'selectIncorrectElements') {
            var span = $('span.selectable');
            $('#detailTableBody .danger  td:nth-child(2) .input_mask:not(.input_mask_checked)').click();
            $('#detailTableBody tr:not(.danger)  td:nth-child(2) .input_mask')
                .removeClass('input_mask_checked')
                .next('input')
                .attr('checked', false);

            this.value = '';
            updateDetailsCount();
        } else if (this.value === 'choose_additional_operations') {
            $('#detailTableBody .operations  td:nth-child(2) .input_mask:not(.input_mask_checked)').click();
            $('#detailTableBody tr:not(.operations)  td:nth-child(2) .input_mask')
                .removeClass('input_mask_checked')
                .next('input')
                .attr('checked', false);
            this.value = '';
            updateDetailsCount();
        } else if (this.value === 'choose_additional_services') {
            $('#detailTableBody .services  td:nth-child(2) .input_mask:not(.input_mask_checked)').click();
            $('#detailTableBody tr:not(.services)  td:nth-child(2) .input_mask')
                .removeClass('input_mask_checked')
                .next('input')
                .attr('checked', false);
            this.value = '';
            updateDetailsCount();
        } else if (getSelectedDetails().length == 0) {
            showErrorMessage(LANG['NO-CHOOSED-DETAILS']);
            $('#detailsActions').val('');
        } else {
            switch (this.value) {
                case 'set_edges':
                    $('#perimeter-kromka-div').show(300);
                    break;
                case 'change_edges':
                    $('#change-kromka-div').show(300);
                    break;
                case 'rotate_details':
                    $('#rotate-details-div').show(300);
                    break;
                case 'changeHolesDiam':
                    $('#change-holes-diam-div').show(300);
                    break;
                case 'changeHolesDepth':
                    $('#change-holes-depth-div').show(300);
                    break;
                case 'choose_decorated_side':
                    $('#choose_decorated_side-div').show(300);
                    break;
                case 'set_texture':
                    $('#change-texture-div').show(300);
                    break;
                case 'change-details-quantity':
                    $('#change-details-quantity-div').show(300);
                    break;
                // case 'decrease_details_count':
                //     $('#decrease-count-div').show(300);
                //     break;
                case 'print_selected_details':
                    printDetails(getSelectedDetails());
                    break;
                case 'set_stol_edges_cuts':
                    $('#set_stol_edges_cuts').show(300);
                    break;
                case 'usePurGlue':
                    $('#add-pur-div').show(300);
                    break;
                case 'implode':
                    if (showConfirmMessage(LANG['CONSUME-CHOOSED-D'], implodeSelected, getSelectedDetails)) {
                        break;
                    }else{
                        $('#detailsActions').val('');
                    }
                    break;
                case 'add_n_odk':
                    $('#add_n_odk').show(300);
                    $('#curvilinearForDetails').prop('disabled', true);
                    $('#odkFileForDetails').prop('disabled', true);
                    $('#odkForDetails').prop('checked', false);
                    $('#curvilinearForDetails').prop('checked', false);
                    $('#odkFileForDetails').prop('checked', false);
                    break;
                case 'remove_additional_processing':
                    $('#remove-additional-processing-div').show(300);
                    // if (showConfirmMessage(LANG['CONFIRM-UDALENIE-C'], removeAdditionalProcessing, getSelectedDetails)) {
                    //     break;
                    // } else {
                    //     $('#detailsActions').val('');
                    // }
                    break;
                case 'del_selected_details':
                    //if (confirm('Подтвердите удаление выделенных деталей')) {
                    if (showConfirmMessage(LANG['CONFIRM-UDALENIE-D'], delDetails, getSelectedDetails)) {
                        break;
                    } else {
                        $('#detailsActions').val('');
                    }
                    break;
                case 'changeMultiGrooving':
                    // var content;
                    $("#details-tabel").addClass("disableElement");
                    $.when( $.ajax("/service/system/views/additives/menu/grooving_templ.php") ).then(function(data){
                        // content = data;
                        data += ('<script src="js/additives/grooving_multi.js"></script>');
                        showTopPanel(LANG['MASSIV-ADD-PAZ'], data);
                        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
                        start();
                        // $.ajax({
                        //     type: "POST",
                        //     url: "system/controllers/JsonController.php",
                        //     data: ({controller:'Additives', action: 'getDetails'}),
                        //     // get($id) or no ... create in additives setForMor...() and use because this better and true
                        //     dataType: 'json',
                        //     success: function (data) {
                        //         console.log(data);
                        //     }
                        // });
                    });
                    break;
                case 'changeMultiDrilling':
                    $("#details-tabel").addClass("disableElement");
                    $.when( $.ajax({url : "/service/system/views/additives/menu/drilling_templ.php", type : 'POST', data : {test : 'true'}})).then(function(data){
                        // content = data;
                        data += ('<script src="js/additives/drilling_multi.js"></script>');
                        showTopPanel(LANG['MASSIV-ADD-OTV'], data);
                        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
                        start();
                    });
                    break;
                case 'changeMultiRabbeting':
                    $("#details-tabel").addClass("disableElement");
                    $.when( $.ajax({url : "/service/system/views/additives/menu/rabbeting_templ.php", type : 'POST', data : {test : 'true'}})).then(function(data){
                        // content = data;
                        data += ('<script src="js/additives/rabbeting_multi.js"></script>');
                        showTopPanel(LANG['MASSIV-ADD-CHE'], data);
                        $("#top-panel .panel-body").addClass("repading"); //делает адекватный отступ
                        start();
                    });
                    break;
            }
            //this.value = ''; |||над как то вернуть
        }
    }
});
/*
 $('#perimeter-kromka').change(function () {
 if ($(this).val() > 0) {
 $('#perimeter-kromka-submit').show();
 } else {
 $('#perimeter-kromka-submit').hide();
 }
 });
 */

$('#odkForDetails').change(function () {
    if ($('#odkForDetails').prop('checked')){
        $('#curvilinearForDetails').prop('disabled', false);
        $('#odkFileForDetails').prop('disabled', false);
    } else {
        $('#curvilinearForDetails').prop('disabled', true);
        $('#odkFileForDetails').prop('disabled', true);
        $('#curvilinearForDetails').prop('checked', false);
        $('#odkFileForDetails').prop('checked', false);
    }
});

$('#change-kromka-from').change(function () {
    if ($(this).val() > 0) {
        filterEdges(!$('#ignore-thickness').prop('checked'), 'change-kromka-to', $(this).val());
    } else {
        $('#change-kromka-to').empty().change();
    }
});
$('#change-kromka-to').change(function () {
    if ($(this).val() > 0) {
        $('#change-kromka-submit').show();
    } else {
        $('#change-kromka-submit').hide();
    }
});

$('#change-holes-diam-to, #change-holes-diam-from').change(function () {
    var change_from = $('#change-holes-diam-from').val();
    var change_to = $('#change-holes-diam-to').val();

    if (change_from > 0 && change_to > 0) {
        if ($('#change-holes-diam-submit').hasClass('disabled')) {
            $('#change-holes-diam-submit').removeClass('disabled');
        }
    } else {
        if (!$('#change-holes-diam-submit').hasClass('disabled')) {
            $('#change-holes-diam-submit').addClass('disabled');
        }
    }
});

$('#change-holes-depth-to, #change-holes-depth-from').change(function () {
    var change_from = $('#change-holes-depth-from').val().replace(',', '.');
    var change_to = $('#change-holes-depth-to').val().replace(',', '.');

    if (change_from > 0 && change_to > 0 && change_from < 200 && change_to < 200) {
        // $('#change-holes-depth-submit').show();
        // console.log('has = ', $('#change-holes-depth-submit').hasClass('disabled'));
        var area = $('#change-holes-depth-area').val();
        var detail_keys = getSelectedDetails();
        var select_diam = $('#select-holes-diam').val();

        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({
                controller: 'Cutting',
                action: 'checkHolesDepth',
                area: area,
                keys: detail_keys,
                select_diam: select_diam,
                change_from: change_from,
                change_to: change_to
            }),
            dataType: 'JSON',
            success: function (data) {
                //console.log('data = ', data);
                if (data && data == '1') {
                    if ($('#change-holes-depth-submit').hasClass('disabled')) {
                        $('#change-holes-depth-submit').removeClass('disabled');
                    }
                } else {
                    if (!$('#change-holes-depth-submit').hasClass('disabled')) {
                        // $('#change-holes-depth-submit').addClass('disabled');
                    }
                }
            }
        });
    } else {
        if (!$('#change-holes-depth-submit').hasClass('disabled')) {
            // $('#change-holes-depth-submit').addClass('disabled');
        }
    }
});


$("#WidthId").change(function(){
    inputCalc($("#WidthId"));
});

$("#HeightId").change(function(){
    inputCalc($("#HeightId"));
});

$("#WidthId").change(checkDetailWidth);
$("#HeightId").change(checkDetailHeight);
$("#MultiplicityId").change(checkDetailMultiplicity);
$("#CountId").change(checkDetailsCount);

function init() {
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
        // if (constructorId == 'stol') {
        //     if (materialId == '0000') {
        //         $("#HeightId").attr("readonly", false);
        //     } else {
        //         $("#HeightId").attr("readonly", true);
        //         $("#HeightId").val(materialHeight);
        //     }
        // }
        $("#Height").removeClass("has-success");
        $("#Height").removeClass("has-error");
        $("#MultiplicityId").val(1);
        $("#Multiplicity").removeClass("has-success");
        $("#Multiplicity").removeClass("has-error");
        $("#CountId").val(1);
        $("#Count").removeClass("has-success");
        $("#Count").removeClass("has-error");
        //$('#MultiplicityId').attr("disabled", true);
        //$('#CountId').attr('disabled', true);
        $("#addButton").text(LANG['ADD']);
        $("#import-csv-format").change();
        $('#detailsActions').val('').change();
    }
}

///////////////////////////////////////////Preset Items
$('select#preset_item_list').change(function () {
    $("div.preset_item_added").hide();
    var preset_item = $(this).val();
    var field_set = $('#preset_details');
    var kromka = $('#kromka_show');
    //field_set.slideUp();
    $('.preset_additional_functional').show();
    $('.sider').height('150vh');
    $.ajax({
        url: '/service/templates/preset_items/' + preset_item + '.php',
        method: 'POST',
        data: {A_LANG: LANG['LANG']}
    }).done(function (data) {
            // console.log('/service/templates/preset_items/' + preset_item + '.html');
            field_set.html('');
            //field_set.slideDown(300);
            field_set.append(data);
            checkboxMask('.shelfClass');
        }
        // $('.sider').height('200vh')
    );
    // if (preset_item=="NightStand"){
    //     $.ajax({
    //         url: '/service/templates/' + "choose_kromka_with_type" + '.html',
    //         method: 'GET'
    //     }).done(function (data) {
    //         // console.log('/service/templates/preset_items/' + preset_item + '.html');
    //         kromka.html('');
    //         kromka.append(data);
    //         setEdgeSelector('#choose_kromka-2', 2);
    //         setEdgeSelector('#choose_kromka-05', 0.5);
    //     });
    // } else {
    //     $.ajax({
    //         url: '/service/templates/' + "choose_kromka" + '.html',
    //         method: 'GET'
    //     }).done(function (data) {
    //         // console.log('/service/templates/preset_items/' + preset_item + '.html');
    //         kromka.html('');
    //         kromka.append(data);
    //         setEdgeSelector('#choose-kromka');
    //     });
    // }
    //checkboxMaskUpdate(selector);

});

function add_preset_item() {
    var form = $('#preset_item_form');                  //создание формы по id preset_item_form
    var input = $(form).find('input, fieldset select'); //поиск в форме input и select
    for (var i = 0; i < input.length; i++) {
        $(input[i]).attr('style', '');                  //занесение в массив аттрибута style
    }
    // console.log(check_preset_item_dimension(input));
    var form_data = form.serialize();
    //console.log(form_data);
    if (check_preset_item_dimension(input)) {           // проверка валидности измерений
        var form_data = form.serialize();
        //console.log(form_data);

        send_preset_item(form_data);
    }
    checkboxMaskUpdate(form);
}

function check_preset_item_dimension(input) {
    var isValid = true;
    for (var i = 1; i < input.length; i++) {
        if (input[i].type != 'checkbox' && input[i].type != 'radio') {
            if (input[i].value == '') {
                input[i].placeholder = LANG['NEED-SIZE'];
                $(input[i]).attr('style', 'border-color: red');
                isValid = false;
            } else if (!Number(input[i].value)) {
                input[i].value = '';
                input[i].placeholder = LANG['ONLY-CHISLA'];
                $(input[i]).attr('style', 'border-color: red');
                isValid = false;
            } else if (input[i].value < 1) {
                input[i].value = '';
                input[i].placeholder = LANG['MORE-ZERO'];
                $(input[i]).attr('style', 'border-color: red');
                isValid = false;
            }
        }
    }
    return isValid;
}

function send_preset_item(data, success) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ("controller=Cutting&action=add_preset_item&" + data),
        dataType: 'JSON',
        success: function (data) {
            //console.log(data);
            if (data.type == 'error') {
                var error = data;
                showErrorMessage(error.msg);
                var element = $("#" + error.element);
                element.closest('#preset_details').find('input,select').attr('style', 'background-color: white');
                element.attr('style', 'background-color: rgb(232, 121, 121)');
            } else {
                $("#sel-edges").load('/service/templates/edges_list.php');
                preview_3d(data);
            }
        }
    });
}

function preview_3d(construction) {
    //console.log(construction);

    var view = create3DScene();
    //x        y    z
    //var bgeom = new THREE.BoxGeometry(300 - 36, 18, 100);
    //var bmaterial = new THREE.MeshLambertMaterial({color : 'gray'});
    //var bFesh = new THREE.Mesh(bgeom, bmaterial);
    //
    //bmesh.rotation.x = Math.PI / 2;
    //bmesh.position.z = -150 + 9;
    //view.scene.add(bmesh);
    //
    //var fgeom = new THREE.BoxGeometry(300 - 36, 18, 100);
    //var fmaterial = new THREE.MeshLambertMaterial({color : 'gray'});
    //var fmesh = new THREE.Mesh(fgeom, fmaterial);
    //
    //fmesh.rotation.x = -Math.PI / 2;
    //fmesh.position.z = 150 - 9;
    //view.scene.add(fmesh);
    //
    //
    //var lgeom = new THREE.BoxGeometry(100, 18, 300);
    //var lmaterial = new THREE.MeshLambertMaterial({color : 'gray'});
    //var lmesh = new THREE.Mesh(lgeom, lmaterial);
    //lmesh.position.x = -150 + 9;
    //lmesh.rotation.z = Math.PI / 2;
    //view.scene.add(lmesh);
    //
    //var rgeom = new THREE.BoxGeometry(100, 18, 300);
    //var rmaterial = new THREE.MeshLambertMaterial({color : 'gray'});
    //var rmesh = new THREE.Mesh(rgeom, rmaterial);
    //rmesh.position.x = 150 - 9;
    //rmesh.rotation.z = - Math.PI / 2;
    //view.scene.add(rmesh);


    //construction
    //var cGeom = new THREE.CylinderGeometry(5, 5, 30, 20, 1, false, 0, Math.PI * 2);


    //var geom = new THREE.CubeGeometry(200, 20, 200);
    //var material = new THREE.MeshPhongMaterial({color : 'gray'});
    //var mesh = new THREE.Mesh(geom, material);
    //
    //var mBsp = new ThreeBSP(mesh);
    //var result = mBsp.subtract(cBsp);
    //mesh = result.toMesh(mesh.material);
    //
    //view.scene.add(mesh);
    //view.scene.add(c);

    var result = new THREE.Object3D();
    result.position.x = 1000;

    construction.forEach(function (d) {
        //var d = construction[0];
        var geom = new THREE.CubeGeometry(d['x_length'], d['y_length'], d['z_length']);
        var material = new THREE.MeshPhongMaterial({
            color: 'gray',
            opacity: 0.75
            //side : THREE.DoubleSide
        });
        material.transparent = true;
        var mesh = new THREE.Mesh(geom, material);
        //var cGeom = new THREE.CubeGeometry(1, 10, 10);
        //var c = new THREE.Mesh(cGeom);
        //c.castShadow = true;
        //c.receiveShadow = true;
        //c.rotation.x = Math.PI / 2;
        //c.position.z = 10;
        //c.scale.x = d['x_length'];
        //var cBsp = new ThreeBSP(c);
        //
        //var mBsp = new ThreeBSP(mesh);
        //
        ////c.scale.y = 10;
        //var res = mBsp.subtract(cBsp);
        //
        //mesh = res.toMesh(mesh.material);
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;

        /*
         *
         hole_depth
         hole_diam

         hole_x
         hole_x_rotate
         hole_y
         hole_y_rotate
         hole_z
         hole_z_rotate
         * */

        mesh = (function (mesh) {
            if (d.holes.length > 0) {
                var totalGeom = new THREE.Geometry();
                d.holes.forEach(function (hole) {
                    var geom = new THREE.CylinderGeometry(hole['hole_diam'] / 2, hole['hole_diam'] / 2, hole['hole_depth'], 20, 1, false, 0, Math.PI * 2);
                    var hole_material = new THREE.MeshPhongMaterial({color: '#fd0101'});
                    var drill = new THREE.Mesh(geom, hole_material);
                    drill.position.set(hole['hole_x'], hole['hole_y'], hole['hole_z']);
                    drill.rotation.set(hole['hole_x_rotate'] * Math.PI / 180, hole['hole_y_rotate'] * Math.PI / 180, hole['hole_z_rotate'] * Math.PI / 180);
                    drill.updateMatrix();
                    totalGeom.merge(drill.geometry, drill.matrix);
                });
                //mesh.updateMatrix();
                //totalGeom.merge(mesh.geometry, mesh.matrix);
                //mesh = new THREE.Mesh(totalGeom, mesh.material);
                var drills = new THREE.Mesh(totalGeom);

                var drillBsp = new ThreeBSP(drills);

                var meshBsp = new ThreeBSP(mesh);

                var res = meshBsp.subtract(drillBsp);

                return res.toMesh(mesh.material);
            }
            return mesh;
        })(mesh);

        mesh = (function (mesh) {
            if (d['grooves'].length > 0) {
                var totalGeom = new THREE.Geometry();
                d['grooves'].forEach(function (groov) {

                    var geom = new THREE.BoxGeometry(groov['groove_x_length'], groov['groove_y_length'], groov['groove_z_length']);

                    var drill = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({color: 'yellow'}));

                    drill.position.set(groov['groove_x'], groov['groove_y'], groov['groove_z']);
                    drill.rotation.set(groov['groove_x_rotate'] * Math.PI / 180, groov['groove_y_rotate'] * Math.PI / 180, groov['groove_z_rotate'] * Math.PI / 180);
                    drill.updateMatrix();
                    totalGeom.merge(drill.geometry, drill.matrix);
                });
                //mesh.updateMatrix();
                //totalGeom.merge(mesh.geometry, mesh.matrix);
                //mesh = new THREE.Mesh(totalGeom, mesh.material);
                var drills = new THREE.Mesh(totalGeom);

                var drillBsp = new ThreeBSP(drills);

                var meshBsp = new ThreeBSP(mesh);

                var res = meshBsp.subtract(drillBsp);

                return res.toMesh(mesh.material);
            }
            return mesh;
        })(mesh);


        ['x', 'y', 'z'].forEach(function (s) {
            mesh.position[s] = d[s + '0'];
        });

        ['x', 'y', 'z'].forEach(function (s) {
            mesh.rotation[s] = d[s + '_rotate'] * Math.PI / 180;
        });
        //console.log(mesh);

        //mesh.position.x = 1000;

        //view.scene.add(c);
        result.add(mesh);

    });

    result.position.x = 0;
    view.scene.add(result);
    view.state.start();
    window.addEventListener('keydown', exit);

    function exit(e) {
        if (e.keyCode == 27) {
            window.removeEventListener('keydown', exit);
            view.destroy();
            view.container.parentNode.removeChild(view.container);
        }
    }

}

function create3DScene() {
    var container = document.createElement('div');
    container.className = 'popup-3D';
    //$('body').append('<div class="popup-3D"></div>');
    document.body.appendChild(container);


    var acceptButton = document.createElement('input');
    acceptButton.id = 'acceptPresetItem';
    acceptButton.type = 'button';
    acceptButton.value = LANG['ADD-DETAIL-CONS-TABLE'];
    container.appendChild(acceptButton);

    var rejectButton = document.createElement('input');
    rejectButton.id = 'rejectPresetItem';
    rejectButton.type = 'button';
    rejectButton.value = 'Назад';
    container.appendChild(rejectButton);


    //var shadowLight;

    //var container = document.getElementById(config.container);

    var width = container.offsetWidth;
    var height = container.offsetHeight;


    var renderer;

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        //preserveDrawingBuffer   : true
    });
    //var error = false;
    //
    //if (!error) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    //}

    renderer.setSize(width, height);
    renderer.setClearColor(0xEEEEEE);


    var scene = new THREE.Scene();

    renderer.domElement.id = 'preview_3D';

    container.appendChild(renderer.domElement);
    //if (config.axes === true) {
    var axes = new THREE.AxisHelper(200);
    axes.visible = false;
    scene.add(axes);
    //}


    var camera = new THREE.PerspectiveCamera(30, width / height, 1, 100000);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);


    //controls.mouseButtons = settings.mouse;
    //console.log(controls.mouseButtons);


    controls.enableZoom = true;
    //controls.rotateSpeed = 0.2;
    //controls.zoomSpeed = 0.2;
    //controls.panSpeed = 0.2;
    controls.enableKeys = false;

    var positions = {
        lookAt: {x: 0, y: 0, z: 0},
        position: {x: 500, y: -325, z: 2000}
    };

    camera.position.z = positions.position.z;
    camera.position.y = positions.position.y;
    camera.position.x = positions.position.x;


    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    }

    controls.target.set(positions.lookAt.x, positions.lookAt.y, positions.lookAt.z);
    controls.update();
    scene.add(camera);
    addLight();

    var state = {
        work: true,
        start: function () {
            this.work = true;
            renderScene();
        },
        stop: function () {
            this.work = false;
        }
    };


    //renderScene();

    return {
        container: container,
        state: state,
        scene: scene,
        renderer: renderer,
        controls: controls,
        camera: camera,
        destroy: function () {
            state.stop();
            window.removeEventListener('resize', onWindowResize);
            //this.scene = scene = null;
        }
    };

    function renderScene() {
        if (state.work) {
            requestAnimationFrame(renderScene);
        }
        renderer.render(scene, camera);
    }

    function addLight() {

        var pos = {
            x: -2000,
            y: 1000,
            z: 1000
        };

        var ambLight = new THREE.AmbientLight(0xffffff);
        ambLight.color.setRGB(0.4, 0.4, 0.4);

        scene.add(ambLight);

        //var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        var dirLight = new THREE.SpotLight(0xffffff, 1);
        //dirLight.castShadow = true;

        //dirLight.castShadow = true;
        //dirLight.shadowCameraFov = 70;
        ////dirLight.shadowCameraVisible = false;
        //dirLight.shadowCameraNear = 25;
        //dirLight.shadowCameraFar = 20000;
        //dirLight.shadowCameraLeft = -5000;
        //dirLight.shadowCameraRight = 5000;
        //dirLight.shadowCameraTop = 5000;
        //dirLight.shadowCameraBottom = -5000;
        //dirLight.shadowMapWidth = 2048;
        //dirLight.shadowMapHeight = 2048;

        //dirLight.shadow.camera.near = 0;
        //dirLight.shadow.camera.far = 100000;
        //
        //dirLight.shadow.camera.left = -1000;
        //dirLight.shadow.camera.right = 1000;
        //dirLight.shadow.camera.top = 1000;
        //dirLight.shadow.camera.bottom = -1000;

        //dirLight.shadow.camera.visible = true;
        //scene.add(new THREE.DirectionalLightHelper(dirLight, 1000));
        //scene.add(new THREE.SpotLightHelper(dirLight, 1000));
        //scene.add(new THREE.CameraHelper( dirLight.shadow.camera ));
        dirLight.position.set(pos.x, pos.y, pos.z);

        scene.add(dirLight);
    }
}

$(document).ready(function () {
    $('body').on('click', '#acceptPresetItem', function () {
        $('.popup-3D').remove();
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ("controller=Cutting&action=accept_preset_item"),
            dataType: 'json',
            success: function (data) {
                showDetails();
                showDetailsInfo();
                $("fieldset#preset_details").empty();
                $("input#preset_item_count").val('1');
                $("select#choose-kromka-05").val('');
                $("select#choose-kromka-2").val('');
                $("select#choose-kromka").val('');
                // $("div#kromka_show").
                $("select#preset_item_list").val('0');
                $("div.preset_additional_functional").hide();
                $("div.preset_item_added").show();
                $("#preset_item_list").focus();
                getEdgesList();
            }
        });
    }).on('click', '#rejectPresetItem', function () {
        $('.popup-3D').remove();
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ("controller=Cutting&action=reject_preset_item"),
            dataType: 'json',
            success: function (data) {
                $("#preset_item_list").focus();
            }
        });
    });

    $("#kromkaAllAdd").change(function(){
        var index = $("#kromkaAllAdd").prop('selectedIndex');
        $('#kromkaTopAdd').prop('selectedIndex', index);
        $('#kromkaBottomAdd').prop('selectedIndex', index);
        $('#kromkaLeftAdd').prop('selectedIndex', index);
        $('#kromkaRightAdd').prop('selectedIndex', index);
    });

    $("#typeofdetail").change(function(){
        var type = $('#typeofdetail').find(":selected").attr('type');
        if (type == 0){
            $("#edgeGroupAdd").hide();
        } else if(type == 1){
            $("#edgeGroupAdd").show();
        }
    });
});

////////////////////////////////////////////////////////////


function addDetail(data) {
    var check = isEditDetail;
    if (checkDetailWidth() && checkDetailHeight() && checkDetailMultiplicity() && checkDetailsCount()) {
        var tht = 0, thb = 0, thl = 0, thr = 0;
        if ($('#typeofdetail').find(":selected").attr('type') == 1){
            if ($('#kromkaTopAdd').find(":selected").attr('num') != 0){
                tht = $('#kromkaTopAdd').find(":selected").attr('thikness');
            }
            if ($('#kromkaBottomAdd').find(":selected").attr('num') != 0){
                thb = $('#kromkaBottomAdd').find(":selected").attr('thikness');
            }
            if ($('#kromkaLeftAdd').find(":selected").attr('num') != 0){
                thl = $('#kromkaLeftAdd').find(":selected").attr('thikness');
            }
            if ($('#kromkaRightAdd').find(":selected").attr('num') != 0){
                thr = $('#kromkaRightAdd').find(":selected").attr('thikness');
            }
            $("#WidthId").val($("#WidthId").val() - thl - thr);
            $("#HeightId").val($("#HeightId").val() - tht - thb);
        }
        var form_data = $('#detailsForm').serialize() + '&key=' + detailKey + '&fast=' + 0;
        if (form_data.match(/texture/) == null) {
            form_data += "&texture=0";
        }
        if ($('#typeofdetail').find(":selected").attr('type') == 1){
            if ($('#kromkaTopAdd').find(":selected").attr('num') != 0){
                var id = $('#kromkaTopAdd').find(":selected").attr('kromkaid');
                form_data += "&kromkatop=" +id;
            }
            if ($('#kromkaBottomAdd').find(":selected").attr('num') != 0){
                var id = $('#kromkaBottomAdd').find(":selected").attr('kromkaid');
                form_data += "&kromkabottom=" +id;
            }
            if ($('#kromkaLeftAdd').find(":selected").attr('num') != 0){
                var id = $('#kromkaLeftAdd').find(":selected").attr('kromkaid');
                form_data += "&kromkaleft=" +id;
            }
            if ($('#kromkaRightAdd').find(":selected").attr('num') != 0){
                var id = $('#kromkaRightAdd').find(":selected").attr('kromkaid');
                form_data += "&kromkaright=" +id;
            }
        }
        var link = detailKey;
        sendDetail(form_data, function () {
            $("#WidthId").val('');

            // if ($("#HeightId").is('input')){
            //     $("#HeightId").val('');
            // }
            if (constructorId != 'stol' || (constructorId == 'stol' && materialType == 'compact')) {
                $("#HeightId").val('');
                if (!check) {
                    $("#CaptionId").focus();
                }
            }
            $('#row-' + link).effect("highlight", {}, 3000);
        });
        isEditDetail = false;
        /** Если минск и есть габариты, то отображаем их после редактировании */
        if ($("#typeofdetail").length){
            $("#typeofdetail").val(0);
            $("#typeofdetail").show();
        }

        var tabCut = document.getElementById('tabCut');
        if (form_data.indexOf('key=&') != -1 && tabCut.className.indexOf('whiteborder') != -1) { // это список
            document.getElementById('detailsAmount').innerHTML = ++detailsAmount;
            if (table != null) {
                showDetails();
            }
        }
        detailKey = '';
    }
}

function sendDetail(data, success) {
    if (typeof success === 'function') success();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ("controller=Cutting&action=add&" + data),
        dataType: 'json',
        success: function (in_data) {
            var table = document.getElementById('detailsTable');
            if (!data.match('fast=1')){
                if (table != null) {
                    showDetails();
                }
                showDetailsInfo();
                init();
            }
            // if (typeof success === 'function') success();
            // setLocation("?d=" + detailKey++);
            setUpOnPosition();
            if(in_data['warning']) {
                showWarningMessage(in_data['warning']);
            }
            if (table == null && data.indexOf('key=&') == -1 && data.indexOf('key=') != -1) {
                draw();
            }
        }
    });
}

function moveSelector(detail_key, btn) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'getAll'}),
        dataType: 'JSON',
        success: function (data) {
            $(btn).parent().find('#move_to_position').html('');
            data.forEach(function (key) {
                var option = key + 1;
                if (detail_key == key) {
                    $(btn).parent().find('#move_to_position').append('<option value=' + key + ' selected>' + option + '</option>')
                } else {
                    $(btn).parent().find('#move_to_position').append('<option value=' + key + '>' + option + '</option>')
                }
            });
            HideIfBlur($(btn).parent().find('#move_to_position'));
        }
    });
}

function moveDetail(detail_key, select) {
    $('span.selectable').text(0 + " деталей.");
    $('span.selectable').css("display", "none");
    $(select).hide(300);
    var move_from = detail_key;
    var move_to = $(select).parent().find('#move_to_position').val();
    //console.log(move_from, move_to);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'moveDetail', move_from: move_from, move_to: move_to}),
        dataType: 'json',
        success: function (data) {
            $.when(showDetails(), showDetailsInfo()).then(function () {
                $('#row-' + move_to).effect("highlight", {}, 3000);
            });
            //setTimeout(function(){
            //    $('#row-' + move_to).effect("highlight", {}, 3000);
            //}, 500)
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

function showCopyDetailQestion(detail_key, target) {
    HideIfBlur($(target).parent().find('#copyOption'));
}
function copyDetail(detail_key, flip) {
    $('span.selectable').text( 0 + " деталей.");
    $('span.selectable').css("display", "none");
    flip = flip || '';
    //console.log(detail_key, flip);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'copy', key: detail_key, flip: flip}),
        dataType: 'json',
        success: function (new_detail_key) {
            //console.log(new_detail_key);
            if (new_detail_key['warning']){
                showWarningMessage(new_detail_key['warning']);
            } else{
                $.when(showDetails(), showDetailsInfo()).then(function () {
                    $('#row-' + new_detail_key).effect("highlight", {}, 3000);
                });
            }
            //showDetails();
            //showDetailsInfo();
            //setTimeout(function(){
            //    $('#row-' + new_detail_key).effect("highlight", {}, 3000);
            //}, 500)
        },
        complete: function () {
            if (document.getElementById('tabCut').className.indexOf('whiteborder') != -1) {
                document.getElementById('detailsAmount').innerHTML = ++detailsAmount;
            }
        }
    });
}
function delDetail(detail_key) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'del', key: detail_key}),
        dataType: 'json',
        success: function (in_data) {
            showDetails();
            showDetailsInfo();
            if(in_data['warning']) {
                showWarningMessage(in_data['warning']);
            }
        }
    });
    document.getElementById('detailsAmount').innerHTML = --detailsAmount;
    if (detailsAmount === 0) document.getElementById('detailsAmount').innerHTML = '';
    resetModal('modal1');
    detailKey='';
    updateEdgesList();
}

$("#sel-change-details-quantity").change(function(){
    var cDQselectValue = parseFloat($('#change-details-quantity-div').find('select').val());
    switch (cDQselectValue){
        case 0:
            $("#change-details-quantity-text").hide();
            break;
        case 1:
            $("#change-details-quantity-text").show();
            break;
        case 2:
            $("#change-details-quantity-text").show();
            break;
    }
});

function changeDetailsQuantityIncDec(){
    var cDQselectValue = parseFloat($('#change-details-quantity-div').find('select').val());
    var cDQinputValue = parseFloat($('#change-details-quantity-div').find('input').val());
    var detail_keys = getSelectedDetails();
    var data;
    if(!Number.isInteger(cDQinputValue)){
        return showErrorMessage(LANG['CHISLO-MUST-BE-TSELIM']);
    } else{
        switch (cDQselectValue){
            case 0:
                data = {controller: 'Cutting', action: 'changeDetailsQuantity', keys: detail_keys, quantity: cDQinputValue}; 
                break;
            case 1:
                data = {controller: 'Cutting', action: 'incDetsCount', keys: detail_keys, multiple: cDQinputValue}; 
                break;
            case 2:
                data = {controller: 'Cutting', action: 'decDetsCount', keys: detail_keys, reduce: cDQinputValue};
                break;
        }
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: data,
            dataType: 'json',
            success: function () {
                showDetails();
                showDetailsInfo();
                $('#change-details-quantity-div').find('select').val(0);
                $('#change-details-quantity-div').find('input').val('');
            }
        });
    }
}

function changeHolesDiam() {
    //if (confirm("На выбранных деталях будет изменен диаметр отверстий. Продолжить?")) {
    var area = $('#change-holes-diam-area').val();
    var detail_keys = getSelectedDetails();
    var change_from = $('#change-holes-diam-from').val();
    var change_to = $('#change-holes-diam-to').val();
//console.log(detail_keys, change_from, change_to);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Cutting',
            action: 'changeHolesDiam',
            area: area,
            keys: detail_keys,
            change_from: change_from,
            change_to: change_to
        }),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            showDetails();
            showDetailsInfo();
            $('#change-holes-diam-area').val(LANG['NOT-CHOOSED']);
            $('#change-holes-diam-to').empty();
            $('#change-holes-diam-from').empty();
        }
    });
    //}
}


function changeHolesDepth() {
    var area = $('#change-holes-depth-area').val();
    var detail_keys = getSelectedDetails();
    var select_diam = $('#select-holes-diam').val();
    var change_from = $('#change-holes-depth-from').val().replace(',', '.');
    var change_to = $('#change-holes-depth-to').val().replace(',', '.');
    //if (confirm("На выбранных деталях будет изменена глубина отверстий. Продолжить?")) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Cutting',
            action: 'changeHolesDepth',
            area: area,
            keys: detail_keys,
            select_diam: select_diam,
            change_from: change_from,
            change_to: change_to
        }),
        dataType: 'JSON',
        success: function (data) {
            //console.log(data);
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            }
            $('#change-holes-depth-area').val(LANG['NOT-CHOOSED']);
            $('#select-holes-diam').val(LANG['NOT-CHOOSED']);
            $('#change-holes-depth-from').val('');
            $('#change-holes-depth-to').val('');
            $('#change-holes-depth-from').parent().hide();
            $('#change-holes-depth-to').parent().hide();
            $('#select-holes-diam').parent().hide();
            $('#change-holes-depth-submit').addClass('disabled');
            showDetails();
            showDetailsInfo();

        }
    });
    //}
}

function delDetails(detail_keys) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'dels', keys: detail_keys}),
        dataType: 'json',
        success: function () {
            showDetails();
            showDetailsInfo();
            updateEdgesList();
        },
        complete: function(){
            setTimeout(() => {
                detailsAmount = Number($('#detailsTable tr[id^="row-"]').length);
                document.getElementById('detailsAmount').innerHTML = (detailsAmount === 0) ? '' : detailsAmount;
            }, 500);
        }
    });
}
function newTopPanelEdit(title,form){
    $('#modal1 .topmodal .madalText').html('');
    $('#modal1 .topmodal .madalText').text(LANG['EDIT-DETAIL'])
    $('#modal1').css("left",sessionStorage.getItem('modal-left')+"px");
    $('#modal1').css("top",sessionStorage.getItem('modal-top')+"px");
    if(active_tab!=$('#modal1').attr('data-id')) {
        var position2 = $('#'+ active_tab).position();
        if (position2!= undefined && position2.left != Number("-900") && position2.left > 0) {
            sessionStorage.setItem("modal-left", position2.left);
            sessionStorage.setItem("modal-top", position2.top);
        }
        $('#' + active_tab).css("display","none");
        $('*[data-id="'+ active_tab + '"]').removeClass('active');
        active_tab = $('#modal1').attr('data-id');
    }
    $('#modal1').css("display","block");
    $("#addButton").val(LANG['SAVE']);
}
function editDetail(detail_key, target) {
    //console.log($(target).offset().top);
    isEditDetail = true;
    /** Если минск и есть габариты, то скрываем их при редактировании */
    if ($("#typeofdetail").length){
        $("#typeofdetail").val(0);
        $("#typeofdetail").hide();
        $("#edgeGroupAdd").hide();
    }
    $('span.selectable').text(0 + " деталей.");
    $('span.selectable').css("display", "detailsForm");
    newTopPanelEdit(LANG['EDIT-DETAIL'],'detailsForm');
    // showTopFormForEdit('panel-cutting', 'detailsForm', null, null, $(target).offset().top);
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'getDetail', key: detail_key}),
        dataType: 'json',
        success: function (data) {
            detailKey = data['key'];
            init();
            $("#CaptionId").val(data['caption']);
            $("#WidthId").val(data['width']);
            $("#HeightId").val(data['height']);
            $("#MultiplicityId").val(data['multiplicity']);
            $("#CountId").val(data['count']);
            $("#textureid").val(data['texture']);
            if (!data.texture) {
                $("#TextureId").prop("checked", "");
                $("#TextureId").parent().find('div')[0].className = 'input_mask';
            } else {
                $("#TextureId").prop("checked", true);
                $("#TextureId").parent().find('div')[0].className = 'input_mask input_mask_checked';
            }

            //$('#MultiplicityId').removeAttr("disabled");
            //$('#CountId').removeAttr("disabled");

            // console.log(detailKey);
        }
    });
}
// src="script.php";
function setLocation(curLoc) {
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch (e) {
    }
    location.hash = '#' + curLoc;
}


function setUpOnPosition() {
    var lastEditedDetailRowId = parseInt(sessionStorage.getItem('lastEditedDetailRowId'));
    if (Number.isInteger(lastEditedDetailRowId) && scrollingToActual) {
        setTimeout(() => {
            var lastEditedDetailRow = $('#row-' + lastEditedDetailRowId),
                $detailTabel = $('#details-tabel'),
                rowTop = lastEditedDetailRow.offset().top,
                tableTop = $detailTabel.offset().top;

            $.when(
                $detailTabel.animate({
                    scrollTop: (rowTop - tableTop),
                })
            ).then(() => {
                lastEditedDetailRow.effect('highlight', 1700);
                sessionStorage.removeItem('lastEditedDetailRowId');
            });
        }, 1000);
    }
    // if (window.location.search.substr(1) != '' && scrollingToActual) {
    //     //console.log(scrollToLast);
    //     var top = $('#row-' + window.location.search.substr(1)).offset().top;
    //     $("body:not(:animated)").animate({ scrollTop: top }, 1000);
    //     $("html").animate({ scrollTop: top }, 500);
    // }


}

function rotateDetail(dKey) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'rotateDetail', detail_key: dKey}),
        success: function (data) {
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                showDetails();
            }
        }
    });
}

function rotateSelectedDetails(angle) {
    // console.log(angle);
    var detail_keys = getSelectedDetails();
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'rotateDetails', detail_keys: detail_keys, angle: angle}),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                showDetails();
                showDetailsInfo();
            }
        }
    });


}

function implodeSelected(detail_keys) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "system/controllers/JsonController.php",
        data: {'controller' : 'Ajax', 'action': 'implodeGroup', detail_keys: detail_keys},
        dataType: 'json',
        success: function (data) {
            CloseWait();
            if(data == true){
                window.location.reload();
            }else{
                showErrorMessage(LANG['OBJEDINENIT-ERROR']);
            }
        }
    });
}

function removeAdditionalProcessing() {
    var detail_keys = getSelectedDetails();
    var typeOfRemove = $('#remove-additional-processing-sel').find(":selected").val();
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'remAdditProc', detail_keys: detail_keys, typeOfRemove:typeOfRemove}),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                showDetails();
                showDetailsInfo();
            }
        }
    });
    $('#detailsActions').val('').change();
}

function flipOperations(dKey, mode, onSide) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'flipOperations', detail_key: dKey, mode: mode, onSide: onSide}),
        success: function (data) {
            CloseWait();
            if (data.type == 'error') {
                showErrorMessage(data.msg);
            } else {
                showDetails();
            }
        }
    });
}
function selectAllDetails() {
    var span = $('span.selectable');
    var this_int = $('input[id^=Detail-]').length;

    if ($('#AllDetails').prop('checked')) {
        $('input[id^=Detail-]').prop('checked', true);
        // this_int = -1;
        span.val(this_int);
//        console.log(this_int);
    } else {
        $('input[id^=Detail-]').prop('checked', false);
        this_int = 0;
        span.val(0);
//        console.log(this_int);
    }

    if (this_int > 0) {
        span.css('display', 'inline-block');
        $("#detailsActions").addClass("Move");
//         if (this_int % 10 == 1 && this_int != 11) {
//             span.text(this_int + " деталь.");
// //            console.log(span.text());
//         } else
        if (this_int > 1 && this_int < 5) {
            span.text(this_int + " детали.");
//            console.log(span.text());
        } else {
            span.text(this_int + " деталей.");
//            console.log(span.text());
        }
    } else {
        span.css('display', 'none');
        $("#detailsActions").removeClass("Move");
        span.text(this_int + " деталей");
    }

    $('input[id^=Detail-]').click(function () {
        $('#AllDetails').prop('checked', false);
        checkboxMaskUpdate('th');
    });
    //main.js
    checkboxMaskUpdate('th');
    checkboxMaskUpdate('td');
}

function getSelectedDetails() {
    var keys = [];
    $('input[id^=Detail-]:checked').each(function () {
        keys.push($(this).val());
    });
    return keys;
}
function showDetailsList() {
    return $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'count'}),
        success: function (data) {
            if (data > 0) {
                init();
                $("#details-list").show();
            } else {
//                $("#details-list").hide();
//                $('#change_table_mode').click();
            }
        }
    });
}

/** typeLoad - тип отображения загрузки */
function showDetails(typeLoad = 0) {
    return $.ajax({
        url: "/service/system/views/cutting/inc/tableDetails.php",
        dataType: "html",
        beforeSend: function () {
            if (typeLoad == 0){
                ShowWait();
            } else if(typeLoad == 1){
                $('#save-loading').show();
            }     
        },
        success: function (data) {
            $("#details-tabel").html(data);
            var table = document.getElementById('detailsTable');
            if (table != null) {
                initLazyLoad();
                sortTable('detailsTable', $('#detailsTableSortColumn').val(), $('#detailsTableSortDirection').val());
            }
//            console.log(data);
            eventOnChange('cutting');
            //main.js
            checkboxMask('th');
            checkboxMask('td');
//            if (data.length > 0) {
            $('#details-list').addClass('centertable');
            //console.log("added class centertable");
            $('#cutting').addClass('side');
            $('.boxheader').addClass('sided');
            //console.log("added side");
            var boxes = $('.boxmain');
            // for (var i = 0; i<boxes.length; i++){
            //     if ($(boxes[i]).attr('id')!='preset_item_box'){
            //         $(boxes[i]).slideUp();
            //     }
            // }
//                    //console.log('added display');
//            } else {
//                $('#details-list').removeClass('centertable');
//                $('.boxmain').slideDown('slow');
//            }
            // $('#preset_item_box').css({display: 'block'});
            if (typeLoad == 0){
                CloseWait();
            } else if(typeLoad == 1){
                $('#save-loading').hide();
            }
        }
    });

}


function showDetailsInfo() {
    var def = $.Deferred();
    var p = $.ajax({
        url: "/service/system/views/cutting/inc/info.php",
        dataType: "html",
        success: function (data) {
            $("#details-info").html(data);
        }
    });
    //updateMenu();
    //showDetailsList();
    console.log('showDetailsInfo');
    $.when(p, updateMenu(), showDetailsList()).then(function () {
        def.resolve();
    });
    return def.promise();
}
//sync
function getDetails() {
    return JSON.parse($.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'getDetails'}),
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
}

//async
function processDetails(callback) {
    if (typeof callback == 'function') {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Cutting', action: 'getDetails'}),
            context: document.body,
            dataType: 'json',
            success: callback
        });
    }
}
function getEdgesUsedArticles(ignoreNotExist) {
    return JSON.parse($.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Edges', action: 'getUsedArticles', ignoreNotExist: ignoreNotExist}),
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
}
function getEdgesList() {
//    if (edgesListCash !== null) {
//        return edgesListCash;
//    } else {

    edgesListCash = JSON.parse($.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getEdgeList'}),
        context: document.body,
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
    return edgesListCash;
//    }

}

function proccessEdgesList(callback, filter) {
    if (edgesListCash !== null) {
        var options = typeof filter == 'function' ? filter(edgesListCash) : edgesListCash;
        callback(options);
    } else {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({controller: 'Additives', action: 'getEdgeList'}),
            context: document.body,
            dataType: 'json',
            success: function (data) {
                edgesListCash = data;
                var options = typeof filter == 'function' ? filter(edgesListCash) : edgesListCash;
                //var options = [{
                //    value: 0,
                //    text: 'нет',
                //    thickness : 0,
                //    idx : 0
                //}];
                //var num = 1;
                //for (var key in data) {
                //    options.push({
                //        value: data[key]['guid'],
                //        text: data[key]['title'],
                //        visible : data[key]['thickness'],
                //        idx : num
                //    });
                //    num++;
                //}
                callback(options);
            }
        });
    }


    function convert(data) {
        var options = [{
            value: 0,
            text: LANG['NO-S'],
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
    }
}

//function setEdgeOperations(dKey, top, bottom, left, right, callback) {
//    $.ajax({
//        type: "POST",
//        url: "/service/system/controllers/AdditivesController.php",
//        dataType: 'json',
//        data: ({action: 'setDetailKromki',
//            detail_key: dKey,
//            kromkaLeft: left,
//            kromkaTop: top,
//            kromkaRight: right,
//            kromkaBottom: bottom,
//        }),
//        success: function (data) {
//            showDetails();
//            if(typeof callback == 'function') callback(data);
//        }
//    });
//}

function getAllEdgesCuts(){
    out_data = JSON.parse($.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getAllEdgeCuts'}),
        context: document.body,
        global: false,
        async: false,
        success: function(data) {
            return data;
        }
    }).responseText);
    return out_data;
}

function getEdgesCuts(detail_key){
    out_data = JSON.parse($.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getEdgeCuts', detail_key: detail_key}),
        context: document.body,
        global: false,
        async: false,
        success: function(data) {
            return data;
        }
    }).responseText);
    return out_data;
}

function setEdgeOperations(data, callback) {
    var cuts = getEdgesCuts(data.key)[0];
    var sendData = {
        controller: 'Additives',
        action: 'setDetailKromki',
        detail_key: data.key,
        kromkaLeft: data.kLeft,
        kromkaTop: data.kTop,
        kromkaRight: data.kRight,
        kromkaBottom: data.kBottom,
        srezLeft: data.sLeft,
        srezTop: data.sTop,
        srezRight: data.sRight,
        srezBottom: data.sBottom,
        cutTop: cuts.cTop,
        cutBottom: cuts.cBottom,
        cutLeft: cuts.cLeft,
        cutRight: cuts.cRight,
        forceStol: data.forceStol,
    };
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: sendData,
        success: function (data) {
            showDetails();
            if (typeof callback == 'function') callback(data);
        }
    });
}

// 1 получает список типов кромок, и заполняет select-ы
function setEdgeSelectors() {
    edges = getEdgesList();
    edgesUsedArticles = getEdgesUsedArticles();
    for (key in edges) {
        edgesList[edges[key]['guid']] = new Array(edges[key]['title'], edges[key]['thickness'], edges[key]['height'], edges[key]['number']);
    }
//    console.log(edgesList);

    setEdgeSelector("perimeter-kromka");
    // setEdgeSelector("import-kromka");
    // setEdgeSelector("import-kromka05", 0.5);
    // setEdgeSelector("import-kromka08", 0.8);
    setEdgeSelector("import-kromka1", '');
    // setEdgeSelector("import-kromka13", 1.3);
    // setEdgeSelector("import-kromka15", 1.5);
    // setEdgeSelector("import-kromka2", 2);
    setEdgeSelector("change-kromka-from");
    setEdgeSelector("choose-kromka-05", 0.5);
    setEdgeSelector("choose-kromka-2", 2);
    setEdgeSelector("choose-kromka");

    //setEdgeSelector("kromka-for-corner");

}
function setEdgeSelector(selectId, edgeThickness, edgeGUID) {
    var objSel = document.getElementById(selectId);
    var eThickness = edgeThickness || 0;
    var edgeGUID = edgeGUID || 0;
    if (objSel) {
        objSel.options.length = 0;
        objSel.options[0] = new Option(LANG['NOT-CHOOSED'], 0);
        var i = 1;

        if (selectId == "change-kromka-from") {

            for (var key in edgesUsedArticles) {

                objSel.options[i] = new Option(i + '. ' + edgesUsedArticles[key], key);
                i++;
            }
        } else {
            for (var key in edges) {
                skip_option = false;

                if (eThickness > 0 && edges[key]['thickness'] != eThickness) {
                    if (!(edges[key]['thickness'] <= 0.6 && eThickness <= 0.6)) {
                        skip_option = true;
                    }
                }

                if (edgeGUID > 0 && edges[key]['guid'] == edgeGUID) {
                    skip_option = true;
                }

                var num = constructorId == 'dsp' ? edges[key]['number'] : i + '. ';
                if (!skip_option) {
                    objSel.options[i] = new Option(num + edges[key]['title'], edges[key]['guid']);
                    i++;
                }


            }
        }

    }
}
function filterEdges(filtrate, selectId, edgeGUID) {
    var eThickness = edgesList[edgeGUID] ? edgesList[edgeGUID][1] : 0;
    if (filtrate) {
        setEdgeSelector(selectId, eThickness, edgeGUID);
    } else {
        setEdgeSelector(selectId, 0, edgeGUID);
    }

}


// function addEdgeSelectorForNightStand(opts){
//     if (opts) {
//         var thick = opts.thickness > 0 ? opts.thickness : '';
//         var id = !opts.id ? thick.toString().replace('.', '') : opts.id;
//         var clear = opts.clear;
//         var button = opts.button;
//     } else {
//         var count = $('#import-kromka-container select').length + 1;
//         var id = count > 0 ? count : '';
//         var thick = '';
//     }
//     var selector = [
//         '<div class="col-lg-5 col-md-5 col-sd-5 col-xs-5">',
//         '<label for="choose-kromka-05" class="control-label">Кромка 0.5мм:</label>',
//         '</div>',
//
//         '<div class="col-lg-6 col-md-6 col-sd-6 col-xs-6">',
//         '<select id="choose-kromka-05" class="form-control" name="kromka-05" tabindex="12">',
//
//         '</select>',
//         '</div>',
//         '<div class="col-lg-5 col-md-5 col-sd-5 col-xs-5">',
//         '<label for="choose-kromka-2" class="control-label">Кромка 2мм:</label>',
//         '</div>',
//         '<div class="col-lg-6 col-md-6 col-sd-6 col-xs-6">',
//         '<select id="choose-kromka-2" class="form-control" name="kromka-2" tabindex="13">',
//
//         '</select>',
//         '</div>'
//     ].join('\r\n');
//     var add_button = [
//         '<div class="col-md-12"><button style="margin-bottom: 10px;width: 100%;" class="btn btn-default" onclick="addEdgeSelectorForNightStand(); return false;">',
//         'Добавить кромку',
//         '</button></div>',
//     ].join('\r\n');
//     if (clear) {
//         $('#kromka_show').html('');
//     }
//     if (button) {
//         $('#import-kromka-container').append(add_button);
//     }
//     $('#kromka_show').append(selector);
//     setEdgeSelector('choose_kromka-05' + id, 0.5);
//     setEdgeSelector('choose_kromka-05' + id, 2);
// }
function addEdgeSelectorForImport(opts) {
    if (opts) {
        var thick = opts.thickness > 0 ? opts.thickness : '';
        var id = !opts.id ? thick.toString().replace('.', '') : opts.id;
        var clear = opts.clear;
        var button = opts.button;
        var info = opts.info;
    } else {
        var count = $('#import-kromka-container select').length + 1;
        var id = count > 0 ? count : '';
        var thick = '';
    }
    if(!id) id = 1;
    var selector = [
        '<div id="import-kromka' + id + '-div" class="form-group">',
        '<div class="inputHeader">',
        '<label for="import-kromka' + id + '" class="kromochka">'+LANG['KROM'] + (thick > 0 ? ' ' + thick : id != '' ? ' ' + id : '') + '</label>',
        '</div>',
        '<div>',
        '<select   id="import-kromka' + id + '" name="import-kromka' + id + '" class="form-control input-sm input-smNew"></select>',
        '</div>',
        '</div>',
    ].join('\r\n');
    var add_button = [
        '<div class="width100"><button style="margin:0px 0px 25px -10px;\n' +
        '    width: 254px!important;\n' +
        '    height: 32px;" class="Modalbtn" onclick="addEdgeSelectorForImport(); return false;">',
        'Добавить кромку',
        '</button></div>',
    ].join('\r\n');
    if (clear) {
        $('#import-kromka-container').html('');
    }
    if(info){
        var importExel = document.getElementById('import-kromka-container');
        if(importExel) {
            importExel.innerHTML = '<a href="/service/doc/files/viyar.xls" style="padding: 0px 0px 20px 20px;display: block;">'+LANG['DOWNLOAD-SHABLON-PILNIH-PROGRAMS-EXEL']+'</a>';
            importExel.innerHTML += '<a href="/service/doc/files/viyar_form.xlsx" style="padding: 0px 0px 20px 20px;display: block;">'+LANG['DOWNLOAD-SHABLON-GABARIT-PROGRAMS-EXEL']+'</a>';
        }
    }
    if (button) {
        $('#import-kromka-container').append(add_button);
    }
    if(!opts || !opts.non_add) {
        $('#import-kromka-container').append(selector);
        setEdgeSelector('import-kromka' + id, thick);
    }
}
function setEdgeOperationsForDetail(detail_key, edge_id) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'setEdgeOperationsOnDetail', key: detail_key, edge: edge_id}),
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}
function setEdgeOperationsForDetails(keys, edge_id) {
    //if (confirm("На выбранных деталях будет заменена обработка торцов. Продолжить?")) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'setEdgeOperationsOnDetails', 'keys[]': keys, edge: edge_id}),
        success: function () {
            showDetails();
            showDetailsInfo();
            //получаем список кромок и заполняем актуальными в доп действия 
            setEdgeSelectors();
            CloseWait();
        }
    });
    $('#detailsActions').val('').change();
    //}
}
function setEdgeOperationsForSelectedDetails() {
    setEdgeOperationsForDetails(
        getSelectedDetails(),
        $('#perimeter-kromka').val()
    );
    updateEdgesList();
}

function changeEdgesForDetail(detail_key, from_edge_id, to_edge_id) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Cutting',
            action: 'changeEdges',
            key: detail_key,
            from_edge_id: from_edge_id,
            to_edge_id: to_edge_id
        }),
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}
function changeEdgesForDetails(keys, from_edge_id, to_edge_id) {
    //if (confirm("На выбранных деталях будет заменена обработка торцов. Продолжить?")) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({
            controller: 'Cutting',
            action: 'changeEdges',
            'keys[]': keys,
            from_edge_id: from_edge_id,
            to_edge_id: to_edge_id
        }),
        success: function () {
            showDetails();
            showDetailsInfo();
            //получаем список кромок и заполняем актуальными в доп действия 
            setEdgeSelectors();
            CloseWait();
        }
    });
    $('#detailsActions').val('').change();
    //}
}
function changeEdgesForSelectedDetails() {
    changeEdgesForDetails(
        getSelectedDetails(),
        $('#change-kromka-from').val(),
        $('#change-kromka-to').val()
    );
    updateEdgesList();
}

function showChangeHolesDiamSelect() {
    // $('#change-holes-diam-submit').addClass('disabled');
    var objSelFrom = document.getElementById("change-holes-diam-from");
    var objSelTo = document.getElementById("change-holes-diam-to");
    objSelFrom.options.length = 0;
    objSelTo.options.length = 0;
    side = $('#change-holes-diam-area').val();
    setHoleDiam(side);
    setActualHoleDiam(side);
    $('#change-holes-diam-from').parent().show(300);
    $('#change-holes-diam-to').parent().show(300);
}

function showChangeHolesDepthSelect() {
    var objSel = document.getElementById("select-holes-diam");
    objSel.options.length = 0;
    side = $('#change-holes-depth-area').val();
    setHoleDiam(side);
    setActualHoleDiam(side);
    // $('#change-holes-depth-submit').hide();
    $('#select-holes-diam').parent().show(300);
}

function showChangeHolesDepthInput() {
    if ($('#change-holes-depth-area').val() != LANG['NOT-CHOOSED'] && $('#select-holes-diam').val() != LANG['NOT-CHOOSED']) {
        $('#change-holes-depth-from').parent().show(300);
        $('#change-holes-depth-to').parent().show(300);
    }
}

/**
 * Запись в селект значений диаметров отверстий, которые присутствуют на выбранных деталях
 *
 * @param side - поверхность (плоскость или торцы)
 */
function setActualHoleDiam(side) {
    var detail_keys = getSelectedDetails();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getActualHoleDiam', side: side, detail_keys: detail_keys}),
        async: false,
        dataType: 'json',
        success: function (data) {
            var objSelFrom = document.getElementById("change-holes-diam-from");
            objSelFrom.options.length = 0;
            objSelFrom.options[0] = new Option(LANG['NOT-CHOOSED']);
            objSelFrom.options[0].setAttribute('disabled', 'disabled');
            var i = 1;
            for (var key in data) {
                objSelFrom.options[i] = new Option(key + "мм", key);
                i++;
            }
        }
    });
}

/**
 * Запись в селекты предустановленных значений диаметров овтерстий, которые возможно наносить на производстве
 *
 * @param side - поверхность (плоскость или торцы)
 */
function setHoleDiam(side) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'getHoleDiam', side: side}),
        async: false,
        dataType: 'json',
        success: function (data) {
            //var objSelFrom = document.getElementById("change-holes-diam-from");
            var objSelTo = document.getElementById("change-holes-diam-to");
            var objSel = document.getElementById("select-holes-diam");
            //objSelFrom.options.length = 0;
            objSelTo.options.length = 0;
            objSel.options.length = 0;
            //objSelFrom.options[0] = new Option(LANG['NOT-CHOOSED']);
            //objSelFrom.options[0].setAttribute('disabled', 'disabled');
            objSelTo.options[0] = new Option(LANG['NOT-CHOOSED']);
            objSelTo.options[0].setAttribute('disabled', 'disabled');
            objSel.options[0] = new Option(LANG['NOT-CHOOSED']);
            objSel.options[0].setAttribute('disabled', 'disabled');
            var i = 1;
            for (var key in data) {
                //objSelFrom.options[i] = new Option(key, data[key]);
                objSelTo.options[i] = new Option(key, data[key]);
                objSel.options[i] = new Option(key, data[key]);
                i++;
            }
        }
    });
}

function setTextureOnDetail(detail_key, texture) {
    var texture = texture || 0;
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'setTextureOnDetail', key: detail_key, texture: Number(texture)}),
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}

function setTextureOnDetails(keys, texture) {
    var texture = texture || 0;
    //if (confirm("На выбранных деталях будет изменена значимость текстуры. Продолжить?")) {
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'setTextureOnDetails', 'keys[]': keys, texture: Number(texture)}),
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
    $('#detailsActions').val('').change();
    //}
}

function setTextureOnSelectedDetails() {
    setTextureOnDetails(
        getSelectedDetails(),
        $('#change-texture').prop('checked')
    );
}

function setGlueType(val) {
    if(val == 'LazerPur')
        showWarningMessage(LANG['FOR-ALLS-OBR-ON-DETAILS-STANDART']);
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Cutting', action: 'setGlueType', 'data': val}),
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}

function setStolCutsOnSelectedDetails(){
    var detail_keys = getSelectedDetails();
    var cut_top = Number($('#set_top_cuts').val());
    var cut_bottom = Number($('#set_bottom_cuts').val());
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'setStolCutsOnSelectedDetails', detail_keys: detail_keys, cutTop: cut_top, cutBottom: cut_bottom}),
        dataType: 'json',
        success: function (){
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}

function delStolCutsFromSelectedDetails(){
    var detail_keys = getSelectedDetails();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'delStolCutsFromSelectedDetails', detail_keys: detail_keys}),
        dataType: 'json',
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}

function setOdkOnSelectedDetails(){
    var data = {};
    var detail_keys = getSelectedDetails();
    data['odk'] = $('#odkForDetails').prop('checked');
    data['curvilinear'] = $('#curvilinearForDetails').prop('checked');
    data['odkFile'] = $('#odkFileForDetails').prop('checked');
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller: 'Additives', action: 'setOdkOnDetails', detail_keys: detail_keys, data: data}),
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
}

function setPurOnDetails() {
    detail_keys = getSelectedDetails();
    pur = $('#add-pur').prop('checked');
    ShowWait();
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: ({controller : 'Ajax', action: 'setPurOnDetails', detail_keys: detail_keys, pur: Number(pur)}),
        dataType: 'json',
        success: function () {
            showDetails();
            showDetailsInfo();
            CloseWait();
        }
    });
    $('#detailsActions').val('').change();

}

function goToAdditives(detail_key) {
    if (detail_key != -1){
        ShowWait();
        $.post("/service/system/controllers/JsonController.php", {
            'controller': 'Ajax',
            'action': 'setPage',
            'setPage': 'additives',
            'detail_key': Number(detail_key) + 1
        },
        function (data) {
            window.location = window.location;
            //console.log(data);
            // window.location.search = '?d=' + (Number(detail_key) + 1);
        });
    }
}




$(document).ready(function () {
    if (!document.getElementById('tabCut').classList.contains('whiteborder')) {
        return;
    }

    $.when(showDetails(), init(), setEdgeSelectors(), showDetailsInfo()).then(function () {
        setUpOnPosition();
    });

    //$('#update_user_info').click(function () {
    //    //console.log('hello');
    //    $.ajax({
    //        type: "POST",
    //        url: "/service/system/controllers/JsonController.php",
    //        data: ({controller: 'Cutting', action: 'updateUserInfo'}),
    //        dataType: 'json',
    //        success: function (data) {
    //            if (data) {
    //                var info = '';
    //                var infoBlock = $('div.user-info');
    //                if (data.name) {
    //                    info += '<p>Имя: ' + data.name + '</p>';
    //                }
    //                if (data.mail) {
    //                    info += '<p>Электронная почта: ' + data.mail + '</p>';
    //                }
    //                if (data.phone) {
    //                    info += '<p>Телефон: ' + data.phone + '</p>';
    //                }
    //                infoBlock.hide(300);
    //                infoBlock.html(info);
    //                infoBlock.show(300);
    //            }
    //        }
    //    });
    //})
});

var detailsDataFastTable = [];
var timer;
var allcuts = getAllEdgesCuts();
var detailCount = 0;
function sendDetailWithEdge(detailData, edgesData = null, timerTime = 2000, callback = null) {
    var match = false;
    if (timer != null) {
        clearTimeout(timer);
        timer = null;
    }
    if (edgesData) {
        //var cuts = getEdgesCuts(edgesData.key)[0];
        if (Object.entries(allcuts).length === 0){
            var emptyAllcuts = true;
        }
        if (allcuts.length <= edgesData.key + 1 || emptyAllcuts){
            var cuts = {cTop: '', cBottom: '', cLeft: '', cRight: ''};
        } else{
            var cuts = allcuts[edgesData.key];
        }
        var edgesParams = {
            controller: 'Additives',
            action: 'setDetailKromki',
            detail_key: edgesData.key,
            kromkaLeft: edgesData.kLeft,
            kromkaTop: edgesData.kTop,
            kromkaRight: edgesData.kRight,
            kromkaBottom: edgesData.kBottom,
            srezLeft: edgesData.sLeft,
            srezTop: edgesData.sTop,
            srezRight: edgesData.sRight,
            srezBottom: edgesData.sBottom,
            cutTop: cuts.cTop,
            cutBottom: cuts.cBottom,
            cutLeft: cuts.cLeft,
            cutRight: cuts.cRight,
            forceStol: edgesData.forceStol,
        };
    }

    if (detailData) {
        var sendData = {
            detail: detailData,
            edges: edgesParams
        };

        detailsDataFastTable.forEach(function(item, i){
            if (item['detail']['key'] == detailData['key']){
                if (edgesParams){
                    detailsDataFastTable[i] = sendData;
                } else{
                    detailsDataFastTable[i].detail = detailData;
                }
                match = true;
            }
        });

        if (!match){
            detailsDataFastTable.push(sendData);
            detailCount++;
        }
    }

    if (detailCount == 10){
        sendDataAfterTimer();
    } else{
        timer = setTimeout(sendDataAfterTimer, timerTime, callback);
    }
}

function sendDataAfterTimer(callback = null) {
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        dataType: 'json',
        data: {controller: 'Additives', action: 'addDetailWithEdge', detailsDataFastTable},
        async: true,
        success: function (in_data) {
            showDetails(1);
            showDetailsInfo();
            init();
            for (var i = 0; i < in_data.length; i++){
                if (typeof callback === 'function') callback(in_data[i]);
                setUpOnPosition();
                detailKey = '';
                var inDataDetail = in_data[i]['detail'];
                if (inDataDetail['warning']) {
                    showWarningMessage(inDataDetail['warning']);
                }
            }
            if (callback){
                callback();
            }
        }
    });
    detailsDataFastTable = [];
    detailCount = 0;
}
