import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from 'node:fs/promises';

export async function createOgImage(text: string) {
    // publicにあるフォントファイルを読み込む
    const regularFont = await fs.readFile("public/ZenKakuGothicNew-Regular.ttf");
    const boldFont = await fs.readFile("public/ZenKakuGothicNew-Bold.ttf");

    const svg = await satori(
      <div
      style={{
        backgroundColor: "#84c5ea",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        fontFamily: "Zen Kaku Gothic New",
        color: "#041b47"
      }}
    >
      <img
        src={`${import.meta.env.SITE_URL}/ogp.png`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          zIndex: -1
        }}
        alt=""
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "4rem",
          fontWeight: 700,
          padding: "0 64px"
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          fontSize: "1.5rem",
        }}
      >
        yutteee-portfolio
      </div>
    </div>,
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Zen Kaku Gothic New",
              data: regularFont,
              weight: 400,
              style: "normal",
            },
            {
              name: "Zen Kaku Gothic New",
              data: boldFont,
              weight: 700,
              style: "normal",
            },
          ],
        }
      );
  
  const resvg = new Resvg(svg);

  return resvg.render().asPng();
}