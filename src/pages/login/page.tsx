import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post } from "@/lib/authFetch";

export default function LoginPage() {
  async function submit(formData: FormData) {
    const { username, password } = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    await post("login", {
      body: JSON.stringify({ username, password }),
    });

    return;
  }
  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Enter your username and password to login
          </CardDescription>
        </CardHeader>

        <hr />

        <form className="flex flex-col gap-4">
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                name="username"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                name="password"
                type="text"
              />
            </div>
          </CardContent>

          <CardFooter className="grid grid-cols-1">
            <Button
              className="w-full"
              formAction={(formData) => submit(formData)}
            >
              Log In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
