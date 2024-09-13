"use client";
import React, { Suspense } from "react";
import SubmitContent from "@/components/submit/SubmitContent";

export default function SubmitPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubmitContent />
        </Suspense>
    );
}
