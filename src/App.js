import React, { useEffect, useState } from 'react';
import qs from 'qs';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import './styles.css';

const api = 'https://gateway.marvel.com/v1/public/characters?ts=1616513366&apikey=149778318294793cdceb00e0dc41ca78&hash=b21c10921aec49d53b204c541056cd5e';

const LIMIT = 12;

export default function App() {
  const [info, setInfo] = useState({});
  const [text, setText] = useState('');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setInfo({});

    const query = {
      page: {
        limit: LIMIT,
        offset
      }
    };

    if (text) {
      query.filter = {
        text
      };
    }

    fetch(`${api}characters?${qs.stringify(query)}`)
      .then((response) => response.json())
      .then((response) => {
        setInfo(response);
      });
  }, [text, offset]);

  return (
    <div className="App">
      <h1>Characters</h1>
      <SearchInput
        value={text}
        onChange={(search) => setText(search)}
      />
      {text && !info.data && <span>Carregando...</span>}
      {info.data && (
        <ul className="characters-list">
          {info.data.map((characters) => (
            <li key={characters.id}>
              <img
                src={characters.attributes.posterImage.small}
                alt={characters.attributes.canonicalTitle}
              />
              {characters.attributes.canonicalTitle}
            </li>
          ))}
        </ul>
      )}
      {info.meta && (
        <Pagination
          limit={LIMIT}
          total={info.meta.count}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
}
