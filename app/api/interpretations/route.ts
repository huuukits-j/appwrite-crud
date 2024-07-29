import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function createInterpretation(data: {
    term: string;
    interpretation: string;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Interpretations",
            ID.unique(),
            data
        );
        return response;
    } catch (err) {
        console.error("Error creating interpretation", err);
        throw new Error("Failed to create interpretation");
    }
}

async function fetchInterpretations() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Interpretations", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (err) {
        console.error("Error fetching interpretation", err);
        throw new Error("Failed to fetch interpretation");
    }
}

export async function POST(req: Request) {
    try {
        const { term, interpretation } = await req.json();
        const data = { term, interpretation };
        const response = await createInterpretation(data);
        return NextResponse.json({ message: "Interpretation created" });
    } catch (err) {
        return NextResponse.json({ error: "Failed to create interpretation" },
            { status: 500 })
    }
}

export async function GET() {
    try {
        const interpretations = await fetchInterpretations();
        return NextResponse.json(interpretations);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch interpretation" },
            { status: 500 })
    }
}
