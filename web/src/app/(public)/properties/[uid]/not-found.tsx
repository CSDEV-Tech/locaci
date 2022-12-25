import { ErrorScreen } from '~/features/shared/components/error-screen';
import { NextLinkButton } from '~/features/shared/components/next-link';

export default function NotFound() {
    return (
        <ErrorScreen
            errorTitle="Erreur 404"
            className="h-[80vh]"
            errorDescription={`Le logement que vous recherchez n'existe pas`}>
            <NextLinkButton href="/" variant="primary">
                Retour à l'accueil
            </NextLinkButton>
        </ErrorScreen>
    );
}
