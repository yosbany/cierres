import React from 'react';
import { User } from 'lucide-react';

interface ClosureOwnerProps {
  userId: string;
  isCurrentUser: boolean;
}

export default function ClosureOwner({ userId, isCurrentUser }: ClosureOwnerProps) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <User className="h-3 w-3" />
      <span>{isCurrentUser ? 'Mi cierre' : `Usuario ${userId.slice(0, 8)}`}</span>
    </div>
  );
}