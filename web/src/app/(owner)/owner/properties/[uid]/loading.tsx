import { LoadingScreen } from '~/features/shared/components/loading-screen';

export default function Loading() {
    return (
        <LoadingScreen
            title="Chargement de votre propriété..."
            className="h-[80vh] w-full"
        />
    );
}
