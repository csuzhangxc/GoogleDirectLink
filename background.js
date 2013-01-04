// GoogleHelper
// Copyright (c) 2012 csuzhangxc. All rights reserved.

// 默认禁用扩展工具按钮
chrome.browserAction.disable();


// 扩展工具图标被点击
function iconClicked(tab) {
	// JS注入
	chrome.tabs.executeScript(null,{code:"\
		var results = document.getElementsByClassName('l');\
	    for(var i = 0; i < results.length; ++i) {\
	    	if (results[i].href.indexOf('www.google') > -1\
	    		&& results[i].href.indexOf('q=') > -1) {\
		        var start = results[i].href.indexOf('&url=http')+5;\
		        var stop = results[i].href.indexOf('&ei=');\
		        var encodedURL = results[i].href.substring(start, stop);\
		        var decodedURL = unescape(encodedURL);\
		        results[i].href = decodedURL;\
	        }\
	        results[i].removeAttribute('onmousedown');\
		}\
	"});
	var details = {'title':'已点击'};
	chrome.browserAction.setTitle(details);
	chrome.browserAction.disable();
}


// 检测是否为Google搜索结果页URL
function checkForValidUrl(tab) {
    // 是Google搜索结果页URL  
    if (tab.url.indexOf('www.google') > -1
        && tab.url.indexOf('q=') > -1) {
		// 启用扩展工具按钮
		chrome.browserAction.enable();
		var details = {'title':'请点击'};
		chrome.browserAction.setTitle(details);
    } else {
	    chrome.browserAction.disable();
		var details = {'title':'非Google搜索结果页'};
		chrome.browserAction.setTitle(details);
	}
}

// tab更新
function tabUpdated(tabId, changeInfo, tab) {
    chrome.tabs.get(tabId, checkForValidUrl);
}
// 活动tab改变
function activeTabChanged(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, checkForValidUrl);
}

// 监听tab更新
chrome.tabs.onUpdated.addListener(tabUpdated);
// 监听活动Tab改变
chrome.tabs.onActivated.addListener(activeTabChanged);
// 监听扩展工具图标点击
chrome.browserAction.onClicked.addListener(iconClicked);