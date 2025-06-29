import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface CalloutProps {
  icon?: string;
  children?: React.ReactNode;
  type?: 'default' | 'warning' | 'info';
}

export function Callout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <Alert
      className={cn('my-6', {
        'bg-accent text-accent-foreground border-red-200 dark:border-red-200/30 dark:text-red-200': type === 'warning',
        'bg-accent text-accent-foreground border-blue-200 dark:border-blue-200/30 dark:text-blue-200': type === 'info',
      })}
      {...props}
    >
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      {children}
    </Alert>
  );
}
