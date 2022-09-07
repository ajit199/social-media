import {
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
} from "./components/context/ActionTypes";
import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: LOGIN_START });
  try {
    const response = await axios.post("/auth/login", userCredentials);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error });
  }
};
