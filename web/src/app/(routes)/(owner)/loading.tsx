import { LoadingScreen } from '~/features/shared/components/loading-screen';

export default function Loading() {
    return (
        <LoadingScreen
            title="Chargement de votre tableau de bord..."
            className="h-screen w-full"
        />
    );
}
