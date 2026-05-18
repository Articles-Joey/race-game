import dynamic from 'next/dynamic';

const Duck = dynamic(
    () => import('@/components/Game/PlayerModels/Duck'),
    { ssr: false }
)

const Dog = dynamic(
    () => import('@/components/Game/PlayerModels/Dog'),
    { ssr: false }
)

const Bear = dynamic(
    () => import('@/components/Game/PlayerModels/Bear'),
    { ssr: false }
)

const Witch = dynamic(
    () => import('@/components/Game/PlayerModels/Witch'),
    { ssr: false }
)

export default function RenderCharacter({ character }) {

    switch (character?.model) {

        case 'Dog':
            return <Dog color={character?.color} />;

        case 'Duck':
            return <Duck color={character?.color} />;

        case 'Witch':
            return <Witch color={character?.color} />;

        case 'Bear':
            return <Bear color={character?.color} />;

        default:
            return <Duck color={character?.color} />;

    }

}