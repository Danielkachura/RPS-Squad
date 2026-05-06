import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Piece } from "@shared/types";
import { animationAgent } from "./animation/strips";
import { UnitSprite } from "@game/components/UnitSprite";

const basePiece: Piece = {
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

function renderSprite(piece: Piece, selected = false, isRevealPhase = false) {
  vi.spyOn(animationAgent, "play").mockImplementation(() => undefined);
  return render(
    <UnitSprite
      piece={piece}
      selected={selected}
      isSelectable={false}
      isValidTarget={false}
      isRevealPhase={isRevealPhase}
      isDying={false}
      onClick={() => undefined}
    />,
  );
}

describe("UnitSprite animation integration", () => {
  it("V10 renders player units with the red idle animated sprite", () => {
    renderSprite(basePiece);

    expect(screen.getByTestId("animated-sprite-red_idle")).toBeInTheDocument();
  });

  it("V10.1 applies idle breathing to the player sprite", () => {
    renderSprite(basePiece);

    expect(screen.getByTestId("animated-sprite-red_idle")).toHaveClass("idle-breathing");
  });

  it("V11 renders hidden CPU units with the blue silhouette animated sprite", () => {
    renderSprite({
      ...basePiece,
      id: "ai-1",
      owner: "ai",
      silhouette: true,
    });

    expect(screen.getByTestId("animated-sprite-blue_silhouette")).toBeInTheDocument();
  });

  it("V12 renders selected CPU units with the blue selected animated sprite", () => {
    renderSprite({
      ...basePiece,
      id: "ai-2",
      owner: "ai",
      silhouette: false,
    }, true);

    expect(screen.getByTestId("animated-sprite-blue_selected")).toBeInTheDocument();
  });

  it("V14 switches units to weapon reveal strips during the reveal phase", () => {
    renderSprite(basePiece, false, true);
    expect(screen.getByTestId("animated-sprite-red_weapon_reveal")).toBeInTheDocument();

    renderSprite({
      ...basePiece,
      id: "ai-reveal",
      owner: "ai",
      silhouette: true,
    }, false, true);
    expect(screen.getByTestId("animated-sprite-blue_weapon_reveal")).toBeInTheDocument();
  });

  it("V17 shows weapon badges during reveal and only player badges after reveal", () => {
    renderSprite({
      ...basePiece,
      id: "ai-reveal-badge",
      owner: "ai",
      weapon: "scissors",
      silhouette: true,
    }, false, true);
    expect(screen.getByAltText("scissors")).toBeInTheDocument();

    renderSprite({
      ...basePiece,
      id: "ai-hidden-after-reveal",
      owner: "ai",
      weapon: "scissors",
      silhouette: false,
    });
    expect(screen.getAllByAltText("scissors")).toHaveLength(1);
  });
});
