// "Ленивая" загрузка миниатюр для списка деталей.
var lazy = [];
var lazyNodes;

function initLazyLoad() {
    setLazy();
    lazyLoad();
    registerListener('scroll', lazyLoad);
    registerListener('resize', lazyLoad);
}

function setLazy() {
    var table = document.getElementById('detailsTable');
    if (table != null) {
        lazyNodes = table.getElementsByClassName('table-cell svg svg-lazy');
        for (var i = 0; i < lazyNodes.length; i++) {
            while (lazyNodes[i].firstChild) {
                lazyNodes[i].removeChild(lazyNodes[i].firstChild);
            }
        }
        updateLazy();
    }
    // console.log('Found ' + lazy.length + ' lazy svg');
}

function lazyLoad() {
    var lazyLoad = [];
    for(var i = 0; i < lazy.length; i++){
        if(isInViewport(lazy[i])){
            // var number = lazy[i].parentNode.id;
            // console.log(number);
            loadSVG(lazy[i]);
            lazyLoad.push(i);
        }
    }

    for(var i = 0; i < lazyLoad.length; i++){
        // var number = lazy[lazyLoad[i]].parentNode.id;
        // console.log(number);
        lazy[lazyLoad[i]].classList.remove("svg-lazy");
    }

    updateLazy();
}

function loadSVG(cellSVG) {
    var dKey = cellSVG.parentNode.id.replace('row-', '');
    var w = 100;
    var h = 100;
    $.ajax({
        type: "POST",
        url: "/service/system/controllers/JsonController.php",
        data: "controller=Additives&action=getSvgAsText&detail_key=" + dKey + "&h=" + h + "&w=" + w,
        dataType: "json",
        cache: false,
        async: true,
        success: function (outData) {
            var textSVG = outData.textSVG;
            var massege = outData.massege;
            cellSVG.innerHTML = textSVG + massege;
        },
    });
}

function updateLazy() {
    lazy = [];
    if(!!lazyNodes) {
        for (var i = 0; i < lazyNodes.length; i++) {
            lazy.push(lazyNodes[i]);
        }
    }
}

function isInViewport(el){
    var rect = el.getBoundingClientRect();
    
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function registerListener(event, func) {
    if (window.addEventListener) {
        window.addEventListener(event, func)
    } else {
        window.attachEvent('on' + event, func)
    }
    var table = document.getElementById('details-tabel');
    if (table.addEventListener) {
        table.addEventListener(event, func)
    } else {
        table.attachEvent('on' + event, func)
    }
}