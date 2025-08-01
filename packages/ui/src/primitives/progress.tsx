'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../lib/utils';

const Root = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>>(
  ({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn('bg-secondary relative h-4 w-full overflow-hidden rounded-full', className)} {...props}>
      <ProgressPrimitive.Indicator
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Root.displayName = ProgressPrimitive.Root.displayName;

export { Root as Progress };
