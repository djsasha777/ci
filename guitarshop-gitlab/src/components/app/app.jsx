import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import {
  Provider,
} from "react-redux";
import {
  createStore,
} from "@reduxjs/toolkit";

import Catalog from "../pages/catalog/catalog";
import Basket from "../pages/basket/basket";

import {
  rootReducer as reducer,
} from "../../store/reducers/root-reducer";
import {
  AppRoute,
} from "../../const";

const store = createStore(reducer);

const App = () => (
  <Provider store={store}>
    <Routes>
      <Route exact path={AppRoute.ROOT} element={<Catalog />} />
      <Route exact path={AppRoute.BASKET} element={<Basket />} />
    </Routes >
  </Provider>
);

export default App;
