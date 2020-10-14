define(function (require, exports, module) {
    var edging = {
        // наследуюмся это обьекта Module переданный из additive.main.js
        '__proto__': module.config(),
        // перечисляем специфические свойства (переопределяем)
        customValues: {
            top_grain_copy_active: false,
            left_grain_copy_active: false,
            right_grain_copy_active: false,
            bottom_grain_copy_active: false,
            all_grain_copy_active: false,
        },
        inputs: {
            get stolcuts() {
                return document.getElementById('addStolCuts');
            },
            get del_stolcuts() {
                return document.getElementById('delStolCuts');
            },
            get top() {
                return document.getElementById('kromkaTop');
            },
            get bottom() {
                return document.getElementById('kromkaBottom');
            },
            get left() {
                return document.getElementById('kromkaLeft');
            },
            get right() {
                return document.getElementById('kromkaRight');
            },
            get all() {
                return document.getElementById('kromkaAll');

            },
            get allRear() {
                return document.getElementById('kromkaAllRear');
            },
            get srez_top() {
                return document.getElementById('srezTop');
            },
            get srez_bottom() {
                return document.getElementById('srezBottom');
            },
            get srez_left() {
                return document.getElementById('srezLeft');
            },
            get srez_right() {
                return document.getElementById('srezRight');
            },
            get srez_top_field() {
                return document.getElementById('srTop');
            },
            get srez_bottom_field() {
                return document.getElementById('srBottom');
            },
            get srez_left_field() {
                return document.getElementById('srLeft');
            },
            get srez_right_field() {
                return document.getElementById('srRight');
            },
            get svg_side_left() {
                return document.getElementById('svg_side_left');
            },
            get svg_side_right() {
                return document.getElementById('svg_side_rightr');
            },
            get svg_side_top() {
                return document.getElementById('svg_side_top');
            },
            get svg_side_bottom() {
                return document.getElementById('svg_side_bottom');
            },
            get chamfer45() {
                return document.getElementById('chamfer45');
            },
            get chamfer45Field() {
                return document.getElementById('chamfer45Field');
            },
        },
        methods: {
            stolcuts(e, force) {

                var top = (Number(edging.getval('cut_top'))) ? (Number(edging.getval('cut_top'))) : kromkaTopCut;
                var bottom = (Number(edging.getval('cut_bottom'))) ? (Number(edging.getval('cut_bottom'))) : kromkaBottomCut;

                g_detail.setOperation(
                    'stolcuts',
                    {
                        detail_key: detailKey,
                        cutTop: top,
                        cutBottom: bottom
                    },
                    function (data) {
                        var data = data[0];
                        edging.setval('cut_top', data['cutTop']);
                        edging.setval('cut_bottom', data['cutBottom']);
                        detailWidth = data['width'];
                        detailHeight = data['height'];
                        kromkaTopCut = Number(data['topCut']);
                        kromkaBottomCut = Number(data['bottomCut']);
                        setDetailDesc();
                        draw();
                    }
                );
            },
            del_stolcuts(e) {
                g_detail.setOperation(
                    'stolcuts',
                    {
                        detail_key: detailKey,
                        cutTop: 0,
                        cutBottom: 0
                    },
                    function (data) {
                        var data = data[0];
                        edging.setval('cut_top', data['cutTop']);
                        edging.setval('cut_bottom', data['cutBottom']);
                        detailWidth = data['width'];
                        detailHeight = data['height'];
                        setDetailDesc();
                        draw();
                        kromkaTopCut = Number(data['topCut']);
                        kromkaBottomCut = Number(data['bottomCut']);
                    }
                );
            },
            top_onFocus(){ edgeArt = edging.getval('top'); document.activeElement.blur();},
            left_onFocus(){edgeArt = edging.getval('left'); document.activeElement.blur();},
            right_onFocus(){edgeArt = edging.getval('right'); document.activeElement.blur();},
            bottom_onFocus(){edgeArt = edging.getval('bottom'); document.activeElement.blur();},
            all_onFocus(){
                edgeArt = [
                    edging.getval('top'),
                    edging.getval('right'),
                    edging.getval('left'),  
                    edging.getval('bottom')
                ];
                //сбрасываем фокус для возможности повторного нажатия
                document.activeElement.blur();
            },
            top(e) {
                if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                    edging.functions.set_kromka('top', e.target);
                } else {
                    var type_top_kromka = edging.getval('top');
                    if (Number(type_top_kromka) == 0) {
                        edging.hideinput('topFaceSection');
                        edging.setval('srez_top', 0);
                        if (materialType == 'compact' && edging.getval('topZrear') == 8) {
                            edging.setval('topZrear', 0.5);
                            edging.setval('topWrear', edging.getval('topZrear'));
                        }
                    } else {
                        edging.showinput('topFaceSection');
                    }

                    if (type_top_kromka == 'faska') {
                        if ((materialType == 'compact' && edging.getval('all') == '') ||
                            materialType == 'wood' || isMillAdditives) {
                            edging.showinput('faska_top_field_face');
                        }
                        if (materialType == 'compact' && edging.getval('topRear') == 'faska') edging.customValues.top_grain_copy_active = true;
                    } else {
                        edging.hideinput('faska_top_field_face');
                    }

                    if (type_top_kromka == 'radius') {
                        edging.showinput('radius_top_field_face');
                        edging.disabled('topRface', false);
                        if (materialType == 'compact') {
                            $('#topRface option[value="6"]').hide();
                            $('#topRface option[value="12"]').hide();
                        }
                    } else {
                        edging.hideinput('radius_top_field_face');
                    }

                    if (materialType == 'compact' && type_top_kromka == 'R2faska') {
                        edging.showinput('radius_top_field_face');
                        edging.disabled('topRface', true);
                    }

                    if (materialType == 'compact' && type_top_kromka == 'srez') {
                        edging.showinput('srez_top_field_face');
                        $('#srezTop option[value="0"]').hide();
                        if ( edging.getval('srez_top') == '-45') {
                            edging.setval('srez_top', -45);
                        } else {
                            edging.setval('srez_top', 45);
                        }
                    } else {
                        edging.hideinput('srez_top_field_face');
                    }

                    var value = edging.getval('top');
                    if (value == '0') {
                        edging.functions.clear_grain('top', 'face')
                    }

                    if (materialType == 'compact') {
                        $(edging.getinput('top')).change(function () {
                            edging.setval('all', '');
                            edging.hideinput('faska_all_field_face');

                            edging.setval('allRear', '');
                            edging.hideinput('faska_all_field_rear');
                        });
                    }

                    edging.functions.rectInterFace('top', 'face');
                    edging.methods.top_grain_copy(false);
                }
            },

            left(e) {
                if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                    edging.functions.set_kromka('left', e.target);
                } else {
                    var type_left_kromka = edging.getval('left');
                    if (Number(type_left_kromka) == 0) {
                        edging.hideinput('leftFaceSection');
                        edging.setval('srez_left', 0);
                        if (materialType == 'compact' && edging.getval('leftZrear') == 8) {
                            edging.setval('leftZrear', 0.5);
                            edging.setval('leftWrear', edging.getval('leftZrear'));
                        }
                    } else {
                        edging.showinput('leftFaceSection');
                    }

                    if (type_left_kromka == 'faska') {
                        if ((materialType == 'compact' && edging.getval('all') == '') ||
                            materialType == 'wood' || isMillAdditives) {
                            edging.showinput('faska_left_field_face');
                        }
                        if (materialType == 'compact' && edging.getval('leftRear') == 'faska') edging.customValues.left_grain_copy_active = true;
                    } else {
                        edging.hideinput('faska_left_field_face');
                    }

                    if (type_left_kromka == 'radius') {
                        edging.showinput('radius_left_field_face');
                        edging.disabled('leftRface', false);
                        if (materialType == 'compact') {
                            $('#leftRface option[value="6"]').hide();
                            $('#leftRface option[value="12"]').hide();
                        }
                    } else {

                        edging.hideinput('radius_left_field_face');
                    }

                    if (materialType == 'compact' && type_left_kromka == 'R2faska') {
                        edging.showinput('radius_left_field_face');
                        edging.disabled('leftRface', true);
                    }

                    if (materialType == 'compact' && type_left_kromka == 'srez') {
                        edging.showinput('srez_left_field_face');
                        $('#srezLeft option[value="0"]').hide();
                        if ( edging.getval('srez_left') == '-45') {
                            edging.setval('srez_left', -45);
                        } else {
                            edging.setval('srez_left', 45);
                        }
                    } else {
                        edging.hideinput('srez_left_field_face');
                    }

                    var value = edging.getval('left');
                    if (value == '0') {
                        edging.functions.clear_grain('left', 'face')
                    }

                    if (materialType == 'compact') {
                        $(edging.getinput('left')).change(function () {
                            edging.setval('all', '');
                            edging.hideinput('faska_all_field_face');

                            edging.setval('allRear', '');
                            edging.hideinput('faska_all_field_rear');
                        });
                    }

                    edging.functions.rectInterFace('left', 'face');
                    edging.methods.left_grain_copy(false);
                }
            },
            right(e) {
                if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                    edging.functions.set_kromka('right', e.target);
                } else {
                    var type_right_kromka = edging.getval('right');

                    if (Number(type_right_kromka) == 0) {
                        edging.hideinput('rightFaceSection');
                        edging.setval('srez_right', 0);
                        if (materialType == 'compact' && edging.getval('rightZrear') == 8) {
                            edging.setval('rightZrear', 0.5);
                            edging.setval('rightWrear', edging.getval('rightZrear'));
                        }
                    } else {
                        edging.showinput('rightFaceSection');
                    }

                    if (type_right_kromka == 'faska') {
                        if ((materialType == 'compact' && edging.getval('all') == '') ||
                            materialType == 'wood' || isMillAdditives) {
                            edging.showinput('faska_right_field_face');
                        }
                        if (materialType == 'compact' && edging.getval('rightRear') == 'faska') edging.customValues.right_grain_copy_active = true;
                    } else {
                        edging.hideinput('faska_right_field_face');
                    }

                    if (type_right_kromka == 'radius') {
                        edging.showinput('radius_right_field_face');
                        edging.disabled('rightRface', false);
                        if (materialType == 'compact') {
                            $('#rightRface option[value="6"]').hide();
                            $('#rightRface option[value="12"]').hide();
                        }
                    } else {
                        edging.hideinput('radius_right_field_face');
                    }

                    if (materialType == 'compact' && type_right_kromka == 'R2faska') {
                        edging.showinput('radius_right_field_face');
                        edging.disabled('rightRface', true);
                    }

                    if (materialType == 'compact' && type_right_kromka == 'srez') {
                        edging.showinput('srez_right_field_face');
                        $('#srezRight option[value="0"]').hide();
                        if ( edging.getval('srez_right') == '-45') {
                            edging.setval('srez_right', -45);
                        } else {
                            edging.setval('srez_right', 45);
                        }
                    } else {
                        edging.hideinput('srez_right_field_face');
                    }

                    var value = edging.getval('right');
                    if (value == '0') {
                        edging.functions.clear_grain('right', 'face')
                    }

                    if (materialType == 'compact') {
                        $(edging.getinput('right')).change(function () {
                            edging.setval('all', '');
                            edging.hideinput('faska_all_field_face');

                            edging.setval('allRear', '');
                            edging.hideinput('faska_all_field_rear');
                        });
                    }

                    edging.functions.rectInterFace('right', 'face');
                    edging.methods.right_grain_copy(false);
                }
            },
            bottom(e) {
                if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                    edging.functions.set_kromka('bottom', e.target);
                } else {
                    var type_bottom_kromka = edging.getval('bottom');

                    if (Number(type_bottom_kromka) == 0) {
                        edging.hideinput('bottomFaceSection');
                        edging.setval('srez_bottom', 0);
                        if (materialType == 'compact' && edging.getval('bottomZrear') == 8) {
                            edging.setval('bottomZrear', 0.5);
                            edging.setval('bottomWrear', edging.getval('bottomZrear'));
                        }
                    } else {
                        edging.showinput('bottomFaceSection');
                    }

                    if (type_bottom_kromka == 'faska') {
                        if ((materialType == 'compact' && edging.getval('all') == '') ||
                            materialType == 'wood' || isMillAdditives) {
                            edging.showinput('faska_bottom_field_face');
                        }
                        if (materialType == 'compact' && edging.getval('bottomRear') == 'faska') edging.customValues.bottom_grain_copy_active = true;
                    } else {
                        edging.hideinput('faska_bottom_field_face');
                    }

                    if (type_bottom_kromka == 'radius') {
                        edging.showinput('radius_bottom_field_face');
                        edging.disabled('bottomRface', false);
                        if (materialType == 'compact') {
                            $('#bottomRface option[value="6"]').hide();
                            $('#bottomRface option[value="12"]').hide();
                        }
                    } else {
                        edging.hideinput('radius_bottom_field_face');
                    }

                    if (materialType == 'compact' && type_bottom_kromka == 'R2faska') {
                        edging.showinput('radius_bottom_field_face');
                        edging.disabled('bottomRface', true);
                    }

                    if (materialType == 'compact' && type_bottom_kromka == 'srez') {
                        edging.showinput('srez_bottom_field_face');
                        $('#srezBottom option[value="0"]').hide();
                        if ( edging.getval('srez_bottom') == '-45') {
                            edging.setval('srez_bottom', -45);
                        } else {
                            edging.setval('srez_bottom', 45);
                        }
                    } else {
                        edging.hideinput('srez_bottom_field_face');
                    }

                    var value = edging.getval('bottom');
                    if (value == '0') {
                        edging.functions.clear_grain('bottom', 'face')
                    }

                    if (materialType == 'compact') {
                        $(edging.getinput('bottom')).change(function () {
                            edging.setval('all', '');
                            edging.hideinput('faska_all_field_face');

                            edging.setval('allRear', '');
                            edging.hideinput('faska_all_field_rear');
                        });
                    }

                    edging.functions.rectInterFace('bottom', 'face');
                    edging.methods.bottom_grain_copy(false);
                }
            },

            topRear(e) {
                var type_top_kromka = edging.getval('topRear');

                if (Number(type_top_kromka) == 0) {
                    edging.hideinput('topRearSection');
                    if (materialType == 'compact') {
                        $('#topZface option[value="8"]').hide();
                        if (edging.getval('topZface') == 8) {
                            edging.setval('topZface', 0.5);
                            edging.setval('topWface', edging.getval('topZface'));
                        }
                        if (edging.getval('top') == 'faska') {
                            edging.customValues.top_grain_copy_active = false;
                            $('#topZface option[value="11.5"]').show();
                        }
                    }
                } else {
                    edging.showinput('topRearSection');
                    $('#topZface option[value="8"]').show();
                }

                if (type_top_kromka == 'faska') {
                    if (edging.getval('allRear') == 0) edging.showinput('faska_top_field_rear');
                    if (materialType == 'compact') {
                        $('#topZface option[value="11.5"]').hide();
                        if (edging.getval('topZrear') == '') edging.setval('topZrear', '0.5');
                        edging.setval('topWrear', edging.getval('topZrear'));
                        if (edging.getval('top') == 0) {
                            $('#topZrear option[value="8"]').hide();
                            $('#topZrear option[value="2"]').show();
                            $('#topZrear option[value="0.5"]').show();
                            if (edging.getval('topZrear') == 0.5) edging.setval('topWrear', edging.getval('topZrear'));
                            $(edging.getinput('topZrear')).change(function () {
                                edging.setval('topZrear', edging.getval('topZrear'));
                                edging.setval('topWrear', edging.getval('topZrear'));
                            });
                        }
                        if (edging.getval('top') == 'faska') {
                            if (edging.getval('all') == '') edging.showinput('faska_top_field_face');
                            if (edging.getval('topZface') == 0.5) {
                                $('#topZrear option[value="2"]').hide();
                                $('#topZrear option[value="8"]').show();
                                $('#topZrear option[value="0.5"]').show();
                            }
                            if (edging.getval('topZface') == 2) {
                                if (edging.getval('topZrear') == 0.5) {
                                    edging.setval('topZrear', edging.getval('topZface'));
                                    edging.setval('topWrear', edging.getval('topZrear'));
                                }
                            }
                            if (edging.getval('topZface') == 11.5) {
                                edging.setval('topZface', 0.5);
                                $('#topZface option[value="11.5"]').hide();
                                edging.setval('topWface', edging.getval('topZface'));
                            }
                            if (edging.getval('topZface') == 0.5) {
                                $('#topZrear option[value="2"]').hide();
                            }
                        }
                    }
                } else {
                    edging.hideinput('faska_top_field_rear');
                }

                if (type_top_kromka == 'radius') {
                    edging.showinput('radius_top_field_rear');
                } else {
                    edging.hideinput('radius_top_field_rear');
                }

                if (materialType == 'compact' && type_top_kromka == 'R2faska') {
                    edging.showinput('faska_top_field_rear');
                    edging.disabled('topZrear', true);
                    edging.setval('topZrear', 9);
                    edging.setval('topWrear', 9);
                }

                if (materialType == 'compact') {
                    $(edging.getinput('topRear')).change(function () {
                        edging.setval('all', '');
                        edging.hideinput('faska_all_field_face');

                        edging.setval('allRear', '');
                        edging.hideinput('faska_all_field_rear');
                    });
                }

                var value = edging.getval('topRear');
                if (value == '0') {
                    edging.functions.clear_grain('top', 'rear')
                }
                edging.functions.rectInterFace('top', 'rear');
            },
            leftRear(e) {
                var type_left_kromka = edging.getval('leftRear');

                if (Number(type_left_kromka) == 0) {
                    edging.hideinput('leftRearSection');
                    if (materialType == 'compact') {
                        $('#leftZface option[value="8"]').hide();
                        if (edging.getval('leftZface') == 8) {
                            edging.setval('leftZface', 0.5);
                            edging.setval('leftWface', edging.getval('leftZface'));
                        }
                        if (edging.getval('left') == 'faska') {
                            edging.customValues.left_grain_copy_active = false;
                            $('#leftZface option[value="11.5"]').show();
                        }
                    }
                } else {
                    edging.showinput('leftRearSection');
                    $('#leftZface option[value="8"]').show();
                }

                if (type_left_kromka == 'faska') {
                    if (edging.getval('allRear') == 0) edging.showinput('faska_left_field_rear');
                    if (materialType == 'compact') {
                        $('#leftZface option[value="11.5"]').hide();
                        if (edging.getval('leftZrear') == '') edging.setval('leftZrear', '0.5');
                        edging.setval('leftWrear', edging.getval('leftZrear'));
                        if (edging.getval('left') == 0) {
                            $('#leftZrear option[value="8"]').hide();
                            $('#leftZrear option[value="2"]').show();
                            $('#leftZrear option[value="0.5"]').show();
                            if (edging.getval('leftZrear') == 0.5) edging.setval('leftWrear', edging.getval('leftZrear'));
                            $(edging.getinput('leftZrear')).change(function () {
                                edging.setval('leftZrear', edging.getval('leftZrear'));
                                edging.setval('leftWrear', edging.getval('leftZrear'));
                            });
                        }
                        if (edging.getval('left') == 'faska') {
                            if (edging.getval('all') == '') edging.showinput('faska_left_field_face');
                            if (edging.getval('leftZface') == 0.5) {
                                $('#leftZrear option[value="2"]').hide();
                                $('#leftZrear option[value="8"]').show();
                                $('#leftZrear option[value="0.5"]').show();
                            }
                            if (edging.getval('leftZface') == 2) {
                                if (edging.getval('leftZrear') == 0.5) {
                                    edging.setval('leftZrear', edging.getval('leftZface'));
                                    edging.setval('leftWrear', edging.getval('leftZrear'));
                                }
                            }
                            if (edging.getval('leftZface') == 11.5) {
                                edging.setval('leftZface', 0.5);
                                $('#leftZface option[value="11.5"]').hide();
                                edging.setval('leftWface', edging.getval('leftZface'));
                            }
                            if (edging.getval('leftZface') == 0.5) {
                                $('#leftZrear option[value="2"]').hide();
                            }
                        }
                    }
                } else {
                    edging.hideinput('faska_left_field_rear');
                }

                if (type_left_kromka == 'radius') {
                    edging.showinput('radius_left_field_rear');
                } else {
                    edging.hideinput('radius_left_field_rear');
                }

                if (materialType == 'compact' && type_left_kromka == 'R2faska') {
                    edging.showinput('faska_left_field_rear');
                    edging.disabled('leftZrear', true);
                    edging.setval('leftZrear', 9);
                    edging.setval('leftWrear', 9);
                }

                if (materialType == 'compact') {
                    $(edging.getinput('leftRear')).change(function () {
                        edging.setval('all', '');
                        edging.hideinput('faska_all_field_face');

                        edging.setval('allRear', '');
                        edging.hideinput('faska_all_field_rear');
                    });
                }

                var value = edging.getval('leftRear');
                if (value == '0') {
                    edging.functions.clear_grain('left', 'rear')
                }
                edging.functions.rectInterFace('left', 'rear');
            },
            rightRear(e) {
                var type_right_kromka = edging.getval('rightRear');
                if (Number(type_right_kromka) == 0) {
                    edging.hideinput('rightRearSection');
                    if (materialType == 'compact') {
                        $('#rightZface option[value="8"]').hide();
                        if (edging.getval('rightZface') == 8) {
                            edging.setval('rightZface', 0.5);
                            edging.setval('rightWface', edging.getval('rightZface'));
                        }
                        if (edging.getval('right') == 'faska') {
                            edging.customValues.right_grain_copy_active = false;
                            $('#rightZface option[value="11.5"]').show();
                        }
                    }
                } else {
                    edging.showinput('rightRearSection');
                    $('#rightZface option[value="8"]').show();
                }

                if (type_right_kromka == 'faska') {
                    if (edging.getval('allRear') == 0) edging.showinput('faska_right_field_rear');
                    if (materialType == 'compact') {
                        $('#rightZface option[value="11.5"]').hide();
                        if (edging.getval('rightZrear') == '') edging.setval('rightZrear', '0.5');
                        edging.setval('rightWrear', edging.getval('rightZrear'));
                        if (edging.getval('right') == 0) {
                            $('#rightZrear option[value="8"]').hide();
                            $('#rightZrear option[value="2"]').show();
                            $('#rightZrear option[value="0.5"]').show();
                            if (edging.getval('rightZrear') == 0.5) edging.setval('rightWrear', edging.getval('rightZrear'));
                            $(edging.getinput('rightZrear')).change(function () {
                                edging.setval('rightZrear', edging.getval('rightZrear'));
                                edging.setval('rightWrear', edging.getval('rightZrear'));
                            });
                        }
                        if (edging.getval('right') == 'faska') {
                            if (edging.getval('all') == '') edging.showinput('faska_right_field_face');
                            if (edging.getval('rightZface') == 0.5) {
                                $('#rightZrear option[value="2"]').hide();
                                $('#rightZrear option[value="8"]').show();
                                $('#rightZrear option[value="0.5"]').show();
                            }
                            if (edging.getval('rightZface') == 2) {
                                if (edging.getval('rightZrear') == 0.5) {
                                    edging.setval('rightZrear', edging.getval('rightZface'));
                                    edging.setval('rightWrear', edging.getval('rightZrear'));
                                }
                            }
                            if (edging.getval('rightZface') == 11.5) {
                                edging.setval('rightZface', 0.5);
                                $('#rightZface option[value="11.5"]').hide();
                                edging.setval('rightWface', edging.getval('rightZface'));
                            }
                            if (edging.getval('rightZface') == 0.5) {
                                $('#rightZrear option[value="2"]').hide();
                            }
                        }
                    }
                } else {
                    edging.hideinput('faska_right_field_rear');
                }

                if (type_right_kromka == 'radius') {
                    edging.showinput('radius_right_field_rear');
                } else {
                    edging.hideinput('radius_right_field_rear');
                }

                if (materialType == 'compact' && type_right_kromka == 'R2faska') {
                    edging.showinput('faska_right_field_rear');
                    edging.disabled('rightZrear', true);
                    edging.setval('rightZrear', 9);
                    edging.setval('rightWrear', 9);
                }

                if (materialType == 'compact') {
                    $(edging.getinput('rightRear')).change(function () {
                        edging.setval('all', '');
                        edging.hideinput('faska_all_field_face');

                        edging.setval('allRear', '');
                        edging.hideinput('faska_all_field_rear');
                    });
                }

                var value = edging.getval('rightRear');
                if (value == '0') {
                    edging.functions.clear_grain('right', 'rear')
                }
                edging.functions.rectInterFace('right', 'rear');
            },
            bottomRear(e) {
                var type_bottom_kromka = edging.getval('bottomRear');
                if (Number(type_bottom_kromka) == 0) {
                    edging.hideinput('bottomRearSection');
                    if (materialType == 'compact') {
                        $('#bottomZface option[value="8"]').hide();
                        if (edging.getval('bottomZface') == 8) {
                            edging.setval('bottomZface', 0.5);
                            edging.setval('bottomWface', edging.getval('bottomZface'));
                        }
                        if (edging.getval('bottom') == 'faska') {
                            edging.customValues.bottom_grain_copy_active = false;
                            $('#bottomZface option[value="11.5"]').show();
                        }
                    }
                } else {
                    edging.showinput('bottomRearSection');
                    $('#bottomZface option[value="8"]').show();
                }

                if (type_bottom_kromka == 'faska') {
                    if (edging.getval('allRear') == 0) edging.showinput('faska_bottom_field_rear');
                    if (materialType == 'compact') {
                        $('#bottomZface option[value="11.5"]').hide();
                        if (edging.getval('bottomZrear') == '') edging.setval('bottomZrear', '0.5');
                        edging.setval('bottomWrear', edging.getval('bottomZrear'));
                        if (edging.getval('bottom') == 0) {
                            $('#bottomZrear option[value="8"]').hide();
                            $('#bottomZrear option[value="2"]').show();
                            $('#bottomZrear option[value="0.5"]').show();
                            if (edging.getval('bottomZrear') == 0.5) edging.setval('bottomWrear', edging.getval('bottomZrear'));
                            $(edging.getinput('bottomZrear')).change(function () {
                                edging.setval('bottomZrear', edging.getval('bottomZrear'));
                                edging.setval('bottomWrear', edging.getval('bottomZrear'));
                            });
                        }
                        if (edging.getval('bottom') == 'faska') {
                            if (edging.getval('all') == '') edging.showinput('faska_bottom_field_face');
                            if (edging.getval('bottomZface') == 0.5) {
                                $('#bottomZrear option[value="2"]').hide();
                                $('#bottomZrear option[value="8"]').show();
                                $('#bottomZrear option[value="0.5"]').show();
                            }
                            if (edging.getval('bottomZface') == 2) {
                                if (edging.getval('bottomZrear') == 0.5) {
                                    edging.setval('bottomZrear', edging.getval('bottomZface'));
                                    edging.setval('bottomWrear', edging.getval('bottomZrear'));
                                }
                            }
                            if (edging.getval('bottomZface') == 11.5) {
                                edging.setval('bottomZface', 0.5);
                                $('#bottomZface option[value="11.5"]').hide();
                                edging.setval('bottomWface', edging.getval('bottomZface'));
                            }
                            if (edging.getval('bottomZface') == 0.5) {
                                $('#bottomZrear option[value="2"]').hide();
                            }
                        }
                    }
                } else {
                    edging.hideinput('faska_bottom_field_rear');
                }

                if (type_bottom_kromka == 'radius') {
                    edging.showinput('radius_bottom_field_rear');
                } else {
                    edging.hideinput('radius_bottom_field_rear');
                }

                if (materialType == 'compact' && type_bottom_kromka == 'R2faska') {
                    edging.showinput('faska_bottom_field_rear');
                    edging.disabled('bottomZrear', true);
                    edging.setval('bottomZrear', 9);
                    edging.setval('bottomWrear', 9);
                }

                if (materialType == 'compact') {
                    $(edging.getinput('bottomRear')).change(function () {
                        edging.setval('all', '');
                        edging.hideinput('faska_all_field_face');

                        edging.setval('allRear', '');
                        edging.hideinput('faska_all_field_rear');
                    });
                }

                var value = edging.getval('bottomRear');
                if (value == '0') {
                    edging.functions.clear_grain('bottom', 'rear')
                }
                edging.functions.rectInterFace('bottom', 'rear');
            },
            all(e) {
                var val = edging.getval('all');
                if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                    var checkKromka = true;
                    var setKromka = false;
                    for (var key in strings.edgesides) {
                        var value = strings.edgesides[key];
                        setKromka = true;
                        checkKromka = edging.functions.check_kromka(value, val) && checkKromka;
                    }

                    if (setKromka && checkKromka) {
                        for (var key in strings.edgesides) {
                            var value = strings.edgesides[key];
                            edging.setval(value, val);
                        }
                        edging.use('send_edges', [val, 'all']);
                    } else {
                        kromkaAll = '';
                        edging.setval('all', kromkaAll);
                        edging.setval('left', kromkaLeft);
                        edging.setval('right', kromkaRight);
                        edging.setval('top', kromkaTop);
                        edging.setval('bottom', kromkaBottom);
                    }

                    if (constructorId == 'steklo' || (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                        return;
                    }

                }
                else {
                    var type_all_kromka = edging.getval('all');
                    if (type_all_kromka != '0' && type_all_kromka != '') {
                        for (var key in strings.edgesides) {
                            var value = strings.edgesides[key];
                            edging.setval(value, val);
                        }
                        edging.methods.left();
                        edging.methods.right();
                        edging.methods.top();
                        edging.methods.bottom();
                    } else {
                        edging.disabled('topZface', false);
                        edging.disabled('topWface', false);
                        edging.disabled('topDface', false);
                        edging.disabled('topRface', false);
                        edging.disabled('bottomZface', false);
                        edging.disabled('bottomWface', false);
                        edging.disabled('bottomDface', false);
                        edging.disabled('bottomRface', false);
                        edging.disabled('leftZface', false);
                        edging.disabled('leftWface', false);
                        edging.disabled('leftDface', false);
                        edging.disabled('leftRface', false);
                        edging.disabled('rightZface', false);
                        edging.disabled('rightWface', false);
                        edging.disabled('rightDface', false);
                        edging.disabled('rightRface', false);
                        edging.disabled('left', false);
                        edging.disabled('right', false);
                        edging.disabled('top', false);
                        edging.disabled('bottom', false);
                        if (materialType == 'compact') {
                            if(edging.getval('allZrear') == 8) {
                                edging.setval('allZrear', 0.5);
                                edging.setval('allWrear', edging.getval('allZrear'));
                            }
                            if (type_all_kromka == '0') {
                                edging.setval('top', 0);
                                edging.setval('left', 0);
                                edging.setval('right', 0);
                                edging.setval('bottom', 0);
                                edging.methods.left();
                                edging.methods.right();
                                edging.methods.top();
                                edging.methods.bottom();
                            }
                            if (type_all_kromka == '' && (edging.getval('top') == 'arc' || edging.getval('bottom') == 'arc' ||
                                    edging.getval('left') == 'arc' || edging.getval('right') == 'arc')) {
                                edging.setval('allRear', '');
                            }
                        }
                    }

                    if (type_all_kromka == 'faska') {
                        edging.showinput('allFaceSection');
                        edging.showinput('faska_all_field_face');
                        edging.disabled('topZface', true);
                        edging.disabled('topWface', true);
                        edging.disabled('topDface', true);
                        edging.disabled('bottomZface', true);
                        edging.disabled('bottomWface', true);
                        edging.disabled('bottomDface', true);
                        edging.disabled('leftZface', true);
                        edging.disabled('leftWface', true);
                        edging.disabled('leftDface', true);
                        edging.disabled('rightZface', true);
                        edging.disabled('rightWface', true);
                        edging.disabled('rightDface', true);

                        var allZface = edging.getval('allZface');
                        var allWface = edging.getval('allWface');
                        var allDface = edging.getval('allDface');
                        edging.setval('bottomZface', allZface);
                        edging.setval('bottomWface', allWface);
                        edging.setval('bottomDface', allDface);
                        edging.setval('topZface', allZface);
                        edging.setval('topWface', allWface);
                        edging.setval('topDface', allDface);
                        edging.setval('leftZface', allZface);
                        edging.setval('leftWface', allWface);
                        edging.setval('leftDface', allDface);
                        edging.setval('rightZface', allZface);
                        edging.setval('rightWface', allWface);
                        edging.setval('rightDface', allDface);
                        if (materialType == 'compact') {
                            if (edging.getval('allRear') == 0) {
                                edging.setval('topRear', 0);
                                edging.setval('leftRear', 0);
                                edging.setval('rightRear', 0);
                                edging.setval('bottomRear', 0);
                                edging.hideinput('faska_top_field_rear');
                                edging.hideinput('faska_left_field_rear');
                                edging.hideinput('faska_right_field_rear');
                                edging.hideinput('faska_bottom_field_rear');
                                edging.hideinput('faska_top_field_face');
                                edging.hideinput('faska_left_field_face');
                                edging.hideinput('faska_right_field_face');
                                edging.hideinput('faska_bottom_field_face');
                            }
                            if (edging.getval('allRear') == 'faska') {
                                edging.customValues.all_grain_copy_active = true;
                                edging.hideinput('faska_top_field_rear');
                                edging.hideinput('faska_left_field_rear');
                                edging.hideinput('faska_right_field_rear');
                                edging.hideinput('faska_bottom_field_rear');
                            }
                            if (edging.getval('allZface') == 2 && edging.getval('allZrear') == 11.5) {
                               edging.setval('allZrear', edging.getval('allZface'));
                            }
                            if (edging.getval('allZface') == 8 && edging.getval('allZrear') == 11.5) {
                                edging.setval('allZrear', 0.5);
                            }
                        }
                    } else {
                        edging.hideinput('faska_all_field_face');
                    }

                    if (type_all_kromka == 'radius') {
                        edging.showinput('allFaceSection');
                        edging.showinput('radius_all_field_face');
                        edging.disabled('topRface', true);
                        edging.disabled('bottomRface', true);
                        edging.disabled('leftRface', true);
                        edging.disabled('rightRface', true);

                        var allRface = edging.getval('allRface');
                        edging.setval('bottomRface', allRface);
                        edging.setval('topRface', allRface);
                        edging.setval('leftRface', allRface);
                        edging.setval('rightRface', allRface);

                        if (materialType == 'compact') {
                            $('#allRface option[value="6"]').hide();
                            $('#allRface option[value="12"]').hide();
                        }
                    } else {
                        edging.hideinput('radius_all_field_face');
                    }

                    if (type_all_kromka == 'R2faska') {
                        edging.showinput('allFaceSection');
                        edging.showinput('radius_all_field_face');
                        edging.disabled('allRface', true);
                        edging.hideinput('radius_top_field_face');
                        edging.hideinput('radius_left_field_face');
                        edging.hideinput('radius_right_field_face');
                        edging.hideinput('radius_bottom_field_face');
                    } else {
                        edging.disabled('allRface', false);
                    }
                    edging.functions.rectInterFace('all', 'face');
                    edging.functions.disabledFields();
                }

                edging.methods.all_grain_copy(false);

            },
            allRear(e) {

                var type_all_kromka = edging.getval('allRear');

                if (type_all_kromka != '0' && type_all_kromka != '') {
                    for (var key in strings.edgesides) {
                        var value = strings.edgesides[key] + "Rear";
                        edging.setval(value, type_all_kromka);
                    }
                    edging.methods.leftRear();
                    edging.methods.rightRear();
                    edging.methods.topRear();
                    edging.methods.bottomRear();

                    $('#allZface option[value="8"]').show();
                } else {
                    edging.disabled('topZrear', false);
                    edging.disabled('topWrear', false);
                    edging.disabled('topDrear', false);
                    edging.disabled('topRrear', false);
                    edging.disabled('bottomZrear', false);
                    edging.disabled('bottomWrear', false);
                    edging.disabled('bottomDrear', false);
                    edging.disabled('bottomRrear', false);
                    edging.disabled('leftZrear', false);
                    edging.disabled('leftWrear', false);
                    edging.disabled('leftDrear', false);
                    edging.disabled('leftRrear', false);
                    edging.disabled('rightZrear', false);
                    edging.disabled('rightWrear', false);
                    edging.disabled('rightDrear', false);
                    edging.disabled('rightRrear', false);
                    edging.disabled('leftRear', false);
                    edging.disabled('rightRear', false);
                    edging.disabled('topRear', false);
                    edging.disabled('bottomRear', false);
                    if (materialType == 'compact') {
                        $('#allZface option[value="8"]').hide();
                        if (edging.getval('allZface') == 8) {
                            edging.setval('allZface', 0.5);
                            edging.setval('allWface', edging.getval('allZface'));
                        }
                        if (type_all_kromka == '0') {
                            edging.setval('topRear', 0);
                            edging.setval('leftRear', 0);
                            edging.setval('rightRear', 0);
                            edging.setval('bottomRear', 0);
                            edging.methods.leftRear();
                            edging.methods.rightRear();
                            edging.methods.topRear();
                            edging.methods.bottomRear();
                        }
                        $('#allZface option[value="11.5"]').show();
                    }
                }

                if (type_all_kromka == 'faska') {
                    edging.showinput('allRearSection');
                    edging.showinput('faska_all_field_rear');
                    edging.disabled('topZrear', true);
                    edging.disabled('topWrear', true);
                    edging.disabled('topDrear', true);
                    edging.disabled('bottomZrear', true);
                    edging.disabled('bottomWrear', true);
                    edging.disabled('bottomDrear', true);
                    edging.disabled('leftZrear', true);
                    edging.disabled('leftWrear', true);
                    edging.disabled('leftDrear', true);
                    edging.disabled('rightZrear', true);
                    edging.disabled('rightWrear', true);
                    edging.disabled('rightDrear', true);

                    var allZrear = edging.getval('allZrear');
                    var allWrear = edging.getval('allWrear');
                    var allDrear = edging.getval('allDrear');
                    edging.setval('bottomZrear', allZrear);
                    edging.setval('bottomWrear', allWrear);
                    edging.setval('bottomDrear', allDrear);
                    edging.setval('topZrear', allZrear);
                    edging.setval('topWrear', allWrear);
                    edging.setval('topDrear', allDrear);
                    edging.setval('leftZrear', allZrear);
                    edging.setval('leftWrear', allWrear);
                    edging.setval('leftDrear', allDrear);
                    edging.setval('rightZrear', allZrear);
                    edging.setval('rightWrear', allWrear);
                    edging.setval('rightDrear', allDrear);
                    if (materialType == 'compact') {
                        $('#allZface option[value="11.5"]').hide();
                        if (edging.getval('allZrear') == '') edging.setval('allZrear', '0.5');
                        edging.setval('allWrear', edging.getval('allZrear'));
                        if (edging.getval('all') == 0) {
                            $('#allZrear option[value="8"]').hide();
                            $('#allZrear option[value="2"]').show();
                            $('#allZrear option[value="0.5"]').show();
                            if (edging.getval('allZrear') == 0.5) edging.setval('allWrear', edging.getval('allZrear'));
                            $(edging.getinput('allZrear')).change(function () {
                                edging.setval('allZrear', edging.getval('allZrear'));
                                edging.setval('allWrear', edging.getval('allZrear'));
                            });

                            edging.hideinput('faska_top_field_face');
                            edging.hideinput('faska_left_field_face');
                            edging.hideinput('faska_right_field_face');
                            edging.hideinput('faska_bottom_field_face');
                        }

                        if (edging.getval('all') == '') {
                            edging.hideinput('faska_top_field_rear');
                            edging.hideinput('faska_left_field_rear');
                            edging.hideinput('faska_right_field_rear');
                            edging.hideinput('faska_bottom_field_rear');

                            if (edging.getval('top') == 'arc' || edging.getval('top') == 'srez') {
                                edging.setval('top', 0);
                                edging.hideinput('srez_top_field_face');
                            }
                            if (edging.getval('left') == 'arc' || edging.getval('left') == 'srez') {
                                edging.setval('left', 0);
                                edging.hideinput('srez_left_field_face');
                            }
                            if (edging.getval('right') == 'arc' || edging.getval('right') == 'srez') {
                                edging.setval('right', 0);
                                edging.hideinput('srez_right_field_face');
                            }
                            if (edging.getval('bottom') == 'arc' || edging.getval('bottom') == 'srez') {
                                edging.setval('bottom', 0);
                                edging.hideinput('srez_bottom_field_face');
                            }

                            if (edging.getval('top') == 'faska') edging.showinput('faska_top_field_rear');
                            if (edging.getval('left') == 'faska') edging.showinput('faska_left_field_rear');
                            if (edging.getval('right') == 'faska') edging.showinput('faska_right_field_rear');
                            if (edging.getval('bottom') == 'faska') edging.showinput('faska_bottom_field_rear');

                            if (edging.getval('allZrear') == 11.5) {
                                if (edging.getval('top') == 'faska') edging.setval('top', 0);
                                if (edging.getval('left') == 'faska') edging.setval('left', 0);
                                if (edging.getval('right') == 'faska') edging.setval('right', 0);
                                if (edging.getval('bottom') == 'faska') edging.setval('bottom', 0);
                                $('#allZface option[value="11.5"]').hide();
                                edging.setval('allZface', 0.5);
                                edging.setval('topZface', edging.getval('allZface'));
                                edging.setval('leftZface', edging.getval('allZface'));
                                edging.setval('rightZface', edging.getval('allZface'));
                                edging.setval('bottomZface', edging.getval('allZface'));
                                edging.setval('allWface', edging.getval('allZface'));

                            }
                            if (edging.getval('allZrear') == 2) {
                                if (edging.getval('topZface') == 0.5) edging.setval('top', 0);
                                if (edging.getval('leftZface') == 0.5) edging.setval('left', 0);
                                if (edging.getval('rightZface') == 0.5) edging.setval('right', 0);
                                if (edging.getval('bottomZface') == 0.5) edging.setval('bottom', 0);
                            }
                            if (edging.getval('allZrear') == 0.5) {
                                if (edging.getval('topZface') == 2) edging.setval('top', 0);
                                if (edging.getval('leftZface') == 2) edging.setval('left', 0);
                                if (edging.getval('rightZface') == 2) edging.setval('right', 0);
                                if (edging.getval('bottomZface') == 2) edging.setval('bottom', 0);
                            }
                        }
                        if (edging.getval('all') == 'faska') {
                            if (edging.getval('allZface') == 0.5) {
                                $('#allZrear option[value="2"]').hide();
                                $('#allZrear option[value="8"]').show();
                                $('#allZrear option[value="0.5"]').show();
                            }
                            if (edging.getval('allZface') == 2) {
                                if (edging.getval('allZrear') == 0.5) {
                                    edging.setval('allZrear', edging.getval('allZface'));
                                    edging.setval('allWrear', edging.getval('allZrear'));
                                }
                            }
                            if (edging.getval('allZface') == 11.5) {
                                edging.setval('allZface', 0.5);
                                $('#allZface option[value="11.5"]').hide();
                                edging.setval('allWface', edging.getval('allZface'));
                            }
                            if (edging.getval('allZface') == 0.5) {
                                $('#allZrear option[value="2"]').hide();
                            }
                        }
                        edging.methods.leftRear();
                        edging.methods.rightRear();
                        edging.methods.topRear();
                        edging.methods.bottomRear();
                    }
                } else {
                    edging.hideinput('faska_all_field_rear');
                }

                if (type_all_kromka == 'radius') {
                    edging.showinput('allRearSection');
                    edging.showinput('radius_all_field_rear');
                    edging.disabled('topRrear', true);
                    edging.disabled('bottomRrear', true);
                    edging.disabled('leftRrear', true);
                    edging.disabled('rightRrear', true);

                    var allRrear = edging.getval('allRrear');
                    edging.setval('bottomRrear', allRrear);
                    edging.setval('topRrear', allRrear);
                    edging.setval('leftRrear', allRrear);
                    edging.setval('rightRrear', allRrear);
                } else {
                    edging.hideinput('radius_all_field_rear');
                }

                if (type_all_kromka == 'R2faska') {
                    edging.showinput('allRearSection');
                    edging.showinput('faska_all_field_rear');
                    edging.disabled('allZrear', true);
                    edging.setval('allZrear', 9);
                    edging.setval('allWrear', 9);
                    edging.hideinput('faska_top_field_rear');
                    edging.hideinput('faska_left_field_rear');
                    edging.hideinput('faska_right_field_rear');
                    edging.hideinput('faska_bottom_field_rear');
                }

                if (materialType == 'compact' && type_all_kromka == 'arc') {
                    edging.setval('all', 'arc');
                    edging.functions.rectInterFace('all', 'face');
                }

                edging.functions.disabledFields();
            },
            add_kromka_wood(e) {
                var result = edging.functions.check_edges_wood();
                if (result) {
                    edging.functions.send_edges_wood();
                }
            },

            top_grain_copy(changeValue = true) {
                if (changeValue) {
                    edging.customValues.top_grain_copy_active = (edging.customValues.top_grain_copy_active) ? false : true;
                }
                if (materialType == 'compact' && edging.getval('top') == '0' && edging.getval('topRear') == '0') edging.customValues.top_grain_copy_active = true;

                if (edging.customValues.top_grain_copy_active) {
                    $(edging.getinput('top_grain_copy')).css("background-color", "green");
                    edging.customValues.top_grain_copy_active = true;
                    edging.disabled('topRear', true);
                    edging.setval('topRear', edging.getval('top'));
                    edging.methods.topRear();
                    if (edging.getval('top') == 'faska') {
                        let topZface = edging.getval('topZface');
                        let topZrear = edging.getval('topZrear');
                        let topDface = edging.getval('topDface');
                        edging.disabled('topWrear', true);
                        edging.disabled('topDrear', true);
                        edging.setval('topWrear', topZrear);
                        edging.setval('topDrear', topDface);
                        if (materialType == 'compact') {
                            if (topZface != 2 && topZface != 8) {
                                edging.setval('topZface', 0.5);
                                edging.setval('topWface', 0.5);
                                edging.setval('topWrear', 0.5);
                                edging.setval('topZrear', 0.5);
                                if (topZrear == 8) {
                                    edging.setval('topZrear', 8);
                                    edging.setval('topWrear', topZrear);
                                }
                                if (topZrear == 0.5) {
                                    edging.setval('topZrear', 0.5);
                                    edging.setval('topWrear', topZrear);
                                }
                                $('#topZrear option[value="2"]').hide();
                                $('#topZrear option[value="8"]').show();
                            } else {
                                $('#topZrear option[value="2"]').show();
                                $('#topZrear option[value="8"]').hide();
                            }
                            if (topZface == 2) {
                                $('#topZrear option[value="0.5"]').hide();
                                if (edging.getval('topZrear') == 2) {
                                    $('#topZrear option[value="0.5"]').hide();
                                }
                                $('#topZrear option[value="8"]').show();
                            } else {
                                $('#topZrear option[value="0.5"]').show();
                            }
                            if (topZface == 8) {
                                $('#topZrear option[value="8"]').hide();
                            }

                            $(edging.getinput('topZface')).change(function () {
                                let topZrear = edging.getval('topZrear');
                                let topZface = edging.getval('topZface');

                                edging.setval('topZrear', topZface);
                                edging.setval('topWrear', topZrear);

                                if (topZface == 8) {
                                    $('#topZrear option[value="8"]').hide();
                                    edging.setval('topZrear', 0.5);
                                    edging.setval('topWrear', topZrear);
                                } else {
                                    $('#topZrear option[value="8"]').show();
                                }
                            });
                        }
                        edging.methods.allRear();
                    }

                    if (edging.getval('top') == 'radius') {
                        var topRface = edging.getval('topRface');
                        edging.disabled('topRrear', true);
                        edging.setval('topRrear', topRface);
                    }

                    if (edging.getval('top') == 'R2faska') {
                        edging.methods.allRear();
                    }
                } else {
                    $(edging.getinput('top_grain_copy')).css("background-color", "transparent");
                    edging.disabled('topRear', false);
                    if (edging.getval('top') == 'faska') {
                        edging.disabled('topZrear', false);
                        edging.disabled('topWrear', false);
                        edging.disabled('topDrear', false);
                        if (materialType == 'compact') {
                            if (edging.getval('topZface') == '') edging.setval('topZface', '0.5');
                            if (edging.getval('topRear') == '0') {
                                $('#topZface option[value="8"]').hide();
                            } else {
                                $('#topZface option[value="8"]').show();
                            }
                            if (edging.getval('topZface') == 2) {
                                $('#topZrear option[value="0.5"]').hide();
                                $('#topZrear option[value="8"]').show();
                                $('#topZrear option[value="2"]').show();
                            }
                            if (edging.getval('topZface') == 8) {
                                $('#topZrear option[value="2"]').show();
                                $('#topZrear option[value="0.5"]').show();
                            }
                            edging.setval('topWface', edging.getval('topZface'));
                        }
                    }

                    if (materialType == 'compact' && edging.getval('topRear') == 'faska') {
                        edging.methods.topRear();
                        if (edging.getval('top') == 'faska') {
                            if (edging.getval('topZface') == 8) $('#topZrear option[value="8"]').hide();
                            $(edging.getinput('topZface')).change(function () {
                                edging.setval('topZrear', edging.getval('topZface'));
                                edging.setval('topWrear', edging.getval('topZrear'));
                                if (edging.getval('topZface') == 8 || edging.getval('topZface') == 11.5) {
                                    edging.setval('topZrear', 0.5);
                                    edging.setval('topWrear', edging.getval('topZrear'));
                                }
                            });
                        }
                    }
                    if (materialType == 'compact' && edging.getval('topRear') == 'arc') {
                        edging.setval('top', 'arc');
                    }

                    if (edging.getval('top') == 'radius') {
                        edging.disabled('topRrear', false);
                    }
                }

                if (materialType == 'compact' && edging.getval('top') == 'srez') {
                    $('#top_grain_copy').css("display", "none");
                    $('#kromkaTopRear').css("display", "none");
                    $('#kromkaTop').css('width', '85%');
                    $('#srez_top_field_face').css('width', '85%');
                    $('#srez_top_field_face').css('clear', 'both');
                    $('.text-danger').hide();
                    edging.setval('topRear', '0');
                    edging.hideinput('faska_top_field_rear');
                } else {
                    $('.text-danger').show();
                    edging.setval('srez_top', '0');
                }

                if (materialType == 'compact' && edging.getval('top') == 'faska' && edging.getval('topRear') == '0'){
                    $('#topZface option[value="11.5"]').show();
                } else {
                    $('#topZface option[value="11.5"]').hide();
                }

                if (materialType == 'compact' && edging.getval('topRear') == 'faska' && edging.getval('top') == '0'){
                    $('#topZrear option[value="11.5"]').show();
                } else {
                    $('#topZrear option[value="11.5"]').hide();
                }

                edging.functions.disabledFields();
            },

            left_grain_copy(changeValue = true) {
                if (changeValue) {
                    edging.customValues.left_grain_copy_active = (edging.customValues.left_grain_copy_active) ? false : true;
                }
                if (materialType == 'compact' && edging.getval('left') == '0' && edging.getval('leftRear') == '0') edging.customValues.left_grain_copy_active = true;

                if (edging.customValues.left_grain_copy_active) {
                    $(edging.getinput('left_grain_copy')).css("background-color", "green");
                    edging.disabled('leftRear', true);
                    edging.setval('leftRear', edging.getval('left'));
                    edging.methods.leftRear();
                    if (edging.getval('left') == 'faska') {
                        let leftZface = edging.getval('leftZface');
                        let leftZrear = edging.getval('leftZrear');
                        let leftDface = edging.getval('leftDface');
                        edging.disabled('leftWrear', true);
                        edging.disabled('leftDrear', true);
                        edging.setval('leftWrear', leftZrear);
                        edging.setval('leftDrear', leftDface);
                        if (materialType == 'compact' ) {
                            if (leftZface != 2 && leftZface != 8) {
                                edging.setval('leftZface', 0.5);
                                edging.setval('leftWface', 0.5);
                                edging.setval('leftWrear', 0.5);
                                edging.setval('leftZrear', 0.5);
                                if (leftZrear == 8) {
                                    edging.setval('leftZrear', 8);
                                    edging.setval('leftWrear', leftZrear);
                                }
                                if (leftZrear == 0.5) {
                                    edging.setval('leftZrear', 0.5);
                                    edging.setval('leftWrear', leftZrear);
                                }
                                $('#leftZrear option[value="2"]').hide();
                                $('#leftZrear option[value="8"]').show();
                            } else {
                                $('#leftZrear option[value="2"]').show();
                                $('#leftZrear option[value="8"]').hide();
                            }
                            if (leftZface == 2) {
                                $('#leftZrear option[value="0.5"]').hide();
                                if (edging.getval('leftZrear') == 2) {
                                    $('#leftZrear option[value="0.5"]').hide();
                                }
                                $('#leftZrear option[value="8"]').show();
                            } else {
                                $('#leftZrear option[value="0.5"]').show();
                            }
                            if (leftZface == 8) {
                                $('#leftZrear option[value="8"]').hide();
                            }

                            $(edging.getinput('leftZface')).change(function () {
                                let leftZrear = edging.getval('leftZrear');
                                let leftZface = edging.getval('leftZface');

                                edging.setval('leftZrear', leftZface);
                                edging.setval('leftWrear', leftZrear);

                                if (leftZface == 8) {
                                    $('#leftZrear option[value="8"]').hide();
                                    edging.setval('leftZrear', 0.5);
                                    edging.setval('leftWrear', leftZrear);
                                } else {
                                    $('#leftZrear option[value="8"]').show();
                                }
                            });
                        }
                        edging.methods.allRear();
                    }

                    if (edging.getval('left') == 'radius') {
                        var leftRface = edging.getval('leftRface');
                        edging.disabled('leftRrear', true);
                        edging.setval('leftRrear', leftRface);
                    }

                    if (edging.getval('top') == 'R2faska') {
                        edging.methods.allRear();
                    }
                } else {
                    edging.disabled('leftRear', false);
                    $(edging.getinput('left_grain_copy')).css("background-color", "transparent");
                    if (edging.getval('left') == 'faska') {
                        edging.disabled('leftZrear', false);
                        edging.disabled('leftWrear', false);
                        edging.disabled('leftDrear', false);
                        if (materialType == 'compact') {
                            if (edging.getval('leftZface') == '') edging.setval('leftZface', '0.5');
                            if (edging.getval('leftRear') == '0') {
                                $('#leftZface option[value="8"]').hide();
                            } else {
                                $('#leftZface option[value="8"]').show();
                            }
                            if (edging.getval('leftZface') == 2) {
                                $('#leftZrear option[value="0.5"]').hide();
                                $('#leftZrear option[value="8"]').show();
                                $('#leftZrear option[value="2"]').show();
                            }
                            if (edging.getval('leftZface') == 8) {
                                $('#leftZrear option[value="2"]').show();
                                $('#leftZrear option[value="0.5"]').show();
                            }
                            edging.setval('leftWface', edging.getval('leftZface'));
                        }
                    }

                    if (materialType == 'compact' && edging.getval('leftRear') == 'faska') {
                        edging.methods.leftRear();
                        if (edging.getval('left') == 'faska') {
                            if (edging.getval('leftZface') == 8) $('#leftZrear option[value="8"]').hide();
                            $(edging.getinput('leftZface')).change(function () {
                                edging.setval('leftZrear', edging.getval('leftZface'));
                                edging.setval('leftWrear', edging.getval('leftZrear'));
                                if (edging.getval('leftZface') == 8 || edging.getval('leftZface') == 11.5) {
                                    edging.setval('leftZrear', 0.5);
                                    edging.setval('leftWrear', edging.getval('leftZrear'));
                                }
                            });
                        }
                    }

                    if (materialType == 'compact' && edging.getval('leftRear') == 'arc') {
                        edging.setval('left', 'arc');
                    }

                    if (edging.getval('left') == 'radius') {
                        edging.disabled('leftRrear', false);
                    }
                }

                if (materialType == 'compact' && edging.getval('left') == 'srez') {
                    $('#left_grain_copy').css("display", "none");
                    $('#kromkaLeftRear').css("display", "none");
                    $('#kromkaLeft').css('width', '85%');
                    $('#srez_left_field_face').css('width', '85%');
                    $('#srez_left_field_face').css('clear', 'both');
                    $('.text-danger').hide();
                    edging.setval('leftRear', '0');
                    edging.hideinput('faska_left_field_rear');
                } else {
                    $('.text-danger').show();
                    edging.setval('srez_left', '0');
                }

                if (materialType == 'compact' && edging.getval('left') == 'faska' && edging.getval('leftRear') == '0'){
                    $('#leftZface option[value="11.5"]').show();
                } else {
                    $('#leftZface option[value="11.5"]').hide();
                }

                if (materialType == 'compact' && edging.getval('leftRear') == 'faska' && edging.getval('left') == '0'){
                    $('#leftZrear option[value="11.5"]').show();
                } else {
                    $('#leftZrear option[value="11.5"]').hide();
                }

                edging.functions.disabledFields();
            },

            bottom_grain_copy(changeValue = true) {
                if (changeValue) {
                    edging.customValues.bottom_grain_copy_active = (edging.customValues.bottom_grain_copy_active) ? false : true;
                }
                if (materialType == 'compact' && edging.getval('bottom') == '0' && edging.getval('bottomRear') == '0') edging.customValues.bottom_grain_copy_active = true;

                if (edging.customValues.bottom_grain_copy_active) {
                    $(edging.getinput('bottom_grain_copy')).css("background-color", "green");
                    edging.disabled('bottomRear', true);
                    edging.setval('bottomRear', edging.getval('bottom'));
                    edging.methods.bottomRear();
                    if (edging.getval('bottom') == 'faska') {
                        let bottomZface = edging.getval('bottomZface');
                        let bottomZrear = edging.getval('bottomZrear');
                        let bottomDface = edging.getval('bottomDface');
                        edging.disabled('bottomWrear', true);
                        edging.disabled('bottomDrear', true);
                        edging.setval('bottomWrear', bottomZrear);
                        edging.setval('bottomDrear', bottomDface);
                        if (materialType == 'compact' ) {
                            if (bottomZface != 2 && bottomZface != 8) {
                                edging.setval('bottomZface', 0.5);
                                edging.setval('bottomWface', 0.5);
                                edging.setval('bottomWrear', 0.5);
                                edging.setval('bottomZrear', 0.5);
                                if (bottomZrear == 8) {
                                    edging.setval('bottomZrear', 8);
                                    edging.setval('bottomWrear', bottomZrear);
                                }
                                if (bottomZrear == 0.5) {
                                    edging.setval('bottomZrear', 0.5);
                                    edging.setval('bottomWrear', bottomZrear);
                                }
                                $('#bottomZrear option[value="2"]').hide();
                                $('#bottomZrear option[value="8"]').show();
                            } else {
                                $('#bottomZrear option[value="2"]').show();
                                $('#bottomZrear option[value="8"]').hide();
                            }
                            if (bottomZface == 2) {
                                $('#bottomZrear option[value="0.5"]').hide();
                                if (edging.getval('bottomZrear') == 2) {
                                    $('#bottomZrear option[value="0.5"]').hide();
                                }
                                $('#bottomZrear option[value="8"]').show();
                            } else {
                                $('#bottomZrear option[value="0.5"]').show();
                            }
                            if (bottomZface == 8) {
                                $('#bottomZrear option[value="8"]').hide();
                            }

                            $(edging.getinput('bottomZface')).change(function () {
                                let bottomZrear = edging.getval('bottomZrear');
                                let bottomZface = edging.getval('bottomZface');

                                edging.setval('bottomZrear', bottomZface);
                                edging.setval('bottomWrear', bottomZrear);

                                if (bottomZface == 8) {
                                    $('#bottomZrear option[value="8"]').hide();
                                    edging.setval('bottomZrear', 0.5);
                                    edging.setval('bottomWrear', bottomZrear);
                                } else {
                                    $('#bottomZrear option[value="8"]').show();
                                }
                            });
                        }
                        edging.methods.allRear();
                    }

                    if (edging.getval('bottom') == 'radius') {
                        var bottomRface = edging.getval('bottomRface');
                        edging.disabled('bottomRrear', true);
                        edging.setval('bottomRrear', bottomRface);
                    }

                    if (edging.getval('top') == 'R2faska') {
                        edging.methods.allRear();
                    }
                } else {
                    edging.disabled('bottomRear', false);
                    $(edging.getinput('bottom_grain_copy')).css("background-color", "transparent");
                    if (edging.getval('bottom') == 'faska') {
                        edging.disabled('bottomZrear', false);
                        edging.disabled('bottomWrear', false);
                        edging.disabled('bottomDrear', false);
                        if (materialType == 'compact') {
                            if (edging.getval('bottomZface') == '') edging.setval('bottomZface', '0.5');
                            if (edging.getval('bottomRear') == '0') {
                                $('#bottomZface option[value="8"]').hide();
                            } else {
                                $('#bottomZface option[value="8"]').show();
                            }
                            if (edging.getval('bottomZface') == 2) {
                                $('#bottomZrear option[value="0.5"]').hide();
                                $('#bottomZrear option[value="8"]').show();
                                $('#bottomZrear option[value="2"]').show();
                            }
                            if (edging.getval('bottomZface') == 8) {
                                $('#bottomZrear option[value="2"]').show();
                                $('#bottomZrear option[value="0.5"]').show();
                            }
                            edging.setval('bottomWface', edging.getval('bottomZface'));
                        }
                    }

                    if (materialType == 'compact' && edging.getval('bottomRear') == 'faska') {
                        edging.methods.bottomRear();
                        if (edging.getval('bottom') == 'faska') {
                            if (edging.getval('bottomZface') == 8) $('#bottomZrear option[value="8"]').hide();
                            $(edging.getinput('bottomZface')).change(function () {
                                edging.setval('bottomZrear', edging.getval('bottomZface'));
                                edging.setval('bottomWrear', edging.getval('bottomZrear'));
                                if (edging.getval('bottomZface') == 8 || edging.getval('bottomZface') == 11.5) {
                                    edging.setval('bottomZrear', 0.5);
                                    edging.setval('bottomWrear', edging.getval('bottomZrear'));
                                }
                            });
                        }
                    }

                    if (materialType == 'compact' && edging.getval('bottomRear') == 'arc') {
                        edging.setval('bottom', 'arc');
                    }

                    if (edging.getval('bottom') == 'radius') {
                        edging.disabled('bottomRrear', false);
                    }
                }

                if (materialType == 'compact' && edging.getval('bottom') == 'srez') {
                    $('#bottom_grain_copy').css("display", "none");
                    $('#kromkaBottomRear').css("display", "none");
                    $('#kromkaBottom').css('width', '85%');
                    $('#srez_bottom_field_face').css('width', '85%');
                    $('#srez_bottom_field_face').css('clear', 'both');
                    $('.text-danger').hide();
                    edging.setval('bottomRear', '0');
                    edging.hideinput('faska_bottom_field_rear');
                } else {
                    $('.text-danger').show();
                    edging.setval('srez_bottom', '0');
                }

                if (materialType == 'compact' && edging.getval('bottom') == 'faska' && edging.getval('bottomRear') == '0'){
                    $('#bottomZface option[value="11.5"]').show();
                } else {
                    $('#bottomZface option[value="11.5"]').hide();
                }

                if (materialType == 'compact' && edging.getval('bottomRear') == 'faska' && edging.getval('bottom') == '0'){
                    $('#bottomZrear option[value="11.5"]').show();
                } else {
                    $('#bottomZrear option[value="11.5"]').hide();
                }

                edging.functions.disabledFields();
            },

            right_grain_copy(changeValue = true) {
                if (changeValue) {
                    edging.customValues.right_grain_copy_active = (edging.customValues.right_grain_copy_active) ? false : true;
                }
                if (materialType == 'compact' && edging.getval('right') == '0' && edging.getval('rightRear') == '0') edging.customValues.right_grain_copy_active = true;

                if (edging.customValues.right_grain_copy_active) {
                    $(edging.getinput('right_grain_copy')).css("background-color", "green");
                    edging.disabled('rightRear', true);
                    edging.setval('rightRear', edging.getval('right'));
                    edging.methods.rightRear();
                    if (edging.getval('right') == 'faska') {
                        let rightZface = edging.getval('rightZface');
                        let rightZrear = edging.getval('rightZrear');
                        let rightDface = edging.getval('rightDface');
                        edging.disabled('rightWrear', true);
                        edging.disabled('rightDrear', true);
                        edging.setval('rightWrear', rightZrear);
                        edging.setval('rightDrear', rightDface);
                        if (materialType == 'compact' ) {
                            if (rightZface != 2 && rightZface != 8) {
                                edging.setval('rightZface', 0.5);
                                edging.setval('rightWface', 0.5);
                                edging.setval('rightWrear', 0.5);
                                edging.setval('rightZrear', 0.5);
                                if (rightZrear == 8) {
                                    edging.setval('rightZrear', 8);
                                    edging.setval('rightWrear', rightZrear);
                                }
                                if (rightZrear == 0.5) {
                                    edging.setval('rightZrear', 0.5);
                                    edging.setval('rightWrear', rightZrear);
                                }
                                $('#rightZrear option[value="2"]').hide();
                                $('#rightZrear option[value="8"]').show();
                            } else {
                                $('#rightZrear option[value="2"]').show();
                                $('#rightZrear option[value="8"]').hide();
                            }
                            if (rightZface == 2) {
                                $('#rightZrear option[value="0.5"]').hide();
                                if (edging.getval('rightZrear') == 2) {
                                    $('#rightZrear option[value="0.5"]').hide();
                                }
                                $('#rightZrear option[value="8"]').show();
                            } else {
                                $('#rightZrear option[value="0.5"]').show();
                            }
                            if (rightZface == 8) {
                                $('#rightZrear option[value="8"]').hide();
                            }

                            $(edging.getinput('rightZface')).change(function () {
                                let rightZrear = edging.getval('rightZrear');
                                let rightZface = edging.getval('rightZface');

                                edging.setval('rightZrear', rightZface);
                                edging.setval('rightWrear', rightZrear);

                                if (rightZface == 8) {
                                    $('#rightZrear option[value="8"]').hide();
                                    edging.setval('rightZrear', 0.5);
                                    edging.setval('rightWrear', rightZrear);
                                } else {
                                    $('#rightZrear option[value="8"]').show();
                                }
                            });
                        }
                        edging.methods.allRear();
                    }

                    if (edging.getval('right') == 'radius') {
                        var rightRface = edging.getval('rightRface');
                        edging.disabled('rightRrear', true);
                        edging.setval('rightRrear', rightRface);
                    }

                    if (edging.getval('top') == 'R2faska') {
                        edging.methods.allRear();
                    }
                } else {
                    $(edging.getinput('right_grain_copy')).css("background-color", "transparent");
                    edging.disabled('rightRear', false);
                    if (edging.getval('right') == 'faska') {
                        edging.disabled('rightZrear', false);
                        edging.disabled('rightWrear', false);
                        edging.disabled('rightDrear', false);
                        if (materialType == 'compact') {
                            if (edging.getval('rightZface') == '') edging.setval('rightZface', '0.5');
                            if (edging.getval('rightRear') == '0') {
                                $('#rightZface option[value="8"]').hide();
                            } else {
                                $('#rightZface option[value="8"]').show();
                            }
                            if (edging.getval('rightZface') == 2) {
                                $('#rightZrear option[value="0.5"]').hide();
                                $('#rightZrear option[value="8"]').show();
                                $('#rightZrear option[value="2"]').show();
                            }
                            if (edging.getval('rightZface') == 8) {
                                $('#rightZrear option[value="2"]').show();
                                $('#rightZrear option[value="0.5"]').show();
                            }
                            edging.setval('rightWface', edging.getval('rightZface'));
                        }
                    }

                    if (materialType == 'compact' && edging.getval('rightRear') == 'faska') {
                        edging.methods.rightRear();
                        if (edging.getval('right') == 'faska') {
                            if (edging.getval('rightZface') == 8) $('#rightZrear option[value="8"]').hide();
                            $(edging.getinput('rightZface')).change(function () {
                                edging.setval('rightZrear', edging.getval('rightZface'));
                                edging.setval('rightWrear', edging.getval('rightZrear'));
                                if (edging.getval('rightZface') == 8 || edging.getval('rightZface') == 11.5) {
                                    edging.setval('rightZrear', 0.5);
                                    edging.setval('rightWrear', edging.getval('rightZrear'));
                                }
                            });
                        }
                    }

                    if (materialType == 'compact' && edging.getval('rightRear') == 'arc') {
                        edging.setval('right', 'arc');
                    }

                    if (edging.getval('right') == 'radius') {
                        edging.disabled('rightRrear', false);
                    }
                }

                if (materialType == 'compact' && edging.getval('right') == 'srez') {
                    $('#right_grain_copy').css("display", "none");
                    $('#kromkaRightRear').css("display", "none");
                    $('#kromkaRight').css('width', '85%');
                    $('#srez_right_field_face').css('width', '85%');
                    $('#srez_right_field_face').css('clear', 'both');
                    $('.text-danger').hide();
                    edging.setval('rightRear', '0');
                    edging.hideinput('faska_right_field_rear');
                } else {
                    $('.text-danger').show();
                    edging.setval('srez_right', '0');
                }

                if (materialType == 'compact' && edging.getval('right') == 'faska' && edging.getval('rightRear') == '0'){
                    $('#rightZface option[value="11.5"]').show();
                } else {
                    $('#rightZface option[value="11.5"]').hide();
                }

                if (materialType == 'compact' && edging.getval('rightRear') == 'faska' && edging.getval('right') == '0'){
                    $('#rightZrear option[value="11.5"]').show();
                } else {
                    $('#rightZrear option[value="11.5"]').hide();
                }

                edging.functions.disabledFields();
            },

            all_grain_copy(changeValue = true) {
                if (changeValue) {
                    edging.customValues.all_grain_copy_active = (edging.customValues.all_grain_copy_active) ? false : true;
                }
                if (materialType == 'compact' && edging.getval('all') == 'faska' && edging.getval('allRear') == '') edging.customValues.all_grain_copy_active = true;

                if (edging.customValues.all_grain_copy_active) {
                    $(edging.getinput('all_grain_copy')).css("background-color", "green");
                    edging.disabled('allRear', true);
                    edging.setval('allRear', edging.getval('all'));
                    edging.methods.allRear();
                    if (edging.getval('all') == 'faska') {
                        let allZface = edging.getval('allZface');
                        let allZrear = edging.getval('allZrear');
                        let allDface = edging.getval('allDface');
                        edging.disabled('allWrear', true);
                        edging.disabled('allDrear', true);
                        edging.setval('allWrear', allZrear);
                        edging.setval('allDrear', allDface);
                        if (materialType == 'compact' ) {
                            if (allZface != 2 && allZface != 8) {
                                edging.setval('allZface', 0.5);
                                edging.setval('allWface', 0.5);
                                edging.setval('allWrear', 0.5);
                                edging.setval('allZrear', 0.5);
                                if (allZrear == 8) {
                                    edging.setval('allZrear', 8);
                                    edging.setval('allWrear', allZrear);
                                }
                                if (allZrear == 0.5) {
                                    edging.setval('allZrear', 0.5);
                                    edging.setval('allWrear', allZrear);
                                }
                                $('#allZrear option[value="2"]').hide();
                                $('#allZrear option[value="8"]').show();
                            } else {
                                $('#allZrear option[value="2"]').show();
                                $('#allZrear option[value="8"]').hide();
                            }
                            if (allZface == 2) {
                                $('#allZrear option[value="0.5"]').hide();
                                if (edging.getval('allZrear') == 2) {
                                    $('#allZrear option[value="0.5"]').hide();
                                }
                                $('#allZrear option[value="8"]').show();
                            } else {
                                $('#allZrear option[value="0.5"]').show();
                            }
                            if (allZface == 8) {
                                $('#allZrear option[value="8"]').hide();
                            }

                            $(edging.getinput('allZface')).change(function () {
                                let allZrear = edging.getval('allZrear');
                                let allZface = edging.getval('allZface');

                                edging.setval('allZrear', allZface);
                                edging.setval('topZrear', allZface);
                                edging.setval('leftZrear', allZface);
                                edging.setval('rightZrear', allZface);
                                edging.setval('bottomZrear', allZface);
                                edging.setval('allWrear', allZrear);

                                if (allZface == 8) {
                                    $('#allZrear option[value="8"]').hide();
                                    edging.setval('allZrear', 0.5);
                                    edging.setval('topZrear', allZrear);
                                    edging.setval('leftZrear', allZrear);
                                    edging.setval('rightZrear', allZrear);
                                    edging.setval('bottomZrear', allZrear);
                                    edging.setval('allWrear', allZrear);
                                } else {
                                    $('#allZrear option[value="8"]').show();
                                }

                                if (allZface == 11.5) {
                                    $('#allZrear option[value="11.5"]').hide();
                                    edging.setval('allZrear', 0.5);
                                    edging.setval('topZrear', allZrear);
                                    edging.setval('leftZrear', allZrear);
                                    edging.setval('rightZrear', allZrear);
                                    edging.setval('bottomZrear', allZrear);
                                    edging.setval('allWrear', allZrear);
                                }
                            });
                        }
                    }

                    if (edging.getval('all') == 'radius') {
                        var allRface = edging.getval('allRface');
                        edging.disabled('allRrear', true);
                        edging.setval('allRrear', allRface);
                    }
                } else {
                    $(edging.getinput('all_grain_copy')).css("background-color", "transparent");
                    edging.disabled('allRear', false);
                    if (edging.getval('all') == 'faska') {
                        edging.disabled('allZrear', false);
                        edging.disabled('allWrear', false);
                        edging.disabled('allDrear', false);
                        if (materialType == 'compact') {
                            if (edging.getval('allZface') == '') edging.setval('allZface', '0.5');
                            if (edging.getval('allRear') == '0' || edging.getval('allRear') == '') {
                                $('#allZface option[value="8"]').hide();
                            } else {
                                $('#allZface option[value="8"]').show();
                            }
                            if (edging.getval('allZface') == 2) {
                                edging.setval('allZrear', 2);
                                $('#allZrear option[value="0.5"]').hide();
                                $('#allZrear option[value="8"]').show();
                                $('#allZrear option[value="2"]').show();
                            }
                            if (edging.getval('allZface') == 8) {
                                $('#allZrear option[value="2"]').show();
                                $('#allZrear option[value="0.5"]').show();
                            }
                            edging.setval('allWface', edging.getval('allZface'));
                        }
                    }

                    if (materialType == 'compact' && edging.getval('allRear') == 'faska') {
                        edging.methods.allRear();
                        if (edging.getval('all') == 'faska') {
                            if (edging.getval('allZface') == 8) $('#allZrear option[value="8"]').hide();
                            $(edging.getinput('allZface')).change(function () {
                                edging.setval('allZrear', edging.getval('allZface'));
                                edging.setval('allWrear', edging.getval('allZrear'));
                                if (edging.getval('allZface') == 8 || edging.getval('allZface') == 11.5) {
                                    edging.setval('allZrear', 0.5);
                                    edging.setval('allWrear', edging.getval('allZrear'));
                                }
                            });
                        }
                    }

                    if (edging.getval('all') == 'radius') {
                        edging.disabled('allRrear', false);
                    }
                }

                if (materialType == 'compact' && edging.getval('all') == 'faska' && (edging.getval('allRear') == '0' ||
                        edging.getval('allRear') == '')){
                    $('#allZface option[value="11.5"]').show();
                } else {
                    $('#allZface option[value="11.5"]').hide();
                }

                if (materialType == 'compact' && edging.getval('allRear') == 'faska' && (edging.getval('all') == '0' ||
                        edging.getval('all') == '')){
                    $('#allZrear option[value="11.5"]').show();
                } else {
                    $('#allZrear option[value="11.5"]').hide();
                }

                edging.customValues.left_grain_copy_active = edging.customValues.all_grain_copy_active;
                edging.customValues.top_grain_copy_active = edging.customValues.all_grain_copy_active;
                edging.customValues.right_grain_copy_active = edging.customValues.all_grain_copy_active;
                edging.customValues.bottom_grain_copy_active = edging.customValues.all_grain_copy_active;

                edging.methods.left_grain_copy(false);
                edging.methods.right_grain_copy(false);
                edging.methods.top_grain_copy(false);
                edging.methods.bottom_grain_copy(false);
                edging.functions.disabledFields();
            },

            topZface(e) {
                edging.functions.calc_wood('top', 'Z', 'face');
                edging.functions.top_face_change();
            },

            topWface(e) {
                edging.functions.calc_wood('top', 'W', 'face');
                edging.functions.top_face_change();
            },

            topDface(e) {
                edging.functions.calc_wood('top', 'D', 'face');
                edging.functions.top_face_change();
            },

            topRface(e) {
                edging.functions.top_face_change();
            },

            bottomZface(e) {
                edging.functions.calc_wood('bottom', 'Z', 'face');
                edging.functions.bottom_face_change();
            },

            bottomWface(e) {
                edging.functions.calc_wood('bottom', 'W', 'face');
                edging.functions.bottom_face_change();
            },

            bottomDface(e) {
                edging.functions.calc_wood('bottom', 'D', 'face');
                edging.functions.bottom_face_change();
            },

            bottomRface(e) {
                edging.functions.bottom_face_change();
            },

            leftZface(e) {
                edging.functions.calc_wood('left', 'Z', 'face');
                edging.functions.left_face_change();
            },

            leftWface(e) {
                edging.functions.calc_wood('left', 'W', 'face');
                edging.functions.left_face_change();
            },

            leftDface(e) {
                edging.functions.calc_wood('left', 'D', 'face');
                edging.functions.left_face_change();
            },


            leftRface(e) {
                edging.functions.left_face_change();
            },

            rightZface(e) {
                edging.functions.calc_wood('right', 'Z', 'face');
                edging.functions.right_face_change();
            },

            rightWface(e) {
                edging.functions.calc_wood('right', 'W', 'face');
                edging.functions.right_face_change();
            },

            rightDface(e) {
                edging.functions.calc_wood('right', 'D', 'face');
                edging.functions.right_face_change();
            },

            rightRface(e) {
                edging.functions.right_face_change();
            },

            allZface(e) {
                edging.functions.calc_wood('all', 'Z', 'face');
                edging.methods.all();
                edging.methods.all_grain_copy(false);

            },

            allWface(e) {
                edging.functions.calc_wood('all', 'W', 'face');
                edging.methods.all();
                edging.methods.all_grain_copy(false);
            },

            allDface(e) {
                edging.functions.calc_wood('all', 'D', 'face');
                edging.methods.all();
                edging.methods.all_grain_copy(false);
            },

            allRface(e) {
                edging.methods.all();
                edging.methods.all_grain_copy(false);
            },

            topZrear(e) {
                edging.functions.calc_wood('top', 'Z', 'rear');
                edging.functions.top_face_change();
            },

            topWrear(e) {
                edging.functions.calc_wood('top', 'W', 'rear');
                edging.functions.top_face_change();
            },

            topDrear(e) {
                edging.functions.calc_wood('top', 'D', 'rear');
                edging.functions.top_face_change();
            },

            topRrear(e) {
                edging.functions.top_face_change();
            },

            bottomZrear(e) {
                edging.functions.calc_wood('bottom', 'Z', 'rear');
                edging.functions.bottom_face_change();
            },

            bottomWrear(e) {
                edging.functions.calc_wood('bottom', 'W', 'rear');
                edging.functions.bottom_face_change();
            },

            bottomDrear(e) {
                edging.functions.calc_wood('bottom', 'D', 'rear');
                edging.functions.bottom_face_change();
            },

            bottomRrear(e) {
                edging.functions.bottom_face_change();
            },

            leftZrear(e) {
                edging.functions.calc_wood('left', 'Z', 'rear');
                edging.functions.left_face_change();
            },

            leftWrear(e) {
                edging.functions.calc_wood('left', 'W', 'rear');
                edging.functions.left_face_change();
            },

            leftDrear(e) {
                edging.functions.calc_wood('left', 'D', 'rear');
                edging.functions.left_face_change();
            },

            leftRrear(e) {
                edging.functions.left_face_change();
            },

            rightZrear(e) {
                edging.functions.calc_wood('right', 'Z', 'rear');
                edging.functions.right_face_change();
            },

            rightWrear(e) {
                edging.functions.calc_wood('right', 'W', 'rear');
                edging.functions.right_face_change();
            },

            rightDrear(e) {
                edging.functions.calc_wood('right', 'D', 'rear');
                edging.functions.right_face_change();
            },

            rightRrear(e) {
                edging.functions.right_face_change();
            },

            allZrear(e) {
                edging.functions.calc_wood('all', 'Z', 'rear');
                edging.methods.allRear();
            },

            allWrear(e) {
                edging.functions.calc_wood('all', 'W', 'rear');
                edging.methods.allRear();
            },

            allDrear(e) {
                edging.functions.calc_wood('all', 'D', 'rear');
                edging.methods.allRear();
            },

            allRrear(e) {
                edging.methods.allRear();
            },

            srez_top(e) {
                edging.functions.set_srez('srez_top', e.target);
            },
            srez_bottom(e) {
                edging.functions.set_srez('srez_bottom', e.target);
            },
            srez_left(e) {
                edging.functions.set_srez('srez_left', e.target);
            },
            srez_right(e) {
                edging.functions.set_srez('srez_right', e.target);
            },
            chamfer45(e) {
                if (Number(isClientalMaterial)) {
                    var chamfer45 = edging.getval('chamfer45');
                    if (chamfer45 && !kromkaChamfer45ShowMassege) {
                        kromkaChamfer45ShowMassege = 1;
                        showWarningMessage(LANG['CUSTOMER-MATERIAL-CHAMFER-45']);
                    }
                }
                edging.use('send_edges');
            }
        },
        functions: {
            calc(el) {
                var val = el.value;
                if (val !== '') {
                    if (isNaN(Number(val))) {
                        val = eval(val.replace(/,/g, '.')).toFixed(1);
                    } else{
                        val = parseFloat(val.replace(/,/g, '.')).toFixed(1);
                    }
                    el.value = val;
                }
                return val;
            },
            check_kromka(side, val) {
                var h = 0;
                if ([0, -1, 'faska', 'radius', 'srez'].indexOf(Number(val)) === -1) {
                    h = kromki[val][2];
                }

                // Проверка на наличие ручек со срезом под углом на выбранной стороне.
                switch (side) {
                    case 'left':
                        var sideNumber = 2;
                        break;
                    case 'right':
                        var sideNumber = 4;
                        break;
                    case 'top':
                        var sideNumber = 3;
                        break;
                    case 'bottom':
                        var sideNumber = 5;
                        break;
                }
                for(var tmpKey in detailShapesByPattern) {
                    var tmpShape = detailShapesByPattern[tmpKey];
                    if (sideNumber == tmpShape['edgeForHandleEdge'] && tmpShape['trimmed'] != undefined && Number(tmpShape['trimmed']) != 0 && Number(val) != 0) {
                        switch (side) {
                            case 'left':
                                kromkaLeft = 0;
                                edging.setval(side, kromkaLeft);
                                showErrorMessage(LANG['ON-LEFT-SIDE-RUCHKA-UGOL-ERROR']);
                                break;
                            case 'right':
                                kromkaRight = 0;
                                edging.setval(side, kromkaRight);
                                showErrorMessage(LANG['ON-RIGHT-SIDE-RUCHKA-UGOL-ERROR']);
                                break;
                            case 'top':
                                kromkaTop = 0;
                                edging.setval(side, kromkaTop);
                                showErrorMessage(LANG['ON-TOP-SIDE-RUCHKA-UGOL-ERROR']);
                                break;
                            case 'bottom':
                                kromkaBottom = 0;
                                edging.setval(side, kromkaBottom);
                                showErrorMessage(LANG['ON-BOTTOM-SIDE-RUCHKA-UGOL-ERROR']);
                                break;
                        }
                        return false;
                    }
                }

                if (h > 0 && h < detailThickness) { //для левого торца
                    showErrorMessage(LANG['WIDTH-KROMKA']+'(' + h + ' мм) '+LANG['MENSH-TOL-MAT']+' (' + detailThickness + ' мм).');
                    edging.setval(side, kromkaLeft);
                    return false;
                }

                if (val == -1) {
                    edging.showinput('srez_' + side + '_field');
                    edging.setval('srez_' + side, '');
                } else {
                    edging.hideinput('srez_' + side + '_field');
                    edging.setval('srez_' + side, '');
                }
                // }
                return true;
            },
            set_kromka(id, el) {
                var val_L = edging.getval('left');
                var val_R = edging.getval('right');
                var val_T = edging.getval('top');
                var val_B = edging.getval('bottom');

                if (val_L == val_R && val_R == val_T && val_T == val_B) {
                    edging.setval('all', val_L);
                }

                if (edging.functions.check_kromka(id, el.value)) {
                    switch (id){
                        case 'left':
                            changingSideArt = val_L;
                            break;
                        case 'top':
                            changingSideArt = val_T;
                            break;
                        case 'right':
                            changingSideArt = val_R;
                            break;
                        case 'bottom':
                            changingSideArt = val_B;
                            break;
                    }
                    edging.use('send_edges', [changingSideArt, id]);
                }

                if (constructorId == 'steklo' || (['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                    return;
                }

                var height = el.value;
                var compareHeight = (height == 0 || height == -1) ? 0 : kromki[height][2];


                /*
                 Вывод сообщения о нерациональном использовании кромки при ширине кромки >= 2*"толщина детали"
                 */

                if ((compareHeight > 2 * detailThickness && compareHeight > 23)) {
                    showMessage(LANG['WARNING-WIDTH-KRIKA-MORE-THAN-X2']);
                }
            },
            check_srez(id, el) {
                var value = el.value;
                if ((value < -45 || value > 45) || ((value/Math.floor(value))!==1) && value!=0) {
                    showErrorMessage(LANG['NEDOPUST-UGOL-SREZ']+'\n'+LANG['ZNACH-MUST-BE-TSELIM']+'\n'+LANG['OT-S'] + -45 + ' до ' + 45 + '.');
                    if (value > 45) {
                        el.value = '';
                    } else if(value < -45) {
                        el.value = '';
                    } else {
                        el.value = Math.floor(value);
                    }
                    edging.focus(id);
                    return false;
                }else{
                    el.value = Math.floor(value);
                    return true;
                }
            },
            set_srez(id, el) {
                edging.use('check_srez', [id, el]);
                edging.use('send_edges');
            },
            send_edges(changingSideArt, changingSide) {
                var left = edging.getval('left');
                var right = edging.getval('right');
                var top = edging.getval('top');
                var bottom = edging.getval('bottom');

                var s_left = edging.getval('srez_left');
                var s_right = edging.getval('srez_right');
                var s_top = edging.getval('srez_top');
                var s_bottom = edging.getval('srez_bottom');

                var cut_top = 0;
                var cut_bottom = 0;

                var chamfer45 = edging.getval('chamfer45');

                if (constructorId == 'stol') {
                    cut_top = edging.getval('cut_top');
                    cut_bottom = edging.getval('cut_bottom');
                }

                g_detail.setOperation(
                    'edge',
                    {
                        detail_key: detailKey,
                        kromkaLeft: (left == -1) ? 0 : left,
                        kromkaTop: (top == -1) ? 0 : top,
                        kromkaRight: (right == -1) ? 0 : right,
                        kromkaBottom: (bottom == -1) ? 0 : bottom,
                        srezLeft: s_left,
                        srezTop: s_top,
                        srezRight: s_right,
                        srezBottom: s_bottom,
                        cutTop: cut_top,
                        cutBottom: cut_bottom,
                        chamfer45: (chamfer45) ? 1 : 0,
                    },
                    function (inData) {
                        var data = inData[0];
                        if (data['warning']){
                            showWarningMessage(data['warning']);
                            edging.setval('left', kromkaLeft);
                            edging.setval('srez_left', '');
                            edging.hideinput('srez_left_field');
                            edging.setval('top', kromkaTop);
                            edging.setval('srez_top', '');
                            edging.hideinput('srez_top_field');
                            edging.setval('right', kromkaTop);
                            edging.setval('srez_right', '');
                            edging.hideinput('srez_right_field');
                            edging.setval('bottom', kromkaTop);
                            edging.setval('srez_bottom', '');
                            edging.hideinput('srez_bottom_field');
                            return;
                        } else{
                            edging.functions.updateKromkaBlock(changingSideArt, changingSide);
                        }
                        if (data['left']['type'] == 'error') {
                            showErrorMessage(data['left']['msg']);
                            edging.setval('left', kromkaLeft);
                            edging.setval('srez_left', '');
                            edging.hideinput('srez_left_field');
                        } else if (data['top']['type'] == 'error') {
                            showErrorMessage(data['top']['msg']);
                            edging.setval('top', kromkaTop);
                            edging.setval('srez_top', '');
                            edging.hideinput('srez_top_field');
                        } else if (data['right']['type'] == 'error') {
                            showErrorMessage(data['right']['msg']);
                            edging.setval('right', kromkaTop);
                            edging.setval('srez_right', '');
                            edging.hideinput('srez_right_field');
                        } else if (data['bottom']['type'] == 'error') {
                            showErrorMessage(data['bottom']['msg']);
                            edging.setval('bottom', kromkaTop);
                            edging.setval('srez_bottom', '');
                            edging.hideinput('srez_bottom_field');
                        } else if (data != '') {
                            sLeft = data['left']['type'] == 'srez' ? Number(data['left']['param']) : 0;
                            sRight = data['right']['type'] == 'srez' ? Number(data['right']['param']) : 0;
                            sTop = data['top']['type'] == 'srez' ? Number(data['top']['param']) : 0;
                            sBottom = data['bottom']['type'] == 'srez' ? Number(data['bottom']['param']) : 0;

                            kromkaLeft = Number(data['left']['param']);
                            kromkaRight = Number(data['right']['param']);
                            kromkaTop = Number(data['top']['param']);
                            kromkaTopCut = Number(data['top']['cut']);
                            kromkaBottom = Number(data['bottom']['param']);
                            kromkaBottomCut = Number(data['bottom']['cut']);
                            if (Number(data['left']['param']) && data['left']['chamfer45'] == 1 ||
                                Number(data['right']['param']) && data['right']['chamfer45'] == 1 ||
                                Number(data['top']['param']) && data['top']['chamfer45'] == 1 ||
                                Number(data['bottom']['param']) && data['bottom']['chamfer45'] == 1) {
                                kromkaChamfer45 = 1;
                            } else {
                                kromkaChamfer45 = 0;
                            }
                            edging.setval('chamfer45', kromkaChamfer45);
                            var is2mm = kromki &&
                                (data['left']['param'] && kromki[data['left']['param']] && kromki[data['left']['param']][1] == 2 ||
                                    data['right']['param'] && kromki[data['right']['param']] && kromki[data['right']['param']][1] == 2 ||
                                    data['top']['param'] && kromki[data['top']['param']] && kromki[data['top']['param']][1] == 2 ||
                                    data['bottom']['param'] && kromki[data['bottom']['param']] && kromki[data['bottom']['param']][1] == 2);
                            var isNotLazer = kromki &&
                                (data['left']['param'] && kromki[data['left']['param']] && kromki[data['left']['param']][4] != 'lazer' ||
                                    data['right']['param'] && kromki[data['right']['param']] && kromki[data['right']['param']][4] != 'lazer' ||
                                    data['top']['param'] && kromki[data['top']['param']] && kromki[data['top']['param']][4] != 'lazer' ||
                                    data['bottom']['param'] && kromki[data['bottom']['param']] && kromki[data['bottom']['param']][4] != 'lazer');
                            if (is2mm && isNotLazer && detailThickness >= 16) {
                                edging.showinput('chamfer45Field');
                            } else {
                                edging.hideinput('chamfer45Field');
                            }
                            kLeftThick = Number(kromkaLeft == 0 || sLeft ? 0 : kromki[kromkaLeft][1].toString().replace(/,/, '.'));
                            kRightThick = Number(kromkaRight == 0 || sRight ? 0 : kromki[kromkaRight][1].toString().replace(/,/, '.'));
                            kTopThick = Number(kromkaTop == 0 || sTop ? 0 : kromki[kromkaTop][1].toString().replace(/,/, '.'));
                            kBottomThick = Number(kromkaBottom == 0 || sBottom ? 0 : kromki[kromkaBottom][1].toString().replace(/,/, '.'));
                            kLeftHeight = (kromkaLeft == 0 || sLeft) ? 0 : kromki[kromkaLeft][2];
                            kRightHeight = (kromkaRight == 0 || sRight) ? 0 : kromki[kromkaRight][2];
                            kTopHeight = (kromkaTop == 0 || sTop) ? 0 : kromki[kromkaTop][2];
                            kBottomHeight = (kromkaBottom == 0 || sBottom) ? 0 : kromki[kromkaBottom][2];

                            if (data.detail.corner[1] != null || data.detail.corner[2] != null || data.detail.corner[4] != null) {
                                detailFullHeight = data.detail.height;
                                W = detailFullHeight;

                            } else {
                                detailFullWidth = data.detail.fullWidth;
                                L = detailFullWidth;
                                detailFullHeight = data.detail.fullHeight;
                                W = detailFullHeight;
                            }
                            //обновляем данные сверления после работы с кромкой
                            if (constructorId != 'stol') {
                                var drilling = g_detail.getModule('drilling');
                                if (drilling){
                                    drilling.functions.updateHolesAfterKromka();
                                }
                                var grooving = g_detail.getModule('grooving');
                                if (grooving){
                                    grooving.use('data', [inData.grooves]);
                                    grooving.use('table');
                                    grooving.change('side');
                                    grooving.change('direct');
                                }
                                var rabbeting = g_detail.getModule('rabbeting');
                                if (rabbeting) {
                                    rabbeting.use('data', [inData.rabbets]);
                                    rabbeting.use('table');
                                }
                            }

                            setDetailDesc();
                            draw();
                        }
                    }
                );
            },
            send_edges_wood() {
                var data = edging.functions.get_data_wood();

                g_detail.setOperation(
                    'edge_wood',
                    {
                        detail_key: detailKey,
                        data: data,
                    },
                    function (data) {
                        edging.functions.set_data_wood(data[0]);
                        setDetailDesc();
                        edging.methods.all();
                        edging.methods.allRear();
                        draw();
                    }
                );

            },
            disabledFields() {
                var grains = ["face", "rear"];
                var sides = ["left", "top", 'right', 'bottom', 'all'];


                grains.forEach(function (grain, i, grains) {
                    sides.forEach(function (side, i, sides) {
                        edging.setval(side + 'D' + grain, 45);
                        edging.disabled(side + 'D' + grain, true);
                        edging.disabled(side + 'W' + grain, true);
                    });
                });


            },
            degreesToRadians(degrees) {
                return degrees * Math.PI / 180;
            },
            radiansToDegrees(radians) {
                return radians / (Math.PI / 180);
            },
            calc_wood(side, value, grain) {

                if (value == "Z") {
                    if (edging.getval(side + "Z" + grain) != '' && edging.getval(side + "D" + grain) != '') {
                        var d = edging.functions.degreesToRadians(parseFloat(edging.getval(side + "D" + grain)));
                        edging.setval(side + "W" + grain, Math.round(parseFloat(edging.getval(side + "Z" + grain)) * Math.tan((d))));
                        return;
                    }

                    if (edging.getval(side + "Z" + grain) != '' && edging.getval(side + "W" + grain) != '') {
                        var tanD = Math.atan(parseFloat(edging.getval(side + "Z" + grain) / parseFloat(edging.getval(side + "W" + grain))));
                        edging.setval(side + "D" + grain, (90 - Math.round(edging.functions.radiansToDegrees(tanD))));
                        return;
                    }
                }

                if (value == "D") {
                    if (edging.getval(side + "D" + grain) != '' && edging.getval(side + "W" + grain) != '') {
                        var d = edging.functions.degreesToRadians(parseFloat(edging.getval(side + "D" + grain)));
                        edging.setval(side + "Z" + grain, Math.round(parseFloat(edging.getval(side + "W" + grain)) * Math.tan((d))));
                        return;
                    }

                    if (edging.getval(side + "D" + grain) != '' && edging.getval(side + "Z" + grain) != '') {
                        var d = edging.functions.degreesToRadians(parseFloat(edging.getval(side + "D" + grain)));
                        edging.setval(side + "W" + grain, Math.round(parseFloat(edging.getval(side + "Z" + grain)) * Math.tan((d))));
                        return;
                    }
                }

                if (value == "W") {
                    if (edging.getval(side + "W" + grain) != '' && edging.getval(side + "Z" + grain) != '') {
                        var tanD = Math.atan(parseFloat(edging.getval(side + "Z" + grain) / parseFloat(edging.getval(side + "W" + grain))));
                        edging.setval(side + "D" + grain, (90 - Math.round(edging.functions.radiansToDegrees(tanD))));
                        return;
                    }

                    if (edging.getval(side + "W" + grain) != '' && edging.getval(side + "D" + grain) != '') {
                        var d = edging.functions.degreesToRadians(parseFloat(edging.getval(side + "D" + grain)));
                        edging.setval(side + "Z" + grain, Math.round(parseFloat(edging.getval(side + "W" + grain)) * Math.tan((d))));
                        return;
                    }
                }


            },
            clear_grain(side, grain) {
                edging.setval(side + "Z" + grain, 0);
                edging.setval(side + "D" + grain, 45);
                edging.setval(side + "W" + grain, 0);
            },
            check_edges_wood() {
                var left_face_filled = 0;
                var right_face_filled = 0;
                var top_face_filled = 0;
                var bottom_face_filled = 0;

                var left_rear_filled = 0;
                var right_rear_filled = 0;
                var top_rear_filled = 0;
                var bottom_rear_filled = 0;

                if (edging.getval('left') == 'faska') {
                    if (edging.getval('leftZface') != '') {
                        left_face_filled++;
                    }

                    if (edging.getval('leftDface') != '') {
                        left_face_filled++;
                    }

                    if (edging.getval('leftWface') != '') {
                        left_face_filled++;
                    }

                    if (left_face_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (edging.getval('right') == 'faska') {
                    if (edging.getval('rightZface') != '') {
                        right_face_filled++;
                    }

                    if (edging.getval('rightDface') != '') {
                        right_face_filled++;
                    }

                    if (edging.getval('rightWface') != '') {
                        right_face_filled++;
                    }

                    if (right_face_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (edging.getval('top') == 'faska') {
                    if (edging.getval('topZface') != '') {
                        top_face_filled++;
                    }

                    if (edging.getval('topDface') != '') {
                        top_face_filled++;
                    }

                    if (edging.getval('topWface') != '') {
                        top_face_filled++;
                    }

                    if (top_face_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;

                    }
                }

                if (edging.getval('bottom') == 'faska') {
                    if (edging.getval('bottomZface') != '') {
                        bottom_face_filled++;
                    }

                    if (edging.getval('bottomDface') != '') {
                        bottom_face_filled++;
                    }

                    if (edging.getval('bottomWface') != '') {
                        bottom_face_filled++;
                    }

                    if (bottom_face_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (edging.getval('leftRear') == 'faska') {
                    if (edging.getval('leftZrear') != '') {
                        left_rear_filled++;
                    }

                    if (edging.getval('leftDrear') != '') {
                        left_rear_filled++;
                    }

                    if (edging.getval('leftWrear') != '') {
                        left_rear_filled++;
                    }

                    if (left_rear_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;

                    }
                }

                if (edging.getval('rightRear') == 'faska') {
                    if (edging.getval('rightZrear') != '') {
                        right_rear_filled++;
                    }

                    if (edging.getval('rightDrear') != '') {
                        right_rear_filled++;
                    }

                    if (edging.getval('rightWrear') != '') {
                        right_rear_filled++;
                    }

                    if (right_rear_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (edging.getval('topRear') == 'faska') {
                    if (edging.getval('topZrear') != '') {
                        top_rear_filled++;
                    }

                    if (edging.getval('topDrear') != '') {
                        top_rear_filled++;
                    }

                    if (edging.getval('topWrear') != '') {
                        top_rear_filled++;
                    }

                    if (top_rear_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (edging.getval('bottomRear') == 'faska') {
                    if (edging.getval('bottomZrear') != '') {
                        bottom_rear_filled++;
                    }

                    if (edging.getval('bottomDrear') != '') {
                        bottom_rear_filled++;
                    }

                    if (edging.getval('bottomWrear') != '') {
                        bottom_rear_filled++;
                    }

                    if (bottom_rear_filled < 2) {
                        showErrorMessage(LANG['NANES-FASKA-MUST-BE-FULL-2-FIELDS']);
                        return false;
                    }
                }

                if (Number(edging.getval('bottomZrear')) + Number(edging.getval('bottomZface')) > detailThickness) {
                    showErrorMessage(LANG['OBSHAYA-DETH-OBR-TORTS']+` (${Number(edging.getval('bottomZrear')) + Number(edging.getval('bottomZface'))}). `+LANG['MUST-BE-NO-MORE']+` ${detailThickness}.`);
                    return false;
                }

                if (Number(edging.getval('topZrear')) + Number(edging.getval('topZface')) > detailThickness) {
                    showErrorMessage(LANG['OBSHAYA-DETH-OBR-TORTS']+` (${Number(edging.getval('topZrear')) + Number(edging.getval('topZface'))}). `+LANG['MUST-BE-NO-MORE']+` ${detailThickness}.`);
                    return false;
                }

                if (Number(edging.getval('leftZrear')) + Number(edging.getval('leftZface')) > detailThickness) {
                    showErrorMessage(LANG['OBSHAYA-DETH-OBR-TORTS']+` (${Number(edging.getval('leftZrear')) + Number(edging.getval('leftZface'))}). `+LANG['MUST-BE-NO-MORE']+` ${detailThickness}.`);
                    return false;
                }

                if (Number(edging.getval('rightZrear')) + Number(edging.getval('rightZface')) > detailThickness) {
                    showErrorMessage(LANG['OBSHAYA-DETH-OBR-TORTS']+` (${Number(edging.getval('rightZrear')) + Number(edging.getval('rightZface'))}). `+LANG['MUST-BE-NO-MORE']+` ${detailThickness}.`);
                    return false;
                }

                return true;

            },
            top_face_change() {
                edging.methods.top_grain_copy(false);
            },
            left_face_change() {
                edging.methods.left_grain_copy(false);
            },
            right_face_change() {
                edging.methods.right_grain_copy(false);
            },
            bottom_face_change() {
                edging.methods.bottom_grain_copy(false);
            },

            all_face_change() {
                edging.methods.all_grain_copy(false);
            },

            get_data_wood() {

                var edges_wood = {
                    face: {
                        left: {type: ''},
                        right: {type: ''},
                        top: {type: ''},
                        bottom: {type: ''},
                    },
                    rear: {
                        left: {type: ''},
                        right: {type: ''},
                        top: {type: ''},
                        bottom: {type: ''},
                    },
                };
                var setEdgeWood = function (id, type, value) {
                    if (!edges_wood[id]) {
                        edges_wood[id] = {};
                    }

                    if (type == 'faska') {
                        var d = edging.getval(value + 'D' + id);
                        var z = edging.getval(value + 'Z' + id);
                        var w = edging.getval(value + 'W' + id);
                        edges_wood[id][value] = {type: type, d: d, z: z, w: w};
                    }

                    if (type == 'radius') {
                        var r = edging.getval(value + 'R' + id);
                        edges_wood[id][value] = {type: type, r: r};
                    }

                    if (type == 'rect') {
                        edges_wood[id][value] = {type: type};
                    }

                    if (type == 'R2faska') {
                        var r = edging.getval(value + 'R' + id);
                        var d = edging.getval(value + 'D' + id);
                        var z = edging.getval(value + 'Z' + id);
                        var w = edging.getval(value + 'W' + id);
                        edges_wood[id][value] = {type: type, r: r, d: d, z: z, w: w};
                    }

                    if (type == 'arc') {
                        var r = '';
                        var sel = edging.getinput(value);
                        $(sel.options).each(function () {
                            if ($(this).is(':selected')) {
                                r = $(this).attr('r');
                            }
                        });
                        edges_wood[id][value] = {type: type, r: r};
                    }
                    if (type == "srez") {
                        var param = edging.getval("srez_" + value);
                        edges_wood[id][value] = {type: type, param: param};
                    }

                };
                for (var key in strings.edgesides) {
                    var value = strings.edgesides[key];
                    var type = edging.getval(value);
                    setEdgeWood('face', type, value);
                    type = edging.getval(value + "Rear");
                    setEdgeWood('rear', type, value);
                }
                return edges_wood;
            },

            set_data_wood(data) {
                for (var key in strings.edgesides) {
                    var value = strings.edgesides[key];
                    if (data['face'][value]['type'] == '') {
                        edging.setval(value, 0);
                    } else {
                        edging.setval(value, data['face'][value]['type']);
                    }
                    if (data['rear'][value]['type'] == '') {
                        edging.setval(value + "Rear", 0);
                    } else {
                        edging.setval(value + "Rear", data['rear'][value]['type']);
                    }
                    if (data['face'][value]['type'] == "faska") {
                        edging.setval(value + "Zface", data['face'][value]['z']);
                        edging.setval(value + "Wface", data['face'][value]['w']);
                        edging.setval(value + "Dface", data['face'][value]['d']);
                    }
                    if (data['face'][value]['type'] == "radius") {
                        edging.setval(value + "Rface", data['face'][value]['r']);
                    }
                    if (data['rear'][value]['type'] == "faska") {
                        edging.setval(value + "Zrear", data['rear'][value]['z']);
                        edging.setval(value + "Wrear", data['rear'][value]['w']);
                        edging.setval(value + "Drear", data['rear'][value]['d']);
                    }
                    if (data['rear'][value]['type'] == "radius") {
                        edging.setval(value + "Rrear", data['rear'][value]['r']);
                    }
                    if (data['face'][value]['type'] == "R2faska") {
                        edging.setval(value + "Rface", data['face'][value]['r']);
                    }
                    if (data['rear'][value]['type'] == "R2faska") {
                        edging.setval(value + "Zrear", data['rear'][value]['z']);
                        edging.setval(value + "Wrear", data['rear'][value]['w']);
                        edging.setval(value + "Drear", data['rear'][value]['d']);
                    }
                    if (data['face'][value]['type'] == "srez") {
                        edging.setval(value + "Face", data['face'][value]['type']);
                        edging.setval("srez_" + value, data['face'][value]['param']);
                    }
                }

                edging.methods.left();
                edging.methods.right();
                edging.methods.top();
                edging.methods.bottom();

                edging.methods.leftRear();
                edging.methods.rightRear();
                edging.methods.topRear();
                edging.methods.bottomRear();
            },

            rectInterFace(side, grain) {
                var value = (grain == 'face') ? edging.getval(side) : edging.getval(side + 'Rear');
                if (value == 'rect' || value == 'arc') {
                    if (value == 'rect') {
                        edging.setval(side + 'Rear', 'rect');
                        edging.setval(side, 'rect');
                    }
                    if (value == 'arc') {
                        edging.setval(side + 'Rear', 'arc');
                        edging.setval(side, 'arc');
                    }
                    edging.hideinput(side + '_grain_copy');
                    edging.hideinput(side + 'Rear');
                    edging.getinput(side).style['width'] = '86%';
                    edging.hideinput(side + 'FaceSection');
                    edging.hideinput(side + 'RearSection');

                } else {
                    edging.showinput(side + '_grain_copy');
                    edging.showinput(side + 'Rear');
                    edging.showinput(side);
                    edging.getinput(side).style['width'] = '37%';
                    edging.getinput(side + 'Rear').style['width'] = '37%';
                    if (edging.getval(side + 'Rear') == 'rect' || edging.getval(side + 'Rear') == 'arc') {
                        if (edging.getval(side + "Rear")) {
                            edging.setval(side + "Rear", '0');
                        }
                    }
                    edging.use[side];
                    edging.use[side + 'Rear'];
                }

            },


            edge_select(detail) {

                var data = detail.data_edges;

                data.data_edges_wood = detail.data_edges_wood;
                kromki = [];
                edgeList.forEach(edge => {
                    kromki[edge['guid']] = [
                        edge['title'],
                        edge['thickness'],
                        edge['height'],
                        edge['number'],
                        edge['type'],
                    ];
                });

                var left = edging.getinput('left');
                var right = edging.getinput('right');
                var top = edging.getinput('top');
                var bottom = edging.getinput('bottom');
                var leftRear = edging.getinput('leftRear');
                var rightRear = edging.getinput('rightRear');
                var topRear = edging.getinput('topRear');
                var bottomRear = edging.getinput('bottomRear');
                var all = edging.getinput('all');
                var allRear = edging.getinput('allRear');

                left.options.length = 0;
                right.options.length = 0;
                top.options.length = 0;
                bottom.options.length = 0;
                all.options.length = 0;

                left.options[0] = new Option(LANG['NO'], 0);
                right.options[0] = new Option(LANG['NO'], 0);
                top.options[0] = new Option(LANG['NO'], 0);
                bottom.options[0] = new Option(LANG['NO'], 0);
                all.options[0] = new Option(LANG['NO'], 0);
                if (materialType == 'compact') {
                    all.options[0] = new Option('', '');
                    all.options[1] = new Option(LANG['NO'], 0);
                }

                if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                    allRear.options.length = 0;
                    leftRear.options[0] = new Option(LANG['NO'], 0);
                    rightRear.options[0] = new Option(LANG['NO'], 0);
                    topRear.options[0] = new Option(LANG['NO'], 0);
                    bottomRear.options[0] = new Option(LANG['NO'], 0);
                    allRear.options[0] = new Option(LANG['NO'], 0);
                    if (materialType == 'compact') {
                        allRear.options[0] = new Option('', '');
                        allRear.options[1] = new Option(LANG['NO'], 0);
                    }
                }


                var i = 1;
                for (var key in kromki) {
                    var num = constructorId == 'dsp' ? kromki[key][3] : i + '. ';
                    var v = num + kromki[key][0];
                    var k = key;
                    left.options[left.options.length] = new Option(v, k);
                    right.options[right.options.length] = new Option(v, k);
                    top.options[top.options.length] = new Option(v, k);
                    bottom.options[bottom.options.length] = new Option(v, k);
                    if (all) {
                        all.options[all.options.length] = new Option(v, k);
                    }
                    i++;
                }

                if (['dsp', 'stol'].indexOf(constructorId) !== -1) {
                    if (!['wood', 'compact'].includes(materialType) && !isMillAdditives) {
                        if (!fromViyarEmail){ //запрещаем срез для тех, у кого учетка с вияр
                            left.options[left.options.length] = new Option(LANG['SREZ-POD-UGL'], -1);
                            right.options[right.options.length] = new Option(LANG['SREZ-POD-UGL'], -1);
                            if (constructorId != 'stol') {
                                top.options[top.options.length] = new Option(LANG['SREZ-POD-UGL'], -1);
                                bottom.options[bottom.options.length] = new Option(LANG['SREZ-POD-UGL'], -1);
                            }
                        }
                    }
                    else {
                        left.options[left.options.length] = new Option('Фаска', 'faska');
                        right.options[right.options.length] = new Option('Фаска', 'faska');
                        top.options[top.options.length] = new Option('Фаска', 'faska');
                        bottom.options[bottom.options.length] = new Option('Фаска', 'faska');

                        left.options[left.options.length] = new Option('ДугаR13', 'arc');
                        left.options[left.options.length - 1].setAttribute("r", "13");
                        right.options[right.options.length] = new Option('ДугаR13', 'arc');
                        right.options[right.options.length - 1].setAttribute("r", "13");
                        top.options[top.options.length] = new Option('ДугаR13', 'arc');
                        top.options[top.options.length - 1].setAttribute("r", "13");
                        bottom.options[bottom.options.length] = new Option('ДугаR13', 'arc');
                        bottom.options[bottom.options.length - 1].setAttribute("r", "13");

                        if (!['compact'].includes(materialType)) {
                            left.options[left.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            right.options[right.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            top.options[top.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            bottom.options[bottom.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');

                            left.options[left.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            right.options[right.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            top.options[top.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            bottom.options[bottom.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                        } else {
                            left.options[left.options.length] = new Option(LANG['SREZ-POD-UGL'], 'srez');
                            right.options[right.options.length] = new Option(LANG['SREZ-POD-UGL'], 'srez');
                            top.options[top.options.length] = new Option(LANG['SREZ-POD-UGL'], 'srez');
                            bottom.options[bottom.options.length] = new Option(LANG['SREZ-POD-UGL'], 'srez');
                        }

                        leftRear.options[leftRear.options.length] = new Option('Фаска', 'faska');
                        rightRear.options[rightRear.options.length] = new Option('Фаска', 'faska');
                        topRear.options[topRear.options.length] = new Option('Фаска', 'faska');
                        bottomRear.options[bottomRear.options.length] = new Option('Фаска', 'faska');

                        leftRear.options[leftRear.options.length] = new Option('ДугаR13', 'arc');
                        leftRear.options[leftRear.options.length - 1].setAttribute("r", "13");
                        rightRear.options[rightRear.options.length] = new Option('ДугаR13', 'arc');
                        rightRear.options[rightRear.options.length - 1].setAttribute("r", "13");
                        topRear.options[topRear.options.length] = new Option('ДугаR13', 'arc');
                        topRear.options[topRear.options.length - 1].setAttribute("r", "13");
                        bottomRear.options[bottomRear.options.length] = new Option('ДугаR13', 'arc');
                        bottomRear.options[bottomRear.options.length - 1].setAttribute("r", "13");

                        if (!['compact'].includes(materialType)) {
                            leftRear.options[leftRear.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            rightRear.options[rightRear.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            topRear.options[topRear.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            bottomRear.options[bottomRear.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');

                            leftRear.options[leftRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            rightRear.options[rightRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            topRear.options[topRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            bottomRear.options[bottomRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                        }


                        all.options[all.options.length] = new Option('Фаска', 'faska');
                        allRear.options[allRear.options.length] = new Option('Фаска', 'faska');

                        if (materialType == 'compact') {
                            // all.options[all.options.length] = new Option('R2 + фаска 9х9мм', 'R2faska');
                            // allRear.options[allRear.options.length] = new Option('R2 + фаска 9х9мм', 'R2faska');

                            all.options[all.options.length] = new Option('ДугаR13', 'arc');
                            allRear.options[allRear.options.length] = new Option('ДугаR13', 'arc');

                        } else {
                            all.options[all.options.length] = new Option(LANG['RADIUS-B'], 'radius');
                            allRear.options[allRear.options.length] = new Option(LANG['RADIUS-B'], 'radius');

                            all.options[all.options.length] = new Option('ДугаR13', 'arc');
                            allRear.options[allRear.options.length] = new Option('ДугаR13', 'arc');

                            all.options[all.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                            allRear.options[allRear.options.length] = new Option(LANG['FREZ-L-PRAM'], 'rect');
                        }

                        return;
                    }
                }

                ['srez_top', 'srez_left', 'srez_bottom', 'srez_right'].forEach(s => {
                    edging.setval(s, '');
                    edging.hideinput(s + '_field');
                });

                kromkaLeft = Number(data['left']['param']);
                kromkaRight = Number(data['right']['param']);
                kromkaTop = Number(data['top']['param']);
                kromkaTopCut = Number(data['top']['cut']);
                kromkaBottom = Number(data['bottom']['param']);
                kromkaBottomCut = Number(data['bottom']['cut']);
                kromkaAll = '';

                if (kromkaLeft == kromkaRight && kromkaRight == kromkaBottom && kromkaBottom == kromkaTop && kromkaLeft != '' && kromkaLeft != 'srez') {
                    kromkaAll = kromkaLeft;
                }

                sLeft = data['left']['type'] == 'srez' ? Number(data['left']['param']) : 0;
                sRight = data['right']['type'] == 'srez' ? Number(data['right']['param']) : 0;
                sTop = data['top']['type'] == 'srez' ? Number(data['top']['param']) : 0;
                sBottom = data['bottom']['type'] == 'srez' ? Number(data['bottom']['param']) : 0;

                if (Number(data['left']['param']) && data['left']['chamfer45'] == 1 ||
                    Number(data['right']['param']) && data['right']['chamfer45'] == 1 ||
                    Number(data['top']['param']) && data['top']['chamfer45'] == 1 ||
                    Number(data['bottom']['param']) && data['bottom']['chamfer45'] == 1) {
                    kromkaChamfer45 = 1;
                } else {
                    kromkaChamfer45 = 0;
                }

                kLeftThick = Number((kromkaLeft == 0) || sLeft ? 0 : kromki[kromkaLeft][1].toString().replace(/,/, '.'));
                kRightThick = Number((kromkaRight == 0) || sRight ? 0 : kromki[kromkaRight][1].toString().replace(/,/, '.'));
                kTopThick = Number((kromkaTop == 0) || sTop ? 0 : kromki[kromkaTop][1].toString().replace(/,/, '.'));
                kBottomThick = Number((kromkaBottom == 0) || sBottom ? 0 : kromki[kromkaBottom][1].toString().replace(/,/, '.'));
                kAllThick = Number((kromkaBottom == 0) || sBottom ? 0 : kromki[kromkaBottom][1].toString().replace(/,/, '.'));
                kLeftHeight = (kromkaLeft == 0 || sLeft) ? 0 : kromki[kromkaLeft][2];
                kRightHeight = (kromkaRight == 0 || sRight) ? 0 : kromki[kromkaRight][2];
                kTopHeight = (kromkaTop == 0 || sTop) ? 0 : kromki[kromkaTop][2];
                kBottomHeight = (kromkaBottom == 0 || sBottom) ? 0 : kromki[kromkaBottom][2];
                kAllHeight = (kromkaBottom == 0 || sBottom) ? 0 : kromki[kromkaBottom][2];

                edging.setval('srez_left', sLeft);
                edging.setval('srez_right', sRight);
                edging.setval('srez_top', sTop);
                edging.setval('srez_bottom', sBottom);

                edging.setval('left', kromkaLeft);
                edging.setval('right', kromkaRight);
                edging.setval('top', kromkaTop);
                edging.setval('bottom', kromkaBottom);
                edging.setval('all', kromkaAll);

                edging.setval('chamfer45', kromkaChamfer45);
                var is2mm = kromki &&
                    (data['left']['param'] && kromki[data['left']['param']] && kromki[data['left']['param']][1] == 2 ||
                        data['right']['param'] && kromki[data['right']['param']] && kromki[data['right']['param']][1] == 2 ||
                        data['top']['param'] && kromki[data['top']['param']] && kromki[data['top']['param']][1] == 2 ||
                        data['bottom']['param'] && kromki[data['bottom']['param']] && kromki[data['bottom']['param']][1] == 2);
                var isNotLazer = kromki &&
                    (data['left']['param'] && kromki[data['left']['param']] && kromki[data['left']['param']][4] != 'lazer' ||
                        data['right']['param'] && kromki[data['right']['param']] && kromki[data['right']['param']][4] != 'lazer' ||
                        data['top']['param'] && kromki[data['top']['param']] && kromki[data['top']['param']][4] != 'lazer' ||
                        data['bottom']['param'] && kromki[data['bottom']['param']] && kromki[data['bottom']['param']][4] != 'lazer');
                if (is2mm && isNotLazer && detailThickness >= 16) {
                    edging.showinput('chamfer45Field');
                } else {
                    edging.hideinput('chamfer45Field');
                }

                if (sLeft) {
                    edging.setval('left', '-1');
                    edging.showinput('srez_left_field');
                } else {
                    edging.hideinput('srez_left_field');
                }
                if (sRight) {
                    edging.setval('right', '-1');
                    edging.showinput('srez_right_field');
                } else {
                    edging.hideinput('srez_right_field');
                }
                if (sTop) {
                    edging.setval('top', '-1');
                    edging.showinput('srez_top_field');
                } else {
                    edging.hideinput('srez_top_field');
                }
                if (sBottom) {
                    edging.setval('bottom', '-1');
                    edging.showinput('srez_bottom_field');
                } else {
                    edging.hideinput('srez_bottom_field');
                }

                if (constructorId == 'stol') {
                    if (data['top']['cut']) {
                        edging.setval('cut_top', data['top']['cut']);
                    }
                    if (data['bottom']['cut']) {
                        edging.setval('cut_bottom', data['bottom']['cut']);
                    }
                }
            },
            data(data) {
                if (data && data['edges_data'] && data.edges_data.length) {
                    edgeList = data.edges_data;
                } else {
                    edgeList = [];
                }
            },
            //метод для обновления блока с кромкой в шапке после смены кромки
            updateKromkaBlock(changingSideArt, changingSide){
                var artToDrop = [];
                var numberToDrop = [];
                var artToDropWithOutDuplicate = [];
                var numberToDropWithOutDuplicate = [];
                var sides = ['top', 'right', 'left', 'bottom'];
                
                if (changingSide == 'all'){
                    $.each(sides, function(i, el){
                        if (edgeArt[i] != 0){
                            artToDrop.push(edgeArt[i]);
                            numberToDrop.push($('#'+edgeArt[i]).attr('attrNumber'));
                        } 
                    });
                    //удаляем дубликаты 
                    $.each(artToDrop, function(i, el){
                        if($.inArray(el, artToDropWithOutDuplicate) === -1) artToDropWithOutDuplicate.push(el);
                    });
                    $.each(numberToDrop, function(i, el){
                        if($.inArray(el, numberToDropWithOutDuplicate) === -1) numberToDropWithOutDuplicate.push(el);
                    });
                
                    if (changingSideArt && changingSideArt != '0'){;
                        numberToDropWithOutDuplicate.push($('#'+changingSideArt).attr('attrNumber'));
                        artToDropWithOutDuplicate.push(changingSideArt);
                    }
                    var changingSideArtDataSend = true;
                } else {
                    if (changingSideArt && changingSideArt != '0'){
                        numberToDropWithOutDuplicate.push($('#'+changingSideArt).attr('attrNumber'));
                        artToDropWithOutDuplicate.push(changingSideArt);
                    }
                    if (edgeArt != 0){
                        artToDropWithOutDuplicate.push(edgeArt);
                        numberToDropWithOutDuplicate.push($('#'+edgeArt).attr('attrNumber'));
                    }
                    var changingSideArtDataSend = true;
                }
                //запрос
                if (changingSideArtDataSend && numberToDropWithOutDuplicate){
                    artToDropWithOutDuplicate.forEach(function(item, i, arr) {
                        $.get("/service/templates/edgeBlock.php", { numberOfBlock: numberToDropWithOutDuplicate[i], changingSideArtJ: item }, function (edgeBlock) {
                            //обновляем блок
                            $('#'+item).replaceWith(edgeBlock);
                            $("#sel-edges .item-top").css('display', 'block');
                        });
                    });
                }
            }
        },
        init(data, global_data) {
            if (constructorId == 'stol') {
                edging.addInput('cut_top', function () {
                    return document.getElementById('cut_top');
                });
                edging.addInput('cut_bottom', function () {
                    return document.getElementById('cut_bottom');
                });
            }

            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                edging.addInput('topRear', function () {
                    return document.getElementById('kromkaTopRear');
                });
                edging.addInput('bottomRear', function () {
                    return document.getElementById('kromkaBottomRear');
                });
                edging.addInput('leftRear', function () {
                    return document.getElementById('kromkaLeftRear');
                });
                edging.addInput('rightRear', function () {
                    return document.getElementById('kromkaRightRear');
                });

                edging.addInput('faska_bottom_field_face', function () {
                    return document.getElementById('faska_bottom_field_face');
                });

                edging.addInput('faska_top_field_face', function () {
                    return document.getElementById('faska_top_field_face');
                });

                edging.addInput('faska_all_field_face', function () {
                    return document.getElementById('faska_all_field_face');
                });

                edging.addInput('faska_all_field_rear', function () {
                    return document.getElementById('faska_all_field_rear');
                });

                edging.addInput('faska_left_field_face', function () {
                    return document.getElementById('faska_left_field_face');
                });

                edging.addInput('faska_right_field_face', function () {
                    return document.getElementById('faska_right_field_face');
                });

                edging.addInput('faska_bottom_field_rear', function () {
                    return document.getElementById('faska_bottom_field_rear');
                });

                edging.addInput('faska_top_field_rear', function () {
                    return document.getElementById('faska_top_field_rear');
                });

                edging.addInput('faska_left_field_rear', function () {
                    return document.getElementById('faska_left_field_rear');
                });

                edging.addInput('faska_right_field_rear', function () {
                    return document.getElementById('faska_right_field_rear');
                });

                edging.addInput('radius_bottom_field_face', function () {
                    return document.getElementById('radius_bottom_field_face');
                });

                edging.addInput('radius_top_field_face', function () {
                    return document.getElementById('radius_top_field_face');
                });

                edging.addInput('radius_all_field_face', function () {
                    return document.getElementById('radius_all_field_face');
                });

                edging.addInput('radius_all_field_rear', function () {
                    return document.getElementById('radius_all_field_rear');
                });

                edging.addInput('radius_left_field_face', function () {
                    return document.getElementById('radius_left_field_face');
                });

                edging.addInput('radius_right_field_face', function () {
                    return document.getElementById('radius_right_field_face');
                });

                edging.addInput('radius_bottom_field_rear', function () {
                    return document.getElementById('radius_bottom_field_rear');
                });

                edging.addInput('radius_top_field_rear', function () {
                    return document.getElementById('radius_top_field_rear');
                });

                edging.addInput('radius_left_field_rear', function () {
                    return document.getElementById('radius_left_field_rear');
                });

                edging.addInput('radius_right_field_rear', function () {
                    return document.getElementById('radius_right_field_rear');
                });

                edging.addInput('srez_top_field_face', function () {
                    return document.getElementById('srez_top_field_face');
                });

                edging.addInput('srez_left_field_face', function () {
                    return document.getElementById('srez_left_field_face');
                });

                edging.addInput('srez_right_field_face', function () {
                    return document.getElementById('srez_right_field_face');
                });

                edging.addInput('srez_bottom_field_face', function () {
                    return document.getElementById('srez_bottom_field_face');
                });

                edging.addInput('rightZface', function () {
                    return document.getElementById('rightZface');
                });

                edging.addInput('rightWface', function () {
                    return document.getElementById('rightWface');
                });

                edging.addInput('rightDface', function () {
                    return document.getElementById('rightDface');
                });

                edging.addInput('rightRface', function () {
                    return document.getElementById('rightRface');
                });

                edging.addInput('leftZface', function () {
                    return document.getElementById('leftZface');
                });

                edging.addInput('leftWface', function () {
                    return document.getElementById('leftWface');
                });

                edging.addInput('leftDface', function () {
                    return document.getElementById('leftDface');
                });

                edging.addInput('leftRface', function () {
                    return document.getElementById('leftRface');
                });

                edging.addInput('topZface', function () {
                    return document.getElementById('topZface');
                });

                edging.addInput('topWface', function () {
                    return document.getElementById('topWface');
                });

                edging.addInput('topDface', function () {
                    return document.getElementById('topDface');
                });
                edging.addInput('topRface', function () {
                    return document.getElementById('topRface');
                });

                edging.addInput('bottomZface', function () {
                    return document.getElementById('bottomZface');
                });

                edging.addInput('bottomWface', function () {
                    return document.getElementById('bottomWface');
                });

                edging.addInput('bottomDface', function () {
                    return document.getElementById('bottomDface');
                });

                edging.addInput('bottomRface', function () {
                    return document.getElementById('bottomRface');
                });

                edging.addInput('allZface', function () {
                    return document.getElementById('allZface');
                });

                edging.addInput('allWface', function () {
                    return document.getElementById('allWface');
                });

                edging.addInput('allDface', function () {
                    return document.getElementById('allDface');
                });

                edging.addInput('allRface', function () {
                    return document.getElementById('allRface');
                });

                edging.addInput('rightZrear', function () {
                    return document.getElementById('rightZrear');
                });

                edging.addInput('rightWrear', function () {
                    return document.getElementById('rightWrear');
                });

                edging.addInput('rightDrear', function () {
                    return document.getElementById('rightDrear');
                });

                edging.addInput('rightRrear', function () {
                    return document.getElementById('rightRrear');
                });

                edging.addInput('leftZrear', function () {
                    return document.getElementById('leftZrear');
                });

                edging.addInput('leftWrear', function () {
                    return document.getElementById('leftWrear');
                });

                edging.addInput('leftDrear', function () {
                    return document.getElementById('leftDrear');
                });

                edging.addInput('leftRrear', function () {
                    return document.getElementById('leftRrear');
                });

                edging.addInput('topZrear', function () {
                    return document.getElementById('topZrear');
                });

                edging.addInput('topWrear', function () {
                    return document.getElementById('topWrear');
                });

                edging.addInput('topDrear', function () {
                    return document.getElementById('topDrear');
                });

                edging.addInput('topRrear', function () {
                    return document.getElementById('topRrear');
                });


                edging.addInput('bottomZrear', function () {
                    return document.getElementById('bottomZrear');
                });

                edging.addInput('bottomWrear', function () {
                    return document.getElementById('bottomWrear');
                });

                edging.addInput('bottomDrear', function () {
                    return document.getElementById('bottomDrear');
                });

                edging.addInput('bottomRrear', function () {
                    return document.getElementById('bottomRrear');
                });

                edging.addInput('allZrear', function () {
                    return document.getElementById('allZrear');
                });

                edging.addInput('allWrear', function () {
                    return document.getElementById('allWrear');
                });

                edging.addInput('allDrear', function () {
                    return document.getElementById('allDrear');
                });

                edging.addInput('allRrear', function () {
                    return document.getElementById('allRrear');
                });

                edging.addInput('rightRear', function () {
                    return document.getElementById('kromkaRightRear');
                });

                edging.addInput('leftRear', function () {
                    return document.getElementById('kromkaLeftRear');
                });

                edging.addInput('bottomRear', function () {
                    return document.getElementById('kromkaBottomRear');
                });

                edging.addInput('topRear', function () {
                    return document.getElementById('kromkaTopRear');
                });

                edging.addInput('rightRearSection', function () {
                    return document.getElementById('right_rear');
                });

                edging.addInput('leftRearSection', function () {
                    return document.getElementById('left_rear');
                });

                edging.addInput('bottomRearSection', function () {
                    return document.getElementById('bottom_rear');
                });

                edging.addInput('topRearSection', function () {
                    return document.getElementById('top_rear');
                });

                edging.addInput('rightFaceSection', function () {
                    return document.getElementById('right_face');
                });

                edging.addInput('leftFaceSection', function () {
                    return document.getElementById('left_face');
                });

                edging.addInput('bottomFaceSection', function () {
                    return document.getElementById('bottom_face');
                });

                edging.addInput('topFaceSection', function () {
                    return document.getElementById('top_face');
                });

                edging.addInput('allFaceSection', function () {
                    return document.getElementById('all_face');
                });

                edging.addInput('allRearSection', function () {
                    return document.getElementById('all_rear');
                });
                edging.addInput('add_kromka_wood', function () {
                    return document.getElementById('add_kromka_wood');
                });

                edging.addInput('top_grain_copy', function () {
                    return document.getElementById('top_grain_copy');
                });

                edging.addInput('left_grain_copy', function () {
                    return document.getElementById('left_grain_copy');
                });

                edging.addInput('bottom_grain_copy', function () {
                    return document.getElementById('bottom_grain_copy');
                });

                edging.addInput('right_grain_copy', function () {
                    return document.getElementById('right_grain_copy');
                });

                edging.addInput('all_grain_copy', function () {
                    return document.getElementById('all_grain_copy');
                });


            }

            edging.use('data', [global_data]);
            edging.use('edge_select', [data]);

            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                edging.functions.disabledFields();
                edging.functions.set_data_wood(data['data_edges_wood']);
                // console.log("data['data_edges']", data['data_edges'])

                for (let side of ['top', 'bottom', 'left', 'right'])
                    if (data['data_edges'][side]['type'] == 'srez') {
                        edging.setval(side, 'srez')
                        edging.setval('srez_' + side, data['data_edges'][side]['param'])
                        edging.showinput('srez_' + side + '_field_face');
                    }
            }

            if ((['wood', 'compact', 'osb'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                $('.text-danger').hide();
                $('.addKromka').hide();
                $('.srez').hide();
                $('#stolCutsButtons').hide();
            }

            if (ro) {
                showEdging();
                $("#kromki").attr("disabled", true);
            }

            edging.super();
            // edgesInit();

            if (['compact'].includes(materialType)) {
                var sides = ["left", "top", 'right', 'bottom', 'all'];

                sides.forEach(function (side, i, sides) {
                    if (edging.getval(side) == 'srez') {
                        edging.methods.top();
                        edging.methods.left();
                        edging.methods.right();
                        edging.methods.bottom();
                    }
                });
            }
        },
        reinit(data) {
            edging.use('edge_select', [data]);
            if ((['wood', 'compact'].includes(materialType) || (['fanera'].includes(materialType) && isMillAdditives))) {
                edging.functions.set_data_wood(data['data_edges_wood']);
                edging.functions.disabledFields();
            }
        }


    };

    return edging;
});
