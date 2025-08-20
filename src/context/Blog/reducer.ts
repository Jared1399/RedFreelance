//here you just update the state
interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}


type InitialState = {
  blogList: [],
  blogDetail: {}
}

const initialState: InitialState = {
  blogList: [],
  blogDetail: {}
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    SET_BLOG_LIST: () => {
      return {
        ...state,
        blogList: action.payload.blogs as []
      };
    },
    SET_BLOG_DETAIL: () => {
      return {
        ...state,
        blogDetail: action.payload.blogDetail as {}
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 