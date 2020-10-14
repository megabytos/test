
define(function (require, exports, module) {
    var init_tables = [
        /**
         * clipping
         */
        data => {
            showClipping();
        },

        /**
         * corners
         */
        data => {
            $.ajax({
                type: "POST",
                url: "/service/system/views/additives/inc/tableCorners.php",
                data: 'detail_key=' + detailKey + '&machineId=' + machine,
                dataType: "html",
                success: function (data) {
                    if (data.length > 0) {
                        $("#additives-tbl-container-corners").show();
                        $("#additives-tbl-container-corners").html(data);
                    } else {
                        $("#additives-tbl-container-corners").hide();
                    }
                }
            });
        },

        /**
         * drilling
         */
        data => {
            detailHoles.length = 0;
            for (var key in data['holes']) {
                detailHoles.push([
                    Number(data['holes'][key]['side']),
                    Number(data['holes'][key]['x']),
                    Number(data['holes'][key]['y']),
                    Number(data['holes'][key]['z']),
                    Number(data['holes'][key]['d']),
                    Number(data['holes'][key]['key']),
                    Boolean(data['holes'][key]['is_out']),
                    data['holes'][key]['xl'] == "w",
                    data['holes'][key]['yl'] == "h",
                    Number(data['holes'][key]['type']),
                ]);
            }

            var table = document.getElementById('additives-tbl-container-holes');
            $.ajax({
                type: "POST",
                url: "/service/system/views/additives/inc/tableHoles.php",
                data: 'detail_key=' + detailKey,
                dataType: "html",
                success: function (data) {
                    if (data.length > 0 && window.constructorID != 'stol') {
                        table.style.display = 'initial';
                        table.innerHTML = data;

                        $(table).find('tr[id^=holeKeyId]').each((i, el) => {
                            el.onmouseout = e => {
                                hideHolePosition(Number(el.id.replace('holeKeyId-', '')));
                            };
                            el.onmouseover = e => {
                                showHolePosition(Number(el.id.replace('holeKeyId-', '')));
                            };
                        });
                    } else {
                        table.style.display = 'none';
                    }
                }
            });
        },

        /**
         * grooving
         */
        data => {
            var table = document.getElementById('additives-tbl-container-grooves');
            var data = data['grooves'];
            detailGrooves.length = 0;
            for (var key in data) {
                detailGrooves.push([
                    Number(data[key]['side']),//0
                    Number(data[key]['type']),//1
                    Number(data[key]['x']),   //2
                    Number(data[key]['y']),   //3
                    Number(data[key]['z']),   //4
                    Number(data[key]['d']),   //5
                    Number(data[key]['l']),   //6
                    Number(data[key]['key']), //7
                    data[key]['bindH'],//8
                    data[key]['bindV'],//9
                    data[key]['ext'] == 'true',  //10
                    data[key]['preset_type']   //11
                ]);
            }
            if (detailGrooves.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/service/system/views/additives/inc/tableGrooves.php",
                    data: 'detail_key=' + detailKey + '&machineId=' + machine,
                    dataType: "html",
                    success: function (data) {
                        if (data.length > 0 && constructorId != 'stol') {
                            table.style.display = 'initial';
                            table.innerHTML = data;
                            $(table).find('tr[id^=grooveKeyId-]').each((i, el) => {
                                el.onmouseout = e => {
                                    hideGroovePosition(Number(el.id.replace('grooveKeyId-', '')));
                                };
                                el.onmouseover = e => {
                                    showGroovePosition(Number(el.id.replace('grooveKeyId-', '')));
                                };
                            });
                        } else {
                            table.style.display = 'none';
                        }
                    }
                });
            } else {
                table.style.display = 'none';
            }
        },

        /**
         * rabbeting
         */
        data => {
            var data = data['rabbets'];
            detailRabbets.length = 0;
            for (var key in data) {
                detailRabbets.push([
                    Number(data[key]['side']),//0
                    Number(data[key]['n']),//1
                    Number(data[key]['z']),//2
                    Number(data[key]['d']),//3
                    Number(data[key]['l']),//4
                    Boolean(data[key]['ext']),//5
                    Boolean(data[key]['slim']),//6
                ]);
            }
            var table = document.getElementById('additives-tbl-container-rabbet');
            if(detailRabbets.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/service/system/views/additives/inc/tableRabbet.php",
                    data: 'detail_key=' + detailKey + '&machineId=' + machine,
                    dataType: "html",
                    success: function (data) {
                        if (data.length > 0) {
                            table.style.display = 'initial';
                            table.innerHTML = data;
                            $(table).find('tr[id^=rabbetKeyId-]').each((i, el) => {
                                el.onmouseout = e => {
                                    hideRabbetPosition(Number(el.id.replace('rabbetKeyId-', '')));
                                };
                                el.onmouseover = e => {
                                    showRabbetPosition(Number(el.id.replace('rabbetKeyId-', '')));
                                };
                            });
                        } else {
                            table.style.display = 'none';
                        }
                    }
                });
            } else {
                table.style.display = 'none';
            }
        },

        /**
         * shapesByPattern
         */
        data => {
            var data = data['shapesByPattern'];
            if (data) {
                detailShapesByPattern.length = 0;
                for (var key in data) {
                    detailShapesByPattern.push(data[key]);
                }
            } else {
                detailShapesByPattern = [];
            }
            var table = document.getElementById('additives-tbl-container-shapes-by-pattern');
            if(detailShapesByPattern.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/service/system/views/additives/inc/tableShapesByPattern.php",
                    data: 'detail_key=' + detailKey,
                    dataType: "html",
                    success: function (data) {
                        if (data.length > 0) {
                            table.style.display = 'initial';
                            table.innerHTML = data;
                            $(table).find('tr[id^=shape-]').each((i, el) => {
                                el.onmouseout = e => {
                                    var id = Number(el.id.replace('shape-', ''));
                                    unmarkShapeByPattern(id);
                                    hidePositionOnSide(1);
                                };
                                el.onmouseover = e => {
                                    var id = Number(el.id.replace('shape-', ''));
                                    markShapeByPattern(id);
                                    var child = document.querySelector('.svg-shapes-by-pattern-'+id);
                                    if(child) {
                                        child = child.childNodes[0];
                                        showPositionOnSide(1, child.getAttribute('shift-x'), child.getAttribute('shift-y'))
                                    }
                                };
                            });
                        } else {
                            table.style.display = 'none';
                        }
                    }
                });
            } else {
                table.style.display = 'none';
            }


            var tableForHandles = document.getElementById('additives-tbl-container-shapes-by-patternForHandles');
            if(detailShapesByPattern.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/service/system/views/additives/inc/tableShapesByPatternForHandles.php",
                    data: 'detail_key=' + detailKey,
                    dataType: "html",
                    success: function (data) {
                        if (data.length > 0) {
                            table.style.display = 'initial';
                            table.innerHTML = data;
                            $(tableForHandles).find('tr[id^=shape-]').each((i, el) => {
                                el.onmouseout = e => {
                                    var id = Number(el.id.replace('shape-', ''));
                                    unmarkShapeByPattern(id);
                                    hidePositionOnSide(1);
                                };
                                el.onmouseover = e => {
                                    var id = Number(el.id.replace('shape-', ''));
                                    markShapeByPattern(id);
                                    var child = document.querySelector('.svg-shapes-by-pattern-'+id);
                                    if(child) {
                                        child = child.childNodes[0];
                                        showPositionOnSide(1, child.getAttribute('shift-x'), child.getAttribute('shift-y'))
                                    }
                                };
                            });
                        } else {
                            tableForHandles.style.display = 'none';
                        }
                    }
                });
            } else {
                tableForHandles.style.display = 'none';
            }


        },
        /**
         * plays
         */
        data => {
            $.ajax({
                type: "POST",
                url: "/service/system/views/additives/inc/tablePlays.php",
                data: 'detail_key=' + detailKey + '&machineId=' + machine,
                dataType: "html",
                success: function (data) {
                    var table = document.getElementById('additives-tbl-container-plays');
                    table.innerHTML = data;
                }
            });
        }
    ];

    var init_svg = [
        /**
         * drilling
         */
        () => {
            document.querySelectorAll('g[class^=svg-holes-]').forEach(el => {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-holes-/)) {
                            return Number(el.classList[i].replace('svg-holes-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[detailHoles[id][0] - 1];
                    var x = detailHoles[id][1];
                    var y = detailHoles[id][2];
                    var z = detailHoles[id][3];
                    var D = detailHoles[id][4] * 2;
                    $('#drawinfo').text(
                        `Отверстие №${id + 1} (${side}): x=${x}, y=${y}, z=${z}, D=${D}`
                    );
                    showHolePosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideHolePosition(id);
                };
            });
        },

        /**
         * grooving
         */
        () => {
            document.querySelectorAll('g[class^=svg-grooves-]').forEach(el => {
                var getid = () => {
                    for (var i = 0; i < el.classList.length; i++) {
                        if (el.classList[i].match(/svg-grooves-/)) {
                            return Number(el.classList[i].replace('svg-grooves-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[detailGrooves[id][0] - 1];
                    var x = detailGrooves[id][2];
                    var y = detailGrooves[id][3];
                    var z = detailGrooves[id][4];
                    var w = detailGrooves[id][5];
                    var l = detailGrooves[id][6];
                    $('#drawinfo').text(
                        `Паз №${id + 1} (${side}): x=${x}, y=${y}, z=${z}, ширина=${w}, длина=${l}`
                    );
                    showGroovePosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideGroovePosition(id);
                };
            });
        },

        /**
         * rabbeting
         */
        () => {
            document.querySelectorAll('g[class^=svg-rabbets-]').forEach(el => {
                var getid = () => {
                    for(var i = 0; i < el.classList.length; i++) {
                        if(el.classList[i].match(/svg-rabbets-/)) {
                            return Number(el.classList[i].replace('svg-rabbets-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var side = strings.sides[(detailRabbets[id][0] + "")[1]];
                    var w = detailRabbets[id][3];
                    var l = detailRabbets[id][4];
                    var z = detailRabbets[id][2];
                    $('#drawinfo').text(
                        `Четверть № ${id + 1} (${side}): x=0, y=0, z=${z}, ширина=${w}, длина=${l}`
                    );
                    showRabbetPosition(id);
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    var id = getid();
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hideRabbetPosition(id);
                };
            });
        },

        /**
         * shapesByPattern
         */
        () => {
            document.querySelectorAll('g[class^=svg-shapes-by-pattern-]').forEach(el => {
                var getid = () => {
                    for(var i = 0; i < el.classList.length; i++) {
                        if(el.classList[i].match(/svg-shapes-by-pattern-/)) {
                            return Number(el.classList[i].replace('svg-shapes-by-pattern-', ''));
                        }
                    }
                };
                el.onmouseover = e => {
                    var id = getid();
                    var w = detailShapesByPattern[id]['sizeV'];
                    var l = detailShapesByPattern[id]['sizeH'];
                    var r = detailShapesByPattern[id]['radius'];
                    var s = detailShapesByPattern[id]['shift'];
                    var x = detailShapesByPattern[id]['shiftX'];
                    var y = detailShapesByPattern[id]['shiftY'];
                    var text = `Вырез по шаблону №${id + 1}: `;
                    if(x && y) {
                        text += `x=${x}, y=${y}`;
                    } else {
                        text += `отступ=${s}`;
                    }
                    if(r) {
                        text += `, радиус=${r}`;
                    }
                    if(w && l) {
                        text += `, ширина=${w}, длина=${l}`;
                    }
                    $('#drawinfo').text(
                        text
                    );
                    var child = el.childNodes[0];
                    if (child.getAttribute('shift-x')) {
                        showPositionOnSide(1, child.getAttribute('shift-x'), child.getAttribute('shift-y'));
                    }
                };
                el.onmouseout = e => {
                    var error = document.getElementById('svg-draft').attributes['errmsg'];
                    $('#drawinfo').text(
                        (error && error.value) ? error.value : getDetailDesc()
                    );
                    hidePositionOnSide(1);
                };
            });
        }
    ];


    return {
        init(data) {
            // рисуем svg
            draw();
            /**
             * заполнение данных, где необходимо и билдинг таблиц (главное билдинг таблиц) + ивенты на svg
             */
            init_tables.forEach(init => {
                init(data);
            });
        },
        svg() {
            init_svg.forEach(init => {
                init();
            });
        }
    }
});
