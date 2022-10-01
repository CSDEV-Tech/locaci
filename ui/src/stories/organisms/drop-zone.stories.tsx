import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DropZone, DropZoneProps } from '../../components/organisms/drop-zone';
import { mockImgBase64 } from '../assets/constants';

export default {
    title: 'Composants/Organisms/DropZone',
    component: DropZone,
    argTypes: {
        variant: { control: 'select' },
        filesTypesAccepted: { control: 'select' }
    }
} as ComponentMeta<typeof DropZone>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof DropZone> = args => (
    <DropZone {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: 'min-h-[400px]',
    buttonLabel: 'Cliquez pour ajouter une photo',
    secondLabel: 'Faites glisser vos fichiers',
    helpText: 'Taille maximum de fichier acceptée : 20 mégabytes'
} as DropZoneProps;

function dataURLtoFile(dataurl: string, filename: string) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)![1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

console.log({
    file: dataURLtoFile(mockImgBase64, 'mock-image.jpeg')
});

export const WithDefaultFiles = Template.bind({});
WithDefaultFiles.args = {
    className: 'min-h-[400px]',
    buttonLabel: 'Cliquez pour ajouter une photo',
    secondLabel: 'Faites glisser vos fichiers',
    helpText: 'Taille maximum de fichier acceptée : 20 mégabytes',
    defaultFiles: [
        {
            name: 'image-1.jpeg',
            fileObject: {
                uri: 'https://picsum.photos/seed/img-1/1000/1000',
                fileType: 'image'
            },
            state: 'SUCCESS'
        },
        {
            name: 'document-1.pdf',
            fileObject: {
                uri: 'https://www.africau.edu/images/default/sample.pdf',
                fileType: 'document'
            },
            state: 'SUCCESS'
        },
        {
            name: 'image-2.png',
            fileObject: {
                uri: 'https://picsum.photos/seed/img-2/1000/1000',
                fileType: 'image'
            },
            state: 'SUCCESS'
        },
        {
            name: 'document-2.pdf',
            fileObject: {
                uri: 'https://www.africau.edu/images/default/sample.pdf',
                fileType: 'document'
            },
            state: 'SUCCESS'
        },
        {
            name: 'mock-image.jpeg',
            fileObject: dataURLtoFile(mockImgBase64, 'mock-image.jpeg'),
            state: 'SUCCESS'
        },
        {
            name: 'uploading-file.pdf',
            fileObject: {
                uri: 'https://www.africau.edu/images/default/sample.pdf',
                fileType: 'document'
            },
            state: 'UPLOADING'
        },
        {
            name: 'error-file.pdf',
            fileObject: dataURLtoFile(mockImgBase64, 'error-image.jpeg'),
            state: 'ERROR'
        }
    ]
} as DropZoneProps;
