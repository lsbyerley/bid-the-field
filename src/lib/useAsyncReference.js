// Major props to this article on stale state in react
// https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
import { useRef, useState } from 'react';

const useAsyncReference = (value, isProp = false) => {
  const ref = useRef(value);
  const [, forceRender] = useState(false);

  const updateState = (newState) => {
    ref.current = newState;
    forceRender((s) => !s);
  };

  if (isProp) {
    ref.current = value;
    return ref;
  }

  return [ref, updateState];
};

export default useAsyncReference;
