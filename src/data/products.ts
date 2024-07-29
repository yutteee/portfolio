type Product = {
	title: string;
	description: string;
	detail: string;
	period: string;
	image: string;
	url?: string;
	github?: string;
};

export const products: Product[] = [
	{
		title: "yutteee-portfolio",
		description: "私のポートフォリオサイト",
		period: "2023/09 - 2023/10",
		detail: "私のポートフォリオサイト",
		image: "/portfolio.png",
		url: "https://yutteee.pages.dev/",
		github: ""
	},
	{
		title: "jack-web",
		description: "アプリ開発団体jackの公式サイト",
		period: "2023/09 - 2023/10",
		detail: "アプリ開発団体jackの公式サイト",
		image: "/jackweb.png",
		url: "https://www.jackapp.jp/",
		github: ""
	},
	{
		title: "jack-blog",
		description: "アプリ開発団体jackのブログサイト",
		period: "2023/04 - 2024/03",
		detail: "Next.jsで作成したブログサイトです。",
		image: "/jack-blog.png",
		url: "https://jackun-blog.vercel.app/",
		github: "https://github.com/jack-app/jack-blog-ts",
	},
	{
		title: "gather_chatGPT",
		description: "Gatherで動作するチャットボット",
		period: "2023/03",
		detail: "Gatherで動作するチャットボットです。",
		image: "/gather_chatGPT.gif",
		url: "https://gather.town/app/1Q7Z2Z2Q1Q7Z2Z2Q/gather_chatGPT",
		github: "https://github.com/yutteee/gather_chatGPT",
	},
	{
		title: "STECHメンバーズサイト",
		description: "学生エンジニア団体STECHのメンバーズサイト",
		period: "2022/10 - 2024/01",
		detail: "学生エンジニア団体STECHのメンバーズサイト",
		image: "/stech.png",
		url: "https://www.stech-membership.com/",
	},
	{
		title: "CODE_DUEL",
		description: "プログラミング言語やフレームワークで戦うカードゲーム",
		period: "2022/08 - 2022/09",
		detail: "プログラミング言語やフレームワークで戦うカードゲームです。",
		image: "/CODE_DUEL.png",
		url: "https://code-duel.onrender.com/",
		github: "https://github.com/CODEDUEL2022/CODEDUEL",
	},
	{
		title: "旧portfolio",
		description: "私の旧ポートフォリオサイト",
		period: "2022/02",
		detail: "私の旧ポートフォリオサイト",
		image: "/yutteee-portfolio.png",
		url: "https://yutteee-portfolio.netlify.app/",
		github: "https://github.com/yutteee/Yutteee-Portfolio",
	},
	{
		title: "ランダムの題名",
		description: "名探偵コナン映画タイトルジェネレーター",
		period: "2021/10",
		detail: "初めての個人開発",
		image: "/conan-title.png",
		url: "https://conan-title-generator.netlify.app/",
	},
];
