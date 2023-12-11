import UserCard from '@/components/cards/UserCard'
import { fetchUsers } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

async function Page() {
  const user = await currentUser()
  if(!user) redirect('/onboarding')

  const result = await fetchUsers({ 
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
  })


  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ):(
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default Page