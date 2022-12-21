type PageParams = Record<string, string>;
export type PageProps<
  TParams extends PageParams = {},
  TSearchParams extends any = any
> = {
  params: TParams;
  searchParams?: TSearchParams;
};

export type LayoutProps<TParams extends PageParams = {}> = {
  children: React.ReactNode;
  params: TParams;
};

export type HeadProps<T> = PageProps<T>;

export type ErrorBoundaryProps = {
  error: Error;
  reset: () => void;
};

export type ListingImage = {
  uri: string;
  name: string;
};
