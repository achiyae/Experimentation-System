export class TagBorder {
  constructor(public row: number, public column: number) {
  }

  static greaterThan(b1: TagBorder, b2: TagBorder): boolean {
    if (b1.row > b2.row) {
      return true;
    }
    if (b1.row === b2.row) {
      return b1.column > b2.column;
    }
    return false;
  }

  clone(): TagBorder {
    return new TagBorder(this.row, this.column);
  }
}

export class Tag {
  constructor(public from: TagBorder, public to: TagBorder) {
  }

  clone(): Tag {
    return new Tag(this.from.clone(), this.to.clone());
  }
}
