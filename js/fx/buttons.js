/**
 * Created by ������ ������ on 03.11.2015.
 */
(function($){
    $(document).ready(function(){

        var buts = $('div.add-button-popup button[type="submit"]');

        for(var i = 0; i < buts.length; i++){
            var btn = $(buts[i]);
            var action = btn.attr('onclick');
            btn.attr('onclick', '');
            btn.attr('action', action);
        }

        var ok = {
            showOk : function(){
                if($('.ok-popup').length == 0) {
                    showOkButton(this.event);
                }
            }
        };

        // buts.click(function(event){
        //     event.preventDefault();
        //     var but = $(this);
        //     var rawCode = but.attr('action');
        //     if(rawCode != undefined){
        //         var endIdx = rawCode.indexOf(';');
        //         var code = rawCode.substring(0, endIdx == -1 ? rawCode.length : endIdx);
        //         var func = new Function('arg', 'return ' + code.replace(')', 'arg)'));
        //         ok.event = event;
        //         //func(function(){
        //         //    showOkButton(event);
        //         //});
        //         func.call(window, function(){
        //             showOkButton(event);
        //         });
        //         //var res = func.call(ok);
        //         //if(res || res === undefined){
        //         //
        //         //    console.log('yep!');
        //         //    if($('.ok-popup').length == 0){
        //         //        showOkButton(event);
        //         //    }
        //         //}
        //     } else {
        //         if($('.ok-popup').length == 0){
        //             showOkButton(event);
        //         }
        //     }
        // });

        function showOkButton(event){
            var ok = $('<div class="ok-popup">' +
                '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
                    '<g>' +
                    '<line id="svg_1" y2="30" x2="10" y1="30" x1="10" stroke-width="5" stroke="#00C700" fill="none"></line>' +
                    '<line id="svg_2" y2="70" x2="38" y1="70" x1="38" stroke-width="5" stroke="#00C700" fill="none"></line>' +
                    '</g>' +
                    '<animate ' +
                    'xlink:href="#svg_1"' +
                    'attributeName="y1" ' +
                    'from="30"' +
                    'to="70"' +
                    'dur="0.2s"' +
                    'begin="0.1s"' +
                    'fill="freeze" />' +

                    '<animate ' +
                    'xlink:href="#svg_1"' +
                    'attributeName="x1" ' +
                    'from="10"' +
                    'to="40"' +
                    'dur="0.2s"' +
                    'begin="0.1s"' +
                    'fill="freeze" />' +

                    '<animate ' +
                    'xlink:href="#svg_2"' +
                    'attributeName="x1" ' +
                    'from="38"' +
                    'to="70"' +
                    'dur="0.2s"' +
                    'begin="0.3s"' +
                    'fill="freeze" />' +

                    '<animate ' +
                    'xlink:href="#svg_2"' +
                    'attributeName="y1" ' +
                    'from="70"' +
                    'to="10"' +
                    'dur="0.2s"' +
                    'begin="0.3s"' +
                    'fill="freeze" />' +
                    '</svg>' +
                '</div>');

            //console.log($(event.target).offset().top - 100);

            //var x = event.pageX != 0 ? event.pageX + 'px' : '50%';
            //var y = event.pageY != 0 ? event.pageY + 'px' : '50%';
            var x = $(event.target).offset().left + $(event.target).width() / 2 - 40;
            var y = $(event.target).offset().top - 100;
            ok.css({'top' : y + 'px', 'left' : x + 'px'});
            $('body').append(ok);
            setTimeout(function(){
                //ok.fadeOut(function(){
                //    ok.remove();
                //})
                ok.animate({'top' : 0, 'opacity' : 0}, 500, function(){
                    ok.remove();
                });

            }, 700);
        }

        function animate(elem, x, y, frames){
            var startX = elem.attr('x2');
            var startY = elem.attr('y2');
            var stepX = Math.abs(startX - x) / frames;
            var stepY = Math.abs(startY - y) / frames;
            var count = 0;
            var id = setInterval(function(){
                if(count == frames){
                    clearInterval(id);
                } else {
                    count++;
                    elem.attr('x1', parseFloat(elem.attr('x1')) + stepX);
                    elem.attr('y1', parseFloat(elem.attr('y1')) + stepY);
                }
            }, 20);


        }

        /*
        * <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
         <g>
         <line id="svg_1" y2="256" x2="166" y1="216" x1="135" stroke-width="5" stroke="#000000" fill="none"/>
         <line id="svg_2" y2="256" x2="165" y1="182" x1="199" stroke-width="5" stroke="#000000" fill="none"/>
         </g>
         </svg>
         */


    });
})(jQuery);

function showOkButton2(to){
    var ok = $('<div class="ok-popup">' +
        '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<g>' +
        '<line id="svg_1" y2="30" x2="10" y1="30" x1="10" stroke-width="5" stroke="#00C700" fill="none"></line>' +
        '<line id="svg_2" y2="70" x2="38" y1="70" x1="38" stroke-width="5" stroke="#00C700" fill="none"></line>' +
        '</g>' +
        '<animate ' +
        'xlink:href="#svg_1"' +
        'attributeName="y1" ' +
        'from="30"' +
        'to="70"' +
        'dur="0.2s"' +
        'begin="0.1s"' +
        'fill="freeze" />' +

        '<animate ' +
        'xlink:href="#svg_1"' +
        'attributeName="x1" ' +
        'from="10"' +
        'to="40"' +
        'dur="0.2s"' +
        'begin="0.1s"' +
        'fill="freeze" />' +

        '<animate ' +
        'xlink:href="#svg_2"' +
        'attributeName="x1" ' +
        'from="38"' +
        'to="70"' +
        'dur="0.2s"' +
        'begin="0.3s"' +
        'fill="freeze" />' +

        '<animate ' +
        'xlink:href="#svg_2"' +
        'attributeName="y1" ' +
        'from="70"' +
        'to="10"' +
        'dur="0.2s"' +
        'begin="0.3s"' +
        'fill="freeze" />' +
        '</svg>' +
        '</div>');

    //console.log($(event.target).offset().top - 100);

    //var x = event.pageX != 0 ? event.pageX + 'px' : '50%';
    //var y = event.pageY != 0 ? event.pageY + 'px' : '50%';
    var x = $('#' + to).offset().left + $('#' + to).width() / 2 - 40;
    var y = $('#' + to).offset().top - 100;
    ok.css({'top' : y + 'px', 'left' : x + 'px'});
    $('body').append(ok);
    setTimeout(function(){
        //ok.fadeOut(function(){
        //    ok.remove();
        //})
        ok.animate({'top' : 0, 'opacity' : 0}, 500, function(){
            ok.remove();
        });

    }, 700);
}