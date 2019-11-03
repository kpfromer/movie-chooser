import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Movie, Tag } from '../type';
import { GET_MOVIES_TAGS } from '../resolvers/movies';
import { CircularProgress } from '@material-ui/core';

const Backup: React.FC = () => {
  const { data, loading } = useQuery<{
    movies: Movie[];
    tags: Tag[];
  }>(GET_MOVIES_TAGS);

  if (loading || !data) {
    return <CircularProgress variant="indeterminate" />;
  }

  return <code>{JSON.stringify(data.movies)}</code>;
};

export default Backup;
