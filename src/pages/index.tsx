import * as React from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/button';
import { useToast } from '@/ui/use-toast';

import Combobox from '@/element/ComboBox';

import CALENDARS, { BASEPATH } from '@/constant/Calendars';

const prettifyCalendarName = (name: string) => {
  if (!name.startsWith('23_24')) return name.replaceAll('_', ' ');
  return name.replaceAll('_', ' ');
};

export default function Home() {
  const { toast } = useToast();

  const [currentCategory, setCurrentCategory] = React.useState('');
  const [currentValue, setCurrentValue] = React.useState('');

  React.useEffect(() => {
    setCurrentValue('');
  }, [currentCategory]);

  const dropdownCategoriesValues = React.useMemo(() => {
    return Object.keys(CALENDARS).map((value) => ({ value: value.toLocaleLowerCase(), label: value }));
  }, []);

  const dropdownValues = React.useMemo(() => {
    const category = dropdownCategoriesValues.find(({ value }) => value === currentCategory);
    if (!category) return [];

    const calendars = CALENDARS[category.label as keyof typeof CALENDARS];

    return calendars.map((calendar) => ({
      value: prettifyCalendarName(calendar).toLocaleLowerCase(),
      label: prettifyCalendarName(calendar),
      calendar: calendar,
    }));
  }, [currentCategory, dropdownCategoriesValues]);

  const onClick = () => {
    const calendar = dropdownValues.find(({ value }) => value === currentValue);
    if (!calendar) return;

    const url = `${window.location.origin}/${BASEPATH}/${calendar.calendar}`;

    try {
      navigator.clipboard.writeText(url);

      toast({
        title: 'Copié !',
        description: 'Le lien a été copié, vous pouvez le coller dans votre application de calendrier préféré.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="h-[100svh] flex justify-center pt-32">
      <Head>
        <title>Alcuin Scrapper</title>
      </Head>

      <div className="flex flex-col gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Calendrier Alcuin</h1>
        <p className="mb-6">
          Par <strong>Alex Fougeroux</strong> et <strong>Lukas Laudrain</strong>.
        </p>

        <Combobox
          values={dropdownCategoriesValues}
          placeholder="Sélectionner la catégorie"
          {...{ currentValue: currentCategory, setCurrentValue: setCurrentCategory }}
        />
        {currentCategory !== '' && (
          <Combobox
            values={dropdownValues}
            placeholder="Sélectionner la filière."
            {...{ currentValue, setCurrentValue }}
          />
        )}

        <Button className="w-full" disabled={currentValue === ''} onClick={onClick}>
          Copier 🎉
        </Button>

        <div className="flex items-center gap-2 text-zinc-300 my-2">
          <div className="w-full h-[2px] bg-zinc-300"></div>
          <p>OU</p>
          <div className="w-full h-[2px] bg-zinc-300"></div>
        </div>

        <Link href="/guide" className="w-full">
          <Button className="flex items-center gap-2 w-full" variant="outline">
            Guides d&apos;installation <ArrowRight strokeWidth={1.5} />
          </Button>
        </Link>

        <Link href="/auth" className="w-full">
          <Button className="w-full">Se connecter</Button>
        </Link>
      </div>
    </main>
  );
}
