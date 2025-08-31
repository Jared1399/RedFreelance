interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

export interface Gig {
  id: string;
  title: string;
  userId: string;
}

type InitialState = {
  searchGigs: Gig[]
}

const initialState: InitialState = {
  searchGigs: []
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    SEARCH_GIGS: () => {
      return {
        ...state,
        searchGigs: action.payload.searchResults as Gig[]
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 