import { FC, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete?: (todoId: number) => Promise<void>;
};

export const TodoInfo: FC<Props> = ({
  todo,
  loadingTodoIds,
  onDelete = () => {},
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);

  const isLoading = loadingTodoIds.includes(id);

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: completed })}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
        <Loader isLoading={isLoading} />
      </div>
    </>
  );
};
