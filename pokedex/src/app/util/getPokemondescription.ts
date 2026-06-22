export const getPokemonDescription = (speciesData: any) => {
const entries = speciesData.flavor_text_entries;

const portuguese =
entries.find(
    (entry: any) => entry.language.name === "pt"
) ??
entries.find(
    (entry: any) => entry.language.name === "pt-br"
);

const english = entries.find(
(entry: any) => entry.language.name === "en"
);

const description =
portuguese?.flavor_text ??
english?.flavor_text ??
"Descrição não disponível.";

return description.replace(/[\n\f]/g, " ");
};