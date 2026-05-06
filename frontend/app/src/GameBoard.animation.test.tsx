import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BoardCell, Piece } from "@shared/types";
import { GameBoard } from "@game/components/GameBoard";

const piece: Piece = {
  id: "player-1",
  owner: "player",
  row: 1,
  col: 1,
  alive: true,
  label: "P1",
  weapon: "rock",
  weaponIcon: null,
  role: "soldier",
  roleIcon: null,
  silhouette: false,
};

const boardCells: BoardCell[] = [
  { row: 1, col: 1, piece },
  { row: 1, col: 2, piece: null },
];

describe("GameBoard animation states", () => {
  it("applies ambient motion to the board container", () => {
    render(
      <GameBoard
        boardCells={boardCells}
        selectedPieceId={null}
        selectablePieceIds={new Set()}
        validMoveSet={new Set()}
        phase="player_turn"
        dyingIds={new Set()}
        movingPieceId={null}
        onPieceClick={() => undefined}
        onCellClick={() => undefined}
      />,
    );

    expect(screen.getByTestId("game-board")).toHaveClass("game-board-ambient");
  });
});
