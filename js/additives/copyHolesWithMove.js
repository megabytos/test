var holesKeys = [];
function start() {
    var els = document.querySelectorAll('input[id^=Hole-]:checked');
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        holesKeys.push(el.value);
    }
    if (holesKeys.length == 0) {
        showErrorMessage('Нет выбранных отверстий');
        drilling.setval('actions', '');
        return;
    }
    // $('#badmain .input-group').css('width', '100%');
}


function checkCopyMoveDirection(){
    return validateField($("input[name='directionCopyMove']"), LANG['SPECIFY-MOVING-DIRECTION'], '');
}
function checkcopyMoveOffset(){
    return validateField($("#holeCopyMove"), LANG['SPECIFY-MOVING-VALUE'], LANG['VALUE-MUST-BE-NUMBER']);
}
function checkcopyMoveNum(){
    return validateField($("#copyMoveNum"), LANG['SPECIFY-COPIES-NUMBER'], LANG['ZNACH-MUST-BE-TSELIM']);
}
$(document).ready(function () {
    $("input[name='directionCopyMove']").on( "change", checkCopyMoveDirection );
    $("#holeCopyMove").on( "change", checkcopyMoveOffset ).on( "keyup", checkcopyMoveOffset );
    $("#copyMoveNum").on( "change", checkcopyMoveNum ).on( "keyup", checkcopyMoveNum );
});

$("#addButtonCopyMove").click(function (e) {
    let checkDirection = checkCopyMoveDirection();
    let checkOffset = checkcopyMoveOffset();
    let checkNum = checkcopyMoveNum();
    if (checkDirection && checkOffset && checkNum) {
        var step = $("#holeCopyMove").val();
        step = step.replace(',', '.');
        data = {
            holesKeys: holesKeys,
            directions: {
                left: $('#leftCopyMove').prop('checked'),
                right: $('#rightCopyMove').prop('checked'),
                top: $('#topCopyMove').prop('checked'),
                bottom: $('#bottomCopyMove').prop('checked'),
            },
            step: step,
            copyMoveNum: $("#copyMoveNum").val()
        }
        copyHolesWithMove(data);
    }
});