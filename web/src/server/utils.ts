import { cache } from 'react';
import { rsc } from './trpc/rsc';

export const getAllMunicipalities = cache(() =>
    rsc.geo.getAllMunicipalities.fetch()
);
