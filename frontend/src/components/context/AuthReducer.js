import {
  FOLLOW,
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
  UNFOLLOW,
} from "./ActionTypes";
export const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case LOGIN_SUCCESS:
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case LOGIN_FAILURE:
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case UNFOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (friendId) => friendId !== action.payload
          ),
        },
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
