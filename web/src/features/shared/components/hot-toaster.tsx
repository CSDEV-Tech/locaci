'use client';
import { Toaster, ToasterProps } from 'react-hot-toast';

export const HotToaster: React.FC<ToasterProps> = props => (
    <Toaster {...props} />
);
