export const initialState = null

export const reducerFunc = (CurrentState, action) => {
  switch(action.type){
    case "USER":
      return action.payload
    case "UPDATE":
      return {...CurrentState, followers: action.payload.followers, following: action.payload.following}
    case "UPDATEPIC":
      return {...CurrentState, avatar: action.payload.avatar}
    case "CLEAR":
      return null
    default: 
      return CurrentState
  }
}