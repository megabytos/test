define(function (require, exports, module) {
    var playing = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        custom_values: {
            color_face_active: false,
            color_rear_active: false,
            grinding_grain_copy_active: false,
            cover_grain_copy_active: false,
        },
        inputs: {
            // список полей ввода
            get add() {
                return document.getElementById('addPlaing');
            },

            get grinding_face() {
                return document.getElementById('grinding_face');
            },

            get grinding_rear() {
                return document.getElementById('grinding_rear');
            },

            get cover_face() {
                return document.getElementById('cover_face');
            },

            get cover_rear() {
                return document.getElementById('cover_rear');
            },

            get color_face() {
                return document.getElementById('color_face');
            },
            get color_rear() {
                return document.getElementById('color_rear');
            },

            get gallery_color() {
                return document.getElementById('gallery_color');
            },

            get label_color() {
                return document.getElementById('label_color');
            },

            get label_cover() {
                return document.getElementById('label_cover');
            },

            get color_grain_copy() {
                return document.getElementById('color_grain_copy');
            },

            get close_gallery() {
                return document.getElementById('close_gallery');
            },

            get item_face_color_block() {
                return document.getElementById('item_face_color_block');
            },

            get item_rear_color_block() {
                return document.getElementById('item_rear_color_block');
            },

            get img_face_block() {
                return document.getElementById('img_face_block');
            },

            get art_face_block() {
                return document.getElementById('art_face_block');
            },

            get name_face_block() {
                return document.getElementById('name_face_block');
            },

            get img_rear_block() {
                return document.getElementById('img_rear_block');
            },

            get art_rear_block() {
                return document.getElementById('art_rear_block');
            },

            get name_rear_block() {
                return document.getElementById('name_rear_block');
            },

            get color_face_value() {
                return document.getElementById('color_face_value');
            },

            get color_rear_value() {
                return document.getElementById('color_rear_value');
            },

            get grinding_grain_copy() {
                return document.getElementById('grinding_grain_copy');
            },


            get cover_grain_copy() {
                return document.getElementById('cover_grain_copy');
            },

            get cover() {
                return document.getElementById('cover');
            },

            get table() {
                return document.getElementById('additives-tbl-container-plays')
            },

        },
        methods: {
            grinding_grain_copy(changeValue = true){
                if (changeValue) {
                    playing.custom_values.grinding_grain_copy_active = (playing.custom_values.grinding_grain_copy_active) ? false : true;
                }
                if (playing.custom_values.grinding_grain_copy_active) {
                    playing.setval('grinding_rear', playing.getval('grinding_face'));
                    playing.disabled('grinding_rear', true);
                    playing.methods.grinding_rear();
                    $(playing.getinput('grinding_grain_copy')).css("background-color", "green");
                } else {
                    $(playing.getinput('grinding_grain_copy')).css("background-color", "transparent");
                    playing.disabled('grinding_rear', false);
                }
            },


            cover_grain_copy(changeValue = true){
                if (changeValue) {
                    playing.custom_values.cover_grain_copy_active = (playing.custom_values.cover_grain_copy_active) ? false : true;
                }
                if (playing.custom_values.cover_grain_copy_active) {
                    playing.setval('cover_rear', playing.getval('cover_face'));
                    playing.disabled('cover_rear', true);
                    $(playing.getinput('cover_grain_copy')).css("background-color", "green");
                    playing.methods.cover_rear();
                    if (Number(playing.getval('color_face_value'))) {
                        var art = $(playing.getinput('art_face_block')).text();
                        var color_name = playing.cache.params['wood'][art]['name'];
                        var color_code = playing.cache.params['wood'][art]['code'];
                        playing.functions.item_rear_change(null, art, color_name, color_code);
                    }

                } else {
                    $(playing.getinput('cover_grain_copy')).css("background-color", "transparent");
                    playing.disabled('cover_rear', false);
                }
            },

            grinding_face(e){
                var value = playing.getval('grinding_face');
                value = 1; //нет больше выбора шлифования
                if (!Number(value)) {
                    var items = document.getElementsByClassName('cover_block_face');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "none";
                    });
                    playing.hideinput('cover_grain_copy');
                    playing.hideinput('label_color');
                    playing.hideinput('label_cover');
                    playing.setval('cover_face', '0');
                } else {
                    var items = document.getElementsByClassName('cover_block_face');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "";
                    });
                    playing.showinput('cover_grain_copy');
                    playing.showinput('label_color');
                    playing.showinput('label_cover');
                }
                playing.methods.grinding_grain_copy(false);

            },

            grinding_rear(e){
                var value = playing.getval('grinding_rear');
                if (!Number(value)) {
                    var items = document.getElementsByClassName('cover_block_rear');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "none";
                    });
                    playing.hideinput('cover_grain_copy');
                    playing.hideinput('label_color');
                    playing.hideinput('label_cover');
                    playing.setval('cover_rear', '0');
                } else {
                    var items = document.getElementsByClassName('cover_block_rear');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "";
                    });
                    playing.showinput('cover_grain_copy');
                    playing.showinput('label_color');
                    playing.showinput('label_cover');
                }
            },


            // инвенты для полей ввода
            cover_face(e){
                var value = playing.getval('cover_face');
                if (value == 'color') {
                    playing.custom_values.color_face_active = true;
                    playing.disabled('color_face', false);
                    $(playing.getinput('color_face')).css('background-color', 'transparent');
                } else {
                    playing.custom_values.color_face_active = false;
                    playing.disabled('color_face', true);
                    var items = document.getElementsByClassName('item_face_color');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "none";
                    });
                    playing.hideinput('item_face_color_block');
                    playing.setval('color_face_value', 0);
                    $(playing.getinput('color_face')).css('background-color', 'darkgrey');
                }
                playing.methods.cover_grain_copy(false);
            },
            cover_rear(e){
                var value = playing.getval('cover_rear');
                if (value == 'color') {
                    playing.custom_values.color_rear_active = true;
                    playing.disabled('color_rear', playing.custom_values.cover_grain_copy_active);
                    $(playing.getinput('color_rear')).css('background-color', 'transparent');
                } else {
                    playing.custom_values.color_rear_active = false;
                    playing.disabled('color_rear', true);
                    var items = document.getElementsByClassName('item_rear_color');
                    Array.prototype.forEach.call(items, function (item) {
                        item.style.display = "none";
                    });
                    playing.hideinput('item_rear_color_block');
                    playing.setval('color_rear_value', 0);
                    $(playing.getinput('color_rear')).css('background-color', 'darkgrey');
                }
            },
            color_face(e){
                playing.showinput('gallery_color');
                var items_face = document.getElementsByClassName('item_face_color');
                Array.prototype.forEach.call(items_face, function (item) {
                    item.style.display = "";
                });

                var items_rear = document.getElementsByClassName('item_rear_color');
                Array.prototype.forEach.call(items_rear, function (item) {
                    item.style.display = "none";
                });

                if ($(playing.getinput('color_face')).attr('disabled') == 'disabled') {
                    $(playing.getinput('color_face')).css('background-color', 'darkgreen');
                } else {
                    $(playing.getinput('color_face')).css('background-color', 'transparent');
                }
            },
            color_rear(e){
                playing.showinput('gallery_color');
                var items_rear = document.getElementsByClassName('item_rear_color');
                Array.prototype.forEach.call(items_rear, function (item) {
                    item.style.display = "";
                });

                var items_face = document.getElementsByClassName('item_face_color');
                Array.prototype.forEach.call(items_face, function (item) {
                    item.style.display = "none";
                });

                if ($(playing.getinput('color_rear')).attr('disabled') == 'disabled') {
                    $(playing.getinput('color_rear')).css('background-color', 'darkgreen');
                } else {
                    $(playing.getinput('color_rear')).css('background-color', 'transparent');
                }
            },
            close_gallery(e){
                playing.hideinput('gallery_color');
            },
            add(e){
                var data = playing.functions.get_plaing_data();

                g_detail.setOperation(
                    'playing',
                    {
                        detail_key: detailKey,
                        data: data,
                    },
                    function (data) {
                        playing.functions.set_playing_data(data[0]);
                        setDetailDesc();
                        draw();
                        playing.functions.table();
                    }
                );
            },
        },
        functions: {
            // остальные функции
            get_plaing_data(){
                var playing_data = {
                    face: {
                        //grinding: playing.getval('grinding_face'),
                        cover: {
                            type: playing.getval('cover_face'),
                        },
                    },
                    rear: {
                        //grinding: playing.getval('grinding_rear'),
                        cover: {
                            type: playing.getval('cover_rear'),
                        },
                    },
                };
                if (playing_data['face']['cover']['type'] == 'oil' || playing_data['face']['cover']['type'] == 'varnish'){
                    playing_data['face']['grinding'] = 1;
                } else if (playing_data['face']['cover']['type'] == 'grinding_face'){
                    playing_data['face']['grinding'] = 1;
                    playing_data['face']['cover']['type'] = 0;
                } else{
                    playing_data['face']['grinding'] = 0;
                }
                if (playing_data['rear']['cover']['type'] == 'oil' || playing_data['face']['cover']['type'] == 'varnish'){
                    playing_data['rear']['grinding'] = 1;
                } else if (playing_data['rear']['cover']['type'] == 'grinding_face'){
                    playing_data['rear']['grinding'] = 1;
                    playing_data['rear']['cover']['type'] = 0;
                } else{
                    playing_data['rear']['grinding'] = 0;
                }

                if (playing_data['face']['cover']['type'] == "color") {
                    playing_data['face']['cover']['art'] = playing.getval('color_face_value');
                }
                if (playing_data['rear']['cover']['type'] == "color") {
                    playing_data['rear']['cover']['art'] = playing.getval('color_rear_value');
                }
                return playing_data;
            },
            set_playing_data(playing_data){
                grinding:playing.setval('grinding_face', playing_data['face']['grinding']);
                grinding:playing.setval('grinding_rear', playing_data['rear']['grinding']);
                grinding:playing.setval('cover_face', playing_data['face']['cover']['type']);
                grinding:playing.setval('cover_rear', playing_data['rear']['cover']['type']);
                if (playing_data['face']['grinding'] == 1 && playing_data['face']['cover']['type'] == 0){
                    grinding:playing.setval('cover_face', 'grinding_face');
                }
                if (playing_data['rear']['grinding'] == 1 && playing_data['rear']['cover']['type'] == 0){
                    grinding:playing.setval('cover_rear', 'grinding_face');
                }

                if (playing_data['face']['cover']['type'] == "color") {
                    playing.setval('color_face_value', playing_data['face']['cover']['art']);
                }

                if (playing_data['rear']['cover']['type'] == "color") {
                    playing.setval('color_rear_value', playing_data['rear']['cover']['art']);
                }

            },
            item_face_change(elem, art, color_name, color_code){
                if (elem) {
                    var art = $(elem).attr('art');
                    var color_name = $(elem).attr('color_name');
                    var color_code = $(elem).attr('color_code');
                }
                playing.showinput('item_face_color_block');
                $(playing.getinput('name_face_block')).text(color_name);
                $(playing.getinput('art_face_block')).text(art);
                $(playing.getinput('img_face_block')).css('background-color', color_code);
                playing.hideinput('gallery_color');
                playing.setval('color_face_value', art);
            },

            item_rear_change(elem, art, color_name, color_code){
                if (elem) {
                    var art = $(elem).attr('art');
                    var color_name = $(elem).attr('color_name');
                    var color_code = $(elem).attr('color_code');
                }
                playing.showinput('item_rear_color_block');
                $(playing.getinput('name_rear_block')).text(color_name);
                $(playing.getinput('art_rear_block')).text(art);
                $(playing.getinput('img_rear_block')).css('background-color', color_code);
                playing.hideinput('gallery_color');
                playing.setval('color_rear_value', art);
            },
            set_init_plays(data){
                playing.functions.set_playing_data(data['data_playing']);
                playing.methods.grinding_face();
                playing.methods.cover_face();
                playing.methods.cover_rear();

                if (data['data_playing']['face']['cover']['type'] == 'color' && Boolean(data['data_playing']['face']['cover']['art'])) {
                    var art = data['data_playing']['face']['cover']['art'];
                    var color_name = playing.cache.params['wood'][art]['name'];
                    var color_code = playing.cache.params['wood'][art]['code'];
                    playing.functions.item_face_change(null, art, color_name, color_code);
                }

                if (data['data_playing']['rear']['cover']['type'] == 'color' && Boolean(data['data_playing']['rear']['cover']['art'])) {
                    var art = data['data_playing']['rear']['cover']['art'];
                    var color_name = playing.cache.params['wood'][art]['name'];
                    var color_code = playing.cache.params['wood'][art]['code'];
                    playing.functions.item_rear_change(null, art, color_name, color_code);
                }
            },
            table() {
                $.ajax({
                    type: "POST",
                    url: "/service/system/views/additives/inc/tablePlays.php",
                    data: 'detail_key=' + detailKey + '&machineId=' + machine,
                    dataType: "html",
                    success: function (data) {
                        playing.showinput('table');
                        var table = playing.getinput('table');
                        table.innerHTML = data;
                    }
                });
                
            },
        },
        init(data, global_data){
            playing.cache.params = global_data.playing_data;
            var funcs = [];
            for (var key in  playing.cache.params['wood']) {
                playing.addInput('item_face_color_' + key, (function () {
                    return document.getElementById('item_face_color_' + this);
                }).bind(key));
                playing.methods['item_face_color_' + key] = function (e) {
                    playing.functions.item_face_change(this);
                    playing.methods.cover_grain_copy(false);
                };

                playing.addInput('item_rear_color_' + key, (function () {
                    return document.getElementById('item_rear_color_' + this);
                }).bind(key));
                playing.methods['item_rear_color_' + key] = function (e) {
                    playing.functions.item_rear_change(this);
                };
                playing.functions.set_init_plays(data);

            }

            playing.methods.grinding_grain_copy();
            playing.disabled('grinding_grain_copy', true);
            playing.methods.cover_grain_copy();
            playing.disabled('cover_grain_copy', true);

            playing.functions.table();
            playing.super();
        },
        reinit(data)
        {
            playing.functions.set_init_plays(data);
            playing.functions.table();
        }
    };

    return playing;
})
;