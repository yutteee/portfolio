const ENDPOINT = "http://localhost:8765";

type AnkiCard = {
    question: string;
    answer: string;
    deckName: string;
};

type GetAnkiCards = () => Promise<AnkiCard[]>;

export const getAnkiCards: GetAnkiCards = async () => {
    const cardIds = await fetchAddedCardIdsByYesterday();
    const cardsInfo = await fetchCardsInfo(cardIds);

    const ankiCards = cardsInfo
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .filter((card: any) => card.fields) // Filter out cards without fields
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((card: any) => ({
            question: card.fields.表面.value,
            answer: card.fields.裏面.value,
            deckName: card.deckName,
        }));

    return ankiCards;
};

async function fetchAddedCardIdsByYesterday(): Promise<number[]> {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "findNotes",
            version: 6,
            params: {
                query: "added:1",
            },
        }),
    });

    const json = await response.json();
    return json.result;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function fetchCardsInfo(cardIds: number[]): Promise<any[]> {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "cardsInfo",
            version: 6,
            params: {
                cards: cardIds,
            },
        }),
    });

    const json = await response.json();
    return json.result;
}