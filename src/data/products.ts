type Product = {
	title: string;
	description: string;
	detail: string;
	period: string;
	image: string;
	url?: string;
	github?: string;
	alt: string;
};

export const products: Product[] = [
	{
		title: "OriCube",
		description: "折り紙の折り方を3Dで見れるwebアプリ",
		period: "2024/11 - 2024/12",
		detail: "折り紙の折り方を3Dで見れるwebアプリ",
		image: "/oricube.png",
		url: "https://ori-cube.com/",
		alt: "OriCubeのロゴ。複数の色の折り紙で作られた立方体とOriCubeという文字が表示されている。周りにはさまざまな種類の折り紙が散りばめられている。",
	},
	{
		title: "フェアナビ",
		description: "誠実なアクセシビリティオーバーレイ",
		period: "2024/02 - 2025/01",
		detail: "誠実なアクセシビリティオーバーレイ",
		image: "/fairnavi.png",
		url: "https://fairnavi.com/",
		alt: "fair-naviのトップ画面。フェアナビのLPサイト上で、フェアナビのアクセシビリティメニューが開かれている。",
	},
	{
		title: "ai-tango",
		description: "例文が自動で生成される単語帳アプリ",
		period: "2023/10 - 2023/11",
		detail: "例文が自動で生成される単語帳アプリ",
		image: "/ai-tango.png",
		url: "https://apps.apple.com/us/app/ai-tango/id6670333761",
		alt: "ai-tangoのモックアップ。左右に2台のスマートフォンがあり、ai-tangoの画面が表示されている。左のスマートフォンには英単語とその意味、例文が表示された詳細画面が表示されており、右のスマートフォンには単語一覧画面が表示されている。",
	},
	{
		title: "jack-web",
		description: "アプリ開発団体jackの公式サイト",
		period: "2023/09 - 2023/10",
		detail: "アプリ開発団体jackの公式サイト",
		image: "/jackweb.png",
		url: "https://www.jackapp.jp/",
		github: "",
		alt: "jack-webのトップ画面。「やりたいことを、やれるようになって、やる」というキャッチフレーズが大きく表示されている。文字の周りには吹き出しや電球、PCなどのアイコンによる装飾があり、jackという文字が右下に表示されている。",
	},
	{
		title: "yutteee-portfolio",
		description: "私のポートフォリオサイト",
		period: "2023/09 - 2023/10",
		detail: "私のポートフォリオサイト",
		image: "/portfolio.png",
		url: "https://yutteee.pages.dev/",
		github: "",
		alt: "yutteee-portfolioのトップ画面。中央にPCのイラストがあり、それに重なって「Hi!I'm Yutteee!」という文字が表示されている。",
	},
	{
		title: "CODE_DUEL",
		description: "プログラミング言語やフレームワークで戦うカードゲーム",
		period: "2022/08 - 2022/09",
		detail: "プログラミング言語やフレームワークで戦うカードゲームです。",
		image: "/CODE_DUEL.png",
		url: "https://code-duel.onrender.com/",
		github: "https://github.com/CODEDUEL2022/CODEDUEL",
		alt: "CODE_DUELのゲーム画面。手札にKotlin, Sass, Rust, HTMLがあり、場にElixir, phoenixが出されている。",
	},
];
