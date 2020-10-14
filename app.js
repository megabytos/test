function printm(a,b,c){var m=new Array(a,b,c);var s=m[0]+"@";for(var i=1;i<m.length;i++){if(i>1)s+=".";s+=m[i]}document.write('<a class="email"  href='+'"mai'+'lto:'+s+'" onclick="_gaq.push([\'_trackEvent\', \'Contact Us\', \'Click E-mail\', \''+s+'\']);">'+s+'</a>')}
function printm2(a,b,c,d){var m=new Array(a,b,c);var s=m[0]+"@";for(var i=1;i<m.length;i++){if(i>1)s+=".";s+=m[i]}document.write('<a  href='+'"mai'+'lto:'+s+'">'+d+'</a>')}
function printml(a,b,c){var m=new Array(a, b, c);var s=m[0]+"@";for(var i=1;i<m.length;i++){if(i>1)s+=".";s+=m[i]}document.write(s);}
function printml2(a,b,c){var m=new Array(a, b, c);var s=m[0]+"@";for(var i=1;i< m.length;i++){if(i>1)s+=".";s+=m[i]}document.write('<area shape="rect" coords="60,8,84,28" href='+'"mai'+'lto:'+s+'">');}
function isEmpty(a){e=/^\s*$/;return e.test(a)}
function isPhone(a){a=a.replace(/[\s\-\(\)\.\]\[]/g,'');p=/^\+*\d{7,15}(\+\d{2,4})?$/;return p.test(a)}
function isEmail(a){a=a.replace(new RegExp('/\(.*?\)/'),'');m=/^[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*@[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*\.[a-zA-Z]{2,4}$/;return m.test(a)}

function showWindow(locat){
	var pop=locat;
	email=window.open(pop, 'popuper', "location=no,directories=no,status=no,toolbar=no,resizable=no,scrollbars=no,top=225,left=315,width=280,height=230");
}

function OpenWin (url,name,w,h){
	var t=0,l=0;
	var mw=screen.availWidth;
	var mh=screen.availHeight;
if (mw>0 && mh>0) {
	l=(mw-w)*.5;
	t=(mh-h)*.5;
	}
var win=open(url,name,"width="+w+",height="+h+"," +"left="+l+",top="+t+"," + "directories=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no,titlebar=no");
if (win) {
	win.focus();
	return true;
	}
return false;
}


function setH(el, hc){
if (window.innerHeight ){
	if (window.innerHeight > document.getElementById(el).offsetHeight){
		hh=window.innerHeight-hc;
		document.getElementById(el).style.height=''+hh+'px';
		}
	}
if (document.body.clientHeight){
	if (document.body.clientHeight > document.getElementById(el).offsetHeight){
		hh=document.body.clientHeight-hc;
		document.getElementById(el).style.height=''+hh+'px';
		}
	}
}

function getElementsByAttribute(oElm, strTagName, strAttributeName, strAttributeValue){
    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)", "i") : null;
    var oCurrent;
    var oAttribute;
    for(var i=0; i<arrElements.length; i++){
        oCurrent = arrElements[i];
        oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
        if(typeof oAttribute == "string" && oAttribute.length > 0){
            if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
                arrReturnElements.push(oCurrent);
            }
        }
    }
    return arrReturnElements;
}

// эмулирует getElementsByClassName для IE
if(document.getElementsByClassName) {
	getElementsByClass = function(classList, node) {    
		return (node || document).getElementsByClassName(classList)
	}
} else {
	getElementsByClass = function(classList, node) {			
		var node = node || document,
		list = node.getElementsByTagName('*'), 
		length = list.length,  
		classArray = classList.split(/\s+/), 
		classes = classArray.length, 
		result = [], i,j;
		for(i = 0; i < length; i++) {
			for(j = 0; j < classes; j++)  {
				if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
					result.push(list[i]);
					break;
				}
			}
		}	
		return result;
	}
}




function hideclass(cn){
	var ar = getElementsByClass(cn);
	for (var i=0; i<ar.length; i++) {   
		ar[i].style.display = "none";
		}	
	}

function showclass(cn){
	var ar = getElementsByClass(cn);
	for (var i=0; i<ar.length; i++) {   
		ar[i].style.display = "block";
		}	
	}




function sh(id) {
	document.getElementById(id).style.display='block';
}
function hd(id,cls) {
	var elm = document.getElementById(id);
	if(elm.className==cls) {
	elm.style.display='none';
	}
}
function dl(id, idl,cls) {
	document.getElementById(id).className=cls; 
	document.getElementById(idl).style.display='none';
}



function SM(obj){
    if(document.getElementById)
    {	
    var el = document.getElementById(obj);
    if(el.style.display == "none")
    	{		
		$(el).slideDown(800); 
		//el.style.display = "block";
		//el.className = 'current';
		//setTimeout(function(){ $('#s' + num).slideDown(800); }, 300);
		//$('#s' + num).slideDown(800,'easeOutBack');
		//$('#s' + num).animate({opacity: 'toggle', height: 'toggle'}, 800, 'easeOutBack');		
      	//setCookie(obj,'1',36000); 
   		}
    else
    	{
		$(el).slideUp(400); 
		//el.style.display = "none";
		//$('#s' + num).slideUp(600);
		//$('#s' + num).animate({opacity: 'toggle', height: 'toggle'}, 600, 'easeInBack');
		//el.className = '';
    	}
    }
}



function checkcallbackForm()
{
	var form = document.callbackForm;
	var SendItem= 0;
	var AlertMessage;

if (isEmpty(form.utel.value)) {
		SendItem= 1; AlertMessage = 'Для того, чтобы мы могли связаться с вами\nнеобходимо указать телефон';
} else if (!isPhone(form.utel.value)) {
		SendItem= 1; AlertMessage = 'Укажите правильный телефон';
}

  if (!SendItem) {
		form.submit();
	} else {
		alert(AlertMessage);
  }
}




function addCbTheme(id){
    $("#cboxOverlay, #colorbox").addClass(id);
	$("#cboxOverlay, #colorbox").removeClass('cboxIE');
}
function removeCbTheme(id){
    $ ("#cboxOverlay, #colorbox").removeClass(id);
	$("#cboxOverlay, #colorbox").addClass('cboxIE');
}

function addCbTheme2(id){
   $('#clbox[rel=stylesheet]').attr('href', '/css/colorbox1.css'); 
}
function removeCbTheme2(id){
    $('#clbox[rel=stylesheet]').attr('href', '/css/colorbox.css');
}

function useColorboxTheme(theme) {
    var selectedTheme = theme;    
    $(".colorboxTheme").attr("disabled", "disabled");
    $("#" + selectedTheme).removeAttr("disabled");
}

function defaultColorboxTheme() {
    $(".colorboxTheme").attr("disabled", "disabled");
    $(".colorboxTheme.default").removeAttr("disabled");
}


$(function(){
    $(document).on('click', 'i[title]', function(){
        document.location.href = $(this).attr("title");
    })
})

var create_dst=0;


