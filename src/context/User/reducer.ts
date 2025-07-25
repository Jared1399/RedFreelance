interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

type InitialState = {
  userData: object;
}

const initialState: InitialState = {
  userData: {},
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    INIT: () => {
      return {
        ...state,
        userData: action.payload.data as {}
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 