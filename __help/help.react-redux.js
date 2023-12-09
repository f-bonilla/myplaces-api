// Define the Redux store
import { createStore } from "redux";

const initialState = {
  items: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

// Use the Redux store in a React component
import { useSelector, useDispatch } from "react-redux";

function ItemList() {
  const items = useSelector((state) => state.items);
  const dispatch = useDispatch();

  function handleAddItem(item) {
    dispatch({ type: "ADD_ITEM", payload: item });
  }

  function handleUpdateItem(item) {
    dispatch({ type: "UPDATE_ITEM", payload: item });
  }

  function handleDeleteItem(id) {
    dispatch({ type: "DELETE_ITEM", payload: id });
  }

  // Render the list of items and pass down the handlers as props
  // ...
}
