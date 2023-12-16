import { Dispatch, SetStateAction } from 'react';

import { addDays, format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/ui/button';
import { Calendar } from '@/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

import useTailwindBreakpoint from '@/hook/useTailwindBreakpoints';

interface IProps {
  relativeDate: Date;
  setRelativeDate: Dispatch<SetStateAction<Date>>;
}

const DatePicker = ({ relativeDate, setRelativeDate }: IProps) => {
  const breakpoint = useTailwindBreakpoint();

  const onCalendarNext = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDate((d) => addDays(d, 1));
    } else {
      setRelativeDate((d) => addDays(d, 7));
    }
  };

  const onCalendarPrevious = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDate((d) => subDays(d, 1));
    } else {
      setRelativeDate((d) => subDays(d, 7));
    }
  };

  return (
    <div className="flex gap-2 flex-shrink-0 flex-1 md:flex-grow-0">
      <Button onClick={onCalendarPrevious} variant="outline">
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex-1 whitespace-nowrap">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(relativeDate, 'EEE dd LLLL', { locale: fr })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar mode="single" selected={relativeDate} onSelect={(_d) => _d && setRelativeDate(_d)} locale={fr} />
        </PopoverContent>
      </Popover>

      <Button onClick={onCalendarNext} variant="outline">
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DatePicker;
