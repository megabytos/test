var miniatures_container = document.getElementById('miniatures');
var head = document.createElement('h3');
head.style.clear = 'both';
head.style['padding-left'] = '10px';

var heads = [
    'Лицевая сторона',
    'Левая сторона',
    'Верхняя сторона',
    'Правая сторона',
    'Нижняя сторона',
    'Тыльная сторона',
];

var cornerSrezHeads = [
    'Левый нижний угол',
    'Левый верхний угол',
    'Правый верхний угол',
    'Правый нижний угол',
];

var plastHeads = [
    'лицевая пласть',
    'тыльная пласть',
];

var headsText = {
    1: 'left',
    2: 'top',
    3: 'right',
    4: 'bottom',
}

function initMiniature(detail) {
    miniatures_container.innerHTML = '';

    var miniature = new Miniatures(detail);

    var needMiniatures = false;
    for (var key in detail.shapesByPattern) {
        if (detail.shapesByPattern[key]['patternId'] == 'handles' && detail.shapesByPattern[key]['handleType'] == 'edges' &&
            detail.shapesByPattern[key]['trimmed']) {
            needMiniatures = true;
        }
    }

    hideTables(needMiniatures);
    // miniature.setFilter('groove', {
    //     default: '',
    //     params: [
    //             {side: [2, 3, 4, 5]},
    //             {d: [3.2]},
    //         ]
    // });
    // miniature.setFilter('corner', {
    //     default: 'filterCorners',
    //     params: [
    //         {type: [2]}
    //     ]
    // });
    // miniature.setFilter('srez', {
    //     default: '',
    //     params: [
    //         {type: [2]}
    //     ]
    // });

    addMiniaturesToHtml(miniature.getGrooveMiniatures(), 'Пазы');
    addMiniaturesToHtml(miniature.getRabbetMiniatures(), 'Четверти');
    addMiniaturesToHtml(miniature.getSrezMiniatures(), 'Срезы');
    addMiniaturesToHtml(miniature.getSrezMiniatures(null, null, true), 'Срезы углов');
    addMiniaturesToHtml(miniature.getCornerMiniatures(), 'Обработки углов');
    if((['wood', 'compact'].includes(window.materialType) && (['fanera'].includes(materialType) && isMillAdditives)))addMiniaturesToHtml(miniature.getCornerMiniaturesDop(), 'Обработки углов (Доп.)');
    var resShape = miniature.getShapeByPatternMiniatures();
    addMiniaturesToHtml(resShape[0], 'Вырезы по шаблону', resShape[1]);
    if (resShape[1]) {
        var resShapeAdd = miniature.getSrezMiniatures(null, resShape[1]);
        addMiniaturesToHtml(resShapeAdd, 'Вырезы по шаблону: срез', resShape[1]);
    }

    if(window.constructorID == 'dsp') addMiniaturesToHtml(miniature.getTrimMiniatures(detail), 'Подрезание в размер');
    // if(window.inDev){
    if(window.constructorID == 'stol') addMiniaturesToHtml(miniature.getEdgesCut(detail), 'Подрезание заводской кромки');
    if((['wood', 'compact'].includes(window.materialType) || (['fanera'].includes(materialType) && isMillAdditives))) addMiniaturesToHtml(miniature.getEdgesWood(detail), 'Обработка Торцов');
    // }
}

function initMiniatureForPrint(detail) {
    window.miniatures_containerForPrint = document.getElementById('miniatures');
    window.miniatures_containerForPrint.innerHTML = '';

    var miniature = new Miniatures(detail);
    addMiniaturesToHtmlForPrint(miniature.getGrooveMiniatures(), 'Пазы');
    addMiniaturesToHtmlForPrint(miniature.getRabbetMiniatures(), 'Четверти');
    addMiniaturesToHtmlForPrint(miniature.getSrezMiniatures(), 'Срезы');
    addMiniaturesToHtmlForPrint(miniature.getSrezMiniatures(null, null, true), 'Срезы углов');
    addMiniaturesToHtmlForPrint(miniature.getCornerMiniatures(), 'Обработки углов');
    if((['wood', 'compact'].includes(window.materialType) || (['fanera'].includes(materialType) && isMillAdditives))) addMiniaturesToHtmlForPrint(miniature.getCornerMiniaturesDop(), 'Обработки углов (Доп.)');
    var resShape = miniature.getShapeByPatternMiniatures();
    addMiniaturesToHtmlForPrint(resShape[0], 'Вырезы по шаблону', resShape[1]);
    if (resShape[1]) {
        var resShapeAdd = miniature.getSrezMiniatures(resShape[1]);
        addMiniaturesToHtmlForPrint(resShapeAdd, 'Вырезы по шаблону: срез', resShape[1]);
    }

    if(window.constructorID == 'dsp')  addMiniaturesToHtmlForPrint(miniature.getTrimMiniatures(detail), 'Подрезание в размер');
    if(window.constructorID == 'stol') addMiniaturesToHtmlForPrint(miniature.getEdgesCut(detail), 'Подрезание заводской кромки');
    if((['wood', 'compact'].includes(window.materialType) || (['fanera'].includes(materialType) && isMillAdditives))) addMiniaturesToHtmlForPrint(miniature.getEdgesWood(detail), 'Обработка Торцов');
}

function addMiniaturesToHtml(miniatures, caption, sourceData = null) {

    var addHead = true;
    miniatures.forEach(function (sideMiniatures, side) {
        if (sideMiniatures.length) {
            if (addHead) {
                var captionHTML = angular.copy(head);
                captionHTML.style.textAlign = 'center';
                captionHTML.innerText = caption;
                miniatures_container.appendChild(captionHTML);
            }
            var sideName = angular.copy(head);
            if (sourceData && ![0, 5].includes(side)) {
                var sideText = headsText[side];
                if (sideText in sourceData && 'rearBase' in sourceData[sideText]) {
                    var rearBase = Number(sourceData[sideText]['rearBase']);
                    if ([0, 1].includes(rearBase)) {
                        if (rearBase) {
                            sideName.innerText = heads[side] + ', ' + plastHeads[1];
                        } else {
                            sideName.innerText = heads[side] + ', ' + plastHeads[0];
                        }
                    } else {
                        sideName.innerText = heads[side];
                    }
                } else {
                    sideName.innerText = heads[side];
                }
            } else if (caption == 'Срезы углов'){
                sideName.innerText = cornerSrezHeads[side];
            } else {
                sideName.innerText = heads[side];
            }
            miniatures_container.appendChild(sideName);
            addHead = false;
            sideMiniatures.forEach(function (miniature) {
                miniatures_container.appendChild(miniature);
            });
        }
    });
}

function addMiniaturesToHtmlForPrint(miniatures, caption, sourceData = null) {
    var addHead = true;
    var miniatures_container = window.miniatures_containerForPrint;
    miniatures.forEach(function (sideMiniatures, side) {
        if (sideMiniatures.length) {

            sideMiniatures.forEach(function (miniature) {
                miniatures_container.appendChild(miniature);
                if (addHead) {
                    var captionHTML = angular.copy(head);
                    captionHTML.style.textAlign = 'center';
                    captionHTML.innerText = caption;
                    miniature.prepend(captionHTML);
                }
                var sideName = angular.copy(head);
                sideName.innerText = heads[side];
                if (sourceData && ![0, 5].includes(side)) {
                    var sideText = headsText[side];
                    if (sideText in sourceData && 'rearBase' in sourceData[sideText]) {
                        var rearBase = Number(sourceData[sideText]['rearBase']);
                        if ([0, 1].includes(rearBase)) {
                            if (rearBase) {
                                sideName.innerText = heads[side] + ', ' + plastHeads[1];
                            } else {
                                sideName.innerText = heads[side] + ', ' + plastHeads[0];
                            }
                        } else {
                            sideName.innerText = heads[side];
                        }
                    } else {
                        sideName.innerText = heads[side];
                    }
                } else if (caption == 'Срезы углов'){
                    sideName.innerText = cornerSrezHeads[side];
                } else {
                    sideName.innerText = heads[side];
                }
                miniature.prepend(sideName);
                addHead = false;
            });
        }
    });
}

function hideTables(needMiniatures) {
    switch (machine) {
        case 'altendorf':
            if (!needMiniatures) {
                $('#additives-tbl-container-shapes-by-pattern').hide();
                $('#additives-tbl-container-shapes-by-patternForHandles').hide();
            }
            break;
        case 'ventura':
        case 'rover':
            $('#additives-tbl-container-clipping').hide();
            break;
    }
}