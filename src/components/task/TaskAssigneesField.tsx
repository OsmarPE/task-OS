"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "@/actions/member.actions";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

interface Props {
  projectId: string;
  value: string[];
  onChange: (ids: string[]) => void;
}

export default function TaskAssigneesField({ projectId, value, onChange }: Props) {
  const { data } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });

  const toggle = (clerkUserId: string, checked: boolean) => {
    onChange(checked ? [...value, clerkUserId] : value.filter((id) => id !== clerkUserId));
  };

  if (!projectId) return null;

  return (
    <div className="grid gap-2">
      <Label>Asignados</Label>
      <div className="grid gap-2 rounded-md border p-3">
        {data?.length ? (
          data.map((member) => (
            <label key={member.clerkUserId} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={value.includes(member.clerkUserId)}
                onCheckedChange={(checked) => toggle(member.clerkUserId, Boolean(checked))}
              />
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {member.name}
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-400">No hay miembros en este proyecto todavía</p>
        )}
      </div>
    </div>
  );
}
