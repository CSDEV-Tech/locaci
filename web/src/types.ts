export type SeoData = {
    title?: string;
    description?: string;
    imageURL?: string;
    pathname?: string;
};

export type PageProps<
    TParams extends {} = {},
    TSearchParams extends {} = {}
> = {
    params: TParams;
    searchParams: TSearchParams;
};

export type LayoutProps<
    TParams extends {} = {},
    TSearchParams extends {} = {}
> = {
    children: React.ReactNode;
    params?: TParams;
    searchParams?: TSearchParams;
};

export type HeadProps<TParams extends {} = {}> = {
    params: TParams;
};
