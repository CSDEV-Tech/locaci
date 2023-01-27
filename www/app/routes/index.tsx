import { LinkButton } from '@locaci/ui/components/atoms/link-button';

export default function Index() {
    return (
        <div className={`m-5`}>
            <h1 className="text-2xl font-bold">Welcome to Remix</h1>
            <ul className="flex flex-col gap-1 pl-4">
                <li>
                    <LinkButton
                        target="_blank"
                        variant="primary"
                        href="https://remix.run/tutorials/blog"
                        rel="noreferrer">
                        Hello remix
                    </LinkButton>
                </li>
                <li>
                    <a
                        target="_blank"
                        className="underline"
                        href="https://remix.run/tutorials/jokes"
                        rel="noreferrer">
                        Deep Dive Jokes App Tutorial
                    </a>
                </li>
                <li>
                    <a
                        className="underline"
                        target="_blank"
                        href="https://remix.run/docs"
                        rel="noreferrer">
                        Remix Docs
                    </a>
                </li>
            </ul>
        </div>
    );
}
