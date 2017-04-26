
import { combineReducers } from "redux";
import * as types from "../actions";
import * as userTypes from "../actions/users";
import * as providerTypes from "../actions/providers";
import { appUrl } from "../clientConfig";
import {RouterActions} from '../clientConfig'
let counter = 0;
const data = (state = {
  isFetching: false,
  message: "",
  isInitialized: false,
  isRegistered: false,
  isLoggedIn: false,
  user: {},
  oldChatMessages: [],
  upcomingSessions: [],
  providers: [],
  myProvidersHash: {},
  myProviders: [],
  transactions: [],
  gigs: [],
  cards: [],
  chats: {},
  gigBalances: {},
  clients: [
    {
      id: "5880fdeb1c4ae71d5e711924",
      name: "Malik Hijazi",
      email: "malik@exequt.com"
    },
    {
      id: "5880fdeb1c4ae71d5e711924",
      name: "Karam Hijazi",
      email: "karam@gmail.com",
    }
  ],
  searchProviders: [],
  currentProvider: {},
  currentChatRoom: "",
  chatRooms: [],
  cardMessage: null
}, action) => {
  console.log("in reducer");
  console.log(action.type);
  switch (action.type) {
  case types.REQUEST_DATA:
    return Object.assign({}, state, {
      isFetching: true
    });
  case types.RECEIVE_DATA:
    return Object.assign({}, state, {
      isFetching: false,
      message: action.data.message || "",
      isInitialized: true
    });
  case userTypes.USER_REGISTERED:
    return Object.assign({}, state, {
      isFetching: false,
      isRegistered: true
    });
  case userTypes.ADD_CHAT_ROOM:
    console.log("in reducer chat room");
    return Object.assign({}, state, {
      currentChatRoom: action.chatRoomId
    });
  case userTypes.ADD_CHAT_MESSAGE:
    var chats = state.chats;
    var chatMessages = chats[action.chatId] || [];
    chatMessages = chatMessages.concat([action.message]);
    var obj = {};
    obj[action.chatId] = chatMessages;
    chats = Object.assign({}, state.chats, obj);
    return Object.assign({}, state, {
      chats
    });
  case userTypes.LOAD_EARLIER_MESSAGES:
    console.log("in reducer chat room");
    var chats = state.chats;
    var chatMessages = chats[action.chatId] || [];
    chatMessages = action.messages.reverse().concat(chatMessages);
    var obj = {};
    counter = counter + 1;
    obj[action.chatId] = chatMessages;
    var chats2 = Object.assign({}, state.chats, obj);
    return Object.assign({}, state, {
      chats: chats2,
      counter: counter + 1
    });
  case userTypes.USER_LOGGED_IN:
    var upcomingSessions = [];
    var transactions = [];
    var date = new Date(Date.now());
    var myProvidersHash = state.myProvidersHash;
    var myProviders = state.myProviders;
    action.user.userDetails = action.user.userDetails || {};
    for (var i = 0; i < action.transactions.length; i++) {
      transactions.push(action.transactions[i].transaction);
      if (action.transactions[i].transaction.type === "schedule" && action.transactions[i].transaction.status !== "cancelled") {
        var transactionDate = new Date(action.transactions[i].transaction.session.startDate);
        var endTime = action.transactions[i].transaction.session.endTime;
        var colonIndex = endTime.indexOf(':');
        var time = endTime.substring(0, colonIndex);
        var AMPM = endTime.substring(endTime.length - 2);
        if (AMPM == "AM" && time == 12) {
          time = 0;
        } else if (AMPM == "PM" && time != 12) {
          time = time + 12;
        }
        transactionDate.setHours(time);
        if (date < transactionDate) {
          var session = action.transactions[i].transaction.session;
          session.id = action.transactions[i]._id;
          upcomingSessions.push(session);
        }
      } else if (action.transactions[i].transaction.type === "purchase") {
        if (!myProvidersHash[action.transactions[i].transaction.providerId]) {
          myProvidersHash[action.transactions[i].transaction.providerId] = "toAdd";
        }
      }
    }

    if(upcomingSessions.length > 0){
      RouterActions.clientProfile();
    } else {
      RouterActions.addSession();
    }
    return ret = Object.assign({}, state, {
      user: action.user,
      isLoggedIn: true,
      isFetching: false,
      upcomingSessions: upcomingSessions,
      transactions: transactions,
      myProvidersHash,
      gigBalances: action.gigBalances
    });
    case userTypes.USER_LOGGED_OUT:
      return ret = Object.assign({}, state, {
        user: null,
        isLoggedIn: false,
        isFetching: false
      });
    case userTypes.SAVE_USER_NAME:
      var user = Object.assign({}, state.user, { name: action.name });
      return ret = Object.assign({}, state, {
        user: user
      });
    case userTypes.SAVER_USER_DETAILS:
      var user = Object.assign({}, state.user, { userDetails: action.userDetails });
      return ret = Object.assign({}, state, {
        user: user
      });
    case userTypes.USER_PROFILE_IMAGE_UPDATED:
      state.user.userDetails = Object.assign({}, state.user.userDetails, { profileImageId: action.profileImageId });
      return Object.assign({}, state);
  case userTypes.PASSWORD_RESET:
    console.log("set password reset");
    return Object.assign({}, state, {
      passwordReset: true
    });
  case userTypes.USER_CARDS:
    console.log("user cards received");
    return Object.assign({}, state, {
      cards: action.cards.filter(c => !!c),
    });
  case userTypes.AVAILABLE_DATES:
    console.log(state);
    console.log(action.currentProvider);
    console.log("user cards received");
    var currentProvider = action.currentProvider;
    currentProvider.availableDates = action.availableDates;
    currentProvider.availableTimes = action.availableTimes;
    return Object.assign({}, state, {
      currentProvider: currentProvider,
      isFetching: action.isFetching
    });
  case userTypes.USER_CC_TOKEN:
    console.log("user token received");
    return Object.assign({}, state, {
      clientToken: action.clientToken
    });
  case userTypes.ADD_CC_TOKEN:
    console.log("new card received");
    console.log(action);
    var cards = state.cards.concat([]);
    cards.push(action.card.creditCard || action.card.paymentMethod);
    return Object.assign({}, state, {
      cards
    })
  case userTypes.UPDATE_CC_TOKEN:
    console.log("updated card received");
    console.log(action);
    var cards = state.cards.concat([]);
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].maskedNumber == action.card.creditCard.maskedNumber) {
        cards[i] = action.card.creditCard;
      }
    }
    return Object.assign({}, state, {
      cards,
      cardMessage: "Card updated successfully."
    })
  case userTypes.DELETE_CC_TOKEN:
    console.log(action);
    var cards = state.cards.concat([]);
    var index = -1;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].token == action.token) {
        index = i;
      }
    }
    console.log(cards);
    if (index !== -1) {
      cards.splice(index, 1);
    }
    return Object.assign({}, state, {
      cards,
      cardMessage: "Card deleted successfully."
    })
    case providerTypes.SAVE_GIG:
    console.log(state.user.gigs);
      var gigs = (state.user.gigs || []).concat([]);
      var gigMatch = gigs.findIndex(g => g.id === action.gig.id);
      console.log("gigMatch");
      console.log(gigMatch);
      
      if(gigMatch > -1){
        gigs[gigMatch] = action.gig
      } else {
        gigs.push(action.gig);
      }

      var user = Object.assign({}, state.user, { gigs });


      return Object.assign({}, state, { user });
    case providerTypes.AVAILABLE_DATES:
      var clients = action.clients;
      return Object.assign({}, state, {
        clients: clients
      });
  case providerTypes.AVAILABLE_TIMES:
    return Object.assign({}, state, {
      isFetching: false,
      dateTimeFetchedFor: action.date,
      providerFetchedFor: action.providerId
    });
  case providerTypes.ADD_CLIENT:
    var clients = state.clients || [];
    if(clients.find(u => u._id === action.user._id)){
      return state;
    }
    clients = clients.concat([ action.user ]);
    return Object.assign({}, state, {
      clients: clients
    });
  case providerTypes.PROVIDER_LOGGED_IN:
    var upcomingSessions = action.user.upcomingSessions.map(t => Object.assign({}, t.transaction.session, {id: t._id, clientId: t.transaction.userId }));
    delete action.user.upcomingSessions;
    return Object.assign({}, state, {
      user: action.user,
      upcomingSessions: upcomingSessions,
      clients: action.user.clients
    });
  case providerTypes.PROVIDER_DETAILS_UPDATED:
    var providerDetails = Object.assign({}, state.user.providerDetails, action.providerDetails );
    var user = Object.assign({}, state.user, { providerDetails });
    return Object.assign({}, state, { user });
  case userTypes.PURCHASE_BUNDLE:
    console.log(action.provider);
    var provider = Object.assign({}, action.provider);
    var myProvidersHash = state.myProvidersHash;
    var transactions = state.transactions;
    console.log(myProvidersHash[provider._id]);
    if (myProvidersHash[provider._id] !== "added") {
      myProvidersHash[provider._id] = "toAdd";
    }
    transactions.push(action.transaction);
    var curGigBalance = state.gigBalances[action.transaction.gigId] || 0;
    curGigBalance += action.transaction.numSessions;
    var gigBalances = Object.assign({}, state.gigBalances);
    gigBalances[action.transaction.gigId] = curGigBalance;
    //since payment has gone through we can now go to the previous screen
    RouterActions.pop();
    return Object.assign({}, state, {
      transactions: transactions,
      myProvidersHash,
      gigBalances,
      isFetching: false
    });
  case userTypes.SET_CURRENT_PROVIDER:
    return Object.assign({}, state, {
      currentProvider: action.provider
    });
  case userTypes.TRANSACTIONS:
    var date = new Date(Date.now());
    var upcomingSessions = [];
    for (var i = 0; i < action.transactions.length; i++) {
      console.log(new Date(date));
      console.log(new Date(action.transactions[i].transaction.date));
      console.log(action.transactions[i].transaction.type);
      if (action.transactions[i].transaction.type === "schedule" && date < new Date(action.transactions[i].transaction.date) && action.transactions[i].transaction.status !== "cancelled") {
        upcomingSessions.push(action.transactions[i]);
      }
    }
    return Object.assign({}, state, {
      upcomingSessions: upcomingSessions,
      transactions: action.transactions
    });
  case userTypes.PROVIDER_TRANSACTIONS:
  console.log("in reducer chat room");
  console.log(action.transactions);
  return Object.assign({}, state, {
    transactions: action.transactions
  });
  case userTypes.PROVIDER_SESSIONS:
    var currentProvider = state.currentProvider;
    currentProvider.sessions = action.sessions;
    console.log(currentProvider);
    return Object.assign({}, state, {
      currentProvider: currentProvider
    });
  case userTypes.RATE_SESSION:
    return Object.assign({}, state, {});
  case userTypes.CANCEL_SESSION:
  console.log("in cacel session");
    var upcomingSessions = [];
    console.log(state.transactions);
    var transactions = state.transactions.concat([action.transaction]);

    console.log(transactions);
    var i = 0;
    var date = Date.now();
    while (i < transactions.length) {
      console.log(transactions[i]);
      if (transactions[i].type === "schedule" && transactions[i].userId === state.user._id && transactions[i].session.providerId === action.transaction.session.providerId && transactions[i].session.gigId === action.transaction.session.gigId && transactions[i].session.startDate === action.transaction.session.startDate && transactions[i].session.startTime === action.transaction.session.startTime) {
        transactions[i].status = "cancelled";
      } else if (transactions[i].type === "schedule" && date < new Date(transactions[i].session.startDate) && transactions[i].status !== "cancelled") {
        upcomingSessions.push(transactions[i].session);
      }
      i++;
    }
    return Object.assign({}, state, {
      transactions,
      upcomingSessions
    });
  case userTypes.SESSION_BOOKED:
    var upcomingSessions = state.upcomingSessions;
    var transactions = state.transactions;
    upcomingSessions.push(action.transaction.session);
    transactions.push(action.transaction);
    var gigBalances = Object.assign({}, state.gigBalances);

    gigBalances[action.transaction.session.gigId] = gigBalances[action.transaction.session.gigId] - 1;
    return Object.assign({}, state, {
      transactions,
      upcomingSessions,
      isFetching: false,
      gigBalances
    });
    case userTypes.GET_PROVIDERS:
      var newProviders = action.providers;
      var myProvidersHash = state.myProvidersHash;
      var myProviders = state.myProviders;
      for (var i = 0; i < newProviders.length; i++) {
        newProviders[i].id = newProviders[i]._id;
        newProviders[i].organizerName = newProviders[i].name || newProviders[i].username;
        var imageId = newProviders[i].providerDetails.profileImageId;
        //debugger;
        newProviders[i].organizerImgUrl = appUrl + '/providers/images/' + imageId;
        //newProviders[i].organizerImgUrl = newProviders[i].profileImageId;
        if (myProvidersHash[newProviders[i].id] === "toAdd") {
          myProviders.push(newProviders[i]);
          myProvidersHash[newProviders[i].id] = "added";
        }
      }
      if (action.email || action.fName || action.lName) {
        return Object.assign({}, state, {
          searchProviders: newProviders,
          myProviders
        });
      } else {
        return Object.assign({}, state, {
          providers: newProviders,
          myProviders
        });
      }
    case userTypes.GIG_SEARCH:
      var providers = action.providers || [];
      var matchingGigs = [];
      for (var k = 0; k < providers.length; k++) {
        var gigs = providers[k].gigs;
        console.log(gigs);
        for (var i = 0; i < gigs.length; i++) {
          var curGig = gigs[i];
          console.log(curGig);
          if (action.type1 === "secondaryCategory" && curGig.primaryCategory === action.primaryCategory && curGig.secondaryCategory === action.category) {
            var gig = curGig;
            gig.provider = providers[k];
            matchingGigs.push(gig);
          } else if (action.type1 === "tertiaryCategory" && curGig.primaryCategory === action.primaryCategory && curGig.tertiaryCategory === action.category) {
            var gig = curGig;
            gig.provider = providers[k];
            matchingGigs.push(gig);
          }
        }
      }
      console.log(matchingGigs);
      return Object.assign({}, state, {
        gigs: matchingGigs,
        isFetching: false
      });
  case "ERROR":
    console.log(action);
    return Object.assign({}, state, {
      error: true,
      errorDetails: action.error
    });
  case "TRANSACTION_ERROR":
    console.log(action);
    return Object.assign({}, state, {
      error: true
    });
  case "UPDATE_ERROR":
    console.log(action);
    return Object.assign({}, state, {
      cardMessage: "An error occured while updating card. Please vefiry the information."
    });
  case "DELETE_ERROR":
    console.log(action);
    return Object.assign({}, state, {
      cardMessage: "An error occured while deleting card."
    });
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  data
});

export default rootReducer;
