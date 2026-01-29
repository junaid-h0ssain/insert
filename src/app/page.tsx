'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { use } from "react";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  return (
    <div>
      <Button onClick={() => createProject({ name: "New Project" })}>Click me</Button>
      <div>
        {projects?.map((project) => (
          <div key={project._id} className="p-4 border-b">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p>{project.ownerID}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
