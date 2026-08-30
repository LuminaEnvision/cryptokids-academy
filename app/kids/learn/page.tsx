'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../_components/Header';
import KidCard from '../../_components/kids/KidCard';
import KidIcon from '../../_components/kids/KidIcon';
import ProgressStars from '../../_components/kids/ProgressStars';
import Mascot from '../../_components/kids/Mascot';
import type { KiddoAccent } from '@/lib/theme/kiddoTheme';
import {
  learnContent,
  getLearnedSlugs,
  LEARN_PROGRESS_KEY,
} from '@/lib/learn-content';

const accents: KiddoAccent[] = ['gold', 'sky', 'coral', 'green'];

export default function KidsLearnPage() {
  const [doneIds, setDoneIds] = useState<string[]>([]);

  useEffect(() => {
    setDoneIds(getLearnedSlugs());
    // keep dashboard star count in sync if empty
    try {
      localStorage.setItem(LEARN_PROGRESS_KEY, String(getLearnedSlugs().length));
    } catch {
      /* ignore */
    }
  }, []);

  const stars = doneIds.length;
  const allDone = stars >= learnContent.length && learnContent.length > 0;

  return (
    <div className="min-h-screen pb-8 bg-kiddo-soft">
      <Header title="Learn About Coins" showBack />

      <div className="p-5 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 bg-white border-[3px] border-kiddo-gold rounded-kid-lg shadow-kid-gold px-4 py-3"
        >
          <ProgressStars
            count={stars}
            total={learnContent.length}
            label="Lessons completed"
          />
          <Mascot pose={allDone ? 'celebrate' : 'thinking'} size={64} />
        </motion.div>

        {learnContent.map((topic, index) => {
          const completed = doneIds.includes(topic.slug);
          const accent = accents[index % accents.length];
          return (
            <motion.div
              key={topic.slug}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.06 }}
            >
              <KidCard
                accent={accent}
                layout="row"
                title={topic.title}
                description={topic.hook}
                icon={<KidIcon name={topic.icon} size={32} color={accent} />}
                actionLabel={completed ? 'Done ★' : 'Learn More'}
                href={`/kids/learn/${topic.slug}`}
                className={completed ? 'opacity-90' : ''}
              />
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border-[3px] border-kiddo-green rounded-kid-lg shadow-kid-green p-6 text-center"
        >
          <Mascot pose={allDone ? 'celebrate' : 'wave'} size={100} />
          <h3 className="font-display text-2xl text-kiddo-ink mt-3 mb-2">
            {allDone ? 'You finished every lesson!' : 'Coming soon: voice buddy'}
          </h3>
          <p className="font-kid text-kiddo-muted">
            {allDone
              ? 'High five! Ask a grown-up what you want to learn next.'
              : 'Soon you’ll be able to talk to a friendly helper about coins and blockchain!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
