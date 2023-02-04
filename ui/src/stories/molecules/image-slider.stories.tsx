import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    ImageSlider,
    ImageSliderProps
} from '../../components/molecules/image-slider';
import { clsx } from '../../lib/functions';

export default {
    title: 'Composants/Molecules/ImageSlider',
    component: ImageSlider
} as ComponentMeta<typeof ImageSlider>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ImageSlider> = args => (
    <div className="h-[200px] max-w-[400px]">
        <ImageSlider {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    imageURIs: [
        `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
        `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80`,
        `https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80`,
        'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/avm8ViMBwBWa1bonuC9pQi.jpg',
        'https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/gaAtdgPAYy7T5vjtMoq6ay.jpg'
    ]
} as ImageSliderProps;
