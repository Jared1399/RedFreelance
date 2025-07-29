//here you just update the state
interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

interface Gig {
  id?: string;
  title: string;
  description: string;
  price: number;
  status: "active" | "inactive" | "completed";
  userId: string;
}

type InitialState = {
  gigList: Array<Gig>;
}

const initialState: InitialState = {
  gigList: [],
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    INIT: () => {
      return {
        ...state,
        gigList: action.payload.gigs as []
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 