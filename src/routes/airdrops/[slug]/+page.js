import { findAirdropBySlug } from "$lib/airdrop";
import { error } from "@sveltejs/kit";

export function load({ params }) {
    const airdrop = findAirdropBySlug(params.slug);

    if (!airdrop) {
        throw error(404, "Airdrop not found");
    }

    return {
        airdrop
    };
}