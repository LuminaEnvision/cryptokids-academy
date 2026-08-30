'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { LessonTopic } from '@/lib/learn-content';
import { markLessonComplete } from '@/lib/learn-content';
import type { KiddoAccent } from '@/lib/theme/kiddoTheme';
import Header from '../Header';
import Mascot from './Mascot';
import KidIcon from './KidIcon';
import ProgressStars from './ProgressStars';

type Step = 'hook' | 'beat' | 'check' | 'done';

const accents: KiddoAccent[] = ['sky', 'gold', 'coral', 'green'];

const accentStyles: Record<
  KiddoAccent,
  { border: string; shadow: string; btn: string; soft: string }
> = {
  sky: {
    border: 'border-kiddo-sky',
    shadow: 'shadow-kid-sky',
    btn: 'bg-kiddo-sky text-white',
    soft: 'bg-kiddo-sky-soft',
  },
  gold: {
    border: 'border-kiddo-gold',
    shadow: 'shadow-kid-gold',
    btn: 'bg-kiddo-gold text-kiddo-ink',
    soft: 'bg-kiddo-gold-soft',
  },
  coral: {
    border: 'border-kiddo-coral',
    shadow: 'shadow-kid-coral',
    btn: 'bg-kiddo-coral text-white',
    soft: 'bg-kiddo-coral-soft',
  },
  green: {
    border: 'border-kiddo-green',
    shadow: 'shadow-kid-green',
    btn: 'bg-kiddo-green text-white',
    soft: 'bg-kiddo-green-soft',
  },
};

function accentFor(slug: string): KiddoAccent {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % accents.length;
  return accents[hash];
}

interface LessonFlowProps {
  topic: LessonTopic;
}

export default function LessonFlow({ topic }: LessonFlowProps) {
  const accent = accentFor(topic.slug);
  const style = accentStyles[accent];
  const [step, setStep] = useState<Step>('hook');
  const [beatIndex, setBeatIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);

  const beat = topic.beats[beatIndex];
  const totalBeats = topic.beats.length;

  const goNextFromHook = () => {
    setStep('beat');
    setBeatIndex(0);
  };

  const goNextBeat = () => {
    if (beatIndex < totalBeats - 1) {
      setBeatIndex((i) => i + 1);
      return;
    }
    setSelected(null);
    setWrong(false);
    setStep('check');
  };

  const submitCheck = () => {
    if (selected === null) return;
    if (selected === topic.check.correctIndex) {
      markLessonComplete(topic.slug);
      setWrong(false);
      setStep('done');
      return;
    }
    setWrong(true);
  };

  return (
    <div className="min-h-screen pb-10 bg-kiddo-soft">
      <Header title={topic.title} showBack backHref="/kids/learn" />

      <div className="p-5 space-y-5 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <KidIcon name={topic.icon} size={36} color={accent} well />
            <ProgressStars
              count={
                step === 'done'
                  ? totalBeats + 1
                  : step === 'check'
                    ? totalBeats
                    : step === 'beat'
                      ? beatIndex + 1
                      : 0
              }
              total={totalBeats + 1}
              label="Lesson progress"
              size="sm"
            />
          </div>
          <Mascot
            pose={
              step === 'done' ? 'celebrate' : wrong ? 'error' : step === 'check' ? 'thinking' : 'wave'
            }
            size={72}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 'hook' && (
            <motion.section
              key="hook"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`bg-white border-[3px] rounded-kid-lg p-6 ${style.border} ${style.shadow}`}
            >
              <p className="font-kid text-xs font-bold uppercase tracking-wide text-kiddo-muted mb-2">
                Let’s learn
              </p>
              <h2 className="font-display text-2xl text-kiddo-ink mb-3">{topic.title}</h2>
              <p className="font-kid text-lg text-kiddo-ink leading-snug mb-6">{topic.hook}</p>
              <button
                type="button"
                onClick={goNextFromHook}
                className={`w-full font-display font-semibold py-3.5 rounded-kid ${style.btn}`}
              >
                Start
              </button>
            </motion.section>
          )}

          {step === 'beat' && beat && (
            <motion.section
              key={`beat-${beatIndex}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className={`bg-white border-[3px] rounded-kid-lg p-6 ${style.border} ${style.shadow}`}
            >
              <div className="flex justify-center mb-4">
                <KidIcon name={beat.visual || topic.icon} size={56} color={accent} well />
              </div>
              <p className="font-kid text-xs font-bold text-kiddo-muted mb-2">
                Tip {beatIndex + 1} of {totalBeats}
              </p>
              <p className="font-kid text-lg text-kiddo-ink leading-snug mb-6">{beat.text}</p>
              <button
                type="button"
                onClick={goNextBeat}
                className={`w-full font-display font-semibold py-3.5 rounded-kid ${style.btn}`}
              >
                {beatIndex < totalBeats - 1 ? 'Next' : 'Quiz time!'}
              </button>
            </motion.section>
          )}

          {step === 'check' && (
            <motion.section
              key="check"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white border-[3px] border-kiddo-gold rounded-kid-lg shadow-kid-gold p-6"
            >
              <p className="font-kid text-xs font-bold uppercase tracking-wide text-kiddo-muted mb-2">
                Quick check
              </p>
              <h3 className="font-display text-xl text-kiddo-ink mb-4">{topic.check.question}</h3>
              <div className="space-y-3 mb-4">
                {topic.check.options.map((option, index) => {
                  const isSelected = selected === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelected(index);
                        setWrong(false);
                      }}
                      className={`
                        w-full text-left font-kid text-base px-4 py-3 rounded-kid border-[3px]
                        transition-colors
                        ${
                          isSelected
                            ? 'border-kiddo-sky bg-kiddo-sky-soft text-kiddo-ink'
                            : 'border-gray-200 bg-white text-kiddo-ink'
                        }
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {wrong && (
                <p className="font-kid text-sm text-kiddo-coral mb-3">
                  Not quite — try another answer!
                </p>
              )}
              <button
                type="button"
                disabled={selected === null}
                onClick={submitCheck}
                className="w-full font-display font-semibold py-3.5 rounded-kid bg-kiddo-gold text-kiddo-ink disabled:opacity-40"
              >
                Check answer
              </button>
            </motion.section>
          )}

          {step === 'done' && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-[3px] border-kiddo-green rounded-kid-lg shadow-kid-green p-6 text-center"
            >
              <Mascot pose="celebrate" size={120} />
              <h3 className="font-display text-2xl text-kiddo-ink mt-3 mb-2">You got it!</h3>
              <p className="font-kid text-kiddo-muted mb-6">
                Star unlocked for{' '}
                <span className="font-semibold text-kiddo-ink">{topic.title}</span>
              </p>
              <Link
                href={topic.ctaHref}
                className="block w-full font-display font-semibold text-white py-3.5 rounded-kid bg-kiddo-green mb-3"
              >
                {topic.ctaLabel}
              </Link>
              <Link
                href="/kids/learn"
                className="block w-full font-display font-semibold py-3 rounded-kid border-[3px] border-kiddo-sky text-kiddo-sky"
              >
                More lessons
              </Link>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
