'use client'
import { use } from 'react';

const GigId = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  return (
    <div>
      this is from a client sided component {id}
    </div>
  )
}

export default GigId;