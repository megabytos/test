function DetailExample(data) {
    this.key = data.key;
    this.width = data.width;
    this.height = data.height;
    this.fullWidth = data.fullWidth;
    this.fullHeight = data.fullHeight;
    this.thick = data.thickness;
    this.grooves = normalizeGrooves(data['grooves']);
    this.edges = normalizeSrez(data['data_edges']);
    this.edges_wood = data['data_edges_wood'];
    this.plays = data['data_playing'];
    this.corners = normalizeCorners(data['cornerOperations'], this.fullWidth, this.fullHeight);
    this.rabbets = data['rabbets'];
    this.kromki = data['kromki'];
    this.shapesByPattern = normalizeShapesByPattern(data['shapesByPattern'], this.fullWidth, this.fullHeight);
    this.sameOperations = data['sameOperations'];
    this.trimmingInSize = data['clipping'];
    this.fugueForWood = data['fugueForWood'];
    this.fugue = data['fugue'];
    this.multiplicity = data['multiplicity'];
}

function Groove(param) {
    this.side = param[0];
    this.type = param[1];
    this.x = param[2];
    this.y = param[3];
    this.z = param[4];
    this.d = param[5];
    this.l = param[6];
    this.key = param[7];
    this.bindH = param[8] == 'true';
    this.bindV = param[9] == 'true';
    this.ext = param[10];
}

function Corner(param) {
    this.key = param[0];
    this.type = param[1];
    this.r = param[2];
    this.x = param[3];
    this.y = param[4];
    this.kromka = param[5];
    this.kSide = param[6];
    this.ext = param[7];
}

function normalizeGrooves(grooves) {
    var result = [];
    // var numbers = ['d', 'l', 'x', 'y', 'z', 'side', 'type'];
    for (var key in grooves) {
        if (grooves[key]['ext']) {
            result.push(grooves[key]);
        }
    }
    for (var key in grooves) {
        if (!grooves[key]['ext']) {
            result.push(grooves[key]);
        }
    }
    return result;
}

function normalizeSrez(srez) {
    var rez = [];
    for (key in srez) {
        if (key == 'joint') {
            continue;
        }
        if (key == 'left') {
            side = 2;
        } else if (key == 'top') {
            side = 3;
        } else if (key == 'right') {
            side = 4;
        } else if (key == 'bottom') {
            side = 5;
        }
        if (srez[key]['type'] == 'srez') {
            srez[key]['side'] = side;
            rez[key] = srez[key];
        }
    }
    return rez;
}

function normalizeCorners(corners, wid, hei) {
    var ret = [];
    for (key in corners) {
        if (corners[key]) {
            ret[key] = corners[key];
        }
    }
    return ret;
}

function normalizeShapesByPattern(sbp, wid, hei) {
    for (key in sbp) {
        if (sbp[key]['patternId'] == 'circle') {
            sbp[key]['sizeH'] = sbp[key]['radius'] * 2;
            sbp[key]['sizeV'] = sbp[key]['radius'] * 2;
        } else if (sbp[key]['patternId'] == 'uShaped' || sbp[key]['patternId'] == 'smile') {
            if (sbp[key]['edgeId'] == '2') {
                sbp[key]['shiftX'] = 0;
                sbp[key]['shiftY'] = Number(sbp[key]['shift']);
            } else if (sbp[key]['edgeId'] == '3') {
                sbp[key]['shiftX'] = Number(sbp[key]['shift']);
                sbp[key]['shiftY'] = hei - sbp[key]['sizeV'];
            } else if (sbp[key]['edgeId'] == '4') {
                sbp[key]['shiftX'] = wid - sbp[key]['sizeH'];
                sbp[key]['shiftY'] = Number(sbp[key]['shift']);
            } else if (sbp[key]['edgeId'] == '5') {
                sbp[key]['shiftX'] = Number(sbp[key]['shift']);
                sbp[key]['shiftY'] = 0;
            }
        }
    }
    return sbp;
}

function Miniatures(data) {
    var _this = this; //for private
    this.detail = (data) ? new DetailExample(data) : {};  //is public, but need?
    var scale = 1; // this is dark magic (высчитали на темном собрании)
    var filter = {};
    this.offsetY = 10;
    this.offsetX = 10;
    this.forVectors = 30;

    var offset = {
        X: 0,
        Y: 0,
        V: 0
    };

    var config = { //for ctx
        default: {
            width: 440, //padding, margin and border
            height: 270,
            style: {
                margin: '10px',
                padding: '10px',
                border: '1px solid'
            },
            scale: (15.1 - this.detail.thick * 0.27).toFixed(0)
        },
        detail: {
            strokeStyle: 'black',
            fillStyle: 'lightgreen',
            lineWidth: 4
        },
        trim: {
            strokeStyle: 'red',
            fillStyle: 'red',
            lineWidth: 4
        },
        line: {
            lineWidth: 1,
            fillStyle: 'black',
            strokeStyle: 'black',
            font: '24px Arial'
        },
        point: {
            lineWidth: 1,
            fillStyle: 'black',
            strokeStyle: 'black',
            font: '24px Arial'
        }
    };

    // constructor();

    // function constructor(data) {
    //     _this.setScale((15.1 - this.detail.thick * 0.27).toFixed(0));
    // }

    this.setDetail = function (data) {
        this.detail = new DetailExample(data);
        config.default.scale = (15.1 - this.detail.thick * 0.27).toFixed(0);
    };

    this.setScale = function (iscale) {
        scale = iscale;

        offset.Y = _this.offsetY / scale;
        offset.X = _this.offsetX / scale;
        offset.V = _this.forVectors / scale;
    };

    this.getMiniature = function (type, key, side, addData) { //is public


        var result = createWrap(type, key);
        result.appendChild(this.getImage(type, key, side, addData));

        var same = document.createElement('p');
        same.style.height = '10px';
        if (_this.detail.sameOperations && _this.detail.sameOperations[type] && _this.detail.sameOperations[type][key] && _this.detail.sameOperations[type][key].length > 1) {
            count_all = 0;
            for (var i = 0; i < _this.detail.sameOperations[type][key].length; i++) {
                count_all += _this.detail.sameOperations[type][key][i]['count'];
            }
            same.innerHTML = "Похожие обработки на деталях (всего " + count_all + "): ";
            var link = [];
            for (var i = 0; i < _this.detail.sameOperations[type][key].length; i++) {
                link.push(document.createElement('span'));
                if (_this.detail.sameOperations[type][key][i]['key'] - 1 == this.detail.key) {
                    link[i].innerHTML = "[" + _this.detail.sameOperations[type][key][i]['key'] + "]";
                } else {
                    link[i].innerHTML = _this.detail.sameOperations[type][key][i]['key'];
                    link[i].style.cursor = "pointer";
                    link[i].style.color = "blue";
                    $(link[i]).attr('onclick', 'changeDetail(' + (_this.detail.sameOperations[type][key][i]['key'] - 1) + ');');
                }
                same.appendChild(link[i]);
                if (i != _this.detail.sameOperations[type][key].length - 1) {
                    same.innerHTML += ", ";
                }
            }
        }
        $(result).prepend(same);
        return result;
    };
    this.getImage = function (type, key, side = null, addData = []) {
        if (type != 'corner' && type != 'shapeByPattern') {
            this.setScale(config.default.scale);
        } else {
            var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));
            if (type == 'shapeByPattern') {
                var wid = this.detail.shapesByPattern[key]['sizeH'] + 2 * fontSize + _this.forVectors;
                var hei = this.detail.shapesByPattern[key]['sizeV'] + 2 * fontSize + _this.forVectors;
            } else if (type == 'corner') {
                var wid = this.detail.corners[key]['x'] + 2 * fontSize + _this.forVectors;
                var hei = this.detail.corners[key]['y'] + 2 * fontSize + _this.forVectors;
            }
            // console.log('WID = ', wid, ' | HEI = ', hei);
            var wid_scale = (config.default.width - 2 * (_this.offsetX + _this.forVectors)) / wid;
            var hei_scale = (config.default.height - 2 * (_this.offsetY + _this.forVectors)) / hei;
            if (type == 'shapeByPattern') {
                if (this.detail.shapesByPattern[key]['patternId'] == 'handles') {
                    this.setScale(config.default.scale);
                } else {
                    this.setScale(Math.min(wid_scale, hei_scale));
                }
            } else {
                this.setScale(Math.min(wid_scale, hei_scale));
            }

        }

        switch (type) {
            case 'groove':
                return (getGrooveMiniature(key));
                break;
            case 'edge':
                return (getSrezMiniature(key, addData['edges']));
                break;
            case 'corner':
                return (getCornerMiniature(key));
                break;
            case 'cornerDop':
                return (getCornerDopMiniature(side, key));
                break;
            case 'rabbet':
                return (getRabbetMiniature(key));
                break;
            case 'shapeByPattern':
                return (getShapeByPatternMiniature(key));
                break;
            case 'clippingH':
                return (getTrimMiniature(data, "H"));
                break;
            case 'clippingV':
                return (getTrimMiniature(data, "V"));
                break;
            case 'edgeCut':
                return (getEdgeCut(data));
                break;
            case 'wood':
                return (getEdgeWood(side, data));
                break;
            case 'cornerSrez':
                return (getSrezMiniature(key, addData['corners'], true));
                break;
        }
    };

    this.getGrooveMiniatures = function (images) {
        var result = [[], [], [], [], [], []];
        for (var key in this.detail.grooves) {
            if (this.detail.grooves[key]['side']) {
                var miniature = images ? this.getImage('groove', key) : this.getMiniature('groove', key);
                if (miniature)
                    result[this.detail.grooves[key].side - 1].push(miniature);
            }
        }
        return result;
    };
    this.getEdgesWood = function (images) {
        var result = [[], [], [], [], [], []];
        var sides = ['left', 'right', 'top', 'bottom'];
        for (var side in sides) {
            if (Boolean(this.detail.edges_wood['face'][sides[side]]['type']) || Boolean(this.detail.edges_wood['rear'][sides[side]]['type'])) {
                var miniature = this.getMiniature('wood', key, sides[side]);
                if (miniature)
                    var tmpSides = [{oldVal:0,newVal:1}, {oldVal:1,newVal:3},{oldVal:2,newVal:2}, {oldVal:3,newVal:4}]
                    result[tmpSides.find(tmpSide => tmpSide.oldVal==Number(side)).newVal].push(miniature);
            }
        }

        return result;
    };


    this.getEdgesCut = function (detail) {

        var result = [[], [], [], [], [], []];
        if (data['data_edges']['top']['cut'] || data['data_edges']['bottom']['cut'] || detail.clipping.cutHBase == "2" || detail.clipping.cutHBase == "4") {
            var miniatureBottom = this.getMiniature('edgeCut', key, detail);
            result[4].push(miniatureBottom);
        }
        return result;


    };

    this.getSrezMiniatures = function (images, edges, cornerSrez) {
        var result = [[], [], [], [], [], []];
        var addData = {'edges': null};
        var addDataCornerSrez = {'corners': []};
        if (cornerSrez){
            for (var cKey in this.detail.corners){
                if (this.detail.corners[cKey]['cornerSrez'] != 0){
                    var arr = [];
                    arr = {'cut': 0, 'param': this.detail.corners[cKey]['cornerSrez'], 'pur': 0, 'side': cKey, 'type': 'srez'};
                    addDataCornerSrez['corners'].push(arr);
                }
            }
            for (var cKey in addDataCornerSrez['corners']) {
                var miniature = this.getImage('cornerSrez', cKey, null, addDataCornerSrez);
                if (miniature)
                    result[addDataCornerSrez['corners'][cKey]['side'] -1].push(miniature);
            }
        } else{
            if (!edges) {
                addData['edges'] = this.detail.edges;
            } else {
                addData['edges'] = edges;
            }
            for (var key in addData['edges']) {
                var miniature = images ? this.getImage('edge', key, null, addData) : this.getMiniature('edge', key, null, addData);
                if (miniature)
                    result[addData['edges'][key]['side'] - 1].push(miniature);
            }
        }
        return result;
    };


    this.getTrimMiniatures = function (detail) {

        var result = [[], [], [], [], [], []];
        if (detail.clipping.cutHBase != "") {

            var miniature = this.getMiniature('clippingH', key, detail);
            if (detail.clipping.cutHBase == "2") {
                result[3].push(miniature);
            }
            if (detail.clipping.cutHBase == "4") {
                result[1].push(miniature);
            }

        }


        if (detail.clipping.cutVBase != "") {

            var miniature = this.getMiniature('clippingV', key, detail);
            if (detail.clipping.cutVBase == "3") {
                result[4].push(miniature);
            }
            if (detail.clipping.cutVBase == "5") {
                result[2].push(miniature);
            }

        }


        return result;
    };


    this.getCornerMiniatures = function (images) {
        var result = [[], [], [], [], [], []];
        for (var key in this.detail.corners) {
            var miniature = images ? this.getImage('corner', key) : this.getMiniature('corner', key);
            if (miniature) {
                result[0].push(miniature);
            }
        }
        return result;
    };

    this.getCornerMiniaturesDop = function (images) {
        var result = [[], [], [], [], [], []];
        for (var key in this.detail.corners) {
            if(this.detail.corners[key].edgeCutting && (this.detail.corners[key].edgeCutting['face']['type'] != '0' || this.detail.corners[key].edgeCutting['rear']['type'] != '0')) {
                var miniature = images ? this.getImage('cornerDop', key) : this.getMiniature('cornerDop', key);
                if (miniature) {
                    result[0].push(miniature);
                }
            }
        }
        return result;
    };



    this.getRabbetMiniatures = function (images) {
        var result = [[], [], [], [], [], []];
        for (var key in this.detail.rabbets) {
            var miniature = images ? this.getImage('rabbet', key) : this.getMiniature('rabbet', key);
            if (miniature)
                result[this.detail.rabbets[key].side[1] - 1].push(miniature);
        }
        return result;
    };

    this.getShapeByPatternMiniatures = function (images) {
        var result = [[], [], [], [], [], []];
        var edges = {};

        for (var key in this.detail.shapesByPattern) {
            if (this.detail.shapesByPattern[key]['patternId'] == 'handles') {
                if (this.detail.shapesByPattern[key]['handleType'] == 'edges') {
                    var side = this.detail.shapesByPattern[key]['edgeForHandleEdge'];
                    var miniature = images ? this.getImage('shapeByPattern', key) : this.getMiniature('shapeByPattern', key);
                    var rearBase = this.detail.shapesByPattern[key]['rearBase'];
                    if ('trimmed' in this.detail.shapesByPattern[key]) {
                        var trimmed = this.detail.shapesByPattern[key]['trimmed'];
                    } else {
                        var trimmed = 0;
                    }
                    if (trimmed) {
                        if (miniature) {
                            result[side - 1].push(miniature);
                        }
                        var edge = {'cut': 0, 'param': -trimmed, 'pur': 0, 'side': side,
                            'type': 'srez', 'rearBase': rearBase};
                        switch (side) {
                            case 2:
                                var sideText = 'left';
                                break;
                            case 3:
                                var sideText = 'top';
                                break;
                            case 4:
                                var sideText = 'right';
                                break;
                            case 5:
                                var sideText = 'bottom';
                                break;
                        }
                        edges[sideText] = edge;
                    } else {
                        if (miniature) {
                            if (rearBase == 1) {
                                result[5].push(miniature);
                            } else {
                                //Если торцевая ручка закрыта кромкой, то выводим
                                if (this.detail.shapesByPattern[key]['handlesExt']){
                                    result[side-1].push(miniature);
                                }
                            }
                        }
                    }
                }
            } else {
                var miniature = images ? this.getImage('shapeByPattern', key) : this.getMiniature('shapeByPattern', key);
                if (miniature)
                    result[0].push(miniature);
            }

        }

        return [result, edges];
    };

    this.setFilter = function (type, tfilter) {
        filter[type] = tfilter;
    };

    function createWrap(className, key) {
        var result = document.createElement('div');
        result.classList.add(className + key);
        result.style.float = 'left';

        var num = document.createElement('span');
        num.classList.add('label');

        var labels = {
            'srez': "label-cool",
            'hole': "label-default",
            'groove': "label-danger",
            'rabbet': "label-warning",
            'corner': "label-info",
            'shape-by-pattern': "label-primary",
            'shape': "label-success"
        }
        num.classList.add(labels[className]);
        num.style.position = 'absolute';
        num.innerText = +key + 1;
        h = document.createElement('h3');
        if (className != 'corner') {
            h.appendChild(num);
        }
        result.appendChild(h);

        return result;
    }

    function getCornerDopMiniature(side,key){
        var sidesKey = {
            left: 2,
            right: 4,
            top: 3,
            bottom: 5,
        };

        var cornerKey = {
            1: 'Левый-Нижний Угол',
            2: 'Левый-Верхний Угол',
            3: 'Правый-Верхний Угол',
            4: 'Правый-Нижний Угол',
        };
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var cornerKeyText = cornerKey[_this.detail.corners[key]['key']];

        var edgeCutting = _this.detail.corners[key].edgeCutting;
        var face = edgeCutting['face'];
        var rear = edgeCutting['rear'];

        var edgeCutting = {
            face: face,
            rear: rear,
        };


        var detail = calcDetail(3);
        detail.x1 += 200;
        detail.x2 += 200;
        var detailNew = calcWood(detail, edgeCutting);
        drawDetailForWood(ctx, detail, edgeCutting, detailNew);
        var lines = calcLinesForWood(detail, edgeCutting, detailNew, ctx, data['fugueForWood'],true,cornerKeyText);
        console.log(lines);
        drawLines(ctx, lines, detail);
        return elem;
    }

    function getEdgeWood(side, data) {
        var sidesKey = {
            left: 2,
            right: 4,
            top: 3,
            bottom: 5,
        };
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');

        var face = _this.detail.edges_wood['face'][side];
        var rear = _this.detail.edges_wood['rear'][side];
        var wood = {
            face: face,
            rear: rear,
        };

        var detail = calcDetail(sidesKey[side]);
        detail.x1 += 200;
        detail.x2 += 200;
        var detailNew = calcWood(detail, wood);
        drawDetailForWood(ctx, detail, wood, detailNew);
        var lines = calcLinesForWood(detail, wood, detailNew, ctx, data['fugueForWood']);
        console.log(lines);
        drawLines(ctx, lines, detail);
        return elem;
    }

    function getGrooveMiniature(key) { //is private
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var data = _this.detail.grooves[key];
        // console.log('data from groove', data);

        var detail = calcDetail(getGrooveSide(Number(data.side), data.type));

        var groove = calcGroove(data, detail);
        groove.full = data.full;
        if (data['d'] > 20) {
            groove.x1 = 1640;
            groove.x2 = 1800;
            groove.y1 = 40;
            groove.y2 = 120;
        }
        // console.log('groove', groove);
        var translateX = moveCameraX(ctx, detail, groove, true);
        drawDetail(ctx, detail);
        drawGroove(ctx, groove);
        var lines = calcLinesForGroove(detail, groove, data, translateX);
        drawLines(ctx, lines, groove);
        drawPointers(ctx, translateX, Number(data.side), data.type, detail, true);
        return elem;
    }

    function getHandleEdgesMiniature(dataGroove) { //is private
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');

        // console.log('data from handle', dataGroove);

        var detail = calcDetail( getGrooveSide(Number(dataGroove.side)) );

        var groove = calcGroove(dataGroove, detail);
        groove.full = dataGroove.full;
        if (dataGroove['d'] > 20) {
            groove.x1 = 1640;
            groove.x2 = 1800;
            groove.y1 = 40;
            groove.y2 = 120;
        }

        var translateX = moveCameraX(ctx, detail, groove, true);
        drawDetail(ctx, detail);
        drawGroove(ctx, groove);
        var lines = calcLinesForGroove(detail, groove, dataGroove, translateX);
        drawLines(ctx, lines, groove);
        drawPointers(ctx, translateX, Number(dataGroove.side), dataGroove.type, detail, true);
        return elem;
    }


    var hatchRectForTrim = function (x1, y1, dx, dy, ctx) {
        var canvasPattern = document.createElement("canvas");
        canvasPattern.width = 10;
        canvasPattern.height = 10;
        var contextPattern = canvasPattern.getContext("2d");

        contextPattern.beginPath();
        contextPattern.strokeRect(0.5, 0.5, 10, 10);

        contextPattern.stroke();

        var pattern = ctx.createPattern(canvasPattern, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(x1, y1, dx, dy);
        ctx.fill();
    }

    function getEdgeCut(data) {

        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var detail = {x1: 40, x2: 360, y1: 40, y2: 210};
        var edgeCut = calcEdgeCut(detail, data);

        drawDetail(ctx, detail);

        console.log(edgeCut);
        drawEdgeCut(ctx, edgeCut, data);
        drawPointers(ctx, 0 - 20, 0, 0, detail, true);

        var lines = calcLinesForEdgeCut(detail, edgeCut, data, side);
        drawLines(ctx, lines, edgeCut);

        return elem;
    }



    function getTrimMiniature(data, side) {
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var detail = calcDetail(2);
        detail.y2 -= 40;
        var trim = calcTrim(detail, side, data, side);
        var translateX = moveCameraX(ctx, detail, {y1: trim.y1, y2: trim.y2, x1: trim.x2 - 1, x2: trim.x2 + 1}, true);
        drawDetail(ctx, detail);
        drawTrim(ctx, trim);
        hatchRectForTrim(trim.x1, trim.y1, trim.x2 - trim.x1, trim.y2 - trim.y1, ctx);


        if (side == "H") {
            drawPointers(ctx, translateX - 20, 1, 1, detail, true);
        }
        if (side == "V") {
            drawPointers(ctx, translateX - 20, 1, 0, detail, true);
        }
        var lines = calcLinesForTrim(detail, trim, data, side);
        drawLines(ctx, lines, trim);


        return elem;
    }

    function calcEdgeCut(detail, data) {
        var edgeCut = new Object();

        //сверху
        var scaleY = detail.y2 + detail.y1;
        var scaleX = detail.x2 + detail.x1;
        var minScaleY = detail.y1 + 14;
        var maxScaleY = detail.y2 - 14;
        var minScaleX = detail.x1 + 14;
        var maxScaleX = detail.x2 - 14;


        if (Number(data['data_edges']['top']['cut'])) {
            edgeCut.x1 = detail.x1 + 4;
            edgeCut.y1 = detail.y1 + 4;
            edgeCut.y2 = (scaleY) * ( ( (Number(data['data_edges']['top']['cut'])) / (data.fullHeight + Number(data['data_edges']['top']['cut'])) ) );
            if (edgeCut.y2 <= minScaleY) edgeCut.y2 = minScaleY;
            if (edgeCut.y2 >= maxScaleY) edgeCut.y2 = maxScaleY;
            edgeCut.x2 = detail.x2 - 4;
        }

        if (Number(data['data_edges']['bottom']['cut'])) {
            edgeCut.x4 = (detail.x1 + 4);
            edgeCut.y4 = detail.y2 - 4;
            edgeCut.y5 = (scaleY ) - ((scaleY) * ( ( (Number(data['data_edges']['bottom']['cut'])) / (data.fullHeight + Number(data['data_edges']['bottom']['cut'])) ) ));
            edgeCut.x5 = (detail.x2 - 4 );

            if (edgeCut.y5 >= scaleY - minScaleY) edgeCut.y5 = scaleY - minScaleY;
            if (edgeCut.y5 <= scaleY - maxScaleY) edgeCut.y5 = scaleY - maxScaleY;
            edgeCut.x2 = detail.x2 - 4;
        }

        //слева

        if (data.clipping.cutHBase == '4') {
            edgeCut.x1G = detail.x1 + 4;
            edgeCut.y1G = detail.y1 + 4;
            edgeCut.y2G = detail.y2 - 4;
            edgeCut.x2G = (scaleX) * ( (( data.fullWidth - data.clipping.cutHSize) / data.fullWidth)  );
            if (edgeCut.x2G <= minScaleX) edgeCut.x2G = minScaleX;
            if (edgeCut.x2G >= maxScaleX) edgeCut.x2G = maxScaleX;
        }

        //справа
        if (data.clipping.cutHBase == '2') {
            edgeCut.x5G = (detail.x2 - 4);
            edgeCut.y4G = detail.y1 + 4;
            edgeCut.y5G = detail.y2 - 4;
            edgeCut.x4G = (scaleX ) - ( (scaleX) * ( (( data.fullWidth - data.clipping.cutHSize) / data.fullWidth)  ) );
            if (edgeCut.x4G >= scaleX - minScaleX) edgeCut.x4G = scaleX - minScaleX;
            if (edgeCut.x4G <= scaleX - maxScaleX) edgeCut.x4G = scaleX - maxScaleX;
        }

        return edgeCut;
    }

    function calcTrim(detail, trim, data, side) {
        var trim = new Object();

        if (side == "H") {
            //слева
            if (data.clipping.cutHBase == "4") {

                trim.x1 = detail.x1 + 4;
                trim.y1 = detail.y1 + 4;
                trim.y2 = detail.y2 - 4;
                trim.x2 = (detail.x2 - detail.x1) * (  (100 * (data.fullWidth - data.clipping.cutHSize)) / data.fullWidth ) / 100;
            }
            //справа
            if (data.clipping.cutHBase == "2") {

                trim.x1 = detail.x2 - 4;
                trim.y1 = detail.y2 - 4;
                trim.y2 = detail.y1 + 4;
                trim.x2 = (detail.x2 - detail.x1) * (  (100 * (data.fullWidth - data.clipping.cutHSize)) / data.fullWidth ) / 100;
            }
        }
        if (side == "V") {

            //сверху
            var tmp = data.fullWidth;
            data.fullWidth = data.fullHeight;
            data.fullHeight = tmp;
            if (data.clipping.cutVBase == "5") {
                trim.x1 = detail.x1 + 4;
                trim.y1 = detail.y1 + 4;
                trim.y2 = detail.y2 - 4;
                trim.x2 = (detail.x2 - detail.x1) * (  (100 * (data.fullHeight - data.clipping.cutVSize)) / data.fullHeight ) / 100;
            }
            //снизу
            if (data.clipping.cutVBase == "3") {
                trim.x1 = detail.x2 - 4;
                trim.y1 = detail.y2 - 4;
                trim.y2 = detail.y1 + 4;
                trim.x2 = (detail.x2 - detail.x1) * (  (100 * (data.fullHeight - data.clipping.cutVSize)) / data.fullHeight ) / 100;
            }
        }
        return trim;
    }

    function getSrezMiniature(key, edges, cornerSrez) {
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        if (edges) {
            var data = edges[key];
        } else {
            var data = _this.detail.edges[key];
        }
        var detail = calcDetail(getSrezSide(data['side'], cornerSrez));
        var srez = calcSrez(data, detail);

        var translateX = moveCameraX(ctx, detail, srez, true);
        drawDetail(ctx, detail);
        drawSrez(ctx, srez);

        var arcs = calcArcsForSrez(srez);
        drawArcs(ctx, arcs, srez);
        return elem;
    }

    function getCornerMiniature(key) {
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var data = _this.detail.corners[key];
        var detail = calcDetail(1);
        var corner = calcCorner(data, detail);
        var translateX = corner.minX - (config.default.width - corner.sizeH) / 2;
        var translateY = corner.minY - (config.default.height - corner.sizeV) / 2;
        ctx.translate(-translateX, -translateY);
        drawDetail(ctx, detail);
        drawCorner(ctx, corner, data);
        var lines = calcLinesForCorner(corner, data, detail, translateX, translateY);
        drawLinesForSrez(ctx, lines, corner);
        return elem;
    }

    function getRabbetMiniature(key) {
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var data = _this.detail.rabbets[key];
        var g_data = rabbetToGroove(data);
        var detail = calcDetail(getRabbetSide(data['side']));
        var rabbet = calcGroove(g_data, detail);
        var translateX = moveCameraX(ctx, detail, rabbet, true);
        drawDetail(ctx, detail);
        drawGroove(ctx, rabbet);
        expandGrooveDrawForRabbet(ctx, getRabbetSide(data['side']), g_data['side'], rabbet);
        var lines = calcLinesForRabbet(rabbet, g_data);
        drawLines(ctx, lines, rabbet);
        return elem;
    }

    function getShapeByPatternMiniature(key) {
        var elem = getNewCanvas();
        var ctx = elem.getContext('2d');
        var data = _this.detail.shapesByPattern[key];

        if (data['patternId'] == 'handles') {
            if (data['handleType'] == 'edges') {
                var dataGroove = {
                    article: "",
                    bindH: "false",
                    bindV: "false",
                    d: data['handleD'],
                    ext: data['handlesExt'],
                    full: 1,
                    incorrectDistance: null,
                    inside: 0,
                    key: 0,
                    l: 600,
                    millD: 0,
                    preset_type: "0",
                    side: data['edgeForHandleEdge'].toString(),
                    z: data['handleZ'],
                    rearBase: data['rearBase'],
                    trimmed: data['trimmed']
                };

                if (Number(dataGroove['side'] == 2) || Number(dataGroove['side'] == 4)) {
                    dataGroove['x'] = data['shiftEdge'];
                    dataGroove['y'] = 0;
                    dataGroove['type'] = 1;
                }
                if (Number(dataGroove['side'] == 3) || Number(dataGroove['side'] == 5)) {
                    dataGroove['y'] = data['shiftEdge'];
                    dataGroove['x'] = 0;
                    dataGroove['type'] = 0;
                }
            } else {
                return 0;
            }

            return getHandleEdgesMiniature(dataGroove);
        } else {


            var detail = calcDetail(1);
            var sbp = calcShapeByPattern(data, detail, config.detail.lineWidth);
            var minX = Math.min(sbp.x1, sbp.x2);
            var minY = Math.min(sbp.y1, sbp.y2);
            var translateX = minX - (config.default.width - sbp.sizeH) / 2;
            var translateY = minY - (config.default.height - sbp.sizeV) / 2;
            ctx.translate(-translateX, -translateY);
            drawDetail(ctx, detail);
            drawShapeByPattern(ctx, sbp, data);

            var lines = calcLinesForShapeByPattern(sbp, detail, data, translateX, translateY);
            drawLines(ctx, lines, sbp);
            return elem;
        }

    }

    function getNewCanvas() {
        var elem = document.createElement('canvas');

        for (var key in config.default) {
            if (typeof config.default[key] == 'object') {
                for (var style in config.default[key])
                    elem.style[style] = config.default[key][style];
                continue;
            }
            elem[key] = config.default[key];
        }

        return elem;
    }

    function moveCameraX(ctx, detail, data, updateCtx) {
        // смешение миниатюры - фигачим сразу после расчетов, что бы видить часть детали
        var translateX = 0;
        var xToCenterGroove = (data.x2 - data.x1) / 2 + data.x1; //расстояние от левого края до центра паза

        if (data.x2 > config.default.width) {
            if ((detail.x2 - xToCenterGroove) / 2 > config.default.width / 2) {
                translateX = (xToCenterGroove - config.default.width / 2);
            } else {
                translateX = (detail.x2 - config.default.width + config.detail.lineWidth / 2);
            }
        } else {
            translateX = _this.offsetX + _this.forVectors - config.detail.lineWidth / 2;
        }
        if (updateCtx) {
            ctx.translate(-translateX, 0);
        }
        //  console.log('tX', translateX);
        return translateX;
    }

    function moveCameraY(ctx, detail, data, translateX) {
        var translateY = 0;
        var yToCenter = (data.y2 - data.y1) / 2 + data.y1;

        if (data.y2 > config.default.height) {
            if ((detail.y2 - yToCenter) / 2 > config.default.height / 2) {
                translateY = (yToCenter - config.default.height / 2);
            } else {
                translateY = (detail.x2 - config.default.height + config.detail.lineWidth / 2);
            }
        } else {
            translateY = _this.offsetY + _this.forVectors - config.detail.lineWidth / 2;
        }
        ctx.translate(-translateX, -translateY);
    }

    function calcDetail(side) {
        var detail = {};
        detail.x1 = (offset.X + offset.V) * scale;
        detail.y1 = (offset.Y + offset.V) * scale;
        switch (side) {
            case 1:
                // detail.x1 = (config.default.width / 2 - (_this.detail.width * scale) / 2);
                // detail.y1 = (config.default.height / 2 - (_this.detail.height * scale) / 2);
                detail.x2 = (detail.x1 / scale + _this.detail.fullWidth) * scale;
                detail.y2 = (detail.y1 / scale + _this.detail.fullHeight) * scale;
                break;
            case 2:
            case 4:
                detail.x2 = (detail.x1 / scale + _this.detail.fullHeight) * scale;
                detail.y2 = (detail.y1 / scale + _this.detail.thick) * scale;
                break;
            case 3:
            case 5:
                detail.x2 = (detail.x1 / scale + _this.detail.fullWidth) * scale;
                detail.y2 = (detail.y1 / scale + _this.detail.thick) * scale;
                break;
            case 6:
                break;
        }
        if (Math.abs(detail.x2 - detail.x1) < config.default.width &&
            Math.abs(detail.y2 - detail.y1) < config.default.height) {
            config.line.font = "18px Arial";
        }
        return detail;
    }


    function drawEdgeCut(ctx, edgeCut, data) {
        useCtxConfig(ctx, 'trim');

        ctx.beginPath();

        ctx.moveTo(edgeCut.x1, edgeCut.y1);
        ctx.lineTo(edgeCut.x2, edgeCut.y1);
        ctx.lineTo(edgeCut.x2, edgeCut.y2);
        ctx.lineTo(edgeCut.x1, edgeCut.y2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.moveTo(edgeCut.x4, edgeCut.y4);
        ctx.lineTo(edgeCut.x5, edgeCut.y4);
        ctx.lineTo(edgeCut.x5, edgeCut.y5);
        ctx.lineTo(edgeCut.x4, edgeCut.y5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.moveTo(edgeCut.x1G, edgeCut.y1G);
        ctx.lineTo(edgeCut.x2G, edgeCut.y1G);
        ctx.lineTo(edgeCut.x2G, edgeCut.y2G);
        ctx.lineTo(edgeCut.x1G, edgeCut.y2G);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.moveTo(edgeCut.x4G, edgeCut.y4G);
        ctx.lineTo(edgeCut.x5G, edgeCut.y4G);
        ctx.lineTo(edgeCut.x5G, edgeCut.y5G);
        ctx.lineTo(edgeCut.x4G, edgeCut.y5G);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (Number(data['data_edges']['bottom']['cut'])) {

            if (Number(data['data_edges']['bottom']['cut'] == 5)) {
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.setLineDash([5, 3]);
                ctx.moveTo(edgeCut.x4 - 4, edgeCut.y5);
                ctx.lineTo(edgeCut.x5 + 4, edgeCut.y5);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                ctx.setLineDash([0, 0]);
            }
            if (Number(data['data_edges']['bottom']['cut'] == 10)) {
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.moveTo(edgeCut.x4 - 4, edgeCut.y5);
                ctx.lineTo(edgeCut.x5 + 4, edgeCut.y5);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                ctx.setLineDash([0, 0]);
            }
        }

        if (Number(data['data_edges']['top']['cut'])) {

            if (Number(data['data_edges']['top']['cut'] == 5)) {
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.setLineDash([5, 3]);
                ctx.moveTo(edgeCut.x4 - 4, edgeCut.y2);
                ctx.lineTo(edgeCut.x5 + 4, edgeCut.y2);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                ctx.setLineDash([0, 0]);
            }
            if (Number(data['data_edges']['top']['cut'] == 10)) {
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.moveTo(edgeCut.x4 - 4, edgeCut.y2);
                ctx.lineTo(edgeCut.x5 + 4, edgeCut.y2);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                ctx.setLineDash([0, 0]);
            }
        }


    }

    function drawTrim(ctx, trim) {
        useCtxConfig(ctx, 'trim');

        ctx.beginPath();
        ctx.moveTo(trim.x1, trim.y1);
        ctx.lineTo(trim.x2, trim.y1);
        ctx.lineTo(trim.x2, trim.y2);
        ctx.lineTo(trim.x1, trim.y2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawDetail(ctx, data) {
        useCtxConfig(ctx, 'detail');

        ctx.beginPath();
        ctx.moveTo(data.x1, data.y1);
        ctx.lineTo(data.x2, data.y1);
        ctx.lineTo(data.x2, data.y2);
        ctx.lineTo(data.x1, data.y2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawDetailForWood(ctx, detail, wood, detailNew) {
        useCtxConfig(ctx, 'detail');
        ctx.beginPath();

        if (wood['face']['type'] == 'arc' || wood['rear']['type'] == 'arc') {
            ctx.moveTo(detailNew.xFaceW, detailNew.yFaceW);
            ctx.lineTo(detail.x2, detail.y1);
            ctx.lineTo(detail.x2, detail.y2);
            ctx.lineTo(detailNew.xRearW, detailNew.yRearW);
            ctx.quadraticCurveTo(detail.x1, detail.y1 + (detail.y2 / 2) - (detail.y1 / 2), detailNew.xFaceW, detailNew.yFaceW);
        } else {
            ctx.moveTo(detailNew.xFaceW, detailNew.yFaceW);
            ctx.lineTo(detail.x2, detail.y1);
            ctx.lineTo(detail.x2, detail.y2);
            if (wood['rear']['type'] == 'radius') {
                ctx.lineTo(detailNew.xRearW, detail.y2);
                ctx.quadraticCurveTo(detail.x1, detail.y2, detail.x1, detailNew.yRearZ);
            } else {
                ctx.lineTo(detailNew.xRearW, detailNew.yRearW);
                ctx.lineTo(detailNew.xRearZ, detailNew.yRearZ);
            }
            ctx.lineTo(detailNew.xFaceZ, detailNew.yFaceZ);

            if (wood['face']['type'] == 'radius') {
                ctx.lineTo(detailNew.xFaceZ, detailNew.yFaceZ);
                ctx.quadraticCurveTo(detail.x1, detail.y1, detailNew.xFaceW, detail.y1);
            }
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#9332bd";
        var ofssetForFug =  20;
        ctx.fillRect(detail.x1 - ofssetForFug, detailNew.yFaceZ, 20, detailNew.yRearZ - detailNew.yFaceZ);


    }

    function calcWood(detail, wood) {
        var detailNew = {};
        wFace = 0;
        zFace = 0;
        wRear = 0;
        zRear = 0;
        if (wood['face']['type'] == 'faska') {
            var wFace = Number(wood['face']['w']);
            var zFace = Number(wood['face']['z']);
        }

        if (wood['rear']['type'] == 'faska') {
            var wRear = Number(wood['rear']['w']);
            var zRear = Number(wood['rear']['z']);
        }

        if (wood['face']['type'] == 'radius') {
            var wFace = Number(wood['face']['r']);
            var zFace = Number(wood['face']['r']);
        }

        if (wood['rear']['type'] == 'radius') {
            var wRear = Number(wood['rear']['r']);
            var zRear = Number(wood['rear']['r']);
        }

        if (wood['face']['type'] == 'arc') {
            var wFace = 5;
        }

        if (wood['rear']['type'] == 'arc') {
            var wRear = 5;
        }
        var widthDetail = detail.x2 - detail.x1;
        var heightDetail = detail.y2 - detail.y1;


        detailNew.xFaceW = detail.x1 + ((widthDetail * wFace) / detailFullWidth);
        detailNew.yFaceW = detail.y1;
        detailNew.xFaceZ = detail.x1;
        detailNew.yFaceZ = detail.y1 + ((heightDetail * zFace) / detailThickness);
        detailNew.xRearW = detail.x1 + ((widthDetail * wRear) / detailFullWidth);
        detailNew.yRearW = detail.y2;
        detailNew.xRearZ = detail.x1;
        detailNew.yRearZ = detail.y2 - ((heightDetail * zRear) / detailThickness);
        return detailNew;
    }


    function calcGroove(data, detail) {
        // v ('t', 'r', 'b', 'l') -> направление смещения чистки (для того, что бы нестиралася/стиралась линия)
        var groove = {};
        data.y = Number(data.y);
        data.x = Number(data.x);
        data.d = Number(data.d);
        var h = (data.ext) ? _this.detail.height : _this.detail.fullHeight;
        var y = data.y;
        // console.log('detailGrove',detail);

        switch (Number(data.side)) {
            case 1:
                if (data.type || data.t2 == "rabbet") {
                    h = _this.detail.fullWidth;
                    y = h - data.x - data.d;
                }

                groove.x1 = (h - y - data.d + offset.X + offset.V) * scale;
                groove.y1 = (offset.Y + offset.V) * scale;
                groove.x2 = (groove.x1 / scale + data.d) * scale;
                groove.y2 = (groove.y1 / scale + data.z) * scale;
                groove.v = 't';
                break;
            case 2:
            case 3:
                if (data.side == 2) {
                    y = data.x;
                }
                groove.x1 = (offset.X + offset.V) * scale;
                groove.y1 = (offset.Y + offset.V + y) * scale;
                groove.x2 = (groove.x1 / scale + data.z) * scale;
                groove.y2 = (groove.y1 / scale + data.d) * scale;
                groove.v = 'l';
                break;
            case 4:
            case 5:
                if (data.side == 4) {
                    h = _this.detail.fullWidth;
                    y = data.x;
                }
                groove.x2 = (h - data.z + offset.X + offset.V) * scale;
                groove.y1 = (y + offset.X + offset.V) * scale;
                groove.x1 = (groove.x2 / scale + data.z) * scale;
                groove.y2 = (groove.y1 / scale + data.d) * scale;
                groove.v = 'r';
                break;
            case 6:
                if (data.type || data.t2 == "rabbet") {
                    h = _this.detail.fullWidth;
                    y = h - data.x - data.d;
                }
                groove.x1 = (h - y - data.d + offset.X + offset.V) * scale;
                groove.y1 = (detail.y2);
                groove.x2 = (groove.x1 / scale + data.d) * scale;
                groove.y2 = (detail.y2 / scale - data.z) * scale;
                groove.v = 'b';
                break;
        }
        groove.type = "groove";
        if (data.ext !== undefined) {
            groove.ext = Number(data.ext);
        } else {
            groove.ext = false;
        }
        return groove;
    }

    function calcSrez(data, detail) {
        var srez = {};

        angle = data['param'];
        beta = 90 - Math.abs(data['param']);

        if ((data['side'] == 2 || data['side'] == 3)) {
            real_angle = 90 + angle;
        } else {
            real_angle = 90 - angle;
        }

        real_angle = (real_angle * Math.PI) / 180;

        srez.y1 = (angle > 0) ? detail.y2 : detail.y1;
        srez.y2 = (angle > 0) ? detail.y1 : detail.y2;
        srez.angle = Math.abs(angle);
        k1 = Math.tan(real_angle);
        if (data['side'] == 2 || data['side'] == 3) {
            srez.x1 = detail.x1;
            b1 = srez.y1 - srez.x1 * k1;
            srez.x2 = (srez.y2 - b1) / k1;
        } else {
            srez.x1 = detail.x2;
            b1 = srez.y1 - srez.x1 * k1;
            srez.x2 = (srez.y2 - b1) / k1;
        }
        srez.side = (data['side'] == 2 || data['side'] == 3) > 0 ? 'l' : 'r';
        srez.d = (angle > 0) ? 0 : 1;
        srez.type = "srez";
        return srez;
    }

    function calcCorner(data, detail) {

        var corner = {};
        var h = _this.detail.fullHeight;
        var w = _this.detail.fullWidth;
        switch (data['key']) {
            case 1:
                corner.x1 = Math.round((offset.X + offset.V) * scale);
                corner.y1 = Math.round((offset.Y + offset.V + h - data['y']) * scale);
                corner.x2 = Math.round((corner.x1 / scale + data['x']) * scale);
                corner.y2 = Math.round((corner.y1 / scale + data['y']) * scale);
                break;
            case 2:
                corner.x1 = Math.round((offset.X + offset.V) * scale);
                corner.y1 = Math.round((offset.Y + offset.V + data['y']) * scale);
                corner.x2 = Math.round((corner.x1 / scale + data['x']) * scale);
                corner.y2 = Math.round((corner.y1 / scale - data['y']) * scale);
                break;
            case 3:
                corner.x1 = Math.round((offset.X + offset.V + w) * scale);
                corner.y1 = Math.round((offset.Y + offset.V + data['y']) * scale);
                corner.x2 = Math.round((corner.x1 / scale - data['x']) * scale);
                corner.y2 = Math.round((corner.y1 / scale - data['y']) * scale);
                break;
            case 4:
                corner.x1 = Math.round((offset.X + offset.V + w) * scale);
                corner.y1 = Math.round((offset.Y + offset.V + h - data['y']) * scale);
                corner.x2 = Math.round((corner.x1 / scale - data['x']) * scale);
                corner.y2 = Math.round((corner.y1 / scale + data['y']) * scale);
                break;
        }
        corner.key = data['key'];
        corner.angle = 90 - Math.abs(lineAngle(corner.x2, corner.y2, corner.x1, corner.y1));
        if (data['r'] === undefined || data['r'] == 0) {
            corner.r = 0;
        } else {
            corner.r = Number(data['r']) * scale;
        }
        if (data['type'] == '1') {
            corner.inner = data['inner'];

            if (corner.inner == 0) {
                corner.angle = 0.5 * corner.key * Math.PI;
                if (corner.key == 4) {
                    corner.angle = 0;
                }
            }
        }
        corner.type = "corner";
        corner.width = w - data['x'];
        corner.height = h - data['y'];
        corner.sizeH = data['x'] * scale;
        corner.sizeV = data['y'] * scale;
        corner.minX = Math.min(corner.x1, corner.x2);
        corner.minY = Math.min(corner.y1, corner.y2);
        corner.maxX = Math.max(corner.x1, corner.x2);
        corner.maxY = Math.max(corner.y1, corner.y2);
        corner.t2 = data['type'];
        corner.kromka = data['kromka'];
        return corner;
    }

    function calcShapeByPattern(data, detail, lineWidth) {
        var sbp = {};
        var h = _this.detail.fullHeight;
        var w = _this.detail.fullWidth;

        if (data['patternId'] == 'rectangular' || data['patternId'] == 'uShaped') {
            sbp.x1 = (offset.X + offset.V + data['shiftX']) * scale;
            sbp.y1 = (offset.Y + offset.V + h - data['shiftY'] - data['sizeV']) * scale;
            sbp.x2 = (sbp.x1 / scale + data['sizeH']) * scale;
            sbp.y2 = (sbp.y1 / scale + data['sizeV']) * scale;
            if (data['patternId'] == 'uShaped') {
                sbp.r = data['radius'] * scale;
                sbp.edgeId = data['edgeId'];
            }
            sbp.sizeH = data['sizeH'] * scale;
            sbp.sizeV = data['sizeV'] * scale;
        } else if (data['patternId'] == 'circle') {
            sbp.x0 = (offset.X + offset.V + data['shiftX']) * scale;
            sbp.y0 = (offset.Y + offset.V + h - data['shiftY']) * scale;
            sbp.r = data['radius'] * scale;
            sbp.x1 = (sbp.x0 / scale - data['radius']) * scale;
            sbp.y1 = (sbp.y0 / scale - data['radius']) * scale;
            sbp.x2 = (sbp.x1 / scale + data['radius'] * 2) * scale;
            sbp.y2 = (sbp.y1 / scale + data['radius'] * 2) * scale;
            sbp.sizeH = (data['radius'] * 2) * scale;
            sbp.sizeV = (data['radius'] * 2) * scale;
        } else if (data['patternId'] == 'smile') {
            sbp.r1 = 95 * scale;
            sbp.r2 = 122 * scale;
            sbp.par = 48.2 * scale;
            sbp.perp = 13.2 * scale;
            sbp.edgeId = data['edgeId'];
            sbp.x1 = (data['shiftX'] + offset.X + offset.V) * scale;
            sbp.y1 = (h - data['shiftY'] + offset.Y + offset.V - data['sizeV']) * scale;
            sbp.x2 = (sbp.x1 / scale + data['sizeH']) * scale;
            sbp.y2 = (sbp.y1 / scale + data['sizeV']) * scale;
            sbp.sizeH = data['sizeH'] * scale;
            sbp.sizeV = data['sizeV'] * scale;
            var KANSTANTA = 0.54;
            switch (Number(data['edgeId'])) {
                case 2:
                    sbp.m_x1 = sbp.x1 - lineWidth / 2 - 1.2;
                    sbp.m_y1 = sbp.y2;
                    sbp.x0_1 = sbp.x1 + sbp.r1;
                    sbp.y0_1 = sbp.y2;
                    sbp.a1_1 = Math.PI;
                    sbp.a1_2 = Math.PI + KANSTANTA - 0.015;

                    sbp.m_x2 = sbp.x1 + sbp.perp - lineWidth / 2 - 1;
                    sbp.m_y2 = sbp.y1 + sbp.par;
                    sbp.x0_2 = sbp.x1 - (sbp.r2 - sbp.sizeH);
                    sbp.y0_2 = sbp.y1 + sbp.sizeV / 2;
                    sbp.a2_1 = 2 * Math.PI - KANSTANTA;
                    sbp.a2_2 = KANSTANTA;

                    sbp.m_x3 = sbp.m_x1;
                    sbp.m_y3 = sbp.m_y1 - sbp.par;
                    sbp.x0_3 = sbp.x1 + sbp.r1;
                    sbp.y0_3 = sbp.y1;
                    sbp.a3_1 = Math.PI - KANSTANTA;
                    sbp.a3_2 = Math.PI;
                    break;
                case 3:
                    sbp.m_x1 = sbp.x1;
                    sbp.m_y1 = sbp.y1 - lineWidth / 2 - 1.2;
                    sbp.x0_1 = sbp.x1;
                    sbp.y0_1 = sbp.y1 + sbp.r1;
                    sbp.a1_1 = 1.5 * Math.PI;
                    sbp.a1_2 = 1.5 * Math.PI + KANSTANTA;

                    sbp.m_x2 = sbp.x1 + sbp.par - 0.1;
                    sbp.m_y2 = sbp.y1 + sbp.perp - lineWidth / 2 - 1;
                    sbp.x0_2 = sbp.x1 + sbp.sizeH / 2;
                    sbp.y0_2 = sbp.y1 - (sbp.r2 - sbp.sizeV);
                    sbp.a2_1 = 0.5 * Math.PI - KANSTANTA + 0.015;
                    sbp.a2_2 = 0.5 * Math.PI + KANSTANTA;

                    sbp.m_x3 = sbp.m_x1 + sbp.par;
                    sbp.m_y3 = sbp.m_y1;
                    sbp.x0_3 = sbp.x2;
                    sbp.y0_3 = sbp.y1 + sbp.r1;
                    sbp.a3_1 = 1.5 * Math.PI - KANSTANTA;
                    sbp.a3_2 = 1.5 * Math.PI - 0.01;
                    break;
                case 4:
                    sbp.m_x1 = sbp.x2 + lineWidth / 2 + 1.2;
                    sbp.m_y1 = sbp.y1;
                    sbp.x0_1 = sbp.x2 - sbp.r1;
                    sbp.y0_1 = sbp.y1;
                    sbp.a1_1 = 0;
                    sbp.a1_2 = KANSTANTA - 0.015;

                    sbp.m_x2 = sbp.x2 + sbp.perp + lineWidth / 2 + 1.1;
                    sbp.m_y2 = sbp.y1 + sbp.par;
                    sbp.x0_2 = sbp.x2 + (sbp.r2 - sbp.sizeH);
                    sbp.y0_2 = sbp.y1 + sbp.sizeV / 2;
                    sbp.a2_1 = Math.PI - KANSTANTA + 0.022;
                    sbp.a2_2 = Math.PI + KANSTANTA;

                    sbp.m_x3 = sbp.m_x1;
                    sbp.m_y3 = sbp.y2 - sbp.par;
                    sbp.x0_3 = sbp.x2 - sbp.r1;
                    sbp.y0_3 = sbp.y2;
                    sbp.a3_1 = 2 * Math.PI - KANSTANTA;
                    sbp.a3_2 = 0;
                    break;
                case 5:
                    sbp.m_x1 = sbp.x2;
                    sbp.m_y1 = sbp.y2 + lineWidth / 2 + 1.2;
                    sbp.x0_1 = sbp.x2;
                    sbp.y0_1 = sbp.y2 - sbp.r1;
                    sbp.a1_1 = 0.5 * Math.PI;
                    sbp.a1_2 = 0.5 * Math.PI + KANSTANTA;

                    sbp.m_x2 = sbp.x2 - sbp.par;
                    sbp.m_y2 = sbp.y2 - sbp.perp + lineWidth / 2 + 1.1;
                    sbp.x0_2 = sbp.x2 - sbp.sizeH / 2;
                    sbp.y0_2 = sbp.y2 + (sbp.r2 - sbp.sizeV);
                    sbp.a2_1 = 1.5 * Math.PI - KANSTANTA + 0.012;
                    sbp.a2_2 = 1.5 * Math.PI + KANSTANTA;

                    sbp.m_x3 = sbp.m_x2;
                    sbp.m_y3 = sbp.m_y1;
                    sbp.x0_3 = sbp.x1;
                    sbp.y0_3 = sbp.y2 - sbp.r1;
                    sbp.a3_1 = 0.5 * Math.PI - KANSTANTA;
                    sbp.a3_2 = 0.5 * Math.PI;
                    break;
            }
        }
        sbp.type = data['patternId'];
        return sbp;
    }

    function getGrooveSide(side, type) {
        switch (side) {
            case 1:
            case 6:
                if (type == 0) return 2;
                return 5;
            case 2:
            case 4:
                return 3;
            case 3:
            case 5:
                return 2;
                break;
        }
    }

    function getSrezSide(side, cornerSrez) {
        if (!cornerSrez){
            switch (side) {
                case 2:
                case 4:
                    return 5;
                    break;
                case 3:
                case 5:
                    return 2;
                    break;
            }
        } else{
            switch (Number(side)) {
                case 1:
                case 2:
                    return 5;
                    break;
                case 3:
                case 4:
                    return 2;
                    break;
            }
        }
    }

    function getcornerSrezSide(side) {
        
    }

    function getRabbetSide(side) {
        return Number(side[1]);
    }

    function drawGroove(ctx, groove) {
        ctx.beginPath();
        ctx.moveTo(groove.x1, groove.y1);
        ctx.lineTo(groove.x1, groove.y2);
        ctx.lineTo(groove.x2, groove.y2);
        ctx.lineTo(groove.x2, groove.y1);
        ctx.closePath();
        ctx.stroke();

        var v = {x: 0, y: 0, w: 0, h: 0};
        switch (groove.v) {
            case 'l':
                v.x = -ctx.lineWidth / 2;
                v.y = ctx.lineWidth / 2;
                v.h = -ctx.lineWidth;
                break;
            case 't':
                v.x = ctx.lineWidth / 2;
                v.w = -ctx.lineWidth;
                v.y = -ctx.lineWidth / 2;
                break;
            case 'r':
                v.x = ctx.lineWidth / 2;
                v.y = ctx.lineWidth / 2;
                v.h = -ctx.lineWidth;
                break;
            case 'b':
                v.x = ctx.lineWidth / 2;
                v.w = -ctx.lineWidth;
                v.y = ctx.lineWidth / 2;
                break;
        }

        if (groove.ext) {
            ctx.fillStyle = "green";
            ctx.fillRect(groove.x1 + v.x, groove.y1 + v.y, groove.x2 - groove.x1 + v.w, groove.y2 - groove.y1 + v.h);
        } else {
            if (groove.full) {
                ctx.clearRect(groove.x1 + v.x, groove.y1 + v.y, groove.x2 - groove.x1 + v.w, groove.y2 - groove.y1 + v.h);
            }
        }
    }

    function drawSrez(ctx, data) {

        ctx.beginPath();
        ctx.moveTo(data.x1, data.y1);
        ctx.lineTo(data.x2, data.y2);
        ctx.closePath();
        ctx.stroke();

        x = (ctx.lineWidth / 2) / Math.cos(data.angle * Math.PI / 180);
        x2 = (ctx.lineWidth / 2) * Math.tan(data.angle * Math.PI / 180);
        if (data.side == 'l') {
            x = -x;
            x2 = -x2;
        }
        if (!data.d) {
            y = -ctx.lineWidth / 2;
        } else {
            y = ctx.lineWidth / 2;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(data.x1 + x, data.y1);
        ctx.lineTo(data.x2 + x, data.y2);
        ctx.lineTo(data.x2 + x, data.y2 + y);
        ctx.lineTo(data.x1 + x, data.y2 + y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawCorner(ctx, data, dataOrigin) {
        ctx.beginPath();
        if (data['t2'] == '1') {
            for (var i = 0; i < 2; i++) {
                if (i == 1) {
                    ctx.closePath();
                    ctx.stroke();
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();

                    data.r -= ctx.lineWidth / 5;
                    if (data.key == 1 || data.key == 4) {
                        data.y1 += ctx.lineWidth / 2;
                        data.y2 += ctx.lineWidth / 2 + 1;
                    } else {
                        data.y1 -= ctx.lineWidth / 2;
                        data.y2 -= ctx.lineWidth / 2 + 1;
                    }
                    if (data.key < 3) {
                        data.x2 -= ctx.lineWidth / 2;
                        data.x1 -= ctx.lineWidth / 2 + 1;
                    } else {
                        data.x2 += ctx.lineWidth / 2;
                        data.x1 += ctx.lineWidth / 2 + 1;
                    }
                }
                if (data.key == '2' || data.key == '4') {
                    ctx.moveTo(data.x1, data.y1);
                } else {
                    ctx.moveTo(data.x2, data.y2);
                }
                ctx.arc(data.x2, data.y1, data.r, data.angle, data.angle + 0.5 * Math.PI);
                if (i == 1) {
                    if (data.key == 1) {
                        ctx.lineTo(data.x1 - 1, data.y1);
                    } else if (data.key == 2) {
                        ctx.lineTo(data.x1, data.y2 - 2);
                    } else if (data.key == 3) {
                        ctx.lineTo(data.x1 + 1, data.y1);
                    } else {
                        ctx.lineTo(data.x1, data.y2 + 2);
                    }
                }
                // ctx.lineTo(data.x1, data.y2);
                ctx.lineTo(data.x1, data.y2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (data['t2'] == '2') {
            ctx.moveTo(data.x1, data.y1);
            ctx.lineTo(data.x2, data.y2);
            ctx.closePath();
            ctx.stroke();

            x = (ctx.lineWidth / 2) / Math.cos(data.angle * Math.PI / 180);
            x2 = (ctx.lineWidth / 2) * Math.tan(data.angle * Math.PI / 180);
            if (data.key < 3) {
                x = -x;
            } else {
                x2 = -x2;
            }
            if (data.key == 2 || data.key == 3) {
                y = -ctx.lineWidth / 2 - 1;
            } else {
                y = ctx.lineWidth / 2 + 1;
            }
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.moveTo(data.x1 + x, data.y1);
            ctx.lineTo(data.x2 + x + x2, data.y2 + y);
            ctx.lineTo(data.x1 + x, data.y2 + y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (data['t2'] == '3') {
            for (var i = 0; i < 2; i++) {
                if (i == 1) {
                    ctx.closePath();
                    ctx.stroke();
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    if (data.r != 0) {
                        data.r -= ctx.lineWidth / 2;
                    }
                    if (data.key == 1 || data.key == 4) {
                        data.y1 += ctx.lineWidth / 2;
                        data.y2 += ctx.lineWidth / 2 + 2;
                    } else {
                        data.y1 -= ctx.lineWidth / 2;
                        data.y2 -= ctx.lineWidth / 2 + 2;
                    }
                    if (data.key < 3) {
                        data.x2 -= ctx.lineWidth / 2;
                        data.x1 -= ctx.lineWidth / 2 + 1;
                    } else {
                        data.x2 += ctx.lineWidth / 2;
                        data.x1 += ctx.lineWidth / 2 + 1;
                    }
                }
                var xForExt = 0;
                var yForExt = 0;
                if (data.key == 1) {
                    ctx.moveTo(data.x1, data.y1);
                    ctx.lineTo(data.x2 - data.r, data.y1);
                    ctx.arc(data.x2 - data.r, data.y1 + data.r, data.r, 1.5 * Math.PI, 2 * Math.PI);
                    ctx.lineTo(data.x2, data.y2);
                    ctx.lineTo(data.x1, data.y2);
                    xForExt = data.x2 - data.r;
                    yForExt = data.y1 + data.r;
                } else if (data.key == 2) {
                    ctx.moveTo(data.x2, data.y2);
                    ctx.lineTo(data.x2, data.y1 - data.r);
                    ctx.arc(data.x2 - data.r, data.y1 - data.r, data.r, 0, 0.5 * Math.PI);
                    ctx.lineTo(data.x1, data.y1);
                    ctx.lineTo(data.x1, data.y2);
                    xForExt = data.x2 - data.r;
                    yForExt = data.y1 - data.r;
                } else if (data.key == 3) {
                    ctx.moveTo(data.x1, data.y1);
                    ctx.lineTo(data.x2 + data.r, data.y1);
                    // ctx.arc(data.x2 + data.r, data.y1 - data.r, data.r, 0.5 * Math.PI, 1 * Math.PI);
                    ctx.lineTo(data.x2, data.y2);
                    ctx.lineTo(data.x1, data.y2);
                    xForExt = data.x2 + data.r;
                    yForExt = data.y1 - data.r;
                } else if (data.key == 4) {
                    ctx.moveTo(data.x2, data.y2);
                    ctx.lineTo(data.x2, data.y1 + data.r);
                    ctx.arc(data.x2 + data.r, data.y1 + data.r, data.r, 1 * Math.PI, 1.5 * Math.PI);
                    ctx.lineTo(data.x1, data.y1);
                    ctx.lineTo(data.x1, data.y2);
                    xForExt = data.x2 + data.r;
                    yForExt = data.y1 + data.r;
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            if (dataOrigin.ext) {
                ctx.beginPath();
                ctx.arc(xForExt, yForExt, 10, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'red';
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }

    function drawShapeByPattern(ctx, sbp, data) {
        var x1ForExt = 0;
        var x2ForExt = 0;
        var y1ForExt = 0;
        var y2ForExt = 0;
        ctx.beginPath();
        if (sbp.type == 'rectangular') {
            ctx.moveTo(sbp.x1, sbp.y1);
            ctx.lineTo(sbp.x1, sbp.y2);
            ctx.lineTo(sbp.x2, sbp.y2);
            ctx.lineTo(sbp.x2, sbp.y1);
            ctx.closePath();
            ctx.stroke();

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();

            fill_x1 = sbp.x1 + ctx.lineWidth / 2;
            fill_y1 = sbp.y1 + ctx.lineWidth / 2;
            fill_x2 = sbp.x2 - ctx.lineWidth / 2;
            fill_y2 = sbp.y2 - ctx.lineWidth / 2;

            ctx.moveTo(fill_x1, fill_y1);
            ctx.lineTo(fill_x1, fill_y2);
            ctx.lineTo(fill_x2, fill_y2);
            ctx.lineTo(fill_x2, fill_y1);
        } else if (sbp.type == 'uShaped') {

            for (var i = 0; i < 2; i++) {
                if (i == 1) {
                    ctx.closePath();
                    ctx.stroke();
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    sbp.x1 = sbp.x1 + ctx.lineWidth / 2;
                    sbp.y1 = sbp.y1 + ctx.lineWidth / 2;
                    sbp.x2 = sbp.x2 - ctx.lineWidth / 2;
                    sbp.y2 = sbp.y2 - ctx.lineWidth / 2;
                    if (sbp.edgeId == '2') {
                        sbp.x1 -= ctx.lineWidth * 1.5;
                    } else if (sbp.edgeId == '3') {
                        sbp.y1 -= ctx.lineWidth * 1.5;
                    } else if (sbp.edgeId == '4') {
                        sbp.x2 += ctx.lineWidth * 1.5;
                    } else if (sbp.edgeId == '5') {
                        sbp.y2 += ctx.lineWidth * 1.5;
                    }
                }
                if (sbp.edgeId == '2') {
                    ctx.moveTo(sbp.x1, sbp.y1);
                    ctx.lineTo(sbp.x2 - sbp.r, sbp.y1);
                    ctx.arc(sbp.x2 - sbp.r, sbp.y1 + sbp.r, sbp.r, 1.5 * Math.PI, 2 * Math.PI);
                    ctx.lineTo(sbp.x2, sbp.y2 - sbp.r);
                    ctx.arc(sbp.x2 - sbp.r, sbp.y2 - sbp.r, sbp.r, 0, 0.5 * Math.PI);
                    ctx.lineTo(sbp.x1, sbp.y2);
                } else if (sbp.edgeId == '3') {
                    ctx.moveTo(sbp.x2, sbp.y1);
                    ctx.lineTo(sbp.x2, sbp.y2 - sbp.r);
                    ctx.arc(sbp.x2 - sbp.r, sbp.y2 - sbp.r, sbp.r, 0, 0.5 * Math.PI);
                    ctx.lineTo(sbp.x1 + sbp.r, sbp.y2);
                    ctx.arc(sbp.x1 + sbp.r, sbp.y2 - sbp.r, sbp.r, 0.5 * Math.PI, Math.PI);
                    ctx.lineTo(sbp.x1, sbp.y1);
                    ctx.stroke();
                    ctx.save();
                    ctx.closePath();
                    ctx.beginPath();
                    //
                    // ctx.arc(sbp.x2, sbp.y2, 5, 0, 2 * Math.PI);

                } else if (sbp.edgeId == '4') {
                    ctx.moveTo(sbp.x2, sbp.y2);
                    ctx.lineTo(sbp.x1 + sbp.r, sbp.y2);
                    ctx.arc(sbp.x1 + sbp.r, sbp.y2 - sbp.r, sbp.r, 0.5 * Math.PI, Math.PI);
                    ctx.lineTo(sbp.x1, sbp.y1 + sbp.r);
                    ctx.arc(sbp.x1 + sbp.r, sbp.y1 + sbp.r, sbp.r, Math.PI, 1.5 * Math.PI);
                    ctx.lineTo(sbp.x2, sbp.y1);

                    x1ForExt = sbp.x1 + sbp.r;
                    x2ForExt = sbp.x1 + sbp.r;
                    y1ForExt = sbp.y2 - sbp.r;
                    y2ForExt = sbp.y1 + sbp.r;

                } else if (sbp.edgeId == '5') {
                    ctx.moveTo(sbp.x1, sbp.y2);
                    ctx.lineTo(sbp.x1, sbp.y1 + sbp.r);
                    ctx.arc(sbp.x1 + sbp.r, sbp.y1 + sbp.r, sbp.r, Math.PI, 1.5 * Math.PI);
                    ctx.lineTo(sbp.x2 - sbp.r, sbp.y1);
                    ctx.arc(sbp.x2 - sbp.r, sbp.y1 + sbp.r, sbp.r, 1.5 * Math.PI, 2 * Math.PI);
                    ctx.lineTo(sbp.x2, sbp.y2);

                    x1ForExt = sbp.x1 + sbp.r;
                    x2ForExt = sbp.x2 - sbp.r;
                    y1ForExt = sbp.y1 + sbp.r;
                    y2ForExt = sbp.y1 + sbp.r;

                }
            }
        } else if (sbp.type == 'circle') {
            ctx.arc(sbp.x0, sbp.y0, sbp.r, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(sbp.x0, sbp.y0, sbp.r - ctx.lineWidth / 2, 0, 2 * Math.PI);
        } else if (sbp.type == 'smile') {
            ctx.arc(sbp.x0_1, sbp.y0_1, sbp.r1, sbp.a1_1, sbp.a1_2);

            ctx.arc(sbp.x0_2, sbp.y0_2, sbp.r2, sbp.a2_1, sbp.a2_2);

            ctx.arc(sbp.x0_3, sbp.y0_3, sbp.r1, sbp.a3_1, sbp.a3_2);

            ctx.closePath();
            ctx.stroke();
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            sbp.r1 += ctx.lineWidth / 2;
            sbp.r2 -= ctx.lineWidth / 2;

            ctx.moveTo(sbp.m_x1, sbp.m_y1);
            ctx.arc(sbp.x0_1, sbp.y0_1, sbp.r1, sbp.a1_1, sbp.a1_2);
            ctx.lineTo(sbp.m_x3, sbp.m_y3);

            if (sbp.edgeId == '2' || sbp.edgeId == '4') {
                ctx.lineTo(sbp.m_x1, sbp.m_y2);
                ctx.lineTo(sbp.m_x2, sbp.m_y2);
            } else {
                ctx.lineTo(sbp.m_x2, sbp.m_y1);
                ctx.lineTo(sbp.m_x2, sbp.m_y2);
            }
            ctx.arc(sbp.x0_2, sbp.y0_2, sbp.r2, sbp.a2_1, sbp.a2_2);

            ctx.lineTo(sbp.m_x3, sbp.m_y3);
            if (sbp.edgeId == '2' || sbp.edgeId == '4') {
                ctx.lineTo(sbp.m_x1, sbp.m_y2);
                ctx.lineTo(sbp.m_x2, sbp.m_y2);
            } else {
                ctx.lineTo(sbp.m_x2, sbp.m_y1);
                ctx.lineTo(sbp.m_x2, sbp.m_y2);
            }
            ctx.arc(sbp.x0_3, sbp.y0_3, sbp.r1, sbp.a3_1, sbp.a3_2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (sbp.type == 'uShaped' && data['ext'] == '1') {
            ctx.beginPath();
            ctx.arc(x1ForExt, y1ForExt, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            ctx.beginPath();
            ctx.arc(x2ForExt, y2ForExt, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }

    function expandGrooveDrawForRabbet(ctx, side, side2, rabbet) {
        var lineOffset = (side2 == 1) ? -ctx.lineWidth / 2 : ctx.lineWidth / 2;
        switch (side) {
            case 2:
            case 4:
                ctx.clearRect(rabbet.x1 - ctx.lineWidth / 2, rabbet.y1 + lineOffset, ctx.lineWidth, rabbet.y2 - rabbet.y1);
                break;
            case 3:
            case 5:
                ctx.clearRect(rabbet.x1 - ctx.lineWidth / 2, rabbet.y1 + lineOffset, ctx.lineWidth, rabbet.y2 - rabbet.y1);
                break;
        }
    }

    function lineAngle(x1, y1, x2, y2) {
        if (x1 == x2) {
            if (y2 > y1) {
                return 90;
            } else {
                return 270;
            }
        } else if (y1 == y2) {
            if (x2 > x1) {
                return 180;
            } else {
                return 0;
            }
        } else {
            return -(Math.atan((y2 - y1) / (x2 - x1)) * 180) / Math.PI;
        }
    }

    function lineAngleRad(x1, y1, x2, y2) {
        if (x1 == x2) {
            if (y2 > y1) {
                return 1.5 * Math.PI;
            } else {
                return 0.5 * Math.PI;
            }
        } else if (y1 == y2) {
            if (x2 > x1) {
                return 0;
            } else {
                return Math.PI;
            }
        } else {
            var angle = Math.atan2((y2 - y1), (x2 - x1));
            // while (angle > Math.PI * 2) {
            //     angle -= Math.PI * 2;
            // }
            // while (angle < 0) {
            //     angle += Math.PI * 2;
            // }
            return angle;
        }
    }

// считает равноудаленные точки на линии от точки x2, y2
    function calcEquidistantPointsByDots(x1, y1, x2, y2, offset) {
        var ret = [{}, {}];
        if (x1 != x2) {
            line_k = (y2 - y1) / (x2 - x1);
            line_b = y1 - x1 * line_k;

            a1 = Math.pow(line_k, 2) + 1;
            b1 = -2 * (x2 - line_k * line_b + line_k * y2);
            c1 = Math.pow(x2, 2) + Math.pow(line_b, 2) - 2 * line_b * y2 + Math.pow(y2, 2) - Math.pow(offset, 2);
            d1 = Math.pow(b1, 2) - 4 * a1 * c1;
            ret[0]['x'] = (-b1 - Math.sqrt(d1)) / (2 * a1);
            ret[1]['x'] = (-b1 + Math.sqrt(d1)) / (2 * a1);

            ret[0]['y'] = line_k * ret['x1'] + line_b;
            ret[1]['y'] = line_k * ret['x2'] + line_b;
        } else {
            ret[0]['x'] = x2;
            ret[1]['x'] = x2;
            ret[0]['y'] = y2 - offset;
            ret[1]['y'] = y2 + offset;
        }
        return ret;
    }

// считает равноудаленные точки на линии от точки x0, y0
// !!! линия не должна быть парралельна оси OY !!!
    function calcEquidistantPointsByEquation(x, y, line_k, line_b, offset) {
        var ret = [{}, {}];
        a1 = Math.pow(line_k, 2) + 1;
        b1 = (-2) * (x - line_k * line_b + line_k * y);
        c1 = Math.pow(x, 2) + Math.pow(line_b, 2) - 2 * line_b * y + Math.pow(y, 2) - Math.pow(offset, 2);
        // console.log('a = ', a1, ' | b = ', b1, ' | c = ', c1);
        d1 = Math.pow(b1, 2) - 4 * a1 * c1;
        ret[0]['x'] = (-b1 - Math.sqrt(d1)) / (2 * a1);
        ret[1]['x'] = (-b1 + Math.sqrt(d1)) / (2 * a1);

        ret[0]['y'] = line_k * ret[0]['x'] + line_b;
        ret[1]['y'] = line_k * ret[1]['x'] + line_b;
        return ret;
    }

// проверяет нахождение точки x0, y0 на линии
    function checkDotOnLine(x0, y0, x1, y1, x2, y2) {
        if (x1 != x2) {
            p = (x0 - x2) / (x1 - x2);
            test = p * y1 + (1 - p) * y2;
            if (Math.round(test, 3) == Math.round(y0, 3) && p >= 0 && p <= 1) {
                return true;
            } else {
                return false;
            }
        } else {
            min = Math.min(y1, y2);
            max = Math.max(y1, y2);
            if (Math.round(x0, 3) == Math.round(x1, 3) && y0 > min && y0 < max) {
                return true;
            } else {
                return false;
            }
        }
    }

// Возвращает координаты двух точек - концов стрелки для точки x2, y2
    function calcArrows(x1, y1, x2, y2) {
        var off1 = 13;
        var off2 = 8;
        var dots = [];
        dots[0] = {};
        dots[1] = {};

        if (x1 == x2) {
            dots[0]['x'] = x2 - off2;
            dots[1]['x'] = x2 + off2;
            dots[0]['y'] = y2 + ((y2 < y1) ? off1 : -off1);
            dots[1]['y'] = y2 + ((y2 < y1) ? off1 : -off1);
        } else if (y1 == y2) {
            dots[0]['x'] = x2 + ((x2 < x1) ? off1 : -off1);
            dots[1]['x'] = x2 + ((x2 < x1) ? off1 : -off1);
            dots[0]['y'] = y2 - off2;
            dots[1]['y'] = y2 + off2;
        } else {
            dots = calcEquidistantPointsByDots(x1, y1, x2, y2, off1);
            dot1 = checkDotOnLine(dots[0]['x'], dots[0]['y'], x1, y1, x2, y2) ? {
                'x': dots[0]['x'],
                'y': dots[0]['y']
            } : {'x': dots[1]['x'], 'y': dots[1]['y']};

            line_k = (y2 - y1) / (x2 - x1);
            dot1_k = -1 / line_k;
            dot1_b = dot1['y'] - dot1_k * dot1['x'];
            dots = calcEquidistantPointsByEquation(dot1['y'], dot1['x'], dot1_k, dot1_b, off2);
        }
        return dots;
    }

    function calcLinesForGroove(detail, groove, data, translateX) {

        if (data.type) {
            var h = _this.detail.fullWidth;
            var y = h - data.x - data.d;
            var text2 = data.x;
        } else {
            var h = _this.detail.fullHeight;
            var y = h - data.y - data.d;
            var text2 = data.y;
        }

        var lines = [
            {
                x1: groove.x1 - (offset.V / 2) * scale,
                y1: groove.y1,
                x2: groove.x1 - (offset.V / 2) * scale,
                y2: groove.y2,
                text: data.z
            },
            {
                x1: groove.x1,
                y1: groove.y2 + (offset.V / 2) * scale,
                x2: groove.x2,
                y2: groove.y2 + (offset.V / 2) * scale,
                text: data.d
            },
            {
                x1: detail.x1,
                y1: 0,
                x2: groove.x1,
                y2: 0,
                text: h - y - data.d,
                offset: translateX + (groove.x1 - translateX) / 2
            }
        ];

        if (Number(data.side) == 1 || Number(data.side) == 6) {
            lines[3] = {};
            lines[3].x1 = groove.x2;
            lines[3].y1 = 0;
            lines[3].x2 = detail.x2;
            lines[3].y2 = 0;
            lines[3].text = y;
            lines[3].offset = (translateX + config.default.width - groove.x2) / 2 + groove.x2;
        } else if (groove.x1 > detail.x2 / 2) {
            lines[2].x1 = groove.x2;
            lines[2].y1 = 0;
            lines[2].x2 = detail.x2;
            lines[2].y2 = 0;
            lines[2].text = y;
            lines[2].offset = (translateX + config.default.width - groove.x2) / 2 + groove.x2;
        }

        switch (Number(data.side)) {
            case 1:
                lines[2].y1 = detail.y1 - (offset.V / 2) * scale;
                lines[2].y2 = detail.y1 - (offset.V / 2) * scale;
                lines[3].y1 = detail.y1 - (offset.V / 2) * scale;
                lines[3].y2 = detail.y1 - (offset.V / 2) * scale;
                break;
            case 2:
            case 3:
                lines[0].x1 = groove.x2 + (offset.V / 2) * scale;
                lines[0].x2 = groove.x2 + (offset.V / 2) * scale;
                lines[0].text = data.d;
                lines[1].text = data.z;
                lines[2].x1 = groove.x1 + (offset.V / 2) * scale;
                lines[2].x2 = lines[2].x1;
                lines[2].y1 = detail.y1;
                lines[2].y2 = groove.y1;
                lines[2].text = text2;
                break;
            case 4:
            case 5:
                lines[0].x1 = groove.x2 - (offset.V / 2) * scale;
                lines[0].x2 = groove.x2 - (offset.V / 2) * scale;
                lines[0].text = data.d;
                lines[1].text = data.z;
                lines[2].x1 = groove.x2 + (offset.V / 2) * scale;
                lines[2].x2 = lines[2].x1;
                lines[2].y1 = detail.y1;
                lines[2].y2 = groove.y1;
                lines[2].text = text2;
                break;
            case 6:
                lines[1].y1 = groove.y2 - (offset.V / 2) * scale;
                lines[1].y2 = groove.y2 - (offset.V / 2) * scale;
                lines[2].y1 = detail.y2 + (offset.V / 2) * scale;
                lines[2].y2 = detail.y2 + (offset.V / 2) * scale;
                lines[3].y1 = detail.y2 + (offset.V / 2) * scale;
                lines[3].y2 = detail.y2 + (offset.V / 2) * scale;
                break;
        }
        var fug = 0.5;
        if (Number(data.side) == 1 || Number(data.side) == 6) {
            if (data.type) {

                if (_this.detail.kromki.left) {
                    lines[2].text = data['x'] - _this.detail.kromki.left + fug;
                }
                else {
                    lines[2].text = data['x'];
                }
                lines.pop();

            } else {
                if (_this.detail.kromki.bottom) {
                    lines[3].text = data['y'] - _this.detail.kromki.bottom + fug;
                }
                else {
                    lines[3].text = data['y'];
                }
                delete lines[2];
            }
        }

        return lines;
    }

    function getThicknessBandForTrimH() {
        var result = 0;
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            async: false,
            data: ({
                controller: 'Edges', action: 'getEdgeThickness',
                article: data.clipping.cutHBand,
            }),
            dataType: 'json',
            success: function (data) {
                result = data;
            }
        });
        return result;

    }

    function getThicknessBandForTrimV() {
        var result = 0;
        $.ajax({
            type: "POST",
            url: "system/controllers/JsonController.php",
            async: false,
            data: ({
                controller: 'Edges', action: 'getEdgeThickness',
                article: data.clipping.cutVBand,
            }),
            dataType: 'json',
            success: function (data) {
                result = data;
            }
        });
        return result;

    }


    function calcLinesForEdgeCut(detail, edgeCut, data, side) {
        var lines = [];
        var thickH = 0;
        var thickV = 0;
        var promiceH = getThicknessBandForTrimH();
        if (promiceH != -1) thickH = promiceH;
        var promiceV = getThicknessBandForTrimV();
        var hasVerClipping = false;
        if (promiceV != -1) thickV = promiceV;

        var fx = 0; // фуга x
        var fy = 0; // фуга y
        if (data.clipping.cutHSize >= data.clipping.cutVSize) {
            if (data.clipping.cutHSize < 4000) {
                fx = 0.5;
            }
            if (data.clipping.cutHSize < 3000) {
                fy = 0.5;
            }
        } else {
            if (data.clipping.cutVSize < 4000) {
                fy = 0.5;
            }
            if (data.clipping.cutVSize < 3000) {
                fx = 0.5;
            }
        }
        //общий размер детали
        var text = data.clipping.cutVSize - (thickV ? thickV - fy : 0);
        var fugue = data['fugue'];
        if (data.clipping.cutVSize >= 65 && _this.detail.kromki.bottom){
            text = data.clipping.cutVSize - _this.detail.kromki.bottom + fugue;
        }
        // lines.push(
        //     {
        //         x1: detail.x2 + 20,
        //         y2: edgeCut.y2 || detail.y1,// + 20,
        //         x2: detail.x2 + 20,
        //         y1: edgeCut.y5,//detail.y1,// + 20,
        //         // text: data.clipping.cutVSize - thickV,
        //         text: text,
        //         offset: detail.y1 - 40,
        //         type: 'v'
        //     }
        // );
        // console.log("lines0", );
        //слева
        if (data.clipping.cutHBase == "4") {
            lines.push(
                {
                    x1: detail.x1,
                    y2: detail.y2 + 20,
                    x2: edgeCut.x2G,
                    y1: detail.y2 + 20,
                    // text: data.clipping.cutHSize - thickH,
                    text: data.width - data.clipping.cutHSize + (thickH > 0 ? thickH - fx : 0),
                    offset: detail.x1 + (edgeCut.x2G - detail.x1) / 2
                }
            );
            console.log("lines1", data.width - data.clipping.cutHSize + (thickH > 0 ? thickH - fx : 0));
            lines.push(
                {
                    x1: edgeCut.x2G,
                    y2: detail.y2 + 20,
                    x2: detail.x2,
                    y1: detail.y2 + 20,
                    text: data.clipping.cutHSize - (thickH > 0 ? thickH - fx : 0),
                    offset: edgeCut.x4G + (detail.x2 - edgeCut.x4G) / 2 //detail.x1 + 80,
                }
            );
            console.log("lines2", data.clipping.cutHSize - (thickH > 0 ? thickH - fx : 0));
        }
        //справа
        if (data.clipping.cutHBase == "2") {
            lines.push(
                {
                    x1: detail.x1,
                    y2: detail.y2 + 20,
                    x2: edgeCut.x4G,
                    y1: detail.y2 + 20,
                    text: data.clipping.cutHSize - (thickH > 0 ? thickH - fx : 0),
                    offset: detail.x1 + (edgeCut.x4G - detail.x1) / 2 //detail.x1 + 80,
                }
            );
            console.log("lines3", data.clipping.cutHSize - (thickH > 0 ? thickH - fx : 0));
            lines.push(
                {
                    x1: edgeCut.x4G,//detail.x1,
                    y2: detail.y2 + 20,
                    x2: detail.x2,
                    y1: detail.y2 + 20,
                    text: data.width - data.clipping.cutHSize + (thickH > 0 ? thickH - fx : 0),
                    offset: edgeCut.x4G + (detail.x2 - edgeCut.x4G) / 2 //detail.x1 + 80,
                }
            );
            console.log("lines4", data.width - data.clipping.cutHSize + (thickH > 0 ? thickH - fx : 0));
            hasVerClipping = true;
        }

        // подрезание заводской кромки снизу
        var botTopCutfug = 0;
        if (Number(data['data_edges']['bottom']['cut'])) {
            botTopCutfug += fugue;
            lines.push(
                {
                    x1: detail.x2 + 20,
                    y2: detail.y2,
                    x2: detail.x2 + 20,
                    y1: edgeCut.y5,//detail.y1,
                    text: Number(data.data_edges.bottom.cut - fugue),
                    // text: Number(data.data_edges.bottom.cut),//data.fullHeight,
                    offset: edgeCut.y5 + (detail.y2 - edgeCut.y5) / 2,
                    type: 'v'
                }
            );
            console.log("lines5", Number(data.data_edges.bottom.cut));
            // lines.push(
            //     {
            //         x1: detail.x2 + 20,
            //         y2: detail.y5,
            //         x2: detail.x2 + 20,
            //         y1: edgeCut.y5,
            //         text: data.height - data.clipping.cutVSize + (thickV ? thickV - fy : 0),
            //         offset: detail.y2 - 90,
            //         type: 'v'
            //     }
            // );
            //console.log("lines6", data.height - data.clipping.cutVSize + (thickV ? thickV - fy : 0));
        }
        // подрезание заводской кромки сверху
        if (Number(data['data_edges']['top']['cut'])) {
            botTopCutfug += fugue;
            lines.push(
                {
                    x1: detail.x2 + 20,
                    y2: edgeCut.y2,
                    x2: detail.x2 + 20,
                    y1: detail.y1,
                    text: Number(data.data_edges.top.cut - fugue),
                    //text: Number(data.data_edges.top.cut),
                    offset: detail.y1,
                    type: 'v'
                }
            );
            console.log("lines7" , Number(data.data_edges.top.cut));

            var text = data.height + botTopCutfug + (thickV ? thickV - fy : 0);
            //var text = data.height - data.clipping.cutVSize + (thickV ? thickV - fy : 0);
            if (data.clipping.cutVSize >= 65 && _this.detail.kromki.top){
                text = data.clipping.cutVSize + botTopCutfug;
                //text = data.clipping.cutVSize + fugue;
                // text = data.clipping.cutVSize - _this.detail.kromki.top + fugue;
                console.log('text2');
            }

            lines.push(
                {
                    x1: detail.x2 + 20,
                    y2: edgeCut.y2,
                    x2: detail.x2 + 20,
                    y1: edgeCut.y5,
                    text: text,
                    offset: detail.y1 - 40,
                    type: 'v'
                }
            );
            console.log("lines8", data.height - data.clipping.cutVSize + (thickV ? thickV - fy : 0));
        }
        console.log(lines);
        return lines;
    }

    function calcLinesForTrim(detail, trim, data, side) {
        // console.log('calcLinesForTrim',data);
        var thickH = 0;
        var thickV = 0;
        var promiceH = getThicknessBandForTrimH();
        if (promiceH != -1) thickH = promiceH;
        var promiceV = getThicknessBandForTrimV();
        if (promiceV != -1) thickV = promiceV;
        var lines = [];
        if (side == "H") {
            var textH = data.clipping.cutHSize - thickH;

            //слева
            if (data.clipping.cutHBase == "4") {
                lines.push(
                    {
                        x1: detail.x2,
                        y2: detail.y2 + 20,
                        x2: trim.x2,
                        y1: detail.y2 + 20,
                        text: textH,
                        offset: trim.x2 + 80,
                    }
                );

            }
            //справа
            if (data.clipping.cutHBase == "2") {

                lines.push(
                    {
                        x1: detail.x1,
                        y2: detail.y2 + 20,
                        x2: detail.x2 - (trim.x1 - trim.x2) - 7,
                        y1: detail.y2 + 20,
                        text: textH,
                        offset: trim.x2 - 40,
                    }
                );
            }
        }
        if (side == "V") {
            var textV = data.clipping.cutVSize - thickV;

            //сверху
            var tmp = data.fullWidth;
            data.fullWidth = data.fullHeight;
            data.fullHeight = tmp;

            if (data.clipping.cutVBase == "5") {
                lines.push(
                    {
                        x1: detail.x2,
                        y2: detail.y2 + 20,
                        x2: trim.x2,
                        y1: detail.y2 + 20,
                        text: textV,
                        offset: trim.x2 + 40,
                    }
                );
            }
            //снизу
            if (data.clipping.cutVBase == "3") {
                lines.push(
                    {
                        x1: detail.x1,
                        y2: detail.y2 + 20,
                        x2: detail.x2 - (trim.x1 - trim.x2) - 7,
                        y1: detail.y2 + 20,
                        text: textV,
                        offset: trim.x2 - 40,
                    }
                );
            }
        }

        return lines;


    }

    function calcLinesForWood(detail, wood, detailNew, ctx, fugueForWood, forCorner , cornerKeyText) {
        var lines = [];
        if (wood['face']['type'] == 'faska') {


            lines.push(
                {
                    x1: 200,
                    x2: 200,
                    y1: detail.y1,
                    y2: detailNew.yFaceZ,
                    text: wood['face']['z'],
                }
            );

            useCtxConfig(ctx, 'line');
            ctx.beginPath();
            ctx.moveTo(detailNew.xFaceZ, detailNew.yFaceZ);
            ctx.lineTo(detailNew.xFaceZ, detail.y1);
            ctx.moveTo(detailNew.xFaceZ + 10, detailNew.yFaceZ - 20);
            ctx.lineTo(detailNew.xFaceZ + 10, detail.y1 - 10);
            ctx.lineTo(detailNew.xFaceZ + 80, detail.y1 - 10);
            ctx.stroke();
            ctx.font = "20px Arial";
            ctx.fillText(wood['face']['d'] + '°', detailNew.xFaceZ + 35, detail.y1 - 15);
        }

        if (wood['face']['type'] == 'radius') {
            lines.push(
                {
                    x1: detail.x1 - 100,
                    y1: detail.y1 - 10,
                    x2: detail.x1 - 10,
                    y2: detail.y1 - 10,
                    text: "R(" + wood['face']['r'] + ")",
                }
            );
        }

        if (wood['rear']['type'] == 'faska') {
            lines.push(
                {
                    x1: 200,
                    x2: 200,
                    y1: detailNew.yRearZ,
                    y2: detail.y2,
                    text: wood['rear']['z'],
                }
            );
            useCtxConfig(ctx, 'line');
            ctx.beginPath();
            ctx.moveTo(detailNew.xRearZ, detailNew.yRearZ);
            ctx.lineTo(detailNew.xRearZ, detail.y2);
            ctx.moveTo(detailNew.xRearZ + 10, detailNew.yRearZ + 20);
            ctx.lineTo(detailNew.xRearZ + 10, detail.y2 + 10);
            ctx.lineTo(detailNew.xRearZ + 80, detail.y2 + 10);
            ctx.stroke();
            ctx.font = "20px Arial";
            ctx.fillText(wood['rear']['d'] + '°', detailNew.xRearZ + 35, detail.y2 + 30);
        }

        if (wood['rear']['type'] == 'radius') {
            lines.push(
                {
                    x1: detail.x1 - 100,
                    y1: detail.y2 -5 ,
                    x2: detail.x1 - 10,
                    y2: detail.y2 - 5,
                    text: "R(" + wood['rear']['r'] + ")",
                }
            );
        }

        ctx.font = "20px Arial";
        ctx.color = "white";
        ctx.fillText('Лицо', detail.x1 + 120, detail.y1 + 35);
        ctx.fillText('Тыл', detail.x1 + 120, detail.y2 - 35);
        // lines.push(
        //     {
        //         x1: detail.x1 - 200,
        //         y1: (detailNew.yFaceZ + detailNew.yRearZ) / 2,
        //         x2: detail.x1 - 30,
        //         y2: (detailNew.yFaceZ + detailNew.yRearZ) / 2,
        //         text: fugueForWood.toString() + ' (Фуга)',
        //     }
        // );

        lines.push(
            {
                x1: detail.x1 - 200,
                y1: ((detailNew.yFaceZ + detailNew.yRearZ) / 2) + 10,
                x2: detail.x1 - 30,
                y2: ((detailNew.yFaceZ + detailNew.yRearZ) / 2) + 10,
                text: fugueForWood.toString() + ' (Фуга)',
            }
        );


        if (wood['face']['type'] == 'arc' || wood['rear']['type'] == 'arc') {
            lines.push(
                {
                    x1: detail.x1 - 200,
                    y1: ((detailNew.yFaceZ + detailNew.yRearZ) / 2) - 40,
                    x2: detail.x1 - 30,
                    y2: ((detailNew.yFaceZ + detailNew.yRearZ) / 2) - 40,
                    text: wood['face']['r'].toString() + 'R (Дуга)',
                }
            );
        }

        if(forCorner){
            ctx.font = "20px Arial";
            ctx.color = "white";
            ctx.fillText(cornerKeyText, 20, 20);
        }

        return lines;


    }

    function calcLinesForCorner(corner, data, detail, trX, trY) {
        var rep = {x: corner.x1, y: corner.y1}
        var lineOffset = {x: (offset.V / 2) * scale, y: (offset.V / 2) * scale}
        var r2 = {x: detail.x1, y: detail.y1}
        if (corner.key == 2 || corner.key == 3) {
            r2.y = detail.y2;
            lineOffset.y = -lineOffset.y;
        }
        if (corner.key < 3) {
            r2.x = detail.x2;
            lineOffset.x = -lineOffset.x;
        }

        var lines = [
            {
                x1: rep.x + lineOffset.x,
                y1: r2.y,
                x2: rep.x + lineOffset.x,
                y2: rep.y,
                type: 'v',
                offset: (corner.key == 2 || corner.key == 3) ? (corner.maxY + (trY + config.default.height - corner.maxY) / 2) : corner.key == 5 ? rep.y - 35 : rep.y + 35,
                text: corner.height
            },
            {
                x1: r2.x,
                y1: corner.y2 + lineOffset.y,
                x2: corner.x2,
                y2: corner.y2 + lineOffset.y,
                type: 'h',
                offset: (corner.key < 3) ? (corner.maxX + (trX + config.default.width - corner.maxX) / 2) : (trX + (corner.minX - trX) - 10),
                text: corner.width
            }
        ];

        return lines;
    }

    function calcLinesForRabbet(rabbet, data) {
        var rep = {x: rabbet.x1, y: rabbet.y2};
        var lineOffset = {x: -(offset.V / 2) * scale, y: (offset.V / 2) * scale};

        rep.x = rabbet.x2;
        if (!data.type) {
            rep.x -= lineOffset.x * 2;
        }
        if (data.type) {
            lineOffset.x = -lineOffset.x;
        }

        if (data.side == 6) {
            lineOffset.y = -lineOffset.y;
        }

        var lines = [
            {
                x1: rep.x + lineOffset.x,
                y1: rabbet.y1,
                x2: rep.x + lineOffset.x,
                y2: rabbet.y2,
                text: data.z
            },
            {
                x1: rabbet.x1,
                y1: rep.y + lineOffset.y,
                x2: rabbet.x2,
                y2: rep.y + lineOffset.y,
                text: data.d
            }
        ];

        return lines;
    }

    function calcLinesForShapeByPattern(sbp, detail, data, trX, trY) {
        var lines = [];

        if (data['edgeId'] != '2') {
            lines.push({
                x1: detail.x1,
                y1: sbp.y1 + sbp.sizeV / 2 + ((data['patternId'] == 'smile') ? 10 : 0),
                x2: sbp.x1,
                y2: sbp.y1 + sbp.sizeV / 2 + ((data['patternId'] == 'smile') ? 10 : 0),
                text: data['shiftX'] - ((data['patternId'] == 'circle') ? (data['radius']) : (0)),
                offset: (detail.x1 > trX) ? 0 : trX + (sbp.x1 - trX) / 2
            });
        }
        if (data['edgeId'] != '3') {
            lines.push({
                x1: sbp.x1 + sbp.sizeH / 2,
                y1: detail.y1,
                x2: sbp.x1 + sbp.sizeH / 2,
                y2: sbp.y1,
                text: _this.detail.fullHeight - data['shiftY'] - data['sizeV'] + parseFloat((data['patternId'] == 'circle') ? (data['radius']) : (0)),
                offset: (detail.y1 > trY) ? 0 : trY + (sbp.y1 - trY) / 2
            });
        }
        if (data['edgeId'] != '4') {
            lines.push({
                x1: sbp.x2,
                y1: sbp.y1 + sbp.sizeV / 2 + ((data['patternId'] == 'smile') ? 10 : 0),
                x2: detail.x2,
                y2: sbp.y1 + sbp.sizeV / 2 + ((data['patternId'] == 'smile') ? 10 : 0),
                text: _this.detail.fullWidth - data['shiftX'] - data['sizeH'] + parseFloat((data['patternId'] == 'circle') ? (data['radius']) : (0)),
                offset: (detail.x2 < trX + config.default.width) ? 0 : sbp.x2 + (trX + config.default.width - sbp.x2) / 2
            });
        }
        if (data['edgeId'] != '5') {
            lines.push({
                x1: sbp.x1 + sbp.sizeH / 2,
                y1: sbp.y2,
                x2: sbp.x1 + sbp.sizeH / 2,
                y2: detail.y2,
                text: data['shiftY'] - ((data['patternId'] == 'circle') ? (data['radius']) : (0)),
                offset: (detail.y2 < trY + config.default.height) ? 0 : sbp.y2 + (trY + config.default.height - sbp.y2) / 2
            });
        }
        var del = 0;
        if (data['patternId'] == 'circle') {
            del = 2;
        } else if (data['patternId'] == 'rectangular') {
            del = 4;
        } else {
            del = 4 / 3;
        }
        if (data['patternId'] == 'smile') {
            // if (data['edgeId'] == '2' || data['edgeId'] == '4') {
            //     lines.push({
            //         x1: sbp.x1,
            //         y1: sbp.y1 + sbp.sizeV / 2,
            //         x2: sbp.x2,
            //         y2: sbp.y1 + sbp.sizeV / 2,
            //         text: data['sizeH']
            //     });
            //     var x = (data['edgeId'] == '2') ? sbp.x1 : sbp.x2;
            //     lines.push({
            //         x1: x,
            //         y1: sbp.y1,
            //         x2: x,
            //         y2: sbp.y2,
            //         text: data['sizeV']
            //     });
            // } else {
            //     var y = (data['edgeId'] == '3') ? sbp.y1 : sbp.y2;
            //     lines.push({
            //         x1: sbp.x1,
            //         y1: y,
            //         x2: sbp.x2,
            //         y2: y,
            //         text: data['sizeH']
            //     });
            //     lines.push({
            //         x1: sbp.x1 + sbp.sizeH / 2,
            //         y1: sbp.y1,
            //         x2: sbp.x1 + sbp.sizeH / 2,
            //         y2: sbp.y2,
            //         text: data['sizeV']
            //     });
            // }
        } else {
            lines.push({
                x1: sbp.x1,
                y1: sbp.y1 + sbp.sizeV / del,
                x2: sbp.x2,
                y2: sbp.y1 + sbp.sizeV / del,
                text: data['sizeH']
            });
            if (data['patternId'] != 'circle') {
                lines.push({
                    x1: sbp.x1 + sbp.sizeH / 4,
                    y1: sbp.y1,
                    x2: sbp.x1 + sbp.sizeH / 4,
                    y2: sbp.y2,
                    text: data['sizeV']
                });
            }
            if (data['patternId'] == 'uShaped' && data['radius']) {
                edgeId = data['edgeId'];
                if (edgeId == 2 || edgeId == 4) {
                    lines.push({
                        x1: ((edgeId == 2) ? (sbp.x2 - sbp.r) : (sbp.x1 + sbp.r)),
                        y1: sbp.y1,
                        x2: ((edgeId == 2) ? (sbp.x2 - sbp.r) : (sbp.x1 + sbp.r)),
                        y2: sbp.y1 + sbp.r,
                        text: 'R' + Number(data['radius']).toFixed(1)
                    });
                } else {
                    // lines.push({
                    //     x1: sbp.x2 - sbp.r,
                    //     y1: ((edgeId == 3) ? (sbp.y2 - sbp.r) : (sbp.y1 + sbp.r)),
                    //     x2: sbp.x2,
                    //     y2: ((edgeId == 3) ? (sbp.y2 - sbp.r) : (sbp.y1 + sbp.r)),
                    //     text: 'R' + Number(data['radius']).toFixed(1)
                    // });
                }
            }
        }
        return lines;
    }

    function calcArcsForSrez(srez) {
        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (!srez.d) {
            angle_start = 1.5 * Math.PI;
            if (srez.side == 'l') {
                angle_end = angle_start + srez.angle * Math.PI / 180;
            } else {
                angle_end = angle_start;
                angle_start = angle_end - (srez.angle * Math.PI / 180)
            }
        } else {
            angle_start = Math.PI / 2;
            if (srez.side == 'r') {
                angle_end = angle_start + srez.angle * Math.PI / 180;
            } else {
                angle_end = angle_start;
                angle_start = angle_end - (srez.angle * Math.PI / 180)
            }
        }

        var textPos = {x: 0, y: 0};
        if (srez.side == 'l') {
            textPos.x = srez.x1 + ((srez.x2 - srez.x1) / 2) - (srez.angle + "").length * fontSize / 4;
        } else {
            textPos.x = srez.x1 - ((srez.x1 - srez.x2) / 2) - (srez.angle + "").length * fontSize / 4;
        }
        if (!srez.d) {
            textPos.y = srez.y2;
        } else {
            textPos.y = srez.y2 + fontSize * 0.8;
        }
        var all = [{
            line: {
                x1: srez.x1,
                y1: srez.y1,
                x2: srez.x1,
                y2: srez.y2,
            },
            arc: {
                x: srez.x1,
                y: srez.y1,
                r: 60,
                start: angle_start,
                end: angle_end
            },
            text: {
                x: textPos.x,
                y: textPos.y,
                text: (!srez.d) ? srez.angle : -srez.angle
            }
        }];
        return all;
    }

    function drawLines(ctx, params, parent) {
        params.forEach(function (item) {

            drawLine(ctx, item.x1, item.y1, item.x2, item.y2, item.text, item.offset, item.type, parent);
        });
    }


    function drawLinesForSrez(ctx, params, parent) {
        params.forEach(function (item) {
            drawLineForSrez(ctx, item.x1, item.y1, item.x2, item.y2, item.text, item.offset, item.type, parent);
        });
    }

    function drawArcs(ctx, params, parent) {
        params.forEach(function (item) {
            drawArc(ctx, item, parent);
        });
    }

    function drawFillForLineForSrez(ctx, x, y, len, type) {
        ctx.stroke();
        ctx.closePath();
        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (ctx.textAlign == 'right') {
            x1 = x - (fontSize / 2) * len;
            x2 = x;
        } else if (ctx.textAlign == 'left') {
            x1 = x;
            x2 = x + (fontSize / 2) * len;
        } else {
            x1 = x - ((fontSize / 2) * len) / 2;
            x2 = x + ((fontSize / 2) * len) / 2;
        }
        ctx.fillStyle = "gray";
        ctx.lineWidth = 0;
        ctx.globalAlpha = 0.7;
        if (type == 'h') {
            ctx.beginPath();
            ctx.moveTo(x1 - 2, y - fontSize + 4);
            ctx.lineTo(x1 - 2, y + 4);
            ctx.lineTo(x2 + 2, y + 4);
            ctx.lineTo(x2 + 2, y - fontSize + 4);
            ctx.lineTo(x1 - 2, y - fontSize + 4);
            ctx.closePath();
        }
        else {
            ctx.fillRect(x - 32, y - 35, 25, (fontSize * 3) - 4);
        }
        ctx.fill();
        // ctx.stroke();
        ctx.fillStyle = "black";
        ctx.lineWidth = config.line.lineWidth;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
    }

    function drawFillForLine(ctx, x, y, len) {
        ctx.stroke();
        ctx.closePath();
        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (ctx.textAlign == 'right') {
            x1 = x - (fontSize / 2) * len;
            x2 = x;
        } else if (ctx.textAlign == 'left') {
            x1 = x;
            x2 = x + (fontSize / 2) * len;
        } else {
            x1 = x - ((fontSize / 2) * len) / 2;
            x2 = x + ((fontSize / 2) * len) / 2;
        }
        ctx.fillStyle = "gray";
        ctx.lineWidth = 0;
        ctx.globalAlpha = 0.7;

        ctx.beginPath();
        ctx.moveTo(x1 - 2, y - fontSize + 4);
        ctx.lineTo(x1 - 2, y + 4);
        ctx.lineTo(x2 + 2, y + 4);
        ctx.lineTo(x2 + 2, y - fontSize + 4);
        ctx.lineTo(x1 - 2, y - fontSize + 4);
        ctx.closePath();

        ctx.fill();
        // ctx.stroke();
        ctx.fillStyle = "black";
        ctx.lineWidth = config.line.lineWidth;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
    }


    function drawLineForSrez(ctx, x1, y1, x2, y2, text, offset, type, parent) {
        useCtxConfig(ctx, 'line');
        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (text[0] != 'R' && text[0] != 'D') {
            text = Number(text).toFixed(1); //округляем до 10ых
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        var dots = calcArrows(x1, y1, x2, y2);
        var diff = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
        // console.log('DIFF = ', diff);
        if ((Number(text) > 4 && diff > 30)) {
            dots.forEach(function (dot) {
                ctx.moveTo(x2, y2);
                ctx.lineTo(dot['x'], dot['y']);
            });
            dots = calcArrows(x2, y2, x1, y1);
            dots.forEach(function (dot) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(dot['x'], dot['y']);
            });
        }
        ctx.fillStyle = '#ff3300';
        if (x1 == x2 && (!type || type == 'v')) {
            ctx.textAlign = "right";
            ctx.moveTo(x1 - _this.forVectors / 2, y1);
            ctx.lineTo(x1 + _this.forVectors / 2, y1);
            ctx.moveTo(x1 - _this.forVectors / 2, y2);
            ctx.lineTo(x1 + _this.forVectors / 2, y2);

            var textPos = {x: 0, y: (y2 - y1) / 2 + y1 + fontSize / 2 - 2};
            if (parent.x1 > x1) {
                textPos.x = x1 - (ctx.lineWidth * 2);
            } else {
                textPos.x = x1 + (ctx.lineWidth * 2);
            }
            if (offset && offset < y2) {
                textPos.y = offset + fontSize / 2;
            } else if (offset) {
                textPos.y = offset - fontSize / 2;
            }

            drawFillForLineForSrez(ctx, textPos.x, textPos.y, text.toString().length, type);
            var textSizeWidth = ctx.measureText(text).width;
            ctx.save();
            ctx.translate(textPos.x - 15, textPos.y - 65);
            ctx.rotate((Math.PI / 180) * -90);
            ctx.fillText(text, -textSizeWidth / 2, 4);
            ctx.restore();

        }
        if (y1 == y2 && (!type || type == 'h')) {
            ctx.textAlign = "right";
            ctx.moveTo(x1, y1 - _this.forVectors / 2);
            ctx.lineTo(x1, y1 + _this.forVectors / 2);
            ctx.moveTo(x2, y1 - _this.forVectors / 2);
            ctx.lineTo(x2, y1 + _this.forVectors / 2);

            var textPos = {x: 0, y: 0};
            if (y1 < parent.y2) {
                textPos.x = ((!offset) ? (x2 - x1) / 2 + x1 : offset) + (text).toString().length * fontSize / 3;
                textPos.y = y1 - ctx.lineWidth * 2;//  - fontSize/2;
            } else {
                textPos.x = ((!offset) ? (x2 - x1) / 2 + x1 : offset) + (text + "").length * fontSize / 4;
                textPos.y = y1 + ctx.lineWidth * 2 + _this.forVectors / 2 + fontSize / 4;
            }
            drawFillForLine(ctx, textPos.x - 10, textPos.y, text.toString().length, type);
            ctx.fillText(text, textPos.x - 10, textPos.y);


        }
        ctx.stroke();
    }

    function drawLine(ctx, x1, y1, x2, y2, text, offset, type, parent) {
        useCtxConfig(ctx, 'line');

        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (text == NaN || text == undefined) text = '';

        if (text[0] != 'R' && text[0] != 'D') {
            text = Number(text) ? Number(text).toFixed(1) : text; //округляем до 10ых
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        var dots = calcArrows(x1, y1, x2, y2);
        diff = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
        // console.log('DIFF = ', diff);
        if ((Number(text) > 4 && diff > 30)) {
            dots.forEach(function (dot) {
                ctx.moveTo(x2, y2);
                ctx.lineTo(dot['x'], dot['y']);
            });
            dots = calcArrows(x2, y2, x1, y1);
            dots.forEach(function (dot) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(dot['x'], dot['y']);
            });
        }
        ctx.fillStyle = '#ff3300';

        var TxtLength = (text).toString().length;

        if (x1 == x2 && (!type || type == 'v')) {
            ctx.textAlign = "right";
            ctx.moveTo(x1 - _this.forVectors / 2, y1);
            ctx.lineTo(x1 + _this.forVectors / 2, y1);
            ctx.moveTo(x1 - _this.forVectors / 2, y2);
            ctx.lineTo(x1 + _this.forVectors / 2, y2);

            var textPos = {x: 0, y: (y2 - y1) / 2 + y1 + fontSize / 2 - 2};
            if (parent.x1 > x1) {
                ctx.textAlign = "right";
                textPos.x = x1 - ctx.lineWidth * 5;
            } else {
                ctx.textAlign = "left";
                textPos.x = x1 + ctx.lineWidth * 5 + fontSize * 3 / 4;
            }
            // if (offset && offset < y2) {
            //     textPos.y = offset + fontSize / 2;
            // } else if (offset) {
            //     textPos.y = offset - fontSize / 2;
            // }

            drawFillForLine(ctx, textPos.x - 10, textPos.y, TxtLength, type);
            ctx.fillText(text, textPos.x - 10, textPos.y);

        }
        if (y1 == y2 && (!type || type == 'h')) {
            ctx.textAlign = "right";
            ctx.moveTo(x1, y1 - _this.forVectors / 2);
            ctx.lineTo(x1, y1 + _this.forVectors / 2);
            ctx.moveTo(x2, y1 - _this.forVectors / 2);
            ctx.lineTo(x2, y1 + _this.forVectors / 2);

            var textPos = {x: 0, y: 0};
            if (y1 < parent.y2) {
                textPos.x = ((!offset) ? (x2 - x1) / 2 + x1 : offset) + TxtLength * fontSize / 3;
                textPos.y = y1 - ctx.lineWidth * 2;//  - fontSize/2;
            } else {
                textPos.x = ((!offset) ? (x2 - x1) / 2 + x1 : offset) + (text + "").length * fontSize / 4;
                textPos.y = y1 + ctx.lineWidth * 2 + _this.forVectors / 2 + fontSize / 4;
            }
            drawFillForLine(ctx, textPos.x - 10, textPos.y, TxtLength, type);
            ctx.fillText(text, textPos.x - 10, textPos.y);


        }
        ctx.stroke();
    }

    function drawArc(ctx, add, parent) {
        useCtxConfig(ctx, "line");
        ctx.beginPath();
        ctx.moveTo(add.line.x1, add.line.y1);
        ctx.lineTo(add.line.x2, add.line.y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(add.arc.x, add.arc.y, add.arc.r, add.arc.start, add.arc.end);
        ctx.stroke();
        ctx.fillText(add.text.text, add.text.x, add.text.y);
    }

    function drawPointers(ctx, translateX, side, type, detail, groove) {

        useCtxConfig(ctx, "point");
        var leftPoint = 'Н';
        var rightPoint = 'В';

        if (groove) {
            leftPoint = 'В';
            rightPoint = 'Н';
        }
        var fontSize = Number(config.line.font.split(" ")[0].replace('px', ''));

        if (type != 0) {
            leftPoint = 'Л';
            rightPoint = 'П';
        }

        switch (side) {
            case 1:
            case 6:
                ctx.fillText(leftPoint, translateX + _this.forVectors, (detail.y2 - detail.y1) / 2 + detail.y1 + fontSize / 2);
                ctx.fillText(rightPoint, translateX + config.default.width - _this.forVectors / 2, (detail.y2 - detail.y1) / 2 + detail.y1 + fontSize / 2);
                break;
        }
    }

    function rabbetToGroove(rabbet) {
        var result = {};
        result.side = Number(rabbet.side[0]);
        // switch (getRabbetSide(rabbet.side)){
        //     case 2:
        //     case 4:
        //         result.type = 1;
        //         break;
        //     case 3:
        //     case 5:
        //         result.type = 0;
        //         break;
        // }
        result.type = rabbet.type;
        result.x = 0;
        result.y = 0;
        result.z = rabbet.z;
        result.d = rabbet.d;
        result.l = rabbet.l;
        result.key = rabbet.key;
        result.t2 = "rabbet";
        return result;
    }

    function useCtxConfig(ctx, type) {
        for (var k in config[type]) {
            ctx[k] = config[type][k];
        }
    }
}