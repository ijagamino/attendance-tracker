import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH1 } from "@/components/ui/typography";
import { patch, post } from "@/lib/apiFetch";

export default function HomePage() {
  async function submit(formData: FormData, type: "create" | "update") {
    const { username } = { username: formData.get("username") };
    if (type === "create") {
      await post("attendance-records", { body: JSON.stringify({ username }) });
    }

    if (type === "update") {
      await patch("attendance-records", { body: JSON.stringify({ username }) });
    }
    return;
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <TypographyH1>Attendance Tracker</TypographyH1>
          </CardTitle>
        </CardHeader>

        <hr />

        <form className="flex flex-col gap-2">
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                name="username"
                type="text"
              />
            </div>
          </CardContent>

          <CardFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button
              className="w-full"
              formAction={(formData) => submit(formData, "create")}
            >
              Time In
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              formAction={(formData) => submit(formData, "update")}
            >
              Time Out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
