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
      <div
        style={{
          backgroundColor: "#f0f0f0",
          width: "400px",
          height: "240px",
          borderRadius: "12px",
          marginTop: "64px",
        }}
      >
      </div>
      <div
        style={{
          width: "150px",
          borderBottom: "28px solid #f0f0f0",
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent"
        }}
      >
      </div>
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