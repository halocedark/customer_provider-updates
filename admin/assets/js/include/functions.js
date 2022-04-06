let getAllLoginSessions;
let searchLoginSessions;
let deleteLoginSessions;
let updateMyAccount;
let getAllUnapprovedProviders;
let searchUnapprovedProviders;
let approveProviders;
let deleteProviders;
let getAllProviders;
let searchProviders;
let getAllProviderTrials;
let deleteProvidersTrials;
let searchProvidersTrials;
let addProvidersTrials;
let addCustomers;
let deleteCustomers;
// Overrided in index.js
let rebindEvents;

$(function()
{

// delete customers
deleteCustomers = (list) =>
{
	var url = API_END_POINT+'Customers/deleteList';

	var data = {
		list: list,
		adminId: getUserConfig().userId,
		providerId: ''
	}

	return sendAPIPostRequest(url, data);
}
// add customers
addCustomers = (CustomerObjectList) =>
{
	var url = API_END_POINT+'Customers/addList';

	var data = {
		CustomerObjectList: CustomerObjectList
	}

	return sendAPIPostRequest(url, data);
}
// add Providers Trials
addProvidersTrials = (args) =>
{
	var url = API_END_POINT+'ProvidersTrial/addList';

	var data = {
		list: args.list,
		trialEnd: args.trialEnd
	};

	return sendAPIPostRequest(url, data);
}
// search Providers Trials
searchProvidersTrials = (query) =>
{
	var url = API_END_POINT+'ProvidersTrial/search';

	var data = {
		query: query
	};

	return sendAPIPostRequest(url, data);
}
// delete Providers Trials
deleteProvidersTrials = (list) =>
{
	var url = API_END_POINT+'ProvidersTrial/deleteList';
	var data = {
		list: list
	};
	return sendAPIPostRequest(url, data);
}
// get All Provider Trials
getAllProviderTrials = () =>
{
	var url = API_END_POINT+'ProvidersTrial/list';
	var data = {};
	return sendAPIPostRequest(url, data);
}
// search Providers
searchProviders = (query) =>
{
	var url = API_END_POINT+'Providers/search';

	var data = {
		query: query
	};

	return sendAPIPostRequest(url, data);
}
// get all providers
getAllProviders = () =>
{
	var url = API_END_POINT+'Providers/list';
	var data = {};
	return sendAPIPostRequest(url, data);
}
// delete Providers
deleteProviders = (list) =>
{
	var url = API_END_POINT+'Providers/deleteList';

	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// approve Providers
approveProviders = (list) =>
{
	var url = API_END_POINT+'Providers/approveList';

	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search Unapproved Providers
searchUnapprovedProviders = (query) =>
{
	var url = API_END_POINT+'Providers/searchUnapproved';

	var data = {
		query: query
	};

	return sendAPIPostRequest(url, data);
}
// get All Unapproved Providers
getAllUnapprovedProviders = () =>
{
	var url = API_END_POINT+'Providers/listUnapproved';

	var data = {

	};

	return sendAPIPostRequest(url, data);
}
// update my account
updateMyAccount = (UserObject) =>
{
	var url = API_END_POINT+'Admin/me/update';

	UserObject['userId'] = getUserConfig().userId;
	var data = {
		UserObject: UserObject
	};

	return sendAPIPostRequest(url, data);
}
// delete login sessions
deleteLoginSessions = (list) =>
{
	var url = API_END_POINT+'Admin/LoginSessions/deleteList';

	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search login sessions
searchLoginSessions = (query) =>
{
	var url = API_END_POINT+'Admin/LoginSessions/search';

	var data = {
		query: query
	};

	return sendAPIPostRequest(url, data);
}
// get login sessions
getAllLoginSessions = () =>
{
	var url = API_END_POINT+'Admin/LoginSessions/list';

	var data = {};

	return sendAPIPostRequest(url, data);
}



});




