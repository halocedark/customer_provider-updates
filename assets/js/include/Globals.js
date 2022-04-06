window.$ = window.jQuery = require('jquery');
const fs = require('fs');
const ROOTPATH = require('electron-root-path');
const path = require('path');
const uuid = require('uuid');
var macaddress = require('macaddress');
const Papa = require('papaparse');
const readXlsxFile = require('read-excel-file');
const ipcIndexRenderer = require('electron').ipcRenderer;

var MAIN_CONTENT_CONTAINER =  $('#MainContentContainer');
var SIDE_NAV_CONTAINER = $('#sideNavbarContainer');

var APP_NAME = 'Customer Provider';
var APP_URL = 'https://holoola-z.com/projects/CustomerProvider/';
var API_END_POINT = APP_URL+'api/';
var APP_ICON = 'assets/img/logo/logo.png';
var APP_ROOT_PATH = ROOTPATH.rootPath+'/';
var APP_DIR_NAME = __dirname+'/';

const SETTINGS_FILE = 'settings';
const DISPLAY_LANG_FILE = APP_ROOT_PATH+'langs/display-lang.json';

var FUI_DISPLAY_LANG = undefined;

var AUTO_CHECKER = undefined;

let getPage;
let sendGetRequest;
let sendAPIPostRequest;
let sendAPIFormDataRequest;
let TopLoader;
let imageToDataURL;
let extractFileExtension;
let setOptionSelected;
let setupAPISettings;
let loadIniSettings;
let loadIniSettingsSync;
let setConnectionHostname;
let getConnectionHostname;
let testServerConnection;
let saveUserConfig;
let deleteFile;
let getUserConfig;
let isConfigExists;
let setContainersDisabled;
let randomRange;
let loadFile;
let getMacAddress;
let setUIDisplayLang;
let loadDisplayLanguage;
let CreateToast;
let parseCSV;
let parseXLSX;
let getAllCustomers;
let searchCustomers;
let addCustomersToBlackList;
let getAllBlacklistedCustomers;
let searchBlacklistedCustomers;
let TopProgressBar;


$(function()
{

// top progress bar
TopProgressBar = (options) => 
{
	var topProgressBarContainer = $('#topProgressBarContainer');
	var closeBTN = topProgressBarContainer.find('#closeBTN');
	var titleElement = topProgressBarContainer.find('#titleElement');
	var versionElement = topProgressBarContainer.find('#versionElement');
	var progressElement = topProgressBarContainer.find('#progressElement');

	// display
	show();
	// set title
	titleElement.text(options.title);
	// set version
	versionElement.text(options.version);
	// set progress
	progressElement.find('.progress-bar').css('width', options.progress.percent.toFixed(0)+'%')
	.text(options.progress.percent.toFixed(2)+'%');
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		forceHide();
	});
	// show
	function show()
	{
		if ( !topProgressBarContainer.hasClass('active') )
			topProgressBarContainer.addClass('active');
	}
	// hide
	function hide()
	{
		topProgressBarContainer.removeClass('active');
	}
	// Force Hide dialog
	function forceHide()
	{
		topProgressBarContainer.css('display', 'none');
	}
}
// search Blacklisted Customers
searchBlacklistedCustomers = (SearchObject) =>
{
	var url = API_END_POINT+'Customers/searchBlacklisted';

	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get All Blacklisted Customers
getAllBlacklistedCustomers = () =>
{
	var url = API_END_POINT+'Customers/listBlacklisted';
	var data = {};
	return sendAPIPostRequest(url, data);
}
// add Customers To BlackList
addCustomersToBlackList = (CustomerObjectList) =>
{
	var url = API_END_POINT+'Customers/addListToBlackList';

	var data = {
		CustomerObjectList: CustomerObjectList
	};

	return sendAPIPostRequest(url, data);
}
// get all customers
getAllCustomers = () =>
{
	var url = API_END_POINT+'Customers/list';
	var userConfig = getUserConfig();
	var providerState = '';
	if ( userConfig != null )
	{
		if ( userConfig.providerState != null )
			providerState = userConfig.providerState;
	}
	var data = {
		providerState: providerState
	};

	return sendAPIPostRequest(url, data);
}
// search customers
searchCustomers = (SearchObject) =>
{
	var url = API_END_POINT+'Customers/search';

	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// parse xlsx
parseXLSX = (xlsxFile, CALLBACK) =>
{
	readXlsxFile(xlsxFile).then(data =>
	{
		CALLBACK(data);
	});
}
// parse csv
parseCSV = (csvFile, CALLBACK) =>
{
	var config = {
		download: false,
		encoding: 'utf-8',
		complete: function(results)
		{
			CALLBACK(results);
		},
		error: function(error)
		{
			if ( error )
			{
				console.log(error);
			}
		}
	};
	Papa.parse(csvFile, config);
}
// Unique id
uniqid = () =>
{
	return uuid.v4();
}
// Toast
CreateToast = (title = '', body = '', time = 'À présent', delay = 10000) =>
{
	var toastContainer = $('#toastContainer');

	// Create toast
	var tclass = uniqid();
	var toastHTML = `<div class="${tclass} toast" role="alert" aria-live="polite" aria-atomic="true" data-delay="${delay}">
						<div class="toast-header">
							<img src="assets/img/utils/notify.png" style="width: 15px; height:15px;" class="rounded me-2" alt="...">
							<strong class="me-auto">${title}</strong>
							<small class="text-muted">${time}</small>
							<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
						</div>
						<div class="toast-body" style="font-weight: 300;">
							${body}
						</div>
					</div>`;
	toastContainer.append(toastHTML);
	// Get list of toasts
	var toastEl = toastContainer.find('.'+tclass)[0];
	var toast = new bootstrap.Toast(toastEl, 'show');
	// Delete all toasts when finished hiding
	//for (var i = 0; i < toastList.length; i++) 
	//{
		//var toast = toastList[i];
		//toast._config.autohide = false;
		toast._config.delay = $(toast._element).data('delay');
		toast.show();
		toast._element.addEventListener('hidden.bs.toast', () =>
		{
			$(toast._element).remove();
		});
		setTimeout(() => { $(toast._element).remove(); }, toast._config.delay);
	//}
}
// set ui display lang
setUIDisplayLang = (lang) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var UI_Settings = {
		DISPLAY_LANG: lang
	};

	return fini.write(SETTINGS_FILE, UI_Settings, 'UI_Settings');
}
// Load display language
loadDisplayLanguage = () =>
{
	if ( fs.existsSync(DISPLAY_LANG_FILE) )
	{
		var data = fs.readFileSync(DISPLAY_LANG_FILE).toString('utf-8');
		FUI_DISPLAY_LANG = JSON.parse(data);
	}
}
// get mac address
getMacAddress = () =>
{
	return macaddress.one();
}
// load file
loadFile = (filepath, CALLBACK) =>
{
	if ( !fs.existsSync(filepath) )
		return '';

	fs.readFile(filepath, 'utf8', (error, data) =>
	{
		if ( error )
		{
			console.log(error);
			return;
		}
		CALLBACK(data);
	});
}
// Print file to pdf
printFileToPdf = (filepath = '', textDir = 'rtr') =>
{
	loadFile(filepath, filedata =>
	{
		var printWindow = window.open('', '', `width=${ $(window).width() }, height=${ $(window).height() }`);
	    // open the window
	    printWindow.document.open();
	    var domHTML = document.head.outerHTML;
	    domHTML+= `<body style="padding: 1em 2em;" dir="${textDir}">${filedata}</body>`;
		printWindow.document.write( domHTML );
		var winDomElement = $(printWindow.document);
		printWindow.document.close();
		printWindow.focus();
		printWindow.onload = (event) => 
		{
		  	printWindow.print();
	        printWindow.close();
		};
		/*
		setTimeout(function() {
	        printWindow.print();
	        printWindow.close();
	    }, 2000);
	    */
	})
	
}
// Print to pdf
printHTMLToPdf = (printableElement = '', textDir = 'ltr') =>
{
	var printWindow = window.open('', '', `width=${ $(window).width() }, height=${ $(window).height() }`);
	// open the window
	printWindow.document.open();
	var domHTML = document.head.outerHTML;
	domHTML+= `<body style="padding: 1em 2em;" dir="${textDir}">${printableElement}</body>`;
	printWindow.document.write( domHTML );
	var winDomElement = $(printWindow.document);
	printWindow.document.close();
	printWindow.focus();
	printWindow.onload = (event) => 
	{
	  	printWindow.print();
        printWindow.close();
	};
	/*
	setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 2000);
    */
}
// Random range
randomRange = (min, max) => 
{ 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// Set containers disabled
setContainersDisabled = (disabled = false) =>
{
	if ( disabled )
	{
		MAIN_CONTENT_CONTAINER.addClass('disabled');
		SIDE_NAV_CONTAINER.addClass('disabled');
	}
	else
	{
		MAIN_CONTENT_CONTAINER.removeClass('disabled');
		SIDE_NAV_CONTAINER.removeClass('disabled');
	}
}
//Save user data
saveUserConfig = (object, CALLBACK) =>
{
	data = JSON.stringify(object);
	fs.writeFile(ROOTPATH.rootPath+'/config.json', data, (error) => 
	{
		CALLBACK(error);
	});
}
// Delete file
deleteFile = (file, CALLBACK) =>
{
	if (fs.existsSync(file)) 
	{
		fs.unlink(file, (error) =>
		{
			CALLBACK(error);
		});
  	}
}
// Get user data
getUserConfig = () =>
{
	if ( !isConfigExists() )
		return null;
	config = fs.readFileSync(APP_ROOT_PATH+'config.json', 'utf-8');
	json = JSON.parse(config);
	return json;
}
// Check config file exists
isConfigExists = () =>
{
	exists = false;
	if ( fs.existsSync(APP_ROOT_PATH+'config.json') )
		exists = true;

	return exists;
}
// Test server connection
testServerConnection = () =>
{
	url = API_END_POINT+'ServerInfo';
	data = {};
	return new Promise((resolve, reject) =>
	{
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			success: function(response)
			{
				if ( response.code == 404 )
				{
					reject(response);
					return;
				}
				resolve(response);
			},
			error: function( jqXHR, textStatus, errorThrown)
			{
				if ( textStatus == 'error' )
				{
					reject(errorThrown);
				}
			}
		});
	});
}
// Get connection hostname
getConnectionHostname = () =>
{
	var settings = loadIniSettingsSync();

	if ( !settings )
		return 'localhost';

	if ( settings.Server_Settings == null )
		return 'localhost';

	return settings.Server_Settings.HOSTNAME;

}
// Set connection hostname
setConnectionHostname = (hostname) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var Server_Settings = {
		HOSTNAME: $.trim(hostname)
	};

	fini.writeSync(SETTINGS_FILE, Server_Settings, 'Server_Settings');
	setupAPISettings();
}
// Setup API Settings
setupAPISettings = () =>
{
	if ( fs.existsSync(APP_ROOT_PATH+SETTINGS_FILE+'.ini') )
	{
		var settings = loadIniSettingsSync();
		if ( settings )
		{
			if ( settings.Server_Settings != null )
			{
				APP_URL = 'http://'+settings.Server_Settings.HOSTNAME+'/ParamedicalSchoolAPI/';
				API_END_POINT = APP_URL+'api/';
			}
		}
	}
}
// Load ini settings
loadIniSettings = (CALLBACK) =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	fini.read(SETTINGS_FILE).then(data =>
	{
		CALLBACK(data);
	});
}
// Load ini settings sync
loadIniSettingsSync = () =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	return fini.readSync(SETTINGS_FILE);
}
// Set setect option selected
setOptionSelected = (selectElement, val, triggerEvent = false) =>
{
	selectElement.find('option').each((k, v) =>
	{
		var option = $(v);
		// Remove selection
		option.removeAttr('selected', '');
		if ( val == option.val() )
		{
			option.attr('selected', 'selected');
			return;
		}
	});
	// Trigger event
	if (triggerEvent)
		selectElement.trigger('change');
}
// Extract file extension
extractFileExtension = (filename) =>
{
	return path.extname(filename).replace('.', '');
}
// Image to data url
imageToDataURL = (File) =>
{
	return new Promise((resolve, reject) =>
	{
		var reader = new FileReader();

		reader.onload = () =>
		{
			resolve( reader.result );
		};

		if ( File == null )
		{
			reject('Image File is not specified');
			return;
		}

		reader.readAsDataURL(File);
	});
}
// Get page
getPage = (page) =>
{
	var promise = new Promise((resolve, reject) =>
	{
		sendGetRequest(page, response =>
		{
			if ( response.length == 0 )
			{
				reject('Error empty response');
				return;
			}
			resolve(response);
		});
	});

	return promise;
}
// Send Get Request
sendGetRequest = (url, CALLBACK) =>
{
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response)
		{
			CALLBACK(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				
			}
		}
	});
}
// Send Post Request
sendAPIPostRequest = (url, data) =>
{
	data['lang'] = FUI_DISPLAY_LANG.lang;
	var request = $.ajax({
		url: url,
		type: 'POST',
		data: data,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				
			}
		}
	});

	return request;
}
// Send formdata Post Request
sendAPIFormDataRequest = (url, formData) =>
{
	formData.append('lang', FUI_DISPLAY_LANG.lang);
	var request = $.ajax({
		url: url,
		type: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				
			}
		}
	});

	return request;
}
// Top loader
TopLoader = (text, visible = true) =>
{
	var sideNavLoader = $('#topLoader');

	sideNavLoader.find('#text').text(text);
	if ( visible )
	{
		sideNavLoader.css('display', 'block');
	}
	else
	{
		sideNavLoader.css('display', 'none');
	}
}
// Call globally
loadDisplayLanguage();

});




