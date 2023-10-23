import Head from 'next/head';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';

const GuidePage = () => {
  return (
    <main className="min-h-[100svh] flex flex-col p-4 gap-2">
      <Head>
        <title>Alcuin Scrapper</title>
      </Head>

      <Link href="/" className="flex items-center gap-2">
        <ArrowLeft strokeWidth={1.5} /> Retour à l&apos;accueil
      </Link>

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Guide d&apos;installation</h1>

      {/* <p>Bienvenue sur le guide d&apos;installation, il est nécessaire pour tous les tutoriels d&apos;avoir au préalable copié le liens correspondant à sa formation.</p> */}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Calendrier Apple</AccordionTrigger>
          <AccordionContent>
            <video
              src="/apple-guide.mov"
              controls
              className="aspect-[320/682.6] max-w-xs w-full border-4 border-black rounded-xl overflow-hidden"
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Calendrier Google (Android)</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              Attention ! Si vous avez l&apos;application Calendrier Google installée, lorsque que vous vous rendrez sur
              la version web, celle-ci peut vous rediriger automatiquement sur l&apos;application. Cependant, il
              n&apos;est possible d&apos;ajouter un calendrier que depuis la version web. Pour éviter la redirection,
              vous pouvez vous mettre en navigation privée. Voici le liens vers{' '}
              <a href="https://calendar.google.com" className="underline text-blue-600">
                Google Calendar
              </a>
              .
            </p>
            <video
              src="/android-guide.mp4"
              controls
              className="aspect-[320/682.6] max-w-xs w-full border-4 border-black rounded-xl overflow-hidden"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Calendrier Samsung</AccordionTrigger>
          <AccordionContent>
            <p>
              Afin d&apos;utiliser le calendrier alcuin sur le calendrier Samsung, il suffit de suivre le tutoriel n°2
              (Calendrier Google) et d&apos;utiliser la même addresse sur son compte Samsung et sur son compte Google.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default GuidePage;
