
function isEmpty(str) {
	oReEmpty = /^\s*$/;
	return oReEmpty.test(str);
}

function getObjCount(obj) {
  var counter = 0;
  for (var key in obj) {
    counter++;
  }
  return counter;
}

function ShowProps(obj){
    var result = '';
    for (var i in obj) {
        result += "." + i + " = " + obj[i] + '\n';
		}
    return(result);
}

function checkOnlineForm() 
{
	var SendItem= 0;
	var AlertMessage;
	var form = document.onlineform;
	
if(form.ADTCOUNT.options[form.ADTCOUNT.selectedIndex].value == "0" && form.YTHCOUNT.options[form.YTHCOUNT.selectedIndex].value == "0" && form.CHDCOUNT.options[form.CHDCOUNT.selectedIndex].value == "0" && form.INFCOUNT.options[form.INFCOUNT.selectedIndex].value == "0")
	{SendItem= 1; AlertMessage = 'Укажите Кто летит';}	
if (form.ARR_0.value == def_arr || isEmpty(form.ARR_0.value))
	{SendItem= 1; AlertMessage = 'Укажите Куда летим';}	
if (form.DEP_0.value == def_dep || isEmpty(form.DEP_0.value))
	{SendItem= 1; AlertMessage = 'Укажите Город вылета';}
if(form.JOURNEY_TYPE.value == 'OJ'){
	var numItems = $('.dtr').length+1;
	if(numItems>1){
		for (var i = 1; i < numItems; i++) {
			var dep = eval('form.DEP_'+i+'.value');
			var arr= eval('form.ARR_'+i+'.value');
			if (arr == def_arr || isEmpty(arr))
				{SendItem= 1; AlertMessage = 'Укажите Куда летим';}	
			if (dep == def_dep || isEmpty(dep))
				{SendItem= 1; AlertMessage = 'Укажите Город вылета';}
			}	
		}		
	}	
if (!SendItem) {
	//form.submit();
	var url = getURL();
	window.location.href = form.action + '/' + url;
	} else {
	alert(AlertMessage);
  }
}

function getURL(){
	var form = document.onlineform;	
	if(form.JOURNEY_TYPE.value == 'OW'){
		var str = form.DEP_0.value + form.ARR_0.value + form.dat0.value + (form.PRICER_PREF0.value=='FIX' ? 0 : 1) + '/' + form.ADTCOUNT.value + '%7C' + form.CHDCOUNT.value + '%7C' + form.INFCOUNT.value + '/' + form.CABIN_PREF.value;		
		}
	if(form.JOURNEY_TYPE.value == 'RT'){
		var str = form.DEP_0.value + form.ARR_0.value + form.dat0.value + (form.PRICER_PREF0.value=='FIX' ? 0 : 1) + '%7C' +  form.dat1.value + (form.PRICER_PREF1.value=='FIX' ? 0 : 1) + '/' + form.ADTCOUNT.value + '%7C' + form.CHDCOUNT.value + '%7C' + form.INFCOUNT.value + '/' + form.CABIN_PREF.value;
		}
	if(form.JOURNEY_TYPE.value == 'OJ'){		
		var str = form.DEP_0.value + form.ARR_0.value + form.dat0.value + 0;
		var numItems = $('.dtr').length+1;
		if(numItems>1){
			for (var i = 1; i < numItems; i++) {
				str += '%7C' + eval('form.DEP_'+i+'.value') + eval('form.ARR_'+i+'.value') + eval('form.dat'+i+'.value') + 0; 
				}	
			}	
			str += '/' + form.ADTCOUNT.value + '%7C' + form.CHDCOUNT.value + '%7C' + form.INFCOUNT.value + '/' + form.CABIN_PREF.value;			
		}
	//alert(str);
	return str;
}


/*	
	
(function($) {
$(function() {

	$('ul.tabs').on('click', 'li:not(.current)', function() {
		$(this).addClass('current').siblings().removeClass('current')
			.parents('div.section').find('div.box').eq($(this).index()).fadeIn(150).siblings('div.box').hide();
	})

	var tabIndex = window.location.hash.replace('#tab','')-1;
	if (tabIndex != -1) $('ul.tabs li').eq(tabIndex).click();

	$('a[href*=#tab]').click(function() {
		var tabIndex = $(this).attr('href').replace(/(.*)#tab/, '')-1;
		$('ul.tabs li').eq(tabIndex).click();
	});

})
})(jQuery)	
	
*/	



	function switchTabs(name){

		if(name=='ow'){
			$('#one_way').addClass('cur');
			$('#round_trip').removeClass('cur');
			$('#open_jaw').removeClass('cur');
			//document.getElementById("fl_back").style.display='none';
			document.getElementById("add_route").style.display='none';
			document.getElementById("del_route").style.display='none';
			document.onlineform.JOURNEY_TYPE.value = 'OW';
			$(".dtr").remove();
			document.getElementById("default-id").value = 0;
			$("#fd0").children().show();	
			if ( typeof(settings) == "undefined") { return; }
		} else if (name=='rt'){
			$('#one_way').removeClass('cur');
			$('#round_trip').addClass('cur');
			$('#open_jaw').removeClass('cur');			
			//document.getElementById("fl_back").style.display='block';
			document.getElementById("add_route").style.display='none';
			document.getElementById("del_route").style.display='none';
			document.onlineform.JOURNEY_TYPE.value = 'RT';
			$(".dtr").remove();
			document.getElementById("default-id").value = 0;
			$("#fd0").children().show();		
			if(frm==1){	addInput(1); }
			else{ addDateInput(1); }
		} else {
			$('#one_way').removeClass('cur');
			$('#round_trip').removeClass('cur');
			$('#open_jaw').addClass('cur');			
			//document.getElementById("fl_back").style.display='none';
			document.getElementById("add_route").style.display='block';
			document.getElementById("del_route").style.display='block';			
			document.onlineform.JOURNEY_TYPE.value = 'OJ';
			$(".dtr").remove();	
			document.getElementById("default-id").value = 0;	
			$("#fd0").children().hide();	
		}
	}

	
function addDateInput(id) {
	str = '<div class="fieldset dt dtr"><label>Дата возврата</label><input readonly type="text" id="dfrom' + id + '" name="dat' + id + '"><input type="hidden" name="MONTH_SEL_' + id + '" value=""><input type="hidden" name="DAY_' + id + '" value="">';
	str += '<div class="flexi"><input type="checkbox" name="flexi_date' + id + '" value="1" id="flexi_date' + id + '" onclick="if(this.checked) document.onlineform.PRICER_PREF' + id + '.value=\'\'; else document.onlineform.PRICER_PREF' + id + '.value=\'FIX\';"><label for="flexi_date' + id + '">&plusmn; 3 дня</label><input type="hidden" name="PRICER_PREF1" value="FIX"></div>';
	str += '</div>';				
	$(".dtd").after(str);
	//$("SELECT").selectBox();
	//$.jStyling.createCheckbox($('#flexi_date' + id));
	
	var sdate = $("#dfrom" + (id-1)).datepicker('getDate');
	sdate.setDate(sdate.getDate()+1);
	//alert($.datepicker.formatDate('dd.mm.yy',sdate));
	create_dp_obj (id);
	set_dp_date(id, $.datepicker.formatDate('dd.mm.yy',sdate), 1);		
	}



function addInput(bk) {
	var id = document.getElementById("default-id").value;
	id++;
	
	if(bk==1){
		var str = '<div id="t' + id + '" class="fieldset clearfix backAir dtr">';
		str += '<div class="field startAir"><div class="title"></div><div class="wrap disabled"><div class="dec_wrap"><input type="text" value="'+def_dep+'" name="DEPB" disabled></div></div></div>';
		str += '<div class="swap"><span></span></div>';
		str += '<div class="field endAir"><div class="title"></div><div class="wrap disabled"><input type="text" value="'+def_arr+'" name="ARRB" disabled></div></div>';	
		str += '<div class="field dateAir"><div class="flexi_date"><input type="checkbox" name="flexi_date' + id + '" value="1" id="flexi_date' + id + '" onclick="if(this.checked) document.onlineform.PRICER_PREF' + id + '.value=\'\'; else document.onlineform.PRICER_PREF' + id + '.value=\'FIX\';"><input type="hidden" name="PRICER_PREF' + id + '" value="FIX"><label for="flexi_date' + id + '">&plusmn; 3 дня</label></div><div id="dt' + id + '" class="date"><div class="day"><b></b> <i></i></div><div class="dow"></div><input type="hidden" id="dfrom' + id + '" name="dat' + id + '"><input type="hidden" name="MONTH_SEL_' + id + '" value=""><input type="hidden" name="DAY_' + id + '" value=""></div></div>';	
		str += '</div>';
		}
	else{
		var str = '<div id="t' + id + '" class="fieldset_block dtr">';
		str += '<h5>' + (id+1) + '</h5>';
		str += '<div class="field"><input type="text" value="'+def_dep+'" name="DEP' + id + '" id="dep' + id + '"><input type="hidden" name="DEP_' + id + '" value=""><img id="dld' + id + '" src="/i/icons/ajax-loader11t.gif" alt="loading..." class="floader"/><img id="ddl' + id + '" src="/i/avia/icons/ico_del.gif" alt="очистить" title="очистить" class="fdels"/></div>';
		str += '<div class="field"><input type="text" value="'+def_arr+'" name="ARR' + id + '" id="arr' + id + '"><input type="hidden" name="ARR_' + id + '" value=""><img id="ald' + id + '" src="/i/icons/ajax-loader11t.gif" alt="loading..." class="floader"/><img id="adl' + id + '" src="/i/avia/icons/ico_del.gif" alt="очистить" title="очистить" class="fdels"/></div>';
		str += '<div class="fieldset dt"><label>Дата вылета</label><input readonly type="text" id="dfrom' + id + '" name="dat' + id + '"><input type="hidden" name="MONTH_SEL_' + id + '" value=""><input type="hidden" name="DAY_' + id + '" value="">';
		//str += '<select style="width: 101px;" name="TIME_PREF_' + id + '"><option value="" selected>- время -</option><option value="any_time">любое</option><option value="morning">Утром</option><option value="afternoon">После полудня</option><option value="evening">Вечером</option><option value="0">00:00</option><option value="1">01:00</option><option value="2">02:00</option><option value="3">03:00</option><option value="4">04:00</option><option value="5">05:00</option><option value="6">06:00</option><option value="7">07:00</option><option value="8">08:00</option><option value="9">09:00</option><option value="10">10:00</option><option value="11">11:00</option><option value="12">12:00</option><option value="13">13:00</option><option value="14">14:00</option><option value="15">15:00</option><option value="16">16:00</option><option value="17">17:00</option><option value="18">18:00</option><option value="19">19:00</option><option value="20">20:00</option><option value="21">21:00</option><option value="22">22:00</option><option value="23">23:00</option></select>';
		str += '</div></div>';			
	}
	
	$("#add_route").before(str);
	//$.jStyling.createCheckbox($('#flexi_date' + id));
	//$("SELECT").selectBox();
	
	var sdate = $("#dfrom" + (id-1)).datepicker('getDate');
	sdate.setDate(sdate.getDate()+1);
	//alert($.datepicker.formatDate('dd.mm.yy',sdate));
	create_dp_obj (id);
	set_dp_date(id, $.datepicker.formatDate('dd.mm.yy',sdate), 1);
	
	if(bk!=1){
	create_dst_obj('dep', id);
	create_dst_obj('arr', id);
	}
	
	document.getElementById("default-id").value = id;
}



function removeInput() {
var id = document.getElementById("default-id").value;
if(id>0){
	$("#t" + id).remove();
	id--;	
	document.getElementById("default-id").value = id;
	}
}	


	
function create_dp_obj (id){

	var dates = $("#dfrom" + id).datepicker({		
		dateFormat: "dd.mm.yy",
		changeMonth: true,
		numberOfMonths: window.innerWidth < 640 ? 1 : 2,
		showOn: "button",
		buttonImage:  "/i/p.gif",
		buttonImageOnly: true,
		minDate: new Date(), maxDate: +340,		
	
	onSelect: function( selectedDate ) {		
		set_dp_date(id, selectedDate, 0);
		$(this).attr('sl',1);		
		cl = $(".dtr" ).length+1;
		for (i=(id+1); i<cl; i++) {			
			var cdate = $("#dfrom" + (i-1)).datepicker('getDate');
			var fdate = $("#dfrom" + i).datepicker('getDate');
			//alert (i + ' : ' + id + '\n' + cdate + ' \n ' + fdate);
			if(cdate>fdate){			
				cdate.setDate(cdate.getDate()+1);
				var dd = $.datepicker.formatDate('dd.mm.yy',cdate);
				set_dp_date(i, dd, 1);
				}			
			}		
		//var bdate = $("#dfrom" + (id)).datepicker('getDate');
		var bdate = $.datepicker.parseDate('dd.mm.yy', selectedDate);	
		$("#dfrom" + (id+1)).datepicker("option", "minDate", bdate);				
		},
		
	beforeShow: function (input, inst) {
		$(this).datepicker("option", "numberOfMonths", window.innerWidth < 640 ? 1 : 2); 	
		},
	
	onClose: function() {
	    if($("[name=JOURNEY_TYPE]").val() == 'RT' && $("#dfrom" + (id)).attr('sl') && !$("#dfrom" + (id+1)).attr('sl')){				
				setTimeout(function(){$("#dfrom" + (id+1)).datepicker("show"); }, 1000);								
			}
		}
	
	});
	

	$("#dfrom" + id).click(function(){
		if ( $("#dfrom" + id).datepicker('widget').is(':hidden')) {
			$("#dfrom" + id).datepicker("show");
		} else {
			$("#dfrom" + id).datepicker("hide");
		}
	});	


}
	


function set_dp_date(id, sdate, set){
	if(set){
		if(id>0){
			var pdate = $("#dfrom" + (id-1)).datepicker('getDate');
			$("#dfrom" + id).datepicker("option", "minDate", pdate);
			}	
		$("#dfrom" + id).datepicker("setDate", sdate);
		}	
	var curDate = $("#dfrom" + id).datepicker('getDate');
	var dd = $.datepicker.formatDate('dd.mm.yy',curDate);
	setDt(id, dd);
	$("#dt" + id +" > .day > b").html($.datepicker.formatDate('d', curDate));
	$("#dt" + id +" > .day > i").html($.datepicker.formatDate('M', curDate));
	$("#dt" + id +" > .dow").html($.datepicker.formatDate('DD', curDate));	
}




function setDt(id, dt){
$("[name=MONTH_SEL_"+id+"]").val(dt.substring(3, 5) + "/" + dt.substring(6, 10));
$("[name=DAY_"+id+"]").val(dt.substring(0, 2));
}



		
/*

$('#dep1').autocomplete({
    source: function (request, response) {
        $.get("/avia/online/?action=getApt" + request.term, response)
    },
    minLength: 2,
	select: function( event, ui ) {
		if(ui.item) {alert("Selected: " + ui.item.value + " aka " + ui.item.id); }
		else {alert("Nothing selected, input was " + this.value ); }
		}
});


$(function() {
        var search_form = "#onlineform";
        var search_elem = search_form + " [name=DEP_0]";
        var url = '/avia/online/';

        $("#dep1").autocomplete({
            minLength: 2,
            source: function(req, add) {
                $.post(url, {action: 'getApt', req: req, add: add},
                   function(data) {
                       data = $.parseJSON(data);
                       add(data);
                   }
                )
            },
            select: function(event,ui) {
                $(search_elem).val(ui.item.value).parent().submit();
            }
        });
               
});

*/


function create_dst_obj(dst, id){
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var ld = dst=='dep' ? 'dld' : 'ald';
	var dl = dst=='dep' ? 'ddl' : 'adl';	
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	var bk = dst=='dep' ? 'ARRB' : 'DEPB';
	
$("#"+dst+id).autocomplete({
	source: "/rav/?action=getApt",
	minLength: 3,
	delay: 0,
	autoFocus: true,
	search: function(event, ui) {
		$("#"+ld+id).show();		
		},
	select: function( event, ui ) {
		//console.log("on select " +  $(".ui-autocomplete li").size()  + ' : ' +ui.item); 
		if(ui.item) {ui.item.value = ui.item.nm; setDst(dst, id, ui.item.code, ui.item, 1);  }
		else {alert("Nothing selected, input was " + this.value ); }		
		},
	close: function(event,ui) { 
		//console.log("on close " +  $(".ui-autocomplete li").size() + ' : ' +ui.item );
		if (!ui.item && this.value.length>2 && !$("[name="+vl+id+"]").attr('er') && !$("[name="+vl+id+"]").val()) {			
			setTpErr(dst, id, 2);				
        	}     	     
    	},	
    change: function(event,ui) { 
		 //console.log("on change " +  $(".ui-autocomplete li").size()  + ' : ' +ui.item);
		if (!ui.item && this.value.length>2 && !$("[name="+vl+id+"]").attr('er') && $("[name="+vl+id+"]").val() && $(".ui-autocomplete li").size()>1) {		
			//setTpErr(dst, id, 2);
        	}     	     
    	},
	response: function (event, ui) { 
		$("#"+ld+id).hide();
		if (!ui.content.length) {
			setTpErr(dst,id,1);
			}else{
			setTpMsg(dst,id,1);
			}			
		if (ui.content.length === 1 && ui.content[0].code && $("[name="+vl+id+"]").val()!=ui.content[0].code  && $("[name="+vl+id+"]").attr('er') != 2) { 
			setDst(dst, id, ui.content[0].code, ui.content[0], 1);
			//$("#dep0").click(); 
			$(this).autocomplete( "close" ); 
			} 
		}
	}).data('ui-autocomplete')._renderItem = function (ul, item) {
		var cls = (item.ct>0) ? ' class="city"' : ''; 
		var allapt = (item.ct>1) ? ' <small>(все аэропорты)</small>' : '';
		return $('<li>').append('<a'+cls+'><b>' + item.code + '</b><span>' + item.nm + allapt + '</span><i>' + cns[item.cn] + '</i></a>').appendTo(ul);				
            };

$("#"+dl+id).click(function(){
	resetFld(dst, id);
	//$("#"+dst+id).blur();
	$("#"+dl+id).hide();
	});		
		
$("#"+dst+id).on( "blur", function() {setBlur(dst,id); }).on( "focus", function() {setFocus(dst,id); }).on( "keyup", function() {if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val(this.value); } if(this.value.length<3) { setTpMsg(dst,id,2); } });

if(exm) setTpDst(dst, id);
}


function setTpMsg(dst, id, msg){
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	if(msg == 1) var str = 'город, аэропорт или код';
	if(msg == 2) var str = 'город, аэропорт или код (минимум 3 символа)';	
	if(dst=='dep'){
		$('#t'+ id +' .startAir > .wrap').removeClass('error'); }
	else{	
		$('#t'+ id +' .endAir > .wrap').removeClass('error'); 
		}
	$("#"+tp+id).html(str);
	$("[name="+vl+id+"]").removeAttr('er');	
	}

	
function setTpErr(dst, id, msg){
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	if(msg == 1) var str = 'нет вариантов';
	if(msg == 2) var str = 'город не выбран';
	if(msg == 3) var str = 'нужно ввести не менее 3 символов';
	if(dst=='dep'){
		$('#t'+ id +' .startAir > .wrap').addClass('error'); }
	else{
		$('#t'+ id +' .endAir > .wrap').addClass('error');	
		}
	$("#"+tp+id).html(str);
	$("[name="+vl+id+"]").attr('er', msg);
	$("[name="+vl+id+"]").val('');
	$("[name="+vl+id+"]").removeAttr('nm');	
	$("[name="+vl+id+"]").removeAttr('cn');	
	}


function setTpDst(dst, id){
	var arr = dst=='dep' ? rdt : rat;
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var str='например:';
	var i=0;
	var c=getObjCount(arr);
	for(key in arr){
		i++;
		str += i==c ? ' <span class="example" onclick="setDst(\''+dst+'\', '+id+', \''+key+'\', undefined, 1);">'+arr[key].nm+'</span>' : ' <span class="example" onclick="setDst(\''+dst+'\', '+id+', \''+key+'\', undefined, 1);">'+arr[key].nm+'</span>,';	
		}	
	if(dst=='dep'){
		$('#t'+ id +' .startAir > .wrap').removeClass('error'); }
	else{	
		$('#t'+ id +' .endAir > .wrap').removeClass('error'); 
		}	
	$("#"+tp+id).html(str);	
}
		
		
function setDst(dst, id, code, arr, showDP){
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var fl = dst=='dep' ? 'dep' : 'arr';	
	var dl = dst=='dep' ? 'ddl' : 'adl';
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	var bk = dst=='dep' ? 'ARRB' : 'DEPB';
	if(typeof arr === 'undefined'){
		var arr = dst=='dep' ? rdt[code] : rat[code];
		}
	$("#"+tp+id).html(code+', '+cns[arr.cn]);
	$("#"+fl+id).val(arr.nm);
	$("[name="+vl+id+"]").val(code);
	$("[name="+vl+id+"]").attr({'nm': arr.nm, 'cn': cns[arr.cn] });
	$("#"+dl+id).show();
	if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val(arr.nm); }
	//if(dst=='dep' && $("[name=JOURNEY_TYPE]").val() == 'RT' && !$("[name=ARR_"+id+"]").val()){ $("#arr"+id).focus(); }
	
	if(showDP && $("[name=DEP_"+id+"]").val() && $("[name=ARR_"+id+"]").val() && !$("#dfrom" + id).attr('sl')){
		setTimeout(function(){$("#dfrom" + id).datepicker("show"); }, 300);
		}
	 if(showDP && $("[name=JOURNEY_TYPE]").val() == 'RT' && $("[name=DEP_"+id+"]").val() && $("[name=ARR_"+id+"]").val() && $("#dfrom" + id).attr('sl') && !$("#dfrom" + (id+1)).attr('sl')){
	 	setTimeout(function(){$("#dfrom" + (id+1)).datepicker("show");	}, 500);
		}
}



	
function setFocus(dst, id){
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	var bk = dst=='dep' ? 'ARRB' : 'DEPB';
	var lr = dst=='dep' ? ' .startAir' : ' .endAir';
	var dl = dst=='dep' ? 'ddl' : 'adl';
	var def = dst=='dep' ? def_dep : def_arr;
	if($("#"+dst+id).val() == def){
		$("#"+dst+id).val(''); 
		if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val(''); } 
		}
	$('#t'+ id +lr+' > .wrap').addClass('active');
	$("#"+dl+id).show();
	if($("[name="+vl+id+"]").attr('er') != 1){
		if($("#"+dst+id).val().length<3) {setTpMsg(dst,id,2); }
		else{setTpMsg(dst,id,1); }
		if($("#"+dst+id).val().length>2){ $("#"+dst+id).autocomplete("search"); }
		$("[name=DEP_"+id+"]").removeAttr('er');
		}
}
	
	
function setBlur(dst, id){
	var tp = dst=='dep' ? 'dtp' : 'atp';
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	var bk = dst=='dep' ? 'ARRB' : 'DEPB';
	var lr = dst=='dep' ? ' .startAir' : ' .endAir';
	var dl = dst=='dep' ? 'ddl' : 'adl';
	var def = dst=='dep' ? def_dep : def_arr;
	var defbk = dst=='dep' ? def_arr : def_dep;	
	
	$('#t'+id+lr+' > .wrap').removeClass('active');
	if(!$("[name="+vl+id+"]").attr('er')){
		$('#t'+id+lr+' > .wrap').removeClass('error');		
		}
	if ($("#"+dst+id).val() == ''){
		$("#"+dst+id).val(def);
		$("#"+dl+id).hide();
		if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val(defbk); }
		if(exm) setTpDst(dst, id);
		}
	if($("#"+dst+id).val().length<3) {setTpErr(dst, id, 3); }
		
	if($("[name="+vl+id+"]").val()){
		$("#"+dst+id).val($("[name="+vl+id+"]").attr('nm'));
		$("#"+tp+id).html($("[name="+vl+id+"]").val()+', '+$("[name="+vl+id+"]").attr('cn'));
		if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val($("[name="+vl+id+"]").attr('nm')); }
		}
	else{
		//setTpDst(dst, id);
		}		
}


function resetFld(dst, id){
	var vl = dst=='dep' ? 'DEP_' : 'ARR_';
	var bk = dst=='dep' ? 'ARRB' : 'DEPB';
	var dl = dst=='dep' ? 'ddl' : 'adl';	
	var def = dst=='dep' ? def_dep : def_arr;
	var defbk = dst=='dep' ? def_arr : def_dep;	
	$("#"+dst+id).val(def);
	$("[name="+vl+id+"]").val('');
	$("[name="+vl+id+"]").removeAttr('nm');	
	$("[name="+vl+id+"]").removeAttr('cn');	
	if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name="+bk+"]").val(defbk); }
	
	if(exm) setTpDst(dst, id);	
}


function swap(id){
	var acd = $("[name=ARR_"+id+"]").val();
	var anm = $("[name=ARR_"+id+"]").attr('nm');
	var acn = $("[name=ARR_"+id+"]").attr('cn');
	var avl = $("#arr"+id).val();
	var atp = $("#atp"+id).html();
	var dbk = frm==1 ? $("[name=DEPB]").val() : '';
	
	$("[name=ARR_"+id+"]").val($("[name=DEP_"+id+"]").val());
	$("[name=ARR_"+id+"]").attr('nm', $("[name=DEP_"+id+"]").attr('nm'));
	$("[name=ARR_"+id+"]").attr('cn', $("[name=DEP_"+id+"]").attr('cn'));
	if($("#dep"+id).val()=='' || $("#dep"+id).val()==def_dep){
		resetFld('arr', id);
		}
	else{
		$("#arr"+id).val($("#dep"+id).val()); 
		$("#atp"+id).html($("#dtp"+id).html());
		if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name=DEPB]").val($("[name=ARRB]").val()); }
		}
	
	$("[name=DEP_"+id+"]").val(acd);
	$("[name=DEP_"+id+"]").attr('nm', anm);
	$("[name=DEP_"+id+"]").attr('cn', acn);
	if(avl=='' || avl==def_arr){
		resetFld('dep', id);
		}
	else{
		$("#dep"+id).val(avl); 
		$("#dtp"+id).html(atp);
		if($("[name=JOURNEY_TYPE]").val() == 'RT' && frm==1) {$("[name=ARRB]").val(dbk); }
		}
}


function togglePsgs(){
scrollTop = $(window).scrollTop();
scrollBot = scrollTop + $(window).height();
elPos = $("#passengers").offset().top;
elTop = elPos  - scrollTop;
elBottom = scrollBot - elPos -  $("#passengers").height() - 18;
psgHeight = $("#psgs").height();

 if  (elBottom > psgHeight) {
	$("#psgs").addClass("dropdown");
	$("#psgs").removeClass("dropup");	 
	}
 else if (elBottom > elTop){
	$("#psgs").addClass("dropdown");
	$("#psgs").removeClass("dropup");		 
 }
 else{
	$("#psgs").addClass("dropup");
	$("#psgs").removeClass("dropdown");	
 }
$("#psgs").toggle();
}





$(document).ready(function() {
	//$.jStyling.createRadio($('input[type=radio]'));
	//$.jStyling.createCheckbox($('input[type=checkbox]'));
	//$("SELECT").selectBox();
});



var cns = {'AU':'Австралия','AT':'Австрия','AZ':'Азербайджан','AL':'Албания','DZ':'Алжир','AS':'Американский Самоа','AI':'Ангилья','AO':'Ангола','AG':'Антигуа и Барбуда','AN':'Антильские острова','AR':'Аргентина','AM':'Армения','AW':'Аруба','AF':'Афганистан','BS':'Багамские острова','BD':'Бангладеш','BB':'Барбадос','BH':'Бахрейн','BY':'Беларусь','BZ':'Белиз','BE':'Бельгия','BJ':'Бенин','BM':'Бермуды','BG':'Болгария','BO':'Боливия','BA':'Босния и Герцеговина','BW':'Ботсвана','BR':'Бразилия','BN':'Бруней','BF':'Буркина Фасо','BI':'Бурунди','BT':'Бутан','VU':'Вануату','GB':'Великобритания','HU':'Венгрия','VE':'Венесуэла','VG':'Виргинские острова (Британские)','VI':'Виргинские острова (США)','VN':'Вьетнам','GA':'Габон','HT':'Гаити','GY':'Гайана','GM':'Гамбия','GH':'Гана','GP':'Гваделупа','GT':'Гватемала','GN':'Гвинея','GW':'Гвинея-Бисау','DE':'Германия','GI':'Гибралтар','HN':'Гондурас','HK':'Гонконг (Китай)','GD':'Гренада','GL':'Гренландия','GR':'Греция','GE':'Грузия','GU':'Гуам','DK':'Дания','CD':'Демократическая республика Конго','DJ':'Джибути','DM':'Доминика','DO':'Доминикана','EG':'Египет','ZM':'Замбия','ZW':'Зимбабве','IL':'Израиль','IN':'Индия','ID':'Индонезия','JO':'Иордания','IQ':'Ирак','IR':'Иран','IE':'Ирландия','IS':'Исландия','ES':'Испания','IT':'Италия','YE':'Йемен','KZ':'Казахстан','KY':'Каймановы острова','KH':'Камбоджа','CM':'Камерун','CA':'Канада','QA':'Катар','KE':'Кения','CY':'Кипр','KG':'Киргизия','KI':'Кирибати','CN':'Китай','KP':'КНДР','CC':'Кокосовые острова','CO':'Колумбия','KM':'Коморские острова','CG':'Конго','KR':'Корея','CR':'Коста Рика','CI':'Кот-д\'Ивуар','CU':'Куба','KW':'Кувейт','LA':'Лаос','LV':'Латвия','LR':'Либерия','LB':'Ливан','LY':'Ливия','LT':'Литва','LU':'Люксембург','MU':'Маврикий','MR':'Мавритания','MG':'Мадагаскар','YT':'Майотта','MO':'Макао (Китай)','MK':'Македония','MW':'Малави','MY':'Малайзия','ML':'Мали','MV':'Мальдивы','MT':'Мальта','MP':'Марианские острова','MA':'Марокко','MQ':'Мартиника','MH':'Маршалловы острова','MX':'Мексика','FM':'Микронезия','MZ':'Мозамбик','MD':'Молдова','MC':'Монако','MN':'Монголия','MS':'Монтсеррат','MM':'Мьянма','NA':'Намибия','NR':'Науру','NP':'Непал','NE':'Нигер','NG':'Нигерия','NL':'Нидерланды','NI':'Никарагуа','NU':'Ниуэ','NZ':'Новая Зеландия','NC':'Новая Каледония','NO':'Норвегия','WF':'о-ва Валлис и Футуна','CV':'о-ва Зеленого Мыса','WS':'о-ва Самоа','TC':'о-ва Туркс и Кайкос','AE':'ОАЭ','OM':'Оман','NF':'остров Норфолк','CX':'остров Рождества','CK':'острова Кука','PK':'Пакистан','PW':'Палау','PA':'Панама','PG':'Папуа - Новая Гвинея','PY':'Парагвай','PE':'Перу','PL':'Польша','PT':'Португалия','PR':'Пуэрто-Рико','RE':'Реюньон','RU':'Россия','RW':'Руанда','RO':'Румыния','SV':'Сальвадор','ST':'Сан-Томе и Принсипи','SA':'Саудовская Аравия','SC':'Сейшелы','PM':'Сен-Пьер и Микелон','SN':'Сенегал','VC':'Сент-Винсент и Гренадины','KN':'Сент-Китс и Невис','LC':'Сент-Люсия','RS':'Сербия','SG':'Сингапур','SY':'Сирия','SK':'Словакия','SI':'Словения','SB':'Соломоновы острова','SO':'Сомали','SD':'Судан','SR':'Суринам','US':'США','SL':'Сьерра-Леоне','TJ':'Таджикистан','TH':'Таиланд','TW':'Тайвань (Китай)','TZ':'Танзания','TG':'Того','TO':'Тонга','TT':'Тринидад и Тобаго','TV':'Тувалу','TN':'Тунис','TM':'Туркменистан','TR':'Турция','UG':'Уганда','UZ':'Узбекистан','UA':'Украина','UY':'Уругвай','FO':'Фарерские острова','FJ':'Фиджи','PH':'Филиппины','FI':'Финляндия','FK':'Фолклендские (Мальвинские) острова','FR':'Франция','GF':'Французская Гвиана','PF':'Французская Полинезия','HR':'Хорватия','CF':'ЦАР','TD':'Чад','ME':'Черногория','CZ':'Чехия','CL':'Чили','CH':'Швейцария','SE':'Швеция','LK':'Шри Ланка','EC':'Эквадор','GQ':'Экваториальная Гвинея','ER':'Эритрея','EE':'Эстония','ET':'Эфиопия','ZA':'ЮАР','JM':'Ямайка','JP':'Япония'};