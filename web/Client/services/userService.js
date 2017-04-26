var axios = require("axios");
var clientConfig = require("../clientConfig")
var root = clientConfig.appUrl;

export const registerUser = (userDto) =>  {
  debugger;
  return axios.post(root + "/auth/signup", {
    userName: userDto.email,
    password: userDto.password1,
    name: userDto.name,
    mobile: true
  });
};

export const getCurrentUser = () => {
  console.log(root + "/auth/profile");
  return axios.get(root + "/auth/profile");
};

export const login = (loginDto) => {
  console.log(loginDto);
  return axios.post(root + "/auth/signIn", {
    userName: loginDto.email,
    password: loginDto.password,
    mobile: true
  });
};

export const loginFB = (email) => {
  console.log("in user service");
  return axios.post(root + "/auth/facebook-mobile", {
    userName: email
  });
};

export const logout = () => {
  console.log("in user service");
  return axios.post(root + "/auth/logout", {
    mobile: true
  });
};

export const saveUserDetails = (gender, weight, heightFt, heightIn, smoke, age) => {
  console.log("in user service");
  return axios.post(root + "/users/saveUserDetails", {
    gender,
    weight,
    heightFt,
    heightIn,
    smoke,
    age
  });
};

export const saveUserName = (name) => {
  return axios.post(root + "/users/saveUserName", {
    name
  });
};

export const messageSubmission = (message, chatId, createdAt) => {
  console.log("in user service");
  return axios.post(root + "/chat", {
    msg: message,
    chatId: chatId,
    createdAt: createdAt
  });
};

export const loadEarlierMessages = (startDate, chatId) => {
  console.log("in user service");
  return axios.post(root + "/chat/load", {
    startDate: startDate,
    chatId: chatId
  });
};

export const forgotPassword = email => {
  console.log("dal forgotPassword: " + email);
  return axios.post(root + "/auth/reset", {
    userName: email,
    mobile: true
  });
}

export const getCards = () => {
  return axios.get(root + "/users/paymentMethods", {});
}

export const getBlankCCToken = () => {
  return axios.get(root + "/users/blankCCToken", {});
}

export const addCard = nonce =>
{
  console.log("in user service add card");
  return axios.post(root + "/users/paymentMethod", {nonce})
}

export const updateCard = (token, expirationMonth, expirationYear, cvv) =>
{
  console.log("in user service update card");
  return axios.put(root + "/users/paymentMethod", {token: token, expirationMonth: expirationMonth, expirationYear: expirationYear, cvv: cvv})
}

export const deleteCard = (token) =>
{
  console.log("in user service delete card");
  return axios.post(root + "/users/deletePaymentMethod", {token: token})
}

var count = 3;
export const bookSession = (provider, selectedDate, selectedTime, gigId) =>
{
  return axios.post(root + "/users/bookSession", {
    provider: provider,
    selectedDate: selectedDate,
    selectedTime: selectedTime,
    gigId: gigId
  });
}

export const getProviders = (email, fName, lName) => {
  console.log("in user service");
  return axios.post(root + "/users/getProviders", {email: email, fName: fName, lName: lName});
}

export const gigSearch = (primaryCategory, category, type) => {
  console.log("in user service");
  return axios.post(root + "/users/gigSearch", {primaryCategory: primaryCategory, category: category, type: type});
}

export const providerSessions = (providerId) => {
  console.log(providerId);
  return axios.post(root + "/users/providerSessions", {providerId: providerId});
}

export const purchaseBundle = (provider, gig, bundle, paymentMethodToken) => {
  return axios.post(root + "/users/payment", {providerId: provider._id, gigName: gig.name, gigId: gig.id, bundle: bundle, paymentMethodToken:paymentMethodToken});
}

export const getTransactions = () => {
  return axios.post(root + "/users/getTransactions", {});
}
export const providerTransactions = () => {
  console.log("working");
  return axios.post(root + "/users/providerTransactions", {});
}

export const cancelSession = (session) => {
  return axios.post(root + "/users/cancelSession", {session});
}

export const rateSession = (rating, text, session) => {
  return axios.post(root + "/users/rateSession", {rating: rating, text: text, session});
}

export const joinSession = (providerId, sessionId) => {
  return axios.post(root + "/vidSessions/join", { providerId, sessionId });
}
