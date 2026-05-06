import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Piece } from "@shared/types";
import { animationAgent } from "./animation/strips";
import { BoardCellComponent } from "@game/components/BoardCell";

const aiPiece: Piece = {
  id: "ai-target",
  owner: "ai",
  row: 5,
  col: 2,
  alive: true,
  label: "CPU",
  weapon: "scissors",
  weaponIcon: null,
  role: "soldier",
  roleIcon: null,
  silhouette: false,
};

describe("BoardCell animation states", () => {
  it("V13 marks valid attack target cells with a pulse class without changing the sprite", () => {
    vi.spyOn(animationAgent, "play").mockImplementation(() => undefined);

    render(
      <BoardCellComponent
        cell={{ row: 5, col: 2, piece: aiPiece }}
        selected={false}
        isSelectable={false}
        isValidMove={false}
        isValidTarget={true}
        isRevealPhase={false}
        isDying={false}
        isMoving={false}
        onPieceClick={() => undefined}
        onCellClick={() => undefined}
      />,
    );

    expect(screen.getByTestId("cell-r5c2")).toHaveClass("valid-attack-target");
    expect(screen.getByTestId("animated-sprite-blue_idle")).toBeInTheDocument();
  });
});
