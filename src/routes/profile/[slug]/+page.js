import { airdrop as airdrops } from "$lib/airdrop";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
    const slug = params.slug;

    if (!slug) {
        throw error(404, "Profile not found");
    }

    return {
        slug,
        airdrops
    };
}
