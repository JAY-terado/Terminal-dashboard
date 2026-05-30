import cn from '../utils/class-names';
import { formatDate } from '../utils/format-date';

interface UserDateCellProps {
  date: Date | string;
  user?: {
    full_name?: string;
  };
  className?: string;
  dateFormat?: string;
  timeFormat?: string;
}

export default function UserDateCell({
  date,
  user,
  className,
  dateFormat = 'DD/MM/YYYY',
  timeFormat = 'hh:mm A',
}: UserDateCellProps) {
  if (!date && !user?.full_name) {
    return <div className="text-gray-400">-</div>;
  }

  const dateValue = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className={cn('grid gap-0.5', className)}>
      {user?.full_name && (
        <span className="font-medium text-gray-900 text-[13px]" title={user.full_name}>
          {user.full_name}
        </span>
      )}
      {date && (
        <time
          dateTime={formatDate(dateValue, 'YYYY-MM-DD')}
          className="text-[12px] text-gray-500 truncate"
        >
          {formatDate(dateValue, `${dateFormat} ${timeFormat}`)}
        </time>
      )}
    </div>
  );
}
