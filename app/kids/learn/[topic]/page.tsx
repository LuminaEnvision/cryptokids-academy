'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLessonBySlug } from '@/lib/learn-content';
import LessonFlow from '../../../_components/kids/LessonFlow';
import KidState from '../../../_components/kids/KidState';

export default function KidsLearnTopicPage() {
  const params = useParams();
  const slug = typeof params?.topic === 'string' ? params.topic : '';
  const topic = getLessonBySlug(slug);

  if (!topic) {
    return (
      <div className="min-h-screen bg-kiddo-soft p-6 flex items-center justify-center">
        <KidState
          kind="empty"
          pose="thinking"
          title="Lesson not found"
          message="That lesson isn’t here yet. Pick another one from Learn!"
          action={
            <Link
              href="/kids/learn"
              className="font-display font-semibold bg-kiddo-sky text-white px-6 py-3 rounded-kid"
            >
              Back to Learn
            </Link>
          }
        />
      </div>
    );
  }

  return <LessonFlow topic={topic} />;
}
