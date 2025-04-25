import {
  combineReducers,
} from "@reduxjs/toolkit";

import {
  reducer as dataReducer,
} from "./data";
import {
  reducer as pageReducer,
} from "./page";
import {
  StoreNameSpace,
} from "../../const";

export const rootReducer = combineReducers({
  [StoreNameSpace.DATA]: dataReducer,
  [StoreNameSpace.PAGE]: pageReducer,
});
