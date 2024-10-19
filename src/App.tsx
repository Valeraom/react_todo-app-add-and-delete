/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { Footer } from './components/Footer';
import { countActiveTodos } from './utils/countActiveTodos';
import { areAllCompleted } from './utils/areAllCompleted';
import { areAllActive } from './utils/areAllActive';
import { Error } from './components/Error';
import { TodoInfo } from './components/TodoInfo';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    handleAddError,
    addTodo,
    deleteTodo,
    deleteCompletedTodo,
    filteredTodos,
    filter,
    setFilter,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          onSubmit={addTodo}
          onSetError={handleAddError}
          areAllCompleted={areAllCompleted(todos)}
          isLoading={Boolean(loadingTodoIds.length)}
          todos={todos}
          errorMessage={errorMessage}
        />

        {(Boolean(todos.length) || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              loadingTodoIds={loadingTodoIds}
              onDelete={deleteTodo}
            />
            {tempTodo && (
              <TodoInfo todo={tempTodo} loadingTodoIds={loadingTodoIds} />
            )}

            <Footer
              onAddFilter={setFilter}
              filter={filter}
              activeTodos={countActiveTodos(todos)}
              areAllActive={areAllActive(todos)}
              onDeleteCompletedTodos={deleteCompletedTodo}
            />
          </>
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onResetError={() => setErrorMessage('')}
      />
    </div>
  );
};
