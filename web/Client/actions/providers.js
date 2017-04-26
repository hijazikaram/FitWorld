import { requestData, receiveData } from "./index"
import { subscribeToChats } from "./users"
var providerService = require("../services/providerService");
export const AVAILABLE_TIMES = "AVAILABLE_TIMES";
export const PROVIDER_LOGGED_IN = "PROVIDER_LOGGED_IN";
export const SAVE_GIG = "SAVE_GIG";
export const CLIENTS = "ClIENTS";
export const ADD_CLIENT = "ADD_CLIENT";
export const CREATE_PROFILE_IMAGE = "CREATE_PROFILE_IMAGE";
export const PROVIDER_DETAILS_UPDATED = "PROVIDER_DETAILS_UPDATED";

export const addClient = (user) => {
    return {
      type: ADD_CLIENT,
      user
    }
};

export const saveGig = (gig) => {
  return dispatch => {
    providerService.createGigs(gig)
      .then(response => {
        console.log(response);
        dispatch({
          type: SAVE_GIG,
          gig: response.data
        });
      }).catch(error => {
        debugger;
        console.log(error);
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};
export const providerSettings = (details) => {
  return dispatch => {
    providerService.providerSettings(details)
      .then(response => {
        console.log(response);
        dispatch({
          type: PROVIDER_DETAILS_UPDATED,
          providerDetails: response.data
        });
      }).catch(error => {
        console.log(error);
        dispatch({
          type: "ERROR",
          error
        });
      });
  };
};
export const clients = () => {
  return dispatch => {
    console.log("action working");
    dispatch(requestData());
  };
};


export const getCurrentProvider = () => {
  return dispatch => {
    dispatch(requestData());
    providerService.getCurrentProvider().then(response =>{
      console.log(response);

      if (response.data.status === "success") {
        dispatch({
          type: PROVIDER_LOGGED_IN,
          user: response.data.user
        });
        dispatch(subscribeToChats(response.data.user._id));
      } else {
        dispatch({
          type: "ERROR",
          error: "Your are not a provider."
        });
      }
    }).catch(err => {
      console.log(err);
      dispatch({
        type: "ERROR",
        error: err
      });
    });
  }
};
