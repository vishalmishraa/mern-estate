import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ user: userReducer });

//we defined the persist config here for the redux persist. 
//where we define the key and the storage. 
//so that it can store the data in the local storage.
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};
//we use redux presist to store the user data in the local storage . 
//using this we can access the user data even after the page is refreshed.
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);