import { useCallback, useEffect, useState } from 'react';

import { addHours } from 'date-fns';

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

  useEffect(() => {
    setNotes(course.description);
  }, [course]);

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

  const CardContent = useCallback(
    () => (
      <div className="flex flex-col items-start m-2">
        <p className="text-muted-foreground text-xs">{course.location ?? 'Pas de location'}</p>
        <p className="truncate w-full text-left text-foreground font-semibold">
          {course.description !== '' ? '⚠️ ' : ''}
          {course.title}
        </p>

        <p className="text-foreground text-xs mt-3">
          {[course.start_datetime, course.end_datetime].map((d) => getSimpleTime(addHours(new Date(d), 1))).join(' - ')}
        </p>
      </div>
    ),
    [course],
  );

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          'w-full bg-[#20212E] border border-border rounded-md text-sm overflow-hidden',
          highlighted && 'outline-dashed outline-offset-2 outline-purple-800',
          className,
        )}
      >
        <CardContent />
      </SheetTrigger>

      <SheetContent className="flex flex-col  gap-4">
        <SheetHeader className="text-left">
          <SheetTitle>Modification des notes</SheetTitle>
          <SheetDescription>
            Lorsque vous ajoutez des notes sur un cours, ces notes seront vues par tous le monde, veillez à revérifier
            ce que vous marquez avant d&apos;enregister vos modifications.
          </SheetDescription>
        </SheetHeader>

        <CardContent />

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
