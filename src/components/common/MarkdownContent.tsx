import {
    Alert,
    Blockquote,
    Box,
    Code,
    Heading,
    Image,
    Link,
    List,
    Separator,
    Table,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { IoMdAlert } from 'react-icons/io';

import { CodeBlock } from './CodeBlock';

interface ListItem {
    content: string;
    type: 'ordered' | 'unordered';
    level: number;
    children: ListItem[];
}

interface MarkdownContentProps {
    content: string;
    hideTemplateBlocks?: boolean;
}

export function MarkdownContent({ content, hideTemplateBlocks = false }: MarkdownContentProps) {
    // Guard against undefined or null content
    if (!content || typeof content !== 'string') {
        return <Text>No content available</Text>;
    }

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let currentLists: ListItem[] = []; // Current list items being processed
    let isInCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';
    let tableRows: string[][] = [];
    let isInTable = false;
    let isInAlert = false;
    let alertType: 'info' | 'warning' | 'error' | 'success' = 'info';
    let alertContent: string[] = [];
    let elementCounter = 0;

    const getUniqueKey = (prefix: string = 'element') => {
        return `${prefix}-${elementCounter++}`;
    };

    // Helper function to parse image with width syntax
    const parseImageSrc = (src: string): { src: string; width?: string } => {
        // Check for width syntax: src =400x or src =400px
        const widthMatch = src.match(/^(.+?)\s+=(\d+)(?:x|px)?$/);
        if (widthMatch) {
            return {
                src: widthMatch[1].trim(),
                width: widthMatch[2] + 'px',
            };
        }
        return { src: src.trim() };
    };

    // Helper function to get list item indentation level
    const getIndentLevel = (line: string): number => {
        const match = line.match(/^(\s*)/);
        return match ? Math.floor(match[1].length / 4) : 0; // 4 spaces = 1 level
    };

    // Helper function to check if line is a list item
    const parseListItem = (
        line: string,
    ): {
        isListItem: boolean;
        type?: 'ordered' | 'unordered';
        content?: string;
        level?: number;
    } => {
        const trimmed = line.trim();
        const level = getIndentLevel(line);

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return {
                isListItem: true,
                type: 'unordered',
                content: trimmed.substring(2).trim(),
                level,
            };
        }

        const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (orderedMatch) {
            return {
                isListItem: true,
                type: 'ordered',
                content: orderedMatch[2],
                level,
            };
        }

        return { isListItem: false };
    };

    // Render nested list structure
    const renderList = (items: ListItem[], key: string): React.ReactNode => {
        if (items.length === 0) return null;

        // Group items by type and level
        const groups: Array<{ type: 'ordered' | 'unordered'; items: ListItem[] }> = [];
        let currentGroup: { type: 'ordered' | 'unordered'; items: ListItem[] } | null = null;

        for (const item of items) {
            if (!currentGroup || currentGroup.type !== item.type) {
                currentGroup = { type: item.type, items: [item] };
                groups.push(currentGroup);
            } else {
                currentGroup.items.push(item);
            }
        }

        // Check if any items in the groups have children (multi-level structure)
        const hasNestedItems = groups.some(group =>
            group.items.some(item => item.children.length > 0),
        );

        return (
            <React.Fragment key={`${key}-fragment`}>
                {groups.map((group, groupIndex) => (
                    <List.Root
                        key={`${key}-group-${groupIndex}`}
                        mb={4}
                        pl={4.5}
                        lineHeight={1.8}
                        gap={hasNestedItems ? 0 : 2}
                        as={group.type === 'ordered' ? 'ol' : 'ul'}
                        listStyle={group.type === 'ordered' ? 'decimal' : 'disc'}
                    >
                        {group.items.map((item, itemIndex) => (
                            <List.Item
                                key={`${key}-item-${groupIndex}-${itemIndex}`}
                                color="brand.shark"
                                _marker={{ color: 'list.marker', fontWeight: 'bold' }}
                            >
                                {parseInlineElements(item.content)}
                                {item.children.length > 0 && (
                                    <Box mt={2} ml={4}>
                                        {renderList(
                                            item.children,
                                            `${key}-nested-${groupIndex}-${itemIndex}-${Date.now()}`,
                                        )}
                                    </Box>
                                )}
                            </List.Item>
                        ))}
                    </List.Root>
                ))}
            </React.Fragment>
        );
    };

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const paragraphText = currentParagraph.join(' ').trim();
            if (paragraphText) {
                elements.push(
                    <Text
                        key={getUniqueKey('paragraph')}
                        mb={4}
                        color="brand.shark"
                        lineHeight={1.9}
                    >
                        {parseInlineElements(paragraphText)}
                    </Text>,
                );
            }
            currentParagraph = [];
        }
    };

    // Process and flush nested lists
    const flushLists = (currentLists: ListItem[]) => {
        if (currentLists.length > 0) {
            elements.push(renderList(currentLists, getUniqueKey('list')));
        }
    };

    const flushCodeBlock = () => {
        if (codeBlockContent.length > 0) {
            // Check if this is a template code block
            const isTemplate = codeBlockLanguage.includes(':template');
            const language = isTemplate ? codeBlockLanguage.split(':')[0] : codeBlockLanguage;

            // Skip rendering template blocks if hideTemplateBlocks is true
            if (!(hideTemplateBlocks && isTemplate)) {
                elements.push(
                    <CodeBlock
                        key={getUniqueKey('codeblock')}
                        code={codeBlockContent.join('\n')}
                        language={language}
                        isTemplate={isTemplate}
                    />,
                );
            }
            codeBlockContent = [];
            codeBlockLanguage = '';
        }
    };

    // Alert内のコンテンツを処理する関数
    const parseAlertContent = (content: string): React.ReactNode => {
        const lines = content.split('\n');
        const alertElements: React.ReactNode[] = [];
        let currentParagraph: string[] = [];
        let isInCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeBlockLanguage = '';
        let currentLists: ListItem[] = [];
        let alertElementCounter = 0; // Alert内専用のカウンター

        const getAlertKey = (prefix: string) => {
            return `alert-${prefix}-${Date.now()}-${alertElementCounter++}`;
        };

        // Alert専用のインライン要素パーサー
        const parseAlertInlineElements = (text: string): React.ReactNode => {
            const parts: React.ReactNode[] = [];
            let currentText = text;
            let key = 0;

            // Process bold text (**text**)
            currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
                const placeholder = `__BOLD_${key}__`;
                parts.push(
                    <Text key={`alert-bold-${key}`} as="strong" fontWeight="bold">
                        {content}
                    </Text>,
                );
                key++;
                return placeholder;
            });

            // Process inline code (`code`)
            currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
                const placeholder = `__CODE_${key}__`;
                parts.push(
                    <Code
                        key={`alert-code-${key}`}
                        mx={0.5}
                        px={1.5}
                        py={0.5}
                        fontSize="0.85em"
                        bg="code.inline"
                        borderRadius="sm"
                    >
                        {content}
                    </Code>,
                );
                key++;
                return placeholder;
            });

            // Process links ([text](url))
            currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
                const placeholder = `__LINK_${key}__`;
                parts.push(
                    <Link
                        key={`alert-link-${key}`}
                        color="brand.blue"
                        textDecoration="underline"
                        _hover={{ textDecoration: 'none' }}
                        href={url}
                    >
                        {text}
                    </Link>,
                );
                key++;
                return placeholder;
            });

            // Process images (![alt](src))
            currentText = currentText.replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                (match, alt, srcWithWidth) => {
                    const placeholder = `__IMAGE_${key}__`;
                    const { src, width } = parseImageSrc(srcWithWidth);
                    parts.push(
                        <Box key={`alert-image-${key}`} my={4} textAlign="center">
                            <Image
                                w={width || 'auto'}
                                maxW={width || '100%'}
                                h="auto"
                                borderRadius="md"
                                shadow="sm"
                                alt={alt}
                                src={src}
                            />
                        </Box>,
                    );
                    key++;
                    return placeholder;
                },
            );

            // Split by placeholders and reconstruct
            const segments = currentText.split(/(__(?:BOLD|CODE|LINK|IMAGE)_\d+__)/);
            const result: React.ReactNode[] = [];

            segments.forEach((segment, segmentIndex) => {
                const match = segment.match(/__(?:BOLD|CODE|LINK|IMAGE)_(\d+)__/);
                if (match) {
                    const partIndex = parseInt(match[1]);
                    result.push(parts[partIndex]);
                } else if (segment) {
                    result.push(<span key={`alert-text-${segmentIndex}-${key++}`}>{segment}</span>);
                }
            });

            return result.length === 1 ? (
                result[0]
            ) : (
                <React.Fragment key={`alert-inline-${Date.now()}-${Math.random()}`}>
                    {result}
                </React.Fragment>
            );
        };

        const flushParagraph = () => {
            if (currentParagraph.length > 0) {
                const paragraphText = currentParagraph.join(' ').trim();
                if (paragraphText) {
                    alertElements.push(
                        <Text key={getAlertKey('p')} mb={2}>
                            {parseAlertInlineElements(paragraphText)}
                        </Text>,
                    );
                }
                currentParagraph = [];
            }
        };

        const flushCodeBlock = () => {
            if (codeBlockContent.length > 0) {
                const isTemplate = codeBlockLanguage.includes(':template');
                const language = isTemplate ? codeBlockLanguage.split(':')[0] : codeBlockLanguage;

                // Skip rendering template blocks if hideTemplateBlocks is true
                if (!(hideTemplateBlocks && isTemplate)) {
                    alertElements.push(
                        <CodeBlock
                            key={getAlertKey('code')}
                            code={codeBlockContent.join('\n')}
                            language={language}
                            isTemplate={isTemplate}
                        />,
                    );
                }
                codeBlockContent = [];
                codeBlockLanguage = '';
            }
        };

        const flushLists = () => {
            if (currentLists.length > 0) {
                alertElements.push(renderList(currentLists, getAlertKey('list')));
                currentLists = [];
            }
        };

        lines.forEach(line => {
            const trimmedLine = line.trim();
            const listItemInfo = parseListItem(line);

            // Handle code blocks
            if (trimmedLine.startsWith('```')) {
                if (isInCodeBlock) {
                    flushCodeBlock();
                    isInCodeBlock = false;
                } else {
                    flushParagraph();
                    flushLists();
                    isInCodeBlock = true;
                    codeBlockLanguage = trimmedLine.slice(3).trim();
                }
                return;
            }

            if (isInCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            // Handle headers
            if (trimmedLine.startsWith('#')) {
                flushParagraph();
                flushLists();

                const level = trimmedLine.match(/^#+/)?.[0].length || 1;
                const headerText = trimmedLine.replace(/^#+\s*/, '');
                const headingLevel = Math.min(level + 1, 6) as 2 | 3 | 4 | 5 | 6; // Alert内では一つ下のレベル
                const fontSize = ['lg', 'lg', 'md', 'sm', 'xs'][headingLevel - 2] as
                    | 'xl'
                    | 'lg'
                    | 'md'
                    | 'sm'
                    | 'xs';

                alertElements.push(
                    <Heading
                        key={getAlertKey('h')}
                        as={`h${headingLevel}`}
                        mt={headingLevel === 2 ? 3 : 2}
                        mb={2}
                        fontSize={fontSize}
                        fontWeight="bold"
                    >
                        {parseAlertInlineElements(headerText)}
                    </Heading>,
                );
                return;
            }

            // Handle lists
            if (listItemInfo.isListItem) {
                flushParagraph();

                const newItem: ListItem = {
                    content: listItemInfo.content!,
                    type: listItemInfo.type!,
                    level: listItemInfo.level!,
                    children: [],
                };

                if (currentLists.length === 0 || listItemInfo.level === 0) {
                    currentLists.push(newItem);
                } else {
                    let parent = currentLists[currentLists.length - 1];
                    let targetLevel = listItemInfo.level! - 1;

                    while (targetLevel > 0 && parent.children.length > 0) {
                        parent = parent.children[parent.children.length - 1];
                        targetLevel--;
                    }

                    if (targetLevel === 0) {
                        parent.children.push(newItem);
                    } else {
                        currentLists.push(newItem);
                    }
                }
                return;
            } else if (currentLists.length > 0) {
                if (
                    trimmedLine &&
                    (line.startsWith('  ') || line.startsWith('    ') || line.startsWith('\t'))
                ) {
                    let targetItem = currentLists[currentLists.length - 1];
                    while (targetItem.children.length > 0) {
                        targetItem = targetItem.children[targetItem.children.length - 1];
                    }
                    targetItem.content += '\n' + trimmedLine;
                    return;
                } else if (trimmedLine === '') {
                    return;
                } else {
                    flushLists();
                }
            }

            // Handle empty lines
            if (trimmedLine === '') {
                flushParagraph();
                flushLists();
                return;
            }

            // Regular text
            currentParagraph.push(trimmedLine);
        });

        // Flush remaining content
        flushParagraph();
        flushCodeBlock();
        flushLists();

        return alertElements;
    };

    const flushAlert = () => {
        if (alertContent.length > 0) {
            const content = alertContent.join('\n').trim();
            if (content) {
                const alertElements = parseAlertContent(content);

                // アラートタイプごとの色設定
                const alertStyles = {
                    warning: {
                        bg: '#FFF6E4',
                        iconColor: '#FFA908',
                    },
                    error: {
                        bg: '#FEF1F0',
                        iconColor: '#FF6868',
                    },
                    info: {
                        bg: '#EFF6FF',
                        iconColor: '#60A5FA',
                    },
                    success: {
                        bg: '#EFF6FF', // デフォルトでinfoと同じ
                        iconColor: '#60A5FA',
                    },
                };

                const currentStyle = alertStyles[alertType];

                elements.push(
                    <Alert.Root
                        key={getUniqueKey('alert')}
                        status={alertType}
                        mb={4}
                        p={4}
                        pt={6}
                        bg={currentStyle.bg}
                        color="brand.shark"
                        border="none"
                    >
                        <Alert.Indicator color={currentStyle.iconColor} w={7} h={7}>
                            <IoMdAlert style={{ width: '28px', height: '28px' }} />
                        </Alert.Indicator>
                        <Alert.Content>
                            <Alert.Description
                                color="brand.shark"
                                lineHeight={1.8}
                                opacity={0.95}
                                fontSize="15px"
                            >
                                {alertElements}
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>,
                );
            }
            alertContent = [];
            isInAlert = false;
        }
    };

    const flushTable = () => {
        if (tableRows.length > 0) {
            const [headerRow, ...bodyRows] = tableRows;
            elements.push(
                <Box
                    key={getUniqueKey('table-wrapper')}
                    mb={4}
                    border="solid 1px"
                    borderColor="border.plain"
                    borderRadius="lg"
                >
                    <Table.Root
                        key={getUniqueKey('table')}
                        size="sm"
                        variant="outline"
                        shadow="none"
                    >
                        <Table.Header bg="table.headerBg" borderColor="border.plain">
                            <Table.Row borderColor="border.plain">
                                {headerRow.map((header, index) => (
                                    <Table.ColumnHeader
                                        key={index}
                                        p={3}
                                        borderColor="border.plain"
                                    >
                                        {parseInlineElements(header.trim())}
                                    </Table.ColumnHeader>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body borderColor="border.plain">
                            {bodyRows.map((row, rowIndex) => (
                                <Table.Row key={rowIndex} borderColor="border.plain">
                                    {row.map((cell, cellIndex) => (
                                        <Table.Cell
                                            key={cellIndex}
                                            p={3}
                                            borderColor="border.plain"
                                        >
                                            {parseInlineElements(cell.trim())}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>,
            );
            tableRows = [];
            isInTable = false;
        }
    };

    const parseInlineElements = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let currentText = text;
        let key = 0;

        // Process bold text (**text**)
        currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
            const placeholder = `__BOLD_${key}__`;
            parts.push(
                <Text key={`bold-${key}`} as="strong" fontWeight="bold">
                    {content}
                </Text>,
            );
            key++;
            return placeholder;
        });

        // Process inline code (`code`)
        currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
            const placeholder = `__CODE_${key}__`;
            parts.push(
                <Code
                    key={`code-${key}`}
                    mx={0.5}
                    px={1.5}
                    py={0.5}
                    fontSize="0.85em"
                    bg="code.inline"
                    borderRadius="sm"
                >
                    {content}
                </Code>,
            );
            key++;
            return placeholder;
        });

        // Process links ([text](url))
        currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            const placeholder = `__LINK_${key}__`;
            parts.push(
                <Link
                    key={`link-${key}`}
                    color="brand.blue"
                    textDecoration="underline"
                    _hover={{ textDecoration: 'none' }}
                    href={url}
                >
                    {text}
                </Link>,
            );
            key++;
            return placeholder;
        });

        // Process images (![alt](src))
        currentText = currentText.replace(
            /!\[([^\]]*)\]\(([^)]+)\)/g,
            (match, alt, srcWithWidth) => {
                const placeholder = `__IMAGE_${key}__`;
                const { src, width } = parseImageSrc(srcWithWidth);
                parts.push(
                    <Box key={`image-${key}`} my={4} textAlign="center">
                        <Image
                            w={width || 'auto'}
                            maxW={width || '100%'}
                            h="auto"
                            borderRadius="md"
                            shadow="sm"
                            alt={alt}
                            src={src}
                        />
                    </Box>,
                );
                key++;
                return placeholder;
            },
        );

        // Process code blocks (```lang\ncode\n```)
        currentText = currentText.replace(
            /```([^\n]*)\n([\s\S]*?)\n```/g,
            (match, language, code) => {
                const placeholder = `__CODEBLOCK_${key}__`;
                const isTemplate = language.includes(':template');
                const cleanLanguage = isTemplate ? language.split(':')[0] : language;

                // Skip rendering template blocks if hideTemplateBlocks is true
                if (!(hideTemplateBlocks && isTemplate)) {
                    parts.push(
                        <CodeBlock
                            key={`codeblock-${key}`}
                            code={code}
                            language={cleanLanguage.trim()}
                            isTemplate={isTemplate}
                        />,
                    );
                    key++;
                    return placeholder;
                } else {
                    // Return empty string if template block is hidden
                    return '';
                }
            },
        );

        // Split by placeholders and reconstruct
        const segments = currentText.split(/(__(?:BOLD|CODE|LINK|IMAGE|CODEBLOCK)_\d+__)/);
        const result: React.ReactNode[] = [];

        segments.forEach((segment, segmentIndex) => {
            const match = segment.match(/__(?:BOLD|CODE|LINK|IMAGE|CODEBLOCK)_(\d+)__/);
            if (match) {
                const partIndex = parseInt(match[1]);
                result.push(parts[partIndex]);
            } else if (segment) {
                // Handle line breaks within the segment
                const lines = segment.split('\n');
                lines.forEach((line, index) => {
                    if (index > 0) {
                        result.push(<br key={`br-${key++}`} />);
                    }
                    if (line) {
                        result.push(
                            <span key={`text-${segmentIndex}-${index}-${key++}`}>{line}</span>,
                        );
                    }
                });
            }
        });

        return result.length === 1 ? (
            result[0]
        ) : (
            <React.Fragment key={`inline-${Date.now()}-${Math.random()}`}>{result}</React.Fragment>
        );
    };

    lines.forEach(line => {
        const trimmedLine = line.trim();

        // Handle alert blocks (:::type content :::)
        if (trimmedLine.startsWith(':::')) {
            if (isInAlert) {
                // End of alert block
                flushAlert();
            } else {
                // Start of alert block
                flushParagraph();
                flushLists(currentLists);
                currentLists = [];
                flushTable();

                const alertTypeMatch = trimmedLine.match(/^:::(\w+)/);
                if (alertTypeMatch) {
                    const type = alertTypeMatch[1].toLowerCase();
                    if (['info', 'warning', 'error', 'success'].includes(type)) {
                        alertType = type as 'info' | 'warning' | 'error' | 'success';
                    } else {
                        alertType = 'info'; // default fallback
                    }
                    isInAlert = true;
                    alertContent = [];
                }
            }
            return;
        }

        if (isInAlert) {
            alertContent.push(line);
            return;
        }

        // Handle code blocks
        if (trimmedLine.startsWith('```')) {
            if (isInCodeBlock) {
                // Check if we're inside a list item and this is indented
                if (currentLists.length > 0 && (line.startsWith('    ') || line.startsWith('\t'))) {
                    // Add code block to list item content
                    let targetItem = currentLists[currentLists.length - 1];
                    while (targetItem.children.length > 0) {
                        targetItem = targetItem.children[targetItem.children.length - 1];
                    }

                    if (codeBlockContent.length > 0) {
                        targetItem.content +=
                            '\n```' +
                            codeBlockLanguage +
                            '\n' +
                            codeBlockContent.join('\n') +
                            '\n```';
                    }

                    codeBlockContent = [];
                    codeBlockLanguage = '';
                    isInCodeBlock = false;
                    return;
                }

                flushCodeBlock();
                isInCodeBlock = false;
            } else {
                // Check if we're starting a code block within a list item
                if (currentLists.length > 0 && (line.startsWith('    ') || line.startsWith('\t'))) {
                    // This is a code block within a list item
                    isInCodeBlock = true;
                    codeBlockLanguage = trimmedLine.slice(3).trim();
                    return;
                }

                flushParagraph();
                flushLists(currentLists);
                currentLists = [];
                flushTable();
                isInCodeBlock = true;
                codeBlockLanguage = trimmedLine.slice(3).trim();
            }
            return;
        }

        if (isInCodeBlock) {
            codeBlockContent.push(line);
            return;
        }

        // Handle headers
        if (trimmedLine.startsWith('#')) {
            flushParagraph();
            flushLists(currentLists);
            currentLists = [];
            flushTable();
            flushAlert();

            const level = trimmedLine.match(/^#+/)?.[0].length || 1;
            const headerText = trimmedLine.replace(/^#+\s*/, '');
            const headingLevel = Math.min(level, 6) as 1 | 2 | 3 | 4 | 5 | 6;
            const fontSize = (['2xl', '2xl', 'xl', 'md', 'sm', 'xs'] as const)[headingLevel - 1];
            const mt = ([10, 10, 8, 6, 4, 4] as const)[headingLevel - 1];
            elements.push(
                <Heading
                    key={getUniqueKey('heading')}
                    as={`h${headingLevel}`}
                    mt={mt}
                    mb="1em"
                    pb={headingLevel === 1 || headingLevel === 2 ? 2 : 0}
                    color="brand.shark"
                    fontWeight="bold"
                    borderBottom={headingLevel === 1 || headingLevel === 2 ? '1px solid' : 'none'}
                    borderBottomColor={
                        headingLevel === 1 || headingLevel === 2 ? 'border.plain' : 'transparent'
                    }
                    size={fontSize}
                >
                    {parseInlineElements(headerText)}
                </Heading>,
            );
            return;
        }

        // Handle horizontal rules
        if (trimmedLine === '---' || trimmedLine === '***') {
            flushParagraph();
            flushLists(currentLists);
            currentLists = [];
            flushTable();
            flushAlert();
            elements.push(<Separator key={getUniqueKey('separator')} my={6} />);
            return;
        }

        // Handle blockquotes
        if (trimmedLine.startsWith('>')) {
            flushParagraph();
            flushLists(currentLists);
            currentLists = [];
            flushTable();
            flushAlert();

            const quoteText = trimmedLine.replace(/^>\s*/, '');
            elements.push(
                <Blockquote.Root
                    key={getUniqueKey('blockquote')}
                    mb={4}
                    w="100%"
                    borderLeftColor="#8f9faa"
                    fontSize="0.9em"
                    color="gray.600"
                >
                    <Blockquote.Content
                        w="100%"
                        // borderLeft="4px solid"
                        // borderColor="brand.blue"
                        pl={4}
                        py={3}
                        bg="blue.50"
                        borderRadius="md"
                    >
                        {parseInlineElements(quoteText)}
                    </Blockquote.Content>
                </Blockquote.Root>,
            );
            return;
        }

        // Handle images
        if (trimmedLine.startsWith('![')) {
            const imageMatch = trimmedLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            if (imageMatch) {
                const [, alt, srcWithWidth] = imageMatch;
                const { src, width } = parseImageSrc(srcWithWidth);

                // Check if we're inside a list item (indented line)
                if (currentLists.length > 0 && (line.startsWith('   ') || line.startsWith('\t'))) {
                    // Find the most recent list item to append the image to
                    let targetItem = currentLists[currentLists.length - 1];
                    while (targetItem.children.length > 0) {
                        targetItem = targetItem.children[targetItem.children.length - 1];
                    }

                    // Add image as inline content to the list item (preserve original syntax)
                    targetItem.content += `\n![${alt}](${srcWithWidth})`;
                    return;
                }

                // If not in a list, process as standalone image
                flushParagraph();
                flushLists(currentLists);
                currentLists = [];
                flushTable();
                flushAlert();

                elements.push(
                    <Box key={getUniqueKey('image')} my={4} textAlign="center">
                        <Image
                            w={width || 'auto'}
                            maxW={width || '100%'}
                            h="auto"
                            borderRadius="md"
                            alt={alt}
                            src={src}
                        />
                    </Box>,
                );
            }
            return;
        }

        // Handle tables
        if (trimmedLine.includes('|') && trimmedLine.split('|').length >= 3) {
            flushParagraph();
            flushLists(currentLists);
            currentLists = [];
            flushAlert();

            const cells = trimmedLine
                .split('|')
                .map(cell => cell.trim())
                .filter(cell => cell);

            // Skip separator rows (e.g., |---|---|)
            if (cells.every(cell => /^-+$/.test(cell))) {
                return;
            }

            tableRows.push(cells);
            isInTable = true;
            return;
        } else if (isInTable) {
            flushTable();
        }

        // Handle lists with nested structure support
        const listItemInfo = parseListItem(line);

        if (listItemInfo.isListItem) {
            flushParagraph();
            flushTable();
            flushAlert();

            const newItem: ListItem = {
                content: listItemInfo.content!,
                type: listItemInfo.type!,
                level: listItemInfo.level!,
                children: [],
            };

            // Find the correct parent for this item based on level
            if (currentLists.length === 0 || listItemInfo.level === 0) {
                // First item or root level item
                currentLists.push(newItem);
            } else {
                // Find the appropriate parent based on indentation level
                let parent = currentLists[currentLists.length - 1];
                let targetLevel = listItemInfo.level! - 1;

                // Navigate to the correct nesting level
                while (targetLevel > 0 && parent.children.length > 0) {
                    parent = parent.children[parent.children.length - 1];
                    targetLevel--;
                }

                if (targetLevel === 0) {
                    parent.children.push(newItem);
                } else {
                    // If we can't find proper nesting, add as root level
                    currentLists.push(newItem);
                }
            }
            return;
        } else if (currentLists.length > 0) {
            // Check if this is a continuation line for the current list item
            if (
                trimmedLine &&
                (line.startsWith('  ') || line.startsWith('    ') || line.startsWith('\t'))
            ) {
                // Find the most recent list item to append to
                let targetItem = currentLists[currentLists.length - 1];
                while (targetItem.children.length > 0) {
                    targetItem = targetItem.children[targetItem.children.length - 1];
                }
                targetItem.content += '\n' + trimmedLine;
                return;
            } else if (trimmedLine === '') {
                // Empty line - don't flush list yet, might continue
                return;
            } else {
                // Non-list line - flush the current lists
                flushLists(currentLists);
                currentLists = [];
            }
        }

        // Handle empty lines
        if (trimmedLine === '') {
            flushParagraph();
            flushLists(currentLists);
            currentLists = [];
            flushTable();
            flushAlert();
            return;
        }

        // Regular paragraph text
        currentParagraph.push(line);
    });

    // Flush any remaining content
    flushParagraph();
    flushLists(currentLists);
    flushCodeBlock();
    flushTable();
    flushAlert();

    return <Box>{elements}</Box>;
}
