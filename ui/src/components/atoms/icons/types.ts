import React from 'react';

export type IconProps = {
    className?: string;
} & Omit<React.SVGProps<SVGSVGElement>, 'children'>;
export type WeighedIconProps = IconProps & {
    weight?: 'bold' | 'regular' | 'fill';
};
export type IconComponent = React.ComponentType<IconProps | WeighedIconProps>;
