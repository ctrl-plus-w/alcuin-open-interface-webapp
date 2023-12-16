import * as React from 'react';
import { useMemo } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowRightIcon, MenuIcon } from 'lucide-react';

import * as Card from '@/ui/card';
import { Button } from '@/ui/button';
import { TypographyH1, TypographyH4, TypographyP } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import LandingSection from '@/module/LandingSection';

import Combobox from '@/element/ComboBox';

import { prettifyCalendarName } from '@/util/string.util';

import { cn } from '@/lib/utils';

import CALENDARS, { BASEPATH } from '@/constant/Calendars';

import dashboardExampleImage from '@/image/dashboard-example.png';
import gradesExampleImage from '@/image/grades-example.png';

export default function Home() {
  const { toast } = useToast();

  const [currentCategory, setCurrentCategory] = React.useState('');
  const [currentValue, setCurrentValue] = React.useState('');
  const [hasLinkBeenCopied, setHasLinkBeenCopied] = React.useState(false);

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

  const onCopy = async () => {
    const calendar = dropdownValues.find(({ value }) => value === currentValue);
    if (!calendar) return;

    const url = `${window.location.origin}/${BASEPATH}/${calendar.calendar}`;

    try {
      await navigator.clipboard.writeText(url);

      setHasLinkBeenCopied(true);

      toast({
        title: 'Copié !',
        description: 'Le lien a été copié, vous pouvez le coller dans votre application de calendrier préféré.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const steps = useMemo((): {
    label: string;
    isActive: boolean;
    setActive: VoidFunction;
    component: React.ReactNode;
  }[] => {
    return [
      {
        label: 'Sélectionnez la catégorie de votre promotion',
        isActive: currentCategory === '' && currentValue === '' && !hasLinkBeenCopied,
        setActive: () => {
          setCurrentCategory('');
          setCurrentValue('');
          setHasLinkBeenCopied(false);
        },
        component: (
          <Combobox
            values={dropdownCategoriesValues}
            placeholder="Catégorie de la promotion"
            {...{ currentValue: currentCategory, setCurrentValue: setCurrentCategory }}
          />
        ),
      },
      {
        label: 'Sélectionnez vôtre promotion',
        isActive: currentCategory !== '' && currentValue === '' && !hasLinkBeenCopied,
        setActive: () => {
          setCurrentValue('');
          setHasLinkBeenCopied(false);
        },
        component: (
          <Combobox
            values={dropdownValues}
            placeholder="Filière de la promotion"
            {...{ currentValue, setCurrentValue }}
          />
        ),
      },
      {
        label: 'Copiez le lien',
        isActive: currentCategory !== '' && currentValue !== '' && !hasLinkBeenCopied,
        setActive: () => {
          setHasLinkBeenCopied(false);
        },
        component: (
          <>
            <TypographyH4 className="uppercase">{currentValue}</TypographyH4>
            <Button className="w-full" onClick={onCopy}>
              Copier 🎉
            </Button>
          </>
        ),
      },
      {
        label: 'Suivez le guide adéquat',
        isActive: hasLinkBeenCopied,
        setActive: () => null,
        component: <>Guides d&apos;installation...</>,
      },
    ];
  }, [
    currentCategory,
    currentValue,
    hasLinkBeenCopied,
    dropdownValues,
    dropdownCategoriesValues,
    setCurrentCategory,
    setCurrentValue,
    setHasLinkBeenCopied,
    onCopy,
  ]);

  return (
    <>
      <Head>
        <title>Calendrier Alcuin</title>
      </Head>

      <nav className="z-50 fixed left-0 top-0 right-0 backdrop-blur-xl px-5 py-4 border-b border-border">
        <ul className="hidden md:flex items-center justify-center gap-20">
          {[
            {
              label: 'Accueil',
              href: '#home',
            },
            {
              label: 'Fonctionnalités',
              href: '#features',
            },
            {
              label: 'Installation',
              href: '#installation',
            },
            {
              label: 'Informations générales',
              href: '#informations',
            },
          ].map(({ label, href }) => (
            <li key={href} className="hover:text-muted-foreground transition-colors duration-300">
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>

        <Button className="absolute right-5 top-1/2 transform -translate-y-1/2" asChild>
          <Link href="/auth">Se connecter</Link>
        </Button>

        <button className="flex md:hidden items-center justify-center ml-auto">
          <MenuIcon />
        </button>
      </nav>

      <main className="flex flex-col">
        <section className="flex flex-col items-center justify-center gap-8 min-h-screen px-4 md:py-32" id="home">
          <TypographyH1 className="text-2xl md:max-w-4xl text-center mx-3">
            Alcuin Open Calendar est un outils de simplification et de généralisation d’accès aux emplois du temps et
            aux notes
          </TypographyH1>

          <Button variant="outline" className="mb-6" asChild>
            <Link href="#installation">
              Installer le calendrier <ArrowRightIcon />
            </Link>
          </Button>

          <Image
            src={dashboardExampleImage}
            alt="Exemple du dashboard"
            className="w-full md:w-10/12 rounded border border-border shadow-2xl shadow-blue-500/20"
          />
        </section>

        <LandingSection title="Fonctionnalités de gestion de l’emplois du temps" id="features">
          <div className="flex flex-col md:flex-row gap-7 max-w-5xl">
            <Card.Card className="flex-grow">
              <Card.CardHeader>
                <Card.CardTitle>Un manière plus simple d’accéder au calendrier</Card.CardTitle>
              </Card.CardHeader>
              <Card.CardContent>
                <TypographyP>
                  Marre d’aller tous les jours sur MyESAIP pour regarder dans quelle salle vous avez cours ? Grâce à
                  AOC, entrez un lien dans votre calendrier favoris afin d’avoir toutes les informations nécessaires.
                </TypographyP>
              </Card.CardContent>
            </Card.Card>

            <Card.Card className="flex-grow">
              <Card.CardHeader>
                <Card.CardTitle>Une synchronisation des devoirs / examens inter-promotion</Card.CardTitle>
              </Card.CardHeader>
              <Card.CardContent>
                <TypographyP>
                  Grâce à l’application web, vous pouvez mettre les devoirs et évaluations pour les cours à venir. Ces
                  informations seront ensuite affichés sur les calendriers natifs des utilisateurs.
                </TypographyP>
              </Card.CardContent>
            </Card.Card>
          </div>
        </LandingSection>

        <LandingSection title="Fonctionalités de gestion des notes / système ECTS" className="relative">
          <div className="relative md:w-1/2 md:mt-32">
            {/*md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2*/}
            <Image
              src={gradesExampleImage}
              alt="Exemple du dashboard des notes"
              className={cn(
                'w-full  rounded border border-border',
                'shadow-2xl shadow-blue-500/20',
                'mb-7',
                'transform scale-110 md:transform-none',
              )}
            />

            <Card.Card className="md:absolute md:left-0 md:top-0 md:max-w-2xl md:transform md:-translate-x-1/4 md:-translate-y-1/3">
              <Card.CardHeader>
                <Card.CardTitle>Accédez à vos notes plus rapidement que jamais</Card.CardTitle>
              </Card.CardHeader>
              <Card.CardContent>
                <TypographyP>
                  Le site d’alcuin est compliqué à naviguer ? Vous ne vous y retrouvez pas ? Sur l’application web
                  d’AOC, vous pourrez retrouver vos notes ainsi que les moyennes calculés des unités d’enseignements et
                  des modules que vous avez.
                </TypographyP>
              </Card.CardContent>
            </Card.Card>
          </div>
        </LandingSection>

        <LandingSection
          title="Installation du calendrier sur les systèmes informatiques"
          id="installation"
          className="text-center"
        >
          <div className="md:w-full md:max-w-4xl flex flex-col md:flex-row md:items-center md:mt-24">
            <div className="w-full gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12 mb-8 grid grid-cols-[auto_auto]">
              {steps.map(({ label, isActive, setActive }, index) =>
                [`${index}.`, label].map((content, _index) => (
                  <button
                    onClick={setActive}
                    className={cn(
                      'flex items-start md:text-xl',
                      !isActive && 'text-muted-foreground',
                      _index ? 'text-left' : 'text-right',
                    )}
                    key={content}
                  >
                    {content}
                  </button>
                )),
              )}
            </div>

            <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
              {steps.find(({ isActive }) => isActive)?.component ?? <></>}
            </div>
          </div>
        </LandingSection>

        <LandingSection title="Informations générales et disclaimer" id="informations">
          <div className="max-w-6xl gap-14 grid grid-cols-2 grid-rows-2 mt-2">
            <div className="flex flex-col items-start">
              <TypographyH4>Open source et sécurité</TypographyH4>
              <TypographyP>
                Ce projet s’inscrit dans une démarche éducative et à pour but d’être Open Source, pour le moment, seule
                l’application web est Open Source. D’une autre part, lorsque vous rentrez vos mots de passes Alcuin sur
                l’application, ceux-ci sont encryptés (dans la base de donnée) et décryptés lors de leur utilisation
                afin de récupérer vos notes.
              </TypographyP>
            </div>

            <div className="flex flex-col items-start">
              <TypographyH4>Régulation de l’accès et version publique</TypographyH4>
              <TypographyP>
                L’accès à l’application web (interface d’accès pour les devoirs et les notes) n’es pas encore publique.
                Si vous souhaitez y accéder, n’hésitez pas à envoyer un courriel à llaudrain.ing2027@esaip.org. (Même si
                cette interface n’es pas encore publique, quiconque demande peut y avoir accès).
              </TypographyP>
            </div>

            <div className="flex flex-col items-start">
              <TypographyH4>Beta et bugs</TypographyH4>
              <TypographyP>
                Développé par Lukas Laudrain, ce projet est encore au stade expérimental, il est donc possible que vous
                rencontriez des bugs lors de son utilisation. Dans ce cas, vous pouvez envoyer un courriel à
                llaudrain.ing2027@esaip.org.
              </TypographyP>
            </div>
          </div>
        </LandingSection>
      </main>

      <footer className="flex justify-center gap-12 w-full backdrop-blur-xl px-5 py-4 border-t border-border">
        <TypographyP className="text-sm">
          Alcuin Open Calendar - Lukas Laudrain 2023 | Contact : llaudrain.ing2027@esaip.org
        </TypographyP>
      </footer>
    </>
  );
}
