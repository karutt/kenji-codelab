import { NextRequest, NextResponse } from 'next/server';

interface CodeSubmissionRequest {
    title: string;
    code: string;
    name: string;
    index: number;
    language: string;
    articleSlug: string;
    bookSlug: string;
}

// In-memory storage for testing (would be replaced with actual database)
const submissions: (CodeSubmissionRequest & {
    id: string;
    timestamp: string;
})[] = [];

export async function POST(request: NextRequest) {
    try {
        console.log('Local code submission API called');
        const body: CodeSubmissionRequest = await request.json();
        console.log('Request body:', {
            ...body,
            code: body.code?.substring(0, 100) + '...',
        });

        // Validate required fields
        if (
            !body.title ||
            !body.code ||
            !body.name ||
            !body.language ||
            !body.articleSlug ||
            !body.bookSlug
        ) {
            console.error('Missing required fields:', {
                title: !!body.title,
                code: !!body.code,
                name: !!body.name,
                language: !!body.language,
                articleSlug: !!body.articleSlug,
                bookSlug: !!body.bookSlug,
            });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Store submission locally for testing
        const submission = {
            ...body,
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
        };

        submissions.push(submission);
        console.log('Submission stored locally:', {
            id: submission.id,
            title: submission.title,
            name: submission.name,
            codeLength: submission.code.length,
            timestamp: submission.timestamp,
        });
        console.log('Total submissions:', submissions.length);

        return NextResponse.json({
            success: true,
            id: submission.id,
            message: 'Code submitted successfully (local storage)',
        });
    } catch (error) {
        console.error('Code submission error:', error);
        return NextResponse.json({ error: 'Failed to submit code' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        totalSubmissions: submissions.length,
        recentSubmissions: submissions.slice(-5).map(s => ({
            id: s.id,
            title: s.title,
            name: s.name,
            language: s.language,
            articleSlug: s.articleSlug,
            bookSlug: s.bookSlug,
            codePreview: s.code.substring(0, 100) + '...',
            timestamp: s.timestamp,
        })),
    });
}
