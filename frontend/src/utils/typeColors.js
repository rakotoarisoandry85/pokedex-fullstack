export const TYPE_COLORS = {
  Fire:     { bg: "#FF6B35", text: "#fff", glow: "rgba(255,107,53,0.5)" },
  Water:    { bg: "#4FC3F7", text: "#fff", glow: "rgba(79,195,247,0.5)" },
  Grass:    { bg: "#66BB6A", text: "#fff", glow: "rgba(102,187,106,0.5)" },
  Electric: { bg: "#FFD54F", text: "#222", glow: "rgba(255,213,79,0.5)" },
  Psychic:  { bg: "#F06292", text: "#fff", glow: "rgba(240,98,146,0.5)" },
  Ice:      { bg: "#80DEEA", text: "#222", glow: "rgba(128,222,234,0.5)" },
  Dragon:   { bg: "#7E57C2", text: "#fff", glow: "rgba(126,87,194,0.5)" },
  Dark:     { bg: "#546E7A", text: "#fff", glow: "rgba(84,110,122,0.5)" },
  Fairy:    { bg: "#F48FB1", text: "#fff", glow: "rgba(244,143,177,0.5)" },
  Normal:   { bg: "#BDBDBD", text: "#222", glow: "rgba(189,189,189,0.5)" },
  Fighting: { bg: "#EF5350", text: "#fff", glow: "rgba(239,83,80,0.5)" },
  Poison:   { bg: "#AB47BC", text: "#fff", glow: "rgba(171,71,188,0.5)" },
  Ground:   { bg: "#D4A04A", text: "#fff", glow: "rgba(212,160,74,0.5)" },
  Rock:     { bg: "#A1887F", text: "#fff", glow: "rgba(161,136,127,0.5)" },
  Bug:      { bg: "#8BC34A", text: "#fff", glow: "rgba(139,195,74,0.5)" },
  Ghost:    { bg: "#5C6BC0", text: "#fff", glow: "rgba(92,107,192,0.5)" },
  Steel:    { bg: "#90A4AE", text: "#fff", glow: "rgba(144,164,174,0.5)" },
  Flying:   { bg: "#81D4FA", text: "#222", glow: "rgba(129,212,250,0.5)" },
};

export const getPrimaryColor = (types) => {
  const t = types?.[0];
  return TYPE_COLORS[t] || { bg: "#555", text: "#fff", glow: "rgba(85,85,85,0.5)" };
};

export const statMax = {
  hp: 255, attack: 190, defense: 230,
  attack_special: 194, defense_special: 230, speed: 180,
};

export const statLabel = {
  hp: "HP", attack: "ATK", defense: "DEF",
  attack_special: "SP.ATK", defense_special: "SP.DEF", speed: "SPD",
};
