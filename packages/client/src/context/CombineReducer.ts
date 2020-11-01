export default function combineReducers<State = any, Actions = any>(
  ...reducers: React.Reducer<any, any>[]
): React.Reducer<State, Actions> {
  const red: React.Reducer<State, Actions> = (state, action) => {
    let states: State = { ...state }
    for (let r of reducers) {
      const innerState = r(state, action)
      states = { ...states, ...innerState }
    }
    return { ...states }
  }
  return red
}
