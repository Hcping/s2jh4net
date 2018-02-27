+function($){var ExtDataGrid=function(element,options){this.$element=$(element);this.options=options;this.lastRefreshTimestamp=new Date().getTime();this.init()};ExtDataGrid.NAME="ExtDataGrid";ExtDataGrid.VERSION="1.0.0";ExtDataGrid.DEFAULTS={};ExtDataGrid.GRID_DEFAULTS={guiStyle:"bootstrap",iconSet:"fontAwesome",datatype:"json",loadui:false,loadonce:false,filterToolbar:{},ignoreCase:true,prmNames:{npage:"npage"},jsonReader:{repeatitems:false,root:"content",total:"totalPages",records:"totalElements"},treeGridModel:"adjacency",treeReader:{level_field:"extraAttributes.level",parent_id_field:"extraAttributes.parent",leaf_field:"extraAttributes.isLeaf",expanded_field:"extraAttributes.expanded",loaded:"extraAttributes.loaded",icon_field:"extraAttributes.icon"},autowidth:true,rowNum:15,page:1,altclass:"ui-jqgrid-evennumber",height:"stretch",viewsortcols:[true,"vertical",true],mtype:"GET",viewrecords:true,rownumbers:true,pager:true,toppager:true,pagerpos:"center",recordpos:"right",gridview:true,altRows:true,sortable:false,multiboxonly:true,multiselect:true,multiSort:false,forceFit:false,sortorder:"desc",sortname:"id",ajaxGridOptions:{dataType:"json"},ajaxSelectOptions:{cache:true},subGridOptions:{reloadOnExpand:false},formatter:{integer:{defaultValue:""},number:{decimalSeparator:".",thousandsSeparator:",",decimalPlaces:2,defaultValue:""},currency:{decimalSeparator:".",thousandsSeparator:",",decimalPlaces:2,defaultValue:""}},cmTemplate:{sortable:true},hoverrows:true,pgbuttons:true,pginput:true,rowList:[10,15,20,50,100,200,500,1000,2000],inlineNav:{restoreAfterSelect:true},addable:true,inlineNavAddable:false,contextMenu:false,columnChooser:true,exportExcelLocal:true,autoInitLoad:true};ExtDataGrid.prototype.init=function(){var $element=this.$element;var options=this.options;var $grid=this.$element;var that=this;if($element.attr("id")==undefined){$element.attr("id",App.getUniqueID("data-grid-"))}var userOptions=options.gridOptions;var attrOptions=$element.attr("grid-options");if(attrOptions){attrOptions=eval("("+attrOptions+")");$element.removeAttr("grid-options");userOptions=$.extend(true,{},userOptions,attrOptions)}that.userOptions=userOptions;$element.data("gridOptions",userOptions);if(Config.isDebugEnable()){console.log("User define grid options:");console.log(userOptions)}var computedOptions={navOptions:{afterRefresh:function(){that.lastRefreshTimestamp=new Date().getTime()}},gridDnD:userOptions.subGridRowExpandedKey?true:false,subGrid:userOptions.subGridRowExpandedKey?true:false,sortname:userOptions.subGridRowExpandedKey?"rgt":"id",inlineNav:{add:userOptions.editurl&&userOptions.inlineNavAddable?true:false,edit:userOptions.editurl?true:false,del:false,addParams:{addRowParams:{extraparam:{},restoreAfterError:false,oneditfunc:function(){},aftersavefunc:function(rowid,xhr){var response=jQuery.parseJSON(xhr.responseText);if(response.type=="success"||response.type=="warning"){Global.notify(response.type,response.message);var newid=response.data.id;setTimeout(function(){$grid.find("#"+rowid).attr("id",newid);$grid.jqGrid("resetSelection");$grid.jqGrid("setSelection",newid);if(gridOptions.afterInlineSaveRow){gridOptions.afterInlineSaveRow.call($grid,rowid)}var $pager=$(that.gridOptions.pager);$pager.find(".ui-pg-div span.fa-plus").click()},200)}else{if(response.type=="failure"||response.type=="error"){Global.notify("error",response.message)}else{Global.notify("error","数据处理异常，请联系管理员")}}}}},editParams:{restoreAfterError:false,aftersavefunc:function(rowid,xhr){var response=jQuery.parseJSON(xhr.responseText);if(response.type=="success"||response.type=="warning"){Global.notify(response.type,response.message);if(gridOptions.afterInlineSaveRow){gridOptions.afterInlineSaveRow.call($grid,rowid)}var $ntr=$grid.find("tr.jqgrow[id='"+rowid+"']").next("tr");if($ntr.size()>0){var nid=$ntr.attr("id");$grid.jqGrid("resetSelection");$grid.jqGrid("setSelection",nid);setTimeout(function(){var $pager=$(that.gridOptions.pager);$pager.find(".ui-pg-div span.fa-pencil").click()},200)}}else{if(response.type=="failure"||response.type=="error"){Global.notify("error",response.message)}else{Global.notify("error","数据处理异常，请联系管理员")}}}}},rownumbers:!userOptions.treeGrid,beforeRequest:function(){var searchUrl=that.originalUrl;if(searchUrl.indexOf("?")>-1){searchUrl=searchUrl+"&"}else{searchUrl=searchUrl+"?"}var params=that.gridOptions.searchFormParams;if($.isArray(params)){$.each(params,function(i,item){searchUrl=searchUrl+item.name+"="+item.value+"&"})}else{if(typeof params=="object"){for(var key in params){searchUrl=searchUrl+key+"="+params[key]+"&"}}else{searchUrl=searchUrl+params}}if(Config.isDebugEnable()){console.log("Grid searching url: "+searchUrl)}$grid.jqGrid("setGridParam",{url:searchUrl})},loadBeforeSend:function(){if(that.gridOptions.autoInitLoad===false){return false}App.blockUI({target:$grid.closest(".ui-jqgrid"),animate:true,overlayColor:"none"})},loadError:function(xhr){App.unblockUI($grid.closest(".ui-jqgrid"));try{var message="表格数据加载处理失败,请尝试刷新或联系管理员";var response=jQuery.parseJSON(xhr.responseText);if(response.type=="failure"||response.type=="error"){message=response.message}Global.notify("error",message)}catch(e){Global.notify("error",Util.handleAjaxError(xhr),"请求异常")}},subGridBeforeExpand:function(){var $bdiv=$grid.closest(".ui-jqgrid-bdiv");$bdiv.css({height:"auto"})},beforeProcessing:function(data){if(data&&data.content){var cnt=1000;$.each(data.content,function(i,item){if(item.extraAttributes&&item.extraAttributes.dirtyRow){item.id=-(cnt++)}});if(data.totalElements>=(2147473647-10000)){$grid.jqGrid("setGridParam",{recordtext:"{0} - {1}\u3000"})}}},inlineEditing:{keys:true,serializeSaveData:function(data){if(data.oper==="add"){data.id=""}return data},errorfunc:function(rowid,xhr){Global.notify("error",Util.handleAjaxError(xhr),"请求异常")}},loadComplete:function(data){App.unblockUI($grid.closest(".ui-jqgrid"));$grid.jqGrid("setGridParam",{url:that.originalUrl});if(data==undefined){return}if(data.total==undefined&&data.totalElements==undefined){alert("表格数据格式不正确");return}if(data.content){if(data.totalElements>=(2147473647-10000)){$grid.closest(".ui-jqgrid").find(".ui-pg-table td[id^='last_']").addClass("ui-state-disabled");$grid.closest(".ui-jqgrid").find(".ui-pg-table .ui-pg-input").each(function(){$(this).parent().html($(this))})}}if(gridOptions.footerrow){if(gridOptions.footerLocalDataColumn){$.each(gridOptions.footerLocalDataColumn,function(i,n){var sum=$grid.jqGrid("sumColumn",n);var ob=[];ob[n]=sum;$grid.footerData("set",ob)})}else{$.each(gridOptions.colModel,function(i,col){if(!col.footerSum){return}if(col.formatter=="integer"||col.formatter=="currency"||col.formatter=="number"){var sum=$grid.jqGrid("sumColumn",col.name);var ob=[];ob[col.name]=sum;$grid.footerData("set",ob)}})}}if($grid.attr("data-selected")){$grid.jqGrid("setSelection",$grid.attr("data-selected"),false)}if(that.$contextMenu){$grid.find("tr.jqgrow").each(function(){$(this).contextmenu({target:that.$contextMenu,onItem:function(e,item){var idx=$(item).attr("role-idx");that.$contextMenu.find('a[role-idx="'+idx+'"]').click();return true}})})}var _loadComplete=that.userOptions.loadComplete;if(_loadComplete){_loadComplete.call($grid,data)}},onCellSelect:function(rowid,iCol){$grid.jqGrid("setGridParam",{inlineEditing:{focusField:iCol}})},ondblClickRow:function(rowid,iRow,iCol,e){e.stopPropagation();var $pager=$(that.gridOptions.pager);var cm=$grid.jqGrid("getGridParam","colModel")[iCol];if(cm.editable&&gridOptions.editurl){$grid.jqGrid("resetSelection");$grid.jqGrid("setSelection",rowid);$pager.find(".ui-pg-div span.fa-pencil").click()}else{$grid.jqGrid("restoreRow",rowid);$grid.jqGrid("resetSelection");$grid.jqGrid("setSelection",rowid);var $fulledit=$pager.find("i.fa-edit").parent("a");if($fulledit.size()>0){$fulledit.click();return}var $view=$pager.find("i.fa-newspaper-o").parent("a");if($view.size()>0){$view.click();return}}}};var gridOptions=$.extend(true,{},ExtDataGrid.GRID_DEFAULTS,computedOptions,userOptions);if($.isFunction(gridOptions.url)){gridOptions.url=gridOptions.url.call($grid)}if(gridOptions.url==undefined){gridOptions.url=$grid.attr("data-url")}Util.assertNotBlank(gridOptions.url,"Grid options[url] is required.");gridOptions.url=Util.smartParseURL(gridOptions.url);if(gridOptions.editurl){gridOptions.editurl=Util.smartParseURL(gridOptions.editurl);gridOptions.cellurl=Util.smartParseURL(gridOptions.editurl)}this.originalUrl=gridOptions.url;if(gridOptions.pager==undefined||gridOptions.pager===true){var pagerId=$grid.attr("id")+"_pager";$("<div id='"+pagerId+"'/>").insertAfter($grid);gridOptions.pager="#"+pagerId}else{gridOptions.toppager=false}if(BooleanUtil.toBoolean($grid.attr("data-readonly"))){gridOptions.inlineNav.add=false;gridOptions.inlineNav.edit=false;gridOptions.inlineNav.del=false}if(gridOptions.subGridRowExpanded==undefined){if(gridOptions.subGridRowExpandedKey){gridOptions.subGridRowExpanded=function(subgrid_id,row_id){that.initRecursiveSubGrid(subgrid_id,row_id,gridOptions.subGridRowExpandedKey)}}}var colModelNames=[];$.each(gridOptions.colModel,function(i,col){colModelNames.push(col.name)});if($.inArray("id",colModelNames)==-1){gridOptions.colModel.push({label:"流水号",name:"id",width:50,classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true})}if($.inArray("createUserName",colModelNames)==-1){gridOptions.colModel.push({label:"创建者",name:"createUserName",width:50,align:"center",classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true})}if($.inArray("createDate",colModelNames)==-1){gridOptions.colModel.push({label:"创建时间",name:"createDate",formatter:"timestamp",classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true})}if($.inArray("updateUserName",colModelNames)==-1){gridOptions.colModel.push({label:"最后更新者",name:"updateUserName",width:50,align:"center",classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true})}if($.inArray("updateDate",colModelNames)==-1){gridOptions.colModel.push({label:"最后更新时间",name:"updateDate",formatter:"timestamp",classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true})}if($.inArray("display",colModelNames)==-1){gridOptions.colModel.push({label:"标题",name:"display",classes:"hidden-xs",labelClasses:"hidden-xs",hidden:true,search:false,hidedlg:true})}if(gridOptions.subGridRowExpandedKey){if($.inArray("lft",colModelNames)==-1){gridOptions.colModel.push({label:"lft",name:"lft",classes:"hidden-xs",labelClasses:"hidden-xs",width:50,align:"center",hidden:!Config.isDevMode(),search:false,hidedlg:true})}if($.inArray("rgt",colModelNames)==-1){gridOptions.colModel.push({label:"rgt",name:"rgt",classes:"hidden-xs",labelClasses:"hidden-xs",width:50,align:"center",hidden:!Config.isDevMode(),search:false,hidedlg:true})}if($.inArray("depth",colModelNames)==-1){gridOptions.colModel.push({label:"depth",name:"depth",classes:"hidden-xs",labelClasses:"hidden-xs",width:50,align:"center",hidden:!Config.isDevMode(),search:false,hidedlg:true})}}var userTotalWidth=0;var userFrozen=false;var defaultSearchOptions=[];$.each(gridOptions.colModel,function(i,col){if(col.frozen){userFrozen=true}var editDataInitHandlers=[];col.searchoptions=col.searchoptions||{};col.editoptions=col.editoptions||{};if(col.formatter=="percentage"){col=$.extend(true,{width:50,align:"right"},col);col.formatter=function(cellValue,options,rowdata,action){if(cellValue){return Math.round(cellValue*10000)/100+"%"}else{return cellValue}}}if(col.formatter=="currency"){col=$.extend(true,{width:80,align:"right",formatoptions:{decimalSeparator:".",thousandsSeparator:",",decimalPlaces:2,prefix:"",defaultValue:""},searchoptions:{sopt:["eq","ne","ge","le","gt","lt"]}},col)}if(col.stype=="date"||col.sorttype=="date"||col.formatter=="date"||col.formatter=="timestamp"||col.formatter=="shortTimestamp"){col=$.extend(true,{searchoptions:{sopt:["bt","eq","ne","ge","le","gt","lt"],dataInit:function(elem){var $elem=$(elem);$elem.extDateRangePicker({inputIcon:false})}}},col);if(col.formatter=="timestamp"){col=$.extend(true,{width:150,fixed:true,align:"center",formatoptions:{srcformat:"Y-m-d H:i:s",newformat:"Y-m-d H:i:s"},editoptions:{time:true,dataInit:function(elem){$(elem).extDateTimePicker({inputIcon:false})}}},col)}else{if(col.formatter=="shortTimestamp"){col=$.extend(true,{width:150,fixed:true,align:"center",formatoptions:{srcformat:"Y-m-d H:i",newformat:"Y-m-d H:i"},editoptions:{dataInit:function(elem){$(elem).extDateTimePicker({inputIcon:false})}}},col)}else{col=$.extend(true,{width:120,fixed:true,align:"center",formatoptions:{newformat:"Y-m-d"},editoptions:{dataInit:function(elem){$(elem).extDatePicker({inputIcon:false})}}},col)}}col.formatter="date"}if(col.formatter=="integer"){col=$.extend(true,{width:60,align:"center",formatoptions:{defaultValue:"",thousandsSeparator:""},searchoptions:{sopt:["eq","ne","ge","le","gt","lt"]}},col)}if(col.formatter=="number"){col=$.extend(true,{sorttype:col.formatter,edittype:col.formatter,width:60,align:"right",formatoptions:{defaultValue:""},searchoptions:{sopt:["eq","ne","ge","le","gt","lt"]}},col)}if(col.formatter=="checkbox"){col=$.extend(true,{edittype:col.formatter,width:60,align:"center",stype:"select",searchoptions:{value:{"":"","true":"是","false":"否"},sopt:["eq","ne"]},editoptions:{value:"true:false"}},col);editDataInitHandlers.push(function(elem){var $elem=$(elem);$elem.removeClass("form-control")})}if(col.name=="id"){col=$.extend(true,{width:80,align:"center",title:false,searchoptions:{sopt:["eq","ne","ge","le","gt","lt"]},formatter:function(cellValue,options,rowdata,action){if(cellValue&&cellValue.length>10){var len=cellValue.length;var display=cellValue.substring(len-5,len);return"<span data='"+cellValue+"' onclick='$(this).html($(this).attr(\"data\"))'>..."+display+"</span>"}else{return cellValue}},frozen:true},col)}if(col.formatter=="select"){if(typeof col.searchoptions.value==="function"){col.searchoptions.value=col.searchoptions.value.call($grid)}if(col.searchoptions.valueJson){col.searchoptions.value={"":""};var valueJson=col.searchoptions.valueJson;if(typeof valueJson=="string"){valueJson=JSON.parse(valueJson)}for(var key in valueJson){col.searchoptions.value[key]=valueJson[key]}}col=$.extend(true,{edittype:"select",stype:"select",searchoptions:{sopt:["eq","ne"]},editoptions:{selectFilled:function(params){return true},value:$.extend(true,{},col.searchoptions.value,{"":"请选择"})}},col)}if(col.edittype==undefined||col.edittype=="text"){editDataInitHandlers.push(function(elem){var $elem=$(elem);$elem.blur(function(){$elem.val($.trim($elem.val()))})})}if(col.editoptions.updatable==false){editDataInitHandlers.push(function(elem){var $elem=$(elem);var rowdata=that.getSelectedRowdata();if(rowdata&&rowdata.id){$elem.attr("disabled",true);$elem.attr("readonly",true)}else{if(!$elem.attr("placeholder")){$elem.attr("placeholder","创建后不可修改");$elem.attr("title","创建后不可修改")}}})}if(col.hasOwnProperty("searchoptions")){var searchOptions=col.searchoptions;if(searchOptions.hasOwnProperty("defaultValue")&&searchOptions.defaultValue!=""){var field=col.index;if(field==undefined){field=col.name}defaultSearchOptions[defaultSearchOptions.length++]={field:field,op:col.searchoptions.sopt[0],data:searchOptions.defaultValue}}}if(col.index==undefined){if(col.formatter=="date"){col.index=col.name}else{if(col.formatter=="timestamp"){col.index=col.name}else{if(col.formatter=="checkbox"){col.index=col.name+"@Boolean"}else{if(col.formatter=="integer"||col.formatter=="currency"||col.formatter=="number"||col.formatter=="percentage"){col.index=col.name+"@Number"}}}}}var editvalidation=gridOptions.editvalidation;if(editvalidation){var editrules=editvalidation[col.name]||editvalidation[col.index];if(editrules){delete editrules.timestamp;delete editrules.shortTimestamp;delete editrules.date;if(editrules.tooltips&&col.tooltips==undefined){col.label='<span class="glyphicon glyphicon-exclamation-sign tooltipster"  title="'+editrules.tooltips+'"></span>'+col.label;delete editrules.tooltips}col.editrules=$.extend(true,{},editrules,col.editrules)}}col=$.extend(true,{width:200,editoptions:{rows:1,dataInit:function(elem){$.each(editDataInitHandlers,function(i,handler){handler(elem)})}},searchoptions:{clearSearch:true,searchhidden:false,defaultValue:"",buildSelect:function(json){if(json==null){json=data}var html="<select>";html+="<option value=''></option>";for(var key in json){key=key+"";html+=("<option value='"+key+"'>"+json[key]+"</option>")}html+="</select>";return html}}},col);col.searchoptions.sopt=col.searchoptions.sopt||["cn","bw","bn","eq","ne","nc","ew","en"];if(!col.hidden){userTotalWidth+=col.width}gridOptions.colModel[i]=col});if(gridOptions.shrinkToFit==undefined){if(Number(userTotalWidth)>Number($grid.parent().width())){gridOptions.shrinkToFit=false}else{gridOptions.shrinkToFit=true}}var needAutoStretch=false;if($grid.closest(".ui-subgrid").size()==0){if(gridOptions.height==undefined||gridOptions.height=="stretch"){needAutoStretch=true;gridOptions.height=0}}if(gridOptions.filterToolbar){var postData={};var filters={};if(postData.hasOwnProperty("filters")){filters=JSON.parse(postData.filters)}var rules=[];if(filters.hasOwnProperty("rules")){rules=filters.rules}$.each(defaultSearchOptions,function(defaultSearchOptionindex,defaultSearchOption){var ruleExists=false;$.each(rules,function(index,rule){if(defaultSearchOption.field==rule.field){ruleExists=true;return}});if(ruleExists==false){rules.push(defaultSearchOption)}});if(rules.length>0){filters.groupOp="AND";filters.rules=rules;postData._search=true;postData.filters=JSON.stringify(filters)}gridOptions.postData=$.extend(true,postData,gridOptions.postData)}if(Config.isDebugEnable()){console.log("Merged grid options: ");console.log(gridOptions)}this.gridOptions=gridOptions;if(gridOptions.jqPivot){var jqPivot=gridOptions.jqPivot;delete gridOptions.jqPivot;var url=gridOptions.url;gridOptions={multiselect:false,pager:gridOptions.pager,shrinkToFit:false};$grid.jqGrid("jqPivot",url,jqPivot,gridOptions,{reader:"content"});return}else{$grid.jqGrid(gridOptions)}var $labels=$("#gbox_"+$grid.attr("id")+"  .ui-jqgrid-labels");$labels.find("span.tooltipster").tooltipster({contentAsHTML:true,offsetY:5,theme:"tooltipster-punk"});if(gridOptions.filterToolbar){$grid.jqGrid("filterToolbar",gridOptions.filterToolbar);var $rn=$("#jqgh_"+$grid.attr("id")+"_rn");var show='<a href="javascript:;" class="filter-toolbar-show" title="显示快速查询"><span class="fa fa-angle-down"></span></a>';var hide='<a href="javascript:;" class="filter-toolbar-hide" title="隐藏快速查询"><span class="fa fa-angle-up"></span></a>';if($grid.is(".ui-jqgrid-subgrid")||gridOptions.filterToolbar=="hidden"){$rn.html(show);$grid[0].toggleToolbar()}else{$rn.html(hide)}$rn.on("click",".filter-toolbar-show",function(){$rn.html(hide);$grid[0].toggleToolbar()});$rn.on("click",".filter-toolbar-hide",function(){$rn.html(show);$grid[0].toggleToolbar()})}$grid.jqGrid("navGrid",{edit:false,add:false,del:false,refresh:true,search:true,position:"left",cloneToTop:true});if(gridOptions.setGroupHeaders){$grid.jqGrid("setGroupHeaders",$.extend(true,{useColSpanStyle:true},gridOptions.setGroupHeaders))}$grid.bindKeys({onEnter:function(id){if(id==undefined){return}var $tr=$grid.find("tr.jqgrow[id='"+id+"']");if(gridOptions.editurl){if($tr.attr("editable")=="1"){$(gridOptions.pager).find(".ui-pg-div span.fa-floppy-o").click()}else{$(gridOptions.pager).find(".ui-pg-div span.fa-pencil").click()}return false}}});if(gridOptions.pager||gridOptions.toppager){if(gridOptions.inlineNav&&(gridOptions.inlineNav.add||gridOptions.inlineNav.edit||gridOptions.inlineNav.del)){$grid.jqGrid("navSeparatorAdd",undefined,{position:"last"});$grid.jqGrid("inlineNav",gridOptions.inlineNav)}var navButtons=gridOptions.navButtons;if(navButtons==undefined||navButtons==false){navButtons=[]}else{if(!Array.isArray(navButtons)){navButtons=[navButtons]}}if(gridOptions.columnChooser){$grid.jqGrid("showHideColumnMenu");navButtons.push({caption:"设定显示列和顺序",buttonicon:"fa-th-list",onClickButton:function(){var gwdth=$grid.jqGrid("getGridParam","width");$grid.jqGrid("columnChooser",{width:470,done:function(perm){if(perm){this.jqGrid("remapColumns",perm,true);$grid.jqGrid("setGridWidth",gwdth,false)}else{}}})},operationRows:"tool",showOnToolbar:false})}navButtons.push({caption:"收缩显示模式",buttonicon:"fa-list-alt",onClickButton:function(){var gridwidth=$grid.jqGrid("getGridParam","width");$grid.jqGrid("destroyFrozenColumns");$grid.jqGrid("setGridWidth",gridwidth,true)},operationRows:"tool",showOnToolbar:false});if(gridOptions.exportExcelLocal){navButtons.push({caption:"导出当前显示数据",buttonicon:"fa-file-excel-o",onClickButton:function(){Global.confirm("操作确认","确认导出当前显示表格数据为Excel下载文件？",function(){var $grid=that.$element;var ids=$grid.getDataIDs();var colModel=gridOptions.colModel;var html="";for(var i in colModel){var cm=colModel[i];if(cm.hidedlg||cm.hidden||cm.disableExport){continue}var name=cm.label||cm.name;html=html+name+"\t"}html=html+"\n";for(var i=0;i<ids.length;i++){var data=$grid.getRowData(ids[i]);for(var j in colModel){var cm=colModel[j];if(cm.hidedlg||cm.hidden||cm.disableExport){continue}var realData=data[cm.name];var selectValues=null;if(cm.searchoptions&&cm.searchoptions.value){selectValues=cm.searchoptions.value}else{if(cm.editoptions&&cm.editoptions.value){selectValues=cm.editoptions.value}}if(selectValues){realData=selectValues[realData]}if(realData.indexOf("<")>-1&&realData.indexOf(">")>-1){realData=$(realData).text()}if(realData==""){realData=data[cm.name]}if(realData=="null"||realData==null){realData=""}realData=realData.replace(/\&nbsp;/g,"");html=html+realData+"\t"}html=html+"\n"}html=html+"\n";var url=Util.smartParseURL("/admin/util/grid/export");var form=$('<form method="post" target = "_blank" action="'+url+'"></form>').appendTo($("body"));var dataInput=$('<input type="hidden" name="exportDatas"/>').appendTo(form);var fileName=$('<input type="hidden" name="fileName"/>').appendTo(form);fileName.val("export-data.xls");dataInput.val(html);form.submit();form.remove()})},operationRows:"tool",showOnToolbar:false})}if(gridOptions.gridDnD){var gridDnD=$.extend(true,{dropbyname:true,beforedrop:function(event,ui,data){data.id=$(ui.draggable).attr("id");return data},autoid:function(rowdata){return rowdata.id},drop_opts:{activeClass:"ui-state-active",hoverClass:"ui-state-hover",greedy:true},ondrop:function(event,ui,rowdata){var $targetGrid=$("#"+this.id);var $pp=$targetGrid.closest(".ui-subgrid");var ppid="-1";if($pp.size()>0){ppid=$pp.prev(".jqgrow").attr("id")}var rowid=rowdata.id;var postdata={};var editurl=$targetGrid.jqGrid("getGridParam","editurl");if(editurl){postdata.newParentId=ppid;postdata.id=rowid;$targetGrid.ajaxPostURL({url:editurl,success:function(){return true},confirmMsg:false,data:postdata})}}},gridOptions.gridDnD);navButtons.push({caption:"开启拖放移动模式",buttonicon:"fa-arrows",onClickButton:function(){var $allGrid=null;if($grid.closest(".ui-subgrid").size()>0){var $topGrid=$grid.parent().closest(".ui-jqgrid-btable:not(.ui-jqgrid-subgrid)");$allGrid=$topGrid.parent().find(".ui-jqgrid-btable")}else{$allGrid=$grid.parent().find(".ui-jqgrid-btable")}var allGridIds=[];$allGrid.each(function(i,item){allGridIds.push("#"+$(this).attr("id"))});var reverseGridIds=allGridIds.reverse();$.each(reverseGridIds,function(i,id){var connectWithIds=$.map(allGridIds,function(n){return n!=id?n:null});console.log("Grid gridDnD"+id+" connectWith: "+connectWithIds);var $cur=$(id);if(connectWithIds.length>0){var opts=$.extend({connectWith:connectWithIds.join(",")},gridDnD);$cur.jqGrid("gridDnD",opts)}if(!$cur.hasClass("ui-jqgrid-dndtable")){$cur.addClass("ui-jqgrid-dndtable")}})},operationRows:"tool",showOnToolbar:true});navButtons.push({caption:"开启拖放排序模式",buttonicon:"fa-sort",onClickButton:function(){var $allGrid=null;if($grid.closest(".ui-subgrid").size()>0){var $topGrid=$grid.parent().closest(".ui-jqgrid-btable:not(.ui-jqgrid-subgrid)");$allGrid=$topGrid.parent().find(".ui-jqgrid-btable")}else{$allGrid=$grid.parent().find(".ui-jqgrid-btable")}var allGridIds=[];$allGrid.each(function(i,item){allGridIds.push("#"+$(this).attr("id"))});var reverseGridIds=allGridIds.reverse();$.each(reverseGridIds,function(i,id){var $curGrid=$(id);$curGrid.jqGrid("sortableRows",{update:function(event,ui){var postdata={};var $cur=$(ui.item);var curRowId=$cur.attr("id");postdata.id=curRowId;var prevRowId=$cur.prev().attr("id");postdata.sortPrevId=prevRowId?prevRowId:"-1";if(Config.isDebugEnable()){console.log("sort update postdata: "+JSON.stringify(postdata))}var editurl=$curGrid.jqGrid("getGridParam","editurl");if(editurl){$curGrid.ajaxPostURL({url:editurl,success:function(){return true},confirmMsg:false,data:postdata})}}})})},operationRows:"tool",showOnToolbar:true})}if(gridOptions.viewurl){navButtons.push({caption:"查看详情",buttonicon:"fa-newspaper-o",onClickButton:function(rowid){var editcol="TBD";if(gridOptions.editcol){var rowdata=$grid.jqGrid("getRowData",rowid);editcol=rowdata[gridOptions.editcol];if(editcol.indexOf("<")>-1&&editcol.indexOf(">")>-1){editcol=$(editcol).text()}}else{editcol=$grid.find("tr#"+rowid+" > td.jqgrid-rownum").html()}var url=Util.addOrReplaceUrlParameter(gridOptions.viewurl,"id",rowid);that.modalShow(url,"查看："+editcol)},operationRows:"single"})}if(gridOptions.fullediturl){if(gridOptions.addable){navButtons.push({caption:"表单新增数据",buttonicon:"fa-plus-square-o",onClickButton:function(){var url=gridOptions.fullediturl;url=Util.addOrReplaceUrlParameter(url,"_v",that.lastRefreshTimestamp);if(gridOptions.subGridRowExpandedKey){var pid=gridOptions.inlineNav.addParams.addRowParams.extraparam[gridOptions.subGridRowExpandedKey];if(pid){url=Util.addOrReplaceUrlParameter(url,gridOptions.subGridRowExpandedKey,pid)}}that.modalShow(url,"新增")},operationRows:"none",showOnToolbar:true})}navButtons.push({caption:"表单编辑数据",buttonicon:"fa-edit",onClickButton:function(rowid){var editcol="TBD";if(gridOptions.editcol){var rowdata=$grid.jqGrid("getRowData",rowid);editcol=rowdata[gridOptions.editcol];if(editcol.indexOf("<")>-1&&editcol.indexOf(">")>-1){editcol=$(editcol).text()}}else{editcol=$grid.find("tr#"+rowid+" > td.jqgrid-rownum").html()}var url=Util.addOrReplaceUrlParameter(gridOptions.fullediturl,"id",rowid);that.modalShow(url,"编辑："+editcol)},title:"可双击行项进行编辑数据",badge:"双击",operationRows:"single",showOnToolbar:true,showOnDropdown:true})}if(gridOptions.delurl){navButtons.push({caption:"删除选择数据",buttonicon:"fa-trash-o",onClickButton:function(ids){var url=Util.addOrReplaceUrlParameter(gridOptions.delurl,"ids",ids.join(","));$grid.ajaxPostURL({url:url,success:function(response){$.each(ids,function(i,item){var item=$.trim(item);if(response.data&&response.data[item]){var $tr=$grid.find("tr.jqgrow[id='"+item+"']");var msg=response.data[item];$tr.pulsate({color:"#bf1c56",repeat:3})}else{$grid.jqGrid("delRowData",item)}})},confirmMsg:"确认批量删除所选记录吗？"})},title:"勾选并批量删除数据",operationRows:"multiple",showOnToolbar:true,showOnDropdown:true})}var showOnToolbarSeparator=false;$.each(navButtons,function(i,item){item=$.extend({buttonicon:"fa-edit",onClickButton:function($g){},position:"last",cursor:"pointer",operationRows:"none",showOnToolbar:true,showOnDropdown:true},item);if(!item.title){item.title=item.caption}var userOnClickButton=item.onClickButton;item.onClickButton=function(options){if(item.operationRows=="single"){var rowid=that.getOnlyOneSelectedItem(true);if(rowid){userOnClickButton.call(that,rowid,options)}}else{if(item.operationRows=="multiple"){var rowids=that.getAtLeastOneSelectedItem(true,true);if(rowids){userOnClickButton.call(that,rowids,options)}}else{userOnClickButton.call(that,options)}}};navButtons[i]=item;if(item.showOnToolbar){if(showOnToolbarSeparator==false){showOnToolbarSeparator=true;$grid.jqGrid("navSeparatorAdd",undefined,{position:"last"})}if(item.showOnToolbarText){$grid.jqGrid("navButtonAdd",item)}else{$grid.jqGrid("navButtonAdd",$.extend({},item,{caption:false}))}}});$grid.jqGrid("navSeparatorAdd",undefined,{position:"first"});var html=[];html.push('<div class="btn-group btn-group-more-option" style="margin-left: 3px;margin-right: 3px;">');html.push('<button type="button" class="btn btn-xs default dropdown-toggle" data-toggle="dropdown">');html.push('更多操作 <i class="fa fa-angle-down"></i>');html.push("</button>");html.push('<ul class="dropdown dropdown-menu" role="menu" style="position: absolute;overflow-y: visible">');html.push("</ul>");html.push("</div>");$grid.jqGrid("navButtonAdd",{caption:"",buttonicon:"fa-more-option",position:"first",title:"更多操作"});var $gridRoot=$grid.closest("div.ui-jqgrid");var $moreOption=$gridRoot.find(".fa-more-option").parent().parent();$moreOption.replaceWith(html.join(""));var $pagerMoreOption=$gridRoot.find(".ui-jqgrid-pager .btn-group-more-option");$pagerMoreOption.addClass("dropup");var rowSortMapping={none:0,single:1,multiple:2,tool:9};navButtons.sort(function(a,b){return rowSortMapping[a.operationRows]-rowSortMapping[b.operationRows]});var $ul=$gridRoot.find(".btn-group-more-option").find("ul");$.each(navButtons,function(i,item){if(item.showOnDropdown){var html='<i class="fa '+item.buttonicon+'"></i> '+item.caption;if(item.badge){html=html+'<span class="badge badge-info"> '+item.badge+" </span>"}var $li=$('<li data-type="'+item.operationRows+'"><a tabindex="-1" href="javascript:;">'+html+"</a> </li>");$li.children("a").bind("click",function(){item.onClickButton.call($grid)});$li.appendTo($ul)}});var noneCount=$ul.find('li[data-type="none"]').size(),singleCount=$ul.find('li[data-type="single"]').size();var multipleCount=$ul.find('li[data-type="multiple"]').size(),toolCount=$ul.find('li[data-type="tool"]').size();if(noneCount>0&&(singleCount>0||multipleCount>0)){$ul.find('li[data-type="none"]:last').after('<li class="divider"> </li>')}if(singleCount>0&&(multipleCount>0||toolCount>0)){$ul.find('li[data-type="single"]:last').after('<li class="divider"> </li>')}if(multipleCount>0&&toolCount>0){$ul.find('li[data-type="multiple"]:last').after('<li class="divider"> </li>')}if(gridOptions.contextMenu&&$ul.find("li").length>0){var $contextMenu=$('<div class="context-menu" style="display: none"></div>');$ul.clone().appendTo($contextMenu);$("body").append($contextMenu);that.$contextMenu=$contextMenu;$grid.unbind("contextmenu")}if(gridOptions.pager&&$grid.closest(".ui-subgrid").size()>0){$(gridOptions.pager).hide()}}if(needAutoStretch){var gbox=$("#gbox_"+$grid.attr("id"));var decreaseHeight=0;var els="div.ui-jqgrid-titlebar,div.ui-jqgrid-hdiv,div.ui-jqgrid-pager,div.ui-jqgrid-toppager,div.ui-jqgrid-sdiv";gbox.find(els).filter(":visible").each(function(){decreaseHeight+=$(this).outerHeight()});decreaseHeight=decreaseHeight+5;var newheight=$(window).height()-$grid.closest(".ui-jqgrid").offset().top-decreaseHeight;if(newheight<300){newheight=300}$grid.setGridHeight(newheight,true);var $bdiv=$grid.closest(".ui-jqgrid-bdiv");$bdiv.css({"min-height":newheight})}if(userFrozen){$grid.jqGrid("setFrozenColumns")}if(gridOptions.resizable){$grid.jqGrid("gridResize",{minWidth:500,minHeight:100});$grid.closest(".ui-jqgrid").find(".ui-resizable-s").dblclick(function(){var height=$grid.jqGrid("getGridParam","height");$grid.jqGrid("setGridHeight",$grid.height()+17)}).attr("title","鼠标双击可自动扩展显示区域")}App.addResizeHandler(function(){var $grid=that.$element;if($grid.is(":visible")){if(Config.isDebugEnable()){console.log("Resize grid width: "+$grid.attr("id"))}var gridwidth=$grid.jqGrid("getGridParam","width");var newwidth=$grid.closest("div.ui-jqgrid").parent("div").width();if(gridwidth!=newwidth){$grid.jqGrid("setGridWidth",newwidth);var groupHeaders=$grid.jqGrid("getGridParam","groupHeader");if(groupHeaders){$grid.jqGrid("destroyGroupHeader");$grid.jqGrid("setGroupHeaders",groupHeaders)}}}})};ExtDataGrid.prototype.refresh=function(skipReloadGrid){if(skipReloadGrid==undefined||skipReloadGrid==false){this.$element.jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid")}this.lastRefreshTimestamp=new Date().getTime()};ExtDataGrid.prototype.search=function(params){var $grid=this.$element;var gridOptions=this.gridOptions;gridOptions.autoInitLoad=true;gridOptions.searchFormParams=params;$grid.jqGrid("setGridParam",{page:1}).trigger("reloadGrid")};ExtDataGrid.prototype.getOnlyOneSelectedItem=function(required){var $element=this.$element;var checkedRows=[];var selectedRows=$element.jqGrid("getGridParam","selarrrow");if(selectedRows.length>0){for(var x=0;x<selectedRows.length;x++){var isDisabled=$("#jqg_"+$element.attr("id")+"_"+selectedRows[x]).is(":disabled");if(!isDisabled){checkedRows.push(selectedRows[x])}}}else{var singleselect=$element.jqGrid("getGridParam","selrow");if(singleselect){checkedRows.push(singleselect)}}if(checkedRows.length==0){if(required===true){required="请选取操作项目"}if(required){Global.notify("error",required)}return false}else{if(checkedRows.length>1){Global.notify("error","只能选择一条操作项目");return false}return checkedRows[0]}};ExtDataGrid.prototype.getAtLeastOneSelectedItem=function(includeSubGird,required){var $element=this.$element;var checkedRows=[];var selectedRows=$element.jqGrid("getGridParam","selarrrow");if(selectedRows.length>0){for(var x=0;x<selectedRows.length;x++){var isDisabled=$("#jqg_"+$element.attr("id")+"_"+selectedRows[x]).is(":disabled");if(!isDisabled){checkedRows.push(selectedRows[x])}}}else{var singleselect=$element.jqGrid("getGridParam","selrow");if(singleselect){checkedRows.push(singleselect)}}if(includeSubGird){$element.find("table.jqsubgrid").each(function(){var subselectedRows=$(this).jqGrid("getGridParam","selarrrow");for(var x=0;x<subselectedRows.length;x++){var isDisabled=$("#jqg_"+$(this).attr("id")+"_"+selectedRows[x]).is(":disabled");if(!isDisabled){checkedRows.push(subselectedRows[x])}}})}if(checkedRows.length==0){if(required===true){required="请至少选择一条行项目"}if(required){Global.notify("error",required)}return false}else{return checkedRows}};ExtDataGrid.prototype.getSelectedRowdata=function(selrow){var $grid=this.$element;if(!selrow){selrow=$grid.jqGrid("getGridParam","selrow")}console.log(222);console.log($grid);if(selrow){return $grid.jqGrid("getRowData",selrow)}};ExtDataGrid.prototype.getSelectedRowdatas=function(){var $grid=this.$element;var rowdatas=[];var selarrrow=$grid.jqGrid("getGridParam","selarrrow");if(selarrrow){$.each(selarrrow,function(i,rowid){var rowdata=$grid.jqGrid("getRowData",rowid);rowdata.id=rowid;rowdatas.push(rowdata)})}else{var selrow=$grid.jqGrid("getGridParam","selrow");if(selrow){var rowdata=$grid.jqGrid("getRowData",selrow);rowdata.id=selrow;rowdatas.push(rowdata)}}return rowdatas};ExtDataGrid.prototype.sumColumn=function(colName,decimalPlaces){var $grid=this.$element;if(decimalPlaces==undefined){decimalPlaces=2}var nData=$grid.jqGrid("getCol",colName,false,"sum");var nDecimal=Math.pow(10,decimalPlaces);return Math.round(nData*nDecimal)/nDecimal};ExtDataGrid.prototype.initRecursiveSubGrid=function(subgridDivId,rowid,parent){var $subTable=$("<table class='ui-jqgrid-subgrid'/>").appendTo($("#"+subgridDivId));var $parentGrid=$subTable.closest("table.ui-jqgrid-btable");var parentGridOptions=$.extend(true,{},$parentGrid.data("gridOptions"),{autoInitLoad:true,gridDnD:false});parentGridOptions.url=Util.addOrReplaceUrlParameter(parentGridOptions.url,"search[EQ_"+parent+"]",rowid);if(parentGridOptions.fullediturl){parentGridOptions.fullediturl=Util.addOrReplaceUrlParameter(parentGridOptions.fullediturl,parent,rowid)}parentGridOptions.inlineNav=$.extend(true,{addParams:{addRowParams:{extraparam:{}}}},parentGridOptions.inlineNav);parentGridOptions.inlineNav.addParams.addRowParams.extraparam[parent]=rowid;parentGridOptions.parent=parent;$subTable.extDataGrid({gridOptions:parentGridOptions})};ExtDataGrid.prototype.initSubGrid=function(subgridDivId,rowid,options){var $subTable=$("<table data-grid='table' class='ui-jqgrid-subgrid'/>").appendTo($("#"+subgridDivId));if(options.searchFormParams==undefined){options.searchFormParams=this.gridOptions.searchFormParams}$subTable.extDataGrid({gridOptions:options})};ExtDataGrid.prototype.modalShow=function(url,title){var that=this;url=Util.addOrReplaceUrlParameter(url,"_v",that.lastRefreshTimestamp);that.$element.extAjaxBootstrapModal("show",{dataGridId:that.$element.attr("id"),url:url,title:title})};function Plugin(option){if(typeof option==="string"){var $this=$(this);var data=$this.data("ExtDataGrid");var fn=data[option];if(!fn){throw ("No such method: "+option)}return fn.apply(data,$.makeArray(arguments).slice(1))}return this.each(function(){var $this=$(this);var data=$this.data("ExtDataGrid");var options=typeof option=="object"&&option;if(!data){$this.data("ExtDataGrid",(data=new ExtDataGrid(this,options)))}})}var old=$.fn.extDataGrid;$.fn.extDataGrid=Plugin;$.fn.extDataGrid.Constructor=ExtDataGrid;$.fn.extDataGrid.noConflict=function(){$.fn.extDataGrid=old;return this};jQuery(document).ready(function(){$.extend($.ui.multiselect,{locale:{addAll:"全部添加",removeAll:"全部移除",itemsCount:"已选择项目列表"}});$.extend(true,$.jgrid.guiStyles,{bootstrap:{dialog:{document:"modal-dialog-skip"},pager:{pagerSelect:"select2-ignore"},filterToolbar:{dataField:"select2-ignore"}}});$.extend($.jgrid.search,{multipleSearch:true,multipleGroup:true,width:600,jqModal:true,searchOperators:true,stringResult:true,searchOnEnter:true,defaultSearch:"bw",operandTitle:"点击选择查询方式",odata:[{oper:"eq",text:"等于\u3000\u3000"},{oper:"ne",text:"不等\u3000\u3000"},{oper:"lt",text:"小于\u3000\u3000"},{oper:"le",text:"小于等于"},{oper:"gt",text:"大于\u3000\u3000"},{oper:"ge",text:"大于等于"},{oper:"bw",text:"开始于"},{oper:"bn",text:"不开始于"},{oper:"in",text:"属于\u3000\u3000"},{oper:"ni",text:"不属于"},{oper:"ew",text:"结束于"},{oper:"en",text:"不结束于"},{oper:"cn",text:"包含\u3000\u3000"},{oper:"nc",text:"不包含"},{oper:"nu",text:"不存在"},{oper:"nn",text:"存在"},{oper:"bt",text:"介于"}],operands:{eq:"=",ne:"!",lt:"<",le:"<=",gt:">",ge:">=",bw:"^",bn:"!^","in":"=",ni:"!=",ew:"|",en:"!@",cn:"~",nc:"!~",nu:"#",nn:"!#",bt:"~~"}})});Global.addComponent({name:"ExtDataGrid",plugin:Plugin,runPoint:Global.Component_Run_Point.AfterAjaxPageShow,expr:'table[data-toggle="grid"]',order:1000})}(jQuery);