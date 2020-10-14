/**
 * Created by Хицков Стефан on 27.10.2015.
 */


//console.log("hello");



(function($) {

    this.id = undefined;
    var self = this;
    var popup = $('<div class="readme">Таблица для быстрого ввода</div>');


    $(window).load(function () {

        $('div.table-but').append(popup);

        $('div.fade-in-table div.table-but').mouseover(function () {

            if (!$('div.fade-in-table').hasClass('open')) {
                clearTimeout(self.id);
                if(tId != undefined)clearTimeout(tId);
                self.id = undefined;
                popup.fadeIn(50);

            }
        }).mouseleave(function () {
            popup.fadeOut(50);
        });

        var tId = setTimeout(function () {

            popup.fadeIn(1000);

            popup.mouseover(function () {
                if (self.id != undefined) {
                    clearTimeout(self.id);

                }
                popup.fadeOut(500);
            });
        }, 1000);
        self.id = setTimeout(function () {
            popup.fadeOut(500);
            self.id = undefined;
        }, 6000);
    });

    $(document).ready(function(){

        $('body').keydown(function(event){
            //console.log(event.keyCode);
            if(event.altKey && !table.hasClass('move')){
                if(event.keyCode == 188 && !table.hasClass('open')){
                    $('input').blur();
                    open();
                } else if((event.keyCode == 190 || event.keyCode == 188) && table.hasClass('open')){
                    close();
                }
            }

            //if(event.altKey && event.keyCode == 77 && !table.hasClass('move')){
            //    switcher();
            //}
        });



        var bg = $('<div class="table-popup-bg"></div>');
        $('body').append(bg);

        var table = $('div.fade-in-table');
        var caption = $('<div class="table-caption"></div>');
        table.prepend(caption);
        var but = table.find('div.table-but');


        var winSize = $('html').width();
        var wid = winSize >= 1200 ? 1190 : winSize - 10;

        table.css({width : wid, 'right' : -wid + 'px'});

        but.click(switcher);

        function switcher(){
            if(table.hasClass('open')){
                close();
            } else {
                open();
            }
        }

        function open(){
            proccessEdgesList(function(data){
                caption.html('');
                for(var i = 1; i < data.length; i++){
                    var item = $('<div class="item-cont"></div>');
                    item.html('<span>' + i + '</span>' + " " + data[i]['text']);
                    caption.append(item);
                    //console.log(data[i]);
                }
                //popup.fadeOut(100);
                //table.addClass('move');
                //processDetails(function(data){
                //    inputTable.rebuild(data);
                //    $(bg).fadeIn(1000);
                //    table.animate({'right' : '20px'},800, function(){
                //        but.find('p').html('&gt;');
                //        table.animate({'right' : '0px'}, 100, function(){
                //            table.addClass('open');
                //            table.find('table').addClass('focus');
                //            table.removeClass('move');
                //            //$('body').css({'overflow' : 'hidden', 'margin-right': '17px'});
                //        });
                //    });
                //});
            }, function (data){
                var options = [{
                    value: 0,
                    text: 'нет',
                    thickness : 0,
                    idx : 0
                }];
                var num = 1;
                for (var key in data) {
                    options.push({
                        value: data[key]['guid'],
                        text: data[key]['title'],
                        visible : data[key]['thickness'],
                        idx : num
                    });
                    num++;
                }
                return options;
            });
            //console.log('open');

            popup.fadeOut(100);
            table.addClass('move');

            processDetails(function(data){
                transformData(data);

                inputTable.rebuild(data);
                $(bg).fadeIn(1000);

                but.animate({
                    'padding' : '5px 0px 5px 0px',
                    'left' : '-10px',
                    'width' : '10px'
                }, 900);

                table.animate({'right' : '20px'},800, function(){
                    but.find('p').html('&gt;');
                    table.animate({'right' : '0px'}, 100, function(){
                        table.addClass('open');
                        table.find('table').addClass('focus');
                        table.removeClass('move');
                        var scr = $('body').scrollTop();
                        $('body').addClass('noscroll');
                        $('body').css({'top' : -scr});
                    });
                });
            });
        }

        function close(){
            bg.fadeOut(1000);
            table.addClass('move');
            var winSize = $('html').width();
            var wid = winSize >= 1200 ? 1190 : winSize - 10;

            but.animate({
                'padding' : '5px 25px 5px 10px',
                'left' : '-50px',
                'width' : '50px'
            }, 900);

            table.animate({'right' : -wid - 20}, 800, function(){
                but.find('p').html('&lt;');
                table.animate({'right' : -wid}, 100, function(){
                    table.removeClass('open');
                    table.removeClass('move');
                    table.find('table').removeClass('focus');
                    var scr = parseFloat($('body').css('top'));
                    $('body').removeClass('noscroll');
                    $('body').scrollTop(Math.abs(scr));
                    //$('body').css({'overflow' : 'auto', 'margin-right': '0'});
                });
            });
        }

        $(window).resize(function(){
            var winSize = $('html').width();
            if(winSize >= 1200){
                var width = 1190;
            } else {
                width = winSize - 10;
            }
            table.css({
                'width' : width + 'px',
                'right' : table.hasClass('open') ? 0 : -width + 'px'
            });
        });

        setInterval(function(){
                table.find('.fade-in-table-cont').height(table.height() - $('div.table-caption').height());
            //}
        }, 40);

    });

})(jQuery);