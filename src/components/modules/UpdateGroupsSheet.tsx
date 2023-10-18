import { useState } from 'react';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { ScrollArea } from '@/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/ui/sheet';
import { useToast } from '@/ui/use-toast';

import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UsersContext';

import useProfilesRepository from '@/hook/useProfilesRepository';

import { add, remove } from '@/util/array.util';

import GROUPS from '@/constant/Groups';

interface IProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;

  user: Database.IProfile;

  loggedInUser?: Database.IProfile;
}

const UpdateGroupsSheet = ({ opened, setOpened, user, loggedInUser }: IProps) => {
  const profilesRepository = useProfilesRepository();

  const { toastError, toast } = useToast();
  const { fetchUsers } = useUsers();
  const { session } = useAuth();

  const [groups, setGroups] = useState(user.groups);

  const updateUsers = async () => {
    if (!session) return;

    try {
      await profilesRepository.update(user.id, { groups });

      fetchUsers(loggedInUser);

      toast({
        title: 'Succès !',
        description: "Les groupes de l'utilisateur ont bien été modifiés.",
      });
    } catch (err) {
      toastError(err);
    }
  };

  const onCheckedChange = (group: string) => (checked: boolean) => {
    if (checked) setGroups(add(group));
    else setGroups(remove(group));
  };

  return (
    <Sheet open={opened} onOpenChange={setOpened}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier les groupes</SheetTitle>
          <SheetDescription>{user.email}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[50svh] my-4">
          <div className="flex flex-col gap-4">
            {GROUPS.map((group) => (
              <div className="flex gap-2 items-center cursor-pointer" key={group}>
                <Checkbox
                  checked={groups.includes(group)}
                  onCheckedChange={onCheckedChange(group)}
                  value="true"
                  id={group}
                />
                <Label htmlFor={group}>{group}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={updateUsers}>Modifier les groupes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateGroupsSheet;
