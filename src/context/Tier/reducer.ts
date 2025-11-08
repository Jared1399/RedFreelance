interface Action {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
  updatedAt: Date;

}

type InitialState = {
  tierList: Tier[]
}

const initialState: InitialState = {
  tierList: []
};

const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    ADD_TIER: () => {
      return {
        ...state,
        tierList: [
          ...state.tierList,
          action.payload.newTier as Tier
        ]
      };
    },
    REMOVE_TIER: () => {
      return {
        ...state,
        tierList: [
          ...state.tierList
            .filter((t) => t.localId != action.payload.localId)
        ]
      };
    },
    UPDATE_TIER: () => {
      const tierToUpdate = action.payload.tierToUpdate as Tier;

      return {
        ...state,
        tierList: state.tierList.map((t) =>
          t.localId === tierToUpdate.localId
            ? action.payload.tierToUpdate
            : t
        ) as Tier[],
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 