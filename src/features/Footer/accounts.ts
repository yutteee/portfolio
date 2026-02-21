export type Account = {
	name: string;
	url: string;
	img: string;
	alt: string;
	darkImg: string;
	isWantedly: boolean;
};

export const accounts: Account[] = [
	{
		name: "GitHub",
		url: "https://github.com/yutteee",
		img: "/github.png",
		alt: "GitHub",
		darkImg: "/github_dark.png",
		isWantedly: false,
	},
	{
		name: "X(旧Twitter)",
		url: "https://x.com/yutteeeeeeeee",
		img: "/x.png",
		alt: "X(旧Twitter)",
		darkImg: "/x_dark.png",
		isWantedly: false,
	},
	{
		name: "Qiita",
		url: "https://qiita.com/yutteee",
		img: "/qiita.png",
		alt: "Qiita",
		darkImg: "/qiita.png",
		isWantedly: false,
	},
	{
		name: "Zenn",
		url: "https://zenn.dev/yutteee",
		img: "/zenn.svg",
		alt: "Zenn",
		darkImg: "/zenn.svg",
		isWantedly: false,
	},
	{
		name: "Wantedly",
		url: "https://www.wantedly.com/id/yutteee",
		img: "/wantedly.png",
		alt: "Wantedly",
		darkImg: "/wantedly_dark.png",
		isWantedly: true,
	},
];
