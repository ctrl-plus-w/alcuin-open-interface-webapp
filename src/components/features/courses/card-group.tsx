import { useMemo, useRef, useState } from 'react';

import Card from './card';
import { generateArray } from '@/utils/array.util';
import debounce from 'lodash.debounce';

import { cn } from '@/lib/utils';

interface IProps {
  courses: Database.ICourse[];
  highlightedCourses?: Database.ICourse[];

  onEditCb?: VoidFunction;

  className?: string;
}

const CardGroup = ({ courses, onEditCb, highlightedCourses = [], className }: IProps) => {
  const groupContainerRef = useRef<HTMLDivElement>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const [visibleCourseIndex, setVisibleCourseIndex] = useState(0);

  const handleEndScroll = useMemo(() => debounce(() => setIsScrolling(false), 200), []);

  const handleScroll = () => {
    if (!groupContainerRef.current) return;

    const firstChild = groupContainerRef.current.children[0];
    const firstChildHeight = firstChild.getBoundingClientRect().height;

    const _visibleCourseIndex = Math.round(groupContainerRef.current.scrollTop / firstChildHeight);
    setVisibleCourseIndex(_visibleCourseIndex);

    setIsScrolling(true);
    handleEndScroll();
  };

  const handleTouchStart = () => {
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  return (
    <div className="flex flex-row w-full gap-2 px-3">
      <div
        className={cn(
          'relative flex flex-col w-full gap-2 rounded-md',
          // (isScrolling || isTouching) && 'bg-purple-100',
          'transition-all duration-200',
          className,
        )}
      >
        {courses.length > 1 ? (
          <>
            <Card course={courses[0]} className="invisible" />

            <div
              className={cn(
                'absolute inset-0 flex flex-col gap-2 overflow overflow-scroll snap-y snap-mandatory no-scrollbar',
                (isScrolling || isTouching) && 'transform scale-95',
                'transition-all duration-200',
              )}
              ref={groupContainerRef}
              onScroll={handleScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {courses.map((course) => (
                <Card
                  key={course.id}
                  course={course}
                  onEditCb={onEditCb}
                  highlighted={!!highlightedCourses.find(({ id }) => course.id === id)}
                  className="flex-shrink-0 snap-center"
                />
              ))}
            </div>
          </>
        ) : (
          <Card
            course={courses[0]}
            onEditCb={onEditCb}
            highlighted={!!highlightedCourses.find(({ id }) => courses[0].id === id)}
          />
        )}
      </div>

      {courses.length > 1 && (
        <div className="flex flex-col gap-1 justify-center">
          {generateArray(courses.length, 0).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full bg-muted-foreground',
                i === visibleCourseIndex && 'bg-foreground',
                courses[i].description !== '' && 'outline outline-1 outline-offset-1 outline-foreground',
              )}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardGroup;
