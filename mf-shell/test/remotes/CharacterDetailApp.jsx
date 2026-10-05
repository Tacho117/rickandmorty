import { useParams } from 'react-router-dom';

// Remoto falso para pruebas: lee el id del Router del Shell, igual que el remoto real
export default function CharacterDetailApp() {
  const { id } = useParams();
  return <p>Remoto MF-CharacterDetail id={id}</p>;
}
