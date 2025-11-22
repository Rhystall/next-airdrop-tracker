<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import { walletAddress } from '$lib/stores/walletStore';

	const navLinks = [
		{ label: 'How it Works', href: '#how-it-works' },
		{ label: 'Notes', href: '#notes' },
		{ label: 'FAQ', href: '#faq' }
	];

	const trustBadges = ['Multi-chain', 'Testnet Ready', 'Farmer-first UI'];

	const heroChips = [
		{ label: 'HyperEVM', className: 'hero-chip-1' },
		{ label: 'L2', className: 'hero-chip-2' },
		{ label: 'Testnet', className: 'hero-chip-3' },
		{ label: 'Perp', className: 'hero-chip-4' }
	];

	const benefits = [
		{
			title: 'Multi-chain Overview',
			description:
				'Track airdrops across L1, L2, HyperEVM, and testnets all in one dashboard. Never miss an opportunity.',
			iconPaths: [
				'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
			]
		},
		{
			title: 'Quest Progress Tracking',
			description:
				'Check off quests as you complete them. See your progress in real-time with visual progress bars.',
			iconPaths: [
				'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
			]
		},
		{
			title: 'Risk & Time Insights',
			description:
				'Know the difficulty and time commitment for each airdrop. Optimize your farming strategy.',
			iconPaths: ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z']
		},
		{
			title: 'Profile Streak System',
			description:
				'Build your farming streak, track your stats, and stay motivated with gamified progress tracking.',
			iconPaths: [
				'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
			]
		}
	];

	const hiwSteps = [
		{
			number: '1',
			title: 'Add Your Airdrops',
			description: "Input the airdrops you're farming. Choose from popular protocols or add custom ones."
		},
		{
			number: '2',
			title: 'Track Quests & Tasks',
			description: 'Check off quests as you complete them. Monitor your progress with visual indicators.'
		},
		{
			number: '3',
			title: 'Optimize Your Time',
			description: 'Focus on high-priority airdrops. Use filters to organize by chain, difficulty, and completion.'
		}
	];

	const personas = [
		{
			title: 'DeFi Grinder',
			description: 'Focus on high-value L1 and L2 DeFi protocols. Track liquidity provision and trading volume.',
			icon: '🌾',
			stats: ['High Volume', 'L2 Focus', 'Risk Taker']
		},
		{
			title: 'Testnet Explorer',
			description: 'Early to every new chain. Farm testnet rewards and get ready for mainnet launches.',
			icon: '🧪',
			stats: ['Early Adopter', 'Low Risk', 'Multi-chain']
		},
		{
			title: 'Chain Maximalist',
			description: 'Deep dive into specific ecosystems. Master every protocol on your favorite chains.',
			icon: '⛓️',
			stats: ['Ecosystem Pro', 'Strategic', 'Long-term']
		}
	];

	const previewFilters = [
		{ label: 'All', active: true },
		{ label: 'L1', active: false },
		{ label: 'L2', active: false },
		{ label: 'HyperEVM', active: false },
		{ label: 'Testnet', active: false }
	];

	const previewCards = [
		{ title: 'Hyperliquid Points', badge: 'HyperEVM', progress: 67 },
		{ title: 'Scroll Sessions', badge: 'L2', progress: 25 },
		{ title: 'Berachain Testnet', badge: 'Testnet', progress: 80 }
	];

	const previewBenefits = [
		{
			text: 'Real-time progress',
			iconPaths: ['M13 10V3L4 14h7v7l9-11h-7z']
		},
		{
			text: 'Filter by chain/difficulty',
			iconPaths: [
				'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
			]
		},
		{
			text: 'Jump to detailed quests',
			iconPaths: [
				'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
				'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
			]
		}
	];

	const strategyNotes = [
		'Write custom notes for each airdrop',
		'Plan your farming priorities',
		'Track important deadlines and reminders',
		'Keep all your strategies in one place'
	];

	const faqs = [
		{
			question: 'Is my data stored on-chain?',
			answer: "No, your data is stored locally in your browser. We don't collect or store any personal information on our servers."
		},
		{
			question: 'Do I need to connect a wallet?',
			answer: 'No wallet connection required! This is a tracking tool that helps you organize your airdrop farming activities.'
		},
		{
			question: 'Can I track airdrops on any chain?',
			answer: 'Yes! You can add custom airdrops from any chain. We support L1, L2, HyperEVM, testnets, and more.'
		},
		{
			question: 'Is this tool free to use?',
			answer: 'Yes, Airdrop Quest Tracker is completely free to use. No fees, no subscriptions, just farming efficiency.'
		}
	];

	const socialLinks = [
		{ label: 'Twitter', href: '#', icon: 'twitter' },
		{ label: 'Discord', href: '#', icon: 'discord' },
		{ label: 'Telegram', href: '#', icon: 'telegram' }
	];

	const baseProductLinks = [
		{ label: 'How It Works', href: '#how-it-works' },
		{ label: 'Notes', href: '#notes' },
		{ label: 'Go to App', href: '/app' }
	];

	const defaultProfileSlug = 'farmer';
	$: profileSlug = $walletAddress ? $walletAddress.toLowerCase() : defaultProfileSlug;
	$: profileHref = `/profile/${profileSlug}`;
	$: productLinks = [...baseProductLinks, { label: 'Dashboard', href: profileHref }];

	const communityLinks = [
		{ label: 'Twitter', href: '#' },
		{ label: 'Discord', href: '#' },
		{ label: 'Telegram', href: '#' },
		{ label: 'GitHub', href: '#' }
	];

	const legalLinks = [
		{ label: 'Privacy Policy', href: '#' },
		{ label: 'Terms of Service', href: '#' },
		{ label: 'Disclaimer', href: '#' }
	];

	const currentYear = new Date().getFullYear();

	let activeFaq = -1;
	let landingRef;

	function toggleFaq(index) {
		activeFaq = activeFaq === index ? -1 : index;
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.to('.navbar', {
				padding: '0.75rem 2rem',
				backgroundColor: '#ffffff',
				scrollTrigger: {
					start: '100px top',
					end: '100px top',
					toggleActions: 'play none none reverse'
				}
			});

			gsap.from('.hero-heading', {
				opacity: 0,
				y: 40,
				duration: 1,
				ease: 'power3.out'
			});

			gsap.from('.hero-subtitle', {
				opacity: 0,
				y: 40,
				duration: 1,
				delay: 0.2,
				ease: 'power3.out'
			});

			gsap.from('.hero-buttons', {
				opacity: 0,
				y: 40,
				duration: 1,
				delay: 0.4,
				ease: 'power3.out'
			});

			gsap.from('.trust-badges', {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: 0.6,
				ease: 'power3.out'
			});

			gsap.from('.dashboard-mockup', {
				opacity: 0,
				scale: 0.9,
				duration: 1,
				delay: 0.3,
				ease: 'power3.out'
			});

			gsap.from('.floating-chip', {
				opacity: 0,
				scale: 0,
				duration: 0.8,
				delay: 1,
				stagger: 0.15,
				ease: 'back.out(1.7)'
			});

			gsap.to('.hero-chip-1', {
				y: -20,
				duration: 3,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			gsap.to('.hero-chip-2', {
				y: -15,
				duration: 4,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 0.5
			});

			gsap.to('.hero-chip-3', {
				y: -25,
				duration: 3.5,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 1
			});

			gsap.to('.hero-chip-4', {
				y: -18,
				duration: 4.5,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 1.5
			});

			gsap.from('.benefit-card', {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.15,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.benefits-grid',
					start: 'top 80%'
				}
			});

			gsap.from('.hiw-step', {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.hiw-container',
					start: 'top 80%'
				}
			});

			gsap.from('.persona-card', {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.personas-grid',
					start: 'top 80%'
				}
			});

			gsap.from('.preview-mockup', {
				opacity: 0,
				scale: 0.95,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.preview-mockup',
					start: 'top 80%'
				}
			});

			gsap.from('.preview-benefit', {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.preview-benefits',
					start: 'top 80%'
				}
			});

			gsap.from('.notes-mockup', {
				opacity: 0,
				x: -40,
				duration: 0.8,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.notes-container',
					start: 'top 80%'
				}
			});

			gsap.from('.notes-list li', {
				opacity: 0,
				x: 40,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.notes-list',
					start: 'top 80%'
				}
			});

			gsap.from('.faq-item', {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.faq-container',
					start: 'top 80%'
				}
			});

			gsap.to('.bg-orb-1', {
				y: 200,
				scrollTrigger: {
					start: 'top top',
					end: 'bottom top',
					scrub: 1
				}
			});

			gsap.to('.bg-orb-2', {
				y: -150,
				scrollTrigger: {
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1
				}
			});

			gsap.to('.bg-orb-3', {
				y: 100,
				scrollTrigger: {
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1
				}
			});
		}, landingRef);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Airdrop Quest Tracker - Track Your Web3 Farming</title>
</svelte:head>

<div class="landing-page" bind:this={landingRef}>
	<div class="bg-orb bg-orb-1" aria-hidden="true"></div>
	<div class="bg-orb bg-orb-2" aria-hidden="true"></div>
	<div class="bg-orb bg-orb-3" aria-hidden="true"></div>

	<nav class="navbar">
		<div class="navbar-container">
			<a href="/landing" class="navbar-logo" aria-label="Airdrop Quest Tracker home">
				<div class="logo-icon">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
						/>
					</svg>
				</div>
				Airdrop Quest Tracker
			</a>
			<ul class="navbar-menu">
				{#each navLinks as link}
					<li>
						<a href={link.href}>{link.label}</a>
					</li>
				{/each}
			</ul>
			<div class="navbar-actions">
				<button
					class="theme-toggle"
					type="button"
					on:click={toggleTheme}
					aria-label="Toggle theme"
					aria-pressed={$theme === 'light'}
				>
					{#if $theme === 'dark'}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
						</svg>
					{/if}
				</button>
				<a href="/app" class="btn btn-primary">Go to App</a>
			</div>
		</div>
	</nav>

	<section class="hero">
		<div class="hero-container">
			<div class="hero-content">
				<h1 class="hero-heading">Track Your Airdrop Farming Like a Pro</h1>
				<p class="hero-subtitle">
					One cockpit to manage quests, chains, and progress across all your Web3 airdrops.
				</p>
				<div class="hero-buttons">
					<a href="/app" class="btn btn-primary btn-hero">Go to App</a>
					<a href={profileHref} class="btn btn-secondary btn-hero">View Profile</a>
					<a href="#preview" class="btn btn-secondary btn-hero">Watch Demo</a>
				</div>
				<div class="trust-badges">
					{#each trustBadges as badge}
						<div class="trust-badge">{badge}</div>
					{/each}
				</div>
			</div>
			<div class="hero-mockup">
				<div class="mockup-container">
					<div class="dashboard-mockup">
						<div class="mockup-header">
							<div class="mockup-dot mockup-dot-1"></div>
							<div class="mockup-dot mockup-dot-2"></div>
							<div class="mockup-dot mockup-dot-3"></div>
						</div>
						<div class="mockup-content">
							<div class="mockup-bar">
								<div class="mockup-bar-fill" style="width: 70%"></div>
							</div>
							<div class="mockup-bar">
								<div class="mockup-bar-fill" style="width: 45%"></div>
							</div>
							<div class="mockup-bar">
								<div class="mockup-bar-fill" style="width: 85%"></div>
							</div>
							<div class="mockup-bar">
								<div class="mockup-bar-fill" style="width: 60%"></div>
							</div>
						</div>
					</div>
					{#each heroChips as chip}
						<div class={`floating-chip ${chip.className}`}>{chip.label}</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="how-it-works">
		<div class="section-container">
			<div class="section-header">
				<h2 class="section-title">How It Works</h2>
				<p class="section-subtitle">Get started in three simple steps</p>
			</div>
			<div class="hiw-container">
				<div class="hiw-timeline-line" aria-hidden="true"></div>
				{#each hiwSteps as step}
					<div class="hiw-step">
						<div class="hiw-number">{step.number}</div>
						<h3 class="hiw-title">{step.title}</h3>
						<p class="hiw-description">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="section" id="notes">
		<div class="section-container">
			<div class="notes-container">
				<div class="notes-text">
					<h2 class="section-title" style="text-align: left; margin-bottom: 1.5rem;">
						Strategy &amp; Planning
					</h2>
					<ul class="notes-list">
						{#each strategyNotes as note}
							<li>
								<svg
									class="notes-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{note}</span>
							</li>
						{/each}
					</ul>
				</div>
				<div class="notes-visual" aria-hidden="true">
					<div class="visual-orb">
						<div class="orb-core">
							<span class="orb-eyebrow">Live</span>
							<span class="orb-label">Strategy Sync</span>
						</div>
						<div class="orb-ring ring-1"></div>
						<div class="orb-ring ring-2"></div>
					</div>

					<div class="visual-pill pill-top">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							width="20"
							height="20"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<div>
							<p>Auto reminders</p>
							<strong>Never miss a quest</strong>
						</div>
					</div>

					<div class="visual-pill pill-left">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							width="20"
							height="20"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 0v6m0 0l-3-3m3 3l3-3m-9 9h12"
							/>
						</svg>
						<div>
							<p>Multichain focus</p>
							<strong>Balance L1 & L2</strong>
						</div>
					</div>

					<div class="visual-pill pill-bottom">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							width="20"
							height="20"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6l4 2m6-5a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<p>Priority queue</p>
							<strong>Execute the next move</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="faq">
		<div class="section-container">
			<div class="section-header">
				<h2 class="section-title">Frequently Asked Questions</h2>
				<p class="section-subtitle">Everything you need to know</p>
			</div>
			<div class="faq-container">
				{#each faqs as faq, index}
					<div class={`faq-item ${activeFaq === index ? 'active' : ''}`}>
						<button
							class="faq-question"
							type="button"
							on:click={() => toggleFaq(index)}
							aria-expanded={activeFaq === index}
						>
							<span>{faq.question}</span>
							<svg
								class="faq-icon"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						<div class="faq-answer" aria-hidden={activeFaq !== index}>
							<div class="faq-answer-content">{faq.answer}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<footer class="footer">
		<div class="footer-container">
			<div class="footer-top">
				<div class="footer-brand">
					<a href="/landing" class="footer-logo">
						<div class="logo-icon">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
								/>
							</svg>
						</div>
						Airdrop Quest Tracker
					</a>
					<p class="footer-description">
						The ultimate tool for Web3 airdrop farmers. Track quests, manage progress, and optimize your
						farming strategy across all chains.
					</p>
					<div class="footer-social">
						{#each socialLinks as link}
							<a href={link.href} aria-label={link.label}>
								{#if link.icon === 'twitter'}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
										/>
									</svg>
								{:else if link.icon === 'discord'}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
										/>
									</svg>
								{:else if link.icon === 'telegram'}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"
										/>
									</svg>
								{/if}
							</a>
						{/each}
					</div>
				</div>
				<div class="footer-column">
					<h4>Product</h4>
					<ul class="footer-links">
						{#each productLinks as link}
							<li>
								<a href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>
				<div class="footer-column">
					<h4>Community</h4>
					<ul class="footer-links">
						{#each communityLinks as link}
							<li>
								<a href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>
				<div class="footer-column">
					<h4>Legal</h4>
					<ul class="footer-links">
						{#each legalLinks as link}
							<li>
								<a href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="footer-bottom">
				<p>&copy; {currentYear} Airdrop Quest Tracker. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
