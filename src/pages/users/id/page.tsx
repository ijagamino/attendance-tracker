import PaginationButtons from '@/components/pagination-buttons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TypographyH2, TypographyH4 } from '@/components/ui/typography'
import useQueryParam from '@/hooks/use-query-param.ts'
import UserAttendanceRecordTable from '@/pages/users/id/ui/table.tsx'
import { ArrowDown, ArrowUp, FileSpreadsheetIcon, Frown, MoreHorizontal, Smile, TimerOff } from 'lucide-react'
import { useParams } from 'react-router'
import { UserProfileCard } from './ui/card'
import useUserProfile from './hooks/use-user-profile'
import useUserProfileSummary from './hooks/use-user-profile-summary'
import useUserAttendanceRecords from './hooks/use-user-attendance-records'
import markUserAbsent from './actions/mark-user-absent'
import exportAttendanceRecords from './actions/export-attendance-records'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/supabase/client'
import type { Role } from '@/supabase/global.types'
import { toast } from 'sonner'
import _ from 'lodash'

export default function UserIdPage() {
  const { id } = useParams()
  const { searchParams, setParam } = useQueryParam({
    page: '1',
    limit: '5',
    sort: 'date',
    ascending: 'true'
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRole, setSelectedRole] = useState<Role | undefined>()

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  const sort = searchParams.get('sort') ?? ''
  const ascending = searchParams.get('ascending') === 'true' ? true : false

  const { profile, toggleActive, refetch: refetchUserProfile } = useUserProfile(id)
  const { userAttendanceRecords, setUserAttendanceRecords, getUserAttendanceRecords, totalPage } = useUserAttendanceRecords({ userId: id, page, limit })
  const { userProfileSummary, hours, minutes, seconds, refetch: refetchUserProfileSummary } = useUserProfileSummary(id)

  async function handleExport() {
    if (!id) return
    await exportAttendanceRecords({ userId: id, profile, getUserAttendanceRecords })
  }

  async function handleMarkAbsent() {
    if (!id) return

    setIsLoading(true)
    const data = await markUserAbsent(id)
    setIsLoading(false)

    if (data) {
      setUserAttendanceRecords(data)
      refetchUserProfileSummary()
    }
  }

  async function assignRole() {
    if (!id) return
    const { error } = await supabase
      .from('profiles')
      .update({ role: selectedRole })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
      return
    }
    refetchUserProfile()
  }

  return (
    <>
      <div className='flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <TypographyH2>{profile?.first_name}</TypographyH2>
          {profile?.role &&
            <Badge>{_.capitalize(profile.role)}</Badge>
          }
          {profile?.is_active
            ? <Badge>Active</Badge>
            : <Badge variant="destructive">Inactive</Badge>
          }
        </div>

        <ButtonGroup>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => { }}
              >
                <TimerOff />
                Mark as absent today
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>Are you sure you want to mark {profile?.first_name} as absent?</DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleMarkAbsent()}>
                  {isLoading &&
                    <Spinner />
                  }
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleActive()}>
                Set as {profile?.is_active ? 'inactive' : 'active'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                }}>
                <Dialog>
                  <DialogTrigger>
                    Change user role
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign role</DialogTitle>
                      <DialogDescription>You are about to change {profile?.first_name}'s role.</DialogDescription>
                    </DialogHeader>
                    <Select
                      onValueChange={(value) => setSelectedRole(value as Role)}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Assign role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => assignRole()}>
                        {isLoading &&
                          <Spinner />
                        }
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      <TypographyH2>Monthly summary</TypographyH2>
      <div className="grid my-2 grid-cols-3 gap-4">
        <UserProfileCard title="Total hours rendered">
          {!hours && !minutes && !seconds ? (
            <Frown className="mx-auto" size={64} />
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="col-span-1 row-span-2 font-extrabold text-7xl">
                {hours}H
              </span>
              <div className="flex flex-col">
                <span className="col-span-1 text-2xl font-bold text-center">
                  {minutes}M
                </span>
                <span className="col-span-1 text-2xl">{seconds}S</span>
              </div>
            </div>
          )}
        </UserProfileCard>
        <UserProfileCard title="Total lates">
          {!userProfileSummary?.total_lates || userProfileSummary.total_lates <= 0 ? (
            <Smile className="mx-auto" size={64} />
          ) : (
            <p className="font-extrabold text-center text-6xl">
              {userProfileSummary?.total_lates}
            </p>
          )}
        </UserProfileCard>
        <UserProfileCard title="Total absents">
          {!userProfileSummary?.total_absents || userProfileSummary.total_absents <= 0 ? (
            <Smile className="mx-auto" size={64} />
          ) : (
            <p className="font-extrabold text-center text-6xl">
              {userProfileSummary?.total_absents}
            </p>
          )}
        </UserProfileCard>
      </div>

      <div className='py-4 flex justify-between items-center'>
        <TypographyH4>Attendance Records</TypographyH4>
        <div className='gap-2 flex items-center'>
          <Button
            variant="outline"
            onClick={() => {
              setParam('sort', 'date')
              setParam('ascending', (!ascending).toString())
            }}
          >
            Sort by {" "}
            {sort}
            {ascending ?
              (<ArrowUp />) :
              (<ArrowDown />)
            }
          </Button>
          <Button onClick={() => {
            handleExport()
          }}>
            <FileSpreadsheetIcon />
            Export XLSX
          </Button>
        </div>
      </div >

      <UserAttendanceRecordTable
        userAttendanceRecords={userAttendanceRecords}
        setUserAttendanceRecords={setUserAttendanceRecords}
        onUserAttendanceRecordUpdate={refetchUserProfileSummary}
      />

      <PaginationButtons
        page={page}
        totalPage={totalPage}
        onPageChange={(newPage) => {
          setParam('page', newPage.toString())
        }}
      />
    </>
  )
}
