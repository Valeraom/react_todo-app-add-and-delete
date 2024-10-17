import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const changeError = useCallback(debounce(setErrorMessage, 3000), []);

  const resetError = () => {
    changeError('');
  };

  useEffect(() => {
    if (errorMessage) {
      resetError();
    }
  }, [errorMessage]);

  return { errorMessage, setErrorMessage };
};
