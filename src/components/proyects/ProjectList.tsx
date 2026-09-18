import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProjectList({ children }: Props) {
  return <div className="mt-8 md:mt-4 grid gap-6 grid-cols-4 md:grid-cols-3 sm:grid-cols-2">{children}</div>;
}
