import { createStore } from 'redux';
import { createAction, handleActions as createReducer } from 'redux-actions';


// Action 
export const actionTypes = {//action type
  SET_FSSTATUS: 'SET_FSSTATUS',
  SET_CALL_STATUS: 'SET_CALL_STATUS',
  SET_HOLD: 'SET_HOLD'
}

//action creator
export const setFsStatus = createAction(actionTypes.SET_FSSTATUS,fsStatus=>({fsStatus}));
export const setCallStatus = createAction(actionTypes.SET_CALL_STATUS, callStatus=>({callStatus}));
export const setHoldStatus = createAction(actionTypes.SET_HOLD, holdStatus=>({holdStatus}));

// init-state
const initialState = {//初始化state
  fsStatus: '',
  callStatus: '',
  holdStatus: {
    remote: false,
    local: false
  }
};

// reducer
const reducer = createReducer({
  [actionTypes.SET_FSSTATUS](state, action){
    let { payload } = action;
    return {...state,...payload};
  },
  [actionTypes.SET_CALL_STATUS](state, action){
    let { payload } = action;
    return {...state,...payload};
  },
  [actionTypes.SET_HOLD](state, action){
    let { payload } = action;
    return {...state,...payload};
  }
},initialState);

// 原生的写法将被redux-actions取代，原生太啰嗦
// export function setCallStatus(callStatus) {//action creator
//   return {
//     type: actionTypes.SET_CALL_STATUS,
//     payload: {
//       callStatus
//     }
//   }
// }
// const reducer = (state = initialState, action) => { // reducer
//   switch (action.type) {
//     case actionTypes.SET_FSSTATUS:
//       return { ...state, ...action.payload };
//     case actionTypes.SET_CALL_STATUS:
//       return { ...state, ...action.payload };
//     case actionTypes.SET_HOLD:
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// }

// store
const store = createStore(reducer);

export default store;