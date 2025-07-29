interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

interface Category {
  id?: string;
  name: string;
  description: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

type InitialState = {
  categoryList: Array<Category>;
}

const initialState: InitialState = {
  categoryList: [],
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    INIT: () => {
      return {
        ...state,
        categoryList: action.payload.gigs as []
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 