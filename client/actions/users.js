import { requestData, receiveData } from "./index"
import io from 'socket.io-client';
import { appUrl } from "../clientConfig";

var userService = require("../services/userService");
export const USER_REGISTERED = "USER_REGISTERED";
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const PROVIDER_LOGGED_IN = "PROVIDER_LOGGED_IN";
export const SAVE_USER_NAME = "SAVE_USER_NAME";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const PASSWORD_RESET = "PASSWORD_RESET";
export const SAVER_USER_DETAILS = "SAVER_USER_DETAILS";
export const USER_PROFILE_IMAGE_UPDATED = "USER_PROFILE_IMAGE_UPDATED";
export const USER_CARDS = "USER_CARDS";
export const USER_CC_TOKEN = "USER_CC_TOKEN";
export const ADD_CC_TOKEN = "ADD_CC_TOKEN";
export const UPDATE_CC_TOKEN = "UPDATE_CC_TOKEN";
export const DELETE_CC_TOKEN = "DELETE_CC_TOKEN";
export const SESSION_BOOKED = "SESSION_BOOKED";
export const ADD_CHAT_ROOM = "ADD_CHAT_ROOM";
export const ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE";
export const LOAD_EARLIER_MESSAGES = "LOAD_EARLIER_MESSAGES";
export const GET_PROVIDERS = "GET_PROVIDERS";
export const AVAILABLE_DATES = "AVAILABLE_DATES";
export const GIG_SEARCH = "GIG_SEARCH";
export const PURCHASE_BUNDLE = "PURCHASE_BUNDLE";
export const PROVIDER_SESSIONS = "PROVIDER_SESSIONS";
export const SET_CURRENT_PROVIDER = "SET_CURRENT_PROVIDER";
export const TRANSACTIONS = "TRANSACTIONS";
export const PROVIDER_TRANSACTIONS = "PROVIDER_TRANSACTIONS";
export const CANCEL_SESSION = "CANCEL_SESSION";
export const RATE_SESSION = "RATE_SESSION";
import {RouterActions, FBSDK} from '../clientConfig'
export const registerUser = (userDto) => {
  return dispatch => {
    dispatch(requestData());
    userService.registerUser(userDto).then(response =>{
      console.log(response);
      dispatch({
        type: USER_REGISTERED,
        user: response.data
      });

    }).catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR",
        error: err
      })
    });
  }
}

export const forgotPassword = email => {
  return dispatch => {
    dispatch(requestData());
    console.log("calling forgot password");
    userService.forgotPassword(email)
      .then(response => {
        console.log(response);
        if(response.data.status == "success"){
          dispatch({
            type: PASSWORD_RESET
          });
        } else {
          dispatch({
            type: "ERROR",
            error: "The username/password did not match our records."
          })
        }
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const subscribeToChats = (userId) => {
  return (dispatch, state) => {
    var socket = io(appUrl, {jsonp: false});
    socket.emit('join', {email: userId});
    socket.on('chat message', (text, message, chatRoomId) => {
        dispatch(addChatMessage(message, chatRoomId));
    });
  };
}

export const loginSuccess = (user) => {
  return dispatch => {
    dispatch(requestData());
    userService.getTransactions().then(response =>{
      console.log(response);
      dispatch({
        type: USER_LOGGED_IN,
        user,
        transactions: response.data.transactions,
        gigBalances: response.data.gigBalances
      });
      console.log("loginSuccess");
      dispatch(getProviders());
      RouterActions.clientProfile({});
      dispatch(subscribeToChats(user._id))
      console.log("loginEnd");
    }).catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR",
        error: err
      })
    });
  }
};

export const saveUserName = (name) => {
  return dispatch => {
    dispatch(requestData());
    userService.saveUserName(name).then(() =>{
      dispatch({
        type: SAVE_USER_NAME,
        name,
      });
    }).catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR",
        error: err
      })
    });
  }
};

export const saveUserDetails = (gender, weight, heightFt, heightIn, smoke, age) => {
  return dispatch => {
    dispatch(requestData());
    userService.saveUserDetails(gender, weight, heightFt, heightIn, smoke, age).then(response =>{
      console.log(response);
      dispatch({
        type: SAVER_USER_DETAILS,
        userDetails: response.data.userDetails,
      });
    }).catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR",
        error: err
      })
    });
  }
};

export const saveProfileImageId = (profileImageId) => {
  console.log("proflie image id saved");
  console.log(profileImageId);
  return {
    type: USER_PROFILE_IMAGE_UPDATED,
    profileImageId
  }
}

export const setCurrentProvider = (provider) => {
  return {
    type: SET_CURRENT_PROVIDER,
    provider: provider
  };
};


export const login = loginDto => {
  return dispatch => {
    dispatch(requestData());
    console.log(loginDto);
    userService.login(loginDto)
      .then(response => {
        console.log(response);
        if(response.data.status == "success"){
          dispatch(loginSuccess(response.data.user));
        } else {
          dispatch({
            type: "ERROR",
            error: "The username/password did not match our records."
          })
        }

      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const logout = () => {
  FBSDK.LoginManager.logOut();
  return dispatch => {
    dispatch(requestData());
    userService.logout()
      .then(response => {
        console.log(response);
        if(response.data.status == "success"){
          dispatch({
            type: USER_LOGGED_OUT
          })
          RouterActions.login({logout: true});
        } else {
          dispatch({
            type: "ERROR",
            error: "Error logging out."
          })
        }

      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const loginFB = email => {
  console.log("in action");
  return dispatch => {
    dispatch(requestData());
    console.log("uhhy");
    userService.loginFB(email)
      .then(response => {
        console.log(response);
        if(response.data.status == "success"){
          dispatch(loginSuccess(response.data.user));
        } else {
          dispatch({
            type: "ERROR",
            error: "Error in ouath"
          })
        }

      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const getCards = () => {
  return dispatch => {
    userService.getCards()
      .then(response => {
        console.log(response);
        dispatch({
          type: USER_CARDS,
          cards: response.data.paymentMethods,
          clientToken: response.data.clientToken
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const getBlankCCToken = () => {
  return dispatch => {
    userService.getBlankCCToken()
      .then(response => {
        console.log(response);
        dispatch({
          type: USER_CC_TOKEN,
          clientToken: response.data.clientToken
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const addCard = nonce => {
  console.log("in action add card");
  return dispatch => {
    userService.addCard(nonce)
    .then(response => {
      console.log(response);
      dispatch({
        type: ADD_CC_TOKEN,
        card: response.data.creditCard
      });
    }).catch(error => {
      dispatch({
        type: "ERROR",
        error
      });
    });
  }
}

export const updateCard = (token, expirationMonth, expirationYear, cvv) => {
  console.log("in action add card");
  return dispatch => {
    userService.updateCard(token, expirationMonth, expirationYear, cvv)
    .then(response => {
      console.log(response);
      dispatch({
        type: UPDATE_CC_TOKEN,
        card: response.data.creditCard
      });
    }).catch(error => {
      dispatch({
        type: "UPDATE_ERROR"
      });
    });
  }
}

export const deleteCard = (token) => {
  console.log("in action add card");
  return dispatch => {
    userService.deleteCard(token)
    .then(response => {
      console.log(response);
      dispatch({
        type: DELETE_CC_TOKEN,
        token: token
      });
    }).catch(error => {
      dispatch({
        type: "DELETE_ERROR",
        error
      });
    });
  }
}

export const bookSession = (selectedDate, selectedTime, gigId, provider) => {
  console.log("starting booking");
  return (dispatch, getState) => {

    dispatch(requestData());

    var state = getState();

    var provider = provider || state.data.currentProvider;
    var user = state.data.user;

    for (var i = 0; i < provider.gigs.length; i++) {
      if (provider.gigs[i].provider) {
        provider.gigs[i].provider = null;
      }
    }

    userService.bookSession(provider, selectedDate, selectedTime, gigId)
      .then(response => {
        console.log("session booked");
        dispatch({
          type: SESSION_BOOKED,
          transaction: response.data.transaction
        });
        dispatch(getProviders());
        RouterActions.clientProfile();
      })
      .catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      })
  }
}

export const addChatRoom = (providerId, userId) => {
  var chatRoomId;
  if (providerId < userId) {
    chatRoomId = providerId + "" + userId
  } else {
    chatRoomId = userId + "" + providerId
  }
  return {
    type: ADD_CHAT_ROOM,
    chatRoomId: chatRoomId
  };
};

export const messageSubmission = (message, chatId, createdAt) => {
  return dispatch => {
    dispatch(requestData());
    userService.messageSubmission(message, chatId, createdAt)
      .then(response => {
        console.log(response);
        if(!(response.data.status == "success")){
          dispatch({
            type: "ERROR",
            error: "Error in saving message to the db."
          })
        }
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const addChatMessage = (message, chatId) => {
  return dispatch => {
    dispatch({
      type: ADD_CHAT_MESSAGE,
      message,
      chatId
    });
  };
}

export const loadEarlierMessages = (startDate, chatId) => {
  return dispatch => {
    dispatch(requestData());
    userService.loadEarlierMessages(startDate, chatId)
      .then(response => {
        console.log(response);
        if(response.data.status == "success"){
          dispatch({
            type: LOAD_EARLIER_MESSAGES,
            messages: response.data.messages,
            chatId
          })
        } else {
          dispatch({
            type: "ERROR",
            error: response.data.message
          })
        }
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        })
      });
  }
};

export const getProviders = (email, fName, lName) => {
  console.log("getting providers");
  return dispatch => {
    userService.getProviders(email, fName, lName)
      .then(response => {
        console.log(response);
        dispatch({
          type: GET_PROVIDERS,
          providers: response.data.providers,
          email: response.data.email,
          fName: response.data.fName,
          lName: response.data.lName
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};


export const availableDates = (provider, sessions) => {
  console.log("serching for available dates.");
  var availableDates = [];
  var time = new Date();
  for (var i = 1; i < 31; i++) {
    var time1 = new Date();
    time1.setDate(time.getDate() + i);
    time1.setHours(0,0,0,0);
    availableDates.push(time1);
  }
  console.log(availableDates);
  var availableTimes = [];
  for (var i = 0; i < availableDates.length; i++) {
    var date = availableDates[i];
    var day = date.getDay();
    if (day === 0) {
      day = "Sunday";
    } else if (day === 1) {
      day = "Monday";
    } else if (day === 2) {
      day = "Tuesday";
    } else if (day === 3) {
      day = "Wednesday";
    } else if (day === 4) {
      day = "Thursday";
    } else if (day === 5) {
      day = "Friday";
    } else if (day === 6) {
      day = "Saturday";
    }
    var availableTimes1 = [];
    var hash = {};
    var availability = provider.providerDetails.availability;
    for (var k = 0; k < availability.length; k++) {
      if (availability[k].day === day) {
        for (var j = parseInt(availability[k].from,10); j < parseInt(availability[k].to, 10) + 1; j++) {
          if (j < 12) {
            var str = j+":00 AM";
            if (!hash[str]) {
              availableTimes1.push(j+":00 AM");
              hash[str] = true;
            }
          } else if (j == 12) {
            var str = j+":00 PM";
            if (!hash[str]) {
              availableTimes1.push(j+":00 PM");
              hash[str] = true;
            }
          } else if (j == 24) {
            var str = 12+":00 AM";
            if (!hash[str]) {
              availableTimes1.push(12+":00 AM");
              hash[str] = true;
            }
          }else {
            var newJ = j - 12;
            var str = newJ+":00 PM";
            if (!hash[str]) {
              availableTimes1.push(str);
              hash[str] = true;
            }
          }
        }
      }
    }
    if (availableTimes[date]) {
       availableTimes[date].push(availableTimes1);
    } else {
       availableTimes[date] = availableTimes1;
    }
  }
  console.log(availableTimes);
  console.log(sessions);
  sessions = sessions ||[];
  for (var l = 0; l < sessions.length; l++) {
    var date = new Date(sessions[l].transaction.session.startDate);
    var time = sessions[l].transaction.session.startTime;
    console.log(time);
    console.log(date);
    if (availableTimes[date]) {
      var index = availableTimes[date].indexOf(time);
      if (index !== -1 && sessions[l].transaction.status !== "cancelled") {
        availableTimes[date].splice(index,1);
      }
    }
  }
  console.log(availableTimes);
  return {
    type: AVAILABLE_DATES,
    currentProvider: provider,
    availableDates: availableDates,
    availableTimes: availableTimes,
    isFetching: false
  };
};

export const gigSearch = (primaryCategory, category, type) => {
  console.log("getting providers");
  return dispatch => {
    dispatch(requestData());
    userService.gigSearch(primaryCategory, category, type)
      .then(response => {
        console.log(response);
        dispatch({
          type: GIG_SEARCH,
          providers: response.data.providers,
          primaryCategory: response.data.primaryCategory,
          category: response.data.category,
          type1: response.data.type
        });

      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const purchaseBundle = (provider, gig, bundle, paymentMethodToken) => {
  console.log("purchasing bundle action");
  console.log(provider);
  return (dispatch, getState) => {
    dispatch(requestData());

    var state = getState();
    console.log(state);
    var searchProviders = state.data.providers;
    var transactions = state.data.transactions;
    var currentProvider = null;
    for (var i = 0; i < searchProviders.length; i++) {
      if (provider._id === searchProviders[i]._id) {
        currentProvider = searchProviders[i];
      }
    }
    console.log(transactions);
    console.log(currentProvider);
    userService.purchaseBundle(provider, gig, bundle, paymentMethodToken)
      .then(response => {
        console.log(response);
        console.log(provider);
        if (response.data.transaction) {
          dispatch({
            type: PURCHASE_BUNDLE,
            transaction: response.data.transaction,
            provider: provider
          });
          var numCredits = 0;
          console.log(transactions);

        } else {
          dispatch({
            type: "TRANSACTION_ERROR"
          });
        }
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  }
};

export const providerSessions = (providerId) => {
  return dispatch => {
    userService.providerSessions(providerId)
      .then(response => {
        console.log(response);
        dispatch({
          type: PROVIDER_SESSIONS,
          sessions: response.data.sessions
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const getTransactions = () => {
  return dispatch => {
    userService.getTransactions()
      .then(response => {
        console.log(response);
        dispatch({
          type: TRANSACTIONS,
          transactions: response.data.transactions
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};
export const providerTransactions = () => {
  return dispatch => {
    userService.providerTransactions()
      .then(response => {
        console.log(response);
        dispatch({
          type: PROVIDER_TRANSACTIONS,
          transactions: response.data.transactions
        });
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const cancelSession = (session) => {
  return dispatch => {
    userService.cancelSession(session)
      .then(response => {
        console.log(response);
        dispatch({
          type: CANCEL_SESSION,
          transaction: response.data.transaction
        });
        dispatch(getProviders());
        RouterActions.clientProfile();
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};

export const rateSession = (rating, text, session) => {
  return dispatch => {
    userService.rateSession(rating, text, session)
      .then(response => {
        console.log(response);
        dispatch({
          type: RATE_SESSION,
          rating: response.data.rating
        });
        dispatch(getProviders());
        RouterActions.clientProfile();
      }).catch(error => {
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};
