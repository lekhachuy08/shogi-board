import EmpObj from './emp';
import { turnOverPieceName } from '../fn/strings';

type PieceOrEmp = PieceObj | EmpObj;
type PieceOrEmpTargets = Array<PieceOrEmp>;

export default class PieceObj {
  name: string;
  whose: number;
  row: number;
  col: number;
  _canMoveTo: PieceOrEmpTargets;
  constructor(
    name: string,
    whose: number,
    row: number,
    col: number,
    _movs?: PieceOrEmpTargets,
  ) {
    this.name = name;
    this.whose = whose;
    this.row = row;
    this.col = col;
    this._canMoveTo = _movs || [];
  }

  set canMoveTo(movs: PieceOrEmpTargets) {
    this._canMoveTo = movs;
  }

  get canMoveTo(): PieceOrEmpTargets {
    return this._canMoveTo;
  }

  canPromote(r: number): boolean {
    const row = this.row;
    return row !== -1 && check(this);

    function check(this_: PieceObj): boolean {
      const rowCheck =
        this_.whose === 0 ? r <= 2 || row <= 2 : 6 <= r || 6 <= row;
      const nameCheck = ['飛', '角', '銀', '桂', '香', '歩'].includes(this_.name);
      return rowCheck && nameCheck;
    }
  }

  canMove(target: PieceOrEmp): boolean {
    const movs = this.canMoveTo;
    return movs && movs.includes(target);
  }

  canMoveNext(turn: number, r: number): boolean {
    const name = this.name;
    return ['歩', '香', '桂'].includes(name) ? check() : true;

    function check() {
      return name === '桂' ? kei() : fu();
    }

    function kei(): boolean {
      return turn === 0 ? 1 < r : r < 7;
    }

    function fu(): boolean {
      return turn === 0 ? 0 < r : r < 8;
    }
  }

  captured(): PieceObj {
    const newName = turnOverPieceName(this.name, 'demote');
    return new PieceObj(newName, 1 - this.whose, -1, -1);
  }

  move(r: number, c: number): PieceObj {
    return new PieceObj(this.name, this.whose, r, c);
  }

  promote(r: number, c: number): PieceObj {
    const newName = turnOverPieceName(this.name, 'promote');
    return new PieceObj(newName, this.whose, r, c);
  }

  update() {
    return new PieceObj(this.name, this.whose, this.row, this.col);
  }
}
