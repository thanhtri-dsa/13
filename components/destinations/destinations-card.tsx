import { Destination } from '@/types/destinations'
import Link from 'next/link';
import React from 'react';

const DestinationLink: React.FC<{ destination: Destination }> = ({ destination }) => {
  return (
    <Link href={`/destinations/${destination.country.toLowerCase()}/${destination.id}`}>
      {destination.name}
    </Link>
  );
};

export default DestinationLink;

