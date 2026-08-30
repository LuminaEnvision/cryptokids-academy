'use client';

interface TraitIconProps {
  category: string;
  trait: string;
  size?: number;
}

import { Xmark, Frame, User, EmojiLookUp, Glasses, Hat, Sparks, QuestionMark } from 'iconoir-react';

interface TraitIconProps {
  category: string;
  trait: string;
  size?: number;
}

export default function TraitIcon({ category, trait, size = 28 }: TraitIconProps) {
  if (trait === 'none') {
    return <Xmark width={size} height={size} />;
  }

  // Category-specific icons - polished and consistent
  switch (category) {
    case 'background':
      return <Frame width={size} height={size} />;
    case 'body':
      return <User width={size} height={size} />;
    case 'head':
      return <EmojiLookUp width={size} height={size} />;
    case 'glasses':
      return <Glasses width={size} height={size} />;
    case 'accessory':
      return <Hat width={size} height={size} />;
    case 'magic':
      return <Sparks width={size} height={size} />;
    default:
      return <QuestionMark width={size} height={size} />;
  }
}

