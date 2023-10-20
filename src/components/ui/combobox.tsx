'use client';

import * as React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

import { cn } from '@/lib/utils';

type Value = {
  value: string;
  label: string;
};

interface IProps {
  data: string[];

  selectPlaceholder?: string;
  emptyMessage?: string;

  item: Value | null;
  setItem: React.Dispatch<React.SetStateAction<Value | null>>;
}

export function Combobox({ data, item, setItem, selectPlaceholder, emptyMessage }: IProps) {
  const [open, setOpen] = React.useState(false);

  const items = React.useMemo(() => {
    return data.map((label) => ({ value: label.toLowerCase(), label }));
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {item ? items.find((_item) => _item.value === item.value)?.label : selectPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command className="max-h-96">
          <CommandInput placeholder={selectPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="overflow-scroll">
            {items.map((_item) => (
              <CommandItem
                key={_item.value}
                value={_item.value}
                onSelect={(selectedItemValue) => {
                  if (item && selectedItemValue === item.value) {
                    setItem(null);
                  } else {
                    const selectedItem = items.find(({ value }) => value === selectedItemValue);
                    if (selectedItem) setItem(selectedItem);
                  }

                  setOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', item && item.value === _item.value ? 'opacity-100' : 'opacity-0')}
                />
                {_item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
