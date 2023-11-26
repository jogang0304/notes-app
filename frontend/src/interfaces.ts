interface Token {
  username: string;
  expires: number;
}

interface Note {
  title: string;
  text: string;
  owner_id: number;
  id: number;
}

export type { Token, Note };
