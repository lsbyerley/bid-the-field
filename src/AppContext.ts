import { createContext, useContext } from 'react';

import { AppContextVals } from '@/types';

export const defaultValues = {
  isDev: false,
  modalOpen: false,
  modalContent: '',
  setModalOpen: () => {},
  setModalContent: () => {},
};

const AppContext = createContext<AppContextVals>(defaultValues);

export default AppContext;

export const useAppContext = () => useContext(AppContext);
