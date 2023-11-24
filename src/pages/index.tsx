import * as React from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { TypographyH1, TypographyH2, TypographyInlineCode, TypographyP } from '@/components/ui/typography';
import { prettifyCalendarName } from '@/utils/string.util';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/button';
import { useToast } from '@/ui/use-toast';

import Combobox from '@/element/ComboBox';

import CALENDARS, { BASEPATH } from '@/constant/Calendars';

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
    <>
      <Head>
        <title>Calendrier Alcuin</title>
      </Head>

      <main className="container flex flex-col py-12">
        <TypographyH1>Calendrier Alcuin</TypographyH1>

        <TypographyP className="mb-2">
          Alcuin Scraper est un outils permettant de bénéficier des informations relatives au calendrier que vous pouvez
          retrouver sur Alcuin et sur MyESAIP sur le calendrier natif de votre téléphone. Nous avons également ajouté
          une fonctionnalité permettant de mettre des informations relatives aux devoirs et examens pour les cours, le
          tout synchronisé. Un guide d&apos;installation est disponible sur{' '}
          <Link href="/guide" className="font-medium underline underline-offset-4">
            cette page
          </Link>
          .
        </TypographyP>

        <TypographyH2>Attention !</TypographyH2>
        <TypographyP className="mb-6 ">
          Cette application est encore en version Beta, quelques bugs peuvent survenir, si vous rencontrez un problème,
          vous pouvez envoyer un mail à <TypographyInlineCode>lukas.ldrn@gmail.com</TypographyInlineCode>. D&apos;une
          autre part, faites attention à la synchronisation, entre ce que vous pouvez voir sur MyEsaip ou Alcuin et le
          calendrier, il peut y avoir un délai de 24 heures.
        </TypographyP>

        <TypographyH2>Installation</TypographyH2>
        <TypographyP className="mb-6">
          Veuillez sélectionner la catégorie correspondant à votre filière ainsi que la filière dans laquelle vous êtes.
        </TypographyP>

        <div className="flex flex-col gap-4">
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

        <p className="text-sm mx-auto mt-12">Lukas Laudrain - Alex Fougeroux 2023</p>
      </main>
    </>
  );
}
