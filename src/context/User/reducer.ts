interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identification: string;
  phone: string;
  userImg: string;
  isFreelancer: boolean;
  subscriptionStart: Date;
  subscriptionEnd: Date;
  isVerified: boolean;
  warningCount: number;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan: string;
  level: number;
  followers: string[];
  following: string[];
}

interface UserGig {
  id: string;
  title: string;
  description: string;
  price: number;
  gigImg: string;
  status: string;
  userId: string;
  created_at: string;
}
type InitialState = {
  userData: UserData;
  userGigs: UserGig[]
}

const initialState: InitialState = {
  userData: {} as UserData,
  userGigs: []
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    INIT: () => {
      return {
        ...state,
        userData: action.payload.data as UserData
      };
    },
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 