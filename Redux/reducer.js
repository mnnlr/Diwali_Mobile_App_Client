
const initialwatch = []

const initialState = [

];
const girl = []
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, action.data];

      case "REMOVE_FROM_CART":
        return state.filter((item) => item._id !== action.data._id);  
    default:
      return state;
  }
};


export const watchlist = (state = initialwatch, action) =>{
  switch(action.type){
    case 'ADDTOWATCH' :
      return [...state, action.data];
case 'REMOVETOWATCH' :
          return state.filter((item) => item.title !== action.data.title);  
      default:
      return state;
  }
  
}
 

export const userdata = (state = {}, action) =>{
  switch(action.type){
    case 'userdata' :
      return {user : action.data};

      default:
      return state;
  }
  
}
export const girlsReducer = (state = girl, action) => {
  switch (action.type) {
    case 'ADD_NEW_PRODUCT':
      return {
        ...state,
        girlsData: [...state.girlsData, action.payload],
      };
    default:
      return state;
  }
};

export default girlsReducer;
