$(function()
{


// Setup navbar
function setupNavbar()
{
	var nbNavMenu = SIDE_NAV_CONTAINER.find('#nbNavMenu');

	// Click on nav
	nbNavMenu.off('click');
	nbNavMenu.on('click', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		if ( target.data('role') == 'NAV_LINK' )
		{
			var href = target.attr('href');

			var page = APP_DIR_NAME+href;
			if ( href.length == 0 || href == '#' )
				return;

			getPage(page).then(response =>
			{
				MAIN_CONTENT_CONTAINER.html(response);
				// Re assign events
				rebindEvents();
				// Set navlink active
				nbNavMenu.find('[data-role="NAV_LINK"]').removeClass('active');
				target.addClass('active');
			});
		}
		else if ( target.data('role') == 'LOGOUT_NAV_LINK' )
		{
			PromptConfirmDialog().then(c =>
			{
				deleteFile(APP_ROOT_PATH+'config.json', () =>
				{
					window.location.href = APP_DIR_NAME+target.attr('href');
				});	
			});
		}
		else
			return;
	});
}
// setup login sessions
function setupLoginSessions()
{
	var loginSessionsContainer = $('#loginSessionsContainer');
	if ( loginSessionsContainer[0] == undefined )
		return;

	var pagination = loginSessionsContainer.find('#pagination');
	var deleteSelectedBTN = loginSessionsContainer.find('#deleteSelectedBTN');
	var searchInput = loginSessionsContainer.find('#searchInput');
	var tableElement = loginSessionsContainer.find('#tableElement');
	var selectAllBTN = tableElement.find('#selectAllBTN');

	// select all
	selectAllBTN.off('click');
	selectAllBTN.on('click', e =>
	{
		var checks = tableElement.find('[data-role="CHECK"]');
		checks.trigger('click');
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// display loader
			TopLoader('حذف جلسات الدخول...');
			deleteLoginSessions( getSelectedRows() ).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				//
				displayAllSessions();
			});	
		});
		
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		searchLoginSessions(searchInput.val()).then(response =>
		{
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-deviceid="${v.deviceId}">
							</td>
							<td>${v.providerName}</td>
							<td>${v.providerState}</td>
							<td>${v.deviceName}</td>
							<td>${v.deviceDate} ${v.deviceTime}</td>
						</tr>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement.find('tbody'), options);
		});
	});
	// display sessions
	displayAllSessions();
	function displayAllSessions()
	{
		// display loader
		TopLoader("جلب جلسات تسجيل الدخول....");
		getAllLoginSessions().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-deviceid="${v.deviceId}">
							</td>
							<td>${v.providerName}</td>
							<td>${v.providerState}</td>
							<td>${v.deviceName}</td>
							<td>${v.deviceDate} ${v.deviceTime}</td>
						</tr>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement.find('tbody'), options);
		});
	}
	// get selected items
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ deviceId: check.data('deviceid') });
			}
		}

		return list;
	}
}
// setup waiting approvals
function setupWaitingApprovals()
{
	var waitingApprovalsContainer = $('#waitingApprovalsContainer');
	if ( waitingApprovalsContainer[0] == undefined )
		return;

	var pagination = waitingApprovalsContainer.find('#pagination');
	var deleteSelectedBTN = waitingApprovalsContainer.find('#deleteSelectedBTN');
	var approveSelectedBTN = waitingApprovalsContainer.find('#approveSelectedBTN');
	var searchInput = waitingApprovalsContainer.find('#searchInput');
	var tableElement = waitingApprovalsContainer.find('#tableElement');
	var selectAllBTN = tableElement.find('#selectAllBTN');

	// select all
	selectAllBTN.off('click');
	selectAllBTN.on('click', e =>
	{
		var checks = tableElement.find('[data-role="CHECK"]');
		checks.trigger('click');
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// display loader
			TopLoader('حذف الحسابات...');
			deleteProviders( getSelectedRows() ).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				//
				displayAllUnapproved();
			});	
		});
		
	});
	// approve
	approveSelectedBTN.off('click');
	approveSelectedBTN.on('click', e =>
	{
		TopLoader('جاري قبول الحسابات...');
		approveProviders( getSelectedRows() ).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				DialogBox('خطأ', response.message);
				return;
			}

			//
			displayAllUnapproved();
		});
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		searchUnapprovedProviders(searchInput.val()).then(response =>
		{
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</td>
							<td>${v.providerName}</td>
							<td>${v.providerState}</td>
							<td>${v.providerDate} ${v.providerTime}</td>
						</tr>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement.find('tbody'), options);
		});
	});
	// display all unapproved
	displayAllUnapproved();
	function displayAllUnapproved()
	{
		// display loader
		TopLoader("جلب الحسابات الجديدة....");
		getAllUnapprovedProviders().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</td>
							<td>${v.providerName}</td>
							<td>${v.providerPhone}</td>
							<td>${v.providerState}</td>
							<td>${v.providerCity}</td>
							<td>${v.providerAddress}</td>
							<td>${v.providerDate} ${v.providerTime}</td>
						</tr>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement.find('tbody'), options);
		});
	}
	// get selected items
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ providerId: check.data('providerid') });
			}
		}

		return list;
	}
}
// setup provider trial
function setupProviderTrial()
{
	var providerTrialsContainer = $('#providerTrialsContainer');
	if ( providerTrialsContainer[0] == undefined )
		return;

	var pagination = providerTrialsContainer.find('#pagination');
	var searchInput = providerTrialsContainer.find('#searchInput');
	var tableElement = providerTrialsContainer.find('#tableElement');
	var addForm = providerTrialsContainer.find('#addForm');

	var pagination2 = providerTrialsContainer.find('#pagination2');
	var deleteSelectedBTN = providerTrialsContainer.find('#deleteSelectedBTN');
	var searchInput2 = providerTrialsContainer.find('#searchInput2');
	var tableElement2 = providerTrialsContainer.find('#tableElement2');

	// add trial
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();

		var target = addForm;
		var args = {
			list: getSelectedProviders(),
			trialEnd: target.find('#trialStartInput').val()
		};
		// display loader
		TopLoader('تسجيل الفترات التجريبية...');
		addProvidersTrials( args ).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				DialogBox('خطأ', response.message);
				return;
			}

			DialogBox('ملحوظة', response.message);
			//
			displayAllTrials();
		});
	});
	// delete trials
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// display loader
			TopLoader('حذف الفترات التجريبية...');
			deleteProvidersTrials( getSelectedProviders() ).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				//
				displayAllTrials();
			});	
		});
		
	});
	// search providers
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		searchProviders(searchInput.val()).then(response =>
		{
			// clear html
			tableElement.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<li class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</li>
							<li class="td">${v.providerName}</li>
							<li class="td">${v.providerPhone}</li>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 5
			};

			new SmoothPagination(pagination, tableElement.find('.tbody'), options);
		});
	});
	// search providers trials
	searchInput2.off('keyup');
	searchInput2.on('keyup', e =>
	{
		searchProvidersTrials(searchInput2.val()).then(response =>
		{
			// clear html
			tableElement2.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<li class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</li>
							<li class="td">${v.providerName}</li>
							<li class="td">${v.providerPhone}</li>
							<li class="td">${v.trialEnd}</li>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement2.find('.tbody'), options);
		});
	});
	// display all Providers
	displayAllProviders();
	function displayAllProviders()
	{
		// display loader
		TopLoader('جلب الحسابات...');
		getAllProviders().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// display all trials
			displayAllTrials();
			// clear html
			tableElement.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<li class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</li>
							<li class="td">${v.providerName}</li>
							<li class="td">${v.providerPhone}</li>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 5
			};

			new SmoothPagination(pagination, tableElement.find('.tbody'), options);
		});
	}
	// display all trials
	function displayAllTrials()
	{
		// display loader
		TopLoader('جلب الحسابات التي لها فترات تجريبية...');
		getAllProviderTrials().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement2.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<li class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-providerid="${v.providerId}">
							</li>
							<li class="td">${v.providerName}</li>
							<li class="td">${v.providerPhone}</li>
							<li class="td">${v.trialEnd}</li>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination(pagination, tableElement2.find('.tbody'), options);
		});
	}
	// get selected providers
	function getSelectedProviders()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ providerId: check.data('providerid') });
			}
		}

		return list;
	}
	// get selected providers trials
	function getSelectedProvidersTrials()
	{
		var list = [];
		var checks = tableElement2.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ providerId: check.data('providerid') });
			}
		}

		return list;
	}
}
// setup Import Transactions
function setupImportTransactions()
{
	var importTransactionsContainer = $('#importTransactionsContainer');
	if ( importTransactionsContainer[0] == undefined )
		return;

	var addForm = importTransactionsContainer.find('#addForm');
	var pagination = importTransactionsContainer.find('#pagination');
	var deleteSelectedBTN = importTransactionsContainer.find('#deleteSelectedBTN');
	var searchInput = importTransactionsContainer.find('#searchInput');
	var tableElement = importTransactionsContainer.find('#tableElement');
	var selectAllBTN = tableElement.find('#selectAllBTN');

	var EXCEL_DATA = {
		cols: [],
		rows: [],
		json: []
	};
	// add
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);

		if ( addForm.find('#csvFileInput')[0].files.length == 0 )
			return;

		parseXLSX(addForm.find('#csvFileInput')[0].files[0], results =>
		{
			EXCEL_DATA = {
				cols: [],
				rows: [],
				json: []
			};
			var data = results;
			// Filter Columns
			EXCEL_DATA.cols = data[0];
			// Filder Rows
			for (var i = 1; i < data.length; i++) 
			{
				EXCEL_DATA.rows.push(data[i]);
			}
			var resultsArr = [];
			// Make json
			for (var i = 0; i < EXCEL_DATA.rows.length; i++) 
			{
				var row = EXCEL_DATA.rows[i];
				var jsonObj = {};
				for (var j = 0; j < EXCEL_DATA.cols.length; j++) 
				{
					var colName = EXCEL_DATA.cols[j];
					jsonObj[colName] = row[j];
				}
				resultsArr.push( jsonObj );
			}
			EXCEL_DATA.json = resultsArr;
			// display loader
			TopLoader('استيراد المعاملات...');
			addCustomers(EXCEL_DATA.json).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				DialogBox('ملحوظة', response.message+'<p class="mt-1">'+response.error+'</p>');

				// 
				displayCustomers();
			});
		});
	});
	// select all
	selectAllBTN.off('click');
	selectAllBTN.on('click', e =>
	{
		var checks = tableElement.find('[data-role="CHECK"]');
		checks.trigger('click');
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// display loader
			TopLoader('حذف المعاملات...');
			deleteCustomers( getSelectedRows() ).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				//
				displayCustomers();
			});	
		});
		
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		var SearchObject = {
			query: searchInput.val()
		};
		searchCustomers(SearchObject).then(response =>
		{
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
							</td>
							<td>${v.customerName}</td>
							<td>${v.customerCCP}</td>
							<td>${v.customerDateBirth}</td>
							<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
							<td>${v.providerState}</td>
							<td>${v.dealDate} ${v.dealTime}</td>
						</tr>PAG_SEP`;		
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	});
	// dsiplay customers
	displayCustomers();
	function displayCustomers()
	{
		// display loader
		TopLoader("جلب المعاملات...");
		getAllCustomers().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
							</td>
							<td>${v.customerName}</td>
							<td>${v.customerCCP}</td>
							<td>${v.customerDateBirth}</td>
							<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
							<td>${v.providerState}</td>
							<td>${v.dealDate} ${v.dealTime}</td>
						</tr>PAG_SEP`;		
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	}
	// get selected items
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ customerId: check.data('customerid') });
			}
		}

		return list;
	}
}
// setup Import Blacklists
function setupImportBlackLists()
{
	var importBlacklistContainer = $('#importBlacklistContainer');
	if ( importBlacklistContainer[0] == undefined )
		return;

	var addForm = importBlacklistContainer.find('#addForm');
	var pagination = importBlacklistContainer.find('#pagination');
	var deleteSelectedBTN = importBlacklistContainer.find('#deleteSelectedBTN');
	var searchInput = importBlacklistContainer.find('#searchInput');
	var tableElement = importBlacklistContainer.find('#tableElement');
	var selectAllBTN = tableElement.find('#selectAllBTN');

	var EXCEL_DATA = {
		cols: [],
		rows: [],
		json: []
	};
	// add
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);

		if ( addForm.find('#csvFileInput')[0].files.length == 0 )
			return;

		parseXLSX(addForm.find('#csvFileInput')[0].files[0], results =>
		{
			EXCEL_DATA = {
				cols: [],
				rows: [],
				json: []
			};
			var data = results;
			// Filter Columns
			EXCEL_DATA.cols = data[0];
			// Filder Rows
			for (var i = 1; i < data.length; i++) 
			{
				EXCEL_DATA.rows.push(data[i]);
			}
			var resultsArr = [];
			// Make json
			for (var i = 0; i < EXCEL_DATA.rows.length; i++) 
			{
				var row = EXCEL_DATA.rows[i];
				var jsonObj = {};
				for (var j = 0; j < EXCEL_DATA.cols.length; j++) 
				{
					var colName = EXCEL_DATA.cols[j];
					jsonObj[colName] = row[j];
				}
				resultsArr.push( jsonObj );
			}
			EXCEL_DATA.json = resultsArr;
			// display loader
			TopLoader('استيراد المعاملات...');
			addCustomersToBlackList(EXCEL_DATA.json).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				DialogBox('ملحوظة', response.message+'<p class="mt-1">'+response.error+'</p>');

				// 
				displayCustomers();
			});
		});
	});
	// select all
	selectAllBTN.off('click');
	selectAllBTN.on('click', e =>
	{
		var checks = tableElement.find('[data-role="CHECK"]');
		checks.trigger('click');
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// display loader
			TopLoader('حذف المعاملات...');
			deleteCustomers( getSelectedRows() ).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				//
				displayCustomers();
			});	
		});
		
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		var SearchObject = {
			query: searchInput.val()
		};
		searchBlacklistedCustomers(SearchObject).then(response =>
		{
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
							</td>
							<td>${v.customerName}</td>
							<td>${v.customerCCP}</td>
							<td>${v.customerDateBirth}</td>
							<td>${v.providerState}</td>
							<td>${v.dealDate} ${v.dealTime}</td>
						</tr>PAG_SEP`;		
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	});
	// dsiplay customers
	displayCustomers();
	function displayCustomers()
	{
		// display loader
		TopLoader("جلب القائمة السوداء...");
		getAllBlacklistedCustomers().then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<tr>
							<td>
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
							</td>
							<td>${v.customerName}</td>
							<td>${v.customerCCP}</td>
							<td>${v.customerDateBirth}</td>
							<td>${v.providerState}</td>
							<td>${v.dealDate} ${v.dealTime}</td>
						</tr>PAG_SEP`;		
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	}
	// get selected items
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
			{
				list.push({ customerId: check.data('customerid') });
			}
		}

		return list;
	}
}
// setup settings
function setupSettings()
{
	var settingsContainer = $('#settingsContainer');
	if ( settingsContainer[0] == undefined )
		return;

	var updateAccountForm = settingsContainer.find('#updateAccountForm');

	// update
	updateAccountForm.off('submit');
	updateAccountForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		// check password match
		if ( target.find('#uafPasswordInput').val() != target.find('#uafConfirmPasswordInput').val() )
		{
			DialogBox('خطأ', 'كلمة المرور غير مطابقة');
			return;
		}
		var UserObject = {
			username: target.find('#uafUsernameInput').val(),
			password: target.find('#uafPasswordInput').val()
		};
		// display loader
		TopLoader('تحديث بيانات الحساب...');
		updateMyAccount(UserObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				DialogBox('خطأ', response.message);
				return;
			}

			DialogBox('ملحوظة', response.message);
		});
	});
	// display account settings
	displayAccountSettings();
	function displayAccountSettings()
	{
		var userConfig = getUserConfig();

		updateAccountForm.find('#uafUsernameInput').val( userConfig.username );
		//updateAccountForm.find('#uafPasswordInput').val( userConfig.password );
		//updateAccountForm.find('#uafConfirmPasswordInput').val( userConfig.password );
	}
}
// Rebind events
rebindEvents = () =>
{
	setupNavbar();
	setupLoginSessions();
	setupWaitingApprovals();
	setupProviderTrial();
	setupImportTransactions();
	setupImportBlackLists();
	setupSettings();
}

rebindEvents();
// First UI user will see
getPage(APP_DIR_NAME+'views/pages/login-sessions.ejs').then(response =>
{
	MAIN_CONTENT_CONTAINER.html(response);
	// Re assign events
	rebindEvents();
});



})


