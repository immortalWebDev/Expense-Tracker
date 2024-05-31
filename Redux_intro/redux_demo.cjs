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
  } 
  else if(action.type === "incrementby2"){
    return {value: state.value + 2};
  }
  else if(action.type === "decrementby2"){
    return {value: state.value - 2};
  }
    else {
    return state;
  }
}

// Create a redux store by passing the reducer function
const store = createStore(counterReducer);

// Subscriber function to log the current state
const counterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState);
};

// Subscribe to state changes
store.subscribe(counterSubscriber);

// Dispatching 5 times 'increment' action to store
for (let i = 0; i < 5; i++) {
  store.dispatch({ type: "increment" });
}

// Dispatch 'decrement' action once
store.dispatch({ type: "decrement" });

// Dispatch 'incrementby2' action
store.dispatch({ type: "incrementby2" });

// Dispatch 'decrementby2' action
store.dispatch({ type: "decrementby2" });