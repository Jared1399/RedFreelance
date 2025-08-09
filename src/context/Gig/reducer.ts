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
  user: {
    userImg: string;
    firstName: string;
  }
}

interface Category {
  description: string
  gigId: string
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

type InitialState = {
  gigList: Array<Gig>;
  categoryInfo: Category
}

const initialState: InitialState = {
  gigList: [],
  categoryInfo: {} as Category
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    SET_GIG_LIST: () => {
      return {
        ...state,
        gigList: action.payload.gigs as []
      };
    },
    SET_CATEGORY_INFO: () => {
      return {
        ...state,
        categoryInfo: action.payload.categoryInfo as Category
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 