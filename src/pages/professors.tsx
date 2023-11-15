import * as React from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/button';
import { TypographyH1, TypographyP } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import Combobox from '@/element/ComboBox';

import supabase from '@/instance/supabaseAdmin';

import { BASEPATH } from '@/constant/Calendars';

export const getServerSideProps = (async () => {
  try {
    const { data } = await supabase.rpc('get_professors');

    const professors = data.filter((el: string) => !el.match(/.*[0-9].*/)) as string[];

    return { props: { professors } };
  } catch (err) {
    console.error(err);
    return { props: { professors: [] } };
  }
}) satisfies GetServerSideProps<{ professors: string[] }>;

export default function ProfessorsHome({ professors }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { toast } = useToast();

  const [currentProfessor, setCurrentProfessor] = React.useState('');

  const professorsValues = React.useMemo(
    () => professors.map((label) => ({ value: label.toLowerCase(), label })),
    [professors],
  );

  const onClick = () => {
    const professor = professorsValues.find(({ value }) => value === currentProfessor);
    if (!professor) return;

    const url = new URL(`${BASEPATH}/professors`, window.location.origin);
    url.searchParams.set('name', professor.label);

    try {
      navigator.clipboard.writeText(url.href);

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
        <title>Alcuin Scrapper</title>
      </Head>

      <main className="container flex flex-col py-12">
        <TypographyH1>Calendrier Alcuin - Professeurs</TypographyH1>

        <TypographyP className="mb-6">
          Alcuin Scraper est un outils permettant de bénéficier des informations relatives au calendrier que vous pouvez
          retrouver sur Alcuin et sur MyESAIP sur le calendrier natif de votre téléphone. Nous avons également ajouté
          une fonctionnalité permettant de mettre des informations relatives aux devoirs et examens pour les cours, le
          tout synchronisé. Un guide d&apos;installation est disponible sur{' '}
          <Link href="/guide" className="font-medium underline underline-offset-4">
            cette page
          </Link>
          .
        </TypographyP>

        <div className="flex flex-col gap-4">
          <Combobox
            values={professorsValues}
            placeholder="Sélectionner la catégorie"
            {...{ currentValue: currentProfessor, setCurrentValue: setCurrentProfessor }}
          />
          <Button className="w-full" disabled={currentProfessor === ''} onClick={onClick}>
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
        </div>

        <p className="text-sm mx-auto mt-12">Lukas Laudrain - Alex Fougeroux 2023</p>
      </main>
    </>
  );
}
