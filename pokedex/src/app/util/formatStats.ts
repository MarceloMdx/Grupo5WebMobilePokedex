export const formatStats = (stats: any[]) => {
  const getStat = (name: string) =>
    stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  return {
    hp: getStat("hp"),
    attack: getStat("attack"),
    defense: getStat("defense"),
    speed: getStat("speed"),
    specialAttack: getStat("special-attack"),
    specialDefense: getStat("special-defense"),
  };
};