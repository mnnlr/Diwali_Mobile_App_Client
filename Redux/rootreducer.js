import { combineReducers } from '@reduxjs/toolkit';
import {reducer, watchlist, userdata} from './reducer';
import {girlsReducer} from './reducer'
const rootReducer = combineReducers({
  add: reducer,
  girls: girlsReducer,
  watch : watchlist,
  user : userdata
});

export default rootReducer;
