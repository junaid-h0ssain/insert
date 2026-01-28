'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div>
      <Button>Click me</Button>
      <div>
        {tasks?.map((task) => (
          <div key={task._id} className="p-4 border-b">
            <h2 className="text-lg font-semibold">{task.text}</h2>
            <p className="text-amber-600">{`${task.isCompleted}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
