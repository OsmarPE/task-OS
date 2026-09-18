import { clerkClient } from "@clerk/nextjs/server";

export interface ClerkUserSummary {
  id: string;
  name: string;
  imageUrl: string;
}

export async function getClerkUsersByIds(ids: string[]): Promise<Map<string, ClerkUserSummary>> {
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length === 0) return new Map();

  const client = await clerkClient();
  const { data } = await client.users.getUserList({ userId: uniqueIds, limit: uniqueIds.length });

  return new Map(
    data.map((user) => [
      user.id,
      {
        id: user.id,
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.emailAddresses[0]?.emailAddress ||
          user.id,
        imageUrl: user.imageUrl,
      },
    ]),
  );
}

export async function getClerkUserById(id: string): Promise<ClerkUserSummary | null> {
  const map = await getClerkUsersByIds([id]);
  return map.get(id) ?? null;
}
