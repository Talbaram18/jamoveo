import { useState } from 'react';
/**
 * Custom hook for toggle state management
 * Provides a boolean state to toggle or set its value

 */
export function useToggle(initialState = false) {
  // State to track the toggled status

  const [isToggled, setIsToggled] = useState(initialState);

  const toggle = () => setIsToggled((prev) => !prev);
  const setOn = () => setIsToggled(true);
  const setOff = () => setIsToggled(false);

  return {
    isToggled,
    toggle,
    setOn,
    setOff,
    setIsToggled,
  };
}
