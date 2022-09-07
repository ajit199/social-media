import { AuthReducer } from "./AuthReducer";
const { createContext, useReducer } = require("react");
const INIT_STATE = {
  user: {
    _id: "62ac4f9afafda043ef719266",
    username: "ajit199",
    email: "ajit@test.com",
    password: "secure@123",
    profilePicture:
      "https://uxwing.com/wp-content/themes/uxwing/download/12-peoples-avatars/man-person.png",
    coverPicture: "",
    followers: ["62ac52ce813bba5695bfdf74"],
    following: [],
    isAdmin: false,
    __v: 0,
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INIT_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
