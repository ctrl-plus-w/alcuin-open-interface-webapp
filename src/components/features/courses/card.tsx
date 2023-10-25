import { useState } from 'react';

import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';
import { Textarea } from '@/ui/textarea';
import { useToast } from '@/ui/use-toast';

import useCoursesRepository from '@/hook/useCoursesRepository';

import { getSimpleTime } from '@/util/date.util';
import { onChange } from '@/util/react.util';

import { cn } from '@/lib/utils';

interface IProps {
  course: Database.ICourse;

  highlighted?: boolean;
  onEditCb?: VoidFunction;

  className?: string;
}

const Card = ({ course, onEditCb, highlighted, className }: IProps) => {
  const coursesRepository = useCoursesRepository();

  const { toastError } = useToast();

  const [notes, setNotes] = useState(course.description);

  /**
   * onSubmit even when the user edit the note
   */
  const onSubmit = async () => {
    try {
      await coursesRepository.update(course.id, { description: notes });
      onEditCb && onEditCb();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          'w-full bg-purple-200 rounded-md text-sm overflow-hidden',
          highlighted && 'outline-dashed outline-offset-2 outline-purple-800',
          className,
        )}
      >
        <div className="flex flex-col items-start m-2">
          <p className="truncate w-full text-left text-purple-700 font-semibold">
            {course.description !== '' ? '⚠️ ' : ''}
            {course.title}
          </p>

          <p className="text-purple-700 text-xs">{course.location ?? 'Pas de location'}</p>
          <p className="text-purple-700 text-xs">
            {[course.start_datetime, course.end_datetime].map((d) => getSimpleTime(new Date(d))).join(' - ')}
          </p>
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col  gap-4">
        <SheetHeader className="text-left">
          <SheetTitle>Modification des notes</SheetTitle>
          <SheetDescription>
            Lorsque vous ajoutez des notes sur un cours, ces notes seront vues par tous le monde, veillez à revérifier
            ce que vous marquez avant d&apos;enregister vos modifications.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-1 w-full bg-purple-200 rounded-md p-2 overflow-hidden">
          <p className="truncate w-full text-purple-700 font-semibold">
            {course.description !== '' ? '⚠️ ' : ''}
            {course.title}
          </p>

          <div className="flex w-full justify-between text-purple-700 text-sm">
            <p>{course.location ?? 'Pas de location'}</p>
            <p>{[course.start_datetime, course.end_datetime].map((d) => getSimpleTime(new Date(d))).join(' - ')}</p>
          </div>
        </div>

        <Label htmlFor="note">Notes</Label>
        <Textarea id="notes" value={notes} onChange={onChange(setNotes)} />

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={onSubmit}>Modifier la note</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Card;
