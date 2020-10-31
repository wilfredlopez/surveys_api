import { useContext, Context } from 'react'

export default function createContextHook<T extends {}>(
  theContext: React.Context<T>
): () => T

export default function createContextHook<
  T extends {},
  OutputObject extends {}
>(
  theContext: React.Context<T>,
  returnFunction: (context: T) => OutputObject
): () => OutputObject

export default function createContextHook<
  T extends {},
  OutputObject extends {}
>(
  theContext: Context<T>,
  returnFunction: (context: T) => OutputObject | T = ct => ({ ...ct })
) {
  function useContextHook() {
    const context = useContext(theContext)
    const obj = returnFunction(context)
    return { ...obj }
  }

  return useContextHook
}
