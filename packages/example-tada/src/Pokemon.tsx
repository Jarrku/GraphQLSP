import { FragmentOf, graphql, readFragment } from './graphql';

const Pokemon1 = graphql(`
  fragment Pok1 on Pokemon {
    resistant
  }
`);

const Pokemon2 = graphql(
  /* GraphQL */ `
    fragment Pok2 on Pokemon {
      id
      ...Pok1
    }
  `,
  [Pokemon1]
);

export const PokemonFields = graphql(
  /* GraphQL */ `
    fragment PokemonFields on Pokemon {
      ...Pok2
      name
      weight {
        minimum
      }
    }
  `,
  [Pokemon2]
);

interface Props {
  data: FragmentOf<typeof PokemonFields> | null;
}

export const Pokemon = ({ data }: Props) => {
  const pokemon = readFragment(PokemonFields, data);

  // no error within editor, until I comment out `...Pok1` and the dep array in `Pokemon2`
  const res = pokemon?.any;
  const resistant = readFragment(Pokemon2, pokemon);

  if (!pokemon || !resistant) {
    return null;
  }

  return (
    <li>
      {pokemon.name}
      {resistant.resistant}
    </li>
  );
};
