type PageParams = Record<string, string>;
export type PageProps<
    TParams extends PageParams = {},
    TSearchParams extends any = Record<string, string | undefined>
> = {
    params: TParams;
    searchParams?: TSearchParams;
};

export type LayoutProps<TParams extends PageParams = {}> = {
    children: React.ReactNode;
    params: TParams;
};

export type MetadataResult<
    TParams extends PageParams = {},
    TSearchParams extends any = Record<string, string | undefined>
> = {
    params: TParams;
    searchParams?: TSearchParams;
};

export type HeadProps<
    TParams extends PageParams = {},
    TSearchParams extends any = Record<string, string | undefined>
> = PageProps<TParams, TSearchParams>;

export type ErrorBoundaryProps = {
    error: Error;
    reset: () => void;
};
