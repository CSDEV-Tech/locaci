import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    ImageLightbox,
    ImageLightboxProps
} from '../../components/molecules/image-lightbox';
import { Button } from '../../components/atoms/button';

export default {
    title: 'Composants/Molecules/ImageLightbox',
    component: ImageLightbox
} as ComponentMeta<typeof ImageLightbox>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ImageLightbox> = args => (
    <ImageLightbox {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: 'text-white',
    isOpen: true,
    images: [
        {
            uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/efr4YivQ3BLfnu2qoTQWKa.jpg',
            name: 'efr4YivQ3BLfnu2qoTQWKa.jpg'
        },
        {
            uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/6qVauxaLTkBnQTFjzLdhBd.jpg',
            name: '6qVauxaLTkBnQTFjzLdhBd.jpg'
        },
        {
            uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/8idMA4s3ajam4tUV2wF3nd.jpg',
            name: '8idMA4s3ajam4tUV2wF3nd.jpg'
        },
        {
            uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/avm8ViMBwBWa1bonuC9pQi.jpg',
            name: 'avm8ViMBwBWa1bonuC9pQi.jpg'
        },
        {
            uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/gaAtdgPAYy7T5vjtMoq6ay.jpg',
            name: 'gaAtdgPAYy7T5vjtMoq6ay.jpg'
        }
    ]
} as ImageLightboxProps;

export const Controlled = function () {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open</Button>

            <ImageLightbox
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                images={[
                    {
                        name: 'efr4YivQ3BLfnu2qoTQWKa.jpg',
                        uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/efr4YivQ3BLfnu2qoTQWKa.jpg'
                    },
                    {
                        name: '6qVauxaLTkBnQTFjzLdhBd.jpg',
                        uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/6qVauxaLTkBnQTFjzLdhBd.jpg'
                    },
                    {
                        name: '8idMA4s3ajam4tUV2wF3nd.jpg',
                        uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/8idMA4s3ajam4tUV2wF3nd.jpg'
                    },
                    {
                        name: 'avm8ViMBwBWa1bonuC9pQi.jpg',
                        uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/avm8ViMBwBWa1bonuC9pQi.jpg'
                    },
                    {
                        name: 'gaAtdgPAYy7T5vjtMoq6ay.jpg',
                        uri: 'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/gaAtdgPAYy7T5vjtMoq6ay.jpg'
                    }
                ]}
            />
        </>
    );
};
