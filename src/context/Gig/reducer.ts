//here you just update the state
interface Action {
  type: string;
  payload: object;
}

type InitialState = {
  // TODO: ADD GIG TYPE
  // eslint-disable-next-line
  gigList: Array<any>;
}

const initialState: InitialState = {
  gigList: [],
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    INIT: () => {
      console.info(action.payload);
      return {
        ...state
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 