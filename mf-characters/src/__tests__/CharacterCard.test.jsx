import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterCard from '../components/CharacterCard';

const rick = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  gender: 'Male',
  status: 'Alive',
  species: 'Human',
};

describe('CharacterCard', () => {
  it('muestra imagen, nombre, estado, especie y género', () => {
    render(<CharacterCard character={rick} onSelect={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toHaveAttribute('src', rick.image);
    expect(screen.getByText('Vivo')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('llama a onSelect con el id al hacer click', async () => {
    const onSelect = jest.fn();
    render(<CharacterCard character={rick} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button', { name: /ver detalle de rick sanchez/i }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
