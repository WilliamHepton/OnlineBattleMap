export interface BattleImage {
    name: string;
    url: String | ArrayBuffer;
    category: string;
}

export interface Category {
    name: string;
    images: BattleImage[];
}