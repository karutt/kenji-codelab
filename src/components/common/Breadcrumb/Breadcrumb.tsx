'use client';

import { Breadcrumb as ChakraBreadcrumb, Link } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrent?: boolean;
}

export interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    size?: 'sm' | 'md' | 'lg';
    separator?: React.ReactNode;
    styled?: boolean;
    bookName?: string;
    chapter?: string;
}

export function Breadcrumb({ items = [], size = 'md', separator }: BreadcrumbProps) {
    return (
        <ChakraBreadcrumb.Root size={size} fontWeight="500">
            <ChakraBreadcrumb.List>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <ChakraBreadcrumb.Item>
                            {item.isCurrent || !item.href ? (
                                <ChakraBreadcrumb.CurrentLink color="brand.abbey">
                                    {item.label}
                                </ChakraBreadcrumb.CurrentLink>
                            ) : (
                                <ChakraBreadcrumb.Link asChild>
                                    <Link
                                        _hover={{
                                            textDecoration: 'underline',
                                            color: 'gray.800',
                                        }}
                                        transition="all 1s"
                                        href={item.href}
                                    >
                                        {item.label}
                                    </Link>
                                </ChakraBreadcrumb.Link>
                            )}
                        </ChakraBreadcrumb.Item>
                        {index < items.length - 1 && (
                            <ChakraBreadcrumb.Separator>
                                {separator || (
                                    <MdOutlineKeyboardArrowRight
                                        style={{ marginTop: 2, width: 18, height: 18 }}
                                    />
                                )}
                            </ChakraBreadcrumb.Separator>
                        )}
                    </React.Fragment>
                ))}
            </ChakraBreadcrumb.List>
        </ChakraBreadcrumb.Root>
    );
}

export default Breadcrumb;
