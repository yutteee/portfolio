const ENDPOINT = "http://localhost:8765";

type GetDeckNames = () => Promise<string[]>;
type GetCardIds = (deckName: string) => Promise<number[]>;
type GetCard = (cardId: number) => Promise<{ front: string; back: string }>;

type AnkiCard = {
    front: string;
    back: string;
    deckName: string;
    
}

type GetAnkiCards = () => Promise<>;