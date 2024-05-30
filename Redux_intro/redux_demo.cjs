const { createStore } = require("redux");

//Inital state for counter is 0
const initialState = { value: 0 };

//Reducer function to handle state updates
function counterReducer(state = initialState, action) {
  //if action type is "increment" return new state object with value increased by 1
  if (action.type === "increment") {
    return { value: state.value + 1 };
    //if action type is "decrement" return new state object with value decreased by 1
  } else if (action.type === "decrement") {
    return { value: state.value - 1 };

    //else if action type is unknown or unhandles then return present state
  } else {
    return state;
  }
}

//Create a redux store by passing reducer function //dont worry about deprecated warning
const store = createStore(counterReducer);

//Now dispatching 5 times 'increment' action to store
for (let i = 0; i < 5; i++) {
  store.dispatch({ type: "increment" });
}

//then log current value after 5 'increment'
console.log(store.getState().value); //5

//dispatch decrement action once
store.dispatch({ type: "decrement" });
console.log(store.getState().value);
