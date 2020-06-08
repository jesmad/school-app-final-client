import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
} from "../types.js";
import axios from "axios";

//Cloud Firestore (all REST API endpoints exist under this base URL)
const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(baseURL + "/login", userData)
    .then((response) => {
      const FBIdToken = `Bearer ${response.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); //Redirect user to the home page if login was successful
    })
    .catch((error) => {
      console.log("errorfailedinloginUser: ", error);
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
      });
    });
};
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  //Remove authorization headers
  delete axios.defaults.headers.common["Authorization"];

  //Clear out user state
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(baseURL + "/signup", newUserData)
    .then((response) => {
      const FBIdToken = `Bearer ${response.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); //Redirect user to the home page if login was successful
    })
    .catch((error) => {
      console.log("errorfailedin sigupUser: ", error);
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
      });
    });
};
//Get User Data after logging in
export const getUserData = () => (dispatch) => {
  axios
    .get(baseURL + "/user")
    .then((response) => {
      dispatch({
        type: SET_USER,
        payload: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
