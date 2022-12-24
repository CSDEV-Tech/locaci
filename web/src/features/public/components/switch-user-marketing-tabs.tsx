'use client';
import * as React from 'react';
import { Tabs } from '@locaci/ui/components/molecules/tabs';

export type SwitchUserMarketingTabsProps = {
    ownerContent: React.ReactNode;
    userContent: React.ReactNode;
    className?: string;
};

export function SwitchUserMarketingTabs({
    ownerContent,
    userContent,
    className
}: SwitchUserMarketingTabsProps) {
    return (
        <>
            <Tabs className={className}>
                <Tabs.Header>
                    <Tabs.HeaderItem>
                        Pour les futurs locataires
                    </Tabs.HeaderItem>
                    <Tabs.HeaderItem>Pour les propriétaires</Tabs.HeaderItem>
                </Tabs.Header>

                <Tabs.Body>
                    <Tabs.Item>{userContent}</Tabs.Item>
                    <Tabs.Item>{ownerContent}</Tabs.Item>
                </Tabs.Body>
            </Tabs>
        </>
    );
}
