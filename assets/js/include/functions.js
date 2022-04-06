let registerProvider;
let loginProvider;
let updateProvider;
let getAllStates;
let addCustomer;
let getCustomer;
let addCustomerToBlackList;
let deleteCustomers;
let updateCustomer;
let addTransaction;
let getAllTransactionsByState;
let searchTransactions;
let deleteTransactions;
let userLogin;
let checkTrialStatus;
// Overrided in index.js
let rebindEvents;
let setupUserAuth;

$(function()
{

// check trial status
checkTrialStatus = () =>
{
	var url = API_END_POINT+'ProvidersTrial/check';

	var userConfig = getUserConfig();
	var data = {
		providerId: (userConfig != null) ? userConfig.providerId : ''
	};

	return sendAPIPostRequest(url, data);
}
// user login
userLogin = (username, password) =>
{
	var url = API_END_POINT+'Admin/me/login';

	var data = {
		username: username,
		password: password
	};

	return sendAPIPostRequest(url, data);
}
// delete transactions
deleteTransactions = (list) =>
{
	var url = API_END_POINT+'Transactions/deleteList';

	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search transactions
searchTransactions = (TransactionSearchObject) =>
{
	var url = API_END_POINT+'Transactions/search';

	var data = {
		TransactionSearchObject: TransactionSearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get all transactions
getAllTransactionsByState = () =>
{
	var url = API_END_POINT+'Transactions/listByState';

	var data = {
		state: getUserConfig().providerState
	};

	return sendAPIPostRequest(url, data);
}
// add transaction
addTransaction = (TransactionObject) =>
{
	var url = API_END_POINT+'Transactions/add';

	TransactionObject['providerId'] = getUserConfig().providerId;
	var data = {
		TransactionObject: TransactionObject
	};

	return sendAPIPostRequest(url, data);
}
// add Customer To BlackList
addCustomerToBlackList = (CustomerObject) =>
{
	var url = API_END_POINT+'Customers/addToBlackList';

	var userConfig = getUserConfig();
	CustomerObject['providerId'] = (userConfig.providerId != null) ? userConfig.providerId : '';
	var data = {
		CustomerObject: CustomerObject
	};

	return sendAPIPostRequest(url, data);
}
// update customer
updateCustomer = (CustomerObject) =>
{
	var url = API_END_POINT+'Customers/update';

	var data = {
		CustomerObject: CustomerObject
	};

	return sendAPIPostRequest(url, data);
}
// get customer
getCustomer = (customerId) =>
{
	var url = API_END_POINT+'Customers/info';
	var data = {
		customerId: customerId
	};

	return sendAPIPostRequest(url, data);
}
// delete customers
deleteCustomers = (list) =>
{
	var url = API_END_POINT+'Customers/deleteList';

	var data = {
		providerId : getUserConfig().providerId,
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// add customer
addCustomer = (CustomerObject) =>
{
	var url = API_END_POINT+'Customers/add';

	CustomerObject['providerId'] = getUserConfig().providerId;
	var data = {
		CustomerObject: CustomerObject
	};

	return sendAPIPostRequest(url, data);
}
// get all states
getAllStates = () =>
{
	var url = API_END_POINT+'States/list';
	var data = {};
	return sendAPIPostRequest(url, data);
}
// update provider
updateProvider = (ProviderObject) =>
{
	var url = API_END_POINT+'Providers/update';

	ProviderObject['providerId'] = getUserConfig().providerId;
	var data = {
		ProviderObject: ProviderObject
	};

	return sendAPIPostRequest(url, data);
}
// login provider
loginProvider = (login) =>
{
	var url = API_END_POINT+'Providers/login';
	var data = {
		providerPhone: login.providerPhone,
		providerPass: login.providerPass,
		deviceName: login.deviceName
	};
	return sendAPIPostRequest(url, data);
}
// register new provider
registerProvider = (ProviderObject) =>
{
	var url = API_END_POINT+'Providers/add';
	var data = {
		ProviderObject: ProviderObject
	};

	return sendAPIPostRequest(url, data);
}



});




