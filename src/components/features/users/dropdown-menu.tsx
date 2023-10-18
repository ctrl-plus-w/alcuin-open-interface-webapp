import { useState } from 'react';

import UpdateGroupsSheet from '@/components/modules/UpdateGroupsSheet';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { MoreHorizontal, Trash2Icon } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { useToast } from '@/ui/use-toast';

import { useUsers } from '@/context/UsersContext';

import { add, removeById } from '@/util/array.util';

interface IProps {
  user: Database.IProfile;
  loggedInUser: Database.IProfile;
}

const UserDropdownMenu = ({ user, loggedInUser }: IProps) => {
  const { session } = useAuth();

  const { toast, toastError } = useToast();
  const { setUsers } = useUsers();

  const [updateGroupsSheetOpened, setUpdateGroupsSheetOpened] = useState(false);

  const deleteUser = async () => {
    if (!session) return;

    try {
      setUsers(removeById(user));

      await axios.delete('/api/users/delete', {
        params: { id: user.id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      toast({ title: 'Success !', description: `L'utilisateur avec l'email ${user.email} a bien été supprimé.` });
    } catch (error) {
      toastError(error);
      setUsers(add(user));
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setUpdateGroupsSheetOpened(true)}>Modifier les groupes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateGroupsSheet
        loggedInUser={loggedInUser}
        user={user}
        opened={updateGroupsSheetOpened}
        setOpened={setUpdateGroupsSheetOpened}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="h-8 w-8 p-0 ml-2">
            <span className="sr-only">Delete User</span>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes vous sur?</DialogTitle>
            <DialogDescription>
              Cette action ne peut pas être annulée. L&apos;utilisateur sera supprimé définitivement.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={deleteUser} variant="destructive">
                Supprimer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDropdownMenu;
