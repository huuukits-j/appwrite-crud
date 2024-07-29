"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function CreatePage() {
    const [formData, setFormData] = useState({ term: "", interpretation: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.term || !formData.interpretation) {
            setError("Please fill in the form fields");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/interpretations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create interpretation");
            }

            router.push("/");
        } catch (err) {
            console.log(err);
            setError("Something went wrong, please try again");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
            <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
                <input
                    type="text"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    placeholder="Term"
                    className="py-1 px-4 border rounded-md"
                />
                <textarea
                    name="interpretation"
                    value={formData.interpretation}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Interpretation"
                    className="py-1 px-4 border rounded-md resize-none"
                ></textarea>
                <button
                    className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Add Interpretation"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
