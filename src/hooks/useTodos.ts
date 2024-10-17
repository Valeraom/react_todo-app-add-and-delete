import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';
import { useError } from './useError';
import { getCompletedTodos } from '../utils/getCompletedTodos';
import { FilterType } from '../types/FilterType';
import { filterTodos } from '../utils/filterTodos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const { errorMessage, setErrorMessage } = useError();

  const loadTodos = () => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(loadTodos, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const newTempTodo = { ...newTodo, id: 0 };

    setTempTodo(newTempTodo);
    setLoadingTodoIds(current => [...current, newTempTodo.id]);

    return todosService
      .createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch((error: Error) => {
        setErrorMessage('Unable to add a todo');

        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(loadingTodoId => loadingTodoId !== newTempTodo.id),
        );
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    return todosService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(current => current.filter(todo => todo.id !== todoId)),
      )
      .catch((error: Error) => {
        setErrorMessage('Unable to delete a todo');

        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(current =>
          current.filter(loadingTodoId => loadingTodoId !== todoId),
        ),
      );
  };

  const deleteCompletedTodo = () => {
    const completedTodoIds = getCompletedTodos(todos);

    Promise.allSettled(completedTodoIds.map(todoId => deleteTodo(todoId)));
  };

  const filteredTodos = useMemo(
    () => filterTodos(todos, { filter }),
    [todos, filter],
  );

  return {
    todos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    addTodo,
    deleteTodo,
    deleteCompletedTodo,
    filteredTodos,
    filter,
    setFilter,
  };
};
