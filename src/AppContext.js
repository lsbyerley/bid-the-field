import { createContext, useContext } from 'react';

export const defaultValues = {
  modalOpen: false,
  modalContent: '',
};

const AppContext = createContext(defaultValues);

export default AppContext;

export const useAppContext = () => useContext(AppContext);
