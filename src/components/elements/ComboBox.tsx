import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IProps {
  placeholder?: string;

  currentValue: string;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;

  values: {
    label: string;
    value: string;
  }[];
}

export default function Combobox({ placeholder, currentValue, setCurrentValue, values }: IProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {currentValue
            ? values.find(({ value }) => value === currentValue)?.label
            : placeholder ?? 'Select a value...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>Aucune promotion trouvée.</CommandEmpty>
          <CommandGroup>
            {values.map((value) => (
              <CommandItem
                key={value.value}
                onSelect={(_value) => {
                  setCurrentValue(_value === currentValue ? '' : _value);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', currentValue === value.value ? 'opacity-100' : 'opacity-0')} />
                {value.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
