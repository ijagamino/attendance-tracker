import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patch, post } from "@/lib/apiFetch";

export default function HomePage() {
  function submit(formData: FormData, type: "create" | "update") {
    const { username } = { username: formData.get("username") };
    if (type === "create") {
      post("attendance-records", { body: JSON.stringify({ username }) });
    }

    if (type === "update") {
      patch("attendance-records", { body: JSON.stringify({ username }) });
    }
    return;
  }

  return (
    <>
      <div className="max-w-sm mx-auto">
        <form className="flex flex-col gap-2">
          <Label htmlFor="username">Name</Label>
          <Input
            id="username"
            className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
            name="username"
            type="text"
          />

          <div className="flex space-x-2">
            <Button formAction={(formData) => submit(formData, "create")}>
              Time In
            </Button>
            <Button formAction={(formData) => submit(formData, "update")}>
              Time Out
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
