import React, { useState } from 'react';
import AppContext, { defaultValues } from '../AppContext';

const { Provider } = AppContext;

const AppContextProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(defaultValues.modalOpen);
  const [modalContent, setModalContent] = useState(defaultValues.modalContent);

  const state = {
    modalOpen,
    setModalOpen,
    modalContent,
    setModalContent,
  };

  return <Provider value={{ ...state }}>{children}</Provider>;
};

export default AppContextProvider;
