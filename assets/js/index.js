$(function()
{


// Setup app updates
function setupAppUpdates()
{
	var title = '';
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
		title = 'تنزيل التحديثات...';
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		title = 'Télécharger les mises à jour...';
	var options =
	{
		title: title,
		version: '',
		progress: {
			percent: 0,
		}
	};
	ipcIndexRenderer.on('update-about-to-download', (e, info) =>
	{
		console.log(info);
	});
	ipcIndexRenderer.on('checking-for-update', (e, info) =>
	{
		// Translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// Display loader
			TopLoader('البحث عن تحديثات...');
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// Display loader
			TopLoader("Vérification des mises à jour...");
		}
	});
	ipcIndexRenderer.on('update-available', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		options.version = 'v'+info.version;
		console.log(info);
	});
	ipcIndexRenderer.on('update-not-available', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		console.log(info);
	});
	ipcIndexRenderer.on('update-error', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		console.log(info);
	});
	ipcIndexRenderer.on('update-downloaded', (e, info) =>
	{
		// Translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			PromptConfirmDialog('تأكيد', 'تم تنزيل التحديثات ، هل تريد التثبيت؟')
			.then(confirmed =>
			{
				ipcIndexRenderer.send('quit-and-install-update', info);
			});
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			PromptConfirmDialog("Confirmer", "Mises à jour téléchargées, souhaitez-vous les installer ?")
			.then(confirmed =>
			{
				ipcIndexRenderer.send('quit-and-install-update', info);
			});
		}
		console.log(info);
	});
	ipcIndexRenderer.on('download-update-progress', (e, info) =>
	{
		// Display update dialog
		options.progress.percent = info.percent;
		//options.total = info.total;
		//options.transferred = info.transferred;
		//options.bytesPerSecond = info.bytesPerSecond;
		TopProgressBar(options);
	});
}
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
					// hide main container
					MAIN_CONTENT_CONTAINER.hide(0);
					// hide side navbar
					SIDE_NAV_CONTAINER.hide(0);
					setupUserAuth();
				});	
			});
		}
		else if ( target.data('role') == 'CHECK_FOR_UPDATES_NAV_LINK' )
		{
			ipcIndexRenderer.send('check-for-updates', '');
		}
		else
			return;
	});
}
// setup user auth
setupUserAuth = () =>
{
	var userAuthContainer = $('#userAuthContainer');
	if ( userAuthContainer[0] == undefined )
		return;

	userAuthContainer.addClass('active');

	var signupWrapper = userAuthContainer.find('#signupWrapper');
	var signupForm = signupWrapper.find('#signupForm');
	var switchToSigninForm = signupForm.find('#switchToSigninForm');

	var signinWrapper = userAuthContainer.find('#signinWrapper');
	var signinForm = signinWrapper.find('#signinForm');
	var switchToSignupForm = signinForm.find('#switchToSignupForm');

	// go to signin
	switchToSigninForm.off('click');
	switchToSigninForm.on('click', e =>
	{
		e.preventDefault();
		signinWrapper.show(0);
		signupWrapper.hide(0);
	});
	// go to signup
	switchToSignupForm.off('click');
	switchToSignupForm.on('click', e =>
	{
		e.preventDefault();
		signupWrapper.show(0);
		signinWrapper.hide(0);
	});
	// sign up
	signupForm.off('submit');
	signupForm.on('submit', e =>
	{
		e.preventDefault();
		var target = signupForm;
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			var ProviderObject = {
				providerName: target.find('#sfName').val(),
				providerPhone: $.trim(target.find('#sfPhone').val()),
				providerPass: $.trim(target.find('#sfPassword').val()),
				providerState: target.find('#sfState :selected').val(),
				providerCity: target.find('#sfCity').val(),
				providerAddress: target.find('#sfAddress').val()
			};
			// display loader
			TopLoader("جاري إنشاء حسابك ، برجاء الانتظار ...");
			registerProvider(ProviderObject).then(response =>
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
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			var ProviderObject = {
				providerName: target.find('#sfName').val(),
				providerPhone: $.trim(target.find('#sfPhone').val()),
				providerPass: $.trim(target.find('#sfPassword').val()),
				providerState: target.find('#sfState :selected').val(),
				providerCity: target.find('#sfCity').val(),
				providerAddress: target.find('#sfAddress').val()
			};
			// display loader
			TopLoader("Création de votre compte, veuillez patienter...");
			registerProvider(ProviderObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				DialogBox('N.-B.', response.message);
			});	
		}
		
	});
	// signin
	signinForm.off('submit');
	signinForm.on('submit', e =>
	{
		e.preventDefault();
		target = signinForm;
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// get mac address
			getMacAddress().then(mac =>
			{
				var login = {
					providerPhone: target.find('#sfPhone').val(),
					providerPass: target.find('#sfPassword').val(),
					deviceName: mac
				};
				// display loader
				TopLoader("تسجيل الدخول ، برجاء الانتظار ...");
				loginProvider( login )
				.then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						if ( response.data != null )
						{
							if ( response.data.role.name == 'ROLE_ADMIN' )
							{
								// login as admin
								TopLoader("تم اكتشاف المسؤول ، قيام بتسجيل الدخول كمسؤول الآن ، يرجى الانتظار ...");
								userLogin( login.providerPhone, login.providerPass ).then(response =>
								{
									// hide loader
									TopLoader('', false);
									if ( response.code == 404 )
									{
										DialogBox('خطأ', response.message);
										return;
									}
									// save login
									saveUserConfig(response.data, () =>
									{
										window.location.href = APP_DIR_NAME+'admin/index.ejs';
									});
									
								});
								return;
							}

							return;
						}
						DialogBox('خطأ', response.message);
						return;
					}

					var data = response.data;
					saveUserConfig(data, () => 
					{
						// display main container
						MAIN_CONTENT_CONTAINER.show(0);
						// display side navbar
						SIDE_NAV_CONTAINER.show(0);
						// hide auth
						userAuthContainer.removeClass('active');
						// get page
						getPage(APP_DIR_NAME+'views/pages/customers.ejs').then(response =>
						{
							MAIN_CONTENT_CONTAINER.html(response);
							// Re assign events
							rebindEvents();
						});
					});
				});	
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// get mac address
			getMacAddress().then(mac =>
			{
				var login = {
					providerPhone: target.find('#sfPhone').val(),
					providerPass: target.find('#sfPassword').val(),
					deviceName: mac
				};
				// display loader
				TopLoader("Connectez-vous, veuillez patienter...");
				loginProvider( login )
				.then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						if ( response.data != null )
						{
							if ( response.data.role.name == 'ROLE_ADMIN' )
							{
								// login as admin
								TopLoader("Administrateur détecté, connectez-vous en tant qu'administrateur maintenant, veuillez patienter...");
								userLogin( login.providerPhone, login.providerPass ).then(response =>
								{
									// hide loader
									TopLoader('', false);
									if ( response.code == 404 )
									{
										DialogBox('Erreur', response.message);
										return;
									}
									// save login
									saveUserConfig(response.data, () =>
									{
										window.location.href = APP_DIR_NAME+'admin/index.ejs';
									});
									
								});
								return;
							}

							return;
						}
						DialogBox('Erreur', response.message);
						return;
					}

					var data = response.data;
					saveUserConfig(data, () => 
					{
						// display main container
						MAIN_CONTENT_CONTAINER.show(0);
						// display side navbar
						SIDE_NAV_CONTAINER.show(0);
						// hide auth
						userAuthContainer.removeClass('active');
						// get page
						getPage(APP_DIR_NAME+'views/pages/customers.ejs').then(response =>
						{
							MAIN_CONTENT_CONTAINER.html(response);
							// Re assign events
							rebindEvents();
						});
					});
				});	
			});	
		}
		
	});
	// display all states
	getAllStates().then(response =>
	{
		// clear html
		signupForm.find('#sfState').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		// add html
		signupForm.find('#sfState').html(html);
	});

}
// setup customers
function setupCustomers()
{
	var customersContainer = $('#customersContainer');
	if ( customersContainer[0] == undefined )
		return;

	var messageBox = customersContainer.find('#messageBox');
	var addWrapper = customersContainer.find('#addWrapper');
	var addForm = addWrapper.find('#addForm');

	var tableWrapper = customersContainer.find('#tableWrapper');
	var pagination = customersContainer.find('#pagination');
	var deleteSelectedBTN = customersContainer.find('#deleteSelectedBTN');
	var searchInput = customersContainer.find('#searchInput');
	var searchFromDateInput = customersContainer.find('#searchFromDateInput');
	var searchToDateInput = customersContainer.find('#searchToDateInput');
	var searchBTN = customersContainer.find('#searchBTN');
	var tableElement = customersContainer.find('#tableElement');
	var selectAllBTN = tableElement.find('#selectAllBTN');

	var autoRefresh = undefined;
	// add
	addForm.find('#addBTN').off('click');
	addForm.find('#addBTN').on('click', e =>
	{
		e.preventDefault();
		var target = addForm;
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			var isDealAccepted = ( target.find('#afisDealAcceptedCheck').prop('checked') ) ? 1 : 0;

			var CustomerObject = {
				customerName: target.find('#afcustomerNameInput').val(),
				customerCCP: target.find('#afcustomerCCPInput').val(),
				customerMonthlyDeductionAmount: target.find('#afcustomerMonthlyDeductionAmountInput').val(),
				customerDateBirth: target.find('#afcustomerDateBirthInput').val(),
				isDealAccepted: isDealAccepted
			};
			// display loader
			TopLoader("انشاء معاملة...");
			addCustomer(CustomerObject).then(response =>
			{
				// hide table wrapper
				hideTableWrapper();
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}
				//
				displayCustomers();
				messageBox.show(0).text(response.message).delay(5000).hide(0);
				target[0].reset();
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			var isDealAccepted = ( target.find('#afisDealAcceptedCheck').prop('checked') ) ? 1 : 0;

			var CustomerObject = {
				customerName: target.find('#afcustomerNameInput').val(),
				customerCCP: target.find('#afcustomerCCPInput').val(),
				customerMonthlyDeductionAmount: target.find('#afcustomerMonthlyDeductionAmountInput').val(),
				isDealAccepted: isDealAccepted
			};
			// display loader
			TopLoader("Créer une transaction...");
			addCustomer(CustomerObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}
				//
				displayCustomers();
			});	
		}
	});
	// add to blacklist
	addForm.find('#addToBlackListBTN').off('click');
	addForm.find('#addToBlackListBTN').on('click', e =>
	{
		e.preventDefault();
		var target = addForm;
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			var isDealAccepted = ( target.find('#afisDealAcceptedCheck').prop('checked') ) ? 1 : 0;

			var CustomerObject = {
				customerName: target.find('#afcustomerNameInput').val(),
				customerCCP: target.find('#afcustomerCCPInput').val(),
				customerDateBirth: target.find('#afcustomerDateBirthInput').val(),
			};
			// display loader
			TopLoader("اظافة الى القائمة السوداء...");
			addCustomerToBlackList(CustomerObject).then(response =>
			{
				// hide table wrapper
				hideTableWrapper();
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}
				//
				displayCustomers();
				messageBox.show(0).text(response.message).delay(5000).hide(0);
				target[0].reset();
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			var isDealAccepted = ( target.find('#afisDealAcceptedCheck').prop('checked') ) ? 1 : 0;

			var CustomerObject = {
				customerName: target.find('#afcustomerNameInput').val(),
				customerCCP: target.find('#afcustomerCCPInput').val()
			};
			// display loader
			TopLoader("Ajouter à la liste noire...");
			addCustomerToBlackList(CustomerObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}
				//
				displayCustomers();
			});	
		}
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			PromptConfirmDialog().then(c =>
			{
				// hide table wrapper
				hideTableWrapper();
				// display loader
				TopLoader("حذف المعاملات...");
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
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			PromptConfirmDialog("Confirmer", "Êtes-vous sûr?").then(c =>
			{
				// display loader
				TopLoader("Supprimer les transactions...");
				deleteCustomers( getSelectedRows() ).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						DialogBox('Erreur', response.message);
						return;
					}
					//
					displayCustomers();
				});	
			});	
		}
		
	});
	// select all
	selectAllBTN.off('click');
	selectAllBTN.on('click', e =>
	{
		var checks = tableElement.find('[data-role="CHECK"]');
		checks.trigger('click');
	});
	// 
	tableElement.off('click');
	tableElement.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'SELECT' ) // select deal
		{
			// display loader
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("جلب بيانات المعاملة...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Récupérer les données de transaction...");
			getCustomer( target.data('customerid') ).then(response =>
			{
				
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					if ( FUI_DISPLAY_LANG.lang == 'ar' )
						DialogBox('خطأ', response.message);
					else if ( FUI_DISPLAY_LANG.lang == 'fr' )
						TopLoader('Erreur', response.message);
					return;
				}

				var data = response.data;

				// display info
				addForm.find('#afcustomerNameInput').val(data.customerName);
				addForm.find('#afcustomerCCPInput').val(data.customerCCP);
				addForm.find('#afcustomerDateBirthInput').val(data.customerDateBirth);
				//addForm.find('#afcustomerMonthlyDeductionAmountInput').val();
			});
		}
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		if ( searchInput.val().length == 0 )
		{
			hideTableWrapper();
			return;
		}

		if ( searchInput.val().length < 4 )
		{
			hideTableWrapper();
			return;
		}

		var SearchObject = {
			query: searchInput.val(),
			dateFrom: searchFromDateInput.val(),
			dateTo: searchToDateInput.val()
		};
		// display loader
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader('يتم الآن البحث...');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Recherche maintenant...");
		searchCustomers(SearchObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// display tableWrapper
			showTableWrapper();
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				// translate
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">مقبول</p>' : '<p class="alert alert-danger">مرفوض</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">في القائمة السوداء</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">acceptable</p>' : '<p class="alert alert-danger">inacceptable</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">dans la liste noire</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	});
	// search by date
	searchBTN.off('click');
	searchBTN.on('click', e =>
	{
		// clear input to search by date
		searchInput.val('');
		//
		var SearchObject = {
			query: searchInput.val(),
			dateFrom: searchFromDateInput.val(),
			dateTo: searchToDateInput.val()
		};
		// display loader
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader('يتم الآن البحث...');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Recherche maintenant...");
		searchCustomers(SearchObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// display tableWrapper
			showTableWrapper();
			// clear html
			tableElement.find('tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				// translate
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">مقبول</p>' : '<p class="alert alert-danger">مرفوض</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">في القائمة السوداء</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">acceptable</p>' : '<p class="alert alert-danger">inacceptable</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">dans la liste noire</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	});
	// display all states
	getAllStates().then(response =>
	{
		// clear html
		addForm.find('#customerStateSelect').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		// add html
		addForm.find('#customerStateSelect').html(html);
	});
	// dsiplay customers
	displayCustomers();
	function displayCustomers()
	{
		// display loader
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جلب المعاملات...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("récupération des transactions");
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
				// translate
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">مقبول</p>' : '<p class="alert alert-danger">مرفوض</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">في القائمة السوداء</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">اضف معاملة</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					var isDealAccepted = (v.isDealAccepted == 1) ? '<p class="alert alert-success">acceptable</p>' : '<p class="alert alert-danger">inacceptable</p>';
					if ( v.isBlacklisted == 1 )
					{
						html += `<tr class="bg-dark text-white">
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td><p class="alert alert-danger">dans la liste noire</p></td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
					else
					{
						html += `<tr>
									<td>
										<input type="checkbox" class="form-check-input" data-role="CHECK" data-customerid="${v.customerId}">
									</td>
									<td>${v.customerName}</td>
									<td>${v.customerCCP}</td>
									<td>${parseFloat(v.customerMonthlyDeductionAmount).toFixed(2)}</td>
									<td>${isDealAccepted}</td>
									<td>${v.providerState}</td>
									<td>${v.dealDate} ${v.dealTime}</td>
									<td>${v.customerDateBirth}</td>
									<td>
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary" data-role="SELECT" data-customerid="${v.customerId}">Ajouter une transaction</button>
										</div>
									</td>
								</tr>PAG_SEP`;		
					}
				}
			});
			// toast about new data
			//translate
			/*
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				if ( response.isNewDataAvailable )
				{
					CreateToast('اشعار', 'هناك معاملات جديدة تمت اظافتها!', 'اليوم');
				}	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				if ( response.isNewDataAvailable )
				{
					CreateToast('Notification', "Il y a de nouvelles transactions ajoutées !", "Aujourd'hui");
				}	
			}
			*/
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};

			new SmoothPagination( pagination, tableElement.find('tbody'), options );
		});
	}
	// get selected row
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
	// hide table wrapper
	function hideTableWrapper()
	{
		// hide tableWrapper
		tableWrapper.hide(0);
	}
	// show table wrapper
	function showTableWrapper()
	{
		// hide tableWrapper
		tableWrapper.show(0);
	}
}
// Setup Facility
function setupFacility()
{

	var dataViewContainer = $('.data-view-container');
	var dvcTableContainer = dataViewContainer.find('#dvcTableContainer');
	var tableDiv = dvcTableContainer.find('#tableDiv');
	var facilityTable = tableDiv.find('#facilityTable');
	var inputsDiv = dataViewContainer.find('#inputsDiv');
	var searchForFacilitiesForm = inputsDiv.find('#searchForFacilitiesForm');
	var exportTableBTN = inputsDiv.find('#exportTableBTN');
	var dvcTotalDiv = dataViewContainer.find('#dvcTotalDiv');
	var resultsPerPageSelect = searchForFacilitiesForm.find('#resultsPerPageSelect');

	// Search For Facilities
	var resultsPerPage = 16;
	// Set results per page
	resultsPerPageSelect.on('change', function()
	{
		resultsPerPage = $(this).find(':selected').val();
	});
	searchForFacilitiesForm.on('submit', function(e)
	{
		e.preventDefault();
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			var REF = inputsDiv.find('#REF').val();
			var CCP = inputsDiv.find('#CCP').val();
			var FROM_DATE = inputsDiv.find('#FROM_DATE').val();
			var TO_DATE = inputsDiv.find('#TO_DATE').val();
			var NOM = inputsDiv.find('#NOM').val();
			var OPERATION = inputsDiv.find('#OPERATION').find(':selected').val();
			var infoObject = 
			{
				lang: FUI_DISPLAY_LANG.lang,
				REF: $.trim(REF),
				CCP: $.trim(CCP),
				FROM_DATE: FROM_DATE,
				TO_DATE: TO_DATE,
				NOM: $.trim(NOM),
				OPERATION: OPERATION,
				operation: 'SEARCH_FOR_FACILITIES',
				pagination: {
					data: [],
					resultsPerPage: resultsPerPage,
					linksCount: 0
				},
				totalAmount: '',
				isSuccess: false,
				message: '',
				html: ''
			};

			// Display Loader
			TopLoader('جاري البحث عن البيانات ، برجاء الانتظار ...');
			$.ajax({
				url: 'http://facilities.holoola-z.com/php/facilities.php',
				type: 'POST',
				data: {
					infoObject: JSON.stringify(infoObject)
				},
				success: function(data)
				{
					//console.log(data);
					// hide loader
					TopLoader('', false);
					inputsDiv.find('#REF').val('');	
					inputsDiv.find('#CCP').val('');	
					inputsDiv.find('#NOM').val('');
					var parsed = JSON.parse(data);
					if ( !parsed.isSuccess )
					{
						alert(parsed.message);
						return;
					}
					console.log(parsed);
					new SmoothPagination($('#pagePagination'), facilityTable.find('tbody'), parsed.pagination);
					dvcTotalDiv.find('#total').val(parsed.totalAmount);
					// Make Table Sortable
					facilityTable.tablesorter();
				}
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			var REF = inputsDiv.find('#REF').val();
			var CCP = inputsDiv.find('#CCP').val();
			var FROM_DATE = inputsDiv.find('#FROM_DATE').val();
			var TO_DATE = inputsDiv.find('#TO_DATE').val();
			var NOM = inputsDiv.find('#NOM').val();
			var OPERATION = inputsDiv.find('#OPERATION').find(':selected').val();
			var infoObject = 
			{
				lang: FUI_DISPLAY_LANG.lang,
				REF: $.trim(REF),
				CCP: $.trim(CCP),
				FROM_DATE: FROM_DATE,
				TO_DATE: TO_DATE,
				NOM: $.trim(NOM),
				OPERATION: OPERATION,
				operation: 'SEARCH_FOR_FACILITIES',
				pagination: {
					data: [],
					resultsPerPage: resultsPerPage,
					linksCount: 0
				},
				totalAmount: '',
				isSuccess: false,
				message: '',
				html: ''
			};

			// Display Loader
			TopLoader('Recherche de données, veuillez patienter...');
			$.ajax({
				url: 'http://facilities.holoola-z.com/php/facilities.php',
				type: 'POST',
				data: {
					infoObject: JSON.stringify(infoObject)
				},
				success: function(data)
				{
					//console.log(data);
					// hide loader
					TopLoader('', false);
					inputsDiv.find('#REF').val('');	
					inputsDiv.find('#CCP').val('');	
					inputsDiv.find('#NOM').val('');
					var parsed = JSON.parse(data);
					if ( !parsed.isSuccess )
					{
						alert(parsed.message);
						return;
					}
					console.log(parsed);
					new SmoothPagination($('#pagePagination'), facilityTable.find('tbody'), parsed.pagination);
					dvcTotalDiv.find('#total').text(parsed.totalAmount);
					// Make Table Sortable
					facilityTable.tablesorter();
				}
			});	
		}
	});

	// Export Table
	exportTableBTN.on('click', function(e)
	{		
		e.preventDefault();
		var fileType = '';
		var exportFileTypeList = $(this).siblings('#exportFileTypeList');
		exportFileTypeList.off('click');
		exportFileTypeList.on('click', function(e)
		{
			e.preventDefault();
			var target = $(e.target);
			if ( target.data('role') != 'FILE_TYPE' )
				return;

			fileType = target.data('filetype');
			// Update Selection to get changed data in table
			tableDiv = dvcTableContainer.find('#tableDiv');
			facilityTable = tableDiv.find('#facilityTable');
			facilityTable.tableExport({type: fileType});
		});
	});

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
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// check password match
			if ( target.find('#uafPassInput').val() != target.find('#uafConfirmPassInput').val() )
			{
				DialogBox('خطأ', "كلمة المرور غير مطابقة");
				return;
			}
			var ProviderObject = {
				providerName: target.find('#uafNameInput').val(),
				providerPhone: $.trim(target.find('#uafPhoneInput').val()),
				providerPass: $.trim(target.find('#uafPassInput').val()),
				providerState: target.find('#uafStateSelect :selected').val(),
				providerCity: target.find('#uafCityInput').val(),
				providerAddress: target.find('#uafAddressInput').val()
			};
			// display loader
			TopLoader("تحديث الحساب...");
			updateProvider(ProviderObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				DialogBox('ملحوظة', response.message);
				// save new data
				saveUserConfig(response.data, () => {});
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// check password match
			if ( target.find('#uafPassInput').val() != target.find('#uafConfirmPassInput').val() )
			{
				DialogBox('Erreur', "Les mots de passe ne correspondent pas");
				return;
			}
			var ProviderObject = {
				providerName: target.find('#uafNameInput').val(),
				providerPhone: $.trim(target.find('#uafPhoneInput').val()),
				providerPass: $.trim(target.find('#uafPassInput').val()),
				providerState: target.find('#uafStateSelect :selected').val(),
				providerCity: target.find('#uafCityInput').val(),
				providerAddress: target.find('#uafAddressInput').val()
			};
			// display loader
			TopLoader("Mise à jour du compte...");
			updateProvider(ProviderObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				DialogBox('N.-B.', response.message);
				// save new data
				saveUserConfig(response.data, () => {});
			});	
		}
	});
	// display states
	getAllStates().then(response =>
	{
		// clear html
		updateAccountForm.find('#uafStateSelect').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		// add html
		updateAccountForm.find('#uafStateSelect').html(html);
	});
	// display provider info
	displayProviderInfo();
	function displayProviderInfo()
	{
		updateAccountForm.find('#uafNameInput').val( getUserConfig().providerName );
		setOptionSelected( updateAccountForm.find('#uafStateSelect'), getUserConfig().providerState );
		updateAccountForm.find('#uafCityInput').val( getUserConfig().providerCity );
		updateAccountForm.find('#uafAddressInput').val( getUserConfig().providerAddress );
		updateAccountForm.find('#uafPhoneInput').val( getUserConfig().providerPhone );
		updateAccountForm.find('#uafPassInput').val( getUserConfig().providerPass );
		updateAccountForm.find('#uafConfirmPassInput').val( getUserConfig().providerPass );
	}
	// update ui settings
	var updateUISettingsForm = settingsContainer.find('#updateUISettingsForm');
	var uiLangSelect = settingsContainer.find('#uiLangSelect'); 

	updateUISettingsForm.off('submit');
	updateUISettingsForm.on('submit', e =>
	{
		e.preventDefault();
		setUIDisplayLang( uiLangSelect.find(':selected').val() ).then(changed =>
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				DialogBox('ملحوظة', "تم تغيير لغة العرض، اعد تشغيل البرنامج لملاحظة التغييرات.");
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				DialogBox('N.-B.', "La langue d'affichage a été modifiée, redémarrez le programme pour constater les changements.");
			}
		});
	});
	//
	setOptionSelected(uiLangSelect, FUI_DISPLAY_LANG.lang);
}
// Rebind events
rebindEvents = () =>
{
	setupNavbar();
	setupCustomers();
	setupFacility();
	setupSettings();

	// check trial status
	checkTrialStatus().then(response =>
	{
		if ( response.code == 404 )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				DialogBox('خطأ', response.message);
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				DialogBox('Erreur', response.message);
			}

			// disable containers
			setContainersDisabled(true);
			return;
		}
	});
}
// autochecker
/*
clearInterval(AUTO_CHECKER);
AUTO_CHECKER = setInterval( () => 
{
	setupCustomers();
}, 30 * 1000 );
*/
// change content direction
if ( FUI_DISPLAY_LANG.lang == 'ar' )
{
	// change style sheet
	$('#MAIN_STYLESHEET').remove();
	$('head').append('<link rel="stylesheet" type="text/css" id="MAIN_STYLESHEET" href="assets/css/main_ar.css">');
}
else if ( FUI_DISPLAY_LANG.lang == 'fr' )
{
	// change style sheet
	$('#MAIN_STYLESHEET').remove();
	$('head').append('<link rel="stylesheet" type="text/css" id="MAIN_STYLESHEET" href="assets/css/main_fr.css">');
}
// check login
if ( !isConfigExists() )
{
	getPage(APP_DIR_NAME+'views/addons/user-auth.ejs').then(response =>
	{
		setupUserAuth();
		// hide side bar
		SIDE_NAV_CONTAINER.hide(0);
		// hide main container
		MAIN_CONTENT_CONTAINER.hide(0);
	});
}
else
{
	// check if admin
	var userConfig = getUserConfig();
	if ( userConfig.role != null )
	{
		if ( userConfig.role.name == 'ROLE_ADMIN' )
		{
			window.location.href = APP_DIR_NAME+'admin/index.ejs';
		}
	}
}
rebindEvents();
// setup auto updates
setupAppUpdates();
// First UI user will see
getPage(APP_DIR_NAME+'views/pages/customers.ejs').then(response =>
{
	MAIN_CONTENT_CONTAINER.html(response);
	// Re assign events
	rebindEvents();
});


})


