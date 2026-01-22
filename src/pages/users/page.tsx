import PaginationButtons from "@/components/pagination-buttons";
import useQueryParam from "@/hooks/use-query-param";
import { supabase } from "@/supabase/client";
import type { Profile } from "@/supabase/global.types";
import { useCallback, useEffect, useState } from "react";
import UserTable from "./ui/table";
import { TypographyH2 } from "@/components/ui/typography";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupButton } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, UserPlus } from "lucide-react";
import { createUserSchema } from "@/shared/schemas/user.schema";
import { FunctionsHttpError } from "@supabase/supabase-js";
import useFieldErrors from "@/hooks/use-field-errors";

export default function UsersPage() {
  const { fieldErrors, handleSetFieldErrors, emptyFieldErrors } = useFieldErrors()
  const [userProfiles, setUserProfiles] = useState<Profile[]>([])
  const [open, setOpen] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [passwordInputType, setPasswordInputType] = useState<'text' | 'password'>('password')

  const { searchParams, setParam } = useQueryParam({
    page: '1',
    limit: '5',
    // sort: 'date',
    // ascending: 'true'
  })

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  // const sort = searchParams.get('sort') ?? ''
  // const ascending = searchParams.get('ascending') === 'true' ? true : false

  const [totalPage, setTotalPage] = useState<number>()

  // const getUsers = useCallback(
  //   async ({ page, limit }: { page?: number, limit?: number } = {}) => {
  //     // const query = supabase.from
  //     const { data: { users }, error } = await supabase.auth.admin.listUsers()
  //     if (error) console.error(error)
  //     console.log(users)
  //   }, [])

  const getUserProfiles = useCallback(
    async ({
      page,
      limit,
      // sort,
      // ascending
    }: {
      page?: number,
      limit?: number,
      // sort?: string,
      // ascending?: boolean
    } = {}
    ) => {
      const query = supabase
        .from('profiles')
        .select('*', {
          count: 'exact'
        })

      // if (sort) {
      //   query.order(sort, { ascending })
      // }

      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ total_hours: string }>>()
      if (error) throw new Error(error.message)
      return { data, count }

    }, [])

  useEffect(() => {
    getUserProfiles({ page, limit }).then(({ data, count }) => {
      setUserProfiles(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    })
  }, [getUserProfiles, page, limit])

  async function handleCreateUser() {
    emptyFieldErrors()

    const validate = createUserSchema.safeParse({ email, password, firstName, lastName })

    if (!validate.success) return handleSetFieldErrors(validate.error)

    const { data, error } = await supabase.functions.invoke('create-user', {
      body: {
        user: validate.data
      }
    })

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const response = await error.context.json()
        toast.error(response.error)
      } else {
        toast.error(error.message)
      }
      return
    }

    toast.success(`User ${data.user.email} successfully created.`)
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setOpen(false)
  }


  return (
    <>
      <div className="flex justify-between items-center">
        <header>
          <TypographyH2>User List</TypographyH2>
        </header>

        <div className="flex items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus />
                Add User
              </Button>
            </DialogTrigger>
            <form
              id="create_user"
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateUser()
              }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                  <DialogDescription>
                    Create a user account.
                    Provide basic user information and authentication information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <FieldError errors={fieldErrors.email} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={passwordInputType}
                        name="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <InputGroupButton
                        onClick={() => {
                          setPasswordInputType(() => {
                            if (passwordInputType === 'password') {
                              return 'text'
                            } else {
                              return 'password'
                            }
                          })
                        }}
                      >
                        {passwordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroup>
                    <FieldError errors={fieldErrors.password} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Juan"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                    <FieldError errors={fieldErrors.firstName} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Dela Cruz"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                    <FieldError errors={fieldErrors.lastName} />
                  </Field>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button form="create_user">
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>

      <div className="mt-2">
        <UserTable userProfiles={userProfiles} />

        <PaginationButtons
          page={page}
          totalPage={totalPage}
          onPageChange={(newPage) => {
            setParam('page', newPage.toString())
          }}
        />
      </div>
    </>
  )
}
