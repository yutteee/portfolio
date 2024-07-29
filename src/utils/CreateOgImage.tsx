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
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "linear-gradient(90deg, #FFC121, #FF5E2C)",
            fontFamily: "Zen Kaku Gothic New",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              gap: "16px",
              backgroundColor: "#FFFCF2",
              color: "#484335",
              width: "90%",
              height: "85%",
              padding: "32px 64px",
            }}
          >
            <div style={{ display: "flex", fontSize: "48px", fontWeight: 700 }}>{text}</div>
            <div style={{ display: "flex", fontSize: "32px" }}>yutteee</div>
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