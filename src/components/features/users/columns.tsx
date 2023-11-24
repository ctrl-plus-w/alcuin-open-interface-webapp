import { useMemo } from 'react';

import { CellContext, ColumnDef } from '@tanstack/react-table';

import UserDropdownMenu from '@/feature/users/dropdown-menu';

import { Badge } from '@/ui/badge';

import useTailwindBreakpoint from '@/hook/useTailwindBreakpoints';

import { prettifyCalendarName } from '@/util/string.util';

const IdCell = ({ row }: CellContext<Database.IProfile, any>) => {
  const breakpoint = useTailwindBreakpoint();

  const handleClick = () => {
    navigator.clipboard.writeText(row.original.id);
  };

  const id = useMemo(() => {
    if (['sm', 'md'].includes(breakpoint)) return row.original.id.split('-')[0] + '...';
    return row.original.id;
  }, [row, breakpoint]);

  return <button onClick={handleClick}>{id}</button>;
};

const GroupsCell = ({ row }: CellContext<Database.IProfile, any>) => {
  const rowGroups = row.original.groups;
  const groups = Array.isArray(rowGroups) ? rowGroups : [];

  return (
    <div className="flex gap-2">
      {groups.map((group) => (
        <Badge key={group}>{prettifyCalendarName(group)}</Badge>
      ))}

      {!groups.length && <p className="opacity-50 whitespace-nowrap">Aucun groupe.</p>}
    </div>
  );
};

export const columns = (loggedInUser: Database.IProfile): ColumnDef<Database.IProfile>[] => [
  { id: 'id', header: 'ID', cell: IdCell },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { id: 'groups', header: 'Groupes', cell: GroupsCell },
  {
    id: 'actions',
    cell: ({ row }) => <UserDropdownMenu loggedInUser={loggedInUser} user={row.original} />,
  },
];
