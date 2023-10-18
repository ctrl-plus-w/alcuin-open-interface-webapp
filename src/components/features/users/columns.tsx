import { ColumnDef } from '@tanstack/react-table';

import UserDropdownMenu from '@/feature/users/dropdown-menu';

import { Badge } from '@/ui/badge';

export const columns = (loggedInUser: Database.IProfile): ColumnDef<Database.IProfile>[] => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    cell: ({ row }) => {
      const rowGroups = row.getValue('groups');
      const groups = Array.isArray(rowGroups) ? rowGroups : [];

      return (
        <div className="flex gap-2">
          {groups.map((group) => (
            <Badge key={group}>{group}</Badge>
          ))}
        </div>
      );
    },
    header: 'Groupes',
    accessorKey: 'groups',
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserDropdownMenu loggedInUser={loggedInUser} user={row.original} />,
  },
];
