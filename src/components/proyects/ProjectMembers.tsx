"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import { addProjectMember, getProjectMembers, removeProjectMember } from "@/actions/member.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../Loading";

interface Props {
  projectId: string;
}

export default function ProjectMembers({ projectId }: Props) {
  const { userId } = useAuth();
  const client = useQueryClient();
  const [newMemberId, setNewMemberId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });

  const isOwner = data?.find((member) => member.isOwner)?.clerkUserId === userId;

  const { mutate: addMember, isPending: isAdding } = useMutation({
    mutationFn: () => addProjectMember(projectId, newMemberId.trim()),
    onSuccess: (message) => {
      toast.success(message);
      setNewMemberId("");
      client.invalidateQueries({ queryKey: ["projectMembers", projectId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: removeMember } = useMutation({
    mutationFn: (clerkUserId: string) => removeProjectMember(projectId, clerkUserId),
    onSuccess: (message) => {
      toast.success(message);
      client.invalidateQueries({ queryKey: ["projectMembers", projectId] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <Loading className="mt-4" />;

  return (
    <div className="mt-4 grid gap-4">
      <ul className="grid gap-3">
        {data?.map((member) => (
          <li key={member.clerkUserId} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                {member.isOwner ? <p className="text-xs text-gray-400">Dueño</p> : <p className="text-xs text-gray-400">Miembro/a</p>}
              </div>
            </div>
            {isOwner && !member.isOwner && (
              <Button variant="ghost" size="icon" onClick={() => removeMember(member.clerkUserId)}>
                <XIcon className="size-4" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className="flex gap-2">
          <Input
            placeholder="Clerk User ID de la persona a agregar"
            value={newMemberId}
            onChange={(event) => setNewMemberId(event.target.value)}
          />
          <Button type="button" disabled={!newMemberId.trim() || isAdding} onClick={() => addMember()}>
            Agregar
          </Button>
        </div>
      )}
    </div>
  );
}
