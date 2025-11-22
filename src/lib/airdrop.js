export const airdrop = [
    {
        "slug": "hyperliquid",
        "name": "Hyperliquid Points",
        "chain": "HyperEVM",
        "difficulty": "Medium",
        "tags": ["DEX", "Perp", "Active"],
        "quests": [
            "Deposit small amount",
            "Open 3 trades",
            "Do 5 social interactions"
        ],
        "description": "High potential perp DEX airdrop. Focus on volume and consistency.",
        "link": "https://app.hyperliquid.xyz",
        "completedQuests": 0,
        "estimatedRisk": "Medium",
        "avgTimePerWeek": "2-3 hours"
    },
    {
        "slug": "monad",
        "name": "Monad Ecosystem",
        "chain": "Testnet",
        "difficulty": "Low",
        "tags": ["L1", "Infra"],
        "quests": [
            "Bridge/testnet faucet",
            "Interact with 2 dApps",
            "Provide feedback / join Discord"
        ],
        "description": "New high performance L1. Farm testnet early.",
        "link": "https://www.monad.xyz",
        "completedQuests": 0,
        "estimatedRisk": "Low",
        "avgTimePerWeek": "1 hour"
    },
    {
        "slug": "berachain",
        "name": "Berachain Testnet",
        "chain": "Testnet",
        "difficulty": "Low",
        "tags": ["L1", "DeFi", "Gaming"],
        "quests": [
            "Get testnet tokens",
            "Swap on BEX",
            "Provide liquidity",
            "Mint NFT",
            "Join Discord community"
        ],
        "description": "Proof of Liquidity L1. Early testnet participation recommended.",
        "link": "https://artio.berachain.com",
        "completedQuests": 0,
        "estimatedRisk": "Low",
        "avgTimePerWeek": "1-2 hours"
    },
    {
        "slug": "scroll",
        "name": "Scroll Sessions",
        "chain": "L2",
        "difficulty": "Medium",
        "tags": ["L2", "zkEVM", "Active"],
        "quests": [
            "Bridge ETH to Scroll",
            "Complete 10 transactions",
            "Use 5 different protocols",
            "Hold session badges"
        ],
        "description": "zkEVM rollup with session-based rewards. Consistency is key.",
        "link": "https://scroll.io",
        "completedQuests": 0,
        "estimatedRisk": "Medium",
        "avgTimePerWeek": "3-4 hours"
    },
    {
        "slug": "linea",
        "name": "Linea Voyage",
        "chain": "L2",
        "difficulty": "High",
        "tags": ["L2", "zkEVM", "DeFi"],
        "quests": [
            "Bridge assets",
            "Complete weekly quests",
            "Use partnered dApps",
            "Maintain activity streak",
            "Refer friends"
        ],
        "description": "ConsenSys zkEVM with voyage campaign. Multiple waves required.",
        "link": "https://linea.build",
        "completedQuests": 0,
        "estimatedRisk": "High",
        "avgTimePerWeek": "4-5 hours"
    },
    {
        "slug": "zksync",
        "name": "zkSync Era",
        "chain": "L2",
        "difficulty": "High",
        "tags": ["L2", "zkEVM", "DeFi"],
        "quests": [
            "Bridge and hold assets",
            "Use native protocols",
            "Provide liquidity",
            "NFT interactions",
            "Long-term activity"
        ],
        "description": "Established zkEVM L2. Focus on diverse protocol usage.",
        "link": "https://zksync.io",
        "completedQuests": 0,
        "estimatedRisk": "Medium",
        "avgTimePerWeek": "3 hours"
    }
];


export function findAirdropBySlug(slug) {
    return airdrop.find(airdrop => airdrop.slug === slug);
}
