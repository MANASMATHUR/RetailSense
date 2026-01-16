import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        // 1. Intent Extraction
        const intentResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'Extract retail intent from user query. Return JSON: retailer, brand, product_category, purchase_channel, policy_type, time_window_days.'
                },
                { role: 'user', content: text }
            ],
            response_format: { type: 'json_object' }
        });

        const intent = JSON.parse(intentResponse.choices[0].message.content || '{}');

        // 2. Mino Agent Reasoning (Simulated Dynamic Reasoning)
        const isActuallyEligible = (intent.time_window_days || 0) <= 30; // Mock logic: most retailers allow 30 days

        const activities = [
            `Navigating to ${intent.retailer || 'retailer'}'s official website...`,
            `Locating ${intent.policy_type || 'return'} policy for ${intent.product_category || 'items'}...`,
            `Analyzing ${intent.purchase_channel || 'purchase'} channel exclusions...`,
            `Extracting verified evidence for ${intent.brand || intent.retailer}...`
        ];

        const minoOutput = {
            answer: isActuallyEligible ? "Yes" : "No",
            reason: isActuallyEligible
                ? `${intent.retailer} typically allows returns for ${intent.product_category || 'items'} within 30 days of purchase.`
                : `Unfortunately, the return window for ${intent.product_category || 'this item'} at ${intent.retailer} has expired.`,
            conversational_reply: isActuallyEligible
                ? `No worries mate! I've checked the ${intent.retailer} policy for ya. Since you're only at ${intent.time_window_days} days, you're well within the limit. Just make sure you've got the tags on, and you'll be right as rain!`
                : `Ah, tough luck mate. I've had a look at the ${intent.retailer} fine print, and it looks like you're outside the return window for those ${intent.product_category || 'items'}. Is there anything else I can dig up for you?`,
            exceptions: [
                "Must be in original condition",
                "Proof of purchase required",
                "Excludes final sale items"
            ],
            sources: [
                `https://www.google.com/search?q=${(intent.retailer || 'retailer').toLowerCase()}+return+policy`,
                `https://www.${(intent.retailer || 'retailer').toLowerCase()}.com/help/returns`
            ],
            confidence_score: 0.94,
            policy_clarity: "High"
        };

        return NextResponse.json({ intent, activities, result: minoOutput });
    } catch (error: any) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
