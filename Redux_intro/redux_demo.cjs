const { createStore } = require("redux");

const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  if (action.type === "increment") {
    return { value: state.value + 1 };
  } else if (action.type === "decrement") {
    return { value: state.value - 1 };
  } else {
    return state;
  }
}

const store = createStore(counterReducer);

for (let i = 0; i < 5; i++) {
  store.dispatch({ type: "increment" });
}
console.log(store.getState().value);

store.dispatch({ type: "decrement" });
console.log(store.getState().value);
