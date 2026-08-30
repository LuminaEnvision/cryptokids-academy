import { Home, List, SendDiagonal, Download, Group } from 'iconoir-react';

interface NavIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function NavIcon({ name, size = 24, className = '' }: NavIconProps) {
  const iconProps = {
    width: size,
    height: size,
    strokeWidth: 2,
    className,
  };

  switch (name) {
    case 'home':
      return <Home {...iconProps} />;
    case 'tasks':
      return <List {...iconProps} />;
    case 'send':
      return <SendDiagonal {...iconProps} />;
    case 'receive':
      // Using Download as Receive equivalent
      return <Download {...iconProps} />;
    case 'friends':
      return <Group {...iconProps} />;
    default:
      return null;
  }
}
